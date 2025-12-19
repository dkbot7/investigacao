import { NextResponse } from 'next/server';
import { MOCK_POSTS } from '@/data/mockPosts';

export async function GET() {
  return NextResponse.json({
    posts: MOCK_POSTS,
    count: MOCK_POSTS.length,
  });
}
