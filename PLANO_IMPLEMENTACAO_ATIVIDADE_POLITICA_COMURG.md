# 📋 PLANO COMPLETO - PÁGINA ATIVIDADE POLÍTICA (TENANT COMURG)

**Data:** 10/12/2025
**Responsável:** Agente de Implementação
**Rota:** `/dashboard/comurgatividadepolitica`
**Objetivo:** Implementar página de Atividade Política dentro do tenant COMURG

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

Criar a página **Atividade Política** no InvestigaRee, mostrando funcionários com envolvimento político através de:
- **Candidaturas eleitorais** (8 funcionários)
- **Doações para campanhas** (78 funcionários)

### 1.2. Rota de Acesso

```
Desenvolvimento: http://localhost:3000/dashboard/comurgatividadepolitica
Produção: https://investigaree.com.br/dashboard/comurgatividadepolitica
```

### 1.3. Características Principais

✅ **Proteção de tenant** - Apenas COMURG
✅ **Duas seções** - Candidaturas E Doações lado a lado
✅ **3 KPIs** - Candidatos, Doadores, Total Doado
✅ **Filtro por grupo** - Todos, COMURG, Cedidos
✅ **Layout em grid 2 colunas** - Desktop
✅ **Cards com detalhes** - Informações completas
✅ **Modal de ficha** - Click no nome abre modal
✅ **Scroll independente** - Cada seção com scroll próprio

### 1.4. Padrão COMURG

Seguir **EXATAMENTE** o padrão das páginas existentes:
- `/dashboard/comurgecedidos`
- `/dashboard/comurgachadoscriticos`
- `/dashboard/comurgobitos`
- `/dashboard/comurgempresas`

---

## 2. ANÁLISE DE DADOS

### 2.1. Fonte de Dados

**Context:** `useComurgData()` que carrega `dados_consolidados.csv`

**Hook:** Importar de `@/contexts/ComurgDataContext`

### 2.2. Campos de Candidaturas

| Campo | Tipo | Exemplo | Descrição |
|-------|------|---------|-----------|
| `foi_candidato` | string | "SIM" / "NÃO" | Flag de candidatura |
| `detalhes_candidatura` | string | "Vereador 2020..." | Texto descritivo |
| `ano_candidatura` | string | "2020" | Ano da eleição |
| `cargo_disputado` | string | "Vereador" | Cargo pleiteado |
| `partido` | string | "PT" | Partido político |
| `situacao_candidatura` | string | "Não Eleito" | Resultado |
| `patrimonio_2022` | string | "R$ 150.000" | Patrimônio declarado |
| `patrimonio_2024` | string | "R$ 200.000" | Patrimônio atualizado |
| `variacao_patrimonial` | string | "+33%" | Variação % |

**Filtro para candidatos:**
```typescript
const candidatos = funcionarios.filter(f =>
  f.foi_candidato && String(f.foi_candidato).toUpperCase() === 'SIM'
);
```

**Total esperado:** 8 candidatos

### 2.3. Campos de Doações

| Campo | Tipo | Exemplo | Descrição |
|-------|------|---------|-----------|
| `foi_doador_eleitoral` | string | "SIM" / "NÃO" | Flag de doador |
| `total_doacoes` | string | "R$ 5.000,00" | Valor total doado |
| `detalhes_doacoes` | string | "Doação para..." | Texto descritivo |
| `ano_doacao` | string | "2020" | Ano da doação |
| `beneficiario_doacao` | string | "João Silva" | Quem recebeu |
| `partido_beneficiario` | string | "PSDB" | Partido do beneficiário |
| `tipo_beneficiario` | string | "Candidato" | Tipo (Candidato/Partido) |
| `doacao_incompativel_renda` | string | "SIM" / "NÃO" | Flag de incompatibilidade |

**Filtro para doadores:**
```typescript
const doadores = funcionarios.filter(f =>
  f.foi_doador_eleitoral && String(f.foi_doador_eleitoral).toUpperCase() === 'SIM'
);
```

**Total esperado:** 78 doadores

### 2.4. Cálculos Necessários

**Total de doações (soma):**
```typescript
const totalDoacoes = doadores.reduce((sum, d) => {
  const valor = String(d.total_doacoes || "0")
    .replace(/[^\d,.-]/g, "")
    .replace(",", ".");
  return sum + (parseFloat(valor) || 0);
}, 0);
```

---

## 3. ESTRUTURA VISUAL COMPLETA

### 3.1. Wireframe

```
┌────────────────────────────────────────────────────────────────┐
│ [Vote Icon] Atividade Política                                 │
│ Monitoramento de envolvimento político                         │
└────────────────────────────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ CANDIDATOS   │ │ DOADORES     │ │ TOTAL DOADO  │
│ 8            │ │ 78           │ │ R$ XX.XXX,XX │
└──────────────┘ └──────────────┘ └──────────────┘

┌──────────────────────────────────────────────────────────────┐
│ [Tabs: Todos | COMURG | Cedidos]                             │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────┐ ┌──────────────────────────────┐
│ Candidaturas (8)         │ │ Doações Eleitorais (78)      │
│                          │ │                              │
│ ┌────────────────────┐   │ │ ┌────────────────────────┐   │
│ │ [Card Candidato 1] │   │ │ │ [Card Doador 1]       │   │
│ │ Nome               │   │ │ │ Nome                  │   │
│ │ 2020 - Vereador    │   │ │ │ 2020 - R$ 5.000       │   │
│ │ PT - Não Eleito    │   │ │ │ Para: João Silva (PT) │   │
│ └────────────────────┘   │ │ └────────────────────────┘   │
│                          │ │                              │
│ ┌────────────────────┐   │ │ ┌────────────────────────┐   │
│ │ [Card Candidato 2] │   │ │ │ [Card Doador 2]       │   │
│ └────────────────────┘   │ │ └────────────────────────┘   │
│                          │ │                              │
│ [Scroll vertical]        │ │ [Scroll vertical]            │
└──────────────────────────┘ └──────────────────────────────┘
```

### 3.2. Layout Responsivo

**Desktop (lg+):**
- Grid 2 colunas (50% cada)
- Seções lado a lado
- Scroll independente

**Tablet/Mobile (< lg):**
- Grid 1 coluna (100%)
- Seções empilhadas
- Candidaturas primeiro, doações depois

---

## 4. IMPLEMENTAÇÃO PASSO A PASSO

### PASSO 1: Criar Arquivo Base

**Arquivo:** `src/app/dashboard/comurgatividadepolitica/page.tsx`

**Estrutura inicial:**

```typescript
"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Vote, AlertCircle, TrendingUp, Users, DollarSign } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";
import { useComurgData } from "@/contexts/ComurgDataContext";

export default function ComurgAtividadePolitica() {
  const { userInfo, loading: authLoading } = useUserAccess();
  const { funcionarios, loading: dataLoading, error } = useComurgData();
  const router = useRouter();
  const [modalCpf, setModalCpf] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
- [ ] Criar arquivo `src/app/dashboard/comurgatividadepolitica/page.tsx`
- [ ] Adicionar todos os imports necessários
- [ ] Implementar proteção de tenant com useEffect
- [ ] Adicionar loading state (spinner + texto)
- [ ] Adicionar error state (card vermelho)
- [ ] Adicionar bloqueio de renderização
- [ ] Testar que página carrega vazia
- [ ] Verificar redirecionamento se não for COMURG

---

### PASSO 2: Filtrar Dados (Candidatos e Doadores)

**Adicionar após a linha de `useEffect`:**

```typescript
// Filtrar candidatos
const candidatos = useMemo(() => {
  return funcionarios.filter((f) =>
    f.foi_candidato && String(f.foi_candidato).toUpperCase() === 'SIM'
  );
}, [funcionarios]);

// Filtrar doadores
const doadores = useMemo(() => {
  return funcionarios.filter((f) =>
    f.foi_doador_eleitoral && String(f.foi_doador_eleitoral).toUpperCase() === 'SIM'
  );
}, [funcionarios]);

// Calcular total de doações
const totalDoacoes = useMemo(() => {
  return doadores.reduce((sum, d) => {
    const valor = String(d.total_doacoes || "0")
      .replace(/[^\d,.-]/g, "")
      .replace(",", ".");
    return sum + (parseFloat(valor) || 0);
  }, 0);
}, [doadores]);

// Distribuição por grupo (candidatos)
const statsCandidatos = useMemo(() => {
  const comurg = candidatos.filter(c =>
    c.grupo?.toLowerCase() === "comurg"
  ).length;
  const disposicao = candidatos.filter(c =>
    c.grupo?.toLowerCase() === "disposicao"
  ).length;
  return { total: candidatos.length, comurg, disposicao };
}, [candidatos]);

// Distribuição por grupo (doadores)
const statsDoadores = useMemo(() => {
  const comurg = doadores.filter(d =>
    d.grupo?.toLowerCase() === "comurg"
  ).length;
  const disposicao = doadores.filter(d =>
    d.grupo?.toLowerCase() === "disposicao"
  ).length;
  return { total: doadores.length, comurg, disposicao };
}, [doadores]);
```

**Checklist PASSO 2:**
- [ ] Implementar filtro de candidatos com `useMemo`
- [ ] Implementar filtro de doadores com `useMemo`
- [ ] Calcular total de doações (soma numérica)
- [ ] Calcular distribuição de candidatos por grupo
- [ ] Calcular distribuição de doadores por grupo
- [ ] Testar cálculos com `console.log`
- [ ] Verificar se total de candidatos = 8
- [ ] Verificar se total de doadores = 78

---

### PASSO 3: Implementar Header

**Dentro do `<motion.div>`, adicionar:**

```typescript
{/* Header */}
<div>
  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
    <Vote className="w-8 h-8 text-purple-400" />
    Atividade Política
  </h1>
  <p className="text-slate-600 dark:text-white/60 mt-2">
    Monitoramento de envolvimento político - {statsCandidatos.total} candidatos e {statsDoadores.total} doadores identificados
  </p>
</div>
```

**Checklist PASSO 3:**
- [ ] Adicionar header com título
- [ ] Usar ícone `Vote` (lucide-react) roxo
- [ ] Adicionar contadores dinâmicos
- [ ] Texto descritivo
- [ ] Testar responsividade

---

### PASSO 4: Implementar KPI Cards

**Adicionar após o header:**

```typescript
{/* KPI Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Card 1: Candidatos */}
  <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-purple-400 font-medium">CANDIDATOS</p>
        <p className="text-4xl font-bold text-purple-500">
          {statsCandidatos.total}
        </p>
        <p className="text-sm text-purple-400 mt-2">
          COMURG: {statsCandidatos.comurg} | Cedidos: {statsCandidatos.disposicao}
        </p>
      </div>
      <Users className="w-16 h-16 text-purple-500" />
    </div>
  </div>

  {/* Card 2: Doadores */}
  <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-400 font-medium">DOADORES</p>
        <p className="text-4xl font-bold text-blue-500">
          {statsDoadores.total}
        </p>
        <p className="text-sm text-blue-400 mt-2">
          COMURG: {statsDoadores.comurg} | Cedidos: {statsDoadores.disposicao}
        </p>
      </div>
      <TrendingUp className="w-16 h-16 text-blue-500" />
    </div>
  </div>

  {/* Card 3: Total Doado */}
  <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-green-400 font-medium">TOTAL DOADO</p>
        <p className="text-3xl font-bold text-green-500">
          R$ {totalDoacoes.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
        <p className="text-sm text-green-400 mt-2">Soma declarada ao TSE</p>
      </div>
      <DollarSign className="w-16 h-16 text-green-500" />
    </div>
  </div>
</div>
```

**Checklist PASSO 4:**
- [ ] Implementar 3 KPI cards
- [ ] Card 1: Candidatos (roxo) com ícone Users
- [ ] Card 2: Doadores (azul) com ícone TrendingUp
- [ ] Card 3: Total Doado (verde) com ícone DollarSign
- [ ] Distribuição por grupo em cada card
- [ ] Formatação de moeda R$
- [ ] Background `bg-navy-900`, border `border-navy-700`
- [ ] Testar responsividade (grid md:grid-cols-3)

---

### PASSO 5: Implementar Alerta Informativo

**Adicionar após os KPIs:**

```typescript
{/* Alerta Informativo */}
<div className="bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500 p-4 rounded-r-lg">
  <div className="flex items-start">
    <Vote className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-1" />
    <div>
      <p className="font-bold text-purple-800 dark:text-purple-400">
        ATENÇÃO - ATIVIDADE POLÍTICA
      </p>
      <p className="text-purple-700 dark:text-purple-300 text-sm mt-1">
        Funcionários com histórico de candidaturas eleitorais e/ou doações para campanhas.
        Verificar compatibilidade com legislação eleitoral, licenças concedidas e
        declarações de patrimônio. Doações incompatíveis com a renda podem indicar
        necessidade de análise adicional.
      </p>
    </div>
  </div>
</div>
```

**Checklist PASSO 5:**
- [ ] Implementar alerta informativo roxo
- [ ] Border-left roxo
- [ ] Ícone Vote
- [ ] Texto explicativo sobre atividade política
- [ ] Background roxo claro/escuro (light/dark mode)

---

### PASSO 6: Implementar Seções de Candidaturas e Doações

**⚠️ IMPORTANTE:** Esta é a parte mais complexa - duas seções lado a lado com scroll independente.

**Adicionar após o alerta:**

```typescript
{/* Grid de Seções - Candidaturas e Doações */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* SEÇÃO A - CANDIDATURAS */}
  <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <Users className="w-6 h-6 text-purple-400" />
      Candidaturas ({statsCandidatos.total})
    </h2>

    {/* Lista de Candidatos com Scroll */}
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {candidatos.length === 0 ? (
        <div className="text-center py-8 text-white/50">
          Nenhum candidato encontrado
        </div>
      ) : (
        candidatos.map((candidato, index) => (
          <div
            key={index}
            className="border-l-4 border-purple-500 pl-4 py-2 bg-navy-800/50 rounded-r-lg hover:bg-navy-800 transition-colors"
          >
            {/* Nome (clicável) */}
            <button
              onClick={() => {
                setModalCpf(candidato.cpf);
                setIsModalOpen(true);
              }}
              className="font-bold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer text-left text-lg"
            >
              {candidato.nome}
            </button>

            {/* Informações da Candidatura */}
            <div className="mt-2 space-y-1">
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">Ano:</span>{" "}
                {candidato.ano_candidatura || "N/A"}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">Cargo:</span>{" "}
                {candidato.cargo_disputado || "N/A"}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">Partido:</span>{" "}
                {candidato.partido || "N/A"}
              </p>
              <p className="text-sm text-slate-300">
                <span className="font-semibold text-white">Resultado:</span>{" "}
                <span className={`font-bold ${
                  candidato.situacao_candidatura?.toLowerCase().includes('eleito')
                    ? 'text-green-400'
                    : 'text-orange-400'
                }`}>
                  {candidato.situacao_candidatura || "N/A"}
                </span>
              </p>

              {/* Badge de Grupo */}
              <div className="mt-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    candidato.grupo?.toLowerCase() === "comurg"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {candidato.grupo?.toUpperCase()}
                </span>
              </div>

              {/* Detalhes adicionais */}
              {candidato.detalhes_candidatura && (
                <p className="text-xs text-slate-400 mt-2 italic">
                  {candidato.detalhes_candidatura}
                </p>
              )}
            </div>
          </div>
        ))
      )}
    </div>

    {/* Rodapé */}
    <div className="mt-4 pt-4 border-t border-navy-700">
      <p className="text-sm text-white/50">
        Total de {statsCandidatos.total} candidatura(s) identificada(s)
      </p>
    </div>
  </div>

  {/* SEÇÃO B - DOAÇÕES ELEITORAIS */}
  <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <DollarSign className="w-6 h-6 text-blue-400" />
      Doações Eleitorais ({statsDoadores.total})
    </h2>

    {/* Lista de Doadores com Scroll */}
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {doadores.length === 0 ? (
        <div className="text-center py-8 text-white/50">
          Nenhum doador encontrado
        </div>
      ) : (
        doadores.map((doador, index) => {
          // Extrair valor numérico da doação
          const valor = String(doador.total_doacoes || "0")
            .replace(/[^\d,.-]/g, "")
            .replace(",", ".");
          const valorNum = parseFloat(valor) || 0;

          return (
            <div
              key={index}
              className="border-l-4 border-blue-500 pl-4 py-2 bg-navy-800/50 rounded-r-lg hover:bg-navy-800 transition-colors"
            >
              {/* Nome (clicável) */}
              <button
                onClick={() => {
                  setModalCpf(doador.cpf);
                  setIsModalOpen(true);
                }}
                className="font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer text-left text-lg"
              >
                {doador.nome}
              </button>

              {/* Informações da Doação */}
              <div className="mt-2 space-y-1">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Ano:</span>{" "}
                  {doador.ano_doacao || "N/A"}
                </p>
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Valor Total:</span>{" "}
                  <span className="text-emerald-400 font-bold">
                    R$ {valorNum.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </p>
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Beneficiário:</span>{" "}
                  {doador.beneficiario_doacao || "N/A"}
                </p>
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-white">Partido:</span>{" "}
                  {doador.partido_beneficiario || "N/A"}
                </p>

                {/* Badge de Grupo */}
                <div className="mt-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      doador.grupo?.toLowerCase() === "comurg"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {doador.grupo?.toUpperCase()}
                  </span>

                  {/* Badge de incompatibilidade (se houver) */}
                  {doador.doacao_incompativel_renda?.toUpperCase() === "SIM" && (
                    <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400">
                      VERIFICAR RENDA
                    </span>
                  )}
                </div>

                {/* Detalhes adicionais */}
                {doador.detalhes_doacoes && (
                  <p className="text-xs text-slate-400 mt-2 italic">
                    {doador.detalhes_doacoes}
                  </p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>

    {/* Rodapé */}
    <div className="mt-4 pt-4 border-t border-navy-700">
      <p className="text-sm text-white/50">
        Total de {statsDoadores.total} doador(es) identificado(s)
      </p>
    </div>
  </div>
</div>
```

**Checklist PASSO 6:**
- [ ] Grid de 2 colunas (desktop) / 1 coluna (mobile)
- [ ] **Seção A - Candidaturas:**
  - [ ] Header com ícone Users roxo
  - [ ] Lista de cards com scroll (`max-h-[600px] overflow-y-auto`)
  - [ ] Border-left roxo em cada card
  - [ ] Nome clicável (abre modal)
  - [ ] Ano, Cargo, Partido, Resultado
  - [ ] Badge de grupo (verde/roxo)
  - [ ] Detalhes adicionais (se houver)
  - [ ] Hover effect
  - [ ] Empty state
  - [ ] Rodapé com contador
- [ ] **Seção B - Doações:**
  - [ ] Header com ícone DollarSign azul
  - [ ] Lista de cards com scroll (`max-h-[600px] overflow-y-auto`)
  - [ ] Border-left azul em cada card
  - [ ] Nome clicável (abre modal)
  - [ ] Ano, Valor (formatado R$), Beneficiário, Partido
  - [ ] Badge de grupo (verde/roxo)
  - [ ] Badge de "VERIFICAR RENDA" (se incompatível)
  - [ ] Detalhes adicionais (se houver)
  - [ ] Hover effect
  - [ ] Empty state
  - [ ] Rodapé com contador
- [ ] Scroll independente em cada seção
- [ ] Padding direito (`pr-2`) para scroll bar

---

### PASSO 7: Adicionar Modal de Ficha Funcionário

**⚠️ IMPORTANTE:** O modal já existe no InvestigaRee, mas precisa ser importado.

**No topo do arquivo, adicionar import:**

```typescript
import { FichaFuncionarioModal } from "@/components/FichaFuncionarioModal";
```

**Adicionar antes do fechamento do `</motion.div>`:**

```typescript
{/* Modal de Ficha do Funcionário */}
<FichaFuncionarioModal
  cpf={modalCpf}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
/>
```

**Checklist PASSO 7:**
- [ ] Adicionar import do `FichaFuncionarioModal`
- [ ] Adicionar states `modalCpf` e `isModalOpen` (já deve estar)
- [ ] Adicionar componente modal no final
- [ ] Testar click no nome (candidato)
- [ ] Testar click no nome (doador)
- [ ] Verificar que modal abre com dados corretos
- [ ] Verificar que modal fecha ao clicar fora

---

## 5. CÓDIGO COMPLETO

**Arquivo completo de referência está disponível em:**
```
dashboard-comurg/app/atividade-politica/page.tsx
```

**Para consultar implementações similares:**
- Óbitos: `src/app/dashboard/comurgobitos/page.tsx`
- Empresas: `src/app/dashboard/comurgempresas/page.tsx`
- Achados: `src/app/dashboard/comurgachadoscriticos/page.tsx`

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
  // ADICIONAR NOVA LINHA:
  { label: "Atividade Política", href: "/dashboard/comurgatividadepolitica", icon: Vote, color: "text-purple-400" },
];
```

**Adicionar import do ícone Vote:**

```typescript
import {
  // ... outros imports
  Vote,
} from "lucide-react";
```

**Checklist 6.1:**
- [ ] Abrir `src/app/dashboard/layout.tsx`
- [ ] Adicionar import `Vote` de lucide-react (verificar se já não existe)
- [ ] Adicionar novo item em `comurgNavItems`
- [ ] Label: "Atividade Política"
- [ ] Href: "/dashboard/comurgatividadepolitica"
- [ ] Icon: Vote
- [ ] Color: "text-purple-400"
- [ ] Salvar arquivo

### 6.2. Testar Navegação

**Checklist 6.2:**
- [ ] Recarregar página do InvestigaRee
- [ ] Verificar que link aparece no sidebar COMURG
- [ ] Verificar ícone Vote roxo
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
- [ ] Navegar para `/dashboard/comurgatividadepolitica`
- [ ] DEVE: Página carrega normalmente
- [ ] DEVE: Exibir dados (8 candidatos, 78 doadores)

**Teste 2: Usuário sem tenant**
- [ ] Login com email não-COMURG
- [ ] Tentar acessar `/dashboard/comurgatividadepolitica`
- [ ] DEVE: Redirecionar para `/dashboard`

**Teste 3: Usuário não autenticado**
- [ ] Sem login
- [ ] Tentar acessar URL diretamente
- [ ] DEVE: Redirecionar para página inicial

### 7.2. Testes de Dados

**Teste 4: Contadores**
- [ ] Total de candidatos deve ser 8
- [ ] Total de doadores deve ser 78
- [ ] Total doado deve ser > 0 (valor em R$)
- [ ] Distribuição por grupo deve somar corretamente

**Teste 5: Listas**
- [ ] Seção de candidaturas exibe 8 cards
- [ ] Seção de doações exibe 78 cards
- [ ] Cada card tem nome clicável
- [ ] Informações estão corretas

**Teste 6: Formatação**
- [ ] Valores em R$ com 2 casas decimais
- [ ] Badges de grupo (verde para COMURG, roxo para Cedidos)
- [ ] Cores corretas (roxo para candidatos, azul para doadores)

### 7.3. Testes de UI/UX

**Teste 7: Responsividade**
- [ ] Desktop (> 1024px): Grid 2 colunas
- [ ] Tablet (768-1023px): Grid 1 coluna
- [ ] Mobile (< 768px): Grid 1 coluna empilhada
- [ ] Scroll independente funciona em cada seção

**Teste 8: Interatividade**
- [ ] Hover nos cards (muda background)
- [ ] Click no nome abre modal
- [ ] Modal exibe dados corretos
- [ ] Modal fecha ao clicar fora
- [ ] Animação Framer Motion no carregamento

**Teste 9: Estados Especiais**
- [ ] Loading state: Spinner + texto
- [ ] Error state: Card vermelho
- [ ] Empty state candidatos: Mensagem centralizada
- [ ] Empty state doadores: Mensagem centralizada

### 7.4. Testes de Performance

**Teste 10: Carregamento**
- [ ] Página carrega em < 2 segundos
- [ ] Scroll é suave (60fps)
- [ ] Não há travamentos

**Teste 11: Dark Mode**
- [ ] Cores corretas em dark mode
- [ ] Contraste adequado
- [ ] Background navy-950

---

## 8. CHECKLIST FINAL

### Fase 1: Criação do Arquivo ✅
- [ ] Criar `src/app/dashboard/comurgatividadepolitica/page.tsx`
- [ ] Copiar estrutura base de proteção
- [ ] Implementar loading e error states
- [ ] Adicionar todos os imports necessários
- [ ] Testar que página carrega vazia

### Fase 2: Lógica de Dados ✅
- [ ] Filtrar candidatos (foi_candidato = "SIM")
- [ ] Filtrar doadores (foi_doador_eleitoral = "SIM")
- [ ] Calcular total de doações
- [ ] Calcular estatísticas de candidatos (total, comurg, disposicao)
- [ ] Calcular estatísticas de doadores (total, comurg, disposicao)
- [ ] Testar cálculos com console.log
- [ ] Verificar total de candidatos = 8
- [ ] Verificar total de doadores = 78

### Fase 3: Interface Visual ✅
- [ ] Header com título + contador
- [ ] 3 KPI cards (Candidatos roxo, Doadores azul, Total Doado verde)
- [ ] Alerta informativo roxo
- [ ] Grid de 2 colunas (desktop) / 1 coluna (mobile)
- [ ] Seção A - Candidaturas (completa com scroll)
- [ ] Seção B - Doações (completa com scroll)
- [ ] Cards com hover effect
- [ ] Badges de grupo
- [ ] Badge de "VERIFICAR RENDA" (doações)
- [ ] Empty states
- [ ] Rodapés com contadores

### Fase 4: Modal ✅
- [ ] Import do FichaFuncionarioModal
- [ ] States modalCpf e isModalOpen
- [ ] Componente modal adicionado
- [ ] Click no nome funciona (candidatos)
- [ ] Click no nome funciona (doadores)
- [ ] Modal abre corretamente
- [ ] Modal fecha corretamente

### Fase 5: Navegação ✅
- [ ] Import do ícone Vote no layout
- [ ] Adicionar item em comurgNavItems
- [ ] Testar link no sidebar
- [ ] Testar indicador de página ativa
- [ ] Testar em desktop
- [ ] Testar em mobile

### Fase 6: Testes Completos ✅
- [ ] Proteção de tenant (3 cenários)
- [ ] Dados corretos (contadores, listas, formatação)
- [ ] Responsividade (desktop, tablet, mobile)
- [ ] Interatividade (hover, click, modal)
- [ ] Estados especiais (loading, error, empty)
- [ ] Performance (carregamento, scroll)
- [ ] Dark mode

### Fase 7: Refinamentos ✅
- [ ] Verificar formatação de moeda
- [ ] Verificar cores e contraste
- [ ] Verificar acessibilidade (aria-labels se necessário)
- [ ] Verificar consistência com outras páginas COMURG
- [ ] Code review
- [ ] Commit com mensagem descritiva

---

## 9. PADRÃO VISUAL COMURG

### 9.1. Cores Utilizadas

**KPI Cards:**
- Background: `bg-navy-900`
- Border: `border-navy-700`
- Roxo (Candidatos): `text-purple-400` / `text-purple-500`
- Azul (Doadores): `text-blue-400` / `text-blue-500`
- Verde (Total): `text-green-400` / `text-green-500`

**Cards de Candidatos:**
- Border-left: `border-purple-500`
- Nome: `text-purple-400`
- Background: `bg-navy-800/50`
- Hover: `hover:bg-navy-800`

**Cards de Doadores:**
- Border-left: `border-blue-500`
- Nome: `text-blue-400`
- Valor: `text-emerald-400`
- Background: `bg-navy-800/50`
- Hover: `hover:bg-navy-800`

**Badges:**
- COMURG: `bg-green-500/20 text-green-400`
- Cedidos: `bg-purple-500/20 text-purple-400`
- Verificar Renda: `bg-red-500/20 text-red-400`
- Eleito: `text-green-400`
- Não Eleito: `text-orange-400`

**Alerta:**
- Roxo: `bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-500`

---

## 10. DICAS IMPORTANTES PARA O AGENTE

### 10.1. Atenção Especial

⚠️ **Scroll Independente:**
- Cada seção tem `max-h-[600px]` e `overflow-y-auto`
- Adicionar `pr-2` para padding da scroll bar
- Scroll NÃO deve afetar a página inteira

⚠️ **Formatação de Moeda:**
- SEMPRE usar `.toLocaleString('pt-BR', { minimumFractionDigits: 2 })`
- Tratar string de doação: `.replace(/[^\d,.-]/g, "").replace(",", ".")`
- Converter para número: `parseFloat(valor) || 0`

⚠️ **Proteção de Tenant:**
- DEVE ter `useEffect` com redirecionamento
- DEVE ter `if` de bloqueio de renderização
- DEVE estar envolvido pelo ComurgDataProvider no layout

⚠️ **Click no Nome:**
- Usar `<button>` com `onClick`
- Setar `modalCpf` com CPF do funcionário
- Setar `isModalOpen` para `true`
- Classe: `cursor-pointer text-left hover:underline`

### 10.2. Erros Comuns a Evitar

❌ **NÃO** carregar JSON diretamente
✅ **SIM** usar `useComurgData()` hook

❌ **NÃO** fazer scroll na página inteira
✅ **SIM** scroll apenas dentro de cada seção

❌ **NÃO** esquecer de converter string para número (doações)
✅ **SIM** usar `.replace()` e `parseFloat()`

❌ **NÃO** usar cores diferentes do padrão COMURG
✅ **SIM** seguir exatamente as cores definidas

❌ **NÃO** esquecer de testar proteção de tenant
✅ **SIM** testar com usuário COMURG e não-COMURG

---

## 11. EXEMPLO DE CARD COMPLETO

**Card de Candidato:**
```typescript
<div className="border-l-4 border-purple-500 pl-4 py-2 bg-navy-800/50 rounded-r-lg hover:bg-navy-800 transition-colors">
  <button
    onClick={() => { setModalCpf(candidato.cpf); setIsModalOpen(true); }}
    className="font-bold text-purple-400 hover:text-purple-300 hover:underline cursor-pointer text-left text-lg"
  >
    JOÃO DA SILVA
  </button>
  <div className="mt-2 space-y-1">
    <p className="text-sm text-slate-300">
      <span className="font-semibold text-white">Ano:</span> 2020
    </p>
    <p className="text-sm text-slate-300">
      <span className="font-semibold text-white">Cargo:</span> Vereador
    </p>
    <p className="text-sm text-slate-300">
      <span className="font-semibold text-white">Partido:</span> PT
    </p>
    <p className="text-sm text-slate-300">
      <span className="font-semibold text-white">Resultado:</span>{" "}
      <span className="font-bold text-orange-400">Não Eleito</span>
    </p>
    <div className="mt-2">
      <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400">
        COMURG
      </span>
    </div>
  </div>
</div>
```

**Card de Doador:**
```typescript
<div className="border-l-4 border-blue-500 pl-4 py-2 bg-navy-800/50 rounded-r-lg hover:bg-navy-800 transition-colors">
  <button
    onClick={() => { setModalCpf(doador.cpf); setIsModalOpen(true); }}
    className="font-bold text-blue-400 hover:text-blue-300 hover:underline cursor-pointer text-left text-lg"
  >
    MARIA OLIVEIRA
  </button>
  <div className="mt-2 space-y-1">
    <p className="text-sm text-slate-300">
      <span className="font-semibold text-white">Ano:</span> 2022
    </p>
    <p className="text-sm text-slate-300">
      <span className="font-semibold text-white">Valor Total:</span>{" "}
      <span className="text-emerald-400 font-bold">R$ 5.000,00</span>
    </p>
    <p className="text-sm text-slate-300">
      <span className="font-semibold text-white">Beneficiário:</span> José Santos
    </p>
    <p className="text-sm text-slate-300">
      <span className="font-semibold text-white">Partido:</span> PSDB
    </p>
    <div className="mt-2">
      <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400">
        COMURG
      </span>
      <span className="ml-2 px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400">
        VERIFICAR RENDA
      </span>
    </div>
  </div>
</div>
```

---

## 12. ESTIMATIVA DE TEMPO

**Total:** 4-5 horas

- Criação do arquivo base: 30 min
- Lógica de dados e filtros: 1 hora
- Interface visual (header + KPIs + alerta): 1 hora
- Seções de candidaturas e doações: 1h30min
- Modal e navegação: 30 min
- Testes completos: 1 hora

---

## ✅ PRONTO PARA IMPLEMENTAR!

**Este plano está COMPLETO e DETALHADO para outro agente implementar.**

**Inclui:**
✅ Análise completa de dados
✅ Wireframe visual
✅ Código passo a passo
✅ Todos os imports necessários
✅ Todos os cálculos de dados
✅ Formatação de moeda
✅ Proteção de tenant
✅ Loading e error states
✅ Modal de ficha
✅ Navegação no sidebar
✅ Checklist completo
✅ Exemplos de código
✅ Dicas e alertas
✅ Testes de validação

**Arquivo:** `PLANO_IMPLEMENTACAO_ATIVIDADE_POLITICA_COMURG.md`

---

📄 **Documento pronto para ser passado para outro agente implementar!**
