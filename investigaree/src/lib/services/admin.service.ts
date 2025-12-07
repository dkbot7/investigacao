/**
 * Admin Service
 *
 * Service layer para operações administrativas
 * Endpoints: Users, Tenants, Access Control, Alerts, Audit Logs, Statistics
 */

import { apiClient } from '../api-client'
import type {
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
  Tenant,
  CreateTenantRequest,
  UpdateTenantRequest,
  GrantAccessRequest,
  RevokeAccessRequest,
  AccessControlEntry,
  Alert,
  CreateAlertRequest,
  AlertsResponse,
  AuditLog,
  AuditLogsFilters,
  AuditLogsResponse,
  AdminStats,
  UsageMetrics,
  SystemConfig,
  AdminApiResponse,
  PaginatedResponse,
} from '../types/admin.types'

/**
 * Admin Service Class
 */
export class AdminService {
  // ============================================
  // User Management
  // ============================================

  /**
   * Lista todos os usuários
   */
  async getUsers(): Promise<AdminUser[]> {
    const response = await apiClient.get<AdminApiResponse<{ users: AdminUser[] }>>(
      '/api/admin/users'
    )
    return response.data.users
  }

  /**
   * Busca um usuário por ID
   */
  async getUserById(userId: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminApiResponse<AdminUser>>(
      `/api/admin/users/${userId}`
    )
    return response.data
  }

  /**
   * Cria um novo usuário
   */
  async createUser(userData: CreateUserRequest): Promise<AdminUser> {
    const response = await apiClient.post<AdminApiResponse<AdminUser>>(
      '/api/admin/users',
      userData
    )
    return response.data
  }

  /**
   * Atualiza um usuário existente
   */
  async updateUser(userId: string, userData: UpdateUserRequest): Promise<AdminUser> {
    const response = await apiClient.patch<AdminApiResponse<AdminUser>>(
      `/api/admin/users/${userId}`,
      userData
    )
    return response.data
  }

  /**
   * Deleta um usuário
   */
  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete<AdminApiResponse<void>>(`/api/admin/users/${userId}`)
  }

  /**
   * Desabilita um usuário
   */
  async disableUser(userId: string): Promise<AdminUser> {
    return this.updateUser(userId, { disabled: true })
  }

  /**
   * Habilita um usuário
   */
  async enableUser(userId: string): Promise<AdminUser> {
    return this.updateUser(userId, { disabled: false })
  }

  // ============================================
  // Tenant Management
  // ============================================

  /**
   * Lista todos os tenants
   */
  async getTenants(): Promise<Tenant[]> {
    const response = await apiClient.get<AdminApiResponse<{ tenants: Tenant[] }>>(
      '/api/admin/tenants'
    )
    return response.data.tenants
  }

  /**
   * Busca um tenant por código
   */
  async getTenantByCode(tenantCode: string): Promise<Tenant> {
    const response = await apiClient.get<AdminApiResponse<Tenant>>(
      `/api/admin/tenants/${tenantCode}`
    )
    return response.data
  }

  /**
   * Cria um novo tenant
   */
  async createTenant(tenantData: CreateTenantRequest): Promise<Tenant> {
    const response = await apiClient.post<AdminApiResponse<Tenant>>(
      '/api/admin/tenants',
      tenantData
    )
    return response.data
  }

  /**
   * Atualiza um tenant existente
   */
  async updateTenant(tenantCode: string, tenantData: UpdateTenantRequest): Promise<Tenant> {
    const response = await apiClient.patch<AdminApiResponse<Tenant>>(
      `/api/admin/tenants/${tenantCode}`,
      tenantData
    )
    return response.data
  }

  /**
   * Deleta um tenant
   */
  async deleteTenant(tenantCode: string): Promise<void> {
    await apiClient.delete<AdminApiResponse<void>>(`/api/admin/tenants/${tenantCode}`)
  }

  /**
   * Suspende um tenant
   */
  async suspendTenant(tenantCode: string): Promise<Tenant> {
    return this.updateTenant(tenantCode, { status: 'suspended' })
  }

  /**
   * Ativa um tenant suspenso
   */
  async activateTenant(tenantCode: string): Promise<Tenant> {
    return this.updateTenant(tenantCode, { status: 'active' })
  }

  // ============================================
  // Access Control
  // ============================================

  /**
   * Concede acesso de um usuário a um tenant
   */
  async grantAccess(data: GrantAccessRequest): Promise<void> {
    await apiClient.post<AdminApiResponse<void>>('/api/admin/grant-access', data)
  }

  /**
   * Revoga acesso de um usuário a um tenant
   */
  async revokeAccess(data: RevokeAccessRequest): Promise<void> {
    const params = new URLSearchParams({
      userId: data.userId,
      tenantCode: data.tenantCode,
    })
    await apiClient.delete<AdminApiResponse<void>>(
      `/api/admin/revoke-access?${params.toString()}`
    )
  }

  /**
   * Lista todos os acessos (matriz usuário x tenant)
   */
  async getAccessControl(): Promise<AccessControlEntry[]> {
    const response = await apiClient.get<AdminApiResponse<{ entries: AccessControlEntry[] }>>(
      '/api/admin/access-control'
    )
    return response.data.entries
  }

  /**
   * Lista acessos de um usuário específico
   */
  async getUserAccess(userId: string): Promise<AccessControlEntry[]> {
    const response = await apiClient.get<AdminApiResponse<{ entries: AccessControlEntry[] }>>(
      `/api/admin/users/${userId}/access`
    )
    return response.data.entries
  }

  /**
   * Lista usuários com acesso a um tenant específico
   */
  async getTenantUsers(tenantCode: string): Promise<AccessControlEntry[]> {
    const response = await apiClient.get<AdminApiResponse<{ entries: AccessControlEntry[] }>>(
      `/api/admin/tenants/${tenantCode}/users`
    )
    return response.data.entries
  }

  // ============================================
  // Alerts & Notifications
  // ============================================

  /**
   * Lista todos os alertas
   */
  async getAlerts(filters?: { unreadOnly?: boolean; category?: string }): Promise<AlertsResponse> {
    const params = new URLSearchParams()
    if (filters?.unreadOnly) params.set('unreadOnly', 'true')
    if (filters?.category) params.set('category', filters.category)

    const query = params.toString()
    const response = await apiClient.get<AdminApiResponse<AlertsResponse>>(
      `/api/admin/alerts${query ? `?${query}` : ''}`
    )
    return response.data
  }

  /**
   * Busca um alerta por ID
   */
  async getAlertById(alertId: string): Promise<Alert> {
    const response = await apiClient.get<AdminApiResponse<Alert>>(`/api/admin/alerts/${alertId}`)
    return response.data
  }

  /**
   * Cria um novo alerta
   */
  async createAlert(alertData: CreateAlertRequest): Promise<Alert> {
    const response = await apiClient.post<AdminApiResponse<Alert>>(
      '/api/admin/alerts',
      alertData
    )
    return response.data
  }

  /**
   * Marca um alerta como lido
   */
  async markAlertAsRead(alertId: string): Promise<void> {
    await apiClient.post<AdminApiResponse<void>>(`/api/admin/alerts/${alertId}/read`, {})
  }

  /**
   * Marca todos os alertas como lidos
   */
  async markAllAlertsAsRead(): Promise<void> {
    await apiClient.post<AdminApiResponse<void>>('/api/admin/alerts/read-all', {})
  }

  /**
   * Deleta um alerta
   */
  async deleteAlert(alertId: string): Promise<void> {
    await apiClient.delete<AdminApiResponse<void>>(`/api/admin/alerts/${alertId}`)
  }

  // ============================================
  // Audit Logs
  // ============================================

  /**
   * Lista logs de auditoria com filtros
   */
  async getAuditLogs(filters?: AuditLogsFilters): Promise<AuditLogsResponse> {
    const params = new URLSearchParams()

    if (filters?.userId) params.set('userId', filters.userId)
    if (filters?.tenantCode) params.set('tenantCode', filters.tenantCode)
    if (filters?.action) params.set('action', filters.action)
    if (filters?.resource) params.set('resource', filters.resource)
    if (filters?.startDate) params.set('startDate', filters.startDate)
    if (filters?.endDate) params.set('endDate', filters.endDate)
    if (filters?.page) params.set('page', filters.page.toString())
    if (filters?.limit) params.set('limit', filters.limit.toString())

    const query = params.toString()
    const response = await apiClient.get<AdminApiResponse<AuditLogsResponse>>(
      `/api/admin/audit-logs${query ? `?${query}` : ''}`
    )
    return response.data
  }

  /**
   * Busca um log de auditoria específico
   */
  async getAuditLogById(logId: string): Promise<AuditLog> {
    const response = await apiClient.get<AdminApiResponse<AuditLog>>(
      `/api/admin/audit-logs/${logId}`
    )
    return response.data
  }

  /**
   * Exporta logs de auditoria em CSV
   */
  async exportAuditLogs(filters?: AuditLogsFilters): Promise<Blob> {
    const params = new URLSearchParams()

    if (filters?.userId) params.set('userId', filters.userId)
    if (filters?.tenantCode) params.set('tenantCode', filters.tenantCode)
    if (filters?.action) params.set('action', filters.action)
    if (filters?.resource) params.set('resource', filters.resource)
    if (filters?.startDate) params.set('startDate', filters.startDate)
    if (filters?.endDate) params.set('endDate', filters.endDate)

    const query = params.toString()
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/audit-logs/export${query ? `?${query}` : ''}`,
      {
        headers: {
          Authorization: `Bearer ${await apiClient['getAuthToken']()}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao exportar logs')
    }

    return response.blob()
  }

  // ============================================
  // Statistics & Metrics
  // ============================================

  /**
   * Busca estatísticas gerais do sistema
   */
  async getStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminApiResponse<AdminStats>>('/api/admin/stats')
    return response.data
  }

  /**
   * Busca métricas de uso por período
   */
  async getUsageMetrics(params?: {
    startDate?: string
    endDate?: string
    granularity?: 'day' | 'week' | 'month'
  }): Promise<UsageMetrics[]> {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)
    if (params?.granularity) searchParams.set('granularity', params.granularity)

    const query = searchParams.toString()
    const response = await apiClient.get<AdminApiResponse<{ metrics: UsageMetrics[] }>>(
      `/api/admin/metrics${query ? `?${query}` : ''}`
    )
    return response.data.metrics
  }

  /**
   * Busca estatísticas de um tenant específico
   */
  async getTenantStats(tenantCode: string): Promise<any> {
    const response = await apiClient.get<AdminApiResponse<any>>(
      `/api/admin/tenants/${tenantCode}/stats`
    )
    return response.data
  }

  /**
   * Busca estatísticas de um usuário específico
   */
  async getUserStats(userId: string): Promise<any> {
    const response = await apiClient.get<AdminApiResponse<any>>(
      `/api/admin/users/${userId}/stats`
    )
    return response.data
  }

  // ============================================
  // System Configuration
  // ============================================

  /**
   * Busca configuração do sistema
   */
  async getSystemConfig(): Promise<SystemConfig> {
    const response = await apiClient.get<AdminApiResponse<SystemConfig>>('/api/admin/config')
    return response.data
  }

  /**
   * Atualiza configuração do sistema
   */
  async updateSystemConfig(config: Partial<SystemConfig>): Promise<SystemConfig> {
    const response = await apiClient.patch<AdminApiResponse<SystemConfig>>(
      '/api/admin/config',
      config
    )
    return response.data
  }

  /**
   * Habilita modo de manutenção
   */
  async enableMaintenanceMode(message?: string): Promise<void> {
    await this.updateSystemConfig({
      maintenance: {
        enabled: true,
        message: message || 'Sistema em manutenção. Voltamos em breve.',
      },
    })
  }

  /**
   * Desabilita modo de manutenção
   */
  async disableMaintenanceMode(): Promise<void> {
    await this.updateSystemConfig({
      maintenance: {
        enabled: false,
      },
    })
  }

  // ============================================
  // Bulk Operations
  // ============================================

  /**
   * Importa múltiplos usuários em lote
   */
  async importUsers(users: CreateUserRequest[]): Promise<{ success: number; failed: number }> {
    const response = await apiClient.post<
      AdminApiResponse<{ success: number; failed: number }>
    >('/api/admin/users/import', { users })
    return response.data
  }

  /**
   * Exporta lista de usuários em CSV
   */
  async exportUsers(): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/export`, {
      headers: {
        Authorization: `Bearer ${await apiClient['getAuthToken']()}`,
      },
    })

    if (!response.ok) {
      throw new Error('Erro ao exportar usuários')
    }

    return response.blob()
  }

  /**
   * Exporta lista de tenants em CSV
   */
  async exportTenants(): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/tenants/export`, {
      headers: {
        Authorization: `Bearer ${await apiClient['getAuthToken']()}`,
      },
    })

    if (!response.ok) {
      throw new Error('Erro ao exportar tenants')
    }

    return response.blob()
  }
}

/**
 * Singleton instance
 */
export const adminService = new AdminService()
