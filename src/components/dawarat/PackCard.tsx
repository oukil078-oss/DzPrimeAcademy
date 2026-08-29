'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Clock,
  Video,
  Users,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Crown,
  Layers,
} from 'lucide-react';
import { DawaaraPack } from '@/types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isGoldenMember } from '@/lib/rbac';

interface PackCardProps {
  pack: DawaaraPack;
  onOpenCheckout?: (pack: DawaaraPack, preselectedModuleIds?: string[]) => void;
}

export const PackCard: React.FC<PackCardProps> = ({ pack, onOpenCheckout }) => {
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();
  const isGold = isGoldenMember(currentUser);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const title = locale === 'fr' ? pack.titleFr : locale === 'en' ? pack.titleEn : pack.titleAr;
  const desc = locale === 'fr' ? pack.descriptionFr : locale === 'en' ? pack.descriptionEn : pack.descriptionAr;
  const target = locale === 'fr' ? pack.targetAudienceFr : pack.targetAudienceAr;
  const badge = locale === 'fr' ? pack.badgeFr : pack.badgeAr;

  const savingsAmount = pack.originalTotalPrice - pack.packPrice;
  const savingsPercent = Math.round((savingsAmount / pack.originalTotalPrice) * 100);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`rounded-3xl border transition-all duration-300 bg-white dark:bg-navy-900/90 overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl ${
        pack.isPopular
          ? 'border-gold-500/80 shadow-gold-glow/20'
          : 'border-slate-200 dark:border-navy-700 hover:border-gold-400 dark:hover:border-gold-500/40'
      }`}
    >
      {/* Top Banner & Badges */}
      <div>
        <div className="p-5 sm:p-6 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-gold-500/30 border border-gold-500/40 text-gold-800 dark:text-gold-300 text-xs font-black font-arabic flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold-500 animate-pulse" />
                <span>{badge}</span>
              </span>

              {pack.isLiveNow && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-[10px] font-bold font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>LIVE</span>
                </span>
              )}
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-black font-mono">
              -{savingsPercent}% {t('dawarat.save')}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black font-arabic text-slate-900 dark:text-white leading-snug">
            {title}
          </h3>

          <p className="mt-1.5 text-xs text-gold-700 dark:text-gold-400 font-bold font-arabic flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>{target}</span>
          </p>

          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic line-clamp-3 leading-relaxed">
            {desc}
          </p>

          {/* Quick Metrics (Hours, Sessions, Modules) */}
          <div className="mt-4 grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-50 dark:bg-navy-950/70 border border-slate-200 dark:border-navy-800 text-center font-arabic">
            <div className="border-r rtl:border-r-0 rtl:border-l border-slate-200 dark:border-navy-800 last:border-0">
              <div className="text-xs sm:text-sm font-black font-mono text-slate-900 dark:text-white">
                {pack.modules.length}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-gray-400">
                {locale === 'ar' ? 'مقاييس أساسية' : 'modules'}
              </div>
            </div>
            <div className="border-r rtl:border-r-0 rtl:border-l border-slate-200 dark:border-navy-800 last:border-0">
              <div className="text-xs sm:text-sm font-black font-mono text-slate-900 dark:text-white">
                {pack.totalHours}h
              </div>
              <div className="text-[10px] text-slate-500 dark:text-gray-400">
                {locale === 'ar' ? 'تدريب مباشر' : 'heures live'}
              </div>
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black font-mono text-slate-900 dark:text-white">
                {pack.totalSessions}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-gray-400">
                {locale === 'ar' ? 'حصة تفاعلية' : 'ateliers'}
              </div>
            </div>
          </div>

          {/* Teachers Avatars Stack */}
          <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-navy-800 text-xs font-arabic">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                {pack.modules.map((m, idx) => (
                  <div
                    key={idx}
                    className="inline-block w-7 h-7 rounded-full bg-slate-200 dark:bg-navy-800 border-2 border-white dark:border-navy-900 text-center text-xs leading-6"
                    title={m.teacherName}
                  >
                    {m.teacherAvatar}
                  </div>
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-gray-300">
                {pack.modules.map((m) => m.teacherName.split(' ')[0]).join(' • ')}
              </span>
            </div>

            <div className="text-[10px] text-gold-600 dark:text-gold-400 font-mono font-semibold px-2 py-0.5 rounded-md bg-gold-500/10">
              Code: {pack.referralCode}
            </div>
          </div>
        </div>

        {/* Modules mini-preview tag pills */}
        <div className="px-5 sm:px-6 pb-2 flex flex-wrap gap-1.5">
          {pack.modules.map((m) => (
            <span
              key={m.id}
              className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 text-[11px] font-arabic font-medium text-slate-700 dark:text-gray-300"
            >
              {locale === 'fr' ? m.nameFr : m.nameAr}
            </span>
          ))}
        </div>
      </div>

      {/* Pricing & CTA Section */}
      <div className="p-5 sm:p-6 pt-3 bg-gradient-to-b from-transparent to-slate-50/90 dark:to-navy-950/80 border-t border-slate-100 dark:border-navy-800">
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-[11px] text-slate-400 dark:text-gray-500 font-arabic">
              <span>{t('dawarat.originalTotal')}: </span>
              <span className="line-through font-mono">
                {pack.originalTotalPrice.toLocaleString()} DZD
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black font-mono text-gold-600 dark:text-gold-400">
                {pack.packPrice.toLocaleString()}
              </span>
              <span className="text-xs font-bold font-arabic text-slate-700 dark:text-gray-300">
                DZD
              </span>
            </div>
          </div>

          {/* Gold VIP Discount Badge */}
          <div className="text-right">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/15 border border-gold-500/30 text-[10px] font-black text-gold-800 dark:text-gold-300 font-arabic">
              <Crown className="w-3 h-3 text-gold-500" />
              <span>{locale === 'ar' ? 'سعر VIP الذهبي' : 'Prix Gold VIP'}</span>
            </div>
            <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
              {pack.vipDiscountPrice.toLocaleString()} DZD
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href={`/${locale}/dawarat/${pack.id}`}
            className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-navy-700 hover:border-gold-500 text-slate-800 dark:text-gray-200 hover:text-gold-600 dark:hover:text-gold-300 font-bold text-xs font-arabic text-center flex items-center justify-center gap-1.5 transition-all bg-white dark:bg-navy-850"
          >
            <span>{t('dawarat.viewDetails')}</span>
          </Link>

          <button
            type="button"
            onClick={() => onOpenCheckout && onOpenCheckout(pack)}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs font-arabic text-center flex items-center justify-center gap-1.5 shadow-gold-glow transition-all active:scale-95 cursor-pointer"
          >
            <span>{t('dawarat.buyFullPack')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
