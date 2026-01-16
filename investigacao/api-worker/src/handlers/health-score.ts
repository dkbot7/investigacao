/**
 * Customer Health Score Handlers
 * Predictive churn analysis and customer engagement scoring
 *
 * References:
 * - https://www.everafter.ai/glossary/customer-health-score
 * - https://www.vitally.io/post/how-to-create-a-customer-health-score-with-four-metrics
 * - https://weld.app/blog/how-to-score-the-health-of-your-customers-and-5-need-to-know-metrics
 */

import { Env, DecodedToken } from '../types';

interface HealthScoreWeights {
  onboarding: number;
  usage: number;
  engagement: number;
  support: number;
}

/**
 * Calculate component scores for a tenant
 */
async function calculateComponentScores(
  env: Env,
  tenantId: number
): Promise<{
  onboarding: number;
  usage: number;
  engagement: number;
  support: number;
}> {
  // 1. Onboarding Score (0-100)
  // Based on: profile completion, first investigation, API keys created, etc.
  const tenantInfo = await env.DB.prepare(`
    SELECT
      plan_name,
      created_at,
      (CASE WHEN plan_name != 'free' THEN 20 ELSE 0 END) as plan_points
    FROM tenants
    WHERE id = ?
  `).bind(tenantId).first<{
    plan_name: string;
    created_at: string;
    plan_points: number;
  }>();

  const apiKeysCount = await env.DB.prepare(`
    SELECT COUNT(*) as count FROM api_keys WHERE tenant_id = ? AND is_active = 1
  `).bind(tenantId).first<{ count: number }>();

  const has2FA = await env.DB.prepare(`
    SELECT COUNT(*) as count FROM user_2fa WHERE tenant_id = ? AND enabled = 1
  `).bind(tenantId).first<{ count: number }>();

  let onboardingScore = 0;
  onboardingScore += tenantInfo?.plan_points || 0;  // 0 or 20 points
  onboardingScore += Math.min(apiKeysCount?.count || 0, 1) * 30; // 0 or 30 points
  onboardingScore += Math.min(has2FA?.count || 0, 1) * 20; // 0 or 20 points
  onboardingScore += 30; // Base points for signup
  onboardingScore = Math.min(onboardingScore, 100);

  // 2. Usage Score (0-100) - HIGHEST WEIGHT
  // Based on: investigations in last 30 days, sessions, features used
  const usage30d = await env.DB.prepare(`
    SELECT COUNT(*) as count
    FROM daily_active_users
    WHERE tenant_id = ? AND date >= date('now', '-30 days')
  `).bind(tenantId).first<{ count: number }>();

  const investigations30d = await env.DB.prepare(`
    SELECT COUNT(*) as count
    FROM product_events
    WHERE tenant_id = ?
      AND event_category = 'feature_usage'
      AND event_name LIKE '%investigation%'
      AND created_at >= datetime('now', '-30 days')
  `).bind(tenantId).first<{ count: number }>();

  let usageScore = 0;
  const daysActive = usage30d?.count || 0;
  const invCount = investigations30d?.count || 0;

  // Active days: 0-15 days = 0-50 points (linear)
  usageScore += Math.min((daysActive / 15) * 50, 50);

  // Investigations: 0-50 investigations = 0-50 points (linear)
  usageScore += Math.min((invCount / 50) * 50, 50);

  usageScore = Math.round(usageScore);

  // 3. Engagement Score (0-100)
  // Based on: feature adoption, engagement events
  const featuresAdopted = await env.DB.prepare(`
    SELECT COUNT(*) as count
    FROM feature_usage
    WHERE tenant_id = ? AND usage_count > 1
  `).bind(tenantId).first<{ count: number }>();

  const powerUserFeatures = await env.DB.prepare(`
    SELECT COUNT(*) as count
    FROM feature_usage
    WHERE tenant_id = ? AND adoption_stage = 'power_user'
  `).bind(tenantId).first<{ count: number }>();

  let engagementScore = 0;
  engagementScore += Math.min((featuresAdopted?.count || 0) / 5 * 50, 50);
  engagementScore += Math.min((powerUserFeatures?.count || 0) / 3 * 50, 50);
  engagementScore = Math.round(engagementScore);

  // 4. Support Score (0-100) - INVERSE (fewer tickets = better)
  // This is a simplified version - in production you'd check actual support tickets
  // For now, we'll default to 90 (assume healthy support interactions)
  const supportScore = 90;

  return {
    onboarding: onboardingScore,
    usage: usageScore,
    engagement: engagementScore,
    support: supportScore,
  };
}

/**
 * Calculate weighted health score
 */
function calculateHealthScore(
  scores: { onboarding: number; usage: number; engagement: number; support: number },
  weights: HealthScoreWeights
): number {
  const weighted =
    scores.onboarding * weights.onboarding +
    scores.usage * weights.usage +
    scores.engagement * weights.engagement +
    scores.support * weights.support;

  return Math.round(weighted);
}

/**
 * Determine health category
 */
function getHealthCategory(score: number): 'healthy' | 'at_risk' | 'critical' {
  if (score >= 80) return 'healthy';
  if (score >= 50) return 'at_risk';
  return 'critical';
}

/**
 * Calculate churn probability
 */
function calculateChurnProbability(
  score: number,
  trend: string,
  daysSinceLastLogin: number
): { probability: number; factors: string[] } {
  let probability = 0;
  const factors: string[] = [];

  // Base probability from score
  if (score < 30) {
    probability += 0.7;
    factors.push('critical_health_score');
  } else if (score < 50) {
    probability += 0.4;
    factors.push('low_health_score');
  } else if (score < 70) {
    probability += 0.2;
  }

  // Trend factor
  if (trend === 'declining') {
    probability += 0.15;
    factors.push('declining_engagement');
  }

  // Inactivity factor
  if (daysSinceLastLogin > 14) {
    probability += 0.2;
    factors.push('prolonged_inactivity');
  } else if (daysSinceLastLogin > 7) {
    probability += 0.1;
    factors.push('recent_inactivity');
  }

  probability = Math.min(probability, 1.0);

  return { probability, factors };
}

/**
 * POST /api/health-score/calculate
 * Calculate health score for current tenant
 */
export async function handleCalculateHealthScore(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    // Get tenant
    const tenant = await env.DB.prepare(`
      SELECT t.id, t.created_at, u.last_login_at
      FROM tenants t
      JOIN users u ON u.tenant_id = t.id
      WHERE u.id = ?
    `).bind(user.userId).first<{
      id: number;
      created_at: string;
      last_login_at: string;
    }>();

    if (!tenant) {
      return new Response(JSON.stringify({
        error: 'Tenant not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get weights
    const weightsData = await env.DB.prepare(`
      SELECT component_name, weight
      FROM health_score_weights
      WHERE is_active = 1
    `).all();

    const weights: HealthScoreWeights = {
      onboarding: 0.20,
      usage: 0.40,
      engagement: 0.25,
      support: 0.15,
    };

    weightsData.results?.forEach((w: any) => {
      if (w.component_name === 'onboarding') weights.onboarding = w.weight;
      if (w.component_name === 'usage') weights.usage = w.weight;
      if (w.component_name === 'engagement') weights.engagement = w.weight;
      if (w.component_name === 'support') weights.support = w.weight;
    });

    // Calculate component scores
    const componentScores = await calculateComponentScores(env, tenant.id);

    // Calculate overall score
    const healthScore = calculateHealthScore(componentScores, weights);
    const healthCategory = getHealthCategory(healthScore);

    // Get previous score for trend analysis
    const previous = await env.DB.prepare(`
      SELECT health_score
      FROM customer_health_scores
      WHERE tenant_id = ?
      ORDER BY calculated_at DESC
      LIMIT 1
    `).bind(tenant.id).first<{ health_score: number }>();

    const previousScore = previous?.health_score || healthScore;
    const scoreDiff = healthScore - previousScore;

    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (scoreDiff >= 5) trend = 'improving';
    else if (scoreDiff <= -5) trend = 'declining';

    // Calculate days since last login
    const daysSinceLastLogin = tenant.last_login_at
      ? Math.floor((Date.now() - new Date(tenant.last_login_at).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    const daysSinceSignup = Math.floor(
      (Date.now() - new Date(tenant.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate churn probability
    const churnAnalysis = calculateChurnProbability(healthScore, trend, daysSinceLastLogin);

    // Upsert health score
    await env.DB.prepare(`
      INSERT INTO customer_health_scores (
        tenant_id, health_score, health_category,
        onboarding_score, usage_score, engagement_score, support_score,
        days_since_last_login, days_since_signup,
        churn_risk_percentage, churn_predicted, churn_factors,
        score_trend, previous_score,
        needs_intervention
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(tenant_id) DO UPDATE SET
        health_score = excluded.health_score,
        health_category = excluded.health_category,
        onboarding_score = excluded.onboarding_score,
        usage_score = excluded.usage_score,
        engagement_score = excluded.engagement_score,
        support_score = excluded.support_score,
        days_since_last_login = excluded.days_since_last_login,
        days_since_signup = excluded.days_since_signup,
        churn_risk_percentage = excluded.churn_risk_percentage,
        churn_predicted = excluded.churn_predicted,
        churn_factors = excluded.churn_factors,
        score_trend = excluded.score_trend,
        previous_score = customer_health_scores.health_score,
        needs_intervention = excluded.needs_intervention,
        calculated_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      tenant.id, healthScore, healthCategory,
      componentScores.onboarding, componentScores.usage,
      componentScores.engagement, componentScores.support,
      daysSinceLastLogin, daysSinceSignup,
      churnAnalysis.probability * 100,
      churnAnalysis.probability >= 0.5 ? 1 : 0,
      JSON.stringify(churnAnalysis.factors),
      trend, previousScore,
      healthCategory === 'critical' || churnAnalysis.probability >= 0.5 ? 1 : 0
    ).run();

    // Record in history
    await env.DB.prepare(`
      INSERT INTO health_score_history (
        tenant_id, health_score, health_category,
        onboarding_score, usage_score, engagement_score, support_score,
        churn_risk_percentage
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      tenant.id, healthScore, healthCategory,
      componentScores.onboarding, componentScores.usage,
      componentScores.engagement, componentScores.support,
      churnAnalysis.probability * 100
    ).run();

    return new Response(JSON.stringify({
      success: true,
      health_score: healthScore,
      health_category: healthCategory,
      component_scores: componentScores,
      trend,
      churn_risk: {
        probability: (churnAnalysis.probability * 100).toFixed(1),
        predicted: churnAnalysis.probability >= 0.5,
        factors: churnAnalysis.factors,
      },
      needs_intervention: healthCategory === 'critical' || churnAnalysis.probability >= 0.5,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Calculate health score error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to calculate health score',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/health-score/current
 * Get current health score for tenant
 */
export async function handleGetHealthScore(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
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

    const healthScore = await env.DB.prepare(`
      SELECT * FROM customer_health_scores WHERE tenant_id = ?
    `).bind(tenant.tenant_id).first();

    if (!healthScore) {
      return new Response(JSON.stringify({
        error: 'Health score not calculated yet',
        message: 'Call /api/health-score/calculate first',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      ...healthScore,
      churn_factors: healthScore.churn_factors ? JSON.parse(healthScore.churn_factors as string) : [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get health score error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get health score',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/health-score/history
 * Get health score history
 */
export async function handleGetHealthScoreHistory(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');

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

    const history = await env.DB.prepare(`
      SELECT * FROM health_score_history
      WHERE tenant_id = ?
        AND recorded_at >= datetime('now', '-${days} days')
      ORDER BY recorded_at ASC
    `).bind(tenant.tenant_id).all();

    return new Response(JSON.stringify({
      success: true,
      history: history.results || [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get health score history error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get history',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
