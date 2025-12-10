"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Building2, User, TrendingUp, BarChart3, Target } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";
import { useComurgData } from "@/contexts/ComurgDataContext";
import { useAchadosAnalytics } from "@/hooks/useAchadosAnalytics";

// Importar componentes de gráficos
import { TrendLineChart } from "@/components/comurg/charts/TrendLineChart";
import { IrregularityBarChart } from "@/components/comurg/charts/IrregularityBarChart";
import { SeverityDonutChart } from "@/components/comurg/charts/SeverityDonutChart";
import { ImpactStackedBar } from "@/components/comurg/charts/ImpactStackedBar";
import { RiskScatterPlot } from "@/components/comurg/charts/RiskScatterPlot";
import { DepartmentHeatmap } from "@/components/comurg/charts/DepartmentHeatmap";
import { TopCasesRanking } from "@/components/comurg/charts/TopCasesRanking";
import { ActionsBarChart } from "@/components/comurg/charts/ActionsBarChart";
import { CommunicationsPieChart } from "@/components/comurg/charts/CommunicationsPieChart";

export default function ComurgAchadosCriticos() {
  const { userInfo, loading: authLoading } = useUserAccess();
  const { funcionarios, loading: dataLoading, error } = useComurgData();
  const router = useRouter();

  // Proteção: apenas usuários do tenant COMURG podem acessar
  useEffect(() => {
    if (!authLoading && userInfo?.tenant?.code !== 'COMURG') {
      router.push('/dashboard');
    }
  }, [userInfo, authLoading, router]);

  // Filtrar funcionários com achados críticos
  const achados = useMemo(() => {
    return funcionarios.filter((f) => {
      const riscosCriticos = f.classificacao_risco === 'Critico' || f.classificacao_risco === 'Crítico';
      const temEmpresaAtiva = f.empresas_ativas && parseInt(String(f.empresas_ativas)) > 0;
      const estaMorto = f.esta_morto && String(f.esta_morto).toUpperCase().startsWith('SIM');
      return riscosCriticos || temEmpresaAtiva || estaMorto;
    });
  }, [funcionarios]);

  // Processar dados para gráficos
  const analytics = useAchadosAnalytics(achados);

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px] bg-white dark:bg-navy-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-white/60">Carregando dados e processando análises...</p>
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
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-400 text-center">
            Erro ao carregar dados
          </h3>
          <p className="text-red-700 dark:text-red-300 text-center mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const criticos = achados.filter((a) => a.classificacao_risco === "Critico" || a.classificacao_risco === "Crítico");
  const empresasAtivas = achados.filter((a) => a.empresas_ativas && parseInt(String(a.empresas_ativas)) > 0);
  const obitos = achados.filter((a) => a.esta_morto && String(a.esta_morto).toUpperCase().startsWith('SIM'));
  const impactoFinanceiro = achados.reduce((sum, a) => sum + (parseFloat(String(a.salario || 0)) || 0), 0);

  return (
    <div className="p-4 lg:p-8 bg-white dark:bg-navy-950 space-y-8">
      {/* SEÇÃO 1: Header + KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-500" />
              Achados Críticos - Dashboard de Análise
            </h1>
            <p className="text-slate-600 dark:text-white/60 mt-2">
              Visualização inteligente de {achados.length} casos críticos com análise multidimensional
            </p>
          </div>
          <div className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-bold text-lg animate-pulse">
            🚨 URGENTE
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6 hover:border-red-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400 font-medium">CRÍTICOS</p>
                <p className="text-3xl font-bold text-red-500">{criticos.length}</p>
                <p className="text-xs text-slate-400 mt-1">Risco máximo</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6 hover:border-orange-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-400 font-medium">EMPRESAS ATIVAS</p>
                <p className="text-3xl font-bold text-orange-500">{empresasAtivas.length}</p>
                <p className="text-xs text-slate-400 mt-1">Conflito de interesse</p>
              </div>
              <Building2 className="w-12 h-12 text-orange-500" />
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6 hover:border-purple-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-400 font-medium">ÓBITOS/FANTASMAS</p>
                <p className="text-3xl font-bold text-purple-500">{obitos.length}</p>
                <p className="text-xs text-slate-400 mt-1">Pagamentos irregulares</p>
              </div>
              <User className="w-12 h-12 text-purple-500" />
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6 hover:border-yellow-500 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-400 font-medium">IMPACTO MENSAL</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(impactoFinanceiro)}
                </p>
                <p className="text-xs text-slate-400 mt-1">Salários afetados</p>
              </div>
              <TrendingUp className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* SEÇÃO 2: Tendência Temporal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-navy-900 border border-navy-700 rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            Tendência de Achados Críticos (Últimos 12 meses)
          </h2>
        </div>
        <TrendLineChart data={analytics.trendData} />
        <p className="text-sm text-slate-400 mt-2 italic">
          💡 Análise temporal permite identificar padrões sazonais e tendências de crescimento
        </p>
      </motion.div>

      {/* SEÇÃO 3: Distribuição por Tipo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-navy-900 border border-navy-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-orange-400" />
            Tipos de Irregularidade
          </h2>
          <IrregularityBarChart data={analytics.distributionData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-navy-900 border border-navy-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-red-400" />
            Severidade dos Achados
          </h2>
          <SeverityDonutChart data={analytics.severityData} />
        </motion.div>
      </div>

      {/* SEÇÃO 4: Impacto Financeiro */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-navy-900 border border-navy-700 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">
          💰 Impacto Financeiro por Diretoria (Top 10)
        </h2>
        <ImpactStackedBar data={analytics.impactData} />
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-sm text-yellow-400">
            💡 <strong>Insight:</strong> Diretorias com maior impacto exigem atenção prioritária para ações corretivas
          </p>
        </div>
      </motion.div>

      {/* SEÇÃO 5: Scatter Plot */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-navy-900 border border-navy-700 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">
          🎯 Matriz de Risco: Salário vs Severidade
        </h2>
        <RiskScatterPlot data={analytics.correlationData} />
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-400">
            💡 <strong>Insight:</strong> {analytics.correlationInsight}
          </p>
        </div>
      </motion.div>

      {/* SEÇÃO 6: Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-navy-900 border border-navy-700 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">
          🔥 Mapa de Calor: Concentração por Diretoria/Cargo
        </h2>
        <DepartmentHeatmap {...analytics.heatmapData} />
        <p className="text-sm text-slate-400 mt-4 italic">
          💡 Células vermelhas indicam concentração alta de achados - áreas críticas para investigação
        </p>
      </motion.div>

      {/* SEÇÃO 7: Top 10 Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-navy-900 border border-navy-700 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">
          🏆 Top 10 Casos Mais Críticos (Score Composto)
        </h2>
        <TopCasesRanking data={analytics.rankingData} />
        <div className="mt-4 flex gap-2">
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Ver Lista Completa
          </button>
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Exportar Relatório PDF
          </button>
        </div>
      </motion.div>

      {/* SEÇÃO 8: Ações Requeridas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-navy-900 border border-navy-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">
            ⚡ Ações Corretivas por Prioridade
          </h2>
          <ActionsBarChart data={analytics.actionsData} />
          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Gerar Plano de Ação Automatizado
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-navy-900 border border-navy-700 rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">
            📧 Comunicações Necessárias
          </h2>
          <CommunicationsPieChart data={analytics.communicationsData} />
          <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Enviar Notificações CI/TCM
          </button>
        </motion.div>
      </div>

      {/* Footer com informações adicionais */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-800/50 border border-slate-700 rounded-xl p-4"
      >
        <div className="flex items-center justify-between text-sm text-slate-400">
          <div>
            <p>
              📊 Dashboard baseado em <strong className="text-white">{achados.length} casos críticos</strong> identificados
            </p>
            <p className="text-xs mt-1">
              Última atualização: {new Date().toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs">Powered by Recharts</p>
            <p className="text-xs">Visualizações conformes com padrões de compliance 2025</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
