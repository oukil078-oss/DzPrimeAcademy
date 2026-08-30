'use client';

import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface HoursActivityChartProps {
  locale: string;
}

const DAY_LABELS_AR = ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'];
const DAY_LABELS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const WEEKLY_DATA = [3.2, 4.5, 2.8, 6.75, 5.1, 4.2, 2.5];

export const HoursActivityChart: React.FC<HoursActivityChartProps> = ({ locale }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(3);
  const labels = locale === 'ar' ? DAY_LABELS_AR : DAY_LABELS_FR;
  const max = Math.max(...WEEKLY_DATA);

  return (
    <div
      data-testid="hours-activity-chart"
      className="p-5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white">
            {locale === 'ar' ? 'نشاط ساعات الدراسة' : 'Hours Activity'}
          </h3>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" />
            <span>+18% {locale === 'ar' ? 'مقارنة بالأسبوع الماضي' : 'vs semaine dernière'}</span>
          </p>
        </div>
        <select className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-850 border border-slate-200 dark:border-gray-700 text-[11px] font-bold text-slate-600 dark:text-gray-300">
          <option>{locale === 'ar' ? 'أسبوعي' : 'Hebdomadaire'}</option>
          <option>{locale === 'ar' ? 'شهري' : 'Mensuel'}</option>
        </select>
      </div>

      <div className="flex items-end justify-between gap-2 sm:gap-3 h-40 relative">
        {WEEKLY_DATA.map((val, idx) => {
          const heightPct = (val / max) * 100;
          const isHover = hoverIdx === idx;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer"
              onMouseEnter={() => setHoverIdx(idx)}
              data-testid={`activity-bar-${idx}`}
            >
              {isHover && (
                <div className="absolute -top-9 px-2.5 py-1 rounded-lg bg-slate-900 dark:bg-lime-400 text-white dark:text-slate-950 text-[10px] font-bold font-mono whitespace-nowrap shadow-lg z-10">
                  {val.toFixed(2)}h &bull; {labels[idx]}
                </div>
              )}
              <div
                style={{ height: `${heightPct}%` }}
                className={`w-full max-w-[26px] rounded-t-lg transition-all duration-300 ${
                  isHover ? 'bg-lime-400 shadow-lg' : 'bg-slate-800 dark:bg-slate-700 group-hover:bg-slate-600'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-2 font-bold">{labels[idx]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
