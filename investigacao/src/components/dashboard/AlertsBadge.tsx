/**
 * Componente AlertsBadge - Badge de notificações de alertas
 *
 * Exibe contagem de alertas não lidos na navbar
 */

'use client';

import { useAlerts } from '@/hooks/useAlerts';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AlertsBadge() {
  const { unreadCount } = useAlerts({
    limit: 1, // Não precisa carregar lista completa, apenas contador
    autoRefresh: true,
    refreshInterval: 30000 // 30s
  });

  return (
    <Link href="/dashboard/alertas">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        <span className="sr-only">
          {unreadCount > 0 ? `${unreadCount} alertas não lidos` : 'Alertas'}
        </span>
      </Button>
    </Link>
  );
}
