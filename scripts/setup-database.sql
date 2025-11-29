-- ============================================
-- SETUP COMPLETO DO BANCO DE DADOS
-- investigaree - D1 (Cloudflare SQLite)
-- ============================================
-- Execute com: wrangler d1 execute investigaree-db --file=scripts/setup-database.sql

-- ============================================
-- 1. TABELA DE USUARIOS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    firebase_uid TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    phone TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_firebase ON users(firebase_uid);

-- ============================================
-- 2. TABELA DE TENANTS
-- ============================================
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    firebase_uid TEXT UNIQUE,
    status TEXT DEFAULT 'active',
    config TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tenants_email ON tenants(email);
CREATE INDEX IF NOT EXISTS idx_tenants_code ON tenants(code);

-- ============================================
-- 3. TABELA DE ASSOCIACAO USUARIO-TENANT
-- ============================================
CREATE TABLE IF NOT EXISTS user_tenants (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    role TEXT DEFAULT 'viewer',
    granted_by TEXT,
    granted_at TEXT DEFAULT (datetime('now')),
    expires_at TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    UNIQUE(user_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_user_tenants_user ON user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant ON user_tenants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_active ON user_tenants(user_id, is_active);

-- ============================================
-- 4. TABELA DE FUNCIONARIOS (MULTI-TENANT)
-- ============================================
CREATE TABLE IF NOT EXISTS tenant_funcionarios (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tenant_id TEXT NOT NULL,
    cadastro TEXT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL,
    cpf_valido INTEGER DEFAULT 0,
    data_nascimento TEXT,
    sexo TEXT,
    cargo TEXT,
    salario REAL,
    data_admissao TEXT,
    data_cessao TEXT,
    vinculo TEXT,
    local_trabalho TEXT,
    centro_custo TEXT,
    grupo TEXT NOT NULL,
    -- Verificacoes de vida
    esta_vivo TEXT,
    esta_morto TEXT,
    ano_obito INTEGER,
    -- Beneficios
    recebe_beneficio INTEGER DEFAULT 0,
    qual_beneficio TEXT,
    -- Vinculos empresariais
    socio_empresa INTEGER DEFAULT 0,
    qtd_empresas INTEGER DEFAULT 0,
    -- Politica
    doador_campanha INTEGER DEFAULT 0,
    valor_doacoes REAL DEFAULT 0,
    candidato INTEGER DEFAULT 0,
    -- Sancoes
    sancionado_ceis INTEGER DEFAULT 0,
    sancionado_ofac INTEGER DEFAULT 0,
    -- Metadados
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_func_tenant ON tenant_funcionarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_func_cpf ON tenant_funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_tenant_func_nome ON tenant_funcionarios(nome);
CREATE INDEX IF NOT EXISTS idx_tenant_func_grupo ON tenant_funcionarios(tenant_id, grupo);

-- ============================================
-- 5. TABELA DE CANDIDATURAS
-- ============================================
CREATE TABLE IF NOT EXISTS tenant_candidaturas (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tenant_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,
    cpf TEXT NOT NULL,
    nome TEXT NOT NULL,
    cargo TEXT,
    partido TEXT,
    numero_candidato TEXT,
    uf TEXT,
    municipio TEXT,
    ano INTEGER,
    situacao TEXT,
    votos INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_cand_tenant ON tenant_candidaturas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_cand_cpf ON tenant_candidaturas(cpf);

-- ============================================
-- 6. TABELA DE DOACOES
-- ============================================
CREATE TABLE IF NOT EXISTS tenant_doacoes (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tenant_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,
    cpf_doador TEXT NOT NULL,
    nome_doador TEXT,
    cpf_candidato TEXT,
    nome_candidato TEXT,
    partido TEXT,
    cargo TEXT,
    ano INTEGER,
    valor REAL,
    data_doacao TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_doac_tenant ON tenant_doacoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_doac_cpf ON tenant_doacoes(cpf_doador);

-- ============================================
-- 7. TABELA DE VINCULOS EMPRESARIAIS
-- ============================================
CREATE TABLE IF NOT EXISTS tenant_vinculos (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tenant_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,
    cpf_socio TEXT NOT NULL,
    nome_socio TEXT,
    cnpj TEXT NOT NULL,
    razao_social TEXT,
    nome_fantasia TEXT,
    qualificacao TEXT,
    situacao_cadastral TEXT,
    capital_social REAL,
    data_entrada TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_vinc_tenant ON tenant_vinculos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_vinc_cpf ON tenant_vinculos(cpf_socio);

-- ============================================
-- 8. TABELA DE SANCOES
-- ============================================
CREATE TABLE IF NOT EXISTS tenant_sancoes (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tenant_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,
    cpf TEXT NOT NULL,
    nome TEXT,
    tipo_sancao TEXT,
    orgao_sancionador TEXT,
    fundamentacao TEXT,
    data_inicio TEXT,
    data_fim TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_sanc_tenant ON tenant_sancoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_sanc_cpf ON tenant_sancoes(cpf);

-- ============================================
-- 9. TABELA DE OBITOS
-- ============================================
CREATE TABLE IF NOT EXISTS tenant_obitos (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tenant_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,
    cpf TEXT NOT NULL,
    nome TEXT,
    data_obito TEXT,
    ano_obito INTEGER,
    fonte TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_obito_tenant ON tenant_obitos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_obito_cpf ON tenant_obitos(cpf);

-- ============================================
-- 10. TABELA DE BENEFICIOS
-- ============================================
CREATE TABLE IF NOT EXISTS tenant_beneficios (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tenant_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,
    cpf TEXT NOT NULL,
    nome TEXT,
    tipo_beneficio TEXT,
    valor REAL,
    mes_referencia TEXT,
    ano_referencia INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_tenant_benef_tenant ON tenant_beneficios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_benef_cpf ON tenant_beneficios(cpf);

-- ============================================
-- 11. TABELA DE LEADS (WHATSAPP)
-- ============================================
CREATE TABLE IF NOT EXISTS whatsapp_leads (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT,
    source TEXT DEFAULT 'landing',
    ip_address TEXT,
    user_agent TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_phone ON whatsapp_leads(phone);
CREATE INDEX IF NOT EXISTS idx_leads_email ON whatsapp_leads(email);

-- ============================================
-- 12. SEED: TENANT CLIENTE_01
-- ============================================
INSERT OR IGNORE INTO tenants (id, code, name, email, status)
VALUES (
    'tenant_cliente_01',
    'CLIENTE_01',
    'COMURG - Companhia de Urbanizacao de Goiania',
    'cliente01@investigaree.com.br',
    'active'
);

-- ============================================
-- VERIFICACAO
-- ============================================
SELECT 'Tabelas criadas:' as info;
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
