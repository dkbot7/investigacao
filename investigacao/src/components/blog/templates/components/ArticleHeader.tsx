"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Clock, Calendar, User, Eye, Share2, Bookmark, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BlogPost, CONTENT_TYPES, SKILL_LEVELS } from "@/types/blog";

interface ArticleHeaderProps {
  post: BlogPost;
  showBackLink?: boolean;
  showShareButtons?: boolean;
}

export default function ArticleHeader({
  post,
  showBackLink = true,
  showShareButtons = true
}: ArticleHeaderProps) {
  const contentType = CONTENT_TYPES.find(t => t.id === post.contentType);
  const skillLevel = SKILL_LEVELS.find(l => l.id === post.skillLevel);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <header className="relative">
      {/* Imagem de capa */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />

        {/* Back link */}
        {showBackLink && (
          <Link
            href="/blog"
            className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/80 dark:bg-navy-900/80 backdrop-blur-sm rounded-lg text-sm text-slate-900 dark:text-white hover:bg-slate-100 dark:bg-navy-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
        )}

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
          className="max-w-4xl mx-auto"
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

            {/* Views (se disponível) */}
            {post.views && (
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views.toLocaleString("pt-BR")} visualizações</span>
              </div>
            )}

            {/* Share buttons */}
            {showShareButtons && (
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
            )}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
