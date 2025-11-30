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
    id: "protecao-total-familia",
    nome: "Proteção Total da Família",
    descricao: "Proteção 360° da família contra riscos físicos, digitais e sociais. Programa completo para famílias de alto patrimônio.",
    icon: Shield,
    destaque: true,
    caracteristicas: [
      "Auditoria de vulnerabilidades da rotina familiar",
      "Mapeamento de exposição digital de todos os membros",
      "Monitoramento 24/7 de ameaças e alertas",
      "Plano de crise e evacuação de emergência",
      "Verificação contínua de funcionários domésticos",
      "Inteligência preventiva + relatórios mensais"
    ],
    formato: "Mensal (R$ 14.997) ou Anual (R$ 149.997)",
    preco: "R$ 14.997/mês",
    idealPara: "Famílias que valorizam segurança e privacidade",
    detalhes: {
      oqueFazemos: [
        "Análise completa da rotina familiar identificando pontos de vulnerabilidade",
        "Mapeamento de toda a exposição digital da família nas redes sociais",
        "Verificação de background de todas as pessoas com acesso à família (domésticas, motorista, personal)",
        "Monitoramento contínuo de ameaças com alertas em tempo real via app",
        "Criação de protocolos de segurança e evacuação personalizados"
      ],
      comoFunciona: [
        "Reunião inicial para entender a dinâmica e rotina familiar (2h)",
        "Auditoria presencial e digital completa (7-14 dias)",
        "Entrega do relatório com vulnerabilidades e plano de ação",
        "Implementação do plano de proteção com treinamento da família",
        "Acompanhamento mensal com relatórios e atualizações contínuas"
      ],
      entregaveis: [
        "Relatório de Vulnerabilidades (50+ páginas)",
        "Plano de Proteção Familiar personalizado",
        "Manual de Crise com protocolos de emergência",
        "Dashboard de monitoramento (acesso 24/7)",
        "Linha direta exclusiva com especialista"
      ],
      prazo: "Implementação em 14 dias, proteção contínua mensal",
      casos: [
        "Família de empresário protegida após identificação de exposição por funcionário",
        "Proteção de adolescentes contra predadores online identificados"
      ]
    }
  },
  {
    id: "verificacao-pessoas-casa",
    nome: "Verificação das Pessoas da Casa",
    descricao: "Checagem completa de todos que trabalham ou convivem na residência. Domésticas, motorista, personal, jardineiro.",
    icon: Users,
    preco: "R$ 997/pessoa ou R$ 3.997 (pacote 5 pessoas)",
    caracteristicas: [
      "Antecedentes criminais em todos os estados + federal",
      "Análise de dívidas, protestos e restrições",
      "Histórico profissional e empregos anteriores",
      "Verificação real de referências via ligação",
      "Análise de redes sociais e comportamento"
    ],
    formato: "Por pessoa (R$ 997) ou Pacote 5 pessoas (R$ 3.997)",
    detalhes: {
      oqueFazemos: [
        "Verificação de antecedentes criminais em todas as esferas (estadual e federal)",
        "Análise financeira completa (dívidas, protestos, restrições de crédito)",
        "Checagem de processos judiciais (trabalhistas, cíveis, criminais)",
        "Verificação real de referências com empregadores anteriores via ligação",
        "Análise de redes sociais e comportamento digital"
      ],
      comoFunciona: [
        "Coleta de CPF e dados básicos da pessoa a ser verificada",
        "Pesquisa em mais de 50 bases de dados públicas e privadas",
        "Ligações discretas para 2-3 referências de empregos anteriores",
        "Análise comportamental baseada em padrões de risco",
        "Entrega de relatório com score de confiabilidade"
      ],
      entregaveis: [
        "Relatório Individual completo por pessoa",
        "Score de Confiabilidade (0-100)",
        "Lista de Red Flags encontrados",
        "Histórico de empregos verificado",
        "Recomendação final: Contratar / Não Contratar / Com Ressalvas"
      ],
      prazo: "3-5 dias úteis por pessoa"
    }
  },
  {
    id: "protecao-digital-familia",
    nome: "Proteção Digital da Família",
    descricao: "Blindagem completa contra riscos online. Monitoramento de exposição, predadores, cyberbullying e vazamentos.",
    icon: Shield,
    preco: "R$ 7.997 (auditoria única) ou R$ 2.997/mês (monitoramento)",
    caracteristicas: [
      "Auditoria de 20 anos de histórico digital",
      "Monitoramento de exposição em redes sociais",
      "Alertas de predadores, cyberbullying e sextortion",
      "Detecção de vazamentos na dark web",
      "Plano de limpeza e remoção de dados sensíveis"
    ],
    formato: "Auditoria única (R$ 7.997) ou Mensal (R$ 2.997)",
    detalhes: {
      oqueFazemos: [
        "Auditoria de 20 anos de histórico digital (posts deletados, archive.org)",
        "Monitoramento de todas as redes sociais da família",
        "Detecção de perfis falsos e contatos suspeitos",
        "Alertas de vazamento de dados na dark web",
        "Remoção de informações sensíveis expostas online"
      ],
      comoFunciona: [
        "Auditoria inicial de presença digital de cada membro (48-72h)",
        "Mapeamento de vulnerabilidades e exposições",
        "Configuração de alertas personalizados por tipo de ameaça",
        "Monitoramento contínuo 24/7 com relatórios semanais",
        "Ações imediatas de contenção quando detectada ameaça"
      ],
      entregaveis: [
        "Relatório de Exposição Digital (30+ páginas)",
        "Dashboard de Monitoramento Familiar",
        "Alertas em tempo real via WhatsApp e app",
        "Plano de Limpeza Digital com priorização",
        "Guia de Segurança Digital para toda família"
      ],
      prazo: "Auditoria em 5-7 dias, setup de monitoramento em 48h"
    }
  },
  {
    id: "protecao-digital-filhos",
    nome: "Proteção Digital dos Filhos",
    descricao: "Monitoramento individual de adolescentes. Instagram, TikTok, WhatsApp, Discord. Proteção contra predadores e cyberbullying.",
    icon: Users,
    preco: "R$ 2.997/mês por filho",
    caracteristicas: [
      "Monitoramento de Instagram, TikTok, WhatsApp, Discord",
      "Detecção de contatos suspeitos e predadores",
      "Alertas de cyberbullying e sextortion",
      "Análise de padrões de comportamento",
      "Relatórios mensais para os pais"
    ],
    formato: "Mensal por adolescente (R$ 2.997)",
    detalhes: {
      oqueFazemos: [
        "Monitoramento discreto das principais redes sociais do adolescente",
        "Análise de padrões de comportamento e mudanças de rotina",
        "Identificação de contatos potencialmente perigosos via IA",
        "Detecção de sinais de cyberbullying, assédio ou sextortion",
        "Verificação de exposição a conteúdo inadequado ou grupos de risco"
      ],
      comoFunciona: [
        "Reunião inicial com os pais para entender preocupações específicas",
        "Mapeamento de todas as redes e aplicativos utilizados pelo adolescente",
        "Configuração de monitoramento respeitando privacidade adequada",
        "Alertas em tempo real configurados conforme perfil de risco",
        "Relatórios mensais detalhados para os pais com orientações"
      ],
      entregaveis: [
        "Dashboard de Monitoramento individual",
        "Relatório Mensal de Atividade Digital",
        "Alertas em tempo real de comportamento de risco",
        "Verificação de novos contatos com score de risco",
        "Guia de orientação para conversa com o filho (se necessário)"
      ],
      prazo: "Setup em 24h, monitoramento contínuo"
    }
  },
  {
    id: "checagem-funcionarios",
    nome: "Checagem de Funcionários Domésticos",
    descricao: "Verificação pré-contratação completa. Antecedentes, referências reais, histórico de processos trabalhistas.",
    icon: Search,
    preco: "R$ 697/pessoa (prestadores) ou R$ 997/pessoa (domésticos fixos)",
    caracteristicas: [
      "Antecedentes criminais em 27 estados + federal",
      "Análise de dívidas e restrições financeiras",
      "Verificação de processos trabalhistas anteriores",
      "Checagem real de referências via ligação",
      "Análise de redes sociais e comportamento"
    ],
    formato: "Por funcionário (R$ 697 a R$ 997)",
    detalhes: {
      oqueFazemos: [
        "Verificação de antecedentes criminais em todos os 27 estados + federal",
        "Análise de situação financeira (dívidas, protestos, SPC/Serasa)",
        "Checagem de histórico de processos trabalhistas anteriores",
        "Verificação real de 2-3 referências com empregadores anteriores",
        "Análise de redes sociais e identificação de comportamentos de risco"
      ],
      comoFunciona: [
        "Coleta de CPF, RG e autorização do candidato",
        "Pesquisa em bases de dados públicas e privadas especializadas",
        "Ligações discretas para referências de empregos anteriores",
        "Análise cruzada de padrões e identificação de red flags",
        "Entrega de relatório com recomendação clara"
      ],
      entregaveis: [
        "Relatório Completo de Background Check",
        "Score de Confiabilidade (0-100)",
        "Histórico de empregos verificado com feedback real",
        "Lista de alertas e red flags identificados",
        "Recomendação: Contratar / Não Contratar / Com Ressalvas"
      ],
      prazo: "24h (express) ou 3-5 dias úteis (standard)"
    }
  },
  {
    id: "avaliacao-seguranca-casa",
    nome: "Avaliação de Segurança da Casa",
    descricao: "Auditoria presencial 360° de vulnerabilidades. Rotas, acessos, funcionários, exposição involuntária.",
    icon: Home,
    preco: "R$ 9.997 (residência) ou R$ 14.997 (residência + casa de praia)",
    caracteristicas: [
      "Análise de todos os pontos de acesso",
      "Mapeamento de rotas e horários da família",
      "Verificação de prestadores e visitantes",
      "Detecção de exposição involuntária",
      "Plano de reforço de segurança com orçamento"
    ],
    formato: "Única vez (R$ 9.997)",
    detalhes: {
      oqueFazemos: [
        "Análise presencial de todos os pontos de acesso à residência",
        "Mapeamento detalhado de rotas, horários e padrões da família",
        "Verificação de todos os prestadores de serviço com acesso",
        "Análise de exposição involuntária (lixo, correspondência, entregas)",
        "Avaliação técnica de sistemas de segurança existentes"
      ],
      comoFunciona: [
        "Visita técnica presencial à residência (4-6 horas)",
        "Entrevistas discretas com todos os moradores",
        "Análise de documentação, contratos e acessos",
        "Teste de vulnerabilidades físicas e digitais",
        "Entrega de relatório completo com plano de ação priorizado"
      ],
      entregaveis: [
        "Relatório de Vulnerabilidades (30+ páginas)",
        "Mapa de Riscos da Residência ilustrado",
        "Plano de Reforço de Segurança priorizado",
        "Lista de Recomendações com urgência",
        "Orçamento estimado para implementação das melhorias"
      ],
      prazo: "7-10 dias úteis após visita presencial"
    }
  },
  {
    id: "verificacao-relacionamentos",
    nome: "Verificação de Relacionamentos",
    descricao: "Investigação discreta de cônjuge, namorado(a) dos filhos ou pessoas próximas. Proteção patrimonial e emocional.",
    icon: Users,
    preco: "R$ 4.997 (namorado dos filhos) a R$ 9.997 (conjugal completa)",
    caracteristicas: [
      "Verificação de histórico pessoal e familiar",
      "Análise de situação financeira e patrimonial",
      "Checagem de relacionamentos anteriores",
      "Verificação discreta de rotinas e padrões",
      "Análise de redes sociais e comportamento"
    ],
    formato: "Por investigação (R$ 4.997 a R$ 9.997)",
    detalhes: {
      oqueFazemos: [
        "Verificação completa de histórico pessoal e familiar da pessoa",
        "Análise de situação financeira (dívidas, patrimônio, capacidade)",
        "Checagem de relacionamentos e separações anteriores",
        "Verificação de antecedentes criminais e processos judiciais",
        "Análise profunda de redes sociais e padrões de comportamento"
      ],
      comoFunciona: [
        "Briefing 100% confidencial com o cliente (presencial ou videocall)",
        "Pesquisa discreta em múltiplas fontes públicas e privadas",
        "Análise de padrões comportamentais e rotinas",
        "Verificação de compatibilidade das informações declaradas",
        "Entrega de dossiê sigiloso com conclusões claras"
      ],
      entregaveis: [
        "Dossiê Confidencial completo (20+ páginas)",
        "Análise de compatibilidade de informações declaradas vs. reais",
        "Lista de Red Flags e alertas identificados",
        "Análise patrimonial e financeira",
        "Recomendações de precaução ou próximos passos"
      ],
      prazo: "5-10 dias úteis (standard) ou 48h (express +100%)"
    }
  },
  {
    id: "auditoria-trabalhista-casa",
    nome: "Auditoria Trabalhista Doméstica",
    descricao: "Prevenção de processos trabalhistas milionários. Análise de contratos, conformidade legal, estratégia de desligamento.",
    icon: FileSearch,
    preco: "R$ 4.997 (até 5 funcionários) ou R$ 2.997/desligamento",
    caracteristicas: [
      "Revisão de todos os contratos de trabalho",
      "Verificação de conformidade com legislação vigente",
      "Análise de histórico de processos dos funcionários",
      "Identificação de vulnerabilidades trabalhistas",
      "Estratégia de desligamento seguro"
    ],
    formato: "Por auditoria (R$ 4.997) ou Desligamento (R$ 2.997)",
    detalhes: {
      oqueFazemos: [
        "Revisão completa de todos os contratos de trabalho doméstico",
        "Verificação de conformidade com legislação trabalhista vigente",
        "Pesquisa de histórico de processos trabalhistas dos funcionários",
        "Identificação de vulnerabilidades e riscos de passivos",
        "Orientação jurídica para regularização ou desligamento"
      ],
      comoFunciona: [
        "Coleta de toda a documentação trabalhista existente",
        "Análise jurídica por advogado trabalhista especializado",
        "Pesquisa de histórico judicial de cada funcionário",
        "Identificação de vulnerabilidades com matriz de risco",
        "Entrega de plano de regularização ou desligamento seguro"
      ],
      entregaveis: [
        "Relatório de Conformidade Trabalhista",
        "Matriz de Riscos por funcionário com valores estimados",
        "Plano de Regularização com cronograma",
        "Guia de Boas Práticas para empregador doméstico",
        "Estratégia de Desligamento Seguro (se aplicável)"
      ],
      prazo: "10-15 dias úteis"
    }
  },
  {
    id: "atendimento-emergencia",
    nome: "Atendimento de Emergência 24h",
    descricao: "Linha direta 24/7 para crises. Resposta em 15 minutos. Gestão de crises, coordenação com autoridades.",
    icon: Phone,
    preco: "R$ 7.997/ano (preventivo) ou R$ 14.997 (emergencial imediato)",
    caracteristicas: [
      "Linha direta exclusiva 24/7",
      "Resposta garantida em até 15 minutos",
      "Gestão de crise com especialistas",
      "Coordenação com autoridades e segurança",
      "Contenção de crises digitais e físicas"
    ],
    formato: "Anual (R$ 7.997) ou Emergencial (R$ 14.997)",
    detalhes: {
      oqueFazemos: [
        "Disponibilização de linha direta exclusiva 24/7",
        "Resposta imediata a incidentes de segurança (até 15 min)",
        "Coordenação com forças de segurança e autoridades",
        "Contenção de crises digitais (vazamentos, exposição, difamação)",
        "Gestão profissional de comunicação em situações críticas"
      ],
      comoFunciona: [
        "Contrato anual de atendimento prioritário",
        "Cadastro de todos os membros da família com foto e dados",
        "Criação de protocolos de emergência personalizados",
        "Acionamento via telefone, WhatsApp ou botão de pânico no app",
        "Resposta garantida em até 15 minutos com especialista"
      ],
      entregaveis: [
        "Linha Direta Exclusiva 24/7 com especialista",
        "App de Emergência com botão de pânico",
        "Protocolos de Crise personalizados para cada cenário",
        "Coordenação com empresa de segurança privada",
        "Relatório detalhado pós-incidente"
      ],
      prazo: "Ativação em 24h após contratação"
    }
  }
];

const SERVICOS_EMPRESARIAIS: Servico[] = [
  {
    id: "protecao-completa-empresa",
    nome: "Proteção Completa da Empresa",
    descricao: "Programa anual de proteção corporativa. Contrainteligência, prevenção de vazamentos, verificação de funcionários-chave.",
    icon: Building2,
    destaque: true,
    preco: "PME: R$ 29.997/mês | Média: R$ 49.997/mês | Enterprise: R$ 99.997/mês",
    caracteristicas: [
      "Programa de contrainteligência empresarial",
      "Prevenção e detecção de vazamentos",
      "Monitoramento de riscos internos 24/7",
      "Verificação contínua de funcionários-chave",
      "Análise de ameaças competitivas",
      "Gestão de crise corporativa"
    ],
    formato: "Mensal (a partir de R$ 29.997)",
    idealPara: "Holdings, empresas médias e grandes",
    detalhes: {
      oqueFazemos: [
        "Implementação de programa de contrainteligência corporativa",
        "Monitoramento contínuo de vazamentos de informação confidencial",
        "Verificação periódica de funcionários em posições estratégicas",
        "Análise de ameaças competitivas e tentativas de espionagem",
        "Gestão profissional de crises corporativas"
      ],
      comoFunciona: [
        "Diagnóstico inicial de segurança corporativa (15-30 dias)",
        "Implementação de protocolos e ferramentas de proteção",
        "Treinamento de equipes em segurança da informação",
        "Monitoramento contínuo com relatórios mensais",
        "Ações corretivas imediatas quando detectada ameaça"
      ],
      entregaveis: [
        "Diagnóstico de Segurança Corporativa (50+ páginas)",
        "Programa de Contrainteligência personalizado",
        "Dashboard de Monitoramento em tempo real",
        "Relatórios Mensais de status e incidentes",
        "Suporte prioritário 24/7 com SLA de 1h"
      ],
      prazo: "Implementação em 30 dias, proteção contínua"
    }
  },
  {
    id: "investigacao-compra-empresa",
    nome: "Due Diligence para M&A",
    descricao: "Investigação profunda para aquisições, fusões ou JVs. Padrão internacional de verificação.",
    icon: FileSearch,
    preco: "R$ 99.997 (até R$ 10M) | R$ 199.997 (R$ 10M-50M) | 0,3% acima de R$ 50M",
    caracteristicas: [
      "Due diligence completa da empresa-alvo",
      "Investigação de todos os sócios e executivos",
      "Levantamento de passivos ocultos e contingências",
      "Análise de histórico societário completo",
      "Apresentação board-ready + recomendações"
    ],
    formato: "Por projeto (a partir de R$ 99.997)",
    detalhes: {
      oqueFazemos: [
        "Due diligence investigativa completa da empresa-alvo",
        "Investigação de background de todos os sócios e executivos-chave",
        "Levantamento de passivos ocultos, contingências e riscos não declarados",
        "Análise de histórico societário, alterações e movimentações suspeitas",
        "Projeção de riscos futuros baseada em padrões identificados"
      ],
      comoFunciona: [
        "Kick-off call com briefing sobre a transação pretendida",
        "Coleta de documentação e acesso ao data room (se disponível)",
        "Investigação em múltiplas frentes simultâneas (15-30 dias)",
        "Análise cruzada de informações com identificação de inconsistências",
        "Apresentação executiva para o board com recomendações"
      ],
      entregaveis: [
        "Relatório de Due Diligence Investigativa (100+ páginas)",
        "Matriz de Riscos da Transação com valores estimados",
        "Dossiê individual de cada sócio e executivo-chave",
        "Apresentação executiva para o board (20 slides)",
        "Recomendações de negociação e ajuste de valuation"
      ],
      prazo: "15-30 dias úteis (JV: 10 dias | Parceria: 7 dias)"
    }
  },
  {
    id: "protecao-ataques-vazamentos",
    nome: "Proteção Contra Espionagem e Vazamentos",
    descricao: "Detecção de espiões internos, vazamentos de informação, ameaças de concorrentes e ex-funcionários.",
    icon: Shield,
    preco: "R$ 19.997/mês (setup inicial: R$ 29.997)",
    caracteristicas: [
      "Detecção de espiões e informantes internos",
      "Monitoramento de vazamentos de informação",
      "Varreduras digitais mensais",
      "Proteção de dados de executivos",
      "Planos de contingência e resposta"
    ],
    formato: "Mensal (R$ 19.997) + Setup (R$ 29.997)",
    detalhes: {
      oqueFazemos: [
        "Monitoramento contínuo de vazamentos de informação confidencial",
        "Detecção de comportamentos suspeitos e anômalos internos",
        "Varreduras digitais mensais em sistemas e comunicações",
        "Proteção de informações sensíveis de executivos",
        "Investigação imediata de incidentes detectados"
      ],
      comoFunciona: [
        "Avaliação inicial de vulnerabilidades e gaps de segurança",
        "Implementação de ferramentas de monitoramento",
        "Varreduras mensais com relatório de achados",
        "Alertas em tempo real quando detectada anomalia",
        "Investigação profunda de incidentes com relatório forense"
      ],
      entregaveis: [
        "Relatório Mensal de Segurança da Informação",
        "Dashboard de Alertas de Vazamento",
        "Relatórios de Investigação de Incidentes",
        "Recomendações de Melhoria e Hardening",
        "Plano de Contingência atualizado"
      ],
      prazo: "Setup em 7 dias, proteção contínua"
    }
  },
  {
    id: "checagem-funcionarios-diretores",
    nome: "Background Check Corporativo",
    descricao: "Verificação pré-contratação em 3 níveis. Operacional, Gerencial e Executivo (C-Level).",
    icon: Users,
    preco: "Level 1: R$ 497 | Level 2: R$ 1.997 | Level 3: R$ 9.997",
    caracteristicas: [
      "Level 1 – Operacional (criminal + referências)",
      "Level 2 – Gerencial (completo + financeiro + digital)",
      "Level 3 – Executivo (full + internacional + psicológico)",
      "Pacotes empresariais com desconto"
    ],
    formato: "Por pessoa (R$ 497 a R$ 9.997)",
    detalhes: {
      oqueFazemos: [
        "Level 1: Antecedentes criminais + referências básicas (assistentes, júniors)",
        "Level 2: Criminal completo + financeiro + digital + referências detalhadas (gerentes)",
        "Level 3: Full investigation + internacional + análise psicológica (C-Level, diretores)",
        "Verificação de conflitos de interesse em todas as empresas",
        "Análise de redes de relacionamento e conexões suspeitas"
      ],
      comoFunciona: [
        "Definição do nível de checagem adequado ao cargo",
        "Coleta de dados, documentos e autorizações do candidato",
        "Pesquisa em bases públicas e privadas especializadas",
        "Verificação de referências profissionais (2-5 conforme nível)",
        "Entrega de relatório classificado com recomendação"
      ],
      entregaveis: [
        "Relatório de Background Check adequado ao nível",
        "Score de Integridade e Confiabilidade (0-100)",
        "Análise de Conflitos de Interesse",
        "Lista de Red Flags identificados",
        "Recomendação: Contratar / Não Contratar / Com Ressalvas"
      ],
      prazo: "Level 1: 3 dias | Level 2: 5-7 dias | Level 3: 10-15 dias"
    }
  },
  {
    id: "protecao-imagem-empresa",
    nome: "Gestão de Reputação Corporativa",
    descricao: "Monitoramento 24/7 de marca e executivos. Detecção de ataques, remoção de conteúdo, inteligência competitiva.",
    icon: Shield,
    preco: "R$ 14.997/mês (marca) + R$ 9.997/mês por executivo",
    caracteristicas: [
      "Monitoramento 24/7 de menções à marca",
      "Proteção de reputação de executivos",
      "Inteligência competitiva em tempo real",
      "Remoção de conteúdo difamatório",
      "Alertas e gestão de crises"
    ],
    formato: "Mensal (R$ 14.997 + R$ 9.997/executivo)",
    detalhes: {
      oqueFazemos: [
        "Monitoramento 24/7 de todas as menções à marca online",
        "Acompanhamento de reputação individual de executivos-chave",
        "Detecção precoce de ataques reputacionais e fake news",
        "Remoção de conteúdo difamatório e negativo",
        "Gestão profissional de crises de imagem"
      ],
      comoFunciona: [
        "Setup de monitoramento com palavras-chave e alertas",
        "Definição de gatilhos de alerta por tipo e severidade",
        "Monitoramento contínuo com dashboard em tempo real",
        "Ações imediatas de contenção quando detectada ameaça",
        "Relatórios semanais com análise de sentimento"
      ],
      entregaveis: [
        "Dashboard de Reputação em tempo real",
        "Alertas instantâneos via WhatsApp e email",
        "Relatórios Semanais de Menções e Sentimento",
        "Ações de Contenção documentadas",
        "Relatório de Inteligência Competitiva mensal"
      ],
      prazo: "Setup em 48h, monitoramento contínuo"
    }
  },
  {
    id: "auditoria-trabalhista-empresa",
    nome: "Auditoria de Riscos Trabalhistas",
    descricao: "Prevenção de passivos milionários. Análise de contratos, histórico de processos, compliance trabalhista.",
    icon: FileSearch,
    preco: "R$ 49.997 (até 50 funcionários) | R$ 19.997 por investigação de denúncia",
    caracteristicas: [
      "Histórico de processos de colaboradores-chave",
      "Identificação de padrões de litígio",
      "Auditoria completa de contratos",
      "Análise de práticas de risco",
      "Plano de mitigação com valores"
    ],
    formato: "Por projeto (R$ 49.997 até 50 func.)",
    detalhes: {
      oqueFazemos: [
        "Análise de histórico trabalhista de colaboradores-chave",
        "Identificação de padrões de litígio e colaboradores litigiosos",
        "Auditoria completa de contratos de trabalho e práticas",
        "Análise de riscos de passivo trabalhista com valores estimados",
        "Recomendações de mitigação priorizadas por valor de risco"
      ],
      comoFunciona: [
        "Levantamento de toda a documentação trabalhista da empresa",
        "Pesquisa de histórico de processos de cada colaborador",
        "Análise de contratos, políticas e práticas de RH",
        "Identificação de vulnerabilidades com matriz de risco",
        "Entrega de plano de ação para mitigação"
      ],
      entregaveis: [
        "Relatório de Riscos Trabalhistas (50+ páginas)",
        "Matriz de Vulnerabilidades por colaborador e valor",
        "Plano de Mitigação priorizado",
        "Recomendações de Compliance Trabalhista",
        "Estratégia de Desligamento Seguro (se aplicável)"
      ],
      prazo: "15-30 dias úteis"
    }
  },
  {
    id: "verificacao-riscos-familiares-executivos",
    nome: "Análise de Riscos Pessoais de Executivos",
    descricao: "Divórcio pode mudar estrutura societária. Análise de estabilidade conjugal e riscos pessoais de C-Level.",
    icon: Users,
    preco: "R$ 19.997/executivo | R$ 29.997 (M&A - verificação de founders)",
    caracteristicas: [
      "Análise de estabilidade conjugal",
      "Verificação de regime de bens",
      "Implicações societárias de crises pessoais",
      "Verificação de exposição patrimonial",
      "Riscos de distração e decisões emocionais"
    ],
    formato: "Por executivo (R$ 19.997)",
    detalhes: {
      oqueFazemos: [
        "Análise de situação conjugal de executivos-chave",
        "Verificação de regime de bens e implicações em caso de divórcio",
        "Análise de riscos de crises pessoais afetarem a empresa",
        "Verificação de exposição patrimonial e dívidas pessoais",
        "Avaliação de risco de distração e decisões emocionais"
      ],
      comoFunciona: [
        "Briefing confidencial sobre a situação do executivo",
        "Pesquisa discreta em cartórios e registros públicos",
        "Análise de implicações societárias em diferentes cenários",
        "Avaliação de riscos com score de probabilidade",
        "Recomendações de blindagem patrimonial"
      ],
      entregaveis: [
        "Relatório de Riscos Pessoais do Executivo",
        "Análise de Implicações Societárias",
        "Cenários de Risco e Probabilidades",
        "Recomendações de Proteção e Blindagem"
      ],
      prazo: "7-14 dias úteis"
    }
  },
  {
    id: "blindagem-socio",
    nome: "Blindagem do Sócio",
    descricao: "Proteção quando sócio descobre fraude ou entra em conflito. Dossiê defensivo, proteção reputacional, coordenação jurídica.",
    icon: Shield,
    preco: "R$ 14.997 (preventivo) | R$ 29.997 (emergencial/conflito ativo)",
    caracteristicas: [
      "Dossiê defensivo completo",
      "Estratégia de proteção reputacional",
      "Coordenação com assessoria jurídica",
      "Monitoramento de ataques",
      "Gestão de crise em tempo real"
    ],
    formato: "Por projeto (R$ 14.997 a R$ 29.997)",
    detalhes: {
      oqueFazemos: [
        "Criação de dossiê defensivo completo com evidências",
        "Desenvolvimento de estratégia de proteção reputacional",
        "Coordenação com assessoria jurídica para ações legais",
        "Monitoramento e contenção de ataques online e offline",
        "Gestão profissional de crise em tempo real"
      ],
      comoFunciona: [
        "Análise emergencial da situação e conflito",
        "Coleta de toda documentação defensiva disponível",
        "Desenvolvimento de estratégia de proteção multi-frente",
        "Implementação de monitoramento e ações de contenção",
        "Acompanhamento contínuo até resolução do conflito"
      ],
      entregaveis: [
        "Dossiê Defensivo completo com evidências",
        "Estratégia de Proteção documentada",
        "Plano de Comunicação de Crise",
        "Dashboard de Monitoramento de Ataques",
        "Relatórios de acompanhamento do caso"
      ],
      prazo: "Ações emergenciais em 24h, projeto completo em 7 dias"
    }
  },
  {
    id: "raio-x-cnpj",
    nome: "Corporate Skeleton Scanner",
    descricao: "Rastreamento de TODAS as empresas de um CPF/CNPJ. Sócios ocultos, laranjas, dívidas fiscais e trabalhistas, falências.",
    icon: Search,
    preco: "R$ 4.997 (standard 7 dias) | R$ 7.997 (express 48h) | R$ 14.997 (urgente 24h)",
    caracteristicas: [
      "Rastreamento de todas as empresas (até as esquecidas)",
      "Identificação de sócios ocultos e laranjas",
      "Levantamento de dívidas fiscais e trabalhistas",
      "Mapeamento de falências não declaradas",
      "Mapa societário completo"
    ],
    formato: "Por investigação (R$ 4.997 a R$ 14.997)",
    detalhes: {
      oqueFazemos: [
        "Rastreamento de TODAS as empresas vinculadas ao CPF/CNPJ (até as esquecidas)",
        "Identificação de sócios ocultos, laranjas e estruturas de blindagem",
        "Levantamento completo de dívidas fiscais e trabalhistas",
        "Mapeamento de falências, recuperações judiciais e processos",
        "Análise de relacionamentos empresariais e conexões suspeitas"
      ],
      comoFunciona: [
        "Identificação do CPF ou CNPJ a ser investigado",
        "Pesquisa em mais de 50 bases de dados públicas e privadas",
        "Análise cruzada de informações e identificação de inconsistências",
        "Identificação de red flags e padrões de fraude",
        "Entrega de relatório completo com mapa societário"
      ],
      entregaveis: [
        "Relatório Raio-X completo (50+ páginas)",
        "Mapa Societário visual de todas as empresas",
        "Lista completa de Processos, Dívidas e Protestos",
        "Análise de Red Flags com score de risco",
        "Recomendação Go/No-Go documentada"
      ],
      prazo: "7 dias (standard) | 48h (express) | 24h (urgente)"
    }
  },
  {
    id: "analise-trabalhista-lider",
    nome: "Labor Risk Analyzer",
    descricao: "Founder/líder que explora funcionário, explora investidor. Histórico de processos trabalhistas e padrões de violação.",
    icon: FileSearch,
    preco: "R$ 1.497 (básica) | R$ 2.997 (profunda com empresas anteriores)",
    caracteristicas: [
      "Histórico de todos os processos trabalhistas",
      "Identificação de padrões de violação",
      "Verificação de casos de assédio moral/sexual",
      "Análise de empresas anteriores",
      "Projeção de riscos futuros"
    ],
    formato: "Por análise (R$ 1.497 a R$ 2.997)",
    detalhes: {
      oqueFazemos: [
        "Levantamento de todos os processos trabalhistas do líder",
        "Identificação de padrões de violação (serial offender?)",
        "Verificação de alegações de assédio moral e sexual",
        "Análise de histórico em todas as empresas anteriores",
        "Projeção de riscos futuros baseada em padrões"
      ],
      comoFunciona: [
        "Identificação do líder/founder a ser analisado",
        "Pesquisa de histórico processual em todas as varas trabalhistas",
        "Análise de padrões de alegações e valores",
        "Verificação de empresas anteriores e ex-sócios",
        "Entrega de relatório com red flags e recomendações"
      ],
      entregaveis: [
        "Relatório de Histórico Trabalhista completo",
        "Análise de Padrões de Violação",
        "Score de Risco Trabalhista (0-100)",
        "Projeção de Passivos Futuros",
        "Recomendação documentada"
      ],
      prazo: "5-7 dias úteis"
    }
  },
  {
    id: "busca-socios-escondidos",
    nome: "Phantom Partner Finder",
    descricao: "Localiza co-founders que sumiram, sócios ocultos com direitos pendentes. Ex-sócio pode aparecer no IPO querendo milhões.",
    icon: Search,
    preco: "R$ 3.997 (nacional) | R$ 9.997 (internacional)",
    caracteristicas: [
      "Localização de ex-sócios e co-founders",
      "Verificação de direitos pendentes",
      "Análise de risco de retorno",
      "Documentação de acordos existentes",
      "Suporte para resolução"
    ],
    formato: "Por busca (R$ 3.997 a R$ 9.997)",
    detalhes: {
      oqueFazemos: [
        "Localização de ex-sócios e co-founders desaparecidos",
        "Verificação de direitos pendentes e participações veladas",
        "Análise de risco de retorno à sociedade ou processo",
        "Levantamento de patrimônio atual da pessoa",
        "Documentação completa para acordos ou ações judiciais"
      ],
      comoFunciona: [
        "Briefing sobre a pessoa procurada e histórico da relação",
        "Pesquisa em bases nacionais e internacionais",
        "Investigação de campo quando necessário",
        "Verificação de paradeiro atual e situação financeira",
        "Documentação dos achados para uso jurídico"
      ],
      entregaveis: [
        "Relatório de Localização completo",
        "Endereços, contatos e situação atual",
        "Análise de patrimônio e capacidade financeira",
        "Análise de Riscos de litígio",
        "Recomendações para acordo ou ação judicial"
      ],
      prazo: "7-15 dias (nacional) | 15-21 dias (internacional)"
    }
  },
  {
    id: "verificacao-parceiros-fornecedores",
    nome: "Verificação de Fornecedores",
    descricao: "Due diligence pré-contrato. Saúde financeira, capacidade de entrega, histórico de litígios. Prevenção de fraudes de R$ 184k (média).",
    icon: Users,
    preco: "R$ 3.500 (básica) | R$ 6.000 (completa com referências)",
    caracteristicas: [
      "Análise de saúde financeira",
      "Verificação de litígios e processos",
      "Checagem de capacidade de entrega",
      "Referências comerciais verificadas",
      "Score de risco e recomendação"
    ],
    formato: "Por verificação (R$ 3.500 a R$ 6.000)",
    detalhes: {
      oqueFazemos: [
        "Verificação completa de idoneidade e saúde financeira",
        "Análise de histórico de entregas e problemas com clientes",
        "Checagem de referências comerciais via ligação",
        "Verificação de processos judiciais e administrativos",
        "Análise de capacidade técnica e financeira de entrega"
      ],
      comoFunciona: [
        "Upload da proposta comercial ou CNPJ do fornecedor",
        "Pesquisa em bases empresariais especializadas",
        "Verificação de 3-5 referências comerciais",
        "Análise de capacidade e certificações",
        "Entrega de relatório com score e recomendação"
      ],
      entregaveis: [
        "Relatório de Due Diligence do Fornecedor",
        "Score de Confiabilidade e Risco (0-100)",
        "Referências Comerciais Verificadas",
        "Sugestão de Garantias (se necessário)",
        "Recomendação: Aprovar / Reprovar / Com Ressalvas"
      ],
      prazo: "3-5 dias úteis (standard) | 72h (express)"
    }
  }
];

// Serviços para Setor Político
const SERVICOS_POLITICOS: Servico[] = [
  {
    id: "due-diligence-candidatos",
    nome: "Due Diligence de Candidatos",
    descricao: "Verificação em massa de todos os candidatos do partido. Compliance eleitoral + antecedentes + dívidas. Evite escândalos.",
    icon: Users,
    destaque: true,
    preco: "R$ 297/candidato (pacote 100+) | R$ 497/candidato (avulso)",
    caracteristicas: [
      "Processamento de +1.000 candidatos/dia com IA",
      "Antecedentes criminais em 27 estados + federal",
      "Dívidas fiscais, trabalhistas e protestos",
      "Histórico de candidaturas e filiações TSE",
      "Score de risco eleitoral automatizado",
      "Relatório consolidado por região"
    ],
    formato: "Por candidato (a partir de R$ 297)",
    idealPara: "Partidos políticos, coligações e candidaturas",
    detalhes: {
      oqueFazemos: [
        "Processamento em massa de milhares de candidatos com GPT-5 e Claude Opus 4.5",
        "Verificação de antecedentes criminais em todas as esferas",
        "Análise de dívidas fiscais, trabalhistas e protestos",
        "Cruzamento com bases do TSE (candidaturas, doações, filiações)",
        "Identificação automática de red flags com IA generativa",
        "Score de risco eleitoral para cada candidato"
      ],
      comoFunciona: [
        "Upload de planilha com CPFs dos candidatos (Excel, CSV)",
        "Processamento automatizado em 15+ bases de dados",
        "Análise de IA para identificação de padrões de risco",
        "Dashboard em tempo real com status de cada candidato",
        "Entrega de relatório consolidado em 48-72h"
      ],
      entregaveis: [
        "Dashboard de Candidatos com score de risco",
        "Relatório individual por candidato",
        "Consolidado por região/estado",
        "Lista de Red Flags críticos para decisão",
        "Recomendação: Aprovar / Reprovar / Investigar mais"
      ],
      prazo: "48-72h para até 500 candidatos | 5-7 dias para 1.000+"
    }
  },
  {
    id: "verificacao-servidores-publicos",
    nome: "Auditoria de Servidores Públicos",
    descricao: "Verificação de folha de pagamento completa. Funcionários fantasmas, óbitos, acúmulos ilegais, vínculos suspeitos.",
    icon: FileSearch,
    preco: "R$ 97/servidor (pacote 1.000+) | R$ 197/servidor (até 500)",
    caracteristicas: [
      "Cruzamento com base de óbitos DATASUS",
      "Verificação de acúmulos de cargo ilegais",
      "Identificação de vínculos societários suspeitos",
      "Análise de endereços incompatíveis",
      "Detecção de funcionários fantasmas",
      "Relatório para TCE/TCU"
    ],
    formato: "Por servidor (a partir de R$ 97)",
    detalhes: {
      oqueFazemos: [
        "Cruzamento de folha com base de óbitos DATASUS (SIM)",
        "Verificação de acúmulos de cargo em outras prefeituras/estados",
        "Análise de vínculos societários em empresas contratadas",
        "Identificação de endereços incompatíveis ou inexistentes",
        "Detecção de padrões de fraude com IA generativa",
        "Preparação de relatório com padrão TCE/TCU"
      ],
      comoFunciona: [
        "Upload da folha de pagamento (Excel, CSV, PDF)",
        "Processamento em bases governamentais (DATASUS, SIAPE, CNIS)",
        "Cruzamento com Portal da Transparência",
        "Análise de padrões suspeitos com GPT-5",
        "Dashboard com achados categorizados por gravidade"
      ],
      entregaveis: [
        "Dashboard de Auditoria com filtros",
        "Lista de Óbitos identificados na folha",
        "Lista de Acúmulos Ilegais",
        "Vínculos Societários Suspeitos",
        "Relatório formatado para TCE/TCU"
      ],
      prazo: "5-10 dias úteis para até 10.000 servidores"
    }
  },
  {
    id: "verificacao-filiados",
    nome: "Verificação de Filiados",
    descricao: "Análise completa da base de filiados do partido. Óbitos, duplicidades, filiações conflitantes, reputação.",
    icon: Users,
    preco: "R$ 47/filiado (pacote 10.000+) | R$ 97/filiado (até 5.000)",
    caracteristicas: [
      "Verificação de óbitos na base de filiados",
      "Detecção de filiações conflitantes (outros partidos)",
      "Análise de antecedentes criminais",
      "Identificação de duplicidades e inconsistências",
      "Cruzamento com doadores de campanha"
    ],
    formato: "Por filiado (a partir de R$ 47)",
    detalhes: {
      oqueFazemos: [
        "Cruzamento com base de óbitos DATASUS",
        "Verificação de filiação em outros partidos (TSE)",
        "Análise de antecedentes criminais básicos",
        "Identificação de CPFs duplicados ou inválidos",
        "Cruzamento com histórico de doações de campanha"
      ],
      comoFunciona: [
        "Upload da base de filiados (Excel, CSV)",
        "Processamento automatizado em bases do TSE",
        "Cruzamento com DATASUS e bases criminais",
        "Geração de relatório de inconsistências",
        "Dashboard interativo com filtros por região"
      ],
      entregaveis: [
        "Dashboard de Filiados com status",
        "Lista de Óbitos identificados",
        "Lista de Filiações Conflitantes",
        "Duplicidades e CPFs inválidos",
        "Relatório consolidado por diretório"
      ],
      prazo: "3-5 dias para até 50.000 filiados"
    }
  },
  {
    id: "verificacao-doadores-campanha",
    nome: "Análise de Doadores de Campanha",
    descricao: "Verificação de idoneidade de doadores. Compliance com TSE, CPCs sancionados, empresas impedidas (CEIS/CNEP).",
    icon: AlertTriangle,
    preco: "R$ 197/doador | R$ 97/doador (pacote 100+)",
    caracteristicas: [
      "Verificação de sanções CEIS/CNEP/CEAF",
      "Análise de CPCs e empresas impedidas",
      "Identificação de laranjas e testas-de-ferro",
      "Cruzamento com dívida ativa da União",
      "Histórico de doações em eleições anteriores"
    ],
    formato: "Por doador (a partir de R$ 97)",
    detalhes: {
      oqueFazemos: [
        "Verificação de sanções no Portal da Transparência (CEIS, CNEP, CEAF)",
        "Análise de empresas impedidas de contratar com o governo",
        "Identificação de padrões de doações suspeitas (laranjas)",
        "Cruzamento com dívida ativa da União (SERPRO)",
        "Histórico completo de doações no TSE"
      ],
      comoFunciona: [
        "Lista de doadores (CPF ou CNPJ)",
        "Processamento em bases governamentais",
        "Análise de padrões com IA generativa",
        "Score de risco por doador",
        "Relatório para prestação de contas"
      ],
      entregaveis: [
        "Dashboard de Doadores com score de risco",
        "Lista de Sancionados identificados",
        "Padrões suspeitos de doações",
        "Relatório para prestação de contas TSE",
        "Recomendações de compliance"
      ],
      prazo: "48-72h para até 500 doadores"
    }
  },
  {
    id: "monitoramento-opositores",
    nome: "Inteligência Competitiva Política",
    descricao: "Monitoramento de oposição, candidatos adversários, movimentos políticos. Alertas em tempo real.",
    icon: Eye,
    preco: "R$ 4.997/mês (5 alvos) | R$ 997/alvo adicional",
    caracteristicas: [
      "Monitoramento de redes sociais e imprensa",
      "Alertas de movimentações e declarações",
      "Análise de alianças e articulações",
      "Dossiês atualizados de adversários",
      "Relatórios semanais de inteligência"
    ],
    formato: "Mensal (R$ 4.997 para 5 alvos)",
    detalhes: {
      oqueFazemos: [
        "Monitoramento 24/7 de alvos políticos definidos",
        "Análise de redes sociais, imprensa e fontes abertas",
        "Identificação de articulações e alianças emergentes",
        "Dossiês atualizados de cada adversário",
        "Alertas em tempo real de declarações e movimentos"
      ],
      comoFunciona: [
        "Definição dos alvos a serem monitorados",
        "Configuração de alertas por tipo de evento",
        "Monitoramento automatizado com IA",
        "Análise humana de eventos relevantes",
        "Relatórios semanais com insights estratégicos"
      ],
      entregaveis: [
        "Dashboard de Monitoramento Político",
        "Alertas em tempo real via WhatsApp/Email",
        "Dossiês atualizados de cada alvo",
        "Relatório Semanal de Inteligência",
        "Análise de Cenários Políticos"
      ],
      prazo: "Setup em 48h, monitoramento contínuo"
    }
  },
  {
    id: "compliance-eleitoral-completo",
    nome: "Programa de Compliance Eleitoral",
    descricao: "Consultoria completa de compliance para campanhas. Prevenção de irregularidades, treinamento de equipe, auditoria contínua.",
    icon: Shield,
    preco: "R$ 29.997/campanha (vereador) | R$ 49.997 (prefeito) | R$ 99.997 (governador/senador)",
    caracteristicas: [
      "Auditoria inicial de compliance",
      "Verificação de toda a equipe de campanha",
      "Monitoramento de prestação de contas",
      "Treinamento de coordenadores",
      "Suporte durante toda a campanha"
    ],
    formato: "Por campanha (a partir de R$ 29.997)",
    idealPara: "Candidatos e partidos que valorizam compliance",
    detalhes: {
      oqueFazemos: [
        "Auditoria completa de compliance eleitoral inicial",
        "Verificação de background de toda a equipe de campanha",
        "Monitoramento contínuo de prestação de contas",
        "Treinamento de coordenadores sobre regras eleitorais",
        "Suporte e consultoria durante toda a campanha"
      ],
      comoFunciona: [
        "Diagnóstico inicial da estrutura de campanha",
        "Verificação de todos os envolvidos (100+ pessoas)",
        "Implementação de processos de compliance",
        "Treinamento presencial/online de equipe",
        "Acompanhamento até prestação de contas final"
      ],
      entregaveis: [
        "Manual de Compliance Eleitoral",
        "Relatório de Background da Equipe",
        "Dashboard de Prestação de Contas",
        "Certificado de Treinamento",
        "Suporte WhatsApp durante campanha"
      ],
      prazo: "Setup em 7 dias, acompanhamento até fim da campanha"
    }
  }
];

// Serviços para Proteção em Divórcios
const SERVICOS_DIVORCIOS: Servico[] = [
  {
    id: "investigacao-patrimonial-divorcio",
    nome: "Investigação Patrimonial Pré-Divórcio",
    descricao: "Levantamento completo de bens do cônjuge. Imóveis, veículos, empresas, contas. 70% dos divórcios têm ocultação patrimonial.",
    icon: Search,
    destaque: true,
    preco: "R$ 9.997 (standard) | R$ 19.997 (completo com empresas)",
    caracteristicas: [
      "Levantamento de imóveis em 27 estados",
      "Veículos em nome próprio e de terceiros",
      "Participações societárias e empresas",
      "Contas bancárias e investimentos",
      "Bens no exterior (se aplicável)",
      "Movimentações suspeitas recentes"
    ],
    formato: "Por investigação (R$ 9.997 a R$ 19.997)",
    idealPara: "Mulheres em processo de divórcio ou planejando separação",
    detalhes: {
      oqueFazemos: [
        "Levantamento completo de imóveis em cartórios de todos os estados",
        "Verificação de veículos (próprios e em nome de terceiros/laranjas)",
        "Mapeamento de TODAS as empresas e participações societárias",
        "Identificação de movimentações patrimoniais suspeitas recentes",
        "Análise de padrão de vida vs. patrimônio declarado"
      ],
      comoFunciona: [
        "Briefing confidencial sobre a situação conjugal",
        "Pesquisa em cartórios, juntas comerciais e bases de dados",
        "Análise de movimentações dos últimos 2 anos",
        "Identificação de bens ocultos e transferências suspeitas",
        "Entrega de dossiê completo para advogado"
      ],
      entregaveis: [
        "Dossiê Patrimonial Completo (50+ páginas)",
        "Lista de Imóveis com matrículas e valores estimados",
        "Lista de Veículos (próprios e suspeitos)",
        "Mapa Societário de empresas",
        "Movimentações Suspeitas documentadas",
        "Orientações para advogado sobre partilha"
      ],
      prazo: "10-15 dias úteis",
      casos: [
        "Identificamos R$ 3,2M em imóveis não declarados em nome de empresa laranja",
        "Encontramos 4 veículos de luxo em nome de parentes próximos"
      ]
    }
  },
  {
    id: "localizacao-bens-ocultos",
    nome: "Localização de Bens Ocultos",
    descricao: "Encontre patrimônio escondido em nome de laranjas, empresas e familiares. Especialistas em narcisistas e golpistas.",
    icon: Eye,
    preco: "R$ 14.997 (nacional) | R$ 29.997 (internacional)",
    caracteristicas: [
      "Rastreamento de transferências recentes",
      "Identificação de laranjas e testas-de-ferro",
      "Análise de empresas de fachada",
      "Verificação de bens em nome de familiares",
      "Patrimônio no exterior (Panamá, Uruguai, EUA)"
    ],
    formato: "Por investigação (R$ 14.997 a R$ 29.997)",
    detalhes: {
      oqueFazemos: [
        "Rastreamento de todas as transferências patrimoniais dos últimos 5 anos",
        "Identificação de laranjas (pessoas que receberam bens suspeitos)",
        "Análise de empresas de fachada criadas para esconder patrimônio",
        "Verificação de bens em nome de familiares (pais, irmãos, filhos)",
        "Pesquisa de patrimônio no exterior quando há indícios"
      ],
      comoFunciona: [
        "Análise do patrimônio conhecido e padrão de vida",
        "Rastreamento reverso de transferências",
        "Investigação de rede de relacionamentos (familiares, sócios)",
        "Pesquisa em bases internacionais (se aplicável)",
        "Documentação de todas as evidências para uso judicial"
      ],
      entregaveis: [
        "Relatório de Bens Ocultos encontrados",
        "Mapa de Transferências Suspeitas",
        "Lista de Laranjas identificados com vínculos",
        "Empresas de Fachada documentadas",
        "Evidências formatadas para petição judicial"
      ],
      prazo: "15-21 dias úteis (nacional) | 30+ dias (internacional)"
    }
  },
  {
    id: "perfil-comportamental-conjuge",
    nome: "Perfil Comportamental do Cônjuge",
    descricao: "Análise de padrões narcisistas, manipuladores e abusivos. Documentação para processo de guarda e alienação parental.",
    icon: UserCheck,
    preco: "R$ 7.997 (análise) | R$ 14.997 (com monitoramento 30 dias)",
    caracteristicas: [
      "Análise de padrões de comportamento online",
      "Identificação de traços narcisistas/manipuladores",
      "Documentação de comportamentos abusivos",
      "Monitoramento de redes sociais",
      "Relatório para processo de guarda"
    ],
    formato: "Por análise (R$ 7.997 a R$ 14.997)",
    detalhes: {
      oqueFazemos: [
        "Análise profunda de comportamento em redes sociais",
        "Identificação de padrões narcisistas e manipuladores",
        "Documentação de comportamentos abusivos ou inadequados",
        "Análise de comunicações disponíveis",
        "Preparação de relatório para uso em processo de guarda"
      ],
      comoFunciona: [
        "Coleta de informações disponíveis sobre o cônjuge",
        "Análise de comportamento online com IA",
        "Identificação de padrões de acordo com DSM-5",
        "Documentação de evidências relevantes",
        "Entrega de relatório técnico"
      ],
      entregaveis: [
        "Relatório de Perfil Comportamental",
        "Evidências de Comportamentos Inadequados",
        "Análise de Risco para Guarda",
        "Timeline de eventos documentados",
        "Orientações para advogado"
      ],
      prazo: "7-14 dias úteis"
    }
  },
  {
    id: "monitoramento-movimentacoes",
    nome: "Monitoramento de Movimentações",
    descricao: "Alertas em tempo real de transferências de bens, abertura de empresas, viagens. Evite surpresas durante o processo.",
    icon: AlertCircle,
    preco: "R$ 2.997/mês",
    caracteristicas: [
      "Alertas de alterações societárias",
      "Monitoramento de cartórios de imóveis",
      "Alertas de transferências de veículos",
      "Viagens internacionais (quando possível)",
      "Abertura de novas empresas"
    ],
    formato: "Mensal (R$ 2.997/mês)",
    detalhes: {
      oqueFazemos: [
        "Monitoramento contínuo de alterações societárias do cônjuge",
        "Alertas de transferências em cartórios de imóveis",
        "Acompanhamento de transferências de veículos no Detran",
        "Detecção de abertura de novas empresas",
        "Alertas de movimentações suspeitas"
      ],
      comoFunciona: [
        "Cadastro do cônjuge e seus dados no sistema",
        "Configuração de alertas por tipo de evento",
        "Monitoramento automatizado 24/7",
        "Alertas imediatos via WhatsApp quando detectada movimentação",
        "Relatório mensal consolidado"
      ],
      entregaveis: [
        "Dashboard de Monitoramento em tempo real",
        "Alertas instantâneos via WhatsApp",
        "Relatório Mensal de Movimentações",
        "Documentação de cada evento detectado"
      ],
      prazo: "Setup em 24h, monitoramento contínuo"
    }
  },
  {
    id: "dossie-para-partilha",
    nome: "Dossiê Completo para Partilha",
    descricao: "Pacote completo: patrimônio + bens ocultos + perfil comportamental. Tudo que seu advogado precisa para a partilha justa.",
    icon: FileText,
    preco: "R$ 29.997 (standard) | R$ 49.997 (premium com internacional)",
    caracteristicas: [
      "Investigação patrimonial completa",
      "Localização de bens ocultos",
      "Perfil comportamental do cônjuge",
      "Monitoramento de 60 dias incluso",
      "Suporte ao advogado durante processo"
    ],
    formato: "Pacote completo (R$ 29.997 a R$ 49.997)",
    idealPara: "Divórcios de alto patrimônio ou com suspeita de ocultação",
    detalhes: {
      oqueFazemos: [
        "Investigação patrimonial completa (imóveis, veículos, empresas)",
        "Localização de bens ocultos e laranjas",
        "Análise de perfil comportamental do cônjuge",
        "Monitoramento de movimentações por 60 dias",
        "Suporte técnico ao advogado durante todo o processo"
      ],
      comoFunciona: [
        "Reunião inicial para entender a situação completa",
        "Execução paralela de todas as frentes de investigação",
        "Apresentação de relatório preliminar em 15 dias",
        "Relatório final completo em 30 dias",
        "Suporte ao advogado até conclusão do processo"
      ],
      entregaveis: [
        "Dossiê Patrimonial Completo (100+ páginas)",
        "Relatório de Bens Ocultos",
        "Perfil Comportamental",
        "Dashboard de Monitoramento (60 dias)",
        "Suporte ao advogado por email/WhatsApp",
        "Atualização do dossiê quando necessário"
      ],
      prazo: "Entrega preliminar em 15 dias, final em 30 dias"
    }
  },
  {
    id: "protecao-contra-alienacao",
    nome: "Proteção Contra Alienação Parental",
    descricao: "Documentação de comportamentos de alienação parental. Evidências para guarda e regime de convivência.",
    icon: Shield,
    preco: "R$ 9.997 (análise) | R$ 4.997/mês (monitoramento)",
    caracteristicas: [
      "Análise de comunicações com os filhos",
      "Documentação de manipulações",
      "Monitoramento de redes sociais",
      "Relatório para processo de guarda",
      "Orientações para psicólogo judicial"
    ],
    formato: "Por análise ou mensal",
    detalhes: {
      oqueFazemos: [
        "Análise de comunicações entre cônjuge e filhos (quando disponível)",
        "Documentação de comportamentos de alienação parental",
        "Monitoramento de postagens em redes sociais",
        "Identificação de padrões de manipulação",
        "Preparação de relatório técnico para processo de guarda"
      ],
      comoFunciona: [
        "Coleta de evidências disponíveis",
        "Análise técnica de comportamentos",
        "Categorização conforme Lei 12.318/2010",
        "Documentação cronológica de eventos",
        "Entrega de relatório para advogado e psicólogo"
      ],
      entregaveis: [
        "Relatório de Alienação Parental",
        "Timeline de eventos documentados",
        "Evidências categorizadas",
        "Orientações para psicólogo judicial",
        "Sugestões de quesitos para perícia"
      ],
      prazo: "10-15 dias úteis"
    }
  }
];

const SERVICOS_INVESTIMENTOS: Servico[] = [
  {
    id: "checagem-rapida-founder",
    nome: "Red Flag Express",
    descricao: "O mais vendido. 3 verificações críticas em 48h para decisões rápidas. 90% dos investidores começam aqui.",
    icon: Clock,
    destaque: true,
    preco: "R$ 1.997 (nacional) | R$ 3.997 (express 24h)",
    caracteristicas: [
      "Founder Check (CPF e histórico)",
      "Empresa Check (CNPJ e dívidas)",
      "Reputation Check (internet e redes)",
      "Entrega garantida em 48h"
    ],
    formato: "Por análise (R$ 1.997)",
    idealPara: "Primeira análise, decisões rápidas, tickets até R$ 1M",
    detalhes: {
      oqueFazemos: [
        "FOUNDER CHECK: Verificação de CPF, antecedentes criminais e histórico",
        "EMPRESA CHECK: Análise de CNPJ, dívidas fiscais e trabalhistas",
        "REPUTATION CHECK: Scan de internet, redes sociais e menções",
        "Identificação dos principais red flags em 48h",
        "Score de confiabilidade comparativo com 847+ founders verificados"
      ],
      comoFunciona: [
        "Envie apenas: nome do founder + nome da startup + LinkedIn ou site",
        "Nossa IA + peritos iniciam verificação em 3 frentes simultâneas",
        "Análise cruzada de informações e detecção de inconsistências",
        "Notificação imediata se red flag crítico encontrado",
        "Entrega de relatório Go/No-Go em 48h"
      ],
      entregaveis: [
        "Relatório Executivo (10 páginas) com sinal Verde/Amarelo/Vermelho",
        "Score de Confiabilidade (0-100)",
        "Lista de Red Flags encontrados com evidências",
        "Comparativo: Melhor que X% dos founders verificados",
        "Recomendação clara: Investir / Cuidado / Fugir"
      ],
      prazo: "48h garantidas ou grátis | Express 24h (+R$ 500)"
    }
  },
  {
    id: "investigacao-completa-founder",
    nome: "Founder Full Scan",
    descricao: "Investigação padrão VC Tier-1. Para tickets acima de R$ 1M ou follow-on. Tudo que o Red Flag Express não pega.",
    icon: FileSearch,
    preco: "R$ 4.997 (nacional) | R$ 9.997 (internacional)",
    caracteristicas: [
      "Histórico completo de 20+ anos",
      "Todas as empresas anteriores verificadas",
      "Todos os processos judiciais",
      "Passivos ocultos e laranjas",
      "Reputação digital profunda",
      "10+ referências verificadas"
    ],
    formato: "Por investigação (R$ 4.997)",
    detalhes: {
      oqueFazemos: [
        "Verificação completa de histórico pessoal dos últimos 20+ anos",
        "Análise de TODAS as empresas anteriores (inclusive as falidas)",
        "Levantamento de todos os processos judiciais (cíveis, criminais, trabalhistas)",
        "Identificação de passivos ocultos, dívidas pessoais e laranjas",
        "Verificação de sócios ocultos e estruturas de blindagem",
        "Análise de reputação digital profunda (dark web incluída)"
      ],
      comoFunciona: [
        "Briefing sobre o founder, startup e suas preocupações específicas",
        "Pesquisa em mais de 100 bases de dados nacionais e internacionais",
        "Análise de histórico empresarial com timeline de eventos",
        "Verificação de 10+ referências profissionais",
        "Entrega de dossiê completo com recomendações de negociação"
      ],
      entregaveis: [
        "Dossiê Completo do Founder (50+ páginas)",
        "Timeline de todas as empresas e eventos relevantes",
        "Mapa de relacionamentos empresariais e conexões",
        "Score de Integridade e Confiabilidade (0-100)",
        "Recomendações de due diligence adicional ou negociação"
      ],
      prazo: "5-7 dias úteis (nacional) | 10-14 dias (internacional)"
    }
  },
  {
    id: "investigacao-profunda-founder",
    nome: "Deep Dive Founder",
    descricao: "Para checks acima de R$ 10M ou Série B+. 50-100 horas de investigação. Análise psicológica e 20+ referências.",
    icon: Search,
    preco: "R$ 14.997 (nacional) | R$ 29.997 (internacional + deep web)",
    caracteristicas: [
      "50-100 horas de investigação",
      "20+ referências verificadas e gravadas",
      "Deep web e dark web scan",
      "Análise psicológica comportamental (DISC)",
      "Auditoria digital de 20 anos"
    ],
    formato: "Por investigação (R$ 14.997)",
    detalhes: {
      oqueFazemos: [
        "Verificação de 20+ referências profissionais (com gravação autorizada)",
        "Pesquisa em deep web e dark web por menções e vazamentos",
        "Análise psicológica comportamental (DISC, MBTI, red flags psicológicos)",
        "Auditoria digital completa de 20 anos (archive.org, posts deletados)",
        "Investigação de campo quando necessário (ex-sócios, ex-funcionários)"
      ],
      comoFunciona: [
        "Briefing detalhado sobre suas preocupações e perguntas específicas",
        "50-100 horas de investigação por equipe de especialistas",
        "Múltiplas frentes de pesquisa simultâneas",
        "Análise comportamental por psicólogo forense",
        "Apresentação executiva dos resultados com Q&A ao vivo"
      ],
      entregaveis: [
        "Dossiê Premium do Founder (100+ páginas)",
        "20+ referências verificadas com resumo de cada conversa",
        "Análise Comportamental completa (DISC + MBTI)",
        "Relatório de Deep Web e Dark Web",
        "Apresentação board-ready (30 slides) + sessão Q&A de 2h"
      ],
      prazo: "15-21 dias úteis"
    }
  },
  {
    id: "raio-x-startup",
    nome: "Startup Integrity Check",
    descricao: "Análise da empresa, não só do founder. Cap table, métricas, passivos, indicadores de fraude. Para Séries A+.",
    icon: Building2,
    preco: "R$ 9.997 (até R$ 10M de faturamento) | R$ 19.997 (acima)",
    caracteristicas: [
      "Análise completa do cap table",
      "Verificação de métricas declaradas vs. reais",
      "Histórico societário e movimentações",
      "Passivos fiscais e trabalhistas ocultos",
      "Indicadores de fraude contábil"
    ],
    formato: "Por análise (R$ 9.997)",
    detalhes: {
      oqueFazemos: [
        "Análise completa do cap table e acordos de sócios",
        "Verificação de métricas declaradas vs. dados reais disponíveis",
        "Levantamento de histórico societário e todas as alterações",
        "Identificação de passivos fiscais, trabalhistas e contingências",
        "Análise de indicadores de fraude contábil e inconsistências"
      ],
      comoFunciona: [
        "Coleta de documentação da startup (pitch deck, data room)",
        "Análise de dados financeiros e métricas declaradas",
        "Verificação de informações em bases públicas e privadas",
        "Pesquisa de passivos ocultos e contingências",
        "Entrega de relatório com score de integridade"
      ],
      entregaveis: [
        "Relatório Raio-X da Startup (30+ páginas)",
        "Análise de Cap Table com flags de risco",
        "Verificação de Métricas (consistentes vs. infladas)",
        "Lista de Passivos Ocultos encontrados",
        "Score de Integridade da Startup (0-100)"
      ],
      prazo: "7-10 dias úteis"
    }
  },
  {
    id: "raio-x-cnpj-startup",
    nome: "CNPJ Deep Scan",
    descricao: "Raio-X empresarial focado em startups. Estrutura societária, passivos ocultos, sócios escondidos.",
    icon: FileSearch,
    preco: "R$ 4.997 (standard) | R$ 7.997 (express 48h)",
    caracteristicas: [
      "Estrutura societária completa",
      "Passivos fiscais e trabalhistas",
      "Identificação de sócios ocultos",
      "Dívidas e pendências em execução",
      "Falências e recuperações não declaradas"
    ],
    formato: "Por investigação (R$ 4.997)",
    detalhes: {
      oqueFazemos: [
        "Análise completa da estrutura societária atual e histórica",
        "Levantamento de passivos fiscais em todas as esferas",
        "Verificação de passivos trabalhistas e reclamações",
        "Identificação de sócios ocultos e participações cruzadas",
        "Checagem de dívidas, protestos e pendências em execução"
      ],
      comoFunciona: [
        "Identificação do CNPJ da startup a ser verificada",
        "Pesquisa em bases empresariais especializadas",
        "Análise de documentação societária disponível",
        "Levantamento de passivos em múltiplas fontes",
        "Entrega de relatório com mapa societário visual"
      ],
      entregaveis: [
        "Relatório Raio-X do CNPJ (30+ páginas)",
        "Mapa Societário visual com histórico",
        "Lista completa de Passivos e Contingências",
        "Análise de Red Flags empresariais",
        "Score de Saúde da Empresa (0-100)"
      ],
      prazo: "5-7 dias úteis (standard) | 48h (express)"
    }
  },
  {
    id: "blindagem-investidor",
    nome: "Investor Shield",
    descricao: "Descobriu uma fraude? Blindagem emergencial. Dossiê defensivo, proteção reputacional, estratégia de saída.",
    icon: Shield,
    preco: "R$ 14.997 (preventivo) | R$ 29.997 (emergencial/fraude descoberta)",
    caracteristicas: [
      "Dossiê defensivo com evidências",
      "Proteção de reputação do investidor",
      "Documentação para ações jurídicas",
      "Estratégia de saída e recuperação",
      "Coordenação com advogados"
    ],
    formato: "Por projeto (R$ 14.997 a R$ 29.997)",
    detalhes: {
      oqueFazemos: [
        "Criação de dossiê defensivo completo com todas as evidências",
        "Proteção da reputação do investidor frente a outros stakeholders",
        "Documentação completa para ações jurídicas e criminais",
        "Estratégia de saída do investimento (tag along, drag along, venda)",
        "Coordenação com advogados especializados em direito societário"
      ],
      comoFunciona: [
        "Análise emergencial da situação de fraude",
        "Coleta e preservação de todas as evidências",
        "Criação de estratégia de proteção multi-frente",
        "Implementação de blindagem reputacional e jurídica",
        "Acompanhamento até resolução do caso"
      ],
      entregaveis: [
        "Dossiê Defensivo completo com evidências",
        "Cronologia documentada dos eventos",
        "Estratégia de Saída com cenários",
        "Plano de Proteção Reputacional",
        "Relatório para advogados e autoridades"
      ],
      prazo: "Ações emergenciais em 24h, projeto completo em 7 dias"
    }
  },
  {
    id: "busca-verificacao-ex-socios",
    nome: "Co-Founder Ghost Hunter",
    descricao: "Co-founder sumiu e pode aparecer no exit querendo milhões? Localização + verificação de direitos pendentes.",
    icon: Search,
    preco: "R$ 3.997 (nacional) | R$ 9.997 (internacional)",
    caracteristicas: [
      "Localização de co-founders desaparecidos",
      "Verificação de direitos e participações",
      "Análise de risco de retorno no exit",
      "Levantamento de patrimônio atual",
      "Suporte para acordo ou ação"
    ],
    formato: "Por busca (R$ 3.997 a R$ 9.997)",
    detalhes: {
      oqueFazemos: [
        "Localização de ex-sócios e co-founders que sumiram",
        "Verificação de direitos pendentes, opções e participações",
        "Análise de risco de retorno no exit ou rodada de investimento",
        "Levantamento de patrimônio e situação financeira atual",
        "Documentação completa para acordos ou ações judiciais"
      ],
      comoFunciona: [
        "Briefing sobre a pessoa procurada e histórico da relação",
        "Pesquisa de localização em bases nacionais e internacionais",
        "Verificação de situação atual (empregos, empresas, patrimônio)",
        "Análise de riscos jurídicos e implicações",
        "Documentação dos achados para uso em negociações"
      ],
      entregaveis: [
        "Relatório de Localização completo",
        "Análise de Direitos Pendentes e implicações",
        "Avaliação de Riscos de litígio",
        "Situação patrimonial e financeira atual",
        "Recomendações para acordo ou ação judicial"
      ],
      prazo: "7-15 dias (nacional) | 15-21 dias (internacional)"
    }
  },
  {
    id: "analise-trabalhista-founder",
    nome: "Founder Labor Risk",
    descricao: "Founder que explora funcionário, explora investidor. Histórico de processos trabalhistas e padrões de violação.",
    icon: FileSearch,
    preco: "R$ 1.497 (básica) | R$ 2.997 (completa + empresas anteriores)",
    caracteristicas: [
      "Histórico de todos os processos trabalhistas",
      "Identificação de padrões de violação",
      "Casos de assédio moral/sexual",
      "Verificação em empresas anteriores",
      "Score de risco trabalhista"
    ],
    formato: "Por análise (R$ 1.497 a R$ 2.997)",
    detalhes: {
      oqueFazemos: [
        "Levantamento de TODOS os processos trabalhistas do founder",
        "Identificação de padrões de violação (é serial offender?)",
        "Verificação de alegações de assédio moral e sexual",
        "Análise de histórico em todas as empresas anteriores",
        "Projeção de riscos trabalhistas para a startup investida"
      ],
      comoFunciona: [
        "Identificação do founder a ser analisado",
        "Pesquisa de processos em todas as varas trabalhistas",
        "Análise de padrões de alegações e valores",
        "Verificação de depoimentos e decisões judiciais",
        "Entrega de relatório com score de risco"
      ],
      entregaveis: [
        "Relatório de Histórico Trabalhista completo",
        "Análise de Padrões de Violação",
        "Score de Risco Trabalhista (0-100)",
        "Projeção de Passivos Futuros",
        "Recomendação e red flags identificados"
      ],
      prazo: "5-7 dias úteis"
    }
  },
  {
    id: "monitoramento-portfolio",
    nome: "Portfolio Watch",
    descricao: "Monitoramento contínuo de todas as startups investidas. Alertas de processos, mudanças societárias, riscos emergentes.",
    icon: TrendingUp,
    preco: "R$ 497/mês por startup | R$ 2.997/mês (até 10 startups)",
    caracteristicas: [
      "Alertas automáticos em tempo real",
      "Monitoramento de novos processos",
      "Acompanhamento de mudanças societárias",
      "Detecção de riscos emergentes",
      "Dashboard de portfolio online"
    ],
    formato: "Mensal (R$ 497/startup ou R$ 2.997 até 10)",
    detalhes: {
      oqueFazemos: [
        "Monitoramento contínuo de todas as startups do portfolio",
        "Alertas imediatos de novos processos, dívidas e protestos",
        "Acompanhamento de mudanças societárias e alterações de cap table",
        "Identificação de riscos emergentes e red flags",
        "Atualização de status dos founders e executivos-chave"
      ],
      comoFunciona: [
        "Cadastro de todas as startups do portfolio no sistema",
        "Configuração de alertas por tipo de evento e severidade",
        "Monitoramento automático 24/7",
        "Relatórios mensais consolidados",
        "Dashboard online com acesso em tempo real"
      ],
      entregaveis: [
        "Dashboard de Portfolio em tempo real",
        "Alertas instantâneos via WhatsApp e email",
        "Relatório Mensal de Status do Portfolio",
        "Análise de Riscos Emergentes identificados",
        "Score de Saúde de cada startup (0-100)"
      ],
      prazo: "Setup em 48h, monitoramento contínuo"
    }
  },
  {
    id: "plano-mensal-investidor",
    nome: "Investor Protection Plan",
    descricao: "Plano mensal para investidores ativos. 5 Red Flags + 1 Deep Dive + Portfolio Watch. Economia de 40%.",
    icon: TrendingUp,
    preco: "R$ 9.997/mês (economia de R$ 6.000 vs. avulso)",
    caracteristicas: [
      "5 Red Flag Express inclusos/mês",
      "1 Founder Full Scan incluso/mês",
      "Portfolio Watch de até 10 startups",
      "Suporte prioritário 24/7",
      "Créditos acumuláveis por 3 meses"
    ],
    formato: "Mensal (R$ 9.997)",
    idealPara: "Investidores-anjo e VCs com dealflow ativo",
    detalhes: {
      oqueFazemos: [
        "5 checagens Red Flag Express de founders por mês (valor avulso: R$ 9.985)",
        "1 investigação Founder Full Scan por mês (valor avulso: R$ 4.997)",
        "Monitoramento Portfolio Watch de até 10 startups",
        "Suporte prioritário para decisões urgentes de investimento"
      ],
      comoFunciona: [
        "Contrato mensal de serviços com renovação automática",
        "Créditos de checagem mensais (acumuláveis por até 3 meses)",
        "Acesso prioritário à equipe via WhatsApp dedicado",
        "Dashboard de portfolio em tempo real",
        "Relatórios mensais de uso e achados"
      ],
      entregaveis: [
        "5 Relatórios Red Flag Express/mês",
        "1 Dossiê Founder Full Scan/mês",
        "Dashboard de Portfolio Watch",
        "Linha direta 24/7 com especialista",
        "Relatório mensal consolidado de dealflow"
      ],
      prazo: "Serviço contínuo com renovação mensal"
    }
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
            <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-xl">
              <service.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl">{service.nome}</DialogTitle>
              <DialogDescription className="mt-2 text-base">
                {service.descricao}
              </DialogDescription>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline">{service.formato}</Badge>
                {service.destaque && (
                  <Badge className="bg-primary-500 text-white">Mais Procurado</Badge>
                )}
                {service.idealPara && (
                  <Badge variant="secondary">{service.idealPara}</Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* O que fazemos */}
          {service.detalhes?.oqueFazemos && (
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-primary-500" />
                O que fazemos
              </h3>
              <ul className="space-y-2">
                {service.detalhes.oqueFazemos.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Como funciona */}
          {service.detalhes?.comoFunciona && (
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-5">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-gold-500" />
                Como funciona
              </h3>
              <ol className="space-y-3">
                {service.detalhes.comoFunciona.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-500 text-white text-sm flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-300">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Entregáveis */}
          {service.detalhes?.entregaveis && (
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-500" />
                O que você recebe
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {service.detalhes.entregaveis.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preço e Prazo */}
          <div className="grid sm:grid-cols-2 gap-4">
            {service.preco && (
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800/30 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">R$</span>
                </div>
                <div>
                  <p className="font-semibold text-emerald-700 dark:text-emerald-400">Investimento</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{service.preco}</p>
                </div>
              </div>
            )}
            {service.detalhes?.prazo && (
              <div className="flex items-center gap-3 bg-gold-50 dark:bg-gold-900/20 rounded-xl p-4">
                <Clock className="w-6 h-6 text-gold-600" />
                <div>
                  <p className="font-semibold text-gold-700 dark:text-gold-400">Prazo de Entrega</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{service.detalhes.prazo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Características */}
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
              <Eye className="w-5 h-5 text-purple-500" />
              Características incluídas
            </h3>
            <div className="flex flex-wrap gap-2">
              {service.caracteristicas.map((item, idx) => (
                <Badge key={idx} variant="outline" className="py-1.5 px-3">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleWhatsAppClick}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Solicitar Orçamento via WhatsApp
              </Button>
              <Button variant="outline" onClick={onClose}>
                Fechar
              </Button>
            </div>
            <p className="text-xs text-center text-neutral-500 mt-3">
              Valores sob consulta • Atendimento personalizado
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ServicosContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("familiar");
  const [selectedService, setSelectedService] = useState<Servico | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["familiar", "empresarial", "investimentos", "politicos", "divorcios"].includes(tab)) {
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
    <main className="min-h-screen bg-white dark:bg-navy-950">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-navy-50 to-navy-100 dark:from-navy-900 dark:to-navy-950">
          <div className="container max-w-7xl px-4">
            <div className="text-center space-y-6">
              <Badge variant="outline" className="text-gold-600 dark:text-gold-400 border-gold-300 dark:border-gold-600">
                Servicos Especializados
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold text-navy-900 dark:text-white">
                Investigacao com IA em Escala
              </h1>
              <p className="text-xl text-navy-600 dark:text-navy-300 max-w-3xl mx-auto">
                Processamos <strong className="text-gold-600 dark:text-gold-400">+100 mil registros</strong> com GPT-5, Claude Opus 4.5 e Gemini 3.
                Protecao para <strong>familias</strong>, <strong>empresas</strong>, <strong>investidores</strong> e <strong>orgaos publicos</strong>.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Badge className="bg-navy-800 text-white">IA Generativa</Badge>
                <Badge className="bg-gold-500 text-navy-900">50+ Bases de Dados</Badge>
                <Badge className="bg-navy-600 text-white">Perito Criminal Oficial</Badge>
                <Badge className="bg-success text-white">100% LGPD</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Diferencial Section */}
        <section className="py-12 bg-gradient-to-r from-navy-800 to-navy-900">
          <div className="container max-w-6xl px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-white space-y-4">
                <h2 className="text-2xl font-bold">Tecnologia + Pericia Forense</h2>
                <p className="text-navy-200">
                  Combinacao unica no Brasil: <strong className="text-gold-400">Arquiteta de IA</strong> com 16+ certificacoes em Machine Learning +
                  <strong className="text-gold-400"> Perito Criminal Oficial</strong> (1o lugar PCE-PA 2019) no Advisory Board.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">GPT-5</Badge>
                  <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">Claude Opus 4.5</Badge>
                  <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">Gemini 3</Badge>
                  <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">Validade Judicial</Badge>
                </div>
              </div>
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-2 border-2 border-gold-500/30">
                    <UserCheck className="w-10 h-10 text-gold-400" />
                  </div>
                  <p className="text-white font-semibold">Dani Kaloi</p>
                  <p className="text-gold-400 text-sm">Arquiteta de IA</p>
                </div>
                <div className="text-center">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-2 border-2 border-gold-500/50">
                    <Image
                      src="/images/ibsen-maciel.jpg"
                      alt="Ibsen Maciel"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-white font-semibold">Ibsen Maciel</p>
                  <p className="text-gold-400 text-sm">Perito Criminal</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Tabs */}
        <section className="py-20">
          <div className="container max-w-7xl px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
              <TabsList className="grid w-full max-w-5xl mx-auto grid-cols-3 md:grid-cols-5 h-auto p-1 bg-navy-100 dark:bg-navy-900">
                <TabsTrigger
                  value="familiar"
                  className="flex items-center gap-2 py-3 md:py-4 data-[state=active]:bg-white dark:data-[state=active]:bg-navy-800 data-[state=active]:text-navy-900 dark:data-[state=active]:text-white"
                >
                  <Home className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden lg:inline">Proteção Familiar</span>
                  <span className="lg:hidden text-xs md:text-sm">Familiar</span>
                </TabsTrigger>
                <TabsTrigger
                  value="empresarial"
                  className="flex items-center gap-2 py-3 md:py-4 data-[state=active]:bg-white dark:data-[state=active]:bg-navy-800 data-[state=active]:text-navy-900 dark:data-[state=active]:text-white"
                >
                  <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden lg:inline">Proteção Empresarial</span>
                  <span className="lg:hidden text-xs md:text-sm">Empresarial</span>
                </TabsTrigger>
                <TabsTrigger
                  value="investimentos"
                  className="flex items-center gap-2 py-3 md:py-4 data-[state=active]:bg-white dark:data-[state=active]:bg-navy-800 data-[state=active]:text-navy-900 dark:data-[state=active]:text-white"
                >
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden lg:inline">Proteção de Investimentos</span>
                  <span className="lg:hidden text-xs md:text-sm">Investimentos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="politicos"
                  className="flex items-center gap-2 py-3 md:py-4 data-[state=active]:bg-white dark:data-[state=active]:bg-navy-800 data-[state=active]:text-navy-900 dark:data-[state=active]:text-white"
                >
                  <Landmark className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden lg:inline">Setor Político</span>
                  <span className="lg:hidden text-xs md:text-sm">Políticos</span>
                </TabsTrigger>
                <TabsTrigger
                  value="divorcios"
                  className="flex items-center gap-2 py-3 md:py-4 data-[state=active]:bg-white dark:data-[state=active]:bg-navy-800 data-[state=active]:text-navy-900 dark:data-[state=active]:text-white"
                >
                  <Scale className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden lg:inline">Proteção em Divórcios</span>
                  <span className="lg:hidden text-xs md:text-sm">Divórcios</span>
                </TabsTrigger>
              </TabsList>

              {["familiar", "empresarial", "investimentos", "politicos", "divorcios"].map(tabValue => (
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
                          <Badge className="absolute -top-3 left-4 bg-primary-500 text-white">
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
        <section className="py-20 bg-gradient-to-r from-navy-800 via-navy-900 to-navy-950">
          <div className="container max-w-4xl px-4 text-center space-y-6">
            <h2 className="text-4xl font-bold text-white">
              Precisa investigar grandes volumes?
            </h2>
            <p className="text-lg text-navy-200">
              Folhas de pagamento, candidatos, filiados, fornecedores, funcionarios...
              <br />Nossa IA processa qualquer volume com precisao e velocidade.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pb-4">
              <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">Orgaos Publicos</Badge>
              <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">Partidos Politicos</Badge>
              <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">Mulheres em Divorcio</Badge>
              <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">Empresas</Badge>
              <Badge className="bg-gold-500/20 text-gold-400 border-gold-500/30">Investidores</Badge>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-gold-500 text-navy-900 hover:bg-gold-400 font-semibold">
                Solicitar Orcamento
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-gold-500/50 text-gold-400 hover:bg-gold-500/10">
                <Phone className="mr-2 w-4 h-4" />
                Falar com Especialista
              </Button>
            </div>

            {/* Team Badge */}
            <div className="pt-8 flex items-center justify-center gap-6">
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-2 border-2 border-gold-500/30">
                  <UserCheck className="w-7 h-7 text-gold-400" />
                </div>
                <p className="text-white text-sm font-semibold">Dani Kaloi</p>
                <p className="text-gold-400 text-xs">Arquiteta de IA</p>
              </div>
              <div className="text-center">
                <div className="relative w-14 h-14 rounded-full overflow-hidden mx-auto mb-2 border-2 border-gold-500/50">
                  <Image
                    src="/images/ibsen-maciel.jpg"
                    alt="Ibsen Maciel"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-white text-sm font-semibold">Ibsen Maciel</p>
                <p className="text-gold-400 text-xs">Perito Criminal</p>
              </div>
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
