"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import Image from "next/image";
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
  { value: "Multiplas", label: "Bases de dados", icon: Landmark },
  { value: "27", label: "Estados + Internacional", icon: MapPin },
  { value: "48h", label: "Entrega expressa", icon: BarChart3 },
];

const EXPERTISE_AREAS = [
  {
    icon: Building2,
    title: "Due Diligence Empresarial",
    subtitle: "Background check corporativo",
    color: "green",
    items: [
      "Verificacao de funcionarios e candidatos",
      "Analise de vinculos empresariais",
      "Cruzamento com bases de sancoes",
      "Deteccao de conflitos de interesse",
      "Verificacao de antecedentes"
    ]
  },
  {
    icon: Brain,
    title: "Automacao Avancada",
    subtitle: "Tecnologia de ponta para investigacao",
    color: "purple",
    items: [
      "Processamento em massa de registros",
      "Cruzamento automatico de bases de dados",
      "Geracao automatica de relatorios",
      "Monitoramento continuo",
      "Integracao com multiplas fontes"
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
  { name: "Criacao e Gerenciamento de Agentes de IA", institution: "Zaia", year: "2024" },
  { name: "Formacao PARAISO DIGITAL (Consultoria de IA)", institution: "AnaTex", year: "2024" },
  { name: "Formacao ClickUp 3.0 + Flow Pro", institution: "Bravy Training", year: "2024" },
  { name: "Building a Machine Learning Ready Organization", institution: "AWS", year: "2024" },
  { name: "Introduction to Amazon SageMaker", institution: "AWS", year: "2024" },
  { name: "Introduction to Machine Learning", institution: "AWS", year: "2024" },
  { name: "Introducao a IA Generativa com AWS", institution: "Trybe", year: "2024" },
  { name: "ML Essentials for Business Decision Makers", institution: "AWS", year: "2024" },
  { name: "Machine Learning Terminology and Process", institution: "AWS", year: "2024" },
  { name: "Planning a Machine Learning Project", institution: "AWS", year: "2024" },
  { name: "IA na Pratica", institution: "Trybe", year: "2024" },
  { name: "Excel para Analise de Dados", institution: "Preditiva Analytics", year: "2023" },
  { name: "Introduction to AWS IAM", institution: "AWS", year: "2022" },
];

const TECH_STACK = [
  { category: "Automacao", techs: ["Python", "Selenium", "Pandas", "BeautifulSoup"] },
  { category: "Backend", techs: ["Cloudflare Workers", "Hono.js", "D1 SQLite", "Supabase"] },
  { category: "Frontend", techs: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { category: "Dados", techs: ["APIs Publicas", "Web Scraping", "Bases Abertas", "Integracao"] },
  { category: "Seguranca", techs: ["LGPD", "Audit Trail", "Criptografia", "Compliance"] },
];

const CASES = [
  {
    title: "Auditoria de Folha de Pagamento",
    description: "Cruzamento de funcionarios com bases de obitos, beneficios sociais e vinculos empresariais. Metodologia aplicavel a qualquer empresa.",
    result: "Deteccao de irregularidades",
    duration: "72 horas"
  },
  {
    title: "Due Diligence Empresarial",
    description: "Verificacao completa de funcionarios, fornecedores e parceiros comerciais. Cruzamento com bases de sancoes e analise de antecedentes.",
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
      <main className="min-h-screen bg-navy-950">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-navy-900 to-navy-950">
          <div className="container max-w-7xl px-4">
            <Link href="/quemsomos">
              <Button variant="ghost" className="mb-6 text-navy-200 hover:text-white hover:bg-navy-800">
                <ArrowLeft className="mr-2 w-4 h-4" />
                Voltar para Quem Somos
              </Button>
            </Link>

            {/* Profile Photo */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-gold-500 shadow-2xl">
                <Image
                  src="/dani-kaloi.png"
                  alt="Dani Kaloi - Analista de Dados e OSINT Expert"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Profile Summary */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <Badge className="bg-gold-500 text-navy-900 mb-4">
                    Referencia Nacional em Investigacao Digital com IA
                  </Badge>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Dani Kaloi
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className="bg-navy-700 text-gold-400 border border-gold-500/30">
                      Analista de Dados
                    </Badge>
                    <Badge className="bg-navy-700 text-gold-400 border border-gold-500/30">
                      Arquiteta de Sistemas
                    </Badge>
                    <Badge className="bg-navy-700 text-gold-400 border border-gold-500/30">
                      OSINT Expert
                    </Badge>
                    <Badge className="bg-navy-700 text-gold-400 border border-gold-500/30">
                      +13 Certificacoes
                    </Badge>
                  </div>
                  <p className="text-xl text-navy-200 leading-relaxed">
                    Desenvolvedora Full Stack e Arquiteta de sistemas que processam
                    <strong className="text-gold-400"> +100.000 registros simultaneamente</strong>,
                    cruzando <strong className="text-gold-400">multiplas bases de dados</strong> -
                    governamentais, autorais e sigilosas, nacionais e internacionais.
                    Especialista em due diligence empresarial e
                    <strong className="text-gold-400"> protecao patrimonial para mulheres em divorcios</strong>.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  {STATS.map((stat, idx) => (
                    <div key={idx} className="text-center p-4 bg-navy-800 border border-navy-700 rounded-lg">
                      <stat.icon className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-gold-400">{stat.value}</p>
                      <p className="text-xs text-navy-300">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Card */}
              <div>
                <Card className="sticky top-20 bg-navy-800 border-navy-700">
                  <CardHeader>
                    <CardTitle className="text-white">Informacoes Profissionais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-gold-400" />
                        <span className="text-navy-200">
                          Analista de Dados - investigaree
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gold-400" />
                        <span className="text-navy-200">
                          Brasil
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Brain className="w-4 h-4 text-gold-400" />
                        <span className="text-navy-200">
                          Automacao & Integracao de Dados
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <GraduationCap className="w-4 h-4 text-gold-400" />
                        <span className="text-navy-200">
                          Tecnologo em Criminologia
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Link href="/contato" className="block">
                        <Button className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900" size="lg">
                          Solicitar Investigacao
                        </Button>
                      </Link>
                      <Link href="/servicos" className="block">
                        <Button variant="outline" className="w-full border-gold-500/50 text-gold-400 hover:bg-gold-500/10" size="lg">
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

        {/* Diferencial - Automacao + Volume */}
        <section className="py-16 bg-gradient-to-r from-gold-600 to-gold-500">
          <div className="container max-w-7xl px-4">
            <div className="text-center text-navy-900 space-y-4">
              <Cpu className="w-12 h-12 mx-auto text-navy-800" />
              <h2 className="text-3xl font-bold">
                Investigacao Potencializada por Automacao
              </h2>
              <p className="text-lg text-navy-800 max-w-3xl mx-auto">
                Enquanto investigadores tradicionais analisam dezenas de registros por dia,
                nossos sistemas automatizados processam
                <strong> milhares de registros em minutos</strong>, gerando relatorios executivos
                com insights que seriam impossiveis de detectar manualmente.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Badge className="bg-navy-900 text-gold-400">Processamento em Massa</Badge>
                <Badge className="bg-navy-900 text-gold-400">Multiplas Fontes</Badge>
                <Badge className="bg-navy-900 text-gold-400">Relatorios Automaticos</Badge>
                <Badge className="bg-navy-900 text-gold-400">Monitoramento Continuo</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Areas de Expertise */}
        <section className="py-20 bg-navy-900">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 text-gold-400 border-gold-500/30">Especializacoes</Badge>
              <h2 className="text-3xl font-bold text-white">
                Areas de Expertise
              </h2>
              <p className="text-navy-300 mt-2 max-w-2xl mx-auto">
                Combinacao unica de conhecimento investigativo, tecnologia de ponta e automacao inteligente
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXPERTISE_AREAS.map((area, idx) => (
                <Card key={idx} className="bg-navy-800 border-navy-700 hover:border-gold-500/30 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gold-500/10 rounded-lg">
                        <area.icon className="w-6 h-6 text-gold-400" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white">{area.title}</CardTitle>
                        <p className="text-sm text-navy-300">
                          {area.subtitle}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {area.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-navy-200">
                          <CheckCircle className="w-4 h-4 text-gold-400 mt-0.5 flex-shrink-0" />
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
        <section className="py-20 bg-navy-950">
          <div className="container max-w-7xl px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 text-gold-400 border-gold-500/30">Resultados Comprovados</Badge>
              <h2 className="text-3xl font-bold text-white">
                Cases de Sucesso
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {CASES.map((case_, idx) => (
                <Card key={idx} className="bg-navy-800 border-navy-700 border-l-4 border-l-gold-500">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">{case_.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-navy-200">
                      {case_.description}
                    </p>
                    <div className="flex justify-between items-center pt-2 border-t border-navy-700">
                      <div>
                        <p className="text-xs text-navy-400">Resultado</p>
                        <p className="font-semibold text-gold-400">{case_.result}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-navy-400">Prazo</p>
                        <p className="font-semibold text-white">{case_.duration}</p>
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
                Certificacoes em Automacao & Dados
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
                    <Building2 className="w-5 h-5 text-blue-600" />
                    Empresas
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Due diligence de funcionarios
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Verificacao de fornecedores
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Background check corporativo
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 dark:border-green-800">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-green-600" />
                    Familias
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Verificacao de funcionarios domesticos
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Protecao digital
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                      Analise de riscos
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
              Folhas de pagamento, funcionarios, fornecedores, parceiros...
              <br />Nossa tecnologia processa qualquer volume com precisao e velocidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contato">
                <Button size="lg" className="bg-gold-500 hover:bg-gold-600 text-navy-900">
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
