/**
 * Reports API Routes
 * Gerenciamento de relatórios de due diligence
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'
import {
  generateSignedPDFUrl,
  validateDownloadToken,
  getPDFFromStorage,
  generateReportPDF,
  ReportData,
} from '../services/pdf-generator.service'

const app = new Hono<{ Bindings: Env }>()

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createReportSchema = z.object({
  startup_nome: z.string().min(2, 'Nome da startup muito curto'),
  startup_cnpj: z.string().regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'),
  startup_setor: z.string().optional(),
  startup_website: z.string().url('Website inválido').optional(),
})

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/reports
 * Listar relatórios do usuário autenticado
 */
app.get('/', async (c) => {
  try {
    const userId = c.get('userId') as string

    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/reports?user_id=eq.${userId}&select=id,startup_nome,startup_cnpj,status,recomendacao,score_integridade,created_at,prazo_entrega,pdf_url&order=created_at.desc`,
      {
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[REPORTS] Supabase error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      })
      throw new Error(`Erro ao buscar relatórios: ${response.status} ${response.statusText}`)
    }

    const reports = await response.json()

    // Gerar URLs seguras para PDFs (assíncrono)
    const reportsWithUrls = await Promise.all(
      reports.map(async (report: any) => ({
        ...report,
        pdf_url_secure: report.pdf_url
          ? await generateSecureURL(report.id, userId, c.env)
          : null,
      }))
    )

    return c.json({
      reports: reportsWithUrls,
      total: reports.length,
    })
  } catch (error) {
    console.error('[REPORTS] Error listing:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao listar relatórios',
      },
      500
    )
  }
})

/**
 * GET /api/reports/:id
 * Obter relatório específico
 */
app.get('/:id', async (c) => {
  try {
    const reportId = c.req.param('id')
    const userId = c.get('userId') as string

    // Buscar relatório com verificação de ownership
    const response = await fetch(
      `${c.env.SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}&user_id=eq.${userId}&select=*`,
      {
        headers: {
          apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar relatório')
    }

    const reports = await response.json()
    const report = reports[0]

    if (!report) {
      return c.json(
        {
          error: true,
          message: 'Relatório não encontrado ou sem permissão',
        },
        404
      )
    }

    // Gerar URL segura para PDF
    report.pdf_url_secure = report.pdf_url
      ? generateSecureURL(report.id, userId, c.env)
      : null

    return c.json(report)
  } catch (error) {
    console.error('[REPORTS] Error fetching:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao buscar relatório',
      },
      500
    )
  }
})

/**
 * POST /api/reports
 * Criar novo relatório (após pagamento confirmado)
 */
app.post('/', async (c) => {
  try {
    const userId = c.get('userId') as string
    const body = await c.req.json()
    const validated = createReportSchema.parse(body)

    // Verificar se usuário tem pagamento ativo ou assinatura
    const hasActivePayment = await checkActivePayment(userId, c.env)

    if (!hasActivePayment) {
      return c.json(
        {
          error: true,
          message: 'Pagamento necessário para gerar relatório',
          code: 'PAYMENT_REQUIRED',
        },
        402 // Payment Required
      )
    }

    // Criar relatório com status pendente
    const prazoEntrega = new Date()
    prazoEntrega.setHours(prazoEntrega.getHours() + 72) // 72 horas SLA

    const reportData = {
      user_id: userId,
      startup_nome: validated.startup_nome,
      startup_cnpj: validated.startup_cnpj,
      startup_setor: validated.startup_setor || null,
      startup_website: validated.startup_website || null,
      status: 'pendente',
      prazo_entrega: prazoEntrega.toISOString(),
    }

    const response = await fetch(`${c.env.SUPABASE_URL}/rest/v1/reports`, {
      method: 'POST',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(reportData),
    })

    if (!response.ok) {
      throw new Error('Erro ao criar relatório')
    }

    const reports = await response.json()
    const report = reports[0]

    // TODO: Trigger processamento assíncrono do relatório
    // await triggerReportProcessing(report.id, c.env)

    return c.json(
      {
        success: true,
        report_id: report.id,
        message: 'Relatório criado com sucesso',
        prazo_entrega: report.prazo_entrega,
        status: report.status,
      },
      201
    )
  } catch (error) {
    console.error('[REPORTS] Error creating:', error)

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
        message: 'Erro ao criar relatório',
      },
      500
    )
  }
})

/**
 * PATCH /api/reports/:id
 * Atualizar status do relatório (apenas admin)
 */
app.patch('/:id', async (c) => {
  try {
    const reportId = c.req.param('id')
    const userId = c.get('userId') as string
    const body = await c.req.json()

    // Verificar ownership
    const report = await getReportById(reportId, c.env)

    if (!report || report.user_id !== userId) {
      return c.json(
        {
          error: true,
          message: 'Relatório não encontrado ou sem permissão',
        },
        404
      )
    }

    // Atualizar apenas campos permitidos
    const allowedFields = ['startup_setor', 'startup_website']
    const updateData: any = {}

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    if (Object.keys(updateData).length === 0) {
      return c.json(
        {
          error: true,
          message: 'Nenhum campo válido para atualizar',
        },
        400
      )
    }

    updateData.updated_at = new Date().toISOString()

    await fetch(`${c.env.SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}`, {
      method: 'PATCH',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    return c.json({
      success: true,
      message: 'Relatório atualizado',
    })
  } catch (error) {
    console.error('[REPORTS] Error updating:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao atualizar relatório',
      },
      500
    )
  }
})

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Verificar se usuário tem pagamento ativo
 */
async function checkActivePayment(userId: string, env: Env): Promise<boolean> {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/payments?user_id=eq.${userId}&status=eq.succeeded&select=id&limit=1`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      return false
    }

    const payments = await response.json()
    return payments.length > 0
  } catch (error) {
    console.error('[REPORTS] Error checking payment:', error)
    return false
  }
}

/**
 * Buscar relatório por ID
 */
async function getReportById(reportId: string, env: Env) {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}&select=*`,
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

    const reports = await response.json()
    return reports[0] || null
  } catch (error) {
    console.error('[REPORTS] Error fetching by ID:', error)
    return null
  }
}

/**
 * Gerar URL segura para PDF com expiração (usando serviço)
 */
async function generateSecureURL(reportId: string, userId: string, env: Env): Promise<string> {
  const url = await generateSignedPDFUrl(reportId, userId, env, 7 * 24 * 60 * 60) // 7 dias
  return url || `/api/reports/${reportId}/download`
}

/**
 * GET /api/reports/:id/download
 * Download seguro do PDF do relatório
 */
app.get('/:id/download', async (c) => {
  try {
    const reportId = c.req.param('id')
    const token = c.req.query('token')
    const expiresAt = parseInt(c.req.query('expires') || '0')

    // Se não tem token, verificar se usuário está autenticado
    let userId: string | null = null

    if (!token) {
      // Tentar pegar userId do contexto (auth middleware)
      userId = c.get('userId') as string | null

      if (!userId) {
        return c.json(
          {
            error: true,
            message: 'Autenticação necessária ou token de download inválido',
          },
          401
        )
      }

      // Verificar ownership do relatório
      const report = await getReportById(reportId, c.env)
      if (!report || report.user_id !== userId) {
        return c.json(
          {
            error: true,
            message: 'Relatório não encontrado ou sem permissão',
          },
          404
        )
      }
    } else {
      // Validar token
      // Precisamos pegar o userId do relatório para validar
      const report = await getReportById(reportId, c.env)
      if (!report) {
        return c.json(
          {
            error: true,
            message: 'Relatório não encontrado',
          },
          404
        )
      }

      userId = report.user_id

      const isValid = await validateDownloadToken(
        reportId,
        userId,
        token,
        expiresAt,
        c.env
      )

      if (!isValid) {
        return c.json(
          {
            error: true,
            message: 'Token de download inválido ou expirado',
          },
          403
        )
      }
    }

    // Buscar PDF do R2
    const pdfResult = await getPDFFromStorage(reportId, c.env)

    if (!pdfResult) {
      return c.json(
        {
          error: true,
          message: 'PDF não encontrado. O relatório pode ainda estar sendo processado.',
        },
        404
      )
    }

    // Retornar PDF
    return new Response(pdfResult.buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-${reportId}.pdf"`,
        'Content-Length': pdfResult.size.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    console.error('[REPORTS] Error downloading PDF:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao baixar PDF',
      },
      500
    )
  }
})

/**
 * POST /api/reports/:id/regenerate-pdf
 * Regenerar PDF de um relatório existente
 */
app.post('/:id/regenerate-pdf', async (c) => {
  try {
    const reportId = c.req.param('id')
    const userId = c.get('userId') as string

    // Buscar relatório
    const report = await getReportById(reportId, c.env)

    if (!report || report.user_id !== userId) {
      return c.json(
        {
          error: true,
          message: 'Relatório não encontrado ou sem permissão',
        },
        404
      )
    }

    // Verificar se tem dados completos para regenerar
    if (!report.dados_completos) {
      return c.json(
        {
          error: true,
          message: 'Dados insuficientes para regenerar PDF',
        },
        400
      )
    }

    // Regenerar PDF
    const pdfUrl = await generateReportPDF(report.dados_completos as ReportData, c.env)

    if (!pdfUrl) {
      return c.json(
        {
          error: true,
          message: 'Falha ao regenerar PDF',
        },
        500
      )
    }

    // Atualizar URL no banco
    await fetch(`${c.env.SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}`, {
      method: 'PATCH',
      headers: {
        apikey: c.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${c.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pdf_url: pdfUrl,
        updated_at: new Date().toISOString(),
      }),
    })

    return c.json({
      success: true,
      message: 'PDF regenerado com sucesso',
      pdf_url: pdfUrl,
    })
  } catch (error) {
    console.error('[REPORTS] Error regenerating PDF:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao regenerar PDF',
      },
      500
    )
  }
})

/**
 * GET /api/reports/:id/signed-url
 * Obter URL assinada para download do PDF
 */
app.get('/:id/signed-url', async (c) => {
  try {
    const reportId = c.req.param('id')
    const userId = c.get('userId') as string

    // Verificar ownership
    const report = await getReportById(reportId, c.env)

    if (!report || report.user_id !== userId) {
      return c.json(
        {
          error: true,
          message: 'Relatório não encontrado ou sem permissão',
        },
        404
      )
    }

    if (!report.pdf_url) {
      return c.json(
        {
          error: true,
          message: 'PDF ainda não foi gerado para este relatório',
        },
        404
      )
    }

    // Gerar URL assinada (válida por 1 hora)
    const signedUrl = await generateSignedPDFUrl(reportId, userId, c.env, 3600)

    if (!signedUrl) {
      return c.json(
        {
          error: true,
          message: 'Falha ao gerar URL de download',
        },
        500
      )
    }

    return c.json({
      success: true,
      download_url: signedUrl,
      expires_in: 3600,
      expires_at: new Date(Date.now() + 3600000).toISOString(),
    })
  } catch (error) {
    console.error('[REPORTS] Error generating signed URL:', error)
    return c.json(
      {
        error: true,
        message: 'Erro ao gerar URL de download',
      },
      500
    )
  }
})

export default app
