import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
  }

  const body = await request.json();

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name: body.name,
      phone: body.phone,
      wilayaCode: body.wilayaCode,
      wilayaName: body.wilayaName,
      institutionName: body.institutionName,
      specialty: body.specialty,
    },
    select: {
      id: true, email: true, name: true, avatar: true, role: true, phone: true,
      wilayaCode: true, wilayaName: true, institutionId: true, institutionName: true,
      track: true, specialty: true, academicYear: true, studentCardId: true,
      isVerified: true, createdAt: true, updatedAt: true,
    },
  });

  return NextResponse.json({ user });
}
