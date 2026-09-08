import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSeeded();
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
  }

  // Find user by ID or studentCardId (case-insensitive)
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { id },
        { studentCardId: { equals: id, mode: 'insensitive' } },
      ],
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      jobTitle: true,
      adminRole: true,
      bio: true,
      facebook: true,
      instagram: true,
      linkedin: true,
      telegram: true,
      youtube: true,
      whatsapp: true,
      website: true,
      twitter: true,
      github: true,
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

  if (!user) {
    return NextResponse.json({ error: 'المستخدم غير موجود' }, { status: 404 });
  }

  let teacherProfile = null;
  let courses: any[] = [];
  let sessions: any[] = [];
  let bundles: any[] = [];
  let ambassadorProfile = null;
  let enrollments: any[] = [];

  if (user.role === 'TEACHER') {
    teacherProfile = await prisma.teacherProfile.findUnique({
      where: { userId: user.id },
    });

    courses = await prisma.course.findMany({
      where: {
        OR: [
          { teacherId: user.id },
          { teacherName: user.name },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    sessions = await prisma.liveSession.findMany({
      where: {
        OR: [
          { teacherId: user.id },
          { teacherName: user.name },
        ],
      },
      orderBy: { scheduledAt: 'desc' },
    });

    bundles = await prisma.bundle.findMany({
      where: { isActive: true },
      take: 4,
      orderBy: { sortOrder: 'asc' },
    });
  } else if (user.role === 'AMBASSADOR') {
    ambassadorProfile = await prisma.ambassadorProfile.findUnique({
      where: { userId: user.id },
    });
  } else if (user.role === 'STUDENT_FREE' || user.role === 'STUDENT_PAID') {
    enrollments = await prisma.enrollment.findMany({
      where: { studentId: user.id },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  }

  return NextResponse.json({
    user,
    teacherProfile,
    courses,
    sessions,
    bundles,
    ambassadorProfile,
    enrollments,
  });
}
