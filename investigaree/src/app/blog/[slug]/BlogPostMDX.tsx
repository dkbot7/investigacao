"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Calendar,
  User,
  ChevronLeft,
  Share2,
  Bookmark,
  Tag,
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import MDXContent from "@/components/blog/MDXContent";
import {
  BLOG_TOPICS,
  BLOG_AUTHORS,
  CONTENT_TYPES,
  SKILL_LEVELS,
} from "@/types/blog";

interface BlogPostMDXProps {
  slug: string;
  frontmatter: {
    title: string;
    excerpt: string;
    coverImage: string;
    authorId: string;
    contentType: string;
    topicId: string;
    skillLevel: string;
    tags: string[];
    publishedAt: string;
    updatedAt?: string;
    readingTime: number;
    featured?: boolean;
    videoUrl?: string;
    podcastUrl?: string;
    downloadUrl?: string;
  };
  content: ReactNode;
}

export default function BlogPostMDX({
  slug,
  frontmatter,
  content,
}: BlogPostMDXProps) {
  const author = BLOG_AUTHORS.find((a) => a.id === frontmatter.authorId) || BLOG_AUTHORS[2];
  const topic = BLOG_TOPICS.find((t) => t.id === frontmatter.topicId);
  const contentType = CONTENT_TYPES.find((c) => c.id === frontmatter.contentType);
  const skillLevel = SKILL_LEVELS.find((s) => s.id === frontmatter.skillLevel);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: frontmatter.title,
          text: frontmatter.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copiado!");
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950">
        {/* Hero do artigo */}
        <section className="relative pt-20">
          {/* Imagem de capa */}
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <Image
              src={frontmatter.coverImage}
              alt={frontmatter.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />

            {/* Back link */}
            <Link
              href="/blog"
              className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white dark:bg-navy-900/80 backdrop-blur-sm rounded-lg text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-navy-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar ao Blog
            </Link>

            {/* Badges */}
            <div className="absolute top-6 right-6 z-20 flex flex-wrap gap-2">
              {contentType && (
                <Badge
                  className="text-xs font-medium"
                  style={{ backgroundColor: contentType.color, color: "#0A1628" }}
                >
                  {contentType.name}
                </Badge>
              )}
              {skillLevel && (
                <Badge
                  variant="outline"
                  className="text-xs bg-slate-50 dark:bg-navy-950/80 backdrop-blur-sm"
                  style={{ borderColor: skillLevel.color, color: skillLevel.color }}
                >
                  {skillLevel.name}
                </Badge>
              )}
            </div>
          </div>

          {/* Conteúdo do header */}
          <div className="container mx-auto px-4 sm:px-8 lg:px-12 -mt-32 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              {/* Tópico */}
              {topic && (
                <Badge
                  variant="outline"
                  className="mb-4 text-sm"
                  style={{
                    borderColor: `${topic.color}50`,
                    color: topic.color,
                    backgroundColor: `${topic.color}10`,
                  }}
                >
                  {topic.name}
                </Badge>
              )}

              {/* Título */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                {frontmatter.title}
              </h1>

              {/* Resumo */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-navy-300 mb-6">
                {frontmatter.excerpt}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-navy-400 pb-6 border-b border-blue-500/10">
                {/* Autor */}
                <div className="flex items-center gap-3">
                  {author.avatar ? (
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{author.name}</p>
                    {author.role && (
                      <p className="text-xs text-slate-900 dark:text-navy-500">{author.role}</p>
                    )}
                  </div>
                </div>

                {/* Data */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(frontmatter.publishedAt)}</span>
                </div>

                {/* Tempo de leitura */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{frontmatter.readingTime} min de leitura</span>
                </div>

                {/* Share buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800/50 hover:bg-navy-700 transition-colors"
                    title="Compartilhar"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800/50 hover:bg-navy-700 transition-colors"
                    title="Salvar"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Conteúdo do artigo MDX */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <MDXContent>{content}</MDXContent>
              </motion.div>

              {/* Tags */}
              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 pt-8 border-t border-blue-500/10"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-slate-900 dark:text-navy-500" />
                    <p className="text-sm text-slate-900 dark:text-navy-500">Tags:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {frontmatter.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog?tag=${tag}`}
                        className="px-3 py-1 text-sm bg-white dark:bg-navy-900/50 text-slate-600 dark:text-navy-300 rounded-lg hover:bg-slate-100 dark:bg-navy-800 hover:text-slate-900 dark:text-white transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Autor */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 p-6 rounded-xl bg-white dark:bg-navy-900/50 border border-blue-500/10"
              >
                <div className="flex items-start gap-4">
                  {author.avatar ? (
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl font-bold text-blue-500">
                      {author.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-lg">{author.name}</p>
                    {author.role && (
                      <p className="text-blue-500 text-sm mb-2">{author.role}</p>
                    )}
                    {author.bio && (
                      <p className="text-slate-500 dark:text-navy-400 text-sm">{author.bio}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* CTA Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Gostou do conteúdo?
                </h3>
                <p className="text-slate-600 dark:text-navy-300 text-sm mb-4">
                  Receba semanalmente as principais novidades em investigação digital,
                  due diligence e proteção patrimonial.
                </p>
                <Link
                  href="/#newsletter"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-navy-950 font-medium rounded-lg transition-colors"
                >
                  Assinar Newsletter
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
