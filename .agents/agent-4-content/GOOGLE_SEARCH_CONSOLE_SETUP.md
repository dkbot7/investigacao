# 🔍 Google Search Console - Guia de Configuração

**Data:** 2025-12-07
**Agent:** Agent 4 - Content Developer
**Status:** ⏭️ Pendente (Aguarda Deploy)

---

## 🎯 Objetivo

Configurar Google Search Console (GSC) para:
- **Monitorar** desempenho orgânico (impressões, cliques, CTR, posição)
- **Indexação:** Submeter sitemap e verificar cobertura de índice
- **Rich Results:** Validar schema markup (BlogPosting, FAQPage, etc.)
- **Core Web Vitals:** Monitorar performance (LCP, FID, CLS)
- **Segurança:** Alertas de problemas de segurança ou penalizações

---

## 📋 Pré-requisitos

1. ✅ Site em produção: `https://investigaree.com.br`
2. ✅ Schema Markup implementado (BlogPosting, FAQPage, BreadcrumbList)
3. ⏭️ Sitemap gerado: `https://investigaree.com.br/sitemap.xml`
4. ⏭️ Acesso de administrador ao domínio

---

## 🛠️ Passos de Configuração

### 1. Criar Conta Google Search Console

1. Acessar: [https://search.google.com/search-console/](https://search.google.com/search-console/)
2. Fazer login com conta Google (usar conta profissional)
3. Clicar em **"Adicionar propriedade"**

### 2. Escolher Tipo de Propriedade

**Opção A: Domínio** (Recomendado)
- URL: `investigaree.com.br`
- **Vantagens:** Cobre todos os subdomínios (www, blog, app) e protocolos (http/https)
- **Verificação:** Via DNS (TXT record)

**Opção B: Prefixo de URL**
- URL: `https://investigaree.com.br`
- **Vantagens:** Mais simples, verificação via HTML tag
- **Desvantagens:** Só cobre esse URL específico

**Escolhido:** Domínio (mais completo)

### 3. Verificação de Propriedade

#### Método Recomendado: DNS (TXT Record)

1. Google fornecerá um código TXT, exemplo:
   ```
   google-site-verification=ABC123XYZ456...
   ```

2. Adicionar no provedor de DNS (Registro.br, Cloudflare, etc.):
   ```
   Tipo: TXT
   Nome: @
   Valor: google-site-verification=ABC123XYZ456...
   TTL: 3600
   ```

3. Aguardar propagação DNS (5 minutos a 24 horas)

4. Clicar em **"Verificar"** no Google Search Console

#### Métodos Alternativos

**HTML Tag (no `<head>`):**
```html
<!-- investigaree/src/app/layout.tsx -->
<meta name="google-site-verification" content="ABC123XYZ456..." />
```

**Arquivo HTML (na raiz):**
- Upload de arquivo `google123abc.html` em `/public`
- Next.js: Colocar em `investigaree/public/google123abc.html`

**Google Analytics:**
- Se GA4 já configurado com mesmo email, verificação automática

---

### 4. Submeter Sitemap

#### 4.1. Gerar Sitemap

Next.js 14 não gera sitemap automaticamente. Opções:

**Opção A: Biblioteca `next-sitemap`** (Recomendado)

```bash
npm install next-sitemap
```

Criar `investigaree/next-sitemap.config.js`:
```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://investigaree.com.br',
  generateRobotsTxt: true,
  generateIndexSitemap: false, // Se <50k URLs
  exclude: ['/admin', '/dashboard/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dashboard', '/api'],
      },
    ],
  },
  // Prioridades
  transform: async (config, path) => {
    // Páginas principais: prioridade 1.0
    if (path === '/' || path === '/blog') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }

    // Blog posts: prioridade 0.8
    if (path.startsWith('/blog/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }

    // Landing pages setoriais: prioridade 0.9
    if (path.startsWith('/solucoes/')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }

    // Demais páginas: prioridade 0.7
    return {
      loc: path,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }
  },
}
```

Adicionar script em `package.json`:
```json
{
  "scripts": {
    "postbuild": "next-sitemap"
  }
}
```

Resultado: Sitemap gerado em `https://investigaree.com.br/sitemap.xml`

**Opção B: Sitemap Manual (XML)**

Criar `investigaree/public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Home -->
  <url>
    <loc>https://investigaree.com.br/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>2025-12-07</lastmod>
  </url>

  <!-- Blog -->
  <url>
    <loc>https://investigaree.com.br/blog</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>2025-12-07</lastmod>
  </url>

  <!-- Blog Posts (10 posts da série "Fontes Públicas") -->
  <url>
    <loc>https://investigaree.com.br/blog/receita-federal-cpf-cnpj</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>2025-12-07</lastmod>
  </url>
  <!-- ... repetir para cada post -->

  <!-- Landing Pages Setoriais -->
  <url>
    <loc>https://investigaree.com.br/solucoes/rh-compliance</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
    <lastmod>2025-12-07</lastmod>
  </url>
  <!-- ... repetir para 5 landing pages -->
</urlset>
```

#### 4.2. Submeter no GSC

1. No Google Search Console, ir em **"Sitemaps"** (menu lateral esquerdo)
2. Clicar em **"Adicionar novo sitemap"**
3. Inserir: `sitemap.xml`
4. Clicar em **"Enviar"**

**Status esperado:** "Sucesso" (pode levar 24-48h para processar)

---

### 5. Validar Rich Results

1. No GSC, ir em **"Melhorias" > "Resultados avançados"**
2. Verificar:
   - ✅ **Artigos válidos:** 10+ (blog posts com BlogPosting schema)
   - ✅ **Breadcrumbs válidos:** 10+ (BreadcrumbList schema)
   - ⚠️ **FAQ válidos:** Pode não aparecer (restrição 2023 para sites não-governamentais)

3. Se erros aparecerem, clicar em "Validar correção" após ajustes

**Ferramenta alternativa de teste:**
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- Testar 3 URLs de exemplo:
  - `https://investigaree.com.br/blog/portal-transparencia-ceis-cnep`
  - `https://investigaree.com.br/blog/tribunais-processos-judiciais`
  - `https://investigaree.com.br/solucoes/rh-compliance`

---

### 6. Configurar Alertas e Relatórios

#### 6.1. Ativar Notificações por Email

1. **"Configurações"** (ícone de engrenagem, canto superior direito)
2. **"Usuários e permissões"**
3. Marcar: ✅ Notificações por email
   - Problemas de indexação
   - Problemas de segurança
   - Problemas de AMP
   - Core Web Vitals

#### 6.2. Relatórios Importantes

**Desempenho (Performance):**
- **Métrica principal:** CTR por query
- **Filtros:** País (Brasil), Dispositivo (Mobile vs. Desktop)
- **Exportar:** Semanal para análise de tendências

**Cobertura (Coverage):**
- **Métrica principal:** Páginas indexadas vs. excluídas
- **Alertas:** "Enviado e não indexado", "Rastreado, atualmente não indexado"

**Core Web Vitals:**
- **LCP (Largest Contentful Paint):** <2.5s (bom)
- **FID (First Input Delay):** <100ms (bom)
- **CLS (Cumulative Layout Shift):** <0.1 (bom)

---

## 📊 KPIs para Monitorar (Semanal)

### Indexação
- [ ] **Páginas indexadas:** Meta 30+ (10 blog posts + 5 landing pages + 15 páginas estáticas)
- [ ] **Erros de rastreamento:** Meta 0
- [ ] **Sitemap processado:** Status "Sucesso"

### Desempenho Orgânico
- [ ] **Impressões totais:** Meta +20% mês a mês
- [ ] **Cliques totais:** Meta +15% mês a mês
- [ ] **CTR médio:** Meta 3-5% (benchmark Google 2025)
- [ ] **Posição média:** Meta Top 10 para palavras-chave alvo

### Rich Results
- [ ] **BlogPosting válidos:** 10/10 (100%)
- [ ] **Breadcrumbs válidos:** 10/10 (100%)
- [ ] **Erros de schema:** 0

### Core Web Vitals
- [ ] **URLs com bom desempenho:** >75%
- [ ] **LCP:** <2.5s (bom)
- [ ] **FID:** <100ms (bom)
- [ ] **CLS:** <0.1 (bom)

---

## 🎯 Palavras-Chave Alvo (Monitorar Posição)

### Primárias (Volume Alto)
1. "background check brasil" (500/mês)
2. "due diligence empresarial" (400/mês)
3. "consultar cpf online" (10k/mês)
4. "investigação patrimonial" (300/mês)
5. "como consultar cnpj" (5k/mês)

### Secundárias (Long-tail)
1. "como consultar ceis e cnep" (100/mês)
2. "background check lgpd conformidade" (50/mês)
3. "investigação patrimonial divórcio" (80/mês)
4. "auditoria licitações fraude" (60/mês)
5. "background check executivos c-level" (40/mês)

### Branded
1. "investigaree" (20/mês, crescimento esperado)
2. "investigaree blog" (10/mês)

---

## 🔧 Troubleshooting

### Problema: "Enviado e não indexado"

**Causas comuns:**
- Conteúdo duplicado
- Baixa qualidade (muito curto, pouco valor)
- Noindex tag acidental
- Robots.txt bloqueando

**Solução:**
1. Verificar `robots.txt`: Deve permitir rastreamento de `/blog/*` e `/solucoes/*`
2. Verificar `<meta name="robots" content="index, follow">`
3. Solicitar indexação manual: "Inspeção de URL" > "Solicitar indexação"

### Problema: Schema com erros

**Erro comum:** "Missing required field 'image'"

**Solução:**
```typescript
// SchemaMarkup.tsx - Sempre incluir imagem
image: coverImage || 'https://investigaree.com.br/default-og-image.png'
```

### Problema: CTR muito baixo (<1%)

**Causas:**
- Title/Description pouco atraentes
- Falta de rich results
- Posição muito baixa (>20)

**Solução:**
1. Melhorar meta descriptions (incluir call-to-action)
2. Validar schema markup
3. Otimizar conteúdo para palavra-chave alvo

---

## 📚 Recursos

### Documentação Oficial
- [Google Search Console Help](https://support.google.com/webmasters/)
- [Sitemaps Protocol](https://www.sitemaps.org/protocol.html)
- [next-sitemap Documentation](https://github.com/iamvishnusankar/next-sitemap)

### Ferramentas
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

## ✅ Checklist de Ativação

### Pré-Deploy
- [x] Schema Markup implementado (BlogPosting, BreadcrumbList)
- [ ] Sitemap configurado (`next-sitemap` ou manual)
- [ ] `robots.txt` permitindo rastreamento
- [ ] Meta tags (title, description) em todas as páginas

### Pós-Deploy
- [ ] Google Search Console: Conta criada
- [ ] Verificação de propriedade (DNS TXT ou HTML tag)
- [ ] Sitemap submetido
- [ ] Rich Results validados (3 URLs de teste)
- [ ] Notificações por email ativadas
- [ ] Primeiro relatório de desempenho exportado (baseline)

### Monitoramento Contínuo
- [ ] Revisão semanal: Desempenho (impressões, cliques, CTR)
- [ ] Revisão semanal: Cobertura (indexação, erros)
- [ ] Revisão mensal: Core Web Vitals
- [ ] Revisão mensal: Rich Results (novos erros/avisos)

---

**Agent ID:** Agent 4 - Content Developer
**Workspace:** `.agents/agent-4-content/`
**Próximo Commit:** (após deploy)
