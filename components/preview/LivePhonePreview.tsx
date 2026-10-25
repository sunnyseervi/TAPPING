'use client';

import React, { useState } from 'react';
import { Profile, VCardProfile, LinkBlock, NFCCardDesign } from '@/lib/types';
import { 
  Download, 
  ExternalLink, 
  Check, 
  CreditCard, 
  Globe, 
  Briefcase, 
  Layers, 
  UserCheck, 
  Calendar, 
  Headphones,
  Mail,
  ArrowUpRight,
  Wifi,
  Battery
} from 'lucide-react';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';
import { downloadVCardFile } from '@/lib/vcard';
import { incrementLinkClick } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';

interface LivePreviewProps {
  profile: Profile;
  vcard: VCardProfile;
  links: LinkBlock[];
  nfcCard?: NFCCardDesign;
  onLinkClick?: (linkId: string) => void;
}

export default function LivePhonePreview({
  profile,
  vcard,
  links,
  nfcCard,
  onLinkClick,
}: LivePreviewProps) {
  const { showToast } = useToast();
  const [nfcTapped, setNfcTapped] = useState(false);

  const activeLinks = links.filter((l) => l.isActive);

  const handleLinkClick = (link: LinkBlock) => {
    incrementLinkClick(link.id);
    if (onLinkClick) onLinkClick(link.id);

    if (link.type === 'vcard_cta') {
      downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
      showToast('Contact Card Downloaded', 'Saved to your phonebook contacts', 'success');
    } else if (link.url && link.url !== '#') {
      window.open(link.url, '_blank', 'noopener,noreferrer');
      showToast('Link Opened', `Opening ${link.title}`, 'info');
    }
  };

  const simulateNFCTap = () => {
    setNfcTapped(true);
    showToast('NFC Tap Triggered', 'Simulated hardware tap on smartphone reader', 'success');
    setTimeout(() => setNfcTapped(false), 2500);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'briefcase':
        return <Briefcase className="w-3.5 h-3.5 text-charcoal stroke-[2.2]" />;
      case 'layers':
        return <Layers className="w-3.5 h-3.5 text-charcoal stroke-[2.2]" />;
      case 'user-check':
        return <UserCheck className="w-3.5 h-3.5 text-charcoal stroke-[2.2]" />;
      case 'calendar':
        return <Calendar className="w-3.5 h-3.5 text-charcoal stroke-[2.2]" />;
      case 'headphones':
        return <Headphones className="w-3.5 h-3.5 text-charcoal stroke-[2.2]" />;
      default:
        return <Globe className="w-3.5 h-3.5 text-charcoal stroke-[2.2]" />;
    }
  };

  const getStyleClasses = (variant: string) => {
    switch (variant) {
      case 'peach':
        return 'bg-pastel-peach hover:bg-[#FDBFA7] border-pastel-peach-border text-charcoal';
      case 'lavender':
        return 'bg-pastel-lavender hover:bg-[#D5CEFA] border-pastel-lavender-border text-charcoal';
      case 'yellow':
        return 'bg-pastel-yellow hover:bg-[#FDE25D] border-pastel-yellow-border text-charcoal';
      case 'mint':
        return 'bg-pastel-mint hover:bg-[#C2E4BF] border-pastel-mint-border text-charcoal';
      case 'sky':
        return 'bg-pastel-sky hover:bg-[#C2DCFE] border-pastel-sky-border text-charcoal';
      default:
        return 'bg-white hover:bg-gray-50 border-black/10 text-charcoal';
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Top Preview Controls Bar */}
      <div className="w-full max-w-[340px] flex items-center justify-between mb-3 px-1 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-charcoal">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Phone Preview</span>
        </div>
        <button
          onClick={simulateNFCTap}
          className="px-3 py-1 rounded-full bg-pastel-yellow text-[11px] font-black text-charcoal border border-pastel-yellow-border hover:bg-pastel-yellow-dark/20 flex items-center gap-1.5 shadow-xs transition-colors"
          title="Simulate NFC Hardware Tap"
        >
          <CreditCard className="w-3.5 h-3.5 stroke-[2.2]" />
          <span>Simulate NFC Tap</span>
        </button>
      </div>

      {/* Realistic iPhone Mockup Frame (Zero Corner Vignette / Zero Shadow Bleeds) */}
      <div className="w-[320px] sm:w-[340px] h-[670px] bg-[#151619] rounded-[48px] p-[10px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] ring-1 ring-white/10 relative flex flex-col select-none">
        {/* Inner Phone Screen */}
        <div className="w-full h-full bg-[#FAF6F0] rounded-[38px] overflow-hidden flex flex-col relative">
          {/* Authentic Dynamic Island & Status Bar */}
          <div className="w-full pt-3 px-6 pb-2 flex items-center justify-between bg-[#FAF6F0]/95 backdrop-blur-sm z-20 shrink-0">
            <span className="text-[11px] font-black font-mono tracking-tight text-charcoal">9:41</span>
            
            {/* Dynamic Island */}
            <div className="w-24 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-950/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#052e16]/80" />
              </div>
            </div>

            {/* Signal & Battery */}
            <div className="flex items-center gap-1.5 text-charcoal">
              <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
              <div className="w-4 h-2 rounded-[2px] border border-charcoal p-[1px] flex items-center">
                <div className="w-full h-full bg-charcoal rounded-[1px]" />
              </div>
            </div>
          </div>

          {/* NFC Tap Banner Notification */}
          {nfcTapped && (
            <div className="absolute top-12 left-3 right-3 z-30 bg-[#1A1B1F] text-white p-3 rounded-2xl shadow-float flex items-center gap-2.5 border border-white/20 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="w-8 h-8 rounded-xl bg-pastel-yellow flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 text-charcoal stroke-[2.5]" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-black text-white">NFC Card Tapped</p>
                <p className="text-[10px] text-white/70 truncate">Connected via Tapping Smart Hardware</p>
              </div>
            </div>
          )}

          {/* Scrollable Phone Bio Page Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-6 flex flex-col items-center">
            {/* Circular Avatar with Clean Border */}
            <div className="relative mt-2">
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-soft bg-pastel-peach">
                <img
                  src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Display Name & Handle */}
            <h1 className="text-base font-black text-charcoal mt-2.5 tracking-tight text-center">
              {profile.displayName}
            </h1>

            <p className="text-[11px] font-bold text-charcoal/60 mt-0.5">
              @{profile.username}
            </p>

            {profile.badgeTitle && (
              <span className="text-[10px] font-extrabold px-3 py-0.5 rounded-full bg-white text-charcoal shadow-xs border border-black/5 mt-1.5">
                {profile.badgeTitle}
              </span>
            )}

            {profile.bio && (
              <p className="text-[11px] text-charcoal/70 text-center mt-2 max-w-[240px] leading-relaxed font-medium">
                {profile.bio}
              </p>
            )}

            {/* Save Contact Card CTA Button */}
            <button
              onClick={() => {
                downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
                showToast('Contact Saved', 'Downloaded contact card to phonebook', 'success');
              }}
              className="mt-3.5 w-full py-2.5 px-4 rounded-full bg-[#1A1B1F] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-pastel-yellow stroke-[2.5]" />
              <span>Save Contact Card</span>
            </button>

            {/* Monoline Social Icons Strip */}
            <div className="w-full py-3 flex items-center justify-center gap-2">
              {profile.socialLinks?.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-pastel-peach border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-xs"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-pastel-sky border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-xs"
                >
                  <TwitterIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-pastel-lavender border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-xs"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-pastel-mint border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-xs"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socialLinks?.email && (
                <a
                  href={`mailto:${profile.socialLinks.email}`}
                  className="w-8 h-8 rounded-full bg-white hover:bg-pastel-yellow border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-xs"
                >
                  <Mail className="w-3.5 h-3.5 stroke-[2.2]" />
                </a>
              )}
            </div>

            {/* Active Link Blocks Stack */}
            <div className="w-full flex flex-col gap-2.5 mt-1 pb-4">
              {activeLinks.length === 0 ? (
                <div className="bg-white/60 rounded-2xl p-4 text-center border border-black/5">
                  <p className="text-xs text-charcoal/60 font-semibold">No blocks active</p>
                </div>
              ) : (
                activeLinks.map((link) => (
                  <div
                    key={link.id}
                    onClick={() => handleLinkClick(link)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-soft hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 ${getStyleClasses(
                      link.styleVariant
                    )}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shrink-0 shadow-xs">
                        {renderIcon(link.icon)}
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-black truncate leading-tight">{link.title}</p>
                        {link.subtitle && (
                          <p className="text-[10px] text-charcoal/70 truncate mt-0.5">{link.subtitle}</p>
                        )}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-charcoal/70 shrink-0 ml-1 stroke-[2.2]" />
                  </div>
                ))
              )}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="w-28 h-1 bg-charcoal/25 rounded-full mx-auto mt-auto shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
