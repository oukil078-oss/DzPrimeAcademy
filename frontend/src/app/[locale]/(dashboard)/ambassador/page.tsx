'use client';

import React, { useState, useEffect } from 'react';
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
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Phone,
  Mail,
  Tag,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MetricsGrid, MetricCardItem } from '@/components/dashboard/MetricsGrid';
import { AmbassadorDirectory } from '@/components/ambassadors/AmbassadorDirectory';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isAmbassador, isTeacher } from '@/lib/rbac';
import { RECENT_POSTS, AMBASSADORS, CERTIFIED_TEACHERS, WILAYAS, getLocalizedWilayaName } from '@/lib/initial-data';
import { Post, PostType, PostComment, AmbassadorProfile, Locale } from '@/types';
import { formatDZD } from '@/lib/format';

type AmbassadorTab = 'workshops' | 'reviews' | 'network' | 'profile';

export default function AmbassadorDashboardPage() {
  const { t, locale } = useTranslation();
  const { currentUser, updateProfile } = useAuthStore();

  const [activeTab, setActiveTab] = useState<AmbassadorTab>('workshops');
  const [posts, setPosts] = useState<Post[]>(RECENT_POSTS);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('SESSION_SCHEDULE');
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('user-teacher');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(false);

  // Active comment input
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  // Ambassador Database Profile State
  const [dbAmbassador, setDbAmbassador] = useState<any>(null);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    wilayaCode: currentUser?.wilayaCode || 16,
    institutionName: currentUser?.institutionName || '',
    specialty: currentUser?.specialty || '',
    telegramHandle: '',
    bioAr: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '') as AmbassadorTab;
      if (['workshops', 'reviews', 'network', 'profile'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setProfileForm((prev) => ({
        ...prev,
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        wilayaCode: currentUser.wilayaCode || 16,
        institutionName: currentUser.institutionName || '',
        specialty: currentUser.specialty || '',
      }));

      fetch('/api/account')
        .then((r) => r.json())
        .then((data) => {
          if (data.ambassadorProfile) {
            setDbAmbassador(data.ambassadorProfile);
            setProfileForm((prev) => ({
              ...prev,
              telegramHandle: data.ambassadorProfile.telegramHandle || '',
              bioAr: data.ambassadorProfile.bioAr || '',
              institutionName: data.ambassadorProfile.institutionNameAr || prev.institutionName,
              specialty: data.ambassadorProfile.specialtyName || prev.specialty,
            }));
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  const isUserAmb = isAmbassador(currentUser?.role);
  const isUserTch = isTeacher(currentUser?.role);

  const defaultAmbassadorProfile: AmbassadorProfile = {
    id: 'amb-default',
    userId: currentUser?.id || 'user-ambassador',
    user: {
      id: currentUser?.id || 'user-ambassador',
      name: currentUser?.name || 'Ambassadeur DZ PRIME',
      email: currentUser?.email || 'ambassador@dzprime.academy',
      role: 'AMBASSADOR',
      phone: currentUser?.phone || '0555000000',
      createdAt: currentUser?.createdAt || '2026-01-01T00:00:00.000Z',
    },
    wilayaCode: currentUser?.wilayaCode || 16,
    wilayaNameAr: currentUser?.wilayaName || 'الجزائر',
    wilayaNameFr: 'Alger',
    institutionId: 'inst-usthb',
    institutionNameAr: currentUser?.institutionName || 'جامعة العلوم والتكنولوجيا هواري بومدين (USTHB)',
    institutionNameFr: 'USTHB Bab Ezzouar',
    specialtyName: currentUser?.specialty || 'Informatique & Sciences',
    telegramHandle: '@dzprime_ambassador',
    bioAr: 'سفير معتمد لمنصة DZ PRIME ACADEMY، أرافق الطلبة للتحضير والتميز الأكاديمي.',
    bioFr: "Ambassadeur certifié DZ PRIME ACADEMY, j'accompagne les étudiants vers l'excellence.",
    ratingAverage: 5.0,
    ratingsCount: 48,
    isVerified: true,
    upcomingSessionsCount: 3,
    totalTipsShared: 12,
    studentsMentoredCount: 1240,
    reviews: [
      {
        id: 'rev-1',
        studentName: 'Yacine B.',
        institution: 'USTHB',
        comment: 'سفير متميز وحصص مراجعة في القمة!',
        score: 5,
        createdAt: '2026-02-15T00:00:00.000Z',
      },
      {
        id: 'rev-2',
        studentName: 'Amira M.',
        institution: 'Fac Centrale',
        comment: 'Disponibilité et explications très claires.',
        score: 5,
        createdAt: '2026-02-20T00:00:00.000Z',
      },
    ],
  };

  const fallbackAmbassador: AmbassadorProfile =
    AMBASSADORS.find((a) => a.userId === currentUser?.id) || (AMBASSADORS.length > 0 ? AMBASSADORS[0] : defaultAmbassadorProfile);

  const currentPromoCode = dbAmbassador?.promoCode || `WIL${currentUser?.wilayaCode || 16}-VIP`;
  const currentCommission = dbAmbassador?.commissionDzd ?? 14500;
  const currentReferrals = dbAmbassador?.referralsCount ?? 29;

  const ambassadorMetrics: MetricCardItem[] = [
    {
      title: locale === 'ar' ? 'كود الترويج والعمولة' : 'Code Promo & Gains',
      value: currentPromoCode,
      change: formatDZD(currentCommission, locale as Locale),
      isPositive: true,
      icon: Tag,
      description: locale === 'ar' ? `إجمالي الإحالات: ${currentReferrals} مشترك` : `${currentReferrals} parrainages`,
    },
    {
      title: t('dashboards.ambassador.myRating'),
      value: `${dbAmbassador?.ratingAverage ?? fallbackAmbassador?.ratingAverage ?? 5.0} / 5.0`,
      change: '+0.15',
      isPositive: true,
      icon: Star,
      description: locale === 'ar' ? 'بناءً على تقييمات الطلبة المعتمدة' : 'Note certifiée des étudiants',
    },
    {
      title: t('dashboards.ambassador.scheduledSessions'),
      value: `${dbAmbassador?.upcomingSessionsCount ?? fallbackAmbassador?.upcomingSessionsCount ?? 3}`,
      change: 'Active',
      isPositive: true,
      icon: Calendar,
      description: locale === 'ar' ? 'حصص حضورية وافتراضية' : 'Séances actives',
    },
    {
      title: locale === 'ar' ? 'الطلبة المستفيدون' : 'Étudiants Accompagnés',
      value: `${fallbackAmbassador?.studentsMentoredCount || 1240}+`,
      change: '+150',
      isPositive: true,
      icon: Users,
      description: currentUser?.institutionName || fallbackAmbassador?.institutionNameAr || 'USTHB',
    },
  ];

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `${window.location.origin}/${locale}/ambassadors`
      );
      setCopiedLink(true);
      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#D4AF37', '#10B981', '#A3E635'],
        });
      } catch (e) {}
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyPromo = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentPromoCode);
      setCopiedPromo(true);
      try {
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#A3E635', '#10B981'],
        });
      } catch (e) {}
      setTimeout(() => setCopiedPromo(false), 2500);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess('');
    setProfileError('');

    const wilaya = WILAYAS.find((w) => w.code === Number(profileForm.wilayaCode));
    const payload = {
      ...profileForm,
      wilayaCode: Number(profileForm.wilayaCode),
      wilayaName: wilaya ? getLocalizedWilayaName(wilaya, locale as Locale) : undefined,
    };

    const res = await updateProfile(payload);
    setProfileSaving(false);
    if (res.success) {
      setProfileSuccess(locale === 'ar' ? 'تم حفظ بيانات السفير بنجاح ✓' : 'Profil ambassadeur mis à jour ✓');
      setTimeout(() => setProfileSuccess(''), 3500);
    } else {
      setProfileError(res.error || (locale === 'ar' ? 'فشل حفظ التعديلات' : 'Échec de la mise à jour'));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError(locale === 'ar' ? 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل' : 'Le mot de passe doit contenir au moins 6 caractères');
      setPasswordSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(locale === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Les mots de passe ne correspondent pas');
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || (locale === 'ar' ? 'فشل تغيير كلمة المرور' : 'Échec du changement'));
      } else {
        setPasswordSuccess(locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح! 🔒' : 'Mot de passe mis à jour avec succès ! 🔒');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 4000);
      }
    } catch (err: any) {
      setPasswordError(err?.message || (locale === 'ar' ? 'خطأ في الاتصال' : 'Erreur réseau'));
    } finally {
      setPasswordSaving(false);
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
      wilayaCode: currentUser?.wilayaCode || fallbackAmbassador?.wilayaCode || 16,
      wilayaName: currentUser?.wilayaName || fallbackAmbassador?.wilayaNameAr || 'Alger',
      institutionName: currentUser?.institutionName || fallbackAmbassador?.institutionNameAr || 'USTHB Bab Ezzouar',
      isOnline,
      location: isOnline ? undefined : location || 'Amphithéâtre C',
      isApproved: true,
      authorId: currentUser?.id || 'user-ambassador',
      authorName: currentUser?.name || 'Ambassadeur',
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
      authorName: currentUser?.name || (isUserTch ? 'Pr. Abdelrahim Kadri' : (fallbackAmbassador?.user?.name || 'Ambassadeur')),
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

  const handleTabClick = (tabId: AmbassadorTab) => {
    setActiveTab(tabId);
    window.history.replaceState(null, '', `#${tabId}`);
  };

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-arabic" data-testid="ambassador-dashboard-page">
      {/* ================= AMBASSADOR PROFILE HEADER HERO ================= */}
      <div className="relative p-5 sm:p-8 rounded-3xl bg-gradient-to-br from-[#060D1F] via-[#0B1530] to-[#040813] border border-gold-500/35 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-gold-500 via-amber-400 to-lime-400 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-[22px] bg-slate-950 text-gold-300 font-black flex items-center justify-center text-2xl sm:text-3xl font-sans">
                  {currentUser?.name?.charAt(0) || fallbackAmbassador?.user?.name?.charAt(0) || 'A'}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white">
                  {currentUser?.name || fallbackAmbassador?.user?.name || 'Ambassadeur DZ PRIME'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold">
                  {t('brand.verifiedAmbassador')}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-lime-400/20 text-lime-300 font-mono text-xs font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-lime-400" />
                  {currentPromoCode}
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-gold-400" />
                <span>{currentUser?.institutionName || fallbackAmbassador?.institutionNameAr}</span>
                <span>•</span>
                <span>Wilaya {currentUser?.wilayaCode || fallbackAmbassador?.wilayaCode} ({currentUser?.wilayaName || fallbackAmbassador?.wilayaNameAr})</span>
              </p>
              <p className="text-xs text-slate-400 font-mono">
                {locale === 'ar' ? 'معرف السفير:' : 'ID Ambassadeur:'} {currentUser?.studentCardId || 'DZ-AMB-16-0789'}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopyPromo}
              className="px-3.5 py-2.5 rounded-2xl bg-lime-400/15 hover:bg-lime-400/25 border border-lime-400/30 text-lime-300 text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              {copiedPromo ? (
                <>
                  <Check className="w-4 h-4 text-lime-300" />
                  <span>{locale === 'ar' ? 'تم نسخ الكود!' : 'Code copié!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-lime-400" />
                  <span>{locale === 'ar' ? `نسخ الكود (${currentPromoCode})` : `Copier ${currentPromoCode}`}</span>
                </>
              )}
            </button>

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
                  <Share2 className="w-4 h-4 text-gold-400" />
                  <span>{locale === 'ar' ? 'مشاركة المنصة' : 'Partager'}</span>
                </>
              )}
            </button>

            <Link
              href={`/${locale}/card`}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-2 transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>{locale === 'ar' ? 'بطاقتي الرقمية' : 'Ma Carte ID'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ================= KPI METRICS GRID ================= */}
      <MetricsGrid metrics={ambassadorMetrics} />

      {/* ================= DASHBOARD NAVIGATION TABS ================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleTabClick('workshops')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'workshops'
              ? 'bg-slate-950 dark:bg-lime-400 text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{locale === 'ar' ? 'إدارة الورشات والمنشورات' : 'Ateliers & Publications'}</span>
        </button>

        <button
          onClick={() => handleTabClick('reviews')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'reviews'
              ? 'bg-slate-950 dark:bg-lime-400 text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{locale === 'ar' ? 'تقييمات وآراء الطلبة' : 'Avis des Étudiants'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-gold-500/20 text-gold-600 dark:text-gold-300 text-[10px] font-mono font-bold">
            {fallbackAmbassador?.reviews?.length || 3}
          </span>
        </button>

        <button
          onClick={() => handleTabClick('network')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'network'
              ? 'bg-slate-950 dark:bg-lime-400 text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{locale === 'ar' ? 'دليل السفراء (58 ولاية)' : 'Annuaire National'}</span>
        </button>

        <button
          data-testid="ambassador-tab-profile"
          onClick={() => handleTabClick('profile')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'profile'
              ? 'bg-slate-950 dark:bg-lime-400 text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-lime-500" />
          <span>{locale === 'ar' ? 'الملف الأكاديمي والأمان' : 'Profil & Sécurité'}</span>
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
                        : "Ex: Amphi C - Faculté d'Informatique"
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
              {locale === 'ar' ? 'سجل تقييمات الطلبة وآرائهم المعتمدة' : "Avis et Retours d'Expérience"}
            </h3>
            <span className="text-xs font-bold text-gold-500 font-mono">
              ⭐ {fallbackAmbassador?.ratingAverage ?? 5.0} / 5.0 ({fallbackAmbassador?.ratingsCount ?? 0} avis)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(fallbackAmbassador?.reviews || []).map((rev) => (
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

      {/* ================= TAB 4: AMBASSADOR PROFILE & SECURITY SETTINGS ================= */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" data-testid="ambassador-profile-tab">
          {/* Ambassador ID & Promo Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0B1530] via-[#101E42] to-[#080D1D] border border-gold-500/40 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-gold-500 via-amber-400 to-lime-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
                {currentUser?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black">{currentUser?.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 text-[10px] font-bold">
                    ✓ {locale === 'ar' ? 'سفير ولاية معتمد' : 'Ambassadeur Officiel'}
                  </span>
                </div>
                <div className="text-xs text-gray-300 font-mono mt-0.5">
                  <span>ID: {currentUser?.studentCardId || 'DZ-AMB-16-0789'}</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span>{currentUser?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-white/5 px-3.5 py-2 rounded-2xl border border-white/10 text-xs font-mono">
                <span className="text-gray-400 text-[10px] block">{locale === 'ar' ? 'كود الترويج الخاص بك:' : 'Code Promo:'}</span>
                <span className="text-lime-300 font-black text-sm">{currentPromoCode}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Edit Profile Form */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm">
                <UserCheck className="w-4 h-4 text-lime-500" />
                <span>{locale === 'ar' ? 'تعديل بيانات السفير الأكاديمية' : 'Modifier le profil ambassadeur'}</span>
              </div>

              {profileSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{profileSuccess}</span>
                </div>
              )}
              {profileError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{profileError}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                    {locale === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                  </label>
                  <input
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'الهاتف (واتساب)' : 'Téléphone (WhatsApp)'}
                    </label>
                    <input
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      dir="ltr"
                      placeholder="0555 12 34 56"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-lime-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'الولاية' : 'Wilaya'}
                    </label>
                    <select
                      value={profileForm.wilayaCode}
                      onChange={(e) => setProfileForm({ ...profileForm, wilayaCode: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0E1528] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                    >
                      {WILAYAS.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {getLocalizedWilayaName(w, locale as Locale)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                    {locale === 'ar' ? 'المؤسسة / الجامعة / الثانوية' : 'Université ou Lycée'}
                  </label>
                  <input
                    value={profileForm.institutionName}
                    onChange={(e) => setProfileForm({ ...profileForm, institutionName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'التخصص / الشعبة' : 'Spécialité'}
                    </label>
                    <input
                      value={profileForm.specialty}
                      onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
                      placeholder="Informatique, BAC Math..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'معرف تليغرام' : 'Telegram'}
                    </label>
                    <input
                      value={profileForm.telegramHandle}
                      onChange={(e) => setProfileForm({ ...profileForm, telegramHandle: e.target.value })}
                      placeholder="username"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-lime-400"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-60"
                  >
                    {profileSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{locale === 'ar' ? 'حفظ تعديلات الملف' : 'Sauvegarder'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Form */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm">
                <KeyRound className="w-4 h-4 text-lime-500" />
                <span>{locale === 'ar' ? 'تغيير كلمة المرور والأمان' : 'Modifier le mot de passe'}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400">
                {locale === 'ar'
                  ? 'يُنصح بتغيير كلمة المرور المؤقتة التي استلمتها من الإدارة لضمان أمان حسابك.'
                  : 'Modifiez votre mot de passe temporaire pour sécuriser vos accès.'}
              </p>

              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{passwordSuccess}</span>
                </div>
              )}
              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                    {locale === 'ar' ? 'كلمة المرور الحالية' : 'Mot de passe actuel'}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                    {locale === 'ar' ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      placeholder="•••••••• (6 أحرف على الأقل)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                    {locale === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirmer le nouveau mot de passe'}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-60"
                  >
                    {passwordSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                    <span>{locale === 'ar' ? 'تحديث كلمة المرور' : 'Modifier mot de passe'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
