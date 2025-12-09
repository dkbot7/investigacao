-- ============================================================
-- CORREÇÃO: Acesso ao COMURG
-- Data: 2025-12-09
-- Descrição: Apenas cliente01@investigaree.com.br deve acessar COMURG
-- ============================================================

-- 1. Criar tenant pessoal para kkhoifhiohaf@hfuhiof.com
INSERT INTO tenants (id, code, name, email, firebase_uid, status, serpro_mode, serpro_notes)
VALUES ('tenant_0bf2ef0c', 'USER_0BF2EF0C', 'dani (Conta Pessoal)', 'kkhoifhiohaf@hfuhiof.com', 'fNYMMWh313OzqXKu1FJZoAqyaFi1', 'active', 'managed', 'Tenant pessoal criado automaticamente.');

-- 2. Mover kkhoifhiohaf para seu tenant pessoal
UPDATE user_tenants
SET tenant_id = 'tenant_0bf2ef0c'
WHERE user_id = '0bf2ef0c-b7ca-4f1d-8762-5cb2530d6f3a' AND tenant_id = 'tenant_comurg';

-- 3. Conceder acesso ao cliente01@investigaree.com.br no COMURG
INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by, granted_at, is_active)
VALUES (lower(hex(randomblob(16))), '89926380-99d5-4c8a-a61d-33dcb6f7d23e', 'tenant_comurg', 'admin', 'system', datetime('now'), 1);
