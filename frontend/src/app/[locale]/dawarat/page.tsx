'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Star, Video, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { usePlatformStore } from '@/lib/platformStore';
import { useAuthStore } from '@/lib/store';
import { formatDZD } from '@/lib/format';

const THEME_BG: Record<string, string> = {
  lime: 'from-lime-500/20 to-transparent text-lime-600 dark:text-lime-400',
  gold: 'from-amber-500/20 to-transparent text-amber-600 dark:text-amber-400',
  sky: 'from-sky-500/20 to-transparent text-sky-600 dark:text-sky-400',
  violet: 'from-violet-500/20 to-transparent text-violet-600 dark:text-violet-400',
  rose: 'from-rose-500/20 to-transparent text-rose-600 dark:text-rose-400',
};

type Track = 'ALL' | 'BAC' | 'UNIVERSITY_LMD' | 'MEDICAL';
const VALID_TRACKS: Track[] = ['BAC', 'UNIVERSITY_LMD', 'MEDICAL'];

export default function DawaratCatalogPage() {
  const { locale } = useTranslation();
  const { currentUser } = useAuthStore();
  const { courses, loaded } = usePlatformStore();
  const searchParams = useSearchParams();

  const isStudent = currentUser?.role === 'STUDENT_FREE' || currentUser?.role === 'STUDENT_PAID';
  const lockedTrack = isStudent && currentUser?.track ? (currentUser.track as Track) : null;

  const urlTrack = searchParams.get('track') as Track | null;
  const [filter, setFilter] = useState<Track>(
    lockedTrack || (urlTrack && VALID_TRACKS.includes(urlTrack) ? urlTrack : 'ALL')
  );

  useEffect(() => {
    if (lockedTrack) setFilter(lockedTrack);
  }, [lockedTrack]);

  const filtered = filter === 'ALL' ? courses : courses.filter((c) => c.category === filter);

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 font-arabic" data-testid="dawarat-catalog-page">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Video className="w-6 h-6 text-lime-500" />
            <span>{locale === 'ar' ? 'دورات الامتياز (Live)' : 'Dawarat Excellence (Live)'}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            {locale === 'ar' ? 'كل المقررات المباشرة عبر الوطن، تتحدث فورياً بمجرد نشرها من الأستاذ.' : 'Tous les cours live, synchronisés instantanément à la publication.'}
          </p>
        </div>

        {lockedTrack ? (
          <div
            data-testid="dawarat-track-locked-badge"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-lime-400/10 border border-lime-400/30 text-lime-700 dark:text-lime-300 text-[11px] font-bold shrink-0"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{locale === 'ar' ? `مقررات مسارك: ${lockedTrack}` : `Votre filière: ${lockedTrack}`}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar" data-testid="dawarat-filters">
            {(['ALL', 'BAC', 'UNIVERSITY_LMD', 'MEDICAL'] as const).map((f) => (
              <button
                key={f}
                data-testid={`dawarat-filter-${f}`}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all ${
                  filter === f ? 'bg-slate-950 dark:bg-lime-400 text-white dark:text-slate-950' : 'text-slate-600 dark:text-gray-400'
                }`}
              >
                {f === 'ALL' ? (locale === 'ar' ? 'الكل' : 'Tous') : f}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="dawarat-grid">
        {filtered.map((c, idx) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            data-testid={`dawarat-card-${c.id}`}
            className="p-5 rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className={`h-24 rounded-2xl bg-gradient-to-br ${THEME_BG[c.colorTheme] || THEME_BG.lime} flex items-center justify-center mb-3.5 relative overflow-hidden`}>
              {c.isLive && (
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
              )}
              <span className="text-3xl font-black">{(c.titleFr || c.titleAr).charAt(0)}</span>
            </div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white leading-snug line-clamp-2">
              {locale === 'ar' ? c.titleAr : c.titleFr || c.titleAr}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">{c.teacherName}</p>
            <div className="flex items-center justify-between mt-3.5">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                {c.rating.toFixed(1)}
              </span>
              <span className="text-xs font-mono font-black text-lime-600 dark:text-lime-400">{formatDZD(c.priceDzd, locale)}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">{c.lessonsCount} {locale === 'ar' ? 'حصة' : 'leçons'}</p>
          </motion.div>
        ))}
        {loaded && filtered.length === 0 && (
          <p className="text-xs text-slate-400 py-10 text-center sm:col-span-3">
            {locale === 'ar' ? 'لا توجد دورات في هذا التصنيف حالياً.' : 'Aucun cours dans cette catégorie.'}
          </p>
        )}
      </div>
    </div>
  );
}
