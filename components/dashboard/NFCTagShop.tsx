'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Cpu, 
  Layers, 
  Radio, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Check, 
  Package, 
  Clock, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  Smartphone, 
  Upload, 
  Trash2, 
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  User,
  Info,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/components/ui/Toast';
import { Profile, VCardProfile } from '@/lib/types';
import { compressImageFile } from '@/lib/imageCompression';

export interface NFCTagProduct {
  id: string;
  name: string;
  tagline: string;
  priceINR: number;
  badge?: string;
  category: 'sticker' | 'metal_card' | 'keychain' | 'standee';
  description: string;
  specs: string[];
  colors: { id: string; name: string; hex: string; previewBg: string; textClass: string }[];
}

export interface HardwareOrder {
  id: string;
  productId: string;
  productName: string;
  colorName: string;
  priceINR: number;
  chipTargetAction: string;
  chipTargetUrl: string;
  engravedName: string;
  engravedTagline: string;
  customLogoUrl?: string;
  specialInstructions?: string;
  shipping: {
    fullName: string;
    phone: string;
    email: string;
    addressLine: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  orderStatus: 'in_queue' | 'chip_encoding' | 'laser_engraving' | 'dispatched' | 'delivered';
  trackingNumber: string;
  courier: string;
  createdAt: string;
}

const PRODUCTS: NFCTagProduct[] = [
  {
    id: 'nfc-phone-sticker',
    name: 'Smart NFC Phone Sticker (Pack of 2)',
    tagline: 'Instant tap for any phone case or tablet',
    priceINR: 299,
    badge: 'BESTSELLER',
    category: 'sticker',
    description: 'Ultra-thin, waterproof dome-finish NFC sticker with industrial 3M adhesive. Sticks firmly to any smartphone or phone case to share your profile in 0.2 seconds.',
    specs: [
      'NTAG216 high-frequency microchip (888 bytes)',
      'Waterproof 3D glossy crystal epoxy resin coat',
      'Universal tap compatibility with all iPhones and Androids',
      '30mm round compact footprint with anti-metal shielding',
      'Pack of 2 programmed stickers'
    ],
    colors: [
      { id: 'matte-black', name: 'Stealth Black', hex: '#141518', previewBg: 'bg-[#141518]', textClass: 'text-white' },
      { id: 'arctic-white', name: 'Arctic White', hex: '#F4F4F6', previewBg: 'bg-[#F4F4F6]', textClass: 'text-charcoal' },
      { id: 'lime-accent', name: 'Electric Lime', hex: '#B6F554', previewBg: 'bg-[#B6F554]', textClass: 'text-charcoal' }
    ]
  },
  {
    id: 'metal-nfc-card',
    name: 'Laser-Engraved Metal NFC Card',
    tagline: 'Aerospace-grade stainless steel with fiber laser etching',
    priceINR: 1499,
    badge: 'EXECUTIVE',
    category: 'metal_card',
    description: 'Heavy matte metallic business card embedded with an NTAG216 microchip and permanent dynamic QR code. Hand-finished for founders, consultants, and leaders.',
    specs: [
      'Solid 0.8mm aerospace anodized metal alloy',
      'Fiber laser engraved name, logo, and dynamic QR code',
      'Embedded hidden NTAG216 contactless microchip',
      'Works with zero apps or battery required',
      'Comes in luxury matte gift sleeve with authenticity seal'
    ],
    colors: [
      { id: 'matte-black', name: 'Matte Stealth Black', hex: '#141518', previewBg: 'bg-gradient-to-tr from-[#121316] via-[#1c1d22] to-[#2a2c33]', textClass: 'text-white' },
      { id: 'brushed-gold', name: '24K Brushed Gold', hex: '#D4AF37', previewBg: 'bg-gradient-to-tr from-[#8E7020] via-[#C5A039] to-[#F1D06E]', textClass: 'text-charcoal' },
      { id: 'space-silver', name: 'Space Silver', hex: '#9CA3AF', previewBg: 'bg-gradient-to-tr from-[#4B5563] via-[#9CA3AF] to-[#E5E7EB]', textClass: 'text-charcoal' },
      { id: 'titanium-gray', name: 'Titanium Gunmetal', hex: '#374151', previewBg: 'bg-gradient-to-tr from-[#1F2937] via-[#374151] to-[#4B5563]', textClass: 'text-white' }
    ]
  },
  {
    id: 'nfc-leather-keychain',
    name: 'Executive Leather & Metal NFC Keychain',
    tagline: 'Always-ready networking on your key ring',
    priceINR: 499,
    badge: 'POPULAR',
    category: 'keychain',
    description: 'Handcrafted vegan leather tag with brushed gunmetal carabiner ring. Keep your digital profile and contact card right on your keys for effortless in-person exchange.',
    specs: [
      'Water-resistant vegan top-grain leather',
      'High-strength zinc alloy carabiner ring',
      'Embedded high-resonance NFC antenna',
      'Engraved TAPPING seal with custom text',
      'Ultra-durable for everyday pocket carry'
    ],
    colors: [
      { id: 'midnight-black', name: 'Midnight Black Leather', hex: '#1C1C1E', previewBg: 'bg-[#1C1C1E]', textClass: 'text-white' },
      { id: 'saddle-brown', name: 'Saddle Tan Leather', hex: '#8B4513', previewBg: 'bg-[#8B4513]', textClass: 'text-white' },
      { id: 'forest-green', name: 'British Racing Green', hex: '#1B4D3E', previewBg: 'bg-[#1B4D3E]', textClass: 'text-white' }
    ]
  },
  {
    id: 'nfc-acrylic-standee',
    name: 'Tabletop Acrylic NFC & QR Standee',
    tagline: 'For office desks, reception counters, and studios',
    priceINR: 799,
    badge: 'OFFICE & RETAIL',
    category: 'standee',
    description: 'Heavy 4mm optical cast acrylic stand. Visitors and clients simply tap their phone at the top or scan the dynamic high-contrast QR code to open your link or store.',
    specs: [
      '4mm crystal-clear scratch-resistant acrylic',
      'Dual-function: Top NFC microchip + Bottom High-Res QR',
      'Weighted stable base for reception counters and cafe desks',
      'Direct UV-cured high-density printing',
      'No battery, power, or maintenance required'
    ],
    colors: [
      { id: 'obsidian-luxe', name: 'Obsidian Minimalist', hex: '#111827', previewBg: 'bg-[#111827]', textClass: 'text-white' },
      { id: 'studio-frosted', name: 'Studio Frosted White', hex: '#F9FAFB', previewBg: 'bg-[#F9FAFB]', textClass: 'text-charcoal' }
    ]
  }
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Chandigarh', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
];

interface NFCTagShopProps {
  profile: Profile;
  vcard: VCardProfile;
  username: string;
}

export default function NFCTagShop({ profile, vcard, username }: NFCTagShopProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected Product & Color
  const [selectedProduct, setSelectedProduct] = useState<NFCTagProduct>(PRODUCTS[0]);
  const [selectedColor, setSelectedColor] = useState(PRODUCTS[0].colors[0]);

  // Chip Action & Data Filling Form States
  const [chipAction, setChipAction] = useState<string>('profile');
  const [targetUrl, setTargetUrl] = useState<string>(`https://tapping.bio/${username}`);
  const [engravedName, setEngravedName] = useState<string>((profile.displayName && profile.displayName !== 'Aarav Sharma') ? profile.displayName : (profile.username || 'Creator'));
  const [engravedTagline, setEngravedTagline] = useState<string>(vcard.jobTitle || '');
  const [laserTextColor, setLaserTextColor] = useState<string>('');
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(profile.avatarUrl || '');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Indian Shipping Address Form
  const [fullName, setFullName] = useState<string>((profile.displayName && profile.displayName !== 'Aarav Sharma') ? profile.displayName : (profile.username || 'Creator'));
  const [phone, setPhone] = useState<string>(profile.mobileNumber || '');
  const [email, setEmail] = useState<string>(vcard.workEmail || profile.socialLinks?.email || '');
  const [addressLine, setAddressLine] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');

  // Orders History State
  const [orders, setOrders] = useState<HardwareOrder[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<HardwareOrder | null>(null);
  const [viewHistory, setViewHistory] = useState(false);

  // Load existing orders on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tapping_hardware_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Clean legacy demo orders
          const cleaned = parsed.filter((o: HardwareOrder) => o.id !== 'TAP-IN-9482');
          setOrders(cleaned);
        } else {
          setOrders([]);
        }
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
  }, [username, profile.avatarUrl]);

  // When product changes, reset color to first color of product
  const handleSelectProduct = (prod: NFCTagProduct) => {
    setSelectedProduct(prod);
    setSelectedColor(prod.colors[0]);
  };

  // Preset action quick selector
  const handleChipActionChange = (action: string) => {
    setChipAction(action);
    if (action === 'profile') {
      setTargetUrl(`https://tapping.bio/${username}`);
    } else if (action === 'vcard') {
      setTargetUrl(`https://tapping.bio/${username}#contact`);
    } else if (action === 'whatsapp') {
      const cleanPhone = (vcard.workPhone || vcard.mobilePhone || phone).replace(/[^0-9]/g, '');
      setTargetUrl(`https://wa.me/${cleanPhone || '919876543210'}?text=Hi%20there,%20I%20tapped%20your%20TAPPING%20tag!`);
    } else if (action === 'reviews') {
      setTargetUrl(`https://g.page/r/your-google-business-review/review`);
    } else if (action === 'upi') {
      const upiHandle = profile.socialLinks?.upiId || `${username}@upi`;
      setTargetUrl(`upi://pay?pa=${encodeURIComponent(upiHandle)}&pn=${encodeURIComponent(engravedName)}&cu=INR`);
    }
  };

  // Image Upload for Logo / Artwork
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please upload a PNG, JPEG, or SVG image', 'error');
      return;
    }

    try {
      showToast('Processing Artwork', 'Optimizing logo for laser printing...', 'info');
      const compressed = await compressImageFile(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.9,
      });
      setCustomLogoUrl(compressed.dataUrl);
      showToast('Logo Uploaded', 'Custom artwork saved for laser engraving', 'success');
    } catch {
      showToast('Upload Failed', 'Could not process the uploaded file', 'error');
    }
  };

  // Place Order Handler
  const handlePlaceOrder = () => {
    if (!fullName.trim() || !phone.trim() || !addressLine.trim() || !city.trim() || !pincode.trim()) {
      showToast('Incomplete Address', 'Please fill in all mandatory delivery fields', 'error');
      return;
    }

    setIsOrdering(true);

    setTimeout(() => {
      const newOrderId = `TAP-IN-${Math.floor(1000 + Math.random() * 9000)}`;
      const trackingCode = `BD-IN-${Math.floor(100000 + Math.random() * 900000)}`;

      const newOrder: HardwareOrder = {
        id: newOrderId,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        colorName: selectedColor.name,
        priceINR: selectedProduct.priceINR,
        chipTargetAction: chipAction,
        chipTargetUrl: targetUrl,
        engravedName: engravedName.trim() || profile.displayName,
        engravedTagline: engravedTagline.trim() || 'TAPPING Member',
        customLogoUrl,
        specialInstructions,
        shipping: {
          fullName,
          phone,
          email,
          addressLine,
          landmark,
          city,
          state,
          pincode
        },
        orderStatus: 'chip_encoding',
        trackingNumber: trackingCode,
        courier: 'BlueDart Express',
        createdAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      const updated = [newOrder, ...orders];
      setOrders(updated);
      try {
        localStorage.setItem('tapping_hardware_orders', JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      setIsOrdering(false);
      setOrderConfirmed(newOrder);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      showToast(
        'Order Placed Successfully!',
        `Your ${selectedProduct.name} is queued for NTAG216 encoding & laser engraving`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col gap-6 text-charcoal">
      {/* Top Banner / Headline */}
      <div className="w-full bg-white rounded-4xl p-6 sm:p-8 border border-black/10 shadow-soft flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col gap-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#B6F554] text-charcoal font-black text-[10px] tracking-wider uppercase border border-black/10">
              Direct Hardware Dispatch
            </span>
            <span className="px-3 py-1 rounded-full bg-[#FAF7F2] text-charcoal/70 font-bold text-[10px] border border-black/5 flex items-center gap-1">
              <Truck className="w-3 h-3 text-emerald-600" />
              Pan-India Free Express Delivery (3-5 Days)
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-charcoal">
            Order Custom NFC Tags &amp; Hardware
          </h1>

          <p className="text-xs sm:text-sm text-charcoal/70 font-medium leading-relaxed">
            Select your physical NFC hardware, customize what microchip data to write, add your laser engraving, and enter your Indian delivery address. Our production team programs the NTAG216 chip and laser-engraves your device before express courier dispatch.
          </p>
        </div>

        {/* Action Toggle: Order Form vs My Orders */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0 relative z-10">
          <button
            type="button"
            onClick={() => setViewHistory(false)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              !viewHistory
                ? 'bg-[#141518] text-white shadow-xs'
                : 'bg-[#FAF7F2] hover:bg-black/5 text-charcoal border border-black/10'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Hardware Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => setViewHistory(true)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
              viewHistory
                ? 'bg-[#4F83FF] text-white shadow-xs'
                : 'bg-[#FAF7F2] hover:bg-black/5 text-charcoal border border-black/10'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: MY ORDERS TRACKING */}
      {viewHistory && (
        <div className="w-full bg-white rounded-4xl p-6 sm:p-8 border border-black/10 shadow-soft flex flex-col gap-6">
          <div className="flex items-center justify-between pb-4 border-b border-black/5">
            <div>
              <h2 className="text-lg font-black text-charcoal">Order Tracking &amp; Production Status</h2>
              <p className="text-xs text-charcoal/60 font-medium mt-0.5">
                Track your active hardware orders, chip programming verification, and BlueDart / Delhivery couriers.
              </p>
            </div>
            <button
              onClick={() => setViewHistory(false)}
              className="text-xs font-black text-[#4F83FF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>+ Order Another Tag</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
              <Package className="w-10 h-10 text-charcoal/30 stroke-[1.5]" />
              <p className="text-xs font-bold text-charcoal/60">No orders placed yet.</p>
              <button
                onClick={() => setViewHistory(false)}
                className="px-5 py-2.5 rounded-full bg-[#141518] text-white text-xs font-black"
              >
                Browse Hardware Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-black/10 flex items-center justify-center shrink-0 shadow-2xs">
                      {ord.productId.includes('sticker') ? (
                        <Radio className="w-6 h-6 text-emerald-600" />
                      ) : ord.productId.includes('card') ? (
                        <CreditCard className="w-6 h-6 text-[#4F83FF]" />
                      ) : ord.productId.includes('keychain') ? (
                        <Layers className="w-6 h-6 text-amber-600" />
                      ) : (
                        <Smartphone className="w-6 h-6 text-purple-600" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-sm text-charcoal">{ord.productName}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-white text-[10px] font-black text-charcoal border border-black/10">
                          {ord.colorName}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                          ₹{ord.priceINR} Paid
                        </span>
                      </div>

                      <div className="text-xs text-charcoal/70 mt-1.5 space-y-0.5">
                        <p className="font-semibold">
                          <span className="text-charcoal/50">Encoded Chip Action:</span>{' '}
                          <code className="px-1.5 py-0.5 rounded bg-white font-mono text-[11px] border border-black/5 text-[#4F83FF]">
                            {ord.chipTargetUrl}
                          </code>
                        </p>
                        <p className="font-medium">
                          <span className="text-charcoal/50">Laser Engraving:</span>{' '}
                          <span className="font-bold text-charcoal">{ord.engravedName}</span>
                          {ord.engravedTagline && ` • ${ord.engravedTagline}`}
                        </p>
                        <p className="font-medium">
                          <span className="text-charcoal/50">Deliver to:</span>{' '}
                          {ord.shipping.fullName}, {ord.shipping.city}, {ord.shipping.state} - {ord.shipping.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking & Status Right Side */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-black/5 shrink-0">
                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-xs font-black text-amber-700 uppercase tracking-wide">
                          {ord.orderStatus === 'in_queue' && 'In Production Queue'}
                          {ord.orderStatus === 'chip_encoding' && 'NTAG216 Chip Encoding'}
                          {ord.orderStatus === 'laser_engraving' && 'Precision Laser Engraving'}
                          {ord.orderStatus === 'dispatched' && 'Dispatched via BlueDart'}
                          {ord.orderStatus === 'delivered' && 'Delivered'}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-charcoal/50 mt-0.5">
                        Order #{ord.id} &bull; Placed {ord.createdAt}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-white border border-black/10 flex items-center gap-2 text-xs font-mono font-bold text-charcoal">
                      <Truck className="w-4 h-4 text-[#4F83FF]" />
                      <span>{ord.courier}: {ord.trackingNumber}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PRODUCT SELECTION & CUSTOMIZATION & INDIAN DELIVERY FORM */}
      {!viewHistory && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: PRODUCT SELECTION & LIVE PREVIEW (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Step 1: Select Hardware Item */}
            <div className="bg-white rounded-4xl p-6 border border-black/10 shadow-soft flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#141518] text-white flex items-center justify-center font-black text-xs">
                    1
                  </div>
                  <h3 className="font-black text-sm text-charcoal">Choose Your NFC Hardware</h3>
                </div>
                <span className="text-[11px] font-bold text-charcoal/50">
                  {PRODUCTS.length} Hardware Models Available
                </span>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRODUCTS.map((prod) => {
                  const isSelected = selectedProduct.id === prod.id;
                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className={`p-4 rounded-3xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[160px] ${
                        isSelected
                          ? 'bg-[#FAF7F2] border-[#141518] shadow-md ring-2 ring-black/5'
                          : 'bg-white border-black/10 hover:border-black/30 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 text-charcoal/70">
                            {prod.badge}
                          </span>
                          <span className="font-black text-sm text-charcoal">
                            ₹{prod.priceINR}
                          </span>
                        </div>

                        <h4 className="font-black text-xs text-charcoal leading-snug">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-charcoal/60 mt-1 font-medium line-clamp-2">
                          {prod.tagline}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-black/5">
                        <div className="flex items-center gap-1">
                          {prod.colors.map((c) => (
                            <span
                              key={c.id}
                              className="w-3.5 h-3.5 rounded-full border border-black/20"
                              style={{ backgroundColor: c.hex }}
                              title={c.name}
                            />
                          ))}
                        </div>
                        {isSelected ? (
                          <span className="w-5 h-5 rounded-full bg-[#141518] text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-charcoal/50">Select</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Color Finish Selector for Selected Product */}
              <div className="pt-3 border-t border-black/5">
                <label className="text-xs font-black text-charcoal block mb-2">
                  Select Finish / Material: <span className="font-bold text-[#4F83FF]">{selectedColor.name}</span>
                </label>
                <div className="flex flex-wrap items-center gap-2.5">
                  {selectedProduct.colors.map((col) => {
                    const isColSelected = selectedColor.id === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`px-3.5 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                          isColSelected
                            ? 'bg-white border-black text-charcoal shadow-xs ring-1 ring-black'
                            : 'bg-[#FAF7F2] border-black/10 hover:border-black/20 text-charcoal/70'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* LIVE PHYSICAL HARDWARE PREVIEW CANVAS */}
            <div className="bg-[#FAF7F2] rounded-4xl p-6 sm:p-8 border border-black/10 shadow-soft flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="w-full flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-wider text-charcoal/50">
                  Live Hardware Preview
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white text-[10px] font-bold text-charcoal border border-black/10">
                  NTAG216 Embedded Microchip
                </span>
              </div>

              {/* Physical Render Box */}
              <div className="w-full max-w-[420px] aspect-[85.6/54] relative select-none rounded-3xl p-6 shadow-2xl flex flex-col justify-between transition-all duration-300 border border-white/20 overflow-hidden"
                style={{
                  background: selectedColor.previewBg.startsWith('bg-') ? undefined : selectedColor.previewBg,
                  backgroundColor: selectedColor.hex
                }}
              >
                {/* Decorative Subtle Chip / Contact Antenna Lines */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-60">
                  <Radio className={`w-4 h-4 ${selectedColor.textClass}`} />
                  <span className={`text-[9px] font-mono font-bold tracking-widest ${selectedColor.textClass}`}>
                    NFC
                  </span>
                </div>

                {/* Top Section: Brand / Logo */}
                <div className="flex items-center gap-3">
                  {customLogoUrl ? (
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-white/20 border border-white/20 p-0.5">
                      <img src={customLogoUrl} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center font-black text-sm">
                      <Cpu className={`w-4 h-4 ${selectedColor.textClass}`} />
                    </div>
                  )}
                  <span className={`text-xs font-black tracking-wider uppercase ${selectedColor.textClass}`}>
                    TAPPING
                  </span>
                </div>

                {/* Middle/Bottom: Laser Engraved Custom Name & Tagline */}
                <div className="text-left mt-auto pt-4">
                  <p 
                    className={`font-black tracking-wide text-base sm:text-lg uppercase drop-shadow-xs truncate ${!laserTextColor ? selectedColor.textClass : ''}`}
                    style={laserTextColor ? { color: laserTextColor } : undefined}
                  >
                    {engravedName || 'YOUR FULL NAME'}
                  </p>
                  <p 
                    className={`text-[11px] font-medium tracking-wide opacity-80 uppercase truncate mt-0.5 ${!laserTextColor ? selectedColor.textClass : ''}`}
                    style={laserTextColor ? { color: laserTextColor } : undefined}
                  >
                    {engravedTagline || 'FOUNDER & ARCHITECT'}
                  </p>
                  <p 
                    className={`text-[9px] font-mono opacity-60 mt-1 truncate ${!laserTextColor ? selectedColor.textClass : ''}`}
                    style={laserTextColor ? { color: laserTextColor } : undefined}
                  >
                    Tap to launch: {targetUrl}
                  </p>
                </div>
              </div>

              {/* Hardware Specs Bullet Strip */}
              <div className="w-full mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                {selectedProduct.specs.slice(0, 4).map((spec, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-charcoal/70 bg-white/60 p-2 rounded-xl border border-black/5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DATA FILLING FORM & INDIAN SHIPPING FORM (lg:col-span-6) */}
          <div className="lg:col-span-6 flex flex-col gap-6">

            {/* Step 2: What Data to Write on the NFC Chip */}
            <div className="bg-white rounded-4xl p-6 border border-black/10 shadow-soft flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#141518] text-white flex items-center justify-center font-black text-xs">
                    2
                  </div>
                  <h3 className="font-black text-sm text-charcoal">NFC Chip Data Encoding Form</h3>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Pre-Programmed
                </span>
              </div>

              {/* Action Preset Selector */}
              <div>
                <label className="text-xs font-black text-charcoal block mb-1.5">
                  What should happen when someone taps your tag?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'profile', label: 'Tapping Bio Link', icon: Smartphone },
                    { id: 'vcard', label: 'Save Contact (.vcf)', icon: FileText },
                    { id: 'whatsapp', label: 'Direct WhatsApp', icon: Phone },
                    { id: 'reviews', label: 'Google Review', icon: MapPin },
                    { id: 'upi', label: 'UPI Payment Link', icon: CreditCard },
                    { id: 'custom', label: 'Custom URL', icon: ExternalLink }
                  ].map((act) => {
                    const isActActive = chipAction === act.id;
                    const IconComp = act.icon;
                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => handleChipActionChange(act.id)}
                        className={`p-2.5 rounded-2xl border text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                          isActActive
                            ? 'bg-[#141518] text-white border-[#141518] shadow-xs'
                            : 'bg-[#FAF7F2] hover:bg-black/5 text-charcoal/80 border-black/10'
                        }`}
                      >
                        <IconComp className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{act.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Programmed URL Input */}
              <div>
                <label className="text-xs font-black text-charcoal block mb-1">
                  Target URL / Action Link Encoded on Chip:
                </label>
                <input
                  type="text"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="https://yourlink.com"
                />
                <p className="text-[10px] text-charcoal/50 font-medium mt-1">
                  Our high-speed NFC programmers encode this exact URL into the internal NTAG216 chip.
                </p>
              </div>

              {/* Laser Engraving Details */}
              <div className="pt-2 border-t border-black/5 space-y-3">
                <label className="text-xs font-black text-charcoal block">
                  Custom Laser Engraving / Printed Text:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                      Primary Name / Heading:
                    </label>
                    <input
                      type="text"
                      value={engravedName}
                      onChange={(e) => setEngravedName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black uppercase"
                      placeholder="e.g. YOUR NAME"
                      maxLength={32}
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                      Role / Business Tagline:
                    </label>
                    <input
                      type="text"
                      value={engravedTagline}
                      onChange={(e) => setEngravedTagline(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black uppercase"
                      placeholder="e.g. FOUNDER & ARCHITECT"
                      maxLength={40}
                    />
                  </div>
                </div>

                {/* Laser Engraved Font / Text Color Selector */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-charcoal/70 block">
                      Laser Engraving Font &amp; Text Color:
                    </label>
                    {laserTextColor && (
                      <button
                        type="button"
                        onClick={() => setLaserTextColor('')}
                        className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                      >
                        Reset to Auto
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { name: 'Auto', hex: '' },
                      { name: 'Pure White', hex: '#FFFFFF' },
                      { name: 'Laser Gold', hex: '#D4AF37' },
                      { name: 'Stealth Black', hex: '#141518' },
                      { name: 'Cyber Cyan', hex: '#38BDF8' },
                      { name: 'Neon Lime', hex: '#22C55E' },
                      { name: 'Rose Coral', hex: '#F43F5E' },
                    ].map((col) => (
                      <button
                        key={col.name}
                        type="button"
                        onClick={() => setLaserTextColor(col.hex)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          laserTextColor === col.hex
                            ? 'bg-[#141518] text-white border-black shadow-2xs'
                            : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                        }`}
                      >
                        {col.hex && (
                          <div
                            className="w-2.5 h-2.5 rounded-full border border-black/20"
                            style={{ backgroundColor: col.hex }}
                          />
                        )}
                        <span>{col.name}</span>
                      </button>
                    ))}
                    <div className="flex items-center gap-1 pl-1">
                      <input
                        type="color"
                        value={laserTextColor || '#FFFFFF'}
                        onChange={(e) => setLaserTextColor(e.target.value)}
                        className="w-6 h-6 rounded-lg border border-black/10 cursor-pointer p-0"
                        title="Pick custom laser engraving color"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Logo Upload */}
                <div className="pt-2">
                  <label className="text-[11px] font-bold text-charcoal/70 block mb-1.5">
                    Optional Brand Logo for Precision Laser Etching:
                  </label>
                  <div className="flex items-center gap-3">
                    {customLogoUrl ? (
                      <div className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl bg-[#FAF7F2] border border-black/10">
                        <img src={customLogoUrl} alt="Logo" className="w-8 h-8 rounded-xl object-cover" />
                        <span className="text-[11px] font-bold text-charcoal">Custom Logo Attached</span>
                        <button
                          type="button"
                          onClick={() => setCustomLogoUrl('')}
                          className="p-1 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Remove custom logo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-black/5 text-charcoal text-xs font-bold border border-black/10 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5 text-charcoal/60" />
                        <span>Upload Logo (PNG / SVG)</span>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                    Special Production Instructions (Optional):
                  </label>
                  <textarea
                    rows={2}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-medium text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="e.g. Center-align the text, or leave chip open for rewrites..."
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Indian Delivery Shipping Address Form */}
            <div className="bg-white rounded-4xl p-6 border border-black/10 shadow-soft flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-black/5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#141518] text-white flex items-center justify-center font-black text-xs">
                    3
                  </div>
                  <h3 className="font-black text-sm text-charcoal">Pan-India Express Delivery Address</h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Indian Pincode
                </span>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                    Recipient Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Your Full Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                    Mobile Number (for Delivery SMS) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                  Email Address (for Dispatch &amp; Tracking Tracking Link) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Address Line */}
              <div>
                <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                  Flat, House No., Building, Street Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. Flat 402, Sunshine Heights, 100ft Road"
                />
              </div>

              {/* Landmark, City, State, PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Near BDA Complex / Metro Pillar 42"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Bengaluru"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black cursor-pointer"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-charcoal/70 block mb-1">
                    PIN Code (6 Digits) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-mono font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="560038"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY & PLACE ORDER BUTTON */}
            <div className="bg-[#141518] text-white rounded-4xl p-6 sm:p-7 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#B6F554]" />
                  <span className="font-black text-sm text-white">Order Summary</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-black text-white/80">
                  Instant UPI &bull; Razorpay Sandbox
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-white/70">
                  <span>{selectedProduct.name} ({selectedColor.name})</span>
                  <span className="font-black text-white">₹{selectedProduct.priceINR}</span>
                </div>

                <div className="flex justify-between items-center text-white/70">
                  <span>Pan-India BlueDart Express Courier</span>
                  <span className="font-bold text-[#B6F554]">FREE</span>
                </div>

                <div className="flex justify-between items-center text-white/70">
                  <span>NTAG216 Chip Encoding &amp; Fiber Laser Engraving</span>
                  <span className="font-bold text-[#B6F554]">Included</span>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center">
                  <div>
                    <span className="font-black text-base text-white">Total Amount</span>
                    <p className="text-[10px] text-white/50 font-medium">Inclusive of all Indian taxes &amp; GST</p>
                  </div>
                  <span className="font-black text-xl text-[#B6F554]">
                    ₹{selectedProduct.priceINR}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isOrdering}
                className="w-full py-4 px-6 rounded-2xl bg-[#B6F554] hover:bg-[#a6e644] text-charcoal font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer disabled:opacity-60"
              >
                {isOrdering ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>Programming Chip &amp; Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order &bull; Pay ₹{selectedProduct.priceINR}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-white/50 pt-1">
                <span>&bull; Lifetime Chip Warranty</span>
                <span>&bull; BlueDart Tracked</span>
                <span>&bull; 100% Indian Made</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* CONFIRMATION POPUP MODAL */}
      {orderConfirmed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 sm:p-8 max-w-lg w-full border border-black/10 shadow-float text-left animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-charcoal font-mono font-bold text-[11px] border border-black/10">
                ORDER #{orderConfirmed.id}
              </span>
              <h3 className="text-xl font-black text-charcoal mt-2">
                Hardware Order Queued for Production!
              </h3>
              <p className="text-xs text-charcoal/70 font-medium mt-1 leading-relaxed">
                Thank you! Your custom <strong>{orderConfirmed.productName}</strong> ({orderConfirmed.colorName}) is now in our precision laser engraving &amp; NTAG216 chip programming queue.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal/60">Chip URL Target:</span>
                <span className="font-mono font-bold text-charcoal truncate max-w-[220px]">
                  {orderConfirmed.chipTargetUrl}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Laser Engraving:</span>
                <span className="font-bold text-charcoal">{orderConfirmed.engravedName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Shipping Destination:</span>
                <span className="font-bold text-charcoal text-right">
                  {orderConfirmed.shipping.city}, {orderConfirmed.shipping.state} ({orderConfirmed.shipping.pincode})
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-black/5">
                <span className="text-charcoal/60">Courier Partner:</span>
                <span className="font-bold text-emerald-600">
                  {orderConfirmed.courier} ({orderConfirmed.trackingNumber})
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setOrderConfirmed(null);
                  setViewHistory(true);
                }}
                className="flex-1 py-3 rounded-2xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-md shadow-[#4F83FF]/20 transition-transform active:scale-95 cursor-pointer"
              >
                View Tracking &amp; Status
              </button>
              <button
                type="button"
                onClick={() => setOrderConfirmed(null)}
                className="px-5 py-3 rounded-2xl bg-[#FAF7F2] hover:bg-black/5 text-charcoal text-xs font-bold border border-black/10 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
