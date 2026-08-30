import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

async function assertOwnershipOrAdmin(request: NextRequest, courseId: string) {
  const authResult = await requireRole(request, ['TEACHER', 'OWNER', 'ADMIN', 'MODERATOR']);
  if ('error' in authResult) return authResult;

  const { user } = authResult;
  if (user.role === 'TEACHER') {
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.teacherId !== user.id) {
      return { error: NextResponse.json({ error: 'لا تملك صلاحية تعديل هذا المقرر' }, { status: 403 }) };
    }
  }
  return { user };
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authResult = await assertOwnershipOrAdmin(request, id);
  if ('error' in authResult) return authResult.error;

  const body = await request.json();
  const course = await prisma.course.update({
    where: { id },
    data: {
      titleAr: body.titleAr,
      titleFr: body.titleFr,
      description: body.description,
      teacherName: body.teacherName,
      category: body.category,
      lessonsCount: body.lessonsCount,
      priceDzd: body.priceDzd,
      isLive: body.isLive,
      colorTheme: body.colorTheme,
    },
  });

  return NextResponse.json(course);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authResult = await assertOwnershipOrAdmin(request, id);
  if ('error' in authResult) return authResult.error;

  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
