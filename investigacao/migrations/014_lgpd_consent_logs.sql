-- Migration 014: LGPD Consent Logs
-- Implementa persistência de logs de consentimento LGPD
-- Conforme Art. 37 da LGPD (retenção mínima de 5 anos)

-- ============================================================================
-- LGPD CONSENT LOGS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS lgpd_consent_logs (
  id TEXT PRIMARY KEY,

  -- Timestamp do consentimento
  timestamp TEXT NOT NULL,

  -- Consentimento dado (0 = recusado, 1 = aceito)
  consentimento INTEGER NOT NULL CHECK (consentimento IN (0, 1)),

  -- Finalidades consentidas (JSON array)
  -- Ex: ["essenciais", "analiticos", "marketing"]
  finalidades TEXT NOT NULL,

  -- IP anonimizado (hash SHA-256 para compliance LGPD Art. 13)
  ip_hash TEXT NOT NULL,

  -- User Agent do navegador
  user_agent TEXT,

  -- Consentimentos granulares (JSON object)
  -- Ex: {"cookies_analytics": true, "cookies_marketing": false}
  granular TEXT,

  -- Versão do texto da política de privacidade
  versao_texto TEXT,

  -- ID do usuário (se autenticado) - opcional
  user_id TEXT,

  -- Metadata adicional (JSON)
  metadata TEXT,

  -- Timestamp de criação
  created_at TEXT DEFAULT (datetime('now'))
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index por timestamp (para relatórios)
CREATE INDEX IF NOT EXISTS idx_lgpd_timestamp ON lgpd_consent_logs(timestamp);

-- Index por user_id (para buscar histórico de um usuário específico)
CREATE INDEX IF NOT EXISTS idx_lgpd_user_id ON lgpd_consent_logs(user_id);

-- Index por consentimento (para estatísticas)
CREATE INDEX IF NOT EXISTS idx_lgpd_consentimento ON lgpd_consent_logs(consentimento);

-- Index por created_at (para queries por data)
CREATE INDEX IF NOT EXISTS idx_lgpd_created_at ON lgpd_consent_logs(created_at);

-- ============================================================================
-- LGPD REQUESTS TABLE
-- ============================================================================

-- Tabela para solicitações LGPD (acesso, exclusão, portabilidade)
CREATE TABLE IF NOT EXISTS lgpd_requests (
  id TEXT PRIMARY KEY,

  -- Tipo de solicitação
  tipo TEXT NOT NULL CHECK (tipo IN ('acesso', 'exclusao', 'portabilidade', 'retificacao', 'oposicao')),

  -- Dados do solicitante
  user_id TEXT,
  email TEXT NOT NULL,
  nome TEXT,
  cpf TEXT,

  -- Status da solicitação
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_processamento', 'concluido', 'rejeitado')),

  -- Motivo (para rejeições)
  motivo_rejeicao TEXT,

  -- Detalhes da solicitação
  detalhes TEXT,

  -- Resposta (quando concluído)
  resposta TEXT,

  -- Arquivos anexados (URLs)
  arquivos TEXT, -- JSON array de URLs

  -- Timestamps
  created_at TEXT DEFAULT (datetime('now')),
  processed_at TEXT,
  completed_at TEXT,

  -- Responsável pelo processamento
  processed_by TEXT,

  -- SLA (prazo legal: 15 dias)
  prazo_legal TEXT, -- Data limite para resposta

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- INDEXES FOR LGPD REQUESTS
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_lgpd_requests_status ON lgpd_requests(status);
CREATE INDEX IF NOT EXISTS idx_lgpd_requests_tipo ON lgpd_requests(tipo);
CREATE INDEX IF NOT EXISTS idx_lgpd_requests_email ON lgpd_requests(email);
CREATE INDEX IF NOT EXISTS idx_lgpd_requests_user_id ON lgpd_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_lgpd_requests_created_at ON lgpd_requests(created_at);

-- ============================================================================
-- LGPD DATA RETENTION POLICY
-- ============================================================================

-- View para logs que podem ser deletados (após 5 anos)
CREATE VIEW IF NOT EXISTS lgpd_logs_expirados AS
SELECT *
FROM lgpd_consent_logs
WHERE date(created_at) < date('now', '-5 years');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Função para criar solicitação LGPD com SLA automático
CREATE OR REPLACE FUNCTION create_lgpd_request(
  p_tipo TEXT,
  p_email TEXT,
  p_nome TEXT,
  p_detalhes TEXT
) RETURNS TEXT AS $$
DECLARE
  v_id TEXT;
  v_prazo TEXT;
BEGIN
  -- Gerar ID
  v_id := 'lgpd_' || lower(hex(randomblob(16)));

  -- Calcular prazo legal (15 dias a partir de hoje)
  v_prazo := date('now', '+15 days');

  -- Inserir solicitação
  INSERT INTO lgpd_requests (
    id, tipo, email, nome, detalhes, prazo_legal, created_at
  ) VALUES (
    v_id, p_tipo, p_email, p_nome, p_detalhes, v_prazo, datetime('now')
  );

  RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Função para obter estatísticas LGPD
CREATE OR REPLACE FUNCTION get_lgpd_stats() RETURNS TABLE (
  total_consentimentos INTEGER,
  consentimentos_ativos INTEGER,
  consentimentos_recusados INTEGER,
  solicitacoes_pendentes INTEGER,
  solicitacoes_concluidas INTEGER,
  solicitacoes_prazo_vencido INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM lgpd_consent_logs)::INTEGER,
    (SELECT COUNT(*) FROM lgpd_consent_logs WHERE consentimento = 1)::INTEGER,
    (SELECT COUNT(*) FROM lgpd_consent_logs WHERE consentimento = 0)::INTEGER,
    (SELECT COUNT(*) FROM lgpd_requests WHERE status = 'pendente')::INTEGER,
    (SELECT COUNT(*) FROM lgpd_requests WHERE status = 'concluido')::INTEGER,
    (SELECT COUNT(*) FROM lgpd_requests WHERE status = 'pendente' AND date(prazo_legal) < date('now'))::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- NOTES
-- ============================================================================

-- LGPD COMPLIANCE:
-- 1. Logs devem ser retidos por no mínimo 5 anos (Art. 37)
-- 2. IP é anonimizado via hash SHA-256 (Art. 13)
-- 3. Solicitações devem ser respondidas em até 15 dias (Art. 18)
-- 4. Usuário tem direito a: acesso, correção, exclusão, portabilidade (Art. 18)

-- GDPR COMPATIBILITY:
-- Esta implementação também atende aos requisitos do GDPR europeu

-- USAGE EXAMPLES:
--
-- 1. Registrar consentimento:
-- INSERT INTO lgpd_consent_logs (id, timestamp, consentimento, finalidades, ip_hash)
-- VALUES ('uuid', datetime('now'), 1, '["essenciais","analiticos"]', 'hash_sha256');
--
-- 2. Criar solicitação de acesso:
-- SELECT create_lgpd_request('acesso', 'user@example.com', 'João Silva', 'Solicito acesso aos meus dados');
--
-- 3. Obter estatísticas:
-- SELECT * FROM get_lgpd_stats();
