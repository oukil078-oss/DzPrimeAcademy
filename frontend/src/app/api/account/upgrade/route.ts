import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
  }
  if (currentUser.role !== 'STUDENT_FREE') {
    return NextResponse.json({ error: 'هذا الحساب ليس طالباً مجانياً أو يملك عضوية نشطة مسبقاً' }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const code = body.code ? String(body.code).trim().toUpperCase() : '';

  // Valid promotional/activation voucher codes
  const validVouchers = ['DZPRIME2026', 'GOLD2026', 'VIP-PRIME-2026', 'VIP2026'];
  const isVoucherMatch = validVouchers.includes(code);

  // Check if there is an approved VIP operation for this user
  const approvedOp = await prisma.pendingOperation.findFirst({
    where: {
      userId: currentUser.id,
      type: 'VIP_MEMBERSHIP_UPGRADE',
      status: 'APPROVED',
    },
  });

  if (!isVoucherMatch && !approvedOp) {
    return NextResponse.json(
      {
        error: code
          ? 'كود التفعيل غير صالح. يرجى التأكد من الرمز أو إتمام الدفع والتفعيل عبر واتساب وتيليغرام.'
          : 'يرجى إدخال كود تفعيل صالح أو التواصل مع الإدارة عبر واتساب أو تيليغرام لتفعيل العضوية الذهبية.',
      },
      { status: 400 }
    );
  }

  const cardId =
    currentUser.studentCardId ||
    `DZ-STU-${currentUser.wilayaCode || 16}-${Math.floor(1000 + Math.random() * 9000)}`;

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { role: 'STUDENT_PAID', isVerified: true, studentCardId: cardId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      phone: true,
      wilayaCode: true,
      wilayaName: true,
      institutionId: true,
      institutionName: true,
      track: true,
      specialty: true,
      academicYear: true,
      studentCardId: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Create or update subscription record
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

  return NextResponse.json({ user, success: true });
}
