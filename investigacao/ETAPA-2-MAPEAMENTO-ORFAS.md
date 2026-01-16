# ETAPA 2 - MAPEAMENTO E RESOLUÇÃO DE PÁGINAS ÓRFÃS

**Data:** 2025-12-20
**Status:** ✅ CONCLUÍDA

---

## 1. INVENTÁRIO COMPLETO DE PÁGINAS

### 1.1 Páginas Públicas Principais (59 total)

#### **Navegação Principal (Header)**
- ✅ `/` - Homepage
- ✅ `/servicos` - Catálogo de serviços
- ✅ `/quemsomos` - Sobre a empresa
- ✅ `/contato` - Contato

#### **Navegação Conteúdo (Dropdown Header)**
- ✅ `/blog` - Blog index
- ✅ `/blog/[slug]` - Posts dinâmicos (37 posts)
- ✅ `/series` - Séries de conteúdo
- ✅ `/glossario` - Glossário técnico
- ✅ `/recursos` - Recursos e ferramentas

#### **Páginas de Solução (8 total)**
Todas linkadas via `/servicos` e `/page.tsx`:
- ✅ `/solucoes/due-diligence`
- ✅ `/solucoes/background-check-executivos`
- ✅ `/solucoes/investigacao-patrimonial`
- ✅ `/solucoes/rh-compliance`
- ✅ `/solucoes/auditoria-licitacoes`
- ✅ `/solucoes/due-diligence-divorcios`
- ✅ `/solucoes/coleta-provas-digitais`
- ✅ `/solucoes/protecao-remocao`

#### **Páginas Legais (Footer)**
- ✅ `/privacidade` - Política de Privacidade
- ✅ `/termos` - Termos de Uso
- ✅ `/cookies` - Política de Cookies
- ✅ `/disclaimer` - Disclaimer legal

#### **Páginas Institucionais (Footer)**
- ✅ `/quemsomos` - Quem Somos (Header + Footer)
- ✅ `/quemsomos/dani-kaloi` - Perfil Dani Kaloi (linkado via `/page.tsx`)
- ✅ `/quemsomos/ibsen-maciel` - Perfil Ibsen Maciel (linkado via `/page.tsx`)
- ✅ `/faq` - FAQ (Footer)

#### **Páginas de Autoridade (Biblioteca Técnica)**
**DECISÃO DE GOVERNANÇA:** Acessíveis apenas via navegação contextual/secundária, **NÃO no menu principal**

- ⚠️ `/metodologia` - Índice de metodologias (criada em ETAPA 1)
  - **Status:** Sem links diretos, será indexada via sitemap.xml
  - **Estratégia:** Descoberta via busca orgânica + sitemap

- ⚠️ `/cases` - Índice de cases (criada em ETAPA 1)
  - **Status:** Sem links diretos, será indexada via sitemap.xml
  - **Estratégia:** Descoberta via busca orgânica + sitemap

---

## 2. PÁGINAS DUPLICADAS IDENTIFICADAS

### 2.1 Páginas "Sobre" (3 versões diferentes)

| URL | Status Atual | Decisão | Ação Executada |
|-----|-------------|---------|----------------|
| `/quemsomos` | ✅ Linkada (Header + Footer) | **MANTIDA** como página principal | Nenhuma |
| `/sobre` | ⚠️ Linkada apenas no Footer | **DESVINCULADA** do Footer | ✅ Link removido |
| `/about` | ❌ Órfã (sem links) | **ÓRFÃ PERMANENTE** | Nenhuma (baixa prioridade) |

**Justificativa:**
- `/quemsomos` é a URL canônica aprovada
- `/sobre` removida do Footer para evitar confusão (ainda existe fisicamente, mas não é linkada)
- `/about` pode ser usada futuramente para versão inglesa ou removida

---

## 3. PÁGINAS DE DASHBOARD (Autenticadas)

**Total:** 27 páginas
**Status:** ❌ **Ignoradas para SEO** (requerem autenticação)

Exemplos:
- `/dashboard/*` (múltiplas páginas)
- `/dashboard/comurg*` (múltiplas dashboards específicas)
- `/dashboard/consultas/*`
- `/dashboard/configuracoes/*`
- `/loginadmin`
- `/test-admin`
- `/test-admin-panel`

**Decisão:** Não incluir em sitemap.xml (protegidas por autenticação ou uso interno)

---

## 4. AÇÕES EXECUTADAS EM ETAPA 2

### 4.1 Correções de Navegação

#### ✅ **Header (src/components/landing/Header.tsx)**
- Adicionadas traduções para "metodologia" e "cases" (sem incluir no menu principal)
- Importados ícones `Scale` e `Briefcase` (preparação para uso futuro)
- **DECISÃO:** Metodologia e Cases NÃO foram adicionados ao menu conforme governança

#### ✅ **Footer (src/components/landing/Footer.tsx)**
- Removido link `/sobre` da seção "Empresa"
- Mantido apenas `/quemsomos` como link canônico
- Estrutura simplificada: Quem Somos, FAQ, WhatsApp

### 4.2 Páginas com Links Contextuais Verificados

| Tipo de Página | Quantidade | Link de Origem |
|----------------|-----------|----------------|
| Soluções `/solucoes/*` | 8 | `/servicos`, `/page.tsx` |
| Team `/quemsomos/*` | 2 | `/page.tsx` |
| Legal | 4 | Footer |
| Conteúdo | 4 | Header dropdown |

---

## 5. SITUAÇÃO FINAL - PÁGINAS ÓRFÃS

### 5.1 Órfãs Intencionais (Biblioteca Técnica)
**Estratégia:** Indexação via sitemap.xml, descoberta orgânica

- `/metodologia` - Será indexada em ETAPA 3 (sitemap.ts)
- `/cases` - Será indexada em ETAPA 3 (sitemap.ts)

### 5.2 Órfãs por Duplicação (Baixa Prioridade)
**Estratégia:** Manter sem links, possível remoção futura

- `/sobre` - Desvinculada do Footer, fisicamente existe
- `/about` - Nunca foi linkada, possível uso futuro (versão EN)

### 5.3 Órfãs Protegidas (Dashboard)
**Estratégia:** Ignorar para SEO (requerem autenticação)

- 27 páginas `/dashboard/*`
- 3 páginas de teste/admin

---

## 6. PRÓXIMOS PASSOS (ETAPA 3)

### 6.1 Sitemap Dinâmico
Criar `app/sitemap.ts` com geração dinâmica incluindo:
- ✅ Homepage
- ✅ Páginas estáticas (`/servicos`, `/quemsomos`, `/contato`, etc.)
- ✅ Páginas de solução (`/solucoes/*`)
- ✅ Posts do blog (`/blog/[slug]`)
- ✅ **Páginas de autoridade:** `/metodologia`, `/cases`
- ❌ **Excluir:** Dashboard, test pages, páginas duplicadas (`/sobre`, `/about`)

### 6.2 Robots.txt
Criar/atualizar `public/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /test-admin
Disallow: /loginadmin
Sitemap: https://investigaree.com.br/sitemap.xml
```

### 6.3 Canonical URLs
Validar que todas as páginas públicas têm canonical correto:
- `/quemsomos` → canonical (não `/sobre` ou `/about`)
- `/metodologia` → canonical
- `/cases` → canonical

---

## 7. MÉTRICAS FINAIS

| Categoria | Total | Com Links | Órfãs Intencionais | Órfãs Não Resolvidas |
|-----------|-------|-----------|-------------------|---------------------|
| Páginas Públicas | 59 | 55 | 2 (/metodologia, /cases) | 2 (/sobre, /about) |
| Páginas Dashboard | 27 | N/A | N/A | N/A |
| Taxa de Cobertura | - | 93.2% | 3.4% | 3.4% |

**Taxa de Páginas Públicas com Links Diretos:** 93.2% (55/59)
**Páginas Órfãs Estratégicas (Biblioteca Técnica):** 2 (3.4%)
**Páginas Órfãs por Duplicação:** 2 (3.4%)
**Órfãs Críticas (Bloqueadores de SEO):** 0 ✅

---

## 8. VALIDAÇÃO DE GOVERNANÇA

### ✅ Decisões Respeitadas:
1. **Metodologia e Cases NÃO incluídos no menu principal** conforme autorização condicional
2. **Biblioteca técnica mantida como navegação secundária** (descoberta via SEO + sitemap)
3. **Duplicatas de "Sobre" resolvidas** mantendo `/quemsomos` como canônico
4. **Dashboard ignorado para SEO** (páginas autenticadas)

### ⚠️ Pendências para ETAPA 3:
1. Criar sitemap.ts incluindo `/metodologia` e `/cases`
2. Validar canonical URLs
3. Criar/atualizar robots.txt

---

**ETAPA 2 CONCLUÍDA COM SUCESSO**
**Próxima Etapa:** ETAPA 3 - Sitemap, Robots.txt, Canonicals
