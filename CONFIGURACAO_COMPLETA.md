# ✅ Configuração Completa - Projeto Investigacao

## 🎉 O que foi feito

### 1. ✅ Migração do Projeto
- ✅ Renomeado de `investigaree` para `investigacao`
- ✅ Todos os arquivos de configuração atualizados
- ✅ Git configurado com repositório independente: https://github.com/dkbot7/investigacao
- ✅ Commits e push realizados

### 2. ✅ Recursos Cloudflare Criados
- ✅ **D1 Database**: `investigacao-db`
  - ID: `55450973-0441-4aa6-964c-c4519902092c`
- ✅ **KV Namespace**: `investigacao-rate-limits`
  - ID: `a04f4f78d7724b47a1a9a9717dbaa880`
- ✅ **R2 Bucket**: `investigacao-storage`

### 3. ✅ Documentação Criada
- ✅ `investigacao/.env.example` - Template de variáveis de ambiente
- ✅ `SETUP_SECRETS.md` - Guia completo de configuração de secrets
- ✅ `GITHUB_SECRETS_SETUP.md` - Passo a passo para GitHub Actions
- ✅ `scripts/setup-cloudflare-secrets.sh` - Script automático (Bash/Linux/Mac)
- ✅ `scripts/setup-cloudflare-secrets.ps1` - Script automático (PowerShell/Windows)

### 4. ✅ Workflows Atualizados
- ✅ `.github/workflows/deploy.yml` atualizado para usar `investigacao`

---

## 📋 Próximos Passos

### 🔴 CRÍTICO - Configure os Secrets

#### 1. Secrets do GitHub (para deploy automático)

Acesse: https://github.com/dkbot7/investigacao/settings/secrets/actions

**Obrigatórios:**
1. `CLOUDFLARE_API_TOKEN` - Token de API do Cloudflare
2. `CLOUDFLARE_ACCOUNT_ID` - `ce11d202b2917777965b5131b5edc627`
3. `NEXT_PUBLIC_FIREBASE_API_KEY` - API Key do Firebase
4. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - Auth domain do Firebase
5. `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - Project ID do Firebase
6. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - Storage bucket do Firebase
7. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Sender ID do Firebase
8. `NEXT_PUBLIC_FIREBASE_APP_ID` - App ID do Firebase
9. `FIREBASE_ADMIN_CREDENTIALS` - JSON completo do Service Account

**Ver instruções detalhadas em:** `GITHUB_SECRETS_SETUP.md`

#### 2. Secrets do Cloudflare Workers (para a aplicação funcionar)

**Opção A - Script Automático (Recomendado):**
```powershell
# Windows
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGACAO2
.\scripts\setup-cloudflare-secrets.ps1
```

```bash
# Linux/Mac
cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGACAO2
bash scripts/setup-cloudflare-secrets.sh
```

**Opção B - Manual:**

Siga as instruções em `SETUP_SECRETS.md`

---

### 🟡 IMPORTANTE - Migre o Banco de Dados

Execute as migrations no novo banco D1:

```bash
cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGACAO2

# Se tiver o arquivo de schema
npx wrangler d1 execute investigacao-db --file=database/schema.sql

# OU se tiver migrations
npx wrangler d1 migrations apply investigacao-db
```

---

### 🟢 OPCIONAL - Configure Domínio

#### Se você tiver o domínio `investigacao.com.br`:

1. No Cloudflare Dashboard:
   - Adicione o domínio `investigacao.com.br` como uma nova zona
   - Configure os nameservers no seu registrador de domínio

2. No Cloudflare Pages:
   - Crie um novo projeto conectado ao GitHub: `dkbot7/investigacao`
   - Configure o domínio customizado

#### Se não tiver domínio:

O projeto funcionará em um subdomínio do Cloudflare Workers:
- `investigacao-api.workers.dev`

---

## 🚀 Deploy

### Método 1: Deploy Automático via GitHub Actions (Recomendado)

Após configurar os secrets do GitHub:

```bash
cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGACAO2
git add .
git commit -m "feat: Configurar secrets e variáveis de ambiente"
git push
```

Acompanhe em: https://github.com/dkbot7/investigacao/actions

### Método 2: Deploy Manual

```bash
cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGACAO2/investigacao

# Build
npm install
npx @opennextjs/cloudflare build

# Deploy
npx wrangler deploy
```

---

## 🔍 Verificação

### 1. Verificar Secrets do Cloudflare

```bash
cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGACAO2
npx wrangler secret list
```

### 2. Verificar Secrets do GitHub

Acesse: https://github.com/dkbot7/investigacao/settings/secrets/actions

### 3. Verificar Recursos do Cloudflare

```bash
# D1 Database
npx wrangler d1 list

# KV Namespaces
npx wrangler kv namespace list

# R2 Buckets
npx wrangler r2 bucket list

# Workers
npx wrangler deployments list
```

### 4. Testar Aplicação Localmente

```bash
cd investigacao
npm install
npm run dev
```

Acesse: http://localhost:3000

---

## 📁 Estrutura do Projeto

```
INVESTIGACAO2/
├── investigacao/              # Aplicação Next.js principal
│   ├── src/                   # Código fonte
│   ├── public/                # Arquivos estáticos
│   ├── .env.example           # Template de variáveis (NÃO commitar .env.local!)
│   ├── package.json
│   ├── next.config.ts
│   ├── wrangler.jsonc         # Config do Cloudflare Workers
│   └── .github/workflows/     # GitHub Actions
│
├── backend/                   # APIs backend (Workers)
│   └── workers/
│       └── api/
│           ├── src/
│           ├── wrangler.toml
│           └── package.json
│
├── database/                  # Schemas e migrations D1
├── scripts/                   # Scripts auxiliares
│   ├── setup-cloudflare-secrets.sh
│   └── setup-cloudflare-secrets.ps1
│
├── docs/                      # Documentação
├── wrangler.toml             # Config principal do Cloudflare
├── SETUP_SECRETS.md          # Guia de secrets
├── GITHUB_SECRETS_SETUP.md   # Guia GitHub
└── CONFIGURACAO_COMPLETA.md  # Este arquivo
```

---

## 🔐 Segurança

### ⚠️ NUNCA:
- ❌ Commitar arquivos `.env` ou `.env.local` no git
- ❌ Compartilhar secrets em mensagens ou chat
- ❌ Usar secrets de produção em desenvolvimento
- ❌ Deixar secrets expostos em logs

### ✅ SEMPRE:
- ✅ Use variáveis de ambiente para secrets
- ✅ Rotacione secrets regularmente (90 dias)
- ✅ Use secrets diferentes para dev/staging/prod
- ✅ Guarde backups em gerenciador de senhas

---

## 📚 Documentação Importante

- [SETUP_SECRETS.md](./SETUP_SECRETS.md) - Configuração de secrets completa
- [GITHUB_SECRETS_SETUP.md](./GITHUB_SECRETS_SETUP.md) - Secrets do GitHub passo a passo
- [investigacao/README.md](./investigacao/README.md) - Documentação da aplicação
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Next.js Docs](https://nextjs.org/docs)

---

## 🆘 Suporte

### Problemas Comuns

**Erro: "Worker not found"**
- O worker ainda não foi deployado. Execute: `npx wrangler deploy`

**Erro: "Secret not found"**
- Configure os secrets conforme `SETUP_SECRETS.md`

**Build falha no GitHub Actions**
- Verifique se todos os secrets do GitHub foram configurados
- Veja os logs em: https://github.com/dkbot7/investigacao/actions

**Firebase não inicializa**
- Verifique se o JSON do `FIREBASE_ADMIN_CREDENTIALS` está em uma linha
- Valide o JSON em: https://jsonlint.com

---

## ✅ Checklist Final

Use este checklist para garantir que tudo está pronto:

### Configuração Inicial
- [ ] Git configurado e repositório criado
- [ ] Recursos Cloudflare criados (D1, KV, R2)
- [ ] Documentação revisada

### Secrets GitHub
- [ ] `CLOUDFLARE_API_TOKEN` configurado
- [ ] `CLOUDFLARE_ACCOUNT_ID` configurado
- [ ] Todos os `NEXT_PUBLIC_FIREBASE_*` configurados
- [ ] `FIREBASE_ADMIN_CREDENTIALS` configurado

### Secrets Cloudflare
- [ ] `FIREBASE_ADMIN_CREDENTIALS`
- [ ] `OPENAI_API_KEY`
- [ ] `URL_SECRET`
- [ ] `JWT_SECRET`
- [ ] `ENCRYPTION_MASTER_KEY`
- [ ] `STRIPE_SECRET_KEY` (se usar pagamentos)
- [ ] Outros opcionais conforme necessário

### Deploy
- [ ] Banco de dados migrado
- [ ] Deploy realizado com sucesso
- [ ] Aplicação acessível
- [ ] Testes básicos funcionando

---

**Status do Projeto:** ✅ Configuração Base Completa
**Próximo Passo:** Configurar Secrets e fazer primeiro deploy
**Última Atualização:** 2026-01-16

**Repositório GitHub:** https://github.com/dkbot7/investigacao
**Cloudflare Account ID:** ce11d202b2917777965b5131b5edc627
