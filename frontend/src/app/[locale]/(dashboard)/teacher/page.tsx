'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Video,
  Users2,
  FolderOpen,
  BookOpen,
  Trash2,
  UserCheck,
  KeyRound,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  CreditCard,
  Building2,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { usePlatformStore } from '@/lib/platformStore';
import { formatDZD } from '@/lib/format';
import { TeacherRosterPanel } from '@/components/dashboard/TeacherRosterPanel';
import { WILAYAS, getLocalizedWilayaName } from '@/lib/initial-data';

type TeacherTab = 'studio' | 'courses' | 'sessions' | 'roster' | 'drive' | 'profile';

export default function TeacherStudioPage() {
  const { locale } = useTranslation();
  const { currentUser, updateProfile } = useAuthStore();
  const { courses, sessions, addCourse, addSession, removeCourse } = usePlatformStore();
  const [tab, setTab] = useState<TeacherTab>('studio');

  // Course Form
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ titleAr: '', titleFr: '', category: 'UNIVERSITY_LMD' as const, priceDzd: 3000, lessonsCount: 10 });

  // Session Form
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionForm, setSessionForm] = useState({ title: '', scheduledAt: '', durationMinutes: 60, platform: 'GOOGLE_MEET' as const, category: 'UNIVERSITY_LMD' as const });
  const [sessionFormError, setSessionFormError] = useState('');
  const minDateTime = new Date().toISOString().slice(0, 16);

  // Profile & Teacher Settings Form
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    wilayaCode: currentUser?.wilayaCode || 16,
    university: currentUser?.institutionName || '',
    specialty: currentUser?.specialty || '',
    ccpAccount: '',
    ccpCle: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Change Form
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
      const hash = window.location.hash.replace('#', '') as TeacherTab;
      if (['studio', 'courses', 'sessions', 'roster', 'drive', 'profile'].includes(hash)) setTab(hash);
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
        university: currentUser.institutionName || '',
        specialty: currentUser.specialty || '',
      }));

      fetch('/api/account')
        .then((r) => r.json())
        .then((data) => {
          if (data.teacherProfile) {
            setProfileForm((prev) => ({
              ...prev,
              ccpAccount: data.teacherProfile.ccpAccount || '',
              ccpCle: data.teacherProfile.ccpCle || '',
              university: data.teacherProfile.university || prev.university,
              specialty: data.teacherProfile.specialty || prev.specialty,
            }));
          }
        })
        .catch(() => {});
    }
  }, [currentUser]);

  const myCourses = courses.filter((c) => c.teacherName === currentUser?.name || c.teacherId === currentUser?.id);
  const mySessions = sessions.filter((s) => s.teacherName === currentUser?.name || s.teacherId === currentUser?.id);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCourse({
      ...courseForm,
      teacherId: currentUser?.id || null,
      teacherName: currentUser?.name || 'Enseignant',
      isLive: true,
      colorTheme: 'lime',
    });
    setCourseForm({ titleAr: '', titleFr: '', category: 'UNIVERSITY_LMD', priceDzd: 3000, lessonsCount: 10 });
    setShowCourseForm(false);
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSessionFormError('');
    if (!sessionForm.title || !sessionForm.scheduledAt) return;
    const result = await addSession({
      ...sessionForm,
      scheduledAt: new Date(sessionForm.scheduledAt).toISOString(),
      teacherId: currentUser?.id || null,
      teacherName: currentUser?.name || 'Enseignant',
      meetUrl: null,
      wilayaCode: null,
    });
    if (result.success) {
      setSessionForm({ title: '', scheduledAt: '', durationMinutes: 60, platform: 'GOOGLE_MEET', category: 'UNIVERSITY_LMD' });
      setShowSessionForm(false);
    } else {
      setSessionFormError(result.error || (locale === 'ar' ? 'فشل جدولة الحصة' : 'Échec de la planification'));
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
      wilayaName: wilaya ? getLocalizedWilayaName(wilaya, locale) : undefined,
      institutionName: profileForm.university,
    };

    const res = await updateProfile(payload);
    setProfileSaving(false);
    if (res.success) {
      setProfileSuccess(locale === 'ar' ? 'تم حفظ بيانات الأستاذ بنجاح ✓' : 'Profil enseignant mis à jour ✓');
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

  const tabs: { id: TeacherTab; icon: any; labelAr: string; labelFr: string }[] = [
    { id: 'studio', icon: Sparkles, labelAr: 'استوديو التدريس', labelFr: 'Studio' },
    { id: 'courses', icon: BookOpen, labelAr: 'مقرراتي ومقاييسي', labelFr: 'Mes Modules' },
    { id: 'sessions', icon: Video, labelAr: 'الحصص المباشرة', labelFr: 'Sessions' },
    { id: 'roster', icon: Users2, labelAr: 'قائمة الطلبة', labelFr: 'Roster' },
    { id: 'drive', icon: FolderOpen, labelAr: 'المطبوعات', labelFr: 'Drive' },
    { id: 'profile', icon: UserCheck, labelAr: 'الملف الأكاديمي والأمان', labelFr: 'Profil & Sécurité' },
  ];

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-arabic" data-testid="teacher-studio-page">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-lime-500" />
          <span>{locale === 'ar' ? `استوديو التدريس — ${currentUser?.name || ''}` : `Studio Enseignant — ${currentUser?.name || ''}`}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
          {locale === 'ar' ? 'أنشئ مقررات جديدة، جدول حصصك المباشرة، وتابع طلبتك وإعدادات أمان حسابك في الوقت الفعلي.' : 'Créez des modules, planifiez vos sessions live, gérez vos identifiants et votre profil.'}
        </p>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar" data-testid="teacher-tabs">
        {tabs.map((tItem) => {
          const Icon = tItem.icon;
          const active = tab === tItem.id;
          return (
            <button
              key={tItem.id}
              data-testid={`teacher-tab-${tItem.id}`}
              onClick={() => {
                setTab(tItem.id);
                window.history.replaceState(null, '', `#${tItem.id}`);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                active ? 'bg-slate-950 dark:bg-lime-400 text-white dark:text-slate-950' : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? tItem.labelAr : tItem.labelFr}</span>
            </button>
          );
        })}
      </div>

      {(tab === 'studio' || tab === 'courses') && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {locale === 'ar' ? 'مقرراتي المنشورة' : 'Mes Modules Publiés'}
            </h3>
            <button
              data-testid="teacher-add-course-btn"
              onClick={() => setShowCourseForm(!showCourseForm)}
              className="px-3.5 py-2 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'إضافة مقرر جديد' : 'Ajouter un Module'}</span>
            </button>
          </div>

          {showCourseForm && (
            <form onSubmit={handleAddCourse} data-testid="teacher-course-form" className="p-4 rounded-2xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input required placeholder={locale === 'ar' ? 'العنوان (عربي)' : 'Titre (AR)'} value={courseForm.titleAr} onChange={(e) => setCourseForm({ ...courseForm, titleAr: e.target.value })} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs" />
              <input placeholder="Titre (FR)" value={courseForm.titleFr} onChange={(e) => setCourseForm({ ...courseForm, titleFr: e.target.value })} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs" />
              <select value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value as any })} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                <option value="UNIVERSITY_LMD">University LMD</option>
                <option value="BAC">BAC</option>
                <option value="MEDICAL">Medical</option>
              </select>
              <input type="number" placeholder="Prix DZD" value={courseForm.priceDzd} onChange={(e) => setCourseForm({ ...courseForm, priceDzd: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs" />
              <input type="number" placeholder="Lessons" value={courseForm.lessonsCount} onChange={(e) => setCourseForm({ ...courseForm, lessonsCount: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs" />
              <button type="submit" data-testid="teacher-submit-course-btn" className="py-2 rounded-xl bg-lime-400 text-slate-950 font-black text-xs">
                {locale === 'ar' ? 'نشر فوراً' : 'Publier'}
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {myCourses.map((c) => (
              <div key={c.id} data-testid={`teacher-course-card-${c.id}`} className="p-4 rounded-2xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-lg bg-lime-500/15 text-lime-700 dark:text-lime-300 text-[10px] font-bold">{c.category}</span>
                  <button data-testid={`teacher-remove-course-${c.id}`} onClick={() => removeCourse(c.id)} className="p-1 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{locale === 'ar' ? c.titleAr : c.titleFr || c.titleAr}</h4>
                <p className="text-[10px] text-slate-500 dark:text-gray-400">{c.lessonsCount} {locale === 'ar' ? 'حصة' : 'leçons'}</p>
                <p className="text-xs font-mono font-bold text-lime-600 dark:text-lime-400">{formatDZD(c.priceDzd, locale)}</p>
              </div>
            ))}
            {myCourses.length === 0 && (
              <p className="text-xs text-slate-400 py-8 text-center sm:col-span-3">
                {locale === 'ar' ? 'لم تنشر أي مقرر بعد. أضف مقررك الأول الآن!' : 'Aucun module publié. Ajoutez votre premier module !'}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {tab === 'sessions' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {locale === 'ar' ? 'حصصي المباشرة' : 'Mes Sessions Live'}
            </h3>
            <button
              data-testid="teacher-add-session-btn"
              onClick={() => setShowSessionForm(!showSessionForm)}
              className="px-3.5 py-2 rounded-xl bg-lime-400 text-slate-950 font-black text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'جدولة حصة جديدة' : 'Planifier une Session'}</span>
            </button>
          </div>

          {showSessionForm && (
            <form onSubmit={handleAddSession} data-testid="teacher-session-form" className="p-4 rounded-2xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {sessionFormError && (
                <p data-testid="teacher-session-error" className="sm:col-span-3 text-[11px] font-bold text-rose-500">{sessionFormError}</p>
              )}
              <input required placeholder={locale === 'ar' ? 'عنوان الحصة' : 'Titre de la session'} value={sessionForm.title} onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:col-span-2" />
              <input required type="datetime-local" min={minDateTime} value={sessionForm.scheduledAt} onChange={(e) => setSessionForm({ ...sessionForm, scheduledAt: e.target.value })} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs" />
              <select value={sessionForm.platform} onChange={(e) => setSessionForm({ ...sessionForm, platform: e.target.value as any })} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                <option value="GOOGLE_MEET">Google Meet</option>
                <option value="CLASSROOM">Classroom</option>
                <option value="ONSITE">{locale === 'ar' ? 'حضوري' : 'Présentiel'}</option>
              </select>
              <select value={sessionForm.category} onChange={(e) => setSessionForm({ ...sessionForm, category: e.target.value as any })} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
                <option value="UNIVERSITY_LMD">University LMD</option>
                <option value="BAC">BAC</option>
                <option value="MEDICAL">Medical</option>
              </select>
              <input type="number" placeholder={locale === 'ar' ? 'المدة (دقيقة)' : 'Durée (min)'} value={sessionForm.durationMinutes} onChange={(e) => setSessionForm({ ...sessionForm, durationMinutes: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs" />
              <button type="submit" data-testid="teacher-submit-session-btn" className="py-2 rounded-xl bg-lime-400 text-slate-950 font-black text-xs">
                {locale === 'ar' ? 'نشر الحصة' : 'Publier'}
              </button>
            </form>
          )}

          {mySessions.map((s) => (
            <div key={s.id} data-testid={`teacher-session-${s.id}`} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800">
              <Video className="w-4 h-4 text-lime-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.title}</h4>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">{new Date(s.scheduledAt).toLocaleString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ')}</p>
              </div>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-lime-500/15 text-lime-700 dark:text-lime-300 text-[10px] font-bold shrink-0">
                <Users2 className="w-3 h-3" /> {s.registrationsCount ?? 0}
              </span>
            </div>
          ))}
          {mySessions.length === 0 && (
            <p className="text-xs text-slate-400 py-8 text-center">{locale === 'ar' ? 'لا توجد حصص مجدولة بعد.' : 'Aucune session planifiée.'}</p>
          )}
        </motion.div>
      )}

      {tab === 'roster' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <TeacherRosterPanel locale={locale} />
        </motion.div>
      )}

      {tab === 'drive' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-2xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400" data-testid="teacher-drive-placeholder">
          {locale === 'ar' ? 'مساحة رفع المطبوعات والسلاسل التمرينية قريباً.' : 'Espace de dépôt des supports et séries bientôt disponible.'}
        </motion.div>
      )}

      {/* Profile & Security Tab for Teachers */}
      {tab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6" data-testid="teacher-profile-tab">
          {/* Official Teacher Card Badge */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0E162B] via-[#101B34] to-[#0A1020] border border-lime-500/30 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lime-400 to-emerald-400 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
                {currentUser?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black">{currentUser?.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-lime-400/20 border border-lime-400/40 text-lime-300 text-[10px] font-bold">
                    ✓ {locale === 'ar' ? 'أستاذ معتمد' : 'Enseignant Agréé'}
                  </span>
                </div>
                <div className="text-xs text-gray-300 font-mono mt-0.5">
                  <span>ID: {currentUser?.studentCardId || 'DZ-TCH-16-0000'}</span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span>{currentUser?.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 px-3 py-2 rounded-xl border border-white/10 shrink-0">
              <Building2 className="w-4 h-4 text-lime-400" />
              <span>{profileForm.university || (locale === 'ar' ? 'جامعة معتمدة' : 'Université')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Edit Profile Form */}
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm">
                <UserCheck className="w-4 h-4 text-lime-500" />
                <span>{locale === 'ar' ? 'تعديل البيانات الأكاديمية والمهنية' : 'Modifier le profil académique'}</span>
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
                      {locale === 'ar' ? 'الهاتف (واتساب)' : 'Téléphone'}
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
                          {w.code} - {getLocalizedWilayaName(w, locale)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                    {locale === 'ar' ? 'الجامعة / الكلية' : 'Université / Faculté'}
                  </label>
                  <input
                    value={profileForm.university}
                    onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                    {locale === 'ar' ? 'التخصص الأكاديمي / المواد' : 'Spécialité'}
                  </label>
                  <input
                    value={profileForm.specialty}
                    onChange={(e) => setProfileForm({ ...profileForm, specialty: e.target.value })}
                    placeholder="Mathématiques, Informatique..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                {/* CCP Details */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center gap-1.5 text-lime-600 dark:text-lime-400 font-bold text-[11px]">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>{locale === 'ar' ? 'حساب تسوية المستحقات (CCP)' : 'Compte CCP'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <input
                        placeholder="0012345678"
                        value={profileForm.ccpAccount}
                        onChange={(e) => setProfileForm({ ...profileForm, ccpAccount: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>
                    <div>
                      <input
                        placeholder="Clé 99"
                        maxLength={2}
                        value={profileForm.ccpCle}
                        onChange={(e) => setProfileForm({ ...profileForm, ccpCle: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 font-mono text-center text-xs text-slate-900 dark:text-white focus:outline-none focus:border-lime-400"
                      />
                    </div>
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
                  ? 'يُنصح بتغيير كلمة المرور المؤقتة التي استلمتها من الإدارة عند تسجيل دخولك الأول.'
                  : 'Changez votre mot de passe temporaire pour sécuriser vos accès.'}
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
