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
  Layers,
  MapPin,
  Star,
  Plus,
  Filter,
} from 'lucide-react';
import { MetricsGrid, MetricCardItem } from '@/components/dashboard/MetricsGrid';
import { HierarchyChart } from '@/components/dashboard/HierarchyChart';
import { AmbassadorDirectory } from '@/components/ambassadors/AmbassadorDirectory';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isStaff, canEditUserRoles } from '@/lib/rbac';
import { DEMO_USERS, WILAYAS, AMBASSADORS } from '@/lib/initial-data';
import { Role, User, AmbassadorProfile } from '@/types';
import { AuthModal } from '@/components/auth/AuthModal';

export default function AdminDashboardPage() {
  const { t, locale } = useTranslation();
  const { currentUser, switchRole } = useAuthStore();
  
  const [adminTab, setAdminTab] = useState<'users' | 'ambassadors' | 'hierarchy'>('users');
  const [usersList, setUsersList] = useState<User[]>(DEMO_USERS);
  const [ambassadorsList, setAmbassadorsList] = useState<AmbassadorProfile[]>(AMBASSADORS);
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
      title: t('dashboards.admin.activeAmbassadors'),
      value: `${ambassadorsList.length} Active`,
      change: '+8.5%',
      isPositive: true,
      icon: Award,
      description: locale === 'ar' ? 'موزعون على 58 ولاية' : 'Répartis sur 58 wilayas',
    },
    {
      title: t('dashboards.admin.totalExams'),
      value: '12,850',
      change: '+22.4%',
      isPositive: true,
      icon: BookOpen,
      description: locale === 'ar' ? 'موضوع مع الحل النموذجي' : 'Annales & Corrigés-types',
    },
    {
      title: t('dashboards.admin.monthlyRevenue'),
      value: '4,850,000 DZD',
      change: '+31.0%',
      isPositive: true,
      icon: DollarSign,
      description: locale === 'ar' ? 'اشتراكات العضوية الذهبية' : 'Adhésions Gold VIP',
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

  const handleToggleAmbassadorVerify = (ambId: string) => {
    setAmbassadorsList((prev) =>
      prev.map((a) => (a.id === ambId ? { ...a, isVerified: !a.isVerified } : a))
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
    <div className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-arabic">
      {/* Notice if not signed in as Staff/Admin */}
      {!isUserStaff && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-gold-500/20 to-transparent border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0 font-bold">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-purple-200">
                {locale === 'ar' ? 'معاينة لوحة الإدارة التجريبية' : 'Aperçu du Panneau d\'Administration'}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600 dark:text-gray-300">
                {locale === 'ar'
                  ? 'يمكنك التبديل إلى دور المدير (Admin) أو المؤسس (Owner) بنقرة واحدة لتجربة لوحة التحكم.'
                  : 'Passez au profil Administrateur pour tester la gestion des rôles et des ambassadeurs.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => switchRole('OWNER')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow flex items-center justify-center gap-1.5 shrink-0 active:scale-95 transition-all w-full sm:w-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>{locale === 'ar' ? 'الدخول كمدير المنصة (Admin)' : 'Démonstration Admin'}</span>
          </button>
        </div>
      )}

      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 dark:border-gold-500/25 pb-4 sm:pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 sm:p-2 rounded-xl bg-gold-500/15 border border-gold-500/30 text-gold-700 dark:text-gold-400">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('dashboards.admin.title')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-gray-300 mt-1">
            {t('dashboards.admin.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-2xl bg-amber-500/10 dark:bg-gold-500/15 border border-gold-500/30 text-gold-800 dark:text-gold-300 text-xs font-bold shadow-sm self-start sm:self-auto">
          <span>{t('dashboards.admin.badge')}</span>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <MetricsGrid metrics={adminMetrics} />

      {/* ================= ADMIN SECTION SELECTOR TABS ================= */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setAdminTab('users')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            adminTab === 'users'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{locale === 'ar' ? 'إدارة المستخدمين والأدوار' : 'Utilisateurs & Rôles'}</span>
        </button>

        <button
          onClick={() => setAdminTab('ambassadors')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            adminTab === 'ambassadors'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <Award className="w-4 h-4 text-gold-500" />
          <span>{locale === 'ar' ? 'شبكة السفراء والتفويضات' : 'Réseau Ambassadeurs'}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-gold-500/20 text-gold-600 dark:text-gold-300 text-[10px] font-mono font-bold">
            {ambassadorsList.length}
          </span>
        </button>

        <button
          onClick={() => setAdminTab('hierarchy')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            adminTab === 'hierarchy'
              ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-sm'
              : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-300'
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-500" />
          <span>{t('nav.hierarchy')}</span>
        </button>
      </div>

      {/* ================= TAB 1: USERS & ROLES TABLE ================= */}
      {adminTab === 'users' && (
        <div className="p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-gold-500/30 bg-white dark:bg-navy-900/90 shadow-md text-left transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gold-600 dark:text-gold-400" />
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">
                {t('dashboards.admin.usersTableTitle')}
              </h2>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('dashboards.admin.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-500 font-arabic"
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

          {/* Responsive Table with horizontal scroll support */}
          <div className="overflow-x-auto no-scrollbar touch-pan-x -mx-4 sm:mx-0 px-4 sm:px-0">
            <table className="w-full min-w-[640px] text-left font-arabic text-xs">
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
                      {canEditUserRoles(currentUser?.role) ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-gold-300 text-[11px] font-bold font-arabic focus:outline-none"
                        >
                          <option value="OWNER">{t('roles.OWNER')}</option>
                          <option value="ADMIN">{t('roles.ADMIN')}</option>
                          <option value="MODERATOR">{t('roles.MODERATOR')}</option>
                          <option value="AMBASSADOR">{t('roles.AMBASSADOR')}</option>
                          <option value="TEACHER">{t('roles.TEACHER')}</option>
                          <option value="STUDENT_PAID">{t('roles.STUDENT_PAID')}</option>
                          <option value="STUDENT_FREE">{t('roles.STUDENT_FREE')}</option>
                        </select>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-800 dark:text-gray-200 text-[11px] font-bold font-arabic inline-block border border-slate-200 dark:border-gray-700">
                          {t(`roles.${user.role}`)}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-gray-300">
                      Wilaya {user.wilayaCode || 16} ({user.wilayaName || 'Alger'})
                    </td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => canEditUserRoles(currentUser?.role) && handleToggleVerify(user.id)}
                        disabled={!canEditUserRoles(currentUser?.role)}
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
                      {canEditUserRoles(currentUser?.role) ? (
                        <button
                          onClick={() => handleToggleVerify(user.id)}
                          className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 border border-slate-300 dark:border-gray-700 text-slate-700 dark:text-gray-200 text-[11px] transition-all"
                        >
                          {t('dashboards.admin.toggleVerify')}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {locale === 'ar' ? 'للمسؤول فقط' : 'Admin Only'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 2: AMBASSADOR OVERSIGHT ROSTER ================= */}
      {adminTab === 'ambassadors' && (
        <div className="space-y-6">
          <div className="p-4 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/90 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {locale === 'ar' ? 'جدول السفراء المعتمدين والمفوضين ولائياً' : 'Roster des Ambassadeurs Régionaux'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  {locale === 'ar'
                    ? 'التحكم في صلاحيات السفراء، اعتماد طلبات الانضمام الجديدة، وتقييم الأداء الأكاديمي.'
                    : 'Gérez les accréditations officielles et suivez les performances par wilaya.'}
                </p>
              </div>

              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
                {ambassadorsList.filter((a) => a.isVerified).length} / {ambassadorsList.length} Verified
              </span>
            </div>

            {/* Ambassadors Management Table */}
            <div className="overflow-x-auto no-scrollbar touch-pan-x -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full min-w-[640px] text-left text-xs font-arabic">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-gray-800 text-slate-500 dark:text-gray-400 text-[11px] uppercase">
                    <th className="pb-3 px-3">{locale === 'ar' ? 'السفير' : 'Ambassadeur'}</th>
                    <th className="pb-3 px-3">{locale === 'ar' ? 'الولاية والجامعة' : 'Wilaya & Univ'}</th>
                    <th className="pb-3 px-3">{locale === 'ar' ? 'التقييم والآراء' : 'Note & Avis'}</th>
                    <th className="pb-3 px-3">{locale === 'ar' ? 'الحصص والمواضيع' : 'Sessions'}</th>
                    <th className="pb-3 px-3">{locale === 'ar' ? 'حالة الاعتماد' : 'Statut'}</th>
                    <th className="pb-3 px-3 text-center">{locale === 'ar' ? 'الإجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800 text-slate-700 dark:text-gray-200">
                  {ambassadorsList.map((amb) => (
                    <tr key={amb.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/50">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-gold-500/20 text-gold-700 dark:text-gold-300 font-bold flex items-center justify-center">
                          {amb.user.name.charAt(0)}
                        </div>
                        <div>
                          <div>{amb.user.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{amb.user.email}</div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900 dark:text-white">Wilaya {amb.wilayaCode} ({amb.wilayaNameAr})</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{amb.institutionNameAr}</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 font-mono font-bold text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{amb.ratingAverage}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">({amb.ratingsCount} reviews)</div>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <div>{amb.upcomingSessionsCount} {locale === 'ar' ? 'ورشات' : 'sessions'}</div>
                        <div className="text-[10px] text-slate-400">{amb.materialsCuratedCount || 30} {locale === 'ar' ? 'موضوع' : 'sujets'}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            amb.isVerified
                              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-600 border border-amber-500/30'
                          }`}
                        >
                          {amb.isVerified ? '✓ Certified Lead' : 'Pending Review'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleToggleAmbassadorVerify(amb.id)}
                          className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-[11px] font-bold text-slate-800 dark:text-gold-300 transition-all"
                        >
                          {amb.isVerified ? (locale === 'ar' ? 'تجميد' : 'Suspendre') : (locale === 'ar' ? 'اعتماد رسمي' : 'Valider')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Embedded Full Directory Explorer */}
          <AmbassadorDirectory />
        </div>
      )}

      {/* ================= TAB 3: NATIONAL ACADEMIC HIERARCHY ================= */}
      {adminTab === 'hierarchy' && (
        <div>
          <HierarchyChart />
        </div>
      )}

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
