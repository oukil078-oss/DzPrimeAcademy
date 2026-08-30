import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  const { id } = await params;
  const bundle = await prisma.bundle.findUnique({ where: { id } });
  if (!bundle || !bundle.isActive) {
    return NextResponse.json({ error: 'الباقة غير متوفرة' }, { status: 404 });
  }

  const purchase = await prisma.bundlePurchase.create({
    data: {
      bundleId: bundle.id,
      bundleTitleAr: bundle.titleAr,
      userId: user.id,
      userName: user.name,
      amountDzd: bundle.currentPriceDzd,
      paymentStatus: 'MOCK_SUCCESS',
    },
  });

  return NextResponse.json(purchase, { status: 201 });
}
