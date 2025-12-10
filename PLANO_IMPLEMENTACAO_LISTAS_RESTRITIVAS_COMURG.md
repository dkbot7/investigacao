# 📋 PLANO COMPLETO - PÁGINA LISTAS RESTRITIVAS (TENANT COMURG)

**Data:** 10/12/2025
**Responsável:** Agente de Implementação
**Rota:** `/dashboard/comurglistasrestritivas`
**Objetivo:** Implementar página informativa sobre funcionários em listas de sanções nacionais e internacionais

---

## 📚 ÍNDICE

1. [Objetivo e Visão Geral](#1-objetivo-e-visão-geral)
2. [Análise de Dados](#2-análise-de-dados)
3. [Estrutura Visual Completa](#3-estrutura-visual-completa)
4. [Implementação Passo a Passo](#4-implementação-passo-a-passo)
5. [Código Completo](#5-código-completo)
6. [Navegação no Sidebar](#6-navegação-no-sidebar)
7. [Testes e Validação](#7-testes-e-validação)
8. [Checklist Final](#8-checklist-final)

---

## 1. OBJETIVO E VISÃO GERAL

### 1.1. O Que Será Implementado

Criar a página **Listas Restritivas** no InvestigaRee, mostrando funcionários identificados em:
- **CEIS/CNEP** - Sanções nacionais da CGU (impedimento de contratar)
- **OFAC** - Alertas internacionais por similaridade de nome

### 1.2. Rota de Acesso

```
Desenvolvimento: http://localhost:3000/dashboard/comurglistasrestritivas
Produção: https://investigaree.com.br/dashboard/comurglistasrestritivas
```

### 1.3. Características Principais

✅ **Proteção de tenant** - Apenas COMURG
✅ **2 KPIs informativos** - CEIS e OFAC
✅ **Cards explicativos** - O que é cada lista e consequências
✅ **Fontes consultadas** - Lista de bases de dados verificadas
✅ **Recomendações** - Orientações para tratamento dos casos
✅ **Página informativa** - Foco em educação, não em listagem

### 1.4. Diferença das Outras Páginas

⚠️ **IMPORTANTE:** Esta página é **informativa/educacional**, não mostra lista de funcionários. Ela apenas exibe:
- Contadores agregados (quantos casos)
- Explicações sobre o que são as listas
- Recomendações de tratamento

Para ver os funcionários específicos, o usuário deve ir para "Achados Críticos" ou usar filtros.

### 1.5. Padrão COMURG

Seguir **EXATAMENTE** o padrão das páginas existentes:
- `/dashboard/comurgecedidos`
- `/dashboard/comurgachadoscriticos`
- `/dashboard/comurgobitos`
- `/dashboard/comurgempresas`
- `/dashboard/comurgatividadepolitica`
- `/dashboard/comurganaliserisco`

---

## 2. ANÁLISE DE DADOS

### 2.1. Fonte de Dados

**Context:** `useComurgData()` que carrega `dados_consolidados.csv`

**Hook:** Importar de `@/contexts/ComurgDataContext`

### 2.2. Campos Relevantes

| Campo | Tipo | Valores | Descrição |
|-------|------|---------|-----------|
| `possui_sancao_cgu` | string | "SIM" / "NÃO" | Flag de sanção nacional |
| `detalhes_sancoes` | string | Texto descritivo | Detalhes da sanção CEIS/CNEP |
| `alerta_ofac` | string | "SIM" / "NÃO" | Flag de alerta internacional |
| `detalhes_ofac` | string | Texto descritivo | Detalhes do alerta OFAC |

### 2.3. Cálculos Necessários

**Contador CEIS:**
```typescript
const sancionadosCeis = useMemo(() => {
  return funcionarios.filter(f =>
    f.possui_sancao_cgu && String(f.possui_sancao_cgu).toUpperCase() === 'SIM'
  ).length;
}, [funcionarios]);
```

**Contador OFAC:**
```typescript
const alertasOfac = useMemo(() => {
  return funcionarios.filter(f =>
    f.alerta_ofac && String(f.alerta_ofac).toUpperCase() === 'SIM'
  ).length;
}, [funcionarios]);
```

### 2.4. Valores Esperados

Os valores podem variar conforme os dados, mas tipicamente:
- CEIS: Baixo (0-5 casos esperados)
- OFAC: Médio (alguns alertas por similaridade)

---

## 3. ESTRUTURA VISUAL COMPLETA

### 3.1. Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│ [Shield Icon] Listas Restritivas                               │
│ Verificação em listas de sanções nacionais e internacionais    │
└────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐ ┌──────────────────────────────┐
│ SANÇÕES CGU (CEIS)       │ │ ALERTAS OFAC                 │
│ 3                        │ │ 12                           │
│ Impedimento de contratar │ │ Similaridade em listas       │
│ [Alert Icon]             │ │ [Globe Icon]                 │
└──────────────────────────┘ └──────────────────────────────┘
    Vermelho                      Laranja

┌──────────────────────────┐ ┌──────────────────────────────┐
│ Sanções CGU - CEIS       │ │ Alertas OFAC                 │
│                          │ │                              │
│ O que é CEIS?            │ │ O que é OFAC?                │
│ [Explicação]             │ │ [Explicação]                 │
│                          │ │                              │
│ Consequências            │ │ ⚠️ Importante                │
│ [Detalhes]               │ │ [Aviso sobre similaridade]   │
└──────────────────────────┘ └──────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ 📋 Fontes Consultadas                                          │
│ Nacionais: CEIS, CNEP, Portal da Transparência                │
│ Internacionais: OFAC SDN, Consolidated Sanctions List         │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ ⚠️ Recomendações                                               │
│ • Casos CEIS: Verificar impedimento legal                     │
│ • Alertas OFAC: Analisar individualmente                      │
│ • Comunicar TCM/MP: Casos confirmados                         │
│ • Monitoramento: Atualizar periodicamente                     │
└────────────────────────────────────────────────────────────────┘
```

### 3.2. Cores e Ícones

**KPI Cards:**
- **CEIS:** Vermelho (`bg-red-50`, `border-red-200`, `text-red-700`) + `AlertTriangle`
- **OFAC:** Laranja (`bg-orange-50`, `border-orange-200`, `text-orange-700`) + `Globe`

**Cards Explicativos:**
- Background: `bg-navy-900`
- Border: `border-navy-700`
- Headers com ícones coloridos

**Card de Fontes:**
- Azul claro: `bg-blue-50 border-blue-200`

**Card de Recomendações:**
- Amarelo: `bg-yellow-50 border-yellow-200`

**Header:**
- Ícone: `Shield` roxo (lucide-react)

---

## 4. IMPLEMENTAÇÃO PASSO A PASSO

### PASSO 1: Criar Arquivo Base

**Arquivo:** `src/app/dashboard/comurglistasrestritivas/page.tsx`

**Estrutura inicial:**

```typescript
"use client";

import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, Globe, AlertCircle } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";
import { useComurgData } from "@/contexts/ComurgDataContext";

export default function ComurgListasRestritivas() {
  const { userInfo, loading: authLoading } = useUserAccess();
  const { funcionarios, loading: dataLoading, error } = useComurgData();
  const router = useRouter();

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
- [ ] Criar arquivo `src/app/dashboard/comurglistasrestritivas/page.tsx`
- [ ] Adicionar todos os imports necessários
- [ ] Implementar proteção de tenant com useEffect
- [ ] Adicionar loading state (spinner + texto)
- [ ] Adicionar error state (card vermelho)
- [ ] Adicionar bloqueio de renderização
- [ ] Testar que página carrega vazia
- [ ] Verificar redirecionamento se não for COMURG

---

### PASSO 2: Calcular Contadores

**Adicionar após a linha de `useEffect`:**

```typescript
// Calcular contadores
const sancionadosCeis = useMemo(() => {
  return funcionarios.filter(f =>
    f.possui_sancao_cgu && String(f.possui_sancao_cgu).toUpperCase() === 'SIM'
  ).length;
}, [funcionarios]);

const alertasOfac = useMemo(() => {
  return funcionarios.filter(f =>
    f.alerta_ofac && String(f.alerta_ofac).toUpperCase() === 'SIM'
  ).length;
}, [funcionarios]);
```

**Checklist PASSO 2:**
- [ ] Implementar contador `sancionadosCeis`
- [ ] Filtro: `possui_sancao_cgu === 'SIM'`
- [ ] Implementar contador `alertasOfac`
- [ ] Filtro: `alerta_ofac === 'SIM'`
- [ ] Testar cálculos com `console.log`
- [ ] Verificar valores fazem sentido

---

### PASSO 3: Implementar Header

**Dentro do `<motion.div>`, adicionar:**

```typescript
{/* Header */}
<div>
  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
    <Shield className="w-8 h-8 text-purple-500" />
    Listas Restritivas
  </h1>
  <p className="text-slate-600 dark:text-white/60 mt-2">
    Verificação de funcionários em listas de sanções nacionais (CGU/CEIS/CNEP) e internacionais (OFAC).
  </p>
</div>
```

**Checklist PASSO 3:**
- [ ] Adicionar header com título
- [ ] Usar ícone `Shield` roxo
- [ ] Adicionar texto descritivo
- [ ] Testar responsividade

---

### PASSO 4: Implementar KPI Cards

**Adicionar após o header:**

```typescript
{/* KPI Cards */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Card 1: CEIS */}
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-red-600 dark:text-red-400 font-medium">SANÇÕES CGU (CEIS)</p>
        <p className="text-4xl font-bold text-red-700 dark:text-red-500">
          {sancionadosCeis}
        </p>
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
          Impedimento de contratar com administração pública
        </p>
      </div>
      <AlertTriangle className="w-16 h-16 text-red-500" />
    </div>
  </div>

  {/* Card 2: OFAC */}
  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">ALERTAS OFAC</p>
        <p className="text-4xl font-bold text-orange-700 dark:text-orange-500">
          {alertasOfac}
        </p>
        <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
          Similaridade em listas internacionais
        </p>
      </div>
      <Globe className="w-16 h-16 text-orange-500" />
    </div>
  </div>
</div>
```

**Checklist PASSO 4:**
- [ ] Implementar 2 KPI cards
- [ ] Card 1: CEIS (vermelho) com ícone AlertTriangle
- [ ] Card 2: OFAC (laranja) com ícone Globe
- [ ] Contadores dinâmicos
- [ ] Textos descritivos
- [ ] Background e borders corretos (light/dark mode)
- [ ] Testar responsividade (grid md:grid-cols-2)

---

### PASSO 5: Implementar Cards Explicativos

**Adicionar após os KPIs:**

```typescript
{/* Cards Explicativos */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Card CEIS */}
  <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <AlertTriangle className="w-6 h-6 text-red-500" />
      Sanções CGU - CEIS
    </h2>
    <p className="text-white/80 mb-4">
      <strong className="text-white">CEIS</strong> - Cadastro de Empresas Inidôneas e Suspensas
    </p>
    <div className="bg-red-500/20 border border-red-500/30 p-4 rounded-lg">
      <p className="font-bold text-red-400">
        {sancionadosCeis} caso(s) identificado(s)
      </p>
      <p className="text-sm text-red-300 mt-2">
        Funcionários com impedimento legal de contratar com a administração pública federal, estadual ou municipal.
      </p>
    </div>

    <div className="mt-6 space-y-3">
      <div className="border-l-4 border-red-500 pl-4">
        <p className="font-medium text-sm text-white">O que é CEIS?</p>
        <p className="text-xs text-white/60 mt-1">
          Lista mantida pela CGU com empresas e pessoas físicas punidas por fraude, corrupção ou irregularidades em licitações.
        </p>
      </div>
      <div className="border-l-4 border-orange-500 pl-4">
        <p className="font-medium text-sm text-white">Consequências</p>
        <p className="text-xs text-white/60 mt-1">
          Impedimento de celebrar contratos, convênios ou acordos com órgãos públicos por prazo determinado.
        </p>
      </div>
    </div>
  </div>

  {/* Card OFAC */}
  <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <Globe className="w-6 h-6 text-orange-500" />
      Alertas OFAC
    </h2>
    <p className="text-white/80 mb-4">
      <strong className="text-white">OFAC</strong> - Office of Foreign Assets Control (Tesouro dos EUA)
    </p>
    <div className="bg-orange-500/20 border border-orange-500/30 p-4 rounded-lg">
      <p className="font-bold text-orange-400">
        {alertasOfac} alerta(s) por similaridade
      </p>
      <p className="text-sm text-orange-300 mt-2">
        Nomes com similaridade ≥50% a pessoas em listas de sanções internacionais (terrorismo, narcotráfico, lavagem de dinheiro).
      </p>
    </div>

    <div className="mt-6 space-y-3">
      <div className="border-l-4 border-orange-500 pl-4">
        <p className="font-medium text-sm text-white">O que é OFAC?</p>
        <p className="text-xs text-white/60 mt-1">
          Agência do Tesouro dos EUA que administra sanções econômicas contra países, organizações criminosas e indivíduos.
        </p>
      </div>
      <div className="border-l-4 border-yellow-500 pl-4">
        <p className="font-medium text-sm text-white">⚠️ Importante</p>
        <p className="text-xs text-white/60 mt-1">
          Similaridade de nome NÃO significa confirmação. Requer análise caso a caso com data de nascimento e documentos.
        </p>
      </div>
    </div>
  </div>
</div>
```

**Checklist PASSO 5:**
- [ ] Implementar 2 cards explicativos
- [ ] Card CEIS: Background navy-900, header vermelho
- [ ] Card OFAC: Background navy-900, header laranja
- [ ] Box de destaque com contadores
- [ ] 2 seções explicativas com border-left colorido
- [ ] Textos informativos completos
- [ ] Responsividade (grid lg:grid-cols-2)

---

### PASSO 6: Implementar Card de Fontes Consultadas

**Adicionar após os cards explicativos:**

```typescript
{/* Card de Fontes Consultadas */}
<div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
  <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-4 flex items-center gap-2">
    📋 Fontes Consultadas
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <p className="font-medium text-blue-800 dark:text-blue-300 mb-3">Nacionais:</p>
      <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>CEIS - Cadastro de Empresas Inidôneas</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>CNEP - Cadastro Nacional de Empresas Punidas</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Portal da Transparência CGU</span>
        </li>
      </ul>
    </div>
    <div>
      <p className="font-medium text-blue-800 dark:text-blue-300 mb-3">Internacionais:</p>
      <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-400">
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>OFAC SDN List (Specially Designated Nationals)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Consolidated Sanctions List</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">•</span>
          <span>Non-SDN Lists</span>
        </li>
      </ul>
    </div>
  </div>
</div>
```

**Checklist PASSO 6:**
- [ ] Implementar card azul claro
- [ ] Header com emoji 📋
- [ ] Grid 2 colunas (Nacionais e Internacionais)
- [ ] Listas com bullets
- [ ] Textos informativos sobre fontes
- [ ] Responsividade (grid md:grid-cols-2)

---

### PASSO 7: Implementar Card de Recomendações

**Adicionar após o card de fontes:**

```typescript
{/* Card de Recomendações */}
<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
  <h3 className="font-bold text-yellow-900 dark:text-yellow-400 mb-4 flex items-center gap-2">
    ⚠️ Recomendações
  </h3>
  <ul className="space-y-3">
    <li className="flex items-start gap-3 text-sm text-yellow-800 dark:text-yellow-300">
      <span className="text-yellow-500 mt-0.5">•</span>
      <span>
        <strong className="text-yellow-900 dark:text-yellow-400">Casos CEIS:</strong> Verificar possível impedimento legal para função pública
      </span>
    </li>
    <li className="flex items-start gap-3 text-sm text-yellow-800 dark:text-yellow-300">
      <span className="text-yellow-500 mt-0.5">•</span>
      <span>
        <strong className="text-yellow-900 dark:text-yellow-400">Alertas OFAC:</strong> Analisar individualmente com documentos completos
      </span>
    </li>
    <li className="flex items-start gap-3 text-sm text-yellow-800 dark:text-yellow-300">
      <span className="text-yellow-500 mt-0.5">•</span>
      <span>
        <strong className="text-yellow-900 dark:text-yellow-400">Comunicar TCM/MP:</strong> Casos confirmados de sanções ativas
      </span>
    </li>
    <li className="flex items-start gap-3 text-sm text-yellow-800 dark:text-yellow-300">
      <span className="text-yellow-500 mt-0.5">•</span>
      <span>
        <strong className="text-yellow-900 dark:text-yellow-400">Monitoramento:</strong> Atualizar consultas periodicamente (listas são dinâmicas)
      </span>
    </li>
  </ul>
</div>
```

**Checklist PASSO 7:**
- [ ] Implementar card amarelo
- [ ] Header com emoji ⚠️
- [ ] Lista de 4 recomendações
- [ ] Texto em negrito para títulos
- [ ] Bullets coloridos
- [ ] Dark mode support

---

## 5. CÓDIGO COMPLETO

**Arquivo completo de referência:**

O código completo está dividido nas seções acima (Passos 1-7). Para referência, consultar:
- Dashboard local: `dashboard-comurg/app/listas-restritivas/page.tsx`
- Páginas similares no InvestigaRee

---

## 6. NAVEGAÇÃO NO SIDEBAR

### 6.1. Adicionar Link no Layout

**Arquivo:** `src/app/dashboard/layout.tsx`

**Localizar o array `comurgNavItems` (linha ~64):**

```typescript
const comurgNavItems: NavItem[] = [
  { label: "Funcionários Cedidos", href: "/dashboard/comurgecedidos", icon: Building2, color: "text-emerald-400" },
  { label: "Achados Críticos", href: "/dashboard/comurgachadoscriticos", icon: AlertTriangle, color: "text-red-400" },
  { label: "Óbitos Confirmados", href: "/dashboard/comurgobitos", icon: Skull, color: "text-red-500" },
  { label: "Vínculos Empresariais", href: "/dashboard/comurgempresas", icon: Building2, color: "text-orange-400" },
  { label: "Benefícios Federais", href: "/dashboard/comurgbeneficios", icon: Gift, color: "text-blue-400" },
  { label: "Atividade Política", href: "/dashboard/comurgatividadepolitica", icon: Vote, color: "text-purple-400" },
  { label: "Análise de Risco", href: "/dashboard/comurganaliserisco", icon: Shield, color: "text-blue-400" },
  // ADICIONAR NOVA LINHA:
  { label: "Listas Restritivas", href: "/dashboard/comurglistasrestritivas", icon: Shield, color: "text-purple-400" },
];
```

**Checklist 6.1:**
- [ ] Abrir `src/app/dashboard/layout.tsx`
- [ ] Ícone Shield já importado (usado em Análise de Risco)
- [ ] Adicionar novo item em `comurgNavItems`
- [ ] Label: "Listas Restritivas"
- [ ] Href: "/dashboard/comurglistasrestritivas"
- [ ] Icon: Shield
- [ ] Color: "text-purple-400"
- [ ] Salvar arquivo

### 6.2. Testar Navegação

**Checklist 6.2:**
- [ ] Recarregar página do InvestigaRee
- [ ] Verificar que link aparece no sidebar COMURG
- [ ] Verificar ícone Shield roxo
- [ ] Click no link
- [ ] Verificar que rota funciona
- [ ] Verificar indicador de página ativa (borda azul)
- [ ] Testar navegação entre outras páginas
- [ ] Testar em mobile (sidebar colapsável)

---

## 7. TESTES E VALIDAÇÃO

### 7.1. Testes de Proteção de Tenant

**Teste 1: Usuário COMURG**
- [ ] Login com email COMURG (cliente01@investigaree.com.br)
- [ ] Navegar para `/dashboard/comurglistasrestritivas`
- [ ] DEVE: Página carrega normalmente
- [ ] DEVE: Exibir contadores de CEIS e OFAC

**Teste 2: Usuário sem tenant**
- [ ] Login com email não-COMURG
- [ ] Tentar acessar `/dashboard/comurglistasrestritivas`
- [ ] DEVE: Redirecionar para `/dashboard`

**Teste 3: Usuário não autenticado**
- [ ] Sem login
- [ ] Tentar acessar URL diretamente
- [ ] DEVE: Redirecionar para página inicial

### 7.2. Testes de Dados

**Teste 4: Contadores**
- [ ] Contador CEIS mostra número correto
- [ ] Contador OFAC mostra número correto
- [ ] Números aparecem nos KPIs e nos cards explicativos
- [ ] Números são iguais em ambos os lugares

**Teste 5: Valores**
- [ ] Se CEIS = 0, página ainda funciona normalmente
- [ ] Se OFAC = 0, página ainda funciona normalmente
- [ ] Números formatados corretamente (sem decimais)

### 7.3. Testes de UI/UX

**Teste 6: Responsividade**
- [ ] Desktop (> 768px): Grid 2 colunas nos KPIs
- [ ] Desktop (> 1024px): Grid 2 colunas nos cards explicativos
- [ ] Mobile (< 768px): Grid 1 coluna empilhada
- [ ] Fontes: Grid 2 colunas se cabe, senão empilha

**Teste 7: Cores e Contraste**
- [ ] KPI CEIS: Vermelho claro/escuro
- [ ] KPI OFAC: Laranja claro/escuro
- [ ] Cards explicativos: Navy-900
- [ ] Fontes: Azul claro
- [ ] Recomendações: Amarelo
- [ ] Contraste adequado em light/dark mode

**Teste 8: Textos e Informações**
- [ ] Textos estão corretos e sem erros
- [ ] Explicações estão claras
- [ ] Listas de fontes completas
- [ ] Recomendações fazem sentido

**Teste 9: Estados Especiais**
- [ ] Loading state: Spinner + texto
- [ ] Error state: Card vermelho
- [ ] Animação Framer Motion no carregamento

### 7.4. Testes de Performance

**Teste 10: Carregamento**
- [ ] Página carrega em < 2 segundos
- [ ] Não há travamentos
- [ ] Scroll suave

**Teste 11: Dark Mode**
- [ ] Cores corretas em dark mode
- [ ] Contraste adequado
- [ ] Background navy-950
- [ ] Cards navy-900

---

## 8. CHECKLIST FINAL

### Fase 1: Criação do Arquivo ✅
- [ ] Criar `src/app/dashboard/comurglistasrestritivas/page.tsx`
- [ ] Copiar estrutura base de proteção
- [ ] Implementar loading e error states
- [ ] Adicionar todos os imports necessários
- [ ] Testar que página carrega vazia

### Fase 2: Lógica de Dados ✅
- [ ] Calcular `sancionadosCeis` (possui_sancao_cgu = "SIM")
- [ ] Calcular `alertasOfac` (alerta_ofac = "SIM")
- [ ] Testar cálculos com console.log
- [ ] Verificar valores fazem sentido

### Fase 3: Interface Visual ✅
- [ ] Header com título + descrição
- [ ] 2 KPI cards (CEIS vermelho, OFAC laranja)
- [ ] 2 cards explicativos (navy-900)
- [ ] Card de fontes consultadas (azul)
- [ ] Card de recomendações (amarelo)
- [ ] Todos os textos informativos
- [ ] Responsividade completa

### Fase 4: Navegação ✅
- [ ] Shield já importado no layout
- [ ] Adicionar item em comurgNavItems
- [ ] Testar link no sidebar
- [ ] Testar indicador de página ativa
- [ ] Testar em desktop
- [ ] Testar em mobile

### Fase 5: Testes Completos ✅
- [ ] Proteção de tenant (3 cenários)
- [ ] Dados corretos (contadores)
- [ ] Responsividade (desktop, tablet, mobile)
- [ ] Cores e contraste (light/dark mode)
- [ ] Textos e informações
- [ ] Estados especiais (loading, error)
- [ ] Performance (carregamento)

### Fase 6: Refinamentos ✅
- [ ] Verificar formatação de números
- [ ] Verificar cores e contraste
- [ ] Verificar consistência com outras páginas COMURG
- [ ] Code review
- [ ] Commit com mensagem descritiva

---

## 9. PADRÃO VISUAL COMURG

### 9.1. Cores Utilizadas

**KPI Cards:**
- CEIS: `bg-red-50 dark:bg-red-900/20`, `border-red-200 dark:border-red-800`, `text-red-700 dark:text-red-500`
- OFAC: `bg-orange-50 dark:bg-orange-900/20`, `border-orange-200 dark:border-orange-800`, `text-orange-700 dark:text-orange-500`

**Cards Explicativos:**
- Background: `bg-navy-900`
- Border: `border-navy-700`
- Texto: `text-white`
- Subtexto: `text-white/60`
- Box de destaque CEIS: `bg-red-500/20 border-red-500/30`
- Box de destaque OFAC: `bg-orange-500/20 border-orange-500/30`

**Card de Fontes:**
- Background: `bg-blue-50 dark:bg-blue-900/20`
- Border: `border-blue-200 dark:border-blue-800`
- Texto: `text-blue-700 dark:text-blue-400`

**Card de Recomendações:**
- Background: `bg-yellow-50 dark:bg-yellow-900/20`
- Border: `border-yellow-200 dark:border-yellow-800`
- Texto: `text-yellow-800 dark:text-yellow-300`

**Header:**
- Ícone Shield: `text-purple-500`

---

## 10. DICAS IMPORTANTES PARA O AGENTE

### 10.1. Atenção Especial

⚠️ **Página Informativa:**
- Esta página NÃO mostra lista de funcionários
- Apenas mostra contadores agregados e informações educacionais
- Foco em explicar o que são as listas e como tratar os casos

⚠️ **Contadores Simples:**
- Apenas 2 cálculos: CEIS e OFAC
- Filtros simples com `=== 'SIM'`
- SEMPRE usar `.toUpperCase()` para garantir match

⚠️ **Textos Informativos:**
- CUIDADO para não alterar os textos explicativos
- São informações técnicas/legais importantes
- Manter EXATAMENTE como no plano

⚠️ **Proteção de Tenant:**
- DEVE ter `useEffect` com redirecionamento
- DEVE ter `if` de bloqueio de renderização
- DEVE estar envolvido pelo ComurgDataProvider no layout

### 10.2. Erros Comuns a Evitar

❌ **NÃO** adicionar lista de funcionários (esta é uma página informativa)
✅ **SIM** mostrar apenas contadores e explicações

❌ **NÃO** usar cores diferentes do padrão COMURG
✅ **SIM** seguir exatamente as cores definidas

❌ **NÃO** alterar textos explicativos
✅ **SIM** manter textos técnicos exatos

❌ **NÃO** esquecer dark mode nos cards coloridos
✅ **SIM** usar variantes dark: `dark:bg-*`, `dark:text-*`

❌ **NÃO** esquecer de converter para uppercase antes de comparar
✅ **SIM** usar `String(campo).toUpperCase() === 'SIM'`

---

## 11. EXEMPLO DE KPI CARD

**Card CEIS Completo:**
```typescript
<div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-red-600 dark:text-red-400 font-medium">
        SANÇÕES CGU (CEIS)
      </p>
      <p className="text-4xl font-bold text-red-700 dark:text-red-500">
        3
      </p>
      <p className="text-sm text-red-600 dark:text-red-400 mt-2">
        Impedimento de contratar com administração pública
      </p>
    </div>
    <AlertTriangle className="w-16 h-16 text-red-500" />
  </div>
</div>
```

---

## 12. ESTIMATIVA DE TEMPO

**Total:** 2-3 horas

- Criação do arquivo base: 20 min
- Lógica de dados (2 contadores): 15 min
- Interface visual (header + KPIs): 30 min
- Cards explicativos: 40 min
- Cards de fontes e recomendações: 20 min
- Navegação: 10 min
- Testes completos: 30 min

---

## ✅ PRONTO PARA IMPLEMENTAR!

**Este plano está COMPLETO e DETALHADO para outro agente implementar.**

**Inclui:**
✅ Análise completa de dados (CEIS e OFAC)
✅ Wireframe visual
✅ Código passo a passo
✅ Todos os imports necessários
✅ Cálculos de contadores
✅ KPIs com cores semafóricas
✅ Cards explicativos completos
✅ Fontes consultadas
✅ Recomendações
✅ Proteção de tenant
✅ Loading e error states
✅ Navegação no sidebar
✅ Checklist completo
✅ Exemplos de código
✅ Dicas e alertas
✅ Testes de validação

**Arquivo:** `PLANO_IMPLEMENTACAO_LISTAS_RESTRITIVAS_COMURG.md`

---

📄 **Documento pronto para ser passado para outro agente implementar!**
