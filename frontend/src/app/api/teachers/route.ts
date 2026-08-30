import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { hashPassword, requireAdmin } from '@/lib/auth';

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
    user: usersMap.get(p.userId) ? { ...usersMap.get(p.userId), passwordHash: undefined } : null,
  }));

  return NextResponse.json(result);
}

function generateTempPassword(): string {
  return `Prof${Math.floor(1000 + Math.random() * 9000)}!`;
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  await ensureSeeded();
  const body = await request.json();

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      role: 'TEACHER',
      passwordHash,
      wilayaCode: body.wilayaCode || null,
      wilayaName: body.wilayaName || null,
      institutionName: body.university || null,
      studentCardId: `DZ-TCH-${body.wilayaCode || 16}-${Math.floor(1000 + Math.random() * 9000)}`,
      isVerified: true,
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

  const { passwordHash: _omit, ...safeUser } = user;
  return NextResponse.json({ ...profile, user: safeUser, tempPassword }, { status: 201 });
}
