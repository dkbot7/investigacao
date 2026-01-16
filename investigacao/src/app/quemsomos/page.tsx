"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import {
  Shield, Award, BookOpen, Users, Target, CheckCircle,
  Database, Cpu, Lock, Globe
} from "lucide-react";

export default function QuemSomosPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-navy-950">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-navy-900 dark:to-navy-950">
          <div className="container max-w-6xl px-4">
            <div className="text-center space-y-6">
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/10">
                Quem Somos
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Investigação Digital <span className="text-blue-400">em Escala</span>
              </h1>
              <p className="text-xl text-slate-700 dark:text-navy-200 max-w-3xl mx-auto">
                Plataforma especializada em <strong className="text-blue-400">automação de investigações</strong> com processamento de <strong className="text-blue-400">+100 mil registros</strong> por análise.
              </p>
            </div>
          </div>
        </section>

        {/* Nossa Expertise */}
        <section className="py-16 bg-white dark:bg-navy-950">
          <div className="container max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Nossa Expertise
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-blue-500/30 bg-gradient-to-br from-white to-slate-50 dark:from-navy-900 dark:to-navy-800">
                <CardHeader>
                  <Database className="w-12 h-12 text-blue-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Automação</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-navy-200 text-sm">
                    Processamento automatizado de grandes volumes de dados de múltiplas fontes públicas.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-gradient-to-br from-white to-slate-50 dark:from-navy-900 dark:to-navy-800">
                <CardHeader>
                  <Shield className="w-12 h-12 text-blue-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Due Diligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-navy-200 text-sm">
                    Investigações empresariais e background checks com cruzamento inteligente de dados.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-gradient-to-br from-white to-slate-50 dark:from-navy-900 dark:to-navy-800">
                <CardHeader>
                  <Lock className="w-12 h-12 text-blue-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-navy-200 text-sm">
                    Conformidade com LGPD e boas práticas de proteção de dados pessoais.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30 bg-gradient-to-br from-white to-slate-50 dark:from-navy-900 dark:to-navy-800">
                <CardHeader>
                  <Globe className="w-12 h-12 text-blue-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">OSINT</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 dark:text-navy-200 text-sm">
                    Inteligência de fontes abertas com técnicas avançadas de coleta e análise.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Diferenciais */}
        <section className="py-16 bg-slate-50 dark:bg-navy-900">
          <div className="container max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900 dark:text-white">
              Nossos Diferenciais
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-blue-500/30">
                <CardHeader>
                  <Cpu className="w-12 h-12 text-blue-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Tecnologia Avançada</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Processamento de +100k registros simultâneos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Integração com múltiplas bases de dados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Automação inteligente de análises</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30">
                <CardHeader>
                  <Shield className="w-12 h-12 text-blue-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Segurança e Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Conformidade total com LGPD</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Criptografia de dados sensíveis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Auditoria completa de processos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-blue-500/30">
                <CardHeader>
                  <Target className="w-12 h-12 text-blue-400 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Resultados Precisos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Relatórios detalhados e acionáveis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Análise de múltiplas fontes públicas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700 dark:text-navy-200 text-sm">Entrega rápida e eficiente</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 bg-white dark:bg-navy-950">
          <div className="container max-w-4xl px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
              Pronto para começar?
            </h2>
            <p className="text-lg text-slate-700 dark:text-navy-200 mb-8">
              Entre em contato e descubra como podemos ajudar na sua investigação.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contato">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Falar com especialista
                </Button>
              </Link>
              <Link href="/servicos">
                <Button size="lg" variant="outline" className="border-blue-500 text-blue-500 hover:bg-blue-500/10">
                  Ver serviços
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <WhatsAppWidget />
      </main>
      <Footer />
    </>
  );
}
