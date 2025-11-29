"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getTenantInfo, TenantInfo, TenantInfoResponse } from "@/lib/api";

// Lista de emails admin que tem acesso ao CLIENTE_01 em desenvolvimento
const ADMIN_EMAILS = [
  "contato@investigaree.com.br",
  "admin@investigaree.com.br",
];

// Mock data para desenvolvimento quando API não está disponível
const MOCK_TENANT: TenantInfo = {
  id: "tenant_cliente_01",
  code: "CLIENTE_01",
  name: "COMURG - Companhia de Urbanizacao de Goiania",
  role: "admin",
};

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

      // Se for erro de autenticação, não mostrar erro
      if (err.status === 401) {
        setHasAccess(false);
        setTenant(null);
        setTenants([]);
      } else if (err.message?.includes("fetch") || err.name === "TypeError") {
        // API não disponível - usar mock para admins em desenvolvimento
        console.warn("[useTenant] API indisponivel, verificando acesso local");

        if (user.email && ADMIN_EMAILS.includes(user.email)) {
          // Admin tem acesso ao mock
          setHasAccess(true);
          setTenant(MOCK_TENANT);
          setTenants([MOCK_TENANT]);
        } else {
          // Usuário comum sem acesso
          setHasAccess(false);
          setTenant(null);
          setTenants([]);
        }
      } else {
        // Outro erro - usuário sem acesso
        setHasAccess(false);
        setTenant(null);
        setTenants([]);
        setError(err.message || "Erro ao verificar acesso");
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
