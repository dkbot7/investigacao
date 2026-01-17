"use client";

import { motion } from "framer-motion";

export function BlogCardSkeleton() {
  return (
    <div className="rounded-xl bg-white dark:bg-white/30 dark:bg-navy-900/30 border border-green-500/10 overflow-hidden">
      {/* Imagem placeholder */}
      <div className="h-48 bg-slate-100 dark:bg-navy-800/50 animate-pulse" />

      {/* Conteúdo */}
      <div className="p-5 space-y-4">
        {/* Título */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 dark:bg-navy-800/50 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-slate-100 dark:bg-navy-800/50 rounded animate-pulse w-1/2" />
        </div>

        {/* Resumo */}
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 dark:bg-navy-800/30 rounded animate-pulse" />
          <div className="h-3 bg-slate-100 dark:bg-navy-800/30 rounded animate-pulse w-5/6" />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-navy-800/50 animate-pulse" />
            <div className="h-3 bg-slate-100 dark:bg-navy-800/30 rounded animate-pulse w-20" />
          </div>
          <div className="h-3 bg-slate-100 dark:bg-navy-800/30 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedPostSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-white/50 dark:bg-navy-900/50 border border-green-500/10 overflow-hidden">
      {/* Imagem placeholder maior */}
      <div className="h-64 bg-slate-100 dark:bg-navy-800/50 animate-pulse" />

      {/* Conteúdo */}
      <div className="p-6 space-y-4">
        <div className="h-5 bg-green-500/20 rounded-full animate-pulse w-24" />
        <div className="space-y-2">
          <div className="h-5 bg-slate-100 dark:bg-navy-800/50 rounded animate-pulse w-full" />
          <div className="h-5 bg-slate-100 dark:bg-navy-800/50 rounded animate-pulse w-3/4" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-100 dark:bg-navy-800/30 rounded animate-pulse" />
          <div className="h-3 bg-slate-100 dark:bg-navy-800/30 rounded animate-pulse w-5/6" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 bg-slate-100 dark:bg-navy-800/30 rounded animate-pulse w-24" />
          <div className="h-3 bg-slate-100 dark:bg-navy-800/30 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}

interface BlogGridSkeletonProps {
  count?: number;
  featured?: boolean;
}

export default function BlogGridSkeleton({ count = 6, featured = false }: BlogGridSkeletonProps) {
  const SkeletonComponent = featured ? FeaturedPostSkeleton : BlogCardSkeleton;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`grid gap-6 ${
        featured
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
    </motion.div>
  );
}

