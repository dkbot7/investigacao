"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BlogPost,
  BlogTopic,
  BlogFilters,
  BlogPagination,
  BLOG_TOPICS,
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

export function useBlog(initialFilters?: BlogFilters): UseBlogReturn {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BlogFilters>(initialFilters || {});
  const [pagination, setPagination] = useState<BlogPagination>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0
  });

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

      // Ordenar por data (mais recente primeiro)
      filteredPosts.sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

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
