'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  Video,
  Check,
  Star,
  Bookmark,
  Calendar,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';

export const KnowlyHeroSection: React.FC = () => {
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [isWorkshopSaved, setIsWorkshopSaved] = useState(false);
  const [isEventSaved, setIsEventSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleWorkshop = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isWorkshopSaved;
    setIsWorkshopSaved(newState);
    showToast(
      newState
        ? (locale === 'ar' ? 'تمت إضافة ورشة الرياضيات والفيزياء إلى جدول مراجعتك! 📅' : 'Workshop added to your study calendar! 📅')
        : (locale === 'ar' ? 'تمت إزالة الورشة من الجدول.' : 'Workshop removed from calendar.')
    );
  };

  const handleToggleEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isEventSaved;
    setIsEventSaved(newState);
    showToast(
      newState
        ? (locale === 'ar' ? 'تم تأكيد تذكير التظاهرة العلمية والطبية! 🔔' : 'Event reminder set for Live Meetup! 🔔')
        : (locale === 'ar' ? 'تم إلغاء التذكير.' : 'Event reminder removed.')
    );
  };

  const skillPills = [
    { label: 'BAC Sciences 2026', rotate: '-5deg', bg: 'bg-[#8B5CF6] text-white' },
    { label: 'Algorithmique & C++', rotate: '3deg', bg: 'bg-[#6366F1] text-white' },
    { label: 'QCM Médecine & Résidanat', rotate: '-3deg', bg: 'bg-[#A855F7] text-white' },
    { label: 'BaridiMob RIP 58 Wilayas', rotate: '4deg', bg: 'bg-[#7C3AED] text-white' },
    { label: '58 Wilayas Network', rotate: '-4deg', bg: 'bg-[#9333EA] text-white' },
    { label: 'Google Meet Live 🔴', rotate: '2deg', bg: 'bg-[#6D28D9] text-white' },
    { label: 'Carte Gold VIP', rotate: '-5deg', bg: 'bg-[#7E22CE] text-white' },
    { label: 'Annales & Corrigés 2026', rotate: '3deg', bg: 'bg-[#8B5CF6] text-white' },
  ];

  return (
    <section className="w-full max-w-[1600px] mx-auto font-sans select-none space-y-6">
      {/* ================= 1. MAIN HERO CONTAINER (Deep Matte Dark Canvas) ================= */}
      <div className="relative w-full rounded-[2.5rem] lg:rounded-[3.5rem] bg-[#16131E] border border-white/10 text-white p-6 sm:p-10 md:p-14 lg:p-18 shadow-2xl overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Floating Badge */}
        <div className="flex items-center justify-center mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/15 text-gold-300 text-xs sm:text-sm font-mono font-bold tracking-wide shadow-inner"
          >
            <span className="text-base">🇩🇿</span>
            <span>DZ PRIME ACADEMY • GEN-Z EXCELLENCE 2026</span>
          </motion.div>
        </div>

        {/* ================= GIANT PLAYFUL TYPOGRAPHY HERO ================= */}
        <div className="text-center max-w-6xl mx-auto space-y-4 sm:space-y-6">
          {/* Line 1: Build + Violet Pill + Your */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-6 text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tight text-white leading-none">
            <span className="font-extrabold tracking-tight">
              {locale === 'ar' ? 'ابنِ' : 'Build'}
            </span>

            {/* Violet Pill with Animated Geometric Shapes */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              className="inline-flex items-center gap-2.5 sm:gap-4 px-4 sm:px-7 py-2.5 sm:py-4 rounded-full bg-[#7C3AED] text-white shadow-xl shadow-purple-900/60 cursor-pointer shrink-0"
            >
              {/* Spinning Multi-petal Flower */}
              <motion.svg
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-purple-200 shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a3 3 0 0 0-3 3 3 3 0 0 0-3 3 3 3 0 0 0 0 6 3 3 0 0 0 3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0 3-3 3 3 0 0 0 0-6 3 3 0 0 0-3-3 3 3 0 0 0-3-3z" />
              </motion.svg>

              {/* 4-leaf Clover */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-purple-400/30 rounded-xl flex items-center justify-center text-purple-100 text-sm sm:text-base font-black">
                ✦
              </div>

              {/* Crescent Moon */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-purple-200 flex items-center justify-center text-base sm:text-xl">
                🌙
              </div>
            </motion.div>

            <span className="font-extrabold tracking-tight">
              {locale === 'ar' ? 'مستقبلك' : 'your'}
            </span>
          </div>

          {/* Line 2: Mint Badge + Skills + Yellow Donut Container + Online */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-6 text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.5rem] font-black tracking-tight text-white leading-none pt-2 sm:pt-3">
            {/* Mint Green Squircle Badge */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: 3 }}
              className="w-13 h-13 sm:w-18 sm:h-18 lg:w-22 lg:h-22 rounded-2xl sm:rounded-3xl bg-[#A7F3D0] text-[#064E3B] flex items-center justify-center text-2xl sm:text-4xl shadow-md cursor-pointer shrink-0"
            >
              ✦
            </motion.div>

            <span className="font-extrabold tracking-tight">
              {locale === 'ar' ? 'وتفوّق' : 'skills'}
            </span>

            {/* Sunny Golden Yellow Ring Container */}
            <motion.div
              whileHover={{ scale: 1.08, rotate: -3 }}
              className="w-16 h-13 sm:w-22 sm:h-18 lg:w-26 lg:h-22 rounded-2xl sm:rounded-3xl bg-[#FACC15] text-[#713F12] flex items-center justify-center shadow-md cursor-pointer shrink-0 relative overflow-hidden"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 sm:w-11 sm:h-11 rounded-full border-4 sm:border-6 border-[#713F12] border-t-transparent flex items-center justify-center"
              />
            </motion.div>

            <span className="font-extrabold tracking-tight">
              {locale === 'ar' ? 'بامتياز' : 'online'}
            </span>
          </div>

          {/* Subtitle */}
          <p className="pt-4 sm:pt-6 text-sm sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-arabic font-medium">
            {locale === 'ar'
              ? 'تدرّب وتفوّق في البكالوريا والجامعة مع حصص التحضير المباشرة، بوت الامتحانات الذكي، وشبكة سفراء معتمدين في 58 ولاية.'
              : 'Learn and improve your skills with interactive courses, past exam test banks, and certified ambassadors across 58 wilayas.'}
          </p>
        </div>

        {/* ================= 2. BENTO CARDS ROW 1 (4 Cards matching image) ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6 mt-12 sm:mt-16 items-stretch">
          {/* Card 1: WORKSHOP (Cream / Vanilla Background #FFFDF0) */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="lg:col-span-3 p-6 sm:p-7 rounded-[2rem] bg-[#FFFDE8] text-[#1E1B2E] flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xl border border-yellow-200/80"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/5 text-black text-[11px] font-mono font-black uppercase tracking-wider">
                  WORKSHOP
                </span>

                {/* Interactive Toggle Switch */}
                <div
                  onClick={handleToggleWorkshop}
                  className="flex items-center gap-1.5 cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-gray-600 group-hover:text-black">
                    {locale === 'ar' ? 'إضافة للجدول' : 'Add event'}
                  </span>
                  <div
                    className={`w-10 h-5.5 rounded-full transition-colors flex items-center p-0.5 ${
                      isWorkshopSaved ? 'bg-[#7C3AED] justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-4.5 h-4.5 rounded-full bg-white shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-black leading-snug">
                  {locale === 'ar' ? 'ورشة الفيزياء والرياضيات BAC' : 'Automation Testing Workshop'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1.5">
                  أ. كمال بن عيسى (Greg Jones)
                </p>
              </div>
            </div>

            <Link
              href={`/${locale}/dawarat/pack-bac-science-2026`}
              className="pt-2 text-xs sm:text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
            >
              <span>{locale === 'ar' ? 'عرض تفاصيل الورشة' : 'View Workshop'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Card 2: 100K+ STUDENTS STATS (Electric Violet Background #7C3AED) */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="lg:col-span-2 p-6 sm:p-7 rounded-[2rem] bg-[#7C3AED] text-white flex flex-col justify-between space-y-4 relative overflow-hidden shadow-xl shadow-purple-950/50"
          >
            {/* Overlapping Avatars */}
            <div className="flex items-center -space-x-2 rtl:space-x-reverse">
              {['👨‍🎓', '👩‍⚕️', '👨‍💻', '👩‍🏫'].map((av, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-purple-900 border-2 border-[#7C3AED] text-base flex items-center justify-center shadow-md"
                >
                  <span>{av}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                52K +
              </div>
              <p className="text-xs sm:text-sm text-purple-200 font-medium">
                {locale === 'ar' ? 'طالب ومستفيد عبر 58 ولاية' : 'trained students across 58 wilayas'}
              </p>
            </div>
          </motion.div>

          {/* Card 3: COURSE (Warm Sand / Apricot Background #FEF3C7) */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="lg:col-span-4 p-6 sm:p-7 rounded-[2rem] bg-[#FFF6E5] text-[#1E1B2E] flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xl border border-amber-200/80"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/5 text-black text-[11px] font-mono font-black uppercase tracking-wider">
                  COURSE
                </span>
                <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                  30h Live
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-black leading-snug">
                  {locale === 'ar' ? 'الخوارزميات والبرمجة C++ LMD' : 'Product designer from scratch'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1.5">
                  Beginner • 4-6 months • 15 Sessions
                </p>
              </div>
            </div>

            <Link
              href={`/${locale}/dawarat/pack-univ-informatique-lmd`}
              className="pt-2 text-xs sm:text-sm font-bold text-[#7C3AED] hover:underline flex items-center gap-1"
            >
              <span>{locale === 'ar' ? 'الانضمام للدورة' : 'Enroll Course'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Card 4: EVENT (Mint Green Background #A7F3D0) */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="lg:col-span-3 p-6 sm:p-7 rounded-[2rem] bg-[#A7F3D0] text-[#064E3B] flex flex-col justify-between space-y-6 relative overflow-hidden shadow-xl border border-emerald-300/80"
          >
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-black/5 text-black text-[11px] font-mono font-black uppercase tracking-wider">
                  EVENT
                </span>

                {/* Interactive Toggle Switch */}
                <div
                  onClick={handleToggleEvent}
                  className="flex items-center gap-1.5 cursor-pointer group"
                >
                  <span className="text-[11px] font-bold text-[#064E3B] group-hover:text-black">
                    {locale === 'ar' ? 'تذكير' : 'Add event'}
                  </span>
                  <div
                    className={`w-10 h-5.5 rounded-full transition-colors flex items-center p-0.5 ${
                      isEventSaved ? 'bg-[#064E3B] justify-end' : 'bg-emerald-200 justify-start'
                    }`}
                  >
                    <motion.div
                      layout
                      className="w-4.5 h-4.5 rounded-full bg-white shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#064E3B] leading-snug">
                  {locale === 'ar' ? 'تظاهرة Résidanat Médecine 2026' : 'Tech Meetup DevSum'}
                </h3>
                <p className="text-xs sm:text-sm text-[#064E3B]/80 font-mono font-bold mt-1.5">
                  10/10/2026 - 14/10/2026
                </p>
              </div>
            </div>

            <Link
              href={`/${locale}/dawarat/pack-medecine-1ere-annee`}
              className="pt-2 text-xs sm:text-sm font-bold text-[#064E3B] hover:underline flex items-center gap-1"
            >
              <span>{locale === 'ar' ? 'حجز مقعد مجاني' : 'Register Event'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* ================= 3. BENTO CARDS ROW 2 (Competitive Advantage + Skill Pill Cloud) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 mt-6 items-stretch">
          {/* Left Block: Competitive Advantage (Golden Yellow #FACC15) */}
          <motion.div
            whileHover={{ y: -6, scale: 1.01 }}
            className="lg:col-span-4 p-7 sm:p-9 rounded-[2rem] bg-[#FACC15] text-[#713F12] flex flex-col justify-between space-y-5 relative overflow-hidden shadow-2xl border border-yellow-400"
          >
            <div className="space-y-3 relative z-10">
              <span className="px-3.5 py-1 rounded-full bg-black/10 text-black text-[11px] font-mono font-black uppercase tracking-wider">
                DZ PRIME VALUE
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-black leading-tight">
                {locale === 'ar' ? 'ميزتك التنافسية للتفوق' : 'Competitive Advantage'}
              </h3>
              <p className="text-xs sm:text-sm text-yellow-950 font-medium leading-relaxed font-arabic">
                {locale === 'ar'
                  ? 'برنامج تدريبي مكثف مع أفضل المفتشين والأساتذة المبرزين في الجزائر، مدعوماً ببوت حلول الامتحانات.'
                  : 'Interactive masterclasses with Algeria’s top pedagogical inspectors & AI exam tools.'}
              </p>
            </div>

            <Link
              href={`/${locale}/dawarat`}
              className="px-6 py-3 rounded-2xl bg-navy-950 text-white hover:bg-navy-900 font-black text-xs sm:text-sm transition-all w-fit shadow-lg flex items-center gap-2"
            >
              <span>{locale === 'ar' ? 'استكشف الحزم' : 'Explore All Packs'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Right Block: Floating Interactive Pill Cloud (Deep Matte Obsidian #191624) */}
          <motion.div
            whileHover={{ y: -6 }}
            className="lg:col-span-8 p-7 sm:p-9 rounded-[2rem] bg-[#191624] border border-purple-500/20 text-white flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-mono font-bold text-purple-300">
                ⚡ EXAM TRACKS & TOPICS
              </span>
              <span className="text-xs text-gray-400">
                {locale === 'ar' ? 'انقر على أي مقياس لتصفح المواضيع' : 'Click to explore topics'}
              </span>
            </div>

            {/* Pill Cloud */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-4">
              {skillPills.map((pill, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.12, rotate: 0 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transform: `rotate(${pill.rotate})` }}
                  className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-black font-sans shadow-lg cursor-pointer transition-transform ${pill.bg} hover:ring-2 hover:ring-white`}
                >
                  <Link href={`/${locale}/bot`}>
                    {pill.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400 pt-3 border-t border-white/5 font-arabic">
              <span>58 Wilayas Certified Support</span>
              <Link
                href={`/${locale}/ambassadors`}
                className="text-gold-400 hover:underline font-bold"
              >
                {locale === 'ar' ? 'استعراض شبكة السفراء ←' : 'Browse Ambassador Directory →'}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3.5 rounded-2xl bg-navy-950/95 text-white border border-gold-500/50 shadow-2xl text-xs sm:text-sm font-bold font-arabic flex items-center gap-2.5 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
