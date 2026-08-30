import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const settings = await prisma.platformSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
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
