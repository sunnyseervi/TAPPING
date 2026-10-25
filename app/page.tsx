'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Check, 
  QrCode, 
  CreditCard, 
  Layers, 
  UserCheck, 
  Bell, 
  Share2, 
  MoreVertical, 
  ShieldCheck 
} from 'lucide-react';
import { saveStoredProfile, getStoredProfile } from '@/lib/storage';

export default function LandingPage() {
  const router = useRouter();
  const [handle, setHandle] = useState('alex');
  const [displayHost, setDisplayHost] = useState('tapping.bio');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayHost(window.location.host);
    }
  }, []);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'creator';
    const profile = getStoredProfile();
    profile.username = clean;
    saveStoredProfile(profile);
    router.push('/dashboard');
  };

  const teamAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-charcoal selection:bg-[#FDF166] selection:text-charcoal relative overflow-x-hidden">
      {/* TOP NAVIGATION */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-2xl bg-[#141518] text-white flex items-center justify-center font-black text-lg shadow-sm">
            T
          </div>
          <span className="font-black text-xl tracking-tight text-charcoal">TAPPING</span>
          <span className="hidden sm:inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FDF166] text-charcoal border border-black/10">
            PRO PLATFORM
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-charcoal/70">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#hardware" className="hover:text-black transition-colors">Metal NFC</a>
          <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          <Link href="/alex" className="hover:text-black transition-colors">Public Profile</Link>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-white hover:bg-gray-50 text-xs font-bold text-charcoal shadow-xs transition-colors"
          >
            <span>Google Sign In</span>
          </Link>

          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FDF166]" />
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-16 flex flex-col items-center text-center relative z-10">
        <div className="w-full flex items-center justify-between text-xs font-bold text-charcoal/60 max-w-4xl mb-4 px-2">
          <span>Contact & NFC Ecosystem</span>
          <span className="hidden sm:inline-block max-w-xs text-right">
            An ecosystem that allows you to connect and share your work in 1 contactless tap
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-charcoal leading-[1.05] max-w-4xl">
          Check Your <br />
          <span className="text-charcoal/35">Creator & Bio Space</span>
        </h1>

        <p className="text-sm sm:text-base text-charcoal/70 max-w-xl mt-5 leading-relaxed font-medium">
          Consolidate your links, export contacts directly to smartphone address books via vCard, generate permanent vector QR codes, and connect in person with custom laser-engraved metal NFC cards.
        </p>

        {/* Claim Handle Bar */}
        <form
          onSubmit={handleClaim}
          className="mt-8 flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-3xl shadow-card border border-black/10 max-w-md w-full"
        >
          <div className="flex items-center pl-4 flex-1 w-full text-xs font-mono font-bold text-charcoal">
            <span className="text-charcoal/40 font-bold">{displayHost}/</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="username"
              className="bg-transparent focus:outline-none w-full text-xs font-black text-charcoal"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <span>Claim Space</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[11px] font-bold text-charcoal/50 mt-3">
          Free starter tier available &bull; No credit card required &bull; Direct vCard 3.0 export
        </p>

        {/* HERO SHOWCASE: LIVE IPHONE PHONE FRAME WITH EXACT REFERENCE LAYOUT */}
        <div className="mt-12 w-full max-w-sm sm:max-w-md bg-[#141518] p-3 sm:p-4 rounded-[44px] shadow-float border-4 border-[#2E3036] relative">
          {/* Dynamic Island */}
          <div className="w-24 h-5 bg-black rounded-full mx-auto mb-3" />

          {/* Screen Content inside iPhone Frame */}
          <div className="bg-[#F8F8F6] rounded-[36px] p-5 text-left text-charcoal flex flex-col gap-4 overflow-hidden">
            {/* Top Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-black text-charcoal leading-none">
                  Check Your
                </p>
                <p className="text-2xl font-black text-charcoal/35 leading-none mt-0.5">
                  Bio Space
                </p>
              </div>

              <div className="w-9 h-9 rounded-full bg-[#EFF4FF] flex items-center justify-center shadow-xs">
                <Bell className="w-4 h-4 text-[#4F83FF] stroke-[2.4]" />
              </div>
            </div>

            {/* Sub-header row */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold text-charcoal/70">Sunday</span>
              <div className="flex items-center gap-1">
                <span className="text-xs font-black text-charcoal">5 Links Active</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-charcoal stroke-[2.5]" />
              </div>
            </div>

            {/* Action pill + Big score */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border border-black/10 shadow-xs">
                <div className="w-7 h-7 rounded-full bg-[#141518] text-white flex items-center justify-center">
                  <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="block text-[11px] font-black leading-tight">Share Bio</span>
                  <span className="block text-[9px] font-semibold text-charcoal/50">tapping.bio/alex</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[9px] font-bold text-charcoal/50 block">Overall Engagement CTR</span>
                <span className="text-3xl font-black text-charcoal leading-none">
                  30.5<span className="text-xl font-black text-charcoal/30">%</span>
                </span>
              </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Cobalt Blue Card */}
              <div className="bg-[#4F83FF] text-white rounded-3xl p-4 flex flex-col justify-between h-36 shadow-xs">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-black leading-tight">Physical Metal NFC<br /><span className="text-white/70 font-semibold">TAP-9482 Active</span></span>
                  <MoreVertical className="w-3.5 h-3.5 text-white/80" />
                </div>
                <div>
                  <p className="text-2xl font-black leading-none">24</p>
                  <p className="text-[9px] font-bold text-white/80 mt-1">Hardware Taps</p>
                </div>
              </div>

              {/* Right Tiles & Team */}
              <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-2xl p-2.5 shadow-2xs border border-black/5 flex flex-col items-center justify-center text-center">
                    <UserCheck className="w-5 h-5 text-[#EA4335] mb-0.5" />
                    <span className="text-[8px] font-black text-charcoal">vCard 3.0</span>
                  </div>
                  <div className="bg-white rounded-2xl p-2.5 shadow-2xs border border-black/5 flex flex-col items-center justify-center text-center">
                    <QrCode className="w-5 h-5 text-[#34A853] mb-0.5" />
                    <span className="text-[8px] font-black text-charcoal">Vector QR</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-2.5 border border-black/5 shadow-2xs flex items-center justify-between">
                  <span className="text-[10px] font-bold text-charcoal">Reach</span>
                  <div className="flex items-center -space-x-1.5">
                    {teamAvatars.slice(0, 3).map((u, i) => (
                      <div key={i} className="w-5 h-5 rounded-full overflow-hidden border border-white">
                        <img src={u} alt="audience" className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="w-5 h-5 rounded-full bg-[#FDF166] text-charcoal font-black text-[8px] flex items-center justify-center border border-white">
                      +123
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom 2 Status Cards */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#FDF166] rounded-3xl p-4 flex flex-col justify-between h-24 text-charcoal">
                <p className="text-2xl font-black leading-none">128 <span className="text-xs font-bold text-charcoal/70">visits</span></p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black">Live Traffic</span>
                  <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
                </div>
              </div>

              <div className="bg-[#B6F554] rounded-3xl p-4 flex flex-col justify-between h-24 text-charcoal">
                <p className="text-2xl font-black leading-none">39 <span className="text-xs font-bold text-charcoal/70">clicks</span></p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black">Links Active</span>
                  <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE 4 MODULES IN THE BENTO AESTHETIC */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs font-black px-3 py-1 rounded-full bg-[#FDF166] text-charcoal border border-black/10">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-charcoal mt-3 tracking-tight">
            Designed for Instant Contact & Tap Sharing
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 mt-2 max-w-lg mx-auto font-medium">
            Everything your network needs to connect, save contact details, and view your work in one contactless tap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Module 1: Metal NFC Hardware */}
          <div className="bg-[#4F83FF] text-white rounded-4xl p-7 shadow-card flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5 shadow-xs">
                <CreditCard className="w-6 h-6 text-white stroke-[2.4]" />
              </div>
              <h3 className="font-black text-lg text-white">Metal NFC Hardware</h3>
              <p className="text-xs text-white/80 mt-2 leading-relaxed">
                Precision laser-engraved stainless steel, brushed gold, and matte black NFC cards. Tap against any modern smartphone to transmit your identity.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 text-xs font-black text-white flex items-center gap-1 hover:underline"
            >
              <span>Explore Hardware</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 2: Link in Bio Builder */}
          <div className="bg-[#FDF166] text-charcoal rounded-4xl p-7 shadow-card flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center mb-5 shadow-xs">
                <Layers className="w-6 h-6 text-charcoal stroke-[2.4]" />
              </div>
              <h3 className="font-black text-lg text-charcoal">Link in Bio Creator</h3>
              <p className="text-xs text-charcoal/80 mt-2 leading-relaxed font-medium">
                High-converting mobile-first bio space with drag-and-drop link ordering, pastel bento styling, and zero bloated templates.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 text-xs font-black text-charcoal flex items-center gap-1 hover:underline"
            >
              <span>Manage Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 3: Digital vCard 3.0 */}
          <div className="bg-[#B6F554] text-charcoal rounded-4xl p-7 shadow-card flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center mb-5 shadow-xs">
                <UserCheck className="w-6 h-6 text-charcoal stroke-[2.4]" />
              </div>
              <h3 className="font-black text-lg text-charcoal">Digital vCard 3.0</h3>
              <p className="text-xs text-charcoal/80 mt-2 leading-relaxed font-medium">
                RFC 2426 standards-compliant contact cards. One tap exports name, phone, email, and company directly to Apple & Google phonebooks.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 text-xs font-black text-charcoal flex items-center gap-1 hover:underline"
            >
              <span>Configure vCard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Module 4: Permanent Dynamic QR */}
          <div className="bg-white text-charcoal rounded-4xl p-7 border border-black/10 shadow-card flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#F7F5EE] border border-black/10 flex items-center justify-center mb-5 shadow-xs">
                <QrCode className="w-6 h-6 text-charcoal stroke-[2.4]" />
              </div>
              <h3 className="font-black text-lg text-charcoal">Permanent Vector QR</h3>
              <p className="text-xs text-charcoal/70 mt-2 leading-relaxed font-medium">
                QR codes that never break. Update your bio or change phone numbers without reprinting business cards, menus, or event badges.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 text-xs font-black text-charcoal flex items-center gap-1 hover:underline"
            >
              <span>Generate QR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-charcoal/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#141518] text-white flex items-center justify-center font-black text-xs">
            T
          </div>
          <span className="font-black text-charcoal">TAPPING &bull; Production Platform</span>
        </div>
        <p>Built for modern creators and teams. Zero emojis. Zero double gradients.</p>
        <Link href="/dashboard" className="text-charcoal hover:underline">
          Go to Workspace &rarr;
        </Link>
      </footer>
    </div>
  );
}