"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  Calendar,
  User,
  Share2,
  Bookmark,
  ChevronLeft,
  Eye,
  FileText,
  Newspaper,
  GraduationCap,
  Briefcase,
  Star,
  Mic,
  BookOpen,
  Play,
  Headphones,
  Sprout,
  Flame,
  Rocket
} from "lucide-react";
import { BlogPost, ContentType, SkillLevel, CONTENT_TYPES, SKILL_LEVELS } from "@/types/blog";
import { Badge } from "@/components/ui/badge";

// Mapeamento de ícones para tipos de conteúdo
const contentTypeIcons: Record<ContentType, React.ComponentType<{ className?: string }>> = {
  artigo: FileText,
  noticia: Newspaper,
  tutorial: GraduationCap,
  "case-study": Briefcase,
  review: Star,
  entrevista: Mic,
  whitepaper: BookOpen,
  video: Play,
  podcast: Headphones
};

// Mapeamento de ícones para níveis
const skillLevelIcons: Record<SkillLevel, React.ComponentType<{ className?: string }>> = {
  iniciante: Sprout,
  intermediario: Flame,
  avancado: Rocket
};

interface ArticleHeaderProps {
  post: BlogPost;
}

export default function ArticleHeader({ post }: ArticleHeaderProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const contentTypeInfo = CONTENT_TYPES.find(t => t.id === post.contentType);
  const skillLevelInfo = SKILL_LEVELS.find(l => l.id === post.skillLevel);
  const ContentTypeIcon = contentTypeIcons[post.contentType];
  const SkillLevelIcon = skillLevelIcons[post.skillLevel];

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <header className="relative">
      {/* Breadcrumb e navegação */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 pt-24 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-sm text-navy-400"
        >
          <Link href="/blog" className="flex items-center gap-1 hover:text-gold-400 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Voltar ao Blog
          </Link>
          <span>/</span>
          <Link
            href={`/blog?topic=${post.topic.slug}`}
            className="hover:text-gold-400 transition-colors"
            style={{ color: post.topic.color }}
          >
            {post.topic.name}
          </Link>
        </motion.div>
      </div>

      {/* Hero do artigo */}
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 pb-8">
        <div className="max-w-4xl">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap items-center gap-2 mb-4"
          >
            {/* Tipo de conteúdo */}
            <Badge
              className="text-xs font-medium"
              style={{
                backgroundColor: contentTypeInfo?.color,
                color: "#0A1628"
              }}
            >
              <ContentTypeIcon className="w-3.5 h-3.5 mr-1.5" />
              {contentTypeInfo?.name}
            </Badge>

            {/* Nível */}
            <Badge
              variant="outline"
              className="text-xs"
              style={{
                borderColor: skillLevelInfo?.color,
                color: skillLevelInfo?.color
              }}
            >
              <SkillLevelIcon className="w-3.5 h-3.5 mr-1.5" />
              {skillLevelInfo?.name}
            </Badge>

            {/* Tempo de leitura */}
            <Badge variant="outline" className="text-xs text-navy-300 border-navy-600">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              {post.readingTime} min de leitura
            </Badge>
          </motion.div>

          {/* Título */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
          >
            {post.title}
          </motion.h1>

          {/* Resumo/Lead */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-navy-300 mb-8 leading-relaxed"
          >
            {post.excerpt}
          </motion.p>

          {/* Meta info e ações */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gold-500/10"
          >
            {/* Autor e data */}
            <div className="flex items-center gap-4">
              {/* Avatar do autor */}
              <Link href={`/blog?author=${post.author.id}`} className="flex items-center gap-3 group">
                {post.author.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-gold-500/20 group-hover:border-gold-500/50 transition-colors"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center border-2 border-gold-500/20">
                    <User className="w-5 h-5 text-gold-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium text-white group-hover:text-gold-400 transition-colors">
                    {post.author.name}
                  </p>
                  <p className="text-sm text-navy-400">{post.author.role}</p>
                </div>
              </Link>

              <div className="h-8 w-px bg-gold-500/10 hidden sm:block" />

              {/* Data de publicação */}
              <div className="flex items-center gap-2 text-sm text-navy-400">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </div>

              {post.views && (
                <>
                  <div className="h-8 w-px bg-gold-500/10 hidden sm:block" />
                  <div className="flex items-center gap-2 text-sm text-navy-400">
                    <Eye className="w-4 h-4" />
                    <span>{post.views.toLocaleString("pt-BR")} visualizações</span>
                  </div>
                </>
              )}
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Compartilhar</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-navy-300 hover:text-white transition-colors"
              >
                <Bookmark className="w-4 h-4" />
                <span className="text-sm">Salvar</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Imagem de capa */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="container mx-auto px-4 sm:px-8 lg:px-12 mb-12"
      >
        <div className="relative aspect-[21/9] max-w-5xl mx-auto rounded-2xl overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1100px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
        </div>
      </motion.div>
    </header>
  );
}
