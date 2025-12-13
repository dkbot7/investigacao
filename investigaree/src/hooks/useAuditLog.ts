/**
 * useAuditLog Hook
 *
 * Hook React para facilitar registro de audit logs
 */

'use client'

import { useCallback, useState, useEffect } from 'react'
import {
  auditLogService,
  type AuditAction,
  type AuditLogEntry,
  type AuditLogFilters,
  type LegalBasis,
} from '@/lib/services/audit-log.service'
import { useAuth } from '@/contexts/AuthContext'

export function useAuditLog() {
  const { user } = useAuth()

  /**
   * Registra um log genérico
   */
  const log = useCallback(
    async (entry: Omit<AuditLogEntry, 'user_id' | 'session_id'>) => {
      if (!user) return
      await auditLogService.log(entry)
    },
    [user]
  )

  /**
   * Registra criação
   */
  const logCreate = useCallback(
    async (
      entity_type: string,
      entity_id: string,
      metadata?: Record<string, any>,
      data_subject?: string,
      legal_basis?: LegalBasis
    ) => {
      if (!user) return
      await auditLogService.logCreate(
        entity_type,
        entity_id,
        metadata,
        data_subject,
        legal_basis
      )
    },
    [user]
  )

  /**
   * Registra leitura de dados sensíveis
   */
  const logRead = useCallback(
    async (
      entity_type: string,
      entity_id: string,
      metadata?: Record<string, any>,
      data_subject?: string,
      legal_basis?: LegalBasis
    ) => {
      if (!user) return
      await auditLogService.logRead(
        entity_type,
        entity_id,
        metadata,
        data_subject,
        legal_basis
      )
    },
    [user]
  )

  /**
   * Registra atualização
   */
  const logUpdate = useCallback(
    async (
      entity_type: string,
      entity_id: string,
      metadata?: Record<string, any>,
      data_subject?: string,
      legal_basis?: LegalBasis
    ) => {
      if (!user) return
      await auditLogService.logUpdate(
        entity_type,
        entity_id,
        metadata,
        data_subject,
        legal_basis
      )
    },
    [user]
  )

  /**
   * Registra exclusão (CRÍTICO)
   */
  const logDelete = useCallback(
    async (
      entity_type: string,
      entity_id: string,
      metadata?: Record<string, any>,
      data_subject?: string
    ) => {
      if (!user) return
      await auditLogService.logDelete(entity_type, entity_id, metadata, data_subject)
    },
    [user]
  )

  /**
   * Registra exportação (CRÍTICO)
   */
  const logExport = useCallback(
    async (
      entity_type: string,
      format: string,
      metadata?: Record<string, any>,
      data_subject?: string,
      legal_basis?: LegalBasis
    ) => {
      if (!user) return
      await auditLogService.logExport(
        entity_type,
        format,
        metadata,
        data_subject,
        legal_basis
      )
    },
    [user]
  )

  /**
   * Registra compartilhamento
   */
  const logShare = useCallback(
    async (
      entity_type: string,
      entity_id: string,
      metadata?: Record<string, any>,
      data_subject?: string,
      legal_basis?: LegalBasis
    ) => {
      if (!user) return
      await auditLogService.logShare(
        entity_type,
        entity_id,
        metadata,
        data_subject,
        legal_basis
      )
    },
    [user]
  )

  /**
   * Registra pesquisa/busca
   */
  const logSearch = useCallback(
    async (query: string, entity_type: string, results_count?: number) => {
      if (!user) return
      await auditLogService.logSearch(query, entity_type, results_count)
    },
    [user]
  )

  return {
    log,
    logCreate,
    logRead,
    logUpdate,
    logDelete,
    logExport,
    logShare,
    logSearch,
  }
}

/**
 * Hook para buscar logs de auditoria
 */
export function useAuditLogs(filters?: AuditLogFilters) {
  const { user } = useAuth()

  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLogs = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const data = await auditLogService.getLogs(filters)
      setLogs(data.logs)
      setTotal(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar logs')
      console.error('Error fetching audit logs:', err)
    } finally {
      setLoading(false)
    }
  }, [user, filters])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  return {
    logs,
    total,
    loading,
    error,
    refresh: fetchLogs,
  }
}

/**
 * Hook para estatísticas de audit logs
 */
export function useAuditLogStats() {
  const { user } = useAuth()

  const [stats, setStats] = useState<{
    total: number
    recent_24h: number
    by_action: Array<{ action: string; count: number }>
    by_severity: Array<{ severity: string; count: number }>
    by_entity: Array<{ entity_type: string; count: number }>
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const data = await auditLogService.getStats()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas')
      console.error('Error fetching audit log stats:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  }
}
