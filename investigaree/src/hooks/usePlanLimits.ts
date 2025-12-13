/**
 * usePlanLimits Hook
 *
 * Hook React para gerenciar limites de plano e uso
 */

'use client'

import { useCallback, useState, useEffect } from 'react'
import {
  planLimitsService,
  type LimitAction,
  type LimitsCheckResult,
  type PlanLimits,
  type TenantUsage,
} from '@/lib/services/plan-limits.service'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Hook principal para verificar limites
 */
export function usePlanLimits(action?: LimitAction) {
  const { user } = useAuth()
  const [limits, setLimits] = useState<LimitsCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkLimits = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const result = await planLimitsService.checkLimits(action)
      setLimits(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao verificar limites')
      console.error('Error checking limits:', err)
    } finally {
      setLoading(false)
    }
  }, [user, action])

  useEffect(() => {
    checkLimits()
  }, [checkLimits])

  /**
   * Rastreia uso e atualiza limites
   */
  const trackUsage = useCallback(
    async (trackAction: LimitAction, increment: number = 1) => {
      if (!user) return

      try {
        await planLimitsService.trackUsage(trackAction, increment)
        // Atualizar limites após rastrear
        await checkLimits()
      } catch (err) {
        console.error('Error tracking usage:', err)
      }
    },
    [user, checkLimits]
  )

  /**
   * Verifica se pode realizar ação (lança erro se não puder)
   */
  const canPerformAction = useCallback(
    async (checkAction: LimitAction) => {
      await planLimitsService.canPerformAction(checkAction)
    },
    []
  )

  /**
   * Verifica se está permitido (retorna boolean)
   */
  const isAllowed = useCallback(
    (checkAction: LimitAction): boolean => {
      if (!limits) return true // Default: permitir se não carregou ainda
      const usageMap = {
        investigations: limits.usage.investigations,
        serpro_calls: limits.usage.serpro_calls,
        exports: limits.usage.exports,
      }
      return usageMap[checkAction]?.allowed ?? true
    },
    [limits]
  )

  return {
    limits,
    loading,
    error,
    refresh: checkLimits,
    trackUsage,
    canPerformAction,
    isAllowed,
    hasWarnings: limits ? limits.warnings.length > 0 : false,
    warnings: limits?.warnings || [],
    allowed: limits?.allowed ?? true,
    blockedReason: limits?.blocked_reason,
  }
}

/**
 * Hook para listar planos disponíveis
 */
export function useAvailablePlans() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<PlanLimits[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPlans = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const result = await planLimitsService.getPlans()
      setPlans(result.plans)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar planos')
      console.error('Error fetching plans:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchPlans()
  }, [fetchPlans])

  return {
    plans,
    loading,
    error,
    refresh: fetchPlans,
  }
}

/**
 * Hook para histórico de uso
 */
export function useUsageHistory(months: number = 6) {
  const { user } = useAuth()
  const [history, setHistory] = useState<TenantUsage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const result = await planLimitsService.getUsageHistory(months)
      setHistory(result.history)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico')
      console.error('Error fetching usage history:', err)
    } finally {
      setLoading(false)
    }
  }, [user, months])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  return {
    history,
    loading,
    error,
    refresh: fetchHistory,
  }
}

/**
 * Hook simples para verificar se tem acesso a uma feature
 */
export function useHasFeature(
  feature:
    | 'api_access'
    | 'bulk_investigations'
    | 'custom_reports'
    | 'priority_support'
) {
  const { limits } = usePlanLimits()
  return limits?.limits[feature] === 1
}

/**
 * Hook para obter plano atual
 */
export function useCurrentPlan() {
  const { limits, loading, error } = usePlanLimits()

  return {
    planName: limits?.plan_name || 'free',
    planLimits: limits?.limits || null,
    loading,
    error,
  }
}
