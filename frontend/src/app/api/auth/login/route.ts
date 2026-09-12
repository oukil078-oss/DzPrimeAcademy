import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  verifyPassword,
  signToken,
  setAuthCookie,
  checkBruteForce,
  recordFailedAttempt,
  clearFailedAttempts,
} from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'البريد الإلكتروني وكلمة المرور مطلوبان' }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const { locked, retryAfterMinutes } = await checkBruteForce(normalizedEmail);
    if (locked) {
      return NextResponse.json(
        { error: `تم قفل الحساب مؤقتاً بسبب محاولات خاطئة متكررة. حاول بعد ${retryAfterMinutes} دقيقة` },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !user.passwordHash) {
      await recordFailedAttempt(normalizedEmail);
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      await recordFailedAttempt(normalizedEmail);
      return NextResponse.json({ error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' }, { status: 401 });
    }

    await clearFailedAttempts(normalizedEmail);

    // Block unverified students / non-staff users from logging in
    const isStaff = user.role === 'ADMIN' || user.role === 'OWNER';
    if (!user.isVerified && !isStaff) {
      return NextResponse.json(
        {
          error: 'حسابك غير مفعّل بعد. يرجى تأكيد بريدك الإلكتروني عبر الرابط المرسل إليك أو انتظار موافقة الإدارة قبل تسجيل الدخول.',
          code: 'ACCOUNT_NOT_VERIFIED',
          requiresVerification: true,
          email: user.email,
          name: user.name,
          phone: user.phone || undefined,
          wilayaName: user.wilayaName || undefined,
        },
        { status: 403 }
      );
    }

    const { passwordHash, ...safeUser } = user;
    const token = signToken(user.id);
    const response = NextResponse.json({ user: safeUser });
    setAuthCookie(response, token);
    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'حدث خطأ أثناء تسجيل الدخول. يرجى التحقق من اتصال قاعدة البيانات.' }, { status: 500 });
  }
}
