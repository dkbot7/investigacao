import { NextResponse } from 'next/server';
import { MOCK_POSTS } from '@/data/mockPosts';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      count: MOCK_POSTS.length,
      slugs: MOCK_POSTS.map(p => p.slug),
      firstThree: MOCK_POSTS.slice(0, 3).map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
      })),
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
