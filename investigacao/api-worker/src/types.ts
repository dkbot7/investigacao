/**
 * Types para Cloudflare Worker API
 */

/**
 * Rate Limiter binding type
 */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
  ENVIRONMENT: string;

  // Rate Limiting bindings
  RATE_LIMITER_GLOBAL: RateLimiter;
  RATE_LIMITER_API: RateLimiter;
  RATE_LIMITER_INVESTIGATIONS: RateLimiter;
  RATE_LIMITER_BATCH: RateLimiter;
}

export interface DecodedToken {
  uid: string;
  email?: string;
  email_verified?: boolean;
  exp: number;
  iat: number;
}

export interface AuthContext {
  uid: string;
  email: string;
  tenantId: string;
  role: 'admin' | 'editor' | 'viewer';
  userId: string; // ID do registro na tabela users
}
