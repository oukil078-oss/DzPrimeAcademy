'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Video, Users, Award, ShieldCheck, Flame, Zap } from 'lucide-react';
import { DawaratCatalog } from '@/components/dawarat/DawaratCatalog';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function DawaratPage() {
  const { t, locale } = useTranslation();

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 border border-gold-500/30 text-white overflow-hidden shadow-xl">
        {/* Glow orb */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-400 text-xs font-bold font-arabic mb-4">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span>{t('dawarat.badge')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black font-arabic tracking-tight text-white leading-tight">
            {t('dawarat.title')}
          </h1>

          <p className="mt-3 text-xs sm:text-base text-gray-300 font-arabic leading-relaxed">
            {t('dawarat.subtitle')}
          </p>

          {/* Quick value badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-arabic">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-1.5">
              <Video className="w-4 h-4 text-emerald-400" />
              <span>{locale === 'ar' ? 'بث مباشر تفاعلي بجودة HD' : 'Direct interactif HD'}</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-gold-400" />
              <span>{locale === 'ar' ? 'نخبة أساتذة الجزائر ومفتشو المادة' : 'Professeurs & Inspecteurs'}</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>{locale === 'ar' ? 'تسجيلات الحصص متاحة طيلة السنة' : 'Replays disponibles 24/7'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Catalog with Interactive Filters & Checkout */}
      <DawaratCatalog />
    </div>
  );
}
