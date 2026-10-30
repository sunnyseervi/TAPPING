'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredVCard, 
  saveStoredVCard, 
  getStoredLinks, 
  saveStoredLinks, 
  getStoredNFCCard, 
  saveStoredNFCCard, 
  getStoredAnalytics, 
  getStoredStore,
  saveStoredStore,
  getOnboardingCompleted,
  getProfileActivated,
  getStoredSubscription,
  saveStoredSubscription,
  getStoredUsers,
  saveStoredUsers,
} from '@/lib/storage';
import { 
  initialProfile, 
  initialVCard, 
  initialLinks, 
  initialNFCCard, 
  initialAnalytics,
  initialSubscription,
  initialStore,
} from '@/lib/mockData';
import { Profile, VCardProfile, LinkBlock, NFCCardDesign, AnalyticsSummary, Subscription, StoreConfig } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import CreatorDashboard from '@/components/dashboard/CreatorDashboard';
import EditProfileSection from '@/components/dashboard/EditProfileSection';
import DigitalCardStudio from '@/components/dashboard/DigitalCardStudio';
import NFCCardStudio from '@/components/dashboard/NFCCardStudio';
import ThemesStudio from '@/components/dashboard/ThemesStudio';
import GoogleAuthModal from '@/components/auth/GoogleAuthModal';
import AnimatedOnboarding from '@/components/onboarding/AnimatedOnboarding';
import LivePhonePreview from '@/components/preview/LivePhonePreview';
import StoreManager from '@/components/dashboard/StoreManager';
import NFCTagShop from '@/components/dashboard/NFCTagShop';
import AccountOrdersSection from '@/components/dashboard/AccountOrdersSection';
import { useToast } from '@/components/ui/Toast';
import { Check, X, CreditCard, Zap, ArrowRight, QrCode, Building, ShieldCheck, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

function DashboardContent() {
  const { showToast } = useToast();
  const searchParams = useSearchParams();

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [vcard, setVcard] = useState<VCardProfile>(initialVCard);
  const [links, setLinks] = useState<LinkBlock[]>(initialLinks);
  const [nfcCard, setNfcCard] = useState<NFCCardDesign>(initialNFCCard);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(initialAnalytics);
  const [subscription, setSubscription] = useState<Subscription>(initialSubscription);
  const [store, setStore] = useState<StoreConfig>(initialStore);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [editSectionTab, setEditSectionTab] = useState<'profile' | 'links' | 'products' | 'themes'>('profile');
  const [profileViewMode, setProfileViewMode] = useState<'form' | 'preview'>('form');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setIsSidebarCollapsed((prev) => !prev);
    }
  };

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [upgradePlan, setUpgradePlan] = useState<'monthly' | 'yearly'>('monthly');
  const [upgradeModalStep, setUpgradeModalStep] = useState<'plan' | 'payment' | 'success'>('plan');
  const [upgradePaymentMethod, setUpgradePaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState<boolean>(false);

  const handleSelectTab = (tab: string) => {
    if (tab === 'themes') {
      setActiveTab('profile');
      setEditSectionTab('themes');
      return;
    }
    if (tab === 'profile') {
      setActiveTab('profile');
      setEditSectionTab('profile');
      return;
    }
    setActiveTab(tab);
  };

  // Sync search parameters from URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    const action = searchParams.get('action');
    const plan = searchParams.get('plan');

    if (tab === 'nfc') {
      setActiveTab('nfc');
    } else if (tab === 'profile') {
      setActiveTab('profile');
      setEditSectionTab('profile');
    } else if (tab === 'links') {
      setActiveTab('profile');
      setEditSectionTab('links');
    } else if (tab === 'themes') {
      setActiveTab('profile');
      setEditSectionTab('themes');
    } else if (tab === 'account' || tab === 'billing' || tab === 'orders') {
      setActiveTab('account');
    } else if (tab === 'digital-card') {
      setActiveTab('nfc');
    } else if (tab === 'store') {
      setActiveTab('profile');
      setEditSectionTab('products');
    } else if (tab === 'dashboard') {
      setActiveTab('dashboard');
    }

    if (action === 'upgrade') {
      setShowUpgradeModal(true);
      if (plan === 'yearly' || plan === 'monthly') {
        setUpgradePlan(plan);
      }
    } else if (action === 'activate') {
      setShowOnboarding(true);
    }
  }, [searchParams]);

  // Sync state on client mount to prevent SSR hydration mismatch
  useEffect(() => {
    const refreshAll = () => {
      setProfile(getStoredProfile());
      setVcard(getStoredVCard());
      setLinks(getStoredLinks());
      setNfcCard(getStoredNFCCard());
      setAnalytics(getStoredAnalytics());
      setStore(getStoredStore());
      setSubscription(getStoredSubscription());
    };

    refreshAll();

    // Show onboarding & payment activation if first visit or unactivated
    if (!getOnboardingCompleted() || !getProfileActivated()) {
      setShowOnboarding(true);
    }

    const handleAccountDeleted = () => {
      refreshAll();
      setShowOnboarding(true);
    };

    const handleProfileActivated = () => {
      refreshAll();
      setShowOnboarding(false);
    };

    window.addEventListener('tapping-account-deleted', handleAccountDeleted);
    window.addEventListener('tapping-profile-activated', handleProfileActivated);

    return () => {
      window.removeEventListener('tapping-account-deleted', handleAccountDeleted);
      window.removeEventListener('tapping-profile-activated', handleProfileActivated);
    };
  }, []);

  const handleUpdateProfile = (newProfile: Profile) => {
    setProfile(newProfile);
    saveStoredProfile(newProfile);
  };

  const handleUpdateVCard = (newVCard: VCardProfile) => {
    setVcard(newVCard);
    saveStoredVCard(newVCard);
  };

  const handleUpdateLinks = (newLinks: LinkBlock[]) => {
    setLinks(newLinks);
    saveStoredLinks(newLinks);
  };

  const handleUpdateNFCCard = (newNFC: NFCCardDesign) => {
    setNfcCard(newNFC);
    saveStoredNFCCard(newNFC);
  };

  const handleUpdateStore = (newStore: StoreConfig) => {
    setStore(newStore);
    saveStoredStore(newStore);
  };

  const isPublished = profile.isActivated !== false && subscription.status === 'active';

  const handlePublishClick = () => {
    if (!profile.isActivated || subscription.status !== 'active') {
      setUpgradeModalStep('plan');
      setShowUpgradeModal(true);
      showToast('Publish Profile', 'Select a plan to publish your profile live to the web', 'info');
    } else {
      saveStoredProfile(profile);
      showToast('Live on Web!', `Your profile is live at /${profile.username}`, 'success');
    }
  };

  const handleActivatePlan = (plan: 'monthly' | 'yearly') => {
    setIsProcessingUpgrade(true);
    setTimeout(() => {
      const updatedSub: Subscription = {
        tier: 'pro',
        status: 'active',
        expiresAt: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
      };
      setSubscription(updatedSub);
      saveStoredSubscription(updatedSub);

      const updatedProfile: Profile = {
        ...profile,
        isActivated: true,
      };
      setProfile(updatedProfile);
      saveStoredProfile(updatedProfile);

      // Also update in users list if present
      const users = getStoredUsers();
      const userIndex = users.findIndex(
        (u) => u.id === profile.id || (profile.socialLinks?.email && u.email === profile.socialLinks.email) || u.username.toLowerCase() === profile.username.toLowerCase()
      );
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          isActivated: true,
          status: 'active',
          plan: plan === 'yearly' ? 'pro_yearly' : 'pro_monthly',
          profile: updatedProfile,
        };
        saveStoredUsers(users);
      }

      window.dispatchEvent(new CustomEvent('tapping-profile-activated'));

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.55 },
          colors: ['#4F83FF', '#B6F554', '#FDF166', '#141518'],
        });
      } catch {
        // safe fallback
      }

      setIsProcessingUpgrade(false);
      setUpgradeModalStep('success');
      showToast(
        'Account Activated & Published!',
        `TAPPING Pro (${plan === 'yearly' ? '\u20B92,999/yr' : '\u20B9299/mo'}) unlocked. Your profile @${profile.username} is now live!`,
        'success'
      );
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-canvas text-charcoal selection:bg-pastel-peach relative font-sans">
      {/* Optional Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthenticated={(updated) => {
          setProfile(updated);
          setShowAuthModal(false);
        }}
      />

      {/* First-Time Animated Onboarding Tour */}
      {showOnboarding && (
        <AnimatedOnboarding
          onComplete={() => {
            setShowOnboarding(false);
            setProfile(getStoredProfile());
          }}
        />
      )}

      {/* Plan Activation / Upgrade Modal (₹299/mo or ₹2,999/yr) */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-black/10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FDF166] flex items-center justify-center text-charcoal shadow-2xs">
                  <Zap className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-charcoal">
                    {upgradeModalStep === 'payment'
                      ? 'Payment Gateway Checkout'
                      : upgradeModalStep === 'success'
                      ? 'Payment Confirmed'
                      : 'Activate TAPPING PRO'}
                  </h3>
                  <p className="text-[11px] font-bold text-charcoal/60">
                    {upgradeModalStep === 'payment'
                      ? 'Instant 256-bit Secure Gateway'
                      : 'Official Indian Rupee Pricing'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowUpgradeModal(false);
                  setUpgradeModalStep('plan');
                }}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-gray-200 flex items-center justify-center text-charcoal/70 hover:text-black cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* STEP 1: Plan Selection */}
            {upgradeModalStep === 'plan' && (
              <>
                {/* Plan Switcher Pills */}
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#FAF7F2] border border-black/10">
                  <button
                    type="button"
                    onClick={() => setUpgradePlan('monthly')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      upgradePlan === 'monthly'
                        ? 'bg-[#4F83FF] text-white shadow-xs'
                        : 'text-charcoal/70 hover:text-black'
                    }`}
                  >
                    Monthly &#8377;299/mo
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpgradePlan('yearly')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      upgradePlan === 'yearly'
                        ? 'bg-[#4F83FF] text-white shadow-xs'
                        : 'text-charcoal/70 hover:text-black'
                    }`}
                  >
                    <span>Yearly &#8377;2,999/yr</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-[#B6F554] text-charcoal font-black">
                      -16%
                    </span>
                  </button>
                </div>

                {/* Plan Features Included */}
                <div className="space-y-2 p-4 rounded-2xl bg-[#EFF4FF] border border-[#4F83FF]/20 text-xs font-bold text-charcoal">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#4F83FF] mb-1">
                    Included in Your {upgradePlan === 'yearly' ? 'Annual' : 'Monthly'} Pro Membership:
                  </div>
                  {[
                    'Permanent Dynamic Vector QR (never breaks or expires)',
                    '13 Full-System Themes with authentic typography & custom colors',
                    'Direct Contact Card (.vcf) export to Apple & Android phonebooks',
                    'Visiting card 300 DPI high-resolution PNG & PDF export',
                    'Zero platform branding & full custom domain readiness',
                    upgradePlan === 'yearly' ? '20% exclusive discount on Laser-Engraved Metal NFC Cards' : 'Full access to Metal NFC Hardware Studio'
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#4F83FF] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Proceed to Payment Page Button */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setUpgradeModalStep('payment')}
                    className="w-full py-4 px-5 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-[#4F83FF]/20 transition-transform active:scale-95 cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-[#FDF166]" />
                    <span>
                      Proceed to Pay &#8377;{upgradePlan === 'yearly' ? '2,999' : '299'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                  <p className="text-[10px] text-center text-charcoal/50 font-medium">
                    100% money-back satisfaction guarantee &bull; Cancel anytime
                  </p>
                </div>
              </>
            )}

            {/* STEP 2: Dedicated Payment Gateway Page */}
            {upgradeModalStep === 'payment' && (
              <div className="space-y-4">
                {/* Amount Payable Strip */}
                <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-black/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase text-charcoal/60 tracking-wider">
                      Selected Plan
                    </span>
                    <p className="font-black text-charcoal">
                      {upgradePlan === 'yearly' ? 'Creator Pro Annual Pass (365 Days)' : 'Creator Pro Monthly Pass (30 Days)'}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-charcoal/50 block">Amount Payable</span>
                    <span className="text-base font-black text-charcoal">
                      &#8377;{upgradePlan === 'yearly' ? '2,999' : '299'}
                    </span>
                  </div>
                </div>

                {/* Payment Method Selector Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUpgradePaymentMethod('upi')}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      upgradePaymentMethod === 'upi'
                        ? 'border-charcoal bg-white font-black text-charcoal ring-2 ring-charcoal/10'
                        : 'border-black/10 bg-[#FAF7F2] text-charcoal/70'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                      <span>UPI / QR</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpgradePaymentMethod('card')}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      upgradePaymentMethod === 'card'
                        ? 'border-charcoal bg-white font-black text-charcoal ring-2 ring-charcoal/10'
                        : 'border-black/10 bg-[#FAF7F2] text-charcoal/70'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <CreditCard className="w-3.5 h-3.5 text-[#4F83FF]" />
                      <span>Cards</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpgradePaymentMethod('netbanking')}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      upgradePaymentMethod === 'netbanking'
                        ? 'border-charcoal bg-white font-black text-charcoal ring-2 ring-charcoal/10'
                        : 'border-black/10 bg-[#FAF7F2] text-charcoal/70'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <Building className="w-3.5 h-3.5 text-amber-600" />
                      <span>NetBanking</span>
                    </div>
                  </button>
                </div>

                {/* UPI QR Display */}
                {upgradePaymentMethod === 'upi' && (
                  <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col items-center text-center space-y-2">
                    <span className="text-[10px] font-black uppercase text-charcoal/60 tracking-wider">
                      Scan with any UPI App (GPay, PhonePe, Paytm, CRED)
                    </span>
                    <div className="p-2.5 bg-white rounded-xl border border-black/10 shadow-2xs">
                      <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
                        <rect x="5" y="5" width="26" height="26" rx="4" fill="#141518" />
                        <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                        <rect x="13" y="13" width="10" height="10" rx="2" fill="#141518" />
                        <rect x="69" y="5" width="26" height="26" rx="4" fill="#141518" />
                        <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                        <rect x="77" y="13" width="10" height="10" rx="2" fill="#141518" />
                        <rect x="5" y="69" width="26" height="26" rx="4" fill="#141518" />
                        <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                        <rect x="13" y="77" width="10" height="10" rx="2" fill="#141518" />
                        <rect x="38" y="38" width="24" height="24" rx="6" fill="#FDF166" stroke="#141518" strokeWidth="2" />
                        <text x="50" y="54" fontSize="10" fontWeight="900" textAnchor="middle" fill="#141518">UPI</text>
                      </svg>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-charcoal/70">
                      UPI ID: tapping@icici
                    </span>
                  </div>
                )}

                {/* Card input preview */}
                {upgradePaymentMethod === 'card' && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase text-charcoal/70 block">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="4532 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 8921"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-black/10 text-xs font-mono font-bold text-charcoal focus:outline-none"
                    />
                    <div className="flex items-center gap-2 text-[10px] text-charcoal/60 font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Supports RuPay, Visa, Mastercard</span>
                    </div>
                  </div>
                )}

                {/* NetBanking preview */}
                {upgradePaymentMethod === 'netbanking' && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 space-y-2 text-left">
                    <label className="text-[10px] font-black uppercase text-charcoal/70 block">
                      Popular Indian Banks
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((b) => (
                        <div key={b} className="p-2 rounded-xl bg-white border border-black/10 text-center font-bold">
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Security Reassurance */}
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-charcoal/60">
                  <Lock className="w-3 h-3 text-emerald-600 stroke-[2.2]" />
                  <span>256-Bit SSL Encrypted &bull; RBI Compliant Gateway</span>
                </div>

                {/* Pay Now Button on Payment Page */}
                <button
                  type="button"
                  disabled={isProcessingUpgrade}
                  onClick={() => handleActivatePlan(upgradePlan)}
                  className="w-full py-4 px-5 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-[#4F83FF]/20 transition-transform active:scale-95 cursor-pointer disabled:opacity-60"
                >
                  {isProcessingUpgrade ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Payment with Bank...</span>
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-[#FDF166]" />
                      <span>
                        Pay &#8377;{upgradePlan === 'yearly' ? '2,999' : '299'} &amp; Activate
                      </span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setUpgradeModalStep('plan')}
                  className="text-xs font-bold text-charcoal/60 hover:text-black py-1 cursor-pointer"
                >
                  Back to Plan Selection
                </button>
              </div>
            )}

            {/* STEP 3: Payment Success Celebration Popup */}
            {upgradeModalStep === 'success' && (
              <div className="flex flex-col items-center text-center py-2 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-[#B6F554] border border-black/10 text-charcoal flex items-center justify-center shadow-soft">
                  <Check className="w-9 h-9 stroke-[3.5] text-charcoal" />
                </div>

                <h3 className="text-xl font-black text-charcoal">
                  Payment Successful!
                </h3>
                <p className="text-xs text-charcoal/70 max-w-xs leading-relaxed font-medium">
                  Your payment of <strong className="text-charcoal font-black">&#8377;{upgradePlan === 'yearly' ? '2,999' : '299'}</strong> cleared. Pro Creator features and permanent vector QR are now live!
                </p>

                <div className="w-full p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Status: Active Pro Member</span>
                  </div>
                  <span className="font-mono text-charcoal/60">
                    {upgradePlan === 'yearly' ? '365 Days' : '30 Days'}
                  </span>
                </div>

                {/* Continue with Dashboard Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowUpgradeModal(false);
                    setUpgradeModalStep('plan');
                  }}
                  className="w-full py-4 px-6 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md shadow-[#4F83FF]/20 transition-transform active:scale-95 cursor-pointer mt-2"
                >
                  <span>Continue with Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Left Collapsible Navigation Sidebar Drawer (toggled via 3-dots header button) */}
      <AppSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        linkCount={links.length}
        onOpenAuth={() => setShowAuthModal(true)}
        isDesktopCollapsed={isSidebarCollapsed}
      />

      {/* Main Content Layout Container: Full-width responsive with desktop sidebar offset */}
      <div className={`w-full transition-all duration-300 flex flex-col min-h-screen ${isSidebarCollapsed ? 'lg:pl-0' : 'lg:pl-72'}`}>
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 pt-2 sm:pt-3 pb-10 sm:pb-12">
          {/* Top Header */}
          <DashboardHeader
            profile={profile}
            onToggleSidebar={handleToggleSidebar}
            onSelectTab={handleSelectTab}
            onPublishClick={handlePublishClick}
            isPublished={isPublished}
          />

          {/* User Data Modules Workspace (100% Full Width — Fits Screen) */}
          <main className="w-full flex flex-col gap-6 mt-3">
          {/* TAB: DASHBOARD (Matching User's Uploaded Team Space Bento Screen Exactly) */}
          {activeTab === 'dashboard' && (
            <CreatorDashboard
              profile={profile}
              links={links}
              store={store}
              analytics={analytics}
              onSelectTab={handleSelectTab}
            />
          )}

          {/* TAB: EDIT PROFILE (Profile Settings + Real-time Live Phone Preview on Right Side) */}
          {(activeTab === 'profile' || activeTab === 'themes') && (
            <div className="w-full flex flex-col gap-4">
              {/* Mobile/Tablet View Toggle (Shown only below lg breakpoint) */}
              <div className="lg:hidden flex items-center justify-center p-1 rounded-2xl bg-white border border-black/10 shadow-xs max-w-sm mx-auto w-full">
                <button
                  type="button"
                  onClick={() => setProfileViewMode('form')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    profileViewMode === 'form'
                      ? 'bg-[#4F83FF] text-white shadow-xs'
                      : 'text-charcoal/70 hover:text-black'
                  }`}
                >
                  Edit Profile & Links
                </button>
                <button
                  type="button"
                  onClick={() => setProfileViewMode('preview')}
                  className={`flex-1 py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    profileViewMode === 'preview'
                      ? 'bg-[#4F83FF] text-white shadow-xs'
                      : 'text-charcoal/70 hover:text-black'
                  }`}
                >
                  <span>Live Preview</span>
                  <span className="w-2 h-2 rounded-full bg-[#B6F554]" />
                </button>
              </div>

              {/* Side-by-Side on Desktop (lg:), Adaptive View on Mobile */}
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Form & Link Block Manager & Theme Studio */}
                <div className={`lg:col-span-7 xl:col-span-8 flex flex-col gap-6 ${
                  profileViewMode === 'preview' ? 'hidden lg:flex' : 'flex'
                }`}>
                  <EditProfileSection
                    profile={profile}
                    vcard={vcard}
                    links={links}
                    store={store}
                    onUpdateStore={handleUpdateStore}
                    onUpdateProfile={handleUpdateProfile}
                    onUpdateVCard={handleUpdateVCard}
                    onUpdateLinks={handleUpdateLinks}
                    onLiveChange={(preview) => setProfile(preview)}
                    onLiveVCardChange={(previewVCard) => setVcard(previewVCard)}
                    activeSectionTab={activeTab === 'themes' ? 'themes' : editSectionTab}
                    onSectionTabChange={(tab) => setEditSectionTab(tab)}
                  />
                </div>

                {/* Right Column: Sticky Live Mobile Phone Preview with Real-time Updates */}
                <div className={`lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 self-start flex flex-col items-center justify-center ${
                  profileViewMode === 'form' ? 'hidden lg:flex' : 'flex'
                }`}>
                  <LivePhonePreview
                    profile={profile}
                    vcard={vcard}
                    links={links}
                    nfcCard={nfcCard}
                    store={store}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: DIGITAL BUSINESS CARD & PERMANENT QR */}
          {activeTab === 'digital-card' && (
            <DigitalCardStudio
              profile={profile}
              vcard={vcard}
              username={profile.username}
              onUpdateVCard={handleUpdateVCard}
              onSelectTab={handleSelectTab}
            />
          )}

          {/* TAB: METAL NFC HARDWARE STUDIO */}
          {activeTab === 'nfc' && (
            <NFCCardStudio
              nfcCard={nfcCard}
              username={profile.username}
              onUpdateCard={handleUpdateNFCCard}
            />
          )}

          {/* TAB: USER ACCOUNT & ORDERS */}
          {activeTab === 'account' && (
            <AccountOrdersSection
              profile={profile}
              subscription={subscription}
              nfcCard={nfcCard}
              onUpgradeClick={() => setShowUpgradeModal(true)}
            />
          )}
        </main>
        </div>
      </div>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center font-bold text-xs text-charcoal/60">
          Loading TAPPING Space...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
