/**
 * Admin API Client
 *
 * Integrado com admin.service.ts (Agent 3)
 * Fallback para mock data quando backend não disponível
 */

import { fetchAPI, APIError } from './api';
import { adminService } from './services/admin.service';

// Modo desenvolvimento - DESABILITADO: sempre usar dados reais do banco D1
const DEV_MODE = false; // Forçado false - sempre usar API real
const USE_NEW_SERVICE_LAYER = process.env.NEXT_PUBLIC_USE_NEW_SERVICE_LAYER !== 'false'; // Flag para usar novo service layer (Agent 3) - padrão true

// ============================================
// TYPES
// ============================================

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  status?: string;
  subscription_tier?: string;
  created_at: string;
  last_access: string | null;
  tenants: Array<{ code: string; role: string }>;
}

export interface AdminTenant {
  id: string;
  code: string;
  name: string;
  status: string;
  created_at: string;
  user_count: number;
}

export interface PendingUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string;
}

export interface AdminAlert {
  id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, any> | null;
  severity: string;
  is_read: number;
  read_by: string | null;
  read_at: string | null;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  active_tenants: number;
  pending_users: number;
  unread_alerts: number;
}

// ============================================
// MOCK DATA (para desenvolvimento)
// ============================================

function getMockUsers(): AdminUser[] {
  // Tenta pegar usuário do Firebase (do localStorage) - apenas no cliente
  let currentUserEmail = 'ddd@dddd.com';
  let currentUserName = 'Usuário Teste';

  if (typeof window !== 'undefined') {
    try {
      const firebaseAuth = localStorage.getItem('firebase:authUser:AIzaSyB8QEhZF3jqKvJQxJ9kZ9vXWJ6hKzJ2Q3M:[DEFAULT]');
      if (firebaseAuth) {
        const userData = JSON.parse(firebaseAuth);
        currentUserEmail = userData.email || currentUserEmail;
        currentUserName = userData.displayName || userData.email?.split('@')[0] || currentUserName;
      }
    } catch (e) {
    }
  }

  return [
    {
      id: '1',
      email: currentUserEmail,
      name: currentUserName,
      phone: null,
      created_at: new Date().toISOString(),
      last_access: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutos atrás
      tenants: [
        { code: 'CLIENTE_01', role: 'admin' }
      ]
    },
    {
      id: '2',
      email: 'teste@example.com',
      name: 'Usuário Exemplo',
      phone: '+5511999998888',
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      last_access: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
      tenants: [
        { code: 'CLIENTE_01', role: 'viewer' }
      ]
    },
    {
      id: '4',
      email: 'usuario.sem.acesso@example.com',
      name: 'João Silva',
      phone: '+5511988776655',
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      last_access: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 dias atrás
      tenants: [] // Sem acesso a nenhum tenant
    },
    {
      id: '5',
      email: 'maria.santos@example.com',
      name: 'Maria Santos',
      phone: null,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      last_access: null, // Nunca acessou
      tenants: [] // Sem acesso a nenhum tenant
    }
  ];
}

function getMockTenants(): AdminTenant[] {
  return [
    {
      id: '1',
      code: 'CLIENTE_01',
      name: 'Cliente Principal',
      status: 'active',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      user_count: 2
    },
    {
      id: '2',
      code: 'CLIENTE_02',
      name: 'Cliente Secundário',
      status: 'active',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      user_count: 0
    }
  ];
}

function getMockPendingUsers(): PendingUser[] {
  return [
    {
      id: '3',
      email: 'pendente@example.com',
      name: 'Usuário Pendente',
      phone: '+5511988887777',
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
}

function getMockAlerts(): AdminAlert[] {
  return [
    {
      id: '1',
      type: 'new_user',
      title: 'Novo usuário cadastrado',
      message: 'Um novo usuário se registrou e aguarda liberação de acesso',
      data: { email: 'pendente@example.com', name: 'Usuário Pendente' },
      severity: 'info',
      is_read: 0,
      read_by: null,
      read_at: null,
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      type: 'new_lead',
      title: 'Nova lead capturada',
      message: 'Um visitante preencheu o formulário de contato',
      data: { email: 'lead@example.com', phone: '+5511977776666' },
      severity: 'success',
      is_read: 0,
      read_by: null,
      read_at: null,
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  ];
}

function getMockStats(): AdminStats {
  return {
    total_users: 4, // 2 com acesso + 2 sem acesso
    active_tenants: 2,
    pending_users: 1,
    unread_alerts: 2
  };
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Lista todos os usuarios
 */
export async function getAdminUsers(): Promise<{ users: AdminUser[] }> {
  // Sempre usa API real - sem fallback para mock
  if (USE_NEW_SERVICE_LAYER) {
    const users = await adminService.getUsers();
    // Converte formato do service layer para formato esperado pelo Admin Panel
    return {
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.displayName || null,
        phone: null, // Service layer não tem phone ainda
        created_at: u.createdAt,
        last_access: u.lastLoginAt || null,
        tenants: u.tenants?.map(t => ({
          code: t.tenantCode,
          role: t.accessLevel
        })) || []
      }))
    };
  }

  // Fallback: usar fetchAPI diretamente
  return fetchAPI('/api/admin/users');
}

/**
 * Lista todos os tenants
 */
export async function getAdminTenants(): Promise<{ tenants: AdminTenant[] }> {
  // Sempre usa API real - sem fallback para mock
  if (USE_NEW_SERVICE_LAYER) {
    const tenants = await adminService.getTenants();
    return {
      tenants: tenants.map(t => ({
        id: t.id,
        code: t.code,
        name: t.name,
        status: t.status,
        created_at: t.createdAt,
        user_count: t.stats?.totalUsers || 0
      }))
    };
  }

  // Fallback: usar fetchAPI diretamente
  return fetchAPI('/api/admin/tenants');
}

/**
 * Lista usuarios pendentes (sem acesso)
 */
export async function getPendingUsers(): Promise<{ pending_users: PendingUser[] }> {
  // Sempre usa API real - sem fallback para mock
  return fetchAPI('/api/admin/pending-users');
}

/**
 * Cria um novo tenant
 */
export async function createTenant(data: { code: string; name: string }): Promise<{ success: boolean; tenant: AdminTenant }> {
  if (USE_NEW_SERVICE_LAYER) {
    try {
      const tenant = await adminService.createTenant({
        code: data.code,
        name: data.name,
        type: 'company' // Default to company
      });
      return {
        success: true,
        tenant: {
          id: tenant.id,
          code: tenant.code,
          name: tenant.name,
          status: tenant.status,
          created_at: tenant.createdAt,
          user_count: 0
        }
      };
    } catch (error) {
      throw error;
    }
  }

  return fetchAPI('/api/admin/tenants', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Concede acesso a um usuario
 */
export async function grantAccess(data: {
  user_email: string;
  tenant_code: string;
  role: 'admin' | 'editor' | 'viewer';
  expires_at?: string;
}): Promise<{ success: boolean; message: string; action: string }> {
  if (USE_NEW_SERVICE_LAYER) {
    try {
      // Para usar grantAccess, precisamos do userId, não email
      // Por ora, vamos buscar o user pelo email primeiro
      const users = await adminService.getUsers();
      const user = users.find(u => u.email === data.user_email);

      if (!user) {
        throw new Error(`User with email ${data.user_email} not found`);
      }

      await adminService.grantAccess({
        userId: user.id,
        tenantCode: data.tenant_code,
        accessLevel: data.role
        // Note: expiresAt não está no GrantAccessRequest type - feature futura
      });

      return {
        success: true,
        message: `Access granted successfully to ${data.user_email}`,
        action: 'granted'
      };
    } catch (error) {
      throw error;
    }
  }

  return fetchAPI('/api/admin/grant-access', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Revoga acesso de um usuario
 */
export async function revokeAccess(data: {
  user_email: string;
  tenant_code: string;
}): Promise<{ success: boolean; message: string }> {
  if (USE_NEW_SERVICE_LAYER) {
    try {
      const users = await adminService.getUsers();
      const user = users.find(u => u.email === data.user_email);

      if (!user) {
        throw new Error(`User with email ${data.user_email} not found`);
      }

      await adminService.revokeAccess({
        userId: user.id,
        tenantCode: data.tenant_code
      });

      return {
        success: true,
        message: `Access revoked successfully from ${data.user_email}`
      };
    } catch (error) {
      throw error;
    }
  }

  const params = new URLSearchParams({
    user_email: data.user_email,
    tenant_code: data.tenant_code,
  });
  return fetchAPI(`/api/admin/revoke-access?${params}`, {
    method: 'DELETE',
  });
}

/**
 * Lista alertas do sistema
 */
export async function getAdminAlerts(showRead = false): Promise<{ alerts: AdminAlert[]; unread_count: number }> {
  // Sempre usa API real - sem fallback para mock
  if (USE_NEW_SERVICE_LAYER) {
    const response = await adminService.getAlerts({ unreadOnly: !showRead });
    const allAlerts = await adminService.getAlerts({ unreadOnly: false });

    return {
      alerts: response.alerts.map(a => ({
        id: a.id,
        type: a.category,
        title: a.title,
        message: a.message,
        data: a.metadata || null,
        severity: a.type,
        is_read: a.read ? 1 : 0,
        read_by: null,
        read_at: null,
        created_at: a.createdAt
      })),
      unread_count: allAlerts.alerts.filter(a => !a.read).length
    };
  }

  // Fallback: usar fetchAPI diretamente
  return fetchAPI(`/api/admin/alerts?show_read=${showRead}`);
}

/**
 * Marca um alerta como lido
 */
export async function markAlertAsRead(alertId: string): Promise<{ success: boolean }> {
  if (USE_NEW_SERVICE_LAYER) {
    try {
      await adminService.markAlertAsRead(alertId);
      return { success: true };
    } catch (error) {
      throw error;
    }
  }

  return fetchAPI(`/api/admin/alerts/${alertId}/read`, {
    method: 'POST',
  });
}

/**
 * Marca todos os alertas como lidos
 */
export async function markAllAlertsAsRead(): Promise<{ success: boolean; message: string }> {
  if (USE_NEW_SERVICE_LAYER) {
    try {
      await adminService.markAllAlertsAsRead();
      return { success: true, message: 'All alerts marked as read' };
    } catch (error) {
      throw error;
    }
  }

  return fetchAPI('/api/admin/alerts/read-all', {
    method: 'POST',
  });
}

/**
 * Retorna estatisticas do admin
 */
export async function getAdminStats(): Promise<AdminStats> {
  // Sempre usa API real - sem fallback para mock
  if (USE_NEW_SERVICE_LAYER) {
    const stats = await adminService.getStats();
    // Note: Precisa buscar alerts separadamente para contar unread
    const alertsResponse = await adminService.getAlerts({ unreadOnly: true }).catch(() => ({ alerts: [] }));

    return {
      total_users: stats.users.total,
      active_tenants: stats.tenants.active,
      pending_users: 0, // Service layer não trackeia pending users ainda
      unread_alerts: alertsResponse.alerts.length
    };
  }

  // Fallback: usar fetchAPI diretamente
  return fetchAPI('/api/admin/stats');
}

/**
 * Atualiza dados de um usuário
 */
export async function updateUser(userId: string, data: { name?: string; phone?: string; status?: string; subscription_tier?: string }): Promise<{ success: boolean; data: any }> {
  return fetchAPI(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Deleta um usuário permanentemente
 */
export async function deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
  return fetchAPI(`/api/admin/users/${userId}`, {
    method: 'DELETE',
  });
}

/**
 * Atualiza dados de um tenant
 */
export async function updateTenant(tenantCode: string, data: { name: string; status: string }): Promise<{ success: boolean; data: any }> {
  return fetchAPI(`/api/admin/tenants/${tenantCode}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * Lista logs de auditoria
 */
export async function getAuditLogs(filters?: {
  userId?: string;
  action?: string;
  entityType?: string;
  limit?: number;
  offset?: number;
}): Promise<{ success: boolean; data: { logs: any[]; pagination: any } }> {
  const params = new URLSearchParams();
  if (filters?.userId) params.set('userId', filters.userId);
  if (filters?.action) params.set('action', filters.action);
  if (filters?.entityType) params.set('entityType', filters.entityType);
  if (filters?.limit) params.set('limit', filters.limit.toString());
  if (filters?.offset) params.set('offset', filters.offset.toString());

  const query = params.toString();
  return fetchAPI(`/api/admin/audit-logs${query ? `?${query}` : ''}`);
}

// ============================================
// INVESTIGATIONS (ADMIN GLOBAL VIEW)
// ============================================

/**
 * Lista TODAS as investigações de TODOS os usuários (apenas admin)
 */
export async function getAdminInvestigacoes(filters?: {
  status?: string;
  categoria?: string;
  busca?: string;
  limit?: number;
  offset?: number;
}): Promise<{ success: boolean; investigacoes: any[]; pagination: any }> {
  const params = new URLSearchParams();
  if (filters?.status) params.set('status', filters.status);
  if (filters?.categoria) params.set('categoria', filters.categoria);
  if (filters?.busca) params.set('busca', filters.busca);
  if (filters?.limit) params.set('limit', filters.limit.toString());
  if (filters?.offset) params.set('offset', filters.offset.toString());

  const query = params.toString();
  return fetchAPI(`/api/admin/investigacoes${query ? `?${query}` : ''}`);
}

/**
 * Estatísticas GLOBAIS de todas as investigações (apenas admin)
 */
export async function getAdminInvestigacoesStats(): Promise<{ success: boolean; stats: any }> {
  return fetchAPI('/api/admin/investigacoes/stats');
}

/**
 * Dashboard global com visão de todas as investigações (apenas admin)
 */
export async function getAdminDashboard(): Promise<{ success: boolean; data: any }> {
  return fetchAPI('/api/admin/dashboard');
}
