-- Migration 015: Missing Tables
-- Implementa tabelas faltantes identificadas na revisão profunda
-- Sanções, OFAC, Leads, e dados complementares

-- ============================================================================
-- SANCTIONS TABLE (CEIS/CNEP/CEAF)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sancoes (
  id TEXT PRIMARY KEY,

  -- Multi-tenant
  tenant_id TEXT NOT NULL,

  -- Dados da pessoa sancionada
  cpf TEXT,
  cnpj TEXT,
  nome TEXT NOT NULL,

  -- Tipo de sanção
  tipo TEXT NOT NULL CHECK (tipo IN ('CEIS', 'CNEP', 'CEAF', 'OUTRO')),

  -- Detalhes da sanção
  data_sancao TEXT,
  data_inicio_sancao TEXT,
  data_fim_sancao TEXT,
  orgao_sancionador TEXT,
  uf_orgao_sancionador TEXT,
  motivo TEXT,
  descricao_motivo TEXT,

  -- Dados do processo
  numero_processo TEXT,
  valor_multa REAL,

  -- Status
  ativa INTEGER DEFAULT 1 CHECK (ativa IN (0, 1)),

  -- Metadata
  fonte TEXT, -- 'Portal Transparência', 'CGU', etc
  fonte_url TEXT,
  metadata TEXT, -- JSON com dados adicionais

  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sancoes_tenant ON sancoes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sancoes_cpf ON sancoes(cpf);
CREATE INDEX IF NOT EXISTS idx_sancoes_cnpj ON sancoes(cnpj);
CREATE INDEX IF NOT EXISTS idx_sancoes_tipo ON sancoes(tipo);
CREATE INDEX IF NOT EXISTS idx_sancoes_ativa ON sancoes(ativa);

-- ============================================================================
-- OFAC MATCHES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS ofac_matches (
  id TEXT PRIMARY KEY,

  -- Multi-tenant
  tenant_id TEXT NOT NULL,

  -- Dados da pessoa investigada
  cpf TEXT,
  nome_investigado TEXT NOT NULL,

  -- Match OFAC
  match_score REAL, -- 0.0 - 1.0 (similarity score)
  ofac_name TEXT NOT NULL,
  ofac_program TEXT, -- 'SDN', 'Non-SDN', etc
  ofac_type TEXT, -- 'Individual', 'Entity', 'Vessel', 'Aircraft'
  ofac_country TEXT,
  ofac_remarks TEXT,

  -- IDs OFAC
  ofac_uid TEXT,
  ofac_list_id TEXT,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'false_positive', 'ignored')),

  -- Review
  reviewed_by TEXT,
  reviewed_at TEXT,
  review_notes TEXT,

  -- Metadata
  fonte_url TEXT,
  metadata TEXT, -- JSON

  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ofac_tenant ON ofac_matches(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ofac_cpf ON ofac_matches(cpf);
CREATE INDEX IF NOT EXISTS idx_ofac_status ON ofac_matches(status);
CREATE INDEX IF NOT EXISTS idx_ofac_score ON ofac_matches(match_score);

-- ============================================================================
-- LEADS TABLE (Blog Newsletter / Landing Page)
-- ============================================================================

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,

  -- Dados do lead
  email TEXT UNIQUE NOT NULL,
  nome TEXT,
  telefone TEXT,
  empresa TEXT,

  -- Source tracking
  source TEXT, -- 'blog_lead_capture', 'landing_page', 'webinar', etc
  source_url TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Status
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'contatado', 'qualificado', 'convertido', 'perdido')),
  subscribed INTEGER DEFAULT 1 CHECK (subscribed IN (0, 1)), -- Newsletter subscription

  -- Lead scoring
  score INTEGER DEFAULT 0,
  temperatura TEXT CHECK (temperatura IN ('frio', 'morno', 'quente')),

  -- Tracking
  ip_hash TEXT,
  user_agent TEXT,

  -- Follow-up
  ultimo_contato TEXT,
  proximo_followup TEXT,
  notas TEXT,

  -- Conversão
  convertido_em TEXT, -- ID do usuário/cliente se converteu
  data_conversao TEXT,

  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_subscribed ON leads(subscribed);
CREATE INDEX IF NOT EXISTS idx_leads_temperatura ON leads(temperatura);

-- ============================================================================
-- BENEFICIARIES TABLE (Benefícios Federais)
-- ============================================================================

CREATE TABLE IF NOT EXISTS beneficiarios (
  id TEXT PRIMARY KEY,

  -- Multi-tenant
  tenant_id TEXT NOT NULL,

  -- Dados do beneficiário
  cpf TEXT NOT NULL,
  nome TEXT NOT NULL,

  -- Tipo de benefício
  tipo_beneficio TEXT, -- 'Bolsa Família', 'BPC', 'Auxílio Emergencial', etc
  codigo_beneficio TEXT,

  -- Valor
  valor_parcela REAL,

  -- Período
  mes_competencia TEXT,
  ano_competencia TEXT,

  -- Município
  municipio TEXT,
  uf TEXT,

  -- Status
  ativo INTEGER DEFAULT 1 CHECK (ativo IN (0, 1)),

  -- Fonte
  fonte TEXT DEFAULT 'Portal da Transparência',
  fonte_url TEXT,
  metadata TEXT, -- JSON

  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_beneficiarios_tenant ON beneficiarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_cpf ON beneficiarios(cpf);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_tipo ON beneficiarios(tipo_beneficio);
CREATE INDEX IF NOT EXISTS idx_beneficiarios_ativo ON beneficiarios(ativo);

-- ============================================================================
-- COMPANY PARTNERS TABLE (Vínculos Societários)
-- ============================================================================

CREATE TABLE IF NOT EXISTS vinculos_societarios (
  id TEXT PRIMARY KEY,

  -- Multi-tenant
  tenant_id TEXT NOT NULL,

  -- Pessoa física
  cpf_socio TEXT NOT NULL,
  nome_socio TEXT NOT NULL,

  -- Empresa
  cnpj TEXT NOT NULL,
  razao_social TEXT,
  nome_fantasia TEXT,

  -- Participação
  qualificacao_socio TEXT, -- 'Sócio-Administrador', 'Sócio', etc
  percentual_capital REAL,
  data_entrada_sociedade TEXT,
  data_saida_sociedade TEXT,

  -- Status
  ativo INTEGER DEFAULT 1 CHECK (ativo IN (0, 1)),

  -- Situação da empresa
  situacao_cnpj TEXT, -- 'Ativa', 'Baixada', 'Suspensa', etc
  natureza_juridica TEXT,
  porte TEXT,

  -- Fonte
  fonte TEXT DEFAULT 'Receita Federal',
  fonte_url TEXT,
  metadata TEXT, -- JSON

  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vinculos_tenant ON vinculos_societarios(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vinculos_cpf ON vinculos_societarios(cpf_socio);
CREATE INDEX IF NOT EXISTS idx_vinculos_cnpj ON vinculos_societarios(cnpj);
CREATE INDEX IF NOT EXISTS idx_vinculos_ativo ON vinculos_societarios(ativo);

-- ============================================================================
-- POLITICAL CANDIDATES TABLE (Candidaturas TSE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS candidaturas (
  id TEXT PRIMARY KEY,

  -- Multi-tenant
  tenant_id TEXT NOT NULL,

  -- Dados do candidato
  cpf TEXT NOT NULL,
  nome TEXT NOT NULL,
  nome_urna TEXT,

  -- Eleição
  ano_eleicao INTEGER NOT NULL,
  numero_eleicao TEXT,
  tipo_eleicao TEXT, -- 'Municipal', 'Estadual', 'Federal'
  cargo TEXT, -- 'Vereador', 'Prefeito', 'Deputado', etc
  numero_candidato TEXT,

  -- Partido
  sigla_partido TEXT,
  nome_partido TEXT,

  -- Localidade
  uf TEXT,
  municipio TEXT,

  -- Resultado
  situacao_candidatura TEXT, -- 'Deferido', 'Indeferido', etc
  resultado TEXT, -- 'Eleito', 'Não eleito', 'Suplente'
  total_votos INTEGER,

  -- Dados adicionais
  situacao_totalização TEXT,
  email_candidato TEXT,
  nacionalidade TEXT,
  grau_instrucao TEXT,
  ocupacao TEXT,

  -- Fonte
  fonte TEXT DEFAULT 'TSE',
  fonte_url TEXT,
  metadata TEXT, -- JSON

  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_candidaturas_tenant ON candidaturas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_candidaturas_cpf ON candidaturas(cpf);
CREATE INDEX IF NOT EXISTS idx_candidaturas_ano ON candidaturas(ano_eleicao);
CREATE INDEX IF NOT EXISTS idx_candidaturas_cargo ON candidaturas(cargo);

-- ============================================================================
-- POLITICAL DONATIONS TABLE (Doações TSE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS doacoes_politicas (
  id TEXT PRIMARY KEY,

  -- Multi-tenant
  tenant_id TEXT NOT NULL,

  -- Doador
  cpf_doador TEXT,
  cnpj_doador TEXT,
  nome_doador TEXT NOT NULL,

  -- Donatário (candidato/partido)
  cpf_candidato TEXT,
  nome_candidato TEXT,
  numero_candidato TEXT,
  cargo TEXT,
  sigla_partido TEXT,

  -- Doação
  valor_doacao REAL NOT NULL,
  data_doacao TEXT,
  tipo_doacao TEXT, -- 'Estimável em dinheiro', 'Em dinheiro', etc
  descricao TEXT,

  -- Eleição
  ano_eleicao INTEGER,
  tipo_eleicao TEXT,
  uf TEXT,
  municipio TEXT,

  -- Fonte
  fonte TEXT DEFAULT 'TSE',
  fonte_url TEXT,
  metadata TEXT, -- JSON

  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_doacoes_tenant ON doacoes_politicas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_doacoes_cpf_doador ON doacoes_politicas(cpf_doador);
CREATE INDEX IF NOT EXISTS idx_doacoes_cpf_candidato ON doacoes_politicas(cpf_candidato);
CREATE INDEX IF NOT EXISTS idx_doacoes_ano ON doacoes_politicas(ano_eleicao);

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- View: Sanções ativas por tenant
CREATE VIEW IF NOT EXISTS sancoes_ativas_por_tenant AS
SELECT
  tenant_id,
  tipo,
  COUNT(*) as total,
  SUM(valor_multa) as total_multas
FROM sancoes
WHERE ativa = 1
GROUP BY tenant_id, tipo;

-- View: Vínculos societários ativos
CREATE VIEW IF NOT EXISTS vinculos_ativos AS
SELECT *
FROM vinculos_societarios
WHERE ativo = 1 AND situacao_cnpj = 'Ativa';

-- View: Leads quentes (para priorização)
CREATE VIEW IF NOT EXISTS leads_quentes AS
SELECT *
FROM leads
WHERE
  status IN ('novo', 'contatado', 'qualificado')
  AND temperatura IN ('morno', 'quente')
  AND subscribed = 1
ORDER BY score DESC, created_at DESC;

-- ============================================================================
-- NOTES
-- ============================================================================

-- INTEGRATIONS:
-- 1. Sanções: Portal da Transparência (CEIS/CNEP), CGU (CEAF)
-- 2. OFAC: U.S. Treasury OFAC SDN List (Public API)
-- 3. Beneficiários: Portal da Transparência (Bolsa Família, BPC, etc)
-- 4. Vínculos: SERPRO CNPJ QSA API (pago) ou Receita Federal
-- 5. Candidaturas/Doações: TSE Dados Abertos (gratuito)
-- 6. Leads: Captura via frontend (blog, landing pages)

-- DATA RETENTION:
-- - Sanções: Manter histórico completo (compliance)
-- - OFAC: Manter indefinidamente (segurança)
-- - Leads: Limpar após 2 anos sem interação (LGPD)
-- - Candidaturas/Doações: Histórico completo (dados públicos)
