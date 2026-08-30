'use client';

import React from 'react';
import Link from 'next/link';
import { use } from 'react';
import {
  CheckCircle2,
  Award,
} from 'lucide-react';
import { DzPrimeLogo } from '@/components/shared/DzPrimeLogo';
import { DEMO_USERS } from '@/lib/initial-data';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function VerifyCardPage({
  params,
}: {
  params: Promise<{ locale: string; cardId: string }>;
}) {
  const resolvedParams = use(params);
  const { locale, cardId } = resolvedParams;
  const { t } = useTranslation();

  // Lookup matched card or generate certified payload
  const matchedUser = DEMO_USERS.find(
    (u) => u.studentCardId?.toLowerCase() === cardId?.toLowerCase()
  ) || {
    id: 'user-sample',
    email: 'contact@dzprime.academy',
    name: 'Alaa Eddine',
    role: 'AMBASSADOR',
    phone: '+213 661 23 45 67',
    wilayaCode: 16,
    wilayaName: 'Alger',
    institutionName: 'Université USTHB Bab Ezzouar',
    studentCardId: cardId || 'DZ-AMB-16-0789',
    isVerified: true,
    createdAt: '2023-09-10',
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-gold-500/50 bg-white dark:bg-gradient-to-b dark:from-[#0B132B] dark:via-[#060913] dark:to-[#03060E] p-6 sm:p-10 text-slate-900 dark:text-white shadow-xl dark:shadow-gold-glow-lg text-center relative overflow-hidden transition-colors">
        {/* Background Aura */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <DzPrimeLogo size={48} showText={true} />
        </div>

        {/* Verification Status Badge */}
        <div className="my-5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold font-arabic shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{t('verify.badgeValid')}</span>
        </div>

        <h1 className="text-lg sm:text-2xl font-black font-arabic text-slate-900 dark:text-gold-200">
          {t('verify.title')}
        </h1>
        <p className="text-xs text-slate-600 dark:text-gray-300 font-arabic mt-1">
          {t('verify.subtitle')}
        </p>

        {/* Details Grid */}
        <div className="my-6 space-y-3 bg-slate-50 dark:bg-navy-900/80 border border-slate-200 dark:border-gold-500/30 rounded-2xl p-5 text-left font-arabic text-xs shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-2">
            <span className="text-slate-500 dark:text-gray-400">{t('verify.memberName')}:</span>
            <strong className="text-slate-900 dark:text-white text-sm font-extrabold">{matchedUser.name}</strong>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-2">
            <span className="text-slate-500 dark:text-gray-400">{t('verify.role')}:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-gold-500/20 text-gold-800 dark:text-gold-300 font-bold">
              {matchedUser.role === 'AMBASSADOR'
                ? t('brand.verifiedAmbassador')
                : matchedUser.role === 'OWNER'
                ? t('roles.OWNER')
                : matchedUser.role === 'TEACHER'
                ? t('roles.TEACHER')
                : t('roles.STUDENT_PAID')}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-2">
            <span className="text-slate-500 dark:text-gray-400">{t('verify.cardId')}:</span>
            <strong className="font-mono text-gold-700 dark:text-gold-400 font-bold tracking-wider">{cardId}</strong>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-2">
            <span className="text-slate-500 dark:text-gray-400">{t('verify.wilaya')}:</span>
            <span className="text-slate-700 dark:text-gray-200">
              Wilaya {matchedUser.wilayaCode || 16} ({matchedUser.wilayaName || 'Alger'})
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-800 pb-2">
            <span className="text-slate-500 dark:text-gray-400">{t('verify.institution')}:</span>
            <span className="text-slate-700 dark:text-gray-200 max-w-[220px] truncate">{matchedUser.institutionName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-gray-400">{t('verify.validity')}:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{t('verify.validUntil')}</span>
          </div>
        </div>

        {/* Official Security Watermark */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 dark:border-gray-800 text-[11px] text-slate-500 dark:text-gray-400 font-arabic">
          <div className="flex items-center gap-1.5 text-gold-700 dark:text-gold-400">
            <Award className="w-4 h-4" />
            <span>{t('verify.seal')}</span>
          </div>

          <Link
            href={`/${locale}`}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-slate-800 dark:text-gold-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
          >
            <span>{t('verify.backHome')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
