"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import {
  Shield, CheckCircle2, Lock, Eye, FileText, Users,
  Database, AlertTriangle, Mail, Phone, BookOpen
} from "lucide-react";

export default function LGPDPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-navy-950">
        {/* Hero Section */}
        <section className="pt-24 pb-12 bg-gradient-to-br from-green-50 to-blue-50 dark:from-navy-900 dark:to-green-900">
          <div className="container max-w-6xl px-4">
            <div className="text-center space-y-6">
              <Badge className="bg-green-600 text-white font-bold px-6 py-3 text-base">
                CONFORMIDADE LGPD
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white">
                Compromisso com a <span className="text-green-600">Privacidade</span> e LGPD
              </h1>
              <p className="text-xl text-slate-700 dark:text-navy-200 max-w-3xl mx-auto">
                Todas as nossas investigações são realizadas em <strong className="text-green-600">100% conformidade</strong> com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
            </div>
          </div>
        </section>

        {/* O Que é LGPD */}
        <section className="py-16 bg-white dark:bg-navy-950">
          <div className="container max-w-5xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                O Que é a LGPD?
              </h2>
              <p className="text-lg text-slate-600 dark:text-navy-300 max-w-3xl mx-auto">
                A Lei Geral de Proteção de Dados (LGPD) é a legislação brasileira que regula o tratamento de dados pessoais, garantindo privacidade e segurança aos cidadãos.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-green-500/30">
                <CardHeader>
                  <Shield className="w-12 h-12 text-green-600 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Proteção de Dados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-navy-200">
                    Garante que seus dados pessoais sejam tratados com segurança e transparência.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500/30">
                <CardHeader>
                  <Eye className="w-12 h-12 text-blue-600 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Transparência</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-navy-200">
                    Você tem direito de saber quais dados coletamos e como os utilizamos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-500/30">
                <CardHeader>
                  <Users className="w-12 h-12 text-purple-600 mb-4" />
                  <CardTitle className="text-slate-900 dark:text-white">Seus Direitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 dark:text-navy-200">
                    Acesso, correção, exclusão e portabilidade dos seus dados pessoais.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Como Cumprimos a LGPD */}
        <section className="py-16 bg-slate-50 dark:bg-navy-900">
          <div className="container max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Como Cumprimos a LGPD
              </h2>
              <p className="text-lg text-slate-600 dark:text-navy-300">
                Nossos processos foram desenhados para conformidade total
              </p>
            </div>

            <div className="space-y-6">
              {/* Fontes Públicas */}
              <Card className="border-l-4 border-green-500">
                <CardContent className="p-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <Database className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Fontes Públicas (OSINT)
                      </h3>
                      <p className="text-slate-700 dark:text-navy-200 mb-3">
                        Utilizamos exclusivamente <strong className="text-green-600">dados de fontes públicas oficiais</strong> do governo brasileiro: tribunais, Receita Federal, TSE, CNJ, TCU, CGU e outros órgãos públicos.
                      </p>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                        ✅ Base Legal: Art. 7º, VI da LGPD (Exercício regular de direitos)
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interesse Legítimo */}
              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Interesse Legítimo
                      </h3>
                      <p className="text-slate-700 dark:text-navy-200 mb-3">
                        Nossas investigações são realizadas para <strong className="text-blue-600">proteção de direitos legítimos</strong> dos contratantes: prevenção de fraudes, due diligence, compliance, proteção de crédito e segurança.
                      </p>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        ✅ Base Legal: Art. 7º, IX da LGPD (Interesse legítimo)
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Segurança */}
              <Card className="border-l-4 border-purple-500">
                <CardContent className="p-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <Lock className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Segurança e Confidencialidade
                      </h3>
                      <p className="text-slate-700 dark:text-navy-200 mb-3">
                        Implementamos <strong className="text-purple-600">medidas técnicas e administrativas</strong> para proteção dos dados: criptografia, controle de acesso, auditoria de logs e treinamento de equipe.
                      </p>
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                        ✅ Conformidade: Art. 46 da LGPD (Segurança da informação)
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Consentimento */}
              <Card className="border-l-4 border-orange-500">
                <CardContent className="p-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Consentimento Informado (Quando Aplicável)
                      </h3>
                      <p className="text-slate-700 dark:text-navy-200 mb-3">
                        Quando a investigação envolve dados fornecidos voluntariamente (perícia profissional de dispositivos próprios, por exemplo), sempre solicitamos <strong className="text-orange-600">consentimento livre, informado e inequívoco</strong>.
                      </p>
                      <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                        ✅ Base Legal: Art. 7º, I da LGPD (Consentimento)
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Direitos dos Titulares */}
        <section className="py-16 bg-white dark:bg-navy-950">
          <div className="container max-w-6xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Seus Direitos sob a LGPD
              </h2>
              <p className="text-lg text-slate-600 dark:text-navy-300">
                Como titular de dados, você possui os seguintes direitos garantidos pela LGPD:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Confirmação e Acesso</h4>
                  <p className="text-sm text-slate-600 dark:text-navy-300">
                    Direito de confirmar se tratamos seus dados e solicitar acesso aos mesmos.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Correção</h4>
                  <p className="text-sm text-slate-600 dark:text-navy-300">
                    Direito de solicitar correção de dados incompletos, inexatos ou desatualizados.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Anonimização ou Exclusão</h4>
                  <p className="text-sm text-slate-600 dark:text-navy-300">
                    Direito de solicitar anonimização ou exclusão de dados desnecessários ou tratados em desconformidade.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Portabilidade</h4>
                  <p className="text-sm text-slate-600 dark:text-navy-300">
                    Direito de solicitar portabilidade dos dados a outro fornecedor.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Informação sobre Compartilhamento</h4>
                  <p className="text-sm text-slate-600 dark:text-navy-300">
                    Direito de saber com quais entidades compartilhamos seus dados.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Revogação de Consentimento</h4>
                  <p className="text-sm text-slate-600 dark:text-navy-300">
                    Direito de revogar consentimento a qualquer momento (quando aplicável).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Oposição ao Tratamento</h4>
                  <p className="text-sm text-slate-600 dark:text-navy-300">
                    Direito de se opor ao tratamento quando não houver consentimento ou base legal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-1">Petição à ANPD</h4>
                  <p className="text-sm text-slate-600 dark:text-navy-300">
                    Direito de peticionar junto à Autoridade Nacional de Proteção de Dados (ANPD).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dados que Tratamos */}
        <section className="py-16 bg-slate-50 dark:bg-navy-900">
          <div className="container max-w-5xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Quais Dados Tratamos
              </h2>
            </div>

            <div className="bg-white dark:bg-navy-950 rounded-2xl p-8 shadow-xl">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    Dados de Fontes Públicas (OSINT):
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-navy-200">Nome completo, CPF, RG, data de nascimento</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-navy-200">Processos judiciais (cíveis, criminais, trabalhistas)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-navy-200">Sanções e impedimentos (CEIS, CNEP, TCU, CGU)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-navy-200">Participações societárias (CNPJs, quadro societário)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-navy-200">Bens e patrimônio (imóveis, veículos)</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-navy-800">
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-6 w-6 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-1">Importante:</h4>
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          NÃO coletamos dados sensíveis (origem racial, convicções religiosas, dados de saúde, orientação sexual, etc.) conforme Art. 5º, II da LGPD, salvo quando expressamente autorizados por lei ou consentimento específico.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contato DPO */}
        <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-navy-900 dark:to-green-900">
          <div className="container max-w-4xl px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Entre em Contato
              </h2>
              <p className="text-lg text-slate-600 dark:text-navy-300">
                Para exercer seus direitos sob a LGPD ou esclarecer dúvidas sobre proteção de dados
              </p>
            </div>

            <Card className="border-2 border-green-500">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">E-mail DPO (Encarregado de Dados)</h4>
                      <a href="mailto:lgpd@investigacaodigital.com.br" className="text-green-600 hover:underline">
                        lgpd@investigacaodigital.com.br
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">WhatsApp</h4>
                      <a href="https://wa.me/5547992602673" className="text-blue-600 hover:underline">
                        +55 (47) 99260-2673
                      </a>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-navy-300">
                      <strong>Prazo de resposta:</strong> Responderemos sua solicitação em até 15 dias úteis, conforme Art. 18, § 3º da LGPD.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-12">
              <Link href="/privacidade">
                <Button variant="outline" size="lg" className="border-green-500 text-green-600 hover:bg-green-500/10">
                  Ver Política de Privacidade Completa
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
