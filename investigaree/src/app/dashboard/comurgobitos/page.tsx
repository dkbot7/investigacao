"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Skull, AlertTriangle, User, AlertCircle } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";
import { useComurgData } from "@/contexts/ComurgDataContext";

export default function ComurgObitos() {
  const { userInfo, loading: authLoading } = useUserAccess();
  const { funcionarios, loading: dataLoading, error } = useComurgData();
  const router = useRouter();

  // Proteção: apenas usuários do tenant COMURG podem acessar
  useEffect(() => {
    if (!authLoading && userInfo?.tenant?.code !== 'COMURG') {
      router.push('/dashboard');
    }
  }, [userInfo, authLoading, router]);

  // Filtrar funcionários falecidos
  const obitos = useMemo(() => {
    return funcionarios.filter((f) =>
      f.esta_morto && String(f.esta_morto).toUpperCase().startsWith('SIM')
    );
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

  const totalSalarios = obitos.reduce((sum, o) => sum + (parseFloat(String(o.salario || 0)) || 0), 0);
  const comurg = obitos.filter((o) => o.grupo?.toLowerCase() === "comurg").length;
  const disposicao = obitos.filter((o) => o.grupo?.toLowerCase() !== "comurg").length;

  return (
    <div className="p-4 lg:p-8 bg-white dark:bg-navy-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Skull className="w-8 h-8 text-red-500" />
            Óbitos Confirmados
          </h1>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-red-800 dark:text-red-400">SITUAÇÃO CRÍTICA</p>
              <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                Funcionários falecidos que ainda constam na folha de pagamento. Requer ação imediata para suspensão de pagamentos e regularização cadastral.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400 font-medium">TOTAL ÓBITOS</p>
                <p className="text-4xl font-bold text-red-500">{obitos.length}</p>
                <p className="text-sm text-red-400 mt-2">Confirmados via Receita Federal</p>
              </div>
              <Skull className="w-16 h-16 text-red-500" />
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-400 font-medium">SALÁRIOS MENSAIS</p>
                <p className="text-2xl font-bold text-orange-500">
                  R$ {totalSalarios.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-sm text-orange-400 mt-2">Valor mensal em risco</p>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-400 font-medium">DISTRIBUIÇÃO</p>
                <p className="text-lg font-bold text-purple-500">
                  Comurg: {comurg} | Cedido: {disposicao}
                </p>
                <p className="text-sm text-purple-400 mt-2">Por grupo funcional</p>
              </div>
              <User className="w-16 h-16 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Lista Completa de Óbitos Confirmados</h2>
          <p className="text-slate-400 mb-6">
            Todos os casos abaixo foram confirmados por consulta à Receita Federal e requerem suspensão imediata de pagamentos.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-800 border-b border-navy-700">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold text-white/70">Nome</th>
                  <th className="text-left p-3 text-sm font-semibold text-white/70">CPF</th>
                  <th className="text-left p-3 text-sm font-semibold text-white/70">Grupo</th>
                  <th className="text-left p-3 text-sm font-semibold text-white/70">Cargo</th>
                  <th className="text-right p-3 text-sm font-semibold text-white/70">Salário</th>
                  <th className="text-left p-3 text-sm font-semibold text-white/70">Data Óbito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {obitos.map((obito, index) => (
                  <tr key={index} className="hover:bg-navy-800/50">
                    <td className="p-3 text-white font-medium">{obito.nome}</td>
                    <td className="p-3 text-sm text-slate-400 font-mono">{obito.cpf}</td>
                    <td className="p-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        obito.grupo?.toLowerCase() === 'comurg'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {obito.grupo?.toLowerCase() === 'comurg' ? 'COMURG' : 'CEDIDO'}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-slate-300">{obito.cargo}</td>
                    <td className="p-3 text-right text-sm text-slate-300 font-medium">
                      R$ {(parseFloat(String(obito.salario || 0)) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-sm text-red-400 font-medium">{obito.esta_morto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {obitos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">Nenhum óbito confirmado encontrado</p>
            </div>
          )}
        </div>

        <div className="bg-yellow-900/20 border border-yellow-700 rounded-xl p-6">
          <h3 className="font-bold text-yellow-400 mb-2">⚠️ Recomendações</h3>
          <ul className="space-y-2 text-sm text-yellow-200">
            <li>• <strong>Suspender imediatamente</strong> todos os pagamentos relacionados aos CPFs listados</li>
            <li>• <strong>Regularizar cadastros</strong> junto ao departamento pessoal</li>
            <li>• <strong>Apurar valores pagos indevidamente</strong> desde a data do óbito</li>
            <li>• <strong>Comunicar ao TCM/MP</strong> conforme legislação vigente</li>
            <li>• <strong>Identificar responsáveis</strong> pela manutenção indevida dos cadastros</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
