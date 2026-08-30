import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: 'البريد الإلكتروني مطلوب' }, { status: 400 });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.passwordResetToken.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() + 30 * 60000) },
    });
    console.log(`[Password Reset] Link for ${normalizedEmail}: /reset-password?token=${token}`);
  }

  return NextResponse.json({
    success: true,
    message: 'إذا كان هذا البريد مسجلاً، ستتوصل بتعليمات إعادة تعيين كلمة المرور',
  });
}
