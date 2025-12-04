import { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";

import { getAllBlogSlugs } from "@/data/blogPosts";
import BlogPostClient from "./BlogPostClient";
import BlogPostMDX from "./BlogPostMDX";

// MDX Components
import {
  Callout,
  CodeBlock,
  KeyStat,
  ImageGallery,
  FileLocation,
  Timeline,
  ComparisonTable,
  VideoEmbed,
  DownloadCard,
  Quiz,
  LeadCaptureCard,
  CTABanner,
  SeriesNavigation,
  SeriesCard,
} from "@/components/mdx";

const POSTS_DIR = path.join(process.cwd(), "content", "blog");

const mdxComponents = {
  Callout,
  CodeBlock,
  KeyStat,
  ImageGallery,
  FileLocation,
  Timeline,
  ComparisonTable,
  VideoEmbed,
  DownloadCard,
  Quiz,
  LeadCaptureCard,
  CTABanner,
  SeriesNavigation,
  SeriesCard,
};

// Verifica se existe arquivo MDX para um slug
function getMDXFilePath(slug: string): string | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  if (fs.existsSync(filePath)) {
    return filePath;
  }
  return null;
}

// Lista todos os slugs MDX
function getAllMDXSlugs(): { slug: string }[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => ({ slug: file.replace(/\.mdx$/, "") }));
}

// Gera os parâmetros estáticos para todas as páginas de blog
export async function generateStaticParams() {
  const mockSlugs = getAllBlogSlugs();
  const mdxSlugs = getAllMDXSlugs();

  // Combina slugs únicos de mock e MDX
  const allSlugs = [...mockSlugs];
  for (const mdxSlug of mdxSlugs) {
    if (!allSlugs.some(s => s.slug === mdxSlug.slug)) {
      allSlugs.push(mdxSlug);
    }
  }

  return allSlugs;
}

// Metadata dinâmica
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // Tenta carregar metadados do MDX
  const mdxPath = getMDXFilePath(slug);
  if (mdxPath) {
    const source = fs.readFileSync(mdxPath, "utf-8");
    const { data } = matter(source);
    return {
      title: `${data.title} - Investigaree Blog`,
      description: data.excerpt,
      openGraph: {
        title: data.title,
        description: data.excerpt,
        images: data.coverImage ? [data.coverImage] : [],
        type: "article",
        publishedTime: data.publishedAt,
      },
    };
  }

  return {
    title: `Blog - Investigaree`,
    description: `Artigo sobre investigação digital - ${slug}`,
  };
}

// Página do post
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Verifica se existe arquivo MDX
  const mdxPath = getMDXFilePath(slug);

  if (mdxPath) {
    try {
      const source = fs.readFileSync(mdxPath, "utf-8");
      const { data, content: rawContent } = matter(source);

      // Compila o MDX
      const { content } = await compileMDX({
        source: rawContent,
        components: mdxComponents,
        options: {
          parseFrontmatter: false,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeHighlight],
          },
        },
      });

      // Calcula tempo de leitura
      const wordsPerMinute = 200;
      const words = rawContent.trim().split(/\s+/).length;
      const readingTime = Math.ceil(words / wordsPerMinute);

      // Cast frontmatter to expected type
      const frontmatter = {
        title: data.title as string,
        excerpt: data.excerpt as string,
        coverImage: data.coverImage as string,
        authorId: data.authorId as string,
        contentType: data.contentType as string,
        topicId: data.topicId as string,
        skillLevel: data.skillLevel as string,
        tags: (data.tags || []) as string[],
        publishedAt: data.publishedAt as string,
        updatedAt: data.updatedAt as string | undefined,
        readingTime: (data.readingTime || readingTime) as number,
        featured: data.featured as boolean | undefined,
        videoUrl: data.videoUrl as string | undefined,
        podcastUrl: data.podcastUrl as string | undefined,
        downloadUrl: data.downloadUrl as string | undefined,
      };

      return (
        <BlogPostMDX
          slug={slug}
          frontmatter={frontmatter}
          content={content}
        />
      );
    } catch (error) {
      console.error(`Error compiling MDX for ${slug}:`, error);
      // Fall back to client component
    }
  }

  // Use o componente cliente para posts mock
  return <BlogPostClient slug={slug} />;
}
