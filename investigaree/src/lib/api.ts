/**
 * API Client para comunicação com o backend
 */

import { auth } from './firebase'

// Detectar automaticamente se está rodando em localhost
const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
)

// Se localhost, usa próprio servidor Next.js (API Routes)
// Se produção, usa Worker da Cloudflare
const API_BASE_URL = isLocalhost
  ? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')
  : (process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br')

/**
 * Faz uma requisição autenticada para a API
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
  retryOnAuthError = true
): Promise<T> {
  const user = auth.currentUser

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  // Get token (will auto-refresh if expired)
  const token = await user.getIdToken()

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  // Handle 401 errors by forcing token refresh and retrying once
  if (response.status === 401 && retryOnAuthError) {
    console.log('[API] Token expirado, forçando refresh...')

    // Force token refresh
    const newToken = await user.getIdToken(true)

    // Retry request with new token
    const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newToken}`,
        ...options.headers,
      },
    })

    if (!retryResponse.ok) {
      const errorData = await retryResponse.json().catch(() => ({}))
      throw new APIError(
        errorData.message || `HTTP error ${retryResponse.status}`,
        retryResponse.status,
        errorData.code
      )
    }

    return retryResponse.json()
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new APIError(
      errorData.message || `HTTP error ${response.status}`,
      response.status,
      errorData.code
    )
  }

  return response.json()
}

/**
 * Erro customizado da API
 */
export class APIError extends Error {
  status: number
  code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.code = code
  }
}

// ============================================
// TENANT API
// ============================================

export interface TenantInfo {
  id: string
  code: string
  name: string
  role: string
}

export interface TenantInfoResponse {
  hasAccess: boolean
  tenant: TenantInfo | null
  tenants: TenantInfo[]
  message?: string
  role?: string
}

export interface DashboardStats {
  total_funcionarios: number
  total_obitos: number
  total_beneficiarios: number
  total_sancionados: number
  total_doadores: number
  total_candidatos: number
  total_socios: number
}

export interface GrupoStats {
  grupo: string
  registros: number
  obitos: number
  beneficiarios: number
  sancionados: number
  doadores: number
  candidatos: number
  socios: number
}

export interface DashboardResponse {
  tenant: {
    code: string
    name: string
  }
  stats: DashboardStats
  grupos: GrupoStats[]
  vinculos: {
    total: number
    cnpjs: number
  }
  doacoes: {
    total_valor: number
    total_doacoes: number
  }
  updated_at: string
}

/**
 * Busca informações do tenant do usuário logado
 */
export async function getTenantInfo(): Promise<TenantInfoResponse> {
  return fetchAPI<TenantInfoResponse>('/api/tenant/info')
}

/**
 * Busca dados do dashboard
 */
export async function getDashboardData(): Promise<DashboardResponse> {
  return fetchAPI<DashboardResponse>('/api/tenant/dashboard')
}

/**
 * Busca lista de funcionários
 */
export async function getFuncionarios(params?: {
  grupo?: string
  busca?: string
  alerta?: string
  page?: number
  limit?: number
}) {
  const searchParams = new URLSearchParams()
  if (params?.grupo) searchParams.set('grupo', params.grupo)
  if (params?.busca) searchParams.set('busca', params.busca)
  if (params?.alerta) searchParams.set('alerta', params.alerta)
  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.limit) searchParams.set('limit', params.limit.toString())

  const query = searchParams.toString()
  return fetchAPI(`/api/tenant/funcionarios${query ? `?${query}` : ''}`)
}

/**
 * Busca óbitos
 */
export async function getObitos() {
  return fetchAPI('/api/tenant/obitos')
}

/**
 * Busca candidatos
 */
export async function getCandidatos() {
  return fetchAPI('/api/tenant/candidatos')
}

/**
 * Busca doadores
 */
export async function getDoadores() {
  return fetchAPI('/api/tenant/doadores')
}

/**
 * Busca sancionados
 */
export async function getSancionados() {
  return fetchAPI('/api/tenant/sancionados')
}

/**
 * Busca vínculos empresariais
 */
export async function getVinculos() {
  return fetchAPI('/api/tenant/vinculos')
}

/**
 * Busca beneficiários
 */
export async function getBeneficios() {
  return fetchAPI('/api/tenant/beneficios')
}

/**
 * Busca detalhes de um funcionário
 */
export async function getFuncionarioDetails(id: string) {
  return fetchAPI(`/api/tenant/funcionario/${id}`)
}

/**
 * Adiciona um novo funcionário
 */
export async function addFuncionario(data: {
  nome: string
  cpf: string
  grupo: string
  cargo?: string
  salario?: number
  cadastro?: string
}) {
  return fetchAPI('/api/tenant/funcionarios', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============================================
// USER INVESTIGATIONS API
// ============================================

export interface InvestigationData {
  nome: string
  documento: string
  tipo_pessoa?: 'fisica' | 'juridica'
  is_grupo?: boolean
  grupo_nome?: string
  grupo_total_documentos?: number
  categoria?: string
  nivel_urgencia?: 'baixa' | 'media' | 'alta' | 'urgente'
  email?: string
  telefones?: string
  endereco?: string
  redes_sociais?: string
  placa_veiculo?: string
  rg?: string
  estado_civil?: string
  profissao?: string
  data_nascimento?: string
  motivo_investigacao?: string
  escopo_investigacao?: string
  observacoes?: string
  prazo_desejado?: string
}

/**
 * Cria uma nova investigação
 */
export async function createInvestigation(data: InvestigationData) {
  return fetchAPI<{ success: boolean; id: string; message: string }>('/api/investigacoes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Lista investigações do usuário
 */
export async function getInvestigations(params?: {
  status?: string
  categoria?: string
  busca?: string
  page?: number
  limit?: number
}) {
  const searchParams = new URLSearchParams()
  if (params?.status) searchParams.set('status', params.status)
  if (params?.categoria) searchParams.set('categoria', params.categoria)
  if (params?.busca) searchParams.set('busca', params.busca)
  if (params?.page) searchParams.set('page', params.page.toString())
  if (params?.limit) searchParams.set('limit', params.limit.toString())

  const query = searchParams.toString()
  return fetchAPI(`/api/investigacoes${query ? `?${query}` : ''}`)
}

/**
 * Busca detalhes de uma investigação
 */
export async function getInvestigationDetails(id: string) {
  return fetchAPI(`/api/investigacoes/${id}`)
}

/**
 * Estatísticas das investigações
 */
export async function getInvestigationsStats() {
  return fetchAPI('/api/investigacoes/stats')
}

/**
 * Importa múltiplas investigações (lote)
 */
export async function importInvestigations(data: {
  items: Array<{ nome: string; documento: string; tipo_pessoa?: string }>
  grupo_nome?: string
  categoria?: string
  nivel_urgencia?: string
  motivo_investigacao?: string
}) {
  return fetchAPI<{ success: boolean; imported: number; grupo: string; message: string }>('/api/investigacoes/import', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
