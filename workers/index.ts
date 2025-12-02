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
import authRoutes from './api/auth'
import leadsRoutes from './api/leads'
import reportsRoutes from './api/reports'
import paymentsRoutes from './api/payments'
import webhooksRoutes from './api/webhooks'
import chatbotRoutes from './api/chatbot'
import userRoutes from './api/user'
import lgpdRoutes from './api/lgpd'
import investigationRoutes from './api/investigation'
import consultasPublicasRoutes from './api/consultas-publicas'
import infosimplesRoutes from './api/consultas-infosimples'
import transparenciaRoutes from './api/consultas-transparencia'
import tenantDataRoutes from './api/tenant-data'
import adminRoutes from './api/admin'
import userDataRoutes from './api/user-data'
import investigationsRoutes from './api/investigations'

// Types
export interface Env {
  // D1 Database
  DB: D1Database

  // KV Namespace
  KV: KVNamespace

  // R2 Storage
  R2: R2Bucket

  // Browser Rendering
  BROWSER: Fetcher

  // Secrets
  RESEND_API_KEY: string
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

  // APIs de Consulta
  INFOSIMPLES_API_TOKEN: string
  PORTAL_TRANSPARENCIA_API_KEY: string

  // PDF Generation (fallback)
  HTML2PDF_API_KEY?: string

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
  origin: [
    'https://investigaree.com.br',
    'https://www.investigaree.com.br',
    'https://investigaree.pages.dev',
    'https://*.investigaree.pages.dev',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Request-Id'],
  maxAge: 600,
  credentials: true,
}))

// Rate Limiting (only for API routes, not static assets)
app.use('/api/*', rateLimitMiddleware)
app.use('/health', rateLimitMiddleware)

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

// API Root
app.get('/', (c) => {
  return c.json({
    name: 'investigaree API',
    version: c.env.APP_VERSION || '1.0.0',
    docs: 'https://investigaree.com.br/docs/api',
    status: 'operational',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      leads: '/api/leads',
      chatbot: '/api/chatbot/message',
      reports: '/api/reports',
      payments: '/api/payments',
      webhooks: '/api/webhooks/stripe',
      user: '/api/user',
      lgpd: '/api/lgpd',
      consultas: '/api/consultas',
      infosimples: '/api/infosimples',
      transparencia: '/api/transparencia',
    },
  })
})

// ============================================
// API ROUTES (PUBLIC)
// ============================================

// Auth (Registration - no auth required)
app.route('/api/auth', authRoutes)

// Leads (Landing page - no auth required)
app.route('/api/leads', leadsRoutes)

// Chatbot (pode ser usado antes de autenticar)
app.route('/api/chatbot', chatbotRoutes)

// Investigation requests (public - sends email)
app.route('/api/investigation', investigationRoutes)

// Consultas públicas (APIs gratuitas - Brasil API, TSE, Receita)
app.route('/api/consultas', consultasPublicasRoutes)

// Consultas Infosimples (API paga - CPF, CNPJ, processos, doações)
app.route('/api/infosimples', infosimplesRoutes)

// Consultas Portal da Transparência (servidores, CEIS, CNEP, CEAF)
app.route('/api/transparencia', transparenciaRoutes)

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
app.use('/api/tenant/*', authMiddleware)
app.use('/api/admin/*', authMiddleware)
app.use('/api/userdata/*', authMiddleware)
app.use('/api/investigations/*', authMiddleware)

// Reports
app.route('/api/reports', reportsRoutes)

// Payments
app.route('/api/payments', paymentsRoutes)

// User profile
app.route('/api/user', userRoutes)

// LGPD (direitos dos titulares)
app.route('/api/lgpd', lgpdRoutes)

// Tenant Data (dados multi-tenant com isolamento)
app.route('/api/tenant', tenantDataRoutes)

// Admin (gerenciamento de usuários e tenants)
app.route('/api/admin', adminRoutes)

// User Data (dados individuais do usuario - isolados por user_id)
app.route('/api/userdata', userDataRoutes)

// Investigations (investigações do usuário)
app.route('/api/investigations', investigationsRoutes)

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

// 404 Handler for API routes only
app.notFound((c) => {
  // Only return JSON 404 for API routes
  if (c.req.path.startsWith('/api/') || c.req.path === '/health') {
    return c.json(
      {
        error: true,
        message: 'Endpoint not found',
        path: c.req.path,
        method: c.req.method,
      },
      404
    )
  }

  // For all other routes, this should not be reached due to static serving
  return c.text('Not Found', 404)
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
