'use client';

import React, { useState } from 'react';
import {
  Users,
  Award,
  BookOpen,
  DollarSign,
  ShieldCheck,
  Search,
  CheckCircle,
  Building,
  Lock,
  Sparkles,
} from 'lucide-react';
import { MetricsGrid, MetricCardItem } from '@/components/dashboard/MetricsGrid';
import { HierarchyChart } from '@/components/dashboard/HierarchyChart';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isStaff } from '@/lib/rbac';
import { DEMO_USERS, WILAYAS } from '@/lib/initial-data';
import { Role, User } from '@/types';
import { AuthModal } from '@/components/auth/AuthModal';

export default function AdminDashboardPage() {
  const { t, locale } = useTranslation();
  const { currentUser, switchRole } = useAuthStore();
  const [usersList, setUsersList] = useState<User[]>(DEMO_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const isUserStaff = isStaff(currentUser?.role);

  const adminMetrics: MetricCardItem[] = [
    {
      title: t('dashboards.admin.totalUsers'),
      value: '52,430',
      change: '+14.2%',
      isPositive: true,
      icon: Users,
      description: locale === 'ar' ? 'طلبة وأساتذة وسفراء' : locale === 'fr' ? 'Étudiants & Professeurs' : 'Students & Faculty',
    },
    {
      title: t('dashboards.admin.activeAmbassadors'),
      value: '264',
      change: '+8.5%',
      isPositive: true,
      icon: Award,
      description: locale === 'ar' ? 'موزعون على 58 ولاية' : locale === 'fr' ? 'Répartis sur 58 wilayas' : 'Across 58 wilayas',
    },
    {
      title: t('dashboards.admin.totalExams'),
      value: '12,850',
      change: '+22.4%',
      isPositive: true,
      icon: BookOpen,
      description: locale === 'ar' ? 'موضوع مع الحل النموذجي' : locale === 'fr' ? 'Annales & Corrigés-types' : 'Papers with solutions',
    },
    {
      title: t('dashboards.admin.monthlyRevenue'),
      value: '4,850,000 DZD',
      change: '+31.0%',
      isPositive: true,
      icon: DollarSign,
      description: locale === 'ar' ? 'اشتراكات العضوية الذهبية' : locale === 'fr' ? 'Adhésions Gold VIP' : 'Golden Memberships',
    },
  ];

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleToggleVerify = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isVerified: !u.isVerified } : u))
    );
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.studentCardId && u.studentCardId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Notice if not signed in as Staff/Admin */}
      {!isUserStaff && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-gold-500/20 to-transparent border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left font-arabic">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-purple-200">
                {locale === 'ar' ? 'معاينة لوحة الإدارة التجريبية' : 'Aperçu du Panneau d\'Administration SaaS'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-gray-300">
                {locale === 'ar'
                  ? 'يمكنك التبديل إلى دور المدير (Admin) أو المؤسس (Owner) بنقرة واحدة لتجربة لوحة التحكم.'
                  : 'Passez au profil Administrateur ou Fondateur pour tester les fonctionnalités de gestion.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => switchRole('OWNER')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-1.5 shrink-0 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{locale === 'ar' ? 'الدخول كمدير المنصة (Admin)' : 'Démonstration Admin'}</span>
          </button>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-gold-500/25 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-700 dark:text-gold-400">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black font-arabic text-slate-900 dark:text-white">
              {t('dashboards.admin.title')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 font-arabic mt-1">
            {t('dashboards.admin.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-500/10 dark:bg-gold-500/15 border border-gold-500/30 text-gold-800 dark:text-gold-300 font-arabic text-xs font-bold shadow-sm">
          <span>{t('dashboards.admin.badge')}</span>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <MetricsGrid metrics={adminMetrics} />

      {/* User & Role Management Table */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            <h2 className="text-base sm:text-lg font-bold font-arabic text-slate-900 dark:text-white">
              {t('dashboards.admin.usersTableTitle')}
            </h2>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('dashboards.admin.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 font-arabic"
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-xs text-slate-800 dark:text-gold-300 font-arabic focus:outline-none"
            >
              <option value="ALL">{t('dashboards.admin.allRoles')}</option>
              <option value="OWNER">{t('roles.OWNER')}</option>
              <option value="ADMIN">{t('roles.ADMIN')}</option>
              <option value="AMBASSADOR">{t('roles.AMBASSADOR')}</option>
              <option value="TEACHER">{t('roles.TEACHER')}</option>
              <option value="STUDENT_PAID">{t('roles.STUDENT_PAID')}</option>
              <option value="STUDENT_FREE">{t('roles.STUDENT_FREE')}</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-arabic text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gold-300 text-[11px] uppercase">
                <th className="pb-3 px-3">{t('dashboards.admin.colName')}</th>
                <th className="pb-3 px-3">{t('dashboards.admin.colEmail')}</th>
                <th className="pb-3 px-3">{t('dashboards.admin.colRole')}</th>
                <th className="pb-3 px-3">{t('dashboards.admin.colWilaya')}</th>
                <th className="pb-3 px-3">{t('dashboards.admin.colStatus')}</th>
                <th className="pb-3 px-3 text-center">{t('dashboards.admin.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-gray-800/60 text-slate-700 dark:text-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-700 dark:text-gold-400 flex items-center justify-center shrink-0 font-sans font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div>{user.name}</div>
                      <div className="text-[10px] text-slate-400 dark:text-gray-400 font-mono">{user.studentCardId}</div>
                    </div>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-gray-300 text-[11px]">
                    {user.email}
                  </td>

                  <td className="py-3 px-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-gold-300 text-[11px] font-bold font-arabic focus:outline-none"
                    >
                      <option value="OWNER">{t('roles.OWNER')}</option>
                      <option value="ADMIN">{t('roles.ADMIN')}</option>
                      <option value="MODERATOR">{t('roles.MODERATOR')}</option>
                      <option value="AMBASSADOR">{t('roles.AMBASSADOR')}</option>
                      <option value="TEACHER">{t('roles.TEACHER')}</option>
                      <option value="STUDENT_PAID">{t('roles.STUDENT_PAID')}</option>
                      <option value="STUDENT_FREE">{t('roles.STUDENT_FREE')}</option>
                    </select>
                  </td>

                  <td className="py-3 px-3 text-slate-600 dark:text-gray-300">
                    Wilaya {user.wilayaCode || 16} ({user.wilayaName || 'Alger'})
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggleVerify(user.id)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                        user.isVerified
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-400/40'
                      }`}
                    >
                      {user.isVerified ? t('dashboards.admin.verified') : t('dashboards.admin.unverified')}
                    </button>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => handleToggleVerify(user.id)}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-gray-200 text-[11px] transition-all"
                    >
                      {t('dashboards.admin.toggleVerify')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Hierarchy Chart */}
      <div>
        <HierarchyChart />
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
