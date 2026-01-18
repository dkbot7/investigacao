"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import Link from "next/link";
import { useWhatsApp } from "@/components/WhatsAppLeadModal";
import {
  Shield, Search, ShieldCheck, Trash2, Eye, Globe,
  Lock, UserX, MapPin, Link as LinkIcon, FileSearch,
  Database, TrendingUp, Scale, Bell, Video, Zap,
  BarChart3, FileCheck, Smartphone, Award, Users,
  Briefcase, CheckCircle2, ArrowRight, MessageCircle,
  Phone, Brain, Target, AlertTriangle, Clock, Star,
  TrendingDown, Flame, CheckCircle, Timer, UserCheck,
  Building2, ThumbsUp, XCircle, Sparkles, Building,
  ClipboardCheck, Home, Heart, FileText, Settings
} from "lucide-react";

// Interface do serviço
interface Servico {
  id: string;
  nome: string;
  descricao: string;
  icon: any;
  destaque?: boolean;
  caracteristicas: string[];
  preco?: string;
  prazo?: string;
  idealPara?: string;
  badge?: string;
  badgeColor?: string;
  beneficioEmocional?: string;
  riscoDeNaoContratar?: string;
  casoDeUso?: string;
  garantia?: string;
  categoria?: "protecao" | "pericia" | "personalizado";
}

// SERVIÇOS ORGANIZADOS POR SEGMENTO

// B2C - PARA VOCÊ (Pessoa Física)
const SERVICOS_B2C: Servico[] = [
  // REMOÇÃO - 3 NÍVEIS (CONSOLIDADOS)
  {
    id: "remocao-emergencial",
    nome: "Remoção Emergencial",
    descricao: "Remoção imediata de fotos íntimas e conteúdo sensível em 24-72h",
    icon: Trash2,
    destaque: true,
    caracteristicas: [
      "Atendimento emergencial 24-72h",
      "Fotos íntimas e conteúdo sensível",
      "Solicitação baseada na LGPD",
      "Orientação jurídica incluída",
      "Acompanhamento do processo",
      "Contenção rápida da circulação"
    ],
    preco: "A partir de R$ 800",
    prazo: "24-72h",
    idealPara: "Vítimas de vazamento ou exposição",
    badge: "EMERGENCIAL 24H",
    badgeColor: "red",
    categoria: "protecao"
  },
  {
    id: "remocao-direcionada",
    nome: "Remoção Direcionada",
    descricao: "Remoção de conteúdos em Google, Jusbrasil, redes sociais e links específicos",
    icon: Globe,
    destaque: true,
    caracteristicas: [
      "Desindexação Google (processos antigos)",
      "Remoção Jusbrasil e Escavador",
      "Redes sociais (Facebook, Instagram, Twitter)",
      "Links ofensivos e fotos não autorizadas",
      "Fundamentação LGPD completa",
      "Relatório de progresso",
      "Proteção de CPF e dados pessoais"
    ],
    preco: "A partir de R$ 1.500",
    prazo: "15-30 dias",
    idealPara: "Proteção de reputação e privacidade",
    badge: "MAIS POPULAR",
    badgeColor: "blue",
    categoria: "protecao"
  },
  {
    id: "varredura-completa",
    nome: "Varredura Reputacional Completa",
    descricao: "Análise reputacional 360° + remoção em massa + monitoramento contínuo",
    icon: Search,
    destaque: true,
    caracteristicas: [
      "Varredura completa reputacional",
      "Análise em 100+ fontes públicas",
      "Estratégia de contenção customizada",
      "Remoção em massa coordenada",
      "Plano de recuperação de imagem",
      "Monitoramento contínuo (90 dias)",
      "Relatório executivo completo"
    ],
    preco: "A partir de R$ 3.500",
    prazo: "30-45 dias",
    idealPara: "Crises graves de reputação",
    badge: "PACOTE PREMIUM",
    badgeColor: "purple",
    categoria: "protecao"
  },
  // INVESTIGAÇÃO FORENSE
  {
    id: "investigacao-profissional-profissional",
    nome: "Investigação Profissional Profissional",
    descricao: "Relatório profissional com metodologia profissional validada",
    icon: ShieldCheck,
    destaque: true,
    caracteristicas: [
      "Metodologia profissional profissional",
      "Relatório técnico especializado",
      "Cadeia de custódia garantida",
      "Fontes públicas (OSINT)",
      "Validade judicial",
      "Conformidade total com LGPD"
    ],
    preco: "Sob consulta",
    prazo: "10-15 dias",
    idealPara: "Processos judiciais e defesas",
    badge: "FORENSE PROFISSIONAL",
    badgeColor: "gold",
    categoria: "pericia"
  },
  {
    id: "extracao-profissional-dispositivos",
    nome: "Análise Profissional de Dispositivos",
    descricao: "Análise profissional com Avilla Forensics e indexação com IPED para dispositivo próprio",
    icon: Smartphone,
    caracteristicas: [
      "Análise com Avilla Forensics",
      "Indexação e análise com IPED",
      "Recuperação de dados deletados",
      "Cadeia de custódia oficial",
      "Validação técnica profissional",
      "Relatório técnico completo"
    ],
    preco: "Sob consulta",
    prazo: "7-10 dias",
    idealPara: "Provas de fraude e processos",
    badge: "FORENSE",
    badgeColor: "gold",
    categoria: "pericia"
  },
  {
    id: "cadeia-custodia-certificada",
    nome: "Guardar Provas Digitais",
    descricao: "Preservação legal de evidências com cadeia de custódia certificada",
    icon: Lock,
    caracteristicas: [
      "Coleta profissional de evidências",
      "Preservação com integridade",
      "Validação técnica especializada",
      "Documentação completa",
      "Validade judicial garantida"
    ],
    preco: "Sob consulta",
    prazo: "5-7 dias",
    idealPara: "Provas críticas para processos",
    categoria: "pericia"
  },
  // SEGURANÇA
  {
    id: "seguranca-residencial",
    nome: "Segurança Residencial",
    descricao: "Câmeras Full HD 360° com monitoramento 24h e instalação profissional",
    icon: Video,
    caracteristicas: [
      "Câmera Full HD 1080p visão 360°",
      "Auto Tracking de movimento",
      "Notificações instantâneas",
      "Visão noturna até 10m",
      "Áudio bidirecional",
      "Instalação profissional inclusa"
    ],
    preco: "A partir de R$ 1.500",
    prazo: "48-72h",
    idealPara: "Residências e pequenos comércios",
    badge: "INSTALAÇÃO INCLUSA",
    badgeColor: "blue",
    categoria: "protecao"
  },
];

// B2B - PARA EMPRESAS (Background Check & Due Diligence)
const SERVICOS_B2B: Servico[] = [
  {
    id: "background-check-pessoas",
    nome: "Background Check de Pessoas",
    descricao: "Verificação completa de CPF, antecedentes e sanções em fontes oficiais",
    icon: UserCheck,
    destaque: true,
    caracteristicas: [
      "Validação de CPF e dados pessoais",
      "Antecedentes criminais em 27 tribunais",
      "Sanções CEIS, CNEP e OFAC",
      "Processos trabalhistas e cíveis",
      "Vínculos empregatícios (CNIS/INSS)",
      "Relatório com validade judicial"
    ],
    preco: "A partir de R$ 500",
    prazo: "24-48h",
    idealPara: "RH e Compliance",
    badge: "MAIS CONTRATADO",
    badgeColor: "blue",
    categoria: "personalizado"
  },
  {
    id: "background-check-empresas",
    nome: "Background Check de Empresas",
    descricao: "Due diligence completa de CNPJ, sócios e situação fiscal",
    icon: Building,
    caracteristicas: [
      "Situação cadastral CNPJ",
      "Quadro societário completo",
      "Sanções CEIS e CNEP",
      "Processos judiciais da empresa",
      "Débitos fiscais e trabalhistas",
      "Certidões negativas"
    ],
    preco: "A partir de R$ 1.500",
    prazo: "48-72h",
    idealPara: "Investidores e compradores",
    badge: "EMPRESAS",
    badgeColor: "green",
    categoria: "personalizado"
  },
  {
    id: "due-diligence-completa",
    nome: "Due Diligence M&A Completa",
    descricao: "Análise profunda em 12 camadas para fusões e aquisições",
    icon: TrendingUp,
    destaque: true,
    caracteristicas: [
      "Análise CNPJ em 12 camadas",
      "Background de todos os sócios",
      "Passivos trabalhistas ocultos",
      "Processos judiciais pendentes",
      "Red flags e risco empresarial",
      "Análise de competitividade",
      "Relatório executivo completo"
    ],
    preco: "Sob consulta",
    prazo: "7-15 dias",
    idealPara: "M&A e investimentos",
    badge: "PREMIUM",
    badgeColor: "purple",
    categoria: "personalizado"
  },
  {
    id: "auditoria-licitacoes",
    nome: "Auditoria de Licitações",
    descricao: "Compliance TCU/CGU para licitações governamentais",
    icon: ClipboardCheck,
    caracteristicas: [
      "Auditoria em 12 camadas",
      "Verificação CEIS/CNEP",
      "Detecção de cartel",
      "Análise de superfaturamento",
      "Verificação técnica",
      "Relatório TCU/CGU"
    ],
    preco: "A partir de R$ 3.000",
    prazo: "3-5 dias",
    idealPara: "Auditores e governo",
    badge: "GOVERNO",
    badgeColor: "orange",
    categoria: "personalizado"
  }
];

// LEGAL - PARA ADVOGADOS (Perícia Profissional)
const SERVICOS_LEGAL: Servico[] = [
  {
    id: "investigacao-profissional-profissional-legal",
    nome: "Investigação Profissional Profissional",
    descricao: "Relatório profissional com metodologia profissional validada",
    icon: ShieldCheck,
    destaque: true,
    caracteristicas: [
      "Metodologia profissional profissional",
      "Relatório técnico especializado",
      "Cadeia de custódia garantida",
      "Fontes públicas (OSINT)",
      "Validade judicial",
      "Conformidade total com LGPD"
    ],
    preco: "Sob consulta",
    prazo: "10-15 dias",
    idealPara: "Processos judiciais e defesas",
    badge: "FORENSE PROFISSIONAL",
    badgeColor: "gold",
    categoria: "pericia"
  },
  {
    id: "extracao-profissional-dispositivos-legal",
    nome: "Análise Profissional de Dispositivos",
    descricao: "Análise profissional com Avilla Forensics e indexação com IPED",
    icon: Smartphone,
    caracteristicas: [
      "Análise com Avilla Forensics",
      "Indexação e análise com IPED",
      "Recuperação de dados deletados",
      "Cadeia de custódia oficial",
      "Validação técnica profissional",
      "Relatório técnico completo"
    ],
    preco: "Sob consulta",
    prazo: "7-10 dias",
    idealPara: "Provas de fraude e processos",
    badge: "FORENSE",
    badgeColor: "gold",
    categoria: "pericia"
  },
  {
    id: "coleta-provas-digitais",
    nome: "Coleta e Preservação de Provas",
    descricao: "Preservação legal de evidências com cadeia de custódia certificada",
    icon: Lock,
    caracteristicas: [
      "Coleta profissional de evidências",
      "Preservação com integridade",
      "Validação técnica especializada",
      "Documentação completa",
      "Validade judicial garantida"
    ],
    preco: "Sob consulta",
    prazo: "5-7 dias",
    idealPara: "Provas críticas para processos",
    categoria: "pericia"
  },
  {
    id: "investigacao-patrimonial-legal",
    nome: "Investigação Patrimonial",
    descricao: "Rastreamento de patrimônio para divórcios e execuções",
    icon: Home,
    caracteristicas: [
      "Levantamento de imóveis",
      "Veículos registrados",
      "Participações societárias",
      "Análise de incompatibilidade",
      "Rastreamento de criptomoedas"
    ],
    preco: "A partir de R$ 2.500",
    prazo: "7-10 dias",
    idealPara: "Divórcios e execuções judiciais",
    badge: "PATRIMÔNIO",
    badgeColor: "pink",
    categoria: "pericia"
  }
];

// Todos os serviços combinados
const TODOS_SERVICOS = [...SERVICOS_B2B, ...SERVICOS_B2C, ...SERVICOS_LEGAL];

// Componente do Modal (mesmo código anterior)
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-navy-900">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-500/10 rounded-xl">
              <service.icon className="w-8 h-8 text-green-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl text-slate-900 dark:text-white">{service.nome}</DialogTitle>
              <p className="text-slate-600 dark:text-navy-300 mt-2">{service.descricao}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Risco de NÃO Contratar */}
          {service.riscoDeNaoContratar && (
            <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border-2 border-orange-200 dark:border-orange-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-1">⚠️ Atenção:</h4>
                  <p className="text-orange-800 dark:text-orange-200">{service.riscoDeNaoContratar}</p>
                </div>
              </div>
            </div>
          )}

          {/* Caso de Uso */}
          {service.casoDeUso && (
            <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl">
              <div className="flex items-start gap-3">
                <Star className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Caso Real:</h4>
                  <p className="text-slate-700 dark:text-navy-200 italic">"{service.casoDeUso}"</p>
                </div>
              </div>
            </div>
          )}

          {/* Características */}
          <div>
            <h4 className="font-semibold text-lg mb-3 text-slate-900 dark:text-white">O que está incluído:</h4>
            <ul className="space-y-2">
              {service.caracteristicas.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-navy-200">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Garantia */}
          {service.garantia && (
            <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">✅ Garantia:</h4>
                  <p className="text-green-800 dark:text-green-200">{service.garantia}</p>
                </div>
              </div>
            </div>
          )}

          {/* Detalhes */}
          <div className="grid md:grid-cols-3 gap-4">
            {service.preco && (
              <div className="p-4 bg-green-50 dark:bg-navy-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-navy-400 mb-1">Investimento</p>
                <p className="text-xl font-bold text-green-500">{service.preco}</p>
              </div>
            )}
            {service.prazo && (
              <div className="p-4 bg-green-50 dark:bg-navy-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-navy-400 mb-1">Prazo</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{service.prazo}</p>
              </div>
            )}
            {service.idealPara && (
              <div className="p-4 bg-green-50 dark:bg-navy-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-navy-400 mb-1">Ideal para</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{service.idealPara}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="space-y-4 pt-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-slate-600 dark:text-navy-400">
                ✅ Resposta garantida em 24h • 🔒 100% confidencial
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={handleWhatsAppClick}
                className="bg-green-600 hover:bg-green-700 text-white h-14 px-10 text-base font-semibold shadow-lg shadow-green-600/30"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar com Especialista Agora
              </Button>
              <Button variant="outline" onClick={onClose} size="lg" className="h-14">
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ServicosContent() {
  const [selectedService, setSelectedService] = useState<Servico | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service: Servico) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const getBadgeColor = (color?: string) => {
    const colors = {
      blue: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
      red: "bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30",
      purple: "bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30",
      gold: "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30",
      cyan: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
      green: "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <main className="min-h-screen bg-white dark:bg-navy-950 pt-20">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-100 dark:from-navy-900 dark:via-navy-900 dark:to-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="container max-w-6xl px-4 relative z-10">
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-slate-700 dark:text-navy-200 text-center">
              <strong className="text-green-600 dark:text-green-400">✅ Conformidade LGPD:</strong> Investigações com fontes públicas (OSINT) ou dados consensualmente fornecidos. Base legal: interesse legítimo, exercício de direito ou cumprimento de obrigação legal.
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 text-center leading-tight">
            Serviços de Investigação Digital com<br />
            <span className="text-green-500">Metodologia Profissional</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-navy-300 max-w-3xl mx-auto mb-8 text-center">
            Escolha o serviço ideal para sua necessidade. <strong className="text-green-500">Background check</strong>,
            <strong className="text-slate-900 dark:text-white"> proteção de privacidade</strong> ou
            <strong className="text-purple-600"> perícia profissional</strong>.
          </p>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 text-sm px-4 py-2">
              📊 Background Check & Due Diligence
            </Badge>
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 text-sm px-4 py-2">
              🔐 Proteção & Privacidade
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 text-sm px-4 py-2">
              ⚖️ Perícia Profissional
            </Badge>
          </div>
        </div>
      </section>

      {/* BACKGROUND CHECK & DUE DILIGENCE - B2B */}
      <section className="py-16 bg-white dark:bg-navy-950">
        <div className="container max-w-7xl px-4">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-500/30 mb-4 px-6 py-2 text-base font-bold">
              📊 BACKGROUND CHECK & DUE DILIGENCE
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Para Empresas, RH e Investidores
            </h2>
            <p className="text-lg text-slate-600 dark:text-navy-300 max-w-3xl mx-auto">
              Verificação profissional antes de contratar, investir ou fazer negócio
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
            {SERVICOS_B2B.map((servico) => (
              <Card
                key={servico.id}
                onClick={() => handleServiceClick(servico)}
                className="group cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 hover:border-blue-500 dark:hover:border-blue-500 relative overflow-hidden"
              >
                {servico.badge && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className={`${getBadgeColor(servico.badgeColor)} text-xs font-bold px-2 py-1`}>
                      {servico.badge}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-xl transition-all group-hover:scale-110 bg-cyan-50 dark:bg-cyan-900/20">
                      <servico.icon className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 line-clamp-2">
                        {servico.nome}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-navy-300 line-clamp-2">
                        {servico.descricao}
                      </p>
                    </div>

                    {servico.prazo && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-navy-400">
                        <Clock className="w-4 h-4" />
                        <span>{servico.prazo}</span>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:shadow-lg transition-all"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PROTEÇÃO & PRIVACIDADE - B2C */}
          <div className="text-center mb-12 pt-8 border-t-2 border-slate-200 dark:border-navy-800">
            <Badge className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-500/30 mb-4 px-6 py-2 text-base font-bold">
              🔐 PROTEÇÃO & PRIVACIDADE
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Para Você e Sua Família
            </h2>
            <p className="text-lg text-slate-600 dark:text-navy-300 max-w-3xl mx-auto">
              Remoção de conteúdo, proteção reputacional e segurança digital
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6 mb-16">
            {SERVICOS_B2C.map((servico) => (
              <Card
                key={servico.id}
                onClick={() => handleServiceClick(servico)}
                className="group cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 hover:border-red-500 dark:hover:border-red-500 relative overflow-hidden"
              >
                {servico.badge && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className={`${getBadgeColor(servico.badgeColor)} text-xs font-bold px-2 py-1`}>
                      {servico.badge}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-xl transition-all group-hover:scale-110 bg-green-50 dark:bg-green-900/20">
                      <servico.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 line-clamp-2">
                        {servico.nome}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-navy-300 line-clamp-2">
                        {servico.descricao}
                      </p>
                    </div>

                    {servico.prazo && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-navy-400">
                        <Clock className="w-4 h-4" />
                        <span>{servico.prazo}</span>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 text-white group-hover:shadow-lg transition-all"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* PERÍCIA FORENSE - LEGAL */}
          <div className="text-center mb-12 pt-8 border-t-2 border-slate-200 dark:border-navy-800">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-500/30 mb-4 px-6 py-2 text-base font-bold">
              ⚖️ PERÍCIA FORENSE
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Para Advogados e Processos Judiciais
            </h2>
            <p className="text-lg text-slate-600 dark:text-navy-300 max-w-3xl mx-auto">
              Provas digitais com cadeia de custódia e validade judicial
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
            {SERVICOS_LEGAL.map((servico) => (
              <Card
                key={servico.id}
                onClick={() => handleServiceClick(servico)}
                className="group cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 hover:border-purple-500 dark:hover:border-purple-500 relative overflow-hidden"
              >
                {servico.badge && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge className={`${getBadgeColor(servico.badgeColor)} text-xs font-bold px-2 py-1`}>
                      {servico.badge}
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-xl transition-all group-hover:scale-110 bg-amber-50 dark:bg-amber-900/20">
                      <servico.icon className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 line-clamp-2">
                        {servico.nome}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-navy-300 line-clamp-2">
                        {servico.descricao}
                      </p>
                    </div>

                    {servico.prazo && (
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-navy-400">
                        <Clock className="w-4 h-4" />
                        <span>{servico.prazo}</span>
                      </div>
                    )}

                    <Button
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white group-hover:shadow-lg transition-all"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA após os cards */}
          <div className="mt-12 text-center">
            <p className="text-slate-600 dark:text-navy-300 mb-6">
              Ainda tem dúvidas? Fale direto com um especialista
            </p>
            <a href="https://wa.me/5547992602673?text=Olá!%20Gostaria%20de%20conhecer%20melhor%20os%20serviços" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white h-14 px-10 shadow-lg font-bold">
                <MessageCircle className="w-5 h-5 mr-2" />
                💬 Falar com Especialista (24h)
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Prova Social */}
      <section className="py-6 bg-slate-50 dark:bg-navy-900 border-y border-slate-200 dark:border-navy-800">
        <div className="container max-w-6xl px-4">
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30 font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
              🔥 Resposta em 24h
            </Badge>
            <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
              ✅ Metodologia Profissional
            </Badge>
            <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
              🚀 5.950 auditados
            </Badge>
            <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30 font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
              ⭐ 4.9/5 estrelas
            </Badge>
          </div>
        </div>
      </section>

      {/* Destaque STF 2025 - Remoção */}
      <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-red-950 dark:to-slate-900">
        <div className="container max-w-6xl px-4">
          <Card className="border-2 border-amber-500 shadow-2xl bg-white dark:bg-slate-900">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <Badge className="bg-amber-500 text-slate-900 font-bold px-4 py-2 animate-pulse">
                    🔥 DECISÃO STF 2025
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                    Remoção Profissional de Conteúdos
                  </h2>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    Remova processos antigos, notícias negativas e conteúdos prejudiciais do Google, Jusbrasil e redes sociais.
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">85%</div>
                      <div className="text-xs text-slate-600">Sucesso</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200">
                      <div className="text-2xl font-bold text-green-600">24-48h</div>
                      <div className="text-xs text-slate-600">Urgente</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200">
                      <div className="text-2xl font-bold text-purple-600">70%</div>
                      <div className="text-xs text-slate-600">- processos</div>
                    </div>
                  </div>

                  <Link href="/solucoes/protecao-remocao">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-semibold shadow-lg">
                      <Shield className="w-5 h-5 mr-2" />
                      Ver Detalhes Completos
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>

                <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-500/20">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-center">
                    Plataformas Atendidas
                  </h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Google', time: '2-5 dias' },
                      { name: 'Jusbrasil', time: '2-5 dias' },
                      { name: 'Escavador', time: '2-5 dias' },
                      { name: 'Redes Sociais', time: '24-48h' },
                    ].map((platform, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{platform.name}</span>
                        <Badge variant="outline" className="text-xs">{platform.time}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-navy-800 dark:to-navy-950">
        <div className="container max-w-4xl px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            🚀 Comece Sua Investigação Hoje
          </h2>
          <p className="text-lg text-slate-700 dark:text-navy-200">
            <strong className="text-green-500">5.950 investigações realizadas</strong> • Resposta em 24h<br />
            Empresas, Famílias, Advogados e Investidores confiam em nós
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href="https://wa.me/5547992602673?text=Olá!%20Preciso%20de%20uma%20investigação%20urgente" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white h-14 px-10 font-bold shadow-lg">
                <MessageCircle className="mr-2 w-5 h-5" />
                💬 WhatsApp Direto (24h)
              </Button>
            </a>
            <Link href="/contato">
              <Button size="lg" variant="outline" className="h-14 px-10 font-semibold">
                Orçamento Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500 dark:text-navy-400">
            🔒 Protegidos pela LGPD • 🛡️ Sigilo absoluto
          </p>
        </div>
      </section>

      {/* Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Sticky CTA Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-navy-900 border-t-2 border-green-500 shadow-2xl">
        <div className="container px-4 py-3">
          <a href="https://wa.me/5547992602673?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista" target="_blank" rel="noopener noreferrer">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-14">
              <MessageCircle className="w-6 h-6 mr-2" />
              💬 Falar Agora
            </Button>
          </a>
        </div>
      </div>
    </main>
  );
}

export default function ServicosPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <main className="min-h-screen bg-white dark:bg-navy-950 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
        </main>
      }>
        <ServicosContent />
      </Suspense>
      <Footer />
    </>
  );
}

