"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Shield, MessageCircle, Send, Loader2, FileText, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useWhatsApp } from "@/components/WhatsAppLeadModal";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { openWhatsAppModal } = useWhatsApp();

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch("https://api.investigaree.com.br/api/investigation/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.email,
          subject: formData.subject,
          description: formData.description,
        }),
      });

      if (response.ok) {
        setSent(true);
        setFormData({ subject: "", description: "" });
      } else {
        setError("Erro ao enviar. Tente novamente ou use o WhatsApp.");
      }
    } catch {
      setError("Erro ao enviar. Tente novamente ou use o WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  const handleWhatsAppClick = () => {
    openWhatsAppModal(
      `Olá! Sou ${user?.email} e gostaria de solicitar uma investigação.`,
      "dashboard"
    );
  };

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
            variant="ghost"
            className="border border-navy-700 text-white hover:bg-navy-800 hover:text-white"
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

            {/* WhatsApp Button */}
            <button
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-emerald-500/20"
            >
              <MessageCircle className="w-6 h-6" />
              Falar agora pelo WhatsApp
            </button>

            {/* Reports Access Card */}
            <Link href="/dashboard/relatorios" className="block mt-8">
              <div className="bg-gradient-to-r from-gold-500/20 to-gold-600/10 border border-gold-500/30 rounded-xl p-6 hover:border-gold-500/50 transition-all group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold-500/20 rounded-lg flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                      <BarChart3 className="w-6 h-6 text-gold-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Acessar Relatorios</h3>
                      <p className="text-sm text-white/60">
                        Veja o dashboard e baixe seus relatorios
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gold-400">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm font-medium">1 relatorio disponivel</span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
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

          {/* Investigation Request Form */}
          <div className="mt-8 bg-navy-900 border border-navy-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-2">
              📝 Descreva sua investigação
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Preencha o formulário abaixo e nossa equipe analisará seu caso com total sigilo.
            </p>

            {sent ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Solicitação enviada!</h4>
                <p className="text-white/70 text-sm">
                  Recebemos sua solicitação e entraremos em contato em breve.
                </p>
                <Button
                  onClick={() => setSent(false)}
                  variant="ghost"
                  className="mt-4 text-emerald-400 hover:text-emerald-300"
                >
                  Enviar outra solicitação
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
                    Assunto da investigação
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Ex: Verificação de antecedentes, Due Diligence empresarial..."
                    className="w-full px-4 py-3 bg-navy-800 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">
                    Descreva o que deseja investigar
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva com detalhes o que você precisa investigar. Quanto mais informações, melhor poderemos ajudá-lo..."
                    rows={5}
                    className="w-full px-4 py-3 bg-navy-800 border border-navy-600 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold py-3 rounded-lg transition-all"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar solicitação
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Next Steps */}
          <div className="mt-8 bg-gold-500/10 border border-gold-500/30 rounded-xl p-6">
            <h3 className="font-semibold text-gold-400 mb-3">📋 Próximos passos</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-gold-400 mt-1">1.</span>
                <span>Preencha o formulário acima ou fale conosco pelo WhatsApp</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold-400 mt-1">2.</span>
                <span>Aguarde o contato do investigador para entender seu caso</span>
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
