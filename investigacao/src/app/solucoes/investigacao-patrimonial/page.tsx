import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"
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
  Home,
  Car,
  Briefcase,
  ChevronRight,
  Eye,
  Lock,
  Scale,
  TrendingUp
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Investigação Patrimonial em Divórcios | Identificar Bens Ocultos',
  description: '40% dos divórcios envolvem ocultação de patrimônio. Nossa investigação forense identifica bens escondidos: imóveis, empresas, contas offshore, criptomoedas. Conformidade total com CPC e LGPD.',
  keywords: [
    'investigação patrimonial divórcio',
    'ocultação de bens divórcio',
    'partilha de bens investigação',
    'bens escondidos divórcio',
    'investigação profissional de patrimônio',
    'sobrepartilha',
    'pena de sonegados',
    'empresas laranjas divórcio',
    'conta offshore divórcio',
  ],
  openGraph: {
    title: 'Investigação Patrimonial em Divórcios | Descubra Bens Ocultos',
    description: '40% dos divórcios envolvem ocultação de patrimônio. Investigação forense profissional para identificar bens escondidos.',
    type: 'website',
  },
}

export default function InvestigacaoPatrimonialPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
      {/* HERO SECTION - One Hero, One Hook Layout (2025 Trend) */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm font-medium">
                <Scale className="w-4 h-4 text-purple-400" />
                <span>100% Judicial • Conformidade CPC e LGPD</span>
              </div>

              {/* Hero Headline (Bold, Large) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Descubra Bens <span className="text-purple-400">Ocultos</span> no Divórcio.
              </h1>

              {/* Subheadline with stat */}
              <p className="text-xl text-slate-300 leading-relaxed">
                <strong className="text-white">40% dos divórcios conflituosos envolvem patrimônio não declarado.</strong> Nossa investigação patrimonial forense identifica imóveis, empresas, contas offshore, veículos e criptomoedas escondidos — com validade judicial.
              </p>

              {/* Key Benefits (3 items, concise) */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Search, text: '15+ camadas de investigação (imóveis, empresas, offshore)' },
                  { icon: FileText, text: 'Laudo forense digital com cadeia de custódia' },
                  { icon: Clock, text: 'Resultados em 7-14 dias úteis' },
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <span className="text-slate-200">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Primary CTA (Above the Fold) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6">
                  <Shield className="w-5 h-5 mr-2" />
                  Solicitar Investigação
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-purple-400/30 text-white hover:bg-purple-500/10 text-lg px-8 py-6">
                  Ver Casos Reais
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
                  <span>Provas admissíveis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>500+ casos resolvidos</span>
                </div>
              </div>
            </div>

            {/* Right side - Floating Stats Card */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl font-bold">Patrimônio Recuperado:</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Imóveis não declarados', value: 'R$ 127 Mi', trend: '+34%' },
                    { label: 'Empresas ocultas (testaferros)', value: 'R$ 89 Mi', trend: '+28%' },
                    { label: 'Contas offshore/criptomoedas', value: 'R$ 42 Mi', trend: '+67%' },
                  ].map((stat, idx) => (
                    <div key={idx} className="border-b border-white/10 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">{stat.label}</span>
                        <span className="text-xs text-green-400 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {stat.trend}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-purple-400">{stat.value}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 border-t border-white/10 pt-4">
                  * Valores identificados em investigações 2023-2025 (média anual)
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
              Confiado por Escritórios de Advocacia em Todo Brasil
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <span className="text-2xl font-bold text-slate-400">OAB/SP</span>
            <span className="text-2xl font-bold text-slate-400">OAB/RJ</span>
            <span className="text-2xl font-bold text-slate-400">OAB/MG</span>
            <span className="text-2xl font-bold text-slate-400">IBDFam</span>
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
                Divórcio Litigioso: Quando Um Cônjuge Esconde Patrimônio
              </h2>
              <div className="space-y-4 text-slate-700">
                <p className="text-lg leading-relaxed">
                  <strong>Pesquisa de 2025 revela:</strong> quase 40% dos divórcios conflituosos envolvem patrimônio não declarado. A ocultação de bens prejudica a partilha justa e pode gerar processos de sobrepartilha que se arrastam por anos.
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <p className="font-semibold text-red-900 mb-2">Cenário comum:</p>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Cônjuge declara apenas 30% do patrimônio real na petição inicial</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Imóveis registrados em nome de parentes ou empresas "laranjas"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Transferências bancárias para contas offshore antes do divórcio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Empresas abertas durante o casamento não informadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>Criptomoedas e ativos digitais omitidos (difícil rastreio)</span>
                    </li>
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
                Investigação Patrimonial Forense: Identificação Total de Ativos
              </h2>
              <div className="space-y-4 text-slate-700">
                <p className="text-lg leading-relaxed">
                  Nossa investigação patrimonial forense combina <strong>15 camadas de análise</strong> — desde buscas em cartórios e juntas comerciais até rastreamento de contas offshore e criptomoedas — para mapear 100% do patrimônio oculto.
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <p className="font-semibold text-green-900 mb-2">O que identificamos:</p>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Imóveis:</strong> Registro de Imóveis (RIs) em todo Brasil, inclusive rurais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Empresas:</strong> Juntas Comerciais, vínculos societários, empresas "laranjas"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Veículos:</strong> DETRAN (todos os 27 estados), aeronaves (ANAC), embarcações (Marinha)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Contas bancárias:</strong> Rastreamento via requisição judicial (CCS/Bacen)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Criptomoedas:</strong> Análise blockchain (Bitcoin, Ethereum, stablecoins)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Offshore:</strong> Cruzamento com Panamá Papers, Paradise Papers (ICIJ)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15-LAYER METHODOLOGY */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Metodologia: 15 Camadas de Investigação Patrimonial
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Nossa investigação vai além do básico. Cruzamos dados de 15 fontes diferentes para identificar patrimônio oculto, vínculos com terceiros e movimentações atípicas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Home,
                title: '1. Imóveis (RIs)',
                desc: 'Registro de Imóveis em todos os cartórios do Brasil via CRI/CNJ',
                layer: 'Nacional'
              },
              {
                icon: Building2,
                title: '2. Empresas (Juntas)',
                desc: 'Quadro societário, alterações contratuais, empresas ativas/inativas',
                layer: 'Nacional'
              },
              {
                icon: Car,
                title: '3. Veículos (DETRAN)',
                desc: 'Frota de veículos, motos, caminhões (27 DETRANs + ANAC + Marinha)',
                layer: 'Nacional'
              },
              {
                icon: Briefcase,
                title: '4. Participações Societárias',
                desc: 'Sócios ocultos, holdings, empresas offshore registradas na Receita',
                layer: 'Avançado'
              },
              {
                icon: DollarSign,
                title: '5. Contas Bancárias (CCS)',
                desc: 'Sistema de Informações de Créditos do Bacen (via requisição judicial)',
                layer: 'Judicial'
              },
              {
                icon: FileText,
                title: '6. Declarações IR',
                desc: 'Análise de DIRPF (quando acessível judicialmente)',
                layer: 'Judicial'
              },
              {
                icon: Search,
                title: '7. Cartórios de Protesto',
                desc: 'Dívidas protestadas, inadimplências (pode indicar transferência de bens)',
                layer: 'Nacional'
              },
              {
                icon: Scale,
                title: '8. Processos Judiciais',
                desc: 'Ações cíveis, execuções fiscais, inventários (TJs, TRFs, TST)',
                layer: 'Nacional'
              },
              {
                icon: AlertCircle,
                title: '9. Diários Oficiais',
                desc: 'DOU, DOE, DOM: contratos, licitações, nomeações (indícios de renda)',
                layer: 'Nacional'
              },
              {
                icon: Users,
                title: '10. Vínculos com Terceiros',
                desc: 'Parentes, sócios, "laranjas" (CPFs relacionados)',
                layer: 'Avançado'
              },
              {
                icon: TrendingUp,
                title: '11. Movimentações Atípicas',
                desc: 'Transferências de bens 6-12 meses antes do divórcio (red flag)',
                layer: 'Forense'
              },
              {
                icon: Lock,
                title: '12. Criptomoedas',
                desc: 'Blockchain analysis: Bitcoin, Ethereum, stablecoins (Chainalysis)',
                layer: 'Forense'
              },
              {
                icon: Eye,
                title: '13. Contas Offshore',
                desc: 'Cruzamento com Panama Papers, Paradise Papers (ICIJ/OCCRP)',
                layer: 'Internacional'
              },
              {
                icon: Search,
                title: '14. OSINT (Redes Sociais)',
                desc: 'Instagram, LinkedIn, Facebook: indícios de padrão de vida incompatível',
                layer: 'Digital'
              },
              {
                icon: FileText,
                title: '15. Relatório Forense Final',
                desc: 'Laudo com cadeia de custódia, anexos probatórios, cronologia',
                layer: 'Entrega'
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-purple-600" />
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

      {/* RED FLAGS - When to Investigate */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              🚨 10 Red Flags: Quando Suspeitar de Ocultação de Patrimônio
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Sinais que indicam necessidade de investigação patrimonial aprofundada no divórcio:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {[
              {
                flag: '🚨 Padrão de vida incompatível com renda declarada',
                risk: 'Viagens internacionais, carros de luxo, mas declara "sem patrimônio"'
              },
              {
                flag: '🚨 Transferências bancárias 6-12 meses antes do divórcio',
                risk: 'Movimentações atípicas para contas de terceiros (parentes, sócios)'
              },
              {
                flag: '🚨 Empresas abertas durante o casamento não informadas',
                risk: 'Quadro societário omitido na petição inicial'
              },
              {
                flag: '🚨 Imóveis registrados em nome de parentes',
                risk: 'Pais, irmãos, tios como "proprietários" de bens adquiridos no casamento'
              },
              {
                flag: '🚨 Recusa em apresentar documentos financeiros',
                risk: 'Extratos bancários, declarações IR, contratos sociais "indisponíveis"'
              },
              {
                flag: '🚨 Controle exclusivo das finanças do casal',
                risk: 'Um cônjuge sem acesso a contas, investimentos, documentos'
              },
              {
                flag: '🚨 Alto volume de transações em dinheiro (cash)',
                risk: 'Saques recorrentes sem justificativa, evita transações rastreáveis'
              },
              {
                flag: '🚨 Subavaliação deliberada de bens',
                risk: 'Imóvel de R$ 2 Mi avaliado por R$ 800 mil, empresa lucrativa "sem valor"'
              },
              {
                flag: '🚨 Dívidas inflacionadas artificialmente',
                risk: 'Empréstimos "simulados" com familiares para reduzir patrimônio líquido'
              },
              {
                flag: '🚨 Menção a "investimentos no exterior" nunca detalhados',
                risk: 'Contas offshore, criptomoedas, fundos internacionais omitidos'
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-5 bg-red-50 border border-red-200 rounded-lg hover:shadow-md transition-shadow">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-slate-900 text-sm mb-1">{item.flag}</div>
                  <div className="text-xs text-slate-600 leading-relaxed">{item.risk}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Legal Consequences Box */}
          <div className="mt-12 bg-purple-50 border-l-4 border-purple-600 p-8 rounded-r-xl max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6" />
              Consequências Legais da Ocultação de Patrimônio
            </h3>
            <div className="space-y-3 text-sm text-purple-900">
              <div className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600" />
                <div>
                  <strong>Pena de Sonegados (Art. 1.992 CC):</strong> Perda do direito à meação sobre o bem ocultado. O cônjuge prejudicado recebe 100% do ativo omitido.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600" />
                <div>
                  <strong>Multa por Litigância de Má-fé (CPC 80-81):</strong> Multa de 1% a 10% sobre o valor da causa + indenização por danos.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600" />
                <div>
                  <strong>Crime de Fraude (Código Penal):</strong> Se houver uso de documentos falsos ou simulações, pode configurar crime contra a administração da Justiça.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-600" />
                <div>
                  <strong>Sobrepartilha (STJ REsp 1.820.250/SP):</strong> Ação de sobrepartilha pode ser ajuizada mesmo após trânsito em julgado, quando comprovada ocultação dolosa.
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
              Relatório forense digital com cadeia de custódia, pronto para juntar em petição judicial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: 'Relatório Executivo',
                items: [
                  'Resumo executivo (2-3 páginas)',
                  'Patrimônio identificado por categoria',
                  'Cronologia de transferências atípicas',
                  'Red flags e inconsistências',
                  'Estimativa de valor total oculto',
                ],
              },
              {
                icon: Search,
                title: 'Anexos Probatórios',
                items: [
                  'Prints de tela com hash SHA-256',
                  'Certidões de Registro de Imóveis',
                  'Contratos sociais (Juntas Comerciais)',
                  'Consultas DETRAN (veículos)',
                  'Diários Oficiais (DOU, DOE, DOM)',
                ],
              },
              {
                icon: Scale,
                title: 'Laudo Técnico Forense',
                items: [
                  'Metodologia detalhada (NBR ISO/IEC 27037)',
                  'Cadeia de custódia digital',
                  'Timestamps de todas as buscas',
                  'Assinatura digital do perito',
                  'Validade judicial plena (CPC 464-480)',
                ],
              },
            ].map((deliverable, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center mb-6">
                  <deliverable.icon className="w-7 h-7 text-purple-600" />
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
      <section className="py-20 bg-gradient-to-br from-purple-900 via-purple-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Garanta a Partilha Justa no Seu Divórcio
          </h2>
          <p className="text-xl text-purple-200 mb-8 leading-relaxed">
            A cada dia que passa, patrimônio oculto pode ser transferido ou dilapidado. <strong className="text-white">Solicite investigação patrimonial agora</strong> e proteja seus direitos.
          </p>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 text-left mb-6">
              <div>
                <div className="text-sm text-purple-300 mb-2">Investigação Básica</div>
                <div className="text-4xl font-bold mb-4">Consulte</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>10 camadas de investigação</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Prazo: 7 dias úteis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Escopo: Brasil (nacional)</span>
                  </li>
                </ul>
              </div>
              <div className="border-l border-white/20 pl-8">
                <div className="text-sm text-purple-300 mb-2">Investigação Avançada</div>
                <div className="text-4xl font-bold mb-4">Consulte</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>15 camadas (offshore + cripto)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Prazo: 14 dias úteis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Escopo: Brasil + Internacional</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-purple-50 text-lg px-8 py-6">
              <Shield className="w-5 h-5 mr-2" />
              Solicitar Orçamento
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
              Falar com Especialista
            </Button>
          </div>

          <p className="text-sm text-purple-300 mt-6">
            <Lock className="w-4 h-4 inline mr-1" />
            Consulta inicial sem compromisso • Sigilo total garantido
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
                q: 'A investigação patrimonial é legal? Posso usar as provas em juízo?',
                a: 'Sim. Nossa investigação utiliza exclusivamente fontes públicas e métodos lícitos, em conformidade com a LGPD e o CPC. O laudo forense possui cadeia de custódia digital (NBR ISO/IEC 27037) e validade judicial plena (CPC 464-480). Não realizamos invasão de sistemas, grampos ou violação de privacidade.',
              },
              {
                q: 'Quanto tempo demora a investigação?',
                a: 'Investigação Básica (10 camadas): 7 dias úteis. Investigação Avançada (15 camadas, com offshore e criptomoedas): 14 dias úteis. Em casos urgentes (medidas cautelares), podemos entregar relatório preliminar em 48-72h.',
              },
              {
                q: 'Vocês identificam contas bancárias e investimentos?',
                a: 'Diretamente, não — o sigilo bancário protege essas informações. Porém, fornecemos elementos para o advogado solicitar ao juiz a quebra de sigilo bancário via Sistema de Informações de Créditos (CCS/Bacen). Nossa investigação identifica indícios fortes (movimentações atípicas, padrão de vida incompatível) que fundamentam o pedido judicial.',
              },
              {
                q: 'E se o cônjuge transferiu bens para "laranjas" (testaferros)?',
                a: 'Nossa metodologia inclui análise de vínculos com terceiros (camada 10). Cruzamos CPFs de parentes, sócios e pessoas próximas para identificar imóveis, empresas e veículos registrados em nome de "laranjas". Documentamos essas transferências suspeitas no laudo forense.',
              },
              {
                q: 'Consigo investigar patrimônio no exterior (offshore)?',
                a: 'Sim, na Investigação Avançada. Cruzamos dados com Panama Papers, Paradise Papers e outros vazamentos do ICIJ/OCCRP. Para contas offshore ativas, orientamos o advogado a solicitar cooperação internacional via tratados (EUA: FATCA, Europa: CRS).',
              },
              {
                q: 'O cônjuge vai saber que está sendo investigado?',
                a: 'Não. Toda a investigação é sigilosa e utiliza apenas fontes públicas (cartórios, juntas comerciais, DETRAN). Não há contato com terceiros, vizinhos ou conhecidos. O cônjuge só tomará conhecimento quando o laudo for juntado aos autos judiciais pelo advogado.',
              },
              {
                q: 'Qual a diferença entre a investigação e uma perícia contábil?',
                a: 'Nossa investigação patrimonial é pré-processual ou para instrução probatória: identifica ativos ocultos. A perícia contábil judicial é determinada pelo juiz durante o processo para avaliar empresas, balanços, fluxo de caixa. São complementares: nossa investigação fornece os elementos; a perícia valora.',
              },
              {
                q: 'Posso solicitar antes de entrar com o divórcio?',
                a: 'Sim! Investigação pré-divórcio é estratégica. Mapear o patrimônio antes da petição inicial evita que o cônjuge tenha tempo de ocultar bens. O laudo pode ser usado como anexo na inicial ou guardado para eventual impugnação.',
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
            Não Deixe Patrimônio Oculto Prejudicar Sua Partilha
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Solicite investigação patrimonial forense agora e garanta a justiça no seu divórcio.
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white text-lg px-8 py-6">
            <Shield className="w-5 h-5 mr-2" />
            Solicitar Investigação Agora
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}
