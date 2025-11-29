-- ============================================
-- SEED: Associar admin ao CLIENTE_01
-- Execute após criar as tabelas e ter o admin registrado
-- ============================================

-- Primeiro, garantir que o tenant existe
INSERT OR IGNORE INTO tenants (id, code, name, email, status)
VALUES (
  'tenant_cliente_01',
  'CLIENTE_01',
  'COMURG - Companhia de Urbanizacao de Goiania',
  'cliente01@investigaree.com.br',
  'active'
);

-- Associar admin ao tenant (se o usuário existir)
-- Substitua o email pelo email do admin real
INSERT OR IGNORE INTO user_tenants (id, user_id, tenant_id, role, granted_by, is_active)
SELECT
  lower(hex(randomblob(16))),
  u.id,
  'tenant_cliente_01',
  'admin',
  'system',
  1
FROM users u
WHERE u.email = 'contato@investigaree.com.br';

-- Verificar resultado
SELECT
  ut.id as association_id,
  u.email as user_email,
  t.code as tenant_code,
  ut.role,
  ut.is_active
FROM user_tenants ut
JOIN users u ON ut.user_id = u.id
JOIN tenants t ON ut.tenant_id = t.id;
