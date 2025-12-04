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
    cargo: "Analista de Dados",
    especialidade: "Investigacao Digital & Automacao",
    badges: ["Analista de Dados", "Arquiteta de Sistemas", "OSINT Expert"],
    resumo: "Desenvolvedora Full Stack e Arquiteta de sistemas que processam +100.000 registros simultaneamente, cruzando multiplas bases de dados - governamentais, autorais e sigilosas, nacionais e internacionais. Especialista em due diligence empresarial e protecao patrimonial para mulheres em divorcios.",
    certificacoes: ["AWS Machine Learning", "IA Generativa", "Excel Analise de Dados", "+10 outras"],
    destaques: [
      "Processamento de +100.000 registros/investigacao",
      "Multiplas fontes de dados integradas",
      "Automacoes avancadas de investigacao"
    ]
  }
];

export default function QuemSomosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-navy-950">
        {/* Hero Section - Compacto (UX: 57% do tempo acima da dobra) */}
        <section className="pt-24 pb-8 bg-gradient-to-br from-navy-900 to-navy-950">
          <div className="container max-w-6xl px-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Lado esquerdo - Padrão F */}
              <div className="space-y-3">
                <Badge variant="outline" className="text-gold-400 border-gold-500/30 bg-gold-500/10">
                  Quem Somos
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Investigacao Digital <span className="text-gold-400">em Escala</span>
                </h1>
                <p className="text-lg text-navy-200 max-w-xl">
                  <strong className="text-gold-400">+100 mil registros</strong> processados por investigacao.
                  Due diligence e protecao patrimonial.
                </p>
              </div>
              {/* Lado direito - CTAs */}
              <div className="flex flex-wrap gap-2">
                <Link href="/servicos?tab=empresarial">
                  <Button size="sm" className="bg-navy-800 hover:bg-navy-700 text-white">
                    Empresarial
                  </Button>
                </Link>
                <Link href="/servicos?tab=familiar">
                  <Button size="sm" className="bg-gold-500 hover:bg-gold-600 text-navy-900">
                    Familiar
                  </Button>
                </Link>
                <Link href="/servicos?tab=divorcios">
                  <Button size="sm" className="bg-navy-600 hover:bg-navy-700 text-white">
                    Divorcios
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section - Mais compacto */}
        <section className="py-10 bg-navy-900/50">
          <div className="container max-w-6xl px-4">
            <div className="grid md:grid-cols-2 gap-6">
                {TEAM.map((member) => (
                  <Card
                    key={member.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    <Link href={`/quemsomos/${member.id}`}>
                      <div className="relative py-12 bg-gradient-to-br from-navy-900 to-navy-950">
                        {/* Foto Circular Centralizada */}
                        <div className="flex justify-center">
                          <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-gold-500 shadow-2xl">
                            {member.id === "ibsen-maciel" ? (
                              <Image
                                src="/images/ibsen-maciel.jpg"
                                alt={member.nome}
                                fill
                                className="object-cover object-[center_25%]"
                              />
                            ) : member.id === "dani-kaloi" ? (
                              <Image
                                src="/dani-kaloi.png"
                                alt={member.nome}
                                fill
                                className="object-cover object-center"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-navy-800">
                                <UserCheck className="w-20 h-20 text-gold-500/50" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Badges */}
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
        </section>

        {/* Why Choose Us - Compacto */}
        <section className="py-10 bg-navy-950">
          <div className="container max-w-6xl px-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/20">
                <Shield className="w-5 h-5 text-gold-500" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Por que a Investigaree
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
                    Processamento em massa com tecnologia de ponta
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-neutral-200 dark:border-neutral-800 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Multiplas Bases de Dados</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Fontes nacionais e internacionais integradas
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
              Folhas de pagamento, funcionarios, fornecedores, socios...
              <br />Processamos qualquer volume com precisao e velocidade.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pb-4">
              <Badge className="bg-white/20 text-white border-white/30">Empresas</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Familias</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Mulheres em Divorcio</Badge>
              <Badge className="bg-white/20 text-white border-white/30">Investidores</Badge>
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