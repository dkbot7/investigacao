/**
 * Blog Loader - Server-side functions for loading blog posts
 *
 * Loads posts from MDX files and combines with mock data
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost, BlogFilters } from '@/types/blog'
import { MOCK_POSTS } from '@/data/mockPosts'

const POSTS_DIR = path.join(process.cwd(), 'content', 'blog')

/**
 * Load all MDX posts from filesystem
 */
export async function loadMDXPosts(): Promise<BlogPost[]> {
  if (!fs.existsSync(POSTS_DIR)) {
    return []
  }

  const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.mdx'))

  const posts: BlogPost[] = []

  for (const file of files) {
    const filePath = path.join(POSTS_DIR, file)
    const source = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(source)

    // Calculate reading time
    const words = source.split(/\s+/).length
    const readingTime = Math.ceil(words / 200)

    posts.push({
      id: data.id || file.replace('.mdx', ''),
      title: data.title,
      slug: file.replace('.mdx', ''),
      excerpt: data.excerpt,
      content: '',
      coverImage: data.coverImage,
      author: data.author || data.authorId,
      contentType: data.contentType,
      topic: data.topic || data.topicId,
      skillLevel: data.skillLevel,
      tags: data.tags || [],
      publishedAt: data.publishedAt,
      updatedAt: data.updatedAt,
      readingTime: data.readingTime || readingTime,
      featured: data.featured || false,
      popular: data.popular || false,
      views: data.views || 0,
    })
  }

  return posts
}

/**
 * Load all posts (MDX + Mock)
 */
export async function loadAllPosts(): Promise<BlogPost[]> {
  const mdxPosts = await loadMDXPosts()

  // Combine with mock posts, avoiding duplicates
  const allPosts = [...mdxPosts]

  for (const mockPost of MOCK_POSTS) {
    if (!allPosts.some(p => p.slug === mockPost.slug)) {
      allPosts.push(mockPost)
    }
  }

  // Sort by date (newest first)
  allPosts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return allPosts
}

/**
 * Filter posts based on criteria
 */
export function filterPosts(posts: BlogPost[], filters: BlogFilters): BlogPost[] {
  let filtered = [...posts]

  // Filter by topic
  if (filters.topic) {
    filtered = filtered.filter(post =>
      (typeof post.topic === 'object' && post.topic?.slug === filters.topic) ||
      (typeof post.topic === 'string' && post.topic === filters.topic)
    )
  }

  // Filter by content type
  if (filters.contentType) {
    filtered = filtered.filter(post => post.contentType === filters.contentType)
  }

  // Filter by skill level
  if (filters.skillLevel) {
    filtered = filtered.filter(post => post.skillLevel === filters.skillLevel)
  }

  // Filter by tag
  if (filters.tag) {
    filtered = filtered.filter(post => post.tags.includes(filters.tag!))
  }

  // Filter by search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(post => {
      const topic = post.topic as any
      const topicMatch = typeof topic === 'string'
        ? (topic as string).toLowerCase().includes(searchLower)
        : topic?.name
        ? (topic.name as string).toLowerCase().includes(searchLower)
        : false

      return (
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        topicMatch
      )
    })
  }

  // Filter by author
  if (filters.author) {
    filtered = filtered.filter(post =>
      typeof post.author === 'string'
        ? post.author === filters.author
        : post.author?.id === filters.author
    )
  }

  return filtered
}

/**
 * Get paginated posts with filters
 */
export async function getPaginatedPosts(
  page: number = 1,
  limit: number = 9,
  filters: BlogFilters = {}
) {
  const allPosts = await loadAllPosts()
  const filtered = filterPosts(allPosts, filters)

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const posts = filtered.slice(startIndex, startIndex + limit)

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  }
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await loadAllPosts()
  return allPosts.filter(post => post.featured).slice(0, limit)
}

/**
 * Get popular posts
 */
export async function getPopularPosts(limit: number = 5): Promise<BlogPost[]> {
  const allPosts = await loadAllPosts()
  return allPosts.filter(post => post.popular).slice(0, limit)
}
