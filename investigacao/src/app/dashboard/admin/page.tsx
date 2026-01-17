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
  Trash2,
  FolderOpen,
  CheckCircle,
  LayoutList,
  LayoutGrid,
  Filter,
  Eye,
  Pencil,
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
  getAdminAlerts,
  markAlertAsRead,
  markAllAlertsAsRead,
  getAdminStats,
  updateUser,
  deleteUser,
  updateTenant,
  getAuditLogs,
  getAdminInvestigacoes,
  getAdminInvestigacoesStats,
  AdminUser,
  AdminTenant,
  PendingUser,
  AdminAlert,
  AdminStats,
} from "@/lib/admin-api";
import { toast } from "sonner";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { StatCard, SearchBar, Pagination, SkeletonCard, SkeletonTable, SkeletonChart } from "@/components/dashboard";
import { KanbanView } from "@/components/dashboard/KanbanView";

// Admin emails permitidos
const ADMIN_EMAILS = ['dkbotdani@gmail.com'];

// Cores para os gráficos
const COLORS = ['#ec4899', '#3b82f6', '#10b981', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

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

  // Estados para investigações (tab investigations)
  const [investigations, setInvestigations] = useState<any[]>([]);
  const [investigationsStats, setInvestigationsStats] = useState<any>(null);
  const [investigationsLoading, setInvestigationsLoading] = useState(false);
  const [invViewMode, setInvViewMode] = useState<'list' | 'kanban'>('kanban');
  const [invSearchQuery, setInvSearchQuery] = useState('');
  const [invFilterCategory, setInvFilterCategory] = useState<string>('todos');
  const [invPage, setInvPage] = useState(1);
  const [invPageSize, setInvPageSize] = useState(50);
  const [selectedInvestigation, setSelectedInvestigation] = useState<any>(null);

  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [grantForm, setGrantForm] = useState({
    tenant_code: "CLIENTE_01",
    role: "viewer" as "admin" | "editor" | "viewer",
  });
  const [granting, setGranting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts' | 'users' | 'investigations'>('overview');

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

  // Estados para modal de edição de usuário
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editUserForm, setEditUserForm] = useState({ name: "", phone: "", status: "active", subscription_tier: "free" });
  const [updatingUser, setUpdatingUser] = useState(false);

  // Estados para modal de confirmação de deleção de usuário
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");
  const [deletingUserInProgress, setDeletingUserInProgress] = useState(false);

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
  const [showDevBanner, setShowDevBanner] = useState(false); // Sempre usar dados reais do banco D1

  // Estados para Logs de auditoria
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);
  const [auditLogsFilters, setAuditLogsFilters] = useState({
    action: '',
    entityType: '',
    limit: 50
  });

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

  // Filtrar e paginar investigações
  const filteredInvestigations = useMemo(() => {
    let filtered = [...investigations];

    // Filtro por categoria
    if (invFilterCategory !== 'todos') {
      filtered = filtered.filter(inv =>
        (inv.categoria || inv.grupo || '').toLowerCase() === invFilterCategory.toLowerCase()
      );
    }

    // Filtro por busca
    if (invSearchQuery) {
      const query = invSearchQuery.toLowerCase();
      filtered = filtered.filter(inv =>
        (inv.nome || '').toLowerCase().includes(query) ||
        (inv.documento || inv.cpf || '').includes(invSearchQuery) ||
        (inv.user_email || '').toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [investigations, invFilterCategory, invSearchQuery]);

  const invPaginationData = useMemo(() => {
    const totalItems = filteredInvestigations.length;
    const totalPages = Math.ceil(totalItems / invPageSize);
    const startIndex = (invPage - 1) * invPageSize;
    const endIndex = startIndex + invPageSize;
    const paginatedItems = filteredInvestigations.slice(startIndex, endIndex);

    return {
      totalItems,
      totalPages,
      startIndex,
      endIndex,
      paginatedItems,
    };
  }, [filteredInvestigations, invPage, invPageSize]);

  // Converter investigações para formato Funcionario (para KanbanView)
  const investigationsAsFuncionarios = useMemo(() => {
    return filteredInvestigations.map((inv: any) => ({
      id: inv.id?.toString() || '',
      nome: inv.nome || '',
      cpf: inv.documento || inv.cpf || '',
      grupo: inv.categoria || inv.grupo || 'N/A',
      cargo: inv.tipo_pessoa === 'juridica' ? 'Empresa' : 'Pessoa Física',
      status_investigacao: inv.status_investigacao || 'investigar',
      user_email: inv.user_email,
      is_grupo: inv.is_grupo || 0,
      grupo_total_documentos: inv.grupo_total_documentos || 0,
      esta_morto: 'NÃO',
      recebe_beneficio: 0,
      socio_empresa: inv.tipo_pessoa === 'juridica' ? 1 : 0,
      sancionado_ceis: 0,
      candidato: 0,
      doador_campanha: 0,
      qtd_empresas: 0,
    }));
  }, [filteredInvestigations]);

  // Verificar se e admin
  const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (isAdmin) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  // Carregar dados de investigações quando mudar para a tab
  useEffect(() => {
    if (isAdmin && activeTab === 'investigations' && investigations.length === 0) {
      loadInvestigationsData();
    }
  }, [isAdmin, activeTab]);

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

  async function loadInvestigationsData() {
    setInvestigationsLoading(true);

    try {
      const [investigationsRes, statsRes] = await Promise.all([
        getAdminInvestigacoes({ limit: 50 }),
        getAdminInvestigacoesStats(),
      ]);

      setInvestigations(investigationsRes.investigacoes || []);
      setInvestigationsStats(statsRes.stats || null);
    } catch (err: any) {
      console.error("Erro ao carregar investigações:", err);
      toast.error("Erro ao carregar investigações");
    } finally {
      setInvestigationsLoading(false);
    }
  }

  function exportInvestigationsToCSV() {
    if (filteredInvestigations.length === 0) {
      toast.error('Nenhuma investigação para exportar');
      return;
    }

    // Preparar cabeçalhos
    const headers = ['ID', 'Nome', 'Documento', 'Categoria', 'Tipo', 'Usuário', 'Status', 'Data Criação'];

    // Preparar linhas
    const rows = filteredInvestigations.map((inv: any) => [
      inv.id || '',
      inv.nome || '',
      inv.documento || inv.cpf || '',
      inv.categoria || inv.grupo || '',
      inv.tipo_pessoa === 'juridica' ? 'Empresa' : 'Pessoa Física',
      inv.user_email || '',
      inv.status || 'Em Andamento',
      inv.created_at || '',
    ]);

    // Criar conteúdo CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Criar blob e download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `investigacoes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`${filteredInvestigations.length} investigações exportadas com sucesso!`);
  }

  async function loadAuditLogs() {
    setAuditLogsLoading(true);
    try {
      const filters: any = {
        limit: auditLogsFilters.limit,
        offset: 0
      };
      if (auditLogsFilters.action) filters.action = auditLogsFilters.action;
      if (auditLogsFilters.entityType) filters.entityType = auditLogsFilters.entityType;

      const response = await getAuditLogs(filters);
      // Transform API response to match component expected format
      const transformedLogs = response.success && response.data?.logs ? response.data.logs.map((log: any) => ({
        id: log.id,
        action: log.action,
        description: `${log.action} - ${log.entity_type}`,
        user_email: log.user_email || 'System',
        target_email: null,
        tenant_code: null,
        role: null,
        timestamp: log.created_at,
        metadata: log.metadata ? (typeof log.metadata === 'string' ? JSON.parse(log.metadata) : log.metadata) : {}
      })) : [];
      setAuditLogs(transformedLogs);
    } catch (err: any) {
      console.error("Erro ao carregar logs de auditoria:", err);
      toast.error("Erro ao carregar logs de auditoria");
      setAuditLogs([]);
    } finally {
      setAuditLogsLoading(false);
    }
  }

  // Load audit logs when component mounts and when filters change
  useEffect(() => {
    if (isAdmin) {
      loadAuditLogs();
    }
  }, [isAdmin, auditLogsFilters]);

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

  function handleEditUser(user: AdminUser) {
    setEditingUser(user);
    setEditUserForm({
      name: user.name || "",
      phone: user.phone || "",
      status: user.status || "active",
      subscription_tier: user.subscription_tier || "free"
    });
    setShowEditUserModal(true);
  }

  async function confirmEditUser() {
    if (!editingUser) return;

    setUpdatingUser(true);

    const promise = updateUser(editingUser.id, {
      name: editUserForm.name,
      phone: editUserForm.phone,
      status: editUserForm.status,
      subscription_tier: editUserForm.subscription_tier
    }).then(async () => {
      await loadData();
      setShowEditUserModal(false);
      setEditingUser(null);
      setEditUserForm({ name: "", phone: "", status: "active", subscription_tier: "free" });
    });

    toast.promise(promise, {
      loading: 'Atualizando usuário...',
      success: `Usuário ${editingUser.email} atualizado com sucesso!`,
      error: (err) => err.message || "Erro ao atualizar usuário",
    });

    try {
      await promise;
    } finally {
      setUpdatingUser(false);
    }
  }

  function handleDeleteUser(user: AdminUser) {
    setDeletingUser(user);
    setConfirmDeleteText("");
    setShowDeleteUserModal(true);
  }

  async function confirmDeleteUser() {
    if (!deletingUser) return;
    if (confirmDeleteText !== deletingUser.email) {
      toast.error("O email digitado não corresponde ao email do usuário");
      return;
    }

    setDeletingUserInProgress(true);

    const promise = deleteUser(deletingUser.id).then(async () => {
      await loadData();
      setShowDeleteUserModal(false);
      setDeletingUser(null);
      setConfirmDeleteText("");
    });

    toast.promise(promise, {
      loading: 'Deletando usuário...',
      success: `Usuário ${deletingUser.email} deletado com sucesso!`,
      error: (err) => err.message || "Erro ao deletar usuário",
    });

    try {
      await promise;
    } finally {
      setDeletingUserInProgress(false);
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

    const promise = updateTenant(selectedTenant.code, {
      name: editTenantForm.name,
      status: editTenantForm.status
    }).then(async () => {
      await loadData();
      setIsEditingTenant(false);
      setSelectedTenant({
        ...selectedTenant,
        name: editTenantForm.name,
        status: editTenantForm.status
      });
    });

    toast.promise(promise, {
      loading: 'Atualizando tenant...',
      success: `Tenant ${selectedTenant.code} atualizado com sucesso!`,
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

    const promise = updateTenant(selectedTenant.code, {
      name: selectedTenant.name,
      status: newStatus
    }).then(async () => {
      await loadData();
      setSelectedTenant({ ...selectedTenant, status: newStatus });
    });

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

  // Função para exportar tenants para CSV
  function handleExportTenantsCSV() {
    try {
      // Define os headers do CSV
      const headers = ['Código', 'Nome', 'Status', 'Usuários', 'Criado em'];

      // Mapeia os dados dos tenants para linhas CSV
      const rows = tenants.map(tenant => {
        const createdAt = new Date(tenant.created_at).toLocaleDateString('pt-BR');
        const statusText = tenant.status === 'active' ? 'Ativo' : 'Inativo';

        return [
          tenant.code,
          tenant.name,
          statusText,
          tenant.user_count.toString(),
          createdAt
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
      link.setAttribute('download', `tenants_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${tenants.length} tenant(s) exportado(s) com sucesso!`);
    } catch (error) {
      console.error('Erro ao exportar CSV de tenants:', error);
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
    <div className="p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-green-400" />
              Administracao
            </h1>
            <p className="text-sm sm:text-base text-slate-900 dark:text-slate-600 dark:text-white/60 mt-1">
              Gerenciar usuarios e acessos
            </p>
          </div>
          <Button
            onClick={loadData}
            variant="outline"
            size="sm"
            className="border-navy-600 text-slate-900 dark:text-slate-700 dark:text-navy-300 hover:text-white w-full sm:w-auto"
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
            className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3"
          >
            <Database className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 flex-shrink-0 mt-0.5" />
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
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Usuarios Totais"
            value={stats?.total_users || users.length}
            icon={Users}
            color="blue"
            onClick={() => setActiveTab('users')}
          />

          <StatCard
            title="Tenants Ativos"
            value={stats?.active_tenants || tenants.length}
            icon={Building2}
            color="emerald"
            onClick={() => {
              setActiveTab('users');
              setTimeout(() => {
                const tenantsSection = document.querySelector('[data-section="tenants"]');
                if (tenantsSection) {
                  tenantsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100);
            }}
          />

          <StatCard
            title="Aguardando Liberacao"
            value={stats?.pending_users || pendingUsers.length}
            icon={Clock}
            color="amber"
            onClick={() => {
              setActiveTab('overview');
              setTimeout(() => {
                const pendingSection = document.querySelector('[data-section="pending"]');
                if (pendingSection) {
                  pendingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100);
            }}
          />

          <StatCard
            title="Alertas Nao Lidos"
            value={unreadCount}
            icon={unreadCount > 0 ? BellRing : Bell}
            color="red"
            pulse={unreadCount > 0}
            onClick={() => setActiveTab('alerts')}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-400 dark:border-navy-700 overflow-x-auto pb-px -mb-px scrollbar-thin scrollbar-thumb-navy-700 scrollbar-track-transparent">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-slate-600 dark:text-white/60 hover:text-white'
            }`}
          >
            Visao Geral
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
              activeTab === 'alerts'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-slate-600 dark:text-white/60 hover:text-white'
            }`}
          >
            Alertas
            {unreadCount > 0 && (
              <span className="bg-red-500 text-slate-900 dark:text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'users'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-slate-600 dark:text-white/60 hover:text-white'
            }`}
          >
            Usuarios e Tenants
          </button>
          <button
            onClick={() => setActiveTab('investigations')}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'investigations'
                ? 'text-green-400 border-b-2 border-green-400'
                : 'text-slate-600 dark:text-white/60 hover:text-white'
            }`}
          >
            Investigacoes Globais
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
                  className="border-navy-600 text-slate-900 dark:text-slate-700 dark:text-navy-300"
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
                        <p className="text-sm text-slate-900 dark:text-slate-700 dark:text-navy-300 mt-1">{alert.message}</p>
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

        {/* Tab Content: Investigations */}
        {activeTab === 'investigations' && (
          <div className="space-y-6">
            {investigationsLoading ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <SkeletonChart type="pie" title="Distribuição por Categoria" />
                  <SkeletonChart type="bar" title="Top 10 Usuários Mais Ativos" />
                  <SkeletonChart type="bar" title="Distribuição por Status" />
                </div>
                <SkeletonTable rows={10} columns={7} />
              </>
            ) : investigationsStats ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                  <StatCard
                    title="Total"
                    value={investigationsStats.total || 0}
                    icon={FolderOpen}
                    color="yellow"
                  />

                  <StatCard
                    title="Em Andamento"
                    value={investigationsStats.em_andamento || 0}
                    icon={Clock}
                    color="blue"
                  />

                  <StatCard
                    title="Com Relatório"
                    value={investigationsStats.com_relatorio || 0}
                    icon={FileText}
                    color="purple"
                  />

                  <StatCard
                    title="Concluídas"
                    value={investigationsStats.concluidas || 0}
                    icon={CheckCircle}
                    color="emerald"
                  />

                  <StatCard
                    title="Bloqueadas"
                    value={investigationsStats.bloqueadas || 0}
                    icon={AlertCircle}
                    color="red"
                  />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* PieChart - Distribuição por Categoria */}
                  {investigationsStats.por_categoria && investigationsStats.por_categoria.length > 0 && (
                    <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 sm:p-6">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Distribuição por Categoria</h3>
                      <div className="h-[280px] sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={investigationsStats.por_categoria}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="count"
                              nameKey="categoria"
                            >
                              {investigationsStats.por_categoria.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip
                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                              labelStyle={{ color: '#f1f5f9' }}
                            />
                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* BarChart - Top 10 Usuários */}
                  {investigationsStats.por_usuario && investigationsStats.por_usuario.length > 0 && (
                    <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 sm:p-6">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Top 10 Usuários Mais Ativos</h3>
                      <div className="h-[280px] sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={investigationsStats.por_usuario}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis
                              dataKey="name"
                              stroke="#94a3b8"
                              fontSize={9}
                              angle={-45}
                              textAnchor="end"
                              height={70}
                            />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <RechartsTooltip
                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                              labelStyle={{ color: '#f1f5f9' }}
                            />
                            <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* BarChart - Distribuição por Status */}
                  {investigationsStats.por_status && investigationsStats.por_status.length > 0 && (
                    <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4 sm:p-6">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-slate-900 dark:text-white mb-3 sm:mb-4">Distribuição por Status</h3>
                      <div className="h-[280px] sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={investigationsStats.por_status} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis type="number" stroke="#94a3b8" fontSize={10} />
                            <YAxis
                              type="category"
                              dataKey="status"
                              stroke="#94a3b8"
                              fontSize={10}
                              width={80}
                            />
                            <RechartsTooltip
                              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '12px' }}
                              labelStyle={{ color: '#f1f5f9' }}
                            />
                            <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filters and Search */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Search Bar and View Toggle */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nome, documento ou usuário..."
                        value={invSearchQuery}
                        onChange={(e) => setInvSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg text-slate-900 dark:text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 text-sm sm:text-base"
                      />
                      {invSearchQuery && (
                        <button
                          onClick={() => setInvSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Toggle View Mode */}
                    <div className="flex gap-1 bg-slate-100 dark:bg-navy-800 border border-slate-400 dark:border-navy-700 rounded-lg p-1">
                      <button
                        onClick={() => setInvViewMode("list")}
                        className={`flex-1 sm:flex-none px-3 py-2 rounded transition-all ${
                          invViewMode === "list"
                            ? "bg-green-500 text-navy-950"
                            : "text-slate-600 dark:text-white/60 hover:text-white"
                        }`}
                        title="Visualização em Lista"
                      >
                        <LayoutList className="w-4 h-4 mx-auto" />
                      </button>
                      <button
                        onClick={() => setInvViewMode("kanban")}
                        className={`flex-1 sm:flex-none px-3 py-2 rounded transition-all ${
                          invViewMode === "kanban"
                            ? "bg-green-500 text-navy-950"
                            : "text-slate-600 dark:text-white/60 hover:text-white"
                        }`}
                        title="Visualização Kanban"
                      >
                        <LayoutGrid className="w-4 h-4 mx-auto" />
                      </button>
                    </div>

                    {/* Export CSV Button */}
                    <button
                      onClick={exportInvestigationsToCSV}
                      className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
                      title="Exportar para CSV"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Exportar CSV</span>
                      <span className="sm:hidden">Exportar</span>
                    </button>
                  </div>

                  {/* Category Filters */}
                  <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Filter className="w-4 h-4 text-slate-500 dark:text-white/50" />
                      <span className="text-sm font-medium text-slate-900 dark:text-navy-300">Filtros por Categoria</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['todos', 'familia', 'clientes', 'funcionarios', 'empresas', 'relacionamentos'].map((category) => (
                        <button
                          key={category}
                          onClick={() => setInvFilterCategory(category)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            invFilterCategory === category
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 hover:text-white border border-slate-400 dark:border-navy-700"
                          }`}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Results Count */}
                  <p className="text-sm text-slate-900 dark:text-white/60">
                    {filteredInvestigations.length.toLocaleString()} {filteredInvestigations.length === 1 ? 'investigação' : 'investigações'} de {investigations.length.toLocaleString()} total
                  </p>
                </div>

                {/* Table or Kanban View */}
                {invViewMode === "list" ? (
                  <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto -mx-px">
                      <table className="w-full min-w-[640px]">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-navy-800/50 border-b border-slate-400 dark:border-navy-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-white/60">Nome</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-white/60">Documento</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-white/60">Categoria</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-white/60">Tipo</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-white/60">Usuário</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-900 dark:text-white/60">Status</th>
                            <th className="text-center py-3 px-4 text-sm font-medium text-slate-900 dark:text-white/60">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invPaginationData.paginatedItems.length > 0 ? (
                            invPaginationData.paginatedItems.map((inv: any, index: number) => (
                              <tr
                                key={inv.id || index}
                                className="border-b border-slate-300 dark:border-navy-800 hover:bg-slate-100 dark:hover:bg-navy-800/50 transition-colors"
                              >
                                <td className="py-3 px-4">
                                  <span className="text-slate-900 dark:text-white font-medium">
                                    {inv.nome || '-'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-900 dark:text-navy-300 font-mono text-sm">
                                  {inv.documento || inv.cpf || '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-navy-700 text-navy-300">
                                    {inv.categoria || inv.grupo || 'N/A'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-slate-900 dark:text-navy-300 text-sm">
                                  {inv.tipo_pessoa === 'juridica' ? 'Empresa' : 'Pessoa Física'}
                                </td>
                                <td className="py-3 px-4 text-slate-900 dark:text-navy-300 text-sm">
                                  {inv.user_email || '-'}
                                </td>
                                <td className="py-3 px-4">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                                    {inv.status || 'Em Andamento'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => setSelectedInvestigation(inv)}
                                      className="p-1.5 rounded hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-colors"
                                      title="Visualizar"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        toast.info('Edição em desenvolvimento');
                                      }}
                                      className="p-1.5 rounded hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 transition-colors"
                                      title="Editar"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Tem certeza que deseja deletar a investigação "${inv.nome}"?`)) {
                                          toast.info('Exclusão em desenvolvimento');
                                        }
                                      }}
                                      className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors"
                                      title="Deletar"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-slate-900 dark:text-white/50">
                                Nenhuma investigação encontrada
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {invPaginationData.totalPages > 1 && (
                      <div className="border-t border-slate-400 dark:border-navy-700 p-4">
                        <Pagination
                          currentPage={invPage}
                          totalPages={invPaginationData.totalPages}
                          pageSize={invPageSize}
                          totalItems={invPaginationData.totalItems}
                          startIndex={invPaginationData.startIndex}
                          endIndex={invPaginationData.endIndex}
                          onPageChange={setInvPage}
                          onPageSizeChange={(newSize) => {
                            setInvPageSize(newSize);
                            setInvPage(1);
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-3 sm:p-6 overflow-x-auto">
                    <KanbanView
                      funcionarios={investigationsAsFuncionarios as any}
                      onSelectFuncionario={(func) => setSelectedInvestigation(func)}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-8 text-center">
                <AlertCircle className="w-12 h-12 text-slate-900 dark:text-white/20 mx-auto mb-3" />
                <p className="text-slate-900 dark:text-slate-500 dark:text-white/50">Nenhuma investigação encontrada</p>
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
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Buscar por email, nome ou tenant..."
              loading={searchQuery !== debouncedSearchQuery}
            />
            {debouncedSearchQuery && (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-slate-900 dark:text-slate-600 dark:text-white/60">
                  {filteredUsers.length} resultado(s) encontrado(s)
                </p>
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
                      <td className="py-3 px-3 text-slate-900 dark:text-slate-700 dark:text-navy-300 text-sm">{u.name || "-"}</td>
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
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
                            onClick={() => handleEditUser(u)}
                            title="Editar usuário"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            onClick={() => handleDeleteUser(u)}
                            title="Deletar usuário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          {u.tenants.map((t) => (
                            <Button
                              key={t.code}
                              size="sm"
                              variant="ghost"
                              className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                              onClick={() => handleRevokeAccess(u.email, t.code)}
                              title={`Revogar acesso ao ${t.code}`}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          ))}
                        </div>
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
                    <p className="text-xs text-slate-900 dark:text-white/40 mb-2">Ações:</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-400 border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50 text-xs"
                        onClick={() => handleEditUser(u)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-400 border-red-500/30 hover:bg-red-500/10 hover:border-red-500/50 text-xs"
                        onClick={() => handleDeleteUser(u)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Deletar
                      </Button>
                      {u.tenants.map((t) => (
                        <Button
                          key={t.code}
                          size="sm"
                          variant="outline"
                          className="text-amber-400 border-amber-500/30 hover:bg-amber-500/10 hover:border-amber-500/50 text-xs"
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
              <Pagination
                currentPage={currentPage}
                totalPages={paginationData.totalPages}
                pageSize={pageSize}
                totalItems={paginationData.totalItems}
                startIndex={paginationData.startIndex}
                endIndex={paginationData.endIndex}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(1);
                }}
              />
            )}
          </>
          )}
        </div>

        {/* Lista de Tenants */}
        <div data-section="tenants" className="bg-white dark:bg-navy-900 border border-slate-400 dark:border-navy-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-400" />
              Tenants ({tenants.length})
            </h3>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleExportTenantsCSV}
                variant="outline"
                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </Button>
              <Button
                onClick={() => setShowCreateTenantModal(true)}
                className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Criar Tenant
              </Button>
            </div>
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

          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <Label htmlFor="filter-action" className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60 mb-1">Ação</Label>
              <select
                id="filter-action"
                value={auditLogsFilters.action}
                onChange={(e) => setAuditLogsFilters({ ...auditLogsFilters, action: e.target.value })}
                className="w-full bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm"
              >
                <option value="">Todas as ações</option>
                <option value="create">Criar</option>
                <option value="update">Atualizar</option>
                <option value="delete">Deletar</option>
                <option value="grant">Conceder</option>
                <option value="revoke">Revogar</option>
              </select>
            </div>
            <div>
              <Label htmlFor="filter-entity" className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60 mb-1">Tipo de Entidade</Label>
              <select
                id="filter-entity"
                value={auditLogsFilters.entityType}
                onChange={(e) => setAuditLogsFilters({ ...auditLogsFilters, entityType: e.target.value })}
                className="w-full bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm"
              >
                <option value="">Todos os tipos</option>
                <option value="user">Usuário</option>
                <option value="tenant">Tenant</option>
                <option value="access">Acesso</option>
              </select>
            </div>
            <div>
              <Label htmlFor="filter-limit" className="text-xs text-slate-900 dark:text-slate-600 dark:text-white/60 mb-1">Limite</Label>
              <select
                id="filter-limit"
                value={auditLogsFilters.limit}
                onChange={(e) => setAuditLogsFilters({ ...auditLogsFilters, limit: Number(e.target.value) })}
                className="w-full bg-slate-100 dark:bg-navy-800 border border-navy-600 rounded-lg px-3 py-2 text-slate-900 dark:text-white text-sm"
              >
                <option value="10">10 registros</option>
                <option value="25">25 registros</option>
                <option value="50">50 registros</option>
                <option value="100">100 registros</option>
              </select>
            </div>
          </div>

          {/* Lista de Logs */}
          {auditLogsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
            </div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-900 dark:text-white/20 mx-auto mb-3" />
              <p className="text-slate-900 dark:text-slate-500 dark:text-white/50">Nenhum log encontrado</p>
            </div>
          ) : (
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
          )}
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
                    <span className="text-sm text-slate-900 dark:text-slate-700 dark:text-navy-300">Taxa de Ativação</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">{usageMetrics.activationRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm text-slate-900 dark:text-slate-700 dark:text-navy-300">Ações (Total)</span>
                  </div>
                  <span className="text-lg font-bold text-purple-400">{usageMetrics.totalActions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Activity className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm text-slate-900 dark:text-slate-700 dark:text-navy-300">Ações (24h)</span>
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
                <Label className="text-slate-900 dark:text-slate-700 dark:text-navy-300">Usuario</Label>
                <p className="text-slate-900 dark:text-white font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <Label htmlFor="tenant" className="text-slate-900 dark:text-slate-700 dark:text-navy-300">Tenant</Label>
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
                <Label htmlFor="role" className="text-slate-900 dark:text-slate-700 dark:text-navy-300">Permissao</Label>
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

      {/* Modal Editar Usuário */}
      {showEditUserModal && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-navy-900 rounded-xl border border-slate-400 dark:border-navy-700 p-4 sm:p-6 w-full max-w-full sm:max-w-md"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Edit className="w-5 h-5 text-green-400" />
              Editar Usuário
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-slate-900 dark:text-slate-700 dark:text-navy-300">Email</Label>
                <p className="text-slate-900 dark:text-white font-medium text-sm">{editingUser.email}</p>
              </div>
              <div>
                <Label htmlFor="edit-user-name" className="text-slate-900 dark:text-slate-700 dark:text-navy-300">Nome</Label>
                <Input
                  id="edit-user-name"
                  value={editUserForm.name}
                  onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                  className="mt-1 bg-slate-100 dark:bg-navy-800 border border-navy-600 text-slate-900 dark:text-white placeholder:text-white/40"
                  placeholder="Nome completo do usuário"
                />
              </div>
              <div>
                <Label htmlFor="edit-user-phone" className="text-slate-900 dark:text-slate-700 dark:text-navy-300">Telefone</Label>
                <Input
                  id="edit-user-phone"
                  value={editUserForm.phone}
                  onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                  className="mt-1 bg-slate-100 dark:bg-navy-800 border border-navy-600 text-slate-900 dark:text-white placeholder:text-white/40"
                  placeholder="+55 11 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="edit-user-status" className="text-slate-900 dark:text-slate-700 dark:text-navy-300">Status</Label>
                <select
                  id="edit-user-status"
                  value={editUserForm.status}
                  onChange={(e) => setEditUserForm({ ...editUserForm, status: e.target.value })}
                  className="mt-1 w-full bg-slate-100 dark:bg-navy-800 border border-navy-600 text-slate-900 dark:text-white rounded-md px-3 py-2"
                >
                  <option value="active">Ativo - Pode acessar a plataforma</option>
                  <option value="inactive">Inativo - Não pode acessar</option>
                  <option value="suspended">Suspenso - Bloqueado temporariamente</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-user-tier" className="text-slate-900 dark:text-slate-700 dark:text-navy-300">Plano de Assinatura</Label>
                <select
                  id="edit-user-tier"
                  value={editUserForm.subscription_tier}
                  onChange={(e) => setEditUserForm({ ...editUserForm, subscription_tier: e.target.value })}
                  className="mt-1 w-full bg-slate-100 dark:bg-navy-800 border border-navy-600 text-slate-900 dark:text-white rounded-md px-3 py-2"
                >
                  <option value="free">Grátis - Recursos básicos</option>
                  <option value="paid">Pago - Recursos grátis + pagos</option>
                  <option value="premium">Premium - Recursos grátis + premium + pagos</option>
                  <option value="vip">VIP - Whitelabel + todos os recursos</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 border-navy-600 text-slate-900 dark:text-slate-700 dark:text-navy-300"
                onClick={() => {
                  setShowEditUserModal(false);
                  setEditingUser(null);
                  setEditUserForm({ name: "", phone: "", status: "active", subscription_tier: "free" });
                }}
                disabled={updatingUser}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-green-500 hover:bg-green-600 text-slate-900 dark:text-white"
                onClick={confirmEditUser}
                disabled={updatingUser}
              >
                {updatingUser ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Modal Deletar Usuário */}
      {showDeleteUserModal && deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-navy-900 rounded-xl border border-red-500/30 p-4 sm:p-6 w-full max-w-full sm:max-w-md"
          >
            <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Deletar Usuário
            </h3>
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 text-sm font-medium mb-2">⚠️ Ação Irreversível</p>
                <p className="text-slate-900 dark:text-slate-700 dark:text-navy-300 text-sm">
                  Esta ação não pode ser desfeita. Todos os dados do usuário serão permanentemente removidos,
                  incluindo todos os acessos a tenants.
                </p>
              </div>
              <div>
                <Label className="text-slate-900 dark:text-slate-700 dark:text-navy-300">Usuário a ser deletado</Label>
                <div className="mt-2 p-3 bg-slate-100 dark:bg-navy-800/50 border border-navy-700 rounded-lg">
                  <p className="text-slate-900 dark:text-white font-medium text-sm">{deletingUser.email}</p>
                  {deletingUser.name && (
                    <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-xs mt-1">{deletingUser.name}</p>
                  )}
                  {deletingUser.tenants.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-navy-700">
                      <p className="text-slate-900 dark:text-white/40 text-xs mb-1">Tenants com acesso:</p>
                      <div className="flex flex-wrap gap-1">
                        {deletingUser.tenants.map(t => (
                          <span key={t.code} className="px-2 py-0.5 rounded text-xs bg-white/10 text-slate-900 dark:text-white/60">
                            {t.code}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="confirm-delete-email" className="text-slate-900 dark:text-slate-700 dark:text-navy-300">
                  Digite o email do usuário para confirmar
                </Label>
                <Input
                  id="confirm-delete-email"
                  value={confirmDeleteText}
                  onChange={(e) => setConfirmDeleteText(e.target.value)}
                  className="mt-1 bg-slate-100 dark:bg-navy-800 border border-red-500/30 text-slate-900 dark:text-white placeholder:text-white/40"
                  placeholder={deletingUser.email}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                className="flex-1 border-navy-600 text-slate-900 dark:text-slate-700 dark:text-navy-300"
                onClick={() => {
                  setShowDeleteUserModal(false);
                  setDeletingUser(null);
                  setConfirmDeleteText("");
                }}
                disabled={deletingUserInProgress}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-slate-900 dark:text-white disabled:opacity-50"
                onClick={confirmDeleteUser}
                disabled={deletingUserInProgress || confirmDeleteText !== deletingUser.email}
              >
                {deletingUserInProgress ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Deletar Permanentemente
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
                <Label htmlFor="code" className="text-slate-900 dark:text-slate-700 dark:text-navy-300">
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
                <Label htmlFor="name" className="text-slate-900 dark:text-slate-700 dark:text-navy-300">
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
                <p className="text-slate-900 dark:text-slate-700 dark:text-navy-300 text-xs">
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
                <p className="text-slate-900 dark:text-slate-700 dark:text-navy-300 text-sm mb-4">
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
                  className="w-full border-navy-600 text-slate-900 dark:text-slate-700 dark:text-navy-300 hover:text-white"
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

