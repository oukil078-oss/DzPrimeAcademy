import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
  }

  let teacherProfile = null;
  let ambassadorProfile = null;

  if (currentUser.role === 'TEACHER') {
    teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: currentUser.id },
      include: { payouts: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
  } else if (currentUser.role === 'AMBASSADOR') {
    ambassadorProfile = await prisma.ambassadorProfile.findUnique({
      where: { userId: currentUser.id },
    });
  }

  return NextResponse.json({ user: currentUser, teacherProfile, ambassadorProfile });
}

export async function PUT(request: NextRequest) {
  const currentUser = await getUserFromRequest(request);
  if (!currentUser) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
  }

  const body = await request.json();

  const user = await prisma.user.update({
    where: { id: currentUser.id },
    data: {
      name: body.name ? String(body.name).trim() : currentUser.name,
      phone: body.phone !== undefined ? body.phone : currentUser.phone,
      wilayaCode: body.wilayaCode !== undefined ? (body.wilayaCode ? Number(body.wilayaCode) : null) : currentUser.wilayaCode,
      wilayaName: body.wilayaName !== undefined ? body.wilayaName : currentUser.wilayaName,
      institutionName: body.institutionName !== undefined ? body.institutionName : (body.university !== undefined ? body.university : currentUser.institutionName),
      specialty: body.specialty !== undefined ? body.specialty : currentUser.specialty,
    },
    select: {
      id: true, email: true, name: true, avatar: true, role: true, phone: true,
      wilayaCode: true, wilayaName: true, institutionId: true, institutionName: true,
      track: true, specialty: true, academicYear: true, studentCardId: true,
      isVerified: true, createdAt: true, updatedAt: true,
    },
  });

  // If user is a TEACHER, update or create TeacherProfile
  let teacherProfile = null;
  if (user.role === 'TEACHER') {
    teacherProfile = await prisma.teacherProfile.upsert({
      where: { userId: user.id },
      update: {
        university: body.university || body.institutionName || user.institutionName || 'Université Algérienne',
        specialty: body.specialty !== undefined ? body.specialty : user.specialty,
        ccpAccount: body.ccpAccount !== undefined ? body.ccpAccount : undefined,
        ccpCle: body.ccpCle !== undefined ? body.ccpCle : undefined,
      },
      create: {
        userId: user.id,
        university: body.university || body.institutionName || user.institutionName || 'Université Algérienne',
        specialty: body.specialty || user.specialty || null,
        ccpAccount: body.ccpAccount || null,
        ccpCle: body.ccpCle || null,
      },
    });
  }

  // If user is an AMBASSADOR, update or create AmbassadorProfile
  let ambassadorProfile = null;
  if (user.role === 'AMBASSADOR') {
    ambassadorProfile = await prisma.ambassadorProfile.upsert({
      where: { userId: user.id },
      update: {
        institutionNameAr: body.institutionName || user.institutionName || 'الجامعة',
        institutionNameFr: body.institutionNameFr || null,
        specialtyName: body.specialty !== undefined ? body.specialty : user.specialty,
        phone: body.phone !== undefined ? body.phone : user.phone,
        telegramHandle: body.telegramHandle !== undefined ? String(body.telegramHandle).replace('@', '') : undefined,
        bioAr: body.bioAr !== undefined ? body.bioAr : undefined,
      },
      create: {
        userId: user.id,
        wilayaCode: user.wilayaCode || 16,
        wilayaNameAr: user.wilayaName || 'الجزائر',
        institutionNameAr: body.institutionName || user.institutionName || 'الجامعة',
        specialtyName: body.specialty || user.specialty || null,
        phone: body.phone || user.phone || null,
        telegramHandle: body.telegramHandle ? String(body.telegramHandle).replace('@', '') : null,
        bioAr: body.bioAr || null,
        promoCode: `WIL${user.wilayaCode || 16}-AMB${Math.floor(100 + Math.random() * 900)}`,
        isVerified: true,
      },
    });
  }

  return NextResponse.json({ user, teacherProfile, ambassadorProfile });
}
