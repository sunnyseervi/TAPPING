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
  Globe
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
      colors: ['#FED5C3', '#E4E0FA', '#FEE575', '#D8ECD7', '#1F2024'],
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
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="absolute top-0 left-0 w-72 h-72 bg-pastel-yellow/30 rounded-full blur-3xl -translate-x-12 -translate-y-12 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-pastel-lavender/35 rounded-full blur-3xl translate-x-16 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-pastel-peach/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between max-w-5xl mx-auto z-10">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-[#1F2024] text-white flex items-center justify-center font-bold text-lg shadow-sm">
            T
          </div>
          <span className="font-bold text-xl tracking-tight text-[#1F2024]">TAPPING</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-pastel-peach text-[#1F2024] font-medium border border-pastel-peach-border">
            SaaS Platform
          </span>
        </div>

        <button
          onClick={() => {
            setOnboardingCompleted(true);
            onComplete();
          }}
          className="text-xs font-semibold px-4 py-2 rounded-full bg-white/80 hover:bg-white text-charcoal shadow-sm border border-black/5 transition-all flex items-center gap-1.5"
        >
          <span>Skip Tour</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Experience Card */}
      <div className="relative w-full max-w-md bg-white rounded-4xl p-6 md:p-8 shadow-card border border-black/5 text-center mt-12 mb-6">
        {/* Step Indicator Pills */}
        <div className="flex justify-center items-center gap-1.5 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === i
                  ? 'w-7 bg-[#1F2024]'
                  : step > i
                  ? 'w-3 bg-pastel-peach-dark'
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
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-28 h-28 my-4 flex items-center justify-center">
                <div className="w-24 h-24 rounded-3xl bg-pastel-peach flex items-center justify-center shadow-soft border border-pastel-peach-border">
                  <div className="w-16 h-16 rounded-2xl bg-[#1F2024] text-white flex items-center justify-center shadow-lg">
                    <Layers className="w-8 h-8 text-pastel-yellow" />
                  </div>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-[#1F2024] tracking-tight mt-2">
                Welcome to Tapping
              </h2>
              <p className="text-sm text-charcoal-muted mt-2 max-w-xs leading-relaxed">
                The all in one SaaS platform combining modern link in bio profiles, digital business cards, dynamic QR codes, and physical metal NFC hardware.
              </p>

              <button
                onClick={() => setStep(2)}
                className="w-full mt-8 py-3.5 px-6 rounded-full bg-[#1F2024] text-white font-medium text-sm flex items-center justify-center gap-2 hover:bg-black transition-transform active:scale-95 shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
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
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-full h-44 bg-pastel-lavender-light rounded-3xl p-4 flex flex-col justify-center items-center relative overflow-hidden border border-pastel-lavender-border my-2">
                <div className="w-14 h-14 rounded-2xl bg-[#1F2024] text-white flex items-center justify-center font-bold text-xl mb-2 shadow-md">
                  <Smartphone className="w-7 h-7 text-pastel-yellow" />
                </div>

                <div className="flex gap-2">
                  <div className="px-3 py-1 rounded-full bg-pastel-peach text-xs font-semibold text-[#1F2024]">
                    Portfolio
                  </div>
                  <div className="px-3 py-1 rounded-full bg-pastel-yellow text-xs font-semibold text-[#1F2024]">
                    LinkedIn
                  </div>
                  <div className="px-3 py-1 rounded-full bg-pastel-mint text-xs font-semibold text-[#1F2024]">
                    GitHub
                  </div>
                </div>

                <span className="text-[11px] font-medium text-charcoal-muted mt-3">
                  Consolidate all public channels into a single high speed bio URL
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-[#1F2024] mt-4">
                Unified Link in Bio
              </h2>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                Organize content blocks, external services, social profiles, and media with responsive pastel themes and live click analytics.
              </p>

              <div className="flex w-full gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-full bg-black/5 hover:bg-black/10 text-xs font-semibold text-charcoal"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 px-6 rounded-full bg-[#1F2024] text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-black"
                >
                  <span>See Physical Cards</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div 
                onClick={() => setCardFlipped(!cardFlipped)}
                className="perspective-1000 w-full h-44 cursor-pointer my-2 relative"
                title="Click card to flip"
              >
                <motion.div
                  animate={{ rotateY: cardFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full preserve-3d relative"
                >
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl metal-matte-black p-5 text-left flex flex-col justify-between text-white border border-white/20">
                    <div className="flex justify-between items-start">
                      <span className="font-bold tracking-widest text-sm text-pastel-yellow">TAPPING</span>
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5 text-pastel-peach" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs tracking-wider text-white/50 font-mono">SMART NFC HARDWARE</p>
                      <p className="font-bold text-sm tracking-widest mt-0.5">{selectedUsername.toUpperCase() || 'ALEX MORGAN'}</p>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl metal-matte-black p-5 text-left flex items-center justify-between text-white border border-white/20">
                    <div>
                      <p className="text-[10px] text-white/60 font-mono">TAP TO CONNECT</p>
                      <p className="text-xs font-semibold text-pastel-peach mt-1">tapping.bio/{selectedUsername}</p>
                    </div>
                    <div className="w-14 h-14 bg-white p-1 rounded-xl flex items-center justify-center">
                      <QrCode className="w-full h-full text-black" />
                    </div>
                  </div>
                </motion.div>
              </div>

              <p className="text-[11px] text-charcoal-muted">
                Click card to view front and back
              </p>

              <h2 className="text-xl md:text-2xl font-bold text-[#1F2024] mt-3">
                Smart NFC Hardware
              </h2>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                Order custom laser engraved metal NFC business cards. Tap any smartphone to share your profile or direct contact card instantly.
              </p>

              <div className="flex w-full gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-full bg-black/5 hover:bg-black/10 text-xs font-semibold text-charcoal"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 px-6 rounded-full bg-[#1F2024] text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-black"
                >
                  <span>Next Features</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="grid grid-cols-2 gap-2.5 w-full my-2">
                <div className="bg-pastel-peach-light border border-pastel-peach-border p-3.5 rounded-2xl text-left">
                  <div className="w-7 h-7 rounded-xl bg-pastel-peach flex items-center justify-center mb-2">
                    <Share2 className="w-4 h-4 text-charcoal" />
                  </div>
                  <h4 className="text-xs font-bold text-charcoal">vCard 3.0 Export</h4>
                  <p className="text-[11px] text-charcoal-muted mt-0.5 leading-tight">Instant phonebook save</p>
                </div>

                <div className="bg-pastel-lavender-light border border-pastel-lavender-border p-3.5 rounded-2xl text-left">
                  <div className="w-7 h-7 rounded-xl bg-pastel-lavender flex items-center justify-center mb-2">
                    <QrCode className="w-4 h-4 text-charcoal" />
                  </div>
                  <h4 className="text-xs font-bold text-charcoal">Permanent QR</h4>
                  <p className="text-[11px] text-charcoal-muted mt-0.5 leading-tight">Vector format downloads</p>
                </div>

                <div className="bg-pastel-yellow-light border border-pastel-yellow-border p-3.5 rounded-2xl text-left">
                  <div className="w-7 h-7 rounded-xl bg-pastel-yellow flex items-center justify-center mb-2">
                    <CreditCard className="w-4 h-4 text-charcoal" />
                  </div>
                  <h4 className="text-xs font-bold text-charcoal">Metal NFC</h4>
                  <p className="text-[11px] text-charcoal-muted mt-0.5 leading-tight">Four metal finishes</p>
                </div>

                <div className="bg-pastel-mint-light border border-pastel-mint-border p-3.5 rounded-2xl text-left">
                  <div className="w-7 h-7 rounded-xl bg-pastel-mint flex items-center justify-center mb-2">
                    <Globe className="w-4 h-4 text-charcoal" />
                  </div>
                  <h4 className="text-xs font-bold text-charcoal">Live Analytics</h4>
                  <p className="text-[11px] text-charcoal-muted mt-0.5 leading-tight">Track views and clicks</p>
                </div>
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-[#1F2024] mt-2">
                Built for Creators and Teams
              </h2>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                Replace traditional paper cards with a durable, verifiable digital identity.
              </p>

              <div className="flex w-full gap-3 mt-6">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-3 rounded-full bg-black/5 hover:bg-black/10 text-xs font-semibold text-charcoal"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 py-3 px-6 rounded-full bg-[#1F2024] text-white font-medium text-xs flex items-center justify-center gap-2 hover:bg-black"
                >
                  <span>Continue to Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-pastel-yellow flex items-center justify-center text-charcoal mb-2 shadow-sm">
                <ShieldCheck className="w-6 h-6 text-charcoal" />
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-[#1F2024]">
                Create Your Account
              </h2>
              <p className="text-xs text-charcoal-muted mt-1 max-w-xs leading-relaxed">
                Authenticate securely via Google OAuth or launch a verified session.
              </p>

              <div className="w-full flex flex-col gap-2.5 mt-5">
                <button
                  onClick={() => setStep(6)}
                  className="w-full py-3 px-4 rounded-2xl border border-black/10 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 text-xs font-semibold text-charcoal shadow-sm transition-all"
                >
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={() => setStep(6)}
                  className="w-full py-3 px-4 rounded-2xl bg-[#1F2024] hover:bg-black text-white flex items-center justify-center gap-2 text-xs font-semibold shadow-md transition-all"
                >
                  <span>Instant Creator Sign In</span>
                </button>
              </div>

              <p className="text-[10px] text-charcoal-muted mt-3">
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
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-pastel-mint flex items-center justify-center text-charcoal mb-2 shadow-sm">
                <AtSign className="w-6 h-6 text-charcoal" />
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-[#1F2024]">
                Claim Your Handle
              </h2>
              <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                Choose your public profile URL and card address.
              </p>

              <div className="w-full mt-5 text-left flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-charcoal uppercase tracking-wider block mb-1">
                    Handle
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs text-charcoal-muted font-mono">
                      tapping.bio/
                    </span>
                    <input
                      type="text"
                      value={selectedUsername}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="username"
                      className="w-full pl-28 pr-10 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black text-xs font-mono font-medium"
                    />
                    <div className="absolute right-3">
                      {isCheckingUsername ? (
                        <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : isUsernameAvailable ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <X className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {isUsernameAvailable ? (
                    <p className="text-[10px] text-emerald-600 mt-1 font-medium">
                      Handle is available
                    </p>
                  ) : (
                    <p className="text-[10px] text-red-500 mt-1 font-medium">
                      Handle must be at least 3 characters
                    </p>
                  )}
                </div>
              </div>

              <button
                disabled={!isUsernameAvailable}
                onClick={handleFinishOnboarding}
                className="w-full mt-6 py-3.5 px-6 rounded-full bg-[#1F2024] hover:bg-black disabled:opacity-50 text-white font-medium text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
              >
                <span>Launch Creator Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
