"use client";

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
  ArrowRight,
  Tag
} from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Badge } from "@/components/ui/badge";
import { useBlogPost, useRelatedPosts } from "@/hooks/useBlog";
import { CONTENT_TYPES, SKILL_LEVELS } from "@/types/blog";

interface BlogPostClientProps {
  slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
  const { post, loading, error } = useBlogPost(slug);
  const relatedPosts = useRelatedPosts(post, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const contentType = post ? CONTENT_TYPES.find(t => t.id === post.contentType) : null;
  const skillLevel = post ? SKILL_LEVELS.find(l => l.id === post.skillLevel) : null;

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 dark:bg-navy-950 pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto">
              {/* Skeleton */}
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-slate-100 dark:bg-navy-800 rounded w-3/4" />
                <div className="h-4 bg-slate-100 dark:bg-navy-800 rounded w-1/2" />
                <div className="h-64 bg-slate-100 dark:bg-navy-800 rounded-xl mt-8" />
                <div className="space-y-3 mt-8">
                  <div className="h-4 bg-slate-100 dark:bg-navy-800 rounded" />
                  <div className="h-4 bg-slate-100 dark:bg-navy-800 rounded" />
                  <div className="h-4 bg-slate-100 dark:bg-navy-800 rounded w-5/6" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-slate-50 dark:bg-navy-950 pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center">
                <span className="text-4xl">404</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Artigo não encontrado
              </h1>
              <p className="text-slate-500 dark:text-navy-400 mb-8">
                O artigo que você está procurando não existe ou foi removido.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-navy-950 font-semibold rounded-xl transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Voltar ao Blog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950">
        {/* Hero do artigo */}
        <section className="relative pt-20">
          {/* Imagem de capa */}
          <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent dark:from-navy-950 dark:via-navy-950/60 dark:to-transparent" />

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
          <div className="container mx-auto px-4 sm:px-8 lg:px-12 py-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              {/* Tópico */}
              <Badge
                variant="outline"
                className="mb-4 text-sm"
                style={{
                  borderColor: `${post.topic.color}50`,
                  color: post.topic.color,
                  backgroundColor: `${post.topic.color}10`
                }}
              >
                {post.topic.name}
              </Badge>

              {/* Título */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                {post.title}
              </h1>

              {/* Resumo */}
              <p className="text-lg sm:text-xl text-slate-600 dark:text-navy-300 mb-6">
                {post.excerpt}
              </p>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-navy-400 pb-6 border-b border-green-500/10">
                {/* Autor */}
                <div className="flex items-center gap-3">
                  {post.author.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{post.author.name}</p>
                    {post.author.role && (
                      <p className="text-xs text-slate-900 dark:text-navy-500">{post.author.role}</p>
                    )}
                  </div>
                </div>

                {/* Data */}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                {/* Tempo de leitura */}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readingTime} min de leitura</span>
                </div>

                {/* Share buttons */}
                <div className="flex items-center gap-2 ml-auto">
                  <button
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

        {/* Conteúdo do artigo */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <div className="max-w-3xl mx-auto">
              {/* Conteúdo placeholder - será substituído por conteúdo real */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-invert prose-gold max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-navy-300 prose-a:text-green-500 hover:prose-a:text-green-400 prose-strong:text-slate-900 dark:prose-strong:text-white prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-code:bg-slate-100 dark:prose-code:bg-navy-900/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 dark:prose-pre:bg-navy-950 prose-pre:text-slate-100 prose-blockquote:border-l-green-500 prose-blockquote:text-slate-600 dark:prose-blockquote:text-navy-300"
                dangerouslySetInnerHTML={{
                  __html: post.content || `<p class="text-lg leading-relaxed">${post.excerpt}</p><div class="my-8 p-6 rounded-xl bg-green-500/10 border border-green-500/20"><p class="text-green-400 font-medium mb-2">Conteúdo completo em breve</p><p class="text-slate-600 dark:text-navy-300 text-sm">Este artigo está sendo preparado por nossa equipe de especialistas.</p></div>`
                }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 pt-8 border-t border-green-500/10"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-slate-900 dark:text-navy-500" />
                    <p className="text-sm text-slate-900 dark:text-navy-500">Tags:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
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
                className="mt-8 p-6 rounded-xl bg-white dark:bg-navy-900/50 border border-green-500/10"
              >
                <div className="flex items-start gap-4">
                  {post.author.avatar ? (
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-2xl font-bold text-green-500">
                      {post.author.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-lg">{post.author.name}</p>
                    {post.author.role && (
                      <p className="text-green-500 text-sm mb-2">{post.author.role}</p>
                    )}
                    {post.author.bio && (
                      <p className="text-slate-500 dark:text-navy-400 text-sm">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Artigos relacionados */}
        {relatedPosts.length > 0 && (
          <section className="py-12 border-t border-green-500/10">
            <div className="container mx-auto px-4 sm:px-8 lg:px-12">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                  Artigos relacionados
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.article
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                          <Image
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs mb-2"
                          style={{
                            borderColor: `${relatedPost.topic.color}50`,
                            color: relatedPost.topic.color
                          }}
                        >
                          {relatedPost.topic.name}
                        </Badge>
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-green-400 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-navy-400 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {relatedPost.readingTime} min
                        </p>
                      </Link>
                    </motion.article>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 font-medium"
                  >
                    Ver todos os artigos
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </main>
    </>
  );
}
