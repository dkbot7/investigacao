/**
 * Leads API Routes
 * Captação de leads via landing page
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// ============================================
// VALIDATION SCHEMAS
// ============================================

const leadSchema = z.object({
  firebase_uid: z.string().min(1, 'Firebase UID é obrigatório'),
  name: z.string().min(2, 'Nome muito curto').optional(),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  consent: z.boolean().default(true),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
})

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/leads
 * Criar novo lead (landing page)
 */
app.post('/', async (c) => {
  try {
    // Parse e validar body
    const body = await c.req.json()
    const validated = leadSchema.parse(body)

    // Verificar se lead já existe (por email ou firebase_uid)
    const existingLead = await checkExistingLead(validated.firebase_uid, validated.email, c.env)

    if (existingLead) {
      return c.json(
        {
          success: true,
          lead_id: existingLead.id,
          message: 'Lead já cadastrado!',
          existing: true,
        },
        200
      )
    }

    // Criar novo lead
    const leadData = {
      firebase_uid: validated.firebase_uid,
      name: validated.name || null,
      email: validated.email,
      phone: validated.phone || null,
      origin: 'landing_page',
      consent: validated.consent,
    }

    const lead = await createLead(leadData, c.env)

    if (!lead) {
      throw new Error('Falha ao criar lead')
    }

    return c.json(
      {
        success: true,
        lead_id: lead.id,
        message: 'Lead cadastrado com sucesso!',
      },
      201
    )
  } catch (error) {
    console.error('[LEADS] Error:', error)

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
        message: 'Erro ao processar cadastro',
      },
      500
    )
  }
})

/**
 * GET /api/leads/:id
 * Obter lead por ID (apenas para debug/admin)
 */
app.get('/:id', async (c) => {
  try {
    const leadId = c.req.param('id')

    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/leads?id=eq.${leadId}&select=*`,
      {
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar lead')
    }

    const leads = await response.json()
    const lead = leads[0]

    if (!lead) {
      return c.json(
        {
          error: true,
          message: 'Lead não encontrado',
        },
        404
      )
    }

    return c.json(lead)
  } catch (error) {
    console.error('[LEADS] Error:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao buscar lead',
      },
      500
    )
  }
})

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verificar se lead já existe
 */
async function checkExistingLead(firebaseUid: string, email: string, env: Env) {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/leads?or=(firebase_uid.eq.${firebaseUid},email.eq.${email})&select=id`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const leads = await response.json()
    return leads[0] || null
  } catch (error) {
    console.error('[LEADS] Error checking existing:', error)
    return null
  }
}

/**
 * Criar novo lead
 */
async function createLead(data: any, env: Env) {
  try {
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[LEADS] Supabase error:', error)
      return null
    }

    const leads = await response.json()
    return leads[0]
  } catch (error) {
    console.error('[LEADS] Error creating:', error)
    return null
  }
}

export default app
