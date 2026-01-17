"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { User, Linkedin, Twitter, ArrowRight } from "lucide-react";
import { BlogAuthor } from "@/types/blog";

interface AuthorCardProps {
  author: BlogAuthor;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white dark:bg-white/30 dark:bg-navy-900/30 border border-green-500/10 rounded-xl p-6"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {author.avatar ? (
            <Image
              src={author.avatar}
              alt={author.name}
              width={80}
              height={80}
              className="rounded-full border-2 border-green-500/20"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center border-2 border-green-500/20">
              <User className="w-8 h-8 text-green-500" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <p className="text-xs text-green-500 font-medium mb-1">Escrito por</p>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{author.name}</h4>
          <p className="text-sm text-slate-500 dark:text-navy-400 mb-3">{author.role}</p>

          {author.bio && (
            <p className="text-sm text-slate-600 dark:text-navy-300 mb-4 line-clamp-2">{author.bio}</p>
          )}

          <div className="flex items-center gap-3">
            {/* Social links */}
            {author.social?.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-navy-700 text-slate-500 dark:text-navy-400 hover:text-slate-900 dark:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {author.social?.twitter && (
              <a
                href={author.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-navy-700 text-slate-500 dark:text-navy-400 hover:text-slate-900 dark:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}

            {/* Ver mais artigos */}
            <Link
              href={`/blog?author=${author.id}`}
              className="flex items-center gap-1 text-sm text-green-500 hover:text-green-400 transition-colors ml-auto"
            >
              Ver mais artigos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

