'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Video,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Users,
  Award,
} from 'lucide-react';
import { DawaaraModule } from '@/types';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface ModuleCardProps {
  module: DawaaraModule;
  isSelected?: boolean;
  onToggleSelect?: (moduleId: string) => void;
  showSelectCheckbox?: boolean;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  isSelected = false,
  onToggleSelect,
  showSelectCheckbox = false,
}) => {
  const { locale, isRtl } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const title = locale === 'fr' ? module.nameFr : locale === 'en' ? module.nameEn : module.nameAr;
  const desc =
    locale === 'fr'
      ? module.shortDescriptionFr
      : locale === 'en'
      ? module.shortDescriptionEn
      : module.shortDescriptionAr;
  const syllabus = locale === 'fr' ? module.syllabusFr : module.syllabusAr;
  const schedule = locale === 'fr' ? module.scheduleDaysFr : module.scheduleDaysAr;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/15 shadow-md'
          : 'border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-850 hover:border-gold-400 dark:hover:border-gold-500/40 shadow-sm'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            {showSelectCheckbox && (
              <button
                type="button"
                onClick={() => onToggleSelect && onToggleSelect(module.id)}
                className={`w-6 h-6 rounded-lg border flex items-center justify-center mt-0.5 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gold-500 border-gold-500 text-navy-950 shadow-gold-glow'
                    : 'border-slate-300 dark:border-gray-600 hover:border-gold-400'
                }`}
              >
                {isSelected && <CheckCircle2 className="w-4 h-4" />}
              </button>
            )}

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-navy-900 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-[10px] font-mono font-bold">
                  {module.code}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-gray-300 text-[10px] font-medium font-arabic">
                  {locale === 'ar' ? `المعامل ${module.coefficient}` : `Coef ${module.coefficient}`}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold font-arabic text-slate-900 dark:text-white">
                {title}
              </h4>
            </div>
          </div>

          {/* Pricing pills */}
          <div className="text-right shrink-0">
            <div className="text-sm sm:text-base font-black font-mono text-gold-600 dark:text-gold-400">
              {module.individualPrice.toLocaleString()} DZD
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-arabic font-semibold">
              {locale === 'ar'
                ? `داخل الحزمة: ${module.packDiscountPrice.toLocaleString()} دج`
                : `En pack: ${module.packDiscountPrice.toLocaleString()} DZD`}
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="mt-2.5 text-xs text-slate-600 dark:text-gray-300 font-arabic leading-relaxed">
          {desc}
        </p>

        {/* Quick meta bar: Teacher & Schedule */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-navy-800 flex flex-wrap items-center justify-between gap-2.5 text-xs font-arabic">
          <div className="flex items-center gap-2">
            <span className="text-lg">{module.teacherAvatar}</span>
            <div>
              <div className="font-bold text-slate-800 dark:text-gray-200 text-xs">
                {module.teacherName}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-gray-400">
                {module.teacherTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-gray-400 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gold-500" />
              {module.hoursCount} {locale === 'ar' ? 'ساعة' : 'heures'} ({module.sessionsCount} {locale === 'ar' ? 'حصص' : 'sessions'})
            </span>
            <span className="flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-900">
              {schedule}
            </span>
          </div>
        </div>

        {/* Syllabus accordion toggle */}
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-bold font-arabic text-gold-600 dark:text-gold-400 hover:text-gold-700 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? (locale === 'ar' ? 'إخفاء المنهاج' : 'Masquer le programme') : (locale === 'ar' ? 'عرض محاور المنهاج بالتفصيل' : 'Voir le programme détaillé')}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <span className="text-[10px] text-slate-400 dark:text-gray-500 font-arabic flex items-center gap-1">
            <Users className="w-3 h-3" />
            {module.enrolledCount} {locale === 'ar' ? 'طالب مسجل' : 'inscrits'}
          </span>
        </div>
      </div>

      {/* Expanded syllabus list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50/80 dark:bg-navy-900/90 border-t border-slate-200 dark:border-navy-700 p-4 font-arabic"
          >
            <h5 className="text-xs font-bold text-slate-800 dark:text-gold-300 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gold-500" />
              <span>{locale === 'ar' ? 'محاور الحصص والتطبيقات العملية:' : 'Programme des sessions & travaux pratiques :'}</span>
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-gray-300">
              {syllabus.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
