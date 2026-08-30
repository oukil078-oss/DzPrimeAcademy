import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
  }
  if (currentUser.role !== 'STUDENT_FREE') {
    return NextResponse.json({ error: 'هذا الحساب ليس طالباً مجانياً' }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: { role: 'STUDENT_PAID', isVerified: true },
    select: {
      id: true, email: true, name: true, avatar: true, role: true, phone: true,
      wilayaCode: true, wilayaName: true, institutionId: true, institutionName: true,
      track: true, specialty: true, academicYear: true, studentCardId: true,
      isVerified: true, createdAt: true, updatedAt: true,
    },
  });

  return NextResponse.json({ user });
}
