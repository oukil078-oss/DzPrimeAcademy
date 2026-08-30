import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { requireRole } from '@/lib/auth';

export async function GET() {
  await ensureSeeded();
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(courses);
}

export async function POST(request: NextRequest) {
  const authResult = await requireRole(request, ['TEACHER', 'OWNER', 'ADMIN', 'MODERATOR']);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  await ensureSeeded();
  const body = await request.json();

  const isTeacher = user.role === 'TEACHER';

  let teacherId: string | null = isTeacher ? user.id : body.teacherId || null;
  const teacherName = isTeacher ? user.name : body.teacherName;
  if (!teacherId && teacherName) {
    const matchedTeacher = await prisma.user.findFirst({ where: { name: teacherName, role: 'TEACHER' } });
    if (matchedTeacher) teacherId = matchedTeacher.id;
  }

  const course = await prisma.course.create({
    data: {
      titleAr: body.titleAr,
      titleFr: body.titleFr || null,
      titleEn: body.titleEn || null,
      description: body.description || null,
      teacherId,
      teacherName,
      category: body.category || 'UNIVERSITY_LMD',
      lessonsCount: body.lessonsCount ?? 8,
      rating: body.rating ?? 5.0,
      priceDzd: body.priceDzd ?? 0,
      isLive: body.isLive ?? false,
      colorTheme: body.colorTheme || 'lime',
    },
  });

  return NextResponse.json(course, { status: 201 });
}
