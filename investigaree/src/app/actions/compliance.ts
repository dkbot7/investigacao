'use server'

/**
 * Server Actions para Compliance
 *
 * Abordagem moderna Next.js 15 + React 19:
 * - Funções server-side que eliminam necessidade de API routes
 * - Autenticação server-side (tokens não expostos)
 * - Melhor performance e segurança
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

import { cookies } from 'next/headers'

// ============================================
// CONFIGURAÇÃO
// ============================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.investigaree.com.br'

/**
 * Helper para fazer requisições autenticadas ao backend
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // Obter session token do cookie (Firebase Auth)
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('__session')?.value

  if (!sessionToken) {
    throw new Error('Usuário não autenticado')
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sessionToken}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erro desconhecido' }))
    throw new Error(error.message || `HTTP ${response.status}`)
  }

  return response.json()
}

// ============================================
// PEP - PESSOAS EXPOSTAS POLITICAMENTE
// ============================================

export interface PEPVerificationResult {
  cpf: string
  isPEP: boolean
  pep?: {
    cpf: string
    nome: string
    cargo: string
    orgao: string
    nivel_federacao: 'federal' | 'estadual' | 'municipal'
    uf?: string
    municipio?: string
    data_inicio?: string
    data_fim?: string
    situacao: 'ativo' | 'inativo'
  }
  nivel_risco: 'baixo' | 'medio' | 'alto'
  verificado_em: string
}

/**
 * Verificar se CPF é PEP (Pessoa Exposta Politicamente)
 */
export async function verificarPEPAction(cpf: string): Promise<PEPVerificationResult> {
  return fetchWithAuth(`/api/compliance/pep/verificar?cpf=${cpf}`)
}

/**
 * Buscar PEP por nome (busca parcial)
 */
export async function buscarPEPPorNomeAction(nome: string): Promise<any[]> {
  return fetchWithAuth(`/api/compliance/pep/buscar?nome=${encodeURIComponent(nome)}`)
}

/**
 * Obter estatísticas da lista PEP
 */
export async function getPEPStatsAction(): Promise<any[]> {
  return fetchWithAuth('/api/compliance/pep/stats')
}

// ============================================
// SANÇÕES CGU (CEIS + CNEP + CEAF)
// ============================================

export interface SancoesConsolidadasResult {
  documento: string
  tipo: 'cpf' | 'cnpj'
  totalSancoes: number
  nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico'
  sancoes: {
    ceis: {
      total: number
      records: any[]
    }
    cnep: {
      total: number
      records: any[]
    }
    ceaf: {
      total: number
      records: any[]
    }
  }
  verificado_em: string
}

/**
 * Verificar sanções consolidadas (CEIS + CNEP + CEAF)
 */
export async function verificarSancoesAction(
  documento: string
): Promise<SancoesConsolidadasResult> {
  return fetchWithAuth(`/api/compliance/cgu/consolidado?documento=${documento}`)
}

/**
 * Consultar CEIS (Cadastro de Empresas Inidôneas e Suspensas)
 */
export async function consultarCEISAction(documento: string): Promise<any[]> {
  return fetchWithAuth(`/api/compliance/cgu/ceis?documento=${documento}`)
}

/**
 * Consultar CNEP (Cadastro Nacional de Empresas Punidas)
 */
export async function consultarCNEPAction(cnpj: string): Promise<any[]> {
  return fetchWithAuth(`/api/compliance/cgu/cnep?cnpj=${cnpj}`)
}

/**
 * Consultar CEAF (Cadastro de Acordos de Leniência)
 */
export async function consultarCEAFAction(cnpj: string): Promise<any[]> {
  return fetchWithAuth(`/api/compliance/cgu/ceaf?cnpj=${cnpj}`)
}

// ============================================
// OFAC - SPECIALLY DESIGNATED NATIONALS
// ============================================

export interface OFACVerificationResult {
  nome: string
  encontrado: boolean
  matches: Array<{
    ent_num: string
    sdn_name: string
    sdn_type: string
    programs: string[]
    remarks: string
    score: number
  }>
  nivel_risco: 'baixo' | 'medio' | 'alto' | 'critico'
  verificado_em: string
}

/**
 * Verificar nome contra OFAC SDN List
 */
export async function verificarOFACAction(
  nome: string,
  threshold: number = 70
): Promise<OFACVerificationResult> {
  return fetchWithAuth(
    `/api/compliance/ofac/verificar?nome=${encodeURIComponent(nome)}&threshold=${threshold}`
  )
}

// ============================================
// LGPD - LEI GERAL DE PROTEÇÃO DE DADOS
// ============================================

export interface LGPDSolicitacao {
  tipo_solicitacao:
    | 'acesso'
    | 'retificacao'
    | 'anonimizacao'
    | 'eliminacao'
    | 'portabilidade'
    | 'informacao'
    | 'revogacao'
  email: string
  nome?: string
  cpf?: string
  telefone?: string
  descricao?: string
}

/**
 * Criar solicitação LGPD
 */
export async function criarSolicitacaoLGPDAction(
  data: LGPDSolicitacao
): Promise<any> {
  return fetchWithAuth('/api/lgpd/solicitacao', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Listar minhas solicitações LGPD
 */
export async function listarMinhasSolicitacoesLGPDAction(): Promise<any[]> {
  return fetchWithAuth('/api/lgpd/minhas-solicitacoes')
}

/**
 * Revogar consentimento LGPD
 */
export async function revogarConsentimentoAction(
  documento: string,
  motivo: string
): Promise<any> {
  return fetchWithAuth('/api/lgpd/revogar-consentimento', {
    method: 'POST',
    body: JSON.stringify({ documento, motivo }),
  })
}

/**
 * Exportar meus dados (portabilidade LGPD Art. 18, V)
 *
 * Retorna os dados em formato JSON para download
 */
export async function exportarMeusDadosAction(): Promise<Blob> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get('__session')?.value

  if (!sessionToken) {
    throw new Error('Usuário não autenticado')
  }

  const response = await fetch(`${API_BASE_URL}/api/lgpd/exportar-dados`, {
    headers: {
      'Authorization': `Bearer ${sessionToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Erro ao exportar dados')
  }

  return response.blob()
}

// ============================================
// COMPLIANCE DASHBOARD
// ============================================

/**
 * Obter dados consolidados do dashboard de compliance
 */
export async function getComplianceDashboardAction(): Promise<any> {
  return fetchWithAuth('/api/compliance/dashboard')
}

/**
 * Obter estatísticas de compliance para um tenant
 */
export async function getComplianceStatsAction(): Promise<any> {
  return fetchWithAuth('/api/compliance/stats')
}
