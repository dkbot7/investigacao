import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_POSTS } from "@/data/mockPosts";
import BlogPostLayout from "./BlogPostLayout";

// DYNAMIC RENDERING for Cloudflare Workers compatibility
// IMPORTANTE: Não usar fs.* em Cloudflare Workers - usar apenas dados pré-compilados
// Removido generateStaticParams() para forçar renderização dinâmica completa
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 0;

// Metadata dinâmica
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Busca metadados do post compilado
  const post = MOCK_POSTS.find(p => p.slug === slug);

  if (post) {
    return {
      title: `${post.title} - Blog`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [post.coverImage] : [],
        type: "article",
        publishedTime: post.publishedAt,
      },
    };
  }

  return {
    title: `Blog`,
    description: `Artigo sobre investigação digital - ${slug}`,
  };
}

// Página do post (SERVER COMPONENT)
// IMPORTANTE: Não usar fs.* ou compileMDX em Cloudflare Workers
// Todo conteúdo é carregado diretamente do mockPosts.ts
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Busca o post nos dados pré-compilados
  const post = MOCK_POSTS.find(p => p.slug === slug);

  // 404 se não encontrado
  if (!post) {
    notFound();
  }

  // Renderiza o layout com o HTML do post
  return <BlogPostLayout post={post} compiledHtml={post.content} />;
}
