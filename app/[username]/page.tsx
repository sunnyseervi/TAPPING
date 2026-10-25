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
  recordQRScan
} from '@/lib/storage';
import { 
  initialProfile, 
  initialVCard, 
  initialLinks 
} from '@/lib/mockData';
import { Profile, VCardProfile, LinkBlock } from '@/lib/types';
import { 
  Download, 
  ExternalLink, 
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
  Building2, 
  X,
  ArrowUpRight
} from 'lucide-react';
import { downloadVCardFile } from '@/lib/vcard';
import QRCode from 'qrcode';
import { useToast } from '@/components/ui/Toast';
import { InstagramIcon, TwitterIcon, LinkedinIcon, GithubIcon } from '@/components/ui/SocialIcons';
import { THEMES, getFontFamilyClass, getPatternClass, resolveLinkCardClasses, isDarkTheme } from '@/lib/themes';

export default function PublicProfilePage() {
  const params = useParams();
  const usernameParam = (params?.username as string) || 'alex';
  const { showToast } = useToast();

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [vcard, setVcard] = useState<VCardProfile>(initialVCard);
  const [links, setLinks] = useState<LinkBlock[]>(initialLinks);

  const [showQRModal, setShowQRModal] = useState(false);
  const [qrUrl, setQrUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    recordPageView();
    const storedProfile = getStoredProfile();
    const storedVCard = getStoredVCard();
    const storedLinks = getStoredLinks();

    if (storedProfile && usernameParam) {
      storedProfile.username = usernameParam;
    }

    setProfile(storedProfile);
    setVcard(storedVCard);
    setLinks(storedLinks);

    if (typeof window !== 'undefined') {
      QRCode.toDataURL(window.location.href, { width: 360, margin: 2 })
        .then(setQrUrl)
        .catch(console.error);
    }
  }, [usernameParam]);

  const activeLinks = links.filter((l) => l.isActive);

  // Active theme and styling tokens
  const currentTheme = THEMES[profile.theme] || THEMES['pastel-bento'];
  const dark = isDarkTheme(profile.theme);
  const fontFamilyClass = getFontFamilyClass(profile.fontFamily);
  const patternClass = profile.showHeaderBackground ? getPatternClass(profile.headerBackground) : '';

  // Adaptive container styling: never gets stuck in illegible dark box
  const cardContainerClass = dark 
    ? 'bg-[#0B0F19]/95 backdrop-blur-md border border-white/10 text-white shadow-2xl'
    : (profile.theme === 'comic-pop' || profile.theme === 'neobrutalism')
      ? 'bg-white border-3 border-black text-black shadow-[8px_8px_0px_#000]'
      : 'bg-white/95 backdrop-blur-md border border-black/10 text-charcoal shadow-2xl';

  // Dynamic font sizing
  const titleSizeClass = 
    profile.fontSize === 'sm' ? 'text-xl sm:text-2xl' :
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
  const fullAddress = [vcard.streetAddress, vcard.city, vcard.country].filter(Boolean).join(', ');

  return (
    <div className={`min-h-screen ${currentTheme.canvasBg} text-charcoal flex flex-col items-center justify-between p-4 sm:p-6 lg:p-10 selection:bg-[#FDF166] selection:text-charcoal transition-colors duration-200 relative overflow-hidden`}>
      {/* Full-Screen Bio Page Theme Pattern or Custom Uploaded Wallpaper */}
      {profile.showHeaderBackground && (profile.customHeaderImage || patternClass) && (
        <div 
          className={`fixed inset-0 z-0 pointer-events-none transition-all ${
            profile.customHeaderImage ? 'bg-cover bg-center' : patternClass
          }`}
          style={profile.customHeaderImage ? { backgroundImage: `url(${profile.customHeaderImage})` } : undefined}
        >
          {profile.customHeaderImage && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          )}
        </div>
      )}

      {/* TOP ACTION BAR: Refined Share & QR Actions (No Clunky Green Dot) */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-end py-1.5 mb-2 relative z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              recordQRScan();
              setShowQRModal(true);
            }}
            className={`px-3 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer ${
              dark 
                ? 'bg-[#141A28]/90 hover:bg-[#1C2538] text-white border-white/20' 
                : 'bg-white/90 hover:bg-white text-charcoal border-black/10'
            }`}
            title="Scan or View QR Code"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR</span>
          </button>
          <button
            onClick={handleShare}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-transform active:scale-95 cursor-pointer ${
              dark 
                ? 'bg-[#141A28]/90 hover:bg-[#1C2538] text-white border-white/20' 
                : 'bg-white/90 hover:bg-white text-charcoal border-black/10'
            }`}
            title="Share Contact Profile"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* MAIN PROFILE CARD: USER IDENTITY & CONTACT DATA */}
      <main className={`w-full max-w-xl mx-auto ${cardContainerClass} rounded-[36px] sm:rounded-[44px] flex flex-col overflow-hidden text-center transition-all relative z-10`}>
        {/* Card Body */}
        <div className="p-6 sm:p-8 flex flex-col gap-6">
          {/* 1. USER IDENTITY (Avatar, Name, Handle, Title, Location, Bio) */}
          <div className="flex flex-col items-center">
            {/* Avatar with Crisp White Ring, Shadow, & Custom Zoom/Framing */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-4 ring-white border-2 border-white shadow-soft bg-white relative flex items-center justify-center mt-1">
              <img
                src={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'}
                alt={profile.displayName}
                className="w-full h-full object-cover transition-transform"
                style={{
                  transform: `scale(${(profile.avatarZoom ?? 100) / 100}) translate(${profile.avatarPosX ?? 0}px, ${profile.avatarPosY ?? 0}px)`,
                  transformOrigin: 'center center',
                }}
              />
            </div>

            {/* User Display Name */}
            <h1 
              className={`${titleSizeClass} font-black tracking-tight mt-3.5 leading-tight ${fontFamilyClass}`}
              style={{ color: profile.fontColor || (dark ? '#FFFFFF' : '#141518') }}
            >
              {profile.displayName}
            </h1>

            {/* Handle / Username */}
            <p className={`text-xs font-bold font-mono mt-0.5 ${dark ? 'text-white/60' : 'text-charcoal/60'}`}>
              @{profile.username}
            </p>

            {/* Professional Work / Title / Company Badge */}
            {(jobTitleText || organizationName) && (
              <div className="mt-1.5 flex items-center justify-center">
                <span className={`text-xs sm:text-sm font-black px-3.5 py-1 rounded-full ${currentTheme.badgeBg} ${currentTheme.badgeBorder} ${currentTheme.badgeText} shadow-2xs flex items-center gap-1.5`}>
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
              <div className={`flex items-center justify-center gap-1.5 mt-1.5 text-xs font-semibold ${dark ? 'text-white/70' : 'text-charcoal/70'}`}>
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span>{fullAddress}</span>
              </div>
            )}

            {/* Bio Description */}
            {profile.bio && (
              <p className={`${bodySizeClass} mt-3 max-w-md leading-relaxed font-medium ${dark ? 'text-white/85' : 'text-charcoal/75'}`}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* 2. PRIMARY CONTACT ACTION: SAVE DIRECT VCARD 3.0 TO PHONE */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleDownloadVCard}
              className={`w-full py-3.5 px-6 rounded-2xl ${currentTheme.accentBtn} ${currentTheme.accentBtnText} text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 shadow-sm transition-transform active:scale-98 cursor-pointer`}
              title="Download contact vCard directly into iPhone / Android phonebook"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>Save Contact to Phone (vCard)</span>
            </button>

            {/* Quick Contact Action Pills: Call / Email / Website */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                  className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${
                    dark 
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                      : 'bg-white hover:bg-gray-50 text-charcoal border border-black/10'
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
                  className={`py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${
                    dark 
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                      : 'bg-white hover:bg-gray-50 text-charcoal border border-black/10'
                  }`}
                  title={`Email ${emailAddress}`}
                >
                  <Mail className="w-3.5 h-3.5 text-[#4F83FF]" />
                  <span className="truncate">Email</span>
                </a>
              )}

              {vcard.website && (
                <a
                  href={vcard.website.startsWith('http') ? vcard.website : `https://${vcard.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`col-span-2 sm:col-span-1 py-2.5 px-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs transition-colors ${
                    dark 
                      ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                      : 'bg-white hover:bg-gray-50 text-charcoal border border-black/10'
                  }`}
                  title="Open Website"
                >
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate">Website</span>
                </a>
              )}
            </div>
          </div>

          {/* 3. STRUCTURED CONTACT DETAILS CARD (Name, Number, Work, Address, Website) */}
          <div className={`rounded-3xl p-4 sm:p-5 flex flex-col gap-3 text-left ${
            dark ? 'bg-white/[0.05] border border-white/10 text-white' : 'bg-black/[0.03] border border-black/5 text-charcoal'
          }`}>
            <p className={`text-[10px] font-black uppercase tracking-wider ${dark ? 'text-white/60' : 'opacity-50'}`}>
              Contact & Business Details
            </p>

            <div className="space-y-2.5 text-xs">
              {/* Phone */}
              {phoneNumber && (
                <div className={`flex items-center justify-between pb-2 border-b ${dark ? 'border-white/10' : 'border-black/5'}`}>
                  <span className={`font-bold flex items-center gap-1.5 ${dark ? 'text-white/70' : 'opacity-60'}`}>
                    <Phone className="w-3.5 h-3.5 opacity-60" />
                    <span>Phone Number</span>
                  </span>
                  <a
                    href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                    className={`font-mono font-black hover:underline ${dark ? 'text-white' : 'text-charcoal'}`}
                  >
                    {phoneNumber}
                  </a>
                </div>
              )}

              {/* Email */}
              {emailAddress && (
                <div className={`flex items-center justify-between pb-2 border-b ${dark ? 'border-white/10' : 'border-black/5'}`}>
                  <span className={`font-bold flex items-center gap-1.5 ${dark ? 'text-white/70' : 'opacity-60'}`}>
                    <Mail className="w-3.5 h-3.5 opacity-60" />
                    <span>Work Email</span>
                  </span>
                  <a
                    href={`mailto:${emailAddress}`}
                    className={`font-mono font-bold hover:underline truncate max-w-[200px] ${dark ? 'text-white' : 'text-charcoal'}`}
                  >
                    {emailAddress}
                  </a>
                </div>
              )}

              {/* Organization / Work */}
              {organizationName && (
                <div className={`flex items-center justify-between pb-2 border-b ${dark ? 'border-white/10' : 'border-black/5'}`}>
                  <span className={`font-bold flex items-center gap-1.5 ${dark ? 'text-white/70' : 'opacity-60'}`}>
                    <Building2 className="w-3.5 h-3.5 opacity-60" />
                    <span>Organization</span>
                  </span>
                  <span className={`font-black ${dark ? 'text-white' : 'text-charcoal'}`}>
                    {organizationName}
                  </span>
                </div>
              )}

              {/* Address */}
              {fullAddress && (
                <div className={`flex items-center justify-between pb-2 border-b ${dark ? 'border-white/10' : 'border-black/5'}`}>
                  <span className={`font-bold flex items-center gap-1.5 shrink-0 ${dark ? 'text-white/70' : 'opacity-60'}`}>
                    <MapPin className="w-3.5 h-3.5 opacity-60" />
                    <span>Address</span>
                  </span>
                  <span className={`font-bold text-right truncate max-w-[220px] ${dark ? 'text-white' : 'text-charcoal'}`}>
                    {fullAddress}
                  </span>
                </div>
              )}

              {/* Website */}
              {vcard.website && (
                <div className="flex items-center justify-between">
                  <span className={`font-bold flex items-center gap-1.5 ${dark ? 'text-white/70' : 'opacity-60'}`}>
                    <Globe className="w-3.5 h-3.5 opacity-60" />
                    <span>Website</span>
                  </span>
                  <a
                    href={vcard.website.startsWith('http') ? vcard.website : `https://${vcard.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className={`font-mono font-bold hover:underline truncate max-w-[200px] ${dark ? 'text-[#38BDF8]' : 'text-[#4F83FF]'}`}
                  >
                    {vcard.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 4. SOCIAL MEDIA HANDLES (Instagram, Twitter / X, LinkedIn, GitHub, Email) */}
          <div className="flex items-center justify-center gap-2 pt-1 pb-1 flex-wrap">
            {profile.socialLinks?.instagram && (
              <a
                href={`https://instagram.com/${profile.socialLinks.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 ${
                  dark 
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    : 'bg-white hover:bg-black/5 text-charcoal border border-black/10'
                }`}
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
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 ${
                  dark 
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    : 'bg-white hover:bg-black/5 text-charcoal border border-black/10'
                }`}
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
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 ${
                  dark 
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    : 'bg-white hover:bg-black/5 text-charcoal border border-black/10'
                }`}
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
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 ${
                  dark 
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    : 'bg-white hover:bg-black/5 text-charcoal border border-black/10'
                }`}
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
            {profile.socialLinks?.email && (
              <a
                href={`mailto:${profile.socialLinks.email}`}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-2xs hover:scale-105 ${
                  dark 
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                    : 'bg-white hover:bg-black/5 text-charcoal border border-black/10'
                }`}
                title="Direct Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* 5. USER'S CONTENT & ACTIVE LINKS STACK */}
          <div className="flex flex-col gap-3 pt-2 text-left">
            <p className={`text-[10px] font-black uppercase tracking-wider px-1 ${dark ? 'text-white/60' : 'opacity-50'}`}>
              Featured Links & Portfolio
            </p>

            {activeLinks.length === 0 ? (
              <div className="p-6 rounded-3xl bg-black/[0.03] border border-black/5 text-center opacity-60 text-xs">
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
                const hasCustomBg = !!link.bgImage || !!link.bgColor;
                return (
                  <div
                    key={link.id}
                    onClick={() => handleLinkClick(link)}
                    className={`w-full p-4 transition-all cursor-pointer flex items-center justify-between group relative overflow-hidden ${cardClasses}`}
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

                    <div className="flex items-center gap-3.5 min-w-0 relative z-10">
                      <div className="w-9 h-9 rounded-xl bg-white/90 border border-black/5 flex items-center justify-center shrink-0 shadow-2xs text-charcoal">
                        {renderIcon(link.icon)}
                      </div>
                      <div className="min-w-0">
                        <p 
                          className={`text-xs sm:text-sm font-black truncate leading-tight ${fontFamilyClass}`}
                          style={link.textColor ? { color: link.textColor } : (link.bgImage ? { color: '#FFFFFF' } : undefined)}
                        >
                          {link.title}
                        </p>
                        {link.subtitle && (
                          <p 
                            className="text-[11px] opacity-80 truncate font-semibold mt-0.5"
                            style={link.textColor ? { color: link.textColor } : (link.bgImage ? { color: '#FFFFFF' } : undefined)}
                          >
                            {link.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center group-hover:bg-[#141518] group-hover:text-white transition-all shrink-0 ml-2 relative z-10">
                      <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" style={link.textColor ? { color: link.textColor } : (link.bgImage ? { color: '#FFFFFF' } : undefined)} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER: Minimal Powered by Tapping */}
          <div className="pt-4 border-t border-black/5 text-center">
            <a
              href="/"
              className="text-[10px] font-black opacity-40 hover:opacity-100 uppercase tracking-widest inline-flex items-center gap-1.5 transition-opacity"
            >
              <span>Powered by TAPPING</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </main>

      {/* PERMANENT VECTOR QR CODE MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 sm:p-7 max-w-xs w-full text-center border border-black/10 shadow-float animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-black/5">
              <span className="text-xs font-black text-charcoal uppercase tracking-wider">
                Permanent QR Code
              </span>
              <button
                onClick={() => setShowQRModal(false)}
                className="w-7 h-7 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-charcoal transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {qrUrl && (
              <div className="p-3 bg-[#FAF7F2] rounded-3xl border border-black/5 inline-block mx-auto">
                <img src={qrUrl} alt="Contact QR Code" className="w-52 h-52 mx-auto rounded-2xl" />
              </div>
            )}

            <p className="font-mono text-xs text-charcoal/70 mt-3 font-bold truncate">
              {profile.displayName}
            </p>
            <p className="font-mono text-[11px] text-charcoal/50 font-semibold truncate">
              @{profile.username}
            </p>

            <button
              onClick={() => {
                const a = document.createElement('a');
                a.href = qrUrl;
                a.download = `${profile.username}-contact-qr.png`;
                a.click();
                showToast('QR Downloaded', 'Saved contact QR code image', 'success');
              }}
              className="mt-4 w-full py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black shadow-xs transition-colors cursor-pointer"
            >
              Download QR Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
