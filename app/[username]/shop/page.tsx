'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, MessageCircle, ShieldCheck, ShoppingBag, UserCheck } from 'lucide-react';
import { getStoredProfile, getStoredStore } from '@/lib/storage';
import { initialProfile, initialStore } from '@/lib/mockData';
import { Profile, StoreConfig } from '@/lib/types';
import PublicStore from '@/components/store/PublicStore';

export default function PublicShopPage() {
  const params = useParams();
  const username = (params?.username as string) || 'alex';
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [store, setStore] = useState<StoreConfig>(initialStore);

  useEffect(() => {
    setProfile(getStoredProfile());
    setStore(getStoredStore());
  }, []);

  const products = store.products.filter((product) => product.isActive);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3EDE4] px-4 py-4 text-charcoal sm:px-6 sm:py-7">
      <div className="pointer-events-none absolute -left-40 top-48 h-96 w-96 rounded-full bg-[#F6CFC1]/80 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-[38rem] h-96 w-96 rounded-full bg-[#D9E7C9]/80 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <header className="mb-4 flex items-center justify-between rounded-full border border-white/80 bg-white/75 px-3 py-2.5 shadow-[0_12px_40px_rgba(70,45,30,0.08)] backdrop-blur-xl sm:px-4">
          <a href={`/${username}`} className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black transition-colors hover:bg-[#F3EDE4]"><ArrowLeft className="h-4 w-4" /> Creator profile</a>
          <div className="flex min-w-0 items-center gap-2.5 pr-2"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDF166]"><ShoppingBag className="h-4 w-4" /></div><div className="hidden min-w-0 sm:block"><p className="truncate text-xs font-black">{store.storeName}</p><p className="truncate text-[10px] font-semibold text-charcoal/45">Direct WhatsApp shop</p></div></div>
        </header>

        <section className="relative mb-5 overflow-hidden rounded-[2.25rem] bg-[#C85E40] text-white shadow-[0_24px_80px_rgba(105,54,38,0.22)] sm:rounded-[3rem]">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="relative grid min-h-[420px] lg:grid-cols-[1fr_0.82fr]">
            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] backdrop-blur"><ShoppingBag className="h-3.5 w-3.5" /> Direct Maker Store</div>
              <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[0.98] tracking-tight sm:text-6xl">Thoughtful goods,<br /><span className="text-[#FDEB9B]">made by {profile.displayName.split(' ')[0]}.</span></h1>
              <p className="mt-5 max-w-lg text-sm font-semibold leading-relaxed text-white/75 sm:text-base">{store.description || 'Small-batch products made with care and available to order directly from the creator.'}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-[10px] font-black backdrop-blur"><MessageCircle className="h-3.5 w-3.5" /> Order on WhatsApp</span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-2 text-[10px] font-black backdrop-blur"><ShieldCheck className="h-3.5 w-3.5" /> Direct seller confirmation</span>
              </div>
            </div>
            <div className="relative min-h-[330px] overflow-hidden lg:min-h-full">
              <img src={profile.avatarUrl || 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=1000&auto=format&fit=crop&q=85'} alt={`${profile.displayName}, creator and seller`} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#632B1C]/55 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-[1.5rem] border border-white/25 bg-white/15 p-4 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-black">Meet the maker</p><p className="mt-1 text-[11px] font-semibold text-white/70">Every order reaches {profile.displayName} directly.</p></div><div className="flex items-center gap-1.5 rounded-full bg-[#FDF166] px-2.5 py-1.5 text-[10px] font-black text-charcoal"><UserCheck className="h-3 w-3" /> Verified Creator</div></div>
              </div>
            </div>
          </div>
        </section>

        {!store.enabled || products.length === 0 ? <div className="rounded-4xl border border-black/10 bg-white p-12 text-center shadow-soft"><h1 className="text-xl font-black">Store is not available</h1><p className="mt-2 text-sm font-semibold text-charcoal/50">This creator has not published products yet.</p></div> : <div className="rounded-[2.25rem] border border-white/80 bg-white/70 p-5 shadow-[0_18px_60px_rgba(70,45,30,0.08)] backdrop-blur-xl sm:p-8 lg:p-10"><PublicStore store={store} sellerName={profile.displayName} dark={false} /></div>}

        <footer className="py-8 text-center"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal/35">Made personal with Tapping</p></footer>
      </div>
    </main>
  );
}
