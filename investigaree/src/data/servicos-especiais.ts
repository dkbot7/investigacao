import {
  Database, Scale, Video
} from 'lucide-react';

export interface ServicoEspecial {
  id: string;
  nome: string;
  descricao: string;
  icon: any;
  cor: 'blue' | 'purple' | 'orange';
  casoReal: string;
  caracteristicas: string[];
  tecnologias?: string[];
  precoBase: string;
  prazo: string;
  badge: string;
  paraQuem: string;
}

export const SERVICOS_ESPECIAIS: ServicoEspecial[] = [
  {
    id: 'coleta-dados-automatizada',
    nome: 'Coleta de Dados Automatizada',
    descricao: 'Automação inteligente de coleta de dados em portais públicos e privados, eliminando trabalho manual repetitivo.',
    icon: Database,
    cor: 'blue',
    casoReal: 'Transportadora com 1.000+ veículos precisava consultar diariamente status de licenciamento em portal governamental. Automatizamos todo o processo: o sistema consulta, extrai e consolida os dados em planilha Excel - reduzindo de 8h/dia de trabalho manual para 5min automatizados.',
    caracteristicas: [
      'Coleta automática em portais governamentais e privados',
      'Consultas em massa automatizadas (CPF, CNPJ, placas, etc.)',
      'Dados consolidados em Excel/CSV prontos para uso',
      'Execução agendada (diária, semanal ou mensal)',
      'Integração com seus sistemas internos via API',
      'Alertas automáticos quando houver mudanças',
      'Painel de monitoramento em tempo real'
    ],
    tecnologias: ['Automação Web', 'Python', 'Excel/CSV', 'APIs', 'Cloud Computing'],
    precoBase: 'A partir de R$ 2.500 (implantação) + R$ 500/mês',
    prazo: '7-15 dias',
    badge: 'ELIMINA TRABALHO MANUAL',
    paraQuem: 'Empresas com consultas repetitivas em portais, RH, compliance, frotas'
  },
  {
    id: 'investigacao-defensiva-criminal',
    nome: 'Investigação Defensiva Criminal',
    descricao: 'Investigação defensiva para auxiliar advogados criminais na organização de provas, mapeamento de evidências e análise de inquéritos.',
    icon: Scale,
    cor: 'purple',
    casoReal: 'Empresário preso preventivamente em operação policial. Estruturamos toda documentação defensiva: catalogação de evidências digitais, organização cronológica dos fatos, identificação de inconsistências no inquérito e preparação de material para audiências - tudo com metodologia forense.',
    caracteristicas: [
      'Organização estruturada de documentos processuais',
      'Catalogação de evidências digitais e físicas',
      'Análise técnica de laudos periciais (revisão)',
      'Identificação de inconsistências processuais',
      'Cronologia visual de eventos',
      'Preparação de material para defesa',
      'Apoio técnico para audiências'
    ],
    precoBase: 'A partir de R$ 5.000',
    prazo: '10-20 dias (conforme volume)',
    badge: 'DEFESA ESTRATÉGICA',
    paraQuem: 'Advogados criminalistas, escritórios de advocacia criminal, réus em processos complexos'
  },
  {
    id: 'venda-instalacao-seguranca',
    nome: 'Venda e Instalação de Segurança Eletrônica',
    descricao: 'Venda e instalação profissional de equipamentos de segurança eletrônica em todo o Brasil com garantia e suporte técnico completo.',
    icon: Video,
    cor: 'orange',
    casoReal: 'Cliente precisava de 6 câmeras Wi-Fi com instalação completa. Fornecemos 3 opções (econômica, padrão, premium) com equipamentos Intelbras, instalação profissional, configuração remota, treinamento e suporte técnico integral - tudo em uma solução turnkey.',
    caracteristicas: [
      'Venda de equipamentos de marcas líderes (Intelbras, Hikvision)',
      'Instalação profissional em todo o Brasil',
      'Configuração e parametrização completa',
      'Múltiplas opções de configuração (econômica, padrão, premium)',
      'Garantia estendida e suporte técnico',
      'Treinamento de uso para o cliente',
      'Manutenção preventiva e corretiva'
    ],
    tecnologias: ['Câmeras Intelbras IMX', 'Sistemas de alarme', 'Controle de acesso', 'CFTV profissional'],
    precoBase: 'A partir de R$ 1.500 (equipamentos + instalação)',
    prazo: '5-10 dias (projeto + instalação)',
    badge: 'ATENDIMENTO NACIONAL',
    paraQuem: 'Residências, empresas, condomínios, propriedades rurais em todo o Brasil'
  }
];
