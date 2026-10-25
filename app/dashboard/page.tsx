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
import BentoQuickStats from '@/components/dashboard/BentoQuickStats';
import BentoProgressRing from '@/components/dashboard/BentoProgressRing';
import BentoMenuGrid from '@/components/dashboard/BentoMenuGrid';
import AudienceFlowChart from '@/components/dashboard/AudienceFlowChart';
import EditProfileSection from '@/components/dashboard/EditProfileSection';
import DigitalCardStudio from '@/components/dashboard/DigitalCardStudio';
import NFCCardStudio from '@/components/dashboard/NFCCardStudio';
import ThemesStudio from '@/components/dashboard/ThemesStudio';
import FloatingBottomDock from '@/components/dashboard/FloatingBottomDock';
import GoogleAuthModal from '@/components/auth/GoogleAuthModal';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Sync state on client mount to prevent SSR hydration mismatch
  useEffect(() => {
    setProfile(getStoredProfile());
    setVcard(getStoredVCard());
    setLinks(getStoredLinks());
    setNfcCard(getStoredNFCCard());
    setAnalytics(getStoredAnalytics());
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

      {/* Left Collapsible Navigation Sidebar Drawer (toggled via 3-lines header button) */}
      <AppSidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profile={profile}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* Main Content Layout Container */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 pt-3 pb-28 md:pb-14">
        {/* Top Header with 3-lines hamburger menu toggle button */}
        <DashboardHeader
          profile={profile}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onSelectTab={(tab) => setActiveTab(tab)}
        />

        {/* User Data Modules Workspace (100% Full Width — No Preview) */}
        <main className="w-full flex flex-col gap-6 mt-3">
          {/* TAB: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-5">
              {/* Top Bento Duo: Macro Stats & Circular Progress Ring */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BentoQuickStats
                  analytics={analytics}
                  onAddBlock={() => setActiveTab('profile')}
                  onSeeProgress={() => setActiveTab('dashboard')}
                />
                <BentoProgressRing
                  percentage={95}
                  totalTaps={analytics.totalViews}
                  onExplore={() => setActiveTab('dashboard')}
                />
              </div>

              {/* 2x2 Bento Module Grid directly from user's image */}
              <BentoMenuGrid
                activeTab={activeTab}
                onSelectTab={(tab) => setActiveTab(tab)}
              />

              {/* Audience Flow Chart */}
              <AudienceFlowChart analytics={analytics} />
            </div>
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

      {/* Floating Bottom Pill Dock - Strictly Mobile Viewport (< md) */}
      <FloatingBottomDock
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onQuickAdd={() => setActiveTab('profile')}
      />
    </div>
  );
}
