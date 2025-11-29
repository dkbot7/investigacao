"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Building2,
  UserPlus,
  Shield,
  Clock,
  Check,
  X,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAdminUsers,
  getAdminTenants,
  getPendingUsers,
  grantAccess,
  revokeAccess,
  AdminUser,
  AdminTenant,
  PendingUser,
} from "@/lib/admin-api";

// Admin emails permitidos
const ADMIN_EMAILS = ["contato@investigaree.com.br"];

export default function AdminPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tenants, setTenants] = useState<AdminTenant[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);

  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [grantForm, setGrantForm] = useState({
    tenant_code: "CLIENTE_01",
    role: "viewer" as "admin" | "editor" | "viewer",
  });
  const [granting, setGranting] = useState(false);

  // Verificar se e admin
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  async function loadData() {
    setLoading(true);
    setError(null);

    try {
      const [usersRes, tenantsRes, pendingRes] = await Promise.all([
        getAdminUsers(),
        getAdminTenants(),
        getPendingUsers(),
      ]);

      setUsers(usersRes.users || []);
      setTenants(tenantsRes.tenants || []);
      setPendingUsers(pendingRes.pending_users || []);
    } catch (err: any) {
      console.error("Erro ao carregar dados admin:", err);
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function handleGrantAccess() {
    if (!selectedUser) return;

    setGranting(true);
    try {
      await grantAccess({
        user_email: selectedUser.email,
        tenant_code: grantForm.tenant_code,
        role: grantForm.role,
      });

      // Recarregar dados
      await loadData();
      setShowGrantModal(false);
      setSelectedUser(null);
    } catch (err: any) {
      alert(err.message || "Erro ao conceder acesso");
    } finally {
      setGranting(false);
    }
  }

  async function handleRevokeAccess(userEmail: string, tenantCode: string) {
    if (!confirm(`Revogar acesso de ${userEmail} ao ${tenantCode}?`)) return;

    try {
      await revokeAccess({ user_email: userEmail, tenant_code: tenantCode });
      await loadData();
    } catch (err: any) {
      alert(err.message || "Erro ao revogar acesso");
    }
  }

  // Nao e admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Acesso Restrito</h2>
          <p className="text-white/60">
            Esta pagina e exclusiva para administradores.
          </p>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-950 to-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500" />
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="w-7 h-7 text-gold-400" />
              Administracao
            </h1>
            <p className="text-white/60 mt-1">
              Gerenciar usuarios e acessos
            </p>
          </div>
          <Button
            onClick={loadData}
            variant="outline"
            className="border-navy-600 text-white/70 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{users.length}</p>
                <p className="text-sm text-white/60">Usuarios Totais</p>
              </div>
            </div>
          </div>
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white">{tenants.length}</p>
                <p className="text-sm text-white/60">Tenants Ativos</p>
              </div>
            </div>
          </div>
          <div className="bg-navy-900 border border-navy-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-white">{pendingUsers.length}</p>
                <p className="text-sm text-white/60">Aguardando Liberacao</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usuarios Pendentes */}
        {pendingUsers.length > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Usuarios Aguardando Liberacao ({pendingUsers.length})
            </h3>
            <div className="space-y-3">
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="bg-navy-900/50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-medium">{u.name || u.email}</p>
                    <p className="text-sm text-white/50">{u.email}</p>
                    {u.phone && (
                      <p className="text-xs text-white/40">{u.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">
                      {new Date(u.created_at).toLocaleDateString("pt-BR")}
                    </span>
                    <Button
                      size="sm"
                      className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                      onClick={() => {
                        setSelectedUser(u);
                        setShowGrantModal(true);
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Liberar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Usuarios */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Usuarios com Acesso ({users.filter(u => u.tenants.length > 0).length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-navy-700">
                  <th className="text-left py-2 px-3 text-sm font-medium text-white/60">Email</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-white/60">Nome</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-white/60">Tenants</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-white/60">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.tenants.length > 0).map((u) => (
                  <tr key={u.id} className="border-b border-navy-800">
                    <td className="py-3 px-3 text-white text-sm">{u.email}</td>
                    <td className="py-3 px-3 text-white/70 text-sm">{u.name || "-"}</td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {u.tenants.map((t) => (
                          <span
                            key={t.code}
                            className={`px-2 py-0.5 rounded text-xs font-medium ${
                              t.role === "admin"
                                ? "bg-red-500/20 text-red-400"
                                : t.role === "editor"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {t.code} ({t.role})
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {u.tenants.map((t) => (
                        <Button
                          key={t.code}
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleRevokeAccess(u.email, t.code)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lista de Tenants */}
        <div className="bg-navy-900 border border-navy-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            Tenants ({tenants.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((t) => (
              <div
                key={t.id}
                className="bg-navy-800/50 rounded-lg p-4 border border-navy-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gold-400">{t.code}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    t.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-white text-sm mb-2">{t.name}</p>
                <p className="text-xs text-white/50">
                  {t.user_count} usuario(s)
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modal Conceder Acesso */}
      {showGrantModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-navy-900 rounded-xl border border-navy-700 p-6 max-w-md w-full"
          >
            <h3 className="text-lg font-bold text-white mb-4">
              Conceder Acesso
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-white/70">Usuario</Label>
                <p className="text-white font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <Label htmlFor="tenant" className="text-white/70">Tenant</Label>
                <select
                  id="tenant"
                  value={grantForm.tenant_code}
                  onChange={(e) => setGrantForm({ ...grantForm, tenant_code: e.target.value })}
                  className="w-full mt-1 bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-white"
                >
                  {tenants.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.code} - {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="role" className="text-white/70">Permissao</Label>
                <select
                  id="role"
                  value={grantForm.role}
                  onChange={(e) => setGrantForm({ ...grantForm, role: e.target.value as any })}
                  className="w-full mt-1 bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="viewer">Viewer (apenas visualizar)</option>
                  <option value="editor">Editor (visualizar e editar)</option>
                  <option value="admin">Admin (acesso total)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 border-navy-600"
                onClick={() => {
                  setShowGrantModal(false);
                  setSelectedUser(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={handleGrantAccess}
                disabled={granting}
              >
                {granting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Conceder
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
