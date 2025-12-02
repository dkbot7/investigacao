"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, CheckCircle2, ArrowRight, Cpu, Database, UserCheck } from "lucide-react";
import Link from "next/link";

export default function AdvisoryBoard() {
  return (
    <section className="py-24 bg-gradient-hero text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.1),transparent_50%)]" />

      <div className="container max-w-7xl px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <Badge
            variant="outline"
            className="mb-4 bg-gold-500/20 border-gold-500/50 text-gold-400 px-6 py-2 text-sm font-semibold"
          >
            <Shield className="w-4 h-4 mr-2 inline" />
            Nosso Time
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold">
            Automacao Avancada + Pericia Forense
          </h2>
          <p className="text-xl text-navy-100 max-w-3xl mx-auto">
            Combinacao unica no Brasil: <span className="text-gold-400">Arquiteta de Sistemas</span> especialista em automacao + <span className="text-gold-400">Perito Criminal Oficial</span> (1o lugar PCE-PA)
          </p>
        </div>

        {/* Two Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Dani Kaloi Card */}
          <Card className="bg-white/5 backdrop-blur-lg border-2 border-gold-500/30 shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-5">
                {/* Photo + Badge */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-gold-500/20 to-gold-500/10 rounded-full overflow-hidden border-2 border-gold-500/50">
                      <img
                        src="/dani-kaloi.png"
                        alt="Dani Kaloi"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <Badge className="bg-gold-500 text-navy-950 text-xs px-2 py-0.5">
                        Analista
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Dani Kaloi
                    </h3>
                    <p className="text-gold-400 font-semibold">
                      Analista de Dados
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-navy-200 text-sm">
                  Desenvolvedora Full Stack e Arquiteta de sistemas que processam <span className="text-gold-400 font-semibold">+100 mil registros simultaneamente</span>, cruzando multiplas bases de dados publicas.
                </p>

                {/* Tecnologias */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                    Tecnologias
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["Automacao", "OSINT", "Web Scraping", "APIs Publicas"].map((tech, i) => (
                      <Badge key={i} className="bg-navy-800 text-white text-xs">
                        <Database className="w-3 h-3 mr-1" />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-navy-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gold-400">100k+</p>
                    <p className="text-xs text-navy-300">Registros/Investigação</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gold-400">Multiplas</p>
                    <p className="text-xs text-navy-300">Bases de Dados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gold-400">13+</p>
                    <p className="text-xs text-navy-300">Certificações</p>
                  </div>
                </div>

                {/* Expertise */}
                <div className="flex flex-wrap gap-2">
                  {["Due Diligence", "Empresas", "Divorcios", "Automacao"].map((area, i) => (
                    <Badge key={i} variant="outline" className="bg-white/5 border-navy-700 text-navy-100 text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>

                {/* CTA */}
                <Link href="/quemsomos/dani-kaloi">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-gold-500 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 hover:text-gold-300 font-semibold"
                  >
                    Ver perfil completo
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Ibsen Maciel Card */}
          <Card className="bg-white/5 backdrop-blur-lg border-2 border-gold-500/30 shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-5">
                {/* Photo + Badge */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-navy-800 to-navy-900 rounded-full overflow-hidden border-2 border-gold-500/50">
                      <img
                        src="/images/ibsen-maciel.jpg"
                        alt="Ibsen Rodrigues Maciel"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      <Badge className="bg-gold-500 text-navy-950 text-xs px-2 py-0.5">
                        Advisory
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      Ibsen Maciel
                    </h3>
                    <p className="text-gold-400 font-semibold">
                      Perito Criminal Oficial
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-navy-200 text-sm">
                  Referência nacional em Perícia Forense Computacional. <span className="text-gold-400 font-semibold">1º lugar PCE-PA 2019</span>. Diretor Nacional de Perícias ANPAJ (6.000+ associados).
                </p>

                {/* Certificações */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gold-400 uppercase tracking-wider">
                    Certificações Internacionais
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {["CELLEBRITE UFED", "XRY (MSAB)", "Magnet AXIOM"].map((cert, i) => (
                      <Badge key={i} className="bg-navy-800 text-white text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-navy-700">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gold-400">1º</p>
                    <p className="text-xs text-navy-300">Lugar PCE-PA</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gold-400">6k+</p>
                    <p className="text-xs text-navy-300">Associados ANPAJ</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gold-400">LABCEDF</p>
                    <p className="text-xs text-navy-300">PC-PA</p>
                  </div>
                </div>

                {/* Expertise */}
                <div className="flex flex-wrap gap-2">
                  {["Perícia Forense", "Cibersegurança", "OSINT", "Cadeia de Custódia"].map((area, i) => (
                    <Badge key={i} variant="outline" className="bg-white/5 border-navy-700 text-navy-100 text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>

                {/* CTA */}
                <Link href="/quemsomos/ibsen-maciel">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-gold-500 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 hover:text-gold-300 font-semibold"
                  >
                    Ver perfil completo
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </section>
  );
}
