import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

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
    user: usersMap.get(a.userId) || null,
    ratings: ratingsMap.get(a.id) || [],
  }));
  return NextResponse.json(result);
}

export async function PUT(request: Request) {
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
