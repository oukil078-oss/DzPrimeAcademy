'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
import { Download, CheckCircle, RotateCw, ExternalLink, ShieldCheck, Phone, Mail, Globe } from 'lucide-react';
import { MembershipCardData, User } from '@/types';
import { DzPrimeLogo } from '../shared/DzPrimeLogo';
import { useTranslation } from '@/lib/i18n/useTranslation';

interface MembershipCardProps {
  user?: User | null;
  cardData?: MembershipCardData;
  allowExport?: boolean;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({
  user,
  cardData: customCardData,
  allowExport = true,
}) => {
  const { t, locale } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const backCardRef = useRef<HTMLDivElement>(null);

  // Synthesize card data from user or props
  const card: MembershipCardData = customCardData || {
    cardId: user?.studentCardId || 'DZ-GLD-16-7842',
    holderName: user?.name || 'علاء الدين / علاء الدين',
    holderNameAr: user?.name || 'علاء الدين',
    role: user?.role || 'STUDENT_PAID',
    roleTitleAr:
      user?.role === 'AMBASSADOR'
        ? 'سفير المنصة'
        : user?.role === 'OWNER'
        ? 'المدير العام (المؤسس)'
        : user?.role === 'TEACHER'
        ? 'أستاذ معتمد'
        : user?.role === 'STUDENT_PAID'
        ? 'عضوية ذهبية'
        : 'طالب مسجل',
    roleTitleFr:
      user?.role === 'AMBASSADOR'
        ? 'Ambassadeur Officiel'
        : user?.role === 'OWNER'
        ? 'Directeur Général'
        : user?.role === 'TEACHER'
        ? 'Enseignant Agréé'
        : user?.role === 'STUDENT_PAID'
        ? 'Membre Gold'
        : 'Étudiant',
    roleTitleEn:
      user?.role === 'AMBASSADOR'
        ? 'Platform Ambassador'
        : user?.role === 'OWNER'
        ? 'General Manager'
        : user?.role === 'TEACHER'
        ? 'Certified Teacher'
        : user?.role === 'STUDENT_PAID'
        ? 'Golden Member'
        : 'Student',
    institutionName: user?.institutionName || 'جامعة العلوم والتكنولوجيا USTHB',
    wilayaCode: user?.wilayaCode || 16,
    wilayaName: user?.wilayaName || 'الجزائر العاصمة',
    issueDate: '2024/2025',
    expiryDate: '2026/09/30',
    isVerified: user?.isVerified ?? true,
    qrPayload: `https://dzprime.academy/verify/${user?.studentCardId || 'DZ-GLD-16-7842'}`,
    phone: user?.phone || '+213 661 23 45 67',
    email: user?.email || 'info@dzprime.academy',
  };

  // Generate dynamic QR Code for the card back
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dzprime.academy';
    const verifyUrl = `${origin}/verify/${card.cardId}`;
    
    QRCode.toDataURL(verifyUrl, {
      margin: 1,
      width: 180,
      color: {
        dark: '#000000',
        light: '#F5D061',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR code generation error', err));
  }, [card.cardId]);

  // Client-side HTML5 Canvas PNG Exporter
  const exportCardAsPng = async () => {
    setIsExporting(true);
    try {
      // Create high-res canvas (1200 x 760 px)
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 760;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = '#070B16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw luxury gold borders
      ctx.lineWidth = 14;
      const borderGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      borderGrad.addColorStop(0, '#D4AF37');
      borderGrad.addColorStop(0.5, '#FFF2B2');
      borderGrad.addColorStop(1, '#946608');
      ctx.strokeStyle = borderGrad;
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

      // Gold wave curves
      ctx.beginPath();
      ctx.moveTo(40, 600);
      ctx.bezierCurveTo(400, 520, 800, 720, 1160, 580);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#D4AF37';
      ctx.stroke();

      // Titles
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 44px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('DZ PRIME ACADEMY', canvas.width / 2, 140);

      ctx.fillStyle = '#E8CD57';
      ctx.font = 'bold 30px Arial, sans-serif';
      ctx.fillText('MEMBERSHIP CARD / بطاقة العضوية', canvas.width / 2, 200);

      // Member Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 50px Cairo, Arial, sans-serif';
      ctx.fillText(card.holderName, canvas.width / 2, 380);

      // Role and Status
      ctx.fillStyle = '#38BDF8';
      ctx.font = 'bold 36px Cairo, Arial, sans-serif';
      ctx.fillText(card.roleTitleAr, canvas.width / 2, 450);

      // ID and Institution
      ctx.fillStyle = '#D4AF37';
      ctx.font = '28px Arial, sans-serif';
      ctx.fillText(`ID: ${card.cardId}  |  Wilaya: ${card.wilayaCode} (${card.wilayaName})`, canvas.width / 2, 520);
      ctx.fillText(card.institutionName, canvas.width / 2, 570);

      // Official Stamp
      ctx.fillStyle = '#22C55E';
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.fillText('✓ CERTIFIED & VERIFIED ACADEMIC CREDENTIAL', canvas.width / 2, 670);

      // Convert to image download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `DZ_PRIME_CARD_${card.cardId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Export error', e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto select-none">
      {/* 3D Perspective Card Container */}
      <div
        className="w-full h-[280px] sm:h-[300px] cursor-pointer group [perspective:1200px]"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="relative w-full h-full [transform-style:preserve-3d] transition-all duration-700 rounded-2xl shadow-2xl"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
        >
          {/* ================= FRONT SIDE ================= */}
          <div
            ref={frontCardRef}
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden] border-2 border-gold-500/60 bg-gradient-to-br from-[#0B1224] via-[#060A14] to-[#04070F] shadow-gold-glow flex flex-col justify-between p-5 text-white"
          >
            {/* Background Texture & Light sheen */}
            <div className="absolute inset-0 bg-radial-glow opacity-60 pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-gold-400/10 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-dzBlue-neon/10 blur-2xl pointer-events-none" />

            {/* Top Bar: Brand & Verification Pill */}
            <div className="relative z-10 flex items-center justify-between w-full">
              <DzPrimeLogo size={36} showText={true} />
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-400/40 text-gold-300 text-xs font-semibold backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span>{card.isVerified ? t('card.verifiedBadge') : t('card.notVerified')}</span>
              </div>
            </div>

            {/* Center: Crest, Member Name, & Role */}
            <div className="relative z-10 flex flex-col items-center text-center my-auto">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-arabic tracking-wide drop-shadow-md">
                {card.holderName}
              </h2>
              <div className="mt-1 flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-md bg-gradient-to-r from-gold-600/30 via-gold-500/40 to-gold-600/30 border border-gold-400/60 text-gold-200 text-xs font-bold font-arabic shadow-sm">
                  {card.roleTitleAr}
                </span>
                <span className="text-[11px] text-gray-400 font-mono">
                  W.{card.wilayaCode} ({card.wilayaName})
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-1 max-w-[280px] truncate">
                {card.institutionName}
              </p>
            </div>

            {/* Bottom Metallic Curved Waves & Details */}
            <div className="relative z-10 flex items-end justify-between pt-2 border-t border-gold-500/30">
              <div className="flex flex-col">
                <span className="text-[9px] text-gold-400/80 uppercase font-semibold tracking-wider">
                  {t('card.cardId')}
                </span>
                <span className="font-mono text-xs font-bold text-gold-200 tracking-wider">
                  {card.cardId}
                </span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gold-400 uppercase tracking-widest font-bold">
                  MEMBERSHIP CARD
                </span>
                <span className="text-[11px] text-gold-300 font-arabic font-bold">
                  عضوية
                </span>
              </div>

              <div className="flex flex-col text-right">
                <span className="text-[9px] text-gold-400/80 uppercase font-semibold tracking-wider">
                  {t('card.validUntil')}
                </span>
                <span className="text-xs font-semibold text-gray-200">
                  {card.expiryDate}
                </span>
              </div>
            </div>
          </div>

          {/* ================= BACK SIDE ================= */}
          <div
            ref={backCardRef}
            className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-gold-500/60 bg-gradient-to-r from-gold-500 via-gold-400 to-navy-950 shadow-gold-glow flex text-navy-950 p-0"
          >
            {/* Left 60%: Gold Metallic Half */}
            <div className="w-[60%] h-full p-4 flex flex-col justify-between bg-gradient-to-br from-gold-300 via-gold-400 to-gold-500 text-navy-950">
              <div>
                <h3 className="text-sm font-extrabold font-arabic text-navy-950">
                  {card.holderName}
                </h3>
                <p className="text-xs font-bold text-navy-900/90 font-arabic flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-navy-950" />
                  {card.roleTitleAr}
                </p>
              </div>

              {/* Official Algerian Channels */}
              <div className="space-y-1.5 text-[10px] font-medium text-navy-900">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-navy-950 shrink-0" />
                  <span dir="ltr" className="font-mono font-semibold">{card.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-navy-950 shrink-0" />
                  <span className="truncate">{card.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-navy-950 shrink-0" />
                  <span>www.dzprime.academy</span>
                </div>
              </div>

              <div className="text-[9px] font-bold text-navy-900 border-t border-navy-900/20 pt-1">
                منصة تعليمية جزائرية متكاملة
              </div>
            </div>

            {/* Right 40%: Obsidian Half with QR Code */}
            <div className="w-[40%] h-full bg-[#070B16] p-3 flex flex-col items-center justify-between text-center relative border-l border-gold-400/40">
              <DzPrimeLogo size={24} showText={false} withGlow={false} />

              <div className="p-1.5 rounded-xl bg-gold-400 shadow-inner flex items-center justify-center">
                {qrCodeDataUrl ? (
                  <img
                    src={qrCodeDataUrl}
                    alt="Card QR"
                    className="w-20 h-20 rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gold-500 animate-pulse rounded-lg" />
                )}
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[8px] text-gold-300 font-mono tracking-wider font-bold">
                  {card.cardId}
                </span>
                <span className="text-[7px] text-gray-400 mt-0.5">
                  SCAN TO VERIFY
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-4 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 border border-gold-500/30 text-gold-300 hover:text-gold-200 text-xs font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isFlipped ? 'rotate-180' : ''} transition-transform duration-500`} />
          <span>{isFlipped ? t('card.front') : t('card.back')}</span>
        </button>

        {allowExport && (
          <button
            onClick={exportCardAsPng}
            disabled={isExporting}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 text-xs font-bold flex items-center gap-2 transition-all shadow-gold-glow hover:shadow-gold-glow-lg active:scale-95 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? t('card.generatingPng') : t('card.downloadPng')}</span>
          </button>
        )}

        <a
          href={`/${locale}/verify/${card.cardId}`}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-xl bg-dzBlue-dark hover:bg-dzBlue border border-dzBlue-neon/40 text-dzBlue-neon text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{t('card.verifyCard')}</span>
        </a>
      </div>

      <p className="text-[11px] text-gray-400 text-center font-arabic">
        💡 {t('card.flipInstruction')}
      </p>
    </div>
  );
};
