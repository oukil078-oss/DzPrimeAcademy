import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAuth, verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const authResult = await requireAuth(request);
  if ('error' in authResult) return authResult.error;

  const currentAuthUser = authResult.user;

  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword } = body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'يجب أن تتكون كلمة المرور الجديدة من 6 أحرف أو أرقام على الأقل' },
        { status: 400 }
      );
    }

    if (confirmPassword !== undefined && newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: 'كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين' },
        { status: 400 }
      );
    }

    // Retrieve user from database with passwordHash
    const dbUser = await prisma.user.findUnique({
      where: { id: currentAuthUser.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
    }

    // If the user already has a password set, verify current password
    if (dbUser.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'يرجى إدخال كلمة المرور الحالية' },
          { status: 400 }
        );
      }

      const isValid = await verifyPassword(currentPassword, dbUser.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: 'كلمة المرور الحالية غير صحيحة' },
          { status: 400 }
        );
      }
    }

    const newHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث كلمة المرور بنجاح',
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: error?.message || 'حدث خطأ أثناء تغيير كلمة المرور' },
      { status: 500 }
    );
  }
}
