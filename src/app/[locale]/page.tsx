'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Crown,
  Bot,
  FileText,
  Star,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Flame,
  Zap,
  Users,
  GraduationCap,
  Layers,
  Award,
  Download,
  Eye,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isGoldenMember } from '@/lib/rbac';
import { DecisionTreeBot } from '@/components/bot/DecisionTreeBot';
import { UpgradeModal } from '@/components/shared/UpgradeModal';
import { AMBASSADORS, EXAMS, getLocalizedAmbassadorBio } from '@/lib/initial-data';
import { HierarchyChart } from '@/components/dashboard/HierarchyChart';

export default function EduplexDashboardPage() {
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();

  const [activeViewTab, setActiveViewTab] = useState<'dashboard' | 'bot' | 'ambassadors' | 'hierarchy'>('dashboard');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(18);
  const [hoursFilter, setHoursFilter] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(4); // Default to Thursday

  const isGold = isGoldenMember(currentUser);
  const displayName = currentUser ? currentUser.name : (locale === 'ar' ? 'طالب جزائري' : 'Étudiant');
  const specialty = currentUser?.specialty || (locale === 'ar' ? 'جامعة هواري بومدين • L1 MI' : 'USTHB • L1 MI');

  // Days of current month for calendar
  const calendarDays = [
    { day: 28, isCurrentMonth: false },
    { day: 29, isCurrentMonth: false },
    { day: 30, isCurrentMonth: false },
    { day: 1, isCurrentMonth: true },
    { day: 2, isCurrentMonth: true },
    { day: 3, isCurrentMonth: true },
    { day: 4, isCurrentMonth: true },
    { day: 5, isCurrentMonth: true },
    { day: 6, isCurrentMonth: true },
    { day: 7, isCurrentMonth: true },
    { day: 8, isCurrentMonth: true },
    { day: 9, isCurrentMonth: true },
    { day: 10, isCurrentMonth: true },
    { day: 11, isCurrentMonth: true },
    { day: 12, isCurrentMonth: true },
    { day: 13, isCurrentMonth: true },
    { day: 14, isCurrentMonth: true },
    { day: 15, isCurrentMonth: true },
    { day: 16, isCurrentMonth: true },
    { day: 17, isCurrentMonth: true, hasEvent: true },
    { day: 18, isCurrentMonth: true, isToday: true, hasEvent: true },
    { day: 19, isCurrentMonth: true },
    { day: 20, isCurrentMonth: true },
    { day: 21, isCurrentMonth: true },
    { day: 22, isCurrentMonth: true },
    { day: 23, isCurrentMonth: true },
    { day: 24, isCurrentMonth: true },
    { day: 25, isCurrentMonth: true, hasEvent: true },
    { day: 26, isCurrentMonth: true },
    { day: 27, isCurrentMonth: true },
    { day: 28, isCurrentMonth: true },
    { day: 29, isCurrentMonth: true },
    { day: 30, isCurrentMonth: true },
    { day: 31, isCurrentMonth: true },
    { day: 1, isCurrentMonth: false },
  ];

  // Hours Activity Bar Chart Data (Weekly Su-Sa)
  const activityData = [
    { day: 'Su', dayAr: 'أحد', hours: 2.2, height: '35%', timeStr: '2h 15 min' },
    { day: 'Mo', dayAr: 'إثنين', hours: 5.8, height: '75%', timeStr: '5h 45 min' },
    { day: 'Tu', dayAr: 'ثلاثاء', hours: 4.1, height: '55%', timeStr: '4h 05 min' },
    { day: 'We', dayAr: 'أربعاء', hours: 3.0, height: '42%', timeStr: '3h 00 min' },
    { day: 'Th', dayAr: 'خميس', hours: 6.8, height: '90%', timeStr: '6h 45 min', isHighlighted: true },
    { day: 'Fr', dayAr: 'جمعة', hours: 1.5, height: '22%', timeStr: '1h 30 min' },
    { day: 'Sa', dayAr: 'سبت', hours: 4.9, height: '65%', timeStr: '4h 55 min' },
  ];

  return (
    <div className="w-full p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 select-none font-arabic">
      {/* ================= VIEW SELECTOR TABS ================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveViewTab('dashboard')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeViewTab === 'dashboard'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{locale === 'ar' ? 'لوحة التحكم الرئيسية' : 'Tableau de Bord'}</span>
        </button>

        <button
          onClick={() => setActiveViewTab('bot')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeViewTab === 'bot'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Bot className="w-4 h-4 text-lime-600 dark:text-gold-400" />
          <span>{t('nav.bot')}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-lime-400/20 text-lime-700 dark:text-lime-300 text-[10px] font-mono font-bold">
            7-Steps
          </span>
        </button>

        <button
          onClick={() => setActiveViewTab('ambassadors')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeViewTab === 'ambassadors'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{t('nav.ambassadors')}</span>
        </button>

        <button
          onClick={() => setActiveViewTab('hierarchy')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeViewTab === 'hierarchy'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span>{t('nav.hierarchy')}</span>
        </button>
      </div>

      {/* ================= TAB 1: MAIN EDUPLEX BENTO DASHBOARD ================= */}
      {activeViewTab === 'dashboard' && (
        <div className="space-y-6 sm:space-y-8">
          {/* ----------------- ROW 1: POPULAR MODULES + GO PREMIUM HERO CARD ----------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
            {/* Left 8 Cols: Popular Courses / Modules */}
            <div className="lg:col-span-8 space-y-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {t('dashboard.popularCourses')}
                </h2>
                <Link
                  href={`/${locale}/bot`}
                  className="text-xs font-bold text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
                >
                  <span>{t('dashboard.viewAll')}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </Link>
              </div>

              {/* 3 Course Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
                {/* Module 1: Algorithmique */}
                <div className="p-4 sm:p-4.5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-lime-400/80 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                          Algorithmique 1
                        </h3>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400">
                          15 Lessons & Exams
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-gray-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9</span>
                    </div>
                    <span className="text-slate-500 dark:text-gray-400 font-semibold truncate max-w-[90px]">
                      L1 MI / ST
                    </span>
                  </div>
                </div>

                {/* Module 2: Analyse Mathématique */}
                <div className="p-4 sm:p-4.5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-lime-400/80 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-lime-100 dark:bg-lime-500/15 text-lime-800 dark:text-lime-300 flex items-center justify-center font-bold shrink-0">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-lime-600 dark:group-hover:text-lime-400">
                          Analyse 1 & Algèbre
                        </h3>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400">
                          18 Lessons & Exams
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-gray-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>5.0</span>
                    </div>
                    <span className="text-slate-500 dark:text-gray-400 font-semibold truncate max-w-[90px]">
                      USTHB / USTO
                    </span>
                  </div>
                </div>

                {/* Module 3: BAC Mathématiques & Physique */}
                <div className="p-4 sm:p-4.5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200/90 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-lime-400/80 transition-all flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                          BAC Sciences & Math
                        </h3>
                        <span className="text-[10px] text-slate-500 dark:text-gray-400">
                          24 Sujets Corrigés
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-gray-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>4.8</span>
                    </div>
                    <span className="text-slate-500 dark:text-gray-400 font-semibold truncate max-w-[90px]">
                      Terminale 3AS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: "Go Premium" or "VIP Active" Card */}
            {!isGold ? (
              <div className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-[#10182E] via-[#0B1020] to-[#060914] text-white p-5 sm:p-6 shadow-xl border border-gold-500/30 flex flex-col justify-between relative overflow-hidden">
                {/* Background ambient lighting */}
                <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-gold-500/10 blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400 font-bold">
                      DZ PRIME VIP
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center">
                      <Crown className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-white leading-snug">
                    {t('dashboard.goPremiumTitle')}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                    {t('dashboard.goPremiumDesc')}
                  </p>
                </div>

                <div className="mt-5 relative z-10">
                  <button
                    onClick={() => setIsUpgradeModalOpen(true)}
                    className="w-full py-2.5 sm:py-3 rounded-2xl bg-[#D9F99D] hover:bg-[#bef264] text-slate-950 font-black text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 touch-target"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>{t('dashboard.getAccess')}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-gold-950/70 via-navy-900 to-[#060914] text-white p-5 sm:p-6 shadow-xl border-2 border-gold-500/50 flex flex-col justify-between relative overflow-hidden">
                {/* Golden ambient glow */}
                <div className="absolute top-0 right-0 w-36 h-36 rounded-full bg-gold-500/20 blur-2xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-mono text-[10px] font-black tracking-wider uppercase border border-gold-400/40">
                      ✓ VIP GOLD ACTIVE
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gold-500/25 border border-gold-400/50 text-gold-300 flex items-center justify-center shadow-gold-glow">
                      <Crown className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-transparent bg-gradient-to-r from-white via-gold-200 to-gold-400 bg-clip-text leading-snug">
                    {locale === 'ar'
                      ? 'عضويتك الذهبية مفعلة بنجاح ✨'
                      : locale === 'fr'
                      ? 'Accès VIP Gold Actif ✨'
                      : 'VIP Gold Access Active ✨'}
                  </h3>

                  <div className="mt-2.5 space-y-1.5 text-[11px] text-gray-200">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{locale === 'ar' ? 'تحميل غير محدود لكافة مواضيع وحلول الامتحانات' : 'Téléchargements illimités de tous les sujets'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{locale === 'ar' ? 'بطاقة العضوية الرقمية المعتمدة نشطة' : 'Carte d\'adhésion digitale vérifiée'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{locale === 'ar' ? 'أولوية حضور ورشات ومراجعات الولايات' : 'Accès prioritaire aux masterclasses'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 relative z-10">
                  <Link
                    href={`/${locale}/card`}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs shadow-gold-glow active:scale-95 transition-all flex items-center justify-center gap-2 touch-target"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{locale === 'ar' ? 'معاينة بطاقتي الرقمية 💳' : 'Voir Ma Carte Digitale 💳'}</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ----------------- ROW 2: HOURS ACTIVITY + DAILY SCHEDULE + CALENDAR ----------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Left 4 Cols: Hours Activity Bar Chart */}
            <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col justify-between min-h-[340px]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {t('dashboard.hoursActivity')}
                  </h3>

                  <select
                    value={hoursFilter}
                    onChange={(e) => setHoursFilter(e.target.value as any)}
                    className="text-[11px] font-bold px-2 py-1 rounded-xl bg-slate-100 dark:bg-navy-850 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-gray-300 focus:outline-none"
                  >
                    <option value="weekly">{t('dashboard.weekly')}</option>
                    <option value="monthly">{t('dashboard.monthly')}</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mb-6">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{t('dashboard.weeklyIncrease')}</span>
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="relative pt-6 pb-2">
                {/* Active Bar Tooltip */}
                {hoveredBarIndex !== null && (
                  <div
                    className="absolute -top-3 px-2.5 py-1 rounded-xl bg-slate-950 text-white text-[10px] font-bold shadow-lg transition-all duration-200 pointer-events-none"
                    style={{
                      left: `${(hoveredBarIndex / (activityData.length - 1)) * 75 + 10}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    <span>{activityData[hoveredBarIndex].timeStr}</span>
                  </div>
                )}

                {/* Bars */}
                <div className="flex items-end justify-between gap-2 h-44 px-2 border-b border-slate-100 dark:border-slate-800">
                  {activityData.map((item, idx) => {
                    const isHovered = hoveredBarIndex === idx;
                    return (
                      <div
                        key={item.day}
                        onMouseEnter={() => setHoveredBarIndex(idx)}
                        className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                      >
                        <div className="w-full max-w-[28px] h-36 flex items-end justify-center">
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: item.height }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className={`w-full rounded-t-xl transition-all duration-200 ${
                              isHovered || item.isHighlighted
                                ? 'bg-gradient-to-t from-lime-500 to-lime-300 dark:from-gold-600 dark:to-gold-400 shadow-sm'
                                : 'bg-slate-850 dark:bg-slate-700 group-hover:bg-slate-700'
                            }`}
                          />
                        </div>
                        <span className={`text-[10px] font-bold font-mono ${isHovered ? 'text-slate-950 dark:text-white' : 'text-slate-400'}`}>
                          {locale === 'ar' ? item.dayAr : item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Middle 4 Cols: Daily Schedule */}
            <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col justify-between min-h-[340px]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {t('dashboard.dailySchedule')}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-850 text-slate-600 dark:text-gray-400 text-[10px] font-bold font-mono">
                    4 Today
                  </span>
                </div>

                {/* Schedule Items List */}
                <div className="space-y-3">
                  {[
                    { title: 'Analyse 1 Revision', sub: 'Amphi C • Pr. Kadri', time: '09:00 - 11:00', icon: BookOpen, color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' },
                    { title: 'Algorithmique TP Lab', sub: 'Lab 04 • Zoom Online', time: '11:30 - 13:00', icon: Bot, color: 'bg-lime-100 text-lime-700 dark:bg-lime-500/20 dark:text-lime-400' },
                    { title: 'Physique 1 Mécanique', sub: 'Salle 12 • USTHB', time: '14:00 - 15:30', icon: Zap, color: 'bg-purple-100 text-purple-700 dark:text-purple-400' },
                    { title: 'BAC Live Workshop', sub: 'National Live Stream', time: '17:00 - 18:30', icon: Award, color: 'bg-emerald-100 text-emerald-700 dark:text-emerald-400' },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-100 dark:border-slate-800/70 hover:border-lime-400/60 transition-all flex items-center justify-between gap-3 group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-lime-600 dark:group-hover:text-gold-300">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate">
                              {item.sub}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-all shrink-0 ${isRtl ? 'rotate-180' : ''}`} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Interactive Academic Calendar */}
            <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col justify-between min-h-[340px]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <button className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-850 text-slate-600 dark:text-gray-400">
                    <ChevronLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white font-sans">
                    August, 2026
                  </h3>
                  <button className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-navy-850 text-slate-600 dark:text-gray-400">
                    <ChevronRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {/* Weekday headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold font-mono text-slate-400 mb-2">
                  <span>S</span>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center font-mono text-xs">
                  {calendarDays.map((item, idx) => {
                    const isSelected = selectedCalendarDay === item.day && item.isCurrentMonth;
                    return (
                      <button
                        key={idx}
                        onClick={() => item.isCurrentMonth && setSelectedCalendarDay(item.day)}
                        className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-[11px] font-bold transition-all relative ${
                          isSelected
                            ? 'bg-[#D9F99D] text-slate-950 font-black shadow-sm'
                            : item.isToday
                            ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 font-black'
                            : item.isCurrentMonth
                            ? 'text-slate-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-navy-800'
                            : 'text-slate-300 dark:text-gray-600'
                        }`}
                      >
                        <span>{item.day}</span>
                        {item.hasEvent && !isSelected && (
                          <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-lime-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Day Milestone Callout */}
              <div className="mt-4 p-2.5 rounded-2xl bg-slate-50 dark:bg-navy-900/80 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime-500" />
                  <span className="font-bold text-slate-800 dark:text-white">
                    Exam Revision Day
                  </span>
                </div>
                <span className="text-slate-500 dark:text-gray-400 font-mono">
                  Aug {selectedCalendarDay}
                </span>
              </div>
            </div>
          </div>

          {/* ----------------- ROW 3: COURSES YOU'RE TAKING + ASSIGNMENTS & EXAMS ----------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Left 7 Cols: Courses You're Taking */}
            <div className="lg:col-span-7 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {t('dashboard.coursesTaking')}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-gray-300 text-xs font-bold">
                    Active ▾
                  </span>
                  <Link
                    href={`/${locale}/bot`}
                    className="w-6 h-6 rounded-full bg-[#D9F99D] text-slate-950 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
                    title="Add Course"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-3">
                {[
                  {
                    title: 'Algorithmique & Structures de Données L1',
                    instructor: 'Dr. Kadri • USTHB',
                    remaining: '8h 45 min',
                    progress: 45,
                    color: 'text-purple-600 dark:text-purple-400',
                    bgColor: 'bg-purple-100 dark:bg-purple-500/15',
                  },
                  {
                    title: 'Analyse Mathématique & Séries 1',
                    instructor: 'Pr. Benali • Faculté ST',
                    remaining: '18h 12 min',
                    progress: 75,
                    color: 'text-lime-600 dark:text-lime-400',
                    bgColor: 'bg-lime-100 dark:bg-lime-500/15',
                  },
                  {
                    title: 'Physique 1: Mécanique du Point & Énergie',
                    instructor: 'Ambassador Alger',
                    remaining: '4h 30 min',
                    progress: 90,
                    color: 'text-amber-600 dark:text-amber-400',
                    bgColor: 'bg-amber-100 dark:bg-amber-500/15',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl ${item.bgColor} ${item.color} flex items-center justify-center shrink-0 font-bold`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-gray-400 truncate mt-0.5">
                          {item.instructor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                      <div className="text-left font-mono">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">
                          {t('dashboard.remaining')}
                        </span>
                        <span className="text-xs font-bold text-slate-800 dark:text-gray-200">
                          {item.remaining}
                        </span>
                      </div>

                      {/* Progress Meter */}
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 relative flex items-center justify-center font-mono text-[11px] font-black text-slate-900 dark:text-white">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-slate-200 dark:text-slate-800"
                              strokeWidth="3"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="text-lime-500 dark:text-gold-400"
                              strokeDasharray={`${item.progress}, 100`}
                              strokeWidth="3"
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="absolute">{item.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Assignments & Exams */}
            <div className="lg:col-span-5 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {t('dashboard.assignments')}
                </h3>

                <Link
                  href={`/${locale}/bot`}
                  className="w-6 h-6 rounded-full bg-slate-100 dark:bg-navy-850 hover:bg-[#D9F99D] hover:text-slate-950 text-slate-700 dark:text-gray-300 flex items-center justify-center transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Assignment Items */}
              <div className="space-y-3">
                {[
                  {
                    title: 'EMD 1 Algorithmique 2024',
                    date: '02 July, 10:30 AM',
                    status: t('dashboard.inProgress'),
                    statusColor: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
                    icon: FileText,
                  },
                  {
                    title: 'Examen Final Analyse 1 USTHB',
                    date: '14 June, 12:45 AM',
                    status: t('dashboard.completed'),
                    statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
                    icon: CheckCircle2,
                  },
                  {
                    title: 'BAC 2024 Mathématiques Corrigé',
                    date: '12 May, 11:00 AM',
                    status: t('dashboard.upcoming'),
                    statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
                    icon: Award,
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 group hover:border-lime-400/60 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-gray-700 text-slate-800 dark:text-gold-300 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-lime-600 dark:group-hover:text-gold-300">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono mt-0.5">
                            {item.date}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SMART DECISION TREE BOT ================= */}
      {activeViewTab === 'bot' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center max-w-2xl mx-auto mb-4">
            <span className="px-3.5 py-1 rounded-full bg-lime-400/20 text-lime-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider font-mono">
              7-STEP ARCHIVE CHOOSER
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {t('bot.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1">
              {t('bot.subtitle')}
            </p>
          </div>

          <DecisionTreeBot />
        </motion.div>
      )}

      {/* ================= TAB 3: AMBASSADORS NETWORK ================= */}
      {activeViewTab === 'ambassadors' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
              {t('hierarchy.ambassadorsNetwork')}
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {locale === 'ar' ? 'شبكة السفراء الأكاديميين في 58 ولاية' : 'Réseau National des Ambassadeurs'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1">
              {t('hierarchy.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {AMBASSADORS.map((amb) => {
              const bio = getLocalizedAmbassadorBio(amb, locale);
              return (
                <div
                  key={amb.id}
                  className="p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C1428] shadow-sm flex flex-col justify-between group hover:border-lime-400 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500/15 text-gold-700 dark:text-gold-300 text-xs font-bold font-mono">
                        <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                        <span>{amb.ratingAverage} / 5.0</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        {t('brand.verifiedAmbassador')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-gold-300">
                      {amb.user.name}
                    </h3>
                    <p className="text-xs text-gold-700 dark:text-gold-400 mt-0.5 font-semibold">
                      {amb.institutionNameAr}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-gray-300 mt-2.5 leading-relaxed">
                      {bio}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 font-mono">
                    <span>{amb.ratingsCount} reviews</span>
                    <span className="text-lime-700 dark:text-gold-300 font-bold">{amb.upcomingSessionsCount} sessions</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ================= TAB 4: HIERARCHY & GOVERNANCE ================= */}
      {activeViewTab === 'hierarchy' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <HierarchyChart />
        </motion.div>
      )}

      {/* Upgrade VIP Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
