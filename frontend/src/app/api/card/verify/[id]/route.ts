import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ensureSeeded } from '@/lib/seed';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await ensureSeeded();
  const { id } = await params;

  const matchedUser = await prisma.user.findFirst({
    where: { studentCardId: { equals: id, mode: 'insensitive' } },
  });

  if (!matchedUser) {
    return NextResponse.json(
      {
        isValid: false,
        message: 'رقم البطاقة غير موجود في السجل الوطني للمنصة',
        card: null,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    isValid: true,
    message: 'بطاقة عضوية معتمدة ورسمية',
    card: {
      cardId: matchedUser.studentCardId,
      holderName: matchedUser.name,
      role: matchedUser.role,
      institutionName: matchedUser.institutionName,
      wilayaCode: matchedUser.wilayaCode,
      wilayaName: matchedUser.wilayaName,
      isVerified: matchedUser.isVerified,
      expiryDate: '2026/09/30',
    },
  });
}
