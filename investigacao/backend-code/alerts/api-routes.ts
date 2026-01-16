/**
 * API Routes - Alertas
 *
 * Endpoints para gerenciar alertas no frontend
 */

import { Env } from '../types';

/**
 * GET /api/alerts
 * Lista alertas do usuário
 */
export async function handleGetAlerts(
  request: Request,
  env: Env,
  userId: string,
  tenantId: string
): Promise<Response> {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const onlyUnread = url.searchParams.get('unread') === 'true';

  let query = `
    SELECT a.*, i.nome_investigado, i.cpf_cnpj
    FROM alerts a
    LEFT JOIN investigations i ON a.investigation_id = i.id
    WHERE a.user_id = ? AND a.tenant_id = ?
  `;

  if (onlyUnread) {
    query += ` AND a.is_read = 0`;
  }

  query += ` ORDER BY a.created_at DESC LIMIT ?`;

  const { results: alerts } = await env.DB.prepare(query)
    .bind(userId, tenantId, limit)
    .all();

  return new Response(JSON.stringify({
    alerts,
    count: alerts.length
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * POST /api/alerts/:id/read
 * Marca alerta como lido
 */
export async function handleMarkAlertAsRead(
  request: Request,
  env: Env,
  alertId: string,
  userId: string
): Promise<Response> {
  const now = Math.floor(Date.now() / 1000);

  const result = await env.DB.prepare(
    `UPDATE alerts
     SET is_read = 1, read_at = ?
     WHERE id = ? AND user_id = ?`
  ).bind(now, alertId, userId).run();

  if (result.meta.changes === 0) {
    return new Response(JSON.stringify({
      error: 'Alert not found or unauthorized'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    alertId,
    readAt: now
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * POST /api/alerts/mark-all-read
 * Marca todos os alertas como lidos
 */
export async function handleMarkAllAlertsAsRead(
  request: Request,
  env: Env,
  userId: string,
  tenantId: string
): Promise<Response> {
  const now = Math.floor(Date.now() / 1000);

  const result = await env.DB.prepare(
    `UPDATE alerts
     SET is_read = 1, read_at = ?
     WHERE user_id = ? AND tenant_id = ? AND is_read = 0`
  ).bind(now, userId, tenantId).run();

  return new Response(JSON.stringify({
    success: true,
    markedCount: result.meta.changes
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * GET /api/alerts/config
 * Busca configuração de alertas do tenant
 */
export async function handleGetAlertConfig(
  request: Request,
  env: Env,
  tenantId: string
): Promise<Response> {
  const config = await env.DB.prepare(
    `SELECT * FROM alert_config WHERE tenant_id = ?`
  ).bind(tenantId).first();

  if (!config) {
    // Retorna config padrão
    return new Response(JSON.stringify({
      enabled: true,
      email_enabled: true,
      alert_types: ['ceis_entry', 'processo_novo', 'vinculo_mudanca', 'cnep_entry', 'obito'],
      check_frequency_hours: 24,
      notification_email: null
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    ...config,
    alert_types: JSON.parse(config.alert_types as string)
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * PUT /api/alerts/config
 * Atualiza configuração de alertas do tenant
 */
export async function handleUpdateAlertConfig(
  request: Request,
  env: Env,
  tenantId: string
): Promise<Response> {
  const body = await request.json() as {
    enabled?: boolean;
    email_enabled?: boolean;
    alert_types?: string[];
    check_frequency_hours?: number;
    notification_email?: string | null;
  };

  const now = Math.floor(Date.now() / 1000);

  // Check if config exists
  const existing = await env.DB.prepare(
    `SELECT id FROM alert_config WHERE tenant_id = ?`
  ).bind(tenantId).first();

  if (existing) {
    // Update
    await env.DB.prepare(
      `UPDATE alert_config
       SET enabled = ?,
           email_enabled = ?,
           alert_types = ?,
           check_frequency_hours = ?,
           notification_email = ?,
           updated_at = ?
       WHERE tenant_id = ?`
    ).bind(
      body.enabled !== undefined ? (body.enabled ? 1 : 0) : null,
      body.email_enabled !== undefined ? (body.email_enabled ? 1 : 0) : null,
      body.alert_types ? JSON.stringify(body.alert_types) : null,
      body.check_frequency_hours || null,
      body.notification_email || null,
      now,
      tenantId
    ).run();
  } else {
    // Insert
    const configId = crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO alert_config (
        id, tenant_id, enabled, email_enabled, alert_types,
        check_frequency_hours, notification_email, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      configId,
      tenantId,
      body.enabled !== undefined ? (body.enabled ? 1 : 0) : 1,
      body.email_enabled !== undefined ? (body.email_enabled ? 1 : 0) : 1,
      JSON.stringify(body.alert_types || ['ceis_entry', 'processo_novo']),
      body.check_frequency_hours || 24,
      body.notification_email || null,
      now,
      now
    ).run();
  }

  return new Response(JSON.stringify({
    success: true,
    tenantId
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

/**
 * GET /api/alerts/unread-count
 * Conta alertas não lidos
 */
export async function handleGetUnreadCount(
  request: Request,
  env: Env,
  userId: string,
  tenantId: string
): Promise<Response> {
  const result = await env.DB.prepare(
    `SELECT COUNT(*) as count
     FROM alerts
     WHERE user_id = ? AND tenant_id = ? AND is_read = 0`
  ).bind(userId, tenantId).first<{ count: number }>();

  return new Response(JSON.stringify({
    count: result?.count || 0
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
