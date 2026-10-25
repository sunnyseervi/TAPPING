'use client';

import React, { useState, useEffect } from 'react';
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
  getOnboardingCompleted,
} from '@/lib/storage';
import { 
  initialProfile, 
  initialVCard, 
  initialLinks, 
  initialNFCCard, 
  initialAnalytics, 
  initialSubscription 
} from '@/lib/mockData';
import { Profile, VCardProfile, LinkBlock, NFCCardDesign, AnalyticsSummary, Subscription } from '@/lib/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import TeamSpaceBento from '@/components/dashboard/TeamSpaceBento';
import EditProfileSection from '@/components/dashboard/EditProfileSection';
import DigitalCardStudio from '@/components/dashboard/DigitalCardStudio';
import NFCCardStudio from '@/components/dashboard/NFCCardStudio';
import ThemesStudio from '@/components/dashboard/ThemesStudio';
import FloatingBottomDock from '@/components/dashboard/FloatingBottomDock';
import GoogleAuthModal from '@/components/auth/GoogleAuthModal';
import AnimatedOnboarding from '@/components/onboarding/AnimatedOnboarding';
import LivePhonePreview from '@/components/preview/LivePhonePreview';
import { useToast } from '@/components/ui/Toast';

export default function DashboardPage() {
  const { showToast } = useToast();

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [vcard, setVcard] = useState<VCardProfile>(initialVCard);
  const [links, setLinks] = useState<LinkBlock[]>(initialLinks);
  const [nfcCard, setNfcCard] = useState<NFCCardDesign>(initialNFCCard);
  const [analytics, setAnalytics] = useState<AnalyticsSummary>(initialAnalytics);
  const [subscription, setSubscription] = useState<Subscription>(initialSubscription);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [profileViewMode, setProfileViewMode] = useState<'form' | 'preview'>('form');
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Sync state on client mount to prevent SSR hydration mismatch
  useEffect(() => {
    setProfile(getStoredProfile());
    setVcard(getStoredVCard());
    setLinks(getStoredLinks());
    setNfcCard(getStoredNFCCard());
    setAnalytics(getStoredAnalytics());

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

      {/* Left Collapsible Navigation Sidebar Drawer (toggled via 3-lines header button) */}
      <AppSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Content Layout Container: Full-width responsive with desktop sidebar offset */}
      <div className="w-full lg:pl-72 flex flex-col min-h-screen">
        <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-3 pb-28 lg:pb-12">
          {/* Top Header */}
          <DashboardHeader
            profile={profile}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onSelectTab={(tab) => setActiveTab(tab)}
          />

          {/* User Data Modules Workspace (100% Full Width — Fits Screen) */}
          <main className="w-full flex flex-col gap-6 mt-3">
          {/* TAB: DASHBOARD (Matching User's Uploaded Team Space Bento Screen Exactly) */}
          {activeTab === 'dashboard' && (
            <TeamSpaceBento
              profile={profile}
              analytics={analytics}
              onSelectTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB: EDIT PROFILE (Profile Settings + Real-time Live Phone Preview on Right Side) */}
          {activeTab === 'profile' && (
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
                {/* Left Column: Form & Link Block Manager */}
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
              onSelectTab={(tab) => setActiveTab(tab)}
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

          {/* TAB: PASTEL THEMES & DESIGN STUDIO */}
          {activeTab === 'themes' && (
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 xl:col-span-8">
                <ThemesStudio
                  profile={profile}
                  onUpdateProfile={handleUpdateProfile}
                />
              </div>

              {/* Right Column: Sticky Live Mobile Phone Preview with Real-time Updates */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 self-start flex flex-col items-center justify-center">
                <LivePhonePreview
                  profile={profile}
                  vcard={vcard}
                  links={links}
                  nfcCard={nfcCard}
                />
              </div>
            </div>
          )}
        </main>
        </div>
      </div>

      {/* Floating Bottom Pill Dock - Strictly Mobile Viewport (< lg) */}
      <FloatingBottomDock
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onQuickAdd={() => setActiveTab('profile')}
      />
    </div>
  );
}
