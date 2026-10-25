'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutGrid, 
  Layers, 
  UserCheck, 
  CreditCard, 
  Palette, 
  ExternalLink,
  X,
  ArrowRight,
  Globe,
  ArrowUpRight
} from 'lucide-react';
import { Profile } from '@/lib/types';

interface AppSidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  onOpenAuth?: () => void;
}

export default function AppSidebar({
  activeTab,
  onSelectTab,
  isOpen,
  onClose,
  profile,
  onOpenAuth,
}: AppSidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Creator Space', icon: LayoutGrid, count: null, color: null },
    { id: 'profile', label: 'Edit Profile & Links', icon: UserCheck, count: '5', color: 'bg-[#FDF166] text-charcoal' },
    { id: 'digital-card', label: 'Digital Card & QR', icon: CreditCard, count: 'v3.0', color: 'bg-[#EFF4FF] text-[#4F83FF]' },
    { id: 'nfc', label: 'Metal NFC Studio', icon: Layers, count: 'NFC', color: 'bg-[#B6F554] text-charcoal' },
    { id: 'themes', label: 'Themes & Styles', icon: Palette, count: null, color: null },
  ];

  return (
    <>
      {/* Drawer Backdrop Overlay (Mobile only) */}
      {isOpen && (
        <div
          onClick={onClose}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar: Permanently docked on desktop (lg:translate-x-0 lg:w-72), slide-out drawer on mobile */}
      <aside
        className={`fixed top-0 left-0 z-50 lg:z-30 h-screen bg-[#F7F5EE] border-r border-black/10 flex flex-col justify-between w-72 sm:w-80 lg:w-72 shadow-2xl lg:shadow-none transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-black/5 bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-[#141518] text-white flex items-center justify-center font-black text-base shrink-0 shadow-sm">
                T
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight text-charcoal truncate block">
                    TAPPING
                  </span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#FDF166] text-charcoal border border-black/10">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-charcoal/60 font-bold block">
                  Bio & NFC Platform
                </span>
              </div>
            </div>

            {/* Close Button (mobile only) */}
            <button
              onClick={onClose}
              className="lg:hidden w-8 h-8 rounded-full bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal transition-colors shadow-xs"
              title="Close Menu"
            >
              <X className="w-4 h-4 text-charcoal stroke-[2.2]" />
            </button>
          </div>

          {/* Navigation Items List Styled in Bento Aesthetic */}
          <nav className="p-4 space-y-2">
            <p className="text-[10px] font-black text-charcoal/50 uppercase tracking-widest px-3 py-1">
              Modules and Studio
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                    isActive
                      ? 'bg-[#141518] text-white shadow-sm'
                      : 'bg-white/80 hover:bg-white text-charcoal border border-black/5 shadow-2xs hover:shadow-xs'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0 stroke-[2.2]" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.count && (
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border border-black/10 ${
                        isActive
                          ? 'bg-white/20 text-white border-white/20'
                          : item.color || 'bg-black/5 text-charcoal'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Public Landing & Hero Page Link */}
            <div className="pt-2">
              <Link
                href="/"
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black bg-white/70 hover:bg-white text-charcoal/80 hover:text-black border border-black/5 shadow-2xs hover:shadow-xs transition-all"
                title="View Public Landing & Hero Page"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-[#4F83FF] stroke-[2.2]" />
                  <span>Public Landing Page</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-charcoal/50" />
              </Link>
            </div>
          </nav>
        </div>

        {/* Bottom User Profile Section Styled as elevated Bento Card */}
        <div className="p-4 border-t border-black/5 bg-white/50 backdrop-blur-sm">
          <div className="p-4 rounded-3xl bg-white border border-black/10 shadow-soft flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-black/10 shadow-xs">
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 text-left flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-charcoal truncate leading-tight">
                    {profile.displayName}
                  </p>
                  <span className="text-[9px] font-black px-1.5 py-0.2 rounded-md bg-[#FDF166] border border-black/10 text-charcoal shrink-0">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-charcoal/60 truncate mt-0.5 font-bold">
                  @{profile.username} &middot; Pro Creator
                </p>
              </div>
            </div>

            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
              title="Open Public Bio Profile"
            >
              <span>View Live Bio Space</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
