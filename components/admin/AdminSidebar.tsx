'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  Users, 
  Package, 
  CreditCard, 
  Database, 
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Globe
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'overview' | 'users' | 'orders' | 'payments' | 'settings';
  onSelectTab: (tab: 'overview' | 'users' | 'orders' | 'payments' | 'settings') => void;
  userCount: number;
  orderCount: number;
  expiringCount: number;
}

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  userCount,
  orderCount,
  expiringCount,
}: AdminSidebarProps) {
  const navItems = [
    {
      id: 'overview',
      label: 'Platform Overview',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Users,
      badge: String(userCount),
      badgeColor: 'bg-[#FDF166] text-[#141518]',
    },
    {
      id: 'orders',
      label: 'Metal Card Orders',
      icon: Package,
      badge: String(orderCount),
      badgeColor: 'bg-[#B6F554] text-[#141518]',
    },
    {
      id: 'payments',
      label: 'Payments & Passes',
      icon: CreditCard,
      badge: expiringCount > 0 ? `${expiringCount} exp` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    {
      id: 'settings',
      label: 'System & Supabase',
      icon: Database,
      badge: 'SQL',
      badgeColor: 'bg-[#EFF4FF] text-[#4F83FF]',
    },
  ] as const;

  return (
    <aside className="w-64 bg-[#141518] text-white border-r border-[#2D3036] flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-4.5rem)] select-none">
      <div className="space-y-6">
        {/* Navigation Category Label */}
        <div>
          <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest px-3 mb-2">
            CONTROL CENTER
          </p>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#4F83FF] text-white shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Links Section */}
        <div>
          <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest px-3 mb-2">
            SHORTCUTS
          </p>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Creator Dashboard</span>
              </div>
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-3.5 h-3.5 text-[#4F83FF]" />
                <span>Landing Page</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-white/70">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B6F554]" />
          <span>TAPPING OS v3.2</span>
        </div>
        <p className="text-[10px] text-white/50 mt-1 font-mono">
          Encrypted Session &bull; TLS 1.3
        </p>
      </div>
    </aside>
  );
}
