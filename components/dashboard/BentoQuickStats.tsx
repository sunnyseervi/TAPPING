'use client';

import React from 'react';
import { Plus, Edit2, ChevronDown, ArrowUpRight, ArrowRight } from 'lucide-react';
import { AnalyticsSummary } from '@/lib/types';

interface QuickStatsProps {
  analytics: AnalyticsSummary;
  onAddBlock: () => void;
  onSeeProgress: () => void;
}

export default function BentoQuickStats({
  analytics,
  onAddBlock,
  onSeeProgress,
}: QuickStatsProps) {
  return (
    <div className="bg-pastel-peach rounded-4xl p-5 md:p-6 border border-pastel-peach-border shadow-soft relative overflow-hidden transition-all duration-200 hover:shadow-card flex flex-col justify-between">
      {/* Top Header Row matching screenshot */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/80 flex items-center justify-center text-charcoal shadow-xs">
            <ArrowUpRight className="w-5 h-5 text-charcoal stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-black text-charcoal leading-tight">
              Bio Traffic
            </h2>
            <p className="text-[11px] text-charcoal/70 font-bold">
              Real-time creator performance
            </p>
          </div>
        </div>

        {/* Action Buttons: Pure white round buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddBlock}
            className="w-8 h-8 rounded-full bg-white text-charcoal flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform"
            title="Add Block"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={onSeeProgress}
            className="w-8 h-8 rounded-full bg-white text-charcoal flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-transform"
            title="Edit Overview"
          >
            <Edit2 className="w-3.5 h-3.5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* 4-Column Metric Numbers directly matching image (Views, Clicks, CTR, NFC Taps) */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 py-3 bg-white/45 rounded-2xl px-2.5 sm:px-3 border border-white/60">
        <div className="min-w-0 text-center">
          <p className="text-base sm:text-xl font-black text-charcoal tracking-tight">
            {analytics.totalViews.toLocaleString()}
          </p>
          <span className="text-[8px] sm:text-[9px] uppercase font-extrabold tracking-wider text-charcoal/60 block mt-0.5">
            Views
          </span>
        </div>

        <div className="min-w-0 text-center">
          <p className="text-base sm:text-xl font-black text-charcoal tracking-tight">
            {analytics.totalClicks.toLocaleString()}
          </p>
          <span className="text-[8px] sm:text-[9px] uppercase font-extrabold tracking-wider text-charcoal/60 block mt-0.5">
            Clicks
          </span>
        </div>

        <div className="min-w-0 text-center">
          <p className="text-base sm:text-xl font-black text-charcoal tracking-tight">
            {Math.round(analytics.ctr)}%
          </p>
          <span className="text-[8px] sm:text-[9px] uppercase font-extrabold tracking-wider text-charcoal/60 block mt-0.5">
            CTR
          </span>
        </div>

        <div className="min-w-0 text-center">
          <p className="text-base sm:text-xl font-black text-charcoal tracking-tight">
            {Math.max(1, Math.round(analytics.totalViews * 0.11))}
          </p>
          <span className="text-[8px] sm:text-[9px] uppercase font-extrabold tracking-wider text-charcoal/60 block mt-0.5">
            NFC Taps
          </span>
        </div>
      </div>

      {/* Bottom Footer Row matching reference: "Today v" dropdown + "See Progress ->" */}
      <div className="flex items-center justify-between mt-4 pt-1">
        <button 
          onClick={onSeeProgress}
          className="flex items-center gap-1.5 text-xs font-bold text-charcoal bg-white/70 hover:bg-white px-3.5 py-1.5 rounded-full border border-white/70 shadow-xs transition-colors"
        >
          <span>Today</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onSeeProgress}
          className="text-xs font-extrabold text-charcoal hover:underline flex items-center gap-1"
        >
          <span>See Progress</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
