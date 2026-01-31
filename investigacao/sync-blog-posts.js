/**
 * Sync Script - Converte compiledPosts.ts para mockPosts.ts
 *
 * Este script lê os posts compilados do MDX e gera o array MOCK_POSTS
 * no formato correto do BlogPost interface.
 */

const fs = require('fs');
const path = require('path');

const compiledPostsPath = path.join(__dirname, 'src/data/compiledPosts.ts');
const mockPostsPath = path.join(__dirname, 'src/data/mockPosts.ts');

console.log('🔄 Sincronizando posts do blog...\n');

// Ler compiledPosts.ts
const compiledContent = fs.readFileSync(compiledPostsPath, 'utf-8');

// Extrair o objeto compiledPosts usando regex
const match = compiledContent.match(/export const compiledPosts: Record<string, { html: string; frontmatter: any }> = ({[\s\S]*?});/);

if (!match) {
  console.error('❌ Erro: Não foi possível extrair compiledPosts do arquivo');
  process.exit(1);
}

// Avaliar o objeto (cuidado: só use eval em scripts confiáveis!)
const compiledPostsObj = eval('(' + match[1] + ')');

// Contar posts
const slugs = Object.keys(compiledPostsObj);
console.log(`📚 Encontrados ${slugs.length} posts compilados\n`);

// Definir tópicos disponíveis
const BLOG_TOPICS = {
  'metodologia-forense': { id: "metodologia-forense", name: "Metodologia Forense", slug: "metodologia-forense", description: "Como peritos criminais analisam evidências digitais com rigor científico", icon: "Shield", color: "#D4AF37", order: 1 },
  'laboratorio-pericial': { id: "laboratorio-pericial", name: "Laboratório Pericial", slug: "laboratorio-pericial", description: "Análises técnicas detalhadas e procedimentos de perícia oficial", icon: "FlaskConical", color: "#1ABC9C", order: 2 },
  'osint-brasil': { id: "osint-brasil", name: "OSINT Brasil", slug: "osint-brasil", description: "Inteligência em fontes públicas brasileiras: TSE, Receita, CEIS, tribunais", icon: "Search", color: "#3498DB", order: 3 },
  'due-diligence': { id: "due-diligence", name: "Due Diligence", slug: "due-diligence", description: "Verificação de integridade de pessoas e empresas antes de decisões críticas", icon: "UserCheck", color: "#27C685", order: 4 },
  'protecao-familiar': { id: "protecao-familiar", name: "Proteção Familiar", slug: "protecao-familiar", description: "Segurança digital para famílias: funcionários domésticos, relacionamentos, filhos", icon: "Home", color: "#9B59B6", order: 5 },
  'protecao-empresarial': { id: "protecao-empresarial", name: "Proteção Empresarial", slug: "protecao-empresarial", description: "Background check corporativo, verificação de sócios e fornecedores", icon: "Building2", color: "#E67E22", order: 6 },
  'protecao-investimentos': { id: "protecao-investimentos", name: "Proteção de Investimentos", slug: "protecao-investimentos", description: "Due diligence para investidores: startups, M&A, fundadores", icon: "TrendingUp", color: "#2ECC71", order: 7 },
  'divorcio-patrimonio': { id: "divorcio-patrimonio", name: "Divórcio & Patrimônio", slug: "divorcio-patrimonio", description: "Proteção patrimonial em separações: ocultação de bens, investigação conjugal", icon: "Scale", color: "#E74C3C", order: 8 },
  'casos-praticos': { id: "casos-praticos", name: "Cases Práticos", slug: "casos-praticos", description: "Estudos de caso reais (anonimizados) de investigações bem-sucedidas", icon: "Briefcase", color: "#8E44AD", order: 9 },
  'red-flags': { id: "red-flags", name: "Red Flags", slug: "red-flags", description: "Sinais de alerta: como identificar fraudes, golpes e riscos ocultos", icon: "AlertTriangle", color: "#C0392B", order: 10 },
  'lgpd-compliance': { id: "lgpd-compliance", name: "LGPD & Compliance", slug: "lgpd-compliance", description: "Investigação legal: limites, fontes públicas e proteção de dados", icon: "FileCheck", color: "#34495E", order: 11 },
  'ferramentas': { id: "ferramentas-investigacao", name: "Ferramentas", slug: "ferramentas-investigacao", description: "Recursos, APIs e tecnologias para investigação digital", icon: "Wrench", color: "#627D98", order: 12 }
};

// Definir autores disponíveis
const BLOG_AUTHORS = {
  'ibsen-maciel': {
    id: "ibsen-maciel",
    name: "Ibsen Rodrigues Maciel",
    role: "Perito Criminal Oficial em Informática",
    avatar: "/team/ibsen-maciel.jpg",
    bio: "Perito Criminal Oficial em Computação Forense. Diretor Nacional da ANPAJ. Certificado CELLEBRITE, XRY e AXIOM. Conselheiro Técnico do Investigaree.",
    social: {
      linkedin: "https://linkedin.com/in/ibsenmaciel"
    }
  },
  'dani-kaloi': {
    id: "dani-kaloi",
    name: "Dani Kaloi",
    role: "Analista de Dados & Full Stack Developer",
    avatar: "/dani-kaloi.png",
    bio: "Analista de Dados e Desenvolvedora Full Stack. Especialista em investigação digital e automação de processos investigativos. Fundadora do Investigaree.",
    social: {
      linkedin: "https://linkedin.com/in/danikaloi"
    }
  },
  'investigaree': {
    id: "investigaree",
    name: "Equipe Investigaree",
    role: "Redação Técnica",
    avatar: "/favicon.svg",
    bio: "Conteúdo técnico produzido pela equipe editorial do Investigaree, validado por especialistas em perícia forense."
  }
};

// Converter para array de BlogPost
const mockPosts = slugs.map(slug => {
  const post = compiledPostsObj[slug];
  const fm = post.frontmatter;

  // Mapear authorId para objeto BlogAuthor
  const authorId = fm.authorId || 'dani-kaloi';
  const author = BLOG_AUTHORS[authorId] || BLOG_AUTHORS['dani-kaloi'];

  // Mapear topicId para objeto BlogTopic
  const topicId = fm.topicId || 'osint-brasil';
  const topic = BLOG_TOPICS[topicId] || BLOG_TOPICS['osint-brasil'];

  // Normalizar skillLevel (remover acentos)
  const skillLevel = fm.skillLevel === 'intermediário' ? 'intermediario' : fm.skillLevel;

  return {
    id: slug,
    slug: slug,
    title: fm.title,
    excerpt: fm.excerpt,
    content: post.html, // HTML já compilado
    coverImage: fm.coverImage,
    author: author, // Objeto BlogAuthor completo
    contentType: fm.contentType,
    topic: topic, // Objeto BlogTopic completo
    skillLevel: skillLevel,
    tags: fm.tags || [],
    publishedAt: fm.publishedAt,
    updatedAt: fm.updatedAt || fm.publishedAt,
    readingTime: fm.readingTime || 10,
    featured: fm.featured || false,
    popular: fm.popular || false,
    views: fm.views || 0,
  };
});

// Ordenar por data (mais recente primeiro)
mockPosts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

// Gerar código TypeScript
const tsCode = `/**
 * Blog Posts Data - Primary source of truth for all blog posts
 *
 * Updated: ${new Date().toISOString().split('T')[0]}
 * Total posts: ${mockPosts.length}
 *
 * IMPORTANT: Posts can have content in two ways:
 * 1. MDX files (compiled to HTML via compile-mdx-to-json.js)
 * 2. Direct HTML in the 'content' field (for quick publishing without build issues)
 *
 * This file is the single source of truth - compiledPosts.ts is optional.
 * All metadata and content should be maintained here for reliability.
 */

import { BlogPost } from "@/types/blog";

export const MOCK_POSTS: BlogPost[] = ${JSON.stringify(mockPosts, null, 2)};
`;

// Escrever arquivo
fs.writeFileSync(mockPostsPath, tsCode, 'utf-8');

console.log('✅ mockPosts.ts atualizado com sucesso!');
console.log(`📝 ${mockPosts.length} posts sincronizados`);
console.log(`\n📊 Estatísticas:`);

// Estatísticas
const stats = {
  total: mockPosts.length,
  featured: mockPosts.filter(p => p.featured).length,
  byContentType: {},
  bySkillLevel: {},
  byTopic: {},
};

mockPosts.forEach(post => {
  stats.byContentType[post.contentType] = (stats.byContentType[post.contentType] || 0) + 1;
  stats.bySkillLevel[post.skillLevel] = (stats.bySkillLevel[post.skillLevel] || 0) + 1;
  stats.byTopic[post.topic] = (stats.byTopic[post.topic] || 0) + 1;
});

console.log(`   - Total: ${stats.total}`);
console.log(`   - Em destaque: ${stats.featured}`);
console.log(`   - Por tipo:`, stats.byContentType);
console.log(`   - Por nível:`, stats.bySkillLevel);
console.log(`\n✨ Sincronização concluída!`);
