/**
 * Plan Limits Service - Sistema de Limites por Plano
 *
 * Gerencia verificação e rastreamento de limites de uso
 */

import { fetchAPI } from '@/lib/api'

export interface PlanLimits {
  id: number
  plan_name: string
  investigations_per_month: number
  investigations_concurrent: number
  serpro_calls_per_month: number
  exports_per_month: number
  users_per_tenant: number
  storage_mb: number
  api_access: number
  bulk_investigations: number
  custom_reports: number
  priority_support: number
}

export interface TenantUsage {
  id: number
  tenant_code: string
  year_month: string
  investigations_count: number
  serpro_calls_count: number
  exports_count: number
  created_at: string
  updated_at: string
}

export interface UsageStatus {
  allowed: boolean
  limit: number
  current: number
  percentage: number
  warning: boolean
  message?: string
}

export interface LimitsCheckResult {
  allowed: boolean
  plan_name: string
  limits: PlanLimits
  usage: {
    investigations: UsageStatus
    serpro_calls: UsageStatus
    exports: UsageStatus
  }
  warnings: string[]
  blocked_reason?: string
}

export type LimitAction = 'investigations' | 'serpro_calls' | 'exports'

// ============================================
// Plan Limits Service Class
// ============================================

export class PlanLimitsService {
  /**
   * Verifica se uma ação está dentro dos limites
   */
  async checkLimits(action?: LimitAction): Promise<LimitsCheckResult> {
    const params = new URLSearchParams()
    if (action) {
      params.set('action', action)
    }

    return fetchAPI(`/api/plan-limits/check?${params.toString()}`)
  }

  /**
   * Registra uso de um recurso (incrementa contador)
   */
  async trackUsage(
    action: LimitAction,
    increment: number = 1
  ): Promise<{ success: boolean; action: string; increment: number }> {
    return fetchAPI('/api/plan-limits/track', {
      method: 'POST',
      body: JSON.stringify({ action, increment }),
    })
  }

  /**
   * Lista todos os planos disponíveis
   */
  async getPlans(): Promise<{ plans: PlanLimits[] }> {
    return fetchAPI('/api/plan-limits/plans')
  }

  /**
   * Busca histórico de uso dos últimos meses
   */
  async getUsageHistory(
    months: number = 6
  ): Promise<{ history: TenantUsage[] }> {
    return fetchAPI(`/api/plan-limits/usage/history?months=${months}`)
  }

  /**
   * Verifica se o usuário pode realizar uma ação (wrapper conveniente)
   * Lança erro se não puder
   */
  async canPerformAction(action: LimitAction): Promise<void> {
    const result = await this.checkLimits(action)

    if (!result.allowed) {
      throw new Error(
        result.blocked_reason ||
          `Limite de ${action} atingido. Faça upgrade do seu plano.`
      )
    }
  }

  /**
   * Verifica limites e retorna apenas status de permissão
   */
  async isAllowed(action: LimitAction): Promise<boolean> {
    try {
      const result = await this.checkLimits(action)
      return result.allowed
    } catch (error) {
      console.error('[PlanLimits] Error checking if allowed:', error)
      return false
    }
  }

  /**
   * Retorna porcentagem de uso de uma ação específica
   */
  async getUsagePercentage(action: LimitAction): Promise<number> {
    try {
      const result = await this.checkLimits()
      const usageMap = {
        investigations: result.usage.investigations,
        serpro_calls: result.usage.serpro_calls,
        exports: result.usage.exports,
      }
      return usageMap[action]?.percentage || 0
    } catch (error) {
      console.error('[PlanLimits] Error getting usage percentage:', error)
      return 0
    }
  }

  /**
   * Retorna se há avisos de soft limit (>= 80%)
   */
  async hasWarnings(): Promise<boolean> {
    try {
      const result = await this.checkLimits()
      return result.warnings.length > 0
    } catch (error) {
      console.error('[PlanLimits] Error checking warnings:', error)
      return false
    }
  }

  /**
   * Retorna mensagens de aviso
   */
  async getWarnings(): Promise<string[]> {
    try {
      const result = await this.checkLimits()
      return result.warnings
    } catch (error) {
      console.error('[PlanLimits] Error getting warnings:', error)
      return []
    }
  }

  /**
   * Retorna informações do plano atual
   */
  async getCurrentPlan(): Promise<{
    name: string
    limits: PlanLimits
  }> {
    const result = await this.checkLimits()
    return {
      name: result.plan_name,
      limits: result.limits,
    }
  }

  /**
   * Verifica se o plano tem acesso a uma feature específica
   */
  async hasFeature(
    feature:
      | 'api_access'
      | 'bulk_investigations'
      | 'custom_reports'
      | 'priority_support'
  ): Promise<boolean> {
    try {
      const result = await this.checkLimits()
      return result.limits[feature] === 1
    } catch (error) {
      console.error('[PlanLimits] Error checking feature:', error)
      return false
    }
  }
}

/**
 * Singleton instance
 */
export const planLimitsService = new PlanLimitsService()
