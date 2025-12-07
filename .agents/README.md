# Sistema de Coordenação Multi-Agent

## 📋 Overview

Este diretório coordena o trabalho paralelo de 4 Claude Code agents no projeto investigaree.

## 🤖 Agents Ativos

- **Agent 1 (Tech Lead)**: Infraestrutura, Build, CI/CD
- **Agent 2 (Backend Engineer)**: APIs SERPRO, Cloudflare Workers, D1
- **Agent 3 (Full-Stack Developer)**: Frontend Integration, Testes, Relatórios
- **Agent 4 (Content Developer)**: Blog, Vídeos, Materiais Downloadable

## 📁 Estrutura de Isolamento

```
.agents/
├── README.md                    # Este arquivo
├── agent-1-techLead/           # Workspace Agent 1
│   ├── TODO.md                 # Roteiro detalhado
│   ├── STATUS.md               # Status atual
│   └── work/                   # Arquivos temporários
├── agent-2-backend/            # Workspace Agent 2
│   ├── TODO.md
│   ├── STATUS.md
│   └── work/
├── agent-3-fullstack/          # Workspace Agent 3
│   ├── TODO.md
│   ├── STATUS.md
│   └── work/
├── agent-4-content/            # Workspace Agent 4
│   ├── TODO.md
│   ├── STATUS.md
│   └── work/
└── COORDINATION.md             # Comunicação entre agents
```

## 🔒 Regras de Isolamento

### Arquivos Exclusivos (apenas 1 agent por vez):

**Agent 1 - Tech Lead:**
- `.github/workflows/*.yml`
- `playwright.config.ts`
- `firebase.json`
- `next.config.ts`
- `package.json` (coordenado)

**Agent 2 - Backend:**
- `workers/**/*` (novo diretório)
- `wrangler.toml` (novo arquivo)
- `database/schema.sql` (novo)
- `src/lib/serpro/**/*` (novo diretório)

**Agent 3 - Full-Stack:**
- `src/app/api/admin/**/*`
- `src/lib/admin-api.ts`
- `src/components/dashboard/**/*`
- `e2e/**/*`

**Agent 4 - Content:**
- `investigaree/content/blog/**/*`
- `public/videos/**/*` (novo)
- `public/downloads/**/*` (novo)

### Arquivos Compartilhados (requer coordenação):

- `package.json` - Agent 1 coordena, outros solicitam adições
- `src/lib/api.ts` - Agent 2 e 3 coordenam
- `src/app/layout.tsx` - Agent 4 solicita mudanças ao Agent 1

## 📡 Sistema de Comunicação

### STATUS.md de cada agent:
```markdown
## Status: [WORKING | BLOCKED | WAITING | DONE]
## Última atualização: 2025-12-07 14:30

### Trabalhando em:
- Task X (50% completo)

### Blockers:
- Aguardando Agent Y completar Z

### Próximo:
- Task W
```

### COORDINATION.md:
Arquivo central onde agents postam:
- Pedidos de review
- Avisos de mudanças em arquivos compartilhados
- Blockers que afetam outros agents
- Commits importantes

## 🔄 Workflow de Commit

1. **Commits frequentes** com prefixo do agent:
   - `[A1] Fix TypeScript build error`
   - `[A2] Add CPF SERPRO integration`
   - `[A3] Connect dashboard to real API`
   - `[A4] Publish blog post 3 - Portal Transparencia`

2. **Pull antes de push** - sempre verificar mudanças de outros agents

3. **Branches opcionais** (se preferir):
   - `agent-1-infrastructure`
   - `agent-2-backend-apis`
   - `agent-3-frontend-integration`
   - `agent-4-content`

## 🚦 Protocolo de Bloqueio

Se agent precisa de arquivo de outro agent:
1. Postar em `COORDINATION.md`
2. Atualizar próprio `STATUS.md` para BLOCKED
3. Aguardar resposta
4. Continuar com outras tarefas

## ✅ Daily Sync (Virtual)

Agents devem atualizar `STATUS.md` a cada 2 horas ou ao completar tarefa importante.

---

**Criado em:** 2025-12-07
**Última atualização:** 2025-12-07
