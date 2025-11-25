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
  FileSearch, Database, Cpu, Lock, Server
} from "lucide-react";

export default function IbsenMacielPage() {
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
                    Ibsen Rodrigues Maciel
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-gold-500 text-navy-950 font-bold">
                      Advisory Board investigaree
                    </Badge>
                    <Badge className="bg-primary-500 text-white">
                      Perito Criminal Oficial
                    </Badge>
                    <Badge className="bg-blue-600 text-white">
                      Diretor Nacional ANPAJ
                    </Badge>
                  </div>
                  <p className="text-xl text-neutral-600 dark:text-neutral-400">
                    Um dos maiores especialistas em Perícia Forense Computacional do Brasil,
                    com atuação destacada na Polícia Científica do Estado do Pará e
                    reconhecimento nacional como referência em investigações digitais e combate ao cibercrime.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-primary-600">15+</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Anos de Experiência</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-primary-600">500+</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Casos Resolvidos</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-3xl font-bold text-primary-600">3</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Certificações Premium</p>
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
                          Polícia Científica do Pará
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Belém, Pará, Brasil
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          DECCC - Crimes Cibernéticos
                        </span>
                      </div>
                    </div>

                    <Badge className="w-full text-center py-3 bg-gold-500/20 border-gold-500/50 text-gold-600">
                      Membro do Advisory Board
                    </Badge>
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
              {/* Current Position */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        Perito Criminal Oficial - Forense Computacional
                      </CardTitle>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Polícia Científica do Estado do Pará
                      </p>
                    </div>
                    <Badge variant="outline">2023 - Presente</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Gestor do Núcleo de Fonética Forense e Extração de Dados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Coordenação do LABCEDF - Laboratório de Computação e Extração de Dados Forense</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Análise forense de dispositivos móveis e mídias de armazenamento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Perícias em crimes cibernéticos de alta complexidade</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* ANPAJ Position */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        Diretor Nacional de Perícias em Computação Forense
                      </CardTitle>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        ANPAJ - Associação Nacional dos Peritos Judiciais
                      </p>
                    </div>
                    <Badge variant="outline">2023 - Presente</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Coordenação nacional de perícias em computação forense</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Desenvolvimento de padrões e metodologias nacionais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Capacitação de peritos em todo o Brasil</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Professor */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        Professor Especialista em Cibercrimes
                      </CardTitle>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Academia de Polícia Civil do Pará
                      </p>
                    </div>
                    <Badge variant="outline">2023 - Presente</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                    Disciplinas ministradas:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-primary-500 mt-0.5" />
                      <span className="text-sm">Cibercrimes e Investigação Digital</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-primary-500 mt-0.5" />
                      <span className="text-sm">Cadeia de Custódia e Vestígios Digitais</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-primary-500 mt-0.5" />
                      <span className="text-sm">Ferramentas de Análise Forense</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-primary-500 mt-0.5" />
                      <span className="text-sm">Extração de Dados de Dispositivos Móveis</span>
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
              Certificações e Expertise Técnica
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Certification 1 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Cpu className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">CELLEBRITE UFED</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Certificação Oficial
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Extração física e lógica de smartphones</li>
                    <li>• Recuperação de dados deletados</li>
                    <li>• Bypass de senhas e criptografia</li>
                    <li>• Análise de apps (WhatsApp, Telegram, Signal)</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Certification 2 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <Database className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">XRY da MSAB</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Especialista
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Extração avançada de iOS e Android</li>
                    <li>• Análise de cloud backups</li>
                    <li>• Geolocalização e timeline de atividades</li>
                    <li>• Relatórios periciais automatizados</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Certification 3 */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <FileSearch className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Magnet AXIOM</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Especialista
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Análise de computadores e dispositivos</li>
                    <li>• Recuperação de artefatos digitais</li>
                    <li>• Análise de internet (navegação, downloads)</li>
                    <li>• Visualização de evidências e timeline</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Expertise Areas */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <Lock className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Segurança da Informação</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Expertise
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Análise de vulnerabilidades</li>
                    <li>• Investigação de incidentes de segurança</li>
                    <li>• Proteção de dados sensíveis</li>
                    <li>• Compliance e LGPD</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Infrastructure */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                      <Server className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Infraestrutura de Redes</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Expertise
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Análise de tráfego de rede</li>
                    <li>• Investigação de invasões</li>
                    <li>• Rastreamento de ataques cibernéticos</li>
                    <li>• Perícias em infraestrutura</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Digital Evidence */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
                      <Shield className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Vestígios Tecnológicos</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Expertise
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>• Coleta e preservação de evidências digitais</li>
                    <li>• Cadeia de custódia de provas eletrônicas</li>
                    <li>• Análise de metadados e artefatos</li>
                    <li>• Laudos periciais oficiais</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Notable Cases */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-12">
              Operações e Casos de Destaque
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Operação Castelo de Cartas</CardTitle>
                  <Badge variant="outline" className="w-fit">Março-Abril 2025</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Combate ao crime organizado via tecnologia
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Coordenação da equipe forense</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Extração in loco de dados de celulares</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Laudos periciais entregues no mesmo dia</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Operação Nacional de Combate a Crimes Cibernéticos</CardTitle>
                  <Badge variant="outline" className="w-fit">2024</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    Ação integrada entre estados
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">34 mandados de prisão cumpridos em SP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Análise forense de dispositivos apreendidos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                      <span className="text-sm">Coordenação técnica da equipe do Pará</span>
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
                      <CardTitle>Bacharelado em Informática</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Universidade Estácio de Sá • 2008
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-primary-500" />
                    <div>
                      <CardTitle>Especialização em Segurança da Informação</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Universidade Estácio de Sá • 2014
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Award className="w-8 h-8 text-primary-500" />
                    <div>
                      <CardTitle>MBA em Gestão de TI e Comunicação</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Universidade Cândido Mendes • 2016
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary-500" />
                    <div>
                      <CardTitle>Oficial da Reserva - Exército Brasileiro</CardTitle>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Tenente • Tecnologia da Informação e Segurança
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}