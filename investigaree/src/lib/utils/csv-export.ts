/**
 * CSV Export Utility
 *
 * Utilitário para exportação de dados em formato CSV com recursos avançados:
 * - Múltiplas abas (multiple sheets)
 * - Formatação de dados (datas, números, moeda)
 * - Escape de caracteres especiais
 * - Suporte a encoding UTF-8 com BOM
 * - Progress callback para arquivos grandes
 */

export interface CsvColumn<T = any> {
  /** Nome da coluna no header */
  header: string
  /** Chave do objeto ou função para extrair valor */
  key?: keyof T
  /** Função customizada para formatar o valor */
  formatter?: (row: T) => string | number | boolean | null | undefined
  /** Largura sugerida (para Excel) */
  width?: number
}

export interface CsvExportOptions {
  /** Nome do arquivo (sem extensão) */
  filename: string
  /** Incluir BOM para UTF-8 (melhor compatibilidade com Excel) */
  includeBOM?: boolean
  /** Delimitador (padrão: ",") */
  delimiter?: string
  /** Delimitador de linha (padrão: "\n") */
  lineBreak?: string
  /** Callback de progresso (0-100) */
  onProgress?: (progress: number) => void
}

export interface CsvSheet<T = any> {
  /** Nome da aba */
  name: string
  /** Colunas */
  columns: CsvColumn<T>[]
  /** Dados */
  data: T[]
}

/**
 * Escapa valor para CSV (adiciona aspas se necessário)
 */
function escapeCsvValue(value: any, delimiter: string = ','): string {
  if (value === null || value === undefined) {
    return ''
  }

  const stringValue = String(value)

  // Se contém delimiter, aspas, ou quebra de linha, precisa escapar
  if (
    stringValue.includes(delimiter) ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    // Duplica aspas internas e envolve com aspas
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

/**
 * Formata data para CSV
 */
export function formatDateForCsv(date: string | Date | null | undefined): string {
  if (!date) return ''

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return String(date)
  }
}

/**
 * Formata datetime para CSV
 */
export function formatDateTimeForCsv(date: string | Date | null | undefined): string {
  if (!date) return ''

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch {
    return String(date)
  }
}

/**
 * Formata moeda para CSV
 */
export function formatCurrencyForCsv(value: number | null | undefined): string {
  if (value === null || value === undefined) return ''

  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

/**
 * Formata CPF para CSV
 */
export function formatCpfForCsv(cpf: string | null | undefined): string {
  if (!cpf) return ''

  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return cpf

  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata CNPJ para CSV
 */
export function formatCnpjForCsv(cnpj: string | null | undefined): string {
  if (!cnpj) return ''

  const cleaned = cnpj.replace(/\D/g, '')
  if (cleaned.length !== 14) return cnpj

  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

/**
 * Formata boolean para CSV (Sim/Não)
 */
export function formatBooleanForCsv(value: boolean | null | undefined): string {
  if (value === null || value === undefined) return ''
  return value ? 'Sim' : 'Não'
}

/**
 * Converte dados para CSV (single sheet)
 */
export function dataToCSV<T>(
  data: T[],
  columns: CsvColumn<T>[],
  options: Partial<CsvExportOptions> = {}
): string {
  const { delimiter = ',', lineBreak = '\n', onProgress } = options

  const lines: string[] = []

  // Header
  const headerLine = columns.map((col) => escapeCsvValue(col.header, delimiter)).join(delimiter)
  lines.push(headerLine)

  // Rows
  data.forEach((row, index) => {
    const values = columns.map((col) => {
      let value: any

      // Extract value using formatter or key
      if (col.formatter) {
        value = col.formatter(row)
      } else if (col.key) {
        value = row[col.key]
      } else {
        value = ''
      }

      return escapeCsvValue(value, delimiter)
    })

    lines.push(values.join(delimiter))

    // Report progress
    if (onProgress && index % 100 === 0) {
      const progress = ((index + 1) / data.length) * 100
      onProgress(Math.min(progress, 100))
    }
  })

  if (onProgress) {
    onProgress(100)
  }

  return lines.join(lineBreak)
}

/**
 * Exporta dados para CSV (single sheet)
 */
export function exportToCSV<T>(
  data: T[],
  columns: CsvColumn<T>[],
  options: CsvExportOptions
): void {
  const { filename, includeBOM = true } = options

  let csvContent = dataToCSV(data, columns, options)

  // Add BOM for UTF-8 (makes Excel recognize UTF-8)
  if (includeBOM) {
    csvContent = '\uFEFF' + csvContent
  }

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Exporta múltiplas abas para CSV (cria arquivo ZIP com múltiplos CSVs)
 * Requer JSZip (npm install jszip)
 */
export async function exportMultipleSheets(
  sheets: CsvSheet[],
  options: CsvExportOptions
): Promise<void> {
  // Dynamically import JSZip (code splitting)
  const JSZip = (await import('jszip')).default

  const zip = new JSZip()

  // Add each sheet as a separate CSV file
  sheets.forEach((sheet) => {
    const csvContent = dataToCSV(sheet.data, sheet.columns, {
      delimiter: options.delimiter,
      lineBreak: options.lineBreak,
    })

    const contentWithBOM = options.includeBOM !== false ? '\uFEFF' + csvContent : csvContent

    zip.file(`${sheet.name}.csv`, contentWithBOM)
  })

  // Generate ZIP
  const content = await zip.generateAsync({ type: 'blob' })

  // Download ZIP
  const link = document.createElement('a')
  const url = URL.createObjectURL(content)

  link.setAttribute('href', url)
  link.setAttribute('download', `${options.filename}.zip`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

/**
 * Helper: Cria coluna de data
 */
export function createDateColumn<T>(
  header: string,
  key?: keyof T,
  formatter?: (row: T) => Date | string | null | undefined
): CsvColumn<T> {
  return {
    header,
    key,
    formatter: (row) => {
      const value = formatter ? formatter(row) : key ? row[key] : null
      return formatDateForCsv(value as any)
    },
  }
}

/**
 * Helper: Cria coluna de datetime
 */
export function createDateTimeColumn<T>(
  header: string,
  key?: keyof T,
  formatter?: (row: T) => Date | string | null | undefined
): CsvColumn<T> {
  return {
    header,
    key,
    formatter: (row) => {
      const value = formatter ? formatter(row) : key ? row[key] : null
      return formatDateTimeForCsv(value as any)
    },
  }
}

/**
 * Helper: Cria coluna de moeda
 */
export function createCurrencyColumn<T>(
  header: string,
  key?: keyof T,
  formatter?: (row: T) => number | null | undefined
): CsvColumn<T> {
  return {
    header,
    key,
    formatter: (row) => {
      const value = formatter ? formatter(row) : key ? row[key] : null
      return formatCurrencyForCsv(value as any)
    },
  }
}

/**
 * Helper: Cria coluna de boolean (Sim/Não)
 */
export function createBooleanColumn<T>(
  header: string,
  key?: keyof T,
  formatter?: (row: T) => boolean | null | undefined
): CsvColumn<T> {
  return {
    header,
    key,
    formatter: (row) => {
      const value = formatter ? formatter(row) : key ? row[key] : null
      return formatBooleanForCsv(value as any)
    },
  }
}
