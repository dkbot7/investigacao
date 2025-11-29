/**
 * Admin API Routes
 * Endpoints administrativos para gerenciar usuários e tenants
 *
 * ACESSO: Apenas admins master
 */

import { Hono } from 'hono'
import { z } from 'zod'
import { Env } from '../index'
import { ADMIN_EMAILS } from '../services/notifications.service'

const app = new Hono<{ Bindings: Env }>()

// Lista de emails admin master (importada do notifications.service)
// Inclui: dkbotdani@gmail.com, ibsenmaciel@gmail.com, contato@investigaree.com.br

// Middleware para verificar se é admin
async function isAdmin(c: any): Promise<boolean> {
  const userEmail = c.get('userEmail') as string
  return ADMIN_EMAILS.includes(userEmail)
}

// ============================================
// SCHEMAS
// ============================================

const grantAccessSchema = z.object({
  user_email: z.string().email('Email inválido'),
  tenant_code: z.string().min(1, 'Código do tenant é obrigatório'),
  role: z.enum(['admin', 'editor', 'viewer']).default('viewer'),
  expires_at: z.string().optional(), // ISO date string
})

const createTenantSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório').max(50),
  name: z.string().min(1, 'Nome é obrigatório').max(200),
})

// ============================================
// ROUTES
// ============================================

/**
 * GET /api/admin/users
 * Lista todos os usuários e seus tenants
 */
app.get('/users', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const users = await c.env.DB.prepare(`
      SELECT
        u.id,
        u.email,
        u.name,
        u.phone,
        u.created_at,
        GROUP_CONCAT(t.code || ':' || ut.role) as tenants
      FROM users u
      LEFT JOIN user_tenants ut ON u.id = ut.user_id AND ut.is_active = 1
      LEFT JOIN tenants t ON ut.tenant_id = t.id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `).all()

    return c.json({
      users: users.results.map((u: any) => ({
        ...u,
        tenants: u.tenants ? u.tenants.split(',').map((t: string) => {
          const [code, role] = t.split(':')
          return { code, role }
        }) : []
      }))
    })
  } catch (err) {
    console.error('[ADMIN] Error listing users:', err)
    return c.json({ error: true, message: 'Erro ao listar usuários' }, 500)
  }
})

/**
 * GET /api/admin/tenants
 * Lista todos os tenants
 */
app.get('/tenants', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const tenants = await c.env.DB.prepare(`
      SELECT
        t.id,
        t.code,
        t.name,
        t.status,
        t.created_at,
        COUNT(DISTINCT ut.user_id) as user_count
      FROM tenants t
      LEFT JOIN user_tenants ut ON t.id = ut.tenant_id AND ut.is_active = 1
      GROUP BY t.id
      ORDER BY t.code
    `).all()

    return c.json({ tenants: tenants.results })
  } catch (err) {
    console.error('[ADMIN] Error listing tenants:', err)
    return c.json({ error: true, message: 'Erro ao listar tenants' }, 500)
  }
})

/**
 * POST /api/admin/tenants
 * Criar novo tenant
 */
app.post('/tenants', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const body = await c.req.json()
    const data = createTenantSchema.parse(body)

    const tenantId = `tenant_${data.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`

    await c.env.DB.prepare(`
      INSERT INTO tenants (id, code, name, email, status)
      VALUES (?, ?, ?, ?, 'active')
    `).bind(
      tenantId,
      data.code,
      data.name,
      `${data.code.toLowerCase()}@investigaree.com.br`
    ).run()

    return c.json({
      success: true,
      tenant: {
        id: tenantId,
        code: data.code,
        name: data.name
      }
    }, 201)
  } catch (err: any) {
    console.error('[ADMIN] Error creating tenant:', err)

    if (err.message?.includes('UNIQUE')) {
      return c.json({ error: true, message: 'Tenant já existe' }, 400)
    }

    return c.json({ error: true, message: 'Erro ao criar tenant' }, 500)
  }
})

/**
 * POST /api/admin/grant-access
 * Concede acesso de um usuário a um tenant
 */
app.post('/grant-access', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const body = await c.req.json()
    const data = grantAccessSchema.parse(body)

    // Buscar usuário pelo email
    const user = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ? LIMIT 1'
    ).bind(data.user_email).first() as { id: string } | null

    if (!user) {
      return c.json({ error: true, message: 'Usuário não encontrado' }, 404)
    }

    // Buscar tenant pelo código
    const tenant = await c.env.DB.prepare(
      'SELECT id FROM tenants WHERE code = ? AND status = ? LIMIT 1'
    ).bind(data.tenant_code, 'active').first() as { id: string } | null

    if (!tenant) {
      return c.json({ error: true, message: 'Tenant não encontrado' }, 404)
    }

    // Verificar se já existe associação
    const existing = await c.env.DB.prepare(
      'SELECT id, is_active FROM user_tenants WHERE user_id = ? AND tenant_id = ? LIMIT 1'
    ).bind(user.id, tenant.id).first()

    const adminEmail = c.get('userEmail') as string

    if (existing) {
      // Atualizar associação existente
      await c.env.DB.prepare(`
        UPDATE user_tenants
        SET role = ?, is_active = 1, expires_at = ?, granted_by = ?, updated_at = datetime('now')
        WHERE user_id = ? AND tenant_id = ?
      `).bind(
        data.role,
        data.expires_at || null,
        adminEmail,
        user.id,
        tenant.id
      ).run()

      return c.json({
        success: true,
        message: 'Acesso atualizado',
        action: 'updated'
      })
    }

    // Criar nova associação
    await c.env.DB.prepare(`
      INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by, expires_at, is_active)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).bind(
      crypto.randomUUID(),
      user.id,
      tenant.id,
      data.role,
      adminEmail,
      data.expires_at || null
    ).run()

    return c.json({
      success: true,
      message: 'Acesso concedido',
      action: 'created'
    }, 201)
  } catch (err: any) {
    console.error('[ADMIN] Error granting access:', err)

    if (err instanceof z.ZodError) {
      return c.json({ error: true, message: 'Dados inválidos', details: err.errors }, 400)
    }

    return c.json({ error: true, message: 'Erro ao conceder acesso' }, 500)
  }
})

/**
 * DELETE /api/admin/revoke-access
 * Revoga acesso de um usuário a um tenant
 */
app.delete('/revoke-access', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const { user_email, tenant_code } = c.req.query()

    if (!user_email || !tenant_code) {
      return c.json({ error: true, message: 'user_email e tenant_code são obrigatórios' }, 400)
    }

    // Buscar usuário
    const user = await c.env.DB.prepare(
      'SELECT id FROM users WHERE email = ? LIMIT 1'
    ).bind(user_email).first() as { id: string } | null

    if (!user) {
      return c.json({ error: true, message: 'Usuário não encontrado' }, 404)
    }

    // Buscar tenant
    const tenant = await c.env.DB.prepare(
      'SELECT id FROM tenants WHERE code = ? LIMIT 1'
    ).bind(tenant_code).first() as { id: string } | null

    if (!tenant) {
      return c.json({ error: true, message: 'Tenant não encontrado' }, 404)
    }

    // Desativar associação
    const result = await c.env.DB.prepare(`
      UPDATE user_tenants
      SET is_active = 0, updated_at = datetime('now')
      WHERE user_id = ? AND tenant_id = ?
    `).bind(user.id, tenant.id).run()

    if (result.meta.changes === 0) {
      return c.json({ error: true, message: 'Associação não encontrada' }, 404)
    }

    return c.json({
      success: true,
      message: 'Acesso revogado'
    })
  } catch (err) {
    console.error('[ADMIN] Error revoking access:', err)
    return c.json({ error: true, message: 'Erro ao revogar acesso' }, 500)
  }
})

/**
 * GET /api/admin/pending-users
 * Lista usuários sem acesso a nenhum tenant (aguardando liberação)
 */
app.get('/pending-users', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const users = await c.env.DB.prepare(`
      SELECT u.id, u.email, u.name, u.phone, u.created_at
      FROM users u
      LEFT JOIN user_tenants ut ON u.id = ut.user_id AND ut.is_active = 1
      WHERE ut.id IS NULL
      ORDER BY u.created_at DESC
    `).all()

    return c.json({ pending_users: users.results })
  } catch (err) {
    console.error('[ADMIN] Error listing pending users:', err)
    return c.json({ error: true, message: 'Erro ao listar usuários pendentes' }, 500)
  }
})

// ============================================
// ALERTS ROUTES
// ============================================

/**
 * GET /api/admin/alerts
 * Lista alertas do sistema (não lidos primeiro)
 */
app.get('/alerts', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const limit = parseInt(c.req.query('limit') || '50')
    const showRead = c.req.query('show_read') === 'true'

    let query = `
      SELECT id, type, title, message, data, severity, is_read, read_by, read_at, created_at
      FROM admin_alerts
    `
    if (!showRead) {
      query += ' WHERE is_read = 0'
    }
    query += ' ORDER BY created_at DESC LIMIT ?'

    const alerts = await c.env.DB.prepare(query).bind(limit).all()

    // Contar não lidos
    const unreadCount = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM admin_alerts WHERE is_read = 0'
    ).first() as { count: number }

    return c.json({
      alerts: alerts.results.map((a: any) => ({
        ...a,
        data: a.data ? JSON.parse(a.data) : null
      })),
      unread_count: unreadCount?.count || 0
    })
  } catch (err) {
    console.error('[ADMIN] Error listing alerts:', err)
    return c.json({ error: true, message: 'Erro ao listar alertas' }, 500)
  }
})

/**
 * POST /api/admin/alerts/:id/read
 * Marca um alerta como lido
 */
app.post('/alerts/:id/read', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const alertId = c.req.param('id')
    const adminEmail = c.get('userEmail') as string

    await c.env.DB.prepare(`
      UPDATE admin_alerts
      SET is_read = 1, read_by = ?, read_at = datetime('now')
      WHERE id = ?
    `).bind(adminEmail, alertId).run()

    return c.json({ success: true, message: 'Alerta marcado como lido' })
  } catch (err) {
    console.error('[ADMIN] Error marking alert as read:', err)
    return c.json({ error: true, message: 'Erro ao marcar alerta' }, 500)
  }
})

/**
 * POST /api/admin/alerts/read-all
 * Marca todos os alertas como lidos
 */
app.post('/alerts/read-all', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const adminEmail = c.get('userEmail') as string

    const result = await c.env.DB.prepare(`
      UPDATE admin_alerts
      SET is_read = 1, read_by = ?, read_at = datetime('now')
      WHERE is_read = 0
    `).bind(adminEmail).run()

    return c.json({
      success: true,
      message: `${result.meta.changes} alertas marcados como lidos`
    })
  } catch (err) {
    console.error('[ADMIN] Error marking all alerts as read:', err)
    return c.json({ error: true, message: 'Erro ao marcar alertas' }, 500)
  }
})

/**
 * GET /api/admin/alerts/count
 * Retorna contagem de alertas não lidos (para badge no dashboard)
 */
app.get('/alerts/count', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const result = await c.env.DB.prepare(
      'SELECT COUNT(*) as count FROM admin_alerts WHERE is_read = 0'
    ).first() as { count: number }

    return c.json({ unread_count: result?.count || 0 })
  } catch (err) {
    console.error('[ADMIN] Error counting alerts:', err)
    return c.json({ error: true, message: 'Erro ao contar alertas' }, 500)
  }
})

/**
 * GET /api/admin/stats
 * Retorna estatísticas gerais do sistema
 */
app.get('/stats', async (c) => {
  if (!await isAdmin(c)) {
    return c.json({ error: true, message: 'Acesso negado' }, 403)
  }

  try {
    const [users, tenants, pendingUsers, unreadAlerts] = await Promise.all([
      c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first() as Promise<{ count: number }>,
      c.env.DB.prepare('SELECT COUNT(*) as count FROM tenants WHERE status = ?').bind('active').first() as Promise<{ count: number }>,
      c.env.DB.prepare(`
        SELECT COUNT(*) as count FROM users u
        LEFT JOIN user_tenants ut ON u.id = ut.user_id AND ut.is_active = 1
        WHERE ut.id IS NULL
      `).first() as Promise<{ count: number }>,
      c.env.DB.prepare('SELECT COUNT(*) as count FROM admin_alerts WHERE is_read = 0').first() as Promise<{ count: number }>
    ])

    return c.json({
      total_users: users?.count || 0,
      active_tenants: tenants?.count || 0,
      pending_users: pendingUsers?.count || 0,
      unread_alerts: unreadAlerts?.count || 0
    })
  } catch (err) {
    console.error('[ADMIN] Error getting stats:', err)
    return c.json({ error: true, message: 'Erro ao buscar estatísticas' }, 500)
  }
})

export default app
