import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;
  const body = await request.json();

  const profile = await prisma.teacherProfile.update({
    where: { id },
    data: {
      university: body.university,
      specialty: body.specialty,
      hourlyRateDzd: body.hourlyRateDzd,
      hoursTaught: body.hoursTaught,
      studentsCount: body.studentsCount,
      ccpAccount: body.ccpAccount,
      ccpCle: body.ccpCle,
    },
  });

  if (body.isVerified !== undefined) {
    await prisma.user.update({ where: { id: profile.userId }, data: { isVerified: body.isVerified } });
  }

  return NextResponse.json(profile);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;
  const profile = await prisma.teacherProfile.findUnique({ where: { id } });
  await prisma.facultyPayout.deleteMany({ where: { teacherProfileId: id } });
  await prisma.teacherProfile.delete({ where: { id } });
  if (profile) {
    await prisma.user.delete({ where: { id: profile.userId } }).catch(() => {});
  }
  return NextResponse.json({ success: true });
}
