-- ============================================
-- D1 DATABASE MIGRATION 004 - User Investigations
-- Data: 2025-12-02
-- Descrição: Tabela de investigações para usuários individuais
-- ============================================

-- Tabela de investigações do usuário
CREATE TABLE IF NOT EXISTS user_investigacoes (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,

  -- Dados do investigado
  nome TEXT NOT NULL,
  documento TEXT NOT NULL, -- CPF ou CNPJ
  tipo_pessoa TEXT DEFAULT 'fisica' CHECK (tipo_pessoa IN ('fisica', 'juridica')),
  is_grupo INTEGER DEFAULT 0, -- Se é análise em lote
  grupo_nome TEXT, -- Nome do lote/grupo
  grupo_total_documentos INTEGER DEFAULT 1, -- Quantidade de docs no grupo

  -- Categorização
  categoria TEXT DEFAULT 'funcionarios' CHECK (categoria IN ('familia', 'clientes', 'funcionarios', 'relacionamentos', 'empresas')),

  -- Status e Workflow
  status TEXT DEFAULT 'investigar' CHECK (status IN ('investigar', 'investigando', 'relatorio', 'monitoramento', 'aprovado', 'bloqueado')),
  nivel_urgencia TEXT DEFAULT 'media' CHECK (nivel_urgencia IN ('baixa', 'media', 'alta', 'urgente')),

  -- Informações adicionais do investigado
  email TEXT,
  telefones TEXT, -- JSON array
  endereco TEXT,
  redes_sociais TEXT, -- JSON: {"instagram": "@user", "facebook": "...", "linkedin": "..."}
  placa_veiculo TEXT,
  rg TEXT,
  estado_civil TEXT,
  profissao TEXT,
  data_nascimento TEXT,

  -- Investigação
  motivo_investigacao TEXT,
  escopo_investigacao TEXT, -- JSON: {"antecedentes": true, "processos": true, ...}
  observacoes TEXT,
  prazo_desejado TEXT, -- Data ISO

  -- Relatório
  relatorio_url TEXT, -- URL do relatório PDF
  relatorio_gerado_em TEXT, -- Data de geração

  -- Metadados
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_inv_user ON user_investigacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_inv_status ON user_investigacoes(status);
CREATE INDEX IF NOT EXISTS idx_user_inv_categoria ON user_investigacoes(categoria);
CREATE INDEX IF NOT EXISTS idx_user_inv_urgencia ON user_investigacoes(nivel_urgencia);
CREATE INDEX IF NOT EXISTS idx_user_inv_tipo ON user_investigacoes(tipo_pessoa);
CREATE INDEX IF NOT EXISTS idx_user_inv_grupo ON user_investigacoes(is_grupo);
CREATE INDEX IF NOT EXISTS idx_user_inv_created ON user_investigacoes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_inv_documento ON user_investigacoes(documento);

-- Tabela de mensagens/contatos do usuário
CREATE TABLE IF NOT EXISTS user_mensagens (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id TEXT NOT NULL,
  investigacao_id TEXT, -- Pode ser NULL se for mensagem geral

  assunto TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT DEFAULT 'geral' CHECK (tipo IN ('geral', 'duvida', 'ampliar', 'reabrir', 'urgente', 'financeiro', 'outro')),

  -- Status da mensagem
  lida INTEGER DEFAULT 0,
  respondida INTEGER DEFAULT 0,
  resposta TEXT,
  respondida_em TEXT,
  respondida_por TEXT,

  created_at TEXT DEFAULT (datetime('now')),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (investigacao_id) REFERENCES user_investigacoes(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_user_msg_user ON user_mensagens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_msg_inv ON user_mensagens(investigacao_id);
CREATE INDEX IF NOT EXISTS idx_user_msg_lida ON user_mensagens(lida);
CREATE INDEX IF NOT EXISTS idx_user_msg_created ON user_mensagens(created_at DESC);

-- ============================================
-- COMENTÁRIOS (documentação)
-- ============================================

-- user_investigacoes: Tabela principal de investigações do usuário
-- - status: investigar → investigando → relatorio → aprovado/bloqueado → monitoramento
-- - categoria: familia, clientes, funcionarios, relacionamentos, empresas
-- - nivel_urgencia: baixa, media, alta, urgente
-- - is_grupo: true para análise em lote (múltiplos CPFs)

-- user_mensagens: Mensagens/solicitações do usuário
-- - tipo: classificação automática baseada no assunto selecionado
-- - investigacao_id: vincula a uma investigação específica (opcional)
