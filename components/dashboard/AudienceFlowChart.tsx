'use client';

import React, { useState } from 'react';
import { AnalyticsSummary } from '@/lib/types';
import { ChevronRight } from 'lucide-react';

interface AudienceFlowProps {
  analytics: AnalyticsSummary;
}

export default function AudienceFlowChart({ analytics }: AudienceFlowProps) {
  const [selectedDay, setSelectedDay] = useState('FR');

  const days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  const hourlyPoints = [
    { hour: '15:00', height: 42, active: false },
    { hour: '16:00', height: 60, active: false },
    { hour: '17:00', height: 48, active: false },
    { hour: '18:00', height: 82, active: false },
    { hour: '19:00', height: 92, active: true, label: '73%' },
    { hour: '20:00', height: 55, active: false },
  ];

  return (
    <div className="bg-pastel-rose rounded-4xl p-5 md:p-6 border border-pastel-rose-border shadow-soft relative overflow-hidden transition-all duration-200 hover:shadow-card">
      {/* Top Header Row matching Screen 3 */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-black text-charcoal leading-tight">
            Audience Flow
          </h3>
          <p className="text-[11px] text-charcoal/70 font-semibold mt-0.5">
            Hourly engagement and tap flow
          </p>
        </div>

        <button className="flex items-center gap-1 text-xs font-bold text-charcoal bg-white/70 hover:bg-white px-3.5 py-1.5 rounded-full border border-white/70 shadow-xs transition-colors">
          <span>Filter</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Days of the Week Pills: MO, TU, WE, TH, FR, SA, SU */}
      <div className="flex items-center justify-between gap-1.5 py-2">
        {days.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`w-9 h-9 rounded-full text-xs font-black transition-all flex items-center justify-center ${
                isSelected
                  ? 'bg-[#1A1B1F] text-white shadow-md scale-105'
                  : 'bg-white/70 text-charcoal/75 hover:bg-white'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* 73% Peak Badge with Vertical Hatched Bar matching image */}
      <div className="flex justify-end items-baseline gap-1 mt-3 mb-1 pr-6">
        <span className="text-2xl font-black text-charcoal tracking-tight">73%</span>
        <span className="text-[10px] font-bold text-charcoal/70 uppercase tracking-wider">
          Peak
        </span>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full h-44 bg-white/30 rounded-3xl p-4 flex flex-col justify-end border border-white/50 overflow-hidden">
        {/* Horizontal baseline */}
        <div className="absolute inset-x-0 bottom-10 h-px border-b border-dashed border-charcoal/15" />

        <div className="flex items-end justify-between h-28 relative z-10 px-2">
          {hourlyPoints.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 h-full justify-end group relative">
              {item.active && (
                <>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#1A1B1F] text-white shadow-md mb-1 z-10">
                    {item.label}
                  </span>
                  {/* Hatched benchmark silhouette behind the active bar */}
                  <div 
                    className="absolute bottom-6 w-8 sm:w-10 h-28 border border-dashed border-[#1A1B1F]/30 bg-white/20 rounded-t-xl -z-0 pointer-events-none"
                    style={{
                      backgroundImage: 'repeating-linear-gradient(45deg, rgba(26,27,31,0.06), rgba(26,27,31,0.06) 4px, transparent 4px, transparent 8px)'
                    }}
                  />
                </>
              )}
              <div
                style={{ height: `${item.height}%` }}
                className={`w-6 sm:w-7 rounded-t-xl transition-all duration-300 relative z-10 ${
                  item.active
                    ? 'bg-[#1A1B1F]'
                    : 'bg-[#1A1B1F]/20 group-hover:bg-[#1A1B1F]/30'
                }`}
              />
              <span className="text-[9px] sm:text-[10px] font-bold text-charcoal/60">
                {item.hour}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
