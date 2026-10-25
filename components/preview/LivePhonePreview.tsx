'use client';

import React, { useState, useEffect } from 'react';
import { Profile, VCardProfile, LinkBlock, NFCCardDesign } from '@/lib/types';
import { 
  Download, 
  Globe, 
  Briefcase, 
  Layers, 
  UserCheck, 
  Calendar, 
  Headphones,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Wifi,
  CreditCard
} from 'lucide-react';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';
import { downloadVCardFile } from '@/lib/vcard';
import { incrementLinkClick } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { THEMES, getFontFamilyClass, getPatternClass, resolveLinkCardClasses, isDarkTheme, getFontFamilyStyle } from '@/lib/themes';

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
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const activeLinks = links.filter((l) => l.isActive);

  // Active theme and styling tokens
  const currentTheme = THEMES[profile.theme] || THEMES['pastel-bento'];
  const fontFamilyClass = getFontFamilyClass(profile.fontFamily);
  const patternClass = profile.showHeaderBackground ? getPatternClass(profile.headerBackground) : '';

  const isCardBehindActive = profile.cardBehindContent ?? Boolean(profile.customHeaderImage);
  const cardStyle = profile.cardContainerStyle || 'glass';
  const isDark = isDarkTheme(profile.theme);

  let cardContainerClasses = '';
  let insideCardDark = isDark;

  if (cardStyle === 'solid_white') {
    cardContainerClasses = 'bg-white text-charcoal border border-black/10 shadow-sm rounded-3xl p-3.5 my-1';
    insideCardDark = false;
  } else if (cardStyle === 'solid_dark') {
    cardContainerClasses = 'bg-[#141518] text-white border border-white/10 shadow-md rounded-3xl p-3.5 my-1';
    insideCardDark = true;
  } else if (cardStyle === 'translucent') {
    cardContainerClasses = 'bg-black/60 text-white backdrop-blur-xl border border-white/20 shadow-md rounded-3xl p-3.5 my-1';
    insideCardDark = true;
  } else {
    // Frosted Glass
    cardContainerClasses = isDark
      ? 'bg-[#141A28]/85 text-white backdrop-blur-xl border border-white/20 shadow-md rounded-3xl p-3.5 my-1'
      : 'bg-white/85 text-charcoal backdrop-blur-xl border border-white/50 shadow-sm rounded-3xl p-3.5 my-1';
  }

  // Font sizing calculations
  const titleSizeClass = 
    profile.fontSize === 'sm' ? 'text-sm' :
    profile.fontSize === 'lg' ? 'text-lg' :
    profile.fontSize === 'xl' ? 'text-xl' : 'text-base';

  const bodySizeClass = 
    profile.fontSize === 'sm' ? 'text-[9px]' :
    profile.fontSize === 'lg' ? 'text-[11px]' :
    profile.fontSize === 'xl' ? 'text-xs' : 'text-[10px]';

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

  return (
    <div className="flex flex-col items-center">
      {/* Top Preview Controls Bar */}
      <div className="w-full max-w-[340px] flex items-center justify-between mb-3 px-1 text-xs">
        <div className="flex items-center gap-2 font-black text-charcoal">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="tracking-tight">Live Phone Preview</span>
        </div>
        <button
          onClick={simulateNFCTap}
          className="px-3 py-1 rounded-full bg-[#FDF166] text-[10px] font-black text-charcoal border border-black/10 hover:bg-[#FBE849] flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer"
          title="Simulate NFC Hardware Tap"
        >
          <CreditCard className="w-3 h-3 stroke-[2.4]" />
          <span>Simulate NFC Tap</span>
        </button>
      </div>

      {/* Realistic iPhone Mockup Frame */}
      <div className="w-[320px] sm:w-[340px] h-[670px] bg-[#141518] rounded-[48px] p-[10px] shadow-2xl border border-black/10 ring-1 ring-white/10 relative flex flex-col select-none">
        {/* Inner Phone Screen */}
        <div 
          className={`w-full h-full rounded-[38px] overflow-hidden flex flex-col relative transition-colors duration-200 ${currentTheme.canvasBg}`}
          style={{ backgroundColor: currentTheme.canvasBgHex || currentTheme.previewColors[0] || '#FAF7F2' }}
        >
          {/* Authentic Dynamic Island & Status Bar */}
          <div className={`w-full pt-3 px-6 pb-2 flex items-center justify-between backdrop-blur-xs z-20 shrink-0 ${isDarkTheme(profile.theme) ? 'bg-white/5 text-white' : 'bg-black/5 text-charcoal'}`}>
            <span className="text-[11px] font-black font-mono tracking-tight">9:41</span>
            
            {/* Dynamic Island */}
            <div className="w-24 h-6 bg-black rounded-full flex items-center justify-between px-2.5 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-950/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#052e16]/80" />
              </div>
            </div>

            {/* Signal & Battery */}
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 stroke-[2.5]" />
              <div className={`w-4 h-2 rounded-[2px] border p-[1px] flex items-center ${isDarkTheme(profile.theme) ? 'border-white' : 'border-charcoal'}`}>
                <div className={`w-full h-full rounded-[1px] ${isDarkTheme(profile.theme) ? 'bg-white' : 'bg-charcoal'}`} />
              </div>
            </div>
          </div>

          {/* NFC Tap Banner Notification */}
          {nfcTapped && (
            <div className="absolute top-12 left-3 right-3 z-30 bg-[#141518] text-white p-3 rounded-2xl shadow-float flex items-center gap-2.5 border border-white/20 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="w-8 h-8 rounded-xl bg-[#FDF166] flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 text-charcoal stroke-[2.5]" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-black text-white">NFC Card Tapped</p>
                <p className="text-[10px] text-white/70 truncate">Connected via Tapping Smart Hardware</p>
              </div>
            </div>
          )}

          {/* Full-Screen Bio Page Theme Pattern or Custom Uploaded Wallpaper */}
          {profile.showHeaderBackground && (profile.customHeaderImage || patternClass) && (
            <div 
              className={`absolute inset-0 z-0 pointer-events-none transition-all overflow-hidden ${
                profile.customHeaderImage ? '' : patternClass
              }`}
            >
              {profile.customHeaderImage && (
                <div
                  className="absolute inset-0 bg-no-repeat bg-center transition-all duration-75"
                  style={{
                    backgroundImage: `url(${profile.customHeaderImage})`,
                    backgroundSize: profile.bgImageFit === 'contain' ? 'contain' : profile.bgImageFit === 'auto' ? 'auto' : 'cover',
                    transform: `scale(${(profile.bgImageZoom ?? 100) / 100}) translate(${profile.bgImagePosX ?? 0}px, ${profile.bgImagePosY ?? 0}px)`,
                    transformOrigin: 'center center',
                    filter: (profile.bgImageBlur ?? 0) > 0 ? `blur(${profile.bgImageBlur}px)` : undefined,
                  }}
                />
              )}
              {profile.customHeaderImage && (
                <div 
                  className="absolute inset-0 transition-colors pointer-events-none"
                  style={{
                    backgroundColor: `rgba(0, 0, 0, ${(profile.bgImageDim ?? 40) / 100})`,
                  }}
                />
              )}
            </div>
          )}

          {/* Scrollable Phone Bio Page Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-1 pb-6 flex flex-col items-center relative z-10">
            <div className={`w-full flex flex-col items-center text-center transition-all ${isCardBehindActive ? cardContainerClasses : ''}`}>
              {/* Circular Avatar with Clean Border & Custom Zoom/Framing */}
              <div className="relative mt-2">
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-soft bg-white relative flex items-center justify-center">
                  <img
                    src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                    alt={profile.displayName}
                    className={`w-full h-full transition-transform ${profile.avatarFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                    style={{
                      transform: `scale(${(profile.avatarZoom ?? 100) / 100}) translate(${profile.avatarPosX ?? 0}px, ${profile.avatarPosY ?? 0}px)`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
              </div>

              {/* Display Name & Handle */}
              <h1 
                className={`${titleSizeClass} font-black mt-2.5 tracking-tight text-center ${fontFamilyClass}`}
                style={{ 
                  color: profile.fontColor || currentTheme.textHeadingHex || (insideCardDark ? '#FFFFFF' : '#141518'),
                  ...getFontFamilyStyle(profile.fontFamily)
                }}
              >
                {profile.displayName}
              </h1>

              <p 
                className={`text-[11px] font-bold opacity-75 mt-0.5 font-mono ${insideCardDark ? 'text-white/70' : 'text-charcoal/70'}`}
              >
                @{profile.username}
              </p>

            {/* Work & Organization Badge */}
            {(profile.badgeTitle || vcard.organization) && (
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${currentTheme.badgeBg} ${currentTheme.badgeBorder} ${currentTheme.badgeText} shadow-2xs mt-1.5 flex items-center gap-1`}>
                <span>{profile.badgeTitle || vcard.jobTitle}</span>
                {vcard.organization && <span>&bull; {vcard.organization}</span>}
              </span>
            )}

            {/* Address / Location */}
            {(vcard.city || vcard.country) && (
              <div className="flex items-center gap-1 mt-1 text-[9px] font-bold opacity-60">
                <MapPin className="w-2.5 h-2.5 text-rose-500" />
                <span>{[vcard.city, vcard.country].filter(Boolean).join(', ')}</span>
              </div>
            )}

            {profile.bio && (
              <p 
                className={`${bodySizeClass} opacity-80 text-center mt-2 max-w-[250px] leading-relaxed font-medium`}
                style={{ color: currentTheme.textBodyHex || (isDarkTheme(profile.theme) ? '#CBD5E1' : '#4A4B50') }}
              >
                {profile.bio}
              </p>
            )}

            {/* Save Contact Card CTA Button */}
            <button
              onClick={() => {
                downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
                showToast('Contact Saved', 'Downloaded contact card to phonebook', 'success');
              }}
              className="mt-3 w-full py-2 px-3 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-[11px] font-black flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Save Contact Card</span>
            </button>

            {/* Quick Contact Row (Call / Email) */}
            {(vcard.workPhone || vcard.workEmail || profile.socialLinks?.phone) && (
              <div className="grid grid-cols-2 gap-1.5 w-full mt-1.5">
                {(vcard.workPhone || profile.socialLinks?.phone) && (
                  <a
                    href={`tel:${(vcard.workPhone || profile.socialLinks?.phone || '').replace(/[^0-9+]/g, '')}`}
                    className="py-1.5 px-2 rounded-xl bg-white border border-black/10 text-[10px] font-bold text-charcoal flex items-center justify-center gap-1 shadow-2xs truncate"
                  >
                    <Phone className="w-2.5 h-2.5 text-[#34A853]" />
                    <span className="truncate">Call</span>
                  </a>
                )}
                {(vcard.workEmail || profile.socialLinks?.email) && (
                  <a
                    href={`mailto:${vcard.workEmail || profile.socialLinks?.email}`}
                    className="py-1.5 px-2 rounded-xl bg-white border border-black/10 text-[10px] font-bold text-charcoal flex items-center justify-center gap-1 shadow-2xs truncate"
                  >
                    <Mail className="w-2.5 h-2.5 text-[#4F83FF]" />
                    <span className="truncate">Email</span>
                  </a>
                )}
              </div>
            )}

            {/* Monoline Social Icons Strip */}
            <div className="w-full py-3 flex items-center justify-center gap-2">
              {profile.socialLinks?.instagram && (
                <a
                  href={profile.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-2xs"
                >
                  <InstagramIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socialLinks?.twitter && (
                <a
                  href={profile.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-2xs"
                >
                  <TwitterIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socialLinks?.linkedin && (
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-2xs"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socialLinks?.github && (
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-2xs"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socialLinks?.email && (
                <a
                  href={`mailto:${profile.socialLinks.email}`}
                  className="w-8 h-8 rounded-full bg-white hover:bg-black/5 border border-black/10 flex items-center justify-center text-charcoal transition-all shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5 stroke-[2.2]" />
                </a>
              )}
            </div>

            {/* Active Link Blocks Stack */}
            <div className="w-full flex flex-col gap-2 mt-1 pb-4">
              {activeLinks.length === 0 ? (
                <div className="bg-white rounded-2xl p-4 text-center border border-black/5">
                  <p className="text-xs text-charcoal/60 font-bold">No blocks active</p>
                </div>
              ) : (
                activeLinks.map((link) => {
                  const cardStyle = link.linkTheme || profile.linkCardStyle;
                  const cardClasses = resolveLinkCardClasses(
                    profile.theme,
                    link.styleVariant,
                    cardStyle
                  );
                  const hasCustomBg = !!link.bgImage || !!link.bgColor;
                  return (
                    <div
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className={`p-3 transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${cardClasses}`}
                      style={{
                        backgroundImage: link.bgImage ? `url(${link.bgImage})` : undefined,
                        backgroundSize: link.bgImage ? (link.bgImageFit === 'fill' ? '100% 100%' : (link.bgImageFit || 'cover')) : undefined,
                        backgroundRepeat: link.bgImage ? 'no-repeat' : undefined,
                        backgroundPosition: link.bgImage ? 'center' : undefined,
                        backgroundColor: link.bgColor || undefined,
                        color: link.textColor || (link.bgImage ? '#FFFFFF' : undefined),
                      }}
                    >
                      {link.bgImage && (
                        <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] pointer-events-none z-0" />
                      )}
                      <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                        <div className="w-8 h-8 rounded-xl bg-white/90 border border-black/5 flex items-center justify-center shrink-0 shadow-2xs text-charcoal">
                          {renderIcon(link.icon)}
                        </div>
                        <div className="text-left min-w-0">
                          <p 
                            className={`${bodySizeClass} font-black truncate leading-tight ${fontFamilyClass}`}
                            style={link.textColor ? { color: link.textColor } : (link.bgImage ? { color: '#FFFFFF' } : undefined)}
                          >
                            {link.title}
                          </p>
                          {link.subtitle && (
                            <p 
                              className="text-[10px] opacity-80 truncate mt-0.5 font-medium"
                              style={link.textColor ? { color: link.textColor } : (link.bgImage ? { color: '#FFFFFF' } : undefined)}
                            >
                              {link.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      <ArrowUpRight 
                        className="w-4 h-4 opacity-75 shrink-0 ml-1 stroke-[2.2] relative z-10" 
                        style={link.textColor ? { color: link.textColor } : (link.bgImage ? { color: '#FFFFFF' } : undefined)}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom Home Indicator Bar */}
            <div className="w-28 h-1 bg-charcoal/20 rounded-full mx-auto mt-auto shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}
