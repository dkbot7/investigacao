import { Suspense } from 'react'
import { Metadata } from 'next'
import { Shield, FileText, UserCheck, AlertCircle, CheckCircle, Settings } from 'lucide-react'
import { ComplianceErrorBoundary } from '@/components/compliance/ComplianceErrorBoundary'

/**
 * LGPD Dashboard Page (Server Component)
 *
 * Página de gerenciamento de conformidade LGPD (Lei 13.709/2018)
 * - Visualização de consentimentos
 * - Gestão de direitos do titular (Art. 18)
 * - Registro de atividades de tratamento
 * - Base legal e finalidades
 *
 * Best Practices 2025:
 * - Server Component para SEO e performance
 * - Metadata API
 * - Client Components apenas para interatividade
 *
 * Fontes:
 * - https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
 * - https://www.gov.br/anpd/pt-br
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

export const metadata: Metadata = {
  title: 'LGPD - Conformidade e Privacidade - InvestigaRee',
  description:
    'Gestão de conformidade com a Lei Geral de Proteção de Dados (LGPD). Consentimentos, direitos do titular e registro de tratamento de dados.',
  keywords: [
    'LGPD',
    'Lei 13.709',
    'proteção de dados',
    'privacidade',
    'consentimento',
    'ANPD',
    'direitos do titular',
    'base legal',
  ],
  openGraph: {
    title: 'LGPD Dashboard - InvestigaRee',
    description: 'Gestão de conformidade com a Lei Geral de Proteção de Dados',
    type: 'website',
  },
}

/**
 * Busca estatísticas de LGPD do backend
 * Chama a API que delega para o backend worker com autenticação
 */
async function getLGPDStats() {
  const response = await fetch('/api/lgpd/stats', {
    cache: 'no-store', // Sempre buscar dados frescos
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Falha ao buscar estatísticas LGPD');
  }

  return response.json();
}

export default async function LGPDPage() {
  const stats = await getLGPDStats()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              LGPD - Conformidade e Privacidade
            </h1>
          </div>
          <p className="text-slate-600 dark:text-white/60">
            Gestão de consentimentos, direitos do titular e conformidade com a Lei 13.709/2018
          </p>
        </div>

        {/* Estatísticas */}
        <ComplianceErrorBoundary>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              title="Consentimentos Ativos"
              value={stats.consentimentosAtivos}
              total={stats.totalConsentimentos}
              icon={UserCheck}
              color="green"
            />
            <StatCard
              title="Solicitações de Acesso"
              value={stats.solicitacoesAcesso}
              icon={FileText}
              color="blue"
              badge="Art. 18, II"
            />
            <StatCard
              title="Solicitações de Exclusão"
              value={stats.solicitacoesExclusao}
              icon={AlertCircle}
              color="orange"
              badge="Art. 18, VI"
            />
            <StatCard
              title="Incidentes de Segurança"
              value={stats.incidentes}
              icon={stats.incidentes === 0 ? CheckCircle : AlertCircle}
              color={stats.incidentes === 0 ? 'green' : 'red'}
            />
          </div>
        </ComplianceErrorBoundary>

        {/* Direitos do Titular (Art. 18) */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              Direitos do Titular de Dados (Art. 18 LGPD)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
            <DireitoCard
              numero="I"
              titulo="Confirmação e Acesso"
              descricao="Confirmação da existência de tratamento e acesso aos dados"
            />
            <DireitoCard
              numero="II"
              titulo="Correção"
              descricao="Correção de dados incompletos, inexatos ou desatualizados"
            />
            <DireitoCard
              numero="III"
              titulo="Anonimização ou Bloqueio"
              descricao="Anonimização, bloqueio ou eliminação de dados desnecessários"
            />
            <DireitoCard
              numero="IV"
              titulo="Portabilidade"
              descricao="Portabilidade dos dados a outro fornecedor de serviço"
            />
            <DireitoCard
              numero="V"
              titulo="Eliminação"
              descricao="Eliminação dos dados tratados com o consentimento do titular"
            />
            <DireitoCard
              numero="VI"
              titulo="Informação sobre Compartilhamento"
              descricao="Informação sobre entidades com as quais os dados foram compartilhados"
            />
            <DireitoCard
              numero="VII"
              titulo="Negativa de Consentimento"
              descricao="Informação sobre possibilidade de não fornecer consentimento"
            />
            <DireitoCard
              numero="VIII"
              titulo="Revogação de Consentimento"
              descricao="Revogação do consentimento a qualquer momento"
            />
          </div>
        </div>

        {/* Bases Legais */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-4 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
              Bases Legais de Tratamento (Art. 7º LGPD)
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <BaseLegalItem
              titulo="Consentimento"
              descricao="Mediante fornecimento de consentimento pelo titular"
            />
            <BaseLegalItem
              titulo="Obrigação Legal"
              descricao="Para cumprimento de obrigação legal ou regulatória"
            />
            <BaseLegalItem
              titulo="Execução de Contrato"
              descricao="Para execução de contrato ou procedimentos preliminares"
            />
            <BaseLegalItem
              titulo="Legítimo Interesse"
              descricao="Para atender aos interesses legítimos do controlador ou de terceiro"
            />
            <BaseLegalItem
              titulo="Proteção da Vida"
              descricao="Para proteção da vida ou da incolumidade física"
            />
            <BaseLegalItem
              titulo="Tutela da Saúde"
              descricao="Para tutela da saúde em procedimento por profissionais de saúde"
            />
          </div>
        </div>

        {/* Links Úteis */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-4 sm:p-6">
          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-3">
            Recursos e Documentação
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-white/60">
            <li>
              • <strong>LGPD (Lei 13.709/2018):</strong>{' '}
              <a
                href="https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Texto Integral da Lei
              </a>
            </li>
            <li>
              • <strong>ANPD:</strong>{' '}
              <a
                href="https://www.gov.br/anpd/pt-br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Autoridade Nacional de Proteção de Dados
              </a>
            </li>
            <li>
              • <strong>Guia de Boas Práticas:</strong>{' '}
              <a
                href="https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-guia-orientativo-para-pequenos-negocios"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                ANPD - Pequenos Negócios
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Stat Card Component (Server Component)
 */
interface StatCardProps {
  title: string
  value: number
  total?: number
  icon: React.ComponentType<{ className?: string }>
  color: 'green' | 'blue' | 'orange' | 'red'
  badge?: string
}

function StatCard({ title, value, total, icon: Icon, color, badge }: StatCardProps) {
  const colorConfig = {
    green: {
      bg: 'bg-green-500/10',
      text: 'text-green-400',
      border: 'border-green-500/20',
    },
    blue: {
      bg: 'bg-blue-500/10',
      text: 'text-blue-400',
      border: 'border-blue-500/20',
    },
    orange: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/20',
    },
    red: {
      bg: 'bg-red-500/10',
      text: 'text-red-400',
      border: 'border-red-500/20',
    },
  }

  const config = colorConfig[color]

  return (
    <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-xl p-3 sm:p-4">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${config.text}`} />
        </div>
        {badge && (
          <span className="text-[10px] sm:text-xs px-2 sm:px-2 py-0.5 sm:py-0.5 bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-white/60 rounded">
            {badge}
          </span>
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
        {total && (
          <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-white/40">
            {' '}/ {total}
          </span>
        )}
      </p>
      <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
    </div>
  )
}

/**
 * Direito Card Component (Server Component)
 */
interface DireitoCardProps {
  numero: string
  titulo: string
  descricao: string
}

function DireitoCard({ numero, titulo, descricao }: DireitoCardProps) {
  return (
    <div className="p-3 rounded-lg bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-navy-700">
      <div className="flex items-start gap-2">
        <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
          {numero}
        </span>
        <div>
          <p className="font-semibold text-sm text-slate-900 dark:text-white">{titulo}</p>
          <p className="text-xs text-slate-600 dark:text-white/60 mt-0.5">{descricao}</p>
        </div>
      </div>
    </div>
  )
}

/**
 * Base Legal Item Component (Server Component)
 */
interface BaseLegalItemProps {
  titulo: string
  descricao: string
}

function BaseLegalItem({ titulo, descricao }: BaseLegalItemProps) {
  return (
    <div className="flex items-start gap-2 p-2 rounded hover:bg-slate-50 dark:hover:bg-navy-800 transition-colors">
      <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
      <div>
        <p className="font-medium text-slate-900 dark:text-white text-sm">{titulo}</p>
        <p className="text-xs text-slate-600 dark:text-white/60">{descricao}</p>
      </div>
    </div>
  )
}
