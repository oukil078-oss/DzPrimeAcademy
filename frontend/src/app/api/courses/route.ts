import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  await ensureSeeded();
  const body = await request.json();

  const course = await prisma.course.create({
    data: {
      titleAr: body.titleAr,
      titleFr: body.titleFr || null,
      titleEn: body.titleEn || null,
      description: body.description || null,
      teacherId: body.teacherId || null,
      teacherName: body.teacherName,
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
