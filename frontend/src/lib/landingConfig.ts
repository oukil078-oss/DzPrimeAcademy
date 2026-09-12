export interface FeaturedCourseItem {
  id: string;
  badge?: string;
  badgeColor?: string;
  thumbnailUrl: string;
  titleAr: string;
  titleFr: string;
  category: string;
  instructorNameAr: string;
  instructorNameFr: string;
  instructorAvatar?: string;
  rating: number;
  reviewsCount: number;
  durationHours: number;
  levelAr: string;
  levelFr: string;
  priceDzd: number;
  isPopular?: boolean;
}

export interface LandingPageConfig {
  hero: {
    badgeAr: string;
    badgeFr: string;
    titleLeadAr: string;
    titleLeadFr: string;
    titleHighlightAr: string;
    titleHighlightFr: string;
    titleEndAr: string;
    titleEndFr: string;
    subAr: string;
    subFr: string;
    ctaPrimaryAr: string;
    ctaPrimaryFr: string;
    ctaSecondaryAr: string;
    ctaSecondaryFr: string;
  };
  stats: {
    mode: 'MANUAL' | 'AUTO';
    examsValue: string;
    examsLabelAr: string;
    examsLabelFr: string;
    studentsValue: string;
    studentsLabelAr: string;
    studentsLabelFr: string;
    wilayasValue: string;
    wilayasLabelAr: string;
    wilayasLabelFr: string;
    satisfactionValue: string;
    satisfactionLabelAr: string;
    satisfactionLabelFr: string;
  };
  featuredCoursesSection: {
    titleAr: string;
    titleFr: string;
    subtitleAr: string;
    subtitleFr: string;
    courses: FeaturedCourseItem[];
  };
  ambassadorBanner: {
    titleAr: string;
    titleFr: string;
    bodyAr: string;
    bodyFr: string;
    ctaPrimaryAr: string;
    ctaPrimaryFr: string;
    ctaSecondaryAr: string;
    ctaSecondaryFr: string;
  };
  finalCta: {
    titleAr: string;
    titleFr: string;
    bodyAr: string;
    bodyFr: string;
    buttonTextAr: string;
    buttonTextFr: string;
  };
}

export const DEFAULT_FEATURED_COURSES: FeaturedCourseItem[] = [
  {
    id: 'course-1',
    badge: 'Bestseller',
    badgeColor: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
    titleAr: 'المراجعة الشاملة لمادة الرياضيات (بكالوريا 2026)',
    titleFr: 'Pack Révision Complète Mathématiques (BAC 2026)',
    category: 'BAC',
    instructorNameAr: 'د. يوسف منصوري',
    instructorNameFr: 'Dr. Youssef Mansouri',
    instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    reviewsCount: 320,
    durationHours: 35,
    levelAr: 'جميع الشعب العلمية',
    levelFr: 'Toutes Filières Scientifiques',
    priceDzd: 4500,
    isPopular: true,
  },
  {
    id: 'course-2',
    badge: 'New',
    badgeColor: 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    titleAr: 'الخوارزميات وهيكلة البيانات 1 (L1 & L2 Informatique)',
    titleFr: 'Algorithmique & Structures de Données 1 (L1/L2 Info)',
    category: 'UNIVERSITY_LMD',
    instructorNameAr: 'أ. سامي بلحاج',
    instructorNameFr: 'Pr. Sami Belhadj',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewsCount: 180,
    durationHours: 28,
    levelAr: 'جامعي LMD',
    levelFr: 'Licence LMD',
    priceDzd: 3800,
  },
  {
    id: 'course-3',
    badge: 'Popular',
    badgeColor: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&auto=format&fit=crop&q=80',
    titleAr: 'دورة التشريح البشري وعلم الأنسجة (السنة الأولى طب)',
    titleFr: 'Anatomie Humaine & Histologie Médicale (1ère Année)',
    category: 'MEDICAL',
    instructorNameAr: 'د. أمينة زروقي',
    instructorNameFr: 'Dr. Amina Zerrouki',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    reviewsCount: 410,
    durationHours: 42,
    levelAr: 'علوم طبية صيدلة وطب أسنان',
    levelFr: 'Médecine, Pharmacie, Dentaire',
    priceDzd: 5200,
    isPopular: true,
  },
  {
    id: 'course-4',
    badge: 'VIP Pack',
    badgeColor: 'bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    titleAr: 'تطوير تطبيقات الويب الكاملة (Full-Stack Next.js & React)',
    titleFr: 'Développement Web Full-Stack (Next.js & React)',
    category: 'DEVELOPMENT',
    instructorNameAr: 'م. زكريا وكيل',
    instructorNameFr: 'Ing. Zakarya Oukil',
    instructorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5.0,
    reviewsCount: 560,
    durationHours: 60,
    levelAr: 'متقدم مع مشاريع حية',
    levelFr: 'Avancé avec projets réels',
    priceDzd: 6500,
  },
];

export const DEFAULT_LANDING_CONFIG: LandingPageConfig = {
  hero: {
    badgeAr: 'منصة التميز الأكاديمي والتقني الأولى في الجزائر 2026',
    badgeFr: 'Plateforme Éducative & Fintech N°1 en Algérie 2026',
    titleLeadAr: 'تعلّم كل شيء.',
    titleLeadFr: 'Apprenez tout.',
    titleHighlightAr: 'اصنع',
    titleHighlightFr: 'Bâtissez',
    titleEndAr: 'مستقبلك.',
    titleEndFr: 'votre avenir.',
    subAr: 'مقاييس جامعية معتمدة، تحضير متكامل للبكالوريا، ملخصات ذكية وبنك امتحانات نموذجية محلولة تضمن تفوقك في 58 ولاية.',
    subFr: 'Des modules universitaires, préparation complète au BAC, résumés intelligents et annales corrigées pour exceller dans les 58 wilayas.',
    ctaPrimaryAr: 'استكشف الدورات',
    ctaPrimaryFr: 'Explorer les Cours',
    ctaSecondaryAr: 'مشاهدة العرض التوضيحي',
    ctaSecondaryFr: 'Voir la Démo',
  },
  stats: {
    mode: 'AUTO',
    examsValue: '12,000+',
    examsLabelAr: 'موضوع امتحان محلول',
    examsLabelFr: 'Annales Corrigées',
    studentsValue: '50,000+',
    studentsLabelAr: 'طالب نشط بالمنصة',
    studentsLabelFr: 'Étudiants Actifs',
    wilayasValue: '58',
    wilayasLabelAr: 'ولاية مغطاة بالسفراء',
    wilayasLabelFr: 'Wilayas Couvertes',
    satisfactionValue: '99.8%',
    satisfactionLabelAr: 'نسبة رضا الطلبة',
    satisfactionLabelFr: 'Taux de Satisfaction',
  },
  featuredCoursesSection: {
    titleAr: 'استكشف أشهر الدورات والمقاييس',
    titleFr: 'Explorez nos modules populaires',
    subtitleAr: 'المسارات والمقاييس المعتمدة',
    subtitleFr: 'Modules & Filières',
    courses: DEFAULT_FEATURED_COURSES,
  },
  ambassadorBanner: {
    titleAr: 'شبكة سفراء وأساتذة معتمدين في 58 ولاية',
    titleFr: "Réseau d'ambassadeurs et professeurs certifiés dans 58 wilayas",
    bodyAr: 'تصلك بسفراء، أساتذة، ومكوّنين معتمدين من أجل أفضل مساندة، تحضير، ومتابعة أينما كنت.',
    bodyFr: 'Connectez-vous avec des ambassadeurs, professeurs et formateurs certifiés pour le meilleur accompagnement.',
    ctaPrimaryAr: 'تصفح دليل السفراء في ولايتك',
    ctaPrimaryFr: 'Voir les ambassadeurs de ma wilaya',
    ctaSecondaryAr: 'كن سفيراً معتمداً',
    ctaSecondaryFr: 'Devenir Ambassadeur',
  },
  finalCta: {
    titleAr: 'جاهز للانطلاق مع DZ Prime؟',
    titleFr: 'Prêt à décoller avec DZ Prime ?',
    bodyAr: 'انضم لآلاف الطلبة الجزائريين يحققون التميز الأكاديمي كل يوم.',
    bodyFr: "Rejoignez des milliers d'étudiants algériens qui excellent chaque jour.",
    buttonTextAr: 'أنشئ حسابك المجاني',
    buttonTextFr: 'Créer mon compte gratuit',
  },
};
