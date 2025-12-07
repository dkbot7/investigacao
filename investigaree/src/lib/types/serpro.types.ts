/**
 * SERPRO API Types
 *
 * Types para as respostas das APIs do SERPRO
 */

// ============================================
// CPF - Consulta
// ============================================

export interface CpfSituacao {
  codigo: string
  descricao: string
}

export interface CpfResponse {
  ni: string // CPF
  nome: string
  nascimento: string // YYYY-MM-DD
  situacao: CpfSituacao
}

export interface CpfConsultaRequest {
  cpf: string
}

// ============================================
// CNPJ - Consulta Básica
// ============================================

export interface CnpjBasicaResponse {
  ni: string // CNPJ
  razaoSocial: string
  nomeFantasia?: string
  dataAbertura: string
  cnae: string
  naturezaJuridica: string
  situacaoCadastral: string
  motivoSituacaoCadastral?: string
  endereço: {
    logradouro: string
    numero: string
    complemento?: string
    bairro: string
    cep: string
    municipio: string
    uf: string
  }
  telefone?: string
  email?: string
  capitalSocial?: number
}

// ============================================
// CNPJ - Quadro de Sócios e Administradores (QSA)
// ============================================

export interface CnpjSocio {
  cpfCnpj: string
  nome: string
  qualificacao: string
  dataEntrada?: string
  percentualCapital?: number
  cpfRepresentanteLegal?: string
  nomeRepresentanteLegal?: string
  qualificacaoRepresentanteLegal?: string
}

export interface CnpjQsaResponse {
  ni: string // CNPJ
  razaoSocial: string
  qsa: CnpjSocio[]
}

// ============================================
// CNPJ - Estabelecimento/Empresa Completo
// ============================================

export interface CnpjEmpresaResponse extends CnpjBasicaResponse {
  qsa?: CnpjSocio[]
  atividadesPrincipais: Array<{
    codigo: string
    descricao: string
  }>
  atividadesSecundarias?: Array<{
    codigo: string
    descricao: string
  }>
}

export interface CnpjConsultaRequest {
  cnpj: string
}

// ============================================
// Dívida Ativa - Consulta
// ============================================

export interface DividaAtivaItem {
  numeroInscricao: string
  tipo: 'UNIÃO' | 'PREVIDENCIÁRIA'
  situacao: string
  dataInscricao: string
  valorConsolidado: number
  orgaoOrigem?: string
  numeroProcesso?: string
}

export interface DividaAtivaResponse {
  ni: string // CPF ou CNPJ
  tipoPessoa: 'FISICA' | 'JURIDICA'
  nome?: string
  dividas: DividaAtivaItem[]
  totalDividas: number
  valorTotal: number
}

export interface DividaAtivaConsultaRequest {
  ni: string // CPF ou CNPJ
}

// ============================================
// Renda - Consulta
// ============================================

export interface RendaResponse {
  cpf: string
  anoExercicio: string
  rendimentos: {
    total: number
    tributavel: number
    isento: number
  }
  imposto: {
    devido: number
    pago: number
    restituir?: number
    pagar?: number
  }
}

export interface RendaConsultaRequest {
  cpf: string
  anoExercicio?: string
}

// ============================================
// Faturamento - Consulta
// ============================================

export interface FaturamentoResponse {
  cnpj: string
  anoCalendario: string
  receitaBruta: number
  impostos: {
    total: number
    irpj?: number
    csll?: number
    pis?: number
    cofins?: number
  }
}

export interface FaturamentoConsultaRequest {
  cnpj: string
  anoCalendario?: string
}

// ============================================
// DataValid - Biometria Facial
// ============================================

export interface DataValidBiometriaRequest {
  cpf: string
  fotoBase64: string // Base64 da foto para comparação
}

export interface DataValidBiometriaResponse {
  cpf: string
  nome: string
  similarity: number // 0 a 1
  match: boolean
  confidence: 'LOW' | 'MEDIUM' | 'HIGH'
}

// ============================================
// DataValid - Validação de Documentos
// ============================================

export interface DataValidDocumentoRequest {
  cpf: string
  nome: string
  dataNascimento: string
  nomeMae?: string
}

export interface DataValidDocumentoResponse {
  cpf: string
  cpfValido: boolean
  nomeValido: boolean
  dataNascimentoValida: boolean
  nomeMaeValida?: boolean
  probabilidade: number // 0 a 1
  situacaoCpf: string
}

// ============================================
// Consulta CND - Certidão Negativa de Débitos
// ============================================

export interface CndResponse {
  ni: string
  tipoPessoa: 'FISICA' | 'JURIDICA'
  certidoes: Array<{
    tipo: 'FEDERAL' | 'TRABALHISTA' | 'FGTS'
    situacao: 'POSITIVA' | 'NEGATIVA'
    numero?: string
    dataEmissao?: string
    dataValidade?: string
    url?: string
  }>
}

export interface CndConsultaRequest {
  ni: string
}

// ============================================
// Generic Response Wrapper
// ============================================

export interface SerproApiResponse<T> {
  success: boolean
  data: T
  error?: {
    code: string
    message: string
  }
  timestamp: string
  requestId?: string
}

// ============================================
// Error Types
// ============================================

export class SerproError extends Error {
  code: string
  status?: number

  constructor(message: string, code: string, status?: number) {
    super(message)
    this.name = 'SerproError'
    this.code = code
    this.status = status
  }
}
