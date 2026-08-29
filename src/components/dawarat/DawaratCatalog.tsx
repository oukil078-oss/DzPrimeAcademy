'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Search,
  BookOpen,
  GraduationCap,
  HeartPulse,
  Laptop,
  Languages,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { DAWARAT_PACKS } from '@/lib/initial-data';
import { DawaaraCategory, DawaaraPack } from '@/types';
import { PackCard } from './PackCard';
import { PackCheckoutModal } from './PackCheckoutModal';
import { useTranslation } from '@/lib/i18n/useTranslation';

export const DawaratCatalog: React.FC = () => {
  const { t, locale } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<DawaaraCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCheckoutPack, setActiveCheckoutPack] = useState<DawaaraPack | null>(null);

  const categories: { id: DawaaraCategory | 'ALL'; labelAr: string; labelFr: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'ALL', labelAr: 'جميع الحزم', labelFr: 'Tous les Packs', labelEn: 'All Packs', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'BAC_SCIENCE', labelAr: 'بكالوريا علوم ورياضيات', labelFr: 'BAC Sciences & Maths', labelEn: 'BAC Science & Math', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'BAC_LANGUAGES', labelAr: 'بكالوريا لغات وفلسفة', labelFr: 'BAC Langues & Philo', labelEn: 'BAC Languages & Philo', icon: <Languages className="w-4 h-4" /> },
    { id: 'UNIVERSITY_LMD', labelAr: 'الجامعة LMD إعلام آلي وهندسة', labelFr: 'Université LMD Informatique', labelEn: 'University LMD CS & Math', icon: <Laptop className="w-4 h-4" /> },
    { id: 'MEDICAL', labelAr: 'العلوم الطبية والصيدلة', labelFr: 'Sciences Médicales', labelEn: 'Medical Sciences', icon: <HeartPulse className="w-4 h-4" /> },
  ];

  const filteredPacks = DAWARAT_PACKS.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      p.titleAr.toLowerCase().includes(q) ||
      p.titleFr.toLowerCase().includes(q) ||
      p.targetAudienceAr.toLowerCase().includes(q) ||
      p.ambassadorName.toLowerCase().includes(q) ||
      p.referralCode.toLowerCase().includes(q) ||
      p.modules.some(
        (m) =>
          m.nameAr.toLowerCase().includes(q) ||
          m.nameFr.toLowerCase().includes(q) ||
          m.teacherName.toLowerCase().includes(q)
      );
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Category Pills & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category horizontal scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none font-arabic">
          {categories.map((c) => {
            const isActive = selectedCategory === c.id;
            const label = locale === 'fr' ? c.labelFr : locale === 'en' ? c.labelEn : c.labelAr;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 shadow-gold-glow font-black'
                    : 'bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-700 dark:text-gray-300 hover:border-gold-400'
                }`}
              >
                {c.icon}
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={locale === 'ar' ? 'بحث عن مقياس، أستاذ، أو حزمة...' : 'Rechercher un module, prof...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2.5 px-9 rounded-2xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-xs text-slate-900 dark:text-white font-arabic focus:outline-none focus:border-gold-500 shadow-sm"
          />
        </div>
      </div>

      {/* Grid of Packs */}
      {filteredPacks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPacks.map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              onOpenCheckout={(p) => setActiveCheckoutPack(p)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-center font-arabic">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800 dark:text-gray-200">
            {locale === 'ar' ? 'لم يتم العثور على حزم مطابقة لبحثك' : 'Aucun pack trouvé'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
            {locale === 'ar' ? 'جرب البحث باسم مادة أخرى أو تصفح كل الحزم' : 'Essayez une autre recherche'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-gold-500 text-navy-950 font-bold text-xs shadow-gold-glow cursor-pointer"
          >
            {locale === 'ar' ? 'عرض جميع الحزم' : 'Afficher tous les packs'}
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      <PackCheckoutModal
        isOpen={!!activeCheckoutPack}
        onClose={() => setActiveCheckoutPack(null)}
        pack={activeCheckoutPack}
      />
    </div>
  );
};
