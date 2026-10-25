'use client';

import React, { useState, useRef } from 'react';
import { NFCCardDesign, CardMaterial, CardSideMode, CardSideConfig } from '@/lib/types';
import { CARD_FONTS, CardFont } from '@/lib/cardFonts';
import { 
  CreditCard, 
  QrCode, 
  RefreshCw, 
  Check, 
  Truck, 
  ShieldCheck, 
  ShoppingBag, 
  X, 
  Upload, 
  Trash2, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Sliders, 
  Layers, 
  Copy, 
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import confetti from 'canvas-confetti';

interface NFCCardStudioProps {
  nfcCard: NFCCardDesign;
  username: string;
  onUpdateCard: (updated: NFCCardDesign) => void;
}

export default function NFCCardStudio({ nfcCard, username, onUpdateCard }: NFCCardStudioProps) {
  const { showToast } = useToast();
  const [flipped, setFlipped] = useState(false);
  const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
  const [material, setMaterial] = useState<CardMaterial>(nfcCard.material || 'matte_black');
  const [sideMode, setSideMode] = useState<CardSideMode>(nfcCard.sideMode || 'double_sided');
  const [redirectMode, setRedirectMode] = useState<'profile' | 'direct_vcard' | 'custom_url'>(nfcCard.redirectMode || 'profile');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [saveConfirmModalOpen, setSaveConfirmModalOpen] = useState(false);
  const [displayHost, setDisplayHost] = useState('tapping.bio');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardDragRef = useRef<{ isDragging: boolean; startX: number; startY: number; initPosX: number; initPosY: number }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    initPosX: 0,
    initPosY: 0,
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayHost(window.location.host);
    }
  }, []);

  // Front Side Config
  const [frontSide, setFrontSide] = useState<CardSideConfig>({
    artworkUrl: nfcCard.frontSide?.artworkUrl || '',
    artworkOpacity: nfcCard.frontSide?.artworkOpacity ?? 95,
    artworkZoom: nfcCard.frontSide?.artworkZoom ?? 100,
    artworkPosX: nfcCard.frontSide?.artworkPosX ?? 0,
    artworkPosY: nfcCard.frontSide?.artworkPosY ?? 0,
    fontFamily: nfcCard.frontSide?.fontFamily || "'Plus Jakarta Sans', sans-serif",
    brandPosition: nfcCard.frontSide?.brandPosition || 'top-left',
    namePosition: nfcCard.frontSide?.namePosition || 'bottom-left',
    chipPosition: nfcCard.frontSide?.chipPosition || 'top-right',
    qrPosition: nfcCard.frontSide?.qrPosition || 'bottom-right',
    primaryText: nfcCard.frontSide?.primaryText || nfcCard.engravedName || username.toUpperCase(),
    secondaryText: nfcCard.frontSide?.secondaryText || nfcCard.engravedTagline || 'DIGITAL CREATOR & FOUNDER',
    topLabel: nfcCard.frontSide?.topLabel || 'TAPPING',
    bottomLabel: nfcCard.frontSide?.bottomLabel || 'NFC 13.56MHz CONTACTLESS',
    showChip: nfcCard.frontSide?.showChip ?? true,
    showQrCode: nfcCard.frontSide?.showQrCode ?? false,
    textColor: nfcCard.frontSide?.textColor || '#FFFFFF',
    textAlign: nfcCard.frontSide?.textAlign || 'left',
    customNote: nfcCard.frontSide?.customNote || '',
  });

  // Back Side Config
  const [backSide, setBackSide] = useState<CardSideConfig>({
    artworkUrl: nfcCard.backSide?.artworkUrl || '',
    artworkOpacity: nfcCard.backSide?.artworkOpacity ?? 85,
    artworkZoom: nfcCard.backSide?.artworkZoom ?? 100,
    artworkPosX: nfcCard.backSide?.artworkPosX ?? 0,
    artworkPosY: nfcCard.backSide?.artworkPosY ?? 0,
    fontFamily: nfcCard.backSide?.fontFamily || "'Plus Jakarta Sans', sans-serif",
    brandPosition: nfcCard.backSide?.brandPosition || 'top-left',
    namePosition: nfcCard.backSide?.namePosition || 'bottom-left',
    chipPosition: nfcCard.backSide?.chipPosition || 'hidden',
    qrPosition: nfcCard.backSide?.qrPosition || 'bottom-right',
    primaryText: nfcCard.backSide?.primaryText || 'TAP ANY PHONE TO CONNECT',
    secondaryText: nfcCard.backSide?.secondaryText || `${displayHost}/${username}`,
    topLabel: nfcCard.backSide?.topLabel || 'TAPPING SMART CARD',
    bottomLabel: nfcCard.backSide?.bottomLabel || `UID: ${nfcCard.cardUid || 'TAP-9482-BLK'}`,
    showChip: nfcCard.backSide?.showChip ?? false,
    showQrCode: nfcCard.backSide?.showQrCode ?? true,
    textColor: nfcCard.backSide?.textColor || '#FFFFFF',
    textAlign: nfcCard.backSide?.textAlign || 'left',
    customNote: nfcCard.backSide?.customNote || 'Encrypted NTAG216 Chip',
  });

  const materials: { id: CardMaterial; name: string; class: string; desc: string; textDefault: string }[] = [
    {
      id: 'matte_black',
      name: 'Matte Stealth Black',
      class: 'metal-matte-black text-white',
      desc: 'Anodized aerospace matte black',
      textDefault: '#FFFFFF',
    },
    {
      id: 'brushed_gold',
      name: '24K Brushed Gold',
      class: 'metal-brushed-gold text-slate-900',
      desc: 'Brushed gold metallic finish',
      textDefault: '#1C1917',
    },
    {
      id: 'rose_gold',
      name: 'Rose Gold',
      class: 'metal-rose-gold text-slate-900',
      desc: 'Satin champagne rose alloy',
      textDefault: '#1C1917',
    },
    {
      id: 'titanium_silver',
      name: 'Titanium Silver',
      class: 'metal-titanium-silver text-slate-900',
      desc: 'Reflective silver brushed steel',
      textDefault: '#0F172A',
    },
  ];

  const currentMat = materials.find((m) => m.id === material) || materials[0];

  const currentConfig = activeSide === 'front' ? frontSide : backSide;
  const updateCurrentConfig = (partial: Partial<CardSideConfig>) => {
    if (activeSide === 'front') {
      setFrontSide((prev) => ({ ...prev, ...partial }));
    } else {
      setBackSide((prev) => ({ ...prev, ...partial }));
    }
  };

  const currentFontObj = CARD_FONTS.find((f) => f.family === currentConfig.fontFamily) || CARD_FONTS[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select a PNG, JPG, or SVG image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateCurrentConfig({ 
        artworkUrl: result, 
        artworkZoom: 100, 
        artworkPosX: 0, 
        artworkPosY: 0 
      });
      showToast('Custom Artwork Uploaded', `Applied to ${activeSide.toUpperCase()} side. You can drag and zoom it below!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Drag to reposition background artwork on the card
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!currentConfig.artworkUrl) return;
    cardDragRef.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      initPosX: currentConfig.artworkPosX ?? 0,
      initPosY: currentConfig.artworkPosY ?? 0,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardDragRef.current.isDragging) return;
    const dx = e.clientX - cardDragRef.current.startX;
    const dy = e.clientY - cardDragRef.current.startY;
    const newX = Math.max(-100, Math.min(100, cardDragRef.current.initPosX + Math.round(dx / 3)));
    const newY = Math.max(-100, Math.min(100, cardDragRef.current.initPosY + Math.round(dy / 3)));
    updateCurrentConfig({ artworkPosX: newX, artworkPosY: newY });
  };

  const handleMouseUp = () => {
    cardDragRef.current.isDragging = false;
  };

  const handleSaveDesign = () => {
    const updated: NFCCardDesign = {
      ...nfcCard,
      material,
      sideMode,
      frontSide,
      backSide,
      engravedName: frontSide.primaryText || nfcCard.engravedName,
      engravedTagline: frontSide.secondaryText || nfcCard.engravedTagline,
      redirectMode,
    };
    onUpdateCard(updated);
    setSaveConfirmModalOpen(true);
  };

  const handlePlaceOrder = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
    const updated: NFCCardDesign = {
      ...nfcCard,
      material,
      sideMode,
      frontSide,
      backSide,
      engravedName: frontSide.primaryText || nfcCard.engravedName,
      engravedTagline: frontSide.secondaryText || nfcCard.engravedTagline,
      orderStatus: 'in_production',
      trackingNumber: `TAP-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    onUpdateCard(updated);
    setOrderModalOpen(false);
    showToast('Order Placed Successfully', 'Your bespoke metal NFC card is queued for precision laser printing', 'success');
  };

  const flipCard = () => {
    const nextFlipped = !flipped;
    setFlipped(nextFlipped);
    setActiveSide(nextFlipped ? 'back' : 'front');
  };

  const selectSide = (side: 'front' | 'back') => {
    setActiveSide(side);
    setFlipped(side === 'back');
  };

  const categories = [
    'All',
    'Modern Sans',
    'Luxury Serif',
    'Comic & Pop',
    'Retro & 8-Bit',
    'Cyber & Sci-Fi',
    'Display & Heavy',
    'Script & Signature',
    'Brutalist & Urban',
  ];

  // Helper for brand "TAPPING" placement within 5mm safe boundary
  const getBrandPositionClass = (pos?: string) => {
    switch (pos) {
      case 'top-center': return 'top-0 left-1/2 -translate-x-1/2 text-center';
      case 'top-right': return 'top-0 right-0 text-right';
      case 'bottom-left': return 'bottom-0 left-0 text-left';
      case 'bottom-right': return 'bottom-0 right-0 text-right';
      default: return 'top-0 left-0 text-left';
    }
  };

  // Helper for chip position classes within 5mm safe boundary
  const getChipPositionClass = (pos?: string) => {
    switch (pos) {
      case 'top-left': return 'top-0 left-0';
      case 'bottom-right': return 'bottom-0 right-0';
      case 'bottom-left': return 'bottom-0 left-0';
      case 'hidden': return 'hidden';
      default: return 'top-0 right-0';
    }
  };

  // Helper for name & identity position classes within 5mm safe boundary
  const getNamePositionClass = (pos?: string) => {
    switch (pos) {
      case 'top-left': return 'top-7 left-0 text-left';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[90%]';
      case 'bottom-center': return 'bottom-0 left-1/2 -translate-x-1/2 text-center w-[90%]';
      case 'bottom-right': return 'bottom-0 right-0 text-right';
      default: return 'bottom-0 left-0 text-left';
    }
  };

  // Helper for QR code placement within 5mm safe boundary
  const getQrPositionClass = (pos?: string) => {
    switch (pos) {
      case 'top-right': return 'top-0 right-0';
      case 'top-left': return 'top-0 left-0';
      case 'bottom-left': return 'bottom-0 left-0';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default: return 'bottom-0 right-0';
    }
  };

  const [showSafeMarginGuide, setShowSafeMarginGuide] = useState(true);

  return (
    <div className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-none">
            Metal NFC Studio
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal/35 tracking-tight leading-none mt-1">
            Custom Hardware & Typography
          </h2>
          <p className="text-xs text-charcoal/60 mt-2 font-medium">
            Upload custom artwork with drag & zoom positioning, stylized fonts, and 5mm print-safe element placements.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <button
            onClick={flipCard}
            className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-white text-charcoal text-xs font-bold flex items-center gap-1.5 border border-black/10 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Flip Card ({flipped ? 'Back' : 'Front'})</span>
          </button>
          <button
            onClick={() => setOrderModalOpen(true)}
            className="px-5 py-2 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#FDF166]" />
            <span>Order Metal Card ($49)</span>
          </button>
        </div>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
        
        {/* Left Column: 3D Interactive Card Preview (STICKY ON SCROLL) */}
        <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-8 self-start flex flex-col items-center">
          
          {/* Side Mode Selector, Active Side Pills & Safe Margin Toggle */}
          <div className="w-full max-w-[390px] flex items-center justify-between mb-3 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FAF7F2] border border-black/10">
              <button
                type="button"
                onClick={() => selectSide('front')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeSide === 'front'
                    ? 'bg-[#4F83FF] text-white shadow-2xs'
                    : 'text-charcoal/70 hover:text-black'
                }`}
              >
                Front Side
              </button>
              <button
                type="button"
                onClick={() => selectSide('back')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeSide === 'back'
                    ? 'bg-[#4F83FF] text-white shadow-2xs'
                    : 'text-charcoal/70 hover:text-black'
                }`}
              >
                Back Side
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowSafeMarginGuide(!showSafeMarginGuide)}
              className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors cursor-pointer ${
                showSafeMarginGuide
                  ? 'bg-[#EFF4FF] border-[#4F83FF]/30 text-[#4F83FF]'
                  : 'bg-[#FAF7F2] border-black/10 text-charcoal/60'
              }`}
              title="Toggle 5mm safe print boundary guide"
            >
              5mm Safe Bleed: {showSafeMarginGuide ? 'ON' : 'OFF'}
            </button>

            <div className="flex items-center gap-1 text-[11px] font-bold text-charcoal/70">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{sideMode === 'single_sided' ? 'Single-Sided' : 'Dual-Sided'}</span>
            </div>
          </div>

          {/* 3D Interactive Flip Card Frame with Drag Pan Handler */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`perspective-1000 w-full max-w-[390px] h-[245px] relative select-none rounded-3xl ${
              currentConfig.artworkUrl ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
            }`}
            title={currentConfig.artworkUrl ? "Click to flip or drag image to reposition" : "Click to flip card"}
          >
            <div
              className={`w-full h-full preserve-3d transition-transform duration-700 relative rounded-3xl ${
                flipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* ===================== FRONT SIDE ===================== */}
              <div
                className={`absolute inset-0 backface-hidden rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-card border border-black/10 ${currentMat.class}`}
                style={{ fontFamily: frontSide.fontFamily || "'Plus Jakarta Sans', sans-serif" }}
              >
                {/* Custom Uploaded Artwork Layer with Drag & Zoom */}
                {frontSide.artworkUrl && (
                  <div 
                    className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform duration-75"
                    style={{ 
                      backgroundImage: `url(${frontSide.artworkUrl})`,
                      backgroundSize: `${frontSide.artworkZoom ?? 100}%`,
                      backgroundPosition: `calc(50% + ${frontSide.artworkPosX ?? 0}px) calc(50% + ${frontSide.artworkPosY ?? 0}px)`,
                      opacity: (frontSide.artworkOpacity ?? 95) / 100,
                    }}
                  />
                )}

                {/* Subtle Metallic Specular Sheen */}
                <div className="absolute inset-0 z-1 bg-gradient-to-tr from-white/10 via-transparent to-black/20 pointer-events-none" />

                {/* 5mm Safe Print Area Boundary Guide (18px Margin from Edges) */}
                {showSafeMarginGuide && (
                  <div className="absolute inset-[18px] border border-dashed border-white/20 rounded-2xl pointer-events-none z-20">
                    <span className="absolute top-1 right-2 text-[8px] font-mono opacity-40 uppercase tracking-widest text-white">
                      5mm Safe Print Zone
                    </span>
                  </div>
                )}

                {/* Content Elements Positioned Strictly within 5mm Safe Print Area */}
                <div className="absolute inset-[18px] z-10 pointer-events-none">
                  {/* Brand Label (TAPPING) */}
                  <div className={`absolute z-10 ${getBrandPositionClass(frontSide.brandPosition)}`}>
                    <span 
                      className="font-extrabold text-xs sm:text-sm tracking-widest uppercase block"
                      style={{ color: frontSide.textColor || '#FFFFFF' }}
                    >
                      {frontSide.topLabel || 'TAPPING'}
                    </span>
                    <span className="text-[9px] font-mono opacity-70 block">
                      {frontSide.bottomLabel || 'NFC 13.56MHz'}
                    </span>
                  </div>

                  {/* Chip Indicator */}
                  {frontSide.showChip !== false && (
                    <div className={`absolute z-10 ${getChipPositionClass(frontSide.chipPosition)}`}>
                      <div className="w-9 h-6 rounded-md bg-amber-400/90 border border-amber-600/50 flex flex-col justify-around p-1 shadow-2xs">
                        <div className="w-full h-0.5 bg-amber-800/40" />
                        <div className="w-full h-0.5 bg-amber-800/40" />
                      </div>
                    </div>
                  )}

                  {/* Primary Name & Tagline */}
                  <div className={`absolute z-10 ${getNamePositionClass(frontSide.namePosition)} max-w-[210px]`}>
                    <p className="text-[9px] tracking-widest uppercase opacity-80 truncate">
                      {frontSide.secondaryText || 'DIGITAL CREATOR & FOUNDER'}
                    </p>
                    <h3 
                      className="font-bold text-base md:text-lg tracking-widest mt-0.5 uppercase truncate"
                      style={{ color: frontSide.textColor || '#FFFFFF' }}
                    >
                      {frontSide.primaryText || username.toUpperCase()}
                    </h3>
                    <p className="text-[9px] opacity-80 mt-0.5 truncate">
                      {displayHost}/{username}
                    </p>
                  </div>

                  {/* Dynamic QR Code */}
                  {(sideMode === 'single_sided' || frontSide.showQrCode) && (
                    <div className={`absolute z-10 ${getQrPositionClass(frontSide.qrPosition)} w-14 h-14 bg-white p-1 rounded-xl shadow-md flex items-center justify-center`}>
                      <QrCode className="w-full h-full text-black" />
                    </div>
                  )}
                </div>
              </div>

              {/* ===================== BACK SIDE ===================== */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-card border border-black/10 ${currentMat.class}`}
                style={{ fontFamily: backSide.fontFamily || "'Plus Jakarta Sans', sans-serif" }}
              >
                {/* Custom Uploaded Artwork Layer (Back) with Drag & Zoom */}
                {backSide.artworkUrl && (
                  <div 
                    className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform duration-75"
                    style={{ 
                      backgroundImage: `url(${backSide.artworkUrl})`,
                      backgroundSize: `${backSide.artworkZoom ?? 100}%`,
                      backgroundPosition: `calc(50% + ${backSide.artworkPosX ?? 0}px) calc(50% + ${backSide.artworkPosY ?? 0}px)`,
                      opacity: (backSide.artworkOpacity ?? 85) / 100,
                    }}
                  />
                )}

                <div className="absolute inset-0 z-1 bg-gradient-to-bl from-white/10 via-transparent to-black/25 pointer-events-none" />

                {/* 5mm Safe Print Area Boundary Guide (Back) */}
                {showSafeMarginGuide && (
                  <div className="absolute inset-[18px] border border-dashed border-white/20 rounded-2xl pointer-events-none z-20">
                    <span className="absolute top-1 right-2 text-[8px] font-mono opacity-40 uppercase tracking-widest text-white">
                      5mm Safe Print Zone
                    </span>
                  </div>
                )}

                <div className="absolute inset-[18px] z-10 pointer-events-none">
                  {sideMode === 'single_sided' ? (
                    /* Single-Sided: Pristine Minimalist Reverse */
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <span 
                        className="font-extrabold text-sm tracking-widest uppercase"
                        style={{ color: backSide.textColor || '#FFFFFF' }}
                      >
                        {backSide.topLabel || 'TAPPING'}
                      </span>
                      <p className="text-[10px] font-mono opacity-70 mt-1">
                        PRECISION MILLED CONTACTLESS HARDWARE
                      </p>
                      <div className="mt-3 text-[9px] font-mono opacity-50">
                        UID: {nfcCard.cardUid || 'TAP-9482-BLK'} &bull; NTAG216
                      </div>
                    </div>
                  ) : (
                    /* Dual-Sided Back with QR & Connection details strictly within 5mm zone */
                    <div className="flex items-center justify-between h-full">
                      <div className="flex flex-col justify-between h-full min-w-0 pr-4">
                        <div>
                          <span 
                            className="font-bold text-xs uppercase tracking-wider block"
                            style={{ color: backSide.textColor || '#FFFFFF' }}
                          >
                            {backSide.primaryText || 'TAP ANY PHONE TO CONNECT'}
                          </span>
                          <p className="text-xs mt-1.5 opacity-90 truncate">
                            {backSide.secondaryText || `${displayHost}/${username}`}
                          </p>
                        </div>

                        <div className="text-[10px] font-mono opacity-70">
                          {backSide.bottomLabel || `UID: ${nfcCard.cardUid || 'TAP-9482-BLK'}`}
                          <br />
                          {backSide.customNote || 'Encrypted NTAG216 Chip'}
                        </div>
                      </div>

                      {backSide.showQrCode && (
                        <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                          <QrCode className="w-full h-full text-black" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Drag & Zoom Instructions */}
          <p className="text-[11px] text-charcoal/60 mt-2 font-medium flex items-center gap-1.5">
            <Move className="w-3 h-3 text-[#4F83FF]" />
            <span>{currentConfig.artworkUrl ? 'Click & drag card to pan picture position' : 'Click card to flip between front & back'}</span>
          </p>

          {/* Artwork Drag Pan & Zoom Controls Bar (Visible when image uploaded) */}
          {currentConfig.artworkUrl && (
            <div className="w-full max-w-[390px] mt-3 p-3 rounded-2xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-charcoal flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-[#4F83FF]" />
                  <span>Zoom Picture: {currentConfig.artworkZoom ?? 100}%</span>
                </span>
                <button
                  type="button"
                  onClick={() => updateCurrentConfig({ artworkZoom: 100, artworkPosX: 0, artworkPosY: 0 })}
                  className="text-[10px] font-bold text-charcoal/60 hover:text-black underline cursor-pointer"
                >
                  Reset Fit
                </button>
              </div>

              <input
                type="range"
                min="50"
                max="250"
                value={currentConfig.artworkZoom ?? 100}
                onChange={(e) => updateCurrentConfig({ artworkZoom: Number(e.target.value) })}
                className="w-full accent-black cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[10px] font-bold text-charcoal/60 block mb-0.5">Pan X: {currentConfig.artworkPosX ?? 0}px</span>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    value={currentConfig.artworkPosX ?? 0}
                    onChange={(e) => updateCurrentConfig({ artworkPosX: Number(e.target.value) })}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-charcoal/60 block mb-0.5">Pan Y: {currentConfig.artworkPosY ?? 0}px</span>
                  <input
                    type="range"
                    min="-80"
                    max="80"
                    value={currentConfig.artworkPosY ?? 0}
                    onChange={(e) => updateCurrentConfig({ artworkPosY: Number(e.target.value) })}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Production Status Pill */}
          <div className="w-full max-w-[390px] mt-4 p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#B6F554] flex items-center justify-center">
                <Truck className="w-4 h-4 text-charcoal" />
              </div>
              <div>
                <p className="font-bold text-charcoal">Status: Ready for Laser Milled Queue</p>
                <p className="text-[10px] text-charcoal/60 font-mono">{nfcCard.trackingNumber || 'TAP-TRK-78401'}</p>
              </div>
            </div>
            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#FDF166] text-charcoal border border-black/10 shadow-2xs">
              Milling Ready
            </span>
          </div>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-5 text-left text-xs">
          
          {/* Section 1: Side Configuration Mode (Single-Sided vs Dual-Sided) */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-2.5">
            <label className="font-black text-charcoal uppercase tracking-wider block">
              Card Architecture Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setSideMode('double_sided');
                  showToast('Dual-Sided Mode', 'Design front and back independently', 'info');
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  sideMode === 'double_sided'
                    ? 'bg-[#141518] text-white border-black shadow-xs'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
              >
                <p className="font-black text-xs">Dual-Sided Design</p>
                <p className="text-[10px] opacity-70 mt-0.5">Customize Front & Back separately</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSideMode('single_sided');
                  showToast('Single-Sided Mode', 'All data & QR placed together on one side', 'info');
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  sideMode === 'single_sided'
                    ? 'bg-[#141518] text-white border-black shadow-xs'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
              >
                <p className="font-black text-xs">Single-Sided (All Data)</p>
                <p className="text-[10px] opacity-70 mt-0.5">Name, QR, and chip on 1 side; clean back</p>
              </button>
            </div>
          </div>

          {/* Section 2: 100+ Card Fonts Dropdown / Modal Selector */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-black text-charcoal uppercase tracking-wider block">
                  Card Typography Font (100 Styles)
                </label>
                <p className="text-[11px] text-charcoal/60">
                  Every font renders in its own font style so you can preview it immediately
                </p>
              </div>

              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white border border-black/10">
                {currentFontObj.category}
              </span>
            </div>

            {/* In-Page Dropdown Selector (No Screen-Covering Modal) */}
            <div className="relative">
              <select
                value={currentConfig.fontFamily || "'Plus Jakarta Sans', sans-serif"}
                onChange={(e) => {
                  updateCurrentConfig({ fontFamily: e.target.value });
                  const selectedFont = CARD_FONTS.find(f => f.family === e.target.value);
                  if (selectedFont) {
                    showToast('Font Applied', `${selectedFont.name} applied to card`, 'success');
                  }
                }}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-black/10 font-bold text-xs text-charcoal appearance-none focus:outline-none focus:ring-2 focus:ring-[#4F83FF]/30 cursor-pointer shadow-2xs pr-10"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <optgroup key={cat} label={`── ${cat} ──`}>
                    {CARD_FONTS.filter(f => f.category === cat).map(font => (
                      <option key={font.id} value={font.family}>
                        {font.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-charcoal/50 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Live Typography Preview Strip */}
            <div className="p-2.5 rounded-xl bg-white border border-black/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-charcoal/50">Current:</span>
              <span className="text-sm font-black text-charcoal truncate" style={{ fontFamily: currentConfig.fontFamily }}>
                {currentConfig.primaryText || 'ALEX MORGAN'} &bull; {currentConfig.topLabel || 'TAPPING'}
              </span>
            </div>
          </div>

          {/* Section 3: Element Positions (Brand "TAPPING", Name, QR, Chip Placement) */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3">
            <label className="font-black text-charcoal uppercase tracking-wider block">
              Element Placement on Card (5mm Safe Zone)
            </label>

            {/* Brand "TAPPING" Position */}
            <div>
              <span className="text-[11px] font-bold text-charcoal/70 block mb-1">
                Brand Name &ldquo;TAPPING&rdquo; Position
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {[
                  { id: 'top-left', label: 'Top Left' },
                  { id: 'top-center', label: 'Top Center' },
                  { id: 'top-right', label: 'Top Right' },
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'bottom-right', label: 'Bottom Right' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => updateCurrentConfig({ brandPosition: pos.id as any })}
                    className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                      currentConfig.brandPosition === pos.id
                        ? 'bg-[#4F83FF] text-white border-[#4F83FF] shadow-2xs'
                        : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Tagline Position */}
            <div>
              <span className="text-[11px] font-bold text-charcoal/70 block mb-1">
                Engraved Name &amp; Title Position
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'bottom-center', label: 'Bottom Center' },
                  { id: 'center', label: 'Center Card' },
                  { id: 'top-left', label: 'Top Left' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => updateCurrentConfig({ namePosition: pos.id as any })}
                    className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                      currentConfig.namePosition === pos.id
                        ? 'bg-[#4F83FF] text-white border-[#4F83FF] shadow-2xs'
                        : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic QR Code Position */}
            <div>
              <span className="text-[11px] font-bold text-charcoal/70 block mb-1">
                Dynamic QR Code Position
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {[
                  { id: 'bottom-right', label: 'Bottom Right' },
                  { id: 'top-right', label: 'Top Right' },
                  { id: 'bottom-left', label: 'Bottom Left' },
                  { id: 'center', label: 'Center Card' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => updateCurrentConfig({ qrPosition: pos.id as any })}
                    className={`py-1.5 px-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                      currentConfig.qrPosition === pos.id
                        ? 'bg-[#4F83FF] text-white border-[#4F83FF] shadow-2xs'
                        : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Metal Alloy Finish */}
          <div>
            <label className="font-black text-charcoal uppercase tracking-wider block mb-2">
              Select Metal Alloy Finish
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {materials.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => {
                    setMaterial(mat.id);
                    if (mat.id === 'matte_black') {
                      updateCurrentConfig({ textColor: '#FFFFFF' });
                    } else {
                      updateCurrentConfig({ textColor: '#141518' });
                    }
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    material === mat.id
                      ? 'border-charcoal bg-black/5 ring-2 ring-charcoal shadow-xs'
                      : 'border-black/10 bg-white hover:bg-gray-50'
                  }`}
                >
                  <p className="font-black text-charcoal text-xs">{mat.name}</p>
                  <p className="text-[10px] text-charcoal/60 mt-0.5">{mat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Upload Custom Artwork to Current Side */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-black text-charcoal uppercase tracking-wider block">
                  Upload Custom Artwork ({activeSide.toUpperCase()} Side)
                </label>
                <p className="text-[11px] text-charcoal/60">
                  Upload any photo, sketch, logo or graphic. Drag and zoom directly on the card!
                </p>
              </div>

              {currentConfig.artworkUrl && (
                <button
                  onClick={() => updateCurrentConfig({ artworkUrl: '' })}
                  className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-[10px] font-black flex items-center gap-1 border border-rose-200 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-gray-50 border border-black/10 font-black text-xs text-charcoal flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4 text-[#4F83FF]" />
              <span>Upload Picture / Logo (PNG/JPG/SVG)</span>
            </button>
          </div>

          {/* Section 6: Laser Engraved Text on Current Side */}
          <div className="space-y-3">
            <h4 className="font-black text-charcoal uppercase tracking-wider text-xs">
              Laser Engraving & Text ({activeSide.toUpperCase()} Side)
            </h4>

            <div>
              <label className="font-bold text-charcoal/70 block mb-1 text-[11px]">
                Brand Label
              </label>
              <input
                type="text"
                value={currentConfig.topLabel || ''}
                onChange={(e) => updateCurrentConfig({ topLabel: e.target.value.toUpperCase() })}
                placeholder="TAPPING"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-bold text-xs"
                style={{ fontFamily: currentConfig.fontFamily }}
              />
            </div>

            <div>
              <label className="font-bold text-charcoal/70 block mb-1 text-[11px]">
                Primary Name or Main Heading
              </label>
              <input
                type="text"
                value={currentConfig.primaryText || ''}
                onChange={(e) => updateCurrentConfig({ primaryText: e.target.value.toUpperCase() })}
                placeholder="YOUR NAME"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-bold text-xs"
                style={{ fontFamily: currentConfig.fontFamily }}
              />
            </div>

            <div>
              <label className="font-bold text-charcoal/70 block mb-1 text-[11px]">
                Tagline, Role, or Title
              </label>
              <input
                type="text"
                value={currentConfig.secondaryText || ''}
                onChange={(e) => updateCurrentConfig({ secondaryText: e.target.value.toUpperCase() })}
                placeholder="FOUNDER & DESIGNER"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black text-xs"
                style={{ fontFamily: currentConfig.fontFamily }}
              />
            </div>

            {/* Laser Contrast Colors */}
            <div>
              <label className="font-bold text-charcoal/70 block mb-1 text-[11px]">
                Laser Contrast Color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { name: 'Pure White', hex: '#FFFFFF' },
                  { name: 'Charcoal Black', hex: '#141518' },
                  { name: 'Brushed Gold', hex: '#FACC15' },
                  { name: 'Electric Cyan', hex: '#38BDF8' },
                  { name: 'Soft Rose', hex: '#F472B6' },
                  { name: 'Neon Amber', hex: '#F59E0B' },
                ].map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => updateCurrentConfig({ textColor: c.hex })}
                    className={`w-7 h-7 rounded-full border border-black/20 flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                      currentConfig.textColor === c.hex ? 'ring-2 ring-charcoal scale-110' : ''
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {currentConfig.textColor === c.hex && (
                      <Check className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save Blueprint Action */}
          <button
            onClick={handleSaveDesign}
            className="w-full py-3.5 px-4 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 mt-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#FDF166]" />
            <span>Save Custom Card Blueprint</span>
          </button>
        </div>
      </div>

      {/* THEME-BASED SAVE CONFIRMATION POPUP */}
      {saveConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-sm w-full text-center border-2 border-black shadow-card animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-[#FDF166] border-2 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center mx-auto mb-3">
              <Check className="w-7 h-7 text-black stroke-[3]" />
            </div>

            <h3 className="text-xl font-black text-charcoal">
              Card Blueprint Saved!
            </h3>
            <p className="text-xs text-charcoal/70 mt-1 font-medium">
              Your custom artwork, laser font, and element placements are preserved and synced with your live profile.
            </p>

            <div className="my-4 p-3 bg-[#FAF7F2] rounded-2xl border border-black/10 text-left text-xs font-mono">
              <p className="text-charcoal/50 text-[10px] uppercase font-bold">Profile Live URL</p>
              <p className="font-black text-charcoal truncate mt-0.5">{displayHost}/{username}</p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`http://${displayHost}/${username}`);
                  showToast('Link Copied', 'Public URL copied to clipboard', 'success');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-gray-100 border border-black/10 text-xs font-bold text-charcoal flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Link</span>
              </button>

              <button
                type="button"
                onClick={() => setSaveConfirmModalOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black shadow-xs cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 max-w-md w-full border border-black/10 shadow-float text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-charcoal" />
                <h3 className="font-black text-sm text-charcoal">Checkout Custom Metal NFC Card</h3>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-charcoal/60 hover:text-charcoal p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3.5 bg-[#FAF7F2] rounded-2xl flex justify-between items-center border border-black/5">
                <div>
                  <p className="font-black text-charcoal">{currentMat.name}</p>
                  <p className="text-[11px] text-charcoal/60 font-medium">
                    Laser Engraved: {frontSide.primaryText || username.toUpperCase()}
                  </p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                    {sideMode === 'single_sided' ? 'Single-Sided Precision Print' : 'Dual-Sided Precision Print'}
                  </p>
                </div>
                <span className="font-black text-sm text-charcoal">$49.00</span>
              </div>

              <div className="space-y-1.5 text-charcoal/80 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$49.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Worldwide Tracked Shipping</span>
                  <span className="text-emerald-600 font-bold">Included</span>
                </div>
                <div className="flex justify-between font-black text-charcoal text-sm pt-2 border-t border-black/5">
                  <span>Total</span>
                  <span>$49.00</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#EFF4FF] border border-[#4F83FF]/20 flex items-center gap-2 text-[11px] text-charcoal font-medium">
                <ShieldCheck className="w-4 h-4 text-[#4F83FF] shrink-0" />
                <span>Protected with Razorpay Secure Checkout and Lifetime NFC Microchip Warranty</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setOrderModalOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-2 py-2.5 px-6 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <span>Pay $49 with Razorpay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
