/**
 * UsagePanel Component
 *
 * Painel completo mostrando uso de todos os recursos
 */

'use client'

import { usePlanLimits } from '@/hooks/usePlanLimits'
import { UsageBadge } from './UsageBadge'
import { FileSearch, Database, FileDown, Sparkles } from 'lucide-react'

interface UsagePanelProps {
  className?: string
}

export function UsagePanel({ className = '' }: UsagePanelProps) {
  const { limits, loading, error } = usePlanLimits()

  if (error) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
        <p className="text-red-700 dark:text-red-300">
          Erro ao carregar informações de uso: {error}
        </p>
      </div>
    )
  }

  if (loading || !limits) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse bg-slate-200 dark:bg-navy-700 h-24 rounded-lg" />
        <div className="animate-pulse bg-slate-200 dark:bg-navy-700 h-24 rounded-lg" />
        <div className="animate-pulse bg-slate-200 dark:bg-navy-700 h-24 rounded-lg" />
      </div>
    )
  }

  const getPlanBadge = () => {
    const colors = {
      free: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      basic: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      pro: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    }
    const color = colors[limits.plan_name as keyof typeof colors] || colors.free
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
        <Sparkles className="w-4 h-4" />
        Plano {limits.plan_name.charAt(0).toUpperCase() + limits.plan_name.slice(1)}
      </span>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Uso de Recursos
        </h3>
        {getPlanBadge()}
      </div>

      {/* Usage Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <UsageBadge
          action="investigations"
          label="Investigações"
        />
        <UsageBadge
          action="serpro_calls"
          label="Consultas SERPRO"
        />
        <UsageBadge
          action="exports"
          label="Exportações"
        />
      </div>

      {/* Features Available */}
      <div className="bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-600 rounded-lg p-4">
        <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
          Recursos Disponíveis
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <FeatureItem
            enabled={limits.limits.api_access === 1}
            label="Acesso à API"
          />
          <FeatureItem
            enabled={limits.limits.bulk_investigations === 1}
            label="Investigações em Lote"
          />
          <FeatureItem
            enabled={limits.limits.custom_reports === 1}
            label="Relatórios Personalizados"
          />
          <FeatureItem
            enabled={limits.limits.priority_support === 1}
            label="Suporte Prioritário"
          />
        </div>
      </div>

      {/* Warnings */}
      {limits.warnings.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="font-medium text-yellow-900 dark:text-yellow-200 mb-2">
            Avisos de Uso
          </p>
          <ul className="space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
            {limits.warnings.map((warning, i) => (
              <li key={i}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function FeatureItem({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-2 h-2 rounded-full ${
          enabled ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      />
      <span
        className={
          enabled
            ? 'text-slate-900 dark:text-white'
            : 'text-slate-500 dark:text-slate-500 line-through'
        }
      >
        {label}
      </span>
    </div>
  )
}

