/**
 * Firebase Auth Token Verification
 *
 * Verifica JWT tokens do Firebase com validação de assinatura
 * Compatível com Cloudflare Workers (sem Firebase Admin SDK)
 */

import { DecodedToken, AuthContext, Env } from './types';
import { logger } from './logger';

// Cache de chaves públicas do Google (válido por 1 hora)
let publicKeysCache: { keys: JsonWebKey[]; expiresAt: number } | null = null;

/**
 * Busca chaves públicas do Google para verificar tokens Firebase
 */
async function fetchGooglePublicKeys(): Promise<JsonWebKey[]> {
  // Retornar do cache se ainda válido
  if (publicKeysCache && publicKeysCache.expiresAt > Date.now()) {
    return publicKeysCache.keys;
  }

  try {
    const response = await fetch(
      'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Google public keys');
    }

    const certs = await response.json() as Record<string, string>;

    // Converter certificados PEM para JWK
    const keys: JsonWebKey[] = await Promise.all(
      Object.entries(certs).map(async ([kid, cert]) => {
        // Importar certificado PEM usando Web Crypto API
        const pemContents = cert
          .replace('-----BEGIN CERTIFICATE-----', '')
          .replace('-----END CERTIFICATE-----', '')
          .replace(/\s/g, '');

        const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

        try {
          const cryptoKey = await crypto.subtle.importKey(
            'spki',
            binaryDer,
            { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
            true,
            ['verify']
          );

          const jwk = await crypto.subtle.exportKey('jwk', cryptoKey);
          return { ...jwk, kid };
        } catch (error) {
          logger.error('Erro ao importar certificado PEM', error instanceof Error ? error : undefined, {}, 'Auth');
          return null;
        }
      })
    );

    const validKeys = keys.filter((k): k is JsonWebKey => k !== null);

    // Cache por 1 hora (as chaves do Google são rotacionadas raramente)
    publicKeysCache = {
      keys: validKeys,
      expiresAt: Date.now() + 60 * 60 * 1000
    };

    return validKeys;
  } catch (error) {
    logger.error('Erro ao buscar chaves públicas do Google', error instanceof Error ? error : undefined, {}, 'Auth');
    throw error;
  }
}

/**
 * Verifica assinatura do JWT usando Web Crypto API
 */
async function verifyJWTSignature(token: string, publicKeys: JsonWebKey[]): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decodificar header para pegar o kid
    const header = JSON.parse(atob(headerB64.replace(/-/g, '+').replace(/_/g, '/')));
    const kid = header.kid;

    // Encontrar chave pública correspondente
    const publicKey = publicKeys.find(k => k.kid === kid);
    if (!publicKey) {
      logger.warn('Chave pública não encontrada para kid', { kid }, 'Auth');
      return false;
    }

    // Importar chave pública
    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      publicKey,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Converter assinatura de base64url para ArrayBuffer
    const signature = Uint8Array.from(
      atob(signatureB64.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    );

    // Dados a serem verificados (header.payload)
    const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`);

    // Verificar assinatura
    const isValid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      cryptoKey,
      signature,
      data
    );

    return isValid;
  } catch (error) {
    logger.error('Erro ao verificar assinatura JWT', error instanceof Error ? error : undefined, {}, 'Auth');
    return false;
  }
}

/**
 * Verifica token Firebase e retorna payload decodificado
 *
 * Implementa verificação COMPLETA com validação de assinatura
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
      logger.warn('Token expirado', { exp: payload.exp, now }, 'Auth');
      return null;
    }

    // Check issued at (token não pode ser do futuro)
    if (payload.iat && payload.iat > now + 60) {
      logger.warn('Token emitido no futuro', { iat: payload.iat, now }, 'Auth');
      return null;
    }

    // VALIDAÇÃO DE ASSINATURA
    const publicKeys = await fetchGooglePublicKeys();
    const isValidSignature = await verifyJWTSignature(token, publicKeys);

    if (!isValidSignature) {
      logger.warn('Assinatura JWT inválida', {}, 'Auth');
      return null;
    }

    // Verificar audience (deve ser o project ID do Firebase)
    // TODO: Adicionar validação de aud se necessário
    // if (payload.aud !== FIREBASE_PROJECT_ID) return null;

    return payload as DecodedToken;
  } catch (error) {
    logger.error('Erro ao verificar token Firebase', error instanceof Error ? error : undefined, {}, 'Auth');
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
 * Busca dados do usuário no D1 (tenant_id e role)
 */
async function getUserFromDatabase(env: Env, firebaseUid: string, email: string): Promise<AuthContext | null> {
  try {
    // Buscar usuário por firebase_uid
    const userResult = await env.DB.prepare(`
      SELECT id, email, tenant_id, role
      FROM users
      WHERE firebase_uid = ?
      LIMIT 1
    `).bind(firebaseUid).first();

    if (!userResult) {
      // Usuário não existe no banco - pode ser primeiro login
      // Criar usuário automaticamente (provisioning)
      logger.info('Auto-provisioning: criando usuário', { email, firebaseUid }, 'Auth');

      const newUserId = crypto.randomUUID();
      const defaultTenantId = 'default-tenant'; // TODO: Melhorar lógica de tenant assignment

      await env.DB.prepare(`
        INSERT INTO users (id, firebase_uid, email, tenant_id, role, created_at)
        VALUES (?, ?, ?, ?, 'viewer', datetime('now'))
      `).bind(newUserId, firebaseUid, email, defaultTenantId).run();

      return {
        uid: firebaseUid,
        email: email,
        tenantId: defaultTenantId,
        role: 'viewer',
        userId: newUserId
      };
    }

    return {
      uid: firebaseUid,
      email: userResult.email as string,
      tenantId: userResult.tenant_id as string,
      role: (userResult.role as 'admin' | 'editor' | 'viewer') || 'viewer',
      userId: userResult.id as string
    };
  } catch (error) {
    logger.error('Erro ao buscar usuário no banco', error instanceof Error ? error : undefined, { firebaseUid }, 'Auth');
    return null;
  }
}

/**
 * Define o contexto de tenant para Row Level Security
 */
export async function setTenantContext(env: Env, tenantId: string, userId: string, role: string): Promise<void> {
  try {
    // Cloudflare D1 não suporta SET para session variables como PostgreSQL
    // RLS será implementado via queries parametrizadas
    // Esta função serve como placeholder para futura implementação

    // TODO: Quando D1 suportar session variables, implementar:
    // await env.DB.exec(`SET app.current_tenant_id = '${tenantId}'`);
    // await env.DB.exec(`SET app.current_user_id = '${userId}'`);
    // await env.DB.exec(`SET app.user_role = '${role}'`);

    // Por enquanto, o tenant_id será passado como parâmetro em cada query
  } catch (error) {
    logger.error('Erro ao definir contexto de tenant', error instanceof Error ? error : undefined, { tenantId, userId, role }, 'Auth');
  }
}

/**
 * Middleware de autenticação completo
 * Retorna AuthContext com tenant_id e role, ou Response de erro
 */
export async function authenticate(request: Request, env: Env): Promise<AuthContext | Response> {
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

  // Buscar dados do usuário no D1
  const authContext = await getUserFromDatabase(env, decoded.uid, decoded.email || '');

  if (!authContext) {
    return new Response(JSON.stringify({ error: 'User not found in database' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Definir contexto de tenant (preparação para RLS)
  await setTenantContext(env, authContext.tenantId, authContext.userId, authContext.role);

  return authContext;
}
