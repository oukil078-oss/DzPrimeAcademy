import { NextResponse } from 'next/server';
import { DEMO_USERS } from '@/lib/initial-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const matchedUser = DEMO_USERS.find(
    (u) => u.studentCardId?.toLowerCase() === id?.toLowerCase()
  );

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
