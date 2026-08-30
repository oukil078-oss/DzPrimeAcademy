'use client';

import React from 'react';
import Link from 'next/link';
import {
  Send,
  Instagram,
  Facebook,
  Video,
  Youtube,
  Globe,
  Bot,
  Smartphone,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  CreditCard,
  Layers,
} from 'lucide-react';
import { DzPrimeLogo } from '../shared/DzPrimeLogo';
import { useTranslation } from '@/lib/i18n/useTranslation';

export const Footer: React.FC = () => {
  const { t, locale } = useTranslation();

  const socialLinks = [
    { name: 'Telegram', icon: Send, href: 'https://t.me/dzprimeacademy', color: 'hover:text-sky-500' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/dzprimeacademy', color: 'hover:text-pink-500' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/dzprimeacademy', color: 'hover:text-blue-600' },
    { name: 'TikTok', icon: Video, href: 'https://tiktok.com/@dzprimeacademy', color: 'hover:text-purple-500' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@dzprimeacademy', color: 'hover:text-red-500' },
  ];

  return (
    <footer className="w-full border-t border-slate-200 dark:border-gold-500/30 bg-slate-100 dark:bg-[#040711] text-slate-800 dark:text-white pt-12 pb-8 relative overflow-hidden transition-colors duration-300">
      {/* Top Gold Border Accent */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-200 dark:border-gray-800">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <DzPrimeLogo size={40} showText={true} />
            <p className="text-xs text-slate-600 dark:text-gray-300 font-arabic leading-relaxed">
              {t('hero.description')}
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-8 h-8 rounded-xl bg-white dark:bg-navy-850 border border-slate-300 dark:border-gold-500/30 flex items-center justify-center text-slate-700 dark:text-gray-300 ${item.color} transition-all hover:scale-110 shadow-sm`}
                    title={item.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gold-700 dark:text-gold-300 font-arabic">
              {t('nav.home')} & {t('nav.dashboard')}
            </h4>
            <ul className="space-y-2 text-xs font-arabic text-slate-600 dark:text-gray-300">
              <li>
                <Link href={`/${locale}/bot`} className="hover:text-gold-600 dark:hover:text-gold-300 transition-colors flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                  <span>{t('bot.title')}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/card`} className="hover:text-gold-600 dark:hover:text-gold-300 transition-colors flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                  <span>{t('card.title')}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/ambassadors`} className="hover:text-gold-600 dark:hover:text-gold-300 transition-colors flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                  <span>{t('hierarchy.ambassadorsNetwork')}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/exams#hierarchy`} className="hover:text-gold-600 dark:hover:text-gold-300 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                  <span>{t('hierarchy.title')}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Digital Ecosystem */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gold-700 dark:text-gold-300 font-arabic">
              {locale === 'ar' ? 'منظومتنا الرقمية' : locale === 'fr' ? 'Écosystème Numérique' : 'Digital Ecosystem'}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-arabic">
              <div className="p-2 rounded-xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-gray-800 flex items-center gap-2 text-slate-700 dark:text-gray-300 shadow-sm">
                <Send className="w-3.5 h-3.5 text-sky-500" />
                <span>Telegram</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-gray-800 flex items-center gap-2 text-slate-700 dark:text-gray-300 shadow-sm">
                <Bot className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400" />
                <span>Smart Bots</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-gray-800 flex items-center gap-2 text-slate-700 dark:text-gray-300 shadow-sm">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Web Portal</span>
              </div>
              <div className="p-2 rounded-xl bg-white dark:bg-navy-850 border border-slate-200 dark:border-gray-800 flex items-center gap-2 text-slate-700 dark:text-gray-300 shadow-sm">
                <Smartphone className="w-3.5 h-3.5 text-purple-500" />
                <span>Mobile App</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gold-700 dark:text-gold-300 font-arabic">
              {t('card.contactInfo')}
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                <span dir="ltr" className="font-mono font-medium">+213 (0) 555 12 34 56</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                <span className="font-mono">contact@dzprime.academy</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-600 dark:text-gold-400 shrink-0" />
                <span className="font-arabic">58 Wilayas • Alger, Algérie</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-gray-400 font-arabic">
          <p>
            © {new Date().getFullYear()} DZ PRIME ACADEMY. {locale === 'ar' ? 'جميع الحقوق محفوظة.' : locale === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
          <p className="font-bold text-gold-700 dark:text-gold-300">
            🇩🇿 {t('hierarchy.slogan')}
          </p>
        </div>
      </div>
    </footer>
  );
};
