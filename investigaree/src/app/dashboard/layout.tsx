"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  AlertTriangle,
  Vote,
  Heart,
  Briefcase,
  Shield,
  Download,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Building2,
  HeartPulse,
  Globe,
  DollarSign,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/hooks/useTenant";
import { Button } from "@/components/ui/button";
import NoAccessScreen from "@/components/dashboard/NoAccessScreen";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  color?: string;
}

// Admin emails
const ADMIN_EMAILS = ["contato@investigaree.com.br"];

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/relatorios", icon: LayoutDashboard },
  { label: "Funcionarios", href: "/dashboard/funcionarios", icon: Users },
  { label: "Obitos", href: "/dashboard/obitos", icon: HeartPulse, color: "text-red-400" },
  { label: "Candidatos", href: "/dashboard/candidatos", icon: Vote, color: "text-purple-400" },
  { label: "Doadores", href: "/dashboard/doadores", icon: Heart, color: "text-emerald-400" },
  { label: "Sancionados", href: "/dashboard/sancionados", icon: AlertTriangle, color: "text-red-400" },
  { label: "Vinculos", href: "/dashboard/vinculos", icon: Briefcase, color: "text-amber-400" },
  { label: "Beneficios", href: "/dashboard/beneficios", icon: DollarSign, color: "text-cyan-400" },
  { label: "OFAC/PEP", href: "/dashboard/ofac", icon: Globe, color: "text-orange-400" },
  { label: "Analitico", href: "/dashboard/analitico", icon: BarChart3, color: "text-blue-400" },
  { label: "Exportar", href: "/dashboard/exportar", icon: Download },
];

// Item admin (apenas para admins)
const adminNavItem: NavItem = {
  label: "Admin",
  href: "/dashboard/admin",
  icon: Shield,
  color: "text-gold-400",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading, logout } = useAuth();
  const { tenant, hasAccess, loading: tenantLoading } = useTenant();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirecionar se não autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
    }
  }, [user, authLoading, router]);

  // Loading state
  if (authLoading || tenantLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500" />
      </div>
    );
  }

  // Não autenticado
  if (!user) {
    return null;
  }

  // Autenticado mas sem acesso a tenant
  if (!hasAccess || !tenant) {
    return (
      <NoAccessScreen
        userName={user.displayName || undefined}
        userEmail={user.email || undefined}
      />
    );
  }

  // Criar tenantInfo a partir do tenant da API
  const tenantInfo = tenant ? { code: tenant.code, name: tenant.name } : null;

  const isActiveRoute = (href: string) => {
    if (href === "/dashboard/relatorios") {
      return pathname === "/dashboard/relatorios" || pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-900 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-navy-800 bg-navy-900/50 backdrop-blur-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-navy-800">
          <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">investigaree</h1>
            <p className="text-xs text-white/50">Due Diligence</p>
          </div>
        </div>

        {/* Tenant Info */}
        {tenantInfo && (
          <div className="px-4 py-3 border-b border-navy-800">
            <div className="bg-navy-800/50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium text-white">{tenantInfo.code}</span>
              </div>
              <p className="text-xs text-white/50 mt-1">{tenantInfo.name}</p>
            </div>
          </div>
        )}

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
                    ? "bg-gold-500/10 text-gold-400 border border-gold-500/30"
                    : "text-white/70 hover:bg-navy-800 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-gold-400" : item.color || "text-white/50"}`} />
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-gold-400/50" />}
              </Link>
            );
          })}

          {/* Item Admin (apenas para admins) */}
          {user.email && ADMIN_EMAILS.includes(user.email) && (
            <>
              <div className="my-2 border-t border-navy-700" />
              <Link
                href={adminNavItem.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${
                  isActiveRoute(adminNavItem.href)
                    ? "bg-gold-500/10 text-gold-400 border border-gold-500/30"
                    : "text-white/70 hover:bg-navy-800 hover:text-white"
                }`}
              >
                <adminNavItem.icon className={`w-5 h-5 ${isActiveRoute(adminNavItem.href) ? "text-gold-400" : adminNavItem.color || "text-white/50"}`} />
                <span className="flex-1 text-sm font-medium">{adminNavItem.label}</span>
                {isActiveRoute(adminNavItem.href) && <ChevronRight className="w-4 h-4 text-gold-400/50" />}
              </Link>
            </>
          )}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-navy-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.displayName || user.email}
              </p>
              <p className="text-xs text-white/50 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start text-white/60 hover:text-white hover:bg-navy-800"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy-900/95 backdrop-blur-lg border-b border-navy-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-gold-400" />
            <span className="font-bold text-white">investigaree</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-white"
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
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-navy-900 border-r border-navy-800"
            >
              <div className="flex items-center justify-between px-4 py-4 border-b border-navy-800">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-gold-400" />
                  <span className="font-bold gradient-text">investigaree</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {tenantInfo && (
                <div className="px-4 py-3 border-b border-navy-800">
                  <div className="bg-navy-800/50 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gold-400" />
                      <span className="text-sm font-medium text-white">{tenantInfo.code}</span>
                    </div>
                    <p className="text-xs text-white/50 mt-1">{tenantInfo.name}</p>
                  </div>
                </div>
              )}

              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                          ? "bg-gold-500/10 text-gold-400 border border-gold-500/30"
                          : "text-white/70 hover:bg-navy-800 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? "text-gold-400" : item.color || "text-white/50"}`} />
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t border-navy-800">
                <p className="text-xs text-white/50 mb-2 truncate">{user.email}</p>
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="w-full justify-start text-white/60 hover:text-white hover:bg-navy-800"
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
        <div className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
