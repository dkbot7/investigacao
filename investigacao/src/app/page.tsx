"use client";

import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Shield, ArrowRight, CheckCircle2, Search,
  Target, Users, FileText, AlertTriangle,
  Eye, Lock, Zap, TrendingUp, Heart,
  Building2, ShieldAlert, Scale
} from "lucide-react";

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* HERO - Multi-Audience */}
        <section className="pt-32 pb-20 bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-900 dark:to-green-900">
          <div className="container max-w-5xl mx-auto px-4 text-center space-y-8">
            {/* Badge Trust Signal */}
            <Badge className="bg-green-600 text-white font-bold px-6 py-3 text-lg">
              🛡️ Metodologia Profissional Validada
            </Badge>

            {/* Headline - O Que Fazemos */}
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white leading-tight">
              Investigação Profissional com<br />Metodologia Validada
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Proteja seu negócio, decisões de contratação e patrimônio com inteligência baseada em
              <strong className="text-green-600"> 27 tribunais e fontes oficiais do governo</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Link href="/contato" className="flex-1">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white h-16 text-xl font-bold">
                  Solicitar Investigação
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/solucoes" className="flex-1">
                <Button size="lg" variant="outline" className="w-full h-16 text-xl font-bold border-2">
                  Ver Soluções
                </Button>
              </Link>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-8 text-base text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-green-600" />
                <span className="font-medium">5.950 investigações realizadas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                <span className="font-medium">100% Conformidade LGPD</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-green-600" />
                <span className="font-medium">Relatórios com validade judicial</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6 AUDIENCES - Quem Usa Nossa Plataforma */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-2 text-sm font-semibold bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                SOLUÇÕES POR PÚBLICO-ALVO
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Quem Usa Investigação Profissional?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Descubra a solução ideal para seu perfil e necessidade específica
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* RH & Compliance */}
              <Link href="/solucoes/rh-compliance">
                <Card className="h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500 group">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      RH & Compliance
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      Background check antes de contratar executivos. Valide CPF, antecedentes e sanções em fontes oficiais.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700">
                      Ver Soluções RH
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Investidores */}
              <Link href="/solucoes/due-diligence">
                <Card className="h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500 group">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Investidores
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      Due diligence M&A antes de investir. Análise completa de empresas, sócios e passivos ocultos.
                    </p>
                    <Button className="w-full bg-green-600 hover:bg-green-700 group-hover:bg-green-700">
                      Ver Due Diligence
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Advogados */}
              <Link href="/solucoes/coleta-provas-digitais">
                <Card className="h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500 group">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Scale className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Advogados
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      Provas digitais para processos judiciais. Cadeia de custódia e relatórios admissíveis.
                    </p>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-700">
                      Ver Soluções Jurídicas
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Divórcio & Família */}
              <Link href="/solucoes/due-diligence-divorcios">
                <Card className="h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500 group">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Heart className="h-8 w-8 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Divórcio & Família
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      Rastreamento de patrimônio oculto. Investigação patrimonial completa para partilha justa.
                    </p>
                    <Button className="w-full bg-pink-600 hover:bg-pink-700 group-hover:bg-pink-700">
                      Ver Investigação Patrimonial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Auditores Públicos */}
              <Link href="/solucoes/auditoria-licitacoes">
                <Card className="h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500 group">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Auditores Públicos
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      Compliance em licitações governamentais. Auditoria completa de fornecedores e contratados.
                    </p>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700 group-hover:bg-orange-700">
                      Ver Auditoria Licitações
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              {/* Vítimas de Exposição */}
              <Link href="/solucoes/protecao-remocao">
                <Card className="h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500 group">
                  <CardContent className="p-8 space-y-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Vítimas de Exposição
                    </h3>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      Remoção de conteúdo sensível LGPD. Proteção de privacidade e desindexação Google em 24-72h.
                    </p>
                    <Button className="w-full bg-red-600 hover:bg-red-700 group-hover:bg-red-700">
                      Ver Proteção Digital
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* CTA Footer */}
            <div className="text-center mt-12">
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                Não encontrou sua necessidade específica?
              </p>
              <Link href="/contato">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold">
                  Fale com um Especialista
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* METODOLOGIA - Como Funciona */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-green-900">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <Badge className="mb-4 px-4 py-2 text-sm font-semibold bg-green-600 text-white">
                METODOLOGIA PROFISSIONAL
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Como Nossa Investigação Funciona?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                Metodologia profissional validada com fontes oficiais do governo e conformidade total LGPD
              </p>
            </div>

            {/* 3 Steps Process */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="border-2 border-green-500 hover:shadow-2xl transition-all">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-20 h-20 bg-green-600 text-white rounded-full mx-auto flex items-center justify-center text-4xl font-bold shadow-xl">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Você Solicita
                  </h3>
                  <p className="text-lg text-slate-700 dark:text-slate-300">
                    Informe o CPF ou CNPJ do alvo. Pode ser candidato, funcionário, empresa, parceiro ou qualquer pessoa/organização.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-500 hover:shadow-2xl transition-all">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-600 text-white rounded-full mx-auto flex items-center justify-center text-4xl font-bold shadow-xl">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Investigação Profissional
                  </h3>
                  <p className="text-lg text-slate-700 dark:text-slate-300">
                    Vasculhamos 27 tribunais, TSE, CNJ, Receita Federal, CEIS/CNEP e 100+ fontes oficiais do governo.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-500 hover:shadow-2xl transition-all">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-20 h-20 bg-purple-600 text-white rounded-full mx-auto flex items-center justify-center text-4xl font-bold shadow-xl">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Relatório em 24-48h
                  </h3>
                  <p className="text-lg text-slate-700 dark:text-slate-300">
                    Você recebe relatório completo com processos, dívidas, sanções, histórico e red flags identificadas.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* What We Investigate - Grid */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl p-8 md:p-12 shadow-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                O Que Investigamos em Cada Relatório
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Antecedentes Criminais</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Busca em 27 Tribunais de Justiça + CNJ</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Processos Judiciais</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Trabalhistas, cíveis, tributários, família</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Sanções e Impedimentos</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">CEIS, CNEP, CNJ, TCU, CGU, OFAC</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Validação de Dados</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">CPF, RG, nome completo, data de nascimento</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Situação Fiscal</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Débitos federais, estaduais e municipais</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Participações Societárias</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Empresas, CNPJs, quadro societário</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Patrimônio</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Imóveis, veículos, bens registrados</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Red Flags Identificadas</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Análise de risco e inconsistências</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="text-center">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <h5 className="font-bold text-slate-900 dark:text-white">100% LGPD</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Conformidade total</p>
                </div>
                <div className="text-center">
                  <FileText className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-bold text-slate-900 dark:text-white">Validade Judicial</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Relatórios admissíveis</p>
                </div>
                <div className="text-center">
                  <Zap className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                  <h5 className="font-bold text-slate-900 dark:text-white">24-48h</h5>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Entrega garantida</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POR QUE VOCÊ PRECISA - Problemas Reais */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Por Que Investigar ANTES da Campanha?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Casos reais do que pode acontecer
              </p>
            </div>

            <div className="space-y-6">
              {/* Caso 1 */}
              <Card className="border-l-4 border-orange-500">
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Adversário te atacou com processo antigo
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 mb-3">
                        Candidato não sabia que adversário tinha processo trabalhista de R$ 500K.
                        <strong className="text-orange-600"> Adversário descobriu primeiro e usou contra</strong>.
                        Virou manchete e perdeu 10 pontos nas pesquisas.
                      </p>
                      <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400">
                        Pesquisa de Oposição
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Caso 2 */}
              <Card className="border-l-4 border-purple-500">
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Doador irregular = Multa de R$ 106 mil
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 mb-3">
                        Campanha aceitou doação sem verificar. Doador tinha impedimento TSE.
                        <strong className="text-purple-600"> Multa máxima + prestação de contas rejeitada</strong>.
                        Tudo porque não fez triagem prévia.
                      </p>
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                        Triagem de Doadores
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Caso 3 */}
              <Card className="border-l-4 border-blue-500">
                <CardContent className="p-6 md:p-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                        Vice-prefeito tinha Ficha Suja = Chapa cassada
                      </h3>
                      <p className="text-slate-700 dark:text-slate-300 mb-3">
                        Não fizeram due diligence do vice. Ele tinha condenação antiga.
                        <strong className="text-blue-600"> TSE cassou a chapa toda</strong>.
                        R$ 2 milhões de campanha perdidos por falta de investigação.
                      </p>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                        Due Diligence
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Como Funciona?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Processo simples em 3 passos
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-green-600 text-white rounded-full mx-auto flex items-center justify-center text-4xl font-bold shadow-xl">
                  1
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Você informa quem investigar
                </h3>
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  Adversário, doador ou parceiro. Só precisa do CPF e nome completo.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-green-600 text-white rounded-full mx-auto flex items-center justify-center text-4xl font-bold shadow-xl">
                  2
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Nossa equipe investiga
                </h3>
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  Vasculhamos 27 tribunais, TSE, CNJ, Receita e fontes públicas oficiais.
                </p>
              </div>

              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-green-600 text-white rounded-full mx-auto flex items-center justify-center text-4xl font-bold shadow-xl">
                  3
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Relatório em 48h
                </h3>
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  Você recebe tudo organizado: processos, dívidas, histórico e riscos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PARA QUEM É */}
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
          <div className="container max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
                Quem Contrata Investigação?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Target className="h-12 w-12 text-green-600" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Candidatos
                    </h3>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
                    Quer investigar seu adversário antes dele te atacar? Precisa verificar doadores?
                    Nosso serviço é pra você.
                  </p>
                  <Link href="/solucoes/campanhas">
                    <Button className="w-full">Ver Mais</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Users className="h-12 w-12 text-green-600" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Coordenadores
                    </h3>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
                    Coordena campanha e precisa investigar adversários em lote? Verificar vices e aliados?
                    Fazemos investigação em massa.
                  </p>
                  <Link href="/solucoes/campanhas">
                    <Button className="w-full">Ver Mais</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Shield className="h-12 w-12 text-green-600" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Partidos
                    </h3>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
                    Precisa investigar centenas de candidatos da coligação? Fazemos em lote com preço especial.
                  </p>
                  <Link href="/solucoes/partidos">
                    <Button className="w-full">Ver Mais</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <TrendingUp className="h-12 w-12 text-green-600" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Consultorias
                    </h3>
                  </div>
                  <p className="text-lg text-slate-700 dark:text-slate-300 mb-4">
                    Presta serviço para campanhas? Pode revender nossa investigação com sua marca (white-label).
                  </p>
                  <Link href="/solucoes/consultorias">
                    <Button className="w-full">Ver Mais</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* GARANTIAS */}
        <section className="py-20 bg-white dark:bg-slate-950">
          <div className="container max-w-4xl mx-auto px-4">
            <Card className="border-2 border-green-500">
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mx-auto flex items-center justify-center">
                  <Eye className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                  100% Legal e Confidencial
                </h2>
                <p className="text-xl text-slate-700 dark:text-slate-300">
                  Só usamos fontes públicas oficiais. Nada ilegal, nada invasivo.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-slate-900 dark:text-white">Só fontes públicas</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tribunais, TSE, CNJ</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-slate-900 dark:text-white">Totalmente confidencial</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Dados protegidos</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-slate-900 dark:text-white">100% dentro da lei</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Lei Eleitoral + LGPD</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="font-bold text-slate-900 dark:text-white">Equipe experiente</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Profissionais especializados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold">
              Não Seja Pego de Surpresa
            </h2>

            <p className="text-2xl">
              Investigue ANTES de ser atacado. Proteja sua campanha.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Link href="/contato" className="flex-1">
                <Button size="lg" className="w-full bg-white text-green-600 hover:bg-green-50 font-bold h-16 text-xl">
                  Solicitar Investigação
                  <ArrowRight className="ml-2 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/precos" className="flex-1">
                <Button size="lg" variant="outline" className="w-full border-2 border-white text-white hover:bg-white/10 h-16 text-xl font-bold">
                  Ver Preços
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-lg">
              <span>✓ 100% Confidencial</span>
              <span>✓ 48 horas</span>
              <span>✓ 100% Legal</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
