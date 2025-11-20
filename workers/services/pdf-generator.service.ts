/**
 * PDF Generator Service
 * Geração de relatórios em PDF com design profissional
 */

import { Env } from '../index'

export interface ReportData {
  company_name: string
  cnpj: string
  report_id: string
  generated_at: string
  investor_name: string

  // Análise estruturada
  analysis: {
    resumo_executivo: string
    score_geral: number
    score_integridade: number
    score_seguranca: number
    score_reputacao: number
    recomendacao: 'recomendado' | 'com_ressalvas' | 'nao_recomendado'
    justificativa: string
  }

  // Dados cadastrais
  cadastral: {
    razao_social: string
    nome_fantasia: string
    situacao: string
    data_abertura: string
    capital_social: number
    porte: string
    cnae: string
    endereco: string
    socios: Array<{
      nome: string
      cpf: string
      percentual: number
    }>
  }

  // Riscos identificados
  risks: Array<{
    categoria: string
    descricao: string
    severidade: 'baixa' | 'media' | 'alta' | 'critica'
    recomendacao: string
  }>

  // Vazamentos de dados
  breaches: {
    total: number
    socios_afetados: number
    nivel_risco: string
    recomendacao: string
  }

  // Presença digital
  digital_presence: {
    news_count: number
    social_presence: boolean
    legal_issues_count: number
  }

  // Próximos passos
  next_steps: string[]
}

/**
 * Gerar PDF de relatório
 * PLACEHOLDER: Implementar geração real de PDF
 *
 * @param data - Dados do relatório
 * @param env - Environment variables
 * @returns URL do PDF gerado ou null
 *
 * Opções de implementação:
 * 1. Puppeteer (Chromium headless) - Mais completo, mas pesado
 * 2. PDFKit - Leve, mas requer mais código para layout
 * 3. jsPDF - Cliente-side, mas pode ser usado no Worker
 * 4. Serviço externo (DocRaptor, PDF.co) - $$ mas robusto
 *
 * Recomendação: Puppeteer via Cloudflare Browser Rendering API
 * Docs: https://developers.cloudflare.com/browser-rendering/
 * Custo: $5/milhão de segundos de renderização
 */
export async function generateReportPDF(
  data: ReportData,
  env: Env
): Promise<string | null> {
  try {
    // TODO: Implementar geração real de PDF
    /*
    // Opção 1: Usando Cloudflare Browser Rendering + Puppeteer
    const browser = await puppeteer.launch(env.BROWSER)
    const page = await browser.newPage()

    // Gerar HTML do relatório
    const html = generateReportHTML(data)
    await page.setContent(html)

    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm',
      },
    })

    await browser.close()

    // Upload para R2 (Cloudflare Object Storage)
    const fileName = `reports/${data.report_id}.pdf`
    await env.R2.put(fileName, pdfBuffer, {
      httpMetadata: {
        contentType: 'application/pdf',
      },
    })

    // Retornar URL
    return `${env.R2_PUBLIC_URL}/${fileName}`
    */

    // PLACEHOLDER: Retornar URL mock
    console.log('[PDF_GENERATOR] PLACEHOLDER - Generating PDF for:', data.company_name)

    const mockPdfUrl = `https://storage.investigaree.com.br/reports/${data.report_id}.pdf`
    return mockPdfUrl
  } catch (error) {
    console.error('[PDF_GENERATOR] Error:', error)
    return null
  }
}

/**
 * Gerar HTML do relatório com design profissional
 * Este HTML será convertido em PDF
 */
export function generateReportHTML(data: ReportData): string {
  const severityColors = {
    baixa: '#4CAF50',
    media: '#FF9800',
    alta: '#FF5722',
    critica: '#D32F2F',
  }

  const scoreColor = (score: number) => {
    if (score >= 80) return '#4CAF50'
    if (score >= 60) return '#FF9800'
    if (score >= 40) return '#FF5722'
    return '#D32F2F'
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Due Diligence - ${data.company_name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
    }

    .page {
      padding: 20mm;
      background: white;
    }

    .header {
      background: linear-gradient(135deg, #0A4D8C 0%, #052340 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }

    .header h1 {
      font-size: 28pt;
      margin-bottom: 10px;
    }

    .header .subtitle {
      font-size: 14pt;
      opacity: 0.9;
    }

    .metadata {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 6px;
      font-size: 10pt;
    }

    .section {
      margin-bottom: 30px;
    }

    .section h2 {
      color: #052340;
      font-size: 18pt;
      border-bottom: 3px solid #0A4D8C;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }

    .section h3 {
      color: #0A4D8C;
      font-size: 14pt;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    .score-box {
      display: inline-block;
      padding: 15px 25px;
      background: white;
      border: 3px solid;
      border-radius: 8px;
      text-align: center;
      margin: 10px;
    }

    .score-box .label {
      font-size: 10pt;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .score-box .value {
      font-size: 32pt;
      font-weight: 700;
    }

    .risk-item {
      padding: 15px;
      margin-bottom: 15px;
      border-left: 5px solid;
      background: #fafafa;
      border-radius: 4px;
    }

    .risk-item h4 {
      font-size: 12pt;
      margin-bottom: 5px;
    }

    .risk-item .severity {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      color: white;
      font-size: 9pt;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 15px;
    }

    .info-item {
      padding: 10px;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .info-item .label {
      font-weight: 600;
      color: #0A4D8C;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item .value {
      font-size: 11pt;
      margin-top: 5px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
    }

    table th {
      background: #0A4D8C;
      color: white;
      padding: 10px;
      text-align: left;
      font-size: 10pt;
    }

    table td {
      padding: 10px;
      border-bottom: 1px solid #ddd;
      font-size: 10pt;
    }

    .recommendation-box {
      padding: 20px;
      background: #E3F2FD;
      border: 2px solid #0A4D8C;
      border-radius: 8px;
      margin: 20px 0;
    }

    .recommendation-box .title {
      font-size: 14pt;
      font-weight: 700;
      color: #052340;
      margin-bottom: 10px;
    }

    ul {
      margin-left: 20px;
      margin-top: 10px;
    }

    li {
      margin-bottom: 8px;
    }

    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
      font-size: 9pt;
      color: #666;
    }

    .page-break {
      page-break-after: always;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <h1>Relatório de Due Diligence</h1>
      <div class="subtitle">${data.company_name}</div>
    </div>

    <!-- Metadata -->
    <div class="metadata">
      <div>
        <strong>CNPJ:</strong> ${data.cnpj}<br>
        <strong>ID do Relatório:</strong> ${data.report_id}
      </div>
      <div style="text-align: right;">
        <strong>Gerado em:</strong> ${new Date(data.generated_at).toLocaleDateString('pt-BR')}<br>
        <strong>Investidor:</strong> ${data.investor_name}
      </div>
    </div>

    <!-- Resumo Executivo -->
    <div class="section">
      <h2>Resumo Executivo</h2>
      <p>${data.analysis.resumo_executivo}</p>
    </div>

    <!-- Scores -->
    <div class="section">
      <h2>Scores de Avaliação</h2>
      <div style="text-align: center;">
        <div class="score-box" style="border-color: ${scoreColor(data.analysis.score_geral)};">
          <div class="label">SCORE GERAL</div>
          <div class="value" style="color: ${scoreColor(data.analysis.score_geral)};">${data.analysis.score_geral}</div>
        </div>
        <div class="score-box" style="border-color: ${scoreColor(data.analysis.score_integridade)};">
          <div class="label">INTEGRIDADE</div>
          <div class="value" style="color: ${scoreColor(data.analysis.score_integridade)};">${data.analysis.score_integridade}</div>
        </div>
        <div class="score-box" style="border-color: ${scoreColor(data.analysis.score_seguranca)};">
          <div class="label">SEGURANÇA</div>
          <div class="value" style="color: ${scoreColor(data.analysis.score_seguranca)};">${data.analysis.score_seguranca}</div>
        </div>
        <div class="score-box" style="border-color: ${scoreColor(data.analysis.score_reputacao)};">
          <div class="label">REPUTAÇÃO</div>
          <div class="value" style="color: ${scoreColor(data.analysis.score_reputacao)};">${data.analysis.score_reputacao}</div>
        </div>
      </div>
    </div>

    <!-- Recomendação -->
    <div class="recommendation-box">
      <div class="title">Recomendação de Investimento: ${data.analysis.recomendacao.toUpperCase().replace(/_/g, ' ')}</div>
      <p>${data.analysis.justificativa}</p>
    </div>

    <div class="page-break"></div>

    <!-- Dados Cadastrais -->
    <div class="section">
      <h2>Dados Cadastrais</h2>

      <div class="info-grid">
        <div class="info-item">
          <div class="label">Razão Social</div>
          <div class="value">${data.cadastral.razao_social}</div>
        </div>
        <div class="info-item">
          <div class="label">Nome Fantasia</div>
          <div class="value">${data.cadastral.nome_fantasia}</div>
        </div>
        <div class="info-item">
          <div class="label">Situação</div>
          <div class="value">${data.cadastral.situacao}</div>
        </div>
        <div class="info-item">
          <div class="label">Data de Abertura</div>
          <div class="value">${new Date(data.cadastral.data_abertura).toLocaleDateString('pt-BR')}</div>
        </div>
        <div class="info-item">
          <div class="label">Capital Social</div>
          <div class="value">R$ ${data.cadastral.capital_social.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="info-item">
          <div class="label">Porte</div>
          <div class="value">${data.cadastral.porte}</div>
        </div>
      </div>

      <h3>Sócios</h3>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>CPF</th>
            <th>Participação</th>
          </tr>
        </thead>
        <tbody>
          ${data.cadastral.socios.map(socio => `
            <tr>
              <td>${socio.nome}</td>
              <td>${socio.cpf}</td>
              <td>${socio.percentual}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Riscos Identificados -->
    <div class="section">
      <h2>Riscos Identificados</h2>
      ${data.risks.map(risk => `
        <div class="risk-item" style="border-color: ${severityColors[risk.severidade]};">
          <span class="severity" style="background: ${severityColors[risk.severidade]};">
            ${risk.severidade.toUpperCase()}
          </span>
          <h4>${risk.categoria}</h4>
          <p>${risk.descricao}</p>
          <p><strong>Recomendação:</strong> ${risk.recomendacao}</p>
        </div>
      `).join('')}
    </div>

    <div class="page-break"></div>

    <!-- Análise de Segurança -->
    <div class="section">
      <h2>Análise de Segurança Digital</h2>
      <div class="info-grid">
        <div class="info-item">
          <div class="label">Total de Vazamentos</div>
          <div class="value">${data.breaches.total}</div>
        </div>
        <div class="info-item">
          <div class="label">Sócios Afetados</div>
          <div class="value">${data.breaches.socios_afetados}</div>
        </div>
        <div class="info-item">
          <div class="label">Nível de Risco</div>
          <div class="value">${data.breaches.nivel_risco}</div>
        </div>
      </div>
      <p><strong>Recomendação:</strong> ${data.breaches.recomendacao}</p>
    </div>

    <!-- Presença Digital -->
    <div class="section">
      <h2>Presença Digital</h2>
      <ul>
        <li><strong>Notícias encontradas:</strong> ${data.digital_presence.news_count}</li>
        <li><strong>Presença em redes sociais:</strong> ${data.digital_presence.social_presence ? 'Sim' : 'Não'}</li>
        <li><strong>Questões legais identificadas:</strong> ${data.digital_presence.legal_issues_count}</li>
      </ul>
    </div>

    <!-- Próximos Passos -->
    <div class="section">
      <h2>Próximos Passos Recomendados</h2>
      <ul>
        ${data.next_steps.map(step => `<li>${step}</li>`).join('')}
      </ul>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>investigaree</strong> - Investigação Digital e Due Diligence</p>
      <p>Este relatório é confidencial e destinado exclusivamente ao solicitante.</p>
      <p>Gerado em ${new Date(data.generated_at).toLocaleString('pt-BR')}</p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Upload de PDF para storage (R2)
 * PLACEHOLDER: Implementar upload real
 */
export async function uploadPDFToStorage(
  pdfBuffer: ArrayBuffer,
  fileName: string,
  env: Env
): Promise<string | null> {
  try {
    // TODO: Implementar upload para Cloudflare R2
    /*
    await env.R2.put(`reports/${fileName}`, pdfBuffer, {
      httpMetadata: {
        contentType: 'application/pdf',
      },
      customMetadata: {
        uploadedAt: new Date().toISOString(),
      },
    })

    return `${env.R2_PUBLIC_URL}/reports/${fileName}`
    */

    console.log('[PDF_GENERATOR] PLACEHOLDER - Uploading PDF:', fileName)
    return `https://storage.investigaree.com.br/reports/${fileName}`
  } catch (error) {
    console.error('[PDF_GENERATOR] Error uploading:', error)
    return null
  }
}
