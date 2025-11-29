-- ============================================
-- USER-TENANT ASSOCIATION SCHEMA
-- Permite associar múltiplos usuários a tenants
-- ============================================

-- Tabela de associação usuário-tenant
CREATE TABLE IF NOT EXISTS user_tenants (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,           -- ID do usuário na tabela users
    tenant_id TEXT NOT NULL,         -- ID do tenant
    role TEXT DEFAULT 'viewer',      -- 'admin', 'editor', 'viewer'
    granted_by TEXT,                 -- Quem concedeu o acesso
    granted_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT,                 -- Data de expiração do acesso (opcional)
    is_active INTEGER DEFAULT 1,     -- Se o acesso está ativo
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(user_id, tenant_id)       -- Um usuário só pode ter uma associação por tenant
);

CREATE INDEX IF NOT EXISTS idx_user_tenants_user ON user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant ON user_tenants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_active ON user_tenants(user_id, is_active);

-- Adicionar campo firebase_uid na tabela users se não existir
-- (A tabela users já deve existir do schema inicial)

-- ============================================
-- ADMIN USER SETUP
-- Associar admin ao CLIENTE_01
-- ============================================

-- Inserir associação para o admin (se existir)
-- INSERT OR IGNORE INTO user_tenants (user_id, tenant_id, role, granted_by)
-- SELECT u.id, 'tenant_cliente_01', 'admin', 'system'
-- FROM users u WHERE u.email = 'contato@investigaree.com.br';
