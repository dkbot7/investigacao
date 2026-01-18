import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Trash2, Search, Globe, Scale, UserX, AlertTriangle, CheckCircle2, ArrowRight, Clock, Lock, FileText, MessageSquare } from 'lucide-react'
import Header from "@/components/landing/Header"
import Footer from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: 'Remoção Google LGPD | Remover Processos Jusbrasil | Proteção Digital',
  description: 'Remoção profissional LGPD de fotos íntimas, processos antigos e notícias negativas. Google, Jusbrasil, Escavador e redes sociais. 85% sucesso. Emergencial 24-72h. A partir de R$ 800.',
  keywords: ['remoção google lgpd', 'remover processos jusbrasil', 'desindexação google', 'remoção de conteúdo internet', 'direito ao esquecimento', 'remover fotos íntimas', 'proteção privacidade lgpd', 'remoção jusbrasil escavador', 'deletar google'],
  openGraph: {
    title: 'Remoção Google LGPD | Remover Processos e Conteúdos',
    description: 'Remoção profissional baseada na LGPD. Google, Jusbrasil, Escavador e redes sociais. 85% taxa de sucesso. Atendimento emergencial 24-72h.',
    images: ['/images/solutions/protecao-remocao-og.jpg'],
    type: 'website',
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remoção LGPD | Google e Jusbrasil',
    description: 'Remova processos antigos e conteúdos sensíveis com base na LGPD. 85% de taxa de sucesso.',
  },
  alternates: {
    canonical: '/solucoes/protecao-remocao',
  },
}

export default function ProtecaoRemocaoPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/90 border border-amber-400/50 rounded-full text-sm font-bold text-slate-900">
                <Shield className="w-4 h-4" />
                <span>DECISÃO STF 2025 - NOVO PARADIGMA</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Remoção Profissional de Conteúdos Online: <span className="text-amber-400">85% de Taxa de Sucesso</span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed">
                <strong className="text-white">A decisão revolucionária do STF em junho de 2025 mudou tudo.</strong> Removemos conteúdos objetivamente ilícitos do Google, Jusbrasil, Escavador e redes sociais com <strong className="text-amber-400">resposta em 24-48h para casos urgentes</strong> (antes: 5-15 dias).
              </p>

              <div className="space-y-3">
                {[
                  '85% de taxa de sucesso (antes: 55%) com nova interpretação do Marco Civil',
                  'Resposta 24-48h casos urgentes (deepfakes, crimes, vazamentos) - antes: 5-15 dias',
                  'Notificações extrajudiciais efetivas em Google, Jusbrasil, Escavador e redes sociais',
                  'Fundamentação profissional: conteúdo objetivamente ilícito (decisão STF 2025)',
                  'Redução de 70% na necessidade de processos judiciais',
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
                <h3 className="text-2xl font-bold text-white">Plataformas Atendidas</h3>
                <div className="space-y-4">
                  {[
                    { icon: Globe, title: 'Google', desc: 'Desindexação de resultados de busca', prazo: '2-5 dias' },
                    { icon: Scale, title: 'Jusbrasil', desc: 'Remoção de processos antigos', prazo: '2-5 dias' },
                    { icon: Search, title: 'Escavador', desc: 'Solicitação de exclusão de perfil', prazo: '2-5 dias' },
                    { icon: MessageSquare, title: 'Redes Sociais', desc: 'Facebook, Instagram, Twitter, TikTok', prazo: '24-48h' },
                    { icon: FileText, title: 'Sites de Notícias', desc: 'Solicitação de remoção/retificação', prazo: '5-10 dias' },
                  ].map((service, idx) => {
                    const Icon = service.icon
                    return (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg border border-red-500/10 hover:border-red-500/30 transition-colors">
                        <div className="p-2 bg-red-500/10 rounded-lg">
                          <Icon className="w-5 h-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{service.title}</h4>
                          <p className="text-sm text-slate-400 mb-1">{service.desc}</p>
                          <p className="text-xs text-red-400">⏱ {service.prazo}</p>
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

      {/* A REVOLUÇÃO DE 2025 */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-amber-500 text-slate-900 font-bold mb-4">
              Novo Paradigma Legal
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              A Revolução de 2025 no Direito Digital Brasileiro
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              A decisão do STF em junho de 2025 transformou completamente o cenário de remoção de conteúdos online no Brasil
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                label: 'Taxa de Sucesso',
                before: '55%',
                after: '85%',
                desc: 'Notificações extrajudiciais'
              },
              {
                label: 'Tempo de Resposta',
                before: '5-15 dias',
                after: '24-48h',
                desc: 'Casos urgentes'
              },
              {
                label: 'Crescimento',
                before: '—',
                after: '+300%',
                desc: 'Demanda por serviços especializados'
              },
            ].map((stat, idx) => (
              <Card key={idx} className="border-2 border-amber-500/30 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{stat.label}</p>
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="text-xl text-red-500 line-through">{stat.before}</span>
                    <ArrowRight className="w-5 h-5 text-amber-500" />
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">{stat.after}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{stat.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-amber-500/30 bg-white dark:bg-slate-900">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    O que mudou com a decisão do STF?
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 mb-4">
                    A decisão revolucionária do Supremo Tribunal Federal de junho de 2025 alterou fundamentalmente a interpretação do <strong>Artigo 19 do Marco Civil da Internet</strong>, criando um novo paradigma que transformou o cenário da remoção de conteúdos online no país.
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                    Conceito revolucionário: "Conteúdo Objetivamente Ilícito"
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    Conteúdos que violam de forma <strong>clara e inequívoca</strong> a legislação brasileira podem e devem ser removidos pelas plataformas mediante <strong>notificação fundamentada</strong>, independentemente de ordem judicial prévia.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                    O que é considerado "conteúdo objetivamente ilícito":
                  </h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      'Crimes contra a honra (calúnia, difamação, injúria)',
                      'Discurso de ódio (racismo, homofobia, xenofobia)',
                      'Violação de direitos autorais',
                      'Divulgação não autorizada de dados pessoais',
                      'Deepfakes pornográficos',
                      'Desinformação com impacto eleitoral',
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/10 border border-green-500/20 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 dark:text-green-400 mb-2">
                    Benefícios práticos para você:
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li>✅ Redução de 70% na necessidade de processos judiciais</li>
                    <li>✅ Tempo de resolução mais rápido (redução de danos)</li>
                    <li>✅ Custos processuais menores</li>
                    <li>✅ Maior produtividade nas solicitações</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* PLATAFORMAS DETALHADAS */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30 mb-4">
              Remoção Especializada
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Onde Removemos Seus Conteúdos
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Atuamos nas principais plataformas que impactam sua reputação online
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Google */}
            <Card className="border-2 border-red-500/20 hover:border-red-500/40 transition-all">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <Globe className="w-8 h-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Google</CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Desindexação de Resultados</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Removemos:</strong> Processos judiciais antigos, notícias negativas, escândalos, boatos e conteúdos difamatórios que aparecem ao buscar seu nome.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Fundamentação como "conteúdo objetivamente ilícito" (STF 2025)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Solicitação via formulário oficial + LGPD (Art. 18)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Taxa de sucesso: 65-75% (melhorou com novo paradigma)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-red-600 border-red-600">
                    Prazo: 2-5 dias
                  </Badge>
                  <Badge className="bg-green-600 text-white text-xs">
                    Antes: 15-30 dias
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Jusbrasil */}
            <Card className="border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <Scale className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Jusbrasil</CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Remoção de Processos</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Removemos:</strong> Processos judiciais antigos (concluídos há mais de 5 anos), processos arquivados sem condenação, ações sem andamento.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Notificação profissional com decisão STF 2025</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Direito ao esquecimento + LGPD (processos sem interesse público)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Taxa de sucesso: 85-90% (melhorou significativamente)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-600 border-purple-600">
                    Prazo: 2-5 dias
                  </Badge>
                  <Badge className="bg-green-600 text-white text-xs">
                    Antes: 20-45 dias
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Escavador */}
            <Card className="border-2 border-green-500/20 hover:border-green-500/40 transition-all">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <Search className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Escavador</CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Exclusão de Perfil</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Removemos:</strong> Perfil público que expõe processos, publicações acadêmicas, vínculos profissionais e histórico jurídico completo.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Plataforma mais cooperativa com LGPD após decisão STF</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Exclusão total do perfil + dados pessoais agregados</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Taxa de sucesso: 90-95% (plataforma mais receptiva)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Prazo: 2-5 dias
                  </Badge>
                  <Badge className="bg-green-600 text-white text-xs">
                    Antes: 15-30 dias
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Redes Sociais */}
            <Card className="border-2 border-green-500/20 hover:border-green-500/40 transition-all">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Redes Sociais</CardTitle>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Posts Ofensivos</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700 dark:text-slate-300">
                  <strong>Removemos:</strong> Posts difamatórios, fotos não autorizadas, comentários ofensivos, perfis falsos, conteúdos que violam termos de uso.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Atendimento prioritário: Facebook, Instagram, Twitter, TikTok, LinkedIn</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Fundamentação: conteúdo objetivamente ilícito + violação termos de uso</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Taxa de sucesso: 85-95% com nova metodologia profissional</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Prazo: 24-48h
                  </Badge>
                  <Badge className="bg-amber-500 text-slate-900 text-xs font-bold">
                    URGENTE
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Como Funciona a Remoção Profissional
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Metodologia otimizada pós-decisão STF 2025: <strong className="text-green-600">85% de taxa de sucesso</strong> com notificações extrajudiciais fundamentadas
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Você Informa',
                desc: 'Envie os links dos conteúdos (Google, Jusbrasil, Escavador, redes sociais) ou descreva o problema. Atendimento inicial em 24h.'
              },
              {
                step: '2',
                title: 'Análise Profissional',
                desc: 'Analisamos viabilidade e classificamos como "conteúdo objetivamente ilícito" conforme decisão STF 2025 + LGPD'
              },
              {
                step: '3',
                title: 'Notificação Fundamentada',
                desc: 'Enviamos notificação extrajudicial profissional com fundamentação robusta (Marco Civil, LGPD, STF 2025, direito ao esquecimento)'
              },
              {
                step: '4',
                title: 'Resolução Rápida',
                desc: 'Resposta em 24-48h (urgentes) ou 2-5 dias (padrão). Monitoramento até confirmação de remoção. Taxa de sucesso: 85%'
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="text-6xl font-bold text-red-100 dark:text-red-900/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Importante */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card className="border-2 border-green-500/30 bg-green-50 dark:bg-green-900/10">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-500 flex-shrink-0 mt-1" />
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg">Taxa de Sucesso Pós-Decisão STF 2025</h4>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700 dark:text-slate-300"><strong>Taxa Geral:</strong></span>
                        <Badge className="bg-green-600 text-white font-bold">85% de sucesso</Badge>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        (antes da decisão STF: 55%)
                      </p>
                    </div>

                    <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                      <p><strong>Por plataforma:</strong></p>
                      <ul className="space-y-1 ml-4">
                        <li>• <strong>Google:</strong> 65-75% (melhorou com novo paradigma legal)</li>
                        <li>• <strong>Jusbrasil:</strong> 85-90% para processos antigos sem interesse público</li>
                        <li>• <strong>Escavador:</strong> 90-95% (plataforma mais cooperativa com LGPD)</li>
                        <li>• <strong>Redes Sociais:</strong> 85-95% quando há clara violação de termos</li>
                        <li>• <strong>Deepfakes:</strong> 95% com fundamentação na Lei 2025</li>
                      </ul>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-3 rounded-r text-xs text-slate-700 dark:text-slate-300">
                      <strong>Nota importante:</strong> A decisão final é sempre das plataformas. Trabalhamos com notificações profissionalmente fundamentadas que maximizam as chances de sucesso, mas não garantimos 100% de aprovação em todos os casos.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-r from-slate-900 via-red-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <Badge className="bg-amber-500 text-slate-900 font-bold mb-4">
            NOVA ERA DA REMOÇÃO DE CONTEÚDOS
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-bold">
            Aproveite a Decisão Revolucionária do STF 2025
          </h2>

          <p className="text-xl text-slate-300 leading-relaxed">
            Com <strong className="text-amber-400">85% de taxa de sucesso</strong> e <strong className="text-amber-400">resposta em 24-48h</strong> para casos urgentes, nunca foi tão eficaz remover conteúdos negativos da internet.
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-amber-400 mb-1">85%</div>
              <div className="text-sm text-slate-300">Taxa de sucesso</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-amber-400 mb-1">24-48h</div>
              <div className="text-sm text-slate-300">Casos urgentes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
              <div className="text-3xl font-bold text-amber-400 mb-1">70%</div>
              <div className="text-sm text-slate-300">Menos processos judiciais</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/contato">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold h-16 px-10 text-lg shadow-xl shadow-amber-500/30">
                Solicitar Remoção Agora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-slate-400">
              ✅ Resposta em 24h • 🔒 100% confidencial • ⚖️ Fundamentação STF 2025
            </p>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  )
}

