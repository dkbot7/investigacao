/**
 * User Data API Client
 * Funcoes para acessar dados individuais do usuario
 * TODOS OS DADOS SAO ISOLADOS POR USUARIO
 */

import { auth } from './firebase'

// Detectar automaticamente se está rodando em localhost
const isLocalhost = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
)

// Se localhost, usa próprio servidor Next.js (API Routes)
// Se produção, usa Worker da Cloudflare
const API_URL = isLocalhost
  ? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')
  : (process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br')

async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser
  if (!user) {
    throw new Error('Usuario nao autenticado')
  }

  const token = await user.getIdToken()
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = await getAuthHeaders()

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Erro na requisicao')
  }

  return data
}

// ============================================
// TYPES
// ============================================

export interface UserInfo {
  hasAccess: boolean
  user: {
    id: string
    email: string
  }
  tenant?: {
    id: string
    code: string
    name: string
    email: string
    status: string
  }
  settings: {
    empresa_nome?: string
    plano: string
    limite_funcionarios: number
  }
  stats: {
    total_funcionarios: number
  }
}

export interface DashboardData {
  user: {
    email: string
    empresa: string | null
    plano: string
  }
  stats: {
    total_funcionarios: number
    total_obitos: number
    total_beneficiarios: number
    total_sancionados: number
    total_doadores: number
    total_candidatos: number
    total_socios: number
  }
  grupos: Array<{
    grupo: string
    registros: number
    obitos: number
    beneficiarios: number
    sancionados: number
    doadores: number
    candidatos: number
    socios: number
  }>
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

export interface Funcionario {
  id: string
  cadastro?: string
  nome: string
  cpf: string
  grupo?: string
  cargo?: string
  salario?: number
  esta_vivo?: string
  esta_morto?: string
  ano_obito?: number
  recebe_beneficio?: number
  qual_beneficio?: string
  socio_empresa?: number
  qtd_empresas?: number
  doador_campanha?: number
  valor_doacoes?: number
  candidato?: number
  sancionado_ceis?: number
  sancionado_ofac?: number
}

export interface FuncionarioDetail extends Funcionario {
  candidaturas: Array<{
    cargo: string
    partido: string
    uf: string
    ano: number
    situacao: string
    votos: number
  }>
  doacoes: Array<{
    nome_candidato: string
    partido: string
    cargo: string
    ano: number
    valor: number
  }>
  vinculos: Array<{
    cnpj: string
    razao_social: string
    nome_fantasia?: string
    qualificacao: string
    situacao_cadastral: string
    capital_social?: number
  }>
  sancoes: Array<{
    tipo_sancao: string
    orgao_sancionador: string
    fundamentacao?: string
    data_inicio: string
    data_fim?: string
  }>
  beneficios: Array<{
    tipo_beneficio: string
    valor: number
    ano_referencia: number
  }>
}

export interface Obito {
  id: string
  cadastro?: string
  nome: string
  cpf: string
  grupo?: string
  cargo?: string
  data_admissao?: string
  salario?: number
  ano_obito?: number
  data_obito?: string
  fonte?: string
}

export interface Candidato {
  funcionario_id: string
  nome: string
  cpf: string
  grupo?: string
  cargo: string
  partido: string
  uf: string
  ano: number
  situacao: string
  votos: number
}

export interface Doador {
  funcionario_id: string
  nome_doador: string
  cpf_doador: string
  grupo?: string
  nome_candidato: string
  partido: string
  cargo: string
  ano: number
  valor: number
}

export interface Sancionado {
  funcionario_id: string
  nome: string
  cpf: string
  grupo?: string
  tipo_sancao: string
  orgao_sancionador: string
  fundamentacao?: string
  data_inicio: string
  data_fim?: string
}

export interface Vinculo {
  funcionario_id: string
  nome_socio: string
  cpf_socio: string
  grupo?: string
  cnpj: string
  razao_social: string
  nome_fantasia?: string
  qualificacao: string
  situacao_cadastral: string
  capital_social?: number
}

export interface Beneficio {
  funcionario_id: string
  nome: string
  cpf: string
  grupo?: string
  cargo?: string
  salario?: number
  tipo_beneficio: string
  valor: number
  ano_referencia: number
}

export interface Pagination {
  total: number
  page: number
  limit: number
  pages: number
}

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Obter informacoes do usuario logado
 */
export async function getUserInfo(): Promise<UserInfo> {
  // Buscar informacoes basicas do usuario
  const userInfo = await fetchAPI<UserInfo>('/api/userdata/info')

  // Buscar informacoes do tenant
  try {
    const tenantInfo = await fetchAPI<{
      hasAccess: boolean
      tenant: {
        id: string
        code: string
        name: string
        email: string
        status: string
      } | null
    }>('/api/tenants/info')

    // Adicionar tenant ao userInfo
    if (tenantInfo.tenant) {
      userInfo.tenant = tenantInfo.tenant
    }
  } catch (err) {
    console.warn('Erro ao buscar info do tenant:', err)
  }

  return userInfo
}

/**
 * Obter dados do dashboard
 */
export async function getDashboardData(): Promise<DashboardData> {
  return fetchAPI<DashboardData>('/api/userdata/dashboard')
}

/**
 * Listar funcionarios
 */
export async function getFuncionarios(params?: {
  grupo?: string
  busca?: string
  alerta?: string
  page?: number
  limit?: number
}): Promise<{ funcionarios: Funcionario[]; pagination: Pagination }> {
  const searchParams = new URLSearchParams()
  if (params?.grupo) searchParams.append('grupo', params.grupo)
  if (params?.busca) searchParams.append('busca', params.busca)
  if (params?.alerta) searchParams.append('alerta', params.alerta)
  if (params?.page) searchParams.append('page', String(params.page))
  if (params?.limit) searchParams.append('limit', String(params.limit))

  const query = searchParams.toString()
  return fetchAPI(`/api/userdata/funcionarios${query ? `?${query}` : ''}`)
}

/**
 * Obter detalhes de um funcionario
 */
export async function getFuncionarioDetail(id: string): Promise<{ funcionario: FuncionarioDetail }> {
  return fetchAPI(`/api/userdata/funcionario/${id}`)
}

/**
 * Adicionar funcionario
 */
export async function addFuncionario(data: {
  nome: string
  cpf: string
  grupo?: string
  cargo?: string
  salario?: number
}): Promise<{ success: boolean; id: string }> {
  return fetchAPI('/api/userdata/funcionarios', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

/**
 * Importar funcionarios em lote
 */
export async function importFuncionarios(funcionarios: Array<Partial<Funcionario>>): Promise<{
  success: boolean
  imported: number
  message: string
}> {
  return fetchAPI('/api/userdata/funcionarios/import', {
    method: 'POST',
    body: JSON.stringify({ funcionarios })
  })
}

/**
 * Listar obitos
 */
export async function getObitos(): Promise<{ obitos: Obito[]; total: number }> {
  return fetchAPI('/api/userdata/obitos')
}

/**
 * Listar candidatos
 */
export async function getCandidatos(): Promise<{ candidatos: Candidato[]; total: number }> {
  return fetchAPI('/api/userdata/candidatos')
}

/**
 * Listar doadores
 */
export async function getDoadores(): Promise<{ doadores: Doador[]; total: number; valor_total: number }> {
  return fetchAPI('/api/userdata/doadores')
}

/**
 * Listar sancionados
 */
export async function getSancionados(): Promise<{ sancionados: Sancionado[]; total: number }> {
  return fetchAPI('/api/userdata/sancionados')
}

/**
 * Listar vinculos empresariais
 */
export async function getVinculos(): Promise<{ vinculos: Vinculo[]; total: number; cnpjs_unicos: number }> {
  return fetchAPI('/api/userdata/vinculos')
}

/**
 * Listar beneficios
 */
export async function getBeneficios(): Promise<{ beneficios: Beneficio[]; total: number }> {
  return fetchAPI('/api/userdata/beneficios')
}

/**
 * Atualizar configuracoes do usuario
 */
export async function updateUserSettings(data: {
  empresa_nome?: string
  empresa_cnpj?: string
}): Promise<{ success: boolean }> {
  return fetchAPI('/api/userdata/settings', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}
