'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Profile } from '@/lib/types';
import { Menu, Bell, ExternalLink, MoreHorizontal, Sparkles, Check, Globe } from 'lucide-react';

interface DashboardHeaderProps {
  profile: Profile;
  onToggleSidebar: () => void;
  onSelectTab?: (tab: string) => void;
  onPublishClick?: () => void;
  isPublished?: boolean;
}

export default function DashboardHeader({
  profile,
  onToggleSidebar,
  onPublishClick,
  isPublished = false,
}: DashboardHeaderProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, title: 'Bio Space Active', text: 'Dynamic QR and link tracking active', time: '10 min ago' },
    { id: 2, title: 'Visitor Traffic Update', text: 'New visits registered from profile link', time: '1 hour ago' },
    { id: 3, title: 'Contact Card Ready', text: 'Digital contact vCard synced', time: '3 hours ago' },
  ];

  // Dismiss notification dropdown on clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    if (notificationsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  return (
    <header className="w-full flex items-center justify-between gap-2 pb-3 pt-1 sm:gap-4 sm:pb-4 sm:pt-2">
      {/* Left: Sidebar Toggle Button + Name + Status Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white hover:bg-black/5 active:scale-95 border border-black/10 flex items-center justify-center text-charcoal shadow-xs transition-all shrink-0 cursor-pointer"
          title="Toggle Sidebar (Show / Hide)"
        >
          <MoreHorizontal className="w-5 h-5 text-charcoal stroke-[2.2]" />
        </button>

        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <h1 suppressHydrationWarning className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-charcoal truncate">
            {(profile.displayName && profile.displayName !== 'Aarav Sharma') ? profile.displayName : (profile.username || 'Creator')}
          </h1>

          {/* Status Badge */}
          {isPublished ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-black uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live &amp; Active</span>
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Draft &bull; Unpublished</span>
            </span>
          )}
        </div>
      </div>

      {/* Right Controls: Publish Button + Notifications + View Public */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Publish Button */}
        {onPublishClick && (
          <button
            type="button"
            onClick={onPublishClick}
            className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0 ${
              isPublished 
                ? 'bg-white hover:bg-gray-50 border border-black/15 text-charcoal shadow-2xs' 
                : 'bg-[#141518] hover:bg-black text-white'
            }`}
            title={isPublished ? 'Profile is published live' : 'Publish your bio page live'}
          >
            {isPublished ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                <span className="hidden sm:inline">Published Live</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#FDF166]" />
                <span>Publish to Web</span>
              </>
            )}
          </button>
        )}

        {/* Notifications with Click-Outside Dismissal */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="hidden sm:flex w-10 h-10 rounded-full bg-white hover:bg-black/5 border border-black/10 items-center justify-center text-charcoal shadow-xs transition-all relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2.2]" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl p-4 shadow-float border border-black/10 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <span className="text-xs font-bold text-charcoal">Activity &amp; Alerts</span>
                <span className="text-[10px] text-charcoal/60 font-semibold">Live</span>
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
          className="h-9 w-9 sm:h-auto sm:w-auto sm:px-4 sm:py-2.5 rounded-full bg-white hover:bg-gray-50 border border-black/15 text-charcoal text-xs font-black flex items-center justify-center sm:gap-1.5 shadow-2xs transition-transform active:scale-95"
          title="View your public page"
        >
          <span className="hidden sm:inline">View Public</span>
          <ExternalLink className="w-3.5 h-3.5 text-charcoal stroke-[2.5]" />
        </a>
      </div>
    </header>
  );
}
