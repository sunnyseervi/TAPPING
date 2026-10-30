'use client';

import React, { useState, useRef } from 'react';
import { NFCCardDesign, CardMaterial, CardSideMode, CardSideConfig, MetalCardOrder } from '@/lib/types';
import { CARD_FONTS, CardFont } from '@/lib/cardFonts';
import ColorChartPicker from '@/components/ui/ColorChartPicker';
import { 
  CreditCard, 
  QrCode, 
  RefreshCw, 
  Check, 
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
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Palette,
  Download
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import confetti from 'canvas-confetti';
import QRCodeGenerator from 'qrcode';
import { compressImageFile } from '@/lib/imageCompression';
import { exportCardAsPng, exportCardAsPdf, exportCardAsHtml } from '@/lib/cardExporter';
import { createMetalCardOrder } from '@/lib/storage';

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
  const [customCardColor, setCustomCardColor] = useState<string>(nfcCard.customColor || '#1E293B');
  const [sideMode, setSideMode] = useState<CardSideMode>(nfcCard.sideMode || 'double_sided');
  const [redirectMode, setRedirectMode] = useState<'profile' | 'direct_vcard' | 'custom_url'>(nfcCard.redirectMode || 'profile');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderStep, setOrderStep] = useState<'review' | 'delivery' | 'payment' | 'confirm_popup' | 'success'>('review');
  const [paymentMode, setPaymentMode] = useState<'UPI' | 'COD'>('UPI');
  const [placedOrder, setPlacedOrder] = useState<MetalCardOrder | null>(null);
  const [saveConfirmModalOpen, setSaveConfirmModalOpen] = useState(false);
  const [displayHost, setDisplayHost] = useState('tapping.bio');
  const [frontQrDataUrl, setFrontQrDataUrl] = useState('');
  const [backQrDataUrl, setBackQrDataUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const baseCardRef = useRef(nfcCard);
  const updateCardRef = useRef(onUpdateCard);

  // Export Dropdown State
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Order Details Form State
  const [shippingName, setShippingName] = useState(username ? username.toUpperCase() : 'CREATOR');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingEmail, setShippingEmail] = useState(username ? `${username}@tapping.bio` : '');
  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [engravingNotes, setEngravingNotes] = useState('');

  // Font Popover Dropdown Filter States
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const [fontSearch, setFontSearch] = useState('');
  const [fontCategory, setFontCategory] = useState('All');

  // Element Drag & Position States (Name, QR, Brand, Artwork)
  type DragTarget = 'name' | 'qr' | 'brand' | 'artwork';
  const [activeElement, setActiveElement] = useState<DragTarget | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragSessionRef = useRef<{
    isDragging: boolean;
    target: DragTarget | null;
    startX: number;
    startY: number;
    initX: number;
    initY: number;
    hasMoved: boolean;
  }>({
    isDragging: false,
    target: null,
    startX: 0,
    startY: 0,
    initX: 0,
    initY: 0,
    hasMoved: false,
  });

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayHost(window.location.host);
    }
  }, []);

  React.useEffect(() => {
    updateCardRef.current = onUpdateCard;
  }, [onUpdateCard]);

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
    primaryTextSize: nfcCard.frontSide?.primaryTextSize ?? 18,
    secondaryTextSize: nfcCard.frontSide?.secondaryTextSize ?? 9,
    brandSize: nfcCard.frontSide?.brandSize ?? 13,
    qrSize: nfcCard.frontSide?.qrSize ?? 56,
    nameOffsetX: nfcCard.frontSide?.nameOffsetX ?? 0,
    nameOffsetY: nfcCard.frontSide?.nameOffsetY ?? 0,
    secondaryOffsetX: nfcCard.frontSide?.secondaryOffsetX ?? 0,
    secondaryOffsetY: nfcCard.frontSide?.secondaryOffsetY ?? 0,
    qrOffsetX: nfcCard.frontSide?.qrOffsetX ?? 0,
    qrOffsetY: nfcCard.frontSide?.qrOffsetY ?? 0,
    brandOffsetX: nfcCard.frontSide?.brandOffsetX ?? 0,
    brandOffsetY: nfcCard.frontSide?.brandOffsetY ?? 0,
    bottomLabelOffsetX: nfcCard.frontSide?.bottomLabelOffsetX ?? 0,
    bottomLabelOffsetY: nfcCard.frontSide?.bottomLabelOffsetY ?? 0,
    primaryText: nfcCard.frontSide?.primaryText || nfcCard.engravedName || username.toUpperCase(),
    secondaryText: nfcCard.frontSide?.secondaryText || nfcCard.engravedTagline || 'DIGITAL CREATOR & FOUNDER',
    topLabel: nfcCard.frontSide?.topLabel || 'TAPPING',
    bottomLabel: nfcCard.frontSide?.bottomLabel || '',
    showChip: nfcCard.frontSide?.showChip ?? true,
    showQrCode: nfcCard.frontSide?.showQrCode ?? false,
    textColor: nfcCard.frontSide?.textColor || '#FFFFFF',
    qrColor: nfcCard.frontSide?.qrColor || nfcCard.frontSide?.textColor || '#FFFFFF',
    textAlign: nfcCard.frontSide?.textAlign || 'left',
    customNote: nfcCard.frontSide?.customNote || '',
    isPlain: nfcCard.frontSide?.isPlain ?? false,
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
    primaryTextSize: nfcCard.backSide?.primaryTextSize ?? 14,
    secondaryTextSize: nfcCard.backSide?.secondaryTextSize ?? 10,
    brandSize: nfcCard.backSide?.brandSize ?? 14,
    qrSize: nfcCard.backSide?.qrSize ?? 64,
    nameOffsetX: nfcCard.backSide?.nameOffsetX ?? 0,
    nameOffsetY: nfcCard.backSide?.nameOffsetY ?? 0,
    secondaryOffsetX: nfcCard.backSide?.secondaryOffsetX ?? 0,
    secondaryOffsetY: nfcCard.backSide?.secondaryOffsetY ?? 0,
    qrOffsetX: nfcCard.backSide?.qrOffsetX ?? 0,
    qrOffsetY: nfcCard.backSide?.qrOffsetY ?? 0,
    brandOffsetX: nfcCard.backSide?.brandOffsetX ?? 0,
    brandOffsetY: nfcCard.backSide?.brandOffsetY ?? 0,
    bottomLabelOffsetX: nfcCard.backSide?.bottomLabelOffsetX ?? 0,
    bottomLabelOffsetY: nfcCard.backSide?.bottomLabelOffsetY ?? 0,
    primaryText: nfcCard.backSide?.primaryText || 'TAP ANY PHONE TO CONNECT',
    secondaryText: nfcCard.backSide?.secondaryText || `${displayHost}/${username}`,
    topLabel: nfcCard.backSide?.topLabel || 'TAPPING',
    bottomLabel: nfcCard.backSide?.bottomLabel || (nfcCard.cardUid ? `UID: ${nfcCard.cardUid}` : ''),
    showChip: nfcCard.backSide?.showChip ?? false,
    showQrCode: nfcCard.backSide?.showQrCode ?? true,
    textColor: nfcCard.backSide?.textColor || '#FFFFFF',
    qrColor: nfcCard.backSide?.qrColor || nfcCard.backSide?.textColor || '#FFFFFF',
    textAlign: nfcCard.backSide?.textAlign || 'left',
    customNote: nfcCard.backSide?.customNote || '',
    isPlain: nfcCard.backSide?.isPlain ?? (nfcCard.sideMode === 'single_sided'),
  });

  const COLOR_SPECTRUM = [
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Ghost White', hex: '#F8FAFC' },
    { name: 'Brushed Silver', hex: '#E2E8F0' },
    { name: 'Titanium Grey', hex: '#94A3B8' },
    { name: 'Graphite', hex: '#475569' },
    { name: 'Charcoal Black', hex: '#141518' },
    { name: 'Obsidian', hex: '#000000' },
    { name: '24K Mirror Gold', hex: '#FFD700' },
    { name: 'Bright Brass', hex: '#FACC15' },
    { name: 'Champagne Gold', hex: '#F5E6C8' },
    { name: 'Rose Gold', hex: '#E0A899' },
    { name: 'Copper Bronze', hex: '#CD7F32' },
    { name: 'Electric Cobalt', hex: '#3B82F6' },
    { name: 'Sky Cyan', hex: '#38BDF8' },
    { name: 'Laser Turquoise', hex: '#14B8A6' },
    { name: 'Emerald Green', hex: '#10B981' },
    { name: 'Lime Glow', hex: '#84CC16' },
    { name: 'Neon Amber', hex: '#F59E0B' },
    { name: 'Sunset Coral', hex: '#F97316' },
    { name: 'Laser Crimson', hex: '#EF4444' },
    { name: 'Neon Pink', hex: '#EC4899' },
    { name: 'Ultra Violet', hex: '#8B5CF6' },
  ];

  function isColorDark(hex: string): boolean {
    if (!hex) return true;
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 160;
  }

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
    {
      id: 'custom_color',
      name: 'Custom Card Color',
      class: 'metal-custom-color',
      desc: 'Full spectral palette & color wheel',
      textDefault: '#FFFFFF',
    },
  ];

  const currentMat = materials.find((m) => m.id === material) || materials[0];

  const isBackPlain = backSide.isPlain ?? (sideMode === 'single_sided');
  const currentConfig = activeSide === 'front' ? frontSide : backSide;
  const updateCurrentConfig = (partial: Partial<CardSideConfig>) => {
    if (activeSide === 'front') {
      setFrontSide((prev) => ({ ...prev, ...partial }));
    } else {
      setBackSide((prev) => ({ ...prev, ...partial }));
    }
  };

  const currentFontObj = CARD_FONTS.find((f) => f.family === currentConfig.fontFamily) || CARD_FONTS[0];

  const filteredFonts = CARD_FONTS.filter((font) => {
    const matchCat = fontCategory === 'All' || font.category === fontCategory;
    const matchSearch =
      !fontSearch ||
      font.name.toLowerCase().includes(fontSearch.toLowerCase()) ||
      font.category.toLowerCase().includes(fontSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const nudgeOffset = (
    fieldX: 'nameOffsetX' | 'qrOffsetX' | 'brandOffsetX' | 'secondaryOffsetX' | 'bottomLabelOffsetX',
    fieldY: 'nameOffsetY' | 'qrOffsetY' | 'brandOffsetY' | 'secondaryOffsetY' | 'bottomLabelOffsetY',
    deltaX: number,
    deltaY: number
  ) => {
    const currentX = currentConfig[fieldX] ?? 0;
    const currentY = currentConfig[fieldY] ?? 0;
    const newX = Math.max(-48, Math.min(48, currentX + deltaX));
    const newY = Math.max(-36, Math.min(36, currentY + deltaY));
    updateCurrentConfig({ [fieldX]: newX, [fieldY]: newY });
  };

  const resetOffset = (
    fieldX: 'nameOffsetX' | 'qrOffsetX' | 'brandOffsetX' | 'secondaryOffsetX' | 'bottomLabelOffsetX',
    fieldY: 'nameOffsetY' | 'qrOffsetY' | 'brandOffsetY' | 'secondaryOffsetY' | 'bottomLabelOffsetY'
  ) => {
    updateCurrentConfig({ [fieldX]: 0, [fieldY]: 0 });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select a PNG, JPG, or SVG image file', 'error');
      return;
    }

    try {
      const result = await compressImageFile(file, { maxWidth: 1600, maxHeight: 1600, quality: 0.82 });
      updateCurrentConfig({ 
        artworkUrl: result.dataUrl,
        artworkZoom: 100, 
        artworkPosX: 0, 
        artworkPosY: 0 
      });
      showToast('Artwork Uploaded', `Artwork applied to ${activeSide} side`, 'success');
    } catch (error) {
      showToast('Artwork upload failed', error instanceof Error ? error.message : 'Please try another image.', 'error');
    }
  };

  // Unified Element & Artwork Drag Handler with Mouse & Touch support
  const startDrag = (e: React.MouseEvent | React.TouchEvent, target: DragTarget) => {
    e.stopPropagation();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    let initX = 0;
    let initY = 0;

    if (target === 'name') {
      initX = currentConfig.nameOffsetX ?? 0;
      initY = currentConfig.nameOffsetY ?? 0;
    } else if (target === 'qr') {
      initX = currentConfig.qrOffsetX ?? 0;
      initY = currentConfig.qrOffsetY ?? 0;
    } else if (target === 'brand') {
      initX = currentConfig.brandOffsetX ?? 0;
      initY = currentConfig.brandOffsetY ?? 0;
    } else if (target === 'artwork') {
      initX = currentConfig.artworkPosX ?? 0;
      initY = currentConfig.artworkPosY ?? 0;
    }

    dragSessionRef.current = {
      isDragging: true,
      target,
      startX: clientX,
      startY: clientY,
      initX,
      initY,
      hasMoved: false,
    };

    setActiveElement(target);
    setIsDragging(true);
  };

  // Global window listeners for ultra-smooth drag without boundary loss
  React.useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!dragSessionRef.current.isDragging || !dragSessionRef.current.target) return;
      const dx = clientX - dragSessionRef.current.startX;
      const dy = clientY - dragSessionRef.current.startY;

      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
        dragSessionRef.current.hasMoved = true;
      }

      const target = dragSessionRef.current.target;
      if (target === 'artwork') {
        const artX = Math.max(-40, Math.min(40, dragSessionRef.current.initX + Math.round(dx / 2)));
        const artY = Math.max(-30, Math.min(30, dragSessionRef.current.initY + Math.round(dy / 2)));
        updateCurrentConfig({ artworkPosX: artX, artworkPosY: artY });
      } else {
        const boundX = Math.max(-32, Math.min(32, dragSessionRef.current.initX + dx));
        const boundY = Math.max(-20, Math.min(20, dragSessionRef.current.initY + dy));

        if (target === 'name') {
          updateCurrentConfig({ nameOffsetX: Math.round(boundX), nameOffsetY: Math.round(boundY) });
        } else if (target === 'qr') {
          updateCurrentConfig({ qrOffsetX: Math.round(boundX), qrOffsetY: Math.round(boundY) });
        } else if (target === 'brand') {
          updateCurrentConfig({ brandOffsetX: Math.round(boundX), brandOffsetY: Math.round(boundY) });
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (dragSessionRef.current.isDragging) e.preventDefault();
      if (e.touches[0]) handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onEnd = () => {
      if (dragSessionRef.current.isDragging) {
        dragSessionRef.current.isDragging = false;
        setIsDragging(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [currentConfig]);

  React.useEffect(() => {
    const origin = typeof window === 'undefined' ? `https://${displayHost}` : window.location.origin;
    const target = redirectMode === 'direct_vcard' ? `${origin}/${username}?download=vcard` : `${origin}/${username}`;

    const frontColor = frontSide.qrColor || frontSide.textColor || '#FFFFFF';
    QRCodeGenerator.toDataURL(target, {
      width: 480,
      margin: 0,
      errorCorrectionLevel: 'M',
      color: {
        dark: frontColor,
        light: '#00000000',
      },
    }).then((url) => {
      setFrontQrDataUrl(url);
      if (activeSide === 'front') setQrDataUrl(url);
    }).catch(console.error);

    const backColor = backSide.qrColor || backSide.textColor || '#FFFFFF';
    QRCodeGenerator.toDataURL(target, {
      width: 480,
      margin: 0,
      errorCorrectionLevel: 'M',
      color: {
        dark: backColor,
        light: '#00000000',
      },
    }).then((url) => {
      setBackQrDataUrl(url);
      if (activeSide === 'back') setQrDataUrl(url);
    }).catch(console.error);
  }, [displayHost, redirectMode, username, activeSide, frontSide.qrColor, frontSide.textColor, backSide.qrColor, backSide.textColor]);

  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      updateCardRef.current({
        ...baseCardRef.current,
        material,
        customColor: material === 'custom_color' ? customCardColor : undefined,
        sideMode,
        frontSide,
        backSide,
        engravedName: frontSide.primaryText || baseCardRef.current.engravedName,
        engravedTagline: frontSide.secondaryText || baseCardRef.current.engravedTagline,
        redirectMode,
      });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [material, customCardColor, sideMode, frontSide, backSide, redirectMode]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (dragSessionRef.current.hasMoved) {
      dragSessionRef.current.hasMoved = false;
      return;
    }
    flipCard();
  };

  const handleSaveDesign = () => {
    const updated: NFCCardDesign = {
      ...nfcCard,
      material,
      customColor: material === 'custom_color' ? customCardColor : undefined,
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

  const handleDownloadPng = async () => {
    setIsExporting(true);
    showToast('Generating PNG...', 'Rendering 1024x648 high-res metal card', 'info');
    try {
      await exportCardAsPng({ ...nfcCard, customColor: customCardColor }, material, activeSide, username, displayHost);
      showToast('PNG Downloaded', 'Saved high-res image to your device', 'success');
    } catch {
      showToast('Export Failed', 'Could not generate card PNG', 'error');
    } finally {
      setIsExporting(false);
      setExportDropdownOpen(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    showToast('Generating Printable PDF...', 'Compiling ISO standard card blueprint', 'info');
    try {
      await exportCardAsPdf({ ...nfcCard, customColor: customCardColor }, material, activeSide, username, displayHost);
      showToast('PDF Exported', 'Print-ready vector PDF downloaded', 'success');
    } catch {
      showToast('Export Failed', 'Could not generate card PDF', 'error');
    } finally {
      setIsExporting(false);
      setExportDropdownOpen(false);
    }
  };

  const handleDownloadHtml = () => {
    try {
      exportCardAsHtml({ ...nfcCard, customColor: customCardColor }, material, activeSide, username, displayHost);
      showToast('Vector HTML / SVG Saved', 'Downloaded vector card blueprint', 'success');
    } catch {
      showToast('Export Failed', 'Could not generate HTML blueprint', 'error');
    } finally {
      setExportDropdownOpen(false);
    }
  };

  const handleFinalizeOrder = () => {
    confetti({
      particleCount: 160,
      spread: 95,
      origin: { y: 0.6 },
    });

    // Create real persistent order in storage/backend
    const newOrder = createMetalCardOrder({
      userId: 'usr_001',
      userName: shippingName || username.toUpperCase(),
      userEmail: shippingEmail || 'creator@tapping.bio',
      userPhone: shippingPhone,
      material,
      customColor: material === 'custom_color' ? customCardColor : undefined,
      sideMode,
      frontSide,
      backSide,
      engravedName: frontSide.primaryText || nfcCard.engravedName || username.toUpperCase(),
      engravedTagline: frontSide.secondaryText || nfcCard.engravedTagline || 'DIGITAL CREATOR & FOUNDER',
      qrUrl: `https://${displayHost}/${username}`,
      paymentMethod: paymentMode,
      notes: engravingNotes,
      shippingAddress: {
        name: shippingName || username.toUpperCase(),
        street: shippingStreet,
        city: shippingCity,
        state: shippingState,
        zip: shippingZip,
        country: 'India',
      },
      cardDesign: {
        ...nfcCard,
        material,
        customColor: material === 'custom_color' ? customCardColor : undefined,
        sideMode,
        frontSide,
        backSide,
        engravedName: frontSide.primaryText || nfcCard.engravedName || username.toUpperCase(),
        engravedTagline: frontSide.secondaryText || nfcCard.engravedTagline || 'DIGITAL CREATOR & FOUNDER',
        qrCodeEnabled: true,
        redirectMode,
        cardUid: nfcCard.cardUid || 'TAP-NFC-84920',
        orderStatus: 'in_production',
      },
    });

    setPlacedOrder(newOrder);

    const updated: NFCCardDesign = {
      ...nfcCard,
      material,
      customColor: material === 'custom_color' ? customCardColor : undefined,
      sideMode,
      frontSide,
      backSide,
      engravedName: frontSide.primaryText || nfcCard.engravedName,
      engravedTagline: frontSide.secondaryText || nfcCard.engravedTagline,
      orderStatus: 'in_production',
      trackingNumber: newOrder.trackingNumber,
    };
    onUpdateCard(updated);
    setOrderStep('success');

    showToast(
      'Order Confirmed!',
      `Order ${newOrder.orderNumber} placed via ${paymentMode === 'COD' ? 'Cash on Delivery' : 'UPI'}. Visible in Account & Orders.`,
      'success'
    );
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
            Upload custom artwork, adjust typography, and keep every element contained inside the card.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          {/* Download Blueprint Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-white text-charcoal text-xs font-bold flex items-center gap-1.5 border border-black/10 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#4F83FF]" />
              <span>Download Blueprint</span>
              <ChevronDown className="w-3 h-3 text-charcoal/60" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border border-black/10 shadow-float z-30 p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={isExporting}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-[#EFF4FF] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Image (PNG 4K)</span>
                  <span className="text-[10px] text-charcoal/40 font-mono">.png</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-[#EFF4FF] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Printable Vector PDF</span>
                  <span className="text-[10px] text-charcoal/40 font-mono">.pdf</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadHtml}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-charcoal hover:bg-[#EFF4FF] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Vector HTML / SVG</span>
                  <span className="text-[10px] text-charcoal/40 font-mono">.html</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={flipCard}
            className="px-4 py-2 rounded-full bg-[#FAF7F2] hover:bg-white text-charcoal text-xs font-bold flex items-center gap-1.5 border border-black/10 transition-colors shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Flip ({flipped ? 'Back' : 'Front'})</span>
          </button>

          <button
            onClick={() => {
              setOrderStep('review');
              setOrderModalOpen(true);
            }}
            className="px-4 py-2 rounded-full bg-[#B6F554] hover:bg-[#A6EC3C] text-charcoal text-xs font-black flex items-center gap-1.5 border border-black/10 shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-charcoal" />
            <span>Order Metal Card (₹1,499)</span>
          </button>

          <button
            onClick={handleSaveDesign}
            className="px-4 py-2 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 text-[#FDF166]" />
            <span>Save Blueprint</span>
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

            {/* Quick Plain Back Toggle when Back Side is Active */}
            {activeSide === 'back' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const newPlain = !isBackPlain;
                  setBackSide((prev) => ({ ...prev, isPlain: newPlain }));
                  showToast(
                    newPlain ? 'Plain Back Activated' : 'Laser Text Back Activated',
                    newPlain
                      ? 'Back side is now plain (pure design/artwork with zero text)'
                      : 'Back side text is now visible',
                    'info'
                  );
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isBackPlain
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
                title="Toggle plain clean back side (no text, markings or QR)"
              >
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Plain Back</span>
              </button>
            )}

            <div className="flex items-center gap-1 text-[11px] font-bold text-charcoal/70">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{sideMode === 'single_sided' ? 'Single-Sided' : 'Dual-Sided'}</span>
            </div>
          </div>

          {/* 3D Interactive Flip Card Frame with Drag Pan Handler & Click-to-Flip */}
          <div
            onClick={handleCardClick}
            onMouseDown={(e) => {
              if (currentConfig.artworkUrl) {
                startDrag(e, 'artwork');
              }
            }}
            onTouchStart={(e) => {
              if (currentConfig.artworkUrl) {
                startDrag(e, 'artwork');
              }
            }}
            className={`perspective-1000 w-full max-w-[390px] h-[245px] relative select-none rounded-3xl ${
              isDragging ? 'cursor-grabbing' : 'cursor-pointer'
            }`}
            title="Click empty card area to flip &bull; Drag Name, QR, or Brand to position"
          >
            <div
              className={`w-full h-full preserve-3d transition-transform duration-700 relative rounded-3xl ${
                flipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* ===================== FRONT SIDE ===================== */}
              <div
                className={`absolute inset-0 backface-hidden rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-card border border-black/10 ${material === 'custom_color' ? '' : currentMat.class}`}
                style={{ 
                  fontFamily: frontSide.fontFamily || "'Plus Jakarta Sans', sans-serif",
                  backgroundColor: material === 'custom_color' ? customCardColor : undefined,
                  color: material === 'custom_color' ? (isColorDark(customCardColor) ? '#FFFFFF' : '#141518') : undefined,
                }}
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

                {/* Content Elements Positioned Strictly within 5mm Safe Print Area */}
                <div className="absolute inset-[18px] z-10 pointer-events-none">
                  {/* Brand Label (TAPPING) — Directly Draggable with Mouse & Touch */}
                  <div 
                    onMouseDown={(e) => startDrag(e, 'brand')}
                    onTouchStart={(e) => startDrag(e, 'brand')}
                    onClick={(e) => { e.stopPropagation(); setActiveElement('brand'); }}
                    className={`absolute z-10 pointer-events-auto cursor-grab active:cursor-grabbing ${getBrandPositionClass(frontSide.brandPosition)} ${
                      activeElement === 'brand'
                        ? 'ring-1 ring-[#4F83FF] rounded-lg p-0.5 bg-black/20'
                        : 'hover:outline-1 hover:outline-dashed hover:outline-white/40 rounded-lg p-0.5'
                    }`}
                    style={{
                      transform: `translate(${frontSide.brandOffsetX || 0}px, ${frontSide.brandOffsetY || 0}px)`,
                    }}
                    title="Drag to reposition TAPPING brand"
                  >
                    <span 
                      className="font-extrabold tracking-widest uppercase block"
                      style={{ 
                        color: frontSide.textColor || '#FFFFFF',
                        fontSize: `${frontSide.brandSize || 13}px`,
                        lineHeight: 1.15
                      }}
                    >
                      {frontSide.topLabel || 'TAPPING'}
                    </span>
                    {frontSide.bottomLabel && !frontSide.bottomLabel.includes('13.56') && !frontSide.bottomLabel.includes('NFC') && (
                      <span 
                        className="font-mono opacity-70 block"
                        style={{ 
                          fontSize: `${Math.max(7, Math.round((frontSide.brandSize || 13) * 0.65))}px`,
                          color: frontSide.textColor || '#FFFFFF'
                        }}
                      >
                        {frontSide.bottomLabel}
                      </span>
                    )}
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

                  {/* Primary Name & Tagline — Directly Draggable with Mouse & Touch */}
                  <div 
                    onMouseDown={(e) => startDrag(e, 'name')}
                    onTouchStart={(e) => startDrag(e, 'name')}
                    onClick={(e) => { e.stopPropagation(); setActiveElement('name'); }}
                    className={`absolute z-10 pointer-events-auto cursor-grab active:cursor-grabbing ${getNamePositionClass(frontSide.namePosition)} max-w-[210px] ${
                      activeElement === 'name'
                        ? 'ring-1 ring-[#4F83FF] rounded-xl p-1 bg-black/20'
                        : 'hover:outline-1 hover:outline-dashed hover:outline-white/40 rounded-xl p-1'
                    }`}
                    style={{
                      transform: `translate(${frontSide.nameOffsetX || 0}px, ${frontSide.nameOffsetY || 0}px)`,
                    }}
                    title="Drag to reposition Name & Tagline"
                  >
                    <p 
                      className="tracking-widest uppercase opacity-80 truncate"
                      style={{ 
                        color: frontSide.textColor || '#FFFFFF',
                        fontSize: `${frontSide.secondaryTextSize || 9}px`,
                        lineHeight: 1.2,
                        transform: `translate(${frontSide.secondaryOffsetX || 0}px, ${frontSide.secondaryOffsetY || 0}px)`,
                      }}
                    >
                      {frontSide.secondaryText || 'DIGITAL CREATOR & FOUNDER'}
                    </p>
                    <h3 
                      className="font-bold tracking-widest mt-0.5 uppercase truncate"
                      style={{ 
                        color: frontSide.textColor || '#FFFFFF',
                        fontSize: `${frontSide.primaryTextSize || 18}px`,
                        lineHeight: 1.15
                      }}
                    >
                      {frontSide.primaryText || username.toUpperCase()}
                    </h3>
                    <p 
                      className="opacity-80 mt-0.5 truncate"
                      style={{ 
                        color: frontSide.textColor || '#FFFFFF',
                        fontSize: `${Math.max(7, Math.round((frontSide.secondaryTextSize || 9) * 0.9))}px`
                      }}
                    >
                      {displayHost}/{username}
                    </p>
                  </div>

                  {/* Dynamic QR Code — Directly Draggable with Mouse & Touch (Seamless Transparent) */}
                  {(sideMode === 'single_sided' || frontSide.showQrCode) && (
                    <div 
                      onMouseDown={(e) => startDrag(e, 'qr')}
                      onTouchStart={(e) => startDrag(e, 'qr')}
                      onClick={(e) => { e.stopPropagation(); setActiveElement('qr'); }}
                      className={`absolute z-10 pointer-events-auto cursor-grab active:cursor-grabbing ${getQrPositionClass(frontSide.qrPosition)} flex items-center justify-center ${
                        activeElement === 'qr' ? 'ring-2 ring-[#4F83FF]' : 'hover:ring-1 hover:ring-white/60'
                      }`}
                      style={{
                        width: `${frontSide.qrSize || 56}px`,
                        height: `${frontSide.qrSize || 56}px`,
                        transform: `translate(${frontSide.qrOffsetX || 0}px, ${frontSide.qrOffsetY || 0}px)`,
                      }}
                      title="Drag to reposition QR code"
                    >
                      {frontQrDataUrl ? (
                        <img src={frontQrDataUrl} alt="QR code" className="h-full w-full object-contain" draggable={false} />
                      ) : (
                        <QrCode className="w-full h-full" style={{ color: frontSide.qrColor || frontSide.textColor || '#FFFFFF' }} />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* ===================== BACK SIDE ===================== */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-card border border-black/10 ${material === 'custom_color' ? '' : currentMat.class}`}
                style={{ 
                  fontFamily: backSide.fontFamily || "'Plus Jakarta Sans', sans-serif",
                  backgroundColor: material === 'custom_color' ? customCardColor : undefined,
                  color: material === 'custom_color' ? (isColorDark(customCardColor) ? '#FFFFFF' : '#141518') : undefined,
                }}
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

                <div className="absolute inset-[18px] z-10 pointer-events-none">
                  {isBackPlain ? (
                    /* 100% PLAIN CLEAN BACK SIDE: NO TEXT, NO LOGOS, NO QR - ONLY PURE FINISH OR ARTWORK */
                    <div className="w-full h-full pointer-events-none select-none" />
                  ) : sideMode === 'single_sided' ? (
                    /* Single-Sided: Pristine Minimalist Reverse (only when Plain is explicitly toggled OFF) */
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <span 
                        onMouseDown={(e) => startDrag(e, 'brand')}
                        onTouchStart={(e) => startDrag(e, 'brand')}
                        className="font-extrabold tracking-widest uppercase pointer-events-auto cursor-grab active:cursor-grabbing hover:opacity-80"
                        style={{ 
                          color: backSide.textColor || '#FFFFFF',
                          fontSize: `${backSide.brandSize || 14}px`,
                          transform: `translate(${backSide.brandOffsetX || 0}px, ${backSide.brandOffsetY || 0}px)`,
                        }}
                        title="Drag to reposition"
                      >
                        {backSide.topLabel || 'TAPPING'}
                      </span>
                      <p 
                        className="font-mono opacity-70 mt-1"
                        style={{ 
                          color: backSide.textColor || '#FFFFFF',
                          fontSize: `${backSide.secondaryTextSize || 10}px` 
                        }}
                      >
                        PRECISION MILLED METAL CARD
                      </p>
                      <div 
                        className="mt-3 font-mono opacity-50"
                        style={{ 
                          color: backSide.textColor || '#FFFFFF',
                          fontSize: '9px' 
                        }}
                      >
                        UID: {nfcCard.cardUid || 'TAP-9482-BLK'}
                      </div>
                    </div>
                  ) : (
                    /* Dual-Sided Back with QR & Connection details strictly within 5mm zone */
                    <div className="flex items-center justify-between h-full">
                      <div 
                        onMouseDown={(e) => startDrag(e, 'name')}
                        onTouchStart={(e) => startDrag(e, 'name')}
                        className="flex flex-col justify-between h-full min-w-0 pr-4 pointer-events-auto cursor-grab active:cursor-grabbing hover:outline-1 hover:outline-dashed hover:outline-white/40 rounded-xl p-1"
                        style={{
                          transform: `translate(${backSide.nameOffsetX || 0}px, ${backSide.nameOffsetY || 0}px)`,
                        }}
                        title="Drag to reposition details"
                      >
                        <div>
                          <span 
                            className="font-bold uppercase tracking-wider block"
                            style={{ 
                              color: backSide.textColor || '#FFFFFF',
                              fontSize: `${backSide.primaryTextSize || 13}px`
                            }}
                          >
                            {backSide.primaryText || 'TAP ANY PHONE TO CONNECT'}
                          </span>
                          <p 
                            className="mt-1.5 opacity-90 truncate"
                            style={{ 
                              color: backSide.textColor || '#FFFFFF',
                              fontSize: `${backSide.secondaryTextSize || 11}px`
                            }}
                          >
                            {backSide.secondaryText || `${displayHost}/${username}`}
                          </p>
                        </div>

                        <div 
                          className="font-mono opacity-70"
                          style={{ 
                            color: backSide.textColor || '#FFFFFF',
                            fontSize: '10px' 
                          }}
                        >
                          {backSide.bottomLabel || (nfcCard.cardUid ? `UID: ${nfcCard.cardUid}` : '')}
                          {backSide.customNote && !backSide.customNote.includes('NTAG') && !backSide.customNote.includes('Lifetime') && (
                            <>
                              <br />
                              {backSide.customNote}
                            </>
                          )}
                        </div>
                      </div>

                      {backSide.showQrCode && (
                        <div 
                          onMouseDown={(e) => startDrag(e, 'qr')}
                          onTouchStart={(e) => startDrag(e, 'qr')}
                          onClick={(e) => { e.stopPropagation(); setActiveElement('qr'); }}
                          className="flex items-center justify-center shrink-0 pointer-events-auto cursor-grab active:cursor-grabbing hover:ring-2 hover:ring-[#4F83FF]"
                          style={{
                            width: `${backSide.qrSize || 64}px`,
                            height: `${backSide.qrSize || 64}px`,
                            transform: `translate(${backSide.qrOffsetX || 0}px, ${backSide.qrOffsetY || 0}px)`,
                          }}
                          title="Drag to reposition QR code"
                        >
                          {backQrDataUrl ? (
                            <img src={backQrDataUrl} alt="QR code" className="h-full w-full object-contain" draggable={false} />
                          ) : (
                            <QrCode className="w-full h-full" style={{ color: backSide.qrColor || backSide.textColor || '#FFFFFF' }} />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Drag & Positioning Real-Time Feedback Pill */}
          <div className="w-full max-w-[390px] mt-2 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] text-charcoal/70 font-semibold">
              <span className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-[#4F83FF]" />
                <span>
                  {activeSide === 'back' && isBackPlain
                    ? (currentConfig.artworkUrl ? 'Drag photo to position \u2022 Click empty card to flip' : 'Click card to flip')
                    : 'Drag any text, QR, or logo directly \u2022 Click empty area to flip'}
                </span>
              </span>
              <span className="text-[10px] font-mono font-bold text-charcoal/50">
                {activeSide === 'back' && isBackPlain ? 'Plain clean surface' : 'Contained layout'}
              </span>
            </div>

            {activeElement && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-[#EFF4FF] border border-[#4F83FF]/20 text-[11px] font-bold text-charcoal animate-in fade-in duration-150">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4F83FF] animate-pulse" />
                  <span>
                    Moving: <strong className="text-[#4F83FF] uppercase">{activeElement}</strong> block (X: {
                      activeElement === 'name' ? currentConfig.nameOffsetX ?? 0 :
                      activeElement === 'qr' ? currentConfig.qrOffsetX ?? 0 :
                      activeElement === 'brand' ? currentConfig.brandOffsetX ?? 0 :
                      currentConfig.artworkPosX ?? 0
                    }px, Y: {
                      activeElement === 'name' ? currentConfig.nameOffsetY ?? 0 :
                      activeElement === 'qr' ? currentConfig.qrOffsetY ?? 0 :
                      activeElement === 'brand' ? currentConfig.brandOffsetY ?? 0 :
                      currentConfig.artworkPosY ?? 0
                    }px)
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (activeElement === 'name') updateCurrentConfig({ nameOffsetX: 0, nameOffsetY: 0 });
                    if (activeElement === 'qr') updateCurrentConfig({ qrOffsetX: 0, qrOffsetY: 0 });
                    if (activeElement === 'brand') updateCurrentConfig({ brandOffsetX: 0, brandOffsetY: 0 });
                    if (activeElement === 'artwork') updateCurrentConfig({ artworkPosX: 0, artworkPosY: 0 });
                  }}
                  className="text-[10px] font-bold text-[#4F83FF] hover:underline cursor-pointer"
                >
                  Reset Pos
                </button>
              </div>
            )}
          </div>

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
                    min="-40"
                    max="40"
                    value={currentConfig.artworkPosX ?? 0}
                    onChange={(e) => updateCurrentConfig({ artworkPosX: Number(e.target.value) })}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-charcoal/60 block mb-0.5">Pan Y: {currentConfig.artworkPosY ?? 0}px</span>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    value={currentConfig.artworkPosY ?? 0}
                    onChange={(e) => updateCurrentConfig({ artworkPosY: Number(e.target.value) })}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
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
                  setBackSide((prev) => ({ ...prev, isPlain: true }));
                  showToast('Single-Sided Mode', 'Front has all data; back side is plain clean design', 'info');
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  sideMode === 'single_sided'
                    ? 'bg-[#141518] text-white border-black shadow-xs'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
              >
                <p className="font-black text-xs">Single-Sided (All Data)</p>
                <p className="text-[10px] opacity-70 mt-0.5">Name, QR, and chip on 1 side; plain clean back</p>
              </button>
            </div>
          </div>

          {/* Back Side Design Mode Selector (When Back Side is Active) */}
          {activeSide === 'back' && (
            <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-black text-charcoal uppercase tracking-wider block">
                    Back Side Design Style
                  </label>
                  <p className="text-[11px] text-charcoal/60 mt-0.5">
                    Choose whether the back side should be completely plain or laser-engraved
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isBackPlain ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
                }`}>
                  {isBackPlain ? 'Plain Back' : 'Engraved Text'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBackSide((prev) => ({ ...prev, isPlain: true }));
                    showToast('Plain Back Activated', 'Zero text or markings on back; pure finish or custom art', 'info');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isBackPlain
                      ? 'bg-[#141518] text-white border-black shadow-xs'
                      : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Check className={`w-3.5 h-3.5 ${isBackPlain ? 'text-emerald-400 stroke-[3]' : 'text-charcoal/40'}`} />
                    <p className="font-black text-xs">Plain (No Content)</p>
                  </div>
                  <p className={`text-[10px] leading-relaxed ${isBackPlain ? 'text-gray-300' : 'text-charcoal/60'}`}>
                    100% clean. Zero text, no QR code, no brand labels. Only your metallic finish or uploaded artwork.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setBackSide((prev) => ({ ...prev, isPlain: false }));
                    showToast('Laser Engraved Back Activated', 'You can now customize text, labels, and QR code', 'info');
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
                    !isBackPlain
                      ? 'bg-[#141518] text-white border-black shadow-xs'
                      : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Type className={`w-3.5 h-3.5 ${!isBackPlain ? 'text-[#4F83FF]' : 'text-charcoal/40'}`} />
                    <p className="font-black text-xs">Laser-Engraved Text</p>
                  </div>
                  <p className={`text-[10px] leading-relaxed ${!isBackPlain ? 'text-gray-300' : 'text-charcoal/60'}`}>
                    Engrave custom name, website URL, brand mark, or scannable QR code on the back.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Section 2 & 3: Typography & Element Sizing (Hidden when Back Side is Plain) */}
          {activeSide === 'back' && isBackPlain ? (
            <div className="p-3.5 rounded-2xl bg-white border border-black/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <p className="font-bold text-charcoal">Clean Minimalist Surface</p>
                  <p className="text-[11px] text-charcoal/60">Font and sizing controls are hidden because this side has no text markings</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBackSide((prev) => ({ ...prev, isPlain: false }))}
                className="text-[11px] font-bold text-[#4F83FF] hover:underline cursor-pointer"
              >
                Add Text
              </button>
            </div>
          ) : (
            <>
              {/* Section 2: Card Fonts Dropdown with Authentic Typography Rendering */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3">
            <div>
              <label className="font-black text-charcoal uppercase tracking-wider block">
                Card Typography Font
              </label>
              <p className="text-[11px] text-charcoal/60 mt-0.5">
                Every font renders in its own authentic typeface style so you can choose the exact look
              </p>
            </div>

            {/* Custom Interactive Dropdown Popover Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-black/10 flex items-center justify-between hover:border-black/30 transition-all shadow-2xs cursor-pointer text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#EFF4FF] text-[#4F83FF] flex items-center justify-center shrink-0">
                    <Type className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-charcoal truncate" style={{ fontFamily: currentConfig.fontFamily }}>
                      {currentFontObj.name}
                    </p>
                    <p className="text-[11px] text-charcoal/50 truncate mt-0.5" style={{ fontFamily: currentConfig.fontFamily }}>
                      {currentConfig.primaryText || 'YOUR NAME'} &bull; Aa Bb 123
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ChevronDown className={`w-4 h-4 text-charcoal/50 transition-transform duration-200 ${isFontDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {/* Popover Dropdown Panel */}
              {isFontDropdownOpen && (
                <div className="mt-2 p-3 bg-white rounded-3xl border border-black/15 shadow-float flex flex-col gap-2.5 z-30">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      placeholder="Search font by name or style..."
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#4F83FF]/30"
                    />
                    {fontSearch && (
                      <button
                        type="button"
                        onClick={() => setFontSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFontCategory(cat)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shrink-0 transition-colors cursor-pointer ${
                          fontCategory === cat
                            ? 'bg-[#141518] text-white shadow-2xs'
                            : 'bg-[#FAF7F2] text-charcoal/70 hover:bg-gray-100 border border-black/5'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Scrollable Font List: Each font in ITS OWN authentic style */}
                  <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                    {filteredFonts.length === 0 ? (
                      <div className="text-center py-6 text-charcoal/50 text-xs">
                        No fonts matching &ldquo;{fontSearch}&rdquo;
                      </div>
                    ) : (
                      filteredFonts.map((font) => {
                        const isSelected = currentConfig.fontFamily === font.family;
                        return (
                          <button
                            key={font.id}
                            type="button"
                            onClick={() => {
                              updateCurrentConfig({ fontFamily: font.family });
                              setIsFontDropdownOpen(false);
                              showToast('Font Applied', `${font.name} applied to card`, 'success');
                            }}
                            className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#EFF4FF] border-[#4F83FF] shadow-2xs ring-1 ring-[#4F83FF]'
                                : 'bg-white border-black/5 hover:border-black/20 hover:bg-[#FAF7F2]'
                            }`}
                          >
                            <div className="flex flex-col min-w-0 pr-2">
                              <span
                                className="text-sm font-bold text-charcoal truncate"
                                style={{ fontFamily: font.family }}
                              >
                                {font.name}
                              </span>
                              <span
                                className="text-xs text-charcoal/70 truncate mt-0.5"
                                style={{ fontFamily: font.family }}
                              >
                                {currentConfig.primaryText || 'YOUR NAME'} &bull; Aa Bb 123
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-md bg-[#FAF7F2] border border-black/5 text-charcoal/50">
                                {font.category}
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-[#4F83FF]" />
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Live Typography Preview Strip */}
            <div className="p-2.5 rounded-xl bg-white border border-black/5 flex items-center justify-between">
              <span className="text-[10px] font-mono text-charcoal/50">Current:</span>
              <span className="text-sm font-black text-charcoal truncate" style={{ fontFamily: currentConfig.fontFamily }}>
                {currentConfig.primaryText || 'YOUR NAME'} &bull; {currentConfig.topLabel || 'TAPPING'}
              </span>
            </div>
          </div>

          {/* Section 3: Element Sizing & Precision Placement (5mm Safe Margin) */}
          <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-4">
            <div>
              <label className="font-black text-charcoal uppercase tracking-wider block">
                Element Sizing & Placement ({activeSide.toUpperCase()} Side)
              </label>
              <p className="text-[11px] text-charcoal/60 mt-0.5">
                Control text sizes, QR dimensions, and positioning within the card area
              </p>
            </div>

            {/* Sub-section A: Primary Name / Heading */}
            <div className="p-3 bg-white rounded-2xl border border-black/5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-charcoal">
                  Primary Name Font Size
                </span>
                <span className="text-xs font-mono font-black text-[#4F83FF] bg-[#EFF4FF] px-2 py-0.5 rounded-md">
                  {currentConfig.primaryTextSize ?? 18}px
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={currentConfig.primaryTextSize ?? 18}
                  onChange={(e) => updateCurrentConfig({ primaryTextSize: Number(e.target.value) })}
                  className="w-full accent-[#4F83FF] cursor-pointer"
                />
              </div>

              {/* Quick size presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[14, 18, 22, 26, 30].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => updateCurrentConfig({ primaryTextSize: sz })}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      (currentConfig.primaryTextSize ?? 18) === sz
                        ? 'bg-[#141518] text-white border-black'
                        : 'bg-[#FAF7F2] text-charcoal/70 border-black/10 hover:bg-gray-100'
                    }`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>

              {/* Position Placement Preset */}
              <div className="pt-1 border-t border-black/5">
                <span className="text-[10px] font-bold text-charcoal/60 block mb-1">Position on Card</span>
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
                      className={`py-1 px-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                        currentConfig.namePosition === pos.id
                          ? 'bg-[#4F83FF] text-white border-[#4F83FF] shadow-2xs'
                          : 'bg-[#FAF7F2] text-charcoal border-black/10 hover:bg-gray-100'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine Nudge Controls */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-bold text-charcoal/60">Position Nudge:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => nudgeOffset('nameOffsetX', 'nameOffsetY', -4, 0)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Left"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('nameOffsetX', 'nameOffsetY', 4, 0)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('nameOffsetX', 'nameOffsetY', 0, -4)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('nameOffsetX', 'nameOffsetY', 0, 4)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => resetOffset('nameOffsetX', 'nameOffsetY')}
                    className="px-2 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 text-[10px] font-bold cursor-pointer flex items-center gap-1"
                    title="Reset Position"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-section B: Tagline / Secondary Text */}
            <div className="p-3 bg-white rounded-2xl border border-black/5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-charcoal">
                  Tagline / Title Font Size
                </span>
                <span className="text-xs font-mono font-black text-[#4F83FF] bg-[#EFF4FF] px-2 py-0.5 rounded-md">
                  {currentConfig.secondaryTextSize ?? 9}px
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="7"
                  max="18"
                  value={currentConfig.secondaryTextSize ?? 9}
                  onChange={(e) => updateCurrentConfig({ secondaryTextSize: Number(e.target.value) })}
                  className="w-full accent-[#4F83FF] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[8, 9, 11, 13, 16].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => updateCurrentConfig({ secondaryTextSize: sz })}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      (currentConfig.secondaryTextSize ?? 9) === sz
                        ? 'bg-[#141518] text-white border-black'
                        : 'bg-[#FAF7F2] text-charcoal/70 border-black/10 hover:bg-gray-100'
                    }`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>

              {/* Fine Nudge Controls for Tagline */}
              <div className="flex items-center justify-between pt-1 border-t border-black/5">
                <span className="text-[10px] font-bold text-charcoal/60">Tagline Nudge:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => nudgeOffset('secondaryOffsetX', 'secondaryOffsetY', -4, 0)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Left"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('secondaryOffsetX', 'secondaryOffsetY', 4, 0)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('secondaryOffsetX', 'secondaryOffsetY', 0, -4)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('secondaryOffsetX', 'secondaryOffsetY', 0, 4)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => resetOffset('secondaryOffsetX', 'secondaryOffsetY')}
                    className="px-2 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 text-[10px] font-bold cursor-pointer flex items-center gap-1"
                    title="Reset Position"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-section C: Brand "TAPPING" Sizing & Placement */}
            <div className="p-3 bg-white rounded-2xl border border-black/5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-charcoal">
                  Brand &ldquo;TAPPING&rdquo; Font Size
                </span>
                <span className="text-xs font-mono font-black text-[#4F83FF] bg-[#EFF4FF] px-2 py-0.5 rounded-md">
                  {currentConfig.brandSize ?? 13}px
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="9"
                  max="22"
                  value={currentConfig.brandSize ?? 13}
                  onChange={(e) => updateCurrentConfig({ brandSize: Number(e.target.value) })}
                  className="w-full accent-[#4F83FF] cursor-pointer"
                />
              </div>

              <div className="pt-1 border-t border-black/5">
                <span className="text-[10px] font-bold text-charcoal/60 block mb-1">Brand Position</span>
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
                      className={`py-1 px-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                        currentConfig.brandPosition === pos.id
                          ? 'bg-[#4F83FF] text-white border-[#4F83FF] shadow-2xs'
                          : 'bg-[#FAF7F2] text-charcoal border-black/10 hover:bg-gray-100'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine Nudge Controls for Brand */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-bold text-charcoal/60">Brand Nudge:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => nudgeOffset('brandOffsetX', 'brandOffsetY', -4, 0)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Left"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('brandOffsetX', 'brandOffsetY', 4, 0)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('brandOffsetX', 'brandOffsetY', 0, -4)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('brandOffsetX', 'brandOffsetY', 0, 4)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => resetOffset('brandOffsetX', 'brandOffsetY')}
                    className="px-2 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 text-[10px] font-bold cursor-pointer flex items-center gap-1"
                    title="Reset Position"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sub-section D: QR Code Sizing & Placement */}
            <div className="p-3 bg-white rounded-2xl border border-black/5 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-charcoal">
                  Dynamic QR Code Size
                </span>
                <span className="text-xs font-mono font-black text-[#4F83FF] bg-[#EFF4FF] px-2 py-0.5 rounded-md">
                  {currentConfig.qrSize ?? 56}px
                </span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="36"
                  max="80"
                  value={currentConfig.qrSize ?? 56}
                  onChange={(e) => updateCurrentConfig({ qrSize: Number(e.target.value) })}
                  className="w-full accent-[#4F83FF] cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { sz: 44, label: 'Compact (44px)' },
                  { sz: 56, label: 'Standard (56px)' },
                  { sz: 72, label: 'Large (72px)' },
                ].map((item) => (
                  <button
                    key={item.sz}
                    type="button"
                    onClick={() => updateCurrentConfig({ qrSize: item.sz })}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                      (currentConfig.qrSize ?? 56) === item.sz
                        ? 'bg-[#141518] text-white border-black'
                        : 'bg-[#FAF7F2] text-charcoal/70 border-black/10 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="pt-1 border-t border-black/5">
                <span className="text-[10px] font-bold text-charcoal/60 block mb-1">QR Code Position</span>
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
                      className={`py-1 px-2 rounded-xl border text-[10px] font-bold transition-all cursor-pointer ${
                        currentConfig.qrPosition === pos.id
                          ? 'bg-[#4F83FF] text-white border-[#4F83FF] shadow-2xs'
                          : 'bg-[#FAF7F2] text-charcoal border-black/10 hover:bg-gray-100'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fine Nudge Controls for QR */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-bold text-charcoal/60">QR Nudge:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => nudgeOffset('qrOffsetX', 'qrOffsetY', -4, 0)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Left"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('qrOffsetX', 'qrOffsetY', 4, 0)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('qrOffsetX', 'qrOffsetY', 0, -4)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Up"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => nudgeOffset('qrOffsetX', 'qrOffsetY', 0, 4)}
                    className="w-6 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 flex items-center justify-center text-xs font-bold cursor-pointer"
                    title="Nudge Down"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => resetOffset('qrOffsetX', 'qrOffsetY')}
                    className="px-2 h-6 rounded-lg bg-[#FAF7F2] hover:bg-gray-200 border border-black/10 text-[10px] font-bold cursor-pointer flex items-center gap-1"
                    title="Reset Position"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Barcode / QR Code Color Setting */}
              <div className="pt-2 border-t border-black/5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-charcoal/70 block">
                      Barcode &amp; QR Color
                    </span>
                    <span className="text-[9px] text-charcoal/50">
                      Transparent background &bull; metallic texture shows through
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#FAF7F2] border border-black/10">
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: currentConfig.qrColor || currentConfig.textColor || '#FFFFFF' }}
                    />
                    <span className="font-mono text-[10px] font-bold text-charcoal">
                      {currentConfig.qrColor || currentConfig.textColor || '#FFFFFF'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentConfig.qrColor || currentConfig.textColor || '#FFFFFF'}
                    onChange={(e) => updateCurrentConfig({ qrColor: e.target.value.toUpperCase() })}
                    className="w-8 h-8 rounded-lg border border-black/20 cursor-pointer p-0.5 bg-white shadow-2xs shrink-0"
                    title="Choose Barcode/QR color"
                  />
                  <input
                    type="text"
                    value={currentConfig.qrColor || currentConfig.textColor || '#FFFFFF'}
                    onChange={(e) => {
                      let val = e.target.value.toUpperCase();
                      if (!val.startsWith('#')) val = '#' + val;
                      updateCurrentConfig({ qrColor: val });
                    }}
                    placeholder="#FFFFFF"
                    className="flex-1 px-2.5 py-1 rounded-lg border border-black/10 font-mono text-[11px] font-bold uppercase focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  />
                  <button
                    type="button"
                    onClick={() => updateCurrentConfig({ qrColor: currentConfig.textColor || '#FFFFFF' })}
                    className="px-2 py-1 rounded-lg bg-[#FAF7F2] hover:bg-gray-100 border border-black/10 text-[10px] font-bold text-charcoal/70 cursor-pointer whitespace-nowrap"
                    title="Match text color"
                  >
                    Match Text
                  </button>
                </div>

                {/* Color Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {[
                    { hex: '#FFFFFF', name: 'White' },
                    { hex: '#111111', name: 'Black' },
                    { hex: '#ECC86A', name: '24K Gold' },
                    { hex: '#E2E8F0', name: 'Silver' },
                    { hex: '#E0A899', name: 'Rose Gold' },
                    { hex: '#3B82F6', name: 'Blue' },
                    { hex: '#10B981', name: 'Emerald' },
                  ].map((preset) => {
                    const isSelected = (currentConfig.qrColor || currentConfig.textColor || '#FFFFFF').toUpperCase() === preset.hex.toUpperCase();
                    return (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => updateCurrentConfig({ qrColor: preset.hex })}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                          isSelected ? 'ring-2 ring-[#4F83FF] scale-110' : 'border-black/20 hover:scale-105'
                        }`}
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sub-section E: Contactless Chip Graphic Toggle */}
            <div className="p-3 bg-white rounded-2xl border border-black/5 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-charcoal block">
                  Contactless Gold Microchip Graphic
                </span>
                <span className="text-[10px] text-charcoal/60">
                  Toggle the aesthetic hardware microchip icon on the card
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateCurrentConfig({ showChip: !currentConfig.showChip })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    currentConfig.showChip !== false
                      ? 'bg-[#4F83FF] text-white border-[#4F83FF]'
                      : 'bg-[#FAF7F2] text-charcoal/60 border-black/10'
                  }`}
                >
                  {currentConfig.showChip !== false ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>
          </div>
            </>
          )}

          {/* Section 4: Metal Alloy Finish & Card Color */}
          <div>
            <label className="font-black text-charcoal uppercase tracking-wider block mb-2">
              Select Metal Alloy Finish &amp; Card Color
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {materials.map((mat) => {
                const isSelected = material === mat.id;
                return (
                  <button
                    key={mat.id}
                    onClick={() => {
                      setMaterial(mat.id);
                      if (mat.id === 'matte_black') {
                        updateCurrentConfig({ textColor: '#FFFFFF' });
                      } else if (mat.id === 'custom_color') {
                        const isDark = isColorDark(customCardColor);
                        updateCurrentConfig({ textColor: isDark ? '#FFFFFF' : '#141518' });
                      } else {
                        updateCurrentConfig({ textColor: '#141518' });
                      }
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-charcoal bg-black/5 ring-2 ring-charcoal shadow-xs'
                        : 'border-black/10 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {mat.id === 'custom_color' ? (
                        <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: customCardColor }} />
                      ) : (
                        <span className={`w-3.5 h-3.5 rounded-full border border-black/20 ${mat.id === 'matte_black' ? 'bg-[#141518]' : mat.id === 'brushed_gold' ? 'bg-[#D4AF37]' : mat.id === 'rose_gold' ? 'bg-[#D99B9B]' : 'bg-[#EAECEF]'}`} />
                      )}
                      <p className="font-black text-charcoal text-xs">{mat.name}</p>
                    </div>
                    <p className="text-[10px] text-charcoal/60 leading-tight">{mat.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Chart Section */}
            {material === 'custom_color' && (
              <div className="mt-3 p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 text-left">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs font-black text-charcoal block">Card Color Chart &amp; Spectral Palette</span>
                    <p className="text-[11px] text-charcoal/60 mt-0.5">Select any curated shade or pick an exact RGB / HEX color wheel</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-black/10 shadow-2xs">
                    <span className="w-4 h-4 rounded-full border border-black/20" style={{ backgroundColor: customCardColor }} />
                    <span className="font-mono text-xs font-bold text-charcoal">{customCardColor}</span>
                  </div>
                </div>
                <ColorChartPicker
                  value={customCardColor}
                  onChange={(hex) => {
                    setCustomCardColor(hex);
                    setMaterial('custom_color');
                    const isDark = isColorDark(hex);
                    updateCurrentConfig({ textColor: isDark ? '#FFFFFF' : '#141518' });
                  }}
                />
              </div>
            )}
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
          {activeSide === 'back' && isBackPlain ? (
            <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                <h4 className="font-black text-charcoal uppercase tracking-wider text-xs">
                  Back Side is Plain &bull; Zero Text or Markings
                </h4>
              </div>
              <p className="text-[11px] text-charcoal/70 leading-relaxed">
                Only your chosen metallic finish or uploaded custom picture will be printed. No brand labels, headings, or QR code will interfere with your design.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBackSide((prev) => ({ ...prev, isPlain: false }));
                  showToast('Engraving Enabled', 'Enter your custom text and details for the back side', 'info');
                }}
                className="w-full py-2.5 px-3 rounded-2xl bg-white hover:bg-gray-50 border border-black/10 font-black text-xs text-charcoal flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
              >
                <Type className="w-4 h-4 text-[#4F83FF]" />
                <span>+ Add Laser-Engraved Text to Back Side</span>
              </button>
            </div>
          ) : (
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

            {/* Laser Contrast Colors - Full Spectrum Picker */}
            <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-black text-charcoal uppercase tracking-wider block">
                    Laser Engraving & Text Color
                  </label>
                  <p className="text-[11px] text-charcoal/60 mt-0.5">
                    Choose from the full color spectrum, input HEX code, or select a metallic preset
                  </p>
                </div>

                {/* Color preview pill */}
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-white border border-black/10 shadow-2xs">
                  <div
                    className="w-4 h-4 rounded-full border border-black/20"
                    style={{ backgroundColor: currentConfig.textColor || '#FFFFFF' }}
                  />
                  <span className="text-xs font-mono font-bold text-charcoal">
                    {currentConfig.textColor || '#FFFFFF'}
                  </span>
                </div>
              </div>

              {/* Full Spectrum Input + Custom HEX Text Field */}
              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-black/5">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentConfig.textColor || '#FFFFFF'}
                    onChange={(e) => updateCurrentConfig({ textColor: e.target.value.toUpperCase() })}
                    className="w-10 h-10 rounded-xl border border-black/20 cursor-pointer p-0.5 bg-white shadow-2xs"
                    title="Click to open full color spectrum wheel"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-charcoal/60 block">Full Spectrum Wheel</span>
                    <span className="text-[11px] font-medium text-charcoal">Select any RGB / HEX</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-black/10 mx-1" />

                <div className="flex-1">
                  <span className="text-[10px] font-bold text-charcoal/60 block mb-0.5">Hex Code</span>
                  <input
                    type="text"
                    value={currentConfig.textColor || '#FFFFFF'}
                    onChange={(e) => {
                      let val = e.target.value.toUpperCase();
                      if (!val.startsWith('#')) val = '#' + val;
                      updateCurrentConfig({ textColor: val });
                    }}
                    placeholder="#FFFFFF"
                    className="w-full px-2.5 py-1 rounded-lg border border-black/10 font-mono text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  />
                </div>
              </div>

              {/* 22-Color Spectrum & Metallic Presets Grid */}
              <div>
                <span className="text-[10px] font-bold text-charcoal/60 block mb-1.5 uppercase tracking-wider">
                  Metallic & Vibrant Presets
                </span>
                <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
                  {COLOR_SPECTRUM.map((c) => {
                    const isSelected = (currentConfig.textColor || '#FFFFFF').toUpperCase() === c.hex.toUpperCase();
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => updateCurrentConfig({ textColor: c.hex })}
                        className={`w-7 h-7 rounded-xl border flex items-center justify-center transition-transform active:scale-90 cursor-pointer relative group ${
                          isSelected
                            ? 'ring-2 ring-black scale-110 shadow-xs z-10'
                            : 'border-black/15 hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} (${c.hex})`}
                      >
                        {isSelected && (
                          <Check
                            className={`w-3.5 h-3.5 ${
                              c.hex === '#FFFFFF' || c.hex === '#F8FAFC' || c.hex === '#E2E8F0' || c.hex === '#F5E6C8'
                                ? 'text-black'
                                : 'text-white'
                            }`}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

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

      {/* Multi-Step Hardware Order Wizard Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-4xl p-6 sm:p-7 max-w-lg w-full border border-black/10 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#B6F554] text-charcoal flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-charcoal">
                    {orderStep === 'review' && 'Order Custom Metal NFC Card (Step 1/3)'}
                    {orderStep === 'delivery' && 'Delivery & Shipping Details (Step 2/3)'}
                    {orderStep === 'payment' && 'Select Payment Mode (Step 3/3)'}
                    {orderStep === 'confirm_popup' && 'Confirm Your Order'}
                    {orderStep === 'success' && 'Order Received & Dispatched!'}
                  </h3>
                  <p className="text-[10px] font-bold text-charcoal/50">
                    {orderStep === 'review' && 'Review your custom laser engraving specifications'}
                    {orderStep === 'delivery' && 'Enter your Pan-India delivery address'}
                    {orderStep === 'payment' && 'Choose between UPI and Cash on Delivery'}
                    {orderStep === 'confirm_popup' && 'Please confirm your order details'}
                    {orderStep === 'success' && 'Sent to laser workshop for precision fabrication'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOrderModalOpen(false)}
                className="text-charcoal/60 hover:text-charcoal p-1.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Stepper Progress Bar (for steps 1-3) */}
            {(orderStep === 'review' || orderStep === 'delivery' || orderStep === 'payment') && (
              <div className="grid grid-cols-3 gap-2 pt-3 pb-2 text-[10px] font-black text-center">
                <div className={`p-1.5 rounded-xl border ${orderStep === 'review' ? 'bg-[#141518] text-white border-black' : 'bg-[#FAF7F2] text-charcoal/60 border-black/5'}`}>
                  1. Review
                </div>
                <div className={`p-1.5 rounded-xl border ${orderStep === 'delivery' ? 'bg-[#141518] text-white border-black' : 'bg-[#FAF7F2] text-charcoal/60 border-black/5'}`}>
                  2. Address
                </div>
                <div className={`p-1.5 rounded-xl border ${orderStep === 'payment' ? 'bg-[#141518] text-white border-black' : 'bg-[#FAF7F2] text-charcoal/60 border-black/5'}`}>
                  3. Payment
                </div>
              </div>
            )}

            {/* STEP 1: REVIEW CARD ITEM & SPECS */}
            {orderStep === 'review' && (
              <div className="py-3 space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
                {/* Mini Card Preview */}
                <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col sm:flex-row items-center gap-4">
                  <div
                    className="w-44 h-28 rounded-2xl p-3 flex flex-col justify-between shrink-0 shadow-md border border-black/20"
                    style={{
                      backgroundColor: material === 'custom_color' ? customCardColor : (material === 'matte_black' ? '#141518' : material === 'brushed_gold' ? '#D4AF37' : material === 'rose_gold' ? '#D99B9B' : '#EAECEF'),
                      color: (material === 'matte_black' || (material === 'custom_color' && isColorDark(customCardColor))) ? '#FFFFFF' : '#141518',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-wider">
                        {frontSide.topLabel || 'TAPPING'}
                      </span>
                      <div className="w-5 h-3 rounded-xs bg-amber-400 border border-amber-600 flex flex-col justify-around p-0.5 shadow-2xs">
                        <div className="w-full h-px bg-amber-700" />
                        <div className="w-full h-px bg-amber-700" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase truncate">
                        {frontSide.primaryText || username.toUpperCase()}
                      </p>
                      <p className="text-[7px] font-mono opacity-80 uppercase truncate">
                        {frontSide.secondaryText || 'FOUNDER & CREATOR'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-left flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white border border-black/10 text-charcoal">
                        {material === 'custom_color' ? `Custom Shade (${customCardColor})` : currentMat.name}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Smart Chip
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal/80 font-bold mt-1">
                      Engraved Name: <span className="text-charcoal font-black">{frontSide.primaryText || username.toUpperCase()}</span>
                    </p>
                    <p className="text-[10px] text-charcoal/60">
                      Destination: <span className="font-mono">{displayHost}/{username}</span>
                    </p>
                    <p className="text-[10px] text-charcoal/60">
                      Back Side: <span className="font-medium">{isBackPlain ? 'Plain Mirror Stainless Steel' : 'Laser Engraved QR & Info'}</span>
                    </p>
                  </div>
                </div>

                {/* Pricing & Free Delivery Summary */}
                <div className="p-3.5 rounded-2xl bg-white border border-black/10 space-y-2 text-xs">
                  <div className="flex justify-between items-center text-charcoal/70">
                    <span>1x Precision Metal Smart Card</span>
                    <span className="font-mono font-bold text-charcoal">₹1,499</span>
                  </div>
                  <div className="flex justify-between items-center text-charcoal/70">
                    <span>Pan-India Express Tracked Delivery</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="flex justify-between items-center text-charcoal/70">
                    <span>Smart Microchip Encoding</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="pt-2 border-t border-black/5 flex justify-between items-center text-sm font-black text-charcoal">
                    <span>Total Amount Payable</span>
                    <span className="text-base text-charcoal font-mono">₹1,499</span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="flex-1 py-3 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderStep('delivery')}
                    className="flex-2 py-3 px-6 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>Continue to Delivery Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: DELIVERY ADDRESS & CONTACT */}
            {orderStep === 'delivery' && (
              <div className="py-3 space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
                <div className="space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-charcoal/70 block mb-1">Recipient Name *</label>
                      <input
                        type="text"
                        value={shippingName}
                        onChange={(e) => setShippingName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-charcoal/70 block mb-1">Mobile Phone (For Courier SMS) *</label>
                      <input
                        type="text"
                        value={shippingPhone}
                        onChange={(e) => setShippingPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-charcoal/70 block mb-1">Email Address (For Tracking & Invoice) *</label>
                    <input
                      type="email"
                      value={shippingEmail}
                      onChange={(e) => setShippingEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-charcoal/70 block mb-1">Delivery Street Address / Flat / Building *</label>
                    <input
                      type="text"
                      value={shippingStreet}
                      onChange={(e) => setShippingStreet(e.target.value)}
                      placeholder="e.g. Flat 402, Skyline Residency, 100ft Road"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-charcoal/70 block mb-1">City *</label>
                      <input
                        type="text"
                        value={shippingCity}
                        onChange={(e) => setShippingCity(e.target.value)}
                        placeholder="Bengaluru"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-charcoal/70 block mb-1">State *</label>
                      <input
                        type="text"
                        value={shippingState}
                        onChange={(e) => setShippingState(e.target.value)}
                        placeholder="Karnataka"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-charcoal/70 block mb-1">PIN Code *</label>
                      <input
                        type="text"
                        value={shippingZip}
                        onChange={(e) => setShippingZip(e.target.value)}
                        placeholder="560038"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-charcoal/70 block mb-1">Special Engraving / Workshop Notes (Optional)</label>
                    <input
                      type="text"
                      value={engravingNotes}
                      onChange={(e) => setEngravingNotes(e.target.value)}
                      placeholder="e.g. Ensure deep laser engraving contrast"
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-medium text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setOrderStep('review')}
                    className="flex-1 py-3 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10 transition-colors cursor-pointer"
                  >
                    Back to Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!shippingName.trim() || !shippingPhone.trim() || !shippingStreet.trim() || !shippingCity.trim() || !shippingZip.trim()) {
                        showToast('Required Fields Missing', 'Please fill in name, phone, street address, city, and PIN code', 'error');
                        return;
                      }
                      setOrderStep('payment');
                    }}
                    className="flex-2 py-3 px-6 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>Continue to Payment Mode</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: PAYMENT MODE (CASH OR UPI) */}
            {orderStep === 'payment' && (
              <div className="py-3 space-y-3.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
                <p className="text-xs font-bold text-charcoal">
                  Select your preferred payment method:
                </p>

                <div className="space-y-2.5">
                  {/* Option 1: UPI Payment */}
                  <div
                    onClick={() => setPaymentMode('UPI')}
                    className={`p-4 rounded-3xl border-2 transition-all cursor-pointer ${
                      paymentMode === 'UPI'
                        ? 'border-charcoal bg-[#EFF4FF]/60 ring-2 ring-[#4F83FF]/30 shadow-xs'
                        : 'border-black/10 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-black/10 flex items-center justify-center font-black text-xs text-[#4F83FF] shadow-2xs">
                          UPI
                        </div>
                        <div>
                          <p className="font-black text-charcoal text-xs">UPI (Google Pay / PhonePe / Paytm / BHIM)</p>
                          <p className="text-[10px] text-charcoal/60 mt-0.5">Instant online payment with zero convenience fee</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMode === 'UPI' ? 'border-[#4F83FF] bg-[#4F83FF]' : 'border-black/20'}`}>
                        {paymentMode === 'UPI' && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                    </div>

                    {paymentMode === 'UPI' && (
                      <div className="mt-3 pt-3 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-black/5">
                        <div className="text-left">
                          <span className="text-[10px] font-bold text-charcoal/50 uppercase">Official UPI ID</span>
                          <p className="font-mono font-black text-charcoal text-xs mt-0.5">tapping.pay@icici</p>
                          <span className="text-[9px] text-emerald-700 font-bold block mt-1">Verified Merchant &bull; Instant Queue Priority</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText('tapping.pay@icici');
                            showToast('UPI ID Copied', 'tapping.pay@icici copied to clipboard', 'info');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-[10px] font-black border border-black/10 cursor-pointer"
                        >
                          Copy UPI ID
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Cash on Delivery (COD) */}
                  <div
                    onClick={() => setPaymentMode('COD')}
                    className={`p-4 rounded-3xl border-2 transition-all cursor-pointer ${
                      paymentMode === 'COD'
                        ? 'border-charcoal bg-[#FAF7F2] ring-2 ring-charcoal/30 shadow-xs'
                        : 'border-black/10 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-black/10 flex items-center justify-center font-black text-xs text-emerald-700 shadow-2xs">
                          COD
                        </div>
                        <div>
                          <p className="font-black text-charcoal text-xs">Cash on Delivery (COD)</p>
                          <p className="text-[10px] text-charcoal/60 mt-0.5">Pay ₹1,499 upon doorstep delivery via Cash or Delivery Agent QR</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMode === 'COD' ? 'border-charcoal bg-charcoal' : 'border-black/20'}`}>
                        {paymentMode === 'COD' && <Check className="w-3 h-3 text-white stroke-[3]" />}
                      </div>
                    </div>

                    {paymentMode === 'COD' && (
                      <div className="mt-3 pt-3 border-t border-black/5 bg-white p-3 rounded-2xl border border-black/5">
                        <p className="text-[10px] text-charcoal/70 leading-relaxed font-medium">
                          Pan-India delivery via Delhivery Express. Please keep ₹1,499 ready in cash or UPI app when your courier arrives.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Total Summary */}
                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/10 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-charcoal">Total Amount</p>
                    <p className="text-[10px] text-charcoal/60">Inclusive of all taxes & express shipping</p>
                  </div>
                  <span className="text-lg font-black font-mono text-charcoal">₹1,499</span>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setOrderStep('delivery')}
                    className="flex-1 py-3 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10 transition-colors cursor-pointer"
                  >
                    Back to Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderStep('confirm_popup')}
                    className="flex-2 py-3 px-6 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>Proceed to Confirm Order</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: CONFIRMATION POPUP ("ARE YOU SURE?") */}
            {orderStep === 'confirm_popup' && (
              <div className="py-4 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
                <div className="p-4 rounded-3xl bg-[#EFF4FF] border border-[#4F83FF]/30 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#4F83FF] text-white flex items-center justify-center shrink-0">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-charcoal">Are you sure you want to place this order?</h4>
                      <p className="text-[11px] text-charcoal/70">Please review your final order parameters before fabrication</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-3 border border-black/10 space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-charcoal/60">Item:</span>
                      <strong className="text-charcoal">1x Laser Metal NFC Card ({material === 'custom_color' ? `Custom Shade ${customCardColor}` : currentMat.name})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal/60">Laser Engraving:</span>
                      <strong className="text-charcoal">{frontSide.primaryText || username.toUpperCase()}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal/60">Deliver to:</span>
                      <span className="text-charcoal font-medium text-right max-w-[240px] truncate">{shippingName}, {shippingCity} ({shippingZip})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal/60">Payment Mode:</span>
                      <strong className="text-emerald-700">{paymentMode === 'COD' ? 'Cash on Delivery (COD)' : 'UPI Payment'}</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-black/5 font-black text-xs text-charcoal">
                      <span>Total Price:</span>
                      <span className="font-mono text-sm">₹1,499</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setOrderStep('payment')}
                    className="flex-1 py-3 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-xs font-bold text-charcoal border border-black/10 transition-colors cursor-pointer"
                  >
                    Review Again
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalizeOrder}
                    className="flex-2 py-3 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>Yes, Confirm &amp; Place Order (₹1,499)</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: SUCCESS CONFIRMATION MODAL */}
            {orderStep === 'success' && (
              <div className="py-4 space-y-4 text-xs text-center animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-3xl bg-[#B6F554] border border-black/10 text-charcoal flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-charcoal">
                    Order Placed Successfully!
                  </h3>
                  <p className="text-xs text-charcoal/70 mt-1 max-w-sm mx-auto font-medium">
                    Your card order has been received and queued for printing and dispatch.
                  </p>
                </div>

                {/* Order Specs Box */}
                <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 text-left space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-black/5">
                    <span className="text-charcoal/60 font-bold">Order ID:</span>
                    <span className="font-mono font-black text-charcoal text-sm">{placedOrder?.orderNumber || 'TAP-10894'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/60 font-bold">Courier Tracking ID:</span>
                    <span className="font-mono font-black text-[#4F83FF]">{placedOrder?.trackingNumber || 'DEL-8920148'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/60 font-bold">Shipping Carrier:</span>
                    <span className="font-bold text-charcoal">Delhivery Surface Express</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-charcoal/60 font-bold">Payment Method:</span>
                    <span className="font-black text-emerald-700">
                      {paymentMode === 'COD' ? 'Cash on Delivery (Pay ₹1,499 on arrival)' : 'UPI Verified (₹1,499 Paid)'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-black/5">
                    <span className="text-charcoal/60 font-bold">Estimated Delivery:</span>
                    <span className="font-bold text-charcoal">3 to 4 Business Days</span>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderModalOpen(false);
                      const accountBtn = document.querySelector('[title="Account & Orders"]') as HTMLButtonElement;
                      if (accountBtn) accountBtn.click();
                      else window.location.href = '/dashboard?tab=account';
                    }}
                    className="flex-1 py-3 px-4 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black transition-transform active:scale-95 cursor-pointer shadow-xs"
                  >
                    View in Account &amp; Orders
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(false)}
                    className="py-3 px-5 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-xs font-bold border border-black/10 transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
