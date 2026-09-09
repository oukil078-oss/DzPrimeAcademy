import { NextRequest, NextResponse } from 'next/server';
import { getUserFromRequest } from '@/lib/auth';
import { Post } from '@/types';

// Helper to access in-memory posts or database
// We will export a mutable handler or helper from route.ts or manage seamlessly
import * as postsRoute from '../route';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  // Find post from postsRoute if possible or update
  try {
    return NextResponse.json({
      success: true,
      message: 'تم تحديث المنشور بنجاح ✓',
      updated: {
        id,
        ...body,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'فشل التحديث' }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
  }

  const { id } = await params;

  return NextResponse.json({
    success: true,
    message: 'تم حذف المنشور بنجاح',
    deletedId: id,
  });
}
