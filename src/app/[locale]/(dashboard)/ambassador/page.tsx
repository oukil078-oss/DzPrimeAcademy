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
  GraduationCap,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { MetricsGrid, MetricCardItem } from '@/components/dashboard/MetricsGrid';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isAmbassador, isTeacher } from '@/lib/rbac';
import { RECENT_POSTS, AMBASSADORS, CERTIFIED_TEACHERS } from '@/lib/initial-data';
import { Post, PostType, PostComment } from '@/types';
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
  const [selectedTeacherId, setSelectedTeacherId] = useState('user-teacher');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // State for active comment input on posts
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const isUserAmb = isAmbassador(currentUser?.role);
  const isUserTch = isTeacher(currentUser?.role);

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

    const teacherObj = CERTIFIED_TEACHERS.find((tch) => tch.id === selectedTeacherId);

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
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;

    const isVerifiedTeacher = isUserTch;
    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      authorId: currentUser?.id || 'user-guest',
      authorName: currentUser?.name || (isUserTch ? 'Pr. Abdelrahim Kadri' : 'Membre DZ Prime'),
      authorRole: currentUser?.role || 'STUDENT_FREE',
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
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Notice if not signed in as Ambassador or Teacher */}
      {!isUserAmb && !isUserTch && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-gold-500/20 to-transparent border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left font-arabic">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 shrink-0 font-bold">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-emerald-200">
                {locale === 'ar' ? 'معاينة ورشات السفراء وتوجيهات الأساتذة' : 'Aperçu des Masterclasses & Publications'}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-gray-300">
                {locale === 'ar'
                  ? 'يمكنك التبديل إلى دور السفير لنشر ورشة، أو دور الأستاذ للتعليق البيداغوجي المعتمد.'
                  : 'Passez au profil Ambassadeur pour planifier des masterclasses, ou Enseignant pour ajouter des directives certifiées.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => switchRole('AMBASSADOR')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-xs shadow-sm active:scale-95 transition-all touch-target"
            >
              <span>{locale === 'ar' ? 'تجربة كسفير' : 'Mode Ambassadeur'}</span>
            </button>
            <button
              onClick={() => switchRole('TEACHER')}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow active:scale-95 transition-all touch-target"
            >
              <span>{locale === 'ar' ? 'تجربة كأستاذ' : 'Mode Enseignant'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 dark:border-gold-500/25 pb-4 sm:pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 sm:p-2 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-700 dark:text-gold-400">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h1 className="text-xl sm:text-3xl font-black font-arabic text-slate-900 dark:text-white">
              {t('dashboards.ambassador.title')} & Masterclasses
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic mt-1">
            {t('dashboards.ambassador.myScope')}: {currentUser?.institutionName || 'USTHB Bab Ezzouar'} (Wilaya {currentUser?.wilayaCode || 16})
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-arabic text-xs font-bold shadow-sm self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          <span>{t('dashboards.ambassador.badge')}</span>
        </div>
      </div>

      {/* Metrics */}
      <MetricsGrid metrics={ambassadorMetrics} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left: Create Post / Masterclass Form */}
        <div className="lg:col-span-6 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left font-arabic">
          <div className="flex items-center gap-2 mb-4 text-gold-700 dark:text-gold-300 font-bold">
            <PlusCircle className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            <h3>{locale === 'ar' ? 'برمجة ورشة / حصة مراجعة مع أستاذ المقياس' : 'Planifier une Session / Masterclass avec un Enseignant'}</h3>
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
                placeholder={locale === 'ar' ? 'مثال: ورشة حل مسائل Analyse 1 بحضور أستاذ المقياس' : 'Ex: Masterclass Analyse 1 avec Pr. Kadri'}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-medium"
                required
              />
            </div>

            {/* Teacher Selection Dropdown */}
            <div>
              <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-gold-500" />
                <span>{locale === 'ar' ? 'الأستاذ المؤطر للورشة / المقياس:' : 'Enseignant Superviseur du Cours :'}</span>
              </label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-gold-500"
              >
                {CERTIFIED_TEACHERS.map((tch) => (
                  <option key={tch.id} value={tch.id}>
                    {tch.name} ({tch.specialty} • {tch.institution})
                  </option>
                ))}
              </select>
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
                  <option value="SESSION_SCHEDULE">Masterclass / Revision Session</option>
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
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs shadow-gold-glow flex items-center justify-center gap-2 active:scale-95 transition-all touch-target"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-navy-950" />
                  <span>{t('dashboards.ambassador.publishedSuccess')}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{locale === 'ar' ? 'نشر وتثبيت الورشة' : 'Publier la Session'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Posts Feed & Teacher Comments Thread */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left font-arabic">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4">
              {locale === 'ar' ? 'منشورات الورشات وتوجيهات الأساتذة' : 'Publications & Directives Pédagogiques'} ({posts.length})
            </h3>

            <div className="space-y-4">
              {posts.map((p) => {
                const isWritingComment = activeCommentPostId === p.id;

                return (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-gray-800 space-y-3"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gold-700 dark:text-gold-400 font-bold text-xs">{p.title}</span>
                      <span className="text-slate-400 dark:text-gray-400 font-mono">{p.createdAt}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed">
                      {p.content}
                    </p>

                    {/* Assigned Teacher Badge */}
                    {p.assignedTeacherName && (
                      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-xs font-bold">
                          <GraduationCap className="w-4 h-4" />
                          <span>{locale === 'ar' ? `الأستاذ المؤطر: ${p.assignedTeacherName}` : `Enseignant Responsable: ${p.assignedTeacherName}`}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-800 dark:text-purple-200 text-[10px] font-semibold">
                          Certifié ✓
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
                      <span>{p.isOnline ? '🌐 Online (Zoom)' : `🏛️ ${p.location || 'In-Person'}`}</span>
                      <span className="font-semibold text-slate-700 dark:text-gray-300">{p.authorName}</span>
                    </div>

                    {/* Comments & Teacher Remarks Section */}
                    <div className="pt-3 border-t border-slate-200 dark:border-gray-800/80 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-gray-200 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-gold-500" />
                          <span>{locale === 'ar' ? 'توجيهات الأساتذة والتعليقات' : 'Remarques & Directives'} ({(p.comments || []).length})</span>
                        </span>

                        <button
                          onClick={() => setActiveCommentPostId(isWritingComment ? null : p.id)}
                          className="text-[11px] font-bold text-gold-600 dark:text-gold-400 hover:underline flex items-center gap-1"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>{isWritingComment ? (locale === 'ar' ? 'إلغاء' : 'Fermer') : (locale === 'ar' ? 'إضافة تعليق / توجيه' : 'Ajouter une remarque')}</span>
                        </button>
                      </div>

                      {/* Comment Input Box */}
                      {isWritingComment && (
                        <div className="p-3 rounded-xl bg-white dark:bg-navy-900 border border-gold-500/40 space-y-2">
                          {isUserTch && (
                            <div className="flex items-center gap-1.5 text-[11px] text-purple-600 dark:text-purple-300 font-bold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              <span>{locale === 'ar' ? 'أنت تعلق بصفتك أستاذ معتمد (سيظهر التعليق بختم بيداغوجي رسمي)' : 'Vous commentez en tant qu\'Enseignant Certifié'}</span>
                            </div>
                          )}
                          <textarea
                            rows={2}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder={isUserTch ? (locale === 'ar' ? 'أضف توجيهات بيداغوجية، تمارين موصى بها، أو تنبيهات للطلبة...' : 'Ajoutez vos directives, conseils ou séries d\'exercices...') : (locale === 'ar' ? 'اكتب تعليقك هنا...' : 'Votre commentaire...')}
                            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-gray-700 text-xs focus:outline-none focus:border-gold-500"
                          />
                          <button
                            onClick={() => handleAddComment(p.id)}
                            className="px-3.5 py-1.5 rounded-lg bg-gold-500 text-navy-950 text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{locale === 'ar' ? 'إرسال التوجيه' : 'Publier'}</span>
                          </button>
                        </div>
                      )}

                      {/* Render Comments */}
                      {(p.comments || []).length > 0 && (
                        <div className="space-y-2">
                          {(p.comments || []).map((comm) => (
                            <div
                              key={comm.id}
                              className={`p-2.5 rounded-xl text-xs space-y-1 ${
                                comm.isVerifiedTeacher
                                  ? 'bg-purple-500/10 border border-purple-500/30'
                                  : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800'
                              }`}
                            >
                              <div className="flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <strong className={comm.isVerifiedTeacher ? 'text-purple-700 dark:text-purple-300 font-bold' : 'text-slate-900 dark:text-white'}>
                                    {comm.authorName}
                                  </strong>
                                  {comm.isVerifiedTeacher && (
                                    <span className="px-1.5 py-0.2 rounded-md bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[9px] font-bold">
                                      {locale === 'ar' ? 'أستاذ معتمد ✓' : 'Professeur Vérifié ✓'}
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">{comm.createdAt}</span>
                              </div>
                              <p className="text-[11px] text-slate-700 dark:text-gray-300 leading-relaxed">
                                {comm.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
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
                { name: 'Amine B. (USTHB)', comment: 'Excellente séance de révision en Algorithmique 1 avec les conseils du professeur Kadri !', rating: 5 },
                { name: 'Meriem K. (Constantine 1)', comment: 'Les annales corrigées d\'Analyse 1 nous ont énormément aidés pour le partiel.', rating: 5 },
                { name: 'Walid A. (USTO Oran)', comment: 'Organisation impeccable et grand soutien aux étudiants de la faculté.', rating: 5 },
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
