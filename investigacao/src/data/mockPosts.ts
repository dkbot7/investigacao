/**
 * Blog Posts Data - Primary source of truth for all blog posts
 *
 * Updated: 2026-01-17
 * Total posts: 0
 *
 * IMPORTANT: Posts can have content in two ways:
 * 1. MDX files (compiled to HTML via compile-mdx-to-json.js)
 * 2. Direct HTML in the 'content' field (for quick publishing without build issues)
 *
 * This file is the single source of truth - compiledPosts.ts is optional.
 * All metadata and content should be maintained here for reliability.
 */

import { BlogPost, BLOG_TOPICS, BLOG_AUTHORS } from "@/types/blog";

// Debug: verify array construction - v20251222164500
console.log('[mockPosts] Loading MOCK_POSTS array...');

export const MOCK_POSTS: BlogPost[] = [];

console.log(`[mockPosts] Array loaded with ${MOCK_POSTS.length} posts. First post: ${MOCK_POSTS[0]?.slug}`);
