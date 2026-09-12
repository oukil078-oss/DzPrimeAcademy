import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const count = await prisma.pendingOperation.count({
    where: { status: 'PENDING' },
  });

  return NextResponse.json({ count });
}
