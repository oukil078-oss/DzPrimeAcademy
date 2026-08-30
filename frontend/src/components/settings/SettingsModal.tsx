'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UserCircle,
  Palette,
  ShieldAlert,
  Lock,
  Sun,
  Moon,
  Bell,
  LogOut,
  Check,
  Landmark,
  Smartphone,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useTheme } from '@/lib/theme';
import { WILAYAS, getLocalizedWilayaName } from '@/lib/initial-data';
import { isStaff } from '@/lib/rbac';
import { Locale } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'profile' | 'preferences' | 'system' | 'security';

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, signOut } = useAuthStore();
  const { t, locale, setLocale } = useTranslation();
  const { theme, setTheme } = useTheme();
  const isAdmin = isStaff(currentUser?.role);

  const [tab, setTab] = useState<SettingsTab>('profile');
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [commissionRate, setCommissionRate] = useState(10);
  const [baridiMob, setBaridiMob] = useState(true);
  const [edahabia, setEdahabia] = useState(true);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const tabs: { id: SettingsTab; icon: any; labelAr: string; labelFr: string }[] = [
    { id: 'profile', icon: UserCircle, labelAr: 'الملف الأكاديمي', labelFr: 'Profil' },
    { id: 'preferences', icon: Palette, labelAr: 'اللغة والمظهر', labelFr: 'Préférences' },
    ...(isAdmin
      ? [{ id: 'system' as SettingsTab, icon: Landmark, labelAr: 'إعدادات الإدارة والنظام', labelFr: 'Système Admin' }]
      : []),
    { id: 'security', icon: Lock, labelAr: 'الأمان والحساب', labelFr: 'Sécurité' },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AnimatePresence>
      <div
        data-testid="settings-modal-backdrop"
        className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-navy-950/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 16 }}
          transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl border border-slate-200 dark:border-lime-500/30 bg-white dark:bg-[#0A0F1E] text-slate-900 dark:text-white shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-white/10">
            <h3 className="text-sm sm:text-base font-black">
              {locale === 'ar' ? 'إعدادات المنصة' : locale === 'fr' ? 'Paramètres de la Plateforme' : 'Platform Settings'}
            </h3>
            <button
              data-testid="settings-modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-gray-300 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-1 min-h-0 overflow-hidden">
            <div className="w-[130px] sm:w-[190px] border-r border-slate-200 dark:border-white/10 p-2 sm:p-3 space-y-1 shrink-0 overflow-y-auto">
              {tabs.map((tItem) => {
                const Icon = tItem.icon;
                const active = tab === tItem.id;
                return (
                  <button
                    key={tItem.id}
                    data-testid={`settings-tab-${tItem.id}`}
                    onClick={() => setTab(tItem.id)}
                    className={`w-full flex items-center gap-2 px-2.5 sm:px-3 py-2.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-left ${
                      active
                        ? 'bg-lime-400 text-slate-950 shadow-md'
                        : 'text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{locale === 'ar' ? tItem.labelAr : tItem.labelFr}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex-1 p-4 sm:p-6 overflow-y-auto text-xs sm:text-sm">
              {tab === 'profile' && (
                <div className="space-y-3.5" data-testid="settings-tab-profile-content">
                  <div>
                    <label className="block text-slate-500 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'الاسم الكامل' : 'Nom complet'}
                    </label>
                    <input
                      defaultValue={currentUser?.name}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-lime-400"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      defaultValue={currentUser?.email}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-lime-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'الهاتف (واتساب)' : 'Téléphone (WhatsApp)'}
                    </label>
                    <input
                      defaultValue={currentUser?.phone}
                      dir="ltr"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-lime-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'الولاية' : 'Wilaya'}
                    </label>
                    <select
                      defaultValue={currentUser?.wilayaCode || 16}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none"
                    >
                      {WILAYAS.map((w) => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {getLocalizedWilayaName(w, locale)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'المؤسسة / الجامعة' : 'Institution / Université'}
                    </label>
                    <input
                      defaultValue={currentUser?.institutionName}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none focus:border-lime-400"
                    />
                  </div>
                </div>
              )}

              {tab === 'preferences' && (
                <div className="space-y-5" data-testid="settings-tab-preferences-content">
                  <div>
                    <label className="block text-slate-500 dark:text-gray-400 mb-2 font-semibold text-[11px]">
                      {locale === 'ar' ? 'لغة الواجهة' : 'Langue de l\'interface'}
                    </label>
                    <div className="flex gap-2">
                      {(['ar', 'fr', 'en'] as Locale[]).map((l) => (
                        <button
                          key={l}
                          data-testid={`settings-locale-${l}`}
                          onClick={() => setLocale(l)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                            locale === l
                              ? 'bg-lime-400 text-slate-950 border-lime-400'
                              : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300'
                          }`}
                        >
                          {l === 'ar' ? 'العربية' : l === 'fr' ? 'Français' : 'English'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-500 dark:text-gray-400 mb-2 font-semibold text-[11px]">
                      {locale === 'ar' ? 'المظهر' : 'Apparence'}
                    </label>
                    <div className="flex gap-2">
                      <button
                        data-testid="settings-theme-light"
                        onClick={() => setTheme('light')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                          theme === 'light' ? 'bg-lime-400 text-slate-950 border-lime-400' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" />
                        <span>{locale === 'ar' ? 'وضع النهار' : 'Clair'}</span>
                      </button>
                      <button
                        data-testid="settings-theme-dark"
                        onClick={() => setTheme('dark')}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                          theme === 'dark' ? 'bg-lime-400 text-slate-950 border-lime-400' : 'border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" />
                        <span>{locale === 'ar' ? 'الوضع الليلي الفاخر' : 'Luxury Dark'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-lime-500" />
                      <span className="text-xs font-bold">
                        {locale === 'ar' ? 'إشعارات الحصص المباشرة' : 'Notifications Masterclasses'}
                      </span>
                    </div>
                    <button
                      data-testid="settings-notif-toggle"
                      onClick={() => setNotifEnabled(!notifEnabled)}
                      className={`w-10 h-5 rounded-full relative transition-all ${notifEnabled ? 'bg-lime-400' : 'bg-slate-300 dark:bg-white/15'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${notifEnabled ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              )}

              {tab === 'system' && isAdmin && (
                <div className="space-y-4" data-testid="settings-tab-system-content">
                  <div>
                    <label className="block text-slate-500 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'السنة الجامعية' : 'Année académique'}
                    </label>
                    <input
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 dark:text-gray-400 mb-1 font-semibold text-[11px]">
                      {locale === 'ar' ? 'نسبة عمولة السفراء (%)' : 'Taux Commission Ambassadeurs (%)'}
                    </label>
                    <input
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-lime-500" />
                      <span className="text-xs font-bold">BaridiMob</span>
                    </div>
                    <button
                      data-testid="settings-baridimob-toggle"
                      onClick={() => setBaridiMob(!baridiMob)}
                      className={`w-10 h-5 rounded-full relative transition-all ${baridiMob ? 'bg-lime-400' : 'bg-slate-300 dark:bg-white/15'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${baridiMob ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-lime-500" />
                      <span className="text-xs font-bold">EDAHABIA</span>
                    </div>
                    <button
                      data-testid="settings-edahabia-toggle"
                      onClick={() => setEdahabia(!edahabia)}
                      className={`w-10 h-5 rounded-full relative transition-all ${edahabia ? 'bg-lime-400' : 'bg-slate-300 dark:bg-white/15'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${edahabia ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                </div>
              )}

              {tab === 'security' && (
                <div className="space-y-4" data-testid="settings-tab-security-content">
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        {locale === 'ar' ? 'المصادقة الثنائية: مفعّلة' : 'Authentification à 2 facteurs : Activée'}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-gray-400">
                        {locale === 'ar' ? 'حسابك محمي بطبقة أمان إضافية' : 'Votre compte est protégé par une couche de sécurité supplémentaire'}
                      </p>
                    </div>
                  </div>

                  <button
                    data-testid="settings-signout-btn"
                    onClick={() => {
                      signOut();
                      onClose();
                    }}
                    className="w-full py-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{locale === 'ar' ? 'تسجيل الخروج' : 'Se déconnecter'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {tab !== 'security' && (
            <div className="p-4 border-t border-slate-200 dark:border-white/10 flex justify-end">
              <button
                data-testid="settings-save-btn"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{saved ? (locale === 'ar' ? 'تم الحفظ ✓' : 'Enregistré ✓') : locale === 'ar' ? 'حفظ التغييرات' : 'Enregistrer'}</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
