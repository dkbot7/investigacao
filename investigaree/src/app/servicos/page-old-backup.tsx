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
import { PacotesServicosSection } from "@/components/sections/PacotesServicosSection";
import { ServicosEspeciaisSection } from "@/components/sections/ServicosEspeciaisSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import Image from "next/image";
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
  ClipboardCheck, Home, Heart, FileText
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
  // Novos campos para conversão
  beneficioEmocional?: string; // O que o cliente ganha emocionalmente
  riscoDeNaoContratar?: string; // O que acontece se NÃO contratar
  casoDeUso?: string; // História real (anonimizada)
  garantia?: string; // Redução de risco
}

// TAB 1: PROTEÇÃO & REMOÇÃO (11 serviços)
const SERVICOS_PROTECAO: Servico[] = [
  {
    id: "seguranca-residencial",
    nome: "Segurança Residencial e Patrimonial (Física)",
    descricao: "Instalação profissional de câmeras inteligentes Full HD com visão 360°, monitoramento remoto 24h e notificações em tempo real para proteger sua casa e família. Conforme LGPD.",
    icon: Video,
    destaque: true,
    caracteristicas: [
      "Câmera Full HD 1080p com visão 360° panorâmica",
      "Auto Tracking - rastreamento automático de movimento",
      "Notificações instantâneas de movimento suspeito",
      "Controle remoto total via smartphone (iOS/Android)",
      "Visão noturna inteligente até 10 metros",
      "Áudio bidirecional - veja, ouça e fale em tempo real",
      "Função de supervisão para crianças (requer consentimento dos responsáveis)",
      "Armazenamento em nuvem ou cartão microSD (até 256GB)",
      "Instalação profissional inclusa",
      "Suporte técnico e garantia de 1 ano",
      "Conformidade com Lei de Proteção de Dados de Menores"
    ],
    preco: "Sob consulta",
    prazo: "Instalação em 48-72h",
    idealPara: "Residências, empresas e propriedades rurais",
    badge: "INSTALAÇÃO INCLUSA",
    badgeColor: "blue",
    beneficioEmocional: "Proteção completa com monitoramento 24h: veja sua casa de qualquer lugar, receba alertas instantâneos e interaja por voz em tempo real",
    riscoDeNaoContratar: "Sua residência fica vulnerável a invasões, furtos e situações não documentadas. Sem monitoramento visual, você não tem provas em caso de incidentes",
    casoDeUso: "Sistema instalado em residência flagrou tentativa de invasão em tempo real, permitindo acionamento imediato da polícia e fornecendo imagens que identificaram os responsáveis",
    garantia: "Instalação profissional com equipamentos homologados pela Anatel. Garantia de 1 ano do fabricante. Qualidade da imagem depende de iluminação ambiente e conexão Wi-Fi estável",
  },
  {
    id: "apaga-meu-ex",
    nome: "Apagar Fotos Íntimas", // Antigo: "Apaga Meu Ex"
    descricao: "Solicitação de remoção de fotos íntimas ou constrangedoras compartilhadas sem consentimento.",
    icon: Trash2,
    destaque: true,
    caracteristicas: [
      "Atendimento emergencial prioritário",
      "Solicitação com base na LGPD",
      "Acompanhamento do processo",
      "Relatório de andamento",
      "Orientação jurídica incluída"
    ],
    preco: "Sob consulta",
    prazo: "Início imediato",
    idealPara: "Vítimas de vazamento de imagens",
    badge: "EMERGENCIAL",
    badgeColor: "red",
    beneficioEmocional: "Iniciamos imediatamente o processo de solicitação de remoção junto às plataformas",
    riscoDeNaoContratar: "Conteúdo íntimo compartilhado sem consentimento pode continuar se espalhando",
    casoDeUso: "Já auxiliamos na remoção de conteúdo em diversas plataformas através de solicitações baseadas na LGPD",
    garantia: "Atuamos com máximo esforço, mas dependemos da cooperação das plataformas. Prazo varia conforme cada caso",
  },
  {
    id: "cpf-blindado",
    nome: "Tirar Meu CPF da Internet", // Antigo: "CPF Blindado"
    descricao: "Solicitação de remoção do seu CPF e dados pessoais de 47 sites de busca e consulta pública conforme direito ao esquecimento (Art. 18, Lei 13.709/2018).",
    icon: Shield,
    caracteristicas: [
      "Solicitação em 47 sites comerciais catalogados",
      "Proteção contra perseguição digital",
      "Relatório de solicitações e respostas",
      "Conformidade total com LGPD",
      "Acompanhamento do processo",
      "Nota: Não abrange dados legítimos de órgãos públicos"
    ],
    preco: "Sob consulta",
    prazo: "30 dias",
    idealPara: "Proteção de privacidade máxima",
    beneficioEmocional: "Solicitação de remoção de dados pessoais de plataformas comerciais que não possuem base legal clara para publicá-los",
    riscoDeNaoContratar: "Seus dados pessoais podem estar acessíveis em plataformas comerciais sem base legal adequada",
    casoDeUso: "Já auxiliamos na remoção de dados de clientes em 47 sites catalogados, incluindo plataformas comerciais que expunham CPF, endereço e telefone sem consentimento",
    garantia: "Solicitação de remoção em sites comerciais catalogados. Não abrange dados de órgãos públicos com base legal. Efetividade depende da cooperação de cada plataforma",
  },
  {
    id: "espiao-exposto",
    nome: "Denunciar Perfil Falso", // Antigo: "Espião Exposto"
    descricao: "Identificação de perfis falsos que estão sendo usados para monitoramento ofensivo (não consensual), ameaçar ou difamar, com coleta de evidências públicas para ação legal.",
    icon: UserX,
    caracteristicas: [
      "Análise técnica do perfil suspeito",
      "Coleta de evidências públicas disponíveis",
      "Denúncia administrativa em massa",
      "Relatório para uso jurídico",
      "Acompanhamento da remoção",
      "Conformidade LGPD: análise apenas de dados públicos"
    ],
    preco: "Sob consulta", //R$ 1.200",
    prazo: "5-7 dias",
    idealPara: "Vítimas de perseguição online",
    beneficioEmocional: "Identificação e documentação técnica de perfis falsos com evidências públicas que podem ser usadas juridicamente",
    riscoDeNaoContratar: "Perfis falsos podem continuar espalhando difamação, prejudicando sua reputação profissional e pessoal sem consequências",
    casoDeUso: "Identificamos e documentamos perfis falsos em casos de perseguição online, fornecendo evidências técnicas de dados públicos que auxiliaram em medidas judiciais",
    garantia: "Análise técnica de evidências disponíveis publicamente. Remoção depende das políticas de cada plataforma e pode requerer ação judicial",
  },
  {
    id: "google-limpo",
    nome: "Tirar Meu Nome do Google", // Antigo: "Google Limpo"
    descricao: "Solicitação de desindexação de conteúdos negativos como processos, escândalos ou acusações do Google.",
    icon: Globe,
    caracteristicas: [
      "Listagem de links ofensivos",
      "Solicitação via Google",
      "Justificativa com base na LGPD",
      "Acompanhamento da solicitação",
      "Proteção de reputação online"
    ],
    preco: "Sob consulta", //R$ 1.800",
    prazo: "15-30 dias",
    idealPara: "Proteção reputacional",
    beneficioEmocional: "Solicitação de desindexação de conteúdos prejudiciais do Google, reduzindo a visibilidade de informações negativas sobre você",
    riscoDeNaoContratar: "Conteúdos negativos como processos antigos, notícias indesejadas ou informações desatualizadas permanecerão visíveis nas buscas do seu nome",
    casoDeUso: "Auxiliamos na solicitação de desindexação de links prejudiciais utilizando as ferramentas oficiais do Google e fundamentação baseada na LGPD",
    garantia: "Solicitação formal ao Google com fundamentação legal. Decisão de remoção é do Google conforme suas políticas e legislação aplicável",
  },
  {
    id: "foto-sumida",
    nome: "Apagar Minhas Fotos", // Antigo: "Foto Sumida"
    descricao: "Solicitação de remoção de imagens pessoais (não íntimas) publicadas sem consentimento em redes sociais e blogs.",
    icon: Eye,
    caracteristicas: [
      "Coleta de URLs ou prints",
      "Denúncia por violação de imagem",
      "Acompanhamento das solicitações",
      "Auxílio na retomada do controle",
      "Relatório de andamento"
    ],
    preco: "Sob consulta", //R$ 800",
    prazo: "7-10 dias",
    idealPara: "Exposição não autorizada",
    beneficioEmocional: "Solicitação de remoção de fotos publicadas sem seu consentimento, recuperando o controle sobre sua imagem",
    riscoDeNaoContratar: "Imagens não autorizadas podem continuar circulando online, causando constrangimento e violação dos seus direitos de imagem",
    casoDeUso: "Atuamos na remoção de fotos não íntimas publicadas sem autorização em redes sociais e sites, usando LGPD e direito de imagem",
    garantia: "Solicitação formal com fundamentação legal. Remoção depende da cooperação das plataformas conforme suas políticas",
  },
  {
    id: "endereco-off",
    nome: "Esconder Meu Endereço", // Antigo: "Endereço Off"
    descricao: "Solicitação de remoção de endereços residenciais de sites e serviços online para proteção física.",
    icon: MapPin,
    caracteristicas: [
      "Localização do endereço online",
      "Solicitação com base na LGPD",
      "Monitoramento das solicitações",
      "Proteção contra perseguição",
      "Aumento da segurança física"
    ],
    preco: "Sob consulta", //R$ 900",
    prazo: "15 dias",
    idealPara: "Proteção em separações conturbadas",
    beneficioEmocional: "Remoção do seu endereço residencial de sites públicos, aumentando sua segurança física e familiar",
    riscoDeNaoContratar: "Seu endereço exposto facilita perseguição, invasão de privacidade e riscos à segurança em separações ou conflitos",
    casoDeUso: "Auxiliamos na remoção de endereços em casos de separação judicial e proteção contra perseguição, solicitando remoção com base na LGPD",
    garantia: "Solicitação em múltiplos sites com fundamentação legal. Efetividade depende da cooperação de cada plataforma",
  },
  {
    id: "perfil-cacado",
    nome: "Achar Perfil Falso", // Antigo: "Perfil Caçado"
    descricao: "Identificação de perfis falsos que violam direitos alheios, com coleta de evidências PÚBLICAS (metadados, histórico visível). Identificação do responsável só com autorização judicial.",
    icon: Target,
    caracteristicas: [
      "Análise do perfil falso (dados públicos)",
      "Registro de evidências públicas disponíveis",
      "Denúncia formal às plataformas",
      "Monitoramento das solicitações",
      "Relatório investigativo completo",
      "Conformidade LGPD: análise apenas de dados públicos"
    ],
    preco: "Sob consulta", //R$ 1.000",
    prazo: "7 dias",
    idealPara: "Vítimas de calúnia/ameaça",
    beneficioEmocional: "Rastreamento técnico de perfis falsos com evidências públicas que podem auxiliar em ações judiciais contra calúnia ou ameaça",
    riscoDeNaoContratar: "Perfis falsos podem continuar prejudicando sua reputação, causando danos profissionais e pessoais sem identificação do responsável",
    casoDeUso: "Identificamos perfis fakes em casos de difamação online, coletando evidências técnicas públicas (metadados visíveis, histórico público) quando disponíveis",
    garantia: "Análise técnica de evidências disponíveis publicamente. Identificação do responsável só com autorização judicial ou consentimento. Conformidade LGPD garantida.",
  },
  {
    id: "mapa-secreto",
    nome: "Esconder Minha Casa", // Antigo: "Mapa Secreto"
    descricao: "Solicitação de remoção de casas e carros do Google Street View para ocultar localização.",
    icon: MapPin,
    caracteristicas: [
      "Localização no Street View",
      "Formulário de remoção Google",
      "Acompanhamento da solicitação",
      "Proteção da rotina pessoal",
      "Privacidade geográfica"
    ],
    preco: "Sob consulta", //R$ 600",
    prazo: "10 dias",
    idealPara: "Segurança residencial",
    beneficioEmocional: "Solicitação de desfoque ou remoção da sua casa e veículos do Google Street View, reduzindo exposição geográfica",
    riscoDeNaoContratar: "Sua residência e rotina familiar ficam expostas no Street View, facilitando invasões, monitoramento não autorizado e violação de privacidade",
    casoDeUso: "Auxiliamos na solicitação de desfoque de residências no Street View para clientes em situações de separação ou que valorizam discrição",
    garantia: "Solicitação formal ao Google com formulário oficial. Decisão de remoção/desfoque é do Google conforme suas políticas",
  },
  {
    id: "link-cortado",
    nome: "Apagar Links Ruins", // Antigo: "Link Cortado"
    descricao: "Solicitação de remoção de links de redes sociais ou sites que contenham ataques pessoais.",
    icon: LinkIcon,
    caracteristicas: [
      "Análise do conteúdo ofensivo",
      "Enquadramento legal/contratual",
      "Denúncia direta às plataformas",
      "Acompanhamento das solicitações",
      "Contenção da circulação"
    ],
    preco: "Sob consulta", //R$ 700",
    prazo: "5 dias",
    idealPara: "Vítimas de difamação online",
    beneficioEmocional: "Solicitação de remoção de links ofensivos com fundamentação legal, reduzindo a circulação de conteúdo difamatório",
    riscoDeNaoContratar: "Links prejudiciais podem continuar circulando, causando danos reputacionais contínuos e afetando oportunidades profissionais",
    casoDeUso: "Atuamos na solicitação de remoção de publicações ofensivas em redes sociais e sites, usando termos de uso das plataformas e LGPD",
    garantia: "Denúncia formal às plataformas com fundamentação legal. Remoção depende da análise e políticas de cada plataforma",
  },
  {
    id: "varredura-reputacional",
    nome: "Limpar Minha Imagem", // Antigo: "Varredura Reputacional"
    descricao: "Identificação e solicitação de remoção em massa de conteúdos que prejudicam a imagem online.",
    icon: Search,
    destaque: true,
    caracteristicas: [
      "Análise completa da reputação online",
      "Estratégia de contenção de danos",
      "Solicitações múltiplas de remoção",
      "Monitoramento contínuo",
      "Plano de recuperação reputacional"
    ],
    preco: "Sob consulta", //R$ 3.500",
    prazo: "30-45 dias",
    idealPara: "Crises reputacionais graves",
    badge: "PACOTE COMPLETO",
    badgeColor: "purple",
    beneficioEmocional: "Análise completa da sua reputação online com identificação e solicitação de remoção de múltiplos conteúdos prejudiciais",
    riscoDeNaoContratar: "Conteúdos negativos acumulados podem destruir oportunidades profissionais, prejudicar relações pessoais e causar danos permanentes à imagem",
    casoDeUso: "Auxiliamos em casos de crise reputacional com varredura completa em buscadores, redes sociais e sites, solicitando remoção de conteúdos ofensivos",
    garantia: "Análise completa com estratégia de contenção e solicitações múltiplas. Efetividade depende das políticas de cada plataforma e pode requerer ações judiciais",
  }
];

// TAB 3: PERÍCIA FORENSE (5 serviços)
const SERVICOS_PERICIA: Servico[] = [
  {
    id: "pericia-forense-validada",
    nome: "Investigação Validada por Perito", // Antigo: "Perícia Forense Validada"
    descricao: "Relatórios investigativos (OSINT - fontes públicas) para contextos legítimos como defesa judicial, compliance corporativo ou due diligence. Validados por Perito Criminal Oficial. Base legal justificada caso a caso.",
    icon: ShieldCheck,
    destaque: true,
    caracteristicas: [
      "Metodologia forense certificada",
      "Assinado por Perito Criminal Oficial",
      "Conformidade com normas técnicas",
      "Cadeia de custódia documental",
      "Investigação limitada a fontes públicas (OSINT)",
      "Base legal: interesse legítimo, exercício de direito ou compliance",
      "Laudo técnico detalhado"
    ],
    preco: "Sob consulta", //R$ 15.000+",
    prazo: "10-15 dias",
    idealPara: "Processos judiciais críticos",
    badge: "VALIDADO POR PERITO OFICIAL",
    badgeColor: "gold",
    beneficioEmocional: "Relatório seguindo metodologia forense com validação de Perito Criminal concursado",
    riscoDeNaoContratar: "Provas sem metodologia adequada podem ter sua validade questionada em processos judiciais",
    casoDeUso: "Nossos laudos seguem metodologia forense e são validados por perito oficial concursado (1º lugar PCE-PA 2019)",
    garantia: "Seguimos rigorosamente as normas técnicas forenses. Aceitação judicial depende do caso concreto e decisão do juiz",
  },
  {
    id: "extracao-forense-dispositivos",
    nome: "Extrair Dados de Celular", // Antigo: "Extração Forense de Dispositivos"
    descricao: "Extração forense de dispositivos PRÓPRIOS do cliente com metodologia CELLEBRITE/XRY, conforme LGPD (Art. 7º). Requer consentimento do titular do dispositivo.",
    icon: Smartphone,
    destaque: true,
    caracteristicas: [
      "Metodologia CELLEBRITE/XRY/AXIOM",
      "Extração física e lógica do PRÓPRIO dispositivo",
      "Recuperação de dados deletados",
      "Cadeia de custódia oficial",
      "Validação por Perito Criminal",
      "Exclusão de dados pessoais de terceiros não envolvidos",
      "Conformidade LGPD: dados de terceiros não utilizados"
    ],
    preco: "Sob consulta", //R$ 12.000+",
    prazo: "7-10 dias",
    idealPara: "Provas de ocultação/fraude",
    badge: "METODOLOGIA FORENSE",
    badgeColor: "gold",
    beneficioEmocional: "Extração forense de dispositivos com metodologia certificada (CELLEBRITE/XRY), recuperação de dados deletados e validação pericial",
    riscoDeNaoContratar: "Extração sem metodologia forense pode contaminar evidências e torná-las inadmissíveis judicialmente",
    casoDeUso: "Extração forense recuperou conversas deletadas e arquivos ocultos que se tornaram provas decisivas em processo judicial",
    garantia: "Metodologia forense certificada com cadeia de custódia. Recuperação de dados deletados depende do estado do dispositivo",
  },
  {
    id: "cadeia-custodia-certificada",
    nome: "Guardar Provas para Justiça", // Antigo: "Cadeia de Custódia Certificada"
    descricao: "Preservação legal de provas digitais para uso em processos judiciais.",
    icon: Lock,
    caracteristicas: [
      "Coleta profissional de evidências",
      "Preservação com integridade",
      "Documentação completa",
      "Validação por Perito Oficial",
      "Metodologia forense reconhecida"
    ],
    preco: "Sob consulta", //R$ 8.000+",
    prazo: "5-7 dias",
    idealPara: "Provas críticas em litígios",
    beneficioEmocional: "Preservação de evidências com cadeia de custódia certificada e validação por Perito Criminal Oficial para máxima confiabilidade judicial",
    riscoDeNaoContratar: "Evidências sem cadeia de custódia adequada podem ser questionadas ou rejeitadas em processos judiciais",
    casoDeUso: "Cadeia de custódia certificada garantiu integridade de evidências digitais que foram aceitas como prova válida em tribunal",
    garantia: "Metodologia forense com cadeia de custódia completa. Aceitação judicial depende do contexto e decisão do magistrado",
  },
  {
    id: "treinamento-investigacao-digital",
    nome: "Ensinar Investigação", // Antigo: "Treinamento em Investigação Digital"
    descricao: "Capacitação de equipes em OSINT, fontes públicas e metodologia investigativa.",
    icon: Award,
    caracteristicas: [
      "Instrutora: Danielle Kaloi",
      "Validação técnica: Ibsen Maciel",
      "Formato: presencial ou remoto",
      "Duração: 4-8 horas",
      "Certificado de participação"
    ],
    preco: "Sob consulta", //R$ 5.000",
    prazo: "Sob agendamento",
    idealPara: "Advogados, investigadores, analistas",
    beneficioEmocional: "Capacitação em OSINT e investigação digital com instrutora especializada e validação de Perito Criminal concursado",
    riscoDeNaoContratar: "Equipes sem capacitação adequada podem perder evidências importantes, violar privacidade ou realizar investigações ineficazes",
    casoDeUso: "Treinamos equipes de compliance e advocacia em técnicas OSINT que aumentaram significativamente a efetividade investigativa interna",
    garantia: "Treinamento com conteúdo atualizado e instrutora experiente. Aplicação prática depende do esforço e contexto de cada participante",
  },
  {
    id: "consultoria-estrategica",
    nome: "Planejar Investigação", // Antigo: "Consultoria Estratégica em Investigação"
    descricao: "Planejamento de estratégias investigativas para casos complexos.",
    icon: Users,
    caracteristicas: [
      "Consultoria especializada",
      "Metodologia forense validada",
      "Sessões de 2-4 horas",
      "Plano de investigação customizado",
      "Orientação metodológica oficial"
    ],
    preco: "Sob consulta", //R$ 3.500",
    prazo: "Sessão única ou recorrente",
    idealPara: "Escritórios e consultores",
    beneficioEmocional: "Consultoria estratégica para planejamento investigativo com metodologia forense validada e plano customizado",
    riscoDeNaoContratar: "Investigações sem planejamento estratégico podem desperdiçar recursos, perder evidências ou usar metodologia inadequada",
    casoDeUso: "Consultoria estratégica direcionou investigação complexa de fraude corporativa, economizando tempo e recursos com foco nas fontes certas",
    garantia: "Consultoria com metodologia forense reconhecida. Resultados dependem da execução do plano e circunstâncias do caso",
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-navy-900">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl">
              <service.icon className="w-8 h-8 text-blue-500" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl text-slate-900 dark:text-white">{service.nome}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Risco de NÃO Contratar - PAIN POINT */}
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

          {/* Caso de Uso - PROVA SOCIAL */}
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

          {/* Garantia - REDUÇÃO DE RISCO */}
          {service.garantia && (
            <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-1">✅ Garantia Total:</h4>
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

          {/* CTA - Mais Urgente e Emocional */}
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
  const [showAllCards, setShowAllCards] = useState(false); // Para mobile: mostrar apenas 3 cards inicialmente

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
        {/* Hero Section - REDESENHADA COM GATILHOS MENTAIS */}
        <section className="relative pt-16 pb-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-navy-900 dark:via-navy-900 dark:to-navy-950 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container max-w-6xl px-4 relative z-10">
            {/* Disclaimer LGPD */}
            <div className="max-w-4xl mx-auto mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-slate-700 dark:text-navy-200 text-center">
                <strong className="text-blue-600 dark:text-blue-400">✅ Conformidade LGPD (Lei 13.709/2018):</strong> Todas as investigações utilizam apenas fontes públicas (OSINT) ou dados consensualmente fornecidos. Base legal: interesse legítimo, exercício de direito ou cumprimento de obrigação legal. Respeitamos direitos do titular conforme Art. 18 da LGPD.
              </p>
            </div>

            {/* Headline Emocional com Urgência */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 text-center leading-tight">
              Prove a <span className="text-blue-500">Verdade</span> Antes Que<br />
              <span className="text-orange-500">Seja Tarde Demais</span>
            </h1>

            {/* Subtítulo com Prova Social */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-navy-300 max-w-3xl mx-auto mb-8 text-center">
              Combinamos <strong className="text-blue-500">tecnologia de ponta</strong> com
              <strong className="text-slate-900 dark:text-white"> metodologia forense validada</strong>
            </p>
          </div>
        </section>

        {/* Serviços Principais - Os 3 Mais Procurados */}
        <ServicosEspeciaisSection />

        {/* Prova Social Rápida - Linha Única de Métricas */}
        <section className="py-6 bg-slate-50 dark:bg-navy-900 border-y border-slate-200 dark:border-navy-800">
          <div className="container max-w-6xl px-4">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30 font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                🔥 Atendimento em 24-72h
              </Badge>
              <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                ✅ Perito Criminal Oficial
              </Badge>
              <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                🚀 5.950 funcionários auditados
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30 font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                ⭐ 4.9/5 - 127 avaliações
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30 font-semibold px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                🔒 100% Confidencial
              </Badge>
            </div>
          </div>
        </section>

        {/* DESTAQUE: Remoção de Conteúdos Online - STF 2025 */}
        <section className="py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-red-950 dark:to-slate-900">
          <div className="container max-w-6xl px-4">
            <div className="relative">
              {/* Background decorativo */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] bg-center"></div>
              </div>

              <Card className="relative border-2 border-amber-500 shadow-2xl shadow-amber-500/20 bg-white dark:bg-slate-900 overflow-hidden">
                {/* Badge "NOVO" flutuante */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-amber-500 text-slate-900 font-bold px-4 py-2 text-sm animate-pulse">
                    🔥 DECISÃO STF 2025
                  </Badge>
                </div>

                <CardContent className="p-8 md:p-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* Coluna Esquerda: Conteúdo */}
                    <div className="space-y-6">
                      <div>
                        <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30 mb-3">
                          SERVIÇO EM DESTAQUE
                        </Badge>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                          Remoção Profissional de Conteúdos Online
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                          Remova <strong className="text-red-600">processos antigos, notícias negativas e conteúdos prejudiciais</strong> do Google, Jusbrasil, Escavador e redes sociais com a nova metodologia pós-STF 2025.
                        </p>
                      </div>

                      {/* Estatísticas Chave */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">85%</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Taxa de sucesso</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">24-48h</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Casos urgentes</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg border border-purple-200 dark:border-purple-800">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">70%</div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Menos processos</div>
                        </div>
                      </div>

                      {/* Benefícios principais */}
                      <div className="space-y-2">
                        {[
                          'Desindexação Google de processos e notícias negativas',
                          'Remoção Jusbrasil/Escavador conforme LGPD',
                          'Redes sociais com resposta em 24-48h',
                          'Fundamentação "conteúdo objetivamente ilícito" (STF 2025)',
                        ].map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{benefit}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTAs */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/solucoes/protecao-remocao" className="flex-1">
                          <Button className="w-full bg-red-600 hover:bg-red-700 text-white h-12 font-semibold shadow-lg shadow-red-600/30">
                            <Shield className="w-5 h-5 mr-2" />
                            Ver Detalhes Completos
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                        <Link href="/contato" className="flex-1">
                          <Button variant="outline" className="w-full h-12 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-semibold">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Consulta Gratuita
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Coluna Direita: Visual/Plataformas */}
                    <div className="relative">
                      <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 rounded-2xl p-6 border border-red-500/20">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-center">
                          Plataformas Atendidas
                        </h3>
                        <div className="space-y-3">
                          {[
                            { name: 'Google', time: '2-5 dias', icon: Globe, color: 'red' },
                            { name: 'Jusbrasil', time: '2-5 dias', icon: Scale, color: 'purple' },
                            { name: 'Escavador', time: '2-5 dias', icon: Search, color: 'blue' },
                            { name: 'Redes Sociais', time: '24-48h', icon: MessageCircle, color: 'green' },
                          ].map((platform, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 bg-${platform.color}-50 dark:bg-${platform.color}-900/20 rounded-lg`}>
                                  <platform.icon className={`w-4 h-4 text-${platform.color}-600 dark:text-${platform.color}-400`} />
                                </div>
                                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                                  {platform.name}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {platform.time}
                              </Badge>
                            </div>
                          ))}
                        </div>

                        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-500/30 rounded-lg text-center">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            ⚖️ Fundamentado na decisão revolucionária do STF de junho/2025
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Soluções Especializadas - Com Páginas Dedicadas */}
        <section className="py-16 bg-white dark:bg-navy-950">
          <div className="container max-w-7xl px-4">
            {/* Header */}
            <div className="text-center mb-10">
              <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 mb-4">
                Outras Soluções Especializadas
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Mais Serviços Disponíveis
              </h2>
              <p className="text-lg text-slate-600 dark:text-navy-300 max-w-3xl mx-auto">
                Explore nossa linha completa de soluções investigativas e de compliance
              </p>
            </div>

            {/* Grid de Soluções */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* Due Diligence */}
              <Link href="/solucoes/due-diligence" className="group">
                <Card className="hover:shadow-lg transition-all bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 h-full min-h-[140px] md:min-h-[160px]">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center text-center h-full justify-center">
                    <div className="p-2 md:p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                      <Building2 className="w-5 h-5 md:w-6 md:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white">
                      Due Diligence
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-navy-400 mt-1">
                      Empresarial
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Background Check */}
              <Link href="/solucoes/background-check-executivos" className="group">
                <Card className="hover:shadow-lg transition-all bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 h-full min-h-[140px] md:min-h-[160px]">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center text-center h-full justify-center">
                    <div className="p-2 md:p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white">
                      Background Check
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-navy-400 mt-1">
                      Executivos
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Investigação Patrimonial */}
              <Link href="/solucoes/investigacao-patrimonial" className="group">
                <Card className="hover:shadow-lg transition-all bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 h-full min-h-[140px] md:min-h-[160px]">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center text-center h-full justify-center">
                    <div className="p-2 md:p-3 bg-green-50 dark:bg-green-500/10 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                      <Home className="w-5 h-5 md:w-6 md:h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white">
                      Investigação
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-navy-400 mt-1">
                      Patrimonial
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* RH & Compliance */}
              <Link href="/solucoes/rh-compliance" className="group">
                <Card className="hover:shadow-lg transition-all bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 h-full min-h-[140px] md:min-h-[160px]">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center text-center h-full justify-center">
                    <div className="p-2 md:p-3 bg-orange-50 dark:bg-orange-500/10 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                      <ClipboardCheck className="w-5 h-5 md:w-6 md:h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white">
                      RH & Compliance
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-navy-400 mt-1">
                      Corporativo
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Auditoria Licitações */}
              <Link href="/solucoes/auditoria-licitacoes" className="group">
                <Card className="hover:shadow-lg transition-all bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 h-full min-h-[140px] md:min-h-[160px]">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center text-center h-full justify-center">
                    <div className="p-2 md:p-3 bg-red-50 dark:bg-red-500/10 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                      <FileText className="w-5 h-5 md:w-6 md:h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white">
                      Auditoria
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-navy-400 mt-1">
                      Licitações
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Coleta de Provas */}
              <Link href="/solucoes/coleta-provas-digitais" className="group">
                <Card className="hover:shadow-lg transition-all bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 h-full min-h-[140px] md:min-h-[160px]">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center text-center h-full justify-center">
                    <div className="p-2 md:p-3 bg-cyan-50 dark:bg-cyan-500/10 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                      <Smartphone className="w-5 h-5 md:w-6 md:h-6 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white">
                      Coleta de Provas
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-navy-400 mt-1">
                      Digitais
                    </p>
                  </CardContent>
                </Card>
              </Link>

              {/* Due Diligence Divórcios */}
              <Link href="/solucoes/due-diligence-divorcios" className="group">
                <Card className="hover:shadow-lg transition-all bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 h-full min-h-[140px] md:min-h-[160px]">
                  <CardContent className="p-4 md:p-6 flex flex-col items-center text-center h-full justify-center">
                    <div className="p-2 md:p-3 bg-pink-50 dark:bg-pink-500/10 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                      <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base text-slate-900 dark:text-white">
                      Divórcios
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-navy-400 mt-1">
                      Partilha Justa
                    </p>
                  </CardContent>
                </Card>
              </Link>

            </div>
          </div>
        </section>

        {/* Aviso Completo de Conformidade LGPD */}
        <section className="py-12 bg-slate-100 dark:bg-navy-900">
          <div className="container max-w-5xl px-4">
            <div className="bg-white dark:bg-navy-800 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 md:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Aviso de Conformidade LGPD
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-navy-300 mb-4">
                    Nosso compromisso com a proteção de dados e privacidade
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm text-slate-700 dark:text-navy-200">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p><strong>Fontes Públicas:</strong> Todas as investigações são limitadas a fontes públicas (OSINT) e dados consensualmente fornecidos pelo cliente.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p><strong>Base Legal:</strong> Atuamos com base em interesse legítimo (compliance, due diligence), exercício regular de direito (defesa judicial) ou cumprimento de obrigação legal conforme Art. 7º da LGPD.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p><strong>Direitos dos Titulares:</strong> Respeitamos todos os direitos previstos no Art. 18 da LGPD, incluindo direito ao esquecimento, retificação e oposição ao tratamento.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p><strong>Dados de Terceiros:</strong> Não realizamos coleta não consentida de dados pessoais. Dispositivos forenses: apenas do próprio cliente com consentimento explícito.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p><strong>Limitações:</strong> Serviços de remoção de dados não abrangem dados legítimos de órgãos públicos com base legal. Efetividade depende das políticas de cada plataforma.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p><strong>Compartilhamento:</strong> Informações compartilhadas com terceiros requerem documentação clara de base legal e finalidade específica.</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-navy-700">
                <p className="text-xs text-slate-500 dark:text-navy-400 text-center">
                  Lei Geral de Proteção de Dados (Lei nº 13.709/2018) • Todos os serviços em conformidade
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section com Urgência */}
        <section className="py-20 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-navy-800 dark:via-navy-900 dark:to-navy-950 relative overflow-hidden">
          {/* Badge de Urgência Flutuante */}
          <div className="absolute top-4 right-4 md:top-8 md:right-8">
            <Badge className="bg-red-500 text-white px-4 py-2 text-sm font-semibold animate-pulse">
              ⏰ Vagas Limitadas
            </Badge>
          </div>

          <div className="container max-w-4xl px-4 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              🚀 Comece Sua Investigação Hoje
            </h2>
            <p className="text-lg text-slate-700 dark:text-navy-200">
              <strong className="text-blue-500">5.950 investigações realizadas</strong> • Resposta garantida em 24h<br />
              Empresas, Famílias, Advogados e Investidores confiam em nós
            </p>
            <div className="flex flex-wrap gap-3 justify-center pb-4">
              <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/30 font-semibold">✅ Resposta em 24h</Badge>
              <Badge className="bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold">🔒 100% Confidencial</Badge>
              <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30 font-semibold">⚡ Atendimento Emergencial</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contato">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-bold min-h-[56px] h-14 px-8 text-base shadow-lg">
                  ⚡ Começar Agora - Orçamento Grátis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="https://wa.me/5547992602673?text=Olá!%20Preciso%20de%20uma%20investigação%20urgente" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-green-500/50 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500 min-h-[56px] h-14 px-8 text-base font-semibold">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  💬 WhatsApp Direto (24h)
                </Button>
              </a>
            </div>
            <p className="text-sm text-slate-500 dark:text-navy-400 pt-4">
              🔒 Seus dados estão protegidos pela LGPD • 🛡️ Sigilo absoluto garantido
            </p>
          </div>
        </section>

        {/* Modal */}
        <ServiceModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

        {/* Sticky CTA Bar - MOBILE ONLY - +40% conversão */}
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-navy-900 border-t-2 border-green-500 shadow-2xl">
          <div className="container px-4 py-3">
            <a
              href="https://wa.me/5547992602673?text=Olá!%20Gostaria%20de%20falar%20com%20um%20especialista%20em%20investigação"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-14 shadow-lg">
                <MessageCircle className="w-6 h-6 mr-2" />
                💬 Falar com Especialista Agora
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
