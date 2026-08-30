import { NextResponse } from 'next/server';
import { RECENT_POSTS } from '@/lib/initial-data';
import { Post } from '@/types';

let localPosts: Post[] = [...RECENT_POSTS];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const wilayaCode = searchParams.get('wilayaCode');

  let results = localPosts;
  if (wilayaCode) {
    results = results.filter((p) => p.wilayaCode === Number(wilayaCode));
  }

  return NextResponse.json({
    success: true,
    posts: results,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPost: Post = {
      id: `post-${Date.now()}`,
      title: body.title,
      content: body.content,
      type: body.type || 'ANNOUNCEMENT',
      wilayaCode: body.wilayaCode || 16,
      wilayaName: body.wilayaName || 'الجزائر العاصمة',
      institutionName: body.institutionName || 'جامعة USTHB',
      isOnline: Boolean(body.isOnline),
      location: body.location,
      meetUrl: body.meetUrl,
      isApproved: true,
      authorId: body.authorId || 'user-ambassador',
      authorName: body.authorName || 'سفير المنصة',
      authorRole: 'AMBASSADOR',
      createdAt: new Date().toISOString().split('T')[0],
    };

    localPosts = [newPost, ...localPosts];

    return NextResponse.json({
      success: true,
      post: newPost,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload' },
      { status: 400 }
    );
  }
}
