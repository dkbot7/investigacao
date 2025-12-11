// ============================================================================
// SERPRO API ROUTES
// Agent 2 - Backend Engineer
// HTTP endpoints for SERPRO API services
// ============================================================================

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { Env, AuthenticatedUser } from '../types/api.types';
import { CpfService } from '../services/serpro/cpf.service';
import { CnpjService } from '../services/serpro/cnpj.service';
import { DividaAtivaService } from '../services/serpro/divida-ativa.service';
import { logger } from '../utils/logger';

const serpro = new Hono<{ Bindings: Env }>();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const cpfSchema = z.object({
  cpf: z.string().min(11).max(14), // Accepts with or without formatting
});

const cnpjSchema = z.object({
  cnpj: z.string().min(14).max(18), // Accepts with or without formatting
});

const dividaSchema = z.object({
  ni: z.string().min(11).max(18), // CPF or CNPJ
});

const batchCpfSchema = z.object({
  cpfs: z.array(z.string()).min(1).max(100), // Max 100 CPFs per batch
});

const batchCnpjSchema = z.object({
  cnpjs: z.array(z.string()).min(1).max(100),
  level: z.enum(['basica', 'qsa', 'empresa']).optional().default('empresa'),
});

// ============================================================================
// CPF ENDPOINTS
// ============================================================================

/**
 * POST /cpf
 * Query single CPF
 */
serpro.post('/cpf', zValidator('json', cpfSchema), async (c) => {
  const { cpf } = c.req.valid('json');
  const user = c.get('user') as AuthenticatedUser;
  const tenantCode = c.req.header('X-Tenant-Code') || 'INVESTIGA';

  logger.info('CPF query request', { uid: user.uid, tenantCode });

  const service = new CpfService(c.env);
  const result = await service.consultarCpf(cpf, user.uid, tenantCode);

  return c.json({
    success: true,
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
      cost: 0.6591, // TODO: Get from service
    },
  });
});

/**
 * POST /cpf/batch
 * Query multiple CPFs
 */
serpro.post('/cpf/batch', zValidator('json', batchCpfSchema), async (c) => {
  const { cpfs } = c.req.valid('json');
  const user = c.get('user') as AuthenticatedUser;
  const tenantCode = c.req.header('X-Tenant-Code') || 'INVESTIGA';

  logger.info('CPF batch query request', { uid: user.uid, count: cpfs.length });

  const service = new CpfService(c.env);
  const results = await service.consultarCpfBatch(cpfs, user.uid, tenantCode);

  return c.json({
    success: true,
    data: results,
    meta: {
      timestamp: new Date().toISOString(),
      total: results.length,
      requested: cpfs.length,
    },
  });
});

// ============================================================================
// CNPJ ENDPOINTS
// ============================================================================

/**
 * POST /cnpj/basica
 * Query CNPJ basic data (masked CPF in QSA)
 */
serpro.post('/cnpj/basica', zValidator('json', cnpjSchema), async (c) => {
  const { cnpj } = c.req.valid('json');
  const user = c.get('user') as AuthenticatedUser;
  const tenantCode = c.req.header('X-Tenant-Code') || 'INVESTIGA';

  logger.info('CNPJ basica query', { uid: user.uid, tenantCode });

  const service = new CnpjService(c.env);
  const result = await service.consultarCnpjBasica(cnpj, user.uid, tenantCode);

  return c.json({
    success: true,
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
      cost: 0.6591,
      endpoint: 'basica',
    },
  });
});

/**
 * POST /cnpj/qsa
 * Query CNPJ with QSA (masked CPF)
 */
serpro.post('/cnpj/qsa', zValidator('json', cnpjSchema), async (c) => {
  const { cnpj } = c.req.valid('json');
  const user = c.get('user') as AuthenticatedUser;
  const tenantCode = c.req.header('X-Tenant-Code') || 'INVESTIGA';

  logger.info('CNPJ QSA query', { uid: user.uid, tenantCode });

  const service = new CnpjService(c.env);
  const result = await service.consultarCnpjQsa(cnpj, user.uid, tenantCode);

  return c.json({
    success: true,
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
      cost: 0.8788,
      endpoint: 'qsa',
    },
  });
});

/**
 * POST /cnpj/empresa
 * Query CNPJ full data (UNMASKED CPF - ideal for investigations)
 */
serpro.post('/cnpj/empresa', zValidator('json', cnpjSchema), async (c) => {
  const { cnpj } = c.req.valid('json');
  const user = c.get('user') as AuthenticatedUser;
  const tenantCode = c.req.header('X-Tenant-Code') || 'INVESTIGA';

  logger.info('CNPJ empresa query (unmasked CPF)', { uid: user.uid, tenantCode });

  const service = new CnpjService(c.env);
  const result = await service.consultarCnpjEmpresa(cnpj, user.uid, tenantCode);

  return c.json({
    success: true,
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
      cost: 1.1722,
      endpoint: 'empresa',
      note: 'CPF in QSA is UNMASKED',
    },
  });
});

/**
 * POST /cnpj/batch
 * Query multiple CNPJs
 */
serpro.post('/cnpj/batch', zValidator('json', batchCnpjSchema), async (c) => {
  const { cnpjs, level } = c.req.valid('json');
  const user = c.get('user') as AuthenticatedUser;
  const tenantCode = c.req.header('X-Tenant-Code') || 'INVESTIGA';

  logger.info('CNPJ batch query', { uid: user.uid, count: cnpjs.length, level });

  const service = new CnpjService(c.env);
  const results = await service.consultarCnpjBatch(cnpjs, user.uid, tenantCode, level);

  return c.json({
    success: true,
    data: results,
    meta: {
      timestamp: new Date().toISOString(),
      total: results.length,
      requested: cnpjs.length,
      level,
    },
  });
});

// ============================================================================
// DÍVIDA ATIVA ENDPOINTS
// ============================================================================

/**
 * POST /divida-ativa
 * Query federal debts (accepts CPF or CNPJ)
 */
serpro.post('/divida-ativa', zValidator('json', dividaSchema), async (c) => {
  const { ni } = c.req.valid('json');
  const user = c.get('user') as AuthenticatedUser;
  const tenantCode = c.req.header('X-Tenant-Code') || 'INVESTIGA';

  logger.info('Dívida Ativa query', { uid: user.uid, tenantCode });

  const service = new DividaAtivaService(c.env);
  const result = await service.consultarDivida(ni, user.uid, tenantCode);

  return c.json({
    success: true,
    data: result,
    meta: {
      timestamp: new Date().toISOString(),
      cost: 0.6591,
      hasDebts: result.dividas && result.dividas.length > 0,
    },
  });
});

/**
 * POST /divida-ativa/check
 * Quick debt check (returns boolean)
 */
serpro.post('/divida-ativa/check', zValidator('json', dividaSchema), async (c) => {
  const { ni } = c.req.valid('json');
  const user = c.get('user') as AuthenticatedUser;
  const tenantCode = c.req.header('X-Tenant-Code') || 'INVESTIGA';

  const service = new DividaAtivaService(c.env);
  const hasDebts = await service.hasDebts(ni, user.uid, tenantCode);

  return c.json({
    success: true,
    data: { hasDebts },
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * GET /pricing
 * Get pricing information for all endpoints
 */
serpro.get('/pricing', (c) => {
  return c.json({
    success: true,
    data: {
      cpf: {
        single: 0.6591,
        tiers: [
          { range: '1-10,000', price: 0.6591 },
          { range: '10,001-50,000', price: 0.5893 },
          { range: '50,001-100,000', price: 0.5274 },
          { range: '100,001+', price: 0.4719 },
        ],
      },
      cnpj: {
        basica: 0.6591,
        qsa: 0.8788,
        empresa: 1.1722,
      },
      dividaAtiva: {
        single: 0.6591,
      },
    },
    meta: {
      currency: 'BRL',
      unit: 'per query',
    },
  });
});

// ============================================================================
// USAGE STATISTICS (PERSONAL)
// ============================================================================

/**
 * GET /usage/personal
 * Get usage statistics for the authenticated user
 *
 * Query params:
 * - period: 'today' | 'week' | 'month' | 'all' (default: 'month')
 *
 * Response:
 * {
 *   summary: { total_queries, total_cost, avg_response_time, success_rate },
 *   by_api: [{ api_name, queries, cost, avg_response_time }],
 *   by_date: [{ date, queries, cost }],
 *   recent_queries: [{ api_name, document, cost, created_at }]
 * }
 */
serpro.get('/usage/personal', async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    const period = c.req.query('period') || 'month';

    // Calculate date range
    let dateFilter = '';
    const params: any[] = [user.uid];

    if (period === 'today') {
      dateFilter = "AND DATE(created_at) = DATE('now')";
    } else if (period === 'week') {
      dateFilter = "AND created_at >= datetime('now', '-7 days')";
    } else if (period === 'month') {
      dateFilter = "AND created_at >= datetime('now', '-30 days')";
    } else if (period === 'all') {
      dateFilter = '';
    } else {
      // Default to last 30 days
      dateFilter = "AND created_at >= datetime('now', '-30 days')";
    }

    // 1. SUMMARY (totals for user)
    const summaryQuery = `
      SELECT
        COUNT(*) as total_queries,
        COALESCE(SUM(cost), 0) as total_cost,
        COALESCE(AVG(response_time_ms), 0) as avg_response_time,
        ROUND(CAST(SUM(CASE WHEN response_status = 200 THEN 1 ELSE 0 END) AS REAL) / COUNT(*) * 100, 2) as success_rate
      FROM serpro_usage
      WHERE user_id = ? ${dateFilter}
    `;

    const summary = await c.env.DB.prepare(summaryQuery)
      .bind(...params)
      .first();

    // 2. BY API (grouped by API)
    const byApiQuery = `
      SELECT
        api_name,
        COUNT(*) as queries,
        COALESCE(SUM(cost), 0) as cost,
        COALESCE(AVG(response_time_ms), 0) as avg_response_time
      FROM serpro_usage
      WHERE user_id = ? ${dateFilter}
      GROUP BY api_name
      ORDER BY cost DESC
    `;

    const byApi = await c.env.DB.prepare(byApiQuery)
      .bind(...params)
      .all();

    // 3. BY DATE (last 30 days)
    const byDateQuery = `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as queries,
        COALESCE(SUM(cost), 0) as cost
      FROM serpro_usage
      WHERE user_id = ? ${dateFilter}
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `;

    const byDate = await c.env.DB.prepare(byDateQuery)
      .bind(...params)
      .all();

    // 4. RECENT QUERIES (last 10)
    const recentQueriesQuery = `
      SELECT
        api_name,
        document,
        cost,
        response_status,
        response_time_ms,
        created_at
      FROM serpro_usage
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const recentQueries = await c.env.DB.prepare(recentQueriesQuery)
      .bind(user.uid)
      .all();

    return c.json({
      success: true,
      summary: summary || {
        total_queries: 0,
        total_cost: 0,
        avg_response_time: 0,
        success_rate: 0
      },
      by_api: byApi.results || [],
      by_date: byDate.results || [],
      recent_queries: recentQueries.results || [],
      filters: {
        period,
        user_id: user.uid
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });

  } catch (error: any) {
    logger.error('Personal usage stats error', { error: error.message });
    return c.json({
      error: 'Erro ao buscar estatísticas pessoais',
      details: error.message
    }, 500);
  }
});

export default serpro;
