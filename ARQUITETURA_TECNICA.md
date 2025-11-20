# investigaree - Arquitetura Técnica
**MVP Due Diligence Forense | Janeiro 2025**

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Arquitetura de Sistema](#arquitetura-de-sistema)
4. [Banco de Dados](#banco-de-dados)
5. [Integrações de APIs](#integrações-de-apis)
6. [Segurança e Compliance](#segurança-e-compliance)
7. [SEO e Performance](#seo-e-performance)
8. [Deploy e Infraestrutura](#deploy-e-infraestrutura)

---

## 🎯 Visão Geral

### Proposta
SaaS de investigação digital e perícia forense focado em due diligence para investidores anjo.

### Produto Core
**investigaree** - Relatórios de inteligência em 72h com:
- Validação de integridade de sócios
- Checagem de litígios e processos
- Análise de reputação digital (incluindo dark social)
- Validação de métricas de tração
- Mapeamento de riscos ocultos

### Público-Alvo
Investidores anjo (42-57 anos, Classe A, Brasil)

---

## 🛠 Stack Tecnológica

### Frontend
```
Framework: React 18+ com Vite
UI Library: shadcn/ui (Radix UI + Tailwind CSS)
Linguagem: TypeScript
Estado: Zustand (gerenciamento de estado)
Forms: React Hook Form + Zod (validação)
Animações: Framer Motion
Fonte: Inter Variable Font
```

### Backend
```
Runtime: Cloudflare Workers (Node.js compatibility mode)
Linguagem: TypeScript/Node.js
Framework: Hono (web framework otimizado para Workers)
APIs: RESTful com validação Zod
Rate Limiting: Cloudflare native
```

### Banco de Dados
```
Principal: Supabase (PostgreSQL)
Cache: Cloudflare KV (key-value store)
Arquivos: Supabase Storage (relatórios PDF)
Real-time: Supabase Realtime (notificações)
```

### Autenticação
```
Provider: Firebase Authentication
Integration: Supabase Third-Party Auth
MFA: Firebase Phone Auth (SMS)
Session: JWT + Refresh Token
```

### Pagamentos
```
Gateway: Stripe
Produtos: Subscription + One-time payments
Webhooks: Cloudflare Workers endpoint
Compliance: PCI DSS via Stripe
```

### Email
```
Provider: Gmail API (OAuth2)
Templates: React Email
Queue: Cloudflare Queues
Tracking: Custom pixel tracking
```

### IA/ML
```
LLM: OpenAI GPT-4
Chatbot: OpenAI Assistants API
Embeddings: text-embedding-3-small
Vector Search: Supabase pgvector extension
```

---

## 🏗 Arquitetura de Sistema

### Diagrama de Alto Nível
```
┌─────────────────────────────────────────────────────────┐
│                   CLOUDFLARE CDN                        │
│  (DDoS Protection, WAF, Rate Limiting, SSL/TLS)        │
└─────────────────┬───────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────┐
│            CLOUDFLARE WORKERS (Edge Runtime)            │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Frontend  │  │   API Layer  │  │  Webhooks     │  │
│  │  (React)    │  │   (Hono)     │  │  (Stripe)     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└─────┬─────────────────┬─────────────────┬──────────────┘
      │                 │                 │
      │                 │                 │
┌─────▼─────┐  ┌───────▼────────┐  ┌────▼─────────────┐
│ Firebase  │  │   Supabase     │  │  External APIs   │
│   Auth    │  │  (PostgreSQL)  │  │ ┌──────────────┐ │
│           │  │  + Storage     │  │ │ Google API   │ │
│ (Users)   │  │  + Realtime    │  │ │ API Brasil   │ │
└───────────┘  │  + pgvector    │  │ │ DeHashed     │ │
               └────────────────┘  │ │ OpenAI       │ │
                                   │ │ Stripe       │ │
                                   │ └──────────────┘ │
                                   └──────────────────┘
```

### Fluxo de Dados

#### 1. Captação de Lead (Landing Page)
```
User → Landing Page → Formulário Multi-etapas
     → Cloudflare Worker (validação)
     → Supabase (insert lead)
     → Email Notification (Gmail API)
     → Chatbot IA (OpenAI)
```

#### 2. Geração de Relatório
```
Lead completo → Worker trigger
            → API Orchestration Layer
            → Parallel API calls:
                ├─ Google Custom Search (OSINT)
                ├─ API Brasil (CNPJ data)
                ├─ DeHashed (breach check)
                └─ OpenAI (análise + classificação)
            → Consolidação de dados
            → Geração de PDF (Puppeteer/Cloudflare Browser)
            → Upload Supabase Storage
            → Notificação ao cliente
```

#### 3. Pagamento
```
User → Checkout (Stripe Embedded)
     → Payment Intent
     → Webhook → Worker validation
     → Update Supabase (payment_status)
     → Trigger report generation
     → Email confirmation
```

---

## 🗄 Banco de Dados (Supabase/PostgreSQL)

### Schema Principal

```sql
-- ============================================
-- TABELA: leads
-- Captação inicial de potenciais clientes
-- ============================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp VARCHAR(20) UNIQUE NOT NULL,
  nome_empresa VARCHAR(255),
  cnpj VARCHAR(18),
  cpf_socio VARCHAR(14),
  nome_socio VARCHAR(255),
  email VARCHAR(255),
  fonte_captacao VARCHAR(50), -- 'landing', 'chatbot', 'email-cold'
  status VARCHAR(20) DEFAULT 'novo', -- 'novo', 'qualificado', 'convertido', 'perdido'
  submit_count INTEGER DEFAULT 1,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_leads_whatsapp ON leads(whatsapp);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- ============================================
-- TABELA: users
-- Usuários autenticados (investidores)
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  firebase_uid VARCHAR(128) UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nome_completo VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  telefone VARCHAR(20),
  empresa VARCHAR(255),
  cargo VARCHAR(100),

  -- Perfil de investidor
  ticket_medio_investimento DECIMAL(12,2),
  setores_interesse TEXT[], -- array de setores

  -- Assinatura e pagamento
  stripe_customer_id VARCHAR(255) UNIQUE,
  subscription_status VARCHAR(20), -- 'active', 'cancelled', 'trial'
  subscription_plan VARCHAR(50), -- 'basic', 'pro', 'enterprise'

  -- LGPD
  aceite_termos BOOLEAN DEFAULT false,
  aceite_privacidade BOOLEAN DEFAULT false,
  aceite_lgpd BOOLEAN DEFAULT false,
  data_aceite_lgpd TIMESTAMP,

  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase ON users(firebase_uid);

-- ============================================
-- TABELA: reports
-- Relatórios de due diligence gerados
-- ============================================
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  lead_id UUID REFERENCES leads(id),

  -- Dados da startup analisada
  startup_nome VARCHAR(255) NOT NULL,
  startup_cnpj VARCHAR(18),
  startup_setor VARCHAR(100),

  -- Status do relatório
  status VARCHAR(20) DEFAULT 'pendente', -- 'pendente', 'processando', 'concluido', 'erro'
  recomendacao VARCHAR(20), -- 'go', 'no-go', 'go-com-condicoes'

  -- Conteúdo
  sumario_executivo TEXT,
  principais_achados JSONB, -- array de findings
  red_flags JSONB,
  yellow_flags JSONB,

  -- Dados coletados (JSONB para flexibilidade)
  dados_cnpj JSONB,
  dados_socios JSONB,
  dados_litigios JSONB,
  dados_reputacao JSONB,
  dados_metricas JSONB,
  dados_competitivos JSONB,

  -- Arquivos
  pdf_url TEXT,
  anexos_urls JSONB,

  -- SLA e métricas
  prazo_entrega TIMESTAMP, -- 72h padrão
  data_inicio_processamento TIMESTAMP,
  data_conclusao TIMESTAMP,

  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- ============================================
-- TABELA: payments
-- Registro de pagamentos Stripe
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  report_id UUID REFERENCES reports(id),

  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255),

  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'BRL',
  status VARCHAR(20) NOT NULL, -- 'pending', 'succeeded', 'failed', 'refunded'
  payment_method VARCHAR(50), -- 'card', 'boleto', 'pix'

  -- Metadata
  produto VARCHAR(100), -- 'relatorio-startup', 'assinatura-pro'
  descricao TEXT,
  metadata JSONB,

  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_stripe_intent ON payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_status ON payments(status);

-- ============================================
-- TABELA: api_logs
-- Rastreamento de uso de APIs externas
-- ============================================
CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES reports(id),

  api_name VARCHAR(50) NOT NULL, -- 'google', 'api-brasil', 'dehashed', 'openai'
  endpoint VARCHAR(255),
  method VARCHAR(10),

  -- Request
  request_payload JSONB,
  request_headers JSONB,

  -- Response
  response_status INTEGER,
  response_body JSONB,
  response_time_ms INTEGER,

  -- Custos
  api_cost DECIMAL(8,4), -- custo em USD

  -- Erro
  error_message TEXT,

  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_api_logs_report ON api_logs(report_id);
CREATE INDEX idx_api_logs_api_name ON api_logs(api_name);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at DESC);

-- ============================================
-- TABELA: chatbot_conversations
-- Histórico de conversas com IA
-- ============================================
CREATE TABLE chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  user_id UUID REFERENCES users(id),

  openai_thread_id VARCHAR(255),
  status VARCHAR(20) DEFAULT 'ativa', -- 'ativa', 'encerrada', 'transferida'

  -- Mensagens (array de objetos)
  messages JSONB DEFAULT '[]'::jsonb,

  -- Análise de intenção
  intencao_detectada VARCHAR(50), -- 'interesse', 'duvida', 'objecao', 'pronto-comprar'
  sentiment VARCHAR(20), -- 'positivo', 'neutro', 'negativo'

  -- Conversão
  converteu BOOLEAN DEFAULT false,
  report_gerado_id UUID REFERENCES reports(id),

  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_chatbot_lead ON chatbot_conversations(lead_id);
CREATE INDEX idx_chatbot_openai_thread ON chatbot_conversations(openai_thread_id);

-- ============================================
-- TABELA: email_tracking
-- Tracking de emails enviados
-- ============================================
CREATE TABLE email_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  lead_id UUID REFERENCES leads(id),

  email_to VARCHAR(255) NOT NULL,
  email_subject VARCHAR(255),
  email_type VARCHAR(50), -- 'cold-email', 'follow-up', 'relatorio-pronto', 'pagamento'

  -- Tracking
  enviado BOOLEAN DEFAULT false,
  data_envio TIMESTAMP,
  aberto BOOLEAN DEFAULT false,
  data_abertura TIMESTAMP,
  clicado BOOLEAN DEFAULT false,
  data_clique TIMESTAMP,

  -- Conteúdo
  email_body TEXT,
  template_usado VARCHAR(100),

  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_email_tracking_user ON email_tracking(user_id);
CREATE INDEX idx_email_tracking_lead ON email_tracking(lead_id);
CREATE INDEX idx_email_tracking_type ON email_tracking(email_type);

-- ============================================
-- TABELA: lgpd_consents
-- Gestão de consentimentos LGPD
-- ============================================
CREATE TABLE lgpd_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),

  tipo_consentimento VARCHAR(100) NOT NULL, -- 'termos-uso', 'privacidade', 'marketing', 'compartilhamento-dados'
  consentimento_dado BOOLEAN NOT NULL,

  -- Rastreabilidade
  ip_address INET,
  user_agent TEXT,
  consentimento_texto TEXT, -- versão do termo aceito
  versao_termo VARCHAR(20),

  -- Revogação
  revogado BOOLEAN DEFAULT false,
  data_revogacao TIMESTAMP,
  motivo_revogacao TEXT,

  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_lgpd_user ON lgpd_consents(user_id);
CREATE INDEX idx_lgpd_tipo ON lgpd_consents(tipo_consentimento);
```

### Row Level Security (RLS)

```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE lgpd_consents ENABLE ROW LEVEL SECURITY;

-- Políticas RLS

-- Users: usuário só vê próprios dados
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Reports: usuário só vê próprios relatórios
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);

-- Payments: usuário só vê próprios pagamentos
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Admin pode ver tudo (para dashboard interno)
CREATE POLICY "Admin can view all" ON reports
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE users.id = auth.uid() AND users.email = 'contato@investigaree.com.br'
    )
  );
```

---

## 🔌 Integrações de APIs

### 1. Google Custom Search API
**Propósito:** OSINT - buscar informações públicas sobre sócios e empresas

```typescript
// config/apis.ts
export const GOOGLE_SEARCH_CONFIG = {
  apiKey: process.env.GOOGLE_API_KEY,
  searchEngineId: process.env.GOOGLE_CSE_ID,
  endpoint: 'https://www.googleapis.com/customsearch/v1',
  rateLimit: 100, // queries/dia no free tier
}

// services/google-search.service.ts
async function searchWithDorks(query: string, options?: SearchOptions) {
  const params = new URLSearchParams({
    key: GOOGLE_SEARCH_CONFIG.apiKey,
    cx: GOOGLE_SEARCH_CONFIG.searchEngineId,
    q: query,
    lr: 'lang_pt', // português
    cr: 'countryBR', // Brasil
    num: '10',
    ...options
  })

  const response = await fetch(`${GOOGLE_SEARCH_CONFIG.endpoint}?${params}`)
  return response.json()
}

// Exemplos de queries
const dorks = [
  `"${nomeSocio}" AND ("processo" OR "condenado" OR "réu")`,
  `"${cnpj}" AND filetype:pdf`,
  `site:jusbrasil.com.br "${nomeSocio}"`,
  `"${nomeEmpresa}" AND ("fraude" OR "golpe" OR "reclamação")`
]
```

### 2. API Brasil (CNPJ)
**Propósito:** Dados oficiais da Receita Federal

```typescript
// config/apis.ts
export const API_BRASIL_CONFIG = {
  bearerToken: process.env.API_BRASIL_BEARER_TOKEN,
  deviceToken: process.env.API_BRASIL_DEVICE_TOKEN,
  endpoint: 'https://api.apibrasil.com.br',
}

// services/cnpj.service.ts
async function getCNPJData(cnpj: string) {
  const response = await fetch(`${API_BRASIL_CONFIG.endpoint}/cnpj/${cnpj}`, {
    headers: {
      'Authorization': `Bearer ${API_BRASIL_CONFIG.bearerToken}`,
      'DeviceToken': API_BRASIL_CONFIG.deviceToken,
    }
  })

  const data = await response.json()

  return {
    razaoSocial: data.nome,
    nomeFantasia: data.fantasia,
    cnpj: data.cnpj,
    situacao: data.situacao,
    dataAbertura: data.abertura,
    capitalSocial: data.capital_social,
    atividadePrincipal: data.atividade_principal,
    socios: data.qsa?.map(s => ({
      nome: s.nome,
      qualificacao: s.qual,
      dataEntrada: s.entrada,
    })),
    endereco: {
      logradouro: data.logradouro,
      numero: data.numero,
      bairro: data.bairro,
      cidade: data.municipio,
      uf: data.uf,
      cep: data.cep,
    }
  }
}
```

### 3. DeHashed API (Vazamentos)
**Propósito:** Checar se CPF/CNPJ/emails aparecem em data breaches

```typescript
// config/apis.ts
export const DEHASHED_CONFIG = {
  email: process.env.DEHASHED_EMAIL,
  apiKey: process.env.DEHASHED_API_KEY,
  endpoint: 'https://api.dehashed.com/search',
}

// services/breach-check.service.ts
async function checkBreaches(identifier: string, type: 'email' | 'username' | 'phone') {
  const credentials = Buffer.from(
    `${DEHASHED_CONFIG.email}:${DEHASHED_CONFIG.apiKey}`
  ).toString('base64')

  const params = new URLSearchParams({ query: `${type}:${identifier}` })

  const response = await fetch(`${DEHASHED_CONFIG.endpoint}?${params}`, {
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Accept': 'application/json'
    }
  })

  const data = await response.json()

  return {
    found: data.total > 0,
    totalEntries: data.total,
    breaches: data.entries?.map(entry => ({
      database: entry.database_name,
      email: entry.email,
      username: entry.username,
      password: entry.password ? '[REDACTED]' : null, // não expor senhas
      leaked_data: Object.keys(entry).filter(k => entry[k])
    }))
  }
}
```

### 4. OpenAI API (Análise Inteligente)
**Propósito:** Classificar riscos, analisar conteúdo, chatbot

```typescript
// config/apis.ts
export const OPENAI_CONFIG = {
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview',
  embeddingModel: 'text-embedding-3-small',
}

// services/ai-analysis.service.ts
async function analyzeSearchResults(results: SearchResult[], context: ReportContext) {
  const prompt = `
Você é um especialista em due diligence forense. Analise os seguintes resultados de busca sobre a empresa "${context.startupNome}" e seus sócios.

CONTEXTO:
- Empresa: ${context.startupNome}
- CNPJ: ${context.cnpj}
- Sócios: ${context.socios.join(', ')}

RESULTADOS DA BUSCA:
${results.map((r, i) => `
${i+1}. ${r.title}
   URL: ${r.link}
   Trecho: ${r.snippet}
`).join('\n')}

TAREFA:
1. Classifique cada resultado como: RELEVANTE / IRRELEVANTE / HOMÔNIMO
2. Para resultados relevantes, identifique o tipo de risco:
   - CRÍTICO: Fraude, crime, processos graves
   - ALTO: Processos trabalhistas, dívidas, má reputação
   - MÉDIO: Reclamações isoladas, disputas comerciais
   - BAIXO: Informações neutras ou positivas

3. Forneça uma análise consolidada em JSON:
{
  "resultados": [
    {
      "index": 1,
      "relevancia": "RELEVANTE | IRRELEVANTE | HOMONIMO",
      "tipo_risco": "CRITICO | ALTO | MEDIO | BAIXO | NENHUM",
      "explicacao": "breve explicação",
      "recomendacao": "ação sugerida"
    }
  ],
  "resumo_geral": "análise consolidada",
  "recomendacao_final": "GO | NO-GO | GO_COM_CONDICOES",
  "principais_achados": ["achado 1", "achado 2"]
}
`

  const response = await openai.chat.completions.create({
    model: OPENAI_CONFIG.model,
    messages: [
      { role: 'system', content: 'Você é um especialista em due diligence e análise de risco para investimentos.' },
      { role: 'user', content: prompt }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.3, // baixa para análise objetiva
  })

  return JSON.parse(response.choices[0].message.content)
}

// Chatbot com OpenAI Assistants
async function createChatbotThread(leadId: string) {
  const assistant = await openai.beta.assistants.create({
    name: 'investigaree Sales Assistant',
    instructions: `
Você é um consultor de due diligence da investigaree. Seu objetivo é:
1. Qualificar leads investigadores anjo interessados em relatórios de inteligência
2. Explicar o valor do serviço (evitar investimentos ruins, proteger reputação)
3. Identificar urgência e perfil do investidor
4. Conduzir para agendamento de análise ou fechamento direto

Tom: Profissional, discreto, consultivo. Nunca agressivo.
Método: SPIN Selling (Situação, Problema, Implicação, Necessidade)
`,
    model: 'gpt-4-turbo-preview',
    tools: [{ type: 'code_interpreter' }]
  })

  const thread = await openai.beta.threads.create()

  // Salvar no banco
  await supabase.from('chatbot_conversations').insert({
    lead_id: leadId,
    openai_thread_id: thread.id,
    status: 'ativa'
  })

  return { assistantId: assistant.id, threadId: thread.id }
}
```

### 5. Stripe API (Pagamentos)
**Propósito:** Processar pagamentos e gerenciar assinaturas

```typescript
// config/apis.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

// services/payment.service.ts
async function createPaymentIntent(amount: number, userId: string, reportId?: string) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // centavos
    currency: 'brl',
    payment_method_types: ['card', 'boleto'],
    metadata: {
      user_id: userId,
      report_id: reportId || '',
      produto: 'relatorio-startup'
    }
  })

  return paymentIntent
}

// Webhook handler
async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent

      // Atualizar banco
      await supabase.from('payments').insert({
        user_id: paymentIntent.metadata.user_id,
        report_id: paymentIntent.metadata.report_id,
        stripe_payment_intent_id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        status: 'succeeded',
        paid_at: new Date()
      })

      // Trigger geração de relatório
      await triggerReportGeneration(paymentIntent.metadata.report_id)
      break

    case 'payment_intent.payment_failed':
      // Notificar usuário
      await sendPaymentFailedEmail(event.data.object.metadata.user_id)
      break
  }
}
```

---

## 🔒 Segurança e Compliance

### Segurança de URLs
```typescript
// Todas as URLs de relatórios são hashed e com expiração
function generateSecureReportURL(reportId: string, userId: string): string {
  const token = crypto.createHmac('sha256', process.env.URL_SECRET!)
    .update(`${reportId}:${userId}:${Date.now()}`)
    .digest('hex')

  const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 dias

  return `/relatorios/${reportId}?token=${token}&expires=${expiresAt}`
}

// Validação no Worker
async function validateReportAccess(request: Request) {
  const url = new URL(request.url)
  const reportId = url.pathname.split('/')[2]
  const token = url.searchParams.get('token')
  const expires = parseInt(url.searchParams.get('expires') || '0')

  // Check expiration
  if (Date.now() > expires) {
    throw new Error('Link expirado')
  }

  // Verificar ownership
  const { data: report } = await supabase
    .from('reports')
    .select('user_id')
    .eq('id', reportId)
    .single()

  // Validar token
  const expectedToken = crypto.createHmac('sha256', process.env.URL_SECRET!)
    .update(`${reportId}:${report.user_id}:${expires}`)
    .digest('hex')

  if (token !== expectedToken) {
    throw new Error('Token inválido')
  }

  return true
}
```

### LGPD Compliance

```typescript
// services/lgpd.service.ts

// Registro de consentimento
async function recordConsent(userId: string, consentType: string, userAgent: string, ip: string) {
  await supabase.from('lgpd_consents').insert({
    user_id: userId,
    tipo_consentimento: consentType,
    consentimento_dado: true,
    ip_address: ip,
    user_agent: userAgent,
    consentimento_texto: await getTermsVersion(consentType),
    versao_termo: '1.0',
  })
}

// Direito ao esquecimento (Art. 18, VI)
async function deleteUserData(userId: string) {
  // Anonimizar ao invés de deletar (para manter integridade referencial)
  await supabase.from('users').update({
    email: `deleted_${userId}@anonimizado.local`,
    nome_completo: '[REMOVIDO]',
    cpf: null,
    telefone: null,
    firebase_uid: null,
  }).eq('id', userId)

  // Deletar dados sensíveis
  await supabase.from('lgpd_consents').delete().eq('user_id', userId)
  await supabase.storage.from('reports').remove([`${userId}/`])

  // Log da ação
  console.log(`LGPD: Dados do usuário ${userId} removidos em ${new Date().toISOString()}`)
}

// Exportação de dados (Art. 18, II - Portabilidade)
async function exportUserData(userId: string) {
  const [user, reports, payments, conversations] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('reports').select('*').eq('user_id', userId),
    supabase.from('payments').select('*').eq('user_id', userId),
    supabase.from('chatbot_conversations').select('*').eq('user_id', userId),
  ])

  return {
    usuario: user.data,
    relatorios: reports.data,
    pagamentos: payments.data,
    conversas: conversations.data,
    data_exportacao: new Date().toISOString(),
  }
}
```

### Rate Limiting (Cloudflare)
```typescript
// middleware/rate-limit.ts
export async function rateLimitMiddleware(request: Request, env: Env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const key = `rate_limit:${ip}`

  // Cloudflare KV para contagem
  const count = await env.KV.get(key)
  const currentCount = count ? parseInt(count) : 0

  if (currentCount > 100) { // 100 requests/hora
    return new Response('Too Many Requests', { status: 429 })
  }

  await env.KV.put(key, (currentCount + 1).toString(), { expirationTtl: 3600 })

  return null // Continue
}
```

---

## 🚀 SEO e Performance

### Bing SEO (Foco em AIO)

```typescript
// public/robots.txt
User-agent: *
Allow: /
Sitemap: https://investigaree.com.br/sitemap.xml

User-agent: bingbot
Crawl-delay: 0
Allow: /

# IndexNow
IndexNow-Key: {YOUR_KEY_HERE}

// utils/indexnow.ts
async function submitToIndexNow(urls: string[]) {
  const payload = {
    host: 'investigaree.com.br',
    key: process.env.INDEXNOW_KEY,
    keyLocation: `https://investigaree.com.br/${process.env.INDEXNOW_KEY}.txt`,
    urlList: urls
  }

  await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

// Chamar sempre que criar/atualizar conteúdo
await submitToIndexNow([
  'https://investigaree.com.br',
  'https://investigaree.com.br/servicos',
  'https://investigaree.com.br/blog/ultimo-artigo'
])
```

### Meta Tags (SEO + Open Graph)
```tsx
// components/SEOHead.tsx
export function SEOHead({ page }: { page: string }) {
  const metadata = {
    home: {
      title: 'investigaree - Due Diligence Forense para Investidores Anjo',
      description: 'Relatórios de inteligência em 72h. Valide sócios, detecte riscos ocultos e invista com segurança. OSINT + IA para decisões blindadas.',
      keywords: 'due diligence, investigação digital, perícia forense, investimento anjo, OSINT, inteligência empresarial',
    },
    // ... outros páginas
  }

  return (
    <Head>
      <title>{metadata[page].title}</title>
      <meta name="description" content={metadata[page].description} />
      <meta name="keywords" content={metadata[page].keywords} />

      {/* Open Graph */}
      <meta property="og:title" content={metadata[page].title} />
      <meta property="og:description" content={metadata[page].description} />
      <meta property="og:image" content="https://investigaree.com.br/og-image.jpg" />
      <meta property="og:type" content="website" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metadata[page].title} />
      <meta name="twitter:description" content={metadata[page].description} />

      {/* Bing Verification */}
      <meta name="msvalidate.01" content="{BING_VERIFICATION_CODE}" />
    </Head>
  )
}
```

### Performance (Cloudflare Caching)
```typescript
// workers/index.ts
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)

    // Cache static assets agressivamente
    if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff2)$/)) {
      return fetch(request, {
        cf: {
          cacheTtl: 31536000, // 1 ano
          cacheEverything: true,
        }
      })
    }

    // Cache HTML pages por 1 hora
    if (url.pathname === '/' || url.pathname.startsWith('/blog')) {
      return fetch(request, {
        cf: {
          cacheTtl: 3600,
          cacheEverything: true,
        }
      })
    }

    return fetch(request)
  }
}
```

---

## 🚀 Deploy e Infraestrutura

### Estrutura de Pastas
```
investigaree/
├── src/
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── forms/           # Formulários multi-etapas
│   │   ├── chatbot/         # Widget de chatbot
│   │   └── dashboard/       # Dashboard do usuário
│   ├── pages/               # Páginas React
│   │   ├── landing.tsx
│   │   ├── dashboard.tsx
│   │   └── relatorio/[id].tsx
│   ├── lib/                 # Utilitários
│   │   ├── supabase.ts
│   │   ├── firebase.ts
│   │   └── stripe.ts
│   ├── styles/              # CSS/Tailwind
│   └── types/               # TypeScript types
├── workers/
│   ├── api/                 # API routes
│   │   ├── leads.ts
│   │   ├── reports.ts
│   │   └── webhooks.ts
│   ├── cron/                # Scheduled jobs
│   │   └── process-reports.ts
│   └── index.ts             # Worker entry point
├── database/
│   ├── migrations/          # SQL migrations
│   └── seeds/               # Dados de teste
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── {indexnow-key}.txt
├── .env.example
├── wrangler.toml            # Cloudflare config
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

### Wrangler Configuration
```toml
# wrangler.toml
name = "investigaree"
main = "workers/index.ts"
compatibility_date = "2025-04-01"
compatibility_flags = ["nodejs_compat"]

[vars]
ENVIRONMENT = "production"

[[kv_namespaces]]
binding = "KV"
id = "YOUR_KV_ID"

[[d1_databases]]
binding = "DB"
database_name = "investigaree-db"
database_id = "YOUR_D1_ID"

[site]
bucket = "./dist"

[[routes]]
pattern = "investigaree.com.br/*"
zone_name = "investigaree.com.br"

[build]
command = "npm run build"
```

### GitHub Actions (CI/CD)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          VITE_FIREBASE_CONFIG: ${{ secrets.FIREBASE_CONFIG }}

      - name: Deploy to Cloudflare Workers
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

---

## 📚 Próximos Passos

1. ✅ Criar repositório GitHub `dkbot7/investigaree`
2. ✅ Configurar Supabase project
3. ✅ Configurar Firebase project
4. ✅ Configurar Cloudflare Workers
5. ✅ Implementar landing page + formulário
6. ✅ Implementar integrações de APIs
7. ✅ Implementar geração de relatórios
8. ✅ Implementar chatbot IA
9. ✅ Configurar Stripe + webhooks
10. ✅ Deploy MVP

---

**Arquitetura preparada para escala, segurança e compliance LGPD**
*investigaree - Due Diligence que protege capital e reputação*
