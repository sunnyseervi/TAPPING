'use client';

import React from 'react';
import { 
  LayoutGrid, 
  Layers, 
  UserCheck, 
  QrCode, 
  CreditCard, 
  BarChart3, 
  Palette, 
  ShoppingBag, 
  ExternalLink,
  X,
  ShieldCheck
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
    { id: 'overview', label: 'Bento Overview', icon: LayoutGrid, count: null },
    { id: 'links', label: 'Links and Content', icon: Layers, count: '5' },
    { id: 'vcard', label: 'Digital vCard', icon: UserCheck, count: 'v3.0' },
    { id: 'qr', label: 'Permanent QR', icon: QrCode, count: null },
    { id: 'nfc', label: 'Metal NFC Studio', icon: CreditCard, count: 'NFC' },
    { id: 'analytics', label: 'Traffic Flow', icon: BarChart3, count: 'Live' },
    { id: 'themes', label: 'Pastel Themes', icon: Palette, count: null },
    { id: 'plans', label: 'Plans and Hardware', icon: ShoppingBag, count: null },
  ];

  return (
    <>
      {/* Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-black/10 flex flex-col justify-between w-72 sm:w-80 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header in Sidebar */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-black/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-2xl bg-[#1F2024] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                T
              </div>
              <div className="min-w-0">
                <span className="font-extrabold text-base tracking-tight text-charcoal truncate block">
                  TAPPING
                </span>
                <span className="text-[10px] text-charcoal-muted font-medium block -mt-0.5">
                  Creator Platform
                </span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-black/5 text-charcoal-muted hover:text-charcoal transition-colors"
              title="Close Menu"
            >
              <X className="w-5 h-5 text-charcoal" />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav className="p-3 space-y-1">
            <p className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider px-3 py-1">
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
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#1F2024] text-white shadow-xs'
                      : 'text-charcoal/70 hover:text-charcoal hover:bg-black/5'
                  }`}
                  title={item.label}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.count && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-black/5 text-charcoal/60'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Section */}
        <div className="p-3 border-t border-black/5 space-y-2">
          {/* Active Google Authentication Status */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-pastel-mint/50 border border-pastel-mint-border">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span className="text-[11px] font-bold text-charcoal">
                Google Account Active
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF7F2] border border-black/5">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-pastel-peach shrink-0 border border-white shadow-xs">
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 text-left flex-1">
              <p className="text-xs font-bold text-charcoal truncate leading-tight">
                {profile.displayName}
              </p>
              <p className="text-[10px] text-charcoal-muted truncate">
                @{profile.username}
              </p>
            </div>
            <a
              href={`/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg hover:bg-white text-charcoal/60 hover:text-charcoal transition-colors"
              title="View Public Bio"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}