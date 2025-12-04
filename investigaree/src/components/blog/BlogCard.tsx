"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  User,
  Calendar,
  ArrowRight,
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

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
  index?: number;
}

export default function BlogCard({ post, featured = false, index = 0 }: BlogCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const contentTypeInfo = CONTENT_TYPES.find(t => t.id === post.contentType);
  const skillLevelInfo = SKILL_LEVELS.find(l => l.id === post.skillLevel);
  const ContentTypeIcon = contentTypeIcons[post.contentType];
  const SkillLevelIcon = skillLevelIcons[post.skillLevel];

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        className="group relative overflow-hidden rounded-2xl bg-navy-900/50 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-300"
      >
        <Link href={`/blog/${post.slug}`} className="block">
          {/* Imagem de capa */}
          <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent z-10" />
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Badges no topo */}
            <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
              {/* Tipo de conteúdo */}
              <Badge
                className="text-xs font-medium"
                style={{
                  backgroundColor: contentTypeInfo?.color,
                  color: "#0A1628"
                }}
              >
                <ContentTypeIcon className="w-3 h-3 mr-1" />
                {contentTypeInfo?.name}
              </Badge>

              {/* Nível */}
              <Badge
                variant="outline"
                className="text-xs bg-navy-950/80 backdrop-blur-sm"
                style={{
                  borderColor: skillLevelInfo?.color,
                  color: skillLevelInfo?.color
                }}
              >
                <SkillLevelIcon className="w-3 h-3 mr-1" />
                {skillLevelInfo?.name}
              </Badge>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="relative z-20 p-6 -mt-16">
            {/* Tópico */}
            <Badge
              variant="outline"
              className="mb-3 text-xs"
              style={{
                borderColor: `${post.topic.color}50`,
                color: post.topic.color,
                backgroundColor: `${post.topic.color}10`
              }}
            >
              {post.topic.name}
            </Badge>

            {/* Título */}
            <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-gold-400 transition-colors">
              {post.title}
            </h3>

            {/* Resumo */}
            <p className="text-navy-300 text-sm mb-4 line-clamp-2">
              {post.excerpt}
            </p>

            {/* Meta info */}
            <div className="flex items-center justify-between text-sm text-navy-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min
                </span>
              </div>

              <motion.span
                className="flex items-center gap-1 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity"
                initial={{ x: -10 }}
                whileHover={{ x: 0 }}
              >
                Ler mais <ArrowRight className="w-4 h-4" />
              </motion.span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl bg-navy-900/30 border border-gold-500/10 hover:border-gold-500/20 hover:bg-navy-900/50 transition-all duration-300"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        {/* Imagem de capa */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />

          {/* Badges posicionados */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            {/* Tipo de conteúdo */}
            <Badge
              className="text-[10px] font-medium px-2 py-0.5"
              style={{
                backgroundColor: contentTypeInfo?.color,
                color: "#0A1628"
              }}
            >
              <ContentTypeIcon className="w-3 h-3 mr-1" />
              {contentTypeInfo?.name}
            </Badge>

            {/* Nível */}
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-sm"
              style={{ backgroundColor: `${skillLevelInfo?.color}30`, color: skillLevelInfo?.color }}
              title={skillLevelInfo?.name}
            >
              <SkillLevelIcon className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Tópico no canto inferior */}
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className="text-[10px] backdrop-blur-sm"
              style={{
                backgroundColor: `${post.topic.color}20`,
                color: post.topic.color,
                borderColor: `${post.topic.color}40`
              }}
            >
              {post.topic.name}
            </Badge>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5">
          {/* Título */}
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-gold-400 transition-colors">
            {post.title}
          </h3>

          {/* Resumo */}
          <p className="text-navy-300 text-sm mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Autor e Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {post.author.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-gold-500" />
                </div>
              )}
              <span className="text-xs text-navy-400 truncate max-w-[100px]">
                {post.author.name}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-navy-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} min
              </span>
            </div>
          </div>

          {/* Tags (opcional - mostra as 2 primeiras) */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gold-500/5">
              {post.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-[10px] text-navy-500 bg-navy-800/50 px-2 py-0.5 rounded"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-[10px] text-navy-500">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.article>
  );
}
