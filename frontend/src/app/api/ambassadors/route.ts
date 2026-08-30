import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { hashPassword, requireAdmin } from '@/lib/auth';

export async function GET() {
  await ensureSeeded();
  const ambassadors = await prisma.ambassadorProfile.findMany({
    orderBy: { createdAt: 'asc' },
  });

  const userIds = ambassadors.map((a) => a.userId);
  const users = await prisma.user.findMany({ where: { id: { in: userIds } } });
  const usersMap = new Map(users.map((u) => [u.id, u]));

  const ambassadorIds = ambassadors.map((a) => a.id);
  const ratings = await prisma.rating.findMany({ where: { ambassadorId: { in: ambassadorIds } } });
  const ratingsMap = new Map<string, typeof ratings>();
  for (const r of ratings) {
    ratingsMap.set(r.ambassadorId, [...(ratingsMap.get(r.ambassadorId) || []), r]);
  }

  const result = ambassadors.map((a) => ({
    ...a,
    user: usersMap.get(a.userId) ? { ...usersMap.get(a.userId), passwordHash: undefined } : null,
    ratings: ratingsMap.get(a.id) || [],
  }));

  return NextResponse.json(result);
}

function generateTempPassword(): string {
  return `Amb${Math.floor(1000 + Math.random() * 9000)}!`;
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const body = await request.json();
  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  const user = await prisma.user.create({
    data: {
      email: body.email,
      name: body.name,
      role: 'AMBASSADOR',
      passwordHash,
      wilayaCode: body.wilayaCode,
      wilayaName: body.wilayaNameFr || body.wilayaNameAr,
      institutionName: body.institutionNameFr || body.institutionNameAr,
      studentCardId: `DZ-AMB-${body.wilayaCode || 16}-${Math.floor(1000 + Math.random() * 9000)}`,
      isVerified: true,
    },
  });

  const promoCode = body.promoCode || `WIL${body.wilayaCode}`;
  const profile = await prisma.ambassadorProfile.create({
    data: {
      userId: user.id,
      wilayaCode: body.wilayaCode,
      wilayaNameAr: body.wilayaNameAr,
      wilayaNameFr: body.wilayaNameFr || null,
      institutionNameAr: body.institutionNameAr,
      institutionNameFr: body.institutionNameFr || null,
      specialtyName: body.specialtyName || null,
      phone: body.phone || null,
      promoCode,
      isVerified: true,
    },
  });

  const { passwordHash: _omit, ...safeUser } = user;
  return NextResponse.json({ ...profile, user: safeUser, tempPassword }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const body = await request.json();
  const { id, ...data } = body;

  const profile = await prisma.ambassadorProfile.update({
    where: { id },
    data: {
      isVerified: data.isVerified,
      upcomingSessionsCount: data.upcomingSessionsCount,
    },
  });

  return NextResponse.json(profile);
}
