-- ============================================
-- D1 DATABASE MIGRATION 002 - Tenant Tables
-- Data: 2025-12-02
-- Descrição: Tabelas multi-tenant para sistema de investigação
-- ============================================

-- Tabela de tenants (clientes)
CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  code TEXT UNIQUE NOT NULL, -- Ex: 'CLIENTE_01', 'COMURG'
  name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_tenants_code ON tenants(code);
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);

-- Tabela de associação user-tenant
CREATE TABLE IF NOT EXISTS user_tenants (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  is_active INTEGER DEFAULT 1,
  expires_at TEXT, -- NULL = sem expiração
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE(user_id, tenant_id)
);

CREATE INDEX IF NOT EXISTS idx_user_tenants_user ON user_tenants(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_tenant ON user_tenants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_tenants_active ON user_tenants(is_active);

-- Tabela de funcionários (multi-tenant)
CREATE TABLE IF NOT EXISTS tenant_funcionarios (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  cadastro TEXT, -- Matrícula/ID interno do cliente
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
  grupo TEXT NOT NULL, -- Departamento/Setor

  -- Verificações
  esta_vivo TEXT DEFAULT 'PENDENTE',
  esta_morto TEXT DEFAULT 'PENDENTE',
  ano_obito INTEGER,

  -- Patrimônio
  volume_patrimonio REAL,
  descricao_patrimonio TEXT,

  -- Benefícios
  recebe_beneficio INTEGER DEFAULT 0,
  qual_beneficio TEXT,

  -- Vínculos empresariais
  socio_empresa INTEGER DEFAULT 0,
  qtd_empresas INTEGER DEFAULT 0,
  vinculo_empresa INTEGER DEFAULT 0,

  -- Política
  doador_campanha INTEGER DEFAULT 0,
  valor_doacoes REAL DEFAULT 0,
  candidato INTEGER DEFAULT 0,

  -- Sanções
  sancionado_ceis INTEGER DEFAULT 0,
  sancionado_ofac INTEGER DEFAULT 0,

  -- Processos
  tem_processo INTEGER DEFAULT 0,
  qtd_processos INTEGER DEFAULT 0,

  -- Metadata
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE(tenant_id, cpf) -- CPF único por tenant
);

CREATE INDEX IF NOT EXISTS idx_tenant_func_tenant ON tenant_funcionarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_func_cpf ON tenant_funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_tenant_func_nome ON tenant_funcionarios(nome);
CREATE INDEX IF NOT EXISTS idx_tenant_func_grupo ON tenant_funcionarios(grupo);
CREATE INDEX IF NOT EXISTS idx_tenant_func_obito ON tenant_funcionarios(esta_morto);

-- Tabela de óbitos
CREATE TABLE IF NOT EXISTS tenant_obitos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  funcionario_id TEXT NOT NULL,
  data_obito TEXT,
  fonte TEXT, -- 'portal_transparencia', 'conecta_govbr', etc
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tenant_obitos_tenant ON tenant_obitos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_obitos_func ON tenant_obitos(funcionario_id);

-- Tabela de candidaturas
CREATE TABLE IF NOT EXISTS tenant_candidaturas (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  funcionario_id TEXT NOT NULL,
  cargo TEXT,
  partido TEXT,
  numero_candidato TEXT,
  uf TEXT,
  municipio TEXT,
  ano INTEGER,
  situacao TEXT,
  votos INTEGER DEFAULT 0,
  eleito INTEGER DEFAULT 0,
  patrimonio_declarado REAL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tenant_cand_tenant ON tenant_candidaturas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_cand_func ON tenant_candidaturas(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_tenant_cand_ano ON tenant_candidaturas(ano);

-- Tabela de doações
CREATE TABLE IF NOT EXISTS tenant_doacoes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  funcionario_id TEXT NOT NULL,
  cpf_candidato TEXT,
  nome_candidato TEXT,
  partido TEXT,
  cargo TEXT,
  ano INTEGER,
  valor REAL,
  data_doacao TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tenant_doacoes_tenant ON tenant_doacoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_doacoes_func ON tenant_doacoes(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_tenant_doacoes_ano ON tenant_doacoes(ano);

-- Tabela de vínculos empresariais (QSA)
CREATE TABLE IF NOT EXISTS tenant_vinculos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  funcionario_id TEXT NOT NULL,
  cnpj TEXT NOT NULL,
  razao_social TEXT,
  nome_fantasia TEXT,
  qualificacao TEXT, -- Sócio, Administrador, etc
  data_entrada TEXT,
  capital_social REAL,
  situacao_cadastral TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tenant_vinculos_tenant ON tenant_vinculos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_vinculos_func ON tenant_vinculos(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_tenant_vinculos_cnpj ON tenant_vinculos(cnpj);

-- Tabela de sanções (CEIS/CNEP/OFAC)
CREATE TABLE IF NOT EXISTS tenant_sancoes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  funcionario_id TEXT NOT NULL,
  tipo_sancao TEXT, -- 'CEIS', 'CNEP', 'OFAC'
  orgao_sancionador TEXT,
  fundamentacao TEXT,
  data_inicio TEXT,
  data_fim TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tenant_sancoes_tenant ON tenant_sancoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_sancoes_func ON tenant_sancoes(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_tenant_sancoes_tipo ON tenant_sancoes(tipo_sancao);

-- Tabela de benefícios sociais
CREATE TABLE IF NOT EXISTS tenant_beneficios (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  funcionario_id TEXT NOT NULL,
  tipo_beneficio TEXT, -- 'auxilio_emergencial', 'bolsa_familia', etc
  valor REAL,
  mes_referencia TEXT,
  ano_referencia INTEGER,
  parcela TEXT,
  municipio TEXT,
  uf TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tenant_beneficios_tenant ON tenant_beneficios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_beneficios_func ON tenant_beneficios(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_tenant_beneficios_tipo ON tenant_beneficios(tipo_beneficio);

-- Tabela de processos judiciais
CREATE TABLE IF NOT EXISTS tenant_processos (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  funcionario_id TEXT NOT NULL,
  numero_processo TEXT,
  tribunal TEXT,
  vara TEXT,
  classe TEXT,
  assunto TEXT,
  valor_causa REAL,
  data_distribuicao TEXT,
  situacao TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tenant_processos_tenant ON tenant_processos(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_processos_func ON tenant_processos(funcionario_id);

-- Log de consultas (rastreabilidade)
CREATE TABLE IF NOT EXISTS tenant_consultas_log (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  tenant_id TEXT NOT NULL,
  funcionario_id TEXT,
  user_id TEXT,
  tipo_consulta TEXT, -- 'obito', 'cpf', 'cnpj', 'tse', 'cgu', etc
  api_utilizada TEXT, -- 'portal_transparencia', 'infosimples', etc
  sucesso INTEGER DEFAULT 0,
  erro TEXT,
  custo REAL DEFAULT 0,
  tempo_ms INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (funcionario_id) REFERENCES tenant_funcionarios(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tenant_consultas_tenant ON tenant_consultas_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_consultas_func ON tenant_consultas_log(funcionario_id);
CREATE INDEX IF NOT EXISTS idx_tenant_consultas_tipo ON tenant_consultas_log(tipo_consulta);
CREATE INDEX IF NOT EXISTS idx_tenant_consultas_created ON tenant_consultas_log(created_at);

-- ============================================
-- INITIAL DATA (exemplo)
-- ============================================

-- Inserir tenant de exemplo (COMURG)
INSERT OR IGNORE INTO tenants (id, code, name, status) VALUES
  ('tenant_cliente_01', 'CLIENTE_01', 'COMURG - Companhia de Urbanização de Goiânia', 'active');

-- ============================================
-- COMENTÁRIOS (documentação)
-- ============================================

-- Este schema implementa multi-tenancy no D1 Database
-- Todos os dados são isolados por tenant_id
-- O acesso é controlado via tabela user_tenants
-- RLS é implementado no nível da aplicação (middleware)
