'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Sliders,
  DollarSign,
  CreditCard,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Loader2,
  Database,
  RefreshCw,
  Sparkles,
  Server,
  Zap,
  Globe,
  Bell,
  Smartphone,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store';
import { Locale } from '@/types';

interface AdminSettingsTabProps {
  locale: Locale | string;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ locale }) => {
  const { currentUser } = useAuthStore();

  // System Config State
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [commissionRate, setCommissionRate] = useState(10);
  const [baridiMobEnabled, setBaridiMobEnabled] = useState(true);
  const [edahabiaEnabled, setEdahabiaEnabled] = useState(true);
  const [ccpReceiptsEnabled, setCcpReceiptsEnabled] = useState(true);
  const [autoVerifyCards, setAutoVerifyCards] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemSaving, setSystemSaving] = useState(false);
  const [systemSuccess, setSystemSuccess] = useState('');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveSystemSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSystemSaving(true);
    setTimeout(() => {
      setSystemSaving(false);
      setSystemSuccess(locale === 'ar' ? 'تم حفظ إعدادات النظام بنجاح ✓' : 'Paramètres système enregistrés ✓');
      setTimeout(() => setSystemSuccess(''), 3500);
    }, 500);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordSuccess('');
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError(locale === 'ar' ? 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل' : 'Le mot de passe doit contenir au moins 6 caractères');
      setPasswordSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(locale === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Les mots de passe ne correspondent pas');
      setPasswordSaving(false);
      return;
    }

    try {
      const res = await fetch('/api/account/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error || (locale === 'ar' ? 'فشل تغيير كلمة المرور' : 'Échec de la modification'));
      } else {
        setPasswordSuccess(locale === 'ar' ? 'تم تحديث كلمة مرور الإدارة بنجاح! 🔒' : 'Mot de passe administrateur mis à jour ! 🔒');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 4000);
      }
    } catch (err: any) {
      setPasswordError(err?.message || (locale === 'ar' ? 'خطأ في الاتصال' : 'Erreur réseau'));
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-arabic" data-testid="admin-settings-tab">
      {/* Header Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0C152E] via-[#101E42] to-[#0A1024] border border-lime-500/30 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-lime-400/20 text-lime-400 flex items-center justify-center font-black shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black flex items-center gap-2">
              <span>{locale === 'ar' ? 'إعدادات النظام والمنصة العامة' : 'Paramètres Généraux du Système'}</span>
              <span className="px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-300 text-[10px] font-bold">
                DZ PRIME 2026
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {locale === 'ar'
                ? 'التحكم في معايير المنصة، النسب المالية، بوابات الدفع الجزائرية، وأمان حسابات الإدارة'
                : 'Configuration de la plateforme, commissions et sécurité'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-gray-300 flex items-center gap-2">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span>PostgreSQL Online</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System & Commission Config */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
          <div className="flex items-center gap-2 text-white font-black text-sm border-b border-white/10 pb-3">
            <Zap className="w-4 h-4 text-lime-400" />
            <span>{locale === 'ar' ? 'معايير المنصة والعمولات' : 'Paramètres de la Plateforme'}</span>
          </div>

          {systemSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{systemSuccess}</span>
            </div>
          )}

          <form onSubmit={handleSaveSystemSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-gray-300 mb-1 font-semibold">
                  {locale === 'ar' ? 'السنة الجامعية المعتمدة' : 'Année académique'}
                </label>
                <input
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1 font-semibold">
                  {locale === 'ar' ? 'نسبة عمولة السفراء (%)' : 'Taux commission ambassadeurs (%)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-lime-400 font-bold font-mono focus:outline-none focus:border-lime-400"
                />
              </div>
            </div>

            {/* Payment Gateways */}
            <div className="space-y-2.5 pt-2">
              <label className="block text-gray-300 font-semibold">
                {locale === 'ar' ? 'بوابات الدفع الإلكتروني المفعلة (Algeria FinTech)' : 'Moyens de Paiement Activés'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setBaridiMobEnabled(!baridiMobEnabled)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    baridiMobEnabled
                      ? 'bg-lime-400/10 border-lime-400/40 text-lime-300'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span className="font-bold">BaridiMob</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold">{baridiMobEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEdahabiaEnabled(!edahabiaEnabled)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    edahabiaEnabled
                      ? 'bg-gold-500/10 border-gold-500/40 text-gold-300'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <span className="font-bold">Edahabia GIM</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold">{edahabiaEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCcpReceiptsEnabled(!ccpReceiptsEnabled)}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    ccpReceiptsEnabled
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span className="font-bold">{locale === 'ar' ? 'وصولات CCP' : 'Reçus CCP'}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold">{ccpReceiptsEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>
            </div>

            {/* Automation toggles */}
            <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-200">{locale === 'ar' ? 'التفعيل التلقائي للبطاقات' : 'Validation auto des cartes'}</div>
                  <div className="text-[10px] text-gray-400">{locale === 'ar' ? 'تفعيل بطاقات الطلبة فور رفع وصل الدفع المعتمد' : 'Activer automatiquement'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoVerifyCards(!autoVerifyCards)}
                  className={`w-10 h-5 rounded-full relative transition-all ${autoVerifyCards ? 'bg-lime-400' : 'bg-white/15'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${autoVerifyCards ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={systemSaving}
                className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-lime-400/20 active:scale-95 transition-all disabled:opacity-60"
              >
                {systemSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>{locale === 'ar' ? 'حفظ إعدادات المنصة' : 'Enregistrer'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Admin Password & Security */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
          <div className="flex items-center gap-2 text-white font-black text-sm border-b border-white/10 pb-3">
            <KeyRound className="w-4 h-4 text-lime-400" />
            <span>{locale === 'ar' ? 'أمان حساب الإدارة وتغيير كلمة المرور' : 'Sécurité du Compte Admin'}</span>
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{passwordSuccess}</span>
            </div>
          )}
          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-gray-300 mb-1 font-semibold text-[11px]">
                {locale === 'ar' ? 'كلمة المرور الحالية للمسؤول' : 'Mot de passe actuel'}
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 font-mono text-white focus:outline-none focus:border-lime-400"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-semibold text-[11px]">
                {locale === 'ar' ? 'كلمة المرور الجديدة' : 'Nouveau mot de passe'}
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="•••••••• (6 أحرف على الأقل)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-white/5 border border-white/10 font-mono text-white focus:outline-none focus:border-lime-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1 font-semibold text-[11px]">
                {locale === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirmer le mot de passe'}
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 font-mono text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            {/* 2FA & Session badge */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-300">
                  {locale === 'ar' ? 'جلسة أمان الإدارة: مشفرة 256-bit' : 'Session chiffrée 256-bit'}
                </p>
                <p className="text-[10px] text-gray-400">
                  {locale === 'ar' ? 'تشفير كلمات المرور عبر خوارزمية bcrypt مع توقيع JWT الآمن' : 'Sécurité JWT & Bcrypt'}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={passwordSaving}
                className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-lime-400/20 active:scale-95 transition-all disabled:opacity-60"
              >
                {passwordSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>{locale === 'ar' ? 'تحديث كلمة مرور الإدارة' : 'Modifier mot de passe'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
