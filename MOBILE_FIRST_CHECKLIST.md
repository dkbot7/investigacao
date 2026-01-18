# 📱 MOBILE FIRST CHECKLIST - REPOSICIONAMENTO POLÍTICO

**Princípio:** Projetar PRIMEIRO para mobile, depois expandir para desktop
**Target:** 70%+ do tráfego político vem de mobile durante campanhas

---

## 🎯 FILOSOFIA MOBILE FIRST

### Por que Mobile First é CRÍTICO para Político?

1. **Assessores de campanha trabalham em movimento** (comícios, eventos, rua)
2. **Candidatos checam informações no celular** durante debates/entrevistas
3. **Doadores fazem contribuições pelo celular** (PIX, cartão)
4. **Picos de acesso durante eventos políticos** (debates transmitidos → celular)
5. **Interior do Brasil = mobile > desktop** (público de campanhas municipais)

**Estatística:** Em campanhas 2024, 68% dos acessos a sites políticos foram mobile.

---

## ✅ REGRAS FUNDAMENTAIS PARA CADA PÁGINA

### 1. DESIGN MOBILE FIRST
- [ ] Wireframe feito PRIMEIRO para 375px (iPhone SE)
- [ ] Depois adaptar para 768px (tablet)
- [ ] Por último, expandir para 1280px+ (desktop)

### 2. CSS MOBILE FIRST
```css
/* ✅ CORRETO: Mobile first (min-width) */
.hero {
  font-size: 24px; /* mobile */
}
@media (min-width: 768px) {
  .hero { font-size: 32px; } /* tablet */
}
@media (min-width: 1280px) {
  .hero { font-size: 48px; } /* desktop */
}

/* ❌ ERRADO: Desktop first (max-width) */
.hero {
  font-size: 48px; /* desktop */
}
@media (max-width: 1280px) {
  .hero { font-size: 32px; }
}
```

### 3. PERFORMANCE MOBILE FIRST
- [ ] Imagens: WebP/AVIF com fallback
- [ ] Lazy loading em TUDO (imagens, vídeos, iframes)
- [ ] Fonts: Subset para português (não carregar alfabeto inteiro)
- [ ] JavaScript: Code splitting por rota
- [ ] Target: < 3s em 3G (conexões rurais)

### 4. UX MOBILE FIRST
- [ ] Touch targets: mínimo 44x44px (Apple HIG)
- [ ] Espaçamento entre links: mínimo 8px
- [ ] CTAs: Bottom sticky ou thumb-friendly zone
- [ ] Formulários: Input types corretos (tel, email, number)
- [ ] Scroll infinito > Paginação

---

## 📋 CHECKLIST POR COMPONENTE

### 🏗️ HEADER MOBILE FIRST

- [ ] **Mobile (375px-767px):**
  - [ ] Logo: 120px largura (legível)
  - [ ] Hamburger menu (não dropdowns)
  - [ ] CTA principal: sticky bottom ou floating button
  - [ ] Sem hover states (não funciona em touch)
  - [ ] Menu full-screen overlay com scroll

- [ ] **Tablet (768px-1023px):**
  - [ ] Logo: 150px
  - [ ] Menu híbrido (alguns itens visíveis, resto em menu)
  - [ ] Dropdowns com touch (não hover)

- [ ] **Desktop (1024px+):**
  - [ ] Menu completo horizontal
  - [ ] Dropdowns com hover + click

- [ ] **Testes:**
  - [ ] Thumb zone: Logo e menu acessíveis com polegar
  - [ ] Menu fecha ao clicar fora (mobile)
  - [ ] Transições suaves < 300ms

---

### 🏠 HOMEPAGE MOBILE FIRST

#### Hero Section

- [ ] **Mobile:**
  - [ ] Título: 28px (max 40 caracteres)
  - [ ] Subtítulo: 16px (max 80 caracteres, 2 linhas)
  - [ ] Badge: 12px, top da tela
  - [ ] CTA: Full-width button 56px altura
  - [ ] Imagem: Retrato (vertical), carrega lazy
  - [ ] Sem vídeo de fundo (economizar dados)

- [ ] **Desktop:**
  - [ ] Título: 56px
  - [ ] Layout lado a lado (texto + imagem)
  - [ ] Vídeo de fundo permitido

#### Grid de Soluções (4 cards)

- [ ] **Mobile (375px):**
  - [ ] 1 coluna (vertical stack)
  - [ ] Card: altura auto, padding 24px
  - [ ] Ícone: 48px
  - [ ] Título: 20px
  - [ ] Descrição: 14px (max 2 linhas)
  - [ ] CTA: Full-width button

- [ ] **Tablet (768px):**
  - [ ] 2 colunas (2x2 grid)

- [ ] **Desktop (1280px):**
  - [ ] 4 colunas (1x4 grid)

#### Grid de Serviços (6 cards)

- [ ] **Mobile:**
  - [ ] 1 coluna
  - [ ] Scroll horizontal alternativo (swipe)
  - [ ] Indicadores de página (dots)

- [ ] **Tablet:**
  - [ ] 2 colunas (3x2)

- [ ] **Desktop:**
  - [ ] 3 colunas (2x3)

#### Social Proof

- [ ] **Mobile:**
  - [ ] Stats: 1 por linha (vertical)
  - [ ] Número: 32px
  - [ ] Label: 14px
  - [ ] Logos: Carrossel horizontal (swipe)

- [ ] **Desktop:**
  - [ ] Stats: 4 em linha (horizontal)

---

### 📄 PÁGINAS DE SOLUÇÕES MOBILE FIRST

#### /solucoes/campanhas, /partidos, etc.

- [ ] **Hero Mobile:**
  - [ ] Badge: sticky top
  - [ ] Título: 32px (max 50 caracteres)
  - [ ] Subtítulo: 16px (max 100 caracteres)
  - [ ] CTA: Sticky bottom (sempre visível)

- [ ] **Cronograma (Timeline):**
  - [ ] Mobile: Vertical (de cima para baixo)
  - [ ] Desktop: Horizontal (esquerda para direita)

- [ ] **Tabela de Preços (3 colunas):**
  - [ ] Mobile: 1 coluna por vez (swipe horizontal) com indicadores
  - [ ] Tablet: 2 colunas visíveis
  - [ ] Desktop: 3 colunas

- [ ] **Casos de Sucesso:**
  - [ ] Mobile: Accordion (1 aberto por vez)
  - [ ] Desktop: Grid 3 colunas expandido

---

### 🛠️ PÁGINAS DE SERVIÇOS MOBILE FIRST

#### /servicos/vetting-candidatos, etc.

- [ ] **Pacotes (3 níveis):**
  - [ ] Mobile: Vertical stack com card destacado
  - [ ] Desktop: 3 colunas lado a lado

- [ ] **O que verificamos (lista):**
  - [ ] Mobile: Accordion por categoria
  - [ ] Desktop: Grid 2 colunas

- [ ] **Processo (timeline):**
  - [ ] Mobile: Vertical com ícones
  - [ ] Desktop: Horizontal

---

### 📚 PÁGINAS DE RECURSOS MOBILE FIRST

#### /recursos/ficha-limpa, /compliance-tse, etc.

- [ ] **Navegação interna:**
  - [ ] Mobile: Sticky TOC (table of contents) no topo
  - [ ] Desktop: TOC sidebar fixo à esquerda

- [ ] **Conteúdo:**
  - [ ] Mobile: Sem sidebar (conteúdo full-width)
  - [ ] Desktop: Sidebar + conteúdo

- [ ] **Tipografia:**
  - [ ] Mobile: 16px body (legibilidade)
  - [ ] Desktop: 18px body

- [ ] **Download PDF:**
  - [ ] Mobile: Sticky bottom button
  - [ ] Desktop: Sidebar CTA

---

### 📊 DASHBOARD MOBILE FIRST

- [ ] **Navegação:**
  - [ ] Mobile: Bottom navigation (tab bar)
  - [ ] Desktop: Sidebar esquerda

- [ ] **Tabelas:**
  - [ ] Mobile: Cards (não tabelas) com dados empilhados
  - [ ] Tablet: Tabelas horizontais scrolláveis
  - [ ] Desktop: Tabelas completas

- [ ] **Filtros:**
  - [ ] Mobile: Modal full-screen
  - [ ] Desktop: Sidebar ou dropdown

- [ ] **Charts:**
  - [ ] Mobile: Gráficos verticais (bar charts)
  - [ ] Desktop: Gráficos horizontais permitidos

- [ ] **Ações em massa:**
  - [ ] Mobile: Floating action button (FAB)
  - [ ] Desktop: Toolbar top

---

## 🎨 DESIGN TOKENS MOBILE FIRST

### Breakpoints (min-width)
```javascript
const breakpoints = {
  xs: '375px',   // iPhone SE (base mobile)
  sm: '640px',   // Phones large
  md: '768px',   // Tablets
  lg: '1024px',  // Desktop small
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Desktop large
}
```

### Spacing (Mobile friendly)
```javascript
const spacing = {
  xs: '4px',   // Micro espaçamento
  sm: '8px',   // Entre elementos próximos
  md: '16px',  // Padding padrão mobile
  lg: '24px',  // Seções mobile
  xl: '32px',  // Entre seções mobile
  '2xl': '48px', // Entre seções desktop
}
```

### Typography (Escala fluida)
```css
/* Mobile base */
body { font-size: 16px; }
h1 { font-size: 28px; }
h2 { font-size: 24px; }
h3 { font-size: 20px; }

/* Desktop (clamp para fluido) */
h1 { font-size: clamp(28px, 5vw, 56px); }
h2 { font-size: clamp(24px, 4vw, 40px); }
h3 { font-size: clamp(20px, 3vw, 32px); }
```

### Touch Targets
```javascript
const touchTargets = {
  minimum: '44px',    // Apple HIG
  comfortable: '48px', // Material Design
  spacious: '56px',   // CTAs importantes
}
```

---

## ⚡ PERFORMANCE MOBILE FIRST

### Imagens

- [ ] **Formatos modernos:**
  ```html
  <picture>
    <source srcset="hero-mobile.avif" type="image/avif" media="(max-width: 767px)">
    <source srcset="hero-mobile.webp" type="image/webp" media="(max-width: 767px)">
    <source srcset="hero-desktop.avif" type="image/avif" media="(min-width: 768px)">
    <source srcset="hero-desktop.webp" type="image/webp" media="(min-width: 768px)">
    <img src="hero-mobile.jpg" alt="..." loading="lazy">
  </picture>
  ```

- [ ] **Tamanhos responsivos:**
  - Mobile: 375px width (1x), 750px (2x para retina)
  - Tablet: 768px
  - Desktop: 1280px

- [ ] **Lazy loading:**
  - Hero: loading="eager"
  - Resto: loading="lazy"

### Fonts

- [ ] **Subset para português:**
  ```css
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-subset-pt.woff2') format('woff2');
    unicode-range: U+0020-007F, U+00A0-00FF, U+2000-206F;
    font-display: swap;
  }
  ```

- [ ] **Preload fonts críticos:**
  ```html
  <link rel="preload" href="/fonts/inter-subset-pt.woff2" as="font" crossorigin>
  ```

### JavaScript

- [ ] **Code splitting por rota:**
  ```javascript
  // Next.js dynamic import
  const Dashboard = dynamic(() => import('./Dashboard'), {
    loading: () => <LoadingSkeleton />,
    ssr: false // Dashboard não precisa SSR
  })
  ```

- [ ] **Lazy load componentes pesados:**
  - Mapas (Google Maps)
  - Charts (Recharts)
  - Rich text editors

### Network

- [ ] **Priorização de recursos:**
  ```html
  <!-- Crítico -->
  <link rel="preload" as="style" href="critical.css">
  <link rel="preload" as="script" href="critical.js">

  <!-- Importante mas não crítico -->
  <link rel="preconnect" href="https://fonts.googleapis.com">

  <!-- Lazy -->
  <link rel="prefetch" href="/dashboard">
  ```

---

## 🧪 TESTES MOBILE FIRST

### Dispositivos Reais (Prioridade)

- [ ] **iPhone SE (375px)** - Menor tela comum
- [ ] **iPhone 12/13/14 (390px)** - Mais vendido Brasil
- [ ] **Samsung Galaxy A (412px)** - Android popular Brasil
- [ ] **iPad (768px)** - Tablet
- [ ] **Desktop 1280px** - Desktop padrão

### Emuladores (Chrome DevTools)

- [ ] Mobile: 375px, 390px, 412px
- [ ] Tablet: 768px, 1024px
- [ ] Desktop: 1280px, 1920px

### Conexão

- [ ] **3G Slow (750 Kbps)** - Interior do Brasil
- [ ] **4G (4 Mbps)** - Cidades médias
- [ ] **Fiber** - Capitais

### Orientação

- [ ] Portrait (vertical) - Prioridade 1
- [ ] Landscape (horizontal) - Prioridade 2

---

## 📱 CHECKLIST POR FASE (INTEGRAÇÃO COM TODO)

### FASE 1: Fundação

#### Tarefa 1.1: Atualizar Header
- [ ] ✅ Wireframe mobile first (375px)
- [ ] ✅ Hamburger menu mobile
- [ ] ✅ Menu overlay full-screen
- [ ] ✅ Touch targets 44px+
- [ ] ✅ Sticky no scroll (mobile)
- [ ] ✅ Testar em iPhone SE real

#### Tarefa 1.4: Reescrever Homepage
- [ ] ✅ Hero mobile first (vertical)
- [ ] ✅ Grid 1 coluna mobile
- [ ] ✅ CTAs sticky bottom
- [ ] ✅ Imagens otimizadas mobile
- [ ] ✅ Performance < 3s em 3G
- [ ] ✅ Testar em dispositivos reais

### FASE 2: Soluções

#### Cada página de solução
- [ ] ✅ Tabela de preços: swipe mobile
- [ ] ✅ Timeline vertical mobile
- [ ] ✅ Cards vertical stack mobile
- [ ] ✅ Sticky CTA bottom

### FASE 3: Serviços

#### Cada página de serviço
- [ ] ✅ Processo vertical mobile
- [ ] ✅ Pacotes 1 coluna mobile
- [ ] ✅ Forms mobile-friendly

### FASE 4: Recursos

#### Guias e recursos
- [ ] ✅ TOC sticky top mobile
- [ ] ✅ Sem sidebar mobile
- [ ] ✅ Typography 16px+ mobile

### FASE 6: Dashboard

- [ ] ✅ Bottom navigation mobile
- [ ] ✅ Cards ao invés de tabelas
- [ ] ✅ Filtros modal full-screen
- [ ] ✅ Charts verticais mobile

---

## 🎯 MÉTRICAS MOBILE FIRST

### Performance

- [ ] **Mobile (3G):**
  - [ ] LCP < 3s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
  - [ ] PageSpeed Mobile > 85

- [ ] **Mobile (4G):**
  - [ ] LCP < 2s
  - [ ] PageSpeed Mobile > 90

### Usabilidade

- [ ] **Touch targets:**
  - [ ] 100% dos links/botões > 44x44px
  - [ ] Espaçamento entre links > 8px

- [ ] **Formulários:**
  - [ ] Inputs com labels sempre visíveis
  - [ ] Input types corretos (tel, email)
  - [ ] Autocomplete ativado
  - [ ] Erros inline (abaixo do campo)

### Acessibilidade Mobile

- [ ] **Screen readers:**
  - [ ] VoiceOver (iOS) funcionando
  - [ ] TalkBack (Android) funcionando

- [ ] **Zoom:**
  - [ ] Permite zoom até 200%
  - [ ] Sem scroll horizontal em zoom

---

## 🚀 QUICK WINS MOBILE FIRST

### Implementar ANTES de qualquer página:

1. [ ] **Configurar breakpoints mobile-first no Tailwind/CSS**
   ```javascript
   // tailwind.config.js
   theme: {
     screens: {
       'sm': '640px',  // min-width
       'md': '768px',
       'lg': '1024px',
       'xl': '1280px',
     }
   }
   ```

2. [ ] **Criar componentes base mobile-first:**
   - [ ] Button (44px altura mínima)
   - [ ] Card (padding responsivo)
   - [ ] Container (max-width fluido)
   - [ ] Grid (1 col mobile → múltiplas desktop)

3. [ ] **Configurar next.config.js para imagens:**
   ```javascript
   images: {
     formats: ['image/avif', 'image/webp'],
     deviceSizes: [375, 640, 768, 1024, 1280],
   }
   ```

4. [ ] **Criar layout mobile-first base:**
   - [ ] Header mobile
   - [ ] Footer mobile
   - [ ] Container fluido

---

## ✅ CRITÉRIO DE ACEITAÇÃO MOBILE FIRST

### Cada página SÓ vai para produção se:

- [ ] ✅ Funciona perfeitamente em 375px
- [ ] ✅ Touch targets >= 44px
- [ ] ✅ LCP < 3s em 3G
- [ ] ✅ Sem scroll horizontal
- [ ] ✅ Texto legível (16px+) sem zoom
- [ ] ✅ CTAs acessíveis com polegar
- [ ] ✅ Testada em iPhone e Android real

---

## 📞 DÚVIDAS MOBILE FIRST?

**Regra de ouro:** Se você não testou no celular, não funciona no celular.

**Teste rápido:** Deixe o desktop de lado por 1 dia e navegue TUDO só pelo celular.

---

**DOCUMENTO CRIADO EM:** 17/01/2026
**VERSÃO:** 1.0 Mobile First
