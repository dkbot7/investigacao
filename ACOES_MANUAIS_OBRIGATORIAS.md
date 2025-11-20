# ⚠️ 3 AÇÕES MANUAIS OBRIGATÓRIAS

**Não é possível fazer via API - Requer acesso ao Cloudflare Dashboard**

---

## 1️⃣ HABILITAR R2 STORAGE (2 minutos)

### Link direto:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627

### Passo a passo:
1. Clique no menu lateral: **Workers & Pages**
2. Clique em **R2**
3. Clique no botão **"Enable R2"** ou **"Get Started"**
4. Aceite os termos (10GB grátis/mês no plano Free)

### Depois de habilitar, crie o bucket:
1. Clique em **"Create bucket"**
2. Nome: `investigaree-reports`
3. Location: **Automatic**
4. Clique em **"Create bucket"**

### Depois de criar, atualize wrangler.toml:
Abra `wrangler.toml` e descomente as linhas:
```toml
# REMOVER o comentário # dessas linhas:
[[r2_buckets]]
binding = "R2"
bucket_name = "investigaree-reports"
```

---

## 2️⃣ HABILITAR BROWSER RENDERING (1 minuto)

### Link direto:
https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627

### Passo a passo:
1. Clique no menu lateral: **Workers & Pages**
2. Clique em **Browser Rendering**
3. Clique no botão **"Enable Browser Rendering"**

**PRONTO!** O binding já está configurado no `wrangler.toml`.

---

## 3️⃣ CONFIGURAR SECRETS DO WORKERS (10-15 minutos)

### Você precisa configurar as credenciais das APIs externas:

Abra o terminal no diretório do projeto e execute:

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA

# Firebase Authentication
wrangler secret put FIREBASE_WEB_API_KEY
# Cole a Web API Key do Firebase: https://console.firebase.google.com/

# Stripe Payments
wrangler secret put STRIPE_SECRET_KEY
# Cole a Secret Key: https://dashboard.stripe.com/apikeys

wrangler secret put STRIPE_WEBHOOK_SECRET
# Cole o Webhook Secret: https://dashboard.stripe.com/webhooks

# Google Custom Search
wrangler secret put GOOGLE_API_KEY
# Cole a API Key: https://console.cloud.google.com/apis/credentials

wrangler secret put GOOGLE_CSE_ID
# Cole o Search Engine ID: https://programmablesearchengine.google.com/

# DeHashed (Data Breach Checking)
wrangler secret put DEHASHED_EMAIL
# Seu email da conta DeHashed

wrangler secret put DEHASHED_API_KEY
# API Key do DeHashed

# OpenAI (AI Analysis)
wrangler secret put OPENAI_API_KEY
# Cole a API Key: https://platform.openai.com/api-keys

# Supabase (Database)
wrangler secret put SUPABASE_URL
# Formato: https://xyz.supabase.co

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Service Role Key (não a anon key!)

# Security Secrets (gere strings aleatórias longas)
wrangler secret put URL_SECRET
# Cole uma string aleatória longa (32+ caracteres)

wrangler secret put JWT_SECRET
# Cole uma string aleatória longa (32+ caracteres)

# Environment Config
wrangler secret put ENVIRONMENT
# Cole: production

wrangler secret put APP_VERSION
# Cole: 1.0.0
```

### Verificar se todos os secrets foram configurados:
```bash
wrangler secret list
```

---

## 4️⃣ SUPABASE DATABASE (OPCIONAL - se quiser usar)

Se for usar o Supabase como database:

1. Crie projeto: https://supabase.com/dashboard/new
2. No SQL Editor, execute os arquivos:
   - `database/001_initial_schema.sql`
   - `database/002_rls_policies.sql`

---

## 🚀 DEPOIS DE COMPLETAR AS 3 AÇÕES ACIMA

Execute o deploy:

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA

# Build do projeto
npm run build

# Deploy para Cloudflare Workers
wrangler deploy

# Ver logs em tempo real
wrangler tail
```

---

## ✅ CHECKLIST RÁPIDO

- [ ] R2 habilitado no dashboard
- [ ] Bucket `investigaree-reports` criado
- [ ] wrangler.toml atualizado (descomentar R2)
- [ ] Browser Rendering habilitado
- [ ] Todos os 14 secrets configurados (verificar com `wrangler secret list`)
- [ ] Build executado sem erros
- [ ] Deploy realizado com sucesso

---

## 🔗 Links Úteis

- **Cloudflare Dashboard**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627
- **GitHub Repo**: https://github.com/dkbot7/investigaree
- **Domain** (após deploy): https://investigaree.com.br

---

## 📞 Comandos Úteis

```bash
# Verificar secrets configurados
wrangler secret list

# Ver logs do Workers
wrangler tail

# Testar localmente
npm run dev

# Verificar status do deploy
curl https://investigaree.com.br/health
```

---

**Status Atual**: Infraestrutura 95% pronta
**Pendente**: 3 ações manuais no dashboard + configurar secrets
**Tempo estimado**: 15-20 minutos
