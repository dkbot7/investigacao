# 📱 INTEGRAÇÃO MOBILE FIRST NO TODO

**ATENÇÃO:** Este documento complementa o `TODO_REPOSICIONAMENTO_POLITICO.md`

Adicione estas verificações mobile-first em **CADA TAREFA** antes de marcar como completa.

---

## 🎯 REGRA DE OURO

**NENHUMA tarefa está completa sem:**
- [ ] ✅ Funcionar em 375px (iPhone SE)
- [ ] ✅ Touch targets >= 44px
- [ ] ✅ Testado em dispositivo real

---

## 📋 MOBILE FIRST POR FASE

### FASE 1: FUNDAÇÃO

#### ✅ TAREFA 1.1: Atualizar Header

**ADICIONAR ao checklist original:**

**Mobile First (375px-767px):**
- [ ] Wireframe mobile desenhado PRIMEIRO
- [ ] Logo: 120px largura (legível, não cortado)
- [ ] Hamburger menu 44x44px (touch-friendly)
- [ ] Menu overlay full-screen com scroll
- [ ] Sem dropdowns (accordion no menu mobile)
- [ ] CTA "Contato": sticky bottom ou floating button
- [ ] Transição menu: < 300ms
- [ ] Thumb zone: Logo e menu acessíveis com polegar direito
- [ ] Sem hover states (usar :active para feedback)

**Tablet (768px-1023px):**
- [ ] Logo: 150px
- [ ] Menu híbrido (alguns itens visíveis, resto em menu)
- [ ] Dropdowns funcionam com touch (não só hover)

**Desktop (1024px+):**
- [ ] Menu horizontal completo
- [ ] Dropdowns com hover + fallback click

**Performance Mobile:**
- [ ] Logo: WebP/AVIF com fallback
- [ ] Sem JavaScript no hero (só CSS)
- [ ] Header < 50KB total

**Testes Obrigatórios:**
- [ ] iPhone SE real (375px)
- [ ] iPhone 14 (390px)
- [ ] Samsung Galaxy A (412px)
- [ ] iPad (768px)

---

#### ✅ TAREFA 1.2: Atualizar Footer

**ADICIONAR ao checklist original:**

**Mobile First (375px):**
- [ ] Layout vertical (1 coluna)
- [ ] Seções com accordion (se muito conteúdo)
- [ ] Links: 44px altura mínima
- [ ] Espaçamento entre links: 8px
- [ ] Logo footer: 100px largura
- [ ] Texto legal: 12px (ainda legível)

**Tablet (768px):**
- [ ] 2 colunas

**Desktop (1280px):**
- [ ] 4-5 colunas

**Performance:**
- [ ] Footer lazy load (só carrega quando visível)

---

#### ✅ TAREFA 1.3: Criar Página Hub /solucoes

**ADICIONAR ao checklist original:**

**Mobile First (375px):**
- [ ] Hero: vertical (badge top, título, subtítulo, CTA)
- [ ] Título: 32px (max 50 caracteres, 2 linhas)
- [ ] Subtítulo: 16px
- [ ] CTA: full-width button 56px altura
- [ ] Grid de 4 cards: 1 coluna (vertical stack)
- [ ] Card: padding 24px, altura auto
- [ ] Ícone card: 48px
- [ ] Título card: 20px
- [ ] CTA card: full-width button
- [ ] Espaçamento entre cards: 16px

**Tablet (768px):**
- [ ] Grid: 2x2 (2 colunas)

**Desktop (1280px):**
- [ ] Grid: 1x4 (4 colunas)

**Imagens:**
- [ ] Mobile: 375w.webp (1x), 750w.webp (2x)
- [ ] Desktop: 1280w.webp
- [ ] Lazy loading: sim

**Performance Mobile:**
- [ ] LCP < 3s (3G)
- [ ] Total page < 500KB

---

#### ✅ TAREFA 1.4: Reescrever Homepage

**ADICIONAR ao checklist original:**

**Hero Mobile First (375px):**
- [ ] Layout vertical (imagem opcional no mobile)
- [ ] Badge: 12px, sticky top ou inline
- [ ] Título: 28px (max 40 caracteres, 2 linhas)
- [ ] Subtítulo: 16px (max 80 caracteres, 3 linhas)
- [ ] CTA Principal: full-width 56px "Começar Verificação"
- [ ] CTA Secundário: outline button 48px "Ver Demo"
- [ ] Espaçamento CTAs: 12px
- [ ] SEM vídeo de fundo (economizar dados)
- [ ] Imagem hero: retrato vertical (se usar)

**Seção Problema + Urgência Mobile:**
- [ ] Stats: 1 por linha (vertical)
- [ ] Número stat: 32px bold
- [ ] Label stat: 14px
- [ ] Ícone stat: 40px

**Grid Soluções (4 cards) Mobile:**
- [ ] 1 coluna (vertical stack)
- [ ] Alternativa: Scroll horizontal (swipe) com dots
- [ ] Card: full-width, padding 20px
- [ ] Height: auto (não fixo)

**Grid Serviços (6 cards) Mobile:**
- [ ] Opção 1: Carrossel horizontal (swipe) com dots
- [ ] Opção 2: 1 coluna com "Ver Mais" toggle
- [ ] Card: 320px largura (se carrossel)

**Social Proof Mobile:**
- [ ] Stats: vertical stack
- [ ] Logos: carrossel horizontal (swipe)
- [ ] Depoimentos: 1 por vez com dots

**Compliance Badges Mobile:**
- [ ] 2x2 grid (2 colunas)
- [ ] Badge: 150px largura
- [ ] Stack vertical em telas muito pequenas (<360px)

**Countdown Timer Mobile:**
- [ ] Layout vertical (números empilhados)
- [ ] Números: 40px
- [ ] Labels: 12px

**CTA Final Mobile:**
- [ ] Sticky bottom (sempre visível)
- [ ] Full-width button 56px
- [ ] SafeArea inset (iOS notch)

**Performance Mobile:**
- [ ] LCP < 2.5s (4G) ou < 3.5s (3G)
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Total page < 1MB
- [ ] Images: WebP/AVIF
- [ ] Fonts: Subset PT-BR
- [ ] Lazy load: tudo exceto hero

**Testes:**
- [ ] iPhone SE (375px) - pior caso
- [ ] iPhone 14 (390px) - mais comum
- [ ] Samsung Galaxy (412px)
- [ ] 3G slow (Chrome DevTools)
- [ ] Touch: todos CTAs >= 44px

---

### FASE 2: SOLUÇÕES POR PÚBLICO

#### ✅ CADA PÁGINA DE SOLUÇÃO (campanhas, partidos, consultorias, lobbying)

**Mobile First Checklist (adicionar a TODAS):**

**Hero:**
- [ ] Vertical layout
- [ ] Badge: sticky top ou inline
- [ ] Título: 32px (max 50 chars)
- [ ] CTA: sticky bottom 56px

**Cronograma/Timeline:**
- [ ] Mobile: vertical (top to bottom)
- [ ] Ícones: 40px
- [ ] Linha conectora: 2px
- [ ] Desktop: horizontal (left to right)

**Tabela de Preços (3 colunas):**
- [ ] Mobile: 1 coluna por vez (carousel swipe)
- [ ] Indicadores de página (dots)
- [ ] Card destacado: border colorido
- [ ] Botão: full-width 56px
- [ ] Tablet: 2 colunas visíveis
- [ ] Desktop: 3 colunas lado a lado

**Casos de Sucesso:**
- [ ] Mobile: accordion (1 aberto por vez)
- [ ] Card: padding 20px
- [ ] Desktop: grid 3 colunas

**Compliance Badges:**
- [ ] Mobile: 2x2 grid ou vertical
- [ ] Desktop: 1x4 horizontal

**Performance:**
- [ ] LCP < 3s (3G)
- [ ] Imagens otimizadas mobile
- [ ] Lazy loading: sim

---

### FASE 3: SERVIÇOS ESPECÍFICOS

#### ✅ CADA PÁGINA DE SERVIÇO (vetting, triagem, pesquisa, etc.)

**Mobile First Checklist (adicionar a TODAS):**

**Hero:**
- [ ] Vertical, badge + título + CTA
- [ ] CTA: sticky bottom

**O que verificamos (lista):**
- [ ] Mobile: accordion por categoria
- [ ] Checkmarks: 20px ícone
- [ ] Desktop: grid 2 colunas

**Pacotes (3 níveis):**
- [ ] Mobile: vertical stack
- [ ] Card recomendado: destacado
- [ ] Botão: full-width 56px
- [ ] Desktop: 3 colunas

**Processo/Timeline:**
- [ ] Mobile: vertical steps
- [ ] Step número: 32px circle
- [ ] Desktop: horizontal

**Formulário (se houver):**
- [ ] Labels: sempre visíveis (não placeholder)
- [ ] Inputs: 56px altura
- [ ] Input type correto (tel, email)
- [ ] Autocomplete: on
- [ ] Erros: inline abaixo do campo
- [ ] Submit button: full-width 56px

---

### FASE 4: RECURSOS EDUCACIONAIS

#### ✅ CADA PÁGINA DE RECURSO (guias)

**Mobile First Checklist:**

**Navegação interna (TOC):**
- [ ] Mobile: sticky top, collapse/expand
- [ ] Desktop: sidebar fixa esquerda

**Conteúdo:**
- [ ] Mobile: full-width (sem sidebar)
- [ ] Typography: 16px body mínimo
- [ ] Line-height: 1.6
- [ ] Headings: hierarquia clara
- [ ] Desktop: sidebar + conteúdo

**Download PDF:**
- [ ] Mobile: sticky bottom button
- [ ] Desktop: sidebar CTA

**Imagens/Diagramas:**
- [ ] Mobile: full-width, tap to zoom
- [ ] Desktop: max-width com zoom

---

### FASE 5: SUPORTE

#### ✅ TAREFA 5.1: /precos

**Mobile First:**
- [ ] Tabs por público: scroll horizontal
- [ ] Tabela: 1 coluna por vez (swipe)
- [ ] Serviços avulsos: accordion
- [ ] FAQ: accordion
- [ ] CTA: sticky bottom

---

### FASE 6: DASHBOARD

#### ✅ TODAS as páginas de dashboard

**Mobile First (CRÍTICO para dashboard):**

**Navegação:**
- [ ] Mobile: bottom tab bar (não sidebar)
- [ ] 5 itens max no tab bar
- [ ] Resto: em menu "Mais"
- [ ] Tabs: 56px altura
- [ ] Desktop: sidebar esquerda

**Tabelas:**
- [ ] Mobile: CARDS (não tabelas tradicionais)
- [ ] Card: dados empilhados verticalmente
- [ ] Actions: dropdown no card
- [ ] Tablet: tabela scrollável horizontal
- [ ] Desktop: tabela completa

**Filtros:**
- [ ] Mobile: modal full-screen
- [ ] Botão "Filtros": badge com count
- [ ] Desktop: sidebar ou dropdown

**Charts/Gráficos:**
- [ ] Mobile: verticais (bar charts)
- [ ] Scrolláveis se muitos dados
- [ ] Interação: touch-friendly
- [ ] Desktop: horizontais permitidos

**Ações em Massa:**
- [ ] Mobile: floating action button (FAB) 56px
- [ ] Desktop: toolbar top

**Search:**
- [ ] Mobile: full-width input 56px
- [ ] Ícone search: 24px
- [ ] Desktop: max-width 400px

**Forms:**
- [ ] Inputs: 56px altura
- [ ] Labels: sempre visíveis
- [ ] Validation: inline

---

## ⚡ PERFORMANCE TARGETS MOBILE

### Cada Página Deve Atingir:

**Mobile (3G Slow):**
- [ ] LCP < 3.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] PageSpeed Mobile > 80

**Mobile (4G):**
- [ ] LCP < 2.5s
- [ ] PageSpeed Mobile > 90

**Tamanho:**
- [ ] HTML + CSS + JS (inicial): < 300KB
- [ ] Imagens hero: < 150KB
- [ ] Total página: < 1MB

---

## 🧪 TESTES MOBILE OBRIGATÓRIOS

### Antes de Marcar QUALQUER Tarefa como Completa:

**Dispositivos Reais (mínimo 2):**
- [ ] iPhone (qualquer modelo iOS 15+)
- [ ] Android (qualquer modelo Android 11+)

**Emuladores (Chrome DevTools):**
- [ ] 375px (iPhone SE) - OBRIGATÓRIO
- [ ] 390px (iPhone 14)
- [ ] 412px (Samsung)

**Conexão:**
- [ ] 3G Slow (750 Kbps) - teste 1 vez
- [ ] 4G (4 Mbps) - teste padrão

**Orientação:**
- [ ] Portrait (vertical) - OBRIGATÓRIO
- [ ] Landscape - bom ter

**Checklist Rápido:**
- [ ] Sem scroll horizontal
- [ ] Todos os botões >= 44x44px
- [ ] Texto legível sem zoom (16px+)
- [ ] CTAs acessíveis com polegar
- [ ] Formulários funcionam bem
- [ ] Imagens carregam rápido
- [ ] Sem elementos cortados

---

## 🚫 ERROS COMUNS A EVITAR

### ❌ NÃO FAÇA:

1. **Desktop First:**
   ```css
   /* ERRADO */
   .hero { font-size: 48px; }
   @media (max-width: 768px) { .hero { font-size: 24px; } }
   ```

2. **Touch targets pequenos:**
   ```html
   <!-- ERRADO: 30px -->
   <button class="w-8 h-8">X</button>
   ```

3. **Hover obrigatório:**
   ```css
   /* ERRADO: só funciona com hover */
   .menu { display: none; }
   .menu:hover { display: block; }
   ```

4. **Formulários ruins:**
   ```html
   <!-- ERRADO: placeholder como label -->
   <input placeholder="Nome">
   ```

5. **Imagens não otimizadas:**
   ```html
   <!-- ERRADO: desktop.jpg 3MB -->
   <img src="hero-desktop.jpg">
   ```

### ✅ FAÇA:

1. **Mobile First:**
   ```css
   /* CORRETO */
   .hero { font-size: 24px; }
   @media (min-width: 768px) { .hero { font-size: 48px; } }
   ```

2. **Touch targets corretos:**
   ```html
   <!-- CORRETO: 44px -->
   <button class="w-11 h-11">X</button>
   ```

3. **Touch friendly:**
   ```css
   /* CORRETO: funciona com touch */
   .menu { display: none; }
   .menu.active { display: block; }
   ```

4. **Formulários bons:**
   ```html
   <!-- CORRETO: label sempre visível -->
   <label>Nome</label>
   <input type="text" autocomplete="name">
   ```

5. **Imagens otimizadas:**
   ```html
   <!-- CORRETO: responsive + otimizado -->
   <picture>
     <source media="(max-width: 767px)" srcset="mobile.webp">
     <source media="(min-width: 768px)" srcset="desktop.webp">
     <img src="mobile.jpg" loading="lazy">
   </picture>
   ```

---

## 📱 QUICK START: ANTES DE COMEÇAR QUALQUER PÁGINA

### Setup Inicial (fazer UMA vez):

1. [ ] Configurar breakpoints mobile-first (Tailwind ou CSS)
2. [ ] Criar componentes base mobile-first:
   - [ ] Button (44px min)
   - [ ] Card (responsive padding)
   - [ ] Container (fluid)
   - [ ] Grid (1 col mobile)
3. [ ] Configurar otimização de imagens
4. [ ] Testar no celular REAL

### Por Página (fazer SEMPRE):

1. [ ] Wireframe mobile 375px PRIMEIRO
2. [ ] Desenvolver mobile primeiro
3. [ ] Testar no celular
4. [ ] Expandir para tablet
5. [ ] Expandir para desktop
6. [ ] Testar tudo de novo

---

## ✅ CRITÉRIO FINAL DE ACEITAÇÃO

### Uma página SÓ está COMPLETA se:

- [ ] ✅ Funciona perfeitamente em iPhone SE (375px)
- [ ] ✅ Funciona perfeitamente em Android médio (412px)
- [ ] ✅ Touch targets >= 44px (TODOS)
- [ ] ✅ LCP < 3s em 3G
- [ ] ✅ Sem scroll horizontal em NENHUM tamanho
- [ ] ✅ Texto legível (16px+) sem zoom
- [ ] ✅ CTAs acessíveis com polegar
- [ ] ✅ Testada em 2 dispositivos reais mínimo
- [ ] ✅ PageSpeed Mobile > 85

**Se faltar 1 item, NÃO está completa. Volte e corrija.**

---

## 📞 DÚVIDA RÁPIDA?

**Pergunta:** Preciso testar TUDO no celular?
**Resposta:** SIM. Se você não testou no celular real, NÃO funciona.

**Pergunta:** Posso fazer desktop first e adaptar depois?
**Resposta:** NÃO. Sempre mobile first. Adaptar depois = retrabalho.

**Pergunta:** 44px não é muito grande?
**Resposta:** NÃO. É o mínimo da Apple e Google. Seus dedos agradecem.

---

**DOCUMENTO CRIADO EM:** 17/01/2026
**USO:** Integrar com TODO_REPOSICIONAMENTO_POLITICO.md
