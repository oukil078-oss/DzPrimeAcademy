import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function GET(request: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  const enrollments = await prisma.enrollment.findMany({
    where: studentId ? { studentId } : undefined,
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(enrollments);
}

export async function POST(request: Request) {
  await ensureSeeded();
  const body = await request.json();

  const enrollment = await prisma.enrollment.create({
    data: {
      studentId: body.studentId,
      courseId: body.courseId,
      courseTitle: body.courseTitle,
      teacherName: body.teacherName,
      progressPercent: body.progressPercent ?? 0,
      remainingHours: body.remainingHours ?? 10,
    },
  });

  return NextResponse.json(enrollment, { status: 201 });
}
