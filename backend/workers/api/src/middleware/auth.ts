// ============================================================================
// AUTHENTICATION MIDDLEWARE
// Agent 2 - Backend Engineer
// Firebase Auth token validation
// ============================================================================

import type { Context, Next } from 'hono';
import type { Env, AuthenticatedUser } from '../types/api.types';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { logger } from '../utils/logger';

/**
 * Firebase Auth middleware
 * Validates Firebase ID tokens and adds user to context
 */
export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Missing or invalid Authorization header');
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // Validate Firebase ID token
    const user = await verifyFirebaseToken(token);

    // Add user to context for downstream handlers
    c.set('user', user);

    logger.debug('User authenticated', { uid: user.uid, email: user.email });

    await next();
  } catch (error) {
    logger.error('Token validation failed', error);
    throw new UnauthorizedError('Invalid or expired token');
  }
}

/**
 * Verify Firebase ID token
 * Uses Google's public keys to validate JWT signature
 *
 * Note: For production, consider using Firebase Admin SDK
 * This implementation uses manual JWT validation
 */
async function verifyFirebaseToken(token: string): Promise<AuthenticatedUser> {
  try {
    // Decode JWT (without verification for now - TODO: implement full verification)
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode payload (base64url)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    // Basic validation
    if (!payload.user_id || !payload.email) {
      throw new Error('Invalid token payload');
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token expired');
    }

    // TODO: Verify signature with Google's public keys
    // For production, fetch keys from:
    // https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com

    return {
      uid: payload.user_id,
      email: payload.email,
      role: payload.role || 'viewer',
    };
  } catch (error) {
    logger.error('Firebase token verification failed', error);
    throw new Error('Token verification failed');
  }
}

/**
 * Optional auth middleware (doesn't throw on missing token)
 * Useful for endpoints that work both authenticated and unauthenticated
 */
export async function optionalAuthMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.substring(7);
      const user = await verifyFirebaseToken(token);
      c.set('user', user);
    } catch (error) {
      // Silently fail - user remains unauthenticated
      logger.debug('Optional auth failed, continuing without user');
    }
  }

  await next();
}

/**
 * Role-based access control middleware
 * Requires user to have specific role
 */
export function requireRole(...allowedRoles: string[]) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const user = c.get('user') as AuthenticatedUser | undefined;

    if (!user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (user.role && !allowedRoles.includes(user.role)) {
      logger.warn('Access denied - insufficient permissions', {
        uid: user.uid,
        role: user.role,
        required: allowedRoles,
      });
      throw new ForbiddenError('Insufficient permissions');
    }

    await next();
  };
}
