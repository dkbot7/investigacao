"use client";

import { useState, useEffect, useMemo } from "react";
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
  Bell,
  BellRing,
  CheckCheck,
  User,
  MessageSquare,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit,
  Save,
  Power,
  Database,
  Download,
  FileText,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { useAuth } from "@/contexts/MockAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getAdminUsers,
  getAdminTenants,
  getPendingUsers,
  grantAccess,
  revokeAccess,
  getAdminAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
  getAdminStats,
  AdminUser,
  AdminTenant,
  PendingUser,
  AdminAlert,
  AdminStats,
} from "@/lib/admin-api";
import { toast } from "sonner";

// Admin emails permitidos
const ADMIN_EMAILS = ['dkbotdani@gmail.com'];

export default function AdminPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tenants, setTenants] = useState<AdminTenant[]>([]);
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [grantForm, setGrantForm] = useState({
    tenant_code: "CLIENTE_01",
    role: "viewer" as "admin" | "editor" | "viewer",
  });
  const [granting, setGranting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'users'>('overview');

  // Estados para criar tenant
  const [showCreateTenantModal, setShowCreateTenantModal] = useState(false);
  const [createTenantForm, setCreateTenantForm] = useState({
    code: "",
    name: "",
  });
  const [creatingTenant, setCreatingTenant] = useState(false);
  const [tenantFormErrors, setTenantFormErrors] = useState<{ code?: string; name?: string }>({});

  // Estados para busca/filtro
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Estados para paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Estados para modal de confirmação de revogação
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeData, setRevokeData] = useState<{ userEmail: string; tenantCode: string } | null>(null);
  const [revoking, setRevoking] = useState(false);

  // Estados para modal de detalhes do tenant
  const [showTenantDetailsModal, setShowTenantDetailsModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<AdminTenant | null>(null);

  // Estados para edição de tenant
  const [isEditingTenant, setIsEditingTenant] = useState(false);

  // Usuários com acesso (todos os users)
  const usersWithAccess = users;
  const [editTenantForm, setEditTenantForm] = useState({ name: "", status: "" });
  const [updatingTenant, setUpdatingTenant] = useState(false);

  // Estado para banner de modo mock
  const [showDevBanner, setShowDevBanner] = useState(true);

  // Logs de auditoria (mock data)
  const auditLogs = useMemo(() => {
    const currentUserEmail = user?.email || 'admin@investigaree.com';
    return [
      {
        id: '1',
        action: 'grant_access',
        description: 'Acesso concedido ao tenant CLIENTE_01',
        user_email: currentUserEmail,
        target_email: 'teste@example.com',
        tenant_code: 'CLIENTE_01',
        role: 'viewer',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10min atrás
        metadata: { ip: '192.168.1.100' }
      },
      {
        id: '2',
        action: 'revoke_access',
        description: 'Acesso revogado do tenant CLIENTE_01',
        user_email: currentUserEmail,
        target_email: 'usuario.removido@example.com',
        tenant_code: 'CLIENTE_01',
        role: null,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h atrás
        metadata: { ip: '192.168.1.100' }
      },
      {
        id: '3',
        action: 'create_tenant',
        description: 'Novo tenant criado',
        user_email: currentUserEmail,
        target_email: null,
        tenant_code: 'CLIENTE_02',
        role: null,
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5h atrás
        metadata: { tenant_name: 'Cliente Secundário' }
      },
      {
        id: '4',
        action: 'update_tenant',
        description: 'Tenant atualizado',
        user_email: currentUserEmail,
        target_email: null,
        tenant_code: 'CLIENTE_01',
        role: null,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
        metadata: { old_name: 'Cliente Principal', new_name: 'Cliente Principal Atualizado' }
      },
      {
        id: '5',
        action: 'grant_access',
        description: 'Acesso concedido ao tenant CLIENTE_01',
        user_email: 'ibsenmaciel@gmail.com',
        target_email: 'maria.santos@example.com',
        tenant_code: 'CLIENTE_01',
        role: 'admin',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias atrás
        metadata: { ip: '192.168.1.105' }
      },
      {
        id: '6',
        action: 'deactivate_tenant',
        description: 'Tenant desativado',
        user_email: currentUserEmail,
        target_email: null,
        tenant_code: 'CLIENTE_OLD',
        role: null,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias atrás
        metadata: { reason: 'Contrato expirado' }
      },
    ];
  }, [user]);

  // Métricas de uso (mock data calculado)
  const usageMetrics = useMemo(() => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Usuários ativos por período
    const activeLastHour = usersWithAccess.filter(u =>
      u.last_access && new Date(u.last_access) > oneHourAgo
    ).length;

    const activeLastDay = usersWithAccess.filter(u =>
      u.last_access && new Date(u.last_access) > oneDayAgo
    ).length;

    const activeLastWeek = usersWithAccess.filter(u =>
      u.last_access && new Date(u.last_access) > oneWeekAgo
    ).length;

    // Crescimento (simulado)
    const previousTotal = Math.max(1, usersWithAccess.length - 2);
    const growthRate = ((usersWithAccess.length - previousTotal) / previousTotal * 100).toFixed(1);

    // Taxa de ativação
    const activationRate = ((usersWithAccess.length / Math.max(1, users.length)) * 100).toFixed(1);

    // Distribuição por role
    const roleDistribution = {
      admin: usersWithAccess.filter(u => u.tenants.some(t => t.role === 'admin')).length,
      editor: usersWithAccess.filter(u => u.tenants.some(t => t.role === 'editor')).length,
      viewer: usersWithAccess.filter(u => u.tenants.some(t => t.role === 'viewer')).length,
    };

    return {
      activeLastHour,
      activeLastDay,
      activeLastWeek,
      growthRate: parseFloat(growthRate),
      activationRate: parseFloat(activationRate),
      roleDistribution,
      totalActions: auditLogs.length,
      actionsLastDay: auditLogs.filter(log =>
        new Date(log.timestamp) > oneDayAgo
      ).length,
    };
  }, [usersWithAccess, users, auditLogs]);

  // Debounce effect - atualiza a busca após 300ms de inatividade
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms conforme best practice

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset para página 1 quando busca mudar
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery]);

  // Filtrar usuários baseado na busca debounced (memoizado para performance)
  const filteredUsers = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return users;

    const query = debouncedSearchQuery.toLowerCase();
    return users.filter(u =>
      u.email.toLowerCase().includes(query) ||
      (u.name && u.name.toLowerCase().includes(query)) ||
      u.tenants.some(t => t.code.toLowerCase().includes(query))
    );
  }, [users, debouncedSearchQuery]);

  const filteredUsersWithAccess = useMemo(() =>
    filteredUsers.filter(u => u.tenants.length > 0),
    [filteredUsers]
  );

  const filteredUsersWithoutAccess = useMemo(() =>
    filteredUsers.filter(u => u.tenants.length === 0 && !pendingUsers.find(p => p.email === u.email)),
    [filteredUsers, pendingUsers]
  );

  // Paginação: calcular total de páginas e items da página atual (memoizado)
  const paginationData = useMemo(() => {
    const totalItems = filteredUsersWithAccess.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = filteredUsersWithAccess.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      paginatedItems,
      currentPage,
      pageSize
    };
  }, [filteredUsersWithAccess, currentPage, pageSize]);

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
      const [usersRes, tenantsRes, pendingRes, alertsRes, statsRes] = await Promise.all([
        getAdminUsers(),
        getAdminTenants(),
        getPendingUsers(),
        getAdminAlerts(),
        getAdminStats(),
      ]);

      setUsers(usersRes.users || []);
      setTenants(tenantsRes.tenants || []);
      setPendingUsers(pendingRes.pending_users || []);
      setAlerts(alertsRes.alerts || []);
      setUnreadCount(alertsRes.unread_count || 0);
      setStats(statsRes);
    } catch (err: any) {
      console.error("Erro ao carregar dados admin:", err);
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(alertId: string) {
    try {
      await markAlertAsRead(alertId);
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, is_read: 1 } : a));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (err) {
      console.error("Erro ao marcar alerta:", err);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllAlertsAsRead();
      setAlerts(alerts.map(a => ({ ...a, is_read: 1 })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Erro ao marcar alertas:", err);
    }
  }

  function getAlertIcon(type: string) {
    switch (type) {
      case 'new_user': return <User className="w-5 h-5 text-green-400" />;
      case 'new_lead': return <MessageSquare className="w-5 h-5 text-green-400" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-slate-500 dark:text-gray-400" />;
    }
  }

  function getSeverityColor(severity: string) {
    switch (severity) {
      case 'error': return 'border-red-500/30 bg-red-500/10';
      case 'warning': return 'border-amber-500/30 bg-amber-500/10';
      case 'success': return 'border-green-500/30 bg-green-500/10';
      default: return 'border-green-500/30 bg-green-500/10';
    }
  }

  function formatRelativeTime(dateString: string | null): string {
    if (!dateString) return 'Nunca';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays}d atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}sem atrás`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mês atrás`;
    return `${Math.floor(diffDays / 365)}ano atrás`;
  }

  // Helper para mapear ações de log para estilos
  function getLogActionStyle(action: string): { color: string; bg: string; label: string } {
    const styles: Record<string, { color: string; bg: string; label: string }> = {
      grant_access: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Acesso Concedido' },
      revoke_access: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Acesso Revogado' },
      create_tenant: { color: 'text-green-400', bg: 'bg-green-500/20', label: 'Tenant Criado' },
      update_tenant: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Tenant Atualizado' },
      deactivate_tenant: { color: 'text-orange-400', bg: 'bg-orange-500/20', label: 'Tenant Desativado' },
      activate_tenant: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Tenant Ativado' },
    };
    return styles[action] || { color: 'text-slate-600 dark:text-white/60', bg: 'bg-navy-700/20', label: 'Ação' };
  }

  async function handleGrantAccess() {
    if (!selectedUser) return;

    setGranting(true);

    const promise = grantAccess({
      user_email: selectedUser.email,
      tenant_code: grantForm.tenant_code,
      role: grantForm.role,
    }).then(async () => {
      // Recarregar dados
      await loadData();
      setShowGrantModal(false);
      setSelectedUser(null);
    });

    toast.promise(promise, {
      loading: 'Concedendo acesso...',
      success: `Acesso concedido com sucesso para ${selectedUser.email}!`,
      error: (err) => err.message || "Erro ao conceder acesso",
    });

    try {
      await promise;
    } finally {
      setGranting(false);
    }
  }

  function handleRevokeAccess(userEmail: string, tenantCode: string) {
    setRevokeData({ userEmail, tenantCode });
    setShowRevokeModal(true);
  }

  async function confirmRevokeAccess() {
    if (!revokeData) return;

    setRevoking(true);

    const promise = revokeAccess({
      user_email: revokeData.userEmail,
      tenant_code: revokeData.tenantCode
    }).then(async () => {
      await loadData();
      setShowRevokeModal(false);
      setRevokeData(null);
    });

    toast.promise(promise, {
      loading: 'Revogando acesso...',
      success: `Acesso revogado com sucesso de ${revokeData.userEmail}!`,
      error: (err) => err.message || "Erro ao revogar acesso",
    });

    try {
      await promise;
    } finally {
      setRevoking(false);
    }
  }

  function validateTenantForm() {
    const errors: { code?: string; name?: string } = {};

    // Validar código (alfanumérico, underscore, hífen, maiúsculo, sem espaços)
    if (!createTenantForm.code) {
      errors.code = "Código é obrigatório";
    } else if (!/^[A-Z0-9_-]+$/.test(createTenantForm.code)) {
      errors.code = "Código deve conter apenas letras maiúsculas, números, _ e -";
    } else if (createTenantForm.code.length < 3) {
      errors.code = "Código deve ter no mínimo 3 caracteres";
    } else if (createTenantForm.code.length > 20) {
      errors.code = "Código deve ter no máximo 20 caracteres";
    } else if (tenants.find(t => t.code === createTenantForm.code)) {
      errors.code = "Este código já está em uso";
    }

    // Validar nome
    if (!createTenantForm.name) {
      errors.name = "Nome é obrigatório";
    } else if (createTenantForm.name.length < 3) {
      errors.name = "Nome deve ter no mínimo 3 caracteres";
    } else if (createTenantForm.name.length > 100) {
      errors.name = "Nome deve ter no máximo 100 caracteres";
    }

    setTenantFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleCreateTenant() {
    if (!validateTenantForm()) return;

    setCreatingTenant(true);

    const promise = (async () => {
      // Em modo mock, apenas simula a criação
      console.log('[Admin] Criando tenant (mock):', createTenantForm);

      // Adiciona tenant aos dados locais (simulação)
      const newTenant: AdminTenant = {
        id: String(Date.now()),
        code: createTenantForm.code,
        name: createTenantForm.name,
        status: 'active',
        created_at: new Date().toISOString(),
        user_count: 0
      };

      setTenants([...tenants, newTenant]);
      setShowCreateTenantModal(false);
      setCreateTenantForm({ code: "", name: "" });
      setTenantFormErrors({});

      // Em produção, chamaria a API:
      // await createTenant({ code: createTenantForm.code, name: createTenantForm.name });
      // await loadData();
    })();

    toast.promise(promise, {
      loading: 'Criando tenant...',
      success: `Tenant "${createTenantForm.name}" criado com sucesso!`,
      error: (err) => err.message || "Erro ao criar tenant",
    });

    try {
      await promise;
    } finally {
      setCreatingTenant(false);
    }
  }

  // Função para habilitar edição do tenant
  function startEditingTenant() {
    if (!selectedTenant) return;
    setEditTenantForm({
      name: selectedTenant.name,
      status: selectedTenant.status
    });
    setIsEditingTenant(true);
  }

  // Função para cancelar edição
  function cancelEditingTenant() {
    setIsEditingTenant(false);
    setEditTenantForm({ name: "", status: "" });
  }

  // Função para salvar edições do tenant
  async function handleUpdateTenant() {
    if (!selectedTenant) return;
    if (!editTenantForm.name.trim()) {
      toast.error("Nome do tenant não pode estar vazio");
      return;
    }

    setUpdatingTenant(true);

    const promise = (async () => {
      // Em modo mock, apenas simula a atualização
      console.log('[Admin] Atualizando tenant (mock):', selectedTenant.code, editTenantForm);

      // Atualiza tenant nos dados locais (simulação)
      const updatedTenants = tenants.map(t =>
        t.id === selectedTenant.id
          ? { ...t, name: editTenantForm.name, status: editTenantForm.status }
          : t
      );

      setTenants(updatedTenants);
      setSelectedTenant({
        ...selectedTenant,
        name: editTenantForm.name,
        status: editTenantForm.status
      });
      setIsEditingTenant(false);

      // Em produção, chamaria a API:
      // await updateTenant(selectedTenant.id, { name: editTenantForm.name, status: editTenantForm.status });
      // await loadData();
    })();

    toast.promise(promise, {
      loading: 'Atualizando tenant...',
      success: 'Tenant atualizado com sucesso!',
      error: (err) => err.message || "Erro ao atualizar tenant",
    });

    try {
      await promise;
    } finally {
      setUpdatingTenant(false);
    }
  }

  // Função para alternar status do tenant (ativar/desativar)
  async function handleToggleTenantStatus() {
    if (!selectedTenant) return;

    const newStatus = selectedTenant.status === "active" ? "inactive" : "active";
    const actionText = newStatus === "active" ? "ativar" : "desativar";

    setUpdatingTenant(true);

    const promise = (async () => {
      // Em modo mock, apenas simula a mudança de status
      console.log('[Admin] Alterando status do tenant (mock):', selectedTenant.code, newStatus);

      // Atualiza status nos dados locais (simulação)
      const updatedTenants = tenants.map(t =>
        t.id === selectedTenant.id
          ? { ...t, status: newStatus }
          : t
      );

      setTenants(updatedTenants);
      setSelectedTenant({ ...selectedTenant, status: newStatus });

      // Em produção, chamaria a API:
      // await updateTenantStatus(selectedTenant.id, newStatus);
      // await loadData();
    })();

    toast.promise(promise, {
      loading: `${actionText === "ativar" ? "Ativando" : "Desativando"} tenant...`,
      success: `Tenant ${actionText === "ativar" ? "ativado" : "desativado"} com sucesso!`,
      error: (err) => err.message || `Erro ao ${actionText} tenant`,
    });

    try {
      await promise;
    } finally {
      setUpdatingTenant(false);
    }
  }

  // Função para exportar usuários para CSV
  function handleExportCSV() {
    try {
      // Define os headers do CSV
      const headers = ['ID', 'Nome', 'Email', 'Telefone', 'Tenants', 'Roles', 'Criado em', 'Último Acesso'];

      // Mapeia os dados dos usuários para linhas CSV
      const rows = usersWithAccess.map(user => {
        const tenantsList = user.tenants.map(t => t.code).join('; ') || '-';
        const rolesList = user.tenants.map(t => t.role).join('; ') || '-';
        const createdAt = new Date(user.created_at).toLocaleDateString('pt-BR');
        const lastAccess = user.last_access
          ? new Date(user.last_access).toLocaleDateString('pt-BR') + ' ' + new Date(user.last_access).toLocaleTimeString('pt-BR')
          : 'Nunca';

        return [
          user.id,
          user.name || '-',
          user.email,
          user.phone || '-',
          tenantsList,
          rolesList,
          createdAt,
          lastAccess
        ];
      });

      // Cria o conteúdo CSV
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Cria um Blob com o conteúdo CSV
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

      // Cria um link de download
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${usersWithAccess.length} usuário(s) exportado(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      toast.error('Erro ao exportar CSV. Tente novamente.');
    }
  }

  // Nao e admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Acesso Restrito</h2>
          <p className="text-slate-900 dark:text-slate-600 dark:text-white/60">
            Esta pagina e exclusiva para administradores.
          </p>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
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
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Shield className="w-7 h-7 text-green-400" />
              Administracao
            </h1>
            <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              Gerenciar usuarios e acessos
            </p>
          </div>
          <Button
            onClick={loadData}
            variant="outline"
            className="border-navy-600 text-slate-900 dark:text-slate-700 dark:text-white/70 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Banner Modo Mock/Desenvolvimento */}
        {showDevBanner && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3"
          >
            <Database className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-amber-400 mb-1">
                    Modo Desenvolvimento Ativo
                  </h3>
                  <p className="text-xs text-amber-300/80 leading-relaxed">
                    Você está visualizando dados simulados (mock data). Todas as operações são salvas localmente
                    e não afetam o banco de dados real. Para conectar à API de produção, configure a variável{" "}
                    <code className="bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-200 font-mono">
                      NEXT_PUBLIC_DEV_MODE=false
                    </code>
                  </p>
                </div>
                <button
                  onClick={() => setShowDevBanner(false)}
                  className="p-1 text-amber-400/60 hover:text-amber-400 hover:bg-amber-500/10 rounded transition-colors flex-shrink-0"
                  title="Fechar banner"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 cursor-pointer hover:border-green-500/50 transition-all"
            onClick={() => setActiveTab('users')}
          >
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.total_users || users.length}</p>
                <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Usuarios Totais</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 cursor-pointer hover:border-emerald-500/50 transition-all"
            onClick={() => {
              setActiveTab('users');
              // Scroll para seção de tenants
              setTimeout(() => {
                const tenantsSection = document.querySelector('[data-section="tenants"]');
                if (tenantsSection) {
                  tenantsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100);
            }}
          >
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.active_tenants || tenants.length}</p>
                <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Tenants Ativos</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 cursor-pointer hover:border-amber-500/50 transition-all"
            onClick={() => {
              setActiveTab('overview');
              // Scroll para seção de pendentes
              setTimeout(() => {
                const pendingSection = document.querySelector('[data-section="pending"]');
                if (pendingSection) {
                  pendingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100);
            }}
          >
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.pending_users || pendingUsers.length}</p>
                <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Aguardando Liberacao</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 cursor-pointer hover:border-red-500/50 transition-all"
            onClick={() => setActiveTab('alerts')}
          >
            <div className="flex items-center gap-3">
              {unreadCount > 0 ? (
                <BellRing className="w-8 h-8 text-red-400 animate-pulse" />
              ) : (
                <Bell className="w-8 h-8 text-slate-500 dark:text-gray-400" />
              )}
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{unreadCount}</p>
                <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Alertas Nao Lidos</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-400 dark:border-navy-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-slate-600 dark:text-white/60 hover:text-white'
            }`}
          >
            Visao Geral
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'alerts'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-slate-600 dark:text-white/60 hover:text-white'
            }`}
          >
            Alertas
            {unreadCount > 0 && (
              <span className="bg-red-500 text-slate-900 dark:text-white text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-slate-600 dark:text-white/60 hover:text-white'
            }`}
          >
            Usuarios e Tenants
          </button>
        </div>

        {/* Tab Content: Alerts */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-400" />
                Alertas do Sistema
              </h3>
              {unreadCount > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-navy-600 text-slate-900 dark:text-slate-700 dark:text-white/70"
                  onClick={handleMarkAllAsRead}
                >
                  <CheckCheck className="w-4 h-4 mr-2" />
                  Marcar Todos como Lidos
                </Button>
              )}
            </div>

            {alerts.length === 0 ? (
              <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-8 text-center">
                <Bell className="w-12 h-12 text-slate-900 dark:text-white/20 mx-auto mb-3" />
                <p className="text-slate-900 dark:text-slate-500 dark:text-white/50">Nenhum alerta no momento</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`rounded-xl p-4 border ${getSeverityColor(alert.severity)} ${
                      alert.is_read ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-slate-900 dark:text-white">{alert.title}</h4>
                          <span className="text-xs text-slate-900 dark:text-white/40">
                            {new Date(alert.created_at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70 mt-1">{alert.message}</p>
                        {alert.data && (
                          <div className="mt-2 text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 bg-white dark:bg-navy-900/50 rounded p-2">
                            {alert.data.email && <p>Email: {alert.data.email}</p>}
                            {alert.data.phone && <p>Telefone: {alert.data.phone}</p>}
                            {alert.data.name && <p>Nome: {alert.data.name}</p>}
                          </div>
                        )}

                        {/* Ações Diretas baseadas no tipo de alerta */}
                        {alert.type === 'new_user' && alert.data?.email && (
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30"
                              onClick={() => {
                                const pendingUser = pendingUsers.find(p => p.email === alert.data?.email);
                                if (pendingUser) {
                                  setSelectedUser(pendingUser);
                                  setShowGrantModal(true);
                                  handleMarkAsRead(alert.id);
                                }
                              }}
                            >
                              <UserPlus className="w-3 h-3 mr-1" />
                              Liberar Acesso
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-navy-600 text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white"
                              onClick={() => handleMarkAsRead(alert.id)}
                            >
                              Ignorar
                            </Button>
                          </div>
                        )}

                        {alert.type === 'new_lead' && alert.data?.email && (
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                              onClick={() => {
                                // Copiar email para clipboard
                                navigator.clipboard.writeText(alert.data?.email || '');
                                toast.success('Email copiado para área de transferência!');
                                handleMarkAsRead(alert.id);
                              }}
                            >
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Copiar Email
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-navy-600 text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white"
                              onClick={() => handleMarkAsRead(alert.id)}
                            >
                              Marcar como Lido
                            </Button>
                          </div>
                        )}
                      </div>
                      {!alert.is_read && !['new_user', 'new_lead'].includes(alert.type) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-slate-900 dark:text-slate-500 dark:text-white/50 hover:text-white"
                          onClick={() => handleMarkAsRead(alert.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Overview & Users */}
        {(activeTab === 'overview' || activeTab === 'users') && (
          <>
        {/* Barra de Busca */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
            <div className="relative">
              {searchQuery !== debouncedSearchQuery ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400 animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900 dark:text-white/40" />
              )}
              <Input
                type="text"
                placeholder="Buscar por email, nome ou tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-100 dark:bg-navy-800 border-navy-600 text-slate-900 dark:text-white placeholder:text-white/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-900 dark:text-white/40 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {debouncedSearchQuery && (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
                  {filteredUsers.length} resultado(s) encontrado(s)
                </p>
                {searchQuery !== debouncedSearchQuery && (
                  <span className="text-xs text-green-400 animate-pulse">Buscando...</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Usuarios Pendentes */}
        {pendingUsers.length > 0 && (
          <div data-section="pending" className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Usuarios Aguardando Liberacao ({pendingUsers.length})
            </h3>
            <div className="space-y-3">
              {pendingUsers.map((u) => (
                <div
                  key={u.id}
                  className="bg-white dark:bg-navy-900/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-white font-medium truncate">{u.name || u.email}</p>
                    <p className="text-sm text-slate-900 dark:text-slate-500 dark:text-white/50 truncate">{u.email}</p>
                    {u.phone && (
                      <p className="text-xs text-slate-900 dark:text-white/40">{u.phone}</p>
                    )}
                    <p className="text-xs text-slate-900 dark:text-white/30 mt-1 sm:hidden">
                      {new Date(u.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="hidden sm:inline text-xs text-slate-900 dark:text-white/40">
                      {new Date(u.created_at).toLocaleDateString("pt-BR")}
                    </span>
                    <Button
                      size="sm"
                      className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 w-full sm:w-auto"
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

        {/* Usuarios Sem Acesso */}
        {filteredUsersWithoutAccess.length > 0 && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Usuarios Sem Acesso ({filteredUsersWithoutAccess.length})
            </h3>
            <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mb-4">
              Usuarios cadastrados mas que nao possuem acesso a nenhum tenant. Eles podem visualizar apenas a landing page.
            </p>
            <div className="space-y-3">
              {filteredUsersWithoutAccess.map((u) => (
                <div
                  key={u.id}
                  className="bg-white dark:bg-navy-900/50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-white font-medium truncate">{u.name || u.email}</p>
                    <p className="text-sm text-slate-900 dark:text-slate-500 dark:text-white/50 truncate">{u.email}</p>
                    {u.phone && (
                      <p className="text-xs text-slate-900 dark:text-white/40 mt-1">{u.phone}</p>
                    )}
                    <p className="text-xs text-slate-900 dark:text-white/30 mt-1">
                      Cadastrado em {new Date(u.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full text-center sm:text-left">
                      Sem Acesso
                    </span>
                    <Button
                      size="sm"
                      className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 w-full sm:w-auto"
                      onClick={() => {
                        const pendingUser: PendingUser = {
                          id: u.id,
                          email: u.email,
                          name: u.name,
                          phone: u.phone,
                          created_at: u.created_at
                        };
                        setSelectedUser(pendingUser);
                        setShowGrantModal(true);
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Conceder Acesso
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Usuarios */}
        <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Usuarios com Acesso ({paginationData.totalItems})
              </h3>
              <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
                Usuarios que possuem acesso a pelo menos um tenant com permissoes especificas.
              </p>
            </div>
            {/* Ações e Seletor de items por página */}
            {paginationData.totalItems > 0 && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  size="sm"
                  className="border-emerald-600 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar CSV
                </Button>
                <div className="h-6 w-px bg-navy-600" />
                <span className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Items por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-slate-100 dark:bg-navy-800 border border-navy-600 text-slate-900 dark:text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            )}
          </div>

          {paginationData.totalItems === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-900 dark:text-white/20 mx-auto mb-3" />
              <p className="text-slate-900 dark:text-slate-500 dark:text-white/50">
                {searchQuery ? "Nenhum usuário encontrado com esses critérios" : "Nenhum usuário com acesso"}
              </p>
            </div>
          ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-400 dark:border-navy-700">
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Email</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Nome</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Tenants</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Último Acesso</th>
                    <th className="text-left py-2 px-3 text-sm font-medium text-slate-900 dark:text-slate-600 dark:text-white/60">Acoes</th>
                  </tr>
                </thead>
                <tbody>
                  {paginationData.paginatedItems.map((u) => (
                    <tr key={u.id} className="border-b border-slate-300 dark:border-navy-800">
                      <td className="py-3 px-3 text-slate-900 dark:text-white text-sm">{u.email}</td>
                      <td className="py-3 px-3 text-slate-900 dark:text-slate-700 dark:text-white/70 text-sm">{u.name || "-"}</td>
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
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {t.code} ({t.role})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-xs ${
                            u.last_access === null
                              ? 'text-white/40 italic'
                              : new Date().getTime() - new Date(u.last_access).getTime() < 3600000 // < 1 hora
                              ? 'text-emerald-400'
                              : new Date().getTime() - new Date(u.last_access).getTime() < 86400000 // < 1 dia
                              ? 'text-green-400'
                              : new Date().getTime() - new Date(u.last_access).getTime() < 604800000 // < 7 dias
                              ? 'text-amber-400'
                              : 'text-slate-500 dark:text-white/50'
                          }`}
                          title={u.last_access ? new Date(u.last_access).toLocaleString('pt-BR') : 'Nunca acessou'}
                        >
                          {formatRelativeTime(u.last_access)}
                        </span>
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {paginationData.paginatedItems.map((u) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-100 dark:bg-navy-800/50 border border-slate-400 dark:border-navy-700 rounded-lg p-4"
                >
                  {/* Header com email e nome */}
                  <div className="mb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-900 dark:text-white font-medium text-sm truncate">{u.email}</h4>
                        {u.name && (
                          <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-xs mt-0.5">{u.name}</p>
                        )}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                          u.last_access === null
                            ? 'bg-white/10 text-white/40'
                            : new Date().getTime() - new Date(u.last_access).getTime() < 3600000
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : new Date().getTime() - new Date(u.last_access).getTime() < 86400000
                            ? 'bg-green-500/20 text-green-400'
                            : new Date().getTime() - new Date(u.last_access).getTime() < 604800000
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-white/10 text-slate-500 dark:text-white/50'
                        }`}
                      >
                        {u.last_access === null ? 'Nunca' : formatRelativeTime(u.last_access)}
                      </span>
                    </div>

                    {/* Último acesso (texto completo) */}
                    {u.last_access && (
                      <p className="text-xs text-slate-900 dark:text-white/40 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Último acesso: {new Date(u.last_access).toLocaleString('pt-BR')}
                      </p>
                    )}
                  </div>

                  {/* Tenants e Roles */}
                  <div className="mb-3">
                    <p className="text-xs text-slate-900 dark:text-white/40 mb-2">Tenants e Permissões:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {u.tenants.map((t) => (
                        <span
                          key={t.code}
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            t.role === "admin"
                              ? "bg-red-500/20 text-red-400"
                              : t.role === "editor"
                              ? "bg-amber-500/20 text-amber-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {t.code} ({t.role})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="border-t border-slate-400 dark:border-navy-700 pt-3">
                    <p className="text-xs text-slate-900 dark:text-white/40 mb-2">Gerenciar Acesso:</p>
                    <div className="flex flex-wrap gap-2">
                      {u.tenants.map((t) => (
                        <Button
                          key={t.code}
                          size="sm"
                          variant="outline"
                          className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 text-xs"
                          onClick={() => handleRevokeAccess(u.email, t.code)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Revogar {t.code}
                        </Button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Controles de Paginação */}
            {paginationData.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
                  Mostrando {paginationData.startIndex + 1} a {Math.min(paginationData.endIndex, paginationData.totalItems)} de {paginationData.totalItems} usuários
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border-navy-600 text-slate-900 dark:text-slate-700 dark:text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: paginationData.totalPages }, (_, i) => i + 1).map((page) => {
                      // Mostrar apenas páginas próximas da atual (max 7 botões)
                      const showPage =
                        page === 1 ||
                        page === paginationData.totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2);

                      const showEllipsis =
                        (page === currentPage - 3 && currentPage > 4) ||
                        (page === currentPage + 3 && currentPage < paginationData.totalPages - 3);

                      if (showEllipsis) {
                        return <span key={page} className="text-slate-900 dark:text-white/40 px-2">...</span>;
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-green-500 text-white'
                              : 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-white/70 hover:bg-navy-700 hover:text-white'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(paginationData.totalPages, prev + 1))}
                    disabled={currentPage === paginationData.totalPages}
                    className="border-navy-600 text-slate-900 dark:text-slate-700 dark:text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
          )}
        </div>

        {/* Lista de Tenants */}
        <div data-section="tenants" className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Tenants ({tenants.length})
            </h3>
            <Button
              onClick={() => setShowCreateTenantModal(true)}
              className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Criar Tenant
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => {
                  setSelectedTenant(t);
                  setShowTenantDetailsModal(true);
                }}
                className="bg-slate-100 dark:bg-navy-800/50 rounded-lg p-4 border border-slate-400 dark:border-navy-700 cursor-pointer hover:border-green-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-green-400">{t.code}</span>
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    t.status === "active"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-slate-900 dark:text-white text-sm mb-2">{t.name}</p>
                <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">
                  {t.user_count} usuario(s)
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Logs de Auditoria */}
        <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Logs de Auditoria
            </h3>
            <span className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">{auditLogs.length} registro(s)</span>
          </div>
          <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60 mb-4">
            Histórico de todas as ações administrativas realizadas no sistema.
          </p>
          <div className="space-y-3">
            {auditLogs.map((log) => {
              const style = getLogActionStyle(log.action);
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-100 dark:bg-navy-800/50 rounded-lg p-4 border border-slate-400 dark:border-navy-700 hover:border-navy-600 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${style.bg} flex items-center justify-center`}>
                      <Activity className={`w-5 h-5 ${style.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.bg} ${style.color}`}>
                              {style.label}
                            </span>
                            {log.tenant_code && (
                              <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-400">
                                {log.tenant_code}
                              </span>
                            )}
                            {log.role && (
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                log.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                                log.role === 'editor' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {log.role}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-900 dark:text-white font-medium">{log.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-900 dark:text-slate-500 dark:text-white/50">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {log.user_email}
                            </span>
                            {log.target_email && (
                              <>
                                <span>→</span>
                                <span>{log.target_email}</span>
                              </>
                            )}
                          </div>
                          {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-xs text-slate-900 dark:text-white/40 cursor-pointer hover:text-slate-600 dark:text-white/60 transition-colors">
                                Ver detalhes
                              </summary>
                              <div className="mt-2 p-2 bg-white dark:bg-navy-900/50 rounded border border-slate-400 dark:border-navy-700">
                                <pre className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60 font-mono">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </div>
                            </details>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60">{formatRelativeTime(log.timestamp)}</p>
                          <p className="text-xs text-slate-900 dark:text-white/40 mt-1">
                            {new Date(log.timestamp).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dashboard de Métricas */}
        <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-400" />
              Métricas de Uso
            </h3>
            <span className="text-xs text-slate-900 dark:text-white/40">Atualizado agora</span>
          </div>

          {/* Grid de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Usuários Ativos - Última Hora */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-green-500/10 to-green-500/10 border border-green-500/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-green-400 font-medium">Última Hora</span>
                <Clock className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{usageMetrics.activeLastHour}</p>
              <p className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60">usuários ativos</p>
            </motion.div>

            {/* Usuários Ativos - Último Dia */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-emerald-400 font-medium">Últimas 24h</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{usageMetrics.activeLastDay}</p>
              <p className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60">usuários ativos</p>
            </motion.div>

            {/* Usuários Ativos - Última Semana */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-purple-400 font-medium">Últimos 7 dias</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{usageMetrics.activeLastWeek}</p>
              <p className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60">usuários ativos</p>
            </motion.div>

            {/* Taxa de Crescimento */}
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              className={`bg-gradient-to-br rounded-lg p-4 border ${
                usageMetrics.growthRate > 0
                  ? 'from-emerald-500/10 to-green-500/10 border-emerald-500/30'
                  : usageMetrics.growthRate < 0
                  ? 'from-red-500/10 to-orange-500/10 border-red-500/30'
                  : 'from-gray-500/10 to-slate-500/10 border-gray-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${
                  usageMetrics.growthRate > 0 ? 'text-emerald-400' :
                  usageMetrics.growthRate < 0 ? 'text-red-400' : 'text-slate-500 dark:text-gray-400'
                }`}>Crescimento</span>
                {usageMetrics.growthRate > 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : usageMetrics.growthRate < 0 ? (
                  <TrendingDown className="w-4 h-4 text-red-400" />
                ) : (
                  <Minus className="w-4 h-4 text-slate-500 dark:text-gray-400" />
                )}
              </div>
              <p className={`text-2xl font-bold mb-1 ${
                usageMetrics.growthRate > 0 ? 'text-emerald-400' :
                usageMetrics.growthRate < 0 ? 'text-red-400' : 'text-slate-500 dark:text-gray-400'
              }`}>
                {usageMetrics.growthRate > 0 ? '+' : ''}{usageMetrics.growthRate}%
              </p>
              <p className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60">vs. período anterior</p>
            </motion.div>
          </div>

          {/* Seção Inferior: Distribuição e Ações */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por Role */}
            <div className="bg-slate-100 dark:bg-navy-800/50 rounded-lg p-4 border border-slate-400 dark:border-navy-700">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">Distribuição por Permissão</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60">Admin</span>
                    <span className="text-xs text-red-400 font-medium">{usageMetrics.roleDistribution.admin}</span>
                  </div>
                  <div className="w-full bg-white dark:bg-navy-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-red-500 to-red-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(usageMetrics.roleDistribution.admin / Math.max(1, usersWithAccess.length)) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60">Editor</span>
                    <span className="text-xs text-amber-400 font-medium">{usageMetrics.roleDistribution.editor}</span>
                  </div>
                  <div className="w-full bg-white dark:bg-navy-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(usageMetrics.roleDistribution.editor / Math.max(1, usersWithAccess.length)) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60">Viewer</span>
                    <span className="text-xs text-green-400 font-medium">{usageMetrics.roleDistribution.viewer}</span>
                  </div>
                  <div className="w-full bg-white dark:bg-navy-900 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(usageMetrics.roleDistribution.viewer / Math.max(1, usersWithAccess.length)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Estatísticas Adicionais */}
            <div className="bg-slate-100 dark:bg-navy-800/50 rounded-lg p-4 border border-slate-400 dark:border-navy-700">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-800 dark:text-white/80 mb-4">Outras Métricas</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Shield className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70">Taxa de Ativação</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">{usageMetrics.activationRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70">Ações (Total)</span>
                  </div>
                  <span className="text-lg font-bold text-purple-400">{usageMetrics.totalActions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm text-slate-900 dark:text-slate-700 dark:text-white/70">Ações (24h)</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">{usageMetrics.actionsLastDay}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </motion.div>

      {/* Modal Conceder Acesso */}
      {showGrantModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-navy-900 rounded-xl border border-slate-400 dark:border-navy-700 p-4 sm:p-6 w-full max-w-full sm:max-w-md"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Conceder Acesso
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-900 dark:text-slate-700 dark:text-white/70">Usuario</Label>
                <p className="text-slate-900 dark:text-white font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <Label htmlFor="tenant" className="text-slate-900 dark:text-slate-700 dark:text-white/70">Tenant</Label>
                <select
                  id="tenant"
                  value={grantForm.tenant_code}
                  onChange={(e) => setGrantForm({ ...grantForm, tenant_code: e.target.value })}
                  className="w-full mt-1 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                >
                  {tenants.map((t) => (
                    <option key={t.code} value={t.code}>
                      {t.code} - {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="role" className="text-slate-900 dark:text-slate-700 dark:text-white/70">Permissao</Label>
                <select
                  id="role"
                  value={grantForm.role}
                  onChange={(e) => setGrantForm({ ...grantForm, role: e.target.value as any })}
                  className="w-full mt-1 bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
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
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 dark:text-white"
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

      {/* Modal Criar Tenant */}
      {showCreateTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-navy-900 rounded-xl border border-slate-400 dark:border-navy-700 p-4 sm:p-6 w-full max-w-full sm:max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Criar Novo Tenant</h3>
              <button
                onClick={() => {
                  setShowCreateTenantModal(false);
                  setCreateTenantForm({ code: "", name: "" });
                  setTenantFormErrors({});
                }}
                className="p-2 text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white hover:bg-slate-100 dark:bg-navy-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleCreateTenant(); }} className="space-y-4">
              <div>
                <Label htmlFor="code" className="text-slate-900 dark:text-slate-700 dark:text-white/70">
                  Código do Tenant <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="code"
                  value={createTenantForm.code}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '');
                    setCreateTenantForm({ ...createTenantForm, code: value });
                    setTenantFormErrors({ ...tenantFormErrors, code: undefined });
                  }}
                  className={`mt-1 bg-slate-100 dark:bg-navy-800 border ${tenantFormErrors.code ? 'border-red-500' : 'border-navy-600'} text-white placeholder:text-white/40`}
                  placeholder="CLIENTE_03"
                  maxLength={20}
                />
                {tenantFormErrors.code && (
                  <p className="text-red-400 text-xs mt-1">{tenantFormErrors.code}</p>
                )}
                <p className="text-slate-900 dark:text-white/40 text-xs mt-1">
                  Apenas letras maiúsculas, números, _ e - (ex: CLIENTE_03, EMPRESA-A)
                </p>
              </div>

              <div>
                <Label htmlFor="name" className="text-slate-900 dark:text-slate-700 dark:text-white/70">
                  Nome do Tenant <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="name"
                  value={createTenantForm.name}
                  onChange={(e) => {
                    setCreateTenantForm({ ...createTenantForm, name: e.target.value });
                    setTenantFormErrors({ ...tenantFormErrors, name: undefined });
                  }}
                  className={`mt-1 bg-slate-100 dark:bg-navy-800 border ${tenantFormErrors.name ? 'border-red-500' : 'border-navy-600'} text-white placeholder:text-white/40`}
                  placeholder="Nome da Empresa Cliente"
                  maxLength={100}
                />
                {tenantFormErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{tenantFormErrors.name}</p>
                )}
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-400 text-sm font-medium mb-1">ℹ️ Informação</p>
                <p className="text-slate-900 dark:text-slate-700 dark:text-white/70 text-xs">
                  O tenant será criado com status ativo. Você poderá adicionar usuários após a criação.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-navy-600"
                  onClick={() => {
                    setShowCreateTenantModal(false);
                    setCreateTenantForm({ code: "", name: "" });
                    setTenantFormErrors({});
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 dark:text-white"
                  disabled={creatingTenant}
                >
                  {creatingTenant ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Criar Tenant
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Modal de Confirmação - Revogar Acesso */}
      {showRevokeModal && revokeData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-navy-900 border border-red-500/30 rounded-xl shadow-2xl w-full max-w-full sm:max-w-md p-4 sm:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Confirmar Revogação de Acesso
                </h3>
                <p className="text-slate-900 dark:text-slate-700 dark:text-white/70 text-sm mb-4">
                  Tem certeza que deseja revogar o acesso de{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">{revokeData.userEmail}</span>{" "}
                  ao tenant{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">{revokeData.tenantCode}</span>?
                </p>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                  <p className="text-red-400 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Esta ação não pode ser desfeita. O usuário perderá imediatamente o acesso aos dados deste tenant.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-navy-600"
                onClick={() => {
                  setShowRevokeModal(false);
                  setRevokeData(null);
                }}
                disabled={revoking}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                className="flex-1 bg-red-500 hover:bg-red-600 text-slate-900 dark:text-white"
                onClick={confirmRevokeAccess}
                disabled={revoking}
              >
                {revoking ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Revogar Acesso
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Detalhes do Tenant */}
      {showTenantDetailsModal && selectedTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl shadow-2xl w-full max-w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-navy-900 border-b border-slate-400 dark:border-navy-700 p-4 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedTenant.code}</h3>
                  <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">{selectedTenant.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowTenantDetailsModal(false);
                  setSelectedTenant(null);
                }}
                className="p-2 text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white hover:bg-slate-100 dark:bg-navy-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-6">
              {/* Informações Gerais */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-800 dark:text-white/80 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Informações Gerais
                  </h4>
                  {!isEditingTenant ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                      onClick={startEditingTenant}
                      disabled={updatingTenant}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white hover:bg-navy-700"
                        onClick={cancelEditingTenant}
                        disabled={updatingTenant}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                        onClick={handleUpdateTenant}
                        disabled={updatingTenant}
                      >
                        {updatingTenant ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-1" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                <div className="bg-slate-100 dark:bg-navy-800/50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Código</span>
                    <span className="text-sm font-medium text-green-400">{selectedTenant.code}</span>
                  </div>
                  {!isEditingTenant ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Nome</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{selectedTenant.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Status</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          selectedTenant.status === "active"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {selectedTenant.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="edit-name" className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Nome</Label>
                        <Input
                          id="edit-name"
                          value={editTenantForm.name}
                          onChange={(e) => setEditTenantForm({ ...editTenantForm, name: e.target.value })}
                          className="bg-slate-100 dark:bg-navy-800 border-navy-600 text-slate-900 dark:text-white"
                          placeholder="Nome do tenant"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="edit-status" className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Status</Label>
                        <select
                          id="edit-status"
                          value={editTenantForm.status}
                          onChange={(e) => setEditTenantForm({ ...editTenantForm, status: e.target.value })}
                          className="w-full bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm"
                        >
                          <option value="active">Ativo</option>
                          <option value="inactive">Inativo</option>
                        </select>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Criado em</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {new Date(selectedTenant.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">Total de Usuários</span>
                    <span className="text-sm font-medium text-green-400">{selectedTenant.user_count}</span>
                  </div>
                </div>
              </div>

              {/* Lista de Usuários com Acesso */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-800 dark:text-white/80 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Usuários com Acesso ({usersWithAccess.filter(u => u.tenants.some(t => t.code === selectedTenant.code)).length})
                </h4>
                <div className="bg-slate-100 dark:bg-navy-800/50 rounded-lg divide-y divide-navy-700">
                  {usersWithAccess
                    .filter(u => u.tenants.some(t => t.code === selectedTenant.code))
                    .map((user) => {
                      const tenantRole = user.tenants.find(t => t.code === selectedTenant.code)?.role;
                      return (
                        <div key={user.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-100 dark:bg-navy-800/80 transition-colors">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="w-10 h-10 bg-navy-700 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-5 h-5 text-slate-900 dark:text-slate-600 dark:text-white/60" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name || user.email}</p>
                              <p className="text-xs text-slate-900 dark:text-slate-500 dark:text-white/50 truncate">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              tenantRole === "admin"
                                ? "bg-red-500/20 text-red-400"
                                : tenantRole === "editor"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-green-500/20 text-green-400"
                            }`}>
                              {tenantRole}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              onClick={() => {
                                setShowTenantDetailsModal(false);
                                handleRevokeAccess(user.email, selectedTenant.code);
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  {usersWithAccess.filter(u => u.tenants.some(t => t.code === selectedTenant.code)).length === 0 && (
                    <div className="p-6 text-center">
                      <p className="text-sm text-slate-900 dark:text-slate-500 dark:text-white/50">Nenhum usuário com acesso a este tenant</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ações Rápidas */}
              <div className="space-y-3 pt-4 border-t border-slate-400 dark:border-navy-700">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                    onClick={() => {
                      setShowTenantDetailsModal(false);
                      // Scroll para seção de usuários pendentes
                      setTimeout(() => {
                        const pendingSection = document.querySelector('[data-section="pending"]');
                        if (pendingSection) {
                          pendingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }, 100);
                    }}
                    disabled={updatingTenant}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Adicionar Usuário
                  </Button>
                  <Button
                    className={`flex-1 border ${
                      selectedTenant.status === "active"
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30"
                        : "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border-emerald-500/30"
                    }`}
                    onClick={handleToggleTenantStatus}
                    disabled={updatingTenant || isEditingTenant}
                  >
                    {updatingTenant ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Power className="w-4 h-4 mr-2" />
                    )}
                    {selectedTenant.status === "active" ? "Desativar" : "Ativar"} Tenant
                  </Button>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-navy-600 text-slate-900 dark:text-slate-700 dark:text-white/70 hover:text-white"
                  onClick={() => {
                    setShowTenantDetailsModal(false);
                    setSelectedTenant(null);
                    setIsEditingTenant(false);
                  }}
                  disabled={updatingTenant}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

