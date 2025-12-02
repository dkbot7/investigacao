"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Award, BookOpen, Briefcase, GraduationCap,
  Shield, CheckCircle, MapPin, Trophy, Calendar,
  FileSearch, Database, Cpu, Lock, Medal,
  Mic, Video, Smartphone, ExternalLink, Youtube,
  Newspaper, Gavel, Scale, Target, Users, Zap
} from "lucide-react";

export default function IbsenMacielPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        {/* Hero Section - Clean & Professional */}
        <section className="relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950" />
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative container max-w-7xl px-4 py-16 md:py-24">
            <Link href="/quemsomos">
              <Button variant="ghost" className="mb-8 text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar para Quem Somos
              </Button>
            </Link>

            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Photo Column */}
              <div className="lg:col-span-2 flex flex-col items-center lg:items-start">
                <div className="relative">
                  {/* Photo Frame - Circular */}
                  <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-gold-500 shadow-2xl">
                    <Image
                      src="/images/ibsen-maciel.jpg"
                      alt="Ibsen Rodrigues Maciel - Perito Criminal Oficial"
                      fill
                      className="object-cover object-[center_25%]"
                      priority
                    />
                  </div>
                  {/* Floating Badge */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gold-500 text-navy-950 px-4 py-2 rounded-full font-bold text-sm shadow-lg whitespace-nowrap">
                    Advisory Board
                  </div>
                </div>

                {/* Quick Stats - Below Photo on Mobile */}
                <div className="grid grid-cols-2 gap-3 mt-8 w-full max-w-xs">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                    <Trophy className="w-5 h-5 text-gold-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">1º</p>
                    <p className="text-xs text-white/60">PCE-PA 2019</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                    <Medal className="w-5 h-5 text-gold-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">1º</p>
                    <p className="text-xs text-white/60">Exército 2017</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                    <Users className="w-5 h-5 text-gold-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">6k+</p>
                    <p className="text-xs text-white/60">Peritos ANPAJ</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center">
                    <Shield className="w-5 h-5 text-gold-400 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-white">IDCiber</p>
                    <p className="text-xs text-white/60">Comitê</p>
                  </div>
                </div>
              </div>

              {/* Content Column */}
              <div className="lg:col-span-3 space-y-6">
                {/* Name & Title */}
                <div>
                  <p className="text-gold-400 font-medium tracking-wide uppercase text-sm mb-2">
                    Perito Criminal Oficial • Forense Computacional
                  </p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    Ibsen Rodrigues<br />
                    <span className="text-gold-400">Maciel</span>
                  </h1>
                  <p className="text-lg text-white/70 leading-relaxed max-w-2xl">
                    Referência nacional em Perícia Forense Computacional, com atuação destacada em
                    operações de combate ao crime organizado e cibercrime. Integrante do LABCEDF -
                    Laboratório de Computação e Extração de Dados Forenses da Polícia Civil do Estado do Pará.
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-primary-500/20 text-primary-300 border border-primary-500/30 px-3 py-1">
                    <Shield className="w-3 h-3 mr-1" />
                    Perito Criminal Oficial
                  </Badge>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1">
                    <Database className="w-3 h-3 mr-1" />
                    LABCEDF - DECC/PC-PA
                  </Badge>
                  <Badge className="bg-gold-500/20 text-gold-300 border border-gold-500/30 px-3 py-1">
                    <Award className="w-3 h-3 mr-1" />
                    Diretor Nacional ANPAJ
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1">
                    <Target className="w-3 h-3 mr-1" />
                    Membro IDCiber
                  </Badge>
                  <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1">
                    <Medal className="w-3 h-3 mr-1" />
                    Tenente R/2 Exército
                  </Badge>
                </div>

                {/* Location & Links */}
                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <MapPin className="w-4 h-4" />
                    <span>Belém, Pará, Brasil</span>
                  </div>
                  <a
                    href="https://www.linkedin.com/in/ibsen-maciel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Conquistas em Concursos */}
        <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge className="bg-gold-100 text-gold-700 border-gold-200 mb-4">Aprovações Públicas</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                Concursos Públicos
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl mx-auto">
                Histórico de aprovações em concursos de alta concorrência
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { pos: "1º", title: "Polícia Científica do Pará (PCE-PA)", year: "2019", desc: "Perito Criminal - Processamento de Dados", highlight: true },
                { pos: "1º", title: "Oficial Exército 1RM", year: "2017/18", desc: "Informática - Analista de Segurança", highlight: true },
                { pos: "4º", title: "IBGE", year: "2017", desc: "Analista de Sistemas - Suporte a Redes", highlight: false },
                { pos: "9º", title: "Oficial Exército 1RM", year: "2016/17", desc: "Informática - Analista de Sistemas", highlight: false },
              ].map((item, i) => (
                <Card key={i} className={`overflow-hidden transition-all hover:shadow-lg ${item.highlight ? 'ring-2 ring-gold-500/50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl ${item.highlight ? 'bg-gold-500 text-navy-950' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'}`}>
                        {item.pos}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                        <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">{item.year}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Condecorações e Honrarias */}
        <section className="py-20 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 text-white">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge className="bg-gold-500/20 text-gold-300 border-gold-500/30 mb-4">Reconhecimento</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Condecorações e Honrarias
              </h2>
              <p className="text-white/60 mt-2 max-w-2xl mx-auto">
                Medalhas e reconhecimentos por excelência em serviços prestados
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Medalha GAECO */}
              <div className="bg-white/5 backdrop-blur-sm border border-gold-500/30 rounded-2xl p-6 hover:bg-white/10 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
                    <Medal className="w-7 h-7 text-navy-950" />
                  </div>
                  <Badge className="bg-gold-500/20 text-gold-300 border-gold-500/30">Nov/2023</Badge>
                </div>
                <h3 className="text-lg font-bold mb-1 text-white">Medalha de Honra ao Mérito do GAECO</h3>
                <p className="text-primary-400 font-medium text-sm mb-3">Ministério Público do Estado do Pará</p>
                <p className="text-white/60 text-sm mb-4">
                  Grupo de Atuação Especial no Combate ao Crime Organizado - reconhecimento por atuação destacada em operações de combate ao crime organizado.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Scale className="w-4 h-4" />
                  <span>GAECO/MPPA</span>
                </div>
              </div>

              {/* Medalha FICCO */}
              <div className="bg-white/5 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:bg-white/10 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Nov/2025</Badge>
                </div>
                <h3 className="text-lg font-bold mb-1 text-white">Medalha de Reconhecimento FICCO/Pará</h3>
                <p className="text-primary-400 font-medium text-sm mb-3">Força Integrada de Combate ao Crime Organizado</p>
                <p className="text-white/60 text-sm mb-4">
                  Por reconhecimento de serviços prestados na área Pericial de Extração de Dados Forense junto à Polícia Civil do Estado do Pará.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Shield className="w-4 h-4" />
                  <span>FICCO-PA</span>
                </div>
              </div>

              {/* Medalha Exército */}
              <div className="bg-white/5 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:bg-white/10 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Out/2025</Badge>
                </div>
                <h3 className="text-lg font-bold mb-1 text-white">Medalha Força e Honra</h3>
                <p className="text-primary-400 font-medium text-sm mb-3">8ª Companhia de Inteligência do Exército Brasileiro</p>
                <p className="text-white/60 text-sm mb-4">
                  Condecoração militar por serviços prestados e colaboração com a 8ª CIA de Inteligência do Exército Brasileiro.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Medal className="w-4 h-4" />
                  <span>Exército Brasileiro</span>
                </div>
              </div>

              {/* Membro Honorário ANPAJ */}
              <div className="bg-white/5 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:bg-white/10 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Mar/2025</Badge>
                </div>
                <h3 className="text-lg font-bold mb-1 text-white">Membro Honorário ANPAJ</h3>
                <p className="text-primary-400 font-medium text-sm mb-3">Associação Nacional dos Peritos e Avaliadores Judiciais</p>
                <p className="text-white/60 text-sm mb-4">
                  Condecorado como membro honorário e nomeado Diretor Nacional de Perícias em Computação Forense da maior associação de peritos do Brasil.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Users className="w-4 h-4" />
                  <span>6.000+ Peritos</span>
                </div>
              </div>

              {/* Perito Criminal 1º Lugar */}
              <div className="bg-white/5 backdrop-blur-sm border border-gold-500/30 rounded-2xl p-6 hover:bg-white/10 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
                    <Trophy className="w-7 h-7 text-navy-950" />
                  </div>
                  <Badge className="bg-gold-500/20 text-gold-300 border-gold-500/30">2019</Badge>
                </div>
                <h3 className="text-lg font-bold mb-1 text-white">1º Colocado - Perito Criminal</h3>
                <p className="text-primary-400 font-medium text-sm mb-3">Polícia Científica do Estado do Pará (PCE-PA)</p>
                <p className="text-white/60 text-sm mb-4">
                  Aprovado em 1º lugar no concurso para Perito Criminal - Processamento de Dados do Centro de Perícias Renato Chaves.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Shield className="w-4 h-4" />
                  <span>CPC Renato Chaves</span>
                </div>
              </div>

              {/* Oficial Exército 1º Lugar */}
              <div className="bg-white/5 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:bg-white/10 transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30">2017/18</Badge>
                </div>
                <h3 className="text-lg font-bold mb-1 text-white">1º Colocado - Oficial do Exército</h3>
                <p className="text-primary-400 font-medium text-sm mb-3">Exército Brasileiro - 1ª Região Militar</p>
                <p className="text-white/60 text-sm mb-4">
                  Aprovado em 1º lugar no concurso de Oficial Temporário na área de Informática - Analista de Segurança da Informação.
                </p>
                <div className="flex items-center gap-2 text-xs text-white/50">
                  <Medal className="w-4 h-4" />
                  <span>Tenente R/2</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trajetória Profissional */}
        <section className="py-20 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-16">
              <Badge className="bg-primary-100 text-primary-700 border-primary-200 mb-4">Carreira</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                Trajetória Profissional
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-3 max-w-2xl mx-auto">
                Mais de 15 anos de experiência em tecnologia da informação, segurança cibernética e perícia forense computacional
              </p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 text-center shadow-sm border border-neutral-100 dark:border-neutral-700">
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">15+</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Anos de Experiência</p>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 text-center shadow-sm border border-neutral-100 dark:border-neutral-700">
                <p className="text-3xl font-bold text-gold-500">4</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Concursos Aprovado</p>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 text-center shadow-sm border border-neutral-100 dark:border-neutral-700">
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">3</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Pós-Graduações</p>
              </div>
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 text-center shadow-sm border border-neutral-100 dark:border-neutral-700">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">6k+</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Peritos na Rede</p>
              </div>
            </div>

            <div className="max-w-5xl mx-auto">
              {/* Timeline */}
              <div className="relative">
                {/* Line */}
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-500 via-primary-500 via-blue-500 via-green-500 to-neutral-300 dark:to-neutral-700 rounded-full" />

                {/* Items */}
                <div className="space-y-6">

                  {/* ANPAJ */}
                  <div className="relative flex gap-4 md:gap-8">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center z-10 shadow-lg shadow-gold-500/30 ring-4 ring-white dark:ring-neutral-900">
                        <Award className="w-6 h-6 md:w-7 md:h-7 text-navy-950" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-neutral-900">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <Card className="flex-1 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-1 bg-gradient-to-r from-gold-400 to-gold-600" />
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                                Diretor Nacional de Perícias em Computação Forense
                              </h3>
                            </div>
                            <p className="text-primary-600 dark:text-primary-400 font-semibold">
                              ANPAJ - Associação Nacional dos Peritos e Avaliadores Judiciais
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              Maior associação de peritos judiciais do Brasil
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-green-200 px-3">
                            Mar/2025 - Atual
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-gold-50 dark:bg-gold-900/20 rounded-xl p-4">
                            <p className="text-sm font-semibold text-gold-700 dark:text-gold-400 mb-2">Conquista</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              Condecorado como <strong>membro honorário</strong> da associação em cerimônia oficial
                            </p>
                          </div>
                          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
                            <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">Responsabilidades</p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                              Coordenação nacional de perícias em computação forense e capacitação técnica
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">Computação Forense</Badge>
                          <Badge variant="outline" className="text-xs">Coordenação Nacional</Badge>
                          <Badge variant="outline" className="text-xs">6.000+ Peritos</Badge>
                          <Badge variant="outline" className="text-xs">Capacitação</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* IDCiber */}
                  <div className="relative flex gap-4 md:gap-8">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center z-10 shadow-lg shadow-cyan-500/30 ring-4 ring-white dark:ring-neutral-900">
                        <Target className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                    </div>
                    <Card className="flex-1 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-1 bg-gradient-to-r from-cyan-400 to-cyan-600" />
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                              Membro do Comitê Público
                            </h3>
                            <p className="text-primary-600 dark:text-primary-400 font-semibold">
                              IDCiber - Instituto de Defesa Cibernética
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              Instituto fundado em 2023 para enfrentar ameaças cibernéticas
                            </p>
                          </div>
                          <Badge variant="outline" className="px-3">2023 - Atual</Badge>
                        </div>

                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                          O IDCiber surgiu da colaboração entre líderes governamentais, acadêmicos e representantes da indústria
                          de tecnologia, focando em desenvolver soluções abrangentes de cibersegurança e proteção de infraestruturas críticas.
                        </p>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">Cibersegurança</Badge>
                          <Badge variant="outline" className="text-xs">Defesa Cibernética</Badge>
                          <Badge variant="outline" className="text-xs">Pesquisa</Badge>
                          <Badge variant="outline" className="text-xs">Infraestrutura Crítica</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Polícia Civil - LABCEDF */}
                  <div className="relative flex gap-4 md:gap-8">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center z-10 shadow-lg shadow-primary-500/30 ring-4 ring-white dark:ring-neutral-900">
                        <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-neutral-900">
                        <Trophy className="w-3 h-3 text-navy-950" />
                      </div>
                    </div>
                    <Card className="flex-1 overflow-hidden hover:shadow-lg transition-shadow border-2 border-primary-200 dark:border-primary-800">
                      <div className="h-1 bg-gradient-to-r from-primary-400 to-primary-600" />
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                                Perito Criminal Oficial
                              </h3>
                              <Badge className="bg-gold-100 text-gold-700 border-gold-200 text-xs">
                                1º Lugar
                              </Badge>
                            </div>
                            <p className="text-primary-600 dark:text-primary-400 font-semibold">
                              Polícia Civil do Estado do Pará (PC-PA)
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              LABCEDF - Laboratório de Computação e Extração de Dados Forenses - DECC
                            </p>
                          </div>
                          <Badge variant="outline" className="px-3">2019 - Atual</Badge>
                        </div>

                        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-4">
                          <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-3">Atuação Principal</p>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">Integrante do LABCEDF - Laboratório de Computação e Extração de Dados Forenses</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">DECC - Diretoria Estadual de Combate à Corrupção da PC-PA</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">Perícias em áudio, vídeo, imagem e comparação de locutor</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">Local de crime e busca e apreensão digital</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 text-center">
                            <Smartphone className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">Extração Mobile</p>
                          </div>
                          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 text-center">
                            <Video className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">Análise de Vídeo</p>
                          </div>
                          <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-3 text-center">
                            <Mic className="w-5 h-5 text-primary-500 mx-auto mb-1" />
                            <p className="text-xs text-neutral-600 dark:text-neutral-400">Fonética Forense</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">Forense Computacional</Badge>
                          <Badge variant="outline" className="text-xs">Crimes Cibernéticos</Badge>
                          <Badge variant="outline" className="text-xs">Extração de Dados</Badge>
                          <Badge variant="outline" className="text-xs">Laudos Periciais</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Professor */}
                  <div className="relative flex gap-4 md:gap-8">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center z-10 shadow-lg shadow-blue-500/30 ring-4 ring-white dark:ring-neutral-900">
                        <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                    </div>
                    <Card className="flex-1 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600" />
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                              Professor Especialista em Crimes Cibernéticos
                            </h3>
                            <p className="text-primary-600 dark:text-primary-400 font-semibold">
                              Academia de Polícia Civil do Estado do Pará
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              Formação de policiais civis em investigação digital
                            </p>
                          </div>
                          <Badge variant="outline" className="px-3">2023 - Atual</Badge>
                        </div>

                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                          Responsável pela capacitação de policiais civis nas áreas de crimes cibernéticos,
                          cadeia de custódia de evidências digitais e técnicas de análise forense.
                        </p>

                        <div className="mb-4">
                          <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Disciplinas Ministradas:</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">Crimes Cibernéticos</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">Cadeia de Custódia</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">Vestígios Digitais</span>
                            </div>
                            <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="text-sm text-neutral-600 dark:text-neutral-400">Análise Forense</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Gerente Renato Chaves */}
                  <div className="relative flex gap-4 md:gap-8">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center z-10 shadow-lg shadow-indigo-500/30 ring-4 ring-white dark:ring-neutral-900">
                        <Database className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                    </div>
                    <Card className="flex-1 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-1 bg-gradient-to-r from-indigo-400 to-indigo-600" />
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                              Gerente de Fonética e Extração de Dados
                            </h3>
                            <p className="text-primary-600 dark:text-primary-400 font-semibold">
                              Centro de Perícias Científicas Renato Chaves
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              Gestão do núcleo especializado em evidências digitais
                            </p>
                          </div>
                          <Badge variant="outline" className="px-3">2022 - 2024</Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-3 mb-4">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Forense Computacional</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Análise de vestígios digitais</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Gestão de equipe técnica</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Exército */}
                  <div className="relative flex gap-4 md:gap-8">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center z-10 shadow-lg shadow-green-500/30 ring-4 ring-white dark:ring-neutral-900">
                        <Medal className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center ring-2 ring-white dark:ring-neutral-900">
                        <Trophy className="w-3 h-3 text-navy-950" />
                      </div>
                    </div>
                    <Card className="flex-1 overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="h-1 bg-gradient-to-r from-green-500 to-green-700" />
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
                                Oficial Temporário - Tenente (R/2)
                              </h3>
                              <Badge className="bg-gold-100 text-gold-700 border-gold-200 text-xs">
                                1º Lugar
                              </Badge>
                            </div>
                            <p className="text-primary-600 dark:text-primary-400 font-semibold">
                              Exército Brasileiro - Hospital Central do Exército
                            </p>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                              Rio de Janeiro, RJ
                            </p>
                          </div>
                          <Badge variant="outline" className="px-3">2016 - 2018</Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Funções Exercidas:</p>
                            <ul className="space-y-1">
                              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                Adjunto na Divisão de TI
                              </li>
                              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                Adjunto no Setor de Engenharia
                              </li>
                              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                Comandante de Combate a Incêndio
                              </li>
                              <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                Chefe do Setor de Internação
                              </li>
                            </ul>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                            <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Áreas de Atuação Militar</p>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs border-green-300 text-green-700">Informática</Badge>
                              <Badge variant="outline" className="text-xs border-green-300 text-green-700">Segurança da Informação</Badge>
                              <Badge variant="outline" className="text-xs border-green-300 text-green-700">Engenharia</Badge>
                              <Badge variant="outline" className="text-xs border-green-300 text-green-700">Combate a Incêndio</Badge>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gold-50 dark:bg-gold-900/20 rounded-xl p-4">
                          <div className="flex items-center gap-3">
                            <Trophy className="w-6 h-6 text-gold-500" />
                            <div>
                              <p className="text-sm font-bold text-gold-700 dark:text-gold-400">
                                1º Colocado - Concurso Oficial do Exército 1RM 2017/18
                              </p>
                              <p className="text-xs text-neutral-500">Área: Informática - Analista de Segurança da Informação</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Operações Policiais */}
        <section className="py-20 bg-navy-950 text-white">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge className="bg-red-500/20 text-red-300 border-red-500/30 mb-4">Atuação em Campo</Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Operações Policiais de Destaque
              </h2>
              <p className="text-white/60 mt-2 max-w-2xl mx-auto">
                Participação em operações de grande repercussão com atuação pericial decisiva
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Operação Guardião Digital */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-red-400" />
                  </div>
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Jul/2024</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Operação Guardião Digital</h3>
                <p className="text-white/60 text-sm mb-4">
                  Megaoperação interestadual (PA-SP) coordenada pela DECCC em 12 municípios
                </p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">34</p>
                    <p className="text-xs text-white/50">Prisões</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">104</p>
                    <p className="text-xs text-white/50">Buscas</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">Falsos leilões</Badge>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">Golpe PIX</Badge>
                  <Badge variant="outline" className="text-xs border-white/20 text-white/70">Clonagem WhatsApp</Badge>
                </div>
              </div>

              {/* Operação Pombo */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <Scale className="w-6 h-6 text-purple-400" />
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">2022</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Operação Pombo</h3>
                <p className="text-white/60 text-sm mb-4">
                  Combate a advogados "mensageiros" de facções em unidades prisionais - GAECO/MPPA
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Desbloqueio de celulares apreendidos
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Perícia fonética e comparação de locutor
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    2 advogados presos preventivamente
                  </li>
                </ul>
              </div>

              {/* Caso Tiroteio Restaurante */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Video className="w-6 h-6 text-blue-400" />
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Abr/2022</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Caso Tiroteio em Restaurante</h3>
                <p className="text-white/60 text-sm mb-4">
                  Reconstituição 3D de cena de crime com análise forense de vídeo em Belém
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Análise forense de vídeos de segurança
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Modelagem computacional 3D da cena
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Apresentado na InterForensics 2023
                  </li>
                </ul>
              </div>

              {/* Caso Magistrada */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                    <Gavel className="w-6 h-6 text-orange-400" />
                  </div>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Mai/2022</Badge>
                </div>
                <h3 className="text-xl font-bold mb-2">Caso Morte de Magistrada</h3>
                <p className="text-white/60 text-sm mb-4">
                  Requisição do TJPA (Ofício Nº 419/2022-SJ) para perícia em DVR
                </p>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Extração de dados ativos e recuperados
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Análise de imagens de 16-17/05/2022
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Apresentado na InterForensics 2023
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Palestras & Eventos */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 mb-4">Conferências</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                Palestras e Eventos
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* XibéSec 2025 */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Mic className="w-8 h-8 text-green-500" />
                    <Badge className="bg-green-100 text-green-700">Confirmado</Badge>
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">XibéSec 2025</h3>
                  <p className="text-sm text-neutral-500 mb-3">Belém, PA • 13 de Setembro</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    "Casos reais de desbloqueio de celulares Android e Apple utilizando técnicas forenses"
                  </p>
                </CardContent>
              </Card>

              {/* XibéSec 2024 */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-2 bg-gradient-to-r from-gold-500 to-amber-500" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Mic className="w-8 h-8 text-gold-500" />
                    <Badge variant="outline">Realizado</Badge>
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">XibéSec 2024</h3>
                  <p className="text-sm text-neutral-500 mb-3">UNAMA, Belém • 23 de Novembro</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    "Perícias criminais em Forense Computacional - 2 casos de repercussão no Pará"
                  </p>
                </CardContent>
              </Card>

              {/* InterForensics 2023 */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Mic className="w-8 h-8 text-blue-500" />
                    <Badge variant="outline">3 Trabalhos</Badge>
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">InterForensics 2023</h3>
                  <p className="text-sm text-neutral-500 mb-3">Brasília, DF • 28-31 Agosto</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Maior evento de Ciências Forenses da América Latina • 220 palestrantes
                  </p>
                </CardContent>
              </Card>

              {/* ANPAJ */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Award className="w-8 h-8 text-purple-500" />
                    <Badge variant="outline">Condecoração</Badge>
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">ANPAJ 2025</h3>
                  <p className="text-sm text-neutral-500 mb-3">10 de Março</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Condecorado como Diretor Nacional de Perícias em Computação Forense
                  </p>
                </CardContent>
              </Card>

              {/* Live YouTube */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-2 bg-gradient-to-r from-red-500 to-rose-500" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Youtube className="w-8 h-8 text-red-500" />
                    <Badge className="bg-red-100 text-red-700">YouTube</Badge>
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">Live Prof. Juliano Ramos</h3>
                  <p className="text-sm text-neutral-500 mb-3">Canal YouTube • 2025</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    3 casos reais de perícias com repercussão nacional
                  </p>
                </CardContent>
              </Card>

              {/* Coletiva */}
              <Card className="overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <Newspaper className="w-8 h-8 text-cyan-500" />
                    <Badge variant="outline">Imprensa</Badge>
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">Agência Pará</h3>
                  <p className="text-sm text-neutral-500 mb-3">4 de Julho de 2024</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Coletiva de imprensa sobre a Operação Guardião Digital
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Ferramentas & Certificações */}
        <section className="py-20 bg-neutral-50 dark:bg-neutral-900">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 mb-4">Expertise Técnica</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                Ferramentas Forenses
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Certificações e especializações em ferramentas líderes de mercado
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Smartphone, title: "CELLEBRITE UFED", subtitle: "Especialista Certificado", color: "blue", items: ["UFED 4PC e Physical Analyzer", "Bypass de senhas e criptografia", "Recuperação de dados deletados"] },
                { icon: Database, title: "XRY da MSAB", subtitle: "Especialista", color: "green", items: ["Extração avançada iOS/Android", "Análise de cloud backups", "Geolocalização e timeline"] },
                { icon: FileSearch, title: "Magnet AXIOM", subtitle: "Especialista", color: "purple", items: ["Análise de computadores e mobile", "Recuperação de artefatos digitais", "Cloud forensics"] },
                { icon: Cpu, title: "Snap Maltego", subtitle: "OSINT e Inteligência", color: "orange", items: ["Open Source Intelligence", "Mapeamento de relacionamentos", "Análise de redes sociais"] },
                { icon: Lock, title: "Cibersegurança", subtitle: "Expertise Técnica", color: "red", items: ["Guerra Cibernética", "Análise de malware", "Investigação de incidentes"] },
                { icon: Shield, title: "Perícia Forense", subtitle: "Especialidades", color: "indigo", items: ["Fonética Forense", "Análise de áudio e vídeo", "Cadeia de custódia digital"] },
              ].map((item, i) => (
                <Card key={i} className="hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-900/30 flex items-center justify-center mb-4`}>
                      <item.icon className={`w-6 h-6 text-${item.color}-600 dark:text-${item.color}-400`} />
                    </div>
                    <h3 className="font-bold text-lg text-neutral-900 dark:text-white">{item.title}</h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 mb-3">{item.subtitle}</p>
                    <ul className="space-y-1">
                      {item.items.map((li, j) => (
                        <li key={j} className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-neutral-400" />
                          {li}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Formação Acadêmica */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 mb-4">Educação</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
                Formação Acadêmica
              </h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { icon: GraduationCap, title: "Bacharelado em Análise e Desenvolvimento de Sistemas", inst: "Universidade Estácio de Sá", year: "2008", extra: "TCC: \"AS-IS – Sistema de Gerência de Processos\"" },
                { icon: Award, title: "Pós-Graduação em Segurança da Informação", inst: "Universidade Estácio de Sá", year: "2014", extra: null },
                { icon: Award, title: "MBA em Gestão de TI e da Comunicação", inst: "Universidade Cândido Mendes", year: "2016", extra: null },
                { icon: Medal, title: "Formação Militar - Oficial da Reserva", inst: "Exército Brasileiro • Tenente (R/2)", year: "2016-2018", extra: "Informática, Segurança, Engenharia, Combate a Incêndio" },
              ].map((item, i) => (
                <Card key={i} className="hover:shadow-md transition-all">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-neutral-900 dark:text-white">{item.title}</h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.inst}</p>
                          {item.extra && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">{item.extra}</p>
                          )}
                        </div>
                        <Badge variant="outline">{item.year}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fontes e Referências */}
        <section className="py-12 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
          <div className="container max-w-7xl px-4">
            <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
              Fontes e Referências Públicas
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {[
                { label: "LinkedIn", url: "https://www.linkedin.com/in/ibsen-maciel/" },
                { label: "ANPAJ", url: "https://www.anpaj.org.br/2025/03/convite-especial-desvendando-os_24.html" },
                { label: "IDCiber", url: "https://idciber.org/comite-publico/" },
                { label: "Escavador", url: "https://www.escavador.com/sobre/2051704575/ibsen-rodrigues-maciel" },
                { label: "QConcursos", url: "https://www.qconcursos.com/usuario/perfil/ibsenmaciel" },
                { label: "XibéSec 2024", url: "https://www.sympla.com.br/evento/xibesec-2024/2639304" },
                { label: "XibéSec 2025", url: "https://www.sympla.com.br/evento/xibesec-2025/2960299" },
                { label: "Op. Guardião Digital", url: "https://agenciapara.com.br/noticia/57674/" },
                { label: "InterForensics", url: "https://interforensics.com/" },
                { label: "Polícia Científica PA", url: "https://www.policiacientifica.pa.gov.br/" },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
