"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getUserInfo,
  getDashboardData,
  getFuncionarios,
  getObitos,
  getCandidatos,
  getDoadores,
  getSancionados,
  getVinculos,
  getBeneficios,
  UserInfo,
  DashboardData,
  Funcionario,
  Obito,
  Candidato,
  Doador,
  Sancionado,
  Vinculo,
  Beneficio,
  Pagination,
} from "@/lib/user-api";

/**
 * Hook para verificar acesso do usuario
 * Sempre retorna hasAccess: true para usuarios autenticados
 */
export function useUserAccess() {
  const { user, loading: authLoading } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = useCallback(async () => {
    if (!user) {
      setUserInfo(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const info = await getUserInfo();
      setUserInfo(info);
    } catch (err: any) {
      console.error("Erro ao buscar info do usuario:", err);
      // Mesmo com erro, usuario autenticado tem acesso
      setUserInfo({
        hasAccess: true,
        user: {
          id: "",
          email: user.email || "",
        },
        settings: {
          plano: "free",
          limite_funcionarios: 100,
        },
        stats: {
          total_funcionarios: 0,
        },
      });
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchUserInfo();
    }
  }, [authLoading, fetchUserInfo]);

  return {
    userInfo,
    hasAccess: !!user, // Usuario autenticado SEMPRE tem acesso
    loading: authLoading || loading,
    error,
    refetch: fetchUserInfo,
  };
}

/**
 * Hook para dados do dashboard
 */
export function useDashboard() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dashboardData = await getDashboardData();
      setData(dashboardData);
    } catch (err: any) {
      console.error("Erro ao buscar dashboard:", err);
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  return {
    data,
    loading: authLoading || loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook para lista de funcionarios
 */
export function useFuncionarios(params?: {
  grupo?: string;
  busca?: string;
  alerta?: string;
  page?: number;
  limit?: number;
}) {
  const { user, loading: authLoading } = useAuth();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setFuncionarios([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getFuncionarios(params);
      setFuncionarios(result.funcionarios);
      setPagination(result.pagination);
    } catch (err: any) {
      console.error("Erro ao buscar funcionarios:", err);
      setError(err.message || "Erro ao carregar funcionarios");
    } finally {
      setLoading(false);
    }
  }, [user, params?.grupo, params?.busca, params?.alerta, params?.page, params?.limit]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  return {
    funcionarios,
    pagination,
    loading: authLoading || loading,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook para obitos
 */
export function useObitos() {
  const { user, loading: authLoading } = useAuth();
  const [obitos, setObitos] = useState<Obito[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setObitos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getObitos();
      setObitos(result.obitos);
      setTotal(result.total);
    } catch (err: any) {
      console.error("Erro ao buscar obitos:", err);
      setError(err.message || "Erro ao carregar obitos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  return { obitos, total, loading: authLoading || loading, error, refetch: fetchData };
}

/**
 * Hook para candidatos
 */
export function useCandidatos() {
  const { user, loading: authLoading } = useAuth();
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setCandidatos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getCandidatos();
      setCandidatos(result.candidatos);
      setTotal(result.total);
    } catch (err: any) {
      console.error("Erro ao buscar candidatos:", err);
      setError(err.message || "Erro ao carregar candidatos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  return { candidatos, total, loading: authLoading || loading, error, refetch: fetchData };
}

/**
 * Hook para doadores
 */
export function useDoadores() {
  const { user, loading: authLoading } = useAuth();
  const [doadores, setDoadores] = useState<Doador[]>([]);
  const [total, setTotal] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setDoadores([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getDoadores();
      setDoadores(result.doadores);
      setTotal(result.total);
      setValorTotal(result.valor_total);
    } catch (err: any) {
      console.error("Erro ao buscar doadores:", err);
      setError(err.message || "Erro ao carregar doadores");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  return { doadores, total, valorTotal, loading: authLoading || loading, error, refetch: fetchData };
}

/**
 * Hook para sancionados
 */
export function useSancionados() {
  const { user, loading: authLoading } = useAuth();
  const [sancionados, setSancionados] = useState<Sancionado[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setSancionados([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getSancionados();
      setSancionados(result.sancionados);
      setTotal(result.total);
    } catch (err: any) {
      console.error("Erro ao buscar sancionados:", err);
      setError(err.message || "Erro ao carregar sancionados");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  return { sancionados, total, loading: authLoading || loading, error, refetch: fetchData };
}

/**
 * Hook para vinculos empresariais
 */
export function useVinculos() {
  const { user, loading: authLoading } = useAuth();
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [total, setTotal] = useState(0);
  const [cnpjsUnicos, setCnpjsUnicos] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setVinculos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getVinculos();
      setVinculos(result.vinculos);
      setTotal(result.total);
      setCnpjsUnicos(result.cnpjs_unicos);
    } catch (err: any) {
      console.error("Erro ao buscar vinculos:", err);
      setError(err.message || "Erro ao carregar vinculos");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  return { vinculos, total, cnpjsUnicos, loading: authLoading || loading, error, refetch: fetchData };
}

/**
 * Hook para beneficios
 */
export function useBeneficios() {
  const { user, loading: authLoading } = useAuth();
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setBeneficios([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await getBeneficios();
      setBeneficios(result.beneficios);
      setTotal(result.total);
    } catch (err: any) {
      console.error("Erro ao buscar beneficios:", err);
      setError(err.message || "Erro ao carregar beneficios");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user, fetchData]);

  return { beneficios, total, loading: authLoading || loading, error, refetch: fetchData };
}
