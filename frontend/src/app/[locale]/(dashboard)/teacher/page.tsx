'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Video, Users2, FolderOpen, BookOpen, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { usePlatformStore } from '@/lib/platformStore';
import { formatDZD } from '@/lib/format';

type TeacherTab = 'studio' | 'courses' | 'sessions' | 'roster' | 'drive';

export default function TeacherStudioPage() {
  const { locale } = useTranslation();
  const { currentUser } = useAuthStore();
  const { courses, sessions, addCourse, addSession, removeCourse } = usePlatformStore();
  const [tab, setTab] = useState<TeacherTab>('studio');
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ titleAr: '', titleFr: '', category: 'UNIVERSITY_LMD' as const, priceDzd: 3000, lessonsCount: 10 });

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '') as TeacherTab;
      if (['studio', 'courses', 'sessions', 'roster', 'drive'].includes(hash)) setTab(hash);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

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

  const tabs: { id: TeacherTab; icon: any; labelAr: string; labelFr: string }[] = [
    { id: 'studio', icon: Sparkles, labelAr: 'استوديو التدريس', labelFr: 'Studio' },
    { id: 'courses', icon: BookOpen, labelAr: 'مقرراتي ومقاييسي', labelFr: 'Mes Modules' },
    { id: 'sessions', icon: Video, labelAr: 'الحصص المباشرة', labelFr: 'Sessions' },
    { id: 'roster', icon: Users2, labelAr: 'قائمة الطلبة', labelFr: 'Roster' },
    { id: 'drive', icon: FolderOpen, labelAr: 'المطبوعات', labelFr: 'Drive' },
  ];

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-arabic" data-testid="teacher-studio-page">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-lime-500" />
          <span>{locale === 'ar' ? `استوديو التدريس — ${currentUser?.name || ''}` : `Studio Enseignant — ${currentUser?.name || ''}`}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
          {locale === 'ar' ? 'أنشئ مقررات جديدة، جدول حصصك المباشرة، وتابع طلبتك في الوقت الفعلي.' : 'Créez des modules, planifiez vos sessions live, suivez vos étudiants en temps réel.'}
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
          {mySessions.map((s) => (
            <div key={s.id} data-testid={`teacher-session-${s.id}`} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800">
              <Video className="w-4 h-4 text-lime-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.title}</h4>
                <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">{new Date(s.scheduledAt).toLocaleString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ')}</p>
              </div>
            </div>
          ))}
          {mySessions.length === 0 && (
            <p className="text-xs text-slate-400 py-8 text-center">{locale === 'ar' ? 'لا توجد حصص مجدولة بعد.' : 'Aucune session planifiée.'}</p>
          )}
        </motion.div>
      )}

      {tab === 'roster' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-2xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400" data-testid="teacher-roster-placeholder">
          {locale === 'ar' ? 'ستظهر قائمة الطلبة المسجلين وحضورهم هنا فور تسجيلهم في مقرراتك.' : 'La liste des étudiants inscrits et leur présence apparaîtra ici.'}
        </motion.div>
      )}

      {tab === 'drive' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-2xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400" data-testid="teacher-drive-placeholder">
          {locale === 'ar' ? 'مساحة رفع المطبوعات والسلاسل التمرينية قريباً.' : 'Espace de dépôt des supports et séries bientôt disponible.'}
        </motion.div>
      )}
    </div>
  );
}
