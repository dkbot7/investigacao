/**
 * BlogPageClient - Client Component for blog listing page
 * Handles interactive features: filters, search, pagination
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Library } from "lucide-react";
import BlogHero from "@/components/blog/BlogHero";
import BlogFilters from "@/components/blog/BlogFilters";
import BlogCard from "@/components/blog/BlogCard";
import BlogSkeleton from "@/components/blog/BlogSkeleton";
import QuickFilters from "@/components/blog/QuickFilters";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogPagination from "@/components/blog/BlogPagination";
import { BlogPost, BlogTopic, BlogFilters as BlogFiltersType } from "@/types/blog";

interface BlogPageClientProps {
  initialPosts: BlogPost[];
  initialFeaturedPosts: BlogPost[];
  initialPopularPosts: BlogPost[];
  topics: BlogTopic[];
  initialTotal: number;
}

export default function BlogPageClient({
  initialPosts,
  initialFeaturedPosts,
  initialPopularPosts,
  topics,
  initialTotal,
}: BlogPageClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<BlogFiltersType>({});
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(initialTotal);
  const [showFullFilters, setShowFullFilters] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const limit = 9;
  const totalPages = Math.ceil(total / limit);

  // Handle client-side filtering (for immediate feedback)
  const handleFiltersChange = async (newFilters: BlogFiltersType) => {
    setFilters(newFilters);
    setPage(1);

    // In a real app, this would fetch from an API
    // For now, we just show loading state
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFiltersChange({ ...filters, search: searchValue });
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <BlogHero
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSearch={handleSearch}
      />

      <section id="artigos" className="py-10 scroll-mt-20">
        <div className="container mx-auto px-4 sm:px-8 lg:px-12">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 border border-green-500/10">
                  <Library className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Todos os Artigos</h2>
                  <p className="text-xs text-slate-500 dark:text-navy-400">
                    {total} artigos disponíveis
                  </p>
                </div>
              </div>
            </div>

            <QuickFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onOpenFullFilters={() => setShowFullFilters(!showFullFilters)}
              totalResults={total}
              topics={topics}
            />

            {showFullFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4"
              >
                <BlogFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  topics={topics}
                />
              </motion.div>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              {loading && <BlogSkeleton count={6} />}

              {!loading && (
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
                          handleFiltersChange({});
                          setSearchValue("");
                        }}
                        className="text-green-500 hover:text-green-400 font-medium"
                      >
                        Limpar filtros
                      </button>
                    </motion.div>
                  )}

                  {posts.length > 0 && (
                    <BlogPagination
                      pagination={{ page, limit, total, totalPages }}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>

            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <BlogSidebar
                  popularPosts={initialPopularPosts}
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

