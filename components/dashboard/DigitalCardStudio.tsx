'use client';

import React, { useState, useEffect, useRef } from 'react';
import { VCardProfile, Profile, VisitingCardShape, VisitingCardTheme } from '@/lib/types';
import { 
  CreditCard, 
  QrCode, 
  Download, 
  Check, 
  Copy, 
  Phone, 
  Mail, 
  Building2, 
  Globe, 
  FileText, 
  Upload,
  ExternalLink,
  Printer,
  Sliders,
  Square,
  Circle,
  Eye,
  EyeOff
} from 'lucide-react';
import { downloadVCardFile } from '@/lib/vcard';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import { useToast } from '@/components/ui/Toast';

interface DigitalCardStudioProps {
  profile?: Profile;
  vcard: VCardProfile;
  username: string;
  onUpdateVCard?: (updated: VCardProfile) => void;
  onSelectTab?: (tab: string) => void;
}

export default function DigitalCardStudio({
  profile,
  vcard,
  username,
  onUpdateVCard,
  onSelectTab,
}: DigitalCardStudioProps) {
  const { showToast } = useToast();
  const [displayHost, setDisplayHost] = useState('tapping.bio');
  const [cardShape, setCardShape] = useState<VisitingCardShape>('rounded');
  const [cardTheme, setCardTheme] = useState<VisitingCardTheme>('executive_dark');
  const [qrColor, setQrColor] = useState('#141518');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showSafeGuide, setShowSafeGuide] = useState(true);
  const [customBgImage, setCustomBgImage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayHost(window.location.host);
    }
  }, []);

  const targetUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${username}` 
    : `https://${displayHost}/${username}`;

  // Generate dynamic QR code
  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 1,
      color: {
        dark: qrColor,
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch(console.error);
  }, [targetUrl, qrColor]);

  // Card Content Data (Pulled directly from saved profile & vcard)
  const displayName = profile?.displayName || `${vcard.firstName} ${vcard.lastName}`.trim() || 'Alex Morgan';
  const jobTitle = profile?.badgeTitle || vcard.jobTitle || 'Founder & Product Designer';
  const company = vcard.organization || 'Tapping Technologies';
  const phoneNumber = vcard.workPhone || vcard.mobilePhone || profile?.socialLinks?.phone || '+1 (415) 890-2200';
  const emailAddress = vcard.workEmail || profile?.socialLinks?.email || 'contact@alexmorgan.design';
  const websiteUrl = vcard.website || `${displayHost}/${username}`;

  // Theme Styles Configuration
  const getThemeConfig = (theme: VisitingCardTheme) => {
    switch (theme) {
      case 'clean_white':
        return {
          cardBg: 'bg-white text-charcoal border border-black/15 shadow-card',
          textColor: '#141518',
          accentColor: '#4F83FF',
          mutedColor: 'text-charcoal/60',
          qrContainer: 'bg-white border border-black/10 shadow-xs',
          brandColor: 'text-charcoal/80',
          chipColor: 'bg-amber-400',
        };
      case 'brushed_gold':
        return {
          cardBg: 'bg-gradient-to-tr from-[#B28F38] via-[#C8A44D] to-[#E3C56F] text-slate-950 border border-[#9A7A2E] shadow-card',
          textColor: '#141518',
          accentColor: '#141518',
          mutedColor: 'text-slate-900/70',
          qrContainer: 'bg-white/95 border border-black/10 shadow-sm',
          brandColor: 'text-slate-950/80',
          chipColor: 'bg-[#141518]',
        };
      case 'neo_brutalist':
        return {
          cardBg: 'bg-[#FFFDEB] text-black border-3 border-black shadow-[6px_6px_0px_#000000]',
          textColor: '#000000',
          accentColor: '#000000',
          mutedColor: 'text-black/75',
          qrContainer: 'bg-white border-2 border-black shadow-[2px_2px_0px_#000000]',
          brandColor: 'text-black',
          chipColor: 'bg-[#FDF166]',
        };
      case 'cyber_neon':
        return {
          cardBg: 'bg-[#0B0C10] text-white border border-[#00FF66]/40 shadow-[0_0_25px_rgba(0,255,102,0.15)] pattern-cyber-matrix',
          textColor: '#FFFFFF',
          accentColor: '#00FF66',
          mutedColor: 'text-white/70',
          qrContainer: 'bg-white p-1 rounded-xl shadow-md border border-[#00FF66]/30',
          brandColor: 'text-[#00FF66]',
          chipColor: 'bg-[#00FF66]',
        };
      case 'pastel_bento':
        return {
          cardBg: 'bg-[#FDF166] text-charcoal border-2 border-black/15 shadow-card',
          textColor: '#141518',
          accentColor: '#4F83FF',
          mutedColor: 'text-charcoal/70',
          qrContainer: 'bg-white border border-black/10 shadow-xs',
          brandColor: 'text-charcoal/80',
          chipColor: 'bg-[#4F83FF]',
        };
      case 'executive_dark':
      default:
        return {
          cardBg: 'bg-[#141518] text-white border border-white/15 shadow-card',
          textColor: '#FFFFFF',
          accentColor: '#FDF166',
          mutedColor: 'text-white/65',
          qrContainer: 'bg-white border border-black/10 shadow-md',
          brandColor: 'text-white/80',
          chipColor: 'bg-amber-400',
        };
    }
  };

  const currentThemeConfig = getThemeConfig(cardTheme);

  // Custom Background Upload
  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select a PNG, JPG, or SVG image', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomBgImage(dataUrl);
      showToast('Card Artwork Applied', 'Custom background set on visiting card', 'success');
    };
    reader.readAsDataURL(file);
  };

  // Generate 300 DPI High-Res Canvas
  const generateHighResCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    // 3.5" x 2" at 300 DPI = 1050 x 600 pixels (standard print)
    canvas.width = 1050;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D canvas context');

    // 1. Draw Background
    if (customBgImage) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, 1050, 600);
          resolve();
        };
        img.src = customBgImage;
      });
      // Add subtle dark gradient overlay for text readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, 1050, 600);
    } else {
      switch (cardTheme) {
        case 'clean_white':
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 1050, 600);
          ctx.strokeStyle = 'rgba(0,0,0,0.12)';
          ctx.lineWidth = 4;
          ctx.strokeRect(0, 0, 1050, 600);
          break;
        case 'brushed_gold':
          const grad = ctx.createLinearGradient(0, 0, 1050, 600);
          grad.addColorStop(0, '#B28F38');
          grad.addColorStop(0.5, '#C8A44D');
          grad.addColorStop(1, '#E3C56F');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1050, 600);
          break;
        case 'neo_brutalist':
          ctx.fillStyle = '#FFFDEB';
          ctx.fillRect(0, 0, 1050, 600);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 12;
          ctx.strokeRect(0, 0, 1050, 600);
          break;
        case 'cyber_neon':
          ctx.fillStyle = '#0B0C10';
          ctx.fillRect(0, 0, 1050, 600);
          ctx.strokeStyle = '#00FF66';
          ctx.lineWidth = 4;
          ctx.strokeRect(0, 0, 1050, 600);
          break;
        case 'pastel_bento':
          ctx.fillStyle = '#FDF166';
          ctx.fillRect(0, 0, 1050, 600);
          break;
        case 'executive_dark':
        default:
          ctx.fillStyle = '#141518';
          ctx.fillRect(0, 0, 1050, 600);
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 4;
          ctx.strokeRect(0, 0, 1050, 600);
          break;
      }
    }

    const isLightCard = cardTheme === 'clean_white' || cardTheme === 'neo_brutalist' || cardTheme === 'pastel_bento' || cardTheme === 'brushed_gold';
    const primaryTextColor = isLightCard ? '#141518' : '#FFFFFF';
    const secondaryTextColor = isLightCard ? 'rgba(20,21,24,0.7)' : 'rgba(255,255,255,0.7)';

    // 2. Strict 5mm Safe Print Margin: 5mm on 85.6mm is approx 60px on a 1050px canvas
    const safeMarginX = 60;
    const safeMarginY = 60;

    // 3. Draw Left Side Content
    // Name
    ctx.fillStyle = primaryTextColor;
    ctx.font = 'bold 44px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(displayName.toUpperCase(), safeMarginX, safeMarginY + 20);

    // Job Title / Role
    ctx.fillStyle = isLightCard ? '#4F83FF' : '#FDF166';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(jobTitle.toUpperCase(), safeMarginX, safeMarginY + 80);

    // Organization
    ctx.fillStyle = secondaryTextColor;
    ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(company, safeMarginX, safeMarginY + 115);

    // Divider Line
    ctx.strokeStyle = isLightCard ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(safeMarginX, safeMarginY + 160);
    ctx.lineTo(safeMarginX + 380, safeMarginY + 160);
    ctx.stroke();

    // Contact Details
    ctx.fillStyle = secondaryTextColor;
    ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Phone: ${phoneNumber}`, safeMarginX, safeMarginY + 185);
    ctx.fillText(`Email: ${emailAddress}`, safeMarginX, safeMarginY + 225);
    ctx.fillText(`Bio: ${websiteUrl.replace(/^https?:\/\//, '')}`, safeMarginX, safeMarginY + 265);

    // 4. Draw Right Side: High-Res Scannable QR Code
    if (qrDataUrl) {
      await new Promise<void>((resolve) => {
        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.onload = () => {
          // QR size: 230 x 230 px
          const qrX = 1050 - safeMarginX - 230;
          const qrY = safeMarginY + 20;
          
          // White card backing for QR contrast
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(qrX - 10, qrY - 10, 250, 250);
          ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          ctx.lineWidth = 2;
          ctx.strokeRect(qrX - 10, qrY - 10, 250, 250);

          ctx.drawImage(qrImg, qrX, qrY, 230, 230);
          resolve();
        };
        qrImg.src = qrDataUrl;
      });
    }

    // 5. Draw Right Side Bottom: TAPPING Brand Mark (5mm Margin, never cut off, never overlapping QR)
    const brandX = 1050 - safeMarginX;
    const brandY = 600 - safeMarginY - 15;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = primaryTextColor;
    ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TAPPING', brandX, brandY);

    ctx.fillStyle = isLightCard ? '#4F83FF' : '#00FF66';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText('SMART VISITING CARD', brandX, brandY + 20);

    return canvas;
  };

  // Download 300 DPI High-Res PNG
  const handleDownloadPNG = async () => {
    try {
      showToast('Rendering High-Res PNG', 'Generating print-grade 300 DPI image...', 'info');
      const canvas = await generateHighResCanvas();
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = `${username}-visiting-card-300dpi.png`;
      a.click();
      showToast('PNG Downloaded', '300 DPI business card ready for print and sharing', 'success');
    } catch (err) {
      console.error(err);
      showToast('Export Error', 'Failed to generate high-resolution PNG', 'error');
    }
  };

  // Download Print-Ready PDF (Standard 85mm x 54mm)
  const handleDownloadPDF = async () => {
    try {
      showToast('Rendering Print PDF', 'Compiling vector-ready business card PDF...', 'info');
      const canvas = await generateHighResCanvas();
      const imgData = canvas.toDataURL('image/png');

      // Create landscape PDF matching 85mm x 54mm standard business card
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85, 54],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, 85, 54);
      pdf.save(`${username}-visiting-card-print.pdf`);
      showToast('Print PDF Downloaded', 'Standard 85x54mm PDF ready for print shop', 'success');
    } catch (err) {
      console.error(err);
      showToast('Export Error', 'Failed to generate print-ready PDF', 'error');
    }
  };

  return (
    <div className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-none">
            Digital Visiting Card
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal/35 tracking-tight leading-none mt-1">
            Print &amp; Vector QR Studio
          </h2>
          <p className="text-xs text-charcoal/60 mt-2 font-medium">
            Physical business card design with your verified contact data, permanent dynamic QR code, and 300 DPI export.
          </p>
        </div>

        {/* Quick Action Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Download Print PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPNG}
            className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-white text-charcoal text-xs font-bold border border-black/10 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>High-Res PNG (300 DPI)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              downloadVCardFile(vcard, `${username}_contact.vcf`);
              showToast('vCard Downloaded', 'Direct phonebook import file saved', 'info');
            }}
            className="px-3.5 py-2.5 rounded-full bg-white hover:bg-gray-50 text-charcoal text-xs font-bold border border-black/10 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Download vCard .vcf contact file"
          >
            <FileText className="w-3.5 h-3.5 text-[#4F83FF]" />
            <span>vCard 3.0</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Card Canvas Preview (Left) + Customization Studio (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
        
        {/* Left Column: Interactive Visiting Card Canvas (Sticky) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center">
          
          {/* Card Top Utility Bar */}
          <div className="w-full max-w-[520px] flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono font-bold text-charcoal/70">
                Standard 3.5&Prime; &times; 2&Prime; (85.6 &times; 54mm)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowSafeGuide(!showSafeGuide)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                showSafeGuide
                  ? 'bg-[#EFF4FF] border-[#4F83FF]/30 text-[#4F83FF]'
                  : 'bg-[#FAF7F2] border-black/10 text-charcoal/60'
              }`}
              title="Toggle 5mm safe print margin boundary"
            >
              {showSafeGuide ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>5mm Bleed Margin: {showSafeGuide ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          {/* Physical Visiting Card Canvas Mockup */}
          <div
            className={`w-full max-w-[520px] h-[310px] sm:h-[320px] relative select-none overflow-hidden transition-all duration-300 flex flex-col justify-between p-6 ${
              cardShape === 'rounded' ? 'rounded-3xl' : 'rounded-none'
            } ${customBgImage ? 'bg-cover bg-center text-white border border-black/10 shadow-card' : currentThemeConfig.cardBg}`}
            style={customBgImage ? { backgroundImage: `url(${customBgImage})` } : undefined}
          >
            {/* Custom Background Dark Tint Overlay */}
            {customBgImage && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] pointer-events-none z-0" />
            )}

            {/* 5mm Safe Print Area Boundary Line */}
            {showSafeGuide && (
              <div className={`absolute inset-[18px] border border-dashed pointer-events-none z-20 ${
                cardTheme === 'clean_white' || cardTheme === 'neo_brutalist' ? 'border-black/25' : 'border-white/25'
              } ${cardShape === 'rounded' ? 'rounded-2xl' : 'rounded-none'}`}>
                <span className="absolute top-1 right-2 text-[8px] font-mono opacity-40 uppercase tracking-widest">
                  5mm Safe Margin
                </span>
              </div>
            )}

            {/* Visiting Card Layout Strictly Inside 5mm Safe Print Area */}
            <div className="absolute inset-[18px] z-10 flex justify-between items-stretch pointer-events-none">
              
              {/* Left Side: Contact & Identity Data */}
              <div className="flex flex-col justify-between h-full pr-3 min-w-0 max-w-[280px] sm:max-w-[310px]">
                <div>
                  {/* Monogram / Profile Brand Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-white/20 border border-white/20 flex items-center justify-center font-black text-xs shrink-0">
                      {displayName.charAt(0)}
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-70">
                      Verified Contact
                    </span>
                  </div>

                  {/* Full Name */}
                  <h3 className="font-black text-xl sm:text-2xl tracking-tight leading-tight uppercase truncate">
                    {displayName}
                  </h3>

                  {/* Title / Role */}
                  <p className="text-xs sm:text-sm font-bold opacity-90 mt-0.5 truncate" style={{ color: currentThemeConfig.accentColor }}>
                    {jobTitle}
                  </p>

                  {/* Company */}
                  {company && (
                    <p className="text-[11px] font-semibold opacity-75 truncate mt-0.5">
                      {company}
                    </p>
                  )}
                </div>

                {/* Direct Contact Handles */}
                <div className="space-y-1 text-[10px] font-semibold opacity-80 pt-2 border-t border-current/15">
                  {phoneNumber && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3 h-3 shrink-0 opacity-70" />
                      <span className="font-mono font-bold truncate">{phoneNumber}</span>
                    </div>
                  )}

                  {emailAddress && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Mail className="w-3 h-3 shrink-0 opacity-70" />
                      <span className="font-mono truncate">{emailAddress}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 truncate">
                    <Globe className="w-3 h-3 shrink-0 opacity-70" />
                    <span className="font-mono font-bold text-[#4F83FF] truncate">{displayHost}/{username}</span>
                  </div>
                </div>
              </div>

              {/* Right Side: QR Code + TAPPING Brand (5mm margin, never overlaps) */}
              <div className="flex flex-col justify-between items-end h-full shrink-0 pl-2">
                
                {/* Dynamic Vector QR Code */}
                <div className={`p-2 rounded-2xl flex items-center justify-center shrink-0 ${currentThemeConfig.qrContainer}`}>
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Visiting Card QR"
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 animate-pulse rounded-lg" />
                  )}
                </div>

                {/* Brand Name "TAPPING" at bottom right corner (5mm margin safe) */}
                <div className="text-right">
                  <span className={`font-black text-sm sm:text-base tracking-widest uppercase block leading-none ${currentThemeConfig.brandColor}`}>
                    TAPPING
                  </span>
                  <span className="text-[9px] font-mono opacity-60 block tracking-tight mt-0.5">
                    SMART HARDWARE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice under card */}
          <div className="w-full max-w-[520px] flex items-center justify-between mt-3 text-[11px] text-charcoal/60 px-2 font-medium">
            <span>Data synced with your profile settings.</span>
            {onSelectTab && (
              <button
                type="button"
                onClick={() => onSelectTab('profile')}
                className="text-[#4F83FF] hover:underline font-bold cursor-pointer"
              >
                Edit Contact Details &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Customization & Design Controls */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col gap-5">
          
          {/* Section 1: Card Corner Radius */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-2.5">
            <label className="font-black text-charcoal uppercase tracking-wider block text-xs">
              Card Corner Shape
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCardShape('rounded')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  cardShape === 'rounded'
                    ? 'bg-[#4F83FF] text-white border-[#4F83FF] shadow-xs'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
              >
                <Circle className="w-3.5 h-3.5" />
                <span>Rounded Corners (Modern)</span>
              </button>

              <button
                type="button"
                onClick={() => setCardShape('square')}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  cardShape === 'square'
                    ? 'bg-[#4F83FF] text-white border-[#4F83FF] shadow-xs'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>Square Corners (Classic)</span>
              </button>
            </div>
          </div>

          {/* Section 2: Card Themes & Finishes */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="font-black text-charcoal uppercase tracking-wider block text-xs">
                Visiting Card Theme &amp; Style
              </label>
              {customBgImage && (
                <button
                  type="button"
                  onClick={() => setCustomBgImage('')}
                  className="text-[10px] text-rose-600 font-bold hover:underline"
                >
                  Clear Custom Art
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'executive_dark' as VisitingCardTheme, name: 'Executive Obsidian', desc: 'Matte dark luxury' },
                { id: 'clean_white' as VisitingCardTheme, name: 'Swiss Minimal White', desc: 'Crisp & clean' },
                { id: 'brushed_gold' as VisitingCardTheme, name: '24K Brushed Gold', desc: 'Champagne metallic' },
                { id: 'neo_brutalist' as VisitingCardTheme, name: 'Neo-Brutalist', desc: 'Bold black stroke' },
                { id: 'cyber_neon' as VisitingCardTheme, name: 'Cyber Neon Matrix', desc: 'Dark tech grid' },
                { id: 'pastel_bento' as VisitingCardTheme, name: 'Pastel Butter Bento', desc: 'Warm creative tone' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setCardTheme(t.id);
                    setCustomBgImage('');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    cardTheme === t.id && !customBgImage
                      ? 'border-[#4F83FF] bg-[#EFF4FF] ring-2 ring-[#4F83FF]/40 shadow-xs'
                      : 'border-black/10 bg-white hover:bg-gray-50'
                  }`}
                >
                  <p className="font-black text-xs text-charcoal">{t.name}</p>
                  <p className="text-[10px] text-charcoal/60 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>

            {/* Custom Card Background Artwork Upload */}
            <div className="pt-2 border-t border-black/5 flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleBgUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-gray-50 border border-black/10 text-xs font-bold text-charcoal flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#4F83FF]" />
                <span>Upload Custom Card Artwork (PNG/JPG)</span>
              </button>
            </div>
          </div>

          {/* Section 3: QR Code Color */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-2">
            <label className="font-black text-charcoal uppercase tracking-wider block text-xs">
              QR Foreground Tint
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { name: 'Charcoal Black', hex: '#141518' },
                { name: 'Cobalt Blue', hex: '#4F83FF' },
                { name: 'Emerald Green', hex: '#059669' },
                { name: 'Amber Gold', hex: '#D97706' },
                { name: 'Crimson Red', hex: '#DC2626' },
              ].map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setQrColor(c.hex)}
                  className={`w-7 h-7 rounded-full border border-black/20 flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${
                    qrColor === c.hex ? 'ring-2 ring-charcoal scale-110' : ''
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {qrColor === c.hex && (
                    <Check className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 4: Bio URL Sharing */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal/50 block">
                Encoded Destination URL
              </span>
              <p className="text-xs font-mono font-bold text-charcoal truncate">
                {displayHost}/{username}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(targetUrl);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
                showToast('Link Copied', targetUrl, 'success');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                copiedLink
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white hover:bg-gray-100 text-charcoal border border-black/10 shadow-2xs'
              }`}
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
