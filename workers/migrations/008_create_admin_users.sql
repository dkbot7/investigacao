-- ============================================
-- CREATE ADMIN MASTER USERS
-- ============================================

-- Criar usuários admin master
INSERT OR IGNORE INTO users (id, email, name, created_at, updated_at)
VALUES
  ('admin_dani_master', 'dkbotdani@gmail.com', 'Dani Kaloi (Admin Master)', datetime('now'), datetime('now')),
  ('admin_ibsen', 'ibsenmaciel@gmail.com', 'Ibsen Maciel (Admin)', datetime('now'), datetime('now'));

-- Associar admins ao CLIENTE_01 com role admin
INSERT OR IGNORE INTO user_tenants (id, user_id, tenant_id, role, granted_by, is_active)
VALUES
  (lower(hex(randomblob(16))), 'admin_dani_master', 'tenant_cliente_01', 'admin', 'system', 1),
  (lower(hex(randomblob(16))), 'admin_ibsen', 'tenant_cliente_01', 'admin', 'system', 1);

-- Verificar resultado
SELECT u.email, u.name, t.code as tenant, ut.role
FROM users u
LEFT JOIN user_tenants ut ON u.id = ut.user_id AND ut.is_active = 1
LEFT JOIN tenants t ON ut.tenant_id = t.id
WHERE u.email IN ('dkbotdani@gmail.com', 'ibsenmaciel@gmail.com');
