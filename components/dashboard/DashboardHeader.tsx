'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { Menu, Bell, ExternalLink } from 'lucide-react';

interface DashboardHeaderProps {
  profile: Profile;
  onToggleSidebar: () => void;
  onSelectTab?: (tab: string) => void;
}

export default function DashboardHeader({
  profile,
  onToggleSidebar,
}: DashboardHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    { id: 1, title: 'NFC Card in Production', text: 'Laser etching queue order TAP-78401', time: '10 min ago' },
    { id: 2, title: 'Visitor Traffic Update', text: 'New visits registered from dynamic QR code', time: '1 hour ago' },
    { id: 3, title: 'Contact Card Downloaded', text: 'Visitor imported your contact vCard to iPhone', time: '3 hours ago' },
  ];

  return (
    <header className="w-full flex items-center justify-between gap-4 pb-4 pt-2">
      {/* Left: 3-Lines Hamburger Menu Button + User's Name (No avatar picture, No 'Hello', No copy link) */}
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 rounded-2xl bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal shadow-xs transition-colors shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5 text-charcoal stroke-[2.2]" />
        </button>

        <h1 suppressHydrationWarning className="text-xl md:text-2xl font-black tracking-tight text-charcoal truncate">
          {profile.displayName}
        </h1>
      </div>

      {/* Right Controls: Notifications + View Public Button (No Search Bar) */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-full bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal shadow-xs transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2.2]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl p-4 shadow-float border border-black/10 z-50 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <span className="text-xs font-bold text-charcoal">Activity and Alerts</span>
                <span className="text-[10px] text-charcoal/60 font-semibold">3 new</span>
              </div>
              <div className="flex flex-col gap-2 mt-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-2xl bg-[#FAF6F0] hover:bg-pastel-peach/30 transition-colors">
                    <p className="text-xs font-bold text-charcoal">{n.title}</p>
                    <p className="text-[11px] text-charcoal/70 mt-0.5">{n.text}</p>
                    <span className="text-[9px] text-charcoal/50 mt-1 block font-semibold">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Public Profile Link */}
        <a
          href={`/${profile.username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <span>View Public</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#FDF166] stroke-[2.5]" />
        </a>
      </div>
    </header>
  );
}
