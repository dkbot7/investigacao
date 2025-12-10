# 📋 PLANO DE IMPLEMENTAÇÃO - PÁGINA BENEFÍCIOS FEDERAIS (TENANT COMURG)

**Data:** 10/12/2025
**Responsável:** Dani Kaloi - InvestigaRee
**Rota:** `/dashboard/comurgbenefícios`
**Objetivo:** Implementar página de Benefícios Federais dentro do tenant COMURG

---

## 🎯 OBJETIVO

Criar a página **Benefícios Federais** no InvestigaRee, seguindo exatamente o padrão das páginas COMURG já existentes:
- `/dashboard/comurgecedidos` (Funcionários Cedidos)
- `/dashboard/comurgachadoscriticos` (Achados Críticos)
- `/dashboard/comurgobitos` (Óbitos Confirmados)
- `/dashboard/comurgempresas` (Vínculos Empresariais)

---

## 📊 ANÁLISE DE DADOS

### Dados Disponíveis

**Fonte:** `useComurgData()` context que carrega `dados_consolidados.csv`

**Campos relacionados a benefícios:**
- `recebe_beneficio` - "SIM" / "NÃO"
- `qual_beneficio` - Descrição do benefício
- `beneficio_ativo` - Status do benefício
- `data_inicio_beneficio` - Data de início
- `fonte_beneficio` - Origem do benefício
- `renda_declarada_gov` - Renda declarada ao governo
- `beneficio_possivelmente_indevido` - Flag de incompatibilidade

**Total de casos:** 35 funcionários com benefícios federais

---

## 🏗️ ESTRUTURA DA PÁGINA

### 1. Rota e Arquivo

**Criar arquivo:**
```
src/app/dashboard/comurgbenefícios/page.tsx
```

**Rota de acesso:**
```
https://investigaree.com.br/dashboard/comurgbenefícios
```

---

### 2. Estrutura Visual (Seguindo Padrão COMURG)

```
┌─────────────────────────────────────────────────────────┐
│ [Ícone] Benefícios Federais                             │
│ 35 benefícios identificados - Verificação de elegibilidade│
└─────────────────────────────────────────────────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ TOTAL        │ │ POSSIVELMENTE│ │ VALOR MÉDIO  │
│ BENEFICIÁRIOS│ │ INDEVIDOS    │ │ SALÁRIO      │
│ 35           │ │ X            │ │ R$ X.XXX,XX  │
└──────────────┘ └──────────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────┐
│ Alerta Informativo                                      │
│ Benefícios federais sendo recebidos por funcionários    │
│ públicos municipais. Verificar elegibilidade conforme   │
│ critérios de renda e compatibilidade legal.             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Lista de Beneficiários                                  │
│                                                         │
│ [Tabela com todos os beneficiários]                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 IMPLEMENTAÇÃO DETALHADA

### PASSO 1: Criar Estrutura Base do Arquivo

**Arquivo:** `src/app/dashboard/comurgbenefícios/page.tsx`

```typescript
"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Gift, AlertCircle, DollarSign } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";
import { useComurgData } from "@/contexts/ComurgDataContext";

export default function ComurgBeneficios() {
  const { userInfo, loading: authLoading } = useUserAccess();
  const { funcionarios, loading: dataLoading, error } = useComurgData();
  const router = useRouter();

  // Proteção: apenas usuários do tenant COMURG podem acessar
  useEffect(() => {
    if (!authLoading && userInfo?.tenant?.code !== 'COMURG') {
      router.push('/dashboard');
    }
  }, [userInfo, authLoading, router]);

  // TODO: Implementar lógica da página

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
- [ ] Criar arquivo `src/app/dashboard/comurgbenefícios/page.tsx`
- [ ] Copiar estrutura base das outras páginas COMURG
- [ ] Adicionar imports necessários
- [ ] Implementar proteção de tenant
- [ ] Adicionar loading e error states
- [ ] Testar que a página carrega (vazia por enquanto)

---

### PASSO 2: Filtrar Dados de Benefícios

```typescript
// Filtrar funcionários com benefícios
const beneficiarios = useMemo(() => {
  return funcionarios.filter((f) => {
    // Critério: recebe benefício federal
    const recebeBeneficio = f.recebe_beneficio &&
      String(f.recebe_beneficio).toUpperCase() === 'SIM';

    return recebeBeneficio;
  });
}, [funcionarios]);

// Calcular estatísticas
const stats = useMemo(() => {
  const total = beneficiarios.length;

  // Contar possivelmente indevidos
  const indevidos = beneficiarios.filter(b =>
    b.beneficio_possivelmente_indevido &&
    String(b.beneficio_possivelmente_indevido).toUpperCase() === 'SIM'
  ).length;

  // Calcular salário médio dos beneficiários
  const totalSalarios = beneficiarios.reduce((sum, b) =>
    sum + (parseFloat(String(b.salario || 0)) || 0), 0
  );
  const salarioMedio = total > 0 ? totalSalarios / total : 0;

  // Distribuição por grupo
  const comurg = beneficiarios.filter(b =>
    b.grupo?.toLowerCase() === "comurg"
  ).length;
  const disposicao = beneficiarios.filter(b =>
    b.grupo?.toLowerCase() === "disposicao"
  ).length;

  return {
    total,
    indevidos,
    salarioMedio,
    comurg,
    disposicao
  };
}, [beneficiarios]);
```

**Checklist PASSO 2:**
- [ ] Implementar filtro `useMemo` para beneficiários
- [ ] Calcular total de beneficiários
- [ ] Calcular benefícios possivelmente indevidos
- [ ] Calcular salário médio
- [ ] Calcular distribuição por grupo (COMURG vs Disposição)
- [ ] Testar cálculos com console.log

---

### PASSO 3: Implementar Header

```typescript
{/* Header */}
<div>
  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
    <Gift className="w-8 h-8 text-blue-400" />
    Benefícios Federais
  </h1>
  <p className="text-slate-600 dark:text-white/60 mt-2">
    {stats.total} benefícios identificados - Verificação de elegibilidade
  </p>
</div>
```

**Checklist PASSO 3:**
- [ ] Adicionar header com título
- [ ] Usar ícone `Gift` (lucide-react)
- [ ] Adicionar contador dinâmico
- [ ] Seguir estilo das outras páginas COMURG
- [ ] Testar responsividade

---

### PASSO 4: Implementar KPI Cards

```typescript
{/* KPI Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Card 1: Total Beneficiários */}
  <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-400 font-medium">TOTAL BENEFICIÁRIOS</p>
        <p className="text-4xl font-bold text-blue-500">{stats.total}</p>
        <p className="text-sm text-blue-400 mt-2">
          COMURG: {stats.comurg} | Cedidos: {stats.disposicao}
        </p>
      </div>
      <Gift className="w-16 h-16 text-blue-500" />
    </div>
  </div>

  {/* Card 2: Possivelmente Indevidos */}
  <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-orange-400 font-medium">POSSIVELMENTE INDEVIDOS</p>
        <p className="text-4xl font-bold text-orange-500">{stats.indevidos}</p>
        <p className="text-sm text-orange-400 mt-2">
          {stats.total > 0
            ? `${((stats.indevidos / stats.total) * 100).toFixed(1)}% do total`
            : '0%'}
        </p>
      </div>
      <AlertCircle className="w-16 h-16 text-orange-500" />
    </div>
  </div>

  {/* Card 3: Salário Médio */}
  <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-green-400 font-medium">SALÁRIO MÉDIO</p>
        <p className="text-3xl font-bold text-green-500">
          R$ {stats.salarioMedio.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>
        <p className="text-sm text-green-400 mt-2">Dos beneficiários</p>
      </div>
      <DollarSign className="w-16 h-16 text-green-500" />
    </div>
  </div>
</div>
```

**Checklist PASSO 4:**
- [ ] Implementar 3 KPI cards
- [ ] Card 1: Total Beneficiários (azul)
- [ ] Card 2: Possivelmente Indevidos (laranja)
- [ ] Card 3: Salário Médio (verde)
- [ ] Usar ícones apropriados (Gift, AlertCircle, DollarSign)
- [ ] Formatação de números e percentuais
- [ ] Seguir cores do padrão COMURG (navy-900, border navy-700)
- [ ] Testar responsividade (grid md:grid-cols-3)

---

### PASSO 5: Implementar Alerta Informativo

```typescript
{/* Alerta Informativo */}
<div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-lg">
  <div className="flex items-start">
    <Gift className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" />
    <div>
      <p className="font-bold text-blue-800 dark:text-blue-400">
        ATENÇÃO - BENEFÍCIOS FEDERAIS
      </p>
      <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
        Benefícios federais sendo recebidos por funcionários públicos municipais.
        Verificar elegibilidade conforme critérios de renda familiar e compatibilidade
        legal com o vínculo público municipal. Benefícios como BPC (Benefício de
        Prestação Continuada) possuem critérios específicos de renda que podem ser
        incompatíveis com salários do serviço público.
      </p>
    </div>
  </div>
</div>
```

**Checklist PASSO 5:**
- [ ] Implementar alerta informativo azul
- [ ] Usar mesmo padrão do alerta de óbitos (mas cor azul)
- [ ] Texto explicativo sobre benefícios
- [ ] Ícone Gift
- [ ] Border-left azul
- [ ] Background azul claro (light mode) / azul escuro (dark mode)

---

### PASSO 6: Implementar Tabela de Beneficiários

```typescript
{/* Tabela de Beneficiários */}
<div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
  <h2 className="text-xl font-bold text-white mb-4">
    Lista Completa de Beneficiários
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-navy-800 border-b border-navy-700">
        <tr>
          <th className="text-left p-3 text-sm font-semibold text-white/70">Nome</th>
          <th className="text-left p-3 text-sm font-semibold text-white/70">CPF</th>
          <th className="text-left p-3 text-sm font-semibold text-white/70">Grupo</th>
          <th className="text-left p-3 text-sm font-semibold text-white/70">Cargo</th>
          <th className="text-right p-3 text-sm font-semibold text-white/70">Salário</th>
          <th className="text-left p-3 text-sm font-semibold text-white/70">Benefício</th>
          <th className="text-left p-3 text-sm font-semibold text-white/70">Fonte</th>
          <th className="text-center p-3 text-sm font-semibold text-white/70">Status</th>
          <th className="text-center p-3 text-sm font-semibold text-white/70">Indevido?</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-navy-700">
        {beneficiarios.length === 0 ? (
          <tr>
            <td colSpan={9} className="p-8 text-center text-white/50">
              Nenhum beneficiário encontrado
            </td>
          </tr>
        ) : (
          beneficiarios.map((beneficiario, index) => (
            <tr key={index} className="hover:bg-navy-800/50 transition-colors">
              {/* Nome */}
              <td className="p-3 text-white font-medium">
                {beneficiario.nome}
              </td>

              {/* CPF */}
              <td className="p-3 text-sm text-slate-400 font-mono">
                {beneficiario.cpf}
              </td>

              {/* Grupo */}
              <td className="p-3 text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    beneficiario.grupo?.toLowerCase() === "comurg"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}
                >
                  {beneficiario.grupo?.toUpperCase()}
                </span>
              </td>

              {/* Cargo */}
              <td className="p-3 text-sm text-slate-300">
                {beneficiario.cargo || "N/A"}
              </td>

              {/* Salário */}
              <td className="p-3 text-right text-sm font-mono text-emerald-400">
                R$ {(parseFloat(String(beneficiario.salario || 0)) || 0).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>

              {/* Benefício */}
              <td className="p-3 text-sm text-slate-300">
                {beneficiario.qual_beneficio || "N/A"}
              </td>

              {/* Fonte */}
              <td className="p-3 text-sm text-slate-400">
                {beneficiario.fonte_beneficio || "N/A"}
              </td>

              {/* Status */}
              <td className="p-3 text-center">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    beneficiario.beneficio_ativo?.toUpperCase() === "SIM"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {beneficiario.beneficio_ativo?.toUpperCase() === "SIM"
                    ? "ATIVO"
                    : "INATIVO"}
                </span>
              </td>

              {/* Indevido? */}
              <td className="p-3 text-center">
                {beneficiario.beneficio_possivelmente_indevido?.toUpperCase() === "SIM" ? (
                  <span className="px-2 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400">
                    VERIFICAR
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400">
                    OK
                  </span>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>

  {/* Rodapé da tabela */}
  <div className="mt-4 pt-4 border-t border-navy-700">
    <p className="text-sm text-white/50">
      Total de {beneficiarios.length} beneficiário(s) encontrado(s)
    </p>
  </div>
</div>
```

**Checklist PASSO 6:**
- [ ] Implementar tabela completa
- [ ] 9 colunas: Nome, CPF, Grupo, Cargo, Salário, Benefício, Fonte, Status, Indevido?
- [ ] Headers com bg-navy-800
- [ ] Rows com hover effect (hover:bg-navy-800/50)
- [ ] Badge de grupo (verde/roxo)
- [ ] Badge de status (ativo/inativo)
- [ ] Badge de "Indevido?" (vermelho/verde)
- [ ] Formatação de salário em R$
- [ ] Empty state caso não tenha beneficiários
- [ ] Contador no rodapé
- [ ] Overflow-x-auto para responsividade

---

### PASSO 7: Adicionar Link no Sidebar

**Arquivo:** `src/app/dashboard/layout.tsx`

**Localizar o array `comurgNavItems` (linha ~64):**

```typescript
const comurgNavItems: NavItem[] = [
  { label: "Funcionários Cedidos", href: "/dashboard/comurgecedidos", icon: Building2, color: "text-emerald-400" },
  { label: "Achados Críticos", href: "/dashboard/comurgachadoscriticos", icon: AlertTriangle, color: "text-red-400" },
  { label: "Óbitos Confirmados", href: "/dashboard/comurgobitos", icon: Skull, color: "text-red-500" },
  { label: "Vínculos Empresariais", href: "/dashboard/comurgempresas", icon: Building2, color: "text-orange-400" },
  // ADICIONAR NOVA LINHA:
  { label: "Benefícios Federais", href: "/dashboard/comurgbenefícios", icon: Gift, color: "text-blue-400" },
];
```

**Adicionar import do ícone Gift:**

```typescript
import {
  // ... outros imports
  Gift,
} from "lucide-react";
```

**Checklist PASSO 7:**
- [ ] Abrir `src/app/dashboard/layout.tsx`
- [ ] Adicionar import `Gift` de lucide-react
- [ ] Adicionar novo item em `comurgNavItems`
- [ ] Label: "Benefícios Federais"
- [ ] Href: "/dashboard/comurgbenefícios"
- [ ] Icon: Gift
- [ ] Color: "text-blue-400"
- [ ] Testar que link aparece no sidebar
- [ ] Testar que rota funciona
- [ ] Verificar indicador de página ativa

---

## ✅ CHECKLIST FINAL DE IMPLEMENTAÇÃO

### Fase 1: Criação do Arquivo Base
- [ ] Criar arquivo `src/app/dashboard/comurgbenefícios/page.tsx`
- [ ] Copiar estrutura base de proteção de tenant
- [ ] Implementar loading e error states
- [ ] Testar que página carrega vazia

### Fase 2: Lógica de Dados
- [ ] Implementar filtro de beneficiários com `useMemo`
- [ ] Calcular estatísticas (total, indevidos, salário médio)
- [ ] Calcular distribuição por grupo
- [ ] Testar cálculos com console.log

### Fase 3: Interface Visual
- [ ] Implementar header com título e contador
- [ ] Implementar 3 KPI cards (Total, Indevidos, Salário Médio)
- [ ] Implementar alerta informativo azul
- [ ] Implementar tabela completa de beneficiários
- [ ] Testar responsividade

### Fase 4: Navegação
- [ ] Adicionar import `Gift` no layout
- [ ] Adicionar item no array `comurgNavItems`
- [ ] Testar link no sidebar
- [ ] Testar indicador de página ativa
- [ ] Testar navegação entre páginas

### Fase 5: Testes
- [ ] Testar proteção de tenant (acesso negado para não-COMURG)
- [ ] Testar com usuário COMURG (deve funcionar)
- [ ] Testar loading states
- [ ] Testar error states
- [ ] Testar com 0 beneficiários (empty state)
- [ ] Testar com 35 beneficiários (dados reais)
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Testar dark mode
- [ ] Testar hover effects
- [ ] Testar animações Framer Motion

### Fase 6: Refinamentos
- [ ] Verificar formatação de números
- [ ] Verificar formatação de moeda
- [ ] Verificar cores e contraste
- [ ] Verificar acessibilidade (aria-labels)
- [ ] Verificar consistência com outras páginas COMURG
- [ ] Code review
- [ ] Commit com mensagem descritiva

---

## 🎨 PADRÃO VISUAL COMURG

### Cores Utilizadas

**KPI Cards:**
- Background: `bg-navy-900`
- Border: `border-navy-700`
- Azul: `text-blue-400` / `text-blue-500`
- Laranja: `text-orange-400` / `text-orange-500`
- Verde: `text-green-400` / `text-green-500`
- Vermelho: `text-red-400` / `text-red-500`
- Roxo: `text-purple-400` / `text-purple-500`

**Tabela:**
- Background: `bg-navy-900`
- Header: `bg-navy-800`
- Border: `border-navy-700`
- Hover: `hover:bg-navy-800/50`
- Text: `text-white`, `text-white/70`, `text-slate-300`, `text-slate-400`

**Badges:**
- Verde (COMURG): `bg-green-500/20 text-green-400`
- Roxo (Cedidos): `bg-purple-500/20 text-purple-400`
- Vermelho (Alerta): `bg-red-500/20 text-red-400`
- Verde (OK): `bg-green-500/20 text-green-400`

**Alertas:**
- Azul (Info): `bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500`
- Vermelho (Crítico): `bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500`

---

## 📊 DADOS DE REFERÊNCIA

### Estatísticas Esperadas

Com base nos dados do CLIENTE_01:
- **Total de beneficiários:** 35
- **Tipos de benefício:** BPC (Benefício de Prestação Continuada)
- **Fonte:** Portal da Transparência
- **Critério de incompatibilidade:** Renda familiar + salário público

### Campos da Tabela

| Campo | Tipo | Exemplo |
|-------|------|---------|
| nome | string | "JOÃO DA SILVA" |
| cpf | string | "123.456.789-00" |
| grupo | string | "COMURG" ou "Disposicao" |
| cargo | string | "Agente Administrativo" |
| salario | number | 3500.00 |
| qual_beneficio | string | "BPC - Benefício de Prestação Continuada" |
| fonte_beneficio | string | "Portal da Transparência" |
| beneficio_ativo | string | "SIM" ou "NÃO" |
| beneficio_possivelmente_indevido | string | "SIM" ou "NÃO" |

---

## 🚨 PONTOS DE ATENÇÃO

### 1. Proteção de Tenant
- **CRÍTICO:** Verificar `userInfo?.tenant?.code !== 'COMURG'` em useEffect
- Redirecionar para `/dashboard` se não for COMURG
- Retornar `null` se renderização bloqueada

### 2. Loading States
- Mostrar spinner enquanto carrega autenticação
- Mostrar spinner enquanto carrega dados
- Texto: "Carregando dados..."

### 3. Error Handling
- Mostrar erro se falha ao carregar dados
- Card vermelho com ícone AlertCircle
- Mensagem de erro clara

### 4. Empty State
- Mostrar mensagem se não houver beneficiários
- Texto: "Nenhum beneficiário encontrado"
- Centralizado na tabela

### 5. Formatação
- **Moeda:** Sempre usar `.toLocaleString('pt-BR', { minimumFractionDigits: 2 })`
- **Percentual:** Usar `.toFixed(1)` e adicionar "%"
- **Números:** Usar `.toLocaleString('pt-BR')`

### 6. Responsividade
- Grid de KPIs: `grid-cols-1 md:grid-cols-3`
- Tabela: Usar `overflow-x-auto`
- Padding: `p-4 lg:p-8`

### 7. Acessibilidade
- Usar cores com contraste adequado
- Adicionar aria-labels nos ícones
- Garantir navegação por teclado

---

## 📝 CÓDIGO COMPLETO DE REFERÊNCIA

**Arquivo final completo disponível em:**
- Dashboard local: `dashboard-comurg/app/beneficios/page.tsx`

**Para consultar implementações similares:**
- Óbitos: `src/app/dashboard/comurgobitos/page.tsx`
- Empresas: `src/app/dashboard/comurgempresas/page.tsx`
- Achados: `src/app/dashboard/comurgachadoscriticos/page.tsx`

---

## 🎯 RESULTADO ESPERADO

Após implementação completa, a página `/dashboard/comurgbenefícios` deve:

✅ Aparecer no sidebar COMURG com ícone Gift azul
✅ Ser acessível apenas para tenant COMURG
✅ Mostrar 35 beneficiários em tabela
✅ Exibir 3 KPIs principais
✅ Ter alerta informativo azul
✅ Seguir exatamente o padrão visual das outras páginas COMURG
✅ Funcionar em mobile, tablet e desktop
✅ Ter loading e error states
✅ Ter hover effects e animações

---

## 📅 ESTIMATIVA DE TEMPO

**Total:** 3-4 horas

- Criação do arquivo base: 30 min
- Lógica de dados e filtros: 45 min
- Interface visual (header + KPIs + alerta): 1 hora
- Tabela completa: 1 hora
- Navegação e testes: 45 min

---

## ✅ PRONTO PARA IMPLEMENTAR!

**Próximo passo:** Começar pela FASE 1 - Criação do Arquivo Base

Quer que eu comece a implementação agora? 🚀
