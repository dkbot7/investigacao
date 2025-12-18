"use client";

import { motion } from "framer-motion";
import { Zap, Search, MessageCircle, CheckCircle, Clock, ShieldCheck, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BlogHeroProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: (e: React.FormEvent) => void;
}

export default function BlogHero({ searchValue = "", onSearchChange, onSearch }: BlogHeroProps) {
  return (
    <section className="relative pt-24 pb-6 overflow-hidden">
      {/* Background gradient - simplificado */}
      <div className="absolute inset-0 bg-gradient-to-b from-navy-50 to-navy-100 dark:from-navy-950 dark:to-navy-900" />

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
                <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 dark:text-white">
                  Blog{" "}
                  <span className="text-blue-500">Investigaree</span>
                </h1>
                <p className="text-sm text-navy-600 dark:text-navy-400">
                  Cases reais, OSINT e forense digital
                </p>
              </div>
            </div>

            {/* Lado direito - Busca (acessível sem scroll) */}
            <form onSubmit={onSearch} className="w-full lg:w-auto lg:min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-600 dark:text-navy-400" />
                <Input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10 pr-4 bg-navy-100 dark:bg-navy-800/50 border-blue-500/20 text-navy-900 dark:text-white placeholder:text-navy-600 dark:placeholder:text-navy-400 focus:border-blue-500/50"
                />
              </div>
            </form>
          </div>

          {/* CTA WhatsApp - Above the Fold */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-2 border-green-500/30 rounded-xl"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-green-500/20 flex-shrink-0">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base">
                    Dúvidas sobre investigação digital?
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-navy-300">
                    Fale com especialista agora. Resposta em 24h.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).openWhatsAppModal) {
                    (window as any).openWhatsAppModal(
                      "Olá! Vim do blog e gostaria de saber mais sobre investigação.",
                      "blog-hero"
                    );
                  }
                }}
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto flex-shrink-0"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Falar Agora
              </Button>
            </div>
          </motion.div>

          {/* Trust badges com social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-navy-700 dark:text-navy-500"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs">5.950 investigações realizadas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs">Resposta em 24h</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs">Perito Criminal Oficial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs">4.9/5 estrelas</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
