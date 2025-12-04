"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Library, Mail, FileWarning, ShieldAlert, Flame, BookOpen } from "lucide-react";
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
import { useBlog, MOCK_POSTS } from "@/hooks/useBlog";

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

  const [showFullFilters, setShowFullFilters] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Cases práticos (novos posts de casos reais) - primeiros 4
  const casePosts = MOCK_POSTS.filter(post => post.contentType === "case-study").slice(0, 4);

  // Artigos em destaque (featured que NÃO são cases) - primeiros 3
  const featuredArticles = MOCK_POSTS.filter(post => post.featured && post.contentType !== "case-study").slice(0, 3);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchValue });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-navy-950">
        {/* Hero Section - Compacto com busca integrada */}
        <BlogHero
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearch={handleSearch}
        />

        {/* ========== PRIMEIRO VIEWPORT - CASES REAIS ========== */}
        {/* 57% do tempo do usuário é gasto acima da dobra - Cases devem estar aqui */}
        <section className="py-8 border-b border-red-500/20 bg-navy-950">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            {/* Header da seção - Padrão F: título à esquerda */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    Cases Reais
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                      NOVO
                    </span>
                  </h2>
                  <p className="text-xs text-navy-400">
                    Casos anonimizados da nossa atuação
                  </p>
                </div>
              </div>

              <button
                onClick={() => setFilters({ ...filters, contentType: "case-study" })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-colors text-sm text-red-400 font-medium"
              >
                <FileWarning className="w-4 h-4" />
                Ver todos
              </button>
            </div>

            {/* Grid de cases - 4 colunas no desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {casePosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} compact />
              ))}
            </div>
          </div>
        </section>

        {/* ========== ARTIGOS EM DESTAQUE - Logo abaixo ========== */}
        {featuredArticles.length > 0 && (
          <section className="py-8 border-b border-gold-500/10 bg-navy-900/30">
            <div className="container mx-auto px-4 sm:px-8 lg:px-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/20">
                  <Flame className="w-5 h-5 text-gold-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Em Destaque</h2>
                  <p className="text-xs text-navy-400">Artigos mais relevantes</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {featuredArticles.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} compact />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========== BIBLIOTECA COMPLETA - Scroll necessário ========== */}
        <section id="artigos" className="py-10 scroll-mt-20">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            {/* Header compacto + Filtros inline */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-navy-800 border border-gold-500/10">
                    <Library className="w-5 h-5 text-gold-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Todos os Artigos</h2>
                    <p className="text-xs text-navy-400">
                      {pagination.total} artigos disponíveis
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Filters - inline */}
              <QuickFilters
                filters={filters}
                onFiltersChange={setFilters}
                onOpenFullFilters={() => setShowFullFilters(!showFullFilters)}
                totalResults={pagination.total}
                topics={topics}
              />

              {/* Filtros expandidos */}
              {showFullFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <BlogFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    topics={topics}
                  />
                </motion.div>
              )}
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
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {posts.map((post, index) => (
                          <BlogCard key={post.id} post={post} index={index} />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                      >
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-navy-800 flex items-center justify-center">
                          <Library className="w-8 h-8 text-navy-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">
                          Nenhum artigo encontrado
                        </h3>
                        <p className="text-navy-400 mb-4">
                          Tente ajustar os filtros ou termos de busca
                        </p>
                        <button
                          onClick={() => {
                            setFilters({});
                            setSearchValue("");
                          }}
                          className="text-gold-500 hover:text-gold-400 font-medium"
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
        <section className="py-20 border-t border-gold-500/10 bg-gradient-to-b from-navy-950 to-navy-900">
          <div className="container mx-auto px-4 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 mb-6">
                <Mail className="w-4 h-4 text-gold-500" />
                <span className="text-sm text-gold-400 font-medium">Newsletter DFIR</span>
              </div>

              <h3 className="text-3xl font-bold text-white mb-4">
                Mantenha-se à frente nas investigações digitais
              </h3>
              <p className="text-navy-300 mb-8 text-lg">
                Receba semanalmente as últimas inovações em forense digital,
                cases práticos e atualizações sobre LGPD e legislação brasileira.
              </p>

              <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-6">
                <input
                  type="email"
                  placeholder="Seu melhor email profissional"
                  className="flex-1 px-5 py-3.5 rounded-xl bg-navy-800/50 border border-gold-500/20 text-white placeholder:text-navy-400 focus:outline-none focus:border-gold-500/50 transition-colors"
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-semibold rounded-xl transition-colors"
                >
                  Inscrever-se
                </motion.button>
              </form>

              {/* Trust elements */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-navy-500">
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
