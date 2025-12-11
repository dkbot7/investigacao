// ============================================================================
// RATE LIMIT MIDDLEWARE
// Agent 2 - Backend Engineer
// Prevent API abuse with rate limiting (60 req/min per user)
// ============================================================================

import type { Context, Next } from 'hono';
import type { Env, AuthenticatedUser, ContextVariables } from '../types/api.types';
import { RateLimitError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * In-memory rate limit tracker
 * Maps user:minute -> count
 *
 * Note: This is per-worker instance. For distributed rate limiting,
 * consider using Cloudflare KV or Durable Objects
 */
const rateLimitMap = new Map<
  string,
  {
    count: number;
    resetAt: number;
  }
>();

/**
 * Rate limit configuration
 */
const RATE_LIMIT_CONFIG = {
  maxRequests: 60, // Maximum requests per window
  windowMs: 60 * 1000, // 1 minute window
};

/**
 * Rate limiting middleware
 * Limits users to 60 requests per minute
 */
export async function rateLimitMiddleware(c: Context<{ Bindings: Env; Variables: ContextVariables }>, next: Next) {
  const user = c.get('user') as AuthenticatedUser | undefined;

  if (!user) {
    // If no user, skip rate limiting (auth middleware should have caught this)
    await next();
    return;
  }

  // Create rate limit key: user:minute
  const now = Date.now();
  const minute = Math.floor(now / RATE_LIMIT_CONFIG.windowMs);
  const key = `${user.uid}:${minute}`;

  // Get or create rate limit entry
  let limit = rateLimitMap.get(key);

  if (!limit) {
    // New window
    limit = {
      count: 0,
      resetAt: (minute + 1) * RATE_LIMIT_CONFIG.windowMs,
    };
    rateLimitMap.set(key, limit);

    // Clean up old entries (older than 2 minutes)
    const twoMinutesAgo = minute - 2;
    for (const [k] of rateLimitMap) {
      const keyMinute = parseInt(k.split(':')[1]);
      if (keyMinute < twoMinutesAgo) {
        rateLimitMap.delete(k);
      }
    }
  }

  // Increment counter
  limit.count++;

  // Check if limit exceeded
  if (limit.count > RATE_LIMIT_CONFIG.maxRequests) {
    const retryAfter = Math.ceil((limit.resetAt - now) / 1000);

    logger.warn('Rate limit exceeded', {
      uid: user.uid,
      count: limit.count,
      limit: RATE_LIMIT_CONFIG.maxRequests,
      retryAfter,
    });

    // Set Retry-After header
    c.header('Retry-After', retryAfter.toString());
    c.header('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
    c.header('X-RateLimit-Remaining', '0');
    c.header('X-RateLimit-Reset', limit.resetAt.toString());

    throw new RateLimitError(
      `Rate limit exceeded. Maximum ${RATE_LIMIT_CONFIG.maxRequests} requests per minute. Try again in ${retryAfter} seconds.`
    );
  }

  // Set rate limit headers
  const remaining = RATE_LIMIT_CONFIG.maxRequests - limit.count;
  c.header('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests.toString());
  c.header('X-RateLimit-Remaining', remaining.toString());
  c.header('X-RateLimit-Reset', limit.resetAt.toString());

  await next();
}

/**
 * Get rate limit info for a user
 * Useful for debugging or dashboard display
 */
export function getRateLimitInfo(userId: string): {
  limit: number;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const minute = Math.floor(now / RATE_LIMIT_CONFIG.windowMs);
  const key = `${userId}:${minute}`;

  const limit = rateLimitMap.get(key);

  if (!limit) {
    return {
      limit: RATE_LIMIT_CONFIG.maxRequests,
      remaining: RATE_LIMIT_CONFIG.maxRequests,
      resetAt: (minute + 1) * RATE_LIMIT_CONFIG.windowMs,
    };
  }

  return {
    limit: RATE_LIMIT_CONFIG.maxRequests,
    remaining: Math.max(0, RATE_LIMIT_CONFIG.maxRequests - limit.count),
    resetAt: limit.resetAt,
  };
}
