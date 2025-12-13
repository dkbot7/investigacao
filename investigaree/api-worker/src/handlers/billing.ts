/**
 * Self-Service Billing Handlers
 * Subscription management, invoicing, payment methods
 *
 * References:
 * - https://stripe.com/resources/more/best-practices-for-saas-billing
 * - https://docs.stripe.com/saas
 * - https://stripe.com/billing
 *
 * Note: This implementation provides the database/API layer.
 * Stripe integration would be added via Stripe SDK in production.
 */

import { Env, DecodedToken } from '../types';

/**
 * GET /api/billing/subscription
 * Get current subscription details
 */
export async function handleGetSubscription(
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

    // Get active subscription
    const subscription = await env.DB.prepare(`
      SELECT
        s.*,
        pm.type as payment_method_type,
        pm.last_four,
        pm.brand
      FROM subscriptions s
      LEFT JOIN payment_methods pm ON pm.id = s.payment_method_id
      WHERE s.tenant_id = ? AND s.status IN ('active', 'trialing', 'past_due')
      ORDER BY s.created_at DESC
      LIMIT 1
    `).bind(tenant.tenant_id).first();

    if (!subscription) {
      return new Response(JSON.stringify({
        error: 'No active subscription',
        message: 'Tenant does not have an active subscription',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      subscription,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get subscription error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get subscription',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * POST /api/billing/subscription/change
 * Change subscription plan
 */
export async function handleChangeSubscription(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      plan_name: string;
      billing_cycle: string;
    };

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

    // Get current subscription
    const currentSub = await env.DB.prepare(`
      SELECT * FROM subscriptions
      WHERE tenant_id = ? AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(tenant.tenant_id).first<any>();

    // Calculate new amount based on plan
    let amount = 0;
    if (body.plan_name === 'pro') {
      amount = body.billing_cycle === 'annual' ? 99 * 12 * 0.8 : 99; // 20% discount for annual
    } else if (body.plan_name === 'enterprise') {
      amount = body.billing_cycle === 'annual' ? 299 * 12 * 0.8 : 299;
    }

    if (currentSub) {
      // Update existing subscription
      await env.DB.prepare(`
        UPDATE subscriptions
        SET plan_name = ?,
            billing_cycle = ?,
            amount = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(body.plan_name, body.billing_cycle, amount, currentSub.id).run();

      // Update tenant plan
      await env.DB.prepare(`
        UPDATE tenants
        SET plan_name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(body.plan_name, tenant.tenant_id).run();

    } else {
      // Create new subscription
      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + (body.billing_cycle === 'annual' ? 12 : 1));

      await env.DB.prepare(`
        INSERT INTO subscriptions (
          tenant_id, subscription_id, plan_name, billing_cycle,
          amount, currency, status,
          current_period_start, current_period_end
        ) VALUES (?, ?, ?, ?, ?, 'BRL', 'active', ?, ?)
      `).bind(
        tenant.tenant_id,
        `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        body.plan_name,
        body.billing_cycle,
        amount,
        now.toISOString(),
        periodEnd.toISOString()
      ).run();

      // Update tenant plan
      await env.DB.prepare(`
        UPDATE tenants
        SET plan_name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(body.plan_name, tenant.tenant_id).run();
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Subscription updated successfully',
      plan: body.plan_name,
      billing_cycle: body.billing_cycle,
      amount,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Change subscription error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to change subscription',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * POST /api/billing/subscription/cancel
 * Cancel subscription
 */
export async function handleCancelSubscription(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as {
      cancel_immediately?: boolean;
      cancellation_reason?: string;
    };

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

    if (body.cancel_immediately) {
      // Cancel immediately
      await env.DB.prepare(`
        UPDATE subscriptions
        SET status = 'canceled',
            canceled_at = CURRENT_TIMESTAMP,
            ended_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = ? AND status = 'active'
      `).bind(tenant.tenant_id).run();

      // Downgrade to free plan
      await env.DB.prepare(`
        UPDATE tenants
        SET plan_name = 'free', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(tenant.tenant_id).run();

    } else {
      // Cancel at period end
      await env.DB.prepare(`
        UPDATE subscriptions
        SET cancel_at_period_end = 1,
            canceled_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE tenant_id = ? AND status = 'active'
      `).bind(tenant.tenant_id).run();
    }

    return new Response(JSON.stringify({
      success: true,
      message: body.cancel_immediately
        ? 'Subscription canceled immediately'
        : 'Subscription will cancel at period end',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to cancel subscription',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/billing/invoices
 * List invoices for tenant
 */
export async function handleListInvoices(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = parseInt(url.searchParams.get('offset') || '0');

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

    const invoices = await env.DB.prepare(`
      SELECT * FROM invoices
      WHERE tenant_id = ?
      ORDER BY invoice_date DESC
      LIMIT ? OFFSET ?
    `).bind(tenant.tenant_id, limit, offset).all();

    const total = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM invoices
      WHERE tenant_id = ?
    `).bind(tenant.tenant_id).first<{ count: number }>();

    return new Response(JSON.stringify({
      success: true,
      invoices: invoices.results || [],
      pagination: {
        total: total?.count || 0,
        limit,
        offset,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('List invoices error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to list invoices',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/billing/invoices/:id
 * Get invoice details
 */
export async function handleGetInvoice(
  request: Request,
  env: Env,
  user: DecodedToken,
  invoiceId: string
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

    const invoice = await env.DB.prepare(`
      SELECT * FROM invoices
      WHERE id = ? AND tenant_id = ?
    `).bind(invoiceId, tenant.tenant_id).first();

    if (!invoice) {
      return new Response(JSON.stringify({
        error: 'Invoice not found',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      invoice: {
        ...invoice,
        line_items: invoice.line_items ? JSON.parse(invoice.line_items as string) : [],
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get invoice error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get invoice',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/billing/payment-methods
 * List payment methods
 */
export async function handleListPaymentMethods(
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

    const paymentMethods = await env.DB.prepare(`
      SELECT * FROM payment_methods
      WHERE tenant_id = ? AND is_active = 1
      ORDER BY is_default DESC, created_at DESC
    `).bind(tenant.tenant_id).all();

    return new Response(JSON.stringify({
      success: true,
      payment_methods: paymentMethods.results || [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('List payment methods error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to list payment methods',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/billing/usage
 * Get current billing period usage
 */
export async function handleGetUsage(
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

    // Get current subscription period
    const subscription = await env.DB.prepare(`
      SELECT current_period_start, current_period_end, plan_name
      FROM subscriptions
      WHERE tenant_id = ? AND status = 'active'
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(tenant.tenant_id).first<{
      current_period_start: string;
      current_period_end: string;
      plan_name: string;
    }>();

    if (!subscription) {
      return new Response(JSON.stringify({
        error: 'No active subscription',
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get usage for current period
    const usage = await env.DB.prepare(`
      SELECT
        metric_name,
        SUM(quantity) as total_quantity,
        COUNT(*) as record_count
      FROM usage_records
      WHERE tenant_id = ?
        AND period_start >= ?
        AND period_end <= ?
      GROUP BY metric_name
    `).bind(
      tenant.tenant_id,
      subscription.current_period_start,
      subscription.current_period_end
    ).all();

    return new Response(JSON.stringify({
      success: true,
      period: {
        start: subscription.current_period_start,
        end: subscription.current_period_end,
      },
      plan: subscription.plan_name,
      usage: usage.results || [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get usage error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get usage',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * GET /api/billing/preferences
 * Get billing preferences
 */
export async function handleGetBillingPreferences(
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

    let preferences = await env.DB.prepare(`
      SELECT * FROM billing_preferences WHERE tenant_id = ?
    `).bind(tenant.tenant_id).first();

    if (!preferences) {
      // Create default preferences
      await env.DB.prepare(`
        INSERT INTO billing_preferences (tenant_id)
        VALUES (?)
      `).bind(tenant.tenant_id).run();

      preferences = await env.DB.prepare(`
        SELECT * FROM billing_preferences WHERE tenant_id = ?
      `).bind(tenant.tenant_id).first();
    }

    return new Response(JSON.stringify({
      success: true,
      preferences,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Get billing preferences error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to get preferences',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

/**
 * PUT /api/billing/preferences
 * Update billing preferences
 */
export async function handleUpdateBillingPreferences(
  request: Request,
  env: Env,
  user: DecodedToken
): Promise<Response> {
  try {
    const body = await request.json() as Partial<{
      send_invoice_emails: boolean;
      invoice_email: string;
      billing_notifications: boolean;
      payment_failure_emails: boolean;
    }>;

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

    const updates: string[] = [];
    const params: any[] = [];

    if (body.send_invoice_emails !== undefined) {
      updates.push('send_invoice_emails = ?');
      params.push(body.send_invoice_emails ? 1 : 0);
    }
    if (body.invoice_email !== undefined) {
      updates.push('invoice_email = ?');
      params.push(body.invoice_email);
    }
    if (body.billing_notifications !== undefined) {
      updates.push('billing_notifications = ?');
      params.push(body.billing_notifications ? 1 : 0);
    }
    if (body.payment_failure_emails !== undefined) {
      updates.push('payment_failure_emails = ?');
      params.push(body.payment_failure_emails ? 1 : 0);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(tenant.tenant_id);

      await env.DB.prepare(`
        UPDATE billing_preferences
        SET ${updates.join(', ')}
        WHERE tenant_id = ?
      `).bind(...params).run();
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Preferences updated',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Update billing preferences error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to update preferences',
      message: error.message,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
