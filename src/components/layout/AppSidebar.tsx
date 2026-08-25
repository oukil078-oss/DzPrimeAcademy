'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Bot,
  BookOpen,
  FileText,
  Calendar,
  Users,
  ShieldCheck,
  CreditCard,
  Settings,
  Sparkles,
  Award,
  Bell,
  MessageSquare,
  LogOut,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { SidebarCardWidget } from '@/components/card/SidebarCardWidget';

interface AppSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { t, locale, isRtl } = useTranslation();
  const pathname = usePathname();
  const { currentUser, switchRole } = useAuthStore();

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isBot = pathname.includes('/bot');
  const isCard = pathname.includes('/card');
  const isStudent = pathname.includes('/student');
  const isAmbassador = pathname.includes('/ambassador');
  const isAdmin = pathname.includes('/admin');

  const navItems = [
    {
      id: 'dashboard',
      label: t('nav.dashboard'),
      href: `/${locale}`,
      icon: LayoutDashboard,
      isActive: isHome && !isBot && !isCard && !isStudent && !isAmbassador && !isAdmin,
      badge: null,
    },
    {
      id: 'bot',
      label: t('nav.bot'),
      href: `/${locale}/bot`,
      icon: Bot,
      isActive: isBot,
      badge: 'AI',
    },
    {
      id: 'modules',
      label: currentUser?.role === 'TEACHER'
        ? (locale === 'ar' ? 'فضاء الأستاذ' : locale === 'fr' ? 'Espace Enseignant' : 'Teacher Hub')
        : (locale === 'ar' ? 'المقاييس والمقررات' : locale === 'fr' ? 'Mes Modules' : 'My Modules'),
      href: `/${locale}/student`,
      icon: BookOpen,
      isActive: isStudent,
      badge: null,
    },
    {
      id: 'annales',
      label: locale === 'ar' ? 'بنك الامتحانات' : locale === 'fr' ? 'Annales & Sujets' : 'Exam Papers',
      href: `/${locale}/bot`,
      icon: FileText,
      isActive: false,
      badge: '+12k',
    },
    {
      id: 'calendar',
      label: locale === 'ar' ? 'الرزنامة والورشات' : locale === 'fr' ? 'Calendrier & Séances' : 'Schedule',
      href: `/${locale}#schedule`,
      icon: Calendar,
      isActive: false,
      badge: '2',
      badgeColor: 'bg-amber-500 text-navy-950',
    },
    {
      id: 'ambassadors',
      label: t('nav.ambassadors'),
      href: `/${locale}/ambassador`,
      icon: Users,
      isActive: isAmbassador,
      badge: null,
    },
    {
      id: 'hierarchy',
      label: t('nav.hierarchy'),
      href: `/${locale}/admin`,
      icon: ShieldCheck,
      isActive: isAdmin,
      badge: null,
    },
    {
      id: 'card',
      label: t('nav.membershipCard'),
      href: `/${locale}/card`,
      icon: CreditCard,
      isActive: isCard,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 select-none font-arabic">
      {/* ================= TOP SECTION: LOGO ================= */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 px-2 pt-1">
          <Link
            href={`/${locale}`}
            onClick={onMobileClose}
            className="flex items-center gap-2.5 group"
          >
            {/* Logo Emblem */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lime-400 via-emerald-400 to-teal-400 dark:from-gold-500 dark:via-gold-400 dark:to-amber-300 p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#121829] dark:bg-[#070D1F] rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-lime-400 dark:text-gold-400" />
              </div>
            </div>

            <div className="flex flex-col text-left font-sans leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-lg font-black tracking-tight text-white font-sans">
                  DZ PRIME
                </span>
                <span className="w-2 h-2 rounded-full bg-lime-400 dark:bg-gold-400 animate-pulse" />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                ACADEMY
              </span>
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          {onMobileClose && (
            <button
              onClick={onMobileClose}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-gray-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ================= NAVIGATION LINKS ================= */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isActive;

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onMobileClose}
                className={`group relative flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-[13px] font-bold transition-all duration-200 ${
                  active
                    ? 'bg-[#D9F99D] text-slate-950 shadow-md font-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0 transition-transform group-hover:scale-110 ${
                      active ? 'text-slate-950' : 'text-gray-400 group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${
                      item.badgeColor || (active ? 'bg-black/15 text-slate-950' : 'bg-lime-400/20 text-lime-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ================= BOTTOM SECTION: DIGITAL MEMBERSHIP CARD ================= */}
      <div className="pt-4 mt-auto">
        <SidebarCardWidget />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:flex flex-col w-[270px] xl:w-[290px] h-screen sticky top-0 shrink-0 bg-[#0E1526] dark:bg-[#070C1B] border-r ${
          isRtl ? 'border-l border-r-0' : 'border-r'
        } border-slate-800/80 z-30 shadow-xl`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide Drawer */}
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className={`relative w-[300px] max-w-[85vw] h-full bg-[#0E1526] text-white shadow-2xl z-10 flex flex-col ${
                isRtl ? 'mr-auto' : 'ml-auto'
              }`}
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
