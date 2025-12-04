-- ============================================
-- D1 DATABASE MIGRATION 003 - Sistema de Investigações
-- Data: 2025-12-02
-- Descrição: Adiciona campos para sistema de investigações particulares
-- ============================================

-- Adicionar novos campos à tabela tenant_funcionarios
ALTER TABLE tenant_funcionarios ADD COLUMN categorias TEXT DEFAULT 'funcionarios'; -- JSON array: ["familia", "clientes", "funcionarios", "relacionamentos", "empresas"]
ALTER TABLE tenant_funcionarios ADD COLUMN status_investigacao TEXT DEFAULT 'investigar' CHECK (status_investigacao IN ('investigar', 'investigando', 'relatorio', 'monitoramento', 'aprovado', 'bloqueado'));
ALTER TABLE tenant_funcionarios ADD COLUMN motivo_investigacao TEXT;
ALTER TABLE tenant_funcionarios ADD COLUMN nivel_urgencia TEXT DEFAULT 'media' CHECK (nivel_urgencia IN ('baixa', 'media', 'alta', 'urgente'));
ALTER TABLE tenant_funcionarios ADD COLUMN observacoes TEXT;
ALTER TABLE tenant_funcionarios ADD COLUMN telefones TEXT; -- JSON array de telefones
ALTER TABLE tenant_funcionarios ADD COLUMN email TEXT;
ALTER TABLE tenant_funcionarios ADD COLUMN endereco TEXT;
ALTER TABLE tenant_funcionarios ADD COLUMN redes_sociais TEXT; -- JSON: {"instagram": "@user", "facebook": "...", "linkedin": "..."}
ALTER TABLE tenant_funcionarios ADD COLUMN placa_veiculo TEXT;
ALTER TABLE tenant_funcionarios ADD COLUMN escopo_investigacao TEXT; -- JSON: {"antecedentes": true, "processos": true, ...}
ALTER TABLE tenant_funcionarios ADD COLUMN prazo_desejado TEXT; -- Data ISO
ALTER TABLE tenant_funcionarios ADD COLUMN orcamento_maximo REAL;
ALTER TABLE tenant_funcionarios ADD COLUMN rg TEXT;
ALTER TABLE tenant_funcionarios ADD COLUMN estado_civil TEXT;
ALTER TABLE tenant_funcionarios ADD COLUMN profissao TEXT;
ALTER TABLE tenant_funcionarios ADD COLUMN tipo_pessoa TEXT DEFAULT 'fisica' CHECK (tipo_pessoa IN ('fisica', 'juridica'));

-- Adicionar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_tenant_func_status ON tenant_funcionarios(status_investigacao);
CREATE INDEX IF NOT EXISTS idx_tenant_func_urgencia ON tenant_funcionarios(nivel_urgencia);
CREATE INDEX IF NOT EXISTS idx_tenant_func_tipo ON tenant_funcionarios(tipo_pessoa);

-- Comentários para documentação
-- categorias: Array JSON com múltiplas categorias ["familia", "clientes", "funcionarios", "relacionamentos", "empresas"]
-- status_investigacao: Fluxo de investigação (investigar → investigando → relatorio → aprovado/bloqueado → monitoramento)
-- escopo_investigacao: JSON com flags de tipos de investigação solicitados
-- tipo_pessoa: Define se é pessoa física ou jurídica (para aplicar validações corretas)
