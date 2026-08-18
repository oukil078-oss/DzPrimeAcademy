'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Calendar,
  FileText,
  CreditCard,
  Download,
  Bot,
  Crown,
  MapPin,
  Flame,
  Zap,
  LogIn,
} from 'lucide-react';
import { MetricsGrid, MetricCardItem } from '@/components/dashboard/MetricsGrid';
import { MembershipCard } from '@/components/card/MembershipCard';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isGoldenMember } from '@/lib/rbac';
import { EXAMS, RECENT_POSTS } from '@/lib/initial-data';
import { UpgradeModal } from '@/components/shared/UpgradeModal';
import { AuthModal } from '@/components/auth/AuthModal';

export default function StudentDashboardPage() {
  const { t, locale } = useTranslation();
  const { currentUser } = useAuthStore();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const isGold = isGoldenMember(currentUser);
  const displayName = currentUser ? currentUser.name : (locale === 'ar' ? 'طالب زائر' : 'Étudiant Invité');
  const specialtyName = currentUser?.specialty || (locale === 'ar' ? 'العلوم والتكنولوجيا / إعلام آلي L1' : 'Tronc Commun MI L1');
  const institutionName = currentUser?.institutionName || 'Université USTHB Bab Ezzouar';

  const studentMetrics: MetricCardItem[] = [
    {
      title: t('dashboards.student.enrolledModules'),
      value: '6 Modules',
      change: 'Current Semester',
      isPositive: true,
      icon: BookOpen,
      description: specialtyName,
    },
    {
      title: t('dashboards.student.downloadedExams'),
      value: isGold ? '28 Papers' : '2 Papers (Sample)',
      change: isGold ? t('dashboards.student.unlimited') : t('dashboards.student.freeSample'),
      isPositive: isGold,
      icon: Download,
      description: 'Midterms & Finals',
    },
    {
      title: t('dashboards.student.membershipStatus'),
      value: isGold ? t('dashboards.student.goldActive') : currentUser ? t('dashboards.student.freeAccount') : (locale === 'ar' ? 'حساب زائر' : 'Compte Invité'),
      isPositive: isGold,
      icon: Crown,
      description: currentUser?.studentCardId || 'DZ-STU-16-GUEST',
    },
    {
      title: t('dashboards.student.availableEvents'),
      value: '3 Sessions',
      change: 'This Week',
      isPositive: true,
      icon: Calendar,
      description: `Wilaya ${currentUser?.wilayaCode || 16} (${currentUser?.wilayaName || 'Alger'})`,
    },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Guest Banner if not signed in */}
      {!currentUser && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-gold-500/20 to-transparent border border-gold-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left font-arabic">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-700 dark:text-gold-300 shrink-0 font-bold">
              👤
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-gold-200">
                {locale === 'ar' ? 'أنت تتصفح المنصة حالياً كـ "زائر"' : 'Vous naviguez actuellement en tant qu\'invité'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-gray-300">
                {locale === 'ar'
                  ? 'سجّل الدخول لتخصيص جدولك، حفظ امتحاناتك، وتفعيل بطاقة عضويتك الرقمية.'
                  : 'Connectez-vous pour personnaliser vos cours et activer votre carte digitale.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>{locale === 'ar' ? 'تسجيل الدخول / اختيار دور' : 'Connexion / Profils'}</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-gold-500/25 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-700 dark:text-gold-400">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-arabic text-slate-900 dark:text-white">
              {t('dashboards.student.title')} - {displayName}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic mt-1">
            {institutionName} • {specialtyName}
          </p>
        </div>

        <div>
          {isGold ? (
            <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-2xl bg-gold-500/15 border border-gold-500/40 text-gold-700 dark:text-gold-300 text-xs font-bold font-arabic shadow-sm">
              <Crown className="w-4 h-4 text-gold-600 dark:text-gold-400" />
              <span>{t('dashboards.student.goldActive')}</span>
            </div>
          ) : (
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-extrabold text-xs font-arabic shadow-gold-glow flex items-center gap-2 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t('dashboards.student.upgradeToGold')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <MetricsGrid metrics={studentMetrics} />

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Quick Bot Launcher & Enrolled Modules */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Bot Callout Banner */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/40 bg-gradient-to-r from-amber-50 via-white to-amber-50 dark:from-navy-900 dark:via-navy-850 dark:to-navy-900 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div>
              <span className="px-2.5 py-0.5 rounded-md bg-gold-500/20 text-gold-800 dark:text-gold-300 text-[10px] font-bold font-arabic">
                {t('floatingBot.badge')}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-arabic mt-1">
                {t('dashboards.student.botPromptTitle')}
              </h3>
              <p className="text-xs text-slate-600 dark:text-gray-300 font-arabic mt-1">
                {t('dashboards.student.botPromptDesc')}
              </p>
            </div>

            <Link
              href={`/${locale}/bot`}
              className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs font-arabic shadow-gold-glow flex items-center justify-center gap-2 shrink-0 active:scale-95 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>{t('dashboards.student.openBotBtn')}</span>
            </Link>
          </div>

          {/* Enrolled Modules & Past Exams */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left font-arabic">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">
              {t('dashboards.student.recentExamsTitle')}
            </h3>

            <div className="space-y-3">
              {EXAMS.slice(0, 4).map((exam) => (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-gray-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-600 dark:text-gold-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {exam.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">
                        {exam.moduleName} • {exam.year} • {exam.downloadsCount} {t('bot.downloads')}
                      </p>
                    </div>
                  </div>

                  <a
                    href={exam.fileUrl}
                    download
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-navy-800 hover:bg-slate-100 dark:hover:bg-navy-700 border border-slate-300 dark:border-gold-500/30 text-slate-800 dark:text-gold-300 text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t('dashboards.student.downloadPdf')}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Local Sessions */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left font-arabic">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-600 dark:text-gold-400" />
              <span>{t('dashboards.student.upcomingLocalSessions')}</span>
            </h3>

            <div className="space-y-3">
              {RECENT_POSTS.slice(0, 2).map((post) => (
                <div key={post.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-gold-800 dark:text-gold-300">{post.title}</span>
                    <span className="text-slate-400 dark:text-gray-400 font-mono">{post.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">{post.content}</p>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-gray-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                    <span>{post.authorName}</span>
                    <span className="text-gold-700 dark:text-gold-400 font-semibold">{post.isOnline ? 'Online (Zoom)' : post.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Embedded Digital Card */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full text-center mb-4 font-arabic">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {t('dashboards.student.cardWidgetTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              {t('dashboards.student.cardWidgetSubtitle')}
            </p>
          </div>
          <MembershipCard user={currentUser || undefined} allowExport={true} />
        </div>
      </div>

      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
