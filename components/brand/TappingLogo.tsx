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
  const getScale = () => {
    switch (size) {
      case 'xs': return { text: 'text-sm font-black tracking-tight', dot: 'w-1 h-1', badge: 'text-[8px] px-1.5 py-0.2' };
      case 'sm': return { text: 'text-base font-black tracking-tight', dot: 'w-1.5 h-1.5', badge: 'text-[9px] px-2 py-0.5' };
      case 'md': return { text: 'text-xl font-black tracking-tight', dot: 'w-2 h-2', badge: 'text-[9px] px-2 py-0.5' };
      case 'lg': return { text: 'text-2xl font-black tracking-tight', dot: 'w-2.5 h-2.5', badge: 'text-[10px] px-2.5 py-0.5' };
      case 'xl': return { text: 'text-4xl font-black tracking-tight', dot: 'w-3 h-3', badge: 'text-xs px-3 py-1' };
    }
  };

  const scale = getScale();

  // Pure Apple-grade typographic brand mark
  return (
    <div className={`inline-flex items-center gap-1.5 select-none ${className}`}>
      <span className={`${scale.text} text-charcoal font-black tracking-[-0.035em] transition-colors`}>
        Tapping
      </span>
      <span className={`${scale.dot} rounded-full bg-[#141518] inline-block mb-1 shrink-0`} />

      {showBadge && (
        <span className={`ml-1 font-mono font-black ${scale.badge} rounded-full bg-[#FAF7F2] text-charcoal border border-black/10 uppercase tracking-wider`}>
          PRO
        </span>
      )}
    </div>
  );
}
