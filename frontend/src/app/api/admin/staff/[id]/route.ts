import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { getUserFromRequest } from '@/lib/auth';
import { canManageUser } from '@/lib/rbac';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const actor = await getUserFromRequest(request);
  if (!actor) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
  }

  const { id } = await params;

  if (actor.id === id) {
    return NextResponse.json({ error: 'لا يمكنك حذف حسابك الخاص' }, { status: 400 });
  }

  await ensureSeeded();

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, adminRole: true, name: true },
  });

  if (!target) {
    return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
  }

  const allowed = canManageUser(actor, target);
  if (!allowed) {
    return NextResponse.json(
      { error: 'ليس لديك الصلاحية لحذف هذا المسؤول أو الموظف حسب التسلسل الهرمي' },
      { status: 403 }
    );
  }

  // Delete user and associated sessions/tokens
  await prisma.session.deleteMany({ where: { userId: id } });
  await prisma.passwordResetToken.deleteMany({ where: { userId: id } });
  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true, message: `تم حذف ${target.name} بنجاح` });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const actor = await getUserFromRequest(request);
  if (!actor) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
  }

  const { id } = await params;

  await ensureSeeded();

  const target = await prisma.user.findUnique({
    where: { id },
    select: { id: true, role: true, adminRole: true, name: true },
  });

  if (!target) {
    return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
  }

  const allowed = canManageUser(actor, target);
  if (!allowed) {
    return NextResponse.json(
      { error: 'ليس لديك الصلاحية لتعديل بيانات هذا المسؤول' },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { jobTitle, adminRole, phone, wilayaCode, wilayaName, bio } = body;

  const updated = await prisma.user.update({
    where: { id },
    data: {
      jobTitle: jobTitle !== undefined ? (jobTitle ? String(jobTitle).trim() : null) : undefined,
      adminRole: adminRole !== undefined ? String(adminRole) : undefined,
      phone: phone !== undefined ? phone : undefined,
      wilayaCode: wilayaCode !== undefined ? (wilayaCode ? Number(wilayaCode) : null) : undefined,
      wilayaName: wilayaName !== undefined ? wilayaName : undefined,
      bio: bio !== undefined ? bio : undefined,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      jobTitle: true,
      adminRole: true,
      bio: true,
      phone: true,
      wilayaCode: true,
      wilayaName: true,
      studentCardId: true,
      isVerified: true,
    },
  });

  return NextResponse.json(updated);
}
