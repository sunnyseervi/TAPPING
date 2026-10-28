'use client';

import React from 'react';
import { 
  ArrowUpRight, 
  CreditCard, 
  Eye, 
  Link as LinkIcon, 
  MousePointerClick, 
  TrendingUp,
  BarChart3,
  ExternalLink,
  Sparkles,
  QrCode
} from 'lucide-react';
import { AnalyticsSummary, LinkBlock, Profile, StoreConfig } from '@/lib/types';

interface CreatorDashboardProps {
  profile: Profile;
  links: LinkBlock[];
  store?: StoreConfig;
  analytics: AnalyticsSummary;
  onSelectTab: (tab: string) => void;
}

export default function CreatorDashboard({ 
  profile, 
  links, 
  analytics, 
  onSelectTab 
}: CreatorDashboardProps) {
  const activeLinks = links.filter((link) => link.isActive);
  const totalClicks = links.reduce((sum, link) => sum + (link.clickCount || 0), 0);
  const totalViews = analytics.totalViews || 0;
  const ctr = totalViews > 0 ? Number(((totalClicks / totalViews) * 100).toFixed(1)) : 0.0;

  // Sorted links by popularity (most clicks first)
  const rankedLinks = [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));

  const profileUrl = `/${profile.username}`;

  const copy = async (value: string, label: string) => {
    const absoluteUrl = new URL(value, window.location.origin).href;
    await navigator.clipboard.writeText(absoluteUrl);
    window.dispatchEvent(new CustomEvent('tapping-toast', { 
      detail: { title: `${label} copied`, message: absoluteUrl, type: 'success' } 
    }));
  };

  const creatorName = (profile.displayName && profile.displayName !== 'Aarav Sharma') 
    ? profile.displayName 
    : (profile.username || 'Creator');

  return (
    <section className="space-y-4 sm:space-y-6 text-left">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-4xl border border-black/10 bg-white p-6 sm:p-8 shadow-soft">
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/40 sm:text-xs">
              Creator Space
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-charcoal">
              Welcome back, {creatorName}
            </h1>
            <p className="mt-1.5 max-w-xl text-xs sm:text-sm font-medium text-charcoal/60 leading-relaxed">
              Real-time analytics and telemetry for your public link-in-bio page and smart contactless NFC hardware.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button 
              onClick={() => onSelectTab('profile')} 
              className="rounded-2xl border border-black/10 bg-[#FAF7F2] hover:bg-black/5 px-4 py-3 text-xs font-black text-charcoal shadow-2xs transition-all cursor-pointer"
            >
              Edit Profile &amp; Bio
            </button>
            <button 
              onClick={() => onSelectTab('nfc')} 
              className="rounded-2xl bg-[#141518] hover:bg-black px-4 py-3 text-xs font-black text-white shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <CreditCard className="w-3.5 h-3.5 text-[#FDF166]" />
              <span>Metal NFC Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Primary KPI Metrics Cards (No Store Visits, No WhatsApp) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Profile Visits */}
        <div className="rounded-3xl border border-black/8 bg-white p-5 sm:p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-charcoal/50">
              Profile Visits
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#EFF4FF] text-[#4F83FF] flex items-center justify-center shadow-2xs">
              <Eye className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-3 text-3xl sm:text-4xl font-black text-charcoal tracking-tight">
            {analytics.totalViews.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs font-semibold text-charcoal/50">
            Total unique page impressions
          </p>
        </div>

        {/* Link Clicks */}
        <div className="rounded-3xl border border-black/8 bg-white p-5 sm:p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-charcoal/50">
              Link Clicks
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#FDF166] text-charcoal flex items-center justify-center shadow-2xs">
              <MousePointerClick className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-3 text-3xl sm:text-4xl font-black text-charcoal tracking-tight">
            {totalClicks.toLocaleString('en-IN')}
          </p>
          <p className="mt-1 text-xs font-semibold text-charcoal/50">
            Across all published active blocks
          </p>
        </div>

        {/* Overall Engagement Rate (CTR) */}
        <div className="rounded-3xl border border-black/8 bg-white p-5 sm:p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-charcoal/50">
              Engagement CTR
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#B6F554] text-charcoal flex items-center justify-center shadow-2xs">
              <TrendingUp className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-3 text-3xl sm:text-4xl font-black text-charcoal tracking-tight">
            {ctr}%
          </p>
          <p className="mt-1 text-xs font-semibold text-charcoal/50">
            Click-through conversion rate
          </p>
        </div>
      </div>

      {/* Main Content Grid: Live Bio Link & Comprehensive Link Telemetry */}
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-12">
        {/* Left Column: Published Bio URL & Quick Links */}
        <div className="space-y-4 rounded-4xl border border-black/10 bg-white p-5 sm:p-7 shadow-soft xl:col-span-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-charcoal">Public Bio Page</h2>
            <LinkIcon className="h-4 w-4 text-charcoal/35" />
          </div>

          <div className="rounded-3xl border border-black/8 bg-[#FAF7F2] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-black text-charcoal">tapping.bio/{profile.username}</p>
                <p className="text-[11px] font-semibold text-charcoal/50 mt-0.5">
                  {activeLinks.length} active links published
                </p>
              </div>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Live
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button 
                onClick={() => copy(profileUrl, 'Public Profile URL')} 
                className="flex-1 py-2.5 rounded-2xl bg-white hover:bg-black/5 text-charcoal font-black text-xs border border-black/10 shadow-2xs transition-colors cursor-pointer"
              >
                Copy Link
              </button>
              <a 
                href={profileUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="px-4 py-2.5 rounded-2xl bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <span>View</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FDF166]" />
              </a>
            </div>
          </div>

          {/* Quick Hub Navigation */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button 
              onClick={() => onSelectTab('nfc')} 
              className="p-4 rounded-3xl bg-[#FAF7F2] hover:bg-black/5 border border-black/8 text-left transition-all cursor-pointer flex flex-col justify-between"
            >
              <CreditCard className="w-5 h-5 text-charcoal" />
              <div className="mt-3">
                <p className="text-xs font-black text-charcoal">Metal NFC Studio</p>
                <p className="text-[10px] text-charcoal/50 mt-0.5">Custom hardware blueprints</p>
              </div>
            </button>

            <button 
              onClick={() => onSelectTab('profile')} 
              className="p-4 rounded-3xl bg-[#FAF7F2] hover:bg-black/5 border border-black/8 text-left transition-all cursor-pointer flex flex-col justify-between"
            >
              <BarChart3 className="w-5 h-5 text-[#4F83FF]" />
              <div className="mt-3">
                <p className="text-xs font-black text-charcoal">Edit Links &amp; Themes</p>
                <p className="text-[10px] text-charcoal/50 mt-0.5">Customize appearance</p>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Link Telemetry & Click Rankings */}
        <div className="rounded-4xl border border-black/10 bg-white p-5 sm:p-7 shadow-soft xl:col-span-7">
          <div className="flex items-center justify-between pb-3 border-b border-black/5">
            <div>
              <h2 className="text-base font-black text-charcoal">Link Traffic &amp; Openings</h2>
              <p className="text-xs font-semibold text-charcoal/50 mt-0.5">
                Which links your audience clicks on most
              </p>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#FAF7F2] text-charcoal border border-black/10">
              {links.length} total blocks
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {rankedLinks.length === 0 ? (
              <div className="p-8 rounded-3xl bg-[#FAF7F2] text-center text-xs font-bold text-charcoal/50">
                No links added yet. Click &quot;Edit Profile &amp; Bio&quot; to add your first link.
              </div>
            ) : (
              rankedLinks.map((link, idx) => {
                const clicks = link.clickCount || 0;
                const percentage = totalClicks > 0 ? Math.round((clicks / totalClicks) * 100) : 0;
                const isTop = idx === 0 && clicks > 0;

                return (
                  <div 
                    key={link.id} 
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isTop 
                        ? 'bg-[#EFF4FF]/40 border-[#4F83FF]/30 shadow-2xs' 
                        : 'bg-[#FAF7F2] border-black/5'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black text-charcoal/40">
                          #{idx + 1}
                        </span>
                        <p className="truncate text-xs font-black text-charcoal">
                          {link.title}
                        </p>
                        {isTop && (
                          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#4F83FF] text-white shrink-0">
                            Most Opened
                          </span>
                        )}
                        {!link.isActive && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/5 text-charcoal/50 shrink-0">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] font-mono text-charcoal/50 mt-0.5">
                        {link.url}
                      </p>
                    </div>

                    {/* Click Stats */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 justify-end">
                        <span className="text-sm font-black text-charcoal font-mono">
                          {clicks.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-bold text-charcoal/50">clicks</span>
                      </div>
                      <div className="text-[10px] font-bold text-[#4F83FF] mt-0.5 font-mono">
                        {percentage}% traffic
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
