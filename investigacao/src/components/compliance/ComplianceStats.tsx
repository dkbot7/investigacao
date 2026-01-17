/**
 * Compliance Stats Component (Server Component)
 *
 * Exibe estatísticas consolidadas de compliance:
 * - Total de PEPs identificados
 * - Sanções CEIS/CNEP/CEAF
 * - Matches OFAC
 * - Nível de risco geral
 *
 * Best Practices 2025:
 * - Server Component por padrão (sem "use client")
 * - Data fetching no servidor
 * - Zero JavaScript no bundle do cliente
 * - SEO-friendly
 *
 * Fontes:
 * - https://nextjs.org/docs/app/getting-started/server-and-client-components
 * - https://jeffbruchado.com.br/en/blog/react-server-components-complete-practical-guide-2025
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

import { Shield, AlertTriangle, Globe, Users, TrendingUp, TrendingDown } from 'lucide-react'

interface ComplianceStatsProps {
  stats: {
    totalPEP?: number
    totalSancoesCEIS?: number
    totalSancoesCNEP?: number
    totalSancoesCEAF?: number
    totalOFACMatches?: number
    nivelRiscoGeral?: 'baixo' | 'medio' | 'alto' | 'critico'
    dataUltimaAtualizacao?: string
    comparacaoMesAnterior?: {
      pep?: number
      sancoes?: number
      ofac?: number
    }
  }
}

export async function ComplianceStats({ stats }: ComplianceStatsProps) {
  // Server Component - sem hooks, sem estado, apenas renderização
  const {
    totalPEP = 0,
    totalSancoesCEIS = 0,
    totalSancoesCNEP = 0,
    totalSancoesCEAF = 0,
    totalOFACMatches = 0,
    nivelRiscoGeral = 'baixo',
    dataUltimaAtualizacao,
    comparacaoMesAnterior,
  } = stats

  const totalSancoes = totalSancoesCEIS + totalSancoesCNEP + totalSancoesCEAF

  // Configuração de cores por nível de risco
  const nivelRiscoConfig = {
    baixo: {
      color: 'green',
      bgClass: 'bg-green-500/10',
      textClass: 'text-green-400',
      borderClass: 'border-green-500/30',
      label: 'Baixo Risco',
    },
    medio: {
      color: 'yellow',
      bgClass: 'bg-yellow-500/10',
      textClass: 'text-yellow-400',
      borderClass: 'border-yellow-500/30',
      label: 'Médio Risco',
    },
    alto: {
      color: 'orange',
      bgClass: 'bg-orange-500/10',
      textClass: 'text-orange-400',
      borderClass: 'border-orange-500/30',
      label: 'Alto Risco',
    },
    critico: {
      color: 'red',
      bgClass: 'bg-red-500/10',
      textClass: 'text-red-400',
      borderClass: 'border-red-500/30',
      label: 'Risco Crítico',
    },
  }

  const risco = nivelRiscoConfig[nivelRiscoGeral]

  return (
    <div className="space-y-4">
      {/* Header com Nível de Risco Geral */}
      <div className={`p-4 rounded-xl border ${risco.bgClass} ${risco.borderClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className={`w-6 h-6 ${risco.textClass}`} />
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white">Nível de Risco Geral</h3>
              <p className="text-sm text-slate-600 dark:text-white/60">
                Avaliação consolidada de compliance
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${risco.bgClass} ${risco.textClass} font-bold text-lg border ${risco.borderClass}`}>
            {risco.label}
          </div>
        </div>
        {dataUltimaAtualizacao && (
          <p className="text-xs text-slate-500 dark:text-white/40 mt-3">
            Última atualização: {new Date(dataUltimaAtualizacao).toLocaleString('pt-BR')}
          </p>
        )}
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PEP */}
        <StatCard
          title="PEP Identificados"
          value={totalPEP}
          icon={Shield}
          color="purple"
          description="Pessoas Expostas Politicamente"
          trend={comparacaoMesAnterior?.pep}
        />

        {/* Sanções Totais */}
        <StatCard
          title="Sanções Totais"
          value={totalSancoes}
          icon={AlertTriangle}
          color="orange"
          description="CEIS + CNEP + CEAF"
          trend={comparacaoMesAnterior?.sancoes}
          breakdown={[
            { label: 'CEIS', value: totalSancoesCEIS },
            { label: 'CNEP', value: totalSancoesCNEP },
            { label: 'CEAF', value: totalSancoesCEAF },
          ]}
        />

        {/* OFAC */}
        <StatCard
          title="OFAC Matches"
          value={totalOFACMatches}
          icon={Globe}
          color="blue"
          description="Lista SDN (EUA)"
          trend={comparacaoMesAnterior?.ofac}
        />

        {/* Total de Alertas */}
        <StatCard
          title="Total de Alertas"
          value={totalPEP + totalSancoes + totalOFACMatches}
          icon={Users}
          color="red"
          description="Todos os casos identificados"
        />
      </div>
    </div>
  )
}

/**
 * Card individual de estatística (Server Component)
 */
interface StatCardProps {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: 'purple' | 'orange' | 'blue' | 'red' | 'green'
  description?: string
  trend?: number
  breakdown?: Array<{ label: string; value: number }>
}

function StatCard({ title, value, icon: Icon, color, description, trend, breakdown }: StatCardProps) {
  const colorConfig = {
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
    },
    orange: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/20',
    },
    blue: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
    },
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
    },
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
    },
  }

  const config = colorConfig[color]

  return (
    <div className={`bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-4 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.text}`} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-red-400' : 'text-green-400'}`}>
            {trend >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div>
        <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
        {description && (
          <p className="text-xs text-slate-500 dark:text-white/50 mt-1">{description}</p>
        )}
      </div>

      {breakdown && breakdown.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-navy-700 space-y-1">
          {breakdown.map((item) => (
            <div key={item.label} className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-white/60">{item.label}:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

