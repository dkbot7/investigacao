-- ============================================================================
-- INVESTIGAREE D1 DATABASE SCHEMA
-- Version: 1.0.0
-- Created: 2025-12-07
-- Agent: Agent 2 - Backend Engineer
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,                    -- Firebase UID
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'viewer',             -- admin, editor, viewer
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active',           -- active, inactive, suspended
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- User-Tenant access mapping
CREATE TABLE IF NOT EXISTS user_tenants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  tenant_code TEXT NOT NULL,
  access_level TEXT DEFAULT 'viewer',     -- admin, editor, viewer
  granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  granted_by TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tenant_code) REFERENCES tenants(tenant_code),
  UNIQUE(user_id, tenant_code)
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,                     -- system, security, usage, update
  severity TEXT NOT NULL,                 -- info, warning, error, critical
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read INTEGER DEFAULT 0,                 -- 0 = unread, 1 = read
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  read_at DATETIME
);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,                   -- create, update, delete, grant, revoke, query
  entity_type TEXT NOT NULL,              -- user, tenant, alert, serpro_query
  entity_id TEXT,
  metadata TEXT,                          -- JSON string with details
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- SERPRO API usage logs
CREATE TABLE IF NOT EXISTS serpro_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  tenant_code TEXT NOT NULL,
  api_name TEXT NOT NULL,                 -- cpf, cnpj, divida_ativa, renda, faturamento, etc.
  document TEXT NOT NULL,                 -- CPF/CNPJ consultado
  cost REAL NOT NULL,                     -- Custo em R$
  response_status INTEGER,                -- HTTP status code (200, 400, 500, etc.)
  response_time_ms INTEGER,               -- Tempo de resposta em ms
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tenant_code) REFERENCES tenants(tenant_code)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User-Tenant indexes
CREATE INDEX IF NOT EXISTS idx_user_tenants_user ON user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant ON user_tenants(tenant_code);

-- Alerts indexes
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read, created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type, created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity, created_at);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action, created_at);

-- SERPRO usage indexes
CREATE INDEX IF NOT EXISTS idx_serpro_usage_tenant ON serpro_usage(tenant_code, created_at);
CREATE INDEX IF NOT EXISTS idx_serpro_usage_api ON serpro_usage(api_name, created_at);
CREATE INDEX IF NOT EXISTS idx_serpro_usage_user ON serpro_usage(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_serpro_usage_document ON serpro_usage(document);

-- ============================================================================
-- SCHEMA CREATED SUCCESSFULLY
-- ============================================================================
