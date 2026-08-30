'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Landmark,
  Users,
  ShieldCheck,
  CreditCard,
  Settings,
  Award,
  GraduationCap,
  X,
  BookOpen,
  Video,
  ClipboardList,
  FolderOpen,
  Bot,
  Sparkles,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { SidebarCardWidget } from '@/components/card/SidebarCardWidget';
import { SettingsModal } from '@/components/settings/SettingsModal';

interface AppSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon: React.ElementType;
  isActive: boolean;
  badge?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ isMobileOpen = false, onMobileClose }) => {
  const { locale, isRtl } = useTranslation();
  const pathname = usePathname();
  const { currentUser } = useAuthStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  const role = currentUser?.role;
  const isAdminRole = role === 'OWNER' || role === 'ADMIN' || role === 'MODERATOR';
  const isTeacherRole = role === 'TEACHER';
  const isAmbassadorRole = role === 'AMBASSADOR';

  const isOn = (seg: string) => pathname.includes(`/${seg}`);

  const adminItems: NavItem[] = [
    { id: 'financial', label: locale === 'ar' ? 'المركز المالي والإداري' : 'Centre Financier', href: `/${locale}/admin#financial`, icon: Landmark, isActive: isOn('admin') },
    { id: 'teachers', label: locale === 'ar' ? 'الأساتذة والمستحقات' : 'Enseignants & Paie', href: `/${locale}/admin#teachers`, icon: Users, isActive: false },
    { id: 'students', label: locale === 'ar' ? 'الطلبة وتفعيل البطاقات' : 'Étudiants & Cartes', href: `/${locale}/admin#students`, icon: GraduationCap, isActive: false },
    { id: 'sessions', label: locale === 'ar' ? 'الحصص والمحاضرات الوطنية' : 'Sessions Nationales', href: `/${locale}/admin#sessions`, icon: Video, isActive: false },
    { id: 'ambassadors', label: locale === 'ar' ? 'شبكة السفراء (58 ولاية)' : 'Réseau Ambassadeurs', href: `/${locale}/admin#ambassadors`, icon: Award, isActive: false },
    { id: 'courses', label: locale === 'ar' ? 'دليل المقاييس والحزم' : 'Modules & Packs', href: `/${locale}/admin#courses`, icon: Layers, isActive: false },
    { id: 'card', label: locale === 'ar' ? 'بطاقة الإدارة الرقمية' : 'Carte Administration', href: `/${locale}/card`, icon: CreditCard, isActive: isOn('card') },
  ];

  const teacherItems: NavItem[] = [
    { id: 'studio', label: locale === 'ar' ? 'استوديو التدريس' : 'Studio Enseignant', href: `/${locale}/teacher`, icon: Sparkles, isActive: isOn('teacher') && !pathname.includes('#') },
    { id: 'courses', label: locale === 'ar' ? 'مقرراتي ومقاييسي' : 'Mes Modules', href: `/${locale}/teacher#courses`, icon: BookOpen, isActive: false },
    { id: 'sessions', label: locale === 'ar' ? 'الحصص المباشرة والجدول' : 'Sessions en Direct', href: `/${locale}/teacher#sessions`, icon: Video, isActive: false },
    { id: 'roster', label: locale === 'ar' ? 'قائمة الطلبة والحضور' : 'Liste & Présence', href: `/${locale}/teacher#roster`, icon: ClipboardList, isActive: false },
    { id: 'drive', label: locale === 'ar' ? 'المطبوعات والسلاسل' : 'Supports & Séries', href: `/${locale}/teacher#drive`, icon: FolderOpen, isActive: false },
    { id: 'card', label: locale === 'ar' ? 'بطاقة التدريس الرقمية' : 'Carte Enseignant', href: `/${locale}/card`, icon: CreditCard, isActive: isOn('card') },
  ];

  const studentItems: NavItem[] = [
    { id: 'dashboard', label: locale === 'ar' ? 'لوحة دراستي' : 'Mon Tableau de Bord', href: `/${locale}/student`, icon: GraduationCap, isActive: isOn('student') },
    { id: 'dawarat', label: locale === 'ar' ? 'دورات الامتياز (Live)' : 'Dawarat Excellence (Live)', href: `/${locale}/dawarat`, icon: Video, isActive: isOn('dawarat'), badge: 'Live' },
    { id: 'exams', label: locale === 'ar' ? 'بنك الامتحانات السريع' : "Banque d'Examens", href: `/${locale}/exams`, icon: Zap, isActive: isOn('exams') },
    { id: 'bot', label: locale === 'ar' ? 'بوت الامتحانات الذكي' : 'Bot Examens IA', href: `/${locale}/bot`, icon: Bot, isActive: isOn('bot') },
    { id: 'card', label: locale === 'ar' ? 'بطاقتي الجامعية الرقمية' : 'Ma Carte Digitale', href: `/${locale}/card`, icon: CreditCard, isActive: isOn('card') },
    { id: 'ambassadors', label: locale === 'ar' ? 'سفراء 58 ولاية' : 'Ambassadeurs (58 wilayas)', href: `/${locale}/ambassadors`, icon: Award, isActive: isOn('ambassadors') },
  ];

  const ambassadorItems: NavItem[] = [
    { id: 'dashboard', label: locale === 'ar' ? 'لوحة تحكم السفير' : 'Espace Ambassadeur', href: `/${locale}/ambassador`, icon: Award, isActive: isOn('ambassador') && !isOn('ambassadors') },
    { id: 'network', label: locale === 'ar' ? 'شبكة السفراء (58 ولاية)' : 'Réseau (58 wilayas)', href: `/${locale}/ambassadors`, icon: Users, isActive: isOn('ambassadors') },
    { id: 'card', label: locale === 'ar' ? 'بطاقتي الرقمية' : 'Ma Carte Digitale', href: `/${locale}/card`, icon: CreditCard, isActive: isOn('card') },
  ];

  let navItems = studentItems;
  if (isAdminRole) navItems = adminItems;
  else if (isTeacherRole) navItems = teacherItems;
  else if (isAmbassadorRole) navItems = ambassadorItems;
  else if (!role) navItems = [];

  const settingsLabel = locale === 'ar' ? 'إعدادات الحساب' : 'Paramètres';

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5 select-none font-arabic" data-testid="app-sidebar-content">
      <div>
        <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 px-2 pt-1">
          <Link href={`/${locale}`} onClick={onMobileClose} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-lime-400 via-emerald-400 to-teal-400 dark:from-lime-500 dark:via-lime-400 dark:to-emerald-300 p-0.5 shadow-md flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#121829] dark:bg-[#070D1F] rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-lime-400" />
              </div>
            </div>
            <div className="flex flex-col text-left font-sans leading-tight">
              <div className="flex items-center gap-1">
                <span className="text-base sm:text-lg font-black tracking-tight text-white font-sans">DZ PRIME</span>
                <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              </div>
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">ACADEMY 2026</span>
            </div>
          </Link>

          {onMobileClose && (
            <button
              onClick={onMobileClose}
              data-testid="sidebar-mobile-close-btn"
              className="lg:hidden p-2 rounded-xl bg-white/10 text-gray-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <nav className="space-y-1.5" data-testid="app-sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href || '#'}
                onClick={onMobileClose}
                data-testid={`sidebar-nav-${item.id}`}
                className={`group relative flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-[13px] font-bold transition-all duration-200 ${
                  item.isActive ? 'bg-lime-300 text-slate-950 shadow-md font-black' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${item.isActive ? 'text-slate-950' : 'text-gray-400 group-hover:text-white'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${item.isActive ? 'bg-black/15 text-slate-950' : 'bg-lime-400/20 text-lime-300'}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <button
            onClick={() => setSettingsOpen(true)}
            data-testid="sidebar-nav-settings"
            className="w-full group relative flex items-center justify-between px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-[13px] font-bold transition-all duration-200 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 shrink-0 text-gray-400 group-hover:text-white group-hover:rotate-45 transition-transform" />
              <span>{settingsLabel}</span>
            </div>
          </button>
        </nav>
      </div>

      <div className="pt-4 mt-auto">
        <SidebarCardWidget />
      </div>
    </div>
  );

  return (
    <>
      <aside
        data-testid="app-sidebar-desktop"
        className={`hidden lg:flex flex-col w-[270px] xl:w-[290px] h-screen sticky top-0 shrink-0 bg-[#0E1526] dark:bg-[#070C1B] border-r ${
          isRtl ? 'border-l border-r-0' : 'border-r'
        } border-slate-800/80 z-30 shadow-xl`}
      >
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex" data-testid="app-sidebar-mobile">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: isRtl ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className={`relative w-[300px] max-w-[85vw] h-full bg-[#0E1526] text-white shadow-2xl z-10 flex flex-col ${isRtl ? 'mr-auto' : 'ml-auto'}`}
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};
