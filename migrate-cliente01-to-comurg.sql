-- ============================================================
-- MIGRAÇÃO: CLIENTE_01 → COMURG
-- Data: 2025-12-09
-- Descrição: Migra todos os dados de CLIENTE_01 para COMURG
-- ============================================================

-- 1. Migrar funcionários (5947 registros)
UPDATE tenant_funcionarios
SET tenant_id = 'tenant_comurg'
WHERE tenant_id = 'tenant_cliente_01';

-- 2. Migrar óbitos
UPDATE tenant_obitos
SET tenant_id = 'tenant_comurg'
WHERE tenant_id = 'tenant_cliente_01';

-- 3. Migrar candidaturas
UPDATE tenant_candidaturas
SET tenant_id = 'tenant_comurg'
WHERE tenant_id = 'tenant_cliente_01';

-- 4. Migrar doações
UPDATE tenant_doacoes
SET tenant_id = 'tenant_comurg'
WHERE tenant_id = 'tenant_cliente_01';

-- 5. Migrar vínculos
UPDATE tenant_vinculos
SET tenant_id = 'tenant_comurg'
WHERE tenant_id = 'tenant_cliente_01';

-- 6. Migrar sanções
UPDATE tenant_sancoes
SET tenant_id = 'tenant_comurg'
WHERE tenant_id = 'tenant_cliente_01';

-- 7. Migrar benefícios
UPDATE tenant_beneficios
SET tenant_id = 'tenant_comurg'
WHERE tenant_id = 'tenant_cliente_01';

-- 8. Migrar processos
UPDATE tenant_processos
SET tenant_id = 'tenant_comurg'
WHERE tenant_id = 'tenant_cliente_01';

-- 9. Migrar consultas log
UPDATE tenant_consultas_log
SET tenant_id = 'tenant_comurg'
WHERE tenant_id = 'tenant_cliente_01';

-- 10. Migrar usuário (kkhoifhiohaf@hfuhiof.com) para COMURG
UPDATE user_tenants
SET tenant_id = 'tenant_comurg'
WHERE tenant_id = 'tenant_cliente_01' AND user_id = '0bf2ef0c-b7ca-4f1d-8762-5cb2530d6f3a';

-- 11. Deletar tenant CLIENTE_01
DELETE FROM tenants WHERE id = 'tenant_cliente_01';
