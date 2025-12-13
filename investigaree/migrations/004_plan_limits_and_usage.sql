-- Migration: Sistema de Limites por Plano (Soft/Hard Limits)
-- Date: 2025-12-12
-- Feature: Plan Limits with Usage Tracking

-- ============================================
-- Tabela de Definição de Limites por Plano
-- ============================================

CREATE TABLE IF NOT EXISTS plan_limits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  plan_name TEXT NOT NULL UNIQUE, -- free, basic, pro, enterprise

  -- Limites de Investigações
  investigations_per_month INTEGER NOT NULL DEFAULT 0,
  investigations_concurrent INTEGER NOT NULL DEFAULT 1,

  -- Limites de APIs Externas
  serpro_calls_per_month INTEGER NOT NULL DEFAULT 0,

  -- Limites de Exportações
  exports_per_month INTEGER NOT NULL DEFAULT 0,

  -- Limites de Usuários
  users_per_tenant INTEGER NOT NULL DEFAULT 1,

  -- Limites de Armazenamento
  storage_mb INTEGER NOT NULL DEFAULT 100,

  -- Features Booleanas
  api_access INTEGER NOT NULL DEFAULT 0, -- 0 = false, 1 = true
  bulk_investigations INTEGER NOT NULL DEFAULT 0,
  custom_reports INTEGER NOT NULL DEFAULT 0,
  priority_support INTEGER NOT NULL DEFAULT 0,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Inserir planos padrão
INSERT INTO plan_limits (
  plan_name,
  investigations_per_month,
  investigations_concurrent,
  serpro_calls_per_month,
  exports_per_month,
  users_per_tenant,
  storage_mb,
  api_access,
  bulk_investigations,
  custom_reports,
  priority_support
) VALUES
  -- Plano Free (Trial)
  ('free', 10, 1, 50, 5, 1, 100, 0, 0, 0, 0),

  -- Plano Basic
  ('basic', 50, 3, 250, 25, 3, 500, 0, 0, 0, 0),

  -- Plano Pro
  ('pro', 200, 10, 1000, 100, 10, 2000, 1, 1, 1, 0),

  -- Plano Enterprise (Unlimited = 999999)
  ('enterprise', 999999, 50, 5000, 999999, 100, 10000, 1, 1, 1, 1);

-- ============================================
-- Tabela de Uso por Tenant (Mensal)
-- ============================================

CREATE TABLE IF NOT EXISTS tenant_usage (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_code TEXT NOT NULL,
  year_month TEXT NOT NULL, -- Formato: YYYY-MM

  -- Contadores de Uso
  investigations_count INTEGER NOT NULL DEFAULT 0,
  serpro_calls_count INTEGER NOT NULL DEFAULT 0,
  exports_count INTEGER NOT NULL DEFAULT 0,

  -- Metadata
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Constraint: um registro por tenant por mês
  UNIQUE(tenant_code, year_month)
);

-- ============================================
-- Adicionar campo plan_name em tenants
-- ============================================

ALTER TABLE tenants ADD COLUMN plan_name TEXT DEFAULT 'free';

-- ============================================
-- Índices para Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_tenant_usage_tenant ON tenant_usage(tenant_code);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_month ON tenant_usage(year_month);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_tenant_month ON tenant_usage(tenant_code, year_month);
CREATE INDEX IF NOT EXISTS idx_tenants_plan ON tenants(plan_name);

-- ============================================
-- Trigger para atualizar updated_at
-- ============================================

CREATE TRIGGER IF NOT EXISTS update_tenant_usage_timestamp
AFTER UPDATE ON tenant_usage
BEGIN
  UPDATE tenant_usage SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS update_plan_limits_timestamp
AFTER UPDATE ON plan_limits
BEGIN
  UPDATE plan_limits SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
