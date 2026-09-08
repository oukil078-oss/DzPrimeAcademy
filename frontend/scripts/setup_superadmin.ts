import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up Zakarya Oukil as Super Admin & CTO...');

  // 1. If admin@dzprime.academy has DZ-OWN-16-0001, change it first to avoid unique constraint collision
  const existingOwnerCardUser = await prisma.user.findUnique({
    where: { studentCardId: 'DZ-OWN-16-0001' },
  });

  if (existingOwnerCardUser && existingOwnerCardUser.email !== 'zakaryaoukil2003@gmail.com') {
    await prisma.user.update({
      where: { id: existingOwnerCardUser.id },
      data: { studentCardId: 'DZ-ADM-16-0002' },
    });
    console.log(`Updated previous owner user ${existingOwnerCardUser.email} card to DZ-ADM-16-0002`);
  }

  // 2. Update zakaryaoukil2003@gmail.com
  const updatedZakarya = await prisma.user.update({
    where: { email: 'zakaryaoukil2003@gmail.com' },
    data: {
      name: 'Zakarya Oukil',
      role: 'OWNER',
      jobTitle: 'Super Admin & Chief Technology Officer (CTO)',
      studentCardId: 'DZ-OWN-16-0001',
      phone: '0668718784',
      wilayaCode: 16,
      wilayaName: 'الجزائر العاصمة',
      institutionName: 'DZ Prime Academy HQ',
      bio: 'مؤسس والمدير العام والمسؤول التقني الأول (CTO) لمنصة DZ Prime Academy. مهندس ومطور برمجيات، شغوف بتطوير التعليم والتكنولوجيا المالية في الجزائر.',
      github: 'https://github.com/oukil078-oss',
      linkedin: 'https://linkedin.com/in/zakarya-oukil',
      whatsapp: '+213668718784',
      telegram: 'oukil078',
      website: 'https://dzprime.academy',
      isVerified: true,
    },
  });

  console.log('Successfully updated Zakarya Oukil:');
  console.log(JSON.stringify(updatedZakarya, null, 2));

  // Also update oukilzakarya2003@gmail.com if it exists
  const secondAcc = await prisma.user.findUnique({ where: { email: 'oukilzakarya2003@gmail.com' } });
  if (secondAcc) {
    await prisma.user.update({
      where: { id: secondAcc.id },
      data: {
        role: 'ADMIN',
        jobTitle: 'Chief Technology Officer (CTO)',
        isVerified: true,
        github: 'https://github.com/oukil078-oss',
        linkedin: 'https://linkedin.com/in/zakarya-oukil',
        website: 'https://dzprime.academy',
        whatsapp: '+213668718784',
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
