'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Video,
  Star,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plus,
  ArrowUpRight,
  Flame,
  Award,
  Users,
  Bot,
  Calendar as CalendarIcon,
  TrendingUp,
  FileText,
  Layers,
  GraduationCap,
  Play,
  Share2,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { DAWARAT_PACKS, TEACHERS, AMBASSADORS, EXAMS } from '@/lib/initial-data';
import { PackCheckoutModal } from '@/components/dawarat/PackCheckoutModal';
import { DawaaraPack } from '@/types';

export const EduplexDashboardHome: React.FC = () => {
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();
  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const [selectedPackForCheckout, setSelectedPackForCheckout] = useState<DawaaraPack | null>(null);
  const [activeCourseFilter, setActiveCourseFilter] = useState('Active');
  const [calendarMonth, setCalendarMonth] = useState('August, 2026');

  // New Courses Data matching Eduplex cards
  const newCourses = [
    {
      id: 'course-1',
      title: locale === 'ar' ? 'الرياضيات والفيزياء (BAC 2026)' : 'Math & Physique BAC',
      lessons: '12 Lessons',
      hours: '24h Live',
      rating: '4.8',
      type: locale === 'ar' ? 'تحضير بكالوريا' : 'Data Research',
      bgIconColor: 'bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400',
      iconEmoji: '📐',
      slug: 'pack-bac-science-2026',
    },
    {
      id: 'course-2',
      title: locale === 'ar' ? 'الخوارزميات وهياكل البيانات (LMD)' : 'Algorithmique & C++',
      lessons: '15 Lessons',
      hours: '30h Live',
      rating: '5.0',
      type: locale === 'ar' ? 'إعلام آلي LMD' : 'UI/UX Design',
      bgIconColor: 'bg-lime-100 dark:bg-lime-950/50 text-lime-600 dark:text-lime-400',
      iconEmoji: '💻',
      slug: 'pack-univ-informatique-lmd',
    },
    {
      id: 'course-3',
      title: locale === 'ar' ? 'التشريح وعلم العظام (Médecine)' : 'Anatomie & Ostéologie',
      lessons: '8 Lessons',
      hours: '18h Live',
      rating: '4.6',
      type: locale === 'ar' ? 'علوم طبية' : 'Art and Design',
      bgIconColor: 'bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400',
      iconEmoji: '🫀',
      slug: 'pack-medecine-1ere-annee',
    },
  ];

  // Daily Schedule items matching reference
  const dailySchedule = [
    {
      id: 'sch-1',
      title: locale === 'ar' ? 'الجبر الخطي والمصفوفات' : 'Design System',
      subtitle: locale === 'ar' ? 'محاضرة تفاعلية • قاعة 01' : 'Lecture - Class',
      iconBg: 'bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400',
      icon: Layers,
    },
    {
      id: 'sch-2',
      title: locale === 'ar' ? 'الفيزياء النووية والكيمياء الحركية' : 'Typography',
      subtitle: locale === 'ar' ? 'فوج تطبيقي • اختبار تجريبي' : 'Group - Test',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400',
      icon: Sparkles,
    },
    {
      id: 'sch-3',
      title: locale === 'ar' ? 'التشريح الوصفي وعلم العظام' : 'Color Style',
      subtitle: locale === 'ar' ? 'ورشة مراجعة QCM' : 'Group - Test',
      iconBg: 'bg-lime-100 dark:bg-lime-950/40 text-lime-700 dark:text-lime-400',
      icon: BookOpen,
    },
    {
      id: 'sch-4',
      title: locale === 'ar' ? 'الفلسفة الحديثة وتحليل النصوص' : 'Visual Design',
      subtitle: locale === 'ar' ? 'محاضرة منهجية المقالة' : 'Lecture - Test',
      iconBg: 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400',
      icon: GraduationCap,
    },
  ];

  // Course You're Taking matching Eduplex list
  const coursesTaking = [
    {
      id: 'take-1',
      title: locale === 'ar' ? 'حزمة البكالوريا علوم تجريبية 2026' : '3D Design Course',
      teacher: 'أ. كمال بن عيسى (Micheal Andrew)',
      remaining: '8h 45 min',
      progress: 45,
      iconBg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      avatar: '👨‍🏫',
    },
    {
      id: 'take-2',
      title: locale === 'ar' ? 'حزمة الإعلام الآلي LMD Algorithmique' : 'Development Basics',
      teacher: 'د. رفيق معزوز (Natalia Vaman)',
      remaining: '18h 12 min',
      progress: 75,
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      avatar: '👩‍🏫',
    },
  ];

  // Assignments items matching Eduplex list
  const assignments = [
    {
      id: 'asg-1',
      title: locale === 'ar' ? 'اختبار تجريبي في الرياضيات BAC' : 'Methods of data',
      date: '02 July, 10:30 AM',
      status: 'in progress',
      statusColor: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300',
      iconBg: 'bg-purple-500',
    },
    {
      id: 'asg-2',
      title: locale === 'ar' ? 'فرض المراقبة المستمرة في الخوارزميات' : 'Market Research',
      date: '14 June, 12:45 AM',
      status: 'Completed',
      statusColor: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300',
      iconBg: 'bg-emerald-500',
    },
    {
      id: 'asg-3',
      title: locale === 'ar' ? 'بنك QCM التشريح الطبي 1ère Année' : 'Data Collection',
      date: '12 May, 11:00 AM',
      status: 'Upcoming',
      statusColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300',
      iconBg: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-6 font-arabic select-none">
      {/* ================= ROW 1: New Courses Carousel + Go Premium Banner ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 8 Cols: New Courses */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-sans">
              {locale === 'ar' ? 'الدورات الجديدة والموصى بها' : 'New Courses'}
            </h2>
            <Link
              href={`/${locale}/dawarat`}
              className="text-xs font-bold text-slate-500 dark:text-gray-400 hover:text-gold-500 transition-colors"
            >
              {locale === 'ar' ? 'استعراض الكل' : 'View All'}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {newCourses.map((course) => (
              <Link
                key={course.id}
                href={`/${locale}/dawarat/${course.slug}`}
                className="p-4 rounded-3xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 hover:border-gold-500/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-2xl ${course.bgIconColor} flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform`}
                    >
                      <span>{course.iconEmoji}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400">
                      {course.lessons}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-gold-500 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-gray-400 mt-0.5">
                      {course.hours}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-navy-800/60 flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1 font-mono font-bold text-amber-500">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span>{course.rating}</span>
                  </div>
                  <span className="text-slate-500 dark:text-gray-400 font-medium truncate max-w-[90px]">
                    {course.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right 4 Cols: Go Premium Card matching Eduplex style */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-[#090E1A] border border-gold-500/30 text-white shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4 group">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gold-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Eduplex DZ</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 text-[9px] font-mono font-bold">
                VIP 2026
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-black text-white leading-tight font-sans">
              {locale === 'ar' ? 'العضوية الذهبية الشاملة' : 'Go Premium'}
            </h3>
            <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-2">
              {locale === 'ar'
                ? 'استمتع بوصول غير محدود لبنك +25,000 موضوع امتحان مع الحلول النموذجية وحصص البث المباشر.'
                : 'Explore 25k+ courses with lifetime membership & live session privileges.'}
            </p>
          </div>

          <div className="pt-2 relative z-10 flex items-center justify-between">
            <Link
              href={`/${locale}/card`}
              className="px-4 py-2 rounded-2xl bg-[#D9F99D] hover:bg-[#BEF264] text-[#142A10] font-black text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
            >
              <span>{locale === 'ar' ? 'ترقية الحساب الآن' : 'Get Access'}</span>
              <ArrowIcon className="w-3 h-3" />
            </Link>

            <span className="text-2xl">📚</span>
          </div>
        </div>
      </div>

      {/* ================= ROW 2: Hours Activity Chart + Daily Schedule + Mini Calendar ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 4 Cols: Hours Activity Bar Chart */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white font-sans">
                {locale === 'ar' ? 'نشاط المراجعة والساعات' : 'Hours Activity'}
              </h3>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+3% Increase than last week</span>
              </div>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-navy-850 text-[10px] font-bold text-slate-600 dark:text-gray-300 flex items-center gap-1 cursor-pointer">
              <span>Weekly</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="relative pt-6 pb-2">
            {/* Tooltip on active bar (Thursday) */}
            <div className="absolute top-0 right-1/4 rtl:right-auto rtl:left-1/4 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-navy-950 text-white text-[9px] font-mono font-bold shadow-lg flex items-center gap-1 border border-gold-500/40 z-10">
              <span className="text-amber-400">⏱️</span>
              <span>6h 45 min</span>
            </div>

            <div className="h-32 flex items-end justify-between gap-2 px-2">
              {[
                { day: 'Su', height: '40%', active: false },
                { day: 'Mo', height: '70%', active: false },
                { day: 'Tu', height: '45%', active: false },
                { day: 'We', height: '85%', active: false },
                { day: 'Th', height: '95%', active: true },
                { day: 'Fr', height: '35%', active: false },
                { day: 'Sa', height: '65%', active: false },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    style={{ height: bar.height }}
                    className={`w-2.5 sm:w-3.5 rounded-full transition-all duration-500 ${
                      bar.active
                        ? 'bg-gradient-to-t from-gold-500 to-[#D9F99D] shadow-sm'
                        : 'bg-slate-200 dark:bg-navy-800 hover:bg-slate-300 dark:hover:bg-navy-700'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-slate-400 dark:text-gray-400">
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center 4 Cols: Daily Schedule List */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white font-sans">
              {locale === 'ar' ? 'جدول الحصص اليومي' : 'Daily Schedule'}
            </h3>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              4 {locale === 'ar' ? 'حصص' : 'Sessions'}
            </span>
          </div>

          <div className="space-y-2">
            {dailySchedule.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-navy-850/80 border border-transparent hover:border-slate-200 dark:hover:border-navy-800 transition-all flex items-center justify-between gap-3 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-sm`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="text-left rtl:text-right">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-gold-500 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 dark:text-gray-400 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <ArrowIcon className="w-4 h-4 text-slate-300 dark:text-gray-600 group-hover:text-gold-500 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Interactive Mini Calendar Widget */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-sm space-y-3">
          {/* Calendar Header with Navigation */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-850 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-black text-slate-900 dark:text-white font-sans">
              {calendarMonth}
            </span>
            <button
              type="button"
              className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-850 text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Day Labels */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-slate-400 dark:text-gray-500">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
              <div key={i} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Day Grid (August) */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
            {/* Empty slots for previous month */}
            <span className="text-slate-300 dark:text-gray-700 py-1">28</span>
            <span className="text-slate-300 dark:text-gray-700 py-1">29</span>
            <span className="text-slate-300 dark:text-gray-700 py-1">30</span>
            <span className="text-slate-800 dark:text-gray-200 py-1">1</span>
            <span className="text-slate-800 dark:text-gray-200 py-1">2</span>
            <span className="text-slate-800 dark:text-gray-200 py-1">3</span>
            <span className="text-slate-800 dark:text-gray-200 py-1">4</span>

            {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((day) => (
              <span key={day} className="text-slate-800 dark:text-gray-200 py-1">
                {day}
              </span>
            ))}

            {/* Highlighted active day 17 matching Eduplex */}
            <div className="flex items-center justify-center">
              <span className="w-6 h-6 rounded-full bg-[#D9F99D] text-[#142A10] font-black flex items-center justify-center shadow-sm">
                17
              </span>
            </div>

            {[18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31].map((day) => (
              <span key={day} className="text-slate-800 dark:text-gray-200 py-1">
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ================= ROW 3: Course You're Taking + Assignments ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 7 Cols: Course You're Taking */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white font-sans">
              {locale === 'ar' ? 'الدورات والحزم المسجل بها' : "Course You're Taking"}
            </h3>

            <div className="flex items-center gap-2">
              <div className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-navy-850 text-[10px] font-bold text-slate-600 dark:text-gray-300 flex items-center gap-1 cursor-pointer">
                <span>Active</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>

              <Link
                href={`/${locale}/dawarat`}
                className="w-6 h-6 rounded-full bg-[#D9F99D] text-[#142A10] flex items-center justify-center font-bold hover:scale-105 transition-transform"
                title="Add Course"
              >
                <Plus className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {coursesTaking.map((course) => (
              <div
                key={course.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-200/80 dark:border-navy-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-gold-500/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl ${course.iconBg} flex items-center justify-center text-lg shrink-0 shadow-sm`}
                  >
                    <span>{course.avatar}</span>
                  </div>
                  <div className="text-left rtl:text-right">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-gold-500 transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {course.teacher}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-navy-800">
                  <div className="text-left rtl:text-right">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">
                      Remaining
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700 dark:text-gray-300">
                      {course.remaining}
                    </span>
                  </div>

                  {/* Circular Progress Gauge */}
                  <div className="relative w-10 h-10 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200 dark:text-navy-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-emerald-500"
                        strokeDasharray={`${course.progress}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-[9px] font-mono font-bold text-slate-700 dark:text-gray-200">
                      {course.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Assignments List matching Eduplex */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-[#0D1424] border border-slate-200/80 dark:border-navy-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white font-sans">
              {locale === 'ar' ? 'المهام والاختبارات القادمة' : 'Assignments'}
            </h3>

            <Link
              href={`/${locale}/bot`}
              className="w-6 h-6 rounded-full bg-[#D9F99D] text-[#142A10] flex items-center justify-center font-bold hover:scale-105 transition-transform"
              title="Add Assignment"
            >
              <Plus className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {assignments.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-navy-850/60 border border-slate-100 dark:border-navy-800/60 flex items-center justify-between gap-3 group transition-all"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl ${item.iconBg} text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold`}
                  >
                    📝
                  </div>
                  <div className="text-left rtl:text-right">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-gold-500 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400 dark:text-gray-400 mt-0.5">
                      {item.date}
                    </p>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold shrink-0 ${item.statusColor}`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout Modal when purchasing from dashboard */}
      <AnimatePresence>
        {selectedPackForCheckout && (
          <PackCheckoutModal
            isOpen={!!selectedPackForCheckout}
            pack={selectedPackForCheckout}
            onClose={() => setSelectedPackForCheckout(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
