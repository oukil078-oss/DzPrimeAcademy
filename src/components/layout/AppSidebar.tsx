'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  Video,
  GraduationCap,
  Bot,
  Bell,
  Calendar,
  Users,
  Settings,
  CreditCard,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Award,
  CheckCircle2,
  BookOpen,
  FolderKanban,
  QrCode,
  LogOut,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Bookmark,
  FileEdit,
  Headphones,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { Role } from '@/types';

interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onOpenAuth?: () => void;
  onOpenRoleSwitcher?: () => void;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isCollapsed = false,
  onToggleCollapse,
  onOpenAuth,
  onOpenRoleSwitcher,
  onCloseMobile,
}) => {
  const { t, locale, isRtl } = useTranslation();
  const pathname = usePathname();
  const { currentUser, logout } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const ArrowIcon = isRtl ? ChevronLeft : ChevronRight;

  const navItems = [
    {
      id: 'dashboard',
      href: `/${locale}`,
      label: locale === 'ar' ? 'لوحة القيادة' : locale === 'fr' ? 'Tableau de bord' : 'Dashboard',
      icon: LayoutGrid,
      exact: true,
    },
    {
      id: 'dawarat',
      href: `/${locale}/dawarat`,
      label: locale === 'ar' ? 'دورات الامتياز (Live)' : locale === 'fr' ? 'Dawarat Live' : 'Live Courses',
      icon: Video,
      isLive: true,
    },
    {
      id: 'my-classes',
      href:
        currentUser?.role === 'TEACHER'
          ? `/${locale}/teacher`
          : currentUser?.role === 'AGENT_TECHNIQUE'
          ? `/${locale}/coordinator`
          : currentUser?.role === 'AMBASSADOR'
          ? `/${locale}/ambassador`
          : currentUser?.role === 'OWNER' || currentUser?.role === 'ADMIN'
          ? `/${locale}/admin`
          : `/${locale}/student`,
      label: locale === 'ar' ? 'حصصي ومقاييسي' : locale === 'fr' ? 'Mes Cours' : 'My Classes',
      icon: GraduationCap,
    },
    {
      id: 'bot',
      href: `/${locale}/bot`,
      label: locale === 'ar' ? 'بوت الامتحانات الذكي' : locale === 'fr' ? 'Bot d\'Examens' : 'Exam AI Bot',
      icon: Bot,
    },
    {
      id: 'notifications',
      href: `/${locale}/student`,
      label: locale === 'ar' ? 'التنبيهات' : locale === 'fr' ? 'Notifications' : 'Notifications',
      icon: Bell,
      badge: 2,
    },
    {
      id: 'calendars',
      href: `/${locale}/student#timetable`,
      label: locale === 'ar' ? 'جدول المراجعة' : locale === 'fr' ? 'Emploi du temps' : 'Schedule',
      icon: Calendar,
    },
    {
      id: 'community',
      href: `/${locale}/ambassadors`,
      label: locale === 'ar' ? 'شبكة 58 ولاية' : locale === 'fr' ? 'Réseau 58 Wilayas' : '58 Wilayas',
      icon: Users,
    },
    {
      id: 'settings',
      href: '#settings',
      label: locale === 'ar' ? 'الإعدادات والرتب' : locale === 'fr' ? 'Paramètres & Rôles' : 'Settings & Roles',
      icon: Settings,
      onClick: onOpenRoleSwitcher,
    },
  ];

  return (
    <aside
      suppressHydrationWarning
      className={`h-full flex flex-col justify-between bg-white dark:bg-[#0D1424] border-r rtl:border-r-0 rtl:border-l border-slate-200/80 dark:border-navy-800/80 font-arabic select-none transition-all duration-300 ${
        isCollapsed ? 'w-20 p-3 items-center' : 'w-64 p-5'
      }`}
    >
      {/* Top Section: Logo & Navigation */}
      <div className="space-y-6 w-full">
        {/* Brand Logo DZ PRIME ACADEMY */}
        <Link
          href={`/${locale}`}
          onClick={onCloseMobile}
          className={`flex items-center gap-3 px-1 pt-1 group cursor-pointer ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="DZ PRIME ACADEMY"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gold-500 via-amber-400 to-gold-600 flex items-center justify-center text-navy-950 font-black shadow-gold-glow group-hover:scale-105 transition-transform shrink-0">
            <span className="text-lg">🇩🇿</span>
          </div>

          {!isCollapsed && (
            <div className="flex flex-col text-left rtl:text-right overflow-hidden">
              <span className="text-sm font-black tracking-tight text-slate-900 dark:text-white font-sans flex items-center gap-1">
                <span>DZ PRIME</span>
                <span className="text-gold-500 font-mono text-xs">ACADEMY</span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-gray-400 tracking-wider line-clamp-1">
                {locale === 'ar' ? 'منصة الامتياز الجزائرية' : 'Algerian Excellence SaaS'}
              </span>
            </div>
          )}
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-2 pt-2 w-full">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== '#settings';

            const Icon = item.icon;

            if (item.onClick) {
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    item.onClick?.();
                    onCloseMobile?.();
                  }}
                  title={item.label}
                  className={`w-full flex items-center rounded-2xl text-xs font-bold text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-850 transition-all cursor-pointer ${
                    isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-400 group-hover:text-gold-500 shrink-0" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onCloseMobile}
                title={item.label}
                className={`relative flex items-center rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  isCollapsed ? 'justify-center p-3' : 'justify-between px-3.5 py-2.5'
                } ${
                  isActive
                    ? 'bg-[#FDE047] text-[#1E1B2E] font-black shadow-sm dark:bg-[#FDE047] dark:text-[#1E1B2E]'
                    : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-navy-850/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-colors shrink-0 ${
                      isActive
                        ? 'text-[#1E1B2E] dark:text-[#1E1B2E]'
                        : 'text-slate-400 dark:text-gray-400'
                    }`}
                  />
                  {!isCollapsed && <span>{item.label}</span>}
                </div>

                {/* Right Badge / Live Indicator / Pill Count */}
                {!isCollapsed && item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-[#1E1B2E] text-[#FDE047]'
                        : 'bg-amber-500 text-white dark:bg-amber-400 dark:text-navy-950'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.isLive && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: User Card & Collapse Toggle Button */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-navy-800/80 w-full space-y-3">
        {isMounted && currentUser ? (
          /* Signed In User Card */
          isCollapsed ? (
            <Link
              href={`/${locale}/card`}
              onClick={onCloseMobile}
              className="w-10 h-10 mx-auto rounded-2xl bg-gradient-to-tr from-[#FDE047] to-amber-400 text-navy-950 flex items-center justify-center font-black text-sm shadow-md hover:scale-105 transition-transform"
              title={currentUser.name}
            >
              {currentUser.name.charAt(0)}
            </Link>
          ) : (
            <div className="p-3.5 rounded-3xl bg-gradient-to-br from-[#FEF08A] via-[#FDE047] to-[#EAB308] text-navy-950 shadow-md relative overflow-hidden group">
              <Link
                href={`/${locale}/card`}
                onClick={onCloseMobile}
                className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-7 h-7 rounded-full bg-navy-950 text-[#FDE047] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform"
                title={locale === 'ar' ? 'عرض البطاقة الرقمية' : 'Voir la carte'}
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-navy-950 text-gold-400 flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="space-y-0.5 max-w-[110px] text-left rtl:text-right">
                  <h4 className="text-xs font-black text-navy-950 line-clamp-1">
                    {currentUser.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-navy-900/80">
                    <ShieldCheck className="w-3 h-3 text-navy-950" />
                    <span className="line-clamp-1">{currentUser.wilayaName || 'Alger'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-navy-950/15 flex items-center justify-between text-[11px] font-mono font-bold">
                <span className="text-navy-900/90 text-[10px]">
                  {currentUser.role === 'STUDENT_PAID' ? '👑 GOLD VIP' : currentUser.role}
                </span>
                <span className="text-navy-950 text-[10px]">
                  {currentUser.studentCardId || 'DZ-2026'}
                </span>
              </div>

              <button
                onClick={logout}
                className="mt-2.5 w-full py-1.5 rounded-xl bg-navy-950/10 hover:bg-navy-950/20 text-navy-950 text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>{locale === 'ar' ? 'تبديل الحساب' : 'Switch Role'}</span>
              </button>
            </div>
          )
        ) : (
          /* Visitor Sign In CTA */
          !isCollapsed && (
            <div className="p-4 rounded-3xl bg-gradient-to-br from-navy-950 to-[#0F172A] border border-gold-500/30 text-white shadow-xl relative overflow-hidden group">
              <div className="space-y-1 text-left rtl:text-right">
                <div className="flex items-center gap-1.5 text-gold-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    DZ PRIME 2026
                  </span>
                </div>
                <h4 className="text-xs font-black text-white leading-tight">
                  {locale === 'ar' ? 'انضم لنخبة المتفوقين' : 'Join Elite Students'}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => {
                  onOpenAuth?.();
                  onCloseMobile?.();
                }}
                className="mt-3 w-full py-2 rounded-2xl bg-gradient-to-r from-gold-500 via-amber-400 to-gold-600 text-navy-950 font-black text-[11px] shadow-gold-glow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-navy-950" />
                <span>{locale === 'ar' ? 'دخول / اختيار دور' : 'Sign In'}</span>
              </button>
            </div>
          )
        )}

        {/* Collapsible Toggle Button (Hidden on Mobile) */}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden lg:flex w-full items-center justify-center p-2.5 rounded-2xl bg-slate-100 dark:bg-navy-850 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-navy-800 transition-all cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-bold">
                <PanelLeftClose className="w-4 h-4" />
                <span>{locale === 'ar' ? 'طي القائمة' : 'Collapse'}</span>
              </div>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};
