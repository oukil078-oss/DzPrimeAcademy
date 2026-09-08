import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { hashPassword, requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  await ensureSeeded();
  const users = await prisma.user.findMany({
    where: {
      role: { in: ['STUDENT_FREE', 'STUDENT_PAID'] },
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      phone: true,
      wilayaCode: true,
      wilayaName: true,
      institutionName: true,
      track: true,
      specialty: true,
      academicYear: true,
      studentCardId: true,
      isVerified: true,
      createdAt: true,
    },
  });
  return NextResponse.json(users);
}

function generateTempPassword(): string {
  return `Stu${Math.floor(1000 + Math.random() * 9000)}!`;
}

export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  await ensureSeeded();
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      wilayaCode,
      wilayaName,
      institutionName,
      track,
      specialty,
      academicYear,
      role = 'STUDENT_PAID',
    } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'الاسم والبريد الإلكتروني مطلوبان' }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: 'هذا البريد الإلكتروني مسجل مسبقاً' }, { status: 409 });
    }

    const clearPassword = password && String(password).trim().length >= 6
      ? String(password).trim()
      : generateTempPassword();

    const passwordHash = await hashPassword(clearPassword);
    const parsedWilaya = wilayaCode ? Number(wilayaCode) : 16;
    const cardPrefix = role === 'STUDENT_PAID' ? 'GLD' : 'STU';

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: String(name).trim(),
        passwordHash,
        role: role === 'STUDENT_PAID' ? 'STUDENT_PAID' : 'STUDENT_FREE',
        phone: phone ? String(phone).trim() : null,
        wilayaCode: parsedWilaya,
        wilayaName: wilayaName || 'Alger',
        institutionName: institutionName || 'جامعة باب الزوار USTHB',
        track: track || 'UNIVERSITY_LMD',
        specialty: specialty || null,
        academicYear: academicYear || '2025/2026',
        studentCardId: `DZ-${cardPrefix}-${parsedWilaya}-${Math.floor(1000 + Math.random() * 9000)}`,
        isVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        wilayaCode: true,
        wilayaName: true,
        institutionName: true,
        track: true,
        specialty: true,
        academicYear: true,
        studentCardId: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ...user, tempPassword: clearPassword }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'فشل إضافة الطالب' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const body = await request.json();
  const { id, ...data } = body;

  const user = await prisma.user.update({
    where: { id },
    data: {
      role: data.role,
      isVerified: data.isVerified,
      wilayaCode: data.wilayaCode,
      wilayaName: data.wilayaName,
      institutionName: data.institutionName,
      track: data.track,
      specialty: data.specialty,
      academicYear: data.academicYear,
    },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      phone: true,
      wilayaCode: true,
      wilayaName: true,
      institutionName: true,
      track: true,
      specialty: true,
      academicYear: true,
      studentCardId: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}
