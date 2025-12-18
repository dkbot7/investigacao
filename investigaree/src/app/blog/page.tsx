"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Library, Mail, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import {
  BlogHero,
  BlogFilters,
  BlogCard,
  BlogPagination,
  BlogSkeleton,
  QuickFilters,
  BlogSidebar
} from "@/components/blog";
import { useBlog } from "@/hooks/useBlog";

export default function BlogPage() {
  const {
    posts,
    featuredPosts,
    popularPosts,
    topics,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    setPage
  } = useBlog();

  const [searchValue, setSearchValue] = useState("");

  // Expor função WhatsApp globalmente para CTAs
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openWhatsAppModal = (message: string, source: string) => {
        // Trigger WhatsApp modal via custom event
        const event = new CustomEvent('openWhatsApp', {
          detail: { message, source }
        });
        window.dispatchEvent(event);
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).openWhatsAppModal;
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchValue });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-slate-50 dark:bg-navy-950">
        {/* Hero Section - Compacto com busca integrada */}
        <BlogHero
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearch={handleSearch}
        />

        {/* ========== BIBLIOTECA COMPLETA ========== */}
        <section id="artigos" className="py-10 scroll-mt-20">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            {/* Header compacto + Filtros inline */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 border border-blue-500/10">
                    <Library className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Todos os Artigos</h2>
                    <p className="text-xs text-slate-500 dark:text-navy-400">
                      {pagination.total} artigos disponíveis
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Filters - inline */}
              <QuickFilters
                filters={filters}
                onFiltersChange={setFilters}
                totalResults={pagination.total}
                topics={topics}
              />
            </div>

            {/* Layout com Sidebar */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Conteúdo principal */}
              <div className="flex-1 min-w-0">
                {/* Estado de erro */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-red-400">{error}</p>
                  </motion.div>
                )}

                {/* Estado de loading */}
                {loading && <BlogSkeleton count={6} />}

                {/* Lista de posts */}
                {!loading && !error && (
                  <>
                    {posts.length > 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                      >
                        {posts.map((post, index) => (
                          <React.Fragment key={post.id}>
                            <BlogCard post={post} index={index} />

                            {/* Card promocional a cada 6 posts */}
                            {index === 5 && (
                              <div className="sm:col-span-2 lg:col-span-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-navy-900 dark:to-purple-900/20 border-2 border-blue-500/20 rounded-xl p-6">
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                  <div className="p-3 bg-blue-500/10 rounded-xl flex-shrink-0">
                                    <Shield className="w-8 h-8 text-blue-500" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">
                                      🔍 Precisa de Investigação Profissional?
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-navy-300 mb-3">
                                      17 serviços especializados: Due Diligence, Background Check, Perícia Forense
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      <Link href="/servicos">
                                        <Button variant="default" size="sm">
                                          Ver Todos os Serviços
                                        </Button>
                                      </Link>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          if (typeof window !== 'undefined' && (window as any).openWhatsAppModal) {
                                            (window as any).openWhatsAppModal(
                                              "Olá! Vim do blog e gostaria de conhecer os serviços.",
                                              "blog-grid-promo"
                                            );
                                          }
                                        }}
                                      >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Falar Agora
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                      >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center">
                          <Library className="w-8 h-8 text-slate-900 dark:text-navy-500" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                          Nenhum artigo encontrado
                        </h3>
                        <p className="text-slate-500 dark:text-navy-400 mb-4">
                          Tente ajustar os filtros ou termos de busca
                        </p>
                        <button
                          onClick={() => {
                            setFilters({});
                            setSearchValue("");
                          }}
                          className="text-blue-500 hover:text-blue-400 font-medium"
                        >
                          Limpar filtros
                        </button>
                      </motion.div>
                    )}

                    {/* Paginação */}
                    {posts.length > 0 && (
                      <BlogPagination pagination={pagination} onPageChange={setPage} />
                    )}
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="w-full lg:w-80 flex-shrink-0">
                <div className="lg:sticky lg:top-24">
                  <BlogSidebar
                    popularPosts={popularPosts}
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA para newsletter - Comunidade */}
        <section className="py-20 border-t border-blue-500/10 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-navy-950 dark:to-navy-900">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-blue-400 font-medium">Newsletter DFIR</span>
              </div>

              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Mantenha-se à frente nas investigações digitais
              </h3>
              <p className="text-slate-600 dark:text-navy-300 mb-8 text-lg">
                Receba semanalmente as últimas inovações em forense digital +
                <strong className="text-blue-500"> Checklist Gratuito de Due Diligence (PDF)</strong>
              </p>

              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
                <input
                  type="email"
                  placeholder="Seu melhor email profissional"
                  className="flex-1 px-5 py-3.5 rounded-xl bg-navy-100 dark:bg-navy-800/50 border border-blue-500/20 text-slate-900 dark:text-white placeholder:text-navy-600 dark:placeholder:text-navy-400 focus:outline-none focus:border-blue-500/50 transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-navy-950 font-semibold rounded-xl transition-colors"
                >
                  Inscrever-se
                </motion.button>
              </form>

              {/* Trust elements */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-900 dark:text-navy-500">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Gratuito
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Sem spam
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Cancele quando quiser
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
