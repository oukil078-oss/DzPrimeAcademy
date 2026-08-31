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

  const settings = await prisma.platformSettings.upsert({
    where: { id: 'singleton' },
    update: {
      academicYear: body.academicYear !== undefined ? body.academicYear : undefined,
      ambassadorCommissionRate: body.ambassadorCommissionRate !== undefined ? Number(body.ambassadorCommissionRate) : undefined,
      baridiMobEnabled: body.baridiMobEnabled !== undefined ? Boolean(body.baridiMobEnabled) : undefined,
      edahabiaEnabled: body.edahabiaEnabled !== undefined ? Boolean(body.edahabiaEnabled) : undefined,
      ccpReceiptsEnabled: body.ccpReceiptsEnabled !== undefined ? Boolean(body.ccpReceiptsEnabled) : undefined,
      autoVerifyCards: body.autoVerifyCards !== undefined ? Boolean(body.autoVerifyCards) : undefined,
    },
    create: {
      id: 'singleton',
      academicYear: body.academicYear || '2025/2026',
      ambassadorCommissionRate: body.ambassadorCommissionRate !== undefined ? Number(body.ambassadorCommissionRate) : 10,
      baridiMobEnabled: body.baridiMobEnabled !== undefined ? Boolean(body.baridiMobEnabled) : true,
      edahabiaEnabled: body.edahabiaEnabled !== undefined ? Boolean(body.edahabiaEnabled) : true,
      ccpReceiptsEnabled: body.ccpReceiptsEnabled !== undefined ? Boolean(body.ccpReceiptsEnabled) : true,
      autoVerifyCards: body.autoVerifyCards !== undefined ? Boolean(body.autoVerifyCards) : false,
    },
  });

  return NextResponse.json(settings);
}
