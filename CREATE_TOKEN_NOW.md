# Criar API Token Agora - 2 Minutos

## ✅ CLOUDFLARE_ACCOUNT_ID já adicionado!

Verifique: https://github.com/dkbot7/investigacao/settings/secrets/actions

## 🔑 Falta apenas: CLOUDFLARE_API_TOKEN

### PASSO 1: Criar Token (1 minuto)

1. **Abra**: https://dash.cloudflare.com/profile/api-tokens/create

2. **Use template "Edit Cloudflare Workers"**:
   - Nome: GitHub Actions Investigacao Deploy
   - Ou clique em "Create Custom Token"

3. **Permissões necessárias**:
   ```
   Account → Cloudflare Pages → Edit
   ```

4. **Account Resources**:
   - Include → Specific account
   - Selecione: Dani Kaloi

5. **Clique em "Continue to summary"**

6. **Clique em "Create Token"**

7. **COPIE O TOKEN** imediatamente (exemplo: `abc123xyz...`)

### PASSO 2: Adicionar no GitHub (30 segundos)

Execute este comando com o token que você copiou:

```bash
cd investigacao
gh secret set CLOUDFLARE_API_TOKEN
# Cole o token quando solicitado e pressione Enter
```

**OU** manualmente:
1. Vá para: https://github.com/dkbot7/investigacao/settings/secrets/actions
2. Clique em "New repository secret"
3. Name: `CLOUDFLARE_API_TOKEN`
4. Value: [cole o token]
5. Clique "Add secret"

### PASSO 3: Trigger Deploy (10 segundos)

```bash
git commit --allow-empty -m "trigger deploy"
git push origin main
```

**OU** vá para: https://github.com/dkbot7/investigacao/actions
- Clique em "Deploy to Cloudflare Pages"
- Clique em "Run workflow"
- Selecione branch "main"
- Clique em "Run workflow"

## 🚀 RESULTADO

Em 3-5 minutos o site estará no ar em https://investigacao.pages.dev/

Acompanhe o deploy em: https://github.com/dkbot7/investigacao/actions
