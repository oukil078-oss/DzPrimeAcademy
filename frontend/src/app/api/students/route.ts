import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json(users);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, ...data } = body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      role: data.role,
      isVerified: data.isVerified,
      wilayaCode: data.wilayaCode,
      wilayaName: data.wilayaName,
    },
  });

  return NextResponse.json(user);
}
