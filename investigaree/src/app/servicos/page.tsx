"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Image from "next/image";
import Link from "next/link";
import { useWhatsApp } from "@/components/WhatsAppLeadModal";
import {
  Home, Building2, TrendingUp, Shield, Users, Search,
  FileSearch, AlertCircle, Clock, Phone, CheckCircle2,
  ArrowRight, Info, X, MessageCircle, Target, Lock,
  Eye, Zap, FileText, UserCheck, ShieldCheck, AlertTriangle,
  Landmark, Heart, Vote, Scale
} from "lucide-react";

// Interface do serviço
interface Servico {
  id: string;
  nome: string;
  descricao: string;
  icon: any;
  destaque?: boolean;
  caracteristicas: string[];
  formato: string;
  idealPara?: string;
  preco?: string;
  precoExpress?: string;
  detalhes?: {
    oqueFazemos: string[];
    comoFunciona: string[];
    entregaveis: string[];
    prazo?: string;
    casos?: string[];
  };
}

// Dados dos serviços com detalhes expandidos
// Preços baseados em pesquisa de mercado Brasil 2024-2025 (fontes: Cronoshare, Detetives007, Business Screen)
const SERVICOS_FAMILIARES: Servico[] = [
  {
    id: "servico-placeholder",
    nome: "Serviço em Preparação",
    descricao: "Detalhes deste serviço serão adicionados em breve. Entre em contato para mais informações.",
    icon: Shield,
    caracteristicas: ["Conteúdo em preparação"],
    formato: "Sob consulta"
  }
];

const SERVICOS_EMPRESARIAIS: Servico[] = [
  {
    id: "servico-placeholder",
    nome: "Serviço em Preparação",
    descricao: "Detalhes deste serviço serão adicionados em breve. Entre em contato para mais informações.",
    icon: Shield,
    caracteristicas: ["Conteúdo em preparação"],
    formato: "Sob consulta"
  }
];

// Serviços para Setor Político
const SERVICOS_POLITICOS: Servico[] = [
  {
    id: "servico-placeholder",
    nome: "Serviço em Preparação",
    descricao: "Detalhes deste serviço serão adicionados em breve. Entre em contato para mais informações.",
    icon: Shield,
    caracteristicas: ["Conteúdo em preparação"],
    formato: "Sob consulta"
  }
];

// Serviços para Proteção em Divórcios
const SERVICOS_DIVORCIOS: Servico[] = [
  {
    id: "servico-placeholder",
    nome: "Serviço em Preparação",
    descricao: "Detalhes deste serviço serão adicionados em breve. Entre em contato para mais informações.",
    icon: Shield,
    caracteristicas: ["Conteúdo em preparação"],
    formato: "Sob consulta"
  }
];

const SERVICOS_INVESTIMENTOS: Servico[] = [
  {
    id: "servico-placeholder",
    nome: "Serviço em Preparação",
    descricao: "Detalhes deste serviço serão adicionados em breve. Entre em contato para mais informações.",
    icon: Shield,
    caracteristicas: ["Conteúdo em preparação"],
    formato: "Sob consulta"
  }
];

// Componente do Modal de Serviço
function ServiceModal({ service, isOpen, onClose }: { service: Servico | null; isOpen: boolean; onClose: () => void }) {
  const { openWhatsAppModal } = useWhatsApp();

  if (!service) return null;

  const handleWhatsAppClick = () => {
    openWhatsAppModal(
      `Olá! Tenho interesse no serviço "${service.nome}". Gostaria de mais informações.`,
      `servico-${service.id}`
    );
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <service.icon className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{service.nome}</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                {service.descricao}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Placeholder para conteúdo real */}
          <div className="bg-slate-50 dark:bg-navy-900 rounded-xl p-8 text-center">
            <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Conteúdo em Preparação
            </h3>
            <p className="text-slate-600 dark:text-navy-300 mb-6">
              Os detalhes completos deste serviço serão adicionados em breve.
              <br />Entre em contato para mais informações.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Solicitar Informações
              </Button>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ServicosContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("empresarial");
  const [selectedService, setSelectedService] = useState<Servico | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["familiar", "empresarial", "investimentos", "divorcios"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const getServicesForTab = (tab: string): Servico[] => {
    switch(tab) {
      case "familiar":
        return SERVICOS_FAMILIARES;
      case "empresarial":
        return SERVICOS_EMPRESARIAIS;
      case "investimentos":
        return SERVICOS_INVESTIMENTOS;
      case "politicos":
        return SERVICOS_POLITICOS;
      case "divorcios":
        return SERVICOS_DIVORCIOS;
      default:
        return [];
    }
  };

  const handleServiceClick = (service: Servico) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-20">
        {/* Hero Section - Compacto (UX: Padrão F) */}
        <section className="pt-6 pb-6 bg-gradient-to-br from-navy-50 to-navy-100 dark:from-navy-900 dark:to-navy-950">
          <div className="container max-w-6xl px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Lado esquerdo - Padrão F */}
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Search className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
                    Servicos de <span className="text-blue-500">Investigacao</span>
                  </h1>
                  <p className="text-sm text-navy-600 dark:text-slate-600 dark:text-navy-300">
                    +100 mil registros por investigacao
                  </p>
                </div>
              </div>
              {/* Lado direito - Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white text-xs">Automacao</Badge>
                <Badge className="bg-blue-500 text-navy-900 text-xs">50+ Bases</Badge>
                <Badge className="bg-success text-slate-900 dark:text-white text-xs">LGPD</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Diferencial Section */}
        <section className="py-12 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-navy-800 dark:to-navy-900">
          <div className="container max-w-6xl px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-slate-900 dark:text-white space-y-4">
                <h2 className="text-2xl font-bold">Tecnologia + Pericia Forense</h2>
                <p className="text-slate-700 dark:text-navy-200">
                  Combinacao unica no Brasil: <strong className="text-blue-400">Analista de Dados</strong> especialista em automacao +
                  <strong className="text-blue-400"> Perito Criminal Oficial</strong> (1o lugar PCE-PA 2019) no Advisory Board.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Automacao</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">50+ Bases</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">OSINT</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Validade Judicial</Badge>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <Link href="/quemsomos/dani-kaloi" className="text-center group cursor-pointer">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-blue-500/50 group-hover:border-blue-400 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/50">
                    <Image
                      src="/dani-kaloi.png"
                      alt="Dani Kaloi"
                      fill
                      className="object-cover group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <p className="text-slate-900 dark:text-white font-semibold group-hover:text-blue-400 transition-colors">Dani Kaloi</p>
                  <p className="text-blue-400 text-sm">Analista de Dados</p>
                </Link>
                <Link href="/quemsomos/ibsen-maciel" className="text-center group cursor-pointer">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-blue-500/50 group-hover:border-blue-400 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/50">
                    <Image
                      src="/images/ibsen-maciel.jpg"
                      alt="Ibsen Maciel"
                      fill
                      className="object-cover group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                    />
                  </div>
                  <p className="text-slate-900 dark:text-white font-semibold group-hover:text-blue-400 transition-colors">Ibsen Maciel</p>
                  <p className="text-blue-400 text-sm">Perito Criminal</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Tabs */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-6xl mx-auto grid-cols-2 md:grid-cols-4 h-auto p-2 bg-navy-100 dark:bg-navy-900 gap-2">
                <TabsTrigger
                  value="familiar"
                  className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 md:py-5 px-4 text-sm md:text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-navy-950 data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-slate-100 dark:bg-navy-800 data-[state=inactive]:text-navy-700 dark:data-[state=inactive]:text-slate-600 dark:text-navy-300 hover:bg-blue-500 hover:text-navy-950 transition-all"
                >
                  <Home className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Proteção Familiar</span>
                </TabsTrigger>
                <TabsTrigger
                  value="empresarial"
                  className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 md:py-5 px-4 text-sm md:text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-navy-950 data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-slate-100 dark:bg-navy-800 data-[state=inactive]:text-navy-700 dark:data-[state=inactive]:text-slate-600 dark:text-navy-300 hover:bg-blue-500 hover:text-navy-950 transition-all"
                >
                  <Building2 className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Proteção Empresarial</span>
                </TabsTrigger>
                <TabsTrigger
                  value="investimentos"
                  className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 md:py-5 px-4 text-sm md:text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-navy-950 data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-slate-100 dark:bg-navy-800 data-[state=inactive]:text-navy-700 dark:data-[state=inactive]:text-slate-600 dark:text-navy-300 hover:bg-blue-500 hover:text-navy-950 transition-all"
                >
                  <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Investimentos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="divorcios"
                  className="flex flex-col md:flex-row items-center justify-center gap-2 py-4 md:py-5 px-4 text-sm md:text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-navy-950 data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-slate-100 dark:bg-navy-800 data-[state=inactive]:text-navy-700 dark:data-[state=inactive]:text-slate-600 dark:text-navy-300 hover:bg-blue-500 hover:text-navy-950 transition-all"
                >
                  <Scale className="w-5 h-5 md:w-6 md:h-6" />
                  <span>Divórcios</span>
                </TabsTrigger>
              </TabsList>

              {["familiar", "empresarial", "investimentos", "divorcios"].map(tabValue => (
                <TabsContent key={tabValue} value={tabValue} className="space-y-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getServicesForTab(tabValue).map((service) => (
                      <Card
                        key={service.id}
                        className={`relative hover:shadow-xl transition-all cursor-pointer group ${
                          service.destaque
                            ? "border-2 border-primary-500 shadow-lg"
                            : "border border-neutral-200 dark:border-neutral-800"
                        }`}
                        onClick={() => handleServiceClick(service)}
                      >
                        {service.destaque && (
                          <Badge className="absolute -top-3 left-4 bg-primary-500 text-slate-900 dark:text-white">
                            Mais Procurado
                          </Badge>
                        )}
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/30 transition-colors">
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
                              {service.caracteristicas.slice(0, 3).map((item, idx) => (
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
                                <Button size="sm" variant="ghost" className="group-hover:bg-primary-100 dark:group-hover:bg-primary-900/20">
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
        <section className="py-20 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-navy-800 dark:via-navy-900 dark:to-navy-950">
          <div className="container max-w-4xl px-4 text-center space-y-6">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
              Precisa investigar grandes volumes?
            </h2>
            <p className="text-lg text-slate-700 dark:text-navy-200">
              Folhas de pagamento, funcionarios, fornecedores, socios...
              <br />Processamos qualquer volume com precisao e velocidade.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pb-4">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Empresas</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Familias</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Mulheres em Divorcio</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Investidores</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-blue-500 text-navy-900 hover:bg-blue-600 hover:text-white font-semibold transition-all duration-200">
                Solicitar Orcamento
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200">
                <Phone className="mr-2 w-4 h-4" />
                Falar com Especialista
              </Button>
            </div>

            {/* Team Badge */}
            <div className="pt-8 flex items-center justify-center gap-6">
              <Link href="/quemsomos/dani-kaloi" className="text-center group cursor-pointer">
                <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 border-2 border-blue-500/50 group-hover:border-blue-400 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/50">
                  <Image
                    src="/dani-kaloi.png"
                    alt="Dani Kaloi"
                    fill
                    className="object-cover group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <p className="text-slate-900 dark:text-white text-sm font-semibold group-hover:text-blue-400 transition-colors">Dani Kaloi</p>
                <p className="text-blue-400 text-xs">Analista de Dados</p>
              </Link>
              <Link href="/quemsomos/ibsen-maciel" className="text-center group cursor-pointer">
                <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 border-2 border-blue-500/50 group-hover:border-blue-400 transition-all group-hover:shadow-lg group-hover:shadow-blue-500/50">
                  <Image
                    src="/images/ibsen-maciel.jpg"
                    alt="Ibsen Maciel"
                    fill
                    className="object-cover group-hover:brightness-110 group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <p className="text-slate-900 dark:text-white text-sm font-semibold group-hover:text-blue-400 transition-colors">Ibsen Maciel</p>
                <p className="text-blue-400 text-xs">Perito Criminal</p>
              </Link>
            </div>
          </div>
        </section>

        {/* Modal */}
        <ServiceModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
    </main>
  );
}

export default function ServicosPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
        </main>
      }>
        <ServicosContent />
      </Suspense>
      <Footer />
    </>
  );
}
