'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Rocket, Sparkles } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthModal } from '@/lib/authModalContext';
import { MagneticButton } from './MagneticButton';

const HERO_COPY = {
  ar: {
    badge: 'المنصة الأكاديمية والمالية رقم 1 في الجزائر 2026',
    line1: 'ابن مستقبلك',
    line2Prefix: 'و',
    line2Highlight: 'تفوّق بامتياز',
    sub: 'أجب والتحق بالبكالوريا والجامعة مع حصص التحضير المجانية، بث الدروس المباشر، بوت التوجيه الذكي، وشبكة سفراء معتمدين في 58 ولاية.',
    ctaPrimary: 'ابدأ مجاناً الآن',
    ctaSecondary: 'استكشف الحزم',
  },
  fr: {
    badge: 'Plateforme Académique & Fintech N°1 en Algérie 2026',
    line1: 'Construisez votre avenir',
    line2Prefix: 'et',
    line2Highlight: 'excellez avec brio',
    sub: 'Réussissez le BAC et l\'université avec des sessions de préparation gratuites, du live, un bot de guidage intelligent, et un réseau d\'ambassadeurs certifiés dans les 58 wilayas.',
    ctaPrimary: 'Commencer gratuitement',
    ctaSecondary: 'Explorer les Bundles',
  },
  en: {
    badge: "Algeria's #1 EdTech & Fintech Platform 2026",
    line1: 'Build Your Future',
    line2Prefix: 'and',
    line2Highlight: 'Excel with Distinction',
    sub: 'Succeed at the BAC and university with free prep sessions, live classes, a smart guidance bot, and a certified ambassador network across 58 wilayas.',
    ctaPrimary: 'Start Free Now',
    ctaSecondary: 'Explore Bundles',
  },
};

export const LandingHero: React.FC = () => {
  const { locale } = useTranslation();
  const { openAuth } = useAuthModal();
  const heroRef = useRef<HTMLDivElement>(null);
  const c = HERO_COPY[locale] || HERO_COPY.ar;

  useEffect(() => {
    if (!heroRef.current) return;
    const els = heroRef.current.querySelectorAll('[data-gsap]');
    gsap.fromTo(els, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12 });
  }, []);

  return (
    <section ref={heroRef} className="relative px-3 sm:px-6 lg:px-8 pt-6 sm:pt-10" data-testid="landing-hero">
      <div className="max-w-7xl mx-auto rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 bg-[#0B1021] relative overflow-hidden p-7 sm:p-12 lg:p-16 shadow-2xl text-center">
        <div className="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-gold-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-lime-400/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            data-gsap
            data-testid="landing-hero-badge"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-[11px] sm:text-xs font-bold text-lime-300"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>{c.badge}</span>
          </div>

          <h1 data-gsap className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white font-arabic">
            {c.line1}
            <br />
            {c.line2Prefix}{' '}
            <span className="animated-gradient-text inline-flex items-center gap-2">
              <Sparkles className="w-6 h-6 sm:w-9 sm:h-9 text-lime-400 shrink-0" />
              {c.line2Highlight}
            </span>
          </h1>

          <p data-gsap className="mt-6 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            {c.sub}
          </p>

          <div data-gsap className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <MagneticButton
              data-testid="landing-cta-register"
              onClick={() => openAuth('register')}
              className="px-6 py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-sm shadow-[0_0_25px_-5px_rgba(163,230,53,0.5)]"
            >
              {c.ctaPrimary}
            </MagneticButton>
            <a
              href="#bundles"
              data-testid="landing-cta-secondary"
              className="px-6 py-3.5 rounded-2xl border border-gold-400/40 text-gold-300 hover:bg-gold-400/10 font-bold text-sm text-center transition-colors"
            >
              {c.ctaSecondary}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
