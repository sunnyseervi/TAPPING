'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  CheckCircle, 
  ArrowUpRight, 
  RotateCcw,
  Zap,
  TrendingUp,
  ShieldAlert,
  Search
} from 'lucide-react';
import { PaymentRecord, UserRecord } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';

interface AdminPaymentsTabProps {
  payments: PaymentRecord[];
  users: UserRecord[];
  onExtendUserPass: (userId: string, additionalDays: number) => void;
}

export default function AdminPaymentsTab({
  payments,
  users,
  onExtendUserPass,
}: AdminPaymentsTabProps) {
  const { showToast } = useToast();
  const [expiryRange, setExpiryRange] = useState<number>(30); // 7, 14, 30 days
  const [searchQuery, setSearchQuery] = useState('');

  const now = Date.now();

  // Find users with expiring passes
  const expiringUsers = users
    .map((u) => {
      if (u.plan === 'free' || !u.planExpiresAt) return null;
      const expiryTime = new Date(u.planExpiresAt).getTime();
      const diffDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));
      return { ...u, daysLeft: diffDays };
    })
    .filter((u): u is UserRecord & { daysLeft: number } => {
      if (!u) return false;
      return u.daysLeft <= expiryRange;
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const totalGrossRevenue = payments
    .filter((p) => p.status === 'succeeded')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalSubscriptionRevenue = payments
    .filter((p) => p.type.startsWith('subscription') && p.status === 'succeeded')
    .reduce((acc, p) => acc + p.amount, 0);

  const totalHardwareRevenue = payments
    .filter((p) => p.type === 'metal_card' && p.status === 'succeeded')
    .reduce((acc, p) => acc + p.amount, 0);

  const handleQuickExtend = (userId: string, days: number, username: string) => {
    onExtendUserPass(userId, days);
    showToast('Subscription Pass Extended', `Added ${days} days to @${username}'s membership`, 'success');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="p-6 md:p-8 rounded-4xl bg-white border border-black/10 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Revenue &amp; Pass Expiration Ledger</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
            Payments Ledger &amp; Membership Expiry Radar
          </h2>
          <p className="text-xs text-charcoal/60 mt-1 font-medium">
            Trace gross platform collections, subscription renewals, and manage upcoming pass expirations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 bg-[#FAF7F2] rounded-3xl border border-black/5 text-right">
            <span className="text-[10px] font-bold text-charcoal/50 uppercase block">Total Net Volume</span>
            <span className="text-2xl font-black text-charcoal">&#8377;{totalGrossRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-black/10 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50 block">Subscriptions Volume</span>
          <span className="text-2xl font-black text-[#4F83FF] mt-2 block">&#8377;{totalSubscriptionRevenue.toLocaleString()}</span>
          <p className="text-[10px] text-charcoal/50 mt-1">Monthly (&#8377;299) &amp; Annual (&#8377;2,999)</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-black/10 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50 block">Hardware Sales Volume</span>
          <span className="text-2xl font-black text-emerald-600 mt-2 block">&#8377;{totalHardwareRevenue.toLocaleString()}</span>
          <p className="text-[10px] text-charcoal/50 mt-1">Custom Laser Metal Cards (&#8377;1,499)</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-black/10 shadow-2xs">
          <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50 block">Average Order Value</span>
          <span className="text-2xl font-black text-charcoal mt-2 block">
            &#8377;{payments.length > 0 ? Math.round(totalGrossRevenue / payments.length).toLocaleString() : 0}
          </span>
          <p className="text-[10px] text-charcoal/50 mt-1">{payments.length} verified transactions</p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* PASS EXPIRATION MANAGEMENT HUB (CRITICAL FEATURE REQUESTED) */}
      {/* ============================================================== */}
      <div className="p-6 md:p-8 rounded-4xl bg-white border border-black/10 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-black/5">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h3 className="font-black text-lg text-charcoal">Membership Pass Expiration Radar</h3>
            </div>
            <p className="text-xs text-charcoal/60 mt-0.5">
              Creators whose active subscription passes are approaching expiration. Extend or renew passes with one click.
            </p>
          </div>

          {/* Expiry Range Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-bold">
            {[
              { days: 7, label: 'Expiring in 7 Days' },
              { days: 14, label: '14 Days' },
              { days: 30, label: '30 Days' },
            ].map((pill) => (
              <button
                key={pill.days}
                type="button"
                onClick={() => setExpiryRange(pill.days)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  expiryRange === pill.days
                    ? 'bg-[#141518] text-white shadow-xs'
                    : 'text-charcoal/60 hover:text-black'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Expiring Passes Table */}
        <div className="mt-5 overflow-x-auto">
          {expiringUsers.length === 0 ? (
            <div className="py-8 text-center text-charcoal/50">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-xs text-charcoal">All clear!</p>
              <p className="text-[11px] text-charcoal/50">No creator passes expiring within the next {expiryRange} days.</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-[10px] font-black uppercase text-charcoal/60">
                <tr>
                  <th className="py-2.5 px-4 rounded-l-xl">Creator</th>
                  <th className="py-2.5 px-3">Current Plan</th>
                  <th className="py-2.5 px-3">Expiration Date</th>
                  <th className="py-2.5 px-3">Days Left</th>
                  <th className="py-2.5 px-4 text-right rounded-r-xl">Admin Extension Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 font-medium">
                {expiringUsers.map((u) => {
                  const isCritical = u.daysLeft <= 7;
                  const isExpired = u.daysLeft <= 0;

                  return (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatarUrl} alt="" className="w-8 h-8 rounded-xl object-cover" />
                          <div>
                            <span className="font-black text-charcoal block">{u.displayName}</span>
                            <span className="text-[10px] text-charcoal/50 font-mono">@{u.username}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[10px] font-black uppercase bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-black/10">
                          {u.plan.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono text-[11px] text-charcoal/70">
                        {u.planExpiresAt ? new Date(u.planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          isExpired
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : isCritical
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-[#EFF4FF] text-[#4F83FF]'
                        }`}>
                          {isExpired ? 'EXPIRED' : `${u.daysLeft} days remaining`}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickExtend(u.id, 30, u.username)}
                            className="px-2.5 py-1 rounded-xl bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 text-[10px] font-black text-charcoal transition-colors cursor-pointer"
                            title="Add 30 Days"
                          >
                            +30 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickExtend(u.id, 365, u.username)}
                            className="px-2.5 py-1 rounded-xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-[10px] font-black transition-colors cursor-pointer shadow-2xs"
                            title="Renew for 1 Year"
                          >
                            +1 Year Pro
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payments History Ledger Table */}
      <div className="bg-white rounded-4xl border border-black/10 shadow-soft overflow-hidden">
        <div className="p-6 border-b border-black/5 flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-charcoal">Platform Payment Transactions</h3>
            <p className="text-xs text-charcoal/60 mt-0.5">Recorded UPI, Credit Card &amp; NetBanking charges</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[10px] font-black uppercase text-charcoal/60">
              <tr>
                <th className="py-3 px-5">Ref # &bull; Date</th>
                <th className="py-3 px-4">Customer Email</th>
                <th className="py-3 px-4">Item &bull; Plan</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-medium">
              {payments.map((p) => {
                const dateStr = new Date(p.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[11px]">
                      <span className="font-bold text-charcoal block">{p.transactionRef}</span>
                      <span className="text-[10px] text-charcoal/50">{dateStr}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal/80">
                      {p.userEmail}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-charcoal">{p.planName}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-charcoal/60">
                      {p.method}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right font-black text-charcoal text-sm">
                      &#8377;{p.amount.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
