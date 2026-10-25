'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Check, 
  QrCode, 
  CreditCard, 
  Layers, 
  UserCheck, 
  Globe
} from 'lucide-react';
import { saveStoredProfile, getStoredProfile } from '@/lib/storage';

export default function LandingPage() {
  const router = useRouter();
  const [handle, setHandle] = useState('alex');

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = handle.toLowerCase().replace(/[^a-z0-9_-]/g, '') || 'creator';
    const profile = getStoredProfile();
    profile.username = clean;
    saveStoredProfile(profile);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-charcoal selection:bg-pastel-peach relative overflow-x-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-pastel-yellow/30 rounded-full blur-3xl pointer-events-none -translate-y-24 translate-x-32" />
      <div className="absolute top-96 left-0 w-[450px] h-[450px] bg-pastel-peach/30 rounded-full blur-3xl pointer-events-none -translate-x-32" />
      <div className="absolute bottom-40 right-1/4 w-[400px] h-[400px] bg-pastel-lavender/35 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#1F2024] text-white flex items-center justify-center font-black text-lg shadow-sm">
            T
          </div>
          <span className="font-extrabold text-xl tracking-tight text-charcoal">TAPPING</span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-pastel-peach text-charcoal border border-pastel-peach-border">
            SaaS Platform
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-charcoal/80">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#hardware" className="hover:text-black transition-colors">Metal NFC</a>
          <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          <a href="/alex" className="hover:text-black transition-colors">Public Profile</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full border border-black/10 bg-white hover:bg-gray-50 text-xs font-semibold text-charcoal shadow-xs transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google Sign In</span>
          </Link>

          <Link
            href="/dashboard"
            className="px-5 py-2.5 rounded-full bg-[#1F2024] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <span>Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5 text-pastel-yellow" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-20 text-center flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pastel-peach text-charcoal text-xs font-bold border border-pastel-peach-border shadow-xs mb-6">
          <span>Smart Link in Bio and Physical NFC Hardware</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-charcoal leading-[1.08] max-w-4xl">
          The unified identity platform for modern creators and teams.
        </h1>

        <p className="text-sm sm:text-base text-charcoal/70 max-w-xl mt-5 leading-relaxed">
          Consolidate your links, export contacts directly to smartphone address books via vCard, generate permanent vector QR codes, and connect in person with custom laser engraved metal NFC cards.
        </p>

        {/* Claim Handle Input */}
        <form
          onSubmit={handleClaim}
          className="mt-8 flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-3xl shadow-card border border-black/10 max-w-md w-full"
        >
          <div className="flex items-center pl-4 flex-1 w-full text-xs font-mono font-medium text-charcoal">
            <span className="text-charcoal-muted">tapping.bio/</span>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="username"
              className="bg-transparent focus:outline-none w-full text-xs font-bold text-charcoal"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#1F2024] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <span>Reserve Handle</span>
            <ArrowRight className="w-3.5 h-3.5 text-pastel-yellow" />
          </button>
        </form>

        <p className="text-[11px] text-charcoal-muted mt-2.5">
          Free starter tier available. No credit card required.
        </p>

        {/* Pastel Feature Badges */}
        <div className="relative w-full max-w-2xl h-32 mt-8 hidden sm:flex items-center justify-center gap-6">
          <div className="p-4 rounded-3xl bg-pastel-rose text-charcoal border border-pastel-rose-border shadow-soft rotate-[-4deg] hover:rotate-0 transition-transform">
            <span className="text-[10px] font-mono font-bold block uppercase">Hardware</span>
            <p className="font-black text-xs mt-0.5">Laser Engraved Metal Card</p>
          </div>

          <div className="p-5 rounded-3xl bg-pastel-yellow text-charcoal border border-pastel-yellow-border shadow-soft rotate-[3deg] hover:rotate-0 transition-transform">
            <span className="text-[10px] font-mono font-bold block uppercase">Contact Card</span>
            <p className="font-black text-sm mt-0.5">Direct vCard 3.0 Export</p>
          </div>

          <div className="w-28 h-28 rounded-full bg-pastel-sky text-charcoal border border-pastel-sky-border shadow-soft flex flex-col items-center justify-center rotate-[-2deg] hover:rotate-0 transition-transform">
            <span className="text-[9px] font-mono font-bold uppercase">Dynamic QR</span>
            <p className="font-bold text-[11px] text-center px-2">Always Vector</p>
          </div>
        </div>
      </section>

      {/* 4 Core Modules Section */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-pastel-mint text-charcoal border border-pastel-mint-border">
            Core Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mt-2 tracking-tight">
            Integrated Tools for Physical and Digital Networking
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-lg mx-auto">
            Everything your audience needs to connect, save contact details, and view your work in one tap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-pastel-peach rounded-4xl p-6 border border-pastel-peach-border shadow-soft flex flex-col justify-between hover:shadow-card transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center mb-4 shadow-xs">
                <Layers className="w-5 h-5 text-charcoal" />
              </div>
              <h3 className="font-extrabold text-base text-charcoal">Link in Bio Builder</h3>
              <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">
                Responsive mobile profiles with drag and drop link management, custom themes, and real conversion metrics.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 text-xs font-bold text-charcoal flex items-center gap-1 hover:underline"
            >
              Configure Links
            </Link>
          </div>

          <div className="bg-pastel-lavender rounded-4xl p-6 border border-pastel-lavender-border shadow-soft flex flex-col justify-between hover:shadow-card transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center mb-4 shadow-xs">
                <UserCheck className="w-5 h-5 text-charcoal" />
              </div>
              <h3 className="font-extrabold text-base text-charcoal">Digital Business Card</h3>
              <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">
                Direct export to Apple and Google address books via vCard 3.0 format. Save complete contact profiles in one click.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 text-xs font-bold text-charcoal flex items-center gap-1 hover:underline"
            >
              Manage vCard
            </Link>
          </div>

          <div className="bg-pastel-mint rounded-4xl p-6 border border-pastel-mint-border shadow-soft flex flex-col justify-between hover:shadow-card transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center mb-4 shadow-xs">
                <QrCode className="w-5 h-5 text-charcoal" />
              </div>
              <h3 className="font-extrabold text-base text-charcoal">Permanent Dynamic QR</h3>
              <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">
                Dynamic vector QR codes with instant destination switching, brand emblem integration, and high resolution export.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 text-xs font-bold text-charcoal flex items-center gap-1 hover:underline"
            >
              Generate QR
            </Link>
          </div>

          <div id="hardware" className="bg-pastel-sky rounded-4xl p-6 border border-pastel-sky-border shadow-soft flex flex-col justify-between hover:shadow-card transition-all">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-white/70 flex items-center justify-center mb-4 shadow-xs">
                <CreditCard className="w-5 h-5 text-charcoal" />
              </div>
              <h3 className="font-extrabold text-base text-charcoal">Smart NFC Metal Cards</h3>
              <p className="text-xs text-charcoal/70 mt-2 leading-relaxed">
                Aerospace grade matte black, brushed gold, rose gold, and silver metal cards with embedded NTAG216 chip.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="mt-6 text-xs font-bold text-charcoal flex items-center gap-1 hover:underline"
            >
              Order Hardware
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-16 text-center">
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-pastel-yellow text-charcoal border border-pastel-yellow-border">
          Transparent Pricing
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal mt-2 tracking-tight">
          Flexible Plans for Individuals and Teams
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted mt-1 max-w-md mx-auto">
          Razorpay secure payments with test mode sandbox and live production switching.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-left">
          <div className="p-6 rounded-4xl bg-white border border-black/10 shadow-soft flex flex-col justify-between">
            <div>
              <h3 className="font-black text-lg text-charcoal">Starter</h3>
              <p className="text-3xl font-black text-charcoal mt-2">$0</p>
              <p className="text-xs text-charcoal-muted mt-1">Free forever</p>
              <div className="space-y-2 mt-6 pt-4 border-t border-black/5 text-xs text-charcoal/80">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unlimited basic links</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Mobile bio page</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Standard QR code</span>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 py-2.5 px-4 rounded-full bg-[#1F2024] text-white text-xs font-bold text-center hover:bg-black"
            >
              Get Started Free
            </Link>
          </div>

          <div className="p-6 rounded-4xl bg-pastel-peach-light border-2 border-charcoal shadow-card flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#1F2024] text-white text-[10px] font-bold">
              POPULAR
            </span>
            <div>
              <h3 className="font-black text-lg text-charcoal">Pro Creator</h3>
              <p className="text-3xl font-black text-charcoal mt-2">
                $9 <span className="text-xs font-normal text-charcoal-muted">per month</span>
              </p>
              <p className="text-xs text-charcoal-muted mt-1">For working creators and founders</p>
              <div className="space-y-2 mt-6 pt-4 border-t border-black/5 text-xs text-charcoal/80">
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digital vCard 3.0 Export</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Permanent Dynamic QR Codes</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hourly Visitor Traffic Flow</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Custom Pastel Bento Themes</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero Platform Branding</span>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 py-2.5 px-4 rounded-full bg-[#1F2024] text-white text-xs font-bold text-center hover:bg-black shadow-md"
            >
              Upgrade to Pro
            </Link>
          </div>

          <div className="p-6 rounded-4xl bg-white border border-black/10 shadow-soft flex flex-col justify-between">
            <div>
              <h3 className="font-black text-lg text-charcoal">Hardware Bundle</h3>
              <p className="text-3xl font-black text-charcoal mt-2">
                $49 <span className="text-xs font-normal text-charcoal-muted">one-time</span>
              </p>
              <p className="text-xs text-charcoal-muted mt-1">Metal card and one year Pro</p>
              <div className="space-y-2 mt-6 pt-4 border-t border-black/5 text-xs text-charcoal/80">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Laser Engraved Metal Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Four Luxury Metal Finishes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Worldwide Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Encrypted NTAG216 Chip</span>
                </div>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="mt-8 py-2.5 px-4 rounded-full bg-[#1F2024] text-white text-xs font-bold text-center hover:bg-black"
            >
              Order Hardware Card
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-muted">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#1F2024] text-white flex items-center justify-center font-bold text-xs">
            T
          </div>
          <span className="font-bold text-charcoal">TAPPING PLATFORM</span>
          <span>All rights reserved.</span>
        </div>

        <div className="flex items-center gap-6 font-semibold">
          <Link href="/dashboard" className="hover:text-charcoal">Creator Dashboard</Link>
          <Link href="/alex" className="hover:text-charcoal">Public Profile</Link>
          <a href="#features" className="hover:text-charcoal">Features</a>
        </div>
      </footer>
    </div>
  );
}
