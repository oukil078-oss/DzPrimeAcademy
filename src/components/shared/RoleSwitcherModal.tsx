'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { X, Shield, Check, Crown, GraduationCap, Users, BookOpen, Wrench, ShieldAlert, Sparkles } from 'lucide-react';
import { Role, User } from '@/types';
import { useAuthStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { DEMO_USERS } from '@/lib/initial-data';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { currentUser, setUser, switchRole, signOut } = useAuthStore();
  const { locale } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  if (!isOpen) return null;

  const demoProfiles: Array<{
    user: User;
    titleAr: string;
    titleFr: string;
    titleEn: string;
    descAr: string;
    descFr: string;
    descEn: string;
    icon: string;
    badge: string;
  }> = [
    {
      user: DEMO_USERS.find((u) => u.id === 'user-student-bac') || DEMO_USERS[4],
      titleAr: 'طالب بكالوريا علوم تجريبية (BAC 2026)',
      titleFr: 'Étudiant BAC Sciences Expérimentales',
      titleEn: 'BAC Sciences Student',
      descAr: 'مقاييس الرياضيات، الفيزياء، العلوم الطبيعية، ومتابعة معدل البكالوريا.',
      descFr: 'Maths, Physique-Chimie, SVT et annales officielles.',
      descEn: 'Maths, Physics, Biology & national BAC mock exams.',
      icon: '📐',
      badge: 'BAC 2026',
    },
    {
      user: DEMO_USERS.find((u) => u.id === 'user-student-gold') || DEMO_USERS[5],
      titleAr: 'طالب إعلام آلي LMD (USTHB Bab Ezzouar)',
      titleFr: 'Étudiant L2 Informatique (USTHB)',
      titleEn: 'Computer Science Student',
      descAr: 'الخوارزميات C++، أنظمة لينكس، وقواعد البيانات SQL دون مقررات طبية.',
      descFr: 'Algorithmique C++, Systèmes Linux et SQL avancé.',
      descEn: 'C++ Data Structures, Linux OS & SQL Databases.',
      icon: '💻',
      badge: 'LMD CS',
    },
    {
      user: DEMO_USERS.find((u) => u.id === 'user-student-med') || DEMO_USERS[6],
      titleAr: 'طالب علوم طبية & Résidanat (Alger 1)',
      titleFr: 'Étudiant Médecine & Résidanat (Alger 1)',
      titleEn: 'Medical & Residency Student',
      descAr: 'تشريح الجهاز العصبي، الفيزيولوجيا، وبنك 600 سؤال QCM لمسابقة الإقامة.',
      descFr: 'Anatomie, Physiologie et banque QCM Résidanat.',
      descEn: 'Human Anatomy, Physiology & Residency QCM Bank.',
      icon: '🩺',
      badge: 'MÉDECINE',
    },
    {
      user: DEMO_USERS.find((u) => u.role === 'STUDENT_FREE') || DEMO_USERS[7],
      titleAr: 'طالب مجاني (حساب عادي Standard)',
      titleFr: 'Étudiant Gratuit (Free)',
      titleEn: 'Free Student',
      descAr: 'تصفح الدروس الأساسية، بنك المواضيع المحدود، ومعاينة المنصة.',
      descFr: 'Accès aux cours de base et aperçu des examens.',
      descEn: 'Access core lessons and preview exams.',
      icon: '🎓',
      badge: 'STANDARD',
    },
    {
      user: DEMO_USERS.find((u) => u.role === 'TEACHER') || DEMO_USERS[3],
      titleAr: 'أستاذ معتمد ومؤطر (Pr. Kadri)',
      titleFr: 'Enseignant & Formateur',
      titleEn: 'Certified Teacher',
      descAr: 'إدارة الحصص المباشرة، رفع السلاسل والملفات، ومتابعة حضور الطلبة.',
      descFr: 'Gestion des cours live, upload de séries et suivi des étudiants.',
      descEn: 'Manage live classes, upload series & track student attendance.',
      icon: '📚',
      badge: 'TEACHER',
    },
    {
      user: DEMO_USERS.find((u) => u.role === 'AMBASSADOR') || DEMO_USERS[2],
      titleAr: 'سفير ولاية معتمد (Alger - 16)',
      titleFr: 'Ambassadeur de Wilaya',
      titleEn: 'Wilaya Ambassador',
      descAr: 'مولد الروابط الترويجية، تسجيل مبيعات الحزم بعمولة 10%، ونشر ورشات الولاية.',
      descFr: 'Générateur de liens promo, commissions 10% et gestion locale.',
      descEn: 'Referral promo links, 10% commission ledger & local workshops.',
      icon: '🌟',
      badge: 'AMBASSADOR',
    },
    {
      user: DEMO_USERS.find((u) => u.role === 'AGENT_TECHNIQUE') || DEMO_USERS[1],
      titleAr: 'منسق تقني وبيداغوجي (Coordinator)',
      titleFr: 'Coordinateur Technique',
      titleEn: 'Technical Coordinator',
      descAr: 'إنشاء المقاييس والموديولات، تعيين الأساتذة والسفراء، وتصدير التقارير.',
      descFr: 'Création de modules, assignation d\'enseignants et rapports CSV.',
      descEn: 'Module builder, teacher/ambassador assignments & CSV reports.',
      icon: '🛠️',
      badge: 'COORDINATOR',
    },
    {
      user: DEMO_USERS.find((u) => u.role === 'OWNER') || DEMO_USERS[0],
      titleAr: 'المدير العام والمالي (Admin & CEO)',
      titleFr: 'Directeur Général & Finance',
      titleEn: 'Admin & CEO',
      descAr: 'استوديو المالية والمداخيل، إحصائيات 58 ولاية، واعتمادات السفراء.',
      descFr: 'Studio financier, recettes globales et validation nationale.',
      descEn: 'Financial revenue studio, 58 wilayas analytics & payouts.',
      icon: '⚡',
      badge: 'EXECUTIVE',
    },
  ];

  const handleSelectProfile = (user: User) => {
    setUser(user);
    onClose();

    if (pathname) {
      const isDashboard =
        pathname.includes('/student') ||
        pathname.includes('/ambassador') ||
        pathname.includes('/teacher') ||
        pathname.includes('/coordinator') ||
        pathname.includes('/admin');

      if (isDashboard) {
        if (user.role === 'OWNER' || user.role === 'ADMIN' || user.role === 'MODERATOR') {
          router.replace(`/${locale}/admin`);
        } else if (user.role === 'AGENT_TECHNIQUE') {
          router.replace(`/${locale}/coordinator`);
        } else if (user.role === 'TEACHER') {
          router.replace(`/${locale}/teacher`);
        } else if (user.role === 'AMBASSADOR') {
          router.replace(`/${locale}/ambassador`);
        } else {
          router.replace(`/${locale}/student`);
        }
      }
    }
  };

  const handleGuestMode = () => {
    signOut();
    onClose();
    router.replace(`/${locale}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-md"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] bg-white dark:bg-[#0D1424] border border-slate-200 dark:border-navy-800 shadow-2xl p-6 sm:p-8 space-y-6 z-10 font-arabic text-left rtl:text-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-navy-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/15 border border-gold-500/30 text-gold-600 dark:text-gold-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                {locale === 'ar' ? 'تبديل الملفات والأدوار التجريبية' : 'Demo Roles & Profiles Sandbox'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {locale === 'ar'
                  ? 'اختر التخصص والمستوى لعرض المقاييس والنتائج الحقيقية المطابقة له'
                  : 'Select any profile to test role permissions and specialty curricula'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-navy-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {demoProfiles.map((p) => {
            const isCurrent = currentUser?.id === p.user.id || (currentUser?.role === p.user.role && !currentUser?.id.includes('bac') && !currentUser?.id.includes('med') && !currentUser?.id.includes('gold'));
            return (
              <button
                key={p.user.id}
                type="button"
                onClick={() => handleSelectProfile(p.user)}
                className={`w-full p-4 rounded-2xl border text-left rtl:text-right transition-all flex items-start gap-3.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-gold-500/10 border-gold-500/60 shadow-md ring-1 ring-gold-500/30'
                    : 'bg-slate-50 dark:bg-navy-850/70 border-slate-200/80 dark:border-navy-750 hover:bg-slate-100 dark:hover:bg-navy-800'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-navy-750 border border-slate-200 dark:border-navy-700 flex items-center justify-center text-xl shrink-0 shadow-sm">
                  {p.icon}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white line-clamp-1">
                      {locale === 'ar' ? p.titleAr : locale === 'fr' ? p.titleFr : p.titleEn}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-navy-700 text-slate-700 dark:text-gray-300 text-[10px] font-mono font-bold shrink-0">
                      {p.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {locale === 'ar' ? p.descAr : locale === 'fr' ? p.descFr : p.descEn}
                  </p>
                </div>

                {isCurrent && (
                  <div className="w-5 h-5 rounded-full bg-gold-500 text-navy-950 flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Guest Mode Return Option */}
        <div className="pt-2 border-t border-slate-200/80 dark:border-navy-800/80 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-gray-400">
            {locale === 'ar'
              ? 'أو العودة إلى وضع الزائر غير المسجل (صفحة الهبوط الكاملة):'
              : 'Or return to guest visitor mode (full landing page):'}
          </div>

          <button
            type="button"
            onClick={handleGuestMode}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-navy-750 hover:bg-slate-300 dark:hover:bg-navy-700 text-slate-800 dark:text-gray-200 font-bold text-xs transition-colors cursor-pointer"
          >
            {locale === 'ar' ? 'وضع الزائر (Guest)' : 'Guest Visitor Mode'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
