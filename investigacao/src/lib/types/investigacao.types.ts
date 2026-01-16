/**
 * Tipos para o módulo de Investigações
 *
 * Agrupa todos os dados de investigações: funcionários, óbitos, vínculos, etc.
 */

// ============================================
// Tipos Base
// ============================================

export interface Funcionario {
  id: string
  cadastro?: string
  nome: string
  cpf: string
  grupo: string
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
  is_grupo?: number
  grupo_total_documentos?: number
}

export interface Obito {
  id: string
  cadastro?: string
  nome: string
  cpf: string
  grupo: string
  ano_obito: number
}

export interface Vinculo {
  nome: string
  cpf: string
  cnpj: string
  razao_social: string
  qualificacao: string
  situacao_cadastral: string
  grupo: string
}

export interface Candidatura {
  nome: string
  cpf: string
  ano: number
  cargo: string
  partido: string
  situacao: string
  votos?: number
}

export interface Doacao {
  nome: string
  cpf: string
  ano: number
  valor: number
  candidato: string
  partido: string
}

export interface Sancao {
  nome: string
  cpf: string
  tipo: string
  orgao: string
  data_inicio: string
  data_fim?: string
  fundamentacao: string
}

export interface Beneficio {
  nome: string
  cpf: string
  tipo: string
  valor?: number
  data_inicio: string
  situacao: string
}

export interface OFACMatch {
  nome: string
  cpf_cnpj: string
  match_type: string
  similarity: number
  ofac_name: string
  ofac_program: string
  ofac_remarks?: string
}

// ============================================
// Estatísticas
// ============================================

export interface InvestigacaoStats {
  tenant: {
    code: string
    name: string
  }
  totalFuncionarios: number
  totais: {
    obitos: number
    candidatos: number
    doadores: number
    sancionados: number
    beneficiarios: number
    socios: number
    cnpjs: number
    ofacMatches: number
  }
  grupos: Array<{
    nome: string
    total: number
    registros: number
  }>
}

// ============================================
// API Responses
// ============================================

export interface FuncionariosResponse {
  funcionarios: Funcionario[]
  total: number
  page: number
  limit: number
}

export interface ObitosResponse {
  obitos: Obito[]
  total: number
}

export interface VinculosResponse {
  vinculos: Vinculo[]
  total: number
}

export interface CandidaturasResponse {
  candidaturas: Candidatura[]
  total: number
}

export interface DoacoesResponse {
  doacoes: Doacao[]
  total: number
}

export interface SancoesResponse {
  sancoes: Sancao[]
  total: number
}

export interface BeneficiosResponse {
  beneficios: Beneficio[]
  total: number
}

export interface OFACMatchesResponse {
  matches: OFACMatch[]
  total: number
}

// ============================================
// Request Types
// ============================================

export interface CreateInvestigacaoRequest {
  nome: string
  cpf: string
  grupo: string
  cargo?: string
  tipo: 'funcionario' | 'familiar' | 'cliente' | 'colaborador' | 'relacionamento' | 'empresa'
}

export interface UpdateInvestigacaoRequest {
  nome?: string
  grupo?: string
  cargo?: string
}

export interface InvestigacaoFilters {
  grupo?: string
  tipo?: 'obito' | 'beneficio' | 'sancionado' | 'doador' | 'candidato' | 'socio' | 'grupos'
  search?: string
  page?: number
  limit?: number
}

// ============================================
// Error Types
// ============================================

export class InvestigacaoError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'InvestigacaoError'
  }
}
