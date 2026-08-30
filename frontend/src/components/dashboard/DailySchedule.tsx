'use client';

import React from 'react';
import { ChevronRight, Sigma, FlaskConical, Dna, Calculator } from 'lucide-react';
import { PlatformSession } from '@/lib/platformStore';

interface DailyScheduleProps {
  sessions: PlatformSession[];
  locale: string;
}

const CATEGORY_ICON: Record<string, React.ElementType> = {
  UNIVERSITY_LMD: Sigma,
  BAC: Calculator,
  MEDICAL: Dna,
};

const CATEGORY_COLOR: Record<string, string> = {
  UNIVERSITY_LMD: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  BAC: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  MEDICAL: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
};

export const DailySchedule: React.FC<DailyScheduleProps> = ({ sessions, locale }) => {
  const upcoming = sessions.slice(0, 4);

  return (
    <div
      data-testid="daily-schedule"
      className="p-5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4">
        {locale === 'ar' ? 'الجدول اليومي' : 'Daily Schedule'}
      </h3>

      <div className="space-y-2">
        {upcoming.length === 0 && (
          <p className="text-xs text-slate-400 py-6 text-center">
            {locale === 'ar' ? 'لا توجد حصص مجدولة حالياً' : 'Aucune session planifiée'}
          </p>
        )}
        {upcoming.map((s) => {
          const Icon = CATEGORY_ICON[s.category] || Sigma;
          const colorClass = CATEGORY_COLOR[s.category] || CATEGORY_COLOR.UNIVERSITY_LMD;
          const date = new Date(s.scheduledAt);
          return (
            <div
              key={s.id}
              data-testid={`schedule-item-${s.id}`}
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{s.title}</h4>
                <p className="text-[10px] text-slate-400 font-mono">
                  {date.toLocaleDateString(locale === 'ar' ? 'ar-DZ' : 'fr-DZ', { day: '2-digit', month: 'short' })} &bull; {s.teacherName}
                </p>
              </div>
              {s.platform === 'ONSITE' ? (
                <span className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-bold shrink-0">
                  {locale === 'ar' ? 'حضوري' : 'Présentiel'}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shrink-0">
                  Live
                </span>
              )}
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-lime-500 transition-colors shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
