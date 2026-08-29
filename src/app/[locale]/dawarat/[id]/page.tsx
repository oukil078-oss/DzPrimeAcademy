'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Clock,
  Video,
  Users,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Crown,
  BookOpen,
  Send,
  Phone,
  Building,
} from 'lucide-react';
import { DAWARAT_PACKS, TEACHERS } from '@/lib/initial-data';
import { ModuleCard } from '@/components/dawarat/ModuleCard';
import { PackCheckoutModal } from '@/components/dawarat/PackCheckoutModal';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isGoldenMember } from '@/lib/rbac';

interface PackDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export default function PackDetailPage({ params }: PackDetailPageProps) {
  const resolvedParams = use(params);
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();
  const isGold = isGoldenMember(currentUser);
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const pack = DAWARAT_PACKS.find((p) => p.id === resolvedParams.id || p.slug === resolvedParams.id);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(
    pack ? pack.modules.map((m) => m.id) : []
  );

  if (!pack) {
    notFound();
  }

  const title = locale === 'fr' ? pack.titleFr : locale === 'en' ? pack.titleEn : pack.titleAr;
  const desc = locale === 'fr' ? pack.descriptionFr : locale === 'en' ? pack.descriptionEn : pack.descriptionAr;
  const target = locale === 'fr' ? pack.targetAudienceFr : pack.targetAudienceAr;
  const badge = locale === 'fr' ? pack.badgeFr : pack.badgeAr;

  const handleToggleModuleSelection = (modId: string) => {
    setSelectedModuleIds((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const savingsAmount = pack.originalTotalPrice - pack.packPrice;
  const savingsPercent = Math.round((savingsAmount / pack.originalTotalPrice) * 100);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      {/* Back to Catalog Link */}
      <div>
        <Link
          href={`/${locale}/dawarat`}
          className="inline-flex items-center gap-2 text-xs font-bold font-arabic text-slate-600 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-300 transition-colors"
        >
          <ArrowIcon className="w-4 h-4 rotate-180 rtl:rotate-0" />
          <span>{locale === 'ar' ? 'العودة لجميع حزم الدورات' : 'Retour aux packs'}</span>
        </Link>
      </div>

      {/* Hero Header Card */}
      <div className="rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 border border-gold-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-72 h-72 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-8">
          <div className="max-w-3xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-black font-arabic flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span>{badge}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono">
                -{savingsPercent}% {t('dawarat.save')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black font-arabic tracking-tight text-white leading-tight">
              {title}
            </h1>

            <p className="text-xs sm:text-sm font-bold text-gold-400 font-arabic flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-gold-400" />
              <span>{target}</span>
            </p>

            <p className="text-xs sm:text-base text-gray-300 font-arabic leading-relaxed pt-1">
              {desc}
            </p>

            {/* Quick Metrics */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-arabic">
              <span className="flex items-center gap-1.5 text-gray-300">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>{pack.totalHours} {t('dawarat.hours')}</span>
              </span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>{pack.totalSessions} {t('dawarat.sessions')}</span>
              </span>
              <span className="flex items-center gap-1.5 text-gray-300">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>{locale === 'ar' ? `البداية: ${pack.startDate}` : `Début : ${pack.startDate}`}</span>
              </span>
            </div>
          </div>

          {/* Pricing & CTA Card on Hero Right */}
          <div className="w-full lg:w-80 p-6 rounded-3xl bg-white/10 dark:bg-navy-900/90 border border-gold-500/40 backdrop-blur-xl shadow-2xl space-y-4 shrink-0 font-arabic">
            <div>
              <div className="text-xs text-gray-300">
                <span>{t('dawarat.originalTotal')}: </span>
                <span className="line-through font-mono">{pack.originalTotalPrice.toLocaleString()} DZD</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-gold-400">
                  {pack.packPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-gray-200">DZD</span>
              </div>
              <div className="text-xs text-emerald-400 font-bold mt-0.5">
                {locale === 'ar' ? `وفرت ${savingsAmount.toLocaleString()} دج مع الحزمة الكاملة` : `Économie de ${savingsAmount.toLocaleString()} DZD`}
              </div>
            </div>

            {/* VIP Discount Box */}
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-gold-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-bold text-gold-300">
                  {t('dawarat.vipPrice')}
                </span>
              </div>
              <span className="text-sm font-black font-mono text-emerald-400">
                {pack.vipDiscountPrice.toLocaleString()} DZD
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-sm shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('dawarat.buyFullPack')}</span>
            </button>

            <div className="text-center">
              <span className="text-[11px] text-gray-400">
                {locale === 'ar' ? `كود خصم السفير: ` : `Code Ambassadeur : `}
                <strong className="text-gold-300 font-mono">{pack.referralCode}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modules Breakdown Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-navy-800 pb-4 font-arabic">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {locale === 'ar' ? 'المقاييس المتضمنة في الحزمة' : 'Modules Inclus dans le Pack'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              {locale === 'ar'
                ? 'يمكنك الاشتراك في الحزمة كاملة أو اختيار مقاييس محددة حسب حاجتك'
                : 'Vous pouvez souscrire au pack complet ou choisir des modules à l\'unité'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-slate-800 dark:text-gray-200 text-xs font-bold transition-all border border-slate-200 dark:border-navy-700 cursor-pointer"
            >
              {t('dawarat.customizeModules')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pack.modules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isSelected={selectedModuleIds.includes(module.id)}
              onToggleSelect={handleToggleModuleSelection}
              showSelectCheckbox={false}
            />
          ))}
        </div>
      </div>

      {/* Teachers in Charge Spotlight */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-6 font-arabic">
        <div>
          <span className="text-xs font-bold text-gold-600 dark:text-gold-400">
            {t('brand.verifiedTeacher')}
          </span>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
            {locale === 'ar' ? 'الأساتذة المشرفون على الحزمة' : 'Professeurs Responsables du Pack'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pack.modules.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-navy-700 space-y-2.5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{m.teacherAvatar}</span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {m.teacherName}
                  </h4>
                  <p className="text-[11px] text-gold-600 dark:text-gold-400 font-medium">
                    {m.teacherTitle}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                {locale === 'ar' ? `المشرف على مادة ${m.nameAr}` : `En charge de ${m.nameFr}`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sponsoring Ambassador Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-gold-500/15 to-transparent border border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-arabic">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-2xl shrink-0">
            🌟
          </div>
          <div>
            <span className="text-[10px] font-bold text-gold-700 dark:text-gold-300 uppercase">
              {t('dawarat.ambassadorSponsor')}
            </span>
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {pack.ambassadorName} ({pack.ambassadorWilayaName})
            </h4>
            <p className="text-xs text-slate-600 dark:text-gray-300">
              {locale === 'ar'
                ? `يمكنك استلام وصلك أو الدفع نقداً مباشرة عبر السفير المعتمد لولايتك باستخدام كود: `
                : `Paiement en espèces ou orientation via votre ambassadeur avec le code : `}
              <strong className="text-gold-700 dark:text-gold-400 font-mono">{pack.referralCode}</strong>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCheckoutOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow shrink-0 transition-all active:scale-95 cursor-pointer"
        >
          {t('dawarat.buyFullPack')}
        </button>
      </div>

      {/* Checkout Modal */}
      <PackCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        pack={pack}
        initialSelectedModuleIds={selectedModuleIds}
      />
    </div>
  );
}
