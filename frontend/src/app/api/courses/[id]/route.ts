import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.course.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
