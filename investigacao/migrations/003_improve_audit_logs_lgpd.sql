-- Migration: Melhorar tabela audit_logs para compliance LGPD
-- Date: 2025-12-12
-- Feature: Logs de Auditoria LGPD Completos

-- Adicionar colunas para compliance LGPD
ALTER TABLE audit_logs ADD COLUMN tenant_id TEXT;
ALTER TABLE audit_logs ADD COLUMN severity TEXT DEFAULT 'info'; -- info, warning, critical
ALTER TABLE audit_logs ADD COLUMN status TEXT DEFAULT 'completed'; -- pending, completed, failed
ALTER TABLE audit_logs ADD COLUMN data_subject TEXT; -- CPF/CNPJ do titular dos dados
ALTER TABLE audit_logs ADD COLUMN legal_basis TEXT; -- Base legal LGPD (consentimento, contrato, etc)
ALTER TABLE audit_logs ADD COLUMN retention_until INTEGER; -- Unix timestamp - quando o log deve ser deletado
ALTER TABLE audit_logs ADD COLUMN geolocation TEXT; -- Localização geográfica da ação
ALTER TABLE audit_logs ADD COLUMN session_id TEXT; -- ID da sessão

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS idx_audit_logs_data_subject ON audit_logs(data_subject);
CREATE INDEX IF NOT EXISTS idx_audit_logs_retention ON audit_logs(retention_until);
