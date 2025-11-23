"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-900">
      {/* Header */}
      <header className="border-b border-navy-800 bg-navy-900/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">investigaree</h1>
          <Button
            onClick={logout}
            variant="outline"
            className="border-navy-700 text-white hover:bg-navy-800"
          >
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Success Card */}
          <div className="bg-navy-900 border border-navy-700 rounded-2xl p-8 sm:p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-full mb-6"
            >
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Excelente!
            </h2>

            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Você vai receber o contato de um <span className="text-gold-400 font-semibold">investigador particular</span> em até{" "}
              <span className="text-gold-400 font-semibold">24 horas</span>.
            </p>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              <div className="bg-navy-800/50 border border-navy-700 rounded-xl p-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Prazo de resposta</h3>
                    <p className="text-sm text-white/60">
                      Nossa equipe entrará em contato em até 24 horas para entender seu caso.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-navy-800/50 border border-navy-700 rounded-xl p-6 text-left">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gold-500/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">Área privada segura</h3>
                    <p className="text-sm text-white/60">
                      Seus dados estão protegidos. Somente você tem acesso a esta área.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-8 pt-8 border-t border-navy-700">
              <p className="text-sm text-white/60">
                Conta criada para:{" "}
                <span className="text-white font-medium">{user.email}</span>
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-gold-500/10 border border-gold-500/30 rounded-xl p-6">
            <h3 className="font-semibold text-gold-400 mb-3">📋 Próximos passos</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-gold-400 mt-1">1.</span>
                <span>Aguarde o contato do investigador particular por WhatsApp ou email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-400 mt-1">2.</span>
                <span>Relate todos os detalhes do seu caso</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-400 mt-1">3.</span>
                <span>Receba seu relatório forense em 48h-7 dias</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
