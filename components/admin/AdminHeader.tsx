'use client';

import React from 'react';
import { ShieldCheck, LogOut, Globe } from 'lucide-react';
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
    <header className="h-16 px-6 bg-white text-charcoal border-b border-black/10 flex items-center justify-between sticky top-0 z-30 select-none shadow-2xs">
      {/* Left: Brand & Admin Shield */}
      <div className="flex items-center gap-3">
        <TappingLogo size="sm" variant="full" />
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-black/10 text-[10px] font-bold text-charcoal">
          <ShieldCheck className="w-3 h-3 text-charcoal" />
          <span>Admin</span>
        </div>
      </div>

      {/* Center: Live Platform Status */}
      <div className="hidden md:flex items-center gap-2 text-xs text-charcoal/60 font-medium">
        <span>Admin Dashboard</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Admin Email Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-mono text-[11px] text-charcoal/80">
            {session?.adminEmail || 'sunnyservi123@gmail.com'}
          </span>
        </div>

        {/* View Live Platform */}
        <button
          type="button"
          onClick={onOpenLiveSite}
          className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-black/5 text-charcoal text-xs font-bold flex items-center gap-1.5 border border-black/10 transition-colors cursor-pointer"
          title="Open Public Website"
        >
          <Globe className="w-3.5 h-3.5 text-[#4F83FF]" />
          <span className="hidden sm:inline">Live Site</span>
        </button>

        {/* Sign Out */}
        <button
          type="button"
          onClick={onLogout}
          className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Exit Admin Session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
