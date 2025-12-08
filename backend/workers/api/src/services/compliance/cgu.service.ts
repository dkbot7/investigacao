/**
 * CGU - Controladoria Geral da União
 * Serviço para consultar CEIS, CNEP, CEAF
 *
 * Fonte: Portal da Transparência
 * API: https://portaldatransparencia.gov.br/api-de-dados
 * Documentação: https://api.portaldatransparencia.gov.br/swagger-ui/index.html
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

import { logger } from '../../utils/logger';

// ============================================================================
// INTERFACES
// ============================================================================

export interface CEISRecord {
  codigoSancionado: string;
  nomeSancionado: string;
  cpfCnpjSancionado: string;
  tipoSancao: string;
  dataInicioSancao: string;
  dataFimSancao: string;
  orgaoSancionador: string;
  ufOrgaoSancionador: string;
  fundamentacaoLegal: string;
  descricaoFundamentacaoLegal: string;
  dataPublicacao: string;
  publicacao: string;
  detalhamento: string;
  abrangenciaDecisao: string;
}

export interface CNEPRecord {
  razaoSocialReceita: string;
  nomeFantasiaReceita: string;
  numeroInscricaoSocial: string;
  cnpjFormatado: string;
  tipoSancao: {
    codigo: number;
    descricao: string;
  };
  dataInicioSancao: string;
  dataFimSancao: string;
  orgaoSancionador: {
    codigo: number;
    nome: string;
    sigla: string;
  };
  valorMulta: number;
  quantidadeParcelasMulta: number;
  textoPublicacao: string;
}

export interface CEAFRecord {
  razaoSocial: string;
  cnpj: string;
  dataInicioAcordo: string;
  dataFimAcordo: string;
  situacaoAcordo: string;
  orgao: string;
}

// ============================================================================
// CONFIGURAÇÃO
// ============================================================================

const CGU_BASE_URL = 'http://api.portaldatransparencia.gov.br/api-de-dados';

// IMPORTANTE: Obter chave em https://portaldatransparencia.gov.br/api-de-dados
// Para desenvolvimento, pode usar sem chave (limite baixo)
const CGU_API_KEY = process.env.CGU_API_KEY || '';

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

async function fetchCGU<T>(endpoint: string, params: Record<string, string> = {}): Promise<T[]> {
  const url = new URL(endpoint, CGU_BASE_URL);

  // Adicionar parâmetros de query
  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  if (CGU_API_KEY) {
    headers['chave-api-dados'] = CGU_API_KEY;
  }

  logger.info('[CGU] Consultando:', { url: url.toString() });

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    const errorText = await response.text();
    logger.error('[CGU] Erro na API:', {
      status: response.status,
      error: errorText
    });
    throw new Error(`CGU API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

// ============================================================================
// CEIS - CADASTRO NACIONAL DE EMPRESAS INIDÔNEAS E SUSPENSAS
// ============================================================================

/**
 * Consultar CEIS por CPF ou CNPJ
 *
 * Retorna lista de sanções CEIS (inidôneos e suspensos)
 * para o documento fornecido.
 *
 * @param documento CPF (sem formatação) ou CNPJ (sem formatação)
 * @returns Lista de sanções CEIS
 */
export async function consultarCEIS(documento: string): Promise<CEISRecord[]> {
  try {
    const doc = documento.replace(/\D/g, ''); // Remove formatação

    const records = await fetchCGU<CEISRecord>('/ceis', {
      codigoSancionado: doc,
    });

    logger.info('[CGU CEIS] Consulta realizada:', {
      documento: doc,
      total: records.length
    });

    return records;
  } catch (error: any) {
    logger.error('[CGU CEIS] Erro ao consultar:', error);
    throw error;
  }
}

// ============================================================================
// CNEP - CADASTRO NACIONAL DE EMPRESAS PUNIDAS
// ============================================================================

/**
 * Consultar CNEP por CNPJ
 *
 * Retorna lista de empresas punidas pela Lei 12.846/2013
 * (Lei Anticorrupção).
 *
 * @param cnpj CNPJ (sem formatação)
 * @returns Lista de punições CNEP
 */
export async function consultarCNEP(cnpj: string): Promise<CNEPRecord[]> {
  try {
    const doc = cnpj.replace(/\D/g, '');

    const records = await fetchCGU<CNEPRecord>('/cnep', {
      cnpjSancionado: doc,
    });

    logger.info('[CGU CNEP] Consulta realizada:', {
      cnpj: doc,
      total: records.length
    });

    return records;
  } catch (error: any) {
    logger.error('[CGU CNEP] Erro ao consultar:', error);
    throw error;
  }
}

// ============================================================================
// CEAF - CADASTRO DE ENTIDADES PRIVADAS SEM FINS LUCRATIVOS
// ============================================================================

/**
 * Consultar CEAF (Acordo de Leniência)
 *
 * Retorna empresas que celebraram Acordo de Leniência
 * conforme Lei 12.846/2013.
 *
 * @param cnpj CNPJ (sem formatação)
 * @returns Lista de acordos
 */
export async function consultarCEAF(cnpj: string): Promise<CEAFRecord[]> {
  try {
    const doc = cnpj.replace(/\D/g, '');

    const records = await fetchCGU<CEAFRecord>('/ceaf', {
      cnpj: doc,
    });

    logger.info('[CGU CEAF] Consulta realizada:', {
      cnpj: doc,
      total: records.length
    });

    return records;
  } catch (error: any) {
    logger.error('[CGU CEAF] Erro ao consultar:', error);
    throw error;
  }
}

// ============================================================================
// CONSOLIDADA - TODAS AS SANÇÕES
// ============================================================================

/**
 * Verificar todas as sanções CGU de uma vez
 *
 * Consolida CEIS + CNEP + CEAF para um documento.
 *
 * @param documento CPF ou CNPJ (sem formatação)
 * @returns Objeto consolidado com todas as sanções
 */
export async function verificarSancoesConsolidadas(documento: string) {
  const doc = documento.replace(/\D/g, '');
  const isCNPJ = doc.length === 14;

  try {
    // CEIS (CPF e CNPJ)
    const ceis = await consultarCEIS(doc);

    // CNEP e CEAF apenas para CNPJ
    let cnep: CNEPRecord[] = [];
    let ceaf: CEAFRecord[] = [];

    if (isCNPJ) {
      [cnep, ceaf] = await Promise.all([
        consultarCNEP(doc),
        consultarCEAF(doc),
      ]);
    }

    const totalSancoes = ceis.length + cnep.length + ceaf.length;

    // Determinar nível de risco
    let nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico' = 'baixo';
    if (totalSancoes >= 3) nivelRisco = 'critico';
    else if (totalSancoes >= 2) nivelRisco = 'alto';
    else if (totalSancoes >= 1) nivelRisco = 'medio';

    return {
      documento: doc,
      tipo: isCNPJ ? 'cnpj' : 'cpf',
      totalSancoes,
      nivelRisco,
      sancoes: {
        ceis: {
          total: ceis.length,
          records: ceis,
        },
        cnep: {
          total: cnep.length,
          records: cnep,
        },
        ceaf: {
          total: ceaf.length,
          records: ceaf,
        },
      },
      verificado_em: new Date().toISOString(),
    };
  } catch (error: any) {
    logger.error('[CGU] Erro ao verificar sanções consolidadas:', error);
    throw error;
  }
}
