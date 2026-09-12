'use client';

import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Users,
  GraduationCap,
  Video,
  Award,
  Layers,
  ShieldCheck,
  Package,
  CreditCard,
  Sliders,
  Bell,
  ClipboardCheck,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { FinancialOverviewTab } from '@/components/admin/FinancialOverviewTab';
import { FacultyPayrollTab } from '@/components/admin/FacultyPayrollTab';
import { StudentsTab } from '@/components/admin/StudentsTab';
import { SessionsTab } from '@/components/admin/SessionsTab';
import { AmbassadorsTab } from '@/components/admin/AmbassadorsTab';
import { CoursesTab } from '@/components/admin/CoursesTab';
import { BundlesTab } from '@/components/admin/BundlesTab';
import { AdminCardTab } from '@/components/admin/AdminCardTab';
import { AdminSettingsTab } from '@/components/admin/AdminSettingsTab';
import { StaffTab } from '@/components/admin/StaffTab';
import { AdminOperationsTab } from '@/components/admin/AdminOperationsTab';
import { LandingManagementTab } from '@/components/admin/LandingManagementTab';

type AdminTab =
  | 'operations'
  | 'financial'
  | 'staff'
  | 'teachers'
  | 'students'
  | 'sessions'
  | 'ambassadors'
  | 'courses'
  | 'bundles'
  | 'card'
  | 'landing'
  | 'settings';

export default function AdminCommandCenterPage() {
  const { locale } = useTranslation();
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('financial');
  const [payrollLiability, setPayrollLiability] = useState(1791000);
  const [pendingOpsCount, setPendingOpsCount] = useState(0);

  // Poll for pending operations count every 15s
  useEffect(() => {
    const fetchCount = () => {
      fetch('/api/operations/count')
        .then((r) => r.json())
        .then((data) => {
          if (data && typeof data.count === 'number') {
            setPendingOpsCount(data.count);
          }
        })
        .catch(() => {});
    };
    fetchCount();
    const timer = setInterval(fetchCount, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '') as AdminTab;
      if (
        [
          'operations',
          'financial',
          'staff',
          'teachers',
          'students',
          'sessions',
          'ambassadors',
          'courses',
          'bundles',
          'card',
          'landing',
          'settings',
        ].includes(hash)
      ) {
        setActiveTab(hash);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const tabs: { id: AdminTab; icon: any; labelAr: string; labelFr: string; badge?: string }[] = [
    {
      id: 'operations',
      icon: ClipboardCheck,
      labelAr: 'طلبات التفعيل والمدفوعات',
      labelFr: 'Opérations & Paiements',
      badge: pendingOpsCount > 0 ? String(pendingOpsCount) : undefined,
    },
    { id: 'financial', icon: Landmark, labelAr: 'المركز المالي', labelFr: 'Centre Financier' },
    { id: 'staff', icon: Users, labelAr: 'فريق الإدارة والتوظيف (HR)', labelFr: 'Personnel & RH' },
    { id: 'teachers', icon: GraduationCap, labelAr: 'الأساتذة والمستحقات', labelFr: 'Enseignants & Paie' },
    { id: 'students', icon: Users, labelAr: 'الطلبة والبطاقات', labelFr: 'Étudiants & Cartes' },
    { id: 'sessions', icon: Video, labelAr: 'الحصص الوطنية المباشرة', labelFr: 'Sessions Live Nationales' },
    { id: 'ambassadors', icon: Award, labelAr: 'شبكة 58 ولاية', labelFr: 'Réseau Ambassadeurs' },
    { id: 'courses', icon: Layers, labelAr: 'الدورات والمقررات (Dawarat)', labelFr: 'Dawarat & Modules' },
    { id: 'bundles', icon: Package, labelAr: 'العروض والتخفيضات (Offers & Promos)', labelFr: 'Offres & Promos' },
    { id: 'card', icon: CreditCard, labelAr: 'بطاقة الإدارة', labelFr: 'Carte Administration' },
    { id: 'landing', icon: Globe, labelAr: 'إدارة الواجهة الرئيسية (Landing Page)', labelFr: 'Gestion Landing Page' },
    { id: 'settings', icon: Sliders, labelAr: 'إعدادات النظام', labelFr: 'Paramètres Système' },
  ];

  const handleTabClick = (id: AdminTab) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  const getAdminRoleBadge = () => {
    if (currentUser?.adminRole === 'COMMERCIAL') {
      return {
        label: 'CHARGÉE COMMERCIALE (Level 80)',
        color: 'bg-amber-500/20 border-amber-400/50 text-amber-300',
      };
    }
    if (currentUser?.adminRole === 'HR_MANAGER') {
      return {
        label: 'HR MANAGER (Level 85)',
        color: 'bg-purple-500/20 border-purple-400/50 text-purple-300',
      };
    }
    if (currentUser?.adminRole === 'FINANCE') {
      return {
        label: 'FINANCE DIRECTOR (Level 65)',
        color: 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300',
      };
    }
    if (currentUser?.role === 'OWNER') {
      return {
        label: 'SUPER ADMIN (Level 100)',
        color: 'bg-gold-500/20 border-gold-400/50 text-gold-300',
      };
    }
    return {
      label: 'ADMINISTRATION HQ',
      color: 'bg-blue-500/20 border-blue-400/50 text-blue-300',
    };
  };

  const adminBadge = getAdminRoleBadge();

  return (
    <div className="min-h-screen bg-[#05070D] text-white font-arabic" data-testid="admin-command-center">
      <div className="px-3 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-[1600px] mx-auto space-y-6 sm:space-y-7">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-gold-400" />
                <span>{locale === 'ar' ? 'مركز القيادة المالية والإدارية' : 'Centre de Commandement Admin'}</span>
              </h1>
              <span className={`px-3 py-0.5 rounded-full border text-xs font-mono font-bold ${adminBadge.color}`}>
                {adminBadge.label}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">
              {locale === 'ar'
                ? `مرحباً ${currentUser?.name || 'المسؤول'} — منصة DZ Prime Academy 2026 للإدارة الأكاديمية والمالية الشاملة`
                : `Bienvenue ${currentUser?.name || 'Admin'} — DZ Prime Academy 2026`}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Notification Bell Button */}
            <button
              onClick={() => handleTabClick('operations')}
              data-testid="admin-notif-bell-btn"
              className="relative p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-center"
              title={locale === 'ar' ? 'طلبات التفعيل والمدفوعات الجديدة' : 'Nouvelles opérations & paiements'}
            >
              <Bell className="w-4 h-4" />
              {pendingOpsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-gradient-to-r from-amber-400 to-rose-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-lg shadow-rose-500/30 animate-pulse font-mono">
                  {pendingOpsCount}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-gray-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{locale === 'ar' ? 'نظام البث والمدفوعات: متصل' : 'Système Live: Online'}</span>
            </div>
          </div>
        </div>

        {/* Global Horizontal Executive Nav Bar */}
        <div
          data-testid="admin-segmented-nav"
          className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#090E1E] border border-white/10 overflow-x-auto no-scrollbar shadow-xl w-full"
        >
          {tabs.map((tItem) => {
            const Icon = tItem.icon;
            const active = activeTab === tItem.id;
            return (
              <button
                key={tItem.id}
                data-testid={`admin-tab-${tItem.id}`}
                onClick={() => handleTabClick(tItem.id)}
                className={`relative px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 whitespace-nowrap transition-all shrink-0 ${
                  active
                    ? 'text-navy-950 shadow-md font-black'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="admin-active-pill"
                    className="absolute inset-0 bg-gradient-to-r from-gold-400 via-amber-400 to-yellow-400 rounded-xl -z-10 shadow-lg shadow-gold-500/20"
                    transition={{ type: 'spring', duration: 0.45 }}
                  />
                )}
                <Icon className={`w-4 h-4 ${active ? 'text-navy-950' : 'text-gray-400'}`} />
                <span>{locale === 'ar' ? tItem.labelAr : tItem.labelFr}</span>
                {tItem.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono ${
                      active
                        ? 'bg-navy-950 text-gold-400'
                        : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {tItem.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Tab Body */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === 'operations' && <AdminOperationsTab locale={locale} />}
            {activeTab === 'financial' && <FinancialOverviewTab locale={locale} payrollLiability={payrollLiability} />}
            {activeTab === 'staff' && <StaffTab locale={locale} />}
            {activeTab === 'teachers' && <FacultyPayrollTab locale={locale} onLiabilityChange={setPayrollLiability} />}
            {activeTab === 'students' && <StudentsTab locale={locale} />}
            {activeTab === 'sessions' && <SessionsTab locale={locale} />}
            {activeTab === 'ambassadors' && <AmbassadorsTab locale={locale} />}
            {activeTab === 'courses' && <CoursesTab locale={locale} />}
            {activeTab === 'bundles' && <BundlesTab locale={locale} />}
            {activeTab === 'card' && <AdminCardTab locale={locale} />}
            {activeTab === 'landing' && <LandingManagementTab locale={locale} />}
            {activeTab === 'settings' && <AdminSettingsTab locale={locale} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
