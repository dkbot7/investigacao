"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import {
  ArrowLeft, Award, BookOpen, Briefcase, GraduationCap,
  Shield, Users, Globe, CheckCircle, Calendar, MapPin,
  FileSearch, Search, Eye, UserCheck, TrendingUp
} from "lucide-react";

export default function DaniKaloiPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-7xl px-4">
            <Link href="/quemsomos">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar para Quem Somos
              </Button>
            </Link>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Summary */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    Danielle Alexandra Paulo
                  </h1>
                  <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
                    Nome Profissional: <strong>Dani Kaloi</strong>
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-primary-500 text-white">
                      CEO investigaree
                    </Badge>
                    <Badge className="bg-purple-600 text-white">
                      Desenvolvedora Full Stack
                    </Badge>
                    <Badge className="bg-indigo-600 text-white">
                      Arquiteta de Soluções de IA
                    </Badge>
                    <Badge className="bg-blue-600 text-white">
                      Especialista OSINT
                    </Badge>
                  </div>
                  <p className="text-xl text-neutral-600 dark:text-neutral-400">
                    Desenvolvedora Full Stack e Arquiteta de Soluções de Automação e IA com 2+ anos de experiência
                    em implementação de sistemas inteligentes e 12+ anos no mercado imobiliário. Especialista em
                    React 18+, TypeScript, Cloudflare Workers, Supabase, Python, Machine Learning e IA Generativa.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-primary-600">12+</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Anos de Experiência</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-primary-600">3.500+</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Usuários Ativos</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-primary-600">16+</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Certificações</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Card */}
              <div>
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Informações Profissionais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          CEO investigaree | Fundadora Investiritapema
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Itapema, Santa Catarina, Brasil
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Full Stack Development & OSINT
                        </span>
                      </div>
                    </div>

                    <Button className="w-full" size="lg">
                      Solicitar Investigação
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-12">
              Trajetória Profissional
            </h2>

            <div className="space-y-8">
              {/* Current Position 1 */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        CEO e Fundadora - investigaree
                      </CardTitle>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Plataforma SaaS de Due Diligence Forense
                      </p>
                    </div>
                    <Badge variant="outline">2024 - Presente</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Desenvolvimento de plataforma SaaS com React 18, Cloudflare Workers, Supabase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Integração de OSINT e IA (OpenAI GPT-4) para due diligence automatizada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Compliance LGPD nativo e metodologias forenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">MVP em desenvolvimento para Q1 2025</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Current Position 2 */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        Arquiteta de Soluções de Automação e IA
                      </CardTitle>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Consultora Autônoma
                      </p>
                    </div>
                    <Badge variant="outline">Mar 2023 - Presente</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Desenvolvimento Full Stack: React 18.3, TypeScript, Cloudflare Workers, Hono.js</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">ChatbotImóveis: 3.500+ usuários ativos, +67% aumento em vendas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Automação com Python, Selenium, Web Scraping e APIs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">IA Generativa: Claude 3.5, OpenAI GPT-4, AWS SageMaker</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Position 3 */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        Fundadora e Diretora
                      </CardTitle>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Investiritapema
                      </p>
                    </div>
                    <Badge variant="outline">Mar 2013 - Presente</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">12+ anos de liderança no mercado imobiliário</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Integração de soluções de IA nos processos empresariais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Transformação digital completa da empresa</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Previous Experience */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        Investigadora Sênior
                      </CardTitle>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        [Empresa Confidencial]
                      </p>
                    </div>
                    <Badge variant="outline">2015 - 2020</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Investigações corporativas de alta complexidade</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Background checks para C-level executives</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Análise de riscos em M&A</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-12">
              Áreas de Expertise
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* OSINT */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Search className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">OSINT Avançado</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Open Source Intelligence
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Análise de redes sociais profundas</li>
                    <li>• Investigação de pegada digital</li>
                    <li>• Verificação de identidades</li>
                    <li>• Rastreamento de ativos digitais</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Due Diligence */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <FileSearch className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Due Diligence</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Investigação Corporativa
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Análise de founders e executivos</li>
                    <li>• Verificação de histórico empresarial</li>
                    <li>• Investigação de passivos ocultos</li>
                    <li>• Avaliação de riscos reputacionais</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Compliance */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Compliance</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        LGPD & Ética
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Investigações 100% LGPD compliant</li>
                    <li>• Auditoria de conformidade</li>
                    <li>• Gestão de riscos regulatórios</li>
                    <li>• Protocolos éticos rigorosos</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Family Protection */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <Users className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Proteção Familiar</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        High Net Worth Families
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Verificação de funcionários domésticos</li>
                    <li>• Proteção digital de adolescentes</li>
                    <li>• Análise de vulnerabilidades</li>
                    <li>• Investigação de relacionamentos</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Corporate Intelligence */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Inteligência Empresarial</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Business Intelligence
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Análise competitiva</li>
                    <li>• Investigação de fraudes corporativas</li>
                    <li>• Verificação de parceiros</li>
                    <li>• Proteção contra espionagem</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Investment Protection */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                      <Eye className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Proteção de Investimentos</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Angel & VC Support
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Investigação de founders</li>
                    <li>• Análise de cap table</li>
                    <li>• Verificação de métricas</li>
                    <li>• Monitoramento de portfolio</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Specializations */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-12">
              Especializações e Certificações
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Certificações Profissionais (16+)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Criação e Gerenciamento de Agentes de IA</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Zaia • Dezembro 2024</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Formação PARAÍSO DIGITAL</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">AnaTex • Setembro 2024</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">ClickUp 3.0 + Flow Pro</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Bravy Training • Outubro 2024</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">AWS SageMaker & Machine Learning</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">AWS • 2022-2024</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">+ 12 certificações em IA, Machine Learning e Automação</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">2022-2024</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Metodologias Desenvolvidas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Framework de Due Diligence 360°</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Metodologia proprietária para investidores</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Protocolo Family Shield</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Proteção integral para famílias HNW</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                      <div>
                        <p className="font-medium">Sistema Red Flag Express</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Análise rápida em 48 horas</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-12">
              Formação Acadêmica
            </h2>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-primary-500" />
                    <div>
                      <CardTitle>Tecnólogo em Criminologia</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Cruzeiro do Sul Virtual • Agosto 2023 - Dezembro 2025 (em andamento)
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Formação focada em compreender a complexidade do comportamento humano sob a perspectiva criminológica,
                    explorando as nuances entre a sociedade e os avanços tecnológicos.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-primary-500" />
                    <div>
                      <CardTitle>Formação PARAÍSO DIGITAL</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        AnaTex • Setembro 2024
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    Formação completa em criação de produtos digitais com IA, focada em consultoria de IA,
                    copywriting, automação e estratégia de vendas digitais.
                  </p>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Consultoria estratégica em IA</li>
                    <li>• Criação de Produtos Digitais com IA</li>
                    <li>• Desenvolvimento de robôs GPT personalizados</li>
                    <li>• Automação de até 70% do operacional</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-primary-500" />
                    <div>
                      <CardTitle>Formação ClickUp 3.0 + Flow Pro</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Bravy Training • Outubro 2024
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Gestão de Processos Empresariais (BPM) e otimização de fluxos de trabalho.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}