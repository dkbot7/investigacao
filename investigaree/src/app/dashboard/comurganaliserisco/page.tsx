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

        {/* Abas de Grupo */}
        <GroupTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={tabCounts}
        />

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
      </motion.div>
    </div>
  );
}
