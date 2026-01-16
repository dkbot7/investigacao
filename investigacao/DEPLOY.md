# 🚀 PROCESSO DE DEPLOY MANUAL - INVESTIGAREE

## ⚠️ IMPORTANTE
**NÃO há deploy automático!** Todo deploy deve ser feito manualmente via Wrangler.

---

## 📋 PRÉ-REQUISITOS

1. Build sem erros TypeScript
2. Arquivo `public/_headers` configurado
3. Wrangler instalado (`npx wrangler`)

---

## 🔄 PROCESSO COMPLETO DE DEPLOY

### 1️⃣ Build Local

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree
npm run build
```

**Resultado esperado:**
- ✅ `Compiled successfully`
- ✅ `Generating static pages (X/X)`
- ✅ Pasta `out/` criada com arquivos estáticos

### 2️⃣ Verificar Pasta Out

```bash
ls out/
```

**Deve conter:**
- `_next/` (chunks JavaScript/CSS)
- `_headers` (configurações MIME)
- `index.html`
- Pastas de rotas (blog/, dashboard/, etc.)

### 3️⃣ Deploy Manual

```bash
npx wrangler pages deploy out --project-name=investigaree --commit-dirty=true
```

**Flags:**
- `out` = pasta com arquivos estáticos
- `--project-name=investigaree` = nome do projeto Cloudflare
- `--commit-dirty=true` = permite deploy com working directory sujo

**Resultado esperado:**
```
✨ Success! Uploaded XXX files
✨ Deployment complete! Take a peek over at https://XXXXXXXX.investigaree.pages.dev
```

### 4️⃣ Testar Deploy

Acesse a URL gerada e verifique:
- ✅ Página carrega sem erros
- ✅ JavaScript funciona
- ✅ CSS aplicado
- ✅ Navegação funciona
- ✅ Console sem erros

---

## 🐛 TROUBLESHOOTING

### Erro: "Cannot read properties of undefined (reading 'map')"

**Causa:** Blog post MDX com erro de formato

**Solução:**
```bash
# Renomear arquivo problemático
mv content/blog/ARQUIVO_PROBLEMA.mdx content/blog/ARQUIVO_PROBLEMA.mdx.skip

# Rebuild
npm run build
```

### Erro: "ERR_ABORTED 404" ou "MIME type text/html"

**Causa:** Arquivo `_headers` não configurado

**Solução:** Verificar se `public/_headers` existe e será copiado para `out/_headers`

### Erro: "Page not found" no Cloudflare

**Causa:** Pasta errada no deploy

**Solução:** Sempre fazer deploy da pasta `out/`, não `.next/`

---

## 📝 CHECKLIST PRÉ-DEPLOY

- [ ] Código commitado no Git
- [ ] `npm run build` executado com sucesso
- [ ] Pasta `out/` gerada
- [ ] Arquivo `out/_headers` existe
- [ ] Nenhum erro TypeScript
- [ ] Blog posts problemáticos skipados (.mdx.skip)

---

## 🌐 URLS DE PRODUÇÃO

**Domínio Principal:**
- https://investigaree.com.br (configurado no Cloudflare)

**Preview Deployments:**
- Cada deploy manual gera uma URL única
- Formato: `https://XXXXXXXX.investigaree.pages.dev`
- As URLs antigas continuam funcionando

---

## 🔐 CREDENCIAIS

**Cloudflare Pages:**
- Projeto: `investigaree`
- Account ID: (verificar via `wrangler whoami`)

---

## 📊 HISTÓRICO DE DEPLOYS

Para ver deploys anteriores:
```bash
npx wrangler pages deployment list --project-name=investigaree
```

---

## ⚡ SCRIPT RÁPIDO

Crie um arquivo `deploy.bat` (Windows) ou `deploy.sh` (Linux/Mac):

```bash
@echo off
echo ========================================
echo DEPLOY INVESTIGAREE - CLOUDFLARE PAGES
echo ========================================
echo.

echo [1/3] Building...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    exit /b 1
)

echo.
echo [2/3] Deploying...
call npx wrangler pages deploy out --project-name=investigaree --commit-dirty=true
if %errorlevel% neq 0 (
    echo ERROR: Deploy failed!
    exit /b 1
)

echo.
echo [3/3] Done! Check the URL above.
pause
```

**Uso:**
```bash
cd investigaree
deploy.bat
```

---

Última atualização: 2025-12-07
