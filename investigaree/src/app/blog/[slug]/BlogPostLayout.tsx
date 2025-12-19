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
import { CONTENT_TYPES, SKILL_LEVELS, BlogPost } from "@/types/blog";
import { MOCK_POSTS } from "@/data/mockPosts";

interface BlogPostLayoutProps {
  post: BlogPost;
  compiledHtml?: string;
}

export default function BlogPostLayout({ post, compiledHtml }: BlogPostLayoutProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const contentType = CONTENT_TYPES.find(t => t.id === post.contentType);
  const skillLevel = SKILL_LEVELS.find(l => l.id === post.skillLevel);

  // Get related posts (simple logic without hooks)
  const relatedPosts = MOCK_POSTS
    .filter(p =>
      p.id !== post.id &&
      (p.topic.id === post.topic.id || p.tags.some(tag => post.tags.includes(tag)))
    )
    .slice(0, 3);

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
            <div className="max-w-3xl mx-auto">
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
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-navy-400 pb-6 border-b border-blue-500/10">
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
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-500" />
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
            </div>
          </div>
        </section>

        {/* Conteúdo do artigo */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <div className="max-w-3xl mx-auto">
              {/* Conteúdo HTML pré-compilado */}
              <div
                className="prose prose-invert prose-gold max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-navy-300 prose-a:text-blue-500 hover:prose-a:text-blue-400 prose-strong:text-slate-900 dark:prose-strong:text-white prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-code:bg-slate-100 dark:prose-code:bg-navy-900/50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 dark:prose-pre:bg-navy-950 prose-pre:text-slate-100 prose-blockquote:border-l-blue-500 prose-blockquote:text-slate-600 dark:prose-blockquote:text-navy-300"
                dangerouslySetInnerHTML={{
                  __html: compiledHtml || `
                    <p class="text-lg leading-relaxed">${post.excerpt}</p>
                    <div class="my-8 p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <p class="text-blue-400 font-medium mb-2">Conteúdo completo em breve</p>
                      <p class="text-slate-600 dark:text-navy-300 text-sm">Este artigo está sendo preparado por nossa equipe de especialistas.</p>
                    </div>
                  `
                }}
              />

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-blue-500/10">
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
                </div>
              )}

              {/* Autor */}
              <div className="mt-8 p-6 rounded-xl bg-white dark:bg-navy-900/50 border border-blue-500/10">
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
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-2xl font-bold text-blue-500">
                      {post.author.name[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-lg">{post.author.name}</p>
                    {post.author.role && (
                      <p className="text-blue-500 text-sm mb-2">{post.author.role}</p>
                    )}
                    {post.author.bio && (
                      <p className="text-slate-500 dark:text-navy-400 text-sm">{post.author.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Artigos relacionados */}
        {relatedPosts.length > 0 && (
          <section className="py-12 border-t border-blue-500/10">
            <div className="container mx-auto px-4 sm:px-8 lg:px-12">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
                  Artigos relacionados
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <article key={relatedPost.id} className="group">
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
                        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-navy-400 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {relatedPost.readingTime} min
                        </p>
                      </Link>
                    </article>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 font-medium"
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
