"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import {
  Shield, Award, BookOpen, Users, Target, CheckCircle,
  Database, Cpu, Lock, Globe
} from "lucide-react";

export default function QuemSomosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-navy-950">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-900 dark:to-navy-950">
          <div className="container max-w-6xl px-4">
            <div className="text-center space-y-6">
              <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10">
                Quem Somos
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Investigação Digital <span className="text-green-400">Profissional</span>
              </h1>
              <p className="text-xl text-slate-700 dark:text-navy-200 max-w-3xl mx-auto">
                Servimos <strong className="text-green-400">empresas, investidores, advogados, famílias e governo</strong> com metodologia profissional validada e conformidade LGPD.
              </p>
            </div>
          </div>
        </section>

        {/* Nossa Expertise */}
        <section className="py-16 bg-white dark:bg-navy-950">
          <div className="container max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Nossa Expertise
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-green-500/30 bg-gradient-to-br from-white to-slate-50 dark:from-navy-900 dark:to-navy-800">
                <CardHeader>
                  <Database className="w-12 h-12 text-green-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Automação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-navy-200 text-sm">
                    Processamento automatizado de grandes volumes de dados de múltiplas fontes públicas.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-gradient-to-br from-white to-slate-50 dark:from-navy-900 dark:to-navy-800">
                <CardHeader>
                  <Shield className="w-12 h-12 text-green-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Due Diligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-navy-200 text-sm">
                    Investigações empresariais e background checks com cruzamento inteligente de dados.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-gradient-to-br from-white to-slate-50 dark:from-navy-900 dark:to-navy-800">
                <CardHeader>
                  <Lock className="w-12 h-12 text-green-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-navy-200 text-sm">
                    Conformidade com LGPD e boas práticas de proteção de dados pessoais.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-gradient-to-br from-white to-slate-50 dark:from-navy-900 dark:to-navy-800">
                <CardHeader>
                  <Globe className="w-12 h-12 text-green-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">OSINT</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-navy-200 text-sm">
                    Inteligência de fontes abertas com técnicas avançadas de coleta e análise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Nossa Equipe */}
        <section className="py-16 bg-white dark:bg-navy-950">
          <div className="container max-w-6xl px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-2 text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                NOSSA EQUIPE
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Quem Está Por Trás da Investigaree
              </h2>
              <p className="text-lg text-slate-700 dark:text-navy-200 max-w-3xl mx-auto">
                Profissionais com experiência em perícia forense e tecnologia de dados
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Ibsen Maciel */}
              <Card className="border-2 border-green-500/30 hover:border-green-500 hover:shadow-2xl transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-slate-900 dark:text-white mb-1">
                        Ibsen Rodrigues Maciel
                      </CardTitle>
                      <Badge className="bg-green-600 text-white mb-2">
                        Advisory Board
                      </Badge>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        Perito Criminal Oficial
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-500" />
                      Especialização
                    </h4>
                    <p className="text-slate-700 dark:text-navy-200 text-sm">
                      Perícia Forense Computacional
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-green-500" />
                      Descrição
                    </h4>
                    <p className="text-slate-700 dark:text-navy-200 text-sm">
                      Referência nacional em Perícia Forense Computacional. Diretor Nacional de Perícias em Computação Forense da ANPAJ, com 6.000+ associados.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-500" />
                      Conquistas
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-navy-200 text-sm">
                          <strong>1º Lugar</strong> Concurso PCE-PA (2019)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-navy-200 text-sm">
                          <strong>Diretor Nacional de Perícias</strong> - ANPAJ (6.000+ associados)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-navy-200 text-sm">
                          <strong>1º lugar</strong> como Oficial do Exército 2017/18
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-navy-200 text-sm">
                          <strong>Integrante do LABCEDF</strong> - Laboratório de Computação e Extração de Dados Forenses (Polícia Civil do Estado do Pará)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Link href="/quemsomos/ibsen-maciel">
                      <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-500/10">
                        Ver perfil completo
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Dani Kaloi */}
              <Card className="border-2 border-blue-500/30 hover:border-blue-500 hover:shadow-2xl transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Cpu className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-slate-900 dark:text-white mb-1">
                        Dani Kaloi
                      </CardTitle>
                      <Badge className="bg-blue-600 text-white mb-2">
                        Fundadora & CTO
                      </Badge>
                      <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        Arquiteta de Sistemas
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Award className="w-5 h-5 text-blue-500" />
                      Especialização
                    </h4>
                    <p className="text-slate-700 dark:text-navy-200 text-sm">
                      Investigação Digital & Automação
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      Descrição
                    </h4>
                    <p className="text-slate-700 dark:text-navy-200 text-sm">
                      Desenvolvedora Full Stack e Arquiteta de Sistemas especializada em processamento massivo de dados. Processa <strong>+100.000 registros simultaneamente</strong>, cruzando múltiplas bases de dados - governamentais, autorais e sigilosas, nacionais e internacionais.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-500" />
                      Expertise Técnica
                    </h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-navy-200 text-sm">
                          Processamento de <strong>+100.000 registros/investigação</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-navy-200 text-sm">
                          Múltiplas fontes de dados integradas (nacionais e internacionais)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-navy-200 text-sm">
                          Automações avançadas de investigação
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-navy-200 text-sm">
                          Especialista em <strong>due diligence empresarial</strong> e <strong>proteção patrimonial para mulheres em divórcios</strong>
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4">
                    <Link href="/quemsomos/dani-kaloi">
                      <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-500/10">
                        Ver perfil completo
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Métricas da Equipe */}
            <div className="mt-12 grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <Card className="text-center border-green-500/30">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    +100k
                  </div>
                  <p className="text-sm text-slate-700 dark:text-navy-200">
                    Registros por Investigação
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-green-500/30">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    6.000+
                  </div>
                  <p className="text-sm text-slate-700 dark:text-navy-200">
                    Associados ANPAJ
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-green-500/30">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    100%
                  </div>
                  <p className="text-sm text-slate-700 dark:text-navy-200">
                    LGPD Compliance
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-green-500/30">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    1º
                  </div>
                  <p className="text-sm text-slate-700 dark:text-navy-200">
                    Lugar PCE-PA 2019
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quem Usa Nossa Plataforma */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-navy-900 dark:to-green-900">
          <div className="container max-w-6xl px-4">
            <div className="text-center mb-12">
              <Badge className="mb-4 px-4 py-2 text-sm font-semibold bg-green-600 text-white">
                MULTI-AUDIENCE PLATFORM
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Quem Usa Nossa Plataforma
              </h2>
              <p className="text-lg text-slate-700 dark:text-navy-200 max-w-3xl mx-auto">
                Investigação digital profissional para diferentes necessidades e setores
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* RH & Compliance */}
              <Card className="border-2 border-blue-500/30 hover:border-blue-500 hover:shadow-xl transition-all">
                <CardHeader>
                  <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">RH & Compliance</CardTitle>
                  <CardDescription>Background check profissional</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-navy-200 mb-4">
                    Validação de candidatos antes de contratar com verificação em fontes oficiais.
                  </p>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    RH Empresarial
                  </Badge>
                </CardContent>
              </Card>

              {/* Investidores */}
              <Card className="border-2 border-green-500/30 hover:border-green-500 hover:shadow-xl transition-all">
                <CardHeader>
                  <Target className="w-12 h-12 text-green-600 dark:text-green-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Investidores</CardTitle>
                  <CardDescription>Due diligence M&A</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-navy-200 mb-4">
                    Análise completa de empresas, sócios e passivos ocultos antes de investir.
                  </p>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    M&A & Investimentos
                  </Badge>
                </CardContent>
              </Card>

              {/* Advogados */}
              <Card className="border-2 border-purple-500/30 hover:border-purple-500 hover:shadow-xl transition-all">
                <CardHeader>
                  <BookOpen className="w-12 h-12 text-purple-600 dark:text-purple-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Advogados</CardTitle>
                  <CardDescription>Provas digitais profissionais</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-navy-200 mb-4">
                    Coleta de provas com cadeia de custódia certificada e validade judicial.
                  </p>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                    Perícia Profissional
                  </Badge>
                </CardContent>
              </Card>

              {/* Famílias */}
              <Card className="border-2 border-pink-500/30 hover:border-pink-500 hover:shadow-xl transition-all">
                <CardHeader>
                  <Shield className="w-12 h-12 text-pink-600 dark:text-pink-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Divórcio & Família</CardTitle>
                  <CardDescription>Investigação patrimonial</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-navy-200 mb-4">
                    Rastreamento de patrimônio oculto para partilha justa em divórcios.
                  </p>
                  <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400">
                    Família
                  </Badge>
                </CardContent>
              </Card>

              {/* Governo */}
              <Card className="border-2 border-orange-500/30 hover:border-orange-500 hover:shadow-xl transition-all">
                <CardHeader>
                  <Award className="w-12 h-12 text-orange-600 dark:text-orange-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Auditores Públicos</CardTitle>
                  <CardDescription>Compliance em licitações</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-navy-200 mb-4">
                    Auditoria profissional de licitações em conformidade TCU/CGU.
                  </p>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                    Governo
                  </Badge>
                </CardContent>
              </Card>

              {/* Vítimas */}
              <Card className="border-2 border-red-500/30 hover:border-red-500 hover:shadow-xl transition-all">
                <CardHeader>
                  <Lock className="w-12 h-12 text-red-600 dark:text-red-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Vítimas de Exposição</CardTitle>
                  <CardDescription>Proteção de privacidade</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-navy-200 mb-4">
                    Remoção profissional de conteúdos sensíveis com base na LGPD.
                  </p>
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    Proteção LGPD
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="py-16 bg-slate-50 dark:bg-navy-900">
          <div className="container max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Nossos Diferenciais
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-green-500/30">
                <CardHeader>
                  <Cpu className="w-12 h-12 text-green-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Tecnologia Avançada</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Processamento de +100k registros simultâneos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Integração com múltiplas bases de dados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Automação inteligente de análises</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-500/30">
                <CardHeader>
                  <Shield className="w-12 h-12 text-green-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Segurança e Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Conformidade total com LGPD</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Criptografia de dados sensíveis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Auditoria completa de processos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-green-500/30">
                <CardHeader>
                  <Target className="w-12 h-12 text-green-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Resultados Precisos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Relatórios detalhados e acionáveis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Análise de múltiplas fontes públicas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Entrega rápida e eficiente</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-white dark:bg-navy-950">
          <div className="container max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
              Pronto para começar?
            </h2>
            <p className="text-lg text-slate-700 dark:text-navy-200 mb-8">
              Entre em contato e descubra como podemos ajudar na sua investigação.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contato">
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white">
                  Falar com especialista
                </Button>
              </Link>
              <Link href="/servicos">
                <Button size="lg" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">
                  Ver serviços
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <WhatsAppWidget />
      </main>
      <Footer />
    </>
  );
}

