"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Shield, ArrowRight, CheckCircle2, MessageCircle,
  Globe, Scale, Search, Video, Database, Users,
  Building2, ClipboardCheck, Heart, FileText, Star,
  Zap, Target, Award, ShieldCheck, Sparkles
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* HERO SECTION */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 dark:opacity-10">
            <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center"></div>
          </div>

          <div className="container max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Coluna Esquerda: Conteúdo */}
              <div className="space-y-8">
                <div>
                  <Badge className="bg-amber-500 text-slate-900 font-bold mb-4 px-4 py-2">
                    🔥 DECISÃO STF 2025 - NOVA ERA DIGITAL
                  </Badge>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-slate-900 dark:text-white">
                    Prove a <span className="text-blue-600 dark:text-blue-400">Verdade</span><br />
                    Antes Que Seja<br />
                    <span className="text-amber-600 dark:text-amber-400">Tarde Demais</span>
                  </h1>
                  <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
                    Combinamos <strong className="text-blue-600 dark:text-blue-400">tecnologia de ponta</strong> com <strong className="text-slate-900 dark:text-white">metodologia forense validada</strong> por Perito Criminal Oficial para entregar resultados que você pode <strong className="text-amber-600 dark:text-amber-400">provar na justiça</strong>.
                  </p>
                </div>

                {/* Badges de Credibilidade */}
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-green-100 text-green-700 border border-green-300 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30 px-4 py-2">
                    ✅ Perito Criminal Oficial
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30 px-4 py-2">
                    🚀 5.950 auditados
                  </Badge>
                  <Badge className="bg-purple-100 text-purple-700 border border-purple-300 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30 px-4 py-2">
                    ⭐ 4.9/5 estrelas
                  </Badge>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/servicos" className="flex-1">
                    <Button size="lg" className="w-full bg-blue-500 hover:bg-blue-600 text-white h-14 font-bold text-lg shadow-2xl shadow-blue-500/50">
                      Ver Todos os Serviços
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/contato" className="flex-1">
                    <Button size="lg" variant="outline" className="w-full h-14 border-2 border-slate-300 text-slate-900 hover:bg-slate-100 dark:border-white dark:text-white dark:hover:bg-white/10 font-bold text-lg">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Falar com Especialista
                    </Button>
                  </Link>
                </div>

                {/* Prova Social Rápida */}
                <div className="flex items-center gap-4 pt-4 text-sm text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span>Resposta em 24h • 100% Confidencial • Conforme LGPD</span>
                </div>
              </div>

              {/* Coluna Direita: Visual */}
              <div className="relative hidden lg:block">
                <div className="relative bg-white/80 backdrop-blur-xl border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-green-100 border border-green-300 dark:bg-green-500/10 dark:border-green-500/20 rounded-lg">
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Validação Forense</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Por Perito Criminal Oficial</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-blue-100 border border-blue-300 dark:bg-blue-500/10 dark:border-blue-500/20 rounded-lg">
                      <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Conformidade LGPD</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">100% Legal e Documentado</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-amber-100 border border-amber-300 dark:bg-amber-500/10 dark:border-amber-500/20 rounded-lg">
                      <Award className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Metodologia Validada</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Aceita em processos judiciais</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DESTAQUE: REMOÇÃO DE CONTEÚDOS STF 2025 */}
        <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-950 dark:via-red-950 dark:to-slate-950">
          <div className="container max-w-6xl mx-auto px-4">
            <Card className="border-2 border-amber-500 shadow-2xl shadow-amber-500/20 bg-white dark:bg-slate-900">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Coluna Esquerda */}
                  <div className="space-y-6">
                    <div>
                      <Badge className="bg-red-500/20 text-red-600 border-red-500/30 mb-3 px-4 py-2 font-bold">
                        🔥 SERVIÇO MAIS PROCURADO
                      </Badge>
                      <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        Remoção de Conteúdos Online
                      </h2>
                      <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                        Com a <strong className="text-red-600">decisão revolucionária do STF em 2025</strong>, agora é possível remover processos antigos, notícias negativas e conteúdos prejudiciais do Google, Jusbrasil, Escavador e redes sociais com <strong>85% de taxa de sucesso</strong>.
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="text-2xl font-bold text-green-600">85%</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Taxa sucesso</div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="text-2xl font-bold text-blue-600">24-48h</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">Urgentes</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="text-2xl font-bold text-purple-600">70%</div>
                        <div className="text-xs text-slate-600 dark:text-slate-400">- processos</div>
                      </div>
                    </div>

                    {/* Benefícios */}
                    <div className="space-y-2">
                      {[
                        'Desindexação Google (processos e notícias)',
                        'Remoção Jusbrasil/Escavador (LGPD)',
                        'Redes sociais em 24-48h',
                        'Fundamentação STF 2025',
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link href="/solucoes/protecao-remocao">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-14 font-bold text-lg shadow-xl shadow-red-600/30">
                        <Shield className="w-5 h-5 mr-2" />
                        Ver Detalhes Completos
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  {/* Coluna Direita: Plataformas */}
                  <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 rounded-2xl p-6 border border-red-500/20">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-center">
                      Plataformas Atendidas
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Google', time: '2-5 dias', icon: Globe },
                        { name: 'Jusbrasil', time: '2-5 dias', icon: Scale },
                        { name: 'Escavador', time: '2-5 dias', icon: Search },
                        { name: 'Redes Sociais', time: '24-48h', icon: MessageCircle },
                      ].map((platform, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                              <platform.icon className="w-4 h-4 text-red-600" />
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white text-sm">
                              {platform.name}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">{platform.time}</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-500/30 rounded-lg text-center">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        ⚖️ Fundamentado na decisão STF junho/2025
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* SERVIÇOS DO PORTFÓLIO REAL */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-yellow-500 text-slate-900 font-bold mb-4 px-4 py-2 shadow-md">
                <Sparkles className="w-4 h-4 mr-2 inline" />
                NOVIDADES
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Serviços do Nosso Portfólio Real
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
                Baseados em casos reais executados com sucesso para nossos clientes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Coleta de Dados Automatizada */}
              <Card className="hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                      <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Coleta de Dados Automatizada
                    </h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Automação de coleta em portais públicos e privados. Redução de 8h/dia para 5min automatizados.
                  </p>
                  <div className="pt-2">
                    <Badge className="bg-blue-600 text-white text-xs font-semibold">AUTOMAÇÃO EMPRESARIAL</Badge>
                  </div>
                  <Link href="/servicos">
                    <Button variant="outline" className="w-full mt-4 border-slate-300 hover:bg-slate-50 text-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white">
                      Saiba Mais
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Investigação Defensiva Criminal */}
              <Card className="hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                      <Scale className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Investigação Defensiva Criminal
                    </h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Organização de provas, análise de inquéritos e preparação de material para defesa com metodologia forense.
                  </p>
                  <div className="pt-2">
                    <Badge className="bg-purple-600 text-white text-xs font-semibold">DEFESA ESTRATÉGICA</Badge>
                  </div>
                  <Link href="/servicos">
                    <Button variant="outline" className="w-full mt-4 border-slate-300 hover:bg-slate-50 text-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white">
                      Saiba Mais
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Segurança Eletrônica */}
              <Card className="hover:shadow-2xl transition-all border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                      <Video className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Segurança Eletrônica
                    </h3>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Venda e instalação de equipamentos Intelbras com suporte técnico completo em todo o Brasil.
                  </p>
                  <div className="pt-2">
                    <Badge className="bg-orange-600 text-white text-xs font-semibold">ATENDIMENTO NACIONAL</Badge>
                  </div>
                  <Link href="/servicos">
                    <Button variant="outline" className="w-full mt-4 border-slate-300 hover:bg-slate-50 text-slate-900 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-white">
                      Saiba Mais
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* OUTRAS SOLUÇÕES - GRID 4 COLUNAS */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Outras Soluções Especializadas
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300">
                Explore nossa linha completa de serviços investigativos e de compliance
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Due Diligence', subtitle: 'Empresarial', icon: Building2, link: '/solucoes/due-diligence' },
                { name: 'Background Check', subtitle: 'Executivos', icon: Users, link: '/solucoes/background-check-executivos' },
                { name: 'RH & Compliance', subtitle: 'Auditoria', icon: ClipboardCheck, link: '/solucoes/rh-compliance' },
                { name: 'Investigação Patrimonial', subtitle: 'Bens e Ativos', icon: Building2, link: '/solucoes/investigacao-patrimonial' },
                { name: 'Due Diligence', subtitle: 'Divórcios', icon: Heart, link: '/solucoes/due-diligence-divorcios' },
                { name: 'Coleta de Provas', subtitle: 'Digitais', icon: FileText, link: '/solucoes/coleta-provas-digitais' },
                { name: 'Auditoria', subtitle: 'Licitações', icon: ClipboardCheck, link: '/solucoes/auditoria-licitacoes' },
                { name: 'Ver Todos', subtitle: 'Serviços', icon: ArrowRight, link: '/servicos' },
              ].map((solution, idx) => (
                <Link key={idx} href={solution.link}>
                  <Card className="hover:shadow-xl hover:border-blue-300 transition-all h-full border border-slate-200 dark:border-slate-800 cursor-pointer group bg-white dark:bg-slate-900">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                        <solution.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">
                        {solution.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {solution.subtitle}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* DIFERENCIAL: DANI + IBSEN */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 dark:from-blue-900 dark:via-slate-900 dark:to-purple-900">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-amber-500 text-slate-900 font-bold mb-4 px-4 py-2">
                NOSSO DIFERENCIAL
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
                Equipe Especializada
              </h2>
              <p className="text-xl text-slate-700 dark:text-slate-300">
                Tecnologia + Validação Forense = Resultados Comprovados
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Danielle Kaloi */}
              <Card className="bg-white/80 backdrop-blur-xl border border-slate-200 hover:bg-white dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-blue-100 dark:bg-blue-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Danielle Kaloi</h3>
                  <p className="text-blue-600 dark:text-blue-400 mb-4">Fundadora & CEO</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    Especialista em OSINT e investigação digital. Responsável pela tecnologia e metodologia de investigação da Investigaree.
                  </p>
                  <Link href="/quemsomos/dani-kaloi">
                    <Button variant="outline" className="mt-6 border-slate-300 text-slate-900 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                      Ver Perfil Completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Ibsen Maciel */}
              <Card className="bg-white/80 backdrop-blur-xl border border-slate-200 hover:bg-white dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 transition-all">
                <CardContent className="p-8 text-center">
                  <div className="w-24 h-24 bg-purple-100 dark:bg-purple-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <ShieldCheck className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Ibsen Maciel</h3>
                  <p className="text-purple-600 dark:text-purple-400 mb-4">Perito Criminal Oficial</p>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    Perito Criminal da Polícia Civil. Valida todas as investigações com metodologia forense aceita judicialmente.
                  </p>
                  <Link href="/quemsomos/ibsen-maciel">
                    <Button variant="outline" className="mt-6 border-slate-300 text-slate-900 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                      Ver Perfil Completo
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* PROVA SOCIAL COM NÚMEROS */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Resultados Comprovados
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300">
                Números reais de projetos executados
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '5.950', label: 'Funcionários Auditados', icon: Users },
                { number: '1.000+', label: 'Veículos Automatizados', icon: Zap },
                { number: '85%', label: 'Taxa de Sucesso STF', icon: Target },
                { number: '4.9/5', label: 'Avaliação Clientes', icon: Star },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stat.number}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Pronto Para Provar a Verdade?
            </h2>
            <p className="text-xl text-blue-100">
              Fale com nossa equipe agora e descubra como podemos ajudar seu caso
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold h-16 px-10 text-lg">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Iniciar Consulta Gratuita
                </Button>
              </Link>
              <Link href="/servicos">
                <Button size="lg" variant="outline" className="border-2 !border-white !bg-transparent !text-white hover:!bg-white/10 hover:!text-white h-16 px-10 text-lg font-bold">
                  Ver Todos os Serviços
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-blue-200">
              ✅ Resposta em 24h • 🔒 100% Confidencial • ⚖️ Conforme LGPD
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
