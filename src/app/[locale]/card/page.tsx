'use client';

import React, { useState } from 'react';
import { MembershipCard } from '@/components/card/MembershipCard';
import { useAuthStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { INSTITUTIONS, WILAYAS, getLocalizedWilayaName } from '@/lib/initial-data';
import { User } from '@/types';
import { CreditCard, Sparkles, Check } from 'lucide-react';

export default function CardStudioPage() {
  const { currentUser, setCurrentUser } = useAuthStore();
  const { t, locale } = useTranslation();

  const [name, setName] = useState(currentUser?.name || (locale === 'ar' ? 'طالب جزائري' : 'Étudiant'));
  const [wilayaCode, setWilayaCode] = useState(currentUser?.wilayaCode || 16);
  const [institutionName, setInstitutionName] = useState(
    currentUser?.institutionName || 'Université USTHB Bab Ezzouar'
  );
  const [phone, setPhone] = useState(currentUser?.phone || '+213 661 23 45 67');

  // Keep form fields synced when switching roles or users
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setWilayaCode(currentUser.wilayaCode || 16);
      setInstitutionName(currentUser.institutionName || 'Université USTHB Bab Ezzouar');
      setPhone(currentUser.phone || '+213 661 23 45 67');
    }
  }, [currentUser]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    const wilaya = WILAYAS.find((w) => w.code === Number(wilayaCode));
    const updated: User = {
      id: currentUser?.id || `user-${Date.now()}`,
      email: currentUser?.email || 'student@dzprime.academy',
      role: currentUser?.role || 'STUDENT_FREE',
      name,
      wilayaCode: Number(wilayaCode),
      wilayaName: wilaya ? getLocalizedWilayaName(wilaya, locale) : 'Alger',
      institutionName,
      phone,
      studentCardId: currentUser?.studentCardId || `DZ-STU-${wilayaCode}-${Math.floor(1000 + Math.random() * 9000)}`,
      isVerified: currentUser?.isVerified ?? true,
      createdAt: currentUser?.createdAt || new Date().toISOString().split('T')[0],
    };
    setCurrentUser(updated);
  };

  return (
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <span className="px-3.5 sm:px-4 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-700 dark:text-gold-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider font-arabic">
          DIGITAL CARD STUDIO & EXPORT
        </span>
        <h1 className="text-xl xs:text-2xl sm:text-4xl font-black font-arabic text-slate-900 dark:text-white mt-2 sm:mt-3">
          {t('card.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic mt-1.5 sm:mt-2">
          {t('card.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Form: Customizer */}
        <div className="lg:col-span-5 p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left transition-colors">
          <div className="flex items-center gap-2 mb-4 text-gold-700 dark:text-gold-300 font-bold font-arabic">
            <Sparkles className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            <h3>{t('card.customizerTitle')}</h3>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 font-arabic text-xs">
            <div>
              <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                {t('card.nameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">{t('card.wilayaLabel')}</label>
              <select
                value={wilayaCode}
                onChange={(e) => setWilayaCode(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-800 dark:text-white focus:outline-none focus:border-gold-500"
              >
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} - {getLocalizedWilayaName(w, locale)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                {t('card.institutionLabel')}
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                {t('card.phoneLabel')}
              </label>
              <input
                type="text"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-mono text-left"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs shadow-gold-glow flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
            >
              <Check className="w-4 h-4" />
              <span>{t('card.updateBtn')}</span>
            </button>
          </form>
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <MembershipCard user={currentUser || undefined} allowExport={true} />
        </div>
      </div>
    </div>
  );
}
