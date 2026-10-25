'use client';

import React from 'react';
import { Home, BarChart2, Plus, CreditCard, UserCheck } from 'lucide-react';

interface FloatingBottomDockProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onQuickAdd: () => void;
}

export default function FloatingBottomDock({
  activeTab,
  onSelectTab,
  onQuickAdd,
}: FloatingBottomDockProps) {
  return (
    <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="flex items-center gap-3 bg-[#1A1B1F] text-white px-5 py-2.5 rounded-full shadow-float border border-white/10 backdrop-blur-md">
        {/* Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'dashboard'
              ? 'text-white scale-110'
              : 'text-white/60 hover:text-white'
          }`}
          title="Dashboard"
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Edit Profile */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'profile'
              ? 'text-white scale-110'
              : 'text-white/60 hover:text-white'
          }`}
          title="Edit Profile"
        >
          <UserCheck className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Big Cobalt Center Action Plus Button */}
        <button
          onClick={onQuickAdd}
          className="w-11 h-11 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 hover:scale-105 mx-1"
          title="Add Block"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Digital Card (vCard & QR) */}
        <button
          onClick={() => onSelectTab('digital-card')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'digital-card'
              ? 'text-white scale-110'
              : 'text-white/60 hover:text-white'
          }`}
          title="Digital Card"
        >
          <CreditCard className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Metal NFC Hardware */}
        <button
          onClick={() => onSelectTab('nfc')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'nfc'
              ? 'text-white scale-110'
              : 'text-white/60 hover:text-white'
          }`}
          title="NFC Hardware"
        >
          <BarChart2 className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
}
