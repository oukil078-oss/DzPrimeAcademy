'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Sparkles,
  User as UserIcon,
  Shield,
  Bot,
  CreditCard,
  Network,
  LayoutDashboard,
  Crown,
  LogIn,
  LogOut,
} from 'lucide-react';
import { DzPrimeLogo } from '../shared/DzPrimeLogo';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { RoleSwitcher } from '../shared/RoleSwitcher';
import { ThemeToggle } from '../shared/ThemeToggle';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isStaff } from '@/lib/rbac';
import { UpgradeModal } from '../shared/UpgradeModal';
import { AuthModal } from '../auth/AuthModal';

export const Navbar: React.FC = () => {
  const { t, locale } = useTranslation();
  const { currentUser, signOut } = useAuthStore();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const getDashboardLink = () => {
    if (!currentUser) return `/${locale}/student`;
    if (isStaff(currentUser.role)) return `/${locale}/admin`;
    if (currentUser.role === 'AMBASSADOR') return `/${locale}/ambassador`;
    return `/${locale}/student`;
  };

  const navLinks = [
    { href: `/${locale}`, label: t('nav.home'), icon: null, authRequired: false },
    { href: `/${locale}/bot`, label: t('nav.bot'), icon: Bot, authRequired: false },
    { href: `/${locale}/card`, label: t('nav.membershipCard'), icon: CreditCard, authRequired: false },
    { href: `/${locale}/#ambassadors`, label: t('nav.ambassadors'), icon: Network, authRequired: false },
    { href: `/${locale}/#hierarchy`, label: t('nav.hierarchy'), icon: Shield, authRequired: false },
    { href: getDashboardLink(), label: t('nav.dashboard'), icon: LayoutDashboard, authRequired: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-gold-500/25 bg-white/90 dark:bg-navy-950/85 backdrop-blur-xl shadow-sm transition-colors duration-300">
        {/* Top Role Switcher & Announcement Bar */}
        <div className="bg-slate-50 dark:bg-gradient-to-r dark:from-navy-900 dark:via-navy-850 dark:to-navy-900 border-b border-slate-200 dark:border-gold-500/20 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-600 dark:text-gray-300 font-arabic text-[11px] font-medium">
              {t('hero.badge')}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <RoleSwitcher />
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        {/* Main Nav Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <DzPrimeLogo size={36} showText={true} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              if (link.authRequired && !currentUser) {
                return (
                  <button
                    key={link.href}
                    onClick={() => setAuthModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold font-arabic transition-all flex items-center gap-1.5 text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-850"
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />}
                    <span>{link.label}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-arabic transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-100 text-gold-800 dark:bg-gold-500/20 dark:text-gold-300 border border-gold-500/40 shadow-sm'
                      : 'text-slate-700 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-850'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Sign In vs Logged In Profile */}
          <div className="hidden sm:flex items-center gap-2.5">
            {currentUser ? (
              <>
                {currentUser.role === 'STUDENT_PAID' || isStaff(currentUser.role) ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gold-500/15 border border-gold-500/40 text-gold-700 dark:text-gold-300 text-xs font-bold font-arabic shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                    <span>{currentUser.name.split(' ')[0]}</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setUpgradeModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-extrabold text-xs font-arabic flex items-center gap-1.5 shadow-gold-glow transition-all active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t('nav.upgrade')}</span>
                  </button>
                )}

                <Link
                  href={getDashboardLink()}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-navy-850 dark:hover:bg-navy-800 border border-slate-300 dark:border-gold-500/30 text-slate-700 dark:text-gold-300 transition-all"
                  title={t('nav.dashboard')}
                >
                  <UserIcon className="w-4 h-4" />
                </Link>

                <button
                  onClick={signOut}
                  className="p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-500 hover:text-rose-600 dark:text-gray-400 dark:hover:text-rose-400 border border-transparent hover:border-rose-400/30 transition-all"
                  title={locale === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-gold-500/30 hover:border-gold-500 text-slate-700 dark:text-gold-300 hover:bg-slate-100 dark:hover:bg-navy-800 font-bold text-xs font-arabic flex items-center gap-1.5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{locale === 'ar' ? 'دخول' : locale === 'fr' ? 'Connexion' : 'Sign In'}</span>
                </button>

                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs font-arabic shadow-gold-glow flex items-center gap-1.5 transition-all active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{locale === 'ar' ? 'انضم الآن' : locale === 'fr' ? 'S\'inscrire' : 'Join Now'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-gold-400 border border-slate-300 dark:border-gold-500/30"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-gold-500/20 bg-white dark:bg-navy-950 px-4 py-4 space-y-2 shadow-2xl">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold font-arabic text-slate-800 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-navy-850"
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-200 dark:border-gray-800 flex flex-col gap-2">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-gold-300">
                    {currentUser.name} ({currentUser.role})
                  </span>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs text-rose-500 font-bold"
                  >
                    {locale === 'ar' ? 'خروج' : 'Déconnexion'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-gold-500 text-navy-950 font-extrabold text-xs font-arabic text-center shadow-gold-glow"
                >
                  {locale === 'ar' ? 'تسجيل الدخول / تجربة الأدوار' : 'Connexion / Démo'}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <UpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
