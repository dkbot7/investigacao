"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Shield, CreditCard, ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "Express",
    price: "1.997",
    delivery: "48 horas",
    description: "Perfeito para decisões rápidas",
    features: [
      "3 verificações críticas",
      "Relatório digital completo",
      "Red flags principais",
      "Score de integridade",
      "Suporte via email"
    ],
    cta: "Começar Agora",
    popular: false
  },
  {
    name: "Professional",
    price: "4.997",
    delivery: "5 dias úteis",
    description: "Análise profunda e detalhada",
    features: [
      "10 verificações completas",
      "Análise forense digital",
      "Background internacional",
      "Call de apresentação 30min",
      "Revisões ilimitadas (30 dias)",
      "Relatório executivo premium",
      "Suporte prioritário WhatsApp"
    ],
    cta: "Escolher Este",
    popular: true
  },
  {
    name: "Enterprise",
    price: "14.997",
    delivery: "Personalizado",
    description: "Solução completa para corporações",
    features: [
      "Investigação ilimitada",
      "Equipe dedicada 24/7",
      "Suporte jurídico incluído",
      "MSA anual disponível",
      "Integração via API",
      "Relatórios customizados",
      "Due diligence M&A",
      "Compliance internacional"
    ],
    cta: "Falar com Vendas",
    popular: false
  }
];

export default function Pricing() {
  return (
    <section className="py-32 bg-white dark:bg-neutral-950">
      <div className="container max-w-7xl px-4">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="mb-4 text-primary-600 dark:text-primary-400 border-primary-400">
            Precificação Transparente
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100">
            Invista 0,1% para proteger 100%
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
            Um único red flag pode salvar milhões. Nosso serviço custa menos que 1% do seu investimento.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? "border-2 border-primary-500 shadow-2xl scale-105 z-10"
                  : "border border-neutral-200 dark:border-neutral-800"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg px-6 py-1.5">
                    RECOMENDADO
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl mb-2 text-neutral-900 dark:text-neutral-100">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-base">
                  {plan.description}
                </CardDescription>

                {/* Price */}
                <div className="pt-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold text-neutral-900 dark:text-neutral-100">
                      R$ {plan.price}
                    </span>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                    <Zap className="w-4 h-4 inline mr-1 text-warning" />
                    Entrega: {plan.delivery}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full py-6 ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary-500 to-primary-700 hover:opacity-90"
                      : "bg-primary-600 hover:bg-primary-700"
                  } text-white font-semibold rounded-xl`}
                >
                  {plan.cta}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
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
