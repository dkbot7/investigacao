# 🚀 PLANO DE MIGRAÇÃO V2 - DASHBOARD COMURG (ATUALIZADO)

**Data:** 10/12/2025
**Responsável:** Dani Kaloi - InvestigaRee
**Status:** PLANEJAMENTO REVISADO
**Versão:** 2.0 - Baseado na análise do código existente

---

## 📊 SITUAÇÃO ATUAL DO INVESTIGAREE

### ✅ O QUE JÁ ESTÁ IMPLEMENTADO

#### 1. Layout e Navegação

**✅ COMPLETO** - `src/app/dashboard/layout.tsx`
- Sidebar responsivo (desktop + mobile)
- Navegação COMURG com seção colapsável
- 4 links já configurados:
  - Funcionários Cedidos (`/dashboard/comurgecedidos`)
  - Achados Críticos (`/dashboard/comurgachadoscriticos`)
  - Óbitos Confirmados (`/dashboard/comurgobitos`)
  - Vínculos Empresariais (`/dashboard/comurgempresas`)
- Proteção de tenant COMURG (`userInfo?.tenant?.code === 'COMURG'`)
- User menu com configurações
- Animações com Framer Motion

#### 2. Context de Dados

**✅ FUNCIONAL** - `src/contexts/ComurgDataContext.tsx`
- Interface `FuncionarioCompleto` com 80+ campos ✅
- Carrega `/data/comurg/dados_consolidados.csv` ✅
- Parser com PapaParse ✅
- Loading e error states ✅
- Função `getFuncionarioByCpf()` ✅
- Provider envolvendo páginas COMURG no layout ✅

**⚠️ NOTA:** O Context carrega CSV, mas algumas páginas carregam JSON diretamente - precisa padronizar.

#### 3. Arquivos de Dados Disponíveis

**Localização:** `public/data/comurg/`

✅ Arquivos existentes:
- `dados_consolidados.csv` (5.950 registros) - **USADO PELO CONTEXT**
- `empregados-todos.json` (5.950 registros)
- `empregados-comurg.json` (4.591 registros)
- `empregados-cedidos.json` (1.359 registros)
- `empregados-comurg.csv`
- `empregados-cedidos.csv`

#### 4. Páginas COMURG Já Criadas

##### A. `/dashboard/comurgecedidos`
**Status:** ✅ FUNCIONAL MAS INCOMPLETA

**O que tem:**
- Carrega JSON (`empregados-todos.json`) ❌ Deveria usar Context
- Filtros por grupo (Todos, COMURG, CEDIDO)
- Busca por nome, CPF, cadastro
- Stats cards (Total, Com Risco, Com Empresa, Óbitos)
- Tabela paginada (50 registros/página)
- Modal de ficha funcionário

**O que falta** (para ser igual ao `/overview` do dashboard local):
- ❌ Usar ComurgDataContext em vez de carregar JSON direto
- ❌ Grid de 5 KPIs principais (Total, COMURG, Cedidos, Folha Mensal, Folha Anual)
- ❌ Seletor dinâmico de colunas (80+ colunas)
- ❌ Persistência de preferências (localStorage)
- ❌ Formatação de datas Excel
- ❌ Botão "Selecionar Colunas"

##### B. `/dashboard/comurgachadoscriticos`
**Status:** ✅ FUNCIONAL

**O que tem:**
- Usa `useComurgData()` ✅
- Proteção de tenant ✅
- Filtro de achados críticos (Risco Crítico + Empresas Ativas + Óbitos) ✅
- 3 KPI cards (Críticos, Empresas Ativas, Óbitos) ✅
- Tabela com achados ✅
- Badge "URGENTE" ✅

**O que falta:**
- ❌ Gráficos (Top 10 empresas, Distribuição por tipo, Tendência)
- ❌ Filtros avançados
- ❌ GroupTabs (Todos, COMURG, Cedidos)

##### C. `/dashboard/comurgobitos`
**Status:** ✅ FUNCIONAL

**O que tem:**
- Usa `useComurgData()` ✅
- Proteção de tenant ✅
- Filtro de óbitos ✅
- 3 KPI cards (Total Óbitos, Salário Mensal em Risco, Distribuição) ✅
- Tabela de óbitos ✅
- Alerta crítico vermelho ✅

**O que falta:**
- ❌ Gráficos (Óbitos por ano, Por diretoria, Com/sem data)
- ❌ Cálculo de impacto financeiro total
- ❌ GroupTabs

##### D. `/dashboard/comurgempresas`
**Status:** ✅ FUNCIONAL

**O que tem:**
- Usa `useComurgData()` ✅
- Proteção de tenant ✅
- Filtro de empresas ativas ✅
- KPI card (Total com empresas) ✅
- Tabela com CNPJs ✅

**O que falta:**
- ❌ Gráficos (Top 10 por qtd, CNAE, Por diretoria)
- ❌ KPIs adicionais (Total CNPJs, Salário Envolvido)
- ❌ GroupTabs
- ❌ Destaque para > 3 empresas

#### 5. Componentes Disponíveis

**Existem em `src/components/`:**
- ✅ `FichaFuncionarioModal.tsx` - Modal com ficha completa
- ✅ `dashboard/TopNavBar.tsx` - Barra superior
- ✅ `ui/card.tsx` - Card shadcn/ui
- ✅ `ui/button.tsx` - Botão shadcn/ui
- ✅ Outros componentes shadcn/ui (dialog, tabs, etc.)

**Faltam criar:**
- ❌ `comurg/KPICard.tsx` - Cards de KPI personalizados
- ❌ `comurg/GroupTabs.tsx` - Abas de filtro
- ❌ `comurg/DataTable.tsx` - Tabela reutilizável
- ❌ `comurg/ColumnSelector.tsx` - Seletor de colunas
- ❌ `comurg/charts/BarChart.tsx` - Gráfico de barras
- ❌ `comurg/charts/LineChart.tsx` - Gráfico de linhas
- ❌ `comurg/charts/PieChart.tsx` - Gráfico de pizza

#### 6. Bibliotecas Instaladas

✅ **TODAS AS DEPENDÊNCIAS JÁ ESTÃO INSTALADAS!**
- `recharts: ^3.5.1` ✅
- `papaparse: ^5.5.3` ✅
- `lucide-react: ^0.554.0` ✅
- `framer-motion: ^12.23.24` ✅
- `xlsx: ^0.18.5` ✅
- `jspdf: ^3.0.4` ✅
- `next: 15.1.9` ✅
- Tailwind CSS 4 ✅

---

## 📋 COMPARAÇÃO: DASHBOARD LOCAL vs INVESTIGAREE

### Dashboard Local (`dashboard-comurg/`)

**12 páginas:**
1. `/` - Home (página inicial)
2. `/overview` - ⭐ **PRINCIPAL** - Visão geral completa
3. `/achados-criticos` - Achados críticos
4. `/analise-risco` - Classificação de risco
5. `/atividade-politica` - Candidaturas e doações
6. `/beneficios` - Benefícios federais
7. `/cpfs-validos` - Validação de CPFs
8. `/empresas` - Empresas ativas
9. `/listas-restritivas` - Sanções e OFAC
10. `/obitos` - Óbitos confirmados
11. `/relatorios` - Exportações
12. `/accessibility` - Acessibilidade

**Características:**
- Seletor de 80+ colunas ✅
- Persistência em localStorage ✅
- Gráficos Recharts ✅
- Formatação de datas Excel ✅
- Paginação 20 registros/página ✅

### InvestigaRee Atual (`investigaree/`)

**4 páginas COMURG:**
1. `/dashboard/comurgecedidos` - Funcionários (incompleta)
2. `/dashboard/comurgachadoscriticos` - Achados críticos (sem gráficos)
3. `/dashboard/comurgobitos` - Óbitos (sem gráficos)
4. `/dashboard/comurgempresas` - Empresas (sem gráficos)

**Características:**
- Proteção de tenant ✅
- Loading states ✅
- Error handling ✅
- Animações Framer Motion ✅
- Paginação 50 registros/página ✅

---

## 🎯 GAPS IDENTIFICADOS

### 1. Página Principal `/comurgecedidos`

**Precisa ser igual a `/overview` do dashboard local**

**Falta implementar:**
- [ ] Trocar carregamento JSON por `useComurgData()` (usar Context)
- [ ] Grid de 5 KPIs (Total, COMURG, Cedidos, Folha Mensal, Folha Anual)
- [ ] Seletor de colunas (até 80+)
- [ ] Persistência de colunas selecionadas (localStorage)
- [ ] Formatação de datas Excel (`excelSerialToDate()`)
- [ ] Colunas dinâmicas na tabela
- [ ] Botão "Selecionar Colunas" com ícone Settings
- [ ] Interface de seleção de colunas (checkboxes)
- [ ] Botão "Todas" / "Padrão"

### 2. Páginas Secundárias - Faltam Gráficos

**Todas as 3 páginas secundárias existentes precisam de:**
- [ ] Gráficos Recharts (BarChart, LineChart, PieChart)
- [ ] GroupTabs component (filtro Todos/COMURG/Cedidos)
- [ ] KPIs adicionais conforme planejado

### 3. Páginas Que Não Existem

**5 páginas ainda não criadas:**
- [ ] `/dashboard/comurgbenefícios` - Benefícios federais (35 casos)
- [ ] `/dashboard/comurgatividadepolitica` - Candidatos (8) e Doadores (78)
- [ ] `/dashboard/comurganaliserisco` - Classificação de risco
- [ ] `/dashboard/comurglistasrestritivas` - Sanções CGU e OFAC
- [ ] `/dashboard/comurgrelatorios` - Exportações e documentação

### 4. Componentes a Criar

**7 componentes reutilizáveis:**
- [ ] `src/components/comurg/KPICard.tsx`
- [ ] `src/components/comurg/GroupTabs.tsx`
- [ ] `src/components/comurg/DataTable.tsx`
- [ ] `src/components/comurg/ColumnSelector.tsx`
- [ ] `src/components/comurg/charts/BarChart.tsx`
- [ ] `src/components/comurg/charts/LineChart.tsx`
- [ ] `src/components/comurg/charts/PieChart.tsx`

### 5. Utilitários a Criar

**Funções auxiliares:**
- [ ] `src/lib/comurg/utils.ts` - Formatação e cálculos
- [ ] `src/lib/comurg/constants.ts` - Constantes e configurações
- [ ] `src/lib/comurg/export-excel.ts` - Exportação Excel
- [ ] `src/lib/comurg/export-pdf.ts` - Geração de PDF

---

## 📝 PLANO TODO REVISADO

### ⚠️ CORREÇÃO IMPORTANTE

**DECISÃO:** Padronizar para usar **CSV via ComurgDataContext** em todas as páginas.

**Razão:**
- O Context já existe e funciona ✅
- CSV é mais leve que JSON ✅
- Consistência ✅
- Evita duplicação de código ✅

### FASE 1: CORRIGIR E PADRONIZAR (1-2 dias)

#### 1.1. Corrigir página `/comurgecedidos`
- [ ] Remover carregamento direto de JSON
- [ ] Usar `useComurgData()` do Context
- [ ] Testar que continua funcionando
- [ ] Commit: "fix: use ComurgDataContext in comurgecedidos"

#### 1.2. Verificar outras páginas
- [ ] Confirmar que todas usam `useComurgData()`
- [ ] Padronizar estrutura de código

---

### FASE 2: COMPONENTES BASE (2-3 dias)

#### 2.1. KPICard
**Arquivo:** `src/components/comurg/KPICard.tsx`

```typescript
interface KPICardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: "blue" | "green" | "purple" | "orange" | "red";
  trend?: {
    value: number;
    direction: "up" | "down";
  };
}
```

**Features:**
- [ ] Props tipadas
- [ ] Cores dinâmicas
- [ ] Ícone Lucide React
- [ ] Trend opcional (seta + %)
- [ ] Responsivo
- [ ] Animação Framer Motion

**Prioridade:** 🔴 CRÍTICA

---

#### 2.2. GroupTabs
**Arquivo:** `src/components/comurg/GroupTabs.tsx`

```typescript
interface GroupTabsProps {
  activeTab: "todos" | "comurg" | "cedidos";
  onTabChange: (tab: "todos" | "comurg" | "cedidos") => void;
  counts: {
    todos: number;
    comurg: number;
    cedidos: number;
  };
}
```

**Features:**
- [ ] 3 tabs (Todos, COMURG, Cedidos)
- [ ] Contadores dinâmicos
- [ ] Indicador de aba ativa
- [ ] Callback onChange
- [ ] Responsivo (stack em mobile)
- [ ] Cores por grupo (azul, verde, roxo)

**Prioridade:** 🔴 CRÍTICA

---

#### 2.3. ColumnSelector
**Arquivo:** `src/components/comurg/ColumnSelector.tsx`

```typescript
interface Column {
  key: string;
  label: string;
  default: boolean;
}

interface ColumnSelectorProps {
  columns: Column[];
  selected: string[];
  onChange: (selected: string[]) => void;
}
```

**Features:**
- [ ] Lista de todas as colunas (80+)
- [ ] Checkbox para cada coluna
- [ ] Botão "Todas" / "Padrão"
- [ ] Busca de colunas
- [ ] Persistência em localStorage
- [ ] Modal ou Dropdown
- [ ] Botão de fechar (X)

**Prioridade:** 🟡 ALTA

---

#### 2.4. Gráficos (Recharts Wrappers)

##### BarChart
**Arquivo:** `src/components/comurg/charts/BarChart.tsx`

```typescript
interface BarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
}
```

**Features:**
- [ ] Wrapper do Recharts BarChart
- [ ] Tooltip personalizado
- [ ] Responsivo
- [ ] Cores customizáveis
- [ ] Loading state

##### LineChart
**Arquivo:** `src/components/comurg/charts/LineChart.tsx`

**Features:**
- [ ] Wrapper do Recharts LineChart
- [ ] Múltiplas linhas (opcional)
- [ ] Área preenchida (opcional)
- [ ] Legendas
- [ ] Grid

##### PieChart
**Arquivo:** `src/components/comurg/charts/PieChart.tsx`

**Features:**
- [ ] Wrapper do Recharts PieChart
- [ ] Percentuais
- [ ] Legendas
- [ ] Cores customizáveis
- [ ] Labels

**Prioridade:** 🟢 MÉDIA

---

### FASE 3: ATUALIZAR PÁGINA PRINCIPAL (2-3 dias)

#### 3.1. Reescrever `/comurgecedidos/page.tsx`

**Objetivo:** Tornar idêntica ao `/overview` do dashboard local

**Checklist:**
- [ ] Usar `useComurgData()` ✅
- [ ] Header com título e descrição
- [ ] Grid de 5 KPIs:
  - [ ] Total Funcionários (5.950)
  - [ ] COMURG (4.591)
  - [ ] Cedidos (1.359)
  - [ ] Folha Mensal (soma de salários)
  - [ ] Folha Anual (folha mensal * 12)
- [ ] Seção de Filtros:
  - [ ] Campo de busca (nome, CPF, cargo)
  - [ ] GroupTabs component
  - [ ] Botão "Selecionar Colunas"
- [ ] ColumnSelector:
  - [ ] 80+ colunas disponíveis
  - [ ] Colunas padrão (6): nome, cpf, grupo, cargo, salario, admissao
  - [ ] Persistência em localStorage
- [ ] Tabela Principal:
  - [ ] Colunas dinâmicas
  - [ ] Formatação de datas Excel
  - [ ] Formatação de moeda
  - [ ] Click no nome abre modal
  - [ ] Badge de grupo (verde/roxo)
  - [ ] Paginação (20 registros/página)
- [ ] Contador "Mostrando X a Y de Z"
- [ ] Função `excelSerialToDate()`
- [ ] Função `renderCellValue()`

**Arquivo de referência:** `dashboard-comurg/app/overview/page.tsx`

---

### FASE 4: ADICIONAR GRÁFICOS NAS PÁGINAS EXISTENTES (2-3 dias)

#### 4.1. Achados Críticos

**Adicionar a `/comurgachadoscriticos`:**
- [ ] GroupTabs component
- [ ] 3 Gráficos:
  - [ ] Top 10 por nº de empresas (BarChart)
  - [ ] Distribuição por tipo (PieChart)
  - [ ] Tendência mensal (LineChart)

#### 4.2. Óbitos

**Adicionar a `/comurgobitos`:**
- [ ] GroupTabs component
- [ ] 3 Gráficos:
  - [ ] Óbitos por ano (LineChart)
  - [ ] Por diretoria (BarChart)
  - [ ] Com/sem data (PieChart)
- [ ] Cálculo de impacto financeiro total

#### 4.3. Empresas

**Adicionar a `/comurgempresas`:**
- [ ] GroupTabs component
- [ ] KPIs adicionais:
  - [ ] Total CNPJs vinculados
  - [ ] Salário total envolvido
- [ ] 3 Gráficos:
  - [ ] Top 10 por qtd empresas (BarChart)
  - [ ] Distribuição por CNAE (PieChart)
  - [ ] Por diretoria (BarChart horizontal)
- [ ] Destaque vermelho para > 3 empresas

---

### FASE 5: CRIAR NOVAS PÁGINAS (4-5 dias)

#### 5.1. Benefícios Federais
**Rota:** `/dashboard/comurgbenefícios`

**Estrutura:**
- [ ] Criar arquivo `src/app/dashboard/comurgbenefícios/page.tsx`
- [ ] Usar `useComurgData()`
- [ ] Proteção de tenant
- [ ] Filtro: `recebe_beneficio` = "SIM"
- [ ] KPIs:
  - [ ] Total Beneficiários (35)
  - [ ] Valor Total de Benefícios
  - [ ] Incompatíveis com Renda
- [ ] Gráficos:
  - [ ] Tipos de benefício (PieChart)
  - [ ] Benefícios por faixa salarial (BarChart)
  - [ ] Salário vs Benefício (ScatterChart - opcional)
- [ ] Tabela com beneficiários
- [ ] GroupTabs

**Adicionar ao layout:**
- [ ] Adicionar link em `comurgNavItems` no layout

---

#### 5.2. Atividade Política
**Rota:** `/dashboard/comurgatividadepolitica`

**Estrutura:**
- [ ] Criar arquivo `src/app/dashboard/comurgatividadepolitica/page.tsx`
- [ ] KPIs:
  - [ ] Candidatos (8)
  - [ ] Doadores (78)
  - [ ] Total Doado
- [ ] Seção A - Candidaturas:
  - [ ] Gráfico: Candidatos por ano (BarChart)
  - [ ] Gráfico: Por partido (PieChart)
  - [ ] Tabela de candidatos
- [ ] Seção B - Doações:
  - [ ] Gráfico: Doações por ano (BarChart)
  - [ ] Gráfico: Por partido (PieChart)
  - [ ] Tabela de doadores
- [ ] GroupTabs

**Adicionar ao layout:**
- [ ] Adicionar link em `comurgNavItems`

---

#### 5.3. Análise de Risco
**Rota:** `/dashboard/comurganaliserisco`

**Estrutura:**
- [ ] Criar arquivo
- [ ] KPIs:
  - [ ] Críticos
  - [ ] Atenção
  - [ ] Regular
- [ ] Gráficos:
  - [ ] Distribuição por classificação (PieChart)
  - [ ] Por tipo de irregularidade (BarChart)
  - [ ] Risco por diretoria (TreemapChart - opcional)
- [ ] Tabela com cores por nível
- [ ] Filtros por classificação
- [ ] GroupTabs

**Adicionar ao layout:**
- [ ] Adicionar link em `comurgNavItems`

---

#### 5.4. Listas Restritivas
**Rota:** `/dashboard/comurglistasrestritivas`

**Estrutura:**
- [ ] Criar arquivo
- [ ] KPIs:
  - [ ] Sanções CGU (1)
  - [ ] Alertas OFAC (260)
  - [ ] PEP Nacional
- [ ] Seção A - Sanções CGU:
  - [ ] Tabela de sanções
- [ ] Seção B - Alertas OFAC:
  - [ ] Nota explicativa (similaridade)
  - [ ] Tabela de matches
  - [ ] Filtro por score
- [ ] Gráficos:
  - [ ] Distribuição scores OFAC (BarChart)
  - [ ] Sanções por ano (LineChart)
- [ ] GroupTabs

**Adicionar ao layout:**
- [ ] Adicionar link em `comurgNavItems`

---

#### 5.5. Relatórios
**Rota:** `/dashboard/comurgrelatorios`

**Estrutura:**
- [ ] Criar arquivo
- [ ] Seção "Exportar Dados":
  - [ ] Botão "Exportar para Excel" (todos)
  - [ ] Botão "Exportar Filtrados"
  - [ ] Botão "Exportar Achados Críticos"
- [ ] Seção "Gerar PDF":
  - [ ] Relatório Executivo
  - [ ] Relatório Detalhado
  - [ ] Relatório de Conformidade
- [ ] Seção "Documentação":
  - [ ] Links para documentos .md
  - [ ] Download de documentos
- [ ] Seção "Histórico":
  - [ ] Log de exportações
  - [ ] Auditoria

**Adicionar ao layout:**
- [ ] Adicionar link em `comurgNavItems`

---

### FASE 6: FUNCIONALIDADES AVANÇADAS (2-3 dias)

#### 6.1. Exportação Excel
**Arquivo:** `src/lib/comurg/export-excel.ts`

```typescript
export function exportToExcel(
  data: any[],
  filename: string,
  sheetName: string = "Dados"
): void {
  // Usar biblioteca xlsx
}
```

- [ ] Usar `xlsx` (já instalado)
- [ ] Formatação de colunas
- [ ] Múltiplas sheets (opcional)
- [ ] Download automático

---

#### 6.2. Geração de PDF
**Arquivo:** `src/lib/comurg/export-pdf.ts`

```typescript
export function generatePDF(
  type: "executivo" | "detalhado" | "conformidade",
  data: any
): void {
  // Usar jspdf e jspdf-autotable
}
```

- [ ] Usar `jspdf` e `jspdf-autotable` (já instalados)
- [ ] Templates de relatórios
- [ ] Incluir KPIs e gráficos
- [ ] Formatação profissional

---

#### 6.3. Utilitários
**Arquivo:** `src/lib/comurg/utils.ts`

```typescript
// Converter serial Excel para dd/mm/aaaa
export function excelSerialToDate(serial: any): string

// Formatar CPF com máscara
export function formatCPF(cpf: string): string

// Formatar moeda R$
export function formatCurrency(value: number): string

// Calcular KPIs
export function calculateKPIs(data: FuncionarioCompleto[])

// Filtrar por grupo
export function filterByGroup(data: FuncionarioCompleto[], group: string)

// Filtrar por risco
export function filterByRisk(data: FuncionarioCompleto[], risk: string)
```

- [ ] Implementar todas as funções
- [ ] Testes unitários
- [ ] Documentação JSDoc

---

### FASE 7: OTIMIZAÇÕES (1-2 dias)

#### 7.1. Performance
- [ ] Virtualização de tabelas (react-window) - se necessário
- [ ] Memoização de cálculos (`useMemo`)
- [ ] Lazy loading de gráficos

#### 7.2. UX/UI
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Tooltips informativos
- [ ] Animações suaves

#### 7.3. Acessibilidade
- [ ] Aria-labels
- [ ] Navegação por teclado
- [ ] Contraste de cores
- [ ] Focus indicators

---

### FASE 8: TESTES E QA (2-3 dias)

#### 8.1. Testes Funcionais
- [ ] Testar todas as 8 páginas COMURG
- [ ] Testar filtros
- [ ] Testar busca
- [ ] Testar paginação
- [ ] Testar gráficos
- [ ] Testar exportações
- [ ] Testar proteção de tenant

#### 8.2. Testes de Responsividade
- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Diferentes navegadores

---

### FASE 9: DOCUMENTAÇÃO (1 dia)

- [ ] Atualizar README.md
- [ ] Documentar componentes
- [ ] Guia de uso para o cliente
- [ ] Changelog

---

### FASE 10: DEPLOY (1 dia)

- [ ] Build de produção
- [ ] Testar em staging
- [ ] Deploy no Cloudflare Pages
- [ ] Verificar em produção
- [ ] Notificar cliente

---

## 📅 CRONOGRAMA REVISADO

**Total estimado:** 20-28 dias úteis (~4-6 semanas)

**Semana 1 (Dias 1-5):**
- FASE 1: Correções e Padronização (1-2 dias)
- FASE 2: Componentes Base (início)

**Semana 2 (Dias 6-10):**
- FASE 2: Componentes Base (conclusão)
- FASE 3: Página Principal Overview (2-3 dias)

**Semana 3 (Dias 11-15):**
- FASE 4: Adicionar Gráficos (2-3 dias)
- FASE 5: Criar Novas Páginas (início)

**Semana 4 (Dias 16-20):**
- FASE 5: Criar Novas Páginas (conclusão, 4-5 dias)

**Semana 5 (Dias 21-25):**
- FASE 6: Funcionalidades Avançadas (2-3 dias)
- FASE 7: Otimizações (1-2 dias)

**Semana 6 (Dias 26-28):**
- FASE 8: Testes e QA (2-3 dias)
- FASE 9: Documentação (1 dia)
- FASE 10: Deploy (1 dia)

---

## 🎯 PRIORIZAÇÃO

### Prioridade 1 (Fazer PRIMEIRO)
1. Corrigir `/comurgecedidos` para usar Context
2. Criar KPICard component
3. Criar GroupTabs component
4. Reescrever página principal Overview

### Prioridade 2 (Depois)
5. Criar gráficos wrappers
6. Adicionar gráficos nas 3 páginas existentes
7. Criar ColumnSelector

### Prioridade 3 (Por último)
8. Criar 5 novas páginas
9. Funcionalidades de exportação
10. Otimizações

---

## ✅ VANTAGENS IDENTIFICADAS

1. **60% JÁ PRONTO!**
   - Layout ✅
   - Navegação ✅
   - Context ✅
   - 4 páginas ✅
   - Proteção de tenant ✅
   - Todas as dependências ✅

2. **Arquitetura sólida**
   - ComurgDataContext bem estruturado
   - Proteção em múltiplas camadas
   - Error handling consistente

3. **Bibliotecas instaladas**
   - Recharts ✅
   - PapaParse ✅
   - Framer Motion ✅
   - XLSX ✅
   - jsPDF ✅

---

## 🚨 PONTOS DE ATENÇÃO

1. **Padronizar fonte de dados**
   - Todas as páginas devem usar `useComurgData()`
   - Não carregar JSON/CSV diretamente

2. **Consistência visual**
   - Usar mesmas cores e estilos
   - Manter padrão de KPI cards
   - Animações consistentes

3. **Performance**
   - 5.950 registros podem ser pesados
   - Usar memoização
   - Virtualização se necessário

4. **Proteção de tenant**
   - Garantir em TODAS as páginas
   - Client-side e server-side

---

## 📝 PRÓXIMOS PASSOS IMEDIATOS

**Quando aprovado, começar por:**

1. **FASE 1.1** - Corrigir `/comurgecedidos`
   - Trocar JSON por `useComurgData()`
   - Testar que continua funcionando
   - Commit

2. **FASE 2.1** - Criar KPICard
   - Componente reutilizável
   - Usar em todas as páginas

3. **FASE 2.2** - Criar GroupTabs
   - Componente reutilizável
   - Adicionar em todas as páginas

4. **FASE 3** - Reescrever Overview completo
   - Seguir exatamente o dashboard local
   - Com seletor de colunas

---

**Aguardando aprovação para iniciar implementação! 🚀**

---

**Versão:** 2.0
**Data:** 10/12/2025
**Status:** PRONTO PARA EXECUÇÃO
