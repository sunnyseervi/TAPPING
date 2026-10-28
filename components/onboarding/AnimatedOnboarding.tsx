'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CreditCard, 
  Check, 
  AtSign, 
  ShieldCheck, 
  X,
  Smartphone,
  Lock,
  Phone,
  AlertCircle,
  Copy,
  Sparkles,
  ExternalLink,
  Zap,
  Radio,
  BadgeCheck
} from 'lucide-react';
import { 
  checkUsernameAvailability, 
  sanitizeUsername, 
  activateUserProfile, 
  getStoredProfile,
  saveStoredProfile
} from '@/lib/storage';
import { Profile } from '@/lib/types';
import confetti from 'canvas-confetti';
import TappingLogo from '@/components/brand/TappingLogo';
import { useToast } from '@/components/ui/Toast';

interface OnboardingProps {
  onComplete: () => void;
}

export default function AnimatedOnboarding({ onComplete }: OnboardingProps) {
  const { showToast } = useToast();

  // 4 Clean Steps: 1=Google Sign-In, 2=Claim Handle & Details, 3=Payment Activation, 4=Success Celebration
  const [step, setStep] = useState<number>(1);

  // Authentication State
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showManualEmail, setShowManualEmail] = useState(false);

  // Profile & Handle Details State
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [rawUsername, setRawUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<{
    checked: boolean;
    available: boolean;
    normalized: string;
    reason?: string;
  }>({
    checked: false,
    available: false,
    normalized: '',
  });

  // Payment State
  const [selectedPlan, setSelectedPlan] = useState<'pro_monthly' | 'pro_yearly'>('pro_monthly');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activatedHandle, setActivatedHandle] = useState('');
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);

  const displayHost = typeof window !== 'undefined' ? window.location.host : 'tapping.bio';

  // Initialize with existing profile data if present
  useEffect(() => {
    const existing = getStoredProfile();
    if (existing) {
      if (existing.displayName) setFullName(existing.displayName);
      if (existing.socialLinks?.email) setUserEmail(existing.socialLinks.email);
      if (existing.mobileNumber) {
        const digits = existing.mobileNumber.replace(/\D/g, '').slice(-10);
        if (digits) setMobileNumber(digits);
      }
      if (existing.username && existing.username !== 'aarav' && existing.username !== 'alex') {
        setRawUsername(existing.username);
      }
    }
  }, []);

  // Handle asynchronous username availability checking
  useEffect(() => {
    if (!rawUsername.trim()) {
      setUsernameStatus({ checked: false, available: false, normalized: '' });
      return;
    }

    setIsCheckingUsername(true);
    const timer = setTimeout(() => {
      const result = checkUsernameAvailability(rawUsername);
      setUsernameStatus({
        checked: true,
        available: result.available,
        normalized: result.normalized,
        reason: result.reason,
      });
      setIsCheckingUsername(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [rawUsername]);

  // Handle Google Sign-In (instant authentication with no OTP)
  const handleGoogleSignIn = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      const existing = getStoredProfile();
      const googleName = fullName || existing.displayName || 'Creator';
      const googleEmail = userEmail || `${sanitizeUsername(googleName || 'creator')}@gmail.com`;
      setUserEmail(googleEmail);
      setFullName(googleName);

      const updated: Profile = {
        ...existing,
        displayName: googleName,
        isVerified: true,
      };
      saveStoredProfile(updated);

      setIsAuthenticating(false);
      showToast('Signed in with Google', `Welcome, ${googleName}!`, 'success');
      setStep(2); // Advance directly to claiming handle & contact details
    }, 450);
  };

  // Continue with manual email (also zero OTP)
  const handleManualEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) {
      showToast('Email Required', 'Please enter your email to continue', 'error');
      return;
    }
    const existing = getStoredProfile();
    const updated: Profile = {
      ...existing,
      socialLinks: {
        ...existing.socialLinks,
        email: userEmail.trim(),
      },
      isVerified: true,
    };
    saveStoredProfile(updated);
    showToast('Session Started', `Welcome, ${userEmail}`, 'success');
    setStep(2);
  };

  // Validate step 2 details and proceed to payment
  const handleProceedToPayment = () => {
    const cleanDigits = mobileNumber.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');

    if (!usernameStatus.checked || !usernameStatus.available) {
      showToast('Choose Handle', 'Please select an available unique handle', 'error');
      return;
    }

    setStep(3); // Proceed to plan selection & payment
  };

  // Process Subscription Payment & Activate Profile
  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    const cleanDigits = mobileNumber.replace(/\D/g, '');
    const fullPhone = `${countryCode} ${cleanDigits}`;
    const amount = selectedPlan === 'pro_yearly' ? 2999 : 299;

    setTimeout(() => {
      const { user } = activateUserProfile({
        username: usernameStatus.normalized,
        mobileNumber: fullPhone,
        fullName: fullName.trim() || usernameStatus.normalized,
        email: userEmail || `${usernameStatus.normalized}@tapping.bio`,
        plan: selectedPlan,
        paymentMethod: 'UPI',
        amount,
      });

      setActivatedHandle(user.username);
      setIsProcessingPayment(false);

      // Trigger multi-burst confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.55 },
          colors: ['#4F83FF', '#B6F554', '#FDF166', '#141518'],
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#B6F554', '#FDF166'],
          });
        }, 200);
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#4F83FF', '#B6F554'],
          });
        }, 400);
      } catch {
        // Safe fallback if confetti canvas fails
      }

      showToast(
        'Payment Confirmed!',
        `Your creator link is live at tapping.bio/${user.username}`,
        'success'
      );
      setStep(4); // Advance to Animated Success Page
    }, 1100);
  };

  // Multi-burst confetti on success screen mount
  useEffect(() => {
    if (step === 4) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#4F83FF', '#B6F554', '#FDF166', '#141518'],
        });
      } catch {
        // Ignore
      }
    }
  }, [step]);

  return (
    <div className="fixed inset-0 z-50 bg-[#F7F5EE]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      {/* Top Header Branding */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between max-w-4xl mx-auto z-10">
        <div className="flex items-center gap-3">
          <TappingLogo size="sm" variant="full" />
          <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FDF166] text-charcoal border border-black/10">
            CREATOR ONBOARDING
          </span>
        </div>

        {step < 4 && (
          <div className="text-xs font-black text-charcoal/60 bg-white px-3.5 py-1.5 rounded-full border border-black/10 shadow-2xs">
            Step {step} of 3
          </div>
        )}
      </div>

      {/* Main Container Card */}
      <div className="relative w-full max-w-lg bg-white rounded-4xl p-6 sm:p-8 shadow-card border border-black/10 text-center mt-14 mb-8">
        {/* Step Indicator Progress (Only during setup steps) */}
        {step < 4 && (
          <div className="flex justify-center items-center gap-1.5 mb-7">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === i
                    ? 'w-8 bg-[#141518]'
                    : step > i
                    ? 'w-3.5 bg-[#4F83FF]'
                    : 'w-2 bg-black/10'
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Welcome & Google Sign Up */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-[#FDF166] border border-black/10 flex items-center justify-center my-2 shadow-soft">
                <Zap className="w-8 h-8 text-charcoal stroke-[2.3]" />
              </div>

              <TappingLogo size="xl" className="my-1.5" />

              <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
                Welcome to Tapping Creator Studio
              </h2>
              <p className="text-xs text-charcoal/70 mt-2 max-w-sm leading-relaxed font-medium">
                Claim your permanent bio link, connect contactless smart metal NFC cards, and launch your verified creator identity.
              </p>

              <div className="grid grid-cols-2 gap-2.5 w-full my-5 text-left text-xs">
                <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-black/5">
                  <div className="w-7 h-7 rounded-xl bg-[#4F83FF] text-white flex items-center justify-center mb-1.5 shadow-2xs">
                    <Smartphone className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <h4 className="font-black text-charcoal">Smart Bio Link</h4>
                  <p className="text-[10px] text-charcoal/60 mt-0.5">Custom themes & products</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-black/5">
                  <div className="w-7 h-7 rounded-xl bg-[#141518] text-[#FDF166] flex items-center justify-center mb-1.5 shadow-2xs">
                    <CreditCard className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <h4 className="font-black text-charcoal">Laser Metal NFC</h4>
                  <p className="text-[10px] text-charcoal/60 mt-0.5">Aerospace grade hardware</p>
                </div>
              </div>

              {/* Primary Google Sign-In Action */}
              <div className="w-full flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isAuthenticating}
                  className="w-full py-4 px-6 rounded-2xl border-2 border-black/15 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 text-sm font-black text-charcoal shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
                >
                  {isAuthenticating ? (
                    <div className="w-5 h-5 border-2 border-charcoal/20 border-t-charcoal rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  )}
                  <span>{isAuthenticating ? 'Connecting Google Account...' : 'Continue with Google'}</span>
                </button>

                {/* Optional manual email trigger (zero OTP) */}
                {!showManualEmail ? (
                  <button
                    type="button"
                    onClick={() => setShowManualEmail(true)}
                    className="text-xs font-bold text-charcoal/60 hover:text-charcoal py-1 transition-colors cursor-pointer"
                  >
                    Or continue with email address
                  </button>
                ) : (
                  <form onSubmit={handleManualEmailContinue} className="flex flex-col gap-2.5 mt-1 text-left">
                    <label className="text-[10px] font-black text-charcoal/70 uppercase tracking-wider block">
                      Creator Email
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="creator@example.com"
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-2xl bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-transform active:scale-[0.98]"
                    >
                      <span>Continue to Profile Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#FDF166]" />
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Claim Handle & Details (NO OTP) */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#B6F554] border border-black/10 text-charcoal flex items-center justify-center mb-2 shadow-xs">
                <AtSign className="w-6 h-6 stroke-[2.4]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
                Claim Your Unique Handle
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 max-w-sm leading-relaxed font-medium">
                Set your creator name, contact number for deliveries, and claim your permanent bio URL.
              </p>

              <div className="w-full mt-5 text-left flex flex-col gap-3.5">
                {/* Display Name */}
                <div>
                  <label className="text-[10px] font-black text-charcoal/80 uppercase tracking-wider block mb-1">
                    Creator / Brand Display Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Aarav Sharma or Brand Studio"
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                  />
                </div>

                {/* Mobile Phone Number (Direct Contact, No OTP Required) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-black text-charcoal/80 uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      NFC Delivery Contact
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="px-3 py-3 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal/20 shrink-0"
                    >
                      <option value="+91">+91 (IN)</option>
                      <option value="+1">+1 (US)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+971">+971 (UAE)</option>
                      <option value="+65">+65 (SG)</option>
                    </select>

                    <input
                      type="tel"
                      value={mobileNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^\d\s]/g, '');
                        setMobileNumber(val);
                        if (phoneError) setPhoneError('');
                      }}
                      placeholder="98765 43210"
                      maxLength={14}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                    />
                  </div>
                  {phoneError && (
                    <p className="text-[10px] font-bold text-rose-600 mt-1">{phoneError}</p>
                  )}
                </div>

                {/* Handle / Username */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-black text-charcoal/80 uppercase tracking-wider">
                      Permanent Bio Handle
                    </label>
                    <span className="text-[10px] text-charcoal/50 font-medium">
                      (Unique to your profile)
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs text-charcoal/50 font-mono font-bold select-none">
                      {displayHost}/
                    </span>
                    <input
                      type="text"
                      value={rawUsername}
                      onChange={(e) => setRawUsername(e.target.value)}
                      placeholder="yourname"
                      className={`w-full pl-36 pr-10 py-3 rounded-2xl bg-[#FAF7F2] border text-xs font-black text-charcoal focus:outline-none ${
                        !usernameStatus.checked
                          ? 'border-black/10'
                          : usernameStatus.available
                          ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500/30'
                          : 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400/30'
                      }`}
                    />
                    <div className="absolute right-3.5">
                      {isCheckingUsername ? (
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : usernameStatus.checked && usernameStatus.available ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : usernameStatus.checked && !usernameStatus.available ? (
                        <div className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center">
                          <X className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Availability Feedback */}
                  {usernameStatus.checked && (
                    <div className="mt-2 text-[11px] font-bold">
                      {usernameStatus.available ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between">
                          <span>&#10003; <strong>@{usernameStatus.normalized}</strong> is available!</span>
                          <span className="font-mono text-[10px] text-emerald-700">Permanent Link</span>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>{usernameStatus.reason || 'This handle is taken. Please pick another unique handle.'}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Permanent Handle Policy Note */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-left flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-charcoal/70 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-charcoal/70 leading-relaxed font-medium">
                    <strong className="text-charcoal font-black">Permanent Lock:</strong> Once activated, your handle is permanently mapped to your NFC hardware and QR code.
                  </p>
                </div>

                {/* Continue to Activation Button */}
                <button
                  type="button"
                  disabled={!usernameStatus.available || isCheckingUsername || mobileNumber.replace(/\D/g, '').length < 10}
                  onClick={handleProceedToPayment}
                  className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#141518] hover:bg-black disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Proceed to Activation & Payment</span>
                  <ArrowRight className="w-4 h-4 text-[#FDF166]" />
                </button>
              </div>

              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-bold text-charcoal cursor-pointer"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Plan Selection & Payment Activation */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FDF166] text-charcoal flex items-center justify-center mb-2 shadow-xs">
                <Zap className="w-6 h-6 stroke-[2.4]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
                Activate Your Creator Profile
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 max-w-sm leading-relaxed font-medium">
                Handle reserved for <strong className="text-charcoal font-black">@{usernameStatus.normalized}</strong>. Complete activation to publish your profile live.
              </p>

              {/* Plan Selection Cards */}
              <div className="grid grid-cols-2 gap-3 w-full mt-5 text-left">
                <div
                  onClick={() => setSelectedPlan('pro_monthly')}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                    selectedPlan === 'pro_monthly'
                      ? 'border-[#141518] bg-white ring-2 ring-charcoal/10 shadow-sm'
                      : 'border-black/10 bg-[#FAF7F2] opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-charcoal/60">Monthly</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedPlan === 'pro_monthly' ? 'border-charcoal bg-charcoal text-white' : 'border-black/30'
                    }`}>
                      {selectedPlan === 'pro_monthly' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-black text-charcoal">&#8377;299</span>
                    <span className="text-[10px] font-bold text-charcoal/60"> /month</span>
                  </div>
                  <p className="text-[10px] text-charcoal/60 mt-1 font-medium">Billed monthly. Cancel anytime.</p>
                </div>

                <div
                  onClick={() => setSelectedPlan('pro_yearly')}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all relative ${
                    selectedPlan === 'pro_yearly'
                      ? 'border-[#4F83FF] bg-[#EFF4FF]/30 ring-2 ring-[#4F83FF]/30 shadow-sm'
                      : 'border-black/10 bg-[#FAF7F2] opacity-80'
                  }`}
                >
                  <span className="absolute -top-2 right-3 text-[9px] font-black px-2 py-0.5 rounded-full bg-[#B6F554] text-charcoal border border-black/10">
                    SAVE &#8377;589
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-[#4F83FF]">Annual Pass</span>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      selectedPlan === 'pro_yearly' ? 'border-[#4F83FF] bg-[#4F83FF] text-white' : 'border-black/30'
                    }`}>
                      {selectedPlan === 'pro_yearly' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-xl font-black text-charcoal">&#8377;2,999</span>
                    <span className="text-[10px] font-bold text-charcoal/60"> /year</span>
                  </div>
                  <p className="text-[10px] text-charcoal/60 mt-1 font-medium">Priority NFC dispatch + 1 Yr pass.</p>
                </div>
              </div>

              {/* Security & Instant Payment Reassurance Strip */}
              <div className="w-full mt-4 py-3 px-4 rounded-2xl bg-[#FAF7F2] border border-black/10 flex items-center justify-center gap-2.5 text-[11px] font-bold text-charcoal/70">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.2]" />
                <span>Instant activation via UPI, Cards & NetBanking</span>
              </div>

              {/* Direct Pay & Activate Button */}
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleProcessPayment}
                className="w-full mt-5 py-4 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Activating Profile & Securing Handle...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-[#FDF166]" />
                    <span>
                      Pay &#8377;{selectedPlan === 'pro_yearly' ? '2,999/yr' : '299/mo'} & Activate
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#FDF166]" />
                  </>
                )}
              </button>

              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-bold text-charcoal cursor-pointer"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Animated Payment Success Celebration Screen */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className="flex flex-col items-center py-2"
            >
              {/* Animated Celebration Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.05 }}
                className="w-20 h-20 rounded-3xl bg-[#B6F554] border border-black/10 text-charcoal flex items-center justify-center my-3 shadow-soft"
              >
                <Check className="w-10 h-10 stroke-[3.5] text-charcoal" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight"
              >
                Payment Successful!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-charcoal/70 mt-1 max-w-sm leading-relaxed font-medium"
              >
                Your payment of <strong className="text-charcoal font-black">&#8377;{selectedPlan === 'pro_yearly' ? '2,999' : '299'}</strong> cleared. Your permanent creator profile is now officially active and live on the web!
              </motion.p>

              {/* Permanent Live Bio Link Showcase Card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="w-full mt-5 p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 text-left space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-charcoal/60 tracking-wider">
                    Permanent Bio URL
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Live & Active</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-black/10 shadow-2xs">
                  <span className="font-mono font-black text-xs text-charcoal truncate">
                    https://{displayHost}/{activatedHandle || usernameStatus.normalized}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== 'undefined') {
                        navigator.clipboard.writeText(`https://${displayHost}/${activatedHandle || usernameStatus.normalized}`);
                        setHasCopiedUrl(true);
                        showToast('Link Copied', 'Bio URL copied to clipboard', 'success');
                        setTimeout(() => setHasCopiedUrl(false), 2000);
                      }
                    }}
                    className="p-1.5 rounded-xl hover:bg-black/5 text-charcoal shrink-0 transition-colors cursor-pointer"
                    title="Copy Link"
                  >
                    {hasCopiedUrl ? (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Copied!
                      </span>
                    ) : (
                      <Copy className="w-4 h-4 text-charcoal/60" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-charcoal/60 border-t border-black/5">
                  <div className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{countryCode} {mobileNumber}</span>
                  </div>
                  <div className="text-right font-bold text-charcoal">
                    {selectedPlan === 'pro_yearly' ? 'Annual Pass (365 Days)' : 'Monthly Pass (30 Days)'}
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row w-full gap-2.5 mt-6"
              >
                <a
                  href={`/${activatedHandle || usernameStatus.normalized}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 px-4 rounded-full bg-white hover:bg-gray-50 border border-black/15 text-charcoal font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>View Live Link</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#4F83FF]" />
                </a>

                <button
                  type="button"
                  onClick={onComplete}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Open Creator Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#FDF166]" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
