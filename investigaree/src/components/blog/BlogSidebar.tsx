"use client";

import { motion } from "framer-motion";
import {
  Hash,
  Folder,
  BookMarked,
  FlaskConical,
  ShieldAlert,
  Search,
  Smartphone,
  Zap,
  Scale,
  Wrench,
  TrendingUp
} from "lucide-react";
import { BlogPost, BlogFilters, BlogTopic, BLOG_TOPICS, POPULAR_TAGS } from "@/types/blog";
import PopularPosts from "./PopularPosts";

// Mapeamento de ícones para tópicos
const topicIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  BookMarked,
  FlaskConical,
  ShieldAlert,
  Search,
  Smartphone,
  Zap,
  Scale,
  Wrench,
  TrendingUp
};

interface BlogSidebarProps {
  popularPosts: BlogPost[];
  filters: BlogFilters;
  onFiltersChange: (filters: BlogFilters) => void;
}

export default function BlogSidebar({
  popularPosts,
  filters,
  onFiltersChange
}: BlogSidebarProps) {
  const handleTopicClick = (topicSlug: string) => {
    if (filters.topic === topicSlug) {
      onFiltersChange({ ...filters, topic: undefined });
    } else {
      onFiltersChange({ ...filters, topic: topicSlug });
    }
  };

  const handleTagClick = (tag: string) => {
    if (filters.tag === tag) {
      onFiltersChange({ ...filters, tag: undefined });
    } else {
      onFiltersChange({ ...filters, tag: tag });
    }
  };

  const getTopicIcon = (iconName: string) => {
    const Icon = topicIcons[iconName];
    return Icon || Folder;
  };

  return (
    <aside className="space-y-6">
      {/* Posts Populares */}
      <PopularPosts posts={popularPosts} />

      {/* Tópicos */}
      <div className="bg-white dark:bg-white/30 dark:bg-navy-900/30 border border-blue-500/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-500/10">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
            <Folder className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tópicos</h3>
        </div>

        <div className="space-y-1">
          {BLOG_TOPICS.sort((a, b) => a.order - b.order).map((topic) => {
            const Icon = getTopicIcon(topic.icon);
            const isActive = filters.topic === topic.slug;

            return (
              <motion.button
                key={topic.id}
                onClick={() => handleTopicClick(topic.slug)}
                whileHover={{ x: 2 }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                  isActive
                    ? "text-navy-950 font-medium"
                    : "text-slate-600 dark:text-navy-300 hover:text-white hover:bg-slate-100 dark:bg-navy-800/50"
                }`}
                style={{
                  backgroundColor: isActive ? topic.color : undefined
                }}
              >
                <span style={{ color: isActive ? undefined : topic.color }}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="flex-1 truncate">{topic.name}</span>
                {isActive && (
                  <span className="text-xs opacity-70">×</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Tags Populares */}
      <div className="bg-white dark:bg-white/30 dark:bg-navy-900/30 border border-blue-500/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-500/10">
          <div className="p-1.5 rounded-lg bg-blue-500/10">
            <Hash className="w-4 h-4 text-blue-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tags Populares</h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {POPULAR_TAGS.slice(0, 12).map((tag) => {
            const isActive = filters.tag === tag;

            return (
              <motion.button
                key={tag}
                onClick={() => handleTagClick(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                  isActive
                    ? "bg-blue-500 text-navy-950 font-medium"
                    : "bg-slate-100 dark:bg-navy-800/50 text-slate-500 dark:text-navy-400 hover:bg-slate-100 dark:bg-navy-800 hover:text-white"
                }`}
              >
                #{tag}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* CTA Newsletter Compacto */}
      <div className="bg-gradient-to-br from-blue-500/10 to-navy-900/50 border border-blue-500/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          Newsletter DFIR
        </h3>
        <p className="text-xs text-slate-500 dark:text-navy-400 mb-3">
          Receba as novidades semanalmente.
        </p>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="seu@email.com"
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-white/80 dark:bg-navy-900/80 border border-blue-500/20 text-sm text-slate-900 dark:text-white placeholder:text-slate-900 dark:text-navy-500 focus:outline-none focus:border-blue-500/50 transition-colors"
          />
          <button
            type="submit"
            className="w-full px-3 py-2 bg-blue-500 hover:bg-blue-600 text-navy-950 text-sm font-medium rounded-lg transition-colors"
          >
            Inscrever-se
          </button>
        </form>
      </div>
    </aside>
  );
}
