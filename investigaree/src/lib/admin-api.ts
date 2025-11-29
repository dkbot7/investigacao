/**
 * Admin API Client
 */

import { fetchAPI } from './api';

// ============================================
// TYPES
// ============================================

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string;
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
// API FUNCTIONS
// ============================================

/**
 * Lista todos os usuarios
 */
export async function getAdminUsers(): Promise<{ users: AdminUser[] }> {
  return fetchAPI('/api/admin/users');
}

/**
 * Lista todos os tenants
 */
export async function getAdminTenants(): Promise<{ tenants: AdminTenant[] }> {
  return fetchAPI('/api/admin/tenants');
}

/**
 * Lista usuarios pendentes (sem acesso)
 */
export async function getPendingUsers(): Promise<{ pending_users: PendingUser[] }> {
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
  return fetchAPI('/api/admin/stats');
}
