'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Star,
  Calendar,
  Send,
  PlusCircle,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  Users,
  MessageSquare,
  Sparkles,
  Tag,
  Copy,
  Check,
  DollarSign,
  TrendingUp,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { MetricsGrid, MetricCardItem } from '@/components/dashboard/MetricsGrid';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isAmbassador } from '@/lib/rbac';
import { RECENT_POSTS, AMBASSADORS, DAWARAT_PACKS, AMBASSADOR_SALES } from '@/lib/initial-data';
import { Post, PostType } from '@/types';
import { AuthModal } from '@/components/auth/AuthModal';

export default function AmbassadorDashboardPage() {
  const { t, locale } = useTranslation();
  const { currentUser, switchRole } = useAuthStore();

  const [posts, setPosts] = useState<Post[]>(RECENT_POSTS);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('SESSION_SCHEDULE');
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isUserAmb = isAmbassador(currentUser?.role);

  const currentAmbassador =
    AMBASSADORS.find((a) => a.userId === currentUser?.id) || AMBASSADORS[0];

  const promoCode = `AMB-${currentAmbassador.wilayaCode || 16}-${currentAmbassador.user.name.split(' ')[0].toUpperCase()}`;

  // Filter packs promoted by this ambassador
  const assignedPacks = DAWARAT_PACKS.filter(
    (p) => p.ambassadorId === currentAmbassador.id || p.ambassadorWilayaCode === currentAmbassador.wilayaCode
  );

  const totalCommissionsEarned = AMBASSADOR_SALES.reduce((sum, s) => sum + s.commissionAmount, 0);

  const ambassadorMetrics: MetricCardItem[] = [
    {
      title: t('dashboards.ambassador.myRating'),
      value: `${currentAmbassador.ratingAverage} / 5.0`,
      change: '+0.12',
      isPositive: true,
      icon: Star,
      description: locale === 'ar' ? 'بناءً على تقييمات الطلبة' : 'Évaluations des étudiants',
    },
    {
      title: locale === 'ar' ? 'أرباح العمولات (10%)' : 'Commissions Réseau',
      value: `${totalCommissionsEarned.toLocaleString()} DZD`,
      change: '+15.4%',
      isPositive: true,
      icon: DollarSign,
      description: locale === 'ar' ? 'إجمالي العائدات من كود الإحالة' : 'Gains générés',
    },
    {
      title: t('dashboards.ambassador.reviewsCount'),
      value: `${currentAmbassador.ratingsCount}`,
      change: '+18 this month',
      isPositive: true,
      icon: MessageSquare,
      description: locale === 'ar' ? 'رأي معتمد في نطاق نشاطك' : 'Avis vérifiés',
    },
    {
      title: t('dashboards.ambassador.scheduledSessions'),
      value: `${currentAmbassador.upcomingSessionsCount} Sessions`,
      change: 'Active',
      isPositive: true,
      icon: Calendar,
      description: locale === 'ar' ? 'ورشات حضورية وافتراضية' : 'Séances programmées',
    },
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title,
      content,
      type: postType,
      wilayaCode: currentUser?.wilayaCode || 16,
      wilayaName: currentUser?.wilayaName || 'Alger',
      institutionName: currentUser?.institutionName || 'USTHB Bab Ezzouar',
      isOnline,
      location: isOnline ? undefined : location || 'Amphithéâtre C',
      isApproved: true,
      authorId: currentUser?.id || 'amb-usthb',
      authorName: currentUser?.name || 'Ambassadeur USTHB',
      authorRole: 'AMBASSADOR',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPosts([newPost, ...posts]);
    setTitle('');
    setContent('');
    setLocation('');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(promoCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    const affiliateUrl = `https://dzprime.academy/${locale}/dawarat?ref=${promoCode}`;
    navigator.clipboard.writeText(affiliateUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-arabic">
      {/* Notice if not signed in as Ambassador */}
      {!isUserAmb && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-gold-500/20 to-transparent border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left rtl:text-right font-arabic">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-emerald-200">
                {locale === 'ar' ? 'معاينة لوحة تحكم السفراء' : 'Aperçu du Panneau des Ambassadeurs'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-gray-300">
                {locale === 'ar'
                  ? 'يمكنك التبديل إلى دور السفير المعتمد لتجربة نشر الورشات والجلسات ومتابعة التقييمات وأرباح الإحالة.'
                  : 'Passez au profil Ambassadeur pour planifier des sessions et gérer vos commissions.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => switchRole('AMBASSADOR')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{locale === 'ar' ? 'الدخول كسفير معتمد' : 'Démonstration Ambassadeur'}</span>
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-gold-500/25 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-700 dark:text-gold-400">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('dashboards.ambassador.title')} - {currentAmbassador.user.name}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1">
            {t('dashboards.ambassador.myScope')}: {currentAmbassador.institutionNameAr} (Wilaya {currentAmbassador.wilayaCode})
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold shadow-sm">
          <span>{t('dashboards.ambassador.badge')}</span>
        </div>
      </div>

      {/* Referral Hub Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 border border-gold-500/30 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-bold flex items-center gap-1.5 w-fit">
            <Tag className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'كود الخصم والإحالة المعتمد الخاص بك' : 'Votre Code Promo Affilié'}</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {locale === 'ar' ? 'شارك كودك مع طلبة ولايتك واربح 10% عمولة على كل اشتراك' : 'Partagez votre code et gagnez 10% de commission'}
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            {locale === 'ar'
              ? 'يحصل الطالب على خصم 500 دج فوري عند إدخال كودك في صفحة الدفع، وتتحصل أنت تلقائياً على عمولتك المعتمدة.'
              : 'Vos étudiants bénéficient de 500 DZD de réduction et vous recevez automatiquement vos gains.'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 p-2 px-3 rounded-2xl bg-navy-950/80 border border-gold-500/40">
            <span className="text-lg font-black font-mono text-gold-400 tracking-wider">
              {promoCode}
            </span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-2 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
            <span>{locale === 'ar' ? 'نسخ رابط الإحالة المباشر' : 'Copier le Lien'}</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <MetricsGrid metrics={ambassadorMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 6 Cols: Create Post Form */}
        <div className="lg:col-span-6 p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left rtl:text-right font-arabic space-y-4">
          <div className="flex items-center gap-2 text-gold-700 dark:text-gold-300 font-bold">
            <PlusCircle className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {t('dashboards.ambassador.createPostTitle')}
            </h3>
          </div>

          {isSubmitted && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{locale === 'ar' ? 'تم نشر الورشة / النصيحة بنجاح!' : 'Publication effectuée avec succès !'}</span>
            </div>
          )}

          <form onSubmit={handleCreatePost} className="space-y-4 text-xs font-arabic">
            <div>
              <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                {t('dashboards.ambassador.postTitleLabel')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('dashboards.ambassador.postTitlePlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-medium"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                  {t('dashboards.ambassador.postTypeLabel')}
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as PostType)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-800 dark:text-gold-300 focus:outline-none"
                >
                  <option value="SESSION_SCHEDULE">ورشة مراجعة / حصة حضورية</option>
                  <option value="STUDY_TIP">نصيحة دراسية ومنهجية</option>
                  <option value="EVENT">حدث وتظاهرة علمية</option>
                  <option value="ANNOUNCEMENT">إعلان رسمي لطلبة الولاية</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                  {t('dashboards.ambassador.deliveryMethod')}
                </label>
                <select
                  value={isOnline ? 'online' : 'inPerson'}
                  onChange={(e) => setIsOnline(e.target.value === 'online')}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-800 dark:text-gray-200 focus:outline-none"
                >
                  <option value="inPerson">{t('dashboards.ambassador.inPerson')}</option>
                  <option value="online">{t('dashboards.ambassador.online')}</option>
                </select>
              </div>
            </div>

            {!isOnline ? (
              <div>
                <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                  {t('dashboards.ambassador.locationLabel')}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={t('dashboards.ambassador.locationPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                  {t('dashboards.ambassador.meetUrlLabel')}
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="https://meet.dzprime.academy/live-session"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                {t('dashboards.ambassador.postContentLabel')}
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('dashboards.ambassador.postContentPlaceholder')}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs shadow-gold-glow flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t('dashboards.ambassador.submitPost')}</span>
            </button>
          </form>
        </div>

        {/* Right 6 Cols: Referral Commission Breakdown & Assigned Packs */}
        <div className="lg:col-span-6 space-y-6 text-left rtl:text-right font-arabic">
          {/* Referral Sales Table */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>{locale === 'ar' ? 'سجل اشتراكات الطلبة بكودك' : 'Ventes Récentes via votre Code'}</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-mono font-bold">
                {AMBASSADOR_SALES.length} {locale === 'ar' ? 'اشتراكات' : 'ventes'}
              </span>
            </div>

            <div className="space-y-3">
              {AMBASSADOR_SALES.map((sale) => (
                <div
                  key={sale.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-750 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {sale.studentName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{sale.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                      {sale.packTitle}
                    </p>
                  </div>

                  <div className="text-right rtl:text-left shrink-0">
                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      +{sale.commissionAmount} DZD
                    </span>
                    <div className="text-[9px] font-bold text-slate-400 mt-0.5">
                      {sale.status === 'PAID' ? '✓ مدفوع' : '⏳ قيد التحويل'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Packs to Promote */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md space-y-4">
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold-500" />
              <span>{locale === 'ar' ? 'الحزم والدورات المسندة إليك لترويجها' : 'Packs Assignés'}</span>
            </h3>

            <div className="space-y-3">
              {assignedPacks.map((pack) => (
                <div
                  key={pack.id}
                  className="p-3.5 rounded-2xl bg-amber-500/10 dark:bg-gold-500/10 border border-gold-500/30 flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {locale === 'fr' ? pack.titleFr : pack.titleAr}
                    </h4>
                    <span className="text-[10px] text-slate-500 dark:text-gray-400">
                      {pack.modules.length} {locale === 'ar' ? 'مقاييس مباشرة' : 'modules'} • {pack.packPrice.toLocaleString()} DZD
                    </span>
                  </div>

                  <Link
                    href={`/${locale}/dawarat/${pack.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs flex items-center gap-1 shadow-sm shrink-0"
                  >
                    <span>{locale === 'ar' ? 'عرض الحزمة' : 'Voir'}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
