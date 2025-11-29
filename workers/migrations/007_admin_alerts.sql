-- ============================================
-- ADMIN ALERTS SCHEMA
-- Sistema de alertas para administradores
-- ============================================

-- Tabela de alertas do sistema
CREATE TABLE IF NOT EXISTS admin_alerts (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    type TEXT NOT NULL, -- 'new_user', 'new_lead', 'access_request', 'error', etc.
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data TEXT, -- JSON com dados adicionais
    severity TEXT DEFAULT 'info', -- 'info', 'warning', 'error', 'success'
    is_read INTEGER DEFAULT 0,
    read_by TEXT, -- email de quem leu
    read_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_admin_alerts_type ON admin_alerts(type);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_read ON admin_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_created ON admin_alerts(created_at DESC);

-- Tabela de configurações de notificação por admin
CREATE TABLE IF NOT EXISTS admin_notification_settings (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    admin_email TEXT UNIQUE NOT NULL,
    notify_new_users INTEGER DEFAULT 1,
    notify_new_leads INTEGER DEFAULT 1,
    notify_errors INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- ============================================
-- SEED: Configurar admins master
-- ============================================

-- Inserir admins master na tabela de configurações
INSERT OR IGNORE INTO admin_notification_settings (id, admin_email, notify_new_users, notify_new_leads, notify_errors)
VALUES
    (lower(hex(randomblob(16))), 'dkbotdani@gmail.com', 1, 1, 1),
    (lower(hex(randomblob(16))), 'ibsenmaciel@gmail.com', 1, 1, 1),
    (lower(hex(randomblob(16))), 'contato@investigaree.com.br', 1, 1, 1);
