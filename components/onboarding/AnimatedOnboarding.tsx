'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CreditCard, 
  QrCode, 
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
  Shield,
  Zap
} from 'lucide-react';
import { 
  checkUsernameAvailability, 
  sanitizeUsername, 
  activateUserProfile, 
  getStoredProfile,
  getProfileActivated 
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

  // Step tracker: 1=Intro, 2=Auth, 3=Phone, 4=Username, 5=Payment Gate, 6=Success
  const [step, setStep] = useState<number>(1);

  // Authentication State
  const [userEmail, setUserEmail] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Mobile Number State
  const [countryCode, setCountryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Username & Profile State
  const [rawUsername, setRawUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
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
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [activatedHandle, setActivatedHandle] = useState('');
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);

  const displayHost = typeof window !== 'undefined' ? window.location.host : 'tapping.bio';

  // Initialize with any existing profile data if present
  useEffect(() => {
    const existing = getStoredProfile();
    if (existing) {
      if (existing.displayName) setFullName(existing.displayName);
      if (existing.socialLinks?.email) setUserEmail(existing.socialLinks.email);
      if (existing.mobileNumber) {
        const digits = existing.mobileNumber.replace(/\D/g, '').slice(-10);
        if (digits) setMobileNumber(digits);
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
    }, 280);

    return () => clearTimeout(timer);
  }, [rawUsername]);

  // Trigger simulated OTP
  const handleSendOtp = () => {
    const cleanDigits = mobileNumber.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpError('');
    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setIsOtpSent(true);
      setOtpCode('1234'); // Pre-fill test OTP for instantaneous UX
      showToast('OTP Sent', `Verification code sent to ${countryCode} ${cleanDigits} (Demo: 1234)`, 'info');
    }, 600);
  };

  // Verify OTP
  const handleVerifyOtp = () => {
    if (otpCode === '1234' || otpCode.length === 4) {
      setIsOtpVerified(true);
      setOtpError('');
      showToast('Mobile Verified', `${countryCode} ${mobileNumber} successfully confirmed`, 'success');
      setTimeout(() => {
        setStep(4); // Move to Username claim
      }, 350);
    } else {
      setOtpError('Invalid OTP code. Please enter 1234 for demo verification.');
    }
  };

  // Process Subscription Payment & Activate Profile
  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const fullPhone = `${countryCode} ${mobileNumber.trim()}`;
      const { user } = activateUserProfile({
        username: usernameStatus.normalized,
        mobileNumber: fullPhone,
        fullName: fullName.trim() || usernameStatus.normalized,
        email: userEmail || `${usernameStatus.normalized}@tapping.bio`,
        plan: selectedPlan,
        paymentMethod,
        amount: selectedPlan === 'pro_yearly' ? 2999 : 299,
      });

      setActivatedHandle(user.username);
      setIsProcessingPayment(false);

      try {
        confetti({
          particleCount: 100,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#4F83FF', '#B6F554', '#FDF166', '#141518'],
        });
      } catch {
        // Safe fallback
      }

      showToast(
        'Profile Activated!',
        `Payment confirmed. Your permanent link is now live at tapping.bio/${user.username}`,
        'success'
      );
      setStep(6); // Success Step
    }, 1200);
  };

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

        <div className="text-xs font-black text-charcoal/60 bg-white px-3.5 py-1.5 rounded-full border border-black/10 shadow-2xs">
          Step {step} of 6
        </div>
      </div>

      {/* Main Bento Container */}
      <div className="relative w-full max-w-lg bg-white rounded-4xl p-6 sm:p-8 shadow-card border border-black/10 text-center mt-14 mb-8">
        {/* Step Indicator Progress */}
        <div className="flex justify-center items-center gap-1.5 mb-7">
          {[1, 2, 3, 4, 5, 6].map((i) => (
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

        <AnimatePresence mode="wait">
          {/* STEP 1: Introduction */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center"
            >
              <div className="w-20 h-20 rounded-3xl bg-[#FDF166] border border-black/10 flex items-center justify-center my-3 shadow-soft">
                <TappingLogo size="md" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight mt-1">
                Welcome to <br />
                <span className="text-charcoal/40">TAPPING Creator Studio</span>
              </h2>
              <p className="text-xs text-charcoal/70 mt-2 max-w-sm leading-relaxed font-medium">
                Claim your permanent bio handle, connect contactless smart metal NFC cards, and activate your personal creator link in India.
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

              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 text-[#FDF166]" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Authentication */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#4F83FF] text-white flex items-center justify-center mb-2 shadow-xs">
                <ShieldCheck className="w-6 h-6 stroke-[2.4]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
                Create Creator Session
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 max-w-xs leading-relaxed font-medium">
                Log in to link your mobile number and register your immutable handle.
              </p>

              <div className="w-full flex flex-col gap-3 mt-6 text-left">
                <div>
                  <label className="text-[10px] font-black text-charcoal/80 uppercase tracking-wider block mb-1">
                    Creator Email
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="creator@example.com"
                    className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsAuthenticating(true);
                    setTimeout(() => {
                      setIsAuthenticating(false);
                      setStep(3);
                    }, 500);
                  }}
                  className="w-full py-3.5 px-4 rounded-2xl border border-black/15 bg-white hover:bg-gray-50 flex items-center justify-center gap-3 text-xs font-black text-charcoal shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign In with Google</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#141518] hover:bg-black text-white flex items-center justify-center gap-2 text-xs font-black shadow-xs transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Continue with Email Session</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FDF166]" />
                </button>
              </div>

              <div className="flex w-full gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-bold text-charcoal"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Mandatory Mobile Number Verification */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FDF166] border border-black/10 text-charcoal flex items-center justify-center mb-2 shadow-xs">
                <Phone className="w-6 h-6 stroke-[2.4]" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
                Verify Mobile Number
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 max-w-sm leading-relaxed font-medium">
                A verified phone number is required to safeguard your unique handle and deliver contactless hardware orders.
              </p>

              <div className="w-full mt-6 text-left flex flex-col gap-3.5">
                <div>
                  <label className="text-[10px] font-black text-charcoal/80 uppercase tracking-wider block mb-1">
                    Mobile Phone Number
                  </label>
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
                        if (otpError) setOtpError('');
                      }}
                      placeholder="98765 43210"
                      maxLength={14}
                      className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal/20"
                    />
                  </div>
                </div>

                {/* Send OTP button or verification input */}
                {!isOtpSent ? (
                  <button
                    type="button"
                    disabled={isSendingOtp || mobileNumber.replace(/\D/g, '').length < 10}
                    onClick={handleSendOtp}
                    className="w-full py-3.5 px-4 rounded-2xl bg-[#141518] hover:bg-black disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSendingOtp ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Send Verification OTP</span>
                        <ArrowRight className="w-4 h-4 text-[#FDF166]" />
                      </>
                    )}
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-black/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-charcoal">
                        Enter 4-Digit OTP
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Demo OTP: 1234
                      </span>
                    </div>

                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => {
                        setOtpCode(e.target.value);
                        if (otpError) setOtpError('');
                      }}
                      placeholder="1234"
                      maxLength={4}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-black/15 text-center text-lg font-mono font-black tracking-widest text-charcoal focus:outline-none focus:ring-2 focus:ring-charcoal/30"
                    />

                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Verify & Continue</span>
                    </button>
                  </div>
                )}

                {otpError && (
                  <p className="text-[11px] font-bold text-rose-600 text-center">
                    {otpError}
                  </p>
                )}
              </div>

              <div className="flex w-full gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-bold text-charcoal"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Choose Unique Permanent Username / Handle */}
          {step === 4 && (
            <motion.div
              key="step4"
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
                Choose your permanent public URL. Our system checks the backend in real-time to guarantee every handle is 100% unique.
              </p>

              <div className="w-full mt-6 text-left flex flex-col gap-3.5">
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

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-black text-charcoal/80 uppercase tracking-wider">
                      Desired Handle / Username
                    </label>
                    <span className="text-[10px] text-charcoal/50 font-medium">
                      (Supports @, comma, space & symbols)
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

                  {/* Dynamic Availability Feedback */}
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
                          <span>{usernameStatus.reason || 'This username is taken. Please try another unique handle.'}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Permanent Handle Lock Notice */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-left flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-charcoal/70 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-charcoal/70 leading-relaxed font-medium">
                    <strong className="text-charcoal font-black">Permanent Handle Rule:</strong> Once registered, your username cannot ever be changed because your public bio link and laser-engraved NFC hardware are permanently mapped to it.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={!usernameStatus.available || isCheckingUsername}
                  onClick={() => setStep(5)}
                  className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#141518] hover:bg-black disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Proceed to Profile Activation</span>
                  <ArrowRight className="w-4 h-4 text-[#FDF166]" />
                </button>
              </div>

              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-bold text-charcoal"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Mandatory Payment & Profile Activation Gate */}
          {step === 5 && (
            <motion.div
              key="step5"
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
                Your profile is reserved for <strong className="text-charcoal font-black">@{usernameStatus.normalized}</strong>. Profile activation is mandatory to make your bio link live.
              </p>

              {/* Warning Banner: Without payment, it won't get activated */}
              <div className="w-full mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-left flex items-center gap-2.5 text-[11px] font-bold">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Notice: Without payment, your public link and profile will not be activated.</span>
              </div>

              {/* Plan Selection */}
              <div className="grid grid-cols-2 gap-3 w-full mt-4 text-left">
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

              {/* Payment Methods */}
              <div className="w-full mt-4 text-left">
                <label className="text-[10px] font-black text-charcoal/80 uppercase tracking-wider block mb-2">
                  Select Indian Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', desc: 'GPay & PhonePe' },
                    { id: 'Card', label: 'Debit / Credit', desc: 'Visa & RuPay' },
                    { id: 'NetBanking', label: 'NetBanking', desc: 'All Banks' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as any)}
                      className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        paymentMethod === m.id
                          ? 'border-charcoal bg-[#FAF7F2] font-black text-charcoal shadow-2xs'
                          : 'border-black/10 bg-white text-charcoal/70'
                      }`}
                    >
                      <p className="text-xs font-black">{m.label}</p>
                      <p className="text-[9px] text-charcoal/50 mt-0.5">{m.desc}</p>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="Enter UPI ID (e.g. mobile@okhdfcbank)"
                      className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Secure Payment Trigger */}
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={handleProcessPayment}
                className="w-full mt-6 py-4 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing Secure Payment via UPI...</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-[#FDF166]" />
                    <span>
                      Pay &#8377;{selectedPlan === 'pro_yearly' ? '2,999' : '299'} & Activate Profile
                    </span>
                  </>
                )}
              </button>

              <div className="flex w-full gap-3 mt-4">
                <button
                  onClick={() => setStep(4)}
                  className="px-4 py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-bold text-charcoal"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Activation Success Screen */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-3xl bg-[#B6F554] border border-black/10 text-charcoal flex items-center justify-center my-3 shadow-soft">
                <Sparkles className="w-8 h-8 stroke-[2.5]" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-charcoal tracking-tight">
                Profile Activated!
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 max-w-sm leading-relaxed font-medium">
                Congratulations! Your payment has cleared and your creator identity is now live across India and globally.
              </p>

              {/* Permanent Live Bio URL Showcase */}
              <div className="w-full mt-5 p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 text-left">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase text-charcoal/60 tracking-wider">
                    Your Permanent Live Link
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Active & Live
                  </span>
                </div>

                <div className="flex items-center justify-between bg-white px-3.5 py-2.5 rounded-2xl border border-black/10">
                  <span className="font-mono font-black text-xs text-charcoal truncate">
                    https://{displayHost}/{activatedHandle || usernameStatus.normalized}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof navigator !== 'undefined') {
                        navigator.clipboard.writeText(`https://${displayHost}/${activatedHandle || usernameStatus.normalized}`);
                        setHasCopiedUrl(true);
                        setTimeout(() => setHasCopiedUrl(false), 2000);
                      }
                    }}
                    className="p-1.5 rounded-xl hover:bg-black/5 text-charcoal shrink-0 transition-colors cursor-pointer"
                    title="Copy URL"
                  >
                    {hasCopiedUrl ? (
                      <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    ) : (
                      <Copy className="w-4 h-4 text-charcoal/60" />
                    )}
                  </button>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-charcoal/60">
                  <span className="flex items-center gap-1 font-mono">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {countryCode} {mobileNumber}
                  </span>
                  <span className="font-bold text-charcoal">
                    {selectedPlan === 'pro_yearly' ? 'Annual Pass (365 Days)' : 'Monthly Pass (30 Days)'}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row w-full gap-2.5 mt-6">
                <a
                  href={`/${activatedHandle || usernameStatus.normalized}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3.5 px-4 rounded-full bg-white hover:bg-black/5 border border-black/15 text-charcoal font-black text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>View Live Link</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#4F83FF]" />
                </a>

                <button
                  type="button"
                  onClick={onComplete}
                  className="flex-1 py-3.5 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Enter Creator Space</span>
                  <ArrowRight className="w-4 h-4 text-[#FDF166]" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
