import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

async function assertOwnershipOrAdmin(request: NextRequest, sessionId: string) {
  const authResult = await requireRole(request, ['TEACHER', 'OWNER', 'ADMIN', 'MODERATOR']);
  if ('error' in authResult) return authResult;

  const { user } = authResult;
  if (user.role === 'TEACHER') {
    const session = await prisma.liveSession.findUnique({ where: { id: sessionId } });
    if (!session || session.teacherId !== user.id) {
      return { error: NextResponse.json({ error: 'لا تملك صلاحية تعديل هذه الحصة' }, { status: 403 }) };
    }
  }
  return { user };
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authResult = await assertOwnershipOrAdmin(request, id);
  if ('error' in authResult) return authResult.error;

  const body = await request.json();
  const session = await prisma.liveSession.update({
    where: { id },
    data: {
      title: body.title,
      teacherName: body.teacherName,
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      durationMinutes: body.durationMinutes,
      platform: body.platform,
      meetUrl: body.meetUrl,
      status: body.status,
    },
  });

  return NextResponse.json(session);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authResult = await assertOwnershipOrAdmin(request, id);
  if ('error' in authResult) return authResult.error;

  await prisma.sessionRegistration.deleteMany({ where: { sessionId: id } });
  await prisma.liveSession.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
