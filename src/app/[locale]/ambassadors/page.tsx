'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Award,
  Star,
  MapPin,
  Building2,
  Calendar,
  Sparkles,
  MessageSquare,
  Search,
  Filter,
  CheckCircle2,
  Phone,
  Mail,
  Video,
  Layers,
  ArrowRight,
  ArrowLeft,
  Users,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import {
  AMBASSADORS,
  WILAYAS,
  DAWARAT_PACKS,
  getLocalizedAmbassadorBio,
  getLocalizedWilayaName,
} from '@/lib/initial-data';
import { Region } from '@/types';

export default function AmbassadorsPage() {
  const { t, locale, isRtl } = useTranslation();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<number | 'ALL'>('ALL');

  const filteredAmbassadors = AMBASSADORS.filter((amb) => {
    const matchesSearch =
      amb.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amb.institutionNameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amb.wilayaNameAr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchedWilaya = WILAYAS.find((w) => w.code === amb.wilayaCode);
    const matchesRegion =
      selectedRegion === 'ALL' || (matchedWilaya && matchedWilaya.region === selectedRegion);

    const matchesWilaya =
      selectedWilayaCode === 'ALL' || amb.wilayaCode === selectedWilayaCode;

    return matchesSearch && matchesRegion && matchesWilaya;
  });

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 font-arabic">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold"
        >
          <Award className="w-4 h-4 text-emerald-500" />
          <span>{locale === 'ar' ? '🇩🇿 شبكة السفراء الرسميين المعتمدين في 58 ولاية' : 'Réseau National des Ambassadeurs Certifiés'}</span>
        </motion.div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
          {locale === 'ar' ? 'نخبة سفراء الجامعات والثانويات الجزائرية' : 'Nos Ambassadeurs Universitaires & Lycéens'}
        </h1>

        <p className="text-xs sm:text-base text-slate-600 dark:text-gray-300 leading-relaxed">
          {locale === 'ar'
            ? 'سفراؤنا المعتمدون متواجدون في كبرى الجامعات والثانويات لمرافقتك، تقديم النصائح، تنظيم ورشات المراجعة، وتسهيل اشتراكك في دورات التحضير المباشرة.'
            : 'Des ambassadeurs certifiés dans toute l\'Algérie pour vous orienter, organiser vos révisions et faciliter votre inscription aux packs Dawarat.'}
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-gold-500/30 shadow-md space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search text input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={locale === 'ar' ? 'بحث بالاسم، الجامعة أو الولاية...' : 'Rechercher par nom, fac, wilaya...'}
              className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-navy-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            />
          </div>

          {/* Region filter */}
          <div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-navy-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            >
              <option value="ALL">{locale === 'ar' ? 'جميع المناطق الجغرافية' : 'Toutes les Régions'}</option>
              <option value="CENTER">{locale === 'ar' ? 'منطقة الوسط (Alger, Blida, Tizi...)' : 'Région Centre'}</option>
              <option value="WEST">{locale === 'ar' ? 'منطقة الغرب (Oran, Tlemcen...)' : 'Région Ouest'}</option>
              <option value="EAST">{locale === 'ar' ? 'منطقة الشرق (Constantine, Sétif...)' : 'Région Est'}</option>
              <option value="SOUTH">{locale === 'ar' ? 'منطقة الجنوب (Adrar, Ouargla...)' : 'Région Sud'}</option>
            </select>
          </div>

          {/* Wilaya Filter */}
          <div>
            <select
              value={selectedWilayaCode}
              onChange={(e) => setSelectedWilayaCode(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-navy-850 border border-slate-300 dark:border-navy-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-gold-500"
            >
              <option value="ALL">{locale === 'ar' ? 'جميع الولايات (58 ولاية)' : 'Toutes les Wilayas'}</option>
              {WILAYAS.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code} - {locale === 'fr' ? w.nameFr : w.nameAr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ambassadors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAmbassadors.map((amb) => {
          const promoCode = `AMB-${amb.wilayaCode}-${amb.user.name.split(' ')[0].toUpperCase()}`;
          const bio = getLocalizedAmbassadorBio(amb, locale);

          return (
            <motion.div
              key={amb.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-750 hover:border-gold-500/50 transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 text-left rtl:text-right"
            >
              <div className="space-y-3">
                {/* Ambassador Top Card */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t('brand.verifiedAmbassador')}</span>
                  </span>

                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{amb.ratingAverage}</span>
                    <span className="text-slate-400 font-normal">({amb.ratingsCount})</span>
                  </div>
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-700 dark:text-gold-300 font-black text-base flex items-center justify-center shrink-0 shadow-inner">
                    {amb.user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {amb.user.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gold-500" />
                      <span>{amb.wilayaCode} - {amb.wilayaNameAr}</span>
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200 dark:border-navy-800 text-xs text-slate-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-gold-500 shrink-0" />
                  <span className="line-clamp-1">{amb.institutionNameAr}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                  {bio}
                </p>
              </div>

              {/* Promo Code Box & Action */}
              <div className="pt-3 border-t border-slate-200 dark:border-navy-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-gray-400 font-bold">
                    {locale === 'ar' ? 'كود الخصم المعتمد:' : 'Code Promo :'}
                  </span>
                  <span className="font-mono font-black text-gold-600 dark:text-gold-400 px-2 py-0.5 rounded bg-gold-500/15 border border-gold-500/30">
                    {promoCode}
                  </span>
                </div>

                <Link
                  href={`/${locale}/dawarat?ref=${promoCode}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-black text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{locale === 'ar' ? 'استعراض الحزم والدورات بكود السفير' : 'Voir les packs avec réduction'}</span>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredAmbassadors.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-2">
          <p className="text-sm font-bold text-slate-700 dark:text-gray-300">
            {locale === 'ar' ? 'لم يتم العثور على سفراء يطابقون خيارات البحث' : 'Aucun ambassadeur ne correspond à vos critères'}
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedRegion('ALL');
              setSelectedWilayaCode('ALL');
            }}
            className="text-xs text-gold-600 dark:text-gold-400 font-bold hover:underline"
          >
            {locale === 'ar' ? 'إعادة ضبط الفلاتر' : 'Réinitialiser les filtres'}
          </button>
        </div>
      )}
    </div>
  );
}
