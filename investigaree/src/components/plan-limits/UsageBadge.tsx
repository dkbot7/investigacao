/**
 * UsageBadge Component
 *
 * Exibe badge de uso com barra de progresso e avisos
 */

'use client'

import { usePlanLimits } from '@/hooks/usePlanLimits'
import { type LimitAction } from '@/lib/services/plan-limits.service'
import { AlertTriangle, Check, X } from 'lucide-react'

interface UsageBadgeProps {
  action: LimitAction
  label: string
  className?: string
}

export function UsageBadge({ action, label, className = '' }: UsageBadgeProps) {
  const { limits, loading } = usePlanLimits()

  if (loading || !limits) {
    return (
      <div className={`animate-pulse bg-slate-200 dark:bg-navy-700 h-20 rounded-lg ${className}`} />
    )
  }

  const usageMap = {
    investigations: limits.usage.investigations,
    serpro_calls: limits.usage.serpro_calls,
    exports: limits.usage.exports,
  }

  const usage = usageMap[action]

  const getColorClasses = () => {
    if (!usage.allowed) return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-700'
    if (usage.warning) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700'
    return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700'
  }

  const getProgressBarColor = () => {
    if (!usage.allowed) return 'bg-red-500'
    if (usage.warning) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getIcon = () => {
    if (!usage.allowed) return <X className="w-5 h-5 text-red-600 dark:text-red-400" />
    if (usage.warning) return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
    return <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
  }

  const displayLimit = usage.limit === 999999 ? 'Ilimitado' : usage.limit

  return (
    <div className={`border rounded-lg p-4 ${getColorClasses()} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <span className="font-medium text-slate-900 dark:text-white">{label}</span>
        </div>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {usage.current} / {displayLimit}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-navy-600 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${getProgressBarColor()} transition-all duration-300`}
          style={{ width: `${Math.min(usage.percentage, 100)}%` }}
        />
      </div>

      {/* Warning/Error Message */}
      {usage.message && (
        <p className="mt-2 text-xs text-slate-700 dark:text-slate-300">
          {usage.message}
        </p>
      )}

      {!usage.allowed && (
        <p className="mt-2 text-xs font-semibold text-red-700 dark:text-red-300">
          Limite atingido! Faça upgrade do seu plano.
        </p>
      )}
    </div>
  )
}
