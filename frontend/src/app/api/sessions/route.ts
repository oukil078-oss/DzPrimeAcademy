import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const sessions = await prisma.liveSession.findMany({ orderBy: { scheduledAt: 'asc' } });
  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  await ensureSeeded();
  const body = await request.json();

  const session = await prisma.liveSession.create({
    data: {
      title: body.title,
      courseId: body.courseId || null,
      teacherId: body.teacherId || null,
      teacherName: body.teacherName,
      scheduledAt: new Date(body.scheduledAt),
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
