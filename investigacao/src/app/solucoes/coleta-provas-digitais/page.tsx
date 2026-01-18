import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileCheck, Lock, Shield, Camera, MessageSquare, Mail, Smartphone, CheckCircle2, ArrowRight, Scale, Award, AlertCircle } from 'lucide-react'
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: 'Coleta de Provas Digitais Forenses | Cadeia de Custódia Certificada | Investigaree',
  description: 'Preservação legal de evidências digitais com cadeia de custódia certificada. Provas válidas para processos judiciais. Validação por Perito Criminal.',
  openGraph: {
    title: 'Coleta de Provas Digitais | Investigaree',
    description: 'Capture e preserve evidências digitais com metodologia forense. Cadeia de custódia completa para uso judicial.',
    images: ['/images/solutions/provas-digitais-og.jpg'],
  },
}

export default function ColetaProvasDigitaisPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full text-sm font-medium">
                <FileCheck className="w-4 h-4 text-green-400" />
                <span>Validação Pericial</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Provas Digitais com <span className="text-green-400">Validade</span> Jurídica.
                <br />
                Metodologia Forense Certificada.
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed">
                <strong className="text-white">Prints comuns podem ser questionados em juízo.</strong> Coletamos e preservamos evidências digitais com cadeia de custódia completa, carimbo de tempo e validação por Perito Criminal Oficial.
              </p>

              <div className="space-y-3">
                {[
                  'Captura profissional com metadata preservada (data, hora, IP, dispositivo)',
                  'Cadeia de custódia certificada garantindo integridade das provas',
                  'Validação por Perito Criminal Oficial (1º lugar PCE-PA 2019)',
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/contato">
                  <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold h-14 px-8 text-lg shadow-lg shadow-green-500/50">
                    <Lock className="w-5 h-5 mr-2" />
                    Preservar Provas Digitais
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg">
                  Ver Metodologia
                </Button>
              </div>

              <div className="bg-green-500/10 border border-green-400/30 rounded-lg p-6 mt-8">
                <div className="flex items-start gap-4">
                  <Award className="w-8 h-8 text-green-400 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-white mb-2">Validado por Perito Criminal</h3>
                    <p className="text-slate-300 text-sm">
                      Metodologia forense aplicada por Ibsen Maciel - Perito Criminal Oficial, 1º lugar PCE-PA 2019, Diretor Nacional da ANPAJ (Associação Nacional de Peritos Judiciais).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 blur-3xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-green-500/20 rounded-2xl p-8 space-y-6">
                <h3 className="text-2xl font-bold text-white">Tipos de Provas Coletadas</h3>
                <div className="space-y-4">
                  {[
                    { icon: MessageSquare, title: 'Conversas', desc: 'WhatsApp, Telegram, redes sociais' },
                    { icon: Camera, title: 'Fotos e Vídeos', desc: 'Prints de tela com metadata' },
                    { icon: Mail, title: 'E-mails', desc: 'Cabeçalhos e anexos completos' },
                    { icon: Smartphone, title: 'Dispositivos', desc: 'Extração forense (Avilla Forensics + IPED)' },
                    { icon: Scale, title: 'Documentos', desc: 'PDFs, contratos, áudios' },
                  ].map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-green-500/10 hover:border-green-500/30 transition-colors">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Icon className="w-5 h-5 text-green-400" />
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

      {/* CADEIA DE CUSTÓDIA */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              O Que É Cadeia de Custódia?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Processo forense que garante a integridade das provas desde a coleta até apresentação judicial
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Coleta', desc: 'Captura profissional preservando metadata original' },
              { step: '2', title: 'Preservação', desc: 'Armazenamento seguro com hash criptográfico' },
              { step: '3', title: 'Documentação', desc: 'Registro completo de data, hora, origem e responsáveis' },
              { step: '4', title: 'Validação', desc: 'Certificação por Perito Criminal para uso judicial' },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-green-100 dark:text-green-900/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DIFERENÇA ENTRE PRINTS COMUNS E FORENSES */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">
            Print Comum vs. Prova Forense
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Print Comum */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border-2 border-red-200 dark:border-red-900">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">Print Comum</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Pode ser editado facilmente (Photoshop, Inspect)',
                  'Sem metadata confiável (data/hora alterável)',
                  'Autenticidade questionável em juízo',
                  'Falta cadeia de custódia',
                  'Risco de não ser aceito como prova',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <span className="text-red-500 font-bold">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prova Forense */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl border-2 border-green-200 dark:border-green-900">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">Prova Forense</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Metadata preservada e autenticada',
                  'Carimbo de tempo criptográfico',
                  'Cadeia de custódia documentada',
                  'Validação por Perito Criminal',
                  'Aceita em processos judiciais',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Preserve Suas Provas com Metodologia Forense
          </h2>
          <p className="text-xl text-green-100">
            Não arrisque ter suas provas questionadas em juízo. Garanta evidências com validade jurídica comprovada.
          </p>
          <Link href="/contato">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 font-semibold h-14 px-8 text-lg">
              Solicitar Coleta de Provas
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-sm text-green-100">
            ✅ Entrega em 24-48h | ✅ 100% Confidencial | ✅ Validado por Perito Criminal Oficial
          </p>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}

