"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2, AlertCircle } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";
import { useComurgData } from "@/contexts/ComurgDataContext";

export default function ComurgEmpresas() {
  const { userInfo, loading: authLoading } = useUserAccess();
  const { funcionarios, loading: dataLoading, error } = useComurgData();
  const router = useRouter();

  // Proteção: apenas usuários do tenant COMURG podem acessar
  useEffect(() => {
    if (!authLoading && userInfo?.tenant?.code !== 'COMURG') {
      router.push('/dashboard');
    }
  }, [userInfo, authLoading, router]);

  // Filtrar funcionários com empresas ativas
  const empresas = useMemo(() => {
    return funcionarios.filter((f) =>
      f.empresas_ativas && parseInt(String(f.empresas_ativas)) > 0
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
            <Building2 className="w-8 h-8 text-blue-400" />
            Vínculos Empresariais
          </h1>
          <p className="text-slate-600 dark:text-white/60 mt-2">
            Funcionários com empresas ativas - Potencial conflito de interesses
          </p>
        </div>

        <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
          <p className="text-lg text-white">
            <span className="font-bold text-orange-400 text-2xl">{empresas.length}</span> funcionários com empresas ativas identificados
          </p>
          <p className="text-sm text-orange-400 mt-2">
            Potencial conflito com dedicação exclusiva ao serviço público
          </p>
        </div>

        <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Lista Completa de Vínculos Empresariais</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-800 border-b border-navy-700">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold text-white/70">Nome</th>
                  <th className="text-left p-3 text-sm font-semibold text-white/70">CPF</th>
                  <th className="text-left p-3 text-sm font-semibold text-white/70">Cargo</th>
                  <th className="text-center p-3 text-sm font-semibold text-white/70">Total Empresas</th>
                  <th className="text-center p-3 text-sm font-semibold text-white/70">Ativas</th>
                  <th className="text-left p-3 text-sm font-semibold text-white/70">CNPJs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {empresas.map((emp, i) => (
                  <tr key={i} className="hover:bg-navy-800/50">
                    <td className="p-3 text-white font-medium">{emp.nome}</td>
                    <td className="p-3 text-sm text-slate-400 font-mono">{emp.cpf}</td>
                    <td className="p-3 text-sm text-slate-300">{emp.cargo}</td>
                    <td className="p-3 text-center text-slate-300">{emp.qtd_empresas || 0}</td>
                    <td className="p-3 text-center">
                      <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded font-bold">
                        {emp.empresas_ativas || 0}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-400 max-w-md truncate">{emp.vinculos_empresariais || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {empresas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">Nenhum vínculo empresarial encontrado</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
