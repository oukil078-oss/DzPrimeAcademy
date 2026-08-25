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
  Lock,
  MessageSquare,
  Award,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { MetricsGrid, MetricCardItem } from '@/components/dashboard/MetricsGrid';
import { MembershipCard } from '@/components/card/MembershipCard';
import { QuickStudyHub } from '@/components/study/QuickStudyHub';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isGoldenMember, getHubTitle } from '@/lib/rbac';
import { EXAMS, RECENT_POSTS } from '@/lib/initial-data';
import { UpgradeModal } from '@/components/shared/UpgradeModal';
import { AuthModal } from '@/components/auth/AuthModal';

export default function StudentDashboardPage() {
  const { t, locale } = useTranslation();
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'studyHub' | 'card' | 'workshops'>('studyHub');
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const isGold = isGoldenMember(currentUser);
  const isTeacherRole = currentUser?.role === 'TEACHER';
  const displayName = currentUser ? currentUser.name : (locale === 'ar' ? 'طالب زائر' : 'Étudiant Invité');
  const specialtyName = currentUser?.specialty || (locale === 'ar' ? 'العلوم والتكنولوجيا / إعلام آلي L1' : 'Tronc Commun MI L1');
  const institutionName = currentUser?.institutionName || 'Université USTHB Bab Ezzouar';

  const hubTitle = getHubTitle(currentUser?.role, displayName, locale);

  const studentMetrics: MetricCardItem[] = isTeacherRole
    ? [
        {
          title: locale === 'ar' ? 'المقاييس المشرف عليها' : 'Modules Enseignés',
          value: '4 Modules',
          change: 'Semestre Actuel',
          isPositive: true,
          icon: BookOpen,
          description: specialtyName,
        },
        {
          title: locale === 'ar' ? 'المواضيع والحلول المعتمدة' : 'Examens Validés',
          value: '48 Sujets',
          change: 'Corrigés Types',
          isPositive: true,
          icon: FileText,
          description: 'Math & Informatique',
        },
        {
          title: locale === 'ar' ? 'حالة الاعتماد الأكاديمي' : 'Statut Professeur',
          value: locale === 'ar' ? 'أستاذ معتمد ✓' : 'Professeur Certifié',
          isPositive: true,
          icon: Crown,
          description: currentUser?.studentCardId || 'DZ-TCH-19-KADRI',
        },
        {
          title: locale === 'ar' ? 'الورشات والمراجعات' : 'Masterclasses',
          value: '6 Sessions',
          change: 'Ce mois',
          isPositive: true,
          icon: Calendar,
          description: institutionName,
        },
      ]
    : [
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
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-arabic">
      {/* Guest Banner if not signed in */}
      {!currentUser && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-gold-500/20 to-transparent border border-gold-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-700 dark:text-gold-300 shrink-0 font-bold">
              👤
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-gold-200">
                {locale === 'ar' ? 'أنت تتصفح المنصة حالياً كـ "زائر"' : 'Vous naviguez actuellement en tant qu\'invité'}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-gray-300">
                {locale === 'ar'
                  ? 'سجّل الدخول لتخصيص جدولك، حفظ امتحاناتك، وتفعيل بطاقة عضويتك الرقمية.'
                  : 'Connectez-vous pour personnaliser vos cours et activer votre carte digitale.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-all touch-target w-full sm:w-auto"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('auth.loginTab')}</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 dark:border-gold-500/25 pb-4 sm:pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 sm:p-2 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-700 dark:text-gold-400">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {hubTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1">
            {specialtyName} • {institutionName}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isGold ? (
            <button
              onClick={() => setIsUpgradeOpen(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-1.5 hover:scale-105 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{locale === 'ar' ? 'تفعيل العضوية الذهبية VIP' : 'Passer en VIP Gold'}</span>
            </button>
          ) : (
            <div className="px-3.5 py-1.5 rounded-2xl bg-gold-500/20 border border-gold-500/40 text-gold-700 dark:text-gold-300 text-xs font-black flex items-center gap-1.5 shadow-sm">
              <Crown className="w-4 h-4 text-gold-500" />
              <span>GOLDEN VIP ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* KPI Metrics */}
      <MetricsGrid metrics={studentMetrics} />

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('studyHub')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'studyHub'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <Zap className="w-4 h-4 text-gold-500" />
          <span>{locale === 'ar' ? 'بنك الامتحانات السريع (1-Click)' : 'Banque d\'Examens Directe'}</span>
        </button>

        <button
          onClick={() => setActiveTab('card')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'card'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <CreditCard className="w-4 h-4 text-emerald-500" />
          <span>{t('nav.membershipCard')}</span>
        </button>

        <button
          onClick={() => setActiveTab('workshops')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'workshops'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>{locale === 'ar' ? 'الورشات والمراجعات المتاحة' : 'Sessions & Masterclasses'}</span>
        </button>
      </div>

      {/* Tab 1: 1-Click Fast Study Hub */}
      {activeTab === 'studyHub' && (
        <div className="space-y-6">
          <QuickStudyHub />
        </div>
      )}

      {/* Tab 2: Digital Membership Card */}
      {activeTab === 'card' && (
        <div className="space-y-6">
          <div className="max-w-xl mx-auto">
            <MembershipCard
              user={currentUser}
              allowExport={true}
            />
          </div>
        </div>
      )}

      {/* Tab 3: Workshops & Events */}
      {activeTab === 'workshops' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECENT_POSTS.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-lg bg-gold-500/20 text-gold-700 dark:text-gold-300 text-[10px] font-bold">
                    {post.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{post.createdAt}</span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug">
                  {post.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                  {post.content}
                </p>
                {post.location && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-900 text-[11px] font-bold text-slate-600 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-500" />
                    <span>{post.location}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-gray-400 font-bold">{post.authorName}</span>
                  <Link
                    href={`/${locale}/ambassadors`}
                    className="text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline"
                  >
                    {locale === 'ar' ? 'عرض السفير والتسجيل ←' : 'Voir l\'Ambassadeur ←'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <UpgradeModal isOpen={isUpgradeOpen} onClose={() => setIsUpgradeOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
