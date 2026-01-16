-- Migration: Create alerts and snapshots tables
-- Date: 2025-12-12
-- Feature: Alertas Automáticos de Mudança de Status

-- Tabela de snapshots (estado anterior das investigações)
CREATE TABLE IF NOT EXISTS investigation_snapshots (
  id TEXT PRIMARY KEY,
  investigation_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  snapshot_data TEXT NOT NULL, -- JSON serializado
  created_at INTEGER NOT NULL, -- Unix timestamp
  FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
);

CREATE INDEX idx_snapshots_investigation ON investigation_snapshots(investigation_id);
CREATE INDEX idx_snapshots_tenant ON investigation_snapshots(tenant_id);
CREATE INDEX idx_snapshots_created ON investigation_snapshots(created_at);

-- Tabela de alertas (mudanças detectadas)
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  investigation_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  user_id TEXT NOT NULL, -- Dono da investigação
  alert_type TEXT NOT NULL, -- 'ceis_entry', 'processo_novo', 'vinculo_mudanca'
  severity TEXT NOT NULL, -- 'critical', 'high', 'medium', 'low'
  title TEXT NOT NULL, -- "Novo achado crítico: CEIS"
  description TEXT NOT NULL, -- Detalhes da mudança
  old_value TEXT, -- Valor anterior (JSON)
  new_value TEXT, -- Valor novo (JSON)
  is_read INTEGER DEFAULT 0, -- 0=não lido, 1=lido
  email_sent INTEGER DEFAULT 0, -- 0=não enviado, 1=enviado
  created_at INTEGER NOT NULL, -- Unix timestamp
  read_at INTEGER, -- Unix timestamp quando foi lido
  FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
);

CREATE INDEX idx_alerts_investigation ON alerts(investigation_id);
CREATE INDEX idx_alerts_tenant ON alerts(tenant_id);
CREATE INDEX idx_alerts_user ON alerts(user_id);
CREATE INDEX idx_alerts_unread ON alerts(is_read) WHERE is_read = 0;
CREATE INDEX idx_alerts_created ON alerts(created_at);

-- Tabela de configuração de alertas por tenant
CREATE TABLE IF NOT EXISTS alert_config (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL UNIQUE,
  enabled INTEGER DEFAULT 1, -- 0=desabilitado, 1=habilitado
  email_enabled INTEGER DEFAULT 1,
  alert_types TEXT NOT NULL, -- JSON array: ["ceis_entry", "processo_novo"]
  check_frequency_hours INTEGER DEFAULT 24, -- Frequência de check (horas)
  notification_email TEXT, -- Email alternativo para notificações
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX idx_alert_config_tenant ON alert_config(tenant_id);
