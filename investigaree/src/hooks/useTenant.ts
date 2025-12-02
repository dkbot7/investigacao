"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTenantInfo, TenantInfo, TenantInfoResponse } from "@/lib/api";

// MOCK DATA REMOVIDO POR QUESTÕES DE SEGURANÇA
// Usuários não devem ter acesso a dados de outros clientes em nenhuma circunstância

interface UseTenantReturn {
  tenant: TenantInfo | null;
  tenants: TenantInfo[];
  hasAccess: boolean;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTenant(): UseTenantReturn {
  const { user, loading: authLoading } = useAuth();
  const [tenant, setTenant] = useState<TenantInfo | null>(null);
  const [tenants, setTenants] = useState<TenantInfo[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenantInfo = useCallback(async () => {
    if (!user) {
      setTenant(null);
      setTenants([]);
      setHasAccess(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response: TenantInfoResponse = await getTenantInfo();

      setHasAccess(response.hasAccess);
      setTenant(response.tenant);
      setTenants(response.tenants || []);
    } catch (err: any) {
      console.error("Erro ao buscar tenant:", err);

      // NUNCA dar acesso a dados mockados - questão de segurança crítica
      // Se API falhar, usuário não tem acesso
      console.error("[useTenant] Erro ao verificar acesso:", err);
      setHasAccess(false);
      setTenant(null);
      setTenants([]);

      // Apenas mostrar erro se não for erro de autenticação
      if (err.status !== 401) {
        setError(err.message || "Erro ao verificar acesso. Entre em contato com o suporte.");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchTenantInfo();
    }
  }, [authLoading, fetchTenantInfo]);

  return {
    tenant,
    tenants,
    hasAccess,
    loading: authLoading || loading,
    error,
    refetch: fetchTenantInfo,
  };
}
