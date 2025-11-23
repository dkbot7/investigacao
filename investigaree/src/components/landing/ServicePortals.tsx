"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Building2, Rocket, Check, ArrowRight } from "lucide-react";

const PORTALS = [
  {
    id: "express",
    title: "Red Flag Express",
    subtitle: "Decisões rápidas e seguras",
    emoji: Rocket,
    gradient: "from-gold-500 to-gold-600",
    bgGradient: "from-gold-50 to-gold-100 dark:from-gold-950/20 dark:to-gold-900/20",
    services: [
      "Verificação 48 horas garantidas",
      "Red flags principais identificadas",
      "Score de risco 0-100",
      "Relatório digital executivo"
    ],
    priceFrom: "R$ 1.500",
    priceTo: "R$ 2.500",
    cta: "Análise Express",
    badge: "MAIS RÁPIDO"
  },
  {
    id: "founder",
    title: "Deep Dive Founder",
    subtitle: "Análise profunda para investimentos",
    emoji: Building2,
    gradient: "from-navy-700 to-navy-800",
    bgGradient: "from-navy-50 to-navy-100 dark:from-navy-950/20 dark:to-navy-900/20",
    services: [
      "50-100 horas de investigação",
      "20+ referências verificadas",
      "Background internacional completo",
      "Análise psicológica de perfil",
      "Relatório forense blindado"
    ],
    priceFrom: "R$ 10.000",
    priceTo: "R$ 15.000",
    cta: "Investigação Profunda",
    popular: true
  },
  {
    id: "ma",
    title: "Due Diligence M&A",
    subtitle: "Proteção em fusões e aquisições",
    emoji: Shield,
    gradient: "from-navy-800 to-navy-950",
    bgGradient: "from-navy-50 to-navy-100 dark:from-navy-950/20 dark:to-navy-900/20",
    services: [
      "0.3-0.5% do valor do deal",
      "Equipe multidisciplinar dedicada",
      "Suporte pós-deal incluído",
      "Relatórios para stakeholders",
      "Due diligence completa 360°"
    ],
    priceFrom: "R$ 30.000",
    priceTo: "Sob consulta",
    cta: "Falar com Especialista",
    badge: "M&A"
  }
];

export default function ServicePortals() {
  return (
    <section className="py-32 bg-navy-50 dark:bg-navy-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container max-w-7xl px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="mb-4 text-gold-600 dark:text-gold-400 border-gold-400 bg-gold-500/10">
            3 Níveis de Proteção
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-navy-900 dark:text-white">
            Invista 0,1% para proteger 100%
          </h2>
          <p className="text-xl text-navy-600 dark:text-navy-300 max-w-2xl mx-auto">
            Due diligence empresarial com rigor de perícia forense
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {PORTALS.map((portal) => {
            const Icon = portal.emoji;
            return (
              <Card
                key={portal.id}
                className={`relative group hover:scale-105 transition-all duration-300 border-2 hover:shadow-2xl ${
                  portal.popular ? "border-gold-500 shadow-xl scale-105 md:scale-110" : "border-navy-200 dark:border-navy-700"
                } bg-gradient-to-br ${portal.bgGradient}`}
              >
                {/* Badge */}
                {(portal.popular || portal.badge) && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className={`${portal.popular ? 'gradient-premium text-navy-950' : 'bg-navy-800 text-gold-400'} shadow-lg px-4 py-1 font-bold`}>
                      {portal.popular ? 'RECOMENDADO' : portal.badge}
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pt-8">
                  <div className="flex justify-center mb-4">
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${portal.gradient} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2 text-navy-900 dark:text-white">
                    {portal.title}
                  </CardTitle>
                  <CardDescription className="text-base text-navy-600 dark:text-navy-300">
                    {portal.subtitle}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Services List */}
                  <ul className="space-y-3">
                    {portal.services.map((service, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-gold-600 dark:text-gold-400 flex-shrink-0 mt-0.5" />
                        <span className="text-navy-700 dark:text-navy-200 text-sm font-medium">
                          {service}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Price Badge */}
                  <div className="pt-4 border-t border-navy-200 dark:border-navy-700">
                    <div className="text-center">
                      <p className="text-sm text-navy-600 dark:text-navy-400 mb-2">
                        Investimento
                      </p>
                      <p className="text-2xl font-bold text-navy-900 dark:text-white">
                        {portal.priceFrom}
                        {portal.priceTo !== "Sob consulta" && (
                          <>
                            <span className="text-lg text-navy-500 dark:text-navy-400 mx-2">a</span>
                            {portal.priceTo}
                          </>
                        )}
                      </p>
                      {portal.priceTo === "Sob consulta" && (
                        <p className="text-sm text-gold-600 dark:text-gold-400 mt-1 font-semibold">
                          Mínimo R$ 30.000
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full group bg-gradient-to-r ${portal.gradient} hover:opacity-90 text-white font-semibold py-6 rounded-xl`}
                  >
                    {portal.cta}
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Enterprise Option */}
        <div className="mt-16 text-center">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Precisa de algo personalizado?
          </p>
          <Button variant="outline" size="lg" className="border-primary-400 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950/20">
            Falar com Vendas
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
