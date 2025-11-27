/**
 * Leads API Routes - D1 Database
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

// Schema para leads do WhatsApp (mais simples)
const whatsappLeadSchema = z.object({
  nome: z.string().min(2, 'Nome muito curto'),
  contato: z.string().min(5, 'Contato inválido'), // Email ou telefone
  mensagem: z.string().optional(),
  origem: z.string().optional(),
  pagina: z.string().optional(),
})

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/leads/whatsapp
 * Criar lead via modal do WhatsApp (simplificado)
 */
app.post('/whatsapp', async (c) => {
  try {
    const body = await c.req.json()
    const validated = whatsappLeadSchema.parse(body)

    console.log('[LEADS/WHATSAPP] Creating lead:', { nome: validated.nome, origem: validated.origem })

    // Verificar se lead já existe pelo contato
    const existing = await c.env.DB.prepare(
      'SELECT id FROM whatsapp_leads WHERE contato = ? LIMIT 1'
    )
      .bind(validated.contato)
      .first()

    if (existing) {
      // Atualizar último contato
      await c.env.DB.prepare(
        `UPDATE whatsapp_leads SET
          nome = ?,
          mensagem = ?,
          origem = ?,
          pagina = ?,
          updated_at = datetime('now'),
          total_contatos = total_contatos + 1
         WHERE id = ?`
      )
        .bind(
          validated.nome,
          validated.mensagem || null,
          validated.origem || 'whatsapp',
          validated.pagina || '/',
          existing.id
        )
        .run()

      return c.json({ success: true, lead_id: existing.id, existing: true }, 200)
    }

    // Criar novo lead
    const id = crypto.randomUUID()
    await c.env.DB.prepare(
      `INSERT INTO whatsapp_leads (id, nome, contato, mensagem, origem, pagina, created_at, updated_at, total_contatos)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), 1)`
    )
      .bind(
        id,
        validated.nome,
        validated.contato,
        validated.mensagem || null,
        validated.origem || 'whatsapp',
        validated.pagina || '/'
      )
      .run()

    console.log('[LEADS/WHATSAPP] Lead created:', id)

    return c.json({ success: true, lead_id: id }, 201)
  } catch (error) {
    console.error('[LEADS/WHATSAPP] Error:', error)

    if (error instanceof z.ZodError) {
      return c.json({ error: true, message: 'Dados inválidos', details: error.errors }, 400)
    }

    return c.json({ error: true, message: 'Erro ao processar' }, 500)
  }
})

/**
 * GET /api/leads/whatsapp
 * Listar leads do WhatsApp
 */
app.get('/whatsapp', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT * FROM whatsapp_leads ORDER BY updated_at DESC LIMIT 100'
    ).all()

    return c.json({ success: true, leads: results, count: results.length })
  } catch (error) {
    console.error('[LEADS/WHATSAPP] Error listing:', error)
    return c.json({ error: true, message: 'Erro ao listar leads' }, 500)
  }
})

/**
 * POST /api/leads
 * Criar novo lead (landing page)
 */
app.post('/', async (c) => {
  try {
    // Parse e validar body
    const body = await c.req.json()
    const validated = leadSchema.parse(body)

    console.log('[LEADS] Creating lead:', { email: validated.email })

    // Verificar se lead já existe
    const existing = await c.env.DB.prepare(
      'SELECT id FROM leads WHERE firebase_uid = ? OR email = ? LIMIT 1'
    )
      .bind(validated.firebase_uid, validated.email)
      .first()

    if (existing) {
      console.log('[LEADS] Lead already exists:', existing.id)
      return c.json(
        {
          success: true,
          lead_id: existing.id,
          message: 'Lead já cadastrado!',
          existing: true,
        },
        200
      )
    }

    // Criar novo lead
    const id = crypto.randomUUID()
    const result = await c.env.DB.prepare(
      `INSERT INTO leads (id, firebase_uid, name, email, phone, origin, consent, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))`
    )
      .bind(
        id,
        validated.firebase_uid,
        validated.name || null,
        validated.email,
        validated.phone || null,
        'landing_page',
        validated.consent ? 1 : 0
      )
      .run()

    if (!result.success) {
      console.error('[LEADS] Failed to insert:', result)
      throw new Error('Falha ao criar lead')
    }

    console.log('[LEADS] Lead created successfully:', id)

    return c.json(
      {
        success: true,
        lead_id: id,
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
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

/**
 * GET /api/leads
 * Listar todos os leads (admin)
 */
app.get('/', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      'SELECT id, firebase_uid, name, email, phone, origin, created_at FROM leads ORDER BY created_at DESC LIMIT 100'
    ).all()

    return c.json({
      success: true,
      leads: results,
      count: results.length,
    })
  } catch (error) {
    console.error('[LEADS] Error listing:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao listar leads',
      },
      500
    )
  }
})

/**
 * GET /api/leads/stats
 * Estatísticas de leads
 * IMPORTANTE: Deve vir ANTES da rota /:id para não ser capturado como parâmetro
 */
app.get('/stats', async (c) => {
  try {
    const total = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM leads'
    ).first()

    const today = await c.env.DB.prepare(
      "SELECT COUNT(*) as count FROM leads WHERE date(created_at) = date('now')"
    ).first()

    return c.json({
      success: true,
      stats: {
        total: total?.count || 0,
        today: today?.count || 0,
      },
    })
  } catch (error) {
    console.error('[LEADS] Error getting stats:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao buscar estatísticas',
      },
      500
    )
  }
})

/**
 * GET /api/leads/:id
 * Obter lead por ID
 */
app.get('/:id', async (c) => {
  try {
    const leadId = c.req.param('id')

    const lead = await c.env.DB.prepare(
      'SELECT * FROM leads WHERE id = ? LIMIT 1'
    )
      .bind(leadId)
      .first()

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
    console.error('[LEADS] Error getting lead:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao buscar lead',
      },
      500
    )
  }
})

export default app
