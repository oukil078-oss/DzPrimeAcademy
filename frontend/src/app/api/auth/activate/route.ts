import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { sendActivationEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'رمز التفعيل مفقود' }, { status: 400 });
  }

  const record = await prisma.accountActivationToken.findUnique({
    where: { token },
  });

  if (!record) {
    return NextResponse.json(
      { error: 'رابط التفعيل غير صالح أو غير موجود' },
      { status: 404 }
    );
  }

  if (record.used) {
    return NextResponse.json(
      { error: 'تم استخدام رابط التفعيل هذا مسبقاً، حسابك مفعل بالفعل' },
      { status: 400 }
    );
  }

  if (record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'انتهت صلاحية رابط التفعيل (24 ساعة). يرجى طلب رابط جديد' },
      { status: 410 }
    );
  }

  // Mark token used
  await prisma.accountActivationToken.update({
    where: { id: record.id },
    data: { used: true },
  });

  // Activate User
  const user = await prisma.user.update({
    where: { id: record.userId },
    data: { isVerified: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
    },
  });

  // Mark any pending account activation operation as APPROVED
  await prisma.pendingOperation.updateMany({
    where: {
      userId: user.id,
      type: 'ACCOUNT_ACTIVATION',
      status: 'PENDING',
    },
    data: {
      status: 'APPROVED',
      approvedByAdmin: 'AUTO_EMAIL_VERIFIED',
      approvedAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    message: 'تم تفعيل حسابك بنجاح! يمكنك الآن الاستفادة من جميع الميزات.',
    user,
  });
}

// POST: Resend activation email
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email, locale = 'ar' } = body;

  if (!email) {
    return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    return NextResponse.json({ error: 'المستخدم غير مسجل' }, { status: 404 });
  }

  if (user.isVerified) {
    return NextResponse.json({ error: 'هذا الحساب مفعل بالفعل، يمكنك تسجيل الدخول مباشرة' }, { status: 400 });
  }

  // Invalidate previous tokens
  await prisma.accountActivationToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  // Create new token
  const token = crypto.randomBytes(32).toString('hex');
  await prisma.accountActivationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  // Send activation email
  await sendActivationEmail({
    to: normalizedEmail,
    name: user.name,
    token,
    locale,
  });

  return NextResponse.json({
    success: true,
    message: 'تم إرسال رابط تفعيل جديد إلى بريدك الإلكتروني بنجاح',
  });
}
