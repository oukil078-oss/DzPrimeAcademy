'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Bot,
  CreditCard,
  GraduationCap,
  Building2,
  Calendar,
  Star,
  Users,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Compass,
  Award,
  Video,
  Send,
  MapPin,
  Flame,
  Zap,
  Clock,
  TrendingUp,
  Download,
  ShieldCheck,
  Crown,
  LogIn,
  Sun,
  Moon,
  ArrowRight,
  ArrowLeft,
  Search,
  Shield,
} from 'lucide-react';
import { KnowlyHeroSection } from '@/components/home/KnowlyHeroSection';
import { DecisionTreeBot } from '@/components/bot/DecisionTreeBot';
import { MembershipCard } from '@/components/card/MembershipCard';
import { PackCard } from '@/components/dawarat/PackCard';
import { PackCheckoutModal } from '@/components/dawarat/PackCheckoutModal';
import { RoleSwitcherModal } from '@/components/shared/RoleSwitcherModal';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import {
  AMBASSADORS,
  DAWARAT_PACKS,
  WILAYAS,
  EXAMS,
  getLocalizedAmbassadorBio,
  getLocalizedWilayaName,
} from '@/lib/initial-data';
import { DawaaraPack } from '@/types';

interface LandingPageProps {
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { t, locale, changeLocale, isRtl } = useTranslation();
  const { switchRole } = useAuthStore();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [activeCheckoutPack, setActiveCheckoutPack] = useState<DawaaraPack | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dz_prime_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dz_prime_theme', 'light');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0D17] text-white font-arabic select-none transition-colors duration-300">
      {/* ================= 1. CLEAN GUEST TOP NAVBAR (Uncrammed, Full-Width) ================= */}
      <header className="sticky top-0 z-50 w-full bg-[#0A0D17]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-8 lg:px-12 py-3.5 transition-colors">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gold-500 via-amber-400 to-gold-600 flex items-center justify-center text-navy-950 font-black shadow-gold-glow shrink-0">
              <span className="text-lg">🇩🇿</span>
            </div>
            <div className="flex flex-col text-left rtl:text-right">
              <span className="text-base font-black tracking-tight text-white font-sans flex items-center gap-1">
                <span>DZ PRIME</span>
                <span className="text-gold-400 font-mono text-xs">ACADEMY</span>
              </span>
              <span className="text-[10px] font-bold text-gray-400 tracking-wider">
                {locale === 'ar' ? 'منصة الامتياز الجزائرية 2026' : 'Algerian Excellence SaaS'}
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Hidden on small mobile) */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-bold text-gray-300 font-arabic">
            <a href="#dawarat-section" className="hover:text-gold-400 transition-colors">
              {locale === 'ar' ? 'دورات التحضير المباشرة 🔴' : 'Live Masterclasses'}
            </a>
            <a href="#bot-section" className="hover:text-gold-400 transition-colors">
              {locale === 'ar' ? 'بوت الامتحانات الذكي 🤖' : 'AI Exam Finder'}
            </a>
            <a href="#card-section" className="hover:text-gold-400 transition-colors">
              {locale === 'ar' ? 'البطاقة الرقمية 💳' : 'Digital ID Card'}
            </a>
            <Link href={`/${locale}/ambassadors`} className="hover:text-gold-400 transition-colors">
              {locale === 'ar' ? 'شبكة 58 ولاية 🇩🇿' : '58 Wilayas Network'}
            </Link>
          </nav>

          {/* Right: Language + Theme + Role Sandbox Button + Sign In CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Sandbox Modal Trigger */}
            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-gold-300 text-xs font-bold font-arabic transition-all cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-gold-400" />
              <span>{locale === 'ar' ? 'معاينة الأدوار (Roles)' : 'Demo Roles'}</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center bg-white/10 p-1 rounded-full border border-white/15 text-[11px] font-mono font-bold">
              {(['ar', 'fr', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => changeLocale(l)}
                  className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    locale === l
                      ? 'bg-gold-500 text-navy-950 shadow-sm font-black'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/10 text-gold-400 hover:bg-white/15 transition-all cursor-pointer"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Sign In CTA */}
            <button
              onClick={onOpenAuth}
              className="px-4.5 py-2 rounded-full bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow hover:shadow-gold-glow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= 2. MAIN LANDING CONTENT CONTAINER (Fluid max-w-[1600px]) ================= */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-14 space-y-20">
        {/* HERO SHOWCASE (Knowly Neo Gen-Z Design) */}
        <KnowlyHeroSection />

        {/* LIVE DAWARAT PACKS SECTION */}
        <section id="dawarat-section" className="space-y-8 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold font-arabic mb-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>{locale === 'ar' ? '🇩🇿 دورات التحضير المباشرة 2026' : 'Dawarat Live 2026'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-arabic">
                {locale === 'ar' ? 'حزم التحضير للامتحانات والمسابقات' : 'Packs de Préparation Examens & Concours'}
              </h2>
            </div>

            <Link
              href={`/${locale}/dawarat`}
              className="px-6 py-3 rounded-2xl bg-[#D9F99D] hover:bg-[#BEF264] text-[#142A10] font-black text-xs sm:text-sm transition-all shadow-md active:scale-95 flex items-center gap-2 w-fit"
            >
              <span>{locale === 'ar' ? 'استعراض كل الحزم المتاحة' : 'Tous les Packs'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {DAWARAT_PACKS.slice(0, 3).map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                onOpenCheckout={(p) => setActiveCheckoutPack(p)}
              />
            ))}
          </div>
        </section>

        {/* DECISION TREE AI BOT SECTION */}
        <section id="bot-section" className="space-y-8 pt-4">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-gold-500/15 text-gold-300 border border-gold-500/30 text-xs sm:text-sm font-bold">
              🤖 {locale === 'ar' ? 'البوت الذكي للبحث عن المواضيع والحلول' : 'Bot Décisionnel Examens'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white font-arabic">
              {locale === 'ar' ? 'اعثر على موضوعك في 3 خطوات بسيطة' : 'Trouvez votre sujet en 3 clics'}
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <DecisionTreeBot />
          </div>
        </section>

        {/* DIGITAL MEMBERSHIP CARD SECTION */}
        <section id="card-section" className="p-8 sm:p-14 rounded-[3rem] bg-[#0E1322] border border-white/10 shadow-2xl space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <span className="px-4 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">
                💳 {locale === 'ar' ? 'البطاقة الأكاديمية الرسمية' : 'Carte d\'Adhérent'}
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-white font-arabic mt-2">
                {locale === 'ar' ? 'بطاقة العضوية الرقمية المشفرة' : 'Votre Carte Numérique Sécurisée'}
              </h3>
              <p className="text-xs sm:text-base text-gray-400 mt-2 max-w-2xl leading-relaxed">
                {locale === 'ar'
                  ? 'مزودة برمز QR ديناميكي للتحقق الفوري من الهوية الأكاديمية وحضور الحصص والورشات.'
                  : 'Vérification instantanée via QR code national crypté.'}
              </p>
            </div>

            <button
              onClick={onOpenAuth}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 text-navy-950 font-black text-xs sm:text-sm shadow-gold-glow flex items-center gap-2 active:scale-95 transition-all w-fit cursor-pointer shrink-0"
            >
              <CreditCard className="w-4 h-4" />
              <span>{locale === 'ar' ? 'تفعيل بطاقتي الرقمية' : 'Activer ma Carte'}</span>
            </button>
          </div>

          <div className="flex justify-center pt-2">
            <div className="scale-95 sm:scale-105 transition-transform">
              <MembershipCard />
            </div>
          </div>
        </section>

        {/* 58 WILAYAS NETWORK BANNER */}
        <section className="p-8 sm:p-14 rounded-[3rem] bg-gradient-to-br from-navy-950 via-[#10172A] to-[#16131E] border border-gold-500/30 text-white shadow-2xl relative overflow-hidden text-center space-y-6">
          <div className="max-w-3xl mx-auto space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-mono font-bold">
              🇩🇿 NATIONWIDE COVERAGE • 58 WILAYAS
            </span>
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white font-arabic">
              {locale === 'ar'
                ? 'شبكة سفراء وأساتذة معتمدين في 58 ولاية'
                : 'Certified Mentors & Ambassadors across 58 Wilayas'}
            </h3>
            <p className="text-xs sm:text-base text-gray-300 font-arabic max-w-2xl mx-auto">
              {locale === 'ar'
                ? 'تنسيق محلي، ورشات حضورية وافتراضية، ومتابعة فردية لكل طالب في الجزائر.'
                : 'Local university coordination, masterclasses, and exam mentorship.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href={`/${locale}/ambassadors`}
              className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs sm:text-sm shadow-gold-glow flex items-center gap-2 active:scale-95 transition-all"
            >
              <Users className="w-4 h-4" />
              <span>{locale === 'ar' ? 'تصفح دليل السفراء في ولايتك' : 'Explore Ambassador Network'}</span>
            </Link>

            <button
              onClick={() => setIsRoleModalOpen(true)}
              className="px-7 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-gold-400" />
              <span>{locale === 'ar' ? 'تجربة المنصة كـ طالب / أستاذ / سفير' : 'Try Demo Roles'}</span>
            </button>
          </div>
        </section>
      </main>

      {/* ================= 3. FOOTER ================= */}
      <footer className="w-full border-t border-white/10 bg-[#070912] py-12 px-4 sm:px-8 text-xs text-gray-400 font-arabic">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white font-sans">DZ PRIME ACADEMY</span>
            <span>• © 2026 Tous droits réservés</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-gray-400">
            <span>58 WILAYAS</span>
            <span>•</span>
            <span>BARIDIMOB VIP</span>
            <span>•</span>
            <span>BAC & LMD & MÉDECINE</span>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      {activeCheckoutPack && (
        <PackCheckoutModal
          isOpen={!!activeCheckoutPack}
          pack={activeCheckoutPack}
          onClose={() => setActiveCheckoutPack(null)}
        />
      )}

      {/* Role Switcher Sandbox Modal */}
      <RoleSwitcherModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
      />
    </div>
  );
};
