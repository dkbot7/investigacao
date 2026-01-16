/**
 * Product Analytics Handlers
 * Comprehensive event tracking, feature adoption, and engagement analytics
 *
 * References:
 * - https://userguiding.com/blog/product-analytics-metrics
 * - https://whatfix.com/blog/feature-adoption/
 * - https://www.metabase.com/blog/product-metrics
 */

import { Env, DecodedToken } from '../types';

/**
 * POST /api/analytics/track
 * Track a product event
 */
export async function handleTrackEvent(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      event_name: string;
      event_category: string;
      properties?: Record<string, any>;
      session_id: string;
      page_url?: string;
    };

    // Get tenant_id
    const tenant = await env.DB.prepare(`
      SELECT tenant_id FROM users WHERE id = ?
    `).bind(user.userId).first<{ tenant_id: number }>();

    if (!tenant) {
      return new Response(JSON.stringify({
        error: 'User not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get context from request
    const userAgent = request.headers.get('user-agent') || '';
    const ipAddress = request.headers.get('cf-connecting-ip') || '';
    const country = request.headers.get('cf-ipcountry') || '';
    const city = request.headers.get('cf-ipcity') || '';
    const referrer = request.headers.get('referer') || '';

    // Parse device info
    const deviceType = userAgent.toLowerCase().includes('mobile') ? 'mobile' :
                       userAgent.toLowerCase().includes('tablet') ? 'tablet' : 'desktop';

    // Insert event
    await env.DB.prepare(`
      INSERT INTO product_events (
        tenant_id, user_id, event_name, event_category,
        properties, session_id, page_url, referrer,
        user_agent, ip_address, country, city, device_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      tenant.tenant_id,
      user.userId,
      body.event_name,
      body.event_category,
      body.properties ? JSON.stringify(body.properties) : null,
      body.session_id,
      body.page_url || '',
      referrer,
      userAgent,
      ipAddress,
      country,
      city,
      deviceType
    ).run();

    // Update session
    await env.DB.prepare(`
      UPDATE user_sessions
      SET events_count = events_count + 1,
          ended_at = CURRENT_TIMESTAMP
      WHERE session_id = ?
    `).bind(body.session_id).run();

    return new Response(JSON.stringify({
      success: true,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Track event error:', error);
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
 * POST /api/analytics/session/start
 * Start a user session
 */
export async function handleStartSession(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      session_id: string;
      entry_page?: string;
    };

    // Get tenant_id
    const tenant = await env.DB.prepare(`
      SELECT tenant_id FROM users WHERE id = ?
    `).bind(user.userId).first<{ tenant_id: number }>();

    if (!tenant) {
      return new Response(JSON.stringify({
        error: 'User not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get context
    const userAgent = request.headers.get('user-agent') || '';
    const country = request.headers.get('cf-ipcountry') || '';
    const referrer = request.headers.get('referer') || '';
    const deviceType = userAgent.toLowerCase().includes('mobile') ? 'mobile' :
                       userAgent.toLowerCase().includes('tablet') ? 'tablet' : 'desktop';

    // Insert session
    await env.DB.prepare(`
      INSERT OR IGNORE INTO user_sessions (
        tenant_id, user_id, session_id, entry_page,
        referrer, user_agent, device_type, country
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      tenant.tenant_id,
      user.userId,
      body.session_id,
      body.entry_page || '',
      referrer,
      userAgent,
      deviceType,
      country
    ).run();

    return new Response(JSON.stringify({
      success: true,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Start session error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to start session',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * POST /api/analytics/feature-usage
 * Track feature usage
 */
export async function handleTrackFeatureUsage(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      feature_key: string;
      feature_name: string;
    };

    // Get tenant_id
    const tenant = await env.DB.prepare(`
      SELECT tenant_id FROM users WHERE id = ?
    `).bind(user.userId).first<{ tenant_id: number }>();

    if (!tenant) {
      return new Response(JSON.stringify({
        error: 'User not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if feature usage exists
    const existing = await env.DB.prepare(`
      SELECT usage_count FROM feature_usage
      WHERE user_id = ? AND feature_key = ?
    `).bind(user.userId, body.feature_key).first<{ usage_count: number }>();

    if (existing) {
      // Update
      const newCount = existing.usage_count + 1;
      let adoptionStage = 'trial';
      if (newCount >= 20) adoptionStage = 'power_user';
      else if (newCount >= 5) adoptionStage = 'regular';
      else if (newCount >= 2) adoptionStage = 'occasional';

      await env.DB.prepare(`
        UPDATE feature_usage
        SET usage_count = usage_count + 1,
            last_used_at = CURRENT_TIMESTAMP,
            adoption_stage = ?
        WHERE user_id = ? AND feature_key = ?
      `).bind(adoptionStage, user.userId, body.feature_key).run();

    } else {
      // Insert
      await env.DB.prepare(`
        INSERT INTO feature_usage (
          tenant_id, user_id, feature_key, feature_name,
          usage_count, adoption_stage
        ) VALUES (?, ?, ?, ?, 1, 'trial')
      `).bind(
        tenant.tenant_id,
        user.userId,
        body.feature_key,
        body.feature_name
      ).run();
    }

    return new Response(JSON.stringify({
      success: true,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Track feature usage error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to track feature usage',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/analytics/dashboard
 * Get overall analytics dashboard metrics
 */
export async function handleGetDashboard(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');

    // Get tenant_id
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

    // Total events
    const totalEvents = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM product_events
      WHERE tenant_id = ?
        AND created_at >= datetime('now', '-${days} days')
    `).bind(tenant.id).first<{ count: number }>();

    // Total sessions
    const totalSessions = await env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM user_sessions
      WHERE tenant_id = ?
        AND started_at >= datetime('now', '-${days} days')
    `).bind(tenant.id).first<{ count: number }>();

    // DAU/MAU
    const dau = await env.DB.prepare(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM daily_active_users
      WHERE tenant_id = ? AND date = date('now')
    `).bind(tenant.id).first<{ count: number }>();

    const mau = await env.DB.prepare(`
      SELECT COUNT(DISTINCT user_id) as count
      FROM daily_active_users
      WHERE tenant_id = ?
        AND date >= date('now', '-30 days')
    `).bind(tenant.id).first<{ count: number }>();

    // Top events
    const topEvents = await env.DB.prepare(`
      SELECT event_name, COUNT(*) as count
      FROM product_events
      WHERE tenant_id = ?
        AND created_at >= datetime('now', '-${days} days')
      GROUP BY event_name
      ORDER BY count DESC
      LIMIT 10
    `).bind(tenant.id).all();

    // Device breakdown
    const deviceBreakdown = await env.DB.prepare(`
      SELECT device_type, COUNT(*) as count
      FROM user_sessions
      WHERE tenant_id = ?
        AND started_at >= datetime('now', '-${days} days')
      GROUP BY device_type
    `).bind(tenant.id).all();

    return new Response(JSON.stringify({
      success: true,
      period_days: days,
      metrics: {
        total_events: totalEvents?.count || 0,
        total_sessions: totalSessions?.count || 0,
        daily_active_users: dau?.count || 0,
        monthly_active_users: mau?.count || 0,
        stickiness: mau && mau.count > 0 ? ((dau?.count || 0) / mau.count * 100).toFixed(2) : '0.00',
      },
      top_events: topEvents.results || [],
      device_breakdown: deviceBreakdown.results || [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get dashboard error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get dashboard',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/analytics/feature-adoption
 * Get feature adoption metrics
 */
export async function handleGetFeatureAdoption(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    // Get tenant_id
    const tenant = await env.DB.prepare(`
      SELECT tenant_id FROM users WHERE id = ?
    `).bind(user.userId).first<{ tenant_id: number }>();

    if (!tenant) {
      return new Response(JSON.stringify({
        error: 'Tenant not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Feature adoption breakdown
    const featureStats = await env.DB.prepare(`
      SELECT
        feature_name,
        feature_key,
        COUNT(DISTINCT user_id) as users_count,
        SUM(usage_count) as total_uses,
        AVG(usage_count) as avg_uses_per_user,
        COUNT(CASE WHEN adoption_stage = 'power_user' THEN 1 END) as power_users,
        COUNT(CASE WHEN adoption_stage = 'regular' THEN 1 END) as regular_users,
        COUNT(CASE WHEN adoption_stage = 'occasional' THEN 1 END) as occasional_users,
        COUNT(CASE WHEN adoption_stage = 'trial' THEN 1 END) as trial_users
      FROM feature_usage
      WHERE tenant_id = ?
      GROUP BY feature_key, feature_name
      ORDER BY users_count DESC
    `).bind(tenant.tenant_id).all();

    // Calculate adoption rates (users who used feature / total users)
    const totalUsers = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM users WHERE tenant_id = ?
    `).bind(tenant.tenant_id).first<{ count: number }>();

    const featuresWithRates = (featureStats.results || []).map((feature: any) => ({
      ...feature,
      adoption_rate: totalUsers && totalUsers.count > 0
        ? ((feature.users_count / totalUsers.count) * 100).toFixed(2)
        : '0.00',
    }));

    return new Response(JSON.stringify({
      success: true,
      total_users: totalUsers?.count || 0,
      features: featuresWithRates,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get feature adoption error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get feature adoption',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/analytics/retention
 * Get retention cohort metrics
 */
export async function handleGetRetention(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const cohortType = url.searchParams.get('type') || 'weekly'; // weekly or monthly

    // Get tenant_id
    const tenant = await env.DB.prepare(`
      SELECT tenant_id FROM users WHERE id = ?
    `).bind(user.userId).first<{ tenant_id: number }>();

    if (!tenant) {
      return new Response(JSON.stringify({
        error: 'Tenant not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get retention cohorts
    const cohorts = await env.DB.prepare(`
      SELECT * FROM retention_cohorts
      WHERE tenant_id = ? AND cohort_type = ?
      ORDER BY cohort_date DESC
      LIMIT 12
    `).bind(tenant.tenant_id, cohortType).all();

    return new Response(JSON.stringify({
      success: true,
      cohort_type: cohortType,
      cohorts: cohorts.results || [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get retention error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get retention',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
