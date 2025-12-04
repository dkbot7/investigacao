-- ============================================
-- D1 DATABASE MIGRATION 004 - Sistema de Grupos
-- Data: 2025-12-02
-- Descrição: Adiciona campos para análise em lote via grupos
-- ============================================

-- Adicionar campos para grupos na tabela tenant_funcionarios
ALTER TABLE tenant_funcionarios ADD COLUMN is_grupo INTEGER DEFAULT 0 CHECK (is_grupo IN (0, 1));
ALTER TABLE tenant_funcionarios ADD COLUMN grupo_documentos TEXT; -- JSON array com CPFs/CNPJs do grupo
ALTER TABLE tenant_funcionarios ADD COLUMN grupo_total_documentos INTEGER DEFAULT 0; -- Quantidade de documentos no grupo

-- Criar índice para melhorar performance de busca por grupos
CREATE INDEX IF NOT EXISTS idx_tenant_func_is_grupo ON tenant_funcionarios(is_grupo);

-- Comentários para documentação
-- is_grupo: 1 = É um grupo, 0 = É uma pessoa individual
-- grupo_documentos: Array JSON com lista de CPFs/CNPJs ["12345678901", "98765432100", ...]
-- grupo_total_documentos: Contador para exibir no card sem precisar fazer parse do JSON
