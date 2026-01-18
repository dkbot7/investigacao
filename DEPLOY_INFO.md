# 🚀 Informações de Deploy - Investigação Digital

## ✅ Deploy Concluído com Sucesso!

**Status**: LIVE 🟢
**Data**: 2026-01-18
**Plataforma**: Cloudflare Workers (com OpenNext)

---

## 🌐 URLs do Site

### Produção (Cloudflare Worker)
**URL Principal**: https://investigacao-web.chatbotimoveis.workers.dev

### Desenvolvimento
**Local**: http://localhost:3000

---

## 📋 Configuração do Deploy

### Secrets Configurados no GitHub

Todos os 8 secrets necessários foram configurados:

1. ✅ `CLOUDFLARE_ACCOUNT_ID` - `ce11d202b2917777965b5131b5edc627`
2. ✅ `CLOUDFLARE_API_TOKEN` - Configurado
3. ✅ `NEXT_PUBLIC_FIREBASE_API_KEY` - Configurado
4. ✅ `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` - `investigaree.firebaseapp.com`
5. ✅ `NEXT_PUBLIC_FIREBASE_PROJECT_ID` - `investigaree`
6. ✅ `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` - `investigaree.firebasestorage.app`
7. ✅ `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Configurado
8. ✅ `NEXT_PUBLIC_FIREBASE_APP_ID` - Configurado

### Build Process

```bash
# Build local
npm run build:worker

# Preview local
npm run preview:worker

# Deploy manual (se necessário)
npm run deploy
```

### Workflow GitHub Actions

**Arquivo**: `.github/workflows/deploy.yml`

**Triggers**:
- Push para branch `main` em arquivos dentro de `investigacao/**`
- Alterações no próprio workflow
- Dispatch manual

**Steps**:
1. Checkout do código
2. Setup Node.js 20
3. Instalar dependências
4. Build com OpenNext (`@opennextjs/cloudflare`)
5. Verificar build (`.open-next/worker.js`)
6. Deploy do Worker via Wrangler
7. Verificação do deployment

**Tempo médio**: ~2m40s

---

## 🔧 Tecnologias Utilizadas

### Frontend
- **Framework**: Next.js 15
- **Runtime**: Cloudflare Workers
- **Adaptador**: @opennextjs/cloudflare
- **UI**: TailwindCSS, shadcn/ui
- **Autenticação**: Firebase Auth

### Backend
- **Worker**: investigacao-web
- **Hosting**: Cloudflare Workers
- **CDN**: Cloudflare (global)

### CI/CD
- **Plataforma**: GitHub Actions
- **Deploy**: Wrangler CLI
- **Frequência**: Automático a cada push

---

## 📊 Monitoramento

### GitHub Actions
**URL**: https://github.com/dkbot7/investigacao/actions

**Últimos deploys**:
- ✅ 2026-01-18 12:10 - Deploy bem-sucedido (2m40s)

### Cloudflare Dashboard
**Workers**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/workers

**Métricas disponíveis**:
- Requests/sec
- CPU time
- Errors
- Bandwidth

---

## 🎯 Próximos Passos (Opcional)

### Domínio Customizado

Se você quiser usar um domínio customizado (ex: `investigacao.com.br`):

1. **Via Cloudflare Dashboard**:
   - Vá para Workers & Pages → investigacao-web → Settings → Triggers
   - Clique em "Add Custom Domain"
   - Digite seu domínio (ex: `investigacao.com.br`)
   - Configure o DNS conforme instruções

2. **Via wrangler.toml**:
   ```jsonc
   {
     "routes": [
       {
         "pattern": "investigacao.com.br/*",
         "zone_name": "investigacao.com.br"
       }
     ]
   }
   ```

### Preview Deployments

Para criar deployments de preview para branches:

1. Modifique o workflow para aceitar outras branches
2. Use `wrangler deploy --env preview`
3. Configure diferentes environments no wrangler.jsonc

---

## 🔍 Troubleshooting

### Site não carrega
1. Verifique se o workflow completou com sucesso
2. Aguarde 10-30 segundos para propagação
3. Limpe o cache do navegador
4. Teste em modo anônimo

### Erro 404
- Verifique se o URL está correto
- Confirme que o Worker foi deployado
- Verifique os logs no Cloudflare Dashboard

### Build falha
- Verifique os logs no GitHub Actions
- Confirme que todos os secrets estão configurados
- Teste o build localmente: `npm run build:worker`

---

## 📝 Notas Importantes

### Por que Worker e não Cloudflare Pages?

O projeto usa **@opennextjs/cloudflare** que é otimizado para **Cloudflare Workers**, não para Cloudflare Pages. A diferença:

- **Cloudflare Pages**: Para sites estáticos ou SSG puro
- **Cloudflare Workers**: Para SSR, API routes, middleware (usado neste projeto)

### Estrutura do Build

O OpenNext gera:
```
.open-next/
├── worker.js       # Worker principal (SSR)
└── assets/         # Assets estáticos (JS, CSS, imagens)
```

### Cache e Performance

- **Edge Caching**: Automático no Cloudflare
- **ISR**: Suportado via OpenNext
- **CDN Global**: 330+ data centers
- **Cold Start**: ~10-30ms

---

## 🆘 Suporte

### Logs e Debug

**Ver logs do Worker**:
```bash
npx wrangler tail investigacao-web
```

**Ver último deploy**:
```bash
gh run list --limit 1
```

**Ver logs do deploy**:
```bash
gh run view [RUN_ID] --log
```

### Contatos

- **GitHub Actions**: https://github.com/dkbot7/investigacao/actions
- **Cloudflare Workers**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627/workers

---

## ✅ Checklist de Verificação

- [x] Secrets configurados no GitHub (8/8)
- [x] Workflow funcionando
- [x] Build com OpenNext
- [x] Deploy do Worker
- [x] Site acessível
- [x] Firebase configurado
- [ ] Domínio customizado (opcional)
- [ ] Monitoramento configurado (opcional)
- [ ] Alertas configurados (opcional)

---

**Última atualização**: 2026-01-18 12:15 UTC
