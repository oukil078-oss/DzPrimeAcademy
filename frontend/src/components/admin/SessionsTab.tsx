'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Video, Calendar } from 'lucide-react';
import { usePlatformStore } from '@/lib/platformStore';

interface SessionsTabProps {
  locale: string;
}

export const SessionsTab: React.FC<SessionsTabProps> = ({ locale }) => {
  const { sessions, addSession, refresh } = usePlatformStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    teacherName: '',
    scheduledAt: '',
    platform: 'GOOGLE_MEET' as const,
    category: 'UNIVERSITY_LMD' as const,
    wilayaCode: 16,
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSession({ ...form, durationMinutes: 60, meetUrl: null, courseId: null, teacherId: null });
    setForm({ title: '', teacherName: '', scheduledAt: '', platform: 'GOOGLE_MEET', category: 'UNIVERSITY_LMD', wilayaCode: 16 });
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/sessions/${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <div className="space-y-4" data-testid="sessions-tab">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-white flex items-center gap-2">
          <Video className="w-4 h-4 text-lime-400" />
          {locale === 'ar' ? 'الحصص والمحاضرات الوطنية' : 'National Live Masterclasses'}
        </h3>
        <button data-testid="add-session-btn" onClick={() => setShowForm(!showForm)} className="px-3.5 py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" />
          <span>{locale === 'ar' ? 'جدولة حصة' : 'Planifier'}</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} data-testid="add-session-form" className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input required placeholder={locale === 'ar' ? 'عنوان الحصة' : 'Titre'} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input required placeholder={locale === 'ar' ? 'الأستاذ' : 'Enseignant'} value={form.teacherName} onChange={(e) => setForm({ ...form, teacherName: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500" />
          <input required type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white" />
          <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as any })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
            <option value="GOOGLE_MEET">Google Meet</option>
            <option value="CLASSROOM">Classroom</option>
            <option value="ONSITE">{locale === 'ar' ? 'حضوري' : 'Présentiel'}</option>
          </select>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200">
            <option value="UNIVERSITY_LMD">University LMD</option>
            <option value="BAC">BAC</option>
            <option value="MEDICAL">Medical</option>
          </select>
          <button type="submit" data-testid="submit-session-btn" className="py-2 rounded-xl bg-lime-400 text-slate-950 font-bold text-xs">
            {locale === 'ar' ? 'حفظ' : 'Enregistrer'}
          </button>
        </form>
      )}

      <div className="space-y-2">
        {sessions.map((s) => (
          <div key={s.id} data-testid={`session-row-${s.id}`} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className="w-9 h-9 rounded-xl bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{s.title}</h4>
              <p className="text-[10px] text-gray-500 font-mono">
                {new Date(s.scheduledAt).toLocaleString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ')} &bull; {s.teacherName}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-white/10 text-[10px] font-bold text-gray-300 shrink-0">{s.platform}</span>
            <button data-testid={`delete-session-${s.id}`} onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-gray-500 hover:text-rose-400 shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
