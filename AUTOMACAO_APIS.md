# Automação Completa via APIs - investigaree

**Data:** 2025-11-20
**APIs Disponíveis:** Cloudflare API + GitHub API

## 🎯 O que posso configurar AUTOMATICAMENTE

Com acesso às APIs do Cloudflare e GitHub, posso configurar **QUASE TUDO** automaticamente, exceto algumas aprovações e validações de segurança que exigem ação manual do proprietário da conta.

---

## 📊 Resumo de Capacidades

| Recurso | Cloudflare API | GitHub API | Automação | Observações |
|---------|----------------|------------|-----------|-------------|
| **DNS Records** | ✅ Total | - | 100% | A, AAAA, CNAME, TXT, MX, etc |
| **Zonas** | ✅ Total | - | 100% | Criar, configurar, deletar |
| **Workers** | ✅ Total | - | 95% | Deploy, bindings, routes |
| **KV Namespaces** | ✅ Total | - | 100% | Criar, popular dados |
| **R2 Buckets** | ✅ Total | - | 100% | Criar, configurar CORS |
| **Workers Secrets** | ✅ Total | - | 100% | Encrypted values |
| **Repositório** | - | ✅ Total | 100% | Criar, configurar |
| **GitHub Actions** | - | ✅ Total | 100% | Workflows, secrets |
| **GitHub Secrets** | - | ✅ Total | 100% | Repository/Environment |
| **Deployments** | ✅ Total | ✅ Total | 100% | CI/CD automático |

---

## 🔧 CLOUDFLARE API - O que posso fazer

### 1. ✅ Gerenciamento de DNS (100% Automático)

**Endpoint:** `https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records`

**Posso fazer:**
- ✅ Criar registros A/AAAA para `investigaree.com.br` → IP do Cloudflare
- ✅ Criar CNAME para `www.investigaree.com.br` → `investigaree.com.br`
- ✅ Criar registros TXT para verificação de domínio
- ✅ Configurar MX records para email
- ✅ Configurar SPF, DKIM, DMARC (TXT records)
- ✅ Atualizar TTL de todos os registros
- ✅ Ativar/desativar proxy do Cloudflare (orange cloud)
- ✅ Deletar registros antigos

**Exemplo de automação:**
```bash
# Criar registro A
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "investigaree.com.br",
    "content": "192.0.2.1",
    "ttl": 3600,
    "proxied": true
  }'

# Criar CNAME para www
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/dns_records" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "CNAME",
    "name": "www",
    "content": "investigaree.com.br",
    "ttl": 3600,
    "proxied": true
  }'
```

---

### 2. ✅ Criação e Configuração de Zona (100% Automático)

**Endpoint:** `https://api.cloudflare.com/client/v4/zones`

**Posso fazer:**
- ✅ Criar zona para `investigaree.com.br`
- ✅ Configurar planos (Free/Pro/Business/Enterprise)
- ✅ Configurar nameservers
- ✅ Ativar recursos (SSL, WAF, Firewall, etc)

**Exemplo:**
```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "investigaree.com.br",
    "account": {
      "id": "{account_id}"
    },
    "jump_start": true,
    "type": "full"
  }'
```

---

### 3. ✅ Workers Deployment (95% Automático)

**Endpoint:** `https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}`

**Posso fazer:**
- ✅ Fazer upload do código do Worker
- ✅ Configurar rotas (routes)
- ✅ Configurar bindings (KV, R2, Durable Objects)
- ✅ Configurar variáveis de ambiente
- ✅ Configurar secrets (encrypted)
- ⚠️ Não posso: Ativar plano Paid inicialmente (requer aprovação manual da conta)

**Exemplo de deploy:**
```bash
# Upload Worker
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/investigaree-api" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/javascript" \
  --data-binary "@dist/index.js"

# Configurar rota
curl -X PUT "https://api.cloudflare.com/client/v4/zones/{zone_id}/workers/routes" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "pattern": "investigaree.com.br/*",
    "script": "investigaree-api"
  }'
```

---

### 4. ✅ Workers Secrets (100% Automático)

**Endpoint:** `https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}/secrets`

**Posso fazer:**
- ✅ Adicionar todos os secrets necessários
- ✅ Atualizar secrets
- ✅ Listar nomes de secrets (valores são sempre ocultos)
- ✅ Deletar secrets

**Exemplo:**
```bash
# Adicionar secret
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/investigaree-api/secrets" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "FIREBASE_WEB_API_KEY",
    "text": "AIzaSy...",
    "type": "secret_text"
  }'
```

---

### 5. ✅ KV Namespaces (100% Automático)

**Endpoint:** `https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces`

**Posso fazer:**
- ✅ Criar namespace para rate limiting
- ✅ Popular dados iniciais
- ✅ Configurar bindings no Worker
- ✅ Fazer CRUD de keys/values

**Exemplo:**
```bash
# Criar namespace
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "title": "investigaree-rate-limits"
  }'

# Escrever valor
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/storage/kv/namespaces/{namespace_id}/values/rate_limit:127.0.0.1" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: text/plain" \
  --data "5"
```

---

### 6. ✅ R2 Buckets (100% Automático)

**Endpoint:** `https://api.cloudflare.com/client/v4/accounts/{account_id}/r2/buckets`

**Posso fazer:**
- ✅ Criar bucket para PDFs
- ✅ Configurar CORS
- ✅ Configurar public access
- ✅ Upload de arquivos
- ✅ Configurar lifecycle policies

**Exemplo:**
```bash
# Criar bucket
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/r2/buckets" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "investigaree-reports"
  }'

# Configurar CORS
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/r2/buckets/investigaree-reports/cors" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "corsRules": [{
      "allowedOrigins": ["https://investigaree.com.br"],
      "allowedMethods": ["GET"],
      "allowedHeaders": ["*"],
      "maxAgeSeconds": 3600
    }]
  }'
```

---

### 7. ⚠️ Browser Rendering (Manual)

**Limitação:**
- ⚠️ Precisa ser ativado manualmente no dashboard
- ⚠️ Não há endpoint público de API para ativar
- ✅ Depois de ativado, o binding pode ser configurado via API

**Ação necessária:**
1. Acesse Cloudflare Dashboard
2. Workers & Pages > Browser Rendering
3. Clique em "Enable"
4. Depois disso, posso configurar o binding via API

---

### 8. ✅ Pages Deployment (100% Automático)

**Endpoint:** Integração via GitHub Actions ou Direct Upload API

**Posso fazer:**
- ✅ Conectar repositório GitHub
- ✅ Configurar build settings
- ✅ Configurar variáveis de ambiente
- ✅ Deploy via Wrangler

**Exemplo de GitHub Action:**
```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=investigaree
```

---

### 9. ✅ SSL/TLS Configuration (100% Automático)

**Endpoint:** `https://api.cloudflare.com/client/v4/zones/{zone_id}/settings`

**Posso fazer:**
- ✅ Ativar SSL automático
- ✅ Configurar modo SSL (Flexible/Full/Full Strict)
- ✅ Ativar HSTS
- ✅ Configurar TLS 1.3
- ✅ Ativar Always Use HTTPS

**Exemplo:**
```bash
# Ativar Always Use HTTPS
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/{zone_id}/settings/always_use_https" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "value": "on"
  }'

# Configurar SSL Full Strict
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/{zone_id}/settings/ssl" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "value": "strict"
  }'
```

---

## 🐙 GITHUB API - O que posso fazer

### 1. ✅ Criação de Repositório (100% Automático)

**Endpoint:** `https://api.github.com/user/repos` ou `https://api.github.com/orgs/{org}/repos`

**Posso fazer:**
- ✅ Criar repositório `dkbot7/investigaree`
- ✅ Configurar descrição
- ✅ Definir visibilidade (public/private)
- ✅ Inicializar com README
- ✅ Adicionar .gitignore
- ✅ Adicionar licença

**Exemplo:**
```bash
curl -X POST "https://api.github.com/user/repos" \
  -H "Authorization: token {github_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "investigaree",
    "description": "investigaree - Investigação Digital e Due Diligence",
    "private": false,
    "auto_init": true,
    "gitignore_template": "Node",
    "license_template": "mit"
  }'
```

---

### 2. ✅ Push de Código (100% Automático)

**Método:** Git API ou Git Commands via API

**Posso fazer:**
- ✅ Criar estrutura de pastas
- ✅ Fazer upload de todos os arquivos
- ✅ Fazer commit inicial
- ✅ Criar branches (main, develop, etc)
- ✅ Fazer push

**Exemplo (usando Git CLI):**
```bash
git init
git remote add origin https://github.com/dkbot7/investigaree.git
git add .
git commit -m "Initial commit - investigaree MVP"
git push -u origin main
```

**Ou via API (Contents API):**
```bash
# Criar arquivo
curl -X PUT "https://api.github.com/repos/dkbot7/investigaree/contents/README.md" \
  -H "Authorization: token {github_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "message": "Add README",
    "content": "IyBTdGFydEludGVsCg=="
  }'
```

---

### 3. ✅ GitHub Actions Secrets (100% Automático)

**Endpoint:** `https://api.github.com/repos/{owner}/{repo}/actions/secrets`

**Posso fazer:**
- ✅ Adicionar todos os secrets do Cloudflare
- ✅ Configurar secrets de ambiente
- ✅ Configurar secrets de organização

**IMPORTANTE:** Secrets precisam ser encriptados com chave pública do repositório antes de serem enviados.

**Exemplo:**
```bash
# 1. Obter public key
curl "https://api.github.com/repos/dkbot7/investigaree/actions/secrets/public-key" \
  -H "Authorization: token {github_token}"

# 2. Encriptar secret (usando libsodium)
# Pseudocódigo:
encrypted_value = encrypt_with_libsodium(secret_value, public_key)

# 3. Criar secret
curl -X PUT "https://api.github.com/repos/dkbot7/investigaree/actions/secrets/CLOUDFLARE_API_TOKEN" \
  -H "Authorization: token {github_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "encrypted_value": "{encrypted_value}",
    "key_id": "{key_id}"
  }'
```

---

### 4. ✅ GitHub Actions Workflows (100% Automático)

**Método:** Commit de arquivos YAML em `.github/workflows/`

**Posso fazer:**
- ✅ Criar workflow de deploy automático
- ✅ Configurar triggers (push, PR, manual)
- ✅ Configurar jobs e steps
- ✅ Integração com Cloudflare
- ✅ Testes automatizados

**Exemplo de workflow:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloudflare
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
```

---

### 5. ✅ GitHub Variables (100% Automático)

**Endpoint:** `https://api.github.com/repos/{owner}/{repo}/actions/variables`

**Posso fazer:**
- ✅ Criar variáveis públicas (não sensíveis)
- ✅ Configurar por ambiente
- ✅ Atualizar valores

**Exemplo:**
```bash
curl -X POST "https://api.github.com/repos/dkbot7/investigaree/actions/variables" \
  -H "Authorization: token {github_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "APP_VERSION",
    "value": "1.0.0"
  }'
```

---

### 6. ✅ Environments (100% Automático)

**Endpoint:** `https://api.github.com/repos/{owner}/{repo}/environments`

**Posso fazer:**
- ✅ Criar ambientes (production, staging, development)
- ✅ Configurar protection rules
- ✅ Configurar secrets por ambiente
- ✅ Configurar deployment branches

**Exemplo:**
```bash
curl -X PUT "https://api.github.com/repos/dkbot7/investigaree/environments/production" \
  -H "Authorization: token {github_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "wait_timer": 0,
    "reviewers": [],
    "deployment_branch_policy": {
      "protected_branches": true,
      "custom_branch_policies": false
    }
  }'
```

---

### 7. ✅ Webhooks (100% Automático)

**Endpoint:** `https://api.github.com/repos/{owner}/{repo}/hooks`

**Posso fazer:**
- ✅ Configurar webhooks para deploy
- ✅ Notificações de PR/push
- ✅ Integração com serviços externos

**Exemplo:**
```bash
curl -X POST "https://api.github.com/repos/dkbot7/investigaree/hooks" \
  -H "Authorization: token {github_token}" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "web",
    "active": true,
    "events": ["push", "pull_request"],
    "config": {
      "url": "https://investigaree.com.br/api/webhooks/github",
      "content_type": "json",
      "secret": "your_webhook_secret"
    }
  }'
```

---

## 🤖 AUTOMAÇÃO COMPLETA - Fluxo de Setup

### O que posso automatizar 100%:

```bash
#!/bin/bash
# Script de automação completa

# 1. GITHUB
# ✅ Criar repositório
# ✅ Push inicial de código
# ✅ Configurar Actions secrets
# ✅ Criar workflows
# ✅ Configurar environments

# 2. CLOUDFLARE
# ✅ Criar zona DNS
# ✅ Configurar registros DNS (A, CNAME, TXT, MX)
# ✅ Ativar SSL/TLS
# ✅ Criar KV namespace
# ✅ Criar R2 bucket
# ✅ Deploy Worker
# ✅ Configurar Workers secrets
# ✅ Configurar rotas
# ✅ Configurar bindings
```

---

## ⚠️ O que PRECISA de Ação Manual

### Cloudflare:

1. **Primeira ação manual obrigatória:**
   - Criar conta no Cloudflare
   - Gerar API Token com permissões apropriadas

2. **Browser Rendering:**
   - Ativar no dashboard (não há API pública)

3. **Paid Plan (se necessário):**
   - Upgrade para Workers Paid ($5/mês)
   - Requer aprovação de cobrança

4. **Domínio:**
   - Transferir nameservers para Cloudflare
   - Esperar propagação DNS (pode levar até 24h)

### GitHub:

1. **Primeira ação manual obrigatória:**
   - Criar conta no GitHub
   - Gerar Personal Access Token (PAT) com scopes apropriados

2. **OAuth Apps (opcional):**
   - Se quiser login social via GitHub

---

## 🔑 Permissões Necessárias

### Cloudflare API Token:

Criar token com as seguintes permissões:

```
✅ Account Settings - Read
✅ Workers Scripts - Edit
✅ Workers KV Storage - Edit
✅ Workers R2 Storage - Edit
✅ Zone - Zone:Read
✅ Zone - Zone:Edit
✅ Zone - DNS:Edit
✅ Zone - Workers Routes:Edit
✅ Zone - SSL and Certificates:Edit
```

### GitHub Personal Access Token (PAT):

Scopes necessários:

```
✅ repo (Full control of private repositories)
✅ workflow (Update GitHub Action workflows)
✅ write:packages (Upload packages)
✅ delete:packages (Delete packages)
✅ admin:repo_hook (Full control of webhooks)
✅ admin:org (Full control of orgs and teams)
```

---

## 🚀 Script de Automação Completa

Posso criar um script que faz TUDO automaticamente:

```bash
#!/bin/bash

# Variáveis
GITHUB_TOKEN="ghp_..."
CLOUDFLARE_API_TOKEN="..."
CLOUDFLARE_ACCOUNT_ID="..."
DOMAIN="investigaree.com.br"

# 1. CRIAR REPOSITÓRIO GITHUB
echo "Creating GitHub repository..."
curl -X POST "https://api.github.com/user/repos" \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "investigaree",
    "description": "investigaree - Due Diligence Platform",
    "private": false,
    "auto_init": true
  }'

# 2. PUSH CÓDIGO
echo "Pushing code..."
git init
git remote add origin https://github.com/dkbot7/investigaree.git
git add .
git commit -m "Initial commit"
git push -u origin main

# 3. CRIAR CLOUDFLARE ZONE
echo "Creating Cloudflare zone..."
ZONE_RESPONSE=$(curl -X POST "https://api.cloudflare.com/client/v4/zones" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"name\": \"$DOMAIN\",
    \"account\": { \"id\": \"$CLOUDFLARE_ACCOUNT_ID\" }
  }")

ZONE_ID=$(echo $ZONE_RESPONSE | jq -r '.result.id')

# 4. CONFIGURAR DNS
echo "Configuring DNS records..."
# A record
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{
    "type": "A",
    "name": "@",
    "content": "192.0.2.1",
    "proxied": true
  }'

# CNAME www
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data "{
    \"type\": \"CNAME\",
    \"name\": \"www\",
    \"content\": \"$DOMAIN\",
    \"proxied\": true
  }"

# 5. CRIAR KV NAMESPACE
echo "Creating KV namespace..."
KV_RESPONSE=$(curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/storage/kv/namespaces" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"title": "investigaree-rate-limits"}')

KV_ID=$(echo $KV_RESPONSE | jq -r '.result.id')

# 6. CRIAR R2 BUCKET
echo "Creating R2 bucket..."
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/r2/buckets" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"name": "investigaree-reports"}'

# 7. DEPLOY WORKER
echo "Deploying Worker..."
npm run build
wrangler deploy

# 8. CONFIGURAR SECRETS
echo "Configuring secrets..."
echo "FIREBASE_WEB_API_KEY" | wrangler secret put FIREBASE_WEB_API_KEY
echo "STRIPE_SECRET_KEY" | wrangler secret put STRIPE_SECRET_KEY
# ... outros secrets

echo "✅ Automação completa!"
```

---

## 📋 Checklist de Automação

### Posso fazer automaticamente:

- [x] Criar repositório GitHub
- [x] Push de código
- [x] Configurar GitHub Actions
- [x] Adicionar GitHub secrets
- [x] Criar zona Cloudflare
- [x] Configurar DNS (A, AAAA, CNAME, TXT, MX)
- [x] Ativar SSL/TLS
- [x] Criar KV namespace
- [x] Criar R2 bucket
- [x] Deploy Workers
- [x] Configurar Workers secrets
- [x] Configurar rotas Workers
- [x] Configurar bindings (KV, R2)
- [x] Configurar CORS no R2
- [x] Criar workflows de CI/CD

### Requer ação manual:

- [ ] Criar conta Cloudflare e gerar API token
- [ ] Criar conta GitHub e gerar PAT
- [ ] Atualizar nameservers do domínio
- [ ] Ativar Browser Rendering (via dashboard)
- [ ] Upgrade para Workers Paid (se necessário)
- [ ] Verificar email do domínio (se aplicável)

---

## 🎯 Conclusão

Com as APIs do Cloudflare e GitHub, posso automatizar **aproximadamente 95%** do setup completo do projeto!

Os únicos passos manuais necessários são:
1. Fornecer os API tokens iniciais
2. Ativar Browser Rendering
3. Atualizar nameservers do domínio

**Tudo o resto pode ser feito programaticamente via API!** 🚀

---

**Precisa que eu execute essa automação?** Me forneça:
1. Cloudflare API Token
2. GitHub Personal Access Token
3. Cloudflare Account ID

E eu posso configurar tudo automaticamente!
