'use client';

import React from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';

interface ProgressRingProps {
  percentage?: number;
  totalTaps?: number;
  onExplore?: () => void;
}

export default function BentoProgressRing({
  percentage = 95,
  totalTaps = 128,
  onExplore,
}: ProgressRingProps) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-pastel-lavender rounded-4xl p-5 md:p-6 border border-pastel-lavender-border shadow-soft relative overflow-hidden transition-all duration-200 hover:shadow-card flex flex-col justify-between">
      {/* Top Header Row matching screenshot */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center text-charcoal shadow-xs">
            <ArrowUpRight className="w-5 h-5 text-charcoal stroke-[2.5]" />
          </div>
          <span className="text-base font-black text-charcoal">Your Progress</span>
        </div>

        <button 
          onClick={onExplore}
          className="flex items-center gap-1.5 text-xs font-bold text-charcoal bg-white/70 hover:bg-white px-3.5 py-1.5 rounded-full border border-white/70 shadow-xs transition-colors"
        >
          <span>All Channels</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Content: Big 95% on left + Circular Ring on right */}
      <div className="flex items-center justify-between my-2">
        <div>
          <p className="text-5xl md:text-6xl font-black text-charcoal tracking-tight">
            {percentage}%
          </p>
          <div className="mt-1 text-xs font-bold text-charcoal/70">
            <span>High Conversion Setup</span>
          </div>
        </div>

        {/* Circular Progress Gauge directly matching image */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="rgba(255, 255, 255, 0.7)"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="56"
              cy="56"
              r={radius}
              stroke="#1A1B1F"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-black text-charcoal leading-none">
              95%
            </span>
            <span className="text-[9px] font-extrabold text-charcoal/60 uppercase tracking-widest mt-0.5">
              Optimized
            </span>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-charcoal/70 font-semibold mt-1">
        vCard 3.0 export, permanent QR, and 5 link blocks fully active.
      </p>
    </div>
  );
}
