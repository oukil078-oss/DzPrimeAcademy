import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSeeded();
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'المعرف مطلوب' }, { status: 400 });
  }

  const requester = await getUserFromRequest(request);

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

  // Privacy Protection: Only the profile/card owner or staff can see private contact details (email, phone) for students
  const isOwner = !!requester && (requester.id === user.id || (!!requester.studentCardId && requester.studentCardId === user.studentCardId));
  const isAdmin = !!requester && (requester.role === 'ADMIN' || requester.role === 'OWNER');
  const canViewSensitiveInfo = isOwner || isAdmin;

  const isStudent = user.role === 'STUDENT_FREE' || user.role === 'STUDENT_PAID';
  const sanitizedUser = {
    ...user,
    email: canViewSensitiveInfo || !isStudent ? user.email : undefined,
    phone: canViewSensitiveInfo || !isStudent ? user.phone : undefined,
  };

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
    user: sanitizedUser,
    teacherProfile,
    courses,
    sessions,
    bundles,
    ambassadorProfile,
    enrollments,
  });
}
