'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import {
  Rocket,
  Sparkles,
  Play,
  Clock,
  Award,
  BookOpen,
  Users,
  Star,
  Code2,
  Briefcase,
  Stethoscope,
  GraduationCap,
  LineChart,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthModal } from '@/lib/authModalContext';
import { MagneticButton } from './MagneticButton';
import { LandingPageConfig } from '@/lib/landingConfig';

const HERO_COPY = {
  ar: {
    badge: 'المنصة التعليمية والمالية رقم 1 في الجزائر 2026',
    titleLead: 'تعلّم باحتراف.',
    titleHighlight: 'اصنع',
    titleEnd: 'مستقبلك.',
    sub: 'مقررات جامعية، تحضير شامل للبكالوريا، ملخصات ذكية وبنك امتحانات رسمي لمساعدتك على التفوق الأكاديمي عبر 58 ولاية.',
    ctaPrimary: 'استكشف المقاييس',
    ctaSecondary: 'شاهد العرض التقديمي',
    statCourses: '10K+',
    statCoursesLabel: 'مقياس وامتحان',
    statStudents: '50K+',
    statStudentsLabel: 'طالب مسجل',
    statRating: '4.9',
    statRatingLabel: '(2.3K تقييم)',
    paceCardTitle: 'تعلّم بمرونتك وسرعتك',
    paceCardSub: 'دروس وملخصات متوفرة 24/7',
    certCardTitle: 'شهادات وبنك امتحانات',
    certCardSub: 'حلول نموذجية وشبكة سفراء 58 ولاية',
  },
  fr: {
    badge: 'Plateforme Éducative & Fintech N°1 en Algérie 2026',
    titleLead: 'Apprenez tout.',
    titleHighlight: 'Bâtissez',
    titleEnd: 'votre avenir.',
    sub: 'Des modules universitaires, préparation complète au BAC, résumés intelligents et annales corrigées pour exceller dans les 58 wilayas.',
    ctaPrimary: 'Explorer les Cours',
    ctaSecondary: 'Voir la Démo',
    statCourses: '10K+',
    statCoursesLabel: 'Cours & Annales',
    statStudents: '50K+',
    statStudentsLabel: 'Étudiants Actifs',
    statRating: '4.9',
    statRatingLabel: '(2.3K avis)',
    paceCardTitle: 'Apprenez à votre rythme',
    paceCardSub: 'Accès 24/7 partout en Algérie',
    certCardTitle: 'Certifications & Examens',
    certCardSub: 'Corrigés types et réseau 58 wilayas',
  },
  en: {
    badge: "Algeria's #1 EdTech & Fintech Platform 2026",
    titleLead: 'Learn new skills.',
    titleHighlight: 'Shape',
    titleEnd: 'your future.',
    sub: 'University modules, comprehensive BAC prep, smart cheat-sheets, and verified exam archives to help you excel across all 58 wilayas.',
    ctaPrimary: 'Explore Courses',
    ctaSecondary: 'Watch intro',
    statCourses: '10K+',
    statCoursesLabel: 'Courses & Exams',
    statStudents: '50K+',
    statStudentsLabel: 'Active Students',
    statRating: '4.9',
    statRatingLabel: '(2.3K reviews)',
    paceCardTitle: 'Learn at your pace',
    paceCardSub: 'Access courses anytime, anywhere',
    certCardTitle: 'Certified Diplomas & Packs',
    certCardSub: 'Official solutions & 58-wilaya network',
  },
};

const CATEGORIES = [
  { id: 'dev', labelAr: 'البرمجة والإعلام الآلي', labelFr: 'Informatique & Dev', icon: Code2, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'business', labelAr: 'إدارة الأعمال والاقتصاد', labelFr: 'Économie & Gestion', icon: Briefcase, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'health', labelAr: 'العلوم الطبية والصحة', labelFr: 'Médecine & Santé', icon: Stethoscope, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  { id: 'bac', labelAr: 'بكالوريا 2026 جميع الشعب', labelFr: 'BAC 2026 Toutes Filières', icon: GraduationCap, color: 'text-gold-400 bg-gold-500/10 border-gold-500/30' },
  { id: 'data', labelAr: 'علم البيانات والذكاء الاصطناعي', labelFr: 'Data Science & IA', icon: LineChart, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
];

export const LandingHero: React.FC = () => {
  const { locale, isRtl } = useTranslation();
  const { openAuth } = useAuthModal();
  const heroRef = useRef<HTMLDivElement>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [dynamicConfig, setDynamicConfig] = useState<LandingPageConfig | null>(null);

  useEffect(() => {
    fetch('/api/settings/landing')
      .then((res) => res.json())
      .then((data) => {
        if (data?.config) {
          setDynamicConfig(data.config);
        }
      })
      .catch(() => {});
  }, []);

  const baseCopy = HERO_COPY[locale] || HERO_COPY.ar;
  const c = {
    ...baseCopy,
    badge: (locale === 'ar' ? dynamicConfig?.hero?.badgeAr : dynamicConfig?.hero?.badgeFr) || baseCopy.badge,
    titleLead: (locale === 'ar' ? dynamicConfig?.hero?.titleLeadAr : dynamicConfig?.hero?.titleLeadFr) || baseCopy.titleLead,
    titleHighlight: (locale === 'ar' ? dynamicConfig?.hero?.titleHighlightAr : dynamicConfig?.hero?.titleHighlightFr) || baseCopy.titleHighlight,
    titleEnd: (locale === 'ar' ? dynamicConfig?.hero?.titleEndAr : dynamicConfig?.hero?.titleEndFr) || baseCopy.titleEnd,
    sub: (locale === 'ar' ? dynamicConfig?.hero?.subAr : dynamicConfig?.hero?.subFr) || baseCopy.sub,
    ctaPrimary: (locale === 'ar' ? dynamicConfig?.hero?.ctaPrimaryAr : dynamicConfig?.hero?.ctaPrimaryFr) || baseCopy.ctaPrimary,
  };

  useEffect(() => {
    if (!heroRef.current) return;
    const els = heroRef.current.querySelectorAll('[data-gsap]');
    gsap.fromTo(els, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1 });
  }, []);

  return (
    <section ref={heroRef} className="relative px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8" data-testid="landing-hero">
      {/* Main 2-Column Hero Card (Learnova Inspired with DZ Prime Luxury Palette) */}
      <div className="max-w-7xl mx-auto rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-[#FAF7F2] dark:bg-[#080D1D] relative overflow-hidden p-6 sm:p-10 lg:p-14 shadow-xl">
        {/* Decorative Ambient Background Blurs */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gold-500/20 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/15 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:24px_24px]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          {/* ================= LEFT COLUMN: COPY & CALL TO ACTIONS ================= */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left rtl:text-right">
            {/* Top Badge */}
            <div
              data-gsap
              data-testid="landing-hero-badge"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/10 border border-amber-300/80 dark:border-gold-500/30 shadow-sm text-xs font-bold text-slate-800 dark:text-gold-300 font-arabic"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>{c.badge}</span>
            </div>

            {/* Main Headline (Learnova Style with Pure Royal Gold) */}
            <h1
              data-gsap
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-slate-950 dark:text-white font-arabic"
            >
              <span>{c.titleLead}</span>
              <br />
              <span className="relative inline-block mt-1">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 dark:from-gold-300 dark:via-yellow-300 dark:to-gold-400 drop-shadow-sm">
                  {c.titleHighlight}
                </span>
                {/* Hand-drawn style decorative underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-gold-500 dark:text-gold-400 opacity-90"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path d="M0,8 Q50,0 100,7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{' '}
              <span>{c.titleEnd}</span>
            </h1>

            {/* Subtitle Description */}
            <p
              data-gsap
              className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-arabic"
            >
              {c.sub}
            </p>

            {/* Action Buttons Row (Learnova Style with Royal Gold) */}
            <div data-gsap className="flex flex-wrap items-center gap-3.5 pt-2">
              <MagneticButton
                data-testid="landing-cta-register"
                onClick={() => openAuth('register')}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-yellow-400 hover:from-gold-400 hover:to-yellow-300 text-navy-950 font-black text-sm shadow-xl shadow-gold-500/25 flex items-center gap-2 group transition-all"
              >
                <span>{c.ctaPrimary}</span>
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-navy-950 font-black" />
                ) : (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-navy-950 font-black" />
                )}
              </MagneticButton>

              <button
                onClick={() => setShowVideoModal(true)}
                data-testid="landing-cta-video"
                className="px-5 py-3.5 rounded-2xl bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/15 border border-slate-200 dark:border-gold-500/30 text-slate-800 dark:text-white font-bold text-sm flex items-center gap-2.5 transition-all shadow-sm group"
              >
                <div className="w-6 h-6 rounded-full bg-gold-500/20 text-gold-600 dark:text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>{c.ctaSecondary}</span>
              </button>
            </div>

            {/* Statistics Row (Learnova Style 3-Stats Block) */}
            <div
              data-gsap
              className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-white/10 max-w-lg"
            >
              {/* Stat 1 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono leading-none">
                    {c.statCourses}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {c.statCoursesLabel}
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono leading-none">
                    {c.statStudents}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {c.statStudentsLabel}
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gold-500/15 border border-gold-500/30 text-gold-600 dark:text-gold-400 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono leading-none">
                    {c.statRating}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {c.statRatingLabel}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: LEARNOVA ARTWORK & REAL STUDENT ================= */}
          <div data-gsap className="lg:col-span-5 relative flex items-center justify-center pt-6 lg:pt-0">
            {/* Playful Doodles (Spiral & Sparks) */}
            <div className="absolute -top-4 left-6 text-purple-400/80 animate-pulse pointer-events-none hidden sm:block">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20C15 10 25 10 30 20C35 30 25 35 15 30" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="absolute top-12 right-2 text-rose-400 pointer-events-none hidden sm:block">
              <Sparkles className="w-6 h-6" />
            </div>

            {/* Organic Arch / Sunburst Backdrop (Matching Learnova) */}
            <div className="relative w-[300px] sm:w-[380px] lg:w-[410px] h-[360px] sm:h-[450px] flex items-end justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 via-gold-400 to-yellow-300 dark:from-amber-600 dark:via-gold-500 dark:to-yellow-400 rounded-t-[10rem] rounded-b-[3rem] shadow-2xl overflow-hidden">
                {/* Decorative Sunburst Rays Pattern */}
                <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_50%_0%,white_15%,transparent_70%)]" />
              </div>

              {/* Real Student Image Cutout */}
              <div className="relative z-10 w-full h-full flex items-end justify-center">
                <img
                  src="/images/hero-student.png"
                  alt="DZ Prime Academy Student"
                  className="h-[92%] object-contain object-bottom drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Badge 1: Top Right "Learn at your pace" (Learnova Style) */}
              <div className="absolute -top-3 -right-3 sm:-right-6 z-20 p-3 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-[#0F172E]/95 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl flex items-center gap-3 animate-float max-w-[210px]">
                <div className="w-8 h-8 rounded-xl bg-purple-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left rtl:text-right">
                  <div className="text-xs font-black text-slate-900 dark:text-white leading-tight font-arabic">
                    {c.paceCardTitle}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-arabic leading-tight mt-0.5">
                    {c.paceCardSub}
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Bottom Left "Certificate / Certified" (Learnova Style) */}
              <div className="absolute -bottom-3 -left-3 sm:-left-6 z-20 p-3 sm:p-3.5 rounded-2xl bg-white/95 dark:bg-[#0F172E]/95 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl flex items-center gap-3 animate-float max-w-[230px]">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-left rtl:text-right">
                  <div className="text-xs font-black text-slate-900 dark:text-white leading-tight font-arabic">
                    {c.certCardTitle}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-arabic leading-tight mt-0.5">
                    {c.certCardSub}
                  </div>
                </div>
              </div>

              {/* Bottom Decorative Leaf / Accent Shape */}
              <div className="absolute -bottom-2 -right-4 w-16 h-12 bg-emerald-500/80 rounded-full rounded-tr-none -rotate-12 blur-[1px] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ================= CATEGORY PILLS BAR (Learnova Ribbon Style) ================= */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <a
                  key={cat.id}
                  href="#courses-explorer"
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap border hover:scale-105 shadow-sm ${cat.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{locale === 'ar' ? cat.labelAr : cat.labelFr}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Video Demo Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#0D1429] border border-slate-200 dark:border-gold-500/30 p-6 space-y-4 shadow-2xl text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-purple-500" />
                <h3 className="font-black text-sm sm:text-base font-arabic">
                  {locale === 'ar' ? 'جولة تعريفية في منصة DZ PRIME ACADEMY' : 'Présentation DZ PRIME ACADEMY'}
                </h3>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-video rounded-2xl bg-black overflow-hidden flex items-center justify-center border border-white/10">
              <div className="text-center space-y-2 p-6">
                <div className="w-14 h-14 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/40 flex items-center justify-center mx-auto animate-pulse">
                  <Play className="w-6 h-6 fill-current ml-0.5" />
                </div>
                <p className="text-xs text-slate-300 font-arabic">
                  {locale === 'ar'
                    ? 'فيديو البث التعريفي، بنك الامتحانات، وبوت الملخصات الذكي 2026'
                    : 'Visite guidée interactive de la plateforme et du bot d\'examens'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
