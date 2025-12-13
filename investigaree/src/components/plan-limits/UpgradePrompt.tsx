/**
 * UpgradePrompt Component
 *
 * Prompt para upgrade quando limite é atingido
 */

'use client'

import { ArrowUpCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAvailablePlans } from '@/hooks/usePlanLimits'

interface UpgradePromptProps {
  currentPlan: string
  reason?: string
  className?: string
}

export function UpgradePrompt({
  currentPlan,
  reason,
  className = '',
}: UpgradePromptProps) {
  const { plans } = useAvailablePlans()

  const getNextPlan = () => {
    const planOrder = ['free', 'basic', 'pro', 'enterprise']
    const currentIndex = planOrder.indexOf(currentPlan.toLowerCase())
    if (currentIndex < planOrder.length - 1) {
      return plans.find((p) => p.plan_name === planOrder[currentIndex + 1])
    }
    return null
  }

  const nextPlan = getNextPlan()

  if (!nextPlan) {
    return (
      <div className={`bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 ${className}`}>
        <div className="flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-200 mb-2">
              Você está no plano Enterprise
            </h3>
            <p className="text-amber-800 dark:text-amber-300 mb-4">
              Você já tem acesso a todos os recursos disponíveis. Entre em contato
              para soluções personalizadas.
            </p>
            <Button variant="outline" className="border-amber-300 dark:border-amber-700">
              Falar com Vendas
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <ArrowUpCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Faça Upgrade e Desbloqueie Mais Recursos
          </h3>

          {reason && (
            <p className="text-blue-800 dark:text-blue-300 mb-4">{reason}</p>
          )}

          <div className="bg-white dark:bg-navy-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-slate-900 dark:text-white">
                Plano {nextPlan.plan_name.charAt(0).toUpperCase() + nextPlan.plan_name.slice(1)}
              </h4>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {nextPlan.plan_name === 'basic' && 'R$ 99/mês'}
                {nextPlan.plan_name === 'pro' && 'R$ 299/mês'}
                {nextPlan.plan_name === 'enterprise' && 'Personalizado'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <FeatureHighlight
                label="Investigações por mês"
                value={nextPlan.investigations_per_month === 999999 ? 'Ilimitado' : nextPlan.investigations_per_month}
              />
              <FeatureHighlight
                label="Consultas SERPRO por mês"
                value={nextPlan.serpro_calls_per_month === 999999 ? 'Ilimitado' : nextPlan.serpro_calls_per_month}
              />
              <FeatureHighlight
                label="Exportações por mês"
                value={nextPlan.exports_per_month === 999999 ? 'Ilimitado' : nextPlan.exports_per_month}
              />
              {nextPlan.api_access === 1 && (
                <FeatureHighlight label="Acesso à API" value="Incluído" />
              )}
              {nextPlan.bulk_investigations === 1 && (
                <FeatureHighlight label="Investigações em Lote" value="Incluído" />
              )}
              {nextPlan.priority_support === 1 && (
                <FeatureHighlight label="Suporte Prioritário" value="Incluído" />
              )}
            </div>
          </div>

          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Fazer Upgrade Agora
          </Button>
        </div>
      </div>
    </div>
  )
}

function FeatureHighlight({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
