/**
 * Rate Limiting Utilities
 * Implements tiered rate limiting based on user plans
 *
 * References:
 * - https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/
 * - https://developers.cloudflare.com/waf/rate-limiting-rules/best-practices/
 */

import { Env, RateLimiter, DecodedToken } from './types';

/**
 * Rate limit tiers per plan
 */
export const RATE_LIMIT_TIERS = {
  free: {
    global: { limit: 100, period: 60 },           // 100 requests/min
    api: { limit: 50, period: 60 },               // 50 requests/min
    investigations: { limit: 20, period: 60 },    // 20 investigations/min
    batch: { limit: 5, period: 60 },              // 5 batch ops/min
  },
  pro: {
    global: { limit: 500, period: 60 },           // 500 requests/min
    api: { limit: 250, period: 60 },              // 250 requests/min
    investigations: { limit: 100, period: 60 },   // 100 investigations/min
    batch: { limit: 25, period: 60 },             // 25 batch ops/min
  },
  enterprise: {
    global: { limit: 2000, period: 60 },          // 2000 requests/min
    api: { limit: 1000, period: 60 },             // 1000 requests/min
    investigations: { limit: 500, period: 60 },   // 500 investigations/min
    batch: { limit: 100, period: 60 },            // 100 batch ops/min
  },
} as const;

export type RateLimitType = 'global' | 'api' | 'investigations' | 'batch';
export type PlanTier = 'free' | 'pro' | 'enterprise';

/**
 * Rate limit result with headers
 */
export interface RateLimitResult {
  allowed: boolean;
  headers: Record<string, string>;
  retryAfter?: number;
}

/**
 * Get user's plan tier from token
 */
export function getUserPlanTier(user?: DecodedToken): PlanTier {
  // In production, this would come from the user's actual plan
  // For now, default to 'free'
  // TODO: Integrate with plan-limits system to get actual plan
  return 'free';
}

/**
 * Get rate limiter for a specific type
 */
export function getRateLimiter(env: Env, type: RateLimitType): RateLimiter {
  switch (type) {
    case 'global':
      return env.RATE_LIMITER_GLOBAL;
    case 'api':
      return env.RATE_LIMITER_API;
    case 'investigations':
      return env.RATE_LIMITER_INVESTIGATIONS;
    case 'batch':
      return env.RATE_LIMITER_BATCH;
  }
}

/**
 * Get rate limit configuration for plan tier
 */
export function getRateLimitConfig(planTier: PlanTier, type: RateLimitType) {
  return RATE_LIMIT_TIERS[planTier][type];
}

/**
 * Generate rate limit key from user/tenant
 */
export function generateRateLimitKey(
  type: RateLimitType,
  identifier: string
): string {
  return `${type}:${identifier}`;
}

/**
 * Check rate limit for a request
 */
export async function checkRateLimit(
  env: Env,
  type: RateLimitType,
  identifier: string,
  planTier?: PlanTier
): Promise<RateLimitResult> {
  try {
    const tier = planTier || 'free';
    const config = getRateLimitConfig(tier, type);
    const limiter = getRateLimiter(env, type);
    const key = generateRateLimitKey(type, identifier);

    const { success } = await limiter.limit({ key });

    const headers: Record<string, string> = {
      'X-RateLimit-Limit': config.limit.toString(),
      'X-RateLimit-Window': `${config.period}s`,
      'X-RateLimit-Policy': `${config.limit};w=${config.period}`,
    };

    if (!success) {
      // Rate limit exceeded
      const retryAfter = config.period; // Simplified: full window duration
      headers['Retry-After'] = retryAfter.toString();
      headers['X-RateLimit-Remaining'] = '0';

      return {
        allowed: false,
        headers,
        retryAfter,
      };
    }

    // Success - we don't know exact remaining count due to edge caching
    // This is expected behavior per Cloudflare docs
    return {
      allowed: true,
      headers,
    };
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Fail open - allow request if rate limiting fails
    return {
      allowed: true,
      headers: {},
    };
  }
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: Response,
  headers: Record<string, string>
): Response {
  const newHeaders = new Headers(response.headers);
  Object.entries(headers).forEach(([key, value]) => {
    newHeaders.set(key, value);
  });

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/**
 * Create 429 Too Many Requests response
 */
export function createRateLimitResponse(
  rateLimitResult: RateLimitResult,
  corsHeaders?: Record<string, string>
): Response {
  const body = JSON.stringify({
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.',
    retry_after: rateLimitResult.retryAfter,
  });

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...rateLimitResult.headers,
    ...(corsHeaders || {}),
  };

  return new Response(body, {
    status: 429,
    headers,
  });
}

/**
 * Middleware to apply rate limiting to a handler
 */
export async function withRateLimit<T>(
  env: Env,
  type: RateLimitType,
  identifier: string,
  handler: () => Promise<T>,
  planTier?: PlanTier,
  corsHeaders?: Record<string, string>
): Promise<Response | T> {
  const rateLimitResult = await checkRateLimit(env, type, identifier, planTier);

  if (!rateLimitResult.allowed) {
    return createRateLimitResponse(rateLimitResult, corsHeaders);
  }

  // Execute handler and add rate limit headers to response
  const result = await handler();

  if (result instanceof Response) {
    return addRateLimitHeaders(result, rateLimitResult.headers);
  }

  return result;
}

/**
 * Check multiple rate limits simultaneously
 * Returns first failing limit, or success if all pass
 */
export async function checkMultipleRateLimits(
  env: Env,
  checks: Array<{ type: RateLimitType; identifier: string; planTier?: PlanTier }>
): Promise<RateLimitResult> {
  const results = await Promise.all(
    checks.map(({ type, identifier, planTier }) =>
      checkRateLimit(env, type, identifier, planTier)
    )
  );

  // Find first failure
  const failure = results.find((r) => !r.allowed);
  if (failure) {
    return failure;
  }

  // All passed - merge headers
  const mergedHeaders: Record<string, string> = {};
  results.forEach((r) => {
    Object.assign(mergedHeaders, r.headers);
  });

  return {
    allowed: true,
    headers: mergedHeaders,
  };
}
