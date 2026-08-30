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
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Copy,
  ExternalLink,
  CreditCard,
  Building2,
  BookOpen,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MetricsGrid, MetricCardItem } from '@/components/dashboard/MetricsGrid';
import { AmbassadorDirectory } from '@/components/ambassadors/AmbassadorDirectory';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isAmbassador, isTeacher } from '@/lib/rbac';
import { RECENT_POSTS, AMBASSADORS, CERTIFIED_TEACHERS } from '@/lib/initial-data';
import { Post, PostType, PostComment, AmbassadorProfile } from '@/types';
import { AuthModal } from '@/components/auth/AuthModal';

export default function AmbassadorDashboardPage() {
  const { t, locale } = useTranslation();
  const { currentUser, switchRole } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'workshops' | 'reviews' | 'network'>('workshops');
  const [posts, setPosts] = useState<Post[]>(RECENT_POSTS);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('SESSION_SCHEDULE');
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('user-teacher');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // State for active comment input on posts
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const isUserAmb = isAmbassador(currentUser?.role);
  const isUserTch = isTeacher(currentUser?.role);

  const currentAmbassador: AmbassadorProfile =
    AMBASSADORS.find((a) => a.userId === currentUser?.id) || AMBASSADORS[0];

  const ambassadorMetrics: MetricCardItem[] = [
    {
      title: t('dashboards.ambassador.myRating'),
      value: `${currentAmbassador.ratingAverage} / 5.0`,
      change: '+0.12',
      isPositive: true,
      icon: Star,
      description: locale === 'ar' ? 'بناءً على تقييمات الطلبة المعتمدة' : 'Note certifiée des étudiants',
    },
    {
      title: t('dashboards.ambassador.reviewsCount'),
      value: `${currentAmbassador.ratingsCount}`,
      change: '+18',
      isPositive: true,
      icon: MessageSquare,
      description: locale === 'ar' ? 'رأي وتقييم موثق في تخصصك' : 'Avis vérifiés',
    },
    {
      title: t('dashboards.ambassador.scheduledSessions'),
      value: `${currentAmbassador.upcomingSessionsCount}`,
      change: 'Active',
      isPositive: true,
      icon: Calendar,
      description: locale === 'ar' ? 'حصص حضورية وافتراضية' : 'Séances actives',
    },
    {
      title: locale === 'ar' ? 'الطلبة المستفيدون' : 'Étudiants Accompagnés',
      value: `${currentAmbassador.studentsMentoredCount || 1240}+`,
      change: '+150',
      isPositive: true,
      icon: Users,
      description: currentAmbassador.institutionNameAr,
    },
  ];

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/${locale}/ambassadors?amb=${currentAmbassador.id}`
      );
      setCopiedLink(true);
      try {
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#D4AF37', '#10B981'],
        });
      } catch (e) {}
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const teacherObj = CERTIFIED_TEACHERS.find((tch) => tch.id === selectedTeacherId);

    const newPost: Post = {
      id: `post-${Date.now()}`,
      title,
      content,
      type: postType,
      wilayaCode: currentUser?.wilayaCode || currentAmbassador.wilayaCode || 16,
      wilayaName: currentUser?.wilayaName || currentAmbassador.wilayaNameAr || 'Alger',
      institutionName: currentUser?.institutionName || currentAmbassador.institutionNameAr || 'USTHB Bab Ezzouar',
      isOnline,
      location: isOnline ? undefined : location || 'Amphithéâtre C',
      isApproved: true,
      authorId: currentUser?.id || 'user-ambassador',
      authorName: currentUser?.name || 'Alaa Eddine (Ambassadeur USTHB)',
      authorRole: currentUser?.role || 'AMBASSADOR',
      assignedTeacherId: teacherObj?.id || selectedTeacherId,
      assignedTeacherName: teacherObj?.name || 'Pr. Abdelrahim Kadri',
      comments: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPosts([newPost, ...posts]);
    setTitle('');
    setContent('');
    setLocation('');
    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#10B981', '#D4AF37'],
      });
    } catch (e) {}
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    const isVerifiedTeacher = isUserTch;
    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser?.id || 'user-guest',
      authorName: currentUser?.name || (isUserTch ? 'Pr. Abdelrahim Kadri' : currentAmbassador.user.name),
      authorRole: currentUser?.role || 'AMBASSADOR',
      content: commentText.trim(),
      isVerifiedTeacher,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), newComment],
          };
        }
        return p;
      })
    );

    setCommentText('');
    setActiveCommentPostId(null);
  };

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-arabic">
      {/* Notice if not signed in as Ambassador */}
      {!isUserAmb && !isUserTch && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-gold-500/20 to-transparent border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 font-bold">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-200">
                {locale === 'ar' ? 'لوحة تحكم السفير الأكاديمي المعتمد' : 'Espace Ambassadeur DZ Prime'}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-gray-300">
                {locale === 'ar'
                  ? 'يمكنك التبديل إلى دور السفير لإدارة ورشات المراجعة الجامعية واستقبال تقييمات الطلبة.'
                  : 'Passez au profil Ambassadeur pour gérer vos sessions et voir les avis des étudiants.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => switchRole('AMBASSADOR')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs shadow-sm active:scale-95 transition-all"
          >
            <span>{locale === 'ar' ? 'الدخول كسفير معتمد' : 'Mode Ambassadeur'}</span>
          </button>
        </div>
      )}

      {/* ================= AMBASSADOR PROFILE HEADER HERO ================= */}
      <div className="relative p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-[#060D1F] via-[#0B1530] to-[#040813] border border-gold-500/35 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-gold-500 via-amber-400 to-lime-400 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-[22px] bg-slate-950 text-gold-300 font-black flex items-center justify-center text-2xl sm:text-3xl font-sans">
                  {currentAmbassador.user.name.charAt(0)}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {currentAmbassador.user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold">
                  {t('brand.verifiedAmbassador')}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gold-400" />
                <span>{currentAmbassador.institutionNameAr}</span>
                <span>•</span>
                <span>Wilaya {currentAmbassador.wilayaCode} ({currentAmbassador.wilayaNameAr})</span>
              </p>
              <p className="text-xs text-slate-400 font-mono">
                {locale === 'ar' ? 'معرف السفير:' : 'ID Ambassadeur:'} {currentAmbassador.user.studentCardId || 'DZ-AMB-16-0789'}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all"
            >
              {copiedLink ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">{locale === 'ar' ? 'تم نسخ الرابط!' : 'Lien copié!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gold-400" />
                  <span>{locale === 'ar' ? 'نسخ رابط ملفي' : 'Partager mon profil'}</span>
                </>
              )}
            </button>

            <Link
              href={`/${locale}/card`}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-2 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>{locale === 'ar' ? 'بطاقتي الجامعية' : 'Ma Carte ID'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= KPI METRICS GRID ================= */}
      <MetricsGrid metrics={ambassadorMetrics} />

      {/* ================= DASHBOARD NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('workshops')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'workshops'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{locale === 'ar' ? 'إدارة الورشات والمنشورات' : 'Ateliers & Publications'}</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-gold-500" />
          <span>{locale === 'ar' ? 'تقييمات وآراء الطلبة' : 'Avis des Étudiants'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-gold-500/20 text-gold-600 dark:text-gold-300 text-[10px] font-mono font-bold">
            {currentAmbassador.reviews?.length || 3}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('network')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'network'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-500" />
          <span>{locale === 'ar' ? 'دليل السفراء الوطني (58 ولاية)' : 'Annuaire National'}</span>
        </button>
      </div>

      {/* ================= TAB 1: WORKSHOPS & POST CREATION ================= */}
      {activeTab === 'workshops' && (
        <div className="space-y-6">
          {/* Post Creation Card */}
          <div className="p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/90 shadow-md text-left transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {locale === 'ar' ? 'جدولة ورشة مراجعة أو نشر نصيحة أكاديمية' : 'Créer une Session ou Ressource'}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-gray-400">
                    {locale === 'ar'
                      ? 'سيتم إشعار طلبة جامعتك وولايتك ومصادقة الأستاذ المشرف على المحتوى.'
                      : 'Les étudiants de votre université seront notifiés.'}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                    {t('dashboards.ambassador.postTitle')}
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      locale === 'ar'
                        ? 'مثال: ورشة حل مواضيع Analyse 1 بقاعة المحاضرات C'
                        : 'Ex: Masterclass Analyse 1 - Amphi C'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-gray-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-arabic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                    {t('dashboards.ambassador.postType')}
                  </label>
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value as PostType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-gray-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-arabic"
                  >
                    <option value="SESSION_SCHEDULE">
                      {locale === 'ar' ? '📅 موعد ورشة مراجعة (حضوري أو أونلاين)' : 'Séance de Révision'}
                    </option>
                    <option value="STUDY_TIP">
                      {locale === 'ar' ? '💡 نصائح منهجية وملخصات' : 'Conseil & Méthodologie'}
                    </option>
                    <option value="EVENT">
                      {locale === 'ar' ? '🎉 فعالية علمية أو مسابقة' : 'Événement & Concours'}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                  {t('dashboards.ambassador.postContent')}
                </label>
                <textarea
                  required
                  rows={3}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={
                    locale === 'ar'
                      ? 'اكتب تفاصيل الورشة، المحاور التي ستتم مراجعتها، التمارين المقترحة...'
                      : 'Détails des chapitres abordés, annales résolues...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-gray-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-arabic"
                />
              </div>

              {/* Mode & Certified Teacher Assignment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                    {locale === 'ar' ? 'مكان الحضور / الرابط:' : 'Lieu / Lien:'}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={
                      locale === 'ar'
                        ? 'مثال: قاعة C - كلية الإعلام الآلي أو رابط Google Meet'
                        : 'Ex: Amphi C - Faculté d\'Informatique'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-gray-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-arabic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 mb-1">
                    {locale === 'ar' ? 'الأستاذ المشرف المصادق:' : 'Enseignant référent:'}
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-800 border border-slate-200 dark:border-gray-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-arabic"
                  >
                    {CERTIFIED_TEACHERS.map((tch) => (
                      <option key={tch.id} value={tch.id}>
                        {tch.name} ({tch.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {isSubmitted && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('dashboards.ambassador.success')}</span>
                  </span>
                )}

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-500 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-2 active:scale-95 transition-all ml-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('dashboards.ambassador.publishBtn')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Posts & Feed List */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gold-500" />
              <span>{locale === 'ar' ? 'الورشات والمنشورات النشطة' : 'Sessions Actives'}</span>
            </h3>

            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-gold-500/20 text-gold-700 dark:text-gold-300 text-[10px] font-bold">
                        {post.type}
                      </span>
                      <span className="text-xs font-bold text-slate-500 dark:text-gray-400">
                        {post.wilayaName} • {post.institutionName}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {post.title}
                    </h4>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono">{post.createdAt}</span>
                </div>

                <p className="text-xs leading-relaxed text-slate-700 dark:text-gray-300">
                  {post.content}
                </p>

                {post.location && (
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-900 text-[11px] font-bold text-slate-600 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-500" />
                    <span>{post.location}</span>
                  </div>
                )}

                {/* Teacher Endorsement & Comments */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{post.assignedTeacherName}</span>
                    </span>

                    <button
                      onClick={() =>
                        setActiveCommentPostId(
                          activeCommentPostId === post.id ? null : post.id
                        )
                      }
                      className="text-xs font-bold text-gold-600 dark:text-gold-400 hover:underline"
                    >
                      + {locale === 'ar' ? 'إضافة توجيه / تعليق' : 'Commenter'}
                    </button>
                  </div>

                  {/* Comment Input */}
                  {activeCommentPostId === post.id && (
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder={
                          locale === 'ar' ? 'اكتب ملاحظتك الأكاديمية...' : 'Votre remarque...'
                        }
                        className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-gray-700 text-xs text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold"
                      >
                        {locale === 'ar' ? 'إرسال' : 'Publier'}
                      </button>
                    </div>
                  )}

                  {/* Comments List */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {post.comments.map((comm) => (
                        <div
                          key={comm.id}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-900/60 text-xs text-slate-700 dark:text-gray-300"
                        >
                          <span className="font-bold text-slate-900 dark:text-white mr-2">
                            {comm.authorName}:
                          </span>
                          <span>{comm.content}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: STUDENT REVIEWS ================= */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {locale === 'ar' ? 'سجل تقييمات الطلبة وآرائهم المعتمدة' : 'Avis et Retours d\'Expérience'}
            </h3>
            <span className="text-xs font-bold text-gold-500 font-mono">
              ⭐ {currentAmbassador.ratingAverage} / 5.0 ({currentAmbassador.ratingsCount} avis)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(currentAmbassador.reviews || []).map((rev) => (
              <div
                key={rev.id}
                className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {rev.studentName}
                    </h4>
                    <p className="text-[10px] text-slate-400">{rev.institution}</p>
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(rev.score)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 dark:text-gray-300 leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 font-mono">
                  <span>{rev.createdAt}</span>
                  <span className="text-emerald-500 font-bold">✓ {locale === 'ar' ? 'طالب مؤكد' : 'Vérifié'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: NATIONAL AMBASSADOR DIRECTORY ================= */}
      {activeTab === 'network' && (
        <div className="space-y-4">
          <AmbassadorDirectory />
        </div>
      )}
    </div>
  );
}
