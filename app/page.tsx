'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Globe, 
  Wifi, 
  Play, 
  Pause,
  ExternalLink,
  X
} from 'lucide-react';
import { saveStoredProfile, getStoredProfile } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';

export default function LandingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [handle, setHandle] = useState('alex');
  const [displayHost, setDisplayHost] = useState('tapping.bio');

  // Interactive phone preview states
  const [activePreviewTab, setActivePreviewTab] = useState<'bento' | 'contact' | 'links'>('bento');
  const [autoPlay, setAutoPlay] = useState(true);
  const [nfcTaps, setNfcTaps] = useState(24);
  const [visits, setVisits] = useState(128);
  const [clicks, setClicks] = useState(39);
  const [copied, setCopied] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayHost(window.location.host);
    }
  }, []);

  // Auto-scroll loop between Bento Overview, Contact Details, and Active Links
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActivePreviewTab((prev) => {
        if (prev === 'bento') return 'contact';
        if (prev === 'contact') return 'links';
        return 'bento';
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [autoPlay]);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'creator';
    const profile = getStoredProfile();
    profile.username = clean;
    saveStoredProfile(profile);
    router.push('/dashboard');
  };

  const handleTapNFC = () => {
    setNfcTaps((prev) => prev + 1);
    showToast('NFC Tap Detected', 'Transmitted via Smart Metal Card TAP-9482', 'success');
  };

  const handleCopyShare = () => {
    const liveUrl = typeof window !== 'undefined' ? `${window.location.origin}/${handle}` : `https://${displayHost}/${handle}`;
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      showToast('Bio Link Copied', liveUrl, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadVCard = () => {
    showToast('vCard 3.0 Downloaded', 'Directly imported Alex Morgan to iPhone Contacts', 'info');
  };

  const teamAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
  ];

  const activeLinksList = [
    { id: 1, title: 'Design Portfolio & Case Studies', sub: 'Mobile apps & design systems', icon: Briefcase, color: 'bg-[#EFF4FF] border-[#4F83FF]/20 text-charcoal' },
    { id: 2, title: 'Book 1:1 Product Strategy', sub: '30 min advisory consultation', icon: Phone, color: 'bg-[#FDF166] border-black/10 text-charcoal' },
    { id: 3, title: 'Engineering & Open Source', sub: 'TypeScript, Next.js, Architecture', icon: Layers, color: 'bg-[#B6F554] border-black/10 text-charcoal' },
    { id: 4, title: 'Direct WhatsApp Line', sub: 'Priority instant communication', icon: Globe, color: 'bg-white border-black/10 text-charcoal' },
  ];

  const marqueeCards = [
    { title: 'Matte Stealth Black NFC', tag: 'Laser Engraved Steel', badge: '13.56MHz', color: 'bg-[#141518] text-white', accent: 'text-[#FDF166]' },
    { title: 'vCard 3.0 Direct Export', tag: 'Zero App Installation Required', badge: 'Apple & Android', color: 'bg-[#EFF4FF] text-charcoal border border-[#4F83FF]/20', accent: 'text-[#4F83FF]' },
    { title: 'Vector Dynamic QR Code', tag: 'Permanent Non-Breaking URL', badge: 'Vector SVG/PNG', color: 'bg-[#FDF166] text-charcoal border border-black/10', accent: 'text-charcoal' },
    { title: '24K Brushed Gold Hardware', tag: 'Weighted Solid Metallic Core', badge: 'NTAG216 Chip', color: 'bg-[#FAF7F2] text-charcoal border border-black/10', accent: 'text-amber-600' },
    { title: 'Instant Bio Hub & Telemetry', tag: '30.5% Average CTR Performance', badge: 'Real Analytics', color: 'bg-[#B6F554] text-charcoal border border-black/10', accent: 'text-charcoal' },
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
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#hardware" className="hover:text-black transition-colors">Metal NFC</a>
          <a href="#preview" className="hover:text-black transition-colors">Live Preview</a>
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
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-16 flex flex-col items-center text-center relative z-10">
        <div className="w-full flex items-center justify-between text-xs font-bold text-charcoal/60 max-w-4xl mb-4 px-2">
          <span>Contact & NFC Ecosystem</span>
          <span className="hidden sm:inline-block max-w-xs text-right">
            An ecosystem that allows you to connect and share your work in 1 contactless tap
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
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <span>Claim Space</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[11px] font-bold text-charcoal/50 mt-3">
          Free starter tier available &bull; No credit card required &bull; Direct vCard 3.0 export
        </p>

        {/* INTERACTIVE CONTROLS BAR ABOVE THE PHONE */}
        <div id="preview" className="mt-10 flex flex-wrap items-center justify-center gap-2 relative z-20">
          <div className="flex items-center bg-white p-1 rounded-2xl border border-black/10 shadow-xs">
            <button
              onClick={() => { setActivePreviewTab('bento'); setAutoPlay(false); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activePreviewTab === 'bento' ? 'bg-[#141518] text-white shadow-xs' : 'text-charcoal/70 hover:text-black'
              }`}
            >
              Bento Space
            </button>
            <button
              onClick={() => { setActivePreviewTab('contact'); setAutoPlay(false); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activePreviewTab === 'contact' ? 'bg-[#4F83FF] text-white shadow-xs' : 'text-charcoal/70 hover:text-black'
              }`}
            >
              Contact Details
            </button>
            <button
              onClick={() => { setActivePreviewTab('links'); setAutoPlay(false); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activePreviewTab === 'links' ? 'bg-[#B6F554] text-charcoal shadow-xs' : 'text-charcoal/70 hover:text-black'
              }`}
            >
              Active Links
            </button>
          </div>

          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-3 py-1.5 rounded-2xl text-xs font-black border border-black/10 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              autoPlay ? 'bg-[#FDF166] text-charcoal' : 'bg-white text-charcoal/60'
            }`}
            title="Toggle Auto Scrolling Preview"
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{autoPlay ? 'Auto-Scrolling' : 'Paused'}</span>
          </button>
        </div>

        {/* HERO SHOWCASE: LIVE IPHONE FRAME WITH FLOATING AMBIENT CARDS */}
        <div className="mt-8 relative w-full max-w-sm sm:max-w-md">
          
          {/* FLOATING CARD 1: TOP-LEFT (Simulated NFC Tap) */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            className="hidden md:flex absolute -left-28 top-14 z-30 bg-white p-3.5 rounded-2xl border border-black/10 shadow-float items-center gap-3 text-left max-w-[210px]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FDF166] flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-charcoal stroke-[2.4]" />
            </div>
            <div>
              <p className="text-[11px] font-black text-charcoal leading-tight">NFC Tap Active</p>
              <p className="text-[9px] font-semibold text-charcoal/60 mt-0.5">TAP-9482 Metal Transmitted</p>
            </div>
          </motion.div>

          {/* FLOATING CARD 2: BOTTOM-RIGHT (vCard 3.0 Sync) */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            className="hidden md:flex absolute -right-28 bottom-24 z-30 bg-white p-3.5 rounded-2xl border border-black/10 shadow-float items-center gap-3 text-left max-w-[220px]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#4F83FF] flex items-center justify-center shrink-0 text-white">
              <UserCheck className="w-4 h-4 stroke-[2.4]" />
            </div>
            <div>
              <p className="text-[11px] font-black text-charcoal leading-tight">vCard 3.0 Exported</p>
              <p className="text-[9px] font-semibold text-charcoal/60 mt-0.5">Saved directly to iPhone Contacts</p>
            </div>
          </motion.div>

          {/* FLOATING CARD 3: BOTTOM-LEFT (Live Traffic Dot) */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
            className="hidden sm:flex absolute -left-20 bottom-8 z-30 bg-[#141518] text-white px-3.5 py-2 rounded-full border border-white/10 shadow-float items-center gap-2 text-left"
          >
            <span className="w-2 h-2 rounded-full bg-[#B6F554] animate-pulse" />
            <span className="text-[10px] font-black tracking-wider uppercase">128 Visits Today</span>
          </motion.div>

          {/* IPHONE CHASSIS */}
          <div className="w-full bg-[#141518] p-3 sm:p-4 rounded-[48px] shadow-float border-4 border-[#2E3036] relative select-none">
            {/* Dynamic Island */}
            <div className="w-24 h-5 bg-black rounded-full mx-auto mb-3 flex items-center justify-between px-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-900/60" />
              <div className="w-2 h-2 rounded-full bg-neutral-800" />
            </div>

            {/* SCREEN CONTENT: Smooth Animated Views (Exact Uploaded Screen 1:1) */}
            <div className="bg-[#F8F8F6] rounded-[36px] p-5 text-left text-charcoal flex flex-col gap-4 overflow-hidden min-h-[480px]">
              
              <AnimatePresence mode="wait">
                {/* VIEW 1: BENTO OVERVIEW (Matching User's Uploaded Image 1:1) */}
                {activePreviewTab === 'bento' && (
                  <motion.div
                    key="bento"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
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
                      <button
                        onClick={() => setActivePreviewTab('links')}
                        className="flex items-center gap-1 group cursor-pointer"
                      >
                        <span className="text-xs font-black text-charcoal group-hover:underline">5 Links Active</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-charcoal stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Action pill + Big CTR score */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={handleCopyShare}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white hover:bg-black/5 border border-black/10 shadow-xs transition-transform active:scale-95 text-left cursor-pointer"
                        title="Click to copy bio link"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#141518] text-white flex items-center justify-center shrink-0">
                          {copied ? <Check className="w-3.5 h-3.5 text-[#B6F554]" /> : <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-[11px] font-black leading-tight text-charcoal truncate">
                            {copied ? 'Link Copied!' : 'Share Bio'}
                          </span>
                          <span className="block text-[9px] font-mono font-semibold text-charcoal/50 truncate">
                            tapping.bio/alex
                          </span>
                        </div>
                      </button>

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
                      <motion.div
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleTapNFC}
                        className="bg-[#4F83FF] hover:bg-[#4375EE] text-white rounded-3xl p-4 flex flex-col justify-between h-36 shadow-xs cursor-pointer transition-all"
                        title="Click to simulate NFC hardware tap"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-black leading-tight">
                            Physical Metal NFC<br />
                            <span className="text-white/70 font-semibold">TAP-9482 Active</span>
                          </span>
                          <MoreVertical className="w-3.5 h-3.5 text-white/80" />
                        </div>

                        <div>
                          <p className="text-3xl font-black leading-none text-white tracking-tight">{nfcTaps}</p>
                          <p className="text-[9px] font-bold text-white/85 mt-1 flex items-center gap-1">
                            <span>Hardware Taps</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#B6F554] animate-pulse" />
                          </p>
                        </div>
                      </motion.div>

                      {/* Right Tiles & Reach */}
                      <div className="flex flex-col gap-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActivePreviewTab('contact')}
                            className="bg-white hover:bg-gray-50 rounded-2xl p-2.5 shadow-2xs border border-black/5 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                            title="View vCard 3.0 Details"
                          >
                            <UserCheck className="w-5 h-5 text-[#EA4335] mb-0.5 stroke-[2.4]" />
                            <span className="text-[8px] font-black text-charcoal">vCard 3.0</span>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowQRModal(true)}
                            className="bg-white hover:bg-gray-50 rounded-2xl p-2.5 shadow-2xs border border-black/5 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                            title="View Vector QR"
                          >
                            <QrCode className="w-5 h-5 text-[#34A853] mb-0.5 stroke-[2.4]" />
                            <span className="text-[8px] font-black text-charcoal">Vector QR</span>
                          </motion.div>
                        </div>

                        <div className="bg-white rounded-2xl p-2.5 border border-black/5 shadow-2xs flex items-center justify-between">
                          <span className="text-[10px] font-black text-charcoal">Reach</span>
                          <div className="flex items-center -space-x-1.5">
                            {teamAvatars.slice(0, 3).map((u, i) => (
                              <div key={i} className="w-5 h-5 rounded-full overflow-hidden border border-white shrink-0">
                                <img src={u} alt="audience" className="w-full h-full object-cover" />
                              </div>
                            ))}
                            <div className="w-5 h-5 rounded-full bg-[#FDF166] text-charcoal font-black text-[8px] flex items-center justify-center border border-white shrink-0">
                              +123
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom 2 Status Cards */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="bg-[#FDF166] rounded-3xl p-4 flex flex-col justify-between h-24 text-charcoal shadow-2xs">
                        <p className="text-2xl font-black leading-none">
                          {visits} <span className="text-xs font-bold text-charcoal/70">visits</span>
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black">Live Traffic</span>
                          <span className="w-2 h-2 rounded-full bg-[#EAB308] animate-pulse" />
                        </div>
                      </div>

                      <div className="bg-[#B6F554] rounded-3xl p-4 flex flex-col justify-between h-24 text-charcoal shadow-2xs">
                        <p className="text-2xl font-black leading-none">
                          {clicks} <span className="text-xs font-bold text-charcoal/70">clicks</span>
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black">Links Active</span>
                          <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* VIEW 2: CONTACT DETAILS (User's Identity & Data) */}
                {activePreviewTab === 'contact' && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center text-center gap-3 pt-2"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-soft bg-[#FDF166]">
                      <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400" alt="Alex Morgan" className="w-full h-full object-cover" />
                    </div>

                    <div>
                      <h3 className="text-base font-black text-charcoal leading-tight">Alex Morgan</h3>
                      <p className="text-[11px] font-bold text-charcoal/60 font-mono">@{handle}</p>
                      
                      <div className="inline-flex items-center gap-1 mt-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FDF166] text-charcoal border border-black/10">
                        <Briefcase className="w-3 h-3 text-[#4F83FF]" />
                        <span>Product Designer &bull; Tapping</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 mt-1 text-[9px] font-semibold text-charcoal/50">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>San Francisco, CA, USA</span>
                      </div>
                    </div>

                    <button
                      onClick={handleDownloadVCard}
                      className="w-full py-2.5 px-4 rounded-full bg-[#141518] hover:bg-black text-white text-[11px] font-black flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer mt-1"
                    >
                      <Download className="w-3.5 h-3.5 text-[#FDF166]" />
                      <span>Save Contact to Phone (vCard 3.0)</span>
                    </button>

                    <div className="grid grid-cols-2 gap-1.5 w-full">
                      <a href="tel:+14158902200" className="py-2 px-2 rounded-xl bg-white border border-black/10 text-[10px] font-bold text-charcoal flex items-center justify-center gap-1 shadow-2xs">
                        <Phone className="w-3 h-3 text-[#34A853]" />
                        <span>+1 415 890 2200</span>
                      </a>
                      <a href="mailto:contact@alexmorgan.design" className="py-2 px-2 rounded-xl bg-white border border-black/10 text-[10px] font-bold text-charcoal flex items-center justify-center gap-1 shadow-2xs truncate">
                        <Mail className="w-3 h-3 text-[#4F83FF]" />
                        <span className="truncate">Email Alex</span>
                      </a>
                    </div>

                    <div className="w-full p-3 rounded-2xl bg-white border border-black/5 text-left text-[10px] space-y-1.5 shadow-2xs">
                      <div className="flex justify-between">
                        <span className="font-bold text-charcoal/50">Organization:</span>
                        <span className="font-black text-charcoal">Tapping Technologies</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-charcoal/50">Office Address:</span>
                        <span className="font-bold text-charcoal">742 Market Street, SF</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-bold text-charcoal/50">Bio Link:</span>
                        <span className="font-mono font-bold text-[#4F83FF]">tapping.bio/{handle}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* VIEW 3: ACTIVE LINKS (User's Custom Link Blocks) */}
                {activePreviewTab === 'links' && (
                  <motion.div
                    key="links"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-2.5 text-left pt-2"
                  >
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-[11px] font-black text-charcoal">Active Content Blocks</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#B6F554] text-charcoal">4 Published</span>
                    </div>

                    {activeLinksList.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          setClicks((prev) => prev + 1);
                          showToast('Link Opened', `Simulated click on ${l.title}`, 'info');
                        }}
                        className={`p-3 rounded-2xl border shadow-2xs cursor-pointer flex items-center justify-between transition-transform active:scale-98 ${l.color}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-white/90 border border-black/5 flex items-center justify-center shrink-0">
                            <l.icon className="w-3.5 h-3.5 text-charcoal" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-black truncate leading-tight">{l.title}</p>
                            <p className="text-[9px] opacity-70 truncate mt-0.5 font-semibold">{l.sub}</p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-3 h-3 text-charcoal/50 shrink-0 ml-1" />
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </section>

      {/* CONTINUOUS INFINITE MARQUEE CAROUSEL OF REAL CARDS & TELEMETRY */}
      <section className="w-full py-10 overflow-hidden border-y border-black/5 bg-white/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-6 mb-4 flex items-center justify-between text-xs">
          <span className="font-black text-charcoal uppercase tracking-wider text-[10px]">
            Live Platform Ecosystem & Hardware Showcase
          </span>
          <span className="text-[10px] font-bold text-charcoal/50">
            Hover to pause &bull; Continuous real-time stream
          </span>
        </div>

        <div className="animate-marquee gap-5 px-4">
          {[...marqueeCards, ...marqueeCards].map((card, i) => (
            <div
              key={i}
              className={`p-5 rounded-3xl min-w-[260px] sm:min-w-[290px] h-[130px] flex flex-col justify-between shadow-2xs hover:shadow-card transition-all cursor-pointer ${card.color}`}
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

      {/* QR MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 sm:p-7 max-w-xs w-full text-center border border-black/10 shadow-float">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-charcoal uppercase tracking-wider">
                Permanent QR Code
              </span>
              <button onClick={() => setShowQRModal(false)} className="text-charcoal/60 hover:text-charcoal">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-3xl border border-black/5 inline-block mx-auto">
              <QrCode className="w-48 h-48 text-[#141518]" />
            </div>
            <p className="font-mono text-xs text-charcoal/60 mt-3 font-bold">
              {displayHost}/{handle}
            </p>
            <button
              onClick={() => {
                setShowQRModal(false);
                showToast('QR Scanned', 'Permanent QR Code Verified', 'success');
              }}
              className="mt-4 w-full py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-bold shadow-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
