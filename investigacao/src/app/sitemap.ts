import { MetadataRoute } from 'next';
import { MOCK_POSTS } from '@/data/mockPosts';

/**
 * Sitemap dinâmico completo - Investigaree
 *
 * Inclui:
 * - Páginas institucionais e de conteúdo
 * - Páginas de serviços e soluções
 * - Posts individuais do blog (todos os 36 posts)
 * - Páginas legais e suporte
 *
 * Atualizado: 2026-01-30 - Incluídas todas as páginas públicas
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://investigacao.com.br';
  const currentDate = new Date();

  // Prioridades baseadas em Eixo Autoridade:
  // 1.0 - Homepage (ponto de entrada)
  // 0.9 - Autoridade técnica (/metodologia, /cases)
  // 0.8 - Biblioteca índice (/blog, /glossario)
  // 0.7 - Institucional core (/quemsomos, /contato)
  // 0.5 - Recursos/séries secundários
  // 0.3 - Legal/suporte

  return [
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // Páginas de Autoridade (Biblioteca Técnica)
    {
      url: `${baseUrl}/metodologia`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cases`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // Biblioteca de Conteúdo (apenas índices)
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/glossario`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Institucional Core
    {
      url: `${baseUrl}/quemsomos`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contato`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    // Recursos e Séries (secundário)
    {
      url: `${baseUrl}/series`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/recursos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // FAQ e Suporte
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },

    // Páginas de Serviços e Soluções (importantes para SEO)
    {
      url: `${baseUrl}/servicos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solucoes`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solucoes/due-diligence`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solucoes/background-check-executivos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solucoes/investigacao-patrimonial`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solucoes/rh-compliance`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solucoes/auditoria-licitacoes`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solucoes/protecao-remocao`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solucoes/coleta-provas-digitais`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solucoes/due-diligence-divorcios`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },

    // Outras páginas importantes
    {
      url: `${baseUrl}/precos`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/sobre`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/lgpd`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.5,
    },

    // Legal (conformidade)
    {
      url: `${baseUrl}/privacidade`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/termos`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookies`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    // Posts individuais do blog (todos os 36 posts)
    ...MOCK_POSTS.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: post.featured ? 0.7 : 0.6,
    })),
  ];
}
