import { NextResponse } from 'next/server';
import { MOCK_POSTS } from '@/data/mockPosts';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      mockPostsCount: MOCK_POSTS.length,
      firstPost: MOCK_POSTS[0] ? {
        id: MOCK_POSTS[0].id,
        slug: MOCK_POSTS[0].slug,
        title: MOCK_POSTS[0].title,
        excerpt: MOCK_POSTS[0].excerpt,
        author: {
          id: MOCK_POSTS[0].author?.id,
          name: MOCK_POSTS[0].author?.name,
          type: typeof MOCK_POSTS[0].author,
        },
        topic: {
          id: MOCK_POSTS[0].topic?.id,
          name: MOCK_POSTS[0].topic?.name,
          type: typeof MOCK_POSTS[0].topic,
        },
      } : null,
      serializedSize: JSON.stringify(MOCK_POSTS).length,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
