import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword, signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password, phone, wilayaCode, wilayaName } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'الاسم والبريد الإلكتروني وكلمة المرور مطلوبة' }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'كلمة المرور يجب أن تكون 6 خانات على الأقل' }, { status: 400 });
  }

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: 'هذا البريد الإلكتروني مسجل بالفعل' }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const studentCardId = `DZ-STU-${wilayaCode || 16}-${Math.floor(1000 + Math.random() * 9000)}`;

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      phone: phone || null,
      wilayaCode: wilayaCode || null,
      wilayaName: wilayaName || null,
      role: 'STUDENT_FREE',
      studentCardId,
      isVerified: false,
    },
    select: {
      id: true, email: true, name: true, avatar: true, role: true, phone: true,
      wilayaCode: true, wilayaName: true, institutionId: true, institutionName: true,
      track: true, specialty: true, academicYear: true, studentCardId: true,
      isVerified: true, createdAt: true, updatedAt: true,
    },
  });

  const token = signToken(user.id);
  const response = NextResponse.json({ user }, { status: 201 });
  setAuthCookie(response, token);
  return response;
}
