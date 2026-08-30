'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LogIn,
  UserPlus,
  Crown,
  GraduationCap,
  Award,
  Shield,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Lock,
  Mail,
  User as UserIcon,
  MapPin,
  Building,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { DEMO_USERS, WILAYAS, getLocalizedWilayaName } from '@/lib/initial-data';
import { Role, User } from '@/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'demo' | 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'demo',
}) => {
  const { setCurrentUser } = useAuthStore();
  const { t, locale, isRtl } = useTranslation();

  const [activeTab, setActiveTab] = useState<'demo' | 'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [wilayaCode, setWilayaCode] = useState<number>(16);
  const [role, setRole] = useState<Role>('STUDENT_FREE');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectDemoUser = (demoUser: User) => {
    if (!demoUser) return;
    setCurrentUser(demoUser);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg(locale === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Veuillez saisir votre email');
      return;
    }

    const matched = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (matched) {
      setCurrentUser(matched);
      onClose();
    } else {
      // Create user session with this email
      const customUser: User = {
        id: `user-${Date.now()}`,
        email,
        name: email.split('@')[0],
        role: 'STUDENT_FREE',
        wilayaCode: 16,
        wilayaName: 'Alger',
        institutionName: 'Université USTHB Bab Ezzouar',
        studentCardId: `DZ-STU-16-${Math.floor(1000 + Math.random() * 9000)}`,
        isVerified: true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setCurrentUser(customUser);
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      setErrorMsg(locale === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Veuillez remplir tous les champs');
      return;
    }

    const wilaya = WILAYAS.find((w) => w.code === wilayaCode);
    const prefix = role === 'AMBASSADOR' ? 'AMB' : role === 'TEACHER' ? 'TCH' : role === 'STUDENT_PAID' ? 'GLD' : 'STU';

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      wilayaCode,
      wilayaName: wilaya ? getLocalizedWilayaName(wilaya, locale) : 'Alger',
      institutionName: role === 'STUDENT_FREE' || role === 'STUDENT_PAID' ? 'Université des Sciences et de la Technologie' : 'Université Centrale Alger',
      studentCardId: `DZ-${prefix}-${wilayaCode}-${Math.floor(1000 + Math.random() * 9000)}`,
      isVerified: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCurrentUser(newUser);
    onClose();
  };

  const freeStudent = DEMO_USERS.find((u) => u.role === 'STUDENT_FREE') || DEMO_USERS[4] || {
    id: 'user-student-free',
    email: 'student.free@dzprime.academy',
    name: 'Yacine Belalem',
    role: 'STUDENT_FREE',
    wilayaCode: 16,
    wilayaName: 'Alger',
    institutionName: 'USTHB Bab Ezzouar',
    studentCardId: 'DZ-STU-16-4412',
    isVerified: false,
    createdAt: '2024-02-01',
  };

  const goldStudent = DEMO_USERS.find((u) => u.role === 'STUDENT_PAID') || DEMO_USERS[3] || {
    id: 'user-student-gold',
    email: 'student.gold@dzprime.academy',
    name: 'Ines Haddad',
    role: 'STUDENT_PAID',
    wilayaCode: 31,
    wilayaName: 'Oran',
    institutionName: 'USTO-MB Oran',
    studentCardId: 'DZ-GLD-31-8841',
    isVerified: true,
    createdAt: '2024-01-15',
  };

  const ambassador = DEMO_USERS.find((u) => u.role === 'AMBASSADOR') || DEMO_USERS[1] || {
    id: 'user-ambassador',
    email: 'ambassador.alger@dzprime.academy',
    name: 'Alaa Eddine',
    role: 'AMBASSADOR',
    wilayaCode: 16,
    wilayaName: 'Alger',
    institutionName: 'Université USTHB',
    studentCardId: 'DZ-AMB-16-0789',
    isVerified: true,
    createdAt: '2023-09-10',
  };

  const teacher = DEMO_USERS.find((u) => u.role === 'TEACHER') || DEMO_USERS[2] || {
    id: 'user-teacher',
    email: 'teacher.math@dzprime.academy',
    name: 'Pr. Abdelrahim Kadri',
    role: 'TEACHER',
    wilayaCode: 19,
    wilayaName: 'Sétif',
    institutionName: 'Université Ferhat Abbas Sétif 1',
    studentCardId: 'DZ-TCH-19-0142',
    isVerified: true,
    createdAt: '2023-05-12',
  };

  const owner = DEMO_USERS.find((u) => u.role === 'OWNER') || DEMO_USERS[0] || {
    id: 'user-admin',
    email: 'admin@dzprime.academy',
    name: 'Riad Benmhidi',
    role: 'OWNER',
    wilayaCode: 16,
    wilayaName: 'Alger',
    institutionName: 'USTHB Bab Ezzouar',
    studentCardId: 'DZ-OWN-16-0001',
    isVerified: true,
    createdAt: '2023-01-01',
  };

  const demoRoles = [
    {
      user: freeStudent,
      icon: GraduationCap,
      title: locale === 'ar' ? 'طالب حساب مجاني' : locale === 'fr' ? 'Étudiant Compte Gratuit' : 'Free Student Account',
      badge: 'Free Tier',
      badgeColor: 'bg-slate-200 dark:bg-navy-850 text-slate-700 dark:text-gray-300',
    },
    {
      user: goldStudent,
      icon: Crown,
      title: locale === 'ar' ? 'طالب عضوية ذهبية VIP' : locale === 'fr' ? 'Étudiant Gold VIP' : 'VIP Gold Student',
      badge: 'VIP Gold',
      badgeColor: 'bg-gold-500/20 text-gold-700 dark:text-gold-300 border border-gold-500/40',
    },
    {
      user: ambassador,
      icon: Award,
      title: locale === 'ar' ? 'سفير جامعة هواري بومدين' : locale === 'fr' ? 'Ambassadeur USTHB' : 'University Ambassador',
      badge: 'Ambassador',
      badgeColor: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-400/40',
    },
    {
      user: teacher,
      icon: BookOpen,
      title: locale === 'ar' ? 'أستاذ محاضر معتمد' : locale === 'fr' ? 'Professeur / Enseignant' : 'Certified Lecturer',
      badge: 'Faculty',
      badgeColor: 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-400/40',
    },
    {
      user: owner,
      icon: Shield,
      title: locale === 'ar' ? 'المؤسس ومدير المنصة' : locale === 'fr' ? 'Fondateur & Admin SaaS' : 'Founder & Platform Admin',
      badge: 'Owner / Admin',
      badgeColor: 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-400/40',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 dark:bg-navy-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar rounded-3xl border border-slate-200 dark:border-gold-500/50 bg-white dark:bg-gradient-to-b dark:from-[#0D152A] dark:to-[#060913] p-4 sm:p-8 text-slate-900 dark:text-white shadow-2xl my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-3 sm:top-4 ${isRtl ? 'left-3 sm:left-4' : 'right-3 sm:right-4'} p-2 rounded-full bg-slate-100 dark:bg-navy-850 hover:bg-slate-200 dark:hover:bg-navy-800 border border-slate-200 dark:border-gold-500/30 text-slate-500 dark:text-gray-300 transition-all touch-target`}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center max-w-sm mx-auto mb-5">
            <h3 className="text-xl sm:text-2xl font-black font-arabic text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-gold-300 dark:via-gold-400 dark:to-gold-600 dark:bg-clip-text">
              {locale === 'ar'
                ? 'تسجيل الدخول إلى DZ PRIME'
                : locale === 'fr'
                ? 'Connexion à DZ PRIME'
                : 'Sign In to DZ PRIME'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-gray-300 mt-1 font-arabic">
              {locale === 'ar'
                ? 'اختر حساباً تجريبياً فورياً أو سجّل بحسابك الشخصي'
                : locale === 'fr'
                ? 'Accédez instantanément via un profil de démo ou vos identifiants'
                : 'Select an instant demo profile or sign in with your account'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-navy-850 border border-slate-200 dark:border-gold-500/30 mb-5 text-xs font-arabic">
            <button
              onClick={() => setActiveTab('demo')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'demo'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'دخول سريع (Demo)' : 'Profils Démo'}</span>
            </button>

            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'تسجيل دخول' : 'Connexion'}</span>
            </button>

            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-glow'
                  : 'text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{locale === 'ar' ? 'حساب جديد' : 'Inscription'}</span>
            </button>
          </div>

          {/* TAB 1: 1-Click Demo Profiles */}
          {activeTab === 'demo' && (
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
              {demoRoles.map((item, idx) => {
                const Icon = item.icon;
                if (!item.user) return null;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectDemoUser(item.user)}
                    className="w-full p-3 rounded-2xl border border-slate-200 dark:border-gold-500/30 bg-slate-50 dark:bg-navy-900 hover:bg-white dark:hover:bg-navy-800 hover:border-gold-500 flex items-center justify-between text-left transition-all group active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-600 dark:text-gold-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold font-arabic text-slate-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-200">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                          {item.user?.email || 'user@dzprime.academy'}
                        </p>
                      </div>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* TAB 2: Standard Sign In */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5 font-arabic text-xs">
              <div>
                <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Adresse Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@dzprime.academy"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                  {locale === 'ar' ? 'كلمة المرور' : 'Mot de passe'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-rose-500 text-xs font-semibold">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs shadow-gold-glow flex items-center justify-center gap-2 active:scale-95 transition-all mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{locale === 'ar' ? 'دخول إلى الحساب' : 'Se Connecter'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: Register */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 font-arabic text-xs">
              <div>
                <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                  {locale === 'ar' ? 'الاسم الكامل' : 'Nom & Prénom'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Walid Benali"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                  {locale === 'ar' ? 'البريد الإلكتروني' : 'Adresse Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="walid@univ-alger.dz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                    {locale === 'ar' ? 'الولاية' : 'Wilaya'}
                  </label>
                  <select
                    value={wilayaCode}
                    onChange={(e) => setWilayaCode(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-800 dark:text-white focus:outline-none"
                  >
                    {WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {getLocalizedWilayaName(w, locale)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-gray-300 mb-1 font-semibold">
                    {locale === 'ar' ? 'نوع الحساب' : 'Type de Profil'}
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as Role)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 text-slate-800 dark:text-gold-300 font-bold focus:outline-none"
                  >
                    <option value="STUDENT_FREE">{t('roles.STUDENT_FREE')}</option>
                    <option value="STUDENT_PAID">{t('roles.STUDENT_PAID')}</option>
                    <option value="AMBASSADOR">{t('roles.AMBASSADOR')}</option>
                    <option value="TEACHER">{t('roles.TEACHER')}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs shadow-gold-glow flex items-center justify-center gap-2 active:scale-95 transition-all mt-3"
              >
                <UserPlus className="w-4 h-4" />
                <span>{locale === 'ar' ? 'إنشاء الحساب وبدء التجربة' : 'Créer mon Compte'}</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
