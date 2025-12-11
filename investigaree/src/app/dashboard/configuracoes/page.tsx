"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Key,
  CreditCard,
  Save,
  Loader2,
  Check,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

type TabType = "perfil" | "notificacoes" | "seguranca" | "assinatura";

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ElementType;
}

const tabs: TabConfig[] = [
  { id: "perfil", label: "Meu Perfil", icon: User },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "seguranca", label: "Segurança", icon: Key },
  { id: "assinatura", label: "Assinatura", icon: CreditCard },
];

export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("perfil");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    nome: "",
    email: "",
    telefone: "",
    empresa: "",
    cargo: "",
    endereco: "",
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    email_novos_relatorios: true,
    email_atualizacoes: true,
    email_marketing: false,
    push_investigacoes: true,
    push_relatorios: true,
  });

  // Security form state
  const [security, setSecurity] = useState({
    senha_atual: "",
    nova_senha: "",
    confirmar_senha: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    atual: false,
    nova: false,
    confirmar: false,
  });

  // Check URL param for initial tab
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["perfil", "notificacoes", "seguranca", "assinatura"].includes(tab)) {
      setActiveTab(tab as TabType);
    }
  }, [searchParams]);

  // Load user data
  useEffect(() => {
    if (user) {
      setProfile({
        nome: user.displayName || "",
        email: user.email || "",
        telefone: "",
        empresa: "",
        cargo: "",
        endereco: "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <Settings className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
            Configurações
          </h1>
          <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
            Gerencie sua conta e preferências
          </p>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-row gap-4 sm:gap-6">
          {/* Sidebar Tabs */}
          <div className="sm:w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-2 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-slate-700 dark:text-navy-300 hover:text-white hover:bg-slate-100 dark:bg-navy-800"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 sm:p-6">
              {/* Perfil Tab */}
              {activeTab === "perfil" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-400 dark:border-navy-700 pb-4">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Informações Pessoais</h2>
                      <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Atualize suas informações de perfil</p>
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 bg-navy-700 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">
                          {profile.nome?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <button className="absolute bottom-0 right-0 p-1.5 bg-blue-500 rounded-full text-navy-950 hover:bg-blue-600 transition-colors">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Foto de perfil</p>
                      <p className="text-xs text-slate-900 dark:text-white/40">JPG, PNG ou GIF. Máx 2MB.</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-slate-800 dark:text-white/80">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-white/40" />
                        <input
                          type="text"
                          value={profile.nome}
                          onChange={(e) => setProfile({ ...profile, nome: e.target.value })}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Seu nome"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-slate-800 dark:text-white/80">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-white/40" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="seu@email.com"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-slate-900 dark:text-white/40">O email não pode ser alterado</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-slate-800 dark:text-white/80">Telefone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-white/40" />
                        <input
                          type="tel"
                          value={profile.telefone}
                          onChange={(e) => setProfile({ ...profile, telefone: e.target.value })}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-slate-800 dark:text-white/80">Empresa</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-white/40" />
                        <input
                          type="text"
                          value={profile.empresa}
                          onChange={(e) => setProfile({ ...profile, empresa: e.target.value })}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Nome da empresa"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-slate-800 dark:text-white/80">Endereço</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-white/40" />
                        <input
                          type="text"
                          value={profile.endereco}
                          onChange={(e) => setProfile({ ...profile, endereco: e.target.value })}
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="Rua, número, cidade - UF"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-400 dark:border-navy-700">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-500 hover:bg-blue-600 text-navy-950 font-semibold"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : saved ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Salvo!
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Notificações Tab */}
              {activeTab === "notificacoes" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="border-b border-slate-400 dark:border-navy-700 pb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Preferências de Notificação</h2>
                    <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Escolha como deseja receber atualizações</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-navy-300 uppercase tracking-wide">Por Email</h3>

                    <label className="flex items-center justify-between p-4 bg-slate-100 dark:bg-navy-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:bg-navy-800 transition-colors">
                      <div>
                        <p className="text-slate-900 dark:text-white font-medium">Novos Relatórios</p>
                        <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Receba um email quando um relatório for concluído</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.email_novos_relatorios}
                        onChange={(e) => setNotifications({ ...notifications, email_novos_relatorios: e.target.checked })}
                        className="w-5 h-5 rounded bg-navy-700 border-navy-600 text-blue-500 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-100 dark:bg-navy-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:bg-navy-800 transition-colors">
                      <div>
                        <p className="text-slate-900 dark:text-white font-medium">Atualizações do Sistema</p>
                        <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Novidades e melhorias da plataforma</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.email_atualizacoes}
                        onChange={(e) => setNotifications({ ...notifications, email_atualizacoes: e.target.checked })}
                        className="w-5 h-5 rounded bg-navy-700 border-navy-600 text-blue-500 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-100 dark:bg-navy-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:bg-navy-800 transition-colors">
                      <div>
                        <p className="text-slate-900 dark:text-white font-medium">Marketing</p>
                        <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Promoções e ofertas especiais</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.email_marketing}
                        onChange={(e) => setNotifications({ ...notifications, email_marketing: e.target.checked })}
                        className="w-5 h-5 rounded bg-navy-700 border-navy-600 text-blue-500 focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-navy-300 uppercase tracking-wide">Notificações Push</h3>

                    <label className="flex items-center justify-between p-4 bg-slate-100 dark:bg-navy-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:bg-navy-800 transition-colors">
                      <div>
                        <p className="text-slate-900 dark:text-white font-medium">Status de Investigações</p>
                        <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Mudanças de status nas suas investigações</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.push_investigacoes}
                        onChange={(e) => setNotifications({ ...notifications, push_investigacoes: e.target.checked })}
                        className="w-5 h-5 rounded bg-navy-700 border-navy-600 text-blue-500 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 bg-slate-100 dark:bg-navy-800/50 rounded-lg cursor-pointer hover:bg-slate-100 dark:bg-navy-800 transition-colors">
                      <div>
                        <p className="text-slate-900 dark:text-white font-medium">Relatórios Prontos</p>
                        <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Quando um relatório estiver disponível</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.push_relatorios}
                        onChange={(e) => setNotifications({ ...notifications, push_relatorios: e.target.checked })}
                        className="w-5 h-5 rounded bg-navy-700 border-navy-600 text-blue-500 focus:ring-blue-500"
                      />
                    </label>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-400 dark:border-navy-700">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-blue-500 hover:bg-blue-600 text-navy-950 font-semibold"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Salvando...
                        </>
                      ) : saved ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Salvo!
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Salvar Preferências
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Segurança Tab */}
              {activeTab === "seguranca" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="border-b border-slate-400 dark:border-navy-700 pb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Segurança da Conta</h2>
                    <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Altere sua senha e configure a segurança</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-navy-300 uppercase tracking-wide">Alterar Senha</h3>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-slate-800 dark:text-white/80">Senha Atual</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-white/40" />
                        <input
                          type={showPasswords.atual ? "text" : "password"}
                          value={security.senha_atual}
                          onChange={(e) => setSecurity({ ...security, senha_atual: e.target.value })}
                          className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, atual: !showPasswords.atual })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white/40 hover:text-white"
                        >
                          {showPasswords.atual ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-slate-800 dark:text-white/80">Nova Senha</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-white/40" />
                        <input
                          type={showPasswords.nova ? "text" : "password"}
                          value={security.nova_senha}
                          onChange={(e) => setSecurity({ ...security, nova_senha: e.target.value })}
                          className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, nova: !showPasswords.nova })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white/40 hover:text-white"
                        >
                          {showPasswords.nova ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-slate-900 dark:text-white/40">Mínimo de 8 caracteres</p>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-900 dark:text-slate-800 dark:text-white/80">Confirmar Nova Senha</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-900 dark:text-white/40" />
                        <input
                          type={showPasswords.confirmar ? "text" : "password"}
                          value={security.confirmar_senha}
                          onChange={(e) => setSecurity({ ...security, confirmar_senha: e.target.value })}
                          className="w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-2.5 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirmar: !showPasswords.confirmar })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white/40 hover:text-white"
                        >
                          {showPasswords.confirmar ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-400 dark:border-navy-700">
                    <Button
                      onClick={handleSave}
                      disabled={saving || !security.senha_atual || !security.nova_senha || security.nova_senha !== security.confirmar_senha}
                      className="bg-blue-500 hover:bg-blue-600 text-navy-950 font-semibold disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Alterando...
                        </>
                      ) : (
                        <>
                          <Key className="w-4 h-4 mr-2" />
                          Alterar Senha
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Assinatura Tab */}
              {activeTab === "assinatura" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="border-b border-slate-400 dark:border-navy-700 pb-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">Assinatura</h2>
                    <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Visualize o status da sua assinatura</p>
                  </div>

                  {/* Current Plan */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Plano Atual</p>
                        <h3 className="text-2xl font-bold text-blue-400">Profissional</h3>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium">
                          Ativo
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Plan Features */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-slate-700 dark:text-navy-300">Recursos incluídos:</h4>
                    <ul className="space-y-2">
                      {[
                        "Investigações ilimitadas",
                        "Relatórios detalhados em PDF",
                        "Suporte prioritário via WhatsApp",
                        "Análise em lote",
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-900 dark:text-slate-800 dark:text-white/80">
                          <Check className="w-4 h-4 text-emerald-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contact for Payment */}
                  <div className="bg-slate-100 dark:bg-navy-800/50 border border-slate-400 dark:border-navy-700 rounded-xl p-6">
                    <p className="text-slate-900 dark:text-slate-700 dark:text-navy-300 text-sm mb-4">
                      Para renovar sua assinatura ou alterar seu plano, entre em contato conosco pelo WhatsApp.
                    </p>
                    <a
                      href="https://wa.me/5547992602673"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Falar no WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
