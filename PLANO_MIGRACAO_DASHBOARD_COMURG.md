# 🚀 PLANO DE MIGRAÇÃO - DASHBOARD COMURG PARA INVESTIGAREE

**Data de Criação:** 10/12/2025
**Responsável:** Dani Kaloi - InvestigaRee
**Status:** PLANEJAMENTO
**Objetivo:** Migrar dashboard local completo para https://investigaree.com.br/dashboard/comurgecedidos/

---

## 📋 ÍNDICE

1. [Análise da Situação Atual](#1-análise-da-situação-atual)
2. [Arquitetura da Migração](#2-arquitetura-da-migração)
3. [Estrutura de Dados](#3-estrutura-de-dados)
4. [Componentes a Migrar](#4-componentes-a-migrar)
5. [Páginas do Dashboard](#5-páginas-do-dashboard)
6. [KPIs e Métricas por Página](#6-kpis-e-métricas-por-página)
7. [TODO Detalhado](#7-todo-detalhado)
8. [Cronograma](#8-cronograma)
9. [Checklist de Verificação](#9-checklist-de-verificação)

---

## 1. ANÁLISE DA SITUAÇÃO ATUAL

### 1.1. Dashboard Local (Origem)

**Localização:** `C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\clientes\CLIENTE_01\dashboard-comurg\`

**Tecnologias:**
- Next.js 16.0.3 (App Router)
- TypeScript
- Tailwind CSS 4
- Recharts 3.4.1 (gráficos)
- PapaParse 5.5.3 (CSV parser)
- Lucide React (ícones)

**Estrutura:**
```
dashboard-comurg/
├── app/
│   ├── page.tsx                    # Home
│   ├── overview/page.tsx           # ⭐ Página principal
│   ├── achados-criticos/page.tsx
│   ├── analise-risco/page.tsx
│   ├── atividade-politica/page.tsx
│   ├── beneficios/page.tsx
│   ├── cpfs-validos/page.tsx
│   ├── empresas/page.tsx
│   ├── listas-restritivas/page.tsx
│   ├── obitos/page.tsx
│   ├── relatorios/page.tsx
│   └── accessibility/page.tsx
├── components/
│   ├── charts/
│   │   ├── bar-chart.tsx
│   │   ├── line-chart.tsx
│   │   └── pie-chart.tsx
│   ├── ui/
│   ├── data-table.tsx
│   ├── funcionario-modal.tsx
│   ├── GroupTabs.tsx
│   ├── kpi-card.tsx
│   └── sidebar.tsx
├── contexts/
│   └── DataContext.tsx             # ⭐ Carrega dados_consolidados.csv
├── config/
│   └── dashboard.config.ts
└── public/
    └── data/
        ├── dados_consolidados.csv  # ⭐ 5.950 registros (FONTE DA VERDADE)
        ├── kpis.csv
        ├── por_grupo.csv
        ├── por_risco.csv
        ├── achados_criticos.csv
        ├── obitos.csv
        ├── empresas_ativas.csv
        ├── beneficios.csv
        ├── candidaturas.csv
        ├── doacoes.csv
        ├── por_centro_custo.csv
        └── estatisticas.csv
```

**Funcionalidades Principais:**
- ✅ Carrega CSV com 5.950 funcionários (todos os campos)
- ✅ 12 páginas navegáveis
- ✅ Filtros por grupo (Todos, COMURG, Cedidos)
- ✅ Busca por nome, CPF, cargo
- ✅ Seletor dinâmico de colunas (até 80+ colunas)
- ✅ Paginação
- ✅ Modal com ficha completa
- ✅ KPIs dinâmicos
- ✅ Gráficos interativos (Recharts)
- ✅ Persistência de preferências (localStorage)

---

### 1.2. InvestigaRee (Destino)

**Localização:** `C:\Users\Vaio\Documents\TRABALHO\INVESTIGA\investigaree\`

**Tecnologias:**
- Next.js 15.1.9 (App Router) - ✅ Compatível
- TypeScript - ✅ Compatível
- Tailwind CSS 4 - ✅ Compatível
- Recharts 3.5.1 - ✅ **JÁ INSTALADO!**
- PapaParse 5.5.3 - ✅ **JÁ INSTALADO!**
- Lucide React 0.554.0 - ✅ **JÁ INSTALADO!**
- Framer Motion 12.23.24 - ✅ Bônus para animações!

**Estado Atual:**
```
investigaree/
├── src/
│   ├── app/
│   │   └── dashboard/
│   │       └── comurgecedidos/
│   │           └── page.tsx        # ⚠️ Apenas tabela simples
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── FichaFuncionario.tsx
│   │   │   └── TopNavBar.tsx
│   │   └── FichaFuncionarioModal.tsx
│   └── public/
│       └── data/
│           └── comurg/
│               ├── empregados-todos.json       # ⭐ 5.950 registros
│               ├── empregados-comurg.json
│               └── empregados-cedidos.json
```

**Funcionalidades Atuais:**
- ✅ Tabela simples com paginação
- ✅ Filtros por grupo
- ✅ Busca por nome/CPF
- ✅ Modal de ficha completa
- ✅ Proteção de tenant COMURG
- ⚠️ Falta: Gráficos, KPIs, outras páginas

---

## 2. ARQUITETURA DA MIGRAÇÃO

### 2.1. Estratégia Geral

**PRINCÍPIO:** A página `/dashboard/comurgecedidos` deve se tornar idêntica a `/overview` do dashboard local

**Abordagem:**
1. **Manter JSON como fonte** - Não usar banco SQLite
2. **Reutilizar componentes existentes** - Aproveitar componentes do InvestigaRee
3. **Migrar componentes do dashboard local** - Copiar componentes específicos
4. **Criar estrutura de subpáginas** - Adicionar rotas /achados-criticos, /empresas, etc.
5. **Manter proteção de tenant** - Garantir acesso apenas para COMURG

### 2.2. Estrutura de Rotas

**Estrutura Planejada:**
```
/dashboard/comurgecedidos/                    # Overview (página principal)
/dashboard/comurgecedidos/achados-criticos    # Achados críticos
/dashboard/comurgecedidos/empresas            # Empresas ativas
/dashboard/comurgecedidos/obitos              # Óbitos confirmados
/dashboard/comurgecedidos/beneficios          # Benefícios federais
/dashboard/comurgecedidos/atividade-politica  # Candidaturas e doações
/dashboard/comurgecedidos/analise-risco       # Classificação de risco
/dashboard/comurgecedidos/listas-restritivas  # Sanções e OFAC
/dashboard/comurgecedidos/relatorios          # Relatórios e exportações
```

### 2.3. Arquitetura de Componentes

```
src/
├── app/
│   └── dashboard/
│       └── comurgecedidos/
│           ├── layout.tsx                    # Layout com sidebar
│           ├── page.tsx                      # Overview (principal)
│           ├── achados-criticos/
│           │   └── page.tsx
│           ├── empresas/
│           │   └── page.tsx
│           ├── obitos/
│           │   └── page.tsx
│           ├── beneficios/
│           │   └── page.tsx
│           ├── atividade-politica/
│           │   └── page.tsx
│           ├── analise-risco/
│           │   └── page.tsx
│           ├── listas-restritivas/
│           │   └── page.tsx
│           └── relatorios/
│               └── page.tsx
├── components/
│   └── comurg/
│       ├── DataProvider.tsx                  # Context para dados
│       ├── KPICard.tsx                       # Card de KPI
│       ├── GroupTabs.tsx                     # Abas de filtro
│       ├── DataTable.tsx                     # Tabela reutilizável
│       ├── ColumnSelector.tsx                # Seletor de colunas
│       ├── charts/
│       │   ├── BarChart.tsx
│       │   ├── LineChart.tsx
│       │   └── PieChart.tsx
│       └── modals/
│           └── FichaFuncionarioModal.tsx     # Modal detalhado
└── lib/
    └── comurg-utils.ts                       # Funções auxiliares
```

---

## 3. ESTRUTURA DE DADOS

### 3.1. Fonte da Verdade

**ÚNICO ARQUIVO:**
```
public/data/comurg/empregados-todos.json
```

**Estrutura do JSON (5.950 registros):**
```json
[
  {
    "Cadastro": 113055201,
    "Nome": "ABADIO FERREIRA FILHO",
    "CPF": "402.178.501-97",
    "Nascimento": 22651,
    "Admissão": 40991,
    "Sexo": "Masculino",
    "Vínculo": "Efetivo",
    "Situação": "Trabalhando",
    "Cargo": "Trab Sv Co Limp Con Area Pub I",
    "Salário": 1604.91,
    "Diretoria": "DIRETORIA DE LIMPEZA URBANA (DIRLIMP)",
    "Local": "P.A. SETOR SUL (CEPAL) - VARRIÇÃO DIURNO",
    "Posto": "P.A. SETOR SUL (CEPAL) - VARRIÇÃO DIURNO - DIRLIMP",
    "CPF Válido?": "SIM",
    "Está Vivo?": "SIM",
    "Está Morto?": "NÃO",
    "Telefones": "556235762863,556235958582",
    "Emails": "andre10088luiz@gmail.com",
    "Recebe Benefício (BPC)?": "NÃO",
    "Qual Benefício?": "Nenhum benefício encontrado",
    "É Sócio de Empresa?": "SIM",
    "Qtd Empresas": 1,
    "Empresas Ativas": 1,
    "Vínculos Empresariais (CNPJ)": "[ATIVA] MINISTERIO BATISTA DO VALE...",
    "Foi Candidato?": "NÃO",
    "Foi Doador Eleitoral?": "NÃO",
    "Possui Sanção CGU?": "NÃO",
    "Alerta OFAC?": "NÃO",
    "Nível de Risco Contábil": "Alto",
    "Tipo de Irregularidade Principal": "EMPRESA ATIVA - Conflito com dedicacao",
    "Classificacao Risco": "Atencao",
    "Achados Contabeis": "EMPRESA ATIVA - Conflito com dedicacao",
    "grupo": "COMURG"
  }
]
```

**Total de campos:** ~50 colunas principais

### 3.2. Conversão de Dados

**Não é necessária conversão!**
- JSON já existe com todos os dados
- Estrutura compatível com o dashboard local
- Mantém todos os campos das planilhas Excel originais

### 3.3. Cálculo de KPIs

KPIs serão calculados dinamicamente a partir do JSON:

```typescript
// Exemplo de cálculo
const totalFuncionarios = data.length;
const totalComurg = data.filter(f => f.grupo === "COMURG").length;
const totalCedidos = data.filter(f => f.grupo === "CEDIDO").length;
const obitos = data.filter(f => f["Está Morto?"].startsWith("SIM")).length;
const empresasAtivas = data.filter(f => f["Empresas Ativas"] > 0).length;
```

---

## 4. COMPONENTES A MIGRAR

### 4.1. Componentes Essenciais

#### A. DataProvider (Context)
**Origem:** `dashboard-comurg/contexts/DataContext.tsx`
**Destino:** `src/components/comurg/DataProvider.tsx`

**Modificações necessárias:**
- Trocar carregamento de CSV para JSON
- Manter interface `FuncionarioCompleto`
- Adicionar cache de dados

**Prioridade:** 🔴 CRÍTICA - Base de tudo

---

#### B. KPICard
**Origem:** `dashboard-comurg/components/kpi-card.tsx`
**Destino:** `src/components/comurg/KPICard.tsx`

**Funcionalidades:**
- Exibir valor numérico grande
- Ícone personalizado
- Cor de fundo condicional
- Descrição do KPI

**Prioridade:** 🔴 CRÍTICA

---

#### C. GroupTabs
**Origem:** `dashboard-comurg/components/GroupTabs.tsx`
**Destino:** `src/components/comurg/GroupTabs.tsx`

**Funcionalidades:**
- Abas: Todos, COMURG, Cedidos
- Contadores dinâmicos
- Filtro de dados por grupo

**Prioridade:** 🔴 CRÍTICA

---

#### D. DataTable
**Origem:** `dashboard-comurg/components/data-table.tsx`
**Destino:** `src/components/comurg/DataTable.tsx`

**Funcionalidades:**
- Tabela responsiva
- Ordenação por colunas
- Paginação
- Formatação de valores (datas, moeda, etc.)

**Prioridade:** 🟡 ALTA

---

#### E. ColumnSelector
**Origem:** Parte de `dashboard-comurg/app/overview/page.tsx`
**Destino:** `src/components/comurg/ColumnSelector.tsx`

**Funcionalidades:**
- Checkbox para cada coluna
- Persistência em localStorage
- Botão "Todas" / "Padrão"
- Interface modal ou dropdown

**Prioridade:** 🟡 ALTA

---

#### F. Gráficos (Recharts)
**Origem:** `dashboard-comurg/components/charts/`
**Destino:** `src/components/comurg/charts/`

**Componentes:**
1. `BarChart.tsx` - Gráfico de barras
2. `LineChart.tsx` - Gráfico de linhas
3. `PieChart.tsx` - Gráfico de pizza

**Prioridade:** 🟢 MÉDIA

---

#### G. FichaFuncionarioModal
**Status:** ✅ **JÁ EXISTE** em `src/components/FichaFuncionarioModal.tsx`

**Ação:** Revisar e adaptar se necessário

**Prioridade:** 🟢 BAIXA (já funciona)

---

### 4.2. Componentes de Layout

#### A. Sidebar de Navegação
**Funcionalidade:**
- Menu lateral com links para todas as páginas
- Indicador de página ativa
- Badges de alerta (ex: "URGENTE" em Achados Críticos)
- Responsivo (colapsa em mobile)

**Prioridade:** 🔴 CRÍTICA

---

#### B. Header/TopBar
**Funcionalidade:**
- Título da página atual
- Breadcrumb
- Botão de menu (mobile)
- Informações do usuário

**Prioridade:** 🟡 ALTA

---

## 5. PÁGINAS DO DASHBOARD

### Página 1: Overview (Principal)

**Rota:** `/dashboard/comurgecedidos`

**Objetivo:** Visão geral completa com todos os dados

**KPIs Principais:**
1. Total Funcionários (5.950)
2. COMURG (4.591)
3. Cedidos (1.359)
4. Folha Mensal (R$ X.XXX.XXX)
5. Folha Anual (R$ XX.XXX.XXX)

**Seções:**
1. **Header**
   - Título: "Visão Geral - Base Única de Dados"
   - Subtítulo: "Fonte única da verdade com 5.950 funcionários"

2. **Grid de KPIs** (5 cards)
   - Total, COMURG, Cedidos, Folha Mensal, Folha Anual

3. **Filtros e Busca**
   - Campo de busca (nome, CPF, cargo)
   - Abas de grupo (Todos, COMURG, Cedidos)
   - Botão "Selecionar Colunas"

4. **Tabela Principal**
   - Colunas padrão: Nome, CPF, Grupo, Cargo, Salário, Admissão
   - Seletor de até 80+ colunas
   - Paginação (20 registros/página)
   - Click no nome abre modal

**Prioridade:** 🔴 CRÍTICA - É a página principal

---

### Página 2: Achados Críticos

**Rota:** `/dashboard/comurgecedidos/achados-criticos`

**Objetivo:** Top casos urgentes que requerem ação imediata

**KPIs:**
1. Total Críticos
2. Empresas Ativas (conflito)
3. Óbitos Confirmados

**Critérios de Inclusão:**
- Classificação de Risco = "Crítico"
- Empresas Ativas > 0
- Está Morto? = "SIM"

**Gráficos:**
1. **Gráfico de Barras:** Top 10 funcionários por nº de empresas
2. **Gráfico de Pizza:** Distribuição por tipo de achado
3. **Gráfico de Linha:** Tendência de achados por mês (se houver data)

**Tabela:**
- Colunas: Nome, Cargo, Salário, Tipo Alerta, Risco, Ação Requerida
- Filtros: Por tipo de alerta, por risco
- Ordenação padrão: Por gravidade (Crítico > Atenção)

**Badge:** "URGENTE" (vermelho)

**Prioridade:** 🔴 CRÍTICA

---

### Página 3: Empresas Ativas

**Rota:** `/dashboard/comurgecedidos/empresas`

**Objetivo:** Análise de conflitos empresariais

**KPIs:**
1. Total com Empresas Ativas (151)
2. Total de CNPJs Vinculados
3. Salário Total Envolvido

**Critérios:**
- Empresas Ativas > 0

**Gráficos:**
1. **Gráfico de Barras:** Top 10 por quantidade de empresas
2. **Gráfico de Pizza:** Distribuição por tipo de CNAE
3. **Gráfico de Barras Horizontais:** Por diretoria

**Tabela:**
- Colunas: Nome, Cargo, Salário, Qtd Empresas, CNPJs, Tipo Participação
- Click no CNPJ mostra detalhes da empresa
- Destaque vermelho para > 3 empresas

**Métricas de Decisão:**
- % de funcionários com conflito
- Valor em risco (salários envolvidos)
- Distribuição por cargo (quais cargos têm mais conflitos)

**Prioridade:** 🔴 CRÍTICA

---

### Página 4: Óbitos Confirmados

**Rota:** `/dashboard/comurgecedidos/obitos`

**Objetivo:** Identificar pagamentos irregulares a falecidos

**KPIs:**
1. Total Óbitos (57)
2. Folha Mensal em Risco
3. Tempo Médio Desde Óbito

**Critérios:**
- Está Morto? = "SIM"

**Gráficos:**
1. **Gráfico de Linha:** Óbitos por ano
2. **Gráfico de Barras:** Óbitos por diretoria
3. **Gráfico de Pizza:** Com data vs Sem data exata

**Tabela:**
- Colunas: Nome, CPF, Data Óbito, Cargo, Salário, Tempo Desde Óbito
- Destaque vermelho para óbitos antigos (> 1 ano)
- Soma total de salários pagos indevidamente

**Métricas de Decisão:**
- Impacto financeiro total
- Tempo médio para regularização
- Processos requeridos

**Prioridade:** 🔴 CRÍTICA

---

### Página 5: Benefícios Federais

**Rota:** `/dashboard/comurgecedidos/beneficios`

**Objetivo:** Verificar compatibilidade de benefícios com renda

**KPIs:**
1. Total Beneficiários (35)
2. Valor Total de Benefícios
3. Incompatíveis com Renda

**Critérios:**
- Recebe Benefício (BPC)? = "SIM"

**Gráficos:**
1. **Gráfico de Pizza:** Tipos de benefício
2. **Gráfico de Barras:** Benefícios por salário (faixas)
3. **Gráfico de Dispersão:** Salário vs Valor Benefício

**Tabela:**
- Colunas: Nome, Salário, Tipo Benefício, Valor, Compatível?
- Destaque para incompatibilidades
- Filtro por tipo de benefício

**Métricas de Decisão:**
- % de benefícios indevidos
- Valor total recuperável
- Ações corretivas necessárias

**Prioridade:** 🟡 ALTA

---

### Página 6: Atividade Política

**Rota:** `/dashboard/comurgecedidos/atividade-politica`

**Objetivo:** Monitorar envolvimento político

**KPIs:**
1. Candidatos (8)
2. Doadores (78)
3. Total Doado (R$)

**Seções:**

**A. Candidaturas**
- Gráfico de Barras: Candidatos por ano
- Gráfico de Pizza: Candidatos por partido
- Tabela: Nome, Cargo, Ano, Partido, Situação, Patrimônio

**B. Doações Eleitorais**
- Gráfico de Barras: Doações por ano
- Gráfico de Pizza: Doações por partido
- Tabela: Nome, Total Doado, Beneficiários, Anos

**Métricas de Decisão:**
- Compatibilidade doações vs salário
- Evolução patrimonial
- Licenças necessárias

**Prioridade:** 🟢 MÉDIA

---

### Página 7: Análise de Risco

**Rota:** `/dashboard/comurgecedidos/analise-risco`

**Objetivo:** Classificação e priorização de riscos

**KPIs:**
1. Críticos
2. Atenção
3. Regular

**Gráficos:**
1. **Gráfico de Pizza:** Distribuição por classificação
2. **Gráfico de Barras:** Por tipo de irregularidade
3. **Gráfico de Treemap:** Risco por diretoria

**Tabela:**
- Colunas: Nome, Classificação, Tipo Irregularidade, Pontuação, Ações
- Cores por nível: Vermelho (Crítico), Amarelo (Atenção), Verde (Regular)
- Filtros por classificação e tipo

**Métricas de Decisão:**
- Priorização de ações
- Recursos necessários
- Cronograma de regularização

**Prioridade:** 🟡 ALTA

---

### Página 8: Listas Restritivas

**Rota:** `/dashboard/comurgecedidos/listas-restritivas`

**Objetivo:** Sanções e alertas internacionais

**KPIs:**
1. Sanções CGU (1)
2. Alertas OFAC (260)
3. PEP Nacional

**Seções:**

**A. Sanções CGU/CEIS**
- Tabela: Nome, Tipo Sanção, Data, Órgão, Multa
- Detalhes da sanção

**B. Alertas OFAC**
- Nota: Matches por similaridade de nome
- Tabela: Nome, Score Similaridade, Lista OFAC, País
- Filtro por score > 80% (maior risco)

**Gráficos:**
1. Distribuição de scores OFAC
2. Sanções por ano

**Métricas de Decisão:**
- Verificações adicionais necessárias
- Conformidade internacional
- Documentação requerida

**Prioridade:** 🟢 MÉDIA

---

### Página 9: Relatórios e Exportações

**Rota:** `/dashboard/comurgecedidos/relatorios`

**Objetivo:** Exportar dados e gerar relatórios

**Funcionalidades:**
1. **Exportar para Excel**
   - Todos os dados
   - Dados filtrados
   - Apenas achados críticos

2. **Gerar PDF**
   - Relatório executivo
   - Relatório detalhado por página
   - Relatório de conformidade

3. **Documentação**
   - Links para:
     - RESUMO_ENTREGA_FINAL.md
     - VALIDACAO_INTEGRIDADE_DADOS.md
     - VERIFICACAO_CONFORMIDADE_CONTRATUAL.md

4. **Histórico**
   - Logs de exportações
   - Auditoria de acessos

**Prioridade:** 🟢 BAIXA (pode ser implementada por último)

---

## 6. KPIS E MÉTRICAS POR PÁGINA

### 6.1. Métricas Globais (Todas as Páginas)

**Sempre visíveis no header:**
1. Total de Funcionários
2. Grupo atual (filtro ativo)
3. Data da última atualização
4. Status da conexão

---

### 6.2. Métricas para Tomada de Decisão

#### Overview
- Folha de pagamento mensal e anual
- Custo médio por funcionário
- Distribuição por diretoria
- Taxa de crescimento (se houver histórico)

#### Achados Críticos
- % de funcionários com achados críticos
- Valor em risco (salários dos casos críticos)
- Tempo médio para resolução (se houver histórico)
- Priorização por impacto financeiro

#### Empresas Ativas
- % de funcionários com conflito empresarial
- Valor total em risco
- Distribuição por tipo de cargo
- Setores econômicos envolvidos (CNAE)

#### Óbitos
- Impacto financeiro total
- Tempo médio desde óbito
- Taxa de detecção
- Ações de recuperação necessárias

#### Benefícios
- % de benefícios potencialmente indevidos
- Valor total de benefícios
- Economia potencial com correções
- Taxa de incompatibilidade

#### Atividade Política
- Compatibilidade doações vs salário
- Evolução patrimonial
- Licenças concedidas vs necessárias
- Conflitos de interesse potenciais

#### Análise de Risco
- Distribuição de risco por diretoria
- Score médio de risco
- Casos prioritários por impacto
- Recursos necessários para regularização

#### Listas Restritivas
- Taxa de matches OFAC (por nível de confiança)
- Sanções ativas vs resolvidas
- Conformidade internacional
- Verificações pendentes

---

## 7. TODO DETALHADO

### FASE 1: PREPARAÇÃO E ESTRUTURA (2-3 dias)

#### 1.1. Setup Inicial
- [ ] Criar branch `feature/dashboard-comurg-migration`
- [ ] Criar pasta `src/components/comurg/`
- [ ] Criar pasta `src/lib/comurg/`
- [ ] Verificar instalação de dependências (recharts, papaparse)
- [ ] Configurar imports de componentes shadcn/ui necessários

#### 1.2. Context e Provider
- [ ] Criar `src/components/comurg/DataProvider.tsx`
  - [ ] Definir interface `FuncionarioCompleto` (50+ campos)
  - [ ] Implementar carregamento de `/data/comurg/empregados-todos.json`
  - [ ] Adicionar cache de dados
  - [ ] Implementar `getFuncionarioByCpf()`
  - [ ] Adicionar loading states e error handling
  - [ ] Adicionar logging para debug

- [ ] Atualizar layout para incluir DataProvider
  - [ ] Criar `src/app/dashboard/comurgecedidos/layout.tsx`
  - [ ] Envolver páginas com `<DataProvider>`
  - [ ] Manter proteção de tenant COMURG

#### 1.3. Utilitários
- [ ] Criar `src/lib/comurg/utils.ts`
  - [ ] `excelSerialToDate()` - Converter serial Excel para dd/mm/aaaa
  - [ ] `formatCurrency()` - Formatar valores em R$
  - [ ] `formatCPF()` - Formatar CPF com máscara
  - [ ] `calculateKPIs()` - Calcular KPIs dinamicamente
  - [ ] `filterByGroup()` - Filtrar por grupo
  - [ ] `filterByRisk()` - Filtrar por risco
  - [ ] `sortBy()` - Ordenação genérica

- [ ] Criar `src/lib/comurg/constants.ts`
  - [ ] Definir constantes de cores por risco
  - [ ] Definir mapeamento de colunas
  - [ ] Definir configurações de paginação

---

### FASE 2: COMPONENTES BASE (3-4 dias)

#### 2.1. KPICard
- [ ] Criar `src/components/comurg/KPICard.tsx`
  - [ ] Props: label, value, icon, color, trend (opcional)
  - [ ] Suporte a cores condicionais
  - [ ] Animação ao carregar (framer-motion)
  - [ ] Tooltip com informações adicionais
  - [ ] Responsivo

#### 2.2. GroupTabs
- [ ] Criar `src/components/comurg/GroupTabs.tsx`
  - [ ] Abas: Todos, COMURG, Cedidos
  - [ ] Contadores dinâmicos
  - [ ] Estado ativo
  - [ ] Callback onChange
  - [ ] Responsivo (stack em mobile)

#### 2.3. DataTable
- [ ] Criar `src/components/comurg/DataTable.tsx`
  - [ ] Props: data, columns, onRowClick
  - [ ] Paginação configurável
  - [ ] Ordenação por coluna
  - [ ] Formatação de células (data, moeda, etc.)
  - [ ] Linha hover effect
  - [ ] Loading skeleton
  - [ ] Empty state

#### 2.4. ColumnSelector
- [ ] Criar `src/components/comurg/ColumnSelector.tsx`
  - [ ] Lista de todas as colunas disponíveis
  - [ ] Checkbox para cada coluna
  - [ ] Botão "Todas" / "Padrão"
  - [ ] Persistência em localStorage
  - [ ] Interface modal ou dropdown
  - [ ] Busca de colunas

#### 2.5. Sidebar de Navegação
- [ ] Criar `src/components/comurg/Sidebar.tsx`
  - [ ] Links para todas as páginas
  - [ ] Ícones por página (lucide-react)
  - [ ] Indicador de página ativa
  - [ ] Badges de alerta ("URGENTE" em Achados Críticos)
  - [ ] Colapsar em mobile
  - [ ] Animação de abertura/fechamento

---

### FASE 3: COMPONENTES DE GRÁFICOS (2-3 dias)

#### 3.1. Wrappers de Recharts
- [ ] Criar `src/components/comurg/charts/BarChart.tsx`
  - [ ] Props: data, xKey, yKey, colors
  - [ ] Tooltips personalizados
  - [ ] Responsivo
  - [ ] Loading state

- [ ] Criar `src/components/comurg/charts/LineChart.tsx`
  - [ ] Props: data, xKey, yKey, colors
  - [ ] Múltiplas linhas (opcional)
  - [ ] Área preenchida (opcional)
  - [ ] Legendas

- [ ] Criar `src/components/comurg/charts/PieChart.tsx`
  - [ ] Props: data, labelKey, valueKey, colors
  - [ ] Percentuais
  - [ ] Legendas
  - [ ] Animação

- [ ] Criar `src/components/comurg/charts/TreemapChart.tsx`
  - [ ] Para visualização hierárquica
  - [ ] Hover effects

#### 3.2. Dashboard de KPIs
- [ ] Criar `src/components/comurg/KPIDashboard.tsx`
  - [ ] Grid responsivo de KPICards
  - [ ] Carregamento dinâmico
  - [ ] Animação de entrada

---

### FASE 4: PÁGINA PRINCIPAL - OVERVIEW (3-4 dias)

#### 4.1. Atualizar Overview
- [ ] Modificar `src/app/dashboard/comurgecedidos/page.tsx`
  - [ ] Remover código atual de tabela simples
  - [ ] Importar DataProvider e useData
  - [ ] Adicionar Header com título e descrição
  - [ ] Implementar Grid de KPIs (5 cards):
    - [ ] Total Funcionários
    - [ ] COMURG
    - [ ] Cedidos
    - [ ] Folha Mensal
    - [ ] Folha Anual
  - [ ] Adicionar seção de Filtros e Busca:
    - [ ] Campo de busca
    - [ ] GroupTabs
    - [ ] Botão "Selecionar Colunas"
  - [ ] Implementar ColumnSelector
  - [ ] Implementar Tabela Principal:
    - [ ] Colunas dinâmicas baseadas em seleção
    - [ ] Paginação (20 registros/página)
    - [ ] Click no nome abre modal
  - [ ] Adicionar contador "Mostrando X a Y de Z"
  - [ ] Implementar persistência de estado (localStorage)

#### 4.2. Testes da Overview
- [ ] Testar carregamento de dados
- [ ] Testar filtros por grupo
- [ ] Testar busca
- [ ] Testar seletor de colunas
- [ ] Testar paginação
- [ ] Testar modal de funcionário
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Testar performance (5.950 registros)

---

### FASE 5: PÁGINAS SECUNDÁRIAS (5-7 dias)

#### 5.1. Achados Críticos
- [ ] Criar `src/app/dashboard/comurgecedidos/achados-criticos/page.tsx`
  - [ ] Header com título e badge "URGENTE"
  - [ ] GroupTabs
  - [ ] Grid de KPIs (3 cards)
  - [ ] Seção de Gráficos:
    - [ ] Top 10 por nº de empresas (BarChart)
    - [ ] Distribuição por tipo (PieChart)
    - [ ] Tendência mensal (LineChart)
  - [ ] Tabela de achados
  - [ ] Filtros avançados
  - [ ] Ordenação por gravidade

#### 5.2. Empresas Ativas
- [ ] Criar `src/app/dashboard/comurgecedidos/empresas/page.tsx`
  - [ ] Header
  - [ ] GroupTabs
  - [ ] Grid de KPIs (3 cards)
  - [ ] Seção de Gráficos:
    - [ ] Top 10 por qtd empresas (BarChart)
    - [ ] Distribuição por CNAE (PieChart)
    - [ ] Por diretoria (BarChart horizontal)
  - [ ] Tabela com CNPJs
  - [ ] Destaque para > 3 empresas
  - [ ] Click em CNPJ mostra detalhes

#### 5.3. Óbitos Confirmados
- [ ] Criar `src/app/dashboard/comurgecedidos/obitos/page.tsx`
  - [ ] Header
  - [ ] GroupTabs
  - [ ] Grid de KPIs (3 cards)
  - [ ] Seção de Gráficos:
    - [ ] Óbitos por ano (LineChart)
    - [ ] Por diretoria (BarChart)
    - [ ] Com/sem data (PieChart)
  - [ ] Tabela de óbitos
  - [ ] Cálculo de impacto financeiro
  - [ ] Destaque para óbitos antigos

#### 5.4. Benefícios Federais
- [ ] Criar `src/app/dashboard/comurgecedidos/beneficios/page.tsx`
  - [ ] Header
  - [ ] GroupTabs
  - [ ] Grid de KPIs (3 cards)
  - [ ] Seção de Gráficos:
    - [ ] Tipos de benefício (PieChart)
    - [ ] Benefícios por faixa salarial (BarChart)
    - [ ] Salário vs Valor Benefício (ScatterChart)
  - [ ] Tabela de beneficiários
  - [ ] Destaque para incompatibilidades
  - [ ] Filtro por tipo de benefício

#### 5.5. Atividade Política
- [ ] Criar `src/app/dashboard/comurgecedidos/atividade-politica/page.tsx`
  - [ ] Header
  - [ ] GroupTabs
  - [ ] Grid de KPIs (3 cards)
  - [ ] Seção A - Candidaturas:
    - [ ] Gráfico: Candidatos por ano (BarChart)
    - [ ] Gráfico: Por partido (PieChart)
    - [ ] Tabela de candidatos
  - [ ] Seção B - Doações:
    - [ ] Gráfico: Doações por ano (BarChart)
    - [ ] Gráfico: Por partido (PieChart)
    - [ ] Tabela de doadores
  - [ ] Análise de compatibilidade

#### 5.6. Análise de Risco
- [ ] Criar `src/app/dashboard/comurgecedidos/analise-risco/page.tsx`
  - [ ] Header
  - [ ] GroupTabs
  - [ ] Grid de KPIs (3 cards)
  - [ ] Seção de Gráficos:
    - [ ] Distribuição por classificação (PieChart)
    - [ ] Por tipo de irregularidade (BarChart)
    - [ ] Risco por diretoria (TreemapChart)
  - [ ] Tabela com cores por nível
  - [ ] Filtros por classificação e tipo
  - [ ] Priorização de ações

#### 5.7. Listas Restritivas
- [ ] Criar `src/app/dashboard/comurgecedidos/listas-restritivas/page.tsx`
  - [ ] Header
  - [ ] GroupTabs
  - [ ] Grid de KPIs (3 cards)
  - [ ] Seção A - Sanções CGU:
    - [ ] Tabela de sanções
    - [ ] Detalhes da sanção
  - [ ] Seção B - Alertas OFAC:
    - [ ] Nota explicativa (similaridade)
    - [ ] Tabela de matches
    - [ ] Filtro por score
  - [ ] Gráficos:
    - [ ] Distribuição scores OFAC (BarChart)
    - [ ] Sanções por ano (LineChart)

#### 5.8. Relatórios
- [ ] Criar `src/app/dashboard/comurgecedidos/relatorios/page.tsx`
  - [ ] Header
  - [ ] Seção "Exportar Dados":
    - [ ] Botão "Exportar para Excel" (todos os dados)
    - [ ] Botão "Exportar Filtrados" (dados atuais)
    - [ ] Botão "Exportar Achados Críticos"
  - [ ] Seção "Gerar Relatórios PDF":
    - [ ] Relatório Executivo
    - [ ] Relatório Detalhado
    - [ ] Relatório de Conformidade
  - [ ] Seção "Documentação":
    - [ ] Links para documentos .md
    - [ ] Download de documentos
  - [ ] Seção "Histórico":
    - [ ] Log de exportações
    - [ ] Auditoria de acessos

---

### FASE 6: FUNCIONALIDADES AVANÇADAS (2-3 dias)

#### 6.1. Exportação para Excel
- [ ] Criar `src/lib/comurg/export-excel.ts`
  - [ ] Usar biblioteca `xlsx` (já instalada)
  - [ ] Função `exportToExcel(data, filename)`
  - [ ] Formatação de colunas
  - [ ] Múltiplas sheets (opcional)

#### 6.2. Geração de PDF
- [ ] Criar `src/lib/comurg/export-pdf.ts`
  - [ ] Usar `jspdf` e `jspdf-autotable` (já instaladas)
  - [ ] Templates de relatórios
  - [ ] Incluir KPIs e gráficos
  - [ ] Formatação profissional

#### 6.3. Filtros Avançados
- [ ] Criar `src/components/comurg/AdvancedFilters.tsx`
  - [ ] Filtro por faixa salarial
  - [ ] Filtro por diretoria
  - [ ] Filtro por tipo de achado
  - [ ] Filtro por período
  - [ ] Combinação de filtros

#### 6.4. Busca Avançada
- [ ] Criar `src/components/comurg/AdvancedSearch.tsx`
  - [ ] Busca em múltiplos campos
  - [ ] Busca fuzzy (aproximada)
  - [ ] Autocomplete
  - [ ] Histórico de buscas

---

### FASE 7: OTIMIZAÇÕES (2-3 dias)

#### 7.1. Performance
- [ ] Implementar virtualização para tabelas grandes
  - [ ] Usar `react-window` (já instalado)
  - [ ] Renderizar apenas linhas visíveis
- [ ] Memoização de cálculos pesados
  - [ ] `useMemo` para KPIs
  - [ ] `useMemo` para filtros
- [ ] Lazy loading de componentes
  - [ ] `React.lazy()` para páginas
  - [ ] `Suspense` com fallbacks
- [ ] Otimizar gráficos
  - [ ] Reduzir pontos de dados quando necessário
  - [ ] Debounce em atualizações

#### 7.2. UX/UI
- [ ] Adicionar loading skeletons
  - [ ] Para KPIs
  - [ ] Para tabelas
  - [ ] Para gráficos
- [ ] Adicionar empty states
  - [ ] Sem dados encontrados
  - [ ] Sem resultados de busca
- [ ] Adicionar tooltips informativos
  - [ ] Em KPIs
  - [ ] Em colunas da tabela
  - [ ] Em gráficos
- [ ] Adicionar animações suaves
  - [ ] Framer Motion em cards
  - [ ] Transições entre páginas
  - [ ] Fade in/out

#### 7.3. Acessibilidade
- [ ] Adicionar aria-labels
- [ ] Garantir navegação por teclado
- [ ] Contraste de cores adequado
- [ ] Leitores de tela
- [ ] Focus indicators

---

### FASE 8: TESTES E QA (3-4 dias)

#### 8.1. Testes Funcionais
- [ ] Testar carregamento de dados em todas as páginas
- [ ] Testar filtros em todas as páginas
- [ ] Testar busca em todas as páginas
- [ ] Testar paginação
- [ ] Testar ordenação
- [ ] Testar modais
- [ ] Testar exportações
- [ ] Testar proteção de tenant

#### 8.2. Testes de Performance
- [ ] Medir tempo de carregamento inicial
- [ ] Medir tempo de renderização de tabelas
- [ ] Medir tempo de filtros
- [ ] Monitorar uso de memória
- [ ] Testar com 5.950 registros
- [ ] Lighthouse audit

#### 8.3. Testes de Responsividade
- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Landscape vs Portrait
- [ ] Diferentes navegadores (Chrome, Firefox, Safari, Edge)

#### 8.4. Testes de Usabilidade
- [ ] Fluxo de navegação
- [ ] Clareza de informações
- [ ] Facilidade de encontrar dados
- [ ] Feedback visual
- [ ] Mensagens de erro

---

### FASE 9: DOCUMENTAÇÃO (1-2 dias)

#### 9.1. Documentação Técnica
- [ ] Criar `DASHBOARD_COMURG_README.md`
  - [ ] Arquitetura do dashboard
  - [ ] Componentes principais
  - [ ] Fluxo de dados
  - [ ] Como adicionar novas páginas
  - [ ] Como customizar KPIs
- [ ] Documentar APIs e funções
  - [ ] JSDoc em componentes
  - [ ] Tipos TypeScript bem definidos
- [ ] Criar guia de estilo
  - [ ] Padrões de código
  - [ ] Padrões de UI

#### 9.2. Documentação de Usuário
- [ ] Criar `GUIA_USO_DASHBOARD.md`
  - [ ] Como navegar
  - [ ] Como usar filtros
  - [ ] Como exportar dados
  - [ ] Como interpretar KPIs
  - [ ] FAQ

---

### FASE 10: DEPLOY E MONITORAMENTO (1-2 dias)

#### 10.1. Deploy
- [ ] Testar build de produção localmente
  - [ ] `npm run build`
  - [ ] Verificar erros
  - [ ] Testar em modo production
- [ ] Merge para branch main
- [ ] Deploy no Cloudflare Pages
  - [ ] Verificar variáveis de ambiente
  - [ ] Configurar domínio
- [ ] Testar em produção
  - [ ] https://investigaree.com.br/dashboard/comurgecedidos

#### 10.2. Monitoramento
- [ ] Configurar analytics
  - [ ] Páginas mais acessadas
  - [ ] Tempo médio por página
  - [ ] Taxa de conversão de ações
- [ ] Configurar error tracking
  - [ ] Sentry ou similar
  - [ ] Logs de erros
- [ ] Configurar alertas
  - [ ] Erros críticos
  - [ ] Performance degradada

#### 10.3. Treinamento
- [ ] Preparar apresentação para cliente
- [ ] Demonstração ao vivo
- [ ] Responder dúvidas
- [ ] Coletar feedback

---

## 8. CRONOGRAMA

### Estimativa Total: 25-35 dias úteis (~5-7 semanas)

**Semana 1 (Dias 1-5):**
- FASE 1: Preparação e Estrutura (2-3 dias)
- FASE 2: Componentes Base (início)

**Semana 2 (Dias 6-10):**
- FASE 2: Componentes Base (conclusão, 3-4 dias)
- FASE 3: Componentes de Gráficos (2-3 dias)

**Semana 3 (Dias 11-15):**
- FASE 4: Página Principal - Overview (3-4 dias)

**Semana 4 (Dias 16-20):**
- FASE 5: Páginas Secundárias (início, 5-7 dias)

**Semana 5 (Dias 21-25):**
- FASE 5: Páginas Secundárias (conclusão)

**Semana 6 (Dias 26-30):**
- FASE 6: Funcionalidades Avançadas (2-3 dias)
- FASE 7: Otimizações (2-3 dias)

**Semana 7 (Dias 31-35):**
- FASE 8: Testes e QA (3-4 dias)
- FASE 9: Documentação (1-2 dias)
- FASE 10: Deploy e Monitoramento (1-2 dias)

---

## 9. CHECKLIST DE VERIFICAÇÃO

### Antes de Começar
- [ ] Backup do código atual
- [ ] Branch criada
- [ ] Dependências verificadas
- [ ] Estrutura de pastas planejada

### Durante o Desenvolvimento
- [ ] Commits frequentes com mensagens claras
- [ ] Code review próprio antes de commit
- [ ] Testes manuais de cada componente
- [ ] Documentação inline (JSDoc)

### Antes do Deploy
- [ ] Todos os TODOs implementados
- [ ] Todos os testes passando
- [ ] Build de produção sem erros
- [ ] Performance otimizada (Lighthouse > 90)
- [ ] Acessibilidade validada
- [ ] Responsividade testada
- [ ] Cross-browser testado
- [ ] Proteção de tenant funcionando
- [ ] Dados carregando corretamente
- [ ] Exportações funcionando
- [ ] Documentação completa

### Após o Deploy
- [ ] Dashboard acessível em produção
- [ ] Sem erros no console
- [ ] Performance aceitável
- [ ] Analytics configurado
- [ ] Error tracking ativo
- [ ] Cliente notificado
- [ ] Treinamento agendado

---

## 10. RISCOS E MITIGAÇÕES

### Risco 1: Performance com 5.950 registros
**Mitigação:**
- Virtualização de tabelas (react-window)
- Paginação
- Lazy loading
- Memoização de cálculos

### Risco 2: Incompatibilidade de dados JSON vs CSV
**Mitigação:**
- Validar estrutura do JSON
- Criar interface TypeScript completa
- Testes extensivos com dados reais

### Risco 3: Gráficos pesados
**Mitigação:**
- Limitar pontos de dados
- Usar throttle/debounce
- Lazy load de gráficos
- Cache de resultados

### Risco 4: Responsividade em mobile
**Mitigação:**
- Mobile-first approach
- Testes em dispositivos reais
- Tabelas horizontalmente scroll áveis
- Gráficos adaptáveis

### Risco 5: Proteção de tenant falhar
**Mitigação:**
- Testes rigorosos de autenticação
- Verificação server-side e client-side
- Logging de tentativas de acesso
- Fallback para página de erro

---

## 11. NOTAS IMPORTANTES

1. **Fonte da Verdade:** O único arquivo de dados é `public/data/comurg/empregados-todos.json`. NÃO usar banco SQLite.

2. **Compatibilidade:** O InvestigaRee já tem TODAS as dependências necessárias (recharts, papaparse, lucide-react).

3. **Reuso de Código:** Aproveitar componentes existentes do InvestigaRee (Cards, Buttons, etc.) e do dashboard local.

4. **Performance:** Com 5.950 registros, otimização é crítica. Usar virtualização e memoização.

5. **Proteção:** Manter proteção de tenant em TODAS as páginas, não apenas na principal.

6. **Responsividade:** Dashboard deve funcionar perfeitamente em mobile, tablet e desktop.

7. **Gráficos:** Recharts já está instalado - aproveitar!

8. **Exportações:** Usar `xlsx` e `jspdf` que já estão instalados.

9. **UX:** Foco em decisores - KPIs claros, métricas acionáveis, visualizações intuitivas.

10. **Documentação:** Documentar TUDO para facilitar manutenção futura.

---

## 12. PRÓXIMOS PASSOS IMEDIATOS

**Após aprovação deste plano:**

1. Criar branch `feature/dashboard-comurg-migration`
2. Iniciar FASE 1: Preparação e Estrutura
3. Criar estrutura de pastas
4. Implementar DataProvider
5. Testar carregamento de dados JSON

**NÃO COMEÇAR A IMPLEMENTAÇÃO SEM APROVAÇÃO DESTE PLANO!**

---

**Documento criado em:** 10/12/2025
**Versão:** 1.0.0
**Status:** AGUARDANDO APROVAÇÃO

---

📄 **Plano de Migração - Dashboard COMURG para InvestigaRee**
