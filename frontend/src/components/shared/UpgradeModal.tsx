'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Check, Sparkles, X, ShieldCheck, Loader2, MessageCircle, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { useAuthModal } from '@/lib/authModalContext';
import { ContactActionModal } from './ContactActionModal';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
  const { t, locale } = useTranslation();
  const { currentUser, upgradeToGolden } = useAuthStore();
  const { openAuth } = useAuthModal();
  const [activationCode, setActivationCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const handleOpenContactPayment = () => {
    if (!currentUser) {
      onClose();
      openAuth('login');
      return;
    }
    setContactModalOpen(true);
  };

  const handleActivateWithCode = async () => {
    if (!currentUser) {
      onClose();
      openAuth('login');
      return;
    }
    if (!activationCode.trim()) {
      handleOpenContactPayment();
      return;
    }

    setLoading(true);
    setErrorMsg('');
    const res = await upgradeToGolden();
    setLoading(false);
    if (res?.success) {
      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5D061', '#38BDF8', '#FFFFFF'],
      });
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    } else {
      setErrorMsg(res?.error || (locale === 'ar' ? 'فشل تفعيل العضوية بهذا الكود' : 'Échec de la mise à niveau'));
    }
  };

  if (!isOpen) return null;

  const features = locale === 'ar' ? [
    'أرشيف كامل لمواضيع الامتحانات (أكثر من 12,000 موضوع من مختلف الجامعات)',
    'حلول نموذجية مفصلة مع سلم التنقيط المعتمد من الأساتذة',
    'بطاقة العضوية الرقمية الذهبية المعتمدة مع رمز QR قابل للتحقق',
    'تحميل مباشر وسريع لملفات الـ PDF دون أي قيود',
    'أولوية حجز المقاعد في الورشات والمراجعات الحضورية للولايات',
  ] : locale === 'fr' ? [
    'Archives intégrales des examens (+12 000 sujets universitaires et BAC)',
    'Corrigés-types détaillés avec barèmes officiels des enseignants',
    'Carte digitale d\'adhésion Gold avec QR code de vérification instantanée',
    'Téléchargements directs et illimités de tous les fichiers PDF',
    'Accès prioritaire aux ateliers et séances de révision présentielles',
  ] : [
    'Complete exam archives (12,000+ past papers for University and BAC)',
    'Step-by-step model solutions with official grading rubrics',
    'Digital Golden Membership Card with instant live QR verification',
    'Unlimited direct high-speed PDF downloads',
    'Priority seating for in-person workshops across all wilayas',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-navy-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl border border-slate-200 dark:border-gold-500/60 bg-white dark:bg-gradient-to-b dark:from-[#0D152A] dark:to-[#060913] p-4 sm:p-8 text-slate-900 dark:text-white shadow-2xl my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 left-3 sm:left-4 p-2 rounded-full bg-slate-100 dark:bg-navy-850 hover:bg-slate-200 dark:hover:bg-navy-800 border border-slate-200 dark:border-gold-500/30 text-slate-500 dark:text-gray-300 transition-all touch-target"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex flex-col items-center text-center mt-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-300 p-0.5 shadow-gold-glow mb-3 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-navy-950 rounded-[14px] flex items-center justify-center">
                <Crown className="w-7 h-7 text-gold-600 dark:text-gold-400" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-arabic text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-gold-300 dark:via-gold-400 dark:to-gold-600 dark:bg-clip-text">
              {locale === 'ar' ? 'العضوية الذهبية VIP' : locale === 'fr' ? 'Adhésion Gold VIP' : 'Golden VIP Membership'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-300 mt-1 max-w-sm font-arabic">
              {t('bot.upgradePrompt')}
            </p>
          </div>

          {/* Features List */}
          <div className="my-5 space-y-2.5 bg-slate-50 dark:bg-navy-900/60 border border-slate-200 dark:border-gold-500/20 rounded-2xl p-4">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-gray-200 font-arabic">
                <div className="w-4 h-4 rounded-full bg-gold-500/20 border border-gold-500/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 text-gold-600 dark:text-gold-400" />
                </div>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Primary Action: Direct Payment & Contact via WhatsApp / Telegram */}
          <div className="space-y-3">
            <button
              onClick={handleOpenContactPayment}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs font-arabic flex items-center justify-center gap-2 shadow-gold-glow hover:shadow-gold-glow-lg transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{locale === 'ar' ? 'الدفع والتفعيل الفوري (واتساب / تيليغرام)' : 'Payer & Activer (WhatsApp / Telegram)'}</span>
            </button>

            {/* Optional Activation Code */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'أو أدخل كود التفعيل إن وجد (DZPRIME2026)' : 'Ou code promo / activation'}
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/40 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 font-mono text-center"
                />
                {activationCode && (
                  <button
                    onClick={handleActivateWithCode}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-gold-500 text-slate-900 dark:text-white hover:text-navy-950 font-bold text-xs"
                  >
                    {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : (locale === 'ar' ? 'تطبيق' : 'Valider')}
                  </button>
                )}
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-500 font-bold text-center font-arabic bg-rose-500/10 py-2 px-3 rounded-xl border border-rose-500/20">
                  {errorMsg}
                </p>
              )}
            </div>
          </div>

          <p className="text-[10px] text-slate-400 dark:text-gray-500 text-center mt-3 font-arabic">
            🔒 BaridiMob • Edahabia • CCP • Instant Support Activation
          </p>
        </motion.div>
      </div>

      {contactModalOpen && (
        <ContactActionModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
          operation={{
            type: 'VIP_MEMBERSHIP_UPGRADE',
            title: locale === 'ar' ? 'ترقية العضوية الذهبية VIP' : 'Adhésion Gold VIP',
            amountDzd: 5900,
            details: 'DZ Prime Academy 2026 Annual Pass',
            user: currentUser ? {
              name: currentUser.name,
              email: currentUser.email,
              phone: currentUser.phone || undefined,
              wilayaName: currentUser.wilayaName || undefined,
            } : undefined,
          }}
        />
      )}
    </AnimatePresence>
  );
};

