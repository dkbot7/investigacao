const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const blogDir = path.join(__dirname, 'content', 'blog');
const outputFile = path.join(__dirname, 'src', 'data', 'mockPosts.ts');

// Read all MDX files
const files = fs.readdirSync(blogDir)
  .filter(f => f.endsWith('.mdx'))
  .sort();

console.log(`📚 Found ${files.length} MDX files\n`);

// Extract metadata from each file
const posts = files.map((file, index) => {
  const filePath = path.join(blogDir, file);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const slug = file.replace('.mdx', '');

  // Calculate reading time if not in frontmatter
  const words = content.trim().split(/\s+/).length;
  const calculatedReadingTime = Math.ceil(words / 200);
  const readingTime = data.readingTime || calculatedReadingTime;

  // Normalize skillLevel (remove accents)
  const normalizeSkillLevel = (level) => {
    if (!level) return 'iniciante';
    const normalized = level.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Remove accents
    if (normalized === 'intermediario') return 'intermediario';
    if (normalized === 'avancado') return 'avancado';
    return 'iniciante';
  };

  console.log(`${index + 1}. ${data.title} (${readingTime}min)`);

  return {
    id: index + 1,
    slug,
    title: data.title,
    excerpt: data.excerpt,
    coverImage: data.coverImage,
    authorId: data.authorId,
    contentType: data.contentType,
    topicId: data.topicId,
    skillLevel: normalizeSkillLevel(data.skillLevel),
    tags: data.tags || [],
    publishedAt: data.publishedAt,
    readingTime: readingTime,
    featured: data.featured || false,
    popular: data.popular || false,
    views: data.views || undefined,
    videoUrl: data.videoUrl || undefined,
    podcastUrl: data.podcastUrl || undefined,
    downloadUrl: data.downloadUrl || undefined,
  };
});

// Sort by publishedAt (most recent first)
posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

// Renumber IDs after sorting
posts.forEach((post, index) => {
  post.id = index + 1;
});

// Generate TypeScript content
const tsContent = `/**
 * Blog Posts Data - Generated from MDX files
 *
 * Generated: ${new Date().toISOString()}
 * Total posts: ${posts.length}
 *
 * Note: Content is loaded dynamically from MDX files.
 * This file only contains metadata for listing/filtering.
 */

import { BlogPost, BLOG_TOPICS, BLOG_AUTHORS } from "@/types/blog";

export const MOCK_POSTS: BlogPost[] = [
${posts.map(post => `  {
    id: "${post.id}",
    slug: "${post.slug}",
    title: ${JSON.stringify(post.title)},
    excerpt: ${JSON.stringify(post.excerpt)},
    content: "", // Loaded from MDX
    coverImage: ${JSON.stringify(post.coverImage)},
    author: BLOG_AUTHORS.find(a => a.id === "${post.authorId}") || BLOG_AUTHORS[0],
    contentType: "${post.contentType}",
    topic: BLOG_TOPICS.find(t => t.id === "${post.topicId}") || BLOG_TOPICS[0],
    skillLevel: "${post.skillLevel}",
    tags: ${JSON.stringify(post.tags)},
    publishedAt: "${post.publishedAt}",
    readingTime: ${post.readingTime},
    featured: ${post.featured},
    popular: ${post.popular}${post.views ? `,
    views: ${post.views}` : ''}${post.videoUrl ? `,
    videoUrl: ${JSON.stringify(post.videoUrl)}` : ''}${post.podcastUrl ? `,
    podcastUrl: ${JSON.stringify(post.podcastUrl)}` : ''}${post.downloadUrl ? `,
    downloadUrl: ${JSON.stringify(post.downloadUrl)}` : ''}
  }`).join(',\n')}
];
`;

// Write to file
fs.writeFileSync(outputFile, tsContent, 'utf-8');

console.log(`\n✅ Generated ${outputFile}`);
console.log(`📊 Total posts: ${posts.length}`);
console.log(`📅 Date range: ${new Date(posts[posts.length - 1].publishedAt).toLocaleDateString()} to ${new Date(posts[0].publishedAt).toLocaleDateString()}`);
console.log(`⭐ Featured: ${posts.filter(p => p.featured).length}`);
console.log(`🔥 Popular: ${posts.filter(p => p.popular).length}`);
