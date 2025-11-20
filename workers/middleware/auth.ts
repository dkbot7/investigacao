/**
 * Authentication Middleware
 * Valida JWT do Firebase e verifica usuário no Supabase
 */

import { Context, Next } from 'hono'
import { Env } from '../index'

interface DecodedToken {
  uid: string
  email: string
  exp: number
}

/**
 * Middleware de autenticação
 * Valida token JWT do Firebase
 */
export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  try {
    const authHeader = c.req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json(
        {
          error: true,
          message: 'Token de autenticação não fornecido',
          code: 'AUTH_TOKEN_MISSING',
        },
        401
      )
    }

    const token = authHeader.substring(7) // Remove "Bearer "

    // Validar token com Firebase
    const decodedToken = await verifyFirebaseToken(token, c.env)

    if (!decodedToken) {
      return c.json(
        {
          error: true,
          message: 'Token inválido ou expirado',
          code: 'AUTH_TOKEN_INVALID',
        },
        401
      )
    }

    // Verificar se usuário existe no Supabase
    const user = await getUserFromSupabase(decodedToken.uid, c.env)

    if (!user) {
      return c.json(
        {
          error: true,
          message: 'Usuário não encontrado',
          code: 'USER_NOT_FOUND',
        },
        404
      )
    }

    // Adicionar dados do usuário ao contexto
    c.set('user', user)
    c.set('userId', user.id)
    c.set('firebaseUid', decodedToken.uid)

    // Log de auditoria (LGPD)
    await logAuditEvent(c, user.id, 'api_access')

    await next()
  } catch (error) {
    console.error('[AUTH] Error:', error)
    return c.json(
      {
        error: true,
        message: 'Erro na autenticação',
        code: 'AUTH_ERROR',
      },
      500
    )
  }
}

/**
 * Verifica token JWT do Firebase usando REST API
 * Implementação real usando Firebase Identity Toolkit
 */
async function verifyFirebaseToken(
  token: string,
  env: Env
): Promise<DecodedToken | null> {
  try {
    // Modo desenvolvimento: aceitar token mock
    if (env.ENVIRONMENT === 'development' && token === 'dev-token-123') {
      console.log('[AUTH] Development mode: accepting mock token')
      return {
        uid: 'dev-user-uid',
        email: 'dev@investigaree.com.br',
        exp: Date.now() + 3600000,
      }
    }

    // Verificar se credenciais do Firebase estão configuradas
    if (!env.FIREBASE_WEB_API_KEY) {
      console.warn('[AUTH] FIREBASE_WEB_API_KEY not configured')

      // Fallback para mock apenas em desenvolvimento
      if (env.ENVIRONMENT === 'development') {
        return {
          uid: 'mock-uid-' + Date.now(),
          email: 'mock@example.com',
          exp: Date.now() + 3600000,
        }
      }

      return null
    }

    // Validar token usando Firebase Identity Toolkit REST API
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${env.FIREBASE_WEB_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: token,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[AUTH] Firebase validation error:', errorData)
      return null
    }

    const data = await response.json()

    if (!data.users || data.users.length === 0) {
      console.warn('[AUTH] No user found for token')
      return null
    }

    const user = data.users[0]

    // Verificar se token está expirado
    const expiresAt = parseInt(user.validSince || '0') * 1000 + 3600000 // 1 hora
    if (Date.now() > expiresAt) {
      console.warn('[AUTH] Token expired')
      return null
    }

    return {
      uid: user.localId,
      email: user.email,
      exp: expiresAt,
    }
  } catch (error) {
    console.error('[AUTH] Firebase token verification error:', error)
    return null
  }
}

/**
 * Busca usuário no Supabase
 */
async function getUserFromSupabase(firebaseUid: string, env: Env) {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?firebase_uid=eq.${firebaseUid}&select=*`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.statusText}`)
    }

    const users = await response.json()
    return users[0] || null
  } catch (error) {
    console.error('[AUTH] Supabase user fetch error:', error)
    return null
  }
}

/**
 * Log de auditoria (LGPD compliance)
 */
async function logAuditEvent(c: Context<{ Bindings: Env }>, userId: string, action: string) {
  try {
    const ip = c.req.header('CF-Connecting-IP') || 'unknown'
    const userAgent = c.req.header('User-Agent') || 'unknown'

    await fetch(`${c.env.SUPABASE_URL}/rest/v1/audit_logs`, {
      method: 'POST',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        acao: action,
        ip_address: ip,
        user_agent: userAgent,
        metodo_http: c.req.method,
        endpoint: c.req.path,
        sucesso: true,
      }),
    })
  } catch (error) {
    // Não falhar a request se log falhar
    console.error('[AUDIT] Failed to log event:', error)
  }
}

/**
 * Middleware opcional para validar se usuário é admin
 */
export async function adminMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const user = c.get('user') as any

  if (!user || user.email !== 'contato@investigaree.com.br') {
    return c.json(
      {
        error: true,
        message: 'Acesso negado. Apenas administradores.',
        code: 'ADMIN_ONLY',
      },
      403
    )
  }

  await next()
}
