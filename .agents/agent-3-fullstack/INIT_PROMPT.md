# 🚀 AGENT 3 - FULL-STACK DEVELOPER - INIT PROMPT

**Data Atualização:** 2025-12-08 06:35
**Sessão:** Nova (continuação do trabalho)
**Status Backend:** ✅ 100% COMPLETO E OPERACIONAL

---

## 📋 COPIE E COLE ESTE PROMPT NO NOVO CLAUDE CODE

```
Você é o Agent 3 - Full-Stack Developer do projeto Investigaree.

# SITUAÇÃO ATUAL

O Agent 2 (Backend Engineer) COMPLETOU 100% do backend necessário! 🎉

Backend deployado e operacional:
- URL: https://investigaree-api.chatbotimoveis.workers.dev
- Version: 2b32a612-70d2-4a3c-bb37-4984efe9f7be
- Status: ✅ Healthy
- 16 endpoints funcionais (9 SERPRO + 4 dados + 3 usage)
- 10 tabelas D1 (6 admin + 4 dados com cache)
- Migration aplicada
- Documentação completa

VOCÊ NÃO TEM MAIS NENHUM BLOCKER! Pode começar IMEDIATAMENTE! 🚀

# SUA PRÓXIMA TAREFA

**TAREFA 3.5: Conectar Dashboard Módulos ao Backend Real**

Esta é a tarefa CRÍTICA que estava bloqueada esperando o backend.
Agora está 100% desbloqueada!

# PASSO-A-PASSO INICIAL

1. **PRIMEIRO: Ler a documentação do backend**
```bash
cat .agents/agent-2-backend/API_DEPLOYED.md
```

Este arquivo contém:
- TODOS os 16 endpoints disponíveis
- Request/Response examples
- Códigos de exemplo prontos para copiar
- Arquitetura correta (D1 cache vs SERPRO direto)

2. **SEGUNDO: Ver seu roteiro completo**
```bash
cat .agents/agent-3-fullstack/TODO.md
```

3. **TERCEIRO: Ver seu progresso atual**
```bash
cat .agents/agent-3-fullstack/STATUS.md
```

# O QUE VOCÊ PRECISA FAZER (TAREFA 3.5)

## 1. Criar Service de Dados

**Arquivo:** `investigaree/src/lib/services/dados.service.ts`

```typescript
import { apiClient } from '../api-client';

// Lista funcionários com cache SERPRO (FREE - R$ 0,00)
export async function listarFuncionarios(tenantCode: string) {
  return apiClient.get(`/api/admin/tenants/${tenantCode}/funcionarios`);
}

// Import CSV + cria job em background
export async function importarFuncionarios(tenantCode: string, funcionarios: any[]) {
  return apiClient.post('/api/admin/import-funcionarios', {
    tenant_code: tenantCode,
    funcionarios
  });
}

// Lista jobs da fila
export async function listarJobs() {
  return apiClient.get('/api/admin/jobs');
}

// Processa jobs manualmente (para dev/admin)
export async function processarJobs() {
  return apiClient.post('/api/admin/process-jobs');
}
```

## 2. Criar Types

**Arquivo:** `investigaree/src/lib/types/dados.types.ts`

```typescript
export interface Funcionario {
  id: number;
  cpf: string;
  nome: string;
  grupo: string;
  cargo: string;
  salario: number;
  nascimento: string;  // DD/MM/YYYY
  situacao_descricao: string;  // "REGULAR", "SUSPENSA"
  cache_status: 'cached' | 'pending' | 'expired';
  // Flags enriquecidos
  esta_morto: 0 | 1;
  recebe_beneficio: 0 | 1;
  socio_empresa: 0 | 1;
  // ... outros
}

export interface CacheStats {
  cached: number;
  pending: number;
  expired: number;
  percentage: number;
}

export interface Job {
  id: number;
  type: 'consultar_cpf_batch' | 'refresh_cache_cpf';
  tenant_code: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;  // 0-100
  items_total: number;
  items_processed: number;
  items_failed: number;
  created_at: string;
  started_at?: string;
  completed_at?: string;
}
```

## 3. Conectar Página Funcionários

**Arquivo:** `investigaree/src/app/dashboard/funcionarios/page.tsx`

```typescript
import { useAsync } from '@/hooks/useAsync';
import { listarFuncionarios } from '@/lib/services/dados.service';

export default function FuncionariosPage() {
  const { data, isLoading, error } = useAsync(() =>
    listarFuncionarios('CLIENTE_01')  // hardcoded por enquanto
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>Funcionários ({data.total})</h1>

      {/* Cache Stats Badge */}
      <div className="mb-4">
        Cache: {data.cache_stats.cached}/{data.total} ({data.cache_stats.percentage}%)
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>CPF</th>
            <th>Nome</th>
            <th>Grupo</th>
            <th>Cargo</th>
            <th>Situação</th>
            <th>Cache</th>
          </tr>
        </thead>
        <tbody>
          {data.funcionarios.map(f => (
            <tr key={f.id}>
              <td>{f.cpf}</td>
              <td>{f.nome}</td>
              <td>{f.grupo}</td>
              <td>{f.cargo}</td>
              <td>{f.situacao_descricao}</td>
              <td>
                <Badge status={f.cache_status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

# ARQUITETURA CORRETA (MUITO IMPORTANTE!)

## ❌ ERRADO (NÃO FAZER):
```
Dashboard → /api/serpro/cpf/consulta (direto)
Custo: R$ 0,50 por consulta = R$ 14.740-14.950/mês
```

## ✅ CORRETO (IMPLEMENTAR):
```
Dashboard → /api/admin/tenants/:code/funcionarios (cache D1)
Custo: R$ 0,00 (FREE!)
Economia: R$ 14.690/mês
```

**Regra de Ouro:**
- ✅ Dashboard SÓ lê cache D1 via endpoints `/api/admin/*`
- ❌ Dashboard NUNCA chama `/api/serpro/*` direto
- ✅ Upload CSV → cria job → background processa → salva cache

# ENDPOINTS DISPONÍVEIS

## GET /api/admin/tenants/:code/funcionarios
Lista funcionários com cache SERPRO (FREE!)

Response:
```json
{
  "funcionarios": [...],
  "total": 123,
  "cache_stats": {
    "cached": 100,
    "pending": 23,
    "expired": 0,
    "percentage": 81
  }
}
```

## POST /api/admin/import-funcionarios
Import CSV + cria job

Request:
```json
{
  "tenant_code": "CLIENTE_01",
  "funcionarios": [
    { "cpf": "12345678900", "grupo": "COMURG", "cargo": "Auxiliar" }
  ]
}
```

Response:
```json
{
  "success": true,
  "job_created": true,
  "job_id": 1
}
```

## GET /api/admin/jobs
Lista jobs (monitoramento)

Response:
```json
{
  "jobs": [
    {
      "id": 1,
      "type": "consultar_cpf_batch",
      "status": "processing",
      "progress": 45,
      "items_total": 100,
      "items_processed": 45
    }
  ]
}
```

Veja TODOS os endpoints em: `.agents/agent-2-backend/API_DEPLOYED.md`

# RECURSOS JÁ DISPONÍVEIS

Você JÁ criou anteriormente (use-os!):

1. **Hooks:**
   - `useAsync` - `investigaree/src/hooks/useAsync.ts`
   - `usePagination` - `investigaree/src/hooks/usePagination.ts`
   - `useAsyncPolling` - `investigaree/src/hooks/useAsync.ts`

2. **UI Components:**
   - `<LoadingSpinner />` - `components/ui/loading.tsx`
   - `<Skeleton />` - `components/ui/skeleton.tsx`
   - `<EmptyState />` - `components/ui/empty-state.tsx`

3. **API Client:**
   - `apiClient` - `investigaree/src/lib/api-client.ts` (já configurado!)

4. **Service Layer:**
   - `serproService` - `investigaree/src/lib/services/serpro.service.ts`
   - `adminService` - `investigaree/src/lib/services/admin.service.ts`

# CHECKLIST TAREFA 3.5

- [ ] Ler `.agents/agent-2-backend/API_DEPLOYED.md` (OBRIGATÓRIO!)
- [ ] Criar `lib/services/dados.service.ts`
- [ ] Criar `lib/types/dados.types.ts`
- [ ] Conectar `/dashboard/funcionarios` ao endpoint real
- [ ] Exibir cache stats (badge com %)
- [ ] Conectar `/dashboard/vinculos` (similar a funcionários)
- [ ] Testar com dados reais do D1
- [ ] Commit: `[A3] Connect dashboard modules to backend (TAREFA 3.5)`
- [ ] Atualizar STATUS.md

# DOCUMENTAÇÃO COMPLETA

Antes de começar, LEIA:

1. **Backend API Docs:**
   `.agents/agent-2-backend/API_DEPLOYED.md` (PRINCIPAL!)

2. **Backend Status:**
   `.agents/agent-2-backend/STATUS.md`

3. **Seu TODO:**
   `.agents/agent-3-fullstack/TODO.md`

4. **Seu STATUS:**
   `.agents/agent-3-fullstack/STATUS.md`

# SISTEMA DE COMUNICAÇÃO

1. **Atualizar STATUS.md:**
   - A cada tarefa completada
   - Quando encontrar problema
   - No mínimo a cada 2 horas

2. **Commits:**
   - Prefixo: `[A3]`
   - Mensagem clara do que foi feito

3. **Coordenação:**
   - Mensagens para outros agents vão no STATUS.md
   - Agent 2 já completou tudo que você precisa!

# COMEÇAR AGORA

Primeiro comando:
```bash
cat .agents/agent-2-backend/API_DEPLOYED.md
```

Segundo comando:
```bash
cat .agents/agent-3-fullstack/TODO.md
```

Terceiro comando:
```bash
# Criar dados.service.ts baseado na documentação
```

---

✅ BACKEND 100% PRONTO!
✅ DOCUMENTAÇÃO COMPLETA!
✅ NENHUM BLOCKER!
🚀 PODE COMEÇAR IMEDIATAMENTE!
```

---

## 📄 ARQUIVOS PARA LER ANTES DE COMEÇAR

1. `.agents/agent-2-backend/API_DEPLOYED.md` - **OBRIGATÓRIO!**
2. `.agents/agent-3-fullstack/TODO.md`
3. `.agents/agent-3-fullstack/STATUS.md`

---

**Criado:** 2025-12-08 06:35
**Status Backend:** ✅ 100% Completo (Agent 2: 13/15 tarefas - 87%)
**Status Agent 3:** 🟢 Pronto para começar (9/14 tarefas - 64%)
