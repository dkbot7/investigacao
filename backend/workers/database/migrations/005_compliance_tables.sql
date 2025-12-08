-- ============================================================================
-- COMPLIANCE TABLES - SPRINT 1
-- Migration: 005_compliance_tables.sql
-- Created: 2025-12-08
-- Agent: Agent 2 - Backend Engineer
-- Purpose: Tabelas para compliance LGPD, CEIS/CNEP, PEP, OFAC
-- ============================================================================

-- ============================================================================
-- 1. PEP - PESSOAS EXPOSTAS POLITICAMENTE
-- ============================================================================

-- Lista de PEPs atualizada mensalmente da CGU
CREATE TABLE IF NOT EXISTS pep_list (
  cpf TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL,
  orgao TEXT NOT NULL,
  nivel_federacao TEXT CHECK(nivel_federacao IN ('federal', 'estadual', 'municipal')),
  uf TEXT,
  municipio TEXT,
  data_inicio TEXT,
  data_fim TEXT,
  situacao TEXT DEFAULT 'ativo' CHECK(situacao IN ('ativo', 'inativo')),

  -- Metadados
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_pep_nome ON pep_list(nome);
CREATE INDEX IF NOT EXISTS idx_pep_orgao ON pep_list(orgao);
CREATE INDEX IF NOT EXISTS idx_pep_situacao ON pep_list(situacao);

-- ============================================================================
-- 2. SANCÕES CACHE (CEIS/CNEP/OFAC)
-- ============================================================================

-- Cache de verificações de sanções para evitar consultas repetidas
CREATE TABLE IF NOT EXISTS sancoes_cache (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  documento TEXT NOT NULL, -- CPF ou CNPJ
  tipo_documento TEXT NOT NULL CHECK(tipo_documento IN ('cpf', 'cnpj')),
  nome TEXT,

  -- Tipos de sanção
  tem_ceis INTEGER DEFAULT 0,
  tem_cnep INTEGER DEFAULT 0,
  tem_ceaf INTEGER DEFAULT 0,
  tem_ofac INTEGER DEFAULT 0,

  -- Detalhes (JSON)
  ceis_json TEXT, -- Array de sanções CEIS
  cnep_json TEXT, -- Array de sanções CNEP
  ceaf_json TEXT, -- Array de acordos leniência
  ofac_json TEXT, -- Array de matches OFAC

  -- Total
  total_sancoes INTEGER DEFAULT 0,
  nivel_risco TEXT CHECK(nivel_risco IN ('baixo', 'medio', 'alto', 'critico')),

  -- Cache control
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL, -- 30 dias

  UNIQUE(documento, tipo_documento)
);

CREATE INDEX IF NOT EXISTS idx_sancoes_documento ON sancoes_cache(documento);
CREATE INDEX IF NOT EXISTS idx_sancoes_nivel_risco ON sancoes_cache(nivel_risco);
CREATE INDEX IF NOT EXISTS idx_sancoes_expires ON sancoes_cache(expires_at);

-- ============================================================================
-- 3. LGPD - CONSENT MANAGEMENT
-- ============================================================================

-- Registro de consentimento para tratamento de dados (LGPD Art. 7)
CREATE TABLE IF NOT EXISTS lgpd_consent (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  tenant_code TEXT NOT NULL,

  -- Dados do titular
  documento TEXT NOT NULL, -- CPF/CNPJ sendo consultado
  tipo_documento TEXT CHECK(tipo_documento IN ('cpf', 'cnpj')),

  -- Consentimento
  tipo_consulta TEXT NOT NULL, -- 'cpf', 'cnpj', 'processos', 'sancoes', etc.
  finalidade TEXT NOT NULL, -- Finalidade do tratamento
  base_legal TEXT NOT NULL DEFAULT 'consentimento', -- consentimento, obrigacao_legal, etc.

  -- Status
  consentimento_dado INTEGER DEFAULT 1,
  revogado INTEGER DEFAULT 0,
  revogado_em TEXT,
  motivo_revogacao TEXT,

  -- Metadados
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_code) REFERENCES tenants(tenant_code) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_lgpd_consent_user ON lgpd_consent(user_id);
CREATE INDEX IF NOT EXISTS idx_lgpd_consent_tenant ON lgpd_consent(tenant_code);
CREATE INDEX IF NOT EXISTS idx_lgpd_consent_documento ON lgpd_consent(documento);
CREATE INDEX IF NOT EXISTS idx_lgpd_consent_revogado ON lgpd_consent(revogado, created_at);

-- ============================================================================
-- 4. LGPD - DATA SUBJECT REQUESTS (DSR)
-- ============================================================================

-- Solicitações de titulares (acesso, retificação, eliminação)
CREATE TABLE IF NOT EXISTS lgpd_data_requests (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),

  -- Solicitante
  email TEXT NOT NULL,
  nome TEXT,
  cpf TEXT,
  telefone TEXT,

  -- Tipo de solicitação
  tipo_solicitacao TEXT NOT NULL CHECK(tipo_solicitacao IN (
    'acesso', -- Art. 18, II (acesso aos dados)
    'retificacao', -- Art. 18, III (correção)
    'anonimizacao', -- Art. 18, IV (anonimização)
    'eliminacao', -- Art. 18, VI (eliminação)
    'portabilidade', -- Art. 18, V (portabilidade)
    'informacao', -- Art. 18, I (confirmação de tratamento)
    'revogacao' -- Art. 18, IX (revogação)
  )),

  -- Detalhes
  descricao TEXT,

  -- Status
  status TEXT DEFAULT 'pendente' CHECK(status IN (
    'pendente',
    'em_analise',
    'aprovado',
    'negado',
    'concluido',
    'cancelado'
  )),

  -- Processamento
  analisado_por TEXT, -- user_id do DPO
  analisado_em TEXT,
  resposta TEXT,
  arquivo_resposta_url TEXT, -- Se for portabilidade/acesso

  -- Prazos LGPD
  prazo_resposta TEXT, -- 15 dias úteis (Art. 18, §1º)
  respondido_em TEXT,

  -- Metadados
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_lgpd_requests_email ON lgpd_data_requests(email);
CREATE INDEX IF NOT EXISTS idx_lgpd_requests_cpf ON lgpd_data_requests(cpf);
CREATE INDEX IF NOT EXISTS idx_lgpd_requests_status ON lgpd_data_requests(status, created_at);
CREATE INDEX IF NOT EXISTS idx_lgpd_requests_tipo ON lgpd_data_requests(tipo_solicitacao);

-- ============================================================================
-- 5. OFAC SDN LIST CACHE
-- ============================================================================

-- Cache local da lista OFAC SDN (atualizado semanalmente)
CREATE TABLE IF NOT EXISTS ofac_sdn_list (
  ent_num TEXT PRIMARY KEY, -- Entity Number (ID único OFAC)

  -- Identificação
  sdn_name TEXT NOT NULL,
  sdn_type TEXT, -- Individual, Entity, Vessel, Aircraft

  -- Programas
  programs TEXT, -- JSON array com programas de sanção

  -- Identificadores
  remarks TEXT,

  -- Dados completos
  full_data TEXT, -- JSON completo da entrada OFAC

  -- Metadados
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_ofac_name ON ofac_sdn_list(sdn_name);
CREATE INDEX IF NOT EXISTS idx_ofac_type ON ofac_sdn_list(sdn_type);

-- ============================================================================
-- 6. DIVIDA ATIVA CACHE
-- ============================================================================

-- Cache de consultas de Dívida Ativa (SERPRO)
CREATE TABLE IF NOT EXISTS divida_ativa_cache (
  documento TEXT PRIMARY KEY, -- CPF ou CNPJ
  tipo_pessoa TEXT CHECK(tipo_pessoa IN ('fisica', 'juridica')),

  -- Resumo
  total_dividas INTEGER DEFAULT 0,
  valor_total REAL DEFAULT 0,

  -- Detalhes (JSON array)
  dividas_json TEXT,

  -- Cache control
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL -- 30 dias
);

CREATE INDEX IF NOT EXISTS idx_divida_documento ON divida_ativa_cache(documento);
CREATE INDEX IF NOT EXISTS idx_divida_expires ON divida_ativa_cache(expires_at);

-- ============================================================================
-- 7. COMPLIANCE AUDIT LOG
-- ============================================================================

-- Log específico de operações de compliance (além do audit_logs geral)
CREATE TABLE IF NOT EXISTS compliance_audit_log (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),

  -- Operação
  tipo_operacao TEXT NOT NULL, -- 'verificacao_pep', 'verificacao_ceis', 'verificacao_ofac', etc.
  documento TEXT NOT NULL,

  -- Resultado
  encontrado INTEGER DEFAULT 0,
  detalhes TEXT, -- JSON com resultado

  -- Contexto
  user_id TEXT,
  tenant_code TEXT,
  investigacao_id TEXT,

  -- Metadados
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (tenant_code) REFERENCES tenants(tenant_code)
);

CREATE INDEX IF NOT EXISTS idx_compliance_audit_tipo ON compliance_audit_log(tipo_operacao, created_at);
CREATE INDEX IF NOT EXISTS idx_compliance_audit_documento ON compliance_audit_log(documento);
CREATE INDEX IF NOT EXISTS idx_compliance_audit_tenant ON compliance_audit_log(tenant_code, created_at);

-- ============================================================================
-- TRIGGERS PARA AUTO-UPDATE
-- ============================================================================

-- Trigger para atualizar updated_at em pep_list
CREATE TRIGGER IF NOT EXISTS pep_list_updated_at
AFTER UPDATE ON pep_list
BEGIN
  UPDATE pep_list SET updated_at = datetime('now') WHERE cpf = NEW.cpf;
END;

-- Trigger para atualizar updated_at em sancoes_cache
CREATE TRIGGER IF NOT EXISTS sancoes_cache_updated_at
AFTER UPDATE ON sancoes_cache
BEGIN
  UPDATE sancoes_cache SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Trigger para atualizar updated_at em lgpd_data_requests
CREATE TRIGGER IF NOT EXISTS lgpd_requests_updated_at
AFTER UPDATE ON lgpd_data_requests
BEGIN
  UPDATE lgpd_data_requests SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- ============================================================================
-- VIEWS PARA RELATÓRIOS
-- ============================================================================

-- View: Estatísticas de PEP
CREATE VIEW IF NOT EXISTS v_pep_stats AS
SELECT
  nivel_federacao,
  COUNT(*) as total,
  COUNT(CASE WHEN situacao = 'ativo' THEN 1 END) as ativos,
  COUNT(CASE WHEN situacao = 'inativo' THEN 1 END) as inativos
FROM pep_list
GROUP BY nivel_federacao;

-- View: Estatísticas de sanções
CREATE VIEW IF NOT EXISTS v_sancoes_stats AS
SELECT
  COUNT(*) as total_verificacoes,
  SUM(tem_ceis) as total_ceis,
  SUM(tem_cnep) as total_cnep,
  SUM(tem_ofac) as total_ofac,
  COUNT(CASE WHEN total_sancoes > 0 THEN 1 END) as com_sancoes,
  COUNT(CASE WHEN nivel_risco = 'critico' THEN 1 END) as risco_critico,
  COUNT(CASE WHEN nivel_risco = 'alto' THEN 1 END) as risco_alto
FROM sancoes_cache;

-- View: Solicitações LGPD pendentes
CREATE VIEW IF NOT EXISTS v_lgpd_requests_pendentes AS
SELECT
  tipo_solicitacao,
  COUNT(*) as total,
  MIN(created_at) as mais_antiga,
  MAX(created_at) as mais_recente
FROM lgpd_data_requests
WHERE status IN ('pendente', 'em_analise')
GROUP BY tipo_solicitacao;

-- ============================================================================
-- MIGRATION COMPLETED
-- ============================================================================

-- Comentário final
SELECT '005_compliance_tables.sql executed successfully' as status;
