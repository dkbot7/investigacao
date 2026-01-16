/**
 * Admin Panel Types
 *
 * Types para o painel administrativo
 */

// ============================================
// User Management
// ============================================

export interface AdminUser {
  id: string
  uid: string // Firebase UID
  email: string
  displayName: string
  photoURL?: string
  emailVerified: boolean
  disabled: boolean
  createdAt: string
  lastLoginAt?: string
  role: 'superadmin' | 'admin' | 'user' | 'viewer'
  tenants: TenantAccess[]
  metadata?: {
    lastIp?: string
    loginCount?: number
  }
}

export interface TenantAccess {
  tenantCode: string
  tenantName: string
  accessLevel: 'owner' | 'admin' | 'editor' | 'viewer'
  grantedAt: string
  grantedBy?: string
}

export interface CreateUserRequest {
  email: string
  displayName: string
  password?: string
  role?: string
  sendEmailInvite?: boolean
}

export interface UpdateUserRequest {
  displayName?: string
  email?: string
  photoURL?: string
  disabled?: boolean
  role?: string
}

// ============================================
// Tenant Management
// ============================================

export interface Tenant {
  id: string
  code: string // Unique code (e.g., 'COREM', 'PMV')
  name: string // Display name
  type: 'government' | 'company' | 'individual'
  status: 'active' | 'suspended' | 'inactive'
  cnpj?: string
  createdAt: string
  updatedAt: string
  settings: TenantSettings
  subscription?: TenantSubscription
  stats?: TenantStats
}

export interface TenantSettings {
  maxUsers?: number
  maxInvestigations?: number
  features: {
    serpro_cpf?: boolean
    serpro_cnpj?: boolean
    serpro_divida?: boolean
    serpro_renda?: boolean
    serpro_faturamento?: boolean
    datavalid?: boolean
    pdf_reports?: boolean
    csv_export?: boolean
    batch_processing?: boolean
  }
  notifications: {
    email?: boolean
    sms?: boolean
    webhook_url?: string
  }
}

export interface TenantSubscription {
  plan: 'free' | 'basic' | 'professional' | 'enterprise'
  status: 'active' | 'trial' | 'expired' | 'cancelled'
  startDate: string
  endDate?: string
  apiCallsLimit: number
  apiCallsUsed: number
}

export interface TenantStats {
  totalUsers: number
  totalInvestigations: number
  totalApiCalls: number
  lastActivityAt?: string
}

export interface CreateTenantRequest {
  code: string
  name: string
  type: 'government' | 'company' | 'individual'
  cnpj?: string
  ownerEmail?: string
}

export interface UpdateTenantRequest {
  name?: string
  status?: string
  settings?: Partial<TenantSettings>
}

// ============================================
// Access Control
// ============================================

export interface GrantAccessRequest {
  userId: string
  tenantCode: string
  accessLevel: 'owner' | 'admin' | 'editor' | 'viewer'
}

export interface RevokeAccessRequest {
  userId: string
  tenantCode: string
}

export interface AccessControlEntry {
  userId: string
  userName: string
  userEmail: string
  tenantCode: string
  tenantName: string
  accessLevel: string
  grantedAt: string
  grantedBy?: string
  grantedByEmail?: string
}

// ============================================
// Alerts & Notifications
// ============================================

export interface Alert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  category: 'system' | 'security' | 'billing' | 'investigation' | 'data'
  title: string
  message: string
  metadata?: Record<string, any>
  tenantCode?: string
  userId?: string
  read: boolean
  createdAt: string
  expiresAt?: string
}

export interface CreateAlertRequest {
  type: 'info' | 'warning' | 'error' | 'success'
  category: string
  title: string
  message: string
  metadata?: Record<string, any>
  tenantCode?: string
  userId?: string
  expiresAt?: string
}

export interface AlertsResponse {
  alerts: Alert[]
  unreadCount: number
  totalCount: number
}

// ============================================
// Audit Logs
// ============================================

export interface AuditLog {
  id: string
  timestamp: string
  userId: string
  userEmail: string
  tenantCode?: string
  action: string
  resource: string
  resourceId?: string
  method?: string
  endpoint?: string
  statusCode?: number
  ipAddress?: string
  userAgent?: string
  changes?: {
    before?: Record<string, any>
    after?: Record<string, any>
  }
  metadata?: Record<string, any>
}

export interface AuditLogsFilters {
  userId?: string
  tenantCode?: string
  action?: string
  resource?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface AuditLogsResponse {
  logs: AuditLog[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ============================================
// Statistics & Metrics
// ============================================

export interface AdminStats {
  users: {
    total: number
    active: number
    inactive: number
    verified: number
    byRole: Record<string, number>
  }
  tenants: {
    total: number
    active: number
    suspended: number
    byType: Record<string, number>
  }
  apiCalls: {
    today: number
    thisWeek: number
    thisMonth: number
    byEndpoint: Array<{
      endpoint: string
      count: number
    }>
  }
  investigations: {
    total: number
    pending: number
    completed: number
    failed: number
  }
  system: {
    uptime: number
    version: string
    lastDeployment?: string
  }
}

export interface UsageMetrics {
  date: string
  apiCalls: number
  users: number
  investigations: number
  costs?: number
}

// ============================================
// System Configuration
// ============================================

export interface SystemConfig {
  maintenance: {
    enabled: boolean
    message?: string
    scheduledStart?: string
    scheduledEnd?: string
  }
  features: {
    registration: boolean
    inviteOnly: boolean
    emailVerificationRequired: boolean
  }
  limits: {
    maxTenantsPerUser: number
    maxUsersPerTenant: number
    maxInvestigationsPerUser: number
    maxApiCallsPerDay: number
  }
  serpro: {
    enabled: boolean
    baseUrl: string
    rateLimit: number
  }
}

// ============================================
// Response Wrappers
// ============================================

export interface AdminApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: {
    code: string
    message: string
    details?: any
  }
  timestamp: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
