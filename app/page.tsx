'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Check, 
  QrCode, 
  CreditCard, 
  Layers, 
  UserCheck, 
  Share2, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Globe, 
  Wifi, 
  Building2,
  ExternalLink,
  Sparkles,
  Repeat
} from 'lucide-react';
import { saveStoredProfile, getStoredProfile } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';
import { CardMaterial } from '@/lib/types';

export default function LandingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [handle, setHandle] = useState('alex');
  const [displayHost, setDisplayHost] = useState('tapping.bio');

  // Metal NFC Hardware Studio State in Hero
  const [selectedMaterial, setSelectedMaterial] = useState<CardMaterial>('matte_black');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [nfcTapped, setNfcTapped] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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

  const handleSimulateNFCTap = () => {
    setNfcTapped(true);
    showToast('NFC Hardware Tap Detected', `Connected via ${getMaterialName(selectedMaterial)} NFC Smart Card`, 'success');
    setTimeout(() => setNfcTapped(false), 3000);
  };

  const handleCopyLink = () => {
    const liveUrl = typeof window !== 'undefined' ? `${window.location.origin}/${handle}` : `https://${displayHost}/${handle}`;
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      showToast('Bio Link Copied', liveUrl, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadVCard = () => {
    showToast('Contact Downloaded', 'Directly imported Alex Morgan to phonebook', 'info');
  };

  const getMaterialClasses = (mat: CardMaterial) => {
    switch (mat) {
      case 'matte_black':
        return 'bg-[#141518] text-white border border-[#2D3036] shadow-2xl';
      case 'brushed_gold':
        return 'bg-[#C8A44D] text-slate-950 border border-[#B28F38] shadow-2xl';
      case 'rose_gold':
        return 'bg-[#C98A94] text-slate-950 border border-[#B57580] shadow-2xl';
      case 'titanium_silver':
        return 'bg-[#E2E5EA] text-slate-950 border border-[#CCD2DA] shadow-2xl';
      default:
        return 'bg-[#141518] text-white';
    }
  };

  const getMaterialName = (mat: CardMaterial) => {
    switch (mat) {
      case 'matte_black': return 'Matte Stealth Black';
      case 'brushed_gold': return '24K Brushed Gold';
      case 'rose_gold': return 'Champagne Rose Gold';
      case 'titanium_silver': return 'Titanium Silver';
    }
  };

  const materials: { id: CardMaterial; name: string; colorDot: string }[] = [
    { id: 'matte_black', name: 'Stealth Black', colorDot: 'bg-[#141518]' },
    { id: 'brushed_gold', name: 'Brushed Gold', colorDot: 'bg-[#C8A44D]' },
    { id: 'rose_gold', name: 'Rose Gold', colorDot: 'bg-[#C98A94]' },
    { id: 'titanium_silver', name: 'Titanium Steel', colorDot: 'bg-[#CCD2DA]' },
  ];

  const marqueeCards = [
    { title: 'Matte Stealth Black NFC', tag: 'Laser Engraved Stainless Steel', badge: '13.56MHz', color: 'bg-[#141518] text-white', accent: 'text-[#FDF166]' },
    { title: 'vCard 3.0 Direct Export', tag: 'Zero App Installation Required', badge: 'Apple & Android', color: 'bg-[#EFF4FF] text-charcoal border border-[#4F83FF]/20', accent: 'text-[#4F83FF]' },
    { title: 'Permanent Dynamic QR Code', tag: 'Vector Crisp Print Quality', badge: 'Dynamic URL', color: 'bg-[#FDF166] text-charcoal border border-black/10', accent: 'text-charcoal' },
    { title: '24K Brushed Gold Hardware', tag: 'Weighted Solid Metallic Core', badge: 'NTAG216 Chip', color: 'bg-[#FAF7F2] text-charcoal border border-black/10', accent: 'text-amber-600' },
    { title: 'Instant Link-in-Bio Space', tag: 'High Converting Pastel Bento System', badge: 'Live Space', color: 'bg-[#B6F554] text-charcoal border border-black/10', accent: 'text-charcoal' },
    { title: 'Physical Metal NFC Studio', tag: 'Laser-Etched Custom Name & UID', badge: 'Hardware Studio', color: 'bg-[#4F83FF] text-white', accent: 'text-[#FDF166]' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-charcoal selection:bg-[#FDF166] selection:text-charcoal relative overflow-x-hidden font-sans">
      
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
          <a href="#hardware" className="hover:text-black transition-colors">Metal NFC</a>
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <Link href="/alex" className="hover:text-black transition-colors">Sample Bio Link</Link>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-white hover:bg-gray-50 text-xs font-bold text-charcoal shadow-xs transition-colors"
          >
            <span>Sign In</span>
          </Link>

          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <span>Creator Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FDF166]" />
          </Link>
        </div>
      </nav>

      {/* HERO HEADER */}
      <section className="max-w-7xl mx-auto px-6 pt-6 pb-12 flex flex-col items-center text-center relative z-10">
        <div className="w-full flex items-center justify-between text-xs font-bold text-charcoal/60 max-w-4xl mb-4 px-2">
          <span>Contact & NFC Ecosystem</span>
          <span className="hidden sm:inline-block max-w-xs text-right">
            Connect and share your profile & contact details in 1 contactless tap
          </span>
        </div>

        <motion.h1 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-charcoal leading-[1.05] max-w-4xl"
        >
          Check Your <br />
          <span className="text-charcoal/35">Creator & Bio Space</span>
        </motion.h1>

        <p className="text-sm sm:text-base text-charcoal/70 max-w-xl mt-4 leading-relaxed font-medium">
          Consolidate your links, export contacts directly to smartphone address books via vCard 3.0, and connect in person with custom laser-engraved metal NFC smart cards.
        </p>

        {/* Claim Handle Bar */}
        <form
          onSubmit={handleClaim}
          className="mt-6 flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-3xl shadow-card border border-black/10 max-w-md w-full"
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
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <span>Claim Space</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </section>

      {/* HERO HARDWARE & LIVE PHONE SHOWCASE: TILTED IPHONE + PHYSICAL METAL NFC CARD */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center justify-center">
          
          {/* LEFT COLUMN (lg:col-span-6): REALISTIC TILTED IPHONE SHOWCASING REAL CREATOR LINK & DETAILS */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Top Indicator */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-charcoal tracking-tight">
                Live Bio Profile Preview &bull; @{handle}
              </span>
            </div>

            {/* THE TILTED IPHONE CHASSIS */}
            <div className="relative group perspective-1000">
              
              {/* iPhone Mockup Frame: Smoothly Tilted at -rotate-3 */}
              <div className="w-[330px] sm:w-[350px] bg-[#141518] rounded-[50px] p-[10px] shadow-2xl border-[3px] border-[#2A2B30] transform -rotate-2 sm:-rotate-3 group-hover:rotate-0 transition-transform duration-500 ease-out select-none relative">
                
                {/* Dynamic Island Notch */}
                <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between bg-[#F7F5EE] rounded-t-[40px] z-20">
                  <span className="text-[11px] font-black font-mono tracking-tight text-charcoal">9:41</span>
                  <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
                    <div className="w-2 h-2 rounded-full bg-neutral-800" />
                  </div>
                  <div className="flex items-center gap-1 text-charcoal">
                    <Wifi className="w-3 h-3 stroke-[2.5]" />
                    <div className="w-3.5 h-1.5 rounded-[2px] border border-charcoal bg-charcoal" />
                  </div>
                </div>

                {/* Simulated NFC Tap Banner when triggered */}
                {nfcTapped && (
                  <div className="absolute top-12 left-4 right-4 z-30 bg-[#141518] text-white p-3 rounded-2xl shadow-float flex items-center gap-2.5 border border-white/20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="w-8 h-8 rounded-xl bg-[#FDF166] flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4 text-charcoal stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-xs font-black text-white">NFC Smart Card Tapped</p>
                      <p className="text-[10px] text-white/70 truncate">Loaded via Contactless Hardware</p>
                    </div>
                  </div>
                )}

                {/* SCROLLABLE INNER PHONE SCREEN SHOWING REAL GENERATED CONTENT */}
                <div className="w-full bg-[#F7F5EE] rounded-b-[40px] overflow-y-auto max-h-[580px] no-scrollbar px-4 pt-1 pb-6 flex flex-col items-center text-center">
                  
                  {/* Avatar */}
                  <div className="relative mt-2">
                    <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-soft bg-[#FDF166]">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
                        alt="Alex Morgan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Name & Handle */}
                  <h2 className="text-base font-black text-charcoal mt-2.5 tracking-tight leading-tight">
                    Alex Morgan
                  </h2>
                  <p className="text-[11px] font-bold text-charcoal/60 mt-0.5 font-mono">
                    @{handle}
                  </p>

                  {/* Work & Location */}
                  <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FDF166] text-charcoal border border-black/10 shadow-2xs">
                    <Briefcase className="w-3 h-3 text-[#4F83FF]" />
                    <span>Product Designer &bull; Tapping Technologies</span>
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-[9px] font-semibold text-charcoal/50">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>742 Market Street, San Francisco, CA</span>
                  </div>

                  {/* Bio */}
                  <p className="text-[10px] text-charcoal/70 mt-2 max-w-[250px] leading-relaxed font-medium">
                    Product Designer & Systems Engineer. Building minimalist digital tools, hardware interfaces, and web applications.
                  </p>

                  {/* CTA: Save Contact Card */}
                  <button
                    onClick={handleDownloadVCard}
                    className="mt-3 w-full py-2.5 px-4 rounded-full bg-[#141518] hover:bg-black text-white text-[11px] font-black flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#FDF166]" />
                    <span>Save Contact to Phone (vCard 3.0)</span>
                  </button>

                  {/* Quick Action Row */}
                  <div className="grid grid-cols-2 gap-1.5 w-full mt-2">
                    <a
                      href="tel:+14158902200"
                      className="py-1.5 px-2 rounded-xl bg-white border border-black/10 text-[10px] font-bold text-charcoal flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Phone className="w-2.5 h-2.5 text-[#34A853]" />
                      <span>+1 415 890 2200</span>
                    </a>
                    <a
                      href="mailto:contact@alexmorgan.design"
                      className="py-1.5 px-2 rounded-xl bg-white border border-black/10 text-[10px] font-bold text-charcoal flex items-center justify-center gap-1 shadow-2xs truncate"
                    >
                      <Mail className="w-2.5 h-2.5 text-[#4F83FF]" />
                      <span className="truncate">Email Alex</span>
                    </a>
                  </div>

                  {/* Structured Contact Box */}
                  <div className="w-full p-2.5 rounded-2xl bg-white border border-black/5 text-left text-[10px] space-y-1 shadow-2xs mt-2.5">
                    <div className="flex justify-between">
                      <span className="font-bold text-charcoal/50">Organization:</span>
                      <span className="font-black text-charcoal">Tapping Technologies</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-charcoal/50">Address:</span>
                      <span className="font-bold text-charcoal">San Francisco, CA, USA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-charcoal/50">Bio Link:</span>
                      <span className="font-mono font-bold text-[#4F83FF]">{displayHost}/{handle}</span>
                    </div>
                  </div>

                  {/* Social Icons Strip */}
                  <div className="w-full py-2.5 flex items-center justify-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white border border-black/10 flex items-center justify-center text-charcoal shadow-2xs">
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white border border-black/10 flex items-center justify-center text-charcoal shadow-2xs">
                      <TwitterIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white border border-black/10 flex items-center justify-center text-charcoal shadow-2xs">
                      <LinkedinIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-white border border-black/10 flex items-center justify-center text-charcoal shadow-2xs">
                      <GithubIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Active Link Blocks Stack */}
                  <div className="w-full flex flex-col gap-2 mt-1">
                    <div className="p-2.5 rounded-2xl bg-[#EFF4FF] border border-[#4F83FF]/20 text-charcoal flex items-center justify-between text-left shadow-2xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shrink-0">
                          <Briefcase className="w-3.5 h-3.5 text-[#4F83FF]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black truncate">Design Portfolio & Works</p>
                          <p className="text-[8px] text-charcoal/60 truncate">Case studies & systems</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-charcoal/50 shrink-0" />
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#FDF166] border border-black/10 text-charcoal flex items-center justify-between text-left shadow-2xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shrink-0">
                          <Phone className="w-3.5 h-3.5 text-charcoal" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black truncate">Book 1:1 Product Strategy</p>
                          <p className="text-[8px] text-charcoal/60 truncate">30 min advisory call</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-charcoal/50 shrink-0" />
                    </div>

                    <div className="p-2.5 rounded-2xl bg-[#B6F554] border border-black/10 text-charcoal flex items-center justify-between text-left shadow-2xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shrink-0">
                          <Layers className="w-3.5 h-3.5 text-charcoal" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black truncate">Core Engineering Stack</p>
                          <p className="text-[8px] text-charcoal/60 truncate">Next.js, TypeScript, Systems</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-charcoal/50 shrink-0" />
                    </div>
                  </div>

                  <p className="text-[9px] font-black uppercase tracking-widest text-charcoal/40 mt-4">
                    Powered by TAPPING
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-6): PHYSICAL METAL NFC HARDWARE STUDIO */}
          <div id="hardware" className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
            <div>
              <span className="text-[10px] font-black px-3 py-1 rounded-full bg-[#B6F554] text-charcoal border border-black/10 uppercase tracking-wider">
                Laser-Engraved Smart Hardware
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-charcoal mt-2 tracking-tight">
                Physical Metal NFC Cards
              </h2>
              <p className="text-xs sm:text-sm text-charcoal/70 mt-1 max-w-md font-medium">
                Tap against any smartphone to transmit your complete bio profile and contact card instantly. Built with encrypted 13.56MHz NTAG216 contactless microchips.
              </p>
            </div>

            {/* 3D INTERACTIVE PHYSICAL METAL NFC CARD */}
            <div className="w-full max-w-[380px] perspective-1000">
              <div
                onClick={() => setCardFlipped(!cardFlipped)}
                className={`w-full h-[220px] rounded-3xl p-6 cursor-pointer preserve-3d transition-transform duration-700 relative select-none shadow-2xl ${getMaterialClasses(
                  selectedMaterial
                )} ${cardFlipped ? 'rotate-y-180' : ''}`}
                title="Click to flip card"
              >
                {/* FRONT OF METAL CARD */}
                <div className="absolute inset-0 backface-hidden p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm tracking-widest uppercase">
                        TAPPING
                      </span>
                      <span className="text-[9px] font-mono opacity-60">NFC 13.56MHz</span>
                    </div>

                    {/* Gold Smart Chip Contact Pads */}
                    <div className="w-10 h-7 rounded-md bg-amber-400 border border-amber-600/50 flex flex-col justify-around p-1 shadow-xs">
                      <div className="w-full h-0.5 bg-amber-700/50" />
                      <div className="w-full h-0.5 bg-amber-700/50" />
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-[9px] tracking-widest uppercase opacity-70">
                      PRODUCT DESIGNER & SYSTEMS ENGINEER
                    </p>
                    <h3 className="font-mono font-bold text-xl tracking-widest mt-1 uppercase">
                      ALEX MORGAN
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-mono tracking-wider opacity-80">
                        NFC SMART TAP HARDWARE &bull; TAP-9482
                      </span>
                    </div>
                  </div>
                </div>

                {/* BACK OF METAL CARD */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 flex items-center justify-between">
                  <div className="flex flex-col justify-between h-full text-left">
                    <div>
                      <span className="font-bold text-xs uppercase tracking-wider block">
                        TAP ANY PHONE TO CONNECT
                      </span>
                      <p className="font-mono text-xs mt-1 opacity-90 font-bold">
                        {displayHost}/{handle}
                      </p>
                    </div>
                    <div className="text-[10px] font-mono opacity-60">
                      UID: 04:A2:8F:9B:41:22
                      <br />
                      Encrypted NTAG216 Chip
                    </div>
                  </div>

                  <div className="w-20 h-20 bg-white p-1.5 rounded-2xl flex items-center justify-center shadow-md">
                    <QrCode className="w-full h-full text-black" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-charcoal/50 font-bold">
              Click card to flip front & back &bull; Laser-engraved precision steel
            </p>

            {/* MATERIAL FINISH SWITCHER BUTTONS */}
            <div className="flex flex-wrap items-center gap-2">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMaterial(m.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    selectedMaterial === m.id
                      ? 'bg-[#141518] text-white shadow-xs'
                      : 'bg-white hover:bg-gray-50 text-charcoal border border-black/10'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${m.colorDot} border border-black/20`} />
                  <span>{m.name}</span>
                </button>
              ))}
            </div>

            {/* ACTION ROW: SIMULATE NFC TAP & GO TO ORDER */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleSimulateNFCTap}
                className="px-5 py-3 rounded-2xl bg-[#FDF166] hover:bg-[#FBE849] text-charcoal text-xs font-black border border-black/10 flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-charcoal" />
                <span>Simulate NFC Hardware Tap</span>
              </button>

              <Link
                href="/dashboard"
                className="px-5 py-3 rounded-2xl bg-white hover:bg-black/5 text-charcoal text-xs font-black border border-black/10 flex items-center gap-2 shadow-xs transition-colors"
              >
                <span>Customize Your Card</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CONTINUOUS INFINITE MARQUEE CAROUSEL */}
      <section className="w-full py-8 overflow-hidden border-y border-black/5 bg-white/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-6 mb-3 flex items-center justify-between text-xs">
          <span className="font-black text-charcoal uppercase tracking-wider text-[10px]">
            Live Ecosystem & Hardware Stream
          </span>
          <span className="text-[10px] font-bold text-charcoal/50">
            Hover to pause &bull; 60fps hardware acceleration
          </span>
        </div>

        <div className="animate-marquee gap-5 px-4">
          {[...marqueeCards, ...marqueeCards].map((card, i) => (
            <div
              key={i}
              className={`p-5 rounded-3xl min-w-[270px] sm:min-w-[300px] h-[130px] flex flex-col justify-between shadow-2xs hover:shadow-card transition-all cursor-pointer ${card.color}`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-[10px] font-black uppercase tracking-wider ${card.accent}`}>
                  {card.badge}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-black leading-tight truncate">{card.title}</h4>
                <p className="text-[11px] opacity-75 mt-0.5 font-semibold truncate">{card.tag}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE FEATURES */}
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
