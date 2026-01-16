/**
 * Plan Limits Handlers - Sistema de Limites por Plano
 *
 * Implementa soft limits (avisos) e hard limits (bloqueios)
 * para controlar uso de recursos por plano de assinatura
 */

import { Env, DecodedToken } from '../types'

export interface PlanLimits {
  id: number
  plan_name: string
  investigations_per_month: number
  investigations_concurrent: number
  serpro_calls_per_month: number
  exports_per_month: number
  users_per_tenant: number
  storage_mb: number
  api_access: number
  bulk_investigations: number
  custom_reports: number
  priority_support: number
}

export interface TenantUsage {
  id: number
  tenant_code: string
  year_month: string
  investigations_count: number
  serpro_calls_count: number
  exports_count: number
  created_at: string
  updated_at: string
}

export interface UsageStatus {
  allowed: boolean
  limit: number
  current: number
  percentage: number
  warning: boolean // true se >= 80%
  message?: string
}

export interface LimitsCheckResult {
  allowed: boolean
  plan_name: string
  limits: PlanLimits
  usage: {
    investigations: UsageStatus
    serpro_calls: UsageStatus
    exports: UsageStatus
  }
  warnings: string[]
  blocked_reason?: string
}

/**
 * Obter o mês atual no formato YYYY-MM
 */
function getCurrentYearMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Calcular status de uso
 */
function calculateUsageStatus(current: number, limit: number): UsageStatus {
  const percentage = limit > 0 ? (current / limit) * 100 : 0
  const warning = percentage >= 80

  return {
    allowed: current < limit || limit === 999999, // 999999 = unlimited
    limit,
    current,
    percentage,
    warning,
    message: warning
      ? `Você está usando ${percentage.toFixed(0)}% do seu limite (${current}/${limit})`
      : undefined,
  }
}

/**
 * GET /api/plan-limits/check
 * Verifica limites do tenant atual
 */
export async function handleCheckLimits(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get('action') // investigations, serpro_calls, exports

    // Buscar tenant do usuário
    const userRecord = await env.DB.prepare(
      'SELECT tenant_id FROM users WHERE id = ?'
    )
      .bind(user.uid)
      .first<{ tenant_id: string }>()

    if (!userRecord) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Buscar tenant e seu plano
    const tenant = await env.DB.prepare(
      'SELECT code, plan_name FROM tenants WHERE id = ?'
    )
      .bind(userRecord.tenant_id)
      .first<{ code: string; plan_name: string }>()

    if (!tenant) {
      return new Response(JSON.stringify({ error: 'Tenant not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Buscar limites do plano
    const limits = await env.DB.prepare(
      'SELECT * FROM plan_limits WHERE plan_name = ?'
    )
      .bind(tenant.plan_name || 'free')
      .first<PlanLimits>()

    if (!limits) {
      return new Response(
        JSON.stringify({ error: 'Plan limits not found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Buscar ou criar uso do mês atual
    const yearMonth = getCurrentYearMonth()
    let usage = await env.DB.prepare(
      'SELECT * FROM tenant_usage WHERE tenant_code = ? AND year_month = ?'
    )
      .bind(tenant.code, yearMonth)
      .first<TenantUsage>()

    if (!usage) {
      // Criar registro de uso para o mês atual
      await env.DB.prepare(
        `INSERT INTO tenant_usage (tenant_code, year_month)
         VALUES (?, ?)`
      )
        .bind(tenant.code, yearMonth)
        .run()

      usage = {
        id: 0,
        tenant_code: tenant.code,
        year_month: yearMonth,
        investigations_count: 0,
        serpro_calls_count: 0,
        exports_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    // Calcular status de cada tipo de uso
    const investigationsStatus = calculateUsageStatus(
      usage.investigations_count,
      limits.investigations_per_month
    )
    const serproStatus = calculateUsageStatus(
      usage.serpro_calls_count,
      limits.serpro_calls_per_month
    )
    const exportsStatus = calculateUsageStatus(
      usage.exports_count,
      limits.exports_per_month
    )

    // Compilar avisos
    const warnings: string[] = []
    if (investigationsStatus.warning && investigationsStatus.message) {
      warnings.push(`Investigações: ${investigationsStatus.message}`)
    }
    if (serproStatus.warning && serproStatus.message) {
      warnings.push(`SERPRO: ${serproStatus.message}`)
    }
    if (exportsStatus.warning && exportsStatus.message) {
      warnings.push(`Exportações: ${exportsStatus.message}`)
    }

    // Verificar se a ação específica é permitida
    let allowed = true
    let blocked_reason: string | undefined

    if (action === 'investigations' && !investigationsStatus.allowed) {
      allowed = false
      blocked_reason = `Limite de investigações atingido (${usage.investigations_count}/${limits.investigations_per_month}). Faça upgrade do seu plano.`
    } else if (action === 'serpro_calls' && !serproStatus.allowed) {
      allowed = false
      blocked_reason = `Limite de consultas SERPRO atingido (${usage.serpro_calls_count}/${limits.serpro_calls_per_month}). Faça upgrade do seu plano.`
    } else if (action === 'exports' && !exportsStatus.allowed) {
      allowed = false
      blocked_reason = `Limite de exportações atingido (${usage.exports_count}/${limits.exports_per_month}). Faça upgrade do seu plano.`
    }

    const result: LimitsCheckResult = {
      allowed,
      plan_name: tenant.plan_name || 'free',
      limits,
      usage: {
        investigations: investigationsStatus,
        serpro_calls: serproStatus,
        exports: exportsStatus,
      },
      warnings,
      blocked_reason,
    }

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[PlanLimits] Error checking limits:', error)
    return new Response(
      JSON.stringify({
        error: 'Error checking limits',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * POST /api/plan-limits/track
 * Registra uso de um recurso
 */
export async function handleTrackUsage(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = (await request.json()) as {
      action: 'investigations' | 'serpro_calls' | 'exports'
      increment?: number
    }

    if (!body.action) {
      return new Response(
        JSON.stringify({ error: 'action is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Buscar tenant do usuário
    const userRecord = await env.DB.prepare(
      'SELECT tenant_id FROM users WHERE id = ?'
    )
      .bind(user.uid)
      .first<{ tenant_id: string }>()

    if (!userRecord) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const tenant = await env.DB.prepare(
      'SELECT code FROM tenants WHERE id = ?'
    )
      .bind(userRecord.tenant_id)
      .first<{ code: string }>()

    if (!tenant) {
      return new Response(JSON.stringify({ error: 'Tenant not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const yearMonth = getCurrentYearMonth()
    const increment = body.increment || 1

    // Upsert: incrementar ou criar registro
    const columnMap = {
      investigations: 'investigations_count',
      serpro_calls: 'serpro_calls_count',
      exports: 'exports_count',
    }

    const column = columnMap[body.action]

    await env.DB.prepare(
      `INSERT INTO tenant_usage (tenant_code, year_month, ${column})
       VALUES (?, ?, ?)
       ON CONFLICT(tenant_code, year_month)
       DO UPDATE SET ${column} = ${column} + ?`
    )
      .bind(tenant.code, yearMonth, increment, increment)
      .run()

    return new Response(
      JSON.stringify({ success: true, action: body.action, increment }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[PlanLimits] Error tracking usage:', error)
    return new Response(
      JSON.stringify({
        error: 'Error tracking usage',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * GET /api/plan-limits/plans
 * Lista todos os planos disponíveis
 */
export async function handleGetPlans(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM plan_limits ORDER BY id ASC'
    ).all<PlanLimits>()

    return new Response(
      JSON.stringify({ plans: results || [] }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[PlanLimits] Error getting plans:', error)
    return new Response(
      JSON.stringify({
        error: 'Error getting plans',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

/**
 * GET /api/plan-limits/usage/history
 * Histórico de uso dos últimos meses
 */
export async function handleGetUsageHistory(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url)
    const months = parseInt(url.searchParams.get('months') || '6')

    // Buscar tenant do usuário
    const userRecord = await env.DB.prepare(
      'SELECT tenant_id FROM users WHERE id = ?'
    )
      .bind(user.uid)
      .first<{ tenant_id: string }>()

    if (!userRecord) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const tenant = await env.DB.prepare(
      'SELECT code FROM tenants WHERE id = ?'
    )
      .bind(userRecord.tenant_id)
      .first<{ code: string }>()

    if (!tenant) {
      return new Response(JSON.stringify({ error: 'Tenant not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Buscar histórico
    const { results } = await env.DB.prepare(
      `SELECT * FROM tenant_usage
       WHERE tenant_code = ?
       ORDER BY year_month DESC
       LIMIT ?`
    )
      .bind(tenant.code, months)
      .all<TenantUsage>()

    return new Response(
      JSON.stringify({ history: results || [] }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[PlanLimits] Error getting usage history:', error)
    return new Response(
      JSON.stringify({
        error: 'Error getting usage history',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
