/**
 * Report Service
 *
 * Gerador de relatórios PDF profissionais para Due Diligence
 * Usando jsPDF + jspdf-autotable
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// ============================================
// Types
// ============================================

export interface ReportInvestigacao {
  id: string
  tipo: 'pessoa_fisica' | 'pessoa_juridica' | 'due_diligence' | 'background_check'
  dataInicio: string
  dataFim?: string
  responsavel: string
  status: 'em_andamento' | 'concluida' | 'pausada'
}

export interface ReportPessoa {
  nome: string
  cpf?: string
  cnpj?: string
  nascimento?: string
  rg?: string
  nomeMae?: string
  situacaoCpf?: string
  email?: string
  telefone?: string
  endereco?: string
}

export interface ReportEmpresa {
  cnpj: string
  razaoSocial: string
  nomeFantasia?: string
  dataAbertura?: string
  situacao?: string
  participacao?: string
  cargo?: string
}

export interface ReportDivida {
  tipo: string
  numeroInscricao?: string
  valor: number
  situacao: string
  dataInscricao?: string
  orgao?: string
}

export interface ReportProcesso {
  numero: string
  tipo: string
  tribunal: string
  polo?: string
  situacao?: string
  valor?: number
  dataDistribuicao?: string
}

export interface ReportCandidatura {
  ano: string
  cargo: string
  partido: string
  resultado: string
  votos?: number
  cidade?: string
  estado?: string
}

export interface ReportBeneficio {
  tipo: string
  programa: string
  valor?: number
  competencia?: string
  situacao?: string
}

export interface ReportAlerta {
  tipo: 'obito' | 'sancionado' | 'pep' | 'ofac' | 'divida' | 'processo' | 'outro'
  severidade: 'baixa' | 'media' | 'alta' | 'critica'
  descricao: string
  detalhes?: string
}

export interface ReportData {
  investigacao: ReportInvestigacao
  pessoa: ReportPessoa
  empresas?: ReportEmpresa[]
  dividas?: ReportDivida[]
  processos?: ReportProcesso[]
  candidaturas?: ReportCandidatura[]
  beneficios?: ReportBeneficio[]
  alertas?: ReportAlerta[]
  conclusoes: string[]
  recomendacoes?: string[]
}

// ============================================
// Report Service Class
// ============================================

export class ReportService {
  private readonly COLORS = {
    primary: [59, 130, 246], // Blue 500
    success: [34, 197, 94], // Green 500
    warning: [251, 191, 36], // Amber 400
    danger: [239, 68, 68], // Red 500
    dark: [15, 23, 42], // Slate 900
    gray: [100, 116, 139], // Slate 500
  }

  /**
   * Gera relatório de Due Diligence completo
   */
  generateDueDiligenceReport(data: ReportData): jsPDF {
    const doc = new jsPDF()
    let yPos = 20

    // Header com logo e título
    yPos = this.addHeader(doc, yPos, 'RELATÓRIO DE DUE DILIGENCE')

    // 1. Informações da Investigação
    yPos = this.addSection(doc, yPos, '1. INFORMAÇÕES DA INVESTIGAÇÃO')
    yPos = this.addInvestigacaoInfo(doc, yPos, data.investigacao)

    // 2. Dados da Pessoa
    yPos = this.addSection(doc, yPos, '2. DADOS CADASTRAIS')
    yPos = this.addPessoaInfo(doc, yPos, data.pessoa)

    // 3. Alertas (se houver)
    if (data.alertas && data.alertas.length > 0) {
      yPos = this.addSection(doc, yPos, '3. ALERTAS E RISCOS')
      yPos = this.addAlertas(doc, yPos, data.alertas)
    }

    // 4. Vínculos Empresariais
    if (data.empresas && data.empresas.length > 0) {
      yPos = this.addSection(doc, yPos, '4. VÍNCULOS EMPRESARIAIS')
      yPos = this.addEmpresas(doc, yPos, data.empresas)
    }

    // 5. Dívidas e Pendências
    if (data.dividas && data.dividas.length > 0) {
      yPos = this.addSection(doc, yPos, '5. DÍVIDAS E PENDÊNCIAS FISCAIS')
      yPos = this.addDividas(doc, yPos, data.dividas)
    }

    // 6. Processos Judiciais
    if (data.processos && data.processos.length > 0) {
      yPos = this.addSection(doc, yPos, '6. PROCESSOS JUDICIAIS')
      yPos = this.addProcessos(doc, yPos, data.processos)
    }

    // 7. Histórico Político
    if (data.candidaturas && data.candidaturas.length > 0) {
      yPos = this.addSection(doc, yPos, '7. HISTÓRICO POLÍTICO')
      yPos = this.addCandidaturas(doc, yPos, data.candidaturas)
    }

    // 8. Benefícios Sociais
    if (data.beneficios && data.beneficios.length > 0) {
      yPos = this.addSection(doc, yPos, '8. BENEFÍCIOS SOCIAIS')
      yPos = this.addBeneficios(doc, yPos, data.beneficios)
    }

    // 9. Conclusões e Recomendações
    yPos = this.addSection(doc, yPos, '9. CONCLUSÕES E RECOMENDAÇÕES')
    yPos = this.addConclusoes(doc, yPos, data.conclusoes, data.recomendacoes)

    // Footer em todas as páginas
    this.addFooters(doc)

    return doc
  }

  /**
   * Adiciona header ao relatório
   */
  private addHeader(doc: jsPDF, yPos: number, title: string): number {
    doc.setFontSize(24)
    doc.setTextColor(this.COLORS.primary[0], this.COLORS.primary[1], this.COLORS.primary[2])
    doc.setFont('helvetica', 'bold')
    doc.text('INVESTIGAREE', 20, yPos)

    doc.setFontSize(10)
    doc.setTextColor(this.COLORS.gray[0], this.COLORS.gray[1], this.COLORS.gray[2])
    doc.setFont('helvetica', 'normal')
    doc.text(title, 20, yPos + 7)

    doc.setDrawColor(this.COLORS.primary[0], this.COLORS.primary[1], this.COLORS.primary[2])
    doc.setLineWidth(0.5)
    doc.line(20, yPos + 10, 190, yPos + 10)

    return yPos + 20
  }

  /**
   * Adiciona título de seção
   */
  private addSection(doc: jsPDF, yPos: number, title: string): number {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(14)
    doc.setTextColor(this.COLORS.dark[0], this.COLORS.dark[1], this.COLORS.dark[2])
    doc.setFont('helvetica', 'bold')
    doc.text(title, 20, yPos)

    return yPos + 10
  }

  /**
   * Informações da investigação
   */
  private addInvestigacaoInfo(doc: jsPDF, yPos: number, info: ReportInvestigacao): number {
    const data = [
      ['ID da Investigação', info.id],
      ['Tipo', this.formatTipoInvestigacao(info.tipo)],
      ['Data de Início', new Date(info.dataInicio).toLocaleDateString('pt-BR')],
      ['Responsável', info.responsavel],
      ['Status', info.status.replace('_', ' ').toUpperCase()],
    ]

    if (info.dataFim) {
      data.push(['Data de Conclusão', new Date(info.dataFim).toLocaleDateString('pt-BR')])
    }

    autoTable(doc, {
      startY: yPos,
      body: data,
      theme: 'plain',
      styles: { cellPadding: 3, fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 110 },
      },
    })

    return (doc as any).lastAutoTable.finalY + 15
  }

  /**
   * Dados da pessoa
   */
  private addPessoaInfo(doc: jsPDF, yPos: number, pessoa: ReportPessoa): number {
    const data = [['Nome Completo', pessoa.nome]]

    if (pessoa.cpf) data.push(['CPF', this.formatCpf(pessoa.cpf)])
    if (pessoa.cnpj) data.push(['CNPJ', this.formatCnpj(pessoa.cnpj)])
    if (pessoa.nascimento) data.push(['Data de Nascimento', pessoa.nascimento])
    if (pessoa.rg) data.push(['RG', pessoa.rg])
    if (pessoa.nomeMae) data.push(['Nome da Mãe', pessoa.nomeMae])
    if (pessoa.situacaoCpf) data.push(['Situação CPF', pessoa.situacaoCpf])
    if (pessoa.email) data.push(['E-mail', pessoa.email])
    if (pessoa.telefone) data.push(['Telefone', pessoa.telefone])
    if (pessoa.endereco) data.push(['Endereço', pessoa.endereco])

    autoTable(doc, {
      startY: yPos,
      body: data,
      theme: 'striped',
      headStyles: { fillColor: this.COLORS.primary },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 110 },
      },
    })

    return (doc as any).lastAutoTable.finalY + 15
  }

  /**
   * Alertas e riscos
   */
  private addAlertas(doc: jsPDF, yPos: number, alertas: ReportAlerta[]): number {
    const body = alertas.map((a) => [
      a.tipo.toUpperCase(),
      a.severidade.toUpperCase(),
      a.descricao,
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Tipo', 'Severidade', 'Descrição']],
      body,
      theme: 'grid',
      headStyles: { fillColor: this.COLORS.danger },
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 30 },
        2: { cellWidth: 100 },
      },
    })

    return (doc as any).lastAutoTable.finalY + 15
  }

  /**
   * Vínculos empresariais
   */
  private addEmpresas(doc: jsPDF, yPos: number, empresas: ReportEmpresa[]): number {
    const body = empresas.map((e) => [
      this.formatCnpj(e.cnpj),
      e.razaoSocial,
      e.participacao || '-',
      e.cargo || '-',
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['CNPJ', 'Razão Social', 'Participação', 'Cargo']],
      body,
      theme: 'striped',
      headStyles: { fillColor: this.COLORS.primary },
      styles: { fontSize: 9, cellPadding: 3 },
    })

    return (doc as any).lastAutoTable.finalY + 15
  }

  /**
   * Dívidas ativas
   */
  private addDividas(doc: jsPDF, yPos: number, dividas: ReportDivida[]): number {
    const body = dividas.map((d) => [
      d.tipo,
      d.numeroInscricao || '-',
      `R$ ${d.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      d.situacao,
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Tipo', 'Inscrição', 'Valor', 'Situação']],
      body,
      theme: 'striped',
      headStyles: { fillColor: this.COLORS.danger },
      styles: { fontSize: 9, cellPadding: 3 },
    })

    return (doc as any).lastAutoTable.finalY + 15
  }

  /**
   * Processos judiciais
   */
  private addProcessos(doc: jsPDF, yPos: number, processos: ReportProcesso[]): number {
    const body = processos.map((p) => [p.numero, p.tipo, p.tribunal, p.polo || '-'])

    autoTable(doc, {
      startY: yPos,
      head: [['Número', 'Tipo', 'Tribunal', 'Polo']],
      body,
      theme: 'striped',
      headStyles: { fillColor: this.COLORS.primary },
      styles: { fontSize: 9, cellPadding: 3 },
    })

    return (doc as any).lastAutoTable.finalY + 15
  }

  /**
   * Candidaturas políticas
   */
  private addCandidaturas(doc: jsPDF, yPos: number, candidaturas: ReportCandidatura[]): number {
    const body = candidaturas.map((c) => [c.ano, c.cargo, c.partido, c.resultado])

    autoTable(doc, {
      startY: yPos,
      head: [['Ano', 'Cargo', 'Partido', 'Resultado']],
      body,
      theme: 'striped',
      headStyles: { fillColor: this.COLORS.primary },
      styles: { fontSize: 9, cellPadding: 3 },
    })

    return (doc as any).lastAutoTable.finalY + 15
  }

  /**
   * Benefícios sociais
   */
  private addBeneficios(doc: jsPDF, yPos: number, beneficios: ReportBeneficio[]): number {
    const body = beneficios.map((b) => [
      b.tipo,
      b.programa,
      b.valor ? `R$ ${b.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-',
      b.competencia || '-',
    ])

    autoTable(doc, {
      startY: yPos,
      head: [['Tipo', 'Programa', 'Valor', 'Competência']],
      body,
      theme: 'striped',
      headStyles: { fillColor: this.COLORS.primary },
      styles: { fontSize: 9, cellPadding: 3 },
    })

    return (doc as any).lastAutoTable.finalY + 15
  }

  /**
   * Conclusões e recomendações
   */
  private addConclusoes(
    doc: jsPDF,
    yPos: number,
    conclusoes: string[],
    recomendacoes?: string[]
  ): number {
    if (yPos > 230) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(10)
    doc.setTextColor(this.COLORS.dark[0], this.COLORS.dark[1], this.COLORS.dark[2])

    conclusoes.forEach((conclusao, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${conclusao}`, 170)
      doc.text(lines, 20, yPos)
      yPos += lines.length * 7

      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
    })

    if (recomendacoes && recomendacoes.length > 0) {
      yPos += 10
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Recomendações:', 20, yPos)
      yPos += 7

      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')

      recomendacoes.forEach((rec, index) => {
        const lines = doc.splitTextToSize(`${index + 1}. ${rec}`, 170)
        doc.text(lines, 20, yPos)
        yPos += lines.length * 7

        if (yPos > 270) {
          doc.addPage()
          yPos = 20
        }
      })
    }

    return yPos
  }

  /**
   * Adiciona footers em todas as páginas
   */
  private addFooters(doc: jsPDF): void {
    const pageCount = doc.getNumberOfPages()
    const timestamp = new Date().toLocaleString('pt-BR')

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(this.COLORS.gray[0], this.COLORS.gray[1], this.COLORS.gray[2])

      doc.text(`Página ${i} de ${pageCount} | Gerado em ${timestamp}`, 20, 290)
      doc.text('investigaree.com.br | Confidencial', 150, 290)
    }
  }

  /**
   * Download do relatório
   */
  async downloadReport(data: ReportData, filename: string): Promise<void> {
    const doc = this.generateDueDiligenceReport(data)
    doc.save(filename)
  }

  /**
   * Preview do relatório (retorna data URL)
   */
  async previewReport(data: ReportData): Promise<string> {
    const doc = this.generateDueDiligenceReport(data)
    return doc.output('dataurlstring')
  }

  /**
   * Retorna PDF como Blob
   */
  async getReportBlob(data: ReportData): Promise<Blob> {
    const doc = this.generateDueDiligenceReport(data)
    return doc.output('blob')
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
export const reportService = new ReportService()
