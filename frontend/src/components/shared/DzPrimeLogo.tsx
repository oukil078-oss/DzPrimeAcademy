'use client';

import React from 'react';
import Image from 'next/image';
import { useTheme } from '@/lib/theme';

export type LogoVariant = 'auto' | 'dark' | 'light' | 'amber' | 'blue';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  withGlow?: boolean;
  variant?: LogoVariant;
}

export const DzPrimeLogo: React.FC<LogoProps> = ({
  size = 48,
  className = '',
  showText = true,
  withGlow = true,
  variant = 'auto',
}) => {
  const { theme, mounted } = useTheme();

  // Determine active variant:
  // First logo (amber/gold) for dark mode or explicit amber/dark
  // Second logo (blue) for light mode or explicit blue/light
  const isDarkEffective =
    variant === 'amber' ||
    variant === 'dark' ||
    (variant === 'auto' && (!mounted || theme === 'dark'));

  const logoSrc = isDarkEffective
    ? '/images/dzprime-logo-amber.png'
    : '/images/dzprime-logo-blue.png';

  const glowColor = isDarkEffective ? 'bg-amber-500/30' : 'bg-blue-500/30';
  const shadowFilter = isDarkEffective
    ? 'drop-shadow-[0_3px_12px_rgba(212,175,55,0.45)]'
    : 'drop-shadow-[0_3px_12px_rgba(37,99,235,0.45)]';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {withGlow && (
          <div
            className={`absolute inset-0 rounded-full ${glowColor} blur-md animate-pulse-slow pointer-events-none`}
            style={{ transform: 'scale(1.15)' }}
          />
        )}
        <div className={`relative z-10 w-full h-full flex items-center justify-center ${shadowFilter}`}>
          <Image
            src={logoSrc}
            alt="DZ PRIME ACADEMY"
            width={size * 2}
            height={size * 2}
            className="w-full h-full object-contain select-none"
            priority
          />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col select-none">
          <span
            className={`font-black tracking-wider text-base sm:text-lg font-sans leading-tight ${
              isDarkEffective
                ? 'bg-gradient-to-r from-[#FFF0A0] via-[#F5D061] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-sm'
                : 'bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 dark:from-sky-300 dark:via-blue-300 dark:to-indigo-200 bg-clip-text text-transparent'
            }`}
          >
            DZ PRIME
          </span>
          <span
            className={`text-[9px] sm:text-[10px] tracking-[0.25em] font-bold uppercase ${
              isDarkEffective
                ? 'text-[#F5D061]/90'
                : 'text-blue-600 dark:text-sky-300/90'
            }`}
          >
            ACADEMY
          </span>
        </div>
      )}
    </div>
  );
};
