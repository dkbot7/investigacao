'use client'

import { useState, useCallback } from 'react'
import { Bell, AlertTriangle, Info, CheckCircle, XCircle, RefreshCw, X } from 'lucide-react'
import { useAsyncPolling } from '@/hooks/useAsync'
import { adminService } from '@/lib/services/admin.service'
import { Alert } from '@/lib/types/admin.types'
import { Button } from '@/components/ui/button'
import { Loading, InlineLoading } from '@/components/ui/loading'
import { EmptyState } from '@/components/ui/empty-state'
import { cn } from '@/lib/utils'

interface AlertsPanelProps {
  /** Intervalo de polling em ms (padrão: 30000 = 30s) */
  pollingInterval?: number
  /** Iniciar polling automaticamente */
  autoStart?: boolean
  /** Classe CSS adicional */
  className?: string
  /** Mostrar apenas alertas não lidos */
  showUnreadOnly?: boolean
}

const alertIcons = {
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
  success: CheckCircle,
}

const alertStyles = {
  info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
  error: 'bg-red-500/10 border-red-500/20 text-red-400',
  success: 'bg-green-500/10 border-green-500/20 text-green-400',
}

/**
 * Painel de alertas em tempo real com polling automático
 *
 * @example
 * ```tsx
 * <AlertsPanel
 *   pollingInterval={30000}
 *   autoStart={true}
 *   showUnreadOnly={false}
 * />
 * ```
 */
export function AlertsPanel({
  pollingInterval = 30000,
  autoStart = true,
  className,
  showUnreadOnly = false,
}: AlertsPanelProps) {
  const [filter, setFilter] = useState<Alert['type'] | 'all'>('all')
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const {
    data: alertsResponse,
    loading,
    error,
    start,
    stop,
    isPolling,
  } = useAsyncPolling<{ alerts: Alert[] }>(
    async () => {
      const response = await adminService.getAlerts({
        unreadOnly: showUnreadOnly,
      })
      return response
    },
    pollingInterval,
    { autoStart }
  )

  const alerts = alertsResponse?.alerts

  const handleDismiss = useCallback((alertId: string) => {
    setDismissedIds((prev) => new Set(prev).add(alertId))
  }, [])

  const handleMarkAsRead = useCallback(async (alertId: string) => {
    try {
      await adminService.markAlertAsRead(alertId)
      // O próximo poll irá atualizar a lista
    } catch (err) {
      console.error('Failed to mark alert as read:', err)
    }
  }, [])

  const handleClearAll = useCallback(() => {
    if (alerts) {
      setDismissedIds(new Set(alerts.map((a) => a.id)))
    }
  }, [alerts])

  const filteredAlerts = alerts?.filter((alert) => {
    if (dismissedIds.has(alert.id)) return false
    if (filter !== 'all' && alert.type !== filter) return false
    return true
  })

  const unreadCount = alerts?.filter((a) => !a.read && !dismissedIds.has(a.id)).length || 0

  return (
    <div className={cn('bg-navy-900 border border-navy-700 rounded-lg', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-navy-700">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">
            Alertas em Tempo Real
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Polling Status */}
          {isPolling && (
            <span className="flex items-center gap-1.5 text-xs text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Ativo
            </span>
          )}

          {/* Start/Stop Polling */}
          <Button
            variant="ghost"
            size="sm"
            onClick={isPolling ? stop : start}
            className="text-white/60 hover:text-white"
          >
            {isPolling ? 'Pausar' : 'Iniciar'}
          </Button>

          {/* Manual Refresh */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => start()}
            disabled={loading}
            className="text-white/60 hover:text-white"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 p-4 border-b border-navy-700">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            filter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-navy-800 text-white/60 hover:bg-navy-700'
          )}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('error')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            filter === 'error'
              ? 'bg-red-500 text-white'
              : 'bg-navy-800 text-white/60 hover:bg-navy-700'
          )}
        >
          Erros
        </button>
        <button
          onClick={() => setFilter('warning')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            filter === 'warning'
              ? 'bg-yellow-500 text-white'
              : 'bg-navy-800 text-white/60 hover:bg-navy-700'
          )}
        >
          Avisos
        </button>
        <button
          onClick={() => setFilter('info')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            filter === 'info'
              ? 'bg-blue-500 text-white'
              : 'bg-navy-800 text-white/60 hover:bg-navy-700'
          )}
        >
          Info
        </button>
        <button
          onClick={() => setFilter('success')}
          className={cn(
            'px-3 py-1.5 text-sm rounded-md transition-colors',
            filter === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-navy-800 text-white/60 hover:bg-navy-700'
          )}
        >
          Sucesso
        </button>

        <div className="flex-1" />

        {filteredAlerts && filteredAlerts.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-3 py-1.5 text-sm text-white/60 hover:text-white"
          >
            Limpar todos
          </button>
        )}
      </div>

      {/* Alerts List */}
      <div className="max-h-96 overflow-y-auto">
        {loading && !alerts ? (
          <div className="p-8">
            <Loading text="Carregando alertas..." />
          </div>
        ) : error ? (
          <div className="p-4">
            <EmptyState
              icon={AlertTriangle}
              title="Erro ao carregar alertas"
              description={error.message}
              action={{
                label: 'Tentar novamente',
                onClick: start,
              }}
            />
          </div>
        ) : !filteredAlerts || filteredAlerts.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={Bell}
              title="Nenhum alerta"
              description={
                filter === 'all'
                  ? 'Não há alertas no momento.'
                  : `Não há alertas do tipo "${filter}".`
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-navy-700">
            {filteredAlerts.map((alert) => {
              const Icon = alertIcons[alert.type]
              return (
                <div
                  key={alert.id}
                  className={cn(
                    'p-4 transition-colors hover:bg-navy-800/50',
                    !alert.read && 'bg-navy-800/30'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className={cn(
                        'flex-shrink-0 p-2 rounded-lg border',
                        alertStyles[alert.type]
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-white">
                          {alert.title}
                        </h4>
                        <button
                          onClick={() => handleDismiss(alert.id)}
                          className="flex-shrink-0 p-1 text-white/40 hover:text-white rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-white/60">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-white/40">
                          {new Date(alert.createdAt).toLocaleString('pt-BR')}
                        </span>
                        {!alert.read && (
                          <button
                            onClick={() => handleMarkAsRead(alert.id)}
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            Marcar como lida
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {loading && alerts && (
        <div className="flex items-center justify-center gap-2 p-2 border-t border-navy-700 bg-navy-800/50">
          <InlineLoading />
          <span className="text-xs text-white/60">Atualizando...</span>
        </div>
      )}
    </div>
  )
}

/**
 * Badge de notificação de alertas (para uso em header/navbar)
 */
export function AlertsBadge({ onClick }: { onClick?: () => void }) {
  const { data: alertsResponse } = useAsyncPolling<{ alerts: Alert[] }>(
    async () => {
      const response = await adminService.getAlerts({ unreadOnly: true })
      return response
    },
    30000, // Poll a cada 30s
    { autoStart: true }
  )

  const unreadCount = alertsResponse?.alerts.length || 0

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-navy-800"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold bg-red-500 text-white rounded-full">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}
