'use client'

/**
 * Compliance Error Boundary Component
 *
 * Error boundary específico para compliance com fallback UI apropriado
 *
 * Best Practices 2025:
 * - Error boundaries devem envolver Suspense boundaries
 * - Tratamento gracioso de erros de API
 * - Retry mechanism para erros temporários
 *
 * Fontes:
 * - https://reetesh.in/blog/suspense-and-error-boundary-in-react-explained
 * - https://react.dev/reference/react/Suspense
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

import { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ComplianceErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log para serviço de monitoramento (Sentry, LogRocket, etc.)
    console.error('Compliance Error Boundary caught:', error, errorInfo)

    // Aqui poderia enviar para analytics/monitoring
    // trackError('compliance_error', { error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Erro ao Carregar Compliance
            </h3>

            <p className="text-sm text-slate-600 dark:text-white/60 mb-4">
              {this.state.error?.message || 'Ocorreu um erro inesperado ao carregar os dados de compliance.'}
            </p>

            <Button
              onClick={this.handleReset}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>

            <details className="mt-4 text-left">
              <summary className="text-xs text-slate-500 dark:text-white/40 cursor-pointer hover:text-slate-700 dark:hover:text-white/60">
                Detalhes técnicos
              </summary>
              <pre className="mt-2 text-xs bg-slate-100 dark:bg-navy-800 p-3 rounded overflow-auto">
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

