# Lista Completa de APIs Necessárias - investigaree

Este documento lista todas as APIs externas que precisam ser configuradas e implementadas para o funcionamento completo do sistema investigaree.

## Índice

1. [APIs Essenciais (Prioridade Máxima)](#apis-essenciais)
2. [APIs de Infraestrutura](#apis-de-infraestrutura)
3. [APIs Opcionais (Nice to Have)](#apis-opcionais)
4. [Resumo de Custos](#resumo-de-custos)
5. [Ordem de Implementação Recomendada](#ordem-de-implementação)

---

## APIs Essenciais

### 1. Supabase (Banco de Dados + Auth Backend)

**Status:** ✅ CONFIGURADO (placeholders implementados)

**Função:** Banco de dados PostgreSQL com RLS, backend para autenticação

**Onde é usado:**
- Todas as rotas de API
- Armazenamento de usuários, relatórios, pagamentos, logs

**Setup:**
1. Criar conta em https://supabase.com
2. Criar novo projeto
3. Executar migrations SQL do `/database`
4. Copiar credenciais:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

**Custo:**
- **Plano Gratuito:** Até 500MB database, 2GB bandwidth
- **Plano Pro:** $25/mês (8GB database, 50GB bandwidth)
- **Recomendado:** Pro (necessário para produção)

**Arquivos que usam:**
- `workers/middleware/auth.ts`
- Todas as rotas em `workers/api/*`

---

### 2. Firebase Authentication

**Status:** ⚠️ PLACEHOLDER (precisa implementar)

**Função:** Autenticação de usuários (email/senha, Google OAuth)

**Onde é usado:**
- `workers/middleware/auth.ts` - Validação de JWT tokens
- Frontend - Login, registro

**Setup:**
1. Criar projeto no Firebase Console: https://console.firebase.google.com
2. Ativar Authentication
3. Ativar métodos de login:
   - Email/Password
   - Google Sign-In
4. Gerar credenciais do Admin SDK
5. Copiar JSON de credenciais para `FIREBASE_ADMIN_CREDENTIALS`

**Custo:**
- **Gratuito** (até 10k phone auths/mês, email ilimitado)

**Documentação:**
- https://firebase.google.com/docs/auth
- https://firebase.google.com/docs/admin/setup

**Código para implementar:**
```typescript
// workers/middleware/auth.ts - linha 28
import admin from 'firebase-admin'

const serviceAccount = JSON.parse(env.FIREBASE_ADMIN_CREDENTIALS)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const decodedToken = await admin.auth().verifyIdToken(token)
```

---

### 3. Stripe (Pagamentos)

**Status:** ⚠️ PLACEHOLDER (precisa implementar)

**Função:** Processamento de pagamentos e assinaturas

**Onde é usado:**
- `workers/api/payments.ts` - Criar Payment Intents
- `workers/api/webhooks.ts` - Receber eventos de pagamento

**Setup:**
1. Criar conta em https://stripe.com/br
2. Ativar modo de produção
3. Configurar webhook endpoint: `https://investigaree.com.br/api/webhooks/stripe`
4. Copiar credenciais:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`

**Custo:**
- **3,99% + R$ 0,39** por transação bem-sucedida (PIX)
- **4,99% + R$ 0,39** por transação (cartão nacional)
- Sem mensalidade

**Documentação:**
- https://stripe.com/docs/api
- https://stripe.com/docs/payments/accept-a-payment
- https://stripe.com/docs/webhooks

**Código para implementar:**
```typescript
// workers/api/payments.ts - linha 61
import Stripe from 'stripe'

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

const paymentIntent = await stripe.paymentIntents.create({
  amount: amount,
  currency: 'brl',
  customer: customerId,
  metadata: { ... },
})
```

---

### 4. OpenAI API (Inteligência Artificial)

**Status:** ⚠️ PLACEHOLDER (precisa implementar)

**Função:**
- Análise de due diligence com GPT-4
- Chatbot de vendas com SPIN selling

**Onde é usado:**
- `workers/services/ai-analysis.service.ts` - Análise inteligente
- `workers/api/chatbot.ts` - Assistente de vendas

**Setup:**
1. Criar conta em https://platform.openai.com
2. Adicionar método de pagamento
3. Gerar API key
4. Copiar: `OPENAI_API_KEY`

**Custo (GPT-4 Turbo):**
- **Input:** $0.01 / 1K tokens (~750 palavras)
- **Output:** $0.03 / 1K tokens
- **Estimativa por relatório:** ~5K tokens = $0.15/relatório

**Custo (GPT-3.5 Turbo - alternativa mais barata):**
- **Input:** $0.0005 / 1K tokens
- **Output:** $0.0015 / 1K tokens
- **Estimativa por relatório:** ~5K tokens = $0.01/relatório

**Documentação:**
- https://platform.openai.com/docs/api-reference/chat
- https://platform.openai.com/docs/guides/chat

**Código para implementar:**
```typescript
// workers/services/ai-analysis.service.ts - linha 81
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

const completion = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  messages: [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ],
  response_format: { type: 'json_object' },
  temperature: 0.3,
})
```

---

### 5. Google Custom Search API (OSINT)

**Status:** ⚠️ PLACEHOLDER (precisa implementar)

**Função:** Busca de informações públicas sobre empresas e sócios

**Onde é usado:**
- `workers/services/google-search.service.ts` - Investigação OSINT

**Setup:**
1. Criar projeto no Google Cloud Console: https://console.cloud.google.com
2. Ativar Custom Search API
3. Criar Custom Search Engine: https://programmablesearchengine.google.com
4. Configurar para buscar em toda a web
5. Copiar credenciais:
   - `GOOGLE_API_KEY`
   - `GOOGLE_CSE_ID`

**Custo:**
- **Gratuito:** 100 queries/dia
- **Pago:** $5 / 1.000 queries (após as 100 gratuitas)
- **Estimativa:** ~10 queries/relatório = $0.05/relatório

**Documentação:**
- https://developers.google.com/custom-search/v1/introduction
- https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list

**Código para implementar:**
```typescript
// workers/services/google-search.service.ts - linha 49
const params = new URLSearchParams({
  key: env.GOOGLE_API_KEY,
  cx: env.GOOGLE_CSE_ID,
  q: query,
  num: '10',
})

const response = await fetch(
  `https://www.googleapis.com/customsearch/v1?${params.toString()}`
)
```

---

### 6. API Brasil (Dados Cadastrais CNPJ)

**Status:** ⚠️ PLACEHOLDER (precisa implementar)

**Função:** Consulta de dados oficiais da Receita Federal (CNPJ completo)

**Onde é usado:**
- `workers/services/cnpj.service.ts` - Dados cadastrais

**Setup:**
1. Criar conta em https://apibrasil.com.br
2. Escolher plano
3. Copiar credenciais:
   - `API_BRASIL_BEARER_TOKEN`
   - `API_BRASIL_DEVICE_TOKEN`

**Custo:**
- **Plano Básico:** R$ 29,90/mês (100 consultas)
- **Plano Pro:** R$ 79,90/mês (consultas ilimitadas)
- **Recomendado:** Pro (essencial para operação)

**Documentação:**
- https://apibrasil.com.br/documentacao/cnpj

**Código para implementar:**
```typescript
// workers/services/cnpj.service.ts - linha 83
const cnpjNumeros = cnpj.replace(/\D/g, '')

const response = await fetch(
  `https://apibrasil.com.br/api/v1/cnpj/${cnpjNumeros}`,
  {
    headers: {
      Authorization: `Bearer ${env.API_BRASIL_BEARER_TOKEN}`,
      DeviceToken: env.API_BRASIL_DEVICE_TOKEN,
    },
  }
)
```

---

### 7. DeHashed API (Vazamentos de Dados)

**Status:** ⚠️ PLACEHOLDER (precisa implementar)

**Função:** Verificar se emails/credenciais foram expostos em breaches

**Onde é usado:**
- `workers/services/breach-check.service.ts` - Análise de segurança

**Setup:**
1. Criar conta em https://www.dehashed.com
2. Assinar plano
3. Copiar credenciais:
   - `DEHASHED_EMAIL`
   - `DEHASHED_API_KEY`

**Custo:**
- **Individual:** $9.99/mês (10 créditos/dia)
- **Professional:** $39.99/mês (ilimitado)
- **Recomendado:** Professional

**Documentação:**
- https://www.dehashed.com/docs

**Código para implementar:**
```typescript
// workers/services/breach-check.service.ts - linha 45
const params = new URLSearchParams({
  query: `email:"${email}"`,
  size: '100',
})

const credentials = btoa(`${env.DEHASHED_EMAIL}:${env.DEHASHED_API_KEY}`)

const response = await fetch(
  `https://api.dehashed.com/search?${params.toString()}`,
  {
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${credentials}`,
    },
  }
)
```

---

## APIs de Infraestrutura

### 8. Gmail API (Envio de Emails)

**Status:** ⚠️ PLACEHOLDER (precisa implementar)

**Função:** Enviar emails transacionais e notificações

**Onde é usado:**
- `workers/services/email.service.ts` - Todos os templates de email

**Setup:**
1. Usar o mesmo projeto do Google Cloud (Custom Search)
2. Ativar Gmail API
3. Criar Service Account
4. Delegar domínio no Google Workspace (se aplicável)
5. Ou usar OAuth2 para autenticação

**Custo:**
- **Gratuito** (limite de 10.000 emails/dia por projeto)

**Alternativas (mais fáceis de configurar):**
- **SendGrid:** $19.95/mês (50k emails)
- **Mailgun:** $15/mês (50k emails)
- **AWS SES:** $0.10/1000 emails

**Documentação:**
- https://developers.google.com/gmail/api/guides/sending

**Código para implementar:**
```typescript
// workers/services/email.service.ts - linha 40
// Opção 1: Gmail API
const accessToken = await getGmailAccessToken(env)
const message = createEmailMessage(options)

const response = await fetch(
  'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: btoa(message).replace(/\+/g, '-').replace(/\//g, '_'),
    }),
  }
)
```

---

### 9. Cloudflare Browser Rendering (Geração de PDF)

**Status:** ⚠️ PLACEHOLDER (precisa implementar)

**Função:** Gerar PDFs dos relatórios usando Puppeteer

**Onde é usado:**
- `workers/services/pdf-generator.service.ts` - Conversão HTML→PDF

**Setup:**
1. Habilitar Browser Rendering no dashboard Cloudflare
2. Adicionar binding no `wrangler.toml`:
```toml
browser = { binding = "BROWSER" }
```
3. Deploy com Wrangler

**Custo:**
- **$5 por milhão de segundos** de renderização
- **Estimativa:** ~3 segundos/PDF = $0.000015/PDF (desprezível)

**Alternativas:**
- **jsPDF:** Gratuito, mas menos poderoso
- **PDFKit:** Gratuito, mas requer layout manual
- **PDF.co:** $99/mês (10k PDFs)

**Documentação:**
- https://developers.cloudflare.com/browser-rendering/

**Código para implementar:**
```typescript
// workers/services/pdf-generator.service.ts - linha 71
import puppeteer from '@cloudflare/puppeteer'

const browser = await puppeteer.launch(env.BROWSER)
const page = await browser.newPage()

const html = generateReportHTML(data)
await page.setContent(html)

const pdfBuffer = await page.pdf({
  format: 'A4',
  printBackground: true,
})

await browser.close()
```

---

### 10. Cloudflare R2 Storage (Armazenamento de PDFs)

**Status:** ⚠️ PLACEHOLDER (precisa implementar)

**Função:** Armazenar PDFs dos relatórios gerados

**Onde é usado:**
- `workers/services/pdf-generator.service.ts` - Upload de PDFs

**Setup:**
1. Criar bucket R2 no dashboard Cloudflare
2. Configurar CORS e acesso público (read-only)
3. Adicionar binding no `wrangler.toml`:
```toml
[[r2_buckets]]
binding = "R2"
bucket_name = "investigaree-reports"
```

**Custo:**
- **$0.015/GB/mês** de armazenamento
- **Sem custo** para transferência (Cloudflare network)
- **Estimativa:** 100 PDFs (~50MB) = $0.0008/mês (desprezível)

**Documentação:**
- https://developers.cloudflare.com/r2/

**Código para implementar:**
```typescript
// workers/services/pdf-generator.service.ts - linha 710
const fileName = `reports/${data.report_id}.pdf`

await env.R2.put(fileName, pdfBuffer, {
  httpMetadata: {
    contentType: 'application/pdf',
  },
})

const publicUrl = `https://storage.investigaree.com.br/${fileName}`
```

---

### 11. Cloudflare KV (Rate Limiting)

**Status:** ✅ CONFIGURADO (placeholder implementado)

**Função:** Armazenar contadores de rate limiting

**Onde é usado:**
- `workers/middleware/rate-limit.ts` - Controle de abuso

**Setup:**
1. Criar namespace KV no dashboard
2. Adicionar binding no `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "KV"
id = "seu_kv_namespace_id"
```

**Custo:**
- **Incluído no Workers Paid plan** ($5/mês)
- 100k reads/dia gratuitas

**Documentação:**
- https://developers.cloudflare.com/workers/runtime-apis/kv/

---

## APIs Opcionais

### 12. IndexNow (SEO - Bing)

**Status:** 🔵 RECOMENDADO (fácil de implementar)

**Função:** Indexação instantânea de páginas no Bing

**Onde usar:**
- Quando criar nova página de landing
- Quando publicar blog post
- Após atualizar conteúdo importante

**Setup:**
1. Gerar chave API (qualquer string aleatória)
2. Criar arquivo: `public/[sua-chave].txt` com a chave
3. Fazer POST ao endpoint do Bing

**Custo:** **GRATUITO**

**Documentação:**
- https://www.indexnow.org/documentation

**Código para implementar:**
```typescript
// Criar função auxiliar
async function notifyIndexNow(urls: string[]) {
  await fetch('https://www.bing.com/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: 'investigaree.com.br',
      key: env.INDEXNOW_KEY,
      urlList: urls,
    }),
  })
}
```

---

### 13. Sentry (Monitoramento de Erros)

**Status:** 🔵 RECOMENDADO (importante para produção)

**Função:** Monitorar erros e performance em produção

**Setup:**
1. Criar conta em https://sentry.io
2. Criar projeto Cloudflare Workers
3. Instalar SDK:
```bash
npm install @sentry/cloudflare
```
4. Copiar DSN

**Custo:**
- **Gratuito:** 5k erros/mês
- **Team:** $26/mês (50k erros)

**Documentação:**
- https://docs.sentry.io/platforms/javascript/guides/cloudflare-workers/

---

### 14. Google Analytics 4 (Métricas)

**Status:** 🔵 RECOMENDADO (importante para growth)

**Função:** Tracking de conversões e comportamento de usuários

**Setup:**
1. Criar propriedade GA4
2. Adicionar script no frontend
3. Configurar eventos de conversão

**Custo:** **GRATUITO**

**Documentação:**
- https://developers.google.com/analytics/devguides/collection/ga4

---

## Resumo de Custos

### Custos Mensais Fixos (MVP)

| Serviço | Plano | Custo/Mês | Prioridade |
|---------|-------|-----------|------------|
| Supabase | Pro | $25 | 🔴 Essencial |
| Firebase Auth | Gratuito | $0 | 🔴 Essencial |
| Stripe | Pay-as-you-go | $0 (+ 4.99% transação) | 🔴 Essencial |
| API Brasil CNPJ | Pro | R$ 79,90 (~$16) | 🔴 Essencial |
| DeHashed | Professional | $39,99 | 🔴 Essencial |
| OpenAI GPT-4 | Pay-as-you-go | ~$15* | 🔴 Essencial |
| Google Custom Search | Pay-as-you-go | ~$5* | 🟡 Importante |
| Cloudflare Workers | Paid | $5 | 🔴 Essencial |
| Gmail API | Gratuito | $0 | 🟡 Importante |
| **TOTAL MVP** | | **~$105/mês** | |

\* Estimativa baseada em 100 relatórios/mês

### Custos Variáveis por Relatório

| Item | Custo |
|------|-------|
| OpenAI GPT-4 (análise) | $0.15 |
| Google Search (10 queries) | $0.05 |
| Stripe fee (se R$ 10k) | R$ 499 |
| Cloudflare R2 storage | $0.0001 |
| Cloudflare Browser Rendering | $0.00002 |
| **Custo variável/relatório** | **~$0.20** |

### Break-even

- **Custo fixo mensal:** $105
- **Custo variável:** $0.20/relatório
- **Preço de venda:** R$ 10.000 ($2.000)
- **Break-even:** **1 relatório/mês** ✅

---

## Ordem de Implementação

### Sprint 1 - Fundação (Semana 1-2)
**Objetivo:** Sistema funcional com autenticação e banco

1. ✅ **Supabase** - Database setup
2. 🔴 **Firebase Auth** - Login/registro funcional
3. 🔴 **Stripe** - Integração básica de pagamento
4. ✅ **Cloudflare Workers** - Deploy básico

**Resultado:** Usuários podem se registrar e simular pagamento

---

### Sprint 2 - Coleta de Dados (Semana 3-4)
**Objetivo:** Relatório com dados reais

5. 🔴 **API Brasil** - Dados de CNPJ reais
6. 🔴 **Google Custom Search** - OSINT básico
7. 🔴 **DeHashed** - Verificação de vazamentos

**Resultado:** Sistema coleta dados reais para análise

---

### Sprint 3 - Inteligência (Semana 5-6)
**Objetivo:** Análise automatizada com IA

8. 🔴 **OpenAI GPT-4** - Análise inteligente
9. 🔴 **PDF Generator (Browser Rendering)** - Relatórios em PDF
10. 🔴 **R2 Storage** - Armazenamento de PDFs

**Resultado:** Relatórios completos gerados automaticamente

---

### Sprint 4 - Comunicação (Semana 7)
**Objetivo:** Notificações e suporte

11. 🔴 **Gmail API** (ou SendGrid) - Emails transacionais
12. 🔴 **OpenAI Assistants** - Chatbot de vendas

**Resultado:** Sistema comunica-se com usuários

---

### Sprint 5 - Otimização (Semana 8)
**Objetivo:** SEO e monitoramento

13. 🔵 **IndexNow** - SEO para Bing
14. 🔵 **Sentry** - Monitoramento de erros
15. 🔵 **Google Analytics** - Métricas

**Resultado:** Sistema pronto para produção

---

## Checklist de Implementação

### Para cada API:

- [ ] Criar conta no serviço
- [ ] Configurar projeto/app
- [ ] Gerar credenciais (API keys, tokens)
- [ ] Adicionar variáveis ao `.env.local`:
  ```bash
  # No arquivo .env.local
  GOOGLE_API_KEY=sua_chave_aqui
  GOOGLE_CSE_ID=seu_cse_id
  # ... outras variáveis
  ```
- [ ] Adicionar secrets ao Cloudflare Workers:
  ```bash
  wrangler secret put GOOGLE_API_KEY
  wrangler secret put STRIPE_SECRET_KEY
  # ... outros secrets
  ```
- [ ] Remover código de PLACEHOLDER
- [ ] Implementar código real
- [ ] Testar em desenvolvimento
- [ ] Adicionar tratamento de erros
- [ ] Testar em produção (staging)
- [ ] Monitorar custos

---

## Arquivos que Precisam de Implementação Real

### Prioridade MÁXIMA 🔴

1. **workers/middleware/auth.ts**
   - Linha 28-44: Implementar validação Firebase
   - Linha 52-64: Buscar usuário do Supabase

2. **workers/api/payments.ts**
   - Linha 61-62: Criar Payment Intent no Stripe
   - Linha 243-248: Criar Customer no Stripe

3. **workers/api/webhooks.ts**
   - Linha 24-26: Validar signature do Stripe

4. **workers/services/cnpj.service.ts**
   - Linha 83-96: Consulta real na API Brasil

5. **workers/services/google-search.service.ts**
   - Linha 49-67: Busca real no Google Custom Search

6. **workers/services/breach-check.service.ts**
   - Linha 45-62: Busca real no DeHashed

7. **workers/services/ai-analysis.service.ts**
   - Linha 81-114: Análise real com OpenAI GPT-4

8. **workers/services/pdf-generator.service.ts**
   - Linha 71-99: Geração de PDF com Puppeteer
   - Linha 710-723: Upload para R2

9. **workers/services/email.service.ts**
   - Linha 40-57: Envio real via Gmail API

### Prioridade ALTA 🟡

10. **workers/api/chatbot.ts**
    - Linha 28-31: Integração OpenAI Assistants

11. **Frontend completo** (não iniciado)
    - Landing page
    - Dashboard
    - Formulários
    - Componentes shadcn/ui

---

## Segurança e Boas Práticas

### Secrets Management

**NUNCA commitar:**
- API keys
- Tokens
- Passwords
- Certificados

**Sempre usar:**
```bash
# Desenvolvimento
.env.local (gitignored)

# Produção
wrangler secret put NOME_DA_SECRET
```

### Rate Limiting

Implementar limites para evitar abuso:
- DeHashed: 10 queries/minuto
- OpenAI: 500 requests/day (tier gratuito)
- Google Search: 100/dia gratuito

### Error Handling

Sempre tratar erros de API:
```typescript
try {
  const result = await externalAPI()
} catch (error) {
  console.error('[SERVICE] Error:', error)
  // Fallback ou retry logic
  return null
}
```

---

## Suporte e Documentação

### Links Úteis

- **Cloudflare Workers:** https://developers.cloudflare.com/workers/
- **Hono Framework:** https://hono.dev/
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **OpenAI Docs:** https://platform.openai.com/docs

### Monitoramento de Status

- **Cloudflare Status:** https://www.cloudflarestatus.com/
- **Stripe Status:** https://status.stripe.com/
- **OpenAI Status:** https://status.openai.com/
- **Supabase Status:** https://status.supabase.com/

---

## Próximos Passos

1. **Configurar contas** em todos os serviços essenciais (🔴)
2. **Adicionar secrets** ao Cloudflare Workers
3. **Implementar integrações** seguindo a ordem dos sprints
4. **Testar cada integração** individualmente
5. **Deploy em staging** para testes end-to-end
6. **Deploy em produção** após validação completa

---

**Última atualização:** 2025-11-20
**Versão:** 1.0
**Autor:** Claude Code (Anthropic)
