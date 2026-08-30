import { prisma } from './db';
import {
  WILAYAS,
  INSTITUTIONS,
  FACULTIES,
  SPECIALTIES,
  ACADEMIC_YEARS,
  MODULES,
  EXAMS,
  DEMO_USERS,
  AMBASSADORS,
} from './initial-data';

const PROMO_CODES: Record<number, string> = {
  16: 'ALGER16',
  31: 'ORAN31',
  19: 'SETIF19',
  25: 'CONSTANTINE25',
  13: 'TLEMCEN13',
  15: 'TIZI15',
  23: 'ANNABA23',
};

let seedingPromise: Promise<void> | null = null;

export async function ensureSeeded(): Promise<void> {
  if (seedingPromise) return seedingPromise;
  seedingPromise = runSeed().catch((err) => {
    seedingPromise = null;
    throw err;
  });
  return seedingPromise;
}

async function runSeed(): Promise<void> {
  const wilayaCount = await prisma.wilaya.count();
  if (wilayaCount > 0) return;

  await prisma.wilaya.createMany({ data: WILAYAS, skipDuplicates: true });

  await prisma.institution.createMany({
    data: INSTITUTIONS.map((i) => ({ ...i })),
    skipDuplicates: true,
  });

  await prisma.faculty.createMany({ data: FACULTIES, skipDuplicates: true });
  await prisma.specialty.createMany({ data: SPECIALTIES, skipDuplicates: true });
  await prisma.academicYear.createMany({ data: ACADEMIC_YEARS, skipDuplicates: true });

  await prisma.module.createMany({
    data: MODULES.map((m) => ({
      id: m.id,
      nameAr: m.nameAr,
      nameFr: m.nameFr,
      code: m.code,
      coefficient: m.coefficient,
      academicYearId: m.academicYearId,
      examsCount: m.examsCount || 0,
    })),
    skipDuplicates: true,
  });

  await prisma.exam.createMany({
    data: EXAMS.map((e) => ({
      id: e.id,
      title: e.title,
      year: e.year,
      termType: e.termType,
      fileUrl: e.fileUrl,
      solutionUrl: e.solutionUrl,
      isFreeSample: e.isFreeSample,
      downloadsCount: e.downloadsCount,
      moduleId: e.moduleId,
      moduleName: e.moduleName,
      authorName: e.authorName,
      trackType: e.trackType,
      academicYearName: e.academicYearName,
      institutionName: e.institutionName,
      previewQuestionSnippet: e.previewQuestionSnippet,
      solutionSummary: e.solutionSummary,
    })),
    skipDuplicates: true,
  });

  for (let i = 0; i < DEMO_USERS.length; i++) {
    const u = DEMO_USERS[i];
    await prisma.user.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        phone: u.phone,
        wilayaCode: u.wilayaCode,
        wilayaName: u.wilayaName,
        institutionId: u.institutionId,
        institutionName: u.institutionName,
        specialty: u.specialty,
        academicYear: u.academicYear,
        studentCardId: u.studentCardId,
        isVerified: u.isVerified,
        demoIndex: i,
      },
    });
  }

  for (const amb of AMBASSADORS) {
    const created = await prisma.ambassadorProfile.create({
      data: {
        userId: amb.userId,
        wilayaCode: amb.wilayaCode,
        wilayaNameAr: amb.wilayaNameAr,
        wilayaNameFr: amb.wilayaNameFr,
        region: amb.region,
        institutionId: amb.institutionId,
        institutionNameAr: amb.institutionNameAr,
        institutionNameFr: amb.institutionNameFr,
        specialtyName: amb.specialtyName,
        telegramHandle: amb.telegramHandle,
        phone: amb.phone,
        bioAr: amb.bioAr,
        bioFr: amb.bioFr,
        ratingAverage: amb.ratingAverage,
        ratingsCount: amb.ratingsCount,
        isVerified: amb.isVerified,
        upcomingSessionsCount: amb.upcomingSessionsCount,
        totalTipsShared: amb.totalTipsShared,
        materialsCuratedCount: amb.materialsCuratedCount || 0,
        studentsMentoredCount: amb.studentsMentoredCount || 0,
        badges: amb.badges || [],
        promoCode: PROMO_CODES[amb.wilayaCode] || `WIL${amb.wilayaCode}`,
        referralsCount: Math.floor(30 + Math.random() * 200),
        commissionDzd: Math.floor(8000 + Math.random() * 40000),
      },
    });

    for (const rev of amb.reviews || []) {
      await prisma.rating.create({
        data: {
          score: rev.score,
          comment: rev.comment,
          ambassadorId: created.id,
          studentName: rev.studentName,
          studentRole: rev.studentRole,
          institution: rev.institution,
        },
      });
    }
  }

  const teacherRoster = [
    { userId: 'user-teacher', university: 'Université Ferhat Abbas Sétif 1', specialty: 'Mathématiques & Analyse', hourlyRateDzd: 12000, hoursTaught: 86, studentsCount: 1240, ccpAccount: '0012345678', ccpCle: '25' },
    { userId: 'tch-benali', university: 'USTHB Bab Ezzouar', specialty: 'Algorithmique & Data Structures', hourlyRateDzd: 11000, hoursTaught: 64, studentsCount: 980, ccpAccount: '0098765432', ccpCle: '41' },
    { userId: 'tch-bouzid', university: 'USTO-MB Oran', specialty: 'Physique & Mécanique', hourlyRateDzd: 10000, hoursTaught: 52, studentsCount: 710, ccpAccount: '0011223344', ccpCle: '18' },
    { userId: 'tch-mansouri', university: 'Université Constantine 1', specialty: 'Sciences BAC & Biologie', hourlyRateDzd: 9500, hoursTaught: 71, studentsCount: 1560, ccpAccount: '0055667788', ccpCle: '09' },
  ];

  for (const t of teacherRoster) {
    const monthlyShareDzd = Math.round(t.hourlyRateDzd * t.hoursTaught * 0.35);
    const profile = await prisma.teacherProfile.create({
      data: {
        userId: t.userId,
        university: t.university,
        specialty: t.specialty,
        hourlyRateDzd: t.hourlyRateDzd,
        hoursTaught: t.hoursTaught,
        studentsCount: t.studentsCount,
        ccpAccount: t.ccpAccount,
        ccpCle: t.ccpCle,
        monthlyShareDzd,
        payoutStatus: 'PENDING',
      },
    });

    await prisma.facultyPayout.create({
      data: {
        teacherProfileId: profile.id,
        amountDzd: monthlyShareDzd,
        periodMonth: '2026-08',
        status: 'PENDING',
      },
    });
  }

  const courseSeed = [
    { titleAr: 'خوارزميات وهياكل بيانات متقدمة', titleFr: 'Algorithmique Avancée & Structures de Données', teacherId: 'tch-benali', teacherName: 'Dr. Amina Benali', category: 'UNIVERSITY_LMD' as const, lessonsCount: 14, rating: 4.9, priceDzd: 4500, isLive: true, colorTheme: 'lime' },
    { titleAr: 'تحليل رياضي 1 - دورة الامتياز', titleFr: 'Analyse Mathématique 1 - Dawra Excellence', teacherId: 'user-teacher', teacherName: 'Pr. Abdelrahim Kadri', category: 'UNIVERSITY_LMD' as const, lessonsCount: 18, rating: 5.0, priceDzd: 3800, isLive: true, colorTheme: 'gold' },
    { titleAr: 'ماستركلاس فيزياء البكالوريا', titleFr: 'Masterclass BAC Physique-Chimie', teacherId: 'tch-mansouri', teacherName: 'Pr. Karim Mansouri', category: 'BAC' as const, lessonsCount: 22, rating: 4.8, priceDzd: 3200, isLive: true, colorTheme: 'sky' },
    { titleAr: 'ميكانيك النقطة والديناميك', titleFr: 'Physique 1 - Mécanique du Point', teacherId: 'tch-bouzid', teacherName: 'Dr. Youcef Bouzid', category: 'UNIVERSITY_LMD' as const, lessonsCount: 10, rating: 4.7, priceDzd: 2900, isLive: false, colorTheme: 'violet' },
    { titleAr: 'تشريح عام وتطبيقي - طب السنة الأولى', titleFr: 'Anatomie Générale - 1ère Année Médecine', teacherId: 'tch-mansouri', teacherName: 'Faculté Médecine Alger 1', category: 'MEDICAL' as const, lessonsCount: 16, rating: 4.95, priceDzd: 5200, isLive: true, colorTheme: 'rose' },
  ];

  const createdCourses = [];
  for (const c of courseSeed) {
    createdCourses.push(await prisma.course.create({ data: { ...c } }));
  }

  const now = new Date();
  const sessionSeed = [
    { title: 'حصة مراجعة Analyse 1 - USTHB', teacherId: 'user-teacher', teacherName: 'Pr. Abdelrahim Kadri', daysFromNow: 2, platform: 'ONSITE' as const, wilayaCode: 16, category: 'UNIVERSITY_LMD' as const },
    { title: 'BAC Physics Masterclass الوطنية', teacherId: 'tch-mansouri', teacherName: 'Pr. Karim Mansouri', daysFromNow: 4, platform: 'GOOGLE_MEET' as const, wilayaCode: 25, category: 'BAC' as const },
    { title: 'ورشة خوارزميات الأشجار الثنائية', teacherId: 'tch-benali', teacherName: 'Dr. Amina Benali', daysFromNow: 6, platform: 'CLASSROOM' as const, wilayaCode: 16, category: 'UNIVERSITY_LMD' as const },
    { title: 'مراجعة تشريح - طلبة طب السنة 1', teacherId: 'tch-mansouri', teacherName: 'Faculté Médecine Alger 1', daysFromNow: 8, platform: 'GOOGLE_MEET' as const, wilayaCode: 16, category: 'MEDICAL' as const },
  ];

  for (const s of sessionSeed) {
    const scheduledAt = new Date(now.getTime() + s.daysFromNow * 24 * 3600 * 1000);
    await prisma.liveSession.create({
      data: {
        title: s.title,
        teacherId: s.teacherId,
        teacherName: s.teacherName,
        scheduledAt,
        platform: s.platform,
        wilayaCode: s.wilayaCode,
        category: s.category,
        status: 'UPCOMING',
      },
    });
  }

  if (createdCourses.length >= 2) {
    await prisma.enrollment.create({
      data: {
        studentId: 'user-student-gold',
        courseId: createdCourses[0].id,
        courseTitle: createdCourses[0].titleFr || createdCourses[0].titleAr,
        teacherName: createdCourses[0].teacherName,
        progressPercent: 45,
        remainingHours: 8.75,
      },
    });
    await prisma.enrollment.create({
      data: {
        studentId: 'user-student-gold',
        courseId: createdCourses[1].id,
        courseTitle: createdCourses[1].titleFr || createdCourses[1].titleAr,
        teacherName: createdCourses[1].teacherName,
        progressPercent: 75,
        remainingHours: 3.2,
      },
    });
  }

  await prisma.platformSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      academicYear: '2025/2026',
      ambassadorCommissionRate: 10,
      baridiMobEnabled: true,
      edahabiaEnabled: true,
    },
  });
}
