"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle, Star, Sparkles } from "lucide-react";
import { SERVICOS_ESPECIAIS } from "@/data/servicos-especiais";
import { useWhatsApp } from "@/components/WhatsAppLeadModal";

interface ServicosEspeciaisSectionProps {
  className?: string;
}

export function ServicosEspeciaisSection({ className }: ServicosEspeciaisSectionProps) {
  const { openWhatsAppModal } = useWhatsApp();

  const handleWhatsAppClick = (servicoNome: string, servicoId: string) => {
    openWhatsAppModal(
      `Olá! Tenho interesse no serviço "${servicoNome}". Gostaria de mais informações.`,
      `servico-especial-${servicoId}`
    );
  };

  const getCorClasses = (cor: string) => {
    const classes = {
      blue: {
        bg: 'bg-green-50 dark:bg-green-500/10',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-200 dark:border-green-500/20',
        badge: 'bg-green-500'
      },
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        text: 'text-purple-700 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-500/20',
        badge: 'bg-purple-500'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-500/10',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-500/20',
        badge: 'bg-orange-500'
      }
    };
    return classes[cor as keyof typeof classes] || classes.blue;
  };

  return (
    <section className={`py-20 bg-white dark:bg-navy-950 ${className || ''}`}>
      <div className="container max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-yellow-500 text-navy-900 font-semibold mb-4 flex items-center gap-2 mx-auto w-fit">
            <Sparkles className="w-4 h-4" />
            NOVIDADES
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Serviços do Nosso Portfólio Real
          </h2>
          <p className="text-lg text-slate-600 dark:text-navy-300 max-w-3xl mx-auto">
            Baseados em casos reais executados com sucesso para nossos clientes
          </p>
        </div>

        {/* Grid de Serviços */}
        <div className="grid md:grid-cols-3 gap-8">
          {SERVICOS_ESPECIAIS.map((servico) => {
            const cores = getCorClasses(servico.cor);
            return (
              <Card
                key={servico.id}
                className="relative hover:shadow-2xl transition-all bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800"
              >
                {/* Badge */}
                <div className="absolute -top-3 left-4">
                  <Badge className={`${cores.badge} text-white font-semibold text-xs px-3 py-1`}>
                    {servico.badge}
                  </Badge>
                </div>

                <CardHeader className="pt-8">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 ${cores.bg} rounded-lg`}>
                      <servico.icon className={`w-6 h-6 ${cores.text}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-slate-900 dark:text-white">
                        {servico.nome}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <CardDescription className="text-slate-600 dark:text-navy-300 mb-4">
                    {servico.descricao}
                  </CardDescription>

                  {/* Box "CASO REAL" destacado */}
                  <div className={`p-4 ${cores.bg} border ${cores.border} rounded-lg mb-4`}>
                    <div className="flex items-start gap-2 mb-2">
                      <Star className={`w-5 h-5 ${cores.text} flex-shrink-0`} />
                      <h4 className={`font-semibold ${cores.text} text-sm`}>Caso Real:</h4>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-navy-200 italic">
                      "{servico.casoReal}"
                    </p>
                  </div>

                  {/* Características */}
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-slate-500 dark:text-navy-400 mb-2">
                      Características:
                    </h4>
                    <ul className="space-y-2">
                      {servico.caracteristicas.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-slate-600 dark:text-navy-300">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {servico.caracteristicas.length > 4 && (
                      <p className="text-xs text-slate-500 dark:text-navy-400 mt-2">
                        +{servico.caracteristicas.length - 4} benefícios
                      </p>
                    )}
                  </div>

                  {/* Tags de Tecnologia (se houver) */}
                  {servico.tecnologias && servico.tecnologias.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-500 dark:text-navy-400 mb-2">
                        Tecnologias:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {servico.tecnologias.map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Ideal para */}
                  <div className="mb-4 p-3 bg-slate-50 dark:bg-navy-800 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-navy-400 mb-1">Ideal para:</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {servico.paraQuem}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-slate-200 dark:border-navy-800">
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-slate-500 dark:text-navy-400 mb-1">Preço</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {servico.precoBase.split('(')[0].trim()}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-navy-400 mb-1">Prazo</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {servico.prazo}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleWhatsAppClick(servico.nome, servico.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                        size="sm"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Solicitar Orçamento
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA adicional */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 dark:text-navy-300 mb-4">
            Precisa de um serviço customizado? Desenvolvemos soluções sob medida.
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => openWhatsAppModal('Olá! Gostaria de discutir um projeto customizado.', 'custom-project')}
          >
            Falar sobre Projeto Customizado
          </Button>
        </div>
      </div>
    </section>
  );
}

