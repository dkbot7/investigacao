"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  Search,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  User,
  Building2,
  Phone,
  Mail,
  MessageSquare,
  Send,
  Loader2,
  RefreshCw,
  Expand,
  X,
  ExternalLink,
  FolderOpen,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useInvestigations, type Investigacao, type InvestigacaoStatus, type Categoria } from "@/hooks/useInvestigations";
import { getAdminInvestigacoes, getAdminInvestigacoesStats, getAdminDashboard } from "@/lib/admin-api";

// Admin emails
const ADMIN_EMAILS = [
  "dkbotdani@gmail.com",
  "ibsenmaciel@gmail.com",
  "contato@investigaree.com.br"
];

// Status config
const statusConfig: Record<InvestigacaoStatus, { label: string; color: string; icon: React.ElementType; description: string }> = {
  investigar: { label: "Aguardando", color: "amber", icon: Clock, description: "Na fila para análise" },
  investigando: { label: "Em Análise", color: "blue", icon: Search, description: "Sendo processada" },
  relatorio: { label: "Relatório", color: "purple", icon: FileText, description: "Relatório disponível" },
  monitoramento: { label: "Monitorando", color: "cyan", icon: RefreshCw, description: "Em monitoramento contínuo" },
  aprovado: { label: "Concluído", color: "emerald", icon: CheckCircle, description: "Análise finalizada" },
  bloqueado: { label: "Bloqueado", color: "red", icon: AlertCircle, description: "Requer atenção" },
};

const categoriaConfig: Record<Categoria, { label: string; color: string }> = {
  familia: { label: "Família", color: "pink" },
  clientes: { label: "Clientes", color: "blue" },
  funcionarios: { label: "Colaboradores", color: "emerald" },
  relacionamentos: { label: "Relacionamentos", color: "purple" },
  empresas: { label: "Empresas", color: "amber" },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { investigacoes: userInvestigacoes, stats: userStats, loading: userLoading, error: userError, sendMessage, refetch: userRefetch } = useInvestigations();
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({ assunto: "", mensagem: "" });
  const [sendingMessage, setSendingMessage] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  // Admin state
  const [adminInvestigacoes, setAdminInvestigacoes] = useState<Investigacao[]>([]);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Detectar se é admin
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  // Buscar dados admin
  useEffect(() => {
    if (!isAdmin) return;

    const fetchAdminData = async () => {
      setAdminLoading(true);
      setAdminError(null);
      try {
        const [investigacoesRes, statsRes] = await Promise.all([
          getAdminInvestigacoes({ limit: 10 }),
          getAdminInvestigacoesStats()
        ]);
        setAdminInvestigacoes(investigacoesRes.investigacoes || []);
        setAdminStats(statsRes.stats || null);
      } catch (err: any) {
        console.error('[Admin Dashboard] Error:', err);
        setAdminError(err.message || 'Erro ao carregar dados admin');
      } finally {
        setAdminLoading(false);
      }
    };

    fetchAdminData();
  }, [isAdmin, user]);

  // Selecionar dados baseado se é admin ou não
  const investigacoes = isAdmin ? adminInvestigacoes : userInvestigacoes;
  const stats = isAdmin ? adminStats : userStats;
  const loading = isAdmin ? adminLoading : userLoading;
  const error = isAdmin ? adminError : userError;
  const refetch = isAdmin ? () => window.location.reload() : userRefetch;

  // Primeiro nome do usuário
  const primeiroNome = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Usuário";

  // Stats calculadas (usa dados reais ou valores zerados)
  const displayStats = {
    total: stats?.total || 0,
    emAndamento: stats?.em_andamento || 0,
    comRelatorio: stats?.com_relatorio || 0,
    concluidas: stats?.concluidas || 0,
  };

  const handleSendMessage = async () => {
    setSendingMessage(true);
    try {
      const tipoMap: Record<string, string> = {
        duvida: "duvida",
        ampliar: "ampliar",
        reabrir: "reabrir",
        urgente: "urgente",
        financeiro: "financeiro",
        outro: "outro",
      };

      await sendMessage({
        assunto: contactForm.assunto,
        mensagem: contactForm.mensagem,
        tipo: tipoMap[contactForm.assunto] || "geral",
      });

      setMessageSent(true);
      setTimeout(() => {
        setShowContactForm(false);
        setMessageSent(false);
        setContactForm({ assunto: "", mensagem: "" });
      }, 2000);
    } catch (err: any) {
      console.error("Error sending message:", err);
      // Show success anyway - redirect to WhatsApp as fallback
      const assuntoText = contactForm.assunto === "ampliar" ? "Ampliar escopo" :
                         contactForm.assunto === "reabrir" ? "Reabrir investigação" :
                         contactForm.assunto === "duvida" ? "Dúvida" :
                         contactForm.assunto === "urgente" ? "Urgente" :
                         contactForm.assunto === "financeiro" ? "Financeiro" : "Contato";
      const whatsappMsg = encodeURIComponent(`${assuntoText}: ${contactForm.mensagem}`);
      window.open(`https://wa.me/5547992602673?text=${whatsappMsg}`, "_blank");
      setShowContactForm(false);
      setContactForm({ assunto: "", mensagem: "" });
    } finally {
      setSendingMessage(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 lg:p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Erro ao carregar dados</h2>
          <p className="text-slate-600 dark:text-navy-400 mb-4">{error}</p>
          <Button onClick={refetch} className="bg-blue-500 hover:bg-blue-600 text-navy-950">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        {/* Header com Boas-vindas */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white">
                Olá, {primeiroNome}!
              </h1>
              {isAdmin && (
                <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Visão Global (Admin)
                </span>
              )}
            </div>
            <p className="text-slate-600 dark:text-navy-400 mt-1">
              {isAdmin
                ? "Painel administrativo - visualizando todas as investigações do sistema"
                : "Bem-vindo ao seu painel de investigações"
              }
            </p>
          </div>
          <Link href="/dashboard/investigacoes?novo=true">
            <Button className="bg-blue-500 hover:bg-blue-600 text-navy-950 font-semibold">
              <Plus className="w-5 h-5 mr-2" />
              Nova Investigação
            </Button>
          </Link>
        </div>

        {/* Cards de Status */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total"
            value={displayStats.total}
            icon={FolderOpen}
            color="gold"
            href="/dashboard/investigacoes"
          />
          <StatCard
            title="Em Andamento"
            value={displayStats.emAndamento}
            icon={Clock}
            color="blue"
            href="/dashboard/investigacoes?status=investigando"
            pulse={displayStats.emAndamento > 0}
          />
          <StatCard
            title="Relatórios"
            value={displayStats.comRelatorio}
            icon={FileText}
            color="purple"
            href="/dashboard/analitico"
            badge={displayStats.comRelatorio > 0 ? "Novo" : undefined}
          />
          <StatCard
            title="Concluídas"
            value={displayStats.concluidas}
            icon={CheckCircle}
            color="emerald"
            href="/dashboard/investigacoes?status=aprovado"
          />
        </div>

        {/* Grid Principal */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Investigações Recentes - Ocupa 2 colunas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 rounded-xl"
          >
            <div className="p-4 border-b border-slate-300 dark:border-navy-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-400" />
                Investigações Recentes
              </h2>
              <Link
                href="/dashboard/investigacoes"
                className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                Ver todas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {investigacoes.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-navy-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400 dark:text-navy-600" />
                </div>
                <h3 className="text-slate-900 dark:text-white font-medium mb-2">Nenhuma investigação ainda</h3>
                <p className="text-slate-600 dark:text-navy-400 text-sm mb-4">
                  Comece solicitando sua primeira investigação
                </p>
                <Link href="/dashboard/investigacoes?novo=true">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-navy-950">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Investigação
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-navy-800">
                {investigacoes.slice(0, 5).map((inv, index) => (
                  <InvestigacaoItem key={inv.id} inv={inv} index={index} />
                ))}
              </div>
            )}
          </motion.div>

          {/* Ações Rápidas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Ações */}
            <div className="bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-blue-400" />
                Ações Rápidas
              </h2>

              <div className="space-y-3">
                <Link href="/dashboard/investigacoes?novo=true" className="block">
                  <ActionButton
                    icon={Plus}
                    label="Nova Investigação"
                    description="Solicitar análise de pessoa ou empresa"
                    color="gold"
                  />
                </Link>

                <ActionButton
                  icon={Expand}
                  label="Ampliar Escopo"
                  description="Solicitar mais informações"
                  color="blue"
                  onClick={() => {
                    setContactForm({ assunto: "ampliar", mensagem: "" });
                    setShowContactForm(true);
                  }}
                />

                <ActionButton
                  icon={RefreshCw}
                  label="Reabrir Investigação"
                  description="Retomar análise concluída"
                  color="purple"
                  onClick={() => {
                    setContactForm({ assunto: "reabrir", mensagem: "" });
                    setShowContactForm(true);
                  }}
                />

                <Link href="/dashboard/configuracoes" className="block">
                  <ActionButton
                    icon={User}
                    label="Meu Perfil"
                    description="Configurações da conta"
                    color="emerald"
                  />
                </Link>
              </div>
            </div>

            {/* Contato */}
            <div className="bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                Fale Conosco
              </h2>

              <div className="space-y-3">
                {/* Formulário */}
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg hover:bg-purple-500/20 transition-colors group"
                >
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-slate-900 dark:text-white font-medium group-hover:text-purple-400 transition-colors">Formulário</p>
                    <p className="text-xs text-slate-500 dark:text-navy-400">Enviar mensagem</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-navy-600 group-hover:text-purple-400" />
                </button>

                {/* Email */}
                <a
                  href="mailto:contato@investigaree.com.br"
                  className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors group"
                >
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white font-medium group-hover:text-blue-400 transition-colors">Email</p>
                    <p className="text-xs text-slate-500 dark:text-navy-400">contato@investigaree.com.br</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 dark:text-navy-600 group-hover:text-blue-400" />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/5547992602673?text=Olá! Preciso de ajuda com minhas investigações."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors group"
                >
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-white font-medium group-hover:text-emerald-400 transition-colors">WhatsApp</p>
                    <p className="text-xs text-slate-500 dark:text-navy-400">Resposta rápida</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 dark:text-navy-600 group-hover:text-emerald-400" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Workflow das Investigações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 rounded-xl p-6"
        >
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Como funciona o processo
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(statusConfig).map(([key, config], index) => {
              const Icon = config.icon;
              return (
                <div key={key} className="relative">
                  <div className={`p-4 rounded-xl bg-${config.color}-500/10 border border-${config.color}-500/20 text-center`}>
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-full bg-${config.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${config.color}-400`} />
                    </div>
                    <p className={`text-sm font-medium text-${config.color}-400`}>{config.label}</p>
                    <p className="text-xs text-slate-500 dark:text-navy-400 mt-1">{config.description}</p>
                  </div>
                  {index < 5 && (
                    <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-slate-400 dark:text-navy-700">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* Modal de Formulário de Contato */}
      <AnimatePresence>
        {showContactForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowContactForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 rounded-2xl p-6 z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enviar Mensagem</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="p-2 text-slate-600 dark:text-navy-400 hover:text-white hover:bg-slate-100 dark:bg-navy-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {messageSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Mensagem Enviada!</h4>
                  <p className="text-slate-600 dark:text-navy-400">Responderemos em breve.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-800 dark:text-navy-200 mb-2">Assunto</label>
                    <select
                      value={contactForm.assunto}
                      onChange={(e) => setContactForm({ ...contactForm, assunto: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="duvida">Dúvida sobre investigação</option>
                      <option value="ampliar">Ampliar escopo de análise</option>
                      <option value="reabrir">Reabrir investigação</option>
                      <option value="urgente">Solicitação urgente</option>
                      <option value="financeiro">Assunto financeiro</option>
                      <option value="outro">Outro assunto</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-800 dark:text-navy-200 mb-2">Mensagem</label>
                    <textarea
                      value={contactForm.mensagem}
                      onChange={(e) => setContactForm({ ...contactForm, mensagem: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[120px] resize-none"
                      placeholder="Descreva sua solicitação..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sendingMessage || !contactForm.assunto || !contactForm.mensagem}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-navy-950 font-semibold"
                  >
                    {sendingMessage ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Componente de item de investigação
function InvestigacaoItem({ inv, index }: { inv: Investigacao; index: number }) {
  const statusInfo = statusConfig[inv.status];
  const StatusIcon = statusInfo.icon;
  const catInfo = categoriaConfig[inv.categoria];

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="p-4 hover:bg-slate-100 dark:hover:bg-navy-800/50 transition-colors group cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Ícone do tipo */}
          <div className={`p-2.5 rounded-lg ${
            inv.is_grupo
              ? "bg-blue-500/20"
              : inv.tipo_pessoa === "juridica"
              ? "bg-purple-500/20"
              : "bg-blue-500/20"
          }`}>
            {inv.is_grupo ? (
              <FolderOpen className="w-5 h-5 text-blue-400" />
            ) : inv.tipo_pessoa === "juridica" ? (
              <Building2 className="w-5 h-5 text-purple-400" />
            ) : (
              <User className="w-5 h-5 text-blue-400" />
            )}
          </div>

          <div>
            <h4 className="text-slate-900 dark:text-white font-medium group-hover:text-blue-400 transition-colors">
              {inv.nome}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-slate-500 dark:text-navy-400">{inv.documento}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full bg-${catInfo.color}-500/20 text-${catInfo.color}-400`}>
                {catInfo.label}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-${statusInfo.color}-500/10 border border-${statusInfo.color}-500/30`}>
            <StatusIcon className={`w-4 h-4 text-${statusInfo.color}-400`} />
            <span className={`text-sm font-medium text-${statusInfo.color}-400`}>
              {statusInfo.label}
            </span>
          </div>

          <ChevronRight className="w-5 h-5 text-slate-400 dark:text-navy-600 group-hover:text-blue-400 transition-colors" />
        </div>
      </div>

      {/* Barra de progresso visual */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-navy-800 rounded-full overflow-hidden flex">
          {Object.keys(statusConfig).slice(0, Object.keys(statusConfig).indexOf(inv.status) + 1).map((s) => (
            <div
              key={s}
              className={`h-full ${
                s === inv.status
                  ? `bg-${statusConfig[s as InvestigacaoStatus].color}-400`
                  : `bg-${statusConfig[s as InvestigacaoStatus].color}-400/30`
              }`}
              style={{ width: `${100 / 6}%` }}
            />
          ))}
        </div>
        <span className="text-xs text-slate-500 dark:text-navy-500">{formatDate(inv.updated_at)}</span>
      </div>
    </motion.div>
  );
}

// Componente StatCard
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  href,
  pulse = false,
  badge,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: "gold" | "blue" | "purple" | "emerald";
  href: string;
  pulse?: boolean;
  badge?: string;
}) {
  const colorClasses = {
    gold: "bg-blue-500/10 border-blue-500/30 hover:border-blue-500/60",
    blue: "bg-blue-500/10 border-blue-500/30 hover:border-blue-500/60",
    purple: "bg-purple-500/10 border-purple-500/30 hover:border-purple-500/60",
    emerald: "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60",
  };

  const iconColors = {
    gold: "text-blue-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
    emerald: "text-emerald-400",
  };

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        className={`${colorClasses[color]} border rounded-xl p-4 transition-all cursor-pointer relative overflow-hidden group`}
      >
        {pulse && (
          <div className="absolute top-3 right-3">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </div>
        )}
        {badge && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 bg-purple-500 text-slate-900 dark:text-white text-xs font-bold rounded-full">
              {badge}
            </span>
          </div>
        )}
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${iconColors[color]}`} />
          <div>
            <p className={`text-2xl font-bold ${iconColors[color]}`}>{value}</p>
            <p className="text-sm text-slate-600 dark:text-navy-400">{title}</p>
          </div>
        </div>
        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-navy-700 group-hover:text-slate-500 dark:text-navy-400 transition-colors" />
      </motion.div>
    </Link>
  );
}

// Componente ActionButton
function ActionButton({
  icon: Icon,
  label,
  description,
  color,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  color: "gold" | "blue" | "purple" | "emerald";
  onClick?: () => void;
}) {
  const colorClasses = {
    gold: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/20",
    blue: "bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/20",
    purple: "bg-purple-500/10 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/20",
    emerald: "bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/20",
  };

  const iconColors = {
    gold: "text-blue-400 bg-blue-500/20",
    blue: "text-blue-400 bg-blue-500/20",
    purple: "text-purple-400 bg-purple-500/20",
    emerald: "text-emerald-400 bg-emerald-500/20",
  };

  const Component = onClick ? "button" : "div";

  return (
    <Component
      onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 ${colorClasses[color]} border rounded-lg transition-all group`}
    >
      <div className={`p-2 rounded-lg ${iconColors[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 text-left">
        <p className="text-slate-900 dark:text-white font-medium group-hover:text-blue-400 transition-colors">{label}</p>
        <p className="text-xs text-slate-500 dark:text-navy-400">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 dark:text-navy-600 group-hover:text-blue-400 transition-colors" />
    </Component>
  );
}
