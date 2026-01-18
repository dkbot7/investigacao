import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, TrendingDown, Home, Car, Briefcase, CreditCard, AlertTriangle, CheckCircle2, ArrowRight, Shield, Database } from 'lucide-react'
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: 'Investigação Patrimonial para Divórcios | Rastreamento de Bens Ocultos | Investigaree',
  description: 'Investigação completa para processos de divórcio. Identifique bens ocultos, imóveis, veículos, empresas e criptomoedas. Relatórios forenses para partilha justa.',
  openGraph: {
    title: 'Investigação para Divórcios | Investigaree',
    description: 'Rastreie patrimônio oculto em divórcios. Detecte bens não declarados, incompatibilidade patrimonial e fraudes.',
    images: ['/images/solutions/divorcio-og.jpg'],
  },
}

export default function DueDiligenceDivorciosPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-full text-sm font-medium">
                <Heart className="w-4 h-4 text-orange-400" />
                <span>Investigação Patrimonial Forense</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Garanta uma Partilha <span className="text-orange-400">Justa</span>.
                <br />
                Identifique Bens Ocultos.
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed">
                <strong className="text-white">Segundo o IBDFAM, em processos litigiosos pode haver ocultação patrimonial.</strong> Nossa investigação forense rastreia imóveis, veículos, empresas, contas bancárias e criptomoedas não declarados.
              </p>

              <div className="space-y-3">
                {[
                  'Rastreamento completo: imóveis, veículos, empresas, participações societárias',
                  'Detecção de incompatibilidade entre renda declarada e patrimônio real',
                  'Rastreamento de criptomoedas (Bitcoin, Ethereum, stablecoins)',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/contato">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold h-14 px-8 text-lg shadow-lg shadow-orange-500/50">
                    <TrendingDown className="w-5 h-5 mr-2" />
                    Solicitar Investigação Patrimonial
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg">
                  Ver Caso Real
                </Button>
              </div>

              <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-6 mt-8">
                <div className="flex items-start gap-4">
                  <Shield className="w-8 h-8 text-orange-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white mb-2">Caso Real de Sucesso</h3>
                    <p className="text-slate-300 text-sm">
                      Identificamos R$ 3,2M em criptomoedas não declaradas que resultaram em nova partilha judicial. Metodologia validada por Perito Criminal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 blur-3xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-orange-500/20 rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl font-bold text-white">O Que Rastreamos</h3>
                <div className="space-y-4">
                  {[
                    { icon: Home, title: 'Imóveis', desc: 'Casas, apartamentos, terrenos, fazendas' },
                    { icon: Car, title: 'Veículos', desc: 'Carros, motos, barcos, aeronaves' },
                    { icon: Briefcase, title: 'Empresas', desc: 'Participações societárias ocultas' },
                    { icon: CreditCard, title: 'Contas Bancárias', desc: 'Movimentações financeiras suspeitas' },
                    { icon: Database, title: 'Criptomoedas', desc: 'Bitcoin, Ethereum, stablecoins' },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-orange-500/10 hover:border-orange-500/30 transition-colors">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                          <Icon className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{item.title}</h4>
                          <p className="text-sm text-slate-400">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METODOLOGIA */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Nossa Metodologia Forense
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Análise completa com cruzamento de dados públicos e investigação digital
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Levantamento Patrimonial',
                desc: 'Consulta em bases públicas: Cartórios, Detran, Receita Federal, Juntas Comerciais',
                items: ['Imóveis registrados', 'Veículos em nome próprio', 'Empresas e participações'],
              },
              {
                title: 'Análise de Incompatibilidade',
                desc: 'Cruzamento entre renda declarada e patrimônio identificado',
                items: ['Declarações de IR', 'Movimentações visíveis', 'Padrão de vida vs renda'],
              },
              {
                title: 'Rastreamento Digital',
                desc: 'Investigação de ativos digitais e contas não declaradas',
                items: ['Criptomoedas (blockchain)', 'Empresas em nome de laranjas', 'Transferências suspeitas'],
              },
            ].map((method, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{method.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{method.desc}</p>
                <ul className="space-y-3">
                  {method.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALERTA IMPORTANTE */}
      <section className="py-16 bg-orange-50 dark:bg-orange-950/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-6">
            <AlertTriangle className="w-12 h-12 text-orange-500 flex-shrink-0" />
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Por Que a Investigação É Essencial?
              </h3>
              <div className="space-y-3 text-slate-700 dark:text-slate-300">
                <p>
                  <strong>Segundo estudos do IBDFAM (Instituto Brasileiro de Direito de Família),</strong> em processos de divórcio litigioso é comum a tentativa de ocultação patrimonial para reduzir valores de partilha ou pensão alimentícia.
                </p>
                <p>
                  Nossa investigação forense utiliza metodologia validada por Perito Criminal Oficial para identificar bens ocultos, incompatibilidades e tentativas de fraude patrimonial.
                </p>
                <p className="text-orange-600 dark:text-orange-400 font-semibold">
                  ✅ Relatórios com validade judicial | ✅ Metodologia forense certificada | ✅ Entrega em 7-10 dias
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Proteja Seus Direitos na Partilha
          </h2>
          <p className="text-xl text-orange-100">
            Não deixe bens ocultos prejudicarem sua partilha. Solicite uma investigação patrimonial forense completa.
          </p>
          <Link href="/contato">
            <Button size="lg" className="bg-white text-orange-600 hover:bg-orange-50 font-semibold h-14 px-8 text-lg">
              Solicitar Investigação Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}
