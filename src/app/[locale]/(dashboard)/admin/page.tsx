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
  TrendingUp,
  CreditCard,
  Layers,
  ArrowUpRight,
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
      description: locale === 'ar' ? 'طلبة وأساتذة وسفراء' : 'Étudiants & Professeurs',
    },
    {
      title: locale === 'ar' ? 'مبيعات الدورات المباشرة' : 'Ventes Dawarat Live',
      value: '3,250,000 DZD',
      change: '+45.8%',
      isPositive: true,
      icon: Layers,
      description: locale === 'ar' ? '1,480 اشتراك بحزم البكالوريا والجامعة' : '1,480 inscriptions',
    },
    {
      title: t('dashboards.admin.monthlyRevenue'),
      value: '4,850,000 DZD',
      change: '+31.0%',
      isPositive: true,
      icon: DollarSign,
      description: locale === 'ar' ? 'إجمالي المداخيل (دورات + عضوية ذهبية)' : 'Revenu global SaaS',
    },
    {
      title: t('dashboards.admin.activeAmbassadors'),
      value: '264 Ambassadeurs',
      change: '58 Wilayas',
      isPositive: true,
      icon: Award,
      description: locale === 'ar' ? 'عمولات مستحقة: 485,000 DZD' : 'Commissions versées',
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-arabic">
      {/* Notice if not signed in as Staff/Admin */}
      {!isUserStaff && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-gold-500/20 to-transparent border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left rtl:text-right font-arabic">
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
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-1.5 shrink-0 active:scale-95 transition-all cursor-pointer"
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
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('dashboards.admin.title')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1">
            {t('dashboards.admin.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-500/10 dark:bg-gold-500/15 border border-gold-500/30 text-gold-800 dark:text-gold-300 text-xs font-bold shadow-sm">
          <span>{t('dashboards.admin.badge')}</span>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <MetricsGrid metrics={adminMetrics} />

      {/* Financial Revenue Breakdown Studio */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 border border-gold-500/30 text-white shadow-xl space-y-4 text-left rtl:text-right">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-gold-400">
              💰 {locale === 'ar' ? 'التدفقات المالية وتوزيع العائدات الوطنية' : 'Flux Financiers & Revenus'}
            </span>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
              {locale === 'ar' ? 'التقرير المالي الفوري للمنصة' : 'Synthèse Financière SaaS'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono">
              +31.0% vs M-1
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs text-gray-300">{locale === 'ar' ? 'مداخيل حزم الدورات المباشرة' : 'Packs Dawarat'}</span>
            <div className="text-xl font-black font-mono text-gold-400">3,250,000 DZD</div>
            <div className="text-[10px] text-gray-400">{locale === 'ar' ? '67% من إجمالي المبيعات' : '67% du volume'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs text-gray-300">{locale === 'ar' ? 'اشتراكات العضوية الذهبية VIP' : 'Abonnements Gold VIP'}</span>
            <div className="text-xl font-black font-mono text-emerald-400">1,600,000 DZD</div>
            <div className="text-[10px] text-gray-400">{locale === 'ar' ? '33% من إجمالي المبيعات' : '33% du volume'}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-xs text-gray-300">{locale === 'ar' ? 'عمولات السفراء المعتمدين' : 'Commissions Ambassadeurs'}</span>
            <div className="text-xl font-black font-mono text-purple-400">485,000 DZD</div>
            <div className="text-[10px] text-emerald-400">{locale === 'ar' ? '10% تدفع للسفراء النشطين' : '10% reversés'}</div>
          </div>
        </div>
      </div>

      {/* User & Role Management Table */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left rtl:text-right transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-600 dark:text-gold-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
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
              <option value="AGENT_TECHNIQUE">{t('roles.AGENT_TECHNIQUE')}</option>
              <option value="AMBASSADOR">{t('roles.AMBASSADOR')}</option>
              <option value="TEACHER">{t('roles.TEACHER')}</option>
              <option value="STUDENT_PAID">{t('roles.STUDENT_PAID')}</option>
              <option value="STUDENT_FREE">{t('roles.STUDENT_FREE')}</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left rtl:text-right font-arabic text-xs">
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
                      <option value="AGENT_TECHNIQUE">{t('roles.AGENT_TECHNIQUE')}</option>
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
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
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
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-gray-200 text-[11px] transition-all cursor-pointer"
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
