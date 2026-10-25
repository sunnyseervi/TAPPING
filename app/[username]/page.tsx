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

  const isCardBehindActive = profile.cardBehindContent ?? Boolean(profile.customHeaderImage);
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

  return (
    <div 
      className={`min-h-screen ${currentTheme.canvasBg} text-charcoal flex flex-col items-center justify-start p-0 sm:py-8 sm:px-4 selection:bg-[#FDF166] selection:text-charcoal transition-colors duration-200 relative overflow-x-hidden`}
      style={{ 
        backgroundColor: profile.customBgColor || currentTheme.canvasBgHex || currentTheme.previewColors[0] || '#FAF7F2', 
        backgroundImage: profile.pageBgImage ? `url(${profile.pageBgImage})` : undefined, 
        backgroundSize: profile.pageBgImage ? 'cover' : undefined, 
        backgroundPosition: 'center',
        ...getFontFamilyStyle(profile.fontFamily)
      }}
    >
      {/* Full-Screen Bio Page Theme Pattern or Custom Uploaded Wallpaper */}
      {profile.showHeaderBackground && (profile.customHeaderImage || patternClass) && (
        <div 
          className={`fixed inset-0 z-0 pointer-events-none transition-all overflow-hidden ${
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

      {/* MOBILE-ONLY CONSTRAINED CONTAINER (MAX-W-[430PX] — DESKTOP RETAINS SIDES FOR WALLPAPER) */}
      <div className="w-full max-w-[430px] mx-auto min-h-screen sm:min-h-auto relative z-10 flex flex-col items-center px-3 sm:px-0">

        {/* TOP ACTION BAR: Refined Share & QR Actions (At Top of Mobile View) */}
        <div className="w-full flex items-center justify-end py-2 mb-1 px-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                recordQRScan();
                setShowQRModal(true);
              }}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer backdrop-blur-md ${
                dark 
                  ? 'bg-[#141A28]/85 hover:bg-[#1C2538] text-white border-white/20' 
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
                dark 
                  ? 'bg-[#141A28]/85 hover:bg-[#1C2538] text-white border-white/20' 
                  : 'bg-white/85 hover:bg-white text-charcoal border-black/10'
              }`}
              title="Share Contact Profile"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* MAIN BIO PROFILE STACK (WRAPPED IN CARD CONTAINER WHEN ACTIVE) */}
        <main className={`w-full transition-all flex flex-col items-center text-center ${
          isCardBehindActive ? cardContainerClasses : 'px-1 pt-1 pb-10'
        }`}>
        
        {/* Avatar with Crisp White Ring & Shadow */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-white shadow-soft bg-white relative flex items-center justify-center shrink-0">
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
            color: profile.fontColor || (insideCardDark ? '#FFFFFF' : (currentTheme.textHeadingHex || '#141518')),
            ...getFontFamilyStyle(profile.fontFamily)
          }}
        >
          {profile.displayName}
        </h1>

        {/* Handle / Username */}
        <p className={`text-xs font-bold font-mono mt-0.5 ${insideCardDark ? 'text-white/60' : 'text-charcoal/60'}`}>
          @{profile.username}
        </p>

        {/* Professional Work / Title / Company Badge */}
        {(jobTitleText || organizationName) && (
          <div className="mt-2 flex items-center justify-center">
            <span className={`text-xs font-black px-3.5 py-1 rounded-full ${currentTheme.badgeBg} ${currentTheme.badgeBorder} ${currentTheme.badgeText} shadow-2xs flex items-center gap-1.5`}>
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>{jobTitleText}</span>
              {organizationName && (
                <>
                  <span className="opacity-40">&bull;</span>
                  <span>{organizationName}</span>
                </>
              )}
            </span>
          </div>
        )}

        {/* Location / Address */}
        {fullAddress && (
          <div className={`flex items-center justify-center gap-1.5 mt-1.5 text-xs font-semibold ${insideCardDark ? 'text-white/70' : 'text-charcoal/70'}`}>
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{fullAddress}</span>
          </div>
        )}

        {/* Bio Description */}
        {profile.bio && (
          <p className={`${bodySizeClass} mt-2.5 max-w-md leading-relaxed font-medium ${insideCardDark ? 'text-white/85' : 'text-charcoal/75'}`}>
            {profile.bio}
          </p>
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
                  dark 
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
                  dark 
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
                  dark 
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
                dark 
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
                dark 
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
                dark 
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
                dark 
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
                dark 
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                  : 'bg-white/90 hover:bg-white text-charcoal border border-black/10'
              }`}
              title="Direct Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* ACTIVE LINK BLOCKS STACK */}
        <div className="w-full flex flex-col gap-3 text-left">
          {activeLinks.length === 0 ? (
            <div className={`p-5 rounded-3xl text-center text-xs font-bold ${dark ? 'bg-white/5 text-white/50 border border-white/10' : 'bg-white/60 text-charcoal/50 border border-black/5'}`}>
              No active links published yet.
            </div>
          ) : (
            activeLinks.map((link) => {
              const cardStyle = link.linkTheme || profile.linkCardStyle;
              const cardClasses = resolveLinkCardClasses(
                profile.theme,
                link.styleVariant,
                cardStyle
              );
              return (
                <div
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className={`p-4 transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${cardClasses}`}
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
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px] pointer-events-none z-0" />
                  )}
                  <div className="flex items-center gap-3 min-w-0 relative z-10">
                    <div className="w-9 h-9 rounded-xl bg-white/90 border border-black/5 flex items-center justify-center shrink-0 shadow-2xs text-charcoal">
                      {renderIcon(link.icon)}
                    </div>
                    <div className="min-w-0">
                      <p className={`${bodySizeClass} font-black truncate leading-tight`}>
                        {link.title}
                      </p>
                      {link.subtitle && (
                        <p className="text-[11px] opacity-75 truncate mt-0.5 font-medium">
                          {link.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 opacity-70 shrink-0 ml-2 relative z-10" />
                </div>
              );
            })
          )}
        </div>

        {/* CREATOR PRODUCTS & WHATSAPP COMMERCE STORE (SHOWN DIRECTLY BELOW PROFILE LINKS) */}
        {store.enabled && store.products.some((product) => product.isActive) && (
          <div className="w-full mt-8 pt-6 border-t border-black/10 flex flex-col gap-4 text-left">
            <PublicStore store={store} sellerName={profile.displayName} dark={insideCardDark} />
          </div>
        )}
      </main>

      {/* Powered by Tapping Branding Footer */}
      <footer className="w-full py-4 text-center">
        <span className={`text-[11px] font-bold tracking-wider ${insideCardDark ? 'text-white/40' : 'text-charcoal/40'}`}>
          Powered by TAPPING &bull; Digital Cards &amp; Bio Space
        </span>
      </footer>
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
