import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Building2, Shield, FileSearch, AlertCircle, TrendingDown, CheckCircle2, ArrowRight, Download, BarChart3, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Due Diligence Empresarial | Investigação de Empresas e Sócios | Investigaree',
  description: 'Due diligence completa para fusões, aquisições e parcerias comerciais. Valide CNPJ, sócios, sanções, processos e riscos ocultos. Relatórios periciais em 48h.',
  openGraph: {
    title: 'Due Diligence Empresarial | Investigaree',
    description: 'Valide empresas antes de fechar negócios. Identifique riscos ocultos, sócios sancionados e passivos trabalhistas.',
    images: ['/images/solutions/due-diligence-og.jpg'],
  },
}

export default function DueDiligencePage() {
  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-sm font-medium">
                <FileSearch className="w-4 h-4 text-indigo-400" />
                <span>Due Diligence Forense</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Negocie com <span className="text-indigo-400">Inteligência</span>.
                <br />
                Evite Prejuízos Milionários.
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed">
                <strong className="text-white">42% das fusões e aquisições revelam passivos ocultos.</strong> Nossa due diligence forense identifica riscos críticos em empresas, sócios e contratos antes de você fechar negócio.
              </p>

              <div className="space-y-3">
                {[
                  'Validação completa: CNPJ, quadro de sócios, sanções CEIS/CNEP, processos judiciais',
                  'Identificação de red flags: empresas laranjas, sócios sancionados, passivos trabalhistas',
                  'Relatórios periciais em 48-72h com análise de risco e recomendações estratégicas',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-6 shadow-lg shadow-indigo-500/30">
                  <Building2 className="w-5 h-5 mr-2" />
                  Solicitar Due Diligence
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-slate-400 text-white hover:bg-white/10 text-lg px-8 py-6">
                  <Download className="w-5 h-5 mr-2" />
                  Checklist DD Grátis
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  <span>+200 M&A analisados</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span>R$ 87Mi em prejuízos evitados</span>
                </div>
              </div>
            </div>

            {/* Right Column Visual */}
            <div className="relative">
              <div className="relative aspect-[4/3] bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 p-8">
                {/* Simulated Dashboard */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <div>
                      <div className="text-xs text-red-300">🚨 Red Flag Crítico</div>
                      <div className="font-bold text-white">Sócio sancionado CEIS</div>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <div>
                      <div className="text-xs text-yellow-300">⚠️ Atenção</div>
                      <div className="font-bold text-white">87 processos trabalhistas</div>
                    </div>
                    <AlertCircle className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <div>
                      <div className="text-xs text-green-300">✅ OK</div>
                      <div className="font-bold text-white">CNPJ Regular</div>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl">
                <div className="text-sm text-slate-600">Tempo Médio</div>
                <div className="text-3xl font-bold text-slate-900">48h</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT IS DUE DILIGENCE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              O Que é Due Diligence Empresarial?
            </h2>
            <p className="text-xl text-slate-600">
              Due diligence (devida diligência) é o processo de <strong>investigação aprofundada de uma empresa</strong> antes de fusões, aquisições, parcerias, investimentos ou contratações de grande porte.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Quando Fazer?',
                items: [
                  'Antes de adquirir ou se fundir com outra empresa',
                  'Antes de receber investimento ou investir em startup',
                  'Antes de firmar parcerias comerciais estratégicas',
                  'Antes de grandes licitações ou contratos governamentais',
                ],
              },
              {
                title: 'O Que Investigamos?',
                items: [
                  'Situação cadastral do CNPJ (Regular, Inapta, Suspensa)',
                  'Quadro de sócios: CPFs, sanções, vínculos',
                  'Processos judiciais (cíveis, trabalhistas, criminais)',
                  'Protestos, dívidas fiscais, certidões negativas',
                ],
              },
              {
                title: 'Por Que Fazer?',
                items: [
                  'Evitar aquisição de passivos ocultos (trabalhistas, fiscais)',
                  'Identificar fraudes, empresas laranjas, sócios fantasmas',
                  'Avaliar riscos reputacionais e jurídicos',
                  'Negociar preço justo baseado em riscos reais',
                ],
              },
            ].map((col, idx) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{col.title}</h3>
                <ul className="space-y-2">
                  {col.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM-SOLUTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Problem */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                ⚠️ Riscos Sem Due Diligence
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Passivos Ocultos Podem Destruir Negócios
              </h2>

              <div className="space-y-4">
                {[
                  {
                    title: 'Passivo Trabalhista Oculto',
                    desc: 'Empresa tinha 87 processos trabalhistas não declarados. Após aquisição, novo dono descobriu passivo de **R$ 12 milhões**. Preço da aquisição deveria ter sido 40% menor.',
                    color: 'red',
                  },
                  {
                    title: 'Sócio Sancionado (CEIS)',
                    desc: 'Sócio minoritário (5%) estava no CEIS. Empresa estava **impedida de contratar com governo** por 5 anos. Contrato de R$ 8 milhões anulado.',
                    color: 'red',
                  },
                  {
                    title: 'CNPJ Inapto (Empresa Fantasma)',
                    desc: 'Empresa "ativa" tinha CNPJ **Inapto** há 3 anos (omissão de declarações). Após investimento de R$ 5 milhões, descobriu-se que era empresa de fachada.',
                    color: 'red',
                  },
                ].map((risk, idx) => (
                  <div key={idx} className="p-5 bg-white border-l-4 border-red-500 rounded-r-lg shadow-sm">
                    <div className="font-bold text-slate-900 mb-1">{risk.title}</div>
                    <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: risk.desc }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                ✅ Nossa Solução
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                Due Diligence Forense em 12 Camadas
              </h2>

              <p className="text-slate-600">
                Nossa metodologia investiga <strong>12 camadas de risco</strong> em fontes oficiais:
              </p>

              <div className="space-y-3">
                {[
                  '1. CNPJ: Situação cadastral, data de abertura, capital social',
                  '2. Quadro de Sócios: CPFs, sanções, vínculos com outros CNPJs',
                  '3. CEIS/CNEP: Sanções federais, estaduais, municipais',
                  '4. Processos Judiciais: Cíveis, trabalhistas, criminais (TJ, TRF, TST)',
                  '5. Protestos: Cartórios de protesto, valores, credores',
                  '6. Certidões Negativas: Federal, estadual, municipal, FGTS, trabalhista',
                  '7. Juntas Comerciais: Alterações contratuais, histórico societário',
                  '8. Diários Oficiais: DOU, DOE, DOM (contratos, licitações, sanções)',
                  '9. DETRAN: Frota de veículos registrada',
                  '10. Imóveis: Registro de Imóveis (se acessível)',
                  '11. OSINT: Redes sociais de sócios, reputação online',
                  '12. Cruzamento de Dados: Identificação de vínculos ocultos',
                ].map((layer, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{layer}</span>
                  </div>
                ))}
              </div>

              <div className="p-5 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                <p className="text-sm font-semibold text-green-900 mb-1">Resultado Real:</p>
                <p className="text-sm text-green-800">
                  Due diligence pré-aquisição revelou passivo trabalhista de R$ 12 milhões não declarado. <strong>Preço de compra renegociado</strong> com desconto de 40%. Cliente economizou <strong>R$ 18 milhões</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Como Funciona a Due Diligence
            </h2>
            <p className="text-xl text-slate-600">
              Processo completo em 4 etapas - 48 a 72 horas
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Briefing', desc: 'Você envia CNPJ da empresa-alvo + objetivos da análise (M&A, parceria, investimento)', time: '30 min' },
              { step: '2', title: 'Investigação', desc: 'Consultamos 12 fontes oficiais + cruzamento de dados de sócios e vínculos', time: '24-48h' },
              { step: '3', title: 'Análise Pericial', desc: 'Perito analisa red flags, calcula riscos financeiros e elabora relatório executivo', time: '12h' },
              { step: '4', title: 'Entrega', desc: 'Relatório completo + parecer final (prosseguir, renegociar ou abortar)', time: 'Imediato' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {idx < 3 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-slate-300 z-0"></div>
                )}
                <div className="relative bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow z-10">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{item.desc}</p>
                  <div className="text-xs text-indigo-600 font-semibold">⏱️ {item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RED FLAGS CHECKLIST */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
              Red Flags Críticos Que Identificamos
            </h2>
            <p className="text-slate-600 text-center mb-12">
              Qualquer um desses red flags pode inviabilizar um negócio:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { flag: '🚨 CNPJ Inapto, Suspenso ou Baixado', risk: 'Empresa fantasma ou inativa' },
                { flag: '🚨 Sócio com CPF Suspenso/Cancelado', risk: 'Irregularidade fiscal grave' },
                { flag: '🚨 Sócio sancionado no CEIS/CNEP', risk: 'Impedimento de contratar com governo' },
                { flag: '🚨 Capital social muito baixo', risk: 'Incapacidade financeira' },
                { flag: '🚨 +50 processos trabalhistas', risk: 'Gestão abusiva / Passivo oculto' },
                { flag: '🚨 Protestos não quitados >R$ 500k', risk: 'Inadimplência grave' },
                { flag: '🚨 Certidões negativas irregulares', risk: 'Débitos fiscais federais/estaduais' },
                { flag: '🚨 Múltiplas alterações de sócios', risk: 'Fraude ou instabilidade societária' },
                { flag: '🚨 Endereço fiscal incompatível', risk: 'Empresa laranja / Fachada' },
                { flag: '🚨 Sócios em comum com concorrentes', risk: 'Conflito de interesse / Cartel' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-white border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">{item.flag}</div>
                    <div className="text-xs text-slate-600">{item.risk}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DELIVERABLES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            O Que Você Recebe
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FileSearch,
                title: 'Relatório Executivo',
                items: [
                  'Resumo executivo (2-3 páginas)',
                  'Análise de risco por categoria',
                  'Score de risco final (0-100)',
                  'Parecer: Prosseguir / Renegociar / Abortar',
                ],
              },
              {
                icon: AlertCircle,
                title: 'Anexos Probatórios',
                items: [
                  'Comprovantes de consultas (PDF)',
                  'Screenshots de red flags',
                  'Tabela de processos judiciais',
                  'Lista de protestos e débitos',
                ],
              },
              {
                icon: BarChart3,
                title: 'Análise Financeira',
                items: [
                  'Estimativa de passivos ocultos',
                  'Impacto no valuation da empresa',
                  'Recomendações de renegociação',
                  'Cláusulas contratuais sugeridas',
                ],
              },
            ].map((deliverable, idx) => (
              <div key={idx} className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <deliverable.icon className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">{deliverable.title}</h3>
                <ul className="space-y-2">
                  {deliverable.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
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

      {/* PRICING CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Investigue Antes de Investir
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Evite prejuízos milionários. Solicite due diligence agora.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 text-lg px-8 py-6">
              <Building2 className="w-5 h-5 mr-2" />
              Solicitar Due Diligence
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              <Download className="w-5 h-5 mr-2" />
              Baixar Checklist DD (PDF)
            </Button>
          </div>

          <p className="text-sm text-slate-400 mt-8">
            Prazo: 48-72h | Express: 24h (consulte)
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">
            Perguntas Frequentes
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'Qual a diferença entre due diligence e background check?',
                a: 'Background check foca em pessoas físicas (candidatos a emprego). Due diligence foca em empresas (CNPJ, sócios, contratos) para M&A, parcerias ou investimentos.',
              },
              {
                q: 'Preciso de autorização da empresa investigada?',
                a: 'Não. Utilizamos apenas dados públicos (CNPJ, CEIS, Tribunais, Protestos). Em M&A, é comum que a due diligence seja feita sem conhecimento prévio do vendedor.',
              },
              {
                q: 'Quanto custa?',
                a: 'Valores variam conforme complexidade (porte da empresa, número de sócios, escopo da análise). Solicite orçamento personalizado. Investimento típico: R$ 5.000 a R$ 25.000.',
              },
              {
                q: 'E se vocês não encontrarem nada de errado?',
                a: 'Isso é excelente! Significa que a empresa está limpa. Você recebe relatório atestando a regularidade, que serve como proteção jurídica e due diligence defensiva.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="group border border-slate-200 rounded-lg p-6 hover:border-indigo-400 transition-colors">
                <summary className="cursor-pointer font-semibold text-slate-900 flex justify-between items-center">
                  {faq.q}
                  <span className="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
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
