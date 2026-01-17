/**
 * Componente AlertsList - Lista de alertas do usuário
 *
 * Exibe alertas com opção de marcar como lido
 */

'use client';

import { useAlerts, Alert } from '@/hooks/useAlerts';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCheck, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

interface AlertsListProps {
  limit?: number;
  onlyUnread?: boolean;
  showMarkAllRead?: boolean;
}

export function AlertsList({ limit = 50, onlyUnread = false, showMarkAllRead = true }: AlertsListProps) {
  const { alerts, loading, error, markAsRead, markAllAsRead, unreadCount, refresh } = useAlerts({
    limit,
    onlyUnread,
    autoRefresh: true,
    refreshInterval: 60000 // 1 min
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">{error}</p>
        <Button onClick={refresh} variant="outline" size="sm" className="mt-4">
          Tentar novamente
        </Button>
      </Card>
    );
  }

  if (alerts.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CheckCheck className="h-12 w-12 text-success mx-auto mb-2" />
        <p className="font-medium mb-1">Nenhum alerta</p>
        <p className="text-sm text-muted-foreground">
          {onlyUnread ? 'Todos os alertas foram lidos' : 'Você não tem alertas no momento'}
        </p>
      </Card>
    );
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error('Erro ao marcar todos como lidos:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      {showMarkAllRead && unreadCount > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {unreadCount} {unreadCount === 1 ? 'alerta não lido' : 'alertas não lidos'}
          </p>
          <Button
            onClick={handleMarkAllRead}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            <CheckCheck className="h-3 w-3 mr-1" />
            Marcar todos como lidos
          </Button>
        </div>
      )}

      {/* Alerts list */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onMarkRead={() => markAsRead(alert.id)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Card individual de alerta
 */
function AlertCard({ alert, onMarkRead }: { alert: Alert; onMarkRead: () => void }) {
  const severityColors = {
    critical: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400',
    high: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/20 dark:text-orange-400',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400',
    low: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-900/20 dark:text-gray-400'
  };

  const severityLabels = {
    critical: 'CRÍTICO',
    high: 'ALTO',
    medium: 'MÉDIO',
    low: 'BAIXO'
  };

  const isUnread = alert.is_read === 0;

  return (
    <Card
      className={`p-4 transition-all ${
        isUnread
          ? 'border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/10'
          : 'opacity-75'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="outline"
              className={`text-xs font-semibold ${severityColors[alert.severity as keyof typeof severityColors]}`}
            >
              {severityLabels[alert.severity as keyof typeof severityLabels]}
            </Badge>
            <h3 className="font-semibold text-sm">{alert.title}</h3>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">{alert.description}</p>

          {/* Meta info */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <strong>Investigação:</strong> {alert.nome_investigado || alert.cpf_cnpj}
            </span>
            <span>
              {formatDistanceToNow(new Date(alert.created_at * 1000), {
                addSuffix: true,
                locale: ptBR
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {isUnread && (
            <Button
              onClick={onMarkRead}
              variant="ghost"
              size="sm"
              className="text-xs h-8"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar lido
            </Button>
          )}

          <Link href={`/dashboard/investigacoes/${alert.investigation_id}`}>
            <Button variant="outline" size="sm" className="text-xs h-8 w-full">
              <ExternalLink className="h-3 w-3 mr-1" />
              Ver
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}


