'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  withGlow?: boolean;
}

export const DzPrimeLogo: React.FC<LogoProps> = ({
  size = 48,
  className = '',
  showText = true,
  withGlow = true,
}) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {withGlow && (
          <div
            className="absolute inset-0 rounded-full bg-gold-500/25 blur-md animate-pulse-slow pointer-events-none"
            style={{ transform: 'scale(1.2)' }}
          />
        )}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full relative z-10 drop-shadow-[0_2px_10px_rgba(212,175,55,0.5)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="goldLinear" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2B2" />
              <stop offset="35%" stopColor="#F5D061" />
              <stop offset="70%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#8A5A00" />
            </linearGradient>

            <linearGradient id="blueGlowLinear" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>

            <radialGradient id="ringGlow" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </radialGradient>

            <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#D4AF37" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Outer Glowing Energy Rings */}
          <circle cx="100" cy="100" r="92" stroke="url(#goldLinear)" strokeWidth="2.5" opacity="0.4" />
          <circle cx="100" cy="100" r="86" stroke="url(#ringGlow)" strokeWidth="2" strokeDasharray="6 4" opacity="0.7" />
          <circle cx="100" cy="100" r="80" stroke="url(#goldLinear)" strokeWidth="4" filter="url(#goldShadow)" />

          {/* Inner Dark Background */}
          <circle cx="100" cy="100" r="77" fill="#070B16" />

          {/* Tree of Knowledge & Face Profile Combined */}
          {/* Tree Trunk & Roots - Golden */}
          <path
            d="M96 148 C96 128 84 116 80 102 C76 88 84 76 98 70 C108 65 116 72 120 84 C124 96 116 108 112 118 C108 128 106 138 104 148 Z"
            fill="url(#goldLinear)"
          />
          <path
            d="M92 148 C86 154 74 156 68 152 M108 148 C114 154 126 156 132 152"
            stroke="url(#goldLinear)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Silhouette Profile on the Right */}
          <path
            d="M120 62 C134 66 144 76 146 88 C148 94 143 97 146 102 C149 107 144 112 142 116 C140 120 144 126 138 132"
            stroke="url(#goldLinear)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Foliage - Blue Crystals / Diamond Leaves */}
          <path d="M100 40 L108 52 L100 64 L92 52 Z" fill="url(#blueGlowLinear)" stroke="url(#goldLinear)" strokeWidth="1" />
          <path d="M78 48 L86 58 L78 68 L70 58 Z" fill="url(#blueGlowLinear)" stroke="url(#goldLinear)" strokeWidth="1" />
          <path d="M122 48 L130 58 L122 68 L114 58 Z" fill="url(#blueGlowLinear)" stroke="url(#goldLinear)" strokeWidth="1" />
          <path d="M60 66 L68 76 L60 86 L52 76 Z" fill="url(#blueGlowLinear)" stroke="url(#goldLinear)" strokeWidth="1" />
          <path d="M140 66 L148 76 L140 86 L132 76 Z" fill="url(#blueGlowLinear)" stroke="url(#goldLinear)" strokeWidth="1" />

          {/* Open Books on Tree Branches */}
          <g transform="translate(68, 76) scale(0.65)">
            <path d="M0 8 Q12 2 24 8 Q36 2 48 8 L48 24 Q36 18 24 24 Q12 18 0 24 Z" fill="url(#goldLinear)" />
            <path d="M24 8 L24 24" stroke="#070B16" strokeWidth="1.5" />
          </g>
          <g transform="translate(102, 76) scale(0.65)">
            <path d="M0 8 Q12 2 24 8 Q36 2 48 8 L48 24 Q36 18 24 24 Q12 18 0 24 Z" fill="url(#goldLinear)" />
            <path d="M24 8 L24 24" stroke="#070B16" strokeWidth="1.5" />
          </g>

          {/* Lower Banner Plaque */}
          <path
            d="M38 160 L162 160 L152 180 L48 180 Z"
            fill="#060913"
            stroke="url(#goldLinear)"
            strokeWidth="2"
          />
          <text
            x="100"
            y="173"
            textAnchor="middle"
            fill="url(#goldLinear)"
            fontSize="10"
            fontWeight="bold"
            letterSpacing="2"
            fontFamily="Arial, sans-serif"
          >
            ACADEMY
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wider bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-transparent text-lg md:text-xl font-sans drop-shadow-sm">
            DZ PRIME
          </span>
          <span className="text-[10px] tracking-[0.25em] text-gold-400/90 uppercase font-semibold">
            ACADEMY
          </span>
        </div>
      )}
    </div>
  );
};
