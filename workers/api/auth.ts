/**
 * Auth API Routes - User Registration & Sync
 * Creates Supabase user record after Firebase registration
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'
import { notifyNewUser } from '../services/notifications.service'

const app = new Hono<{ Bindings: Env }>()

// ============================================
// VALIDATION SCHEMAS
// ============================================

const registerSchema = z.object({
  firebase_uid: z.string().min(1, 'Firebase UID é obrigatório'),
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nome muito curto').optional(),
  phone: z.string().optional(),
})

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/auth/register
 * Create Supabase user after Firebase registration
 */
app.post('/register', async (c) => {
  try {
    const body = await c.req.json()
    const validated = registerSchema.parse(body)

    console.log('[AUTH] Registering user:', { email: validated.email })

    // Check if user already exists in Supabase
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ? OR email = ? LIMIT 1'
    )
      .bind(validated.firebase_uid, validated.email)
      .first()

    if (existingUser) {
      console.log('[AUTH] User already exists:', existingUser.id)
      return c.json(
        {
          success: true,
          user_id: existingUser.id,
          message: 'Usuário já cadastrado',
          existing: true,
        },
        200
      )
    }

    // Create new user in D1
    const userId = crypto.randomUUID()
    const now = new Date().toISOString()

    const result = await c.env.DB.prepare(
      `INSERT INTO users (id, firebase_uid, email, name, phone, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        userId,
        validated.firebase_uid,
        validated.email,
        validated.name || null,
        validated.phone || null,
        now,
        now
      )
      .run()

    if (!result.success) {
      console.error('[AUTH] Failed to create user:', result)
      throw new Error('Falha ao criar usuário')
    }

    console.log('[AUTH] User created successfully:', userId)

    // Notificar admins sobre novo cadastro (async, não bloqueia a resposta)
    c.executionCtx.waitUntil(
      notifyNewUser(c.env, {
        email: validated.email,
        name: validated.name,
        phone: validated.phone,
        created_at: now
      })
    )

    return c.json(
      {
        success: true,
        user_id: userId,
        message: 'Usuário criado com sucesso!',
      },
      201
    )
  } catch (error) {
    console.error('[AUTH] Error:', error)

    if (error instanceof z.ZodError) {
      return c.json(
        {
          error: true,
          message: 'Dados inválidos',
          details: error.errors,
        },
        400
      )
    }

    return c.json(
      {
        error: true,
        message: 'Erro ao processar registro',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

/**
 * POST /api/auth/sync
 * Sync Firebase user to D1 (idempotent)
 */
app.post('/sync', async (c) => {
  try {
    const body = await c.req.json()
    const validated = registerSchema.parse(body)

    // Try to find existing user
    const existing = await c.env.DB.prepare(
      'SELECT id, email FROM users WHERE firebase_uid = ? LIMIT 1'
    )
      .bind(validated.firebase_uid)
      .first()

    if (existing) {
      // Update email if changed
      if (existing.email !== validated.email) {
        await c.env.DB.prepare(
          'UPDATE users SET email = ?, updated_at = ? WHERE id = ?'
        )
          .bind(validated.email, new Date().toISOString(), existing.id)
          .run()
      }

      return c.json({
        success: true,
        user_id: existing.id,
        synced: true,
      })
    }

    // Create new user
    const userId = crypto.randomUUID()
    const now = new Date().toISOString()

    await c.env.DB.prepare(
      `INSERT INTO users (id, firebase_uid, email, name, phone, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        userId,
        validated.firebase_uid,
        validated.email,
        validated.name || null,
        validated.phone || null,
        now,
        now
      )
      .run()

    return c.json({
      success: true,
      user_id: userId,
      synced: true,
      created: true,
    })
  } catch (error) {
    console.error('[AUTH] Sync error:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao sincronizar usuário',
      },
      500
    )
  }
})

/**
 * GET /api/auth/me
 * Get current authenticated user info
 */
app.get('/me', async (c) => {
  try {
    // Get Firebase UID from Authorization header
    const authHeader = c.req.header('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: true, message: 'Não autorizado' }, 401)
    }

    const token = authHeader.replace('Bearer ', '')

    // Verify token with Firebase
    const verifyResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${c.env.FIREBASE_WEB_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      }
    )

    if (!verifyResponse.ok) {
      return c.json({ error: true, message: 'Token inválido' }, 401)
    }

    const verifyData = await verifyResponse.json()
    const firebaseUid = verifyData.users[0]?.localId

    if (!firebaseUid) {
      return c.json({ error: true, message: 'Usuário não encontrado' }, 404)
    }

    // Get user from D1
    const user = await c.env.DB.prepare(
      'SELECT id, firebase_uid, email, name, phone, created_at FROM users WHERE firebase_uid = ? LIMIT 1'
    )
      .bind(firebaseUid)
      .first()

    if (!user) {
      return c.json({ error: true, message: 'Usuário não encontrado no sistema' }, 404)
    }

    return c.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error('[AUTH] Error getting user:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao buscar usuário',
      },
      500
    )
  }
})

export default app
