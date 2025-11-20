/**
 * OpenAI AI Analysis Service
 * Análise inteligente de dados coletados usando GPT-4
 */

import { Env } from '../index'

export interface AnalysisInput {
  cnpj_data: any
  google_search_results: any
  breach_data: any
  additional_context?: string
}

export interface AnalysisOutput {
  resumo_executivo: string
  pontos_fortes: string[]
  pontos_fracos: string[]
  riscos_identificados: Array<{
    categoria: string
    descricao: string
    severidade: 'baixa' | 'media' | 'alta' | 'critica'
    recomendacao: string
  }>
  score_integridade: number // 0-100
  score_seguranca: number // 0-100
  score_reputacao: number // 0-100
  score_geral: number // 0-100
  recomendacao_investimento: 'recomendado' | 'com_ressalvas' | 'nao_recomendado'
  justificativa: string
  proximos_passos: string[]
}

/**
 * Analisar dados usando GPT-4
 * PLACEHOLDER: Implementar integração real com OpenAI
 *
 * @param input - Dados coletados para análise
 * @param env - Environment variables
 * @returns Análise estruturada
 *
 * Docs: https://platform.openai.com/docs/api-reference/chat
 * Custo: GPT-4 Turbo - $0.01/1K input tokens, $0.03/1K output tokens
 */
export async function analyzeWithAI(
  input: AnalysisInput,
  env: Env
): Promise<AnalysisOutput | null> {
  try {
    // Integração real com OpenAI API
    if (env.OPENAI_API_KEY) {
      const systemPrompt = `Você é um analista especializado em due diligence e investigação digital.
Sua tarefa é analisar dados de empresas e fornecer recomendações estruturadas para investidores.

Analise os seguintes aspectos:
1. Integridade cadastral (dados da Receita Federal)
2. Reputação online (resultados de busca no Google)
3. Segurança digital (vazamentos de dados)
4. Histórico legal (processos, condenações)
5. Presença digital e profissionalismo

Forneça uma análise objetiva, baseada em fatos, com scores numéricos e recomendações claras.`

    const userPrompt = `Analise a seguinte startup:

**Dados Cadastrais (CNPJ):**
${JSON.stringify(input.cnpj_data, null, 2)}

**Resultados de Busca (Google):**
${JSON.stringify(input.google_search_results, null, 2)}

**Vazamentos de Dados:**
${JSON.stringify(input.breach_data, null, 2)}

${input.additional_context ? `**Contexto Adicional:**\n${input.additional_context}` : ''}

Forneça sua análise no formato JSON especificado.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('[AI_ANALYSIS] API Error:', error)
      return null
    }

      const data = await response.json()
      const analysis = JSON.parse(data.choices[0].message.content)
      return analysis
    }

    // PLACEHOLDER: Mock response para desenvolvimento
    console.warn('[AI_ANALYSIS] OpenAI not configured, using mock analysis')

    const mockAnalysis: AnalysisOutput = {
      resumo_executivo:
        'Startup em estágio inicial com perfil cadastral regular. Presença digital moderada. Alguns riscos de segurança identificados que requerem atenção.',
      pontos_fortes: [
        'Empresa ativa e regularizada',
        'Sócios com perfil profissional no LinkedIn',
        'Capital social adequado para o porte',
        'CNAE compatível com modelo de negócio',
      ],
      pontos_fracos: [
        'Empresa recente (menos de 2 anos)',
        'Presença digital limitada',
        'Poucos resultados de busca relevantes',
        'Dados de contato incompletos',
      ],
      riscos_identificados: [
        {
          categoria: 'Segurança Digital',
          descricao:
            'Credenciais de sócios encontradas em vazamentos de dados (LinkedIn 2021)',
          severidade: 'alta',
          recomendacao:
            'Solicitar evidências de troca de senhas e implementação de autenticação de dois fatores',
        },
        {
          categoria: 'Maturidade Empresarial',
          descricao: 'Empresa com menos de 2 anos de operação',
          severidade: 'media',
          recomendacao:
            'Avaliar tração, receita recorrente e projeções financeiras antes de investir',
        },
        {
          categoria: 'Governança',
          descricao: 'Estrutura societária simples, sem conselheiros externos',
          severidade: 'baixa',
          recomendacao:
            'Considerar implementação de conselho consultivo ou advisory board',
        },
      ],
      score_integridade: 75,
      score_seguranca: 60,
      score_reputacao: 65,
      score_geral: 67,
      recomendacao_investimento: 'com_ressalvas',
      justificativa:
        'Startup apresenta fundamentos cadastrais sólidos, mas possui riscos de segurança e maturidade que devem ser endereçados. Recomenda-se investimento condicionado à mitigação dos riscos identificados e apresentação de métricas de tração.',
      proximos_passos: [
        'Solicitar relatório de segurança da informação',
        'Revisar métricas de produto (DAU, MAU, receita)',
        'Verificar histórico de captações anteriores',
        'Analisar projeções financeiras e break-even',
        'Entrevistar fundadores sobre visão de longo prazo',
        'Due diligence jurídica detalhada (contratos, IP, passivos)',
      ],
    }

    return mockAnalysis
  } catch (error) {
    console.error('[AI_ANALYSIS] Error:', error)
    return null
  }
}

/**
 * Gerar resumo executivo curto para dashboard
 */
export async function generateExecutiveSummary(
  companyName: string,
  cnpjData: any,
  env: Env
): Promise<string> {
  try {
    // TODO: Implementar com OpenAI
    console.log('[AI_ANALYSIS] PLACEHOLDER - Generating summary for:', companyName)

    return `${companyName} é uma ${cnpjData.natureza_juridica.descricao} fundada em ${new Date(cnpjData.data_abertura).getFullYear()}, com capital social de R$ ${cnpjData.capital_social.toLocaleString('pt-BR')}. Atua no setor de ${cnpjData.cnae_principal.descricao}. Status atual: ${cnpjData.situacao_cadastral}.`
  } catch (error) {
    console.error('[AI_ANALYSIS] Error generating summary:', error)
    return 'Erro ao gerar resumo executivo.'
  }
}

/**
 * Analisar sentimento de notícias
 */
export async function analyzeSentiment(
  articles: Array<{ title: string; snippet: string }>,
  env: Env
): Promise<{
  sentiment: 'positivo' | 'neutro' | 'negativo'
  confidence: number
  summary: string
}> {
  try {
    // TODO: Implementar com OpenAI
    console.log('[AI_ANALYSIS] PLACEHOLDER - Analyzing sentiment...')

    return {
      sentiment: 'neutro',
      confidence: 0.7,
      summary:
        'Cobertura de imprensa limitada. Não foram identificadas notícias significativamente positivas ou negativas.',
    }
  } catch (error) {
    console.error('[AI_ANALYSIS] Error analyzing sentiment:', error)
    return {
      sentiment: 'neutro',
      confidence: 0,
      summary: 'Erro na análise de sentimento.',
    }
  }
}

/**
 * Gerar perguntas para due diligence adicional
 */
export async function generateDueDiligenceQuestions(
  analysis: AnalysisOutput,
  env: Env
): Promise<string[]> {
  try {
    // TODO: Implementar com OpenAI
    console.log('[AI_ANALYSIS] PLACEHOLDER - Generating questions...')

    return [
      'Quais são as principais métricas de produto (usuários ativos, retenção, churn)?',
      'Qual é o burn rate mensal e runway atual?',
      'Existem contratos assinados com clientes? Qual o tamanho do pipeline?',
      'Como está protegida a propriedade intelectual da empresa?',
      'Há passivos trabalhistas ou fiscais não declarados?',
      'Qual é a estratégia de go-to-market para os próximos 12 meses?',
      'Como os fundadores planejam usar o capital captado?',
      'Existe algum acordo de não-concorrência com ex-empregadores?',
    ]
  } catch (error) {
    console.error('[AI_ANALYSIS] Error generating questions:', error)
    return []
  }
}

/**
 * Comparar startup com benchmarks do setor
 */
export async function compareWithBenchmarks(
  cnpjData: any,
  metrics: {
    revenue?: number
    users?: number
    team_size?: number
  },
  env: Env
): Promise<{
  comparison: string
  above_average: string[]
  below_average: string[]
  recommendations: string[]
}> {
  try {
    // TODO: Implementar com dados reais e OpenAI
    console.log('[AI_ANALYSIS] PLACEHOLDER - Comparing with benchmarks...')

    return {
      comparison:
        'Startup apresenta métricas dentro da média para estágio seed em seu setor.',
      above_average: [
        'Capital social acima da média',
        'Estrutura societária bem definida',
      ],
      below_average: ['Tempo de mercado abaixo da média', 'Presença digital limitada'],
      recommendations: [
        'Investir em marketing de conteúdo',
        'Expandir presença em redes sociais',
        'Publicar case studies e depoimentos de clientes',
      ],
    }
  } catch (error) {
    console.error('[AI_ANALYSIS] Error comparing benchmarks:', error)
    return {
      comparison: 'Erro na comparação com benchmarks.',
      above_average: [],
      below_average: [],
      recommendations: [],
    }
  }
}

/**
 * Gerar recomendações personalizadas para investidor
 */
export async function generateInvestorRecommendations(
  analysis: AnalysisOutput,
  investorProfile: {
    risk_tolerance: 'conservative' | 'moderate' | 'aggressive'
    investment_stage: 'pre-seed' | 'seed' | 'series-a' | 'series-b+'
    sector_focus?: string[]
  },
  env: Env
): Promise<{
  should_invest: boolean
  confidence: number
  rationale: string
  conditions: string[]
  red_flags: string[]
}> {
  try {
    // TODO: Implementar com OpenAI personalizando por perfil
    console.log('[AI_ANALYSIS] PLACEHOLDER - Generating investor recommendations...')

    return {
      should_invest: analysis.score_geral >= 60,
      confidence: 0.75,
      rationale:
        'Startup demonstra potencial, mas apresenta riscos que devem ser mitigados antes do investimento.',
      conditions: [
        'Implementar práticas de segurança da informação',
        'Apresentar métricas de tração dos últimos 6 meses',
        'Estruturar cap table e acordos de vesting',
      ],
      red_flags: analysis.riscos_identificados
        .filter((r) => r.severidade === 'alta' || r.severidade === 'critica')
        .map((r) => r.descricao),
    }
  } catch (error) {
    console.error('[AI_ANALYSIS] Error generating recommendations:', error)
    return {
      should_invest: false,
      confidence: 0,
      rationale: 'Erro na geração de recomendações.',
      conditions: [],
      red_flags: [],
    }
  }
}
