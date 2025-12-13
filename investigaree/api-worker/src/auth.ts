/**
 * Firebase Auth Token Verification
 *
 * Verifica JWT tokens do Firebase sem dependências pesadas
 */

import { DecodedToken } from './types';

/**
 * Verifica token Firebase e retorna payload decodificado
 *
 * IMPORTANTE: Esta é uma verificação SIMPLIFICADA para Edge Runtime
 * Em produção real, deveria usar firebase-admin/auth ou validação completa de assinatura
 */
export async function verifyFirebaseToken(token: string): Promise<DecodedToken | null> {
  try {
    // Parse JWT (formato: header.payload.signature)
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode payload (base64url)
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));

    // Verificações básicas
    if (!payload.uid || !payload.exp) {
      return null;
    }

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.warn('[Auth] Token expirado');
      return null;
    }

    return payload as DecodedToken;
  } catch (error) {
    console.error('[Auth] Erro ao verificar token:', error);
    return null;
  }
}

/**
 * Extrai token do header Authorization
 */
export function extractBearerToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Middleware de autenticação
 */
export async function authenticate(request: Request): Promise<DecodedToken | Response> {
  const token = extractBearerToken(request);

  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing authorization token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const decoded = await verifyFirebaseToken(token);

  if (!decoded) {
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return decoded;
}
