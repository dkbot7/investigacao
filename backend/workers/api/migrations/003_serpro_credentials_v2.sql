-- ==============================================================================
-- Migration 003 v2: SERPRO Credentials Management (BYO System)
-- Agent 2 - Backend Engineer
-- Data: 2025-12-08
--
-- Cria apenas as novas tabelas (colunas do tenants já existem)
-- ==============================================================================

-- 1. Criar tabela para armazenar credenciais SERPRO por tenant
CREATE TABLE IF NOT EXISTS tenant_serpro_credentials (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  api_name TEXT NOT NULL, -- 'cpf', 'cnpj', 'divida-ativa', 'renda', etc.
  consumer_key TEXT NOT NULL,
  consumer_secret_encrypted TEXT NOT NULL, -- SEMPRE CRIPTOGRAFADO!
  environment TEXT DEFAULT 'production' CHECK(environment IN ('trial', 'production')),
  is_active INTEGER DEFAULT 1,
  last_validated_at TEXT, -- Última vez que credentials foram testadas
  validation_error TEXT, -- Se validação falhar, armazena erro
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE(tenant_id, api_name)
);

-- 2. Índices para performance
CREATE INDEX IF NOT EXISTS idx_tenant_serpro_credentials_tenant_id
  ON tenant_serpro_credentials(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_serpro_credentials_api_name
  ON tenant_serpro_credentials(api_name);
CREATE INDEX IF NOT EXISTS idx_tenant_serpro_credentials_active
  ON tenant_serpro_credentials(tenant_id, api_name, is_active);

-- 3. Audit log para mudanças de credenciais
CREATE TABLE IF NOT EXISTS serpro_credentials_audit (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  api_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK(action IN ('created', 'updated', 'deleted', 'validated')),
  performed_by TEXT, -- user_id que fez a ação
  old_value TEXT, -- JSON com valores antigos (sem secrets)
  new_value TEXT, -- JSON com valores novos (sem secrets)
  ip_address TEXT,
  user_agent TEXT,
  timestamp TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- 4. Atualizar tenant existente (se ainda não tiver valor)
UPDATE tenants
SET serpro_mode = 'managed',
    serpro_notes = 'Sistema configurado em modo gerenciado (Investigaree fornece credenciais)'
WHERE code = 'CLIENTE_01' AND serpro_notes IS NULL;

-- ==============================================================================
-- COMENTÁRIOS EXPLICATIVOS
-- ==============================================================================
--
-- serpro_mode (já existe na tabela tenants):
--   - 'managed': Tenant usa credenciais do Investigaree (env vars)
--   - 'byo': Tenant usa suas próprias credenciais (tenant_serpro_credentials table)
--
-- api_name valores possíveis:
--   cpf, cnpj, divida-ativa, renda, faturamento, datavalid,
--   cnd, integra-contador, raiz-tech
--
-- consumer_secret_encrypted:
--   Sempre criptografado com AES-256-GCM usando master key do Cloudflare
--
-- ==============================================================================
