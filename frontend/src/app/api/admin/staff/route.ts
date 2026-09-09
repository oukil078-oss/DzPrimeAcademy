import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';
import { getUserFromRequest, hashPassword, requireAdmin } from '@/lib/auth';
import { isSuperAdmin, isHRManager, getUserHierarchyLevel } from '@/lib/rbac';
import { Role } from '@/types';

export async function GET(request: NextRequest) {
  const authResult = await requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  await ensureSeeded();

  // Find all users who are staff/admins (OWNER, ADMIN, MODERATOR or have adminRole)
  const staff = await prisma.user.findMany({
    where: {
      OR: [
        { role: { in: ['OWNER', 'ADMIN', 'MODERATOR'] } },
        { adminRole: { not: null } },
      ],
    },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      jobTitle: true,
      adminRole: true,
      bio: true,
      phone: true,
      wilayaCode: true,
      wilayaName: true,
      institutionName: true,
      studentCardId: true,
      isVerified: true,
      createdAt: true,
    },
  });

  return NextResponse.json(staff);
}

export async function POST(request: NextRequest) {
  const actor = await getUserFromRequest(request);
  if (!actor) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول' }, { status: 401 });
  }

  // Only Super Admin and HR Manager can add staff
  const actorIsSuper = isSuperAdmin(actor);
  const actorIsHR = isHRManager(actor);

  if (!actorIsSuper && !actorIsHR) {
    return NextResponse.json(
      { error: 'لا تملك صلاحية إضافة إداريين أو موظفين جدد' },
      { status: 403 }
    );
  }

  await ensureSeeded();

  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      role = 'ADMIN',
      adminRole = 'ADMIN',
      jobTitle,
      phone,
      wilayaCode,
      wilayaName,
      bio,
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'الاسم، البريد الإلكتروني وكلمة المرور مطلوبة' },
        { status: 400 }
      );
    }

    if (String(password).trim().length < 6) {
      return NextResponse.json(
        { error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json(
        { error: 'هذا البريد الإلكتروني مسجل مسبقاً' },
        { status: 409 }
      );
    }

    // Check hierarchy: Only Super Admin (Level 100) can create Super Admin or General Admin
    const targetRoleLevel =
      adminRole === 'SUPER_ADMIN' || role === 'OWNER'
        ? 100
        : adminRole === 'GENERAL_ADMIN'
        ? 95
        : adminRole === 'HR_MANAGER'
        ? 85
        : adminRole === 'COMMERCIAL'
        ? 80
        : adminRole === 'HR_EMPLOYEE'
        ? 75
        : 65;

    const actorLevel = getUserHierarchyLevel(actor);

    // Only Super Admin (Level 100) can assign General Admin or Super Admin
    if (targetRoleLevel >= 95 && actorLevel < 100) {
      return NextResponse.json(
        { error: 'فقط المسؤول الأعلى (Super Admin) يمكنه تعيين أو إضافة مدير عام (Admin Général)' },
        { status: 403 }
      );
    }

    if (actorLevel < 100 && targetRoleLevel >= actorLevel) {
      return NextResponse.json(
        { error: 'لا يمكنك تعيين دور إداري أعلى من مستواك أو مساوٍ له' },
        { status: 403 }
      );
    }

    const passwordHash = await hashPassword(String(password).trim());
    const parsedWilayaCode = wilayaCode ? Number(wilayaCode) : 16;
    const finalRole: Role = role === 'OWNER' && actorIsSuper ? 'OWNER' : 'ADMIN';

    const cardPrefix =
      adminRole === 'GENERAL_ADMIN'
        ? 'GEN'
        : adminRole === 'COMMERCIAL'
        ? 'COM'
        : adminRole === 'HR_MANAGER' || adminRole === 'HR_EMPLOYEE'
        ? 'HR'
        : adminRole === 'FINANCE'
        ? 'FIN'
        : 'ADM';

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: String(name).trim(),
        phone: phone ? String(phone).trim() : null,
        role: finalRole,
        adminRole: String(adminRole),
        jobTitle: jobTitle ? String(jobTitle).trim() : null,
        bio: bio ? String(bio).trim() : null,
        passwordHash,
        wilayaCode: parsedWilayaCode,
        wilayaName: wilayaName || 'Alger',
        institutionName: 'DZ Prime Academy HQ',
        studentCardId: `DZ-${cardPrefix}-${parsedWilayaCode}-${Math.floor(1000 + Math.random() * 9000)}`,
        isVerified: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        jobTitle: true,
        adminRole: true,
        bio: true,
        phone: true,
        wilayaCode: true,
        wilayaName: true,
        institutionName: true,
        studentCardId: true,
        isVerified: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error creating staff member:', error);
    return NextResponse.json(
      { error: error?.message || 'فشل إضافة الإداري' },
      { status: 500 }
    );
  }
}
