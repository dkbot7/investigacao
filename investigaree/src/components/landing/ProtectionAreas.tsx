"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Home, Building2, TrendingUp } from "lucide-react";
import Link from "next/link";

const AREAS = [
  {
    name: "Proteção Familiar",
    badge: "MAIS RÁPIDO",
    icon: Home,
    price: "2.997",
    priceRange: { min: "1.500", max: "5.000" },
    delivery: "48 horas garantidas",
    description: "Blindagem completa para sua família",
    features: [
      "Verificação de funcionários domésticos",
      "Proteção digital dos filhos",
      "Análise de vulnerabilidades da residência",
      "Score de risco 0-100",
      "Relatório confidencial executivo"
    ],
    highlight: "Red flags principais identificados",
    cta: "Proteger Família",
    popular: false,
    color: "neutral"
  },
  {
    name: "Proteção Empresarial",
    badge: "RECOMENDADO",
    icon: Building2,
    price: "10.000",
    priceRange: { min: "10.000", max: "15.000" },
    delivery: "Análise profunda para empresas",
    description: "Due diligence corporativa completa",
    features: [
      "50-100 horas de investigação",
      "20+ referências verificadas",
      "Background internacional completo",
      "Análise de riscos trabalhistas",
      "Relatório forense blindado"
    ],
    highlight: "Proteção contra fraudes corporativas",
    cta: "Análise Express",
    popular: true,
    color: "primary"
  },
  {
    name: "Proteção de Investimentos",
    badge: "M&A",
    icon: TrendingUp,
    price: "30.000",
    priceRange: null,
    minPrice: "Mínimo R$ 30.000",
    delivery: "Proteção em fusões e aquisições",
    description: "Investigação completa para investimentos",
    features: [
      "0.3-0.5% do valor do deal",
      "Equipe multidisciplinar dedicada",
      "Suporte pós-deal incluído",
      "Relatórios para stakeholders",
      "Due diligence completa 360°"
    ],
    highlight: "Proteção total do seu investimento",
    cta: "Falar com Especialista",
    popular: false,
    color: "secondary"
  }
];

export default function ProtectionAreas() {
  return (
    <section className="py-32 bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="container max-w-7xl px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="mb-4 text-amber-400 border-amber-400/30">
            3 Níveis de Proteção
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Invista 0,1% para proteger 100%
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Due diligence empresarial com rigor de perícia forense
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {AREAS.map((area) => (
            <Card
              key={area.name}
              className={`relative overflow-hidden transition-all hover:scale-105 ${
                area.popular
                  ? "border-2 border-amber-500 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900"
                  : "border border-slate-700 bg-gradient-to-br from-slate-800/90 to-slate-900/90"
              }`}
            >
              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className={`${
                  area.popular
                    ? "bg-amber-500 text-black font-bold px-4 py-1"
                    : area.badge === "M&A"
                    ? "bg-blue-600 text-white font-bold px-4 py-1"
                    : "bg-gray-600 text-white font-bold px-4 py-1"
                }`}>
                  {area.badge}
                </Badge>
              </div>

              <CardHeader className="text-center pt-12 pb-6">
                {/* Icon Circle */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-slate-700/50 border-2 border-slate-600">
                  <area.icon className="w-10 h-10 text-white" />
                </div>

                <CardTitle className="text-2xl mb-3 text-white font-bold">
                  {area.name}
                </CardTitle>
                <CardDescription className="text-slate-300 text-sm mb-4">
                  {area.delivery}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 px-6">
                {/* Features List */}
                <ul className="space-y-3">
                  {area.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="flex flex-col gap-4 px-6 pb-8 pt-6">
                {/* Price */}
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-2">Investimento</p>
                  {area.priceRange ? (
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-2xl font-bold text-white">
                        R$ {area.priceRange.min}
                      </span>
                      <span className="text-slate-400">a</span>
                      <span className="text-2xl font-bold text-white">
                        R$ {area.priceRange.max}
                      </span>
                    </div>
                  ) : area.minPrice ? (
                    <div>
                      <span className="text-3xl font-bold text-white">
                        R$ {area.price}
                      </span>
                      <p className="text-slate-400 text-xs mt-1">{area.minPrice}</p>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      R$ {area.price}
                    </span>
                  )}
                </div>

                <Link href="/servicos" className="w-full">
                  <Button
                    className={`w-full py-3 ${
                      area.popular
                        ? "bg-amber-500 hover:bg-amber-600 text-black"
                        : "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                    } font-semibold rounded-lg transition-all`}
                  >
                    {area.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}