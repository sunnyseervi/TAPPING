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
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="flex items-center gap-3 bg-[#1A1B1F] text-white px-5 py-2.5 rounded-full shadow-float border border-white/10 backdrop-blur-md">
        {/* Home */}
        <button
          onClick={() => onSelectTab('overview')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'overview'
              ? 'text-white scale-110'
              : 'text-white/60 hover:text-white'
          }`}
          title="Overview"
        >
          <Home className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Analytics Flow */}
        <button
          onClick={() => onSelectTab('analytics')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'analytics'
              ? 'text-white scale-110'
              : 'text-white/60 hover:text-white'
          }`}
          title="Audience Flow"
        >
          <BarChart2 className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Big White Center Action Plus Button from Screenshot */}
        <button
          onClick={onQuickAdd}
          className="w-11 h-11 rounded-full bg-white text-[#1A1B1F] flex items-center justify-center shadow-lg transition-transform active:scale-95 hover:scale-105 mx-1"
          title="Add Block"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
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
          <CreditCard className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Digital vCard */}
        <button
          onClick={() => onSelectTab('vcard')}
          className={`p-2 rounded-full transition-all ${
            activeTab === 'vcard'
              ? 'text-white scale-110'
              : 'text-white/60 hover:text-white'
          }`}
          title="Digital Card"
        >
          <UserCheck className="w-5 h-5 stroke-[2.2]" />
        </button>
      </div>
    </div>
  );
}
