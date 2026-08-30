'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface AssignmentItem {
  id: string;
  title: string;
  date: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'UPCOMING';
}

interface AssignmentsListProps {
  locale: string;
}

const ASSIGNMENTS: AssignmentItem[] = [
  { id: 'a1', title: 'Série TD - Analyse 1 (Ch.3)', date: '02 Sept, 10:30', status: 'IN_PROGRESS' },
  { id: 'a2', title: 'QCM Anatomie - Membre Supérieur', date: '28 Août, 14:00', status: 'COMPLETED' },
  { id: 'a3', title: 'BAC Math - Sujet Blanc 04', date: '10 Sept, 09:00', status: 'UPCOMING' },
];

const STATUS_STYLE: Record<string, string> = {
  IN_PROGRESS: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  COMPLETED: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  UPCOMING: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
};

const STATUS_LABEL_AR: Record<string, string> = { IN_PROGRESS: 'قيد التقدم', COMPLETED: 'مكتمل', UPCOMING: 'قادم' };
const STATUS_LABEL_FR: Record<string, string> = { IN_PROGRESS: 'En cours', COMPLETED: 'Terminé', UPCOMING: 'À venir' };

export const AssignmentsList: React.FC<AssignmentsListProps> = ({ locale }) => {
  return (
    <div data-testid="assignments-list" className="p-5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-black text-slate-900 dark:text-white">
          {locale === 'ar' ? 'الواجبات والمهام' : 'Assignments'}
        </h3>
        <button className="w-6 h-6 rounded-lg bg-lime-400 text-slate-950 flex items-center justify-center">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-2">
        {ASSIGNMENTS.map((a) => (
          <div key={a.id} data-testid={`assignment-item-${a.id}`} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{a.title}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{a.date}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 ${STATUS_STYLE[a.status]}`}>
              {locale === 'ar' ? STATUS_LABEL_AR[a.status] : STATUS_LABEL_FR[a.status]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
