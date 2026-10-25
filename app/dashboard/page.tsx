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
import { useToast } from '@/components/ui/Toast';
import { Check, X, CreditCard, Zap } from 'lucide-react';
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
  const [editSectionTab, setEditSectionTab] = useState<'profile' | 'links' | 'themes'>('profile');
  const [profileViewMode, setProfileViewMode] = useState<'form' | 'preview'>('form');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [upgradePlan, setUpgradePlan] = useState<'monthly' | 'yearly'>('monthly');

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
    } else if (tab === 'digital-card') {
      setActiveTab('digital-card');
    } else if (tab === 'store') {
      setActiveTab('store');
    } else if (tab === 'dashboard') {
      setActiveTab('dashboard');
    }

    if (action === 'upgrade') {
      setShowUpgradeModal(true);
      if (plan === 'yearly' || plan === 'monthly') {
        setUpgradePlan(plan);
      }
    }
  }, [searchParams]);

  // Sync state on client mount to prevent SSR hydration mismatch
  useEffect(() => {
    setProfile(getStoredProfile());
    setVcard(getStoredVCard());
    setLinks(getStoredLinks());
    setNfcCard(getStoredNFCCard());
    setAnalytics(getStoredAnalytics());
    setStore(getStoredStore());

    // Show onboarding if first visit
    if (!getOnboardingCompleted()) {
      setShowOnboarding(true);
    }
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

  const handleActivatePlan = (plan: 'monthly' | 'yearly') => {
    setSubscription({
      tier: 'pro',
      status: 'active',
      expiresAt: new Date(Date.now() + (plan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    setShowUpgradeModal(false);
    showToast(
      'Account Activated!',
      `TAPPING Pro (${plan === 'yearly' ? '\u20B92,999/yr' : '\u20B9299/mo'}) unlocked with permanent dynamic QR & custom themes`,
      'success'
    );
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
          <div className="bg-white rounded-4xl p-6 sm:p-8 w-full max-w-lg shadow-2xl border border-black/10 flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FDF166] flex items-center justify-center text-charcoal shadow-2xs">
                  <Zap className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-charcoal">Activate TAPPING PRO</h3>
                  <p className="text-[11px] font-bold text-charcoal/60">Official Indian Rupee Pricing</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-gray-200 flex items-center justify-center text-charcoal/70 hover:text-black cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Plan Switcher Pills */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-[#FAF7F2] border border-black/10">
              <button
                type="button"
                onClick={() => setUpgradePlan('monthly')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  upgradePlan === 'monthly'
                    ? 'bg-[#141518] text-white shadow-xs'
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
                    ? 'bg-[#141518] text-white shadow-xs'
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

            {/* Payment Summary & Instant Checkout */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleActivatePlan(upgradePlan)}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>
                  Confirm &amp; Activate {upgradePlan === 'yearly' ? 'Annual Plan (\u20B92,999)' : 'Monthly Plan (\u20B9299)'}
                </span>
              </button>
              <p className="text-[10px] text-center text-charcoal/50 font-medium">
                Instant UPI &amp; Razorpay sandbox activation &bull; 100% money-back satisfaction guarantee
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Left Collapsible Navigation Sidebar Drawer (toggled via 3-lines header button) */}
      <AppSidebar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        linkCount={links.length}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Content Layout Container: Full-width responsive with desktop sidebar offset */}
      <div className="w-full lg:pl-72 flex flex-col min-h-screen">
        <div className="w-full max-w-[1720px] mx-auto px-3 sm:px-6 md:px-8 lg:px-10 pt-2 sm:pt-3 pb-10 sm:pb-12">
          {/* Top Header */}
          <DashboardHeader
            profile={profile}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onSelectTab={handleSelectTab}
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
                      ? 'bg-[#141518] text-white shadow-xs'
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
                    onUpdateProfile={handleUpdateProfile}
                    onUpdateVCard={handleUpdateVCard}
                    onUpdateLinks={handleUpdateLinks}
                    onLiveChange={(preview) => setProfile(preview)}
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

          {activeTab === 'store' && (
            <StoreManager
              store={store}
              onUpdateStore={handleUpdateStore}
              publicUrl={`/${profile.username}/shop`}
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

          {/* TAB: ORDER NFC TAGS & HARDWARE SHOP */}
          {(activeTab === 'nfc-shop' || activeTab === 'shop') && (
            <NFCTagShop
              profile={profile}
              vcard={vcard}
              username={profile.username}
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
