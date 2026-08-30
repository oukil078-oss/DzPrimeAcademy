'use client';

import React, { useState, useEffect } from 'react';
import { Landmark, Users, GraduationCap, Video, Award, Layers, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { FinancialOverviewTab } from '@/components/admin/FinancialOverviewTab';
import { FacultyPayrollTab } from '@/components/admin/FacultyPayrollTab';
import { StudentsTab } from '@/components/admin/StudentsTab';
import { SessionsTab } from '@/components/admin/SessionsTab';
import { AmbassadorsTab } from '@/components/admin/AmbassadorsTab';
import { CoursesTab } from '@/components/admin/CoursesTab';

type AdminTab = 'financial' | 'teachers' | 'students' | 'sessions' | 'ambassadors' | 'courses';

export default function AdminCommandCenterPage() {
  const { locale } = useTranslation();
  const { currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<AdminTab>('financial');
  const [payrollLiability, setPayrollLiability] = useState(1791000);

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.replace('#', '') as AdminTab;
      if (['financial', 'teachers', 'students', 'sessions', 'ambassadors', 'courses'].includes(hash)) {
        setActiveTab(hash);
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const tabs: { id: AdminTab; icon: any; labelAr: string; labelFr: string }[] = [
    { id: 'financial', icon: Landmark, labelAr: 'المركز المالي', labelFr: 'Financial Overview' },
    { id: 'teachers', icon: Users, labelAr: 'الأساتذة والمستحقات', labelFr: 'Faculty Payroll' },
    { id: 'students', icon: GraduationCap, labelAr: 'الطلبة والبطاقات', labelFr: 'Students' },
    { id: 'sessions', icon: Video, labelAr: 'الحصص الوطنية', labelFr: 'Sessions' },
    { id: 'ambassadors', icon: Award, labelAr: 'شبكة 58 ولاية', labelFr: 'Ambassadors' },
    { id: 'courses', icon: Layers, labelAr: 'المقررات', labelFr: 'Courses' },
  ];

  const handleTabClick = (id: AdminTab) => {
    setActiveTab(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-white font-arabic" data-testid="admin-command-center">
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-[1500px] mx-auto space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-lime-400" />
              <span>{locale === 'ar' ? 'مركز القيادة المالية والإدارية' : 'Financial & Admin Command Center'}</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {locale === 'ar' ? `مرحباً ${currentUser?.name || ''} — لوحة تحكم DZ Prime Academy 2026` : `Welcome ${currentUser?.name || ''} — DZ Prime Academy 2026`}
            </p>
          </div>
        </div>

        <div
          data-testid="admin-segmented-nav"
          className="flex items-center gap-1 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 overflow-x-auto no-scrollbar w-full sm:w-fit"
        >
          {tabs.map((tItem) => {
            const Icon = tItem.icon;
            const active = activeTab === tItem.id;
            return (
              <button
                key={tItem.id}
                data-testid={`admin-tab-${tItem.id}`}
                onClick={() => handleTabClick(tItem.id)}
                className={`relative px-3.5 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors shrink-0 ${
                  active ? 'text-slate-950' : 'text-gray-400 hover:text-white'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="admin-active-pill"
                    className="absolute inset-0 bg-lime-400 rounded-xl -z-10"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{locale === 'ar' ? tItem.labelAr : tItem.labelFr}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'financial' && <FinancialOverviewTab locale={locale} payrollLiability={payrollLiability} />}
            {activeTab === 'teachers' && <FacultyPayrollTab locale={locale} onLiabilityChange={setPayrollLiability} />}
            {activeTab === 'students' && <StudentsTab locale={locale} />}
            {activeTab === 'sessions' && <SessionsTab locale={locale} />}
            {activeTab === 'ambassadors' && <AmbassadorsTab locale={locale} />}
            {activeTab === 'courses' && <CoursesTab locale={locale} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
