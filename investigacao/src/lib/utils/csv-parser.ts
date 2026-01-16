/**
 * CSV Parser Utility - Agent 3 (TAREFA 3.12)
 *
 * Utilitário para fazer parse de CSV com funcionários
 * Suporta formato: CPF, Nome, Grupo, Cargo, Salário
 */

export interface ParsedFuncionario {
  cpf: string
  nome?: string
  grupo?: string
  cargo?: string
  salario?: number
}

export interface ParseResult {
  success: boolean
  data: ParsedFuncionario[]
  errors: Array<{
    line: number
    error: string
    data?: string
  }>
  stats: {
    total: number
    valid: number
    invalid: number
  }
}

/**
 * Limpa e valida CPF
 */
function cleanCPF(cpf: string): string {
  return cpf.replace(/[^\d]/g, '')
}

/**
 * Valida CPF (algoritmo completo)
 */
function isValidCPF(cpf: string): boolean {
  const cleaned = cleanCPF(cpf)

  if (cleaned.length !== 11) return false
  if (/^(\d)\1+$/.test(cleaned)) return false // Todos dígitos iguais

  // Validar dígito verificador
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0

  if (digit !== parseInt(cleaned.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0

  if (digit !== parseInt(cleaned.charAt(10))) return false

  return true
}

/**
 * Parse CSV file para array de funcionários
 *
 * Formato esperado:
 * CPF,Nome,Grupo,Cargo,Salario
 * 12345678900,João Silva,COMURG,Auxiliar,2500
 *
 * @param file Arquivo CSV
 * @param options Opções de parsing
 * @returns Resultado do parse com dados válidos e erros
 *
 * @example
 * const result = await parseCSV(file, { skipHeader: true });
 * if (result.success) {
 *   console.log(`${result.stats.valid} funcionários válidos`);
 *   console.log(result.data);
 * } else {
 *   console.error('Erros:', result.errors);
 * }
 */
export async function parseCSV(
  file: File,
  options: {
    skipHeader?: boolean
    delimiter?: string
    validateCPF?: boolean
  } = {}
): Promise<ParseResult> {
  const {
    skipHeader = true,
    delimiter = ',',
    validateCPF = true,
  } = options

  const result: ParseResult = {
    success: false,
    data: [],
    errors: [],
    stats: {
      total: 0,
      valid: 0,
      invalid: 0,
    },
  }

  try {
    // Ler arquivo como texto
    const text = await file.text()
    const lines = text.split('\n').filter((line) => line.trim())

    // Skip header se configurado
    const startLine = skipHeader ? 1 : 0

    for (let i = startLine; i < lines.length; i++) {
      const lineNumber = i + 1
      const line = lines[i].trim()

      if (!line) continue // Skip empty lines

      result.stats.total++

      try {
        // Parse line
        const columns = line.split(delimiter).map((col) => col.trim())

        if (columns.length < 1) {
          result.errors.push({
            line: lineNumber,
            error: 'Linha vazia ou inválida',
            data: line,
          })
          result.stats.invalid++
          continue
        }

        const [cpfRaw, nome, grupo, cargo, salarioRaw] = columns

        // Validar CPF (obrigatório)
        if (!cpfRaw) {
          result.errors.push({
            line: lineNumber,
            error: 'CPF é obrigatório',
            data: line,
          })
          result.stats.invalid++
          continue
        }

        const cpf = cleanCPF(cpfRaw)

        if (validateCPF && !isValidCPF(cpf)) {
          result.errors.push({
            line: lineNumber,
            error: `CPF inválido: ${cpfRaw}`,
            data: line,
          })
          result.stats.invalid++
          continue
        }

        // Parse salário (opcional)
        let salario: number | undefined
        if (salarioRaw) {
          const salarioParsed = parseFloat(
            salarioRaw.replace(/[^\d.,]/g, '').replace(',', '.')
          )
          if (!isNaN(salarioParsed)) {
            salario = salarioParsed
          }
        }

        // Criar objeto funcionário
        const funcionario: ParsedFuncionario = {
          cpf,
          ...(nome && { nome }),
          ...(grupo && { grupo }),
          ...(cargo && { cargo }),
          ...(salario && { salario }),
        }

        result.data.push(funcionario)
        result.stats.valid++
      } catch (error: any) {
        result.errors.push({
          line: lineNumber,
          error: error.message || 'Erro ao processar linha',
          data: line,
        })
        result.stats.invalid++
      }
    }

    result.success = result.stats.valid > 0
  } catch (error: any) {
    result.errors.push({
      line: 0,
      error: `Erro ao ler arquivo: ${error.message}`,
    })
  }

  return result
}

/**
 * Gera CSV template para download
 *
 * @returns Blob do CSV template
 *
 * @example
 * const blob = generateCSVTemplate();
 * const url = URL.createObjectURL(blob);
 * const a = document.createElement('a');
 * a.href = url;
 * a.download = 'template-funcionarios.csv';
 * a.click();
 */
export function generateCSVTemplate(): Blob {
  const template = `CPF,Nome,Grupo,Cargo,Salario
12345678900,João da Silva,COMURG,Auxiliar de Limpeza,2500.00
98765432100,Maria Santos,SECRETARIA,Gerente,4500.00
11122233344,Pedro Oliveira,SAUDE,Enfermeiro,3800.00`

  return new Blob([template], { type: 'text/csv;charset=utf-8;' })
}

/**
 * Valida tamanho do arquivo
 *
 * @param file Arquivo para validar
 * @param maxSizeMB Tamanho máximo em MB (default: 10MB)
 * @returns true se válido, false caso contrário
 */
export function validateFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}

/**
 * Valida tipo do arquivo
 *
 * @param file Arquivo para validar
 * @returns true se CSV, false caso contrário
 */
export function validateFileType(file: File): boolean {
  const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain']
  const validExtensions = ['.csv', '.txt']

  return (
    validTypes.includes(file.type) ||
    validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
  )
}

/**
 * Formata estatísticas de parse para exibição
 *
 * @param stats Estatísticas do parse
 * @returns String formatada
 */
export function formatParseStats(stats: ParseResult['stats']): string {
  const percentage =
    stats.total > 0 ? ((stats.valid / stats.total) * 100).toFixed(1) : '0'
  return `${stats.valid}/${stats.total} válidos (${percentage}%)`
}
