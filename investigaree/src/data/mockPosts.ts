/**
 * Mock Blog Posts Data
 * Can be imported by both client and server
 */

import { BlogPost, BLOG_TOPICS, BLOG_AUTHORS } from "@/types/blog";

// Mapeamento de imagens reais do Unsplash para cada post
const BLOG_IMAGES: Record<string, string> = {
  // Red Flags & Alertas
  "red-flags-cpf": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=675&fit=crop",
  "relationship-check": "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=1200&h=675&fit=crop",
  "romance-scam": "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=1200&h=675&fit=crop",

  // Perícia e Forense
  "perito-forense": "https://images.unsplash.com/photo-1566933293069-b55c7f326dd4?w=1200&h=675&fit=crop",
  "chain-custody": "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&h=675&fit=crop",

  // OSINT e Consultas
  "cpf-consulta": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=675&fit=crop",
  "due-diligence-brasil": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&h=675&fit=crop",
  "gov-apis": "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=675&fit=crop",
  "lgpd-compliance": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=675&fit=crop",

  // Due Diligence e Negócios
  "due-diligence": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=675&fit=crop",
  "business-partner": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=675&fit=crop",
  "supplier-check": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=675&fit=crop",
  "startup-investor": "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&h=675&fit=crop",

  // Família e Segurança
  "domestic-staff": "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=1200&h=675&fit=crop",

  // Patrimônio e Divórcio
  "divorce-assets": "https://images.unsplash.com/photo-1450101215322-bf5cd27642fc?w=1200&h=675&fit=crop",
  "shell-companies": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=675&fit=crop",

  // Cases
  "case-domestic-security": "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=1200&h=675&fit=crop",
  "case-digital-stalker": "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=1200&h=675&fit=crop",
  "case-forensic-operation": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=675&fit=crop",
  "case-corporate-espionage": "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=675&fit=crop",
  "case-study-investor": "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&h=675&fit=crop",
  "case-study-divorce": "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1200&h=675&fit=crop",
  "case-national-operation": "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=1200&h=675&fit=crop",
};

const getPlaceholderImage = (seed: string, topic?: string) => {
  return BLOG_IMAGES[seed] || `https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=675&fit=crop`;
};

export const MOCK_POSTS: BlogPost[] = [
  // ===== METODOLOGIA FORENSE (Autoridade do Perito) =====
  {
    id: "1",
    title: "Como um Perito Criminal Oficial Analisa Evidências Digitais",
    slug: "como-perito-criminal-analisa-evidencias-digitais",
    excerpt: "Entenda a metodologia científica utilizada por peritos criminais oficiais para garantir a validade jurídica de evidências digitais.",
    content: "",
    coverImage: getPlaceholderImage("perito-forense", "authority"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel - Perito
    contentType: "artigo",
    topic: BLOG_TOPICS[0], // Metodologia Forense
    skillLevel: "iniciante",
    tags: ["perícia", "evidência digital", "cadeia de custódia", "laudo", "metodologia"],
    publishedAt: "2025-12-01T10:00:00Z",
    readingTime: 12,
    featured: true,
    popular: true,
    views: 4521
  },
  {
    id: "2",
    title: "Cadeia de Custódia Digital: O que Valida uma Prova em Juízo",
    slug: "cadeia-custodia-digital-prova-juizo",
    excerpt: "Aprenda os princípios fundamentais que tornam uma evidência digital admissível em processos judiciais.",
    content: "",
    coverImage: getPlaceholderImage("chain-custody", "legal"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel
    contentType: "artigo",
    topic: BLOG_TOPICS[0], // Metodologia Forense
    skillLevel: "intermediario",
    tags: ["cadeia de custódia", "prova digital", "tribunal", "laudo", "perícia"],
    publishedAt: "2025-11-28T14:30:00Z",
    readingTime: 10,
    featured: true,
    views: 3156
  },

  // ===== OSINT BRASIL (Core do Produto) =====
  {
    id: "3",
    title: "Guia Completo: Como Consultar CPF em Fontes Públicas Legalmente",
    slug: "guia-consultar-cpf-fontes-publicas-legalmente",
    excerpt: "Tutorial passo a passo para verificar informações de CPF usando apenas fontes públicas oficiais do governo brasileiro.",
    content: "",
    coverImage: getPlaceholderImage("cpf-consulta", "osint"),
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[2], // OSINT Brasil
    skillLevel: "iniciante",
    tags: ["cpf", "receita federal", "fontes públicas", "verificação", "lgpd"],
    publishedAt: "2025-11-25T09:00:00Z",
    readingTime: 15,
    featured: true,
    popular: true,
    views: 8234
  },
  {
    id: "4",
    title: "TSE, CEIS e CNEP: As 3 Consultas Essenciais em Due Diligence",
    slug: "tse-ceis-cnep-consultas-essenciais-due-diligence",
    excerpt: "Descubra como cruzar dados do TSE (candidaturas), CEIS (empresas sancionadas) e CNEP (pessoas sancionadas) em investigações.",
    content: "",
    coverImage: getPlaceholderImage("due-diligence-brasil", "osint"),
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[2], // OSINT Brasil
    skillLevel: "intermediario",
    tags: ["tse", "ceis", "cnep", "due diligence", "sanções", "background check"],
    publishedAt: "2025-11-22T11:00:00Z",
    readingTime: 18,
    featured: false,
    popular: true,
    views: 5432
  },

  // ===== DUE DILIGENCE =====
  {
    id: "5",
    title: "O que é Due Diligence Digital e Por Que Você Precisa",
    slug: "o-que-e-due-diligence-digital-porque-precisa",
    excerpt: "Entenda como a verificação de integridade digital pode proteger seu patrimônio, investimentos e família.",
    content: "",
    coverImage: getPlaceholderImage("due-diligence", "business"),
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "artigo",
    topic: BLOG_TOPICS[3], // Due Diligence
    skillLevel: "iniciante",
    tags: ["due diligence", "verificação", "patrimônio", "proteção", "background check"],
    publishedAt: "2025-11-18T14:00:00Z",
    readingTime: 8,
    featured: false,
    popular: true,
    views: 6789
  },

  // ===== PROTEÇÃO FAMILIAR =====
  {
    id: "6",
    title: "Como Verificar Funcionários Domésticos: Babás, Motoristas e Cuidadores",
    slug: "como-verificar-funcionarios-domesticos-babas-motoristas",
    excerpt: "Guia prático para fazer background check de funcionários domésticos antes de confiar sua família a eles.",
    content: "",
    coverImage: getPlaceholderImage("domestic-staff", "family"),
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[4], // Proteção Familiar
    skillLevel: "iniciante",
    tags: ["funcionários", "babá", "motorista", "cuidador", "verificação", "família"],
    publishedAt: "2025-11-15T16:00:00Z",
    readingTime: 12,
    featured: false,
    views: 4234
  },
  {
    id: "7",
    title: "5 Red Flags em Novos Relacionamentos que Você Pode Verificar Online",
    slug: "5-red-flags-relacionamentos-verificar-online",
    excerpt: "Sinais de alerta que podem ser investigados em fontes públicas antes de se comprometer em um novo relacionamento.",
    content: "",
    coverImage: getPlaceholderImage("relationship-check", "family"),
    author: BLOG_AUTHORS[2], // Equipe Investigaree
    contentType: "artigo",
    topic: BLOG_TOPICS[4], // Proteção Familiar
    skillLevel: "iniciante",
    tags: ["relacionamento", "red flag", "verificação", "golpe", "fraude afetiva"],
    publishedAt: "2025-11-12T10:00:00Z",
    readingTime: 7,
    featured: false,
    popular: true,
    views: 12543
  },

  // ===== PROTEÇÃO EMPRESARIAL =====
  {
    id: "8",
    title: "Background Check de Sócios: O Que Todo Empreendedor Deveria Verificar",
    slug: "background-check-socios-empreendedor-verificar",
    excerpt: "Checklist completo de verificações essenciais antes de formalizar uma sociedade empresarial.",
    content: "",
    coverImage: getPlaceholderImage("business-partner", "corporate"),
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "artigo",
    topic: BLOG_TOPICS[5], // Proteção Empresarial
    skillLevel: "intermediario",
    tags: ["sócios", "sociedade", "background check", "fraude corporativa", "cnpj"],
    publishedAt: "2025-11-10T08:00:00Z",
    readingTime: 14,
    featured: false,
    views: 3456
  },
  {
    id: "9",
    title: "Como Verificar Fornecedores: Evitando Fraudes na Cadeia de Suprimentos",
    slug: "como-verificar-fornecedores-evitar-fraudes",
    excerpt: "Metodologia para due diligence de fornecedores usando fontes públicas brasileiras.",
    content: "",
    coverImage: getPlaceholderImage("supplier-check", "corporate"),
    author: BLOG_AUTHORS[2], // Equipe
    contentType: "tutorial",
    topic: BLOG_TOPICS[5], // Proteção Empresarial
    skillLevel: "intermediario",
    tags: ["fornecedores", "fraude", "due diligence", "cnpj", "ceis"],
    publishedAt: "2025-11-08T14:00:00Z",
    readingTime: 16,
    featured: false,
    views: 2876
  },

  // ===== PROTEÇÃO DE INVESTIMENTOS =====
  {
    id: "10",
    title: "Due Diligence para Investidores: Como Verificar Fundadores de Startups",
    slug: "due-diligence-investidores-verificar-fundadores-startups",
    excerpt: "O checklist que todo investidor anjo deveria seguir antes de investir em uma startup.",
    content: "",
    coverImage: getPlaceholderImage("startup-investor", "investment"),
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "artigo",
    topic: BLOG_TOPICS[6], // Proteção de Investimentos
    skillLevel: "intermediario",
    tags: ["startup", "investidor", "fundador", "due diligence", "m&a"],
    publishedAt: "2025-11-05T10:00:00Z",
    readingTime: 15,
    featured: false,
    views: 4123
  },

  // ===== DIVÓRCIO & PATRIMÔNIO =====
  {
    id: "11",
    title: "Ocultação de Patrimônio em Divórcio: Como Identificar Bens Escondidos",
    slug: "ocultacao-patrimonio-divorcio-identificar-bens-escondidos",
    excerpt: "Técnicas legais para descobrir bens ocultos em processos de separação usando fontes públicas.",
    content: "",
    coverImage: getPlaceholderImage("divorce-assets", "patrimony"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel - Perito
    contentType: "artigo",
    topic: BLOG_TOPICS[7], // Divórcio & Patrimônio
    skillLevel: "intermediario",
    tags: ["divórcio", "ocultação de bens", "patrimônio", "investigação conjugal", "separação"],
    publishedAt: "2025-11-02T09:00:00Z",
    readingTime: 18,
    featured: true,
    popular: true,
    views: 9876
  },
  {
    id: "12",
    title: "Empresas em Nome de Laranjas: Como Descobrir Vínculos Ocultos",
    slug: "empresas-laranjas-descobrir-vinculos-ocultos",
    excerpt: "Metodologia forense para identificar empresas registradas em nome de terceiros para ocultar patrimônio.",
    content: "",
    coverImage: getPlaceholderImage("shell-companies", "investigation"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel
    contentType: "artigo",
    topic: BLOG_TOPICS[7], // Divórcio & Patrimônio
    skillLevel: "avancado",
    tags: ["laranja", "empresa", "ocultação", "vínculos", "qsa", "cnpj"],
    publishedAt: "2025-10-28T11:00:00Z",
    readingTime: 20,
    featured: false,
    views: 5432
  },

  // ===== CASES PRÁTICOS (Reais - Anonimizados) =====
  {
    id: "13",
    title: "Case: Doméstica de 8 Anos Repassava Rotina da Família para Quadrilha",
    slug: "case-domestica-vazava-informacoes-quadrilha",
    excerpt: "Como a análise de mudanças patrimoniais suspeitas revelou que funcionária de confiança estava colaborando com criminosos para planejar sequestro.",
    content: "",
    coverImage: getPlaceholderImage("case-domestic-security", "case"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel - Perito
    contentType: "case-study",
    topic: BLOG_TOPICS[8], // Cases Práticos
    skillLevel: "iniciante",
    tags: ["case study", "funcionários", "segurança familiar", "sequestro", "proteção"],
    publishedAt: "2025-12-01T10:00:00Z",
    readingTime: 12,
    featured: true,
    popular: true,
    views: 8934
  },
  {
    id: "14",
    title: "Case: Predador Digital Monitorava Adolescente por 6 Meses Sem a Família Saber",
    slug: "case-predador-digital-stalker-adolescente",
    excerpt: "Investigação digital identificou stalker que se passava por colega de escola para monitorar adolescente de 15 anos. Ação preventiva evitou encontro presencial.",
    content: "",
    coverImage: getPlaceholderImage("case-digital-stalker", "case"),
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "case-study",
    topic: BLOG_TOPICS[8], // Cases Práticos
    skillLevel: "iniciante",
    tags: ["case study", "stalker", "proteção familiar", "adolescentes", "redes sociais", "predador"],
    publishedAt: "2025-11-28T14:00:00Z",
    readingTime: 10,
    featured: true,
    popular: true,
    views: 15234
  },
  {
    id: "19",
    title: "Case: Operação Castelo de Cartas - Perícia Forense em Tempo Real",
    slug: "case-operacao-castelo-cartas-pericia-forense",
    excerpt: "Bastidores de como a perícia forense digital com extração de dados in loco permitiu laudos no mesmo dia em operação contra o crime organizado.",
    content: "",
    coverImage: getPlaceholderImage("case-forensic-operation", "case"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel - Perito
    contentType: "case-study",
    topic: BLOG_TOPICS[8], // Cases Práticos
    skillLevel: "intermediario",
    tags: ["case study", "perícia forense", "operação policial", "cellebrite", "crime organizado"],
    publishedAt: "2025-11-25T09:00:00Z",
    readingTime: 15,
    featured: true,
    popular: true,
    views: 12456
  },
  {
    id: "20",
    title: "Case: Ex-Sócio Contratou Detetives para Chantagear Família",
    slug: "case-ex-socio-chantagem-contra-inteligencia",
    excerpt: "Como a contra-inteligência empresarial identificou e documentou tentativa de chantagem por ex-sócio vingativo, permitindo ação judicial preventiva.",
    content: "",
    coverImage: getPlaceholderImage("case-corporate-espionage", "case"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel
    contentType: "case-study",
    topic: BLOG_TOPICS[8], // Cases Práticos
    skillLevel: "intermediario",
    tags: ["case study", "contra-inteligência", "chantagem", "sócio", "proteção empresarial"],
    publishedAt: "2025-11-20T11:00:00Z",
    readingTime: 14,
    featured: false,
    popular: true,
    views: 9876
  },
  {
    id: "21",
    title: "Case: Investidor Evitou Prejuízo de R$2M ao Descobrir Fraude Oculta do Fundador",
    slug: "case-investidor-evitou-prejuizo-due-diligence",
    excerpt: "Due diligence digital revelou que fundador de startup 'promissora' tinha histórico de fraude e processos não divulgados.",
    content: "",
    coverImage: getPlaceholderImage("case-study-investor", "case"),
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "case-study",
    topic: BLOG_TOPICS[8], // Cases Práticos
    skillLevel: "iniciante",
    tags: ["case study", "investidor", "fraude", "startup", "due diligence"],
    publishedAt: "2025-11-15T14:00:00Z",
    readingTime: 10,
    featured: false,
    popular: true,
    views: 7654
  },
  {
    id: "22",
    title: "Case: Mulher Descobriu R$800 Mil em Patrimônio Oculto Durante Divórcio",
    slug: "case-patrimonio-oculto-divorcio-empresas-laranjas",
    excerpt: "Investigação patrimonial forense revelou rede de empresas em nome de terceiros e imóveis não declarados pelo cônjuge.",
    content: "",
    coverImage: getPlaceholderImage("case-study-divorce", "case"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel
    contentType: "case-study",
    topic: BLOG_TOPICS[8], // Cases Práticos
    skillLevel: "iniciante",
    tags: ["case study", "divórcio", "patrimônio oculto", "laranjas", "investigação patrimonial"],
    publishedAt: "2025-11-10T10:00:00Z",
    readingTime: 12,
    featured: false,
    popular: true,
    views: 11234
  },
  {
    id: "23",
    title: "Case: Operação Nacional Desarticulou Quadrilha com 34 Prisões em SP",
    slug: "case-operacao-nacional-cibercrimes-34-prisoes",
    excerpt: "Como a perícia forense digital do Pará contribuiu para operação interestadual de combate a crimes cibernéticos com alcance nacional.",
    content: "",
    coverImage: getPlaceholderImage("case-national-operation", "case"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel
    contentType: "case-study",
    topic: BLOG_TOPICS[8], // Cases Práticos
    skillLevel: "avancado",
    tags: ["case study", "operação policial", "cibercrimes", "perícia forense", "crime organizado"],
    publishedAt: "2025-11-05T08:00:00Z",
    readingTime: 18,
    featured: false,
    popular: true,
    views: 8543
  },

  // ===== RED FLAGS =====
  {
    id: "15",
    title: "10 Red Flags em CPF que Indicam Risco de Fraude",
    slug: "10-red-flags-cpf-indicam-risco-fraude",
    excerpt: "Aprenda a identificar sinais de alerta ao analisar o histórico de um CPF em fontes públicas.",
    content: "",
    coverImage: getPlaceholderImage("red-flags-cpf", "alert"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel
    contentType: "artigo",
    topic: BLOG_TOPICS[9], // Red Flags
    skillLevel: "intermediario",
    tags: ["red flag", "cpf", "fraude", "golpe", "alerta", "verificação"],
    publishedAt: "2025-10-15T09:00:00Z",
    readingTime: 12,
    featured: false,
    popular: true,
    views: 8765
  },
  {
    id: "16",
    title: "Sinais de Golpe do Tinder: Como Verificar Antes de Conhecer Pessoalmente",
    slug: "sinais-golpe-tinder-verificar-antes-conhecer",
    excerpt: "Red flags em perfis de aplicativos de relacionamento e como fazer uma verificação básica.",
    content: "",
    coverImage: getPlaceholderImage("romance-scam", "alert"),
    author: BLOG_AUTHORS[2], // Equipe
    contentType: "artigo",
    topic: BLOG_TOPICS[9], // Red Flags
    skillLevel: "iniciante",
    tags: ["golpe", "tinder", "relacionamento", "fraude afetiva", "red flag"],
    publishedAt: "2025-10-10T09:00:00Z",
    readingTime: 8,
    featured: false,
    views: 15432
  },

  // ===== ENTREVISTAS =====
  {
    id: "24",
    title: "Ibsen Maciel: 1º Lugar Polícia Científica do Pará - A Trajetória de 5 Anos até a Aprovação",
    slug: "ibsen-maciel-1-lugar-policia-cientifica-para-trajetoria",
    excerpt: "Em entrevista exclusiva, Ibsen Maciel conta como saiu do setor privado, passou em 1º lugar no Exército e conquistou o 1º lugar na Polícia Científica do Pará após 5 anos de dedicação.",
    content: "",
    coverImage: "https://img.youtube.com/vi/9K1FW2t1cLs/maxresdefault.jpg",
    author: BLOG_AUTHORS[0], // Ibsen Maciel
    contentType: "entrevista",
    topic: BLOG_TOPICS[0], // Metodologia Forense
    skillLevel: "iniciante",
    tags: ["ibsen maciel", "perito criminal", "polícia científica", "concurso público", "aprovação", "trajetória", "exército"],
    publishedAt: "2025-12-04T10:00:00Z",
    readingTime: 15,
    featured: true,
    popular: true,
    views: 876
  },

  // ===== DATAS COMEMORATIVAS =====
  {
    id: "25",
    title: "4 de Dezembro: Dia Nacional do Perito Criminal - Uma Homenagem aos Guardiões da Verdade",
    slug: "dia-do-perito-criminal-4-dezembro-homenagem",
    excerpt: "Hoje celebramos o Dia Nacional do Perito Criminal, instituído pela Lei 11.654/2008. Uma homenagem a todos os profissionais que dedicam suas vidas à busca da verdade técnica e científica.",
    content: "",
    coverImage: "/images/dia-perito-criminal.jpg",
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "artigo",
    topic: BLOG_TOPICS[0], // Metodologia Forense
    skillLevel: "iniciante",
    tags: ["dia do perito criminal", "4 de dezembro", "perícia criminal", "Otacílio Souza Filho", "homenagem", "forense"],
    publishedAt: "2025-12-04T08:00:00Z",
    readingTime: 8,
    featured: true,
    popular: true,
    views: 0
  },
  {
    id: "26",
    title: "Dia do Perito Criminal: Homenagem a Ibsen Maciel, Nosso Advisory Board",
    slug: "dia-perito-criminal-homenagem-ibsen-maciel",
    excerpt: "Neste 4 de dezembro, celebramos o Dia do Perito Criminal com uma homenagem especial a Ibsen Maciel, Perito Criminal Oficial e membro do Advisory Board da Investigaree.",
    content: "",
    coverImage: "/images/dia-perito-criminal-ibsen.png",
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "artigo",
    topic: BLOG_TOPICS[0], // Metodologia Forense
    skillLevel: "iniciante",
    tags: ["ibsen maciel", "dia do perito criminal", "homenagem", "advisory board", "polícia científica", "perito criminal"],
    publishedAt: "2025-12-04T09:00:00Z",
    readingTime: 5,
    featured: true,
    popular: true,
    views: 0
  },

  // ===== LGPD & COMPLIANCE =====
  {
    id: "17",
    title: "Background Check e LGPD: O Que é Legal Consultar no Brasil",
    slug: "background-check-lgpd-legal-consultar-brasil",
    excerpt: "Entenda os limites legais da investigação digital e quais fontes podem ser consultadas sem violar a LGPD.",
    content: "",
    coverImage: getPlaceholderImage("lgpd-compliance", "legal"),
    author: BLOG_AUTHORS[0], // Ibsen Maciel
    contentType: "artigo",
    topic: BLOG_TOPICS[10], // LGPD & Compliance
    skillLevel: "iniciante",
    tags: ["lgpd", "compliance", "fontes públicas", "legal", "investigação"],
    publishedAt: "2025-10-05T09:00:00Z",
    readingTime: 10,
    featured: false,
    views: 4321
  },

  // ===== FERRAMENTAS =====
  {
    id: "18",
    title: "APIs Públicas do Governo Brasileiro para Investigação Digital",
    slug: "apis-publicas-governo-brasileiro-investigacao",
    excerpt: "Catálogo completo de APIs oficiais do governo que podem ser usadas em due diligence e background check.",
    content: "",
    coverImage: getPlaceholderImage("gov-apis", "tools"),
    author: BLOG_AUTHORS[2], // Equipe
    contentType: "tutorial",
    topic: BLOG_TOPICS[11], // Ferramentas
    skillLevel: "avancado",
    tags: ["api", "governo", "receita federal", "tse", "dados abertos"],
    publishedAt: "2025-10-01T09:00:00Z",
    readingTime: 20,
    featured: false,
    views: 3456
  },

  // ===== SÉRIE FONTES PÚBLICAS BRASIL (Posts Faltantes) =====
  {
    id: "27",
    title: "Receita Federal: Como Consultar CPF e CNPJ para Due Diligence",
    slug: "receita-federal-cpf-cnpj",
    excerpt: "Guia completo e atualizado para consultar CPF e CNPJ na Receita Federal - a fonte primária de toda investigação de due diligence no Brasil, com novidades de 2025.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&h=675&fit=crop",
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[2], // OSINT Brasil
    skillLevel: "iniciante",
    tags: ["cpf", "cnpj", "receita federal", "fontes públicas", "due diligence"],
    publishedAt: "2025-12-01T10:00:00Z",
    readingTime: 15,
    featured: true,
    popular: true,
    views: 8234
  },
  {
    id: "28",
    title: "TSE: Como Consultar Candidaturas, Patrimônio e Doações Eleitorais",
    slug: "tse-candidaturas-doacoes",
    excerpt: "Guia completo para consultar candidaturas, declarações de bens e doações eleitorais no Tribunal Superior Eleitoral - dados essenciais para identificar PEPs e mapear conexões políticas.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?w=1200&h=675&fit=crop",
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[2], // OSINT Brasil
    skillLevel: "iniciante",
    tags: ["tse", "candidaturas", "doações eleitorais", "pep"],
    publishedAt: "2025-12-02T10:00:00Z",
    readingTime: 18,
    featured: false,
    popular: true,
    views: 6543
  },
  {
    id: "29",
    title: "Portal da Transparência: Como Consultar CEIS e CNEP para Verificação de Sancionados",
    slug: "portal-transparencia-ceis-cnep",
    excerpt: "Guia completo sobre como consultar empresas e pessoas físicas sancionadas usando o CEIS e CNEP do Portal da Transparência - essencial para compliance e due diligence.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&h=675&fit=crop",
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[2], // OSINT Brasil
    skillLevel: "iniciante",
    tags: ["portal da transparência", "ceis", "cnep", "sancionados", "compliance"],
    publishedAt: "2025-12-07T10:00:00Z",
    readingTime: 16,
    featured: false,
    views: 5321
  },
  {
    id: "30",
    title: "Tribunais Brasileiros: Como Consultar Processos Judiciais para Due Diligence",
    slug: "tribunais-processos-judiciais",
    excerpt: "Aprenda a consultar processos judiciais no PJe e tribunais estaduais - descubra ações, execuções e litígios que impactam sua investigação de pessoas e empresas.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=1200&h=675&fit=crop",
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[2], // OSINT Brasil
    skillLevel: "iniciante",
    tags: ["processos judiciais", "pje", "tribunais", "due diligence"],
    publishedAt: "2025-12-07T11:00:00Z",
    readingTime: 20,
    featured: false,
    views: 4876
  },
  {
    id: "31",
    title: "INSS e Dataprev: Como Verificar Benefícios Sociais e Detectar Fraudes",
    slug: "inss-dataprev-beneficios",
    excerpt: "Aprenda a consultar benefícios previdenciários, CNIS (vínculos empregatícios) e detectar fraudes em auxílios sociais - ferramentas essenciais para investigação e compliance.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1200&h=675&fit=crop",
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[2], // OSINT Brasil
    skillLevel: "intermediario",
    tags: ["inss", "dataprev", "benefícios sociais", "cnis", "fraudes"],
    publishedAt: "2025-12-07T12:00:00Z",
    readingTime: 17,
    featured: false,
    views: 3987
  },
  {
    id: "32",
    title: "Juntas Comerciais: Como Investigar Histórico Societário e Vínculos Empresariais",
    slug: "juntas-comerciais-empresas",
    excerpt: "Guia completo para consultar Juntas Comerciais e descobrir alterações contratuais, vínculos societários ocultos e histórico empresarial completo no Brasil.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=675&fit=crop",
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[2], // OSINT Brasil
    skillLevel: "intermediario",
    tags: ["juntas comerciais", "vínculos societários", "qsa", "histórico empresarial"],
    publishedAt: "2025-12-07T13:00:00Z",
    readingTime: 19,
    featured: false,
    views: 4123
  },
  {
    id: "33",
    title: "Cartórios: Como Consultar Imóveis e Protestos para Descobrir Patrimônio Oculto",
    slug: "cartorios-imoveis-protestos",
    excerpt: "Guia completo para consultar cartórios de registro de imóveis e protestos - descubra patrimônio não declarado, dívidas ocultas e inadimplência em investigações.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=675&fit=crop",
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[2], // OSINT Brasil
    skillLevel: "intermediario",
    tags: ["cartórios", "registro de imóveis", "protestos", "patrimônio oculto"],
    publishedAt: "2025-12-07T14:00:00Z",
    readingTime: 22,
    featured: false,
    views: 5234
  },
  {
    id: "34",
    title: "DETRAN e Senatran: Como Consultar Veículos e Descobrir Patrimônio Móvel Oculto",
    slug: "detran-veiculos",
    excerpt: "Guia completo para consultar veículos, multas e CNH via DETRAN e Senatran - descubra patrimônio móvel não declarado e infrações que revelam padrões de comportamento.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=675&fit=crop",
    author: BLOG_AUTHORS[1], // Dani Kaloi
    contentType: "tutorial",
    topic: BLOG_TOPICS[2], // OSINT Brasil
    skillLevel: "iniciante",
    tags: ["detran", "senatran", "veículos", "multas", "patrimônio móvel"],
    publishedAt: "2025-12-07T15:00:00Z",
    readingTime: 18,
    featured: false,
    views: 4567
  }
];
