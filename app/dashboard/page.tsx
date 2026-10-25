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
        onOpenOnboarding={() => setShowOnboarding(true)}
      />

      {/* Main Content Layout Container: Full-width responsive with desktop sidebar offset */}
      <div className="w-full lg:pl-72 flex flex-col min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 pt-3 pb-28 lg:pb-12">
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

          {/* TAB: EDIT PROFILE (Full Profile Settings + Link Blocks) */}
          {activeTab === 'profile' && (
            <EditProfileSection
              profile={profile}
              links={links}
              onUpdateProfile={handleUpdateProfile}
              onUpdateLinks={handleUpdateLinks}
            />
          )}

          {/* TAB: DIGITAL BUSINESS CARD & PERMANENT QR */}
          {activeTab === 'digital-card' && (
            <DigitalCardStudio
              vcard={vcard}
              username={profile.username}
              onUpdateVCard={handleUpdateVCard}
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

          {/* TAB: PASTEL THEMES STUDIO */}
          {activeTab === 'themes' && (
            <ThemesStudio
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
            />
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
