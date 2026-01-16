# Estado do Projeto Investigaree - 22/12/2025

## ✅ Status Atual

### Última Atualização
- **Data**: 22/12/2025 17:25
- **Deploy**: Funcionando corretamente
- **Posts**: 38 posts publicados
- **Último post**: "Operação Arquivo Oculto" (22/12/2025)
- **URL**: https://investigaree.com.br/blog

---

## 🏗️ Arquitetura Atual

### Infraestrutura Cloudflare
```
┌─────────────────────────────────────────────────────────┐
│ investigaree.com.br / www.investigaree.com.br           │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Cloudflare Worker: "investigaree-api"            │  │
│  │ - Definido em wrangler.jsonc                     │  │
│  │ - Routes: *.investigaree.com.br                  │  │
│  │ - Serve o conteúdo do Pages                      │  │
│  └──────────────────────────────────────────────────┘  │
│                          ↓                              │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Cloudflare Pages: "investigaree"                 │  │
│  │ - Recebe deploys do GitHub Actions               │  │
│  │ - Build: OpenNext (.open-next/)                  │  │
│  │ - Preview: investigaree.pages.dev                │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Stack Técnico
- **Framework**: Next.js 15.1.9 (App Router)
- **Deploy**: OpenNext + Cloudflare Workers
- **Build**: `npx @opennextjs/cloudflare build`
- **Output**: Standalone mode → `.open-next/`
- **CI/CD**: GitHub Actions (`.github/workflows/deploy.yml`)

### Sistema de Blog
- **Source of Truth**: `src/data/mockPosts.ts` (38 posts)
- **Conteúdo**: HTML hardcoded diretamente no array MOCK_POSTS
- **Rotas**: `/blog` (listagem) e `/blog/[slug]` (post individual)
- **Componentes**:
  - `BlogPostClient.tsx` - Client component com interatividade
  - `BlogPostLayout.tsx` - Layout server-side
  - `page.tsx` - Server component que busca dados

---

## 🔧 Configurações Importantes

### wrangler.jsonc
```jsonc
{
  "name": "investigaree-api",
  "main": ".open-next/worker.js",
  "routes": [
    { "pattern": "investigaree.com.br/*", "zone_name": "investigaree.com.br" },
    { "pattern": "www.investigaree.com.br/*", "zone_name": "investigaree.com.br" }
  ],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  }
}
```

### GitHub Actions Workflow
**Arquivo**: `.github/workflows/deploy.yml`

**Steps críticos**:
1. `npm ci` - Instala dependências
2. `rm -rf .next .open-next` - Limpa cache (evita file locks)
3. `npx @opennextjs/cloudflare build` - Build OpenNext
4. `wrangler pages deploy .open-next` - Deploy Pages
5. `wrangler deploy` - Deploy Worker (⚠️ CRÍTICO - sem isso o domínio fica desatualizado)

### Secrets GitHub
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `NEXT_PUBLIC_FIREBASE_*` (6 variáveis)

---

## 📝 Problema Resolvido (Histórico)

### Sintoma
Post "Operação Arquivo Oculto" não aparecia em /blog apesar de estar em mockPosts.ts

### Causa Raiz
1. Domínio `investigaree.com.br` é servido por **Cloudflare Worker**
2. Worker estava desatualizado (deploy 19/12, antes do post existir)
3. GitHub Actions só deployava **Pages**, não **Worker**
4. API retornava dados antigos (37 posts em vez de 38)

### Solução
✅ Adicionado step no workflow para deploy do Worker:
```yaml
- name: Deploy Worker to investigaree.com.br
  uses: cloudflare/wrangler-action@v3
  with:
    command: deploy
```

### Limpeza Realizada
✅ Deletado projeto Pages duplicado `investigaree-v2`

---

## 🎯 Próximos Passos

### 🔴 Prioridade ALTA (fazer primeiro)

#### 1. SEO e Indexação
**Por quê**: Posts não aparecem no Google
**Tarefas**:
- [ ] Verificar `public/sitemap.xml` tem os 38 posts
- [ ] Submeter sitemap ao Google Search Console
- [ ] Verificar `public/robots.txt`
- [ ] Adicionar JSON-LD structured data aos posts
- [ ] Testar rich snippets no Google Rich Results Test

**Arquivos a verificar**:
- `public/sitemap.xml`
- `public/robots.txt`
- `src/app/blog/[slug]/page.tsx` (metadata)

#### 2. Validação de Conteúdo
**Por quê**: Garantir qualidade dos posts publicados
**Tarefas**:
- [ ] Auditar os 38 posts em `mockPosts.ts`
- [ ] Verificar quais têm conteúdo real vs "em breve"
- [ ] Validar todas as imagens de capa existem em `/public/images/blog/`
- [ ] Testar links internos e externos
- [ ] Revisar metadados (title, excerpt, tags)

**Comando útil**:
```bash
# Listar posts sem conteúdo completo
node -e "const posts = require('./src/data/mockPosts.ts'); posts.MOCK_POSTS.filter(p => p.content.includes('em breve')).forEach(p => console.log(p.slug))"
```

#### 3. Performance e Monitoramento
**Por quê**: Melhorar experiência e trackear visitantes
**Tarefas**:
- [ ] Configurar Cloudflare Analytics
- [ ] Testar no PageSpeed Insights
- [ ] Otimizar imagens (usar Next/Image corretamente)
- [ ] Configurar Cache headers
- [ ] Adicionar error tracking (Sentry?)

**URLs para testar**:
- https://pagespeed.web.dev/analysis?url=https://investigaree.com.br/blog
- https://www.webpagetest.org/

---

### 🟡 Prioridade MÉDIA (próximas semanas)

#### 4. Melhorias no Blog
- [ ] Sistema de busca funcional (client-side com Fuse.js?)
- [ ] Newsletter/email capture (Mailchimp, ConvertKit?)
- [ ] Botões de compartilhamento social (WhatsApp, LinkedIn, Twitter)
- [ ] Sistema de comentários (Disqus, Giscus?)
- [ ] Breadcrumbs para SEO
- [ ] Table of Contents nos posts longos

#### 5. Automação de Conteúdo
- [ ] Script para criar novo post facilmente
  ```bash
  npm run new-post "Título do Post"
  ```
- [ ] Converter MDX → HTML automaticamente
- [ ] Gerador de imagens de capa (Canva API, Cloudinary?)
- [ ] Validador de links quebrados

#### 6. Testes e Qualidade
- [ ] Testes E2E com Playwright
- [ ] Validação de links no CI/CD
- [ ] Preview de posts antes do deploy
- [ ] Lint de conteúdo (vale-lint?)

---

### 🟢 Prioridade BAIXA (backlog)

#### 7. Refatoração Técnica
- [ ] Migrar de HTML hardcoded para CMS headless (Contentful, Sanity?)
- [ ] Componentizar melhor BlogPostLayout
- [ ] Sistema de tags funcional (filtro por tag)
- [ ] Paginação na listagem de posts
- [ ] Infinite scroll ou "Load more"

#### 8. Features Avançadas
- [ ] Posts relacionados com ML/similarity
- [ ] Cálculo dinâmico de tempo de leitura
- [ ] Dark mode persistente
- [ ] PWA para leitura offline
- [ ] AMP pages para mobile
- [ ] RSS feed

---

## 🐛 Problemas Conhecidos

### 1. File Lock no Windows
**Sintoma**: `EBUSY: resource busy or locked, unlink '.open-next/assets'`
**Causa**: Windows file system locks
**Solução**: Build sempre no CI/CD (GitHub Actions), não local
**Workaround local**: Fechar VSCode, IDE, reiniciar

### 2. Cache do Cloudflare
**Sintoma**: Mudanças não aparecem imediatamente
**Solução**:
```bash
# Purgar cache manualmente
curl -X POST "https://api.cloudflare.com/client/v4/zones/ZONE_ID/purge_cache" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

### 3. Imagens de Capa Faltando
**Sintoma**: Algumas imagens 404
**Solução**: Verificar em `/public/images/blog/` e adicionar fallback
**TODO**: Criar script de validação

---

## 📁 Estrutura de Arquivos Críticos

```
investigaree/
├── .github/workflows/
│   └── deploy.yml                    ← CI/CD (CRÍTICO)
├── src/
│   ├── data/
│   │   ├── mockPosts.ts             ← Source of truth (38 posts)
│   │   └── blogPosts.ts             ← Lista de slugs válidos
│   ├── app/
│   │   ├── blog/
│   │   │   ├── page.tsx             ← Listagem de posts
│   │   │   └── [slug]/
│   │   │       ├── page.tsx         ← Post individual (server)
│   │   │       ├── BlogPostLayout.tsx
│   │   │       └── BlogPostClient.tsx ← Client component
│   │   └── api/
│   │       └── debug-posts/
│   │           └── route.ts         ← Debug endpoint
│   └── hooks/
│       └── useBlog.ts               ← Hooks do blog
├── public/
│   ├── images/blog/                 ← Imagens dos posts
│   ├── sitemap.xml                  ← SEO (verificar!)
│   └── robots.txt                   ← SEO (verificar!)
├── wrangler.jsonc                   ← Config Worker (CRÍTICO)
└── next.config.mjs                  ← Config Next.js

IMPORTANTE:
- NÃO usar compiledPosts.ts (removido)
- NÃO usar MDX compilation (hardcoded HTML)
- SEMPRE deployer Pages + Worker juntos
```

---

## 🛠️ Comandos Úteis

### Deploy Manual
```bash
cd investigaree

# Build local (⚠️ pode dar file lock no Windows)
npx @opennextjs/cloudflare build

# Deploy Pages
npx wrangler pages deploy .open-next --project-name=investigaree

# Deploy Worker (CRÍTICO - não esquecer!)
npx wrangler deploy
```

### Debug
```bash
# Ver posts no array
node -e "const {MOCK_POSTS} = require('./src/data/mockPosts'); console.log(MOCK_POSTS.length)"

# Testar API local
npm run dev
# Visitar: http://localhost:3000/api/debug-posts

# Ver logs do Worker
npx wrangler tail
```

### Git
```bash
# Commit + Push (CI/CD auto-deploya)
git add .
git commit -m "feat: Adicionar novo post sobre X"
git push origin main

# Ver status do deploy
# https://github.com/SEU_USER/SEU_REPO/actions
```

### Cloudflare
```bash
# Listar projetos
npx wrangler pages project list

# Ver deployments
npx wrangler pages deployment list --project-name=investigaree

# Ver worker deployments
npx wrangler deployments list
```

---

## 📊 Métricas Atuais

- **Posts publicados**: 38
- **Posts com conteúdo completo**: ? (verificar)
- **Imagens de capa**: ? (verificar)
- **Tamanho do build**: ~25MB (dentro do limite Cloudflare)
- **Tempo de build**: ~2-3 min
- **Tempo de deploy**: ~1 min
- **URLs indexed no Google**: ? (verificar Search Console)

---

## 🔗 Links Importantes

- **Produção**: https://investigaree.com.br/blog
- **Preview Pages**: https://investigaree.pages.dev
- **Cloudflare Dashboard**: https://dash.cloudflare.com/ce11d202b2917777965b5131b5edc627
- **GitHub Actions**: https://github.com/[USER]/[REPO]/actions
- **Google Search Console**: [configurar se ainda não tem]

---

## 📞 Contato e Suporte

- **Email**: chatbotimoveis@gmail.com
- **Cloudflare Account ID**: ce11d202b2917777965b5131b5edc627
- **Worker name**: investigaree-api
- **Pages project**: investigaree

---

## 🎓 Lições Aprendidas

1. **Dual deployment é necessário**: Pages + Worker devem ser deployados juntos
2. **Windows file locks**: Sempre buildar no CI/CD, nunca local
3. **Cache é persistente**: Mudanças podem levar minutos para propagar
4. **HTML hardcoded funciona**: Mais simples e confiável que MDX compilation no Worker
5. **Debug endpoint é essencial**: /api/debug-posts salvou o dia
6. **Wrangler CLI tem limitações**: Alguns comandos só funcionam via dashboard

---

## 📅 Histórico de Mudanças

### 22/12/2025 - Sistema de Blog Estável
- ✅ 38 posts publicados
- ✅ Dual deployment (Pages + Worker) funcionando
- ✅ Projeto duplicado removido (investigaree-v2)
- ✅ HTML hardcoded em mockPosts.ts
- ✅ Workflow CI/CD completo e testado
- ✅ Post "Operação Arquivo Oculto" visível e funcional

### 20/12/2025 - Correções de Deploy
- ✅ Migrado para OpenNext build
- ✅ Corrigido .cfignore
- ✅ Adicionado cache cleanup no workflow

### 19/12/2025 - Setup Inicial
- ✅ Primeiro deploy do Worker
- ✅ Configuração inicial do wrangler.jsonc

---

**Última atualização**: 22/12/2025 17:25
**Próxima revisão recomendada**: Após implementar SEO (#1)
