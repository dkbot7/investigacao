# 🚀 INICIAR TODOS OS 4 AGENTS - GUIA COMPLETO

**Data:** 2025-12-07
**Versão:** 1.0

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Ordem de Inicialização](#ordem-de-inicialização)
3. [Agent 1 - Tech Lead](#agent-1---tech-lead)
4. [Agent 2 - Backend](#agent-2---backend)
5. [Agent 3 - Full-Stack](#agent-3---full-stack)
6. [Agent 4 - Content](#agent-4---content)
7. [Monitoramento](#monitoramento)

---

## 🎯 VISÃO GERAL

Você vai abrir **4 terminais** separados, cada um rodando um Claude Code agent diferente.

**Cada agent tem:**
- ✅ Roteiro detalhado (TODO.md)
- ✅ Status tracker (STATUS.md)
- ✅ Prompt de inicialização (INIT_PROMPT.md)
- ✅ Arquivos exclusivos (zero conflito)

**Comunicação:**
- `.agents/COORDINATION.md` - Central de comunicação
- Cada agent atualiza seu STATUS.md
- Commits com prefixos: [A1], [A2], [A3], [A4]

---

## ⚡ ORDEM DE INICIALIZAÇÃO

### **FASE 1 - INÍCIO IMEDIATO (Agora)**

**Abrir 2 terminais:**

| Terminal | Agent | Pode começar? | Por quê? |
|----------|-------|---------------|----------|
| **Terminal 1** | Agent 1 (Tech Lead) | ✅ SIM | Corrigir build (CRÍTICO) |
| **Terminal 4** | Agent 4 (Content) | ✅ SIM | Independente, não depende de nada |

---

### **FASE 2 - APÓS 2-3 HORAS**

**Quando Agent 1 completar TAREFA 1.1 (build fix):**

**Abrir mais 2 terminais:**

| Terminal | Agent | Aguardar | Por quê? |
|----------|-------|----------|----------|
| **Terminal 2** | Agent 2 (Backend) | Agent 1 build fix | Precisa de build funcionando |
| **Terminal 3** | Agent 3 (Full-Stack) | Agent 1 + Agent 2 | Precisa de backend para integração |

---

## 🤖 AGENT 1 - TECH LEAD

### **Quando iniciar:** AGORA (imediato)

### **Terminal 1:**

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
claude code
```

### **Prompt para colar:**

```
Você é o Agent 1 - Tech Lead & Infrastructure Engineer do projeto Investigaree.

Seu roteiro completo está em: .agents/agent-1-techLead/TODO.md

SUA PRIMEIRA TAREFA CRÍTICA (URGENTE - BLOCKING):

TAREFA 1.1: Corrigir Build TypeScript (Next.js 16)

Problema: Erro em investigaree/src/app/api/admin/alerts/[alertId]/read/route.ts
Causa: Next.js 16 mudou params de síncrono para Promise

Passos:
1. Ler arquivo: investigaree/src/app/api/admin/alerts/[alertId]/read/route.ts
2. Mudar tipo de params de { alertId: string } para Promise<{ alertId: string }>
3. Adicionar await ao acessar params: const { alertId } = await params;
4. Procurar outros arquivos com rotas dinâmicas e corrigir também
5. Rodar: npm run build
6. Confirmar build passa sem erros
7. Commit: [A1] Fix Next.js 16 dynamic route params type error
8. Atualizar .agents/agent-1-techLead/STATUS.md para WORKING
9. Postar em .agents/COORDINATION.md: Build corrigido! Agents 2 e 3 podem começar.

Esta tarefa é BLOQUEADORA para todos os outros agents. Prioridade máxima!

Após completar, continue com TAREFA 1.2 (verificar deploy).

Seu roteiro completo tem 13 tarefas. Leia: cat .agents/agent-1-techLead/TODO.md

COMECE AGORA!
```

### **Arquivos exclusivos do Agent 1:**
- `.github/workflows/*.yml`
- `playwright.config.ts`
- `firebase.json`
- `next.config.ts`

---

## 🤖 AGENT 2 - BACKEND

### **Quando iniciar:** Após Agent 1 completar TAREFA 1.1 (~2-3h)

### **Terminal 2:**

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
claude code
```

### **Prompt para colar:**

**Ver arquivo completo:** `.agents/agent-2-backend/INIT_PROMPT.md`

**Resumo:**
```
Você é o Agent 2 - Backend Engineer.

Roteiro: .agents/agent-2-backend/TODO.md (15 tarefas)

ANTES DE COMEÇAR:
1. Ler TODO.md completo
2. Verificar COORDINATION.md - Agent 1 corrigiu build?
3. Se SIM: começar TAREFA 2.1 (criar estrutura backend)
4. Se NÃO: STATUS.md = BLOCKED, aguardar

RESPONSABILIDADES:
- 9 APIs SERPRO integradas
- Cloudflare Workers + D1 Database
- Auth, rate limiting, cache
- Admin endpoints

Documentação SERPRO em: APIs/SERPRO/

COMECE!
```

### **Arquivos exclusivos do Agent 2:**
- `backend/**/*` (você vai criar)
- `workers/**/*`
- `wrangler.toml`

---

## 🤖 AGENT 3 - FULL-STACK

### **Quando iniciar:** Após Agent 1 E Agent 2 começarem (~4-6h)

### **Terminal 3:**

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
claude code
```

### **Prompt para colar:**

**Ver arquivo completo:** `.agents/agent-3-fullstack/INIT_PROMPT.md`

**Resumo:**
```
Você é o Agent 3 - Full-Stack Developer.

Roteiro: .agents/agent-3-fullstack/TODO.md (14 tarefas)

DEPENDÊNCIAS:
- Agent 1: Firebase Emulator (para testes E2E)
- Agent 2: Backend API (para integração)

PODE COMEÇAR SEM BLOCKER:
- TAREFA 3.1: Refatorar service layer
- TAREFA 3.2: Criar SERPRO service
- TAREFA 3.3: Criar admin service

Essas 3 tarefas são PREPARAÇÃO e não dependem de backend!

RESPONSABILIDADES:
- Conectar dashboard ao backend real
- Relatórios PDF (jsPDF)
- 58 testes E2E passando
- Alertas, export, batch processing

COMECE pela preparação!
```

### **Arquivos exclusivos do Agent 3:**
- `investigaree/src/lib/services/**/*`
- `investigaree/src/app/dashboard/**/*`
- `investigaree/src/components/dashboard/**/*`
- `investigaree/e2e/**/*`

---

## 🤖 AGENT 4 - CONTENT

### **Quando iniciar:** AGORA (imediato, independente!)

### **Terminal 4:**

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
claude code
```

### **Prompt para colar:**

**Ver arquivo completo:** `.agents/agent-4-content/INIT_PROMPT.md`

**Resumo:**
```
Você é o Agent 4 - Content Developer.

Roteiro: .agents/agent-4-content/TODO.md (24 tarefas)

VOCÊ É 100% INDEPENDENTE! Não depende de nenhum agent!

SUA PRIMEIRA TAREFA (COMECE AGORA):

TAREFA 4.1: Escrever Post #3 - Portal da Transparência (CEIS/CNEP)

Arquivo: investigaree/content/blog/fontes-publicas-03-portal-transparencia.mdx

Estrutura:
- 2500-3000 palavras
- Componentes MDX (KeyStat, Timeline, Quiz, CTABanner)
- Dados de 2024-2025
- Exemplo prático completo
- SeriesNavigation

Template COMPLETO em: .agents/agent-4-content/TODO.md (TAREFA 4.1)

RESPONSABILIDADES:
- 8 posts série "Fontes Públicas" (#3 ao #10)
- 3 vídeos tutoriais
- 3 materiais downloadable
- SEO (schema markup, GA4)
- 3 landing pages setoriais

COMECE JÁ! Você é o único que pode produzir conteúdo agora!
```

### **Arquivos exclusivos do Agent 4:**
- `investigaree/content/blog/**/*`
- `investigaree/public/videos/**/*`
- `investigaree/public/downloads/**/*`
- `investigaree/src/app/solucoes/**/*`

---

## 📊 MONITORAMENTO

### **Arquivos para Dani acompanhar:**

**1. Central de Comunicação:**
```bash
cat .agents/COORDINATION.md
```
Ver postagens de todos os agents.

**2. Status Individual:**
```bash
cat .agents/agent-1-techLead/STATUS.md
cat .agents/agent-2-backend/STATUS.md
cat .agents/agent-3-fullstack/STATUS.md
cat .agents/agent-4-content/STATUS.md
```

**3. Commits Git:**
```bash
git log --oneline --all --graph --since="1 day ago"
```
Ver commits com prefixos [A1], [A2], [A3], [A4].

---

## 🎯 MARCOS IMPORTANTES (MILESTONES)

Aguardar postagens em COORDINATION.md:

| Marco | Agent | Quando | Impacto |
|-------|-------|--------|---------|
| **Build corrigido** | A1 | ~2-3h | Desbloqueia A2 e A3 |
| **Firebase Emulator** | A1 | ~6-8h | Desbloqueia testes E2E de A3 |
| **3 APIs SERPRO core** | A2 | ~2-3 dias | Desbloqueia integração de A3 |
| **Backend em produção** | A2 | ~2 semanas | Frontend pode usar dados reais |
| **58 testes E2E passando** | A3 | ~1 semana | Qualidade garantida |
| **Série Fontes Públicas completa** | A4 | ~1 semana | 10 posts SEO-optimized |
| **Plataforma 100% funcional** | Todos | ~4 semanas | READY FOR CUSTOMERS! 🚀 |

---

## ✅ CHECKLIST DE INICIALIZAÇÃO

**Antes de começar:**
- [ ] Ler este arquivo completo
- [ ] Ler `.agents/README.md`
- [ ] Ler `.agents/RESUMO_EXECUTIVO.md`
- [ ] `git pull origin main` (atualizar código)
- [ ] `cd investigaree && npm install` (dependências)

**Iniciar agents:**
- [ ] Terminal 1: Agent 1 (Tech Lead) - AGORA
- [ ] Terminal 4: Agent 4 (Content) - AGORA
- [ ] Aguardar ~2-3h
- [ ] Terminal 2: Agent 2 (Backend) - Após build fix
- [ ] Terminal 3: Agent 3 (Full-Stack) - Após backend começar

**Monitorar:**
- [ ] COORDINATION.md a cada 2-4 horas
- [ ] STATUS.md de cada agent diariamente
- [ ] Git commits diariamente

---

## 🆘 TROUBLESHOOTING

### **Problema: Agent não sabe o que fazer**

**Solução:**
```
"Leia seu arquivo TODO.md completo. Depois leia COORDINATION.md para verificar blockers. Se não houver blockers, comece pela primeira tarefa pendente. Atualize seu STATUS.md antes de começar."
```

### **Problema: Build quebrou de novo**

**Solução:**
- Identificar qual agent causou (último commit)
- Agent responsável deve reverter ou corrigir imediatamente
- Agent 1 deve revisar e aprovar correção

### **Problema: Conflito em arquivo compartilhado**

**Solução:**
- NUNCA modificar arquivo de outro agent sem coordenar
- Se precisa de mudança em arquivo compartilhado, postar em COORDINATION.md
- Agent 1 coordena mudanças em package.json

---

## 🎉 RESULTADO ESPERADO

**Após 4 semanas:**

✅ **Infraestrutura (Agent 1):**
- Build funcionando, deploy automático, testes E2E passando, monitoring ativo

✅ **Backend (Agent 2):**
- 9 APIs SERPRO integradas, backend em produção, D1 database operacional

✅ **Frontend (Agent 3):**
- Dashboard conectado a dados reais, relatórios PDF, alertas, export, batch processing

✅ **Conteúdo (Agent 4):**
- 38 blog posts, 3 vídeos, 3 downloads, SEO otimizado, GA4 configurado

✅ **PLATAFORMA INVESTIGAREE 100% FUNCIONAL E PRONTA PARA CLIENTES!** 🚀

---

## 📚 DOCUMENTAÇÃO COMPLETA

**Leitura essencial:**
1. `.agents/README.md` - Sistema de coordenação
2. `.agents/RESUMO_EXECUTIVO.md` - Visão geral
3. `.agents/QUICK_START.md` - Guia rápido
4. `.agents/agent-X-[role]/TODO.md` - Roteiro específico
5. `.agents/agent-X-[role]/INIT_PROMPT.md` - Prompt de inicialização

**Comunicação:**
- `.agents/COORDINATION.md` - Central
- `.agents/agent-X-[role]/STATUS.md` - Status individual

---

## 🚀 PRONTO PARA COMEÇAR?

**Próximo passo:**

1. Abrir Terminal 1
2. Iniciar Agent 1 (Tech Lead)
3. Abrir Terminal 4
4. Iniciar Agent 4 (Content)
5. Aguardar 2-3h
6. Iniciar Agents 2 e 3

**BOA SORTE, EQUIPE! 🎯**

---

**Criado:** 2025-12-07
**Última atualização:** 2025-12-07 16:45
**Status:** ✅ PRONTO PARA EXECUÇÃO
