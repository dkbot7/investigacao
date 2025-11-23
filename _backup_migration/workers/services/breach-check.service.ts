/**
 * DeHashed API Service
 * Verificação de vazamentos de dados e credenciais comprometidas
 */

import { Env } from '../index'

export interface BreachEntry {
  id: string
  email?: string
  username?: string
  password?: string
  hashed_password?: string
  name?: string
  vin?: string
  address?: string
  phone?: string
  database_name: string
  obtained_from: string
  breach_date?: string
}

export interface BreachSearchResponse {
  success: boolean
  balance: number
  entries: BreachEntry[]
  took: number
  total: number
}

/**
 * Buscar vazamentos por email
 * PLACEHOLDER: Implementar integração real com DeHashed
 *
 * @param email - Email para verificar
 * @param env - Environment variables
 * @returns Vazamentos encontrados
 *
 * Docs: https://www.dehashed.com/docs
 * Custo: $9.99/mês (10 créditos/dia) ou $39.99/mês (ilimitado)
 */
export async function searchBreachesByEmail(
  email: string,
  env: Env
): Promise<BreachSearchResponse | null> {
  try {
    // Integração real com DeHashed API
    if (env.DEHASHED_EMAIL && env.DEHASHED_API_KEY) {
      const params = new URLSearchParams({
        query: `email:"${email}"`,
        size: '100',
      })

      const credentials = btoa(`${env.DEHASHED_EMAIL}:${env.DEHASHED_API_KEY}`)

      const response = await fetch(
        `https://api.dehashed.com/search?${params.toString()}`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${credentials}`,
          },
        }
      )

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('[BREACH_CHECK] API Error:', error)
        // Fallback para mock
      } else {
        return await response.json()
      }
    }

    // PLACEHOLDER: Mock response para desenvolvimento
    console.warn('[BREACH_CHECK] DeHashed not configured, using mock data')

    // Simular alguns vazamentos para desenvolvimento
    const mockEntries: BreachEntry[] = [
      {
        id: 'mock_1',
        email: email,
        password: 'senha123',
        database_name: 'LinkedIn Breach 2021',
        obtained_from: 'LinkedInBreach2021',
        breach_date: '2021-04-01',
      },
      {
        id: 'mock_2',
        email: email,
        hashed_password: 'e10adc3949ba59abbe56e057f20f883e',
        database_name: 'Adobe Breach 2013',
        obtained_from: 'Adobe2013',
        breach_date: '2013-10-01',
      },
    ]

    return {
      success: true,
      balance: 1000,
      entries: mockEntries,
      took: 123,
      total: mockEntries.length,
    }
  } catch (error) {
    console.error('[BREACH_CHECK] Error:', error)
    return null
  }
}

/**
 * Buscar vazamentos por domínio
 * Útil para verificar exposição da empresa inteira
 */
export async function searchBreachesByDomain(
  domain: string,
  env: Env
): Promise<BreachSearchResponse | null> {
  try {
    // TODO: Implementar integração real
    /*
    const params = new URLSearchParams({
      query: `email:*@${domain}`,
      size: '1000',
    })

    const response = await fetch(
      `https://api.dehashed.com/search?${params.toString()}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${btoa(`${env.DEHASHED_EMAIL}:${env.DEHASHED_API_KEY}`)}`,
        },
      }
    )

    if (!response.ok) {
      return null
    }

    return await response.json()
    */

    console.log('[BREACH_CHECK] PLACEHOLDER - Checking domain:', domain)

    return {
      success: true,
      balance: 1000,
      entries: [
        {
          id: 'mock_domain_1',
          email: `user1@${domain}`,
          database_name: 'Collection #1',
          obtained_from: 'Collection1',
          breach_date: '2019-01-01',
        },
        {
          id: 'mock_domain_2',
          email: `user2@${domain}`,
          database_name: 'LinkedIn Breach 2021',
          obtained_from: 'LinkedInBreach2021',
          breach_date: '2021-04-01',
        },
      ],
      took: 234,
      total: 2,
    }
  } catch (error) {
    console.error('[BREACH_CHECK] Error:', error)
    return null
  }
}

/**
 * Buscar vazamentos por username
 */
export async function searchBreachesByUsername(
  username: string,
  env: Env
): Promise<BreachSearchResponse | null> {
  try {
    // TODO: Implementar integração real
    console.log('[BREACH_CHECK] PLACEHOLDER - Checking username:', username)

    return {
      success: true,
      balance: 1000,
      entries: [],
      took: 100,
      total: 0,
    }
  } catch (error) {
    console.error('[BREACH_CHECK] Error:', error)
    return null
  }
}

/**
 * Buscar vazamentos por telefone
 */
export async function searchBreachesByPhone(
  phone: string,
  env: Env
): Promise<BreachSearchResponse | null> {
  try {
    // TODO: Implementar integração real
    console.log('[BREACH_CHECK] PLACEHOLDER - Checking phone:', phone)

    return {
      success: true,
      balance: 1000,
      entries: [],
      took: 89,
      total: 0,
    }
  } catch (error) {
    console.error('[BREACH_CHECK] Error:', error)
    return null
  }
}

/**
 * Análise de risco baseada em vazamentos
 */
export function analisarRiscoVazamentos(
  breaches: BreachSearchResponse
): {
  score: number // 0-100 (100 = sem risco)
  nivel_risco: 'baixo' | 'medio' | 'alto' | 'critico'
  total_vazamentos: number
  vazamentos_com_senha: number
  vazamentos_recentes: number
  databases_afetadas: string[]
  recomendacoes: string[]
} {
  const totalVazamentos = breaches.total
  const vazamentosComSenha = breaches.entries.filter(
    (e) => e.password || e.hashed_password
  ).length
  const vazamentosRecentes = breaches.entries.filter((e) => {
    if (!e.breach_date) return false
    const breachDate = new Date(e.breach_date)
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
    return breachDate > twoYearsAgo
  }).length

  const databasesAfetadas = [
    ...new Set(breaches.entries.map((e) => e.database_name)),
  ]

  // Calcular score
  let score = 100
  const recomendacoes: string[] = []

  if (totalVazamentos > 0) {
    score -= totalVazamentos * 5
    recomendacoes.push(`${totalVazamentos} vazamento(s) encontrado(s)`)
  }

  if (vazamentosComSenha > 0) {
    score -= vazamentosComSenha * 15
    recomendacoes.push(
      `${vazamentosComSenha} vazamento(s) com senha exposta - TROCAR SENHA IMEDIATAMENTE`
    )
  }

  if (vazamentosRecentes > 0) {
    score -= vazamentosRecentes * 10
    recomendacoes.push(
      `${vazamentosRecentes} vazamento(s) recente(s) (últimos 2 anos)`
    )
  }

  if (databasesAfetadas.length > 3) {
    score -= 10
    recomendacoes.push(
      'Credenciais comprometidas em múltiplos vazamentos - alto risco de reuso'
    )
  }

  score = Math.max(0, score)

  // Determinar nível de risco
  let nivelRisco: 'baixo' | 'medio' | 'alto' | 'critico'
  if (score >= 80) {
    nivelRisco = 'baixo'
  } else if (score >= 60) {
    nivelRisco = 'medio'
  } else if (score >= 30) {
    nivelRisco = 'alto'
  } else {
    nivelRisco = 'critico'
  }

  if (recomendacoes.length === 0) {
    recomendacoes.push('Nenhum vazamento identificado - boas práticas de segurança')
  }

  return {
    score,
    nivel_risco: nivelRisco,
    total_vazamentos: totalVazamentos,
    vazamentos_com_senha: vazamentosComSenha,
    vazamentos_recentes: vazamentosRecentes,
    databases_afetadas: databasesAfetadas,
    recomendacoes,
  }
}

/**
 * Verificar múltiplos emails de sócios
 */
export async function verificarVazamentosSocios(
  emails: string[],
  env: Env
): Promise<
  Array<{
    email: string
    breaches: BreachSearchResponse | null
    analise: ReturnType<typeof analisarRiscoVazamentos> | null
  }>
> {
  const results = await Promise.all(
    emails.map(async (email) => {
      const breaches = await searchBreachesByEmail(email, env)
      const analise = breaches ? analisarRiscoVazamentos(breaches) : null

      return {
        email,
        breaches,
        analise,
      }
    })
  )

  return results
}

/**
 * Gerar relatório resumido de vazamentos para empresa
 */
export function gerarRelatorioVazamentos(
  sociosAnalise: Array<{
    email: string
    breaches: BreachSearchResponse | null
    analise: ReturnType<typeof analisarRiscoVazamentos> | null
  }>
): {
  total_socios_analisados: number
  socios_com_vazamento: number
  total_vazamentos: number
  nivel_risco_geral: 'baixo' | 'medio' | 'alto' | 'critico'
  score_medio: number
  recomendacao: string
} {
  const totalSocios = sociosAnalise.length
  const sociosComVazamento = sociosAnalise.filter(
    (s) => s.analise && s.analise.total_vazamentos > 0
  ).length
  const totalVazamentos = sociosAnalise.reduce(
    (sum, s) => sum + (s.analise?.total_vazamentos || 0),
    0
  )

  const scoreMedio =
    sociosAnalise.reduce((sum, s) => sum + (s.analise?.score || 100), 0) /
    totalSocios

  let nivelRiscoGeral: 'baixo' | 'medio' | 'alto' | 'critico'
  if (scoreMedio >= 80) {
    nivelRiscoGeral = 'baixo'
  } else if (scoreMedio >= 60) {
    nivelRiscoGeral = 'medio'
  } else if (scoreMedio >= 30) {
    nivelRiscoGeral = 'alto'
  } else {
    nivelRiscoGeral = 'critico'
  }

  let recomendacao: string
  if (nivelRiscoGeral === 'baixo') {
    recomendacao =
      'Baixo risco de exposição. Manter boas práticas de segurança.'
  } else if (nivelRiscoGeral === 'medio') {
    recomendacao =
      'Risco moderado. Recomenda-se auditar senhas e implementar autenticação de dois fatores.'
  } else if (nivelRiscoGeral === 'alto') {
    recomendacao =
      'Alto risco! Múltiplos vazamentos detectados. Trocar todas as senhas e implementar autenticação de dois fatores URGENTE.'
  } else {
    recomendacao =
      'RISCO CRÍTICO! Credenciais altamente comprometidas. Ação imediata necessária: trocar todas as senhas, habilitar 2FA, auditar acessos.'
  }

  return {
    total_socios_analisados: totalSocios,
    socios_com_vazamento: sociosComVazamento,
    total_vazamentos: totalVazamentos,
    nivel_risco_geral: nivelRiscoGeral,
    score_medio: Math.round(scoreMedio),
    recomendacao,
  }
}
