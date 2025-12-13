-- Migration 006: API Keys and Public REST API
-- Enables external integrations via API keys

-- API Keys Table
-- Stores API keys for programmatic access
CREATE TABLE IF NOT EXISTS api_keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,

  -- Key identification
  name TEXT NOT NULL, -- User-friendly name (e.g., "Production Server", "Test Environment")
  key_prefix TEXT NOT NULL, -- First 8 chars for identification (e.g., "inv_live_")
  key_hash TEXT NOT NULL UNIQUE, -- SHA-256 hash of the full API key

  -- Key metadata
  environment TEXT NOT NULL CHECK(environment IN ('production', 'test')) DEFAULT 'production',
  scopes TEXT NOT NULL DEFAULT 'read,write', -- Comma-separated permissions

  -- Rate limiting
  rate_limit_requests INTEGER NOT NULL DEFAULT 100, -- Requests per minute
  rate_limit_window INTEGER NOT NULL DEFAULT 60, -- Window in seconds

  -- Status
  is_active INTEGER NOT NULL DEFAULT 1, -- 0 = revoked, 1 = active

  -- Usage tracking
  last_used_at DATETIME,
  requests_count INTEGER NOT NULL DEFAULT 0, -- Total requests made

  -- Webhook configuration
  webhook_url TEXT, -- URL to send events (optional)
  webhook_events TEXT, -- Comma-separated events (e.g., "investigation.completed,investigation.failed")

  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  revoked_at DATETIME,
  expires_at DATETIME, -- Optional expiration date

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- API Request Logs Table
-- Tracks all API requests for audit and rate limiting
CREATE TABLE IF NOT EXISTS api_request_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_key_id INTEGER NOT NULL,
  tenant_id INTEGER NOT NULL,

  -- Request details
  method TEXT NOT NULL, -- GET, POST, PUT, DELETE
  endpoint TEXT NOT NULL, -- /v1/investigations/cpf
  request_ip TEXT,
  user_agent TEXT,

  -- Response
  status_code INTEGER NOT NULL,
  response_time_ms INTEGER, -- Response time in milliseconds

  -- Rate limiting
  rate_limit_remaining INTEGER, -- Remaining requests in window
  rate_limit_reset INTEGER, -- Unix timestamp when limit resets

  -- Error tracking
  error_message TEXT,

  -- Timestamp
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Webhook Deliveries Table
-- Tracks webhook delivery attempts
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  api_key_id INTEGER NOT NULL,
  tenant_id INTEGER NOT NULL,

  -- Event details
  event_type TEXT NOT NULL, -- investigation.completed, investigation.failed
  payload TEXT NOT NULL, -- JSON payload

  -- Delivery details
  webhook_url TEXT NOT NULL,
  status_code INTEGER, -- HTTP status code
  response_body TEXT,
  attempt_count INTEGER NOT NULL DEFAULT 1,

  -- Status
  delivered INTEGER NOT NULL DEFAULT 0, -- 0 = pending/failed, 1 = delivered

  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  delivered_at DATETIME,
  next_retry_at DATETIME, -- When to retry if failed

  FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_keys_tenant ON api_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash ON api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_api_keys_active ON api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_api_keys_prefix ON api_keys(key_prefix);

CREATE INDEX IF NOT EXISTS idx_api_request_logs_key ON api_request_logs(api_key_id);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_tenant ON api_request_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_created ON api_request_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_key ON webhook_deliveries(api_key_id);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_delivered ON webhook_deliveries(delivered);
CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_next_retry ON webhook_deliveries(next_retry_at);

-- Sample data for development/testing
-- (commented out, uncomment for dev environment)
-- Note: In production, API keys are generated via the API
