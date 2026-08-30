import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { token, newPassword } = await request.json();
  if (!token || !newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: 'رمز غير صالح أو كلمة مرور قصيرة جداً' }, { status: 400 });
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return NextResponse.json({ error: 'رابط إعادة التعيين غير صالح أو منتهي الصلاحية' }, { status: 400 });
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.update({ where: { token }, data: { used: true } });

  return NextResponse.json({ success: true });
}
