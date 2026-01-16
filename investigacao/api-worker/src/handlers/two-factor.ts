/**
 * Two-Factor Authentication (2FA) Handlers
 * Implements TOTP-based 2FA using RFC 6238
 */

import { Env, DecodedToken } from '../types';
import { TOTP, Secret } from 'otpauth';
import crypto from 'crypto';

interface User2FA {
  id: number;
  user_id: number;
  tenant_id: number;
  secret: string;
  enabled: number;
  verified: number;
  issuer: string;
  label: string;
  algorithm: string;
  digits: number;
  period: number;
  recovery_codes: string | null;
  created_at: string;
  verified_at: string | null;
  last_used_at: string | null;
}

/**
 * Generate random recovery codes
 * Returns 10 recovery codes (8 characters each, alphanumeric)
 */
function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }
  return codes;
}

/**
 * Hash recovery code with SHA-256
 */
function hashRecoveryCode(code: string): string {
  return crypto.createHash('sha256').update(code.toUpperCase()).digest('hex');
}

/**
 * Log 2FA verification attempt
 */
async function log2FAAttempt(
  env: Env,
  userId: number,
  tenantId: number,
  success: boolean,
  method: 'totp' | 'recovery_code',
  ipAddress?: string,
  userAgent?: string,
  errorReason?: string
): Promise<void> {
  await env.DB.prepare(`
    INSERT INTO user_2fa_logs (
      user_id, tenant_id, success, method, ip_address, user_agent, error_reason
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    userId,
    tenantId,
    success ? 1 : 0,
    method,
    ipAddress || null,
    userAgent || null,
    errorReason || null
  ).run();
}

/**
 * POST /api/2fa/setup
 * Initialize 2FA setup (generate secret and QR code URI)
 */
export async function handleSetup2FA(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    // Check if user already has 2FA
    const existing = await env.DB.prepare(`
      SELECT * FROM user_2fa WHERE user_id = ?
    `).bind(user.userId).first<User2FA>();

    if (existing && existing.enabled === 1) {
      return new Response(JSON.stringify({
        error: '2FA já está ativado',
        message: 'Para reconfigurar, primeiro desative o 2FA atual'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate new TOTP secret
    const secret = new Secret({ size: 20 }); // 20 bytes = 160 bits

    // Create TOTP instance
    const totp = new TOTP({
      issuer: 'Investigaree',
      label: user.email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret,
    });

    // Get otpauth:// URI for QR code
    const otpauthUri = totp.toString();

    // Store in database (not enabled yet, waiting for verification)
    if (existing) {
      // Update existing record
      await env.DB.prepare(`
        UPDATE user_2fa
        SET secret = ?, enabled = 0, verified = 0, label = ?,
            verified_at = NULL, recovery_codes = NULL
        WHERE user_id = ?
      `).bind(secret.base32, user.email, user.userId).run();
    } else {
      // Create new record
      await env.DB.prepare(`
        INSERT INTO user_2fa (
          user_id, tenant_id, secret, enabled, verified, label
        ) VALUES (?, ?, ?, 0, 0, ?)
      `).bind(user.userId, user.tenantId, secret.base32, user.email).run();
    }

    return new Response(JSON.stringify({
      success: true,
      secret: secret.base32,
      qr_code_uri: otpauthUri,
      manual_entry_key: secret.base32,
      message: 'Escaneie o QR code com seu app autenticador (Google Authenticator, Authy, etc.)'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Setup 2FA error:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao configurar 2FA',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/2fa/verify
 * Verify TOTP code and enable 2FA
 */
export async function handleVerify2FA(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as { code: string };

    if (!body.code || body.code.length !== 6) {
      return new Response(JSON.stringify({
        error: 'Código inválido',
        message: 'O código deve ter 6 dígitos'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user's 2FA config
    const user2fa = await env.DB.prepare(`
      SELECT * FROM user_2fa WHERE user_id = ?
    `).bind(user.userId).first<User2FA>();

    if (!user2fa) {
      return new Response(JSON.stringify({
        error: '2FA não configurado',
        message: 'Execute o setup primeiro'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create TOTP instance with user's secret
    const totp = new TOTP({
      issuer: user2fa.issuer,
      label: user2fa.label,
      algorithm: user2fa.algorithm as 'SHA1' | 'SHA256' | 'SHA512',
      digits: user2fa.digits,
      period: user2fa.period,
      secret: Secret.fromBase32(user2fa.secret),
    });

    // Validate code (with window of ±1 period for clock drift)
    const delta = totp.validate({
      token: body.code,
      window: 1, // Accept codes from previous/next time step
    });

    if (delta === null) {
      // Invalid code
      await log2FAAttempt(
        env,
        user.userId,
        user.tenantId,
        false,
        'totp',
        request.headers.get('CF-Connecting-IP') || undefined,
        request.headers.get('User-Agent') || undefined,
        'invalid_code'
      );

      return new Response(JSON.stringify({
        error: 'Código inválido',
        message: 'O código fornecido está incorreto ou expirou'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Code is valid - generate recovery codes and enable 2FA
    const recoveryCodes = generateRecoveryCodes();
    const hashedCodes = recoveryCodes.map(code => hashRecoveryCode(code));

    await env.DB.prepare(`
      UPDATE user_2fa
      SET enabled = 1,
          verified = 1,
          verified_at = datetime('now'),
          recovery_codes = ?,
          last_used_at = datetime('now')
      WHERE user_id = ?
    `).bind(hashedCodes.join(','), user.userId).run();

    // Log successful verification
    await log2FAAttempt(
      env,
      user.userId,
      user.tenantId,
      true,
      'totp',
      request.headers.get('CF-Connecting-IP') || undefined,
      request.headers.get('User-Agent') || undefined
    );

    return new Response(JSON.stringify({
      success: true,
      recovery_codes: recoveryCodes,
      message: '2FA ativado com sucesso! Guarde seus códigos de recuperação em local seguro.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Verify 2FA error:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao verificar código',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/2fa/disable
 * Disable 2FA for user
 */
export async function handleDisable2FA(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as { code: string };

    if (!body.code) {
      return new Response(JSON.stringify({
        error: 'Código obrigatório',
        message: 'Forneça um código TOTP ou de recuperação para desativar'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user's 2FA config
    const user2fa = await env.DB.prepare(`
      SELECT * FROM user_2fa WHERE user_id = ? AND enabled = 1
    `).bind(user.userId).first<User2FA>();

    if (!user2fa) {
      return new Response(JSON.stringify({
        error: '2FA não está ativado'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    let isValid = false;

    // Try TOTP code first
    if (body.code.length === 6 && /^\d+$/.test(body.code)) {
      const totp = new TOTP({
        issuer: user2fa.issuer,
        label: user2fa.label,
        algorithm: user2fa.algorithm as 'SHA1' | 'SHA256' | 'SHA512',
        digits: user2fa.digits,
        period: user2fa.period,
        secret: Secret.fromBase32(user2fa.secret),
      });

      const delta = totp.validate({ token: body.code, window: 1 });
      isValid = delta !== null;
    }

    // Try recovery code if TOTP failed
    if (!isValid && user2fa.recovery_codes) {
      const hashedInput = hashRecoveryCode(body.code);
      const codes = user2fa.recovery_codes.split(',');
      isValid = codes.includes(hashedInput);
    }

    if (!isValid) {
      await log2FAAttempt(
        env,
        user.userId,
        user.tenantId,
        false,
        'totp',
        request.headers.get('CF-Connecting-IP') || undefined,
        request.headers.get('User-Agent') || undefined,
        'invalid_code_disable'
      );

      return new Response(JSON.stringify({
        error: 'Código inválido',
        message: 'Código TOTP ou de recuperação incorreto'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Disable 2FA
    await env.DB.prepare(`
      UPDATE user_2fa
      SET enabled = 0,
          verified = 0,
          recovery_codes = NULL
      WHERE user_id = ?
    `).bind(user.userId).run();

    await log2FAAttempt(
      env,
      user.userId,
      user.tenantId,
      true,
      'totp',
      request.headers.get('CF-Connecting-IP') || undefined,
      request.headers.get('User-Agent') || undefined
    );

    return new Response(JSON.stringify({
      success: true,
      message: '2FA desativado com sucesso'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Disable 2FA error:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao desativar 2FA',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/2fa/status
 * Check if user has 2FA enabled
 */
export async function handleGet2FAStatus(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const user2fa = await env.DB.prepare(`
      SELECT enabled, verified, created_at, verified_at, last_used_at
      FROM user_2fa
      WHERE user_id = ?
    `).bind(user.userId).first<{
      enabled: number;
      verified: number;
      created_at: string;
      verified_at: string | null;
      last_used_at: string | null;
    }>();

    const enabled = user2fa?.enabled === 1;

    return new Response(JSON.stringify({
      success: true,
      enabled,
      verified: user2fa?.verified === 1,
      created_at: user2fa?.created_at,
      verified_at: user2fa?.verified_at,
      last_used_at: user2fa?.last_used_at
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Get 2FA status error:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao buscar status 2FA',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/2fa/regenerate-recovery
 * Regenerate recovery codes (requires valid TOTP code)
 */
export async function handleRegenerateRecoveryCodes(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as { code: string };

    if (!body.code || body.code.length !== 6) {
      return new Response(JSON.stringify({
        error: 'Código TOTP inválido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get user's 2FA config
    const user2fa = await env.DB.prepare(`
      SELECT * FROM user_2fa WHERE user_id = ? AND enabled = 1
    `).bind(user.userId).first<User2FA>();

    if (!user2fa) {
      return new Response(JSON.stringify({
        error: '2FA não está ativado'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify TOTP code
    const totp = new TOTP({
      issuer: user2fa.issuer,
      label: user2fa.label,
      algorithm: user2fa.algorithm as 'SHA1' | 'SHA256' | 'SHA512',
      digits: user2fa.digits,
      period: user2fa.period,
      secret: Secret.fromBase32(user2fa.secret),
    });

    const delta = totp.validate({ token: body.code, window: 1 });

    if (delta === null) {
      return new Response(JSON.stringify({
        error: 'Código TOTP inválido'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate new recovery codes
    const recoveryCodes = generateRecoveryCodes();
    const hashedCodes = recoveryCodes.map(code => hashRecoveryCode(code));

    await env.DB.prepare(`
      UPDATE user_2fa
      SET recovery_codes = ?
      WHERE user_id = ?
    `).bind(hashedCodes.join(','), user.userId).run();

    return new Response(JSON.stringify({
      success: true,
      recovery_codes: recoveryCodes,
      message: 'Novos códigos de recuperação gerados. Os códigos antigos não funcionam mais.'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Regenerate recovery codes error:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao regenerar códigos',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
