-- Criar tenant pessoal para ibsenmaciel@gmail.com

-- 1. Criar tenant pessoal
INSERT INTO tenants (id, code, name, email, firebase_uid, status, serpro_mode, serpro_notes, created_at, updated_at)
VALUES (
  'tenant_fba8b02d',
  'USER_FBA8B02D',
  'Ibsen Rodrigues Maciel (Conta Pessoal)',
  'ibsenmaciel@gmail.com',
  'kWW3GippbVdWK7bfm5bshfbV6RD2',
  'active',
  'managed',
  'Tenant pessoal criado pelo admin.',
  datetime('now'),
  datetime('now')
);

-- 2. Associar usuário ao tenant como admin
INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by, granted_at, is_active, created_at, updated_at)
VALUES (
  lower(hex(randomblob(16))),
  'fba8b02dd2b03062004a6730675b0cc8',
  'tenant_fba8b02d',
  'admin',
  'system',
  datetime('now'),
  1,
  datetime('now'),
  datetime('now')
);

-- 3. Revogar acesso ao tenant CLIENTE_01
UPDATE user_tenants
SET is_active = 0, updated_at = datetime('now')
WHERE user_id = 'fba8b02dd2b03062004a6730675b0cc8' AND tenant_id = 'tenant_cliente_01';

-- Verificar resultados
SELECT 'Tenant criado:' as status;
SELECT * FROM tenants WHERE code = 'USER_FBA8B02D';

SELECT 'Associacoes do usuario:' as status;
SELECT t.code, t.name, ut.role, ut.is_active
FROM user_tenants ut
JOIN tenants t ON ut.tenant_id = t.id
WHERE ut.user_id = 'fba8b02dd2b03062004a6730675b0cc8';
