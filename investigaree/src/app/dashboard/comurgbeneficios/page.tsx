"use client";

import { useMemo, useEffect } from "react";
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
    const cedidos = beneficiarios.filter(b =>
      b.grupo?.toLowerCase() === "cedido"
    ).length;

    return {
      total,
      indevidos,
      salarioMedio,
      comurg,
      cedidos
    };
  }, [beneficiarios]);

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
            <Gift className="w-8 h-8 text-blue-400" />
            Benefícios Federais
          </h1>
          <p className="text-slate-600 dark:text-white/60 mt-2">
            {stats.total} benefícios identificados - Verificação de elegibilidade
          </p>
        </div>

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

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Beneficiários */}
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-400 font-medium">TOTAL BENEFICIÁRIOS</p>
                <p className="text-4xl font-bold text-blue-500">{stats.total}</p>
                <p className="text-sm text-blue-400 mt-2">
                  COMURG: {stats.comurg} | Cedidos: {stats.cedidos}
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
      </motion.div>
    </div>
  );
}
