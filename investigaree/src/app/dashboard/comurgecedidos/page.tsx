"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useUserAccess } from "@/hooks/useUserData";

export default function ComurgCedidosPage() {
  const { userInfo, loading } = useUserAccess();
  const router = useRouter();

  // Proteção: apenas usuários do tenant COMURG podem acessar
  useEffect(() => {
    if (!loading && userInfo?.tenant?.code !== 'COMURG') {
      console.warn("[ComurgCedidos] Acesso negado - tenant:", userInfo?.tenant?.code);
      router.push('/dashboard');
    }
  }, [userInfo, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Bloquear renderização se não for COMURG
  if (userInfo?.tenant?.code !== 'COMURG') {
    return null;
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
            <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              Gestão de funcionários cedidos da COMURG
            </p>
          </div>
        </div>

        {/* Content Placeholder */}
        <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-12 text-center">
          <Building2 className="w-16 h-16 text-slate-900 dark:text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Página em Desenvolvimento
          </h3>
          <p className="text-slate-900 dark:text-slate-500 dark:text-white/50">
            Esta página está reservada para funcionalidades específicas do tenant COMURG.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
