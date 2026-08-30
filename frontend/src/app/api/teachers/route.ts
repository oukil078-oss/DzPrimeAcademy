import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();

  const profiles = await prisma.teacherProfile.findMany({
    include: { payouts: { orderBy: { createdAt: 'desc' }, take: 3 } },
    orderBy: { createdAt: 'asc' },
  });

  const userIds = profiles.map((p) => p.userId);
  const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
  const usersMap = new Map(users.map((u) => [u.id, u]));

  const result = profiles.map((p) => ({
    ...p,
    user: usersMap.get(p.userId) || null,
  }));

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  await ensureSeeded();
  const body = await request.json();

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      role: 'TEACHER',
      wilayaCode: body.wilayaCode || null,
      wilayaName: body.wilayaName || null,
      institutionName: body.university || null,
      studentCardId: `DZ-TCH-${body.wilayaCode || 16}-${Math.floor(1000 + Math.random() * 9000)}`,
      isVerified: false,
    },
  });

  const profile = await prisma.teacherProfile.create({
    data: {
      userId: user.id,
      university: body.university,
      specialty: body.specialty || null,
      hourlyRateDzd: body.hourlyRateDzd ?? 10000,
      ccpAccount: body.ccpAccount || null,
      ccpCle: body.ccpCle || null,
    },
  });

  return NextResponse.json({ ...profile, user }, { status: 201 });
}
