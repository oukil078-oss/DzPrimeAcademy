import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'يرجى تسجيل الدخول للإعجاب بالمنشور' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const isCurrentlyLiked = Boolean(body.isLiked);

  return NextResponse.json({
    success: true,
    postId: id,
    liked: !isCurrentlyLiked,
    likesCount: !isCurrentlyLiked ? 1 : 0,
  });
}
