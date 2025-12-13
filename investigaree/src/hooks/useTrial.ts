/**
 * React hooks for Trial Management
 */

import { useState, useCallback, useEffect } from 'react';
import { trialService, TrialStatus } from '@/lib/services/trial.service';
import { useToast } from '@/hooks/use-toast';

export function useTrial() {
  const [status, setStatus] = useState<TrialStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [extending, setExtending] = useState(false);
  const { toast } = useToast();

  /**
   * Fetch trial status
   */
  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const result = await trialService.getStatus();
      setStatus(result);
      return result;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar status do trial',
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Request trial extension
   */
  const requestExtension = useCallback(
    async (reason: string, requestedDays: number) => {
      setExtending(true);
      try {
        const result = await trialService.requestExtension({
          reason,
          requested_days: requestedDays,
        });

        toast({
          title: 'Solicitação enviada',
          description: result.message,
        });

        return result;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao solicitar extensão',
          description: error.message,
        });
        throw error;
      } finally {
        setExtending(false);
      }
    },
    [toast]
  );

  /**
   * Track engagement event
   */
  const trackEngagement = useCallback(
    async (eventType: string, eventData?: any) => {
      try {
        await trialService.trackEngagement({
          event_type: eventType,
          event_data: eventData,
        });
      } catch (error) {
        // Silent fail - engagement tracking is not critical
        console.error('Failed to track engagement:', error);
      }
    },
    []
  );

  return {
    status,
    loading,
    extending,
    fetchStatus,
    requestExtension,
    trackEngagement,
  };
}

export function useTrialNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchNotifications = useCallback(
    async (activeOnly = true) => {
      setLoading(true);
      try {
        const result = await trialService.getNotifications(activeOnly);
        setNotifications(result.notifications);
        return result.notifications;
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar notificações',
          description: error.message,
        });
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  const dismissNotification = useCallback(
    async (notificationType: string) => {
      try {
        await trialService.dismissNotification(notificationType);
        await fetchNotifications();
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao dispensar notificação',
          description: error.message,
        });
        throw error;
      }
    },
    [toast, fetchNotifications]
  );

  return {
    notifications,
    loading,
    fetchNotifications,
    dismissNotification,
  };
}
