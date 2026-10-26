'use client';

import React, { useState, useEffect } from 'react';
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
  Share2, 
  Download, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Globe, 
  Wifi, 
  SlidersHorizontal,
  Palette,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Eye
} from 'lucide-react';
import { saveStoredProfile, getStoredProfile } from '@/lib/storage';
import { downloadVCardFile } from '@/lib/vcard';
import { useToast } from '@/components/ui/Toast';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';
import { CardMaterial } from '@/lib/types';
import TappingLogo from '@/components/brand/TappingLogo';
import IndianFlag from '@/components/ui/IndianFlag';

export default function LandingPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [handle, setHandle] = useState('');
  const [displayHost, setDisplayHost] = useState('tapping.bio');

  // Metal NFC Hardware Studio State in Hero
  const [selectedMaterial, setSelectedMaterial] = useState<CardMaterial>('matte_black');
  const [cardFlipped, setCardFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Active showcase creator tab
  const [activeCreatorIndex, setActiveCreatorIndex] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayHost(window.location.host);
      const p = getStoredProfile();
      if (p && p.username && p.username !== 'alex' && p.username !== 'aarav' && p.username !== 'creator') {
        setIsSignedIn(true);
      }
    }
  }, []);

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'creator';
    const profile = getStoredProfile();
    profile.username = clean;
    saveStoredProfile(profile);
    showToast('Handle Claimed', `Welcome @${clean}! Set up your bio and metal card.`, 'success');
    router.push('/dashboard?tab=profile');
  };

  const handleCopyLink = () => {
    const liveUrl = typeof window !== 'undefined' ? `${window.location.origin}/${handle || 'aarav'}` : `https://${displayHost}/${handle || 'aarav'}`;
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      showToast('Bio Link Copied', liveUrl, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadVCard = () => {
    try {
      downloadVCardFile({
        id: 'vcard_aarav',
        userId: 'aarav',
        firstName: 'Aarav',
        lastName: 'Sharma',
        organization: 'Tapping Technologies India',
        jobTitle: 'Founder & Product Architect',
        workPhone: '+91 98765 43210',
        mobilePhone: '+91 98765 43210',
        workEmail: 'aarav@tapping.bio',
        streetAddress: 'Indiranagar 100ft Road',
        website: typeof window !== 'undefined' ? `${window.location.origin}/aarav` : `https://${displayHost}/aarav`,
        city: 'Bengaluru, Karnataka',
        country: 'India',
        note: 'Saved via Tapping Contact & NFC Platform'
      }, 'aarav-sharma.vcf');
      showToast('Contact Saved to Phone', 'Directly exported Aarav Sharma contact card (.vcf)', 'success');
    } catch {
      showToast('Contact Exported', 'Directly imported Aarav Sharma to phonebook', 'info');
    }
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

  const showcaseCreators = [
    {
      name: 'Aarav Sharma',
      handle: 'aarav',
      role: 'Founder & Hardware Architect',
      location: 'Bengaluru, India',
      avatar: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&auto=format&fit=crop&q=80',
      bio: 'Building contactless NFC hardware and digital identity infrastructure in Bengaluru.',
      badge: 'Hardware & Tech',
      links: [
        { title: 'Tapping Smart Metal NFC Card', sub: 'Laser-etched 13.56MHz chip', clicks: '4,820' },
        { title: 'Book 1:1 Product Advisory Call', sub: '30-min strategy session', clicks: '1,940' },
        { title: 'Bengaluru Founders Meetup RSVP', sub: 'Quarterly hardware summit', clicks: '850' },
      ],
      products: [
        { name: 'Matte Stealth Black NFC', price: '₹1,499', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300' },
        { name: '24K Brushed Gold Card', price: '₹1,999', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300' },
      ]
    },
    {
      name: 'Mira Kapoor',
      handle: 'mirakapoor',
      role: 'Ceramicist & Spatial Designer',
      location: 'Mumbai, India',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      bio: 'Functional daily ceramic objects and sculptural pottery handcrafted in Bandra studio.',
      badge: 'Art & Design',
      links: [
        { title: 'Studio Exhibition RSVP • Mumbai 2026', sub: 'Gallery preview & catalog', clicks: '3,210' },
        { title: 'Weekend Pottery Masterclass', sub: 'Small batch hands-on session', clicks: '2,400' },
        { title: 'Architectural Custom Commissions', sub: 'Inquire for residential spaces', clicks: '980' },
      ],
      products: [
        { name: 'Sculpted Ceramic Mug', price: '₹1,299', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300' },
        { name: 'Terracotta Vase No. 4', price: '₹2,499', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300' },
      ]
    },
    {
      name: 'Rohan Mehra',
      handle: 'rohanmehra',
      role: 'Brand Designer & Creative Director',
      location: 'New Delhi, India',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      bio: 'Crafting brand identities, typography systems, and high-performance digital experiences.',
      badge: 'Brand & Identity',
      links: [
        { title: 'Selected Brand Identity Case Studies', sub: 'Visual design systems & brandbooks', clicks: '5,920' },
        { title: 'Typography & Editorial Portfolio', sub: 'Award-winning print & digital work', clicks: '3,410' },
        { title: 'Book 1:1 Design Studio Consultation', sub: '30-minute creative strategy call', clicks: '1,680' },
      ],
      products: [
        { name: 'Studio Brand Guidelines Template', price: '₹1,499', img: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=300' },
        { name: 'Minimalist Grid System Poster', price: '₹899', img: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300' },
      ]
    }
  ];

  const currentCreator = showcaseCreators[activeCreatorIndex];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#141518] selection:bg-[#FDF166] selection:text-charcoal relative overflow-x-hidden font-sans">
      
      {/* TOP NAVIGATION */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <TappingLogo size="md" showBadge={true} />
        </Link>

        <div className="hidden lg:flex items-center gap-6 text-xs font-bold text-charcoal/70">
          <a href="#showcase" className="hover:text-black transition-colors">Creators</a>
          <a href="#hardware" className="hover:text-black transition-colors">Metal NFC</a>
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#pricing" className="hover:text-black transition-colors">Pricing (₹299)</a>
          <Link href="/aarav" className="hover:text-black transition-colors">Sample Bio Link</Link>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isSignedIn ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-white hover:bg-gray-50 text-xs font-bold text-charcoal shadow-xs transition-colors"
              >
                <span>Sign In</span>
              </Link>

              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION (LINKTREE INSPIRED WITH APPLE-GRADE TYPOGRAPHY) */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-16 flex flex-col items-center text-center relative z-10">
        
        {/* Top Accent Pill with Indian Flag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-black/10 shadow-2xs text-[11px] font-black uppercase tracking-wider text-charcoal/80 mb-6">
          <IndianFlag className="w-4 h-2.8 rounded-xs" />
          <span>The Next-Generation Link-in-Bio for India</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] text-[#141518] leading-[1.02] max-w-5xl">
          Everything you are. <br />
          <span className="text-[#141518]/30">In one simple link in bio.</span>
        </h1>

        {/* Value Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-[#141518]/70 max-w-2xl mt-5 leading-relaxed font-medium">
          Join creators, founders, artists, and professionals sharing everything they create, curate, and sell online and in person with custom themes, product sliders, and smart metal NFC cards.
        </p>

        {/* Interactive Handle Claim Input Bar */}
        <form
          onSubmit={handleClaim}
          className="mt-8 flex flex-col sm:flex-row items-center gap-2.5 p-2 bg-white rounded-3xl sm:rounded-full shadow-card border border-black/10 max-w-xl w-full"
        >
          <div className="flex items-center pl-4 sm:pl-6 flex-1 w-full text-sm font-mono font-bold text-charcoal min-h-[46px]">
            <span className="text-charcoal/40 font-bold select-none">{displayHost}/</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="yourname"
              className="bg-transparent focus:outline-none w-full text-sm font-black text-charcoal placeholder:text-charcoal/30 ml-0.5"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl sm:rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer shrink-0"
          >
            <span>Claim your Tapping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[11px] font-bold text-charcoal/45 mt-3">
          Free to claim • No credit card required • Instant live link
        </p>
      </section>

      {/* HARDWARE & LIVE BIO DEMO: TILTED PHONE + LASER-ENGRAVED METAL NFC CARD */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center justify-center">
          
          {/* LEFT: TILTED IPHONE SHOWCASING REAL CREATOR LINK & DETAILS */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Top Indicator */}
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black text-charcoal tracking-tight">
                Live Bio Profile Preview • @{handle || 'aarav'}
              </span>
            </div>

            {/* THE TILTED IPHONE CHASSIS */}
            <div className="relative group perspective-1000">
              
              {/* iPhone Mockup Frame: Smoothly Tilted at -rotate-2 */}
              <div className="w-[330px] sm:w-[350px] bg-[#141518] rounded-[50px] p-[10px] shadow-2xl border-[3px] border-[#2A2B30] transform -rotate-1 sm:-rotate-2 group-hover:rotate-0 transition-transform duration-500 ease-out select-none relative">
                
                {/* Dynamic Island Notch */}
                <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between bg-[#FAF7F2] rounded-t-[40px] z-20">
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

                {/* SCROLLABLE INNER PHONE SCREEN SHOWING REAL GENERATED CONTENT */}
                <div className="w-full bg-[#FAF7F2] rounded-b-[40px] overflow-y-auto max-h-[580px] no-scrollbar px-4 pt-1 pb-6 flex flex-col items-center text-center">
                  
                  {/* Squircle Avatar with Authentic Indian Flag Picture & Flag Badge */}
                  <div className="relative mt-2">
                    <div className="w-20 h-20 rounded-[24px] overflow-hidden ring-2 ring-white/90 border border-black/10 shadow-sm bg-[#FAF7F2] flex items-center justify-center relative">
                      <img
                        src="https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&auto=format&fit=crop&q=80"
                        alt="Indian Flag - Aarav Sharma"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Resilient fallback to reliable Indian flag URL
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1597058712635-3182d1eacc1e?w=600&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                    {/* Official Indian Flag Badge on Avatar */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center overflow-hidden">
                      <IndianFlag className="w-4 h-2.8 rounded-xs" />
                    </div>
                  </div>

                  {/* Name & Handle */}
                  <h2 className="text-base font-black text-charcoal mt-2.5 tracking-tight leading-tight">
                    Aarav Sharma
                  </h2>
                  <p className="text-[11px] font-bold text-charcoal/60 mt-0.5 font-mono">
                    @{handle || 'aarav'}
                  </p>

                  {/* Work & Location with Indian Flag */}
                  <div className="inline-flex items-center gap-1.5 mt-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white text-charcoal border border-black/10 shadow-2xs">
                    <IndianFlag className="w-3.5 h-2.5 rounded-xs" />
                    <Briefcase className="w-3 h-3 text-[#141518]" />
                    <span>Founder & Architect • Tapping Technologies India</span>
                  </div>

                  <div className="flex items-center gap-1 mt-1 text-[9px] font-semibold text-charcoal/50">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>Bengaluru, Karnataka, India</span>
                  </div>

                  {/* Bio */}
                  <p className="text-[10px] text-charcoal/70 mt-2 max-w-[250px] leading-relaxed font-medium">
                    Founder & Product Architect. Designing smart contactless NFC hardware, digital cards & bio spaces in India.
                  </p>

                  {/* CTA: Save Contact Card */}
                  <button
                    onClick={handleDownloadVCard}
                    className="mt-3 w-full py-2.5 px-4 rounded-2xl bg-[#141518] hover:bg-black text-white text-[11px] font-black flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Contact to Phone (.vcf)</span>
                  </button>

                  {/* Quick Action Row */}
                  <div className="grid grid-cols-2 gap-1.5 w-full mt-2">
                    <a
                      href="tel:+919876543210"
                      className="py-1.5 px-2 rounded-xl bg-white border border-black/10 text-[10px] font-bold text-charcoal flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Phone className="w-2.5 h-2.5 text-[#34A853]" />
                      <span>+91 98765 43210</span>
                    </a>
                    <a
                      href="mailto:aarav@tapping.bio"
                      className="py-1.5 px-2 rounded-xl bg-white border border-black/10 text-[10px] font-bold text-charcoal flex items-center justify-center gap-1 shadow-2xs truncate"
                    >
                      <Mail className="w-2.5 h-2.5 text-[#4F83FF]" />
                      <span className="truncate">Email Aarav</span>
                    </a>
                  </div>

                  {/* Social Icons Strip */}
                  <div className="w-full py-2.5 flex items-center justify-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center shadow-2xs">
                      <InstagramIcon className="w-3.5 h-3.5 text-charcoal" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center shadow-2xs">
                      <TwitterIcon className="w-3.5 h-3.5 text-charcoal" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center shadow-2xs">
                      <LinkedinIcon className="w-3.5 h-3.5 text-charcoal" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white border border-black/10 flex items-center justify-center shadow-2xs">
                      <GithubIcon className="w-3.5 h-3.5 text-charcoal" />
                    </div>
                  </div>

                  {/* Real Link Blocks */}
                  <div className="w-full space-y-2 mt-1">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-black/10 text-charcoal flex items-center justify-between text-left shadow-2xs transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-[#FAF7F2] flex items-center justify-center shrink-0 border border-black/5">
                          <Briefcase className="w-3.5 h-3.5 text-charcoal" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black truncate">Design Portfolio & Works</p>
                          <p className="text-[8px] text-charcoal/60 truncate">Case studies & systems</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-charcoal/50 shrink-0" />
                    </a>

                    <a
                      href="mailto:aarav@tapping.bio"
                      className="p-2.5 rounded-2xl bg-white hover:bg-gray-50 border border-black/10 text-charcoal flex items-center justify-between text-left shadow-2xs transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-xl bg-[#FAF7F2] flex items-center justify-center shrink-0 border border-black/5">
                          <Phone className="w-3.5 h-3.5 text-charcoal" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black truncate">Book 1:1 Product Advisory Call</p>
                          <p className="text-[8px] text-charcoal/60 truncate">30 min advisory call</p>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3 h-3 text-charcoal/50 shrink-0" />
                    </a>
                  </div>

                  <p className="text-[9px] font-black uppercase tracking-widest text-charcoal/50 mt-4 flex items-center justify-center gap-1.5">
                    <IndianFlag className="w-3.5 h-2.5 rounded-xs" />
                    <span>Tapping • Made for India</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: PHYSICAL METAL NFC HARDWARE STUDIO */}
          <div id="hardware" className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left gap-5">
            <div>
              <span className="text-[10px] font-black px-3 py-1 rounded-full bg-white text-charcoal border border-black/10 uppercase tracking-wider shadow-2xs">
                Laser-Engraved Smart Hardware
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#141518] mt-3 tracking-tight">
                Physical Metal NFC Cards
              </h2>
              <p className="text-xs sm:text-sm text-charcoal/70 mt-2 max-w-md font-medium leading-relaxed">
                Tap against any smartphone to transmit your complete bio profile and contact card instantly. Built with encrypted 13.56MHz NTAG216 contactless microchips and aerospace-grade steel.
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
                      FOUNDER & ARCHITECT
                    </p>
                    <h3 className="font-mono font-bold text-xl tracking-widest mt-1 uppercase">
                      AARAV SHARMA
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] font-mono tracking-wider opacity-80">
                        NFC SMART TAP HARDWARE • TAP-IN-9482
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
                        {displayHost}/{handle || 'aarav'}
                      </p>
                    </div>
                    <p className="text-[9px] font-mono opacity-60">
                      ISO 14443A • Water Resistant • Lifetime NFC Core
                    </p>
                  </div>
                  <div className="w-16 h-16 rounded-xl bg-white p-1.5 shadow-xs flex items-center justify-center">
                    <QrCode className="w-full h-full text-charcoal" />
                  </div>
                </div>
              </div>
            </div>

            {/* Material Selector & NFC Simulator Controls */}
            <div className="w-full max-w-[380px] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-charcoal">Finish:</span>
                <span className="text-xs font-mono font-bold text-charcoal/60">
                  {getMaterialName(selectedMaterial)}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {materials.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat.id)}
                    className={`py-2 px-2.5 rounded-2xl border text-[11px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      selectedMaterial === mat.id
                        ? 'bg-white border-black shadow-xs ring-1 ring-black'
                        : 'bg-white/60 border-black/10 hover:bg-white text-charcoal/70'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded-full ${mat.colorDot} border border-black/10`} />
                    <span className="truncate text-[10px]">{mat.name}</span>
                  </button>
                ))}
              </div>

              <div className="mt-2">
                <Link
                  href="/dashboard?tab=nfc"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-[0.99]"
                >
                  <span>Order Custom Metal NFC Card</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDIAN CREATOR SHOWCASE SECTION (REPLACED UGLY SEAT CARD WITH ELEGANT LINKTREE-GRADE SHOWCASE) */}
      <section id="showcase" className="max-w-7xl mx-auto px-6 py-16 border-t border-black/5">
        <div className="text-center mb-10">
          <span className="text-xs font-black px-3.5 py-1 rounded-full bg-white text-charcoal border border-black/10 shadow-2xs uppercase tracking-wider">
            Verified Indian Creators & Brands
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#141518] mt-3 tracking-tight">
            Built for how India creates and sells.
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/65 mt-2 max-w-xl mx-auto font-medium">
            From tech founders in Bangalore to independent artists in Mumbai, see how creators organize their world in one tap.
          </p>

          {/* Creator Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {showcaseCreators.map((c, idx) => (
              <button
                key={c.handle}
                onClick={() => setActiveCreatorIndex(idx)}
                className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                  activeCreatorIndex === idx
                    ? 'bg-[#141518] text-white shadow-xs'
                    : 'bg-white hover:bg-gray-100 text-charcoal border border-black/10'
                }`}
              >
                <span>{c.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                  activeCreatorIndex === idx ? 'bg-white/20 text-white' : 'bg-black/5 text-charcoal/60'
                }`}>
                  @{c.handle}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Showcase Display Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-4xl border border-black/10 p-6 sm:p-10 shadow-card">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left: Profile summary & telemetry */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-20 h-20 rounded-[22px] overflow-hidden border border-black/10 shadow-sm relative">
                <img
                  src={currentCreator.avatar}
                  alt={currentCreator.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="mt-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#4F83FF]">
                  {currentCreator.badge}
                </span>
                <h3 className="text-xl font-black text-charcoal mt-0.5">{currentCreator.name}</h3>
                <p className="text-xs font-mono font-bold text-charcoal/50">
                  {displayHost}/{currentCreator.handle}
                </p>
                <p className="text-xs font-medium text-charcoal/70 mt-2 leading-relaxed">
                  {currentCreator.bio}
                </p>
              </div>

              {/* Creator Metas */}
              <div className="mt-5 w-full pt-5 border-t border-black/5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-charcoal/60">
                  <span>Location</span>
                  <span className="font-bold text-charcoal">{currentCreator.location}</span>
                </div>
                <div className="flex items-center justify-between text-charcoal/60">
                  <span>Role</span>
                  <span className="font-bold text-charcoal">{currentCreator.role}</span>
                </div>
              </div>

              <div className="mt-6 w-full flex flex-col gap-2">
                <Link
                  href={`/${currentCreator.handle}`}
                  className="w-full py-3 rounded-2xl bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Live Bio Page</span>
                </Link>
              </div>
            </div>

            {/* Right: Curated links and products */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-charcoal/50 font-bold">
                Active Smart Blocks & Product Collections
              </span>

              {/* Curated Links */}
              <div className="space-y-2.5">
                {currentCreator.links.map((link, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F2ECE1] border border-black/10 flex items-center justify-between gap-3 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-charcoal truncate">{link.title}</p>
                      <p className="text-[11px] text-charcoal/60 truncate mt-0.5">{link.sub}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-black/5 text-charcoal/70">
                        {link.clicks} clicks
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-charcoal/40" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Product Slider Preview */}
              <div className="mt-2 pt-4 border-t border-black/5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-charcoal">Touch Product Slider</span>
                  <span className="text-[11px] font-bold text-[#4F83FF]">Integrated Store</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {currentCreator.products.map((prod, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col justify-between shadow-2xs"
                    >
                      <div className="w-full aspect-square rounded-xl overflow-hidden bg-white mb-2 border border-black/5">
                        <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-xs font-black text-charcoal truncate">{prod.name}</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span className="text-xs font-black text-charcoal">{prod.price}</span>
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-[#141518] text-white">
                          Buy
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES (CLEAN BENTO GRID WITHOUT CLICHE CARDS) */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-black px-3.5 py-1 rounded-full bg-white text-charcoal border border-black/10 shadow-2xs uppercase tracking-wider">
            All-In-One Identity Suite
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#141518] mt-3 tracking-tight">
            Everything your profile needs. Nothing it doesn't.
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/60 mt-2 max-w-lg mx-auto font-medium">
            Clean architecture designed for ultra-fast mobile loading, zero ad tracking, and effortless contact exchange.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Bento Card 1: Links & Sliders */}
          <div className="bg-white rounded-3xl p-7 border border-black/10 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-black/10 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6 text-charcoal" />
              </div>
              <h3 className="text-lg font-black text-charcoal">Smart Block Architecture</h3>
              <p className="text-xs text-charcoal/70 mt-2 leading-relaxed font-medium">
                Add websites, WhatsApp, Instagram, YouTube, and curated slidable product collections in any order with drag-and-drop simplicity.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-bold text-charcoal/60">
              <span>Drag & Reorder</span>
              <span className="font-mono text-emerald-600">Active</span>
            </div>
          </div>

          {/* Bento Card 2: Contact Card & Dialer */}
          <div className="bg-white rounded-3xl p-7 border border-black/10 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-black/10 flex items-center justify-center mb-4">
                <UserCheck className="w-6 h-6 text-charcoal" />
              </div>
              <h3 className="text-lg font-black text-charcoal">Direct vCard Phonebook Save</h3>
              <p className="text-xs text-charcoal/70 mt-2 leading-relaxed font-medium">
                One tap exports your verified name, phone, email, company, and links straight into iPhone and Android contact books without downloading an app.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs font-bold text-charcoal/60">
              <span>Apple & Android Native</span>
              <span className="font-mono text-emerald-600">vCard 3.0</span>
            </div>
          </div>

          {/* Bento Card 3: Metal NFC */}
          <div className="bg-[#141518] text-white rounded-3xl p-7 shadow-card flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black text-white">Aerospace Metal NFC</h3>
              <p className="text-xs text-white/70 mt-2 leading-relaxed font-medium">
                Laser-engraved stainless steel, brushed gold, and matte black cards powered by NTAG216 contactless microchips that work indefinitely.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-white/60">
              <span>13.56MHz Frequency</span>
              <span className="font-mono text-amber-400">Zero Battery</span>
            </div>
          </div>
        </div>
      </section>

      {/* TRANSPARENT INDIAN RUPEE PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 border-t border-black/5">
        <div className="text-center mb-10">
          <span className="text-xs font-black px-3.5 py-1 rounded-full bg-white text-charcoal border border-black/10 shadow-2xs uppercase tracking-wider">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#141518] mt-3 tracking-tight">
            Simple plans for creators in India.
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/65 mt-2 max-w-lg mx-auto font-medium">
            Publish your link-in-bio, showcase products, generate permanent QR codes, and connect in person.
          </p>

          {/* Monthly / Yearly Billing Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-white border border-black/10 mt-6 shadow-2xs">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-[#141518] text-white shadow-xs'
                  : 'text-charcoal/70 hover:text-black'
              }`}
            >
              Monthly Billing
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-[#141518] text-white shadow-xs'
                  : 'text-charcoal/70 hover:text-black'
              }`}
            >
              <span>Yearly Billing</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">
                Save 16%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Monthly Plan: ₹299 / month */}
          <div className={`p-8 rounded-4xl border flex flex-col justify-between transition-all ${
            billingCycle === 'monthly'
              ? 'bg-white border-2 border-black shadow-card'
              : 'bg-white/60 border-black/10 opacity-90'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-charcoal/60">
                  Monthly Membership
                </span>
                {billingCycle === 'monthly' && (
                  <span className="px-3 py-1 rounded-full bg-[#141518] text-white text-[10px] font-black">
                    Active Plan
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl sm:text-5xl font-black text-charcoal tracking-tight">₹299</span>
                <span className="text-xs font-bold text-charcoal/60">/ month</span>
              </div>
              <p className="text-xs text-charcoal/70 mt-2 font-medium">
                Perfect for independent creators, designers, and consultants building their professional bio space.
              </p>

              <div className="space-y-3 mt-6 pt-6 border-t border-black/5 text-xs font-bold text-charcoal/80">
                {[
                  'Custom Link-in-Bio space (tapping.bio/yourname)',
                  'Slidable Product Showcase & direct buy links',
                  'Clean light, deep dark & custom wallpaper themes',
                  'Permanent Dynamic QR Code (never breaks)',
                  'Digital Visiting Card with 300 DPI PNG & PDF export',
                  'Instant Phonebook Contact Card (.vcf) Save',
                  'Unlimited active link blocks & zero image cropping',
                  'Real-time visitor and click analytics',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard?action=upgrade&plan=monthly"
              className="mt-8 w-full py-3.5 px-4 rounded-2xl bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <span>Activate Monthly (₹299)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Yearly Plan: ₹2,999 / year */}
          <div className={`p-8 rounded-4xl border flex flex-col justify-between transition-all relative overflow-hidden ${
            billingCycle === 'yearly'
              ? 'bg-[#141518] text-white border-2 border-black shadow-2xl'
              : 'bg-white border-black/10'
          }`}>
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                Best Value
              </span>
            </div>

            <div>
              <span className={`text-xs font-black uppercase tracking-wider block ${billingCycle === 'yearly' ? 'text-white/60' : 'text-charcoal/60'}`}>
                Annual Membership (Save 16%)
              </span>

              <div className="flex items-baseline gap-1 mt-4">
                <span className={`text-4xl sm:text-5xl font-black tracking-tight ${billingCycle === 'yearly' ? 'text-white' : 'text-charcoal'}`}>
                  ₹2,999
                </span>
                <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-white/60' : 'text-charcoal/60'}`}>
                  / year (₹250/mo)
                </span>
              </div>
              <p className={`text-xs mt-2 font-medium ${billingCycle === 'yearly' ? 'text-white/70' : 'text-charcoal/70'}`}>
                Everything you need for the entire year plus hardware discounts and priority custom domain access.
              </p>

              <div className={`space-y-3 mt-6 pt-6 border-t text-xs font-bold ${billingCycle === 'yearly' ? 'border-white/10 text-white/85' : 'border-black/5 text-charcoal/80'}`}>
                {[
                  'Everything in Monthly Plan included',
                  'Slidable Product Showcase & direct buy links',
                  'Save 16% with full 12-month account activation',
                  'Custom domain mapping (yourbrand.com)',
                  '20% exclusive discount on Physical Metal NFC Cards',
                  'Priority verified badge & zero platform branding',
                  '300 DPI Vector PDF Visiting Card exporter',
                  'Priority creator support & fast fulfillment',
                ].map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/dashboard?action=upgrade&plan=yearly"
              className="mt-8 w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-100 text-charcoal font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95"
            >
              <span>Activate Yearly (₹2,999)</span>
              <ArrowRight className="w-4 h-4 text-charcoal" />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-charcoal/60">
        <div className="flex items-center gap-2.5">
          <TappingLogo size="xs" variant="full" />
          <IndianFlag className="w-4 h-2.8 rounded-xs" />
          <span className="text-charcoal/50">• Made for Indian Creators</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-charcoal/70 hover:text-black hover:underline">
            Admin Access
          </Link>
          <Link href="/dashboard" className="text-charcoal font-black hover:underline">
            Creator Dashboard →
          </Link>
        </div>
      </footer>
    </div>
  );
}
