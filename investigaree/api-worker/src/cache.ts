/**
 * Edge Caching Utilities for Cloudflare Workers
 * Implements aggressive caching strategies for maximum performance
 */

import { Env } from './types';

/**
 * Cache configuration per route type
 */
export const CACHE_STRATEGIES = {
  // Static assets - Very long cache (1 year)
  STATIC_ASSETS: {
    maxAge: 31536000, // 1 year
    sMaxAge: 31536000,
    staleWhileRevalidate: 86400, // 1 day
    browserCache: true,
  },

  // Public data - Long cache (1 hour)
  PUBLIC_DATA: {
    maxAge: 3600, // 1 hour
    sMaxAge: 3600,
    staleWhileRevalidate: 300, // 5 minutes
    browserCache: true,
  },

  // User data - Short cache (5 minutes)
  USER_DATA: {
    maxAge: 300, // 5 minutes
    sMaxAge: 300,
    staleWhileRevalidate: 60, // 1 minute
    browserCache: false,
  },

  // Dynamic data - Very short cache (30 seconds)
  DYNAMIC_DATA: {
    maxAge: 30,
    sMaxAge: 30,
    staleWhileRevalidate: 10,
    browserCache: false,
  },

  // No cache - Private/sensitive data
  NO_CACHE: {
    maxAge: 0,
    sMaxAge: 0,
    staleWhileRevalidate: 0,
    browserCache: false,
  },
} as const;

export type CacheStrategy = keyof typeof CACHE_STRATEGIES;

/**
 * Generate cache key for a request
 */
export function generateCacheKey(request: Request, prefix?: string): string {
  const url = new URL(request.url);
  const baseKey = `${request.method}:${url.pathname}${url.search}`;
  return prefix ? `${prefix}:${baseKey}` : baseKey;
}

/**
 * Get cache-control header value for a strategy
 */
export function getCacheControlHeader(strategy: CacheStrategy): string {
  const config = CACHE_STRATEGIES[strategy];

  if (config.maxAge === 0) {
    return 'no-store, no-cache, must-revalidate, private';
  }

  const directives: string[] = [];

  if (config.browserCache) {
    directives.push(`max-age=${config.maxAge}`);
  } else {
    directives.push('max-age=0');
    directives.push('private');
  }

  directives.push(`s-maxage=${config.sMaxAge}`);

  if (config.staleWhileRevalidate > 0) {
    directives.push(`stale-while-revalidate=${config.staleWhileRevalidate}`);
  }

  directives.push('public');

  return directives.join(', ');
}

/**
 * Determine cache strategy based on request path
 */
export function determineCacheStrategy(url: URL): CacheStrategy {
  const path = url.pathname;

  // No cache for private/auth routes
  if (
    path.includes('/api/2fa') ||
    path.includes('/api/trial') ||
    path.startsWith('/api/audit-logs') ||
    path.includes('/login') ||
    path.includes('/auth')
  ) {
    return 'NO_CACHE';
  }

  // Static assets
  if (
    path.match(/\.(jpg|jpeg|png|gif|svg|ico|woff|woff2|ttf|eot|css|js)$/) ||
    path.startsWith('/_next/static/')
  ) {
    return 'STATIC_ASSETS';
  }

  // Public API data
  if (
    path.startsWith('/api/plan-limits/plans') ||
    path.startsWith('/v1/') // Public REST API
  ) {
    return 'PUBLIC_DATA';
  }

  // User-specific data
  if (
    path.startsWith('/api/alerts') ||
    path.startsWith('/api/batch') ||
    path.startsWith('/api/api-keys')
  ) {
    return 'USER_DATA';
  }

  // Dynamic data
  if (path.startsWith('/api/')) {
    return 'DYNAMIC_DATA';
  }

  // Default for pages
  return 'PUBLIC_DATA';
}

/**
 * Get from cache with Cache API
 */
export async function getFromCache(
  request: Request,
  cacheKey?: string
): Promise<Response | null> {
  try {
    const cache = caches.default;
    const key = cacheKey || request.url;

    const cachedResponse = await cache.match(key);

    if (cachedResponse) {
      // Add header to indicate cache hit
      const headers = new Headers(cachedResponse.headers);
      headers.set('X-Cache-Status', 'HIT');
      headers.set('X-Cache-Key', key);

      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        statusText: cachedResponse.statusText,
        headers,
      });
    }

    return null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Put in cache with Cache API
 */
export async function putInCache(
  request: Request,
  response: Response,
  strategy: CacheStrategy,
  cacheKey?: string
): Promise<Response> {
  try {
    const config = CACHE_STRATEGIES[strategy];

    // Don't cache if strategy is NO_CACHE
    if (config.maxAge === 0) {
      return response;
    }

    // Don't cache non-GET requests
    if (request.method !== 'GET') {
      return response;
    }

    // Don't cache error responses
    if (response.status >= 400) {
      return response;
    }

    const cache = caches.default;
    const key = cacheKey || request.url;

    // Clone response for caching
    const responseToCache = response.clone();

    // Set cache headers
    const headers = new Headers(responseToCache.headers);
    headers.set('Cache-Control', getCacheControlHeader(strategy));
    headers.set('X-Cache-Status', 'MISS');
    headers.set('X-Cache-Strategy', strategy);
    headers.delete('Set-Cookie'); // Remove Set-Cookie before caching

    const cachedResponse = new Response(responseToCache.body, {
      status: responseToCache.status,
      statusText: responseToCache.statusText,
      headers,
    });

    // Store in cache (don't await)
    cache.put(key, cachedResponse.clone());

    return new Response(cachedResponse.body, {
      status: cachedResponse.status,
      statusText: cachedResponse.statusText,
      headers,
    });
  } catch (error) {
    console.error('Cache put error:', error);
    return response;
  }
}

/**
 * Purge cache for a specific key or pattern
 */
export async function purgeCache(pattern: string): Promise<number> {
  try {
    const cache = caches.default;
    let purgedCount = 0;

    // Note: Cache API doesn't support wildcard deletion
    // This is a simplified version - in production, you'd track keys
    await cache.delete(pattern);
    purgedCount++;

    return purgedCount;
  } catch (error) {
    console.error('Cache purge error:', error);
    return 0;
  }
}

/**
 * Warm cache by prefetching common routes
 */
export async function warmCache(env: Env, routes: string[]): Promise<void> {
  const cache = caches.default;

  for (const route of routes) {
    try {
      // Create a fake request for the route
      const request = new Request(`https://example.com${route}`, {
        method: 'GET',
      });

      // Check if already cached
      const cached = await cache.match(request);
      if (cached) continue;

      // In production, you'd fetch from origin and cache
      // This is a placeholder
      console.log(`Warming cache for: ${route}`);
    } catch (error) {
      console.error(`Failed to warm cache for ${route}:`, error);
    }
  }
}

/**
 * Add cache headers to a response
 */
export function addCacheHeaders(
  response: Response,
  strategy: CacheStrategy
): Response {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', getCacheControlHeader(strategy));

  // Add Cloudflare cache headers
  headers.set('CDN-Cache-Control', getCacheControlHeader(strategy));

  // Add vary headers for proper caching
  const existingVary = headers.get('Vary') || '';
  const varyHeaders = new Set(existingVary.split(',').map(h => h.trim()));
  varyHeaders.add('Accept-Encoding');
  varyHeaders.add('Accept');
  headers.set('Vary', Array.from(varyHeaders).filter(Boolean).join(', '));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/**
 * Check if response is cacheable
 */
export function isCacheable(response: Response): boolean {
  // Don't cache errors
  if (response.status >= 400) return false;

  // Don't cache if has Set-Cookie
  if (response.headers.has('Set-Cookie')) return false;

  // Don't cache if Cache-Control says no
  const cacheControl = response.headers.get('Cache-Control');
  if (cacheControl && (
    cacheControl.includes('no-store') ||
    cacheControl.includes('no-cache') ||
    cacheControl.includes('private')
  )) {
    return false;
  }

  return true;
}
