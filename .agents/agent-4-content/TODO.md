# 🎯 ROTEIRO AGENT 4 - CONTENT DEVELOPER

**Agent ID:** Agent 4
**Role:** Content Developer (Blog, Vídeos, SEO, Downloads)
**Workspace:** `.agents/agent-4-content/`
**Responsabilidade:** Conteúdo do blog, vídeos, materiais downloadable, SEO

---

## 📋 OBJETIVOS PRINCIPAIS

1. ✅ Completar série "Fontes Públicas Brasil" (8 posts faltantes)
2. ✅ Criar 3 vídeos tutoriais com screen recordings
3. ✅ Produzir 3 materiais downloadable (PDFs, checklists)
4. ✅ Otimizar SEO (schema markup, meta tags, sitemap)
5. ✅ Adicionar lead capture em conteúdos estratégicos
6. ✅ Criar conteúdo setorial (advogados, RH, fintechs)

---

## 🚀 SEMANA 1 - SÉRIE FONTES PÚBLICAS

### DIA 1-2 - POSTS 3, 4, 5 (12-16 horas)

#### ✅ TAREFA 4.1: Post 3 - Portal da Transparência

**Arquivo:** `investigaree/content/blog/fontes-publicas-03-portal-transparencia.mdx`

**Estrutura:**
```mdx
---
title: "Fontes Públicas #3: Portal da Transparência - CEIS e CNEP"
excerpt: "Aprenda a consultar sancionados e impedidos de licitar usando o Portal da Transparência do Governo Federal. Guia prático com exemplos reais."
coverImage: "/images/blog/portal-transparencia-ceis-cnep.jpg"
authorId: "dani-kaloi"
contentType: "tutorial"
topicId: "osint-brasil"
tags: ["portal-transparencia", "ceis", "cnep", "sancionados", "licitacoes", "fontes-publicas"]
skillLevel: "iniciante"
readingTime: 12
publishedAt: "2025-12-08T10:00:00.000Z"
featured: false
seriesId: "fontes-publicas-brasil"
seriesOrder: 3
---

## Introdução

O Portal da Transparência é uma das ferramentas mais poderosas para investigação de empresas e pessoas físicas no Brasil...

<KeyStat
  value="500 mil+"
  label="Registros de sancionados no CEIS/CNEP"
  source="CGU - Portal da Transparência (2024)"
/>

## 1. O que é o CEIS e CNEP?

### CEIS - Cadastro de Empresas Inidôneas e Suspensas
- Empresas punidas por órgãos públicos
- Suspensão temporária ou declaração de inidoneidade
- Impedimento de contratar com administração pública

### CNEP - Cadastro Nacional de Empresas Punidas
- Empresas condenadas pela Lei Anticorrupção (12.846/2013)
- Sanções mais graves
- Âmbito federal e estadual

<Callout type="legal">
**Base Legal:** Lei 12.846/2013 (Lei Anticorrupção) e Lei 8.666/1993 (Lei de Licitações)
</Callout>

## 2. Como Consultar Passo a Passo

<Timeline items={[
  { title: "Acessar Portal", description: "Ir para portaltransparencia.gov.br/sancoes", status: "completed" },
  { title: "Escolher Tipo", description: "CEIS (suspensões) ou CNEP (Lei Anticorrupção)", status: "completed" },
  { title: "Pesquisar", description: "CPF, CNPJ ou nome da empresa/pessoa", status: "completed" },
  { title: "Analisar Resultado", description: "Tipo de sanção, período, órgão sancionador", status: "current" }
]} />

### 2.1. Tipos de Busca

**Por CPF/CNPJ:**
- Mais preciso
- Retorna histórico completo
- Incluí sanções ativas e extintas

**Por Nome:**
- Útil para buscar homônimos
- Pode retornar múltiplos resultados
- Requer validação adicional

**Por Órgão Sancionador:**
- Filtrar sanções de um órgão específico
- Útil para investigar padrões

<ImageGallery images={[
  { src: "/images/blog/portal-transparencia-busca.png", alt: "Tela de busca Portal Transparência", caption: "Interface de busca do Portal" },
  { src: "/images/blog/portal-resultado-ceis.png", alt: "Resultado de busca CEIS", caption: "Exemplo de resultado no CEIS" }
]} />

## 3. Interpretando os Resultados

### Informações Disponíveis:

| Campo | Descrição |
|-------|-----------|
| **Nome/Razão Social** | Identificação do sancionado |
| **CPF/CNPJ** | Documento completo |
| **Tipo de Sanção** | Suspensão, Inidoneidade, Multa |
| **Órgão Sancionador** | Quem aplicou a sanção |
| **Data Início** | Quando começou o efeito |
| **Data Fim** | Quando termina (se aplicável) |
| **Fundamentação Legal** | Base legal da punição |
| **Número do Processo** | Processo administrativo |

<Callout type="warning">
**Atenção:** Sanções extintas aparecem no histórico. Verifique sempre a data de vigência!
</Callout>

## 4. Casos de Uso em Due Diligence

### 4.1. Verificação de Fornecedores

Antes de contratar fornecedor para projeto com recursos públicos:

1. Consultar CNPJ no CEIS
2. Verificar sócios no CPF
3. Checar empresas coligadas
4. Analisar histórico de sanções

### 4.2. Due Diligence Pré-Investimento

Investidor verificando startup que presta serviços ao governo:

- CNPJ da empresa
- CPF dos sócios
- Empresas anteriores dos sócios
- Histórico de sanções

### 4.3. Compliance Corporativo

Empresa precisa certificar que fornecedores não estão sancionados:

- Checklist mensal de fornecedores ativos
- Alertas automáticos (via API se disponível)
- Documentação para auditoria

<CTABanner
  variant="highlight"
  title="Automatize suas consultas de compliance"
  description="O Investigaree monitora automaticamente seus fornecedores no CEIS/CNEP e te alerta sobre mudanças."
  features={[
    "Monitoramento contínuo",
    "Alertas em tempo real",
    "Relatórios automatizados",
    "100% LGPD compliant"
  ]}
  primaryButton={{ text: "Experimente Grátis", href: "/contato?interesse=compliance" }}
  secondaryButton={{ text: "Ver Recursos", href: "/recursos" }}
/>

## 5. Limitações e Boas Práticas

### Limitações:
- ❌ Não inclui sanções municipais
- ❌ Atualização pode ter delay
- ❌ Não mostra processos em andamento
- ❌ Sem API pública para automação

### Boas Práticas:
- ✅ Consultar tanto CEIS quanto CNEP
- ✅ Verificar CPF dos sócios, não só CNPJ
- ✅ Documentar data da consulta
- ✅ Cruzar com outras fontes (TSE, Receita)
- ✅ Manter histórico de consultas (compliance)

## 6. Complementando com Outras Fontes

<ComparisonTable
  headers={["Fonte", "O que mostra", "Gratuita?", "Requer cadastro?"]}
  rows={[
    ["Portal Transparência (CEIS/CNEP)", "Sancionados administrativos", "✅ Sim", "❌ Não"],
    ["CNJ (PJe)", "Processos judiciais", "✅ Sim", "❌ Não"],
    ["TSE (Divulgacand)", "Candidaturas e doações", "✅ Sim", "❌ Não"],
    ["Receita Federal", "Dados cadastrais CPF/CNPJ", "✅ Sim", "❌ Não"],
    ["SERASA/JusBrasil", "Relatórios completos", "❌ Pago", "✅ Sim"]
  ]}
/>

## 7. Exemplo Prático: Investigação Completa

**Cenário:** Verificar fornecedor "Construções ABC Ltda" (CNPJ fictício: 12.345.678/0001-99)

### Passo 1: CEIS
```
Busca: 12345678000199
Resultado: 1 sanção ativa
- Tipo: Suspensão temporária
- Período: 01/2024 a 12/2025
- Órgão: Prefeitura de São Paulo
- Motivo: Descumprimento contratual
```

### Passo 2: CNEP
```
Busca: 12345678000199
Resultado: Nenhuma ocorrência
(Empresa não tem sanções pela Lei Anticorrupção)
```

### Passo 3: Verificar Sócios
```
Sócio 1 - João Silva (CPF: 123.456.789-00)
CEIS: Nenhuma ocorrência
CNEP: Nenhuma ocorrência

Sócio 2 - Maria Santos (CPF: 987.654.321-00)
CEIS: 1 sanção extinta (empresa anterior)
CNEP: Nenhuma ocorrência
```

### Conclusão do Exemplo:
🔴 **Alto Risco** - Empresa está suspensa de licitar até 12/2025. Sócia tem histórico de sanção em outra empresa.

**Recomendação:** Não contratar para projetos com recursos públicos. Se contratação privada, exigir garantias adicionais.

<Quiz questions={[
  {
    question: "Qual a diferença entre CEIS e CNEP?",
    options: [
      "CEIS é federal, CNEP é estadual",
      "CEIS lista suspensões, CNEP lista condenados por corrupção",
      "CEIS é pago, CNEP é gratuito",
      "Não há diferença, são sinônimos"
    ],
    correctAnswer: 1,
    explanation: "CEIS lista empresas inidôneas e suspensas (sanções administrativas gerais), enquanto CNEP lista especificamente empresas punidas pela Lei Anticorrupção (Lei 12.846/2013)."
  },
  {
    question: "Devo consultar apenas o CNPJ da empresa ou também CPF dos sócios?",
    options: [
      "Apenas CNPJ é suficiente",
      "Consultar ambos: CNPJ e CPF dos sócios",
      "Apenas CPF dos sócios",
      "Depende do tamanho da empresa"
    ],
    correctAnswer: 1,
    explanation: "É fundamental consultar tanto CNPJ quanto CPF dos sócios. Sócios com histórico de sanções podem representar risco mesmo que a empresa atual esteja limpa."
  },
  {
    question: "Uma sanção extinta ainda aparece no Portal?",
    options: [
      "Não, é apagada automaticamente",
      "Sim, fica no histórico",
      "Só se for solicitada via LAI",
      "Depende do tipo de sanção"
    ],
    correctAnswer: 1,
    explanation: "Sanções extintas permanecem no histórico do Portal da Transparência. Por isso é crucial verificar as datas de início e fim para saber se a sanção ainda está vigente."
  },
  {
    question: "O Portal da Transparência inclui sanções municipais?",
    options: [
      "Sim, todas",
      "Não, apenas federais e algumas estaduais",
      "Apenas de capitais",
      "Sim, mas com delay de 1 ano"
    ],
    correctAnswer: 1,
    explanation: "O Portal da Transparência Federal lista principalmente sanções de órgãos federais e alguns estaduais que compartilham dados. Sanções municipais geralmente precisam ser consultadas nos portais das prefeituras."
  }
]} />

## Conclusão

O Portal da Transparência (CEIS/CNEP) é **essencial** em qualquer processo de due diligence envolvendo contratos públicos. A consulta é:

- ✅ **Gratuita** e sem necessidade de cadastro
- ✅ **Oficial** - dados da CGU e órgãos públicos
- ✅ **Completa** - histórico de sanções ativas e extintas
- ✅ **Acessível** - interface simples e intuitiva

**Principais takeaways:**
1. Sempre consultar tanto CEIS quanto CNEP
2. Verificar CNPJ da empresa E CPF dos sócios
3. Atentar para datas de início e fim de sanções
4. Documentar todas as consultas para compliance
5. Complementar com outras fontes (Receita, TSE, CNJ)

Na próxima parte da série, vamos explorar a **consulta de processos judiciais** através do PJe e tribunais estaduais.

---

**Série Fontes Públicas Brasil:**
- Parte 1: Receita Federal (CPF e CNPJ) ✅
- Parte 2: TSE (Candidaturas e Doações) ✅
- **Parte 3: Portal da Transparência (CEIS/CNEP)** ← Você está aqui
- Parte 4: Tribunais (Processos Judiciais) - Em breve
- Parte 5: INSS/Dataprev - Em breve

<SeriesNavigation
  series="fontes-publicas-brasil"
  currentPart={3}
  totalParts={10}
/>
```

**Checklist:**
- [ ] Escrever conteúdo completo (2500-3000 palavras)
- [ ] Adicionar KeyStat com dado da CGU 2024
- [ ] Criar Timeline com passos de consulta
- [ ] Adicionar ComparisonTable com fontes complementares
- [ ] Incluir ImageGallery (screenshots do portal)
- [ ] Adicionar CTABanner para lead capture
- [ ] Criar Quiz com 4 perguntas
- [ ] Adicionar SeriesNavigation
- [ ] Revisar SEO (título, excerpt, tags)
- [ ] Commit: `[A4] Add blog post: Fontes Públicas #3 - Portal Transparência`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.2: Post 4 - Tribunais (Processos Judiciais)

**Arquivo:** `investigaree/content/blog/fontes-publicas-04-tribunais-processos.mdx`

**Tópicos principais:**
- PJe (Processo Judicial Eletrônico)
- Consulta por nome e CPF
- BNMP (Banco Nacional de Mandados de Prisão)
- Tribunais estaduais vs. federais
- Como interpretar andamentos processuais

**Checklist:**
- [ ] Pesquisar dados atualizados 2024-2025
- [ ] Escrever 2500-3000 palavras
- [ ] Screenshots de tribunais
- [ ] Exemplo prático de consulta
- [ ] Quiz com 4 perguntas
- [ ] Commit: `[A4] Add blog post: Fontes Públicas #4 - Tribunais`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.3: Post 5 - INSS/Dataprev

**Arquivo:** `investigaree/content/blog/fontes-publicas-05-inss-dataprev.mdx`

**Tópicos principais:**
- Benefícios sociais e previdenciários
- Como detectar fraudes em benefícios
- Consulta de vínculos empregatícios (CNIS)
- Cruzamento CPF x benefícios
- Casos de uso em investigações

**Checklist:**
- [ ] Pesquisar regulamentação INSS 2024
- [ ] Escrever 2500-3000 palavras
- [ ] Exemplos de fraudes comuns
- [ ] Fluxograma de verificação
- [ ] Quiz
- [ ] Commit: `[A4] Add blog post: Fontes Públicas #5 - INSS`
- [ ] Atualizar STATUS.md

---

### DIA 3-4 - POSTS 6, 7, 8 (12-16 horas)

#### ✅ TAREFA 4.4: Post 6 - Juntas Comerciais

**Arquivo:** `investigaree/content/blog/fontes-publicas-06-juntas-comerciais.mdx`

**Tópicos:**
- O que são Juntas Comerciais
- Como consultar empresas por estado
- Alterações contratuais e histórico
- Descobrir vínculos societários ocultos
- Redesim e Integra (rede nacional)

**Checklist:** (similar aos anteriores)
- [ ] Conteúdo completo
- [ ] Commit: `[A4] Add blog post: Fontes Públicas #6 - Juntas Comerciais`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.5: Post 7 - Cartórios (Imóveis, Protestos)

**Arquivo:** `investigaree/content/blog/fontes-publicas-07-cartorios-imoveis-protestos.mdx`

**Tópicos:**
- Cartórios de Registro de Imóveis
- Cartórios de Protesto
- Como consultar online (quando disponível)
- Descobrir patrimônio oculto em divórcios
- Protestos como indicador de problemas financeiros

**Checklist:** (similar)
- [ ] Conteúdo completo
- [ ] Commit: `[A4] Add blog post: Fontes Públicas #7 - Cartórios`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.6: Post 8 - DETRAN

**Arquivo:** `investigaree/content/blog/fontes-publicas-08-detran-veiculos.mdx`

**Tópicos:**
- Consulta de veículos por placa
- Multas e infrações
- Detecção de patrimônio oculto (veículos)
- CNH - consulta de habilitação
- Indicadores de risco (multas graves, suspensões)

**Checklist:** (similar)
- [ ] Conteúdo completo
- [ ] Commit: `[A4] Add blog post: Fontes Públicas #8 - DETRAN`
- [ ] Atualizar STATUS.md

---

### DIA 5 - POSTS 9, 10 (8-12 horas)

#### ✅ TAREFA 4.7: Post 9 - Diários Oficiais

**Arquivo:** `investigaree/content/blog/fontes-publicas-09-diarios-oficiais.mdx`

**Tópicos:**
- DOU, DOE, DOM
- Como pesquisar em diários oficiais
- Jurisp (agregador de diários)
- Casos de uso (licitações, nomeações, editais)
- Alertas automáticos

**Checklist:** (similar)
- [ ] Conteúdo completo
- [ ] Commit: `[A4] Add blog post: Fontes Públicas #9 - Diários Oficiais`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.8: Post 10 - OSINT em Redes Sociais

**Arquivo:** `investigaree/content/blog/fontes-publicas-10-osint-redes-sociais.mdx`

**Tópicos:**
- Técnicas de OSINT em redes sociais
- Facebook, Instagram, LinkedIn, Twitter/X
- Google dorking para redes sociais
- Ferramentas (Maltego, Sherlock, etc.)
- Ética e LGPD em OSINT
- Documentação de evidências

**Checklist:** (similar)
- [ ] Conteúdo completo
- [ ] Commit: `[A4] Add blog post: Fontes Públicas #10 - OSINT Redes Sociais`
- [ ] Atualizar STATUS.md
- [ ] **Postar em COORDINATION.md: Série Fontes Públicas 100% completa! 🎉**

---

## 🚀 SEMANA 2 - VÍDEOS & DOWNLOADS

### DIA 1-2 - VÍDEOS TUTORIAIS (10-14 horas)

#### ✅ TAREFA 4.9: Vídeo 1 - Como Consultar CPF na Receita Federal

**Objetivo:** Screen recording mostrando passo a passo

**Roteiro:**
1. Intro (30s): Apresentação e objetivo do vídeo
2. Acessar site da Receita (1min)
3. Fazer consulta de CPF (2min)
4. Interpretar resultado (2min)
5. Dicas de segurança (1min)
6. CTA: Conhecer Investigaree (30s)

**Ferramentas:**
- OBS Studio (screen recording)
- DaVinci Resolve (edição)
- Microfone de qualidade

**Checklist:**
- [ ] Escrever roteiro completo
- [ ] Gravar screen recording (resolução 1080p)
- [ ] Gravar narração (áudio limpo)
- [ ] Editar vídeo (cortes, transições, legendas)
- [ ] Adicionar intro/outro com branding Investigaree
- [ ] Exportar MP4 (H.264, 1080p)
- [ ] Upload para YouTube (canal Investigaree)
- [ ] Criar thumbnail profissional
- [ ] Otimizar SEO (título, descrição, tags, capítulos)
- [ ] Salvar em `public/videos/tutorial-cpf-receita-federal.mp4`
- [ ] Embedir no blog post correspondente usando VideoEmbed
- [ ] Commit: `[A4] Add video tutorial: CPF Receita Federal`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.10: Vídeo 2 - Como Consultar Empresas no CNPJ

**Similar ao anterior, duração 6-8min**

**Checklist:** (similar à TAREFA 4.9)
- [ ] Produzir vídeo completo
- [ ] Upload YouTube
- [ ] Embedir no blog
- [ ] Commit: `[A4] Add video tutorial: CNPJ Receita Federal`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.11: Vídeo 3 - Portal da Transparência (CEIS/CNEP)

**Similar, duração 7-9min**

**Checklist:** (similar)
- [ ] Produzir vídeo completo
- [ ] Upload YouTube
- [ ] Embedir no blog
- [ ] Commit: `[A4] Add video tutorial: Portal Transparência CEIS CNEP`
- [ ] Atualizar STATUS.md
- [ ] **Postar em COORDINATION.md: 3 vídeos tutoriais prontos!**

---

### DIA 3-4 - MATERIAIS DOWNLOADABLE (8-12 horas)

#### ✅ TAREFA 4.12: Download 1 - Checklist Due Diligence Completo

**Arquivo:** `public/downloads/checklist-due-diligence-completo.pdf`

**Conteúdo (PDF profissional):**
- Capa com branding Investigaree
- Introdução: O que é due diligence
- Checklist Pessoa Física (25 itens):
  - [ ] Consulta CPF (Receita Federal)
  - [ ] Processos judiciais (PJe, tribunais)
  - [ ] Sanções (CEIS/CNEP)
  - [ ] Candidaturas e doações (TSE)
  - [ ] Protestos (cartórios)
  - [ ] Veículos (DETRAN)
  - [ ] Imóveis (cartórios)
  - [ ] Redes sociais (OSINT)
  - [ ] ... (mais 17 itens)

- Checklist Pessoa Jurídica (30 itens):
  - [ ] Consulta CNPJ (Receita)
  - [ ] Quadro societário (QSA completo)
  - [ ] Processos (empresarial, trabalhista)
  - [ ] Sanções (CEIS/CNEP)
  - [ ] Dívidas ativas (PGFN)
  - [ ] Certidões negativas (federal, estadual, municipal)
  - [ ] Contrato social (Junta Comercial)
  - [ ] ... (mais 23 itens)

- Matriz de Risco (scoring)
- Modelo de relatório
- Referências e fontes

**Checklist:**
- [ ] Criar PDF no Canva ou similar
- [ ] Design profissional (cores Investigaree)
- [ ] Salvar em `public/downloads/`
- [ ] Criar landing page: `/downloads/checklist-due-diligence`
- [ ] Adicionar lead capture (email obrigatório)
- [ ] Integrar com Resend (enviar por email)
- [ ] Adicionar DownloadCard nos blog posts relevantes
- [ ] Commit: `[A4] Add downloadable: Due Diligence Checklist PDF`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.13: Download 2 - Template Relatório de Investigação

**Arquivo:** `public/downloads/template-relatorio-investigacao.docx` + `.pdf`

**Conteúdo:**
- Template Word editável
- Capa profissional
- Sumário executivo
- Seções pré-formatadas:
  - Dados cadastrais
  - Vínculos empresariais
  - Situação fiscal e tributária
  - Processos judiciais
  - Análise de risco
  - Conclusões e recomendações
- Instruções de preenchimento
- Branding Investigaree

**Checklist:** (similar)
- [ ] Criar template Word
- [ ] Exportar PDF exemplo
- [ ] Landing page com lead capture
- [ ] Commit: `[A4] Add downloadable: Investigation Report Template`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.14: Download 3 - Guia LGPD para Investigadores

**Arquivo:** `public/downloads/guia-lgpd-investigacoes.pdf`

**Conteúdo (PDF 15-20 páginas):**
- O que é LGPD
- Bases legais para investigações
- Dados que podem ser consultados
- Consentimento vs. legítimo interesse
- Como documentar investigações
- Cadeia de custódia digital
- Casos práticos
- Checklist de compliance
- Referências legais

**Checklist:** (similar)
- [ ] Pesquisar legislação atualizada
- [ ] Criar PDF com conteúdo jurídico
- [ ] Revisar com Dani (advogada)
- [ ] Landing page
- [ ] Commit: `[A4] Add downloadable: LGPD Guide for Investigators`
- [ ] Atualizar STATUS.md
- [ ] **Postar em COORDINATION.md: 3 materiais downloadable prontos!**

---

### DIA 5 - SEO OPTIMIZATION (6-8 horas)

#### ✅ TAREFA 4.15: Implementar Schema Markup

**Objetivo:** Rich snippets no Google

**Arquivos a modificar:**
- `investigaree/src/app/blog/[slug]/page.tsx`
- `investigaree/src/components/blog/templates/*.tsx`

**Schema types a adicionar:**

1. **Article Schema** (todos os posts):
```typescript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  "description": post.excerpt,
  "image": post.coverImage,
  "author": {
    "@type": "Person",
    "name": post.author.name,
    "jobTitle": post.author.title,
    "url": `https://investigaree.com.br/quemsomos/${post.authorId}`
  },
  "publisher": {
    "@type": "Organization",
    "name": "Investigaree",
    "logo": {
      "@type": "ImageObject",
      "url": "https://investigaree.com.br/logo.png"
    }
  },
  "datePublished": post.publishedAt,
  "dateModified": post.updatedAt || post.publishedAt
};
```

2. **HowTo Schema** (tutoriais):
```typescript
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": post.title,
  "description": post.excerpt,
  "step": [
    {
      "@type": "HowToStep",
      "name": "Passo 1: Acessar site da Receita",
      "text": "Instruções detalhadas...",
      "image": "url-screenshot.png"
    },
    // ... mais passos
  ]
};
```

3. **FAQPage Schema** (posts com quiz):
```typescript
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Pergunta do quiz",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Resposta e explicação"
      }
    }
  ]
};
```

**Checklist:**
- [ ] Adicionar Article schema em todos os posts
- [ ] Adicionar HowTo schema em tutoriais
- [ ] Adicionar FAQPage schema em posts com quiz
- [ ] Adicionar BreadcrumbList schema
- [ ] Testar com Google Rich Results Test
- [ ] Commit: `[A4] Add JSON-LD schema markup for SEO`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.16: Otimizar Meta Tags

**Checklist:**
- [ ] Revisar todos os 28 posts existentes
- [ ] Otimizar meta descriptions (150-160 chars)
- [ ] Adicionar Open Graph tags faltantes
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] Hreflang tags (se multilíngue no futuro)
- [ ] Commit: `[A4] Optimize meta tags across all blog posts`
- [ ] Atualizar STATUS.md

---

## 🚀 SEMANA 3 - CONTEÚDO SETORIAL

### DIA 1-2 - CONTEÚDO PARA ADVOGADOS (8-12 horas)

#### ✅ TAREFA 4.17: Landing Page - Due Diligence para Escritórios de Advocacia

**Arquivo:** `investigaree/src/app/solucoes/advogados/page.tsx`

**Conteúdo:**
- Hero: "Due Diligence Jurídica com Tecnologia"
- Pain points de advogados:
  - Processos manuais demorados
  - Custo alto de investigações
  - Dificuldade em consolidar informações
- Soluções Investigaree:
  - Consultas automatizadas
  - Relatórios profissionais
  - Integração com workflow jurídico
- Casos de uso:
  - Due diligence para M&A
  - Investigação de partes em litígios
  - Background check de testemunhas
  - Asset tracing em execuções
- Depoimentos (se houver)
- CTA: Agendar demo

**Checklist:**
- [ ] Criar página completa
- [ ] Design específico para público jurídico
- [ ] Estudos de caso (se disponíveis)
- [ ] Formulário de contato segmentado
- [ ] Commit: `[A4] Add landing page: Solutions for Law Firms`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.18: Blog Post - Due Diligence Jurídica: Guia Completo

**Arquivo:** `investigaree/content/blog/due-diligence-juridica-guia-completo.mdx`

**Conteúdo aprofundado para advogados**

**Checklist:** (similar a outros posts)
- [ ] Conteúdo técnico-jurídico
- [ ] Commit: `[A4] Add blog post: Legal Due Diligence Complete Guide`
- [ ] Atualizar STATUS.md

---

### DIA 3-4 - CONTEÚDO PARA RH (8-12 horas)

#### ✅ TAREFA 4.19: Landing Page - Background Check para Recrutamento

**Arquivo:** `investigaree/src/app/solucoes/rh/page.tsx`

**Conteúdo similar, focado em RH**

**Checklist:**
- [ ] Criar landing page RH
- [ ] Commit: `[A4] Add landing page: Solutions for HR`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 4.20: Blog Post - Background Check LGPD-Compliant

**Arquivo:** `investigaree/content/blog/background-check-rh-lgpd-compliant.mdx`

**Checklist:**
- [ ] Conteúdo para RH
- [ ] Compliance e ética
- [ ] Commit: `[A4] Add blog post: LGPD-Compliant Background Checks for HR`
- [ ] Atualizar STATUS.md

---

### DIA 5 - CONTEÚDO PARA FINTECHS (4-6 horas)

#### ✅ TAREFA 4.21: Landing Page - Compliance para Fintechs

**Arquivo:** `investigaree/src/app/solucoes/fintechs/page.tsx`

**Foco em KYC, AML, PLD**

**Checklist:**
- [ ] Landing page fintechs
- [ ] Commit: `[A4] Add landing page: Solutions for Fintechs`
- [ ] Atualizar STATUS.md

---

## 🚀 SEMANA 4 - POLISH & ANALYTICS

### ✅ TAREFA 4.22: Configurar Google Search Console (2-3 horas)

**Checklist:**
- [ ] Criar conta Google Search Console
- [ ] Verificar propriedade do site
- [ ] Submeter sitemap.xml
- [ ] Configurar alertas
- [ ] Commit: `[A4] Configure Google Search Console`
- [ ] Atualizar STATUS.md

---

### ✅ TAREFA 4.23: Configurar Google Analytics 4 (2-3 horas)

**Checklist:**
- [ ] Criar propriedade GA4
- [ ] Instalar gtag no Next.js
- [ ] Configurar eventos customizados:
  - Download de materiais
  - Play de vídeos
  - Submissão de formulários
  - Tempo de leitura de posts
- [ ] Testar tracking
- [ ] Commit: `[A4] Configure Google Analytics 4`
- [ ] Atualizar STATUS.md

---

### ✅ TAREFA 4.24: Content Audit & Refresh (4-6 horas)

**Checklist:**
- [ ] Revisar todos os 38 posts (28 existentes + 10 novos)
- [ ] Atualizar estatísticas desatualizadas
- [ ] Corrigir links quebrados
- [ ] Adicionar internal linking entre posts relacionados
- [ ] Verificar imagens (alt text, compressão)
- [ ] Commit: `[A4] Content audit and refresh`
- [ ] Atualizar STATUS.md para DONE
- [ ] **Postar em COORDINATION.md: Conteúdo 100% completo e otimizado! 🚀**

---

## 📊 MÉTRICAS DE SUCESSO

- [ ] 38 blog posts publicados (28 existentes + 10 novos)
- [ ] Série "Fontes Públicas" 100% completa
- [ ] 3 vídeos tutoriais no YouTube
- [ ] 3 materiais downloadable com lead capture
- [ ] Schema markup em todos os posts
- [ ] Google Search Console configurado
- [ ] Google Analytics 4 tracking eventos
- [ ] 3 landing pages setoriais (advogados, RH, fintechs)

---

## 🔗 DEPENDÊNCIAS

**Aguardando de outros agents:**
- Nenhuma (trabalho independente)

**Fornecendo para outros agents:**
- Nenhuma (conteúdo standalone)

---

## 📝 COMUNICAÇÃO

**Atualizar STATUS.md:**
- A cada 2 posts completados
- A cada vídeo completado
- No mínimo a cada 6 horas

**Postar em COORDINATION.md:**
- Ao completar série Fontes Públicas (DIA 5)
- Ao completar 3 vídeos (SEMANA 2)
- Ao completar 3 downloads (SEMANA 2)
- Ao finalizar todas as tarefas (SEMANA 4)

---

## 🛠️ FERRAMENTAS & COMANDOS

**Setup:**
```bash
cd investigaree
npm install
```

**Criar novo post:**
```bash
# Copiar template
cp content/blog/_template.mdx content/blog/novo-post.mdx
```

**Preview:**
```bash
npm run dev
# Acessar http://localhost:3000/blog/slug-do-post
```

**Build:**
```bash
npm run build
```

---

## 📂 ARQUIVOS SOB RESPONSABILIDADE

**Exclusivos (apenas Agent 4):**
- `investigaree/content/blog/**/*` (todos os posts)
- `investigaree/public/videos/**/*`
- `investigaree/public/downloads/**/*`
- `investigaree/src/app/solucoes/**/*` (landing pages setoriais)

**Coordenados:**
- Nenhum (trabalho isolado)

---

**Criado:** 2025-12-07
**Última atualização:** 2025-12-07 16:00
