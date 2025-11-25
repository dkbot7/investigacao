"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import {
  Home, Building2, TrendingUp, Shield, Users, Search,
  FileSearch, AlertCircle, Clock, Phone, CheckCircle2,
  ArrowRight, Info
} from "lucide-react";

// Dados dos serviços
const SERVICOS_FAMILIARES = [
  {
    id: "protecao-total-familia",
    nome: "Proteção Total da Família",
    descricao: "Proteção completa da família contra riscos físicos, digitais e sociais",
    icon: Shield,
    destaque: true,
    caracteristicas: [
      "Auditoria de vulnerabilidades da rotina",
      "Mapeamento de exposição digital",
      "Monitoramento de ameaças",
      "Plano de crise familiar",
      "Verificação contínua de funcionários",
      "Inteligência preventiva + acompanhamento mensal"
    ],
    formato: "Mensal ou Anual",
    idealPara: "Família inteira, rotina sensível, alto patrimônio"
  },
  {
    id: "verificacao-pessoas-casa",
    nome: "Verificação das Pessoas da Casa",
    descricao: "Checagem completa de todos que trabalham ou convivem na casa",
    icon: Users,
    caracteristicas: [
      "Antecedentes criminais",
      "Dívidas, vínculos, processos",
      "Histórico profissional e referências",
      "Análise comportamental",
      "Pacote para 5 pessoas (domésticas + motorista + personal)"
    ],
    formato: "Por pessoa ou pacote"
  },
  {
    id: "protecao-digital-familia",
    nome: "Proteção Digital da Família",
    descricao: "Blindagem contra riscos online, especialmente para filhos adolescentes",
    icon: Shield,
    caracteristicas: [
      "Monitoramento de exposição",
      "Alertas de predadores, cyberbullying e sextortion",
      "Auditoria completa de redes sociais",
      "Educação digital",
      "Plano de limpeza de dados sensíveis"
    ],
    formato: "Mensal"
  },
  {
    id: "protecao-digital-filhos",
    nome: "Proteção Digital dos Filhos",
    descricao: "Proteção individual voltada para cada filho adolescente",
    icon: Users,
    caracteristicas: [
      "Monitoramento de redes sociais",
      "Análise de comportamento digital",
      "Alertas de ameaça",
      "Investigação de contatos suspeitos"
    ],
    formato: "Mensal por adolescente"
  },
  {
    id: "checagem-funcionarios",
    nome: "Checagem de Funcionários Domésticos",
    descricao: "Verificação detalhada de todos os funcionários domésticos",
    icon: Search,
    caracteristicas: [
      "Checagem criminal",
      "Verificação financeira",
      "Histórico de processos",
      "Checagem de referências reais",
      "Comportamento de risco"
    ],
    formato: "Por funcionário"
  },
  {
    id: "avaliacao-seguranca-casa",
    nome: "Avaliação de Segurança da Casa",
    descricao: "Mapeamento 360° das vulnerabilidades da residência",
    icon: Home,
    caracteristicas: [
      "Acesso, rotas, horários",
      "Funcionários, prestadores e visitantes",
      "Padrões de exposição involuntária",
      "Plano de reforço de segurança e privacidade"
    ],
    formato: "Única vez"
  },
  {
    id: "verificacao-relacionamentos",
    nome: "Verificação de Relacionamentos",
    descricao: "Investigação discreta e respeitosa para garantir integridade em relações pessoais",
    icon: Users,
    caracteristicas: [
      "Relação conjugal",
      "Namorado(a) dos filhos",
      "Pessoas próximas que entram na casa"
    ],
    formato: "Por investigação"
  },
  {
    id: "auditoria-trabalhista-casa",
    nome: "Auditoria Trabalhista da Casa",
    descricao: "Verificação legal e preventiva para evitar ações trabalhistas",
    icon: FileSearch,
    caracteristicas: [
      "Análise de contratos",
      "Histórico de litígios",
      "Riscos trabalhistas",
      "Estratégia segura de desligamento"
    ],
    formato: "Por auditoria"
  },
  {
    id: "atendimento-emergencia",
    nome: "Atendimento de Emergência 24h",
    descricao: "Atuação imediata em situações de risco",
    icon: Phone,
    caracteristicas: [
      "Linha direta 24/7",
      "Gestão de crise",
      "Coordenação com autoridades",
      "Contenção digital e física"
    ],
    formato: "Anual"
  }
];

const SERVICOS_EMPRESARIAIS = [
  {
    id: "protecao-completa-empresa",
    nome: "Proteção Completa da Empresa",
    descricao: "Programa anual de proteção completa para holdings e empresas",
    icon: Building2,
    destaque: true,
    caracteristicas: [
      "Contrainteligência empresarial",
      "Prevenção de vazamentos",
      "Monitoramento de riscos internos",
      "Verificação de funcionários-chave",
      "Análise de ameaças competitivas",
      "Gestão de crise"
    ],
    formato: "Anual",
    idealPara: "Holdings, empresas médias e grandes"
  },
  {
    id: "investigacao-compra-empresa",
    nome: "Investigação para Compra de Empresa",
    descricao: "Investigação profunda para processos de compra, fusão ou parceria",
    icon: FileSearch,
    caracteristicas: [
      "Análise total da empresa-alvo",
      "Sócios, executivos, histórico societário",
      "Passivos ocultos",
      "Projeção de riscos",
      "Relatório executivo + apresentação"
    ],
    formato: "Por projeto"
  },
  {
    id: "protecao-ataques-vazamentos",
    nome: "Proteção Contra Ataques e Vazamentos",
    descricao: "Proteção contra espionagem, concorrentes, ex-funcionários",
    icon: Shield,
    caracteristicas: [
      "Detecção de espiões internos",
      "Análise de vazamentos",
      "Varreduras digitais",
      "Proteção de executivos",
      "Planos de contingência"
    ],
    formato: "Mensal"
  },
  {
    id: "checagem-funcionarios-diretores",
    nome: "Checagem de Funcionários e Diretores",
    descricao: "Verificação de integridade de executivos e contratações estratégicas",
    icon: Users,
    caracteristicas: [
      "Level 1 – Operacional",
      "Level 2 – Gerencial",
      "Level 3 – Executivo",
      "Bundles empresariais disponíveis"
    ],
    formato: "Por pessoa ou pacote"
  },
  {
    id: "protecao-imagem-empresa",
    nome: "Proteção da Imagem da Empresa",
    descricao: "Proteção reputacional corporativa e dos executivos",
    icon: Shield,
    caracteristicas: [
      "Monitoramento de marca",
      "Reputação de executivos",
      "Inteligência competitiva",
      "Remoção de conteúdo negativo",
      "Alertas em tempo real"
    ],
    formato: "Mensal"
  },
  {
    id: "auditoria-trabalhista-empresa",
    nome: "Auditoria Trabalhista da Empresa",
    descricao: "Análise de riscos trabalhistas que podem custar milhões",
    icon: FileSearch,
    caracteristicas: [
      "Histórico judicial de colaboradores",
      "Padrões de litígio",
      "Auditoria contratual",
      "Mitigações legais"
    ],
    formato: "Por projeto"
  },
  {
    id: "verificacao-riscos-familiares-executivos",
    nome: "Verificação de Riscos Familiares de Executivos",
    descricao: "Análise de estabilidade conjugal e riscos pessoais de executivos",
    icon: Users,
    caracteristicas: [
      "Verificação de histórico",
      "Riscos associados a crises conjugais",
      "Regime de bens e implicações societárias"
    ],
    formato: "Por executivo"
  },
  {
    id: "blindagem-socio",
    nome: "Blindagem do Sócio",
    descricao: "Proteção jurídica e reputacional em conflitos empresariais",
    icon: Shield,
    caracteristicas: [
      "Dossiê defensivo",
      "Estratégia reputacional",
      "Plano de proteção jurídica",
      "Gestão de ataques"
    ],
    formato: "Por projeto"
  },
  {
    id: "raio-x-cnpj",
    nome: "Raio-X Completo do CNPJ",
    descricao: "Due diligence completa da empresa e dos sócios",
    icon: Search,
    caracteristicas: [
      "Histórico societário",
      "Dívidas, processos, laranjas",
      "Relatórios profundos"
    ],
    formato: "Por investigação"
  },
  {
    id: "analise-trabalhista-lider",
    nome: "Análise Trabalhista do Líder",
    descricao: "Identifica padrões de assédio, má gestão e riscos trabalhistas",
    icon: FileSearch,
    caracteristicas: [
      "Histórico de processos",
      "Padrões comportamentais",
      "Riscos futuros"
    ],
    formato: "Por análise"
  },
  {
    id: "busca-socios-escondidos",
    nome: "Busca de Sócios Escondidos",
    descricao: "Localiza co-founders, sócios ocultos e personagens críticos",
    icon: Search,
    caracteristicas: [
      "Localização nacional e internacional",
      "Verificação de direitos pendentes",
      "Documentação completa"
    ],
    formato: "Por busca"
  },
  {
    id: "verificacao-parceiros-fornecedores",
    nome: "Verificação de Parceiros e Fornecedores",
    descricao: "Verificação pré-parceria e pré-fornecimento",
    icon: Users,
    caracteristicas: [
      "Análise de idoneidade",
      "Histórico empresarial",
      "Capacidade de entrega"
    ],
    formato: "Por verificação"
  }
];

const SERVICOS_INVESTIMENTOS = [
  {
    id: "checagem-rapida-founder",
    nome: "Checagem Rápida do Founder",
    descricao: "Análise rápida em 48h para saber se o founder é confiável",
    icon: Clock,
    destaque: true,
    caracteristicas: [
      "3 verificações críticas",
      "Principais red flags",
      "Score inicial de confiabilidade",
      "Entrega em 48 horas"
    ],
    formato: "Por análise",
    idealPara: "Decisões rápidas, primeira análise"
  },
  {
    id: "investigacao-completa-founder",
    nome: "Investigação Completa do Founder",
    descricao: "Verificação profunda, padrão VC Tier-1",
    icon: FileSearch,
    caracteristicas: [
      "Histórico completo",
      "Empresas anteriores",
      "Processos judiciais",
      "Passivos ocultos",
      "Laranjas / sócios",
      "Reputação digital",
      "Recomendações executivas"
    ],
    formato: "Por investigação"
  },
  {
    id: "investigacao-profunda-founder",
    nome: "Investigação Profunda do Founder",
    descricao: "Investigação aprofundada de 50–100 horas",
    icon: Search,
    caracteristicas: [
      "20+ referências verificadas",
      "Deep web/dark web",
      "Análise psicológica comportamental",
      "Auditoria digital completa"
    ],
    formato: "Por investigação"
  },
  {
    id: "raio-x-startup",
    nome: "Raio-X Completo da Startup",
    descricao: "Análise completa da startup (não só do founder)",
    icon: Building2,
    caracteristicas: [
      "Cap table completo",
      "Métricas e números",
      "Histórico societário",
      "Passivos ocultos",
      "Indicadores de fraude"
    ],
    formato: "Por análise"
  },
  {
    id: "raio-x-cnpj-startup",
    nome: "Raio-X do CNPJ da Startup",
    descricao: "Raio-X empresarial do CNPJ da startup",
    icon: FileSearch,
    caracteristicas: [
      "Estrutura societária",
      "Passivos fiscais e trabalhistas",
      "Sócios ocultos",
      "Dívidas e pendências"
    ],
    formato: "Por investigação"
  },
  {
    id: "blindagem-investidor",
    nome: "Blindagem do Investidor",
    descricao: "Blindagem para quando descobre uma fraude",
    icon: Shield,
    caracteristicas: [
      "Dossiê defensivo",
      "Proteção reputacional",
      "Documentação jurídica",
      "Estratégia de saída"
    ],
    formato: "Por projeto"
  },
  {
    id: "busca-verificacao-ex-socios",
    nome: "Busca e Verificação de Ex-Sócios",
    descricao: "Localização e verificação de co-founders desaparecidos",
    icon: Search,
    caracteristicas: [
      "Localização nacional",
      "Verificação de direitos",
      "Análise de risco de retorno",
      "Documentação de acordos"
    ],
    formato: "Por busca"
  },
  {
    id: "analise-trabalhista-founder",
    nome: "Análise Trabalhista do Founder",
    descricao: "Avalia padrão de processos anteriores que sinalizam má gestão",
    icon: FileSearch,
    caracteristicas: [
      "Histórico de processos",
      "Padrões de violação",
      "Casos de assédio",
      "Projeção de riscos"
    ],
    formato: "Por análise"
  },
  {
    id: "monitoramento-portfolio",
    nome: "Monitoramento do Portfolio",
    descricao: "Monitoramento mensal de todas as startups investidas",
    icon: TrendingUp,
    caracteristicas: [
      "Alertas automáticos",
      "Atualização de processos",
      "Mudanças societárias",
      "Riscos emergentes",
      "Dashboard online"
    ],
    formato: "Mensal"
  },
  {
    id: "plano-mensal-investidor",
    nome: "Plano Mensal do Investidor",
    descricao: "Pacote recorrente sob medida para investidores",
    icon: TrendingUp,
    caracteristicas: [
      "5 Red Flags mensais",
      "1 Deep Dive/mês",
      "Dashboard do portfolio",
      "Suporte prioritário"
    ],
    formato: "Mensal"
  }
];

export default function ServicosPage() {
  const [activeTab, setActiveTab] = useState("familiar");
  const [selectedService, setSelectedService] = useState<any>(null);

  const getServicesForTab = (tab: string) => {
    switch(tab) {
      case "familiar":
        return SERVICOS_FAMILIARES;
      case "empresarial":
        return SERVICOS_EMPRESARIAIS;
      case "investimentos":
        return SERVICOS_INVESTIMENTOS;
      default:
        return [];
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-7xl px-4">
            <div className="text-center space-y-6">
              <Badge variant="outline" className="text-primary-600 dark:text-primary-400">
                Serviços Especializados
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 dark:text-neutral-100">
                Proteção Completa em 3 Áreas
              </h1>
              <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
                Investigação profissional para proteger sua <strong>família</strong>, suas <strong>empresas</strong> e seus <strong>investimentos</strong>.
                Todos os valores sob consulta personalizada.
              </p>
            </div>
          </div>
        </section>

        {/* Services Tabs */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-auto p-1 bg-neutral-100 dark:bg-neutral-800">
                <TabsTrigger
                  value="familiar"
                  className="flex items-center gap-2 py-4 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900"
                >
                  <Home className="w-5 h-5" />
                  <span className="hidden md:inline">Proteção Familiar</span>
                  <span className="md:hidden">Familiar</span>
                </TabsTrigger>
                <TabsTrigger
                  value="empresarial"
                  className="flex items-center gap-2 py-4 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900"
                >
                  <Building2 className="w-5 h-5" />
                  <span className="hidden md:inline">Proteção Empresarial</span>
                  <span className="md:hidden">Empresarial</span>
                </TabsTrigger>
                <TabsTrigger
                  value="investimentos"
                  className="flex items-center gap-2 py-4 data-[state=active]:bg-white dark:data-[state=active]:bg-neutral-900"
                >
                  <TrendingUp className="w-5 h-5" />
                  <span className="hidden md:inline">Proteção de Investimentos</span>
                  <span className="md:hidden">Investimentos</span>
                </TabsTrigger>
              </TabsList>

              {["familiar", "empresarial", "investimentos"].map(tabValue => (
                <TabsContent key={tabValue} value={tabValue} className="space-y-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getServicesForTab(tabValue).map((service: any) => (
                      <Card
                        key={service.id}
                        className={`relative hover:shadow-xl transition-all cursor-pointer ${
                          service.destaque
                            ? "border-2 border-primary-500 shadow-lg"
                            : "border border-neutral-200 dark:border-neutral-800"
                        }`}
                        onClick={() => setSelectedService(service)}
                      >
                        {service.destaque && (
                          <Badge className="absolute -top-3 left-4 bg-primary-500 text-white">
                            Mais Procurado
                          </Badge>
                        )}
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                              <service.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg">{service.nome}</CardTitle>
                              <CardDescription className="mt-2">
                                {service.descricao}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <ul className="space-y-2">
                              {service.caracteristicas.slice(0, 3).map((item: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            {service.caracteristicas.length > 3 && (
                              <p className="text-xs text-neutral-500">
                                +{service.caracteristicas.length - 3} características
                              </p>
                            )}
                            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="text-xs">
                                  {service.formato}
                                </Badge>
                                <Button size="sm" variant="ghost">
                                  Ver mais <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-neutral-900 dark:to-neutral-950">
          <div className="container max-w-4xl px-4 text-center space-y-6">
            <h2 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              Todos os valores sob consulta
            </h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Cada situação é única. Entre em contato para uma proposta personalizada baseada nas suas necessidades específicas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-primary-600 hover:bg-primary-700">
                Solicitar Orçamento
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                <Phone className="mr-2 w-4 h-4" />
                Falar com Especialista
              </Button>
            </div>
            <div className="pt-6">
              <Badge variant="outline" className="text-sm py-2 px-4">
                <Info className="w-4 h-4 mr-2 inline" />
                Atendemos investidores com patrimônio acima de R$ 10M
              </Badge>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}