import {
  Shield, Globe, UserX, ShieldCheck,
  Trash2, Eye, MapPin, LinkIcon, Search,
  Lock, Smartphone, Award, Users, Video
} from 'lucide-react';

export interface PacoteServico {
  id: string;
  nome: string;
  descricao: string;
  cor: 'blue' | 'purple' | 'red' | 'green';
  icon: any;
  servicos: string[]; // IDs dos serviços individuais
  caracteristicas: string[];
  precoBase: string;
  prazo: string;
  badge?: string;
  idealPara: string;
}

export const PACOTES_SERVICOS: PacoteServico[] = [
  {
    id: 'protecao-dados',
    nome: 'Proteção de Dados & Privacidade',
    descricao: 'Blindagem completa dos seus dados pessoais em 47 sites públicos, Google e Street View.',
    cor: 'blue',
    icon: Shield,
    servicos: ['cpf-blindado', 'endereco-off', 'google-limpo', 'mapa-secreto'],
    caracteristicas: [
      'Remoção em 47 sites catalogados',
      'Desindexação Google conforme LGPD',
      'Remoção de endereços residenciais',
      'Desfoque Street View',
      'Proteção contra stalking digital',
      'Relatório de solicitações completo',
      'Monitoramento pós-remoção'
    ],
    precoBase: 'A partir de R$ 2.500',
    prazo: '15-30 dias',
    badge: 'PACOTE PROTEÇÃO TOTAL',
    idealPara: 'Pessoas expostas, separações, proteção familiar'
  },
  {
    id: 'remocao-conteudo',
    nome: 'Remoção de Conteúdo & Reputação',
    descricao: 'Remoção emergencial de fotos, perfis falsos e conteúdo ofensivo com varredura reputacional completa.',
    cor: 'purple',
    icon: Search,
    servicos: ['apaga-meu-ex', 'foto-sumida', 'link-cortado', 'espiao-exposto', 'perfil-cacado', 'varredura-reputacional'],
    caracteristicas: [
      'Atendimento emergencial 24-72h (fotos íntimas)',
      'Solicitação em massa de remoção',
      'Denúncia formal às plataformas',
      'Identificação técnica de perfis fakes',
      'Varredura reputacional completa',
      'Relatório forense de evidências',
      'Monitoramento contínuo de novas menções'
    ],
    precoBase: 'A partir de R$ 800 (individual) / R$ 3.500 (varredura completa)',
    prazo: '5-45 dias (conforme serviço)',
    badge: 'EMERGENCIAL 72H',
    idealPara: 'Vítimas de vazamento, difamação, perseguição online'
  },
  {
    id: 'pericia-forense',
    nome: 'Perícia Forense Digital',
    descricao: 'Investigação forense validada por perito com extração de dispositivos e cadeia de custódia certificada.',
    cor: 'red',
    icon: ShieldCheck,
    servicos: ['pericia-forense-validada', 'extracao-forense-dispositivos', 'cadeia-custodia-certificada', 'seguranca-residencial'],
    caracteristicas: [
      'Extração com Avilla Forensics e indexação com IPED',
      'Validação por Perito Criminal Oficial (Ibsen Maciel)',
      'Cadeia de custódia certificada',
      'Recuperação de dados deletados',
      'Validade judicial garantida',
      'Instalação de câmeras com monitoramento 24h',
      'Relatório técnico pericial completo'
    ],
    precoBase: 'A partir de R$ 8.000',
    prazo: '5-15 dias',
    badge: 'VALIDADO POR PERITO OFICIAL',
    idealPara: 'Processos judiciais, provas criminais, segurança patrimonial'
  },
  {
    id: 'consultoria-capacitacao',
    nome: 'Consultoria & Capacitação',
    descricao: 'Treinamento em OSINT e consultoria estratégica para investigação com metodologia forense validada.',
    cor: 'green',
    icon: Users,
    servicos: ['treinamento-investigacao-digital', 'consultoria-estrategica'],
    caracteristicas: [
      'Instrutora: Danielle Kaloi',
      'Validação técnica: Ibsen Maciel (Perito Criminal)',
      'Formato: presencial ou remoto',
      'Duração: 2-8 horas (customizável)',
      'Certificado de participação',
      'Plano de investigação customizado',
      'Material didático incluído'
    ],
    precoBase: 'A partir de R$ 3.500',
    prazo: 'Sob agendamento',
    badge: 'PARA EMPRESAS',
    idealPara: 'Advogados, investigadores, analistas, equipes de compliance'
  }
];
