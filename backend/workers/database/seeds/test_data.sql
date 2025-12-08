-- ============================================================================
-- INVESTIGAREE D1 DATABASE - TEST SEED DATA
-- Version: 1.0.0
-- Created: 2025-12-08
-- Purpose: Seed data para testes E2E do Playwright
-- ============================================================================

-- ============================================================================
-- USUARIOS DE TESTE
-- ============================================================================

-- Admin test user
INSERT INTO users (id, email, name, role, created_at, updated_at)
VALUES (
  'test-admin-uid-001',
  'admin@investigaree.com.br',
  'Admin Test User',
  'admin',
  datetime('now'),
  datetime('now')
)
ON CONFLICT(id) DO UPDATE SET
  email = excluded.email,
  name = excluded.name,
  role = excluded.role,
  updated_at = datetime('now');

-- Regular user
INSERT INTO users (id, email, name, role, created_at, updated_at)
VALUES (
  'test-user-uid-001',
  'user@investigaree.com.br',
  'Regular Test User',
  'user',
  datetime('now'),
  datetime('now')
)
ON CONFLICT(id) DO UPDATE SET
  email = excluded.email,
  name = excluded.name,
  role = excluded.role,
  updated_at = datetime('now');

-- Viewer user
INSERT INTO users (id, email, name, role, created_at, updated_at)
VALUES (
  'test-viewer-uid-001',
  'viewer@investigaree.com.br',
  'Viewer Test User',
  'viewer',
  datetime('now'),
  datetime('now')
)
ON CONFLICT(id) DO UPDATE SET
  email = excluded.email,
  name = excluded.name,
  role = excluded.role,
  updated_at = datetime('now');

-- ============================================================================
-- TENANTS DE TESTE
-- ============================================================================

-- Tenant de teste 1
INSERT INTO tenants (tenant_code, name, status, created_at, updated_at)
VALUES (
  'TEST_01',
  'Tenant Test 1',
  'active',
  datetime('now'),
  datetime('now')
)
ON CONFLICT(tenant_code) DO UPDATE SET
  name = excluded.name,
  status = excluded.status,
  updated_at = datetime('now');

-- Tenant de teste 2
INSERT INTO tenants (tenant_code, name, status, created_at, updated_at)
VALUES (
  'TEST_02',
  'Tenant Test 2',
  'active',
  datetime('now'),
  datetime('now')
)
ON CONFLICT(tenant_code) DO UPDATE SET
  name = excluded.name,
  status = excluded.status,
  updated_at = datetime('now');

-- Tenant inativo para testes
INSERT INTO tenants (tenant_code, name, status, created_at, updated_at)
VALUES (
  'TEST_INACTIVE',
  'Tenant Test Inactive',
  'inactive',
  datetime('now'),
  datetime('now')
)
ON CONFLICT(tenant_code) DO UPDATE SET
  name = excluded.name,
  status = excluded.status,
  updated_at = datetime('now');

-- ============================================================================
-- USER_TENANTS (ACCESS CONTROL)
-- ============================================================================

-- Admin access to TEST_01
INSERT INTO user_tenants (user_id, tenant_code, access_level, granted_by, created_at)
VALUES (
  'test-admin-uid-001',
  'TEST_01',
  'admin',
  'system',
  datetime('now')
)
ON CONFLICT(user_id, tenant_code) DO UPDATE SET
  access_level = excluded.access_level,
  granted_by = excluded.granted_by;

-- Admin access to TEST_02
INSERT INTO user_tenants (user_id, tenant_code, access_level, granted_by, created_at)
VALUES (
  'test-admin-uid-001',
  'TEST_02',
  'admin',
  'system',
  datetime('now')
)
ON CONFLICT(user_id, tenant_code) DO UPDATE SET
  access_level = excluded.access_level,
  granted_by = excluded.granted_by;

-- Regular user access to TEST_01
INSERT INTO user_tenants (user_id, tenant_code, access_level, granted_by, created_at)
VALUES (
  'test-user-uid-001',
  'TEST_01',
  'write',
  'test-admin-uid-001',
  datetime('now')
)
ON CONFLICT(user_id, tenant_code) DO UPDATE SET
  access_level = excluded.access_level,
  granted_by = excluded.granted_by;

-- Viewer access to TEST_01
INSERT INTO user_tenants (user_id, tenant_code, access_level, granted_by, created_at)
VALUES (
  'test-viewer-uid-001',
  'TEST_01',
  'read',
  'test-admin-uid-001',
  datetime('now')
)
ON CONFLICT(user_id, tenant_code) DO UPDATE SET
  access_level = excluded.access_level,
  granted_by = excluded.granted_by;

-- ============================================================================
-- FUNCIONARIOS DE TESTE
-- ============================================================================

-- Funcionário 1 - TEST_01
INSERT INTO funcionarios (tenant_code, cpf, nome, grupo, cargo, salario, created_at, updated_at)
VALUES (
  'TEST_01',
  '12345678900',
  'JOSE DA SILVA',
  'COMURG',
  'Auxiliar de Limpeza',
  1500.00,
  datetime('now'),
  datetime('now')
)
ON CONFLICT(tenant_code, cpf) DO UPDATE SET
  nome = excluded.nome,
  grupo = excluded.grupo,
  cargo = excluded.cargo,
  salario = excluded.salario,
  updated_at = datetime('now');

-- Funcionário 2 - TEST_01
INSERT INTO funcionarios (tenant_code, cpf, nome, grupo, cargo, salario, created_at, updated_at)
VALUES (
  'TEST_01',
  '98765432100',
  'MARIA SANTOS',
  'SECRETARIA',
  'Gerente Administrativo',
  4500.00,
  datetime('now'),
  datetime('now')
)
ON CONFLICT(tenant_code, cpf) DO UPDATE SET
  nome = excluded.nome,
  grupo = excluded.grupo,
  cargo = excluded.cargo,
  salario = excluded.salario,
  updated_at = datetime('now');

-- Funcionário 3 - TEST_02
INSERT INTO funcionarios (tenant_code, cpf, nome, grupo, cargo, salario, created_at, updated_at)
VALUES (
  'TEST_02',
  '11122233344',
  'ANTONIO PEREIRA',
  'OBRAS',
  'Engenheiro Civil',
  8500.00,
  datetime('now'),
  datetime('now')
)
ON CONFLICT(tenant_code, cpf) DO UPDATE SET
  nome = excluded.nome,
  grupo = excluded.grupo,
  cargo = excluded.cargo,
  salario = excluded.salario,
  updated_at = datetime('now');

-- ============================================================================
-- ALERTS DE TESTE
-- ============================================================================

-- Alert não lido
INSERT INTO alerts (id, type, severity, title, message, read, created_at)
VALUES (
  'test-alert-001',
  'system',
  'info',
  'Test Alert - Info',
  'Este é um alerta de teste para o sistema.',
  0,
  datetime('now')
)
ON CONFLICT(id) DO UPDATE SET
  type = excluded.type,
  severity = excluded.severity,
  title = excluded.title,
  message = excluded.message,
  read = excluded.read;

-- Alert já lido
INSERT INTO alerts (id, type, severity, title, message, read, created_at)
VALUES (
  'test-alert-002',
  'warning',
  'warning',
  'Test Alert - Warning',
  'Este é um alerta de warning para testes.',
  1,
  datetime('now')
)
ON CONFLICT(id) DO UPDATE SET
  type = excluded.type,
  severity = excluded.severity,
  title = excluded.title,
  message = excluded.message,
  read = excluded.read;

-- Alert crítico
INSERT INTO alerts (id, type, severity, title, message, read, created_at)
VALUES (
  'test-alert-003',
  'error',
  'critical',
  'Test Alert - Critical',
  'Este é um alerta crítico para testes.',
  0,
  datetime('now')
)
ON CONFLICT(id) DO UPDATE SET
  type = excluded.type,
  severity = excluded.severity,
  title = excluded.title,
  message = excluded.message,
  read = excluded.read;

-- ============================================================================
-- AUDIT LOGS DE TESTE
-- ============================================================================

-- Log de consulta CPF
INSERT INTO audit_logs (id, user_id, tenant_code, action, resource_type, resource_id, details, ip_address, user_agent, created_at)
VALUES (
  'test-log-001',
  'test-admin-uid-001',
  'TEST_01',
  'SERPRO_QUERY',
  'cpf',
  '12345678900',
  '{"api": "cpf", "cost": 0.50}',
  '127.0.0.1',
  'Mozilla/5.0 Test',
  datetime('now')
)
ON CONFLICT(id) DO UPDATE SET
  action = excluded.action,
  resource_type = excluded.resource_type,
  resource_id = excluded.resource_id,
  details = excluded.details;

-- Log de criação de tenant
INSERT INTO audit_logs (id, user_id, tenant_code, action, resource_type, resource_id, details, ip_address, user_agent, created_at)
VALUES (
  'test-log-002',
  'test-admin-uid-001',
  'TEST_01',
  'CREATE',
  'tenant',
  'TEST_01',
  '{"name": "Tenant Test 1"}',
  '127.0.0.1',
  'Mozilla/5.0 Test',
  datetime('now', '-1 day')
)
ON CONFLICT(id) DO UPDATE SET
  action = excluded.action,
  resource_type = excluded.resource_type,
  resource_id = excluded.resource_id,
  details = excluded.details;

-- ============================================================================
-- SERPRO USAGE TRACKING DE TESTE
-- ============================================================================

-- Consulta CPF
INSERT INTO serpro_usage (id, user_id, tenant_code, api_name, document, cost, status_code, response_time_ms, created_at)
VALUES (
  'test-usage-001',
  'test-admin-uid-001',
  'TEST_01',
  'cpf',
  '12345678900',
  0.50,
  200,
  347,
  datetime('now', '-1 hour')
)
ON CONFLICT(id) DO UPDATE SET
  cost = excluded.cost,
  status_code = excluded.status_code,
  response_time_ms = excluded.response_time_ms;

-- Consulta CNPJ
INSERT INTO serpro_usage (id, user_id, tenant_code, api_name, document, cost, status_code, response_time_ms, created_at)
VALUES (
  'test-usage-002',
  'test-user-uid-001',
  'TEST_01',
  'cnpj',
  '12345678000195',
  1.17,
  200,
  523,
  datetime('now', '-2 hours')
)
ON CONFLICT(id) DO UPDATE SET
  cost = excluded.cost,
  status_code = excluded.status_code,
  response_time_ms = excluded.response_time_ms;

-- ============================================================================
-- SEED DATA PARA TESTES INSERIDO COM SUCESSO
-- ============================================================================
