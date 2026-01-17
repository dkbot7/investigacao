"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, ChevronRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Input } from "@/components/ui/input";
import {
  GLOSSARY_TERMS,
  GLOSSARY_CATEGORIES,
  type GlossaryTerm
} from "@/types/blog";

export default function GlossarioPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);

  // Filtrar termos
  const filteredTerms = useMemo(() => {
    let terms = [...GLOSSARY_TERMS];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      terms = terms.filter(
        term =>
          term.term.toLowerCase().includes(search) ||
          term.definition.toLowerCase().includes(search)
      );
    }

    if (selectedCategory) {
      terms = terms.filter(term => term.category === selectedCategory);
    }

    // Ordenar alfabeticamente
    return terms.sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'));
  }, [searchTerm, selectedCategory]);

  // Agrupar por letra inicial
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach(term => {
      const letter = term.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const letters = Object.keys(groupedTerms).sort();

  const getCategoryInfo = (categoryId: string) => {
    return GLOSSARY_CATEGORIES.find(c => c.id === categoryId);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950">
        {/* Hero Section - Compacto (UX: Padrão F) */}
        <section className="relative pt-24 pb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-navy-900 dark:to-navy-950" />

          <div className="container relative mx-auto px-4 sm:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto">
              {/* Layout em linha - Padrão F */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Lado esquerdo - Título e badge */}
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
                    <BookOpen className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                      Glossário{" "}
                      <span className="text-green-500">DFIR</span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-navy-400">
                      Termos técnicos validados por Perito Criminal
                    </p>
                  </div>
                </div>

                {/* Lado direito - Busca */}
                <div className="w-full lg:w-auto lg:min-w-[300px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-navy-400" />
                    <Input
                      type="text"
                      placeholder="Buscar termo..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 bg-slate-100 dark:bg-navy-800/50 border-green-500/20 text-slate-900 dark:text-white placeholder:text-slate-500 dark:text-navy-400 focus:border-green-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filtros por categoria */}
        <section className="py-8 border-y border-green-500/10 bg-white dark:bg-navy-900/30">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === null
                    ? "bg-green-500 text-navy-950 shadow-lg"
                    : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-navy-300 hover:text-white hover:bg-navy-700 hover:scale-105 hover:shadow-md"
                }`}
              >
                Todos ({GLOSSARY_TERMS.length})
              </button>
              {GLOSSARY_CATEGORIES.map(category => {
                const count = GLOSSARY_TERMS.filter(t => t.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      selectedCategory === category.id
                        ? "text-navy-950 shadow-lg"
                        : "bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-navy-300 hover:text-white hover:bg-navy-700 hover:scale-105 hover:shadow-md"
                    }`}
                    style={selectedCategory === category.id ? { backgroundColor: category.color } : {}}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Índice alfabético */}
        <section className="py-4 border-b border-green-500/10 bg-white dark:bg-navy-900/20 sticky top-16 z-40">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {letters.map(letter => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-900 dark:text-white hover:bg-green-500 hover:text-navy-950 hover:scale-110 hover:shadow-lg transition-all duration-200 font-medium text-sm"
                >
                  {letter}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Lista de termos */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            {filteredTerms.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <BookOpen className="w-16 h-16 text-navy-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">
                  Nenhum termo encontrado
                </h3>
                <p className="text-slate-500 dark:text-navy-400">
                  Tente buscar por outro termo ou limpe os filtros
                </p>
              </motion.div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {letters.map(letter => (
                  <div key={letter} id={`letter-${letter}`} className="mb-12">
                    {/* Letra */}
                    <div className="sticky top-32 z-30 mb-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-green-500 text-navy-950 font-bold text-xl">
                        {letter}
                      </div>
                    </div>

                    {/* Termos */}
                    <div className="space-y-4">
                      {groupedTerms[letter].map((term, index) => {
                        const categoryInfo = getCategoryInfo(term.category);
                        const isExpanded = expandedTerm === term.id;

                        return (
                          <motion.div
                            key={term.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className={`bg-white dark:bg-navy-900/50 border rounded-xl overflow-hidden transition-all ${
                              isExpanded ? "border-green-500/50" : "border-green-500/10 hover:border-green-500/30"
                            }`}
                          >
                            <button
                              onClick={() => setExpandedTerm(isExpanded ? null : term.id)}
                              className="w-full p-5 flex items-start gap-4 text-left hover:bg-slate-50 dark:hover:bg-navy-800/50 transition-colors duration-200"
                            >
                              <ChevronRight
                                className={`w-5 h-5 text-green-500 mt-0.5 flex-shrink-0 transition-transform ${
                                  isExpanded ? "rotate-90" : ""
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {term.term}
                                  </h3>
                                  {categoryInfo && (
                                    <span
                                      className="px-2 py-0.5 rounded text-xs font-medium"
                                      style={{
                                        backgroundColor: `${categoryInfo.color}20`,
                                        color: categoryInfo.color
                                      }}
                                    >
                                      {categoryInfo.name}
                                    </span>
                                  )}
                                </div>
                                <p className={`text-slate-600 dark:text-navy-300 ${isExpanded ? "" : "line-clamp-2"}`}>
                                  {term.definition}
                                </p>
                              </div>
                            </button>

                            {/* Conteúdo expandido */}
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="px-5 pb-5 border-t border-green-500/10"
                              >
                                <div className="pt-4">
                                  {term.relatedTerms && term.relatedTerms.length > 0 && (
                                    <div className="mb-4">
                                      <h4 className="text-sm font-medium text-slate-500 dark:text-navy-400 mb-2">
                                        Termos relacionados:
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {term.relatedTerms.map(related => {
                                          const relatedTerm = GLOSSARY_TERMS.find(t => t.id === related);
                                          return relatedTerm ? (
                                            <button
                                              key={related}
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                setExpandedTerm(related);
                                                document.getElementById(`letter-${relatedTerm.term[0].toUpperCase()}`)?.scrollIntoView({ behavior: 'smooth' });
                                              }}
                                              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-green-400 text-sm hover:bg-navy-700 hover:scale-105 hover:shadow-md transition-all duration-200"
                                            >
                                              {relatedTerm.term}
                                            </button>
                                          ) : (
                                            <span
                                              key={related}
                                              className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-500 dark:text-navy-400 text-sm"
                                            >
                                              {related}
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  <Link
                                    href={`/blog?search=${encodeURIComponent(term.term)}`}
                                    className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 hover:translate-x-1 text-sm font-medium transition-all duration-200"
                                  >
                                    Ver artigos sobre {term.term}
                                    <ExternalLink className="w-4 h-4" />
                                  </Link>
                                </div>
                              </motion.div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-green-500/10">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-center"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Faltou algum termo?
              </h3>
              <p className="text-slate-600 dark:text-navy-300 mb-6">
                Sugira novos termos para adicionarmos ao glossário.
                Nosso time de especialistas revisa e adiciona regularmente.
              </p>
              <Link
                href="/contato"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 hover:scale-105 hover:shadow-lg text-navy-950 font-semibold rounded-xl transition-all duration-200"
              >
                Sugerir termo
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

