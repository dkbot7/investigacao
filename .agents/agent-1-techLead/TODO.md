# 🎯 ROTEIRO AGENT 1 - TECH LEAD & INFRASTRUCTURE

**Agent ID:** Agent 1
**Role:** Tech Lead & Infrastructure Engineer
**Workspace:** `.agents/agent-1-techLead/`
**Responsabilidade:** Build, Deploy, CI/CD, Testes E2E, Monitoring

---

## 📋 OBJETIVOS PRINCIPAIS

1. ✅ Corrigir build quebrado (URGENTE - BLOCKING)
2. ✅ Configurar Firebase Emulator para testes E2E
3. ✅ Garantir 58 testes E2E executando com sucesso
4. ✅ Setup de monitoring e error tracking
5. ✅ Otimizar CI/CD pipeline

---

## 🚀 SEMANA 1 - FUNDAÇÃO & DESBLOQUEIO

### DIA 1 - URGENTE (4-6 horas)

#### ✅ TAREFA 1.1: Corrigir Build TypeScript (CRÍTICO - P0)
**Problema:** Erro em `src/app/api/admin/alerts/[alertId]/read/route.ts`
**Causa:** Next.js 16 mudou params de síncrono para Promise

**Arquivos para corrigir:**
1. `investigaree/src/app/api/admin/alerts/[alertId]/read/route.ts`

**Código atual (ERRADO):**
```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: { alertId: string } }
) {
  const { alertId } = params; // Erro aqui
```

**Código correto (Next.js 16):**
```typescript
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ alertId: string }> }
) {
  const { alertId } = await params; // Await the promise
```

**Checklist:**
- [ ] Localizar arquivo com erro
- [ ] Atualizar tipo de params para Promise
- [ ] Adicionar await ao acessar params
- [ ] Verificar se há outros arquivos com rotas dinâmicas
- [ ] Rodar `npm run build` localmente
- [ ] Confirmar build passa sem erros
- [ ] Commit: `[A1] Fix Next.js 16 dynamic route params type error`
- [ ] Atualizar STATUS.md

**Validação:**
```bash
cd investigaree
npm run build
# Deve completar sem erros TypeScript
```

---

#### ✅ TAREFA 1.2: Verificar Deploy Funcional (1-2 horas)

**Objetivo:** Garantir que site pode ser deployado

**Checklist:**
- [ ] Build local completo: `npm run build`
- [ ] Testar export estático: `npx serve out`
- [ ] Verificar páginas principais carregam:
  - [ ] Landing page (/)
  - [ ] Blog (/blog)
  - [ ] Dashboard (/dashboard)
  - [ ] Admin panel (/dashboard/admin)
- [ ] Verificar Firebase Auth funciona
- [ ] Verificar imagens carregam
- [ ] Verificar mobile responsive
- [ ] Commit: `[A1] Verify static export deployment works`
- [ ] Atualizar STATUS.md

**Validação:**
```bash
cd investigaree
npm run build
npx serve out -l 3000
# Testar manualmente no navegador
```

---

### DIA 2 - TESTES E2E (6-8 horas)

#### ✅ TAREFA 1.3: Configurar Firebase Emulator

**Objetivo:** Permitir execução dos 58 testes E2E

**Arquivos envolvidos:**
- `investigaree/firebase.json` (já existe)
- `investigaree/package.json` (adicionar scripts)
- `investigaree/e2e/fixtures/auth.ts` (revisar)

**Checklist:**
- [ ] Instalar Firebase CLI globalmente (se necessário): `npm install -g firebase-tools`
- [ ] Verificar `firebase.json` configurado (porta 9099 para auth)
- [ ] Adicionar scripts em `package.json`:
  ```json
  "scripts": {
    "emulator": "firebase emulators:start --only auth",
    "test:e2e": "playwright test",
    "test:emulator": "firebase emulators:exec --only auth 'npm run test:e2e'"
  }
  ```
- [ ] Testar emulator standalone: `npm run emulator`
- [ ] Criar usuário admin de teste no emulator
- [ ] Atualizar `e2e/fixtures/auth.ts` para usar emulator
- [ ] Commit: `[A1] Configure Firebase Emulator for E2E tests`
- [ ] Atualizar STATUS.md

**Validação:**
```bash
cd investigaree
npm run emulator
# Em outro terminal:
firebase auth:import test-users.json --project investigaree
```

---

#### ✅ TAREFA 1.4: Executar Testes E2E

**Objetivo:** 58 testes passando

**Checklist:**
- [ ] Rodar testes com emulator: `npm run test:emulator`
- [ ] Identificar testes falhando
- [ ] Corrigir fixtures de autenticação se necessário
- [ ] Corrigir seletores se UI mudou
- [ ] Re-executar até 100% passing
- [ ] Gerar relatório: `npx playwright show-report`
- [ ] Commit: `[A1] Fix E2E tests - 58/58 passing`
- [ ] Atualizar STATUS.md

**Validação:**
```bash
cd investigaree
npm run test:emulator
# Resultado esperado: 58 passed
```

---

### DIA 3 - CI/CD & MONITORING (6-8 horas)

#### ✅ TAREFA 1.5: Otimizar GitHub Actions

**Arquivos:**
- `.github/workflows/deploy.yml`
- `.github/workflows/deploy-api.yml` (para futuro)

**Checklist:**
- [ ] Adicionar step de E2E tests no CI:
  ```yaml
  - name: Run E2E tests
    run: npm run test:emulator
    working-directory: ./investigaree
  ```
- [ ] Adicionar cache de dependências (npm)
- [ ] Adicionar verificação de build antes de deploy
- [ ] Configurar deploy apenas se testes passarem
- [ ] Testar workflow manualmente (push em branch de teste)
- [ ] Commit: `[A1] Optimize CI/CD pipeline with E2E tests`
- [ ] Atualizar STATUS.md

---

#### ✅ TAREFA 1.6: Setup Monitoring (Sentry)

**Objetivo:** Error tracking em produção

**Checklist:**
- [ ] Criar conta Sentry (ou usar existente)
- [ ] Instalar Sentry: `npm install @sentry/nextjs`
- [ ] Rodar wizard: `npx @sentry/wizard -i nextjs`
- [ ] Configurar DSN em `.env.production`
- [ ] Testar error tracking localmente
- [ ] Adicionar source maps para production
- [ ] Commit: `[A1] Add Sentry error tracking`
- [ ] Atualizar STATUS.md

**Validação:**
```bash
cd investigaree
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
# Seguir prompts
```

---

### DIA 4-5 - PERFORMANCE & OTIMIZAÇÃO (8-10 horas)

#### ✅ TAREFA 1.7: Performance Audit

**Checklist:**
- [ ] Rodar Lighthouse no site deployado
- [ ] Identificar oportunidades de otimização
- [ ] Comprimir imagens grandes (se houver)
- [ ] Verificar Web Vitals (LCP, FID, CLS)
- [ ] Adicionar analytics (Plausible ou Google Analytics 4)
- [ ] Configurar Cloudflare Analytics
- [ ] Commit: `[A1] Performance optimizations`
- [ ] Atualizar STATUS.md

**Validação:**
```bash
npx lighthouse https://investigaree.com.br --view
# Meta: Score > 90 em Performance
```

---

#### ✅ TAREFA 1.8: Documentação de Deploy

**Objetivo:** Documentar processo para Dani e equipe

**Arquivo:** `.agents/agent-1-techLead/DEPLOY-GUIDE.md`

**Conteúdo:**
- [ ] Pré-requisitos
- [ ] Variáveis de ambiente necessárias
- [ ] Processo de build local
- [ ] Processo de deploy (Cloudflare Pages)
- [ ] Rollback em caso de problemas
- [ ] Troubleshooting comum
- [ ] Commit: `[A1] Add deployment documentation`
- [ ] Atualizar STATUS.md

---

## 🚀 SEMANA 2-3 - INFRAESTRUTURA AVANÇADA

### ✅ TAREFA 1.9: Setup Staging Environment (4-6 horas)

**Checklist:**
- [ ] Criar branch `staging`
- [ ] Configurar deploy automático staging → Cloudflare Pages
- [ ] URL: `staging.investigaree.com.br` ou similar
- [ ] Variáveis de ambiente separadas
- [ ] Firebase project separado para staging
- [ ] Commit: `[A1] Setup staging environment`
- [ ] Atualizar STATUS.md

---

### ✅ TAREFA 1.10: Preview Deployments para PRs (3-4 horas)

**Checklist:**
- [ ] Configurar Cloudflare Pages para preview deploys
- [ ] Adicionar comentário automático em PRs com preview URL
- [ ] Testar com PR de exemplo
- [ ] Commit: `[A1] Enable PR preview deployments`
- [ ] Atualizar STATUS.md

---

### ✅ TAREFA 1.11: Coordenar Integração Backend (2-3 horas)

**Quando Agent 2 completar backend:**

**Checklist:**
- [ ] Revisar código do Agent 2 (Workers + D1)
- [ ] Verificar variáveis de ambiente necessárias
- [ ] Atualizar `.env.production` com API URLs
- [ ] Testar integração frontend → backend
- [ ] Atualizar CI/CD para deploy backend também
- [ ] Commit: `[A1] Integrate backend API deployment`
- [ ] Atualizar STATUS.md

---

### ✅ TAREFA 1.12: Security Audit (3-4 horas)

**Checklist:**
- [ ] Verificar variáveis de ambiente não commitadas
- [ ] Revisar CORS configuration
- [ ] Verificar rate limiting (coordenar com Agent 2)
- [ ] Adicionar headers de segurança (CSP, HSTS)
- [ ] Scan de vulnerabilidades: `npm audit`
- [ ] Commit: `[A1] Security hardening`
- [ ] Atualizar STATUS.md

---

## 🚀 SEMANA 4 - POLISH & LAUNCH

### ✅ TAREFA 1.13: Pre-Launch Checklist (4-6 horas)

**Checklist:**
- [ ] Todos os 58 testes E2E passando
- [ ] Build de produção sem warnings
- [ ] Performance Lighthouse > 90
- [ ] Monitoring ativo (Sentry)
- [ ] Analytics configurado
- [ ] Backup strategy documentada
- [ ] Incident response plan
- [ ] Commit: `[A1] Pre-launch readiness complete`
- [ ] Atualizar STATUS.md para DONE

---

## 📊 MÉTRICAS DE SUCESSO

- [ ] Build time < 2 minutos
- [ ] 58/58 testes E2E passando
- [ ] Lighthouse Performance > 90
- [ ] Zero errors no Sentry (primeiras 24h)
- [ ] Deploy time < 3 minutos
- [ ] Zero downtime durante deploys

---

## 🔗 DEPENDÊNCIAS

**Aguardando de outros agents:**
- Agent 2: Backend API URL para configurar em produção
- Agent 3: Feedback sobre testes E2E se houver falhas

**Fornecendo para outros agents:**
- Build funcionando (URGENTE - bloqueia todos)
- Firebase Emulator configurado (para Agent 3)
- CI/CD pipeline (para todos)

---

## 📝 COMUNICAÇÃO

**Atualizar STATUS.md:**
- A cada tarefa completada
- Quando encontrar blocker
- No mínimo a cada 4 horas

**Postar em COORDINATION.md:**
- Ao completar TAREFA 1.1 (desbloqueio crítico)
- Ao completar TAREFA 1.4 (testes funcionando)
- Quando backend estiver pronto para integração
- Problemas que afetam outros agents

---

## 🛠️ FERRAMENTAS & COMANDOS

**Setup inicial:**
```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
git pull
cd investigaree
npm install
```

**Build local:**
```bash
npm run build
npx serve out
```

**Testes:**
```bash
npm run emulator        # Terminal 1
npm run test:e2e        # Terminal 2
```

**Deploy (CI/CD automático):**
```bash
git add .
git commit -m "[A1] Descrição"
git push origin main
```

---

## 📂 ARQUIVOS SOB RESPONSABILIDADE

**Exclusivos (apenas Agent 1):**
- `.github/workflows/*.yml`
- `playwright.config.ts`
- `firebase.json`
- `next.config.ts`

**Coordenados (solicitar antes de modificar):**
- `package.json`
- `.env*` files
- `tsconfig.json`

---

**Criado:** 2025-12-07
**Última atualização:** 2025-12-07 14:40
