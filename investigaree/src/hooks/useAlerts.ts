/**
 * Hook useAlerts - Gerencia alertas do usuário
 *
 * Funcionalidades:
 * - Buscar alertas
 * - Marcar como lido
 * - Contar não lidos
 * - Real-time updates via polling
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAlerts, markAlertAsRead, markAllAlertsAsRead, getUnreadCount } from '@/lib/api';

export interface Alert {
  id: string;
  investigation_id: string;
  tenant_id: string;
  user_id: string;
  alert_type: 'ceis_entry' | 'processo_novo' | 'vinculo_mudanca' | 'cnep_entry' | 'obito';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  old_value: string;
  new_value: string;
  is_read: number;
  email_sent: number;
  created_at: number;
  read_at: number | null;
  nome_investigado: string;
  cpf_cnpj: string;
}

interface UseAlertsOptions {
  limit?: number;
  onlyUnread?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number; // ms
}

export function useAlerts(options: UseAlertsOptions = {}) {
  const {
    limit = 50,
    onlyUnread = false,
    autoRefresh = false,
    refreshInterval = 30000 // 30s
  } = options;

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    try {
      setError(null);
      const data = await getAlerts({ limit, unread: onlyUnread });
      setAlerts((data.alerts || []) as Alert[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar alertas');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, onlyUnread]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  // Mark single alert as read
  const markAsRead = useCallback(async (alertId: string) => {
    try {
      await markAlertAsRead(alertId);

      // Update local state
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId
            ? { ...alert, is_read: 1, read_at: Math.floor(Date.now() / 1000) }
            : alert
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking alert as read:', err);
      throw err;
    }
  }, []);

  // Mark all alerts as read
  const markAllAsRead = useCallback(async () => {
    try {
      const result = await markAllAlertsAsRead();

      // Update local state
      const now = Math.floor(Date.now() / 1000);
      setAlerts(prev =>
        prev.map(alert => ({ ...alert, is_read: 1, read_at: now }))
      );

      // Reset unread count
      setUnreadCount(0);

      return result;
    } catch (err) {
      console.error('Error marking all alerts as read:', err);
      throw err;
    }
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    fetchAlerts();
    fetchUnreadCount();
  }, [fetchAlerts, fetchUnreadCount]);

  // Initial fetch
  useEffect(() => {
    fetchAlerts();
    fetchUnreadCount();
  }, [fetchAlerts, fetchUnreadCount]);

  // Auto-refresh polling
  useEffect(() => {
    if (!autoRefresh) return;

    const intervalId = setInterval(() => {
      fetchUnreadCount(); // Apenas conta, não recarrega lista completa
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, fetchUnreadCount]);

  return {
    alerts,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh
  };
}
