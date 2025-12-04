"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { TrendingUp, Clock, Eye, ArrowRight } from "lucide-react";
import { BlogPost, CONTENT_TYPES } from "@/types/blog";
import { Badge } from "@/components/ui/badge";

interface PopularPostsProps {
  posts: BlogPost[];
  title?: string;
}

export default function PopularPosts({ posts, title = "Mais Lidos" }: PopularPostsProps) {
  if (posts.length === 0) return null;

  return (
    <div className="bg-navy-900/30 border border-gold-500/10 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gold-500/10">
        <div className="p-1.5 rounded-lg bg-gold-500/10">
          <TrendingUp className="w-4 h-4 text-gold-500" />
        </div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>

      {/* Lista de posts */}
      <div className="space-y-4">
        {posts.map((post, index) => {
          const contentType = CONTENT_TYPES.find(t => t.id === post.contentType);

          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/blog/${post.slug}`} className="flex gap-3">
                {/* Número de ranking */}
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-navy-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-gold-500">{index + 1}</span>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  {/* Badge do tipo */}
                  <Badge
                    className="text-[9px] px-1.5 py-0 mb-1.5"
                    style={{
                      backgroundColor: `${contentType?.color}20`,
                      color: contentType?.color,
                      border: `1px solid ${contentType?.color}30`
                    }}
                  >
                    {contentType?.name}
                  </Badge>

                  {/* Título */}
                  <h4 className="text-sm font-medium text-navy-200 group-hover:text-gold-400 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h4>

                  {/* Meta info */}
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-navy-500">
                    <span className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3" />
                      {post.readingTime} min
                    </span>
                    {post.views && (
                      <span className="flex items-center gap-0.5">
                        <Eye className="w-3 h-3" />
                        {post.views.toLocaleString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.article>
          );
        })}
      </div>

      {/* Link para ver todos */}
      <Link
        href="/blog?sort=popular"
        className="flex items-center justify-center gap-1 mt-4 pt-3 border-t border-gold-500/10 text-xs text-navy-400 hover:text-gold-400 transition-colors"
      >
        Ver todos os populares
        <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}
