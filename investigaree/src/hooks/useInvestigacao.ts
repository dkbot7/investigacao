/**
 * Investigation Hooks
 *
 * Hooks personalizados para carregar dados de investigação usando investigacaoService
 */

import { useState, useEffect, useCallback } from 'react'
import { investigacaoService } from '@/lib/services/investigacao.service'
import type {
  Funcionario,
  Obito,
  Vinculo,
  Candidatura,
  Doacao,
  Sancao,
  Beneficio,
  OFACMatch,
  InvestigacaoStats,
  InvestigacaoFilters,
} from '@/lib/types/investigacao.types'

// ============================================
// Estado Base
// ============================================

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

// ============================================
// Hook: Funcionários
// ============================================

export function useFuncionarios(filters?: InvestigacaoFilters) {
  const [state, setState] = useState<AsyncState<Funcionario[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await investigacaoService.getFuncionarios(filters)
      setState({ data: response.funcionarios, loading: false, error: null })
    } catch (error) {
      console.error('[useFuncionarios] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [filters?.grupo, filters?.search, filters?.page, filters?.limit])

  useEffect(() => {
    load()
  }, [load])

  return {
    funcionarios: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Óbitos
// ============================================

export function useObitos(filters?: InvestigacaoFilters) {
  const [state, setState] = useState<AsyncState<Obito[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await investigacaoService.getObitos(filters)
      setState({ data: response.obitos, loading: false, error: null })
    } catch (error) {
      console.error('[useObitos] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [filters?.grupo, filters?.search])

  useEffect(() => {
    load()
  }, [load])

  return {
    obitos: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Vínculos
// ============================================

export function useVinculos(filters?: InvestigacaoFilters) {
  const [state, setState] = useState<AsyncState<Vinculo[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await investigacaoService.getVinculos(filters)
      setState({ data: response.vinculos, loading: false, error: null })
    } catch (error) {
      console.error('[useVinculos] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [filters?.grupo, filters?.search])

  useEffect(() => {
    load()
  }, [load])

  return {
    vinculos: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Vínculos por CPF
// ============================================

export function useVinculosByCPF(cpf: string | null) {
  const [state, setState] = useState<AsyncState<Vinculo[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const load = useCallback(async () => {
    if (!cpf) {
      setState({ data: null, loading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const vinculos = await investigacaoService.getVinculosByCPF(cpf)
      setState({ data: vinculos, loading: false, error: null })
    } catch (error) {
      console.error('[useVinculosByCPF] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [cpf])

  useEffect(() => {
    load()
  }, [load])

  return {
    vinculos: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Candidatos
// ============================================

export function useCandidatos(filters?: InvestigacaoFilters) {
  const [state, setState] = useState<AsyncState<Candidatura[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await investigacaoService.getCandidatos(filters)
      setState({ data: response.candidaturas, loading: false, error: null })
    } catch (error) {
      console.error('[useCandidatos] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [filters?.grupo, filters?.search])

  useEffect(() => {
    load()
  }, [load])

  return {
    candidatos: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Candidaturas por CPF
// ============================================

export function useCandidaturasByCPF(cpf: string | null) {
  const [state, setState] = useState<AsyncState<Candidatura[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const load = useCallback(async () => {
    if (!cpf) {
      setState({ data: null, loading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const candidaturas = await investigacaoService.getCandidaturasByCPF(cpf)
      setState({ data: candidaturas, loading: false, error: null })
    } catch (error) {
      console.error('[useCandidaturasByCPF] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [cpf])

  useEffect(() => {
    load()
  }, [load])

  return {
    candidaturas: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Doadores
// ============================================

export function useDoadores(filters?: InvestigacaoFilters) {
  const [state, setState] = useState<AsyncState<Doacao[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await investigacaoService.getDoadores(filters)
      setState({ data: response.doacoes, loading: false, error: null })
    } catch (error) {
      console.error('[useDoadores] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [filters?.grupo, filters?.search])

  useEffect(() => {
    load()
  }, [load])

  return {
    doadores: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Doações por CPF
// ============================================

export function useDoacoesByCPF(cpf: string | null) {
  const [state, setState] = useState<AsyncState<Doacao[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const load = useCallback(async () => {
    if (!cpf) {
      setState({ data: null, loading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const doacoes = await investigacaoService.getDoacoesByCPF(cpf)
      setState({ data: doacoes, loading: false, error: null })
    } catch (error) {
      console.error('[useDoacoesByCPF] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [cpf])

  useEffect(() => {
    load()
  }, [load])

  return {
    doacoes: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Sancionados
// ============================================

export function useSancionados(filters?: InvestigacaoFilters) {
  const [state, setState] = useState<AsyncState<Sancao[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await investigacaoService.getSancionados(filters)
      setState({ data: response.sancoes, loading: false, error: null })
    } catch (error) {
      console.error('[useSancionados] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [filters?.grupo, filters?.search])

  useEffect(() => {
    load()
  }, [load])

  return {
    sancionados: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Sanções por CPF
// ============================================

export function useSancoesByCPF(cpf: string | null) {
  const [state, setState] = useState<AsyncState<Sancao[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const load = useCallback(async () => {
    if (!cpf) {
      setState({ data: null, loading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const sancoes = await investigacaoService.getSancoesByCPF(cpf)
      setState({ data: sancoes, loading: false, error: null })
    } catch (error) {
      console.error('[useSancoesByCPF] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [cpf])

  useEffect(() => {
    load()
  }, [load])

  return {
    sancoes: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Beneficiários
// ============================================

export function useBeneficiarios(filters?: InvestigacaoFilters) {
  const [state, setState] = useState<AsyncState<Beneficio[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await investigacaoService.getBeneficiarios(filters)
      setState({ data: response.beneficios, loading: false, error: null })
    } catch (error) {
      console.error('[useBeneficiarios] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [filters?.grupo, filters?.search])

  useEffect(() => {
    load()
  }, [load])

  return {
    beneficiarios: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Benefícios por CPF
// ============================================

export function useBeneficiosByCPF(cpf: string | null) {
  const [state, setState] = useState<AsyncState<Beneficio[]>>({
    data: null,
    loading: false,
    error: null,
  })

  const load = useCallback(async () => {
    if (!cpf) {
      setState({ data: null, loading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const beneficios = await investigacaoService.getBeneficiosByCPF(cpf)
      setState({ data: beneficios, loading: false, error: null })
    } catch (error) {
      console.error('[useBeneficiosByCPF] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [cpf])

  useEffect(() => {
    load()
  }, [load])

  return {
    beneficios: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: OFAC Matches
// ============================================

export function useOFACMatches(filters?: InvestigacaoFilters) {
  const [state, setState] = useState<AsyncState<OFACMatch[]>>({
    data: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await investigacaoService.getOFACMatches(filters)
      setState({ data: response.matches, loading: false, error: null })
    } catch (error) {
      console.error('[useOFACMatches] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [filters?.grupo, filters?.search])

  useEffect(() => {
    load()
  }, [load])

  return {
    ofacMatches: state.data || [],
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Estatísticas
// ============================================

export function useInvestigacaoStats() {
  const [state, setState] = useState<AsyncState<InvestigacaoStats>>({
    data: null,
    loading: true,
    error: null,
  })

  const load = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const stats = await investigacaoService.getStats()
      setState({ data: stats, loading: false, error: null })
    } catch (error) {
      console.error('[useInvestigacaoStats] Erro ao carregar:', error)
      setState({ data: null, loading: false, error: error as Error })
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return {
    stats: state.data,
    loading: state.loading,
    error: state.error,
    reload: load,
  }
}

// ============================================
// Hook: Dados Completos de um CPF
// ============================================

export function useDadosCompletosByCPF(cpf: string | null) {
  const vinculos = useVinculosByCPF(cpf)
  const candidaturas = useCandidaturasByCPF(cpf)
  const doacoes = useDoacoesByCPF(cpf)
  const sancoes = useSancoesByCPF(cpf)
  const beneficios = useBeneficiosByCPF(cpf)

  return {
    vinculos: vinculos.vinculos,
    candidaturas: candidaturas.candidaturas,
    doacoes: doacoes.doacoes,
    sancoes: sancoes.sancoes,
    beneficios: beneficios.beneficios,
    loading:
      vinculos.loading ||
      candidaturas.loading ||
      doacoes.loading ||
      sancoes.loading ||
      beneficios.loading,
    error:
      vinculos.error ||
      candidaturas.error ||
      doacoes.error ||
      sancoes.error ||
      beneficios.error,
    reload: () => {
      vinculos.reload()
      candidaturas.reload()
      doacoes.reload()
      sancoes.reload()
      beneficios.reload()
    },
  }
}
