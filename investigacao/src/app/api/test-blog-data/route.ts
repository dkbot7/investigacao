import { NextResponse } from 'next/server';
import { MOCK_POSTS } from '@/data/mockPosts';
import { compiledPosts } from '@/data/compiledPosts';

export async function GET() {
  return NextResponse.json({
    totalPosts: MOCK_POSTS.length,
    posts: MOCK_POSTS.map(p => ({
      slug: p.slug,
      title: p.title,
      hasAuthor: !!p.author,
      hasTopic: !!p.topic,
      authorName: p.author?.name,
      topicName: p.topic?.name,
    })),
    compiledPostsCount: Object.keys(compiledPosts).length,
    compiledSlugs: Object.keys(compiledPosts),
  });
}
