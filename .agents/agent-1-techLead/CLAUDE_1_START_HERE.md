# 🧪 CLAUDE 1 - QA ENGINEER - START HERE

**Data:** 2025-12-08 07:15
**Sessão:** NOVA (continuação do Agent 1)
**Seu Progresso:** 🟡 27% (3.5/13 tarefas) - **TAREFA 1.4 é a próxima**
**Status:** E2E Tests 80% passando (48/60 Chromium) - **12 testes falhando**

---

## 🎯 COPIE E COLE ESTE PROMPT COMPLETO

```
Você é o Agent 1 - Tech Lead & Infrastructure do projeto Investigaree.

# ⚡ SITUAÇÃO ATUAL - LEIA COM ATENÇÃO

## ✅ O QUE JÁ ESTÁ PRONTO:

1. **Build TypeScript ✅ FUNCIONANDO**
   - Next.js 16 params Promise corrigido
   - Build completo: 76/76 páginas
   - Commit: `42fc328` [A1] Fix Next.js 16 params

2. **Deploy ✅ FUNCIONANDO**
   - URL Produção: https://investigaree.com.br (ATIVO!)
   - URL WWW: https://www.investigaree.com.br (ATIVO!)
   - Último deploy: https://b8a0d52d.investigaree.pages.dev
   - 77 páginas geradas, 759 arquivos
   - DNS propagado, SSL ativo

3. **Firebase Emulator ✅ CONFIGURADO**
   - Porta 9099 para auth
   - Script criado: `firebase-emulator.bat`
   - Documentação: `FIREBASE-EMULATOR.md`
   - Variável: `NEXT_PUBLIC_USE_FIREBASE_EMULATOR` em .env.local

4. **E2E Tests - 80% COMPLETO ⚠️ ATENÇÃO**
   - Total: 180 testes (60 Chromium + 60 Mobile Chrome + 60 Mobile Safari)
   - Chromium: **48/60 passando (80%)** ⬆️
   - **12 testes falhando** (banner, mobile, modals, alerts, metrics)
   - Commit: `f042456` [A1] Fix E2E test selectors and paths
   - Documentação: `E2E-TESTS-STATUS.md`

## ❌ O QUE ESTÁ FALTANDO (SEU TRABALHO AGORA):

**TAREFA 1.4: Corrigir 12 Testes E2E Falhando (Chromium) → 100%**

Após completar Chromium (60/60), você ainda precisará:
- Rodar Mobile Chrome: 60 testes
- Rodar Mobile Safari: 60 testes
- **Meta Final:** 180/180 testes passando (100%)

---

# 📋 TAREFA 1.4 - ANÁLISE DOS 12 TESTES FALHANDO

## 🔴 Resumo dos Problemas (baseado em E2E-TESTS-STATUS.md):

### **Arquivo 1: `e2e/admin/01-load-and-navigation.spec.ts`** (5 falhando)
- ❌ deve mostrar loading spinner durante carregamento inicial
- ❌ deve exibir os 4 cards de estatísticas
- ❌ deve carregar o painel admin com sucesso
- ❌ deve exibir banner de modo desenvolvimento (se ativado)
- ❌ deve ser responsivo em viewport mobile

**Problema:** "Admin panel test page não carregou completamente"

### **Arquivo 2: `e2e/admin/02-user-management.spec.ts`** (3 falhando)
- ❌ deve abrir modal de conceder acesso
- ❌ deve validar formulário de conceder acesso
- ❌ deve abrir modal de revogar acesso

**Problema:** Modais não estão abrindo

### **Arquivo 3: `e2e/admin/03-tenant-management.spec.ts`** (3 falhando)
- ❌ deve exibir lista de tenants em cards
- ❌ deve exibir badges de status corretos
- ❌ deve exibir usuários do tenant no card

**Problema:** Elementos visuais não carregando corretamente

### **Arquivo 4: `e2e/admin/04-alerts-and-logs.spec.ts`** (3 falhando)
- ❌ deve exibir lista de alertas do sistema
- ❌ deve marcar alerta como lido
- ❌ deve marcar todos como lidos

**Problema:** Operações de marcar como lido falhando

### **Arquivo 5: `e2e/admin/05-metrics.spec.ts`** (12 testes)
Status: **Não executado ainda** (aguardando correção dos outros)

---

# 🚀 PASSO-A-PASSO PARA CORRIGIR

## PASSO 1: Executar Teste Completo (Para Ver Status Atual)

```bash
cd investigaree

# Executar APENAS Chromium (mais rápido)
npx playwright test --project=chromium

# Ver relatório HTML
npx playwright show-report
```

**Objetivo:** Confirmar quais dos 12 testes ainda estão falhando e obter detalhes das falhas.

---

## PASSO 2: Corrigir Arquivo 1 - `01-load-and-navigation.spec.ts`

### 2.1. Analisar o Teste

```bash
# Ver o código do teste
cat investigaree/e2e/admin/01-load-and-navigation.spec.ts
```

### 2.2. Identificar Problemas Comuns

**Problema Provável:** Timing - página carrega mas teste não espera o suficiente

**Soluções:**

a) **Aumentar timeout de espera:**
```typescript
// No início do teste, adicionar:
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000); // 2 segundos extra
```

b) **Melhorar seletores de espera:**
```typescript
// Ao invés de:
await page.waitForSelector('[data-testid="admin-panel"]');

// Fazer:
await page.waitForSelector('[data-testid="admin-panel"]', {
  state: 'visible',
  timeout: 10000
});
```

c) **Verificar banner de dev:**
```typescript
// Se banner não aparece, fazer verificação condicional:
const devBanner = await page.locator('[data-testid="dev-banner"]').count();
if (devBanner > 0) {
  await expect(page.locator('[data-testid="dev-banner"]')).toBeVisible();
}
```

### 2.3. Corrigir e Testar

```bash
# Rodar apenas este arquivo
npx playwright test e2e/admin/01-load-and-navigation.spec.ts --project=chromium

# Se passar, commit
git add investigaree/e2e/admin/01-load-and-navigation.spec.ts
git commit -m "[A1] fix: E2E test 01-load-and-navigation timing issues"
```

---

## PASSO 3: Corrigir Arquivo 2 - `02-user-management.spec.ts`

### 3.1. Problema: Modais Não Abrem

**Verificar:**
1. Botão existe?
2. Botão está visível?
3. Botão está clicável (não disabled)?
4. Modal realmente aparece após clique?

### 3.2. Código de Exemplo para Corrigir

```typescript
test('deve abrir modal de conceder acesso', async ({ page }) => {
  // 1. Garantir botão está visível
  const grantButton = page.locator('[data-testid="grant-access-button"]');
  await grantButton.waitFor({ state: 'visible', timeout: 5000 });

  // 2. Clicar e esperar modal
  await grantButton.click();

  // 3. Esperar modal aparecer (com timeout generoso)
  const modal = page.locator('[data-testid="grant-access-modal"]');
  await modal.waitFor({ state: 'visible', timeout: 10000 });

  // 4. Verificar modal está visível
  await expect(modal).toBeVisible();
});
```

### 3.3. Testar

```bash
npx playwright test e2e/admin/02-user-management.spec.ts --project=chromium
```

---

## PASSO 4: Corrigir Arquivo 3 - `03-tenant-management.spec.ts`

### 4.1. Problema: Elementos Visuais Não Carregam

**Verificar:**
- Dados estão sendo mockados corretamente?
- Cards estão sendo renderizados?
- Badges estão com classes CSS corretas?

### 4.2. Código de Exemplo

```typescript
test('deve exibir lista de tenants em cards', async ({ page }) => {
  // 1. Esperar cards carregarem
  await page.waitForLoadState('networkidle');

  // 2. Esperar por pelo menos 1 card
  await page.waitForSelector('[data-testid="tenant-card"]', {
    state: 'visible',
    timeout: 10000
  });

  // 3. Contar cards
  const cards = await page.locator('[data-testid="tenant-card"]').count();

  // 4. Verificar existe pelo menos 1
  expect(cards).toBeGreaterThan(0);
});
```

### 4.3. Testar

```bash
npx playwright test e2e/admin/03-tenant-management.spec.ts --project=chromium
```

---

## PASSO 5: Corrigir Arquivo 4 - `04-alerts-and-logs.spec.ts`

### 5.1. Problema: Operações de Estado Falhando

**Marcar como lido requer:**
1. Mock de API funcionando
2. LocalStorage sendo atualizado
3. UI refletindo mudança

### 5.2. Código de Exemplo

```typescript
test('deve marcar alerta como lido', async ({ page }) => {
  // 1. Esperar lista de alertas
  await page.waitForSelector('[data-testid="alert-item"]', {
    state: 'visible',
    timeout: 10000
  });

  // 2. Pegar primeiro alerta não lido
  const unreadAlert = page.locator('[data-testid="alert-item"][data-read="false"]').first();
  await unreadAlert.waitFor({ state: 'visible' });

  // 3. Clicar em "marcar como lido"
  const readButton = unreadAlert.locator('[data-testid="mark-as-read-button"]');
  await readButton.click();

  // 4. Esperar atualização (pode ser otimista)
  await page.waitForTimeout(1000);

  // 5. Verificar alerta foi marcado como lido
  const alertStatus = await unreadAlert.getAttribute('data-read');
  expect(alertStatus).toBe('true');
});
```

### 5.3. Testar

```bash
npx playwright test e2e/admin/04-alerts-and-logs.spec.ts --project=chromium
```

---

## PASSO 6: Executar Suite Completa (Chromium)

Após corrigir os 4 arquivos:

```bash
# Rodar todos os testes Chromium
npx playwright test --project=chromium

# Ver relatório
npx playwright show-report
```

**Meta:** 60/60 Chromium passando (100%)

---

## PASSO 7: Executar Mobile Chrome e Mobile Safari

Quando Chromium estiver 100%:

```bash
# Mobile Chrome
npx playwright test --project=mobile-chrome

# Mobile Safari
npx playwright test --project=mobile-safari

# Ou todos juntos (180 testes)
npx playwright test
```

**Meta Final:** 180/180 testes passando (100%)

---

## PASSO 8: Commit Final

```bash
git add investigaree/e2e/
git commit -m "[A1] fix: E2E tests 100% passing (180/180)

- Fixed timing issues in load-and-navigation tests
- Fixed modal opening in user-management tests
- Fixed visual elements in tenant-management tests
- Fixed state operations in alerts-and-logs tests
- All 60 Chromium tests passing
- All 60 Mobile Chrome tests passing
- All 60 Mobile Safari tests passing

Agent 1 - Task 1.4 complete
"
```

---

## PASSO 9: Atualizar Documentação

```bash
# Editar .agents/agent-1-techLead/STATUS.md
# Marcar TAREFA 1.4 como ✅ completada
# Atualizar progresso para 31% (4/13 tarefas)

# Editar investigaree/E2E-TESTS-STATUS.md
# Atualizar status para 180/180 passando
```

---

# 🛠️ FERRAMENTAS ÚTEIS

## 1. Playwright Inspector (Debug Mode)

```bash
# Rodar teste específico em modo debug
npx playwright test e2e/admin/01-load-and-navigation.spec.ts --debug

# Vai abrir interface gráfica onde você pode:
# - Ver cada passo do teste
# - Pausar e avançar manualmente
# - Inspecionar elementos
# - Ver console logs
```

## 2. Ver Traces de Falhas

```bash
# Se teste falhar, vai gerar trace
npx playwright show-trace test-results/[caminho-do-test]/trace.zip
```

## 3. Rodar Teste Específico

```bash
# Por nome (grep)
npx playwright test -g "deve abrir modal de conceder acesso"

# Por arquivo
npx playwright test e2e/admin/02-user-management.spec.ts

# Por projeto
npx playwright test --project=chromium
```

## 4. Ver Coverage

```bash
# Gerar relatório HTML
npx playwright show-report

# Vai abrir browser com:
# - Lista de todos os testes
# - Status (passed/failed)
# - Tempo de execução
# - Screenshots de falhas
```

---

# 🔍 DEBUGGING ESTRATÉGIAS

## Estratégia 1: Adicionar Screenshots

```typescript
// No teste que está falhando
test('meu teste', async ({ page }) => {
  await page.goto('/dashboard/admin');

  // Tirar screenshot antes do problema
  await page.screenshot({ path: 'debug-before.png' });

  // Fazer ação
  await page.click('[data-testid="button"]');

  // Tirar screenshot depois
  await page.screenshot({ path: 'debug-after.png' });
});
```

## Estratégia 2: Adicionar Console Logs

```typescript
// Ver o que está acontecendo
test('meu teste', async ({ page }) => {
  // Capturar console do browser
  page.on('console', msg => console.log('BROWSER:', msg.text()));

  await page.goto('/dashboard/admin');

  // Ver quantos elementos existem
  const count = await page.locator('[data-testid="card"]').count();
  console.log('Cards encontrados:', count);
});
```

## Estratégia 3: Esperar por Network

```typescript
// Se teste depende de API
test('meu teste', async ({ page }) => {
  // Esperar request específica completar
  await page.waitForResponse(resp =>
    resp.url().includes('/api/admin/tenants') && resp.status() === 200
  );

  // Agora verificar UI
  await expect(page.locator('[data-testid="tenant-card"]')).toBeVisible();
});
```

---

# 📚 DOCUMENTAÇÃO COMPLETA

Antes de começar, LEIA:

1. **E2E Tests Status:**
   `investigaree/E2E-TESTS-STATUS.md` (análise detalhada dos 12 testes falhando)

2. **Seu TODO:**
   `.agents/agent-1-techLead/TODO.md`

3. **Seu STATUS:**
   `.agents/agent-1-techLead/STATUS.md`

4. **Playwright Config:**
   `investigaree/playwright.config.ts` (configuração de projetos)

5. **Firebase Emulator Guide:**
   `.agents/agent-1-techLead/FIREBASE-EMULATOR.md`

---

# 🎯 CHECKLIST TAREFA 1.4

Marque conforme for completando:

- [ ] Rodar `npx playwright test --project=chromium` (baseline)
- [ ] Ver `npx playwright show-report` (identificar falhas)
- [ ] Corrigir `01-load-and-navigation.spec.ts` (5 testes)
- [ ] Corrigir `02-user-management.spec.ts` (3 testes)
- [ ] Corrigir `03-tenant-management.spec.ts` (3 testes)
- [ ] Corrigir `04-alerts-and-logs.spec.ts` (3 testes)
- [ ] Rodar `05-metrics.spec.ts` (12 testes - primeira vez)
- [ ] Chromium 60/60 passando ✅
- [ ] Mobile Chrome 60/60 passando ✅
- [ ] Mobile Safari 60/60 passando ✅
- [ ] **Total: 180/180 testes passando ✅**
- [ ] Commit: `[A1] fix: E2E tests 100% passing`
- [ ] Atualizar STATUS.md (progresso → 31%)
- [ ] Atualizar E2E-TESTS-STATUS.md (180/180)

---

# 💬 SISTEMA DE COMUNICAÇÃO

1. **Atualizar STATUS.md:**
   - A cada arquivo de teste corrigido
   - Quando atingir 60/60 Chromium
   - Quando atingir 180/180 total
   - Quando encontrar blocker

2. **Commits:**
   - Prefixo: `[A1]`
   - Mensagem clara do que foi corrigido
   - Referenciar número da tarefa

3. **Coordenação:**
   - Mensagens para outros agents vão no STATUS.md
   - Backend e Frontend estão 100% funcionais!

---

# 🚀 COMEÇAR AGORA

## Comandos Iniciais (COPIE E COLE):

```bash
# 1. Ver documentação dos testes
cat investigaree/E2E-TESTS-STATUS.md

# 2. Ver seu STATUS atual
cat .agents/agent-1-techLead/STATUS.md

# 3. Rodar baseline (ver quais 12 estão falhando)
cd investigaree
npx playwright test --project=chromium

# 4. Ver relatório HTML
npx playwright show-report

# 5. Debug primeiro teste falhando
npx playwright test e2e/admin/01-load-and-navigation.spec.ts --debug

# 6. Corrigir testes (usar código exemplo acima)

# 7. Testar correção
npx playwright test --project=chromium

# 8. Quando 60/60 Chromium, rodar Mobile
npx playwright test --project=mobile-chrome
npx playwright test --project=mobile-safari

# 9. Commit
git add investigaree/e2e/
git commit -m "[A1] fix: E2E tests 100% passing (180/180)"

# 10. Atualizar STATUS
# Editar .agents/agent-1-techLead/STATUS.md
```

---

# 🎯 PRÓXIMAS TAREFAS (APÓS 1.4)

Quando completar TAREFA 1.4 (180/180 testes), você terá:

1. **TAREFA 1.5:** Otimizar GitHub Actions CI/CD
   - Adicionar E2E tests no pipeline
   - Cache de dependências
   - Deploy apenas se testes passarem

2. **TAREFA 1.6:** Setup Monitoring (Sentry)
   - Error tracking em produção
   - Source maps
   - Alertas automáticos

3. **TAREFA 1.7:** Performance Audit
   - Lighthouse > 90
   - Web Vitals
   - Analytics

---

# ⚡ RESUMO EXECUTIVO

## ✅ O QUE ESTÁ FUNCIONANDO:
- Build TypeScript 100% OK
- Deploy produção ATIVO (investigaree.com.br)
- Firebase Emulator configurado
- 48/60 testes Chromium passando (80%)

## ❌ O QUE FALTA (SEU TRABALHO):
- Corrigir 12 testes Chromium falhando ← **VOCÊ ESTÁ AQUI**
- Rodar e validar 60 testes Mobile Chrome
- Rodar e validar 60 testes Mobile Safari
- **Meta:** 180/180 testes passando (100%)

## 📊 IMPACTO:
- Qualidade: Cobertura E2E completa
- Confiança: Deploy seguro
- CI/CD: Automação completa
- Tempo estimado: 4-6 horas

---

✅ BACKEND PRONTO!
✅ FRONTEND DEPLOYADO!
✅ FIREBASE EMULATOR OK!
🟡 12 TESTES PARA CORRIGIR!
🚀 PODE COMEÇAR IMEDIATAMENTE!
```

---

## 🎬 AÇÃO IMEDIATA

**Primeiro comando ao iniciar:**
```bash
cat investigaree/E2E-TESTS-STATUS.md
```

**Segundo comando:**
```bash
cd investigaree && npx playwright test --project=chromium
```

**Terceiro comando:**
```bash
npx playwright show-report
```

---

**Criado:** 2025-12-08 07:15
**Agent:** Agent 1 - Tech Lead & Infrastructure
**Status:** 🟡 27% → Target 31% (após TAREFA 1.4)
**Backend:** ✅ 100% Operacional
**Frontend:** ✅ 100% Deployado
**Blocker:** ❌ Nenhum
**Prioridade:** 🔥🔥 ALTA (cobertura E2E completa)
