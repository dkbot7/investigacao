"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users, TrendingUp, Scale, Heart, Building2, ShieldAlert,
  ArrowRight, CheckCircle2, Shield
} from "lucide-react";

export default function SolucoesPage() {
  const audiences = [
    {
      icon: Users,
      title: "RH & Compliance",
      description: "Background check profissional para contratações seguras",
      longDescription: "Valide candidatos antes de contratar com verificação completa em fontes oficiais do governo. Background check de CPF, antecedentes criminais em 27 tribunais, sanções CEIS/CNEP e histórico profissional.",
      href: "/solucoes/rh-compliance",
      color: "blue",
      features: [
        "Validação de CPF e dados pessoais",
        "Antecedentes criminais (27 TJs)",
        "Sanções CEIS, CNEP e OFAC",
        "Processos trabalhistas e cíveis",
        "Relatório com validade judicial"
      ],
      stats: "98% de precisão"
    },
    {
      icon: TrendingUp,
      title: "Investidores",
      description: "Due diligence M&A para decisões de investimento seguras",
      longDescription: "Análise completa de empresas, sócios e passivos ocultos antes de investir. Due diligence em 12 camadas incluindo CNPJ, quadro societário, processos judiciais, sanções governamentais e red flags.",
      href: "/solucoes/due-diligence",
      color: "green",
      features: [
        "Análise CNPJ completa (12 camadas)",
        "Quadro societário e sócios",
        "Passivos trabalhistas ocultos",
        "Sanções e impedimentos legais",
        "Red flags e risco empresarial"
      ],
      stats: "12 camadas de análise"
    },
    {
      icon: Scale,
      title: "Advogados",
      description: "Provas digitais forenses para processos judiciais",
      longDescription: "Coleta de provas digitais com cadeia de custódia certificada. Perícia forense com Avilla Forensics + IPED, relatórios periciais admissíveis em juízo e preservação legal de evidências.",
      href: "/solucoes/coleta-provas-digitais",
      color: "purple",
      features: [
        "Extração forense de celulares",
        "Cadeia de custódia certificada",
        "Relatórios periciais",
        "Metodologia profissional validada",
        "Conformidade total com LGPD"
      ],
      stats: "Admissível em juízo"
    },
    {
      icon: Heart,
      title: "Divórcio & Família",
      description: "Investigação patrimonial para partilha justa",
      longDescription: "Rastreamento de patrimônio oculto em divórcios litigiosos. Identificação de imóveis, veículos, empresas e criptomoedas não declaradas com análise de incompatibilidade patrimonial.",
      href: "/solucoes/due-diligence-divorcios",
      color: "pink",
      features: [
        "Levantamento patrimonial completo",
        "Imóveis e veículos ocultos",
        "Participações societárias",
        "Rastreamento de criptomoedas",
        "Análise de incompatibilidade"
      ],
      stats: "100% confidencial"
    },
    {
      icon: Building2,
      title: "Auditores Públicos",
      description: "Compliance em licitações governamentais",
      longDescription: "Auditoria forense de licitações em conformidade TCU/CGU. Detecte fraudes, superfaturamento, cartel e empresas fantasmas antes da homologação com análise em 12 camadas.",
      href: "/solucoes/auditoria-licitacoes",
      color: "orange",
      features: [
        "Auditoria em 12 camadas",
        "Detecção de fraudes e cartel",
        "Análise de superfaturamento",
        "Verificação CEIS/CNEP",
        "Relatório TCU/CGU"
      ],
      stats: "Conformidade TCU/CGU"
    },
    {
      icon: ShieldAlert,
      title: "Vítimas de Exposição",
      description: "Proteção de privacidade e remoção de conteúdo",
      longDescription: "Remoção profissional de conteúdos sensíveis com base na LGPD. Desindexação Google, remoção em Jusbrasil, redes sociais e proteção reputacional emergencial em 24-72h.",
      href: "/solucoes/protecao-remocao",
      color: "red",
      features: [
        "Remoção emergencial (24-72h)",
        "Desindexação Google",
        "Remoção em redes sociais",
        "Fundamentação LGPD completa",
        "Monitoramento contínuo"
      ],
      stats: "85% taxa de sucesso"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900/20",
        icon: "text-blue-600 dark:text-blue-400",
        button: "bg-blue-600 hover:bg-blue-700",
        border: "hover:border-blue-500"
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900/20",
        icon: "text-green-600 dark:text-green-400",
        button: "bg-green-600 hover:bg-green-700",
        border: "hover:border-green-500"
      },
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900/20",
        icon: "text-purple-600 dark:text-purple-400",
        button: "bg-purple-600 hover:bg-purple-700",
        border: "hover:border-purple-500"
      },
      pink: {
        bg: "bg-pink-100 dark:bg-pink-900/20",
        icon: "text-pink-600 dark:text-pink-400",
        button: "bg-pink-600 hover:bg-pink-700",
        border: "hover:border-pink-500"
      },
      orange: {
        bg: "bg-orange-100 dark:bg-orange-900/20",
        icon: "text-orange-600 dark:text-orange-400",
        button: "bg-orange-600 hover:bg-orange-700",
        border: "hover:border-orange-500"
      },
      red: {
        bg: "bg-red-100 dark:bg-red-900/20",
        icon: "text-red-600 dark:text-red-400",
        button: "bg-red-600 hover:bg-red-700",
        border: "hover:border-red-500"
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* HERO */}
        <section className="pt-32 pb-16 bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-900">
          <div className="container max-w-5xl mx-auto px-4 text-center space-y-6">
            <Badge className="bg-green-600 text-white font-bold px-6 py-3 text-base">
              SOLUÇÕES POR PÚBLICO-ALVO
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Escolha a Solução Ideal<br />para Seu Perfil
            </h1>

            <p className="text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
              Investigação digital profissional com metodologia forense validada.
              Descubra como podemos ajudar <strong className="text-green-600">você ou sua empresa</strong>.
            </p>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600 dark:text-slate-400 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium">5.950 investigações realizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium">100% LGPD</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium">Validade judicial</span>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUÇÕES GRID */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {audiences.map((audience) => {
                const Icon = audience.icon;
                const colorClasses = getColorClasses(audience.color);

                return (
                  <Card
                    key={audience.href}
                    className={`group hover:shadow-2xl transition-all duration-300 border-2 border-transparent ${colorClasses.border}`}
                  >
                    <CardContent className="p-8 space-y-6">
                      {/* Icon */}
                      <div className={`w-16 h-16 ${colorClasses.bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`h-8 w-8 ${colorClasses.icon}`} />
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                          {audience.title}
                        </h3>
                        <p className="text-base text-slate-600 dark:text-slate-400">
                          {audience.description}
                        </p>
                      </div>

                      {/* Long Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {audience.longDescription}
                      </p>

                      {/* Features */}
                      <ul className="space-y-2">
                        {audience.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className={`h-4 w-4 ${colorClasses.icon} flex-shrink-0 mt-0.5`} />
                            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Stats Badge */}
                      <Badge className={`${colorClasses.bg} ${colorClasses.icon} border-0`}>
                        ✅ {audience.stats}
                      </Badge>

                      {/* CTA */}
                      <Link href={audience.href}>
                        <Button className={`w-full ${colorClasses.button}`}>
                          Ver Solução Completa
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* CTA Footer */}
            <div className="text-center mt-16 space-y-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                  Não encontrou sua necessidade?
                </h3>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  Fale com um especialista para descobrir a melhor solução para seu caso
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto">
                <Link href="/contato" className="flex-1">
                  <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-semibold">
                    Falar com Especialista
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/servicos" className="flex-1">
                  <Button size="lg" variant="outline" className="w-full h-14 text-lg font-semibold">
                    Ver Todos os Serviços
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
