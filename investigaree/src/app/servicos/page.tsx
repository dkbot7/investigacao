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
  Shield, Search, ShieldCheck, Trash2, Eye, Globe,
  Lock, UserX, MapPin, Link as LinkIcon, FileSearch,
  Database, TrendingUp, Scale, Bell, Video, Zap,
  BarChart3, FileCheck, Smartphone, Award, Users,
  Briefcase, CheckCircle2, ArrowRight, MessageCircle,
  Phone, Brain, Target, AlertTriangle, Clock, Star,
  TrendingDown, Flame, CheckCircle, Timer, UserCheck,
  Building2, ThumbsUp, XCircle, Sparkles
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
  casosResolvidosRecente?: number; // Prova social
}

// TAB 1: PROTEÇÃO & REMOÇÃO (10 serviços)
const SERVICOS_PROTECAO: Servico[] = [
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
    casosResolvidosRecente: 7
  },
  {
    id: "cpf-blindado",
    nome: "Tirar Meu CPF da Internet", // Antigo: "CPF Blindado"
    descricao: "Solicitação de remoção do seu CPF e dados pessoais de 47 sites de busca e consulta pública.",
    icon: Shield,
    caracteristicas: [
      "Solicitação em 47 sites catalogados",
      "Proteção contra perseguição digital",
      "Relatório de solicitações e respostas",
      "Conformidade total com LGPD",
      "Acompanhamento do processo"
    ],
    preco: "Sob consulta",
    prazo: "30 dias",
    idealPara: "Proteção de privacidade máxima",
    beneficioEmocional: "Proteção contra invasão de privacidade, stalking e uso indevido dos seus dados pessoais em sites de consulta pública",
    riscoDeNaoContratar: "Seus dados pessoais continuarão expostos em dezenas de sites públicos, facilitando fraudes, invasão de privacidade e perseguição digital",
    casoDeUso: "Já auxiliamos na remoção de dados de clientes em 47 sites catalogados, incluindo plataformas que expunham CPF, endereço e telefone sem consentimento",
    garantia: "Solicitação de remoção em todos os 47 sites catalogados. Efetividade depende da cooperação de cada plataforma e conformidade com LGPD",
    casosResolvidosRecente: 5
  },
  {
    id: "espiao-exposto",
    nome: "Denunciar Perfil Falso", // Antigo: "Espião Exposto"
    descricao: "Identificação e denúncia de perfis falsos usados para vigiar, ameaçar ou difamar.",
    icon: UserX,
    caracteristicas: [
      "Análise técnica do perfil suspeito",
      "Coleta de provas digitais",
      "Denúncia administrativa em massa",
      "Relatório para uso jurídico",
      "Acompanhamento da remoção"
    ],
    preco: "Sob consulta", //R$ 1.200",
    prazo: "5-7 dias",
    idealPara: "Vítimas de perseguição online",
    beneficioEmocional: "Identificação e documentação técnica de perfis falsos com evidências que podem ser usadas juridicamente",
    riscoDeNaoContratar: "Perfis falsos podem continuar espalhando difamação, prejudicando sua reputação profissional e pessoal sem consequências",
    casoDeUso: "Identificamos e documentamos perfis falsos em casos de perseguição online, fornecendo evidências técnicas que auxiliaram em medidas judiciais",
    garantia: "Análise técnica completa com coleta de evidências digitais. Remoção depende das políticas de cada plataforma e pode requerer ação judicial",
    casosResolvidosRecente: 8
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
    casosResolvidosRecente: 6
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
    casosResolvidosRecente: 4
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
    casosResolvidosRecente: 3
  },
  {
    id: "perfil-cacado",
    nome: "Achar Perfil Falso", // Antigo: "Perfil Caçado"
    descricao: "Identificação e solicitação de remoção de perfis fakes usados para calúnia, ameaça ou fingir identidade.",
    icon: Target,
    caracteristicas: [
      "Análise do perfil falso",
      "Registro de evidências",
      "Denúncia formal às plataformas",
      "Monitoramento das solicitações",
      "Relatório investigativo completo"
    ],
    preco: "Sob consulta", //R$ 1.000",
    prazo: "7 dias",
    idealPara: "Vítimas de calúnia/ameaça",
    beneficioEmocional: "Rastreamento técnico de perfis falsos com evidências que podem auxiliar em ações judiciais contra calúnia ou ameaça",
    riscoDeNaoContratar: "Perfis falsos podem continuar prejudicando sua reputação, causando danos profissionais e pessoais sem identificação do responsável",
    casoDeUso: "Identificamos perfis fakes em casos de difamação online, coletando evidências técnicas como IP, dispositivo e horários de acesso quando disponíveis",
    garantia: "Análise técnica do perfil com coleta de evidências. Identificação do responsável depende de dados disponíveis e pode requerer ação judicial",
    casosResolvidosRecente: 7
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
    casosResolvidosRecente: 6
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
    casosResolvidosRecente: 9
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
    casosResolvidosRecente: 3
  }
];

// TAB 2: INVESTIGAÇÃO & DUE DILIGENCE (12 serviços)
const SERVICOS_INVESTIGACAO: Servico[] = [
  {
    id: "dossie-digital",
    nome: "Investigação Completa", // Antigo: "Dossiê Digital"
    descricao: "Enriquecimento automatizado com 1600+ fontes OSINT e cruzamento inteligente de dados.",
    icon: FileSearch,
    destaque: true,
    caracteristicas: [
      "1600+ fontes OSINT catalogadas",
      "Cruzamento automatizado de dados",
      "Rastreabilidade completa",
      "Relatório executivo detalhado",
      "Powered by IA para red flags"
    ],
    preco: "Sob consulta", //R$ 2.500",
    prazo: "48-72h",
    idealPara: "Due diligence inicial",
    badge: "IA + 1600 FONTES",
    badgeColor: "blue",
    beneficioEmocional: "Relatório completo com cruzamento automatizado de 1600+ fontes OSINT e IA para identificar inconsistências e red flags",
    riscoDeNaoContratar: "Decisões importantes tomadas sem informações completas podem resultar em prejuízos financeiros, parcerias arriscadas ou contratações problemáticas",
    casoDeUso: "Realizamos due diligence que identificou processos trabalhistas ocultos e vínculos empresariais não declarados antes de uma fusão empresarial",
    garantia: "Relatório baseado em dados públicos de 1600+ fontes com análise por IA. Não garantimos descoberta de informações específicas",
    casosResolvidosRecente: 12
  },
  {
    id: "radar-corporativo",
    nome: "Ver Vínculos de Empresa", // Antigo: "Radar Corporativo"
    descricao: "Rastreamento de vínculos empresariais, financeiros e políticos com análise de rede.",
    icon: TrendingUp,
    caracteristicas: [
      "Mapeamento de vínculos ocultos",
      "Grafos interativos de relacionamentos",
      "ML para padrões suspeitos",
      "Análise de conflitos de interesse",
      "Monitoramento contínuo disponível"
    ],
    preco: "Sob consulta", //R$ 4.500",
    prazo: "5-7 dias",
    idealPara: "Parcerias e investimentos",
    beneficioEmocional: "Mapeamento de vínculos empresariais, financeiros e políticos com grafos interativos para identificar conflitos de interesse",
    riscoDeNaoContratar: "Parcerias ou investimentos podem envolver pessoas com vínculos ocultos, processos ou conflitos de interesse não detectados",
    casoDeUso: "Mapeamos vínculos corporativos que revelaram participação oculta de sócio em empresa concorrente, evitando conflito de interesse",
    garantia: "Análise baseada em dados públicos com ML para padrões. Vínculos ocultos intencionalmente podem não ser detectados",
    casosResolvidosRecente: 5
  },
  {
    id: "renda-realidade",
    nome: "Descobrir Dinheiro Oculto", // Antigo: "Renda x Realidade"
    descricao: "Detecção de incompatibilidade entre renda declarada e patrimônio real, incluindo cripto.",
    icon: AlertTriangle,
    destaque: true,
    caracteristicas: [
      "Cruzamento renda x patrimônio",
      "Rastreamento de criptomoedas",
      "Identificação de bens ocultos",
      "Relatório com evidências",
      "Validade judicial (IBDFAM alerta)"
    ],
    preco: "Sob consulta", //R$ 5.000",
    prazo: "7-10 dias",
    idealPara: "Divórcios e auditorias",
    badge: "INCLUI CRIPTO",
    badgeColor: "orange",
    beneficioEmocional: "Ajudamos você a encontrar bens e valores que podem estar ocultos em processos de partilha",
    riscoDeNaoContratar: "Segundo estudos do IBDFAM, em processos litigiosos pode haver ocultação patrimonial não identificada",
    casoDeUso: "Em um caso real, identificamos R$ 3,2M em criptomoedas não declaradas que resultaram em nova partilha judicial",
    garantia: "Metodologia baseada em cruzamento de dados públicos e análise patrimonial. Sem garantia de resultados específicos",
    casosResolvidosRecente: 2
  },
  {
    id: "prova-digital",
    nome: "Guardar Provas", // Antigo: "Prova Digital"
    descricao: "Captura legal e preservação de provas digitais com carimbo de data autenticado.",
    icon: FileCheck,
    caracteristicas: [
      "Captura profissional de prints",
      "Carimbo de data digital",
      "Validação da fonte",
      "PDF com metadata",
      "Entrega em 24h"
    ],
    preco: "Sob consulta", //R$ 800",
    prazo: "24 horas",
    idealPara: "Processos judiciais",
    beneficioEmocional: "Preservação profissional de provas digitais com carimbo de data, metadata e validação de fonte para uso judicial",
    riscoDeNaoContratar: "Prints comuns feitos por você podem ser questionados em processos judiciais por falta de autenticação técnica e cadeia de custódia",
    casoDeUso: "Preservamos evidências digitais de difamação em redes sociais que foram aceitas como prova válida em processo judicial",
    garantia: "Captura técnica com metadata e carimbo de tempo. Aceitação judicial depende do juiz e contexto do processo",
    casosResolvidosRecente: 18
  },
  {
    id: "background-check-empresarial",
    nome: "Verificar Passado de Pessoa", // Antigo: "Background Check Empresarial"
    descricao: "Verificação completa de sócios, parceiros e funcionários com cruzamento em bases de sanções.",
    icon: Briefcase,
    caracteristicas: [
      "Verificação de antecedentes",
      "Cruzamento com CEIS/CNEP",
      "Análise de vínculos empresariais",
      "Processos judiciais ativos",
      "Relatório individual detalhado"
    ],
    preco: "Sob consulta", //R$ 3.500",
    prazo: "3-5 dias",
    idealPara: "Contratações e parcerias",
    beneficioEmocional: "Verificação completa de antecedentes com cruzamento em CEIS/CNEP, processos judiciais e vínculos empresariais",
    riscoDeNaoContratar: "Contratações ou parcerias sem verificação podem envolver pessoas com sanções, processos ou histórico problemático não declarado",
    casoDeUso: "Background check identificou execuções fiscais ativas e sanção administrativa não declarada antes de contratação para cargo de confiança",
    garantia: "Verificação baseada em dados públicos (CEIS, CNEP, tribunais). Informações ocultas ou não públicas podem não aparecer",
    casosResolvidosRecente: 8
  },
  {
    id: "relatorio-risco",
    nome: "Avaliar Riscos", // Antigo: "Relatório de Risco"
    descricao: "Indicadores jurídicos, reputacionais e financeiros com análise preditiva.",
    icon: BarChart3,
    caracteristicas: [
      "Scoring de risco automatizado",
      "Análise preditiva com ML",
      "Indicadores jurídicos/financeiros",
      "Benchmark de mercado",
      "Dashboard interativo"
    ],
    preco: "Sob consulta", //R$ 4.000",
    prazo: "5 dias",
    idealPara: "Decisões estratégicas",
    beneficioEmocional: "Análise de risco com scoring automatizado, ML preditivo e indicadores jurídicos/financeiros/reputacionais em dashboard interativo",
    riscoDeNaoContratar: "Decisões estratégicas sem análise de risco estruturada podem resultar em prejuízos por não antever problemas detectáveis",
    casoDeUso: "Relatório de risco identificou padrão de processos trabalhistas recorrentes que sinalizou gestão problemática antes de investimento",
    garantia: "Análise baseada em dados públicos com ML. Predições são probabilísticas, não garantem eventos futuros",
    casosResolvidosRecente: 4
  },
  {
    id: "compliance-check",
    nome: "Verificar Conformidade", // Antigo: "Compliance Check"
    descricao: "Auditoria de conformidade com LGPD, verificação em CEIS e CNEP.",
    icon: Scale,
    caracteristicas: [
      "Auditoria LGPD completa",
      "Verificação CEIS/CNEP",
      "Análise de sanções administrativas",
      "Relatório de conformidade",
      "Recomendações de adequação"
    ],
    preco: "Sob consulta", //R$ 3.000",
    prazo: "5-7 dias",
    idealPara: "Compliance corporativo",
    beneficioEmocional: "Auditoria de conformidade LGPD e verificação em bases de sanções (CEIS/CNEP) com relatório e recomendações de adequação",
    riscoDeNaoContratar: "Empresas sem auditoria de conformidade podem ter sanções ou irregularidades não detectadas, gerando riscos legais e reputacionais",
    casoDeUso: "Auditoria identificou sanções administrativas em CNEP e não conformidades LGPD antes de processo de certificação empresarial",
    garantia: "Verificação baseada em bases públicas (CEIS, CNEP, ANPD). Análise LGPD baseada em legislação vigente, não substitui consultoria jurídica",
    casosResolvidosRecente: 6
  },
  {
    id: "alerta-digital",
    nome: "Avisar Mudanças", // Antigo: "Alerta Digital"
    descricao: "Monitoramento contínuo de CPFs, empresas ou termos com alertas em tempo real.",
    icon: Bell,
    caracteristicas: [
      "Monitoramento 24/7",
      "Alertas em tempo real",
      "Múltiplas fontes de dados",
      "Relatórios mensais",
      "Dashboard de acompanhamento"
    ],
    preco: "Sob consulta", //R$ 1.500/mês",
    prazo: "Contínuo",
    idealPara: "Vigilância ativa",
    beneficioEmocional: "Monitoramento contínuo 24/7 com alertas em tempo real sobre mudanças em CPFs, CNPJs ou termos específicos",
    riscoDeNaoContratar: "Mudanças importantes como processos novos, sanções ou alterações societárias podem passar despercebidas sem monitoramento ativo",
    casoDeUso: "Sistema alertou em tempo real sobre abertura de processo judicial contra parceiro comercial, permitindo ação preventiva imediata",
    garantia: "Monitoramento nas fontes configuradas com alertas automatizados. Disponibilidade depende das fontes de dados",
    casosResolvidosRecente: 11
  },
  {
    id: "olho-seguro",
    nome: "Instalar Câmeras", // Antigo: "Olho Seguro"
    descricao: "Instalação de câmeras inteligentes com acesso remoto e gravação criptografada.",
    icon: Video,
    caracteristicas: [
      "Instalação profissional",
      "Acesso remoto 24h",
      "Gravação criptografada",
      "Detecção de movimento IA",
      "Armazenamento em nuvem"
    ],
    preco: "Sob consulta", //R$ 8.000",
    prazo: "Instalação em 48h",
    idealPara: "Segurança física",
    beneficioEmocional: "Instalação profissional de câmeras com acesso remoto 24h, gravação criptografada e detecção inteligente de movimento",
    riscoDeNaoContratar: "Ambientes sem monitoramento visual ficam vulneráveis a invasões, furtos ou situações não documentadas visualmente",
    casoDeUso: "Sistema de câmeras instalado flagrou tentativa de invasão, fornecendo evidências que auxiliaram na identificação dos responsáveis",
    garantia: "Instalação profissional com equipamentos homologados. Qualidade da gravação depende de condições ambientais e conectividade",
    casosResolvidosRecente: 4
  },
  {
    id: "vigilancia-estrategica",
    nome: "Monitorar Pessoa", // Antigo: "Vigilância Estratégica"
    descricao: "Monitoramento contínuo e profundo de alvos de alto risco.",
    icon: Eye,
    caracteristicas: [
      "Monitoramento dedicado",
      "Análise comportamental",
      "Relatórios semanais",
      "Alertas críticos imediatos",
      "Equipe especializada"
    ],
    preco: "Sob consulta", //R$ 5.000/mês",
    prazo: "Contínuo",
    idealPara: "Casos complexos",
    beneficioEmocional: "Monitoramento digital contínuo com análise comportamental, relatórios semanais e alertas críticos para casos complexos",
    riscoDeNaoContratar: "Alvos de alto risco sem monitoramento podem realizar ações prejudiciais não detectadas em tempo hábil",
    casoDeUso: "Monitoramento identificou padrão de movimentações suspeitas e abertura de empresa em nome de terceiros durante processo judicial",
    garantia: "Monitoramento digital em fontes públicas. Atividades offline ou em canais privados podem não ser detectadas",
    casosResolvidosRecente: 2
  },
  {
    id: "dados-turbo",
    nome: "Processar Muitos Dados", // Antigo: "Dados Turbo"
    descricao: "Automação de consultas em massa (até 100.000 registros) com cruzamento inteligente.",
    icon: Zap,
    destaque: true,
    caracteristicas: [
      "Até 100.000 registros/hora",
      "Cruzamento em 15+ fontes",
      "Python + Selenium + Pandas",
      "Exportação multi-formato",
      "APIs customizadas disponíveis"
    ],
    preco: "Sob consulta",
    prazo: "Conforme volume",
    idealPara: "Processamento em escala",
    badge: "100K REGISTROS/HORA",
    badgeColor: "yellow",
    beneficioEmocional: "Processamento automatizado em massa (até 100k registros/hora) com cruzamento em 15+ fontes e exportação customizada",
    riscoDeNaoContratar: "Consultas manuais em grande volume são inviáveis, lentas e sujeitas a erros humanos em processos repetitivos",
    casoDeUso: "Processamos 50 mil CPFs em poucas horas para cliente do setor financeiro, identificando restrições e inconsistências cadastrais",
    garantia: "Processamento automatizado com tecnologia própria. Velocidade depende da disponibilidade das fontes de dados consultadas",
    casosResolvidosRecente: 7
  },
  {
    id: "dashboard-forense",
    nome: "Ver Dados em Gráficos", // Antigo: "Dashboard Forense"
    descricao: "Relatórios interativos com Business Intelligence aplicado a investigação.",
    icon: BarChart3,
    caracteristicas: [
      "BI investigativo avançado",
      "Grafos de relacionamento",
      "Timeline interativa de eventos",
      "Exportação multi-formato",
      "Atualização em tempo real"
    ],
    preco: "Sob consulta", //R$ 6.000",
    prazo: "7-10 dias",
    idealPara: "Análise estratégica",
    beneficioEmocional: "Dashboards interativos com BI investigativo, grafos de relacionamento e timeline de eventos para análise visual completa",
    riscoDeNaoContratar: "Dados complexos analisados apenas em planilhas ou PDFs perdem poder analítico e dificultam identificação de padrões",
    casoDeUso: "Dashboard revelou padrão temporal de movimentações financeiras suspeitas que não era visível em relatórios tradicionais",
    garantia: "Dashboard customizado com dados fornecidos. Qualidade da análise depende da completude dos dados disponíveis",
    casosResolvidosRecente: 5
  }
];

// TAB 3: PERÍCIA FORENSE (5 serviços)
const SERVICOS_PERICIA: Servico[] = [
  {
    id: "pericia-forense-validada",
    nome: "Investigação Validada por Perito", // Antigo: "Perícia Forense Validada"
    descricao: "Relatórios executados por Danielle Kaloi e validados por Ibsen Maciel (Perito Criminal Oficial).",
    icon: ShieldCheck,
    destaque: true,
    caracteristicas: [
      "Metodologia forense certificada",
      "Assinado por Perito Criminal Oficial",
      "Conformidade com normas técnicas",
      "Cadeia de custódia documental",
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
    casosResolvidosRecente: 3
  },
  {
    id: "extracao-forense-dispositivos",
    nome: "Extrair Dados de Celular", // Antigo: "Extração Forense de Dispositivos"
    descricao: "Extração legal de dados de celulares/computadores com metodologia CELLEBRITE/XRY.",
    icon: Smartphone,
    destaque: true,
    caracteristicas: [
      "Metodologia CELLEBRITE/XRY/AXIOM",
      "Extração física e lógica",
      "Recuperação de dados deletados",
      "Cadeia de custódia oficial",
      "Validação por Perito Criminal"
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
    casosResolvidosRecente: 2
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
    casosResolvidosRecente: 3
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
    casosResolvidosRecente: 4
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
    casosResolvidosRecente: 6
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
              <DialogDescription className="mt-2 text-base text-slate-600 dark:text-navy-300">
                {service.descricao}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Benefício Emocional - DESTAQUE */}
          {service.beneficioEmocional && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-500/10 dark:to-blue-500/10 border-2 border-green-200 dark:border-green-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">O que você ganha:</h4>
                  <p className="text-slate-700 dark:text-navy-200">{service.beneficioEmocional}</p>
                </div>
              </div>
            </div>
          )}

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
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("investigacao");
  const [selectedService, setSelectedService] = useState<Servico | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["protecao", "investigacao", "pericia"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const getServicesForTab = (tab: string): Servico[] => {
    switch(tab) {
      case "protecao":
        return SERVICOS_PROTECAO;
      case "investigacao":
        return SERVICOS_INVESTIGACAO;
      case "pericia":
        return SERVICOS_PERICIA;
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
        {/* Hero Section - REDESENHADA COM GATILHOS MENTAIS */}
        <section className="relative pt-16 pb-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:from-navy-900 dark:via-navy-900 dark:to-navy-950 overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />

          <div className="container max-w-6xl px-4 relative z-10">
            {/* Badge de Confiança */}
            <div className="flex justify-center mb-4">
              <Badge className="bg-blue-500 text-navy-900 text-sm px-4 py-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Validado por Perito Criminal Oficial
              </Badge>
            </div>

            {/* Headline Emocional */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 text-center leading-tight">
              Descubra a <span className="text-blue-500">Verdade</span> Antes Que<br />
              <span className="text-orange-500">Seja Tarde Demais</span>
            </h1>

            {/* Subtítulo com Prova Social */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-navy-300 max-w-3xl mx-auto mb-8 text-center">
              Combinamos <strong className="text-blue-500">tecnologia de ponta</strong> com
              <strong className="text-slate-900 dark:text-white"> metodologia forense validada</strong>
            </p>
          </div>
        </section>

        {/* Services Tabs */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-3 h-auto p-2 bg-slate-100 dark:bg-navy-900 gap-2">
                <TabsTrigger
                  value="protecao"
                  className="flex flex-col items-center justify-center gap-2 py-4 px-4 text-sm md:text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-navy-950 data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-navy-800 data-[state=inactive]:text-slate-700 dark:data-[state=inactive]:text-navy-300 hover:bg-blue-500 hover:text-navy-950 transition-all"
                >
                  <Shield className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="hidden sm:inline">Proteção & Remoção</span>
                  <span className="sm:hidden">Proteção</span>
                  <span className="text-xs opacity-70 hidden md:block">Emergencial (72h)</span>
                </TabsTrigger>
                <TabsTrigger
                  value="investigacao"
                  className="flex flex-col items-center justify-center gap-2 py-4 px-4 text-sm md:text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-navy-950 data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-navy-800 data-[state=inactive]:text-slate-700 dark:data-[state=inactive]:text-navy-300 hover:bg-blue-500 hover:text-navy-950 transition-all"
                >
                  <Search className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="hidden sm:inline">Investigação & Due Diligence</span>
                  <span className="sm:hidden">Investigação</span>
                  <span className="text-xs opacity-70 hidden md:block">Inteligência + IA</span>
                </TabsTrigger>
                <TabsTrigger
                  value="pericia"
                  className="flex flex-col items-center justify-center gap-2 py-4 px-4 text-sm md:text-base font-semibold data-[state=active]:bg-blue-500 data-[state=active]:text-navy-950 data-[state=inactive]:bg-white dark:data-[state=inactive]:bg-navy-800 data-[state=inactive]:text-slate-700 dark:data-[state=inactive]:text-navy-300 hover:bg-blue-500 hover:text-navy-950 transition-all"
                >
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="hidden sm:inline">Perícia Forense</span>
                  <span className="sm:hidden">Perícia</span>
                  <span className="text-xs opacity-70 hidden md:block">Validado por Perito</span>
                </TabsTrigger>
              </TabsList>

              {["protecao", "investigacao", "pericia"].map(tabValue => (
                <TabsContent key={tabValue} value={tabValue} className="space-y-8">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getServicesForTab(tabValue).map((service) => (
                      <Card
                        key={service.id}
                        className={`relative hover:shadow-xl transition-all cursor-pointer group bg-white dark:bg-navy-900 ${
                          service.destaque
                            ? "border-2 border-blue-500 shadow-lg"
                            : "border border-slate-200 dark:border-navy-800"
                        }`}
                        onClick={() => handleServiceClick(service)}
                      >
                        {service.badge && (
                          <Badge className={`absolute -top-3 left-4 ${
                            service.badgeColor === 'red' ? 'bg-orange-500' :
                            service.badgeColor === 'purple' ? 'bg-purple-500' :
                            service.badgeColor === 'blue' ? 'bg-blue-500' :
                            service.badgeColor === 'orange' ? 'bg-orange-500' :
                            service.badgeColor === 'yellow' ? 'bg-yellow-500' :
                            service.badgeColor === 'gold' ? 'bg-amber-500' :
                            'bg-blue-500'
                          } text-navy-900 font-semibold text-xs px-3 py-1`}>
                            {service.badge}
                          </Badge>
                        )}
                        <CardHeader>
                          <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition-colors">
                              <service.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-lg text-slate-900 dark:text-white">{service.nome}</CardTitle>
                              <CardDescription className="mt-2 text-slate-600 dark:text-navy-300">
                                {service.descricao}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Benefício Emocional */}
                            {service.beneficioEmocional && (
                              <div className="p-3 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                                    {service.beneficioEmocional}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Prova Social - Casos Resolvidos */}
                            {service.casosResolvidosRecente && (
                              <div className="flex items-center gap-2 text-sm">
                                <UserCheck className="w-4 h-4 text-blue-500" />
                                <span className="text-slate-600 dark:text-navy-300">
                                  <strong className="text-blue-500">{service.casosResolvidosRecente} casos</strong> resolvidos nos últimos 7 dias
                                </span>
                              </div>
                            )}

                            <ul className="space-y-2">
                              {service.caracteristicas.slice(0, 3).map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-slate-600 dark:text-navy-300">
                                    {item}
                                  </span>
                                </li>
                              ))}
                            </ul>

                            {service.caracteristicas.length > 3 && (
                              <p className="text-xs text-slate-500 dark:text-navy-400">
                                +{service.caracteristicas.length - 3} benefícios
                              </p>
                            )}

                            {/* Garantia */}
                            {service.garantia && (
                              <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-navy-400 bg-slate-50 dark:bg-navy-800/50 p-2 rounded">
                                <Shield className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{service.garantia}</span>
                              </div>
                            )}

                            <div className="pt-4 border-t border-slate-200 dark:border-navy-800">
                              <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                  {service.preco && (
                                    <Badge variant="outline" className="text-blue-500 border-blue-500/50 text-sm font-semibold">
                                      {service.preco}
                                    </Badge>
                                  )}
                                  {service.prazo && (
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-navy-400">
                                      <Clock className="w-3 h-3" />
                                      {service.prazo}
                                    </div>
                                  )}
                                </div>
                                <Button size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-navy-900 font-semibold">
                                  Ver Detalhes Completos <ArrowRight className="w-3 h-3 ml-1" />
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

        {/* Diferencial Section */}
        <section className="py-12 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-navy-800 dark:to-navy-900">
          <div className="container max-w-6xl px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-slate-900 dark:text-white space-y-4">
                <h2 className="text-2xl font-bold">Tecnologia + Perícia Forense</h2>
                <p className="text-slate-700 dark:text-navy-200">
                  Combinação única no Brasil: <strong className="text-blue-400">Danielle Kaloi</strong> (Analista de Dados, 13 certificações em IA/ML) +
                  <strong className="text-blue-400"> Ibsen Maciel</strong> (Perito Criminal Oficial, 1º lugar PCE-PA 2019, Diretor Nacional ANPAJ).
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">100k+ Registros/hora</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">1600+ Fontes OSINT</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Validade Judicial</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Metodologia Forense</Badge>
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
                  <p className="text-slate-900 dark:text-white font-semibold group-hover:text-blue-400 transition-colors text-sm">Dani Kaloi</p>
                  <p className="text-blue-400 text-xs">Analista de Dados</p>
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
                  <p className="text-slate-900 dark:text-white font-semibold group-hover:text-blue-400 transition-colors text-sm">Ibsen Maciel</p>
                  <p className="text-blue-400 text-xs">Perito Criminal</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-navy-800 dark:via-navy-900 dark:to-navy-950">
          <div className="container max-w-4xl px-4 text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Precisa de investigação profissional?
            </h2>
            <p className="text-lg text-slate-700 dark:text-navy-200">
              Folhas de pagamento, funcionários, fornecedores, sócios, divórcios...
              <br />Processamos qualquer volume com precisão e velocidade.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pb-4">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Empresas</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Famílias</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Advogados</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Investidores</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/contato">
                <Button size="lg" className="bg-blue-500 text-navy-900 hover:bg-blue-600 font-semibold h-12 px-8">
                  Solicitar Orçamento
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-blue-500/50 text-blue-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 h-12 px-8">
                  <Phone className="mr-2 w-5 h-5" />
                  Falar com Especialista
                </Button>
              </a>
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
