/**
 * Cron Job: Process Pending Reports
 * Executado a cada 6 horas para processar relatórios pendentes
 */

import { Env } from '../index'
import { consultarCNPJ, obterSociosCNPJ, analisarRiscoCadastral } from '../services/cnpj.service'
import {
  searchCompanyIntelligence,
  searchPersonIntelligence,
} from '../services/google-search.service'
import {
  searchBreachesByEmail,
  verificarVazamentosSocios,
  gerarRelatorioVazamentos,
} from '../services/breach-check.service'
import { analyzeWithAI } from '../services/ai-analysis.service'
import { generateReportPDF } from '../services/pdf-generator.service'
import { sendReportReadyEmail } from '../services/email.service'

export async function processPendingReports(env: Env): Promise<void> {
  try {
    console.log('[CRON] Starting report processing...')

    // Buscar relatórios pendentes ou em andamento
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/reports?status=in.(pendente,em_andamento)&select=*&order=created_at.asc&limit=10`,
      {
        headers: {
          apikey: env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erro ao buscar relatórios pendentes')
    }

    const reports = await response.json()

    console.log(`[CRON] Found ${reports.length} pending reports`)

    // Processar cada relatório
    for (const report of reports) {
      try {
        await processReport(report, env)
      } catch (error) {
        console.error(`[CRON] Error processing report ${report.id}:`, error)
        // Marcar como erro
        await updateReportStatus(report.id, 'erro', env, {
          error_message: error instanceof Error ? error.message : 'Erro desconhecido',
        })
      }
    }

    console.log('[CRON] Report processing completed')
  } catch (error) {
    console.error('[CRON] Fatal error in cron job:', error)
  }
}

/**
 * Processar um relatório individual
 */
async function processReport(report: any, env: Env): Promise<void> {
  console.log(`[CRON] Processing report ${report.id} for ${report.startup_nome}`)

  // 1. Marcar como em andamento
  await updateReportStatus(report.id, 'em_andamento', env)

  // 2. Coletar dados do CNPJ
  console.log('[CRON] Step 1/6: Fetching CNPJ data...')
  const cnpjData = await consultarCNPJ(report.startup_cnpj, env)

  if (!cnpjData) {
    throw new Error('Falha ao consultar CNPJ')
  }

  // Análise de risco cadastral
  const riscoCadastral = analisarRiscoCadastral(cnpjData)

  // 3. Buscar sócios e seus emails
  console.log('[CRON] Step 2/6: Fetching partners data...')
  const socios = await obterSociosCNPJ(report.startup_cnpj, env)

  // Extrair emails dos sócios (domínio da empresa)
  const dominio = cnpjData.email?.split('@')[1] || `${report.startup_nome.toLowerCase().replace(/\s/g, '')}.com.br`
  const emailsSocios = socios.map(
    (s) => s.nome.toLowerCase().split(' ')[0] + '@' + dominio
  )

  // 4. Verificar vazamentos de dados
  console.log('[CRON] Step 3/6: Checking data breaches...')
  const vazamentosAnalise = await verificarVazamentosSocios(emailsSocios, env)
  const relatorioVazamentos = gerarRelatorioVazamentos(vazamentosAnalise)

  // 5. Buscar informações OSINT (Google)
  console.log('[CRON] Step 4/6: Performing OSINT search...')
  const osintCompany = await searchCompanyIntelligence(
    report.startup_nome,
    report.startup_cnpj,
    env
  )

  // Buscar informações sobre sócios principais
  const osintSocios = await Promise.all(
    socios.slice(0, 3).map((socio) => searchPersonIntelligence(socio.nome, socio.cpf, env))
  )

  // 6. Análise com IA
  console.log('[CRON] Step 5/6: AI analysis...')
  const aiAnalysis = await analyzeWithAI(
    {
      cnpj_data: cnpjData,
      google_search_results: {
        company: osintCompany,
        partners: osintSocios,
      },
      breach_data: relatorioVazamentos,
      additional_context: report.observacoes || '',
    },
    env
  )

  if (!aiAnalysis) {
    throw new Error('Falha na análise de IA')
  }

  // 7. Gerar PDF
  console.log('[CRON] Step 6/6: Generating PDF...')

  // Buscar dados do investidor
  const userResponse = await fetch(
    `${env.SUPABASE_URL}/rest/v1/users?id=eq.${report.user_id}&select=nome_completo,email`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    }
  )
  const users = await userResponse.json()
  const user = users[0]

  const pdfData = {
    company_name: report.startup_nome,
    cnpj: report.startup_cnpj,
    report_id: report.id,
    generated_at: new Date().toISOString(),
    investor_name: user?.nome_completo || 'Investidor',

    analysis: {
      resumo_executivo: aiAnalysis.resumo_executivo,
      score_geral: aiAnalysis.score_geral,
      score_integridade: aiAnalysis.score_integridade,
      score_seguranca: aiAnalysis.score_seguranca,
      score_reputacao: aiAnalysis.score_reputacao,
      recomendacao: aiAnalysis.recomendacao_investimento,
      justificativa: aiAnalysis.justificativa,
    },

    cadastral: {
      razao_social: cnpjData.razao_social,
      nome_fantasia: cnpjData.nome_fantasia,
      situacao: cnpjData.situacao_cadastral,
      data_abertura: cnpjData.data_abertura,
      capital_social: cnpjData.capital_social,
      porte: cnpjData.porte,
      cnae: cnpjData.cnae_principal.descricao,
      endereco: `${cnpjData.endereco.logradouro}, ${cnpjData.endereco.numero} - ${cnpjData.endereco.bairro}, ${cnpjData.endereco.municipio}/${cnpjData.endereco.uf}`,
      socios: socios.map((s) => ({
        nome: s.nome,
        cpf: s.cpf,
        percentual: s.percentual,
      })),
    },

    risks: aiAnalysis.riscos_identificados,

    breaches: {
      total: relatorioVazamentos.total_vazamentos,
      socios_afetados: relatorioVazamentos.socios_com_vazamento,
      nivel_risco: relatorioVazamentos.nivel_risco_geral,
      recomendacao: relatorioVazamentos.recomendacao,
    },

    digital_presence: {
      news_count: osintCompany.news.length,
      social_presence: osintCompany.social.length > 0,
      legal_issues_count: osintCompany.legal.length,
    },

    next_steps: aiAnalysis.proximos_passos,
  }

  const pdfUrl = await generateReportPDF(pdfData, env)

  if (!pdfUrl) {
    throw new Error('Falha ao gerar PDF')
  }

  // 8. Atualizar relatório no banco com todos os dados
  console.log('[CRON] Updating report with results...')
  await fetch(`${env.SUPABASE_URL}/rest/v1/reports?id=eq.${report.id}`, {
    method: 'PATCH',
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'concluido',
      pdf_url: pdfUrl,
      recomendacao: aiAnalysis.recomendacao_investimento,
      score_integridade: aiAnalysis.score_integridade,
      score_seguranca: aiAnalysis.score_seguranca,
      score_reputacao: aiAnalysis.score_reputacao,
      score_geral: aiAnalysis.score_geral,
      dados_completos: pdfData, // Salvar dados estruturados como JSONB
      processado_em: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  })

  // 9. Enviar email de notificação
  if (user?.email) {
    console.log('[CRON] Sending notification email...')
    await sendReportReadyEmail(
      user.email,
      user.nome_completo || 'Investidor',
      report.startup_nome,
      report.id,
      pdfUrl,
      env
    )
  }

  // 10. Log de conclusão
  await logReportProcessing(
    report.id,
    'completed',
    {
      cnpj_data: true,
      osint_data: true,
      breach_data: true,
      ai_analysis: true,
      pdf_generated: true,
      email_sent: !!user?.email,
    },
    env
  )

  console.log(`[CRON] Report ${report.id} completed successfully`)
}

/**
 * Atualizar status do relatório
 */
async function updateReportStatus(
  reportId: string,
  status: string,
  env: Env,
  additionalData: Record<string, any> = {}
): Promise<void> {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}`, {
      method: 'PATCH',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
        updated_at: new Date().toISOString(),
        ...additionalData,
      }),
    })
  } catch (error) {
    console.error('[CRON] Error updating report status:', error)
  }
}

/**
 * Log de processamento para auditoria
 */
async function logReportProcessing(
  reportId: string,
  status: string,
  details: Record<string, any>,
  env: Env
): Promise<void> {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/api_logs`, {
      method: 'POST',
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: 'cron/process-reports',
        method: 'CRON',
        status_code: status === 'completed' ? 200 : 500,
        user_id: null,
        metadata: {
          report_id: reportId,
          status,
          ...details,
        },
        cost: 0, // Calcular custo real baseado em APIs chamadas
        created_at: new Date().toISOString(),
      }),
    })
  } catch (error) {
    console.error('[CRON] Error logging:', error)
  }
}
