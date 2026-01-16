/**
 * React hooks for API key management
 */

import { useState, useCallback, useEffect } from 'react';
import {
  apiKeysService,
  APIKey,
  CreateAPIKeyRequest,
  APIKeyStats
} from '@/lib/services/api-keys.service';
import { useToast } from '@/hooks/use-toast';

export function useAPIKeys() {
  const [apiKeys, setAPIKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  /**
   * Fetch all API keys
   */
  const fetchAPIKeys = useCallback(async (includeRevoked = false) => {
    setLoading(true);
    try {
      const result = await apiKeysService.listAPIKeys(includeRevoked);
      setAPIKeys(result.api_keys);
      return result.api_keys;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar API keys',
        description: error.message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /**
   * Create a new API key
   */
  const createAPIKey = useCallback(async (data: CreateAPIKeyRequest) => {
    setCreating(true);
    try {
      const result = await apiKeysService.createAPIKey(data);
      toast({
        title: 'API Key criada!',
        description: result.message,
      });

      // Refresh list
      await fetchAPIKeys();

      return result;
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar API key',
        description: error.message,
      });
      throw error;
    } finally {
      setCreating(false);
    }
  }, [toast, fetchAPIKeys]);

  /**
   * Revoke an API key
   */
  const revokeAPIKey = useCallback(async (keyId: number) => {
    try {
      const result = await apiKeysService.revokeAPIKey(keyId);
      toast({
        title: 'API Key revogada',
        description: result.message,
      });

      // Refresh list
      await fetchAPIKeys();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao revogar API key',
        description: error.message,
      });
      throw error;
    }
  }, [toast, fetchAPIKeys]);

  return {
    apiKeys,
    loading,
    creating,
    fetchAPIKeys,
    createAPIKey,
    revokeAPIKey,
  };
}

export function useAPIKeyStats(keyId: number | null) {
  const [stats, setStats] = useState<APIKeyStats | null>(null);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    if (!keyId) return;

    setLoading(true);
    try {
      const result = await apiKeysService.getAPIKeyStats(keyId);
      setStats(result.stats);
      setRecentRequests(result.recent_requests);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar estatísticas',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }, [keyId, toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    recentRequests,
    loading,
    fetchStats,
  };
}
