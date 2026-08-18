'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Bot,
  CreditCard,
  GraduationCap,
  Building2,
  Calendar,
  Star,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Compass,
  Award,
  Video,
  Send,
  MapPin,
  Flame,
  Zap,
  Clock,
  TrendingUp,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { DzPrimeLogo } from '@/components/shared/DzPrimeLogo';
import { DecisionTreeBot } from '@/components/bot/DecisionTreeBot';
import { MembershipCard } from '@/components/card/MembershipCard';
import { HierarchyChart } from '@/components/dashboard/HierarchyChart';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import {
  AMBASSADORS,
  RECENT_POSTS,
  WILAYAS,
  EXAMS,
  getLocalizedAmbassadorBio,
  getLocalizedWilayaName,
} from '@/lib/initial-data';

export default function HomePage() {
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="w-full space-y-16 sm:space-y-24 pb-24 overflow-hidden">
      {/* ================= 1. HERO & GEN-Z STUDY BENTO ================= */}
      <section className="relative pt-10 pb-12 lg:pt-16 lg:pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[350px] bg-gradient-to-tr from-amber-400/15 via-gold-500/10 dark:from-gold-500/15 dark:via-dzBlue-neon/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 dark:bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-gold-400 animate-pulse" />
            <span className="font-arabic">{t('hero.badge')}</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black font-arabic tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            {t('hero.titlePrefix')}{' '}
            <span className="block mt-2 text-gold-gradient font-sans">
              DZ PRIME ACADEMY
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-gray-300 font-arabic max-w-3xl leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3.5"
          >
            <a
              href="#bot-section"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs sm:text-sm font-arabic flex items-center gap-2 shadow-gold-glow hover:shadow-gold-glow-lg transition-all active:scale-95"
            >
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{t('hero.ctaPrimary')}</span>
              <ArrowIcon className="w-4 h-4" />
            </a>

            <Link
              href={`/${locale}/card`}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-navy-850 hover:bg-slate-50 dark:hover:bg-navy-800 border border-slate-300 dark:border-gold-500/40 text-slate-800 dark:text-gold-300 font-bold text-xs sm:text-sm font-arabic flex items-center gap-2 transition-all shadow-sm active:scale-95"
            >
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600 dark:text-gold-400" />
              <span>{t('hero.ctaSecondary')}</span>
            </Link>
          </motion.div>
        </div>

        {/* Gen-Z Gamified Streak & Study Stats Bento Bar */}
        <div className="mt-12 max-w-5xl mx-auto p-4 rounded-3xl border border-slate-200 dark:border-gold-500/20 bg-white/80 dark:bg-navy-900/60 backdrop-blur-xl shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850/80 border border-slate-200/80 dark:border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div className="text-left font-sans">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">
                  {t('genz.streak')}
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {t('genz.streakDays')}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850/80 border border-slate-200/80 dark:border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-left font-sans">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">
                  Honor Level
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {t('genz.xpPoints')}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850/80 border border-slate-200/80 dark:border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left font-sans">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">
                  Exam Papers
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {t('hero.statsExams')}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850/80 border border-slate-200/80 dark:border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left font-sans">
                <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">
                  National Coverage
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  {t('hero.statsWilayas')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. INTERACTIVE EXAM BOT SECTION ================= */}
      <section id="bot-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="px-4 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-xs font-bold uppercase tracking-wider font-arabic">
            NO TEXT INPUT REQUIRED • STEP-BY-STEP
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-arabic text-slate-900 dark:text-white mt-3">
            {t('bot.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic mt-2 max-w-xl mx-auto">
            {t('bot.subtitle')}
          </p>
        </div>

        <DecisionTreeBot isFloating={false} />
      </section>

      {/* ================= 3. MEMBERSHIP CARD SHOWCASE (Image 2) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-12 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-gradient-to-br dark:from-navy-900 dark:via-navy-950 dark:to-[#040711] shadow-xl relative overflow-hidden transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5 text-left font-arabic">
              <span className="px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-700 dark:text-gold-300 text-xs font-bold font-arabic">
                {t('brand.membershipCard')}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-arabic text-slate-900 dark:text-white leading-tight">
                {t('card.title')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic leading-relaxed">
                {t('card.subtitle')}
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-gray-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{t('card.verifiedBadge')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{t('card.verifyCard')}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{t('card.downloadPng')}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${locale}/card`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs font-arabic shadow-gold-glow active:scale-95 transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{t('card.customizerTitle')}</span>
                </Link>
              </div>
            </div>

            {/* Interactive Card Preview */}
            <div className="flex justify-center">
              <MembershipCard user={currentUser} allowExport={true} />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4. PRE-SCHOOL ROADMAP & ECOSYSTEM (Image 3) ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="px-4 py-1 rounded-full bg-amber-500/10 dark:bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-xs font-bold font-arabic">
            ROADMAP & TIMELINE
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-arabic text-slate-900 dark:text-white mt-3">
            {t('roadmap.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic mt-2">
            {t('roadmap.subtitle')}
          </p>
        </div>

        {/* 8 Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { num: '1', title: t('roadmap.step1'), desc: t('roadmap.step1Desc') },
            { num: '2', title: t('roadmap.step2'), desc: t('roadmap.step2Desc') },
            { num: '3', title: t('roadmap.step3'), desc: t('roadmap.step3Desc') },
            { num: '4', title: t('roadmap.step4'), desc: t('roadmap.step4Desc') },
            { num: '5', title: t('roadmap.step5'), desc: t('roadmap.step5Desc') },
            { num: '6', title: t('roadmap.step6'), desc: t('roadmap.step6Desc') },
            { num: '7', title: t('roadmap.step7'), desc: t('roadmap.step7Desc') },
            { num: '8', title: t('roadmap.step8'), desc: t('roadmap.step8Desc') },
          ].map((st, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl border border-slate-200 dark:border-gold-500/20 bg-white dark:bg-navy-900/80 hover:border-gold-500 transition-all flex flex-col items-center text-center shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-gold-500 text-navy-950 font-mono font-black text-xs flex items-center justify-center mb-2 shadow-sm">
                {st.num}
              </div>
              <h4 className="text-[11px] font-bold font-arabic text-slate-900 dark:text-white line-clamp-2">
                {st.title}
              </h4>
              <p className="text-[9px] text-slate-500 dark:text-gray-400 font-arabic mt-1">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 5. AMBASSADORS NETWORK (Image 3) ================= */}
      <section id="ambassadors" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="px-4 py-1 rounded-full bg-amber-500/10 dark:bg-gold-500/10 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-xs font-bold font-arabic">
            {t('hierarchy.ambassadorsNetwork')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-arabic text-slate-900 dark:text-white mt-3">
            {locale === 'ar'
              ? 'نخبة من خيرة طلبة وسفراء الجزائر في خدمتك'
              : locale === 'fr'
              ? 'Le Réseau des Meilleurs Ambassadeurs Universitaires'
              : 'Top University Ambassadors Across Algeria'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic mt-2">
            {t('hierarchy.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {AMBASSADORS.map((amb) => {
            const bio = getLocalizedAmbassadorBio(amb, locale);
            return (
              <div
                key={amb.id}
                className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-gradient-to-b dark:from-navy-850 dark:to-navy-900 shadow-md flex flex-col justify-between text-left relative overflow-hidden group hover:border-gold-500 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-xs font-bold font-mono">
                      <Star className="w-3.5 h-3.5 fill-gold-500 text-gold-500" />
                      <span>{amb.ratingAverage} / 5.0</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold font-arabic">
                      {t('brand.verifiedAmbassador')}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-arabic text-slate-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-200">
                    {amb.user.name}
                  </h3>
                  <p className="text-xs text-gold-700 dark:text-gold-400 font-arabic mt-0.5">
                    {amb.institutionNameAr}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-gray-300 font-arabic mt-3 leading-relaxed">
                    {bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between text-xs font-arabic text-slate-500 dark:text-gray-400">
                  <span>{amb.ratingsCount} {t('dashboards.ambassador.reviewsCount')}</span>
                  <span className="text-gold-700 dark:text-gold-300 font-bold">{amb.upcomingSessionsCount} {t('dashboards.ambassador.scheduledSessions')}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 6. ADMINISTRATIVE HIERARCHY (Image 1) ================= */}
      <section id="hierarchy" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HierarchyChart />
      </section>
    </div>
  );
}
