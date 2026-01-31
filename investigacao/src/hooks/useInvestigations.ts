/**
 * Hook para gerenciar investigações do usuário
 */

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br'

// Types
export type InvestigacaoStatus = 'investigar' | 'investigando' | 'relatorio' | 'monitoramento' | 'aprovado' | 'bloqueado'
export type Categoria = 'familia' | 'clientes' | 'funcionarios' | 'relacionamentos' | 'empresas'
export type NivelUrgencia = 'baixa' | 'media' | 'alta' | 'urgente'
export type TipoPessoa = 'fisica' | 'juridica'

export interface Investigacao {
  id: string
  nome: string
  documento: string
  tipo_pessoa: TipoPessoa
  is_grupo: boolean
  grupo_nome?: string
  grupo_total_documentos: number
  categoria: Categoria
  status: InvestigacaoStatus
  nivel_urgencia: NivelUrgencia
  email?: string
  telefones?: string[]
  endereco?: string
  motivo_investigacao?: string
  observacoes?: string
  relatorio_url?: string
  relatorio_gerado_em?: string
  created_at: string
  updated_at: string
}

export interface InvestigacaoStats {
  total: number
  em_andamento: number
  com_relatorio: number
  concluidas: number
  bloqueadas: number
}

export interface CreateInvestigacaoData {
  nome: string
  documento: string
  tipo_pessoa?: TipoPessoa
  is_grupo?: boolean
  grupo_nome?: string
  grupo_total_documentos?: number
  categoria?: Categoria
  nivel_urgencia?: NivelUrgencia
  email?: string
  telefones?: string[]
  endereco?: string
  redes_sociais?: Record<string, string>
  placa_veiculo?: string
  rg?: string
  estado_civil?: string
  profissao?: string
  data_nascimento?: string
  motivo_investigacao?: string
  escopo_investigacao?: Record<string, boolean>
  observacoes?: string
  prazo_desejado?: string
}

export interface SendMessageData {
  assunto: string
  mensagem: string
  tipo?: string
  investigacao_id?: string
}

// Custom hook
export function useInvestigations() {
  const { user } = useAuth()
  const [investigacoes, setInvestigacoes] = useState<Investigacao[]>([])
  const [stats, setStats] = useState<InvestigacaoStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get auth token
  const getToken = useCallback(async () => {
    if (!user) return null
    try {
      return await user.getIdToken()
    } catch (err) {
      console.error('Error getting token:', err)
      return null
    }
  }, [user])

  // Fetch investigations
  const fetchInvestigations = useCallback(async (filters?: { status?: string; categoria?: string; busca?: string }) => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = await getToken()
      if (!token) {
        setError('Não autenticado')
        setLoading(false)
        return
      }

      const params = new URLSearchParams()
      if (filters?.status) params.append('status', filters.status)
      if (filters?.categoria) params.append('categoria', filters.categoria)
      if (filters?.busca) params.append('busca', filters.busca)

      const response = await fetch(`${API_URL}/api/investigacoes?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Handle 404 gracefully (endpoint not deployed yet)
      if (response.status === 404) {
        setInvestigacoes([])
        setError(null)
        setLoading(false)
        return
      }

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao buscar investigações')
      }

      const data = await response.json()
      setInvestigacoes(data.investigacoes || [])
    } catch (err: any) {
      console.error('Error fetching investigations:', err)
      // Show empty state on any error (API not deployed yet)
      // This is temporary - remove when backend is deployed
      setInvestigacoes([])
      setError(null)
    } finally {
      setLoading(false)
    }
  }, [user, getToken])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!user) return

    try {
      const token = await getToken()
      if (!token) return

      const response = await fetch(`${API_URL}/api/investigacoes/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      // Handle 404 gracefully (endpoint not deployed yet)
      if (response.status === 404 || !response.ok) {
        setStats({ total: 0, em_andamento: 0, com_relatorio: 0, concluidas: 0, bloqueadas: 0 })
        return
      }

      const data = await response.json()
      setStats(data.stats || null)
    } catch (err) {
      console.error('Error fetching stats:', err)
      // Set default stats on error
      setStats({ total: 0, em_andamento: 0, com_relatorio: 0, concluidas: 0, bloqueadas: 0 })
    }
  }, [user, getToken])

  // Create investigation
  const createInvestigation = useCallback(async (data: CreateInvestigacaoData) => {
    const token = await getToken()
    if (!token) {
      throw new Error('Não autenticado')
    }

    const response = await fetch(`${API_URL}/api/investigacoes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao criar investigação')
    }

    // Refresh data
    await fetchInvestigations()
    await fetchStats()

    return result
  }, [getToken, fetchInvestigations, fetchStats])

  // Import multiple investigations
  const importInvestigations = useCallback(async (
    items: Array<{ nome: string; documento: string; tipo_pessoa?: TipoPessoa }>,
    options?: { grupo_nome?: string; categoria?: Categoria; nivel_urgencia?: NivelUrgencia; motivo_investigacao?: string }
  ) => {
    const token = await getToken()
    if (!token) {
      throw new Error('Não autenticado')
    }

    const response = await fetch(`${API_URL}/api/investigacoes/import`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items, ...options })
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao importar investigações')
    }

    // Refresh data
    await fetchInvestigations()
    await fetchStats()

    return result
  }, [getToken, fetchInvestigations, fetchStats])

  // Update investigation
  const updateInvestigation = useCallback(async (id: string, data: Partial<CreateInvestigacaoData>) => {
    const token = await getToken()
    if (!token) {
      throw new Error('Não autenticado')
    }

    const response = await fetch(`${API_URL}/api/investigacoes/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao atualizar investigação')
    }

    // Refresh data
    await fetchInvestigations()

    return result
  }, [getToken, fetchInvestigations])

  // Delete investigation
  const deleteInvestigation = useCallback(async (id: string) => {
    const token = await getToken()
    if (!token) {
      throw new Error('Não autenticado')
    }

    const response = await fetch(`${API_URL}/api/investigacoes/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao excluir investigação')
    }

    // Refresh data
    await fetchInvestigations()
    await fetchStats()

    return result
  }, [getToken, fetchInvestigations, fetchStats])

  // Send message
  const sendMessage = useCallback(async (data: SendMessageData) => {
    const token = await getToken()
    if (!token) {
      throw new Error('Não autenticado')
    }

    const response = await fetch(`${API_URL}/api/investigacoes/mensagem`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.message || 'Erro ao enviar mensagem')
    }

    return result
  }, [getToken])

  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchInvestigations()
      fetchStats()
    } else {
      setInvestigacoes([])
      setStats(null)
      setLoading(false)
    }
  }, [user, fetchInvestigations, fetchStats])

  return {
    investigacoes,
    stats,
    loading,
    error,
    fetchInvestigations,
    fetchStats,
    createInvestigation,
    importInvestigations,
    updateInvestigation,
    deleteInvestigation,
    sendMessage,
    refetch: () => {
      fetchInvestigations()
      fetchStats()
    }
  }
}

// Hook for single investigation
export function useInvestigation(id: string) {
  const { user } = useAuth()
  const [investigacao, setInvestigacao] = useState<Investigacao | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetch() {
      if (!user || !id) {
        setLoading(false)
        return
      }

      try {
        const token = await user.getIdToken()
        const response = await globalThis.fetch(`${API_URL}/api/investigacoes/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.message || 'Investigação não encontrada')
        }

        const data = await response.json()
        setInvestigacao(data.investigacao)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [user, id])

  return { investigacao, loading, error }
}
