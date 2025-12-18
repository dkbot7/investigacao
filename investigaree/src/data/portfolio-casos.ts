import {
  Users, FileCheck, TrendingUp, AlertTriangle,
  CheckCircle, Building2, Database, Zap, Shield, Eye
} from 'lucide-react';

export interface CasoPortfolio {
  id: string;
  titulo: string;
  tipo: string;
  cliente: string; // anonimizado
  data: string;
  metricas: {
    label: string;
    valor: string;
    icon: any;
  }[];
  servicosAplicados: string[];
  resultado: string;
  badge: string;
  corTema: 'blue' | 'purple' | 'green';
}

export const CASOS_PORTFOLIO: CasoPortfolio[] = [
  {
    id: 'auditoria-estatal',
    titulo: 'Auditoria de Estatal',
    tipo: 'Due Diligence Corporativa em Massa',
    cliente: 'Companhia de Urbanização (estatal)',
    data: 'Novembro 2025',
    metricas: [
      {
        label: 'Funcionários Auditados',
        valor: '5.950',
        icon: Users
      },
      {
        label: 'Óbitos Identificados',
        valor: '57',
        icon: AlertTriangle
      },
      {
        label: 'Empresas Ativas (conflito)',
        valor: '151',
        icon: Building2
      },
      {
        label: 'Benefícios Indevidos',
        valor: '35',
        icon: FileCheck
      },
      {
        label: 'Vínculos Societários',
        valor: '500+',
        icon: TrendingUp
      },
      {
        label: 'Prazo de Entrega',
        valor: '10 dias úteis',
        icon: CheckCircle
      }
    ],
    servicosAplicados: [
      'Due Diligence RH & Compliance',
      'Verificação CEIS/CNEP/TCU',
      'Cruzamento com CPF/Receita Federal',
      'Análise de vínculos empresariais',
      'Dashboard interativo entregue'
    ],
    resultado: 'Economia estimada de R$ 1,2 milhão/ano com suspensão de pagamentos indevidos a falecidos e identificação de conflitos de interesse. Sistema automatizado de monitoramento implementado.',
    badge: 'CASE DESTAQUE',
    corTema: 'blue'
  },
  {
    id: 'automacao-transportadora',
    titulo: 'Automação para Transportadora',
    tipo: 'Web Scraping & Automação',
    cliente: 'Agência Reguladora de Transportes',
    data: 'Novembro 2025',
    metricas: [
      {
        label: 'Veículos Monitorados',
        valor: '1.000+',
        icon: Database
      },
      {
        label: 'Redução de Tempo',
        valor: '8h/dia → 5min',
        icon: Zap
      },
      {
        label: 'Precisão da Extração',
        valor: '98%',
        icon: CheckCircle
      },
      {
        label: 'Tempo Economizado',
        valor: '95%',
        icon: TrendingUp
      },
      {
        label: 'Automação',
        valor: 'Diária',
        icon: Shield
      },
      {
        label: 'ROI',
        valor: '3 meses',
        icon: CheckCircle
      }
    ],
    servicosAplicados: [
      'Web Scraping de portal governamental',
      'Automação de consultas em massa',
      'Consolidação de dados em planilha',
      'Relatório executivo gerado',
      'Alertas automáticos configurados'
    ],
    resultado: 'Equipe liberada de tarefas manuais repetitivas, dados atualizados diariamente sem intervenção humana, alertas automáticos de mudanças de status. Redução de custos operacionais significativa.',
    badge: 'AUTOMAÇÃO',
    corTema: 'green'
  },
  {
    id: 'background-checks',
    titulo: 'Background Checks Executivos',
    tipo: 'Investigação de Pessoas Físicas',
    cliente: 'Empresa do setor imobiliário',
    data: 'Dezembro 2025',
    metricas: [
      {
        label: 'Pessoas Investigadas',
        valor: '6',
        icon: Users
      },
      {
        label: 'Camadas de Verificação',
        valor: '18',
        icon: Shield
      },
      {
        label: 'Trabalho de Campo',
        valor: 'Fotos de endereços',
        icon: Eye
      },
      {
        label: 'Vínculos Ocultos',
        valor: 'Detectados',
        icon: AlertTriangle
      },
      {
        label: 'Prazo Médio',
        valor: '7-10 dias',
        icon: CheckCircle
      },
      {
        label: 'Taxa de Precisão',
        valor: '100%',
        icon: CheckCircle
      }
    ],
    servicosAplicados: [
      'Background Check Executivos',
      'OSINT (Open Source Intelligence)',
      'Verificação de antecedentes',
      'Análise de vínculos societários',
      'Trabalho de campo presencial'
    ],
    resultado: 'Identificação de inconsistências em histórico profissional, detecção de empresas não declaradas e vínculos empresariais ocultos que subsidiaram decisão de contratação. Prevenção de riscos reputacionais e financeiros.',
    badge: 'BACKGROUND CHECK',
    corTema: 'purple'
  }
];
