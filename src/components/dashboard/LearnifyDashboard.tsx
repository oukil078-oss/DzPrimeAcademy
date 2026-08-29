'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  Play,
  Clock,
  Video,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Crown,
  Bell,
  TrendingUp,
  Award,
  Calendar,
  Flame,
  Target,
  GraduationCap,
  Download,
  FileText,
  Layers,
  ChevronRight,
  ChevronLeft,
  CreditCard,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore, useTeacherStore } from '@/lib/store';
import { DAWARAT_PACKS, EXAMS } from '@/lib/initial-data';
import { PackCheckoutModal } from '@/components/dawarat/PackCheckoutModal';
import { DawaaraPack } from '@/types';

export const LearnifyDashboard: React.FC = () => {
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();
  const { resources } = useTeacherStore();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Determine student's track based on current user specialty
  const getInitialTrack = () => {
    if (!currentUser?.specialty) return 'BAC';
    const s = currentUser.specialty.toLowerCase();
    if (s.includes('bac') || s.includes('science') || s.includes('lycée')) return 'BAC';
    if (s.includes('info') || s.includes('mi') || s.includes('logiciel')) return 'LMD';
    if (s.includes('méd') || s.includes('santé') || s.includes('pharm')) return 'MED';
    return 'BAC';
  };

  const [activeTrack, setActiveTrack] = useState<'BAC' | 'LMD' | 'MED'>(getInitialTrack());
  const [selectedPackForCheckout, setSelectedPackForCheckout] = useState<DawaaraPack | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(3); // Wednesday by default
  const [bookmarkedCards, setBookmarkedCards] = useState<Record<string, boolean>>({
    c1: true,
    c2: false,
    c3: false,
  });

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const trackTabs = [
    { id: 'BAC', label: locale === 'ar' ? '🎓 بكالوريا علوم تجريبية' : 'BAC Sciences 2026' },
    { id: 'LMD', label: locale === 'ar' ? '💻 إعلام آلي LMD (USTHB)' : 'Computer Science LMD' },
    { id: 'MED', label: locale === 'ar' ? '🩺 علوم طبية & Résidanat' : 'Medical & Residency' },
  ];

  // 1. DATA FOR BAC SCIENCE STUDENTS
  const bacCourses = [
    {
      id: 'bac-c1',
      tag: locale === 'ar' ? 'الرياضيات والتحليل' : 'Mathematics & Analysis',
      tagBg: 'bg-black text-white dark:bg-navy-950 dark:text-white',
      title: locale === 'ar' ? 'الدوال العددية، المتتاليات، والحساب التكاملي' : 'Numerical Functions, Sequences & Integrals',
      progressCompleted: 18,
      progressTotal: 24,
      progressPercent: 75,
      bg: 'bg-[#FEF08A] text-[#1E1B2E]', // Sunny Pastel Yellow
      borderColor: 'border-yellow-300',
      avatars: ['👨‍🎓', '👩‍🎓', '👨‍💻'],
      extraStudents: '+140',
      teacher: 'أ. كمال بن عيسى (Inspecteur)',
      packId: 'pack-bac-science-2026',
    },
    {
      id: 'bac-c2',
      tag: locale === 'ar' ? 'العلوم الفيزيائية' : 'Physics & Chemistry',
      tagBg: 'bg-[#FDE047] text-[#713F12]',
      title: locale === 'ar' ? 'المتابعة الزمنية، الظواهر الكهربائية (RC/RL)، وحركة الكواكب' : 'Reaction Kinetics, RC/RL Circuits & Mechanics',
      progressCompleted: 16,
      progressTotal: 22,
      progressPercent: 72,
      bg: 'bg-[#DDD6FE] text-[#1E1B2E]', // Pastel Lavender
      borderColor: 'border-purple-300',
      avatars: ['👨‍🔬', '👩‍🔬', '👨‍🎓'],
      extraStudents: '+115',
      teacher: 'د. سليم منصوري (USTHB)',
      packId: 'pack-bac-science-2026',
    },
    {
      id: 'bac-c3',
      tag: locale === 'ar' ? 'علوم الطبيعة والحياة' : 'Natural Sciences & Biology',
      tagBg: 'bg-[#E9D5FF] text-[#581C87]',
      title: locale === 'ar' ? 'التعبير المورثي وتركيب البروتين، والمناعة والجيولوجيا' : 'Protein Synthesis, Immunity & Bioenergetics',
      progressCompleted: 15,
      progressTotal: 20,
      progressPercent: 75,
      bg: 'bg-[#BAE6FD] text-[#1E1B2E]', // Pastel Cyan
      borderColor: 'border-sky-300',
      avatars: ['👩‍⚕️', '👨‍🎓', '👩‍🎓'],
      extraStudents: '+98',
      teacher: 'د. أمينة بوزيد',
      packId: 'pack-bac-science-2026',
    },
  ];

  const bacLessons = [
    {
      id: 'bl-1',
      title: locale === 'ar' ? '01. المناعة: آلية القضاء على المستضد بواسطة الأجسام المضادة' : '01. Immunity: Antigen Elimination by Antibodies',
      subtitle: locale === 'ar' ? 'حل مواضيع بكالوريا 2024 و 2025 النموذجية' : 'Practice with official past exam papers',
      teacher: 'د. أمينة بوزيد',
      teacherAvatar: '👩‍🏫',
      duration: '45 min',
      meetUrl: 'https://meet.dzprime.academy/live-bac-biology',
    },
    {
      id: 'bl-2',
      title: locale === 'ar' ? '02. المتابعة الزمنية لتحول كيميائي عن طريق قياس الناقلية' : '02. Chemical Reaction Kinetics via Conductivity',
      subtitle: locale === 'ar' ? 'تمارين معقدة حول زمن نصف التفاعل t1/2' : 'Advanced problem sets on reaction half-life',
      teacher: 'د. سليم منصوري',
      teacherAvatar: '👨‍🏫',
      duration: '50 min',
      meetUrl: 'https://meet.dzprime.academy/live-bac-phys',
    },
    {
      id: 'bl-3',
      title: locale === 'ar' ? '03. دراسة دالة لوغاريتمية وتطبيق مبرهنة القيم المتوسطة' : '03. Logarithmic Functions & Intermediate Value Theorem',
      subtitle: locale === 'ar' ? 'سلسلة مسائل الامتياز 2026 مع الحل النموذجي' : 'Excellence problem series with full solutions',
      teacher: 'أ. كمال بن عيسى',
      teacherAvatar: '👨‍🏫',
      duration: '1h 15 min',
      meetUrl: 'https://meet.dzprime.academy/live-bac-math',
    },
    {
      id: 'bl-4',
      title: locale === 'ar' ? '04. منهجية معالجة المقال الفلسفي: الاستقصاء بالوضع' : '04. Philosophy Methodology: Structured Essay Defense',
      subtitle: locale === 'ar' ? 'طريقة الحصول على علامة 17+ في الفلسفة' : 'Scoring 17+ on the national BAC philosophy exam',
      teacher: 'أ. نادية شريف',
      teacherAvatar: '👩‍💼',
      duration: '35 min',
      meetUrl: 'https://meet.dzprime.academy/live-bac-philo',
    },
  ];

  // 2. DATA FOR COMPUTER SCIENCE (LMD INFORMATIQUE)
  const lmdCourses = [
    {
      id: 'lmd-c1',
      tag: locale === 'ar' ? 'الخوارزميات وهياكل البيانات' : 'Algorithms & Data Structures',
      tagBg: 'bg-black text-white dark:bg-navy-950 dark:text-white',
      title: locale === 'ar' ? 'الأشجار الثنائية BST/AVL، الغرافات، وحساب التعقيد' : 'Binary Trees BST/AVL, Graphs & Big-O in C++',
      progressCompleted: 28,
      progressTotal: 35,
      progressPercent: 80,
      bg: 'bg-[#FEF08A] text-[#1E1B2E]',
      borderColor: 'border-yellow-300',
      avatars: ['👨‍💻', '👩‍💻', '👨‍🔬'],
      extraStudents: '+160',
      teacher: 'د. سارة عثماني (USTHB)',
      packId: 'pack-univ-informatique-lmd',
    },
    {
      id: 'lmd-c2',
      tag: locale === 'ar' ? 'أنظمة التشغيل & لينكس' : 'Operating Systems & Linux',
      tagBg: 'bg-[#FDE047] text-[#713F12]',
      title: locale === 'ar' ? 'إدارة العمليات Processus، الخيوط Threads، والسيمافورات C' : 'Processes, POSIX Threads & Semaphores in C',
      progressCompleted: 19,
      progressTotal: 25,
      progressPercent: 76,
      bg: 'bg-[#DDD6FE] text-[#1E1B2E]',
      borderColor: 'border-purple-300',
      avatars: ['👨‍💻', '👩‍💻', '👨‍🎓'],
      extraStudents: '+120',
      teacher: 'د. سفيان قاسي (USTHB)',
      packId: 'pack-univ-informatique-lmd',
    },
    {
      id: 'lmd-c3',
      tag: locale === 'ar' ? 'قواعد البيانات & SQL' : 'Databases & PostgreSQL',
      tagBg: 'bg-[#E9D5FF] text-[#581C87]',
      title: locale === 'ar' ? 'النمذجة العلائقية، التوحيد 3NF/BCNF، وتحسين الاستعلامات' : 'Relational Algebra, 3NF Normalization & SQL Queries',
      progressCompleted: 22,
      progressTotal: 30,
      progressPercent: 73,
      bg: 'bg-[#BAE6FD] text-[#1E1B2E]',
      borderColor: 'border-sky-300',
      avatars: ['👩‍💻', '👨‍💻', '👩‍🔬'],
      extraStudents: '+95',
      teacher: 'د. ليندة بلقاسم',
      packId: 'pack-univ-informatique-lmd',
    },
  ];

  const lmdLessons = [
    {
      id: 'll-1',
      title: locale === 'ar' ? '01. موازنة الأشجار AVL وإجراء عمليات التدوير الدائري' : '01. AVL Tree Balancing & Left/Right Rotations in C++',
      subtitle: locale === 'ar' ? 'تطبيق عملي مع تحليل التعقيد الزمني O(log n)' : 'Hands-on coding lab with complexity analysis',
      teacher: 'د. سارة عثماني',
      teacherAvatar: '👩‍🏫',
      duration: '1h 10 min',
      meetUrl: 'https://meet.dzprime.academy/live-cpp-lmd',
    },
    {
      id: 'll-2',
      title: locale === 'ar' ? '02. حل مشكلة الفلاسفة الجائعين باستخدام السيمافورات POSIX' : '02. Dining Philosophers Problem with POSIX Semaphores',
      subtitle: locale === 'ar' ? 'مزامنة الذاكرة المشتركة وتفادي حالة Deadlock' : 'Shared memory concurrency & deadlock prevention',
      teacher: 'د. سفيان قاسي',
      teacherAvatar: '👨‍🏫',
      duration: '45 min',
      meetUrl: 'https://meet.dzprime.academy/live-os-linux',
    },
    {
      id: 'll-3',
      title: locale === 'ar' ? '03. كتابة استعلامات SQL متقدمة وتحسين الفهارس B-Tree' : '03. Advanced SQL Subqueries & B-Tree Index Optimization',
      subtitle: locale === 'ar' ? 'تحضير مشاريع TP وامتحانات السداسي الثالث S3' : 'Preparation for S3 midterm exams & database labs',
      teacher: 'د. ليندة بلقاسم',
      teacherAvatar: '👩‍🏫',
      duration: '55 min',
      meetUrl: 'https://meet.dzprime.academy/live-sql-db',
    },
  ];

  // 3. DATA FOR MEDICAL STUDENTS
  const medCourses = [
    {
      id: 'med-c1',
      tag: locale === 'ar' ? 'التشريح البشري' : 'Human Anatomy & Neuro',
      tagBg: 'bg-black text-white dark:bg-navy-950 dark:text-white',
      title: locale === 'ar' ? 'تشريح الجهاز العصبي المركزي، الدماغ، والأوعية الدماغية' : 'Central Nervous System Anatomy & Willis Polygon',
      progressCompleted: 32,
      progressTotal: 40,
      progressPercent: 80,
      bg: 'bg-[#FEF08A] text-[#1E1B2E]',
      borderColor: 'border-yellow-300',
      avatars: ['👨‍⚕️', '👩‍⚕️', '👨‍🔬'],
      extraStudents: '+180',
      teacher: 'أ. د. ياسين براهيمي',
      packId: 'pack-medecine-1ere-annee',
    },
    {
      id: 'med-c2',
      tag: locale === 'ar' ? 'الفيزيولوجيا & الفارماكولوجيا' : 'Physiology & Pharmacology',
      tagBg: 'bg-[#FDE047] text-[#713F12]',
      title: locale === 'ar' ? 'فيزيولوجيا الجهاز البولي القلبي وديناميكية المضادات الحيوية' : 'Renal Physiology, ECG Dynamics & Antibiotic Kinetics',
      progressCompleted: 24,
      progressTotal: 30,
      progressPercent: 80,
      bg: 'bg-[#DDD6FE] text-[#1E1B2E]',
      borderColor: 'border-purple-300',
      avatars: ['👩‍⚕️', '👨‍⚕️', '👩‍🔬'],
      extraStudents: '+135',
      teacher: 'د. مريم سليماني',
      packId: 'pack-medecine-1ere-annee',
    },
    {
      id: 'med-c3',
      tag: locale === 'ar' ? 'بنك QCM Résidanat' : 'Medical Residency QCM',
      tagBg: 'bg-[#E9D5FF] text-[#581C87]',
      title: locale === 'ar' ? 'حل الحالات السريرية في أمراض القلب والصدر والأطفال' : 'Clinical Cases & QCMs in Cardiology & Pediatrics',
      progressCompleted: 450,
      progressTotal: 600,
      progressPercent: 75,
      bg: 'bg-[#BAE6FD] text-[#1E1B2E]',
      borderColor: 'border-sky-300',
      avatars: ['👨‍⚕️', '👩‍⚕️', '👨‍💻'],
      extraStudents: '+210',
      teacher: 'د. هشام بن ساعد',
      packId: 'pack-medecine-1ere-annee',
    },
  ];

  const medLessons = [
    {
      id: 'ml-1',
      title: locale === 'ar' ? '01. التروية الشريانية لجذع الدماغ ومضلع ويليس (Polygone de Willis)' : '01. Brainstem Arterial Vascularization & Willis Polygon',
      subtitle: locale === 'ar' ? 'شرح تفاعلي ثلاثي الأبعاد مع أسئلة الامتحانات السابقة' : '3D anatomical review with past medical exam questions',
      teacher: 'أ. د. ياسين براهيمي',
      teacherAvatar: '👨‍⚕️',
      duration: '1h 20 min',
      meetUrl: 'https://meet.dzprime.academy/live-med-anatomy',
    },
    {
      id: 'ml-2',
      title: locale === 'ar' ? '02. قراءة وتحليل تخطيط القلب الكهربائي (ECG) في الحالات الطارئة' : '02. Emergency ECG Reading & Arrhythmia Diagnosis',
      subtitle: locale === 'ar' ? 'تشخيص احتشاء العضلة القلبية واضطرابات النظم' : 'Myocardial infarction & conduction disorders review',
      teacher: 'د. مريم سليماني',
      teacherAvatar: '👩‍⚕️',
      duration: '50 min',
      meetUrl: 'https://meet.dzprime.academy/live-med-ecg',
    },
    {
      id: 'ml-3',
      title: locale === 'ar' ? '03. جلسة حل 100 سؤال QCM لمسابقة الإقامة في أمراض الصدر 2026' : '03. 100 Residency QCMs Solving Session in Pulmonology',
      subtitle: locale === 'ar' ? 'تحليل خيارات الإجابة والتعليلات السريرية الدقيقة' : 'Clinical rationale & eliminating diagnostic traps',
      teacher: 'د. هشام بن ساعد',
      teacherAvatar: '👨‍⚕️',
      duration: '1h 30 min',
      meetUrl: 'https://meet.dzprime.academy/live-med-residanat',
    },
  ];

  // EDUPLEX ASSIGNMENTS DATA
  const assignments = activeTrack === 'BAC'
    ? [
        {
          id: 'asg-1',
          title: locale === 'ar' ? 'واجب الدوال اللوغاريتمية والمتتاليات BAC #03' : 'BAC Functions & Sequences Series #03',
          teacher: 'أ. كمال بن عيسى',
          deadline: 'Due Tomorrow, 23:59',
          status: 'PENDING',
          points: '20 pts',
        },
        {
          id: 'asg-2',
          title: locale === 'ar' ? 'تقرير قياس الناقلية الكهربائية في الكيمياء' : 'Chemical Conductivity Lab Report',
          teacher: 'د. سليم منصوري',
          deadline: 'Due Friday, 18:00',
          status: 'SUBMITTED',
          points: '18.5/20',
        },
        {
          id: 'asg-3',
          title: locale === 'ar' ? 'تحليل وثائق التخصص الوظيفي للبروتينات في المناعة' : 'Protein Immunity Mechanism Analysis',
          teacher: 'د. أمينة بوزيد',
          deadline: 'Due Next Sunday',
          status: 'PENDING',
          points: '20 pts',
        },
      ]
    : activeTrack === 'LMD'
    ? [
        {
          id: 'asg-1',
          title: locale === 'ar' ? 'مشروع TP #02: موازنة الأشجار AVL بالـ C++' : 'TP #02: AVL Tree Balancing in C++',
          teacher: 'د. سارة عثماني',
          deadline: 'Due Tomorrow, 23:59',
          status: 'PENDING',
          points: '20 pts',
        },
        {
          id: 'asg-2',
          title: locale === 'ar' ? 'حل مسألة التزامن باستخدام Sémaphores POSIX' : 'POSIX Semaphore Concurrency Lab',
          teacher: 'د. سفيان قاسي',
          deadline: 'Due Thursday, 20:00',
          status: 'SUBMITTED',
          points: '19/20',
        },
        {
          id: 'asg-3',
          title: locale === 'ar' ? 'تصميم مخطط قاعدة البيانات E/A وتطبيع 3NF' : 'E/R Diagram & 3NF Normalization Lab',
          teacher: 'د. ليندة بلقاسم',
          deadline: 'Due Next Monday',
          status: 'PENDING',
          points: '20 pts',
        },
      ]
    : [
        {
          id: 'asg-1',
          title: locale === 'ar' ? 'سلسلة 50 سؤال QCM في تشريح الجملة العصبية' : '50 QCMs Neuro-Anatomy Series',
          teacher: 'أ. د. ياسين براهيمي',
          deadline: 'Due Tomorrow, 22:00',
          status: 'PENDING',
          points: '100% QCM',
        },
        {
          id: 'asg-2',
          title: locale === 'ar' ? 'تقرير فحص تخطيط القلب الكهربائي والحالات الحادة' : 'Acute ECG Interpretation Case Study',
          teacher: 'د. مريم سليماني',
          deadline: 'Due Friday, 18:00',
          status: 'SUBMITTED',
          points: '92% Score',
        },
      ];

  // EDUPLEX STUDY TIMETABLE DAYS
  const weekDays = [
    { num: 1, name: locale === 'ar' ? 'الأحد' : 'Sun', date: '24' },
    { num: 2, name: locale === 'ar' ? 'الإثنين' : 'Mon', date: '25' },
    { num: 3, name: locale === 'ar' ? 'الثلاثاء' : 'Tue', date: '26' },
    { num: 4, name: locale === 'ar' ? 'الأربعاء' : 'Wed', date: '27' },
    { num: 5, name: locale === 'ar' ? 'الخميس' : 'Thu', date: '28' },
  ];

  // Select active data based on student's track
  const activeCourses = activeTrack === 'BAC' ? bacCourses : activeTrack === 'LMD' ? lmdCourses : medCourses;
  const activeLessons = activeTrack === 'BAC' ? bacLessons : activeTrack === 'LMD' ? lmdLessons : medLessons;

  return (
    <div className="w-full space-y-10 font-sans select-none">
      {/* ================= 1. TOP HEADER & METRIC SUMMARY STRIP (Eduplex Studio Data) ================= */}
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-navy-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3.5 py-1 rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400 font-mono font-black text-xs">
                👑 {currentUser?.specialty || (activeTrack === 'BAC' ? '3AS Sciences Expérimentales' : activeTrack === 'LMD' ? 'L2 Informatique USTHB' : 'Médecine & Résidanat')}
              </span>
              <span className="text-xs text-slate-400 dark:text-gray-400 font-medium">
                • {currentUser?.institutionName || 'Université USTHB'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
              {locale === 'ar' ? 'لوحة المتابعة والمقاييس الدراسية' : 'Student Study & Masterclass Hub'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-gray-400 mt-1 font-arabic">
              {locale === 'ar'
                ? 'مناهج حصرية مطابقة رسمياً للمقررات الجزائرية مع تتبع الحصص والواجبات والمواضيع الوزارية'
                : 'Official Algerian academic curricula tailored to your level with live Google Meet classes and exam archives'}
            </p>
          </div>

          {/* Level / Specialty Switcher Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-arabic">
            {trackTabs.map((tab) => {
              const isActive = activeTrack === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTrack(tab.id as any)}
                  className={`px-4.5 py-2.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap shadow-sm ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-gold-500 dark:text-navy-950 shadow-md scale-105'
                      : 'bg-white dark:bg-navy-850 text-slate-700 dark:text-gray-300 border border-slate-200 dark:border-navy-750 hover:bg-slate-50 dark:hover:bg-navy-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Metric Quick Summary Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 dark:text-gray-400">
              <span className="text-xs font-bold font-arabic">{locale === 'ar' ? 'المقاييس المسجلة' : 'Enrolled Modules'}</span>
              <BookOpen className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {activeTrack === 'BAC' ? '4 Modules' : activeTrack === 'LMD' ? '4 Modules' : '3 Modules'}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">
              48h Live Sessions
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 dark:text-gray-400">
              <span className="text-xs font-bold font-arabic">{locale === 'ar' ? 'المواضيع والامتحانات' : 'Exam Papers'}</span>
              <Download className="w-4 h-4 text-sky-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              28 Annales
            </div>
            <div className="text-[11px] text-sky-600 dark:text-sky-400 font-bold font-mono">
              {locale === 'ar' ? 'مواضيع وحلول نموذجية' : 'Full Solutions'}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 dark:text-gray-400">
              <span className="text-xs font-bold font-arabic">{locale === 'ar' ? 'البطاقة الرقمية' : 'Digital ID Card'}</span>
              <CreditCard className="w-4 h-4 text-gold-500" />
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono truncate">
              {currentUser?.studentCardId || 'DZ-STU-16-9921'}
            </div>
            <div className="text-[11px] text-gold-600 dark:text-gold-400 font-bold">
              👑 {currentUser?.role === 'STUDENT_PAID' ? 'VIP Gold Active' : 'Verified Student'}
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-400 dark:text-gray-400">
              <span className="text-xs font-bold font-arabic">{locale === 'ar' ? 'حصص هذا الأسبوع' : 'Live This Week'}</span>
              <Video className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              4 Sessions
            </div>
            <div className="text-[11px] text-red-500 font-bold font-mono animate-pulse">
              Google Meet HD 🔴
            </div>
          </div>
        </div>
      </div>

      {/* ================= 2. THREE SIGNATURE VIBRANT PASTEL COURSE CARDS (Learnify View) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {activeCourses.map((card) => {
          const isBookmarked = bookmarkedCards[card.id];
          return (
            <motion.div
              key={card.id}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className={`p-6 sm:p-8 rounded-[2.5rem] ${card.bg} border ${card.borderColor} shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden`}
            >
              {/* Top Row: Tag Pill + Bookmark Button */}
              <div className="flex items-center justify-between">
                <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-black tracking-wide ${card.tagBg}`}>
                  {card.tag}
                </span>

                <button
                  type="button"
                  onClick={(e) => toggleBookmark(card.id, e)}
                  className="p-1 text-[#1E1B2E]/70 hover:text-[#1E1B2E] transition-colors cursor-pointer"
                  title="Bookmark"
                >
                  <Bookmark
                    className={`w-5 h-5 ${isBookmarked ? 'fill-[#1E1B2E] text-[#1E1B2E]' : 'text-[#1E1B2E]'}`}
                  />
                </button>
              </div>

              {/* Middle: Course Title & Teacher */}
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-[#1E1B2E] leading-snug tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#1E1B2E]/80">
                  {card.teacher}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-mono font-bold text-[#1E1B2E]/90">
                  <span>{locale === 'ar' ? 'نسبة الإنجاز' : 'Progress'}</span>
                  <span>{card.progressCompleted}/{card.progressTotal} {locale === 'ar' ? 'حصص' : 'lessons'} ({card.progressPercent}%)</span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-black/15 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${card.progressPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-[#1E1B2E] rounded-full"
                  />
                </div>
              </div>

              {/* Bottom Row: Avatars + Coral Action Button */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                  {card.avatars.map((av, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full bg-white/95 border-2 border-white shadow-md flex items-center justify-center text-sm"
                    >
                      {av}
                    </div>
                  ))}
                  <div className="px-2.5 py-1 rounded-full bg-black text-white text-xs font-mono font-bold shadow-md">
                    {card.extraStudents}
                  </div>
                </div>

                <Link
                  href={`/${locale}/dawarat/${card.packId}`}
                  className="px-6 py-3 rounded-2xl bg-[#FF5733] hover:bg-[#E04826] text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{locale === 'ar' ? 'متابعة الدورة' : 'Continue'}</span>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================= 3. NEXT LESSONS TABLE & RECOMMENDED TRACK ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left 8 Cols: "My next lessons" Table */}
        <div className="lg:col-span-8 p-6 sm:p-9 rounded-[2.5rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-lg flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-sans">
                {locale === 'ar' ? 'حصصي المباشرة القادمة' : 'My Next Live Lessons'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {locale === 'ar'
                  ? 'انقر على أي حصة للانضمام مباشرة عبر Google Meet'
                  : 'Join your live masterclasses directly via Google Meet'}
              </p>
            </div>

            <Link
              href={`/${locale}/student#timetable`}
              className="text-xs sm:text-sm font-bold text-coral-500 hover:text-coral-600 dark:text-gold-400 hover:underline flex items-center gap-1"
            >
              <span>{locale === 'ar' ? 'عرض الجدول الأسبوعي' : 'View Timetable'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 text-xs font-mono font-bold text-slate-400 dark:text-gray-400 px-3">
            <div className="col-span-6 sm:col-span-7">{locale === 'ar' ? 'موضوع الحصة والوحدة' : 'Lesson Topic'}</div>
            <div className="col-span-4 sm:col-span-3">{locale === 'ar' ? 'الأستاذ المؤطر' : 'Instructor'}</div>
            <div className="col-span-2 text-right rtl:text-left">{locale === 'ar' ? 'المدة' : 'Duration'}</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-2.5 divide-y divide-slate-100 dark:divide-navy-800/50">
            {activeLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="grid grid-cols-12 items-center p-3 sm:p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors group cursor-pointer"
              >
                <div className="col-span-6 sm:col-span-7 space-y-1 pr-2 rtl:pr-0 rtl:pl-2">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors line-clamp-1">
                    {lesson.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-gray-400 line-clamp-1">
                    {lesson.subtitle}
                  </p>
                </div>

                <div className="col-span-4 sm:col-span-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-navy-750 flex items-center justify-center text-sm shadow-sm shrink-0">
                    {lesson.teacherAvatar}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-gray-300 line-clamp-1">
                    {lesson.teacher}
                  </span>
                </div>

                <div className="col-span-2 text-right rtl:text-left text-xs sm:text-sm font-mono font-bold text-slate-500 dark:text-gray-400 flex items-center justify-end rtl:justify-start gap-1.5">
                  <span>{lesson.duration}</span>
                  <a
                    href={lesson.meetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors hidden sm:inline-block"
                    title="Live Meet"
                  >
                    <Video className="w-4 h-4 animate-pulse" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Recommended Pack Card */}
        <motion.div
          whileHover={{ y: -6 }}
          className="lg:col-span-4 p-6 sm:p-9 rounded-[2.5rem] bg-[#1B1F2A] border border-slate-700/60 text-white shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-4 relative z-10 font-arabic">
            <span className="text-xs sm:text-sm text-gray-400 font-medium">
              {locale === 'ar' ? 'حزمة مقترحة لتثبيت الامتياز' : 'Recommended For Your Track'}
            </span>

            <div>
              <span className="px-3.5 py-1 rounded-full bg-[#FDE047] text-[#713F12] text-xs font-mono font-black uppercase tracking-wider">
                {activeTrack === 'BAC' ? 'BAC 2026 EXCELLENCE' : activeTrack === 'LMD' ? 'LMD SOFTWARE S3/S4' : 'RÉSIDANAT MÉDECINE'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {activeTrack === 'BAC'
                ? 'حزمة الامتياز الشاملة: بكالوريا 2026 وبنك المواضيع الوزارية'
                : activeTrack === 'LMD'
                ? 'Pack Spécialisé: Algorithmique C++ & Systèmes Linux'
                : 'Pack Concours Résidanat: 600 Cas Cliniques & QCMs'}
            </h3>

            <div className="space-y-2 pt-2">
              <p className="text-xs text-gray-400 font-medium">
                {locale === 'ar' ? 'انضم إليهم أكثر من 180 طالب الآن:' : 'Enrolled students from 58 wilayas:'}
              </p>
              <div className="flex items-center -space-x-2 rtl:space-x-reverse">
                {['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍⚕️'].map((av, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-slate-800 border-2 border-[#1B1F2A] flex items-center justify-center text-sm shadow-md"
                  >
                    {av}
                  </div>
                ))}
                <div className="px-2.5 py-1 rounded-full bg-gold-500 text-navy-950 text-xs font-mono font-bold shadow-md">
                  +180
                </div>
              </div>
            </div>
          </div>

          <Link
            href={`/${locale}/dawarat/${activeTrack === 'BAC' ? 'pack-bac-science-2026' : activeTrack === 'LMD' ? 'pack-univ-informatique-lmd' : 'pack-medecine-1ere-annee'}`}
            className="w-full py-4 rounded-2xl bg-[#FF5733] hover:bg-[#E04826] text-white font-black text-xs sm:text-sm shadow-xl active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{locale === 'ar' ? 'تفاصيل الحزمة والتسجيل' : 'More details & Enroll'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>

      {/* ================= 4. EDUPLEX FEATURES: ASSIGNMENTS & TIMETABLE ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch font-arabic">
        {/* Left 7 Cols: Assignments & Submissions */}
        <div className="lg:col-span-7 p-6 sm:p-9 rounded-[2.5rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {locale === 'ar' ? 'الواجبات والتطبيقات العملية' : 'Assignments & Homework'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {locale === 'ar'
                  ? 'رفع التمارين ومتابعة تصحيحات الأساتذة المؤطرين'
                  : 'Submit exercise series and review instructor grading'}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-mono font-bold">
              {assignments.length} Tasks
            </span>
          </div>

          <div className="space-y-3">
            {assignments.map((asg) => (
              <div
                key={asg.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-200/60 dark:border-navy-750 flex items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                    {asg.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-gray-400">
                    <span>{asg.teacher}</span>
                    <span>•</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">{asg.deadline}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                      asg.status === 'SUBMITTED'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {asg.status === 'SUBMITTED' ? asg.points : (locale === 'ar' ? 'قيد الإنجاز' : 'Pending')}
                  </span>

                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-gold-500 text-white dark:text-navy-950 text-xs font-bold shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {asg.status === 'SUBMITTED' ? (locale === 'ar' ? 'عرض التقييم' : 'Feedback') : (locale === 'ar' ? 'رفع الحل' : 'Submit')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Weekly Timetable & Calendar Widget */}
        <div className="lg:col-span-5 p-6 sm:p-9 rounded-[2.5rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-lg flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {locale === 'ar' ? 'الجدول الأسبوعي' : 'Weekly Timetable'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
                {locale === 'ar' ? 'توقيت الحصص المباشرة والورشات' : 'Live class schedule & slots'}
              </p>
            </div>

            <Calendar className="w-5 h-5 text-gold-500" />
          </div>

          {/* Week Day Pills */}
          <div className="grid grid-cols-5 gap-2 text-center">
            {weekDays.map((d) => {
              const isSelected = selectedDay === d.num;
              return (
                <button
                  key={d.num}
                  type="button"
                  onClick={() => setSelectedDay(d.num)}
                  className={`p-2.5 rounded-2xl transition-all cursor-pointer flex flex-col items-center gap-1 ${
                    isSelected
                      ? 'bg-gold-500 text-navy-950 shadow-md font-black scale-105'
                      : 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-navy-750'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{d.name}</span>
                  <span className="text-sm font-mono font-black">{d.date}</span>
                </button>
              );
            })}
          </div>

          {/* Today's Schedule Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-200/60 dark:border-navy-750 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 dark:text-gray-400">
              <span>18:00 - 19:30</span>
              <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-sans font-bold text-[10px]">
                Google Meet 🔴
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
              {activeTrack === 'BAC'
                ? 'حصة الرياضيات: حل بكالوريا 2024 و 2025'
                : activeTrack === 'LMD'
                ? 'حصة C++: موازنة الأشجار AVL والتعقيد'
                : 'حصة التشريح: تروية جذع الدماغ'}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-gray-400">
              {locale === 'ar' ? 'الأستاذ المؤطر متاح للأسئلة المباشرة' : 'Q&A session with active inspector'}
            </p>
          </div>

          <Link
            href={`/${locale}/bot`}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-750 text-slate-900 dark:text-white font-bold text-xs text-center flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span>{locale === 'ar' ? 'البحث عن ملخصات الدروس بالبوت' : 'Search Lecture Notes in AI Bot'}</span>
          </Link>
        </div>
      </div>

      {/* ================= 5. EDUPLEX STUDY DRIVE: DOWNLOADABLE ANNALES & MODULE RESOURCES ================= */}
      <div className="p-6 sm:p-9 rounded-[2.5rem] bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-lg space-y-6 font-arabic">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {locale === 'ar' ? 'حقيبة الملفات والمواضيع الوزارية (Study Drive)' : 'Study Drive & Official Exam Keys'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              {locale === 'ar'
                ? 'تحميل سلاسل التمارين الرسمية، حلول البكالوريا، ومطبوعات الدروس الجامعية PDF'
                : 'Download official problem series, BAC solutions, and university course PDFs'}
            </p>
          </div>

          <Link
            href={`/${locale}/bot`}
            className="text-xs sm:text-sm font-bold text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1"
          >
            <span>{locale === 'ar' ? 'تصفح بنك 2026 الكامل' : 'Browse All Resources'}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.slice(0, 6).map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-200/60 dark:border-navy-750 flex items-center justify-between gap-3 hover:border-gold-500/50 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">
                    {res.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {res.fileType} • {res.fileSize} • {res.downloadCount} DLs
                  </p>
                </div>
              </div>

              <a
                href={res.fileUrl}
                download
                className="p-2 rounded-xl bg-slate-200 dark:bg-navy-750 text-slate-700 dark:text-gray-300 hover:bg-gold-500 hover:text-navy-950 transition-colors shrink-0"
                title="Download"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPackForCheckout && (
        <PackCheckoutModal
          isOpen={!!selectedPackForCheckout}
          pack={selectedPackForCheckout}
          onClose={() => setSelectedPackForCheckout(null)}
        />
      )}
    </div>
  );
};
