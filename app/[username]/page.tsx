'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  getStoredProfile, 
  getStoredVCard, 
  getStoredLinks, 
  getStoredNFCCard, 
  incrementLinkClick, 
  recordPageView 
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
  ShieldCheck,
  ArrowLeft
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
    setNfcTapped(true);
    showToast('NFC Tap Detected', 'Connected via Tapping Smart Card', 'success');
    setTimeout(() => setNfcTapped(false), 2500);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'briefcase':
        return <Briefcase className="w-4 h-4 text-charcoal" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-charcoal" />;
      case 'user-check':
        return <UserCheck className="w-4 h-4 text-charcoal" />;
      case 'calendar':
        return <Calendar className="w-4 h-4 text-charcoal" />;
      case 'headphones':
        return <Headphones className="w-4 h-4 text-charcoal" />;
      default:
        return <Globe className="w-4 h-4 text-charcoal" />;
    }
  };

  const currentTheme = THEMES[profile.theme] || THEMES['pastel-bento'];

  const getStyleClasses = (variant: string) => {
    return currentTheme.linkVariantClass(variant);
  };

  return (
    <div className={`min-h-screen ${currentTheme.canvasBg} ${currentTheme.textHeading} flex flex-col items-center justify-start p-4 transition-colors duration-300`}>
      {/* Top Floating Controls */}
      <div className="w-full max-w-md flex items-center justify-between py-2 mb-2">
        <a
          href="/dashboard"
          className="text-xs font-bold text-charcoal/80 hover:text-black bg-white/80 px-3 py-1.5 rounded-full border border-black/5 shadow-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Creator Dashboard</span>
        </a>

        <div className="flex items-center gap-1.5">
          <button
            onClick={simulateNFCTap}
            className="px-2.5 py-1.5 rounded-full bg-pastel-yellow text-charcoal text-[11px] font-bold border border-pastel-yellow-border flex items-center gap-1.5 shadow-xs"
            title="Simulate NFC Hardware Tap"
          >
            <CreditCard className="w-3 h-3 text-charcoal" />
            <span>NFC Tap</span>
          </button>
          <button
            onClick={() => setShowQRModal(true)}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-black/10 flex items-center justify-center text-charcoal shadow-xs"
            title="Show QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white hover:bg-gray-100 border border-black/10 flex items-center justify-center text-charcoal shadow-xs"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className={`w-full max-w-md ${currentTheme.containerBg} rounded-4xl p-6 md:p-8 shadow-card border border-black/5 flex flex-col items-center text-center relative overflow-hidden transition-colors`}>
        <div className={`w-28 h-4 ${currentTheme.badgeBg} ${currentTheme.badgeBorder} rounded-b-2xl mb-4 shadow-xs border-b flex items-center justify-center`}>
          <span className={`text-[9px] font-bold ${currentTheme.badgeText} tracking-widest uppercase`}>TAPPING</span>
        </div>

        {/* NFC Alert Banner */}
        {nfcTapped && (
          <div className="w-full bg-[#1F2024] text-white p-3 rounded-2xl shadow-float flex items-center gap-2.5 mb-4">
            <CreditCard className="w-4 h-4 text-pastel-yellow shrink-0" />
            <div className="text-left text-xs">
              <p className="font-bold">NFC Hardware Tapped</p>
              <p className="text-[10px] text-white/70">Contact ready to save</p>
            </div>
          </div>
        )}

        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-3 border-white shadow-soft bg-pastel-peach">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          {profile.isVerified && (
            <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-[#1F2024] text-white border-2 border-white text-[9px] font-bold shadow-sm">
              Verified
            </div>
          )}
        </div>

        {/* Display Name & Handle */}
        <h1 className="text-2xl font-black text-charcoal tracking-tight mt-3">
          {profile.displayName}
        </h1>
        <p className="text-xs font-semibold text-charcoal-muted tracking-wide mt-0.5">
          @{profile.username}
        </p>

        {profile.badgeTitle && (
          <span className="mt-2 px-3 py-1 rounded-full bg-pastel-peach-light text-charcoal text-xs font-bold border border-pastel-peach-border">
            {profile.badgeTitle}
          </span>
        )}

        {profile.bio && (
          <p className="text-xs text-charcoal/80 mt-3 max-w-sm leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Contact Download */}
        <button
          onClick={() => {
            downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
            showToast('Contact Saved', 'Directly imported into phonebook', 'success');
          }}
          className={`mt-4 w-full py-3 px-6 rounded-full ${currentTheme.accentBtn} ${currentTheme.accentBtnText} text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95`}
        >
          <Download className="w-4 h-4 text-pastel-yellow" />
          <span>Save Contact to Phone</span>
        </button>

        {/* Social Icons Bar */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-black/5 w-full">
          {profile.socialLinks?.instagram && (
            <a
              href={profile.socialLinks.instagram}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-pastel-peach border border-black/5 flex items-center justify-center text-charcoal transition-all shadow-xs"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks?.twitter && (
            <a
              href={profile.socialLinks.twitter}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-pastel-sky border border-black/5 flex items-center justify-center text-charcoal transition-all shadow-xs"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks?.linkedin && (
            <a
              href={profile.socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-pastel-lavender border border-black/5 flex items-center justify-center text-charcoal transition-all shadow-xs"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks?.github && (
            <a
              href={profile.socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-pastel-mint border border-black/5 flex items-center justify-center text-charcoal transition-all shadow-xs"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks?.email && (
            <a
              href={`mailto:${profile.socialLinks.email}`}
              className="w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-pastel-yellow border border-black/5 flex items-center justify-center text-charcoal transition-all shadow-xs"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Active Blocks Stack */}
        <div className="w-full flex flex-col gap-3 mt-5">
          {activeLinks.map((link) => (
            <div
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-soft hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 ${getStyleClasses(
                link.styleVariant
              )}`}
            >
              <div className="flex items-center gap-3.5 min-w-0 text-left">
                <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shrink-0 shadow-xs">
                  {renderIcon(link.icon)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs md:text-sm font-extrabold truncate leading-tight">
                    {link.title}
                  </h3>
                  {link.subtitle && (
                    <p className="text-[11px] text-charcoal/70 truncate mt-0.5">{link.subtitle}</p>
                  )}
                </div>
              </div>
              <ExternalLink className="w-4 h-4 opacity-60 shrink-0 ml-2" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-black/5 flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-[#1F2024] text-white flex items-center justify-center text-[10px] font-bold">
            T
          </div>
          <a
            href="/"
            className="text-[11px] font-bold text-charcoal/70 hover:text-charcoal tracking-wider uppercase"
          >
            Create Your Own Tapping Bio
          </a>
        </div>
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 max-w-xs w-full text-center border border-black/10 shadow-float">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Permanent QR
              </span>
              <button onClick={() => setShowQRModal(false)} className="text-charcoal-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            {qrUrl && (
              <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-2xl p-2 bg-[#FAF7F2]" />
            )}
            <p className="font-mono text-xs text-charcoal-muted mt-3">
              tapping.bio/{profile.username}
            </p>
            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = qrUrl;
                a.download = `${profile.username}-qr.png`;
                a.click();
              }}
              className="mt-4 w-full py-2.5 rounded-full bg-[#1F2024] text-white text-xs font-semibold shadow-xs"
            >
              Download PNG
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
