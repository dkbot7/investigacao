/**
 * User API Routes
 * Gerenciamento de perfil do usuário
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// ============================================
// VALIDATION SCHEMAS
// ============================================

const updateProfileSchema = z.object({
  nome_completo: z.string().min(3, 'Nome muito curto').max(100).optional(),
  telefone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Telefone inválido').optional(),
  empresa: z.string().max(100).optional(),
  cargo: z.string().max(100).optional(),
  avatar_url: z.string().url('URL inválida').optional(),
})

const updateConsentSchema = z.object({
  lgpd_consent: z.boolean(),
  marketing_consent: z.boolean(),
  newsletter_consent: z.boolean(),
})

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/user/profile
 * Obter perfil do usuário autenticado
 */
app.get('/profile', async (c) => {
  try {
    const userId = c.get('userId') as string

    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=*`,
      {
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar perfil')
    }

    const users = await response.json()
    const user = users[0]

    if (!user) {
      return c.json(
        {
          error: true,
          message: 'Usuário não encontrado',
        },
        404
      )
    }

    // Remover dados sensíveis antes de retornar
    delete user.stripe_customer_id
    delete user.firebase_uid

    return c.json(user)
  } catch (error) {
    console.error('[USER] Error fetching profile:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao buscar perfil',
      },
      500
    )
  }
})

/**
 * PATCH /api/user/profile
 * Atualizar perfil do usuário
 */
app.patch('/profile', async (c) => {
  try {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const validated = updateProfileSchema.parse(body)

    // Preparar dados para atualização
    const updateData: any = {
      ...validated,
      updated_at: new Date().toISOString(),
    }

    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`,
      {
        method: 'PATCH',
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao atualizar perfil')
    }

    // Log audit para LGPD
    await logAuditEvent(userId, 'profile_updated', { fields: Object.keys(validated) }, c.env)

    return c.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
    })
  } catch (error) {
    console.error('[USER] Error updating profile:', error)

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
        message: 'Erro ao atualizar perfil',
      },
      500
    )
  }
})

/**
 * PATCH /api/user/consents
 * Atualizar consentimentos LGPD
 */
app.patch('/consents', async (c) => {
  try {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const validated = updateConsentSchema.parse(body)

    // Registrar novo consentimento na tabela de auditoria
    await fetch(`${c.env.SUPABASE_URL}/rest/v1/lgpd_consents`, {
      method: 'POST',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        consent_type: 'general',
        consent_version: '1.0',
        consent_given: validated.lgpd_consent,
        ip_address: c.req.header('CF-Connecting-IP') || 'unknown',
        user_agent: c.req.header('User-Agent') || 'unknown',
      }),
    })

    // Atualizar flags de consentimento no perfil
    await fetch(`${c.env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...validated,
        lgpd_consent_date: validated.lgpd_consent ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      }),
    })

    return c.json({
      success: true,
      message: 'Consentimentos atualizados',
    })
  } catch (error) {
    console.error('[USER] Error updating consents:', error)

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
        message: 'Erro ao atualizar consentimentos',
      },
      500
    )
  }
})

/**
 * GET /api/user/stats
 * Obter estatísticas do usuário (relatórios, pagamentos)
 */
app.get('/stats', async (c) => {
  try {
    const userId = c.get('userId') as string

    // Buscar contadores
    const [reportsResponse, paymentsResponse] = await Promise.all([
      fetch(
        `${c.env.SUPABASE_URL}/rest/v1/reports?user_id=eq.${userId}&select=id,status,created_at`,
        {
          headers: {
            apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      ),
      fetch(
        `${c.env.SUPABASE_URL}/rest/v1/payments?user_id=eq.${userId}&select=id,amount,status,created_at`,
        {
          headers: {
            apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      ),
    ])

    const reports = await reportsResponse.json()
    const payments = await paymentsResponse.json()

    // Calcular estatísticas
    const stats = {
      reports: {
        total: reports.length,
        pendente: reports.filter((r: any) => r.status === 'pendente').length,
        em_andamento: reports.filter((r: any) => r.status === 'em_andamento').length,
        concluido: reports.filter((r: any) => r.status === 'concluido').length,
      },
      payments: {
        total: payments.length,
        total_spent: payments
          .filter((p: any) => p.status === 'succeeded')
          .reduce((sum: number, p: any) => sum + p.amount, 0),
        pending: payments.filter((p: any) => p.status === 'pending').length,
        succeeded: payments.filter((p: any) => p.status === 'succeeded').length,
        failed: payments.filter((p: any) => p.status === 'failed').length,
      },
      account: {
        created_at: reports[0]?.created_at || null,
        last_activity: reports[0]?.created_at || payments[0]?.created_at || null,
      },
    }

    return c.json(stats)
  } catch (error) {
    console.error('[USER] Error fetching stats:', error)
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
 * GET /api/user/activity
 * Obter histórico de atividades (audit log)
 */
app.get('/activity', async (c) => {
  try {
    const userId = c.get('userId') as string
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = parseInt(c.req.query('offset') || '0')

    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/audit_logs?user_id=eq.${userId}&select=id,action,details,ip_address,created_at&order=created_at.desc&limit=${limit}&offset=${offset}`,
      {
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar atividades')
    }

    const activities = await response.json()

    return c.json({
      activities,
      pagination: {
        limit,
        offset,
        total: activities.length,
      },
    })
  } catch (error) {
    console.error('[USER] Error fetching activity:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao buscar atividades',
      },
      500
    )
  }
})

/**
 * DELETE /api/user/avatar
 * Remover avatar do usuário
 */
app.delete('/avatar', async (c) => {
  try {
    const userId = c.get('userId') as string

    // TODO: Deletar arquivo do Cloudflare R2 / Storage
    // const avatarUrl = user.avatar_url
    // await deleteFromR2(avatarUrl, c.env)

    await fetch(`${c.env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        avatar_url: null,
        updated_at: new Date().toISOString(),
      }),
    })

    await logAuditEvent(userId, 'avatar_deleted', {}, c.env)

    return c.json({
      success: true,
      message: 'Avatar removido',
    })
  } catch (error) {
    console.error('[USER] Error deleting avatar:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao remover avatar',
      },
      500
    )
  }
})

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Registrar evento de auditoria para LGPD
 */
async function logAuditEvent(
  userId: string,
  action: string,
  details: any,
  env: Env
) {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/audit_logs`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        action,
        details,
        ip_address: 'worker',
        created_at: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('[USER] Error logging audit event:', error)
  }
}

export default app
