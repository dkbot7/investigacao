# 📋 PLANO COMPLETO - PÁGINA ANÁLISE DE RISCO (TENANT COMURG)

**Data:** 10/12/2025
**Responsável:** Agente de Implementação
**Rota:** `/dashboard/comurganaliserisco`
**Objetivo:** Implementar página de Análise de Risco com classificação e visualização por níveis

---

## 📚 ÍNDICE

1. [Objetivo e Visão Geral](#1-objetivo-e-visão-geral)
2. [Análise de Dados](#2-análise-de-dados)
3. [Estrutura Visual Completa](#3-estrutura-visual-completa)
4. [Componente GroupTabs](#4-componente-grouptabs)
5. [Implementação Passo a Passo](#5-implementação-passo-a-passo)
6. [Código Completo](#6-código-completo)
7. [Navegação no Sidebar](#7-navegação-no-sidebar)
8. [Testes e Validação](#8-testes-e-validação)
9. [Checklist Final](#9-checklist-final)

---

## 1. OBJETIVO E VISÃO GERAL

### 1.1. O Que Será Implementado

Criar a página **Análise de Risco** no InvestigaRee, exibindo funcionários classificados por níveis de risco:
- **Crítico** - Funcionários com múltiplos achados graves
- **Atenção** - Funcionários com achados que requerem análise
- **Regular** - Funcionários sem achados significativos

### 1.2. Rota de Acesso

```
Desenvolvimento: http://localhost:3000/dashboard/comurganaliserisco
Produção: https://investigaree.com.br/dashboard/comurganaliserisco
```

### 1.3. Características Principais

✅ **Proteção de tenant** - Apenas COMURG
✅ **3 KPIs com percentuais** - Crítico, Atenção, Regular
✅ **Filtro por grupo** - Todos, COMURG, Cedidos
✅ **Barras de progresso** - Visualização da distribuição
✅ **Cores semafóricas** - Vermelho, Amarelo, Verde
✅ **Cálculo automático** - Percentuais dinâmicos

### 1.4. Padrão COMURG

Seguir **EXATAMENTE** o padrão das páginas existentes:
- `/dashboard/comurgecedidos`
- `/dashboard/comurgachadoscriticos`
- `/dashboard/comurgobitos`
- `/dashboard/comurgempresas`
- `/dashboard/comurgatividadepolitica`

---

## 2. ANÁLISE DE DADOS

### 2.1. Fonte de Dados

**Context:** `useComurgData()` que carrega `dados_consolidados.csv`

**Hook:** Importar de `@/contexts/ComurgDataContext`

### 2.2. Campo de Classificação de Risco

| Campo | Tipo | Valores Possíveis | Descrição |
|-------|------|-------------------|-----------|
| `classificacao_risco` | string | "Critico", "Alto", "Atencao", "Baixo", "Regular", "" | Nível de risco calculado |

### 2.3. Lógica de Classificação

**CRÍTICO:**
```typescript
classificacao_risco === "Critico"
```

**ATENÇÃO:**
```typescript
classificacao_risco === "Alto" OU classificacao_risco === "Atencao"
```

**REGULAR:**
```typescript
classificacao_risco === "Baixo" OU
classificacao_risco === "Regular" OU
classificacao_risco === "" OU
classificacao_risco === null
```

### 2.4. Filtros por Grupo

**Todos:**
- Retorna todos os 5.950 funcionários

**COMURG:**
```typescript
grupo === "COMURG" (4.591 funcionários esperados)
```

**Cedidos:**
```typescript
grupo === "DISPOSICAO" OU grupo === "CEDIDOS" (1.359 funcionários esperados)
```

### 2.5. Cálculos Necessários

**Contadores:**
```typescript
const criticos = funcionarios.filter(f =>
  f.classificacao_risco === "Critico"
).length;

const atencao = funcionarios.filter(f =>
  f.classificacao_risco === "Alto" || f.classificacao_risco === "Atencao"
).length;

const regular = funcionarios.filter(f =>
  f.classificacao_risco === "Baixo" ||
  f.classificacao_risco === "Regular" ||
  !f.classificacao_risco ||
  f.classificacao_risco === ""
).length;
```

**Percentuais:**
```typescript
const percentualCritico = total > 0 ? (criticos / total) * 100 : 0;
const percentualAtencao = total > 0 ? (atencao / total) * 100 : 0;
const percentualRegular = total > 0 ? (regular / total) * 100 : 0;
```

---

## 3. ESTRUTURA VISUAL COMPLETA

### 3.1. Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│ [Shield Icon] Análise de Risco                                 │
│ Classificação por níveis de risco dos funcionários             │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ [Todos: 5950] [COMURG: 4591] [Cedidos: 1359]                  │  <-- GroupTabs
└────────────────────────────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ CRÍTICO      │ │ ATENÇÃO      │ │ REGULAR      │
│ 127          │ │ 458          │ │ 5365         │
│ 2.1% do total│ │ 7.7% do total│ │ 90.2% total  │
│ [Alert Icon] │ │ [Alert Icon] │ │ [Check Icon] │
└──────────────┘ └──────────────┘ └──────────────┘
   Vermelho         Amarelo          Verde

┌────────────────────────────────────────────────────────────────┐
│ Distribuição de Risco                                          │
│ Total de funcionários analisados: 5.950                        │
│                                                                │
│ Critico     [██░░░░░░░░░░░░░░░] 127 (2.1%)                    │
│ Atenção     [████░░░░░░░░░░░░░] 458 (7.7%)                    │
│ Regular     [███████████████████] 5365 (90.2%)                 │
└────────────────────────────────────────────────────────────────┘
```

### 3.2. Cores e Ícones

**KPI Cards:**
- **Crítico:** Vermelho (`bg-red-50`, `border-red-200`, `text-red-700`) + `AlertTriangle`
- **Atenção:** Amarelo (`bg-yellow-50`, `border-yellow-200`, `text-yellow-700`) + `AlertTriangle`
- **Regular:** Verde (`bg-green-50`, `border-green-200`, `text-green-700`) + `CheckCircle`

**Barras de Progresso:**
- Crítico: `bg-red-500`
- Atenção: `bg-yellow-500`
- Regular: `bg-green-500`

**Header:**
- Ícone: `Shield` (lucide-react)

---

## 4. COMPONENTE GROUPTABS

### 4.1. Por Que Precisamos Desse Componente?

O **GroupTabs** é um componente **REUTILIZÁVEL** que permite filtrar funcionários por grupo (Todos, COMURG, Cedidos). Este componente será usado em MÚLTIPLAS páginas do dashboard COMURG.

### 4.2. Criar o Componente

**⚠️ IMPORTANTE:** Este componente deve ser criado ANTES da página de Análise de Risco.

**Arquivo:** `src/components/GroupTabs.tsx`

```typescript
"use client";

import { Users, Building2, ArrowLeftRight } from "lucide-react";

export type GroupFilter = "todos" | "comurg" | "cedidos";

interface GroupTabsProps {
  activeTab: GroupFilter;
  onTabChange: (tab: GroupFilter) => void;
  counts?: {
    todos: number;
    comurg: number;
    cedidos: number;
  };
}

export function GroupTabs({ activeTab, onTabChange, counts }: GroupTabsProps) {
  const tabs: Array<{ id: GroupFilter; label: string; icon: React.ElementType }> = [
    { id: "todos", label: "Todos", icon: Users },
    { id: "comurg", label: "COMURG", icon: Building2 },
    { id: "cedidos", label: "Cedidos", icon: ArrowLeftRight },
  ];

  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const count = counts?.[tab.id];

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-blue-500 text-white shadow-md"
                : "bg-navy-800 border border-navy-700 text-white/70 hover:bg-navy-700 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {count !== undefined && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-navy-700 text-white/60"
                }`}
              >
                {count.toLocaleString("pt-BR")}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Função auxiliar para filtrar dados por grupo
 */
export function filterByGroup<T extends { grupo?: string }>(
  data: T[],
  activeTab: GroupFilter
): T[] {
  if (activeTab === "todos") return data;

  return data.filter((item) => {
    const grupo = String(item.grupo || "").toUpperCase();

    if (activeTab === "comurg") {
      return grupo === "COMURG" || grupo.includes("COMURG");
    }

    if (activeTab === "cedidos") {
      return (
        grupo === "DISPOSICAO" ||
        grupo.includes("DISPOSICAO") ||
        grupo.includes("CEDIDOS")
      );
    }

    return true;
  });
}

/**
 * Função auxiliar para calcular contadores por grupo
 */
export function getGroupCounts<T extends { grupo?: string }>(data: T[]): {
  todos: number;
  comurg: number;
  cedidos: number;
} {
  const comurg = data.filter((item) => {
    const grupo = String(item.grupo || "").toUpperCase();
    return grupo === "COMURG" || grupo.includes("COMURG");
  }).length;

  const cedidos = data.filter((item) => {
    const grupo = String(item.grupo || "").toUpperCase();
    return (
      grupo === "DISPOSICAO" ||
      grupo.includes("DISPOSICAO") ||
      grupo.includes("CEDIDOS")
    );
  }).length;

  return {
    todos: data.length,
    comurg,
    cedidos,
  };
}
```

**Checklist Componente GroupTabs:**
- [ ] Criar arquivo `src/components/GroupTabs.tsx`
- [ ] Copiar código completo acima
- [ ] Verificar imports (Users, Building2, ArrowLeftRight)
- [ ] Adaptar cores para padrão COMURG (navy-800, navy-700)
- [ ] Exportar type `GroupFilter`
- [ ] Exportar funções `filterByGroup` e `getGroupCounts`
- [ ] Testar que componente compila sem erros

---

## 5. IMPLEMENTAÇÃO PASSO A PASSO

### PASSO 1: Criar Arquivo Base

**Arquivo:** `src/app/dashboard/comurganaliserisco/page.tsx`

**Estrutura inicial:**

```typescript
"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";
import { useComurgData } from "@/contexts/ComurgDataContext";
import { GroupTabs, GroupFilter, filterByGroup, getGroupCounts } from "@/components/GroupTabs";

export default function ComurgAnaliseRisco() {
  const { userInfo, loading: authLoading } = useUserAccess();
  const { funcionarios, loading: dataLoading, error } = useComurgData();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<GroupFilter>("todos");

  // Proteção: apenas usuários do tenant COMURG podem acessar
  useEffect(() => {
    if (!authLoading && userInfo?.tenant?.code !== 'COMURG') {
      router.push('/dashboard');
    }
  }, [userInfo, authLoading, router]);

  // TODO: Implementar lógica

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px] bg-white dark:bg-navy-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-white/60">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Bloquear renderização se não for COMURG
  if (userInfo?.tenant?.code !== 'COMURG') {
    return null;
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 lg:p-8 bg-white dark:bg-navy-950">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 text-center">
            Erro ao carregar dados
          </h3>
          <p className="text-red-700 dark:text-red-300 text-center mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 bg-white dark:bg-navy-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Conteúdo da página */}
      </motion.div>
    </div>
  );
}
```

**Checklist PASSO 1:**
- [ ] Criar arquivo `src/app/dashboard/comurganaliserisco/page.tsx`
- [ ] Adicionar todos os imports necessários
- [ ] Implementar proteção de tenant com useEffect
- [ ] Adicionar loading state (spinner + texto)
- [ ] Adicionar error state (card vermelho)
- [ ] Adicionar bloqueio de renderização
- [ ] Import do GroupTabs e funções auxiliares
- [ ] Testar que página carrega vazia
- [ ] Verificar redirecionamento se não for COMURG

---

### PASSO 2: Filtrar e Classificar Funcionários

**Adicionar após a linha de `useEffect`:**

```typescript
// Filtrar funcionários por grupo (usando GroupTabs)
const funcionariosFiltrados = useMemo(() => {
  return filterByGroup(funcionarios, activeTab);
}, [funcionarios, activeTab]);

// Calcular distribuição de risco
const criticos = useMemo(() => {
  return funcionariosFiltrados.filter(f =>
    f.classificacao_risco === "Critico"
  ).length;
}, [funcionariosFiltrados]);

const atencao = useMemo(() => {
  return funcionariosFiltrados.filter(f =>
    f.classificacao_risco === "Alto" || f.classificacao_risco === "Atencao"
  ).length;
}, [funcionariosFiltrados]);

const regular = useMemo(() => {
  return funcionariosFiltrados.filter(f =>
    f.classificacao_risco === "Baixo" ||
    f.classificacao_risco === "Regular" ||
    !f.classificacao_risco ||
    f.classificacao_risco === ""
  ).length;
}, [funcionariosFiltrados]);

const total = funcionariosFiltrados.length;

// Calcular contadores para as abas (usando todos os funcionários, não filtrados)
const tabCounts = useMemo(() => {
  return getGroupCounts(funcionarios);
}, [funcionarios]);

// Preparar dados para as barras de progresso
const dadosDistribuicao = useMemo(() => [
  { risco: "Crítico", total: criticos, cor: "bg-red-500" },
  { risco: "Atenção", total: atencao, cor: "bg-yellow-500" },
  { risco: "Regular", total: regular, cor: "bg-green-500" },
], [criticos, atencao, regular]);
```

**Checklist PASSO 2:**
- [ ] Implementar filtro por grupo com `filterByGroup`
- [ ] Implementar contagem de críticos
- [ ] Implementar contagem de atenção (Alto OU Atencao)
- [ ] Implementar contagem de regular (Baixo/Regular/vazio)
- [ ] Calcular total de funcionários filtrados
- [ ] Calcular `tabCounts` para as abas
- [ ] Preparar array `dadosDistribuicao`
- [ ] Testar cálculos com `console.log`

---

### PASSO 3: Implementar Header

**Dentro do `<motion.div>`, adicionar:**

```typescript
{/* Header */}
<div>
  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
    <Shield className="w-8 h-8 text-blue-400" />
    Análise de Risco
  </h1>
  <p className="text-slate-600 dark:text-white/60 mt-2">
    Classificação por níveis de risco dos funcionários - {total.toLocaleString("pt-BR")} analisados
  </p>
</div>
```

**Checklist PASSO 3:**
- [ ] Adicionar header com título
- [ ] Usar ícone `Shield` (lucide-react) azul
- [ ] Adicionar contador dinâmico
- [ ] Texto descritivo
- [ ] Testar responsividade

---

### PASSO 4: Implementar GroupTabs (Filtro)

**Adicionar após o header:**

```typescript
{/* Abas de Grupo */}
<GroupTabs
  activeTab={activeTab}
  onTabChange={setActiveTab}
  counts={tabCounts}
/>
```

**Checklist PASSO 4:**
- [ ] Adicionar componente `GroupTabs`
- [ ] Passar `activeTab` state
- [ ] Passar função `setActiveTab`
- [ ] Passar `tabCounts` com contadores
- [ ] Testar click nas abas
- [ ] Verificar que contadores mudam
- [ ] Verificar estilo ativo (azul)

---

### PASSO 5: Implementar KPI Cards

**Adicionar após o GroupTabs:**

```typescript
{/* KPI Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Card 1: Crítico */}
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">CRÍTICO</p>
        <p className="text-4xl font-bold text-red-700 dark:text-red-500">
          {criticos}
        </p>
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
          {total > 0 ? ((criticos / total) * 100).toFixed(1) : 0}% do total
        </p>
      </div>
      <AlertTriangle className="w-16 h-16 text-red-500" />
    </div>
  </div>

  {/* Card 2: Atenção */}
  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">ATENÇÃO</p>
        <p className="text-4xl font-bold text-yellow-700 dark:text-yellow-500">
          {atencao}
        </p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
          {total > 0 ? ((atencao / total) * 100).toFixed(1) : 0}% do total
        </p>
      </div>
      <AlertTriangle className="w-16 h-16 text-yellow-500" />
    </div>
  </div>

  {/* Card 3: Regular */}
  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-green-600 dark:text-green-400 font-medium">REGULAR</p>
        <p className="text-4xl font-bold text-green-700 dark:text-green-500">
          {regular}
        </p>
        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
          {total > 0 ? ((regular / total) * 100).toFixed(1) : 0}% do total
        </p>
      </div>
      <CheckCircle className="w-16 h-16 text-green-500" />
    </div>
  </div>
</div>
```

**Checklist PASSO 5:**
- [ ] Implementar 3 KPI cards
- [ ] Card 1: Crítico (vermelho) com ícone AlertTriangle
- [ ] Card 2: Atenção (amarelo) com ícone AlertTriangle
- [ ] Card 3: Regular (verde) com ícone CheckCircle
- [ ] Percentual calculado dinamicamente
- [ ] Formatação de número com 1 casa decimal
- [ ] Background e borders corretos (light/dark mode)
- [ ] Testar responsividade (grid md:grid-cols-3)

---

### PASSO 6: Implementar Card de Distribuição com Barras

**Adicionar após os KPIs:**

```typescript
{/* Card de Distribuição de Risco */}
<div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
    <Shield className="w-6 h-6 text-blue-400" />
    Distribuição de Risco
  </h2>
  <p className="text-white/60 mb-6">
    Total de funcionários analisados:{" "}
    <span className="font-bold text-white">{total.toLocaleString("pt-BR")}</span>
  </p>

  <div className="space-y-6">
    {dadosDistribuicao.map((item) => {
      const percent = total > 0 ? (item.total / total) * 100 : 0;

      return (
        <div key={item.risco}>
          <div className="flex justify-between mb-2">
            <span className="font-medium text-white">{item.risco}</span>
            <span className="text-white/60">
              {item.total.toLocaleString("pt-BR")} ({percent.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-navy-800 rounded-full h-4">
            <div
              className={`${item.cor} h-4 rounded-full transition-all duration-500`}
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      );
    })}
  </div>
</div>
```

**Checklist PASSO 6:**
- [ ] Implementar card com background navy-900
- [ ] Header com ícone Shield
- [ ] Texto com total formatado
- [ ] 3 barras de progresso (map sobre `dadosDistribuicao`)
- [ ] Labels com nome do risco
- [ ] Valores absolutos e percentuais
- [ ] Barra com width dinâmico (`style={{ width }}`)
- [ ] Cores corretas (red/yellow/green)
- [ ] Background da barra: navy-800
- [ ] Transição suave (transition-all duration-500)
- [ ] Testar com diferentes filtros de grupo

---

### PASSO 7: Implementar Alerta Informativo

**Adicionar após o card de distribuição:**

```typescript
{/* Alerta Informativo */}
<div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
  <div className="flex items-start">
    <Shield className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" />
    <div>
      <p className="font-bold text-blue-800 dark:text-blue-400">
        SOBRE A CLASSIFICAÇÃO DE RISCO
      </p>
      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
        A classificação de risco é calculada automaticamente com base em múltiplos achados:
        óbitos confirmados, vínculos empresariais ativos, doações incompatíveis com renda,
        acumulação de cargos, e outros indicadores. Funcionários classificados como
        "Crítico" requerem análise prioritária.
      </p>
    </div>
  </div>
</div>
```

**Checklist PASSO 7:**
- [ ] Implementar alerta informativo azul
- [ ] Border-left azul
- [ ] Ícone Shield
- [ ] Texto explicativo sobre classificação
- [ ] Background azul claro/escuro (light/dark mode)

---

## 6. CÓDIGO COMPLETO

**Arquivo completo de referência:**

O código completo está dividido nas seções acima (Passos 1-7). Para referência, consultar:
- Dashboard local: `dashboard-comurg/app/analise-risco/page.tsx`
- Páginas similares no InvestigaRee

---

## 7. NAVEGAÇÃO NO SIDEBAR

### 7.1. Adicionar Link no Layout

**Arquivo:** `src/app/dashboard/layout.tsx`

**Localizar o array `comurgNavItems` (linha ~64):**

```typescript
const comurgNavItems: NavItem[] = [
  { label: "Funcionários Cedidos", href: "/dashboard/comurgecedidos", icon: Building2, color: "text-emerald-400" },
  { label: "Achados Críticos", href: "/dashboard/comurgachadoscriticos", icon: AlertTriangle, color: "text-red-400" },
  { label: "Óbitos Confirmados", href: "/dashboard/comurgobitos", icon: Skull, color: "text-red-500" },
  { label: "Vínculos Empresariais", href: "/dashboard/comurgempresas", icon: Building2, color: "text-orange-400" },
  { label: "Atividade Política", href: "/dashboard/comurgatividadepolitica", icon: Vote, color: "text-purple-400" },
  // ADICIONAR NOVA LINHA:
  { label: "Análise de Risco", href: "/dashboard/comurganaliserisco", icon: Shield, color: "text-blue-400" },
];
```

**Adicionar import do ícone Shield:**

```typescript
import {
  // ... outros imports
  Shield,
} from "lucide-react";
```

**Checklist 7.1:**
- [ ] Abrir `src/app/dashboard/layout.tsx`
- [ ] Adicionar import `Shield` de lucide-react (verificar se já não existe)
- [ ] Adicionar novo item em `comurgNavItems`
- [ ] Label: "Análise de Risco"
- [ ] Href: "/dashboard/comurganaliserisco"
- [ ] Icon: Shield
- [ ] Color: "text-blue-400"
- [ ] Salvar arquivo

### 7.2. Testar Navegação

**Checklist 7.2:**
- [ ] Recarregar página do InvestigaRee
- [ ] Verificar que link aparece no sidebar COMURG
- [ ] Verificar ícone Shield azul
- [ ] Click no link
- [ ] Verificar que rota funciona
- [ ] Verificar indicador de página ativa (borda azul)
- [ ] Testar navegação entre outras páginas
- [ ] Testar em mobile (sidebar colapsável)

---

## 8. TESTES E VALIDAÇÃO

### 8.1. Testes de Proteção de Tenant

**Teste 1: Usuário COMURG**
- [ ] Login com email COMURG (cliente01@investigaree.com.br)
- [ ] Navegar para `/dashboard/comurganaliserisco`
- [ ] DEVE: Página carrega normalmente
- [ ] DEVE: Exibir dados de classificação de risco

**Teste 2: Usuário sem tenant**
- [ ] Login com email não-COMURG
- [ ] Tentar acessar `/dashboard/comurganaliserisco`
- [ ] DEVE: Redirecionar para `/dashboard`

**Teste 3: Usuário não autenticado**
- [ ] Sem login
- [ ] Tentar acessar URL diretamente
- [ ] DEVE: Redirecionar para página inicial

### 8.2. Testes de Dados

**Teste 4: Classificação de Risco**
- [ ] Total de críticos + atenção + regular = total de funcionários
- [ ] Percentuais somam ~100%
- [ ] Números mudam ao trocar de aba (Todos/COMURG/Cedidos)

**Teste 5: Filtro por Grupo**
- [ ] Aba "Todos": Deve mostrar ~5.950 funcionários
- [ ] Aba "COMURG": Deve mostrar ~4.591 funcionários
- [ ] Aba "Cedidos": Deve mostrar ~1.359 funcionários
- [ ] Contadores nas abas estão corretos

**Teste 6: Cálculos**
- [ ] Percentuais com 1 casa decimal
- [ ] Percentuais calculam corretamente (valor / total * 100)
- [ ] Barras de progresso têm width correto

### 8.3. Testes de UI/UX

**Teste 7: Responsividade**
- [ ] Desktop (> 768px): Grid 3 colunas nos KPIs
- [ ] Mobile (< 768px): Grid 1 coluna empilhada
- [ ] GroupTabs em mobile: Botões wrappam (flex-wrap)

**Teste 8: Interatividade**
- [ ] Click nas abas muda filtro
- [ ] Aba ativa tem estilo azul
- [ ] Abas inativas têm hover effect
- [ ] Animação Framer Motion no carregamento

**Teste 9: Estados Especiais**
- [ ] Loading state: Spinner + texto
- [ ] Error state: Card vermelho
- [ ] Empty state (se nenhum funcionário no grupo)

**Teste 10: Barras de Progresso**
- [ ] Barras têm animação suave (transition-all)
- [ ] Width máximo é 100%
- [ ] Width mínimo é 0%
- [ ] Cores corretas (vermelho, amarelo, verde)

### 8.4. Testes de Performance

**Teste 11: Carregamento**
- [ ] Página carrega em < 2 segundos
- [ ] Troca de abas é instantânea
- [ ] Não há travamentos

**Teste 12: Dark Mode**
- [ ] Cores corretas em dark mode
- [ ] Contraste adequado
- [ ] Background navy-950
- [ ] Cards com navy-900

---

## 9. CHECKLIST FINAL

### Fase 1: Componente GroupTabs ✅
- [ ] Criar `src/components/GroupTabs.tsx`
- [ ] Copiar código completo do componente
- [ ] Adaptar cores para padrão COMURG
- [ ] Exportar type `GroupFilter`
- [ ] Exportar funções `filterByGroup` e `getGroupCounts`
- [ ] Testar que componente compila

### Fase 2: Criação do Arquivo ✅
- [ ] Criar `src/app/dashboard/comurganaliserisco/page.tsx`
- [ ] Copiar estrutura base de proteção
- [ ] Implementar loading e error states
- [ ] Adicionar todos os imports necessários
- [ ] Import do GroupTabs
- [ ] Testar que página carrega vazia

### Fase 3: Lógica de Dados ✅
- [ ] Filtrar funcionários por grupo
- [ ] Calcular críticos (classificacao_risco = "Critico")
- [ ] Calcular atenção (Alto OU Atencao)
- [ ] Calcular regular (Baixo/Regular/vazio)
- [ ] Calcular total
- [ ] Calcular tabCounts para as abas
- [ ] Preparar dadosDistribuicao
- [ ] Testar cálculos com console.log

### Fase 4: Interface Visual ✅
- [ ] Header com título + contador
- [ ] GroupTabs com filtro
- [ ] 3 KPI cards (Crítico vermelho, Atenção amarelo, Regular verde)
- [ ] Card de Distribuição com barras de progresso
- [ ] 3 barras animadas com cores corretas
- [ ] Alerta informativo azul
- [ ] Responsividade completa

### Fase 5: Navegação ✅
- [ ] Import do ícone Shield no layout
- [ ] Adicionar item em comurgNavItems
- [ ] Testar link no sidebar
- [ ] Testar indicador de página ativa
- [ ] Testar em desktop
- [ ] Testar em mobile

### Fase 6: Testes Completos ✅
- [ ] Proteção de tenant (3 cenários)
- [ ] Dados corretos (classificação, filtros, cálculos)
- [ ] Responsividade (desktop, tablet, mobile)
- [ ] Interatividade (abas, hover)
- [ ] Estados especiais (loading, error, empty)
- [ ] Performance (carregamento, animações)
- [ ] Dark mode

### Fase 7: Refinamentos ✅
- [ ] Verificar formatação de números
- [ ] Verificar cores e contraste
- [ ] Verificar acessibilidade
- [ ] Verificar consistência com outras páginas COMURG
- [ ] Code review
- [ ] Commit com mensagem descritiva

---

## 10. PADRÃO VISUAL COMURG

### 10.1. Cores Utilizadas

**KPI Cards:**
- Crítico: `bg-red-50 dark:bg-red-900/20`, `border-red-200 dark:border-red-800`, `text-red-700 dark:text-red-500`
- Atenção: `bg-yellow-50 dark:bg-yellow-900/20`, `border-yellow-200 dark:border-yellow-800`, `text-yellow-700 dark:text-yellow-500`
- Regular: `bg-green-50 dark:bg-green-900/20`, `border-green-200 dark:border-green-800`, `text-green-700 dark:text-green-500`

**Card de Distribuição:**
- Background: `bg-navy-900`
- Border: `border-navy-700`
- Texto: `text-white`
- Subtexto: `text-white/60`

**Barras de Progresso:**
- Background: `bg-navy-800`
- Crítico: `bg-red-500`
- Atenção: `bg-yellow-500`
- Regular: `bg-green-500`

**GroupTabs:**
- Ativo: `bg-blue-500 text-white`
- Inativo: `bg-navy-800 border-navy-700 text-white/70`

**Alerta:**
- Azul: `bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500`

---

## 11. DICAS IMPORTANTES PARA O AGENTE

### 11.1. Atenção Especial

⚠️ **GroupTabs DEVE ser criado primeiro:**
- Componente reutilizável usado em múltiplas páginas
- Exporta funções `filterByGroup` e `getGroupCounts`
- DEVE adaptar cores para padrão COMURG (navy-800, navy-700)

⚠️ **Classificação de Risco:**
- Crítico: `=== "Critico"` (exato)
- Atenção: `=== "Alto"` OU `=== "Atencao"` (dois valores)
- Regular: `=== "Baixo"` OU `=== "Regular"` OU vazio/null (catch-all)

⚠️ **Barras de Progresso:**
- DEVE usar `style={{ width: \`\${percent}%\` }}`
- DEVE ter transição suave: `transition-all duration-500`
- Width NÃO pode ser negativo ou > 100%

⚠️ **Percentuais:**
- SEMPRE verificar se total > 0 antes de dividir
- Usar `.toFixed(1)` para 1 casa decimal
- Formato: `(valor / total) * 100`

⚠️ **Proteção de Tenant:**
- DEVE ter `useEffect` com redirecionamento
- DEVE ter `if` de bloqueio de renderização
- DEVE estar envolvido pelo ComurgDataProvider no layout

### 11.2. Erros Comuns a Evitar

❌ **NÃO** esquecer de criar GroupTabs primeiro
✅ **SIM** criar componente antes da página

❌ **NÃO** usar cores diferentes do padrão COMURG
✅ **SIM** seguir exatamente as cores definidas (navy-900, navy-700)

❌ **NÃO** calcular percentual sem verificar total > 0
✅ **SIM** usar ternário: `total > 0 ? (valor / total) * 100 : 0`

❌ **NÃO** esquecer de incluir valores vazios em "Regular"
✅ **SIM** usar `!f.classificacao_risco || f.classificacao_risco === ""`

❌ **NÃO** usar width fixo nas barras
✅ **SIM** usar width dinâmico com `style={{ width }}`

---

## 12. EXEMPLO DE BARRA DE PROGRESSO

**Barra Completa:**
```typescript
<div>
  <div className="flex justify-between mb-2">
    <span className="font-medium text-white">Crítico</span>
    <span className="text-white/60">
      127 (2.1%)
    </span>
  </div>
  <div className="w-full bg-navy-800 rounded-full h-4">
    <div
      className="bg-red-500 h-4 rounded-full transition-all duration-500"
      style={{ width: "2.1%" }}
    ></div>
  </div>
</div>
```

---

## 13. ESTIMATIVA DE TEMPO

**Total:** 3-4 horas

- Criação do componente GroupTabs: 45 min
- Criação do arquivo base da página: 30 min
- Lógica de dados e filtros: 45 min
- Interface visual (header + KPIs + barras): 1 hora
- Alerta e navegação: 20 min
- Testes completos: 40 min

---

## ✅ PRONTO PARA IMPLEMENTAR!

**Este plano está COMPLETO e DETALHADO para outro agente implementar.**

**Inclui:**
✅ Componente GroupTabs reutilizável
✅ Análise completa de classificação de risco
✅ Wireframe visual
✅ Código passo a passo
✅ Todos os imports necessários
✅ Lógica de filtro por grupo
✅ Cálculos de percentuais
✅ KPIs com cores semafóricas
✅ Barras de progresso animadas
✅ Proteção de tenant
✅ Loading e error states
✅ Navegação no sidebar
✅ Checklist completo
✅ Exemplos de código
✅ Dicas e alertas
✅ Testes de validação

**Arquivo:** `PLANO_IMPLEMENTACAO_ANALISE_RISCO_COMURG.md`

---

📄 **Documento pronto para ser passado para outro agente implementar!**
