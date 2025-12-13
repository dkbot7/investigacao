/**
 * Trial Management Service
 * Client-side service for trial period management
 */

import { fetchAPI } from '@/lib/api';

export interface TrialStatus {
  success: boolean;
  is_trial: boolean;
  trial_active: boolean;
  trial_expired: boolean;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  days_remaining: number;
  hours_remaining: number;
  trial_extended: number;
  trial_extension_reason: string | null;
  plan_name: string;
}

export interface ExtensionRequest {
  reason: string;
  requested_days: number;
}

export interface ExtensionResponse {
  success: boolean;
  message: string;
}

export interface TrackEngagementRequest {
  event_type: string;
  event_data?: any;
}

export interface TrialNotification {
  notification_type: string;
  sent_at: string;
  sent_via: string;
  in_app_dismissed: number;
}

export class TrialService {
  /**
   * Get current trial status
   */
  async getStatus(): Promise<TrialStatus> {
    return fetchAPI('/api/trial/status');
  }

  /**
   * Request trial extension
   */
  async requestExtension(data: ExtensionRequest): Promise<ExtensionResponse> {
    return fetchAPI('/api/trial/extend-request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Track engagement event
   */
  async trackEngagement(data: TrackEngagementRequest): Promise<{ success: boolean }> {
    return fetchAPI('/api/trial/track-engagement', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get trial notifications
   */
  async getNotifications(activeOnly = true): Promise<{ success: boolean; notifications: TrialNotification[] }> {
    const params = activeOnly ? '?active_only=true' : '';
    return fetchAPI(`/api/trial/notifications${params}`);
  }

  /**
   * Dismiss notification
   */
  async dismissNotification(notificationType: string): Promise<{ success: boolean }> {
    return fetchAPI('/api/trial/dismiss-notification', {
      method: 'POST',
      body: JSON.stringify({ notification_type: notificationType }),
    });
  }

  /**
   * Get urgency level based on days remaining
   */
  getUrgencyLevel(daysRemaining: number): 'low' | 'medium' | 'high' | 'critical' {
    if (daysRemaining > 7) return 'low';
    if (daysRemaining > 3) return 'medium';
    if (daysRemaining > 1) return 'high';
    return 'critical';
  }

  /**
   * Get urgency color for UI
   */
  getUrgencyColor(urgency: 'low' | 'medium' | 'high' | 'critical'): string {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-yellow-500',
      high: 'bg-orange-500',
      critical: 'bg-red-500',
    };
    return colors[urgency];
  }

  /**
   * Get message based on days remaining
   */
  getTrialMessage(daysRemaining: number, hoursRemaining: number): string {
    if (daysRemaining > 7) {
      return `Você tem ${daysRemaining} dias restantes no seu período de teste.`;
    }
    if (daysRemaining > 1) {
      return `Atenção! Restam apenas ${daysRemaining} dias no seu período de teste.`;
    }
    if (daysRemaining === 1) {
      return `⚠️ Último dia! Seu período de teste expira em ${hoursRemaining} horas.`;
    }
    if (hoursRemaining > 0) {
      return `⚠️ URGENTE! Seu período de teste expira em ${hoursRemaining} horas.`;
    }
    return 'Seu período de teste expirou.';
  }

  /**
   * Format date
   */
  formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  /**
   * Format datetime
   */
  formatDateTime(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get notification message
   */
  getNotificationMessage(type: string, daysRemaining: number): string {
    const messages: Record<string, string> = {
      trial_started: 'Seu período de teste de 14 dias começou!',
      trial_7_days_left: `Você tem ${daysRemaining} dias restantes no seu teste gratuito.`,
      trial_3_days_left: `Atenção! Restam apenas ${daysRemaining} dias do seu período de teste.`,
      trial_1_day_left: 'ÚLTIMO DIA! Seu período de teste expira amanhã.',
      trial_expired: 'Seu período de teste expirou. Faça upgrade para continuar.',
      trial_extended: 'Seu período de teste foi estendido!',
    };
    return messages[type] || 'Notificação do período de teste';
  }

  /**
   * Get notification icon
   */
  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      trial_started: '🎉',
      trial_7_days_left: 'ℹ️',
      trial_3_days_left: '⚠️',
      trial_1_day_left: '🚨',
      trial_expired: '❌',
      trial_extended: '✅',
    };
    return icons[type] || 'ℹ️';
  }

  /**
   * Calculate progress percentage
   */
  calculateProgress(trialStartedAt: string | null, trialEndsAt: string | null): number {
    if (!trialStartedAt || !trialEndsAt) return 0;

    const start = new Date(trialStartedAt).getTime();
    const end = new Date(trialEndsAt).getTime();
    const now = Date.now();

    const total = end - start;
    const elapsed = now - start;

    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  }
}

export const trialService = new TrialService();
