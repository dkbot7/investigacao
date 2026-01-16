/**
 * Tenants Types
 *
 * Tipos TypeScript para gerenciamento de tenants (multi-tenancy)
 * Integração com endpoints do Agent 2
 */

/**
 * Status do tenant
 */
export type TenantStatus = 'active' | 'inactive'

/**
 * Role do usuário no tenant
 */
export type TenantRole = 'admin' | 'editor' | 'viewer'

/**
 * Tenant (entidade completa)
 */
export interface Tenant {
  id: number
  code: string
  name: string
  email: string
  config?: Record<string, any>
  status: TenantStatus
  created_at: string
  updated_at: string
}

/**
 * Request para criar tenant (admin only)
 */
export interface CreateTenantRequest {
  code: string
  name: string
  email: string
  config?: Record<string, any>
  status?: TenantStatus
}

/**
 * Request para atualizar tenant (admin only)
 */
export interface UpdateTenantRequest {
  code?: string
  name?: string
  email?: string
  config?: Record<string, any>
  status?: TenantStatus
}

/**
 * Response de criar/buscar tenant
 */
export interface TenantApiResponse {
  success: boolean
  tenant: Tenant
}

/**
 * Response de listar tenants
 */
export interface ListTenantsResponse {
  success: boolean
  tenants: Tenant[]
  total: number
  limit: number
  offset: number
}

/**
 * Filtros para listar tenants
 */
export interface ListTenantsFilters {
  status?: TenantStatus
  limit?: number
  offset?: number
}

/**
 * Request para conceder acesso a um usuário (admin only)
 */
export interface GrantAccessRequest {
  user_email: string
  role: TenantRole
}

/**
 * Request para revogar acesso de um usuário (admin only)
 */
export interface RevokeAccessRequest {
  user_email: string
}

/**
 * Response genérica de sucesso com mensagem
 */
export interface SuccessMessageResponse {
  success: boolean
  message: string
}
