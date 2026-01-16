/**
 * API Keys Service
 * Client-side service for managing API keys
 */

import { fetchAPI } from '@/lib/api';

export interface APIKey {
  id: number;
  tenant_id: number;
  name: string;
  key_prefix: string;
  environment: 'production' | 'test';
  scopes: string;
  rate_limit_requests: number;
  rate_limit_window: number;
  is_active: number;
  last_used_at: string | null;
  requests_count: number;
  webhook_url: string | null;
  webhook_events: string | null;
  created_at: string;
  revoked_at: string | null;
  expires_at: string | null;
}

export interface CreateAPIKeyRequest {
  name: string;
  environment: 'production' | 'test';
  scopes?: string;
  rate_limit_requests?: number;
  rate_limit_window?: number;
  webhook_url?: string;
  webhook_events?: string;
  expires_at?: string;
}

export interface CreateAPIKeyResponse {
  success: boolean;
  api_key: string;
  key_prefix: string;
  record: APIKey;
  message: string;
}

export interface ListAPIKeysResponse {
  success: boolean;
  api_keys: APIKey[];
  total: number;
}

export interface APIKeyStats {
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  avg_response_time: number;
  last_request_at: string;
}

export interface APIKeyStatsResponse {
  success: boolean;
  api_key: APIKey;
  stats: APIKeyStats;
  recent_requests: Array<{
    method: string;
    endpoint: string;
    status_code: number;
    response_time_ms: number;
    created_at: string;
  }>;
}

export class APIKeysService {
  /**
   * Create a new API key
   */
  async createAPIKey(data: CreateAPIKeyRequest): Promise<CreateAPIKeyResponse> {
    return fetchAPI('/api/api-keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * List all API keys
   */
  async listAPIKeys(includeRevoked = false): Promise<ListAPIKeysResponse> {
    const params = includeRevoked ? '?include_revoked=true' : '';
    return fetchAPI(`/api/api-keys${params}`);
  }

  /**
   * Revoke an API key
   */
  async revokeAPIKey(keyId: number): Promise<{ success: boolean; message: string }> {
    return fetchAPI(`/api/api-keys/${keyId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get API key usage statistics
   */
  async getAPIKeyStats(keyId: number): Promise<APIKeyStatsResponse> {
    return fetchAPI(`/api/api-keys/${keyId}/stats`);
  }

  /**
   * Get environment label
   */
  getEnvironmentLabel(environment: 'production' | 'test'): string {
    return environment === 'production' ? 'Produção' : 'Teste';
  }

  /**
   * Get environment badge color
   */
  getEnvironmentColor(environment: 'production' | 'test'): string {
    return environment === 'production' ? 'bg-green-500' : 'bg-yellow-500';
  }

  /**
   * Format rate limit display
   */
  formatRateLimit(requests: number, windowSeconds: number): string {
    const minutes = Math.floor(windowSeconds / 60);
    if (minutes > 0) {
      return `${requests} req/${minutes}min`;
    }
    return `${requests} req/${windowSeconds}s`;
  }

  /**
   * Check if key is expired
   */
  isExpired(apiKey: APIKey): boolean {
    if (!apiKey.expires_at) return false;
    return new Date(apiKey.expires_at) < new Date();
  }

  /**
   * Check if key is active
   */
  isActive(apiKey: APIKey): boolean {
    return apiKey.is_active === 1 && !this.isExpired(apiKey);
  }

  /**
   * Get status badge text
   */
  getStatusBadge(apiKey: APIKey): { text: string; color: string } {
    if (apiKey.revoked_at) {
      return { text: 'Revogada', color: 'bg-red-500' };
    }
    if (this.isExpired(apiKey)) {
      return { text: 'Expirada', color: 'bg-gray-500' };
    }
    if (this.isActive(apiKey)) {
      return { text: 'Ativa', color: 'bg-green-500' };
    }
    return { text: 'Inativa', color: 'bg-gray-500' };
  }

  /**
   * Mask API key for display
   */
  maskAPIKey(key: string): string {
    if (key.length < 20) return key;
    return `${key.substring(0, 16)}${'*'.repeat(16)}`;
  }

  /**
   * Format timestamp
   */
  formatDate(dateString: string | null): string {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  }

  /**
   * Calculate success rate percentage
   */
  calculateSuccessRate(stats: APIKeyStats): number {
    if (stats.total_requests === 0) return 0;
    return Math.round((stats.successful_requests / stats.total_requests) * 100);
  }
}

export const apiKeysService = new APIKeysService();
