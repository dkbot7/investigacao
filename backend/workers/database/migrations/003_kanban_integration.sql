-- ============================================================================
-- INVESTIGAREE - KANBAN INTEGRATION
-- Migration: 003_kanban_integration.sql
-- Created: 2025-12-08
-- Agent: Agent 3 - Full-Stack Developer
-- Purpose: Add Kanban workflow fields to funcionarios table
-- ============================================================================

-- ============================================================================
-- ALTER TABLE: funcionarios
-- Add Kanban workflow and investigation tracking fields
-- ============================================================================

-- Status da investigação (Kanban workflow)
-- Values: 'investigar', 'investigando', 'relatorio', 'monitoramento', 'aprovado', 'bloqueado'
ALTER TABLE funcionarios ADD COLUMN status_investigacao TEXT DEFAULT 'investigar';

-- Tipo de entrada no Kanban
-- Values: 'funcionario', 'consulta_cpf', 'consulta_cnpj', 'consulta_divida', 'consulta_renda', etc.
ALTER TABLE funcionarios ADD COLUMN tipo TEXT DEFAULT 'funcionario';

-- Metadata JSON para armazenar dados específicos por tipo
-- Ex: { "api": "cpf", "situacao": "regular", "nascimento": "01/01/1990" }
ALTER TABLE funcionarios ADD COLUMN metadata TEXT;

-- Custo total acumulado de consultas SERPRO para este funcionário
ALTER TABLE funcionarios ADD COLUMN custo REAL DEFAULT 0.00;

-- Data da última consulta SERPRO
ALTER TABLE funcionarios ADD COLUMN consultado_em DATETIME;

-- Observações da investigação (texto livre)
ALTER TABLE funcionarios ADD COLUMN observacoes TEXT;

-- Flag de arquivamento (não aparece no Kanban por padrão)
ALTER TABLE funcionarios ADD COLUMN arquivado INTEGER DEFAULT 0;

-- ============================================================================
-- CREATE INDEX: Performance para queries do Kanban
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_funcionarios_status ON funcionarios(tenant_code, status_investigacao, arquivado);
CREATE INDEX IF NOT EXISTS idx_funcionarios_tipo ON funcionarios(tipo);
CREATE INDEX IF NOT EXISTS idx_funcionarios_consultado ON funcionarios(consultado_em DESC);
CREATE INDEX IF NOT EXISTS idx_funcionarios_custo ON funcionarios(custo DESC);

-- ============================================================================
-- MIGRATION 003 COMPLETA
-- ============================================================================
