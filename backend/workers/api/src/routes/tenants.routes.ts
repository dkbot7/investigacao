/**
 * Tenants Routes
 *
 * Endpoints para gerenciar tenants (clientes):
 * - Criar novo tenant
 * - Listar tenants
 * - Buscar tenant específico
 * - Atualizar tenant
 * - Ativar/Desativar tenant
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 * Fix: Implementação de endpoints faltantes para persistência de tenants
 */

import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth';
import type { Env, AuthenticatedUser } from '../types/api.types';
import { logger } from '../utils/logger';

const router = new Hono<{ Bindings: Env }>();

// ============================================================================
// INTERFACES
// ============================================================================

interface CreateTenantRequest {
  code: string; // Ex: "CLIENTE_01", "COMURG"
  name: string;
  email: string;
  config?: any; // JSON config
  status?: 'active' | 'inactive';
}

// ============================================================================
// ROUTES
// ============================================================================

/**
 * POST /api/tenants
 *
 * Cria um novo tenant (apenas admin)
 *
 * Body: CreateTenantRequest
 *
 * Response:
 * {
 *   success: true,
 *   tenant: { id, code, name, email, status, ... }
 * }
 */
router.post('/', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const body = await c.req.json<CreateTenantRequest>();

    // Validações básicas
    if (!body.code || !body.name || !body.email) {
      return c.json({
        success: false,
        error: 'Campos obrigatórios: code, name, email'
      }, 400);
    }

    // Normalizar code (uppercase, sem espaços)
    const code = body.code.trim().toUpperCase().replace(/\s+/g, '_');

    // Verificar se já existe tenant com esse code
    const existing = await c.env.DB.prepare(
      'SELECT id FROM tenants WHERE code = ?'
    ).bind(code).first();

    if (existing) {
      return c.json({
        success: false,
        error: `Tenant com código "${code}" já existe`
      }, 409);
    }

    // Gerar ID para o tenant
    const tenantId = `tenant_${code.toLowerCase()}`;

    // Inserir tenant
    const result = await c.env.DB.prepare(`
      INSERT INTO tenants (
        id, code, name, email, status, config
      ) VALUES (?, ?, ?, ?, ?, ?)
      RETURNING *
    `).bind(
      tenantId,
      code,
      body.name,
      body.email,
      body.status || 'active',
      body.config ? JSON.stringify(body.config) : null
    ).first();

    logger.info('Tenant created', {
      tenant_id: tenantId,
      code: code
    });

    // Audit log
    const user = c.get('user') as AuthenticatedUser;
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (userRecord) {
      await c.env.DB.prepare(`
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        userRecord.id,
        'create',
        'tenant',
        tenantId,
        JSON.stringify({ code, name: body.name })
      ).run();
    }

    return c.json({
      success: true,
      tenant: result
    }, 201);

  } catch (error: any) {
    logger.error('Error creating tenant', error);
    return c.json({
      success: false,
      error: 'Erro ao criar tenant',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/tenants
 *
 * Lista todos os tenants
 * - Admin: vê todos os tenants
 * - Usuário normal: vê apenas tenants que tem acesso
 *
 * Query params:
 * - status: filtrar por status (active/inactive)
 * - limit: limite de resultados (default: 50)
 * - offset: offset para paginação (default: 0)
 *
 * Response:
 * {
 *   success: true,
 *   tenants: [...],
 *   total: 10
 * }
 */
router.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    const status = c.req.query('status');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');

    // Buscar user_id do D1
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (!userRecord) {
      return c.json({
        success: true,
        tenants: [],
        total: 0
      });
    }

    let query: string;
    let countQuery: string;
    const params: any[] = [];
    const countParams: any[] = [];

    if (user.role === 'admin') {
      // Admin vê todos os tenants
      query = 'SELECT * FROM tenants WHERE 1=1';
      countQuery = 'SELECT COUNT(*) as total FROM tenants WHERE 1=1';

      if (status) {
        query += ' AND status = ?';
        countQuery += ' AND status = ?';
        params.push(status);
        countParams.push(status);
      }

      query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

    } else {
      // Usuário normal vê apenas tenants que tem acesso
      query = `
        SELECT t.* FROM tenants t
        INNER JOIN user_tenants ut ON t.id = ut.tenant_id
        WHERE ut.user_id = ? AND ut.is_active = 1
      `;
      countQuery = `
        SELECT COUNT(*) as total FROM tenants t
        INNER JOIN user_tenants ut ON t.id = ut.tenant_id
        WHERE ut.user_id = ? AND ut.is_active = 1
      `;

      params.push(userRecord.id);
      countParams.push(userRecord.id);

      if (status) {
        query += ' AND t.status = ?';
        countQuery += ' AND t.status = ?';
        params.push(status);
        countParams.push(status);
      }

      query += ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    const { results } = await c.env.DB.prepare(query).bind(...params).all();
    const countResult = await c.env.DB.prepare(countQuery).bind(...countParams).first();

    return c.json({
      success: true,
      tenants: results,
      total: countResult?.total || 0,
      limit,
      offset
    });

  } catch (error: any) {
    logger.error('Error listing tenants', error);
    return c.json({
      success: false,
      error: 'Erro ao listar tenants',
      details: error.message
    }, 500);
  }
});

/**
 * GET /api/tenants/:id
 *
 * Busca um tenant específico
 *
 * Response:
 * {
 *   success: true,
 *   tenant: { ... }
 * }
 */
router.get('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as AuthenticatedUser;
    const tenantId = c.req.param('id');

    // Buscar user_id do D1
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (!userRecord) {
      return c.json({
        success: false,
        error: 'Usuário não encontrado'
      }, 404);
    }

    let tenant: any;

    if (user.role === 'admin') {
      // Admin pode ver qualquer tenant
      tenant = await c.env.DB.prepare(
        'SELECT * FROM tenants WHERE id = ?'
      ).bind(tenantId).first();
    } else {
      // Usuário normal só pode ver tenant que tem acesso
      tenant = await c.env.DB.prepare(`
        SELECT t.* FROM tenants t
        INNER JOIN user_tenants ut ON t.id = ut.tenant_id
        WHERE t.id = ? AND ut.user_id = ? AND ut.is_active = 1
      `).bind(tenantId, userRecord.id).first();
    }

    if (!tenant) {
      return c.json({
        success: false,
        error: 'Tenant não encontrado'
      }, 404);
    }

    // Buscar usuários do tenant (apenas para admin)
    if (user.role === 'admin') {
      const { results: users } = await c.env.DB.prepare(`
        SELECT u.id, u.email, u.name, ut.role, ut.granted_at
        FROM users u
        INNER JOIN user_tenants ut ON u.id = ut.user_id
        WHERE ut.tenant_id = ? AND ut.is_active = 1
        ORDER BY ut.granted_at DESC
      `).bind(tenantId).all();

      tenant.users = users;
    }

    return c.json({
      success: true,
      tenant
    });

  } catch (error: any) {
    logger.error('Error fetching tenant', error);
    return c.json({
      success: false,
      error: 'Erro ao buscar tenant',
      details: error.message
    }, 500);
  }
});

/**
 * PUT /api/tenants/:id
 *
 * Atualiza um tenant (apenas admin)
 *
 * Body: Partial<CreateTenantRequest>
 *
 * Response:
 * {
 *   success: true,
 *   tenant: { ... }
 * }
 */
router.put('/:id', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const tenantId = c.req.param('id');
    const body = await c.req.json<Partial<CreateTenantRequest>>();

    // Verificar se tenant existe
    const existing = await c.env.DB.prepare(
      'SELECT id FROM tenants WHERE id = ?'
    ).bind(tenantId).first();

    if (!existing) {
      return c.json({
        success: false,
        error: 'Tenant não encontrado'
      }, 404);
    }

    // Build update query dinamicamente
    const updates: string[] = [];
    const params: any[] = [];

    if (body.name !== undefined) {
      updates.push('name = ?');
      params.push(body.name);
    }
    if (body.email !== undefined) {
      updates.push('email = ?');
      params.push(body.email);
    }
    if (body.status !== undefined) {
      updates.push('status = ?');
      params.push(body.status);
    }
    if (body.config !== undefined) {
      updates.push('config = ?');
      params.push(JSON.stringify(body.config));
    }

    // Sempre atualiza updated_at
    updates.push('updated_at = datetime(\'now\')');

    if (updates.length === 1) {
      // Apenas updated_at, nada para atualizar
      return c.json({
        success: false,
        error: 'Nenhum campo para atualizar'
      }, 400);
    }

    const query = `
      UPDATE tenants
      SET ${updates.join(', ')}
      WHERE id = ?
      RETURNING *
    `;

    params.push(tenantId);

    const result = await c.env.DB.prepare(query).bind(...params).first();

    // Audit log
    const user = c.get('user') as AuthenticatedUser;
    const userRecord = await c.env.DB.prepare(
      'SELECT id FROM users WHERE firebase_uid = ?'
    ).bind(user.uid).first();

    if (userRecord) {
      await c.env.DB.prepare(`
        INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
        VALUES (?, ?, ?, ?, ?)
      `).bind(
        userRecord.id,
        'update',
        'tenant',
        tenantId,
        JSON.stringify(body)
      ).run();
    }

    logger.info('Tenant updated', { tenant_id: tenantId });

    return c.json({
      success: true,
      tenant: result
    });

  } catch (error: any) {
    logger.error('Error updating tenant', error);
    return c.json({
      success: false,
      error: 'Erro ao atualizar tenant',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/tenants/:id/activate
 *
 * Ativa um tenant (apenas admin)
 *
 * Response:
 * {
 *   success: true,
 *   message: "Tenant ativado com sucesso"
 * }
 */
router.post('/:id/activate', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const tenantId = c.req.param('id');

    const result = await c.env.DB.prepare(`
      UPDATE tenants
      SET status = 'active', updated_at = datetime('now')
      WHERE id = ?
      RETURNING *
    `).bind(tenantId).first();

    if (!result) {
      return c.json({
        success: false,
        error: 'Tenant não encontrado'
      }, 404);
    }

    logger.info('Tenant activated', { tenant_id: tenantId });

    return c.json({
      success: true,
      message: 'Tenant ativado com sucesso',
      tenant: result
    });

  } catch (error: any) {
    logger.error('Error activating tenant', error);
    return c.json({
      success: false,
      error: 'Erro ao ativar tenant',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/tenants/:id/deactivate
 *
 * Desativa um tenant (apenas admin)
 *
 * Response:
 * {
 *   success: true,
 *   message: "Tenant desativado com sucesso"
 * }
 */
router.post('/:id/deactivate', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const tenantId = c.req.param('id');

    const result = await c.env.DB.prepare(`
      UPDATE tenants
      SET status = 'inactive', updated_at = datetime('now')
      WHERE id = ?
      RETURNING *
    `).bind(tenantId).first();

    if (!result) {
      return c.json({
        success: false,
        error: 'Tenant não encontrado'
      }, 404);
    }

    logger.info('Tenant deactivated', { tenant_id: tenantId });

    return c.json({
      success: true,
      message: 'Tenant desativado com sucesso',
      tenant: result
    });

  } catch (error: any) {
    logger.error('Error deactivating tenant', error);
    return c.json({
      success: false,
      error: 'Erro ao desativar tenant',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/tenants/:id/grant-access
 *
 * Concede acesso de um usuário a um tenant (apenas admin)
 *
 * Body:
 * {
 *   user_email: string,
 *   role: 'admin' | 'editor' | 'viewer'
 * }
 *
 * Response:
 * {
 *   success: true,
 *   message: "Acesso concedido"
 * }
 */
router.post('/:id/grant-access', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const tenantId = c.req.param('id');
    const { user_email, role } = await c.req.json();

    if (!user_email || !role) {
      return c.json({
        success: false,
        error: 'Campos obrigatórios: user_email, role'
      }, 400);
    }

    // Buscar usuário pelo email
    const targetUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(user_email).first();

    if (!targetUser) {
      return c.json({
        success: false,
        error: 'Usuário não encontrado'
      }, 404);
    }

    // Verificar se já tem acesso
    const existing = await c.env.DB.prepare(
      'SELECT id FROM user_tenants WHERE user_id = ? AND tenant_id = ?'
    ).bind(targetUser.id, tenantId).first();

    if (existing) {
      // Atualizar acesso existente
      await c.env.DB.prepare(`
        UPDATE user_tenants
        SET role = ?, is_active = 1, updated_at = datetime('now')
        WHERE user_id = ? AND tenant_id = ?
      `).bind(role, targetUser.id, tenantId).run();
    } else {
      // Criar novo acesso
      const accessId = crypto.randomUUID();
      await c.env.DB.prepare(`
        INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
      `).bind(accessId, targetUser.id, tenantId, role, 'admin').run();
    }

    logger.info('Access granted', {
      tenant_id: tenantId,
      user_id: targetUser.id,
      role
    });

    return c.json({
      success: true,
      message: 'Acesso concedido com sucesso'
    });

  } catch (error: any) {
    logger.error('Error granting access', error);
    return c.json({
      success: false,
      error: 'Erro ao conceder acesso',
      details: error.message
    }, 500);
  }
});

/**
 * POST /api/tenants/:id/revoke-access
 *
 * Revoga acesso de um usuário a um tenant (apenas admin)
 *
 * Body:
 * {
 *   user_email: string
 * }
 *
 * Response:
 * {
 *   success: true,
 *   message: "Acesso revogado"
 * }
 */
router.post('/:id/revoke-access', authMiddleware, requireRole('admin'), async (c) => {
  try {
    const tenantId = c.req.param('id');
    const { user_email } = await c.req.json();

    if (!user_email) {
      return c.json({
        success: false,
        error: 'Campo obrigatório: user_email'
      }, 400);
    }

    // Buscar usuário pelo email
    const targetUser = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(user_email).first();

    if (!targetUser) {
      return c.json({
        success: false,
        error: 'Usuário não encontrado'
      }, 404);
    }

    // Revogar acesso
    await c.env.DB.prepare(`
      UPDATE user_tenants
      SET is_active = 0, updated_at = datetime('now')
      WHERE user_id = ? AND tenant_id = ?
    `).bind(targetUser.id, tenantId).run();

    logger.info('Access revoked', {
      tenant_id: tenantId,
      user_id: targetUser.id
    });

    return c.json({
      success: true,
      message: 'Acesso revogado com sucesso'
    });

  } catch (error: any) {
    logger.error('Error revoking access', error);
    return c.json({
      success: false,
      error: 'Erro ao revogar acesso',
      details: error.message
    }, 500);
  }
});

export default router;
