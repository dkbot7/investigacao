/**
 * PDF Generator Service
 * Geração de relatórios em PDF com design profissional
 * Usa Cloudflare Browser Rendering API (Puppeteer)
 */

import { Env } from '../index'
import puppeteer from '@cloudflare/puppeteer'

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
 * Gerar PDF de relatório usando Cloudflare Browser Rendering
 *
 * @param data - Dados do relatório
 * @param env - Environment variables
 * @returns URL do PDF gerado ou null
 */
export async function generateReportPDF(
  data: ReportData,
  env: Env
): Promise<string | null> {
  try {
    console.log('[PDF_GENERATOR] Starting PDF generation for:', data.company_name)

    // Gerar HTML do relatório
    const html = generateReportHTML(data)

    // Usar Cloudflare Browser Rendering para gerar PDF
    const browser = await puppeteer.launch(env.BROWSER)
    const page = await browser.newPage()

    // Configurar viewport para A4
    await page.setViewport({
      width: 794,  // A4 width em pixels (210mm at 96dpi)
      height: 1123, // A4 height em pixels (297mm at 96dpi)
      deviceScaleFactor: 2, // Alta qualidade
    })

    // Carregar HTML
    await page.setContent(html, {
      waitUntil: 'networkidle0',
    })

    // Aguardar fontes carregarem
    await page.evaluateHandle('document.fonts.ready')

    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <div style="width: 100%; font-size: 9px; padding: 5px 15mm; color: #666; display: flex; justify-content: space-between;">
          <span>investigaree - Relatório de Due Diligence</span>
          <span>${data.company_name}</span>
        </div>
      `,
      footerTemplate: `
        <div style="width: 100%; font-size: 9px; padding: 5px 15mm; color: #666; display: flex; justify-content: space-between;">
          <span>Confidencial - ID: ${data.report_id}</span>
          <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
        </div>
      `,
    })

    await browser.close()

    console.log('[PDF_GENERATOR] PDF generated, size:', pdfBuffer.byteLength, 'bytes')

    // Upload para R2 Storage
    const fileName = `reports/${data.report_id}.pdf`
    const pdfUrl = await uploadPDFToStorage(pdfBuffer, fileName, env)

    if (!pdfUrl) {
      throw new Error('Falha ao fazer upload do PDF')
    }

    console.log('[PDF_GENERATOR] PDF uploaded successfully:', pdfUrl)

    return pdfUrl
  } catch (error) {
    console.error('[PDF_GENERATOR] Error:', error)

    // Fallback: tentar geração simplificada sem Browser Rendering
    try {
      console.log('[PDF_GENERATOR] Trying fallback method...')
      return await generatePDFFallback(data, env)
    } catch (fallbackError) {
      console.error('[PDF_GENERATOR] Fallback also failed:', fallbackError)
      return null
    }
  }
}

/**
 * Método fallback: gerar PDF via serviço externo (html2pdf.app)
 * Usado quando Browser Rendering não está disponível
 */
async function generatePDFFallback(
  data: ReportData,
  env: Env
): Promise<string | null> {
  try {
    const html = generateReportHTML(data)

    // Usar API gratuita html2pdf.app
    const response = await fetch('https://api.html2pdf.app/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: html,
        apiKey: env.HTML2PDF_API_KEY || '', // Opcional para uso básico
        options: {
          format: 'A4',
          margin: {
            top: '15mm',
            right: '15mm',
            bottom: '15mm',
            left: '15mm',
          },
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`html2pdf API error: ${response.status}`)
    }

    const pdfBuffer = await response.arrayBuffer()

    // Upload para R2
    const fileName = `reports/${data.report_id}.pdf`
    return await uploadPDFToStorage(pdfBuffer, fileName, env)
  } catch (error) {
    console.error('[PDF_GENERATOR] Fallback error:', error)
    return null
  }
}

/**
 * Upload de PDF para Cloudflare R2 Storage
 */
export async function uploadPDFToStorage(
  pdfBuffer: ArrayBuffer | Uint8Array,
  fileName: string,
  env: Env
): Promise<string | null> {
  try {
    // Converter para Uint8Array se necessário
    const buffer = pdfBuffer instanceof Uint8Array
      ? pdfBuffer
      : new Uint8Array(pdfBuffer)

    // Upload para R2
    await env.R2.put(fileName, buffer, {
      httpMetadata: {
        contentType: 'application/pdf',
        cacheControl: 'private, max-age=86400', // Cache por 24h
      },
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        reportId: fileName.split('/')[1]?.replace('.pdf', '') || '',
      },
    })

    // Retornar URL pública ou signed URL
    // Se R2 bucket tem custom domain configurado:
    const publicUrl = `https://storage.investigaree.com.br/${fileName}`

    console.log('[PDF_GENERATOR] Uploaded to R2:', fileName)

    return publicUrl
  } catch (error) {
    console.error('[PDF_GENERATOR] R2 upload error:', error)
    return null
  }
}

/**
 * Gerar URL assinada para download seguro do PDF
 */
export async function generateSignedPDFUrl(
  reportId: string,
  userId: string,
  env: Env,
  expiresInSeconds: number = 3600 // 1 hora
): Promise<string | null> {
  try {
    const fileName = `reports/${reportId}.pdf`

    // Verificar se arquivo existe
    const object = await env.R2.head(fileName)
    if (!object) {
      console.error('[PDF_GENERATOR] PDF not found:', fileName)
      return null
    }

    // Gerar token de acesso seguro
    const expiresAt = Date.now() + (expiresInSeconds * 1000)
    const payload = `${reportId}:${userId}:${expiresAt}`

    // Criar HMAC para validação
    const encoder = new TextEncoder()
    const keyData = encoder.encode(env.URL_SECRET || 'default-secret-change-me')
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    )

    const token = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    // Retornar URL com token
    return `https://api.investigaree.com.br/api/reports/${reportId}/download?token=${token}&expires=${expiresAt}`
  } catch (error) {
    console.error('[PDF_GENERATOR] Error generating signed URL:', error)
    return null
  }
}

/**
 * Validar token de download
 */
export async function validateDownloadToken(
  reportId: string,
  userId: string,
  token: string,
  expiresAt: number,
  env: Env
): Promise<boolean> {
  try {
    // Verificar expiração
    if (Date.now() > expiresAt) {
      console.log('[PDF_GENERATOR] Token expired')
      return false
    }

    // Recalcular token esperado
    const payload = `${reportId}:${userId}:${expiresAt}`

    const encoder = new TextEncoder()
    const keyData = encoder.encode(env.URL_SECRET || 'default-secret-change-me')
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    const expectedSignature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(payload)
    )

    const expectedToken = btoa(String.fromCharCode(...new Uint8Array(expectedSignature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    return token === expectedToken
  } catch (error) {
    console.error('[PDF_GENERATOR] Token validation error:', error)
    return false
  }
}

/**
 * Obter PDF do R2 para download
 */
export async function getPDFFromStorage(
  reportId: string,
  env: Env
): Promise<{ buffer: ArrayBuffer; size: number } | null> {
  try {
    const fileName = `reports/${reportId}.pdf`
    const object = await env.R2.get(fileName)

    if (!object) {
      console.error('[PDF_GENERATOR] PDF not found:', fileName)
      return null
    }

    const buffer = await object.arrayBuffer()

    return {
      buffer,
      size: object.size,
    }
  } catch (error) {
    console.error('[PDF_GENERATOR] Error getting PDF:', error)
    return null
  }
}

/**
 * Gerar HTML do relatório com design profissional
 * Este HTML será convertido em PDF
 */
export function generateReportHTML(data: ReportData): string {
  const severityColors: Record<string, string> = {
    baixa: '#4CAF50',
    media: '#FF9800',
    alta: '#FF5722',
    critica: '#D32F2F',
  }

  const severityLabels: Record<string, string> = {
    baixa: 'BAIXA',
    media: 'MÉDIA',
    alta: 'ALTA',
    critica: 'CRÍTICA',
  }

  const recomendacaoColors: Record<string, string> = {
    recomendado: '#4CAF50',
    com_ressalvas: '#FF9800',
    nao_recomendado: '#D32F2F',
  }

  const recomendacaoLabels: Record<string, string> = {
    recomendado: '✓ RECOMENDADO',
    com_ressalvas: '⚠ COM RESSALVAS',
    nao_recomendado: '✗ NÃO RECOMENDADO',
  }

  const scoreColor = (score: number): string => {
    if (score >= 80) return '#4CAF50'
    if (score >= 60) return '#FF9800'
    if (score >= 40) return '#FF5722'
    return '#D32F2F'
  }

  const formatCPF = (cpf: string): string => {
    if (!cpf) return '***.***.***-**'
    const clean = cpf.replace(/\D/g, '')
    if (clean.length !== 11) return cpf
    return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`
  }

  const formatCNPJ = (cnpj: string): string => {
    if (!cnpj) return ''
    const clean = cnpj.replace(/\D/g, '')
    if (clean.length !== 14) return cnpj
    return `${clean.slice(0, 2)}.${clean.slice(2, 5)}.${clean.slice(5, 8)}/${clean.slice(8, 12)}-${clean.slice(12)}`
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR')
    } catch {
      return dateStr
    }
  }

  const formatDateTime = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleString('pt-BR')
    } catch {
      return dateStr
    }
  }

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório de Due Diligence - ${data.company_name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #1a1a2e;
      background: white;
    }

    .page {
      padding: 0;
      background: white;
      min-height: 100vh;
    }

    /* Cover Page */
    .cover {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #0a192f 0%, #112240 50%, #1d3461 100%);
      color: white;
      text-align: center;
      padding: 40px;
      page-break-after: always;
    }

    .cover-logo {
      font-size: 48pt;
      font-weight: 800;
      letter-spacing: -2px;
      margin-bottom: 10px;
      background: linear-gradient(90deg, #c9a227 0%, #e8d48b 50%, #c9a227 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .cover-tagline {
      font-size: 12pt;
      opacity: 0.8;
      margin-bottom: 60px;
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    .cover-title {
      font-size: 14pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 4px;
      color: #c9a227;
      margin-bottom: 20px;
    }

    .cover-company {
      font-size: 32pt;
      font-weight: 700;
      margin-bottom: 10px;
    }

    .cover-cnpj {
      font-size: 14pt;
      opacity: 0.7;
      margin-bottom: 60px;
    }

    .cover-meta {
      margin-top: auto;
      font-size: 10pt;
      opacity: 0.6;
    }

    .cover-meta p {
      margin: 5px 0;
    }

    /* Header */
    .header {
      background: linear-gradient(135deg, #0a192f 0%, #112240 100%);
      color: white;
      padding: 25px 30px;
      margin-bottom: 25px;
    }

    .header h1 {
      font-size: 20pt;
      font-weight: 700;
      margin-bottom: 5px;
    }

    .header .subtitle {
      font-size: 11pt;
      opacity: 0.8;
    }

    /* Content */
    .content {
      padding: 0 30px 30px;
    }

    /* Section */
    .section {
      margin-bottom: 25px;
    }

    .section h2 {
      color: #0a192f;
      font-size: 14pt;
      font-weight: 700;
      border-bottom: 3px solid #c9a227;
      padding-bottom: 8px;
      margin-bottom: 15px;
    }

    .section h3 {
      color: #112240;
      font-size: 11pt;
      font-weight: 600;
      margin: 15px 0 10px;
    }

    /* Executive Summary Box */
    .summary-box {
      background: #f8f9fa;
      border-left: 4px solid #c9a227;
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 0 8px 8px 0;
    }

    .summary-box p {
      font-size: 11pt;
      line-height: 1.7;
      color: #333;
    }

    /* Score Cards */
    .scores-container {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin: 20px 0;
    }

    .score-card {
      flex: 1;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      transition: all 0.3s;
    }

    .score-card .label {
      font-size: 8pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      margin-bottom: 8px;
    }

    .score-card .value {
      font-size: 28pt;
      font-weight: 800;
    }

    .score-card .indicator {
      font-size: 8pt;
      margin-top: 5px;
      font-weight: 500;
    }

    /* Recommendation Box */
    .recommendation-box {
      padding: 25px;
      border-radius: 12px;
      margin: 25px 0;
      text-align: center;
    }

    .recommendation-box .title {
      font-size: 18pt;
      font-weight: 700;
      margin-bottom: 15px;
    }

    .recommendation-box .justification {
      font-size: 11pt;
      line-height: 1.6;
      max-width: 600px;
      margin: 0 auto;
    }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 15px 0;
    }

    .info-item {
      background: #f8f9fa;
      padding: 12px 15px;
      border-radius: 8px;
      border-left: 3px solid #c9a227;
    }

    .info-item .label {
      font-size: 8pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      margin-bottom: 4px;
    }

    .info-item .value {
      font-size: 10pt;
      font-weight: 500;
      color: #1a1a2e;
    }

    /* Table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 9pt;
    }

    table th {
      background: #0a192f;
      color: white;
      padding: 12px 15px;
      text-align: left;
      font-weight: 600;
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    table th:first-child {
      border-radius: 8px 0 0 0;
    }

    table th:last-child {
      border-radius: 0 8px 0 0;
    }

    table td {
      padding: 12px 15px;
      border-bottom: 1px solid #e0e0e0;
    }

    table tr:last-child td:first-child {
      border-radius: 0 0 0 8px;
    }

    table tr:last-child td:last-child {
      border-radius: 0 0 8px 0;
    }

    table tr:nth-child(even) {
      background: #f8f9fa;
    }

    /* Risk Items */
    .risk-item {
      background: white;
      border: 1px solid #e0e0e0;
      border-left: 5px solid;
      border-radius: 0 8px 8px 0;
      padding: 15px 20px;
      margin-bottom: 12px;
    }

    .risk-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .risk-item h4 {
      font-size: 11pt;
      font-weight: 600;
      color: #1a1a2e;
    }

    .severity-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      color: white;
      font-size: 8pt;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .risk-item p {
      font-size: 10pt;
      color: #444;
      margin-bottom: 8px;
    }

    .risk-item .recommendation {
      font-size: 9pt;
      color: #0a192f;
      background: #e8f4fd;
      padding: 8px 12px;
      border-radius: 6px;
      margin-top: 10px;
    }

    .risk-item .recommendation strong {
      color: #0a192f;
    }

    /* Breach Summary */
    .breach-summary {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 15px 0;
    }

    .breach-stat {
      background: #fff5f5;
      border: 1px solid #ffcccc;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }

    .breach-stat .value {
      font-size: 24pt;
      font-weight: 700;
      color: #d32f2f;
    }

    .breach-stat .label {
      font-size: 9pt;
      color: #666;
      margin-top: 5px;
    }

    /* Digital Presence */
    .presence-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin: 15px 0;
    }

    .presence-item {
      background: #f0f7ff;
      border: 1px solid #cce0ff;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }

    .presence-item .icon {
      font-size: 24pt;
      margin-bottom: 8px;
    }

    .presence-item .value {
      font-size: 18pt;
      font-weight: 700;
      color: #0a192f;
    }

    .presence-item .label {
      font-size: 9pt;
      color: #666;
      margin-top: 5px;
    }

    /* Next Steps */
    .next-steps {
      background: #f0f7ff;
      border: 2px solid #0a192f;
      border-radius: 12px;
      padding: 20px;
      margin: 20px 0;
    }

    .next-steps h3 {
      color: #0a192f;
      margin-bottom: 15px;
    }

    .next-steps ol {
      margin-left: 20px;
    }

    .next-steps li {
      margin-bottom: 10px;
      font-size: 10pt;
      line-height: 1.5;
    }

    /* Footer */
    .document-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 9pt;
    }

    .document-footer .logo {
      font-size: 14pt;
      font-weight: 700;
      color: #0a192f;
      margin-bottom: 10px;
    }

    .document-footer p {
      margin: 5px 0;
    }

    /* Page Break */
    .page-break {
      page-break-after: always;
    }

    /* Print optimizations */
    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .cover {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      .header {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="cover">
    <div class="cover-logo">investigaree</div>
    <div class="cover-tagline">Inteligência • Investigação • Proteção</div>

    <div class="cover-title">Relatório de Due Diligence</div>
    <div class="cover-company">${data.company_name}</div>
    <div class="cover-cnpj">CNPJ: ${formatCNPJ(data.cnpj)}</div>

    <div class="cover-meta">
      <p><strong>Preparado para:</strong> ${data.investor_name}</p>
      <p><strong>Data de emissão:</strong> ${formatDateTime(data.generated_at)}</p>
      <p><strong>ID do Relatório:</strong> ${data.report_id}</p>
    </div>
  </div>

  <div class="page">
    <!-- Header -->
    <div class="header">
      <h1>Resumo Executivo</h1>
      <div class="subtitle">${data.company_name} • CNPJ ${formatCNPJ(data.cnpj)}</div>
    </div>

    <div class="content">
      <!-- Executive Summary -->
      <div class="section">
        <div class="summary-box">
          <p>${data.analysis.resumo_executivo}</p>
        </div>
      </div>

      <!-- Scores -->
      <div class="section">
        <h2>Avaliação Geral</h2>
        <div class="scores-container">
          <div class="score-card" style="border-color: ${scoreColor(data.analysis.score_geral)};">
            <div class="label">Score Geral</div>
            <div class="value" style="color: ${scoreColor(data.analysis.score_geral)};">${data.analysis.score_geral}</div>
            <div class="indicator">de 100 pontos</div>
          </div>
          <div class="score-card" style="border-color: ${scoreColor(data.analysis.score_integridade)};">
            <div class="label">Integridade</div>
            <div class="value" style="color: ${scoreColor(data.analysis.score_integridade)};">${data.analysis.score_integridade}</div>
            <div class="indicator">de 100 pontos</div>
          </div>
          <div class="score-card" style="border-color: ${scoreColor(data.analysis.score_seguranca)};">
            <div class="label">Segurança</div>
            <div class="value" style="color: ${scoreColor(data.analysis.score_seguranca)};">${data.analysis.score_seguranca}</div>
            <div class="indicator">de 100 pontos</div>
          </div>
          <div class="score-card" style="border-color: ${scoreColor(data.analysis.score_reputacao)};">
            <div class="label">Reputação</div>
            <div class="value" style="color: ${scoreColor(data.analysis.score_reputacao)};">${data.analysis.score_reputacao}</div>
            <div class="indicator">de 100 pontos</div>
          </div>
        </div>
      </div>

      <!-- Recommendation -->
      <div class="recommendation-box" style="background: ${recomendacaoColors[data.analysis.recomendacao]}15; border: 2px solid ${recomendacaoColors[data.analysis.recomendacao]};">
        <div class="title" style="color: ${recomendacaoColors[data.analysis.recomendacao]};">
          ${recomendacaoLabels[data.analysis.recomendacao] || data.analysis.recomendacao}
        </div>
        <div class="justification">${data.analysis.justificativa}</div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <div class="page">
    <div class="header">
      <h1>Dados Cadastrais</h1>
      <div class="subtitle">Informações da empresa junto à Receita Federal</div>
    </div>

    <div class="content">
      <div class="section">
        <div class="info-grid">
          <div class="info-item">
            <div class="label">Razão Social</div>
            <div class="value">${data.cadastral.razao_social}</div>
          </div>
          <div class="info-item">
            <div class="label">Nome Fantasia</div>
            <div class="value">${data.cadastral.nome_fantasia || '-'}</div>
          </div>
          <div class="info-item">
            <div class="label">Situação Cadastral</div>
            <div class="value">${data.cadastral.situacao}</div>
          </div>
          <div class="info-item">
            <div class="label">Data de Abertura</div>
            <div class="value">${formatDate(data.cadastral.data_abertura)}</div>
          </div>
          <div class="info-item">
            <div class="label">Capital Social</div>
            <div class="value">${formatCurrency(data.cadastral.capital_social)}</div>
          </div>
          <div class="info-item">
            <div class="label">Porte</div>
            <div class="value">${data.cadastral.porte}</div>
          </div>
          <div class="info-item" style="grid-column: span 2;">
            <div class="label">Atividade Principal (CNAE)</div>
            <div class="value">${data.cadastral.cnae}</div>
          </div>
          <div class="info-item" style="grid-column: span 2;">
            <div class="label">Endereço</div>
            <div class="value">${data.cadastral.endereco}</div>
          </div>
        </div>

        <h3>Quadro Societário</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Nome do Sócio</th>
              <th style="width: 30%;">CPF</th>
              <th style="width: 20%; text-align: right;">Participação</th>
            </tr>
          </thead>
          <tbody>
            ${data.cadastral.socios.map(socio => `
              <tr>
                <td>${socio.nome}</td>
                <td>${formatCPF(socio.cpf)}</td>
                <td style="text-align: right; font-weight: 600;">${socio.percentual}%</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <div class="page">
    <div class="header">
      <h1>Riscos Identificados</h1>
      <div class="subtitle">Análise detalhada de riscos e recomendações</div>
    </div>

    <div class="content">
      <div class="section">
        ${data.risks.length > 0 ? data.risks.map(risk => `
          <div class="risk-item" style="border-left-color: ${severityColors[risk.severidade]};">
            <div class="risk-header">
              <h4>${risk.categoria}</h4>
              <span class="severity-badge" style="background: ${severityColors[risk.severidade]};">
                ${severityLabels[risk.severidade] || risk.severidade}
              </span>
            </div>
            <p>${risk.descricao}</p>
            <div class="recommendation">
              <strong>💡 Recomendação:</strong> ${risk.recomendacao}
            </div>
          </div>
        `).join('') : `
          <div class="summary-box" style="border-left-color: #4CAF50;">
            <p style="color: #4CAF50; font-weight: 600;">✓ Nenhum risco significativo identificado durante a análise.</p>
          </div>
        `}
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <div class="page">
    <div class="header">
      <h1>Análise de Segurança Digital</h1>
      <div class="subtitle">Verificação de vazamentos de dados e exposição</div>
    </div>

    <div class="content">
      <div class="section">
        <div class="breach-summary">
          <div class="breach-stat">
            <div class="value">${data.breaches.total}</div>
            <div class="label">Vazamentos Encontrados</div>
          </div>
          <div class="breach-stat">
            <div class="value">${data.breaches.socios_afetados}</div>
            <div class="label">Sócios Afetados</div>
          </div>
          <div class="breach-stat">
            <div class="value" style="font-size: 14pt;">${data.breaches.nivel_risco}</div>
            <div class="label">Nível de Risco</div>
          </div>
        </div>

        <div class="summary-box" style="border-left-color: ${data.breaches.total > 0 ? '#FF5722' : '#4CAF50'};">
          <p><strong>Recomendação:</strong> ${data.breaches.recomendacao}</p>
        </div>
      </div>

      <div class="section">
        <h2>Presença Digital</h2>
        <div class="presence-grid">
          <div class="presence-item">
            <div class="icon">📰</div>
            <div class="value">${data.digital_presence.news_count}</div>
            <div class="label">Notícias Encontradas</div>
          </div>
          <div class="presence-item">
            <div class="icon">${data.digital_presence.social_presence ? '✅' : '❌'}</div>
            <div class="value">${data.digital_presence.social_presence ? 'Sim' : 'Não'}</div>
            <div class="label">Presença Social</div>
          </div>
          <div class="presence-item">
            <div class="icon">⚖️</div>
            <div class="value">${data.digital_presence.legal_issues_count}</div>
            <div class="label">Questões Legais</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <div class="page">
    <div class="header">
      <h1>Próximos Passos</h1>
      <div class="subtitle">Recomendações para o investidor</div>
    </div>

    <div class="content">
      <div class="section">
        <div class="next-steps">
          <h3>📋 Ações Recomendadas</h3>
          <ol>
            ${data.next_steps.map(step => `<li>${step}</li>`).join('')}
          </ol>
        </div>
      </div>

      <!-- Document Footer -->
      <div class="document-footer">
        <div class="logo">investigaree</div>
        <p><strong>Inteligência • Investigação • Proteção</strong></p>
        <p>Este relatório é confidencial e destinado exclusivamente ao solicitante.</p>
        <p>As informações contidas neste documento foram obtidas de fontes públicas e privadas.</p>
        <p style="margin-top: 15px;">
          <strong>ID:</strong> ${data.report_id} |
          <strong>Gerado em:</strong> ${formatDateTime(data.generated_at)}
        </p>
        <p style="margin-top: 10px; font-size: 8pt; color: #999;">
          © ${new Date().getFullYear()} investigaree - Todos os direitos reservados
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `
}
