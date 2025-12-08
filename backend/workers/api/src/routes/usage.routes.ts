/**
 * Usage & Statistics Routes
 *
 * Endpoints para monitoramento de uso e custos das APIs SERPRO:
 * - GET /api/admin/serpro/usage - Estatísticas agregadas
 * - GET /api/admin/serpro/usage/export - Export CSV
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env } from '../types/api.types';

const router = new Hono<{ Bindings: Env }>();

/**
 * GET /api/admin/serpro/usage
 *
 * Retorna estatísticas de uso das APIs SERPRO com múltiplas agregações
 *
 * Query params:
 * - period: 'today' | 'week' | 'month' | 'custom' (default: 'month')
 * - start_date: YYYY-MM-DD (para period=custom)
 * - end_date: YYYY-MM-DD (para period=custom)
 * - tenant_code: filtrar por tenant específico
 * - api_name: filtrar por API específica
 * - group_by: 'tenant' | 'api' | 'user' | 'date' (default: todos)
 *
 * Response:
 * {
 *   summary: { total_queries, total_cost, avg_response_time, success_rate },
 *   by_tenant: [{ tenant_code, queries, cost }],
 *   by_api: [{ api_name, queries, cost }],
 *   by_user: [{ email, queries, cost }],
 *   by_date: [{ date, queries, cost }],
 *   filters: { period, start_date, end_date, tenant_code, api_name }
 * }
 */
router.get('/usage', authMiddleware, async (c) => {
  try {
    // Parse query params
    const period = c.req.query('period') || 'month';
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');
    const tenantCode = c.req.query('tenant_code');
    const apiName = c.req.query('api_name');
    const groupBy = c.req.query('group_by') || 'all';

    // Calculate date range
    let dateFilter = '';
    let params: any[] = [];

    if (period === 'today') {
      dateFilter = "DATE(created_at) = DATE('now')";
    } else if (period === 'week') {
      dateFilter = "created_at >= datetime('now', '-7 days')";
    } else if (period === 'month') {
      dateFilter = "created_at >= datetime('now', '-30 days')";
    } else if (period === 'custom' && startDate && endDate) {
      dateFilter = "DATE(created_at) BETWEEN ? AND ?";
      params.push(startDate, endDate);
    } else {
      // Default to last 30 days
      dateFilter = "created_at >= datetime('now', '-30 days')";
    }

    // Additional filters
    const filters: string[] = [dateFilter];
    if (tenantCode) {
      filters.push('tenant_code = ?');
      params.push(tenantCode);
    }
    if (apiName) {
      filters.push('api_name = ?');
      params.push(apiName);
    }

    const whereClause = filters.join(' AND ');

    // 1. SUMMARY (totais gerais)
    const summaryQuery = `
      SELECT
        COUNT(*) as total_queries,
        COALESCE(SUM(cost), 0) as total_cost,
        COALESCE(AVG(response_time_ms), 0) as avg_response_time,
        ROUND(CAST(SUM(CASE WHEN response_status = 200 THEN 1 ELSE 0 END) AS REAL) / COUNT(*) * 100, 2) as success_rate
      FROM serpro_usage
      WHERE ${whereClause}
    `;

    const summary = await c.env.DB.prepare(summaryQuery)
      .bind(...params)
      .first();

    // 2. BY TENANT (agrupado por tenant)
    const byTenantQuery = `
      SELECT
        tenant_code,
        COUNT(*) as queries,
        COALESCE(SUM(cost), 0) as cost,
        COALESCE(AVG(response_time_ms), 0) as avg_response_time
      FROM serpro_usage
      WHERE ${whereClause}
      GROUP BY tenant_code
      ORDER BY cost DESC
      LIMIT 20
    `;

    const byTenant = await c.env.DB.prepare(byTenantQuery)
      .bind(...params)
      .all();

    // 3. BY API (agrupado por API)
    const byApiQuery = `
      SELECT
        api_name,
        COUNT(*) as queries,
        COALESCE(SUM(cost), 0) as cost,
        COALESCE(AVG(response_time_ms), 0) as avg_response_time
      FROM serpro_usage
      WHERE ${whereClause}
      GROUP BY api_name
      ORDER BY cost DESC
    `;

    const byApi = await c.env.DB.prepare(byApiQuery)
      .bind(...params)
      .all();

    // 4. BY USER (top 10 usuários)
    const byUserQuery = `
      SELECT
        u.email,
        u.name,
        COUNT(su.id) as queries,
        COALESCE(SUM(su.cost), 0) as cost,
        COALESCE(AVG(su.response_time_ms), 0) as avg_response_time
      FROM serpro_usage su
      LEFT JOIN users u ON su.user_id = u.id
      WHERE ${whereClause}
      GROUP BY u.email, u.name
      ORDER BY cost DESC
      LIMIT 10
    `;

    const byUser = await c.env.DB.prepare(byUserQuery)
      .bind(...params)
      .all();

    // 5. BY DATE (últimos 30 dias)
    const byDateQuery = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as queries,
        COALESCE(SUM(cost), 0) as cost
      FROM serpro_usage
      WHERE ${whereClause}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;

    const byDate = await c.env.DB.prepare(byDateQuery)
      .bind(...params)
      .all();

    // 6. MOST EXPENSIVE QUERIES (top 20 consultas mais caras)
    const expensiveQueriesQuery = `
      SELECT
        api_name,
        document,
        cost,
        response_status,
        response_time_ms,
        created_at,
        tenant_code
      FROM serpro_usage
      WHERE ${whereClause}
      ORDER BY cost DESC
      LIMIT 20
    `;

    const expensiveQueries = await c.env.DB.prepare(expensiveQueriesQuery)
      .bind(...params)
      .all();

    return c.json({
      summary: summary || {
        total_queries: 0,
        total_cost: 0,
        avg_response_time: 0,
        success_rate: 0
      },
      by_tenant: byTenant.results || [],
      by_api: byApi.results || [],
      by_user: byUser.results || [],
      by_date: byDate.results || [],
      expensive_queries: expensiveQueries.results || [],
      filters: {
        period,
        start_date: startDate,
        end_date: endDate,
        tenant_code: tenantCode,
        api_name: apiName
      },
      meta: {
        timestamp: new Date().toISOString(),
        query_count: 6
      }
    });

  } catch (error: any) {
    console.error('[Usage Stats] Erro:', error);
    return c.json({
      error: 'Erro ao buscar estatísticas de uso',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/admin/serpro/usage/export
 *
 * Exporta dados de uso em formato CSV
 *
 * Query params: (mesmos de /usage)
 * - period, start_date, end_date, tenant_code, api_name
 *
 * Response: CSV file download
 */
router.get('/usage/export', authMiddleware, async (c) => {
  try {
    // Parse query params (igual ao endpoint /usage)
    const period = c.req.query('period') || 'month';
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');
    const tenantCode = c.req.query('tenant_code');
    const apiName = c.req.query('api_name');

    // Calculate date range
    let dateFilter = '';
    let params: any[] = [];

    if (period === 'today') {
      dateFilter = "DATE(created_at) = DATE('now')";
    } else if (period === 'week') {
      dateFilter = "created_at >= datetime('now', '-7 days')";
    } else if (period === 'month') {
      dateFilter = "created_at >= datetime('now', '-30 days')";
    } else if (period === 'custom' && startDate && endDate) {
      dateFilter = "DATE(created_at) BETWEEN ? AND ?";
      params.push(startDate, endDate);
    } else {
      dateFilter = "created_at >= datetime('now', '-30 days')";
    }

    // Additional filters
    const filters: string[] = [dateFilter];
    if (tenantCode) {
      filters.push('tenant_code = ?');
      params.push(tenantCode);
    }
    if (apiName) {
      filters.push('api_name = ?');
      params.push(apiName);
    }

    const whereClause = filters.join(' AND ');

    // Query completa para export
    const exportQuery = `
      SELECT
        su.id,
        su.created_at as data_hora,
        su.tenant_code,
        su.api_name,
        su.document,
        su.cost as custo_reais,
        su.response_status as status_http,
        su.response_time_ms as tempo_ms,
        u.email as usuario_email,
        u.name as usuario_nome
      FROM serpro_usage su
      LEFT JOIN users u ON su.user_id = u.id
      WHERE ${whereClause}
      ORDER BY su.created_at DESC
      LIMIT 10000
    `;

    const { results } = await c.env.DB.prepare(exportQuery)
      .bind(...params)
      .all();

    // Gerar CSV
    const csvHeaders = [
      'ID',
      'Data/Hora',
      'Tenant',
      'API',
      'Documento',
      'Custo (R$)',
      'Status HTTP',
      'Tempo (ms)',
      'Usuário Email',
      'Usuário Nome'
    ];

    const csvRows = results.map((row: any) => [
      row.id,
      row.data_hora,
      row.tenant_code,
      row.api_name,
      row.document,
      row.custo_reais.toFixed(4),
      row.status_http,
      row.tempo_ms,
      row.usuario_email || '',
      row.usuario_nome || ''
    ]);

    // Montar CSV
    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // UTF-8 BOM para Excel
    const bom = '\uFEFF';
    const csvWithBom = bom + csvContent;

    // Filename com timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `serpro-usage-${timestamp}.csv`;

    return new Response(csvWithBom, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error: any) {
    console.error('[Usage Export] Erro:', error);
    return c.json({
      error: 'Erro ao exportar dados de uso',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/admin/serpro/usage/realtime
 *
 * Retorna uso em tempo real (últimas 24h com resolução horária)
 *
 * Response:
 * {
 *   last_24h: [{ hour, queries, cost }],
 *   current_hour: { queries, cost },
 *   trend: 'up' | 'down' | 'stable'
 * }
 */
router.get('/usage/realtime', authMiddleware, async (c) => {
  try {
    // Últimas 24 horas agrupadas por hora
    const last24hQuery = `
      SELECT
        strftime('%Y-%m-%d %H:00:00', created_at) as hour,
        COUNT(*) as queries,
        COALESCE(SUM(cost), 0) as cost
      FROM serpro_usage
      WHERE created_at >= datetime('now', '-24 hours')
      GROUP BY strftime('%Y-%m-%d %H:00:00', created_at)
      ORDER BY hour DESC
    `;

    const last24h = await c.env.DB.prepare(last24hQuery).all();

    // Hora atual
    const currentHourQuery = `
      SELECT
        COUNT(*) as queries,
        COALESCE(SUM(cost), 0) as cost
      FROM serpro_usage
      WHERE created_at >= datetime('now', 'start of day', '+' || CAST(strftime('%H', 'now') AS INTEGER) || ' hours')
    `;

    const currentHour = await c.env.DB.prepare(currentHourQuery).first();

    // Calcular trend (comparar última hora com média das 24h)
    const results = last24h.results || [];
    const avgCost = results.length > 0
      ? results.reduce((acc: number, r: any) => acc + r.cost, 0) / results.length
      : 0;
    const lastHourCost = results[0]?.cost || 0;

    let trend = 'stable';
    if (lastHourCost > avgCost * 1.2) trend = 'up';
    if (lastHourCost < avgCost * 0.8) trend = 'down';

    return c.json({
      last_24h: results,
      current_hour: currentHour || { queries: 0, cost: 0 },
      trend,
      avg_hourly_cost: avgCost.toFixed(4),
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[Usage Realtime] Erro:', error);
    return c.json({
      error: 'Erro ao buscar uso em tempo real',
      details: error.message
    }, 500);
  }
});

export default router;
