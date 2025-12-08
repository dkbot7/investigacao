import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Shield, Users, FileCheck, AlertTriangle, TrendingUp, ArrowRight, Download, Play } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Investigação para RH e Compliance | Background Check Profissional | Investigaree',
  description: 'Soluções de background check e due diligence para departamentos de RH e Compliance. Valide candidatos, mitigue riscos e contrate com segurança. Conformidade total com LGPD.',
  openGraph: {
    title: 'Investigação para RH e Compliance | Investigaree',
    description: 'Background check profissional para RH. Valide candidatos e mitigue riscos de contratação com dados oficiais.',
    images: ['/images/solutions/rh-compliance-og.jpg'],
  },
}

export default function RHCompliancePage() {
  return (
    <div className="min-h-screen">
      {/* HERO SECTION - One Hero, One Hook Layout (2025 Trend) */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: Copy */}
            <div className="space-y-8">
              {/* Eyebrow (Trust Badge) */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Conformidade 100% LGPD</span>
              </div>

              {/* Hero Headline (Bold, Large) */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Contrate com <span className="text-blue-400">Segurança</span>.
                <br />
                Evite Fraudes no RH.
              </h1>

              {/* Subheadline */}
              <p className="text-xl text-slate-300 leading-relaxed">
                <strong className="text-white">61% dos profissionais de RH encontram imprecisões em currículos</strong> após background check (SHRM, 2024). Nossa solução valida identidade, antecedentes e histórico em fontes oficiais — antes da contratação.
              </p>

              {/* Key Benefits (3 bullets) */}
              <div className="space-y-3">
                {[
                  'Background check em fontes públicas governamentais (CPF, CNPJ, CEIS, Tribunais, Diários Oficiais)',
                  'Identificação de red flags críticos (CPF suspenso, sanções, processos ocultos)',
                  'Relatórios periciais com valor probatório em juízo (conformidade LGPD)',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Primary CTA (Above the Fold) */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 shadow-lg shadow-blue-500/30">
                  <Users className="w-5 h-5 mr-2" />
                  Solicitar Demonstração
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-slate-400 text-white hover:bg-white/10 text-lg px-8 py-6">
                  <Download className="w-5 h-5 mr-2" />
                  Baixar Checklist Grátis
                </Button>
              </div>

              {/* Social Proof Micro */}
              <div className="flex items-center gap-6 pt-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900"></div>
                    ))}
                  </div>
                  <span>+50 empresas confiam</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span>98% de precisão</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual (Video/Image) */}
            <div className="relative">
              {/* Placeholder for video or hero image */}
              <div className="relative aspect-[4/3] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-blue-600 rounded-full flex items-center justify-center">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <p className="text-slate-300 text-sm">Veja como funciona (2 min)</p>
                  </div>
                </div>
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl">
                <div className="text-sm text-slate-600">Fraudes Evitadas</div>
                <div className="text-3xl font-bold text-slate-900">127</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-green-500 p-4 rounded-lg shadow-xl text-white">
                <div className="text-sm">Tempo Médio</div>
                <div className="text-3xl font-bold">24h</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF SECTION */}
      <section className="py-12 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-600 mb-6">Empresas que confiam na Investigaree</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
            {/* Logo placeholders - replace with actual client logos */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-32 h-12 bg-slate-300 rounded"></div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM-SOLUTION SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                ⚠️ Problema
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                Contratações Ruins Custam Caro
              </h2>
              <div className="space-y-4 text-slate-600">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-slate-900">61% dos profissionais de RH encontram imprecisões em currículos</strong> após background check (SHRM, 2024)
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-slate-900">Custo de uma má contratação:</strong> até 40% do salário anual (SHRM, 2024) — demissão, recontratação, treinamento, produtividade perdida
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <strong className="text-slate-900">Riscos jurídicos e reputacionais:</strong> contratar pessoa com CPF suspenso, sanções ou antecedentes graves
                  </div>
                </div>
              </div>

              {/* Real Case Highlight */}
              <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-sm font-semibold text-red-900 mb-2">Caso Real:</p>
                <p className="text-sm text-red-800">
                  "Empresa de tecnologia contratou gerente financeiro com CPF de pessoa <strong>falecida há 5 anos</strong>. Ele desviou <strong>R$ 2,3 milhões</strong> antes de ser descoberto."
                </p>
              </div>
            </div>

            {/* Solution */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                ✅ Solução
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                Background Check Profissional em 10 Fontes Oficiais
              </h2>
              <p className="text-lg text-slate-600">
                Nossa metodologia forense valida <strong>100% dos dados</strong> em fontes oficiais do governo brasileiro antes da contratação:
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Shield, title: 'CPF/CNPJ', desc: 'Situação cadastral Receita Federal' },
                  { icon: AlertTriangle, title: 'CEIS/CNEP', desc: 'Sanções e inidoneidade (CGU)' },
                  { icon: FileCheck, title: 'Tribunais', desc: 'Processos judiciais (PJe, DJEN)' },
                  { icon: Users, title: 'INSS/CNIS', desc: 'Vínculos empregatícios reais' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <item.icon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-sm text-slate-600">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-sm font-semibold text-green-900 mb-2">Resultado:</p>
                <p className="text-sm text-green-800">
                  Background check de executivo revelou <strong>CPF Suspenso + R$ 15 milhões de dívida fiscal</strong>. Contratação bloqueada. <strong>Prejuízo evitado: estimado em R$ 5 milhões.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Como Funciona o Background Check
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Processo simples, rápido e 100% legal (conformidade LGPD)
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Você envia os dados', desc: 'Nome completo, CPF, data de nascimento do candidato', time: '2 min' },
              { step: '2', title: 'Consultamos 10 fontes', desc: 'CPF, CNPJ, CEIS, Tribunais, INSS, Protestos, Diários Oficiais, OSINT', time: '24h' },
              { step: '3', title: 'Análise pericial', desc: 'Perito criminal analisa red flags e cruza dados', time: '2h' },
              { step: '4', title: 'Relatório completo', desc: 'Você recebe relatório com parecer final (aprovar/reprovar)', time: 'Imediato' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-slate-300"></div>
                )}
                <div className="relative bg-white p-6 rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{item.desc}</p>
                  <div className="text-xs text-blue-600 font-semibold">⏱️ {item.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Solicitar Background Check Agora
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* FEATURES / BENEFITS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Por Que Escolher a Investigaree?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: '100% Conformidade LGPD',
                desc: 'Todas as consultas em bases legais da LGPD (Art. 7º). Dados públicos e manifestamente acessíveis. Relatórios com fundamentação legal.',
              },
              {
                icon: FileCheck,
                title: 'Valor Probatório em Juízo',
                desc: 'Relatórios assinados por perito criminal com registro profissional. Aceitos como prova em processos trabalhistas, cíveis e administrativos.',
              },
              {
                icon: TrendingUp,
                title: '98% de Precisão',
                desc: 'Dados cruzados de 10 fontes oficiais (Receita, CGU, CNJ, INSS). Metodologia forense testada em +500 investigações.',
              },
              {
                icon: Users,
                title: 'Equipe Especializada',
                desc: 'Peritos criminais, investigadores e advogados especializados em background check, due diligence e compliance.',
              },
              {
                icon: AlertTriangle,
                title: 'Identificação de Red Flags',
                desc: 'CPF suspenso, sanções CEIS, processos ocultos, divergências curriculares, vínculos com criminosos — tudo identificado automaticamente.',
              },
              {
                icon: CheckCircle2,
                title: 'Relatórios em 24-48h',
                desc: 'Background check completo entregue em 24-48h úteis. Casos urgentes: express em 12h (mediante consulta).',
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-6 border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / CTA SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Evite Contratações de Risco. Proteja Sua Empresa.
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Solicite uma demonstração gratuita ou inicie seu primeiro background check agora.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-slate-100 text-lg px-8 py-6">
              <Users className="w-5 h-5 mr-2" />
              Solicitar Demonstração Gratuita
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              <Download className="w-5 h-5 mr-2" />
              Baixar Checklist Background Check (PDF)
            </Button>
          </div>

          <p className="text-sm text-slate-400 mt-8">
            Sem compromisso. Resposta em até 2h úteis.
          </p>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'O background check é legal segundo a LGPD?',
                a: 'Sim, 100% legal. Utilizamos apenas dados públicos e manifestamente acessíveis, com base legal no Art. 7º da LGPD (legítimo interesse, proteção ao crédito, exercício de direitos). Todos os relatórios incluem fundamentação legal completa.',
              },
              {
                q: 'Preciso de autorização do candidato?',
                a: 'Para dados públicos (CPF, CEIS, Tribunais), não é necessário consentimento. Para dados sensíveis como CNIS (INSS), exigimos autorização por escrito do candidato ou ordem judicial.',
              },
              {
                q: 'Quanto tempo leva?',
                a: 'Background check completo: 24-48h úteis. Express (casos urgentes): 12h mediante consulta.',
              },
              {
                q: 'O que acontece se identificarem red flags?',
                a: 'Você recebe relatório detalhado com todos os red flags identificados, gravidade de cada um e parecer final (aprovar com ressalvas, reprovar ou solicitar esclarecimentos). A decisão final é sempre sua.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="group border border-slate-200 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <summary className="cursor-pointer font-semibold text-slate-900 flex justify-between items-center">
                  {faq.q}
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
