'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  getStoredProfile, 
  getStoredVCard, 
  getStoredLinks, 
  incrementLinkClick, 
  recordPageView, 
  recordVCardDownload, 
  recordQRScan, 
  getStoredStore 
} from '@/lib/storage';
import { 
  initialProfile, 
  initialVCard, 
  initialLinks, 
  initialStore 
} from '@/lib/mockData';
import { Profile, VCardProfile, LinkBlock, StoreConfig } from '@/lib/types';
import { 
  Download, 
  Share2, 
  QrCode, 
  Check, 
  Globe, 
  Briefcase, 
  Calendar, 
  Headphones, 
  UserCheck, 
  Mail, 
  Phone, 
  MapPin, 
  X, 
  ArrowUpRight 
} from 'lucide-react';
import { downloadVCardFile } from '@/lib/vcard';
import QRCode from 'qrcode';
import { useToast } from '@/components/ui/Toast';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';
import { 
  THEMES, 
  getFontFamilyClass, 
  getPatternClass, 
  resolveLinkCardClasses, 
  isDarkTheme, 
  isPatternDark,
  getFontFamilyStyle 
} from '@/lib/themes';
import PublicStore from '@/components/store/PublicStore';

export default function PublicProfilePage() {
  const params = useParams();
  const usernameParam = (params?.username as string) || 'aarav';
  const { showToast } = useToast();

  const [isHydrated, setIsHydrated] = useState(false);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [vcard, setVcard] = useState<VCardProfile>(initialVCard);
  const [links, setLinks] = useState<LinkBlock[]>(initialLinks);
  const [store, setStore] = useState<StoreConfig>(initialStore);

  const [showQRModal, setShowQRModal] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    recordPageView();
    const reloadPublishedData = () => {
      const storedProfile = getStoredProfile();
      setProfile({ ...storedProfile, username: usernameParam || storedProfile.username });
      setVcard(getStoredVCard());
      setLinks(getStoredLinks());
      setStore(getStoredStore());
      setIsHydrated(true);
    };
    reloadPublishedData();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') reloadPublishedData();
    };
    window.addEventListener('storage', reloadPublishedData);
    window.addEventListener('focus', reloadPublishedData);
    window.addEventListener('tapping-profile-updated', reloadPublishedData as EventListener);
    document.addEventListener('visibilitychange', handleVisibility);

    if (typeof window !== 'undefined') {
      QRCode.toDataURL(window.location.href, { width: 360, margin: 2 })
        .then(setQrUrl)
        .catch(console.error);
    }
    return () => {
      window.removeEventListener('storage', reloadPublishedData);
      window.removeEventListener('focus', reloadPublishedData);
      window.removeEventListener('tapping-profile-updated', reloadPublishedData as EventListener);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [usernameParam]);

  // Set page document title and dynamic favicon using compressed profile avatar
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (profile.displayName) {
        document.title = `${profile.displayName} (@${profile.username}) • TAPPING`;
      }
      if (profile.avatarUrl) {
        let favicon: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
        if (!favicon) {
          favicon = document.createElement('link');
          favicon.rel = 'icon';
          document.head.appendChild(favicon);
        }
        favicon.href = profile.avatarUrl;
      }
    }
  }, [profile.displayName, profile.username, profile.avatarUrl]);

  // Clean skeleton to prevent ANY millisecond flash of fake profile during load
  if (!isHydrated) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#FAF7F2]">
        <div className="w-full max-w-[540px] flex flex-col items-center gap-4 animate-pulse">
          <div className="w-24 h-24 rounded-full bg-black/10" />
          <div className="w-48 h-6 rounded-full bg-black/10 mt-2" />
          <div className="w-28 h-3.5 rounded-full bg-black/5" />
          <div className="w-64 h-4 rounded-full bg-black/5 mt-1" />
          <div className="w-full h-12 rounded-2xl bg-black/10 mt-4" />
          <div className="w-full flex gap-3">
            <div className="flex-1 h-10 rounded-2xl bg-black/5" />
            <div className="flex-1 h-10 rounded-2xl bg-black/5" />
          </div>
          <div className="w-full h-14 rounded-2xl bg-black/5 mt-3" />
          <div className="w-full h-14 rounded-2xl bg-black/5" />
        </div>
      </div>
    );
  }

  const activeLinks = links.filter((l) => l.isActive);

  // Active theme and styling tokens
  const currentTheme = THEMES[profile.theme] || THEMES['pastel-bento'];
  const dark = isDarkTheme(profile.theme);
  const fontFamilyClass = getFontFamilyClass(profile.fontFamily);
  const patternClass = profile.showHeaderBackground ? getPatternClass(profile.headerBackground) : '';

  // Dynamic font sizing
  const titleSizeClass = 
    profile.fontSize === 'sm' ? 'text-2xl sm:text-3xl' :
    profile.fontSize === 'lg' ? 'text-3xl sm:text-4xl' :
    profile.fontSize === 'xl' ? 'text-4xl sm:text-5xl' : 'text-2xl sm:text-3xl';

  const bodySizeClass = 
    profile.fontSize === 'sm' ? 'text-xs' :
    profile.fontSize === 'lg' ? 'text-sm sm:text-base' :
    profile.fontSize === 'xl' ? 'text-base sm:text-lg' : 'text-xs sm:text-sm';

  const handleLinkClick = (link: LinkBlock) => {
    incrementLinkClick(link.id);

    if (link.type === 'vcard_cta') {
      downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
      recordVCardDownload();
      showToast('Contact Saved', 'Contact card downloaded to phonebook', 'success');
    } else if (link.url && link.url !== '#') {
      window.open(link.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDownloadVCard = () => {
    recordVCardDownload();
    downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
    showToast('Contact Downloaded', 'Directly imported into your phone contacts', 'success');
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} - Digital Contact & Bio`,
          text: `Contact card for ${profile.displayName}:`,
          url,
        });
        showToast('Shared Profile', url, 'success');
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      showToast('Link Copied', url, 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  const phoneNumber = vcard.workPhone || vcard.mobilePhone || profile.socialLinks?.phone || '';
  const emailAddress = vcard.workEmail || profile.socialLinks?.email || '';
  const organizationName = vcard.organization || '';
  const jobTitleText = vcard.jobTitle || profile.badgeTitle || '';
  const fullAddress = [vcard.city, vcard.country].filter(Boolean).join(', ');
  const externalUrl = (value: string) => value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;
  const socialUrl = (value: string, host: string) => {
    if (value.startsWith('http://') || value.startsWith('https://')) return value;
    return `https://${host}/${value.replace(/^@/, '')}`;
  };

  const isCardBehindActive = Boolean(profile.cardBehindContent);
  const cardStyle = profile.cardContainerStyle || 'glass';

  let cardContainerClasses = '';
  let insideCardDark = dark;

  if (cardStyle === 'solid_white') {
    cardContainerClasses = 'bg-white text-charcoal border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.25)] rounded-[36px] sm:rounded-[40px] p-5 sm:p-7';
    insideCardDark = false;
  } else if (cardStyle === 'solid_dark') {
    cardContainerClasses = 'bg-[#141518] text-white border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] rounded-[36px] sm:rounded-[40px] p-5 sm:p-7';
    insideCardDark = true;
  } else if (cardStyle === 'translucent') {
    cardContainerClasses = 'bg-black/60 text-white backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] rounded-[36px] sm:rounded-[40px] p-5 sm:p-7';
    insideCardDark = true;
  } else {
    // Frosted Glass (default)
    cardContainerClasses = dark
      ? 'bg-[#141A28]/85 text-white backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.35)] rounded-[36px] sm:rounded-[40px] p-5 sm:p-7'
      : 'bg-white/85 text-charcoal backdrop-blur-2xl border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.25)] rounded-[36px] sm:rounded-[40px] p-5 sm:p-7';
  }

  const isDarkPatternActive = (profile.showHeaderBackground || profile.fullPageBackground) && isPatternDark(profile.headerBackground);
  const isDarkCanvas = isDarkTheme(currentTheme.id) || isDarkPatternActive;
  const hasDarkWallpaper = Boolean(profile.customHeaderImage) && (profile.bgImageDim ?? 30) >= 35;
  const contentIsDark = isCardBehindActive ? insideCardDark : (isDarkCanvas || hasDarkWallpaper);

  return (
    <div className="min-h-screen sm:h-screen w-full bg-[#E5E5E7] dark:bg-[#0D0F12] flex items-center justify-center p-0 sm:py-6 sm:px-4 relative overflow-hidden selection:bg-[#FDF166] selection:text-charcoal transition-colors">
      
      {/* DESKTOP-ONLY FLOATING QR BADGE: Selena Gomez Linktree Reference (Bottom-Right) */}
      <div 
        onClick={() => {
          recordQRScan();
          setShowQRModal(true);
        }}
        className="fixed bottom-6 right-6 hidden md:flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/90 dark:bg-[#1C2028]/90 backdrop-blur-md border border-black/10 dark:border-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.18)] z-40 select-none cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="View on mobile"
      >
        <span className="text-[10px] font-black tracking-wide text-charcoal/70 dark:text-white/70">
          View on mobile
        </span>
        {qrUrl ? (
          <img src={qrUrl} alt="View on mobile QR" className="w-20 h-20 rounded-xl border border-black/5" />
        ) : (
          <div className="w-20 h-20 bg-black/5 rounded-xl flex items-center justify-center">
            <QrCode className="w-8 h-8 opacity-40 text-charcoal" />
          </div>
        )}
      </div>

      {/* CENTERED MOBILE VIEW CANVAS (MAX-W-[430PX] WITH AUTHENTIC MOBILE PHONE RATIO & FIXED VIEWPORT) */}
      <div 
        className={`w-full max-w-[430px] h-screen h-[100dvh] sm:h-[92vh] sm:max-h-[900px] sm:rounded-[44px] shadow-[0_25px_80px_rgba(0,0,0,0.25)] relative overflow-hidden flex flex-col transition-all border border-black/10 dark:border-white/10 ${currentTheme.canvasBg}`}
        style={{
          backgroundColor: profile.customBgColor || currentTheme.canvasBgHex || currentTheme.previewColors[0] || '#FAF7F2',
          backgroundImage: profile.pageBgImage ? `url(${profile.pageBgImage})` : undefined,
          backgroundSize: profile.pageBgImage ? 'cover' : undefined,
          backgroundPosition: 'center',
          ...getFontFamilyStyle(profile.fontFamily)
        }}
      >
        {/* Full Bio Canvas Theme Pattern or Custom Uploaded Wallpaper (FIXED IN PLACE — NEVER STRETCHES) */}
        {(Boolean(profile.customHeaderImage) || (profile.showHeaderBackground && patternClass)) && (
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {profile.customHeaderImage ? (
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
            ) : (
              <div className={`absolute inset-0 ${patternClass}`} />
            )}
            {profile.customHeaderImage && (
              <div 
                className="absolute inset-0 transition-colors pointer-events-none"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${(profile.bgImageDim ?? 30) / 100})`,
                }}
              />
            )}
          </div>
        )}

        {/* SCROLLABLE DATA CONTAINER: Everything scrolls naturally and smoothly together */}
        <div className="flex-1 w-full overflow-y-auto overscroll-contain no-scrollbar relative z-10 flex flex-col items-center">
          
          {/* TOP ACTION BAR: Scrolls seamlessly with content — never cuts off avatar */}
          <div className="w-full flex items-center justify-between pt-5 pb-2 px-5 relative z-20 shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              contentIsDark ? 'bg-black/40 text-white border border-white/20' : 'bg-white/80 text-charcoal border border-black/10'
            } backdrop-blur-md shadow-2xs`}>
              <Globe className="w-4 h-4 opacity-70" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  recordQRScan();
                  setShowQRModal(true);
                }}
                className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer backdrop-blur-md ${
                  contentIsDark 
                    ? 'bg-black/45 hover:bg-black/60 text-white border-white/20' 
                    : 'bg-white/85 hover:bg-white text-charcoal border-black/10'
                }`}
                title="Scan or View QR Code"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>QR</span>
              </button>
              <button
                onClick={handleShare}
                className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer backdrop-blur-md ${
                  contentIsDark 
                    ? 'bg-black/45 hover:bg-black/60 text-white border-white/20' 
                    : 'bg-white/85 hover:bg-white text-charcoal border-black/10'
                }`}
                title="Share Contact Profile"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          <main className={`w-full flex flex-col items-center text-center px-4 sm:px-6 pt-2 pb-6 transition-all ${
            isCardBehindActive ? cardContainerClasses : ''
          }`}>
        
        {/* Avatar with Crisp Thin Ring & Shadow (Modern Rounded Square / Squircle) */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[28px] sm:rounded-[32px] overflow-hidden ring-1.5 ring-white/80 border border-black/10 shadow-sm bg-white relative flex items-center justify-center shrink-0 mt-1">
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

        {/* User Display Name */}
        <h1 
          className={`${titleSizeClass} font-black tracking-tight mt-3 leading-tight`}
          style={{ 
            color: profile.fontColor || (contentIsDark ? '#FFFFFF' : (currentTheme.textHeadingHex || '#141518')),
            textShadow: contentIsDark ? '0 2px 10px rgba(0,0,0,0.75)' : undefined,
            ...getFontFamilyStyle(profile.fontFamily)
          }}
        >
          {profile.displayName}
        </h1>

        {/* Handle / Username */}
        <p 
          className="text-xs font-bold font-mono mt-0.5"
          style={{
            color: profile.fontColor ? profile.fontColor : (contentIsDark ? 'rgba(255,255,255,0.85)' : 'rgba(20,21,24,0.65)'),
            textShadow: contentIsDark ? '0 1px 6px rgba(0,0,0,0.6)' : undefined,
          }}
        >
          @{profile.username}
        </p>

        {/* Professional Work / Title / Company Badge (Frosted Blurry Glass) */}
        {(jobTitleText || organizationName) && (
          <div className="mt-2.5 flex items-center justify-center">
            <span 
              className={`text-xs font-black px-4 py-1.5 rounded-full ${
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
                className="w-3.5 h-3.5 shrink-0" 
                style={{ color: profile.fontColor || (contentIsDark ? '#FFFFFF' : '#4F83FF') }} 
              />
              <span style={profile.fontColor ? { color: profile.fontColor } : undefined}>{jobTitleText}</span>
              {organizationName && (
                <>
                  <span className="opacity-40" style={profile.fontColor ? { color: profile.fontColor } : undefined}>&bull;</span>
                  <span style={profile.fontColor ? { color: profile.fontColor } : undefined}>{organizationName}</span>
                </>
              )}
            </span>
          </div>
        )}

        {/* Location / Address (Frosted Blurry Glass Pill) */}
        {fullAddress && (
          <div className="mt-2 flex items-center justify-center">
            <div 
              className={`px-4 py-1.5 rounded-full backdrop-blur-xl shadow-sm flex items-center justify-center gap-1.5 text-xs font-semibold border ${
                contentIsDark 
                  ? 'bg-black/50 text-white/95 border-white/20' 
                  : 'bg-white/85 text-charcoal/85 border-white/60'
              }`}
              style={profile.fontColor ? { color: profile.fontColor } : undefined}
            >
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{fullAddress}</span>
            </div>
          </div>
        )}

        {/* Bio Description (Frosted Blurry Glass Capsule) */}
        {profile.bio && (
          <div 
            className={`mt-3 max-w-sm px-4 py-2.5 rounded-2xl backdrop-blur-xl border shadow-sm text-center leading-relaxed font-medium ${bodySizeClass} ${
              contentIsDark 
                ? 'bg-black/45 text-white/95 border-white/20' 
                : 'bg-white/85 text-charcoal/90 border-white/70'
            }`}
            style={profile.fontColor ? { color: profile.fontColor } : undefined}
          >
            {profile.bio}
          </div>
        )}

        {/* PRIMARY CONTACT ACTION: SAVE DIRECT CONTACT CARD (.VCF) TO PHONE */}
        <div className="w-full flex flex-col gap-2.5 my-4">
          <button
            onClick={handleDownloadVCard}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-98 cursor-pointer"
            title="Download contact card directly into iPhone / Android phonebook"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Save Contact to Phone (.vcf)</span>
          </button>

          {/* Quick Contact Action Pills: Call / Email / Website */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {phoneNumber && (
              <a
                href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs transition-colors backdrop-blur-md ${
                  contentIsDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    : 'bg-white/90 hover:bg-white text-charcoal border border-black/10'
                }`}
                title={`Call ${phoneNumber}`}
              >
                <Phone className="w-3.5 h-3.5 text-[#34A853]" />
                <span className="truncate">Call</span>
              </a>
            )}

            {emailAddress && (
              <a
                href={`mailto:${emailAddress}`}
                className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs transition-colors backdrop-blur-md ${
                  contentIsDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    : 'bg-white/90 hover:bg-white text-charcoal border border-black/10'
                }`}
                title={`Email ${emailAddress}`}
              >
                <Mail className="w-3.5 h-3.5 text-[#4F83FF]" />
                <span className="truncate">Email</span>
              </a>
            )}

            {vcard.website && (
              <a
                href={externalUrl(vcard.website)}
                target="_blank"
                rel="noreferrer"
                className={`col-span-2 sm:col-span-1 py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs transition-colors backdrop-blur-md ${
                  contentIsDark 
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    : 'bg-white/90 hover:bg-white text-charcoal border border-black/10'
                }`}
                title="Open Website"
              >
                <Globe className="w-3.5 h-3.5 text-purple-500" />
                <span className="truncate">Website</span>
              </a>
            )}
          </div>
        </div>

        {/* SOCIAL MEDIA HANDLES */}
        <div className="flex items-center justify-center gap-2 py-1 mb-3 flex-wrap">
          {profile.socialLinks?.instagram && (
            <a
              href={socialUrl(profile.socialLinks.instagram, 'instagram.com')}
              target="_blank"
              rel="noreferrer"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 backdrop-blur-md ${
                contentIsDark 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  : 'bg-white/90 hover:bg-white text-charcoal border border-black/10'
              }`}
              title="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks?.twitter && (
            <a
              href={socialUrl(profile.socialLinks.twitter, 'x.com')}
              target="_blank"
              rel="noreferrer"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 backdrop-blur-md ${
                contentIsDark 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  : 'bg-white/90 hover:bg-white text-charcoal border border-black/10'
              }`}
              title="X / Twitter"
            >
              <TwitterIcon className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks?.github && (
            <a
              href={socialUrl(profile.socialLinks.github, 'github.com')}
              target="_blank"
              rel="noreferrer"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 backdrop-blur-md ${
                contentIsDark 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  : 'bg-white/90 hover:bg-white text-charcoal border border-black/10'
              }`}
              title="GitHub"
            >
              <GithubIcon className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks?.linkedin && (
            <a
              href={socialUrl(profile.socialLinks.linkedin, 'linkedin.com/in')}
              target="_blank"
              rel="noreferrer"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 backdrop-blur-md ${
                contentIsDark 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  : 'bg-white/90 hover:bg-white text-charcoal border border-black/10'
              }`}
              title="LinkedIn"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
          )}
          {profile.socialLinks?.email && (
            <a
              href={`mailto:${profile.socialLinks.email}`}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 backdrop-blur-md ${
                contentIsDark 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  : 'bg-white/90 hover:bg-white text-charcoal border border-black/10'
              }`}
              title="Direct Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* ACTIVE LINK & PRODUCT SLIDER BLOCKS STACK */}
        <div className="w-full flex flex-col gap-3 text-left">
          {activeLinks.length === 0 ? (
            <div className={`p-5 rounded-3xl text-center text-xs font-bold ${contentIsDark ? 'bg-white/5 text-white/50 border border-white/10' : 'bg-white/60 text-charcoal/50 border border-black/5'}`}>
              No active blocks published yet.
            </div>
          ) : (
            activeLinks.map((link) => {
              if (link.type === 'product_slider') {
                return (
                  <div key={link.id} className="w-full my-1">
                    <PublicStore 
                      store={store} 
                      sellerName={profile.displayName} 
                      dark={contentIsDark} 
                      productIds={link.productIds}
                      title={link.title}
                    />
                  </div>
                );
              }

              const cardStyle = link.linkTheme || profile.linkCardStyle;
              const rawCardClasses = resolveLinkCardClasses(
                profile.theme,
                link.styleVariant,
                cardStyle
              );
              // Clean anti-slop: Ensure link buttons are sleek modern rounded rectangles (never bulky distorted pills)
              const cardClasses = rawCardClasses.replace(/rounded-full/g, 'rounded-2xl').replace(/rounded-none/g, 'rounded-2xl');
              const effectiveTextColor = link.textColor || (link.bgImage ? '#FFFFFF' : profile.fontColor || '#141518');

              return (
                <div
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className={`min-h-[58px] p-3.5 sm:p-4 rounded-2xl border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between relative overflow-hidden group ${cardClasses}`}
                  style={{
                    backgroundImage: link.bgImage ? `url(${link.bgImage})` : undefined,
                    backgroundSize: link.bgImage ? (link.bgImageFit === 'fill' ? '100% 100%' : (link.bgImageFit || 'cover')) : undefined,
                    backgroundRepeat: link.bgImage ? 'no-repeat' : undefined,
                    backgroundPosition: link.bgImage ? 'center' : undefined,
                    backgroundColor: link.bgColor || (link.bgImage ? undefined : (cardClasses.includes('bg-') ? undefined : '#FFFFFF')),
                    color: effectiveTextColor,
                  }}
                >
                  {link.bgImage && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] pointer-events-none z-0" />
                  )}
                  <div className="flex items-center gap-3 min-w-0 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-black/5 border border-black/5 flex items-center justify-center shrink-0 shadow-2xs text-charcoal group-hover:scale-105 transition-transform">
                      {renderIcon(link.icon)}
                    </div>
                    <div className="min-w-0 text-left">
                      <p 
                        className={`${bodySizeClass} font-black truncate leading-tight`}
                        style={{ color: effectiveTextColor }}
                      >
                        {link.title}
                      </p>
                      {link.subtitle && (
                        <p 
                          className="text-[11px] opacity-70 truncate mt-0.5 font-medium"
                          style={{ color: effectiveTextColor }}
                        >
                          {link.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight 
                    className="w-4 h-4 opacity-50 group-hover:opacity-90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 ml-2 relative z-10 stroke-[2.2]" 
                    style={{ color: effectiveTextColor }}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* CREATOR PRODUCTS FALLBACK: Only shown if NO product_slider block was explicitly positioned in link blocks */}
        {!activeLinks.some((l) => l.type === 'product_slider') && store.enabled && store.products.some((product) => product.isActive) && (
          <div className="w-full mt-8 pt-6 border-t border-black/10 flex flex-col gap-4 text-left">
            <PublicStore store={store} sellerName={profile.displayName} dark={contentIsDark} />
          </div>
        )}
      </main>

      {/* Powered by Tapping Branding Footer */}
      <footer className="w-full py-5 text-center mt-auto shrink-0">
        <span className={`text-[11px] font-bold tracking-wider ${contentIsDark ? 'text-white/50' : 'text-charcoal/40'}`}>
          Powered by TAPPING &bull; Digital Cards &amp; Bio Space
        </span>
      </footer>
    </div>
  </div>

      {/* DYNAMIC QR CODE DISPLAY MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-sm w-full border border-black/10 shadow-float text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-black/5">
              <span className="text-xs font-black text-charcoal">Permanent Dynamic QR</span>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-charcoal cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-3xl border border-black/10 shadow-soft inline-block mb-4">
              {qrUrl ? (
                <img src={qrUrl} alt="Dynamic QR Code" className="w-48 h-48 mx-auto" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-gray-50 text-xs text-charcoal/40">
                  Generating QR...
                </div>
              )}
            </div>

            <p className="text-xs font-black text-charcoal">
              Scan to view {profile.displayName}&apos;s TAPPING Profile
            </p>
            <p className="text-[11px] text-charcoal/60 mt-1 font-mono">
              tapping.bio/{profile.username}
            </p>

            <button
              onClick={() => setShowQRModal(false)}
              className="mt-6 w-full py-3 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
