"use client";

import { motion } from "framer-motion";
import { Zap, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface BlogHeroProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (e: React.FormEvent) => void;
}

export default function BlogHero({ searchValue = "", onSearchChange, onSearch }: BlogHeroProps) {
  return (
    <section className="relative pt-24 pb-6 overflow-hidden">
      {/* Background gradient - simplificado */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900" />

      <div className="container mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Layout em linha - Padrão F otimizado */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Lado esquerdo - Título e badge (onde o olho foca primeiro) */}
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <Zap className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                  Blog{" "}
                  <span className="text-blue-500">Investigaree</span>
                </h1>
                <p className="text-sm text-slate-500 dark:text-navy-400">
                  Cases reais, OSINT e forense digital
                </p>
              </div>
            </div>

            {/* Lado direito - Busca (acessível sem scroll) */}
            <form onSubmit={onSearch} className="w-full lg:w-auto lg:min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-navy-400" />
                <Input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10 pr-4 bg-slate-100 dark:bg-navy-800/50 border-blue-500/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-navy-400 focus:border-blue-500/50"
                />
              </div>
            </form>
          </div>

          {/* Trust badges inline - compactos */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 mt-4 text-slate-900 dark:text-navy-500"
          >
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs">Atualizado semanalmente</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-xs">Especialistas DFIR</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span className="text-xs">Legislação brasileira</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
