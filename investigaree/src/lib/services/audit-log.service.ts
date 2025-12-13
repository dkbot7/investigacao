/**
 * Audit Log Service - LGPD Compliance
 *
 * Serviço para registrar e consultar logs de auditoria
 * Conforme Art. 37 e Art. 48 da LGPD
 */

import { fetchAPI } from '@/lib/api'

export type AuditAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'EXPORT'
  | 'SHARE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'SEARCH'
  | 'DOWNLOAD'
  | 'PRINT'

export type AuditSeverity = 'info' | 'warning' | 'critical'

export type AuditStatus = 'pending' | 'completed' | 'failed'

export type LegalBasis =
  | 'consentimento'
  | 'contrato'
  | 'legitimo_interesse'
  | 'obrigacao_legal'
  | 'protecao_vida'
  | 'tutela_saude'
  | 'interesse_publico'
  | 'estudos_pesquisa'
  | 'exercicio_direitos'
  | 'protecao_credito'

export interface AuditLogEntry {
  id?: number
  user_id?: string
  tenant_id?: string
  action: AuditAction
  entity_type: string // 'investigation', 'user', 'report', etc
  entity_id?: string
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
  severity?: AuditSeverity
  status?: AuditStatus
  data_subject?: string // CPF/CNPJ do titular dos dados
  legal_basis?: LegalBasis
  retention_until?: number
  geolocation?: string
  session_id?: string
  created_at?: string
}

export interface AuditLogFilters {
  action?: AuditAction
  entity_type?: string
  severity?: AuditSeverity
  data_subject?: string
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}

export interface AuditLogStats {
  total: number
  recent_24h: number
  by_action: Array<{ action: string; count: number }>
  by_severity: Array<{ severity: string; count: number }>
  by_entity: Array<{ entity_type: string; count: number }>
}

// ============================================
// Audit Log Service Class
// ============================================

export class AuditLogService {
  private sessionId: string

  constructor() {
    // Gera um session ID único para o usuário
    this.sessionId =
      sessionStorage.getItem('audit_session_id') ||
      this.generateSessionId()
    sessionStorage.setItem('audit_session_id', this.sessionId)
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Registra um log de auditoria
   */
  async log(entry: Omit<AuditLogEntry, 'session_id'>): Promise<void> {
    try {
      await fetchAPI('/api/audit-logs', {
        method: 'POST',
        body: JSON.stringify({
          ...entry,
          session_id: this.sessionId,
          severity: entry.severity || 'info',
          status: entry.status || 'completed',
        }),
      })
    } catch (error) {
      console.error('[AuditLog] Erro ao registrar log:', error)
      // Não lança exceção para não interromper o fluxo da aplicação
    }
  }

  /**
   * Registra ação de criação
   */
  async logCreate(
    entity_type: string,
    entity_id: string,
    metadata?: Record<string, any>,
    data_subject?: string,
    legal_basis?: LegalBasis
  ): Promise<void> {
    return this.log({
      action: 'CREATE',
      entity_type,
      entity_id,
      metadata,
      data_subject,
      legal_basis,
      severity: 'info',
    })
  }

  /**
   * Registra ação de leitura (acesso a dados sensíveis)
   */
  async logRead(
    entity_type: string,
    entity_id: string,
    metadata?: Record<string, any>,
    data_subject?: string,
    legal_basis?: LegalBasis
  ): Promise<void> {
    return this.log({
      action: 'READ',
      entity_type,
      entity_id,
      metadata,
      data_subject,
      legal_basis,
      severity: 'info',
    })
  }

  /**
   * Registra ação de atualização
   */
  async logUpdate(
    entity_type: string,
    entity_id: string,
    metadata?: Record<string, any>,
    data_subject?: string,
    legal_basis?: LegalBasis
  ): Promise<void> {
    return this.log({
      action: 'UPDATE',
      entity_type,
      entity_id,
      metadata,
      data_subject,
      legal_basis,
      severity: 'info',
    })
  }

  /**
   * Registra ação de exclusão (CRÍTICA para LGPD)
   */
  async logDelete(
    entity_type: string,
    entity_id: string,
    metadata?: Record<string, any>,
    data_subject?: string
  ): Promise<void> {
    return this.log({
      action: 'DELETE',
      entity_type,
      entity_id,
      metadata,
      data_subject,
      severity: 'critical', // Exclusão é sempre crítica
    })
  }

  /**
   * Registra ação de exportação (CRÍTICA para LGPD)
   */
  async logExport(
    entity_type: string,
    format: string,
    metadata?: Record<string, any>,
    data_subject?: string,
    legal_basis?: LegalBasis
  ): Promise<void> {
    return this.log({
      action: 'EXPORT',
      entity_type,
      metadata: { ...metadata, format },
      data_subject,
      legal_basis,
      severity: 'critical', // Exportação é sempre crítica
    })
  }

  /**
   * Registra ação de compartilhamento
   */
  async logShare(
    entity_type: string,
    entity_id: string,
    metadata?: Record<string, any>,
    data_subject?: string,
    legal_basis?: LegalBasis
  ): Promise<void> {
    return this.log({
      action: 'SHARE',
      entity_type,
      entity_id,
      metadata,
      data_subject,
      legal_basis,
      severity: 'warning',
    })
  }

  /**
   * Registra login
   */
  async logLogin(metadata?: Record<string, any>): Promise<void> {
    return this.log({
      action: 'LOGIN',
      entity_type: 'auth',
      metadata,
      severity: 'info',
    })
  }

  /**
   * Registra logout
   */
  async logLogout(metadata?: Record<string, any>): Promise<void> {
    return this.log({
      action: 'LOGOUT',
      entity_type: 'auth',
      metadata,
      severity: 'info',
    })
  }

  /**
   * Registra pesquisa/busca
   */
  async logSearch(
    query: string,
    entity_type: string,
    results_count?: number
  ): Promise<void> {
    return this.log({
      action: 'SEARCH',
      entity_type,
      metadata: {
        query,
        results_count,
      },
      severity: 'info',
    })
  }

  /**
   * Lista logs de auditoria com filtros
   */
  async getLogs(
    filters?: AuditLogFilters
  ): Promise<{ logs: AuditLogEntry[]; total: number; limit: number; offset: number }> {
    const params = new URLSearchParams()

    if (filters?.action) params.set('action', filters.action)
    if (filters?.entity_type) params.set('entity_type', filters.entity_type)
    if (filters?.severity) params.set('severity', filters.severity)
    if (filters?.data_subject) params.set('data_subject', filters.data_subject)
    if (filters?.start_date) params.set('start_date', filters.start_date)
    if (filters?.end_date) params.set('end_date', filters.end_date)
    if (filters?.limit) params.set('limit', filters.limit.toString())
    if (filters?.offset) params.set('offset', filters.offset.toString())

    const query = params.toString()
    return fetchAPI(`/api/audit-logs${query ? `?${query}` : ''}`)
  }

  /**
   * Busca estatísticas dos logs
   */
  async getStats(): Promise<AuditLogStats> {
    return fetchAPI('/api/audit-logs/stats')
  }

  /**
   * Limpa logs expirados (apenas admin)
   */
  async cleanup(): Promise<{ success: boolean; deleted: number }> {
    return fetchAPI('/api/audit-logs/cleanup', {
      method: 'DELETE',
    })
  }
}

/**
 * Singleton instance
 */
export const auditLogService = new AuditLogService()
