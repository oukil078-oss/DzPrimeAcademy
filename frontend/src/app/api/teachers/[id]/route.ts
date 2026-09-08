import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { canManageUser } from '@/lib/rbac';

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

  const actor = authResult.user;
  const { id } = await params;
  const profile = await prisma.teacherProfile.findUnique({ where: { id } });
  if (!profile) {
    return NextResponse.json({ error: 'الأستاذ غير موجود' }, { status: 404 });
  }

  const user = await prisma.user.findUnique({ where: { id: profile.userId } });

  if (user && !canManageUser(actor, user)) {
    return NextResponse.json(
      { error: 'ليس لديك الصلاحية لحذف هذا الأستاذ وفق التسلسل الهرمي' },
      { status: 403 }
    );
  }

  await prisma.facultyPayout.deleteMany({ where: { teacherProfileId: id } });
  await prisma.teacherProfile.delete({ where: { id } });
  if (user) {
    await prisma.sessionRegistration.deleteMany({ where: { studentId: user.id } }).catch(() => {});
    await prisma.enrollment.deleteMany({ where: { studentId: user.id } }).catch(() => {});
    await prisma.session.deleteMany({ where: { userId: user.id } }).catch(() => {});
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }).catch(() => {});
    await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
  }
  return NextResponse.json({ success: true, message: 'تم حذف الأستاذ بنجاح' });
}
