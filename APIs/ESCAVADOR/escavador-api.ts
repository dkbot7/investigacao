/**
 * ESCAVADOR API v2 - Cliente para consulta de processos judiciais
 * Documentação: https://api.escavador.com/v2/docs/
 *
 * Limite: 500 requisições por minuto
 * Autenticação: Bearer Token
 */

import https from 'https';
import dotenv from 'dotenv';

dotenv.config();

const ESCAVADOR_TOKEN = process.env.ESCAVADOR_TOKEN!;
const BASE_URL = 'api.escavador.com';

// ============================================
// TIPOS DE RESPOSTA
// ============================================

interface Estado {
  nome: string;
  sigla: string;
}

interface UnidadeOrigem {
  nome: string;
  endereco: string;
  classificacao: string;
  cidade: string;
  estado: Estado;
  tribunal_sigla: string;
}

interface Tribunal {
  id: number;
  nome: string;
  sigla: string;
  categoria: string | null;
  estados?: Estado[];
}

interface ValorCausa {
  valor: string | null;
  moeda: string | null;
  valor_formatado: string | null;
}

interface Assunto {
  id: number;
  nome: string;
  nome_com_pai: string;
  path_completo: string;
  bloqueado?: boolean;
}

interface Oab {
  uf: string;
  tipo: string;
  numero: number;
}

interface Envolvido {
  nome: string;
  quantidade_processos: number;
  tipo_pessoa: string | null;
  prefixo?: string | null;
  sufixo?: string | null;
  tipo: string | null;
  tipo_normalizado: string | null;
  polo: string | null;
  cpf?: string | null;
  cnpj?: string | null;
  oabs?: Oab[];
  advogados?: Envolvido[];
}

interface ProcessoFonteCapa {
  classe: string;
  assunto: string | null;
  assuntos_normalizados: Assunto[];
  assunto_principal_normalizado: Assunto | null;
  area: string | null;
  orgao_julgador: string | null;
  orgao_julgador_normalizado?: UnidadeOrigem | null;
  situacao?: string | null;
  valor_causa: ValorCausa | null;
  data_distribuicao: string | null;
  data_arquivamento: string | null;
  informacoes_complementares?: any[] | null;
}

interface Audiencia {
  tipo: string;
  data: string;
  quantidade_pessoas: number;
  situacao: string;
}

interface ProcessoFonte {
  id: number;
  processo_fonte_id: number;
  descricao: string;
  nome: string;
  sigla: string;
  tipo: string;
  data_inicio: string | null;
  data_ultima_movimentacao: string;
  segredo_justica: boolean | null;
  arquivado: boolean | null;
  status_predito: string | null;
  grau: number;
  grau_formatado: string;
  fisico: boolean;
  sistema: string;
  capa?: ProcessoFonteCapa;
  audiencias?: Audiencia[];
  url: string;
  tribunal?: Tribunal;
  quantidade_movimentacoes: number;
  quantidade_envolvidos?: number;
  data_ultima_verificacao: string;
  envolvidos: Envolvido[];
}

interface ProcessoRelacionado {
  numero: string;
}

interface Processo {
  numero_cnj: string;
  titulo_polo_ativo: string | null;
  titulo_polo_passivo: string | null;
  ano_inicio: number;
  data_inicio: string | null;
  estado_origem?: Estado;
  unidade_origem?: UnidadeOrigem;
  data_ultima_movimentacao: string;
  quantidade_movimentacoes: number;
  fontes_tribunais_estao_arquivadas: boolean;
  data_ultima_verificacao: string;
  tempo_desde_ultima_verificacao: string;
  processos_relacionados?: ProcessoRelacionado[];
  fontes: ProcessoFonte[];
}

interface MovimentacaoFonte {
  fonte_id: number;
  nome: string;
  tipo: string;
  sigla: string;
  grau: number;
  grau_formatado: string;
  caderno?: string | null;
}

interface Movimentacao {
  id: number;
  data: string;
  tipo: string;
  conteudo: string;
  fonte: MovimentacaoFonte;
}

interface EnvolvidoEncontrado {
  nome: string;
  tipo_pessoa: string;
  quantidade_processos: number;
}

interface ProcessosResponse {
  envolvido_encontrado?: EnvolvidoEncontrado;
  items: Processo[];
  links: {
    next: string | null;
  };
  paginator: {
    per_page: number;
  };
}

interface MovimentacoesResponse {
  items: Movimentacao[];
  links: {
    next: string | null;
  };
  paginator: {
    per_page: number;
  };
}

interface ResumoEnvolvidoResponse {
  nome: string;
  tipo_pessoa: string;
  quantidade_processos: number;
}

interface ResumoAdvogadoResponse {
  nome: string;
  tipo: string;
  quantidade_processos: number;
}

interface StatusAtualizacaoResponse {
  numero_cnj: string;
  data_ultima_verificacao: string | null;
  tempo_desde_ultima_verificacao: string | null;
  ultima_verificacao: {
    id: number;
    status: string;
    criado_em: string;
    concluido_em: string | null;
  } | null;
}

interface SolicitacaoAtualizacaoResponse {
  id: number;
  status: string;
  numero_cnj: string;
  criado_em: string;
  concluido_em: string | null;
}

interface TribunaisResponse {
  items: Tribunal[];
}

interface DocumentoProcesso {
  id: number;
  titulo: string;
  descricao: string;
  data: string;
  tipo: string;
  extensao_arquivo: string;
  quantidade_paginas: number | null;
  key: string;
  links: {
    api: string;
  };
}

interface DocumentosResponse {
  items: DocumentoProcesso[];
  links: {
    next: string | null;
    prev: string | null;
    first: string;
    last: string;
  };
  paginator: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

interface EnvolvidoProcesso {
  nome: string;
  quantidade_processos: number;
  tipo_pessoa: string;
  cpf: string | null;
  cnpj: string | null;
  participacoes_processo: {
    tipo: string;
    tipo_normalizado: string;
    polo: string | null;
    prefixo: string | null;
    sufixo: string | null;
    advogados: Envolvido[];
    fonte: {
      processo_fonte_id: number;
      id: number;
      tipo: string;
      nome: string;
      sigla: string;
      grau: number;
      grau_formatado: string;
    };
  }[];
}

interface EnvolvidosProcessoResponse {
  items: EnvolvidoProcesso[];
  links: {
    next: string | null;
  };
  paginator: {
    per_page: number;
  };
}

// Monitoramentos
interface MonitoramentoNovosProcessos {
  id: number;
  termo: string;
  criado_em: string;
  variacoes: string[];
  termos_auxiliares: {
    CONTEM?: string[];
    NAO_CONTEM?: string[];
    CONTEM_ALGUMA?: string[];
  };
  tribunais_especificos: string[];
}

interface MonitoramentoProcesso {
  id: number;
  numero: string;
  criado_em: string;
  data_ultima_verificacao: string | null;
  tribunais: Tribunal[];
  frequencia: string;
  status: string;
}

interface ResultadoMonitoramento {
  numero_cnj: string;
  data_inicio: string;
  tribunal: string;
  match: string;
  estado_origem: Estado;
}

// ============================================
// FUNÇÃO BASE DE REQUISIÇÃO
// ============================================

async function escavadorRequest<T>(
  path: string,
  method: string = 'GET',
  body?: object
): Promise<T> {
  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname: BASE_URL,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${ESCAVADOR_TOKEN}`,
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Log do custo em créditos (header Creditos-Utilizados)
          const creditos = res.headers['creditos-utilizados'];
          if (creditos) {
            console.log(`[ESCAVADOR] Créditos utilizados: ${creditos} centavos`);
          }

          if (res.statusCode === 200 || res.statusCode === 201) {
            resolve(JSON.parse(data) as T);
          } else if (res.statusCode === 204) {
            resolve({} as T);
          } else if (res.statusCode === 401) {
            reject(new Error('Token inválido ou expirado'));
          } else if (res.statusCode === 402) {
            reject(new Error('Saldo insuficiente de créditos na API'));
          } else if (res.statusCode === 404) {
            reject(new Error('Recurso não encontrado'));
          } else if (res.statusCode === 422) {
            const error = JSON.parse(data);
            reject(new Error(`Erro de validação: ${error.message || data}`));
          } else if (res.statusCode === 429) {
            reject(new Error('Limite de 500 requisições/minuto excedido. Aguarde.'));
          } else {
            reject(new Error(`Erro ${res.statusCode}: ${data}`));
          }
        } catch (e) {
          reject(new Error(`Erro ao parsear resposta: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Erro na requisição: ${e.message}`));
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// ============================================
// CONSULTA DE PROCESSOS
// ============================================

/**
 * Busca processo por número CNJ
 * @param numeroCnj - Número do processo no formato CNJ (NNNNNNN-DD.AAAA.J.TR.OOOO)
 */
export async function buscarProcessoPorNumeroCnj(numeroCnj: string): Promise<Processo> {
  console.log(`[ESCAVADOR] Buscando processo: ${numeroCnj}`);
  const path = `/api/v2/processos/numero_cnj/${encodeURIComponent(numeroCnj)}`;
  return escavadorRequest<Processo>(path);
}

/**
 * Busca movimentações de um processo
 * @param numeroCnj - Número do processo no formato CNJ
 * @param limite - Quantidade de movimentações (50 ou 100)
 */
export async function buscarMovimentacoesProcesso(
  numeroCnj: string,
  limite: number = 50
): Promise<MovimentacoesResponse> {
  console.log(`[ESCAVADOR] Buscando movimentações: ${numeroCnj}`);
  const path = `/api/v2/processos/numero_cnj/${encodeURIComponent(numeroCnj)}/movimentacoes?limit=${limite}`;
  return escavadorRequest<MovimentacoesResponse>(path);
}

/**
 * Busca processos de um envolvido por CPF ou CNPJ
 * @param cpfCnpj - CPF ou CNPJ (apenas números)
 * @param opcoes - Opções de filtro
 */
export async function buscarProcessosPorCpfCnpj(
  cpfCnpj: string,
  opcoes?: {
    ordem?: 'asc' | 'desc';
    limite?: 50 | 100;
    tribunais?: string[];
    incluirHomonimos?: boolean;
    status?: 'ATIVO' | 'INATIVO';
    dataMinima?: string;
    dataMaxima?: string;
  }
): Promise<ProcessosResponse> {
  const documento = cpfCnpj.replace(/\D/g, '');
  console.log(`[ESCAVADOR] Buscando processos por documento: ${documento.substring(0, 3)}...`);

  let path = `/api/v2/envolvido/processos?cpf_cnpj=${documento}`;

  if (opcoes?.ordem) path += `&ordem=${opcoes.ordem}`;
  if (opcoes?.limite) path += `&limit=${opcoes.limite}`;
  if (opcoes?.incluirHomonimos) path += `&incluir_homonimos=true`;
  if (opcoes?.status) path += `&status=${opcoes.status}`;
  if (opcoes?.dataMinima) path += `&data_minima=${opcoes.dataMinima}`;
  if (opcoes?.dataMaxima) path += `&data_maxima=${opcoes.dataMaxima}`;
  if (opcoes?.tribunais) {
    opcoes.tribunais.forEach(t => path += `&tribunais[]=${t}`);
  }

  return escavadorRequest<ProcessosResponse>(path);
}

/**
 * Busca processos de um envolvido por nome
 * @param nome - Nome da pessoa ou empresa
 * @param opcoes - Opções de filtro
 */
export async function buscarProcessosPorNome(
  nome: string,
  opcoes?: {
    ordem?: 'asc' | 'desc';
    limite?: 50 | 100;
    tribunais?: string[];
    status?: 'ATIVO' | 'INATIVO';
    dataMinima?: string;
    dataMaxima?: string;
  }
): Promise<ProcessosResponse> {
  console.log(`[ESCAVADOR] Buscando processos por nome: ${nome}`);

  let path = `/api/v2/envolvido/processos?nome=${encodeURIComponent(nome)}`;

  if (opcoes?.ordem) path += `&ordem=${opcoes.ordem}`;
  if (opcoes?.limite) path += `&limit=${opcoes.limite}`;
  if (opcoes?.status) path += `&status=${opcoes.status}`;
  if (opcoes?.dataMinima) path += `&data_minima=${opcoes.dataMinima}`;
  if (opcoes?.dataMaxima) path += `&data_maxima=${opcoes.dataMaxima}`;
  if (opcoes?.tribunais) {
    opcoes.tribunais.forEach(t => path += `&tribunais[]=${t}`);
  }

  return escavadorRequest<ProcessosResponse>(path);
}

/**
 * Obtém resumo do envolvido (quantidade de processos)
 * @param cpfCnpj - CPF ou CNPJ (apenas números)
 */
export async function obterResumoEnvolvido(cpfCnpj: string): Promise<ResumoEnvolvidoResponse> {
  const documento = cpfCnpj.replace(/\D/g, '');
  console.log(`[ESCAVADOR] Obtendo resumo: ${documento.substring(0, 3)}...`);
  const path = `/api/v2/envolvido/resumo?cpf_cnpj=${documento}`;
  return escavadorRequest<ResumoEnvolvidoResponse>(path);
}

/**
 * Obtém resumo do envolvido por nome
 * @param nome - Nome da pessoa ou empresa
 */
export async function obterResumoEnvolvidoPorNome(nome: string): Promise<ResumoEnvolvidoResponse> {
  console.log(`[ESCAVADOR] Obtendo resumo por nome: ${nome}`);
  const path = `/api/v2/envolvido/resumo?nome=${encodeURIComponent(nome)}`;
  return escavadorRequest<ResumoEnvolvidoResponse>(path);
}

/**
 * Busca processos de um advogado por OAB
 * @param numero - Número da OAB
 * @param estado - Estado da OAB (sigla)
 * @param opcoes - Opções de filtro
 */
export async function buscarProcessosPorOab(
  numero: string,
  estado: string,
  opcoes?: {
    tipo?: 'ADVOGADO' | 'SUPLEMENTAR' | 'ESTAGIARIO' | 'CONSULTOR_ESTRANGEIRO';
    ordem?: 'asc' | 'desc';
    limite?: 50 | 100;
    tribunais?: string[];
    status?: 'ATIVO' | 'INATIVO';
    dataMinima?: string;
    dataMaxima?: string;
  }
): Promise<ProcessosResponse> {
  console.log(`[ESCAVADOR] Buscando processos por OAB: ${numero}/${estado}`);

  let path = `/api/v2/advogado/processos?oab_numero=${numero}&oab_estado=${estado}`;

  if (opcoes?.tipo) path += `&oab_tipo=${opcoes.tipo}`;
  if (opcoes?.ordem) path += `&ordem=${opcoes.ordem}`;
  if (opcoes?.limite) path += `&limit=${opcoes.limite}`;
  if (opcoes?.status) path += `&status=${opcoes.status}`;
  if (opcoes?.dataMinima) path += `&data_minima=${opcoes.dataMinima}`;
  if (opcoes?.dataMaxima) path += `&data_maxima=${opcoes.dataMaxima}`;
  if (opcoes?.tribunais) {
    opcoes.tribunais.forEach(t => path += `&tribunais[]=${t}`);
  }

  return escavadorRequest<ProcessosResponse>(path);
}

/**
 * Obtém resumo do advogado por OAB
 */
export async function obterResumoAdvogado(
  numero: string,
  estado: string,
  tipo?: 'ADVOGADO' | 'SUPLEMENTAR' | 'ESTAGIARIO' | 'CONSULTOR_ESTRANGEIRO'
): Promise<ResumoAdvogadoResponse> {
  console.log(`[ESCAVADOR] Obtendo resumo advogado: ${numero}/${estado}`);
  let path = `/api/v2/advogado/resumo?oab_numero=${numero}&oab_estado=${estado}`;
  if (tipo) path += `&oab_tipo=${tipo}`;
  return escavadorRequest<ResumoAdvogadoResponse>(path);
}

/**
 * Busca envolvidos de um processo
 */
export async function buscarEnvolvidosProcesso(
  numeroCnj: string,
  limite?: 50 | 100
): Promise<EnvolvidosProcessoResponse> {
  console.log(`[ESCAVADOR] Buscando envolvidos: ${numeroCnj}`);
  let path = `/api/v2/processos/numero_cnj/${encodeURIComponent(numeroCnj)}/envolvidos`;
  if (limite) path += `?limit=${limite}`;
  return escavadorRequest<EnvolvidosProcessoResponse>(path);
}

// ============================================
// DOCUMENTOS
// ============================================

/**
 * Busca documentos públicos de um processo
 */
export async function buscarDocumentosPublicos(
  numeroCnj: string,
  limite?: 50 | 100
): Promise<DocumentosResponse> {
  console.log(`[ESCAVADOR] Buscando documentos públicos: ${numeroCnj}`);
  let path = `/api/v2/processos/numero_cnj/${encodeURIComponent(numeroCnj)}/documentos-publicos`;
  if (limite) path += `?limit=${limite}`;
  return escavadorRequest<DocumentosResponse>(path);
}

/**
 * Busca autos do processo (públicos e restritos)
 * Requer solicitação prévia de atualização com autos=1
 */
export async function buscarAutosProcesso(
  numeroCnj: string,
  limite?: 50 | 100
): Promise<DocumentosResponse> {
  console.log(`[ESCAVADOR] Buscando autos: ${numeroCnj}`);
  let path = `/api/v2/processos/numero_cnj/${encodeURIComponent(numeroCnj)}/autos`;
  if (limite) path += `?limit=${limite}`;
  return escavadorRequest<DocumentosResponse>(path);
}

// ============================================
// ATUALIZAÇÃO DE PROCESSOS
// ============================================

/**
 * Verifica status de atualização de um processo
 */
export async function verificarStatusAtualizacao(numeroCnj: string): Promise<StatusAtualizacaoResponse> {
  console.log(`[ESCAVADOR] Verificando status: ${numeroCnj}`);
  const path = `/api/v2/processos/numero_cnj/${encodeURIComponent(numeroCnj)}/status-atualizacao`;
  return escavadorRequest<StatusAtualizacaoResponse>(path);
}

/**
 * Solicita atualização de um processo nos tribunais
 * @param numeroCnj - Número do processo
 * @param opcoes - Opções de atualização
 */
export async function solicitarAtualizacaoProcesso(
  numeroCnj: string,
  opcoes?: {
    enviarCallback?: boolean;
    documentosPublicos?: boolean;
    autos?: boolean;
    utilizarCertificado?: boolean;
    certificadoId?: number;
    usuario?: string;
    senha?: string;
  }
): Promise<SolicitacaoAtualizacaoResponse> {
  console.log(`[ESCAVADOR] Solicitando atualização: ${numeroCnj}`);

  const path = `/api/v2/processos/numero_cnj/${encodeURIComponent(numeroCnj)}/solicitar-atualizacao`;

  const body: any = {};
  if (opcoes?.enviarCallback) body.enviar_callback = 1;
  if (opcoes?.documentosPublicos) body.documentos_publicos = 1;
  if (opcoes?.autos) body.autos = 1;
  if (opcoes?.utilizarCertificado) body.utilizar_certificado = 1;
  if (opcoes?.certificadoId) body.certificado_id = opcoes.certificadoId;
  if (opcoes?.usuario) body.usuario = opcoes.usuario;
  if (opcoes?.senha) body.senha = opcoes.senha;

  return escavadorRequest<SolicitacaoAtualizacaoResponse>(path, 'POST', Object.keys(body).length > 0 ? body : undefined);
}

// ============================================
// MONITORAMENTO DE NOVOS PROCESSOS
// ============================================

/**
 * Cria monitoramento de novos processos por termo
 */
export async function criarMonitoramentoNovosProcessos(
  termo: string,
  opcoes?: {
    variacoes?: string[];
    termosAuxiliares?: { condicao: 'CONTEM' | 'NAO_CONTEM' | 'CONTEM_ALGUMA'; termo: string }[];
    tribunais?: string[];
  }
): Promise<MonitoramentoNovosProcessos> {
  console.log(`[ESCAVADOR] Criando monitoramento: ${termo}`);

  const body: any = { termo };
  if (opcoes?.variacoes) body.variacoes = opcoes.variacoes;
  if (opcoes?.termosAuxiliares) body.termos_auxiliares = opcoes.termosAuxiliares;
  if (opcoes?.tribunais) body.tribunais = opcoes.tribunais;

  return escavadorRequest<MonitoramentoNovosProcessos>('/api/v2/monitoramentos/novos-processos', 'POST', body);
}

/**
 * Lista monitoramentos de novos processos
 */
export async function listarMonitoramentosNovosProcessos(): Promise<{ items: MonitoramentoNovosProcessos[] }> {
  console.log(`[ESCAVADOR] Listando monitoramentos de novos processos`);
  return escavadorRequest<{ items: MonitoramentoNovosProcessos[] }>('/api/v2/monitoramentos/novos-processos');
}

/**
 * Obtém monitoramento específico
 */
export async function obterMonitoramentoNovosProcessos(id: number): Promise<MonitoramentoNovosProcessos> {
  console.log(`[ESCAVADOR] Obtendo monitoramento: ${id}`);
  return escavadorRequest<MonitoramentoNovosProcessos>(`/api/v2/monitoramentos/novos-processos/${id}`);
}

/**
 * Remove monitoramento
 */
export async function removerMonitoramentoNovosProcessos(id: number): Promise<void> {
  console.log(`[ESCAVADOR] Removendo monitoramento: ${id}`);
  await escavadorRequest<{}>(`/api/v2/monitoramentos/novos-processos/${id}`, 'DELETE');
}

/**
 * Lista resultados de um monitoramento
 */
export async function listarResultadosMonitoramento(id: number): Promise<{ items: ResultadoMonitoramento[] }> {
  console.log(`[ESCAVADOR] Listando resultados do monitoramento: ${id}`);
  return escavadorRequest<{ items: ResultadoMonitoramento[] }>(`/api/v2/monitoramentos/novos-processos/${id}/resultados`);
}

// ============================================
// MONITORAMENTO DE PROCESSOS
// ============================================

/**
 * Cria monitoramento de processo específico
 */
export async function criarMonitoramentoProcesso(
  numeroCnj: string,
  opcoes?: {
    tribunal?: string;
    frequencia?: 'DIARIA' | 'SEMANAL';
  }
): Promise<MonitoramentoProcesso> {
  console.log(`[ESCAVADOR] Criando monitoramento de processo: ${numeroCnj}`);

  const body: any = { numero: numeroCnj };
  if (opcoes?.tribunal) body.tribunal = opcoes.tribunal;
  if (opcoes?.frequencia) body.frequencia = opcoes.frequencia;

  return escavadorRequest<MonitoramentoProcesso>('/api/v2/monitoramentos/processos', 'POST', body);
}

/**
 * Lista monitoramentos de processos
 */
export async function listarMonitoramentosProcessos(): Promise<{ items: MonitoramentoProcesso[] }> {
  console.log(`[ESCAVADOR] Listando monitoramentos de processos`);
  return escavadorRequest<{ items: MonitoramentoProcesso[] }>('/api/v2/monitoramentos/processos');
}

/**
 * Obtém monitoramento de processo específico
 */
export async function obterMonitoramentoProcesso(id: number): Promise<MonitoramentoProcesso> {
  console.log(`[ESCAVADOR] Obtendo monitoramento de processo: ${id}`);
  return escavadorRequest<MonitoramentoProcesso>(`/api/v2/monitoramentos/processos/${id}`);
}

/**
 * Remove monitoramento de processo
 */
export async function removerMonitoramentoProcesso(id: number): Promise<void> {
  console.log(`[ESCAVADOR] Removendo monitoramento de processo: ${id}`);
  await escavadorRequest<{}>(`/api/v2/monitoramentos/processos/${id}`, 'DELETE');
}

// ============================================
// RESUMO INTELIGENTE (IA)
// ============================================

/**
 * Solicita geração de resumo inteligente do processo
 */
export async function solicitarResumoInteligente(numeroCnj: string): Promise<{
  id: number;
  status: string;
  criado_em: string;
  numero_cnj: string;
  concluido_em: string | null;
}> {
  console.log(`[ESCAVADOR] Solicitando resumo IA: ${numeroCnj}`);
  return escavadorRequest(`/api/v2/processos/numero_cnj/${encodeURIComponent(numeroCnj)}/ia/resumo/solicitar-atualizacao`, 'POST');
}

/**
 * Obtém resumo inteligente do processo
 */
export async function obterResumoInteligente(numeroCnj: string): Promise<{
  numero_cnj: string;
  conteudo: string;
  atualizado_em: string;
}> {
  console.log(`[ESCAVADOR] Obtendo resumo IA: ${numeroCnj}`);
  return escavadorRequest(`/api/v2/processos/numero_cnj/${encodeURIComponent(numeroCnj)}/ia/resumo`);
}

/**
 * Verifica status do resumo inteligente
 */
export async function verificarStatusResumoInteligente(numeroCnj: string): Promise<{
  id: number;
  status: string;
  criado_em: string;
  numero_cnj: string;
  concluido_em: string | null;
}> {
  console.log(`[ESCAVADOR] Verificando status resumo IA: ${numeroCnj}`);
  return escavadorRequest(`/api/v2/processos/numero_cnj/${encodeURIComponent(numeroCnj)}/ia/resumo/status`);
}

// ============================================
// TRIBUNAIS
// ============================================

/**
 * Lista tribunais disponíveis
 */
export async function listarTribunais(estados?: string[]): Promise<TribunaisResponse> {
  console.log(`[ESCAVADOR] Listando tribunais`);
  let path = '/api/v2/tribunais';
  if (estados && estados.length > 0) {
    path += '?' + estados.map(e => `estados[]=${e}`).join('&');
  }
  return escavadorRequest<TribunaisResponse>(path);
}

// ============================================
// CALLBACKS (GRÁTIS)
// ============================================

/**
 * Lista callbacks recebidos
 */
export async function listarCallbacks(opcoes?: {
  dataMinima?: string;
  dataMaxima?: string;
  evento?: string;
  itemTipo?: 'busca_assincrona' | 'monitoramento_tribunal' | 'monitoramento_diario';
  itemId?: number;
  status?: 'sucesso' | 'em_tentativa' | 'erro';
}): Promise<any> {
  console.log(`[ESCAVADOR] Listando callbacks`);
  let path = '/api/v2/callbacks';
  const params: string[] = [];

  if (opcoes?.dataMinima) params.push(`data_minima=${opcoes.dataMinima}`);
  if (opcoes?.dataMaxima) params.push(`data_maxima=${opcoes.dataMaxima}`);
  if (opcoes?.evento) params.push(`evento=${opcoes.evento}`);
  if (opcoes?.itemTipo) params.push(`item_tipo=${opcoes.itemTipo}`);
  if (opcoes?.itemId) params.push(`item_id=${opcoes.itemId}`);
  if (opcoes?.status) params.push(`status=${opcoes.status}`);

  if (params.length > 0) path += '?' + params.join('&');

  return escavadorRequest(path);
}

/**
 * Marca callbacks como recebidos
 */
export async function marcarCallbacksRecebidos(ids: number[]): Promise<void> {
  console.log(`[ESCAVADOR] Marcando callbacks como recebidos: ${ids.join(', ')}`);
  await escavadorRequest('/api/v2/callbacks/marcar-recebidos', 'POST', { ids });
}

/**
 * Reenvia callback
 */
export async function reenviarCallback(id: number): Promise<{ message: string }> {
  console.log(`[ESCAVADOR] Reenviando callback: ${id}`);
  return escavadorRequest(`/api/v2/callbacks/${id}/reenviar`, 'POST');
}

// ============================================
// EXECUÇÃO PRINCIPAL (CLI)
// ============================================

async function main() {
  if (!ESCAVADOR_TOKEN) {
    console.error('ESCAVADOR_TOKEN não configurado no .env');
    process.exit(1);
  }

  const comando = process.argv[2];
  const argumento = process.argv[3];
  const argumento2 = process.argv[4];

  if (!comando) {
    console.log(`
╔═══════════════════════════════════════════════════════════════════════╗
║                    ESCAVADOR API v2 - Cliente CLI                      ║
╠═══════════════════════════════════════════════════════════════════════╣
║  Uso: npm run escavador <comando> <argumento> [argumento2]             ║
╠═══════════════════════════════════════════════════════════════════════╣
║  CONSULTAS DE PROCESSOS                                                ║
║    processo <CNJ>           Busca processo por número CNJ              ║
║    movimentacoes <CNJ>      Lista movimentações do processo            ║
║    envolvidos <CNJ>         Lista envolvidos do processo               ║
║    cpf <CPF>                Busca processos por CPF                    ║
║    cnpj <CNPJ>              Busca processos por CNPJ                   ║
║    nome <NOME>              Busca processos por nome                   ║
║    resumo <CPF/CNPJ>        Resumo de processos do envolvido           ║
║    oab <NUMERO> <ESTADO>    Busca processos por OAB                    ║
╠═══════════════════════════════════════════════════════════════════════╣
║  DOCUMENTOS                                                            ║
║    docs <CNJ>               Lista documentos públicos                  ║
║    autos <CNJ>              Lista autos (públicos + restritos)         ║
╠═══════════════════════════════════════════════════════════════════════╣
║  ATUALIZAÇÃO                                                           ║
║    status <CNJ>             Verifica status de atualização             ║
║    atualizar <CNJ>          Solicita atualização do processo           ║
╠═══════════════════════════════════════════════════════════════════════╣
║  RESUMO INTELIGENTE (IA)                                               ║
║    ia-solicitar <CNJ>       Solicita resumo inteligente                ║
║    ia-resumo <CNJ>          Obtém resumo inteligente                   ║
║    ia-status <CNJ>          Verifica status do resumo                  ║
╠═══════════════════════════════════════════════════════════════════════╣
║  OUTROS                                                                ║
║    tribunais                Lista tribunais disponíveis                ║
║    monitoramentos           Lista monitoramentos ativos                ║
╚═══════════════════════════════════════════════════════════════════════╝

Exemplos:
  npm run escavador cpf 12345678900
  npm run escavador processo "0000000-00.0000.0.00.0000"
  npm run escavador oab 123456 SP
    `);
    process.exit(1);
  }

  try {
    let resultado: unknown;

    switch (comando.toLowerCase()) {
      case 'processo':
        if (!argumento) throw new Error('Informe o número CNJ');
        resultado = await buscarProcessoPorNumeroCnj(argumento);
        break;

      case 'movimentacoes':
        if (!argumento) throw new Error('Informe o número CNJ');
        resultado = await buscarMovimentacoesProcesso(argumento);
        break;

      case 'envolvidos':
        if (!argumento) throw new Error('Informe o número CNJ');
        resultado = await buscarEnvolvidosProcesso(argumento);
        break;

      case 'cpf':
      case 'cnpj':
        if (!argumento) throw new Error('Informe o CPF/CNPJ');
        resultado = await buscarProcessosPorCpfCnpj(argumento);
        break;

      case 'nome':
        if (!argumento) throw new Error('Informe o nome');
        resultado = await buscarProcessosPorNome(argumento);
        break;

      case 'resumo':
        if (!argumento) throw new Error('Informe o CPF/CNPJ');
        resultado = await obterResumoEnvolvido(argumento);
        break;

      case 'oab':
        if (!argumento || !argumento2) throw new Error('Informe número e estado da OAB');
        resultado = await buscarProcessosPorOab(argumento, argumento2);
        break;

      case 'docs':
        if (!argumento) throw new Error('Informe o número CNJ');
        resultado = await buscarDocumentosPublicos(argumento);
        break;

      case 'autos':
        if (!argumento) throw new Error('Informe o número CNJ');
        resultado = await buscarAutosProcesso(argumento);
        break;

      case 'status':
        if (!argumento) throw new Error('Informe o número CNJ');
        resultado = await verificarStatusAtualizacao(argumento);
        break;

      case 'atualizar':
        if (!argumento) throw new Error('Informe o número CNJ');
        resultado = await solicitarAtualizacaoProcesso(argumento);
        break;

      case 'ia-solicitar':
        if (!argumento) throw new Error('Informe o número CNJ');
        resultado = await solicitarResumoInteligente(argumento);
        break;

      case 'ia-resumo':
        if (!argumento) throw new Error('Informe o número CNJ');
        resultado = await obterResumoInteligente(argumento);
        break;

      case 'ia-status':
        if (!argumento) throw new Error('Informe o número CNJ');
        resultado = await verificarStatusResumoInteligente(argumento);
        break;

      case 'tribunais':
        resultado = await listarTribunais();
        break;

      case 'monitoramentos':
        const [novos, processos] = await Promise.all([
          listarMonitoramentosNovosProcessos(),
          listarMonitoramentosProcessos()
        ]);
        resultado = { novos_processos: novos.items, processos: processos.items };
        break;

      default:
        console.error(`Comando desconhecido: ${comando}`);
        process.exit(1);
    }

    console.log('\n═══════════════════════════════════════════════════════════════════════');
    console.log('RESULTADO:');
    console.log('═══════════════════════════════════════════════════════════════════════');
    console.log(JSON.stringify(resultado, null, 2));
  } catch (error) {
    console.error('\n❌ Erro:', (error as Error).message);
    process.exit(1);
  }
}

main();
