-- ============================================
-- TABELA LEADS - CADASTRO LANDING PAGE
-- ============================================

-- Criar tabela leads
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text NOT NULL,
  name text,
  email text NOT NULL,
  phone text,
  origin text DEFAULT 'landing_page',
  created_at timestamp DEFAULT now(),
  consent boolean DEFAULT true
);

-- Ativar RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy: Permitir inserção apenas via backend (service role)
CREATE POLICY "Service role can insert leads"
  ON leads
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Negar leitura pública
CREATE POLICY "No public read access"
  ON leads
  FOR SELECT
  TO anon
  USING (false);

-- Policy: Service role pode ler tudo
CREATE POLICY "Service role can read all leads"
  ON leads
  FOR SELECT
  TO service_role
  USING (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_leads_firebase_uid ON leads(firebase_uid);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Comentários
COMMENT ON TABLE leads IS 'Leads capturados via landing page';
COMMENT ON COLUMN leads.firebase_uid IS 'UID do usuário criado no Firebase Auth';
COMMENT ON COLUMN leads.consent IS 'Aceite dos termos LGPD';
COMMENT ON COLUMN leads.origin IS 'Origem do lead (landing_page, etc)';
