'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  BookOpen,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeft,
  Crown,
  Bot,
  FileText,
  Star,
  CheckCircle2,
  ArrowUpRight,
  TrendingUp,
  Plus,
  Flame,
  Zap,
  Users,
  GraduationCap,
  Layers,
  Award,
  Download,
  Eye,
  ShieldCheck,
  CreditCard,
  Building2,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isGoldenMember } from '@/lib/rbac';
import { DecisionTreeBot } from '@/components/bot/DecisionTreeBot';
import { UpgradeModal } from '@/components/shared/UpgradeModal';
import { AMBASSADORS, EXAMS, getLocalizedAmbassadorBio } from '@/lib/initial-data';
import { HierarchyChart } from '@/components/dashboard/HierarchyChart';
import { QuickStudyHub } from '@/components/study/QuickStudyHub';
import { AmbassadorDirectory } from '@/components/ambassadors/AmbassadorDirectory';

export default function EduplexDashboardPage() {
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();

  const [activeViewTab, setActiveViewTab] = useState<'studyHub' | 'ambassadors' | 'bot' | 'hierarchy'>('studyHub');
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGold = isGoldenMember(currentUser);
  const displayName = currentUser ? currentUser.name : (locale === 'ar' ? 'طالب جزائري' : 'Étudiant');
  const specialty = currentUser?.specialty || (locale === 'ar' ? 'جامعة هواري بومدين • L1 MI' : 'USTHB • L1 MI');

  return (
    <div className="w-full p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 select-none font-arabic">
      {/* ================= VIEW SELECTOR TABS ================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button
          onClick={() => setActiveViewTab('studyHub')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeViewTab === 'studyHub'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md font-extrabold'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Zap className="w-4 h-4 text-gold-500" />
          <span>{locale === 'ar' ? 'بنك الامتحانات السريع (1-Click)' : 'Banque d\'Examens Directe'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-gold-500/20 text-gold-700 dark:text-gold-300 text-[10px] font-mono font-bold">
            +12k
          </span>
        </button>

        <button
          onClick={() => setActiveViewTab('ambassadors')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeViewTab === 'ambassadors'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md font-extrabold'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{locale === 'ar' ? 'شبكة السفراء في 58 ولاية' : 'Réseau Ambassadeurs'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold">
            {AMBASSADORS.length} Leads
          </span>
        </button>

        <button
          onClick={() => setActiveViewTab('bot')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeViewTab === 'bot'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md font-extrabold'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Bot className="w-4 h-4 text-lime-600 dark:text-gold-400" />
          <span>{t('nav.bot')}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-lime-400/20 text-lime-700 dark:text-lime-300 text-[10px] font-mono font-bold">
            7-Steps AI
          </span>
        </button>

        <button
          onClick={() => setActiveViewTab('hierarchy')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeViewTab === 'hierarchy'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md font-extrabold'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-500" />
          <span>{t('nav.hierarchy')}</span>
        </button>
      </div>

      {/* ================= TAB 1: QUICK STUDY HUB (1-CLICK ACCESS) ================= */}
      {activeViewTab === 'studyHub' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <QuickStudyHub />
        </motion.div>
      )}

      {/* ================= TAB 2: AMBASSADORS NETWORK ================= */}
      {activeViewTab === 'ambassadors' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <AmbassadorDirectory />
        </motion.div>
      )}

      {/* ================= TAB 3: SMART DECISION TREE BOT ================= */}
      {activeViewTab === 'bot' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="text-center max-w-2xl mx-auto mb-4">
            <span className="px-3.5 py-1 rounded-full bg-lime-400/20 text-lime-800 dark:text-lime-300 text-xs font-bold uppercase tracking-wider font-mono">
              7-STEP ARCHIVE CHOOSER
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
              {t('bot.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1">
              {t('bot.subtitle')}
            </p>
          </div>

          <DecisionTreeBot />
        </motion.div>
      )}

      {/* ================= TAB 4: HIERARCHY & GOVERNANCE ================= */}
      {activeViewTab === 'hierarchy' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <HierarchyChart />
        </motion.div>
      )}

      {/* Upgrade VIP Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}
