import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Trash2, Eye, Globe, MapPin, UserX, AlertTriangle, CheckCircle2, ArrowRight, Clock, Lock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Proteção e Remoção de Dados Pessoais | Privacidade Digital | Investigaree',
  description: 'Remoção emergencial de fotos íntimas, dados pessoais e conteúdos ofensivos da internet. Proteção LGPD completa em 24-72h.',
  openGraph: {
    title: 'Proteção e Remoção de Dados | Investigaree',
    description: 'Remova seus dados pessoais, fotos e conteúdos indesejados da internet com base na LGPD.',
    images: ['/images/solutions/protecao-remocao-og.jpg'],
  },
}

export default function ProtecaoRemocaoPage() {
  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4 text-red-400" />
                <span>Atendimento Emergencial</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Proteja Sua <span className="text-red-400">Privacidade</span>.
                <br />
                Remova Seus Dados da Internet.
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed">
                <strong className="text-white">Seus dados pessoais estão expostos em 47+ sites públicos.</strong> Removemos fotos íntimas, CPF, endereço e conteúdos ofensivos com base na LGPD. Atendimento emergencial em 24h.
              </p>

              <div className="space-y-3">
                {[
                  'Remoção emergencial de fotos íntimas e conteúdos constrangedores (início imediato)',
                  'Blindagem de CPF e dados pessoais em 47 sites catalogados',
                  'Desindexação do Google e solicitação de remoção em redes sociais',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/contato">
                  <Button size="lg" className="bg-red-500 hover:bg-red-600 text-white font-semibold h-14 px-8 text-lg shadow-lg shadow-red-500/50">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Solicitar Remoção Emergencial
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg">
                  Ver Detalhes
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-red-400" />
                  <span className="text-slate-300">Início em 24h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-red-400" />
                  <span className="text-slate-300">100% Confidencial</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 blur-3xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl font-bold text-white">Serviços de Proteção</h3>
                <div className="space-y-4">
                  {[
                    { icon: Trash2, title: 'Apagar Fotos Íntimas', desc: 'Remoção emergencial em 24h' },
                    { icon: Shield, title: 'Blindar CPF', desc: 'Remoção em 47 sites' },
                    { icon: Globe, title: 'Limpar Google', desc: 'Desindexação de links' },
                    { icon: MapPin, title: 'Esconder Endereço', desc: 'Proteção física' },
                    { icon: UserX, title: 'Denunciar Perfis Falsos', desc: 'Análise técnica completa' },
                  ].map((service, idx) => {
                    const Icon = service.icon
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-colors">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <Icon className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{service.title}</h4>
                          <p className="text-sm text-slate-400">{service.desc}</p>
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

      {/* COMO FUNCIONA */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Como Funciona a Remoção
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Processo rápido e eficiente com fundamentação legal baseada na LGPD
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Você Reporta', desc: 'Informe URLs ou prints do conteúdo a ser removido' },
              { step: '2', title: 'Análise Legal', desc: 'Fundamentação jurídica com base na LGPD e direitos de imagem' },
              { step: '3', title: 'Solicitação Formal', desc: 'Denúncia às plataformas e requisição de remoção' },
              { step: '4', title: 'Acompanhamento', desc: 'Relatório de progresso até confirmação da remoção' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-red-100 dark:text-red-900/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Proteja Sua Privacidade Agora
          </h2>
          <p className="text-xl text-red-100">
            Cada minuto conta quando seus dados pessoais estão expostos. Inicie o processo de remoção hoje mesmo.
          </p>
          <Link href="/contato">
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-semibold h-14 px-8 text-lg">
              Solicitar Remoção Emergencial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
