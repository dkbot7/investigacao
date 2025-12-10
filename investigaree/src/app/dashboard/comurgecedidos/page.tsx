"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, Search, AlertCircle, Users, TrendingUp, FileText, Download } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";
import { useComurgData } from "@/contexts/ComurgDataContext";

export default function ComurgCedidosPage() {
  const { userInfo, loading: authLoading } = useUserAccess();
  const { funcionarios, loading: dataLoading, error } = useComurgData();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroRisco, setFiltroRisco] = useState<string>("todos");
  const [filtroSituacao, setFiltroSituacao] = useState<string>("todos");

  // Proteção: apenas usuários do tenant COMURG podem acessar
  useEffect(() => {
    if (!authLoading && userInfo?.tenant?.code !== 'COMURG') {
      console.warn("[ComurgCedidos] Acesso negado - tenant:", userInfo?.tenant?.code);
      router.push('/dashboard');
    }
  }, [userInfo, authLoading, router]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    if (!funcionarios.length) return null;

    const totalFuncionarios = funcionarios.length;
    const comRisco = funcionarios.filter(f =>
      f.classificacao_risco && f.classificacao_risco.toLowerCase() !== 'regular'
    ).length;
    const cedidos = funcionarios.filter(f =>
      f.vinculo && f.vinculo.toLowerCase().includes('cedido')
    ).length;
    const comAlerta = funcionarios.filter(f =>
      f.necessita_acao_corretiva === 'SIM' ||
      f.necessita_comunicacao_ci === 'SIM' ||
      f.necessita_comunicacao_tcm === 'SIM'
    ).length;

    return {
      total: totalFuncionarios,
      comRisco,
      cedidos,
      comAlerta,
    };
  }, [funcionarios]);

  // Filtrar funcionários
  const funcionariosFiltrados = useMemo(() => {
    return funcionarios.filter(f => {
      // Filtro de busca
      const matchSearch = !searchTerm ||
        f.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.cpf?.includes(searchTerm) ||
        f.cadastro?.includes(searchTerm);

      // Filtro de risco
      const matchRisco = filtroRisco === "todos" ||
        (filtroRisco === "alto" && f.classificacao_risco?.toLowerCase() !== 'regular') ||
        (filtroRisco === "regular" && f.classificacao_risco?.toLowerCase() === 'regular');

      // Filtro de situação
      const matchSituacao = filtroSituacao === "todos" ||
        (filtroSituacao === "cedido" && f.vinculo?.toLowerCase().includes('cedido')) ||
        (filtroSituacao === "ativo" && f.situacao?.toLowerCase() === 'ativo');

      return matchSearch && matchRisco && matchSituacao;
    });
  }, [funcionarios, searchTerm, filtroRisco, filtroSituacao]);

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px]">
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
      <div className="p-4 lg:p-8">
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
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Building2 className="w-7 h-7 text-blue-400" />
              COMURG Cedidos
            </h1>
            <p className="text-slate-600 dark:text-white/60 mt-1">
              Gestão de funcionários cedidos da COMURG
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Exportar Dados
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={Users}
              label="Total de Funcionários"
              value={stats.total.toLocaleString('pt-BR')}
              color="blue"
            />
            <StatsCard
              icon={Building2}
              label="Cedidos"
              value={stats.cedidos.toLocaleString('pt-BR')}
              color="green"
            />
            <StatsCard
              icon={AlertCircle}
              label="Com Risco"
              value={stats.comRisco.toLocaleString('pt-BR')}
              color="orange"
            />
            <StatsCard
              icon={TrendingUp}
              label="Requerem Atenção"
              value={stats.comAlerta.toLocaleString('pt-BR')}
              color="red"
            />
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, CPF ou cadastro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Filtro de Risco */}
            <select
              value={filtroRisco}
              onChange={(e) => setFiltroRisco(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="todos">Todos os riscos</option>
              <option value="alto">Risco Alto</option>
              <option value="regular">Regular</option>
            </select>

            {/* Filtro de Situação */}
            <select
              value={filtroSituacao}
              onChange={(e) => setFiltroSituacao(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-navy-600 rounded-lg bg-white dark:bg-navy-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="todos">Todas situações</option>
              <option value="cedido">Cedidos</option>
              <option value="ativo">Ativos</option>
            </select>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-navy-800 border-b border-slate-200 dark:border-navy-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-white/70 uppercase tracking-wider">
                    Cadastro
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-white/70 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-white/70 uppercase tracking-wider">
                    CPF
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-white/70 uppercase tracking-wider">
                    Cargo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-white/70 uppercase tracking-wider">
                    Local
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-white/70 uppercase tracking-wider">
                    Risco
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-white/70 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-navy-700">
                {funcionariosFiltrados.slice(0, 50).map((func, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-navy-800/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {func.cadastro}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 dark:text-white">
                      {func.nome}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-white/60 font-mono">
                      {func.cpf}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-white/60">
                      {func.cargo}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-white/60">
                      {func.posto || func.local}
                    </td>
                    <td className="px-4 py-3">
                      <RiscoBadge risco={func.classificacao_risco} />
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
                        Ver detalhes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {funcionariosFiltrados.length > 50 && (
            <div className="px-4 py-3 bg-slate-50 dark:bg-navy-800 border-t border-slate-200 dark:border-navy-700 text-center text-sm text-slate-600 dark:text-white/60">
              Mostrando 50 de {funcionariosFiltrados.length.toLocaleString('pt-BR')} resultados
            </div>
          )}

          {funcionariosFiltrados.length === 0 && (
            <div className="px-4 py-12 text-center">
              <FileText className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-white/60">Nenhum funcionário encontrado</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// Componente StatsCard
interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'orange' | 'red';
}

function StatsCard({ icon: Icon, label, value, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    orange: 'bg-orange-500/10 text-orange-500',
    red: 'bg-red-500/10 text-red-500',
  };

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-4">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-sm text-slate-600 dark:text-white/60 mt-1">{label}</p>
    </div>
  );
}

// Componente RiscoBadge
function RiscoBadge({ risco }: { risco?: string }) {
  if (!risco || risco.toLowerCase() === 'regular') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
        Regular
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400">
      {risco}
    </span>
  );
}
