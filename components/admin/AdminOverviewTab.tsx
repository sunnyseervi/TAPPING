'use client';

import React from 'react';
import { 
  Users, 
  Eye, 
  CreditCard, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowRight,
  Sparkles,
  Download,
  Plus
} from 'lucide-react';
import { UserRecord, MetalCardOrder, PaymentRecord } from '@/lib/types';

interface AdminOverviewTabProps {
  users: UserRecord[];
  orders: MetalCardOrder[];
  payments: PaymentRecord[];
  onNavigateTab: (tab: 'overview' | 'users' | 'orders' | 'payments' | 'settings') => void;
  onAddUserClick: () => void;
  onExportCsv: () => void;
}

export default function AdminOverviewTab({
  users,
  orders,
  payments,
  onNavigateTab,
  onAddUserClick,
  onExportCsv,
}: AdminOverviewTabProps) {
  // Compute Key Metrics
  const totalViews = users.reduce((acc, u) => acc + (u.totalViews || 0), 0);
  const totalClicks = users.reduce((acc, u) => acc + (u.totalClicks || 0), 0);
  const totalRevenue = payments
    .filter((p) => p.status === 'succeeded')
    .reduce((acc, p) => acc + p.amount, 0);

  const activeSubscribers = users.filter((u) => u.plan !== 'free').length;
  const pendingOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length;

  const now = Date.now();
  const expiringSoon = users.filter((u) => {
    if (u.plan === 'free' || !u.planExpiresAt) return false;
    const diffDays = (new Date(u.planExpiresAt).getTime() - now) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 14;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner with Quick Actions */}
      <div className="p-6 md:p-8 rounded-4xl bg-gradient-to-r from-[#141518] via-[#1C1E24] to-[#141518] text-white border border-[#2D3036] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-[#FDF166] border border-white/10">
            SYSTEM MISSION CONTROL
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-3 tracking-tight">
            TAPPING Platform Central Ledger
          </h1>
          <p className="text-xs text-white/70 mt-1 max-w-xl font-medium">
            Monitor real-time user registrations, bio link engagement metrics, contactless NFC hardware pipelines, and subscription revenue.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={onAddUserClick}
            className="px-4 py-2.5 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Creator</span>
          </button>

          <button
            type="button"
            onClick={onExportCsv}
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#B6F554]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bento Grid (6 Key Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Users */}
        <div 
          onClick={() => onNavigateTab('users')}
          className="p-5 rounded-3xl bg-white border border-black/10 shadow-2xs hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">Total Creators</span>
            <div className="w-7 h-7 rounded-xl bg-[#FAF7F2] flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-charcoal" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-charcoal">{users.length}</span>
            <p className="text-[10px] font-bold text-emerald-600 mt-0.5">+14% this month</p>
          </div>
        </div>

        {/* Total Views */}
        <div className="p-5 rounded-3xl bg-white border border-black/10 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">Link Views</span>
            <div className="w-7 h-7 rounded-xl bg-[#EFF4FF] flex items-center justify-center">
              <Eye className="w-3.5 h-3.5 text-[#4F83FF]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-charcoal">{totalViews.toLocaleString()}</span>
            <p className="text-[10px] font-bold text-charcoal/50 mt-0.5">{totalClicks.toLocaleString()} total clicks</p>
          </div>
        </div>

        {/* Total Revenue */}
        <div 
          onClick={() => onNavigateTab('payments')}
          className="p-5 rounded-3xl bg-white border border-black/10 shadow-2xs hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">Gross Revenue</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center">
              <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-charcoal">&#8377;{totalRevenue.toLocaleString()}</span>
            <p className="text-[10px] font-bold text-emerald-600 mt-0.5">UPI &bull; NetBanking</p>
          </div>
        </div>

        {/* Active Subscribers */}
        <div 
          onClick={() => onNavigateTab('users')}
          className="p-5 rounded-3xl bg-white border border-black/10 shadow-2xs hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">Pro Members</span>
            <div className="w-7 h-7 rounded-xl bg-[#FDF166]/40 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-charcoal" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-charcoal">{activeSubscribers}</span>
            <p className="text-[10px] font-bold text-charcoal/50 mt-0.5">Paid Subscriptions</p>
          </div>
        </div>

        {/* Pending Card Orders */}
        <div 
          onClick={() => onNavigateTab('orders')}
          className="p-5 rounded-3xl bg-white border border-black/10 shadow-2xs hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">Card Orders</span>
            <div className="w-7 h-7 rounded-xl bg-[#B6F554]/40 flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-charcoal" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-charcoal">{orders.length}</span>
            <p className="text-[10px] font-bold text-amber-600 mt-0.5">{pendingOrders} active in production</p>
          </div>
        </div>

        {/* Passes Expiring */}
        <div 
          onClick={() => onNavigateTab('payments')}
          className={`p-5 rounded-3xl border shadow-2xs transition-all cursor-pointer flex flex-col justify-between ${
            expiringSoon.length > 0
              ? 'bg-rose-50 border-rose-200'
              : 'bg-white border-black/10'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">Expiring Passes</span>
            <div className="w-7 h-7 rounded-xl bg-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-rose-700">{expiringSoon.length}</span>
            <p className="text-[10px] font-bold text-rose-600 mt-0.5">Expiring in &le; 14 days</p>
          </div>
        </div>
      </div>

      {/* Two-Column Middle Grid: Recent Users + Active Card Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Registered Creators (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-4xl p-6 border border-black/10 shadow-soft">
          <div className="flex items-center justify-between pb-4 border-b border-black/5">
            <div>
              <h3 className="font-black text-base text-charcoal">Recent Creators &amp; Bio Links</h3>
              <p className="text-xs text-charcoal/60 mt-0.5">Latest creator accounts registered on TAPPING</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('users')}
              className="text-xs font-black text-[#4F83FF] hover:underline flex items-center gap-1"
            >
              <span>View All Users</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {users.slice(0, 5).map((user) => (
              <div
                key={user.id}
                className="p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-gray-100/80 border border-black/5 flex items-center justify-between transition-colors text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-black/10 shrink-0">
                    <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-black text-charcoal truncate">{user.displayName}</p>
                      {user.status === 'blocked' && (
                        <span className="text-[8px] font-black px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700">
                          BLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-charcoal/50 font-mono truncate">
                      @{user.username} &bull; {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <span className="font-black text-charcoal block">{user.totalViews.toLocaleString()}</span>
                    <span className="text-[9px] text-charcoal/40 font-medium">views</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                    user.plan === 'pro_yearly'
                      ? 'bg-[#141518] text-white'
                      : user.plan === 'pro_monthly'
                      ? 'bg-[#EFF4FF] text-[#4F83FF]'
                      : 'bg-[#FAF7F2] text-charcoal border border-black/10'
                  }`}>
                    {user.plan === 'pro_yearly' ? 'Annual' : user.plan === 'pro_monthly' ? 'Monthly' : 'Free'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Hardware Orders Stream (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-4xl p-6 border border-black/10 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div>
                <h3 className="font-black text-base text-charcoal">Hardware Fulfillment</h3>
                <p className="text-xs text-charcoal/60 mt-0.5">Laser-engraved metal NFC cards</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('orders')}
                className="text-xs font-black text-[#4F83FF] hover:underline flex items-center gap-1"
              >
                <span>All Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/5 text-xs flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-charcoal">{order.orderNumber}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${
                      order.status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'shipped'
                        ? 'bg-[#EFF4FF] text-[#4F83FF]'
                        : 'bg-[#FDF166] text-charcoal'
                    }`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[11px] text-charcoal/70 font-medium truncate">
                    Engraved: <strong className="text-charcoal font-black">{order.engravedName}</strong> ({order.material.replace('_', ' ').toUpperCase()})
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-black/5 flex items-center justify-between text-xs font-bold text-charcoal/60">
            <span>Standard Courier: Delhivery Surface Pro</span>
            <span className="text-emerald-700 font-black">All Tracked</span>
          </div>
        </div>
      </div>
    </div>
  );
}
