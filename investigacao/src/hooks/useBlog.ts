"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
// Removed direct import of MOCK_POSTS to reduce client bundle size
// Posts are now fetched from API endpoint for Cloudflare Workers compatibility

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
  debugLog?: string[]; // Debug only
}

interface UseBlogOptions {
  initialFilters?: BlogFilters;
  initialPosts?: BlogPost[]; // Server-provided posts for Cloudflare Workers
  syncWithUrl?: boolean;
}

export function useBlog(options?: UseBlogOptions): UseBlogReturn {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Simple state management
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debugLog, setDebugLog] = useState<string[]>(() => {
    return ['🔵 useBlog hook initialized'];
  });
  const limit = 9;

  // Helper to add debug logs
  const addDebugLog = (msg: string) => {
    setDebugLog(prev => [...prev, `${new Date().toISOString().split('T')[1]}: ${msg}`]);
  };

  // Debug: Log on every render

  // Ler filtros da URL se syncWithUrl=true
  const urlFilters = useMemo(() => {
    if (!options?.syncWithUrl) return {};
    return {
      topic: searchParams.get('topic') || undefined,
      contentType: searchParams.get('type') as ContentType || undefined,
      skillLevel: searchParams.get('level') as SkillLevel || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: searchParams.get('sortBy') as 'date' | 'views' | 'readingTime' | 'title' || undefined,
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
    };
  }, [searchParams, options?.syncWithUrl]);

  const [filtersInternal, setFiltersInternal] = useState<BlogFilters>(
    options?.syncWithUrl ? urlFilters : (options?.initialFilters || {})
  );

  // Unificar filtros
  const activeFilters: BlogFilters = useMemo(() => {
    const base = options?.syncWithUrl ? urlFilters : filtersInternal;
    return { ...filtersInternal, ...base };
  }, [options?.syncWithUrl, urlFilters, filtersInternal]);

  const filters = activeFilters;

  // Initialize posts - fetch from API
  useEffect(() => {
    addDebugLog('✅ useEffect FIRED!');
    addDebugLog(`allPosts.length: ${allPosts.length}`);

    if (allPosts.length > 0) {
      addDebugLog('allPosts already loaded, skipping');
      return;
    }

    const initPosts = async () => {
      addDebugLog('Starting API fetch...');
      setLoading(true);
      setError(null);

      try {
        addDebugLog('Calling fetch...');
        const response = await fetch('/api/blog/posts');
        addDebugLog(`Fetch response: ${response.status}`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        addDebugLog(`✅ Fetched ${data.posts?.length || 0} posts!`);
        addDebugLog(`First: ${data.posts[0]?.title?.substring(0, 30)}`);

        setAllPosts(data.posts || []);
        addDebugLog(`setAllPosts called!`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        addDebugLog(`❌ ERROR: ${errMsg}`);
        setError(`Erro: ${errMsg}`);
      } finally {
        addDebugLog('Setting loading=false');
        setLoading(false);
      }
    };

    initPosts();
  }, []); // Run once on mount

  // Process posts with useMemo for synchronous filtering/sorting/pagination
  const { posts, pagination } = useMemo(() => {

    if (allPosts.length === 0) {
      return {
        posts: [],
        pagination: { page: currentPage, limit, total: 0, totalPages: 0 }
      };
    }

    let filteredPosts = [...allPosts];

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
            post.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)) ||
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
    const totalPages = Math.ceil(total / limit);
    const startIndex = (currentPage - 1) * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);


    return {
      posts: paginatedPosts,
      pagination: { page: currentPage, limit, total, totalPages }
    };
  }, [allPosts, filters, currentPage]);

  // Featured and popular posts
  const featuredPosts = useMemo(() =>
    allPosts.filter(post => post.featured).slice(0, 3),
    [allPosts]
  );

  const popularPosts = useMemo(() =>
    allPosts.filter(post => post.popular).slice(0, 5),
    [allPosts]
  );

  // Sincronizar filtros com URL
  const setFilters = useCallback((newFilters: BlogFilters) => {
    setFiltersInternal(newFilters);

    if (options?.syncWithUrl) {
      const params = new URLSearchParams();
      if (newFilters.topic) params.set('topic', newFilters.topic);
      if (newFilters.contentType) params.set('type', newFilters.contentType);
      if (newFilters.skillLevel) params.set('level', newFilters.skillLevel);
      if (newFilters.search) params.set('search', newFilters.search);
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/blog/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setAllPosts(data.posts || []);
    } catch (err) {
      setError("Erro ao carregar posts do blog");
      console.error("Erro ao buscar posts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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
    refetch,
    debugLog: debugLog.length > 0 ? debugLog : ['⚠️ HARDCODED TEST MESSAGE - Hook is returning data!']
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
        // Fetch from API (Cloudflare Workers compatible)
        const response = await fetch('/api/blog/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        const foundPost = data.posts.find((p: BlogPost) => p.slug === slug);
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

    // Fetch posts from API and calculate related
    const fetchRelated = async () => {
      try {
        const response = await fetch('/api/blog/posts');
        if (!response.ok) return;
        const data = await response.json();
        const allPosts = data.posts || [];

        // Buscar posts do mesmo tópico ou com tags em comum
        const related = allPosts
          .filter((post: BlogPost) => post.id !== currentPost.id)
          .map((post: BlogPost) => {
            let score = 0;

            // Mesmo tópico = +3 pontos
            if (post.topic.id === currentPost.topic.id) score += 3;

            // Mesmo tipo de conteúdo = +2 pontos
            if (post.contentType === currentPost.contentType) score += 2;

            // Tags em comum = +1 ponto cada
            const commonTags = post.tags.filter((tag: string) => currentPost.tags.includes(tag));
            score += commonTags.length;

            return { post, score };
          })
          .filter((item: { post: BlogPost; score: number }) => item.score > 0)
          .sort((a: { post: BlogPost; score: number }, b: { post: BlogPost; score: number }) => b.score - a.score)
          .slice(0, limit)
          .map((item: { post: BlogPost; score: number }) => item.post);

        setRelatedPosts(related);
      } catch (error) {
        console.error('Error fetching related posts:', error);
      }
    };

    fetchRelated();
  }, [currentPost, limit]);

  return relatedPosts;
}
