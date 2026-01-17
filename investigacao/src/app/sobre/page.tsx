"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Target, Eye, Award, Users, CheckCircle } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SobrePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950 pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-900 dark:to-navy-950 border-b border-slate-300 dark:border-navy-800">
          <div className="container max-w-5xl mx-auto px-4 py-16">
            <Link href="/" className="inline-flex items-center gap-2 text-slate-900 dark:text-slate-600 dark:text-white/60 hover:text-white transition mb-6">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao início
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/20 flex items-center justify-center">
                <Shield className="w-8 h-8 text-primary-400" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Sobre a investigaree</h1>
                <p className="text-slate-900 dark:text-slate-600 dark:text-white/60">Investigação Digital com Inteligência</p>
              </div>
            </div>

            <p className="text-xl text-slate-900 dark:text-slate-800 dark:text-white/80 leading-relaxed max-w-3xl">
              Somos uma empresa especializada em investigação particular e due diligence digital,
              com metodologia validada por Perito Criminal Oficial. Protegemos o patrimônio de
              investidores, empresários e famílias através de análises profundas e relatórios precisos.
            </p>
          </div>
        </section>

        {/* Missão, Visão, Valores */}
        <section className="py-16">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Missão */}
              <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-300 dark:border-navy-800 p-8">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Missão</h2>
                <p className="text-slate-900 dark:text-slate-700 dark:text-white/70 leading-relaxed">
                  Proteger o patrimônio e a reputação de nossos clientes através de investigações
                  éticas, legais e tecnicamente rigorosas, entregando informações confiáveis
                  para tomadas de decisão seguras.
                </p>
              </div>

              {/* Visão */}
              <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-300 dark:border-navy-800 p-8">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Visão</h2>
                <p className="text-slate-900 dark:text-slate-700 dark:text-white/70 leading-relaxed">
                  Ser a referência nacional em due diligence digital, reconhecida pela
                  excelência técnica, ética profissional e pela metodologia validada
                  por especialistas em perícia forense.
                </p>
              </div>

              {/* Valores */}
              <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-300 dark:border-navy-800 p-8">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-green-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Valores</h2>
                <ul className="text-slate-900 dark:text-slate-700 dark:text-white/70 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Ética e legalidade
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Sigilo absoluto
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Rigor técnico
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Agilidade na entrega
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="py-16 bg-white dark:bg-navy-900/50">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Nossos Diferenciais</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-navy-900 rounded-xl border border-slate-300 dark:border-navy-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Metodologia Forense</h3>
                <p className="text-slate-900 dark:text-slate-700 dark:text-white/70">
                  Nossa metodologia foi desenvolvida e validada por Perito Criminal Oficial
                  em Forense Computacional, garantindo padrões de qualidade equivalentes
                  aos utilizados em investigações criminais de nível nacional.
                </p>
              </div>

              <div className="bg-white dark:bg-navy-900 rounded-xl border border-slate-300 dark:border-navy-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Advisory Board Especializado</h3>
                <p className="text-slate-900 dark:text-slate-700 dark:text-white/70">
                  Contamos com um conselho consultivo composto por especialistas renomados,
                  incluindo peritos criminais oficiais e profissionais com certificações
                  internacionais em análise forense digital.
                </p>
              </div>

              <div className="bg-white dark:bg-navy-900 rounded-xl border border-slate-300 dark:border-navy-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Tecnologia Avançada</h3>
                <p className="text-slate-900 dark:text-slate-700 dark:text-white/70">
                  Utilizamos ferramentas de última geração para análise de dados, OSINT
                  (Open Source Intelligence), verificação de documentos e monitoramento
                  de fontes públicas em tempo real.
                </p>
              </div>

              <div className="bg-white dark:bg-navy-900 rounded-xl border border-slate-300 dark:border-navy-800 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Conformidade Legal</h3>
                <p className="text-slate-900 dark:text-slate-700 dark:text-white/70">
                  Todas as nossas investigações são realizadas em conformidade com a LGPD,
                  o Marco Civil da Internet e demais legislações aplicáveis. Trabalhamos
                  exclusivamente com métodos éticos e legais.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Compromissos */}
        <section className="py-16">
          <div className="container max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">Nossos Compromissos</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">48h</p>
                <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm mt-1">Entrega Express</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">100%</p>
                <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm mt-1">LGPD Compliant</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">100%</p>
                <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm mt-1">Sigilo garantido</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-green-400">ANPAJ</p>
                <p className="text-slate-900 dark:text-slate-600 dark:text-white/60 text-sm mt-1">Advisory Board</p>
              </div>
            </div>
          </div>
        </section>

        {/* Equipe */}
        <section className="py-16 bg-white dark:bg-navy-900/50">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <Users className="w-8 h-8 text-primary-400" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nossa Equipe</h2>
            </div>

            <p className="text-slate-900 dark:text-slate-700 dark:text-white/70 leading-relaxed mb-8 max-w-3xl">
              Nossa equipe é composta por profissionais altamente qualificados, incluindo
              investigadores particulares experientes, analistas de inteligência, especialistas
              em OSINT e consultores com background em segurança pública e privada.
            </p>

            <Link
              href="/quemsomos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-slate-900 dark:text-white font-semibold rounded-lg transition-colors"
            >
              Conheça nossa equipe completa
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Pronto para proteger seu patrimônio?</h2>
            <p className="text-slate-900 dark:text-slate-700 dark:text-white/70 mb-8">
              Entre em contato conosco e descubra como podemos ajudar você a tomar decisões mais seguras.
            </p>
            <WhatsAppButton
              message="Olá! Gostaria de saber mais sobre os serviços da investigaree."
              source="sobre"
              className="px-8 py-4 text-lg font-bold"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar com um especialista
            </WhatsAppButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

