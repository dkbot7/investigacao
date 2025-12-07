/**
 * Admin API Client
 */

import { fetchAPI, APIError } from './api';

// Modo desenvolvimento - usa dados mock quando API não está disponível
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true' || true; // Sempre true por padrão

// ============================================
// TYPES
// ============================================

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
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
      console.log('Não conseguiu pegar dados do Firebase, usando mock padrão');
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
  if (DEV_MODE) {
    try {
      return await fetchAPI('/api/admin/users');
    } catch (error) {
      // Captura qualquer erro de rede, autenticação ou 404/500
      console.log('[Admin API] Backend não disponível, usando dados mock', error);
      return { users: getMockUsers() };
    }
  }
  return fetchAPI('/api/admin/users');
}

/**
 * Lista todos os tenants
 */
export async function getAdminTenants(): Promise<{ tenants: AdminTenant[] }> {
  if (DEV_MODE) {
    try {
      return await fetchAPI('/api/admin/tenants');
    } catch (error) {
      console.log('[Admin API] Backend não disponível, usando dados mock', error);
      return { tenants: getMockTenants() };
    }
  }
  return fetchAPI('/api/admin/tenants');
}

/**
 * Lista usuarios pendentes (sem acesso)
 */
export async function getPendingUsers(): Promise<{ pending_users: PendingUser[] }> {
  if (DEV_MODE) {
    try {
      return await fetchAPI('/api/admin/pending-users');
    } catch (error) {
      console.log('[Admin API] Backend não disponível, usando dados mock', error);
      return { pending_users: getMockPendingUsers() };
    }
  }
  return fetchAPI('/api/admin/pending-users');
}

/**
 * Cria um novo tenant
 */
export async function createTenant(data: { code: string; name: string }): Promise<{ success: boolean; tenant: AdminTenant }> {
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
  if (DEV_MODE) {
    try {
      return await fetchAPI(`/api/admin/alerts?show_read=${showRead}`);
    } catch (error) {
      console.log('[Admin API] Backend não disponível, usando dados mock', error);
      const alerts = getMockAlerts();
      const unread_count = alerts.filter(a => !a.is_read).length;
      return { alerts, unread_count };
    }
  }
  return fetchAPI(`/api/admin/alerts?show_read=${showRead}`);
}

/**
 * Marca um alerta como lido
 */
export async function markAlertAsRead(alertId: string): Promise<{ success: boolean }> {
  return fetchAPI(`/api/admin/alerts/${alertId}/read`, {
    method: 'POST',
  });
}

/**
 * Marca todos os alertas como lidos
 */
export async function markAllAlertsAsRead(): Promise<{ success: boolean; message: string }> {
  return fetchAPI('/api/admin/alerts/read-all', {
    method: 'POST',
  });
}

/**
 * Retorna estatisticas do admin
 */
export async function getAdminStats(): Promise<AdminStats> {
  if (DEV_MODE) {
    try {
      return await fetchAPI('/api/admin/stats');
    } catch (error) {
      console.log('[Admin API] Backend não disponível, usando dados mock', error);
      return getMockStats();
    }
  }
  return fetchAPI('/api/admin/stats');
}
