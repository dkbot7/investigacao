"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Clock } from "lucide-react";
import { PACOTES_SERVICOS, type PacoteServico } from "@/data/pacotes-servicos";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWhatsApp } from "@/components/WhatsAppLeadModal";

interface PacotesServicosSectionProps {
  className?: string;
}

export function PacotesServicosSection({ className }: PacotesServicosSectionProps) {
  const [selectedPacote, setSelectedPacote] = useState<PacoteServico | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openWhatsAppModal } = useWhatsApp();

  const handlePacoteClick = (pacote: PacoteServico) => {
    setSelectedPacote(pacote);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPacote(null);
  };

  const handleWhatsAppClick = () => {
    if (selectedPacote) {
      openWhatsAppModal(
        `Olá! Tenho interesse no pacote "${selectedPacote.nome}". Gostaria de mais informações.`,
        `pacote-${selectedPacote.id}`
      );
      handleCloseModal();
    }
  };

  const getCorClasses = (cor: string) => {
    const classes = {
      blue: {
        border: 'border-green-500',
        borderOutline: 'border-green-500/50',
        bg: 'bg-green-50 dark:bg-green-500/10',
        text: 'text-green-700 dark:text-green-400',
        button: 'bg-green-500 hover:bg-green-600 text-white'
      },
      purple: {
        border: 'border-purple-500',
        borderOutline: 'border-purple-500/50',
        bg: 'bg-purple-50 dark:bg-purple-500/10',
        text: 'text-purple-700 dark:text-purple-400',
        button: 'bg-purple-500 hover:bg-purple-600 text-white'
      },
      red: {
        border: 'border-red-500',
        borderOutline: 'border-red-500/50',
        bg: 'bg-red-50 dark:bg-red-500/10',
        text: 'text-red-700 dark:text-red-400',
        button: 'bg-red-500 hover:bg-red-600 text-white'
      },
      green: {
        border: 'border-green-500',
        borderOutline: 'border-green-500/50',
        bg: 'bg-green-50 dark:bg-green-500/10',
        text: 'text-green-700 dark:text-green-400',
        button: 'bg-green-500 hover:bg-green-600 text-white'
      }
    };
    return classes[cor as keyof typeof classes] || classes.blue;
  };

  return (
    <>
      <section className={`py-20 bg-slate-50 dark:bg-navy-900 ${className || ''}`}>
        <div className="container max-w-7xl px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <Badge className="bg-green-500/20 text-green-500 border-green-500/30 mb-4">
              Pacotes de Serviços
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Soluções Consolidadas para Sua Proteção
            </h2>
            <p className="text-lg text-slate-600 dark:text-navy-300 max-w-3xl mx-auto">
              Combine múltiplos serviços em pacotes otimizados com melhor custo-benefício
            </p>
          </div>

          {/* Grid de Pacotes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PACOTES_SERVICOS.map((pacote) => {
              const cores = getCorClasses(pacote.cor);
              return (
                <Card
                  key={pacote.id}
                  className={`relative hover:shadow-xl transition-all cursor-pointer group bg-white dark:bg-navy-900 border-t-4 ${cores.border}`}
                  onClick={() => handlePacoteClick(pacote)}
                >
                  {/* Badge */}
                  {pacote.badge && (
                    <Badge className={`absolute -top-3 left-4 ${cores.button} font-semibold text-xs px-3 py-1`}>
                      {pacote.badge}
                    </Badge>
                  )}

                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 ${cores.bg} rounded-lg group-hover:scale-110 transition-transform`}>
                        <pacote.icon className={`w-6 h-6 ${cores.text}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-slate-900 dark:text-white">
                          {pacote.nome}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-navy-300 mb-4">
                      {pacote.descricao}
                    </CardDescription>

                    {/* Serviços incluídos */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-500 dark:text-navy-400 mb-2">
                        {pacote.servicos.length} serviços incluídos:
                      </p>
                      <ul className="space-y-2">
                        {pacote.caracteristicas.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600 dark:text-navy-300">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {pacote.caracteristicas.length > 3 && (
                        <p className="text-xs text-slate-500 dark:text-navy-400 mt-2">
                          +{pacote.caracteristicas.length - 3} benefícios
                        </p>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-200 dark:border-navy-800">
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center text-xs">
                          <Badge variant="outline" className={`${cores.text} ${cores.borderOutline}`}>
                            {pacote.precoBase}
                          </Badge>
                          <div className="flex items-center gap-1 text-slate-500 dark:text-navy-400">
                            <Clock className="w-3 h-3" />
                            {pacote.prazo}
                          </div>
                        </div>
                        <Button size="sm" className={`w-full ${cores.button} font-semibold`}>
                          Ver Detalhes <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal de Detalhes do Pacote */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-navy-900">
          {selectedPacote && (
            <>
              <DialogHeader>
                <div className="flex items-start gap-4">
                  <div className={`p-3 ${getCorClasses(selectedPacote.cor).bg} rounded-xl`}>
                    <selectedPacote.icon className={`w-8 h-8 ${getCorClasses(selectedPacote.cor).text}`} />
                  </div>
                  <div className="flex-1">
                    <DialogTitle className="text-2xl text-slate-900 dark:text-white">
                      {selectedPacote.nome}
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 dark:text-navy-300 mt-2">
                      {selectedPacote.descricao}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Características Completas */}
                <div>
                  <h4 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">
                    O que está incluído:
                  </h4>
                  <ul className="space-y-2">
                    {selectedPacote.caracteristicas.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-navy-200">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ideal Para */}
                <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    ✅ Ideal para:
                  </h4>
                  <p className="text-slate-700 dark:text-navy-200">{selectedPacote.idealPara}</p>
                </div>

                {/* Detalhes */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-navy-800 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-navy-400 mb-1">Investimento</p>
                    <p className="text-xl font-bold text-green-500">{selectedPacote.precoBase}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-navy-800 rounded-lg">
                    <p className="text-xs text-slate-500 dark:text-navy-400 mb-1">Prazo</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{selectedPacote.prazo}</p>
                  </div>
                </div>

                {/* CTA */}
                <div className="space-y-4 pt-4">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-slate-600 dark:text-navy-400">
                      ✅ Resposta garantida em 24h • 🔒 100% confidencial
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={handleWhatsAppClick}
                      className="bg-green-600 hover:bg-green-700 text-white h-14 px-10 text-base font-semibold shadow-lg shadow-green-600/30"
                      size="lg"
                    >
                      Contratar Pacote Agora
                    </Button>
                    <Button variant="outline" onClick={handleCloseModal} size="lg" className="h-14">
                      Voltar
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

