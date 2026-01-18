# Configuração Cloudflare Pages - Investigação

## ✅ Projeto Criado
- **Nome**: investigacao
- **URL**: https://investigacao.pages.dev/
- **Account ID**: ce11d202b2917777965b5131b5edc627

## 🔧 Configuração Necessária (5 minutos)

### Passo 1: Acessar Dashboard
1. Abra: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/pages
2. Você verá o projeto **"investigacao"** listado

### Passo 2: Conectar ao GitHub (MÉTODO RECOMENDADO)
1. Na página de Workers & Pages, clique em **"Create application"**
2. Selecione aba **"Pages"**
3. Clique em **"Connect to Git"**
4. Autorize o Cloudflare a acessar sua conta GitHub (se necessário)
5. Selecione o repositório: **dkbot7/investigacao**
6. Configure:
   - **Project name**: investigacao (ou deixe o default)
   - **Production branch**: main
   - Clique em **"Begin setup"**

### Passo 3: Build Settings
Configure EXATAMENTE assim:

```
Framework preset: Next.js
Build command: npx @cloudflare/next-on-pages
Build output directory: .vercel/output/static
Root directory: investigacao
Node version: 18
```

**Environment Variables** (adicione estas):
```
NODE_VERSION = 18
```

**IMPORTANTE**:
- NÃO selecione "Next.js (Static HTML Export)"
- Selecione apenas "Next.js"
- O comando `npx @cloudflare/next-on-pages` roda automaticamente `npm run build` primeiro

### Passo 4: Save and Deploy
1. Clique em **"Save and Deploy"**
2. O Cloudflare vai iniciar o primeiro build (leva ~3-5 minutos)
3. Aguarde aparecer **"Success"** com status verde

## 🚀 Resultado

Após conclusão:
- ✅ Todas as páginas atualizadas estarão no ar
- ✅ Deploy automático a cada `git push` para `main`
- ✅ URL: https://investigacao.pages.dev/
- ✅ Você pode adicionar domínio customizado depois

## 📝 Páginas Novas que Devem Aparecer

Verifique estas URLs após deploy:
- https://investigacao.pages.dev/precos (NOVA - Página de Preços)
- https://investigacao.pages.dev/lgpd (NOVA - Página LGPD)
- https://investigacao.pages.dev/faq (ATUALIZADA - 14 novas perguntas)
- https://investigacao.pages.dev/servicos (ATUALIZADA - 3 categorias B2B/B2C/Legal)
- https://investigacao.pages.dev/quemsomos (ATUALIZADA - Multi-audience)
- https://investigacao.pages.dev/solucoes/rh-compliance (ATUALIZADA - SEO otimizado)

## ❓ Se Der Erro

**Erro comum**: "Build failed"
- Solução: Verifique se o Build command está correto: `npx @cloudflare/next-on-pages`
- Verifique se Node version é 18.17.0 ou superior

**Páginas não atualizam**:
- Verifique se o deploy foi para a branch `main`
- Force um novo deploy fazendo um git push vazio:
  ```bash
  git commit --allow-empty -m "Force rebuild"
  git push origin main
  ```

## 🎯 Próximos Passos (Opcional)

Após deploy funcionar:
- [ ] Adicionar domínio customizado (se tiver)
- [ ] Configurar variáveis de ambiente (se necessário para APIs)
- [ ] Configurar preview deployments (para testar antes de produção)
