# 🔍 investigaree - Due Diligence Forense para Investidores Anjo

**MVP de SaaS de Investigação Digital e Perícia Forense**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![LGPD Compliant](https://img.shields.io/badge/LGPD-Compliant-success.svg)](https://www.gov.br/esporte/pt-br/acesso-a-informacao/lgpd)

---

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Deploy](#deploy)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [API Documentation](#api-documentation)
- [Segurança e Compliance](#segurança-e-compliance)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Visão Geral

investigaree é uma plataforma SaaS especializada em **due diligence forense** para investidores anjo. Combinando **OSINT** (Open Source Intelligence), **IA** e **perícia digital**, o sistema gera relatórios completos em **72 horas** com:

✅ Validação de integridade de sócios
✅ Checagem de litígios e processos
✅ Análise de reputação digital (incluindo dark social)
✅ Validação de métricas de tração
✅ Mapeamento de riscos ocultos
✅ Score de integridade automatizado

### 🎯 Público-Alvo
- **Investidores anjo** (42-57 anos, Classe A)
- **Family offices**
- **Fundos seed**
- **Aceleradoras**

### 💰 Modelo de Negócio
- **One-time payment**: Relatório avulso (R$ 8.000 - R$ 15.000)
- **Subscription**: Planos mensais com desconto por volume
- **Enterprise**: Licenciamento para aceleradoras/fundos

---

## 🏗 Arquitetura

### Diagrama Simplificado
```
┌─────────────────────────────────────────┐
│      Cloudflare CDN + WAF + DDoS        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│     Cloudflare Workers (Edge)           │
│  ┌──────────┐  ┌──────────┐            │
│  │ Frontend │  │ API      │            │
│  │ (React)  │  │ (Hono)   │            │
│  └──────────┘  └──────────┘            │
└─────┬──────────────┬──────────────┬────┘
      │              │              │
┌─────▼─────┐  ┌────▼────────┐  ┌──▼─────────┐
│ Firebase  │  │  Supabase   │  │ External   │
│   Auth    │  │  (Postgres) │  │ APIs       │
└───────────┘  └─────────────┘  └────────────┘
```

### Stack Técnica
- **Frontend**: React 18 + Vite + TypeScript + shadcn/ui + Tailwind
- **Backend**: Cloudflare Workers + Hono Framework
- **Database**: Supabase (PostgreSQL + pgvector)
- **Auth**: Firebase Authentication (integrado com Supabase)
- **Payments**: Stripe (Cards + Boleto + Pix)
- **Email**: Gmail API com OAuth2
- **AI/ML**: OpenAI GPT-4 + Assistants API
- **Storage**: Supabase Storage (PDFs com criptografia)
- **Cache**: Cloudflare KV

---

## 🛠 Tecnologias

### Frontend
```json
{
  "react": "^18.2.0",
  "vite": "^5.0.0",
  "typescript": "^5.3.0",
  "@radix-ui/react-*": "latest",
  "tailwindcss": "^3.4.0",
  "shadcn-ui": "latest",
  "framer-motion": "^11.0.0",
  "zustand": "^4.5.0",
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.0"
}
```

### Backend / Workers
```json
{
  "hono": "^4.0.0",
  "@hono/node-server": "^1.6.0",
  "wrangler": "^3.25.0",
  "@supabase/supabase-js": "^2.39.0",
  "firebase-admin": "^12.0.0",
  "stripe": "^14.13.0",
  "openai": "^4.24.0",
  "googleapis": "^133.0.0"
}
```

### DevTools
```json
{
  "prettier": "^3.2.0",
  "eslint": "^8.56.0",
  "@typescript-eslint/eslint-plugin": "^6.19.0",
  "husky": "^9.0.0",
  "lint-staged": "^15.2.0"
}
```

---

## 📋 Pré-requisitos

### Contas e APIs Necessárias

1. **Node.js 20+** instalado
   ```bash
   node --version  # deve retornar v20.x.x ou superior
   ```

2. **Cloudflare Account** (Free tier funciona)
   - Criar conta em [cloudflare.com](https://cloudflare.com)
   - Obter API Token com permissões Workers

3. **Supabase Project**
   - Criar projeto em [supabase.com](https://supabase.com)
   - Anotar: `SUPABASE_URL` e `SUPABASE_ANON_KEY`
   - Obter `SUPABASE_SERVICE_ROLE_KEY` (para Workers)

4. **Firebase Project**
   - Criar projeto em [console.firebase.google.com](https://console.firebase.google.com)
   - Ativar Authentication (Email/Password + Phone)
   - Gerar Service Account JSON (para admin SDK)
   - Anotar `FIREBASE_WEB_CONFIG` (para frontend)

5. **Google Cloud Project**
   - Habilitar APIs:
     - Custom Search API
     - Gmail API
   - Criar API Key
   - Criar OAuth 2.0 Client (para Gmail)
   - Criar Custom Search Engine em [programmablesearchengine.google.com](https://programmablesearchengine.google.com)

6. **API Brasil**
   - Cadastrar em [apibrasil.com.br](https://apibrasil.com.br)
   - Obter Bearer Token e Device Token

7. **DeHashed Account**
   - Cadastrar em [dehashed.com](https://dehashed.com)
   - Adquirir plano API
   - Obter API Key

8. **OpenAI Account**
   - Criar conta em [platform.openai.com](https://platform.openai.com)
   - Adicionar créditos (mínimo $10)
   - Gerar API Key

9. **Stripe Account**
   - Criar conta em [stripe.com](https://stripe.com)
   - Configurar para Brasil (BRL)
   - Obter `STRIPE_SECRET_KEY` e `STRIPE_PUBLISHABLE_KEY`
   - Configurar Webhook Endpoint

10. **GitHub Account** (para repositório)
    - Criar repositório `dkbot7/investigaree`

---

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/dkbot7/investigaree.git
cd investigaree
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure variáveis de ambiente

Copie o arquivo exemplo:
```bash
cp .env.example .env
```

Edite `.env` com suas credenciais (ver seção [Configuração](#configuração))

### 4. Configure o banco de dados

Execute as migrations no Supabase:
```bash
# Acesse Supabase Dashboard > SQL Editor
# Execute os scripts na ordem:
# 1. database/001_initial_schema.sql
# 2. database/002_rls_policies.sql
```

Ou via CLI:
```bash
npx supabase db push
```

### 5. Inicie o ambiente de desenvolvimento
```bash
npm run dev
```

Acesse `http://localhost:5173`

---

## ⚙️ Configuração

### Arquivo `.env`

```bash
# ============================================
# SUPABASE
# ============================================
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ... # NÃO EXPOR NO FRONTEND

# ============================================
# FIREBASE
# ============================================
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin SDK (para Workers)
FIREBASE_ADMIN_CREDENTIALS='{"type":"service_account",...}'

# ============================================
# GOOGLE APIS
# ============================================
GOOGLE_API_KEY=AIza...
GOOGLE_CSE_ID=0123456789abcdef

# Gmail API OAuth2
GOOGLE_CLIENT_ID=123...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REDIRECT_URI=https://investigaree.com.br/auth/google/callback
GOOGLE_REFRESH_TOKEN=1//0g...

# ============================================
# API BRASIL
# ============================================
API_BRASIL_BEARER_TOKEN=seu_bearer_token
API_BRASIL_DEVICE_TOKEN=seu_device_token

# ============================================
# DEHASHED
# ============================================
DEHASHED_EMAIL=seu@email.com
DEHASHED_API_KEY=sua_api_key

# ============================================
# OPENAI
# ============================================
OPENAI_API_KEY=sk-proj-...
OPENAI_ORGANIZATION=org-...

# ============================================
# STRIPE
# ============================================
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ============================================
# CLOUDFLARE
# ============================================
CLOUDFLARE_ACCOUNT_ID=abcdef123456
CLOUDFLARE_API_TOKEN=seu_token_workers
CLOUDFLARE_ZONE_ID=123456789abcdef (do domínio)

# ============================================
# APPLICATION
# ============================================
VITE_APP_URL=https://investigaree.com.br
VITE_API_URL=https://api.investigaree.com.br

# Segurança
URL_SECRET=chave-super-secreta-para-hashs-256-bits
JWT_SECRET=chave-super-secreta-jwt-256-bits

# IndexNow (Bing SEO)
INDEXNOW_KEY=abc123def456...

# ============================================
# LGPD / DPO
# ============================================
DPO_EMAIL=contato@investigaree.com.br
DPO_PHONE=47992611117

# ============================================
# ENVIRONMENT
# ============================================
NODE_ENV=development # production | development
```

### Configuração do Cloudflare Workers

Edite `wrangler.toml`:
```toml
name = "investigaree"
main = "workers/index.ts"
compatibility_date = "2025-04-01"
compatibility_flags = ["nodejs_compat"]

[env.production]
name = "investigaree-prod"
vars = { ENVIRONMENT = "production" }

[[kv_namespaces]]
binding = "KV"
id = "SEU_KV_NAMESPACE_ID"

[site]
bucket = "./dist"

[[routes]]
pattern = "investigaree.com.br/*"
zone_name = "investigaree.com.br"

[build]
command = "npm run build"
upload.format = "service-worker"
```

### Configuração do Tailwind CSS

Arquivo `tailwind.config.js` já configurado com Design System:
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#052340',
          800: '#063158',
          700: '#084070',
          600: '#0A4D8C', // base
          500: '#0D5BA0',
          400: '#2B7BC5',
          300: '#5FA3D9',
          200: '#9FCBED',
          100: '#D4E8F7',
          50: '#EBF5FC',
        },
        neutral: {
          950: '#0A0F1C',
          900: '#1A2332',
          800: '#2D3748',
          700: '#4A5568',
          600: '#718096',
          500: '#A0AEC0',
          400: '#CBD5E0',
          300: '#E2E8F0',
          200: '#EDF2F7',
          100: '#F7FAFC',
          50: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

---

## 🚢 Deploy

### Deploy Cloudflare Workers (Backend + Frontend)

1. **Autenticar na Cloudflare**
```bash
npx wrangler login
```

2. **Build do projeto**
```bash
npm run build
```

3. **Deploy**
```bash
npx wrangler deploy
```

4. **Verificar**
```bash
npx wrangler tail # ver logs em tempo real
```

### Configurar Domínio Personalizado

No Cloudflare Dashboard:
1. Workers & Pages > investigaree > Settings > Triggers
2. Adicionar Custom Domain: `investigaree.com.br`
3. Adicionar Route: `investigaree.com.br/*`

### Configurar Secrets (Variáveis Sensíveis)

```bash
# Adicionar secrets individualmente
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put DEHASHED_API_KEY
# ... e assim por diante

# Ou usar arquivo (NÃO COMMITAR .env no git)
npx wrangler secret bulk .env
```

### CI/CD via GitHub Actions

Arquivo `.github/workflows/deploy.yml` já está configurado.

Para ativar:
1. No GitHub, vá em Settings > Secrets and variables > Actions
2. Adicione:
   - `CLOUDFLARE_API_TOKEN`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `FIREBASE_CONFIG` (JSON completo)
   - Demais secrets necessários

A cada push na branch `main`, o deploy será automático.

---

## 📁 Estrutura do Projeto

```
investigaree/
├── src/                              # Frontend React
│   ├── components/                   # Componentes React
│   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── forms/                    # Formulários
│   │   │   ├── LeadCaptureForm.tsx  # Multi-step form
│   │   │   └── CheckoutForm.tsx
│   │   ├── chatbot/                  # Chatbot IA
│   │   │   ├── ChatWidget.tsx
│   │   │   └── ChatMessage.tsx
│   │   ├── dashboard/                # Dashboard do usuário
│   │   │   ├── ReportList.tsx
│   │   │   └── ReportDetails.tsx
│   │   └── layout/                   # Layouts
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Sidebar.tsx
│   ├── pages/                        # Páginas principais
│   │   ├── Home.tsx                  # Landing page
│   │   ├── Dashboard.tsx             # Dashboard do investidor
│   │   ├── ReportView.tsx            # Visualização de relatório
│   │   ├── Checkout.tsx              # Página de pagamento
│   │   └── Auth.tsx                  # Login/Registro
│   ├── lib/                          # Bibliotecas e utilitários
│   │   ├── supabase.ts               # Cliente Supabase
│   │   ├── firebase.ts               # Firebase auth
│   │   ├── stripe.ts                 # Stripe checkout
│   │   └── utils.ts                  # Helpers gerais
│   ├── hooks/                        # React hooks customizados
│   │   ├── useAuth.ts
│   │   ├── useReports.ts
│   │   └── useChatbot.ts
│   ├── styles/                       # Estilos globais
│   │   └── globals.css
│   ├── types/                        # TypeScript types
│   │   ├── database.ts
│   │   └── api.ts
│   ├── App.tsx                       # App principal
│   └── main.tsx                      # Entry point
│
├── workers/                          # Cloudflare Workers (Backend)
│   ├── api/                          # Rotas de API
│   │   ├── leads.ts                  # POST /api/leads
│   │   ├── reports.ts                # GET/POST /api/reports
│   │   ├── payments.ts               # POST /api/payments
│   │   └── webhooks.ts               # POST /api/webhooks/*
│   ├── services/                     # Lógica de negócio
│   │   ├── google-search.service.ts
│   │   ├── cnpj.service.ts
│   │   ├── breach-check.service.ts
│   │   ├── ai-analysis.service.ts
│   │   ├── pdf-generator.service.ts
│   │   └── email.service.ts
│   ├── cron/                         # Scheduled jobs
│   │   └── process-reports.ts        # Processar relatórios pendentes
│   ├── middleware/                   # Middlewares
│   │   ├── auth.ts                   # Validação JWT
│   │   ├── rate-limit.ts             # Rate limiting
│   │   └── cors.ts                   # CORS headers
│   ├── utils/                        # Utilitários backend
│   │   ├── lgpd.ts                   # Funções LGPD
│   │   └── crypto.ts                 # Hashing/Encryption
│   └── index.ts                      # Worker entry point
│
├── database/                         # Scripts de banco de dados
│   ├── 001_initial_schema.sql        # Schema inicial
│   ├── 002_rls_policies.sql          # Row Level Security
│   ├── 003_functions.sql             # Functions auxiliares
│   └── seeds/                        # Dados de teste
│       └── test_data.sql
│
├── public/                           # Assets públicos
│   ├── robots.txt                    # SEO
│   ├── sitemap.xml                   # Sitemap
│   ├── {indexnow-key}.txt            # Chave IndexNow
│   ├── logo.svg
│   └── og-image.jpg                  # Open Graph image
│
├── docs/                             # Documentação
│   ├── DESIGN_SYSTEM.md              # Design system
│   ├── ARQUITETURA_TECNICA.md        # Arquitetura completa
│   ├── API.md                        # Documentação de API
│   └── LGPD_COMPLIANCE.md            # Guia de compliance
│
├── .github/                          # GitHub config
│   └── workflows/
│       └── deploy.yml                # CI/CD
│
├── .env.example                      # Template de variáveis
├── .gitignore
├── .prettierrc
├── .eslintrc.json
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── wrangler.toml                     # Config Cloudflare Workers
└── README.md                         # Este arquivo
```

---

## ✨ Funcionalidades

### 🎯 Para o Investidor

#### 1. Captação de Lead (Landing Page)
- Formulário multi-etapas (um campo por vez)
- Validação em tempo real
- Detecção de duplicidade por WhatsApp
- UTM tracking automático
- Cookie de sessão para retorno

#### 2. Chatbot IA de Vendas
- Powered by OpenAI GPT-4 Assistants
- Qualificação automática via SPIN Selling
- Análise de sentimento e intenção
- Lead scoring dinâmico
- Handoff para humano quando necessário

#### 3. Autenticação Segura
- Firebase Authentication (Email + Phone MFA)
- OAuth Google/Microsoft (futuro)
- JWT com refresh token
- Session management via Supabase

#### 4. Dashboard do Investidor
- Lista de relatórios (histórico)
- Status em tempo real (pendente → processando → concluído)
- Download seguro de PDFs
- Exportação de dados (LGPD compliance)

#### 5. Visualização de Relatório
- Sumário executivo interativo
- Score de integridade (0-100)
- Red/Yellow/Green flags
- Timeline forense
- Dados estruturados por seção:
  - Perfil dos sócios
  - Histórico societário
  - Litígios e processos
  - Reputação online (+ dark social)
  - Validação de métricas
  - Análise competitiva
- Exportar PDF com senha

#### 6. Pagamento (Stripe)
- Checkout embedded
- Métodos: Cartão, Boleto, Pix
- Planos avulsos e recorrentes
- Webhook para confirmação automática
- Nota fiscal (via integração futura)

---

### 🔧 Para o Admin (Interno)

#### Admin Dashboard
- Visão geral de métricas:
  - Leads captados
  - Taxa de conversão
  - Relatórios gerados
  - Receita (MRR/ARR)
- Gerenciamento de leads
- Gerenciamento de relatórios (pausar/retomar)
- Logs de API (custos)
- Audit logs (LGPD)

#### Geração de Relatórios (Workflow Automatizado)
1. **Trigger**: Pagamento confirmado → cria job
2. **Coleta de Dados** (paralela):
   - Google Custom Search (OSINT)
   - API Brasil (CNPJ + Sócios)
   - DeHashed (Data breaches)
3. **Análise com IA** (OpenAI):
   - Classificação de riscos
   - Resumo executivo
   - Recomendação (Go/No-Go)
4. **Consolidação**:
   - Score de integridade
   - Flags (red/yellow/green)
5. **Geração de PDF**:
   - Template profissional
   - Senha única
   - Upload para Supabase Storage
6. **Notificação**:
   - Email ao investidor
   - Push notification (futuro)

---

## 📡 API Documentation

### Endpoints Principais

#### `POST /api/leads`
Cadastrar novo lead (landing page)

**Request:**
```json
{
  "whatsapp": "+5547992611117",
  "nome_empresa": "TechStartup Inc",
  "cnpj": "12.345.678/0001-90",
  "cpf_socio": "123.456.789-00",
  "nome_socio": "João Silva",
  "email": "joao@techstartup.com",
  "utm_source": "google",
  "utm_medium": "cpc",
  "utm_campaign": "investidores-anjo-2025"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "lead_id": "uuid-123-456",
  "message": "Lead cadastrado com sucesso"
}
```

---

#### `GET /api/reports`
Listar relatórios do usuário autenticado

**Headers:**
```
Authorization: Bearer {firebase_token}
```

**Response:** `200 OK`
```json
{
  "reports": [
    {
      "id": "uuid",
      "startup_nome": "TechStartup Inc",
      "status": "concluido",
      "recomendacao": "go-com-condicoes",
      "score_integridade": 78,
      "created_at": "2025-01-20T10:00:00Z",
      "pdf_url": "/relatorios/uuid?token=..."
    }
  ]
}
```

---

#### `GET /api/reports/:id`
Visualizar relatório específico

**Headers:**
```
Authorization: Bearer {firebase_token}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "startup_nome": "TechStartup Inc",
  "sumario_executivo": "...",
  "recomendacao": "go-com-condicoes",
  "score_integridade": 78,
  "red_flags": [...],
  "yellow_flags": [...],
  "dados_cnpj": {...},
  "dados_socios": {...},
  "pdf_url": "/secure/..."
}
```

---

#### `POST /api/payments`
Criar intenção de pagamento

**Headers:**
```
Authorization: Bearer {firebase_token}
```

**Request:**
```json
{
  "produto": "relatorio-startup",
  "startup_nome": "TechStartup Inc",
  "startup_cnpj": "12.345.678/0001-90"
}
```

**Response:** `200 OK`
```json
{
  "payment_intent_id": "pi_123",
  "client_secret": "pi_123_secret",
  "amount": 10000, // centavos
  "currency": "brl"
}
```

---

#### `POST /api/webhooks/stripe`
Webhook do Stripe (processamento de pagamentos)

**Headers:**
```
Stripe-Signature: {signature}
```

Processos:
- `payment_intent.succeeded` → Trigger geração de relatório
- `payment_intent.failed` → Notificar usuário
- `customer.subscription.updated` → Atualizar status assinatura

---

#### `POST /api/chatbot/message`
Enviar mensagem ao chatbot

**Headers:**
```
Content-Type: application/json
```

**Request:**
```json
{
  "lead_id": "uuid",
  "message": "Quero saber mais sobre o serviço",
  "thread_id": "thread_abc" // opcional (para continuação)
}
```

**Response:** `200 OK`
```json
{
  "response": "Claro! investigaree gera relatórios...",
  "thread_id": "thread_abc",
  "intencao_detectada": "interesse",
  "lead_score": 65
}
```

---

Para documentação completa da API, veja `docs/API.md`

---

## 🔒 Segurança e Compliance

### LGPD (Lei Geral de Proteção de Dados)

#### Bases Legais Implementadas
- ✅ **Consentimento** (Art. 7, I): Registro de aceites com timestamp e IP
- ✅ **Execução de contrato** (Art. 7, V): Processamento para entrega de relatórios
- ✅ **Legítimo interesse** (Art. 7, IX): OSINT de dados públicos

#### Direitos dos Titulares (Art. 18)
- ✅ **Confirmação de existência** de dados: `GET /api/lgpd/confirmar`
- ✅ **Acesso aos dados**: `GET /api/lgpd/exportar`
- ✅ **Correção**: `PATCH /api/users/me`
- ✅ **Anonimização/Bloqueio/Eliminação**: `DELETE /api/users/me`
- ✅ **Portabilidade**: Exportação em JSON estruturado
- ✅ **Revogação de consentimento**: `POST /api/lgpd/revogar`

#### DPO (Data Protection Officer)
- Nome: A investigadora brasileira
- Email: contato@investigaree.com.br
- WhatsApp: (47) 99261-1117

#### Medidas Técnicas
- 🔐 Criptografia em trânsito (TLS 1.3)
- 🔐 Criptografia em repouso (Supabase encryption)
- 🔐 PDFs com senha única por relatório
- 🔐 URLs com hash HMAC-SHA256 e expiração
- 🔐 RLS (Row Level Security) no banco
- 🔐 Logs de auditoria para toda ação sensível
- 🔐 Rate limiting e proteção DDoS (Cloudflare)

#### Retenção de Dados
- Leads não convertidos: 90 dias
- Relatórios + pagamentos: 5 anos (requisito fiscal)
- Logs de auditoria: 6 meses
- Dados anonimizados após deleção de conta

---

### Segurança de URLs
Todas as URLs de relatórios são:
- ✅ Assinadas com HMAC-SHA256
- ✅ Vinculadas ao user_id
- ✅ Com expiração de 7 dias
- ✅ Validadas no backend antes de servir

Exemplo:
```
/relatorios/{report_id}?token={hmac}&expires={timestamp}
```

---

### Auditoria e Monitoramento
- Todas as ações sensíveis são registradas em `audit_logs`
- Integração futura: Datadog/Sentry para alertas
- Revisão trimestral de logs de acesso

---

## 🤝 Contribuindo

### Como Contribuir
1. Fork o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'Add: nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Padrões de Código
- **TypeScript** estrito (sem `any`)
- **ESLint** + **Prettier** configurados
- **Commits semânticos**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
- **Testes** obrigatórios para novas features (quando aplicável)

### Processo de Review
- Mínimo 1 aprovação antes de merge
- CI deve passar (build + lint)
- Cobertura de testes não pode diminuir

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

## 📞 Contato

**investigaree - Serviço de Investigação Digital e Perícia Forense**

- 📧 Email: contato@investigaree.com.br
- 📱 WhatsApp: (47) 99261-1117
- 🌐 Website: [investigaree.com.br](https://investigaree.com.br)
- 💼 LinkedIn: [linkedin.com/company/investigaree](https://linkedin.com/company/investigaree)

---

## 🗺 Roadmap

### MVP (Q1 2025) ✅
- [x] Landing page com formulário multi-etapas
- [x] Chatbot IA de vendas
- [x] Autenticação Firebase + Supabase
- [x] Integração APIs (Google, API Brasil, DeHashed, OpenAI)
- [x] Geração automatizada de relatórios
- [x] Pagamento via Stripe
- [x] Dashboard básico
- [x] Compliance LGPD

### Fase 2 (Q2 2025)
- [ ] Dashboard avançado com analytics
- [ ] Relatórios comparativos (múltiplas startups)
- [ ] Integração com mais fontes de dados (Serasa, BNDES, etc.)
- [ ] Sistema de notificações push
- [ ] App mobile (React Native)
- [ ] Marketplace de investigadores parceiros

### Fase 3 (Q3 2025)
- [ ] Plataforma white-label para aceleradoras
- [ ] API pública para integrações
- [ ] Automação de follow-up com investidores
- [ ] Relatórios em vídeo (AI-generated)
- [ ] Expansão internacional (LATAM)

---

**Desenvolvido com 💙 por investigaree Team**
*Due Diligence que protege capital e reputação*

---

**Última atualização**: 20/01/2025
