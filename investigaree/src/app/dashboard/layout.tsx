"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Settings,
  User,
  Bell,
  Key,
  CreditCard,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Lock,
  Building2,
  FileText,
  Skull,
  AlertTriangle,
  Gift,
  Vote,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserAccess } from "@/hooks/useUserData";
import { ComurgDataProvider } from "@/contexts/ComurgDataContext";
import { Button } from "@/components/ui/button";
import { TopNavBar } from "@/components/dashboard/TopNavBar";
import { Toaster } from "sonner";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  color?: string;
}

// Admin emails
const ADMIN_EMAILS = [
  "dkbotdani@gmail.com",
  "ibsenmaciel@gmail.com",
  "contato@investigaree.com.br"
];

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Investigações", href: "/dashboard/investigacoes", icon: Users },
  { label: "Relatórios", href: "/dashboard/analitico", icon: BarChart3, color: "text-blue-400" },
];

// Itens do tenant COMURG
const comurgNavItems: NavItem[] = [
  { label: "Funcionários Cedidos", href: "/dashboard/comurgecedidos", icon: Building2, color: "text-emerald-400" },
  { label: "Achados Críticos", href: "/dashboard/comurgachadoscriticos", icon: AlertTriangle, color: "text-red-400" },
  { label: "Óbitos Confirmados", href: "/dashboard/comurgobitos", icon: Skull, color: "text-red-500" },
  { label: "Vínculos Empresariais", href: "/dashboard/comurgempresas", icon: Building2, color: "text-orange-400" },
  { label: "Benefícios Federais", href: "/dashboard/comurgbeneficios", icon: Gift, color: "text-blue-400" },
  { label: "Atividade Política", href: "/dashboard/comurgatividadepolitica", icon: Vote, color: "text-purple-400" },
  { label: "Análise de Risco", href: "/dashboard/comurganaliserisco", icon: Shield, color: "text-blue-400" },
];

// Item admin (apenas para admins)
const adminNavItem: NavItem = {
  label: "Admin",
  href: "/dashboard/admin",
  icon: Shield,
  color: "text-blue-400",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading, logout } = useAuth();
  const { userInfo, hasAccess, loading: userLoading } = useUserAccess();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [comurgSectionOpen, setComurgSectionOpen] = useState(true);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Loading state
  if (authLoading || userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Não autenticado
  if (!user) {
    return null;
  }

  // Usuario autenticado SEMPRE tem acesso aos seus proprios dados
  // Verificar se é admin
  const isAdmin = user.email && ADMIN_EMAILS.includes(user.email);

  // Info do usuario para exibir
  const userDisplayInfo = userInfo?.settings?.empresa_nome
    ? { name: userInfo.settings.empresa_nome, plano: userInfo.settings.plano }
    : null;

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900 flex">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="dark"
        toastOptions={{
          style: {
            background: '#1a2332',
            border: '1px solid #2d3f54',
            color: '#ffffff',
          },
        }}
      />

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-slate-300 dark:border-navy-800 bg-white dark:bg-navy-900/50 backdrop-blur-lg">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 px-6 py-5 border-b border-slate-300 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800/50 transition-colors">
          <Image
            src="/favicon.svg"
            alt="investigaree logo"
            width={36}
            height={36}
            className="w-9 h-9"
          />
          <span
            className="text-xl font-bold"
            style={{
              background: "linear-gradient(135deg, #FFFFFF 0%, #9FB3C8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            investigaree
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {/* Items regulares */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActive
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                    : "text-slate-700 dark:text-navy-300 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : item.color || "text-slate-500 dark:text-navy-400"}`} />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-blue-400/50" />}
              </Link>
            );
          })}

          {/* Itens COMURG (apenas para tenant COMURG) */}
          {userInfo?.tenant?.code === 'COMURG' && (
            <>
              <div className="my-2 border-t border-slate-300 dark:border-navy-700" />
              <button
                onClick={() => setComurgSectionOpen(!comurgSectionOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-slate-500 dark:text-navy-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
              >
                <p className="text-xs font-semibold uppercase tracking-wider">COMURG</p>
                <ChevronDown className={`w-4 h-4 transition-transform ${comurgSectionOpen ? 'rotate-180' : ''}`} />
              </button>
              {comurgSectionOpen && comurgNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                      isActive
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                        : "text-slate-700 dark:text-navy-300 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : item.color || "text-slate-500 dark:text-navy-400"}`} />
                    <span className="flex-1 text-sm font-medium">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 text-blue-400/50" />}
                  </Link>
                );
              })}
            </>
          )}

          {/* Item Admin (apenas para admins) */}
          {user.email && ADMIN_EMAILS.includes(user.email) && (
            <>
              <div className="my-2 border-t border-slate-300 dark:border-navy-700" />
              <Link
                href={adminNavItem.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActiveRoute(adminNavItem.href)
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                    : "text-slate-700 dark:text-navy-300 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-white"
                }`}
              >
                <adminNavItem.icon className={`w-5 h-5 ${isActiveRoute(adminNavItem.href) ? "text-blue-400" : adminNavItem.color || "text-slate-500 dark:text-navy-400"}`} />
                <span className="flex-1 text-sm font-medium">{adminNavItem.label}</span>
                {isActiveRoute(adminNavItem.href) && <ChevronRight className="w-4 h-4 text-blue-400/50" />}
              </Link>
            </>
          )}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-300 dark:border-navy-800 relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
          >
            <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {user.displayName || user.email?.split('@')[0]}
              </p>
              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-navy-400 truncate">{user.email}</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-navy-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* User Menu Dropdown */}
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-4 right-4 mb-2 bg-slate-100 dark:bg-navy-800 border border-slate-300 dark:border-navy-700 rounded-xl shadow-xl overflow-hidden"
              >
                <div className="p-2 space-y-1">
                  <Link
                    href="/dashboard/configuracoes"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-navy-300 hover:text-white hover:bg-navy-700 transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Meu Perfil</span>
                  </Link>
                  <Link
                    href="/dashboard/configuracoes?tab=notificacoes"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-navy-300 hover:text-white hover:bg-navy-700 transition-colors"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="text-sm">Notificações</span>
                  </Link>
                  <Link
                    href="/dashboard/configuracoes?tab=seguranca"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-navy-300 hover:text-white hover:bg-navy-700 transition-colors"
                  >
                    <Key className="w-4 h-4" />
                    <span className="text-sm">Segurança</span>
                  </Link>
                  <Link
                    href="/dashboard/configuracoes?tab=assinatura"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-navy-300 hover:text-white hover:bg-navy-700 transition-colors"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-sm">Assinatura</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/dashboard/configuracoes/serpro"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Credenciais SERPRO</span>
                    </Link>
                  )}
                  <div className="border-t border-slate-300 dark:border-navy-700 my-1" />
                  <Link
                    href="/ajuda"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-navy-300 hover:text-white hover:bg-navy-700 transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span className="text-sm">Ajuda</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Sair</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-navy-900/95 backdrop-blur-lg border-b border-slate-300 dark:border-navy-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/favicon.svg"
              alt="investigaree logo"
              width={28}
              height={28}
              className="w-7 h-7"
            />
            <span className="font-bold text-slate-900 dark:text-white">investigaree</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-slate-900 dark:text-white"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-navy-900 border-r border-slate-300 dark:border-navy-800"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-slate-300 dark:border-navy-800">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/favicon.svg"
                    alt="investigaree logo"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                  <span className="font-bold gradient-text">investigaree</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="text-slate-600 dark:text-navy-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto border-t border-slate-300 dark:border-navy-800">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActiveRoute(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : "text-slate-700 dark:text-navy-300 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : item.color || "text-slate-500 dark:text-navy-400"}`} />
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                {/* Itens COMURG (apenas para tenant COMURG) */}
                {userInfo?.tenant?.code === 'COMURG' && (
                  <>
                    <div className="my-2 border-t border-slate-300 dark:border-navy-700" />
                    <button
                      onClick={() => setComurgSectionOpen(!comurgSectionOpen)}
                      className="w-full flex items-center justify-between px-3 py-2 text-slate-500 dark:text-navy-500 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg transition-colors"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider">COMURG</p>
                      <ChevronDown className={`w-4 h-4 transition-transform ${comurgSectionOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {comurgSectionOpen && comurgNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isActiveRoute(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                            isActive
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                              : "text-slate-700 dark:text-navy-300 hover:bg-slate-100 dark:hover:bg-navy-800 hover:text-white"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? "text-blue-400" : item.color || "text-slate-500 dark:text-navy-400"}`} />
                          <span className="flex-1 text-sm font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </>
                )}
              </nav>

              <div className="p-4 border-t border-slate-300 dark:border-navy-800">
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-navy-400 mb-2 truncate">{user.email}</p>
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="w-full justify-start text-slate-600 dark:text-navy-400 hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        {/* Top Navigation Bar (sticky no topo - apenas desktop) */}
        <div className="hidden lg:block">
          <TopNavBar />
        </div>

        {/* Page Content - padding top para compensar mobile header */}
        <div className="pt-16 lg:pt-0 min-h-screen">
          {userInfo?.tenant?.code === 'COMURG' ? (
            <ComurgDataProvider>{children}</ComurgDataProvider>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
