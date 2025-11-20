# Scripts de Automação - investigaree

## 🤖 setup-automation.js

Script que configura automaticamente GitHub e Cloudflare via APIs.

### Pré-requisitos

1. **Node.js 18+** instalado
2. **Cloudflare API Token** com as seguintes permissões:
   - Account Settings (Read)
   - Workers Scripts (Edit)
   - Workers KV Storage (Edit)
   - Workers R2 Storage (Edit)
   - Zone (Read/Edit)
   - DNS (Edit)
   - SSL and Certificates (Edit)
3. **GitHub Personal Access Token (PAT)** com scopes:
   - `repo` (Full control)
   - `workflow` (Update workflows)
   - `admin:repo_hook` (Full control of webhooks)
4. **Cloudflare Account ID**

---

## 📝 Como Obter as Credenciais

### 1. Cloudflare API Token

1. Acesse: https://dash.cloudflare.com/profile/api-tokens
2. Clique em **"Create Token"**
3. Use o template **"Edit Cloudflare Workers"** e adicione:
   - **Zone Resources:** Include > All zones
   - **Permissions:**
     - Account Settings: Read
     - Workers Scripts: Edit
     - Workers KV Storage: Edit
     - Workers R2 Storage: Edit
     - Zone: Read, Edit
     - DNS: Edit
     - SSL and Certificates: Edit
4. Clique em **"Continue to summary"** > **"Create Token"**
5. **Copie o token** (só aparece uma vez!)

### 2. Cloudflare Account ID

1. No dashboard Cloudflare: https://dash.cloudflare.com/
2. Clique em qualquer site
3. Role para baixo na sidebar direita
4. Copie o **Account ID**

### 3. GitHub Personal Access Token

1. Acesse: https://github.com/settings/tokens
2. Clique em **"Generate new token"** > **"Generate new token (classic)"**
3. Nome: `investigaree Setup`
4. Selecione scopes:
   - [x] `repo` (todos os sub-itens)
   - [x] `workflow`
   - [x] `admin:repo_hook` (todos os sub-itens)
5. Clique em **"Generate token"**
6. **Copie o token** (começa com `ghp_`)

---

## 🚀 Como Usar

### Opção 1: Variáveis de Ambiente

```bash
# Linux/Mac
export GITHUB_TOKEN="ghp_your_token_here"
export CLOUDFLARE_API_TOKEN="your_cloudflare_token_here"
export CLOUDFLARE_ACCOUNT_ID="your_account_id_here"
export DOMAIN="investigaree.com.br"

node scripts/setup-automation.js
```

```powershell
# Windows PowerShell
$env:GITHUB_TOKEN="ghp_your_token_here"
$env:CLOUDFLARE_API_TOKEN="your_cloudflare_token_here"
$env:CLOUDFLARE_ACCOUNT_ID="your_account_id_here"
$env:DOMAIN="investigaree.com.br"

node scripts/setup-automation.js
```

### Opção 2: Arquivo .env

1. Crie arquivo `.env.automation`:

```bash
GITHUB_TOKEN=ghp_your_token_here
CLOUDFLARE_API_TOKEN=your_cloudflare_token_here
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
DOMAIN=investigaree.com.br
```

2. Execute:

```bash
# Linux/Mac
source .env.automation && node scripts/setup-automation.js

# Windows (PowerShell)
Get-Content .env.automation | ForEach-Object {
  if ($_ -match '^([^=]+)=(.+)$') {
    [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process')
  }
}
node scripts/setup-automation.js
```

---

## 📦 O que o Script Faz Automaticamente

### GitHub:

1. ✅ Cria repositório `dkbot7/investigaree`
2. ✅ Configura descrição e visibilidade
3. ✅ Inicializa com README
4. ✅ Cria workflow de deploy (`.github/workflows/deploy.yml`)
5. ⚠️ Lista secrets que precisam ser adicionados

### Cloudflare:

6. ✅ Cria zona DNS para `investigaree.com.br`
7. ✅ Configura registros DNS:
   - `A` record para root domain
   - `CNAME` para www
   - `TXT` para SPF
8. ✅ Ativa SSL/TLS Full (Strict)
9. ✅ Ativa Always Use HTTPS
10. ✅ Ativa TLS 1.3
11. ✅ Cria KV namespace `investigaree-rate-limits`
12. ✅ Cria R2 bucket `investigaree-reports`

---

## ⚠️ Ações Manuais Necessárias (Pós-Automação)

### 1. Atualizar Nameservers (Obrigatório)

O script vai mostrar os nameservers do Cloudflare. Você precisa:

1. Acessar o painel do seu **registrador de domínio** (Registro.br, GoDaddy, etc)
2. Ir em **DNS/Nameservers**
3. Trocar para os nameservers do Cloudflare (mostrados pelo script)
4. Aguardar propagação (até 24 horas)

### 2. Adicionar Secrets do GitHub

O script lista os secrets necessários. Adicione-os com:

```bash
# Via GitHub CLI (recomendado)
gh secret set CLOUDFLARE_API_TOKEN --body "seu_token_aqui"
gh secret set CLOUDFLARE_ACCOUNT_ID --body "seu_account_id"
gh secret set FIREBASE_WEB_API_KEY --body "sua_key"
gh secret set STRIPE_SECRET_KEY --body "sk_..."
# ... etc
```

Ou via GitHub web:
1. Vá em `Settings` > `Secrets and variables` > `Actions`
2. Clique em **"New repository secret"**
3. Adicione cada secret

### 3. Atualizar wrangler.toml

O script vai mostrar os IDs de KV e R2. Adicione ao `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "KV"
id = "seu_kv_id_aqui"

[[r2_buckets]]
binding = "R2"
bucket_name = "investigaree-reports"
```

### 4. Configurar Secrets do Cloudflare Workers

```bash
wrangler secret put FIREBASE_WEB_API_KEY
wrangler secret put STRIPE_SECRET_KEY
wrangler secret put STRIPE_WEBHOOK_SECRET
wrangler secret put GOOGLE_API_KEY
wrangler secret put GOOGLE_CSE_ID
wrangler secret put DEHASHED_EMAIL
wrangler secret put DEHASHED_API_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put URL_SECRET
wrangler secret put JWT_SECRET
wrangler secret put ENVIRONMENT
wrangler secret put APP_VERSION
```

### 5. Ativar Browser Rendering

1. Acesse: https://dash.cloudflare.com/
2. Workers & Pages > Browser Rendering
3. Clique em **"Enable"**

### 6. Deploy Inicial

```bash
npm install
npm run build
wrangler deploy
```

---

## 🐛 Troubleshooting

### Erro: "401 Unauthorized" no GitHub

- Verifique se o token está correto
- Confirme que o token tem os scopes necessários
- Gere um novo token se necessário

### Erro: "403 Forbidden" no Cloudflare

- Verifique se o API token tem todas as permissões listadas
- Confirme que o Account ID está correto
- Verifique se a conta tem acesso ao recurso (Workers Paid, R2, etc)

### Erro: "Repository already exists"

- Normal! O script vai continuar normalmente
- Se quiser recriar, delete o repositório antes

### Erro: "Zone already exists"

- Normal! O script vai buscar o ID da zona existente
- Se quiser recriar, delete a zona antes (cuidado!)

### DNS não propaga

- Verifique se atualizou os nameservers no registrador
- Aguarde até 24 horas (geralmente 1-2 horas)
- Use `dig investigaree.com.br` para verificar

---

## 📊 Resumo do Processo

```
┌─────────────────────────────────────────┐
│  1. Obter Credenciais                   │
│     - Cloudflare API Token              │
│     - GitHub PAT                        │
│     - Account ID                        │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  2. Executar Script                     │
│     node scripts/setup-automation.js    │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  3. Configuração Automática             │
│     ✅ GitHub repo criado               │
│     ✅ Workflows configurados           │
│     ✅ DNS configurado                  │
│     ✅ SSL ativado                      │
│     ✅ KV/R2 criados                    │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  4. Ações Manuais (5-10 min)            │
│     ⚠️  Atualizar nameservers           │
│     ⚠️  Adicionar secrets               │
│     ⚠️  Ativar Browser Rendering        │
│     ⚠️  Deploy inicial                  │
└─────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  5. ✅ PRONTO!                          │
│     investigaree funcionando              │
└─────────────────────────────────────────┘
```

---

## 🎯 Checklist Pós-Automação

- [ ] Script executou sem erros
- [ ] Repositório criado no GitHub
- [ ] Zona criada no Cloudflare
- [ ] Nameservers atualizados no registrador
- [ ] DNS propagado (verificar com `dig` ou `nslookup`)
- [ ] Secrets adicionados no GitHub
- [ ] IDs de KV/R2 adicionados ao wrangler.toml
- [ ] Secrets configurados no Cloudflare Workers
- [ ] Browser Rendering ativado
- [ ] Build executado com sucesso (`npm run build`)
- [ ] Deploy realizado (`wrangler deploy`)
- [ ] Site acessível em `https://investigaree.com.br`
- [ ] Health check respondendo: `https://investigaree.com.br/health`

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique as mensagens de erro do script
2. Confirme que todas as credenciais estão corretas
3. Revise os passos manuais necessários
4. Consulte a documentação oficial:
   - Cloudflare API: https://developers.cloudflare.com/api/
   - GitHub API: https://docs.github.com/en/rest

---

**Última atualização:** 2025-11-20
**Versão do script:** 1.0.0
