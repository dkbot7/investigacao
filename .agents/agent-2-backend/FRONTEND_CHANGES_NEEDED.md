# MUDANÇAS NECESSÁRIAS NO FRONTEND - SPRINT 1 COMPLIANCE
**Data**: 2025-12-08
**Agent**: Agent 2 - Backend Engineer
**Contexto**: Implementação de compliance (PEP, CEIS/CNEP, OFAC, LGPD) no backend

---

## 📋 RESUMO EXECUTIVO

Com a implementação do **SPRINT 1 - Compliance Critical** no backend, o frontend precisa ser atualizado para:

1. **Consumir novos endpoints de compliance** (`/api/compliance/*`)
2. **Exibir dados de PEP, CEIS, CNEP, CEAF** nas páginas existentes
3. **Criar novas páginas** para gestão LGPD
4. **Atualizar componentes** para mostrar níveis de risco
5. **Adicionar filtros e exportação** para dados de compliance

---

## 🎯 ARQUITETURA ATUAL DO FRONTEND

### **Estrutura Existente**

```
investigaree/src/
├── app/dashboard/
│   ├── page.tsx                    # Dashboard principal
│   ├── ofac/page.tsx              # ✅ Já existe (usa mock data)
│   ├── sancionados/page.tsx       # ✅ Já existe (usa mock data)
│   ├── consultas/cpf/page.tsx     # ✅ Consulta CPF
│   ├── consultas/cnpj/page.tsx    # ✅ Consulta CNPJ
│   └── ...
├── hooks/
│   ├── useDashboardData.ts        # ✅ Hook principal para dados
│   └── ...
├── lib/
│   ├── api.ts                     # ✅ Cliente API genérico
│   └── ...
└── components/dashboard/
    ├── FichaFuncionario.tsx       # ✅ Modal de detalhes
    └── ...
```

### **Problemas Identificados**

1. ❌ **Páginas usam dados mockados** (`mock-data.ts` foi desabilitado por segurança)
2. ❌ **Não existem endpoints de compliance** em `api.ts`
3. ❌ **Faltam páginas** para gestão LGPD
4. ❌ **Não há integração** com novos serviços de compliance
5. ❌ **Dashboard principal** não mostra métricas de PEP/compliance

---

## 🔧 MUDANÇAS NECESSÁRIAS

### **1. ADICIONAR ENDPOINTS DE COMPLIANCE** (`lib/api.ts`)

Adicionar novas funções para consumir os endpoints implementados no backend:

```typescript
// ============================================
// COMPLIANCE API - SPRINT 1
// ============================================

/**
 * Verificar CPF na lista PEP
 */
export interface PEPVerificationResult {
  cpf: string;
  isPEP: boolean;
  pep?: {
    cpf: string;
    nome: string;
    cargo: string;
    orgao: string;
    nivel_federacao: 'federal' | 'estadual' | 'municipal';
    uf?: string;
    municipio?: string;
    data_inicio?: string;
    data_fim?: string;
    situacao: 'ativo' | 'inativo';
  };
  nivel_risco: 'baixo' | 'medio' | 'alto';
  verificado_em: string;
}

export async function verificarPEP(cpf: string): Promise<PEPVerificationResult> {
  return fetchAPI(`/api/compliance/pep/verificar?cpf=${cpf}`);
}

/**
 * Buscar PEP por nome
 */
export async function buscarPEPPorNome(nome: string): Promise<any[]> {
  return fetchAPI(`/api/compliance/pep/buscar?nome=${encodeURIComponent(nome)}`);
}

/**
 * Verificar sanções CGU (CEIS + CNEP + CEAF)
 */
export interface SancoesConsolidadasResult {
  documento: string;
  tipo: 'cpf' | 'cnpj';
  totalSancoes: number;
  nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico';
  sancoes: {
    ceis: { total: number; records: any[] };
    cnep: { total: number; records: any[] };
    ceaf: { total: number; records: any[] };
  };
  verificado_em: string;
}

export async function verificarSancoesConsolidadas(
  documento: string
): Promise<SancoesConsolidadasResult> {
  return fetchAPI(`/api/compliance/cgu/consolidado?documento=${documento}`);
}

/**
 * Consultar CEIS (Empresas Inidôneas e Suspensas)
 */
export async function consultarCEIS(documento: string): Promise<any[]> {
  return fetchAPI(`/api/compliance/cgu/ceis?documento=${documento}`);
}

/**
 * Consultar CNEP (Empresas Punidas - Lei Anticorrupção)
 */
export async function consultarCNEP(cnpj: string): Promise<any[]> {
  return fetchAPI(`/api/compliance/cgu/cnep?cnpj=${cnpj}`);
}

/**
 * Consultar CEAF (Acordos de Leniência)
 */
export async function consultarCEAF(cnpj: string): Promise<any[]> {
  return fetchAPI(`/api/compliance/cgu/ceaf?cnpj=${cnpj}`);
}

/**
 * Verificar OFAC SDN List
 */
export interface OFACVerificationResult {
  nome: string;
  encontrado: boolean;
  matches: Array<{
    ent_num: string;
    sdn_name: string;
    sdn_type: string;
    programs: string[];
    remarks: string;
    score: number;
  }>;
  nivel_risco: 'baixo' | 'medio' | 'alto' | 'critico';
  verificado_em: string;
}

export async function verificarOFAC(
  nome: string,
  threshold?: number
): Promise<OFACVerificationResult> {
  const params = threshold ? `?threshold=${threshold}` : '';
  return fetchAPI(`/api/compliance/ofac/verificar?nome=${encodeURIComponent(nome)}${params}`);
}

/**
 * Obter estatísticas PEP
 */
export async function getPEPStats(): Promise<any[]> {
  return fetchAPI('/api/compliance/pep/stats');
}

// ============================================
// LGPD API
// ============================================

/**
 * Criar solicitação LGPD (acesso, retificação, eliminação, etc.)
 */
export interface LGPDRequest {
  tipo_solicitacao: 'acesso' | 'retificacao' | 'anonimizacao' | 'eliminacao' | 'portabilidade' | 'informacao' | 'revogacao';
  email: string;
  nome?: string;
  cpf?: string;
  telefone?: string;
  descricao?: string;
}

export async function criarSolicitacaoLGPD(request: LGPDRequest): Promise<any> {
  return fetchAPI('/api/lgpd/solicitacao', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Listar minhas solicitações LGPD
 */
export async function listarMinhasSolicitacoesLGPD(): Promise<any[]> {
  return fetchAPI('/api/lgpd/minhas-solicitacoes');
}

/**
 * Revogar consentimento LGPD
 */
export async function revogarConsentimento(documento: string, motivo: string): Promise<any> {
  return fetchAPI('/api/lgpd/revogar-consentimento', {
    method: 'POST',
    body: JSON.stringify({ documento, motivo }),
  });
}

/**
 * Exportar meus dados (portabilidade LGPD)
 */
export async function exportarMeusDados(): Promise<Blob> {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  const token = await user.getIdToken();
  const response = await fetch(`${API_BASE_URL}/api/lgpd/exportar-dados`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) throw new Error('Erro ao exportar dados');
  return response.blob();
}
```

**Localização**: `investigaree/src/lib/api.ts`
**Linhas a adicionar**: ~150 linhas após as funções existentes

---

### **2. ATUALIZAR HOOK useDashboardData.ts**

Adicionar suporte para dados de compliance:

```typescript
// Adicionar ao interface DashboardData
interface DashboardData {
  // ... campos existentes ...

  compliance?: {
    totalPEP: number;
    totalSancoesCEIS: number;
    totalSancoesCNEP: number;
    totalOFACMatches: number;
    nivelRiscoGeral: 'baixo' | 'medio' | 'alto' | 'critico';
  };
}

// Adicionar ao fetchData()
const fetchData = useCallback(async () => {
  // ... código existente ...

  try {
    const [dashboardRes, obitosRes, candidatosRes, doadoresRes, sancionadosRes, complianceRes] =
      await Promise.all([
        getDashboardData(),
        getObitos(),
        getCandidatos(),
        getDoadores(),
        getSancionados(),
        getComplianceStats(), // NOVO
      ]);

    // ... resto do código ...
  }
}, [user, hasAccess]);
```

**Localização**: `investigaree/src/hooks/useDashboardData.ts`

---

### **3. CRIAR NOVA PÁGINA: dashboard/compliance/page.tsx**

Nova página para visão consolidada de compliance:

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Users,
  Globe,
  FileText,
  Search,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPEPStats,
  verificarPEP,
  verificarSancoesConsolidadas,
  verificarOFAC,
} from "@/lib/api";

export default function CompliancePage() {
  const [pepStats, setPepStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca individual
  const [searchCPF, setSearchCPF] = useState("");
  const [pepResult, setPepResult] = useState<any>(null);
  const [sancoesResult, setSancoesResult] = useState<any>(null);
  const [ofacResult, setOfacResult] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const stats = await getPEPStats();
      setPepStats(stats);
    } catch (error) {
      console.error("Erro ao carregar stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerificar = async () => {
    if (!searchCPF) return;

    setLoading(true);
    try {
      const [pep, sancoes, ofac] = await Promise.all([
        verificarPEP(searchCPF),
        verificarSancoesConsolidadas(searchCPF),
        verificarOFAC(searchCPF), // Aqui deveria buscar o nome primeiro
      ]);

      setPepResult(pep);
      setSancoesResult(sancoes);
      setOfacResult(ofac);
    } catch (error) {
      console.error("Erro ao verificar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <Shield className="w-7 h-7 text-blue-400" />
            Compliance & Due Diligence
          </h1>
          <p className="text-slate-600 dark:text-white/60 mt-1">
            Verificação de PEP, sanções (CEIS/CNEP) e listas internacionais (OFAC)
          </p>
        </div>

        {/* Busca Individual */}
        <div className="bg-white dark:bg-navy-900 border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Verificação Individual</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Digite o CPF..."
              value={searchCPF}
              onChange={(e) => setSearchCPF(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-navy-800 border rounded-lg"
            />
            <Button onClick={handleVerificar} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Verificar
            </Button>
          </div>

          {/* Resultados */}
          {pepResult && (
            <div className="mt-4 space-y-3">
              {/* Card PEP */}
              <div className={`p-4 rounded-lg border ${
                pepResult.isPEP
                  ? 'bg-red-500/10 border-red-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              }`}>
                <h4 className="font-medium">
                  PEP: {pepResult.isPEP ? '⚠️ SIM' : '✅ NÃO'}
                </h4>
                {pepResult.isPEP && (
                  <p className="text-sm mt-1">
                    {pepResult.pep.cargo} - {pepResult.pep.orgao}
                  </p>
                )}
              </div>

              {/* Card Sanções */}
              <div className={`p-4 rounded-lg border ${
                sancoesResult.totalSancoes > 0
                  ? 'bg-orange-500/10 border-orange-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              }`}>
                <h4 className="font-medium">
                  Sanções: {sancoesResult.totalSancoes > 0 ? `⚠️ ${sancoesResult.totalSancoes}` : '✅ NENHUMA'}
                </h4>
                {sancoesResult.totalSancoes > 0 && (
                  <ul className="text-sm mt-1">
                    {sancoesResult.sancoes.ceis.total > 0 && <li>• CEIS: {sancoesResult.sancoes.ceis.total}</li>}
                    {sancoesResult.sancoes.cnep.total > 0 && <li>• CNEP: {sancoesResult.sancoes.cnep.total}</li>}
                    {sancoesResult.sancoes.ceaf.total > 0 && <li>• CEAF: {sancoesResult.sancoes.ceaf.total}</li>}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          {pepStats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-navy-900 border rounded-xl p-4">
              <p className="text-2xl font-bold">{stat.total}</p>
              <p className="text-sm text-slate-600">PEP - {stat.nivel_federacao}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
```

**Localização**: `investigaree/src/app/dashboard/compliance/page.tsx` (NOVO)

---

### **4. CRIAR NOVA PÁGINA: dashboard/lgpd/page.tsx**

Página para solicitações LGPD:

```typescript
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, FileText, Download, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  criarSolicitacaoLGPD,
  listarMinhasSolicitacoesLGPD,
  exportarMeusDados,
} from "@/lib/api";

export default function LGPDPage() {
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadSolicitacoes();
  }, []);

  const loadSolicitacoes = async () => {
    try {
      const data = await listarMinhasSolicitacoesLGPD();
      setSolicitacoes(data);
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportarDados = async () => {
    try {
      const blob = await exportarMeusDados();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meus-dados-${new Date().toISOString()}.json`;
      a.click();
    } catch (error) {
      console.error("Erro ao exportar:", error);
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Shield className="w-7 h-7 text-blue-400" />
              Meus Dados (LGPD)
            </h1>
            <p className="text-slate-600 dark:text-white/60 mt-1">
              Gerencie seus dados pessoais e solicitações LGPD
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleExportarDados}>
              <Download className="w-4 h-4 mr-2" />
              Exportar Meus Dados
            </Button>
            <Button onClick={() => setShowModal(true)} variant="default">
              <FileText className="w-4 h-4 mr-2" />
              Nova Solicitação
            </Button>
          </div>
        </div>

        {/* Cards de Ações Rápidas */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-navy-900 border rounded-xl p-6">
            <Edit className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="font-semibold mb-2">Retificar Dados</h3>
            <p className="text-sm text-slate-600 dark:text-white/60">
              Solicite correção de dados incorretos
            </p>
          </div>

          <div className="bg-white dark:bg-navy-900 border rounded-xl p-6">
            <Download className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="font-semibold mb-2">Exportar Dados</h3>
            <p className="text-sm text-slate-600 dark:text-white/60">
              Baixe uma cópia de todos os seus dados
            </p>
          </div>

          <div className="bg-white dark:bg-navy-900 border rounded-xl p-6">
            <Trash2 className="w-8 h-8 text-red-400 mb-3" />
            <h3 className="font-semibold mb-2">Excluir Dados</h3>
            <p className="text-sm text-slate-600 dark:text-white/60">
              Solicite a eliminação dos seus dados
            </p>
          </div>
        </div>

        {/* Lista de Solicitações */}
        <div className="bg-white dark:bg-navy-900 border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Minhas Solicitações</h3>

          {solicitacoes.length === 0 ? (
            <p className="text-center text-slate-600 py-8">
              Nenhuma solicitação encontrada
            </p>
          ) : (
            <div className="space-y-3">
              {solicitacoes.map((s) => (
                <div key={s.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{s.tipo_solicitacao}</h4>
                      <p className="text-sm text-slate-600">{s.descricao}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Criada em: {new Date(s.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      s.status === 'concluido'
                        ? 'bg-green-500/20 text-green-400'
                        : s.status === 'em_analise'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
```

**Localização**: `investigaree/src/app/dashboard/lgpd/page.tsx` (NOVO)

---

### **5. ATUALIZAR PÁGINAS EXISTENTES**

#### **5.1. dashboard/ofac/page.tsx**

**Mudança**: Trocar mock data por API real

```typescript
// ANTES (linha 20-28)
import {
  CLIENTE_01_OFAC,
  CLIENTE_01_FUNCIONARIOS,
  // ...
} from "../_data/mock-data";

// DEPOIS
import { verificarOFAC } from "@/lib/api";
import { useDashboardData } from "@/hooks/useDashboardData";

// Dentro do componente:
const { data, loading } = useDashboardData();
const ofacMatches = data?.compliance?.ofacMatches || [];
```

#### **5.2. dashboard/sancionados/page.tsx**

**Mudança**: Trocar mock data por API real

```typescript
// ANTES
import { CLIENTE_01_SANCIONADOS } from "../_data/mock-data";

// DEPOIS
import { verificarSancoesConsolidadas } from "@/lib/api";
import { useDashboardData } from "@/hooks/useDashboardData";

const { data } = useDashboardData();
const sancionados = data?.sancionados || [];
```

#### **5.3. dashboard/consultas/cpf/page.tsx**

**Mudança**: Adicionar verificação de compliance ao consultar CPF

```typescript
// Adicionar após consulta de CPF
const handleConsultar = async (cpf: string) => {
  try {
    // Consultas existentes...
    const cpfData = await consultarCPF(cpf);

    // NOVO: Verificações de compliance
    const [pepResult, sancoesResult] = await Promise.all([
      verificarPEP(cpf),
      verificarSancoesConsolidadas(cpf),
    ]);

    setResults({
      ...cpfData,
      compliance: {
        pep: pepResult,
        sancoes: sancoesResult,
      }
    });
  } catch (error) {
    // ...
  }
};

// No componente de exibição, adicionar:
{results.compliance?.pep.isPEP && (
  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
    <h4 className="font-semibold text-red-400">⚠️ Pessoa Exposta Politicamente (PEP)</h4>
    <p className="text-sm mt-1">
      {results.compliance.pep.pep.cargo} - {results.compliance.pep.pep.orgao}
    </p>
  </div>
)}

{results.compliance?.sancoes.totalSancoes > 0 && (
  <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
    <h4 className="font-semibold text-orange-400">⚠️ Sanções Encontradas</h4>
    <ul className="text-sm mt-1">
      {results.compliance.sancoes.sancoes.ceis.total > 0 && (
        <li>• CEIS: {results.compliance.sancoes.sancoes.ceis.total}</li>
      )}
      {results.compliance.sancoes.sancoes.cnep.total > 0 && (
        <li>• CNEP: {results.compliance.sancoes.sancoes.cnep.total}</li>
      )}
    </ul>
  </div>
)}
```

#### **5.4. dashboard/page.tsx (Dashboard Principal)**

**Mudança**: Adicionar cards de compliance

```typescript
// Adicionar novos stats cards:
<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
  {/* Cards existentes... */}

  {/* NOVO: Card PEP */}
  <div className="bg-white dark:bg-navy-900 border rounded-xl p-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-purple-500/10 rounded-lg">
        <Shield className="w-5 h-5 text-purple-400" />
      </div>
      <div>
        <p className="text-2xl font-bold">{stats?.compliance?.totalPEP || 0}</p>
        <p className="text-xs text-slate-600">PEPs Identificados</p>
      </div>
    </div>
  </div>

  {/* NOVO: Card Sanções */}
  <div className="bg-white dark:bg-navy-900 border rounded-xl p-4">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-red-500/10 rounded-lg">
        <AlertTriangle className="w-5 h-5 text-red-400" />
      </div>
      <div>
        <p className="text-2xl font-bold">{stats?.compliance?.totalSancoesCEIS || 0}</p>
        <p className="text-xs text-slate-600">Sancionados CEIS</p>
      </div>
    </div>
  </div>
</div>
```

---

### **6. CRIAR COMPONENTE: ComplianceBadge.tsx**

Componente reutilizável para exibir status de compliance:

```typescript
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface ComplianceBadgeProps {
  nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico';
  tipo: 'pep' | 'sancoes' | 'ofac';
  showIcon?: boolean;
}

export function ComplianceBadge({ nivelRisco, tipo, showIcon = true }: ComplianceBadgeProps) {
  const configs = {
    baixo: { color: 'green', text: 'Baixo Risco', icon: CheckCircle },
    medio: { color: 'yellow', text: 'Médio Risco', icon: AlertTriangle },
    alto: { color: 'orange', text: 'Alto Risco', icon: AlertTriangle },
    critico: { color: 'red', text: 'Risco Crítico', icon: Shield },
  };

  const config = configs[nivelRisco];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${config.color}-500/20 text-${config.color}-400 border border-${config.color}-500/30`}>
      {showIcon && <Icon className="w-4 h-4" />}
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
}
```

**Localização**: `investigaree/src/components/dashboard/ComplianceBadge.tsx` (NOVO)

---

### **7. ATUALIZAR COMPONENTE: FichaFuncionario.tsx**

Adicionar seção de compliance na ficha do funcionário:

```typescript
// Adicionar props
interface FichaFuncionarioProps {
  // ... props existentes ...
  compliance?: {
    pep?: PEPVerificationResult;
    sancoes?: SancoesConsolidadasResult;
    ofac?: OFACVerificationResult;
  };
}

// Adicionar seção no modal:
{props.compliance && (
  <div className="border-t pt-4">
    <h3 className="font-semibold mb-3">Compliance & Due Diligence</h3>

    <div className="space-y-3">
      {/* PEP */}
      {props.compliance.pep && (
        <div className={`p-3 rounded-lg ${
          props.compliance.pep.isPEP
            ? 'bg-red-500/10 border border-red-500/30'
            : 'bg-green-500/10 border border-green-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">
              PEP (Pessoa Exposta Politicamente)
            </span>
            <ComplianceBadge
              nivelRisco={props.compliance.pep.nivel_risco}
              tipo="pep"
            />
          </div>
          {props.compliance.pep.isPEP && (
            <p className="text-sm mt-2">
              {props.compliance.pep.pep?.cargo} - {props.compliance.pep.pep?.orgao}
            </p>
          )}
        </div>
      )}

      {/* Sanções */}
      {props.compliance.sancoes && (
        <div className={`p-3 rounded-lg ${
          props.compliance.sancoes.totalSancoes > 0
            ? 'bg-orange-500/10 border border-orange-500/30'
            : 'bg-green-500/10 border border-green-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-medium">Sanções (CEIS/CNEP/CEAF)</span>
            <ComplianceBadge
              nivelRisco={props.compliance.sancoes.nivelRisco}
              tipo="sancoes"
            />
          </div>
          {props.compliance.sancoes.totalSancoes > 0 && (
            <div className="text-sm mt-2 space-y-1">
              {props.compliance.sancoes.sancoes.ceis.total > 0 && (
                <p>• CEIS: {props.compliance.sancoes.sancoes.ceis.total}</p>
              )}
              {props.compliance.sancoes.sancoes.cnep.total > 0 && (
                <p>• CNEP: {props.compliance.sancoes.sancoes.cnep.total}</p>
              )}
              {props.compliance.sancoes.sancoes.ceaf.total > 0 && (
                <p>• CEAF: {props.compliance.sancoes.sancoes.ceaf.total}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* OFAC */}
      {props.compliance.ofac && props.compliance.ofac.encontrado && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-center justify-between">
            <span className="font-medium">OFAC SDN List</span>
            <ComplianceBadge
              nivelRisco={props.compliance.ofac.nivel_risco}
              tipo="ofac"
            />
          </div>
          <p className="text-sm mt-2">
            {props.compliance.ofac.matches.length} match(es) encontrado(s)
          </p>
        </div>
      )}
    </div>
  </div>
)}
```

**Localização**: `investigaree/src/components/dashboard/FichaFuncionario.tsx`

---

## 📊 CHECKLIST DE IMPLEMENTAÇÃO

### **Fase 1: API Layer** (2-3 horas)
- [ ] Adicionar funções de compliance em `lib/api.ts`
- [ ] Adicionar funções LGPD em `lib/api.ts`
- [ ] Testar endpoints com console.log

### **Fase 2: Hooks** (1-2 horas)
- [ ] Atualizar `useDashboardData.ts` para incluir compliance
- [ ] Criar `useCompliance.ts` (opcional)
- [ ] Testar hooks com dados mockados

### **Fase 3: Componentes Reutilizáveis** (2-3 horas)
- [ ] Criar `ComplianceBadge.tsx`
- [ ] Criar `ComplianceCard.tsx`
- [ ] Atualizar `FichaFuncionario.tsx`

### **Fase 4: Novas Páginas** (4-6 horas)
- [ ] Criar `dashboard/compliance/page.tsx`
- [ ] Criar `dashboard/lgpd/page.tsx`
- [ ] Testar navegação

### **Fase 5: Atualizar Páginas Existentes** (3-4 horas)
- [ ] Atualizar `dashboard/ofac/page.tsx`
- [ ] Atualizar `dashboard/sancionados/page.tsx`
- [ ] Atualizar `dashboard/consultas/cpf/page.tsx`
- [ ] Atualizar `dashboard/consultas/cnpj/page.tsx`
- [ ] Atualizar `dashboard/page.tsx` (dashboard principal)

### **Fase 6: Testes e Ajustes** (2-3 horas)
- [ ] Testar todos os fluxos
- [ ] Verificar responsividade
- [ ] Ajustar dark mode
- [ ] Testar exportação CSV
- [ ] Verificar loading states

---

## 🔄 PRIORIZAÇÃO

### **ALTA PRIORIDADE** (Fazer primeiro)
1. ✅ Adicionar endpoints de compliance em `lib/api.ts`
2. ✅ Atualizar `dashboard/consultas/cpf/page.tsx` com compliance
3. ✅ Criar `ComplianceBadge.tsx`
4. ✅ Atualizar `dashboard/page.tsx` com cards de compliance

### **MÉDIA PRIORIDADE** (Fazer em seguida)
5. ⏳ Criar `dashboard/compliance/page.tsx`
6. ⏳ Atualizar `dashboard/ofac/page.tsx` com API real
7. ⏳ Atualizar `dashboard/sancionados/page.tsx` com API real
8. ⏳ Atualizar `FichaFuncionario.tsx` com seção compliance

### **BAIXA PRIORIDADE** (Pode ser feito depois)
9. ⏳ Criar `dashboard/lgpd/page.tsx`
10. ⏳ Implementar exportação LGPD
11. ⏳ Adicionar filtros avançados
12. ⏳ Criar relatórios de compliance

---

## 📝 ESTIMATIVAS

| Tarefa | Tempo Estimado | Complexidade |
|--------|---------------|--------------|
| API Layer | 2-3 horas | Baixa |
| Hooks | 1-2 horas | Baixa |
| Componentes | 2-3 horas | Média |
| Novas Páginas | 4-6 horas | Média |
| Atualizar Existentes | 3-4 horas | Média |
| Testes | 2-3 horas | Baixa |
| **TOTAL** | **14-21 horas** | **Média** |

---

## 🎨 DESIGN GUIDELINES

### **Cores de Nível de Risco**
```typescript
const riskColors = {
  baixo: 'green-500',    // ✅ Sem problemas
  medio: 'yellow-500',   // ⚠️ Atenção
  alto: 'orange-500',    // ⚠️ Importante
  critico: 'red-500',    // 🚨 Urgente
};
```

### **Ícones**
- PEP: `<Shield />`
- Sanções: `<AlertTriangle />`
- OFAC: `<Globe />`
- LGPD: `<FileText />`
- Verificado: `<CheckCircle />`

### **Layout**
- Cards de compliance: `bg-{color}-500/10 border border-{color}-500/30`
- Badges: `rounded-full px-3 py-1 text-sm`
- Alertas: Usar componente `Alert` do shadcn/ui

---

## 🚀 PRÓXIMOS PASSOS

1. **Imediato**: Implementar Fase 1 (API Layer)
2. **Esta semana**: Completar Fases 2-3 (Hooks e Componentes)
3. **Próxima semana**: Fases 4-5 (Páginas)
4. **Depois**: Fase 6 (Testes e polimento)

---

## 📌 OBSERVAÇÕES IMPORTANTES

1. **Segurança**: Nunca expor dados de outros clientes (mock data foi desabilitado)
2. **Performance**: Usar cache para evitar consultas repetidas
3. **LGPD**: Todas as consultas devem registrar consentimento
4. **UX**: Mostrar loading states e mensagens de erro claras
5. **Mobile**: Garantir responsividade em todos os componentes

---

**Criado por**: Agent 2 - Backend Engineer
**Data**: 2025-12-08
**Versão**: 1.0
