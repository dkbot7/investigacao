/**
 * Authentication Routes
 *
 * Endpoints para registro e sincronização de usuários
 * Agent 2 - Backend Engineer (continuado por Agent 3)
 * Data: 2025-12-08
 */

import { Hono } from 'hono';
import type { Env, ContextVariables } from '../types/api.types';
import { logger } from '../utils/logger';

const router = new Hono<{ Bindings: Env; Variables: ContextVariables }>();

/**
 * POST /api/auth/register
 *
 * Registra novo usuário e cria tenant pessoal automático
 *
 * Body: {
 *   firebase_uid: string,
 *   email: string,
 *   name: string,
 *   phone?: string
 * }
 *
 * Flow:
 * 1. Verifica se usuário já existe
 * 2. Cria usuário na tabela users
 * 3. Cria tenant pessoal para o usuário
 * 4. Associa usuário ao tenant como admin
 * 5. Retorna tenant_id
 */
router.post('/register', async (c) => {
  try {
    const { firebase_uid, email, name, phone } = await c.req.json();

    // Validações
    if (!firebase_uid || !email || !name) {
      return c.json({
        success: false,
        error: 'Campos obrigatórios: firebase_uid, email, name'
      }, 400);
    }

    // Verificar se usuário já existe
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(firebase_uid).first();

    if (existingUser) {
      logger.info('User already exists, skipping creation', { firebase_uid });

      // Retornar tenant do usuário existente
      const userTenant = await c.env.DB.prepare(`
        SELECT t.id, t.code, t.name
        FROM user_tenants ut
        JOIN tenants t ON ut.tenant_id = t.id
        WHERE ut.user_id = ? AND ut.is_active = 1
        LIMIT 1
      `).bind(existingUser.id).first();

      return c.json({
        success: true,
        message: 'Usuário já existe',
        user_id: existingUser.id,
        tenant: userTenant || null
      });
    }

    // 1. Criar usuário
    const userId = crypto.randomUUID();
    await c.env.DB.prepare(`
      INSERT INTO users (id, firebase_uid, email, name, phone)
      VALUES (?, ?, ?, ?, ?)
    `).bind(userId, firebase_uid, email, name, phone || null).run();

    logger.info('User created in D1', { user_id: userId, firebase_uid, email });

    // 2. Criar tenant pessoal
    const tenantId = `tenant_${userId.substring(0, 8)}`;
    const tenantCode = `USER_${userId.substring(0, 8).toUpperCase()}`;
    const tenantName = `${name} (Conta Pessoal)`;

    await c.env.DB.prepare(`
      INSERT INTO tenants (id, code, name, email, firebase_uid, status, serpro_mode, serpro_notes)
      VALUES (?, ?, ?, ?, ?, 'active', 'managed', 'Tenant pessoal criado automaticamente. Entre em contato para ativar consultas.')
    `).bind(tenantId, tenantCode, tenantName, email, firebase_uid).run();

    logger.info('Personal tenant created', { tenant_id: tenantId, tenant_code: tenantCode });

    // 3. Associar usuário ao tenant como admin
    const accessId = crypto.randomUUID();
    await c.env.DB.prepare(`
      INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by, granted_at)
      VALUES (?, ?, ?, 'admin', 'system', datetime('now'))
    `).bind(accessId, userId, tenantId).run();

    logger.info('User associated with tenant', {
      user_id: userId,
      tenant_id: tenantId,
      role: 'admin'
    });

    // 4. Criar configurações padrão do usuário
    try {
      const settingsId = crypto.randomUUID();
      await c.env.DB.prepare(`
        INSERT INTO user_settings (
          id, user_id, empresa_nome, plano, limite_consultas_mes,
          notificacoes_email, notificacoes_push, theme, created_at
        )
        VALUES (?, ?, ?, 'free', 0, 1, 1, 'dark', datetime('now'))
      `).bind(settingsId, userId, name).run();

      logger.info('User settings created', { user_id: userId });
    } catch (error) {
      // Não bloquear se settings falharem
      logger.warn('Failed to create user settings', { error });
    }

    return c.json({
      success: true,
      message: 'Usuário registrado com sucesso',
      user_id: userId,
      tenant: {
        id: tenantId,
        code: tenantCode,
        name: tenantName
      }
    }, 201);

  } catch (error: any) {
    logger.error('Error registering user', error);

    return c.json({
      success: false,
      error: 'Erro ao registrar usuário',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/auth/sync
 *
 * Sincroniza usuário do Firebase com D1 (usado no login)
 * Se usuário não existe, cria automaticamente
 *
 * Body: {
 *   firebase_uid: string,
 *   email: string,
 *   name?: string
 * }
 */
router.post('/sync', async (c) => {
  try {
    const { firebase_uid, email, name } = await c.req.json();

    if (!firebase_uid || !email) {
      return c.json({
        success: false,
        error: 'Campos obrigatórios: firebase_uid, email'
      }, 400);
    }

    // Verificar se usuário existe
    const existingUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(firebase_uid).first();

    if (existingUser) {
      // Atualizar last_login (se houver coluna)
      await c.env.DB.prepare(
        'UPDATE users SET updated_at = datetime(\'now\') WHERE id = ?'
      ).bind(existingUser.id).run();

      logger.debug('User synced (already exists)', {
        user_id: existingUser.id,
        firebase_uid
      });

      return c.json({
        success: true,
        message: 'Usuário sincronizado',
        user_id: existingUser.id
      });
    }

    // Usuário não existe - criar automaticamente (fallback)
    logger.warn('User not found during sync, creating automatically', {
      firebase_uid,
      email
    });

    // Chamar lógica de registro
    const userId = crypto.randomUUID();
    await c.env.DB.prepare(`
      INSERT INTO users (id, firebase_uid, email, name)
      VALUES (?, ?, ?, ?)
    `).bind(userId, firebase_uid, email, name || email.split('@')[0]).run();

    // Criar tenant pessoal
    const tenantId = `tenant_${userId.substring(0, 8)}`;
    const tenantCode = `USER_${userId.substring(0, 8).toUpperCase()}`;
    const tenantName = `${name || email.split('@')[0]} (Conta Pessoal)`;

    await c.env.DB.prepare(`
      INSERT INTO tenants (id, code, name, email, firebase_uid, status, serpro_mode, serpro_notes)
      VALUES (?, ?, ?, ?, ?, 'active', 'managed', 'Tenant pessoal criado automaticamente. Entre em contato para ativar consultas.')
    `).bind(tenantId, tenantCode, tenantName, email, firebase_uid).run();

    // Associar ao tenant
    const accessId = crypto.randomUUID();
    await c.env.DB.prepare(`
      INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by)
      VALUES (?, ?, ?, 'admin', 'system')
    `).bind(accessId, userId, tenantId).run();

    logger.info('User auto-created during sync', {
      user_id: userId,
      tenant_id: tenantId
    });

    return c.json({
      success: true,
      message: 'Usuário criado e sincronizado',
      user_id: userId,
      tenant: {
        id: tenantId,
        code: tenantCode,
        name: tenantName
      }
    }, 201);

  } catch (error: any) {
    logger.error('Error syncing user', error);

    return c.json({
      success: false,
      error: 'Erro ao sincronizar usuário',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/auth/me
 *
 * Retorna informações do usuário autenticado
 * (Requer autenticação via middleware)
 */
router.get('/me', async (c) => {
  try {
    // User já foi validado pelo authMiddleware
    const user = c.get('user');

    if (!user) {
      return c.json({
        success: false,
        error: 'Usuário não autenticado'
      }, 401);
    }

    // Buscar informações completas do usuário
    const userRecord = await c.env.DB.prepare(`
      SELECT id, firebase_uid, email, name, phone, created_at, updated_at
      FROM users
      WHERE firebase_uid = ?
    `).bind(user.uid).first();

    if (!userRecord) {
      return c.json({
        success: false,
        error: 'Usuário não encontrado no banco de dados'
      }, 404);
    }

    // Buscar tenants do usuário
    const { results: tenants } = await c.env.DB.prepare(`
      SELECT
        t.id, t.code, t.name, t.status,
        ut.role, ut.granted_at, ut.expires_at, ut.is_active
      FROM user_tenants ut
      JOIN tenants t ON ut.tenant_id = t.id
      WHERE ut.user_id = ?
      ORDER BY ut.granted_at DESC
    `).bind(userRecord.id).all();

    return c.json({
      success: true,
      user: userRecord,
      tenants: tenants || []
    });

  } catch (error: any) {
    logger.error('Error fetching user info', error);

    return c.json({
      success: false,
      error: 'Erro ao buscar informações do usuário',
      details: error.message
    }, 500);
  }
});

export default router;
