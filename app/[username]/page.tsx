'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  getStoredProfile, 
  getStoredVCard, 
  getStoredLinks, 
  getStoredNFCCard, 
  incrementLinkClick, 
  recordPageView,
  recordNFCTap,
  recordVCardDownload,
  recordQRScan
} from '@/lib/storage';
import { 
  initialProfile, 
  initialVCard, 
  initialLinks, 
  initialNFCCard 
} from '@/lib/mockData';
import { Profile, VCardProfile, LinkBlock, NFCCardDesign } from '@/lib/types';
import { 
  Download, 
  ExternalLink, 
  Share2, 
  QrCode, 
  Check, 
  Globe, 
  Briefcase, 
  Layers, 
  UserCheck, 
  Calendar, 
  Headphones, 
  Mail, 
  X, 
  CreditCard, 
  ArrowLeft,
  Bell,
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';
import { downloadVCardFile } from '@/lib/vcard';
import QRCode from 'qrcode';
import { useToast } from '@/components/ui/Toast';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';
import { THEMES } from '@/lib/themes';

export default function PublicProfilePage() {
  const params = useParams();
  const usernameParam = (params?.username as string) || 'alex';
  const { showToast } = useToast();

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [vcard, setVcard] = useState<VCardProfile>(initialVCard);
  const [links, setLinks] = useState<LinkBlock[]>(initialLinks);
  const [nfcCard, setNfcCard] = useState<NFCCardDesign>(initialNFCCard);

  const [showQRModal, setShowQRModal] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [nfcTapped, setNfcTapped] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    recordPageView();
    setProfile(getStoredProfile());
    setVcard(getStoredVCard());
    setLinks(getStoredLinks());
    setNfcCard(getStoredNFCCard());

    if (typeof window !== 'undefined') {
      QRCode.toDataURL(window.location.href, { width: 320, margin: 2 })
        .then(setQrUrl)
        .catch(console.error);
    }
  }, []);

  const activeLinks = links.filter((l) => l.isActive);

  const handleLinkClick = (link: LinkBlock) => {
    incrementLinkClick(link.id);

    if (link.type === 'vcard_cta') {
      downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
      recordVCardDownload();
      showToast('Contact Saved', 'Direct contact card saved to device', 'success');
    } else if (link.url && link.url !== '#') {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Link Copied', window.location.href, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const simulateNFCTap = () => {
    recordNFCTap();
    setNfcTapped(true);
    showToast('NFC Tap Detected', 'Connected via Tapping Smart Card', 'success');
    setTimeout(() => setNfcTapped(false), 2500);
  };

  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());

  const teamAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-charcoal stroke-[2.2]" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-charcoal stroke-[2.2]" />;
      case 'user-check':
        return <UserCheck className="w-4 h-4 text-charcoal stroke-[2.2]" />;
      case 'headphones':
        return <Headphones className="w-4 h-4 text-charcoal stroke-[2.2]" />;
      default:
        return <Globe className="w-4 h-4 text-charcoal stroke-[2.2]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F5EE] text-charcoal flex flex-col items-center justify-start p-4 sm:p-6 lg:p-10 selection:bg-[#FDF166] selection:text-charcoal transition-colors duration-300">
      {/* Top Floating Navigation Bar: Fits screen gracefully */}
      <div className="w-full max-w-md lg:max-w-5xl flex items-center justify-between py-2 mb-4">
        <a
          href="/dashboard"
          className="text-xs font-bold text-charcoal/80 hover:text-black bg-white px-4 py-2 rounded-full border border-black/10 shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={simulateNFCTap}
            className="px-3.5 py-2 rounded-full bg-[#FDF166] hover:bg-[#FBE849] text-charcoal text-[11px] font-black border border-black/10 flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
            title="Simulate NFC Hardware Tap"
          >
            <CreditCard className="w-3.5 h-3.5 text-charcoal" />
            <span>NFC Tap</span>
          </button>
          <button
            onClick={() => {
              recordQRScan();
              setShowQRModal(true);
            }}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-black/10 flex items-center justify-center text-charcoal shadow-xs transition-colors"
            title="Show QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-white hover:bg-gray-100 border border-black/10 flex items-center justify-center text-charcoal shadow-xs transition-colors"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MAIN CONTAINER: RESPONSIVE DESKTOP & MOBILE CREATOR SHOWCASE */}
      <div className="w-full max-w-md lg:max-w-5xl bg-white rounded-[40px] p-6 lg:p-8 shadow-card border border-black/5 flex flex-col gap-6 text-left relative overflow-hidden">
        {/* Top Header Row */}
        <div className="flex items-start justify-between pb-2 border-b border-black/5">
          <div>
            <h1 className="text-3xl lg:text-4xl font-black text-charcoal leading-none">
              Connect With
            </h1>
            <h2 className="text-3xl lg:text-4xl font-black text-charcoal/35 leading-none mt-1">
              {profile.displayName}
            </h2>
            <p className="text-xs text-charcoal/60 mt-2 font-medium">
              {profile.bio || 'Product Designer and Systems Engineer.'}
            </p>
          </div>

          <button
            onClick={() => {
              recordQRScan();
              setShowQRModal(true);
            }}
            className="w-12 h-12 rounded-full bg-[#EFF4FF] hover:bg-[#E2ECFF] flex items-center justify-center shadow-xs transition-colors shrink-0"
            title="Open Permanent QR"
          >
            <Bell className="w-5 h-5 text-[#4F83FF] stroke-[2.4]" />
          </button>
        </div>

        {/* Sub-header row */}
        <div className="flex items-center justify-between">
          <span className="text-xs lg:text-sm font-bold text-charcoal/70">
            {dayName}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs lg:text-sm font-black text-charcoal">
              {activeLinks.length} Active Content Blocks
            </span>
            <ArrowUpRight className="w-4 h-4 text-charcoal stroke-[2.5]" />
          </div>
        </div>

        {/* Action Button & Verification Pill */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={() => {
              recordVCardDownload();
              downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
              showToast('Contact Saved', 'Directly imported into phonebook', 'success');
            }}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-gray-100 border border-black/10 shadow-xs transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-[#141518] text-white flex items-center justify-center shrink-0">
              <UserCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="block text-xs font-black text-charcoal leading-tight">
                Save Contact
              </span>
              <span className="block text-[10px] font-semibold text-charcoal/50">
                tapping.bio/{profile.username}
              </span>
            </div>
          </button>

          <div className="text-right">
            <span className="text-[9px] font-bold text-charcoal/50 block">Creator Status</span>
            <span className="text-xs lg:text-sm font-black text-charcoal uppercase tracking-wider bg-[#FDF166] px-3 py-1 rounded-full border border-black/10 inline-block mt-0.5 shadow-2xs">
              Verified Pro
            </span>
          </div>
        </div>

        {/* RESPONSIVE DESKTOP TWO-COLUMN / MOBILE STACK GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          {/* LEFT COLUMN (lg:col-span-5): Cobalt Blue Card + App Tiles + Network + Socials */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Cobalt Blue Card */}
            <div
              onClick={() => {
                recordVCardDownload();
                downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
                showToast('Contact Saved', 'Directly imported into phonebook', 'success');
              }}
              className="bg-[#4F83FF] hover:bg-[#4375EE] text-white rounded-3xl p-5 flex flex-col justify-between h-44 shadow-xs cursor-pointer transition-all"
              title="Download contact card"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-sm font-black leading-tight block">
                    {profile.displayName}
                  </span>
                  <span className="text-xs font-semibold text-white/75 mt-0.5 block">
                    {profile.badgeTitle || 'Product Designer'}
                  </span>
                </div>
                <MoreVertical className="w-4 h-4 text-white/80 shrink-0" />
              </div>

              <div>
                <p className="text-3xl font-black leading-none">vCard 3.0</p>
                <p className="text-xs font-bold text-white/80 mt-1">Tap to Save Contact to Phonebook</p>
              </div>
            </div>

            {/* 2 App Tiles */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  recordVCardDownload();
                  downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
                  showToast('Contact Saved', 'Saved to contacts', 'success');
                }}
                className="bg-[#FAF7F2] hover:bg-white rounded-2xl p-3 shadow-2xs border border-black/5 flex flex-col items-center justify-center transition-all cursor-pointer"
                title="Download vCard"
              >
                <UserCheck className="w-6 h-6 text-[#EA4335] mb-1" />
                <span className="text-xs font-black text-charcoal">vCard Contact</span>
              </button>

              <button
                onClick={() => {
                  recordQRScan();
                  setShowQRModal(true);
                }}
                className="bg-[#FAF7F2] hover:bg-white rounded-2xl p-3 shadow-2xs border border-black/5 flex flex-col items-center justify-center transition-all cursor-pointer"
                title="Show QR Code"
              >
                <QrCode className="w-6 h-6 text-[#34A853] mb-1" />
                <span className="text-xs font-black text-charcoal">Vector QR</span>
              </button>
            </div>

            {/* Network Reach Strip */}
            <div className="bg-[#FAF7F2] rounded-2xl p-3.5 border border-black/5 shadow-2xs flex items-center justify-between">
              <span className="text-xs font-black text-charcoal">Audience Reach</span>
              <div className="flex items-center -space-x-1.5">
                {teamAvatars.slice(0, 4).map((u, i) => (
                  <div key={i} className="w-6 h-6 rounded-full overflow-hidden border border-white">
                    <img src={u} alt="network" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-6 h-6 rounded-full bg-[#FDF166] text-charcoal font-black text-[9px] flex items-center justify-center border border-white">
                  +10
                </div>
              </div>
            </div>

            {/* Social Icons Bar */}
            <div className="flex items-center justify-center gap-2.5 pt-3 border-t border-black/5">
              {profile.socialLinks?.instagram && (
                <a
                  href={`https://instagram.com/${profile.socialLinks.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-white border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-2xs"
                  title="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a
                  href={`https://x.com/${profile.socialLinks.twitter.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-white border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-2xs"
                  title="X / Twitter"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.github && (
                <a
                  href={`https://github.com/${profile.socialLinks.github.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-white border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-2xs"
                  title="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin.startsWith('http') ? profile.socialLinks.linkedin : `https://${profile.socialLinks.linkedin}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-white border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-2xs"
                  title="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks?.email && (
                <a
                  href={`mailto:${profile.socialLinks.email}`}
                  className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-white border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-2xs"
                  title="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (lg:col-span-7): Featured Status Cards + All Link Blocks */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Top 2 Featured Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Yellow Card: First Link */}
              {activeLinks[0] && (
                <div
                  onClick={() => handleLinkClick(activeLinks[0])}
                  className="bg-[#FDF166] hover:bg-[#FBE849] rounded-3xl p-5 flex flex-col justify-between h-32 cursor-pointer transition-all text-charcoal shadow-2xs"
                >
                  <div>
                    <p className="text-xl font-black leading-none">
                      {activeLinks[0].clickCount} <span className="text-[10px] font-bold text-charcoal/70">clicks</span>
                    </p>
                    <p className="text-xs font-black truncate mt-1.5">
                      {activeLinks[0].title}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black">Explore Link</span>
                    <span className="w-2 h-2 rounded-full bg-[#EAB308]" />
                  </div>
                </div>
              )}

              {/* Lime Card: Second Link */}
              {activeLinks[1] && (
                <div
                  onClick={() => handleLinkClick(activeLinks[1])}
                  className="bg-[#B6F554] hover:bg-[#A6EC3C] rounded-3xl p-5 flex flex-col justify-between h-32 cursor-pointer transition-all text-charcoal shadow-2xs"
                >
                  <div>
                    <p className="text-xl font-black leading-none">
                      {activeLinks[1].clickCount} <span className="text-[10px] font-bold text-charcoal/70">clicks</span>
                    </p>
                    <p className="text-xs font-black truncate mt-1.5">
                      {activeLinks[1].title}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black">Explore Link</span>
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                  </div>
                </div>
              )}
            </div>

            {/* Remaining Links List */}
            <div className="flex flex-col gap-3">
              {activeLinks.slice(2).map((link) => (
                <div
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className="p-4 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-black/10 transition-all cursor-pointer flex items-center justify-between shadow-2xs group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-black/5 flex items-center justify-center shrink-0">
                      {renderIcon(link.icon)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-charcoal truncate">
                        {link.title}
                      </p>
                      {link.subtitle && (
                        <p className="text-[11px] text-charcoal/60 truncate font-medium mt-0.5">
                          {link.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-charcoal/40 group-hover:text-charcoal group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="pt-2 text-center border-t border-black/5">
          <a
            href="/"
            className="text-[10px] font-black text-charcoal/40 hover:text-charcoal uppercase tracking-widest inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Powered by TAPPING</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 max-w-xs w-full text-center border border-black/10 shadow-float">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-black text-charcoal uppercase tracking-wider">
                Permanent Vector QR
              </span>
              <button onClick={() => setShowQRModal(false)} className="text-charcoal/60 hover:text-charcoal">
                <X className="w-4 h-4" />
              </button>
            </div>
            {qrUrl && (
              <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-2xl p-2 bg-[#F7F5EE] border border-black/5" />
            )}
            <p className="font-mono text-xs text-charcoal/60 mt-3 font-bold">
              tapping.bio/{profile.username}
            </p>
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = qrUrl;
                a.download = `${profile.username}-qr.png`;
                a.click();
              }}
              className="mt-4 w-full py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-bold shadow-xs transition-colors"
            >
              Download PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
