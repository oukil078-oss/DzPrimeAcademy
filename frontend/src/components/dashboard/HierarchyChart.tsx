'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Users,
  Settings,
  Landmark,
  GraduationCap,
  Megaphone,
  Code,
  Handshake,
  Compass,
  Building,
  School,
  TrendingUp,
  Award,
  Lightbulb,
  Globe2,
  Target,
  ArrowDown,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export const HierarchyChart: React.FC = () => {
  const { t, locale } = useTranslation();

  return (
    <div className="w-full rounded-3xl border border-gold-500/30 dark:border-gold-500/40 bg-gradient-to-b from-[#060B18] via-[#091124] to-[#040711] p-4 sm:p-8 md:p-10 shadow-2xl text-white relative overflow-hidden transition-all duration-300 font-arabic select-none">
      {/* Background Decorative Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] sm:w-[700px] h-[350px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ================= TOP HEADER BRANDING & CEO / BOARD ================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pb-8 border-b border-gold-500/25">
        {/* Left Col: Brand Emblem & Title */}
        <div className="lg:col-span-5 text-center lg:text-start flex flex-col items-center lg:items-start gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-400 to-amber-200 p-0.5 shadow-gold-glow flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#070C1E] rounded-[14px] flex items-center justify-center p-2">
                <Crown className="w-7 h-7 text-gold-400" />
              </div>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
                DZ PRIME ACADEMY
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-gradient-to-r from-white via-gold-200 to-gold-400 bg-clip-text">
                {t('hierarchy.title')}
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md">
            {t('hierarchy.subtitle')}
          </p>
        </div>

        {/* Right Col: Level 1 (Founder/CEO) & Level 2 (National Board) */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-3 sm:gap-4">
          {/* Box 1: Founder & CEO */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="w-full sm:w-56 p-4 rounded-2xl border-2 border-gold-500/80 bg-gradient-to-b from-[#0D1836] to-[#080E20] shadow-lg shadow-gold-500/10 flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 mb-2 shadow-sm">
              <Crown className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-gold-200">
              {t('hierarchy.ceo')}
            </h4>
            <p className="text-[10px] text-slate-300 mt-1 leading-snug">
              {t('hierarchy.ceoDesc')}
            </p>
          </motion.div>

          {/* Golden Arrow */}
          <div className="hidden sm:flex text-gold-400">
            <span className="text-lg">←</span>
          </div>
          <div className="sm:hidden text-gold-400">
            <ArrowDown className="w-4 h-4" />
          </div>

          {/* Box 2: National Board of Directors */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="w-full sm:w-60 p-4 rounded-2xl border border-gold-500/50 bg-gradient-to-b from-[#0D1836] to-[#080E20] shadow-lg flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 mb-2 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-sm font-black text-gold-200">
              {t('hierarchy.board')}
            </h4>
            <p className="text-[10px] text-slate-300 mt-1 leading-snug">
              {t('hierarchy.boardDesc')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= LEVEL 3: EXECUTIVE DIRECTORS (5 Pillars) ================= */}
      <div className="my-8">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-gold-500/60" />
          <div className="px-4 py-1 rounded-full bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs sm:text-sm font-black flex items-center gap-2 shadow-sm">
            <Users className="w-4 h-4 text-gold-400" />
            <span>{t('hierarchy.executives')}</span>
          </div>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-gold-500/60" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. COO */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-2xl border border-gold-500/40 bg-[#091228]/90 hover:bg-[#0E1A38] hover:border-gold-400 transition-all flex flex-col items-center text-center shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 mb-2.5">
              <Settings className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-gold-200">
              {t('hierarchy.coo')}
            </h4>
            <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">
              {t('hierarchy.cooDesc')}
            </p>
          </motion.div>

          {/* 2. Financial Affairs Manager */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-2xl border border-gold-500/40 bg-[#091228]/90 hover:bg-[#0E1A38] hover:border-gold-400 transition-all flex flex-col items-center text-center shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 mb-2.5">
              <Landmark className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-gold-200">
              {t('hierarchy.finance')}
            </h4>
            <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">
              {t('hierarchy.financeDesc')}
            </p>
          </motion.div>

          {/* 3. Student Affairs & Services Manager */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-2xl border border-gold-500/40 bg-[#091228]/90 hover:bg-[#0E1A38] hover:border-gold-400 transition-all flex flex-col items-center text-center shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 mb-2.5">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-gold-200">
              {t('hierarchy.studentServices')}
            </h4>
            <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">
              {t('hierarchy.studentServicesDesc')}
            </p>
          </motion.div>

          {/* 4. Marketing & Media Manager */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-2xl border border-gold-500/40 bg-[#091228]/90 hover:bg-[#0E1A38] hover:border-gold-400 transition-all flex flex-col items-center text-center shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 mb-2.5">
              <Megaphone className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-gold-200">
              {t('hierarchy.marketing')}
            </h4>
            <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">
              {t('hierarchy.marketingDesc')}
            </p>
          </motion.div>

          {/* 5. Technology & Platform Manager */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="p-4 rounded-2xl border border-gold-500/40 bg-[#091228]/90 hover:bg-[#0E1A38] hover:border-gold-400 transition-all flex flex-col items-center text-center shadow-sm"
          >
            <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center text-gold-400 mb-2.5">
              <Code className="w-5 h-5" />
            </div>
            <h4 className="text-xs sm:text-[13px] font-bold text-gold-200">
              {t('hierarchy.tech')}
            </h4>
            <p className="text-[10px] text-slate-300 mt-1.5 leading-relaxed">
              {t('hierarchy.techDesc')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ================= LEVEL 4: REGIONAL COORDINATORS (منسقو الجهات) ================= */}
      <div className="my-8 pt-6 border-t border-gold-500/20">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="px-4 py-1 rounded-full bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs sm:text-sm font-black flex items-center gap-2 shadow-sm">
            <Compass className="w-4 h-4 text-gold-400" />
            <span>{t('hierarchy.coordinators')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            { title: t('hierarchy.westCoord'), desc: t('hierarchy.westDesc'), wilayas: 'Oran, Tlemcen, Mostaganem, Chlef, SBA...', icon: '🌅' },
            { title: t('hierarchy.eastCoord'), desc: t('hierarchy.eastDesc'), wilayas: 'Constantine, Sétif, Annaba, Batna, Guelma...', icon: '⛰️' },
            { title: t('hierarchy.centerCoord'), desc: t('hierarchy.centerDesc'), wilayas: 'Alger, Blida, Tizi Ouzou, Boumerdès, Béjaïa...', icon: '🏛️' },
            { title: t('hierarchy.southCoord'), desc: t('hierarchy.southDesc'), wilayas: 'Ouargla, Biskra, Adrar, Ghardaïa, El Oued...', icon: '🌴' },
          ].map((reg, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-4 rounded-2xl border border-gold-500/35 bg-[#081024] hover:bg-[#0D1836] transition-all flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{reg.icon}</span>
                <h4 className="text-xs sm:text-sm font-bold text-gold-200">{reg.title}</h4>
              </div>
              <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{reg.desc}</p>
              <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-gold-400 font-mono">
                {reg.wilayas}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= LEVEL 5: AMBASSADOR NETWORK (شبكة السفراء) ================= */}
      <div className="my-8 p-5 sm:p-6 rounded-3xl border border-gold-500/40 bg-gradient-to-r from-[#080E20] via-[#0D1632] to-[#080E20] shadow-md">
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs sm:text-sm font-black mb-1">
            <Users className="w-4 h-4 text-gold-400" />
            <span>{t('hierarchy.ambassadorsNetwork')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-4 sm:p-5 rounded-2xl bg-[#060B1A] border border-gold-500/30 flex items-center gap-4 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">{t('hierarchy.univAmbassadors')}</h4>
              <p className="text-xs text-slate-300 mt-1">{t('hierarchy.univDesc')}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            className="p-4 sm:p-5 rounded-2xl bg-[#060B1A] border border-gold-500/30 flex items-center gap-4 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 shrink-0">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">{t('hierarchy.wilayaAmbassadors')}</h4>
              <p className="text-xs text-slate-300 mt-1">{t('hierarchy.wilayaDesc')}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= LEVEL 6: RESULTS & GOALS (النتائج والأهداف) ================= */}
      <div className="pt-6 border-t border-gold-500/25 text-center">
        <div className="flex items-center justify-center gap-2 mb-5">
          <div className="px-4 py-1 rounded-full bg-gold-500/20 border border-gold-500/50 text-gold-300 text-xs sm:text-sm font-black flex items-center gap-2 shadow-sm">
            <Target className="w-4 h-4 text-gold-400" />
            <span>{t('hierarchy.goalsTitle')}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { title: t('hierarchy.goal1'), desc: t('hierarchy.goal1Desc'), icon: Handshake },
            { title: t('hierarchy.goal2'), desc: t('hierarchy.goal2Desc'), icon: Lightbulb },
            { title: t('hierarchy.goal3'), desc: t('hierarchy.goal3Desc'), icon: Award },
            { title: t('hierarchy.goal4'), desc: t('hierarchy.goal4Desc'), icon: TrendingUp },
            { title: t('hierarchy.goal5'), desc: t('hierarchy.goal5Desc'), icon: Globe2 },
          ].map((goal, idx) => {
            const Icon = goal.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02, y: -2 }}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#091228] border border-gold-500/30 flex flex-col items-center text-center shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-400/30 flex items-center justify-center text-gold-400 mb-2">
                  <Icon className="w-4 h-4" />
                </div>
                <h5 className="text-xs sm:text-[13px] font-black text-gold-200">
                  {goal.title}
                </h5>
                <p className="text-[10px] text-slate-300 mt-1 leading-snug">
                  {goal.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* ================= BOTTOM SLOGAN RIBBON ================= */}
        <div className="mt-8 py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-gold-500/35 to-amber-500/20 border border-gold-500/60 inline-flex items-center gap-2 font-black text-gold-200 text-xs sm:text-sm md:text-base tracking-wide shadow-gold-glow">
          <span>🇩🇿</span>
          <span>{t('hierarchy.slogan')}</span>
        </div>
      </div>
    </div>
  );
};
