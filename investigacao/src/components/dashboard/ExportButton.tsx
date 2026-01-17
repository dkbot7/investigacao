'use client'

import { useState } from 'react'
import { Download, FileSpreadsheet, Loader2, FileText, FileCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { exportToCSV, exportMultipleSheets, CsvColumn, CsvSheet } from '@/lib/utils/csv-export'
import { exportService, type ExportFormat } from '@/lib/services/export.service'
import { type ReportData } from '@/lib/services/report.service'
import { toast } from 'sonner'

interface ExportButtonProps<T> {
  /** Dados para exportar */
  data: T[]
  /** Definição das colunas */
  columns: CsvColumn<T>[]
  /** Nome base do arquivo */
  filename: string
  /** Texto do botão (padrão: "Exportar") */
  label?: string
  /** Variante do botão */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  /** Tamanho do botão */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** Desabilitado */
  disabled?: boolean
  /** Classe CSS adicional */
  className?: string
  /** Callback após exportação */
  onExportComplete?: () => void
}

/**
 * Botão de exportação CSV com progress e feedback visual
 *
 * @example
 * ```tsx
 * <ExportButton
 *   data={funcionarios}
 *   columns={[
 *     { header: 'Nome', key: 'nome' },
 *     { header: 'CPF', formatter: (row) => formatCpfForCsv(row.cpf) },
 *     createDateColumn('Data Admissão', 'dataAdmissao'),
 *   ]}
 *   filename="funcionarios"
 *   label="Exportar Funcionários"
 * />
 * ```
 */
export function ExportButton<T>({
  data,
  columns,
  filename,
  label = 'Exportar',
  variant = 'outline',
  size = 'default',
  disabled = false,
  className,
  onExportComplete,
}: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleExport = async () => {
    if (disabled || isExporting) return

    setIsExporting(true)
    setProgress(0)

    try {
      // Use setTimeout to allow UI to update
      await new Promise((resolve) => setTimeout(resolve, 100))

      exportToCSV(data, columns, {
        filename,
        includeBOM: true,
        onProgress: (p) => setProgress(p),
      })

      onExportComplete?.()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
      setProgress(0)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {progress > 0 && progress < 100 ? `${Math.round(progress)}%` : 'Exportando...'}
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}

interface MultiSheetExportButtonProps {
  /** Múltiplas abas para exportar */
  sheets: CsvSheet[]
  /** Nome base do arquivo ZIP */
  filename: string
  /** Texto do botão (padrão: "Exportar Múltiplas Abas") */
  label?: string
  /** Variante do botão */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  /** Tamanho do botão */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** Desabilitado */
  disabled?: boolean
  /** Classe CSS adicional */
  className?: string
  /** Callback após exportação */
  onExportComplete?: () => void
}

/**
 * Botão para exportar múltiplas abas em um arquivo ZIP
 *
 * @example
 * ```tsx
 * <MultiSheetExportButton
 *   sheets={[
 *     { name: 'Funcionários', columns: funcionarioColumns, data: funcionarios },
 *     { name: 'Óbitos', columns: obitoColumns, data: obitos },
 *     { name: 'Vínculos', columns: vinculoColumns, data: vinculos },
 *   ]}
 *   filename="relatorio-completo"
 *   label="Exportar Tudo"
 * />
 * ```
 */
export function MultiSheetExportButton({
  sheets,
  filename,
  label = 'Exportar Múltiplas Abas',
  variant = 'outline',
  size = 'default',
  disabled = false,
  className,
  onExportComplete,
}: MultiSheetExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (disabled || isExporting) return

    setIsExporting(true)

    try {
      await exportMultipleSheets(sheets, {
        filename,
        includeBOM: true,
      })

      onExportComplete?.()
    } catch (error) {
      console.error('Multi-sheet export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={disabled || isExporting}
      variant={variant}
      size={size}
      className={cn('gap-2', className)}
    >
      {isExporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Gerando ZIP...
        </>
      ) : (
        <>
          <FileSpreadsheet className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  )
}

interface ExportDropdownProps<T> {
  /** Dados para exportar */
  data: T[]
  /** Definição das colunas */
  columns: CsvColumn<T>[]
  /** Nome base do arquivo */
  filename: string
  /** Opções adicionais de exportação */
  exportOptions?: Array<{
    label: string
    filename?: string
    columns?: CsvColumn<T>[]
    filter?: (row: T) => boolean
  }>
  /** Variante do botão */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  /** Tamanho do botão */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** Classe CSS adicional */
  className?: string
}

/**
 * Dropdown com múltiplas opções de exportação
 *
 * @example
 * ```tsx
 * <ExportDropdown
 *   data={funcionarios}
 *   columns={funcionarioColumns}
 *   filename="funcionarios"
 *   exportOptions={[
 *     { label: 'Exportar Ativos', filter: (f) => f.status === 'ativo' },
 *     { label: 'Exportar Inativos', filter: (f) => f.status === 'inativo' },
 *     { label: 'Exportar Resumido', columns: resumoColumns },
 *   ]}
 * />
 * ```
 */
export function ExportDropdown<T>({
  data,
  columns,
  filename,
  exportOptions = [],
  variant = 'outline',
  size = 'default',
  className,
}: ExportDropdownProps<T>) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (option?: {
    label: string
    filename?: string
    columns?: CsvColumn<T>[]
    filter?: (row: T) => boolean
  }) => {
    setIsExporting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 100))

      const exportData = option?.filter ? data.filter(option.filter) : data
      const exportColumns = option?.columns || columns
      const exportFilename = option?.filename || filename

      exportToCSV(exportData, exportColumns, {
        filename: exportFilename,
        includeBOM: true,
      })
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn('gap-2', className)} disabled={isExporting}>
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Exportar
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Opções de Exportação</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => handleExport()}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Exportar Tudo
        </DropdownMenuItem>

        {exportOptions.map((option, index) => (
          <DropdownMenuItem key={index} onClick={() => handleExport(option)}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Progress indicator para exportações grandes
 */
export function ExportProgress({ progress }: { progress: number }) {
  return (
    <div className="fixed bottom-4 right-4 bg-navy-900 border border-navy-700 rounded-lg p-4 shadow-lg min-w-[300px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">Exportando dados...</span>
        <span className="text-sm text-white/60">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}

// ============================================
// MULTI-FORMAT REPORT EXPORT
// ============================================

interface ReportExportButtonProps {
  /** Dados do relatório */
  data: ReportData
  /** Nome base do arquivo */
  filename?: string
  /** Variante do botão */
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  /** Tamanho do botão */
  size?: 'default' | 'sm' | 'lg' | 'icon'
  /** Mostrar label */
  showLabel?: boolean
  /** Classe CSS adicional */
  className?: string
}

/**
 * Botão de exportação multi-formato para relatórios de Due Diligence
 * Suporta: PDF, Excel, Word, CSV
 *
 * @example
 * ```tsx
 * <ReportExportButton
 *   data={reportData}
 *   filename="relatorio-due-diligence"
 *   showLabel={true}
 * />
 * ```
 */
export function ReportExportButton({
  data,
  filename,
  variant = 'default',
  size = 'default',
  showLabel = true,
  className,
}: ReportExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(null)

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true)
    setExportingFormat(format)

    try {
      await exportService.exportReport(data, {
        format,
        filename,
        includeTimestamp: true,
      })

      toast.success(`Relatório exportado com sucesso!`, {
        description: `Formato: ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Erro ao exportar:', error)
      toast.error('Erro ao exportar relatório', {
        description: error instanceof Error ? error.message : 'Tente novamente',
      })
    } finally {
      setIsExporting(false)
      setExportingFormat(null)
    }
  }

  const exportOptions = [
    {
      format: 'pdf' as ExportFormat,
      label: 'PDF',
      description: 'Documento formatado e profissional',
      icon: FileText,
    },
    {
      format: 'excel' as ExportFormat,
      label: 'Excel',
      description: 'Planilha com múltiplas abas',
      icon: FileSpreadsheet,
    },
    {
      format: 'word' as ExportFormat,
      label: 'Word',
      description: 'Documento editável (.docx)',
      icon: FileText,
    },
    {
      format: 'csv' as ExportFormat,
      label: 'CSV',
      description: 'Formato simples para análise',
      icon: FileCode,
    },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={isExporting} className={cn('gap-2', className)}>
          {isExporting && exportingFormat ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {exportingFormat.toUpperCase()}...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              {showLabel && 'Exportar Relatório'}
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Escolha o formato</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {exportOptions.map((option) => {
          const Icon = option.icon
          const isCurrentlyExporting = isExporting && exportingFormat === option.format

          return (
            <DropdownMenuItem
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={isExporting}
              className="cursor-pointer"
            >
              <div className="flex items-start gap-3 w-full">
                {isCurrentlyExporting ? (
                  <Loader2 className="h-4 w-4 mt-0.5 animate-spin text-green-500" />
                ) : (
                  <Icon className="h-4 w-4 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-medium text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </div>
              </div>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

