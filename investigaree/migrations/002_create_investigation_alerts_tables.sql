-- Migration: Create investigation alerts and snapshots tables
-- Date: 2025-12-12
-- Feature: Alertas Automáticos de Mudança de Status
-- Note: Using 'investigation_alerts' to avoid conflict with existing 'alerts' table

-- Tabela de snapshots (estado anterior das investigações)
CREATE TABLE IF NOT EXISTS investigation_snapshots (
  id TEXT PRIMARY KEY,
  investigation_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  snapshot_data TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_snapshots_investigation ON investigation_snapshots(investigation_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_tenant ON investigation_snapshots(tenant_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_created ON investigation_snapshots(created_at);

-- Tabela de alertas (mudanças detectadas)
CREATE TABLE IF NOT EXISTS investigation_alerts (
  id TEXT PRIMARY KEY,
  investigation_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  is_read INTEGER DEFAULT 0,
  email_sent INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  read_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_investigation_alerts_investigation ON investigation_alerts(investigation_id);
CREATE INDEX IF NOT EXISTS idx_investigation_alerts_tenant ON investigation_alerts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_investigation_alerts_user ON investigation_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_investigation_alerts_unread ON investigation_alerts(is_read) WHERE is_read = 0;
CREATE INDEX IF NOT EXISTS idx_investigation_alerts_created ON investigation_alerts(created_at);

-- Tabela de configuração de alertas por tenant
CREATE TABLE IF NOT EXISTS alert_config (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL UNIQUE,
  enabled INTEGER DEFAULT 1,
  email_enabled INTEGER DEFAULT 1,
  alert_types TEXT NOT NULL,
  check_frequency_hours INTEGER DEFAULT 24,
  notification_email TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_alert_config_tenant ON alert_config(tenant_id);
