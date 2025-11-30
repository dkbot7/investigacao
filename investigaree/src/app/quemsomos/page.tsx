"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";
import {
  Shield, Award, BookOpen, Users, Target, CheckCircle,
  ArrowRight, Briefcase, GraduationCap, Globe, UserCheck
} from "lucide-react";

const TEAM = [
  {
    id: "ibsen-maciel",
    nome: "Ibsen Rodrigues Maciel",
    cargo: "Advisory Board",
    especialidade: "Forense Computacional",
    badges: ["Advisory Board", "Perito Criminal Oficial", "Diretor ANPAJ"],
    resumo: "Referência nacional em Perícia Forense Computacional. Diretor Nacional de Perícias em Computação Forense da ANPAJ. 1º lugar no concurso da PCE-PA 2019 e 1º lugar como Oficial do Exército 2017/18. Integrante do LABCEDF - Laboratório de Computação e Extração de Dados Forenses da Polícia Civil do Estado do Pará.",
    certificacoes: ["CELLEBRITE UFED", "XRY MSAB", "Magnet AXIOM"],
    destaques: [
      "1º Lugar Concurso PCE-PA (2019)",
      "LABCEDF - Polícia Civil do Estado do Pará",
      "Diretor Nacional de Perícias - ANPAJ (6.000+ associados)"
    ]
  },
  {
    id: "dani-kaloi",
    nome: "Dani Kaloi",
    cargo: "Fundadora & CTO",
    especialidade: "IA Generativa & Investigacao em Massa",
    badges: ["Fundadora", "Arquiteta de IA", "OSINT Expert"],
    resumo: "Referencia nacional em investigacao digital com IA. Arquiteta de sistemas de automacao que processam milhares de registros simultaneamente, cruzando dados de 15+ fontes publicas. Especialista em investigacao de agentes politicos, servidores publicos e compliance eleitoral.",
    certificacoes: ["IA Generativa AWS", "OSINT", "LGPD DPO", "Machine Learning"],
    destaques: [
      "Processamento de +100.000 registros/investigacao",
      "15+ APIs governamentais integradas (TSE, SERPRO, CGU)",
      "Automacoes com GPT-5, Claude Opus 4.5 e Gemini 3"
    ]
  }
];

export default function QuemSomosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-navy-950">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-navy-50 to-navy-100 dark:from-navy-900 dark:to-navy-950">
          <div className="container max-w-7xl px-4">
            <div className="text-center space-y-6">
              <Badge variant="outline" className="text-gold-600 dark:text-gold-400 border-gold-300 dark:border-gold-500">
                Quem Somos
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-navy-900 dark:text-white">
                Investigacao Digital com IA em Escala
              </h1>
              <p className="text-xl text-navy-600 dark:text-navy-200 max-w-3xl mx-auto">
                Processamos <strong className="text-gold-600 dark:text-gold-400">+100 mil registros</strong> com GPT-5, Claude Opus 4.5 e Gemini 3.
                Especializados em <strong>politicos, servidores publicos</strong> e
                <strong> protecao patrimonial para mulheres em divorcios</strong>.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Badge className="bg-navy-800 text-white">50+ Bases de Dados</Badge>
                <Badge className="bg-gold-500 text-navy-900">IA Generativa</Badge>
                <Badge className="bg-navy-600 text-white">Protecao Patrimonial</Badge>
                <Badge className="bg-gold-600 text-white">Perito Criminal Oficial</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20 bg-navy-50 dark:bg-navy-900/50">
          <div className="container max-w-7xl px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
              <Card className="border-2 border-navy-500/30 bg-gradient-to-br from-navy-800 to-navy-900 hover:border-gold-500/50 transition-all">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-gold-400" />
                  </div>
                  <CardTitle className="text-white">Nossa Missao</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-navy-200 text-center">
                    Processar <strong className="text-gold-400">grandes volumes de dados</strong> com IA generativa
                    para proteger orgaos publicos, partidos politicos e
                    <strong className="text-gold-400"> mulheres em divorcios</strong> contra fraudes e ocultacao patrimonial.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-gold-500/30 bg-gradient-to-br from-navy-800 to-navy-900 hover:border-gold-500/50 transition-all">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gold-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-gold-400" />
                  </div>
                  <CardTitle className="text-white">Nossa Tecnologia</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-purple-100/80 text-center">
                    <strong className="text-purple-300">GPT-5, Claude Opus 4.5 e Gemini 3</strong> integrados
                    com 50+ bases de dados nacionais e internacionais. Processamento de
                    <strong className="text-purple-300"> +100 mil registros</strong> em horas, nao semanas.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-500/30 bg-gradient-to-br from-amber-950 to-amber-900 hover:border-amber-400/50 transition-all">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-amber-400" />
                  </div>
                  <CardTitle className="text-white">Nossa Credibilidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-amber-100/80 text-center">
                    <strong className="text-amber-300">Perito Criminal Oficial</strong> no Advisory Board
                    (1o lugar PCE-PA 2019). Metodologia forense com validade judicial.
                    <strong className="text-amber-300"> 100% LGPD compliant.</strong>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Team Section */}
            <div className="space-y-8">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">
                  Nosso Time
                </Badge>
                <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                  Pericia Forense + Automacao com IA
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
                  Combinacao unica: <strong>Perito Criminal Oficial</strong> (1o lugar PCE-PA) +
                  <strong> Arquiteta de IA</strong> com 16+ certificacoes em Machine Learning.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {TEAM.map((member) => (
                  <Card
                    key={member.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    <Link href={`/quemsomos/${member.id}`}>
                      <div className="relative h-64 bg-gradient-to-br from-navy-900 to-navy-950">
                        {member.id === "ibsen-maciel" ? (
                          <Image
                            src="/images/ibsen-maciel.jpg"
                            alt={member.nome}
                            fill
                            className="object-cover object-top"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <UserCheck className="w-24 h-24 text-primary-500/30" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          {member.badges.slice(0, 2).map((badge, idx) => (
                            <Badge key={idx} className="bg-white/90 text-neutral-800">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="text-2xl group-hover:text-primary-600 transition-colors">
                          {member.nome}
                        </CardTitle>
                        <CardDescription className="text-lg">
                          {member.cargo}
                        </CardDescription>
                        <Badge variant="outline" className="w-fit mt-2">
                          {member.especialidade}
                        </Badge>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-neutral-600 dark:text-neutral-400">
                          {member.resumo}
                        </p>

                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-neutral-700 dark:text-neutral-300">
                            Destaques:
                          </h4>
                          <ul className="space-y-2">
                            {member.destaques.slice(0, 3).map((destaque, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                  {destaque}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4">
                          <Button className="w-full group-hover:bg-primary-700" size="lg">
                            Ver Perfil Completo
                            <ArrowRight className="ml-2 w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-6xl px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">
                Por que escolher a investigaree
              </Badge>
              <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
                IA Generativa + Metodologia Forense
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="text-center border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="font-semibold mb-2">+100 mil Registros</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Processamento em massa com GPT-5, Claude e Gemini 3
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">50+ Bases de Dados</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Fontes nacionais (TSE, SERPRO, CGU) e internacionais
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-7 h-7 text-amber-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Validade Judicial</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Perito Criminal Oficial no Advisory Board
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-2">100% LGPD</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Compliance total com fontes publicas e audit trail
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
          <div className="container max-w-4xl px-4 text-center space-y-6">
            <h2 className="text-4xl font-bold text-white">
              Precisa investigar milhares de pessoas?
            </h2>
            <p className="text-lg text-primary-100">
              Folhas de pagamento, candidatos, filiados, fornecedores, funcionarios...
              <br />Nossa IA processa qualquer volume com precisao e velocidade.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pb-4">
              <Badge className="bg-white/20 text-white border-white/30">Orgaos Publicos</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Partidos Politicos</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Mulheres em Divorcio</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Empresas</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/servicos">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                  Ver Servicos
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <WhatsAppButton
                message="Ola! Preciso de uma investigacao em grande volume. Gostaria de um orcamento."
                source="quemsomos"
                className="px-8 py-6 text-lg border-2 border-white/50 bg-transparent hover:bg-white/10 text-white rounded-lg"
              >
                Solicitar Orcamento
              </WhatsAppButton>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}