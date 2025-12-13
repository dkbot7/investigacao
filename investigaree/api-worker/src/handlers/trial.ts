/**
 * Trial Management Handlers
 * Manages 14-day trial periods for free accounts
 */

import { Env, DecodedToken } from '../types';

interface TrialStatus {
  is_trial: boolean;
  trial_active: boolean;
  trial_expired: boolean;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  days_remaining: number;
  hours_remaining: number;
  trial_extended: number;
  trial_extension_reason: string | null;
  plan_name: string;
}

interface TenantInfo {
  id: number;
  code: string;
  plan_name: string;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  trial_extended: number;
  trial_extension_reason: string | null;
  trial_converted_at: string | null;
}

/**
 * Calculate trial status from tenant data
 */
function calculateTrialStatus(tenant: TenantInfo): TrialStatus {
  const isTrial = tenant.plan_name === 'free';
  const now = new Date();
  const trialEnds = tenant.trial_ends_at ? new Date(tenant.trial_ends_at) : null;

  const trialActive = isTrial && trialEnds !== null && trialEnds > now;
  const trialExpired = isTrial && trialEnds !== null && trialEnds <= now;

  let daysRemaining = 0;
  let hoursRemaining = 0;

  if (trialEnds && trialActive) {
    const diff = trialEnds.getTime() - now.getTime();
    daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));
    hoursRemaining = Math.ceil(diff / (1000 * 60 * 60));
  }

  return {
    is_trial: isTrial,
    trial_active: trialActive,
    trial_expired: trialExpired,
    trial_started_at: tenant.trial_started_at,
    trial_ends_at: tenant.trial_ends_at,
    days_remaining: daysRemaining,
    hours_remaining: hoursRemaining,
    trial_extended: tenant.trial_extended,
    trial_extension_reason: tenant.trial_extension_reason,
    plan_name: tenant.plan_name,
  };
}

/**
 * Log trial engagement event
 */
async function logTrialEngagement(
  env: Env,
  tenantId: number,
  userId: number,
  eventType: string,
  eventData?: any
): Promise<void> {
  await env.DB.prepare(`
    INSERT INTO trial_engagement_events (
      tenant_id, user_id, event_type, event_data
    ) VALUES (?, ?, ?, ?)
  `).bind(
    tenantId,
    userId,
    eventType,
    eventData ? JSON.stringify(eventData) : null
  ).run();
}

/**
 * Check if trial notification already sent
 */
async function isNotificationSent(
  env: Env,
  tenantId: number,
  notificationType: string
): Promise<boolean> {
  const result = await env.DB.prepare(`
    SELECT COUNT(*) as count
    FROM trial_notifications
    WHERE tenant_id = ? AND notification_type = ?
  `).bind(tenantId, notificationType).first<{ count: number }>();

  return (result?.count || 0) > 0;
}

/**
 * Record trial notification
 */
async function recordNotification(
  env: Env,
  tenantId: number,
  notificationType: string,
  sentVia: string = 'in_app'
): Promise<void> {
  await env.DB.prepare(`
    INSERT INTO trial_notifications (
      tenant_id, notification_type, sent_via, in_app_shown
    ) VALUES (?, ?, ?, 1)
  `).bind(tenantId, notificationType, sentVia).run();
}

/**
 * GET /api/trial/status
 * Get current trial status for tenant
 */
export async function handleGetTrialStatus(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    // Get tenant info
    const tenant = await env.DB.prepare(`
      SELECT id, code, plan_name, trial_started_at, trial_ends_at,
             trial_extended, trial_extension_reason, trial_converted_at
      FROM tenants
      WHERE id = ?
    `).bind(user.tenantId).first<TenantInfo>();

    if (!tenant) {
      return new Response(JSON.stringify({
        error: 'Tenant não encontrado'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const status = calculateTrialStatus(tenant);

    // Check for notifications to send
    if (status.is_trial && status.trial_active) {
      // 7 days remaining
      if (status.days_remaining <= 7 && status.days_remaining > 3) {
        const sent = await isNotificationSent(env, tenant.id, 'trial_7_days_left');
        if (!sent) {
          await recordNotification(env, tenant.id, 'trial_7_days_left');
        }
      }
      // 3 days remaining
      else if (status.days_remaining <= 3 && status.days_remaining > 1) {
        const sent = await isNotificationSent(env, tenant.id, 'trial_3_days_left');
        if (!sent) {
          await recordNotification(env, tenant.id, 'trial_3_days_left');
        }
      }
      // 1 day remaining
      else if (status.days_remaining === 1) {
        const sent = await isNotificationSent(env, tenant.id, 'trial_1_day_left');
        if (!sent) {
          await recordNotification(env, tenant.id, 'trial_1_day_left');
        }
      }
    }

    // Check if trial just expired
    if (status.trial_expired) {
      const sent = await isNotificationSent(env, tenant.id, 'trial_expired');
      if (!sent) {
        await recordNotification(env, tenant.id, 'trial_expired');
      }
    }

    return new Response(JSON.stringify({
      success: true,
      ...status
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Get trial status error:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao buscar status do trial',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/trial/extend-request
 * Request trial extension
 */
export async function handleRequestTrialExtension(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      reason: string;
      requested_days: number;
    };

    if (!body.reason || !body.requested_days) {
      return new Response(JSON.stringify({
        error: 'Campos obrigatórios faltando',
        message: 'reason e requested_days são obrigatórios'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (body.requested_days < 1 || body.requested_days > 30) {
      return new Response(JSON.stringify({
        error: 'Dias inválidos',
        message: 'Solicite entre 1 e 30 dias de extensão'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if already has pending request
    const existing = await env.DB.prepare(`
      SELECT id FROM trial_extension_requests
      WHERE tenant_id = ? AND status = 'pending'
    `).bind(user.tenantId).first();

    if (existing) {
      return new Response(JSON.stringify({
        error: 'Solicitação pendente',
        message: 'Você já possui uma solicitação de extensão em análise'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create extension request
    await env.DB.prepare(`
      INSERT INTO trial_extension_requests (
        tenant_id, user_id, reason, requested_days
      ) VALUES (?, ?, ?, ?)
    `).bind(
      user.tenantId,
      user.userId,
      body.reason,
      body.requested_days
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Solicitação enviada! Nossa equipe irá analisar em breve.'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Request trial extension error:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao solicitar extensão',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/trial/track-engagement
 * Track trial engagement event
 */
export async function handleTrackTrialEngagement(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      event_type: string;
      event_data?: any;
    };

    if (!body.event_type) {
      return new Response(JSON.stringify({
        error: 'event_type é obrigatório'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await logTrialEngagement(
      env,
      user.tenantId,
      user.userId,
      body.event_type,
      body.event_data
    );

    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Track trial engagement error:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao registrar evento',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * GET /api/trial/notifications
 * Get trial notifications for current tenant
 */
export async function handleGetTrialNotifications(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const activeOnly = url.searchParams.get('active_only') === 'true';

    let query = `
      SELECT notification_type, sent_at, sent_via, in_app_dismissed
      FROM trial_notifications
      WHERE tenant_id = ?
    `;

    if (activeOnly) {
      query += ` AND in_app_dismissed = 0`;
    }

    query += ` ORDER BY sent_at DESC`;

    const result = await env.DB.prepare(query).bind(user.tenantId).all();

    return new Response(JSON.stringify({
      success: true,
      notifications: result.results
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Get trial notifications error:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao buscar notificações',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * POST /api/trial/dismiss-notification
 * Dismiss a trial notification
 */
export async function handleDismissTrialNotification(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      notification_type: string;
    };

    if (!body.notification_type) {
      return new Response(JSON.stringify({
        error: 'notification_type é obrigatório'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(`
      UPDATE trial_notifications
      SET in_app_dismissed = 1
      WHERE tenant_id = ? AND notification_type = ?
    `).bind(user.tenantId, body.notification_type).run();

    return new Response(JSON.stringify({
      success: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Dismiss trial notification error:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao dispensar notificação',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
