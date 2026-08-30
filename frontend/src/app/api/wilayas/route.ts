import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function GET() {
  await ensureSeeded();
  const wilayas = await prisma.wilaya.findMany({ orderBy: { code: 'asc' } });
  return NextResponse.json(wilayas);
}
