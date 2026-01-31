"use client";

import { Metadata } from "next";
import { useState, useEffect } from "react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import BlogPageClient from "@/components/blog/BlogPageClient";
import { BlogPost, BLOG_TOPICS } from "@/types/blog";
import { MOCK_POSTS } from "@/data/mockPosts";

// Metadata será adicionada no layout
// export const metadata: Metadata = { ... }

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar posts mockados
    const loadedPosts = MOCK_POSTS.slice(0, 9); // Primeiros 9 posts
    setPosts(loadedPosts);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Carregando blog...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        <BlogPageClient
          initialPosts={posts}
          initialFeaturedPosts={MOCK_POSTS.slice(0, 3)}
          initialPopularPosts={MOCK_POSTS.slice(3, 8)}
          topics={BLOG_TOPICS}
          initialTotal={MOCK_POSTS.length}
        />
      </main>
      <Footer />
    </>
  );
}
