-- Migration 007: Two-Factor Authentication (2FA)
-- Implements TOTP-based 2FA for enhanced account security

-- User 2FA Settings Table
-- Stores TOTP secrets and configuration per user
CREATE TABLE IF NOT EXISTS user_2fa (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  tenant_id INTEGER NOT NULL,

  -- TOTP Configuration
  secret TEXT NOT NULL, -- Base32-encoded TOTP secret
  enabled INTEGER NOT NULL DEFAULT 0, -- 0 = disabled, 1 = enabled
  verified INTEGER NOT NULL DEFAULT 0, -- 0 = not verified, 1 = verified

  -- Metadata
  issuer TEXT NOT NULL DEFAULT 'Investigaree',
  label TEXT NOT NULL, -- User email or identifier for authenticator app
  algorithm TEXT NOT NULL DEFAULT 'SHA1', -- SHA1, SHA256, SHA512
  digits INTEGER NOT NULL DEFAULT 6, -- 6 or 8 digits
  period INTEGER NOT NULL DEFAULT 30, -- Time step in seconds

  -- Recovery Codes (comma-separated, hashed)
  recovery_codes TEXT, -- SHA-256 hashed recovery codes

  -- Audit
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  verified_at DATETIME, -- When user first verified 2FA
  last_used_at DATETIME, -- Last successful 2FA verification

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 2FA Verification Logs Table
-- Tracks all 2FA verification attempts for security monitoring
CREATE TABLE IF NOT EXISTS user_2fa_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tenant_id INTEGER NOT NULL,

  -- Verification details
  success INTEGER NOT NULL, -- 0 = failed, 1 = success
  method TEXT NOT NULL CHECK(method IN ('totp', 'recovery_code')), -- Verification method
  ip_address TEXT,
  user_agent TEXT,

  -- Error tracking
  error_reason TEXT, -- "invalid_code", "expired", "rate_limit", etc.

  -- Timestamp
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Trusted Devices Table (Optional)
-- Allow users to mark devices as trusted to skip 2FA for N days
CREATE TABLE IF NOT EXISTS user_2fa_trusted_devices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  tenant_id INTEGER NOT NULL,

  -- Device identification
  device_fingerprint TEXT NOT NULL, -- Hash of user agent + IP + other factors
  device_name TEXT, -- User-friendly name (optional)
  ip_address TEXT,
  user_agent TEXT,

  -- Trust settings
  trusted_until DATETIME NOT NULL, -- When trust expires (e.g., 30 days)
  is_active INTEGER NOT NULL DEFAULT 1, -- 0 = revoked, 1 = active

  -- Audit
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_used_at DATETIME,
  revoked_at DATETIME,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_2fa_user ON user_2fa(user_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_tenant ON user_2fa(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_enabled ON user_2fa(enabled);

CREATE INDEX IF NOT EXISTS idx_user_2fa_logs_user ON user_2fa_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_logs_created ON user_2fa_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_user_2fa_logs_success ON user_2fa_logs(success);

CREATE INDEX IF NOT EXISTS idx_user_2fa_trusted_devices_user ON user_2fa_trusted_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_2fa_trusted_devices_fingerprint ON user_2fa_trusted_devices(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_user_2fa_trusted_devices_active ON user_2fa_trusted_devices(is_active);
