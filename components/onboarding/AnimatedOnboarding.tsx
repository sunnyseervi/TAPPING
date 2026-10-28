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
  QrCode,
  Building,
  Timer,
  ChevronRight,
  Shield
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

  // 5 Step Flow:
  // Step 1: Welcome & Google Sign-In
  // Step 2: Claim Handle & Details (Display Name, Mobile Phone, Unique Handle)
  // Step 3: Choose Plan (Monthly ₹299 vs Yearly ₹2,999) -> "Pay ₹299" / "Pay ₹2,999"
  // Step 4: Dedicated Payment Gateway Page (UPI QR / Cards / NetBanking)
  // Step 5: Payment Succeed Popup / Celebration -> "Continue with Dashboard"
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

  // Plan Selection State (Step 3)
  const [selectedPlan, setSelectedPlan] = useState<'pro_monthly' | 'pro_yearly'>('pro_monthly');

  // Payment Gateway State (Step 4)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingStatusText, setProcessingStatusText] = useState('Verifying with Bank...');
  const [paymentTimeLeft, setPaymentTimeLeft] = useState(599); // 09:59 timer

  // Success State (Step 5)
  const [activatedHandle, setActivatedHandle] = useState('');
  const [hasCopiedUrl, setHasCopiedUrl] = useState(false);
  const [transactionRef, setTransactionRef] = useState('');

  const displayHost = typeof window !== 'undefined' ? window.location.host : 'tapping.bio';
  const planAmount = selectedPlan === 'pro_yearly' ? 2999 : 299;

  // Initialize with existing profile data if present
  useEffect(() => {
    const existing = getStoredProfile();
    if (existing) {
      if (existing.displayName && existing.displayName !== 'Aarav Sharma' && existing.displayName !== 'Creator') {
        setFullName(existing.displayName);
      }
      if (existing.socialLinks?.email && !existing.socialLinks.email.includes('aarav')) {
        setUserEmail(existing.socialLinks.email);
      }
      if (existing.mobileNumber) {
        const digits = existing.mobileNumber.replace(/\D/g, '').slice(-10);
        if (digits) setMobileNumber(digits);
      }
      if (existing.username && existing.username !== 'aarav' && existing.username !== 'alex' && existing.username !== 'creator') {
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

  // Payment countdown timer when on Payment Page (Step 4)
  useEffect(() => {
    if (step !== 4) return;
    const interval = setInterval(() => {
      setPaymentTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Format timer MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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

  // Continue with manual email (zero OTP)
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

  // Validate step 2 details and proceed to Plan Selection (Step 3)
  const handleProceedToPlanSelection = () => {
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

    setStep(3); // Proceed to plan selection screen
  };

  // Step 3 -> Step 4: User clicks "Pay ₹299" or "Pay ₹2,999" -> opens Payment Page
  const handleOpenPaymentPage = () => {
    setPaymentTimeLeft(599); // Reset 10 minute session timer
    setStep(4); // Open the dedicated Payment Gateway Page!
  };

  // Step 4: Process the actual Payment on the Payment Page
  const handleCompletePayment = (methodLabel: string) => {
    setIsProcessingPayment(true);
    setProcessingStatusText('Contacting Payment Gateway...');

    const cleanDigits = mobileNumber.replace(/\D/g, '');
    const fullPhone = `${countryCode} ${cleanDigits}`;
    const txId = `UPI_TXN_${Date.now().toString().slice(-6)}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setTransactionRef(txId);

    setTimeout(() => {
      setProcessingStatusText('Verifying Bank Authorization...');
    }, 600);

    setTimeout(() => {
      setProcessingStatusText('Payment Approved! Activating Handle...');

      const { user } = activateUserProfile({
        username: usernameStatus.normalized,
        mobileNumber: fullPhone,
        fullName: fullName.trim() || usernameStatus.normalized,
        email: userEmail || `${usernameStatus.normalized}@tapping.bio`,
        plan: selectedPlan,
        paymentMethod: methodLabel.includes('Card') ? 'Card' : methodLabel.includes('NetBanking') ? 'NetBanking' : 'UPI',
        amount: planAmount,
      });

      setActivatedHandle(user.username);
      setIsProcessingPayment(false);

      // Trigger multi-burst celebration confetti
      try {
        confetti({
          particleCount: 90,
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
        }, 250);
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#4F83FF', '#B6F554'],
          });
        }, 450);
      } catch {
        // Safe fallback
      }

      showToast(
        'Payment Successful!',
        `₹${planAmount} payment cleared. Profile live at tapping.bio/${user.username}`,
        'success'
      );

      setStep(5); // Advance to the Payment Succeed Popup / Celebration Screen!
    }, 1250);
  };

  // Multi-burst confetti on Step 5 mount
  useEffect(() => {
    if (step === 5) {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#4F83FF', '#B6F554', '#FDF166', '#141518'],
        });
      } catch {
        // Safe fallback
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
            {step === 4 ? 'PAYMENT GATEWAY' : step === 5 ? 'PAYMENT CONFIRMED' : 'CREATOR ONBOARDING'}
          </span>
        </div>

        {step <= 4 && (
          <div className="text-xs font-black text-charcoal/60 bg-white px-3.5 py-1.5 rounded-full border border-black/10 shadow-2xs">
            Step {step} of 4
          </div>
        )}
      </div>

      {/* Main Container Card */}
      <div className="relative w-full max-w-lg bg-white rounded-4xl p-6 sm:p-8 shadow-card border border-black/10 text-center mt-14 mb-8">
        {/* Step Indicator Progress (Steps 1 to 4) */}
        {step <= 4 && (
          <div className="flex justify-center items-center gap-1.5 mb-7">
            {[1, 2, 3, 4].map((i) => (
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
                  <p className="text-[10px] text-charcoal/60 mt-0.5">Custom themes & store</p>
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

                {/* Continue to Plan Selection Button */}
                <button
                  type="button"
                  disabled={!usernameStatus.available || isCheckingUsername || mobileNumber.replace(/\D/g, '').length < 10}
                  onClick={handleProceedToPlanSelection}
                  className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#141518] hover:bg-black disabled:opacity-40 text-white font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-sm cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Choose Membership Plan</span>
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

          {/* STEP 3: Plan Selection (Choose Monthly ₹299 vs Yearly ₹2,999) */}
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
                Select Your Membership Plan
              </h2>
              <p className="text-xs text-charcoal/70 mt-1 max-w-sm leading-relaxed font-medium">
                Reserved for <strong className="text-charcoal font-black">@{usernameStatus.normalized}</strong>. Select your pass to proceed to the secure payment page.
              </p>

              {/* Clean Plan Selection Cards */}
              <div className="grid grid-cols-2 gap-3 w-full mt-5 text-left">
                <div
                  onClick={() => setSelectedPlan('pro_monthly')}
                  className={`p-4 rounded-3xl border cursor-pointer transition-all ${
                    selectedPlan === 'pro_monthly'
                      ? 'border-[#141518] bg-white ring-2 ring-charcoal/10 shadow-sm'
                      : 'border-black/10 bg-[#FAF7F2] opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-charcoal/60">Monthly Pass</span>
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
                      : 'border-black/10 bg-[#FAF7F2] opacity-80 hover:opacity-100'
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

              {/* What is Included Preview */}
              <div className="w-full mt-4 p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/5 text-left text-[11px] font-medium text-charcoal/80 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Permanent bio link at <strong>tapping.bio/{usernameStatus.normalized}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Permanent Vector QR Code (never expires or breaks)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                  <span>Direct Apple &amp; Android phonebook .vcf contact card download</span>
                </div>
              </div>

              {/* Proceed to Payment Page Button (Clicking opens Payment Page) */}
              <button
                type="button"
                onClick={handleOpenPaymentPage}
                className="w-full mt-5 py-4 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#FDF166]" />
                <span>
                  Proceed to Pay &#8377;{selectedPlan === 'pro_yearly' ? '2,999' : '299'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#FDF166]" />
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

          {/* STEP 4: Dedicated Real Indian Payment Page (UPI QR / Cards / NetBanking) */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center"
            >
              {/* Payment Header */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-black/10">
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/70">
                      Tapping Payment Gateway
                    </span>
                  </div>
                  <h3 className="text-base font-black text-charcoal">Complete Your Payment</h3>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-charcoal/50 block">Amount Payable</span>
                  <span className="text-lg font-black text-charcoal">
                    &#8377;{planAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Order & Timer Summary Strip */}
              <div className="w-full mt-3 px-3 py-2 rounded-2xl bg-[#FAF7F2] border border-black/5 flex items-center justify-between text-xs">
                <div className="text-left">
                  <span className="text-[10px] font-bold text-charcoal/60">Membership:</span>
                  <p className="font-black text-charcoal text-[11px]">
                    {selectedPlan === 'pro_yearly' ? 'Annual Pass (365 Days)' : 'Monthly Pass (30 Days)'} &bull; @{usernameStatus.normalized}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 font-mono text-[11px] font-bold">
                  <Timer className="w-3.5 h-3.5" />
                  <span>{formatTime(paymentTimeLeft)}</span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2 w-full mt-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`py-2.5 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'upi'
                      ? 'border-[#141518] bg-white ring-2 ring-charcoal/10 font-black text-charcoal shadow-xs'
                      : 'border-black/10 bg-[#FAF7F2] text-charcoal/70'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs font-black">UPI / QR</span>
                  </div>
                  <span className="text-[9px] text-emerald-700 font-bold block mt-0.5">Instant &bull; Free</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`py-2.5 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-[#141518] bg-white ring-2 ring-charcoal/10 font-black text-charcoal shadow-xs'
                      : 'border-black/10 bg-[#FAF7F2] text-charcoal/70'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-[#4F83FF]" />
                    <span className="text-xs font-black">Cards</span>
                  </div>
                  <span className="text-[9px] text-charcoal/50 block mt-0.5">RuPay &bull; Visa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`py-2.5 px-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'netbanking'
                      ? 'border-[#141518] bg-white ring-2 ring-charcoal/10 font-black text-charcoal shadow-xs'
                      : 'border-black/10 bg-[#FAF7F2] text-charcoal/70'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <Building className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-black">NetBanking</span>
                  </div>
                  <span className="text-[9px] text-charcoal/50 block mt-0.5">All Banks</span>
                </button>
              </div>

              {/* Payment Method Tab Contents */}
              <div className="w-full mt-4 text-left">
                {/* 1. UPI Payment Mode */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col items-center text-center space-y-3">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-black uppercase text-charcoal/60 tracking-wider">
                        Scan to Pay via Any UPI App
                      </span>
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Zero Gateway Surcharge
                      </span>
                    </div>

                    {/* Vector UPI QR Code */}
                    <div className="p-3 bg-white rounded-2xl border-2 border-black/10 shadow-xs flex flex-col items-center">
                      <svg className="w-36 h-36" viewBox="0 0 100 100" fill="none">
                        {/* QR Corners */}
                        <rect x="5" y="5" width="26" height="26" rx="4" fill="#141518" />
                        <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                        <rect x="13" y="13" width="10" height="10" rx="2" fill="#141518" />

                        <rect x="69" y="5" width="26" height="26" rx="4" fill="#141518" />
                        <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                        <rect x="77" y="13" width="10" height="10" rx="2" fill="#141518" />

                        <rect x="5" y="69" width="26" height="26" rx="4" fill="#141518" />
                        <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                        <rect x="13" y="77" width="10" height="10" rx="2" fill="#141518" />

                        {/* QR Data Matrix simulation */}
                        <rect x="36" y="8" width="6" height="6" fill="#141518" />
                        <rect x="46" y="14" width="6" height="6" fill="#141518" />
                        <rect x="56" y="8" width="6" height="6" fill="#141518" />
                        <rect x="38" y="24" width="6" height="6" fill="#141518" />
                        <rect x="48" y="28" width="6" height="6" fill="#141518" />

                        <rect x="8" y="38" width="6" height="6" fill="#141518" />
                        <rect x="18" y="44" width="6" height="6" fill="#141518" />
                        <rect x="28" y="38" width="6" height="6" fill="#141518" />

                        {/* Center Logo Square */}
                        <rect x="38" y="38" width="24" height="24" rx="6" fill="#FDF166" stroke="#141518" strokeWidth="2" />
                        <text x="50" y="54" fontSize="10" fontWeight="900" textAnchor="middle" fill="#141518">UPI</text>

                        <rect x="68" y="38" width="6" height="6" fill="#141518" />
                        <rect x="78" y="44" width="6" height="6" fill="#141518" />
                        <rect x="86" y="38" width="6" height="6" fill="#141518" />

                        <rect x="38" y="68" width="6" height="6" fill="#141518" />
                        <rect x="48" y="76" width="6" height="6" fill="#141518" />
                        <rect x="58" y="68" width="6" height="6" fill="#141518" />
                        <rect x="68" y="78" width="6" height="6" fill="#141518" />
                        <rect x="78" y="68" width="6" height="6" fill="#141518" />
                        <rect x="86" y="76" width="6" height="6" fill="#141518" />
                      </svg>
                      <span className="text-[10px] font-mono font-bold text-charcoal/70 mt-1">
                        Scan &bull; UPI ID: tapping@icici
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-charcoal/60">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-black/10">GPay</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-black/10">PhonePe</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-black/10">Paytm</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-black/10">CRED</span>
                      <span className="px-2 py-0.5 rounded-md bg-white border border-black/10">BHIM</span>
                    </div>

                    {/* Or Enter UPI ID */}
                    <div className="w-full pt-2 border-t border-black/5">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Or enter UPI ID (e.g. mobile@okhdfcbank)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* 2. Cards Payment Mode */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 space-y-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-charcoal/70 block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8921"
                        maxLength={19}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-black uppercase text-charcoal/70 block mb-1">
                          Expiry MM/YY
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          maxLength={5}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-charcoal/70 block mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="842"
                          maxLength={4}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 text-[10px] font-bold text-charcoal/60">
                      <Shield className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Supports Indian RuPay, Visa, Mastercard &amp; Maestro</span>
                    </div>
                  </div>
                )}

                {/* 3. NetBanking Payment Mode */}
                {paymentMethod === 'netbanking' && (
                  <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 space-y-2.5">
                    <label className="text-[10px] font-black uppercase text-charcoal/70 block">
                      Select Popular Indian Bank
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra'].map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                            selectedBank === b
                              ? 'border-[#141518] bg-white text-charcoal font-black shadow-2xs'
                              : 'border-black/10 bg-white/70 text-charcoal/70'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Security Trust Reassurance */}
              <div className="w-full mt-3 py-2 px-3 rounded-xl bg-gray-50 border border-black/5 flex items-center justify-center gap-2 text-[10px] font-bold text-charcoal/60">
                <Lock className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                <span>256-Bit SSL Encrypted &bull; RBI Compliant Indian Payment Gateway</span>
              </div>

              {/* Primary Pay Now Action Button on the Payment Page */}
              <button
                type="button"
                disabled={isProcessingPayment}
                onClick={() => handleCompletePayment(paymentMethod === 'card' ? 'Card' : paymentMethod === 'netbanking' ? 'NetBanking' : 'UPI')}
                className="w-full mt-4 py-4 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-sm flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{processingStatusText}</span>
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 text-[#FDF166]" />
                    <span>
                      Pay &#8377;{planAmount.toLocaleString('en-IN')} &amp; Activate Profile
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#FDF166]" />
                  </>
                )}
              </button>

              <div className="flex w-full gap-3 mt-3">
                <button
                  disabled={isProcessingPayment}
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-bold text-charcoal cursor-pointer disabled:opacity-40"
                >
                  Change Plan
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Payment Succeed Popup / Celebration Screen */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 20 }}
              className="flex flex-col items-center py-2"
            >
              {/* Animated Celebration Bouncy Checkmark */}
              <motion.div
                initial={{ scale: 0, rotate: -25 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.05 }}
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
                Your payment of <strong className="text-charcoal font-black">&#8377;{planAmount.toLocaleString('en-IN')}</strong> was received. Your creator bio link is now officially live on the web!
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

                {transactionRef && (
                  <div className="text-[9px] font-mono text-charcoal/40 text-center pt-0.5">
                    Ref ID: {transactionRef}
                  </div>
                )}
              </motion.div>

              {/* Action Buttons: Continue with Dashboard + View Live Link */}
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
                  className="flex-1 py-4 px-6 rounded-full bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                >
                  <span>Continue with Dashboard</span>
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
