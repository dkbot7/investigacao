# Checklist - Próximos Passos

## 🔴 FAZER PRIMEIRO (Prioridade Alta)

### ✅ SEO e Indexação
```bash
# 1. Verificar sitemap
cat public/sitemap.xml
# Deve conter os 38 posts

# 2. Verificar robots.txt
cat public/robots.txt

# 3. Testar structured data
# Visitar: https://search.google.com/test/rich-results
# URL: https://investigaree.com.br/blog/operacao-arquivo-oculto-fraudes-licitacao-castanhal-para

# 4. Submit ao Google Search Console
# https://search.google.com/search-console
```

- [ ] Sitemap atualizado com 38 posts
- [ ] Robots.txt configurado corretamente
- [ ] JSON-LD structured data nos posts
- [ ] Submetido ao Google Search Console
- [ ] Testado no Rich Results Test

---

### ✅ Auditoria de Conteúdo
```bash
# Verificar posts sem conteúdo
cd investigaree
node scripts/audit-posts.js  # Criar este script

# Manual: revisar mockPosts.ts
code src/data/mockPosts.ts
```

- [ ] Listar posts com "em breve" no conteúdo
- [ ] Verificar todas imagens existem em /public/images/blog/
- [ ] Testar todos os links dos posts
- [ ] Revisar metadados (title, description, tags)
- [ ] Corrigir posts incompletos

---

### ✅ Performance e Analytics
```bash
# Testar performance
# https://pagespeed.web.dev/analysis?url=https://investigaree.com.br/blog

# Configurar analytics
# Cloudflare Dashboard > Analytics > Web Analytics
```

- [ ] PageSpeed Insights > 90 pontos
- [ ] Cloudflare Analytics configurado
- [ ] Todas imagens otimizadas (WebP, next/image)
- [ ] Cache headers configurados
- [ ] Core Web Vitals OK

---

## 🟡 SEGUNDA FASE (Próximas Semanas)

### Feature: Busca no Blog
```bash
# Instalar Fuse.js
npm install fuse.js
```
- [ ] Input de busca no /blog
- [ ] Buscar por título, excerpt, tags
- [ ] Highlight dos resultados
- [ ] Testes

### Feature: Compartilhamento Social
- [ ] Botão WhatsApp (web.whatsapp.com/send)
- [ ] Botão LinkedIn (linkedin.com/sharing/share-offsite)
- [ ] Botão Twitter/X
- [ ] Clipboard copy link
- [ ] Analytics nos cliques

### Feature: Newsletter
- [ ] Escolher serviço (Mailchimp, ConvertKit, Loops)
- [ ] Form de captura no blog
- [ ] Thank you page
- [ ] LGPD compliance
- [ ] Email de boas-vindas

---

## 🟢 MELHORIAS TÉCNICAS (Backlog)

### Script: Criar Novo Post
```bash
# Criar script
touch scripts/new-post.js

# Uso:
npm run new-post "Título do Novo Post"
# Gera automaticamente:
# - Slug
# - ID incremental
# - Template HTML
# - Metadados
# - Adiciona a mockPosts.ts
```

### Script: Validar Posts
```bash
# Criar script de validação
touch scripts/validate-posts.js

# Verifica:
# - Imagens existem
# - Links funcionam (200 status)
# - Slugs únicos
# - IDs sequenciais
# - HTML válido
```

### Script: Gerar Sitemap
```bash
# Automatizar sitemap.xml
touch scripts/generate-sitemap.js

# Roda no build:
# - Lê mockPosts.ts
# - Gera sitemap.xml
# - Inclui lastmod, priority
```

---

## 📋 Templates para Scripts

### new-post.js
```javascript
// scripts/new-post.js
const fs = require('fs');
const path = require('path');

const title = process.argv[2];
if (!title) {
  console.error('Uso: node new-post.js "Título do Post"');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const mockPostsPath = path.join(__dirname, '../src/data/mockPosts.ts');
const mockPosts = require(mockPostsPath);

const newId = String(mockPosts.MOCK_POSTS.length);

const newPost = {
  id: newId,
  slug,
  title,
  excerpt: 'TODO: Adicionar resumo',
  content: `<p>TODO: Adicionar conteúdo completo</p>`,
  coverImage: `/images/blog/${slug}.jpeg`,
  publishedAt: new Date().toISOString(),
  featured: false,
  topic: { id: 'pericia-digital', name: 'Perícia Digital', color: '#3B82F6' },
  contentType: 'tutorial',
  skillLevel: 'intermediario',
  tags: [],
  author: {
    name: 'Investigaree Team',
    role: 'Especialistas em Investigação Digital',
  },
  readingTime: 5,
};

console.log('Novo post criado:', newPost);
console.log('\nAdicione manualmente em src/data/mockPosts.ts');
console.log('\nNão esqueça de criar a imagem:', newPost.coverImage);
```

### validate-posts.js
```javascript
// scripts/validate-posts.js
const fs = require('fs');
const path = require('path');
const { MOCK_POSTS } = require('../src/data/mockPosts');

const errors = [];

MOCK_POSTS.forEach(post => {
  // Verificar imagem
  const imgPath = path.join(__dirname, '../public', post.coverImage);
  if (!fs.existsSync(imgPath)) {
    errors.push(`❌ Imagem não encontrada: ${post.coverImage} (${post.slug})`);
  }

  // Verificar conteúdo
  if (post.content.includes('em breve') || post.content.includes('TODO')) {
    errors.push(`⚠️  Conteúdo incompleto: ${post.slug}`);
  }

  // Verificar metadados
  if (!post.excerpt || post.excerpt === 'TODO') {
    errors.push(`⚠️  Excerpt faltando: ${post.slug}`);
  }
});

// Verificar IDs únicos
const ids = MOCK_POSTS.map(p => p.id);
const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
if (duplicateIds.length > 0) {
  errors.push(`❌ IDs duplicados: ${duplicateIds.join(', ')}`);
}

// Verificar slugs únicos
const slugs = MOCK_POSTS.map(p => p.slug);
const duplicateSlugs = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
if (duplicateSlugs.length > 0) {
  errors.push(`❌ Slugs duplicados: ${duplicateSlugs.join(', ')}`);
}

if (errors.length === 0) {
  console.log('✅ Todos os posts estão válidos!');
} else {
  console.error(`\n${errors.length} erros encontrados:\n`);
  errors.forEach(err => console.error(err));
  process.exit(1);
}
```

---

## 🎯 Ordem Recomendada

1. **SEO** (2-3 horas)
   - Sitemap
   - Structured data
   - Google Search Console

2. **Auditoria** (1-2 horas)
   - Criar validate-posts.js
   - Rodar e corrigir erros
   - Completar posts vazios

3. **Performance** (2-3 horas)
   - PageSpeed test
   - Otimizar imagens
   - Cloudflare Analytics

4. **Script new-post** (1-2 horas)
   - Facilita criação de posts
   - Evita erros manuais

5. **Busca** (3-4 horas)
   - Melhora UX
   - Facilita navegação

---

**Tempo total estimado (Fase 1)**: ~10 horas
**Priorize**: SEO primeiro para começar a rankear no Google

---

## 🚀 Quick Start (retomar trabalho)

```bash
# 1. Entrar no diretório
cd investigaree

# 2. Atualizar dependências
git pull origin main
npm install

# 3. Rodar validação
node scripts/validate-posts.js  # Criar primeiro!

# 4. Testar local
npm run dev
# http://localhost:3000/blog

# 5. Fazer mudanças
# ... editar arquivos ...

# 6. Commit e deploy automático
git add .
git commit -m "feat: Descrição da mudança"
git push origin main

# 7. Verificar deploy
# https://github.com/USER/REPO/actions
# Aguardar ~3 min
# Testar: https://investigaree.com.br/blog
```

---

**Data**: 22/12/2025
**Status**: Pronto para continuar
