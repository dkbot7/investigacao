"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  CheckCircle2, Shield, TrendingUp, Scale, Heart, Building2,
  ShieldAlert, Users, ArrowRight, MessageCircle, Clock, Star
} from "lucide-react";

export default function PrecosPage() {
  const servicosB2B = [
    {
      nome: "Background Check de Pessoas",
      descricao: "Verificação de CPF, antecedentes criminais e sanções",
      preco: "R$ 500 - R$ 2.000",
      prazo: "24-48h",
      ideal: "RH e Compliance",
      icon: Users,
      color: "blue",
      includes: [
        "Validação de CPF e dados",
        "Antecedentes em 27 tribunais",
        "Sanções CEIS/CNEP",
        "Processos trabalhistas",
        "Relatório judicial"
      ]
    },
    {
      nome: "Background Check de Empresas",
      descricao: "Due diligence de CNPJ, sócios e situação fiscal",
      preco: "R$ 1.500 - R$ 5.000",
      prazo: "48-72h",
      ideal: "Investidores e Compradores",
      icon: Building2,
      color: "green",
      includes: [
        "Situação cadastral CNPJ",
        "Quadro societário completo",
        "Sanções e débitos",
        "Processos da empresa",
        "Certidões negativas"
      ]
    },
    {
      nome: "Due Diligence M&A Completa",
      descricao: "Análise profunda em 12 camadas para fusões",
      preco: "Sob consulta",
      prazo: "7-15 dias",
      ideal: "M&A e Private Equity",
      icon: TrendingUp,
      color: "purple",
      includes: [
        "Análise CNPJ 12 camadas",
        "Background todos os sócios",
        "Passivos ocultos",
        "Red flags empresariais",
        "Relatório executivo"
      ]
    },
    {
      nome: "Auditoria de Licitações",
      descricao: "Compliance TCU/CGU para licitações",
      preco: "R$ 3.000 - R$ 10.000",
      prazo: "3-5 dias",
      ideal: "Auditores Públicos",
      icon: Shield,
      color: "orange",
      includes: [
        "Auditoria 12 camadas",
        "Verificação CEIS/CNEP",
        "Detecção de cartel",
        "Análise superfaturamento",
        "Relatório TCU/CGU"
      ]
    }
  ];

  const servicosB2C = [
    {
      nome: "Remoção Emergencial",
      descricao: "Fotos íntimas e conteúdo sensível em 24-72h",
      preco: "R$ 800 - R$ 2.500",
      prazo: "24-72h",
      ideal: "Vítimas de Exposição",
      icon: ShieldAlert,
      color: "red",
      includes: [
        "Atendimento emergencial",
        "Fotos íntimas e vídeos",
        "Fundamentação LGPD",
        "Acompanhamento processo",
        "Contenção rápida"
      ]
    },
    {
      nome: "Remoção Direcionada",
      descricao: "Google, Jusbrasil, redes sociais e links",
      preco: "R$ 1.500 - R$ 5.000",
      prazo: "15-30 dias",
      ideal: "Proteção Reputacional",
      icon: Shield,
      color: "blue",
      includes: [
        "Desindexação Google",
        "Remoção Jusbrasil/Escavador",
        "Redes sociais completas",
        "Links ofensivos",
        "Relatório progresso"
      ]
    },
    {
      nome: "Varredura Reputacional Completa",
      descricao: "360° + remoção em massa + monitoramento",
      preco: "R$ 3.500 - R$ 15.000",
      prazo: "30-45 dias",
      ideal: "Crises Graves",
      icon: Star,
      color: "purple",
      includes: [
        "Varredura em 100+ fontes",
        "Estratégia customizada",
        "Remoção em massa",
        "Plano recuperação",
        "Monitoramento 90 dias"
      ]
    }
  ];

  const servicosLegal = [
    {
      nome: "Investigação Profissional Profissional",
      descricao: "Relatório com metodologia validada",
      preco: "Sob consulta",
      prazo: "10-15 dias",
      ideal: "Processos Judiciais",
      icon: Scale,
      color: "gold",
      includes: [
        "Metodologia profissional",
        "Cadeia de custódia",
        "Fontes públicas OSINT",
        "Validade judicial",
        "Conformidade LGPD"
      ]
    },
    {
      nome: "Extração Profissional de Celular",
      descricao: "Avilla Forensics + IPED",
      preco: "Sob consulta",
      prazo: "7-10 dias",
      ideal: "Provas Digitais",
      icon: Shield,
      color: "purple",
      includes: [
        "Extração com Avilla",
        "Indexação IPED",
        "Recuperação deletados",
        "Cadeia oficial",
        "Relatório técnico"
      ]
    },
    {
      nome: "Investigação Patrimonial",
      descricao: "Rastreamento para divórcios e execuções",
      preco: "R$ 2.500 - R$ 10.000",
      prazo: "7-10 dias",
      ideal: "Divórcio e Família",
      icon: Heart,
      color: "pink",
      includes: [
        "Imóveis todo Brasil",
        "Veículos registrados",
        "Participações societárias",
        "Análise incompatibilidade",
        "Rastreamento crypto"
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-50 dark:bg-blue-900/10",
        border: "border-blue-500",
        text: "text-blue-600 dark:text-blue-400",
        button: "bg-blue-600 hover:bg-blue-700"
      },
      green: {
        bg: "bg-green-50 dark:bg-green-900/10",
        border: "border-green-500",
        text: "text-green-600 dark:text-green-400",
        button: "bg-green-600 hover:bg-green-700"
      },
      purple: {
        bg: "bg-purple-50 dark:bg-purple-900/10",
        border: "border-purple-500",
        text: "text-purple-600 dark:text-purple-400",
        button: "bg-purple-600 hover:bg-purple-700"
      },
      orange: {
        bg: "bg-orange-50 dark:bg-orange-900/10",
        border: "border-orange-500",
        text: "text-orange-600 dark:text-orange-400",
        button: "bg-orange-600 hover:bg-orange-700"
      },
      red: {
        bg: "bg-red-50 dark:bg-red-900/10",
        border: "border-red-500",
        text: "text-red-600 dark:text-red-400",
        button: "bg-red-600 hover:bg-red-700"
      },
      gold: {
        bg: "bg-amber-50 dark:bg-amber-900/10",
        border: "border-amber-500",
        text: "text-amber-600 dark:text-amber-400",
        button: "bg-amber-600 hover:bg-amber-700"
      },
      pink: {
        bg: "bg-pink-50 dark:bg-pink-900/10",
        border: "border-pink-500",
        text: "text-pink-600 dark:text-pink-400",
        button: "bg-pink-600 hover:bg-pink-700"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-900">
          <div className="container max-w-5xl mx-auto px-4 text-center space-y-6">
            <Badge className="bg-green-600 text-white font-bold px-6 py-3 text-base">
              PREÇOS TRANSPARENTES
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Investimento em<br />Segurança e Proteção
            </h1>

            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              Preços justos e transparentes. Evite prejuízos milionários com investigação profissional.
              <strong className="text-green-600"> Orçamento personalizado em 24h</strong>.
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600 dark:text-slate-400 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium">5.950 investigações</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="font-medium">Resposta em 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-green-600" />
                <span className="font-medium">4.9/5 estrelas</span>
              </div>
            </div>
          </div>
        </section>

        {/* Background Check & Due Diligence - B2B */}
        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 mb-4 px-6 py-2 text-base font-bold">
                EMPRESAS, RH E INVESTIDORES
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Background Check & Due Diligence
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Evite contratar errado ou investir em empresas problemáticas
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {servicosB2B.map((servico, idx) => {
                const Icon = servico.icon;
                const colorClasses = getColorClasses(servico.color);

                return (
                  <Card key={idx} className={`border-2 ${colorClasses.border} hover:shadow-2xl transition-all`}>
                    <CardHeader>
                      <div className={`w-16 h-16 ${colorClasses.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className={`h-8 w-8 ${colorClasses.text}`} />
                      </div>
                      <CardTitle className="text-lg">{servico.nome}</CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{servico.descricao}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center py-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{servico.preco}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Prazo: {servico.prazo}</p>
                          <p className="text-xs text-slate-500 mt-1">{servico.ideal}</p>
                        </div>

                        <ul className="space-y-2">
                          {servico.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className={`h-4 w-4 ${colorClasses.text} flex-shrink-0 mt-0.5`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <Link href="/contato">
                          <Button className={`w-full ${colorClasses.button}`}>
                            Solicitar Orçamento
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Proteção & Privacidade - B2C */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 mb-4 px-6 py-2 text-base font-bold">
                PESSOAS FÍSICAS E FAMÍLIAS
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Proteção & Privacidade LGPD
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Remova conteúdos sensíveis e proteja sua reputação online
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {servicosB2C.map((servico, idx) => {
                const Icon = servico.icon;
                const colorClasses = getColorClasses(servico.color);

                return (
                  <Card key={idx} className={`border-2 ${colorClasses.border} hover:shadow-2xl transition-all`}>
                    <CardHeader>
                      <div className={`w-16 h-16 ${colorClasses.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className={`h-8 w-8 ${colorClasses.text}`} />
                      </div>
                      <CardTitle className="text-lg">{servico.nome}</CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{servico.descricao}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center py-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{servico.preco}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Prazo: {servico.prazo}</p>
                          <p className="text-xs text-slate-500 mt-1">{servico.ideal}</p>
                        </div>

                        <ul className="space-y-2">
                          {servico.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className={`h-4 w-4 ${colorClasses.text} flex-shrink-0 mt-0.5`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <Link href="/contato">
                          <Button className={`w-full ${colorClasses.button}`}>
                            Solicitar Orçamento
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Perícia Profissional - Legal */}
        <section className="py-16 bg-white dark:bg-slate-950">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 mb-4 px-6 py-2 text-base font-bold">
                ADVOGADOS E PROCESSOS JUDICIAIS
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Perícia Profissional Digital
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Provas com cadeia de custódia e validade judicial garantida
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {servicosLegal.map((servico, idx) => {
                const Icon = servico.icon;
                const colorClasses = getColorClasses(servico.color);

                return (
                  <Card key={idx} className={`border-2 ${colorClasses.border} hover:shadow-2xl transition-all`}>
                    <CardHeader>
                      <div className={`w-16 h-16 ${colorClasses.bg} rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className={`h-8 w-8 ${colorClasses.text}`} />
                      </div>
                      <CardTitle className="text-lg">{servico.nome}</CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{servico.descricao}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center py-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                          <p className="text-2xl font-bold text-slate-900 dark:text-white">{servico.preco}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Prazo: {servico.prazo}</p>
                          <p className="text-xs text-slate-500 mt-1">{servico.ideal}</p>
                        </div>

                        <ul className="space-y-2">
                          {servico.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className={`h-4 w-4 ${colorClasses.text} flex-shrink-0 mt-0.5`} />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>

                        <Link href="/contato">
                          <Button className={`w-full ${colorClasses.button}`}>
                            Solicitar Orçamento
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950">
          <div className="container max-w-4xl px-4 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Dúvidas sobre Preços?
            </h2>
            <p className="text-lg text-slate-700 dark:text-slate-300">
              Cada caso é único. Fale com um especialista para orçamento personalizado.
              <strong className="text-green-600"> Resposta garantida em 24h</strong>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a href="https://wa.me/5547992602673?text=Olá!%20Gostaria%20de%20um%20orçamento%20personalizado" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white h-14 px-10 font-bold shadow-lg">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  WhatsApp Direto (24h)
                </Button>
              </a>
              <Link href="/contato">
                <Button size="lg" variant="outline" className="h-14 px-10 font-semibold">
                  Formulário de Contato
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              🔒 Sigilo absoluto • 🛡️ Conformidade LGPD • ✅ Sem compromisso
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
