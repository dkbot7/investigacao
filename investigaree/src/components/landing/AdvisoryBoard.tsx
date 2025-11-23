"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, CheckCircle2, ExternalLink } from "lucide-react";

export default function AdvisoryBoard() {
  return (
    <section className="py-32 bg-gradient-hero text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,175,55,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.1),transparent_50%)]" />

      <div className="container max-w-7xl px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge
            variant="outline"
            className="mb-4 bg-gold-500/20 border-gold-500/50 text-gold-400 px-6 py-2 text-sm font-semibold"
          >
            <Shield className="w-4 h-4 mr-2 inline" />
            Advisory Board
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold">
            Validado por Perícia Criminal Oficial
          </h2>
          <p className="text-xl text-navy-100 max-w-3xl mx-auto">
            Nossa metodologia é certificada pelos mesmos profissionais que conduzem
            investigações criminais de nível nacional
          </p>
        </div>

        {/* Ibsen Maciel Card */}
        <Card className="max-w-5xl mx-auto bg-white/5 backdrop-blur-lg border-2 border-gold-500/30 shadow-2xl">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
              {/* Photo + ANPAJ Badge */}
              <div className="space-y-6">
                <div className="relative">
                  {/* Placeholder for professional photo */}
                  <div className="w-full aspect-[3/4] bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl overflow-hidden border-4 border-gold-500/50">
                    <div className="w-full h-full flex items-center justify-center">
                      <Shield className="w-24 h-24 text-gold-500/30" />
                    </div>
                    {/* TODO: Replace with actual photo */}
                    {/* <img
                      src="/images/ibsen-maciel.jpg"
                      alt="Ibsen José Baré Maciel"
                      className="w-full h-full object-cover"
                    /> */}
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-premium text-navy-950 shadow-lg px-4 py-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      VERIFICADO
                    </Badge>
                  </div>
                </div>

                {/* ANPAJ Logo Placeholder */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-gold-500/30">
                  <div className="flex items-center justify-center gap-2 text-sm text-navy-100">
                    <Award className="w-5 h-5 text-gold-500" />
                    <span className="font-semibold">ANPAJ</span>
                  </div>
                  <p className="text-xs text-center text-navy-200 mt-2">
                    Associação Nacional dos Peritos em Análises Judiciais
                  </p>
                  {/* TODO: Replace with actual ANPAJ logo */}
                  {/* <img
                    src="/images/anpaj-logo.svg"
                    alt="ANPAJ Logo"
                    className="w-full h-auto"
                  /> */}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Name & Title */}
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    Ibsen José Baré Maciel
                  </h3>
                  <div className="space-y-2">
                    <p className="text-lg text-gold-400 font-semibold">
                      Perito Criminal Oficial
                    </p>
                    <p className="text-base text-navy-100">
                      Polícia Científica do Pará
                    </p>
                    <p className="text-base text-navy-100">
                      Diretor Nacional de Perícias em Computação Forense - ANPAJ
                    </p>
                  </div>
                </div>

                {/* Quote */}
                <blockquote className="border-l-4 border-gold-500 pl-6 py-2 bg-white/5 rounded-r-lg">
                  <p className="text-lg text-white italic leading-relaxed mb-4">
                    "A metodologia da investigaree atende aos mais altos padrões
                    de perícia forense. É o que usamos em investigações criminais
                    de nível nacional."
                  </p>
                  <footer className="text-sm text-navy-200">
                    — Ibsen Maciel, Perito Criminal Oficial
                  </footer>
                </blockquote>

                {/* Credentials */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">
                    Certificações Internacionais
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      "CELLEBRITE UFED",
                      "XRY (MSAB)",
                      "Magnet AXIOM"
                    ].map((cert, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-3 border border-gold-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4 text-gold-500 flex-shrink-0" />
                        <span className="text-sm text-white font-medium">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expertise */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gold-400 uppercase tracking-wider">
                    Áreas de Expertise
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Perícia Forense Digital",
                      "Investigação Criminal",
                      "Compliance LGPD",
                      "Cybercrime Investigation",
                      "E-Discovery",
                      "Chain of Custody"
                    ].map((area, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="bg-white/5 border-navy-700 text-navy-100 hover:bg-white/10"
                      >
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-gold-500 bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 hover:text-gold-300 font-semibold"
                  >
                    Conheça nosso Advisory Board
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trust Elements */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-gold-500/30 rounded-full px-6 py-3">
            <Shield className="w-5 h-5 text-gold-500" />
            <span className="text-sm font-semibold text-white">
              Metodologia validada por Perito Criminal com atuação em casos de nível nacional
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
