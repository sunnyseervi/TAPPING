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
import { compressImageFile } from '@/lib/imageCompression';

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
  const [cardShape, setCardShape] = useState<VisitingCardShape>(vcard.visitingCard?.shape || 'rounded');
  const [cardTheme, setCardTheme] = useState<VisitingCardTheme>(vcard.visitingCard?.theme || 'executive_dark');
  const [qrColor, setQrColor] = useState(vcard.visitingCard?.qrColor || '#141518');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showSafeGuide, setShowSafeGuide] = useState(true);
  const [showBrandMark, setShowBrandMark] = useState(vcard.visitingCard?.showBrandMark ?? true);
  const [qrSize, setQrSize] = useState<number>(vcard.visitingCard?.qrSize || 96);
  const [qrPosX, setQrPosX] = useState<number>(vcard.visitingCard?.qrPosX || 0);
  const [qrPosY, setQrPosY] = useState<number>(vcard.visitingCard?.qrPosY || 0);
  const [customBgImage, setCustomBgImage] = useState<string>(vcard.visitingCard?.customBg || '');
  const [customBgFit, setCustomBgFit] = useState<'cover' | 'contain'>(vcard.visitingCard?.customBgFit || 'cover');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDraggingQr, setIsDraggingQr] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);

  const qrDragRef = useRef<{ isDragging: boolean; startX: number; startY: number; initX: number; initY: number }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
  });

  const startQrDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    qrDragRef.current = {
      isDragging: true,
      startX: clientX,
      startY: clientY,
      initX: qrPosX,
      initY: qrPosY,
    };
    setIsDraggingQr(true);
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!qrDragRef.current.isDragging) return;
      const dx = clientX - qrDragRef.current.startX;
      const dy = clientY - qrDragRef.current.startY;

      // Keep QR strictly inside the 5mm safe print boundaries
      const newX = Math.max(-120, Math.min(25, qrDragRef.current.initX + dx));
      const newY = Math.max(-30, Math.min(90, qrDragRef.current.initY + dy));

      setQrPosX(Math.round(newX));
      setQrPosY(Math.round(newY));
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onEnd = () => {
      if (qrDragRef.current.isDragging) {
        qrDragRef.current.isDragging = false;
        setIsDraggingQr(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [qrPosX, qrPosY]);

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
  const displayName = profile?.displayName || `${vcard.firstName} ${vcard.lastName}`.trim() || 'Aarav Sharma';
  const jobTitle = profile?.badgeTitle || vcard.jobTitle || 'Founder & Architect';
  const company = vcard.organization || 'Tapping Technologies India';
  const phoneNumber = vcard.workPhone || vcard.mobilePhone || profile?.socialLinks?.phone || '+91 98765 43210';
  const emailAddress = vcard.workEmail || profile?.socialLinks?.email || 'contact@aaravsharma.in';
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
  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select a PNG, JPG, or SVG image', 'error');
      return;
    }

    try {
      const result = await compressImageFile(file, { maxWidth: 1600, maxHeight: 1000, quality: 0.82 });
      setCustomBgImage(result.dataUrl);
      showToast('Card artwork applied', 'The image was compressed and saved with your visiting-card design.', 'success');
    } catch (error) {
      showToast('Artwork upload failed', error instanceof Error ? error.message : 'Please try another image.', 'error');
    }
  };

  useEffect(() => {
    if (!onUpdateVCard) return;
    const timer = window.setTimeout(() => onUpdateVCard({
      ...vcard,
      visitingCard: { shape: cardShape, theme: cardTheme, customBg: customBgImage, customBgFit, showBrandMark, qrSize, qrPosX, qrPosY, qrColor },
    }), 300);
    return () => window.clearTimeout(timer);
  }, [cardShape, cardTheme, customBgImage, customBgFit, showBrandMark, qrSize, qrPosX, qrPosY, qrColor]);

  // Generate 300 DPI High-Res Canvas
  const generateHighResCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    // 85.6 x 54mm at 300 DPI.
    canvas.width = 1011;
    canvas.height = 638;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D canvas context');

    await document.fonts.ready;
    const width = canvas.width;
    const height = canvas.height;

    // 1. Draw Background
    if (customBgImage) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const scale = customBgFit === 'contain'
            ? Math.min(width / img.width, height / img.height)
            : Math.max(width / img.width, height / img.height);
          const drawWidth = img.width * scale;
          const drawHeight = img.height * scale;
          ctx.fillStyle = '#141518';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
          resolve();
        };
        img.src = customBgImage;
      });
      // Add subtle dark gradient overlay for text readability
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, width, height);
    } else {
      switch (cardTheme) {
        case 'clean_white':
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.strokeStyle = 'rgba(0,0,0,0.12)';
          ctx.lineWidth = 4;
          ctx.strokeRect(0, 0, width, height);
          break;
        case 'brushed_gold':
          const grad = ctx.createLinearGradient(0, 0, width, height);
          grad.addColorStop(0, '#B28F38');
          grad.addColorStop(0.5, '#C8A44D');
          grad.addColorStop(1, '#E3C56F');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
          break;
        case 'neo_brutalist':
          ctx.fillStyle = '#FFFDEB';
          ctx.fillRect(0, 0, width, height);
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 12;
          ctx.strokeRect(0, 0, width, height);
          break;
        case 'cyber_neon':
          ctx.fillStyle = '#0B0C10';
          ctx.fillRect(0, 0, width, height);
          ctx.strokeStyle = '#00FF66';
          ctx.lineWidth = 4;
          ctx.strokeRect(0, 0, width, height);
          break;
        case 'pastel_bento':
          ctx.fillStyle = '#FDF166';
          ctx.fillRect(0, 0, width, height);
          break;
        case 'executive_dark':
        default:
          ctx.fillStyle = '#141518';
          ctx.fillRect(0, 0, width, height);
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 4;
          ctx.strokeRect(0, 0, width, height);
          break;
      }
    }

    const isLightCard = cardTheme === 'clean_white' || cardTheme === 'neo_brutalist' || cardTheme === 'pastel_bento' || cardTheme === 'brushed_gold';
    const primaryTextColor = isLightCard ? '#141518' : '#FFFFFF';
    const secondaryTextColor = isLightCard ? 'rgba(20,21,24,0.7)' : 'rgba(255,255,255,0.7)';

    // 2. Strict 5mm Safe Print Margin: 5mm on 85.6mm is approx 60px on a 1050px canvas
    const safeMarginX = 48;
    const safeMarginY = 48;

    // Verified contact badge shown in the live preview.
    ctx.fillStyle = isLightCard ? 'rgba(20,21,24,0.1)' : 'rgba(255,255,255,0.18)';
    ctx.beginPath();
    ctx.roundRect(safeMarginX, safeMarginY, 38, 38, 10);
    ctx.fill();
    ctx.fillStyle = primaryTextColor;
    ctx.font = '800 20px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayName.charAt(0).toUpperCase(), safeMarginX + 19, safeMarginY + 20);
    ctx.textAlign = 'left';
    ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = secondaryTextColor;
    ctx.fillText('VERIFIED CONTACT', safeMarginX + 52, safeMarginY + 20);

    // 3. Draw Left Side Content
    // Name
    ctx.fillStyle = primaryTextColor;
    ctx.font = '900 42px "Plus Jakarta Sans", sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(displayName.toUpperCase(), safeMarginX, 145, 500);

    // Job Title / Role
    ctx.fillStyle = isLightCard ? '#4F83FF' : '#FDF166';
    ctx.font = '800 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(jobTitle, safeMarginX, 205, 500);

    // Organization
    ctx.fillStyle = secondaryTextColor;
    ctx.font = '600 19px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(company, safeMarginX, 244, 500);

    // Divider Line
    ctx.strokeStyle = isLightCard ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(safeMarginX, 402);
    ctx.lineTo(safeMarginX + 440, 402);
    ctx.stroke();

    // Contact Details
    ctx.fillStyle = secondaryTextColor;
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(phoneNumber, safeMarginX, 430, 480);
    ctx.fillText(emailAddress, safeMarginX, 470, 480);
    ctx.fillStyle = customBgImage ? '#FFFFFF' : currentThemeConfig.accentColor;
    ctx.fillText(websiteUrl.replace(/^https?:\/\//, ''), safeMarginX, 510, 480);

    // 4. Draw Right Side: High-Res Scannable QR Code (with user size and position offsets)
    if (qrDataUrl) {
      await new Promise<void>((resolve) => {
        const qrImg = new Image();
        qrImg.crossOrigin = 'anonymous';
        qrImg.onload = () => {
          const baseSize = Math.min(250, Math.max(150, qrSize * 1.95));
          const qrX = Math.max(555, Math.min(width - safeMarginX - baseSize, width - safeMarginX - baseSize + (qrPosX * 1.7)));
          const qrY = Math.max(safeMarginY, Math.min(height - safeMarginY - baseSize - 55, safeMarginY + (qrPosY * 1.7)));
          
          // White card backing for QR contrast
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(qrX - 10, qrY - 10, baseSize + 20, baseSize + 20);
          ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          ctx.lineWidth = 2;
          ctx.strokeRect(qrX - 10, qrY - 10, baseSize + 20, baseSize + 20);

          ctx.drawImage(qrImg, qrX, qrY, baseSize, baseSize);
          resolve();
        };
        qrImg.src = qrDataUrl;
      });
    }

    // 5. Draw Right Side Bottom: TAPPING Brand Mark (Optional, 5mm Margin, never cut off)
    if (showBrandMark) {
      const brandX = width - safeMarginX;
      const brandY = height - safeMarginY;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillStyle = primaryTextColor;
      ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('TAPPING', brandX, brandY);
    }

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
              showToast('Contact Card Downloaded', 'Direct phonebook import file saved', 'info');
            }}
            className="px-3.5 py-2.5 rounded-full bg-white hover:bg-gray-50 text-charcoal text-xs font-bold border border-black/10 flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="Download contact card .vcf file"
          >
            <FileText className="w-3.5 h-3.5 text-[#4F83FF]" />
            <span>Contact Card (.vcf)</span>
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

            <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 rounded-xl border border-[#4F83FF]/25 bg-[#EFF4FF] px-3 py-1.5 text-[10px] font-black text-[#4F83FF]"><Upload className="h-3 w-3" /> Upload design image</button>
          </div>

          {/* Physical Visiting Card Canvas Mockup */}
          <div
            ref={cardPreviewRef}
            className={`w-full max-w-[520px] aspect-[85.6/54] relative select-none overflow-hidden transition-all duration-300 flex flex-col justify-between p-6 ${
              cardShape === 'rounded' ? 'rounded-3xl' : 'rounded-none'
            } ${customBgImage ? 'bg-center bg-no-repeat text-white border border-black/10 shadow-card' : currentThemeConfig.cardBg}`}
            style={customBgImage ? { backgroundImage: `url(${customBgImage})`, backgroundSize: customBgFit } : undefined}
          >
            {/* Custom Background Dark Tint Overlay */}
            {customBgImage && (
              <div className="absolute inset-0 bg-black/45 backdrop-blur-[0.5px] pointer-events-none z-0" />
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

              {/* Right Side: QR Code + TAPPING Brand (5mm margin safe) */}
              <div className="flex flex-col justify-between items-end h-full shrink-0 pl-2">
                
                {/* Dynamic Vector QR Code with Direct Canvas Drag & Sizing */}
                <div 
                  onMouseDown={startQrDrag}
                  onTouchStart={startQrDrag}
                  className={`p-2 rounded-2xl flex items-center justify-center shrink-0 transition-transform pointer-events-auto cursor-grab active:cursor-grabbing select-none ${
                    isDraggingQr ? 'ring-2 ring-[#4F83FF] shadow-lg scale-105' : 'hover:ring-1 hover:ring-black/20'
                  } ${currentThemeConfig.qrContainer}`}
                  style={{
                    width: `${qrSize}px`,
                    height: `${qrSize}px`,
                    transform: `translate(${qrPosX}px, ${qrPosY}px)`,
                  }}
                  title="Click and drag QR code directly on card to position"
                >
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Visiting Card QR"
                      className="w-full h-full object-contain rounded-lg pointer-events-none"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
                  )}
                </div>

                {/* Brand Name "TAPPING" at bottom right corner (toggleable) */}
                {showBrandMark && (
                  <div className="text-right">
                    <span className={`font-black text-sm sm:text-base tracking-widest uppercase block leading-none ${currentThemeConfig.brandColor}`}>
                      TAPPING
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Notice & Drag Feedback under card */}
          <div className="w-full max-w-[520px] flex items-center justify-between mt-3 text-[11px] text-charcoal/70 px-2 font-medium">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isDraggingQr ? 'bg-[#4F83FF] animate-pulse' : 'bg-emerald-500'}`} />
              <span>{isDraggingQr ? `Dragging QR Code (X: ${qrPosX}px, Y: ${qrPosY}px)` : 'Drag QR code directly on card to position'}</span>
            </span>
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
            {customBgImage && <div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setCustomBgFit('cover')} className={`rounded-xl px-3 py-2 text-[10px] font-black ${customBgFit === 'cover' ? 'bg-[#141518] text-white' : 'bg-white text-charcoal'}`}>Fill card</button><button type="button" onClick={() => setCustomBgFit('contain')} className={`rounded-xl px-3 py-2 text-[10px] font-black ${customBgFit === 'contain' ? 'bg-[#141518] text-white' : 'bg-white text-charcoal'}`}>Show full image</button></div>}
          </div>

          {/* Section 3: QR Code Size & Drag/Nudge Controls */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="font-black text-charcoal uppercase tracking-wider block text-xs">
                QR Barcode Size &amp; Position
              </label>
              <span className="text-[10px] font-mono font-bold text-charcoal/70 bg-white px-2 py-0.5 rounded-lg border border-black/10">
                {qrSize}px &middot; X: {qrPosX > 0 ? `+${qrPosX}` : qrPosX} Y: {qrPosY > 0 ? `+${qrPosY}` : qrPosY}
              </span>
            </div>

            {/* Size Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-charcoal/70">
                <span>Scale / Dimensions</span>
                <div className="flex items-center gap-1">
                  {[
                    { label: 'Compact', size: 76 },
                    { label: 'Standard', size: 96 },
                    { label: 'Large', size: 116 },
                    { label: 'Max', size: 130 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setQrSize(preset.size)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        qrSize === preset.size
                          ? 'bg-[#4F83FF] text-white'
                          : 'bg-white hover:bg-black/5 text-charcoal border border-black/10'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <input
                type="range"
                min="64"
                max="130"
                step="2"
                value={qrSize}
                onChange={(e) => setQrSize(Number(e.target.value))}
                className="w-full accent-[#4F83FF] cursor-pointer"
              />
            </div>

            {/* Position Offset Controls */}
            <div className="flex items-center justify-between pt-1 border-t border-black/5">
              <span className="text-[11px] font-medium text-charcoal/70">Move Position</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setQrPosX((prev) => Math.max(-30, prev - 5))}
                  className="w-7 h-7 rounded-xl bg-white hover:bg-gray-100 border border-black/10 flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs"
                  title="Move Left"
                >
                  &larr;
                </button>
                <button
                  type="button"
                  onClick={() => setQrPosX((prev) => Math.min(30, prev + 5))}
                  className="w-7 h-7 rounded-xl bg-white hover:bg-gray-100 border border-black/10 flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs"
                  title="Move Right"
                >
                  &rarr;
                </button>
                <button
                  type="button"
                  onClick={() => setQrPosY((prev) => Math.max(-25, prev - 5))}
                  className="w-7 h-7 rounded-xl bg-white hover:bg-gray-100 border border-black/10 flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs"
                  title="Move Up"
                >
                  &uarr;
                </button>
                <button
                  type="button"
                  onClick={() => setQrPosY((prev) => Math.min(25, prev + 5))}
                  className="w-7 h-7 rounded-xl bg-white hover:bg-gray-100 border border-black/10 flex items-center justify-center font-bold text-xs cursor-pointer shadow-2xs"
                  title="Move Down"
                >
                  &darr;
                </button>
                {(qrPosX !== 0 || qrPosY !== 0) && (
                  <button
                    type="button"
                    onClick={() => {
                      setQrPosX(0);
                      setQrPosY(0);
                    }}
                    className="px-2 py-1 rounded-xl text-[10px] font-bold text-charcoal/70 hover:text-black bg-white border border-black/10 cursor-pointer shadow-2xs"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Brand Mark Visibility (White-Label Print Option) */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex items-center justify-between gap-3">
            <div>
              <label className="font-black text-charcoal uppercase tracking-wider block text-xs">
                TAPPING Brand Mark
              </label>
              <p className="text-[10px] text-charcoal/60 mt-0.5">
                {showBrandMark 
                  ? 'Showing "TAPPING" corner mark on printed card'
                  : 'Hidden & removed for 100% white-label custom card'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowBrandMark(!showBrandMark)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                showBrandMark
                  ? 'bg-[#4F83FF] text-white shadow-xs'
                  : 'bg-white hover:bg-gray-50 text-charcoal border border-black/10 shadow-2xs'
              }`}
            >
              {showBrandMark ? 'Brand Visible' : 'Removed'}
            </button>
          </div>

          {/* Section 5: QR Code Color */}
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

          {/* Section 6: Scan Destination & Live Redirect Verification */}
          <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Phone Scan Redirect Active</span>
              </span>
              <a
                href={targetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] flex items-center gap-1 transition-transform active:scale-95"
              >
                <span>Test Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-xs font-mono font-bold text-emerald-950 truncate">
              {targetUrl}
            </p>
            <p className="text-[10px] text-emerald-700 font-medium">
              Scanning this QR code on any iPhone or Android camera instantly redirects straight to your live bio profile page.
            </p>
          </div>

          {/* Section 7: Bio URL Sharing */}
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
