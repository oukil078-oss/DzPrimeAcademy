import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { signToken, setAuthCookie } from '@/lib/auth';
import { sendActivationEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'رمز التفعيل مفقود أو غير مكتمل' }, { status: 400 });
  }

  const record = await prisma.accountActivationToken.findUnique({
    where: { token },
  });

  if (!record) {
    return NextResponse.json(
      { error: 'رابط التفعيل غير صالح أو غير موجود. يرجى طلب رابط جديد أو تسجيل الدخول.' },
      { status: 404 }
    );
  }

  // Find associated user
  const user = await prisma.user.findUnique({
    where: { id: record.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'تعذر العثور على الحساب المرتبط بهذا الرابط، قد يكون الحساب قد أُعيد إنشاؤه. يرجى تسجيل الدخول أو التواصل مع الدعم.' },
      { status: 404 }
    );
  }

  // 1. If user is ALREADY verified:
  // This is a 100% SUCCESS state! Never show an error when the account is already active!
  if (user.isVerified) {
    const authToken = signToken(user.id);
    const response = NextResponse.json({
      success: true,
      alreadyVerified: true,
      message: 'حسابك مفعل وجاهز بالفعل! تم تسجيل دخولك بنجاح.',
      user,
    });
    setAuthCookie(response, authToken);
    return response;
  }

  // 2. If token expired (> 24 hours)
  if (record.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'انتهت صلاحية رابط التفعيل (24 ساعة). يمكنك طلب رابط تفعيل جديد بسهولة من صفحة الدخول.' },
      { status: 410 }
    );
  }

  // 3. User is not yet verified and token is valid: ACTIVATE USER NOW!
  // Mark current token and all other tokens for this user as used
  await prisma.accountActivationToken.updateMany({
    where: { userId: user.id },
    data: { used: true },
  });

  // Activate User in DB
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
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
      userId: updatedUser.id,
      type: 'ACCOUNT_ACTIVATION',
      status: 'PENDING',
    },
    data: {
      status: 'APPROVED',
      approvedByAdmin: 'AUTO_EMAIL_VERIFIED',
      approvedAt: new Date(),
    },
  });

  const authToken = signToken(updatedUser.id);
  const response = NextResponse.json({
    success: true,
    message: 'تم تفعيل حسابك بنجاح! يمكنك الآن الاستفادة من جميع الميزات.',
    user: updatedUser,
  });
  setAuthCookie(response, authToken);
  return response;
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
