/**
 * Export Service - Multi-format Report Exporter
 *
 * Suporta exportação para:
 * - PDF (jsPDF) ✅
 * - Excel (XLSX/SheetJS) ✅
 * - Word (DOCX via HTML) ✅
 * - CSV ✅
 *
 * Edge Runtime Compatible
 */

import * as XLSX from 'xlsx'
import { reportService, type ReportData } from './report.service'

export type ExportFormat = 'pdf' | 'excel' | 'word' | 'csv'

export interface ExportOptions {
  format: ExportFormat
  filename?: string
  includeTimestamp?: boolean
}

// ============================================
// Export Service Class
// ============================================

export class ExportService {
  /**
   * Exporta relatório no formato especificado
   */
  async exportReport(data: ReportData, options: ExportOptions): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    const baseName = options.filename || `relatorio-${data.pessoa.cpf || data.pessoa.cnpj}`
    const filename = options.includeTimestamp !== false
      ? `${baseName}-${timestamp}`
      : baseName

    switch (options.format) {
      case 'pdf':
        return this.exportToPDF(data, `${filename}.pdf`)
      case 'excel':
        return this.exportToExcel(data, `${filename}.xlsx`)
      case 'word':
        return this.exportToWord(data, `${filename}.docx`)
      case 'csv':
        return this.exportToCSV(data, `${filename}.csv`)
      default:
        throw new Error(`Formato não suportado: ${options.format}`)
    }
  }

  /**
   * Exportação PDF (usando reportService existente)
   */
  private async exportToPDF(data: ReportData, filename: string): Promise<void> {
    await reportService.downloadReport(data, filename)
  }

  /**
   * Exportação Excel (XLSX)
   * Cria múltiplas abas com diferentes seções
   */
  private async exportToExcel(data: ReportData, filename: string): Promise<void> {
    const workbook = XLSX.utils.book_new()

    // Aba 1: Resumo
    const resumoData = [
      ['RELATÓRIO DE DUE DILIGENCE'],
      [''],
      ['ID da Investigação', data.investigacao.id],
      ['Tipo', this.formatTipoInvestigacao(data.investigacao.tipo)],
      ['Data de Início', new Date(data.investigacao.dataInicio).toLocaleDateString('pt-BR')],
      ['Responsável', data.investigacao.responsavel],
      ['Status', data.investigacao.status.toUpperCase()],
      [''],
      ['DADOS CADASTRAIS'],
      ['Nome', data.pessoa.nome],
    ]

    if (data.pessoa.cpf) resumoData.push(['CPF', this.formatCpf(data.pessoa.cpf)])
    if (data.pessoa.cnpj) resumoData.push(['CNPJ', this.formatCnpj(data.pessoa.cnpj)])
    if (data.pessoa.nascimento) resumoData.push(['Data de Nascimento', data.pessoa.nascimento])
    if (data.pessoa.situacaoCpf) resumoData.push(['Situação CPF', data.pessoa.situacaoCpf])

    const wsResumo = XLSX.utils.aoa_to_sheet(resumoData)
    XLSX.utils.book_append_sheet(workbook, wsResumo, 'Resumo')

    // Aba 2: Alertas
    if (data.alertas && data.alertas.length > 0) {
      const alertasData = [
        ['Tipo', 'Severidade', 'Descrição', 'Detalhes'],
        ...data.alertas.map((a) => [
          a.tipo.toUpperCase(),
          a.severidade.toUpperCase(),
          a.descricao,
          a.detalhes || '',
        ]),
      ]
      const wsAlertas = XLSX.utils.aoa_to_sheet(alertasData)
      XLSX.utils.book_append_sheet(workbook, wsAlertas, 'Alertas')
    }

    // Aba 3: Empresas
    if (data.empresas && data.empresas.length > 0) {
      const empresasData = [
        ['CNPJ', 'Razão Social', 'Nome Fantasia', 'Participação', 'Cargo', 'Situação'],
        ...data.empresas.map((e) => [
          this.formatCnpj(e.cnpj),
          e.razaoSocial,
          e.nomeFantasia || '',
          e.participacao || '',
          e.cargo || '',
          e.situacao || '',
        ]),
      ]
      const wsEmpresas = XLSX.utils.aoa_to_sheet(empresasData)
      XLSX.utils.book_append_sheet(workbook, wsEmpresas, 'Vínculos Empresariais')
    }

    // Aba 4: Dívidas
    if (data.dividas && data.dividas.length > 0) {
      const dividasData = [
        ['Tipo', 'Número Inscrição', 'Valor', 'Situação', 'Órgão', 'Data'],
        ...data.dividas.map((d) => [
          d.tipo,
          d.numeroInscricao || '',
          d.valor,
          d.situacao,
          d.orgao || '',
          d.dataInscricao || '',
        ]),
      ]
      const wsDividas = XLSX.utils.aoa_to_sheet(dividasData)
      XLSX.utils.book_append_sheet(workbook, wsDividas, 'Dívidas')
    }

    // Aba 5: Processos
    if (data.processos && data.processos.length > 0) {
      const processosData = [
        ['Número', 'Tipo', 'Tribunal', 'Polo', 'Situação', 'Valor', 'Data Distribuição'],
        ...data.processos.map((p) => [
          p.numero,
          p.tipo,
          p.tribunal,
          p.polo || '',
          p.situacao || '',
          p.valor || '',
          p.dataDistribuicao || '',
        ]),
      ]
      const wsProcessos = XLSX.utils.aoa_to_sheet(processosData)
      XLSX.utils.book_append_sheet(workbook, wsProcessos, 'Processos Judiciais')
    }

    // Aba 6: Candidaturas
    if (data.candidaturas && data.candidaturas.length > 0) {
      const candidaturasData = [
        ['Ano', 'Cargo', 'Partido', 'Resultado', 'Votos', 'Cidade', 'Estado'],
        ...data.candidaturas.map((c) => [
          c.ano,
          c.cargo,
          c.partido,
          c.resultado,
          c.votos || '',
          c.cidade || '',
          c.estado || '',
        ]),
      ]
      const wsCandidaturas = XLSX.utils.aoa_to_sheet(candidaturasData)
      XLSX.utils.book_append_sheet(workbook, wsCandidaturas, 'Histórico Político')
    }

    // Aba 7: Benefícios
    if (data.beneficios && data.beneficios.length > 0) {
      const beneficiosData = [
        ['Tipo', 'Programa', 'Valor', 'Competência', 'Situação'],
        ...data.beneficios.map((b) => [
          b.tipo,
          b.programa,
          b.valor || '',
          b.competencia || '',
          b.situacao || '',
        ]),
      ]
      const wsBeneficios = XLSX.utils.aoa_to_sheet(beneficiosData)
      XLSX.utils.book_append_sheet(workbook, wsBeneficios, 'Benefícios Sociais')
    }

    // Aba 8: Conclusões
    const conclusoesData = [
      ['CONCLUSÕES'],
      [''],
      ...data.conclusoes.map((c, i) => [`${i + 1}. ${c}`]),
    ]

    if (data.recomendacoes && data.recomendacoes.length > 0) {
      conclusoesData.push([''], ['RECOMENDAÇÕES'], [''])
      conclusoesData.push(...data.recomendacoes.map((r, i) => [`${i + 1}. ${r}`]))
    }

    const wsConclusoes = XLSX.utils.aoa_to_sheet(conclusoesData)
    XLSX.utils.book_append_sheet(workbook, wsConclusoes, 'Conclusões')

    // Download
    XLSX.writeFile(workbook, filename)
  }

  /**
   * Exportação Word (DOCX via HTML)
   * Gera HTML estruturado e oferece download como .docx
   */
  private async exportToWord(data: ReportData, filename: string): Promise<void> {
    const html = this.generateWordHTML(data)

    // Cria um Blob com o HTML em formato compatível com Word
    const htmlDoc = [
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" ',
      'xmlns:w="urn:schemas-microsoft-com:office:word" ',
      'xmlns="http://www.w3.org/TR/REC-html40">',
      '<head><meta charset="utf-8"><title>Relatório</title>',
      '<style>',
      'body { font-family: Calibri, sans-serif; font-size: 11pt; }',
      'h1 { color: #3B82F6; font-size: 24pt; margin-bottom: 10pt; }',
      'h2 { color: #1E293B; font-size: 16pt; margin-top: 20pt; margin-bottom: 10pt; border-bottom: 2px solid #3B82F6; }',
      'h3 { color: #475569; font-size: 14pt; margin-top: 15pt; }',
      'table { width: 100%; border-collapse: collapse; margin: 10pt 0; }',
      'th { background-color: #3B82F6; color: white; padding: 8pt; text-align: left; }',
      'td { border: 1px solid #E2E8F0; padding: 8pt; }',
      'tr:nth-child(even) { background-color: #F8FAFC; }',
      '.alert-critical { background-color: #FEE2E2; border-left: 4px solid #DC2626; padding: 10pt; margin: 10pt 0; }',
      '.alert-high { background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 10pt; margin: 10pt 0; }',
      '.footer { margin-top: 30pt; padding-top: 10pt; border-top: 1px solid #E2E8F0; font-size: 9pt; color: #64748B; }',
      '</style>',
      '</head><body>',
      html,
      '</body></html>',
    ].join('')

    const blob = new Blob([htmlDoc], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })

    // Download
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /**
   * Gera HTML estruturado para Word
   */
  private generateWordHTML(data: ReportData): string {
    let html = '<h1>INVESTIGAREE - RELATÓRIO DE DUE DILIGENCE</h1>'
    html += `<p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>`

    // 1. Informações da Investigação
    html += '<h2>1. INFORMAÇÕES DA INVESTIGAÇÃO</h2>'
    html += '<table>'
    html += `<tr><td><strong>ID da Investigação</strong></td><td>${data.investigacao.id}</td></tr>`
    html += `<tr><td><strong>Tipo</strong></td><td>${this.formatTipoInvestigacao(data.investigacao.tipo)}</td></tr>`
    html += `<tr><td><strong>Data de Início</strong></td><td>${new Date(data.investigacao.dataInicio).toLocaleDateString('pt-BR')}</td></tr>`
    html += `<tr><td><strong>Responsável</strong></td><td>${data.investigacao.responsavel}</td></tr>`
    html += `<tr><td><strong>Status</strong></td><td>${data.investigacao.status.toUpperCase()}</td></tr>`
    html += '</table>'

    // 2. Dados Cadastrais
    html += '<h2>2. DADOS CADASTRAIS</h2>'
    html += '<table>'
    html += `<tr><td><strong>Nome</strong></td><td>${data.pessoa.nome}</td></tr>`
    if (data.pessoa.cpf) html += `<tr><td><strong>CPF</strong></td><td>${this.formatCpf(data.pessoa.cpf)}</td></tr>`
    if (data.pessoa.cnpj) html += `<tr><td><strong>CNPJ</strong></td><td>${this.formatCnpj(data.pessoa.cnpj)}</td></tr>`
    if (data.pessoa.nascimento) html += `<tr><td><strong>Data de Nascimento</strong></td><td>${data.pessoa.nascimento}</td></tr>`
    if (data.pessoa.situacaoCpf) html += `<tr><td><strong>Situação CPF</strong></td><td>${data.pessoa.situacaoCpf}</td></tr>`
    html += '</table>'

    // 3. Alertas
    if (data.alertas && data.alertas.length > 0) {
      html += '<h2>3. ALERTAS E RISCOS</h2>'
      data.alertas.forEach((a) => {
        const alertClass = a.severidade === 'critica' || a.severidade === 'alta' ? 'alert-critical' : 'alert-high'
        html += `<div class="${alertClass}">`
        html += `<strong>${a.tipo.toUpperCase()} - ${a.severidade.toUpperCase()}</strong><br>`
        html += `${a.descricao}`
        if (a.detalhes) html += `<br><small>${a.detalhes}</small>`
        html += `</div>`
      })
    }

    // 4. Vínculos Empresariais
    if (data.empresas && data.empresas.length > 0) {
      html += '<h2>4. VÍNCULOS EMPRESARIAIS</h2>'
      html += '<table><tr><th>CNPJ</th><th>Razão Social</th><th>Participação</th><th>Cargo</th></tr>'
      data.empresas.forEach((e) => {
        html += `<tr>`
        html += `<td>${this.formatCnpj(e.cnpj)}</td>`
        html += `<td>${e.razaoSocial}</td>`
        html += `<td>${e.participacao || '-'}</td>`
        html += `<td>${e.cargo || '-'}</td>`
        html += `</tr>`
      })
      html += '</table>'
    }

    // 5. Dívidas
    if (data.dividas && data.dividas.length > 0) {
      html += '<h2>5. DÍVIDAS E PENDÊNCIAS FISCAIS</h2>'
      html += '<table><tr><th>Tipo</th><th>Valor</th><th>Situação</th><th>Órgão</th></tr>'
      data.dividas.forEach((d) => {
        html += `<tr>`
        html += `<td>${d.tipo}</td>`
        html += `<td>R$ ${d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>`
        html += `<td>${d.situacao}</td>`
        html += `<td>${d.orgao || '-'}</td>`
        html += `</tr>`
      })
      html += '</table>'
    }

    // 6. Processos
    if (data.processos && data.processos.length > 0) {
      html += '<h2>6. PROCESSOS JUDICIAIS</h2>'
      html += '<table><tr><th>Número</th><th>Tipo</th><th>Tribunal</th><th>Polo</th></tr>'
      data.processos.forEach((p) => {
        html += `<tr>`
        html += `<td>${p.numero}</td>`
        html += `<td>${p.tipo}</td>`
        html += `<td>${p.tribunal}</td>`
        html += `<td>${p.polo || '-'}</td>`
        html += `</tr>`
      })
      html += '</table>'
    }

    // 7. Histórico Político
    if (data.candidaturas && data.candidaturas.length > 0) {
      html += '<h2>7. HISTÓRICO POLÍTICO</h2>'
      html += '<table><tr><th>Ano</th><th>Cargo</th><th>Partido</th><th>Resultado</th></tr>'
      data.candidaturas.forEach((c) => {
        html += `<tr>`
        html += `<td>${c.ano}</td>`
        html += `<td>${c.cargo}</td>`
        html += `<td>${c.partido}</td>`
        html += `<td>${c.resultado}</td>`
        html += `</tr>`
      })
      html += '</table>'
    }

    // 8. Benefícios
    if (data.beneficios && data.beneficios.length > 0) {
      html += '<h2>8. BENEFÍCIOS SOCIAIS</h2>'
      html += '<table><tr><th>Tipo</th><th>Programa</th><th>Valor</th></tr>'
      data.beneficios.forEach((b) => {
        html += `<tr>`
        html += `<td>${b.tipo}</td>`
        html += `<td>${b.programa}</td>`
        html += `<td>${b.valor ? `R$ ${b.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-'}</td>`
        html += `</tr>`
      })
      html += '</table>'
    }

    // 9. Conclusões
    html += '<h2>9. CONCLUSÕES E RECOMENDAÇÕES</h2>'
    html += '<h3>Conclusões:</h3><ol>'
    data.conclusoes.forEach((c) => {
      html += `<li>${c}</li>`
    })
    html += '</ol>'

    if (data.recomendacoes && data.recomendacoes.length > 0) {
      html += '<h3>Recomendações:</h3><ol>'
      data.recomendacoes.forEach((r) => {
        html += `<li>${r}</li>`
      })
      html += '</ol>'
    }

    // Footer
    html += '<div class="footer">'
    html += '<p><strong>investigaree.com.br</strong> | Documento Confidencial</p>'
    html += `<p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>`
    html += '</div>'

    return html
  }

  /**
   * Exportação CSV (formato simples)
   */
  private async exportToCSV(data: ReportData, filename: string): Promise<void> {
    // Cabeçalho
    let csv = 'RELATÓRIO DE DUE DILIGENCE\n\n'

    // Dados básicos
    csv += 'INFORMAÇÕES DA INVESTIGAÇÃO\n'
    csv += `ID,${data.investigacao.id}\n`
    csv += `Tipo,${this.formatTipoInvestigacao(data.investigacao.tipo)}\n`
    csv += `Data Início,${new Date(data.investigacao.dataInicio).toLocaleDateString('pt-BR')}\n`
    csv += `Responsável,${data.investigacao.responsavel}\n`
    csv += `Status,${data.investigacao.status}\n\n`

    csv += 'DADOS CADASTRAIS\n'
    csv += `Nome,${data.pessoa.nome}\n`
    if (data.pessoa.cpf) csv += `CPF,${this.formatCpf(data.pessoa.cpf)}\n`
    if (data.pessoa.cnpj) csv += `CNPJ,${this.formatCnpj(data.pessoa.cnpj)}\n`
    csv += '\n'

    // Alertas
    if (data.alertas && data.alertas.length > 0) {
      csv += 'ALERTAS\n'
      csv += 'Tipo,Severidade,Descrição\n'
      data.alertas.forEach((a) => {
        csv += `${a.tipo},${a.severidade},"${a.descricao}"\n`
      })
      csv += '\n'
    }

    // Empresas
    if (data.empresas && data.empresas.length > 0) {
      csv += 'VÍNCULOS EMPRESARIAIS\n'
      csv += 'CNPJ,Razão Social,Participação,Cargo\n'
      data.empresas.forEach((e) => {
        csv += `${this.formatCnpj(e.cnpj)},"${e.razaoSocial}",${e.participacao || ''},${e.cargo || ''}\n`
      })
      csv += '\n'
    }

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // ============================================
  // Helper Methods
  // ============================================

  private formatCpf(cpf: string): string {
    const cleaned = cpf.replace(/\D/g, '')
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  private formatCnpj(cnpj: string): string {
    const cleaned = cnpj.replace(/\D/g, '')
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  private formatTipoInvestigacao(tipo: string): string {
    const tipos: Record<string, string> = {
      pessoa_fisica: 'Pessoa Física',
      pessoa_juridica: 'Pessoa Jurídica',
      due_diligence: 'Due Diligence Completa',
      background_check: 'Background Check',
    }
    return tipos[tipo] || tipo
  }
}

/**
 * Singleton instance
 */
export const exportService = new ExportService()
