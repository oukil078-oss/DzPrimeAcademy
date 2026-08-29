'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Layers,
  Users,
  Award,
  BookOpen,
  DollarSign,
  PlusCircle,
  CheckCircle2,
  Edit3,
  UserCheck,
  Tag,
  Clock,
  Sparkles,
  Save,
  Video,
  Download,
  X,
  Check,
} from 'lucide-react';
import { MetricsGrid, MetricCardItem } from '@/components/dashboard/MetricsGrid';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useAuthStore } from '@/lib/store';
import { isTechnicalAgent } from '@/lib/rbac';
import { DAWARAT_PACKS, TEACHERS, AMBASSADORS } from '@/lib/initial-data';
import { DawaaraPack, DawaaraModule } from '@/types';
import { AuthModal } from '@/components/auth/AuthModal';

export default function CoordinatorDashboardPage() {
  const { t, locale } = useTranslation();
  const { currentUser } = useAuthStore();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const isUserCoord = isTechnicalAgent(currentUser?.role);

  // Local state for packs to allow coordinator to add/edit modules and re-assign in real time
  const [packs, setPacks] = useState<DawaaraPack[]>(DAWARAT_PACKS);
  const [selectedPackId, setSelectedPackId] = useState<string>(packs[0]?.id || '');
  const [saveToast, setSaveToast] = useState(false);

  // Add Module Modal state
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [newModuleNameAr, setNewModuleNameAr] = useState('');
  const [newModuleNameFr, setNewModuleNameFr] = useState('');
  const [newModuleCode, setNewModuleCode] = useState('MOD-NEW-2026');
  const [newModuleCoeff, setNewModuleCoeff] = useState(5);
  const [newModuleHours, setNewModuleHours] = useState(20);
  const [newModulePrice, setNewModulePrice] = useState(3000);
  const [newModuleTeacherId, setNewModuleTeacherId] = useState(TEACHERS[0].id);
  const [newModuleSchedule, setNewModuleSchedule] = useState('الجمعة من 18:00 إلى 20:30');

  // Active selected pack
  const currentPack = packs.find((p) => p.id === selectedPackId) || packs[0];

  // Handler: Assign Teacher to a Module
  const handleAssignTeacher = (moduleId: string, teacherId: string) => {
    const selectedTeacher = TEACHERS.find((tch) => tch.id === teacherId);
    if (!selectedTeacher) return;

    setPacks((prev) =>
      prev.map((pack) => {
        if (pack.id === currentPack.id) {
          return {
            ...pack,
            modules: pack.modules.map((m) =>
              m.id === moduleId
                ? {
                    ...m,
                    teacherId: selectedTeacher.id,
                    teacherName: selectedTeacher.name,
                    teacherTitle: selectedTeacher.titleAr,
                    teacherAvatar: selectedTeacher.avatar,
                  }
                : m
            ),
          };
        }
        return pack;
      })
    );
  };

  // Handler: Assign Ambassador to Pack
  const handleAssignAmbassador = (ambassadorId: string) => {
    const selectedAmb = AMBASSADORS.find((a) => a.id === ambassadorId);
    if (!selectedAmb) return;

    setPacks((prev) =>
      prev.map((pack) =>
        pack.id === currentPack.id
          ? {
              ...pack,
              ambassadorId: selectedAmb.id,
              ambassadorName: `${selectedAmb.user.name} (${selectedAmb.wilayaNameAr})`,
              ambassadorWilayaCode: selectedAmb.wilayaCode,
              ambassadorWilayaName: selectedAmb.wilayaNameAr,
              referralCode: `AMB-${selectedAmb.wilayaCode}-${selectedAmb.user.name.split(' ')[0].toUpperCase()}`,
            }
          : pack
      )
    );
  };

  // Handler: Add New Module to Current Pack
  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleNameAr.trim()) return;

    const assignedTeacher = TEACHERS.find((t) => t.id === newModuleTeacherId) || TEACHERS[0];

    const newModule: DawaaraModule = {
      id: `mod-${Date.now()}`,
      packId: currentPack.id,
      nameAr: newModuleNameAr.trim(),
      nameFr: newModuleNameFr.trim() || newModuleNameAr.trim(),
      nameEn: newModuleNameFr.trim() || newModuleNameAr.trim(),
      code: newModuleCode.trim().toUpperCase(),
      coefficient: Number(newModuleCoeff),
      shortDescriptionAr: `مراجعة تدريبية مكثفة بإشراف ${assignedTeacher.name}.`,
      shortDescriptionFr: `Module intensif encadré par ${assignedTeacher.name}.`,
      shortDescriptionEn: `Intensive module under Pr. ${assignedTeacher.name}.`,
      syllabusAr: ['تثبيت المفاهيم والمكتسبات القبلية', 'حل بنك مواضيع الامتحانات الوزارية النموذجية', 'جلسات تفاعلية مباشرة لطرح الأسئلة'],
      syllabusFr: ['Consolidation des fondamentaux', 'Entraînement sur annales', 'Séance Q&A interactive'],
      individualPrice: Number(newModulePrice),
      packDiscountPrice: Math.round(Number(newModulePrice) * 0.65),
      hoursCount: Number(newModuleHours),
      sessionsCount: Math.ceil(Number(newModuleHours) / 2.5),
      scheduleDaysAr: newModuleSchedule,
      scheduleDaysFr: newModuleSchedule,
      teacherId: assignedTeacher.id,
      teacherName: assignedTeacher.name,
      teacherTitle: assignedTeacher.titleAr,
      teacherAvatar: assignedTeacher.avatar,
      meetUrl: 'https://meet.google.com',
      enrolledCount: 45,
    };

    setPacks((prev) =>
      prev.map((pack) =>
        pack.id === currentPack.id
          ? {
              ...pack,
              modules: [...pack.modules, newModule],
              originalTotalPrice: pack.originalTotalPrice + newModule.individualPrice,
              totalHours: pack.totalHours + newModule.hoursCount,
            }
          : pack
      )
    );

    setNewModuleNameAr('');
    setNewModuleNameFr('');
    setIsAddModuleOpen(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  // Export Coordination Summary Report as CSV
  const handleExportReport = () => {
    const header = 'Pack_ID,Pack_Title,Category,Modules_Count,Pack_Price,Referral_Code,Ambassador\n';
    const rows = packs
      .map(
        (p) =>
          `"${p.id}","${p.titleAr}","${p.category}",${p.modules.length},${p.packPrice},"${p.referralCode}","${p.ambassadorName}"`
      )
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport_coordination_dzprime_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Save changes
  const handleSaveAll = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const coordinatorMetrics: MetricCardItem[] = [
    {
      title: t('dashboards.coordinator.totalPacks'),
      value: `${packs.length} Active Packs`,
      change: '4 Tracks Covered',
      isPositive: true,
      icon: Layers,
      description: locale === 'ar' ? 'بكالوريا وجامعة وطب' : 'BAC, LMD & Médecine',
    },
    {
      title: t('dashboards.coordinator.activeTeachers'),
      value: `${TEACHERS.length} Professeurs`,
      change: '100% Assigned',
      isPositive: true,
      icon: BookOpen,
      description: locale === 'ar' ? 'أساتذة مبرزون ومفتشون' : 'Professeurs certifiés',
    },
    {
      title: t('dashboards.coordinator.activeAmbassadors'),
      value: `${AMBASSADORS.length} Ambassadeurs`,
      change: '58 Wilayas',
      isPositive: true,
      icon: Award,
      description: locale === 'ar' ? 'شبكة الترويج والإشراف' : 'Réseau promotionnel',
    },
    {
      title: t('dashboards.coordinator.totalEnrollments'),
      value: '1,480 Inscrits',
      change: '+28% this month',
      isPositive: true,
      icon: Users,
      description: locale === 'ar' ? 'اشتراكات مؤكدة بالدورات' : 'Inscriptions validées',
    },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 font-arabic">
      {/* Notice if not logged in as Coordinator */}
      {!isUserCoord && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-gold-500/20 to-transparent border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left rtl:text-right">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0 font-bold">
              🛠️
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-gold-200">
                {locale === 'ar' ? 'معاينة لوحة المنسق التقني والبيداغوجي' : 'Mode Démo - Coordinateur Technique'}
              </h4>
              <p className="text-xs text-slate-600 dark:text-gray-300">
                {locale === 'ar'
                  ? 'يمكنك تبديل الدور إلى "منسق تقني" من الشريط العلوي لإدارة حزم الدورات وإسناد المقاييس للأساتذة والسفراء.'
                  : 'Basculez vers "Coordinateur" pour assigner les modules aux enseignants et gérer les packs.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black text-xs shadow-gold-glow flex items-center gap-1.5 shrink-0 transition-all active:scale-95 cursor-pointer"
          >
            <span>{locale === 'ar' ? 'تسجيل دخول كمنسق' : 'Connexion Coordinateur'}</span>
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 border border-gold-500/30 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold mb-2">
            <Settings className="w-3.5 h-3.5" />
            <span>{t('roles.AGENT_TECHNIQUE')}</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white">
            {t('dashboards.coordinator.title')}
          </h1>
          <p className="text-xs text-gray-300 mt-1 max-w-2xl">
            {t('dashboards.coordinator.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleExportReport}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-gold-500/30 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>{locale === 'ar' ? 'تصدير التقرير (CSV)' : 'Rapport CSV'}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-gold-glow transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t('dashboards.coordinator.saveAssignments')}</span>
          </button>
        </div>
      </div>

      {saveToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{locale === 'ar' ? 'تم حفظ كافة التغييرات والإسنادات ونشرها للمنصة بنجاح!' : 'Assignations mises à jour avec succès !'}</span>
        </div>
      )}

      {/* Coordinator Metrics */}
      <MetricsGrid metrics={coordinatorMetrics} />

      {/* Main Pack Assignment Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Pack Selector */}
        <div className="p-5 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 space-y-3">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-gold-500" />
            <span>{locale === 'ar' ? 'اختر الحزمة لإدارتها:' : 'Sélectionner le Pack :'}</span>
          </h3>

          <div className="space-y-2">
            {packs.map((p) => {
              const isSelected = p.id === currentPack.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPackId(p.id)}
                  className={`p-3.5 rounded-2xl border text-left rtl:text-right cursor-pointer transition-all ${
                    isSelected
                      ? 'border-gold-500 bg-gold-500/10 dark:bg-gold-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-850 hover:border-gold-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {locale === 'fr' ? p.titleFr : p.titleAr}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/15 text-gold-700 dark:text-gold-300 font-bold shrink-0">
                      {p.modules.length} {locale === 'ar' ? 'مواد' : 'mods'}
                    </span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 dark:text-gray-400 flex items-center justify-between">
                    <span>{p.packPrice.toLocaleString()} DZD</span>
                    <span className="text-gold-600 dark:text-gold-400 font-mono">{p.referralCode}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Module-to-Teacher & Ambassador Assignment Workbench */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 space-y-6 shadow-sm">
          {/* Sponsoring Ambassador Assignment Box */}
          <div className="p-4 rounded-2xl bg-amber-500/10 dark:bg-gold-500/10 border border-gold-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Award className="w-4 h-4 text-gold-500" />
                <span>{t('dashboards.coordinator.assignAmbassador')}</span>
              </h4>
              <span className="text-xs font-mono font-bold text-gold-600 dark:text-gold-400">
                Code: {currentPack.referralCode}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 dark:text-gray-400 mb-1">
                  {t('dashboards.coordinator.selectAmbassador')}
                </label>
                <select
                  value={currentPack.ambassadorId}
                  onChange={(e) => handleAssignAmbassador(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-800 text-xs text-slate-900 dark:text-white"
                >
                  {AMBASSADORS.map((amb) => (
                    <option key={amb.id} value={amb.id}>
                      {amb.user.name} ({amb.wilayaNameAr} - {amb.institutionNameAr})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 dark:text-gray-400 mb-1">
                  {locale === 'ar' ? 'نسبة الخصم بالحزمة (Bundle Discount)' : 'Remise du pack'}
                </label>
                <div className="py-2 px-3 rounded-xl bg-white dark:bg-navy-800 border border-slate-300 dark:border-navy-700 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {currentPack.packPrice.toLocaleString()} DZD (بدل {currentPack.originalTotalPrice.toLocaleString()} DZD)
                </div>
              </div>
            </div>
          </div>

          {/* Module-by-Module Teacher Assignment */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gold-500" />
                <span>{t('dashboards.coordinator.assignTeacher')} ({currentPack.modules.length} {locale === 'ar' ? 'مقاييس' : 'modules'})</span>
              </h4>

              <button
                type="button"
                onClick={() => setIsAddModuleOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{locale === 'ar' ? '+ إضافة مقياس جديد للحزمة' : '+ Nouveau Module'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {currentPack.modules.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-gold-500/15 text-gold-700 dark:text-gold-300 text-[10px] font-mono font-bold">
                        {m.code}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-gray-400 font-bold">
                        Coeff {m.coefficient} • {m.hoursCount} {t('dawarat.hours')}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      {locale === 'fr' ? m.nameFr : m.nameAr}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gold-500" />
                      <span>{locale === 'fr' ? m.scheduleDaysFr : m.scheduleDaysAr}</span>
                    </p>
                  </div>

                  <div className="shrink-0 w-full sm:w-60">
                    <label className="block text-[10px] font-bold text-slate-500 dark:text-gray-400 mb-1">
                      {locale === 'ar' ? 'الأستاذ المشرف المسند:' : 'Enseignant assigné :'}
                    </label>
                    <select
                      value={m.teacherId}
                      onChange={(e) => handleAssignTeacher(m.id, e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-850 text-xs text-slate-900 dark:text-white font-medium"
                    >
                      {TEACHERS.map((tch) => (
                        <option key={tch.id} value={tch.id}>
                          {tch.avatar} {tch.name} ({tch.specialty.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add New Module Modal */}
      <AnimatePresence>
        {isAddModuleOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-gold-500/40 shadow-2xl p-6 space-y-4 text-left rtl:text-right"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-gold-500/20 text-gold-500 font-bold">
                    <PlusCircle className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {locale === 'ar' ? `إضافة مقياس جديد إلى ${currentPack.titleAr}` : 'Ajouter un Module au Pack'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModuleOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateModule} className="space-y-3.5 text-xs font-arabic">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-gray-300 mb-1">
                    {locale === 'ar' ? 'اسم المقياس بالعربية:' : 'Nom en Arabe :'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newModuleNameAr}
                    onChange={(e) => setNewModuleNameAr(e.target.value)}
                    placeholder="مثال: العلوم الفيزيائية والكيمياء الحركية"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-gray-300 mb-1">
                    {locale === 'ar' ? 'اسم المقياس بالفرنسية:' : 'Nom en Français :'}
                  </label>
                  <input
                    type="text"
                    value={newModuleNameFr}
                    onChange={(e) => setNewModuleNameFr(e.target.value)}
                    placeholder="Ex: Physique & Chimie Cinétique"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-gray-300 mb-1">
                      {locale === 'ar' ? 'رمز المقياس والمعامل:' : 'Code & Coefficient :'}
                    </label>
                    <input
                      type="text"
                      value={newModuleCode}
                      onChange={(e) => setNewModuleCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-gray-300 mb-1">
                      {locale === 'ar' ? 'إجمالي الساعات المباشرة:' : 'Volume Horaire :'}
                    </label>
                    <input
                      type="number"
                      value={newModuleHours}
                      onChange={(e) => setNewModuleHours(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-gray-300 mb-1">
                      {locale === 'ar' ? 'السعر الإفرادي (DZD):' : 'Prix unitaire (DZD) :'}
                    </label>
                    <input
                      type="number"
                      value={newModulePrice}
                      onChange={(e) => setNewModulePrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-gray-300 mb-1">
                      {locale === 'ar' ? 'الأستاذ المعتمد:' : 'Professeur :'}
                    </label>
                    <select
                      value={newModuleTeacherId}
                      onChange={(e) => setNewModuleTeacherId(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white"
                    >
                      {TEACHERS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-gray-300 mb-1">
                    {locale === 'ar' ? 'مواعيد الحصص المباشرة:' : 'Horaires des séances :'}
                  </label>
                  <input
                    type="text"
                    value={newModuleSchedule}
                    onChange={(e) => setNewModuleSchedule(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-950 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModuleOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 text-slate-700 dark:text-gray-300 font-bold"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-black shadow-gold-glow flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{locale === 'ar' ? 'إضافة ونشر المقياس' : 'Ajouter au Pack'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
