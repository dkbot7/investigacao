-- ============================================
-- StartIntel - Initial Database Schema
-- Migration: 001
-- Data: 2025-01-20
-- Descrição: Criação de todas as tabelas principais
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- for pgvector (AI embeddings)

-- ============================================
-- TABELA: leads
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp VARCHAR(20) UNIQUE NOT NULL,
  nome_empresa VARCHAR(255),
  cnpj VARCHAR(18),
  cpf_socio VARCHAR(14),
  nome_socio VARCHAR(255),
  email VARCHAR(255),
  fonte_captacao VARCHAR(50) DEFAULT 'landing',
  status VARCHAR(20) DEFAULT 'novo' CHECK (status IN ('novo', 'qualificado', 'convertido', 'perdido')),
  submit_count INTEGER DEFAULT 1,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_leads_whatsapp ON leads(whatsapp);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_cnpj ON leads(cnpj);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA: users
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  firebase_uid VARCHAR(128) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(20),
  empresa VARCHAR(255),
  cargo VARCHAR(100),

  -- Perfil de investidor
  ticket_medio_investimento DECIMAL(12,2),
  setores_interesse TEXT[],
  portfolio_size INTEGER DEFAULT 0,

  -- Assinatura e pagamento
  stripe_customer_id VARCHAR(255) UNIQUE,
  subscription_status VARCHAR(20) CHECK (subscription_status IN ('active', 'cancelled', 'trial', 'past_due')),
  subscription_plan VARCHAR(50) CHECK (subscription_plan IN ('basic', 'pro', 'enterprise')),
  trial_ends_at TIMESTAMP WITH TIME ZONE,

  -- LGPD
  aceite_termos BOOLEAN DEFAULT FALSE,
  aceite_privacidade BOOLEAN DEFAULT FALSE,
  aceite_lgpd BOOLEAN DEFAULT FALSE,
  aceite_marketing BOOLEAN DEFAULT FALSE,
  data_aceite_lgpd TIMESTAMP WITH TIME ZONE,

  -- Metadata
  avatar_url TEXT,
  bio TEXT,
  linkedin_url TEXT,
  last_login_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase ON users(firebase_uid);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_users_subscription_status ON users(subscription_status);

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA: reports
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

  -- Dados da startup analisada
  startup_nome VARCHAR(255) NOT NULL,
  startup_cnpj VARCHAR(18),
  startup_setor VARCHAR(100),
  startup_website VARCHAR(255),

  -- Status do relatório
  status VARCHAR(20) DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'concluido', 'erro', 'cancelado')),
  recomendacao VARCHAR(30) CHECK (recomendacao IN ('go', 'no-go', 'go-com-condicoes')),
  score_integridade INTEGER CHECK (score_integridade >= 0 AND score_integridade <= 100),

  -- Conteúdo estruturado
  sumario_executivo TEXT,
  principais_achados JSONB DEFAULT '[]'::jsonb,
  red_flags JSONB DEFAULT '[]'::jsonb,
  yellow_flags JSONB DEFAULT '[]'::jsonb,
  green_flags JSONB DEFAULT '[]'::jsonb,

  -- Dados coletados (JSONB para flexibilidade)
  dados_cnpj JSONB,
  dados_socios JSONB,
  dados_litigios JSONB,
  dados_reputacao JSONB,
  dados_metricas JSONB,
  dados_competitivos JSONB,
  dados_vazamentos JSONB,

  -- Arquivos
  pdf_url TEXT,
  pdf_password VARCHAR(64), -- senha criptografada do PDF
  anexos_urls JSONB DEFAULT '[]'::jsonb,

  -- SLA e métricas
  prazo_entrega TIMESTAMP WITH TIME ZONE,
  data_inicio_processamento TIMESTAMP WITH TIME ZONE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  tempo_processamento_segundos INTEGER,

  -- Custo estimado de APIs
  custo_total_usd DECIMAL(10,4),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX idx_reports_startup_cnpj ON reports(startup_cnpj);
CREATE INDEX idx_reports_recomendacao ON reports(recomendacao);

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA: payments
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE SET NULL,

  -- Stripe IDs
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),
  stripe_invoice_id VARCHAR(255),

  -- Valor
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'cancelled')),
  payment_method VARCHAR(50),

  -- Metadata
  produto VARCHAR(100) NOT NULL,
  descricao TEXT,
  metadata JSONB,

  -- Datas importantes
  paid_at TIMESTAMP WITH TIME ZONE,
  refunded_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_report ON payments(report_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- ============================================
-- TABELA: api_logs
-- ============================================
CREATE TABLE IF NOT EXISTS api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,

  -- Identificação da API
  api_name VARCHAR(50) NOT NULL CHECK (api_name IN ('google', 'api-brasil', 'dehashed', 'openai', 'stripe', 'other')),
  endpoint VARCHAR(255),
  method VARCHAR(10),

  -- Request
  request_payload JSONB,
  request_headers JSONB,

  -- Response
  response_status INTEGER,
  response_body JSONB,
  response_time_ms INTEGER,

  -- Custos e métricas
  api_cost DECIMAL(8,4),
  tokens_used INTEGER, -- para OpenAI

  -- Erro
  error_message TEXT,
  error_code VARCHAR(50),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_api_logs_report ON api_logs(report_id);
CREATE INDEX idx_api_logs_api_name ON api_logs(api_name);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX idx_api_logs_status ON api_logs(response_status);

-- ============================================
-- TABELA: chatbot_conversations
-- ============================================
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- OpenAI
  openai_thread_id VARCHAR(255) UNIQUE,
  openai_assistant_id VARCHAR(255),

  -- Status
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'encerrada', 'transferida', 'abandonada')),

  -- Mensagens (array de objetos {role, content, timestamp})
  messages JSONB DEFAULT '[]'::jsonb,
  message_count INTEGER DEFAULT 0,

  -- Análise de intenção
  intencao_detectada VARCHAR(50),
  sentiment VARCHAR(20) CHECK (sentiment IN ('positivo', 'neutro', 'negativo')),
  lead_score INTEGER CHECK (lead_score >= 0 AND lead_score <= 100),

  -- Conversão
  converteu BOOLEAN DEFAULT FALSE,
  report_gerado_id UUID REFERENCES reports(id) ON DELETE SET NULL,
  data_conversao TIMESTAMP WITH TIME ZONE,

  -- Metadata
  ultima_mensagem_em TIMESTAMP WITH TIME ZONE,
  duracao_minutos INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chatbot_lead ON chatbot_conversations(lead_id);
CREATE INDEX idx_chatbot_user ON chatbot_conversations(user_id);
CREATE INDEX idx_chatbot_openai_thread ON chatbot_conversations(openai_thread_id);
CREATE INDEX idx_chatbot_status ON chatbot_conversations(status);
CREATE INDEX idx_chatbot_converteu ON chatbot_conversations(converteu);

CREATE TRIGGER update_chatbot_updated_at BEFORE UPDATE ON chatbot_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA: email_tracking
-- ============================================
CREATE TABLE IF NOT EXISTS email_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

  -- Destinatário
  email_to VARCHAR(255) NOT NULL,
  email_subject VARCHAR(255),
  email_type VARCHAR(50) CHECK (email_type IN ('cold-email', 'follow-up', 'relatorio-pronto', 'pagamento', 'welcome', 'outros')),

  -- Tracking
  tracking_pixel_id UUID UNIQUE DEFAULT gen_random_uuid(),
  enviado BOOLEAN DEFAULT FALSE,
  data_envio TIMESTAMP WITH TIME ZONE,
  aberto BOOLEAN DEFAULT FALSE,
  data_abertura TIMESTAMP WITH TIME ZONE,
  abertura_count INTEGER DEFAULT 0,
  clicado BOOLEAN DEFAULT FALSE,
  data_clique TIMESTAMP WITH TIME ZONE,
  click_count INTEGER DEFAULT 0,

  -- Links rastreados
  links_rastreados JSONB DEFAULT '[]'::jsonb,

  -- Conteúdo
  email_body TEXT,
  template_usado VARCHAR(100),

  -- Resultado
  respondeu BOOLEAN DEFAULT FALSE,
  data_resposta TIMESTAMP WITH TIME ZONE,
  converteu BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_email_tracking_user ON email_tracking(user_id);
CREATE INDEX idx_email_tracking_lead ON email_tracking(lead_id);
CREATE INDEX idx_email_tracking_type ON email_tracking(email_type);
CREATE INDEX idx_email_tracking_pixel ON email_tracking(tracking_pixel_id);
CREATE INDEX idx_email_tracking_enviado ON email_tracking(enviado);

-- ============================================
-- TABELA: lgpd_consents
-- ============================================
CREATE TABLE IF NOT EXISTS lgpd_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,

  -- Tipo de consentimento
  tipo_consentimento VARCHAR(100) NOT NULL CHECK (tipo_consentimento IN (
    'termos-uso',
    'privacidade',
    'marketing',
    'compartilhamento-dados',
    'cookies',
    'notificacoes'
  )),
  consentimento_dado BOOLEAN NOT NULL,

  -- Rastreabilidade (LGPD Art. 9)
  ip_address INET,
  user_agent TEXT,
  consentimento_texto TEXT,
  versao_termo VARCHAR(20),
  url_origem VARCHAR(255),

  -- Revogação (LGPD Art. 18, IX)
  revogado BOOLEAN DEFAULT FALSE,
  data_revogacao TIMESTAMP WITH TIME ZONE,
  motivo_revogacao TEXT,

  -- Expiração (para consentimentos temporários)
  expira_em TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_lgpd_user ON lgpd_consents(user_id);
CREATE INDEX idx_lgpd_tipo ON lgpd_consents(tipo_consentimento);
CREATE INDEX idx_lgpd_consentimento_dado ON lgpd_consents(consentimento_dado);
CREATE INDEX idx_lgpd_revogado ON lgpd_consents(revogado);

-- ============================================
-- TABELA: audit_logs
-- Rastreamento de todas ações sensíveis (LGPD compliance)
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Ação
  acao VARCHAR(100) NOT NULL, -- 'login', 'visualizar_relatorio', 'exportar_dados', 'deletar_conta'
  recurso VARCHAR(50), -- 'user', 'report', 'payment'
  recurso_id UUID,

  -- Contexto
  ip_address INET,
  user_agent TEXT,
  metodo_http VARCHAR(10),
  endpoint VARCHAR(255),

  -- Resultado
  sucesso BOOLEAN DEFAULT TRUE,
  erro_mensagem TEXT,

  -- Dados alterados (antes/depois) - útil para auditoria
  dados_antes JSONB,
  dados_depois JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_acao ON audit_logs(acao);
CREATE INDEX idx_audit_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_recurso ON audit_logs(recurso, recurso_id);

-- ============================================
-- VIEWS úteis
-- ============================================

-- View: Leads qualificados prontos para conversão
CREATE OR REPLACE VIEW leads_qualificados AS
SELECT
  l.*,
  c.id as conversation_id,
  c.lead_score,
  c.intencao_detectada,
  c.message_count
FROM leads l
LEFT JOIN chatbot_conversations c ON l.id = c.lead_id
WHERE l.status = 'qualificado'
  AND l.cnpj IS NOT NULL
  AND l.email IS NOT NULL
ORDER BY c.lead_score DESC NULLS LAST;

-- View: Relatórios com SLA tracking
CREATE OR REPLACE VIEW reports_sla AS
SELECT
  r.id,
  r.user_id,
  r.startup_nome,
  r.status,
  r.created_at,
  r.prazo_entrega,
  r.data_conclusao,
  CASE
    WHEN r.status = 'concluido' AND r.data_conclusao <= r.prazo_entrega THEN 'no_prazo'
    WHEN r.status = 'concluido' AND r.data_conclusao > r.prazo_entrega THEN 'atrasado'
    WHEN r.status != 'concluido' AND NOW() > r.prazo_entrega THEN 'em_atraso'
    ELSE 'dentro_do_prazo'
  END as sla_status,
  EXTRACT(EPOCH FROM (r.prazo_entrega - NOW()))/3600 as horas_restantes
FROM reports r
WHERE r.status IN ('pendente', 'processando', 'concluido');

-- View: Métricas de conversão de leads
CREATE OR REPLACE VIEW lead_conversion_metrics AS
SELECT
  DATE_TRUNC('day', l.created_at) as data,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE l.status = 'qualificado') as leads_qualificados,
  COUNT(*) FILTER (WHERE l.status = 'convertido') as leads_convertidos,
  ROUND(100.0 * COUNT(*) FILTER (WHERE l.status = 'convertido') / NULLIF(COUNT(*), 0), 2) as taxa_conversao,
  COUNT(DISTINCT l.utm_source) as fontes_unicas
FROM leads l
GROUP BY DATE_TRUNC('day', l.created_at)
ORDER BY data DESC;

-- ============================================
-- FUNCTIONS úteis
-- ============================================

-- Function: Calcular score de integridade baseado nos dados coletados
CREATE OR REPLACE FUNCTION calcular_score_integridade(report_id UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 100;
  r RECORD;
BEGIN
  SELECT * INTO r FROM reports WHERE id = report_id;

  -- Penalizar por litígios
  IF r.dados_litigios IS NOT NULL THEN
    score := score - (COALESCE(jsonb_array_length(r.dados_litigios->'processos'), 0) * 5);
  END IF;

  -- Penalizar por vazamentos
  IF r.dados_vazamentos IS NOT NULL AND (r.dados_vazamentos->>'found')::boolean THEN
    score := score - 20;
  END IF;

  -- Penalizar por red flags
  score := score - (jsonb_array_length(r.red_flags) * 10);

  -- Penalizar por yellow flags
  score := score - (jsonb_array_length(r.yellow_flags) * 5);

  -- Garantir que score fique entre 0-100
  score := GREATEST(0, LEAST(100, score));

  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS avançados
-- ============================================

-- Trigger: Atualizar score de integridade ao concluir relatório
CREATE OR REPLACE FUNCTION atualizar_score_relatorio()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'concluido' AND OLD.status != 'concluido' THEN
    NEW.score_integridade := calcular_score_integridade(NEW.id);
    NEW.tempo_processamento_segundos := EXTRACT(EPOCH FROM (NEW.data_conclusao - NEW.data_inicio_processamento));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_atualizar_score_relatorio
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION atualizar_score_relatorio();

-- ============================================
-- INITIAL DATA (opcional)
-- ============================================

-- Inserir planos de assinatura (caso queira ter referência)
-- Pode ser usado para validação ou como lookup table

-- ============================================
-- PERMISSIONS (Row Level Security)
-- ============================================

-- Habilitar RLS em todas as tabelas críticas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE lgpd_consents ENABLE ROW LEVEL SECURITY;

-- Policies serão criadas em migration separada (002_rls_policies.sql)

-- ============================================
-- COMENTÁRIOS (documentação inline)
-- ============================================

COMMENT ON TABLE leads IS 'Captação inicial de potenciais clientes via landing page, chatbot ou cold email';
COMMENT ON TABLE users IS 'Usuários autenticados (investidores anjo) com perfil completo';
COMMENT ON TABLE reports IS 'Relatórios de due diligence forense gerados pelo sistema';
COMMENT ON TABLE payments IS 'Registro de transações Stripe (pagamentos e assinaturas)';
COMMENT ON TABLE api_logs IS 'Log de todas chamadas a APIs externas para rastreamento de custos e debugging';
COMMENT ON TABLE chatbot_conversations IS 'Histórico de conversas com o chatbot IA de vendas';
COMMENT ON TABLE email_tracking IS 'Tracking de emails enviados com pixel de abertura e links rastreados';
COMMENT ON TABLE lgpd_consents IS 'Registro de consentimentos LGPD (Art. 9 - base legal)';
COMMENT ON TABLE audit_logs IS 'Auditoria de ações sensíveis para compliance e segurança';

-- ============================================
-- END OF MIGRATION 001
-- ============================================
