'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { PlatformCourse } from '@/lib/platformStore';

interface NewCoursesGridProps {
  courses: PlatformCourse[];
  locale: string;
}

const THEME_BG: Record<string, string> = {
  lime: 'bg-lime-500/15 text-lime-600 dark:text-lime-400',
  gold: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  sky: 'bg-sky-500/15 text-sky-600 dark:text-sky-400',
  violet: 'bg-violet-500/15 text-violet-600 dark:text-violet-400',
  rose: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
};

export const NewCoursesGrid: React.FC<NewCoursesGridProps> = ({ courses, locale }) => {
  const display = courses.slice(0, 3);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5" data-testid="new-courses-grid">
      {display.map((c) => (
        <div
          key={c.id}
          data-testid={`new-course-card-${c.id}`}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0C1428] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${THEME_BG[c.colorTheme] || THEME_BG.lime}`}>
            <span className="text-sm font-black">{(c.titleFr || c.titleAr).charAt(0)}</span>
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{locale === 'ar' ? c.titleAr : c.titleFr || c.titleAr}</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">{c.lessonsCount} {locale === 'ar' ? 'حصة' : 'leçons'}</p>
          <div className="flex items-center justify-between mt-3 text-[11px]">
            <span className="flex items-center gap-1 font-bold text-amber-500">
              <Star className="w-3 h-3 fill-amber-500" />
              {c.rating.toFixed(1)}
            </span>
            <span className="text-slate-400 truncate max-w-[100px]">{c.teacherName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
