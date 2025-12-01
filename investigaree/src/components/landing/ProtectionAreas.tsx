"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Home, Building2, TrendingUp, Landmark, Scale } from "lucide-react";
import Link from "next/link";

const AREAS = [
  {
    name: "Proteção Familiar",
    badge: "48H",
    icon: Home,
    delivery: "48 horas garantidas",
    description: "Blindagem completa para sua família",
    features: [
      "Verificação de funcionários domésticos",
      "Proteção digital dos filhos",
      "Análise de vulnerabilidades da residência",
      "Score de risco 0-100"
    ],
    cta: "Proteger Família",
    popular: false,
    color: "neutral",
    href: "/servicos?tab=familiar"
  },
  {
    name: "Proteção em Divórcios",
    badge: "PATRIMONIAL",
    icon: Scale,
    delivery: "Localização de bens ocultos",
    description: "70% dos divórcios têm ocultação",
    features: [
      "Investigação patrimonial completa",
      "Localização de bens ocultos",
      "Perfil comportamental do cônjuge",
      "Dossiê para partilha justa"
    ],
    cta: "Proteger Patrimônio",
    popular: true,
    color: "primary",
    href: "/servicos?tab=divorcios"
  },
  {
    name: "Proteção Empresarial",
    badge: "CORPORATIVO",
    icon: Building2,
    delivery: "Due diligence corporativa",
    description: "Proteção contra fraudes e vazamentos",
    features: [
      "Background check de funcionários",
      "Proteção contra espionagem",
      "Due diligence M&A",
      "Relatório forense blindado"
    ],
    cta: "Solicitar Proposta",
    popular: false,
    color: "neutral",
    href: "/servicos?tab=empresarial"
  },
  {
    name: "Proteção de Investimentos",
    badge: "VC/ANJO",
    icon: TrendingUp,
    delivery: "Proteção para investidores",
    description: "Verificação de founders e startups",
    features: [
      "Red Flag Express em 48h",
      "Founder Full Scan",
      "Startup Integrity Check",
      "Portfolio Watch contínuo"
    ],
    cta: "Proteger Investimento",
    popular: false,
    color: "neutral",
    href: "/servicos?tab=investimentos"
  }
];

export default function ProtectionAreas() {
  return (
    <section className="py-24 bg-gradient-to-br from-navy-900 to-navy-950">
      <div className="container max-w-7xl px-4">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <Badge variant="outline" className="mb-4 text-gold-400 border-gold-500/30 bg-gold-500/10">
            4 Áreas de Proteção
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Investigação Digital em Escala
          </h2>
          <p className="text-xl text-navy-200 max-w-4xl mx-auto">
            Due diligence completa com <span className="text-gold-400">tecnologia de ponta</span> e metodologia forense
          </p>
        </div>

        {/* Cards Grid - 4 columns on large screens */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {AREAS.map((area) => (
            <Card
              key={area.name}
              className={`relative overflow-hidden transition-all hover:scale-105 ${
                area.popular
                  ? "border-2 border-gold-500 shadow-2xl bg-gradient-to-br from-navy-800 to-navy-900"
                  : "border border-navy-700 bg-gradient-to-br from-navy-800/90 to-navy-900/90"
              }`}
            >
              {/* Badge */}
              <div className="absolute top-3 left-3 z-10">
                <Badge className={`${
                  area.popular
                    ? "bg-gold-500 text-navy-900 font-bold px-3 py-1 text-xs"
                    : "bg-navy-600 text-white font-bold px-3 py-1 text-xs"
                }`}>
                  {area.badge}
                </Badge>
              </div>

              <CardHeader className="text-center pt-10 pb-4">
                {/* Icon Circle */}
                <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  area.popular
                    ? "bg-gold-500/20 border-2 border-gold-500/50"
                    : "bg-navy-700/50 border-2 border-navy-600"
                }`}>
                  <area.icon className={`w-7 h-7 ${area.popular ? "text-gold-400" : "text-white"}`} />
                </div>

                <CardTitle className="text-lg mb-2 text-white font-bold">
                  {area.name}
                </CardTitle>
                <CardDescription className="text-navy-300 text-xs">
                  {area.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 px-4">
                {/* Features List */}
                <ul className="space-y-2">
                  {area.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${area.popular ? "text-gold-400" : "text-success"}`} />
                      <span className="text-navy-200 text-xs">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 px-4 pb-6 pt-4">
                <Link href={area.href} className="w-full">
                  <Button
                    className={`w-full py-2 text-sm ${
                      area.popular
                        ? "bg-gold-500 hover:bg-gold-400 text-navy-900"
                        : "bg-navy-700 hover:bg-navy-600 text-white border border-navy-600"
                    } font-semibold rounded-lg transition-all`}
                  >
                    {area.cta}
                    <ArrowRight className="ml-2 w-3 h-3" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Team Badge */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-500/30">
                <span className="text-gold-400 text-sm font-bold">DK</span>
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">Dani Kaloi</p>
                <p className="text-gold-400 text-xs">Arquiteta de Sistemas</p>
              </div>
            </div>
            <div className="h-8 w-px bg-navy-700" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center border border-gold-500/30 overflow-hidden">
                <img src="/images/ibsen-maciel.jpg" alt="Ibsen Maciel" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-semibold">Ibsen Maciel</p>
                <p className="text-gold-400 text-xs">Perito Criminal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}