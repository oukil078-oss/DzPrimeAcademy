'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Crown,
  Users,
  Settings,
  Megaphone,
  Code,
  Handshake,
  Compass,
  GraduationCap,
  Building,
  School,
  TrendingUp,
  Award,
  Lightbulb,
  Globe2,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export const HierarchyChart: React.FC = () => {
  const { t, locale } = useTranslation();

  return (
    <div className="w-full rounded-3xl border border-slate-200 dark:border-gold-500/40 bg-white dark:bg-gradient-to-b dark:from-[#090F20] dark:via-[#050812] dark:to-[#020409] p-4 sm:p-8 md:p-10 shadow-xl text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[600px] h-[300px] bg-gold-500/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
        <span className="px-3 sm:px-4 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-700 dark:text-gold-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider font-arabic">
          DZ PRIME ACADEMY GOVERNANCE
        </span>
        <h2 className="text-xl xs:text-2xl sm:text-4xl font-extrabold font-arabic text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-gold-300 dark:via-gold-400 dark:to-gold-600 dark:bg-clip-text mt-2 sm:mt-3 px-1">
          {t('hierarchy.title')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic mt-1.5 sm:mt-2">
          {t('hierarchy.subtitle')}
        </p>
      </div>

      {/* ================= LEVEL 1: FOUNDER / CEO ================= */}
      <div className="flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="relative group p-4 sm:p-6 rounded-3xl border-2 border-gold-500 bg-gradient-to-br from-amber-50 to-white dark:from-gold-500/25 dark:via-navy-900 dark:to-navy-950 shadow-md dark:shadow-gold-glow-lg flex flex-col items-center text-center max-w-xs sm:max-w-sm w-full cursor-pointer transition-all"
        >
          <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 p-0.5 shadow-gold-glow flex items-center justify-center mb-2.5 sm:mb-3">
            <div className="w-full h-full bg-white dark:bg-navy-950 rounded-[14px] flex items-center justify-center p-2">
              <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-gold-600 dark:text-gold-400" />
            </div>
          </div>
          <h3 className="text-base sm:text-xl font-black font-arabic text-slate-900 dark:text-gold-200">
            {t('hierarchy.ceo')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-gray-300 mt-1 font-arabic">
            {t('hierarchy.ceoDesc')}
          </p>
          <span className="mt-2.5 sm:mt-3 px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-800 dark:text-gold-300 font-mono text-[10px] font-bold">
            FOUNDER & CEO
          </span>
        </motion.div>

        {/* Golden Connecting Line */}
        <div className="w-0.5 h-8 bg-gradient-to-b from-gold-500 to-gold-600/50" />
      </div>

      {/* ================= LEVEL 2: EXECUTIVE MANAGERS (5 Pillars) ================= */}
      <div className="relative">
        {/* Horizontal Distributor Line */}
        <div className="hidden lg:block absolute top-0 left-[10%] right-[10%] h-0.5 bg-gold-500/40" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
          {/* Board */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-slate-50 dark:bg-navy-900/90 hover:border-gold-500 flex flex-col items-center text-center transition-all shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-2">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-arabic text-slate-900 dark:text-gold-200">{t('hierarchy.board')}</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-arabic mt-1">{t('hierarchy.boardDesc')}</p>
          </div>

          {/* COO */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-slate-50 dark:bg-navy-900/90 hover:border-gold-500 flex flex-col items-center text-center transition-all shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-2">
              <Settings className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-arabic text-slate-900 dark:text-gold-200">{t('hierarchy.coo')}</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-arabic mt-1">{t('hierarchy.cooDesc')}</p>
          </div>

          {/* Marketing */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-slate-50 dark:bg-navy-900/90 hover:border-gold-500 flex flex-col items-center text-center transition-all shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-2">
              <Megaphone className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-arabic text-slate-900 dark:text-gold-200">{t('hierarchy.marketing')}</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-arabic mt-1">{t('hierarchy.marketingDesc')}</p>
          </div>

          {/* Tech */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-slate-50 dark:bg-navy-900/90 hover:border-gold-500 flex flex-col items-center text-center transition-all shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-2">
              <Code className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-arabic text-slate-900 dark:text-gold-200">{t('hierarchy.tech')}</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-arabic mt-1">{t('hierarchy.techDesc')}</p>
          </div>

          {/* PR & Partnerships */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-slate-50 dark:bg-navy-900/90 hover:border-gold-500 flex flex-col items-center text-center transition-all shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-600 dark:text-gold-400 mb-2">
              <Handshake className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold font-arabic text-slate-900 dark:text-gold-200">{t('hierarchy.pr')}</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-arabic mt-1">{t('hierarchy.prDesc')}</p>
          </div>
        </div>
      </div>

      {/* ================= LEVEL 3: REGIONAL COORDINATORS (منسقو الجهات) ================= */}
      <div className="my-8 pt-6 border-t border-slate-200 dark:border-gold-500/30">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-gold-600 dark:text-gold-400" />
          <h3 className="text-sm sm:text-base font-bold font-arabic text-slate-900 dark:text-gold-300">
            {t('hierarchy.coordinators')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: t('hierarchy.westCoord'), desc: t('hierarchy.westDesc'), wilayas: 'Oran, Tlemcen, Mostaganem, Chlef, SBA...', icon: '🌅' },
            { title: t('hierarchy.eastCoord'), desc: t('hierarchy.eastDesc'), wilayas: 'Constantine, Sétif, Annaba, Batna, Guelma...', icon: '⛰️' },
            { title: t('hierarchy.centerCoord'), desc: t('hierarchy.centerDesc'), wilayas: 'Alger, Blida, Tizi Ouzou, Boumerdès, Béjaïa...', icon: '🏛️' },
            { title: t('hierarchy.southCoord'), desc: t('hierarchy.southDesc'), wilayas: 'Ouargla, Biskra, Adrar, Ghardaïa, El Oued...', icon: '🌴' },
          ].map((reg, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-slate-50 dark:bg-navy-850 hover:bg-white dark:hover:bg-navy-800 transition-all flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{reg.icon}</span>
                <h4 className="text-xs font-bold font-arabic text-slate-900 dark:text-white">{reg.title}</h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 font-arabic mt-2">{reg.desc}</p>
              <div className="mt-2 text-[10px] text-gold-700 dark:text-gold-400 font-mono">
                {reg.wilayas}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= LEVEL 4: AMBASSADOR NETWORK (شبكة السفراء) ================= */}
      <div className="mb-8 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-gold-500/40 bg-slate-50 dark:bg-gradient-to-r dark:from-navy-900 dark:via-navy-850 dark:to-navy-900">
        <div className="text-center mb-5">
          <h3 className="text-base sm:text-lg font-black font-arabic text-slate-900 dark:text-gold-200">
            {t('hierarchy.ambassadorsNetwork')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-gray-400 font-arabic mt-0.5">
            {t('hierarchy.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-gold-500/25 flex flex-col items-center text-center shadow-sm">
            <GraduationCap className="w-7 h-7 text-gold-600 dark:text-gold-400 mb-2" />
            <h4 className="text-xs font-bold font-arabic text-slate-900 dark:text-white">{t('hierarchy.univAmbassadors')}</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-arabic mt-1">{t('hierarchy.univDesc')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-gold-500/25 flex flex-col items-center text-center shadow-sm">
            <Building className="w-7 h-7 text-gold-600 dark:text-gold-400 mb-2" />
            <h4 className="text-xs font-bold font-arabic text-slate-900 dark:text-white">{t('hierarchy.wilayaAmbassadors')}</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-arabic mt-1">{t('hierarchy.wilayaDesc')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-navy-950 border border-slate-200 dark:border-gold-500/25 flex flex-col items-center text-center shadow-sm">
            <School className="w-7 h-7 text-gold-600 dark:text-gold-400 mb-2" />
            <h4 className="text-xs font-bold font-arabic text-slate-900 dark:text-white">{t('hierarchy.highschoolAmbassadors')}</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 font-arabic mt-1">{t('hierarchy.highschoolDesc')}</p>
          </div>
        </div>
      </div>

      {/* ================= LEVEL 5: STRATEGIC RESULTS & GOALS ================= */}
      <div className="pt-4 border-t border-slate-200 dark:border-gold-500/30 text-center">
        <h3 className="text-sm sm:text-base font-bold font-arabic text-slate-900 dark:text-gold-300 mb-4">
          {t('hierarchy.goalsTitle')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            { title: t('hierarchy.goal1'), icon: Handshake },
            { title: t('hierarchy.goal2'), icon: Lightbulb },
            { title: t('hierarchy.goal3'), icon: Award },
            { title: t('hierarchy.goal4'), icon: TrendingUp },
            { title: t('hierarchy.goal5'), icon: Globe2 },
          ].map((goal, idx) => {
            const Icon = goal.icon;
            return (
              <div
                key={idx}
                className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-gold-500/20 flex flex-col items-center text-center shadow-sm"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold-600 dark:text-gold-400 mb-1 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-bold font-arabic text-slate-700 dark:text-gray-200 leading-tight">
                  {goal.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer Ribbon */}
        <div className="mt-5 sm:mt-6 py-2 sm:py-2.5 px-4 sm:px-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-gold-500/30 to-amber-500/20 border border-gold-500/50 inline-block font-arabic font-extrabold text-gold-800 dark:text-gold-200 text-xs sm:text-sm tracking-wide shadow-sm max-w-full">
          🇩🇿 {t('hierarchy.slogan')}
        </div>
      </div>
    </div>
  );
};
