# 🔐 PASSO 3 - CONFIGURAR SECRETS DAS APIS

## ✅ Progresso:

- ✅ **1/14** - Firebase Web API Key (COMPLETO)
- ⏳ **2/14** - Stripe Secret Key
- ⏳ **3/14** - Stripe Webhook Secret
- ⏳ **4/14** - Google API Key
- ⏳ **5/14** - Google CSE ID
- ⏳ **6/14** - DeHashed Email
- ⏳ **7/14** - DeHashed API Key
- ⏳ **8/14** - OpenAI API Key
- ⏳ **9/14** - Supabase URL
- ⏳ **10/14** - Supabase Service Role Key
- ⏳ **11/14** - URL Secret
- ⏳ **12/14** - JWT Secret
- ⏳ **13/14** - Environment
- ⏳ **14/14** - App Version

---

## 📋 PRÓXIMA API: STRIPE (Pagamentos)

### O que é:
Stripe processa os pagamentos dos clientes (cartão de crédito, Pix, boleto)

### Como criar conta:

1. **Acesse:** https://dashboard.stripe.com/register
2. **Crie conta** com seu email
3. **Preencha informações** da empresa
4. **Modo Test:** Pode começar no modo teste (gratuito)

### Como pegar as chaves:

1. **Acesse:** https://dashboard.stripe.com/test/apikeys
2. Você verá duas chaves:
   - **Publishable key** (começa com `pk_test_...`) - NÃO PRECISA DESTA
   - **Secret key** (começa com `sk_test_...`) - ✅ PRECISA DESTA

3. **Clique em "Reveal test key"** na Secret key
4. **Copie a Secret key**

5. **Configure o secret:**
```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
wrangler secret put STRIPE_SECRET_KEY
# Cole a secret key quando solicitado
```

### Webhook Secret (fazer depois):

O Webhook Secret você configura depois de fazer o primeiro deploy. Por enquanto, pode usar um valor dummy:

```bash
wrangler secret put STRIPE_WEBHOOK_SECRET
# Cole: whsec_test_dummy_for_now
```

---

## 📋 PRÓXIMA: GOOGLE CUSTOM SEARCH (OSINT)

### O que é:
Permite fazer buscas no Google via API para investigações OSINT

### Como criar:

1. **Google Cloud Project:**
   - Acesse: https://console.cloud.google.com/
   - Crie novo projeto: `investigaree`

2. **Habilitar Custom Search API:**
   - Acesse: https://console.cloud.google.com/apis/library/customsearch.googleapis.com
   - Clique em "Enable"

3. **Criar API Key:**
   - Acesse: https://console.cloud.google.com/apis/credentials
   - Clique em "Create Credentials" > "API Key"
   - Copie a API Key

4. **Criar Custom Search Engine:**
   - Acesse: https://programmablesearchengine.google.com/
   - Clique em "Add"
   - Nome: `Investigaree Search`
   - Sites to search: `Buscar em toda a web`
   - Depois de criar, copie o **Search engine ID**

5. **Configure os secrets:**
```bash
wrangler secret put GOOGLE_API_KEY
# Cole a API Key

wrangler secret put GOOGLE_CSE_ID
# Cole o Search engine ID
```

---

## 📋 PRÓXIMA: DEHASHED (Vazamentos de Dados)

### O que é:
Verifica se emails/CPFs apareceram em vazamentos de dados

### Como criar:

1. **Acesse:** https://www.dehashed.com/
2. **Crie conta** (plano pago - a partir de $9.99/mês)
3. **Acesse:** https://www.dehashed.com/profile
4. **Copie a API Key**

5. **Configure os secrets:**
```bash
wrangler secret put DEHASHED_EMAIL
# Cole seu email da conta DeHashed

wrangler secret put DEHASHED_API_KEY
# Cole a API Key
```

**Nota:** Se não quiser pagar agora, pode usar valores dummy:
```bash
echo "dummy@email.com" | wrangler secret put DEHASHED_EMAIL
echo "dummy_key" | wrangler secret put DEHASHED_API_KEY
```

---

## 📋 PRÓXIMA: OPENAI (Análise de IA)

### O que é:
GPT-4 para análise inteligente dos dados coletados

### Como criar:

1. **Acesse:** https://platform.openai.com/signup
2. **Crie conta**
3. **Adicione crédito** (mínimo $5)
4. **Acesse:** https://platform.openai.com/api-keys
5. **Clique em "Create new secret key"**
6. **Copie a key** (começa com `sk-...`)

7. **Configure o secret:**
```bash
wrangler secret put OPENAI_API_KEY
# Cole a API Key
```

---

## 📋 PRÓXIMA: SUPABASE (Database)

### O que é:
PostgreSQL hospedado para armazenar dados

### Como criar:

1. **Acesse:** https://supabase.com/dashboard
2. **Crie conta** (GitHub recomendado)
3. **New project:**
   - Name: `investigaree`
   - Database Password: (crie uma senha forte)
   - Region: South America (Brazil)
   - Free plan

4. **Pegar credenciais:**
   - No dashboard do projeto, clique em "Settings" > "API"
   - Copie:
     - **URL** (exemplo: `https://abc123.supabase.co`)
     - **service_role key** (⚠️ NÃO a `anon` key!)

5. **Configure os secrets:**
```bash
wrangler secret put SUPABASE_URL
# Cole a URL

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Cole a service_role key
```

6. **Executar migrations:**
   - No Supabase Dashboard, vá em "SQL Editor"
   - Execute os arquivos:
     - `database/001_initial_schema.sql`
     - `database/002_rls_policies.sql`

---

## 📋 FINAIS: SECRETS DE SEGURANÇA

### Gerar strings aleatórias:

Você precisa de 2 strings aleatórias longas (32+ caracteres) para segurança:

**Opção 1 - PowerShell:**
```powershell
# URL Secret
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})

# JWT Secret
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Opção 2 - Online:**
https://www.random.org/strings/?num=2&len=32&digits=on&upperalpha=on&loweralpha=on

### Configure:
```bash
wrangler secret put URL_SECRET
# Cole a primeira string gerada

wrangler secret put JWT_SECRET
# Cole a segunda string gerada

wrangler secret put ENVIRONMENT
# Cole: production

wrangler secret put APP_VERSION
# Cole: 1.0.0
```

---

## ✅ VERIFICAR TODOS OS SECRETS

Depois de configurar tudo:

```bash
wrangler secret list
```

Você deve ver 14 secrets:
1. FIREBASE_WEB_API_KEY ✅
2. STRIPE_SECRET_KEY
3. STRIPE_WEBHOOK_SECRET
4. GOOGLE_API_KEY
5. GOOGLE_CSE_ID
6. DEHASHED_EMAIL
7. DEHASHED_API_KEY
8. OPENAI_API_KEY
9. SUPABASE_URL
10. SUPABASE_SERVICE_ROLE_KEY
11. URL_SECRET
12. JWT_SECRET
13. ENVIRONMENT
14. APP_VERSION

---

## 🚀 DEPOIS DE CONFIGURAR TUDO

Me avise e faremos o deploy final!

```bash
npm run build
wrangler deploy
```

---

**Dica:** Você pode fazer aos poucos! Configure as APIs mais importantes primeiro (Firebase, Stripe, OpenAI, Supabase) e as outras depois.
