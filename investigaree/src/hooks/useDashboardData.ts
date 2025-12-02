"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "./useTenant";
import {
  getDashboardData,
  getObitos,
  getCandidatos,
  getDoadores,
  getSancionados,
  DashboardResponse,
} from "@/lib/api";

// Mock data removido por questões de segurança
// Nunca mostrar dados de outros clientes

interface DashboardData {
  tenant: {
    code: string;
    name: string;
  };
  stats: {
    totalFuncionarios: number;
    totais: {
      obitos: number;
      candidatos: number;
      doadores: number;
      sancionados: number;
      socios: number;
      cnpjs: number;
      beneficiarios: number;
      ofacMatches: number;
    };
    grupos: Array<{
      nome: string;
      registros: number;
      obitos: number;
      candidatos: number;
      doadores: number;
      sancionados: number;
      socios: number;
      cnpjs: number;
    }>;
    valorTotalDoacoes: number;
    dataAtualizacao: string;
  };
  obitos: Array<{
    id: string;
    cadastro?: string;
    nome: string;
    cpf: string;
    grupo: string;
    ano_obito: number;
  }>;
  candidatos: Array<{
    id: string;
    nome: string;
    cpf: string;
    cargo: string;
    partido: string;
    uf: string;
    ano: number;
    situacao: string;
    grupo: string;
  }>;
  doadores: Array<{
    id: string;
    nome: string;
    cpf: string;
    valor: number;
    candidato: string;
    partido: string;
    ano: number;
    grupo: string;
  }>;
  sancionados: Array<{
    id: string;
    nome: string;
    cpf: string;
    tipo: string;
    orgao: string;
    motivo: string;
    dataInicio: string;
    dataFim: string;
    grupo: string;
  }>;
}

interface UseDashboardDataReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isUsingMockData: boolean;
}

/**
 * Hook para carregar dados do dashboard
 * Tenta usar a API, mas faz fallback para mock data se não disponível
 */
export function useDashboardData(): UseDashboardDataReturn {
  const { user } = useAuth();
  const { tenant, hasAccess } = useTenant();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user || !hasAccess) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setIsUsingMockData(false);

    try {
      // Tentar carregar da API
      const [dashboardRes, obitosRes, candidatosRes, doadoresRes, sancionadosRes] =
        await Promise.all([
          getDashboardData(),
          getObitos(),
          getCandidatos(),
          getDoadores(),
          getSancionados(),
        ]);

      const apiData: DashboardData = {
        tenant: dashboardRes.tenant,
        stats: {
          totalFuncionarios: dashboardRes.stats.total_funcionarios,
          totais: {
            obitos: dashboardRes.stats.total_obitos,
            candidatos: dashboardRes.stats.total_candidatos,
            doadores: dashboardRes.stats.total_doadores,
            sancionados: dashboardRes.stats.total_sancionados,
            socios: dashboardRes.stats.total_socios,
            cnpjs: dashboardRes.vinculos?.cnpjs || 0,
            beneficiarios: dashboardRes.stats.total_beneficiarios,
            ofacMatches: 0, // TODO: adicionar na API
          },
          grupos: dashboardRes.grupos.map((g) => ({
            nome: g.grupo,
            registros: g.registros,
            obitos: g.obitos,
            candidatos: g.candidatos,
            doadores: g.doadores,
            sancionados: g.sancionados,
            socios: g.socios,
            cnpjs: 0,
          })),
          valorTotalDoacoes: dashboardRes.doacoes?.total_valor || 0,
          dataAtualizacao: new Date(dashboardRes.updated_at).toLocaleDateString("pt-BR"),
        },
        obitos: (obitosRes as any).obitos || [],
        candidatos: (candidatosRes as any).candidatos || [],
        doadores: (doadoresRes as any).doadores || [],
        sancionados: (sancionadosRes as any).sancionados || [],
      };

      setData(apiData);
    } catch (err: any) {
      console.error("[useDashboardData] Erro ao carregar da API:", err);

      // NUNCA usar mock data - questão de segurança
      // Novos usuários não podem ver dados de outros clientes
      setError(err.message || "Erro ao carregar dados");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [user, hasAccess]);

  useEffect(() => {
    if (hasAccess) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [hasAccess, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    isUsingMockData,
  };
}

/**
 * Hook simplificado para usar no dashboard principal
 * Retorna os dados no formato esperado pelos componentes existentes
 */
export function useDashboardStats() {
  const { data, loading, error, isUsingMockData } = useDashboardData();

  return {
    stats: data?.stats || null,
    tenant: data?.tenant || null,
    obitos: data?.obitos || [],
    candidatos: data?.candidatos || [],
    doadores: data?.doadores || [],
    sancionados: data?.sancionados || [],
    loading,
    error,
    isUsingMockData,
  };
}
