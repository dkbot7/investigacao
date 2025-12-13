-- Migration: Contextual Upsell System
-- Implements intelligent upgrade prompts based on user behavior and feature usage

-- Upsell triggers configuration
CREATE TABLE IF NOT EXISTS upsell_triggers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trigger_key TEXT NOT NULL UNIQUE,
  trigger_type TEXT NOT NULL CHECK(trigger_type IN (
    'limit_reached',        -- User hit plan limit
    'feature_blocked',      -- Tried to use premium feature
    'usage_milestone',      -- Reached usage milestone
    'engagement_high',      -- High engagement detected
    'time_based'            -- Time-based trigger (e.g., after N days)
  )),
  feature_name TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Target plans (who sees this)
  target_plans TEXT NOT NULL DEFAULT 'free', -- comma-separated: free,pro

  -- Upsell message
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  cta_text TEXT NOT NULL DEFAULT 'Upgrade Now',
  cta_url TEXT NOT NULL DEFAULT '/pricing',

  -- Visual settings
  urgency_level TEXT NOT NULL DEFAULT 'medium' CHECK(urgency_level IN ('low', 'medium', 'high')),
  show_discount INTEGER DEFAULT 0,
  discount_percentage INTEGER DEFAULT 0,

  -- Behavior
  dismissible INTEGER NOT NULL DEFAULT 1,
  max_shows_per_user INTEGER DEFAULT 3,
  cooldown_hours INTEGER DEFAULT 24,

  -- Analytics
  priority INTEGER NOT NULL DEFAULT 5, -- Higher = more important
  is_active INTEGER NOT NULL DEFAULT 1,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Upsell events log
CREATE TABLE IF NOT EXISTS upsell_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  trigger_id INTEGER NOT NULL,

  event_type TEXT NOT NULL CHECK(event_type IN (
    'shown',       -- Upsell prompt shown
    'clicked',     -- User clicked CTA
    'dismissed',   -- User dismissed prompt
    'converted'    -- User upgraded (tracked separately)
  )),

  -- Context
  current_plan TEXT NOT NULL,
  feature_name TEXT NOT NULL,
  context_data TEXT, -- JSON with additional context

  -- Session info
  user_agent TEXT,
  ip_address TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (trigger_id) REFERENCES upsell_triggers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_upsell_events_tenant ON upsell_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_upsell_events_user ON upsell_events(user_id);
CREATE INDEX IF NOT EXISTS idx_upsell_events_trigger ON upsell_events(trigger_id);
CREATE INDEX IF NOT EXISTS idx_upsell_events_type ON upsell_events(event_type);
CREATE INDEX IF NOT EXISTS idx_upsell_events_created ON upsell_events(created_at);

-- Upsell conversion tracking
CREATE TABLE IF NOT EXISTS upsell_conversions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  -- What triggered the conversion
  last_trigger_id INTEGER,

  -- Before/after
  from_plan TEXT NOT NULL,
  to_plan TEXT NOT NULL,

  -- Revenue attribution
  mrr_increase REAL NOT NULL DEFAULT 0,

  -- Time to convert
  first_upsell_shown_at DATETIME,
  converted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  days_to_convert INTEGER,
  upsell_shows_count INTEGER DEFAULT 0,

  -- Attribution
  attributed_trigger TEXT, -- Which trigger gets credit

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (last_trigger_id) REFERENCES upsell_triggers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_upsell_conversions_tenant ON upsell_conversions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_user ON upsell_conversions(user_id);
CREATE INDEX IF NOT EXISTS idx_upsell_conversions_converted ON upsell_conversions(converted_at);

-- Insert default upsell triggers
INSERT INTO upsell_triggers (
  trigger_key,
  trigger_type,
  feature_name,
  description,
  target_plans,
  title,
  message,
  cta_text,
  urgency_level,
  priority,
  max_shows_per_user,
  cooldown_hours
) VALUES
  -- Batch limit reached
  (
    'batch_limit_reached',
    'limit_reached',
    'batch_investigations',
    'User reached monthly batch investigation limit',
    'free',
    'Batch Limit Reached',
    'You''ve used all your batch investigations this month. Upgrade to Pro for unlimited batch processing.',
    'Upgrade to Pro',
    'high',
    10,
    5,
    12
  ),

  -- API key limit
  (
    'api_keys_limit',
    'limit_reached',
    'api_keys',
    'User tried to create more API keys than plan allows',
    'free',
    'Need More API Keys?',
    'Free plan includes 1 API key. Upgrade to Pro for up to 10 API keys with higher rate limits.',
    'View Plans',
    'medium',
    8,
    3,
    24
  ),

  -- Investigation limit
  (
    'investigation_limit_reached',
    'limit_reached',
    'investigations',
    'User reached monthly investigation limit',
    'free',
    'Monthly Limit Reached',
    'You''ve reached your monthly limit. Upgrade for 10x more investigations per month.',
    'See Pricing',
    'high',
    10,
    5,
    6
  ),

  -- 2FA blocked
  (
    '2fa_feature_blocked',
    'feature_blocked',
    'two_factor_auth',
    'User tried to enable 2FA (pro feature)',
    'free',
    'Enhanced Security Available',
    'Two-factor authentication is a Pro feature. Secure your account with 2FA today.',
    'Upgrade for 2FA',
    'medium',
    7,
    2,
    48
  ),

  -- High usage milestone
  (
    'power_user_milestone',
    'usage_milestone',
    'general',
    'User has made 50+ investigations',
    'free',
    'You''re a Power User!',
    'You''ve completed 50+ investigations. Unlock advanced features and save time with Pro.',
    'Upgrade Now',
    'low',
    6,
    1,
    168
  ),

  -- Batch feature preview
  (
    'batch_feature_preview',
    'feature_blocked',
    'batch_processing',
    'User viewed batch processing page on free plan',
    'free',
    'Process Investigations in Bulk',
    'Upload CSV files and process hundreds of investigations at once. Available on Pro plan.',
    'Start Free Trial',
    'medium',
    9,
    3,
    48
  ),

  -- Advanced analytics blocked
  (
    'analytics_blocked',
    'feature_blocked',
    'advanced_analytics',
    'User tried to access advanced analytics',
    'free,pro',
    'Unlock Advanced Analytics',
    'Get detailed insights, custom reports, and data exports with Enterprise plan.',
    'Contact Sales',
    'low',
    5,
    2,
    72
  ),

  -- Export feature blocked
  (
    'export_blocked',
    'feature_blocked',
    'data_export',
    'User tried to export data',
    'free',
    'Export Your Data',
    'Download and analyze your investigation results offline. Available on Pro and Enterprise plans.',
    'View Plans',
    'medium',
    7,
    3,
    24
  );
