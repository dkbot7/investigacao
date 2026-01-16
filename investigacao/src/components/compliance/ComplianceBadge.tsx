'use client'

/**
 * Compliance Badge Component
 *
 * Badge reutilizável para exibir níveis de risco de compliance
 * - PEP (Pessoas Expostas Politicamente)
 * - Sanções (CEIS/CNEP/CEAF)
 * - OFAC (SDN List)
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface ComplianceBadgeProps {
  nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico'
  tipo?: 'pep' | 'sancoes' | 'ofac' | 'geral'
  showIcon?: boolean
  className?: string
}

export function ComplianceBadge({
  nivelRisco,
  tipo = 'geral',
  showIcon = true,
  className = '',
}: ComplianceBadgeProps) {
  const configs = {
    baixo: {
      color: 'green',
      text: 'Baixo Risco',
      icon: CheckCircle,
      bgClass: 'bg-green-500/10',
      textClass: 'text-green-400',
      borderClass: 'border-green-500/30',
    },
    medio: {
      color: 'yellow',
      text: 'Médio Risco',
      icon: AlertTriangle,
      bgClass: 'bg-yellow-500/10',
      textClass: 'text-yellow-400',
      borderClass: 'border-yellow-500/30',
    },
    alto: {
      color: 'orange',
      text: 'Alto Risco',
      icon: AlertTriangle,
      bgClass: 'bg-orange-500/10',
      textClass: 'text-orange-400',
      borderClass: 'border-orange-500/30',
    },
    critico: {
      color: 'red',
      text: 'Risco Crítico',
      icon: XCircle,
      bgClass: 'bg-red-500/10',
      textClass: 'text-red-400',
      borderClass: 'border-red-500/30',
    },
  }

  const config = configs[nivelRisco]
  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgClass} ${config.textClass} border ${config.borderClass} ${className}`}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      <span className="text-sm font-semibold">{config.text}</span>
    </div>
  )
}

/**
 * Variant com ícone personalizado por tipo
 */
export function ComplianceBadgeWithTypeIcon({
  nivelRisco,
  tipo,
  className = '',
}: ComplianceBadgeProps) {
  const typeIcons = {
    pep: Shield,
    sancoes: AlertTriangle,
    ofac: Shield,
    geral: Shield,
  }

  const Icon = typeIcons[tipo || 'geral']
  const config = {
    baixo: {
      bgClass: 'bg-green-500/10',
      textClass: 'text-green-400',
      borderClass: 'border-green-500/30',
    },
    medio: {
      bgClass: 'bg-yellow-500/10',
      textClass: 'text-yellow-400',
      borderClass: 'border-yellow-500/30',
    },
    alto: {
      bgClass: 'bg-orange-500/10',
      textClass: 'text-orange-400',
      borderClass: 'border-orange-500/30',
    },
    critico: {
      bgClass: 'bg-red-500/10',
      textClass: 'text-red-400',
      borderClass: 'border-red-500/30',
    },
  }[nivelRisco]

  const typeLabels = {
    pep: 'PEP',
    sancoes: 'Sanções',
    ofac: 'OFAC',
    geral: 'Compliance',
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgClass} ${config.textClass} border ${config.borderClass} ${className}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-semibold uppercase tracking-wide">
        {typeLabels[tipo || 'geral']}
      </span>
    </div>
  )
}
