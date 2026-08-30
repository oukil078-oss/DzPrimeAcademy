import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { requireRole } from '@/lib/auth';

export async function GET() {
  await ensureSeeded();
  const sessions = await prisma.liveSession.findMany({ orderBy: { scheduledAt: 'asc' } });
  const sessionIds = sessions.map((s) => s.id);
  const registrations = await prisma.sessionRegistration.groupBy({
    by: ['sessionId'],
    where: { sessionId: { in: sessionIds } },
    _count: { id: true },
  });
  const countMap = new Map(registrations.map((r) => [r.sessionId, r._count.id]));

  return NextResponse.json(sessions.map((s) => ({ ...s, registrationsCount: countMap.get(s.id) || 0 })));
}

export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ['TEACHER', 'OWNER', 'ADMIN', 'MODERATOR']);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  await ensureSeeded();
  const body = await request.json();
  const isTeacher = user.role === 'TEACHER';

  const scheduledDate = new Date(body.scheduledAt);
  if (isNaN(scheduledDate.getTime()) || scheduledDate < new Date()) {
    return NextResponse.json({ error: 'لا يمكن جدولة حصة في تاريخ ماضٍ' }, { status: 400 });
  }

  const session = await prisma.liveSession.create({
    data: {
      title: body.title,
      courseId: body.courseId || null,
      teacherId: isTeacher ? user.id : body.teacherId || null,
      teacherName: isTeacher ? user.name : body.teacherName,
      scheduledAt: scheduledDate,
      durationMinutes: body.durationMinutes ?? 60,
      platform: body.platform || 'GOOGLE_MEET',
      meetUrl: body.meetUrl || null,
      wilayaCode: body.wilayaCode ?? null,
      category: body.category || 'UNIVERSITY_LMD',
      status: 'UPCOMING',
    },
  });

  return NextResponse.json(session, { status: 201 });
}
