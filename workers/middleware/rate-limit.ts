/**
 * Rate Limiting Middleware
 * Protege contra abuso de API usando Cloudflare KV
 */

import { Context, Next } from 'hono'
import { Env } from '../index'

interface RateLimitConfig {
  requests: number // número de requests permitidos
  window: number // janela de tempo em segundos
  blockDuration: number // tempo de bloqueio em segundos se exceder
}

// Configurações por endpoint
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  // APIs públicas (mais restritivas)
  '/api/leads': { requests: 10, window: 3600, blockDuration: 7200 }, // 10/hora
  '/api/chatbot': { requests: 50, window: 3600, blockDuration: 1800 }, // 50/hora

  // APIs autenticadas (mais permissivas)
  '/api/reports': { requests: 100, window: 3600, blockDuration: 3600 }, // 100/hora
  '/api/payments': { requests: 50, window: 3600, blockDuration: 3600 }, // 50/hora

  // Default (para endpoints não especificados)
  default: { requests: 100, window: 3600, blockDuration: 1800 },
}

/**
 * Middleware de rate limiting
 */
export async function rateLimitMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  try {
    // Obter IP do cliente
    const ip = c.req.header('CF-Connecting-IP') || c.req.header('X-Real-IP') || 'unknown'

    if (ip === 'unknown') {
      // Se não conseguir identificar IP, permitir mas logar
      console.warn('[RATE_LIMIT] Could not identify client IP')
      await next()
      return
    }

    // Obter configuração de rate limit para este endpoint
    const path = c.req.path
    const config = getRateLimitConfig(path)

    // Verificar se IP está bloqueado
    const blockKey = `rate_limit:block:${ip}`
    const blocked = await c.env.KV.get(blockKey)

    if (blocked) {
      return c.json(
        {
          error: true,
          message: 'Muitas requisições. Você foi temporariamente bloqueado.',
          code: 'RATE_LIMIT_BLOCKED',
          retryAfter: parseInt(blocked),
        },
        429
      )
    }

    // Chave para contagem de requests
    const countKey = `rate_limit:count:${ip}:${path}`

    // Obter contagem atual
    const countStr = await c.env.KV.get(countKey)
    const count = countStr ? parseInt(countStr) : 0

    // Verificar se excedeu o limite
    if (count >= config.requests) {
      // Bloquear IP temporariamente
      await c.env.KV.put(blockKey, config.blockDuration.toString(), {
        expirationTtl: config.blockDuration,
      })

      // Log do bloqueio
      console.warn(`[RATE_LIMIT] IP ${ip} blocked for ${config.blockDuration}s`)

      return c.json(
        {
          error: true,
          message: `Limite de ${config.requests} requisições por ${config.window / 60} minutos excedido`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: config.blockDuration,
        },
        429
      )
    }

    // Incrementar contador
    await c.env.KV.put(countKey, (count + 1).toString(), {
      expirationTtl: config.window,
    })

    // Adicionar headers de rate limit
    const remaining = config.requests - count - 1
    const resetTime = Date.now() + config.window * 1000

    c.header('X-RateLimit-Limit', config.requests.toString())
    c.header('X-RateLimit-Remaining', remaining.toString())
    c.header('X-RateLimit-Reset', resetTime.toString())

    await next()
  } catch (error) {
    // Se rate limit falhar, não bloquear request
    console.error('[RATE_LIMIT] Error:', error)
    await next()
  }
}

/**
 * Obter configuração de rate limit para um path
 */
function getRateLimitConfig(path: string): RateLimitConfig {
  // Tentar match exato primeiro
  if (RATE_LIMITS[path]) {
    return RATE_LIMITS[path]
  }

  // Tentar match por prefixo
  for (const [pattern, config] of Object.entries(RATE_LIMITS)) {
    if (pattern !== 'default' && path.startsWith(pattern)) {
      return config
    }
  }

  // Retornar default
  return RATE_LIMITS.default
}

/**
 * Whitelist de IPs (admin, servidores confiáveis)
 * PLACEHOLDER: Implementar se necessário
 */
const WHITELISTED_IPS = [
  // '1.2.3.4', // IP do servidor de monitoramento
  // '5.6.7.8', // IP da VPN corporativa
]

/**
 * Verifica se IP está na whitelist
 */
function isWhitelisted(ip: string): boolean {
  return WHITELISTED_IPS.includes(ip)
}

/**
 * Rate limiting específico por usuário autenticado
 * PLACEHOLDER: Usar em rotas críticas
 */
export async function userRateLimitMiddleware(
  c: Context<{ Bindings: Env }>,
  next: Next,
  config?: RateLimitConfig
) {
  const userId = c.get('userId') as string

  if (!userId) {
    await next()
    return
  }

  const defaultConfig: RateLimitConfig = config || {
    requests: 1000,
    window: 3600,
    blockDuration: 3600,
  }

  const countKey = `rate_limit:user:${userId}:${c.req.path}`
  const countStr = await c.env.KV.get(countKey)
  const count = countStr ? parseInt(countStr) : 0

  if (count >= defaultConfig.requests) {
    return c.json(
      {
        error: true,
        message: 'Limite de requisições excedido para sua conta',
        code: 'USER_RATE_LIMIT_EXCEEDED',
      },
      429
    )
  }

  await c.env.KV.put(countKey, (count + 1).toString(), {
    expirationTtl: defaultConfig.window,
  })

  await next()
}
