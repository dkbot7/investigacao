/**
 * Hook para obter informações do tenant do usuário autenticado
 */

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { logger } from '@/lib/logger';

interface Tenant {
  id: string;
  code: string;
  name: string;
  status: string;
  email: string;
}

interface TenantInfo {
  hasAccess: boolean;
  tenant: Tenant | null;
  tenants: Tenant[];
  user?: {
    uid: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    userId: string;
  };
}

export function useTenant() {
  const [tenantInfo, setTenantInfo] = useState<TenantInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchTenantInfo = async () => {
      try {
        const user = auth.currentUser;

        if (!user) {
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const response = await fetch('/api/tenants/info', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tenant info');
        }

        const data = await response.json();

        if (mounted) {
          setTenantInfo(data);
          setError(null);
        }
      } catch (err) {
        logger.error('Erro ao buscar tenant info', err instanceof Error ? err : undefined, {}, 'useTenant');

        if (mounted) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Fetch on mount
    fetchTenantInfo();

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchTenantInfo();
      } else {
        setTenantInfo(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return {
    tenantInfo,
    currentTenant: tenantInfo?.tenant || null,
    tenantCode: tenantInfo?.tenant?.code || null,
    loading,
    error,
    hasAccess: tenantInfo?.hasAccess || false,
    userRole: tenantInfo?.user?.role || 'viewer'
  };
}
