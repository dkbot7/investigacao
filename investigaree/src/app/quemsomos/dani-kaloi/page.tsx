"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import {
  ArrowLeft, Briefcase, GraduationCap,
  Shield, CheckCircle, MapPin,
  FileSearch, Search, Users
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
                    Danielle Kaloi
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-primary-500 text-white">
                      CEO investigaree
                    </Badge>
                    <Badge className="bg-blue-600 text-white">
                      Investigadora Particular
                    </Badge>
                    <Badge className="bg-purple-600 text-white">
                      Especialista OSINT
                    </Badge>
                  </div>
                  <p className="text-xl text-neutral-600 dark:text-neutral-400">
                    Investigadora Particular especializada em Due Diligence, OSINT e Inteligência Empresarial.
                    Graduanda em Criminologia, com foco em proteção patrimonial para investidores,
                    empresas e famílias.
                  </p>
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
                          CEO investigaree
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
                          Investigação & OSINT
                        </span>
                      </div>
                    </div>

                    <Link href="/contato" className="block">
                      <Button className="w-full" size="lg">
                        Solicitar Investigação
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Áreas de Expertise */}
        <section className="py-20">
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
                      <CardTitle className="text-lg">OSINT</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Open Source Intelligence
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Análise de redes sociais</li>
                    <li>• Investigação de pegada digital</li>
                    <li>• Verificação de identidades</li>
                    <li>• Rastreamento de informações públicas</li>
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

              {/* Proteção Familiar */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <Users className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Proteção Familiar</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Segurança para Famílias
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Verificação de funcionários domésticos</li>
                    <li>• Proteção digital de adolescentes</li>
                    <li>• Análise de vulnerabilidades</li>
                    <li>• Consultoria de segurança</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Formação */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-12">
              Formação Acadêmica
            </h2>

            <div className="space-y-6 max-w-3xl">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-8 h-8 text-primary-500" />
                    <div>
                      <CardTitle>Tecnólogo em Criminologia</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Cruzeiro do Sul Virtual • Em andamento
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Formação focada em compreender o comportamento humano sob a perspectiva criminológica,
                    explorando as nuances entre a sociedade e os avanços tecnológicos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Foco Profissional */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-12">
              Foco Profissional
            </h2>

            <div className="max-w-3xl">
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Investigação em Fontes Abertas (OSINT)</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Coleta e análise de informações públicas para investigações</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Due Diligence Corporativa</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Verificação de antecedentes e análise de riscos empresariais</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Conformidade com LGPD</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Investigações realizadas em conformidade com a legislação brasileira</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-4xl px-4 text-center space-y-6">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Precisa de uma investigação?
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Entre em contato para uma consulta confidencial sobre seu caso.
            </p>
            <Link href="/contato">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Solicitar Investigação
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
