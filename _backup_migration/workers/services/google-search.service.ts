/**
 * Google Custom Search API Service
 * OSINT - Open Source Intelligence via Google Search
 */

import { Env } from '../index'

export interface GoogleSearchResult {
  title: string
  link: string
  snippet: string
  displayLink: string
  formattedUrl: string
}

export interface GoogleSearchResponse {
  items: GoogleSearchResult[]
  searchInformation: {
    totalResults: string
    searchTime: number
  }
  queries: {
    request: Array<{
      totalResults: string
      searchTerms: string
    }>
  }
}

/**
 * Realizar busca no Google Custom Search
 * PLACEHOLDER: Implementar integração real
 *
 * @param query - Termo de busca
 * @param options - Opções adicionais (siteSearch, dateRestrict, etc)
 * @param env - Environment variables
 * @returns Resultados da busca
 *
 * Docs: https://developers.google.com/custom-search/v1/reference/rest/v1/cse/list
 * Custo: $5 por 1000 queries (primeiras 100/dia grátis)
 */
export async function searchGoogle(
  query: string,
  options: {
    siteSearch?: string // Restringir busca a domínio específico
    dateRestrict?: string // Ex: d7 (últimos 7 dias), m1 (último mês)
    num?: number // Número de resultados (max 10)
    start?: number // Offset para paginação
    exactTerms?: string // Busca exata
  } = {},
  env: Env
): Promise<GoogleSearchResponse | null> {
  try {
    // Integração real com Google Custom Search API
    if (env.GOOGLE_API_KEY && env.GOOGLE_CSE_ID) {
      const params = new URLSearchParams({
        key: env.GOOGLE_API_KEY,
        cx: env.GOOGLE_CSE_ID,
        q: query,
        num: (options.num || 10).toString(),
        ...(options.siteSearch && { siteSearch: options.siteSearch }),
        ...(options.dateRestrict && { dateRestrict: options.dateRestrict }),
        ...(options.start && { start: options.start.toString() }),
        ...(options.exactTerms && { exactTerms: options.exactTerms }),
      })

      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?${params.toString()}`
      )

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('[GOOGLE_SEARCH] API Error:', error)
        // Fallback para mock
      } else {
        return await response.json()
      }
    }

    // PLACEHOLDER: Mock response para desenvolvimento
    console.warn('[GOOGLE_SEARCH] Google API not configured, using mock data')

    return {
      items: [
        {
          title: `Resultado mock para: ${query}`,
          link: 'https://example.com/mock',
          snippet: 'Este é um resultado de busca simulado...',
          displayLink: 'example.com',
          formattedUrl: 'https://example.com/mock',
        },
      ],
      searchInformation: {
        totalResults: '1',
        searchTime: 0.25,
      },
      queries: {
        request: [
          {
            totalResults: '1',
            searchTerms: query,
          },
        ],
      },
    }
  } catch (error) {
    console.error('[GOOGLE_SEARCH] Error:', error)
    return null
  }
}

/**
 * Buscar informações sobre startup/empresa
 * Combina múltiplas queries específicas
 */
export async function searchCompanyIntelligence(
  companyName: string,
  cnpj: string,
  env: Env
): Promise<{
  news: GoogleSearchResult[]
  social: GoogleSearchResult[]
  legal: GoogleSearchResult[]
  general: GoogleSearchResult[]
}> {
  try {
    // Queries paralelas
    const [newsResults, socialResults, legalResults, generalResults] = await Promise.all([
      // Notícias recentes
      searchGoogle(
        `"${companyName}" OR "${cnpj}" (notícia OR news OR reportagem)`,
        { dateRestrict: 'm6', num: 10 },
        env
      ),

      // Presença em redes sociais
      searchGoogle(
        `"${companyName}" site:(linkedin.com OR twitter.com OR facebook.com OR instagram.com)`,
        { num: 5 },
        env
      ),

      // Processos jurídicos
      searchGoogle(
        `"${companyName}" OR "${cnpj}" (processo OR judicial OR tribunal OR sentença)`,
        { num: 10 },
        env
      ),

      // Busca geral
      searchGoogle(`"${companyName}" "${cnpj}"`, { num: 10 }, env),
    ])

    return {
      news: newsResults?.items || [],
      social: socialResults?.items || [],
      legal: legalResults?.items || [],
      general: generalResults?.items || [],
    }
  } catch (error) {
    console.error('[GOOGLE_SEARCH] Error in company intelligence:', error)
    return {
      news: [],
      social: [],
      legal: [],
      general: [],
    }
  }
}

/**
 * Buscar informações sobre pessoa (sócio)
 */
export async function searchPersonIntelligence(
  name: string,
  cpf?: string,
  env?: Env
): Promise<{
  professional: GoogleSearchResult[]
  legal: GoogleSearchResult[]
  social: GoogleSearchResult[]
}> {
  if (!env) {
    return { professional: [], legal: [], social: [] }
  }

  try {
    const cpfQuery = cpf ? ` OR "${cpf}"` : ''

    const [professionalResults, legalResults, socialResults] = await Promise.all([
      // Perfil profissional
      searchGoogle(
        `"${name}"${cpfQuery} site:(linkedin.com OR lattes.cnpq.br OR crunchbase.com)`,
        { num: 5 },
        env
      ),

      // Histórico legal
      searchGoogle(
        `"${name}"${cpfQuery} (processo OR condenação OR judicial)`,
        { num: 10 },
        env
      ),

      // Presença social
      searchGoogle(
        `"${name}" site:(twitter.com OR facebook.com OR instagram.com)`,
        { num: 5 },
        env
      ),
    ])

    return {
      professional: professionalResults?.items || [],
      legal: legalResults?.items || [],
      social: socialResults?.items || [],
    }
  } catch (error) {
    console.error('[GOOGLE_SEARCH] Error in person intelligence:', error)
    return {
      professional: [],
      legal: [],
      social: [],
    }
  }
}
