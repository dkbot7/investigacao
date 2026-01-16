/**
 * User Investigacoes Types
 *
 * Tipos TypeScript para investigações de usuários
 * Integração com endpoints do Agent 2
 */

/**
 * Tipo de pessoa investigada
 */
export type TipoPessoa = 'fisica' | 'juridica'

/**
 * Categoria da investigação
 */
export type CategoriaInvestigacao =
  | 'familia'
  | 'clientes'
  | 'funcionarios'
  | 'relacionamentos'
  | 'empresas'

/**
 * Status da investigação
 */
export type StatusInvestigacao =
  | 'investigar'
  | 'investigando'
  | 'relatorio'
  | 'monitoramento'
  | 'aprovado'
  | 'bloqueado'

/**
 * Nível de urgência
 */
export type NivelUrgencia = 'baixa' | 'media' | 'alta' | 'urgente'

/**
 * Investigação (entidade completa)
 */
export interface Investigacao {
  id: number
  tenant_id: number
  user_id: number
  nome: string
  documento: string
  tipo_pessoa: TipoPessoa
  categoria: CategoriaInvestigacao
  status: StatusInvestigacao
  nivel_urgencia: NivelUrgencia
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
  escopo_investigacao?: string
  observacoes?: string
  prazo_desejado?: string
  created_at: string
  updated_at: string
}

/**
 * Request para criar investigação
 */
export interface CreateInvestigacaoRequest {
  nome: string
  documento: string
  tipo_pessoa?: TipoPessoa
  categoria?: CategoriaInvestigacao
  status?: StatusInvestigacao
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
  escopo_investigacao?: string
  observacoes?: string
  prazo_desejado?: string
}

/**
 * Request para atualizar investigação (todos os campos opcionais)
 */
export interface UpdateInvestigacaoRequest {
  nome?: string
  documento?: string
  tipo_pessoa?: TipoPessoa
  categoria?: CategoriaInvestigacao
  status?: StatusInvestigacao
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
  escopo_investigacao?: string
  observacoes?: string
  prazo_desejado?: string
}

/**
 * Response de criar/buscar investigação
 */
export interface InvestigacaoApiResponse {
  success: boolean
  investigacao: Investigacao
}

/**
 * Response de listar investigações
 */
export interface ListInvestigacoesResponse {
  success: boolean
  investigacoes: Investigacao[]
  total: number
  limit: number
  offset: number
}

/**
 * Filtros para listar investigações
 */
export interface ListInvestigacoesFilters {
  status?: StatusInvestigacao
  categoria?: CategoriaInvestigacao
  limit?: number
  offset?: number
}
