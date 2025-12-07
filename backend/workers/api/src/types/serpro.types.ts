// ============================================================================
// SERPRO API TYPES - Response Interfaces
// Agent 2 - Backend Engineer
// ============================================================================

/**
 * CPF Consultation Response
 * API: Consulta CPF DF v2
 * Endpoint: /consulta-cpf-df/v2/cpf/{ni}
 */
export interface CpfResponse {
  ni: string; // CPF
  nome: string; // Nome completo
  situacao: {
    codigo: string; // 0=Regular, 2=Suspensa, 3=Cancelada, 4=Nula, etc
    descricao: string;
  };
  nascimento: string; // DD/MM/YYYY
  timestamp?: string; // Carimbo de tempo (se contratado)
}

/**
 * CNPJ Consultation Response
 * API: Consulta CNPJ DF v2
 * Endpoints:
 * - /basica/{cnpj} - CPF mascarado no QSA
 * - /qsa/{cnpj} - CPF mascarado no QSA
 * - /empresa/{cnpj} - CPF DESMASCARADO (ideal para investigação)
 */
export interface CnpjResponse {
  ni: string; // CNPJ
  razaoSocial: string;
  nomeFantasia?: string;
  situacaoCadastral: {
    codigo: string;
    data: string;
    motivo?: string;
  };
  naturezaJuridica: {
    codigo: string;
    descricao: string;
  };
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
  };
  qsa?: Array<{
    // Quadro de sócios (se endpoint empresa)
    nome: string;
    cpf: string; // Desmascarado apenas no endpoint /empresa
    qualificacao: string;
  }>;
  timestamp?: string;
}

/**
 * Dívida Ativa Response
 * API: Consulta Dívida Ativa v1
 * Endpoint: /consulta-divida-ativa/v1/divida/{ni}
 */
export interface DividaAtivaResponse {
  ni: string; // CPF ou CNPJ
  dividas: Array<{
    numero: string;
    tipo: string;
    situacao: string;
    dataInscricao: string;
    valor: number;
    orgao: string;
  }>;
  timestamp?: string;
}

/**
 * Consulta Renda Response
 * API: Consulta Renda v1
 * Endpoint: /consulta-renda/v1/renda/{cpf}
 */
export interface RendaResponse {
  ni: string; // CPF
  anoExercicio: string;
  rendimentos: {
    total: number;
    tributavel: number;
    isentos: number;
    exclusivos: number;
  };
  deducoes?: {
    total: number;
    previdencia: number;
    dependentes: number;
  };
  timestamp?: string;
}

/**
 * Consulta Faturamento Response
 * API: Consulta Faturamento v1
 * Endpoint: /consulta-faturamento/v1/faturamento/{cnpj}
 */
export interface FaturamentoResponse {
  ni: string; // CNPJ
  anoExercicio: string;
  faturamento: {
    total: number;
    janeiro?: number;
    fevereiro?: number;
    marco?: number;
    abril?: number;
    maio?: number;
    junho?: number;
    julho?: number;
    agosto?: number;
    setembro?: number;
    outubro?: number;
    novembro?: number;
    dezembro?: number;
  };
  timestamp?: string;
}

/**
 * DataValid Response
 * API: DataValid V4
 * Endpoint: /datavalid/v4/validate
 */
export interface DataValidResponse {
  cpf: string;
  nome: string;
  dataNascimento: string;
  situacaoCpf: string;
  biometria?: {
    probabilidade: number; // 0-100
    similaridade: string; // ALTA, MEDIA, BAIXA
  };
  validacao: {
    cpf: boolean;
    nome: boolean;
    dataNascimento: boolean;
  };
  timestamp?: string;
}

/**
 * CND Response
 * API: Consulta CND v1
 * Endpoint: /consulta-cnd/v1/cnd/{ni}
 */
export interface CndResponse {
  ni: string; // CPF ou CNPJ
  tipo: string; // PESSOA_FISICA, PESSOA_JURIDICA
  certidoes: Array<{
    tipo: string; // FEDERAL, ESTADUAL, MUNICIPAL, TRABALHISTA
    situacao: string; // REGULAR, IRREGULAR
    numero?: string;
    dataEmissao?: string;
    validade?: string;
  }>;
  timestamp?: string;
}

/**
 * Integra Contador Response
 * API: Integra Contador v1
 */
export interface IntegraContadorResponse {
  ni: string;
  tipo: string;
  dados: Record<string, unknown>;
  timestamp?: string;
}

/**
 * Raiz Tech Pastagens Response
 * API: Raiz Tech Pastagens
 */
export interface RaizTechResponse {
  codigoAnalise: string;
  area: number;
  qualidade: string;
  biomassa: number;
  timestamp?: string;
}

/**
 * SERPRO Error Response
 */
export interface SerproErrorResponse {
  status: number;
  message: string;
  code?: string;
  detail?: string;
}

/**
 * OAuth2 Token Response
 */
export interface OAuth2TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}
