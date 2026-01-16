-- Migration: Product Analytics System
-- Comprehensive event tracking, feature adoption, and user engagement analytics

-- Product events tracking
CREATE TABLE IF NOT EXISTS product_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  -- Event details
  event_name TEXT NOT NULL,
  event_category TEXT NOT NULL CHECK(event_category IN (
    'page_view',
    'feature_usage',
    'conversion',
    'onboarding',
    'engagement',
    'error',
    'custom'
  )),

  -- Event properties (JSON)
  properties TEXT,

  -- Session tracking
  session_id TEXT NOT NULL,

  -- Context
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,

  -- Geo data (from Cloudflare)
  country TEXT,
  city TEXT,

  -- Device info
  device_type TEXT, -- desktop, mobile, tablet
  browser TEXT,
  os TEXT,

  -- Timing
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_product_events_tenant ON product_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_product_events_user ON product_events(user_id);
CREATE INDEX IF NOT EXISTS idx_product_events_name ON product_events(event_name);
CREATE INDEX IF NOT EXISTS idx_product_events_category ON product_events(event_category);
CREATE INDEX IF NOT EXISTS idx_product_events_session ON product_events(session_id);
CREATE INDEX IF NOT EXISTS idx_product_events_created ON product_events(created_at);

-- User sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  session_id TEXT NOT NULL UNIQUE,

  -- Session details
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  ended_at DATETIME,
  duration_seconds INTEGER,

  -- Activity
  page_views_count INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  features_used TEXT, -- comma-separated list

  -- Engagement score (0-100)
  engagement_score INTEGER DEFAULT 0,

  -- Context
  entry_page TEXT,
  exit_page TEXT,
  referrer TEXT,
  user_agent TEXT,
  device_type TEXT,
  country TEXT,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_tenant ON user_sessions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started ON user_sessions(started_at);

-- Feature usage tracking
CREATE TABLE IF NOT EXISTS feature_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  feature_key TEXT NOT NULL,
  feature_name TEXT NOT NULL,

  -- Usage stats
  first_used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  usage_count INTEGER DEFAULT 1,

  -- Adoption stage
  adoption_stage TEXT NOT NULL DEFAULT 'trial' CHECK(adoption_stage IN (
    'trial',        -- First use
    'occasional',   -- < 5 uses
    'regular',      -- 5-20 uses
    'power_user'    -- > 20 uses
  )),

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE(user_id, feature_key)
);

CREATE INDEX IF NOT EXISTS idx_feature_usage_tenant ON feature_usage(tenant_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user ON feature_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature ON feature_usage(feature_key);
CREATE INDEX IF NOT EXISTS idx_feature_usage_adoption ON feature_usage(adoption_stage);

-- Daily active users tracking
CREATE TABLE IF NOT EXISTS daily_active_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL, -- YYYY-MM-DD format

  -- Activity metrics
  sessions_count INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  features_used_count INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE(user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_dau_tenant ON daily_active_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_dau_user ON daily_active_users(user_id);
CREATE INDEX IF NOT EXISTS idx_dau_date ON daily_active_users(date);

-- Funnel steps tracking
CREATE TABLE IF NOT EXISTS funnel_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  funnel_name TEXT NOT NULL,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,

  session_id TEXT NOT NULL,
  completed INTEGER NOT NULL DEFAULT 0,

  -- Timing
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  duration_seconds INTEGER,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_funnel_events_tenant ON funnel_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_user ON funnel_events(user_id);
CREATE INDEX IF NOT EXISTS idx_funnel_events_funnel ON funnel_events(funnel_name);
CREATE INDEX IF NOT EXISTS idx_funnel_events_step ON funnel_events(step_name);
CREATE INDEX IF NOT EXISTS idx_funnel_events_session ON funnel_events(session_id);

-- Retention cohorts
CREATE TABLE IF NOT EXISTS retention_cohorts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,

  cohort_date TEXT NOT NULL, -- YYYY-MM-DD format (signup week/month)
  cohort_type TEXT NOT NULL CHECK(cohort_type IN ('weekly', 'monthly')),

  -- Cohort size
  users_count INTEGER DEFAULT 0,

  -- Retention by period
  period_0 INTEGER DEFAULT 0,  -- Week/Month 0 (signup period)
  period_1 INTEGER DEFAULT 0,  -- Week/Month 1
  period_2 INTEGER DEFAULT 0,
  period_3 INTEGER DEFAULT 0,
  period_4 INTEGER DEFAULT 0,
  period_5 INTEGER DEFAULT 0,
  period_6 INTEGER DEFAULT 0,
  period_7 INTEGER DEFAULT 0,
  period_8 INTEGER DEFAULT 0,
  period_9 INTEGER DEFAULT 0,
  period_10 INTEGER DEFAULT 0,
  period_11 INTEGER DEFAULT 0,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,

  UNIQUE(tenant_id, cohort_date, cohort_type)
);

CREATE INDEX IF NOT EXISTS idx_retention_cohorts_tenant ON retention_cohorts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_retention_cohorts_date ON retention_cohorts(cohort_date);
CREATE INDEX IF NOT EXISTS idx_retention_cohorts_type ON retention_cohorts(cohort_type);
