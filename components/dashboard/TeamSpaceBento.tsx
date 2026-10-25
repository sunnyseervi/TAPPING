'use client';

import React, { useState } from 'react';
import { Profile, AnalyticsSummary } from '@/lib/types';
import { 
  Bell, 
  ArrowUpRight, 
  MoreVertical, 
  Sparkles, 
  QrCode, 
  CreditCard, 
  Check, 
  UserCheck, 
  Layers, 
  ExternalLink 
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

  // Today's day name (e.g. Friday, Sunday)
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  const handleCopyLink = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://tapping.bio/${profile.username}`);
      setCopied(true);
      showToast('Bio Link Copied', `https://tapping.bio/${profile.username}`, 'success');
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
          {/* Dark Charcoal Pill: Share Bio Link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-3.5 p-3 rounded-full bg-white hover:bg-black/5 border border-black/10 shadow-xs transition-all text-left group w-full cursor-pointer"
            title="Click to copy bio link"
          >
            <div className="w-11 h-11 rounded-full bg-[#141518] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="block text-xs sm:text-sm font-black text-charcoal leading-tight truncate">
                {copied ? 'Profile Link Copied' : 'Share Bio Space'}
              </span>
              <span className="block text-[11px] font-semibold text-charcoal/50 truncate">
                tapping.bio/{profile.username}
              </span>
            </div>
          </button>

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

        {/* RIGHT COLUMN: APP TILES (vCard 3.0 & Vector QR) + AUDIENCE REACH STRIP */}
        <div className="flex flex-col gap-4">
          {/* Row of 2 White Square App Tiles */}
          <div className="grid grid-cols-2 gap-4">
            {/* Tile 1: vCard 3.0 Contact Saves -> Navigates to Digital Card Studio */}
            <div
              onClick={() => onSelectTab('digital-card')}
              className="bg-white rounded-3xl p-5 border border-black/5 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col items-center justify-center text-center group min-h-[110px]"
              title="Open Digital Business Card Studio"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#EFF4FF] border border-[#4F83FF]/15 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <UserCheck className="w-6 h-6 text-[#EA4335] stroke-[2.4]" />
              </div>
              <span className="text-xs font-black text-charcoal">
                vCard 3.0
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

      {/* BOTTOM ROW: TWO STATUS CARDS (Butter Yellow "Visits" + Spring Lime "Clicks") */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Left Status Card: Bright Butter Yellow (#FDF166) - Profile Visits */}
        <div
          onClick={() => onSelectTab('profile')}
          className="bg-[#FDF166] hover:bg-[#FBE849] rounded-4xl p-6 sm:p-7 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col justify-between min-h-[160px] text-charcoal group"
          title="Profile Visitors — Click to manage bio space"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
              {analytics.totalViews}
            </span>
            <span className="text-sm font-extrabold text-charcoal/80">
              profile visits
            </span>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <span className="text-xs sm:text-sm font-black text-charcoal">
              Live Traffic Active
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308]" />
          </div>
        </div>

        {/* Right Status Card: Bright Spring Lime Green (#B6F554) - Content Clicks */}
        <div
          onClick={() => onSelectTab('profile')}
          className="bg-[#B6F554] hover:bg-[#A6EC3C] rounded-4xl p-6 sm:p-7 shadow-soft hover:shadow-card transition-all cursor-pointer flex flex-col justify-between min-h-[160px] text-charcoal group"
          title="Content Clicks — Click to manage links"
        >
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black tracking-tight leading-none">
              {analytics.totalClicks}
            </span>
            <span className="text-sm font-extrabold text-charcoal/80">
              content clicks
            </span>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <span className="text-xs sm:text-sm font-black text-charcoal">
              Links Performing
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
          </div>
        </div>
      </div>
    </div>
  );
}
