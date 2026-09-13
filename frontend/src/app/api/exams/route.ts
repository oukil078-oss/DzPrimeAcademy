import { NextRequest, NextResponse } from 'next/server';
import { EXAMS } from '@/lib/initial-data';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const moduleId = searchParams.get('moduleId');

  // Verify server-side authentication and role
  const user = await getUserFromRequest(request);
  const hasPaidAccess = !!user && (
    user.role === 'STUDENT_PAID' ||
    user.role === 'TEACHER' ||
    user.role === 'ADMIN' ||
    user.role === 'OWNER'
  );

  let filtered = EXAMS;
  if (moduleId) {
    filtered = filtered.filter((e) => e.moduleId === moduleId);
  }

  // Enforce tier restriction securely on the server
  if (!hasPaidAccess) {
    filtered = filtered.map((exam, idx) => {
      if (exam.isFreeSample || idx < 2) {
        return exam;
      }
      return {
        ...exam,
        fileUrl: '#locked',
        solutionUrl: undefined,
        isLocked: true,
      };
    });
  }

  return NextResponse.json({
    success: true,
    count: filtered.length,
    exams: filtered,
  });
}
