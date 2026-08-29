'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  Menu,
  Sparkles,
  ShieldCheck,
  UserCheck,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';

interface AppTopHeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenAuth: () => void;
}

export const AppTopHeader: React.FC<AppTopHeaderProps> = ({
  onOpenMobileSidebar,
  onOpenAuth,
}) => {
  const { t, locale, changeLocale, isRtl } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, switchRole, logout } = useAuthStore();

  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/${locale}/bot?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const displayName = isMounted && currentUser?.name
    ? currentUser.name.split(' ')[0]
    : locale === 'ar'
    ? 'طالب الامتياز'
    : 'Taylor';

  return (
    <header className="sticky top-0 z-30 w-full h-18 bg-white/80 dark:bg-[#070B16]/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-navy-800/80 px-4 sm:px-8 flex items-center justify-between gap-4 font-arabic transition-colors duration-300">
      {/* Left: Mobile Hamburger & Greeting */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-2xl bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-navy-800 cursor-pointer"
          aria-label="Open Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Greeting matching Eduplex "Welcome back Taylor 👋" */}
        <div>
          <h1 className="text-base sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
            <span>
              {locale === 'ar'
                ? `مرحباً بك، ${displayName}`
                : `Welcome back, ${displayName}`}
            </span>
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-gray-400 hidden sm:block">
            {locale === 'ar'
              ? 'المنصة الأكاديمية الأولى في الجزائر • دورات وبنك الامتحانات 2026'
              : 'Algerian Excellence SaaS Platform • Live Dawarat & Past Exams'}
          </p>
        </div>
      </div>

      {/* Center/Right: Search Bar & Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Pill Search Bar matching Eduplex image */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden md:block w-48 lg:w-72"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              locale === 'ar'
                ? 'بحث في الدورات والامتحانات...'
                : 'Search courses & exams...'
            }
            className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2 rounded-full bg-slate-100/90 dark:bg-navy-850/90 border border-transparent focus:border-gold-500 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-all"
          />
        </form>

        {/* Quick Role Switcher Pill */}
        <div className="hidden sm:block">
          <RoleSwitcher />
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-slate-100 dark:bg-navy-850 p-1 rounded-full border border-slate-200 dark:border-navy-750 text-[11px] font-mono font-bold">
          {(['ar', 'fr', 'en'] as const).map((l) => (
            <button
              key={l}
              onClick={() => changeLocale(l)}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                locale === l
                  ? 'bg-gold-500 text-navy-950 shadow-sm font-black'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-slate-100 dark:bg-navy-850 text-slate-600 dark:text-gold-400 hover:bg-slate-200 dark:hover:bg-navy-800 transition-all cursor-pointer"
          title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Notifications Icon with Badge counter '2' */}
        <Link
          href={`/${locale}/student`}
          className="relative p-2 rounded-full bg-slate-100 dark:bg-navy-850 text-slate-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-navy-800 transition-all"
          title={locale === 'ar' ? 'التنبيهات' : 'Notifications'}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 rtl:-right-auto rtl:-left-0.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-sm">
            2
          </span>
        </Link>

        {/* User Avatar matching Eduplex */}
        {isMounted && currentUser ? (
          <Link
            href={`/${locale}/card`}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gold-500 to-amber-400 text-navy-950 font-black text-xs flex items-center justify-center shadow-md ring-2 ring-gold-500/40 group-hover:scale-105 transition-transform">
              {currentUser.name.charAt(0)}
            </div>
          </Link>
        ) : (
          <button
            onClick={onOpenAuth}
            className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow hover:shadow-gold-glow-lg transition-all active:scale-95 cursor-pointer"
          >
            <span>{locale === 'ar' ? 'دخول' : 'Sign In'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
