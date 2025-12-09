import { Suspense } from 'react'
import { Metadata } from 'next'
import { Shield, AlertTriangle, Globe, FileText } from 'lucide-react'
import { ComplianceStats } from '@/components/compliance/ComplianceStats'
import { ComplianceSearch } from '@/components/compliance/ComplianceSearch'
import { ComplianceErrorBoundary } from '@/components/compliance/ComplianceErrorBoundary'
import {
  ComplianceStatsLoading,
  ComplianceSearchLoading,
} from '@/components/compliance/ComplianceLoadingSkeleton'

/**
 * Compliance Dashboard Page (Server Component)
 *
 * Best Practices 2025:
 * - Server Component por padrão (zero JS no bundle)
 * - Metadata API para SEO
 * - Suspense boundaries para streaming
 * - Error boundaries para tratamento robusto
 * - Client Components apenas onde necessário (islands)
 *
 * Fontes:
 * - https://dev.to/joodi/maximizing-seo-with-meta-data-in-nextjs-15-a-comprehensive-guide-4pa7
 * - https://nextjs.org/docs/app/getting-started/layouts-and-pages
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

// Metadata estático para SEO
export const metadata: Metadata = {
  title: 'Compliance - InvestigaRee',
  description:
    'Dashboard de compliance com verificação de PEP, sanções CGU (CEIS/CNEP/CEAF) e OFAC SDN List. Análise de risco em tempo real.',
  keywords: [
    'compliance',
    'PEP',
    'pessoa exposta politicamente',
    'CEIS',
    'CNEP',
    'CEAF',
    'CGU',
    'OFAC',
    'SDN',
    'sanções',
    'análise de risco',
  ],
  openGraph: {
    title: 'Compliance Dashboard - InvestigaRee',
    description: 'Verificação de PEP, sanções e OFAC em tempo real',
    type: 'website',
  },
}

/**
 * Busca estatísticas de compliance no servidor
 * Em produção, isso viria do banco de dados via API
 */
async function getComplianceStats() {
  // TODO: Substituir por fetch real quando backend estiver pronto
  // const response = await fetch(`${process.env.API_BASE_URL}/api/compliance/stats`, {
  //   cache: 'no-store', // ISR pode usar: { next: { revalidate: 300 } }
  // })
  // return response.json()

  // Mock data para demonstração
  return {
    totalPEP: 247,
    totalSancoesCEIS: 89,
    totalSancoesCNEP: 34,
    totalSancoesCEAF: 12,
    totalOFACMatches: 5,
    nivelRiscoGeral: 'medio' as const,
    dataUltimaAtualizacao: new Date().toISOString(),
    comparacaoMesAnterior: {
      pep: 12,
      sancoes: -5,
      ofac: 0,
    },
  }
}

export default async function CompliancePage() {
  // Server Component - data fetching no servidor
  const stats = await getComplianceStats()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Compliance Dashboard
            </h1>
          </div>
          <p className="text-slate-600 dark:text-white/60">
            Verificação de conformidade, análise de risco e sanções em tempo real
          </p>
        </div>

        {/* Estatísticas - Server Component com Suspense */}
        <ComplianceErrorBoundary>
          <Suspense fallback={<ComplianceStatsLoading />}>
            <ComplianceStats stats={stats} />
          </Suspense>
        </ComplianceErrorBoundary>

        {/* Busca Individual - Client Component Island */}
        <ComplianceErrorBoundary>
          <Suspense fallback={<ComplianceSearchLoading />}>
            <ComplianceSearch defaultSearchType="cpf" />
          </Suspense>
        </ComplianceErrorBoundary>

        {/* Cards Informativos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            icon={Shield}
            title="PEP"
            description="Pessoas Expostas Politicamente"
            details="Base atualizada do Portal da Transparência (CGU)"
            color="purple"
          />
          <InfoCard
            icon={AlertTriangle}
            title="Sanções CGU"
            description="CEIS, CNEP e CEAF"
            details="Empresas inidôneas, suspensas e acordos de leniência"
            color="orange"
          />
          <InfoCard
            icon={Globe}
            title="OFAC SDN List"
            description="Lista de sanções dos EUA"
            details="Specially Designated Nationals (Treasury Department)"
            color="blue"
          />
        </div>

        {/* Documentação e Links */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-slate-400" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Fontes Oficiais
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-white/60">
            <li>
              • <strong>PEP:</strong>{' '}
              <a
                href="https://portaldatransparencia.gov.br/download-de-dados/pep"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Portal da Transparência - CGU
              </a>
            </li>
            <li>
              • <strong>CEIS/CNEP/CEAF:</strong>{' '}
              <a
                href="https://portaldatransparencia.gov.br/sancoes"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                CGU - Cadastro de Sanções
              </a>
            </li>
            <li>
              • <strong>OFAC SDN:</strong>{' '}
              <a
                href="https://sanctionssearch.ofac.treas.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                US Treasury Department
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Info Card Component (Server Component)
 */
interface InfoCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  details: string
  color: 'purple' | 'orange' | 'blue'
}

function InfoCard({ icon: Icon, title, description, details, color }: InfoCardProps) {
  const colorConfig = {
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
    },
    orange: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/20',
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
    },
  }

  const config = colorConfig[color]

  return (
    <div className={`bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-4`}>
      <div className={`p-3 rounded-lg ${config.bg} w-fit mb-3`}>
        <Icon className={`w-6 h-6 ${config.text}`} />
      </div>
      <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-sm text-slate-600 dark:text-white/60 mb-2">{description}</p>
      <p className="text-xs text-slate-500 dark:text-white/40">{details}</p>
    </div>
  )
}
