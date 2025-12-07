# 🚀 QUICK START - Iniciando os 4 Agents

**Data:** 2025-12-07
**Objetivo:** Iniciar simultaneamente 4 Claude Code agents sem conflitos

---

## ⚡ INÍCIO RÁPIDO (5 minutos)

### **Passo 1: Abrir 4 Terminais**

Abra 4 janelas do terminal CMD/PowerShell separadas.

---

### **Passo 2: Iniciar cada Agent**

#### **Terminal 1 - Agent 1 (Tech Lead)** - PRIORIDADE MÁXIMA

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
claude code

# Quando Claude Code carregar, dizer:
"Sou o Agent 1 - Tech Lead. Meu roteiro está em .agents/agent-1-techLead/TODO.md. Vou começar pela TAREFA 1.1 (corrigir build TypeScript). Atualize meu STATUS.md e comece!"
```

**Aguardar Agent 1 completar TAREFA 1.1** (2-3 horas) antes de iniciar os outros.

---

#### **Terminal 2 - Agent 2 (Backend)** - Aguardar Agent 1

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
claude code

# Quando Claude Code carregar:
"Sou o Agent 2 - Backend Engineer. Meu roteiro está em .agents/agent-2-backend/TODO.md. Verifique se Agent 1 completou o build fix no COORDINATION.md. Se sim, começar TAREFA 2.1. Senão, aguardar."
```

---

#### **Terminal 3 - Agent 3 (Full-Stack)** - Aguardar Agent 1 e Agent 2

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
claude code

# Quando Claude Code carregar:
"Sou o Agent 3 - Full-Stack Developer. Meu roteiro está em .agents/agent-3-fullstack/TODO.md. Verificar COORDINATION.md: se Agent 1 terminou build e Agent 2 tem backend inicial, começar TAREFA 3.1. Senão, começar preparação."
```

---

#### **Terminal 4 - Agent 4 (Content)** - PODE COMEÇAR IMEDIATAMENTE

```bash
cd C:\Users\Vaio\Documents\TRABALHO\INVESTIGA
claude code

# Quando Claude Code carregar:
"Sou o Agent 4 - Content Developer. Meu roteiro está em .agents/agent-4-content/TODO.md. Não tenho dependências. Começar TAREFA 4.1 (post sobre Portal da Transparência) imediatamente!"
```

---

## 📋 CHECKLIST DE INICIALIZAÇÃO

### **Antes de começar:**
- [ ] 4 terminais abertos
- [ ] Git atualizado: `git pull origin main`
- [ ] Dependências instaladas: `npm install` (no investigaree)
- [ ] Ler `.agents/README.md`
- [ ] Ler `.agents/RESUMO_EXECUTIVO.md`

### **Ao iniciar cada agent:**
- [ ] Identificar-se com número e role
- [ ] Indicar arquivo TODO.md correto
- [ ] Verificar COORDINATION.md antes de começar
- [ ] Atualizar próprio STATUS.md

---

## 🎯 ORDEM DE EXECUÇÃO RECOMENDADA

### **FASE 1 - Desbloqueio (Dia 1, primeiras 3 horas)**

**APENAS Agent 1 e Agent 4 trabalhando:**

| Horário | Agent 1 | Agent 4 |
|---------|---------|---------|
| 09:00 | Iniciar TAREFA 1.1 (build fix) | Iniciar TAREFA 4.1 (post 3) |
| 10:00 | Continuando... | Continuando... |
| 11:00 | ✅ Build corrigido! | 50% do post 3 |
| 11:05 | Postar em COORDINATION.md | Continuar trabalhando |
| 11:10 | Iniciar TAREFA 1.2 (deploy) | Continuar trabalhando |

---

### **FASE 2 - Paralelo Total (Dia 1, tarde)**

**Todos os 4 agents trabalhando:**

| Horário | Agent 1 | Agent 2 | Agent 3 | Agent 4 |
|---------|---------|---------|---------|---------|
| 14:00 | TAREFA 1.3 (Firebase Emulator) | TAREFA 2.1 (backend structure) | TAREFA 3.1 (service layer) | TAREFA 4.1 (finalizando post 3) |
| 16:00 | TAREFA 1.4 (executar testes) | TAREFA 2.2 (D1 Database) | TAREFA 3.2 (SERPRO service) | TAREFA 4.2 (post 4) |
| 18:00 | Fim do dia | Fim do dia | Fim do dia | Fim do dia |

---

### **FASE 3 - Ritmo de Cruzeiro (Dia 2+)**

Todos trabalhando em paralelo, seguindo seus respectivos TODO.md, atualizando STATUS.md e COORDINATION.md.

---

## 🔔 NOTIFICAÇÕES IMPORTANTES

### **Agent 1 deve postar em COORDINATION.md quando completar:**
- ✅ TAREFA 1.1 - Build corrigido (CRÍTICO - desbloqueia todos)
- ✅ TAREFA 1.3 - Firebase Emulator (desbloqueia testes de Agent 3)
- ✅ TAREFA 1.6 - Monitoring setup

### **Agent 2 deve postar em COORDINATION.md quando completar:**
- ✅ TAREFA 2.6 - 3 APIs SERPRO core (desbloqueia integração de Agent 3)
- ✅ TAREFA 2.11 - Admin endpoints (desbloqueia Agent 3)
- ✅ TAREFA 2.15 - Backend em produção (milestone!)

### **Agent 3 deve postar em COORDINATION.md quando completar:**
- ✅ TAREFA 3.4 - Admin panel conectado
- ✅ TAREFA 3.8 - 58 testes E2E passando (milestone!)
- ✅ TAREFA 3.6 - Sistema de relatórios PDF

### **Agent 4 deve postar em COORDINATION.md quando completar:**
- ✅ TAREFA 4.8 - Série Fontes Públicas completa (milestone!)
- ✅ TAREFA 4.11 - 3 vídeos prontos
- ✅ TAREFA 4.14 - 3 downloads prontos

---

## 📊 MONITORAMENTO DE PROGRESSO

### **Dani Kaloi deve verificar diariamente:**

**Arquivo:** `.agents/COORDINATION.md`
- Leitura rápida das últimas postagens
- Identificar blockers
- Intervir se necessário

**Arquivos:** `.agents/agent-*/STATUS.md` (4 arquivos)
- Status atual de cada agent
- Progresso percentual
- Blockers ativos

**GitHub commits:**
```bash
git log --oneline --all --graph --since="1 day ago"
```
- Ver commits com prefixos [A1], [A2], [A3], [A4]
- Verificar produtividade de cada agent

---

## 🆘 TROUBLESHOOTING

### **Problema: Agent não sabe por onde começar**

**Solução:**
```
"Leia o arquivo .agents/agent-X-[role]/TODO.md completamente. Depois leia COORDINATION.md para verificar se há blockers. Se não houver blockers, comece pela primeira tarefa pendente. Atualize seu STATUS.md antes de começar."
```

---

### **Problema: Agent está bloqueado**

**Solução:**
1. Agent deve atualizar seu STATUS.md:
   ```markdown
   ## Status: 🔴 BLOCKED
   ## Blockers:
   - Aguardando Agent X completar TAREFA Y
   ```

2. Agent deve postar em COORDINATION.md:
   ```markdown
   ### [2025-12-07 15:30] Agent 3 bloqueado
   - **De:** Agent 3
   - **Para:** Agent 2
   - **Tipo:** BLOCKER
   - **Mensagem:** Não posso integrar dashboard sem backend API. Quando TAREFA 2.11 estiver pronta, me avise.
   ```

3. Agent pode:
   - Trabalhar em outra tarefa não bloqueada
   - Preparar código para quando blocker for resolvido
   - Ajudar outro agent (se possível)

---

### **Problema: Conflito em arquivo compartilhado**

**Solução:**
1. **NUNCA modificar arquivo de outro agent sem coordenação**
2. Se precisa modificar `package.json`:
   - Postar em COORDINATION.md pedindo para Agent 1
   - Agent 1 coordena a mudança
   - Fazer pull antes de continuar

---

### **Problema: Build quebrou novamente**

**Solução:**
1. Identificar qual agent causou (ver último commit)
2. Agent que causou deve:
   - Reverter commit: `git revert HEAD`
   - Ou corrigir imediatamente
   - Postar em COORDINATION.md avisando
3. Agent 1 deve revisar e aprovar correção

---

### **Problema: Testes E2E falhando**

**Solução:**
1. Agent 3 verifica logs: `npm run test:e2e`
2. Se falha é em código novo de Agent 3: corrigir
3. Se falha é por mudança de outro agent:
   - Postar em COORDINATION.md
   - Coordenar com agent responsável
4. Agent 1 monitora para garantir que testes voltam a passar

---

## 📞 COMUNICAÇÃO EFETIVA

### **Formato de mensagem em COORDINATION.md:**

```markdown
### [DATA HORA] Título Curto
- **De:** Agent X
- **Para:** Agent Y / Todos
- **Tipo:** BLOCKER | REVIEW | DESBLOQUEIO | INFO
- **Mensagem:** Detalhes claros e objetivos

**Ação esperada:** O que o destinatário deve fazer
```

### **Exemplo BLOCKER:**
```markdown
### [2025-12-07 14:30] Preciso de Backend API
- **De:** Agent 3
- **Para:** Agent 2
- **Tipo:** BLOCKER
- **Mensagem:** Não consigo integrar dashboard sem endpoints /api/admin/users e /api/admin/tenants

**Ação esperada:** Avisar quando TAREFA 2.11 estiver completa
```

### **Exemplo DESBLOQUEIO:**
```markdown
### [2025-12-07 16:45] Backend API Pronto!
- **De:** Agent 2
- **Para:** Agent 3
- **Tipo:** DESBLOQUEIO
- **Mensagem:** TAREFA 2.11 completa. Backend deployado em https://api.investigaree.com.br
Endpoints disponíveis:
- GET /api/admin/users
- GET /api/admin/tenants
- POST /api/admin/grant-access

**Ação esperada:** Agent 3 pode começar integração (TAREFA 3.4)
```

---

## 🎯 OBJETIVO FINAL

**Ao final das 4 semanas:**

✅ **Agent 1:** Infraestrutura production-ready
✅ **Agent 2:** Backend API 100% funcional
✅ **Agent 3:** Frontend integrado com dados reais
✅ **Agent 4:** Conteúdo completo e otimizado

**Resultado:** Plataforma Investigaree pronta para receber clientes pagantes! 🚀

---

## 📚 DOCUMENTAÇÃO COMPLETA

**Leitura essencial antes de começar:**
1. `.agents/README.md` - Sistema de coordenação
2. `.agents/RESUMO_EXECUTIVO.md` - Visão geral completa
3. `.agents/agent-X-[role]/TODO.md` - Seu roteiro específico
4. `.agents/COORDINATION.md` - Central de comunicação

**Leitura durante o trabalho:**
- Próprio STATUS.md - Atualizar frequentemente
- COORDINATION.md - Ler antes de cada nova tarefa
- STATUS.md dos outros agents - Verificar blocker states

---

**Pronto para começar? Boa sorte, agents! 🚀**

**Criado:** 2025-12-07
**Última atualização:** 2025-12-07 16:15
