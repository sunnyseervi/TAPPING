'use client';

import React from 'react';
import { ArrowUpRight, CreditCard, Eye, Link as LinkIcon, MousePointerClick, Package, ShoppingBag, Store } from 'lucide-react';
import { AnalyticsSummary, LinkBlock, Profile, StoreConfig } from '@/lib/types';

interface CreatorDashboardProps {
  profile: Profile;
  links: LinkBlock[];
  store: StoreConfig;
  analytics: AnalyticsSummary;
  onSelectTab: (tab: string) => void;
}

export default function CreatorDashboard({ profile, links, store, analytics, onSelectTab }: CreatorDashboardProps) {
  const activeLinks = links.filter((link) => link.isActive);
  const products = store.products.filter((product) => product.isActive);
  const totalCartAdds = store.products.reduce((sum, product) => sum + (product.cartAdds || 0), 0);
  const popularProducts = [...products]
    .sort((a, b) => ((b.cartAdds || 0) * 3 + (b.viewCount || 0)) - ((a.cartAdds || 0) * 3 + (a.viewCount || 0)))
    .slice(0, 4);
  // Relative URLs keep the server and first client render identical.
  const profileUrl = `/${profile.username}`;
  const shopUrl = `${profileUrl}/shop`;

  const copy = async (value: string, label: string) => {
    const absoluteUrl = new URL(value, window.location.origin).href;
    await navigator.clipboard.writeText(absoluteUrl);
    window.dispatchEvent(new CustomEvent('tapping-toast', { detail: { title: `${label} copied`, message: absoluteUrl, type: 'success' } }));
  };

  const statCards = [
    { label: 'Profile visits', value: analytics.totalViews, icon: Eye, color: '#E3DFF8' },
    { label: 'Link clicks', value: links.reduce((sum, link) => sum + link.clickCount, 0), icon: MousePointerClick, color: '#DDF4FF' },
    { label: 'Store visits', value: store.storeVisits || 0, icon: Store, color: '#FEF0C7' },
    { label: 'WhatsApp handoffs', value: store.whatsappOrders || 0, icon: ShoppingBag, color: '#DDF7E5' },
  ];

  return (
    <section className="space-y-3 sm:space-y-5">
      <div className="relative overflow-hidden rounded-[28px] border border-black/10 bg-white p-4 shadow-soft sm:rounded-4xl sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#E3DFF8]/70 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-14 left-10 h-28 w-28 rounded-full bg-[#FDF166]/50 blur-2xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-charcoal/40 sm:text-xs">Creator workspace</p>
            <h1 className="mt-1.5 text-[22px] font-black leading-tight tracking-tight text-charcoal sm:mt-2 sm:text-2xl">Your pages and store</h1>
            <p className="mt-2 max-w-2xl text-xs font-semibold leading-relaxed text-charcoal/55 sm:text-sm">Real activity from your profile and shop, without sample traffic.</p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button onClick={() => onSelectTab('profile')} className="rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-xs font-black text-charcoal sm:px-4">Edit profile</button>
            <button onClick={() => onSelectTab('store')} className="rounded-2xl bg-[#141518] px-3 py-2.5 text-xs font-black text-white sm:px-4">Manage store</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 xl:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon, color }, index) => (
          <div key={label} className="min-h-36 rounded-[24px] border border-black/8 p-4 shadow-xs sm:min-h-0 sm:rounded-3xl sm:bg-white sm:p-5" style={{ backgroundColor: index < 4 ? color : '#FFFFFF' }}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/75 text-charcoal shadow-2xs sm:h-10 sm:w-10 sm:rounded-2xl" style={{ backgroundColor: index < 4 ? 'rgba(255,255,255,.72)' : color }}><Icon className="h-4 w-4" /></div>
            <p className="mt-4 text-2xl font-black text-charcoal sm:mt-5 sm:text-3xl">{value.toLocaleString('en-IN')}</p>
            <p className="mt-1 text-[11px] font-bold leading-tight text-charcoal/55 sm:text-xs">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:gap-5 xl:grid-cols-12">
        <div className="space-y-3 rounded-[28px] border border-black/10 bg-white p-4 shadow-soft sm:rounded-4xl sm:p-7 xl:col-span-7">
          <div className="flex items-center justify-between"><h2 className="text-base font-black text-charcoal">Published pages</h2><LinkIcon className="h-4 w-4 text-charcoal/35" /></div>
          <PageRow title="Public profile" subtitle={`${activeLinks.length} active links`} url={profileUrl} onCopy={() => copy(profileUrl, 'Profile link')} />
          <PageRow title={store.storeName || 'Store'} subtitle={store.enabled ? `${products.length} published products` : 'Store hidden'} url={shopUrl} onCopy={() => copy(shopUrl, 'Store link')} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 sm:gap-3 sm:pt-2">
            <button onClick={() => onSelectTab('digital-card')} className="flex min-h-20 flex-col justify-between rounded-3xl bg-[#E3DFF8] p-3.5 text-left sm:items-start sm:gap-2 hover:opacity-90 transition-opacity cursor-pointer"><CreditCard className="h-5 w-5" /><span className="text-[11px] font-black leading-tight sm:text-xs">Digital Card &amp; QR</span></button>
            <button onClick={() => onSelectTab('nfc')} className="flex min-h-20 flex-col justify-between rounded-3xl bg-[#FDF166] p-3.5 text-left sm:items-start sm:gap-2 hover:opacity-90 transition-opacity cursor-pointer"><CreditCard className="h-5 w-5" /><span className="text-[11px] font-black leading-tight sm:text-xs">Metal Card Editor</span></button>
            <button onClick={() => onSelectTab('nfc-shop')} className="flex min-h-20 flex-col justify-between rounded-3xl bg-[#B6F554] p-3.5 text-left sm:items-start sm:gap-2 hover:opacity-90 transition-opacity cursor-pointer"><ShoppingBag className="h-5 w-5" /><span className="text-[11px] font-black leading-tight sm:text-xs">Order NFC Tags</span></button>
          </div>
        </div>

        <div className="rounded-[28px] border border-black/10 bg-white p-4 shadow-soft sm:rounded-4xl sm:p-7 xl:col-span-5">
          <div className="flex items-center justify-between"><div><h2 className="text-base font-black text-charcoal">Product activity</h2><p className="mt-1 text-xs font-semibold text-charcoal/50">{totalCartAdds} total cart additions</p></div><Package className="h-4 w-4 text-charcoal/35" /></div>
          <div className="mt-5 space-y-3">
            {popularProducts.length === 0 ? <p className="rounded-3xl bg-[#FAF7F2] p-7 text-center text-xs font-bold text-charcoal/45">No published products yet.</p> : popularProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 rounded-2xl bg-[#FAF7F2] p-3">
                <div className="h-11 w-11 overflow-hidden rounded-xl bg-white">{product.imageUrl && <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-xs font-black text-charcoal">{product.name}</p><p className="mt-1 text-[11px] font-semibold text-charcoal/45">{product.viewCount || 0} views, {product.cartAdds || 0} cart adds</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PageRow({ title, subtitle, url, onCopy }: { title: string; subtitle: string; url: string; onCopy: () => void }) {
  return <div className="rounded-3xl border border-black/8 bg-[#FAF7F2] p-3.5 sm:flex sm:items-center sm:gap-3 sm:p-4"><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-sm font-black text-charcoal">{title}</p><p className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-charcoal/55 sm:hidden">{subtitle}</p></div><p className="mt-1 truncate text-[11px] font-semibold text-charcoal/45 sm:text-xs">{url}</p><p className="mt-1 hidden text-[11px] font-bold text-charcoal/55 sm:block">{subtitle}</p></div><div className="mt-3 grid grid-cols-[1fr_auto] gap-2 sm:mt-0 sm:flex"><button onClick={onCopy} className="rounded-xl bg-white px-3 py-2.5 text-[11px] font-black text-charcoal">Copy link</button><a href={url} target="_blank" rel="noreferrer" className="flex items-center justify-center rounded-xl bg-[#141518] p-2.5 text-white" title={`Open ${title}`}><ArrowUpRight className="h-4 w-4" /></a></div></div>;
}
