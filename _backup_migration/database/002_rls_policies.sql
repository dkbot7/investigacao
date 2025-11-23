-- ============================================
-- StartIntel - Row Level Security Policies
-- Migration: 002
-- Data: 2025-01-20
-- Descrição: Políticas de segurança a nível de linha
-- ============================================

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users podem ver apenas seus próprios dados
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users podem atualizar apenas seus próprios dados
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Apenas o próprio usuário pode deletar sua conta (direito ao esquecimento)
CREATE POLICY "Users can delete own account" ON users
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- REPORTS TABLE POLICIES
-- ============================================

-- Users podem ver apenas seus próprios relatórios
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users podem criar relatórios para si mesmos
CREATE POLICY "Users can create own reports" ON reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users podem atualizar apenas seus próprios relatórios
CREATE POLICY "Users can update own reports" ON reports
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- PAYMENTS TABLE POLICIES
-- ============================================

-- Users podem ver apenas seus próprios pagamentos
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users podem criar pagamentos para si mesmos
CREATE POLICY "Users can create own payments" ON payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- CHATBOT_CONVERSATIONS TABLE POLICIES
-- ============================================

-- Users podem ver apenas suas próprias conversas
CREATE POLICY "Users can view own conversations" ON chatbot_conversations
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users podem criar conversas para si mesmos
CREATE POLICY "Users can create own conversations" ON chatbot_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users podem atualizar apenas suas próprias conversas
CREATE POLICY "Users can update own conversations" ON chatbot_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- EMAIL_TRACKING TABLE POLICIES
-- ============================================

-- Users podem ver apenas seus próprios emails
CREATE POLICY "Users can view own email tracking" ON email_tracking
  FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- LGPD_CONSENTS TABLE POLICIES
-- ============================================

-- Users podem ver apenas seus próprios consentimentos
CREATE POLICY "Users can view own consents" ON lgpd_consents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users podem criar consentimentos para si mesmos
CREATE POLICY "Users can create own consents" ON lgpd_consents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users podem atualizar (revogar) apenas seus próprios consentimentos
CREATE POLICY "Users can update own consents" ON lgpd_consents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- ADMIN POLICIES
-- Admins podem ver tudo (para dashboard interno)
-- ============================================

-- Function para checar se usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM users
    WHERE users.id = auth.uid()
      AND users.email = 'contato@investigaree.com.br'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin pode ver todos os users
CREATE POLICY "Admin can view all users" ON users
  FOR SELECT
  USING (is_admin());

-- Admin pode ver todos os reports
CREATE POLICY "Admin can view all reports" ON reports
  FOR SELECT
  USING (is_admin());

-- Admin pode atualizar status de reports
CREATE POLICY "Admin can update all reports" ON reports
  FOR UPDATE
  USING (is_admin());

-- Admin pode ver todos os payments
CREATE POLICY "Admin can view all payments" ON payments
  FOR SELECT
  USING (is_admin());

-- Admin pode ver todas as conversations
CREATE POLICY "Admin can view all conversations" ON chatbot_conversations
  FOR SELECT
  USING (is_admin());

-- Admin pode ver todos email trackings
CREATE POLICY "Admin can view all email tracking" ON email_tracking
  FOR SELECT
  USING (is_admin());

-- Admin pode ver todos os consents (para auditoria LGPD)
CREATE POLICY "Admin can view all consents" ON lgpd_consents
  FOR SELECT
  USING (is_admin());

-- ============================================
-- SERVICE ROLE POLICIES
-- Para Cloudflare Workers (bypass RLS com service_role key)
-- ============================================

-- Leads table não tem RLS pois é acessada por workers sem autenticação de usuário
-- (captura na landing page antes de criar conta)

-- API logs não precisa de RLS (só backend acessa)

-- Audit logs: apenas admin e service role
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view audit logs" ON audit_logs
  FOR SELECT
  USING (is_admin());

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- Configurar quais tabelas podem ser "ouvidas" em tempo real
-- ============================================

-- Users podem ouvir mudanças em seus próprios reports
ALTER PUBLICATION supabase_realtime ADD TABLE reports;

-- Users podem ouvir mudanças em suas próprias conversations
ALTER PUBLICATION supabase_realtime ADD TABLE chatbot_conversations;

-- ============================================
-- STORAGE POLICIES (Supabase Storage)
-- Para upload de PDFs e anexos
-- ============================================

-- Bucket: reports (relatórios em PDF)
-- Policy: Users podem fazer upload apenas no próprio diretório
INSERT INTO storage.buckets (id, name, public) VALUES ('reports', 'reports', false);

CREATE POLICY "Users can upload own reports" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own reports" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own reports" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Admins podem ver todos os reports
CREATE POLICY "Admins can view all reports" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'reports' AND
    is_admin()
  );

-- ============================================
-- SECURITY NOTES
-- ============================================

/*
RLS BYPASS:
- Cloudflare Workers devem usar SUPABASE_SERVICE_ROLE_KEY para bypass de RLS
- Nunca expor service_role_key no frontend
- Frontend usa SUPABASE_ANON_KEY que respeita RLS

LGPD COMPLIANCE:
- Todas as policies garantem que usuários só acessam próprios dados
- Audit logs rastreiam todas ações sensíveis
- Função de exportação de dados usa service_role para coletar tudo do usuário
- Função de deleção (direito ao esquecimento) anonimiza dados mantendo integridade

ADMIN ACCESS:
- Admin identificado por email específico
- Function is_admin() SECURITY DEFINER garante que só admin bypassa RLS
- Audit log registra todas ações de admin
*/

-- ============================================
-- END OF MIGRATION 002
-- ============================================
