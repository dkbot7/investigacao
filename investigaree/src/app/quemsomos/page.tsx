"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import Image from "next/image";
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
    badges: ["Advisory Board", "Perito Criminal Oficial", "ANPAJ"],
    resumo: "Perito Criminal Oficial em Forense Computacional da Polícia Científica do Pará e Diretor Nacional de Perícias em Computação Forense da ANPAJ. Membro do Advisory Board da investigaree.",
    certificacoes: ["CELLEBRITE UFED", "XRY MSAB", "Magnet AXIOM"],
    destaques: [
      "Membro do Advisory Board da investigaree",
      "Diretor Nacional de Perícias - ANPAJ",
      "Perito Criminal Oficial - Polícia Científica do Pará"
    ]
  },
  {
    id: "dani-kaloi",
    nome: "Danielle Kaloi",
    cargo: "CEO & Investigadora",
    especialidade: "OSINT e Due Diligence",
    badges: ["CEO investigaree", "Especialista OSINT"],
    resumo: "Investigadora Particular especializada em Due Diligence, OSINT e Inteligência Empresarial. Graduanda em Criminologia.",
    certificacoes: ["OSINT", "Due Diligence", "LGPD"],
    destaques: [
      "Fundadora e CEO da investigaree",
      "Especialista em Due Diligence",
      "Graduanda em Criminologia"
    ]
  }
];

export default function QuemSomosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-7xl px-4">
            <div className="text-center space-y-6">
              <Badge variant="outline" className="text-primary-600 dark:text-primary-400">
                Quem Somos
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100">
                Expertise que Protege seu Patrimônio
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                Combinamos a precisão da perícia forense oficial com a agilidade da investigação privada
                para oferecer a mais completa proteção patrimonial do Brasil.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <div className="grid md:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
              <Card className="border-neutral-200 dark:border-neutral-800">
                <CardHeader className="text-center">
                  <Target className="w-10 h-10 text-primary-500 mb-4 mx-auto" />
                  <CardTitle>Nossa Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 dark:text-neutral-400 text-center">
                    Proteger o patrimônio de famílias e empresas através de investigações profundas
                    e metodologias forenses, prevenindo fraudes e mitigando riscos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 dark:border-neutral-800">
                <CardHeader className="text-center">
                  <Shield className="w-10 h-10 text-primary-500 mb-4 mx-auto" />
                  <CardTitle>Nossos Valores</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 dark:text-neutral-400 text-center">
                    Ética, confidencialidade, precisão técnica e compromisso com a verdade.
                    Cada investigação segue rigorosos padrões de compliance e LGPD.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-neutral-200 dark:border-neutral-800">
                <CardHeader className="text-center">
                  <Award className="w-10 h-10 text-primary-500 mb-4 mx-auto" />
                  <CardTitle>Nossa Diferença</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 dark:text-neutral-400 text-center">
                    Única empresa com Perito Criminal Oficial no Advisory Board,
                    garantindo metodologia forense e credibilidade judicial em todas as investigações.
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
                  Liderança com Credibilidade Comprovada
                </h2>
                <p className="text-lg text-neutral-600 dark:text-neutral-400 mt-4 max-w-2xl mx-auto">
                  Nossa equipe combina décadas de experiência em perícia forense,
                  investigação privada e inteligência empresarial.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {TEAM.map((member) => (
                  <Card
                    key={member.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group"
                  >
                    <Link href={`/quemsomos/${member.id}`}>
                      <div className="relative h-64 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <UserCheck className="w-24 h-24 text-primary-500/30" />
                        </div>
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
                Metodologia Forense + Agilidade Privada
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="text-center border-neutral-200 dark:border-neutral-800">
                <CardContent className="pt-6">
                  <Shield className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">100% LGPD Compliant</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Todas as investigações seguem rigorosos padrões de compliance
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-neutral-200 dark:border-neutral-800">
                <CardContent className="pt-6">
                  <Award className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Validade Judicial</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Metodologia pericial aceita em processos judiciais
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-neutral-200 dark:border-neutral-800">
                <CardContent className="pt-6">
                  <Globe className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Alcance Nacional</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Investigações em todo território nacional e internacional
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-neutral-200 dark:border-neutral-800">
                <CardContent className="pt-6">
                  <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Equipe Certificada</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Profissionais com certificações internacionais
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container max-w-4xl px-4 text-center space-y-6">
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              Pronto para proteger seu patrimônio?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Converse com nossos especialistas e descubra como podemos ajudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/servicos">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                  Conhecer Serviços
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Agendar Conversa
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}