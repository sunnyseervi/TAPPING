'use client';

import React from 'react';

interface IndianFlagProps {
  className?: string;
  width?: number | string;
  height?: number | string;
  rounded?: boolean;
}

export default function IndianFlag({
  className = 'w-6 h-4',
  width,
  height,
  rounded = true,
}: IndianFlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 20"
      width={width}
      height={height}
      className={`${className} ${rounded ? 'rounded-xs shadow-2xs' : ''} shrink-0 inline-block align-middle`}
      aria-label="Flag of India"
    >
      {/* Saffron Top Stripe */}
      <rect width="30" height="6.67" fill="#FF9933" />
      
      {/* White Middle Stripe */}
      <rect y="6.67" width="30" height="6.67" fill="#FFFFFF" />
      
      {/* India Green Bottom Stripe */}
      <rect y="13.33" width="30" height="6.67" fill="#138808" />
      
      {/* Ashoka Chakra (Navy Blue) */}
      <circle cx="15" cy="10" r="2.8" fill="none" stroke="#000080" strokeWidth="0.5" />
      <circle cx="15" cy="10" r="0.6" fill="#000080" />
      
      {/* 24 Radiating Spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        const x2 = 15 + 2.8 * Math.cos(angle);
        const y2 = 10 + 2.8 * Math.sin(angle);
        return (
          <line
            key={i}
            x1="15"
            y1="10"
            x2={x2}
            y2={y2}
            stroke="#000080"
            strokeWidth="0.25"
          />
        );
      })}
    </svg>
  );
}
