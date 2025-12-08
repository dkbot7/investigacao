# 📊 KANBAN COMO FONTE ÚNICA DA VERDADE - INTEGRAÇÃO COMPLETA
## Agent 3 - Full-Stack Developer

**Data:** 2025-12-08
**Componente Existente:** `investigaree/src/components/dashboard/KanbanView.tsx`
**Objetivo:** Integrar TODOS os endpoints e funcionalidades ao Kanban existente

---

## 🎯 FILOSOFIA: KANBAN = FONTE ÚNICA DA VERDADE

O Kanban existente em `/dashboard/funcionarios` já implementa o workflow de investigação com 6 colunas:

```
┌─────────────┬──────────────┬───────────┬────────────────┬──────────┬───────────┐
│ Investigar  │ Investigando │ Relatório │ Monitoramento │ Aprovado │ Bloqueado │
│   (Clock)   │   (Shield)   │  (User✓)  │   (Shield)    │  (User✓) │  (Alert)  │
└─────────────┴──────────────┴───────────┴────────────────┴──────────┴───────────┘
```

**Status no DB:** `status_investigacao` field (já existe!)

---

## 🔄 INTEGRAÇÃO COMPLETA - TODOS OS ENDPOINTS NO KANBAN

### Princípio: **Tudo é uma investigação**

Cada card no Kanban pode representar:
- ✅ Funcionário individual (já existe)
- ✅ Grupo de análise em lote (já existe)
- 🆕 Consulta SERPRO (CPF, CNPJ, Dívida, etc)
- 🆕 Investigação customizada (pessoa/empresa)
- 🆕 Monitoramento contínuo
- 🆕 Relatório gerado

**Todos** compartilham o mesmo workflow Kanban de 6 colunas!

---

## 📋 PLANO DE INTEGRAÇÃO POR ENDPOINT

### **FASE 1: SERPRO APIs → KANBAN**

#### 1.1 Consulta CPF → Card no Kanban

**Endpoint:** POST `/api/serpro/cpf/consultar`
**Service:** `serproService.consultarCpf()`

**Fluxo:**
1. User consulta CPF em `/dashboard/consultas/cpf`
2. Resultado da consulta cria **automaticamente** card no Kanban
3. Card inicia na coluna **"Investigando"**
4. User pode mover para outras colunas conforme progride

**Estrutura do Card:**
```typescript
{
  id: "cpf-12345678900-001",
  tipo: "consulta_cpf",
  nome: "JOSÉ DA SILVA", // do resultado SERPRO
  cpf: "12345678900",
  status_investigacao: "investigando", // Kanban column
  metadata: {
    situacao: "REGULAR",
    nascimento: "01/01/1980",
    consultado_em: "2025-12-08T10:30:00Z",
    custo: 0.50
  }
}
```

**Implementação:**
```typescript
// app/dashboard/consultas/cpf/page.tsx
const handleConsultar = async () => {
  // 1. Consultar SERPRO
  const resultado = await serproService.consultarCpf(cpf);

  // 2. Criar investigação no Kanban
  await criarInvestigacao({
    nome: resultado.nome,
    documento: cpf,
    tipo_pessoa: 'fisica',
    categoria: 'consulta_serpro',
    status: 'investigando', // Coluna inicial
    metadata: {
      api: 'cpf',
      situacao: resultado.situacao,
      nascimento: resultado.nascimento,
      custo: 0.50
    }
  });

  // 3. Redirecionar para Kanban
  router.push('/dashboard/funcionarios?view=kanban&highlight=cpf-' + cpf);
  toast.success('Consulta adicionada ao Kanban!');
};
```

**Backend necessário:**
- ✅ Endpoint SERPRO já existe
- 🆕 Adicionar campo `tipo` na tabela `investigacoes` (cpf, cnpj, funcionario, custom)
- 🆕 Adicionar campo `metadata` JSON na tabela `investigacoes`

---

#### 1.2 Consulta CNPJ → Card no Kanban

**Endpoints:**
- GET `/api/serpro/cnpj/:cnpj` (básica - R$ 0,66)
- GET `/api/serpro/cnpj/:cnpj/qsa` (QSA - R$ 0,88)
- GET `/api/serpro/cnpj/:cnpj/estabelecimentos` (completa - R$ 1,17)

**Fluxo igual ao CPF**, mas card mostra:
```typescript
{
  id: "cnpj-12345678000195-001",
  tipo: "consulta_cnpj",
  nome: "EMPRESA EXEMPLO LTDA",
  documento: "12345678000195",
  status_investigacao: "investigando",
  metadata: {
    razao_social: "EMPRESA EXEMPLO LTDA",
    cnae: "62.01-5-00",
    qsa: [...], // se consultou QSA
    cpf_socios: [...], // se consultou empresa completa
    tipo_consulta: "empresa", // basica | qsa | empresa
    custo: 1.17
  }
}
```

**Badge especial no card:**
```tsx
<Badge variant="blue">
  <Building2 className="w-3 h-3" />
  CNPJ - {tipoConsulta.toUpperCase()}
</Badge>
```

---

#### 1.3 Outras Consultas SERPRO → Kanban

**Dívida Ativa, Renda, Faturamento, DataValid, CND**

Todas seguem o mesmo padrão:
1. User faz consulta
2. Resultado cria card no Kanban
3. Card mostra dados específicos da API
4. User move card pelo workflow

**Exemplo - Dívida Ativa:**
```typescript
{
  id: "divida-12345678900-001",
  tipo: "consulta_divida_ativa",
  nome: "JOSÉ DA SILVA",
  documento: "12345678900",
  status_investigacao: "bloqueado", // vai direto para bloqueado se tiver dívida!
  metadata: {
    dividas: [
      { tipo: "IRPF", valor: 5000, situacao: "ATIVA" }
    ],
    total_dividas: 5000,
    custo: 0.32
  }
}
```

**Badge de alerta:**
```tsx
{metadata.dividas?.length > 0 && (
  <Badge variant="destructive">
    <AlertTriangle className="w-3 h-3" />
    {metadata.dividas.length} dívida(s) - R$ {metadata.total_dividas}
  </Badge>
)}
```

---

### **FASE 2: INTEGRAR COST TRACKING NO KANBAN**

#### 2.1 Badge de Custo em Cada Card

**Endpoints:**
- GET `/api/admin/serpro/usage` (já existe)
- GET `/api/admin/serpro/usage/realtime` (já existe)

**Implementação:**
```typescript
// components/dashboard/KanbanView.tsx
<div className="flex items-center justify-between text-xs text-slate-500 mt-2">
  <span>Consultado em {formatDate(metadata.consultado_em)}</span>
  <Badge variant="outline">
    <DollarSign className="w-3 h-3" />
    R$ {metadata.custo.toFixed(2)}
  </Badge>
</div>
```

**Total por coluna:**
```tsx
// No header de cada coluna
<div className="flex items-center gap-2 mt-1">
  <span className="text-xs text-slate-500">
    {columnFuncionarios.length} cards
  </span>
  <span className="text-xs text-emerald-400">
    R$ {calculateColumnCost(columnFuncionarios).toFixed(2)}
  </span>
</div>
```

**Total geral (acima do Kanban):**
```tsx
<div className="bg-slate-100 dark:bg-navy-800 p-4 rounded-lg mb-4">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="font-semibold text-lg">Total de Investigações</h3>
      <p className="text-sm text-slate-500">
        {funcionarios.length} casos ativos
      </p>
    </div>
    <div className="text-right">
      <p className="text-2xl font-bold text-emerald-400">
        R$ {calculateTotalCost(funcionarios).toFixed(2)}
      </p>
      <p className="text-xs text-slate-500">Custo total SERPRO</p>
    </div>
  </div>
</div>
```

---

### **FASE 3: DRAG & DROP ENTRE COLUNAS = UPDATE STATUS**

#### 3.1 Implementar Drag & Drop Real

**Pacote:** `react-dnd` (já listado nas dependências)

**Implementação:**
```bash
npm install react-dnd react-dnd-html5-backend
```

```typescript
// components/dashboard/KanbanView.tsx
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Wrapper do Kanban
export function KanbanView({ funcionarios, onSelectFuncionario }: KanbanViewProps) {
  const [items, setItems] = useState(funcionarios);

  const handleDrop = async (itemId: string, newStatus: InvestigationStatus) => {
    // 1. Atualizar UI otimisticamente
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, status_investigacao: newStatus } : item
    ));

    // 2. Atualizar no backend
    try {
      await atualizarInvestigacao(itemId, { status: newStatus });
      toast.success(`Movido para ${newStatus}`);
    } catch (error) {
      toast.error('Erro ao atualizar status');
      // Rollback
      setItems(funcionarios);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {/* Kanban columns com drop zones */}
      {columns.map(column => (
        <KanbanColumn
          key={column.id}
          column={column}
          items={items.filter(i => i.status_investigacao === column.id)}
          onDrop={handleDrop}
        />
      ))}
    </DndProvider>
  );
}

// Card draggable
function KanbanCard({ item }: { item: Funcionario }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'INVESTIGATION',
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {/* Card content */}
    </div>
  );
}

// Column drop zone
function KanbanColumn({ column, items, onDrop }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'INVESTIGATION',
    drop: (item: { id: string }) => onDrop(item.id, column.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className={isOver ? 'bg-blue-500/10' : ''}>
      {/* Column content */}
    </div>
  );
}
```

**Backend necessário:**
- ✅ Endpoint já existe: `PUT /api/investigacoes/:id` (atualizarInvestigacao)
- ✅ Apenas atualizar campo `status`

---

### **FASE 4: AÇÕES RÁPIDAS NO CARD**

#### 4.1 Menu de Ações (Hover)

```tsx
// components/dashboard/KanbanCard.tsx
<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {/* Consultar novamente (se expirou cache) */}
      <DropdownMenuItem onClick={() => handleReconsultar(item)}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Consultar novamente
      </DropdownMenuItem>

      {/* Gerar relatório */}
      <DropdownMenuItem onClick={() => handleGerarRelatorio(item)}>
        <FileText className="w-4 h-4 mr-2" />
        Gerar relatório PDF
      </DropdownMenuItem>

      {/* Ver histórico de consultas */}
      <DropdownMenuItem onClick={() => handleVerHistorico(item)}>
        <History className="w-4 h-4 mr-2" />
        Ver histórico
      </DropdownMenuItem>

      {/* Adicionar observação */}
      <DropdownMenuItem onClick={() => handleAdicionarObs(item)}>
        <MessageSquare className="w-4 h-4 mr-2" />
        Adicionar observação
      </DropdownMenuItem>

      {/* Mover para... (submenu) */}
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <ArrowRight className="w-4 h-4 mr-2" />
          Mover para...
        </DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          {columns.map(col => (
            <DropdownMenuItem onClick={() => handleMoverPara(item, col.id)}>
              {col.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuSub>

      <DropdownMenuSeparator />

      {/* Arquivar */}
      <DropdownMenuItem onClick={() => handleArquivar(item)}>
        <Archive className="w-4 h-4 mr-2" />
        Arquivar
      </DropdownMenuItem>

      {/* Deletar (danger) */}
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => handleDeletar(item)}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Deletar
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>
```

---

### **FASE 5: FILTROS AVANÇADOS NO KANBAN**

#### 5.1 Barra de Filtros Acima do Kanban

```tsx
// app/dashboard/funcionarios/page.tsx (acima do Kanban)
<div className="bg-white dark:bg-navy-900 p-4 rounded-lg mb-4 space-y-4">
  {/* Linha 1: Busca + Tipo */}
  <div className="flex gap-4">
    <Input
      placeholder="Buscar por nome, CPF, CNPJ..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1"
    />
    <Select value={tipoFilter} onValueChange={setTipoFilter}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Tipo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos os tipos</SelectItem>
        <SelectItem value="funcionario">Funcionários</SelectItem>
        <SelectItem value="consulta_cpf">Consultas CPF</SelectItem>
        <SelectItem value="consulta_cnpj">Consultas CNPJ</SelectItem>
        <SelectItem value="custom">Investigações</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Linha 2: Filtros específicos */}
  <div className="flex gap-4">
    {/* Data range */}
    <DateRangePicker
      from={dateFrom}
      to={dateTo}
      onSelect={(range) => {
        setDateFrom(range?.from);
        setDateTo(range?.to);
      }}
    />

    {/* Custo range */}
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">Custo:</span>
      <Input
        type="number"
        placeholder="Min"
        value={custoMin}
        onChange={(e) => setCustoMin(e.target.value)}
        className="w-24"
      />
      <span>-</span>
      <Input
        type="number"
        placeholder="Max"
        value={custoMax}
        onChange={(e) => setCustoMax(e.target.value)}
        className="w-24"
      />
    </div>

    {/* Alertas */}
    <Select value={alertaFilter} onValueChange={setAlertaFilter}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Alertas" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todos">Todos</SelectItem>
        <SelectItem value="obito">Óbito</SelectItem>
        <SelectItem value="divida">Com dívida</SelectItem>
        <SelectItem value="sancionado">Sancionado</SelectItem>
        <SelectItem value="candidato">Candidato</SelectItem>
        <SelectItem value="socio">Sócio</SelectItem>
      </SelectContent>
    </Select>

    {/* Clear filters */}
    <Button variant="ghost" onClick={handleClearFilters}>
      <X className="w-4 h-4 mr-2" />
      Limpar
    </Button>
  </div>
</div>
```

---

### **FASE 6: ESTATÍSTICAS DO KANBAN**

#### 6.1 Dashboard de Métricas Acima do Kanban

```tsx
<div className="grid grid-cols-4 gap-4 mb-4">
  {/* Total de investigações */}
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Total</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{funcionarios.length}</div>
      <p className="text-xs text-slate-500">investigações ativas</p>
    </CardContent>
  </Card>

  {/* Custo total */}
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Custo SERPRO</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-emerald-400">
        R$ {calculateTotalCost(funcionarios).toFixed(2)}
      </div>
      <p className="text-xs text-slate-500">este mês</p>
    </CardContent>
  </Card>

  {/* Taxa de aprovação */}
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Taxa Aprovação</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-blue-400">
        {calculateApprovalRate(funcionarios).toFixed(1)}%
      </div>
      <p className="text-xs text-slate-500">
        {countByStatus('aprovado')} aprovados
      </p>
    </CardContent>
  </Card>

  {/* Alertas críticos */}
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">Alertas</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-red-400">
        {countCriticalAlerts(funcionarios)}
      </div>
      <p className="text-xs text-slate-500">
        bloqueados + dívidas
      </p>
    </CardContent>
  </Card>
</div>
```

---

### **FASE 7: BULK ACTIONS NO KANBAN**

#### 7.1 Seleção Múltipla + Ações em Lote

```tsx
// State
const [selectedCards, setSelectedCards] = useState<string[]>([]);

// Checkbox no card
<Checkbox
  checked={selectedCards.includes(item.id)}
  onCheckedChange={(checked) => {
    if (checked) {
      setSelectedCards([...selectedCards, item.id]);
    } else {
      setSelectedCards(selectedCards.filter(id => id !== item.id));
    }
  }}
  className="absolute top-2 left-2 opacity-0 group-hover:opacity-100"
/>

// Barra de ações (aparece quando tem seleção)
{selectedCards.length > 0 && (
  <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-navy-800 shadow-lg rounded-lg p-4 flex items-center gap-4 z-50">
    <span className="text-sm font-medium">
      {selectedCards.length} selecionado(s)
    </span>

    <Button variant="outline" onClick={() => handleBulkMoverPara('aprovado')}>
      <CheckCircle className="w-4 h-4 mr-2" />
      Aprovar todos
    </Button>

    <Button variant="outline" onClick={() => handleBulkMoverPara('bloqueado')}>
      <XCircle className="w-4 h-4 mr-2" />
      Bloquear todos
    </Button>

    <Button variant="outline" onClick={() => handleBulkGerarRelatorios()}>
      <FileText className="w-4 h-4 mr-2" />
      Gerar relatórios
    </Button>

    <Button variant="outline" onClick={() => handleBulkExportar()}>
      <Download className="w-4 h-4 mr-2" />
      Exportar CSV
    </Button>

    <Button variant="ghost" onClick={() => setSelectedCards([])}>
      <X className="w-4 h-4" />
    </Button>
  </div>
)}
```

---

## 🗄️ MUDANÇAS NO BACKEND

### Tabela `investigacoes` - Schema Atualizado

```sql
ALTER TABLE investigacoes ADD COLUMN tipo VARCHAR(50) DEFAULT 'custom';
-- Valores: 'funcionario', 'consulta_cpf', 'consulta_cnpj', 'consulta_divida',
--          'consulta_renda', 'consulta_faturamento', 'custom'

ALTER TABLE investigacoes ADD COLUMN metadata TEXT; -- JSON
-- Estrutura do JSON:
-- {
--   "api": "cpf",
--   "situacao": "REGULAR",
--   "nascimento": "01/01/1980",
--   "custo": 0.50,
--   "consultado_em": "2025-12-08T10:30:00Z",
--   "dividas": [...],
--   "qsa": [...],
--   etc...
-- }

ALTER TABLE investigacoes ADD COLUMN consultado_em TIMESTAMP;
ALTER TABLE investigacoes ADD COLUMN custo DECIMAL(10, 2) DEFAULT 0.00;
ALTER TABLE investigacoes ADD COLUMN observacoes TEXT;
ALTER TABLE investigacoes ADD COLUMN arquivado BOOLEAN DEFAULT FALSE;
```

### Novo Endpoint: Criar Investigação a partir de Consulta SERPRO

```
POST /api/investigacoes/from-serpro
Body: {
  "tipo": "consulta_cpf",
  "documento": "12345678900",
  "resultado_serpro": { ... },
  "custo": 0.50
}
```

**Backend cria automaticamente:**
1. Row na tabela `investigacoes`
2. Status inicial = "investigando"
3. Metadata = resultado da consulta
4. Custo registrado

---

## 📱 NAVEGAÇÃO INTEGRADA

### Menu Lateral Atualizado

```
Dashboard
├── 🏠 Home
├── 📊 Kanban (PRINCIPAL)  ← Source of Truth
│   ├── Visão Geral
│   ├── Métricas
│   └── Arquivo
├── ➕ Nova Investigação (atalho para +)
│   ├── Consultar CPF
│   ├── Consultar CNPJ
│   ├── Consultar Dívida
│   ├── Upload CSV (batch)
│   └── Custom (manual)
├── 💰 Custos (readonly - lê do Kanban)
├── 📄 Relatórios (gera do Kanban)
├── 🔔 Alertas
└── ⚙️ Admin
```

**Todas as consultas SERPRO → criam card no Kanban → Kanban é a fonte da verdade**

---

## 🎯 BENEFÍCIOS DA INTEGRAÇÃO

### 1. **Workflow Unificado**
- Tudo em um só lugar
- Mesmas 6 colunas para qualquer tipo de investigação
- Drag & drop universal

### 2. **Visibilidade Total**
- Custos por card
- Status em tempo real
- Métricas agregadas

### 3. **Rastreabilidade**
- Histórico completo de movimentações
- Quem moveu, quando, por quê
- Audit trail automático

### 4. **Produtividade**
- Bulk actions
- Filtros avançados
- Atalhos de teclado

### 5. **Integração Natural**
- Consultas SERPRO → Kanban automático
- Upload CSV → Cards no Kanban
- Relatórios → Gerados do Kanban

---

## ⏱️ ESTIMATIVA DE IMPLEMENTAÇÃO

| Fase | Descrição | Horas | Prioridade |
|------|-----------|-------|------------|
| **FASE 1** | SERPRO APIs → Kanban | 6-8h | ALTA |
| 1.1 | CPF → Card | 2h | ALTA |
| 1.2 | CNPJ → Card | 2h | ALTA |
| 1.3 | Outras APIs → Card | 2-4h | MÉDIA |
| **FASE 2** | Cost Tracking no Kanban | 2-3h | ALTA |
| **FASE 3** | Drag & Drop Real | 4-6h | ALTA |
| **FASE 4** | Ações Rápidas | 3-4h | MÉDIA |
| **FASE 5** | Filtros Avançados | 3-4h | MÉDIA |
| **FASE 6** | Estatísticas | 2-3h | MÉDIA |
| **FASE 7** | Bulk Actions | 3-4h | BAIXA |
| **Backend** | Schema + Endpoints | 4-6h | ALTA |
| **TOTAL** | **27-38 horas** | **~2 semanas** | - |

---

## 🚀 ROADMAP DE IMPLEMENTAÇÃO

### Sprint 1 (Semana 1 - 16h)
**Objetivo:** Kanban como hub central funcional

**Day 1-2 (8h):**
- Backend: Adicionar campos `tipo`, `metadata`, `custo` na tabela
- Backend: Endpoint `/investigacoes/from-serpro`
- Frontend: Integrar CPF consulta → Kanban card

**Day 3 (4h):**
- Frontend: Integrar CNPJ consulta → Kanban card
- Frontend: Badge de custo nos cards

**Day 4 (2h):**
- Frontend: Cost tracking - Total por coluna
- Frontend: Estatísticas acima do Kanban

**Day 5 (2h):**
- Frontend: Filtros básicos (busca + tipo)
- Testes + ajustes

### Sprint 2 (Semana 2 - 16h)
**Objetivo:** Drag & drop + ações avançadas

**Day 1-2 (8h):**
- Frontend: Implementar react-dnd
- Frontend: Drag & drop entre colunas
- Frontend: Update status no backend

**Day 3 (4h):**
- Frontend: Menu de ações rápidas (hover)
- Frontend: Gerar relatório do card
- Frontend: Ver histórico

**Day 4 (2h):**
- Frontend: Filtros avançados (data, custo, alertas)
- Frontend: Ações em lote (seleção múltipla)

**Day 5 (2h):**
- Polimento UI/UX
- Testes E2E do workflow completo
- Documentation

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Backend
- [ ] Adicionar coluna `tipo` na tabela `investigacoes`
- [ ] Adicionar coluna `metadata` (JSON) na tabela `investigacoes`
- [ ] Adicionar coluna `consultado_em` na tabela `investigacoes`
- [ ] Adicionar coluna `custo` na tabela `investigacoes`
- [ ] Adicionar coluna `observacoes` na tabela `investigacoes`
- [ ] Adicionar coluna `arquivado` na tabela `investigacoes`
- [ ] Criar endpoint `POST /api/investigacoes/from-serpro`
- [ ] Atualizar endpoint `PUT /api/investigacoes/:id` para aceitar `metadata`

### Frontend - FASE 1
- [ ] Integrar consulta CPF → criar card no Kanban
- [ ] Integrar consulta CNPJ → criar card no Kanban
- [ ] Integrar consulta Dívida → criar card no Kanban
- [ ] Integrar consulta Renda → criar card no Kanban
- [ ] Integrar consulta Faturamento → criar card no Kanban
- [ ] Integrar DataValid → criar card no Kanban
- [ ] Integrar CND → criar card no Kanban

### Frontend - FASE 2
- [ ] Badge de custo em cada card
- [ ] Total de custo por coluna
- [ ] Total geral acima do Kanban
- [ ] Link para Cost Dashboard detalhado

### Frontend - FASE 3
- [ ] Instalar react-dnd + react-dnd-html5-backend
- [ ] Implementar useDrag no KanbanCard
- [ ] Implementar useDrop na KanbanColumn
- [ ] Atualizar status no backend ao dropar
- [ ] Animações de drag
- [ ] Toast de sucesso/erro

### Frontend - FASE 4
- [ ] Menu dropdown no card (hover)
- [ ] Ação: Consultar novamente
- [ ] Ação: Gerar relatório PDF
- [ ] Ação: Ver histórico
- [ ] Ação: Adicionar observação
- [ ] Ação: Mover para... (submenu)
- [ ] Ação: Arquivar
- [ ] Ação: Deletar

### Frontend - FASE 5
- [ ] Input de busca (nome, CPF, CNPJ)
- [ ] Filtro por tipo (funcionário, CPF, CNPJ, etc)
- [ ] Filtro por data range
- [ ] Filtro por custo (min/max)
- [ ] Filtro por alertas
- [ ] Botão "Limpar filtros"

### Frontend - FASE 6
- [ ] Card: Total de investigações
- [ ] Card: Custo total SERPRO
- [ ] Card: Taxa de aprovação
- [ ] Card: Alertas críticos
- [ ] Gráfico de distribuição por coluna (opcional)

### Frontend - FASE 7
- [ ] Checkbox em cada card (seleção múltipla)
- [ ] Barra de ações flutuante (bottom)
- [ ] Bulk action: Aprovar todos
- [ ] Bulk action: Bloquear todos
- [ ] Bulk action: Mover para...
- [ ] Bulk action: Gerar relatórios
- [ ] Bulk action: Exportar CSV
- [ ] Bulk action: Arquivar

### Navegação
- [ ] Atualizar menu lateral (Kanban como principal)
- [ ] Remover dashboard "Investigações" separado (migrar para Kanban)
- [ ] Links de consultas SERPRO → Kanban
- [ ] Botão "Ver no Kanban" em outras páginas

### Testes
- [ ] E2E: Consulta CPF → Card criado no Kanban
- [ ] E2E: Drag & drop funciona
- [ ] E2E: Filtros funcionam
- [ ] E2E: Bulk actions funcionam
- [ ] Unit: calculateTotalCost()
- [ ] Unit: calculateApprovalRate()

---

## 🎓 DOCUMENTAÇÃO

### Para Usuários

**Guia: "Como usar o Kanban"**

```markdown
# Guia do Kanban - Investigaree

## O que é o Kanban?
O Kanban é o **coração** do Investigaree. Todas as investigações,
consultas e análises aparecem aqui como cards que você move pelo
workflow de 6 colunas.

## Workflow (6 colunas)
1. **Investigar** - Novos casos pendentes
2. **Investigando** - Casos em análise ativa
3. **Relatório** - Pronto para gerar relatório
4. **Monitoramento** - Acompanhamento contínuo
5. **Aprovado** - Casos aprovados
6. **Bloqueado** - Casos com problemas/alertas

## Como adicionar ao Kanban?
- **Consultar CPF/CNPJ**: Resultado cria card automaticamente
- **Upload CSV**: Cada linha = 1 card
- **Manual**: Botão "Nova Investigação"

## Como mover cards?
- **Arrastar e soltar** entre colunas
- **Menu de ações** (3 pontos) → "Mover para..."
- **Bulk actions** (selecionar múltiplos) → "Mover todos"

## Filtros disponíveis
- Buscar por nome, CPF ou CNPJ
- Filtrar por tipo (funcionário, consulta, etc)
- Filtrar por data
- Filtrar por custo
- Filtrar por alertas (óbito, dívida, etc)

## Custos
Cada card mostra o custo da consulta SERPRO. O total aparece:
- Por card (badge)
- Por coluna (header)
- Geral (acima do Kanban)
```

---

## ✅ CONCLUSÃO

### Kanban = Fonte Única da Verdade ✅

**Após a implementação:**
- ✅ Todos os 57 endpoints integrados ao Kanban
- ✅ Workflow unificado de 6 colunas para tudo
- ✅ Visibilidade total de custos
- ✅ Drag & drop funcional
- ✅ Filtros e bulk actions
- ✅ Métricas em tempo real

**Resultado:**
- 1 único lugar para tudo
- Interface intuitiva e profissional
- Produtividade maximizada
- Rastreabilidade completa
- ROI imediato

**Tempo:** 27-38 horas (2 semanas) para integração 100% completa!

---

**🎯 Próximo passo:** Escolher qual fase implementar primeiro (recomendo FASE 1 + 2 + 3)
