import { MetadataRoute } from 'next';

/**
 * Sitemap dinâmico - Investigaree
 *
 * PRINCÍPIO: "Se a página não sustenta autoridade sozinha, ela não merece sitemap."
 *
 * Arquitetura baseada em:
 * - Eixo Autoridade Jurídico-Técnica (Ciclo 3)
 * - Governança de conteúdo aprovada (Ciclo 4)
 * - Biblioteca técnica como core (não motor de tráfego)
 *
 * EXCLUÍDOS INTENCIONALMENTE:
 * - /servicos e /solucoes/* (arquitetura antiga)
 * - Posts individuais do blog (indexação seletiva futura)
 * - Conteúdo mock ou temporário
 * - Páginas enterradas ou sem autoridade própria
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
  ];
}
