# 🔐 Configuração de Secrets - Investigacao

Este guia explica como configurar todos os secrets necessários para o projeto Investigacao funcionar corretamente.

## 📋 Índice

1. [Secrets Necessários](#secrets-necessários)
2. [Configuração no Cloudflare Workers](#configuração-no-cloudflare-workers)
3. [Configuração no GitHub Actions](#configuração-no-github-actions)
4. [Configuração Local (.env)](#configuração-local-env)
5. [Verificação](#verificação)

---

## Secrets Necessários

### 🔴 Obrigatórios (Essenciais)

| Secret | Descrição | Onde Obter |
|--------|-----------|------------|
| `FIREBASE_ADMIN_CREDENTIALS` | JSON completo das credenciais do Firebase Admin SDK | Firebase Console → Project Settings → Service Accounts |
| `OPENAI_API_KEY` | Chave da API OpenAI para análises IA | https://platform.openai.com/api-keys |
| `URL_SECRET` | Chave secreta para hash de URLs | Gerar com: `openssl rand -base64 32` |
| `JWT_SECRET` | Chave secreta para tokens JWT | Gerar com: `openssl rand -base64 32` |
| `ENCRYPTION_MASTER_KEY` | Chave mestra para criptografia | Gerar com: `openssl rand -base64 32` |

### 🟡 Recomendados

| Secret | Descrição | Onde Obter |
|--------|-----------|------------|
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe (pagamentos) | https://dashboard.stripe.com/apikeys |
| `STRIPE_WEBHOOK_SECRET` | Secret do webhook Stripe | https://dashboard.stripe.com/webhooks |
| `GOOGLE_API_KEY` | Chave da API Google (Custom Search) | https://console.cloud.google.com/apis/credentials |
| `RESEND_API_KEY` | Chave da API Resend (emails) | https://resend.com/api-keys |

### 🟢 Opcionais

| Secret | Descrição | Onde Obter |
|--------|-----------|------------|
| `API_BRASIL_BEARER_TOKEN` | Token bearer da API Brasil | https://apibrasil.com.br |
| `API_BRASIL_DEVICE_TOKEN` | Token device da API Brasil | https://apibrasil.com.br |
| `DEHASHED_EMAIL` | Email do Dehashed | https://dehashed.com |
| `DEHASHED_API_KEY` | API Key do Dehashed | https://dehashed.com |
| `SERPRO_*_CONSUMER_KEY` | Consumer Keys das APIs SERPRO | https://www.serpro.gov.br |
| `SERPRO_*_CONSUMER_SECRET` | Consumer Secrets das APIs SERPRO | https://www.serpro.gov.br |

---

## Configuração no Cloudflare Workers

### Método 1: Script Automático (Recomendado)

Execute o script que configurará todos os secrets de uma vez:

**Windows (PowerShell):**
```powershell
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGACAO2
.\scripts\setup-cloudflare-secrets.ps1
```

**Linux/Mac (Bash):**
```bash
cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGACAO2
bash scripts/setup-cloudflare-secrets.sh
```

### Método 2: Manual (Cloudflare Dashboard)

1. Acesse o [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navegue para **Workers & Pages** → **investigacao-api**
3. Vá em **Settings** → **Variables and Secrets**
4. Clique em **Add variable** → **Encrypt**
5. Adicione cada secret da lista acima

### Método 3: Manual (Wrangler CLI)

```bash
cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGACAO2

# Secrets obrigatórios
npx wrangler secret put FIREBASE_ADMIN_CREDENTIALS
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put URL_SECRET
npx wrangler secret put JWT_SECRET
npx wrangler secret put ENCRYPTION_MASTER_KEY

# Secrets recomendados
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put GOOGLE_API_KEY
npx wrangler secret put RESEND_API_KEY

# Secrets opcionais
npx wrangler secret put API_BRASIL_BEARER_TOKEN
npx wrangler secret put API_BRASIL_DEVICE_TOKEN
npx wrangler secret put DEHASHED_EMAIL
npx wrangler secret put DEHASHED_API_KEY

# SERPRO (se você tiver)
npx wrangler secret put SERPRO_CPF_CONSUMER_KEY
npx wrangler secret put SERPRO_CPF_CONSUMER_SECRET
npx wrangler secret put SERPRO_CNPJ_CONSUMER_KEY
npx wrangler secret put SERPRO_CNPJ_CONSUMER_SECRET
# ... outros SERPRO conforme necessário
```

---

## Configuração no GitHub Actions

Para que o GitHub Actions possa fazer deploy automaticamente, você precisa configurar secrets no repositório.

### Passo a Passo:

1. Acesse https://github.com/dkbot7/investigacao/settings/secrets/actions

2. Clique em **New repository secret**

3. Adicione os seguintes secrets:

#### Secrets para Deploy do Cloudflare:

| Nome do Secret | Valor | Onde Obter |
|----------------|-------|------------|
| `CLOUDFLARE_API_TOKEN` | Token de API do Cloudflare | Dashboard → My Profile → API Tokens → Create Token |
| `CLOUDFLARE_ACCOUNT_ID` | ce11d202b2917777965b5131b5edc627 | Dashboard → Workers & Pages → Account ID |

**Como criar o CLOUDFLARE_API_TOKEN:**
1. Acesse https://dash.cloudflare.com/profile/api-tokens
2. Clique em **Create Token**
3. Use o template **Edit Cloudflare Workers**
4. Ou crie um custom token com permissões:
   - Account → Workers Scripts → Edit
   - Account → Pages → Edit
   - Zone → Workers Routes → Edit

#### Secrets da Aplicação (para build):

Todos os secrets configurados no Cloudflare Workers também devem ser configurados aqui:

```
FIREBASE_ADMIN_CREDENTIALS
OPENAI_API_KEY
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Arquivo Workflow Atual

O arquivo `.github/workflows/deploy.yml` já está configurado e usa estes secrets automaticamente.

---

## Configuração Local (.env)

Para desenvolvimento local, crie um arquivo `.env.local` na pasta `investigacao/`:

```bash
cd investigacao
cp .env.example .env.local
```

Edite `.env.local` e preencha com seus valores reais. Este arquivo NÃO deve ser commitado ao git (já está no `.gitignore`).

### Exemplo de .env.local:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=investigacao-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=investigacao-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=investigacao-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456

# Firebase Admin (JSON em uma linha)
FIREBASE_ADMIN_CREDENTIALS={"type":"service_account","project_id":"investigacao-prod",...}

# OpenAI
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Segurança (gerar novos!)
URL_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
JWT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ENCRYPTION_MASTER_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8787
```

---

## Verificação

### 1. Verificar Secrets no Cloudflare

```bash
cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGACAO2
npx wrangler secret list
```

Você deve ver uma lista de todos os secrets configurados (os valores não são mostrados por segurança).

### 2. Verificar Secrets no GitHub

1. Acesse: https://github.com/dkbot7/investigacao/settings/secrets/actions
2. Verifique se todos os secrets estão listados

### 3. Testar Build Local

```bash
cd investigacao
npm install
npm run dev
```

Se houver algum secret faltando, a aplicação irá avisar no console.

### 4. Testar Deploy

```bash
cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGACAO2
git add .
git commit -m "test: Verificar configuração de secrets"
git push
```

Acompanhe o deploy em: https://github.com/dkbot7/investigacao/actions

---

## 🔒 Segurança

### ⚠️ NUNCA faça:

- ❌ Commitar arquivos `.env` ou `.env.local` no git
- ❌ Compartilhar secrets em mensagens, emails ou chat
- ❌ Usar secrets de produção em desenvolvimento
- ❌ Deixar secrets expostos em logs

### ✅ Sempre faça:

- ✅ Use variáveis de ambiente para secrets
- ✅ Rotacione secrets regularmente (a cada 90 dias)
- ✅ Use secrets diferentes para dev/staging/prod
- ✅ Guarde backups dos secrets em gerenciador de senhas (1Password, LastPass, etc)
- ✅ Revogue secrets imediatamente se suspeitar de vazamento

---

## 🆘 Troubleshooting

### Erro: "Secret not found"

- Verifique se o secret foi configurado com o nome correto (case-sensitive)
- Execute `npx wrangler secret list` para ver todos os secrets

### Erro: "Authentication failed"

- Verifique se você está logado no Cloudflare: `npx wrangler whoami`
- Se não estiver, faça login: `npx wrangler login`

### Erro no GitHub Actions

- Verifique se todos os secrets estão configurados no repositório
- Verifique os logs em: https://github.com/dkbot7/investigacao/actions

### Firebase não inicializa

- Verifique se o JSON do `FIREBASE_ADMIN_CREDENTIALS` está correto
- Certifique-se de que está em uma única linha (sem quebras)
- Valide o JSON em: https://jsonlint.com

---

## 📚 Recursos

- [Cloudflare Workers Secrets](https://developers.cloudflare.com/workers/configuration/secrets/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [OpenAI API Keys](https://platform.openai.com/docs/api-reference/authentication)
- [Stripe API Keys](https://stripe.com/docs/keys)

---

**Última atualização:** 2026-01-16
