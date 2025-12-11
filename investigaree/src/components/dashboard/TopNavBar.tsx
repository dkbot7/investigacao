"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  BarChart3,
  Bell,
  User,
  LogOut,
  Settings,
  ChevronDown,
  FileText,
  Download,
  Shield,
  CreditCard,
  HelpCircle,
  Key,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "@/components/mode-toggle";

interface TopNavLink {
  label: string;
  href: string;
  icon: React.ElementType;
}

// Admin emails
const ADMIN_EMAILS = ['dkbotdani@gmail.com'];

const topNavLinks: TopNavLink[] = [
  { label: "Investigações", href: "/dashboard/investigacoes", icon: Users },
  { label: "Analítico", href: "/dashboard/analitico", icon: BarChart3 },
  { label: "Relatórios", href: "/dashboard/relatorios", icon: FileText },
  { label: "Exportar", href: "/dashboard/exportar", icon: Download },
];

export function TopNavBar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  const isActiveRoute = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Mock notifications (substituir por dados reais depois)
  const notifications = [
    { id: 1, message: "Nova investigação adicionada", time: "5 min atrás", unread: true },
    { id: 2, message: "Relatório concluído", time: "1 hora atrás", unread: true },
    { id: 3, message: "Análise de CPF finalizada", time: "2 horas atrás", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="sticky top-0 z-40 bg-white dark:bg-navy-900/95 backdrop-blur-lg border-b border-slate-300 dark:border-navy-800">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        {/* Left: Empty space (navigation links removed) */}
        <div className="hidden md:flex items-center gap-1">
          {/* Navigation links removed - usando apenas menu lateral */}
        </div>

        {/* Mobile: Page Title */}
        <div className="md:hidden text-slate-900 dark:text-white font-semibold">
          {topNavLinks.find(link => isActiveRoute(link.href))?.label || "Dashboard"}
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserMenuOpen(false);
              }}
              className="relative p-2 rounded-lg text-slate-900 dark:text-navy-300 hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-slate-100 dark:bg-navy-800 border border-slate-300 dark:border-navy-700 rounded-xl shadow-xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4 border-b border-slate-300 dark:border-navy-700">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Notificações</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-slate-500 dark:text-navy-400 mt-0.5">
                        {unreadCount} {unreadCount === 1 ? "nova" : "novas"}
                      </p>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        className={`w-full p-4 text-left border-b border-slate-300 dark:border-navy-700 last:border-0 transition-colors ${
                          notification.unread
                            ? "bg-blue-500/5 hover:bg-blue-500/10"
                            : "hover:bg-navy-700"
                        }`}
                      >
                        <p className={`text-sm ${notification.unread ? "text-white font-medium" : "text-slate-700 dark:text-navy-300"}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-navy-400 mt-1">{notification.time}</p>
                      </button>
                    ))}
                  </div>
                  <div className="p-3 border-t border-slate-300 dark:border-navy-700">
                    <button className="w-full text-xs text-center text-blue-400 hover:text-blue-300 font-medium">
                      Ver todas
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
            >
              <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-slate-900 dark:text-white">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden lg:block text-left min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate max-w-32">
                  {user?.displayName || user?.email?.split('@')[0]}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-500 dark:text-navy-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Menu Dropdown */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-slate-100 dark:bg-navy-800 border border-slate-300 dark:border-navy-700 rounded-xl shadow-xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-slate-300 dark:border-navy-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {user?.displayName || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-navy-400 truncate">{user?.email}</p>
                  </div>

                  {/* Menu Items */}
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
                    <Link
                      href="/dashboard/configuracoes"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-900 dark:text-navy-300 hover:text-white hover:bg-navy-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Configurações</span>
                    </Link>

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
        </div>
      </div>

      {/* Click outside to close menus */}
      {(userMenuOpen || notificationsOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setUserMenuOpen(false);
            setNotificationsOpen(false);
          }}
        />
      )}
    </div>
  );
}
