'use client';

import React from 'react';
import { AnalyticsSummary, LinkBlock } from '@/lib/types';
import { TrendingUp, MousePointer, Globe, Zap } from 'lucide-react';

interface AnalyticsViewProps {
  analytics: AnalyticsSummary;
  links: LinkBlock[];
}

export default function AnalyticsView({ analytics, links }: AnalyticsViewProps) {
  return (
    <div className="bg-white rounded-4xl p-5 md:p-6 border border-black/5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/5">
        <div>
          <h2 className="text-lg font-extrabold text-charcoal">Real Time Analytics and Traffic</h2>
          <p className="text-xs text-charcoal-muted">
            Track taps, scans, click through rates, and device metrics with precision
          </p>
        </div>
        <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-pastel-mint text-charcoal border border-pastel-mint-border flex items-center gap-1.5 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Tracking</span>
        </span>
      </div>

      {/* Top 3 KPI Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 my-5">
        <div className="p-4 rounded-3xl bg-pastel-peach-light border border-pastel-peach-border">
          <span className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block">
            Total Views
          </span>
          <p className="text-3xl font-black text-charcoal mt-1">
            {analytics.totalViews.toLocaleString()}
          </p>
          <p className="text-[11px] text-charcoal/60 mt-1 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> 18.4% growth this month
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-pastel-lavender-light border border-pastel-lavender-border">
          <span className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block">
            Link Clicks
          </span>
          <p className="text-3xl font-black text-charcoal mt-1">
            {analytics.totalClicks.toLocaleString()}
          </p>
          <p className="text-[11px] text-charcoal/60 mt-1 flex items-center gap-1 font-medium">
            <MousePointer className="w-3.5 h-3.5 text-indigo-600" /> Active engagement
          </p>
        </div>

        <div className="p-4 rounded-3xl bg-pastel-yellow-light border border-pastel-yellow-border">
          <span className="text-xs font-bold text-charcoal/70 uppercase tracking-wider block">
            Click Through Rate
          </span>
          <p className="text-3xl font-black text-charcoal mt-1">
            {analytics.ctr}%
          </p>
          <p className="text-[11px] text-charcoal/60 mt-1 flex items-center gap-1 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-600" /> High conversion
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 text-xs">
        {/* Top Performing Links */}
        <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/5">
          <h3 className="font-extrabold text-charcoal text-sm mb-3">Top Performing Blocks</h3>
          <div className="flex flex-col gap-2.5">
            {links.map((link) => {
              const maxClicks = Math.max(...links.map((l) => l.clickCount), 1);
              const percentage = Math.round((link.clickCount / maxClicks) * 100);
              return (
                <div key={link.id} className="bg-white p-2.5 rounded-2xl border border-black/5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-charcoal truncate max-w-[200px]">
                      {link.title}
                    </span>
                    <span className="font-mono font-bold text-charcoal">
                      {link.clickCount} clicks
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-pastel-peach-dark rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Channels & Devices */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/5">
            <h3 className="font-extrabold text-charcoal text-sm mb-2.5">Traffic Sources</h3>
            <div className="space-y-2">
              {analytics.referrers.map((r, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-charcoal/80 font-medium">{r.source}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-black/5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${r.percentage}%` }}
                        className="h-full bg-charcoal rounded-full"
                      />
                    </div>
                    <span className="font-mono font-bold text-charcoal w-8 text-right">
                      {r.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/5">
            <h3 className="font-extrabold text-charcoal text-sm mb-2.5">Device Distribution</h3>
            <div className="space-y-2">
              {analytics.devices.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-charcoal/80 font-medium">{d.device}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-black/5 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${d.percentage}%` }}
                        className="h-full bg-pastel-sky-dark rounded-full"
                      />
                    </div>
                    <span className="font-mono font-bold text-charcoal w-8 text-right">
                      {d.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
