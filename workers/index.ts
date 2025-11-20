/**
 * investigaree - Cloudflare Workers Entry Point
 * Main router and request handler
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

// Middleware
import { authMiddleware } from './middleware/auth'
import { rateLimitMiddleware } from './middleware/rate-limit'

// API Routes
import leadsRoutes from './api/leads'
import reportsRoutes from './api/reports'
import paymentsRoutes from './api/payments'
import webhooksRoutes from './api/webhooks'
import chatbotRoutes from './api/chatbot'
import userRoutes from './api/user'
import lgpdRoutes from './api/lgpd'

// Types
export interface Env {
  // KV Namespace
  KV: KVNamespace

  // Secrets
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  FIREBASE_WEB_API_KEY: string
  FIREBASE_ADMIN_CREDENTIALS: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  OPENAI_API_KEY: string
  GOOGLE_API_KEY: string
  GOOGLE_CSE_ID: string
  API_BRASIL_BEARER_TOKEN: string
  API_BRASIL_DEVICE_TOKEN: string
  DEHASHED_EMAIL: string
  DEHASHED_API_KEY: string
  URL_SECRET: string
  JWT_SECRET: string

  // Variables
  ENVIRONMENT: string
  APP_VERSION: string
}

// Initialize Hono app
const app = new Hono<{ Bindings: Env }>()

// ============================================
// GLOBAL MIDDLEWARE
// ============================================

// Logger (development only)
app.use('*', async (c, next) => {
  if (c.env.ENVIRONMENT === 'development') {
    return logger()(c, next)
  }
  await next()
})

// Pretty JSON (development only)
app.use('*', async (c, next) => {
  if (c.env.ENVIRONMENT === 'development') {
    return prettyJSON()(c, next)
  }
  await next()
})

// CORS
app.use('*', cors({
  origin: ['https://investigaree.com.br', 'http://localhost:5173'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600,
  credentials: true,
}))

// Rate Limiting (global)
app.use('*', rateLimitMiddleware)

// ============================================
// HEALTH CHECK
// ============================================

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: c.env.APP_VERSION || '1.0.0',
    environment: c.env.ENVIRONMENT || 'production',
  })
})

app.get('/', (c) => {
  return c.json({
    name: 'investigaree API',
    version: c.env.APP_VERSION || '1.0.0',
    docs: 'https://investigaree.com.br/docs/api',
    status: 'operational',
  })
})

// ============================================
// API ROUTES (PUBLIC)
// ============================================

// Leads (Landing page - no auth required)
app.route('/api/leads', leadsRoutes)

// Chatbot (pode ser usado antes de autenticar)
app.route('/api/chatbot', chatbotRoutes)

// Webhooks (validação via signature)
app.route('/api/webhooks', webhooksRoutes)

// ============================================
// API ROUTES (AUTHENTICATED)
// ============================================

// Aplicar auth middleware para rotas protegidas
app.use('/api/reports/*', authMiddleware)
app.use('/api/payments/*', authMiddleware)
app.use('/api/user/*', authMiddleware)
app.use('/api/lgpd/*', authMiddleware)

// Reports
app.route('/api/reports', reportsRoutes)

// Payments
app.route('/api/payments', paymentsRoutes)

// User profile
app.route('/api/user', userRoutes)

// LGPD (direitos dos titulares)
app.route('/api/lgpd', lgpdRoutes)

// ============================================
// ERROR HANDLING
// ============================================

app.onError((err, c) => {
  console.error(`[ERROR] ${err.message}`, err.stack)

  // Log error to monitoring (futuro: Sentry/Datadog)
  // await logError(err, c)

  const isDev = c.env.ENVIRONMENT === 'development'

  return c.json(
    {
      error: true,
      message: isDev ? err.message : 'Internal Server Error',
      ...(isDev && { stack: err.stack }),
      timestamp: new Date().toISOString(),
    },
    500
  )
})

// 404 Handler
app.notFound((c) => {
  return c.json(
    {
      error: true,
      message: 'Endpoint not found',
      path: c.req.path,
      method: c.req.method,
    },
    404
  )
})

// ============================================
// SCHEDULED EVENTS (Cron)
// ============================================

export default {
  fetch: app.fetch,

  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    // Processar relatórios pendentes a cada 6 horas
    console.log('[CRON] Processing pending reports...')

    // Import cron handler
    const { processPendingReports } = await import('./cron/process-reports')
    await processPendingReports(env)

    console.log('[CRON] Done!')
  },
}
