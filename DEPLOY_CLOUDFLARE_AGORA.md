# 🚀 Guia Completo: Configurar Secrets e Deploy no Cloudflare

## 📋 Secrets Necessários

Seu workflow GitHub Actions precisa de **8 secrets**:

### 1. CLOUDFLARE_ACCOUNT_ID ✅
**Valor**: `ce11d202b2917777965b5131b5edc627`

### 2. CLOUDFLARE_API_TOKEN ⚠️
**Status**: Precisa criar

### 3-8. Firebase Secrets ⚠️
**Status**: Precisa dos valores do seu projeto Firebase

---

## 🔑 PASSO 1: Criar Cloudflare API Token

### Método Rápido (2 minutos):

1. **Abra**: https://dash.cloudflare.com/profile/api-tokens

2. **Clique em "Create Token"**

3. **Selecione o template**: `Edit Cloudflare Workers`
   - Ou clique em **"Create Custom Token"**

4. **Configure as permissões**:
   ```
   Permissions:
   ✅ Account - Cloudflare Pages - Edit
   ✅ Account - Account Settings - Read
   ```

5. **Account Resources**:
   ```
   Include → Specific account
   Selecione: Dani Kaloi (ce11d202b2917777965b5131b5edc627)
   ```

6. **Continue to summary** → **Create Token**

7. **⚠️ COPIE O TOKEN** (só aparece uma vez!)
   ```
   Exemplo: 1234567890abcdefghijklmnopqrstuvwxyz
   ```
   **Guarde temporariamente** - vamos usar no próximo passo

---

## 🔥 PASSO 2: Obter Configurações do Firebase

Você precisa dos valores reais do seu projeto Firebase.

### Como encontrar:

1. **Abra**: https://console.firebase.google.com/

2. **Selecione seu projeto** (provavelmente "investigaree")

3. **⚙️ Project Settings** (ícone de engrenagem no canto superior esquerdo)

4. **Scroll para baixo** até "Your apps"

5. **Selecione seu app Web** (ícone `</>`)

6. **Copie os valores** da seção "SDK setup and configuration":

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // ← NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "xxx.firebaseapp.com", // ← NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "xxx",                  // ← NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "xxx.appspot.com",  // ← NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789012", // ← NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc123"          // ← NEXT_PUBLIC_FIREBASE_APP_ID
};
```

---

## 🔐 PASSO 3: Adicionar Secrets no GitHub

### Via Web (Interface):

1. **Abra**: https://github.com/dkbot7/investigacao/settings/secrets/actions

2. **Clique em "New repository secret"**

3. **Adicione cada secret** (um por vez):

#### Secret 1: CLOUDFLARE_ACCOUNT_ID
```
Name: CLOUDFLARE_ACCOUNT_ID
Value: ce11d202b2917777965b5131b5edc627
```
**Clique em "Add secret"**

#### Secret 2: CLOUDFLARE_API_TOKEN
```
Name: CLOUDFLARE_API_TOKEN
Value: [Cole o token que você criou no Passo 1]
```
**Clique em "Add secret"**

#### Secret 3: NEXT_PUBLIC_FIREBASE_API_KEY
```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: [Cole o valor do Firebase - apiKey]
```
**Clique em "Add secret"**

#### Secret 4: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
```
Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: [Cole o valor do Firebase - authDomain]
```
**Clique em "Add secret"**

#### Secret 5: NEXT_PUBLIC_FIREBASE_PROJECT_ID
```
Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: [Cole o valor do Firebase - projectId]
```
**Clique em "Add secret"**

#### Secret 6: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
```
Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: [Cole o valor do Firebase - storageBucket]
```
**Clique em "Add secret"**

#### Secret 7: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
```
Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: [Cole o valor do Firebase - messagingSenderId]
```
**Clique em "Add secret"**

#### Secret 8: NEXT_PUBLIC_FIREBASE_APP_ID
```
Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: [Cole o valor do Firebase - appId]
```
**Clique em "Add secret"**

---

### Via CLI (Alternativa - Mais Rápido):

Se você tem o GitHub CLI instalado (`gh`):

```bash
# 1. Cloudflare
gh secret set CLOUDFLARE_ACCOUNT_ID --body "ce11d202b2917777965b5131b5edc627"
gh secret set CLOUDFLARE_API_TOKEN --body "COLE_SEU_TOKEN_AQUI"

# 2. Firebase (substitua os valores)
gh secret set NEXT_PUBLIC_FIREBASE_API_KEY --body "AIza..."
gh secret set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN --body "xxx.firebaseapp.com"
gh secret set NEXT_PUBLIC_FIREBASE_PROJECT_ID --body "xxx"
gh secret set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET --body "xxx.appspot.com"
gh secret set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID --body "123456789012"
gh secret set NEXT_PUBLIC_FIREBASE_APP_ID --body "1:123:web:abc"
```

---

## ✅ PASSO 4: Verificar Secrets Configurados

1. **Abra**: https://github.com/dkbot7/investigacao/settings/secrets/actions

2. **Você deve ver todos os 8 secrets listados**:
   ```
   ✅ CLOUDFLARE_ACCOUNT_ID         Updated X seconds ago
   ✅ CLOUDFLARE_API_TOKEN          Updated X seconds ago
   ✅ NEXT_PUBLIC_FIREBASE_API_KEY  Updated X seconds ago
   ✅ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  Updated X seconds ago
   ✅ NEXT_PUBLIC_FIREBASE_PROJECT_ID   Updated X seconds ago
   ✅ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET  Updated X seconds ago
   ✅ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID  Updated X seconds ago
   ✅ NEXT_PUBLIC_FIREBASE_APP_ID  Updated X seconds ago
   ```

---

## 🚀 PASSO 5: Testar o Deploy

Agora que os secrets estão configurados, vamos testar:

### Opção A: Trigger Manual

1. **Abra**: https://github.com/dkbot7/investigacao/actions/workflows/deploy.yml

2. **Clique em "Run workflow"**

3. **Selecione branch**: `main`

4. **Clique em "Run workflow"**

5. **Aguarde** o workflow executar (3-5 minutos)

### Opção B: Push para Main

```bash
# Faça qualquer alteração (ex: atualizar README)
git add .
git commit -m "test: Trigger deploy with configured secrets"
git push origin main

# Veja o status
# https://github.com/dkbot7/investigacao/actions
```

---

## 🎯 Resultado Esperado

Após o deploy completar com sucesso:

✅ **Build concluído** sem erros de secrets
✅ **Deploy no Cloudflare Pages**: https://investigaree.pages.dev/
✅ **Worker deployado**: investigaree.com.br
✅ **Status verde** no GitHub Actions

---

## 🔍 Troubleshooting

### ❌ Erro: "Missing API token"
**Solução**: Verifique se `CLOUDFLARE_API_TOKEN` foi adicionado corretamente

### ❌ Erro: "Invalid account ID"
**Solução**: Confirme `CLOUDFLARE_ACCOUNT_ID = ce11d202b2917777965b5131b5edc627`

### ❌ Erro: "Firebase config missing"
**Solução**: Verifique se todos os 6 secrets `NEXT_PUBLIC_FIREBASE_*` foram adicionados

### ❌ Build falha com erro de permissão
**Solução**: Verifique se o token tem permissão `Cloudflare Pages - Edit`

### ⚠️ Deploy aparece como "queued" por muito tempo
**Solução**:
1. Cancele o workflow atual
2. Verifique se há outro deploy rodando em paralelo
3. Tente novamente

---

## 📊 Monitoramento

**GitHub Actions**: https://github.com/dkbot7/investigacao/actions

**Cloudflare Dashboard**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages

**Logs de Deploy**: Clique em qualquer workflow → Veja os logs de cada step

---

## ✨ Próximos Passos

Após o primeiro deploy funcionar:

- [ ] Configurar domínio customizado (se aplicável)
- [ ] Adicionar mais environment variables (se necessário)
- [ ] Configurar preview deployments para branches
- [ ] Configurar notificações de deploy

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs no GitHub Actions
2. Confirme que todos os 8 secrets estão configurados
3. Teste o token do Cloudflare: https://dash.cloudflare.com/profile/api-tokens
