# Configurar GitHub Secrets para Deploy Automático

## ✅ O que foi feito
- ✅ GitHub Actions workflow criado (`.github/workflows/deploy.yml`)
- ✅ Workflow configurado para build + deploy automático no Cloudflare Pages

## 🔑 PASSO 1: Criar API Token no Cloudflare

### Opção A: Via Dashboard (RECOMENDADO - 2 minutos)

1. **Abra**: https://dash.cloudflare.com/profile/api-tokens

2. **Clique em "Create Token"**

3. **Use o template "Edit Cloudflare Workers"**:
   - Ou clique em "Create Custom Token"

4. **Configure as permissões**:
   ```
   Account - Cloudflare Pages - Edit
   ```

5. **Account Resources**:
   - Include: Specific account
   - Selecione: Dani Kaloi (ce11d202b2917777965b5131b5edc627)

6. **Clique em "Continue to summary"**

7. **Clique em "Create Token"**

8. **COPIE O TOKEN** (só aparece uma vez!)
   - Exemplo: `abc123xyz456...`
   - Guarde temporariamente (vamos adicionar no GitHub)

---

### Opção B: Via Wrangler (se preferir)

```bash
npx wrangler login
# Isso vai abrir o browser para autorizar
```

Depois use o token OAuth que já está configurado.

---

## 🔑 PASSO 2: Adicionar Secrets no GitHub

1. **Abra o repositório**: https://github.com/dkbot7/investigacao

2. **Vá para Settings** (aba no topo)

3. **No menu lateral esquerdo**:
   - Clique em **"Secrets and variables"**
   - Clique em **"Actions"**

4. **Clique em "New repository secret"**

5. **Adicione o primeiro secret**:
   ```
   Name: CLOUDFLARE_API_TOKEN
   Value: [cole o token que você copiou]
   ```
   Clique em "Add secret"

6. **Adicione o segundo secret**:
   ```
   Name: CLOUDFLARE_ACCOUNT_ID
   Value: ce11d202b2917777965b5131b5edc627
   ```
   Clique em "Add secret"

---

## 🚀 PASSO 3: Ativar o Deploy Automático

Agora vamos fazer commit do workflow e testar:

```bash
cd investigacao
git add .github/workflows/deploy.yml
git commit -m "ci: Add GitHub Actions workflow for Cloudflare Pages deployment"
git push origin main
```

---

## ✅ PASSO 4: Verificar Deploy

1. **Vá para**: https://github.com/dkbot7/investigacao/actions

2. **Você verá o workflow rodando** (pode levar 3-5 minutos)

3. **Status deve ficar verde** ✅

4. **Acesse**: https://investigacao.pages.dev/

---

## 🎯 RESULTADO

Depois de configurar:

✅ **Deploy automático**: Cada `git push` para `main` = deploy automático
✅ **Build no Linux**: Sem problemas de Windows
✅ **Logs completos**: Ver build logs no GitHub Actions
✅ **Site no ar**: https://investigacao.pages.dev/

---

## 🔍 Troubleshooting

### Erro: "Invalid API Token"
**Solução**:
- Verifique se copiou o token completo
- Certifique-se que o token tem permissão "Cloudflare Pages - Edit"
- Tente criar um novo token

### Erro: "Account not found"
**Solução**:
- Verifique se CLOUDFLARE_ACCOUNT_ID está correto: `ce11d202b2917777965b5131b5edc627`

### Workflow não executou
**Solução**:
- Verifique se o arquivo está em `.github/workflows/deploy.yml`
- Verifique se fez commit e push
- Vá para GitHub → Settings → Actions → Verifique se Actions estão habilitadas

---

## 📊 Monitorar Deploys

**GitHub Actions**: https://github.com/dkbot7/investigacao/actions
**Cloudflare Pages**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages/view/investigacao
