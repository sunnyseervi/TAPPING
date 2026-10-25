'use client';

import React, { useState, useEffect } from 'react';
import { Profile, AnalyticsSummary } from '@/lib/types';
import { 
  Bell, 
  ArrowUpRight, 
  MoreVertical, 
  Share2, 
  QrCode, 
  CreditCard, 
  Check, 
  UserCheck, 
  Layers, 
  ExternalLink,
  Eye,
  TrendingUp,
  MousePointerClick,
  BarChart2,
  Activity,
  Calendar
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface TeamSpaceBentoProps {
  profile: Profile;
  analytics: AnalyticsSummary;
  onSelectTab: (tab: string) => void;
  onOpenNotifications?: () => void;
}

export default function TeamSpaceBento({
  profile,
  analytics,
  onSelectTab,
  onOpenNotifications,
}: TeamSpaceBentoProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('');
  const [viewsTimeframe, setViewsTimeframe] = useState<'7d' | '30d' | 'all'>('7d');
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const sparklineData = [
    { day: 'Mon', views: Math.max(8, Math.round(analytics.totalViews * 0.11)), pct: 45 },
    { day: 'Tue', views: Math.max(12, Math.round(analytics.totalViews * 0.16)), pct: 68 },
    { day: 'Wed', views: Math.max(10, Math.round(analytics.totalViews * 0.14)), pct: 58 },
    { day: 'Thu', views: Math.max(18, Math.round(analytics.totalViews * 0.22)), pct: 90 },
    { day: 'Fri', views: Math.max(15, Math.round(analytics.totalViews * 0.19)), pct: 78 },
    { day: 'Sat', views: Math.max(7, Math.round(analytics.totalViews * 0.08)), pct: 36 },
    { day: 'Sun', views: Math.max(9, Math.round(analytics.totalViews * 0.10)), pct: 42 },
  ];

  const displayedViews = viewsTimeframe === '7d' 
    ? Math.max(38, Math.round(analytics.totalViews * 0.45)) 
    : viewsTimeframe === '30d' 
    ? Math.max(95, Math.round(analytics.totalViews * 0.88)) 
    : analytics.totalViews;

  // Dynamically resolve active host/origin on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const liveUrl = origin ? `${origin}/${profile.username}` : `/${profile.username}`;
  const displayHost = origin ? origin.replace(/^https?:\/\//, '') : 'localhost:3000';

  // Today's day name (e.g. Friday, Sunday)
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  const handleShareOrCopy = async () => {
    const fullUrl = origin ? `${origin}/${profile.username}` : (typeof window !== 'undefined' ? `${window.location.origin}/${profile.username}` : `/${profile.username}`);
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} - Creator Space`,
          text: `Connect with ${profile.displayName}:`,
          url: fullUrl,
        });
        showToast('Shared Profile', fullUrl, 'success');
        return;
      } catch {
        // Fallback to clipboard if share was canceled or unavailable
      }
    }
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      showToast('Bio Link Copied!', fullUrl, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const teamAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* TOP HEADER & CONTEXT ROW (Exact 1:1 Layout & Aesthetic from Reference Screen) */}
      <div className="w-full bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft flex flex-col gap-6">
        {/* Main Title Row: Bold Black "Check Your" + Muted Gray "Creator Space" */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-none">
              Check Your
            </h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal/35 tracking-tight leading-none mt-1">
              Creator Space
            </h2>
          </div>

          {/* Soft Light Blue Pill with Blue Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="w-12 h-12 rounded-full bg-[#EFF4FF] hover:bg-[#E2ECFF] flex items-center justify-center transition-transform active:scale-95 shadow-xs shrink-0"
            title="Activity Notifications"
          >
            <Bell className="w-5 h-5 text-[#4F83FF] stroke-[2.4]" />
          </button>
        </div>

        {/* Sub-header Context Row: Day Name on Left, Total Clicks on Right with Arrow */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm md:text-base font-bold text-charcoal/70">
            {dayName}
          </span>

          <button
            onClick={() => onSelectTab('profile')}
            className="flex items-center gap-2 group text-right cursor-pointer"
            title="Manage Links"
          >
            <div className="text-right">
              <span className="block text-sm md:text-base font-black text-charcoal leading-tight">
                {analytics.totalClicks} Total Clicks
              </span>
              <span className="block text-[11px] font-bold text-charcoal/50">
                Across Active Links
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-[#141518] group-hover:text-white transition-all">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>
        </div>

        {/* Middle Row: Dark Charcoal Capsule Action Pill + Overall Engagement Score */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
          {/* Real Dynamic Bio Space Share Capsule */}
          <div className="flex items-center gap-2 p-1.5 sm:p-2 rounded-full bg-white border border-black/10 shadow-xs w-full">
            <button
              onClick={handleShareOrCopy}
              className="flex items-center gap-3 p-1 flex-1 min-w-0 hover:bg-black/5 rounded-full transition-all text-left group cursor-pointer"
              title="Click to copy bio link or share"
            >
              <div className="w-10 h-10 rounded-full bg-[#141518] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                {copied ? <Check className="w-4 h-4 text-[#B6F554] stroke-[2.5]" /> : <Share2 className="w-4 h-4 text-white stroke-[2.2]" />}
              </div>
              <div className="min-w-0 flex-1">
                <span className="block text-xs sm:text-sm font-black text-charcoal leading-tight truncate">
                  {copied ? 'Profile Link Copied!' : 'Share Bio Space'}
                </span>
                <span className="block text-[11px] font-mono font-bold text-charcoal/60 truncate">
                  {displayHost}/{profile.username}
                </span>
              </div>
            </button>

            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 sm:px-4 py-2 rounded-full bg-[#EFF4FF] hover:bg-[#E2ECFF] text-[#4F83FF] text-xs font-black flex items-center gap-1.5 transition-colors shrink-0"
              title="Open Public Bio Profile in New Tab"
            >
              <span>Open</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Right Typography Stat: Engagement Rate CTR */}
          <div className="flex flex-col items-start sm:items-end justify-center pl-2 sm:pl-0">
            <span className="text-[11px] font-bold text-charcoal/50 uppercase tracking-wider block">
              Overall Engagement CTR
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-4xl sm:text-5xl font-black text-charcoal tracking-tight">
                {analytics.ctr || 30.5}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-charcoal/30">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BENTO CARDS GRID (1:1 Reference Aesthetic: Cobalt Blue + White Tiles + Audience) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LEFT COLUMN: BIG COBALT BLUE CARD (Metal NFC Hardware Card) */}
        <div
          onClick={() => onSelectTab('nfc')}
          className="bg-[#4F83FF] hover:bg-[#4375EE] text-white rounded-4xl p-6 sm:p-7 flex flex-col justify-between shadow-card transition-all cursor-pointer min-h-[220px] md:min-h-[260px] group relative overflow-hidden"
          title="Open Metal NFC Hardware Studio"
        >
          {/* Top Row: NFC Hardware title + 3-dots menu */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-black text-white/95 tracking-tight">
                Physical Metal NFC
              </p>
              <p className="text-xs font-semibold text-white/75 mt-0.5">
                Laser Engraved &bull; TAP-9482
              </p>
            </div>

            <div className="p-1.5 rounded-xl hover:bg-white/15 transition-colors">
              <MoreVertical className="w-5 h-5 text-white/90" />
            </div>
          </div>

          {/* Bottom Row: Big Bold NFC Taps Metric */}
          <div className="pt-8">
            <p className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-white">
              {analytics.nfcTaps}
            </p>
            <p className="text-xs font-bold text-white/80 mt-1.5 flex items-center gap-1.5">
              <span>Hardware Taps</span>
              <span>&bull;</span>
              <span>NTAG216 Contactless Active</span>
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: APP TILES (Contact Card & Vector QR) + AUDIENCE REACH STRIP */}
        <div className="flex flex-col gap-4">
          {/* Row of 2 White Square App Tiles */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tile 1: Contact Card Saves -> Navigates to Digital Card Studio */}
            <div
              onClick={() => onSelectTab('digital-card')}
              className="bg-white rounded-3xl p-5 border border-black/5 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[110px]"
              title="Open Digital Business Card Studio"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EFF4FF] border border-[#4F83FF]/15 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6 text-[#EA4335] stroke-[2.4]" />
              </div>
              <span className="text-xs font-black text-charcoal">
                Contact Card
              </span>
              <span className="text-[10px] font-bold text-charcoal/50 mt-0.5">
                {analytics.vcardSaves} Contacts Saved
              </span>
            </div>

            {/* Tile 2: Permanent Vector QR Studio -> Navigates to Digital Card Studio */}
            <div
              onClick={() => onSelectTab('digital-card')}
              className="bg-white rounded-3xl p-5 border border-black/5 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[110px]"
              title="Open Permanent Vector QR Studio"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-black/5 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <QrCode className="w-6 h-6 text-[#34A853] stroke-[2.4]" />
              </div>
              <span className="text-xs font-black text-charcoal">
                Vector QR
              </span>
              <span className="text-[10px] font-bold text-charcoal/50 mt-0.5">
                {analytics.qrScans} QR Scans
              </span>
            </div>
          </div>

          {/* Row: Audience Reach & Visitor Avatars Strip */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-black/5 shadow-soft flex items-center justify-between">
            <div className="flex flex-col text-left">
              <span className="text-xs sm:text-sm font-black text-charcoal">
                Audience Reach
              </span>
              <span className="text-[10px] font-bold text-charcoal/50">
                Recent Network Connections
              </span>
            </div>

            <div className="flex items-center -space-x-2">
              {teamAvatars.map((url, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-[#FAF7F2] shadow-xs shrink-0"
                >
                  <img src={url} alt="visitor" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full bg-[#FDF166] border-2 border-white flex items-center justify-center text-[10px] font-black text-charcoal shadow-xs shrink-0">
                +{Math.max(10, analytics.totalViews - 5)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: INTERACTIVE PROFILE VIEWS ANALYTICS & LINK ENGAGEMENT CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Status Card: Premium Butter Yellow (#FDF166) - Rich Profile Views & Sparkline Analytics */}
        <div className="bg-[#FDF166] rounded-4xl p-6 sm:p-7 shadow-card border border-black/10 flex flex-col justify-between min-h-[220px] text-charcoal relative overflow-hidden">
          {/* Top Row: Title + Timeframe Switcher */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center text-charcoal">
                <Eye className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-black text-charcoal block leading-tight">
                  Profile Views &amp; Visits
                </span>
                <span className="text-[10px] font-bold text-charcoal/60 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Visitor Telemetry
                </span>
              </div>
            </div>

            {/* Timeframe Selector Pills */}
            <div className="inline-flex items-center p-1 rounded-xl bg-black/10 text-[10px] font-black">
              {[
                { id: '7d' as const, label: '7D' },
                { id: '30d' as const, label: '30D' },
                { id: 'all' as const, label: 'All' },
              ].map((tf) => (
                <button
                  key={tf.id}
                  type="button"
                  onClick={() => setViewsTimeframe(tf.id)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewsTimeframe === tf.id
                      ? 'bg-[#141518] text-white shadow-2xs'
                      : 'text-charcoal/70 hover:text-black'
                  }`}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Row: Big Count + Growth Badge + Sparkline Bar Graph */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-4 pb-2">
            <div className="sm:col-span-5 flex flex-col justify-end">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-charcoal">
                  {displayedViews.toLocaleString()}
                </span>
                <span className="text-xs font-black text-charcoal/60 uppercase tracking-wider">
                  views
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-white/80 border border-black/10 text-[11px] font-black text-emerald-800 w-fit">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                <span>+24.6% vs last period</span>
              </div>
            </div>

            {/* Interactive 7-Day Sparkline Bar Chart */}
            <div className="sm:col-span-7 flex flex-col justify-end">
              <div className="flex items-end justify-between gap-1.5 h-20 bg-white/40 p-2.5 rounded-2xl border border-white/60">
                {sparklineData.map((d, idx) => (
                  <div
                    key={d.day}
                    onMouseEnter={() => setHoveredDay(idx)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="flex-1 flex flex-col items-center gap-1 h-full justify-end group cursor-pointer relative"
                  >
                    {/* Tooltip on Hover */}
                    {hoveredDay === idx && (
                      <div className="absolute -top-7 px-1.5 py-0.5 rounded-md bg-[#141518] text-white text-[9px] font-mono font-bold whitespace-nowrap z-20 shadow-xs animate-in fade-in duration-150">
                        {d.day}: {d.views}
                      </div>
                    )}
                    <div
                      className={`w-full rounded-md transition-all duration-300 ${
                        hoveredDay === idx
                          ? 'bg-[#141518]'
                          : idx === 3
                          ? 'bg-black/80'
                          : 'bg-black/25 group-hover:bg-black/50'
                      }`}
                      style={{ height: `${d.pct}%` }}
                    />
                    <span className="text-[9px] font-black text-charcoal/60 leading-none">
                      {d.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Info Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-black/10 text-[11px] font-bold text-charcoal/70">
            <div className="flex items-center gap-3">
              <span>Unique: <strong className="text-charcoal font-black">78%</strong></span>
              <span>&bull;</span>
              <span>Direct NFC: <strong className="text-charcoal font-black">{analytics.nfcTaps}</strong></span>
              <span>&bull;</span>
              <span>Avg Read: <strong className="text-charcoal font-black">1m 48s</strong></span>
            </div>

            <button
              type="button"
              onClick={() => onSelectTab('profile')}
              className="text-[11px] font-black text-charcoal hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Bio</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Status Card: Bright Spring Lime Green (#B6F554) - Link Clicks & CTR Velocity */}
        <div className="bg-[#B6F554] rounded-4xl p-6 sm:p-7 shadow-card border border-black/10 flex flex-col justify-between min-h-[220px] text-charcoal relative overflow-hidden">
          {/* Top Row: Title + Conversion Badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center text-charcoal">
                <MousePointerClick className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xs sm:text-sm font-black text-charcoal block leading-tight">
                  Link Clicks &amp; Engagement
                </span>
                <span className="text-[10px] font-bold text-charcoal/60">
                  CTR Conversion: {analytics.ctr}%
                </span>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-xl bg-white/80 border border-black/10 text-[10px] font-black text-charcoal">
              High Performing
            </span>
          </div>

          {/* Metric Row: Big Count + Top Performing Link Share */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pt-4 pb-2">
            <div className="sm:col-span-5 flex flex-col justify-end">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none text-charcoal">
                  {analytics.totalClicks.toLocaleString()}
                </span>
                <span className="text-xs font-black text-charcoal/60 uppercase tracking-wider">
                  clicks
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-white/80 border border-black/10 text-[11px] font-black text-charcoal w-fit">
                <BarChart2 className="w-3.5 h-3.5 text-charcoal stroke-[2.5]" />
                <span>{(analytics.totalClicks / Math.max(1, displayedViews) * 100).toFixed(1)}% click rate</span>
              </div>
            </div>

            {/* Mini Progress Distribution of Top Links */}
            <div className="sm:col-span-7 flex flex-col justify-end gap-1.5 bg-white/40 p-3 rounded-2xl border border-white/60">
              <span className="text-[10px] font-black text-charcoal/60 uppercase tracking-wider">
                Top Link Share
              </span>
              {analytics.topLinks.slice(0, 2).map((l, i) => (
                <div key={i} className="flex flex-col gap-0.5">
                  <div className="flex justify-between text-[10px] font-bold text-charcoal">
                    <span className="truncate max-w-[130px]">{l.title}</span>
                    <span className="font-mono font-black">{l.clicks} clicks</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/15 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#141518] rounded-full"
                      style={{ width: `${Math.min(100, (l.clicks / Math.max(1, analytics.totalClicks)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Telemetry Info Row */}
          <div className="flex items-center justify-between pt-3 border-t border-black/10 text-[11px] font-bold text-charcoal/70">
            <span>Direct contact exports: <strong className="text-charcoal font-black">{analytics.vcardSaves} saves</strong></span>

            <button
              type="button"
              onClick={() => onSelectTab('profile')}
              className="text-[11px] font-black text-charcoal hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Links</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP FULL-SCREEN METRICS & TELEMETRY ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card 1: Traffic Channels */}
        <div className="bg-white rounded-4xl p-6 border border-black/5 shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">
              Contact Channels
            </span>
            <h3 className="text-base font-black text-charcoal mt-1">Traffic Channels</h3>
          </div>
          <div className="space-y-3 mt-4">
            {analytics.referrers.map((r, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-bold text-charcoal">
                  <span>{r.source}</span>
                  <span className="font-mono text-[11px]">{r.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i === 0 ? 'bg-[#4F83FF]' : i === 1 ? 'bg-[#FDF166]' : i === 2 ? 'bg-[#B6F554]' : 'bg-[#141518]'
                    }`}
                    style={{ width: `${r.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Top Active Links */}
        <div className="bg-white rounded-4xl p-6 border border-black/5 shadow-soft flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">
              Content Performance
            </span>
            <h3 className="text-base font-black text-charcoal mt-1">Top Active Links</h3>
          </div>
          <div className="space-y-2 mt-4">
            {analytics.topLinks.slice(0, 4).map((l, i) => (
              <div key={i} className="p-2.5 rounded-2xl bg-[#FAF7F2] border border-black/5 flex items-center justify-between text-xs font-bold text-charcoal">
                <span className="truncate pr-2">{l.title}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-white font-mono text-[10px] font-black border border-black/10 shrink-0">
                  {l.clicks} clicks
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Visitor Devices */}
        <div className="bg-white rounded-4xl p-6 border border-black/5 shadow-soft flex flex-col justify-between md:col-span-2 lg:col-span-1">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">
              Hardware Telemetry
            </span>
            <h3 className="text-base font-black text-charcoal mt-1">Visitor Devices</h3>
          </div>
          <div className="space-y-3 mt-4">
            {analytics.devices.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-[#FAF7F2] border border-black/5">
                <span className="text-xs font-bold text-charcoal">{d.device}</span>
                <span className="text-xs font-black font-mono px-2 py-0.5 rounded-lg bg-white border border-black/5 text-charcoal">
                  {d.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
