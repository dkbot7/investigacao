/**
 * Cache Management Handlers
 * Administrative endpoints for cache control
 */

import { Env, DecodedToken } from '../types';
import { purgeCache, warmCache, CACHE_STRATEGIES } from '../cache';

/**
 * POST /api/admin/cache/purge
 * Purge cache for specific patterns (admin only)
 */
export async function handlePurgeCache(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as { pattern?: string; patterns?: string[] };

    const patterns = body.patterns || (body.pattern ? [body.pattern] : []);

    if (patterns.length === 0) {
      return new Response(JSON.stringify({
        error: 'Patterns required',
        message: 'Provide pattern or patterns array'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let totalPurged = 0;
    for (const pattern of patterns) {
      const purged = await purgeCache(pattern);
      totalPurged += purged;
    }

    return new Response(JSON.stringify({
      success: true,
      purged: totalPurged,
      patterns
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Purge cache error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to purge cache',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/admin/cache/warm
 * Warm cache for common routes (admin only)
 */
export async function handleWarmCache(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as { routes?: string[] };

    const routes = body.routes || [
      '/',
      '/about',
      '/pricing',
      '/blog',
      '/api/plan-limits/plans',
    ];

    await warmCache(env, routes);

    return new Response(JSON.stringify({
      success: true,
      warmed: routes.length,
      routes
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Warm cache error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to warm cache',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/admin/cache/strategies
 * Get available cache strategies (admin only)
 */
export async function handleGetCacheStrategies(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    return new Response(JSON.stringify({
      success: true,
      strategies: Object.entries(CACHE_STRATEGIES).map(([name, config]) => ({
        name,
        ...config
      }))
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Get cache strategies error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get strategies',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/cache/stats
 * Get cache statistics (public)
 */
export async function handleGetCacheStats(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // In a production system, you'd track cache hits/misses
    // For now, return basic info
    return new Response(JSON.stringify({
      success: true,
      strategies: Object.keys(CACHE_STRATEGIES),
      info: {
        message: 'Edge caching is active',
        check_headers: 'Look for X-Cache-Status and X-Cache-Strategy headers'
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    });

  } catch (error: any) {
    console.error('Get cache stats error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get stats',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
