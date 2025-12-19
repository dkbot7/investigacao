import { NextResponse } from 'next/server';
import { MOCK_POSTS } from '@/data/mockPosts';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: MOCK_POSTS.length,
      firstPost: MOCK_POSTS[0] ? {
        slug: MOCK_POSTS[0].slug,
        title: MOCK_POSTS[0].title,
        hasAuthor: !!MOCK_POSTS[0].author,
        hasTopic: !!MOCK_POSTS[0].topic,
        authorType: typeof MOCK_POSTS[0].author,
        topicType: typeof MOCK_POSTS[0].topic,
      } : null,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
