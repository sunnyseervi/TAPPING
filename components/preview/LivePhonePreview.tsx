'use client';

import React, { useState, useEffect } from 'react';
import { Profile, VCardProfile, LinkBlock, NFCCardDesign, StoreConfig } from '@/lib/types';
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
  CreditCard,
  ShoppingBag
} from 'lucide-react';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';
import { downloadVCardFile } from '@/lib/vcard';
import { incrementLinkClick } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import { THEMES, getFontFamilyClass, getPatternClass, resolveLinkCardClasses, isDarkTheme, isPatternDark, isColorDark, getFontFamilyStyle } from '@/lib/themes';
import IndianFlag from '@/components/ui/IndianFlag';

interface LivePreviewProps {
  profile: Profile;
  vcard: VCardProfile;
  links: LinkBlock[];
  nfcCard?: NFCCardDesign;
  store?: StoreConfig;
  onLinkClick?: (linkId: string) => void;
}

export default function LivePhonePreview({
  profile,
  vcard,
  links,
  nfcCard,
  store,
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

  const isCardBehindActive = Boolean(profile.cardBehindContent);
  const cardStyle = profile.cardContainerStyle || 'glass';
  const isDark = profile.customBgColor ? isColorDark(profile.customBgColor) : isDarkTheme(profile.theme);

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

  const isDarkPatternActive = (profile.showHeaderBackground || profile.fullPageBackground) && isPatternDark(profile.headerBackground);
  const isDarkCanvas = isDark || isDarkPatternActive;
  const hasDarkWallpaper = Boolean(profile.customHeaderImage) && (profile.bgImageDim ?? 30) >= 35;
  const contentIsDark = isCardBehindActive ? insideCardDark : (isDarkCanvas || hasDarkWallpaper);

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
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F83FF] animate-pulse" />
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
          style={{ 
            backgroundColor: profile.customBgColor || currentTheme.canvasBgHex || currentTheme.previewColors[0] || '#FAF7F2',
            backgroundImage: profile.pageBgImage ? `url(${profile.pageBgImage})` : undefined,
            backgroundSize: profile.pageBgImage ? 'cover' : undefined,
            backgroundPosition: 'center',
            ...getFontFamilyStyle(profile.fontFamily)
          }}
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
          {(Boolean(profile.customHeaderImage) || (profile.showHeaderBackground && patternClass)) && (
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
              {/* Squircle Avatar with Clean Thin Border & Custom Zoom/Framing (Rounded Square) */}
              <div className="relative mt-2">
                <div className="w-20 h-20 rounded-[24px] overflow-hidden ring-1.5 ring-white/80 border border-black/10 shadow-sm bg-white relative flex items-center justify-center">
                  <img
                    src={profile.avatarUrl || 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&auto=format&fit=crop&q=80'}
                    alt={profile.displayName}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&auto=format&fit=crop&q=80';
                    }}
                    className={`w-full h-full transition-transform ${profile.avatarFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                    style={{
                      transform: `scale(${(profile.avatarZoom ?? 100) / 100}) translate(${profile.avatarPosX ?? 0}px, ${profile.avatarPosY ?? 0}px)`,
                      transformOrigin: 'center center',
                    }}
                  />
                </div>
                {/* Official Indian Flag Badge on bottom-right corner of Avatar */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-black/10 shadow-sm flex items-center justify-center overflow-hidden">
                  <IndianFlag className="w-4 h-2.8 rounded-xs" />
                </div>
              </div>

              {/* Display Name & Handle */}
              <h1 
                className={`${titleSizeClass} font-black mt-2.5 tracking-tight text-center ${fontFamilyClass}`}
                style={{ 
                  color: profile.fontColor || (contentIsDark ? '#FFFFFF' : (currentTheme.textHeadingHex || '#141518')),
                  textShadow: contentIsDark ? '0 2px 10px rgba(0,0,0,0.75)' : undefined,
                  ...getFontFamilyStyle(profile.fontFamily)
                }}
              >
                {profile.displayName}
              </h1>

              <p 
                className="text-[11px] font-bold mt-0.5 font-mono"
                style={{
                  color: profile.fontColor ? profile.fontColor : (contentIsDark ? 'rgba(255,255,255,0.85)' : 'rgba(20,21,24,0.65)'),
                  textShadow: contentIsDark ? '0 1px 6px rgba(0,0,0,0.6)' : undefined,
                  opacity: profile.fontColor ? 0.8 : undefined,
                }}
              >
                @{profile.username}
              </p>

            {/* Work & Organization Badge (Frosted Blurry Glass) */}
            {(profile.badgeTitle || vcard.jobTitle || vcard.organization) && (
              <div className="mt-1.5 flex items-center justify-center">
                <span 
                  className={`text-[10px] font-black px-3.5 py-1 rounded-full ${
                    contentIsDark 
                      ? 'bg-black/50 border border-white/25 shadow-sm' 
                      : 'bg-white/85 border border-white/60 shadow-sm'
                  } backdrop-blur-xl shadow-2xs flex items-center gap-1.5`}
                  style={{
                    color: profile.fontColor || (contentIsDark ? '#FFFFFF' : '#141518'),
                    borderColor: profile.fontColor ? `${profile.fontColor}40` : undefined,
                  }}
                >
                  <Briefcase 
                    className="w-3 h-3 shrink-0" 
                    style={{ color: profile.fontColor || (contentIsDark ? '#FFFFFF' : '#4F83FF') }} 
                  />
                  <span style={profile.fontColor ? { color: profile.fontColor } : undefined}>
                    {profile.badgeTitle || vcard.jobTitle}
                  </span>
                  {vcard.organization && (
                    <span style={profile.fontColor ? { color: profile.fontColor } : undefined}>
                      &bull; {vcard.organization}
                    </span>
                  )}
                </span>
              </div>
            )}

            {/* Address / Location (Frosted Blurry Glass Pill) */}
            {(vcard.streetAddress || vcard.city || vcard.country) && (
              <div className="mt-1 flex items-center justify-center">
                <div 
                  className={`px-3.5 py-1 rounded-full backdrop-blur-xl shadow-sm flex items-center gap-1 text-[9px] font-semibold border ${
                    contentIsDark 
                      ? 'bg-black/50 text-white/95 border-white/20' 
                      : 'bg-white/85 text-charcoal/85 border-white/60'
                  }`}
                  style={profile.fontColor ? { color: profile.fontColor } : undefined}
                >
                  <MapPin className="w-2.5 h-2.5 text-rose-500" />
                  <span>{[vcard.streetAddress, vcard.city, vcard.country].filter(Boolean).join(', ')}</span>
                </div>
              </div>
            )}

            {/* Bio Description (Frosted Blurry Glass Capsule) */}
            {profile.bio && (
              <div 
                className={`mt-2 max-w-[270px] px-3.5 py-1.5 rounded-xl backdrop-blur-xl border shadow-sm text-center leading-relaxed font-medium ${bodySizeClass} ${
                  contentIsDark 
                    ? 'bg-black/45 text-white/95 border-white/20' 
                    : 'bg-white/85 text-charcoal/90 border-white/70'
                }`}
                style={profile.fontColor ? { color: profile.fontColor } : undefined}
              >
                {profile.bio}
              </div>
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

            {/* Active Link & Product Slider Blocks Stack */}
            <div className="w-full flex flex-col gap-2 mt-1 pb-2">
              {activeLinks.length === 0 ? (
                <div className="bg-white rounded-2xl p-4 text-center border border-black/5">
                  <p className="text-xs text-charcoal/60 font-bold">No blocks active</p>
                </div>
              ) : (
                activeLinks.map((link) => {
                  if (link.type === 'product_slider') {
                    const sliderProducts = (store?.products || [])
                      .filter((p) => p.isActive && (!link.productIds || link.productIds.length === 0 || link.productIds.includes(p.id)))
                      .sort((a, b) => a.sortOrder - b.sortOrder);
                    
                    if (sliderProducts.length === 0) return null;

                    return (
                      <div key={link.id} className="w-full my-1.5 flex flex-col gap-1.5 text-left">
                        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-black/10 bg-white/95 text-charcoal shadow-2xs backdrop-blur-md">
                          <span className="text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 text-charcoal">
                            <ShoppingBag className="w-2.5 h-2.5 opacity-70" />
                            <span>{link.title || 'Featured Products'}</span>
                          </span>
                          <span className="text-[8px] font-bold text-charcoal/60">
                            {sliderProducts.length} items &bull; Slidable
                          </span>
                        </div>

                        <div 
                          className="flex overflow-x-auto snap-x snap-mandatory gap-2 pb-1 px-0.5 no-scrollbar scroll-smooth"
                          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                        >
                          {sliderProducts.map((product) => (
                            <div
                              key={product.id}
                              className="w-[140px] shrink-0 snap-start rounded-2xl border border-black/10 p-2 flex flex-col justify-between shadow-sm bg-white text-charcoal"
                            >
                              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/5 mb-1.5">
                                {product.imageUrl ? (
                                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-[#E3DFF8] flex items-center justify-center text-[8px] font-bold text-charcoal/40">Item</div>
                                )}
                                <span className="absolute left-1 top-1 rounded-full bg-[#141518] px-1.5 py-0.5 text-[8px] font-black text-white shadow-2xs">
                                  ₹{product.price}
                                </span>
                              </div>
                              <p className="text-[10px] font-black truncate leading-tight text-charcoal">{product.name}</p>
                              <div className="mt-1.5 flex items-center justify-between pt-1 border-t border-black/5">
                                <span className="text-[9px] font-black text-charcoal">₹{product.price}</span>
                                <span className="text-[8px] font-black px-2 py-0.5 rounded-md bg-[#141518] text-white shadow-2xs">Bag</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  const cardStyle = link.linkTheme || profile.linkCardStyle;
                  let cardClasses = resolveLinkCardClasses(
                    profile.theme,
                    link.styleVariant,
                    cardStyle
                  ).replace(/rounded-full/g, 'rounded-2xl').replace(/rounded-none/g, 'rounded-2xl');

                  if (link.bgColor) {
                    cardClasses = cardClasses
                      .replace(/\bbg-\[[^\]]+\]/g, '')
                      .replace(/\bbg-[a-z0-9\/-]+/g, '')
                      .replace(/\bpattern-[a-z0-9-]+/g, '');
                  }
                  const effectiveTextColor = link.textColor || (link.bgImage ? '#FFFFFF' : (link.bgColor ? (isColorDark(link.bgColor) ? '#FFFFFF' : '#141518') : profile.fontColor || undefined));
                  return (
                    <div
                      key={link.id}
                      onClick={() => handleLinkClick(link)}
                      className={`min-h-[50px] p-2.5 rounded-2xl border border-black/10 text-charcoal shadow-2xs hover:opacity-95 transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${link.bgColor ? '' : 'bg-white/95 hover:bg-white'} ${cardClasses}`}
                      style={{
                        backgroundImage: link.bgImage ? `url(${link.bgImage})` : undefined,
                        backgroundSize: link.bgImage ? (link.bgImageFit === 'fill' ? '100% 100%' : (link.bgImageFit || 'cover')) : undefined,
                        backgroundRepeat: link.bgImage ? 'no-repeat' : undefined,
                        backgroundPosition: link.bgImage ? 'center' : undefined,
                        backgroundColor: link.bgColor || undefined,
                        color: effectiveTextColor,
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
                            style={effectiveTextColor ? { color: effectiveTextColor } : undefined}
                          >
                            {link.title}
                          </p>
                          {link.subtitle && (
                            <p 
                              className="text-[10px] opacity-80 truncate mt-0.5 font-medium"
                              style={effectiveTextColor ? { color: effectiveTextColor } : undefined}
                            >
                              {link.subtitle}
                            </p>
                          )}
                        </div>
                      </div>
                      <ArrowUpRight 
                        className="w-4 h-4 opacity-75 shrink-0 ml-1 stroke-[2.2] relative z-10" 
                        style={effectiveTextColor ? { color: effectiveTextColor } : undefined}
                      />
                    </div>
                  );
                })
              )}
            </div>

            {/* Creator Products & Store Fallback (Slidable Carousel) — only if not placed in link blocks */}
            {!activeLinks.some((l) => l.type === 'product_slider') && store?.enabled && store.products.some((p) => p.isActive) && (
              <div className="w-full mt-2 pt-3 border-t border-black/10 flex flex-col gap-2 text-left">
                <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-black/10 bg-white/95 text-charcoal shadow-2xs backdrop-blur-md">
                  <span className="text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 text-charcoal">
                    <ShoppingBag className="w-2.5 h-2.5 opacity-70" />
                    <span>Featured Products</span>
                  </span>
                  <span className="text-[8px] font-bold text-charcoal/60">
                    {store.products.filter(p => p.isActive).length} items &bull; Slidable
                  </span>
                </div>

                <div 
                  className="flex overflow-x-auto snap-x snap-mandatory gap-2.5 pb-2 px-0.5 no-scrollbar scroll-smooth"
                  style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                >
                  {store.products.filter(p => p.isActive).map((product) => (
                    <div
                      key={product.id}
                      className="w-[140px] shrink-0 snap-start rounded-2xl border border-black/10 p-2 flex flex-col justify-between shadow-sm bg-white text-charcoal"
                    >
                      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/5 mb-1.5">
                        {product.imageUrl ? (
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#E3DFF8] flex items-center justify-center text-[9px] font-bold text-charcoal/40">Item</div>
                        )}
                        <span className="absolute left-1 top-1 rounded-full bg-[#141518] px-1.5 py-0.5 text-[8px] font-black text-white shadow-2xs">
                          ₹{product.price}
                        </span>
                      </div>
                      <p className="text-[10px] font-black truncate leading-tight text-charcoal">{product.name}</p>
                      <div className="mt-1.5 flex items-center justify-between pt-1 border-t border-black/5">
                        <span className="text-[9px] font-black text-charcoal">₹{product.price}</span>
                        <span className="text-[8px] font-black px-2 py-0.5 rounded-md bg-[#141518] text-white shadow-2xs">Bag</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Link-in-Bio Minimal Footer */}
            <div className="w-full pt-4 pb-2 flex flex-col items-center justify-center gap-1 mt-auto shrink-0 text-center">
              <span className={`text-[8px] font-bold tracking-wider ${contentIsDark ? 'text-white/50' : 'text-charcoal/50'}`}>
                Powered by TAPPING &bull; Bio Space
              </span>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-[8px] font-medium underline underline-offset-2 transition-opacity hover:opacity-100 cursor-pointer ${
                  contentIsDark ? 'text-white/70 hover:text-white' : 'text-charcoal/70 hover:text-black'
                }`}
                style={{
                  ...getFontFamilyStyle(profile.fontFamily),
                }}
              >
                Create your personalized link in bio
              </a>
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
