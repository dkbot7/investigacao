# ✅ Setup Completo - Investigaree

**Data**: 2025-11-20
**Status**: Infraestrutura Cloudflare configurada automaticamente

---

## 🎉 O que foi configurado automaticamente

### ☁️ Cloudflare

#### ✅ DNS Records (Zona ATIVA)
- **A Record** (root): `investigaree.com.br` → `192.0.2.1` (proxied) ✓
- **CNAME** (www): `www.investigaree.com.br` → `investigaree.com.br` (proxied) ✓
- **TXT** (SPF): `v=spf1 include:_spf.google.com ~all` ✓

#### ✅ SSL/TLS Configurado
- **SSL Mode**: Full (Strict) ✓
- **Always Use HTTPS**: Enabled ✓
- **TLS 1.3**: Enabled ✓
- **Automatic HTTPS Rewrites**: Enabled ✓
- **Certificate Status**: ACTIVE ✓

#### ✅ KV Namespace Criado
- **ID**: `afa4a891f4994709977bcd583fb3f285`
- **Title**: `investigaree-rate-limits`
- **Binding**: `KV` (configurado no wrangler.toml)

#### ✅ Configurações Atualizadas
- **wrangler.toml**: Account ID e KV ID configurados ✓

---

## ⚠️ Ações Manuais Necessárias

### 1. Habilitar R2 Storage (OBRIGATÓRIO)

O R2 precisa ser habilitado manualmente no dashboard:

1. Acesse: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627
2. Vá em **Workers & Pages** > **R2**
3. Clique em **"Enable R2"** ou **"Get Started"**
4. Aceite os termos (R2 tem 10GB grátis/mês)

Depois de habilitar, execute:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/ce11d202b2917777965b5131b5edc627/r2/buckets" \
  -H "Authorization: Bearer Gsiqiz92kpu4BYwTmNnc_0SE3RlSrxg7GfxM_lXT" \
  -H "Content-Type: application/json" \
  --data '{"name":"investigaree-reports","locationHint":"auto"}'
```

Ou crie pelo dashboard:
- Nome do bucket: `investigaree-reports`
- Location: Auto

Depois, adicione ao `wrangler.toml`:

```toml
[[r2_buckets]]
binding = "R2"
bucket_name = "investigaree-reports"
```

---

### 2. Habilitar Browser Rendering (OBRIGATÓRIO)

Para geração de PDFs com Puppeteer:

1. Acesse: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627
2. Vá em **Workers & Pages** > **Browser Rendering**
3. Clique em **"Enable Browser Rendering"**

Depois, adicione ao `wrangler.toml`:

```toml
[browser]
binding = "BROWSER"
```

---

### 3. Criar GitHub Personal Access Token

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token (classic)"**
3. Configure:
   - **Note**: `Investigaree Setup`
   - **Scopes**:
     - ✅ `repo` (Full control)
     - ✅ `workflow` (Update workflows)
     - ✅ `admin:repo_hook` (Webhooks)
4. Clique em **"Generate token"**
5. **COPIE O TOKEN** (começa com `ghp_...`)

Salve no `.env.automation`:

```bash
GITHUB_TOKEN=ghp_seu_token_aqui
```

Depois execute o script de automação:

```bash
node scripts/setup-automation.js
```

Isso irá criar automaticamente:
- Repositório `dkbot7/investigaree`
- Workflow de CI/CD (`.github/workflows/deploy.yml`)
- Configuração de secrets

---

### 4. Configurar Secrets do Cloudflare Workers

Execute os comandos abaixo e cole os valores quando solicitado:

```bash
# Firebase
wrangler secret put FIREBASE_WEB_API_KEY

# Stripe
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET

# Google
wrangler secret put GOOGLE_API_KEY
wrangler secret put GOOGLE_CSE_ID

# DeHashed
wrangler secret put DEHASHED_EMAIL
wrangler secret put DEHASHED_API_KEY

# OpenAI
wrangler secret put OPENAI_API_KEY

# Supabase
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY

# Secrets gerais
wrangler secret put URL_SECRET
wrangler secret put JWT_SECRET
wrangler secret put ENVIRONMENT
wrangler secret put APP_VERSION
```

---

### 5. Configurar Database no Supabase

1. Crie projeto no Supabase: https://supabase.com/dashboard/new
2. No SQL Editor, execute:
   - `database/001_initial_schema.sql`
   - `database/002_rls_policies.sql`

---

## 📊 Resumo de IDs e Credenciais

```bash
# Cloudflare
CLOUDFLARE_ACCOUNT_ID=ce11d202b2917777965b5131b5edc627
CLOUDFLARE_ZONE_ID=e7730e556b85c0860e1873f497c1c085
CLOUDFLARE_API_TOKEN=Gsiqiz92kpu4BYwTmNnc_0SE3RlSrxg7GfxM_lXT

# KV Namespace
KV_NAMESPACE_ID=afa4a891f4994709977bcd583fb3f285

# Domain
investigaree.com.br (ZONA ATIVA)
```

---

## 🚀 Próximos Passos (em ordem)

- [ ] 1. Habilitar R2 no dashboard Cloudflare
- [ ] 2. Criar bucket R2 `investigaree-reports`
- [ ] 3. Habilitar Browser Rendering
- [ ] 4. Criar GitHub Personal Access Token
- [ ] 5. Executar `node scripts/setup-automation.js`
- [ ] 6. Configurar secrets do Workers (wrangler secret put)
- [ ] 7. Criar projeto no Supabase e executar migrations
- [ ] 8. Configurar APIs externas (Firebase, Stripe, OpenAI, etc.)
- [ ] 9. Testar localmente: `npm run dev`
- [ ] 10. Deploy para produção: `wrangler deploy`

---

## 🔍 Verificar Status

```bash
# Testar token Cloudflare
curl "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer Gsiqiz92kpu4BYwTmNnc_0SE3RlSrxg7GfxM_lXT"

# Verificar zona DNS
curl "https://api.cloudflare.com/client/v4/zones/e7730e556b85c0860e1873f497c1c085" \
  -H "Authorization: Bearer Gsiqiz92kpu4BYwTmNnc_0SE3RlSrxg7GfxM_lXT"

# Listar DNS records
curl "https://api.cloudflare.com/client/v4/zones/e7730e556b85c0860e1873f497c1c085/dns_records" \
  -H "Authorization: Bearer Gsiqiz92kpu4BYwTmNnc_0SE3RlSrxg7GfxM_lXT"

# Verificar SSL
curl "https://api.cloudflare.com/client/v4/zones/e7730e556b85c0860e1873f497c1c085/settings/ssl" \
  -H "Authorization: Bearer Gsiqiz92kpu4BYwTmNnc_0SE3RlSrxg7GfxM_lXT"

# Listar KV namespaces
curl "https://api.cloudflare.com/client/v4/accounts/ce11d202b2917777965b5131b5edc627/storage/kv/namespaces" \
  -H "Authorization: Bearer Gsiqiz92kpu4BYwTmNnc_0SE3RlSrxg7GfxM_lXT"
```

---

## 📚 Documentação de Referência

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Cloudflare KV](https://developers.cloudflare.com/kv/)
- [Cloudflare DNS](https://developers.cloudflare.com/dns/)
- [Browser Rendering](https://developers.cloudflare.com/browser-rendering/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

**Última atualização**: 2025-11-20
**Progresso**: 60% concluído (infraestrutura base configurada)
