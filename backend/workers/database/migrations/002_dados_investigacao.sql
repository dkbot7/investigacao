-- ============================================================================
-- INVESTIGAREE - SISTEMA DE DADOS E CACHE
-- Migration: 002_dados_investigacao.sql
-- Created: 2025-12-07
-- Agent: Agent 2 - Backend Engineer
-- ============================================================================

-- ============================================================================
-- TABELA: funcionarios
-- Armazena lista de funcionários por tenant
-- ============================================================================
CREATE TABLE IF NOT EXISTS funcionarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_code TEXT NOT NULL,
  cpf TEXT NOT NULL,

  -- Dados básicos (importados do CSV)
  nome_importado TEXT,              -- Nome do CSV (pode diferir do SERPRO)
  grupo TEXT,                       -- COMURG, SECRETARIA, etc.
  cargo TEXT,
  salario REAL,

  -- Dados enriquecidos (outras fontes)
  esta_morto INTEGER DEFAULT 0,     -- 0=não, 1=sim (via SISOBITO)
  ano_obito INTEGER,
  recebe_beneficio INTEGER DEFAULT 0,
  qual_beneficio TEXT,
  socio_empresa INTEGER DEFAULT 0,
  qtd_empresas INTEGER DEFAULT 0,
  doador_campanha INTEGER DEFAULT 0,
  valor_doacoes REAL,
  candidato INTEGER DEFAULT 0,
  sancionado_ceis INTEGER DEFAULT 0,
  sancionado_ofac INTEGER DEFAULT 0,

  -- Metadados
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  UNIQUE(tenant_code, cpf),
  FOREIGN KEY (tenant_code) REFERENCES tenants(tenant_code)
);

-- ============================================================================
-- TABELA: serpro_cpf_cache
-- Cache de consultas CPF (SERPRO API)
-- Validade: 90 dias
-- ============================================================================
CREATE TABLE IF NOT EXISTS serpro_cpf_cache (
  cpf TEXT PRIMARY KEY,

  -- Dados principais
  nome TEXT NOT NULL,
  nascimento TEXT,                  -- DD/MM/YYYY
  situacao_codigo TEXT,             -- "0" = regular, "2" = suspensa, etc.
  situacao_descricao TEXT,          -- "REGULAR", "SUSPENSA", etc.

  -- Resposta completa (backup)
  dados_json TEXT NOT NULL,         -- JSON completo da resposta SERPRO

  -- Controle de cache
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,     -- Data de expiração (created_at + 90 dias)
  consultas_count INTEGER DEFAULT 1, -- Contador de re-consultas

  -- Metadados
  ultimo_erro TEXT,                 -- Última mensagem de erro (se houver)
  ultimo_status_http INTEGER        -- Último status HTTP da API SERPRO
);

-- ============================================================================
-- TABELA: serpro_cnpj_cache
-- Cache de consultas CNPJ (SERPRO API)
-- Validade: 180 dias (empresas mudam menos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS serpro_cnpj_cache (
  cnpj TEXT PRIMARY KEY,

  -- Dados principais
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  situacao_cadastral TEXT,          -- "ATIVA", "BAIXADA", "SUSPENSA"
  data_situacao_cadastral TEXT,

  -- QSA (Quadro Societário e Administradores)
  qsa_json TEXT,                    -- JSON com lista de sócios

  -- Resposta completa (backup)
  dados_json TEXT NOT NULL,

  -- Controle de cache
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL,     -- created_at + 180 dias
  consultas_count INTEGER DEFAULT 1,

  -- Metadados
  ultimo_erro TEXT,
  ultimo_status_http INTEGER
);

-- ============================================================================
-- TABELA: jobs_queue
-- Fila de processamento em background
-- ============================================================================
CREATE TABLE IF NOT EXISTS jobs_queue (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- Identificação
  type TEXT NOT NULL,               -- Tipo de job (ver tipos abaixo)
  tenant_code TEXT,                 -- Tenant associado (nullable para jobs globais)

  -- Status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  priority INTEGER DEFAULT 5,       -- 1-10 (1=highest, 10=lowest)

  -- Dados
  data_json TEXT,                   -- JSON com parâmetros do job

  -- Progresso
  progress INTEGER DEFAULT 0,       -- 0-100
  items_total INTEGER,              -- Total de itens a processar
  items_processed INTEGER DEFAULT 0, -- Itens já processados
  items_failed INTEGER DEFAULT 0,   -- Itens que falharam

  -- Erro
  error TEXT,                       -- Mensagem de erro (se falhou)
  error_details TEXT,               -- Stack trace ou detalhes

  -- Retry
  retry_count INTEGER DEFAULT 0,    -- Tentativas realizadas
  max_retries INTEGER DEFAULT 3,    -- Máximo de tentativas

  -- Timestamps
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  started_at DATETIME,
  completed_at DATETIME,
  next_retry_at DATETIME,           -- Quando tentar novamente (se falhou)

  -- Constraints
  FOREIGN KEY (tenant_code) REFERENCES tenants(tenant_code)
);

-- ============================================================================
-- TIPOS DE JOBS (Documentação)
-- ============================================================================
-- 'import_cpf'           - Importar lista de CPFs do CSV
-- 'consultar_cpf_batch'  - Consultar lote de CPFs no SERPRO
-- 'consultar_cnpj_batch' - Consultar lote de CNPJs no SERPRO
-- 'refresh_cache_cpf'    - Atualizar CPFs expirados
-- 'refresh_cache_cnpj'   - Atualizar CNPJs expirados
-- 'enriquecer_dados'     - Buscar dados em outras fontes (SISOBITO, TSE, etc.)

-- ============================================================================
-- INDEXES PARA PERFORMANCE
-- ============================================================================

-- funcionarios
CREATE INDEX IF NOT EXISTS idx_funcionarios_tenant ON funcionarios(tenant_code);
CREATE INDEX IF NOT EXISTS idx_funcionarios_cpf ON funcionarios(cpf);
CREATE INDEX IF NOT EXISTS idx_funcionarios_grupo ON funcionarios(tenant_code, grupo);

-- serpro_cpf_cache
CREATE INDEX IF NOT EXISTS idx_serpro_cpf_expires ON serpro_cpf_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_serpro_cpf_updated ON serpro_cpf_cache(updated_at);

-- serpro_cnpj_cache
CREATE INDEX IF NOT EXISTS idx_serpro_cnpj_expires ON serpro_cnpj_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_serpro_cnpj_updated ON serpro_cnpj_cache(updated_at);

-- jobs_queue
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs_queue(status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_jobs_tenant ON jobs_queue(tenant_code, status);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON jobs_queue(type, status);
CREATE INDEX IF NOT EXISTS idx_jobs_next_retry ON jobs_queue(next_retry_at);

-- ============================================================================
-- MIGRATION 002 COMPLETA
-- ============================================================================
