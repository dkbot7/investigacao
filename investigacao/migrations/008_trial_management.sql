-- Migration 008: Trial Management (14 dias)
-- Implements trial period tracking and management for free accounts

-- Add trial tracking fields to tenants table
ALTER TABLE tenants ADD COLUMN trial_started_at DATETIME;
ALTER TABLE tenants ADD COLUMN trial_ends_at DATETIME;
ALTER TABLE tenants ADD COLUMN trial_extended INTEGER DEFAULT 0; -- 0 = not extended, 1 = extended
ALTER TABLE tenants ADD COLUMN trial_extension_reason TEXT;
ALTER TABLE tenants ADD COLUMN trial_converted_at DATETIME; -- When trial converted to paid plan

-- Trial Notifications Table
-- Tracks trial-related notifications sent to users
CREATE TABLE IF NOT EXISTS trial_notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,

  -- Notification details
  notification_type TEXT NOT NULL CHECK(notification_type IN (
    'trial_started',
    'trial_7_days_left',
    'trial_3_days_left',
    'trial_1_day_left',
    'trial_expired',
    'trial_extended'
  )),

  -- Delivery status
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  sent_via TEXT, -- 'email', 'in_app', 'both'

  -- Email details
  email_to TEXT,
  email_subject TEXT,
  email_sent INTEGER NOT NULL DEFAULT 0, -- 0 = not sent, 1 = sent

  -- In-app notification
  in_app_shown INTEGER NOT NULL DEFAULT 0, -- 0 = not shown, 1 = shown
  in_app_dismissed INTEGER NOT NULL DEFAULT 0, -- 0 = active, 1 = dismissed

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Trial Extension Requests Table
-- Tracks requests for trial extensions
CREATE TABLE IF NOT EXISTS trial_extension_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  -- Request details
  reason TEXT NOT NULL,
  requested_days INTEGER NOT NULL, -- Additional days requested

  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
  reviewed_by INTEGER, -- Admin user ID who reviewed
  reviewed_at DATETIME,
  admin_notes TEXT,

  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trial Engagement Events Table
-- Tracks user engagement during trial period for analytics
CREATE TABLE IF NOT EXISTS trial_engagement_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,

  -- Event details
  event_type TEXT NOT NULL, -- 'first_investigation', 'api_used', 'export_created', etc.
  event_data TEXT, -- JSON with additional event data

  -- Timestamp
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_tenants_trial_ends ON tenants(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_tenants_plan_trial ON tenants(plan_name, trial_ends_at);

CREATE INDEX IF NOT EXISTS idx_trial_notifications_tenant ON trial_notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_trial_notifications_type ON trial_notifications(notification_type);

CREATE INDEX IF NOT EXISTS idx_trial_extension_requests_tenant ON trial_extension_requests(tenant_id);
CREATE INDEX IF NOT EXISTS idx_trial_extension_requests_status ON trial_extension_requests(status);

CREATE INDEX IF NOT EXISTS idx_trial_engagement_events_tenant ON trial_engagement_events(tenant_id);
CREATE INDEX IF NOT EXISTS idx_trial_engagement_events_type ON trial_engagement_events(event_type);

-- Initialize trial dates for existing free plan tenants
UPDATE tenants
SET
  trial_started_at = COALESCE(trial_started_at, created_at),
  trial_ends_at = COALESCE(trial_ends_at, datetime('now', '+14 days')),
  trial_extended = COALESCE(trial_extended, 0)
WHERE plan_name = 'free';
