"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BlogPost,
  BlogTopic,
  BlogFilters,
  BlogPagination,
  BLOG_TOPICS,
  BLOG_AUTHORS,
  ContentType,
  SkillLevel
} from "@/types/blog";

// Função para gerar imagem placeholder com tema específico
const getPlaceholderImage = (seed: string, topic: string) => {
  // Usando picsum.photos com seed para consistência
  return `https://picsum.photos/seed/${seed}/800/450`;
};

// Dados mock para desenvolvimento - será substituído por API real
// Alinhado ao Posicionamento B: Autoridade Forense + SaaS
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
  }
];

interface UseBlogReturn {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  popularPosts: BlogPost[];
  topics: BlogTopic[];
  pagination: BlogPagination;
  loading: boolean;
  error: string | null;
  filters: BlogFilters;
  setFilters: (filters: BlogFilters) => void;
  setPage: (page: number) => void;
  refetch: () => void;
}

export function useBlog(initialFilters?: BlogFilters): UseBlogReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BlogFilters>(initialFilters || {});
  const [pagination, setPagination] = useState<BlogPagination>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Substituir por chamada real à API
      // const response = await fetchAPI<BlogResponse>('/blog/posts', { params: { ...filters, page: pagination.page } });

      // Simulação com dados mock
      await new Promise(resolve => setTimeout(resolve, 400));

      let filteredPosts = [...MOCK_POSTS];

      // Filtro por tópico
      if (filters.topic) {
        filteredPosts = filteredPosts.filter(
          post => post.topic.slug === filters.topic
        );
      }

      // Filtro por tipo de conteúdo
      if (filters.contentType) {
        filteredPosts = filteredPosts.filter(
          post => post.contentType === filters.contentType
        );
      }

      // Filtro por nível de habilidade
      if (filters.skillLevel) {
        filteredPosts = filteredPosts.filter(
          post => post.skillLevel === filters.skillLevel
        );
      }

      // Filtro por tag
      if (filters.tag) {
        filteredPosts = filteredPosts.filter(
          post => post.tags.includes(filters.tag!)
        );
      }

      // Filtro por busca textual
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPosts = filteredPosts.filter(
          post =>
            post.title.toLowerCase().includes(searchLower) ||
            post.excerpt.toLowerCase().includes(searchLower) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
            post.topic.name.toLowerCase().includes(searchLower)
        );
      }

      // Filtro por autor
      if (filters.author) {
        filteredPosts = filteredPosts.filter(
          post => post.author.id === filters.author
        );
      }

      // Ordenar por data (mais recente primeiro)
      filteredPosts.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      // Paginação
      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pagination.limit);

      setPosts(paginatedPosts);
      setPagination(prev => ({
        ...prev,
        total,
        totalPages
      }));
    } catch (err) {
      setError("Erro ao carregar posts do blog");
      console.error("Erro ao buscar posts:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Reset da página quando filtros mudam
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters]);

  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const featuredPosts = MOCK_POSTS.filter(post => post.featured).slice(0, 3);
  const popularPosts = MOCK_POSTS.filter(post => post.popular).slice(0, 5);

  return {
    posts,
    featuredPosts,
    popularPosts,
    topics: BLOG_TOPICS,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    setPage,
    refetch: fetchPosts
  };
}

// Hook para buscar um post específico
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 300));

        const foundPost = MOCK_POSTS.find(p => p.slug === slug);
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError("Post não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar o post");
        console.error("Erro ao buscar post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return { post, loading, error };
}

// Hook para buscar posts relacionados
export function useRelatedPosts(currentPost: BlogPost | null, limit = 3) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!currentPost) {
      setRelatedPosts([]);
      return;
    }

    // Buscar posts do mesmo tópico ou com tags em comum
    const related = MOCK_POSTS
      .filter(post => post.id !== currentPost.id)
      .map(post => {
        let score = 0;

        // Mesmo tópico = +3 pontos
        if (post.topic.id === currentPost.topic.id) score += 3;

        // Mesmo tipo de conteúdo = +2 pontos
        if (post.contentType === currentPost.contentType) score += 2;

        // Tags em comum = +1 ponto cada
        const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag));
        score += commonTags.length;

        return { post, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);

    setRelatedPosts(related);
  }, [currentPost, limit]);

  return relatedPosts;
}
