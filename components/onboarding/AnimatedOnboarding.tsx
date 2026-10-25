'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Share2, 
  CreditCard, 
  QrCode, 
  Check, 
  AtSign, 
  ShieldCheck, 
  X,
  Smartphone,
  Layers,
  Globe,
  UserCheck
} from 'lucide-react';
import { setOnboardingCompleted, saveStoredProfile, getStoredProfile } from '@/lib/storage';
import { Profile } from '@/lib/types';
import confetti from 'canvas-confetti';

interface OnboardingProps {
  onComplete: () => void;
}

export default function AnimatedOnboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<number>(1);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState('alex');
  const [fullName, setFullName] = useState('Alex Morgan');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  const handleUsernameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setSelectedUsername(clean);
    setIsCheckingUsername(true);
    setTimeout(() => {
      setIsCheckingUsername(false);
      setIsUsernameAvailable(clean.length >= 3 && clean !== 'admin');
    }, 250);
  };

  const handleFinishOnboarding = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4F83FF', '#FDF166', '#B6F554', '#141518'],
    });

    const current = getStoredProfile();
    const updated: Profile = {
      ...current,
      username: selectedUsername || 'creator',
      displayName: fullName || 'Creator',
    };
    saveStoredProfile(updated);
    setOnboardingCompleted(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F5EE] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      {/* Top Header Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between max-w-5xl mx-auto z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#141518] text-white flex items-center justify-center font-black text-lg shadow-sm">
            T
          </div>
          <span className="font-black text-xl tracking-tight text-charcoal">TAPPING</span>
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FDF166] text-charcoal border border-black/10">
            PRO PLATFORM
          </span>
        </div>

        <button
          onClick={() => {
            setOnboardingCompleted(true);
            onComplete();
          }}
          className="text-xs font-black px-4 py-2 rounded-full bg-white hover:bg-black/5 text-charcoal shadow-xs border border-black/10 transition-all flex items-center gap-1.5"
        >
          <span>Skip Tour</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Experience Bento Card */}
      <div className="relative w-full max-w-md bg-white rounded-4xl p-6 md:p-8 shadow-card border border-black/10 text-center mt-12 mb-6">
        {/* Step Indicator Pills */}
        <div className="flex justify-center items-center gap-1.5 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i
                  ? 'w-7 bg-[#141518]'
                  : step > i
                  ? 'w-3 bg-[#4F83FF]'
                  : 'w-2 bg-black/10'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Introduction */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-3xl bg-[#FDF166] flex items-center justify-center shadow-soft border border-black/10 my-4">
                <div className="w-16 h-16 rounded-2xl bg-[#141518] text-white flex items-center justify-center font-black text-2xl shadow-sm">
                  T
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight mt-2">
                Check Your <br />
                <span className="text-charcoal/40">Bio & NFC Space</span>
              </h2>
              <p className="text-xs text-charcoal/70 mt-2 max-w-xs leading-relaxed font-medium">
                The all-in-one platform combining modern link-in-bio profiles, digital business cards, dynamic QR codes, and laser-engraved metal NFC hardware.
              </p>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-8 py-3.5 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm"
              >
                <span>Explore Digital Profile</span>
                <ArrowRight className="w-4 h-4 text-[#FDF166]" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Unified Profile */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <div className="w-full bg-[#F7F5EE] rounded-3xl p-5 flex flex-col justify-center items-center border border-black/10 my-2">
                <div className="w-12 h-12 rounded-2xl bg-[#4F83FF] text-white flex items-center justify-center mb-3 shadow-xs">
                  <Smartphone className="w-6 h-6 stroke-[2.4]" />
                </div>

                <div className="flex gap-2">
                  <div className="px-3 py-1 rounded-full bg-[#FDF166] text-xs font-black text-charcoal border border-black/10">
                    Portfolio
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white text-xs font-black text-charcoal border border-black/10">
                    vCard 3.0
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#B6F554] text-xs font-black text-charcoal border border-black/10">
                    Vector QR
                  </div>
                </div>

                <span className="text-[11px] font-bold text-charcoal/60 mt-3">
                  Consolidate all public channels into a single high-speed bio URL
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight mt-4">
                Unified Bio Space
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 leading-relaxed font-medium">
                Organize content blocks, external services, social profiles, and media with live click telemetry.
              </p>

              <div className="flex w-full gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-full bg-black/5 hover:bg-black/10 text-xs font-black text-charcoal"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>See Physical Cards</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FDF166]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Smart NFC Hardware */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <div 
                onClick={() => setCardFlipped(!cardFlipped)}
                className="perspective-1000 w-full h-44 cursor-pointer my-2 relative"
                title="Click card to flip"
              >
                <motion.div
                  animate={{ rotateY: cardFlipped ? 180 : 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full preserve-3d relative"
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl bg-[#141518] p-5 text-left flex flex-col justify-between text-white border border-white/20 shadow-md">
                    <div className="flex justify-between items-start">
                      <span className="font-black tracking-widest text-sm text-[#FDF166]">TAPPING</span>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5 text-[#FDF166]" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-wider text-white/50 font-mono">SMART NFC HARDWARE &bull; NTAG216</p>
                      <p className="font-black text-sm tracking-widest mt-0.5">{selectedUsername.toUpperCase() || 'ALEX MORGAN'}</p>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-[#141518] p-5 text-left flex items-center justify-between text-white border border-white/20 shadow-md">
                    <div>
                      <p className="text-[10px] text-white/60 font-mono">TAP TO CONNECT</p>
                      <p className="text-xs font-black text-[#FDF166] mt-1">tapping.bio/{selectedUsername}</p>
                    </div>
                    <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center">
                      <QrCode className="w-full h-full text-black" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <p className="text-[10px] font-bold text-charcoal/50">
                Click card to view front and back
              </p>

              <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight mt-3">
                Smart Metal NFC
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 leading-relaxed font-medium">
                Heavyweight laser-engraved metal business cards. Tap any smartphone to share your profile or direct contact card in 1 second.
              </p>

              <div className="flex w-full gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-full bg-black/5 hover:bg-black/10 text-xs font-black text-charcoal"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Key Features</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FDF166]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Features */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <div className="grid grid-cols-2 gap-3 w-full my-2 text-left">
                <div className="bg-[#EFF4FF] border border-[#4F83FF]/20 p-3.5 rounded-2xl">
                  <div className="w-7 h-7 rounded-xl bg-[#4F83FF] text-white flex items-center justify-center mb-2 shadow-2xs">
                    <UserCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <h4 className="text-xs font-black text-charcoal">vCard 3.0 Export</h4>
                  <p className="text-[10px] text-charcoal/60 mt-0.5 font-bold">Instant phonebook save</p>
                </div>

                <div className="bg-[#F7F5EE] border border-black/10 p-3.5 rounded-2xl">
                  <div className="w-7 h-7 rounded-xl bg-white border border-black/10 flex items-center justify-center mb-2 shadow-2xs">
                    <QrCode className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
                  </div>
                  <h4 className="text-xs font-black text-charcoal">Permanent QR</h4>
                  <p className="text-[10px] text-charcoal/60 mt-0.5 font-bold">Vector SVG & PNG</p>
                </div>

                <div className="bg-[#FDF166] border border-black/10 p-3.5 rounded-2xl">
                  <div className="w-7 h-7 rounded-xl bg-white border border-black/10 flex items-center justify-center mb-2 shadow-2xs">
                    <CreditCard className="w-4 h-4 text-charcoal stroke-[2.2]" />
                  </div>
                  <h4 className="text-xs font-black text-charcoal">Metal NFC</h4>
                  <p className="text-[10px] text-charcoal/60 mt-0.5 font-bold">Laser engraved finishes</p>
                </div>

                <div className="bg-[#B6F554] border border-black/10 p-3.5 rounded-2xl">
                  <div className="w-7 h-7 rounded-xl bg-white border border-black/10 flex items-center justify-center mb-2 shadow-2xs">
                    <Share2 className="w-4 h-4 text-charcoal stroke-[2.2]" />
                  </div>
                  <h4 className="text-xs font-black text-charcoal">Live Telemetry</h4>
                  <p className="text-[10px] text-charcoal/60 mt-0.5 font-bold">Track taps and clicks</p>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight mt-2">
                Built for Modern Creators
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 leading-relaxed font-medium">
                Replace disposable paper business cards with an intelligent, durable contactless identity.
              </p>

              <div className="flex w-full gap-3 mt-6">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-3 rounded-full bg-black/5 hover:bg-black/10 text-xs font-black text-charcoal"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 py-3 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FDF166]" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Authentication */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FDF166] border border-black/10 flex items-center justify-center text-charcoal mb-2 shadow-xs">
                <ShieldCheck className="w-6 h-6 text-charcoal stroke-[2.4]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
                Create Your Account
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 max-w-xs leading-relaxed font-medium">
                Authenticate securely via Google OAuth or launch a verified creator session.
              </p>

              <div className="w-full flex flex-col gap-2.5 mt-5">
                <button
                  onClick={() => setStep(6)}
                  className="w-full py-3.5 px-4 rounded-2xl border border-black/15 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 text-xs font-black text-charcoal shadow-xs transition-all active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={() => setStep(6)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#141518] hover:bg-black text-white flex items-center justify-center gap-2 text-xs font-black shadow-xs transition-all active:scale-[0.98]"
                >
                  <span>Instant Verified Access</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FDF166]" />
                </button>
              </div>

              <p className="text-[10px] text-charcoal/50 mt-3 font-semibold">
                Protected with Supabase Authentication and Row Level Security.
              </p>
            </motion.div>
          )}

          {/* STEP 6: Claim Username */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#B6F554] border border-black/10 flex items-center justify-center text-charcoal mb-2 shadow-xs">
                <AtSign className="w-6 h-6 text-charcoal stroke-[2.4]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
                Claim Your Handle
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 leading-relaxed font-medium">
                Choose your public profile URL and card address.
              </p>

              <div className="w-full mt-5 text-left flex flex-col gap-3">
                <div>
                  <label className="text-[10px] font-black text-charcoal/80 uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 text-xs font-bold text-charcoal"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-charcoal/80 uppercase tracking-wider block mb-1">
                    Handle
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs text-charcoal/50 font-bold">
                      tapping.bio/
                    </span>
                    <input
                      type="text"
                      value={selectedUsername}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="username"
                      className="w-full pl-28 pr-10 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 focus:outline-none focus:ring-2 focus:ring-charcoal/20 text-xs font-black text-charcoal"
                    />
                    <div className="absolute right-3.5">
                      {isCheckingUsername ? (
                        <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : isUsernameAvailable ? (
                        <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                      ) : (
                        <X className="w-4 h-4 text-rose-500 stroke-[2.5]" />
                      )}
                    </div>
                  </div>
                  {isUsernameAvailable ? (
                    <p className="text-[10px] text-emerald-600 mt-1 font-bold">
                      Handle is available
                    </p>
                  ) : (
                    <p className="text-[10px] text-rose-500 mt-1 font-bold">
                      Handle must be at least 3 characters
                    </p>
                  )}
                </div>
              </div>

              <button
                disabled={!isUsernameAvailable}
                onClick={handleFinishOnboarding}
                className="w-full mt-6 py-3.5 px-6 rounded-full bg-[#141518] hover:bg-black disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm"
              >
                <span>Launch Creator Studio</span>
                <ArrowRight className="w-4 h-4 text-[#FDF166]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
