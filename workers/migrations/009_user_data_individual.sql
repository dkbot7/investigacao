-- ============================================
-- Migration 009: Dados Individuais por Usuario
-- Cada usuario tem seus proprios dados isolados
-- ============================================

-- Tabela de funcionarios do usuario (cada usuario tem seus proprios)
CREATE TABLE IF NOT EXISTS user_funcionarios (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,

    -- Dados do funcionario
    cadastro TEXT,
    nome TEXT NOT NULL,
    cpf TEXT NOT NULL,
    grupo TEXT,
    cargo TEXT,
    salario REAL,
    data_admissao TEXT,

    -- Flags de alerta
    esta_vivo TEXT DEFAULT 'SIM',
    esta_morto TEXT DEFAULT 'NAO',
    ano_obito INTEGER,

    recebe_beneficio INTEGER DEFAULT 0,
    qual_beneficio TEXT,

    socio_empresa INTEGER DEFAULT 0,
    qtd_empresas INTEGER DEFAULT 0,

    doador_campanha INTEGER DEFAULT 0,
    valor_doacoes REAL DEFAULT 0,

    candidato INTEGER DEFAULT 0,
    sancionado_ceis INTEGER DEFAULT 0,
    sancionado_ofac INTEGER DEFAULT 0,

    -- Metadata
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_user_funcionarios_user_id ON user_funcionarios(user_id);
CREATE INDEX IF NOT EXISTS idx_user_funcionarios_cpf ON user_funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_user_funcionarios_nome ON user_funcionarios(nome);

-- Tabela de obitos do usuario
CREATE TABLE IF NOT EXISTS user_obitos (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,

    data_obito TEXT,
    fonte TEXT,

    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (funcionario_id) REFERENCES user_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_user_obitos_user_id ON user_obitos(user_id);

-- Tabela de candidaturas do usuario
CREATE TABLE IF NOT EXISTS user_candidaturas (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,

    cargo TEXT,
    partido TEXT,
    uf TEXT,
    municipio TEXT,
    ano INTEGER,
    situacao TEXT,
    votos INTEGER,

    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (funcionario_id) REFERENCES user_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_user_candidaturas_user_id ON user_candidaturas(user_id);

-- Tabela de doacoes do usuario
CREATE TABLE IF NOT EXISTS user_doacoes (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,

    nome_candidato TEXT,
    cpf_candidato TEXT,
    partido TEXT,
    cargo TEXT,
    ano INTEGER,
    valor REAL,

    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (funcionario_id) REFERENCES user_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_user_doacoes_user_id ON user_doacoes(user_id);

-- Tabela de vinculos empresariais do usuario
CREATE TABLE IF NOT EXISTS user_vinculos (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,

    cnpj TEXT,
    razao_social TEXT,
    nome_fantasia TEXT,
    qualificacao TEXT,
    data_entrada TEXT,
    situacao_cadastral TEXT,
    capital_social REAL,

    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (funcionario_id) REFERENCES user_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_user_vinculos_user_id ON user_vinculos(user_id);

-- Tabela de sancoes do usuario
CREATE TABLE IF NOT EXISTS user_sancoes (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,

    tipo_sancao TEXT,
    orgao_sancionador TEXT,
    fundamentacao TEXT,
    data_inicio TEXT,
    data_fim TEXT,

    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (funcionario_id) REFERENCES user_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_user_sancoes_user_id ON user_sancoes(user_id);

-- Tabela de beneficios do usuario
CREATE TABLE IF NOT EXISTS user_beneficios (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    funcionario_id TEXT NOT NULL,

    tipo_beneficio TEXT,
    valor REAL,
    ano_referencia INTEGER,

    created_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (funcionario_id) REFERENCES user_funcionarios(id)
);

CREATE INDEX IF NOT EXISTS idx_user_beneficios_user_id ON user_beneficios(user_id);

-- Tabela de configuracoes do usuario
CREATE TABLE IF NOT EXISTS user_settings (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL UNIQUE,

    empresa_nome TEXT,
    empresa_cnpj TEXT,
    plano TEXT DEFAULT 'free',
    limite_funcionarios INTEGER DEFAULT 100,

    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),

    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);
