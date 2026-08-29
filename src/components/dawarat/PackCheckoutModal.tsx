'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  CheckCircle2,
  CreditCard,
  Building,
  UserCheck,
  Tag,
  Phone,
  Mail,
  User,
  Video,
  Download,
  Calendar,
  Layers,
  Crown,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { DawaaraPack, PaymentMethod, PackEnrollment } from '@/types';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore, useEnrollmentStore } from '@/lib/store';
import { isGoldenMember } from '@/lib/rbac';
import { WILAYAS } from '@/lib/initial-data';

interface PackCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  pack: DawaaraPack | null;
  initialSelectedModuleIds?: string[];
}

export const PackCheckoutModal: React.FC<PackCheckoutModalProps> = ({
  isOpen,
  onClose,
  pack,
  initialSelectedModuleIds,
}) => {
  const { t, locale, isRtl } = useTranslation();
  const { currentUser } = useAuthStore();
  const { addEnrollment } = useEnrollmentStore();
  const isGold = isGoldenMember(currentUser);

  const [isFullPack, setIsFullPack] = useState(true);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BARIDIMOB');
  const [copiedRip, setCopiedRip] = useState(false);

  // Student form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState<number>(16);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (pack) {
      if (initialSelectedModuleIds && initialSelectedModuleIds.length > 0 && initialSelectedModuleIds.length < pack.modules.length) {
        setIsFullPack(false);
        setSelectedModuleIds(initialSelectedModuleIds);
      } else {
        setIsFullPack(true);
        setSelectedModuleIds(pack.modules.map((m) => m.id));
      }

      if (currentUser) {
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
        setPhone(currentUser.phone || '+213 661 00 00 00');
        setWilaya(currentUser.wilayaCode || 16);
      }
    }
  }, [pack, initialSelectedModuleIds, currentUser]);

  if (!isOpen || !pack) return null;

  const packTitle = locale === 'fr' ? pack.titleFr : locale === 'en' ? pack.titleEn : pack.titleAr;

  // Toggle single module in custom mode
  const handleToggleModule = (modId: string) => {
    setSelectedModuleIds((prev) => {
      const exists = prev.includes(modId);
      const next = exists ? prev.filter((id) => id !== modId) : [...prev, modId];
      if (next.length === pack.modules.length) {
        setIsFullPack(true);
      } else {
        setIsFullPack(false);
      }
      return next;
    });
  };

  const handleSelectFullPack = () => {
    setIsFullPack(true);
    setSelectedModuleIds(pack.modules.map((m) => m.id));
  };

  const handleSelectCustomModules = () => {
    setIsFullPack(false);
    if (selectedModuleIds.length === 0 || selectedModuleIds.length === pack.modules.length) {
      // default to first module if switching
      setSelectedModuleIds([pack.modules[0].id]);
    }
  };

  // Pricing calculation
  const calculateTotal = () => {
    let subtotal = 0;
    if (isFullPack) {
      subtotal = isGold ? pack.vipDiscountPrice : pack.packPrice;
    } else {
      subtotal = pack.modules
        .filter((m) => selectedModuleIds.includes(m.id))
        .reduce((sum, m) => sum + m.individualPrice, 0);
    }
    const finalTotal = Math.max(0, subtotal - promoDiscount);
    return { subtotal, finalTotal };
  };

  const { subtotal, finalTotal } = calculateTotal();

  // Apply promo / ambassador referral code
  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;

    const validCodes = [pack.referralCode.toUpperCase(), 'USTHB16', 'ORAN31', 'MED25', 'BAC2026', 'VIP2026', 'DZPRIME'];
    if (validCodes.includes(code)) {
      setPromoApplied(true);
      setPromoDiscount(500);
      setPromoError('');
    } else {
      setPromoApplied(false);
      setPromoDiscount(0);
      setPromoError(locale === 'ar' ? 'كود الإحالة غير صالح، يرجى التحقق من سفيرك' : 'Code promo non valide');
    }
  };

  const handleCopyRip = () => {
    navigator.clipboard.writeText('00799999002345678942');
    setCopiedRip(true);
    setTimeout(() => setCopiedRip(false), 2500);
  };

  const handleSubmitEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedModuleIds.length === 0) return;

    setIsSubmitting(true);

    const newEnrollment: PackEnrollment = {
      id: `enr-${Date.now()}`,
      studentId: currentUser?.id || 'guest-student',
      studentName: name || currentUser?.name || 'Étudiant',
      studentEmail: email || currentUser?.email || 'student@dzprime.academy',
      studentPhone: phone || currentUser?.phone || '+213 555 00 00 00',
      packId: isFullPack ? pack.id : undefined,
      packTitle: isFullPack ? pack.titleAr : `${pack.titleAr} (${selectedModuleIds.length} مقاييس)`,
      moduleIds: selectedModuleIds,
      totalPaid: finalTotal,
      paymentMethod,
      referralCodeUsed: promoApplied ? promoInput.trim().toUpperCase() : undefined,
      ambassadorDiscountApplied: promoDiscount,
      status: 'CONFIRMED',
      receiptUrl: `DZ-DAW-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addEnrollment(newEnrollment);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmed(true);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F5D061', '#10B981', '#3B82F6'],
        });
      } catch (err) {}
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-gold-500/40 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 pb-4 bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border-b border-gold-500/30 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-bold text-lg shrink-0">
              🎓
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-gold-400 font-bold">
                DZ PRIME ACADEMY • LIVE SESSIONS
              </span>
              <h3 className="text-base sm:text-lg font-black font-arabic text-white">
                {isConfirmed ? t('dawarat.successTitle') : t('dawarat.checkoutTitle')}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isConfirmed ? (
          <form onSubmit={handleSubmitEnrollment} className="p-5 sm:p-6 space-y-6 font-arabic max-h-[75vh] overflow-y-auto">
            {/* Pack Overview Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-gold-500/10 border border-gold-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-gold-700 dark:text-gold-300">
                  {pack.badgeAr}
                </span>
                <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {packTitle}
                </h4>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-0.5">
                  {pack.totalHours} {t('dawarat.hours')} • {pack.totalSessions} {t('dawarat.sessions')}
                </p>
              </div>

              <div className="text-right sm:text-left shrink-0">
                <div className="text-xs text-slate-500 dark:text-gray-400">
                  {t('dawarat.ambassadorSponsor')}
                </div>
                <div className="text-xs font-bold text-gold-700 dark:text-gold-300">
                  {pack.ambassadorName} ({pack.referralCode})
                </div>
              </div>
            </div>

            {/* Selection Mode: Full Pack vs Pick Modules */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-2">
                {t('dawarat.chooseModules')}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  onClick={handleSelectFullPack}
                  className={`p-3.5 rounded-2xl border text-left rtl:text-right transition-all flex flex-col justify-between cursor-pointer ${
                    isFullPack
                      ? 'border-gold-500 bg-gold-500/15 dark:bg-gold-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-850 hover:border-gold-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {t('dawarat.fullPackSelected')}
                    </span>
                    {isFullPack && <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />}
                  </div>
                  <div className="mt-2 text-xs text-gold-600 dark:text-gold-400 font-mono font-black">
                    {isGold ? pack.vipDiscountPrice.toLocaleString() : pack.packPrice.toLocaleString()} DZD
                    <span className="text-[10px] text-slate-400 line-through mr-1 ml-1">
                      {pack.originalTotalPrice.toLocaleString()} DZD
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleSelectCustomModules}
                  className={`p-3.5 rounded-2xl border text-left rtl:text-right transition-all flex flex-col justify-between cursor-pointer ${
                    !isFullPack
                      ? 'border-gold-500 bg-gold-500/15 dark:bg-gold-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-850 hover:border-gold-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 dark:text-white">
                      {t('dawarat.customizeModules')}
                    </span>
                    {!isFullPack && <CheckCircle2 className="w-4 h-4 text-gold-500 shrink-0" />}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500 dark:text-gray-400">
                    {locale === 'ar' ? 'حدد مقياساً واحداً أو مقياسين بالوحدة' : 'Sélectionnez des modules spécifiques'}
                  </div>
                </button>
              </div>

              {/* Module Checkbox List if Custom mode is on */}
              {!isFullPack && (
                <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                  {pack.modules.map((m) => {
                    const isChecked = selectedModuleIds.includes(m.id);
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleToggleModule(m.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'border-gold-500/70 bg-white dark:bg-navy-850 shadow-sm'
                            : 'border-slate-200 dark:border-navy-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              isChecked
                                ? 'bg-gold-500 border-gold-500 text-navy-950'
                                : 'border-slate-300 dark:border-gray-600'
                            }`}
                          >
                            {isChecked && <Check className="w-3.5 h-3.5 font-bold" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {locale === 'fr' ? m.nameFr : m.nameAr}
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-gray-400">
                              {m.teacherName} ({m.hoursCount}h)
                            </div>
                          </div>
                        </div>

                        <div className="text-xs font-black font-mono text-gold-600 dark:text-gold-400">
                          {m.individualPrice.toLocaleString()} DZD
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Student Personal Info */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200">
                {locale === 'ar' ? 'معلومات الطالب للتسجيل وتسليم رابط الحصص:' : 'Coordonnées de l\'étudiant :'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <User className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder={locale === 'ar' ? 'الاسم واللقب الكامل' : 'Nom et Prénom'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full py-2.5 px-9 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Mail className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-2.5 px-9 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Phone className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      placeholder="06XX XX XX XX (WhatsApp / Telegram)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full py-2.5 px-9 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={wilaya}
                    onChange={(e) => setWilaya(Number(e.target.value))}
                    className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                  >
                    {WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {locale === 'fr' ? w.nameFr : w.nameAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Ambassador Referral Promo Code */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <div className="flex items-center justify-between gap-2 mb-2">
                <label className="text-xs font-bold text-slate-800 dark:text-gray-200 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-gold-500" />
                  <span>{t('dawarat.referralPromo')}</span>
                </label>
                <span className="text-[10px] text-slate-400 dark:text-gray-500">
                  {t('dawarat.referralPromoHelp')}
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder={`e.g. ${pack.referralCode}`}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-850 text-xs text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-gold-500"
                />
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-navy-800 hover:bg-gold-500 hover:text-navy-950 text-slate-800 dark:text-white font-bold text-xs transition-all cursor-pointer"
                >
                  {t('dawarat.applyCode')}
                </button>
              </div>

              {promoApplied && (
                <div className="mt-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('dawarat.discountApplied')} (-500 DZD)</span>
                </div>
              )}
              {promoError && (
                <div className="mt-2 text-xs text-rose-500 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{promoError}</span>
                </div>
              )}
            </div>

            {/* Payment Method Selector in Algeria */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-gray-200 mb-2">
                {t('dawarat.paymentMethod')}
              </label>

              <div className="space-y-2">
                {/* 1. BaridiMob */}
                <div
                  onClick={() => setPaymentMethod('BARIDIMOB')}
                  className={`p-3 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'BARIDIMOB'
                      ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/15'
                      : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-850'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-gold-600 dark:text-gold-400 flex items-center justify-center text-sm font-bold shrink-0">
                      📱
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 dark:text-white">
                        {t('dawarat.paymentBaridiMob')}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                        {locale === 'ar'
                          ? 'تحويل مباشر عبر تطبيق بريدي موب، وتفعيل فوري للاشتراك'
                          : 'Virement direct via application BaridiMob (Activation immédiate)'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'BARIDIMOB'}
                    onChange={() => setPaymentMethod('BARIDIMOB')}
                    className="mt-1 text-gold-500"
                  />
                </div>

                {paymentMethod === 'BARIDIMOB' && (
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-slate-700 dark:text-gray-300">
                      <span>RIP DZ PRIME:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gold-600 dark:text-gold-400">00799999002345678942</span>
                        <button
                          type="button"
                          onClick={handleCopyRip}
                          className="p-1 rounded bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-gray-300 hover:text-gold-500 cursor-pointer"
                        >
                          {copiedRip ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Edahabia / CIB */}
                <div
                  onClick={() => setPaymentMethod('EDAHABIA')}
                  className={`p-3 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'EDAHABIA'
                      ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/15'
                      : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-850'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-gold-600 dark:text-gold-400 flex items-center justify-center text-sm font-bold shrink-0">
                      💳
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 dark:text-white">
                        {t('dawarat.paymentEdahabia')}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                        {locale === 'ar' ? 'الدفع الإلكتروني الآمن عبر موزع بريد الجزائر' : 'Paiement en ligne sécurisé Algérie Poste'}
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'EDAHABIA'}
                    onChange={() => setPaymentMethod('EDAHABIA')}
                    className="mt-1 text-gold-500"
                  />
                </div>

                {/* 3. Cash to Wilaya Ambassador */}
                <div
                  onClick={() => setPaymentMethod('AMBASSADOR_CASH')}
                  className={`p-3 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'AMBASSADOR_CASH'
                      ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/15'
                      : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-850'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold shrink-0">
                      🤝
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 dark:text-white">
                        {t('dawarat.paymentCashAmbassador')}
                      </h5>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5">
                        {locale === 'ar'
                          ? `تسليم نقدي مباشر لسفير ولايتك (${pack.ambassadorName}) بجامعتك أو ثانويتك`
                          : `Paiement en espèces auprès de votre ambassadeur (${pack.ambassadorName})`}
                      </p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'AMBASSADOR_CASH'}
                    onChange={() => setPaymentMethod('AMBASSADOR_CASH')}
                    className="mt-1 text-gold-500"
                  />
                </div>
              </div>
            </div>

            {/* Price Summary & Submit CTA */}
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-navy-950 border border-slate-300 dark:border-navy-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-gray-400">
                <span>{locale === 'ar' ? 'المبلغ الأصلي:' : 'Sous-total :'}</span>
                <span className="font-mono">{subtotal.toLocaleString()} DZD</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <span>{locale === 'ar' ? 'خصم السفير المعتمد:' : 'Remise Ambassadeur :'}</span>
                  <span className="font-mono">-{promoDiscount.toLocaleString()} DZD</span>
                </div>
              )}
              {isGold && isFullPack && (
                <div className="flex items-center justify-between text-xs text-gold-600 dark:text-gold-400 font-bold">
                  <span>{locale === 'ar' ? 'ميزة العضوية الذهبية VIP:' : 'Remise Adhérent Gold VIP :'}</span>
                  <span>{locale === 'ar' ? 'مطبقة تلقائياً' : 'Appliquée'}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {t('dawarat.totalToPay')}
                </span>
                <span className="text-xl sm:text-2xl font-black font-mono text-gold-600 dark:text-gold-400">
                  {finalTotal.toLocaleString()} DZD
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || selectedModuleIds.length === 0}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-sm shadow-gold-glow flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>{t('common.loading')}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{t('dawarat.confirmEnrollment')}</span>
                </>
              )}
            </button>
          </form>
        ) : (
          /* Confirmation Success Screen */
          <div className="p-6 sm:p-8 space-y-6 text-center font-arabic">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-lg">
              ✓
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                {locale === 'ar' ? 'تم تأكيد الحجز بنجاح' : 'Inscription Confirmée'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2">
                {locale === 'ar' ? `مرحباً بك معنا في ${packTitle}!` : `Bienvenue dans ${packTitle} !`}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 max-w-md mx-auto mt-2 leading-relaxed">
                {t('dawarat.successDesc')}
              </p>
            </div>

            {/* Action Links (Meet link + Timetable) */}
            <div className="p-5 rounded-3xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3 max-w-md mx-auto text-left rtl:text-right">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400 border-b border-slate-200 dark:border-navy-800 pb-2">
                <span>{locale === 'ar' ? 'رقم الوصل الرقمي:' : 'Réf d\'inscription :'}</span>
                <span className="font-mono font-bold text-gold-600 dark:text-gold-400">
                  DZ-DAW-{Math.floor(100000 + Math.random() * 900000)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-gray-400">
                <span>{locale === 'ar' ? 'المقاييس المشترك بها:' : 'Modules Inscrits :'}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedModuleIds.length} {locale === 'ar' ? 'مقاييس' : 'modules'}
                </span>
              </div>

              <a
                href="https://meet.google.com"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Video className="w-4 h-4" />
                <span>{t('dawarat.joinMeet')}</span>
              </a>

              <button
                type="button"
                onClick={() => alert(locale === 'ar' ? 'تم تنزيل جدول الحصص بصيغة PDF' : 'Planning téléchargé')}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-850 hover:border-gold-500 text-slate-800 dark:text-gray-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-gold-500" />
                <span>{t('dawarat.downloadSchedule')}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-navy-800 hover:bg-slate-300 text-slate-800 dark:text-white font-bold text-xs transition-all cursor-pointer"
            >
              {t('dawarat.backCatalog')}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
