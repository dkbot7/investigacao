"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Shield, CreditCard, ArrowRight, Home, Building2, TrendingUp } from "lucide-react";

const PLANS = [
  {
    name: "Proteção Familiar",
    badge: "MAIS RÁPIDO",
    icon: Home,
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
    color: "neutral",
    tab: "familiar"
  },
  {
    name: "Proteção Empresarial",
    badge: "RECOMENDADO",
    icon: Building2,
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
    cta: "Solicitar Proposta",
    popular: true,
    color: "primary",
    tab: "empresarial"
  },
  {
    name: "Proteção de Investimentos",
    badge: "M&A",
    icon: TrendingUp,
    delivery: "Proteção em fusões e aquisições",
    description: "Investigação completa para investimentos",
    features: [
      "Análise proporcional ao deal",
      "Equipe multidisciplinar dedicada",
      "Suporte pós-deal incluído",
      "Relatórios para stakeholders",
      "Due diligence completa 360°"
    ],
    highlight: "Proteção total do seu investimento",
    cta: "Falar com Especialista",
    popular: false,
    color: "secondary",
    tab: "investimentos"
  }
];

export default function Pricing() {
  return (
    <section className="py-32 bg-white dark:bg-neutral-950">
      <div className="container max-w-7xl px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="mb-4 text-primary-600 dark:text-primary-400 border-primary-400">
            3 Áreas de Proteção Completa
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100">
            Protegemos as 3 áreas da sua vida
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Investigação profissional para proteger sua <strong>família</strong>, suas <strong>empresas</strong> e seus <strong>investimentos</strong>.
            Paz de espírito em todas as frentes.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden ${
                plan.popular
                  ? "border-2 border-amber-500 shadow-2xl scale-105 z-10 bg-gradient-to-br from-slate-800 to-slate-900"
                  : "border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900"
              }`}
            >
              {/* Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`${
                  plan.popular
                    ? "bg-amber-500 text-black font-bold px-4 py-1"
                    : plan.badge === "M&A"
                    ? "bg-blue-600 text-white font-bold px-4 py-1"
                    : "bg-gray-600 text-white font-bold px-4 py-1"
                }`}>
                  {plan.badge}
                </Badge>
              </div>

              <CardHeader className="text-center pt-12 pb-6">
                {/* Icon Circle */}
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
                  ${plan.popular
                    ? "bg-slate-700/50 border-2 border-slate-600"
                    : "bg-slate-700/50 border-2 border-slate-600"
                  }`}>
                  <plan.icon className="w-10 h-10 text-slate-900 dark:text-white" />
                </div>

                <CardTitle className="text-2xl mb-3 text-slate-900 dark:text-white font-bold">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-slate-300 text-sm mb-4">
                  {plan.delivery}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 px-6">
                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
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
                {/* Sob Consulta */}
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-2">Investimento</p>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    Sob consulta
                  </span>
                </div>

                <Link href={`/servicos/?tab=${plan.tab}`} className="w-full">
                  <Button
                    className={`w-full py-3 ${
                      plan.popular
                        ? "bg-amber-500 hover:bg-amber-600 text-black"
                        : "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600"
                    } font-semibold rounded-lg transition-all`}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-8 text-neutral-600 dark:text-neutral-400 text-sm border-t border-neutral-200 dark:border-neutral-800 pt-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-success" />
            Pagamento Seguro (SSL)
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary-500" />
            Parcelamos em 12x
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-success" />
            Garantia 30 dias
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-success/10 border-2 border-success rounded-full px-6 py-3">
            <Shield className="w-6 h-6 text-success" />
            <span className="text-success font-semibold">
              Garantia de Satisfação 100% ou seu dinheiro de volta
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
