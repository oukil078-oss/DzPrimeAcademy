'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import { MetricsGrid, MetricCardItem } from '@/components/dashboard/MetricsGrid';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isAmbassador } from '@/lib/rbac';
import { RECENT_POSTS, AMBASSADORS } from '@/lib/initial-data';
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

  const isUserAmb = isAmbassador(currentUser?.role);

  const currentAmbassador =
    AMBASSADORS.find((a) => a.userId === currentUser?.id) || AMBASSADORS[0];

  const ambassadorMetrics: MetricCardItem[] = [
    {
      title: t('dashboards.ambassador.myRating'),
      value: `${currentAmbassador.ratingAverage} / 5.0`,
      change: '+0.12',
      isPositive: true,
      icon: Star,
      description: locale === 'ar' ? 'بناءً على تقييمات الطلبة' : locale === 'fr' ? 'Évaluations des étudiants' : 'Based on student reviews',
    },
    {
      title: t('dashboards.ambassador.reviewsCount'),
      value: `${currentAmbassador.ratingsCount}`,
      change: '+18',
      isPositive: true,
      icon: MessageSquare,
      description: locale === 'ar' ? 'رأي معتمد في تخصصك' : locale === 'fr' ? 'Avis certifiés' : 'Verified feedback',
    },
    {
      title: t('dashboards.ambassador.scheduledSessions'),
      value: `${currentAmbassador.upcomingSessionsCount}`,
      change: 'Active',
      isPositive: true,
      icon: Calendar,
      description: locale === 'ar' ? 'حصص حضورية وافتراضية' : locale === 'fr' ? 'Séances programmées' : 'Upcoming workshops',
    },
    {
      title: t('dashboards.ambassador.tipsCount'),
      value: `${currentAmbassador.totalTipsShared}`,
      change: '+6',
      isPositive: true,
      icon: Award,
      description: locale === 'ar' ? 'مواضيع وملخصات معتمدة' : locale === 'fr' ? 'Ressources partagées' : 'Shared resources',
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

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Notice if not signed in as Ambassador */}
      {!isUserAmb && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-gold-500/20 to-transparent border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left font-arabic">
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
                  ? 'يمكنك التبديل إلى دور السفير المعتمد لتجربة نشر الورشات والجلسات ومتابعة التقييمات.'
                  : 'Passez au profil Ambassadeur pour planifier des sessions et gérer vos avis étudiants.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => switchRole('AMBASSADOR')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
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
            <h1 className="text-2xl sm:text-3xl font-black font-arabic text-slate-900 dark:text-white">
              {t('dashboards.ambassador.title')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic mt-1">
            {t('dashboards.ambassador.myScope')}: {currentUser?.institutionName || 'USTHB Bab Ezzouar'} (Wilaya {currentUser?.wilayaCode || 16})
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-arabic text-xs font-bold shadow-sm">
          <span>{t('dashboards.ambassador.badge')}</span>
        </div>
      </div>

      {/* Metrics */}
      <MetricsGrid metrics={ambassadorMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Create Post Form */}
        <div className="lg:col-span-6 p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left font-arabic">
          <div className="flex items-center gap-2 mb-4 text-gold-700 dark:text-gold-300 font-bold">
            <PlusCircle className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            <h3>{t('dashboards.ambassador.createPostTitle')}</h3>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
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
                  <option value="SESSION_SCHEDULE">{t('bot.midterm')} / Session</option>
                  <option value="STUDY_TIP">Study Tips & Advice</option>
                  <option value="EVENT">Interactive Live Stream</option>
                  <option value="ANNOUNCEMENT">Official Announcement</option>
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
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs shadow-gold-glow flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-navy-950" />
                  <span>{t('dashboards.ambassador.publishedSuccess')}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t('dashboards.ambassador.publishBtn')}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Posts Feed & Reviews */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left font-arabic">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">
              {t('dashboards.ambassador.myActivities')} ({posts.length})
            </h3>

            <div className="space-y-3">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-gray-800 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-gold-700 dark:text-gold-400 font-bold">{p.title}</span>
                    <span className="text-slate-400 dark:text-gray-400 font-mono">{p.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-gray-300 line-clamp-2 mt-1 leading-relaxed">
                    {p.content}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                    <span>{p.isOnline ? '🌐 Online' : `🏛️ ${p.location || 'In-Person'}`}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t('dashboards.ambassador.activeStatus')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Reviews Box */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left font-arabic">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
              <span>{t('dashboards.ambassador.reviewsTitle')}</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              {[
                { name: 'Amine B.', comment: 'Excellente séance de révision en Algorithmique 1, explications très claires !', rating: 5 },
                { name: 'Meriem K.', comment: 'Les annales corrigées d\'Analyse 1 nous ont énormément aidés pour le partiel.', rating: 5 },
                { name: 'Walid A.', comment: 'Organisation impeccable et grand soutien aux étudiants de la faculté.', rating: 5 },
              ].map((rev, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-gray-800/80">
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-gold-800 dark:text-gold-300">{rev.name}</strong>
                    <div className="flex items-center gap-0.5 text-gold-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold-500" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-gray-300 text-[11px]">{rev.comment}</p>
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
