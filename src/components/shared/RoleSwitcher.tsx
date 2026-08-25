'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { Role } from '@/types';
import { useAuthStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, switchRole, signOut } = useAuthStore();
  const { locale } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const roles: { role: Role; labelAr: string; labelFr: string; labelEn: string; icon: string }[] = [
    { role: 'STUDENT_FREE', labelAr: 'طالب مجاني', labelFr: 'Étudiant Gratuit', labelEn: 'Free Student', icon: '🎓' },
    { role: 'STUDENT_PAID', labelAr: 'عضوية ذهبية', labelFr: 'Gold VIP', labelEn: 'VIP Gold', icon: '👑' },
    { role: 'AMBASSADOR', labelAr: 'سفير المنصة', labelFr: 'Ambassadeur', labelEn: 'Ambassador', icon: '🌟' },
    { role: 'TEACHER', labelAr: 'أستاذ معتمد', labelFr: 'Enseignant', labelEn: 'Teacher', icon: '📚' },
    { role: 'OWNER', labelAr: 'المدير العام', labelFr: 'Admin / CEO', labelEn: 'Admin / CEO', icon: '⚡' },
  ];

  const getLabel = (r: (typeof roles)[0]) => {
    if (locale === 'fr') return r.labelFr;
    if (locale === 'en') return r.labelEn;
    return r.labelAr;
  };

  const handleRoleClick = (role: Role) => {
    switchRole(role);

    // If currently on a dashboard page, seamlessly adapt the dashboard URL
    if (pathname) {
      const isDashboardPage =
        pathname.includes('/student') ||
        pathname.includes('/ambassador') ||
        pathname.includes('/admin');

      if (isDashboardPage) {
        if (role === 'OWNER') {
          router.replace(`/${locale}/admin`, { scroll: false });
        } else if (role === 'AMBASSADOR') {
          router.replace(`/${locale}/ambassador`, { scroll: false });
        } else {
          router.replace(`/${locale}/student`, { scroll: false });
        }
      }
    }
  };

  const handleSignOutClick = () => {
    signOut();
    if (pathname && (pathname.includes('/admin') || pathname.includes('/ambassador'))) {
      router.replace(`/${locale}/student`, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-300 dark:border-gold-500/30 text-xs shadow-inner max-w-[210px] xs:max-w-[270px] sm:max-w-none overflow-hidden">
      <div className="px-1.5 sm:px-2 py-0.5 flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-gold-700 dark:text-gold-400 font-arabic shrink-0">
        <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        <span className="hidden lg:inline">
          {locale === 'ar' ? 'معاينة كـ:' : locale === 'fr' ? 'Profil:' : 'Role:'}
        </span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 touch-pan-x">
        {/* Guest Option */}
        <button
          onClick={handleSignOutClick}
          type="button"
          title={locale === 'ar' ? 'زائر (بدون حساب)' : locale === 'fr' ? 'Visiteur (sans compte)' : 'Guest (No account)'}
          className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl text-[10px] sm:text-[11px] font-arabic font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
            !currentUser
              ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-navy-800'
          }`}
        >
          <span>👤</span>
          <span className="hidden sm:inline">{locale === 'ar' ? 'زائر' : locale === 'fr' ? 'Visiteur' : 'Guest'}</span>
        </button>

        {roles.map((r) => {
          const isActive = currentUser?.role === r.role;
          const label = getLabel(r);
          return (
            <button
              key={r.role}
              onClick={() => handleRoleClick(r.role)}
              type="button"
              title={label}
              className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl text-[10px] sm:text-[11px] font-arabic font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 shadow-gold-glow'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-navy-800'
              }`}
            >
              <span>{r.icon}</span>
              <span className="hidden md:inline">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

