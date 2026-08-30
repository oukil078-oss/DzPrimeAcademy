'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, BookOpen, CheckCircle2, Sparkles, Loader2, LogIn } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { useAuthModal } from '@/lib/authModalContext';
import { formatDZD } from '@/lib/format';

interface MockCheckoutModalProps {
  bundle: any;
  onClose: () => void;
}

export const MockCheckoutModal: React.FC<MockCheckoutModalProps> = ({ bundle, onClose }) => {
  const { locale } = useTranslation();
  const { currentUser } = useAuthStore();
  const { openAuth } = useAuthModal();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const title = locale === 'ar' ? bundle.titleAr : bundle.titleFr || bundle.titleAr;
  const desc = locale === 'ar' ? bundle.descriptionAr : bundle.descriptionFr || bundle.descriptionAr;

  const handleConfirm = async () => {
    setStatus('loading');
    try {
      const res = await fetch(`/api/bundles/${bundle.id}/purchase`, { method: 'POST' });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        data-testid="mock-checkout-modal-backdrop"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          onClick={(e) => e.stopPropagation()}
          data-testid="mock-checkout-modal"
          className="w-full max-w-md rounded-3xl bg-white dark:bg-[#0C1428] border border-slate-200 dark:border-white/10 p-6 relative font-arabic"
        >
          <button data-testid="mock-checkout-close-btn" onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400">
            <X className="w-4 h-4" />
          </button>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-600 dark:text-amber-300 text-[10px] font-black">
            <Sparkles className="w-3 h-3" />
            {locale === 'ar' ? 'وضع تجريبي — الدفع الحقيقي قريباً' : 'Demo Mode — real payment coming soon'}
          </span>

          <h3 className="mt-3 text-base font-black text-slate-900 dark:text-white leading-snug">{title}</h3>
          <p className="mt-2 text-xs text-slate-500 dark:text-gray-400 leading-relaxed">{desc}</p>

          <div className="mt-4 flex items-center gap-4 text-xs font-bold text-slate-600 dark:text-gray-300">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-lime-500" /> {bundle.hours} {locale === 'ar' ? 'ساعة' : 'h'}</span>
            <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-lime-500" /> {bundle.lecturesCount} {locale === 'ar' ? 'محاضرات' : 'lectures'}</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <span className="text-2xl font-black text-lime-600 dark:text-lime-400">{formatDZD(bundle.currentPriceDzd, locale)}</span>
            <span className="text-sm text-slate-400 line-through">{formatDZD(bundle.originalPriceDzd, locale)}</span>
          </div>

          {!currentUser ? (
            <button
              data-testid="mock-checkout-login-btn"
              onClick={() => {
                onClose();
                openAuth('register');
              }}
              className="mt-5 w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              {locale === 'ar' ? 'سجّل مجاناً لإكمال الشراء' : "S'inscrire pour continuer"}
            </button>
          ) : status === 'success' ? (
            <div data-testid="mock-checkout-success" className="mt-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-emerald-600 dark:text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{locale === 'ar' ? 'تم تأكيد الشراء (محاكاة) — راجع لوحتك الآن.' : 'Achat confirmé (simulation) — consultez votre tableau de bord.'}</span>
            </div>
          ) : (
            <button
              data-testid="mock-checkout-confirm-btn"
              onClick={handleConfirm}
              disabled={status === 'loading'}
              className="mt-5 w-full py-3.5 rounded-2xl bg-lime-400 hover:bg-lime-300 disabled:opacity-60 text-slate-950 font-black text-xs flex items-center justify-center gap-2"
            >
              {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {locale === 'ar' ? 'تأكيد الشراء (تجريبي)' : 'Confirmer (démo)'}
            </button>
          )}
          {status === 'error' && (
            <p data-testid="mock-checkout-error" className="mt-2 text-[11px] text-rose-500 font-bold text-center">
              {locale === 'ar' ? 'حدث خطأ، حاول مجدداً' : 'Une erreur est survenue'}
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
