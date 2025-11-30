"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import {
  ArrowLeft, Briefcase, GraduationCap,
  Shield, CheckCircle, MapPin, Award,
  FileSearch, Search, Users, Database,
  Brain, Cpu, BarChart3, Building2,
  Vote, Scale, Landmark, UserCheck,
  Heart, Globe, Lock
} from "lucide-react";

const STATS = [
  { value: "100.000+", label: "Registros por investigacao", icon: Database },
  { value: "50+", label: "Bases de dados exclusivas", icon: Landmark },
  { value: "27", label: "Estados + Internacional", icon: MapPin },
  { value: "48h", label: "Entrega expressa", icon: BarChart3 },
];

const EXPERTISE_AREAS = [
  {
    icon: Vote,
    title: "Investigacao Politica & Eleitoral",
    subtitle: "Compliance para campanhas e partidos",
    color: "blue",
    items: [
      "Verificacao de candidatos e filiados",
      "Analise de doacoes eleitorais (TSE)",
      "Historico de candidaturas desde 2012",
      "Cruzamento com CEIS/CNEP/CEAF",
      "Identificacao de laranjas eleitorais"
    ]
  },
  {
    icon: Building2,
    title: "Auditoria de Servidores Publicos",
    subtitle: "Orgaos municipais, estaduais e federais",
    color: "green",
    items: [
      "Verificacao de obitos em folhas de pagamento",
      "Cruzamento com beneficios sociais",
      "Analise de vinculos empresariais",
      "Deteccao de acumulo ilegal de cargos",
      "Identificacao de funcionarios fantasmas"
    ]
  },
  {
    icon: Brain,
    title: "Automacao com IA Generativa",
    subtitle: "Multiplas IAs de ultima geracao",
    color: "purple",
    items: [
      "OpenAI GPT-5 e GPT-5.1 para analise de dados",
      "Anthropic Claude Opus 4.5 para relatorios",
      "Google Gemini 3 para processamento multimodal",
      "AWS Bedrock para escala enterprise",
      "Agentes autonomos de IA para monitoramento"
    ]
  },
  {
    icon: Database,
    title: "Processamento em Massa",
    subtitle: "Big Data para investigacao",
    color: "orange",
    items: [
      "Upload de bases com +100.000 registros",
      "Cruzamento simultaneo em 15+ fontes",
      "Exportacao em PDF, Excel e CSV",
      "Dashboard interativo em tempo real",
      "APIs para integracao com sistemas"
    ]
  },
  {
    icon: Scale,
    title: "Compliance & LGPD",
    subtitle: "Investigacao dentro da lei",
    color: "red",
    items: [
      "100% baseado em fontes publicas",
      "Conformidade total com LGPD",
      "Audit trail de todas as consultas",
      "Relatorios com validade juridica",
      "Metodologia documentada"
    ]
  },
  {
    icon: Search,
    title: "OSINT Avancado",
    subtitle: "Inteligencia em fontes abertas",
    color: "cyan",
    items: [
      "Rastreamento de pegada digital",
      "Analise de redes sociais",
      "Verificacao de reputacao online",
      "Monitoramento de mencoes",
      "Deep web research (quando autorizado)"
    ]
  },
  {
    icon: Globe,
    title: "Bases de Dados Nacionais e Internacionais",
    subtitle: "1600+ fontes catalogadas (OSINT Brazuca)",
    color: "indigo",
    items: [
      "Portal Brasileiro de Dados Abertos",
      "SICAR (Cadastro Ambiental Rural)",
      "Dados MJ (Justica Brasileira)",
      "Registros de imoveis e veiculos",
      "Bases internacionais (OFAC, OFSI, UE)"
    ]
  },
  {
    icon: Heart,
    title: "Protecao Patrimonial em Divorcios",
    subtitle: "440 mil divorcios/ano no Brasil (IBGE 2023)",
    color: "pink",
    items: [
      "Levantamento de bens ocultos em nome de terceiros",
      "Identificacao de empresas e contas offshore",
      "Rastreamento de criptomoedas (IBDFAM alerta)",
      "Documentacao com validade judicial",
      "Apoio a advogados de familia"
    ]
  }
];

const CERTIFICATIONS = [
  { name: "IA Generativa com AWS", institution: "Amazon Web Services", year: "2024" },
  { name: "Machine Learning Essentials", institution: "AWS", year: "2024" },
  { name: "Amazon SageMaker", institution: "AWS", year: "2024" },
  { name: "Formacao Consultor de IA", institution: "AnaTex", year: "2024" },
  { name: "ClickUp 3.0 + Flow Pro", institution: "Bravy Training", year: "2024" },
  { name: "Agentes de IA - Zaia", institution: "Zaia", year: "2024" },
  { name: "IA na Pratica", institution: "Trybe", year: "2024" },
];

const TECH_STACK = [
  { category: "IA Generativa", techs: ["OpenAI GPT-5", "Claude Opus 4.5", "Google Gemini 3", "AWS Bedrock"] },
  { category: "Backend", techs: ["Cloudflare Workers", "Hono.js", "D1 SQLite", "Supabase"] },
  { category: "Frontend", techs: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"] },
  { category: "APIs Gov", techs: ["SERPRO", "InfoSimples", "Portal Transparencia", "TSE"] },
  { category: "Automacao", techs: ["Python", "Selenium", "Pandas", "BeautifulSoup"] },
];

const CASES = [
  {
    title: "Auditoria de Folha de Pagamento",
    description: "Cruzamento de servidores com bases de obitos (DATASUS), beneficios sociais (Portal Transparencia) e vinculos empresariais (Receita Federal). Metodologia aplicavel a qualquer orgao publico.",
    result: "Deteccao de irregularidades",
    duration: "72 horas"
  },
  {
    title: "Compliance Eleitoral",
    description: "Verificacao de candidatos e filiados em bases do TSE (candidaturas desde 2012), CEIS/CNEP/CEAF, processos judiciais e doacoes eleitorais. Prevencao de riscos reputacionais.",
    result: "Relatorio individual por pessoa",
    duration: "Conforme volume"
  },
  {
    title: "Investigacao Patrimonial - Divorcio",
    description: "Levantamento de bens em nome de terceiros, empresas offshore, imoveis e veiculos. Segundo IBDFAM, ocultacao de bens e fraude comum no Direito das Familias, principalmente por homens.",
    result: "Documentacao para processo judicial",
    duration: "Conforme complexidade"
  }
];

export default function DaniKaloiPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-7xl px-4">
            <Link href="/quemsomos">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar para Quem Somos
              </Button>
            </Link>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Summary */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <Badge className="bg-amber-500 text-white mb-4">
                    Referencia Nacional em Investigacao Digital
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    Dani Kaloi
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-primary-500 text-white">
                      Fundadora & CTO
                    </Badge>
                    <Badge className="bg-purple-600 text-white">
                      Arquiteta de IA
                    </Badge>
                    <Badge className="bg-blue-600 text-white">
                      OSINT Expert
                    </Badge>
                    <Badge className="bg-green-600 text-white">
                      +16 Certificacoes
                    </Badge>
                  </div>
                  <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Pioneira em investigacao digital com Inteligencia Artificial no Brasil.
                    Desenvolvedora Full Stack e Arquiteta de sistemas que processam
                    <strong className="text-neutral-900 dark:text-neutral-100"> +100.000 registros simultaneamente</strong>,
                    cruzando <strong className="text-neutral-900 dark:text-neutral-100">50+ bases de dados exclusivas</strong> -
                    governamentais, autorais e sigilosas, nacionais e internacionais.
                    Especialista em investigacao de agentes politicos, servidores publicos e
                    <strong className="text-neutral-900 dark:text-neutral-100"> protecao patrimonial para mulheres em divorcios com narcisistas</strong>.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {STATS.map((stat, idx) => (
                    <div key={idx} className="text-center p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-sm">
                      <stat.icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{stat.value}</p>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Card */}
              <div>
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle>Informacoes Profissionais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Fundadora & CTO - investigaree
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Itapema, Santa Catarina, Brasil
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          IA Generativa & Automacao
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          Tecnologo em Criminologia
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-primary-500" />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          +12 anos no mercado
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Link href="/contato" className="block">
                        <Button className="w-full" size="lg">
                          Solicitar Investigacao
                        </Button>
                      </Link>
                      <Link href="/servicos" className="block">
                        <Button variant="outline" className="w-full" size="lg">
                          Ver Servicos
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Diferencial - IA + Volume */}
        <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
          <div className="container max-w-7xl px-4">
            <div className="text-center text-white space-y-4">
              <Cpu className="w-12 h-12 mx-auto opacity-80" />
              <h2 className="text-3xl font-bold">
                Investigacao Potencializada por IA Generativa
              </h2>
              <p className="text-lg opacity-90 max-w-3xl mx-auto">
                Enquanto investigadores tradicionais analisam dezenas de registros por dia,
                nossos sistemas automatizados com <strong>GPT-5, Claude Opus 4.5, Gemini 3 e agentes autonomos de IA</strong> processam
                <strong> milhares de registros em minutos</strong>, gerando relatorios executivos
                com insights que seriam impossiveis de detectar manualmente.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Badge className="bg-white/20 text-white border-white/30">OpenAI GPT-5</Badge>
                <Badge className="bg-white/20 text-white border-white/30">Claude Opus 4.5</Badge>
                <Badge className="bg-white/20 text-white border-white/30">Google Gemini 3</Badge>
                <Badge className="bg-white/20 text-white border-white/30">AWS Bedrock</Badge>
                <Badge className="bg-white/20 text-white border-white/30">Agentes Autonomos</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Areas de Expertise */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Especializacoes</Badge>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Areas de Expertise
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2 max-w-2xl mx-auto">
                Combinacao unica de conhecimento investigativo, tecnologia de ponta e automacao inteligente
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXPERTISE_AREAS.map((area, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 bg-${area.color}-100 dark:bg-${area.color}-900/20 rounded-lg`}>
                        <area.icon className={`w-6 h-6 text-${area.color}-600`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{area.title}</CardTitle>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {area.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {area.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cases de Sucesso */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Resultados Comprovados</Badge>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Cases de Sucesso
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {CASES.map((case_, idx) => (
                <Card key={idx} className="border-l-4 border-l-primary-500">
                  <CardHeader>
                    <CardTitle className="text-lg">{case_.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {case_.description}
                    </p>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <div>
                        <p className="text-xs text-neutral-500">Resultado</p>
                        <p className="font-semibold text-green-600">{case_.result}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-500">Prazo</p>
                        <p className="font-semibold">{case_.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Stack Tecnologico */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Tecnologia</Badge>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Stack Tecnologico
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Ferramentas de ponta para investigacao em escala
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto">
              {TECH_STACK.map((stack, idx) => (
                <Card key={idx} className="text-center">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-primary-600">{stack.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {stack.techs.map((tech, i) => (
                        <p key={i} className="text-xs text-neutral-600 dark:text-neutral-400">
                          {tech}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Certificacoes */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Qualificacoes</Badge>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Certificacoes em IA & Machine Learning
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {CERTIFICATIONS.map((cert, idx) => (
                <Card key={idx} className="text-center hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <Award className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                    <p className="font-semibold text-sm">{cert.name}</p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                      {cert.institution} ({cert.year})
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                + Tecnologo em Criminologia (Cruzeiro do Sul Virtual) - Em andamento
              </p>
            </div>
          </div>
        </section>

        {/* Foco Principal */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Foco Principal</Badge>
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                Publicos Atendidos
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                    <Vote className="w-5 h-5 text-blue-600" />
                    Setor Politico & Eleitoral
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Partidos politicos e coligacoes
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Campanhas eleitorais (compliance)
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Gabinetes de parlamentares
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-green-600" />
                    Setor Publico
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Prefeituras e camaras municipais
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Governos estaduais
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Tribunais de contas
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-pink-200 dark:border-pink-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                    <Heart className="w-5 h-5 text-pink-600" />
                    Mulheres em Divorcio
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Vitimas de abuso financeiro
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Parceiros que ocultam patrimonio
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Relacionamentos com narcisistas
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Dados Oficiais */}
            <div className="mt-12 max-w-4xl mx-auto">
              <Card className="bg-pink-50 dark:bg-pink-950/20 border-pink-200 dark:border-pink-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Heart className="w-8 h-8 text-pink-500 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Protecao para Mulheres em Divorcios</h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        Segundo o <strong>IBDFAM</strong> (Instituto Brasileiro de Direito de Familia), a ocultacao de bens e uma
                        <strong> fraude comum no Direito das Familias</strong>, praticada principalmente por homens que mantem
                        controle financeiro sobre suas esposas. O Brasil registrou <strong>440.827 divorcios em 2023</strong> (IBGE).
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Metodos comuns de ocultacao incluem: transferencias para terceiros ("laranjas"), empresas em nome de familiares,
                        contas no exterior e <strong>criptomoedas</strong> - identificadas pelo IBDFAM como forma inovadora de esconder bens.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
          <div className="container max-w-4xl px-4 text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">
              Precisa investigar milhares de pessoas?
            </h2>
            <p className="text-lg text-primary-100">
              Folhas de pagamento, bases de filiados, fornecedores, candidatos...
              <br />Nossa tecnologia processa qualquer volume com precisao e velocidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contato">
                <Button size="lg" className="bg-white text-primary-700 hover:bg-primary-50">
                  Solicitar Orcamento
                </Button>
              </Link>
              <Link href="/servicos">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Ver Servicos
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
