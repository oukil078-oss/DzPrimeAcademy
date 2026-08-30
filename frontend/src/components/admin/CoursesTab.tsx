'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Layers, BookOpen } from 'lucide-react';
import { usePlatformStore } from '@/lib/platformStore';
import { formatDZD } from '@/lib/format';

interface CoursesTabProps {
  locale: string;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({ locale }) => {
  const { courses, addCourse, removeCourse } = usePlatformStore();
  const [modules, setModules] = useState<any[]>([]);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [courseForm, setCourseForm] = useState({ titleAr: '', titleFr: '', teacherName: '', category: 'UNIVERSITY_LMD' as const, priceDzd: 3000, lessonsCount: 10, isLive: true, colorTheme: 'lime' });
  const [moduleForm, setModuleForm] = useState({ nameAr: '', nameFr: '', code: '', coefficient: 2, trackType: 'UNIVERSITY_LMD' as const });

  const loadModules = () => fetch('/api/modules').then((r) => r.json()).then(setModules);

  useEffect(() => {
    loadModules();
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCourse(courseForm);
    setCourseForm({ titleAr: '', titleFr: '', teacherName: '', category: 'UNIVERSITY_LMD', priceDzd: 3000, lessonsCount: 10, isLive: true, colorTheme: 'lime' });
    setShowCourseForm(false);
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/modules', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(moduleForm) });
    setModuleForm({ nameAr: '', nameFr: '', code: '', coefficient: 2, trackType: 'UNIVERSITY_LMD' });
    setShowModuleForm(false);
    loadModules();
  };

  const handleDeleteModule = async (id: string) => {
    await fetch(`/api/modules?id=${id}`, { method: 'DELETE' });
    loadModules();
  };

  return (
    <div className="space-y-8" data-testid="courses-tab">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-lime-400" />
            {locale === 'ar' ? 'دورات الامتياز (+ إضافة مقرر جديد)' : 'Dawarat Excellence (Live Courses)'}
          </h3>
          <button data-testid="add-course-btn" onClick={() => setShowCourseForm(!showCourseForm)} className="px-3.5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'إضافة مقرر جديد' : 'Ajouter'}</span>
          </button>
        </div>

        {showCourseForm && (
          <form onSubmit={handleAddCourse} data-testid="add-course-form" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input required placeholder={locale === 'ar' ? 'العنوان (عربي)' : 'Titre (AR)'} value={courseForm.titleAr} onChange={(e) => setCourseForm({ ...courseForm, titleAr: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
            <input placeholder="Titre (FR)" value={courseForm.titleFr} onChange={(e) => setCourseForm({ ...courseForm, titleFr: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
            <input required placeholder={locale === 'ar' ? 'الأستاذ' : 'Enseignant'} value={courseForm.teacherName} onChange={(e) => setCourseForm({ ...courseForm, teacherName: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
            <select value={courseForm.category} onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value as any })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
              <option value="UNIVERSITY_LMD">University LMD</option>
              <option value="BAC">BAC</option>
              <option value="MEDICAL">Medical</option>
            </select>
            <input type="number" placeholder="Prix DZD" value={courseForm.priceDzd} onChange={(e) => setCourseForm({ ...courseForm, priceDzd: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
            <input type="number" placeholder="Lessons Count" value={courseForm.lessonsCount} onChange={(e) => setCourseForm({ ...courseForm, lessonsCount: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
            <button type="submit" data-testid="submit-course-btn" className="sm:col-span-3 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs">
              {locale === 'ar' ? 'نشر المقرر فوراً' : 'Publier Instantanément'}
            </button>
          </form>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {courses.map((c) => (
            <div key={c.id} data-testid={`admin-course-card-${c.id}`} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-lg bg-lime-400/10 text-lime-300 text-[10px] font-bold">{c.category}</span>
                <button data-testid={`remove-course-${c.id}`} onClick={() => removeCourse(c.id)} className="p-1 rounded hover:bg-rose-500/20 text-gray-500 hover:text-rose-400">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{locale === 'ar' ? c.titleAr : c.titleFr || c.titleAr}</h4>
              <p className="text-[10px] text-gray-500">{c.teacherName} • {c.lessonsCount} {locale === 'ar' ? 'حصة' : 'leçons'}</p>
              <p className="text-xs font-mono font-bold text-lime-400">{formatDZD(c.priceDzd, locale)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-6 border-t border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-lime-400" />
            {locale === 'ar' ? 'دليل المقاييس (LMD & BAC)' : 'Curriculum Modules (LMD & BAC)'}
          </h3>
          <button data-testid="add-module-btn" onClick={() => setShowModuleForm(!showModuleForm)} className="px-3.5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? 'إضافة مقياس' : 'Ajouter'}</span>
          </button>
        </div>

        {showModuleForm && (
          <form onSubmit={handleAddModule} data-testid="add-module-form" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input required placeholder={locale === 'ar' ? 'اسم المقياس (عربي)' : 'Nom (AR)'} value={moduleForm.nameAr} onChange={(e) => setModuleForm({ ...moduleForm, nameAr: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
            <input placeholder="Nom (FR)" value={moduleForm.nameFr} onChange={(e) => setModuleForm({ ...moduleForm, nameFr: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
            <input required placeholder="Code" value={moduleForm.code} onChange={(e) => setModuleForm({ ...moduleForm, code: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
            <input type="number" placeholder="Coefficient" value={moduleForm.coefficient} onChange={(e) => setModuleForm({ ...moduleForm, coefficient: Number(e.target.value) })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
            <button type="submit" data-testid="submit-module-btn" className="sm:col-span-4 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs">
              {locale === 'ar' ? 'حفظ المقياس' : 'Enregistrer'}
            </button>
          </form>
        )}

        <div className="overflow-x-auto no-scrollbar rounded-2xl border border-white/10">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-[11px] uppercase bg-white/[0.02]">
                <th className="py-3 px-4">{locale === 'ar' ? 'المقياس' : 'Module'}</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Coef.</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4 text-center">{locale === 'ar' ? 'إجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {modules.map((m) => (
                <tr key={m.id} data-testid={`module-row-${m.id}`} className="hover:bg-white/[0.03]">
                  <td className="py-3 px-4 font-bold text-white">{locale === 'ar' ? m.nameAr : m.nameFr || m.nameAr}</td>
                  <td className="py-3 px-4 font-mono">{m.code}</td>
                  <td className="py-3 px-4 font-mono">{m.coefficient}</td>
                  <td className="py-3 px-4">{m.trackType}</td>
                  <td className="py-3 px-4 text-center">
                    <button data-testid={`delete-module-${m.id}`} onClick={() => handleDeleteModule(m.id)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-gray-500 hover:text-rose-400">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
