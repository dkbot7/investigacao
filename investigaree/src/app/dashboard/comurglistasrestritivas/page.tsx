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
            <Shield className="w-8 h-8 text-purple-500" />
            Listas Restritivas
          </h1>
          <p className="text-slate-600 dark:text-white/60 mt-2">
            Verificação de funcionários em listas de sanções nacionais (CGU/CEIS/CNEP) e internacionais (OFAC).
          </p>
        </div>

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
      </motion.div>
    </div>
  );
}
