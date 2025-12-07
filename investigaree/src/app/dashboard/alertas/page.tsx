'use client'

import { AlertsPanel, AlertsBadge } from '@/components/dashboard/AlertsPanel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Info } from 'lucide-react'

/**
 * Página de Alertas em Tempo Real
 *
 * Demonstra o componente AlertsPanel com polling automático a cada 30 segundos
 */
export default function AlertasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Alertas em Tempo Real
            </h1>
            <p className="mt-2 text-slate-600 dark:text-white/60">
              Sistema de notificações com atualização automática a cada 30 segundos
            </p>
          </div>

          <AlertsBadge onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
        </div>

        {/* Info Card */}
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <CardTitle className="text-blue-400">Sistema de Polling Automático</CardTitle>
                <CardDescription className="text-blue-400/80">
                  Esta página utiliza o hook <code className="px-1.5 py-0.5 bg-blue-500/20 rounded">useAsyncPolling</code>
                  {' '}para buscar novos alertas a cada 30 segundos automaticamente, sem necessidade de refresh manual.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Alerts Panel */}
        <AlertsPanel
          pollingInterval={30000}
          autoStart={true}
          showUnreadOnly={false}
        />

        {/* Documentation */}
        <Card className="bg-navy-900 border-navy-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Funcionalidades
            </CardTitle>
          </CardHeader>
          <CardContent className="text-white/80 space-y-4">
            <div>
              <h3 className="font-semibold text-white mb-2">Recursos Principais:</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>Polling Automático:</strong> Atualização a cada 30 segundos sem intervenção do usuário
                </li>
                <li>
                  <strong>Indicador de Status:</strong> Mostra se o polling está ativo ou pausado
                </li>
                <li>
                  <strong>Controles Manuais:</strong> Botões para pausar/iniciar e atualizar manualmente
                </li>
                <li>
                  <strong>Filtros por Tipo:</strong> Todos, Erros, Avisos, Info, Sucesso
                </li>
                <li>
                  <strong>Badge de Notificação:</strong> Contador de alertas não lidos (canto superior direito)
                </li>
                <li>
                  <strong>Ações em Alertas:</strong> Marcar como lido, dispensar (dismiss), limpar todos
                </li>
                <li>
                  <strong>Indicador Visual:</strong> Alertas não lidos destacados com fundo diferenciado
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Uso em Outros Componentes:</h3>
              <div className="bg-navy-800 p-4 rounded-lg font-mono text-sm">
                <div className="text-green-400">{`// Em qualquer página do dashboard:`}</div>
                <div className="mt-2">
                  <span className="text-purple-400">import</span>
                  {' { AlertsPanel, AlertsBadge } '}
                  <span className="text-purple-400">from</span>
                  {' '}
                  <span className="text-yellow-400">'@/components/dashboard/AlertsPanel'</span>
                </div>
                <div className="mt-4 text-gray-400">{`// Badge para navbar/header:`}</div>
                <div className="mt-1">
                  {'<AlertsBadge onClick={() => router.push(\'/dashboard/alertas\')} />'}
                </div>
                <div className="mt-4 text-gray-400">{`// Painel completo:`}</div>
                <div className="mt-1">
                  {'<AlertsPanel pollingInterval={30000} autoStart={true} />'}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-2">Hook useAsyncPolling:</h3>
              <p className="text-sm">
                O hook <code className="px-1.5 py-0.5 bg-navy-800 rounded">useAsyncPolling</code>
                {' '}é reutilizável e pode ser usado em qualquer componente que precise de atualização periódica:
              </p>
              <div className="bg-navy-800 p-4 rounded-lg font-mono text-sm mt-2">
                <div className="text-purple-400">const</div>
                {' { data, loading, start, stop, isPolling } = '}
                <div className="ml-4">
                  <span className="text-yellow-400">useAsyncPolling</span>
                  {'('}
                </div>
                <div className="ml-8 text-gray-400">
                  {`async () => await fetchData(),`}
                </div>
                <div className="ml-8 text-gray-400">
                  {`30000, // intervalo em ms`}
                </div>
                <div className="ml-8">
                  {`{ autoStart: `}<span className="text-blue-400">true</span>{` }`}
                </div>
                <div className="ml-4">{')'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
