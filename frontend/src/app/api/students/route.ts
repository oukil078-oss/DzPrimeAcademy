import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  await ensureSeeded();
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true, email: true, name: true, avatar: true, role: true, phone: true,
      wilayaCode: true, wilayaName: true, institutionName: true, studentCardId: true,
      isVerified: true, createdAt: true,
    },
  });
  return NextResponse.json(users);
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

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
    select: {
      id: true, email: true, name: true, avatar: true, role: true, phone: true,
      wilayaCode: true, wilayaName: true, institutionName: true, studentCardId: true,
      isVerified: true, createdAt: true,
    },
  });

  return NextResponse.json(user);
}
