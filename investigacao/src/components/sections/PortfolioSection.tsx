"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CASOS_PORTFOLIO } from "@/data/portfolio-casos";

interface PortfolioSectionProps {
  className?: string;
}

export function PortfolioSection({ className }: PortfolioSectionProps) {
  const [expandedCasos, setExpandedCasos] = useState<Record<string, boolean>>({});

  const toggleExpand = (casoId: string) => {
    setExpandedCasos(prev => ({ ...prev, [casoId]: !prev[casoId] }));
  };

  const getCorTemaClasses = (corTema: string) => {
    const classes = {
      blue: 'from-green-600/20 to-green-900/20 border-green-500/30',
      purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/30',
      green: 'from-green-600/20 to-green-900/20 border-green-500/30'
    };
    return classes[corTema as keyof typeof classes] || classes.blue;
  };

  return (
    <section className={`py-20 bg-gradient-to-br from-gray-900 via-slate-900 to-purple-900 ${className || ''}`}>
      <div className="container max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-amber-500 text-navy-900 font-semibold mb-4">
            Casos de Sucesso
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Portfólio de Projetos Executados
          </h2>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Casos reais anonimizados que demonstram nossa expertise e resultados concretos
          </p>
        </div>

        {/* Grid de Casos */}
        <div className="grid md:grid-cols-3 gap-8">
          {CASOS_PORTFOLIO.map((caso) => {
            const isExpanded = expandedCasos[caso.id];
            const corClasses = getCorTemaClasses(caso.corTema);

            return (
              <Card
                key={caso.id}
                className={`backdrop-blur-lg bg-gradient-to-br ${corClasses} border-2 hover:scale-105 transition-all`}
              >
                <div className="p-6 space-y-6">
                  {/* Header do Card */}
                  <div>
                    <Badge className="bg-amber-500 text-navy-900 font-semibold mb-3">
                      {caso.badge}
                    </Badge>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {caso.titulo}
                    </h3>
                    <p className="text-slate-300 text-sm mb-1">{caso.tipo}</p>
                    <p className="text-slate-400 text-xs">{caso.cliente} • {caso.data}</p>
                  </div>

                  {/* Grid 2x3 de Métricas */}
                  <div className="grid grid-cols-2 gap-4">
                    {caso.metricas.map((metrica, idx) => (
                      <div
                        key={idx}
                        className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <metrica.icon className="w-4 h-4 text-amber-400" />
                          <p className="text-xs text-slate-300">{metrica.label}</p>
                        </div>
                        <p className="text-lg font-bold text-white">{metrica.valor}</p>
                      </div>
                    ))}
                  </div>

                  {/* Collapsible: Serviços Aplicados + Resultado */}
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => toggleExpand(caso.id)}
                      className="w-full text-white hover:bg-white/10 flex items-center justify-between"
                    >
                      <span className="font-semibold">
                        {isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>

                    {isExpanded && (
                      <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                        {/* Serviços Aplicados */}
                        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-amber-400 mb-2">
                            Serviços Aplicados:
                          </h4>
                          <ul className="space-y-1">
                            {caso.servicosAplicados.map((servico, idx) => (
                              <li key={idx} className="text-sm text-slate-300 flex items-start gap-2">
                                <span className="text-amber-400">•</span>
                                {servico}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Resultado */}
                        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-amber-400 mb-2">
                            Resultado:
                          </h4>
                          <p className="text-sm text-slate-300">{caso.resultado}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <Button
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10"
                  >
                    Saber Mais sobre Este Caso
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Quer resultados como esses?
            </h3>
            <p className="text-slate-300 mb-6">
              Conte-nos sobre seu desafio e desenvolveremos uma solução customizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-navy-900 font-semibold">
                Solicitar Consulta Gratuita
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Ver Mais Casos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

