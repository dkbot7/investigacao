/**
 * Blog Posts Data - For Static Generation
 *
 * This file contains the blog posts slugs for generateStaticParams().
 * It's separate from useBlog.ts to avoid "use client" issues.
 */

// Slugs de todos os posts do blog para geração estática
export const BLOG_POST_SLUGS = [
  "como-perito-criminal-analisa-evidencias-digitais",
  "cadeia-custodia-digital-prova-juizo",
  "guia-consultar-cpf-fontes-publicas-legalmente",
  "tse-ceis-cnep-consultas-essenciais-due-diligence",
  "o-que-e-due-diligence-digital-porque-precisa",
  "como-verificar-funcionarios-domesticos-babas-motoristas",
  "5-red-flags-relacionamentos-verificar-online",
  "background-check-socios-empreendedor-verificar",
  "como-verificar-fornecedores-evitar-fraudes",
  "due-diligence-investidores-verificar-fundadores-startups",
  "ocultacao-patrimonio-divorcio-identificar-bens-escondidos",
  "empresas-laranjas-descobrir-vinculos-ocultos",
  "case-investidor-evitou-prejuizo-due-diligence",
  "case-mulher-descobriu-patrimonio-oculto-divorcio",
  "10-red-flags-cpf-indicam-risco-fraude",
  "sinais-golpe-tinder-verificar-antes-conhecer",
  "background-check-lgpd-legal-consultar-brasil",
  "apis-publicas-governo-brasileiro-investigacao"
];

export function getAllBlogSlugs() {
  return BLOG_POST_SLUGS.map((slug) => ({
    slug,
  }));
}
