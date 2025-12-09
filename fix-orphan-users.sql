-- Criar tenants pessoais para usuários órfãos
-- Data: 2025-12-09

-- Criar tenant para cliente01@investigaree.com.br
INSERT INTO tenants (id, code, name, email, firebase_uid, status, serpro_mode, serpro_notes)
VALUES ('tenant_89926380', 'USER_89926380', 'CLIENTE 01  (Conta Pessoal)', 'cliente01@investigaree.com.br', 'fUz4i0om1DbtQlwgQ3JAgKEy6Kf2', 'active', 'managed', 'Tenant pessoal criado automaticamente.');

-- Criar tenant para ddd@dddd.com
INSERT INTO tenants (id, code, name, email, firebase_uid, status, serpro_mode, serpro_notes)
VALUES ('tenant_8ebf1cd1', 'USER_8EBF1CD1', 'daniu (Conta Pessoal)', 'ddd@dddd.com', 'KjdWVLMt9lRknLgeWGYe1qrvSOQ2', 'active', 'managed', 'Tenant pessoal criado automaticamente.');

-- Criar tenant para werwet4r@dfgfdgfh.com
INSERT INTO tenants (id, code, name, email, firebase_uid, status, serpro_mode, serpro_notes)
VALUES ('tenant_6645dbdb', 'USER_6645DBDB', 'dsgrrertytytry (Conta Pessoal)', 'werwet4r@dfgfdgfh.com', 'Gex0fhH1nwQ3e9cacw73E1uf1C12', 'active', 'managed', 'Tenant pessoal criado automaticamente.');

-- Associar usuários aos tenants
INSERT INTO user_tenants (id, user_id, tenant_id, role, granted_by, granted_at)
VALUES
  (lower(hex(randomblob(16))), '89926380-99d5-4c8a-a61d-33dcb6f7d23e', 'tenant_89926380', 'admin', 'system', datetime('now')),
  (lower(hex(randomblob(16))), '8ebf1cd1-0c48-40d6-8840-4617893d2321', 'tenant_8ebf1cd1', 'admin', 'system', datetime('now')),
  (lower(hex(randomblob(16))), '6645dbdb-6bd6-4aeb-94a1-e78814821093', 'tenant_6645dbdb', 'admin', 'system', datetime('now'));
