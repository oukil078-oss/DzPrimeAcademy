'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Layers } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { QuickStudyHub } from '@/components/study/QuickStudyHub';
import { HierarchyChart } from '@/components/dashboard/HierarchyChart';

type ExamsTab = 'examBank' | 'hierarchy';

export default function ExamsBankPage() {
  const { locale } = useTranslation();
  const { currentUser } = useAuthStore();
  const [tab, setTab] = useState<ExamsTab>('examBank');

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '') as ExamsTab;
      if (['examBank', 'hierarchy'].includes(hash)) setTab(hash);
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const isStudent = currentUser?.role === 'STUDENT_FREE' || currentUser?.role === 'STUDENT_PAID';

  return (
    <div className="w-full p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 select-none font-arabic" data-testid="exam-bank-page">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          data-testid="exams-tab-examBank"
          onClick={() => {
            setTab('examBank');
            window.history.replaceState(null, '', '#examBank');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            tab === 'examBank'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md font-extrabold'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Zap className="w-4 h-4 text-gold-500" />
          <span>{locale === 'ar' ? 'بنك الامتحانات السريع (1-Click)' : "Banque d'Examens Directe"}</span>
        </button>

        <button
          data-testid="exams-tab-hierarchy"
          onClick={() => {
            setTab('hierarchy');
            window.history.replaceState(null, '', '#hierarchy');
          }}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            tab === 'hierarchy'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md font-extrabold'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-500" />
          <span>{locale === 'ar' ? 'الهيكل التنظيمي' : 'Gouvernance'}</span>
        </button>
      </div>

      {tab === 'examBank' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <QuickStudyHub initialTrack={isStudent ? currentUser?.track : undefined} />
        </motion.div>
      )}

      {tab === 'hierarchy' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <HierarchyChart />
        </motion.div>
      )}
    </div>
  );
}
