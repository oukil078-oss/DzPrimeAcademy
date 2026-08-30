import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  await ensureSeeded();
  const settings = await prisma.platformSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const body = await request.json();

  const settings = await prisma.platformSettings.update({
    where: { id: 'singleton' },
    data: {
      academicYear: body.academicYear,
      ambassadorCommissionRate: body.ambassadorCommissionRate,
      baridiMobEnabled: body.baridiMobEnabled,
      edahabiaEnabled: body.edahabiaEnabled,
    },
  });

  return NextResponse.json(settings);
}
