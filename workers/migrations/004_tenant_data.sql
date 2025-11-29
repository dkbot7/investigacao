-- ============================================
-- MULTI-TENANT DATA SCHEMA - investigaree
-- Isolamento de dados por tenant_id (user.email)
-- ============================================

-- Tenants (clientes)
CREATE TABLE IF NOT EXISTS tenants (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    code TEXT UNIQUE NOT NULL, -- 'CLIENTE_01', 'CLIENTE_02', etc.
    name TEXT NOT NULL, -- 'COMURG', etc.
    email TEXT UNIQUE NOT NULL, -- Email de acesso (Firebase Auth)
    firebase_uid TEXT UNIQUE,
    status TEXT DEFAULT 'active', -- 'active', 'inactive', 'suspended'
    config TEXT, -- JSON com configurações específicas
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX idx_tenants_email ON tenants(email);
CREATE INDEX idx_tenants_code ON tenants(code);

-- Funcionários (multi-tenant)
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
    grupo TEXT NOT NULL, -- 'Disposicao', 'Comurg', etc.

    -- Verificações de vida
    esta_vivo TEXT,
    esta_morto TEXT,
    ano_obito INTEGER,

    -- Benefícios
    recebe_beneficio INTEGER DEFAULT 0,
    qual_beneficio TEXT,

    -- Vínculos empresariais
    socio_empresa INTEGER DEFAULT 0,
    qtd_empresas INTEGER DEFAULT 0,

    -- Política
    doador_campanha INTEGER DEFAULT 0,
    valor_doacoes REAL DEFAULT 0,
    candidato INTEGER DEFAULT 0,

    -- Sanções
    sancionado_ceis INTEGER DEFAULT 0,
    sancionado_ofac INTEGER DEFAULT 0,

    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

CREATE INDEX idx_tenant_func_tenant ON tenant_funcionarios(tenant_id);
CREATE INDEX idx_tenant_func_cpf ON tenant_funcionarios(cpf);
CREATE INDEX idx_tenant_func_nome ON tenant_funcionarios(nome);
CREATE INDEX idx_tenant_func_grupo ON tenant_funcionarios(tenant_id, grupo);

-- Candidaturas TSE (multi-tenant)
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

CREATE INDEX idx_tenant_cand_tenant ON tenant_candidaturas(tenant_id);
CREATE INDEX idx_tenant_cand_cpf ON tenant_candidaturas(cpf);

-- Doações de campanha (multi-tenant)
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

CREATE INDEX idx_tenant_doac_tenant ON tenant_doacoes(tenant_id);
CREATE INDEX idx_tenant_doac_cpf ON tenant_doacoes(cpf_doador);

-- Vínculos empresariais (multi-tenant)
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

CREATE INDEX idx_tenant_vinc_tenant ON tenant_vinculos(tenant_id);
CREATE INDEX idx_tenant_vinc_cpf ON tenant_vinculos(cpf_socio);

-- Sanções (multi-tenant)
CREATE TABLE IF NOT EXISTS tenant_sancoes (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tenant_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,
    cpf TEXT NOT NULL,
    nome TEXT,
    tipo_sancao TEXT, -- 'CEIS', 'CNEP', 'OFAC'
    orgao_sancionador TEXT,
    fundamentacao TEXT,
    data_inicio TEXT,
    data_fim TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id)
);

CREATE INDEX idx_tenant_sanc_tenant ON tenant_sancoes(tenant_id);
CREATE INDEX idx_tenant_sanc_cpf ON tenant_sancoes(cpf);

-- Óbitos verificados (multi-tenant)
CREATE TABLE IF NOT EXISTS tenant_obitos (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    tenant_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,
    cpf TEXT NOT NULL,
    nome TEXT,
    data_obito TEXT,
    ano_obito INTEGER,
    fonte TEXT, -- 'RECEITA_FEDERAL', 'INFOSIMPLES', etc.
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id),
    FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id)
);

CREATE INDEX idx_tenant_obito_tenant ON tenant_obitos(tenant_id);
CREATE INDEX idx_tenant_obito_cpf ON tenant_obitos(cpf);

-- Benefícios sociais (multi-tenant)
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

CREATE INDEX idx_tenant_benef_tenant ON tenant_beneficios(tenant_id);
CREATE INDEX idx_tenant_benef_cpf ON tenant_beneficios(cpf);

-- ============================================
-- INSERT TENANT CLIENTE_01
-- ============================================
INSERT OR IGNORE INTO tenants (id, code, name, email, status) VALUES
('tenant_cliente_01', 'CLIENTE_01', 'COMURG - Companhia de Urbanizacao de Goiania', 'cliente01@investigaree.com.br', 'active');
