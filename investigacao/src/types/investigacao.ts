/**
 * Tipos para o sistema de investigações
 */

export type TipoPessoa = "fisica" | "juridica";

export type StatusInvestigacao =
  | "investigar"
  | "investigando"
  | "relatorio"
  | "monitoramento"
  | "aprovado"
  | "bloqueado";

export type NivelUrgencia = "baixa" | "media" | "alta" | "urgente";

export type Categoria = "familia" | "clientes" | "funcionarios" | "relacionamentos" | "empresas";

export interface EscopoInvestigacao {
  antecedentes_criminais?: boolean;
  processos_judiciais?: boolean;
  situacao_fiscal?: boolean;
  vinculos_empresariais?: boolean;
  comportamento_rotina?: boolean;
  verificacao_informacoes?: boolean;
}

export interface RedesSociais {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

export interface Pessoa {
  id: string;
  tenant_id: string;

  // Tipo e categorias
  tipo_pessoa: TipoPessoa;
  categorias: Categoria[]; // Múltiplas categorias

  // Dados básicos
  nome: string;
  cpf?: string; // Para pessoa física
  cnpj?: string; // Para pessoa jurídica
  rg?: string;
  data_nascimento?: string;
  estado_civil?: string;
  profissao?: string;

  // Contato
  telefones?: string[];
  email?: string;
  endereco?: string;
  redes_sociais?: RedesSociais;

  // Investigação
  status_investigacao: StatusInvestigacao;
  motivo_investigacao?: string;
  nivel_urgencia: NivelUrgencia;
  escopo_investigacao?: EscopoInvestigacao;
  prazo_desejado?: string;
  orcamento_maximo?: number;
  observacoes?: string;

  // Campos adicionais
  placa_veiculo?: string;
  local_trabalho?: string;
  grupo?: string; // Mantido para compatibilidade

  // Campos de investigação (resultado das consultas)
  cpf_valido?: number;
  esta_vivo?: string;
  esta_morto?: string;
  ano_obito?: number;
  volume_patrimonio?: number;
  descricao_patrimonio?: string;
  recebe_beneficio?: number;
  qual_beneficio?: string;
  socio_empresa?: number;
  qtd_empresas?: number;
  vinculo_empresa?: number;
  doador_campanha?: number;
  valor_doacoes?: number;
  candidato?: number;
  sancionado_ceis?: number;
  sancionado_ofac?: number;
  tem_processo?: number;
  qtd_processos?: number;

  // Metadata
  created_at?: string;
  updated_at?: string;
}

// Interface para o formulário de adição
export interface AddPessoaFormData {
  tipo_pessoa: TipoPessoa;
  categorias: Categoria[];

  // Dados básicos
  nome: string;
  cpf_cnpj: string;
  rg?: string;
  data_nascimento?: string;
  estado_civil?: string;
  profissao?: string;

  // Contato
  telefones: string[];
  email?: string;
  endereco?: string;
  redes_sociais: RedesSociais;

  // Investigação
  motivo_investigacao: string;
  nivel_urgencia: NivelUrgencia;
  escopo_investigacao: EscopoInvestigacao;
  prazo_desejado?: string;
  orcamento_maximo?: string;
  observacoes?: string;

  // Adicionais
  placa_veiculo?: string;
  local_trabalho?: string;
  grupo?: string;
}

//Interface para API payload
export interface AddPessoaPayload {
  nome: string;
  cpf?: string;
  cnpj?: string;
  tipo_pessoa: TipoPessoa;
  categorias: string; // JSON stringified array
  status_investigacao: StatusInvestigacao;

  // Dados pessoais
  rg?: string | null;
  data_nascimento?: string | null;
  estado_civil?: string | null;
  profissao?: string | null;

  // Contato
  telefones?: string | null; // JSON stringified array
  email?: string | null;
  endereco?: string | null;
  redes_sociais?: string | null; // JSON stringified object

  // Investigação
  motivo_investigacao: string;
  nivel_urgencia: NivelUrgencia;
  escopo_investigacao?: string | null; // JSON stringified object
  prazo_desejado?: string | null;
  orcamento_maximo?: number | null;
  observacoes?: string | null;

  // Opcionais
  placa_veiculo?: string | null;
  local_trabalho?: string | null;
  grupo?: string;
}
