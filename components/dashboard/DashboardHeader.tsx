'use client';

import React, { useState } from 'react';
import { Profile } from '@/lib/types';
import { Menu, Search, Bell, Copy, Check, ExternalLink, X } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface DashboardHeaderProps {
  profile: Profile;
  onToggleSidebar: () => void;
  onSelectTab?: (tab: string) => void;
}

export default function DashboardHeader({
  profile,
  onToggleSidebar,
  onSelectTab,
}: DashboardHeaderProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const profileUrl = `tapping.bio/${profile.username}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://${profileUrl}`);
      setCopied(true);
      showToast('Profile URL Copied', profileUrl, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const notifications = [
    { id: 1, title: 'NFC Card in Production', text: 'Laser etching queue order TAP-78401', time: '10 min ago' },
    { id: 2, title: 'Visitor Traffic Update', text: 'New visits registered from dynamic QR code', time: '1 hour ago' },
    { id: 3, title: 'Contact Card Downloaded', text: 'Visitor imported your contact vCard to iPhone', time: '3 hours ago' },
  ];

  return (
    <header className="w-full flex items-center justify-between gap-4 pb-5 pt-2">
      {/* Left: 3-Lines Hamburger Menu Button + Circular Avatar & Greeting */}
      <div className="flex items-center gap-3">
        {/* 3-Lines Hamburger Menu Button */}
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 rounded-2xl bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal shadow-xs transition-colors shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5 text-charcoal stroke-[2.2]" />
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0 hidden sm:block">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-soft bg-pastel-peach">
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>

          <div className="min-w-0 text-left">
            <h1 suppressHydrationWarning className="text-lg md:text-xl font-black tracking-tight text-charcoal truncate">
              Hello, {profile.displayName}!
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-charcoal hover:text-black bg-pastel-yellow px-3 py-0.5 rounded-full border border-pastel-yellow-border transition-colors truncate shadow-xs"
              >
                <span suppressHydrationWarning>{profileUrl}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-700 stroke-[3]" /> : <Copy className="w-3 h-3 stroke-[2]" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Search */}
        <div className="relative hidden sm:block">
          {searchOpen ? (
            <div className="flex items-center bg-white rounded-full px-3.5 py-1.5 shadow-sm border border-black/10 text-xs">
              <Search className="w-3.5 h-3.5 text-charcoal/60 mr-1.5" />
              <input
                type="text"
                autoFocus
                placeholder="Search links, tags, settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent focus:outline-none w-44 text-xs font-semibold"
              />
              <button onClick={() => setSearchOpen(false)} className="text-charcoal/60 hover:text-charcoal">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal shadow-xs transition-all"
              title="Search"
            >
              <Search className="w-4 h-4 stroke-[2.2]" />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-10 h-10 rounded-full bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal shadow-xs transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2.2]" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pastel-peach-dark ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl p-4 shadow-float border border-black/10 z-50 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <span className="text-xs font-bold text-charcoal">Activity and Alerts</span>
                <span className="text-[10px] text-charcoal/60 font-semibold">3 new</span>
              </div>
              <div className="flex flex-col gap-2 mt-2.5">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-2xl bg-[#FAF6F0] hover:bg-pastel-peach-light transition-colors">
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
          className="px-4 py-2.5 rounded-full bg-[#1A1B1F] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
        >
          <span>View Public</span>
          <ExternalLink className="w-3.5 h-3.5 text-pastel-yellow stroke-[2.5]" />
        </a>
      </div>
    </header>
  );
}
