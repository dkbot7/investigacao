"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { BlogPost, CONTENT_TYPES } from "@/types/blog";
import { Badge } from "@/components/ui/badge";

interface RelatedPostsProps {
  posts: BlogPost[];
  currentPostId: string;
}

export default function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  const filteredPosts = posts.filter(p => p.id !== currentPostId).slice(0, 3);

  if (filteredPosts.length === 0) return null;

  return (
    <section className="py-16 border-t border-green-500/10">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Artigos Relacionados</h2>
            <Link
              href="/blog"
              className="flex items-center gap-1 text-sm text-green-500 hover:text-green-400 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid de posts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => {
              const contentType = CONTENT_TYPES.find(t => t.id === post.contentType);

              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    {/* Imagem */}
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />

                      {/* Badge */}
                      <Badge
                        className="absolute top-3 left-3 text-[10px]"
                        style={{
                          backgroundColor: contentType?.color,
                          color: "#0A1628"
                        }}
                      >
                        {contentType?.name}
                      </Badge>
                    </div>

                    {/* Conteúdo */}
                    <div>
                      <Badge
                        variant="outline"
                        className="text-[10px] mb-2"
                        style={{
                          borderColor: `${post.topic.color}50`,
                          color: post.topic.color
                        }}
                      >
                        {post.topic.name}
                      </Badge>

                      <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-green-400 transition-colors line-clamp-2 mb-2">
                        {post.title}
                      </h3>

                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-navy-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post.readingTime} min</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

