/**
 * TSE Service - Tribunal Superior Eleitoral
 *
 * Integração com APIs públicas do TSE para:
 * - Consulta de candidaturas
 * - Consulta de doações eleitorais
 * - Histórico político
 *
 * APIs:
 * - DivulgaCand: https://divulgacandcontas.tse.jus.br/divulga/
 * - Dados Abertos TSE: https://dadosabertos.tse.jus.br/
 *
 * @see https://divulgacandcontas.tse.jus.br/divulga/rest/v1/docs
 */

import { logger } from '@/lib/logger';

const TSE_BASE_URL = 'https://divulgacandcontas.tse.jus.br/divulga/rest/v1';

interface TSECandidatura {
  ano: number;
  cargo: string;
  partido: string;
  uf: string;
  municipio?: string;
  situacao: string;
  resultado?: string;
  numeroUrna?: string;
  nomeUrna?: string;
}

interface TSEDoacao {
  ano: number;
  cpfCnpjDoador: string;
  nomeDoador: string;
  valor: number;
  data: string;
  tipo: 'recurso_proprio' | 'doacao_pessoa_fisica' | 'doacao_pessoa_juridica';
  candidatoBeneficiado: string;
}

export interface TSEResult {
  cpf: string;
  candidaturas: TSECandidatura[];
  doacoes: TSEDoacao[];
  temHistoricoPolitico: boolean;
  totalDoacoes: number;
  valorTotalDoado: number;
}

/**
 * Busca candidaturas por CPF
 */
export async function getCandidaturasByCPF(cpf: string): Promise<TSECandidatura[]> {
  try {
    // Remover formatação do CPF
    const cpfLimpo = cpf.replace(/\D/g, '');

    logger.info('Consultando candidaturas TSE', { cpf: cpfLimpo }, 'TSE');

    // API TSE DivulgaCand - Candidatos por CPF
    // Nota: A API real do TSE tem limitações. Esta é uma aproximação.
    // Em produção, usar endpoint correto ou scraping autorizado.

    const response = await fetch(
      `${TSE_BASE_URL}/candidato/buscar/${cpfLimpo}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Investigaree/1.0'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        logger.info('Nenhuma candidatura encontrada', { cpf: cpfLimpo }, 'TSE');
        return [];
      }
      throw new Error(`TSE API error: ${response.status}`);
    }

    const data = await response.json();

    // Transformar resposta da API para nosso formato
    const candidaturas: TSECandidatura[] = (data.candidatos || []).map((cand: any) => ({
      ano: cand.anoEleicao || cand.ano,
      cargo: cand.descricaoCargo || cand.cargo,
      partido: cand.siglaPartido || cand.partido,
      uf: cand.uf || cand.siglaUf,
      municipio: cand.nomeMunicipio || cand.municipio,
      situacao: cand.descricaoSituacao || cand.situacao,
      resultado: cand.descricaoTotalizacao || cand.resultado,
      numeroUrna: cand.numero,
      nomeUrna: cand.nomeUrna
    }));

    logger.info('Candidaturas encontradas', {
      cpf: cpfLimpo,
      total: candidaturas.length
    }, 'TSE');

    return candidaturas;

  } catch (error) {
    logger.error('Erro ao consultar candidaturas TSE',
      error instanceof Error ? error : undefined,
      { cpf },
      'TSE'
    );

    // Retornar array vazio em caso de erro (fail gracefully)
    return [];
  }
}

/**
 * Busca doações eleitorais por CPF
 */
export async function getDoacoesByCPF(cpf: string): Promise<TSEDoacao[]> {
  try {
    const cpfLimpo = cpf.replace(/\D/g, '');

    logger.info('Consultando doações TSE', { cpf: cpfLimpo }, 'TSE');

    // API TSE DivulgaCand - Doações por CPF do doador
    const response = await fetch(
      `${TSE_BASE_URL}/prestador/consulta/doacao/${cpfLimpo}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Investigaree/1.0'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        logger.info('Nenhuma doação encontrada', { cpf: cpfLimpo }, 'TSE');
        return [];
      }
      throw new Error(`TSE API error: ${response.status}`);
    }

    const data = await response.json();

    // Transformar resposta da API
    const doacoes: TSEDoacao[] = (data.doacoes || []).map((doacao: any) => ({
      ano: doacao.anoEleicao,
      cpfCnpjDoador: doacao.cpfCnpjDoador,
      nomeDoador: doacao.nomeDoador,
      valor: parseFloat(doacao.valorReceita || doacao.valor || '0'),
      data: doacao.dataReceita || doacao.data,
      tipo: determinaTipoDoacao(doacao),
      candidatoBeneficiado: doacao.nomeCandidato || doacao.candidato
    }));

    logger.info('Doações encontradas', {
      cpf: cpfLimpo,
      total: doacoes.length,
      valorTotal: doacoes.reduce((sum, d) => sum + d.valor, 0)
    }, 'TSE');

    return doacoes;

  } catch (error) {
    logger.error('Erro ao consultar doações TSE',
      error instanceof Error ? error : undefined,
      { cpf },
      'TSE'
    );

    return [];
  }
}

/**
 * Busca completa: candidaturas + doações
 */
export async function getHistoricoPoliticoByCPF(cpf: string): Promise<TSEResult> {
  const [candidaturas, doacoes] = await Promise.all([
    getCandidaturasByCPF(cpf),
    getDoacoesByCPF(cpf)
  ]);

  const valorTotalDoado = doacoes.reduce((sum, doacao) => sum + doacao.valor, 0);

  return {
    cpf,
    candidaturas,
    doacoes,
    temHistoricoPolitico: candidaturas.length > 0,
    totalDoacoes: doacoes.length,
    valorTotalDoado
  };
}

/**
 * Helper: Determina tipo de doação baseado nos dados da API
 */
function determinaTipoDoacao(doacao: any): TSEDoacao['tipo'] {
  const descricao = (doacao.descricaoReceita || '').toLowerCase();

  if (descricao.includes('recurso próprio') || descricao.includes('recursos proprios')) {
    return 'recurso_proprio';
  }

  if (descricao.includes('pessoa jurídica') || descricao.includes('cnpj')) {
    return 'doacao_pessoa_juridica';
  }

  return 'doacao_pessoa_fisica';
}

/**
 * Mock de dados para desenvolvimento (remover em produção)
 * A API do TSE tem rate limits e requer cuidado
 */
export function getMockTSEData(cpf: string): TSEResult {
  return {
    cpf,
    candidaturas: [],
    doacoes: [],
    temHistoricoPolitico: false,
    totalDoacoes: 0,
    valorTotalDoado: 0
  };
}
