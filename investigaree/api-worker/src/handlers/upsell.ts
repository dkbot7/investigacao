/**
 * Contextual Upsell Handlers
 * Intelligent upgrade prompts based on user behavior and feature usage
 */

import { Env, DecodedToken } from '../types';

interface UpsellTrigger {
  id: number;
  trigger_key: string;
  trigger_type: string;
  feature_name: string;
  description: string;
  target_plans: string;
  title: string;
  message: string;
  cta_text: string;
  cta_url: string;
  urgency_level: string;
  show_discount: number;
  discount_percentage: number;
  dismissible: number;
  max_shows_per_user: number;
  cooldown_hours: number;
  priority: number;
  is_active: number;
}

interface UpsellEvent {
  id: number;
  tenant_id: number;
  user_id: number;
  trigger_id: number;
  event_type: string;
  current_plan: string;
  feature_name: string;
  context_data: string | null;
  created_at: string;
}

/**
 * GET /api/upsell/check
 * Check which upsell prompts should be shown to the user
 */
export async function handleCheckUpsell(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const context = url.searchParams.get('context'); // 'limit_reached', 'feature_blocked', etc.
    const feature = url.searchParams.get('feature'); // Specific feature name

    // Get user's current plan from tenants table
    const tenant = await env.DB.prepare(`
      SELECT plan_name FROM tenants WHERE id = (
        SELECT tenant_id FROM users WHERE id = ?
      )
    `).bind(user.userId).first<{ plan_name: string }>();

    const currentPlan = tenant?.plan_name || 'free';

    // Build query to find eligible triggers
    let query = `
      SELECT * FROM upsell_triggers
      WHERE is_active = 1
        AND (',' || target_plans || ',') LIKE '%,' || ? || ',%'
    `;
    const params: any[] = [currentPlan];

    if (context) {
      query += ` AND trigger_type = ?`;
      params.push(context);
    }

    if (feature) {
      query += ` AND feature_name = ?`;
      params.push(feature);
    }

    query += ` ORDER BY priority DESC, id DESC`;

    const triggers = await env.DB.prepare(query)
      .bind(...params)
      .all<UpsellTrigger>();

    if (!triggers.results || triggers.results.length === 0) {
      return new Response(JSON.stringify({
        success: true,
        upsells: [],
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Filter triggers based on user's interaction history
    const eligibleUpsells = [];

    for (const trigger of triggers.results) {
      // Check how many times shown to this user
      const showCount = await env.DB.prepare(`
        SELECT COUNT(*) as count
        FROM upsell_events
        WHERE user_id = ? AND trigger_id = ? AND event_type = 'shown'
      `).bind(user.userId, trigger.id).first<{ count: number }>();

      if (showCount && showCount.count >= trigger.max_shows_per_user) {
        continue; // Skip - already shown max times
      }

      // Check cooldown
      const lastShown = await env.DB.prepare(`
        SELECT created_at
        FROM upsell_events
        WHERE user_id = ? AND trigger_id = ? AND event_type = 'shown'
        ORDER BY created_at DESC
        LIMIT 1
      `).bind(user.userId, trigger.id).first<{ created_at: string }>();

      if (lastShown) {
        const hoursSinceLastShown =
          (Date.now() - new Date(lastShown.created_at).getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastShown < trigger.cooldown_hours) {
          continue; // Skip - still in cooldown
        }
      }

      eligibleUpsells.push({
        id: trigger.id,
        trigger_key: trigger.trigger_key,
        feature_name: trigger.feature_name,
        title: trigger.title,
        message: trigger.message,
        cta_text: trigger.cta_text,
        cta_url: trigger.cta_url,
        urgency_level: trigger.urgency_level,
        dismissible: trigger.dismissible === 1,
        show_discount: trigger.show_discount === 1,
        discount_percentage: trigger.discount_percentage,
        priority: trigger.priority,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      upsells: eligibleUpsells,
      current_plan: currentPlan,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Check upsell error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to check upsells',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * POST /api/upsell/track
 * Track upsell interaction events
 */
export async function handleTrackUpsell(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      trigger_id: number;
      event_type: 'shown' | 'clicked' | 'dismissed';
      feature_name: string;
      context_data?: Record<string, any>;
    };

    // Get tenant_id and plan
    const tenant = await env.DB.prepare(`
      SELECT t.id, t.plan_name
      FROM tenants t
      JOIN users u ON u.tenant_id = t.id
      WHERE u.id = ?
    `).bind(user.userId).first<{ id: number; plan_name: string }>();

    if (!tenant) {
      return new Response(JSON.stringify({
        error: 'Tenant not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get client info
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('cf-connecting-ip') || '';

    // Insert event
    await env.DB.prepare(`
      INSERT INTO upsell_events (
        tenant_id, user_id, trigger_id, event_type,
        current_plan, feature_name, context_data,
        user_agent, ip_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      tenant.id,
      user.userId,
      body.trigger_id,
      body.event_type,
      tenant.plan_name,
      body.feature_name,
      body.context_data ? JSON.stringify(body.context_data) : null,
      userAgent,
      ipAddress
    ).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Event tracked',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Track upsell error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to track event',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/upsell/triggers
 * List all upsell triggers (admin)
 */
export async function handleListTriggers(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const triggers = await env.DB.prepare(`
      SELECT * FROM upsell_triggers
      ORDER BY priority DESC, feature_name ASC
    `).all<UpsellTrigger>();

    return new Response(JSON.stringify({
      success: true,
      triggers: triggers.results || [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('List triggers error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to list triggers',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * POST /api/upsell/triggers
 * Create a new upsell trigger (admin)
 */
export async function handleCreateTrigger(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      trigger_key: string;
      trigger_type: string;
      feature_name: string;
      description: string;
      target_plans: string;
      title: string;
      message: string;
      cta_text: string;
      cta_url?: string;
      urgency_level?: string;
      show_discount?: boolean;
      discount_percentage?: number;
      dismissible?: boolean;
      max_shows_per_user?: number;
      cooldown_hours?: number;
      priority?: number;
    };

    const result = await env.DB.prepare(`
      INSERT INTO upsell_triggers (
        trigger_key, trigger_type, feature_name, description,
        target_plans, title, message, cta_text, cta_url,
        urgency_level, show_discount, discount_percentage,
        dismissible, max_shows_per_user, cooldown_hours, priority
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      body.trigger_key,
      body.trigger_type,
      body.feature_name,
      body.description,
      body.target_plans,
      body.title,
      body.message,
      body.cta_text,
      body.cta_url || '/pricing',
      body.urgency_level || 'medium',
      body.show_discount ? 1 : 0,
      body.discount_percentage || 0,
      body.dismissible !== false ? 1 : 0,
      body.max_shows_per_user || 3,
      body.cooldown_hours || 24,
      body.priority || 5
    ).run();

    return new Response(JSON.stringify({
      success: true,
      trigger_id: result.meta.last_row_id,
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Create trigger error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to create trigger',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * PUT /api/upsell/triggers/:id
 * Update upsell trigger (admin)
 */
export async function handleUpdateTrigger(
  request: Request,
  env: Env,
  user: DecodedToken,
  triggerId: string
): Promise<Response> {
  try {
    const body = await request.json() as Partial<{
      title: string;
      message: string;
      cta_text: string;
      cta_url: string;
      urgency_level: string;
      is_active: boolean;
      priority: number;
      max_shows_per_user: number;
      cooldown_hours: number;
    }>;

    const updates: string[] = [];
    const params: any[] = [];

    if (body.title !== undefined) {
      updates.push('title = ?');
      params.push(body.title);
    }
    if (body.message !== undefined) {
      updates.push('message = ?');
      params.push(body.message);
    }
    if (body.cta_text !== undefined) {
      updates.push('cta_text = ?');
      params.push(body.cta_text);
    }
    if (body.cta_url !== undefined) {
      updates.push('cta_url = ?');
      params.push(body.cta_url);
    }
    if (body.urgency_level !== undefined) {
      updates.push('urgency_level = ?');
      params.push(body.urgency_level);
    }
    if (body.is_active !== undefined) {
      updates.push('is_active = ?');
      params.push(body.is_active ? 1 : 0);
    }
    if (body.priority !== undefined) {
      updates.push('priority = ?');
      params.push(body.priority);
    }
    if (body.max_shows_per_user !== undefined) {
      updates.push('max_shows_per_user = ?');
      params.push(body.max_shows_per_user);
    }
    if (body.cooldown_hours !== undefined) {
      updates.push('cooldown_hours = ?');
      params.push(body.cooldown_hours);
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({
        error: 'No fields to update',
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(triggerId);

    await env.DB.prepare(`
      UPDATE upsell_triggers
      SET ${updates.join(', ')}
      WHERE id = ?
    `).bind(...params).run();

    return new Response(JSON.stringify({
      success: true,
      message: 'Trigger updated',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Update trigger error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to update trigger',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/upsell/analytics
 * Get upsell conversion analytics
 */
export async function handleGetUpsellAnalytics(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');

    // Overall stats
    const stats = await env.DB.prepare(`
      SELECT
        event_type,
        COUNT(*) as count
      FROM upsell_events
      WHERE created_at >= datetime('now', '-${days} days')
      GROUP BY event_type
    `).all<{ event_type: string; count: number }>();

    const statsByType: Record<string, number> = {
      shown: 0,
      clicked: 0,
      dismissed: 0,
    };

    stats.results?.forEach(row => {
      statsByType[row.event_type] = row.count;
    });

    // Calculate conversion rates
    const clickRate = statsByType.shown > 0
      ? (statsByType.clicked / statsByType.shown) * 100
      : 0;

    const dismissRate = statsByType.shown > 0
      ? (statsByType.dismissed / statsByType.shown) * 100
      : 0;

    // Top performing triggers
    const topTriggers = await env.DB.prepare(`
      SELECT
        t.trigger_key,
        t.feature_name,
        t.title,
        COUNT(CASE WHEN e.event_type = 'shown' THEN 1 END) as shown_count,
        COUNT(CASE WHEN e.event_type = 'clicked' THEN 1 END) as clicked_count,
        COUNT(CASE WHEN e.event_type = 'dismissed' THEN 1 END) as dismissed_count
      FROM upsell_triggers t
      LEFT JOIN upsell_events e ON e.trigger_id = t.id
        AND e.created_at >= datetime('now', '-${days} days')
      GROUP BY t.id
      ORDER BY clicked_count DESC
      LIMIT 10
    `).all();

    return new Response(JSON.stringify({
      success: true,
      period_days: days,
      overall: {
        total_shown: statsByType.shown,
        total_clicked: statsByType.clicked,
        total_dismissed: statsByType.dismissed,
        click_through_rate: clickRate.toFixed(2),
        dismiss_rate: dismissRate.toFixed(2),
      },
      top_triggers: topTriggers.results || [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get analytics error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get analytics',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
