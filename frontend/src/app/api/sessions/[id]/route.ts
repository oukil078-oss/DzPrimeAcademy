import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.liveSession.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
