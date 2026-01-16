/**
 * Script to extract metadata from MDX files and generate mockPosts.ts
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const OUTPUT_FILE = path.join(process.cwd(), 'src', 'data', 'mockPosts.ts');

// Read all MDX files
const mdxFiles = fs.readdirSync(BLOG_DIR).filter(file => file.endsWith('.mdx'));

console.log(`Found ${mdxFiles.length} MDX files`);

// Extract metadata from each file
const posts = mdxFiles.map((file, index) => {
  const filePath = path.join(BLOG_DIR, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  // Calculate reading time
  const words = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / 200);

  // Count lines for content length
  const lines = content.split('\n').length;

  console.log(`${index + 1}. ${data.title} (${lines} lines, ${readingTime}min)`);

  return {
    id: (index + 1).toString(),
    slug: file.replace('.mdx', ''),
    title: data.title,
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    authorId: data.authorId,
    contentType: data.contentType,
    topicId: data.topicId,
    skillLevel: data.skillLevel,
    tags: data.tags || [],
    publishedAt: data.publishedAt,
    readingTime: data.readingTime || readingTime,
    featured: data.featured || false,
    popular: data.popular || false,
    views: data.views || Math.floor(Math.random() * 5000),
    videoUrl: data.videoUrl,
    podcastUrl: data.podcastUrl,
    downloadUrl: data.downloadUrl,
  };
});

// Sort by publishedAt (most recent first)
posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

// Generate TypeScript file content
const tsContent = `/**
 * Blog Posts Data - Auto-generated from MDX files
 * Generated on: ${new Date().toISOString()}
 * Total posts: ${posts.length}
 */

import { BlogPost, BLOG_TOPICS, BLOG_AUTHORS } from "@/types/blog";

export const MOCK_POSTS: BlogPost[] = ${JSON.stringify(posts, null, 2)
  .replace(/"id":/g, 'id:')
  .replace(/"slug":/g, 'slug:')
  .replace(/"title":/g, 'title:')
  .replace(/"excerpt":/g, 'excerpt:')
  .replace(/"content":/g, 'content:')
  .replace(/"coverImage":/g, 'coverImage:')
  .replace(/"author":/g, 'author:')
  .replace(/"authorId":/g, 'authorId:')
  .replace(/"contentType":/g, 'contentType:')
  .replace(/"topic":/g, 'topic:')
  .replace(/"topicId":/g, 'topicId:')
  .replace(/"skillLevel":/g, 'skillLevel:')
  .replace(/"tags":/g, 'tags:')
  .replace(/"publishedAt":/g, 'publishedAt:')
  .replace(/"readingTime":/g, 'readingTime:')
  .replace(/"featured":/g, 'featured:')
  .replace(/"popular":/g, 'popular:')
  .replace(/"views":/g, 'views:')
  .replace(/"videoUrl":/g, 'videoUrl:')
  .replace(/"podcastUrl":/g, 'podcastUrl:')
  .replace(/"downloadUrl":/g, 'downloadUrl:')
}.map(post => ({
  ...post,
  content: "", // Content is loaded from MDX files
  author: BLOG_AUTHORS.find(a => a.id === post.authorId) || BLOG_AUTHORS[0],
  topic: BLOG_TOPICS.find(t => t.id === post.topicId) || BLOG_TOPICS[0],
}));
`;

// Write to file
fs.writeFileSync(OUTPUT_FILE, tsContent, 'utf-8');

console.log(`\n✅ Generated ${OUTPUT_FILE}`);
console.log(`📊 Total posts: ${posts.length}`);
console.log(`📅 Date range: ${posts[posts.length - 1].publishedAt} to ${posts[0].publishedAt}`);
