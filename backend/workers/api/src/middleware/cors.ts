// ============================================================================
// CORS MIDDLEWARE
// Agent 2 - Backend Engineer
// Configure CORS for frontend access
// ============================================================================

import type { Context, Next } from 'hono';

/**
 * CORS middleware configuration
 * Allows requests from Investigaree frontend domains
 */
export async function corsMiddleware(c: Context, next: Next) {
  // Allow these origins
  const allowedOrigins = [
    'https://investigaree.com.br',
    'https://www.investigaree.com.br',
    'https://investigaree.pages.dev',
    'http://localhost:3000', // Local development
    'http://localhost:3001',
  ];

  const origin = c.req.header('Origin');
  const isAllowed = origin && allowedOrigins.includes(origin);

  // Set CORS headers
  if (isAllowed) {
    c.header('Access-Control-Allow-Origin', origin);
  }

  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-Code');
  c.header('Access-Control-Allow-Credentials', 'true');
  c.header('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (c.req.method === 'OPTIONS') {
    return c.text('', 204);
  }

  await next();
}
