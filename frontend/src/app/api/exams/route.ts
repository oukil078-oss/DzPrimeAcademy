import { NextResponse } from 'next/server';
import { EXAMS } from '@/lib/initial-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const moduleId = searchParams.get('moduleId');
  const isPaid = searchParams.get('isPaid') === 'true';

  let filtered = EXAMS;
  if (moduleId) {
    filtered = filtered.filter((e) => e.moduleId === moduleId);
  }

  // Enforce tier restriction
  if (!isPaid) {
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
