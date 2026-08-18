'use client';

import React from 'react';
import { DecisionTreeBot } from '@/components/bot/DecisionTreeBot';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function BotPage() {
  const { t } = useTranslation();

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <span className="px-4 py-1 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider font-arabic">
          DZ PRIME SMART EXAM BOT
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-arabic text-white mt-3">
          {t('bot.title')}
        </h1>
        <p className="text-xs sm:text-base text-gray-300 font-arabic mt-3">
          {t('bot.subtitle')}
        </p>
      </div>

      <DecisionTreeBot />
    </div>
  );
}
