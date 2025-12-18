// Tipos para o Blog - Investigaree
// Arquitetura Editorial inspirada em Forensic Focus, Blackpanda, Binalyze e Forensafe

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
  };
}

// ===== TIPOS DE CONTEÚDO (Content Types) =====
// Inspirado em Forensic Focus: News, Articles, Interviews, Case Studies, Reviews
export type ContentType =
  | "artigo"      // Artigos técnicos aprofundados
  | "noticia"     // Notícias e atualizações do setor
  | "tutorial"    // Guias passo a passo
  | "case-study"  // Estudos de caso práticos
  | "review"      // Resenhas de ferramentas/cursos
  | "entrevista"  // Entrevistas com especialistas
  | "whitepaper"  // Documentos técnicos extensos
  | "video"       // Conteúdo em vídeo
  | "podcast";    // Episódios de podcast

export interface ContentTypeInfo {
  id: ContentType;
  name: string;
  namePlural: string;
  description: string;
  icon: string; // nome do ícone Lucide
  color: string;
}

export const CONTENT_TYPES: ContentTypeInfo[] = [
  {
    id: "artigo",
    name: "Artigo",
    namePlural: "Artigos",
    description: "Análises técnicas aprofundadas",
    icon: "FileText",
    color: "#D4AF37"
  },
  {
    id: "noticia",
    name: "Notícia",
    namePlural: "Notícias",
    description: "Novidades e atualizações do setor",
    icon: "Newspaper",
    color: "#3498DB"
  },
  {
    id: "tutorial",
    name: "Tutorial",
    namePlural: "Tutoriais",
    description: "Guias práticos passo a passo",
    icon: "GraduationCap",
    color: "#1ABC9C"
  },
  {
    id: "case-study",
    name: "Case Study",
    namePlural: "Cases",
    description: "Estudos de caso reais",
    icon: "Briefcase",
    color: "#9B59B6"
  },
  {
    id: "review",
    name: "Review",
    namePlural: "Reviews",
    description: "Análises de ferramentas e cursos",
    icon: "Star",
    color: "#F39C12"
  },
  {
    id: "entrevista",
    name: "Entrevista",
    namePlural: "Entrevistas",
    description: "Conversas com especialistas",
    icon: "Mic",
    color: "#E74C3C"
  },
  {
    id: "whitepaper",
    name: "White Paper",
    namePlural: "White Papers",
    description: "Documentos técnicos extensos",
    icon: "BookOpen",
    color: "#627D98"
  },
  {
    id: "video",
    name: "Vídeo",
    namePlural: "Vídeos",
    description: "Conteúdo audiovisual",
    icon: "Play",
    color: "#E74C3C"
  },
  {
    id: "podcast",
    name: "Podcast",
    namePlural: "Podcasts",
    description: "Episódios em áudio",
    icon: "Headphones",
    color: "#8E44AD"
  }
];

// ===== TÓPICOS (Topics/Categories) =====
// Alinhado ao Posicionamento B: Autoridade Forense + SaaS
// Foco: Perito Criminal Oficial + Due Diligence Digital + Inteligência Patrimonial
export interface BlogTopic {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export const BLOG_TOPICS: BlogTopic[] = [
  // ===== AUTORIDADE FORENSE (Diferencial Técnico) =====
  {
    id: "metodologia-forense",
    name: "Metodologia Forense",
    slug: "metodologia-forense",
    description: "Como peritos criminais analisam evidências digitais com rigor científico",
    icon: "Shield",
    color: "#D4AF37", // Dourado - autoridade
    order: 1
  },
  {
    id: "laboratorio-pericial",
    name: "Laboratório Pericial",
    slug: "laboratorio-pericial",
    description: "Análises técnicas detalhadas e procedimentos de perícia oficial",
    icon: "FlaskConical",
    color: "#1ABC9C",
    order: 2
  },

  // ===== INTELIGÊNCIA DIGITAL (Core do Produto) =====
  {
    id: "osint-brasil",
    name: "OSINT Brasil",
    slug: "osint-brasil",
    description: "Inteligência em fontes públicas brasileiras: TSE, Receita, CEIS, tribunais",
    icon: "Search",
    color: "#3498DB",
    order: 3
  },
  {
    id: "due-diligence",
    name: "Due Diligence",
    slug: "due-diligence",
    description: "Verificação de integridade de pessoas e empresas antes de decisões críticas",
    icon: "UserCheck",
    color: "#27C685",
    order: 4
  },

  // ===== PROTEÇÃO PATRIMONIAL (Personas Alvo) =====
  {
    id: "protecao-familiar",
    name: "Proteção Familiar",
    slug: "protecao-familiar",
    description: "Segurança digital para famílias: funcionários domésticos, relacionamentos, filhos",
    icon: "Home",
    color: "#9B59B6",
    order: 5
  },
  {
    id: "protecao-empresarial",
    name: "Proteção Empresarial",
    slug: "protecao-empresarial",
    description: "Background check corporativo, verificação de sócios e fornecedores",
    icon: "Building2",
    color: "#E67E22",
    order: 6
  },
  {
    id: "protecao-investimentos",
    name: "Proteção de Investimentos",
    slug: "protecao-investimentos",
    description: "Due diligence para investidores: startups, M&A, fundadores",
    icon: "TrendingUp",
    color: "#2ECC71",
    order: 7
  },
  {
    id: "divorcio-patrimonio",
    name: "Divórcio & Patrimônio",
    slug: "divorcio-patrimonio",
    description: "Proteção patrimonial em separações: ocultação de bens, investigação conjugal",
    icon: "Scale",
    color: "#E74C3C",
    order: 8
  },

  // ===== CONHECIMENTO TÉCNICO (Autoridade) =====
  {
    id: "casos-praticos",
    name: "Cases Práticos",
    slug: "casos-praticos",
    description: "Estudos de caso reais (anonimizados) de investigações bem-sucedidas",
    icon: "Briefcase",
    color: "#8E44AD",
    order: 9
  },
  {
    id: "red-flags",
    name: "Red Flags",
    slug: "red-flags",
    description: "Sinais de alerta: como identificar fraudes, golpes e riscos ocultos",
    icon: "AlertTriangle",
    color: "#C0392B",
    order: 10
  },

  // ===== COMPLIANCE & LEGAL =====
  {
    id: "lgpd-compliance",
    name: "LGPD & Compliance",
    slug: "lgpd-compliance",
    description: "Investigação legal: limites, fontes públicas e proteção de dados",
    icon: "FileCheck",
    color: "#34495E",
    order: 11
  },

  // ===== FERRAMENTAS & RECURSOS =====
  {
    id: "ferramentas-investigacao",
    name: "Ferramentas",
    slug: "ferramentas-investigacao",
    description: "Recursos, APIs e tecnologias para investigação digital",
    icon: "Wrench",
    color: "#627D98",
    order: 12
  }
];

// ===== NÍVEIS DE HABILIDADE =====
// Inspirado em Blackpanda: Beginner, Intermediate, Advanced
export type SkillLevel = "iniciante" | "intermediario" | "avancado";

export interface SkillLevelInfo {
  id: SkillLevel;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export const SKILL_LEVELS: SkillLevelInfo[] = [
  {
    id: "iniciante",
    name: "Iniciante",
    description: "Conceitos fundamentais e introduções",
    color: "#27C685",
    icon: "Sprout"
  },
  {
    id: "intermediario",
    name: "Intermediário",
    description: "Conhecimento prático aplicado",
    color: "#F39C12",
    icon: "Flame"
  },
  {
    id: "avancado",
    name: "Avançado",
    description: "Técnicas especializadas e complexas",
    color: "#E74C3C",
    icon: "Rocket"
  }
];

// ===== INTERFACE DO POST ATUALIZADA =====
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;

  // Metadados de autoria
  author: BlogAuthor;

  // Arquitetura editorial
  contentType: ContentType;
  topic: BlogTopic;
  skillLevel: SkillLevel;
  tags: string[];

  // Datas
  publishedAt: string;
  updatedAt?: string;

  // Métricas
  readingTime: number; // em minutos
  featured: boolean;
  popular?: boolean;
  views?: number;

  // Mídia adicional
  videoUrl?: string;
  podcastUrl?: string;
  downloadUrl?: string; // para whitepapers

  // Série de conteúdo
  series?: {
    id: string;
    name: string;
    part: number;
  };
}

// ===== FILTROS ATUALIZADOS =====
export interface BlogFilters {
  contentType?: ContentType;
  topic?: string;
  skillLevel?: SkillLevel;
  tag?: string;
  search?: string;
  author?: string;
  // Ordenação
  sortBy?: 'date' | 'views' | 'readingTime' | 'title';
  sortOrder?: 'asc' | 'desc';
  // Filtro por data
  dateFrom?: string; // ISO date
  dateTo?: string;   // ISO date
}

// ===== OPÇÕES DE ORDENAÇÃO =====
export interface SortOption {
  id: 'date' | 'views' | 'readingTime' | 'title';
  name: string;
  description: string;
  icon: string;
}

export const SORT_OPTIONS: SortOption[] = [
  {
    id: 'date',
    name: 'Mais Recentes',
    description: 'Ordenar por data de publicação',
    icon: 'CalendarDays'
  },
  {
    id: 'views',
    name: 'Mais Populares',
    description: 'Ordenar por número de visualizações',
    icon: 'TrendingUp'
  },
  {
    id: 'readingTime',
    name: 'Tempo de Leitura',
    description: 'Ordenar por duração',
    icon: 'Clock'
  },
  {
    id: 'title',
    name: 'Alfabética',
    description: 'Ordenar por título',
    icon: 'SortAsc'
  }
];

export interface BlogPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BlogResponse {
  posts: BlogPost[];
  pagination: BlogPagination;
  topics: BlogTopic[];
  contentTypes: ContentTypeInfo[];
  skillLevels: SkillLevelInfo[];
}

// ===== SÉRIES DE CONTEÚDO =====
// Para conteúdo seriado como Forensafe faz com apps
export interface BlogSeries {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  posts: string[]; // IDs dos posts
  topic: BlogTopic;
  totalParts: number;
  status: "em_andamento" | "completa";
}

// Séries pré-definidas alinhadas ao posicionamento
export const BLOG_SERIES: Omit<BlogSeries, "posts" | "topic">[] = [
  {
    id: "fontes-publicas-brasil",
    name: "Fontes Públicas Brasil",
    slug: "fontes-publicas-brasil",
    description: "Série completa sobre como consultar cada fonte pública brasileira para investigação digital",
    coverImage: "/series/fontes-publicas.jpg",
    totalParts: 10,
    status: "em_andamento"
  },
  {
    id: "red-flags-por-persona",
    name: "Red Flags por Persona",
    slug: "red-flags-por-persona",
    description: "Sinais de alerta específicos para cada tipo de verificação: babá, sócio, fornecedor, cônjuge",
    coverImage: "/series/red-flags.jpg",
    totalParts: 6,
    status: "em_andamento"
  },
  {
    id: "casos-reais-anonimizados",
    name: "Casos Reais Anonimizados",
    slug: "casos-reais-anonimizados",
    description: "Estudos de caso detalhados de investigações bem-sucedidas, com metodologia e resultados",
    coverImage: "/series/casos-reais.jpg",
    totalParts: 12,
    status: "em_andamento"
  },
  {
    id: "metodologia-perito",
    name: "Na Visão do Perito",
    slug: "metodologia-perito",
    description: "Série exclusiva com Ibsen Maciel explicando metodologias de perícia oficial",
    coverImage: "/series/perito.jpg",
    totalParts: 8,
    status: "em_andamento"
  }
];

// ===== GLOSSÁRIO =====
// Inspirado em forense.io - termos técnicos explicados
export interface GlossaryTerm {
  id: string;
  term: string;
  slug: string;
  definition: string;
  relatedTerms?: string[];
  category: "forense" | "legal" | "osint" | "compliance" | "investigacao";
}

export const GLOSSARY_CATEGORIES = [
  { id: "forense", name: "Forense Digital", color: "#D4AF37" },
  { id: "legal", name: "Jurídico", color: "#E74C3C" },
  { id: "osint", name: "OSINT", color: "#3498DB" },
  { id: "compliance", name: "Compliance", color: "#27C685" },
  { id: "investigacao", name: "Investigação", color: "#9B59B6" }
];

// Termos iniciais do glossário
export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // ===== INVESTIGAÇÃO =====
  {
    id: "due-diligence",
    term: "Due Diligence",
    slug: "due-diligence",
    definition: "Processo de investigação e verificação de informações sobre uma pessoa ou empresa antes de tomar decisões importantes como investimentos, contratações ou parcerias. Envolve consultas a múltiplas fontes públicas e privadas para identificar riscos ocultos.",
    relatedTerms: ["background-check", "kyc", "kys"],
    category: "investigacao"
  },
  {
    id: "background-check",
    term: "Background Check",
    slug: "background-check",
    definition: "Verificação de antecedentes que inclui histórico criminal, financeiro, profissional e reputacional de uma pessoa ou empresa. No Brasil, deve respeitar a LGPD e utilizar apenas fontes públicas oficiais ou com consentimento.",
    relatedTerms: ["due-diligence", "red-flag", "lgpd"],
    category: "investigacao"
  },
  {
    id: "red-flag",
    term: "Red Flag",
    slug: "red-flag",
    definition: "Sinal de alerta que indica potencial risco, fraude ou irregularidade durante uma investigação. Exemplos incluem: CPF de pessoa falecida em uso, divergência de dados cadastrais, múltiplas empresas abertas em curto período ou presença em listas de sanções.",
    relatedTerms: ["due-diligence", "background-check", "fraude-identidade"],
    category: "investigacao"
  },

  // ===== COMPLIANCE - Os 4 Ks =====
  {
    id: "kyc",
    term: "KYC (Know Your Customer)",
    slug: "kyc",
    definition: "Conheça Seu Cliente - processo de verificação da identidade e avaliação de risco de clientes antes de estabelecer relações comerciais. Obrigatório para instituições financeiras e essencial para prevenção à lavagem de dinheiro.",
    relatedTerms: ["kys", "kye", "kyp", "compliance"],
    category: "compliance"
  },
  {
    id: "kys",
    term: "KYS (Know Your Supplier)",
    slug: "kys",
    definition: "Conheça Seu Fornecedor - processo de due diligence aplicado a fornecedores para verificar idoneidade, capacidade financeira e ausência de sanções antes de firmar contratos.",
    relatedTerms: ["kyc", "kye", "kyp", "due-diligence"],
    category: "compliance"
  },
  {
    id: "kye",
    term: "KYE (Know Your Employee)",
    slug: "kye",
    definition: "Conheça Seu Funcionário - verificação de antecedentes de candidatos e funcionários, incluindo histórico criminal, referências profissionais e situação cadastral. Legalmente permitido quando justificado pela atividade.",
    relatedTerms: ["kyc", "kys", "kyp", "background-check"],
    category: "compliance"
  },
  {
    id: "kyp",
    term: "KYP (Know Your Partner)",
    slug: "kyp",
    definition: "Conheça Seu Parceiro - due diligence aplicada a parceiros comerciais, sócios e investidores para identificar riscos reputacionais, conflitos de interesse e vínculos problemáticos.",
    relatedTerms: ["kyc", "kys", "kye", "due-diligence"],
    category: "compliance"
  },
  {
    id: "compliance",
    term: "Compliance",
    slug: "compliance",
    definition: "Conjunto de práticas que garantem que uma empresa atue em conformidade com leis, regulamentos e normas internas. Inclui processos de verificação de terceiros (4 Ks), prevenção à lavagem de dinheiro e gestão de riscos.",
    relatedTerms: ["kyc", "lgpd", "ceis", "cnep"],
    category: "compliance"
  },

  // ===== CPF E SITUAÇÕES CADASTRAIS =====
  {
    id: "cpf",
    term: "CPF",
    slug: "cpf",
    definition: "Cadastro de Pessoas Físicas - número de identificação fiscal único atribuído pela Receita Federal a cada cidadão brasileiro ou estrangeiro residente. Base para praticamente todas as verificações de due diligence no Brasil.",
    relatedTerms: ["receita-federal", "situacao-cadastral", "cnpj"],
    category: "investigacao"
  },
  {
    id: "situacao-cadastral",
    term: "Situação Cadastral do CPF",
    slug: "situacao-cadastral",
    definition: "Status do CPF perante a Receita Federal. Pode ser: Regular (ativo e sem pendências), Pendente (falta declaração), Suspensa (bloqueado temporariamente), Cancelada (fraude ou duplicidade), Nula (nunca deveria existir) ou Titular Falecido.",
    relatedTerms: ["cpf", "receita-federal", "fraude-identidade"],
    category: "investigacao"
  },
  {
    id: "fraude-identidade",
    term: "Fraude de Identidade",
    slug: "fraude-identidade",
    definition: "Crime que consiste no uso indevido de dados pessoais de terceiros para obter vantagens ilícitas. Inclui uso de CPF de pessoa falecida, documentos falsos e apropriação de identidade. 51% dos brasileiros foram vítimas de fraude em 2024.",
    relatedTerms: ["cpf", "red-flag", "phishing"],
    category: "investigacao"
  },
  {
    id: "phishing",
    term: "Phishing",
    slug: "phishing",
    definition: "Golpe digital que usa emails, mensagens ou sites falsos para enganar vítimas e roubar dados pessoais, senhas ou informações financeiras. Responsável por 21,6% das fraudes no Brasil em 2024.",
    relatedTerms: ["fraude-identidade", "engenharia-social"],
    category: "investigacao"
  },

  // ===== FONTES PÚBLICAS BRASILEIRAS =====
  {
    id: "receita-federal",
    term: "Receita Federal",
    slug: "receita-federal",
    definition: "Órgão responsável pela administração tributária federal no Brasil. Mantém cadastros de CPF e CNPJ, sendo a primeira fonte a ser consultada em qualquer processo de due diligence para validar a existência e regularidade de pessoas e empresas.",
    relatedTerms: ["cpf", "cnpj", "qsa"],
    category: "osint"
  },
  {
    id: "cnpj",
    term: "CNPJ",
    slug: "cnpj",
    definition: "Cadastro Nacional da Pessoa Jurídica - número de identificação fiscal de empresas no Brasil. A consulta revela razão social, data de abertura, situação cadastral, atividades econômicas, endereço, capital social e quadro societário (QSA).",
    relatedTerms: ["receita-federal", "qsa", "cpf"],
    category: "osint"
  },
  {
    id: "qsa",
    term: "QSA (Quadro de Sócios)",
    slug: "qsa",
    definition: "Quadro de Sócios e Administradores - seção da consulta de CNPJ que lista todos os sócios da empresa, suas qualificações (sócio-administrador, sócio, etc.), participação societária e CPFs (parcialmente mascarados). Informação valiosa para identificar vínculos.",
    relatedTerms: ["cnpj", "receita-federal", "vinculos-societarios"],
    category: "osint"
  },
  {
    id: "tse",
    term: "TSE (Tribunal Superior Eleitoral)",
    slug: "tse",
    definition: "Órgão máximo da Justiça Eleitoral brasileira. Mantém bases públicas de filiação partidária, histórico de candidaturas, declarações de bens de candidatos e doações eleitorais - dados valiosos para due diligence de pessoas politicamente expostas.",
    relatedTerms: ["divulgacandcontas", "filiacao-partidaria", "pep"],
    category: "osint"
  },
  {
    id: "divulgacandcontas",
    term: "DivulgaCandContas",
    slug: "divulgacandcontas",
    definition: "Sistema do TSE que disponibiliza informações sobre candidaturas desde 2004: dados pessoais, partido, patrimônio declarado, receitas e despesas de campanha. Atualizado de hora em hora durante períodos eleitorais.",
    relatedTerms: ["tse", "declaracao-bens"],
    category: "osint"
  },
  {
    id: "filiacao-partidaria",
    term: "Filiação Partidária",
    slug: "filiacao-partidaria",
    definition: "Vínculo formal entre um cidadão e um partido político. O TSE mantém registro público de todas as filiações, permitindo verificar se uma pessoa é ou foi filiada, a qual partido e desde quando.",
    relatedTerms: ["tse", "pep"],
    category: "osint"
  },
  {
    id: "portal-transparencia",
    term: "Portal da Transparência",
    slug: "portal-transparencia",
    definition: "Portal do governo federal que disponibiliza dados sobre gastos públicos, servidores, benefícios sociais, contratos e cadastros de sanções (CEIS, CNEP, CEPIM). Ferramenta essencial para verificar vínculos com o governo e sanções.",
    relatedTerms: ["ceis", "cnep", "cepim"],
    category: "osint"
  },
  {
    id: "ceis",
    term: "CEIS",
    slug: "ceis",
    definition: "Cadastro de Empresas Inidôneas e Suspensas - banco de dados que lista empresas e pessoas físicas impedidas de contratar com a administração pública por sanções administrativas. Consulta obrigatória em processos de compliance.",
    relatedTerms: ["cnep", "cepim", "portal-transparencia"],
    category: "compliance"
  },
  {
    id: "cnep",
    term: "CNEP",
    slug: "cnep",
    definition: "Cadastro Nacional de Empresas Punidas - registro de empresas sancionadas com base na Lei Anticorrupção (Lei 12.846/2013). Inclui multas, publicação de decisão e proibição de receber incentivos públicos.",
    relatedTerms: ["ceis", "cepim", "lei-anticorrupcao"],
    category: "compliance"
  },
  {
    id: "cepim",
    term: "CEPIM",
    slug: "cepim",
    definition: "Cadastro de Entidades Privadas Sem Fins Lucrativos Impedidas - lista de ONGs, associações e fundações impedidas de firmar parcerias ou receber recursos públicos.",
    relatedTerms: ["ceis", "cnep", "portal-transparencia"],
    category: "compliance"
  },

  // ===== JURÍDICO E LEGAL =====
  {
    id: "lgpd",
    term: "LGPD",
    slug: "lgpd",
    definition: "Lei Geral de Proteção de Dados (Lei 13.709/2018) - legislação que regula o tratamento de dados pessoais no Brasil. Permite verificações para proteção do crédito (Art. 7º, X) e prevenção à fraude, desde que com finalidade legítima.",
    relatedTerms: ["dados-pessoais", "consentimento", "compliance"],
    category: "legal"
  },
  {
    id: "dados-pessoais",
    term: "Dados Pessoais",
    slug: "dados-pessoais",
    definition: "Qualquer informação que permite identificar uma pessoa, direta ou indiretamente: nome, CPF, endereço, email, telefone, dados de localização, identificadores online. Protegidos pela LGPD.",
    relatedTerms: ["lgpd", "dados-sensiveis"],
    category: "legal"
  },
  {
    id: "dados-sensiveis",
    term: "Dados Sensíveis",
    slug: "dados-sensiveis",
    definition: "Categoria especial de dados pessoais com proteção reforçada pela LGPD: origem racial/étnica, convicção religiosa, opinião política, filiação sindical, dados de saúde, vida sexual, dados genéticos ou biométricos.",
    relatedTerms: ["lgpd", "dados-pessoais"],
    category: "legal"
  },

  // ===== FORENSE DIGITAL =====
  {
    id: "osint",
    term: "OSINT",
    slug: "osint",
    definition: "Open Source Intelligence - inteligência obtida a partir de fontes abertas e públicas. No Brasil, inclui consultas a Receita Federal, TSE, tribunais, Portal da Transparência e outras bases governamentais. Base da investigação digital legal.",
    relatedTerms: ["fontes-publicas", "due-diligence"],
    category: "osint"
  },
  {
    id: "fontes-publicas",
    term: "Fontes Públicas",
    slug: "fontes-publicas",
    definition: "Bases de dados disponibilizadas por órgãos governamentais para consulta pública: Receita Federal (CPF/CNPJ), TSE (candidaturas/filiações), Portal da Transparência (sanções), Tribunais (processos) e Juntas Comerciais (empresas).",
    relatedTerms: ["osint", "receita-federal", "tse", "portal-transparencia"],
    category: "osint"
  },
  {
    id: "cadeia-custodia",
    term: "Cadeia de Custódia",
    slug: "cadeia-custodia",
    definition: "Documentação cronológica que registra a posse, controle, transferência e análise de evidências, garantindo sua integridade e admissibilidade em juízo. Fundamental em perícias criminais.",
    relatedTerms: ["evidencia-digital", "laudo-pericial", "perito-criminal"],
    category: "forense"
  },
  {
    id: "laudo-pericial",
    term: "Laudo Pericial",
    slug: "laudo-pericial",
    definition: "Documento técnico elaborado por perito oficial ou assistente técnico que apresenta análise, metodologia e conclusões sobre evidências examinadas. Tem valor probatório em processos judiciais.",
    relatedTerms: ["cadeia-custodia", "perito-criminal"],
    category: "forense"
  },
  {
    id: "perito-criminal",
    term: "Perito Criminal",
    slug: "perito-criminal",
    definition: "Profissional concursado da Polícia Científica responsável por analisar vestígios e transformá-los em provas técnicas. No Brasil, a data de 4 de dezembro é o Dia Nacional do Perito Criminal (Lei 11.654/2008).",
    relatedTerms: ["laudo-pericial", "cadeia-custodia"],
    category: "forense"
  },
  {
    id: "evidencia-digital",
    term: "Evidência Digital",
    slug: "evidencia-digital",
    definition: "Informação armazenada ou transmitida em formato digital que pode ser usada como prova em investigações: arquivos, emails, mensagens, registros de acesso, metadados, histórico de navegação, etc.",
    relatedTerms: ["cadeia-custodia", "forense-digital"],
    category: "forense"
  },

  // ===== OUTROS TERMOS IMPORTANTES =====
  {
    id: "pep",
    term: "PEP (Pessoa Politicamente Exposta)",
    slug: "pep",
    definition: "Pessoa que ocupa ou ocupou cargo público relevante, ou tem relação familiar/próxima com quem ocupa. Requer due diligence reforçada por representar maior risco de corrupção e lavagem de dinheiro.",
    relatedTerms: ["tse", "kyc", "compliance"],
    category: "compliance"
  },
  {
    id: "vinculos-societarios",
    term: "Vínculos Societários",
    slug: "vinculos-societarios",
    definition: "Relações de participação em empresas como sócio, administrador ou acionista. A análise de vínculos revela conexões entre pessoas e empresas, essencial para identificar conflitos de interesse e redes de relacionamento.",
    relatedTerms: ["qsa", "cnpj", "due-diligence"],
    category: "investigacao"
  },
  {
    id: "declaracao-bens",
    term: "Declaração de Bens",
    slug: "declaracao-bens",
    definition: "Lista de patrimônio que candidatos são obrigados a apresentar ao TSE: imóveis, veículos, participações societárias, aplicações financeiras. Permite acompanhar evolução patrimonial ao longo das eleições.",
    relatedTerms: ["tse", "divulgacandcontas", "pep"],
    category: "osint"
  }
];

// ===== RECURSOS ADICIONAIS =====
// Inspirado em Forensic Focus: diretórios de cursos, ferramentas, etc.
export interface Resource {
  id: string;
  name: string;
  slug: string;
  description: string;
  type: "curso" | "ferramenta" | "api" | "livro" | "certificacao";
  url?: string;
  price?: "gratuito" | "pago" | "freemium";
  provider?: string;
  rating?: number;
  featured?: boolean;
}

export const RESOURCE_TYPES = [
  { id: "curso", name: "Cursos", icon: "GraduationCap", color: "#1ABC9C" },
  { id: "ferramenta", name: "Ferramentas", icon: "Wrench", color: "#3498DB" },
  { id: "api", name: "APIs", icon: "Code", color: "#9B59B6" },
  { id: "livro", name: "Livros", icon: "BookOpen", color: "#E67E22" }
];

// ===== NEWSLETTER =====
export interface NewsletterConfig {
  name: string;
  description: string;
  frequency: string;
  benefits: string[];
}

export const NEWSLETTER_CONFIG: NewsletterConfig = {
  name: "DFIR Brasil Newsletter",
  description: "Receba semanalmente as principais novidades em investigação digital, due diligence e proteção patrimonial",
  frequency: "Semanal (toda quinta-feira)",
  benefits: [
    "Alertas de novas fontes públicas disponíveis",
    "Cases práticos anonimizados exclusivos",
    "Dicas de red flags por setor",
    "Atualizações de legislação (LGPD, Marco Civil)",
    "Conteúdo exclusivo do Perito Criminal Oficial"
  ]
};

// ===== AUTORES PRÉ-DEFINIDOS =====
// Alinhado ao Posicionamento B: Autoridade Forense validada por Perito Criminal Oficial
export const BLOG_AUTHORS: BlogAuthor[] = [
  {
    id: "ibsen-maciel",
    name: "Ibsen Rodrigues Maciel",
    role: "Perito Criminal Oficial em Informática",
    avatar: "/team/ibsen-maciel.jpg",
    bio: "Perito Criminal Oficial em Computação Forense. Diretor Nacional da ANPAJ. Certificado CELLEBRITE, XRY e AXIOM. Conselheiro Técnico do Investigaree.",
    social: {
      linkedin: "https://linkedin.com/in/ibsenmaciel"
    }
  },
  {
    id: "dani-kaloi",
    name: "Dani Kaloi",
    role: "Analista de Dados & Full Stack Developer",
    avatar: "/dani-kaloi.png",
    bio: "Analista de Dados e Desenvolvedora Full Stack. Especialista em investigação digital e automação de processos investigativos. Fundadora do Investigaree.",
    social: {
      linkedin: "https://linkedin.com/in/danikaloi"
    }
  },
  {
    id: "investigaree",
    name: "Equipe Investigaree",
    role: "Redação Técnica",
    avatar: "/favicon.svg",
    bio: "Conteúdo técnico produzido pela equipe editorial do Investigaree, validado por especialistas em perícia forense."
  }
];

// ===== TAGS POPULARES =====
// Alinhado ao Posicionamento B: Due Diligence + Proteção Patrimonial + Autoridade Forense
export const POPULAR_TAGS = [
  // Due Diligence & Background Check
  "due diligence",
  "background check",
  "verificação",
  "cpf",
  "cnpj",

  // Fontes Públicas Brasil
  "receita federal",
  "tse",
  "ceis",
  "cnep",
  "tribunal",

  // Proteção Patrimonial
  "divórcio",
  "ocultação de bens",
  "patrimônio",
  "herança",

  // Proteção Empresarial
  "sócios",
  "fornecedores",
  "funcionários",
  "fraude corporativa",

  // Investimentos
  "startup",
  "investidor",
  "m&a",
  "fundador",

  // Metodologia Forense
  "perícia",
  "evidência digital",
  "cadeia de custódia",
  "laudo",

  // Compliance
  "lgpd",
  "compliance",
  "fontes públicas",

  // Red Flags
  "golpe",
  "fraude",
  "red flag",
  "alerta"
];

// ===== LEGACY SUPPORT =====
// Mantido para compatibilidade
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = BLOG_TOPICS.map(topic => ({
  id: topic.id,
  name: topic.name,
  slug: topic.slug,
  description: topic.description,
  color: topic.color
}));

export type ExpertiseLevel = SkillLevel;
export const EXPERTISE_LEVELS = SKILL_LEVELS.map(level => ({
  value: level.id,
  label: level.name
}));
