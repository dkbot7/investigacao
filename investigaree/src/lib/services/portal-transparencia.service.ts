/**
 * Portal da Transparência Service
 *
 * Integração com APIs públicas do Portal da Transparência do Governo Federal:
 * - CEIS (Cadastro de Empresas Inidôneas e Suspensas)
 * - CNEP (Cadastro Nacional de Empresas Punidas)
 * - CEPIM (Cadastro de Entidades Privadas Sem Fins Lucrativos Impedidas)
 * - Bolsa Família e outros benefícios sociais
 *
 * Documentação: https://api.portaldatransparencia.gov.br/swagger-ui/index.html
 *
 * IMPORTANTE: Requer API Key gratuita
 * Solicitar em: https://portaldatransparencia.gov.br/api-de-dados
 */

import { logger } from '@/lib/logger';

const PORTAL_BASE_URL = 'https://api.portaldatransparencia.gov.br/api-de-dados';
const API_KEY = process.env.PORTAL_TRANSPARENCIA_API_KEY || '';

interface Sancao {
  tipo: 'CEIS' | 'CNEP' | 'CEPIM';
  cpfCnpj: string;
  nome: string;
  razaoSocial?: string;
  dataInicioSancao: string;
  dataFimSancao?: string;
  orgaoSancionador: string;
  ufOrgaoSancionador?: string;
  categoriaOrgao?: string;
  fundamentacaoLegal: string;
  descricaoFundamentacaoLegal?: string;
  dataPublicacao?: string;
  publicacao?: string;
  valorMulta?: number;
  quantidade?: number;
}

interface Beneficio {
  tipo: 'bolsa_familia' | 'bpc' | 'seguro_defeso' | 'garantia_safra';
  nomeBeneficiario: string;
  cpfBeneficiario: string;
  nisBeneficiario: string;
  mesCompetencia: string;
  anoCompetencia: number;
  valor: number;
  municipio: string;
  uf: string;
  codigoIbge?: string;
}

export interface PortalTransparenciaResult {
  cpf: string;
  sancoes: {
    ceis: Sancao[];
    cnep: Sancao[];
    cepim: Sancao[];
    total: number;
  };
  beneficios: Beneficio[];
  temSancao: boolean;
  temBeneficio: boolean;
  totalValorBeneficios: number;
}

/**
 * Consulta sanções CEIS por CPF/CNPJ
 */
export async function consultarCEIS(cpfCnpj: string): Promise<Sancao[]> {
  try {
    const cpfLimpo = cpfCnpj.replace(/\D/g, '');

    logger.info('Consultando CEIS', { cpf: cpfLimpo }, 'PortalTransparencia');

    const response = await fetch(
      `${PORTAL_BASE_URL}/ceis?cpfCnpj=${cpfLimpo}`,
      {
        headers: {
          'chave-api-dados': API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Portal API error: ${response.status}`);
    }

    const data = await response.json();

    const sancoes: Sancao[] = (Array.isArray(data) ? data : []).map((item: any) => ({
      tipo: 'CEIS',
      cpfCnpj: item.cpfCnpj,
      nome: item.nome || item.razaoSocial,
      razaoSocial: item.razaoSocial,
      dataInicioSancao: item.dataInicioSancao,
      dataFimSancao: item.dataFimSancao,
      orgaoSancionador: item.orgaoSancionador?.nome || item.orgaoSancionador,
      ufOrgaoSancionador: item.orgaoSancionador?.uf,
      categoriaOrgao: item.orgaoSancionador?.categoria,
      fundamentacaoLegal: item.fundamentacaoLegal,
      dataPublicacao: item.dataPublicacao
    }));

    logger.info('Sanções CEIS encontradas', {
      cpf: cpfLimpo,
      total: sancoes.length
    }, 'PortalTransparencia');

    return sancoes;

  } catch (error) {
    logger.error('Erro ao consultar CEIS',
      error instanceof Error ? error : undefined,
      { cpfCnpj },
      'PortalTransparencia'
    );

    return [];
  }
}

/**
 * Consulta sanções CNEP por CPF/CNPJ
 */
export async function consultarCNEP(cpfCnpj: string): Promise<Sancao[]> {
  try {
    const cpfLimpo = cpfCnpj.replace(/\D/g, '');

    logger.info('Consultando CNEP', { cpf: cpfLimpo }, 'PortalTransparencia');

    const response = await fetch(
      `${PORTAL_BASE_URL}/cnep?cpfCnpj=${cpfLimpo}`,
      {
        headers: {
          'chave-api-dados': API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Portal API error: ${response.status}`);
    }

    const data = await response.json();

    const sancoes: Sancao[] = (Array.isArray(data) ? data : []).map((item: any) => ({
      tipo: 'CNEP',
      cpfCnpj: item.cpfCnpj,
      nome: item.nome || item.razaoSocial,
      razaoSocial: item.razaoSocial,
      dataInicioSancao: item.dataInicioSancao,
      dataFimSancao: item.dataFimSancao,
      orgaoSancionador: item.orgaoSancionador?.nome || item.orgaoSancionador,
      ufOrgaoSancionador: item.orgaoSancionador?.uf,
      categoriaOrgao: item.orgaoSancionador?.categoria,
      fundamentacaoLegal: item.fundamentacaoLegal,
      descricaoFundamentacaoLegal: item.descricaoFundamentacaoLegal,
      valorMulta: parseFloat(item.valorMulta || '0'),
      dataPublicacao: item.dataPublicacao
    }));

    logger.info('Sanções CNEP encontradas', {
      cpf: cpfLimpo,
      total: sancoes.length
    }, 'PortalTransparencia');

    return sancoes;

  } catch (error) {
    logger.error('Erro ao consultar CNEP',
      error instanceof Error ? error : undefined,
      { cpfCnpj },
      'PortalTransparencia'
    );

    return [];
  }
}

/**
 * Consulta sanções CEPIM por CPF/CNPJ
 */
export async function consultarCEPIM(cpfCnpj: string): Promise<Sancao[]> {
  try {
    const cpfLimpo = cpfCnpj.replace(/\D/g, '');

    logger.info('Consultando CEPIM', { cpf: cpfLimpo }, 'PortalTransparencia');

    const response = await fetch(
      `${PORTAL_BASE_URL}/cepim?cpfCnpj=${cpfLimpo}`,
      {
        headers: {
          'chave-api-dados': API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Portal API error: ${response.status}`);
    }

    const data = await response.json();

    const sancoes: Sancao[] = (Array.isArray(data) ? data : []).map((item: any) => ({
      tipo: 'CEPIM',
      cpfCnpj: item.cpfCnpj,
      nome: item.nome || item.razaoSocial,
      razaoSocial: item.razaoSocial,
      dataInicioSancao: item.dataImpedimento,
      orgaoSancionador: item.orgaoSancionador?.nome || 'Federal',
      fundamentacaoLegal: item.motivoImpedimento || 'Impedimento CEPIM',
      dataPublicacao: item.dataPublicacao
    }));

    logger.info('Sanções CEPIM encontradas', {
      cpf: cpfLimpo,
      total: sancoes.length
    }, 'PortalTransparencia');

    return sancoes;

  } catch (error) {
    logger.error('Erro ao consultar CEPIM',
      error instanceof Error ? error : undefined,
      { cpfCnpj },
      'PortalTransparencia'
    );

    return [];
  }
}

/**
 * Consulta benefícios sociais (Bolsa Família) por CPF
 */
export async function consultarBeneficios(cpf: string): Promise<Beneficio[]> {
  try {
    const cpfLimpo = cpf.replace(/\D/g, '');

    logger.info('Consultando benefícios', { cpf: cpfLimpo }, 'PortalTransparencia');

    // Bolsa Família
    const response = await fetch(
      `${PORTAL_BASE_URL}/bolsa-familia-por-cpf?cpf=${cpfLimpo}`,
      {
        headers: {
          'chave-api-dados': API_KEY,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return [];
      }
      throw new Error(`Portal API error: ${response.status}`);
    }

    const data = await response.json();

    const beneficios: Beneficio[] = (Array.isArray(data) ? data : []).map((item: any) => ({
      tipo: 'bolsa_familia',
      nomeBeneficiario: item.nomeBeneficiario,
      cpfBeneficiario: item.cpfBeneficiario,
      nisBeneficiario: item.nisBeneficiario,
      mesCompetencia: item.mesCompetencia,
      anoCompetencia: item.anoCompetencia || new Date().getFullYear(),
      valor: parseFloat(item.valor || '0'),
      municipio: item.municipio?.nomeIBGE || item.municipio,
      uf: item.municipio?.uf || item.uf,
      codigoIbge: item.municipio?.codigoIBGE
    }));

    logger.info('Benefícios encontrados', {
      cpf: cpfLimpo,
      total: beneficios.length,
      valorTotal: beneficios.reduce((sum, b) => sum + b.valor, 0)
    }, 'PortalTransparencia');

    return beneficios;

  } catch (error) {
    logger.error('Erro ao consultar benefícios',
      error instanceof Error ? error : undefined,
      { cpf },
      'PortalTransparencia'
    );

    return [];
  }
}

/**
 * Consulta completa: todas as sanções + benefícios
 */
export async function consultarCompleto(cpf: string): Promise<PortalTransparenciaResult> {
  const [ceis, cnep, cepim, beneficios] = await Promise.all([
    consultarCEIS(cpf),
    consultarCNEP(cpf),
    consultarCEPIM(cpf),
    consultarBeneficios(cpf)
  ]);

  const totalSancoes = ceis.length + cnep.length + cepim.length;
  const totalValorBeneficios = beneficios.reduce((sum, b) => sum + b.valor, 0);

  return {
    cpf,
    sancoes: {
      ceis,
      cnep,
      cepim,
      total: totalSancoes
    },
    beneficios,
    temSancao: totalSancoes > 0,
    temBeneficio: beneficios.length > 0,
    totalValorBeneficios
  };
}

/**
 * Verifica se API Key está configurada
 */
export function isConfigured(): boolean {
  if (!API_KEY) {
    logger.warn('Portal da Transparência API Key não configurada', {}, 'PortalTransparencia');
    return false;
  }
  return true;
}
