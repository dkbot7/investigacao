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

// TODOS OS SERVIÇOS COMBINADOS
const TODOS_SERVICOS: Servico[] = [
  // PROTEÇÃO & REMOÇÃO (11 serviços)
  {
    id: "seguranca-residencial",
    nome: "Segurança Residencial",
    descricao: "Câmeras Full HD 360° com monitoramento 24h e instalação profissional",
    icon: Video,
    destaque: true,
    caracteristicas: [
      "Câmera Full HD 1080p visão 360°",
      "Auto Tracking de movimento",
      "Notificações instantâneas",
      "Visão noturna até 10m",
      "Áudio bidirecional",
      "Instalação profissional inclusa"
    ],
    preco: "Sob consulta",
    prazo: "48-72h",
    idealPara: "Residências e empresas",
    badge: "INSTALAÇÃO INCLUSA",
    badgeColor: "blue",
    categoria: "protecao"
  },
  {
    id: "apaga-meu-ex",
    nome: "Apagar Fotos Íntimas",
    descricao: "Remoção emergencial de conteúdo íntimo compartilhado sem consentimento",
    icon: Trash2,
    destaque: true,
    caracteristicas: [
      "Atendimento emergencial prioritário",
      "Solicitação baseada na LGPD",
      "Acompanhamento do processo",
      "Orientação jurídica incluída"
    ],
    preco: "Sob consulta",
    prazo: "Imediato",
    idealPara: "Vítimas de vazamento",
    badge: "EMERGENCIAL",
    badgeColor: "red",
    categoria: "protecao"
  },
  {
    id: "cpf-blindado",
    nome: "Tirar CPF da Internet",
    descricao: "Remoção de dados pessoais de 47 sites comerciais conforme LGPD",
    icon: Shield,
    caracteristicas: [
      "Solicitação em 47 sites catalogados",
      "Proteção contra exposição indevida",
      "Relatório de progresso",
      "Conformidade LGPD total"
    ],
    preco: "Sob consulta",
    prazo: "30 dias",
    idealPara: "Proteção de privacidade",
    categoria: "protecao"
  },
  {
    id: "espiao-exposto",
    nome: "Denunciar Perfil Falso",
    descricao: "Identificação e denúncia de perfis falsos usados para perseguição",
    icon: UserX,
    caracteristicas: [
      "Análise técnica do perfil",
      "Coleta de evidências públicas",
      "Denúncia em massa",
      "Relatório jurídico"
    ],
    preco: "Sob consulta",
    prazo: "5-7 dias",
    idealPara: "Vítimas de perseguição",
    categoria: "protecao"
  },
  {
    id: "google-limpo",
    nome: "Tirar Nome do Google",
    descricao: "Desindexação de processos antigos e conteúdos negativos do Google",
    icon: Globe,
    caracteristicas: [
      "Listagem de links ofensivos",
      "Solicitação via Google oficial",
      "Fundamentação LGPD",
      "Proteção reputacional"
    ],
    preco: "Sob consulta",
    prazo: "15-30 dias",
    idealPara: "Proteção de reputação",
    categoria: "protecao"
  },
  {
    id: "foto-sumida",
    nome: "Apagar Minhas Fotos",
    descricao: "Remoção de fotos pessoais publicadas sem autorização",
    icon: Eye,
    caracteristicas: [
      "Denúncia por violação de imagem",
      "Acompanhamento das solicitações",
      "Retomada do controle de imagem"
    ],
    preco: "Sob consulta",
    prazo: "7-10 dias",
    idealPara: "Exposição não autorizada",
    categoria: "protecao"
  },
  {
    id: "endereco-off",
    nome: "Esconder Meu Endereço",
    descricao: "Remoção de endereço residencial de sites públicos",
    icon: MapPin,
    caracteristicas: [
      "Localização do endereço online",
      "Solicitação LGPD",
      "Proteção contra perseguição"
    ],
    preco: "Sob consulta",
    prazo: "15 dias",
    idealPara: "Separações conturbadas",
    categoria: "protecao"
  },
  {
    id: "perfil-cacado",
    nome: "Achar Perfil Falso",
    descricao: "Rastreamento de perfis falsos com evidências públicas",
    icon: Target,
    caracteristicas: [
      "Análise de dados públicos",
      "Registro de evidências",
      "Denúncia formal",
      "Relatório investigativo"
    ],
    preco: "Sob consulta",
    prazo: "7 dias",
    idealPara: "Calúnia e ameaça",
    categoria: "protecao"
  },
  {
    id: "mapa-secreto",
    nome: "Esconder Minha Casa",
    descricao: "Remoção de residência do Google Street View",
    icon: MapPin,
    caracteristicas: [
      "Localização no Street View",
      "Formulário oficial Google",
      "Privacidade geográfica"
    ],
    preco: "Sob consulta",
    prazo: "10 dias",
    idealPara: "Segurança residencial",
    categoria: "protecao"
  },
  {
    id: "link-cortado",
    nome: "Apagar Links Ruins",
    descricao: "Remoção de links ofensivos de redes sociais e sites",
    icon: LinkIcon,
    caracteristicas: [
      "Análise de conteúdo ofensivo",
      "Denúncia às plataformas",
      "Contenção da circulação"
    ],
    preco: "Sob consulta",
    prazo: "5 dias",
    idealPara: "Difamação online",
    categoria: "protecao"
  },
  {
    id: "varredura-reputacional",
    nome: "Limpar Minha Imagem",
    descricao: "Varredura completa e remoção em massa de conteúdos prejudiciais",
    icon: Search,
    destaque: true,
    caracteristicas: [
      "Análise completa reputacional",
      "Estratégia de contenção",
      "Solicitações múltiplas",
      "Plano de recuperação"
    ],
    preco: "Sob consulta",
    prazo: "30-45 dias",
    idealPara: "Crises graves",
    badge: "PACOTE COMPLETO",
    badgeColor: "purple",
    categoria: "protecao"
  },
  // PERÍCIA FORENSE (5 serviços)
  {
    id: "pericia-forense-validada",
    nome: "Investigação Validada",
    descricao: "Relatório forense validado por Perito Criminal Oficial",
    icon: ShieldCheck,
    destaque: true,
    caracteristicas: [
      "Metodologia forense certificada",
      "Assinado por Perito Oficial",
      "Cadeia de custódia",
      "Fontes públicas (OSINT)"
    ],
    preco: "Sob consulta",
    prazo: "10-15 dias",
    idealPara: "Processos judiciais",
    badge: "PERITO OFICIAL",
    badgeColor: "gold",
    categoria: "pericia"
  },
  {
    id: "extracao-forense-dispositivos",
    nome: "Extrair Dados de Celular",
    descricao: "Extração forense CELLEBRITE/XRY de dispositivo próprio",
    icon: Smartphone,
    destaque: true,
    caracteristicas: [
      "Metodologia CELLEBRITE/XRY",
      "Recuperação de dados deletados",
      "Cadeia de custódia oficial",
      "Validação pericial"
    ],
    preco: "Sob consulta",
    prazo: "7-10 dias",
    idealPara: "Provas de fraude",
    badge: "FORENSE",
    badgeColor: "gold",
    categoria: "pericia"
  },
  {
    id: "cadeia-custodia-certificada",
    nome: "Guardar Provas Digitais",
    descricao: "Preservação legal de evidências para processos judiciais",
    icon: Lock,
    caracteristicas: [
      "Coleta profissional",
      "Preservação com integridade",
      "Validação por Perito Oficial"
    ],
    preco: "Sob consulta",
    prazo: "5-7 dias",
    idealPara: "Provas críticas",
    categoria: "pericia"
  },
  {
    id: "treinamento-investigacao-digital",
    nome: "Treinamento OSINT",
    descricao: "Capacitação em investigação digital e fontes públicas",
    icon: Award,
    caracteristicas: [
      "Instrutora: Danielle Kaloi",
      "Validação: Ibsen Maciel",
      "Formato presencial ou remoto",
      "Certificado de participação"
    ],
    preco: "Sob consulta",
    prazo: "Sob agendamento",
    idealPara: "Equipes corporativas",
    categoria: "pericia"
  },
  {
    id: "consultoria-estrategica",
    nome: "Consultoria Investigativa",
    descricao: "Planejamento estratégico para casos complexos",
    icon: Users,
    caracteristicas: [
      "Consultoria especializada",
      "Metodologia forense validada",
      "Plano customizado"
    ],
    preco: "Sob consulta",
    prazo: "Sessão única/recorrente",
    idealPara: "Escritórios e consultores",
    categoria: "pericia"
  },
  // SERVIÇO PERSONALIZADO (NOVO)
  {
    id: "servico-personalizado",
    nome: "Serviço Personalizado",
    descricao: "Não encontrou o que procura? Desenvolvemos soluções sob medida",
    icon: Settings,
    destaque: true,
    caracteristicas: [
      "Análise do seu caso específico",
      "Proposta customizada",
      "Metodologia adaptada",
      "Consultoria inicial gratuita"
    ],
    preco: "Sob consulta",
    prazo: "Variável",
    idealPara: "Casos únicos",
    badge: "SOB MEDIDA",
    badgeColor: "cyan",
    categoria: "personalizado",
    beneficioEmocional: "Solução customizada para seu caso específico com consultoria inicial gratuita",
    riscoDeNaoContratar: "Necessidades específicas podem não ser atendidas por serviços padronizados",
    casoDeUso: "Já desenvolvemos soluções personalizadas para diversos casos únicos que não se encaixavam em serviços padrão",
    garantia: "Análise gratuita do caso. Proposta customizada sem compromisso. Execução conforme aprovação do cliente."
  }
];

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
            <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl">
              <service.icon className="w-8 h-8 text-blue-500" />
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
            <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl">
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
              <div className="p-4 bg-blue-50 dark:bg-navy-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-navy-400 mb-1">Investimento</p>
                <p className="text-xl font-bold text-blue-500">{service.preco}</p>
              </div>
            )}
            {service.prazo && (
              <div className="p-4 bg-blue-50 dark:bg-navy-800 rounded-lg">
                <p className="text-xs text-slate-500 dark:text-navy-400 mb-1">Prazo</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{service.prazo}</p>
              </div>
            )}
            {service.idealPara && (
              <div className="p-4 bg-blue-50 dark:bg-navy-800 rounded-lg">
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
      blue: "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
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
      <section className="relative pt-16 pb-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-navy-900 dark:via-navy-900 dark:to-navy-950 overflow-hidden">
        <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="container max-w-6xl px-4 relative z-10">
          <div className="max-w-4xl mx-auto mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-slate-700 dark:text-navy-200 text-center">
              <strong className="text-blue-600 dark:text-blue-400">✅ Conformidade LGPD:</strong> Investigações com fontes públicas (OSINT) ou dados consensualmente fornecidos. Base legal: interesse legítimo, exercício de direito ou cumprimento de obrigação legal.
            </p>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 text-center leading-tight">
            Prove a <span className="text-blue-500">Verdade</span> Antes Que<br />
            <span className="text-orange-500">Seja Tarde Demais</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-navy-300 max-w-3xl mx-auto mb-8 text-center">
            Combinamos <strong className="text-blue-500">tecnologia de ponta</strong> com
            <strong className="text-slate-900 dark:text-white"> metodologia forense validada</strong>
          </p>
        </div>
      </section>

      {/* SERVIÇOS SUGERIDOS - SEÇÃO PRINCIPAL COM TODOS OS CARDS */}
      <section className="py-16 bg-white dark:bg-navy-950">
        <div className="container max-w-7xl px-4">
          <div className="text-center mb-12">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 mb-4 px-6 py-2 text-base font-bold">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              SERVIÇOS SUGERIDOS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Todos os Nossos Serviços
            </h2>
            <p className="text-lg text-slate-600 dark:text-navy-300 max-w-3xl mx-auto">
              Clique em qualquer serviço para ver detalhes completos e falar com um especialista
            </p>
          </div>

          {/* Grid de TODOS os Serviços */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {TODOS_SERVICOS.map((servico) => (
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
                    <div className={`p-4 rounded-xl transition-all group-hover:scale-110 ${
                      servico.categoria === 'pericia' ? 'bg-amber-50 dark:bg-amber-900/20' :
                      servico.categoria === 'personalizado' ? 'bg-cyan-50 dark:bg-cyan-900/20' :
                      'bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      <servico.icon className={`w-8 h-8 ${
                        servico.categoria === 'pericia' ? 'text-amber-600 dark:text-amber-400' :
                        servico.categoria === 'personalizado' ? 'text-cyan-600 dark:text-cyan-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`} />
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
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white group-hover:bg-green-600 group-hover:shadow-lg transition-all"
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
            <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
              ✅ Perito Criminal Oficial
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
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">24-48h</div>
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
            <strong className="text-blue-500">5.950 investigações realizadas</strong> • Resposta em 24h<br />
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
        </main>
      }>
        <ServicosContent />
      </Suspense>
      <Footer />
    </>
  );
}
