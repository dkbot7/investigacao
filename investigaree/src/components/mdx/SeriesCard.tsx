"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Clock, CheckCircle } from "lucide-react";

interface SeriesCardProps {
  name: string;
  slug: string;
  description: string;
  coverImage?: string;
  totalParts: number;
  publishedParts: number;
  status: "em_andamento" | "completa";
  estimatedTime?: number; // in minutes
  topicColor?: string;
}

export default function SeriesCard({
  name,
  slug,
  description,
  coverImage,
  totalParts,
  publishedParts,
  status,
  estimatedTime,
  topicColor = "#D4AF37",
}: SeriesCardProps) {
  const progress = (publishedParts / totalParts) * 100;
  const isComplete = status === "completa";

  return (
    <Link href={`/series/${slug}`}>
      <motion.article
        whileHover={{ y: -4 }}
        className="group relative rounded-2xl overflow-hidden border border-blue-500/10 bg-white dark:bg-white/50 dark:bg-navy-900/50 hover:border-blue-500/30 transition-colors h-full"
      >
        {/* Cover image */}
        <div className="relative h-40 overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${topicColor}30 0%, ${topicColor}10 100%)`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />

          {/* Status badge */}
          <div className="absolute top-3 right-3">
            {isComplete ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                Completa
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium">
                <Clock className="w-3 h-3" />
                Em andamento
              </span>
            )}
          </div>

          {/* Series icon */}
          <div className="absolute bottom-3 left-3">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${topicColor}20` }}
            >
              <BookOpen className="w-5 h-5" style={{ color: topicColor }} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
            {name}
          </h3>

          <p className="text-sm text-slate-500 dark:text-navy-400 mb-4 line-clamp-2">{description}</p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-slate-900 dark:text-navy-500 mb-1.5">
              <span>
                {publishedParts} de {totalParts} partes
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 dark:bg-navy-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  backgroundColor: isComplete ? "#22c55e" : topicColor,
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            {estimatedTime && (
              <span className="text-xs text-slate-900 dark:text-navy-500">
                ~{estimatedTime} min de leitura total
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-sm text-blue-400 group-hover:text-blue-300 transition-colors ml-auto">
              Ver série
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
