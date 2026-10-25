'use client';

import React, { useState, useRef } from 'react';
import { NFCCardDesign, CardMaterial, CardSideMode, CardSideConfig } from '@/lib/types';
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
  Image as ImageIcon, 
  Trash2, 
  Layers, 
  Sliders, 
  Type, 
  Palette,
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
  const [displayHost, setDisplayHost] = useState('tapping.bio');

  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayHost(window.location.host);
    }
  }, []);

  // Front Side Config
  const [frontSide, setFrontSide] = useState<CardSideConfig>({
    artworkUrl: nfcCard.frontSide?.artworkUrl || '',
    artworkOpacity: nfcCard.frontSide?.artworkOpacity ?? 90,
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
    artworkOpacity: nfcCard.backSide?.artworkOpacity ?? 80,
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

  // Curated Artwork Presets for Instant Design
  const artworkPresets = [
    {
      id: 'comic-pop',
      name: 'Comic Pop Halftone',
      url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'retro-grid',
      name: 'Retro 8-Bit Synthwave',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'cyber-circuit',
      name: 'Cyberpunk Neon Matrix',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'dark-marble',
      name: 'Black Marble Gold Veins',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'japanese-wave',
      name: 'Japanese Geometric Wave',
      url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const currentConfig = activeSide === 'front' ? frontSide : backSide;
  const updateCurrentConfig = (partial: Partial<CardSideConfig>) => {
    if (activeSide === 'front') {
      setFrontSide((prev) => ({ ...prev, ...partial }));
    } else {
      setBackSide((prev) => ({ ...prev, ...partial }));
    }
  };

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
      updateCurrentConfig({ artworkUrl: result });
      showToast('Custom Artwork Uploaded', `Applied to ${activeSide.toUpperCase()} side`, 'success');
    };
    reader.readAsDataURL(file);
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
    showToast('Card Design Saved', 'Custom artwork and laser blueprint updated', 'success');
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

  return (
    <div className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-black/5">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-none">
            Metal NFC Studio
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal/35 tracking-tight leading-none mt-1">
            Custom Hardware Design
          </h2>
          <p className="text-xs text-charcoal/60 mt-2 font-medium">
            Upload custom artwork, design each side independently, or place all data on a single side.
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
        
        {/* Left Column: 3D Interactive Card Preview with Custom Uploaded Artwork (Sticky on Scroll) */}
        <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-8 self-start flex flex-col items-center">
          
          {/* Side Mode Selector & Active Side Pills */}
          <div className="w-full max-w-[390px] flex items-center justify-between mb-3 text-xs">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#FAF7F2] border border-black/10">
              <button
                type="button"
                onClick={() => selectSide('front')}
                className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activeSide === 'front'
                    ? 'bg-[#141518] text-white shadow-2xs'
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
                    ? 'bg-[#141518] text-white shadow-2xs'
                    : 'text-charcoal/70 hover:text-black'
                }`}
              >
                Back Side
              </button>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-charcoal/70">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{sideMode === 'single_sided' ? 'Single-Sided' : 'Dual-Sided'}</span>
            </div>
          </div>

          {/* 3D Interactive Flip Card Frame */}
          <div
            onClick={flipCard}
            className="perspective-1000 w-full max-w-[390px] h-[245px] cursor-pointer relative select-none"
            title="Click card to flip between Front and Back"
          >
            <div
              className={`w-full h-full preserve-3d transition-transform duration-700 relative rounded-3xl ${
                flipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* ===================== FRONT SIDE ===================== */}
              <div
                className={`absolute inset-0 backface-hidden rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-card border border-black/10 ${currentMat.class}`}
              >
                {/* Custom Uploaded Artwork Layer */}
                {frontSide.artworkUrl && (
                  <div 
                    className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
                    style={{ 
                      backgroundImage: `url(${frontSide.artworkUrl})`,
                      opacity: (frontSide.artworkOpacity ?? 90) / 100,
                    }}
                  />
                )}

                {/* Subtle Metallic Specular Sheen Overlay */}
                <div className="absolute inset-0 z-1 bg-gradient-to-tr from-white/10 via-transparent to-black/20 pointer-events-none" />

                {/* SINGLE-SIDED MODE (Entire Data on Front Side) */}
                {sideMode === 'single_sided' ? (
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Top Row: Brand & Chip */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="font-extrabold text-xs tracking-widest uppercase"
                          style={{ color: frontSide.textColor || '#FFFFFF' }}
                        >
                          {frontSide.topLabel || 'TAPPING'}
                        </span>
                        <span className="text-[9px] font-mono opacity-70">NFC 13.56MHz</span>
                      </div>
                      <div className="w-9 h-6 rounded-md bg-amber-400/90 border border-amber-600/50 flex flex-col justify-around p-1 shadow-2xs">
                        <div className="w-full h-0.5 bg-amber-800/40" />
                        <div className="w-full h-0.5 bg-amber-800/40" />
                      </div>
                    </div>

                    {/* Middle / Bottom Content: Full Identity + QR Code Compact Stack */}
                    <div className="flex items-end justify-between gap-3 mt-auto">
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[9px] tracking-widest uppercase opacity-80 truncate">
                          {frontSide.secondaryText || 'DIGITAL CREATOR & FOUNDER'}
                        </p>
                        <h3 
                          className="font-mono font-bold text-base md:text-lg tracking-widest mt-0.5 uppercase truncate"
                          style={{ color: frontSide.textColor || '#FFFFFF' }}
                        >
                          {frontSide.primaryText || username.toUpperCase()}
                        </h3>
                        <p className="text-[9px] font-mono opacity-80 mt-1 truncate">
                          {displayHost}/{username}
                        </p>
                      </div>

                      {/* Integrated Permanent Vector QR Code on Front */}
                      <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shrink-0 shadow-md">
                        <QrCode className="w-full h-full text-black" />
                      </div>
                    </div>
                  </div>
                ) : (
                  /* DUAL-SIDED MODE: Front Side (Clean Hero Identity) */
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Top Row: Brand + Microchip */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="font-extrabold text-sm tracking-widest uppercase"
                          style={{ color: frontSide.textColor || '#FFFFFF' }}
                        >
                          {frontSide.topLabel || 'TAPPING'}
                        </span>
                        <span className="text-[9px] font-mono opacity-70">
                          {frontSide.bottomLabel || 'NFC 13.56MHz'}
                        </span>
                      </div>
                      {frontSide.showChip && (
                        <div className="w-10 h-7 rounded-md bg-amber-400/90 border border-amber-600/50 flex flex-col justify-around p-1 shadow-2xs">
                          <div className="w-full h-0.5 bg-amber-800/40" />
                          <div className="w-full h-0.5 bg-amber-800/40" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Identity */}
                    <div>
                      <p className="font-mono text-[10px] tracking-widest uppercase opacity-80">
                        {frontSide.secondaryText || 'DIGITAL CREATOR & FOUNDER'}
                      </p>
                      <h3 
                        className="font-mono font-bold text-lg md:text-xl tracking-widest mt-1 uppercase"
                        style={{ color: frontSide.textColor || '#FFFFFF' }}
                      >
                        {frontSide.primaryText || username.toUpperCase()}
                      </h3>
                      {frontSide.customNote && (
                        <p className="text-[9px] font-mono opacity-75 mt-1.5 uppercase">
                          {frontSide.customNote}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ===================== BACK SIDE ===================== */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-card border border-black/10 ${currentMat.class}`}
              >
                {/* Custom Uploaded Artwork Layer (Back) */}
                {backSide.artworkUrl && (
                  <div 
                    className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none transition-opacity duration-300"
                    style={{ 
                      backgroundImage: `url(${backSide.artworkUrl})`,
                      opacity: (backSide.artworkOpacity ?? 80) / 100,
                    }}
                  />
                )}

                {/* Specular Sheen */}
                <div className="absolute inset-0 z-1 bg-gradient-to-bl from-white/10 via-transparent to-black/25 pointer-events-none" />

                {/* If Single-Sided: Back side is pristine brushed metal with minimalist centered mark */}
                {sideMode === 'single_sided' ? (
                  <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
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
                  /* Dual Sided Back */
                  <div className="relative z-10 flex items-center justify-between h-full">
                    <div className="flex flex-col justify-between h-full min-w-0 pr-4">
                      <div>
                        <span 
                          className="font-bold text-xs uppercase tracking-wider block"
                          style={{ color: backSide.textColor || '#FFFFFF' }}
                        >
                          {backSide.primaryText || 'TAP ANY PHONE TO CONNECT'}
                        </span>
                        <p className="font-mono text-xs mt-1.5 opacity-90 truncate">
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
                      <div className="w-20 h-20 bg-white p-1.5 rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                        <QrCode className="w-full h-full text-black" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-[11px] text-charcoal/60 mt-3 font-medium">
            Click card to flip between front and back views
          </p>

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

        {/* Right Column: Comprehensive Customization Controls */}
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

          {/* Section 2: Metal Alloy Finish */}
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
                    // Adjust text color default if not explicitly customized
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

          {/* Section 3: Upload Custom Artwork to Current Side */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-black text-charcoal uppercase tracking-wider block">
                  Upload Custom Artwork ({activeSide.toUpperCase()} Side)
                </label>
                <p className="text-[11px] text-charcoal/60">
                  Upload any photo, sketch, logo or graphic to imprint on this side
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

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Upload Button & Artwork Presets */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-white hover:bg-gray-50 border border-black/10 font-black text-xs text-charcoal flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-[#4F83FF]" />
                <span>Upload From Device (PNG/JPG)</span>
              </button>
            </div>

            {/* Curated Presets Bar */}
            <div>
              <p className="text-[10px] font-black uppercase text-charcoal/50 mb-1.5">
                Or pick a curated artwork preset:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {artworkPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      updateCurrentConfig({ artworkUrl: preset.url });
                      showToast('Artwork Applied', `Applied ${preset.name}`, 'info');
                    }}
                    className="p-1.5 rounded-xl border border-black/10 bg-white hover:bg-gray-50 text-left text-[10px] font-bold text-charcoal truncate shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="w-4 h-4 rounded-md bg-cover bg-center shrink-0" style={{ backgroundImage: `url(${preset.url})` }} />
                    <span className="truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Artwork Opacity Slider */}
            {currentConfig.artworkUrl && (
              <div className="pt-2 border-t border-black/5">
                <div className="flex justify-between items-center mb-1 text-[11px] font-bold text-charcoal">
                  <span>Metallic Surface Blend / Opacity</span>
                  <span>{currentConfig.artworkOpacity ?? 90}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={currentConfig.artworkOpacity ?? 90}
                  onChange={(e) => updateCurrentConfig({ artworkOpacity: Number(e.target.value) })}
                  className="w-full accent-black cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Section 4: Laser Engraved Text & Data on Current Side */}
          <div className="space-y-3">
            <h4 className="font-black text-charcoal uppercase tracking-wider text-xs">
              Laser Engraving & Text ({activeSide.toUpperCase()} Side)
            </h4>

            {/* Top Brand / Header */}
            <div>
              <label className="font-bold text-charcoal/70 block mb-1 text-[11px]">
                Top Header / Brand Label
              </label>
              <input
                type="text"
                value={currentConfig.topLabel || ''}
                onChange={(e) => updateCurrentConfig({ topLabel: e.target.value.toUpperCase() })}
                placeholder="TAPPING"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-mono font-bold text-xs"
              />
            </div>

            {/* Primary Name / Title */}
            <div>
              <label className="font-bold text-charcoal/70 block mb-1 text-[11px]">
                Primary Name or Main Laser Heading
              </label>
              <input
                type="text"
                value={currentConfig.primaryText || ''}
                onChange={(e) => updateCurrentConfig({ primaryText: e.target.value.toUpperCase() })}
                placeholder="ALEX MORGAN"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-mono font-bold text-xs"
              />
            </div>

            {/* Tagline / Secondary Text */}
            <div>
              <label className="font-bold text-charcoal/70 block mb-1 text-[11px]">
                Tagline, Role, or Company
              </label>
              <input
                type="text"
                value={currentConfig.secondaryText || ''}
                onChange={(e) => updateCurrentConfig({ secondaryText: e.target.value.toUpperCase() })}
                placeholder="DESIGN DIRECTOR & SYSTEMS ARCHITECT"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-mono text-xs"
              />
            </div>

            {/* Bottom Label / Motto */}
            <div>
              <label className="font-bold text-charcoal/70 block mb-1 text-[11px]">
                Bottom Detail or Serial Number
              </label>
              <input
                type="text"
                value={currentConfig.bottomLabel || ''}
                onChange={(e) => updateCurrentConfig({ bottomLabel: e.target.value })}
                placeholder="NFC 13.56MHz Contactless"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-mono text-xs"
              />
            </div>

            {/* Laser Text Color Swatches */}
            <div>
              <label className="font-bold text-charcoal/70 block mb-1 text-[11px]">
                Laser Text Contrast Color
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

            {/* Toggles: QR Code & Chip Indicator */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => updateCurrentConfig({ showQrCode: !currentConfig.showQrCode })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer ${
                  currentConfig.showQrCode
                    ? 'bg-[#141518] text-white border-black'
                    : 'bg-white text-charcoal border-black/10'
                }`}
              >
                <span>QR Code</span>
                <span>{currentConfig.showQrCode ? 'Shown' : 'Hidden'}</span>
              </button>

              <button
                type="button"
                onClick={() => updateCurrentConfig({ showChip: !currentConfig.showChip })}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer ${
                  currentConfig.showChip
                    ? 'bg-[#141518] text-white border-black'
                    : 'bg-white text-charcoal border-black/10'
                }`}
              >
                <span>Chip Icon</span>
                <span>{currentConfig.showChip ? 'Shown' : 'Hidden'}</span>
              </button>
            </div>
          </div>

          {/* Section 5: NFC Hardware Tap Action */}
          <div>
            <label className="font-black text-charcoal uppercase tracking-wider block mb-1">
              When Someone Taps Your Card
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRedirectMode('profile')}
                className={`py-2.5 px-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                  redirectMode === 'profile'
                    ? 'bg-[#141518] text-white border-black shadow-2xs'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
              >
                Open Tapping Profile
              </button>
              <button
                type="button"
                onClick={() => setRedirectMode('direct_vcard')}
                className={`py-2.5 px-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
                  redirectMode === 'direct_vcard'
                    ? 'bg-[#141518] text-white border-black shadow-2xs'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
              >
                Instant vCard Save
              </button>
            </div>
          </div>

          {/* Save Blueprint Action */}
          <button
            onClick={handleSaveDesign}
            className="w-full py-3.5 px-4 rounded-full bg-[#141518] hover:bg-black text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 mt-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#FDF166]" />
            <span>Save Custom Card Blueprint</span>
          </button>
        </div>
      </div>

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
