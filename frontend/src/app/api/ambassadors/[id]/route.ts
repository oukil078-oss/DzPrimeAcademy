import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;
  const profile = await prisma.ambassadorProfile.findUnique({ where: { id } });
  if (!profile) {
    return NextResponse.json({ error: 'السفير غير موجود' }, { status: 404 });
  }

  await prisma.rating.deleteMany({ where: { ambassadorId: id } });
  await prisma.ambassadorProfile.delete({ where: { id } });
  await prisma.user.update({ where: { id: profile.userId }, data: { role: 'STUDENT_FREE' } }).catch(() => {});

  return NextResponse.json({ success: true });
}
