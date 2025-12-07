-- ============================================================================
-- INVESTIGAREE D1 DATABASE - INITIAL SEED DATA
-- Version: 1.0.0
-- Created: 2025-12-07
-- ============================================================================

-- Insert default tenant (Investigaree)
INSERT INTO tenants (tenant_code, name, status)
VALUES ('INVESTIGA', 'Investigaree', 'active')
ON CONFLICT(tenant_code) DO NOTHING;

-- Insert admin user (Dani Kaloi)
-- Nota: Firebase UID será atualizado quando usuário fizer primeiro login
INSERT INTO users (id, email, name, role)
VALUES ('admin-temp-uid', 'dani@investigaree.com.br', 'Dani Kaloi', 'admin')
ON CONFLICT(id) DO NOTHING;

-- Grant admin access to default tenant
INSERT INTO user_tenants (user_id, tenant_code, access_level, granted_by)
VALUES ('admin-temp-uid', 'INVESTIGA', 'admin', 'system')
ON CONFLICT(user_id, tenant_code) DO NOTHING;

-- Insert welcome alert
INSERT INTO alerts (id, type, severity, title, message, read)
VALUES (
  'welcome-alert-001',
  'system',
  'info',
  'Bem-vindo ao Investigaree API',
  'Sistema de backend configurado com sucesso. Todas as APIs SERPRO estão prontas para uso.',
  0
)
ON CONFLICT(id) DO NOTHING;

-- ============================================================================
-- SEED DATA INSERTED SUCCESSFULLY
-- ============================================================================
