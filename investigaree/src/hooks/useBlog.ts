"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  BlogPost,
  BlogTopic,
  BlogFilters,
  BlogPagination,
  BLOG_TOPICS,
  ContentType,
  SkillLevel,
} from "@/types/blog";
import { MOCK_POSTS } from "@/data/mockPosts";

// Re-export for backwards compatibility
export { MOCK_POSTS };

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
  refetch: () => void;
}

interface UseBlogOptions {
  initialFilters?: BlogFilters;
  syncWithUrl?: boolean;
}

export function useBlog(options?: UseBlogOptions): UseBlogReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Ler filtros da URL se syncWithUrl=true
  const urlFilters = useMemo(() => {
    if (!options?.syncWithUrl) return {};
    return {
      topic: searchParams.get('topic') || undefined,
      contentType: searchParams.get('type') as ContentType || undefined,
      skillLevel: searchParams.get('level') as SkillLevel || undefined,
      search: searchParams.get('search') || undefined,
      // Ordenação e data na URL
      sortBy: searchParams.get('sortBy') as 'date' | 'views' | 'readingTime' | 'title' || undefined,
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    };
  }, [searchParams, options?.syncWithUrl]);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersInternal, setFiltersInternal] = useState<BlogFilters>(
    options?.syncWithUrl ? urlFilters : (options?.initialFilters || {})
  );
  const [pagination, setPagination] = useState<BlogPagination>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  });

  // Sincronizar filtros com URL
  const setFilters = useCallback((newFilters: BlogFilters) => {
    setFiltersInternal(newFilters);

    if (options?.syncWithUrl) {
      const params = new URLSearchParams();
      if (newFilters.topic) params.set('topic', newFilters.topic);
      if (newFilters.contentType) params.set('type', newFilters.contentType);
      if (newFilters.skillLevel) params.set('level', newFilters.skillLevel);
      if (newFilters.search) params.set('search', newFilters.search);
      // Ordenação e data
      if (newFilters.sortBy) params.set('sortBy', newFilters.sortBy);
      if (newFilters.sortOrder) params.set('sortOrder', newFilters.sortOrder);
      if (newFilters.dateFrom) params.set('dateFrom', newFilters.dateFrom);
      if (newFilters.dateTo) params.set('dateTo', newFilters.dateTo);

      const newUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      router.replace(newUrl, { scroll: false });
    }
  }, [options?.syncWithUrl, pathname, router]);

  // Unificar filtros
  const activeFilters: BlogFilters = useMemo(() => {
    const base = options?.syncWithUrl ? urlFilters : filtersInternal;
    return { ...filtersInternal, ...base };
  }, [options?.syncWithUrl, urlFilters, filtersInternal]);

  const filters = activeFilters;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Simulação com dados mock
      await new Promise(resolve => setTimeout(resolve, 400));

      let filteredPosts = [...MOCK_POSTS];

      // Filtro por tópico
      if (filters.topic) {
        filteredPosts = filteredPosts.filter(
          post => (typeof post.topic === 'object' && post.topic?.slug === filters.topic) ||
                  (typeof post.topic === 'string' && post.topic === filters.topic)
        );
      }

      // Filtro por tipo de conteúdo
      if (filters.contentType) {
        filteredPosts = filteredPosts.filter(
          post => post.contentType === filters.contentType
        );
      }

      // Filtro por nível de habilidade
      if (filters.skillLevel) {
        filteredPosts = filteredPosts.filter(
          post => post.skillLevel === filters.skillLevel
        );
      }

      // Filtro por tag
      if (filters.tag) {
        filteredPosts = filteredPosts.filter(
          post => post.tags.includes(filters.tag!)
        );
      }

      // Filtro por busca textual
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredPosts = filteredPosts.filter(
          post => {
            const topic = post.topic as any;
            const topicMatch = typeof topic === 'string'
              ? (topic as string).toLowerCase().includes(searchLower)
              : topic?.name
              ? (topic.name as string).toLowerCase().includes(searchLower)
              : false;

            return post.title.toLowerCase().includes(searchLower) ||
              post.excerpt.toLowerCase().includes(searchLower) ||
              post.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
              topicMatch;
          }
        );
      }

      // Filtro por autor
      if (filters.author) {
        filteredPosts = filteredPosts.filter(
          post => (typeof post.author === 'string' ? post.author === filters.author : post.author?.id === filters.author)
        );
      }

      // Filtro por data
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom).getTime();
        filteredPosts = filteredPosts.filter(
          post => new Date(post.publishedAt).getTime() >= fromDate
        );
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo).getTime();
        filteredPosts = filteredPosts.filter(
          post => new Date(post.publishedAt).getTime() <= toDate
        );
      }

      // Ordenação dinâmica
      const sortBy = filters.sortBy || 'date';
      const sortOrder = filters.sortOrder || 'desc';

      filteredPosts.sort((a, b) => {
        let comparison = 0;

        switch (sortBy) {
          case 'date':
            comparison = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
            break;
          case 'views':
            comparison = (b.views || 0) - (a.views || 0);
            break;
          case 'readingTime':
            comparison = b.readingTime - a.readingTime;
            break;
          case 'title':
            comparison = a.title.localeCompare(b.title, 'pt-BR');
            break;
        }

        return sortOrder === 'asc' ? -comparison : comparison;
      });

      // Paginação
      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / pagination.limit);
      const startIndex = (pagination.page - 1) * pagination.limit;
      const paginatedPosts = filteredPosts.slice(startIndex, startIndex + pagination.limit);

      setPosts(paginatedPosts);
      setPagination(prev => ({
        ...prev,
        total,
        totalPages
      }));
    } catch (err) {
      setError("Erro ao carregar posts do blog");
      console.error("Erro ao buscar posts:", err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Reset da página quando filtros mudam
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters]);

  const setPage = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const featuredPosts = MOCK_POSTS.filter(post => post.featured).slice(0, 3);
  const popularPosts = MOCK_POSTS.filter(post => post.popular).slice(0, 5);

  return {
    posts,
    featuredPosts,
    popularPosts,
    topics: BLOG_TOPICS,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    setPage,
    refetch: fetchPosts
  };
}

// Hook para buscar um post específico
export function useBlogPost(slug: string) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Substituir por chamada real à API
        await new Promise(resolve => setTimeout(resolve, 300));

        const foundPost = MOCK_POSTS.find(p => p.slug === slug);
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError("Post não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar o post");
        console.error("Erro ao buscar post:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  return { post, loading, error };
}

// Hook para buscar posts relacionados
export function useRelatedPosts(currentPost: BlogPost | null, limit = 3) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    if (!currentPost) {
      setRelatedPosts([]);
      return;
    }

    // Buscar posts do mesmo tópico ou com tags em comum
    const related = MOCK_POSTS
      .filter(post => post.id !== currentPost.id)
      .map(post => {
        let score = 0;

        // Mesmo tópico = +3 pontos
        if (post.topic.id === currentPost.topic.id) score += 3;

        // Mesmo tipo de conteúdo = +2 pontos
        if (post.contentType === currentPost.contentType) score += 2;

        // Tags em comum = +1 ponto cada
        const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag));
        score += commonTags.length;

        return { post, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.post);

    setRelatedPosts(related);
  }, [currentPost, limit]);

  return relatedPosts;
}
