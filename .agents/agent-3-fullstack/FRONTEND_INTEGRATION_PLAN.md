# 📋 PLANO COMPLETO DE INTEGRAÇÃO FRONTEND - INVESTIGAREE
## Agent 3 - Full-Stack Developer

**Data:** 2025-12-08
**Status:** 40% integrado (23/57 endpoints)
**Objetivo:** Integrar 100% dos endpoints no frontend

---

## 📊 SITUAÇÃO ATUAL

### ✅ Integrado (23 endpoints - 40%)
- Admin Panel (Users, Tenants, Alerts, Logs) - 18 endpoints
- Dashboard Funcionários - 3 endpoints
- Sistema de Alertas - 2 endpoints

### ⚠️ Service Criado mas Não Usado (27 endpoints - 47%)
- SERPRO APIs (10 endpoints)
- Investigações (5 endpoints)
- Tenants Persistence (8 endpoints)
- Usage Tracking (3 endpoints)
- Admin extras (1 endpoint)

### 🔴 Sem Service (7 endpoints - 13%)
- Health & Status (2 endpoints)
- Exports (5 endpoints em admin.service)

---

## 🎯 ESTRATÉGIA DE IMPLEMENTAÇÃO

### FASE 1: DASHBOARDS DE GESTÃO (8-12 horas)
**Prioridade:** ALTA
**Impacto:** Gestão diária do sistema

#### 1.1 Cost Dashboard (4 horas)
**Endpoints:** 3
**Página:** `/dashboard/custos`

**Componentes a criar:**
```
dashboard/custos/
├── page.tsx (main page)
├── components/
│   ├── CostSummaryCards.tsx (4 cards: total queries, total cost, success rate, avg time)
│   ├── CostByTenantChart.tsx (bar chart)
│   ├── CostByApiChart.tsx (pie chart)
│   ├── CostByUserTable.tsx (VirtualizedTable)
│   ├── CostTimelineChart.tsx (line chart - by_date)
│   ├── ExpensiveQueriesTable.tsx (top 20 most expensive)
│   ├── RealtimeCostMonitor.tsx (24h with polling)
│   └── CostFilters.tsx (period, tenant, api filters)
```

**Service methods a usar:**
- Criar: `lib/services/usage.service.ts`
  - `getUsageStats(filters)` → GET /api/admin/serpro/usage
  - `exportUsageCsv(filters)` → GET /api/admin/serpro/usage/export
  - `getRealtimeUsage()` → GET /api/admin/serpro/usage/realtime (polling 30s)

**Integração:**
```typescript
// app/dashboard/custos/page.tsx
import { getUsageStats, getRealtimeUsage } from '@/lib/services/usage.service';
import { useAsyncPolling } from '@/hooks/useAsync';

export default function CustosPage() {
  const [period, setPeriod] = useState('month');
  const [filters, setFilters] = useState({});

  // Dados principais
  const { data: usage, loading } = useAsync(() =>
    getUsageStats({ period, ...filters })
  );

  // Realtime (polling 30s)
  const { data: realtime } = useAsyncPolling(
    () => getRealtimeUsage(),
    { interval: 30000 }
  );

  // Export CSV
  const handleExport = async () => {
    const blob = await exportUsageCsv({ period, ...filters });
    downloadBlob(blob, `serpro-usage-${period}.csv`);
  };

  return (
    <div className="space-y-6">
      <CostFilters period={period} onPeriodChange={setPeriod} />
      <CostSummaryCards data={usage?.summary} />
      <RealtimeCostMonitor data={realtime} />
      <div className="grid grid-cols-2 gap-6">
        <CostByTenantChart data={usage?.by_tenant} />
        <CostByApiChart data={usage?.by_api} />
      </div>
      <CostTimelineChart data={usage?.by_date} />
      <CostByUserTable data={usage?.by_user} />
      <ExpensiveQueriesTable data={usage?.expensive_queries} />
      <ExportButton onClick={handleExport} />
    </div>
  );
}
```

**Benefícios:**
- 💰 Transparência total de custos SERPRO
- 📊 Identificar picos de consumo
- 👥 Rastrear uso por tenant/usuário
- 📈 Tendências e previsões

---

#### 1.2 Health Monitor Dashboard (2 horas)
**Endpoints:** 2
**Página:** `/dashboard/system/health`

**Componentes a criar:**
```
dashboard/system/
├── health/
│   ├── page.tsx
│   └── components/
│       ├── HealthStatusCard.tsx
│       ├── DatabaseStatusCard.tsx
│       ├── ApiVersionCard.tsx
│       └── UptimeMonitor.tsx (polling 30s)
```

**Service methods a criar:**
- Adicionar em: `lib/services/system.service.ts`
  - `getHealth()` → GET /health
  - `getStatus()` → GET /api/status

**Integração:**
```typescript
// app/dashboard/system/health/page.tsx
import { getHealth, getStatus } from '@/lib/services/system.service';

export default function HealthPage() {
  const { data: health } = useAsyncPolling(
    () => getHealth(),
    { interval: 30000 }
  );

  const { data: status } = useAsync(() => getStatus());

  return (
    <div className="grid grid-cols-3 gap-6">
      <HealthStatusCard status={health?.status} />
      <DatabaseStatusCard dbStatus={health?.checks?.database} />
      <ApiVersionCard version={status?.version} />
      <UptimeMonitor timestamp={health?.timestamp} />
    </div>
  );
}
```

---

#### 1.3 Investigações Dashboard (4 horas)
**Endpoints:** 5
**Página:** `/dashboard/investigacoes`

**Componentes a criar:**
```
dashboard/investigacoes/
├── page.tsx (main list)
├── [id]/
│   └── page.tsx (detail view)
├── nova/
│   └── page.tsx (create form)
└── components/
    ├── InvestigacaoCard.tsx
    ├── InvestigacaoKanban.tsx (drag-drop por status)
    ├── InvestigacaoFilters.tsx (status, categoria, busca)
    ├── InvestigacaoForm.tsx (create/edit)
    ├── InvestigacaoTimeline.tsx (histórico)
    └── InvestigacaoActions.tsx (edit, delete, change status)
```

**Service methods a usar:** (JÁ EXISTEM)
- `criarInvestigacao()` → POST /api/investigacoes
- `listarInvestigacoes()` → GET /api/investigacoes
- `buscarInvestigacao()` → GET /api/investigacoes/:id
- `atualizarInvestigacao()` → PUT /api/investigacoes/:id
- `deletarInvestigacao()` → DELETE /api/investigacoes/:id

**Integração:**
```typescript
// app/dashboard/investigacoes/page.tsx
import { listarInvestigacoes } from '@/lib/services/user-investigacoes.service';

export default function InvestigacoesPage() {
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const { data, loading, refresh } = useAsync(() =>
    listarInvestigacoes(filters)
  );

  if (viewMode === 'kanban') {
    return <InvestigacaoKanban data={data?.investigacoes} />;
  }

  return (
    <div>
      <InvestigacaoFilters filters={filters} onChange={setFilters} />
      <div className="grid grid-cols-3 gap-4">
        {data?.investigacoes.map(inv => (
          <InvestigacaoCard key={inv.id} investigacao={inv} />
        ))}
      </div>
    </div>
  );
}

// app/dashboard/investigacoes/[id]/page.tsx
import { buscarInvestigacao, atualizarInvestigacao } from '@/lib/services/user-investigacoes.service';

export default function InvestigacaoDetailPage({ params }) {
  const { data: investigacao, loading, refresh } = useAsync(() =>
    buscarInvestigacao(params.id)
  );

  const handleStatusChange = async (newStatus) => {
    await atualizarInvestigacao(params.id, { status: newStatus });
    refresh();
  };

  return (
    <div>
      <InvestigacaoTimeline investigacao={investigacao} />
      <InvestigacaoActions
        investigacao={investigacao}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
```

---

#### 1.4 Tenants Dashboard Avançado (2 horas)
**Endpoints:** 8
**Página:** `/dashboard/tenants` (migrar do admin panel)

**Componentes a criar:**
```
dashboard/tenants/
├── page.tsx (list with filters)
├── [id]/
│   └── page.tsx (detail + manage access)
├── novo/
│   └── page.tsx (create form)
└── components/
    ├── TenantCard.tsx (with activate/deactivate)
    ├── TenantForm.tsx (create/edit)
    ├── TenantAccessManager.tsx (grant/revoke access)
    └── TenantStats.tsx (usage, users count)
```

**Service methods a usar:** (JÁ EXISTEM)
- `criarTenant()` → POST /api/tenants
- `listarTenants()` → GET /api/tenants
- `buscarTenant()` → GET /api/tenants/:id
- `atualizarTenant()` → PUT /api/tenants/:id
- `ativarTenant()` → POST /api/tenants/:id/activate
- `desativarTenant()` → POST /api/tenants/:id/deactivate
- `concederAcesso()` → POST /api/tenants/:id/grant-access
- `revogarAcesso()` → POST /api/tenants/:id/revoke-access

**Integração:**
```typescript
// app/dashboard/tenants/page.tsx
import { listarTenants, ativarTenant, desativarTenant } from '@/lib/services/tenants.service';

export default function TenantsPage() {
  const [filters, setFilters] = useState({ status: 'active' });

  const { data, loading, refresh } = useAsync(() =>
    listarTenants(filters)
  );

  const handleToggleStatus = async (tenant: Tenant) => {
    if (tenant.status === 'active') {
      await desativarTenant(tenant.id);
    } else {
      await ativarTenant(tenant.id);
    }
    refresh();
  };

  return (
    <div className="grid grid-cols-3 gap-6">
      {data?.tenants.map(tenant => (
        <TenantCard
          key={tenant.id}
          tenant={tenant}
          onToggleStatus={() => handleToggleStatus(tenant)}
        />
      ))}
    </div>
  );
}

// app/dashboard/tenants/[id]/page.tsx
import { buscarTenant, concederAcesso, revogarAcesso } from '@/lib/services/tenants.service';

export default function TenantDetailPage({ params }) {
  const { data: tenant, refresh } = useAsync(() =>
    buscarTenant(params.id)
  );

  const handleGrantAccess = async (userEmail: string, role: string) => {
    await concederAcesso(params.id, { user_email: userEmail, role });
    refresh();
  };

  return (
    <div>
      <TenantStats tenant={tenant} />
      <TenantAccessManager
        tenant={tenant}
        onGrant={handleGrantAccess}
      />
    </div>
  );
}
```

---

### FASE 2: CONSULTAS SERPRO (8-10 horas)
**Prioridade:** ALTA
**Impacto:** Funcionalidade core do negócio

#### 2.1 Consulta CPF (3 horas)
**Endpoints:** 1
**Página:** `/dashboard/consultas/cpf`

**Componentes a criar:**
```
dashboard/consultas/cpf/
├── page.tsx
└── components/
    ├── CpfSearchForm.tsx (input + validação)
    ├── CpfResultCard.tsx (dados do CPF)
    ├── CpfSituacaoChip.tsx (REGULAR, SUSPENSA, etc)
    ├── CpfHistoryList.tsx (últimas consultas)
    └── CpfBatchUpload.tsx (consulta em lote via CSV)
```

**Service method a usar:** (JÁ EXISTE)
- `serproService.consultarCpf()` → POST /api/serpro/cpf/consultar

**Integração:**
```typescript
// app/dashboard/consultas/cpf/page.tsx
import { serproService } from '@/lib/services/serpro.service';

export default function ConsultaCpfPage() {
  const [cpf, setCpf] = useState('');
  const { data, loading, execute } = useAsyncManual(
    () => serproService.consultarCpf(cpf)
  );

  const handleConsultar = () => {
    if (serproService['validarCpf'](cpf.replace(/\D/g, ''))) {
      execute();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <CpfSearchForm
        cpf={cpf}
        onCpfChange={setCpf}
        onSubmit={handleConsultar}
        loading={loading}
      />

      {data && (
        <CpfResultCard
          nome={data.nome}
          situacao={data.situacao}
          nascimento={data.nascimento}
        />
      )}

      <CpfHistoryList />
    </div>
  );
}
```

**Custo:** R$ 0,50 por consulta

---

#### 2.2 Consulta CNPJ (3 horas)
**Endpoints:** 3
**Página:** `/dashboard/consultas/cnpj`

**Componentes a criar:**
```
dashboard/consultas/cnpj/
├── page.tsx
└── components/
    ├── CnpjSearchForm.tsx (input + tipo de consulta)
    ├── CnpjBasicaCard.tsx (dados básicos)
    ├── CnpjQsaTable.tsx (quadro societário)
    ├── CnpjEmpresaDetail.tsx (dados completos + QSA desmascarado)
    ├── CnpjCostInfo.tsx (mostrar custo de cada tipo)
    └── CnpjHistoryList.tsx
```

**Service methods a usar:** (JÁ EXISTEM)
- `serproService.consultarCnpjBasica()` → GET /api/serpro/cnpj/:cnpj (R$ 0,66)
- `serproService.consultarCnpjQsa()` → GET /api/serpro/cnpj/:cnpj/qsa (R$ 0,88)
- `serproService.consultarCnpjEmpresa()` → GET /api/serpro/cnpj/:cnpj/estabelecimentos (R$ 1,17 - **CPF desmascarado**)

**Integração:**
```typescript
// app/dashboard/consultas/cnpj/page.tsx
import { serproService } from '@/lib/services/serpro.service';

export default function ConsultaCnpjPage() {
  const [cnpj, setCnpj] = useState('');
  const [tipoConsulta, setTipoConsulta] = useState<'basica' | 'qsa' | 'empresa'>('basica');

  const { data, loading, execute } = useAsyncManual(async () => {
    switch(tipoConsulta) {
      case 'basica':
        return serproService.consultarCnpjBasica(cnpj);
      case 'qsa':
        return serproService.consultarCnpjQsa(cnpj);
      case 'empresa':
        return serproService.consultarCnpjEmpresa(cnpj); // CPF desmascarado!
      default:
        return null;
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <CnpjSearchForm
        cnpj={cnpj}
        onCnpjChange={setCnpj}
        tipoConsulta={tipoConsulta}
        onTipoChange={setTipoConsulta}
        onSubmit={execute}
      />

      <CnpjCostInfo tipo={tipoConsulta} />

      {data && tipoConsulta === 'basica' && (
        <CnpjBasicaCard data={data} />
      )}

      {data && tipoConsulta === 'qsa' && (
        <CnpjQsaTable qsa={data.qsa} />
      )}

      {data && tipoConsulta === 'empresa' && (
        <CnpjEmpresaDetail
          data={data}
          cpfDesmascarado={true}
        />
      )}
    </div>
  );
}
```

**Custo:** R$ 0,66 - R$ 1,17 por consulta

---

#### 2.3 Outras Consultas SERPRO (4 horas)
**Endpoints:** 6
**Páginas:**
- `/dashboard/consultas/divida-ativa`
- `/dashboard/consultas/renda`
- `/dashboard/consultas/faturamento`
- `/dashboard/consultas/datavalid`
- `/dashboard/consultas/cnd`

**Estrutura similar para cada:**
```
dashboard/consultas/[tipo]/
├── page.tsx
└── components/
    ├── [Tipo]SearchForm.tsx
    ├── [Tipo]ResultCard.tsx
    └── [Tipo]HistoryList.tsx
```

**Service methods a usar:** (JÁ EXISTEM)
- `serproService.consultarDividaAtiva()` → POST /api/serpro/divida-ativa/consultar
- `serproService.consultarRenda()` → POST /api/serpro/renda
- `serproService.consultarFaturamento()` → POST /api/serpro/faturamento
- `serproService.validarBiometria()` → POST /api/serpro/datavalid/biometria
- `serproService.validarDocumento()` → POST /api/serpro/datavalid/documento
- `serproService.consultarCnd()` → POST /api/serpro/cnd

**Exemplo - Dívida Ativa:**
```typescript
// app/dashboard/consultas/divida-ativa/page.tsx
import { serproService } from '@/lib/services/serpro.service';

export default function DividaAtivaPage() {
  const [ni, setNi] = useState(''); // CPF ou CNPJ

  const { data, loading, execute } = useAsyncManual(
    () => serproService.consultarDividaAtiva(ni)
  );

  return (
    <div>
      <DividaAtivaSearchForm
        ni={ni}
        onNiChange={setNi}
        onSubmit={execute}
      />

      {data && data.dividas && data.dividas.length > 0 ? (
        <div>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Dívidas Encontradas</AlertTitle>
            <AlertDescription>
              {data.dividas.length} dívida(s) ativa(s)
            </AlertDescription>
          </Alert>

          <div className="mt-4 space-y-4">
            {data.dividas.map((divida, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle>{divida.tipo}</CardTitle>
                  <CardDescription>Número: {divida.numero}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Situação: {divida.situacao}</p>
                  <p>Valor: {formatCurrency(divida.valor)}</p>
                  <p>Data Inscrição: {divida.dataInscricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Nenhuma Dívida</AlertTitle>
          <AlertDescription>
            Não foram encontradas dívidas ativas
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

---

### FASE 3: EXPORTS & MELHORIAS (4-6 horas)
**Prioridade:** MÉDIA
**Impacto:** Produtividade e reporting

#### 3.1 Sistema de Export Unificado (3 horas)
**Endpoints:** 5 (admin.service)
**Componentes:**

```
components/exports/
├── ExportDialog.tsx (modal unificado)
├── ExportFormatSelector.tsx (CSV, Excel, PDF)
├── ExportFilters.tsx (date range, filters)
└── ExportHistory.tsx (histórico de exports)
```

**Métodos a integrar:**
- `adminService.exportUsers()` → GET /api/admin/users/export
- `adminService.exportTenants()` → GET /api/admin/tenants/export
- `adminService.exportAuditLogs()` → GET /api/admin/audit-logs/export

**Usar existente:**
- `exportUsageCsv()` → GET /api/admin/serpro/usage/export

**Integração em múltiplas páginas:**
```typescript
// components/exports/ExportDialog.tsx
export function ExportDialog({ type, filters }) {
  const handleExport = async () => {
    let blob;

    switch(type) {
      case 'users':
        blob = await adminService.exportUsers();
        break;
      case 'tenants':
        blob = await adminService.exportTenants();
        break;
      case 'audit-logs':
        blob = await adminService.exportAuditLogs(filters);
        break;
      case 'usage':
        blob = await exportUsageCsv(filters);
        break;
    }

    downloadBlob(blob, `${type}-${Date.now()}.csv`);
  };

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Exportar {type}</DialogTitle>
        </DialogHeader>
        <ExportFormatSelector />
        <ExportFilters />
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// Usar em qualquer página:
// <ExportDialog type="users" />
```

---

#### 3.2 Bulk Operations (3 horas)
**Endpoints:** 1
**Páginas:** Adicionar em `/dashboard/admin/users`

**Componentes:**
```
dashboard/admin/users/
└── components/
    ├── BulkImportDialog.tsx
    ├── BulkImportPreview.tsx
    └── BulkImportProgress.tsx
```

**Service method a usar:**
- `adminService.importUsers()` → POST /api/admin/users/import

**Integração:**
```typescript
// components/admin/BulkImportDialog.tsx
import { adminService } from '@/lib/services/admin.service';

export function BulkImportDialog() {
  const [users, setUsers] = useState<CreateUserRequest[]>([]);
  const { loading, execute } = useAsyncManual(
    () => adminService.importUsers(users)
  );

  const handleFileUpload = (file: File) => {
    // Parse CSV
    const parsed = parseUsersCsv(file);
    setUsers(parsed);
  };

  const handleImport = async () => {
    const result = await execute();
    toast.success(`${result.success} usuários importados!`);
    if (result.failed > 0) {
      toast.error(`${result.failed} falharam`);
    }
  };

  return (
    <Dialog>
      <DialogContent className="max-w-4xl">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <BulkImportPreview users={users} />
        <Button onClick={handleImport} disabled={loading}>
          Importar {users.length} usuários
        </Button>
      </DialogContent>
    </Dialog>
  );
}
```

---

### FASE 4: ADMIN AVANÇADO (4 horas)
**Prioridade:** BAIXA
**Impacto:** Ferramentas internas

#### 4.1 System Config (2 horas)
**Endpoints:** 2 (adminService)
**Página:** `/dashboard/system/config`

**Componentes:**
```
dashboard/system/config/
├── page.tsx
└── components/
    ├── MaintenanceModeToggle.tsx
    ├── SystemConfigForm.tsx
    └── ConfigHistory.tsx
```

**Service methods a usar:** (JÁ EXISTEM)
- `adminService.getSystemConfig()` → GET /api/admin/config
- `adminService.updateSystemConfig()` → PATCH /api/admin/config
- `adminService.enableMaintenanceMode()` (helper)
- `adminService.disableMaintenanceMode()` (helper)

---

#### 4.2 Manual Job Processing (2 horas)
**Endpoints:** 1
**Página:** `/dashboard/admin/jobs/manual`

**Componentes:**
```
dashboard/admin/jobs/manual/
├── page.tsx
└── components/
    ├── ManualProcessButton.tsx
    ├── JobQueueStatus.tsx
    └── ProcessingWarning.tsx (custo SERPRO)
```

**Service method a usar:** (JÁ EXISTE)
- `processarJobs()` → POST /api/admin/process-jobs

**Integração:**
```typescript
// app/dashboard/admin/jobs/manual/page.tsx
import { processarJobs, listarJobs } from '@/lib/services/dados.service';

export default function ManualJobsPage() {
  const { data: jobs, refresh } = useAsync(() => listarJobs('pending'));

  const handleProcess = async () => {
    const confirmed = confirm(
      `Processar ${jobs?.jobs.length} jobs? Isso consumirá créditos SERPRO!`
    );

    if (confirmed) {
      await processarJobs();
      toast.success('Processamento iniciado!');
      refresh();
    }
  };

  return (
    <div>
      <ProcessingWarning />
      <JobQueueStatus jobs={jobs?.jobs || []} />
      <Button onClick={handleProcess} variant="destructive">
        <Zap className="mr-2 h-4 w-4" />
        Processar {jobs?.jobs.length} jobs agora
      </Button>
    </div>
  );
}
```

---

## 📐 ARQUITETURA DE NAVEGAÇÃO

### Nova Estrutura de Menu

```
Dashboard
├── 🏠 Home
├── 👥 Funcionários (existente)
├── 🔍 Consultas (NOVO)
│   ├── CPF
│   ├── CNPJ
│   ├── Dívida Ativa
│   ├── Renda
│   ├── Faturamento
│   ├── DataValid
│   └── CND
├── 📊 Investigações (NOVO)
│   ├── Lista
│   ├── Kanban
│   └── Nova Investigação
├── 🏢 Tenants (NOVO - migrado do admin)
│   ├── Lista
│   ├── Novo Tenant
│   └── [ID] - Detalhes
├── 💰 Custos (NOVO)
│   ├── Overview
│   ├── Por Tenant
│   ├── Por API
│   ├── Por Usuário
│   └── Tempo Real
├── 🔔 Alertas (existente)
├── ⚙️ Sistema (NOVO)
│   ├── Health Monitor
│   ├── Configurações
│   └── Jobs Manuais
└── 👨‍💼 Admin (existente - test-admin-panel)
    ├── Usuários
    ├── Tenants (legacy)
    ├── Alertas
    └── Logs
```

---

## 🗂️ ESTRUTURA DE ARQUIVOS

### Novos arquivos a criar (estimativa: 80+ arquivos)

```
investigaree/src/
├── app/
│   └── dashboard/
│       ├── consultas/              (NOVO - 45 arquivos)
│       │   ├── cpf/
│       │   │   ├── page.tsx
│       │   │   └── components/
│       │   │       ├── CpfSearchForm.tsx
│       │   │       ├── CpfResultCard.tsx
│       │   │       ├── CpfSituacaoChip.tsx
│       │   │       ├── CpfHistoryList.tsx
│       │   │       └── CpfBatchUpload.tsx
│       │   ├── cnpj/
│       │   │   ├── page.tsx
│       │   │   └── components/
│       │   │       ├── CnpjSearchForm.tsx
│       │   │       ├── CnpjBasicaCard.tsx
│       │   │       ├── CnpjQsaTable.tsx
│       │   │       ├── CnpjEmpresaDetail.tsx
│       │   │       ├── CnpjCostInfo.tsx
│       │   │       └── CnpjHistoryList.tsx
│       │   ├── divida-ativa/
│       │   │   ├── page.tsx
│       │   │   └── components/
│       │   ├── renda/
│       │   │   ├── page.tsx
│       │   │   └── components/
│       │   ├── faturamento/
│       │   │   ├── page.tsx
│       │   │   └── components/
│       │   ├── datavalid/
│       │   │   ├── page.tsx
│       │   │   └── components/
│       │   └── cnd/
│       │       ├── page.tsx
│       │       └── components/
│       ├── investigacoes/          (NOVO - 12 arquivos)
│       │   ├── page.tsx
│       │   ├── nova/
│       │   │   └── page.tsx
│       │   ├── [id]/
│       │   │   └── page.tsx
│       │   └── components/
│       │       ├── InvestigacaoCard.tsx
│       │       ├── InvestigacaoKanban.tsx
│       │       ├── InvestigacaoFilters.tsx
│       │       ├── InvestigacaoForm.tsx
│       │       ├── InvestigacaoTimeline.tsx
│       │       └── InvestigacaoActions.tsx
│       ├── tenants/                (NOVO - 10 arquivos)
│       │   ├── page.tsx
│       │   ├── novo/
│       │   │   └── page.tsx
│       │   ├── [id]/
│       │   │   └── page.tsx
│       │   └── components/
│       │       ├── TenantCard.tsx
│       │       ├── TenantForm.tsx
│       │       ├── TenantAccessManager.tsx
│       │       └── TenantStats.tsx
│       ├── custos/                 (NOVO - 10 arquivos)
│       │   ├── page.tsx
│       │   └── components/
│       │       ├── CostSummaryCards.tsx
│       │       ├── CostByTenantChart.tsx
│       │       ├── CostByApiChart.tsx
│       │       ├── CostByUserTable.tsx
│       │       ├── CostTimelineChart.tsx
│       │       ├── ExpensiveQueriesTable.tsx
│       │       ├── RealtimeCostMonitor.tsx
│       │       └── CostFilters.tsx
│       └── system/                 (NOVO - 15 arquivos)
│           ├── health/
│           │   ├── page.tsx
│           │   └── components/
│           ├── config/
│           │   ├── page.tsx
│           │   └── components/
│           └── jobs/
│               └── manual/
│                   ├── page.tsx
│                   └── components/
├── lib/
│   └── services/
│       ├── usage.service.ts        (NOVO)
│       └── system.service.ts       (NOVO)
└── components/
    └── exports/                    (NOVO - 5 arquivos)
        ├── ExportDialog.tsx
        ├── ExportFormatSelector.tsx
        ├── ExportFilters.tsx
        ├── ExportHistory.tsx
        └── BulkImportDialog.tsx
```

**Total estimado:** 97 novos arquivos

---

## ⏱️ ESTIMATIVA DE TEMPO

| Fase | Descrição | Arquivos | Horas | Prioridade |
|------|-----------|----------|-------|------------|
| **FASE 1** | Dashboards de Gestão | 37 | 8-12h | ALTA |
| 1.1 | Cost Dashboard | 10 | 4h | ALTA |
| 1.2 | Health Monitor | 5 | 2h | MÉDIA |
| 1.3 | Investigações | 12 | 4h | ALTA |
| 1.4 | Tenants Avançado | 10 | 2h | MÉDIA |
| **FASE 2** | Consultas SERPRO | 45 | 8-10h | ALTA |
| 2.1 | Consulta CPF | 6 | 3h | ALTA |
| 2.2 | Consulta CNPJ | 7 | 3h | ALTA |
| 2.3 | Outras Consultas | 32 | 4h | MÉDIA |
| **FASE 3** | Exports & Melhorias | 10 | 4-6h | MÉDIA |
| 3.1 | Export Unificado | 5 | 3h | MÉDIA |
| 3.2 | Bulk Operations | 5 | 3h | BAIXA |
| **FASE 4** | Admin Avançado | 5 | 4h | BAIXA |
| 4.1 | System Config | 3 | 2h | BAIXA |
| 4.2 | Manual Jobs | 2 | 2h | BAIXA |
| **TOTAL** | **97 arquivos** | **97** | **24-32h** | - |

---

## 🎯 PRIORIZAÇÃO RECOMENDADA

### 🔴 CRÍTICO (fazer primeiro - 12-16h)
1. **Cost Dashboard** (4h) - Transparência de custos
2. **Consulta CPF** (3h) - Core business
3. **Consulta CNPJ** (3h) - Core business
4. **Investigações** (4h) - Workflow principal

### 🟡 IMPORTANTE (fazer em seguida - 8-12h)
5. **Tenants Avançado** (2h) - Gestão melhor
6. **Outras Consultas SERPRO** (4h) - Completar ofertas
7. **Export Unificado** (3h) - Produtividade

### 🟢 OPCIONAL (fazer quando sobrar tempo - 6-8h)
8. **Health Monitor** (2h) - Ops
9. **Bulk Operations** (3h) - Conveniência
10. **System Config** (2h) - Admin interno
11. **Manual Jobs** (2h) - Debug tool

---

## 📦 DEPENDÊNCIAS

### Pacotes NPM necessários
```json
{
  "dependencies": {
    "react-dnd": "^16.0.1",           // Kanban drag-drop
    "react-dnd-html5-backend": "^16.0.1",
    "recharts": "^2.10.0",            // Charts (JÁ INSTALADO)
    "date-fns": "^3.0.0",             // Date manipulation
    "zod": "^3.22.0",                 // Validation (JÁ INSTALADO)
    "react-hook-form": "^7.49.0"      // Forms (JÁ INSTALADO)
  }
}
```

### Services já criados (reutilizar)
- ✅ `apiClient` - HTTP client
- ✅ `serproService` - 10 métodos SERPRO
- ✅ `adminService` - Admin CRUD
- ✅ `dadosService` - Funcionários + Jobs
- ✅ `tenantsService` - Tenants persistence
- ✅ `userInvestigacoesService` - Investigações CRUD

### Services a criar (2)
- ❌ `usageService` - Usage tracking (3 métodos)
- ❌ `systemService` - Health + Status (2 métodos)

---

## 🚀 ESTRATÉGIA DE IMPLEMENTAÇÃO

### Sprint 1 (1 semana - 16h)
**Objetivo:** Core features funcionando
- Day 1-2: Cost Dashboard (4h) + Consulta CPF (3h) = 7h
- Day 3-4: Consulta CNPJ (3h) + Investigações (4h) = 7h
- Day 5: Buffer + testes (2h)

### Sprint 2 (1 semana - 16h)
**Objetivo:** Completar SERPRO + Tenants
- Day 1-2: Outras Consultas SERPRO (4h) + Tenants (2h) = 6h
- Day 3-4: Export Unificado (3h) + Health Monitor (2h) = 5h
- Day 5: Bulk Operations (3h) + testes (2h) = 5h

### Sprint 3 (opcional - 8h)
**Objetivo:** Admin tools
- Day 1: System Config (2h) + Manual Jobs (2h) = 4h
- Day 2: Polimento + docs (4h)

**Total: 2-3 semanas para 100% de integração**

---

## 📝 CHECKLIST DE IMPLEMENTAÇÃO

### Por Fase

#### ✅ FASE 1: Dashboards
- [ ] 1.1 Cost Dashboard
  - [ ] Criar service: `usage.service.ts`
  - [ ] Criar página: `/dashboard/custos/page.tsx`
  - [ ] Criar 8 componentes de Cost
  - [ ] Integrar 3 endpoints de usage
  - [ ] Adicionar no menu de navegação
  - [ ] Testar polling realtime
- [ ] 1.2 Health Monitor
  - [ ] Criar service: `system.service.ts`
  - [ ] Criar página: `/dashboard/system/health/page.tsx`
  - [ ] Criar 4 componentes de Health
  - [ ] Integrar 2 endpoints de health
  - [ ] Adicionar no menu
- [ ] 1.3 Investigações
  - [ ] Criar página: `/dashboard/investigacoes/page.tsx`
  - [ ] Criar página: `/dashboard/investigacoes/nova/page.tsx`
  - [ ] Criar página: `/dashboard/investigacoes/[id]/page.tsx`
  - [ ] Criar 6 componentes de Investigacao
  - [ ] Integrar 5 endpoints (já existem!)
  - [ ] Adicionar Kanban com drag-drop
  - [ ] Adicionar no menu
- [ ] 1.4 Tenants Avançado
  - [ ] Criar página: `/dashboard/tenants/page.tsx`
  - [ ] Criar página: `/dashboard/tenants/[id]/page.tsx`
  - [ ] Criar 4 componentes de Tenant
  - [ ] Integrar 8 endpoints (já existem!)
  - [ ] Adicionar no menu

#### ✅ FASE 2: Consultas SERPRO
- [ ] 2.1 Consulta CPF
  - [ ] Criar página: `/dashboard/consultas/cpf/page.tsx`
  - [ ] Criar 5 componentes de CPF
  - [ ] Integrar serproService.consultarCpf()
  - [ ] Adicionar validação CPF
  - [ ] Adicionar histórico
  - [ ] Adicionar no menu
- [ ] 2.2 Consulta CNPJ
  - [ ] Criar página: `/dashboard/consultas/cnpj/page.tsx`
  - [ ] Criar 6 componentes de CNPJ
  - [ ] Integrar 3 endpoints de CNPJ
  - [ ] Adicionar seletor de tipo
  - [ ] Mostrar info de custo
  - [ ] Adicionar no menu
- [ ] 2.3 Outras Consultas (6 páginas)
  - [ ] Dívida Ativa
  - [ ] Renda
  - [ ] Faturamento
  - [ ] DataValid (2 endpoints)
  - [ ] CND
  - [ ] Adicionar todas no menu

#### ✅ FASE 3: Exports
- [ ] 3.1 Export Unificado
  - [ ] Criar componente: `ExportDialog.tsx`
  - [ ] Integrar 4 métodos de export
  - [ ] Adicionar em Users page
  - [ ] Adicionar em Tenants page
  - [ ] Adicionar em Logs page
  - [ ] Adicionar em Custos page
- [ ] 3.2 Bulk Operations
  - [ ] Criar componente: `BulkImportDialog.tsx`
  - [ ] Integrar adminService.importUsers()
  - [ ] Adicionar em Users page
  - [ ] CSV parser + preview

#### ✅ FASE 4: Admin
- [ ] 4.1 System Config
  - [ ] Criar página: `/dashboard/system/config/page.tsx`
  - [ ] Integrar getSystemConfig/updateSystemConfig
  - [ ] Toggle maintenance mode
  - [ ] Adicionar no menu
- [ ] 4.2 Manual Jobs
  - [ ] Criar página: `/dashboard/admin/jobs/manual/page.tsx`
  - [ ] Integrar processarJobs()
  - [ ] Adicionar warning de custos
  - [ ] Adicionar no menu

---

## 🧪 TESTES

### Para cada nova página/feature:

1. **Testes manuais:**
   - [ ] Navegação funciona
   - [ ] Loading states corretos
   - [ ] Error handling correto
   - [ ] Success messages funcionam
   - [ ] Responsive (mobile/tablet/desktop)

2. **Testes E2E (adicionar):**
   ```typescript
   // e2e/dashboard/consultas.spec.ts
   test('deve consultar CPF com sucesso', async ({ page }) => {
     await page.goto('/dashboard/consultas/cpf');
     await page.fill('input[name="cpf"]', '12345678900');
     await page.click('button[type="submit"]');
     await expect(page.locator('text=JOSÉ DA SILVA')).toBeVisible();
   });
   ```

3. **Accessibility tests:**
   - [ ] Rodar axe-core em cada nova página
   - [ ] Keyboard navigation funciona
   - [ ] Screen reader friendly

---

## 📊 MÉTRICAS DE SUCESSO

### Ao final da implementação:

| Métrica | Atual | Meta | Status |
|---------|-------|------|--------|
| Endpoints integrados | 23/57 (40%) | 57/57 (100%) | ⏳ |
| Páginas dashboard | 3 | 20+ | ⏳ |
| Services criados | 6/8 | 8/8 | ⏳ |
| Coverage E2E | ~50% | 80%+ | ⏳ |
| Lighthouse Performance | 90+ | 90+ | ✅ |
| Lighthouse Accessibility | 90+ | 95+ | ⏳ |
| Tempo de carregamento | <2s | <2s | ✅ |

---

## 🎓 DOCUMENTAÇÃO NECESSÁRIA

### Para cada nova feature:

1. **README.md** em cada pasta de feature
2. **Storybook stories** para componentes reutilizáveis
3. **API docs** - atualizar com exemplos de uso
4. **User guide** - screenshots + walkthrough
5. **Video tutorial** (opcional) - para features complexas

---

## 🔐 SEGURANÇA

### Checklist de segurança por feature:

- [ ] Validação de input (zod schemas)
- [ ] Sanitização de output
- [ ] Rate limiting no frontend (debounce)
- [ ] Auth check em todas as páginas
- [ ] Role-based access (admin vs user)
- [ ] Não expor secrets no console
- [ ] HTTPS only
- [ ] CSP headers corretos

---

## 💰 IMPACTO DE CUSTOS

### Por feature (custo SERPRO):

| Feature | Custo por uso | Estimativa mensal |
|---------|---------------|-------------------|
| Consulta CPF | R$ 0,50 | Depende volume |
| Consulta CNPJ Básica | R$ 0,66 | Depende volume |
| Consulta CNPJ QSA | R$ 0,88 | Depende volume |
| Consulta CNPJ Empresa | R$ 1,17 | Depende volume |
| Dívida Ativa | R$ 0,32 | Depende volume |
| Outros | Variável | Depende volume |
| **Cache D1 (Dashboard)** | **R$ 0,00** | **Economia R$ 14.690/mês** |

**Estratégia de economia:**
- ✅ Dashboard SEMPRE usa cache D1 (FREE)
- ✅ Consultas manuais pagam SERPRO (necessário)
- ✅ Background jobs controlados (1 req/s)
- ✅ Cost dashboard para monitorar gastos

---

## 📢 COMUNICAÇÃO

### Atualizar após cada fase:

1. **STATUS.md** - progresso do Agent 3
2. **COORDINATION.md** - avisar outros agents
3. **Git commits** - mensagens claras
4. **PR descriptions** - changelog detalhado

---

## 🎯 CONCLUSÃO

Este plano cobre **100% dos 57 endpoints** disponíveis no backend.

**Resumo:**
- ✅ 23 endpoints já integrados (40%)
- 🔄 34 endpoints a integrar (60%)
- 📁 97 novos arquivos a criar
- ⏱️ 24-32 horas de trabalho
- 🗓️ 2-3 semanas para conclusão

**Prioridade:**
1. FASE 1 + FASE 2 (crítico) - 16-22h
2. FASE 3 (importante) - 4-6h
3. FASE 4 (opcional) - 4h

**Resultado final:**
- Sistema 100% integrado
- Interface completa e profissional
- Todas as funcionalidades SERPRO disponíveis
- Gestão completa de tenants e investigações
- Transparência total de custos
- Admin tools completos

---

**Próximo passo:** Escolher qual FASE implementar primeiro e começar!

**Recomendação:** Começar pela FASE 1.1 (Cost Dashboard) para ter visibilidade de custos imediatamente.
