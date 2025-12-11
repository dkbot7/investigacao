/**
 * Admin Routes
 *
 * Endpoints para gerenciamento administrativo:
 * - Listar usuários
 * - Listar tenants
 * - Gerenciar acessos (grant/revoke)
 * - Estatísticas do sistema
 * - Alertas
 */

import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import type { Env } from '../types/api.types';

const router = new Hono<{ Bindings: Env }>();

// ============================================================================
// USER MANAGEMENT
// ============================================================================

/**
 * GET /api/admin/users
 *
 * Lista todos os usuários com seus tenants e acessos
 */
router.get('/users', authMiddleware, async (c) => {
  try {
    // Buscar todos os usuários
    const { results: users } = await c.env.DB.prepare(`
      SELECT
        id,
        email,
        name,
        phone,
        created_at,
        updated_at,
        (SELECT MAX(created_at) FROM audit_logs WHERE user_id = users.id) as last_access
      FROM users
      ORDER BY created_at DESC
    `).all();

    // Para cada usuário, buscar seus tenants
    const usersWithTenants = await Promise.all(
      users.map(async (user: any) => {
        const { results: tenants } = await c.env.DB.prepare(`
          SELECT tenant_code, access_level as role
          FROM user_tenants
          WHERE user_id = ?
          ORDER BY granted_at DESC
        `).bind(user.id).all();

        return {
          ...user,
          tenants: tenants
        };
      })
    );

    return c.json({
      success: true,
      data: {
        users: usersWithTenants
      }
    });

  } catch (error: any) {
    console.error('[Admin Users] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'ADMIN_USERS_ERROR',
        message: 'Erro ao listar usuários',
        details: error.message
      }
    }, 500);
  }
});

/**
 * GET /api/admin/users/:id
 *
 * Busca um usuário específico por ID
 */
router.get('/users/:id', authMiddleware, async (c) => {
  const userId = c.req.param('id');

  try {
    const user = await c.env.DB.prepare(`
      SELECT id, email, name, phone, created_at, updated_at
      FROM users
      WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado'
        }
      }, 404);
    }

    // Buscar tenants do usuário
    const { results: tenants } = await c.env.DB.prepare(`
      SELECT tenant_code, access_level as role, granted_at, granted_by
      FROM user_tenants
      WHERE user_id = ?
    `).bind(userId).all();

    return c.json({
      success: true,
      data: {
        ...user,
        tenants
      }
    });

  } catch (error: any) {
    console.error('[Admin User] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'ADMIN_USER_ERROR',
        message: 'Erro ao buscar usuário',
        details: error.message
      }
    }, 500);
  }
});

/**
 * PATCH /api/admin/users/:id
 *
 * Atualiza dados de um usuário
 */
router.patch('/users/:id', authMiddleware, async (c) => {
  const userId = c.req.param('id');
  const { name, phone } = await c.req.json();

  try {
    // Verificar se usuário existe
    const user = await c.env.DB.prepare(`
      SELECT id FROM users WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado'
        }
      }, 404);
    }

    // Atualizar usuário
    await c.env.DB.prepare(`
      UPDATE users
      SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(name, phone, userId).run();

    // Log de auditoria
    const adminUserId = c.get('userId') || 'system';
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      adminUserId,
      'update',
      'user',
      userId,
      JSON.stringify({ name, phone })
    ).run();

    // Buscar usuário atualizado
    const updatedUser = await c.env.DB.prepare(`
      SELECT id, email, name, phone, created_at, updated_at
      FROM users
      WHERE id = ?
    `).bind(userId).first();

    return c.json({
      success: true,
      data: updatedUser
    });

  } catch (error: any) {
    console.error('[Admin Update User] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_USER_ERROR',
        message: 'Erro ao atualizar usuário',
        details: error.message
      }
    }, 500);
  }
});

/**
 * DELETE /api/admin/users/:id
 *
 * Deleta um usuário permanentemente
 */
router.delete('/users/:id', authMiddleware, async (c) => {
  const userId = c.req.param('id');

  try {
    // Verificar se usuário existe
    const user = await c.env.DB.prepare(`
      SELECT id, email FROM users WHERE id = ?
    `).bind(userId).first();

    if (!user) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'Usuário não encontrado'
        }
      }, 404);
    }

    // Deletar acessos aos tenants primeiro
    await c.env.DB.prepare(`
      DELETE FROM user_tenants WHERE user_id = ?
    `).bind(userId).run();

    // Deletar usuário
    await c.env.DB.prepare(`
      DELETE FROM users WHERE id = ?
    `).bind(userId).run();

    // Log de auditoria
    const adminUserId = c.get('userId') || 'system';
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      adminUserId,
      'delete',
      'user',
      userId,
      JSON.stringify({ email: (user as any).email })
    ).run();

    return c.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    });

  } catch (error: any) {
    console.error('[Admin Delete User] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'DELETE_USER_ERROR',
        message: 'Erro ao deletar usuário',
        details: error.message
      }
    }, 500);
  }
});

// ============================================================================
// TENANT MANAGEMENT
// ============================================================================

/**
 * GET /api/admin/tenants
 *
 * Lista todos os tenants com contadores de usuários
 */
router.get('/tenants', authMiddleware, async (c) => {
  try {
    const { results: tenants } = await c.env.DB.prepare(`
      SELECT
        t.id,
        t.tenant_code as code,
        t.name,
        t.status,
        t.created_at,
        (SELECT COUNT(*) FROM user_tenants WHERE tenant_code = t.tenant_code) as user_count
      FROM tenants t
      ORDER BY t.created_at DESC
    `).all();

    // Para cada tenant, buscar estatísticas adicionais
    const tenantsWithStats = await Promise.all(
      tenants.map(async (tenant: any) => {
        // Contar usuários ativos (que fizeram login recentemente)
        const activeUsers = await c.env.DB.prepare(`
          SELECT COUNT(DISTINCT user_id) as count
          FROM audit_logs
          WHERE entity_type = 'serpro_query'
            AND created_at > datetime('now', '-30 days')
            AND user_id IN (
              SELECT user_id FROM user_tenants WHERE tenant_code = ?
            )
        `).bind(tenant.code).first();

        // Contar total de usuários com acesso
        const totalUsers = await c.env.DB.prepare(`
          SELECT COUNT(*) as count
          FROM user_tenants
          WHERE tenant_code = ?
        `).bind(tenant.code).first();

        return {
          ...tenant,
          stats: {
            totalUsers: (totalUsers as any)?.count || 0,
            activeUsers: (activeUsers as any)?.count || 0
          }
        };
      })
    );

    return c.json({
      success: true,
      data: {
        tenants: tenantsWithStats
      }
    });

  } catch (error: any) {
    console.error('[Admin Tenants] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'ADMIN_TENANTS_ERROR',
        message: 'Erro ao listar tenants',
        details: error.message
      }
    }, 500);
  }
});

/**
 * POST /api/admin/tenants
 *
 * Cria um novo tenant
 */
router.post('/tenants', authMiddleware, async (c) => {
  const { code, name } = await c.req.json();

  if (!code || !name) {
    return c.json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Code e name são obrigatórios'
      }
    }, 400);
  }

  try {
    const result = await c.env.DB.prepare(`
      INSERT INTO tenants (tenant_code, name, status)
      VALUES (?, ?, 'active')
      RETURNING id, tenant_code as code, name, status, created_at
    `).bind(code, name).first();

    // Log de auditoria
    const userId = c.get('userId') || 'system';
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      userId,
      'create',
      'tenant',
      code,
      JSON.stringify({ name })
    ).run();

    return c.json({
      success: true,
      data: {
        tenant: result
      }
    });

  } catch (error: any) {
    console.error('[Admin Create Tenant] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'TENANT_CREATE_ERROR',
        message: 'Erro ao criar tenant',
        details: error.message
      }
    }, 500);
  }
});

/**
 * PATCH /api/admin/tenants/:code
 *
 * Atualiza dados de um tenant
 */
router.patch('/tenants/:code', authMiddleware, async (c) => {
  const tenantCode = c.req.param('code');
  const { name, status } = await c.req.json();

  try {
    // Verificar se tenant existe
    const tenant = await c.env.DB.prepare(`
      SELECT tenant_code FROM tenants WHERE tenant_code = ?
    `).bind(tenantCode).first();

    if (!tenant) {
      return c.json({
        success: false,
        error: {
          code: 'TENANT_NOT_FOUND',
          message: 'Tenant não encontrado'
        }
      }, 404);
    }

    // Atualizar tenant
    await c.env.DB.prepare(`
      UPDATE tenants
      SET name = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE tenant_code = ?
    `).bind(name, status, tenantCode).run();

    // Log de auditoria
    const adminUserId = c.get('userId') || 'system';
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      adminUserId,
      'update',
      'tenant',
      tenantCode,
      JSON.stringify({ name, status })
    ).run();

    // Buscar tenant atualizado
    const updatedTenant = await c.env.DB.prepare(`
      SELECT id, tenant_code as code, name, status, created_at, updated_at
      FROM tenants
      WHERE tenant_code = ?
    `).bind(tenantCode).first();

    return c.json({
      success: true,
      data: updatedTenant
    });

  } catch (error: any) {
    console.error('[Admin Update Tenant] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'UPDATE_TENANT_ERROR',
        message: 'Erro ao atualizar tenant',
        details: error.message
      }
    }, 500);
  }
});

// ============================================================================
// ACCESS CONTROL
// ============================================================================

/**
 * POST /api/admin/grant-access
 *
 * Concede acesso de um usuário a um tenant
 */
router.post('/grant-access', authMiddleware, async (c) => {
  const { user_email, tenant_code, role } = await c.req.json();

  if (!user_email || !tenant_code || !role) {
    return c.json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'user_email, tenant_code e role são obrigatórios'
      }
    }, 400);
  }

  try {
    // Buscar usuário por email
    const user = await c.env.DB.prepare(`
      SELECT id FROM users WHERE email = ?
    `).bind(user_email).first();

    if (!user) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: `Usuário com email ${user_email} não encontrado`
        }
      }, 404);
    }

    // Verificar se tenant existe
    const tenant = await c.env.DB.prepare(`
      SELECT tenant_code FROM tenants WHERE tenant_code = ?
    `).bind(tenant_code).first();

    if (!tenant) {
      return c.json({
        success: false,
        error: {
          code: 'TENANT_NOT_FOUND',
          message: `Tenant ${tenant_code} não encontrado`
        }
      }, 404);
    }

    const adminUserId = c.get('userId') || 'system';

    // Inserir ou atualizar acesso
    await c.env.DB.prepare(`
      INSERT INTO user_tenants (user_id, tenant_code, access_level, granted_by)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, tenant_code) DO UPDATE SET
        access_level = excluded.access_level,
        granted_by = excluded.granted_by,
        granted_at = CURRENT_TIMESTAMP
    `).bind((user as any).id, tenant_code, role, adminUserId).run();

    // Log de auditoria
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      adminUserId,
      'grant_access',
      'user_tenant',
      (user as any).id,
      JSON.stringify({ user_email, tenant_code, role })
    ).run();

    return c.json({
      success: true,
      message: `Acesso concedido com sucesso para ${user_email}`,
      action: 'granted'
    });

  } catch (error: any) {
    console.error('[Admin Grant Access] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'GRANT_ACCESS_ERROR',
        message: 'Erro ao conceder acesso',
        details: error.message
      }
    }, 500);
  }
});

/**
 * DELETE /api/admin/revoke-access
 *
 * Revoga acesso de um usuário a um tenant
 */
router.delete('/revoke-access', authMiddleware, async (c) => {
  const user_email = c.req.query('user_email');
  const tenant_code = c.req.query('tenant_code');

  if (!user_email || !tenant_code) {
    return c.json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'user_email e tenant_code são obrigatórios'
      }
    }, 400);
  }

  try {
    // Buscar usuário por email
    const user = await c.env.DB.prepare(`
      SELECT id FROM users WHERE email = ?
    `).bind(user_email).first();

    if (!user) {
      return c.json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: `Usuário com email ${user_email} não encontrado`
        }
      }, 404);
    }

    // Deletar acesso
    const result = await c.env.DB.prepare(`
      DELETE FROM user_tenants
      WHERE user_id = ? AND tenant_code = ?
    `).bind((user as any).id, tenant_code).run();

    if (!result.success || result.meta.changes === 0) {
      return c.json({
        success: false,
        error: {
          code: 'ACCESS_NOT_FOUND',
          message: 'Acesso não encontrado'
        }
      }, 404);
    }

    // Log de auditoria
    const adminUserId = c.get('userId') || 'system';
    await c.env.DB.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      adminUserId,
      'revoke_access',
      'user_tenant',
      (user as any).id,
      JSON.stringify({ user_email, tenant_code })
    ).run();

    return c.json({
      success: true,
      message: `Acesso revogado com sucesso de ${user_email}`
    });

  } catch (error: any) {
    console.error('[Admin Revoke Access] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'REVOKE_ACCESS_ERROR',
        message: 'Erro ao revogar acesso',
        details: error.message
      }
    }, 500);
  }
});

/**
 * GET /api/admin/pending-users
 *
 * Lista usuários sem acesso a nenhum tenant (pendentes)
 */
router.get('/pending-users', authMiddleware, async (c) => {
  try {
    const { results } = await c.env.DB.prepare(`
      SELECT
        u.id,
        u.email,
        u.name,
        u.phone,
        u.created_at
      FROM users u
      WHERE NOT EXISTS (
        SELECT 1 FROM user_tenants WHERE user_id = u.id
      )
      ORDER BY u.created_at DESC
    `).all();

    return c.json({
      success: true,
      data: {
        pending_users: results
      }
    });

  } catch (error: any) {
    console.error('[Admin Pending Users] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'PENDING_USERS_ERROR',
        message: 'Erro ao listar usuários pendentes',
        details: error.message
      }
    }, 500);
  }
});

// ============================================================================
// STATISTICS
// ============================================================================

/**
 * GET /api/admin/stats
 *
 * Retorna estatísticas gerais do sistema
 */
router.get('/stats', authMiddleware, async (c) => {
  try {
    // Total de usuários
    const totalUsers = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM users
    `).first();

    // Tenants ativos
    const activeTenants = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM tenants WHERE status = 'active'
    `).first();

    // Usuários pendentes (sem acesso)
    const pendingUsers = await c.env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM users u
      WHERE NOT EXISTS (
        SELECT 1 FROM user_tenants WHERE user_id = u.id
      )
    `).first();

    // Alertas não lidos
    const unreadAlerts = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM alerts WHERE read = 0
    `).first();

    return c.json({
      success: true,
      data: {
        users: {
          total: (totalUsers as any)?.count || 0,
          pending: (pendingUsers as any)?.count || 0
        },
        tenants: {
          total: (activeTenants as any)?.count || 0,
          active: (activeTenants as any)?.count || 0
        },
        alerts: {
          unread: (unreadAlerts as any)?.count || 0
        }
      }
    });

  } catch (error: any) {
    console.error('[Admin Stats] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'ADMIN_STATS_ERROR',
        message: 'Erro ao buscar estatísticas',
        details: error.message
      }
    }, 500);
  }
});

// ============================================================================
// ALERTS
// ============================================================================

/**
 * GET /api/admin/alerts
 *
 * Lista alertas do sistema
 */
router.get('/alerts', authMiddleware, async (c) => {
  const unreadOnly = c.req.query('unreadOnly') === 'true';
  const category = c.req.query('category');

  try {
    let query = `
      SELECT
        id, type as category, severity as type, title, message,
        read, created_at as createdAt, read_at as readAt,
        NULL as metadata
      FROM alerts
      WHERE 1=1
    `;

    const bindings: any[] = [];

    if (unreadOnly) {
      query += ` AND read = 0`;
    }

    if (category) {
      query += ` AND type = ?`;
      bindings.push(category);
    }

    query += ` ORDER BY created_at DESC LIMIT 100`;

    const { results } = await c.env.DB.prepare(query).bind(...bindings).all();

    return c.json({
      success: true,
      data: {
        alerts: results,
        unreadCount: results.filter((a: any) => a.read === 0).length
      }
    });

  } catch (error: any) {
    console.error('[Admin Alerts] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'ADMIN_ALERTS_ERROR',
        message: 'Erro ao listar alertas',
        details: error.message
      }
    }, 500);
  }
});

/**
 * POST /api/admin/alerts/:id/read
 *
 * Marca um alerta como lido
 */
router.post('/alerts/:id/read', authMiddleware, async (c) => {
  const alertId = c.req.param('id');

  try {
    await c.env.DB.prepare(`
      UPDATE alerts
      SET read = 1, read_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(alertId).run();

    return c.json({
      success: true
    });

  } catch (error: any) {
    console.error('[Admin Mark Alert Read] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'MARK_ALERT_ERROR',
        message: 'Erro ao marcar alerta como lido',
        details: error.message
      }
    }, 500);
  }
});

/**
 * POST /api/admin/alerts/read-all
 *
 * Marca todos os alertas como lidos
 */
router.post('/alerts/read-all', authMiddleware, async (c) => {
  try {
    await c.env.DB.prepare(`
      UPDATE alerts
      SET read = 1, read_at = CURRENT_TIMESTAMP
      WHERE read = 0
    `).run();

    return c.json({
      success: true,
      message: 'Todos os alertas foram marcados como lidos'
    });

  } catch (error: any) {
    console.error('[Admin Mark All Alerts Read] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'MARK_ALL_ALERTS_ERROR',
        message: 'Erro ao marcar todos os alertas como lidos',
        details: error.message
      }
    }, 500);
  }
});

// ============================================================================
// INVESTIGATIONS (ADMIN VIEW)
// ============================================================================

/**
 * GET /api/admin/investigacoes
 *
 * Lista TODAS as investigações de TODOS os usuários (apenas para admins)
 */
router.get('/investigacoes', authMiddleware, async (c) => {
  const status = c.req.query('status');
  const categoria = c.req.query('categoria');
  const busca = c.req.query('busca');
  const limit = parseInt(c.req.query('limit') || '100');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    let query = `
      SELECT
        i.*,
        u.email as user_email,
        u.name as user_name
      FROM user_investigacoes i
      LEFT JOIN users u ON i.user_id = u.id
      WHERE 1=1
    `;

    const bindings: any[] = [];

    if (status) {
      query += ` AND i.status = ?`;
      bindings.push(status);
    }

    if (categoria) {
      query += ` AND i.categoria = ?`;
      bindings.push(categoria);
    }

    if (busca) {
      query += ` AND (i.nome LIKE ? OR i.documento LIKE ?)`;
      bindings.push(`%${busca}%`, `%${busca}%`);
    }

    query += ` ORDER BY i.created_at DESC LIMIT ? OFFSET ?`;
    bindings.push(limit, offset);

    const { results: investigacoes } = await c.env.DB.prepare(query).bind(...bindings).all();

    // Count total
    let countQuery = `SELECT COUNT(*) as total FROM user_investigacoes WHERE 1=1`;
    const countBindings: any[] = [];

    if (status) {
      countQuery += ` AND status = ?`;
      countBindings.push(status);
    }

    if (categoria) {
      countQuery += ` AND categoria = ?`;
      countBindings.push(categoria);
    }

    if (busca) {
      countQuery += ` AND (nome LIKE ? OR documento LIKE ?)`;
      countBindings.push(`%${busca}%`, `%${busca}%`);
    }

    const totalResult = await c.env.DB.prepare(countQuery).bind(...countBindings).first();

    return c.json({
      success: true,
      investigacoes,
      pagination: {
        total: (totalResult as any)?.total || 0,
        limit,
        offset
      }
    });

  } catch (error: any) {
    console.error('[Admin Investigacoes] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'ADMIN_INVESTIGACOES_ERROR',
        message: 'Erro ao listar investigações',
        details: error.message
      }
    }, 500);
  }
});

/**
 * GET /api/admin/investigacoes/stats
 *
 * Estatísticas GLOBAIS de todas as investigações (apenas para admins)
 */
router.get('/investigacoes/stats', authMiddleware, async (c) => {
  try {
    // Total de investigações
    const total = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM user_investigacoes
    `).first();

    // Por status
    const emAndamento = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM user_investigacoes
      WHERE status IN ('investigar', 'investigando')
    `).first();

    const comRelatorio = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM user_investigacoes
      WHERE status = 'relatorio' OR relatorio_url IS NOT NULL
    `).first();

    const concluidas = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM user_investigacoes
      WHERE status IN ('aprovado', 'monitoramento')
    `).first();

    const bloqueadas = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM user_investigacoes
      WHERE status = 'bloqueado'
    `).first();

    // Por categoria
    const { results: porCategoria } = await c.env.DB.prepare(`
      SELECT categoria, COUNT(*) as count
      FROM user_investigacoes
      GROUP BY categoria
    `).all();

    // Por usuário (top 10)
    const { results: porUsuario } = await c.env.DB.prepare(`
      SELECT
        u.email,
        u.name,
        COUNT(i.id) as count
      FROM users u
      LEFT JOIN user_investigacoes i ON i.user_id = u.id
      GROUP BY u.id
      ORDER BY count DESC
      LIMIT 10
    `).all();

    return c.json({
      success: true,
      stats: {
        total: (total as any)?.count || 0,
        em_andamento: (emAndamento as any)?.count || 0,
        com_relatorio: (comRelatorio as any)?.count || 0,
        concluidas: (concluidas as any)?.count || 0,
        bloqueadas: (bloqueadas as any)?.count || 0,
        por_categoria: porCategoria,
        por_usuario: porUsuario
      }
    });

  } catch (error: any) {
    console.error('[Admin Investigacoes Stats] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'ADMIN_STATS_ERROR',
        message: 'Erro ao buscar estatísticas',
        details: error.message
      }
    }, 500);
  }
});

/**
 * GET /api/admin/dashboard
 *
 * Dashboard global com visão de todas as investigações (apenas para admins)
 */
router.get('/dashboard', authMiddleware, async (c) => {
  try {
    // Estatísticas gerais
    const totalInvestigacoes = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM user_investigacoes
    `).first();

    const totalUsuarios = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM users
    `).first();

    const investigacoesHoje = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM user_investigacoes
      WHERE date(created_at) = date('now')
    `).first();

    const investigacoesSemana = await c.env.DB.prepare(`
      SELECT COUNT(*) as count FROM user_investigacoes
      WHERE created_at >= date('now', '-7 days')
    `).first();

    // Investigações por status
    const { results: porStatus } = await c.env.DB.prepare(`
      SELECT status, COUNT(*) as count
      FROM user_investigacoes
      GROUP BY status
    `).all();

    // Investigações por categoria
    const { results: porCategoria } = await c.env.DB.prepare(`
      SELECT categoria, COUNT(*) as count
      FROM user_investigacoes
      GROUP BY categoria
    `).all();

    // Usuários mais ativos (top 5)
    const { results: usuariosAtivos } = await c.env.DB.prepare(`
      SELECT
        u.email,
        u.name,
        COUNT(i.id) as total_investigacoes,
        MAX(i.created_at) as ultima_investigacao
      FROM users u
      LEFT JOIN user_investigacoes i ON i.user_id = u.id
      GROUP BY u.id
      ORDER BY total_investigacoes DESC
      LIMIT 5
    `).all();

    // Investigações recentes (últimas 10)
    const { results: recentes } = await c.env.DB.prepare(`
      SELECT
        i.id,
        i.nome,
        i.documento,
        i.categoria,
        i.status,
        i.created_at,
        u.email as user_email
      FROM user_investigacoes i
      LEFT JOIN users u ON i.user_id = u.id
      ORDER BY i.created_at DESC
      LIMIT 10
    `).all();

    return c.json({
      success: true,
      data: {
        stats: {
          total_investigacoes: (totalInvestigacoes as any)?.count || 0,
          total_usuarios: (totalUsuarios as any)?.count || 0,
          investigacoes_hoje: (investigacoesHoje as any)?.count || 0,
          investigacoes_semana: (investigacoesSemana as any)?.count || 0
        },
        por_status: porStatus,
        por_categoria: porCategoria,
        usuarios_ativos: usuariosAtivos,
        recentes
      }
    });

  } catch (error: any) {
    console.error('[Admin Dashboard] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'ADMIN_DASHBOARD_ERROR',
        message: 'Erro ao buscar dados do dashboard',
        details: error.message
      }
    }, 500);
  }
});

// ============================================================================
// AUDIT LOGS
// ============================================================================

/**
 * GET /api/admin/audit-logs
 *
 * Lista logs de auditoria com filtros
 */
router.get('/audit-logs', authMiddleware, async (c) => {
  const userId = c.req.query('userId');
  const action = c.req.query('action');
  const entityType = c.req.query('entityType');
  const limit = parseInt(c.req.query('limit') || '100');
  const offset = parseInt(c.req.query('offset') || '0');

  try {
    let query = `
      SELECT
        al.id,
        al.user_id,
        u.email as user_email,
        u.name as user_name,
        al.action,
        al.entity_type,
        al.entity_id,
        al.metadata,
        al.ip_address,
        al.user_agent,
        al.created_at
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;

    const bindings: any[] = [];

    if (userId) {
      query += ` AND al.user_id = ?`;
      bindings.push(userId);
    }

    if (action) {
      query += ` AND al.action = ?`;
      bindings.push(action);
    }

    if (entityType) {
      query += ` AND al.entity_type = ?`;
      bindings.push(entityType);
    }

    query += ` ORDER BY al.created_at DESC LIMIT ? OFFSET ?`;
    bindings.push(limit, offset);

    const { results } = await c.env.DB.prepare(query).bind(...bindings).all();

    // Count total
    let countQuery = `SELECT COUNT(*) as total FROM audit_logs WHERE 1=1`;
    const countBindings: any[] = [];

    if (userId) {
      countQuery += ` AND user_id = ?`;
      countBindings.push(userId);
    }

    if (action) {
      countQuery += ` AND action = ?`;
      countBindings.push(action);
    }

    if (entityType) {
      countQuery += ` AND entity_type = ?`;
      countBindings.push(entityType);
    }

    const totalResult = await c.env.DB.prepare(countQuery).bind(...countBindings).first();

    return c.json({
      success: true,
      data: {
        logs: results,
        pagination: {
          total: (totalResult as any)?.total || 0,
          limit,
          offset
        }
      }
    });

  } catch (error: any) {
    console.error('[Admin Audit Logs] Erro:', error);
    return c.json({
      success: false,
      error: {
        code: 'AUDIT_LOGS_ERROR',
        message: 'Erro ao buscar logs de auditoria',
        details: error.message
      }
    }, 500);
  }
});

export default router;
