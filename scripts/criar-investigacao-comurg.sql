-- Criar investigação COMURG - Empresa
--
-- Script para criar investigação diretamente no D1
--
-- Executar com: npx wrangler d1 execute investigaree-db --file=scripts/criar-investigacao-comurg.sql
--

-- Primeiro, vamos buscar ou criar o user_id para o tenant COMURG
-- Usando o email cliente01@investigaree.com.br

-- Verificar se usuário existe
SELECT 'Verificando usuário COMURG...' as status;
SELECT id, email, firebase_uid FROM users WHERE email = 'cliente01@investigaree.com.br';

-- Se não existir, precisaremos do firebase_uid correto
-- Por ora, vamos assumir que existe e buscar o ID

-- Criar a investigação
-- ID gerado: comurg-empresa-001
INSERT INTO user_investigacoes (
  id,
  user_id,
  nome,
  documento,
  tipo_pessoa,
  is_grupo,
  grupo_total_documentos,
  categoria,
  status,
  nivel_urgencia,
  motivo_investigacao,
  observacoes,
  created_at,
  updated_at
)
SELECT
  'comurg-empresa-001' as id,
  (SELECT id FROM users WHERE email = 'cliente01@investigaree.com.br' LIMIT 1) as user_id,
  'comurg - empresa' as nome,
  '11.111.111/1111-11' as documento,
  'juridica' as tipo_pessoa,
  0 as is_grupo,
  1 as grupo_total_documentos,
  'empresas' as categoria,
  'investigar' as status,
  'media' as nivel_urgencia,
  'Verificação de empresa relacionada à COMURG' as motivo_investigacao,
  'Investigação criada para tenant COMURG via SQL' as observacoes,
  datetime('now') as created_at,
  datetime('now') as updated_at
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'cliente01@investigaree.com.br');

-- Confirmar criação
SELECT 'Investigação criada!' as status;
SELECT * FROM user_investigacoes WHERE id = 'comurg-empresa-001';

-- Criar audit log
INSERT INTO audit_logs (
  user_id,
  action,
  entity_type,
  entity_id,
  metadata,
  created_at
)
SELECT
  (SELECT id FROM users WHERE email = 'cliente01@investigaree.com.br' LIMIT 1) as user_id,
  'create' as action,
  'investigacao' as entity_type,
  'comurg-empresa-001' as entity_id,
  '{"nome":"comurg - empresa","documento":"11.111.111/1111-11","source":"sql_script"}' as metadata,
  datetime('now') as created_at
WHERE EXISTS (SELECT 1 FROM users WHERE email = 'cliente01@investigaree.com.br');

SELECT 'Audit log criado!' as status;
