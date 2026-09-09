import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { PostComment } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    success: true,
    postId: id,
    comments: [],
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'يرجى تسجيل الدخول للتعليق على المنشور' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { content } = body;

  if (!content || !String(content).trim()) {
    return NextResponse.json({ error: 'محتوى التعليق لا يمكن أن يكون فارغاً' }, { status: 400 });
  }

  const newComment: PostComment = {
    id: `comment-${Date.now()}`,
    postId: id,
    authorId: currentUser.id,
    authorName: currentUser.name,
    authorAvatar: currentUser.avatar || undefined,
    authorRole: currentUser.role,
    content: String(content).trim(),
    isVerifiedTeacher: currentUser.role === 'TEACHER',
    createdAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    comment: newComment,
    message: 'تمت إضافة التعليق بنجاح ✓',
  });
}
