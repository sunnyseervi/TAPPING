'use client';

import React from 'react';

interface TappingLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full' | 'markOnly';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  showBadge?: boolean;
}

export default function TappingLogo({
  size = 'md',
  variant = 'full',
  theme = 'auto',
  className = '',
  showBadge = false,
}: TappingLogoProps) {
  const getDimensions = () => {
    switch (size) {
      case 'xs': return { box: 24, iconSize: 16, text: 'text-sm', badge: 'text-[8px] px-1.5 py-0.2' };
      case 'sm': return { box: 32, iconSize: 20, text: 'text-base', badge: 'text-[9px] px-2 py-0.5' };
      case 'md': return { box: 40, iconSize: 24, text: 'text-lg', badge: 'text-[9px] px-2 py-0.5' };
      case 'lg': return { box: 48, iconSize: 30, text: 'text-xl', badge: 'text-[10px] px-2.5 py-0.5' };
      case 'xl': return { box: 64, iconSize: 40, text: 'text-3xl', badge: 'text-xs px-3 py-1' };
    }
  };

  const dim = getDimensions();

  // Bespoke Vector Icon:
  // Combines a sleek metallic top crossbar with dual aerodynamic NFC frequency beams 
  // interlocking to form a precision geometric "T" symbol.
  const LogoIcon = (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-2xl bg-[#141518] text-white shadow-sm overflow-hidden border border-[#2D3036] transition-transform hover:scale-105 select-none`}
      style={{ width: dim.box, height: dim.box }}
    >
      {/* Subtle interior metallic lighting reflex */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/40 pointer-events-none" />
      
      <svg
        width={dim.iconSize}
        height={dim.iconSize}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
      >
        {/* Top Horizontal Precision Bar */}
        <path
          d="M4 7C4 5.89543 4.89543 5 6 5H26C27.1046 5 28 5.89543 28 7V9C28 10.1046 27.1046 11 26 11H6C4.89543 11 4 10.1046 4 9V7Z"
          fill="url(#topBarGradient)"
        />

        {/* Central Vertical Stem */}
        <path
          d="M13.5 11H18.5V25C18.5 26.1046 17.6046 27 16.5 27H15.5C14.3954 27 13.5 26.1046 13.5 25V11Z"
          fill="url(#stemGradient)"
        />

        {/* Left Wireless Contactless Arc (Inner Beam) */}
        <path
          d="M9.5 14.5C8.2 16.2 7.5 18.2 7.5 20.5C7.5 22.8 8.2 24.8 9.5 26.5"
          stroke="#4F83FF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Right Wireless Contactless Arc (Outer Beam) */}
        <path
          d="M22.5 14.5C23.8 16.2 24.5 18.2 24.5 20.5C24.5 22.8 23.8 24.8 22.5 26.5"
          stroke="#B6F554"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Central Encrypted Smart Core Dot */}
        <circle cx="16" cy="18" r="1.5" fill="#FDF166" />

        <defs>
          <linearGradient id="topBarGradient" x1="4" y1="5" x2="28" y2="11" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#E2E5EA" />
            <stop offset="1" stopColor="#9AA0A6" />
          </linearGradient>
          <linearGradient id="stemGradient" x1="13.5" y1="11" x2="18.5" y2="27" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="0.5" stopColor="#CCD2DA" />
            <stop offset="1" stopColor="#80868B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (variant === 'icon' || variant === 'markOnly') {
    return <div className={`inline-flex items-center ${className}`}>{LogoIcon}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {LogoIcon}
      <div className="flex items-center gap-1.5">
        <span
          className={`font-black tracking-tight font-sans ${dim.text} ${
            theme === 'light'
              ? 'text-white'
              : theme === 'dark'
              ? 'text-charcoal'
              : 'text-charcoal dark:text-white'
          }`}
        >
          TAPPING
        </span>
        {showBadge && (
          <span
            className={`font-black rounded-full bg-[#FDF166] text-[#141518] border border-black/10 tracking-wider ${dim.badge}`}
          >
            PRO
          </span>
        )}
      </div>
    </div>
  );
}
