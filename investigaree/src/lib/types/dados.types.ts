/**
 * Dados Types - Agent 3
 *
 * TypeScript types para dados (funcionários, vínculos, jobs)
 *
 * IMPORTANTE: Estes types correspondem aos endpoints do backend (Agent 2).
 * Qualquer mudança no backend deve ser refletida aqui.
 */

// ============================================================================
// FUNCIONÁRIO
// ============================================================================

/**
 * Funcionário com dados do D1 + cache SERPRO
 *
 * Fonte: GET /api/admin/tenants/:code/funcionarios
 */
export interface Funcionario {
  // ========================================
  // Dados básicos (tabela D1: funcionarios)
  // ========================================
  id: number
  cpf: string
  nome: string
  grupo: string
  cargo: string
  salario: number

  // ========================================
  // Dados SERPRO (tabela D1: serpro_cpf_cache)
  // ========================================
  nascimento: string // "DD/MM/YYYY"
  situacao_descricao: string // "REGULAR", "SUSPENSA", "CANCELADA", "NULA", "TITULAR FALECIDO"

  // ========================================
  // Cache status
  // ========================================
  cache_status: 'cached' | 'pending' | 'expired'
  // cached  = Dados válidos no cache (< 90 dias)
  // pending = CPF aguardando job processar
  // expired = Cache expirado (> 90 dias)

  // ========================================
  // Flags enriquecidos (quando cache_status === 'cached')
  // ========================================
  esta_morto: 0 | 1 // situacao_descricao === "TITULAR FALECIDO"
  recebe_beneficio: 0 | 1 // TODO: integrar com API Benefícios
  socio_empresa: 0 | 1 // TODO: integrar com API CNPJ QSA
  tem_divida_ativa: 0 | 1 // TODO: integrar com API Dívida Ativa
  possui_imoveis: 0 | 1 // TODO: integrar com API Imóveis
  possui_veiculos: 0 | 1 // TODO: integrar com API Veículos

  // ========================================
  // Metadados
  // ========================================
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

/**
 * Estatísticas de cache
 *
 * Usado para mostrar badge no dashboard
 */
export interface CacheStats {
  cached: number // Quantidade de registros com cache válido
  pending: number // Quantidade pendente de consulta
  expired: number // Quantidade com cache expirado
  percentage: number // % de cobertura de cache (0-100)
}

/**
 * Response de GET /api/admin/tenants/:code/funcionarios
 */
export interface ListFuncionariosResponse {
  funcionarios: Funcionario[]
  total: number
  cache_stats: CacheStats
}

/**
 * Request de POST /api/admin/import-funcionarios
 */
export interface ImportFuncionariosRequest {
  tenant_code: string
  funcionarios: Array<{
    cpf: string
    grupo?: string
    cargo?: string
    salario?: number
  }>
}

/**
 * Response de POST /api/admin/import-funcionarios
 */
export interface ImportFuncionariosResponse {
  success: boolean
  message: string
  funcionarios_imported: number
  job_created: boolean
  job_id: number | null
  tenant_code: string
}

// ============================================================================
// JOB (Background Processing)
// ============================================================================

/**
 * Tipo de job de processamento
 */
export type JobType =
  | 'consultar_cpf_batch' // Consultar múltiplos CPFs via SERPRO
  | 'refresh_cache_cpf' // Atualizar cache expirado
  | 'consultar_cnpj_batch' // Consultar múltiplos CNPJs via SERPRO
  | 'enrich_funcionarios' // Enriquecer dados (flags)

/**
 * Status do job
 */
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed'

/**
 * Job de processamento em background
 *
 * Fonte: GET /api/admin/jobs
 */
export interface Job {
  // ========================================
  // Identificação
  // ========================================
  id: number
  type: JobType
  tenant_code: string

  // ========================================
  // Status
  // ========================================
  status: JobStatus
  progress: number // 0-100

  // ========================================
  // Contadores
  // ========================================
  items_total: number
  items_processed: number
  items_failed: number

  // ========================================
  // Retry
  // ========================================
  retry_count: number
  max_retries: number

  // ========================================
  // Prioridade
  // ========================================
  priority: number // 1-10 (1 = maior prioridade)

  // ========================================
  // Timestamps
  // ========================================
  created_at: string // ISO 8601
  started_at?: string // ISO 8601
  completed_at?: string // ISO 8601

  // ========================================
  // Dados (JSON)
  // ========================================
  data_json: string // Stringified JSON: { cpfs: ["123...", "456..."] }
  error_message?: string
}

/**
 * Response de GET /api/admin/jobs
 */
export interface ListJobsResponse {
  jobs: Job[]
  total: number
}

/**
 * Response de POST /api/admin/process-jobs
 */
export interface ProcessJobsResponse {
  success: boolean
  jobs_found: number
  message: string
}

// ============================================================================
// VÍNCULO (Futuro)
// ============================================================================

/**
 * Vínculo empregatício
 *
 * TODO: Implementar quando backend criar endpoint
 * Endpoint futuro: GET /api/admin/tenants/:code/vinculos
 */
export interface Vinculo {
  id: number
  cpf: string
  cnpj: string
  razao_social: string
  cargo: string
  admissao: string // "DD/MM/YYYY"
  demissao?: string // "DD/MM/YYYY"
  ativo: boolean
  salario?: number
  created_at: string // ISO 8601
  updated_at: string // ISO 8601
}

/**
 * Response de GET /api/admin/tenants/:code/vinculos (futuro)
 */
export interface ListVinculosResponse {
  vinculos: Vinculo[]
  total: number
}

// ============================================================================
// ÓBITO (Futuro)
// ============================================================================

/**
 * Registro de óbito
 *
 * TODO: Implementar quando backend integrar com API Óbitos
 */
export interface Obito {
  id: number
  cpf: string
  nome: string
  data_obito: string // "DD/MM/YYYY"
  certidao: string
  cartorio: string
  created_at: string // ISO 8601
}

// ============================================================================
// BENEFÍCIO (Futuro)
// ============================================================================

/**
 * Benefício social
 *
 * TODO: Implementar quando backend integrar com API Benefícios
 */
export interface Beneficio {
  id: number
  cpf: string
  nome: string
  tipo_beneficio: string // "BOLSA_FAMILIA", "BPC", "AUXILIO_BRASIL", etc.
  valor: number
  data_inicio: string // "DD/MM/YYYY"
  data_fim?: string // "DD/MM/YYYY"
  ativo: boolean
  created_at: string // ISO 8601
}

// ============================================================================
// SANÇÃO (Futuro)
// ============================================================================

/**
 * Sanção (CEIS, CNEP, etc.)
 *
 * TODO: Implementar quando backend integrar com API Sanções
 */
export interface Sancao {
  id: number
  cpf_cnpj: string
  nome_razao_social: string
  tipo_sancao: 'CEIS' | 'CNEP' | 'CEPIM' | 'OFAC'
  orgao_sancionador: string
  data_inicio: string // "DD/MM/YYYY"
  data_fim?: string // "DD/MM/YYYY"
  ativo: boolean
  descricao: string
  created_at: string // ISO 8601
}

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Filtros genéricos para listagens
 */
export interface ListFilters {
  page?: number
  limit?: number
  search?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Resposta paginada genérica
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

/**
 * Resposta de erro da API
 */
export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}
