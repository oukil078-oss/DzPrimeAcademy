'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Award,
  Medal,
  Sparkles,
  Users,
  GraduationCap,
  Building2,
  MapPin,
  Star,
  Search,
  Filter,
  Layers,
  Crown,
  ChevronRight,
  LogIn,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { HierarchyChart } from '@/components/dashboard/HierarchyChart';
import { AuthModal } from '@/components/auth/AuthModal';

type LeaderboardTab = 'honorRoll' | 'hierarchy';
type TrackFilter = 'ALL' | 'BAC' | 'UNIVERSITY' | 'MEDICAL';

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  institution: string;
  wilayaCode: number;
  wilayaName: string;
  track: 'BAC' | 'UNIVERSITY' | 'MEDICAL';
  trackNameAr: string;
  trackNameFr: string;
  score: string;
  badgeAr: string;
  badgeFr: string;
  avatarLetter: string;
}

const LEADERBOARD_ENTRIES: LeaderboardEntry[] = [
  {
    id: 'lead-1',
    rank: 1,
    name: 'Meriem Benali',
    institution: 'Faculté de Médecine d\'Alger (Zania)',
    wilayaCode: 16,
    wilayaName: 'Alger',
    track: 'MEDICAL',
    trackNameAr: 'علوم طبية (Médecine 5ème Année)',
    trackNameFr: 'Sciences Médicales (5ème Année)',
    score: '18.92 / 20',
    badgeAr: 'المرتبة الأولى الوطنية 🥇',
    badgeFr: 'Major National 🥇',
    avatarLetter: 'M',
  },
  {
    id: 'lead-2',
    rank: 2,
    name: 'Anis Khelifi',
    institution: 'Université USTHB Bab Ezzouar',
    wilayaCode: 16,
    wilayaName: 'Alger',
    track: 'UNIVERSITY',
    trackNameAr: 'إعلام آلي (Master 2 AI & Data)',
    trackNameFr: 'Informatique (Master 2 IA)',
    score: '18.75 / 20',
    badgeAr: 'المرتبة الأولى USTHB 🥈',
    badgeFr: 'Major de Promo USTHB 🥈',
    avatarLetter: 'A',
  },
  {
    id: 'lead-3',
    rank: 3,
    name: 'Chaima Boudiaf',
    institution: 'Lycée Frères Lamrani',
    wilayaCode: 31,
    wilayaName: 'Oran',
    track: 'BAC',
    trackNameAr: 'بكالوريا رياضيات (3AS Math)',
    trackNameFr: 'BAC Mathématiques (3AS)',
    score: '19.14 / 20',
    badgeAr: 'امتياز وطني BAC 🥉',
    badgeFr: 'Excellence BAC 🥉',
    avatarLetter: 'C',
  },
  {
    id: 'lead-4',
    rank: 4,
    name: 'Yacine Mansouri',
    institution: 'Université Constantine 1 (Frères Mentouri)',
    wilayaCode: 25,
    wilayaName: 'Constantine',
    track: 'UNIVERSITY',
    trackNameAr: 'هندسة كهربائية (L3 Électronique)',
    trackNameFr: 'Génie Électrique (L3)',
    score: '17.80 / 20',
    badgeAr: 'Major Constantine',
    badgeFr: 'Major Constantine',
    avatarLetter: 'Y',
  },
  {
    id: 'lead-5',
    rank: 5,
    name: 'Amina Zerrouki',
    institution: 'Lycée Colonel Lotfi',
    wilayaCode: 13,
    wilayaName: 'Tlemcen',
    track: 'BAC',
    trackNameAr: 'بكالوريا علوم تجريبية',
    trackNameFr: 'BAC Sciences Exp.',
    score: '18.65 / 20',
    badgeAr: 'امتياز الغرب الجزائري',
    badgeFr: 'Excellence Ouest',
    avatarLetter: 'A',
  },
  {
    id: 'lead-6',
    rank: 6,
    name: 'Ilyas Belhadj',
    institution: 'Faculté de Pharmacie d\'Oran',
    wilayaCode: 31,
    wilayaName: 'Oran',
    track: 'MEDICAL',
    trackNameAr: 'صيدلة (Pharmacie 4ème Année)',
    trackNameFr: 'Pharmacie (4ème Année)',
    score: '17.60 / 20',
    badgeAr: 'Major Pharmacie',
    badgeFr: 'Major Pharmacie',
    avatarLetter: 'I',
  },
  {
    id: 'lead-7',
    rank: 7,
    name: 'Rayan Toumi',
    institution: 'Université Kasdi Merbah Ouargla',
    wilayaCode: 30,
    wilayaName: 'Ouargla',
    track: 'UNIVERSITY',
    trackNameAr: 'هندسة البترول والمحروقات',
    trackNameFr: 'Hydrocarbures & Énergie',
    score: '17.45 / 20',
    badgeAr: 'Major Sud Algérien',
    badgeFr: 'Major Sud Algérien',
    avatarLetter: 'R',
  },
];

export default function LeaderboardPage() {
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('honorRoll');
  const [trackFilter, setTrackFilter] = useState<TrackFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '') as LeaderboardTab;
      if (['honorRoll', 'hierarchy'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const handleTabChange = (tab: LeaderboardTab) => {
    setActiveTab(tab);
    window.history.replaceState(null, '', `#${tab}`);
  };

  const filteredEntries = LEADERBOARD_ENTRIES.filter((entry) => {
    if (trackFilter !== 'ALL' && entry.track !== trackFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.institution.toLowerCase().includes(q) ||
        entry.wilayaName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-arabic" data-testid="leaderboard-page">
      {/* Header Banner */}
      <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#060D1E] via-[#0A1633] to-[#040813] border border-gold-500/40 text-white shadow-2xl overflow-hidden text-center">
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-gold-400" />
            <span>DZ PRIME ACADEMY EXCELLENCE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-white via-gold-200 to-gold-400 bg-clip-text">
            {t('leaderboard.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('leaderboard.subtitle')}
          </p>
        </div>
      </div>

      {/* Guest Notice */}
      {!currentUser && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-gold-500/10 to-transparent border border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-bold shrink-0">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {locale === 'ar' ? 'انضم إلى نخبة المتفوقين في DZ PRIME' : 'Rejoignez l\'élite des étudiants DZ PRIME'}
              </h4>
              <p className="text-xs text-slate-300">
                {locale === 'ar' ? 'سجّل حسابك للمشاركة في التقييمات والحصول على بطاقتك الرقمية الرسمية.' : 'Inscrivez-vous pour valider votre carte et rejoindre le classement.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-md"
          >
            <LogIn className="w-4 h-4" />
            <span>{t('auth.loginTab')}</span>
          </button>
        </div>
      )}

      {/* Main Tab Controls */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleTabChange('honorRoll')}
          data-testid="leaderboard-tab-honorRoll"
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'honorRoll'
              ? 'bg-slate-950 dark:bg-gold-500 text-white dark:text-navy-950 shadow-md font-black'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Trophy className="w-4 h-4 text-gold-400 dark:text-navy-950" />
          <span>{t('leaderboard.honorRollTab')}</span>
        </button>

        <button
          onClick={() => handleTabChange('hierarchy')}
          data-testid="leaderboard-tab-hierarchy"
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'hierarchy'
              ? 'bg-slate-950 dark:bg-gold-500 text-white dark:text-navy-950 shadow-md font-black'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300 hover:border-gold-500'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400 dark:text-navy-950" />
          <span>{t('leaderboard.hierarchyTab')}</span>
        </button>
      </div>

      {/* ================= TAB 1: HONOR ROLL ================= */}
      {activeTab === 'honorRoll' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Track Filter Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 overflow-x-auto no-scrollbar">
              {(
                [
                  { id: 'ALL', label: t('leaderboard.filterAll') },
                  { id: 'BAC', label: t('leaderboard.filterBac') },
                  { id: 'UNIVERSITY', label: t('leaderboard.filterUniv') },
                  { id: 'MEDICAL', label: t('leaderboard.filterMed') },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setTrackFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    trackFilter === f.id
                      ? 'bg-gold-500 text-navy-950 shadow-sm'
                      : 'text-slate-600 dark:text-gray-400 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={locale === 'ar' ? 'بحث بالاسم، الجامعة أو الولاية...' : 'Recherche nom, fac...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          {/* Leaderboard Table / Cards */}
          <div className="space-y-3">
            {filteredEntries.map((entry) => {
              const isTop3 = entry.rank <= 3;
              const rankColor =
                entry.rank === 1
                  ? 'from-amber-400 to-gold-600 text-navy-950'
                  : entry.rank === 2
                  ? 'from-slate-300 to-slate-400 text-slate-950'
                  : entry.rank === 3
                  ? 'from-amber-600 to-amber-700 text-white'
                  : 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-gray-300';

              return (
                <motion.div
                  key={entry.id}
                  whileHover={{ scale: 1.008 }}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isTop3
                      ? 'bg-gradient-to-r from-white via-amber-50/40 to-white dark:from-[#0B1530] dark:via-[#0E1A3C] dark:to-[#091024] border-gold-500/40 shadow-md'
                      : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-gray-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center shrink-0 shadow-sm ${
                        isTop3 ? `bg-gradient-to-tr ${rankColor}` : rankColor
                      }`}
                    >
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </div>

                    {/* Avatar Initial */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-gold-500 via-amber-400 to-lime-400 p-0.5 shadow-sm">
                      <div className="w-full h-full rounded-[14px] bg-slate-950 text-gold-300 font-bold flex items-center justify-center text-base sm:text-lg font-sans">
                        {entry.avatarLetter}
                      </div>
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                          {entry.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md bg-gold-500/20 text-gold-700 dark:text-gold-300 text-[10px] font-bold">
                          {locale === 'ar' ? entry.badgeAr : entry.badgeFr}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <Building2 className="w-3.5 h-3.5 text-gold-500" />
                        <span>{entry.institution}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-800 dark:text-gray-200">
                          {locale === 'ar' ? entry.trackNameAr : entry.trackNameFr}
                        </span>
                      </p>

                      <p className="text-[11px] text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span>Wilaya {entry.wilayaCode} ({entry.wilayaName})</span>
                      </p>
                    </div>
                  </div>

                  {/* Score & Recognition */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-gray-800">
                    <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-gray-400">
                      {locale === 'ar' ? 'المعدل العام' : 'Moyenne'}
                    </span>
                    <span className="text-base sm:text-xl font-black font-mono text-gold-600 dark:text-gold-400">
                      {entry.score}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ================= TAB 2: HIERARCHY ================= */}
      {activeTab === 'hierarchy' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <HierarchyChart />
        </motion.div>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} defaultTab="login" />
    </div>
  );
}
