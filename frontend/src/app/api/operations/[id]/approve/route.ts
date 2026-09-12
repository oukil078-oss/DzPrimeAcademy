import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { adminNotes } = body;

  const operation = await prisma.pendingOperation.findUnique({
    where: { id },
  });

  if (!operation) {
    return NextResponse.json({ error: 'العملية غير موجودة' }, { status: 404 });
  }

  if (operation.status === 'APPROVED') {
    return NextResponse.json({ error: 'تمت الموافقة على هذه العملية مسبقاً' }, { status: 400 });
  }

  const adminName = authResult.user.name || authResult.user.email;

  // 1. Account Activation Approval
  if (operation.type === 'ACCOUNT_ACTIVATION' && operation.userId) {
    await prisma.user.update({
      where: { id: operation.userId },
      data: { isVerified: true },
    });
    // Invalidate unused activation tokens
    await prisma.accountActivationToken.updateMany({
      where: { userId: operation.userId, used: false },
      data: { used: true },
    });
  }

  // 2. Golden VIP Upgrade Approval
  if (operation.type === 'VIP_MEMBERSHIP_UPGRADE' && operation.userId) {
    const user = await prisma.user.findUnique({ where: { id: operation.userId } });
    if (user) {
      const cardId = user.studentCardId || `DZ-STU-${user.wilayaCode || 16}-${Math.floor(1000 + Math.random() * 9000)}`;
      await prisma.user.update({
        where: { id: user.id },
        data: { role: 'STUDENT_PAID', isVerified: true, studentCardId: cardId },
      });

      await prisma.subscription.upsert({
        where: { cardId },
        update: {
          status: 'ACTIVE',
          endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000),
        },
        create: {
          userId: user.id,
          cardId,
          planName: 'GOLDEN_MEMBERSHIP',
          status: 'ACTIVE',
          endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000),
        },
      });
    }
  }

  // 3. Bundle Purchase Approval
  if (operation.type === 'BUNDLE_PURCHASE') {
    await prisma.bundlePurchase.create({
      data: {
        bundleId: operation.targetId || 'manual-bundle',
        bundleTitleAr: operation.title,
        userId: operation.userId || 'guest-student',
        userName: operation.userName,
        amountDzd: operation.amountDzd,
        paymentStatus: 'APPROVED_BY_ADMIN',
      },
    });
  }

  // 4. Course Enrollment Approval
  if (operation.type === 'COURSE_ENROLLMENT' && operation.userId && operation.targetId) {
    await prisma.enrollment.create({
      data: {
        studentId: operation.userId,
        courseId: operation.targetId,
        courseTitle: operation.title,
        teacherName: 'DZ Prime Faculty',
      },
    });
  }

  // Update operation status
  const updated = await prisma.pendingOperation.update({
    where: { id },
    data: {
      status: 'APPROVED',
      approvedByAdmin: adminName,
      approvedAt: new Date(),
      adminNotes: adminNotes || operation.adminNotes,
    },
  });

  return NextResponse.json({
    success: true,
    message: 'تمت الموافقة على العملية وتفعيل الامتيازات للطالب بنجاح!',
    operation: updated,
  });
}
