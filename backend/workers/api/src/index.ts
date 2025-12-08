// ============================================================================
// INVESTIGAREE BACKEND API
// Agent 2 - Backend Engineer
// Main entry point for Cloudflare Workers API
// ============================================================================

import { Hono } from 'hono';
import type { Env } from './types/api.types';
import { corsMiddleware } from './middleware/cors';
import { authMiddleware } from './middleware/auth';
import { rateLimitMiddleware } from './middleware/rateLimit';
import { ApiError } from './utils/errors';
import { logger } from './utils/logger';
import serproRoutes from './routes/serpro.routes';
import dadosRoutes from './routes/dados.routes';
import usageRoutes from './routes/usage.routes';
import investigacoesRoutes from './routes/investigacoes.routes';
import tenantsRoutes from './routes/tenants.routes';
import serproCredentialsRoutes from './routes/serpro-credentials.routes';
import { processJobs } from './cron/process-jobs';

// ============================================================================
// APP INITIALIZATION
// ============================================================================

const app = new Hono<{ Bindings: Env }>();

// ============================================================================
// GLOBAL MIDDLEWARES
// ============================================================================

// CORS - must be first
app.use('*', corsMiddleware);

// Request logging
app.use('*', async (c, next) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  logger.info('Request received', { method, path });

  await next();

  const duration = Date.now() - start;
  const status = c.res.status;

  logger.info('Request completed', { method, path, status, duration });
});

// ============================================================================
// PUBLIC ROUTES (no auth required)
// ============================================================================

/**
 * GET /
 * API root - basic info
 */
app.get('/', (c) => {
  return c.json({
    name: 'Investigaree API',
    version: '1.0.0',
    status: 'operational',
    environment: c.env.ENVIRONMENT || 'production',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      serpro: '/api/serpro/*',
      admin: '/api/admin/*',
      usage: '/api/admin/serpro/usage',
      investigacoes: '/api/investigacoes',
      tenants: '/api/tenants',
    },
    documentation: 'https://investigaree.com.br/docs/api',
  });
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', async (c) => {
  // Check database connection
  let dbStatus = 'ok';
  try {
    await c.env.DB.prepare('SELECT 1').first();
  } catch (error) {
    dbStatus = 'error';
    logger.error('Database health check failed', error);
  }

  const healthy = dbStatus === 'ok';

  return c.json(
    {
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: dbStatus,
      },
    },
    healthy ? 200 : 503
  );
});

/**
 * GET /ping
 * Simple ping endpoint
 */
app.get('/ping', (c) => {
  return c.text('pong');
});

// ============================================================================
// PROTECTED ROUTES (auth + rate limit required)
// ============================================================================

// Apply auth and rate limiting to all /api/* routes
app.use('/api/*', authMiddleware);
app.use('/api/*', rateLimitMiddleware);

// Mount SERPRO routes
app.route('/api/serpro', serproRoutes);

// Mount Dados routes (admin only)
app.route('/api/admin', dadosRoutes);

// Mount Usage/Stats routes (admin only)
app.route('/api/admin/serpro', usageRoutes);

// Mount Investigacoes routes (authenticated users)
app.route('/api/investigacoes', investigacoesRoutes);

// Mount Tenants routes (authenticated users, some admin-only)
app.route('/api/tenants', tenantsRoutes);

// Mount SERPRO Credentials Management routes (admin only)
app.route('/api/admin/serpro-credentials', serproCredentialsRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

/**
 * Global error handler
 * Catches all errors and returns consistent JSON responses
 */
app.onError((err, c) => {
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: c.req.path,
    method: c.req.method,
  });

  // Handle known API errors
  if (err instanceof ApiError) {
    return c.json(err.toJSON(), err.statusCode);
  }

  // Handle unknown errors
  return c.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
        details:
          c.env.ENVIRONMENT === 'development'
            ? {
                message: err.message,
                stack: err.stack,
              }
            : undefined,
      },
    },
    500
  );
});

/**
 * 404 Not Found handler
 */
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route not found: ${c.req.method} ${c.req.path}`,
      },
    },
    404
  );
});

// ============================================================================
// EXPORT
// ============================================================================

export default {
  /**
   * HTTP Request Handler
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return app.fetch(request, env, ctx);
  },

  /**
   * Scheduled Event Handler (Cron Triggers)
   * Executa a cada 1 hora (configurado em wrangler.toml)
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    logger.info('[Cron] Scheduled event triggered', { cron: event.cron });
    ctx.waitUntil(processJobs(env));
  },
};
