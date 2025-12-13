-- Migration: Self-Service Billing System
-- Subscription management, invoicing, payment methods, and revenue tracking
--
-- References:
-- - https://stripe.com/resources/more/best-practices-for-saas-billing
-- - https://docs.stripe.com/saas
-- - https://stripe.com/billing

-- Payment methods
CREATE TABLE IF NOT EXISTS payment_methods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,

  -- Method details
  payment_method_id TEXT NOT NULL UNIQUE,  -- Stripe payment method ID
  type TEXT NOT NULL CHECK(type IN (
    'card',
    'boleto',
    'pix',
    'bank_transfer',
    'wallet'
  )),

  -- Card/Account details (last 4 digits, brand, etc.)
  last_four TEXT,
  brand TEXT,  -- visa, mastercard, etc.
  exp_month INTEGER,
  exp_year INTEGER,

  -- Billing address
  billing_name TEXT,
  billing_email TEXT,
  billing_country TEXT,
  billing_postal_code TEXT,

  -- Status
  is_default INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,

  -- External references
  stripe_customer_id TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_payment_methods_tenant ON payment_methods(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_stripe_id ON payment_methods(payment_method_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(is_default);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,

  -- Subscription details
  subscription_id TEXT NOT NULL UNIQUE,  -- Stripe subscription ID
  plan_name TEXT NOT NULL,  -- free, pro, enterprise
  billing_cycle TEXT NOT NULL CHECK(billing_cycle IN (
    'monthly',
    'annual',
    'custom'
  )),

  -- Pricing
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',

  -- Status
  status TEXT NOT NULL CHECK(status IN (
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'trialing',
    'paused'
  )),

  -- Dates
  current_period_start DATETIME NOT NULL,
  current_period_end DATETIME NOT NULL,
  trial_end DATETIME,
  canceled_at DATETIME,
  ended_at DATETIME,

  -- Payment
  payment_method_id INTEGER,

  -- Automatic renewal
  auto_renew INTEGER NOT NULL DEFAULT 1,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,

  -- External references
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_tenant ON subscriptions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  subscription_id INTEGER,

  -- Invoice details
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_id TEXT NOT NULL UNIQUE,  -- Stripe invoice ID

  -- Status
  status TEXT NOT NULL CHECK(status IN (
    'draft',
    'open',
    'paid',
    'void',
    'uncollectible'
  )),

  -- Amounts
  subtotal REAL NOT NULL,
  tax REAL DEFAULT 0,
  discount REAL DEFAULT 0,
  total REAL NOT NULL,
  amount_paid REAL DEFAULT 0,
  amount_due REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',

  -- Dates
  invoice_date DATETIME NOT NULL,
  due_date DATETIME NOT NULL,
  paid_at DATETIME,
  voided_at DATETIME,

  -- PDF/URLs
  invoice_pdf_url TEXT,
  hosted_invoice_url TEXT,

  -- Payment
  payment_method_id INTEGER,

  -- Billing details
  billing_name TEXT,
  billing_email TEXT,
  billing_address TEXT,

  -- Line items (JSON)
  line_items TEXT,  -- JSON array of items

  -- External references
  stripe_invoice_id TEXT,
  stripe_payment_intent_id TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_tenant ON invoices(tenant_id);
CREATE INDEX IF NOT EXISTS idx_invoices_subscription ON invoices(subscription_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  invoice_id INTEGER,

  -- Payment details
  payment_id TEXT NOT NULL UNIQUE,  -- Stripe payment intent ID
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',

  -- Status
  status TEXT NOT NULL CHECK(status IN (
    'pending',
    'processing',
    'succeeded',
    'failed',
    'canceled',
    'refunded'
  )),

  -- Method
  payment_method_id INTEGER,
  payment_method_type TEXT,

  -- Failure details
  failure_code TEXT,
  failure_message TEXT,

  -- Refund details
  refunded_amount REAL DEFAULT 0,
  refund_reason TEXT,

  -- External references
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,

  -- Timestamps
  paid_at DATETIME,
  failed_at DATETIME,
  refunded_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created ON payments(created_at);

-- Billing events/webhooks
CREATE TABLE IF NOT EXISTS billing_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER,

  -- Event details
  event_type TEXT NOT NULL,  -- invoice.paid, subscription.canceled, etc.
  event_id TEXT NOT NULL UNIQUE,

  -- Related entities
  subscription_id INTEGER,
  invoice_id INTEGER,
  payment_id INTEGER,

  -- Event data (JSON)
  event_data TEXT,

  -- Processing
  processed INTEGER NOT NULL DEFAULT 0,
  processed_at DATETIME,
  error_message TEXT,

  -- External references
  stripe_event_id TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_billing_events_tenant ON billing_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_billing_events_type ON billing_events(event_type);
CREATE INDEX IF NOT EXISTS idx_billing_events_processed ON billing_events(processed);
CREATE INDEX IF NOT EXISTS idx_billing_events_created ON billing_events(created_at);

-- Usage-based billing
CREATE TABLE IF NOT EXISTS usage_records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  subscription_id INTEGER,

  -- Usage details
  metric_name TEXT NOT NULL,  -- 'investigations', 'api_calls', etc.
  quantity REAL NOT NULL,
  unit_price REAL,

  -- Period
  period_start DATETIME NOT NULL,
  period_end DATETIME NOT NULL,

  -- Billing
  billed INTEGER NOT NULL DEFAULT 0,
  invoice_id INTEGER,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_usage_records_tenant ON usage_records(tenant_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_subscription ON usage_records(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_metric ON usage_records(metric_name);
CREATE INDEX IF NOT EXISTS idx_usage_records_billed ON usage_records(billed);

-- Billing preferences
CREATE TABLE IF NOT EXISTS billing_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL UNIQUE,

  -- Invoice preferences
  send_invoice_emails INTEGER NOT NULL DEFAULT 1,
  invoice_email TEXT,

  -- Payment preferences
  auto_charge INTEGER NOT NULL DEFAULT 1,

  -- Tax details
  tax_id TEXT,
  tax_exempt INTEGER NOT NULL DEFAULT 0,

  -- Communication
  billing_notifications INTEGER NOT NULL DEFAULT 1,
  payment_failure_emails INTEGER NOT NULL DEFAULT 1,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_billing_preferences_tenant ON billing_preferences(tenant_id);
