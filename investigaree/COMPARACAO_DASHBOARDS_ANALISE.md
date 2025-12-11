# COMPARAÇÃO COMPLETA: /dashboard vs /dashboard/admin

**Data:** 11/12/2025
**Usuário Admin:** dkbotdani@gmail.com
**Objetivo:** Identificar todas as alterações full-stack necessárias para harmonizar ambos os dashboards

---

## 📊 VISÃO GERAL

### `/dashboard` (Dashboard Regular do Usuário)
- **Propósito:** Dashboard pessoal focado em investigações do próprio usuário
- **Público:** Todos os usuários autenticados
- **Funcionalidade Principal:** Visualizar e gerenciar as próprias investigações
- **Modo Admin:** Exibe badge "Visão Global (Admin)" quando usuário é admin

### `/dashboard/admin` (Painel Administrativo)
- **Propósito:** Gerenciamento completo do sistema
- **Público:** Apenas dkbotdani@gmail.com
- **Funcionalidade Principal:** Gerenciar usuários, tenants, acessos, alertas, logs de auditoria

---

## 🔍 COMPARAÇÃO DETALHADA

### 1. **HEADER & NAVEGAÇÃO**

| Aspecto | /dashboard | /dashboard/admin |
|---------|------------|------------------|
| **Título** | "Olá, {primeiroNome}!" | "Administração" |
| **Subtítulo** | "Bem-vindo ao seu painel de investigações" (ou texto admin) | "Gerenciar usuários e acessos" |
| **Badge Admin** | ✅ Mostra badge "Visão Global (Admin)" | ✅ Ícone Shield no título |
| **Botões Principais** | "Nova Investigação" | "Atualizar" |
| **Banner Dev Mode** | ❌ Não tem | ⚠️ Tem (mas sempre oculto pois DEV_MODE=false) |

**Observação:** O `/dashboard` detecta se o usuário é admin e mostra badge + carrega dados globais via `getAdminInvestigacoes()`, mas ainda mantém o layout voltado para investigações.

---

### 2. **CARDS DE ESTATÍSTICAS**

#### `/dashboard` - 4 Cards de Investigações
```tsx
<StatCard title="Total" value={total} icon={FolderOpen} color="gold" />
<StatCard title="Em Andamento" value={emAndamento} icon={Clock} color="blue" pulse />
<StatCard title="Relatórios" value={comRelatorio} icon={FileText} color="purple" badge="Novo" />
<StatCard title="Concluídas" value={concluidas} icon={CheckCircle} color="emerald" />
```

**Fonte de Dados (quando admin):**
- `getAdminInvestigacoesStats()` → stats.total, stats.em_andamento, stats.com_relatorio, stats.concluidas

#### `/dashboard/admin` - 4 Cards Administrativos
```tsx
<Card title="Usuários Totais" value={stats.total_users} icon={Users} color="blue" />
<Card title="Tenants Ativos" value={stats.active_tenants} icon={Building2} color="emerald" />
<Card title="Aguardando Liberação" value={stats.pending_users} icon={Clock} color="amber" />
<Card title="Alertas Não Lidos" value={unreadCount} icon={Bell/BellRing} color="red" pulse />
```

**Fonte de Dados:**
- `getAdminStats()` → stats.total_users, stats.active_tenants, stats.pending_users
- `getAdminAlerts()` → unread_count

---

### 3. **CONTEÚDO PRINCIPAL**

#### `/dashboard` - Foco em Investigações
```
┌─────────────────────────────────────┬──────────────────┐
│ Investigações Recentes (2 cols)    │ Ações Rápidas    │
│ - Lista de 5 investigações         │ - Nova Investig. │
│ - Status badges                     │ - Ampliar Escopo │
│ - Tipo (PF/PJ/Grupo)               │ - Reabrir Invest.│
│ - Barra de progresso visual        │ - Meu Perfil     │
│                                     ├──────────────────┤
│                                     │ Fale Conosco     │
│                                     │ - Formulário     │
│                                     │ - Email          │
│                                     │ - WhatsApp       │
└─────────────────────────────────────┴──────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Como funciona o processo (Workflow das Investigações)   │
│ [Aguardando] → [Em Análise] → [Relatório] → ...         │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Modal: Formulário de Contato                             │
│ - Assunto (select)                                       │
│ - Mensagem (textarea)                                    │
└──────────────────────────────────────────────────────────┘
```

**Quando Admin:** Os dados de "Investigações Recentes" vêm de `getAdminInvestigacoes()`, mostrando investigações de TODOS os usuários.

#### `/dashboard/admin` - Foco em Gerenciamento
```
┌──────────────────────────────────────────────────────────┐
│ [Visão Geral] [Alertas] [Usuários e Tenants]            │ <- Tabs
└──────────────────────────────────────────────────────────┘

TAB: Visão Geral
├─ Métricas de Uso (Usage Metrics)
│  ├─ Usuários Ativos (1h, 24h, 7 dias)
│  ├─ Taxa de Crescimento
│  ├─ Taxa de Ativação
│  └─ Distribuição por Role (admin/editor/viewer)
├─ Usuários Pendentes (sem acesso)
│  └─ Botão "Conceder Acesso" → Modal
├─ Tenants
│  ├─ Lista de tenants com user_count
│  ├─ Botão "Criar Tenant" → Modal
│  ├─ Botão "Exportar CSV"
│  └─ Click em tenant → Modal de Detalhes
│      ├─ Modo Visualização (nome, código, status, stats)
│      ├─ Botão "Editar" → Modo Edição
│      ├─ Botão "Ativar/Desativar"
│      └─ Lista de usuários com acesso
├─ Logs de Auditoria
│  ├─ Filtros (action, entityType, limit)
│  ├─ Tabela com logs
│  └─ Auto-load on mount

TAB: Alertas
├─ Filtro: Apenas Não Lidos / Todos
├─ Lista de Alertas
│  ├─ Ícone por tipo (new_user, new_lead, error)
│  ├─ Cor por severity (error, warning, success, info)
│  ├─ Botão "Marcar como Lido"
│  └─ Timestamp relativo
└─ Botão "Marcar Todos como Lidos"

TAB: Usuários e Tenants
├─ Busca/Filtro (debounced 300ms)
├─ Paginação (10, 25, 50, 100 por página)
├─ Tabela de Usuários com Acesso
│  ├─ Colunas: Avatar, Nome/Email, Tenants, Último Acesso, Ações
│  ├─ Botão "Editar" → Modal (✅ implementado)
│  ├─ Botão "Deletar" → Modal de Confirmação (✅ implementado)
│  └─ Lista de tenants com role badges + botão "Revogar"
├─ Botão "Exportar CSV" (✅ implementado)
└─ Seção: Usuários Sem Acesso
   ├─ Lista de usuários que nunca tiveram acesso
   └─ Botão "Conceder Acesso" → Modal
```

---

### 4. **MODAIS IMPLEMENTADOS**

#### `/dashboard` - 1 Modal
- ✅ **Modal de Contato:** Formulário de envio de mensagem

#### `/dashboard/admin` - 6 Modais
- ✅ **Modal de Grant Access:** Conceder acesso user → tenant
- ✅ **Modal de Revoke Access:** Confirmação de revogação
- ✅ **Modal de Criar Tenant:** Form com validação (code, name)
- ✅ **Modal de Detalhes do Tenant:** Visualizar/Editar tenant
- ✅ **Modal de Editar Usuário:** Editar nome e telefone
- ✅ **Modal de Deletar Usuário:** Confirmação com digitação do email

---

### 5. **FUNCIONALIDADES ÚNICAS**

#### Exclusivas do `/dashboard`:
1. **Workflow Visual:** Exibe o fluxo completo das investigações (6 estágios)
2. **Ações Rápidas:** Botões para ampliar escopo, reabrir investigação
3. **Fale Conosco:** Seção com 3 canais de contato (Formulário, Email, WhatsApp)
4. **Barra de Progresso:** Cada investigação tem barra visual de progresso
5. **Tipos de Investigação:** Ícones diferenciados (PF, PJ, Grupo)

#### Exclusivas do `/dashboard/admin`:
1. **User Management:** CRUD completo de usuários
2. **Tenant Management:** CRUD completo de tenants
3. **Access Control:** Grant/Revoke access entre users e tenants
4. **Alerts System:** Centro de notificações do sistema
5. **Audit Logs:** Rastreamento de todas as ações administrativas
6. **Usage Metrics:** Estatísticas de uso e atividade
7. **Bulk Export:** Exportar usuários e tenants para CSV
8. **Search & Pagination:** Busca debounced + paginação avançada

---

## 🚨 PROBLEMAS IDENTIFICADOS

### 1. **DUPLICAÇÃO DE LÓGICA ADMIN NO `/dashboard`**

**Problema:**
O `/dashboard` regular detecta se o usuário é admin e:
- Mostra badge "Visão Global (Admin)"
- Carrega dados de TODAS as investigações via `getAdminInvestigacoes()`
- Mostra mensagem "Painel administrativo - visualizando todas as investigações do sistema"

**Impacto:**
- Usuário admin vê duas interfaces diferentes:
  - `/dashboard` → Foco em investigações globais (mas com layout de dashboard pessoal)
  - `/dashboard/admin` → Foco em gerenciamento de usuários/tenants
- Pode causar confusão sobre qual página usar
- Duplica código de detecção de admin e chamadas de API

**Solução Recomendada:**
1. **Remover lógica admin do `/dashboard`**
2. **Redirecionar admins automaticamente para `/dashboard/admin`**
3. **Criar uma nova tab "Investigações" no `/dashboard/admin`** para visualizar todas as investigações

---

### 2. **FALTAM FUNCIONALIDADES CRÍTICAS**

#### No `/dashboard`:
- ❌ Não há forma de visualizar tenants disponíveis
- ❌ Não há estatísticas de uso pessoal (consultas SERPRO, custos)
- ❌ Não há histórico de ações (audit log pessoal)

#### No `/dashboard/admin`:
- ❌ **Tab de Investigações Globais** não existe
  - Admin não consegue ver lista completa de investigações de todos os usuários
  - Backend já tem endpoint: `GET /api/admin/investigacoes`
  - Backend já tem endpoint: `GET /api/admin/investigacoes/stats`
  - Backend já tem endpoint: `GET /api/admin/dashboard`
- ❌ **Gráficos e Charts** não existem
  - Dados de `getAdminInvestigacoesStats()` retornam:
    - `por_categoria`: Array com count por categoria
    - `por_usuario`: Top 10 usuários mais ativos
    - `por_status`: Count por status
  - Perfeito para gráficos (bar charts, pie charts, line charts)
- ❌ **Dashboard Widgets** (mencionados na pesquisa) não existem

---

### 3. **INCONSISTÊNCIAS DE UI/UX**

| Aspecto | /dashboard | /dashboard/admin |
|---------|------------|------------------|
| **Loading State** | Spinner centralizado | Spinner centralizado |
| **Error State** | Card vermelho com botão "Tentar novamente" | Card vermelho inline |
| **Acesso Negado** | Não aplicável | Card vermelho "Acesso Restrito" |
| **Cores de Cards** | Gold, Blue, Purple, Emerald | Blue, Emerald, Amber, Red |
| **Animações** | Framer Motion em tudo | Framer Motion em tudo |
| **Tabs** | ❌ Não tem | ✅ Tem (3 tabs) |
| **Search** | ❌ Não tem | ✅ Tem (debounced) |
| **Paginação** | ❌ Não tem | ✅ Tem (10/25/50/100) |

**Recomendação:**
Padronizar componentes compartilhados:
- `<EmptyState />` (nenhuma investigação, nenhum usuário)
- `<LoadingSpinner />` (loading states)
- `<ErrorCard />` (error states)
- `<SearchBar />` (busca com debounce)
- `<Pagination />` (navegação de páginas)

---

## 📋 PLANO DE AÇÃO COMPLETO (FULL STACK)

### **FASE 1: Reorganização do Dashboard Admin**

#### 1.1. Adicionar Tab "Investigações" no `/dashboard/admin`

**Frontend:**
```tsx
// Em /dashboard/admin/page.tsx
const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'users' | 'investigations'>('overview');

// Novo tab button
<button onClick={() => setActiveTab('investigations')}>
  Investigações Globais
</button>

// Novo content da tab
{activeTab === 'investigations' && (
  <InvestigationsGlobalView
    stats={investigationsStats}
    investigations={allInvestigations}
  />
)}
```

**Backend:** ✅ Já existe
- `GET /api/admin/investigacoes` → Lista paginada com filtros
- `GET /api/admin/investigacoes/stats` → Estatísticas globais
- `GET /api/admin/dashboard` → Dashboard completo

**API Functions:** ✅ Já existem em `admin-api.ts`
- `getAdminInvestigacoes(filters)` ✅
- `getAdminInvestigacoesStats()` ✅
- `getAdminDashboard()` ✅

---

#### 1.2. Criar Componente `<InvestigationsGlobalView />`

**Estrutura:**
```tsx
<div>
  {/* Stats Cards */}
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    <StatCard title="Total" value={stats.total} />
    <StatCard title="Em Andamento" value={stats.em_andamento} />
    <StatCard title="Com Relatório" value={stats.com_relatorio} />
    <StatCard title="Concluídas" value={stats.concluidas} />
    <StatCard title="Bloqueadas" value={stats.bloqueadas} />
  </div>

  {/* Charts Section */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <PieChart data={stats.por_categoria} title="Por Categoria" />
    <BarChart data={stats.por_status} title="Por Status" />
    <LineChart data={stats.por_usuario} title="Top 10 Usuários" />
  </div>

  {/* Filters */}
  <div className="flex gap-4">
    <select name="status" />
    <select name="categoria" />
    <input type="search" name="busca" />
  </div>

  {/* Table */}
  <InvestigationsTable data={investigations} />

  {/* Pagination */}
  <Pagination total={pagination.total} />
</div>
```

**Bibliotecas de Charts:**
- **Recharts** (já usado no projeto) ✅
- Alternativa: Chart.js, Victory Charts

---

#### 1.3. Remover Lógica Admin do `/dashboard` Regular

**Mudanças:**
```tsx
// ANTES
const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);
useEffect(() => {
  if (isAdmin) {
    // Carregar dados admin
    fetchAdminData();
  }
}, [isAdmin]);

// DEPOIS
// Remover completamente detecção de admin
// Deixar apenas lógica de usuário regular
```

**Benefícios:**
- Dashboard pessoal foca 100% nas investigações do usuário
- Admin usa `/dashboard/admin` exclusivamente
- Menos confusão, menos código duplicado

**Alternativa (se quiser manter badge):**
```tsx
// Apenas mostrar badge + link
{isAdmin && (
  <Link href="/dashboard/admin">
    <Badge>
      <Shield className="w-3.5 h-3.5" />
      Painel Admin
    </Badge>
  </Link>
)}
```

---

### **FASE 2: Harmonização de UI/UX**

#### 2.1. Criar Componentes Compartilhados

**Localização:** `src/components/dashboard/` (novo diretório)

**Componentes:**
```
src/components/dashboard/
├── EmptyState.tsx
├── LoadingSpinner.tsx
├── ErrorCard.tsx
├── SearchBar.tsx (com debounce)
├── Pagination.tsx
├── StatCard.tsx (unificar os dois)
└── ExportCSVButton.tsx
```

#### 2.2. Padronizar Cards de Estatísticas

**Problema Atual:**
- `/dashboard` tem `StatCard` interno
- `/dashboard/admin` tem cards inline sem componente

**Solução:**
```tsx
// src/components/dashboard/StatCard.tsx
export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  href,
  pulse = false,
  badge,
  onClick
}: StatCardProps) {
  // Implementação unificada
}
```

**Uso:**
```tsx
// Em /dashboard/page.tsx
<StatCard title="Total" value={stats.total} icon={FolderOpen} href="/dashboard/investigacoes" />

// Em /dashboard/admin/page.tsx
<StatCard title="Usuários Totais" value={stats.total_users} icon={Users} onClick={() => setActiveTab('users')} />
```

---

#### 2.3. Implementar SearchBar Universal

**Features:**
- Debounce de 300ms (já implementado no admin)
- Ícone de search
- Clear button (X)
- Placeholder customizável
- onChange com value debounced

```tsx
// src/components/dashboard/SearchBar.tsx
export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar...",
  debounceMs = 300
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(internalValue);
      onChange(internalValue);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [internalValue, debounceMs, onChange]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input
        type="search"
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-navy-800 border border-navy-600 rounded-lg"
      />
      {internalValue && (
        <button onClick={() => setInternalValue("")} className="absolute right-3 top-1/2 -translate-y-1/2">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
```

**Uso:**
```tsx
// Em /dashboard/investigacoes/page.tsx
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Buscar por nome, documento..."
/>

// Em /dashboard/admin/page.tsx (já tem implementação similar)
<SearchBar
  value={searchQuery}
  onChange={setSearchQuery}
  placeholder="Buscar usuários..."
/>
```

---

### **FASE 3: Adicionar Funcionalidades Faltantes**

#### 3.1. Dashboard Pessoal: Estatísticas de Uso SERPRO

**Backend:** ❌ Endpoint não existe

**Necessário Criar:**
```typescript
// backend/workers/api/src/routes/serpro.routes.ts
router.get('/usage/personal', authMiddleware, async (c) => {
  const userId = c.get('userId');

  // Buscar uso SERPRO do usuário nos últimos 30 dias
  const { results } = await c.env.DB.prepare(`
    SELECT
      api_name,
      COUNT(*) as count,
      SUM(cost) as total_cost,
      AVG(response_time_ms) as avg_response_time
    FROM serpro_usage
    WHERE user_id = ? AND created_at >= date('now', '-30 days')
    GROUP BY api_name
  `).bind(userId).all();

  return c.json({
    success: true,
    usage: results,
    period: '30_days'
  });
});
```

**Frontend:**
```tsx
// src/hooks/usePersonalUsage.ts
export function usePersonalUsage() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAPI('/api/serpro/usage/personal')
      .then(data => setUsage(data.usage))
      .finally(() => setLoading(false));
  }, []);

  return { usage, loading };
}
```

```tsx
// src/app/dashboard/page.tsx
const { usage } = usePersonalUsage();

<div className="bg-navy-900 rounded-xl p-6">
  <h3>Meu Uso (Últimos 30 dias)</h3>
  <div className="grid grid-cols-2 gap-4">
    <div>
      <p className="text-2xl font-bold">{usage?.total_queries || 0}</p>
      <p className="text-sm text-navy-400">Consultas</p>
    </div>
    <div>
      <p className="text-2xl font-bold">R$ {usage?.total_cost?.toFixed(2) || '0.00'}</p>
      <p className="text-sm text-navy-400">Custo Total</p>
    </div>
  </div>
  <BarChart data={usage?.by_api} />
</div>
```

---

#### 3.2. Admin: Gráficos e Charts na Tab de Investigações

**Dados Disponíveis (do backend):**
```typescript
// Retorno de GET /api/admin/investigacoes/stats
{
  total: 150,
  em_andamento: 45,
  com_relatorio: 30,
  concluidas: 60,
  bloqueadas: 15,
  por_categoria: [
    { categoria: 'familia', count: 40 },
    { categoria: 'clientes', count: 35 },
    { categoria: 'funcionarios', count: 30 },
    { categoria: 'empresas', count: 25 },
    { categoria: 'relacionamentos', count: 20 }
  ],
  por_usuario: [
    { email: 'user1@example.com', name: 'João', count: 25 },
    { email: 'user2@example.com', name: 'Maria', count: 20 },
    // ... top 10
  ]
}
```

**Charts a Implementar:**

1. **Pie Chart - Distribuição por Categoria**
```tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#ec4899', '#3b82f6', '#10b981', '#a855f7', '#f59e0b'];

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={stats.por_categoria}
      cx="50%"
      cy="50%"
      labelLine={false}
      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
      outerRadius={80}
      fill="#8884d8"
      dataKey="count"
    >
      {stats.por_categoria.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>
</ResponsiveContainer>
```

2. **Bar Chart - Top 10 Usuários Mais Ativos**
```tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={stats.por_usuario}>
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
    <XAxis dataKey="name" stroke="#94a3b8" />
    <YAxis stroke="#94a3b8" />
    <Tooltip
      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
    />
    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

3. **Horizontal Bar Chart - Distribuição por Status**
```tsx
<ResponsiveContainer width="100%" height={250}>
  <BarChart data={stats.por_status} layout="horizontal">
    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
    <XAxis type="number" stroke="#94a3b8" />
    <YAxis type="category" dataKey="status" stroke="#94a3b8" />
    <Tooltip
      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
    />
    <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
  </BarChart>
</ResponsiveContainer>
```

---

### **FASE 4: Melhorias de Performance e UX**

#### 4.1. Lazy Loading de Tabs no Admin

**Problema:** Todas as tabs carregam dados no mount, mesmo tabs não visualizadas.

**Solução:**
```tsx
// ANTES
useEffect(() => {
  if (isAdmin) {
    loadData(); // Carrega TUDO
  }
}, [isAdmin]);

// DEPOIS
useEffect(() => {
  if (!isAdmin) return;

  switch(activeTab) {
    case 'overview':
      loadOverviewData();
      break;
    case 'alerts':
      loadAlertsData();
      break;
    case 'users':
      loadUsersData();
      break;
    case 'investigations':
      loadInvestigationsData();
      break;
  }
}, [isAdmin, activeTab]);
```

---

#### 4.2. Skeleton Loading States

**Problema:** Spinner centralizado cobre toda a tela durante loading.

**Solução:** Skeleton screens por seção

```tsx
// src/components/dashboard/SkeletonCard.tsx
export function SkeletonCard() {
  return (
    <div className="bg-navy-900 border border-navy-700 rounded-xl p-4 animate-pulse">
      <div className="h-8 bg-navy-800 rounded w-20 mb-2" />
      <div className="h-6 bg-navy-800 rounded w-32" />
    </div>
  );
}

// src/components/dashboard/SkeletonTable.tsx
export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 bg-navy-800 rounded animate-pulse" />
      ))}
    </div>
  );
}
```

**Uso:**
```tsx
{loading ? (
  <div className="grid grid-cols-4 gap-4">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
) : (
  <div className="grid grid-cols-4 gap-4">
    {statsCards}
  </div>
)}
```

---

#### 4.3. Virtualized Lists para Tabelas Grandes

**Problema:** Renderizar 1000+ usuários/investigações pode travar a interface.

**Solução:** React Virtuoso ou React Window

```bash
npm install react-virtuoso
```

```tsx
import { Virtuoso } from 'react-virtuoso';

<Virtuoso
  data={filteredUsers}
  itemContent={(index, user) => (
    <UserRow user={user} key={user.id} />
  )}
  style={{ height: '600px' }}
/>
```

---

### **FASE 5: Testes e Refinamentos**

#### 5.1. Testes de Integração

**Cenários a Testar:**
1. ✅ Admin acessa `/dashboard` → Redireciona para `/dashboard/admin`
2. ✅ Admin acessa `/dashboard/admin` → Carrega overview tab
3. ✅ Admin muda para tab "Investigações" → Carrega dados globais
4. ✅ Admin filtra investigações por status → Atualiza lista
5. ✅ Admin busca usuário → Debounce funciona
6. ✅ Admin edita usuário → Modal abre, salva, recarrega
7. ✅ Admin deleta usuário → Modal confirmação, digita email, deleta
8. ✅ Admin cria tenant → Validação, salva, recarrega
9. ✅ Admin edita tenant → Modal, salva, recarrega
10. ✅ Admin exporta CSV → Download funciona

#### 5.2. Testes de Performance

**Métricas:**
- Time to Interactive (TTI): < 3 segundos
- First Contentful Paint (FCP): < 1.5 segundos
- Largest Contentful Paint (LCP): < 2.5 segundos
- Cumulative Layout Shift (CLS): < 0.1

**Ferramentas:**
- Lighthouse CI
- Chrome DevTools Performance
- React DevTools Profiler

---

## 🎯 PRIORIZAÇÃO FINAL

### 🔴 **Prioridade ALTA** (Fazer Primeiro)

1. **Adicionar Tab "Investigações" no `/dashboard/admin`**
   - Backend: ✅ Já existe
   - Frontend: Criar `<InvestigationsGlobalView />`
   - Tempo estimado: ~4h

2. **Implementar Charts/Gráficos**
   - PieChart (por categoria)
   - BarChart (top usuários)
   - BarChart (por status)
   - Tempo estimado: ~3h

3. **Padronizar Componentes Compartilhados**
   - `StatCard`, `SearchBar`, `Pagination`
   - Tempo estimado: ~2h

**Total Prioridade Alta: ~9 horas**

---

### 🟡 **Prioridade MÉDIA** (Depois)

4. **Remover lógica admin do `/dashboard`**
   - Simplificar para foco pessoal
   - Tempo estimado: ~1h

5. **Adicionar Estatísticas de Uso Pessoal**
   - Endpoint backend novo
   - Card no dashboard pessoal
   - Tempo estimado: ~2h

6. **Skeleton Loading States**
   - Componentes de skeleton
   - Aplicar em ambos dashboards
   - Tempo estimado: ~2h

**Total Prioridade Média: ~5 horas**

---

### 🟢 **Prioridade BAIXA** (Nice to Have)

7. **Lazy Loading de Tabs**
   - Otimizar carregamento
   - Tempo estimado: ~1h

8. **Virtualized Lists**
   - Para tabelas grandes
   - Tempo estimado: ~2h

9. **Testes Automatizados**
   - E2E tests com Playwright
   - Tempo estimado: ~4h

**Total Prioridade Baixa: ~7 horas**

---

## 📊 RESUMO EXECUTIVO

### Situação Atual
- ✅ `/dashboard/admin` está 95% funcional
- ⚠️ `/dashboard` tem lógica admin duplicada
- ❌ Faltam gráficos e visualizações
- ❌ Falta tab de investigações globais no admin
- ⚠️ Componentes não são reutilizáveis

### Após Implementação
- ✅ Admin usa **apenas** `/dashboard/admin`
- ✅ Dashboard pessoal é 100% focado no usuário
- ✅ Componentes compartilhados = menos código
- ✅ Gráficos e charts para insights visuais
- ✅ Tab de investigações globais completa
- ✅ Performance otimizada

### Esforço Total
- **Alta Prioridade:** 9 horas
- **Média Prioridade:** 5 horas
- **Baixa Prioridade:** 7 horas
- **TOTAL:** ~21 horas (≈ 2.5 dias de trabalho)

---

**Próximo Passo:** Aguardando aprovação do usuário para iniciar implementação. Sugestão: começar pela Prioridade Alta (Tab de Investigações + Charts).
