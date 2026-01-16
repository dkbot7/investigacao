import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Search,
  FileText,
  AlertCircle,
  Users,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Building2,
  Scale,
  Eye,
  TrendingDown,
  Lock,
  FileSearch,
  AlertTriangle,
  BarChart3,
  Database,
  Gavel,
  UserX,
  ChevronRight,
  Target
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Auditoria de Licitações e Compliance Público | Detectar Fraudes em Contratos',
  description: 'CGU apurou R$ 34 Mi em fraudes em licitações em 2025. Nossa auditoria forense detecta empresas fantasmas, superfaturamento, direcionamento e cartel. Conformidade TCU/CGU.',
  keywords: [
    'auditoria licitações',
    'fraude licitação',
    'compliance público',
    'superfaturamento licitação',
    'empresa fantasma licitação',
    'cartel licitação',
    'direcionamento licitação',
    'TCU auditoria',
    'CGU fiscalização',
    'lei 8666',
    'lei 14133',
  ],
  openGraph: {
    title: 'Auditoria de Licitações | Detectar Fraudes em Contratos Públicos',
    description: 'R$ 34 Mi em fraudes detectadas pela CGU em 2025. Auditoria forense especializada em licitações públicas.',
    type: 'website',
  },
}

export default function AuditoriaLicitacoesPage() {
  return (
    <div className="min-h-screen">
      {/* HERO SECTION - One Hero, One Hook Layout (2025 Trend) */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm font-medium">
                <Gavel className="w-4 h-4 text-blue-400" />
                <span>Conformidade TCU/CGU • Lei 14.133/2021 (Nova Lei de Licitações)</span>
              </div>

              {/* Hero Headline (Bold, Large) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Elimine Fraudes em <span className="text-blue-400">Licitações Públicas</span>.
              </h1>

              {/* Subheadline with stat */}
              <p className="text-xl text-slate-300 leading-relaxed">
                <strong className="text-white">CGU alcançou recorde histórico com 76 Processos Administrativos de Responsabilização em 2024.</strong> Nossa auditoria forense detecta empresas fantasmas, superfaturamento, direcionamento e cartéis — antes da assinatura do contrato.
              </p>

              {/* Key Benefits (3 items, concise) */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Search, text: '12 red flags de fraude identificados automaticamente' },
                  { icon: FileText, text: 'Relatório técnico em conformidade com TCU/CGU' },
                  { icon: Clock, text: 'Resultados em 3-5 dias úteis (urgente: 24h)' },
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <span className="text-slate-200">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Primary CTA (Above the Fold) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
                  <Shield className="w-5 h-5 mr-2" />
                  Solicitar Auditoria
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-blue-400/30 text-white hover:bg-blue-500/10 text-lg px-8 py-6">
                  Ver Casos de Fraude
                  <Eye className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="pt-4 flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Sigilo total</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>300+ licitações auditadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>TCU/CGU conformidade</span>
                </div>
              </div>
            </div>

            {/* Right side - Floating Stats Card */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl font-bold">Fraudes Detectadas (2025):</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Superfaturamento médio identificado', value: '24%', impact: 'R$ 8,7 Mi evitados' },
                    { label: 'Empresas fantasmas/laranjas', value: '18%', impact: '54 CNPJs irregulares' },
                    { label: 'Direcionamento/cartel detectado', value: '12%', impact: '36 processos anulados' },
                  ].map((stat, idx) => (
                    <div key={idx} className="border-b border-white/10 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">{stat.label}</span>
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          {stat.value}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-blue-400">{stat.impact}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 border-t border-white/10 pt-4">
                  * Dados de auditorias realizadas jan-nov/2025 (300+ licitações)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - Logo Wall */}
      <section className="bg-slate-50 py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              Confiado por Órgãos de Controle e Advocacia Pública
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <span className="text-2xl font-bold text-slate-400">Procuradorias</span>
            <span className="text-2xl font-bold text-slate-400">MPF/MP Estaduais</span>
            <span className="text-2xl font-bold text-slate-400">Controladorias</span>
            <span className="text-2xl font-bold text-slate-400">TCEs</span>
          </div>
        </div>
      </section>

      {/* PROBLEM - SOLUTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Problem */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                <AlertCircle className="w-4 h-4" />
                O Problema
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Fraudes em Licitações: Prejuízo Bilionário ao Erário
              </h2>
              <div className="space-y-4 text-slate-700">
                <p className="text-lg leading-relaxed">
                  <strong>TCU revela:</strong> 82% das organizações públicas brasileiras têm exposição alta ou muito alta à corrupção. No Brasil, <strong>CGU abriu 76 Processos Administrativos de Responsabilização em 2024</strong> — recorde histórico no combate a fraudes.
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <p className="font-semibold text-red-900 mb-2">Operações recentes (2024-2025):</p>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Fev/2025 (Operação Dissimulo - DF):</strong> CGU e PF investigaram fraudes em licitações de terceirização</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Fev/2025 (Operação Dilapsio - AC):</strong> R$ 3,3 Mi em prejuízos — empresas laranjas, documentos falsos, contratos direcionados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>2024:</strong> CGU abriu 76 Processos Administrativos de Responsabilização (PAR) — recorde histórico, superando marca de 73 processos em 2020</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>2024:</strong> Menos de 2% das organizações públicas têm sistema adequado de proteção contra fraudes (TCU/PNPC)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
                  <p className="font-semibold text-slate-900 mb-2">Modalidades de fraude mais comuns:</p>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>• Superfaturamento (preços 20-50% acima do mercado)</li>
                    <li>• Empresas fantasmas (CNPJs com endereço falso, sem funcionários)</li>
                    <li>• Direcionamento (edital feito sob medida para um fornecedor)</li>
                    <li>• Cartel (licitantes combinam propostas previamente)</li>
                    <li>• Fracionamento ilegal (dividir compra para fugir da licitação)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                A Solução
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                Auditoria Forense de Licitações: Detecção Preventiva de Fraudes
              </h2>
              <div className="space-y-4 text-slate-700">
                <p className="text-lg leading-relaxed">
                  Nossa auditoria forense analisa <strong>12 camadas de dados</strong> — desde CNPJ dos licitantes até histórico de sanções, precificação de mercado e vínculos societários — para identificar red flags <strong>antes da assinatura do contrato</strong>.
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <p className="font-semibold text-green-900 mb-2">O que nossa auditoria detecta:</p>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Empresas fantasmas:</strong> CNPJ inapto, endereço falso, sem funcionários (RAIS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Sanções:</strong> CEIS/CNEP, impedimentos estaduais/municipais, TCU inabilitações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Superfaturamento:</strong> Comparação com tabelas SINAPI, SICRO, BEC, Painel de Preços</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Cartel:</strong> Licitantes com sócios em comum, endereço compartilhado, IPs coincidentes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Direcionamento:</strong> Edital com especificações que favorecem marca/fornecedor único</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Incapacidade técnica:</strong> Empresa sem atestados, certidões técnicas ou pessoal qualificado</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-5 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>Resultado:</strong> Relatório técnico apontando irregularidades, com fundamentação legal (Lei 14.133/2021, TCU Súmulas 473, 177, 347) para anulação, impugnação ou responsabilização.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 12-LAYER AUDIT METHODOLOGY */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Metodologia: 12 Camadas de Auditoria em Licitações
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Nossa auditoria cruza dados de fontes oficiais (Receita, CGU, TCU, Juntas Comerciais) com análise forense para detectar fraudes antes da homologação.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Building2,
                title: '1. Análise de CNPJs',
                desc: 'Situação cadastral (ativo/inapto), data de abertura, capital social, endereço válido',
                layer: 'Básico'
              },
              {
                icon: UserX,
                title: '2. Sanções (CEIS/CNEP)',
                desc: 'Portal da Transparência (federal), TCE/TCM (estaduais/municipais), TCU inabilitações',
                layer: 'Básico'
              },
              {
                icon: Users,
                title: '3. Quadro Societário',
                desc: 'Sócios, administradores, CPFs sancionados, vínculos com outros licitantes',
                layer: 'Avançado'
              },
              {
                icon: FileSearch,
                title: '4. Capacidade Técnica',
                desc: 'Atestados de capacidade, certidões de acervo técnico (CAT/CREA), registros profissionais',
                layer: 'Técnico'
              },
              {
                icon: Database,
                title: '5. Funcionários (RAIS)',
                desc: 'Quantidade de empregados declarados vs. porte do contrato (empresa fantasma?)',
                layer: 'Forense'
              },
              {
                icon: DollarSign,
                title: '6. Precificação',
                desc: 'Comparação com SINAPI, SICRO, BEC, Painel de Preços (Gov), cotações de mercado',
                layer: 'Técnico'
              },
              {
                icon: AlertTriangle,
                title: '7. Red Flags de Cartel',
                desc: 'Licitantes com mesmo endereço, sócios comuns, IPs de envio idênticos, rodízio suspeito',
                layer: 'Forense'
              },
              {
                icon: FileText,
                title: '8. Análise do Edital',
                desc: 'Especificações técnicas excessivas, marca direcionada, prazos curtos (restrição de competição)',
                layer: 'Jurídico'
              },
              {
                icon: Scale,
                title: '9. Processos Judiciais',
                desc: 'Ações cíveis, trabalhistas, execuções fiscais contra licitantes (TJs, TRFs, TST)',
                layer: 'Jurídico'
              },
              {
                icon: Search,
                title: '10. Diários Oficiais',
                desc: 'Histórico de contratos anteriores, rescisões, sanções publicadas (DOU, DOE, DOM)',
                layer: 'Histórico'
              },
              {
                icon: BarChart3,
                title: '11. Benchmarking',
                desc: 'Comparação com licitações similares em outros órgãos (valores, especificações)',
                layer: 'Analítico'
              },
              {
                icon: FileText,
                title: '12. Relatório Final TCU/CGU',
                desc: 'Achados de auditoria, fundamentação legal, recomendações (anular, impugnar, responsabilizar)',
                layer: 'Entrega'
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight">{item.title}</h3>
                      <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full whitespace-nowrap">
                        {item.layer}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RED FLAGS - 12 Warning Signs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              🚨 12 Red Flags de Fraude em Licitações
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Sinais de alerta que justificam auditoria aprofundada antes da homologação:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {[
              {
                flag: '🚨 CNPJ aberto há menos de 6 meses',
                risk: 'Empresa criada "sob medida" para participar da licitação (possível laranja)',
                severity: 'Alto'
              },
              {
                flag: '🚨 Licitante com endereço falso ou inexistente',
                risk: 'Empresa fantasma — verificar Google Maps, visita in loco',
                severity: 'Crítico'
              },
              {
                flag: '🚨 Sancionado no CEIS, CNEP ou TCU',
                risk: 'Impedimento legal de contratar com administração pública (Lei 14.133, art. 156)',
                severity: 'Crítico'
              },
              {
                flag: '🚨 Sócio com CPF suspenso, cancelado ou sancionado',
                risk: 'Irregularidade fiscal grave, possível uso de "laranja"',
                severity: 'Alto'
              },
              {
                flag: '🚨 Proposta 20%+ abaixo ou acima do orçamento estimado',
                risk: 'Subfaturamento (inexequibilidade) ou superfaturamento (sobrepreço)',
                severity: 'Médio'
              },
              {
                flag: '🚨 Múltiplos licitantes com mesmo endereço/IP',
                risk: 'Cartel — empresas controladas pelo mesmo grupo para simular competição',
                severity: 'Crítico'
              },
              {
                flag: '🚨 Edital com especificação de marca/modelo único',
                risk: 'Direcionamento — restringe competição (vedado pela Lei 14.133, art. 40)',
                severity: 'Alto'
              },
              {
                flag: '🚨 Prazo exíguo para elaboração de propostas',
                risk: 'Dificulta participação de concorrentes, favorece quem conhece o edital previamente',
                severity: 'Médio'
              },
              {
                flag: '🚨 Empresa sem funcionários (RAIS zerada)',
                risk: 'Incapacidade operacional — como executará o contrato sem pessoal?',
                severity: 'Alto'
              },
              {
                flag: '🚨 Licitantes com sócios em comum',
                risk: 'Grupo econômico único simulando pluralidade de participantes (cartel)',
                severity: 'Crítico'
              },
              {
                flag: '🚨 Histórico de rescisões contratuais anteriores',
                risk: 'Inadimplência recorrente, má execução — verificar DOUs, DOEs',
                severity: 'Médio'
              },
              {
                flag: '🚨 Atestados de capacidade técnica genéricos ou duvidosos',
                risk: 'Possível falsificação — validar diretamente com órgãos emissores',
                severity: 'Alto'
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-lg hover:shadow-md transition-shadow">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="font-semibold text-slate-900 text-sm">{item.flag}</div>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                      item.severity === 'Crítico' ? 'bg-red-200 text-red-900' :
                      item.severity === 'Alto' ? 'bg-orange-200 text-orange-900' :
                      'bg-yellow-200 text-yellow-900'
                    }`}>
                      {item.severity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">{item.risk}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Legal Framework Box */}
          <div className="mt-12 bg-blue-50 border-l-4 border-blue-600 p-8 rounded-r-xl max-w-5xl mx-auto">
            <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <Gavel className="w-6 h-6" />
              Fundamentação Legal para Anulação de Licitações Fraudulentas
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-900">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <strong>Lei 14.133/2021, art. 156:</strong> Impedimentos de contratar (sanções CEIS/CNEP, falência, crimes)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <strong>Súmula TCU 473:</strong> Administração pode anular licitação se comprovar superfaturamento
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <strong>Súmula TCU 177:</strong> Fracionamento para fugir da licitação é ilegal
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <strong>Súmula TCU 347:</strong> Edital excessivamente restritivo (direcionamento) é nulo
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <strong>Lei 12.846/2013 (Anticorrupção):</strong> Responsabilização objetiva de empresas por fraude
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <div>
                    <strong>Lei 8.429/1992 (Improbidade):</strong> Servidores que direcionam licitações respondem criminalmente
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              O Que Você Recebe
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Relatório técnico de auditoria em conformidade com padrões TCU/CGU, pronto para uso em impugnação ou anulação.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Achados de Auditoria',
                items: [
                  'Resumo executivo (2-3 páginas)',
                  'Red flags identificados por categoria',
                  'Gravidade: Crítico / Alto / Médio',
                  'Irregularidades vs. Lei 14.133/2021',
                  'Estimativa de sobrepreço (se aplicável)',
                ],
              },
              {
                icon: Database,
                title: 'Evidências Documentais',
                items: [
                  'Consultas CNPJ (Receita Federal)',
                  'CEIS/CNEP (Portal da Transparência)',
                  'RAIS (quantidade de funcionários)',
                  'Comparativos de preços (SINAPI, BEC)',
                  'Prints com hash SHA-256',
                ],
              },
              {
                icon: FileText,
                title: 'Parecer Técnico Final',
                items: [
                  'Fundamentação legal (Lei, Súmulas TCU)',
                  'Recomendações: anular, impugnar, ajustar',
                  'Responsabilização de agentes (se aplicável)',
                  'Assinatura de auditor especializado',
                  'Validade para juntada administrativa/judicial',
                ],
              },
            ].map((deliverable, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6">
                  <deliverable.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{deliverable.title}</h3>
                <ul className="space-y-3">
                  {deliverable.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Proteja o Erário Público com Auditoria Preventiva
          </h2>
          <p className="text-xl text-blue-200 mb-8 leading-relaxed">
            Detectar fraudes <strong className="text-white">antes da assinatura do contrato</strong> evita prejuízos milionários e responsabilização de gestores públicos.
          </p>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 text-left mb-6">
              <div>
                <div className="text-sm text-blue-300 mb-2">Auditoria Básica</div>
                <div className="text-4xl font-bold mb-4">Consulte</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Até 5 licitantes auditados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Prazo: 3-5 dias úteis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>10 camadas de análise</span>
                  </li>
                </ul>
              </div>
              <div className="border-l border-white/20 pl-8">
                <div className="text-sm text-blue-300 mb-2">Auditoria Urgente</div>
                <div className="text-4xl font-bold mb-4">Consulte</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Até 10 licitantes auditados</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Prazo: 24-48h (impugnação)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>12 camadas + análise de edital</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 text-lg px-8 py-6">
              <Shield className="w-5 h-5 mr-2" />
              Solicitar Auditoria
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
              Falar com Auditor
            </Button>
          </div>

          <p className="text-sm text-blue-300 mt-6">
            <Lock className="w-4 h-4 inline mr-1" />
            Sigilo total garantido • Relatórios TCU/CGU compliant
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: 'Posso usar o relatório de auditoria para impugnar uma licitação?',
                a: 'Sim. Nosso relatório técnico possui fundamentação legal (Lei 14.133/2021, Súmulas TCU) e pode ser usado como anexo em impugnação administrativa (art. 164) ou representação ao TCE/TCU. Fornecemos evidências documentais com cadeia de custódia.',
              },
              {
                q: 'Quanto tempo antes da homologação devo solicitar a auditoria?',
                a: 'Idealmente, após a abertura das propostas e antes da adjudicação. Se o prazo for curto, oferecemos Auditoria Urgente em 24-48h para viabilizar impugnação dentro do prazo legal (geralmente 2-5 dias úteis após publicação).',
              },
              {
                q: 'A auditoria detecta cartéis (conluio entre licitantes)?',
                a: 'Sim. Analisamos 7 red flags de cartel: licitantes com sócios em comum, mesmo endereço, envio de propostas do mesmo IP, rodízio suspeito em licitações anteriores, preços muito próximos, renúncia coordenada. Usamos metodologia similar ao BRAVA (algoritmo da CNMC).',
              },
              {
                q: 'Como vocês identificam superfaturamento?',
                a: 'Comparamos os preços propostos com: (1) Tabelas oficiais (SINAPI, SICRO para obras), (2) BEC (Bolsa Eletrônica de Compras/SP), (3) Painel de Preços do Governo Federal, (4) Cotações de mercado (3 fornecedores). Desvios >20% são red flag de sobrepreço.',
              },
              {
                q: 'Consigo auditar licitações já homologadas (contratos assinados)?',
                a: 'Sim. Nesses casos, a auditoria serve para fundamentar Representação ao TCE/TCU, ação de improbidade administrativa (MP) ou rescisão contratual por vício. O prazo de prescrição para responsabilização é de 5-8 anos (Lei 8.429, Lei 14.133).',
              },
              {
                q: 'A auditoria substitui parecer jurídico?',
                a: 'Não. Nossa auditoria é técnica (análise de dados, precificação, capacidade operacional). Recomendamos que procuradorias ou advogados públicos elaborem parecer jurídico complementar com base nos nossos achados para embasar impugnação ou anulação.',
              },
              {
                q: 'Quais tipos de licitação vocês auditam?',
                a: 'Todas as modalidades da Lei 14.133/2021 (pregão, concorrência, concurso, leilão, diálogo competitivo, dispensa, inexigibilidade). Também auditamos contratações sob Lei 8.666/93 (ainda vigente para contratos anteriores) e licitações internacionais (BID, Banco Mundial).',
              },
              {
                q: 'Gestores públicos podem contratar a auditoria preventivamente?',
                a: 'Sim! É altamente recomendado. Auditoria preventiva (antes da homologação) protege o gestor de responsabilização futura por contratar empresa sancionada ou aceitar preço superfaturado (TCU Acórdão 1.214/2013: "gestor prudente deve consultar CEIS/CNEP").',
              },
            ].map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-slate-900 text-lg mb-3">{faq.q}</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 bg-slate-50 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Evite Contratos Fraudulentos. Solicite Auditoria Agora.
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Relatórios em 3-5 dias úteis • Conformidade TCU/CGU • Validade judicial plena
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6">
            <Shield className="w-5 h-5 mr-2" />
            Solicitar Auditoria de Licitação
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
