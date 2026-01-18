import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Shield, Zap, Scale, ArrowRight, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Metodologias profissionals Validadas | Investigaree',
  description: 'Biblioteca técnica de metodologias profissionals aplicadas: blindagem de privacidade, automação de due diligence e investigação defensiva criminal.',
  openGraph: {
    title: 'Metodologias profissionals Validadas | Investigaree',
    description: 'Biblioteca técnica de metodologias profissionals aplicadas: blindagem de privacidade, automação de due diligence e investigação defensiva criminal.',
  },
};

interface MetodologiaCard {
  id: string;
  titulo: string;
  descricao: string;
  icon: React.ElementType;
  badge: string;
  paraQuem: string;
  nivelTecnico: string;
  cor: 'blue' | 'purple' | 'orange';
}

const metodologias: MetodologiaCard[] = [
  {
    id: 'blindagem-privacidade-dados-pessoais',
    titulo: 'Blindagem de Privacidade e Dados Pessoais',
    descricao: 'Metodologia técnica para identificação, remoção e proteção contínua de dados pessoais em bases públicas e privadas, com base legal em LGPD e Marco Civil da Internet.',
    icon: Shield,
    badge: 'LGPD + Marco Civil',
    paraQuem: 'Executivos, médicos, advogados, empresários expostos',
    nivelTecnico: 'Intermediário',
    cor: 'blue',
  },
  {
    id: 'automacao-due-diligence-consultas-massa',
    titulo: 'Automação de Due Diligence e Consultas em Massa',
    descricao: 'Metodologia de verificação automatizada de fornecedores, parceiros e colaboradores usando APIs públicas, fontes estruturadas e OSINT sistemático.',
    icon: Zap,
    badge: 'OSINT + API',
    paraQuem: 'Compliance, jurídico corporativo, M&A',
    nivelTecnico: 'Avançado',
    cor: 'purple',
  },
  {
    id: 'investigacao-defensiva-criminal',
    titulo: 'Investigação Defensiva Criminal',
    descricao: 'Metodologia de coleta técnica de provas digitais para defesa criminal, com base em OAB 188/2014 e legislação processual penal brasileira.',
    icon: Scale,
    badge: 'OAB 188/2014',
    paraQuem: 'Advogados criminalistas, defesa técnica',
    nivelTecnico: 'Avançado',
    cor: 'orange',
  },
];

const corClasses = {
  blue: 'border-green-200 dark:border-green-900/30',
  purple: 'border-purple-200 dark:border-purple-900/30',
  orange: 'border-orange-200 dark:border-orange-900/30',
};

const iconCorClasses = {
  blue: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
};

export default function MetodologiaIndexPage() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white dark:bg-navy-950">
        {/* Hero Section */}
        <section className="pt-20 md:pt-32 pb-12 md:pb-16 px-4 md:px-6 bg-gradient-to-b from-slate-50 to-white dark:from-navy-900 dark:to-navy-950">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6">
              Metodologias profissionals Validadas
            </h1>
            <p className="text-base md:text-lg text-slate-600 dark:text-navy-300 max-w-2xl mx-auto">
              Biblioteca técnica de metodologias aplicadas em blindagem de privacidade, due diligence automatizada e investigação defensiva criminal.
            </p>
          </div>
        </section>

        {/* LGPD Disclaimer */}
        <section className="px-4 md:px-6 pb-8 md:pb-12">
          <div className="max-w-4xl mx-auto">
            <Card className="border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-slate-700 dark:text-navy-200">
                    <p className="font-semibold mb-1">Conformidade Legal</p>
                    <p>
                      Todas as metodologias descritas respeitam os limites da LGPD (Lei 13.709/2018) e Marco Civil da Internet (Lei 12.965/2014).
                      Não realizamos acesso a bases não públicas nem substituímos parecer jurídico especializado.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Metodologias Grid */}
        <section className="px-4 md:px-6 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {metodologias.map((metodologia) => {
                const IconComponent = metodologia.icon;
                return (
                  <Card
                    key={metodologia.id}
                    className={`${corClasses[metodologia.cor]} hover:shadow-lg transition-all duration-200`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <IconComponent className={`w-8 h-8 ${iconCorClasses[metodologia.cor]}`} />
                        <Badge variant="secondary" className="text-xs">
                          {metodologia.badge}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                        {metodologia.titulo}
                      </h3>

                      <p className="text-sm text-slate-600 dark:text-navy-300 mb-4 leading-relaxed">
                        {metodologia.descricao}
                      </p>

                      <div className="space-y-2 mb-6 pb-6 border-b border-slate-200 dark:border-navy-700">
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-slate-500 dark:text-navy-400 w-24 flex-shrink-0">
                            Para quem:
                          </span>
                          <span className="text-xs text-slate-700 dark:text-navy-200">
                            {metodologia.paraQuem}
                          </span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-slate-500 dark:text-navy-400 w-24 flex-shrink-0">
                            Nível técnico:
                          </span>
                          <span className="text-xs text-slate-700 dark:text-navy-200">
                            {metodologia.nivelTecnico}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/metodologia/${metodologia.id}`}
                        className="text-sm text-slate-600 dark:text-navy-300 hover:text-green-600 dark:hover:text-green-400 transition-colors inline-flex items-center gap-2"
                      >
                        Acessar metodologia completa
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}


