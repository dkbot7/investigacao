# 📙 TECHNICAL SYSTEMS — investigaree Platform

**Versão**: 1.0
**Última atualização**: 21/11/2025
**Documento**: Technical Architecture & System Design

---

## 🏗️ ARQUITETURA GERAL DO SISTEMA

### Stack Tecnológico Completo

```
┌─────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE                            │
│  DNS → CDN → WAF → DDoS Protection → SSL/TLS                │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                           │
┌───────▼────────┐                         ┌───────▼────────┐
│  FRONTEND      │                         │  BACKEND       │
│  Pages         │                         │  Workers       │
│  React + Vite  │◄────────API Calls──────►│  Hono + TS     │
└────────────────┘                         └───────┬────────┘
                                                   │
                    ┌──────────────────────────────┼────────────────┐
                    │                              │                │
            ┌───────▼────────┐           ┌────────▼──────┐  ┌──────▼──────┐
            │  FIREBASE      │           │  SUPABASE     │  │  STRIPE     │
            │  Auth          │           │  PostgreSQL   │  │  Payments   │
            └────────────────┘           └───────────────┘  └─────────────┘
                                                   │
                                         ┌─────────┴──────────┐
                                         │                    │
                                  ┌──────▼──────┐      ┌─────▼──────┐
                                  │  R2 STORAGE │      │  KV STORE  │
                                  │  (PDFs)     │      │  (Cache)   │
                                  └─────────────┘      └────────────┘
```

---

## 🎨 FRONTEND ARCHITECTURE

### Tecnologias

| Componente | Tecnologia | Versão | Propósito |
|-----------|------------|--------|-----------|
| **Framework** | React | 18.3.1 | UI library |
| **Build Tool** | Vite | 5.4.21 | Fast bundler |
| **Language** | TypeScript | 5.6.2 | Type safety |
| **Routing** | React Router | 6.28.0 | Client-side routing |
| **Styling** | Tailwind CSS | 3.4.17 | Utility-first CSS |
| **Icons** | Lucide React | 0.469.0 | Icon library |
| **Auth** | Firebase | 11.1.0 | Authentication |

### Estrutura de Diretórios

```
src/
├── pages/               # Páginas da aplicação
│   ├── LandingPage.tsx       # Landing page pública
│   ├── LoginPage.tsx         # Autenticação
│   ├── RegisterPage.tsx      # Cadastro
│   ├── ObrigadoPage.tsx      # Página de agradecimento
│   ├── DashboardPage.tsx     # Dashboard do cliente
│   ├── CreateReportPage.tsx  # Criar novo relatório
│   ├── ReportDetailsPage.tsx # Ver relatório
│   ├── PaymentsPage.tsx      # Checkout
│   └── ProfilePage.tsx       # Perfil LGPD
│
├── components/          # Componentes reutilizáveis
│   └── ProtectedRoute.tsx    # HOC de autenticação
│
├── contexts/            # Gerenciamento de estado global
│   ├── AuthContext.tsx       # Firebase auth state
│   └── ApiContext.tsx        # API client wrapper
│
├── App.tsx              # Root component + routing
├── main.tsx             # Entry point
└── vite-env.d.ts        # Type declarations

public/
├── snake.js             # Jogo Snake (vanilla JS)
├── favicon.svg          # Favicon
└── ...                  # Static assets
```

### Páginas e Rotas

#### Rotas Públicas (sem autenticação)

| Rota | Componente | Propósito |
|------|-----------|-----------|
| `/` | LandingPage | Landing page + formulário de leads |
| `/login` | LoginPage | Login de usuários cadastrados |
| `/register` | RegisterPage | Cadastro de novos usuários |
| `/obrigado` | ObrigadoPage | Thank you page + Snake game |

#### Rotas Protegidas (requer autenticação)

| Rota | Componente | Propósito |
|------|-----------|-----------|
| `/dashboard` | DashboardPage | Visualizar relatórios do usuário |
| `/reports/new` | CreateReportPage | Criar novo relatório |
| `/reports/:id` | ReportDetailsPage | Ver detalhes do relatório |
| `/payments` | PaymentsPage | Checkout Stripe |
| `/profile` | ProfilePage | Perfil + LGPD (exportar/excluir dados) |

### Context Providers

#### AuthContext

```typescript
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getToken: () => Promise<string | null>
}
```

**Funcionalidades**:
- Gerencia estado de autenticação Firebase
- Listener de mudanças de auth (`onAuthStateChanged`)
- Métodos de login/logout/register
- Fornece token JWT para API calls

#### ApiContext

```typescript
interface ApiContextType {
  createReport: (data: ReportData) => Promise<Report>
  getReports: () => Promise<Report[]>
  getReport: (id: string) => Promise<Report>
  // ... outros métodos
}
```

**Funcionalidades**:
- Wrapper para chamadas à API backend
- Anexa automaticamente token de autenticação
- Error handling centralizado
- Loading states

### Build & Bundle

**Otimizações**:
- Code splitting por rota
- Vendor chunks (React, Firebase separados)
- Tree shaking
- Minificação com esbuild
- CSS purging (Tailwind)

**Build Output** (produção):
```
dist/
├── index.html                    2.42 kB │ gzip:  0.81 kB
├── assets/
│   ├── index.css               20.67 kB │ gzip:  4.30 kB
│   ├── ui-vendor.js             7.99 kB │ gzip:  1.85 kB
│   ├── index.js                45.47 kB │ gzip:  9.32 kB
│   ├── react-vendor.js        162.33 kB │ gzip: 52.98 kB
│   └── firebase.js            163.20 kB │ gzip: 33.33 kB
└── snake.js                    (copied)

Total: ~400 kB (uncompressed)
Gzipped: ~102 kB
```

### Environment Variables (.env)

```bash
# API
VITE_API_BASE_URL=https://api.investigaree.com.br

# Firebase
VITE_FIREBASE_API_KEY=AIzaSyCZ4qI4rEixO8iM7u6IZxivBoFtQLpbUZs
VITE_FIREBASE_AUTH_DOMAIN=investigaree.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=investigaree
```

---

## ⚙️ BACKEND ARCHITECTURE

### Tecnologias

| Componente | Tecnologia | Versão | Propósito |
|-----------|------------|--------|-----------|
| **Runtime** | Cloudflare Workers | - | Serverless edge computing |
| **Framework** | Hono | 4.6.15 | Lightweight web framework |
| **Language** | TypeScript | 5.6.2 | Type-safe backend |
| **ORM** | Supabase REST API | - | Database access |
| **Validation** | Zod | - | Schema validation |

### Estrutura de Diretórios

```
workers/
├── index.ts              # Entry point, routing, middleware
├── middleware/
│   ├── auth.ts              # Firebase JWT verification
│   └── rate-limit.ts        # Rate limiting via KV
│
├── api/                  # API route handlers
│   ├── leads.ts             # POST /api/leads (landing page)
│   ├── reports.ts           # CRUD de relatórios
│   ├── payments.ts          # Stripe checkout + session
│   ├── webhooks.ts          # Stripe webhooks
│   ├── chatbot.ts           # Chatbot (futuro)
│   ├── user.ts              # User profile
│   └── lgpd.ts              # Export/delete user data
│
├── services/             # Business logic
│   ├── report-processor.ts  # Processar relatórios (cron)
│   ├── pdf-generator.ts     # Gerar PDFs
│   └── notifications.ts     # Enviar emails/alerts
│
├── cron/                 # Scheduled tasks
│   └── process-reports.ts   # Processar relatórios pendentes
│
└── utils/                # Utilities
    ├── supabase.ts          # Supabase client
    ├── firebase-admin.ts    # Firebase Admin SDK
    └── stripe.ts            # Stripe client
```

### API Endpoints

#### Public Endpoints (sem auth)

| Method | Endpoint | Propósito | Body |
|--------|----------|-----------|------|
| GET | `/health` | Health check | - |
| GET | `/` | API info | - |
| POST | `/api/leads` | Criar lead (landing page) | `{ firebase_uid, name, email, consent }` |
| POST | `/api/webhooks/stripe` | Stripe webhook handler | Stripe event |

#### Protected Endpoints (requer Firebase JWT)

| Method | Endpoint | Propósito | Auth |
|--------|----------|-----------|------|
| GET | `/api/reports` | Listar relatórios do usuário | Bearer token |
| POST | `/api/reports` | Criar novo relatório | Bearer token |
| GET | `/api/reports/:id` | Obter relatório específico | Bearer token |
| POST | `/api/payments/create-checkout` | Criar sessão Stripe | Bearer token |
| GET | `/api/user/profile` | Obter perfil | Bearer token |
| POST | `/api/lgpd/export` | Exportar dados LGPD | Bearer token |
| POST | `/api/lgpd/delete` | Solicitar exclusão | Bearer token |

### Middleware Stack

```typescript
// Global middleware (aplicado a todas as rotas)
app.use('*', logger())          // Development logging
app.use('*', prettyJSON())      // Pretty JSON response
app.use('*', cors({...}))       // CORS configuration

// Specific middleware
app.use('/api/*', rateLimitMiddleware)  // Rate limiting
app.use('/api/reports/*', authMiddleware)  // Auth required
```

#### CORS Configuration

```typescript
cors({
  origin: [
    'https://investigaree.com.br',
    'https://www.investigaree.com.br',
    'https://investigaree.pages.dev',
    'https://*.investigaree.pages.dev',
    'http://localhost:5173'  // Dev only
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 600
})
```

#### Auth Middleware

```typescript
// Verifica Firebase JWT
async function authMiddleware(c, next) {
  const token = c.req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  // Verify with Firebase Admin SDK
  const decodedToken = await verifyFirebaseToken(token, c.env)

  if (!decodedToken) {
    return c.json({ error: 'Invalid token' }, 401)
  }

  // Attach user to context
  c.set('user', decodedToken)
  await next()
}
```

#### Rate Limiting

```typescript
// KV-based rate limiting
async function rateLimitMiddleware(c, next) {
  const ip = c.req.header('CF-Connecting-IP') || 'unknown'
  const key = `ratelimit:${ip}`

  const count = await c.env.KV.get(key)

  if (count && parseInt(count) > 100) {  // 100 req/hour
    return c.json({ error: 'Rate limit exceeded' }, 429)
  }

  await c.env.KV.put(key, (parseInt(count || '0') + 1).toString(), {
    expirationTtl: 3600  // 1 hour
  })

  await next()
}
```

### Environment Variables (wrangler.toml)

```toml
name = "investigaree"
main = "workers/index.ts"
compatibility_date = "2024-01-01"
account_id = "ce11d202b2917777965b5131b5edc627"

[vars]
ENVIRONMENT = "production"
APP_VERSION = "1.0.0"

[[kv_namespaces]]
binding = "KV"
id = "afa4a891f4994709977bcd583fb3f285"

[[r2_buckets]]
binding = "R2"
bucket_name = "r2storage"

# Secrets (via wrangler secret put)
# SUPABASE_URL
# SUPABASE_SERVICE_ROLE_KEY
# FIREBASE_ADMIN_CREDENTIALS
# STRIPE_SECRET_KEY
# STRIPE_WEBHOOK_SECRET
# OPENAI_API_KEY
# GOOGLE_API_KEY
# etc.
```

### Cron Jobs (Scheduled Events)

```toml
[triggers]
crons = ["0 */6 * * *"]  # A cada 6 horas
```

```typescript
export default {
  async scheduled(event, env, ctx) {
    console.log('[CRON] Processing pending reports...')

    const { processPendingReports } = await import('./cron/process-reports')
    await processPendingReports(env)

    console.log('[CRON] Done!')
  }
}
```

---

## 🗄️ DATABASE ARCHITECTURE

### Supabase PostgreSQL

#### Schema Overview

```sql
-- Tabela leads (cadastro landing page)
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text NOT NULL,
  name text,
  email text NOT NULL,
  phone text,
  origin text DEFAULT 'landing_page',
  created_at timestamp DEFAULT now(),
  consent boolean DEFAULT true
);

-- Tabela users (usuários da plataforma)
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Tabela reports (relatórios solicitados)
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  target_name text NOT NULL,
  target_cpf text,
  target_email text,
  services text[] NOT NULL,  -- Array de serviços solicitados
  urgency text NOT NULL CHECK (urgency IN ('standard', 'express')),
  status text NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  price_paid decimal(10,2),
  pdf_url text,  -- URL do PDF no R2
  created_at timestamp DEFAULT now(),
  completed_at timestamp
);

-- Tabela payments (pagamentos Stripe)
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid REFERENCES reports(id) ON DELETE CASCADE,
  stripe_session_id text UNIQUE NOT NULL,
  stripe_payment_intent text,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamp DEFAULT now(),
  paid_at timestamp
);
```

#### Row Level Security (RLS)

```sql
-- Users: só pode ver seus próprios dados
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  USING (firebase_uid = auth.uid());

-- Reports: só pode ver próprios relatórios
CREATE POLICY "Users can read own reports"
  ON reports
  FOR SELECT
  USING (user_id IN (
    SELECT id FROM users WHERE firebase_uid = auth.uid()
  ));

-- Leads: só service role pode inserir/ler
CREATE POLICY "Service role can insert leads"
  ON leads FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "No public read access"
  ON leads FOR SELECT TO anon USING (false);
```

#### Indexes

```sql
CREATE INDEX idx_leads_firebase_uid ON leads(firebase_uid);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

CREATE INDEX idx_payments_report_id ON payments(report_id);
CREATE INDEX idx_payments_stripe_session_id ON payments(stripe_session_id);
```

---

## 🔐 AUTHENTICATION & SECURITY

### Firebase Authentication

**Configuração**:
- Provider: Email/Password
- Email verification: **Disabled** (para leads da landing page)
- Password reset: Enabled
- Session: Persistent

**Fluxo de Autenticação**:

```
1. User → Email + Senha → Firebase Auth
2. Firebase → JWT Token → Client
3. Client → API Request + JWT → Backend
4. Backend → Verify JWT → Firebase Admin SDK
5. Backend → Check user in Supabase → Response
```

**JWT Token Structure**:
```json
{
  "iss": "https://securetoken.google.com/investigaree",
  "aud": "investigaree",
  "auth_time": 1732165200,
  "user_id": "abc123...",
  "sub": "abc123...",
  "iat": 1732165200,
  "exp": 1732168800,
  "email": "user@example.com",
  "email_verified": false
}
```

### Security Headers

```typescript
// Cloudflare Workers automatically adds:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - Strict-Transport-Security: max-age=31536000

// Custom headers:
app.use('*', async (c, next) => {
  await next()

  c.header('X-Request-Id', crypto.randomUUID())
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
})
```

### Secrets Management

**Nunca commitar**:
- ✅ `.env` (gitignored)
- ✅ `.env.automation` (gitignored)
- ✅ `wrangler.toml` (só valores públicos)

**Secrets no Workers**:
```bash
# Adicionar via CLI
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put FIREBASE_ADMIN_CREDENTIALS
```

---

## ☁️ CLOUDFLARE INFRASTRUCTURE

### DNS Configuration

```
CNAME  @    → investigaree.pages.dev                  [Proxied ✓]
CNAME  api  → investigaree.chatbotimoveis.workers.dev [Proxied ✓]
CNAME  www  → investigaree.pages.dev                  [Proxied ✓]
TXT    @    → v=spf1 include:_spf.google.com ~all
```

### Pages (Frontend Hosting)

**Build Configuration**:
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node version: 18

**Custom Domains**:
- `investigaree.com.br` (primary)
- `www.investigaree.com.br` (redirect)

**Deploy**:
```bash
npm run build
npx wrangler pages deploy dist --project-name=investigaree
```

### Workers (Backend)

**Deploy**:
```bash
npx wrangler deploy
```

**Routes**:
- `api.investigaree.com.br/*` → investigaree Worker

### R2 Storage (PDFs)

**Bucket**: `r2storage`

**Uso**: Armazenar PDFs de relatórios

**Access**:
```typescript
// Upload PDF
await env.R2.put(`reports/${reportId}.pdf`, pdfBuffer, {
  httpMetadata: {
    contentType: 'application/pdf'
  }
})

// Download PDF (signed URL)
const url = await env.R2.createSignedUrl(`reports/${reportId}.pdf`, {
  expiresIn: 3600  // 1 hora
})
```

### KV Storage (Cache)

**Uso**:
- Rate limiting
- Session storage
- Temporary data cache

**API**:
```typescript
// Set
await env.KV.put('key', 'value', { expirationTtl: 3600 })

// Get
const value = await env.KV.get('key')

// Delete
await env.KV.delete('key')
```

---

## 🔄 CI/CD & DEPLOYMENT

### Git Workflow

```
main (production)
  ↑
  └── develop (staging)
       ↑
       └── feature/* (development)
```

**Branches**:
- `main`: Produção (auto-deploy)
- `develop`: Staging (auto-deploy para preview)
- `feature/*`: Features individuais

### Deploy Automation (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build frontend
        run: npm run build

      - name: Deploy Workers
        run: npx wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}

      - name: Deploy Pages
        run: npx wrangler pages deploy dist --project-name=investigaree
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### Manual Deploy

```bash
# Full deploy (backend + frontend)
npm run build && \
npx wrangler deploy && \
npx wrangler pages deploy dist --project-name=investigaree

# Frontend only
npm run build && npx wrangler pages deploy dist --project-name=investigaree

# Backend only
npx wrangler deploy
```

---

## 📊 MONITORING & LOGGING

### Logs

**Workers Logs**:
```bash
# Real-time
npx wrangler tail

# Filtered
npx wrangler tail --format pretty

# Search
npx wrangler tail --status error
```

**Log Levels**:
```typescript
console.log('[INFO] Normal operation')
console.warn('[WARN] Potential issue')
console.error('[ERROR] Critical error:', error)
```

### Analytics

**Cloudflare Analytics**:
- Requests/day
- Bandwidth
- Status codes
- Cache hit ratio
- Top routes

**Custom Analytics** (futuro):
- Plausible or Google Analytics
- Mixpanel for product events
- Sentry for error tracking

---

## 🧪 TESTING

### Local Development

```bash
# Frontend dev server
npm run dev
# → http://localhost:5173

# Backend dev server
npx wrangler dev workers/index.ts
# → http://localhost:8787
```

### Testing Stack (futuro)

- **Unit**: Vitest
- **Integration**: Playwright
- **E2E**: Cypress

---

## 🚨 TROUBLESHOOTING

### Common Issues

#### 1. CORS Error

**Erro**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solução**: Verificar se origin está em `workers/index.ts`:
```typescript
cors({
  origin: ['https://investigaree.com.br', ...]
})
```

#### 2. Firebase Auth Error

**Erro**: `Firebase: Error (auth/invalid-api-key)`

**Solução**: Verificar `.env`:
```bash
VITE_FIREBASE_API_KEY=AIzaSy...
```

#### 3. Supabase RLS Error

**Erro**: `new row violates row-level security policy`

**Solução**: Usar service role key no backend:
```typescript
headers: {
  Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`
}
```

---

## 📚 TECHNICAL DECISIONS LOG

### Por que Cloudflare Workers?

✅ **Edge computing**: Baixa latência global
✅ **Escalabilidade**: Auto-scaling sem config
✅ **Custo**: Free tier generoso, pay-per-use
✅ **Simplicidade**: Sem servidor para gerenciar
✅ **Integração**: Pages + Workers + R2 + KV

### Por que Hono?

✅ **Performance**: 4x mais rápido que Express
✅ **TypeScript-first**: Type safety nativa
✅ **Tamanho**: ~12KB (vs 200KB+ Express)
✅ **Workers-optimized**: Built para edge

### Por que Supabase?

✅ **PostgreSQL**: Database relacional robusto
✅ **RLS**: Row-level security nativa
✅ **REST API**: Auto-gerada do schema
✅ **Real-time**: Websockets (futuro)
✅ **Managed**: Sem infra para gerenciar

### Por que Firebase Auth?

✅ **JWT**: Padrão indústria
✅ **SDKs**: Client + Admin
✅ **Segurança**: Google-grade
✅ **Features**: Email/password, OAuth (futuro)

---

## 🔮 TECHNICAL ROADMAP

### Q1 2026

- [ ] Migrar para monorepo (Turborepo)
- [ ] Adicionar testes automatizados (Vitest + Playwright)
- [ ] Implementar Sentry (error tracking)
- [ ] Configurar Datadog (APM)

### Q2 2026

- [ ] API pública com rate limiting por tier
- [ ] Webhooks para clientes
- [ ] GraphQL layer (Apollo)
- [ ] Mobile app (React Native)

### Q3 2026

- [ ] Microservices architecture
- [ ] Kafka/RabbitMQ para async processing
- [ ] Redis cache layer
- [ ] Multi-region deployment

---

**Documento mantido por**: Equipe de Engineering
**Revisão**: Mensal
**Próxima revisão**: Dez 2025

---

*"Simplicidade é a sofisticação suprema." — Leonardo da Vinci*
