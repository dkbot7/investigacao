# 🗄️ Executar SQL no Supabase

## ⚠️ AÇÃO NECESSÁRIA

A tabela `leads` precisa ser criada no Supabase antes de usar o sistema.

## 📋 Passo a Passo

### 1. Acessar o Supabase Dashboard
- URL: https://supabase.com/dashboard/project/mbozhcioenypvxpmpbbm
- Faça login com sua conta

### 2. Abrir o SQL Editor
- No menu lateral, clique em **SQL Editor**
- Clique em **New Query**

### 3. Copiar e Colar o SQL

Abra o arquivo `supabase/migrations/create_leads_table.sql` e copie todo o conteúdo.

Ou use o SQL abaixo:

```sql
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
```

### 4. Executar
- Cole o SQL no editor
- Clique em **RUN** (ou pressione Ctrl+Enter)
- Aguarde a confirmação de sucesso

### 5. Verificar
- No menu lateral, clique em **Table Editor**
- Verifique se a tabela `leads` aparece na lista
- Clique na tabela para ver a estrutura

## ✅ Confirmação

Após executar, a tabela `leads` estará criada e pronta para uso.

O fluxo de cadastro da landing page funcionará perfeitamente.

## 🐛 Troubleshooting

### Erro: "relation already exists"
- A tabela já existe. Tudo OK!

### Erro: "permission denied"
- Verifique se você tem permissões de admin no projeto

### Erro: "syntax error"
- Verifique se copiou todo o SQL corretamente
- Tente executar seção por seção (CREATE TABLE primeiro, depois os índices)
