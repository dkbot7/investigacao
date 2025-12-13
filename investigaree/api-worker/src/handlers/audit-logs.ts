/**
 * Audit Logs Handlers - API Routes para Logs de Auditoria LGPD
 *
 * Compliance com LGPD:
 * - Art. 37: Controlador deve manter registro das operações
 * - Art. 48: Demonstrar adoção de medidas eficazes
 */

import { Env, DecodedToken } from '../types'

export interface AuditLogEntry {
  user_id: string
  tenant_id: string
  action: string // CREATE, READ, UPDATE, DELETE, EXPORT, SHARE, etc
  entity_type: string // investigation, user, report, etc
  entity_id?: string
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
  severity?: 'info' | 'warning' | 'critical'
  status?: 'pending' | 'completed' | 'failed'
  data_subject?: string // CPF/CNPJ do titular dos dados
  legal_basis?: string // consentimento, contrato, legitimo_interesse, etc
  geolocation?: string
  session_id?: string
}

/**
 * POST /api/audit-logs
 * Criar novo log de auditoria
 */
export async function handleCreateAuditLog(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = (await request.json()) as Partial<AuditLogEntry>

    // Validações
    if (!body.action || !body.entity_type) {
      return new Response(
        JSON.stringify({ error: 'action e entity_type são obrigatórios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Buscar tenant_id do usuário
    const userRecord = await env.DB.prepare('SELECT tenant_id FROM users WHERE id = ?')
      .bind(user.uid)
      .first<{ tenant_id: string }>()

    if (!userRecord) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Extrair IP e User-Agent
    const ip_address = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')
    const user_agent = request.headers.get('user-agent')
    const country = request.headers.get('cf-ipcountry')

    // Calcular retention (5 anos padrão LGPD)
    const retention_until = Math.floor(Date.now() / 1000) + 5 * 365 * 24 * 60 * 60

    // Inserir log
    const result = await env.DB.prepare(
      `INSERT INTO audit_logs (
        user_id, tenant_id, action, entity_type, entity_id,
        metadata, ip_address, user_agent, severity, status,
        data_subject, legal_basis, retention_until, geolocation, session_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        user.uid,
        userRecord.tenant_id,
        body.action,
        body.entity_type,
        body.entity_id || null,
        body.metadata ? JSON.stringify(body.metadata) : null,
        ip_address,
        user_agent,
        body.severity || 'info',
        body.status || 'completed',
        body.data_subject || null,
        body.legal_basis || null,
        retention_until,
        country || null,
        body.session_id || null
      )
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        id: result.meta.last_row_id,
        retention_until,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[AuditLogs] Erro ao criar log:', error)
    return new Response(
      JSON.stringify({
        error: 'Erro ao criar audit log',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * GET /api/audit-logs
 * Listar logs de auditoria com filtros
 */
export async function handleGetAuditLogs(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url)

    // Buscar tenant_id do usuário
    const userRecord = await env.DB.prepare('SELECT tenant_id, role FROM users WHERE id = ?')
      .bind(user.uid)
      .first<{ tenant_id: string; role: string }>()

    if (!userRecord) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Parâmetros de filtro
    const action = url.searchParams.get('action')
    const entity_type = url.searchParams.get('entity_type')
    const severity = url.searchParams.get('severity')
    const data_subject = url.searchParams.get('data_subject')
    const start_date = url.searchParams.get('start_date')
    const end_date = url.searchParams.get('end_date')
    const limit = parseInt(url.searchParams.get('limit') || '100')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Construir query
    let query = 'SELECT * FROM audit_logs WHERE tenant_id = ?'
    const params: any[] = [userRecord.tenant_id]

    if (action) {
      query += ' AND action = ?'
      params.push(action)
    }

    if (entity_type) {
      query += ' AND entity_type = ?'
      params.push(entity_type)
    }

    if (severity) {
      query += ' AND severity = ?'
      params.push(severity)
    }

    if (data_subject) {
      query += ' AND data_subject = ?'
      params.push(data_subject)
    }

    if (start_date) {
      query += ' AND created_at >= ?'
      params.push(start_date)
    }

    if (end_date) {
      query += ' AND created_at <= ?'
      params.push(end_date)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)

    const { results } = await env.DB.prepare(query).bind(...params).all()

    // Count total
    let countQuery = 'SELECT COUNT(*) as total FROM audit_logs WHERE tenant_id = ?'
    const countParams: any[] = [userRecord.tenant_id]

    if (action) {
      countQuery += ' AND action = ?'
      countParams.push(action)
    }
    if (entity_type) {
      countQuery += ' AND entity_type = ?'
      countParams.push(entity_type)
    }
    if (severity) {
      countQuery += ' AND severity = ?'
      countParams.push(severity)
    }
    if (data_subject) {
      countQuery += ' AND data_subject = ?'
      countParams.push(data_subject)
    }
    if (start_date) {
      countQuery += ' AND created_at >= ?'
      countParams.push(start_date)
    }
    if (end_date) {
      countQuery += ' AND created_at <= ?'
      countParams.push(end_date)
    }

    const countResult = await env.DB.prepare(countQuery)
      .bind(...countParams)
      .first<{ total: number }>()

    return new Response(
      JSON.stringify({
        logs: results || [],
        total: countResult?.total || 0,
        limit,
        offset,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[AuditLogs] Erro ao listar logs:', error)
    return new Response(
      JSON.stringify({
        error: 'Erro ao listar audit logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * GET /api/audit-logs/stats
 * Estatísticas dos audit logs
 */
export async function handleGetAuditLogStats(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    // Buscar tenant_id do usuário
    const userRecord = await env.DB.prepare('SELECT tenant_id FROM users WHERE id = ?')
      .bind(user.uid)
      .first<{ tenant_id: string }>()

    if (!userRecord) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Stats por ação
    const { results: actionStats } = await env.DB.prepare(
      `SELECT action, COUNT(*) as count
       FROM audit_logs
       WHERE tenant_id = ?
       GROUP BY action
       ORDER BY count DESC`
    )
      .bind(userRecord.tenant_id)
      .all()

    // Stats por severidade
    const { results: severityStats } = await env.DB.prepare(
      `SELECT severity, COUNT(*) as count
       FROM audit_logs
       WHERE tenant_id = ?
       GROUP BY severity`
    )
      .bind(userRecord.tenant_id)
      .all()

    // Stats por entity_type
    const { results: entityStats } = await env.DB.prepare(
      `SELECT entity_type, COUNT(*) as count
       FROM audit_logs
       WHERE tenant_id = ?
       GROUP BY entity_type
       ORDER BY count DESC`
    )
      .bind(userRecord.tenant_id)
      .all()

    // Total de logs
    const total = await env.DB.prepare(
      'SELECT COUNT(*) as total FROM audit_logs WHERE tenant_id = ?'
    )
      .bind(userRecord.tenant_id)
      .first<{ total: number }>()

    // Logs recentes (últimas 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const recent = await env.DB.prepare(
      'SELECT COUNT(*) as count FROM audit_logs WHERE tenant_id = ? AND created_at >= ?'
    )
      .bind(userRecord.tenant_id, oneDayAgo)
      .first<{ count: number }>()

    return new Response(
      JSON.stringify({
        total: total?.total || 0,
        recent_24h: recent?.count || 0,
        by_action: actionStats || [],
        by_severity: severityStats || [],
        by_entity: entityStats || [],
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[AuditLogs] Erro ao buscar stats:', error)
    return new Response(
      JSON.stringify({
        error: 'Erro ao buscar estatísticas',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * DELETE /api/audit-logs/cleanup
 * Limpar logs expirados (LGPD retention compliance)
 */
export async function handleCleanupAuditLogs(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    // Apenas admins podem executar cleanup
    const userRecord = await env.DB.prepare('SELECT role FROM users WHERE id = ?')
      .bind(user.uid)
      .first<{ role: string }>()

    if (!userRecord || userRecord.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const now = Math.floor(Date.now() / 1000)

    // Deletar logs expirados
    const result = await env.DB.prepare(
      'DELETE FROM audit_logs WHERE retention_until <= ?'
    )
      .bind(now)
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        deleted: result.meta.changes,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[AuditLogs] Erro ao limpar logs:', error)
    return new Response(
      JSON.stringify({
        error: 'Erro ao limpar logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
