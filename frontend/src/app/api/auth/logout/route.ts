import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { clearAuthCookies } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const sessionToken = request.cookies.get('dz_session_token')?.value;
  if (sessionToken) {
    await prisma.session.deleteMany({ where: { sessionToken } }).catch(() => {});
  }

  const response = NextResponse.json({ success: true });
  clearAuthCookies(response);
  return response;
}
