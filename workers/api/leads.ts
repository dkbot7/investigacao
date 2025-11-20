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
  whatsapp: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'WhatsApp inválido'),
  nome_empresa: z.string().min(2, 'Nome da empresa muito curto').optional(),
  cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido').optional(),
  cpf_socio: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido').optional(),
  nome_socio: z.string().min(2, 'Nome do sócio muito curto').optional(),
  email: z.string().email('Email inválido').optional(),
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

    // Normalizar WhatsApp (remover caracteres especiais)
    const whatsappNormalized = validated.whatsapp.replace(/\D/g, '')

    // Verificar se lead já existe (por WhatsApp)
    const existingLead = await checkExistingLead(whatsappNormalized, c.env)

    if (existingLead) {
      // Se já existe, incrementar submit_count
      await incrementSubmitCount(existingLead.id, c.env)

      return c.json(
        {
          success: true,
          lead_id: existingLead.id,
          message: 'Você já está cadastrado em nossa base!',
          existing: true,
        },
        200
      )
    }

    // Obter IP e User Agent
    const ip = c.req.header('CF-Connecting-IP') || 'unknown'
    const userAgent = c.req.header('User-Agent') || 'unknown'

    // Criar novo lead
    const leadData = {
      whatsapp: whatsappNormalized,
      nome_empresa: validated.nome_empresa || null,
      cnpj: validated.cnpj || null,
      cpf_socio: validated.cpf_socio || null,
      nome_socio: validated.nome_socio || null,
      email: validated.email || null,
      fonte_captacao: 'landing',
      status: 'novo',
      utm_source: validated.utm_source || null,
      utm_medium: validated.utm_medium || null,
      utm_campaign: validated.utm_campaign || null,
      ip_address: ip,
      user_agent: userAgent,
    }

    const lead = await createLead(leadData, c.env)

    if (!lead) {
      throw new Error('Falha ao criar lead')
    }

    // TODO: Enviar email de boas-vindas
    // await sendWelcomeEmail(lead.email, lead.nome_socio || 'Investidor')

    // TODO: Notificar no Slack/Discord
    // await notifyNewLead(lead)

    return c.json(
      {
        success: true,
        lead_id: lead.id,
        message: 'Lead cadastrado com sucesso!',
        next_steps: 'Em breve, nosso chatbot entrará em contato via WhatsApp',
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
async function checkExistingLead(whatsapp: string, env: Env) {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/leads?whatsapp=eq.${whatsapp}&select=id,status,submit_count`,
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
 * Incrementar contador de submissões
 */
async function incrementSubmitCount(leadId: string, env: Env) {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/leads?id=eq.${leadId}`, {
      method: 'PATCH',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        submit_count: 'submit_count + 1', // Incrementar usando expressão SQL
        updated_at: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('[LEADS] Error incrementing count:', error)
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
