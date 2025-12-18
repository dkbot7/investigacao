import { Metadata } from 'next';
import BlogContent from './BlogContent';
import { BLOG_TOPICS, CONTENT_TYPES, SKILL_LEVELS } from '@/types/blog';

export async function generateMetadata({
  searchParams
}: {
  searchParams: Promise<{
    topic?: string;
    type?: string;
    level?: string;
    search?: string;
  }>
}): Promise<Metadata> {
  const params = await searchParams;

  let title = "Blog - Investigação Digital e Due Diligence | Investigaree";
  let description = "Artigos, tutoriais e cases sobre OSINT, perícia forense digital, compliance e investigação no Brasil";

  const parts: string[] = [];

  // SEO baseado em tópico
  if (params.topic) {
    const topic = BLOG_TOPICS.find(t => t.slug === params.topic);
    if (topic) {
      parts.push(topic.name);
      description = topic.description || description;
    }
  }

  // SEO baseado em tipo de conteúdo
  if (params.type) {
    const type = CONTENT_TYPES.find(t => t.id === params.type);
    if (type) parts.push(type.namePlural);
  }

  // SEO baseado em nível
  if (params.level) {
    const level = SKILL_LEVELS.find(l => l.id === params.level);
    if (level) parts.push(`Nível ${level.name}`);
  }

  // SEO baseado em busca
  if (params.search) {
    parts.push(`"${params.search}"`);
  }

  if (parts.length > 0) {
    title = `${parts.join(' • ')} - Blog Investigaree`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://investigaree.com.br/blog',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function BlogPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;

  // Converter searchParams para initialFilters
  const initialFilters = {
    topic: params.topic,
    contentType: params.type as any,
    skillLevel: params.level as any,
    search: params.search,
  };

  return <BlogContent initialFilters={initialFilters} />;
}
