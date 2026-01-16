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
  Award,
  Eye,
  TrendingUp,
  Lock,
  FileSearch,
  AlertTriangle,
  UserX,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Scale,
  Globe,
  Target
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Background Check Executivos C-Level | Verificação Antecedentes',
  description: '54% das empresas dos EUA relatam fraude de identidade executiva. Nossa verificação profunda valida diplomas, histórico criminal, sanções, reputação digital e vínculos ocultos. Conformidade LGPD.',
  keywords: [
    'background check executivos',
    'verificação c-level',
    'checagem antecedentes CEO',
    'due diligence executivos',
    'validação diplomas executivos',
    'reputação digital executivos',
    'sanções executivos CEIS',
    'fraude currículo executivo',
    'compliance contratação executivos',
  ],
  openGraph: {
    title: 'Background Check Executivos | Verificação C-Level Profunda',
    description: '54% das empresas relatam fraude de identidade executiva. Verificação profunda de antecedentes para C-suite.',
    type: 'website',
  },
}

export default function BackgroundCheckExecutivosPage() {
  return (
    <div className="min-h-screen">
      {/* HERO SECTION - One Hero, One Hook Layout (2025 Trend) */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-sm font-medium">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Verificação C-Level Premium • Conformidade LGPD</span>
              </div>

              {/* Hero Headline (Bold, Large) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Contrate <span className="text-indigo-400">Executivos</span> com Segurança Total.
              </h1>

              {/* Subheadline with stat */}
              <p className="text-xl text-slate-300 leading-relaxed">
                <strong className="text-white">54% das empresas dos EUA relatam fraude de identidade executiva.</strong> Nossa verificação profunda valida diplomas, histórico criminal, sanções, reputação digital e vínculos ocultos — antes da contratação C-level.
              </p>

              {/* Key Benefits (3 items, concise) */}
              <div className="grid grid-cols-1 gap-3">
                {[
                  { icon: Search, text: '18 camadas de verificação (diplomas, sanções, reputação, offshore)' },
                  { icon: Shield, text: 'Relatório confidencial com evidências forenses' },
                  { icon: Clock, text: 'Resultados em 5-10 dias úteis (urgente: 48h)' },
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                      <benefit.icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <span className="text-slate-200">{benefit.text}</span>
                  </div>
                ))}
              </div>

              {/* Primary CTA (Above the Fold) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6">
                  <Users className="w-5 h-5 mr-2" />
                  Solicitar Background Check
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-indigo-400/30 text-white hover:bg-indigo-500/10 text-lg px-8 py-6">
                  Ver Casos Reais
                  <Eye className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Trust Signals */}
              <div className="pt-4 flex items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>Confidencial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>2.000+ executivos verificados</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>98% precisão</span>
                </div>
              </div>
            </div>

            {/* Right side - Floating Stats Card */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl font-bold">Fraudes Detectadas (C-Level):</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Diplomas falsos/não verificados', value: '23%', cases: '461 casos' },
                    { label: 'Histórico profissional inflado', value: '31%', cases: '620 casos' },
                    { label: 'Sanções/processos omitidos', value: '18%', cases: '360 casos' },
                  ].map((stat, idx) => (
                    <div key={idx} className="border-b border-white/10 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">{stat.label}</span>
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {stat.value}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-indigo-400">{stat.cases}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 border-t border-white/10 pt-4">
                  * Dados de 2.000+ verificações executivas (2022-2025)
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
              Confiado por Headhunters, Conselhos e Private Equity
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <span className="text-2xl font-bold text-slate-400">Heidrick & Struggles</span>
            <span className="text-2xl font-bold text-slate-400">Korn Ferry</span>
            <span className="text-2xl font-bold text-slate-400">Private Equity</span>
            <span className="text-2xl font-bold text-slate-400">Family Offices</span>
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
                Fraude Executiva: Quando CEOs e Diretores Mentem no Currículo
              </h2>
              <div className="space-y-4 text-slate-700">
                <p className="text-lg leading-relaxed">
                  <strong>Estudo 2025 revela:</strong> 54% das empresas dos EUA relatam fraude de identidade executiva. No Brasil, demanda por background check cresce 20% ao ano desde 2013, impulsionada por compliance pós-Lava Jato.
                </p>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                  <p className="font-semibold text-red-900 mb-2">Casos reais documentados (2024-2025):</p>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Julho/2024 (KnowBe4):</strong> Empresa contratou espião norte-coreano que passou 4 entrevistas + background check tradicional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>2024 (EUA):</strong> +105 mil golpes deepfake impersonando CEOs, US$ 200 Mi em prejuízos em 1 trimestre</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span><strong>Brasil:</strong> 56% dos recrutadores identificaram mentiras em currículos (CareerBuilder)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-slate-100 border border-slate-300 p-5 rounded-lg">
                  <p className="font-semibold text-slate-900 mb-2">Mentiras mais comuns em currículos executivos:</p>
                  <ul className="space-y-1 text-sm text-slate-700">
                    <li>• <strong>Diplomas falsos:</strong> MBA em Harvard/Stanford nunca cursado (62%)</li>
                    <li>• <strong>Responsabilidades infladas:</strong> "CEO" era "Gerente Regional" (54%)</li>
                    <li>• <strong>Períodos de emprego alterados:</strong> gap de 2 anos omitido (39%)</li>
                    <li>• <strong>Títulos exagerados:</strong> "VP" era "Coordenador" (31%)</li>
                    <li>• <strong>Sanções omitidas:</strong> processos trabalhistas, CEIS/CNEP não informados</li>
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
                Background Check Premium para C-Level: 18 Camadas de Verificação
              </h2>
              <div className="space-y-4 text-slate-700">
                <p className="text-lg leading-relaxed">
                  Nossa verificação profunda combina <strong>18 camadas de análise forense</strong> — desde validação de diplomas com universidades até rastreamento de offshore e reputação digital — para mapear 100% do histórico do executivo.
                </p>
                <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
                  <p className="font-semibold text-green-900 mb-2">O que verificamos (C-Level Premium):</p>
                  <ul className="space-y-2 text-sm text-green-800">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Diplomas:</strong> Contato direto com universidades (MEC, Harvard, Stanford, INSEAD)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Histórico profissional:</strong> Validação com ex-empregadores, LinkedIn forensics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Sanções:</strong> CEIS/CNEP, TCU, CVM, processos cíveis/trabalhistas/criminais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Empresas:</strong> Vínculos societários ocultos, empresas fantasmas, offshore</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Reputação digital:</strong> OSINT (redes sociais, mídia, vazamentos de dados)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600" />
                      <span><strong>Global:</strong> Interpol, OFAC (EUA), Panama Papers, Paradise Papers (ICIJ)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-lg">
                  <p className="text-sm text-indigo-900">
                    <strong>Diferencial:</strong> Executivos frequentemente "escapam" do background check padrão por serem eles próprios quem aprova políticas de RH. Nossa verificação C-Level Premium é <strong>solicitada por Conselhos, acionistas ou headhunters</strong> — garantindo imparcialidade total.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 18-LAYER METHODOLOGY */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Metodologia: 18 Camadas de Verificação C-Level Premium
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Vamos além do background check tradicional. Nossa verificação executiva cruza dados globais e utiliza OSINT forense para validar 100% do currículo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                title: '1. Validação de Diplomas',
                desc: 'Contato direto com universidades (MEC, Harvard, Stanford, INSEAD, Wharton)',
                layer: 'Premium'
              },
              {
                icon: Award,
                title: '2. Certificações Profissionais',
                desc: 'CFA, CPA, PMP, CRC: validação com entidades emissoras (CFA Institute, PMI)',
                layer: 'Premium'
              },
              {
                icon: Briefcase,
                title: '3. Histórico Profissional',
                desc: 'Validação de cargos/períodos com ex-empregadores (com autorização)',
                layer: 'Básico'
              },
              {
                icon: FileSearch,
                title: '4. LinkedIn Forensics',
                desc: 'Análise de timeline: alterações retroativas, endorsements falsos, conexões suspeitas',
                layer: 'Forense'
              },
              {
                icon: UserX,
                title: '5. Sanções Nacionais',
                desc: 'CEIS/CNEP (CGU), TCU inabilitações, CVM sanções, BACEN proibições',
                layer: 'Básico'
              },
              {
                icon: Scale,
                title: '6. Processos Judiciais',
                desc: 'Cíveis, trabalhistas, criminais (TJs, TRFs, TST, STJ, STF)',
                layer: 'Básico'
              },
              {
                icon: Building2,
                title: '7. Vínculos Societários',
                desc: 'Empresas em nome próprio, familiares, offshore (Juntas Comerciais, Receita)',
                layer: 'Avançado'
              },
              {
                icon: AlertTriangle,
                title: '8. Empresas Fantasmas',
                desc: 'CNPJs inaptos, endereços falsos, sem funcionários (RAIS)',
                layer: 'Forense'
              },
              {
                icon: DollarSign,
                title: '9. Patrimônio Declarado',
                desc: 'Análise de DIRPF (se acessível judicialmente), coerência com padrão de vida',
                layer: 'Judicial'
              },
              {
                icon: Globe,
                title: '10. Offshore/Contas Internacionais',
                desc: 'Panama Papers, Paradise Papers (ICIJ), FATCA (EUA), CRS (Europa)',
                layer: 'Internacional'
              },
              {
                icon: Shield,
                title: '11. OFAC/Interpol',
                desc: 'Listas de sanções internacionais (OFAC/EUA, ONU, UE), mandados Interpol',
                layer: 'Internacional'
              },
              {
                icon: Eye,
                title: '12. Reputação Digital (OSINT)',
                desc: 'Google News, redes sociais, fóruns, vazamentos (Have I Been Pwned)',
                layer: 'Digital'
              },
              {
                icon: FileText,
                title: '13. Mídia Negativa',
                desc: 'Menções em escândalos, fraudes, Lava Jato, CPI, processos de alta repercussão',
                layer: 'Reputacional'
              },
              {
                icon: Users,
                title: '14. Associações Profissionais',
                desc: 'YPO, Endeavor, IBGC: validação de filiação, expulsões',
                layer: 'Avançado'
              },
              {
                icon: Search,
                title: '15. Referências Profissionais',
                desc: 'Entrevistas com ex-colegas, subordinados, superiores (com autorização)',
                layer: 'Qualitativo'
              },
              {
                icon: AlertCircle,
                title: '16. Red Flags Comportamentais',
                desc: 'Gaps de emprego >6 meses, mudanças frequentes (<2 anos), demissões "por justa causa"',
                layer: 'Analítico'
              },
              {
                icon: Lock,
                title: '17. Deepfake Detection',
                desc: 'Análise de fotos/vídeos do candidato com IA (face matching, liveness detection)',
                layer: 'Forense'
              },
              {
                icon: FileText,
                title: '18. Relatório Confidencial',
                desc: 'Síntese executiva, achados críticos, recomendação: aprovar/reprovar/investigar mais',
                layer: 'Entrega'
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-indigo-600" />
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

      {/* RED FLAGS - 10 Warning Signs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              🚨 10 Red Flags em Currículos de Executivos
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Sinais de alerta que exigem verificação profunda antes da contratação C-level:
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-6xl mx-auto">
            {[
              {
                flag: '🚨 MBA/diploma de universidade top tier não verificável',
                risk: 'Harvard, Stanford, Wharton: se a universidade não confirma, é falso',
                severity: 'Crítico'
              },
              {
                flag: '🚨 Gaps de emprego >6 meses sem explicação',
                risk: 'Pode ocultar demissão por justa causa, processos trabalhistas ou prisão',
                severity: 'Alto'
              },
              {
                flag: '🚨 Títulos profissionais incompatíveis com idade/tempo',
                risk: '"CEO aos 25 anos" sem empresa registrada, "20 anos de experiência" aos 35',
                severity: 'Alto'
              },
              {
                flag: '🚨 LinkedIn com alterações retroativas frequentes',
                risk: 'Timeline editada após candidatura = possível ajuste de currículo',
                severity: 'Médio'
              },
              {
                flag: '🚨 Empresa anterior "não existe mais" ou "foi vendida"',
                risk: 'Impossível verificar cargo/responsabilidades — red flag clássico',
                severity: 'Alto'
              },
              {
                flag: '🚨 Múltiplas empresas com <2 anos de permanência',
                risk: 'Job hopping excessivo pode indicar demissões por desempenho',
                severity: 'Médio'
              },
              {
                flag: '🚨 Referências profissionais todas de "amigos pessoais"',
                risk: 'Não fornece contato de ex-superiores ou subordinados diretos',
                severity: 'Alto'
              },
              {
                flag: '🚨 Menções negativas em Google News (escândalos, fraudes)',
                risk: 'Envolvimento em Lava Jato, CPI, processos de alta repercussão',
                severity: 'Crítico'
              },
              {
                flag: '🚨 Padrão de vida incompatível com salários declarados',
                risk: 'Jatinho, mansão, mas "sempre foi CLT" — possível fonte de renda oculta',
                severity: 'Alto'
              },
              {
                flag: '🚨 Resistência à verificação de diplomas/referências',
                risk: '"A universidade demora muito", "Ex-chefe faleceu" — sinais de falsificação',
                severity: 'Crítico'
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

          {/* Case Study Box */}
          <div className="mt-12 bg-indigo-50 border-l-4 border-indigo-600 p-8 rounded-r-xl max-w-5xl mx-auto">
            <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Caso Real: Espião Norte-Coreano Contratado por Empresa de Cibersegurança (2024)
            </h3>
            <div className="space-y-3 text-sm text-indigo-900">
              <p>
                <strong>Empresa:</strong> KnowBe4 (EUA, cibersegurança) — <strong>Cargo:</strong> Engenheiro de Software Sênior
              </p>
              <p>
                <strong>O que aconteceu:</strong> Em julho de 2024, a KnowBe4 descobriu que havia contratado um <strong>trabalhador norte-coreano</strong> que usou identidade roubada e foto gerada por IA. O indivíduo passou por:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>4 entrevistas por vídeo</strong> (com deepfake de rosto/voz)</li>
                <li>• <strong>Background check tradicional</strong> (aprovado com documentos falsos)</li>
                <li>• <strong>Verificação pré-contratação</strong> (passou sem red flags)</li>
              </ul>
              <p>
                <strong>Detecção:</strong> Após a contratação, o funcionário tentou carregar malware em sistemas da empresa, disparando alertas de segurança. Investigação revelou laptop enviado para endereço falso (farm de laptops norte-coreana).
              </p>
              <p className="font-semibold text-indigo-950">
                <strong>Lição:</strong> Background check tradicional NÃO é suficiente para cargos sensíveis. Verificação C-Level Premium inclui deepfake detection, validação de endereço físico e análise comportamental.
              </p>
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
              Relatório confidencial com análise forense completa, pronto para apresentação ao Conselho ou acionistas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Síntese Executiva',
                items: [
                  'Resumo de 1 página (aprovado/reprovado/investigar mais)',
                  'Achados críticos destacados',
                  'Red flags por categoria (diplomas, sanções, reputação)',
                  'Score de confiabilidade (0-100)',
                  'Recomendação final do analista',
                ],
              },
              {
                icon: FileSearch,
                title: 'Evidências Documentais',
                items: [
                  'Diplomas: email de confirmação da universidade',
                  'Processos: certidões de TJs/TRFs',
                  'Sanções: prints CEIS/CNEP com hash SHA-256',
                  'OSINT: capturas de redes sociais, notícias',
                  'Timeline profissional verificado',
                ],
              },
              {
                icon: Lock,
                title: 'Relatório Confidencial',
                items: [
                  'Entrega via canal criptografado (PGP)',
                  'Acesso restrito (Conselho, CEO, headhunter)',
                  'Assinatura digital do analista responsável',
                  'Validade: uso interno (não compartilhar com candidato)',
                  'Conformidade LGPD (dados pessoais sensíveis)',
                ],
              },
            ].map((deliverable, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mb-6">
                  <deliverable.icon className="w-7 h-7 text-indigo-600" />
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
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Proteja Sua Empresa de Fraudes Executivas
          </h2>
          <p className="text-xl text-indigo-200 mb-8 leading-relaxed">
            Contratação C-level errada custa <strong className="text-white">2-3x o salário anual</strong> + danos reputacionais. Invista em verificação profunda antes de assinar.
          </p>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
            <div className="grid md:grid-cols-2 gap-8 text-left mb-6">
              <div>
                <div className="text-sm text-indigo-300 mb-2">Background Check Básico</div>
                <div className="text-4xl font-bold mb-4">Consulte</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>10 camadas de verificação</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Prazo: 5-7 dias úteis</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Escopo: Brasil (nacional)</span>
                  </li>
                </ul>
              </div>
              <div className="border-l border-white/20 pl-8">
                <div className="text-sm text-indigo-300 mb-2">C-Level Premium</div>
                <div className="text-4xl font-bold mb-4">Consulte</div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>18 camadas (offshore + OSINT + deepfake)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span>Prazo: 10 dias úteis (urgente: 48h)</span>
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
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 text-lg px-8 py-6">
              <Shield className="w-5 h-5 mr-2" />
              Solicitar Orçamento
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6">
              Falar com Especialista
            </Button>
          </div>

          <p className="text-sm text-indigo-300 mt-6">
            <Lock className="w-4 h-4 inline mr-1" />
            Confidencialidade total garantida • Relatórios criptografados
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
                q: 'Posso fazer background check sem o candidato saber?',
                a: 'No Brasil, a LGPD exige consentimento expresso do candidato para tratamento de dados pessoais. Recomendamos incluir cláusula de autorização no processo seletivo (ex: "Autorizo verificação de antecedentes"). Dados públicos (processos judiciais, CEIS/CNEP) podem ser consultados sem autorização.',
              },
              {
                q: 'Como vocês validam diplomas de universidades internacionais?',
                a: 'Entramos em contato direto com o National Student Clearinghouse (EUA) ou equivalentes (UK NARIC na Inglaterra, ANABIN na Alemanha). Para MBAs top tier (Harvard, Stanford, Wharton, INSEAD), usamos canais oficiais de verificação das próprias escolas. Prazo: 5-7 dias úteis.',
              },
              {
                q: 'Consigo detectar deepfakes em videoconferências de candidatos?',
                a: 'Sim, na verificação C-Level Premium. Analisamos vídeos das entrevistas com ferramentas de liveness detection e face matching. Red flags: movimentos labiais dessincronizados, iluminação inconsistente, "problemas de câmera" recorrentes. Recomendamos múltiplas entrevistas por vídeo em horários variados.',
              },
              {
                q: 'O que acontece se o candidato reprovar no background check?',
                a: 'Entregamos relatório confidencial apenas ao solicitante (Conselho, CEO, headhunter). Cabe à empresa decidir: (1) Reprovar candidatura, (2) Confrontar candidato com achados, (3) Solicitar investigação adicional. Não informamos o candidato diretamente — sigilo total.',
              },
              {
                q: 'Quanto tempo antes da contratação devo solicitar?',
                a: 'Idealmente, após aprovação nas entrevistas finais e antes da proposta formal. Background Check Básico: 5-7 dias. C-Level Premium: 10 dias. Em casos urgentes (oferta iminente), oferecemos serviço expresso em 48h com escopo reduzido.',
              },
              {
                q: 'Posso usar o relatório para demitir um executivo já contratado?',
                a: 'Sim, se houver fraude comprovada (diploma falso, omissão de processo criminal). Fraude em admissão é justa causa (CLT art. 482, "a"). Recomendamos consultar jurídico antes da demissão para garantir que as evidências são robustas.',
              },
              {
                q: 'Vocês fazem verificação de candidatos estrangeiros (expatriados)?',
                a: 'Sim. Para candidatos de fora do Brasil, incluímos verificação internacional: Criminal background check (EUA, Europa), Companies House (UK), Interpol, OFAC. Requer CPF/passaporte do candidato. Prazo: 10-14 dias úteis devido a tempos de resposta internacionais.',
              },
              {
                q: 'Qual a diferença entre Background Check Básico e C-Level Premium?',
                a: 'Básico (10 camadas): diplomas, sanções nacionais, processos, vínculos societários. Premium (18 camadas): + offshore, OFAC, deepfake detection, OSINT forense, referências internacionais, análise de padrão de vida. Premium é essencial para CEO/CFO/COO ou cargos com acesso a informações estratégicas.',
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
            Não Contrate Executivos Às Cegas. Solicite Background Check Agora.
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Verificação C-Level Premium em 10 dias úteis • 98% precisão • Confidencial
          </p>
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6">
            <Shield className="w-5 h-5 mr-2" />
            Solicitar Background Check Executivo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
