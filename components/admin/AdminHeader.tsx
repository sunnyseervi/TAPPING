'use client';

import React from 'react';
import { ShieldCheck, LogOut, ExternalLink, Globe, Wifi, Bell } from 'lucide-react';
import { AdminSession } from '@/lib/types';
import TappingLogo from '@/components/brand/TappingLogo';

interface AdminHeaderProps {
  session: AdminSession | null;
  onLogout: () => void;
  onOpenLiveSite: () => void;
}

export default function AdminHeader({
  session,
  onLogout,
  onOpenLiveSite,
}: AdminHeaderProps) {
  return (
    <header className="h-18 px-6 bg-[#141518] text-white border-b border-[#2D3036] flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Brand & Admin Shield */}
      <div className="flex items-center gap-3">
        <TappingLogo size="sm" variant="full" theme="light" />
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono font-bold text-[#FDF166]">
          <ShieldCheck className="w-3 h-3 text-[#FDF166]" />
          <span>SUPERUSER ROOT</span>
        </div>
      </div>

      {/* Center: Live Platform Status */}
      <div className="hidden md:flex items-center gap-2 text-xs font-mono text-white/60">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>PROD_HOST: tapping.bio &bull; ALL SYSTEMS NORMAL</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Admin Email Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/5 border border-white/10 text-xs">
          <div className="w-2 h-2 rounded-full bg-[#B6F554]" />
          <span className="font-mono text-[11px] text-white/80">
            {session?.adminEmail || 'admin@tapping.bio'}
          </span>
        </div>

        {/* View Live Platform */}
        <button
          type="button"
          onClick={onOpenLiveSite}
          className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 border border-white/15 transition-colors cursor-pointer"
          title="Open Public Website"
        >
          <Globe className="w-3.5 h-3.5 text-[#4F83FF]" />
          <span className="hidden sm:inline">Live Site</span>
        </button>

        {/* Sign Out */}
        <button
          type="button"
          onClick={onLogout}
          className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-black border border-rose-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Exit Admin Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
