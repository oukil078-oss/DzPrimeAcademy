import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireRole } from '@/lib/auth';

const STUDENT_ROLES = ['STUDENT_FREE', 'STUDENT_PAID'];

export async function GET(request: NextRequest) {
  const authResult = await requireRole(request, STUDENT_ROLES);
  if ('error' in authResult) return authResult.error;
  const { user } = authResult;

  const registrations = await prisma.sessionRegistration.findMany({
    where: { studentId: user.id },
    select: { sessionId: true },
  });

  return NextResponse.json(registrations.map((r) => r.sessionId));
}
