/**
 * Public REST API Handlers
 * Provides public API endpoints for third-party integrations
 */

import { Env, DecodedToken } from '../types';
import crypto from 'crypto';

interface APIKey {
  id: number;
  tenant_id: number;
  name: string;
  key_prefix: string;
  key_hash: string;
  environment: 'production' | 'test';
  scopes: string;
  rate_limit_requests: number;
  rate_limit_window: number;
  is_active: number;
  last_used_at: string | null;
  requests_count: number;
  webhook_url: string | null;
  webhook_events: string | null;
  created_at: string;
  revoked_at: string | null;
  expires_at: string | null;
}

/**
 * Generate a new API key
 * Format: inv_{environment}_{random32chars}
 */
function generateAPIKey(environment: 'production' | 'test'): { key: string; prefix: string; hash: string } {
  const randomBytes = crypto.randomBytes(24);
  const randomString = randomBytes.toString('base64url'); // URL-safe base64
  const key = `inv_${environment === 'production' ? 'live' : 'test'}_${randomString}`;
  const prefix = key.substring(0, 16); // First 16 chars for display
  const hash = crypto.createHash('sha256').update(key).digest('hex');

  return { key, prefix, hash };
}

/**
 * Verify API key and return associated tenant
 */
async function verifyAPIKey(env: Env, apiKey: string): Promise<{ valid: boolean; apiKeyRecord?: APIKey; error?: string }> {
  if (!apiKey || !apiKey.startsWith('inv_')) {
    return { valid: false, error: 'Invalid API key format' };
  }

  // Hash the provided key
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');

  // Look up the key
  const apiKeyRecord = await env.DB.prepare(`
    SELECT * FROM api_keys WHERE key_hash = ? AND is_active = 1
  `).bind(keyHash).first<APIKey>();

  if (!apiKeyRecord) {
    return { valid: false, error: 'Invalid or revoked API key' };
  }

  // Check expiration
  if (apiKeyRecord.expires_at && new Date(apiKeyRecord.expires_at) < new Date()) {
    return { valid: false, error: 'API key expired' };
  }

  return { valid: true, apiKeyRecord };
}

/**
 * Rate limiting with Token Bucket algorithm
 */
async function checkRateLimit(
  env: Env,
  apiKeyId: number,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Math.floor(Date.now() / 1000);
  const windowKey = `ratelimit:${apiKeyId}:${Math.floor(now / windowSeconds)}`;

  // Get current count from KV (if available) or calculate from DB
  // For simplicity, we'll use DB-based counting
  const recentRequests = await env.DB.prepare(`
    SELECT COUNT(*) as count
    FROM api_request_logs
    WHERE api_key_id = ?
      AND created_at >= datetime('now', '-${windowSeconds} seconds')
  `).bind(apiKeyId).first<{ count: number }>();

  const count = recentRequests?.count || 0;
  const remaining = Math.max(0, limit - count - 1); // -1 for current request
  const allowed = count < limit;
  const resetAt = Math.floor(now / windowSeconds) * windowSeconds + windowSeconds;

  return { allowed, remaining, resetAt };
}

/**
 * Log API request
 */
async function logAPIRequest(
  env: Env,
  apiKeyId: number,
  tenantId: number,
  method: string,
  endpoint: string,
  statusCode: number,
  requestIp?: string,
  userAgent?: string,
  responseTimeMs?: number,
  errorMessage?: string,
  rateLimitRemaining?: number,
  rateLimitReset?: number
): Promise<void> {
  await env.DB.prepare(`
    INSERT INTO api_request_logs (
      api_key_id, tenant_id, method, endpoint, status_code,
      request_ip, user_agent, response_time_ms, error_message,
      rate_limit_remaining, rate_limit_reset
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    apiKeyId,
    tenantId,
    method,
    endpoint,
    statusCode,
    requestIp || null,
    userAgent || null,
    responseTimeMs || null,
    errorMessage || null,
    rateLimitRemaining || null,
    rateLimitReset || null
  ).run();

  // Update last_used_at and increment requests_count
  await env.DB.prepare(`
    UPDATE api_keys
    SET last_used_at = datetime('now'),
        requests_count = requests_count + 1
    WHERE id = ?
  `).bind(apiKeyId).run();
}

/**
 * Middleware: Authenticate API key
 */
export async function authenticateAPIKey(request: Request, env: Env): Promise<{ apiKey: APIKey } | Response> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({
      error: 'Missing or invalid Authorization header',
      message: 'Expected: Authorization: Bearer inv_live_...'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = authHeader.substring(7); // Remove "Bearer "
  const verification = await verifyAPIKey(env, apiKey);

  if (!verification.valid || !verification.apiKeyRecord) {
    return new Response(JSON.stringify({
      error: 'Invalid API key',
      message: verification.error
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return { apiKey: verification.apiKeyRecord };
}

/**
 * POST /v1/investigations/cpf
 * Create CPF investigation via public API
 */
export async function handlePublicInvestigateCPF(
  request: Request,
  env: Env,
  apiKey: APIKey
): Promise<Response> {
  const startTime = Date.now();

  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(
      env,
      apiKey.id,
      apiKey.rate_limit_requests,
      apiKey.rate_limit_window
    );

    if (!rateLimit.allowed) {
      await logAPIRequest(
        env,
        apiKey.id,
        apiKey.tenant_id,
        'POST',
        '/v1/investigations/cpf',
        429,
        request.headers.get('CF-Connecting-IP') || undefined,
        request.headers.get('User-Agent') || undefined,
        Date.now() - startTime,
        'Rate limit exceeded'
      );

      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        message: `Too many requests. Limit: ${apiKey.rate_limit_requests} requests per ${apiKey.rate_limit_window}s`,
        retry_after: rateLimit.resetAt
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': apiKey.rate_limit_requests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          'Retry-After': (rateLimit.resetAt - Math.floor(Date.now() / 1000)).toString()
        }
      });
    }

    // Parse request body
    const body = await request.json() as { cpf: string; webhook_url?: string };

    if (!body.cpf) {
      throw new Error('CPF is required');
    }

    // TODO: Create investigation in database
    // For now, return a mock response
    const investigationId = Math.floor(Math.random() * 100000);

    await logAPIRequest(
      env,
      apiKey.id,
      apiKey.tenant_id,
      'POST',
      '/v1/investigations/cpf',
      201,
      request.headers.get('CF-Connecting-IP') || undefined,
      request.headers.get('User-Agent') || undefined,
      Date.now() - startTime,
      undefined,
      rateLimit.remaining,
      rateLimit.resetAt
    );

    return new Response(JSON.stringify({
      id: investigationId,
      status: 'pending',
      cpf: body.cpf.replace(/\d(?=\d{4})/g, '*'), // Mask CPF
      created_at: new Date().toISOString(),
      webhook_url: body.webhook_url || apiKey.webhook_url
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': apiKey.rate_limit_requests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetAt.toString()
      }
    });

  } catch (error: any) {
    await logAPIRequest(
      env,
      apiKey.id,
      apiKey.tenant_id,
      'POST',
      '/v1/investigations/cpf',
      400,
      request.headers.get('CF-Connecting-IP') || undefined,
      request.headers.get('User-Agent') || undefined,
      Date.now() - startTime,
      error.message
    );

    return new Response(JSON.stringify({
      error: 'Bad request',
      message: error.message
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /v1/investigations/cnpj
 * Create CNPJ investigation via public API
 */
export async function handlePublicInvestigateCNPJ(
  request: Request,
  env: Env,
  apiKey: APIKey
): Promise<Response> {
  const startTime = Date.now();

  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(
      env,
      apiKey.id,
      apiKey.rate_limit_requests,
      apiKey.rate_limit_window
    );

    if (!rateLimit.allowed) {
      await logAPIRequest(
        env,
        apiKey.id,
        apiKey.tenant_id,
        'POST',
        '/v1/investigations/cnpj',
        429,
        request.headers.get('CF-Connecting-IP') || undefined,
        request.headers.get('User-Agent') || undefined,
        Date.now() - startTime,
        'Rate limit exceeded'
      );

      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        message: `Too many requests. Limit: ${apiKey.rate_limit_requests} requests per ${apiKey.rate_limit_window}s`,
        retry_after: rateLimit.resetAt
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': apiKey.rate_limit_requests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetAt.toString()
        }
      });
    }

    // Parse request body
    const body = await request.json() as { cnpj: string; webhook_url?: string };

    if (!body.cnpj) {
      throw new Error('CNPJ is required');
    }

    // TODO: Create investigation in database
    const investigationId = Math.floor(Math.random() * 100000);

    await logAPIRequest(
      env,
      apiKey.id,
      apiKey.tenant_id,
      'POST',
      '/v1/investigations/cnpj',
      201,
      request.headers.get('CF-Connecting-IP') || undefined,
      request.headers.get('User-Agent') || undefined,
      Date.now() - startTime,
      undefined,
      rateLimit.remaining,
      rateLimit.resetAt
    );

    return new Response(JSON.stringify({
      id: investigationId,
      status: 'pending',
      cnpj: body.cnpj,
      created_at: new Date().toISOString(),
      webhook_url: body.webhook_url || apiKey.webhook_url
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': apiKey.rate_limit_requests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetAt.toString()
      }
    });

  } catch (error: any) {
    await logAPIRequest(
      env,
      apiKey.id,
      apiKey.tenant_id,
      'POST',
      '/v1/investigations/cnpj',
      400,
      request.headers.get('CF-Connecting-IP') || undefined,
      request.headers.get('User-Agent') || undefined,
      Date.now() - startTime,
      error.message
    );

    return new Response(JSON.stringify({
      error: 'Bad request',
      message: error.message
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /v1/investigations/:id
 * Get investigation status via public API
 */
export async function handlePublicGetInvestigation(
  request: Request,
  env: Env,
  apiKey: APIKey,
  investigationId: string
): Promise<Response> {
  const startTime = Date.now();

  try {
    // Rate limiting
    const rateLimit = await checkRateLimit(
      env,
      apiKey.id,
      apiKey.rate_limit_requests,
      apiKey.rate_limit_window
    );

    if (!rateLimit.allowed) {
      await logAPIRequest(
        env,
        apiKey.id,
        apiKey.tenant_id,
        'GET',
        `/v1/investigations/${investigationId}`,
        429,
        request.headers.get('CF-Connecting-IP') || undefined,
        request.headers.get('User-Agent') || undefined,
        Date.now() - startTime,
        'Rate limit exceeded'
      );

      return new Response(JSON.stringify({
        error: 'Rate limit exceeded'
      }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': apiKey.rate_limit_requests.toString(),
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': rateLimit.resetAt.toString()
        }
      });
    }

    // TODO: Fetch investigation from database
    // For now, return mock data
    await logAPIRequest(
      env,
      apiKey.id,
      apiKey.tenant_id,
      'GET',
      `/v1/investigations/${investigationId}`,
      200,
      request.headers.get('CF-Connecting-IP') || undefined,
      request.headers.get('User-Agent') || undefined,
      Date.now() - startTime,
      undefined,
      rateLimit.remaining,
      rateLimit.resetAt
    );

    return new Response(JSON.stringify({
      id: investigationId,
      status: 'completed',
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      result: {
        // Mock result
        found: true,
        data: {}
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': apiKey.rate_limit_requests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetAt.toString()
      }
    });

  } catch (error: any) {
    await logAPIRequest(
      env,
      apiKey.id,
      apiKey.tenant_id,
      'GET',
      `/v1/investigations/${investigationId}`,
      500,
      request.headers.get('CF-Connecting-IP') || undefined,
      request.headers.get('User-Agent') || undefined,
      Date.now() - startTime,
      error.message
    );

    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * ========================================
 * API KEY MANAGEMENT HANDLERS (Internal)
 * For authenticated users to manage their API keys
 * ========================================
 */

/**
 * POST /api/api-keys
 * Create a new API key
 */
export async function handleCreateAPIKey(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      name: string;
      environment: 'production' | 'test';
      scopes?: string;
      rate_limit_requests?: number;
      rate_limit_window?: number;
      webhook_url?: string;
      webhook_events?: string;
      expires_at?: string;
    };

    if (!body.name || !body.environment) {
      return new Response(JSON.stringify({
        error: 'Missing required fields',
        message: 'name and environment are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate API key
    const { key, prefix, hash } = generateAPIKey(body.environment);

    // Insert into database
    const result = await env.DB.prepare(`
      INSERT INTO api_keys (
        tenant_id, name, key_prefix, key_hash, environment, scopes,
        rate_limit_requests, rate_limit_window, webhook_url, webhook_events, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      user.tenantId,
      body.name,
      prefix,
      hash,
      body.environment,
      body.scopes || 'read,write',
      body.rate_limit_requests || 100,
      body.rate_limit_window || 60,
      body.webhook_url || null,
      body.webhook_events || null,
      body.expires_at || null
    ).run();

    if (!result.success) {
      throw new Error('Failed to create API key');
    }

    // Fetch the created key record
    const apiKeyRecord = await env.DB.prepare(`
      SELECT * FROM api_keys WHERE key_hash = ?
    `).bind(hash).first<APIKey>();

    return new Response(JSON.stringify({
      success: true,
      api_key: key, // Only returned once during creation
      key_prefix: prefix,
      record: {
        ...apiKeyRecord,
        key_hash: undefined // Don't expose hash
      },
      message: 'API key criada com sucesso. Guarde a chave em local seguro, ela não será exibida novamente.'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Create API key error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create API key',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/api-keys
 * List all API keys for the current tenant
 */
export async function handleListAPIKeys(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const includeRevoked = url.searchParams.get('include_revoked') === 'true';

    let query = `
      SELECT id, tenant_id, name, key_prefix, environment, scopes,
             rate_limit_requests, rate_limit_window, is_active,
             last_used_at, requests_count, webhook_url, webhook_events,
             created_at, revoked_at, expires_at
      FROM api_keys
      WHERE tenant_id = ?
    `;

    if (!includeRevoked) {
      query += ` AND is_active = 1`;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await env.DB.prepare(query).bind(user.tenantId).all<APIKey>();

    return new Response(JSON.stringify({
      success: true,
      api_keys: result.results,
      total: result.results.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('List API keys error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to list API keys',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * DELETE /api/api-keys/:id
 * Revoke/delete an API key
 */
export async function handleRevokeAPIKey(
  request: Request,
  env: Env,
  user: DecodedToken,
  keyId: string
): Promise<Response> {
  try {
    // Verify ownership
    const apiKey = await env.DB.prepare(`
      SELECT * FROM api_keys WHERE id = ? AND tenant_id = ?
    `).bind(keyId, user.tenantId).first<APIKey>();

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'API key not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Revoke the key
    await env.DB.prepare(`
      UPDATE api_keys
      SET is_active = 0, revoked_at = datetime('now')
      WHERE id = ?
    `).bind(keyId).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'API key revogada com sucesso'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Revoke API key error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to revoke API key',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/api-keys/:id/stats
 * Get usage statistics for an API key
 */
export async function handleGetAPIKeyStats(
  request: Request,
  env: Env,
  user: DecodedToken,
  keyId: string
): Promise<Response> {
  try {
    // Verify ownership
    const apiKey = await env.DB.prepare(`
      SELECT * FROM api_keys WHERE id = ? AND tenant_id = ?
    `).bind(keyId, user.tenantId).first<APIKey>();

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'API key not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get request statistics
    const stats = await env.DB.prepare(`
      SELECT
        COUNT(*) as total_requests,
        COUNT(CASE WHEN status_code >= 200 AND status_code < 300 THEN 1 END) as successful_requests,
        COUNT(CASE WHEN status_code >= 400 THEN 1 END) as failed_requests,
        AVG(response_time_ms) as avg_response_time,
        MAX(created_at) as last_request_at
      FROM api_request_logs
      WHERE api_key_id = ?
    `).bind(keyId).first<{
      total_requests: number;
      successful_requests: number;
      failed_requests: number;
      avg_response_time: number;
      last_request_at: string;
    }>();

    // Get recent requests (last 100)
    const recentRequests = await env.DB.prepare(`
      SELECT method, endpoint, status_code, response_time_ms, created_at
      FROM api_request_logs
      WHERE api_key_id = ?
      ORDER BY created_at DESC
      LIMIT 100
    `).bind(keyId).all();

    return new Response(JSON.stringify({
      success: true,
      api_key: {
        ...apiKey,
        key_hash: undefined // Don't expose hash
      },
      stats,
      recent_requests: recentRequests.results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Get API key stats error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get API key stats',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
