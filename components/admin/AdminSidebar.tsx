'use client';

import React from 'react';
import { 
  BarChart3, 
  Users, 
  Package, 
  CreditCard, 
  Database, 
  ChevronRight,
  ShieldCheck
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
      badgeColor: 'bg-[#FDF166] text-charcoal',
    },
    {
      id: 'orders',
      label: 'Metal Card Orders',
      icon: Package,
      badge: String(orderCount),
      badgeColor: 'bg-[#B6F554] text-charcoal',
    },
    {
      id: 'payments',
      label: 'Payments & Passes',
      icon: CreditCard,
      badge: expiringCount > 0 ? `${expiringCount} exp` : null,
      badgeColor: 'bg-rose-100 text-rose-800 border border-rose-300',
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
    <aside className="w-64 bg-white text-charcoal border-r border-black/10 flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-4rem)] select-none shadow-2xs">
      <div className="space-y-6">
        <div>
          <p className="text-[10px] font-mono font-black text-charcoal/40 uppercase tracking-widest px-3 mb-2.5">
            ADMIN CONTROL
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
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#141518] text-white shadow-xs'
                      : 'text-charcoal/70 hover:text-black hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-black/5 text-charcoal'
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
      </div>

      {/* Bottom Superuser Security Badge */}
      <div className="p-3.5 rounded-3xl bg-[#FAF7F2] border border-black/5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-white border border-black/10 flex items-center justify-center text-[#4F83FF] shadow-2xs">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[11px] text-charcoal truncate">Administrator</p>
          <p className="text-[10px] text-charcoal/50">Online</p>
        </div>
      </div>
    </aside>
  );
}
