/**
 * API Brasil CNPJ Service
 * Consulta de dados cadastrais de empresas (Receita Federal)
 */

import { Env } from '../index'

export interface CNPJData {
  cnpj: string
  razao_social: string
  nome_fantasia: string
  situacao_cadastral: string
  data_situacao_cadastral: string
  data_abertura: string
  cnae_principal: {
    codigo: string
    descricao: string
  }
  cnaes_secundarios: Array<{
    codigo: string
    descricao: string
  }>
  capital_social: number
  porte: string
  natureza_juridica: {
    codigo: string
    descricao: string
  }
  endereco: {
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    municipio: string
    uf: string
    cep: string
  }
  telefones: Array<{
    ddd: string
    numero: string
  }>
  email: string
  socios: Array<{
    nome: string
    cpf_cnpj: string
    qualificacao: string
    data_entrada: string
    percentual_capital: number
  }>
}

/**
 * Consultar dados de CNPJ na API Brasil
 * PLACEHOLDER: Implementar integração real
 *
 * @param cnpj - CNPJ formatado (XX.XXX.XXX/XXXX-XX) ou apenas números
 * @param env - Environment variables
 * @returns Dados cadastrais da empresa
 *
 * Docs: https://apibrasil.com.br/documentacao/cnpj
 * Custo: Plano Pro - R$ 39,90/mês (500 consultas) ou R$ 79,90/mês (ilimitado)
 */
export async function consultarCNPJ(
  cnpj: string,
  env: Env
): Promise<CNPJData | null> {
  try {
    // Remover formatação do CNPJ
    const cnpjNumeros = cnpj.replace(/\D/g, '')

    // Integração real com API Brasil
    if (env.API_BRASIL_BEARER_TOKEN && env.API_BRASIL_DEVICE_TOKEN) {
      try {
        const response = await fetch(
          `https://brasilapi.com.br/api/cnpj/v1/${cnpjNumeros}`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        if (!response.ok) {
          console.error('[CNPJ] BrasilAPI Error:', response.statusText)
          // Fallback para mock se API falhar
        } else {
          const data = await response.json()

          // Mapear response da BrasilAPI para formato esperado
          return {
            cnpj: data.cnpj,
            razao_social: data.razao_social || data.nome_fantasia,
            nome_fantasia: data.nome_fantasia || data.razao_social,
            situacao_cadastral: data.descricao_situacao_cadastral || 'ATIVA',
            data_situacao_cadastral: data.data_situacao_cadastral || data.data_inicio_atividade,
            data_abertura: data.data_inicio_atividade,
            cnae_principal: {
              codigo: data.cnae_fiscal?.toString() || '',
              descricao: data.cnae_fiscal_descricao || '',
            },
            cnaes_secundarios: (data.cnaes_secundarios || []).map((c: any) => ({
              codigo: c.codigo?.toString() || '',
              descricao: c.descricao || '',
            })),
            capital_social: parseFloat(data.capital_social || '0'),
            porte: data.porte || 'NÃO INFORMADO',
            natureza_juridica: {
              codigo: data.natureza_juridica || '',
              descricao: data.natureza_juridica_descricao || '',
            },
            endereco: {
              logradouro: data.logradouro || '',
              numero: data.numero || '',
              complemento: data.complemento || '',
              bairro: data.bairro || '',
              municipio: data.municipio || '',
              uf: data.uf || '',
              cep: data.cep || '',
            },
            telefones: data.ddd_telefone_1
              ? [
                  {
                    ddd: data.ddd_telefone_1.substring(0, 2),
                    numero: data.ddd_telefone_1.substring(2),
                  },
                ]
              : [],
            email: data.email || '',
            socios: (data.qsa || []).map((socio: any) => ({
              nome: socio.nome_socio || socio.nome,
              cpf_cnpj: socio.cnpj_cpf_do_socio || '',
              qualificacao: socio.qualificacao_socio || socio.qualificacao,
              data_entrada: socio.data_entrada_sociedade || '',
              percentual_capital: parseFloat(socio.percentual_capital_social || '0'),
            })),
          }
        }
      } catch (error) {
        console.error('[CNPJ] Error:', error)
      }
    }

    // PLACEHOLDER: Mock response para desenvolvimento
    console.warn('[CNPJ] API Brasil not configured, using mock data')

    return {
      cnpj: cnpjNumeros,
      razao_social: 'STARTUP EXEMPLO LTDA',
      nome_fantasia: 'Startup Exemplo',
      situacao_cadastral: 'ATIVA',
      data_situacao_cadastral: '2020-01-15',
      data_abertura: '2020-01-15',
      cnae_principal: {
        codigo: '6201-5/00',
        descricao: 'Desenvolvimento de programas de computador sob encomenda',
      },
      cnaes_secundarios: [
        {
          codigo: '6202-3/00',
          descricao: 'Desenvolvimento e licenciamento de programas de computador customizáveis',
        },
      ],
      capital_social: 100000.0,
      porte: 'MICRO EMPRESA',
      natureza_juridica: {
        codigo: '206-2',
        descricao: 'Sociedade Empresária Limitada',
      },
      endereco: {
        logradouro: 'RUA EXEMPLO',
        numero: '123',
        complemento: 'SALA 456',
        bairro: 'CENTRO',
        municipio: 'SÃO PAULO',
        uf: 'SP',
        cep: '01000-000',
      },
      telefones: [
        {
          ddd: '11',
          numero: '99999-9999',
        },
      ],
      email: 'contato@startupexemplo.com.br',
      socios: [
        {
          nome: 'JOÃO DA SILVA',
          cpf_cnpj: '123.456.789-00',
          qualificacao: 'Sócio-Administrador',
          data_entrada: '2020-01-15',
          percentual_capital: 50.0,
        },
        {
          nome: 'MARIA SANTOS',
          cpf_cnpj: '987.654.321-00',
          qualificacao: 'Sócio',
          data_entrada: '2020-01-15',
          percentual_capital: 50.0,
        },
      ],
    }
  } catch (error) {
    console.error('[CNPJ] Error:', error)
    return null
  }
}

/**
 * Verificar situação cadastral simplificada
 */
export async function verificarSituacaoCNPJ(
  cnpj: string,
  env: Env
): Promise<{
  ativa: boolean
  situacao: string
  data_situacao: string
} | null> {
  try {
    const dados = await consultarCNPJ(cnpj, env)

    if (!dados) {
      return null
    }

    return {
      ativa: dados.situacao_cadastral === 'ATIVA',
      situacao: dados.situacao_cadastral,
      data_situacao: dados.data_situacao_cadastral,
    }
  } catch (error) {
    console.error('[CNPJ] Error checking status:', error)
    return null
  }
}

/**
 * Extrair lista de sócios com CPF
 */
export async function obterSociosCNPJ(
  cnpj: string,
  env: Env
): Promise<
  Array<{
    nome: string
    cpf: string
    qualificacao: string
    percentual: number
  }>
> {
  try {
    const dados = await consultarCNPJ(cnpj, env)

    if (!dados || !dados.socios) {
      return []
    }

    return dados.socios.map((socio) => ({
      nome: socio.nome,
      cpf: socio.cpf_cnpj,
      qualificacao: socio.qualificacao,
      percentual: socio.percentual_capital,
    }))
  } catch (error) {
    console.error('[CNPJ] Error getting partners:', error)
    return []
  }
}

/**
 * Verificar se empresa está irregular (situação não ativa)
 */
export function isEmpresaIrregular(dados: CNPJData): {
  irregular: boolean
  motivos: string[]
} {
  const motivos: string[] = []

  if (dados.situacao_cadastral !== 'ATIVA') {
    motivos.push(`Situação cadastral: ${dados.situacao_cadastral}`)
  }

  if (dados.capital_social < 1000) {
    motivos.push('Capital social muito baixo (< R$ 1.000)')
  }

  if (!dados.email) {
    motivos.push('Email não cadastrado')
  }

  if (!dados.telefones || dados.telefones.length === 0) {
    motivos.push('Telefone não cadastrado')
  }

  return {
    irregular: motivos.length > 0,
    motivos,
  }
}

/**
 * Calcular idade da empresa em anos
 */
export function calcularIdadeEmpresa(dataAbertura: string): number {
  const abertura = new Date(dataAbertura)
  const hoje = new Date()
  const diffMs = hoje.getTime() - abertura.getTime()
  const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25)
  return Math.floor(diffYears)
}

/**
 * Análise de risco baseada em dados cadastrais
 */
export function analisarRiscoCadastral(dados: CNPJData): {
  score: number // 0-100
  fatores_risco: string[]
  recomendacao: 'baixo' | 'medio' | 'alto'
} {
  const fatoresRisco: string[] = []
  let score = 100

  // Situação cadastral
  if (dados.situacao_cadastral !== 'ATIVA') {
    fatoresRisco.push('Empresa não está ativa')
    score -= 50
  }

  // Idade da empresa
  const idade = calcularIdadeEmpresa(dados.data_abertura)
  if (idade < 1) {
    fatoresRisco.push('Empresa muito nova (< 1 ano)')
    score -= 20
  } else if (idade < 2) {
    fatoresRisco.push('Empresa recente (< 2 anos)')
    score -= 10
  }

  // Capital social
  if (dados.capital_social < 10000) {
    fatoresRisco.push('Capital social baixo (< R$ 10.000)')
    score -= 15
  }

  // Sócios
  if (!dados.socios || dados.socios.length === 0) {
    fatoresRisco.push('Nenhum sócio cadastrado')
    score -= 20
  } else if (dados.socios.length === 1) {
    fatoresRisco.push('Apenas um sócio (concentração de poder)')
    score -= 5
  }

  // Dados de contato
  if (!dados.email) {
    fatoresRisco.push('Email não cadastrado')
    score -= 5
  }

  if (!dados.telefones || dados.telefones.length === 0) {
    fatoresRisco.push('Telefone não cadastrado')
    score -= 5
  }

  // Determinar recomendação
  let recomendacao: 'baixo' | 'medio' | 'alto'
  if (score >= 70) {
    recomendacao = 'baixo'
  } else if (score >= 40) {
    recomendacao = 'medio'
  } else {
    recomendacao = 'alto'
  }

  return {
    score: Math.max(0, score),
    fatores_risco: fatoresRisco,
    recomendacao,
  }
}
