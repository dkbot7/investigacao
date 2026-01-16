# 🔐 Configuração de Secrets no GitHub - Investigacao

## Passo a Passo Completo

### 1. Acesse as Configurações de Secrets do Repositório

1. Acesse: https://github.com/dkbot7/investigacao
2. Clique em **Settings** (no menu superior do repositório)
3. No menu lateral esquerdo, vá em **Secrets and variables** → **Actions**
4. Você verá a página "Actions secrets and variables"

### 2. Configure os Secrets do Cloudflare (OBRIGATÓRIOS)

Estes são necessários para o GitHub Actions fazer o deploy automaticamente:

#### CLOUDFLARE_API_TOKEN

1. Clique em **New repository secret**
2. **Name:** `CLOUDFLARE_API_TOKEN`
3. **Value:** Seu token de API do Cloudflare

**Como obter o token:**
   - Acesse: https://dash.cloudflare.com/profile/api-tokens
   - Clique em **Create Token**
   - Use o template **Edit Cloudflare Workers** OU
   - Crie um custom token com as seguintes permissões:
     - Account → Workers Scripts → Edit
     - Account → Workers KV Storage → Edit
     - Account → Workers R2 Storage → Edit
     - Account → Account Settings → Read
     - Account → D1 → Edit
     - Zone → Workers Routes → Edit
   - Clique em **Continue to summary**
   - Clique em **Create Token**
   - **COPIE O TOKEN AGORA** (você não poderá vê-lo novamente!)
   - Cole no campo Value do GitHub

4. Clique em **Add secret**

#### CLOUDFLARE_ACCOUNT_ID

1. Clique em **New repository secret**
2. **Name:** `CLOUDFLARE_ACCOUNT_ID`
3. **Value:** `ce11d202b2917777965b5131b5edc627`
4. Clique em **Add secret**

### 3. Configure os Secrets do Firebase (OBRIGATÓRIOS)

Estes são necessários para a aplicação Next.js funcionar:

#### NEXT_PUBLIC_FIREBASE_API_KEY

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Project Settings** (ícone de engrenagem)
4. Na aba **General**, role até **Your apps**
5. Se não tiver um app web, clique em **Add app** → **Web** (ícone `</>`)
6. Copie os valores de configuração

No GitHub:
- Clique em **New repository secret**
- **Name:** `NEXT_PUBLIC_FIREBASE_API_KEY`
- **Value:** Cole o valor de `apiKey`
- Clique em **Add secret**

#### NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

- **Name:** `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- **Value:** Cole o valor de `authDomain` (exemplo: `investigacao-prod.firebaseapp.com`)

#### NEXT_PUBLIC_FIREBASE_PROJECT_ID

- **Name:** `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- **Value:** Cole o valor de `projectId`

#### NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

- **Name:** `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- **Value:** Cole o valor de `storageBucket`

#### NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

- **Name:** `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- **Value:** Cole o valor de `messagingSenderId`

#### NEXT_PUBLIC_FIREBASE_APP_ID

- **Name:** `NEXT_PUBLIC_FIREBASE_APP_ID`
- **Value:** Cole o valor de `appId`

#### FIREBASE_ADMIN_CREDENTIALS

Este é o JSON completo do Service Account para usar o Firebase Admin SDK:

1. No Firebase Console, vá em **Project Settings** → **Service Accounts**
2. Clique em **Generate new private key**
3. Confirme clicando em **Generate key**
4. Um arquivo JSON será baixado

**IMPORTANTE:** O JSON precisa estar em uma ÚNICA LINHA, sem quebras.

Para converter:
```bash
# Linux/Mac
cat ~/Downloads/investigacao-prod-firebase-adminsdk.json | jq -c '.'

# Windows (PowerShell)
Get-Content "C:\Users\Vaio\Downloads\investigacao-prod-firebase-adminsdk.json" | ConvertFrom-Json | ConvertTo-Json -Compress
```

No GitHub:
- **Name:** `FIREBASE_ADMIN_CREDENTIALS`
- **Value:** Cole o JSON em uma única linha
- Clique em **Add secret**

### 4. Configure Secrets Opcionais (Recomendados)

#### OpenAI (para análises com IA)

Se você quiser usar análises com IA:

**OPENAI_API_KEY**
- Acesse: https://platform.openai.com/api-keys
- Clique em **Create new secret key**
- Copie a key
- No GitHub: Name: `OPENAI_API_KEY`, Value: `sk-proj-...`

#### Stripe (para pagamentos)

Se você for usar pagamentos:

**STRIPE_SECRET_KEY**
- Acesse: https://dashboard.stripe.com/apikeys
- Copie a **Secret key**
- No GitHub: Name: `STRIPE_SECRET_KEY`, Value: `sk_live_...` ou `sk_test_...`

**STRIPE_WEBHOOK_SECRET**
- Acesse: https://dashboard.stripe.com/webhooks
- Crie um novo endpoint apontando para: `https://investigacao.com.br/api/webhooks/stripe`
- Copie o **Signing secret**
- No GitHub: Name: `STRIPE_WEBHOOK_SECRET`, Value: `whsec_...`

### 5. Verificação

Após configurar todos os secrets, você deve ver uma lista assim:

```
CLOUDFLARE_API_TOKEN          Updated X seconds ago
CLOUDFLARE_ACCOUNT_ID         Updated X seconds ago
NEXT_PUBLIC_FIREBASE_API_KEY  Updated X seconds ago
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  Updated X seconds ago
NEXT_PUBLIC_FIREBASE_PROJECT_ID  Updated X seconds ago
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET  Updated X seconds ago
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  Updated X seconds ago
NEXT_PUBLIC_FIREBASE_APP_ID  Updated X seconds ago
FIREBASE_ADMIN_CREDENTIALS    Updated X seconds ago
OPENAI_API_KEY (opcional)     Updated X seconds ago
STRIPE_SECRET_KEY (opcional)  Updated X seconds ago
STRIPE_WEBHOOK_SECRET (opcional)  Updated X seconds ago
```

### 6. Testar Deploy Automático

Após configurar os secrets, faça um commit e push:

```bash
cd /c/Users/Vaio/Documents/TRABALHO/INVESTIGACAO2
git add .
git commit -m "chore: Atualizar configurações e secrets"
git push
```

Acompanhe o deploy em: https://github.com/dkbot7/investigacao/actions

Se tudo estiver correto, o workflow irá:
1. ✅ Checkout do código
2. ✅ Instalar dependências
3. ✅ Build com OpenNext
4. ✅ Deploy no Cloudflare Workers

---

## 📋 Checklist de Secrets

Use este checklist para garantir que configurou tudo:

### Cloudflare (Deploy)
- [ ] `CLOUDFLARE_API_TOKEN`
- [ ] `CLOUDFLARE_ACCOUNT_ID`

### Firebase (Autenticação)
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY`
- [ ] `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `NEXT_PUBLIC_FIREBASE_APP_ID`
- [ ] `FIREBASE_ADMIN_CREDENTIALS`

### Opcionais
- [ ] `OPENAI_API_KEY` (se usar IA)
- [ ] `STRIPE_SECRET_KEY` (se usar pagamentos)
- [ ] `STRIPE_WEBHOOK_SECRET` (se usar pagamentos)
- [ ] `GOOGLE_API_KEY` (se usar Google Custom Search)

---

## 🆘 Troubleshooting

### Erro: "Secret CLOUDFLARE_API_TOKEN not set"

- Verifique se você adicionou o secret com o nome EXATO: `CLOUDFLARE_API_TOKEN` (case-sensitive)
- Verifique se o token tem as permissões corretas

### Erro: "Failed to publish"

- Verifique se o `CLOUDFLARE_ACCOUNT_ID` está correto
- Verifique se o token tem permissão para "Workers Scripts → Edit"

### Deploy funciona mas app não carrega

- Verifique se todos os secrets do Firebase foram configurados
- Verifique se o `FIREBASE_ADMIN_CREDENTIALS` está em uma única linha
- Veja os logs em: https://dash.cloudflare.com → Workers & Pages → investigacao-api → Logs

### Como ver os secrets configurados

1. Vá em: https://github.com/dkbot7/investigacao/settings/secrets/actions
2. Você verá a lista (mas não os valores, por segurança)

### Como atualizar um secret

1. Vá em: https://github.com/dkbot7/investigacao/settings/secrets/actions
2. Clique no secret que quer atualizar
3. Clique em **Update secret**
4. Cole o novo valor
5. Clique em **Update secret**

---

## 🔒 Segurança

### ⚠️ IMPORTANTE:

- **NUNCA** compartilhe seus tokens/secrets publicamente
- **NUNCA** commite secrets no código
- Os secrets do GitHub são criptografados e só podem ser vistos por você
- Qualquer pessoa com acesso de "Admin" ou "Maintainer" ao repositório pode ver os secrets

### Boas Práticas:

- Use tokens com permissões mínimas necessárias
- Rotacione tokens regularmente (a cada 90 dias)
- Use secrets diferentes para desenvolvimento e produção
- Se um token vazar, revogue imediatamente e crie um novo

---

**Última atualização:** 2026-01-16
**Repositório:** https://github.com/dkbot7/investigacao
