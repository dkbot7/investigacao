/**
 * Blog Posts Data - For Static Generation
 *
 * This file contains the blog posts slugs for generateStaticParams().
 * It's separate from useBlog.ts to avoid "use client" issues.
 */

// Slugs de todos os posts do blog para geração estática
export const BLOG_POST_SLUGS = [
  // Metodologia Forense
  "como-perito-criminal-analisa-evidencias-digitais",
  "cadeia-custodia-digital-prova-juizo",
  // OSINT Brasil
  "guia-consultar-cpf-fontes-publicas-legalmente",
  "tse-ceis-cnep-consultas-essenciais-due-diligence",
  // Due Diligence
  "o-que-e-due-diligence-digital-porque-precisa",
  // Proteção Familiar
  "como-verificar-funcionarios-domesticos-babas-motoristas",
  "5-red-flags-relacionamentos-verificar-online",
  // Proteção Empresarial
  "background-check-socios-empreendedor-verificar",
  "como-verificar-fornecedores-evitar-fraudes",
  // Proteção de Investimentos
  "due-diligence-investidores-verificar-fundadores-startups",
  // Divórcio & Patrimônio
  "ocultacao-patrimonio-divorcio-identificar-bens-escondidos",
  "empresas-laranjas-descobrir-vinculos-ocultos",
  // Cases Práticos (Reais - Anonimizados)
  "case-domestica-vazava-informacoes-quadrilha",
  "case-predador-digital-stalker-adolescente",
  "case-operacao-castelo-cartas-pericia-forense",
  "case-ex-socio-chantagem-contra-inteligencia",
  "case-investidor-evitou-prejuizo-due-diligence",
  "case-patrimonio-oculto-divorcio-empresas-laranjas",
  "case-operacao-nacional-cibercrimes-34-prisoes",
  // Red Flags
  "10-red-flags-cpf-indicam-risco-fraude",
  "sinais-golpe-tinder-verificar-antes-conhecer",
  // Entrevistas
  "ibsen-maciel-1-lugar-policia-cientifica-para-trajetoria",
  // Datas comemorativas
  "dia-do-perito-criminal-4-dezembro-homenagem",
  "dia-perito-criminal-homenagem-ibsen-maciel",
  // LGPD & Compliance
  "background-check-lgpd-legal-consultar-brasil",
  // Ferramentas
  "apis-publicas-governo-brasileiro-investigacao"
];

export function getAllBlogSlugs() {
  return BLOG_POST_SLUGS.map((slug) => ({
    slug,
  }));
}
