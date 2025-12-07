# 📊 SCHEMA MARKUP - Blog Posts Investigaree

**Objetivo:** Implementar structured data (JSON-LD) em todos os posts do blog para melhorar SEO e aparecer em rich results do Google
**Baseado em:** Melhores práticas 2025 - Google Search Central + Schema.org
**Formato:** JSON-LD (recomendado pelo Google)
**Tipo de Schema:** BlogPosting (mais específico que Article genérico)

---

## 🎯 BENEFÍCIOS DO SCHEMA MARKUP (2025)

✅ **Aumento de CTR:** 30-40% de aumento em cliques (rich snippets visuais)
✅ **Rich Results:** Aparecer com foto de autor, data de publicação, tempo de leitura
✅ **Top Stories Carousel:** Qualificar para o carrossel de notícias do Google
✅ **AEO (Answer Engine Optimization):** Ser citado em respostas de IA (Google SGE, ChatGPT)
✅ **Autoridade:** Sinalizar expertise e credibilidade para motores de busca

---

## 📋 SCHEMA BÁSICO - BlogPosting (Template Geral)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Título do Post (máx 110 caracteres)",
  "description": "Meta description do post (150-160 caracteres)",
  "image": {
    "@type": "ImageObject",
    "url": "https://investigaree.com/images/blog/nome-imagem.jpg",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Person",
    "name": "Ibsen Maciel",
    "url": "https://investigaree.com/quemsomos/ibsen-maciel",
    "jobTitle": "Perito Criminal",
    "image": "https://investigaree.com/images/team/ibsen-maciel.jpg",
    "sameAs": [
      "https://www.linkedin.com/in/ibsenmaciel",
      "https://twitter.com/ibsenmaciel"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Investigaree",
    "url": "https://investigaree.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://investigaree.com/images/logo.png",
      "width": 600,
      "height": 60
    }
  },
  "datePublished": "2025-12-07T13:00:00Z",
  "dateModified": "2025-12-07T13:00:00Z",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://investigaree.com/blog/slug-do-post"
  },
  "articleSection": "Investigação Digital",
  "keywords": ["palavra-chave-1", "palavra-chave-2", "palavra-chave-3"],
  "wordCount": 3500,
  "timeRequired": "PT18M",
  "inLanguage": "pt-BR",
  "isPartOf": {
    "@type": "Blog",
    "@id": "https://investigaree.com/blog"
  }
}
```

---

## 🔧 CAMPOS OBRIGATÓRIOS vs. RECOMENDADOS

### ✅ OBRIGATÓRIOS (Google exige):
- `headline` - Título do post (máx 110 caracteres)
- `image` - Imagem destacada (mín 1200x630px)
- `author` - Autor do post
- `publisher` - Organização que publica
- `datePublished` - Data de publicação

### 🌟 RECOMENDADOS (aumentam chances de rich results):
- `description` - Meta description
- `dateModified` - Data da última atualização
- `mainEntityOfPage` - URL canônica do post
- `articleSection` - Categoria do post
- `keywords` - Tags/palavras-chave
- `wordCount` - Contagem de palavras
- `timeRequired` - Tempo de leitura (formato: PT18M = 18 minutos)
- `inLanguage` - Idioma do conteúdo

---

## 📝 SCHEMAS ESPECÍFICOS - Posts da Série "Fontes Públicas Brasil"

### Post #3: Portal da Transparência (CEIS/CNEP)

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Portal da Transparência: Como Consultar CEIS e CNEP (Sancionados)",
  "description": "Guia completo sobre como consultar empresas e pessoas sancionadas no CEIS e CNEP do Portal da Transparência. Dados atualizados 2025.",
  "image": {
    "@type": "ImageObject",
    "url": "https://investigaree.com/images/blog/portal-transparencia-ceis-cnep.jpg",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Person",
    "name": "Ibsen Maciel",
    "url": "https://investigaree.com/quemsomos/ibsen-maciel",
    "jobTitle": "Perito Criminal",
    "image": "https://investigaree.com/images/team/ibsen-maciel.jpg",
    "sameAs": [
      "https://www.linkedin.com/in/ibsenmaciel"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Investigaree",
    "url": "https://investigaree.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://investigaree.com/images/logo.png",
      "width": 600,
      "height": 60
    }
  },
  "datePublished": "2025-12-07T10:00:00Z",
  "dateModified": "2025-12-07T10:00:00Z",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://investigaree.com/blog/portal-transparencia-ceis-cnep"
  },
  "articleSection": "Investigação Digital",
  "keywords": ["Portal da Transparência", "CEIS", "CNEP", "sancionados", "CGU", "compliance", "due diligence"],
  "wordCount": 2800,
  "timeRequired": "PT14M",
  "inLanguage": "pt-BR",
  "isPartOf": {
    "@type": "Series",
    "name": "Fontes Públicas Brasil",
    "position": 3,
    "numberOfItems": 10
  }
}
```

### Post #10: OSINT em Redes Sociais

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "OSINT em Redes Sociais: Técnicas de Investigação Digital no Brasil",
  "description": "Guia completo de OSINT para investigação em redes sociais: ferramentas, técnicas, LGPD e como usar WhatsApp, Instagram, LinkedIn em investigações forenses.",
  "image": {
    "@type": "ImageObject",
    "url": "https://investigaree.com/images/blog/osint-redes-sociais-investigacao.jpg",
    "width": 1200,
    "height": 630
  },
  "author": {
    "@type": "Person",
    "name": "Ibsen Maciel",
    "url": "https://investigaree.com/quemsomos/ibsen-maciel",
    "jobTitle": "Perito Criminal e Especialista em OSINT",
    "image": "https://investigaree.com/images/team/ibsen-maciel.jpg"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Investigaree",
    "url": "https://investigaree.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://investigaree.com/images/logo.png",
      "width": 600,
      "height": 60
    }
  },
  "datePublished": "2025-12-07T15:00:00Z",
  "dateModified": "2025-12-07T15:00:00Z",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://investigaree.com/blog/osint-redes-sociais-investigacao"
  },
  "articleSection": "Investigação Digital",
  "keywords": ["OSINT", "redes sociais", "investigação digital", "Instagram", "LinkedIn", "WhatsApp", "LGPD", "Maltego", "Sherlock"],
  "wordCount": 4200,
  "timeRequired": "PT20M",
  "inLanguage": "pt-BR",
  "isFeaturedContent": true,
  "isPartOf": {
    "@type": "Series",
    "name": "Fontes Públicas Brasil",
    "position": 10,
    "numberOfItems": 10
  },
  "educationalUse": "Professional Development",
  "educationalLevel": "Advanced"
}
```

---

## 🎓 SCHEMA ADICIONAL: HowTo (Para Tutoriais Passo a Passo)

Para posts que são tutoriais práticos, podemos adicionar **schema HowTo** em conjunto com BlogPosting:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Como Consultar CPF na Receita Federal",
  "description": "Passo a passo completo para consultar CPF e verificar situação cadastral na Receita Federal",
  "image": "https://investigaree.com/images/blog/consulta-cpf.jpg",
  "totalTime": "PT5M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "BRL",
    "value": "0"
  },
  "tool": [
    {
      "@type": "HowToTool",
      "name": "Portal da Receita Federal"
    }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "name": "Acessar o portal da Receita Federal",
      "text": "Acesse https://servicos.receita.fazenda.gov.br/servicos/cpf/consultasituacao/consultapublica.asp",
      "url": "https://investigaree.com/blog/consulta-cpf#step1"
    },
    {
      "@type": "HowToStep",
      "name": "Digitar o CPF",
      "text": "Digite o número do CPF sem pontos ou traços (apenas 11 dígitos)",
      "url": "https://investigaree.com/blog/consulta-cpf#step2"
    },
    {
      "@type": "HowToStep",
      "name": "Preencher o captcha",
      "text": "Complete o captcha de segurança para provar que você não é um robô",
      "url": "https://investigaree.com/blog/consulta-cpf#step3"
    },
    {
      "@type": "HowToStep",
      "name": "Consultar e interpretar resultado",
      "text": "Clique em 'Consultar' e verifique a situação cadastral: Regular, Suspenso, Pendente ou Cancelado",
      "url": "https://investigaree.com/blog/consulta-cpf#step4"
    }
  ]
}
```

---

## 💡 SCHEMA FAQ (Para Seções de Perguntas Frequentes)

Se o post tiver seção de FAQ, adicionar **FAQPage schema**:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "A consulta de CPF na Receita Federal é gratuita?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim, a consulta de CPF no site oficial da Receita Federal é 100% gratuita. Desconfie de sites que cobram por essa consulta."
      }
    },
    {
      "@type": "Question",
      "name": "O que significa CPF com situação cadastral 'Suspensa'?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "CPF Suspenso indica irregularidades graves como omissão de declaração de imposto de renda por anos consecutivos ou indícios de fraude. Não contrate pessoas com CPF suspenso sem investigação adicional."
      }
    },
    {
      "@type": "Question",
      "name": "Consultar CPF de terceiros é legal segundo a LGPD?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Sim, desde que haja base legal (legítimo interesse, cumprimento de obrigação legal ou processo judicial). A consulta deve ter finalidade lícita e específica, como background check pré-admissional ou due diligence comercial."
      }
    }
  ]
}
```

---

## 🔗 SCHEMA BreadcrumbList (Navegação Estruturada)

Para facilitar navegação e SEO:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://investigaree.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://investigaree.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Investigação Digital",
      "item": "https://investigaree.com/blog/categoria/investigacao-digital"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Portal da Transparência",
      "item": "https://investigaree.com/blog/portal-transparencia-ceis-cnep"
    }
  ]
}
```

---

## 📦 IMPLEMENTAÇÃO NO NEXT.JS (investigaree)

### Arquivo: `src/app/blog/[slug]/page.tsx`

```typescript
import type { Metadata } from 'next'
import { getBlogPost } from '@/lib/blog'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPost(params.slug)

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug)

  // Schema JSON-LD
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: {
      '@type': 'ImageObject',
      url: `https://investigaree.com${post.image}`,
      width: 1200,
      height: 630,
    },
    author: {
      '@type': 'Person',
      name: post.author,
      url: `https://investigaree.com/quemsomos/${post.author.toLowerCase().replace(' ', '-')}`,
      jobTitle: 'Perito Criminal',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Investigaree',
      url: 'https://investigaree.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://investigaree.com/images/logo.png',
        width: 600,
        height: 60,
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://investigaree.com/blog/${params.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags,
    wordCount: post.wordCount || estimateWordCount(post.content),
    timeRequired: `PT${post.readingTime}M`,
    inLanguage: 'pt-BR',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Resto do conteúdo do post */}
    </>
  )
}
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

Antes de publicar, validar o schema markup:

- [ ] **Google Rich Results Test:** https://search.google.com/test/rich-results
- [ ] **Schema Markup Validator:** https://validator.schema.org/
- [ ] **Google Search Console:** Verificar "Enhancements" para erros de structured data

### Erros Comuns a Evitar:

❌ Imagem muito pequena (mínimo: 1200x630px)
❌ Headline muito longo (máximo: 110 caracteres)
❌ Falta de `datePublished` ou `dateModified`
❌ URL da imagem relativa (usar URL absoluta com https://)
❌ Publisher sem logo

---

## 📊 MONITORAMENTO DE PERFORMANCE

**Métricas para acompanhar (Google Search Console):**

- 📈 **Impressões** em rich results
- 📈 **CTR** (comparar antes/depois do schema)
- 📈 **Posição média** nas SERPs
- 📈 **Aparições** em "Top Stories" carousel
- 📈 **Citações** em Google SGE (Search Generative Experience)

**Tempo para ver resultados:** 2-4 semanas após implementação

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Implementar schema BlogPosting em todos os 10 posts da série
2. ⏭️ Adicionar schema HowTo em posts tutoriais (CPF, CNPJ, Tribunais)
3. ⏭️ Implementar schema FAQPage onde aplicável
4. ⏭️ Adicionar schema BreadcrumbList para navegação
5. ⏭️ Validar todos os schemas no Google Rich Results Test
6. ⏭️ Monitorar performance no Search Console

---

**Status:** ✅ Documentação completa - Pronto para implementação
**Prioridade:** Alta (impacto direto em SEO e visibilidade)
**Estimativa:** 1 dia para implementar em todos os posts
