"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  CheckCircle,
  Circle,
  Lock,
} from "lucide-react";

interface SeriesPost {
  slug: string;
  title: string;
  partNumber: number;
  isPublished: boolean;
}

interface SeriesNavigationProps {
  seriesName: string;
  seriesSlug: string;
  seriesDescription?: string;
  currentPart: number;
  totalParts: number;
  posts: SeriesPost[];
  previousPost?: { slug: string; title: string };
  nextPost?: { slug: string; title: string };
}

export default function SeriesNavigation({
  seriesName,
  seriesSlug,
  seriesDescription,
  currentPart,
  totalParts,
  posts,
  previousPost,
  nextPost,
}: SeriesNavigationProps) {
  const progress = (currentPart / totalParts) * 100;

  return (
    <div className="my-8 rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-navy-900 to-navy-950">
      {/* Header */}
      <div className="p-4 bg-white dark:bg-navy-900 border-b border-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-500/10">
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <Link
              href={`/series/${seriesSlug}`}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Série: {seriesName}
            </Link>
            <p className="text-xs text-slate-500 dark:text-navy-400">
              Parte {currentPart} de {totalParts}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-500">{Math.round(progress)}%</span>
            <p className="text-xs text-slate-900 dark:text-navy-500">completo</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-slate-100 dark:bg-navy-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
          />
        </div>
      </div>

      {/* Posts list */}
      <div className="p-4">
        <p className="text-xs text-slate-900 dark:text-navy-500 uppercase tracking-wider mb-3">
          Nesta série
        </p>
        <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
          {posts.map((post) => {
            const isCurrent = post.partNumber === currentPart;
            const isCompleted = post.partNumber < currentPart;

            return (
              <div
                key={post.slug}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isCurrent
                    ? "bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20"
                    : "hover:bg-slate-50 dark:hover:bg-navy-800/50"
                }`}
              >
                {/* Status icon */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : isCurrent ? (
                    <Circle className="w-4 h-4 text-blue-500 fill-blue-500" />
                  ) : post.isPublished ? (
                    <Circle className="w-4 h-4 text-slate-900 dark:text-navy-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-navy-600" />
                  )}
                </div>

                {/* Part number */}
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    isCurrent
                      ? "bg-blue-500 text-navy-950"
                      : isCompleted
                      ? "bg-green-500/20 text-green-400"
                      : "bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-navy-400"
                  }`}
                >
                  {post.partNumber}
                </span>

                {/* Title */}
                {post.isPublished ? (
                  <Link
                    href={`/blog/${post.slug}`}
                    className={`flex-1 text-sm truncate ${
                      isCurrent
                        ? "text-white font-medium"
                        : "text-slate-600 dark:text-navy-300 hover:text-white"
                    }`}
                  >
                    {post.title}
                  </Link>
                ) : (
                  <span className="flex-1 text-sm text-navy-600 truncate">
                    {post.title || "Em breve..."}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="p-4 bg-white dark:bg-navy-900 border-t border-blue-500/10 flex items-center justify-between gap-4">
        {previousPost ? (
          <Link
            href={`/blog/${previousPost.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-600 dark:text-navy-300 hover:text-slate-900 dark:hover:text-white transition-colors text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Link>
        ) : (
          <div />
        )}

        <Link
          href={`/series/${seriesSlug}`}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Ver série completa
        </Link>

        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-navy-950 font-medium transition-colors text-sm"
          >
            <span className="hidden sm:inline">Próximo</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-navy-500 text-sm cursor-not-allowed">
            <span className="hidden sm:inline">Fim da série</span>
            <CheckCircle className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
