# 🎯 MVP - DEFINIÇÃO COMPLETA

**Projeto:** Investigação Digital → SaaS Político
**Versão:** MVP 1.0
**Timeline:** 6 semanas (4 mínimo)
**Data:** 17/01/2026
**Status:** ✅ APROVADO E PRONTO PARA EXECUÇÃO

---

## 📊 EXECUTIVE SUMMARY

### O Problema

Hoje criamos **3 planos diferentes** com escopo total de:
- 50+ páginas
- 105 tarefas
- 12 semanas
- 480-600 horas

**REALIDADE:** Impossível executar com excelência. Scope creep identificado.

### A Solução: MVP

**MVP = Mínimo para validar valor + Máximo impacto**

- ✅ **7 páginas** (não 50+)
- ✅ **40 tarefas** (não 105)
- ✅ **6 semanas** (não 12)
- ✅ **160-240 horas** (não 600)
- ✅ **Validar mercado** antes de investir tudo

---

## 🎯 OBJETIVO DO MVP

### Validar 3 Hipóteses Críticas

1. **Mercado existe?**
   - Consultorias políticas pagarão por SaaS de vetting?
   - Preço R$ 15K-250K por campanha é viável?

2. **Produto resolve dor?**
   - Dashboard de vetting é útil?
   - Compliance TSE automatizado tem valor?

3. **Canal funciona?**
   - Homepage converte leads?
   - WhatsApp é canal adequado?

### Não-Objetivos do MVP

- ⛔ Ganhar prêmios de design (v2)
- ⛔ Ter todas as features (v2)
- ⛔ Atender todos os públicos (v2)
- ⛔ Performance perfeita (v2)

---

## 📋 SCOPE MVP - O QUE ENTRA E O QUE NÃO ENTRA

### ✅ PÁGINAS MVP (7 total)

#### Públicas (5 páginas)

**1. Homepage (/)**
**Objetivo:** Converter visitantes em leads qualificados
**Seções:**
- Hero com value prop política
- 2 CTAs (Demo + Verificação Grátis)
- Social proof (5.950 candidatos verificados)
- Problema (Lei Ficha Limpa)
- Solução (1 card: Campanhas)
- Compliance badges
- CTA final

**Performance target:** LCP < 3.5s mobile

---

**2. Solução Campanhas (/solucoes/campanhas)**
**Objetivo:** Detalhar solução para público principal (70% mercado)
**Seções:**
- Hero com urgência (Eleições 2026)
- Cronograma eleitoral (timeline vertical mobile)
- Pricing table (3 pacotes)
- Casos de sucesso (2-3)
- Compliance (Lei 9.504, LGPD)
- CTA final

**Performance target:** LCP < 4s

---

**3. Serviço Vetting (/servicos/vetting-candidatos)**
**Objetivo:** Explicar serviço core
**Seções:**
- Hero (Compliance Ficha Limpa)
- O que verificamos (accordion mobile)
- 3 pacotes (Básico R$ 500, Padrão R$ 2K, Premium R$ 15K)
- Como funciona (timeline 4 steps)
- FAQ (5-8 perguntas)

**Performance target:** LCP < 4s

---

**4. Preços (/precos)**
**Objetivo:** Transparência de pricing
**Seções:**
- Tabs por público (só Campanhas no MVP)
- Tabela detalhada 3 pacotes
- Serviços avulsos
- FAQ pricing

**Performance target:** LCP < 3s

---

**5. Contato (/contato)**
**Objetivo:** Capturar leads
**Seções:**
- Formulário simples (Nome, Email, Telefone, Público-alvo, Mensagem)
- WhatsApp direto (botão)
- Email: contato@investigaree.com.br
- Horário atendimento

**Performance target:** LCP < 2.5s

---

#### Dashboard (2 páginas)

**6. Dashboard Overview (/dashboard)**
**Objetivo:** Mostrar valor do produto
**Seções:**
- Stats cards (Total candidatos, Aprovados, Red flags, Pendentes)
- Gráfico simples (bar chart vertical mobile)
- Últimas verificações (cards)
- CTA: Verificar novo candidato

**Performance target:** LCP < 4s (ok ser mais lento)

---

**7. Dashboard Candidatos (/dashboard/candidatos)**
**Objetivo:** Core do produto - vetting
**Seções:**
- Upload CPF (input simples)
- Lista de candidatos (cards mobile, tabela desktop)
- Filtros básicos (Status, Cargo)
- Download relatório (PDF mock)

**Performance target:** LCP < 5s (ok ser mais lento)

---

### ❌ PÁGINAS QUE FICAM FORA (43 páginas)

**Soluções (3 removidas):**
- ⛔ /solucoes/partidos
- ⛔ /solucoes/consultorias
- ⛔ /solucoes/lobbying

**Serviços (5 removidos):**
- ⛔ /servicos/triagem-doadores
- ⛔ /servicos/pesquisa-oposicao
- ⛔ /servicos/due-diligence-pep
- ⛔ /servicos/licitacoes
- ⛔ /servicos/background-nomeacoes

**Recursos (3 removidos):**
- ⛔ /recursos/ficha-limpa
- ⛔ /recursos/compliance-tse
- ⛔ /recursos/lgpd-politico

**Suporte (4 removidos):**
- ⛔ /metodologia
- ⛔ /cases
- ⛔ /faq (global)
- ⛔ /quemsomos (reduzir a 1 parágrafo no footer)

**Dashboard (22 removidas):**
- ⛔ 22 outras páginas dashboard

**Total removido:** 43 páginas (86% redução)

---

### ✅ FEATURES MVP

#### Design System Básico

**Color Palette:**
```css
/* Primary - Deep Teal (político neutro) */
--primary-900: #1a3a52;
--primary-700: #2d5f7f;
--primary-500: #4a90b8;

/* Accent - Electric Blue (CTAs) */
--accent-electric: #00d4ff;
--accent-warning: #ff6b35;

/* Neutrals - Off-white (não pure white) */
--neutral-0: #faf9f7;
--neutral-900: #1f1e1c;

/* Dark mode - Dark gray (não pure black) */
--dark-bg: #1a1918;
--dark-surface: #252321;
```

**Typography:**
- Font: Inter Variable (subset PT-BR)
- Mobile: 16px base, 28px H1
- Desktop: 18px base, 48px H1
- Line-height: 1.6

**Components:**
- Button (3 variants: primary, secondary, ghost)
- Card (básico, sem glassmorphism complexo)
- Input (validation visual simples)
- Badge (urgência, compliance)

---

#### Mobile-First (Obrigatório)

- ✅ Funciona 375px (iPhone SE)
- ✅ Touch targets 44x44px+ (TODOS)
- ✅ Hamburger menu mobile
- ✅ Bottom navigation dashboard
- ✅ Cards mobile (não tabelas)
- ⛔ ~~Pull to refresh~~ (v2)
- ⛔ ~~Swipe gestures~~ (v2)
- ⛔ ~~Haptic feedback~~ (v2)

---

#### Dark Mode

**Implementação:**
- ✅ Toggle manual (Header)
- ✅ next-themes
- ✅ CSS variables
- ✅ Transition suave (300ms)
- ✅ Contrast ratios: 4.5:1
- ⛔ ~~Auto system preference~~ (MVP: manual only)
- ⛔ ~~Per-page preference~~ (v2)

**Porque incluir no MVP:**
- 82.7% usuários usam
- Diferencial competitivo
- 1 semana adicional (worth it)

---

#### Performance (Realista)

**Targets MVP:**
- ✅ LCP < 3.5s (mobile 3G) - REALISTA
- ✅ Lighthouse Performance: 85+
- ✅ Images: WebP
- ✅ Lazy loading below fold
- ⛔ ~~LCP < 2.0s~~ (award target - v2)
- ⛔ ~~AVIF images~~ (v2)
- ⛔ ~~Critical CSS inline~~ (v2)

**Otimizações MVP:**
- Next.js Image component
- Font subset PT-BR
- Code splitting automático (Next.js)
- No heavy animations

---

#### Micro-interactions (Básicas)

- ✅ Hover effects (scale, color)
- ✅ Button loading states (spinner)
- ✅ Form validation visual (border color)
- ✅ Smooth transitions (300ms)
- ⛔ ~~Magnetic buttons~~ (v2)
- ⛔ ~~Smart loaders com info útil~~ (v2)
- ⛔ ~~3D tilt cards~~ (v2)
- ⛔ ~~Kinetic typography~~ (v2)

---

#### Personalization (Mínima)

**MVP:**
- ✅ Hero copy por URL param
  - `?segment=campanha` → "Garanta Compliance TSE"
  - `?segment=partido` → "Verifique Milhares de Candidatos"

**V2:**
- ⛔ Hero dinâmico real-time
- ⛔ Recomendações inteligentes
- ⛔ Chat contextual
- ⛔ Onboarding adaptativo

---

#### Accessibility (Básica)

- ✅ Contrast ratios: 4.5:1 (text), 3:1 (UI)
- ✅ Keyboard navigation funcional
- ✅ Alt texts em imagens
- ✅ ARIA labels básicos
- ✅ Skip link
- ⛔ ~~Screen reader testing completo~~ (v2)
- ⛔ ~~WCAG 2.1 AA+ certificação~~ (v2)
- ⛔ ~~Reduced motion completo~~ (v2)

**Target:** Lighthouse Accessibility 90+ (não 100)

---

### ❌ FEATURES FORA DO MVP

**Premium Design:**
- ⛔ Kinetic typography (animated text)
- ⛔ 3D elements (React Three Fiber)
- ⛔ Glassmorphism complexo
- ⛔ Advanced scroll animations
- ⛔ Bento grid (usar grid simples)

**Premium Interactions:**
- ⛔ Magnetic buttons
- ⛔ Smart loading states
- ⛔ 3D tilt hover
- ⛔ Scroll-triggered animations

**AI Features:**
- ⛔ Real-time personalization
- ⛔ Recommendation engine
- ⛔ Chatbot AI
- ⛔ Voice interface
- ⛔ Gamification

**Advanced Features:**
- ⛔ Real-time collaboration
- ⛔ Advanced analytics
- ⛔ API pública
- ⛔ White-label
- ⛔ Multi-tenancy

**Total features removidas:** ~20

---

## 🏗️ ARQUITETURA MVP

### File Structure

```
investigacao/
├── src/
│   ├── app/
│   │   ├── page.tsx                         # Homepage
│   │   ├── layout.tsx                       # Root layout (dark mode)
│   │   │
│   │   ├── solucoes/
│   │   │   └── campanhas/
│   │   │       └── page.tsx                 # Landing campanhas
│   │   │
│   │   ├── servicos/
│   │   │   └── vetting-candidatos/
│   │   │       └── page.tsx                 # Serviço vetting
│   │   │
│   │   ├── precos/
│   │   │   └── page.tsx                     # Pricing table
│   │   │
│   │   ├── contato/
│   │   │   └── page.tsx                     # Contact form
│   │   │
│   │   └── dashboard/
│   │       ├── layout.tsx                   # Dashboard layout
│   │       ├── page.tsx                     # Overview
│   │       └── candidatos/
│   │           └── page.tsx                 # Vetting list
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx                   # 3 variants
│   │   │   ├── Card.tsx                     # Básico
│   │   │   ├── Input.tsx                    # Validation visual
│   │   │   ├── Badge.tsx                    # Urgency, compliance
│   │   │   ├── Select.tsx
│   │   │   └── Textarea.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx                   # Mobile-first + dark mode
│   │   │   ├── Footer.tsx
│   │   │   ├── MobileMenu.tsx               # Hamburger
│   │   │   └── DashboardNav.tsx             # Bottom nav mobile
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero.tsx                     # Reusable hero
│   │   │   ├── SocialProof.tsx              # Stats
│   │   │   ├── PricingTable.tsx             # 3 tiers
│   │   │   └── CTA.tsx                      # Final CTA
│   │   │
│   │   └── ThemeProvider.tsx                # next-themes wrapper
│   │
│   ├── lib/
│   │   ├── design-tokens.ts                 # Colors, typography
│   │   ├── utils.ts                         # cn(), etc.
│   │   └── constants.ts                     # Static data
│   │
│   ├── styles/
│   │   └── globals.css                      # Tailwind + custom
│   │
│   └── types/
│       └── index.ts                         # TypeScript types
│
├── public/
│   ├── images/
│   │   ├── hero/                            # Hero images (WebP)
│   │   ├── logos/                           # Client logos
│   │   └── icons/                           # SVG icons
│   │
│   └── fonts/
│       └── inter-var-subset.woff2           # Subset PT-BR
│
├── tailwind.config.ts                       # Theme config
├── next.config.js                           # Next config
└── package.json
```

**Total arquivos:** ~30 (não 100+)

---

### Tech Stack MVP

**Core:**
- ✅ Next.js 14+ (App Router)
- ✅ TypeScript (strict mode)
- ✅ React 18
- ✅ Tailwind CSS

**UI/Styling:**
- ✅ next-themes (dark mode)
- ✅ Framer Motion (animations básicas)
- ✅ Lucide React (icons)
- ⛔ ~~React Three Fiber~~ (v2)

**Forms:**
- ✅ React Hook Form
- ✅ Zod (validation)

**Analytics:**
- ✅ Google Analytics 4
- ⛔ ~~Hotjar~~ (v2)
- ⛔ ~~Microsoft Clarity~~ (v2)

**Backend:**
- ✅ Mock data (JSON)
- ⛔ ~~API real SERPRO~~ (v2)
- ⛔ ~~Database~~ (v2)
- ⛔ ~~Auth~~ (v2 - MVP: login fake)

**Deployment:**
- ✅ Vercel (free tier)
- ⛔ ~~Custom domain~~ (usar .vercel.app no MVP)

---

## 📅 TIMELINE MVP - 6 SEMANAS

### SEMANA 1: FUNDAÇÃO (40h)

**Objetivo:** Setup + Design System funcionando

#### Dia 1-2: Setup Projeto (16h)
- [ ] Inicializar Next.js 14 + TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar dependencies
  ```bash
  npm install next-themes framer-motion lucide-react
  npm install react-hook-form zod @hookform/resolvers
  ```
- [ ] Criar design tokens
  ```typescript
  // lib/design-tokens.ts
  export const colors = { ... }
  export const typography = { ... }
  ```
- [ ] Configurar dark mode (next-themes)
- [ ] Setup TypeScript strict

**Entregáveis:**
- [x] Projeto rodando localhost:3000
- [x] Dark mode toggle funcionando
- [x] Tailwind configurado

---

#### Dia 3-4: Componentes Base (16h)
- [ ] Button component
  ```tsx
  <Button variant="primary" size="lg">
    Verificar Candidato
  </Button>
  ```
  - Variants: primary, secondary, ghost
  - Sizes: sm, md, lg
  - Loading state
  - Disabled state

- [ ] Card component
  ```tsx
  <Card>
    <CardHeader>Título</CardHeader>
    <CardContent>Conteúdo</CardContent>
  </Card>
  ```

- [ ] Input component
  ```tsx
  <Input
    label="CPF"
    error="CPF inválido"
    {...register('cpf')}
  />
  ```
  - Validation visual (border color)
  - Error message
  - Label sempre visível

- [ ] Badge component
  ```tsx
  <Badge variant="warning">
    ⏰ Eleições 2026
  </Badge>
  ```

**Entregáveis:**
- [x] 4 componentes funcionais
- [x] Storybook ou página /test com exemplos
- [x] Dark mode em todos

---

#### Dia 5: Header + Footer (8h)
- [ ] Header mobile-first
  - Logo
  - Hamburger menu (44x44px)
  - Dark mode toggle
  - Menu overlay mobile
  - Navigation desktop

- [ ] Footer básico
  - 3 colunas desktop, 1 mobile
  - Links principais
  - Email, WhatsApp

**Entregáveis:**
- [x] Header responsivo
- [x] Footer responsivo
- [x] Menu mobile funcionando

---

### SEMANA 2: HOMEPAGE (40h)

**Objetivo:** Landing page convertendo

#### Dia 1-2: Hero Section (16h)
- [ ] Hero component
  ```tsx
  <Hero
    badge="ELEIÇÕES 2026 • 463.367 CANDIDATOS"
    title="Inteligência e Compliance para Campanhas Políticas"
    subtitle="Plataforma SaaS de OSINT + APIs SERPRO..."
    ctaPrimary="Começar Verificação Grátis"
    ctaSecondary="Agendar Demo"
  />
  ```

- [ ] Personalization básica
  ```typescript
  const params = useSearchParams();
  const segment = params.get('segment');

  const content = {
    campanha: { title: "..." },
    partido: { title: "..." }
  };
  ```

- [ ] 2 CTAs (high + low commitment)
- [ ] Trust signals (✓ Sem cartão ✓ 24-48h)

**Entregáveis:**
- [x] Hero desktop + mobile
- [x] Personalization working
- [x] CTAs clickable

---

#### Dia 3: Social Proof + Problema (8h)
- [ ] Social Proof section
  ```tsx
  <SocialProof>
    <Stat number="5.950" label="Candidatos Verificados" />
    <Stat number="336" label="Consultorias Confiam" />
    <Stat number="85%" label="Precisão Red Flags" />
  </SocialProof>
  ```

- [ ] Problema section
  - 3 pain points (cards)
  - Lei Ficha Limpa obrigatória
  - 80% receita em 4 meses
  - Compliance TSE 72h

**Entregáveis:**
- [x] Stats animados (count-up simples)
- [x] Pain points visual

---

#### Dia 4: Solução + CTA Final (8h)
- [ ] Solução section
  - 1 card: Para Campanhas Políticas
  - Link: /solucoes/campanhas

- [ ] Compliance badges
  - 100% LGPD
  - APIs SERPRO
  - Conformidade TSE

- [ ] CTA Final
  - Reforço urgência
  - CTA: Agendar Demo
  - WhatsApp button

**Entregáveis:**
- [x] Homepage completa
- [x] Scroll suave

---

#### Dia 5: Polish + Performance (8h)
- [ ] Otimizar images
  - Converter para WebP
  - Next.js Image component
  - Lazy loading

- [ ] Performance check
  - Lighthouse audit
  - Fix LCP issues
  - Minify code

- [ ] Mobile test
  - iPhone SE (375px)
  - Touch targets >= 44px
  - Menu funciona

**Entregáveis:**
- [x] Lighthouse Performance 85+
- [x] LCP < 3.5s mobile
- [x] Mobile working

---

### SEMANA 3: SOLUÇÃO CAMPANHAS (40h)

**Objetivo:** Landing page principal público

#### Dia 1-2: Hero + Timeline (16h)
- [ ] Hero solução
  - Badge: Eleições 2026
  - Título: Soluções para Campanhas
  - CTA sticky mobile

- [ ] Timeline component
  ```tsx
  <Timeline>
    <TimelineItem
      date="MAR-JUL 2026"
      title="Vetting de Candidatos"
      description="Verificação Ficha Limpa..."
    />
  </Timeline>
  ```
  - Vertical mobile
  - Icons
  - Line connector

**Entregáveis:**
- [x] Hero + Timeline responsivos
- [x] CTA sticky mobile

---

#### Dia 3: Pricing Table (8h)
- [ ] PricingTable component
  ```tsx
  <PricingTable>
    <PricingTier
      name="Campanha Pequena"
      price="R$ 15.000 - R$ 50.000"
      features={[...]}
      cta="Solicitar Proposta"
    />
  </PricingTable>
  ```

- [ ] 3 tiers (Pequena, Média, Grande)
- [ ] Mobile: vertical stack
- [ ] Desktop: 3 colunas
- [ ] Featured tier destacado

**Entregáveis:**
- [x] Pricing table responsiva
- [x] Hover effects

---

#### Dia 4: Cases + Compliance (8h)
- [ ] Cases section
  - 2-3 casos curtos
  - Resultados mensuráveis
  - "Impugnação evitada..."

- [ ] Compliance section
  - Badges: Lei 9.504, LGPD, TSE
  - Ícones

**Entregáveis:**
- [x] Cases layout
- [x] Compliance badges

---

#### Dia 5: CTA Final + Polish (8h)
- [ ] CTA Final section
  - Urgência: Countdown Eleições
  - CTA: Começar Agora
  - Trust signals

- [ ] Performance
  - Lighthouse audit
  - Mobile test

**Entregáveis:**
- [x] Página completa
- [x] Performance 85+

---

### SEMANA 4: SERVIÇO + PRICING + CONTATO (40h)

**Objetivo:** Funnel completo

#### Dia 1-2: Serviço Vetting (16h)
- [ ] Hero serviço
  - Badge: Compliance Ficha Limpa
  - Título: Vetting de Candidatos

- [ ] O que verificamos
  - Accordion mobile (5-6 categorias)
  - Checkmarks: 27 TJs, TSE, etc.

- [ ] 3 Pacotes
  - Básico: R$ 500 - R$ 1.500
  - Padrão: R$ 2.000 - R$ 5.000
  - Premium: R$ 7.000 - R$ 15.000

- [ ] Como funciona (Timeline)
  - 4 steps: Upload → Processamento → Relatório → Download

**Entregáveis:**
- [x] Página serviço completa
- [x] Accordion funcionando

---

#### Dia 3: Página Preços (8h)
- [ ] /precos
  - Tab: Campanhas (só 1 no MVP)
  - Tabela detalhada
  - Serviços avulsos
  - FAQ inline (5 perguntas)

**Entregáveis:**
- [x] Pricing page completa

---

#### Dia 4-5: Página Contato (16h)
- [ ] Formulário
  ```tsx
  <Form>
    <Input name="nome" required />
    <Input name="email" type="email" required />
    <Input name="telefone" type="tel" />
    <Select name="publico">
      <option>Campanha</option>
      <option>Partido</option>
    </Select>
    <Textarea name="mensagem" />
    <Button type="submit">Enviar</Button>
  </Form>
  ```

- [ ] Validation (react-hook-form + zod)
- [ ] Success state
- [ ] WhatsApp button
- [ ] Email visible

- [ ] Integração básica
  - FormSubmit.co (grátis) ou
  - Netlify Forms ou
  - Email simples

**Entregáveis:**
- [x] Form funcionando
- [x] Validation working
- [x] Leads capturados

---

### SEMANA 5: DASHBOARD MVP (40h)

**Objetivo:** Dashboard básico com mock data

#### Dia 1-2: Layout Dashboard (16h)
- [ ] Dashboard layout
  ```tsx
  <DashboardLayout>
    <DashboardNav /> {/* Bottom nav mobile */}
    <Sidebar />      {/* Desktop */}
    <Main>{children}</Main>
  </DashboardLayout>
  ```

- [ ] Bottom navigation mobile
  - Home, Candidatos, Relatórios, Config
  - 56px height
  - Active state

- [ ] Sidebar desktop
  - Collapsible
  - Same links

- [ ] Overview page
  - 4 stats cards
  - Simple bar chart (vertical mobile)
  - Últimas verificações (3 cards)

**Entregáveis:**
- [x] Layout responsivo
- [x] Navigation working
- [x] Overview com mock data

---

#### Dia 3-4: Página Candidatos (16h)
- [ ] Upload section
  ```tsx
  <UploadForm>
    <Input name="cpf" mask="###.###.###-##" />
    <Input name="nome" />
    <Select name="cargo">Vereador, Prefeito</Select>
    <Button>Verificar</Button>
  </UploadForm>
  ```

- [ ] Lista candidatos
  - Mobile: Cards
    ```tsx
    <CandidateCard>
      <Avatar />
      <Name>João Silva</Name>
      <Status>✓ Aprovado</Status>
      <Actions>
        <Button size="sm">Ver Relatório</Button>
      </Actions>
    </CandidateCard>
    ```
  - Desktop: Tabela simples

- [ ] Filtros básicos
  - Status (Todos, Aprovado, Red Flag)
  - Cargo

- [ ] Mock verification
  - Loading state (2-3s)
  - Success message
  - Adiciona à lista

**Entregáveis:**
- [x] Upload working (mock)
- [x] Lista candidatos
- [x] Cards mobile, table desktop
- [x] Filtros funcionando

---

#### Dia 5: Relatório Mock (8h)
- [ ] Botão "Ver Relatório"
- [ ] Modal com relatório
  ```tsx
  <ReportModal>
    <Header>
      <Name>João Silva</Name>
      <Status>✓ Aprovado</Status>
    </Header>
    <Sections>
      <Section title="Antecedentes Criminais">
        ✓ Nenhum registro encontrado
      </Section>
      <Section title="Histórico TSE">
        ✓ Apto para candidatura
      </Section>
    </Sections>
    <DownloadButton>Download PDF</DownloadButton>
  </ReportModal>
  ```

- [ ] Download PDF (jsPDF - básico)

**Entregáveis:**
- [x] Relatório visual
- [x] Download working

---

### SEMANA 6: POLISH + LAUNCH (40h)

**Objetivo:** QA + Performance + Deploy

#### Dia 1-2: Performance Optimization (16h)
- [ ] Lighthouse audit TODAS páginas
  - Homepage: 85+
  - Campanhas: 85+
  - Vetting: 85+
  - Preços: 85+
  - Contato: 85+
  - Dashboard: 80+ (ok ser mais lento)

- [ ] Fix issues
  - LCP: Otimizar images, lazy load
  - CLS: Reserve space for images
  - FID/INP: Minimize JS

- [ ] Core Web Vitals
  - Test em 3G slow (Chrome DevTools)
  - LCP < 3.5s target

- [ ] Bundle size
  - Analyze bundle (next build --analyze)
  - Remove unused code
  - Dynamic imports

**Entregáveis:**
- [x] Lighthouse 85+ all pages
- [x] LCP < 3.5s mobile
- [x] Performance report

---

#### Dia 3: Accessibility + SEO (8h)
- [ ] Accessibility check
  - Contrast ratios (WebAIM Checker)
  - Keyboard navigation test
  - Alt texts all images
  - ARIA labels (forms, navigation)
  - Skip link

- [ ] SEO basics
  - Meta title/description (todas)
  - OpenGraph tags
  - Sitemap.xml (next-sitemap)
  - Robots.txt

**Entregáveis:**
- [x] Lighthouse Accessibility 90+
- [x] SEO 95+
- [x] Keyboard nav working

---

#### Dia 4: Mobile Testing (8h)
- [ ] Test em devices reais
  - iPhone SE (375px)
  - iPhone 14 (390px)
  - Samsung Galaxy (412px)

- [ ] Test scenarios
  | Scenario | iPhone SE | iPhone 14 | Galaxy |
  |----------|-----------|-----------|--------|
  | Abrir homepage | [ ] | [ ] | [ ] |
  | Toggle dark mode | [ ] | [ ] | [ ] |
  | Menu mobile | [ ] | [ ] | [ ] |
  | Form contato | [ ] | [ ] | [ ] |
  | Pricing table | [ ] | [ ] | [ ] |
  | Dashboard nav | [ ] | [ ] | [ ] |
  | Upload candidato | [ ] | [ ] | [ ] |

- [ ] Fix bugs encontrados
  - Scroll horizontal
  - Touch targets pequenos
  - Menu não fecha
  - Etc.

**Entregáveis:**
- [x] 3 devices testados
- [x] Bugs críticos fixados
- [x] Screenshots de aprovação

---

#### Dia 5: Deploy + Launch (8h)
- [ ] Deploy Vercel
  - Connect GitHub repo
  - Configure environment vars
  - Deploy production

- [ ] Domain setup
  - MVP: usar .vercel.app (grátis)
  - v2: custom domain

- [ ] Analytics
  - Google Analytics 4
  - Tag Manager
  - Events: CTA clicks, Form submits

- [ ] Error monitoring
  - Vercel Analytics (free tier)
  - Console errors check

- [ ] Launch checklist
  - [ ] All pages loading
  - [ ] Forms working
  - [ ] Dark mode working
  - [ ] Mobile working
  - [ ] No console errors
  - [ ] Analytics tracking
  - [ ] Contact form receiving

**Entregáveis:**
- [x] Site LIVE em production
- [x] Analytics working
- [x] No critical bugs

---

## 🎯 MVP SUCCESS CRITERIA

### Performance (Realista)

| Métrica | Target MVP | Método de Medição |
|---------|------------|-------------------|
| **Lighthouse Performance** | 85+ | Chrome DevTools |
| **Lighthouse Accessibility** | 90+ | Chrome DevTools |
| **Lighthouse SEO** | 95+ | Chrome DevTools |
| **LCP (Mobile 3G)** | < 3.5s | Chrome DevTools Throttling |
| **INP** | < 200ms | Lighthouse |
| **CLS** | < 0.1 | Lighthouse |
| **Page Weight** | < 1MB | DevTools Network |
| **Time to Interactive** | < 5s | Lighthouse |

**Método:**
1. Open Chrome DevTools
2. Lighthouse tab
3. Mobile simulation
4. Slow 3G throttling
5. Run audit
6. Score >= targets

---

### Functionality

- [ ] **Homepage:**
  - [ ] Carrega sem erros
  - [ ] Hero visible
  - [ ] CTAs clickable
  - [ ] Stats visible
  - [ ] Dark mode toggle funciona

- [ ] **Campanhas:**
  - [ ] Timeline visible mobile
  - [ ] Pricing table legível
  - [ ] Cases visible
  - [ ] CTA sticky mobile

- [ ] **Vetting:**
  - [ ] Accordion funciona
  - [ ] Pricing table clara
  - [ ] FAQ funciona

- [ ] **Preços:**
  - [ ] Tabela legível mobile
  - [ ] FAQ inline funciona

- [ ] **Contato:**
  - [ ] Form valida inputs
  - [ ] Envia com sucesso
  - [ ] Success message
  - [ ] WhatsApp link funciona

- [ ] **Dashboard:**
  - [ ] Navigation funciona (bottom nav mobile)
  - [ ] Stats cards visible
  - [ ] Chart loads
  - [ ] Upload form funciona
  - [ ] Lista candidatos visible
  - [ ] Filtros funcionam
  - [ ] Relatório modal abre
  - [ ] Download PDF funciona

---

### UX/Usability

- [ ] **Mobile-First:**
  - [ ] Funciona em 375px (iPhone SE)
  - [ ] Sem scroll horizontal
  - [ ] Touch targets >= 44px (TODOS)
  - [ ] Menu mobile abre/fecha
  - [ ] Bottom nav visível

- [ ] **Dark Mode:**
  - [ ] Toggle funciona
  - [ ] Transitions suaves (300ms)
  - [ ] Contrast readable (both modes)
  - [ ] Persiste ao reload (localStorage)

- [ ] **Forms:**
  - [ ] Labels sempre visíveis
  - [ ] Validation messages claras
  - [ ] Error states visuais
  - [ ] Success feedback

- [ ] **Navigation:**
  - [ ] Header sticky desktop
  - [ ] Footer sempre acessível
  - [ ] Breadcrumbs (onde aplicável)
  - [ ] Back button funciona

---

### Business/Conversion

- [ ] **Value Proposition:**
  - [ ] Clara em 5s (homepage)
  - [ ] Diferencial visível
  - [ ] Benefícios listados

- [ ] **CTAs:**
  - [ ] 2 CTAs no hero (high + low)
  - [ ] CTAs sticky mobile (onde aplicável)
  - [ ] WhatsApp integrado
  - [ ] Form contato funciona

- [ ] **Social Proof:**
  - [ ] Stats visible above fold
  - [ ] Trust badges (LGPD, TSE)
  - [ ] Cases de sucesso

- [ ] **Pricing:**
  - [ ] Transparente
  - [ ] Comparação clara (3 tiers)
  - [ ] CTA em cada tier

- [ ] **Lead Capture:**
  - [ ] Form contato working
  - [ ] Email visible
  - [ ] WhatsApp working
  - [ ] Leads chegando

---

## 📊 MVP vs FULL PLAN - COMPARISON

### Scope Reduction

| Item | MVP | Full Plan | Redução |
|------|-----|-----------|---------|
| **Páginas** | 7 | 50+ | **86% ↓** |
| **Tarefas** | 40 | 105 | **62% ↓** |
| **Timeline** | 6 semanas | 12 semanas | **50% ↓** |
| **Horas** | 240h | 600h | **60% ↓** |
| **Features Premium** | 0 | 8 | **100% ↓** |

---

### Feature Comparison

| Feature | MVP | Full Plan |
|---------|-----|-----------|
| **Design System** | Básico | Premium (glassmorphism, kinetic) |
| **Dark Mode** | Manual toggle | Auto system + per-page |
| **Mobile-First** | 375px base | 375px + gestures + haptic |
| **Performance** | LCP < 3.5s, 85+ | LCP < 2.0s, 95+ |
| **Micro-interactions** | Hover, loading | Magnetic, 3D tilt, smart loaders |
| **AI Personalization** | URL param | Real-time, recommendations |
| **Accessibility** | 90+ | 100 (WCAG AA+ certified) |
| **3D Elements** | Não | React Three Fiber |
| **Kinetic Typography** | Não | Sim |
| **Awards Submission** | Não | Awwwards, CSS DA, Webby |

---

### Investment Comparison

| Item | MVP | Full Plan |
|------|-----|-----------|
| **Timeline** | 6 semanas | 12 semanas |
| **Team** | 1-2 pessoas | 1-3 pessoas |
| **Horas** | 240h | 600h |
| **Custo Ferramentas** | ~R$ 0-200/mês | ~R$ 500/mês |
| **Custo Submissions** | R$ 0 | R$ 3.200 |
| **Total Investimento** | R$ 200-400 | R$ 4.000+ |

---

### ROI Comparison

| Métrica | MVP | Full Plan |
|---------|-----|-----------|
| **Time to Market** | 6 semanas | 12 semanas |
| **Validação Mercado** | Sim ✅ | Depois ⏰ |
| **Lead Generation** | 10-20 em 3 meses | 40+ em 3 meses |
| **Conversion Rate** | 5-10% (básico) | 15%+ (otimizado) |
| **Brand Value** | Médio | Alto (se ganhar awards) |
| **Risk** | Baixo (valida antes) | Alto (investe tudo) |

---

## 🚀 ROADMAP PÓS-MVP

### Quando Expandir para V2?

**Critérios de Validação MVP:**

| Métrica | Target 3 Meses | Validado? |
|---------|----------------|-----------|
| **Leads Qualificados** | 15+ | [ ] |
| **Demos Agendadas** | 5+ | [ ] |
| **Propostas Enviadas** | 3+ | [ ] |
| **Clientes Fechados** | 1+ | [ ] |
| **Receita** | R$ 15K+ | [ ] |
| **Feedback Positivo** | 80%+ | [ ] |

**Se >= 4 critérios validados:** GO para V2
**Se < 4 critérios:** Pivotar ou iterar MVP

---

### V1.5 (Semanas 7-9) - SE VALIDAR

**Adicionar:**
- [ ] 3 outras soluções (Partidos, Consultorias, Lobbying)
- [ ] 3 outros serviços (Triagem, Pesquisa, Due Diligence)
- [ ] 1 recurso (Guia Ficha Limpa)
- [ ] Dashboard: 5 páginas adicionais
- [ ] Analytics avançado (Hotjar)

**Objetivo:** Expandir públicos

**Timeline:** +3 semanas
**Investimento:** +120h

---

### V2.0 (Semanas 10-14) - AWARD-WINNING

**Features Premium:**
- [ ] Kinetic typography
- [ ] Glassmorphism avançado
- [ ] 3D elements (React Three Fiber)
- [ ] Micro-interactions complexas
- [ ] AI personalization real
- [ ] Performance: LCP < 2.0s
- [ ] Lighthouse 95+ todas métricas

**Objetivo:** Submeter para prêmios

**Timeline:** +4 semanas
**Investimento:** +160h + R$ 3.200 (submissions)

**Submission:**
- [ ] Awwwards Site of the Day
- [ ] CSS Design Awards
- [ ] Webby Awards

---

### V3.0 (Meses 4-6) - SCALE

**Features:**
- [ ] API real SERPRO
- [ ] Database (PostgreSQL)
- [ ] Auth real (NextAuth)
- [ ] Dashboard completo (24 páginas)
- [ ] White-label
- [ ] Multi-tenancy
- [ ] API pública
- [ ] Mobile app (React Native)

**Objetivo:** Scale para 100+ clientes

**Timeline:** +8 semanas
**Investimento:** +320h + infraestrutura

---

## 💰 MVP INVESTMENT BREAKDOWN

### Time Investment

| Semana | Foco | Horas |
|--------|------|-------|
| 1 | Fundação | 40h |
| 2 | Homepage | 40h |
| 3 | Campanhas | 40h |
| 4 | Serviço + Preços + Contato | 40h |
| 5 | Dashboard | 40h |
| 6 | Polish + Launch | 40h |
| **TOTAL** | **6 semanas** | **240h** |

**Com 1 pessoa full-time (40h/semana):** 6 semanas
**Com 1 pessoa part-time (20h/semana):** 12 semanas
**Com 2 pessoas (80h/semana):** 3 semanas

---

### Financial Investment

**Ferramentas (Mensal):**
- Vercel Hobby: R$ 0 (free tier)
- Analytics: R$ 0 (GA4 free)
- Forms: R$ 0 (FormSubmit.co ou Netlify)
- Fonts: R$ 0 (Google Fonts / Inter)
- Icons: R$ 0 (Lucide React)
- **Total:** R$ 0/mês no MVP

**One-time:**
- Nenhum (sem submissions no MVP)

**Total Investimento MVP:** R$ 0-200 (opcional: Vercel Pro R$ 100/mês)

---

### ROI Expected (3 meses pós-launch)

**Cenário Conservador:**
- Leads: 15 qualificados
- Demos: 5 agendadas
- Propostas: 3 enviadas
- Fechamentos: 1 cliente (R$ 50K)
- **ROI:** 250x (R$ 50K / R$ 200)

**Cenário Otimista:**
- Leads: 30 qualificados
- Demos: 10 agendadas
- Propostas: 6 enviadas
- Fechamentos: 2 clientes (R$ 150K)
- **ROI:** 750x (R$ 150K / R$ 200)

**Intangível:**
- Market validation: PRICELESS
- Product-market fit learning
- Customer feedback
- Brand awareness

---

## 🎯 DECISION FRAMEWORK

### Quando Adicionar Features?

**Pergunta para CADA feature:**

1. **É essencial para validar hipótese?**
   - Sim → Incluir no MVP
   - Não → V2

2. **Cliente paga por isso especificamente?**
   - Sim → Incluir
   - Não → V2

3. **Sem isso, o produto não funciona?**
   - Sim → Incluir
   - Não → V2

4. **Aumenta conversão >10%?**
   - Sim → Considerar
   - Não → V2

**Exemplos:**

| Feature | Essencial? | Cliente Paga? | Não Funciona Sem? | +10% Conversão? | MVP? |
|---------|------------|---------------|-------------------|-----------------|------|
| Homepage | ✅ | - | ✅ | ✅ | **SIM** |
| Dark Mode | ❌ | ❌ | ❌ | ✅ | **SIM** (diferencial) |
| Vetting Dashboard | ✅ | ✅ | ✅ | - | **SIM** |
| 3D Elements | ❌ | ❌ | ❌ | ❌ | **NÃO** |
| Kinetic Typography | ❌ | ❌ | ❌ | ❌ | **NÃO** |
| AI Personalization Full | ❌ | ❌ | ❌ | ⚠️ (maybe) | **NÃO** (v2) |
| Guia Ficha Limpa | ❌ | ❌ | ❌ | ⚠️ (maybe) | **NÃO** (v1.5) |

---

## ✅ APPROVAL CHECKLIST

### Antes de Começar

- [ ] **Scope aprovado:** 7 páginas, não 50+
- [ ] **Timeline realista:** 6 semanas
- [ ] **Recursos alocados:** 1-2 pessoas, 240h
- [ ] **Features premium:** Deixar para v2 (confirmado)
- [ ] **Métricas de sucesso:** Definidas (15+ leads, 1+ cliente)
- [ ] **Plan B:** Se não validar, pivotar ou parar
- [ ] **Stakeholders alinhados:** Todos sabem que é MVP, não produto final

### Durante Execução

- [ ] **Não adicionar features** durante MVP
- [ ] **Não perfecionismo:** 80% é suficiente para MVP
- [ ] **Testar cedo:** Devices reais desde semana 2
- [ ] **User feedback:** Mostrar para 3-5 pessoas semana 4
- [ ] **Performance check:** Lighthouse toda sexta-feira

### Pós-Launch

- [ ] **Monitor analytics:** Diariamente primeira semana
- [ ] **Capturar feedback:** Todos os leads
- [ ] **Bugs críticos:** Fixar em 24h
- [ ] **Decisão V2:** Após 3 meses, baseado em dados

---

## 🚨 RED FLAGS - QUANDO PARAR

### Durante MVP

**PARE se:**
- Semana 4 e nenhuma página funciona
- Lighthouse < 70 e não consegue melhorar
- Mobile completamente quebrado
- Não consegue implementar dark mode
- Team burnout severo

**Pivot se:**
- Feedback negativo unânime (5+ pessoas)
- Mercado não existe (research estava errado)
- Competitors lançam produto idêntico gratuito

### Pós-MVP (3 meses)

**PARE se:**
- 0 leads qualificados
- 0 demos agendadas
- 100% feedback negativo
- Custo aquisição > valor vitalício

**Pivot se:**
- Leads, mas público errado (ex: corporativo, não político)
- Interesse, mas preço errado
- Produto ok, mas canal errado (não é online)

---

## 📚 DOCUMENTOS REFERÊNCIA

### Usar Durante MVP

1. **Este documento** - Scope e timeline
2. **AWARD_WINNING_MASTER_PLAN_2026.md** - Design system (seção 1)
3. **MOBILE_FIRST_CHECKLIST.md** - Guidelines mobile
4. **PLANEJAMENTO_REPOSICIONAMENTO_POLITICO.md** - Copy e mensagens

### Não Usar Durante MVP

- ❌ TODO_AWARD_WINNING_FINAL.md (105 tarefas - muito!)
- ❌ TODO_REPOSICIONAMENTO_POLITICO.md (38 tarefas - ainda muito)

### Criar Novo

- [ ] **TODO_MVP_6_SEMANAS.md** - 40 tarefas específicas MVP (criar agora)

---

## 🎉 CONCLUSÃO

### MVP Definido

- ✅ **7 páginas** (não 50+)
- ✅ **40 tarefas** (não 105)
- ✅ **6 semanas** (não 12)
- ✅ **240 horas** (não 600)
- ✅ **R$ 0-200** investimento (não R$ 4K+)

### Filosofia MVP

> **"Perfect is the enemy of good"**
>
> Melhor ter 7 páginas excelentes funcionando em 6 semanas
> do que 50 páginas medianas em 12 semanas.

### Próximo Passo

**Criar:** `TODO_MVP_6_SEMANAS.md` com 40 tarefas detalhadas

**Começar:** Semana 1, Dia 1 - Setup projeto

---

**DOCUMENTO:** MVP Definição Completa
**DATA:** 17/01/2026
**VERSÃO:** 1.0 Final
**STATUS:** ✅ APROVADO
**PRÓXIMO:** TODO_MVP_6_SEMANAS.md
