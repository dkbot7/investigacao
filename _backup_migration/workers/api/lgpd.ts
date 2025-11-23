/**
 * LGPD API Routes
 * Direitos dos titulares de dados (LGPD Art. 18)
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'

const app = new Hono<{ Bindings: Env }>()

// ============================================
// VALIDATION SCHEMAS
// ============================================

const dataRequestSchema = z.object({
  request_type: z.enum(['export', 'delete', 'anonymize', 'rectify']),
  reason: z.string().min(10, 'Motivo muito curto').max(500).optional(),
})

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/lgpd/request
 * Solicitar acesso, exportação, exclusão ou anonimização de dados
 */
app.post('/request', async (c) => {
  try {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const validated = dataRequestSchema.parse(body)

    // Verificar se já existe request pendente
    const existingRequest = await checkPendingRequest(userId, validated.request_type, c.env)

    if (existingRequest) {
      return c.json(
        {
          error: true,
          message: 'Já existe uma solicitação pendente deste tipo',
          request_id: existingRequest.id,
          status: existingRequest.status,
        },
        409
      )
    }

    // Criar solicitação
    const requestData = {
      user_id: userId,
      request_type: validated.request_type,
      reason: validated.reason || null,
      status: 'pending',
      ip_address: c.req.header('CF-Connecting-IP') || 'unknown',
      user_agent: c.req.header('User-Agent') || 'unknown',
    }

    const response = await fetch(`${c.env.SUPABASE_URL}/rest/v1/lgpd_requests`, {
      method: 'POST',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error('Erro ao criar solicitação')
    }

    const requests = await response.json()
    const request = requests[0]

    // Log audit
    await logAuditEvent(
      userId,
      `lgpd_request_${validated.request_type}`,
      { request_id: request.id },
      c.env
    )

    // TODO: Enviar email de confirmação
    // await sendLGPDRequestEmail(userId, validated.request_type, c.env)

    // TODO: Notificar administrador (Slack/Discord)
    // await notifyAdminLGPDRequest(request, c.env)

    // Processar requests automatizados
    if (validated.request_type === 'export') {
      // Iniciar processamento de exportação
      await processExportRequest(request.id, userId, c.env)
    }

    return c.json(
      {
        success: true,
        request_id: request.id,
        message: 'Solicitação registrada com sucesso',
        status: 'pending',
        estimated_completion: getEstimatedCompletion(validated.request_type),
      },
      201
    )
  } catch (error) {
    console.error('[LGPD] Error creating request:', error)

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
        message: 'Erro ao processar solicitação',
      },
      500
    )
  }
})

/**
 * GET /api/lgpd/requests
 * Listar solicitações LGPD do usuário
 */
app.get('/requests', async (c) => {
  try {
    const userId = c.get('userId') as string

    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/lgpd_requests?user_id=eq.${userId}&select=*&order=created_at.desc`,
      {
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar solicitações')
    }

    const requests = await response.json()

    return c.json({
      requests,
      total: requests.length,
    })
  } catch (error) {
    console.error('[LGPD] Error listing requests:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao listar solicitações',
      },
      500
    )
  }
})

/**
 * GET /api/lgpd/export
 * Exportar todos os dados do usuário (LGPD Art. 18, II)
 */
app.get('/export', async (c) => {
  try {
    const userId = c.get('userId') as string

    // Buscar todos os dados do usuário
    const [user, reports, payments, conversations, consents, auditLogs] = await Promise.all([
      fetchUserData(userId, c.env),
      fetchUserReports(userId, c.env),
      fetchUserPayments(userId, c.env),
      fetchUserConversations(userId, c.env),
      fetchUserConsents(userId, c.env),
      fetchUserAuditLogs(userId, c.env),
    ])

    const exportData = {
      export_date: new Date().toISOString(),
      user_id: userId,
      format_version: '1.0',
      data: {
        profile: user,
        reports: reports,
        payments: payments,
        chatbot_conversations: conversations,
        lgpd_consents: consents,
        audit_logs: auditLogs,
      },
      metadata: {
        total_reports: reports.length,
        total_payments: payments.length,
        total_conversations: conversations.length,
        account_created_at: user?.created_at,
      },
    }

    // Log audit
    await logAuditEvent(userId, 'data_exported', { format: 'json' }, c.env)

    // Retornar JSON para download
    return c.json(exportData, 200, {
      'Content-Disposition': `attachment; filename="investigaree-data-${userId}-${Date.now()}.json"`,
    })
  } catch (error) {
    console.error('[LGPD] Error exporting data:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao exportar dados',
      },
      500
    )
  }
})

/**
 * POST /api/lgpd/anonymize
 * Solicitar anonimização de dados (manter registros mas remover PII)
 */
app.post('/anonymize', async (c) => {
  try {
    const userId = c.get('userId') as string

    // Verificar se usuário tem relatórios ativos ou pagamentos pendentes
    const hasActiveData = await checkActiveData(userId, c.env)

    if (hasActiveData) {
      return c.json(
        {
          error: true,
          message:
            'Não é possível anonimizar dados enquanto houver relatórios ativos ou pagamentos pendentes',
          code: 'ACTIVE_DATA_EXISTS',
        },
        409
      )
    }

    // Anonimizar dados pessoais mantendo estrutura
    const anonymizedData = {
      nome_completo: `Usuario_${userId.substring(0, 8)}`,
      email: `anonimizado_${userId.substring(0, 8)}@example.com`,
      telefone: null,
      empresa: null,
      cargo: null,
      avatar_url: null,
      anonymized_at: new Date().toISOString(),
    }

    await fetch(`${c.env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(anonymizedData),
    })

    // Log audit
    await logAuditEvent(userId, 'data_anonymized', {}, c.env)

    // TODO: Enviar email de confirmação
    // await sendAnonymizationConfirmationEmail(userId, c.env)

    return c.json({
      success: true,
      message: 'Dados anonimizados com sucesso',
      anonymized_at: anonymizedData.anonymized_at,
    })
  } catch (error) {
    console.error('[LGPD] Error anonymizing data:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao anonimizar dados',
      },
      500
    )
  }
})

/**
 * DELETE /api/lgpd/delete-account
 * Solicitar exclusão completa da conta e dados (LGPD Art. 18, VI)
 */
app.delete('/delete-account', async (c) => {
  try {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const confirmToken = body.confirm_token

    // Exigir confirmação explícita
    if (confirmToken !== 'DELETE_MY_ACCOUNT') {
      return c.json(
        {
          error: true,
          message: 'Confirmação inválida. Use "DELETE_MY_ACCOUNT" para confirmar.',
        },
        400
      )
    }

    // Verificar pendências
    const hasPendingPayments = await checkPendingPayments(userId, c.env)

    if (hasPendingPayments) {
      return c.json(
        {
          error: true,
          message: 'Existem pagamentos pendentes. Resolva-os antes de deletar a conta.',
          code: 'PENDING_PAYMENTS',
        },
        409
      )
    }

    // Criar solicitação de exclusão (processamento manual por segurança)
    await fetch(`${c.env.SUPABASE_URL}/rest/v1/lgpd_requests`, {
      method: 'POST',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        request_type: 'delete',
        status: 'pending',
        reason: 'User requested account deletion',
      }),
    })

    // Desativar conta imediatamente
    await fetch(`${c.env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_active: false,
        deletion_requested_at: new Date().toISOString(),
      }),
    })

    // Log audit final
    await logAuditEvent(userId, 'account_deletion_requested', {}, c.env)

    // TODO: Enviar email de confirmação com prazo de 30 dias
    // await sendDeletionRequestEmail(userId, c.env)

    // TODO: Notificar admin para revisão manual
    // await notifyAdminDeletionRequest(userId, c.env)

    return c.json({
      success: true,
      message:
        'Solicitação de exclusão registrada. Sua conta será desativada imediatamente e deletada em 30 dias.',
      deletion_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
  } catch (error) {
    console.error('[LGPD] Error deleting account:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao processar exclusão',
      },
      500
    )
  }
})

/**
 * GET /api/lgpd/consents
 * Obter histórico de consentimentos
 */
app.get('/consents', async (c) => {
  try {
    const userId = c.get('userId') as string

    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/lgpd_consents?user_id=eq.${userId}&select=*&order=created_at.desc`,
      {
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar consentimentos')
    }

    const consents = await response.json()

    return c.json({
      consents,
      total: consents.length,
    })
  } catch (error) {
    console.error('[LGPD] Error listing consents:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao listar consentimentos',
      },
      500
    )
  }
})

// ============================================
// HELPER FUNCTIONS
// ============================================

async function checkPendingRequest(
  userId: string,
  requestType: string,
  env: Env
): Promise<any> {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/lgpd_requests?user_id=eq.${userId}&request_type=eq.${requestType}&status=eq.pending&select=*`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    const requests = await response.json()
    return requests[0] || null
  } catch (error) {
    console.error('[LGPD] Error checking pending request:', error)
    return null
  }
}

async function logAuditEvent(userId: string, action: string, details: any, env: Env) {
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
    console.error('[LGPD] Error logging audit event:', error)
  }
}

function getEstimatedCompletion(requestType: string): string {
  const estimates: Record<string, number> = {
    export: 24, // 24 horas
    delete: 720, // 30 dias (em horas)
    anonymize: 72, // 3 dias
    rectify: 48, // 2 dias
  }

  const hours = estimates[requestType] || 72
  const completionDate = new Date(Date.now() + hours * 60 * 60 * 1000)
  return completionDate.toISOString()
}

async function processExportRequest(requestId: string, userId: string, env: Env) {
  try {
    // TODO: Implementar processamento assíncrono via Queue
    // Para MVP, pode ser síncrono

    // Marcar request como processada
    await fetch(`${env.SUPABASE_URL}/rest/v1/lgpd_requests?id=eq.${requestId}`, {
      method: 'PATCH',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'completed',
        processed_at: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('[LGPD] Error processing export:', error)
  }
}

async function checkActiveData(userId: string, env: Env): Promise<boolean> {
  try {
    const [reportsRes, paymentsRes] = await Promise.all([
      fetch(
        `${env.SUPABASE_URL}/rest/v1/reports?user_id=eq.${userId}&status=in.("pendente","em_andamento")&select=id`,
        {
          headers: {
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      ),
      fetch(
        `${env.SUPABASE_URL}/rest/v1/payments?user_id=eq.${userId}&status=eq.pending&select=id`,
        {
          headers: {
            apikey: env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
          },
        }
      ),
    ])

    const reports = await reportsRes.json()
    const payments = await paymentsRes.json()

    return reports.length > 0 || payments.length > 0
  } catch (error) {
    console.error('[LGPD] Error checking active data:', error)
    return true // Falhar de forma segura
  }
}

async function checkPendingPayments(userId: string, env: Env): Promise<boolean> {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/payments?user_id=eq.${userId}&status=eq.pending&select=id`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    const payments = await response.json()
    return payments.length > 0
  } catch (error) {
    console.error('[LGPD] Error checking pending payments:', error)
    return true
  }
}

async function fetchUserData(userId: string, env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/users?id=eq.${userId}&select=*`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )
  const users = await response.json()
  return users[0] || null
}

async function fetchUserReports(userId: string, env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/reports?user_id=eq.${userId}&select=*`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )
  return await response.json()
}

async function fetchUserPayments(userId: string, env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/payments?user_id=eq.${userId}&select=*`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )
  return await response.json()
}

async function fetchUserConversations(userId: string, env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/chatbot_conversations?lead_id=eq.${userId}&select=*`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )
  return await response.json()
}

async function fetchUserConsents(userId: string, env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/lgpd_consents?user_id=eq.${userId}&select=*`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )
  return await response.json()
}

async function fetchUserAuditLogs(userId: string, env: Env) {
  const response = await fetch(
    `${env.SUPABASE_URL}/rest/v1/audit_logs?user_id=eq.${userId}&select=*&order=created_at.desc&limit=100`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )
  return await response.json()
}

// Adicionar tabela lgpd_requests ao schema se não existir
// CREATE TABLE IF NOT EXISTS lgpd_requests (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//   request_type VARCHAR(20) NOT NULL,
//   reason TEXT,
//   status VARCHAR(20) DEFAULT 'pending',
//   ip_address VARCHAR(45),
//   user_agent TEXT,
//   processed_at TIMESTAMP WITH TIME ZONE,
//   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
// );

export default app
