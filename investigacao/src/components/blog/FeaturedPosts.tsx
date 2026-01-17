"use client";

import { motion } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";
import BlogCard from "./BlogCard";
import { BlogPost } from "@/types/blog";

interface FeaturedPostsProps {
  posts: BlogPost[];
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="py-16 border-b border-green-500/10 bg-slate-50 dark:bg-navy-950/50">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12">
        {/* Título da seção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20">
              <Flame className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inovações em Destaque</h2>
              <p className="text-sm text-slate-500 dark:text-navy-400">
                As últimas novidades em DFIR, automação forense e resposta a incidentes
              </p>
            </div>
          </div>

          {/* Indicador de trending */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20"
          >
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-xs text-green-400 font-medium">
              Conteúdo atualizado
            </span>
          </motion.div>
        </motion.div>

        {/* Grid de posts em destaque */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} featured index={index} />
          ))}
        </div>

        {/* Linha de contexto */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center text-sm text-slate-900 dark:text-navy-500 mt-8 max-w-2xl mx-auto"
        >
          Selecionados pela equipe Investigaree com base em relevância técnica,
          inovação e aplicabilidade prática no mercado brasileiro.
        </motion.p>
      </div>
    </section>
  );
}

