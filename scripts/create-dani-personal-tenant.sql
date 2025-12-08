-- Criar tenant pessoal para dkbotdani@gmail.com

-- 1. Criar tenant pessoal
INSERT INTO tenants (id, code, name, email, firebase_uid, status, serpro_mode, serpro_notes, created_at, updated_at)
VALUES (
  'tenant_a1ac3e4d',
  'USER_A1AC3E4D',
  'Danielle Kaloi (Conta Pessoal)',
  'dkbotdani@gmail.com',
  'wr6vfPKJ22bVvGze3EW51W6H0gH2',
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
  'a1ac3e4df4a525afe9b61e04c6410c7a',
  'tenant_a1ac3e4d',
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
WHERE user_id = 'a1ac3e4df4a525afe9b61e04c6410c7a' AND tenant_id = 'tenant_cliente_01';

-- Verificar resultados
SELECT 'Tenant criado:' as status;
SELECT * FROM tenants WHERE code = 'USER_A1AC3E4D';

SELECT 'Associacoes do usuario:' as status;
SELECT t.code, t.name, ut.role, ut.is_active
FROM user_tenants ut
JOIN tenants t ON ut.tenant_id = t.id
WHERE ut.user_id = 'a1ac3e4df4a525afe9b61e04c6410c7a';
