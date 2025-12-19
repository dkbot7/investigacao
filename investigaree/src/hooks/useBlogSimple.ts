"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  BlogPost,
  BlogTopic,
  BlogFilters,
  BlogPagination,
  BLOG_TOPICS,
} from "@/types/blog";

interface UseBlogReturn {
  posts: BlogPost[];
  featuredPosts: BlogPost[];
  popularPosts: BlogPost[];
  topics: BlogTopic[];
  pagination: BlogPagination;
  loading: boolean;
  error: string | null;
  filters: BlogFilters;
  setFilters: (filters: BlogFilters) => void;
  setPage: (page: number) => void;
}

interface UseBlogOptions {
  allPosts: BlogPost[]; // SEMPRE vem do servidor
  initialFilters?: BlogFilters;
  syncWithUrl?: boolean;
}

export function useBlogSimple(options: UseBlogOptions): UseBlogReturn {
  const { allPosts } = options;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentPage, setCurrentPage] = useState(1);
  const [filtersInternal, setFiltersInternal] = useState<BlogFilters>(
    options.initialFilters || {}
  );
  const limit = 9;

  // Unificar filtros
  const filters: BlogFilters = useMemo(() => {
    if (!options.syncWithUrl) return filtersInternal;

    return {
      ...filtersInternal,
      topic: searchParams.get('topic') || undefined,
      contentType: searchParams.get('type') as any || undefined,
      skillLevel: searchParams.get('level') as any || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') as any || undefined,
      sortOrder: searchParams.get('sortOrder') as any || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    };
  }, [searchParams, filtersInternal, options.syncWithUrl]);

  // Processar posts - tudo síncrono com useMemo
  const { posts, pagination, featuredPosts, popularPosts } = useMemo(() => {
    let filtered = [...allPosts];

    // Filtros
    if (filters.topic) {
      filtered = filtered.filter(p =>
        (typeof p.topic === 'object' && p.topic?.slug === filters.topic) ||
        (typeof p.topic === 'string' && p.topic === filters.topic)
      );
    }
    if (filters.contentType) {
      filtered = filtered.filter(p => p.contentType === filters.contentType);
    }
    if (filters.skillLevel) {
      filtered = filtered.filter(p => p.skillLevel === filters.skillLevel);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(s) ||
        p.excerpt.toLowerCase().includes(s) ||
        p.tags.some(t => t.toLowerCase().includes(s))
      );
    }

    // Ordenação
    const sortBy = filters.sortBy || 'date';
    const sortOrder = filters.sortOrder || 'desc';
    filtered.sort((a, b) => {
      let cmp = 0;
      switch (sortBy) {
        case 'date':
          cmp = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
          break;
        case 'views':
          cmp = (b.views || 0) - (a.views || 0);
          break;
        case 'readingTime':
          cmp = b.readingTime - a.readingTime;
          break;
        case 'title':
          cmp = a.title.localeCompare(b.title, 'pt-BR');
          break;
      }
      return sortOrder === 'asc' ? -cmp : cmp;
    });

    // Paginação
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (currentPage - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      posts: paginated,
      pagination: { page: currentPage, limit, total, totalPages },
      featuredPosts: allPosts.filter(p => p.featured).slice(0, 3),
      popularPosts: allPosts.filter(p => p.popular).slice(0, 5),
    };
  }, [allPosts, filters, currentPage, limit]);

  // Sincronizar com URL
  const setFilters = useCallback((newFilters: BlogFilters) => {
    setFiltersInternal(newFilters);

    if (options.syncWithUrl) {
      const params = new URLSearchParams();
      if (newFilters.topic) params.set('topic', newFilters.topic);
      if (newFilters.contentType) params.set('type', newFilters.contentType);
      if (newFilters.skillLevel) params.set('level', newFilters.skillLevel);
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
      if (newFilters.sortOrder) params.set('sortOrder', newFilters.sortOrder);

      const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
      router.replace(newUrl, { scroll: false });
    }
  }, [options.syncWithUrl, pathname, router]);

  // Reset página quando filtros mudam
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    posts,
    featuredPosts,
    popularPosts,
    topics: BLOG_TOPICS,
    pagination,
    loading: false, // Nunca loading porque recebe tudo do servidor
    error: null,
    filters,
    setFilters,
    setPage,
  };
}
