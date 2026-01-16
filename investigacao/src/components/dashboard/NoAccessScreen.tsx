"use client";

import { motion } from "framer-motion";
import { Clock, Shield, Mail, Phone, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface NoAccessScreenProps {
  userName?: string;
  userEmail?: string;
}

export default function NoAccessScreen({ userName, userEmail }: NoAccessScreenProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        {/* Card Principal */}
        <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-2xl p-8 text-center">
          {/* Icone */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center"
          >
            <Clock className="w-10 h-10 text-blue-400" />
          </motion.div>

          {/* Titulo */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Aguardando Liberacao
          </h1>

          {/* Saudacao */}
          {userName && (
            <p className="text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">
              Ola, <span className="text-blue-400 font-medium">{userName}</span>!
            </p>
          )}

          {/* Mensagem */}
          <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mb-6">
            Sua conta foi criada com sucesso, mas ainda nao foi vinculada a nenhum cliente.
            Nossa equipe ira analisar sua solicitacao e liberar o acesso em breve.
          </p>

          {/* Status */}
          <div className="bg-slate-100 dark:bg-navy-800/50 border border-slate-400 dark:border-navy-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">Conta Verificada</span>
            </div>
            <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">
              {userEmail}
            </p>
          </div>

          {/* O que acontece agora */}
          <div className="text-left mb-6">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Proximos passos:</h3>
            <ul className="space-y-2 text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">1.</span>
                Nossa equipe recebera uma notificacao da sua solicitacao
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">2.</span>
                Entraremos em contato para entender suas necessidades
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">3.</span>
                Apos a validacao, seu acesso sera liberado automaticamente
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div className="border-t border-slate-400 dark:border-navy-700 pt-6 mb-6">
            <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mb-3">
              Precisa de ajuda ou quer agilizar?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/5547992602673"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </a>
              <a
                href="mailto:contato@investigaree.com.br"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/20 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
            </div>
          </div>

          {/* Botao Sair */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-navy-600 text-slate-900 dark:text-slate-700 dark:text-white/70 hover:text-white hover:bg-slate-100 dark:bg-navy-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da conta
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-900 dark:text-white/40 mt-4">
          investigaree - Due Diligence Digital
        </p>
      </motion.div>
    </div>
  );
}
