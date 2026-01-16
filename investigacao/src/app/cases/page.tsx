import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CASOS_PORTFOLIO } from '@/data/portfolio-casos';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Cases Documentados | Investigaree',
  description: 'Casos reais executados pela Investigaree: auditoria de estatal, automação de transportadora e background checks executivos.',
  openGraph: {
    title: 'Cases Documentados | Investigaree',
    description: 'Casos reais executados pela Investigaree: auditoria de estatal, automação de transportadora e background checks executivos.',
  },
};

const corClasses = {
  blue: 'border-blue-200 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/10',
  purple: 'border-purple-200 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-950/10',
  green: 'border-green-200 dark:border-green-900/30 bg-green-50/50 dark:bg-green-950/10',
};

const badgeCorClasses = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
};

export default function CasesIndexPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-navy-950">
        {/* Hero Section */}
        <section className="pt-20 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-b from-slate-50 to-white dark:from-navy-900 dark:to-navy-950">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
              Cases Documentados
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-navy-300 max-w-2xl mx-auto">
              Casos reais executados com métricas, serviços aplicados e resultados verificáveis.
            </p>
          </div>
        </section>

        {/* Confidencialidade Notice */}
        <section className="px-4 md:px-6 pb-8 md:pb-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-slate-700 dark:text-navy-200">
                    <p className="font-semibold mb-1">Confidencialidade e Anonimização</p>
                    <p>
                      Todos os casos apresentados foram anonimizados para proteger a identidade dos clientes.
                      Dados específicos e identificáveis foram suprimidos conforme acordos de confidencialidade (NDA).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Cases Grid */}
        <section className="px-4 md:px-6 pb-12 md:pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {CASOS_PORTFOLIO.map((caso) => {
                // Get first 3 metrics to display in card
                const metricsToShow = caso.metricas.slice(0, 3);

                return (
                  <Card
                    key={caso.id}
                    className={`${corClasses[caso.corTema]} hover:shadow-lg transition-all duration-200`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className={`text-xs font-semibold ${badgeCorClasses[caso.corTema]}`}>
                          {caso.badge}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-navy-400">
                          {caso.data}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                        {caso.titulo}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-navy-300 mb-4">
                        {caso.tipo}
                      </p>

                      <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 dark:border-navy-700">
                        {metricsToShow.map((metrica, index) => {
                          const IconComponent = metrica.icon;
                          return (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4 text-slate-400 dark:text-navy-400" />
                                <span className="text-xs text-slate-600 dark:text-navy-300">
                                  {metrica.label}
                                </span>
                              </div>
                              <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                {metrica.valor}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mb-6">
                        <p className="text-xs text-slate-500 dark:text-navy-400 mb-2 font-semibold">
                          Cliente:
                        </p>
                        <p className="text-xs text-slate-700 dark:text-navy-200">
                          {caso.cliente}
                        </p>
                      </div>

                      <Link
                        href={`/cases/${caso.id}`}
                        className="text-sm text-slate-600 dark:text-navy-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors inline-flex items-center gap-2"
                      >
                        Ver case completo
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Disclaimer Footer */}
        <section className="px-4 md:px-6 pb-12 md:pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs text-slate-500 dark:text-navy-400">
              Os casos apresentados são baseados em trabalhos reais executados pela Investigaree.
              Resultados passados não garantem resultados futuros. Cada projeto é avaliado individualmente
              conforme suas características e limitações técnicas.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
