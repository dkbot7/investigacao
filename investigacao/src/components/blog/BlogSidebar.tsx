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
  TrendingUp,
  MessageCircle,
  Lock,
  CheckCircle,
  Calendar
} from "lucide-react";
import { BlogPost, BlogFilters, BlogTopic, BLOG_TOPICS, POPULAR_TAGS } from "@/types/blog";
import PopularPosts from "./PopularPosts";
import { Button } from "@/components/ui/button";

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
      <div className="bg-white dark:bg-navy-900/30 border border-green-500/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/10">
          <div className="p-1.5 rounded-lg bg-green-500/10">
            <Folder className="w-4 h-4 text-green-500" />
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
                    : "text-slate-600 dark:text-navy-300 hover:text-white hover:bg-navy-100 dark:hover:bg-navy-800/50"
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
      <div className="bg-white dark:bg-navy-900/30 border border-green-500/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/10">
          <div className="p-1.5 rounded-lg bg-green-500/10">
            <Hash className="w-4 h-4 text-green-500" />
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
                    ? "bg-green-500 text-navy-950 font-medium"
                    : "bg-navy-100 dark:bg-navy-800/50 text-slate-500 dark:text-navy-400 hover:bg-navy-200 dark:hover:bg-navy-800 hover:text-white"
                }`}
              >
                #{tag}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Filtro por Data */}
      <div className="bg-white dark:bg-navy-900/50 border border-green-500/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-500/10">
          <div className="p-1.5 rounded-lg bg-green-500/10">
            <Calendar className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Filtrar por Data</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-slate-600 dark:text-navy-300 mb-1 block">
              De
            </label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-800 border border-green-500/20 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-green-500/50"
            />
          </div>

          <div>
            <label className="text-xs text-slate-600 dark:text-navy-300 mb-1 block">
              Até
            </label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-800 border border-green-500/20 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:border-green-500/50"
            />
          </div>

          {/* Quick presets */}
          <div className="pt-2 border-t border-green-500/10">
            <p className="text-xs text-slate-600 dark:text-navy-300 mb-2">Atalhos:</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const now = new Date();
                  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                  onFiltersChange({
                    ...filters,
                    dateFrom: lastMonth.toISOString().split('T')[0],
                    dateTo: now.toISOString().split('T')[0]
                  });
                }}
                className="text-xs px-2 py-1 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 rounded text-slate-700 dark:text-navy-200"
              >
                Último mês
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                  onFiltersChange({
                    ...filters,
                    dateFrom: last3Months.toISOString().split('T')[0],
                    dateTo: now.toISOString().split('T')[0]
                  });
                }}
                className="text-xs px-2 py-1 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 rounded text-slate-700 dark:text-navy-200"
              >
                Últimos 3 meses
              </button>
              <button
                onClick={() => {
                  onFiltersChange({
                    ...filters,
                    dateFrom: undefined,
                    dateTo: undefined
                  });
                }}
                className="text-xs px-2 py-1 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 rounded text-slate-700 dark:text-navy-200"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CTA WhatsApp Sidebar */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-500/30 rounded-xl p-5 sticky top-24">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-green-500/20">
            <MessageCircle className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Precisa Investigar?
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-navy-300 mb-4 leading-relaxed">
          Nossa equipe responde em até 24h. Consulta inicial gratuita.
        </p>
        <Button
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).openWhatsAppModal) {
              (window as any).openWhatsAppModal(
                "Olá! Preciso de ajuda com investigação.",
                "blog-sidebar-cta"
              );
            }
          }}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp Direto
        </Button>
        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-slate-500 dark:text-navy-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3" /> 100% confidencial
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Resposta garantida
          </span>
        </div>
      </div>
    </aside>
  );
}

