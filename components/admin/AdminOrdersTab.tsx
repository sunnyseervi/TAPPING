'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Truck, 
  Check, 
  Clock, 
  MapPin, 
  ExternalLink, 
  Printer, 
  Search,
  CheckCircle2,
  X,
  Eye,
  Download,
  Layers,
  ShieldCheck,
  QrCode,
  Sparkles,
  FileText,
  Copy,
  ZoomIn,
  Move,
  CreditCard,
  Palette,
  Type,
  Maximize2
} from 'lucide-react';
import { MetalCardOrder, CardSideConfig, CardMaterial, NFCCardDesign } from '@/lib/types';
import { useToast } from '@/components/ui/Toast';
import QRCodeGenerator from 'qrcode';
import { exportCardAsPng, exportCardAsPdf } from '@/lib/cardExporter';

interface AdminOrdersTabProps {
  orders: MetalCardOrder[];
  onUpdateOrderStatus: (orderId: string, status: MetalCardOrder['status'], trackingNumber?: string) => void;
}

export default function AdminOrdersTab({
  orders,
  onUpdateOrderStatus,
}: AdminOrdersTabProps) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<MetalCardOrder | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [carrierInput, setCarrierInput] = useState('Delhivery Surface Pro');

  // Blueprint & Laser Workshop Inspector Modal State
  const [inspectingOrder, setInspectingOrder] = useState<MetalCardOrder | null>(null);
  const [activeSide, setActiveSide] = useState<'front' | 'back' | 'both'>('front');
  const [showSafeGuides, setShowSafeGuides] = useState(true);
  const [inspectingQrDataUrl, setInspectingQrDataUrl] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  // Generate QR code whenever the inspecting order changes
  useEffect(() => {
    if (!inspectingOrder) {
      setInspectingQrDataUrl('');
      return;
    }
    const target = inspectingOrder.qrUrl || `https://tapping.bio/${inspectingOrder.userName.toLowerCase().replace(/\s+/g, '')}`;
    QRCodeGenerator.toDataURL(target, { width: 400, margin: 1, errorCorrectionLevel: 'M' })
      .then(setInspectingQrDataUrl)
      .catch(console.error);
  }, [inspectingOrder]);

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.engravedName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (orderId: string, newStatus: MetalCardOrder['status']) => {
    onUpdateOrderStatus(orderId, newStatus);
    showToast('Order Status Updated', `Status changed to ${newStatus.toUpperCase()}`, 'success');
    if (inspectingOrder && inspectingOrder.id === orderId) {
      setInspectingOrder((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForTracking) return;
    onUpdateOrderStatus(selectedOrderForTracking.id, 'shipped', trackingInput);
    showToast('Tracking Saved & Dispatched', `Tracking ID ${trackingInput} assigned`, 'success');
    setSelectedOrderForTracking(null);
  };

  // Helper for material name
  const getMaterialName = (mat: string, customColor?: string) => {
    switch (mat) {
      case 'matte_black': return 'Matte Stealth Black';
      case 'brushed_gold': return '24K Brushed Gold';
      case 'rose_gold': return 'Rose Gold';
      case 'titanium_silver': return 'Titanium Silver';
      case 'custom_color': return `Custom Color (${customColor || '#1A365D'})`;
      default: return mat.replace('_', ' ').toUpperCase();
    }
  };

  // Helper for material classes
  const getMaterialClasses = (mat: string) => {
    switch (mat) {
      case 'matte_black': return 'metal-matte-black text-white';
      case 'brushed_gold': return 'metal-brushed-gold text-slate-900';
      case 'rose_gold': return 'metal-rose-gold text-slate-900';
      case 'titanium_silver': return 'metal-titanium-silver text-slate-900';
      default: return 'metal-custom-color';
    }
  };

  const isColorDark = (hex?: string) => {
    if (!hex) return true;
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) || 0;
    const g = parseInt(clean.substring(2, 4), 16) || 0;
    const b = parseInt(clean.substring(4, 6), 16) || 0;
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 160;
  };

  // Positioning class helpers
  const getBrandPositionClass = (pos?: string) => {
    switch (pos) {
      case 'top-center': return 'top-0 left-1/2 -translate-x-1/2 text-center';
      case 'top-right': return 'top-0 right-0 text-right';
      case 'bottom-left': return 'bottom-0 left-0 text-left';
      case 'bottom-right': return 'bottom-0 right-0 text-right';
      default: return 'top-0 left-0 text-left';
    }
  };

  const getChipPositionClass = (pos?: string) => {
    switch (pos) {
      case 'top-left': return 'top-0 left-0';
      case 'bottom-right': return 'bottom-0 right-0';
      case 'bottom-left': return 'bottom-0 left-0';
      case 'hidden': return 'hidden';
      default: return 'top-0 right-0';
    }
  };

  const getNamePositionClass = (pos?: string) => {
    switch (pos) {
      case 'top-left': return 'top-7 left-0 text-left';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-[90%]';
      case 'bottom-center': return 'bottom-0 left-1/2 -translate-x-1/2 text-center w-[90%]';
      case 'bottom-right': return 'bottom-0 right-0 text-right';
      default: return 'bottom-0 left-0 text-left';
    }
  };

  const getQrPositionClass = (pos?: string) => {
    switch (pos) {
      case 'top-right': return 'top-0 right-0';
      case 'top-left': return 'top-0 left-0';
      case 'bottom-left': return 'bottom-0 left-0';
      case 'center': return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
      default: return 'bottom-0 right-0';
    }
  };

  // Synthesize NFCCardDesign for the exporter functions
  const synthesizeCardDesign = (order: MetalCardOrder): NFCCardDesign => {
    return {
      id: order.id,
      material: order.material,
      customColor: order.customColor,
      sideMode: order.sideMode || 'double_sided',
      frontSide: order.frontSide,
      backSide: order.backSide,
      engravedName: order.engravedName,
      engravedTagline: order.engravedTagline,
      qrCodeEnabled: true,
      redirectMode: 'profile',
      cardUid: `${order.orderNumber}-UID`,
      orderStatus: (order.status === 'pending' || order.status === 'cancelled') ? 'ordered' : order.status,
      trackingNumber: order.trackingNumber,
      shippingAddress: order.shippingAddress,
    };
  };

  const handleExportPngSide = async (order: MetalCardOrder, side: 'front' | 'back') => {
    setIsExporting(true);
    try {
      const design = synthesizeCardDesign(order);
      await exportCardAsPng(
        design,
        order.material,
        side,
        order.userName.toLowerCase().replace(/\s+/g, ''),
        typeof window !== 'undefined' ? window.location.host : 'tapping.bio'
      );
      showToast('PNG Downloaded', `Exported 300 DPI ${side.toUpperCase()} card image`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Export Error', 'Could not export high-res PNG', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdfSide = async (order: MetalCardOrder, side: 'front' | 'back') => {
    setIsExporting(true);
    try {
      const design = synthesizeCardDesign(order);
      await exportCardAsPdf(
        design,
        order.material,
        side,
        order.userName.toLowerCase().replace(/\s+/g, ''),
        typeof window !== 'undefined' ? window.location.host : 'tapping.bio'
      );
      showToast('Vector PDF Exported', `Print-ready laser vector sheet generated for ${side.toUpperCase()}`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Export Error', 'Could not export vector PDF', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDirectPrintTicket = (order: MetalCardOrder) => {
    setInspectingOrder(order);
    setTimeout(() => {
      window.print();
    }, 250);
  };

  // Render a single side of the card with 100% fidelity
  const renderCardSurface = (order: MetalCardOrder, side: 'front' | 'back') => {
    const isFront = side === 'front';
    const cfg: CardSideConfig = isFront ? (order.frontSide || {}) : (order.backSide || {});
    const isCustom = order.material === 'custom_color';
    const darkTheme = order.material === 'matte_black' || (isCustom && (!order.customColor || isColorDark(order.customColor)));
    const textColor = cfg.textColor || (darkTheme ? '#FFFFFF' : '#141518');
    const fontFamily = cfg.fontFamily || "'Plus Jakarta Sans', sans-serif";

    return (
      <div 
        className={`w-full max-w-[390px] h-[245px] rounded-3xl p-6 relative select-none shadow-2xl border border-black/15 overflow-hidden flex flex-col justify-between ${isCustom ? '' : getMaterialClasses(order.material)}`}
        style={{
          fontFamily,
          backgroundColor: isCustom ? (order.customColor || '#1A365D') : undefined,
          color: textColor,
        }}
      >
        {/* Custom Uploaded Artwork Layer (if provided by customer) */}
        {cfg.artworkUrl && (
          <div 
            className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform duration-75"
            style={{ 
              backgroundImage: `url(${cfg.artworkUrl})`,
              backgroundSize: `${cfg.artworkZoom ?? 100}%`,
              backgroundPosition: `calc(50% + ${cfg.artworkPosX ?? 0}px) calc(50% + ${cfg.artworkPosY ?? 0}px)`,
              opacity: (cfg.artworkOpacity ?? 90) / 100,
            }}
          />
        )}

        {/* Specular Metallic Sheen Lighting */}
        <div className="absolute inset-0 z-1 bg-gradient-to-tr from-white/10 via-transparent to-black/25 pointer-events-none" />

        {/* 5mm Safe Print Boundary (Dashed overlay for workshop precision) */}
        {showSafeGuides && (
          <div className="absolute inset-[18px] z-5 border border-dashed border-emerald-400/40 rounded-2xl pointer-events-none flex items-start justify-end p-1">
            <span className="text-[7px] font-mono uppercase tracking-wider text-emerald-400/80 bg-black/40 px-1 rounded">5mm Safe Zone</span>
          </div>
        )}

        {/* Contained Blueprint Elements within Safe Margin */}
        <div className="absolute inset-[18px] z-10 pointer-events-none">
          {isFront ? (
            /* FRONT FACE ELEMENTS */
            <>
              {/* Brand Header */}
              <div 
                className={`absolute z-10 ${getBrandPositionClass(cfg.brandPosition)}`}
                style={{
                  transform: `translate(${cfg.brandOffsetX || 0}px, ${cfg.brandOffsetY || 0}px)`,
                }}
              >
                <span 
                  className="font-extrabold tracking-widest uppercase block"
                  style={{ 
                    color: textColor,
                    fontSize: `${cfg.brandSize || 13}px`,
                    lineHeight: 1.15
                  }}
                >
                  {cfg.topLabel || 'TAPPING'}
                </span>
                <span 
                  className="font-mono opacity-70 block"
                  style={{ 
                    fontSize: `${Math.max(7, Math.round((cfg.brandSize || 13) * 0.65))}px`,
                    color: textColor
                  }}
                >
                  {cfg.bottomLabel || `NFC 13.56MHz • ${order.orderNumber}`}
                </span>
              </div>

              {/* Hardware Contactless Chip */}
              {cfg.showChip !== false && (
                <div className={`absolute z-10 ${getChipPositionClass(cfg.chipPosition)}`}>
                  <div className="w-9 h-6 rounded-md bg-amber-400/90 border border-amber-600/50 flex flex-col justify-around p-1 shadow-2xs">
                    <div className="w-full h-0.5 bg-amber-800/40" />
                    <div className="w-full h-0.5 bg-amber-800/40" />
                  </div>
                </div>
              )}

              {/* Engraved Primary Name & Tagline */}
              <div 
                className={`absolute z-10 ${getNamePositionClass(cfg.namePosition)} max-w-[210px]`}
                style={{
                  transform: `translate(${cfg.nameOffsetX || 0}px, ${cfg.nameOffsetY || 0}px)`,
                }}
              >
                <p 
                  className="tracking-widest uppercase opacity-80 truncate"
                  style={{ 
                    color: textColor,
                    fontSize: `${cfg.secondaryTextSize || 9}px`,
                    lineHeight: 1.2,
                    transform: `translate(${cfg.secondaryOffsetX || 0}px, ${cfg.secondaryOffsetY || 0}px)`,
                  }}
                >
                  {cfg.secondaryText || order.engravedTagline || 'DIGITAL CREATOR & FOUNDER'}
                </p>
                <h3 
                  className="font-bold tracking-widest mt-0.5 uppercase truncate"
                  style={{ 
                    color: textColor,
                    fontSize: `${cfg.primaryTextSize || 18}px`,
                    lineHeight: 1.15
                  }}
                >
                  {cfg.primaryText || order.engravedName || order.userName.toUpperCase()}
                </h3>
                <p 
                  className="opacity-80 mt-0.5 truncate font-mono"
                  style={{ 
                    color: textColor,
                    fontSize: `${Math.max(7, Math.round((cfg.secondaryTextSize || 9) * 0.9))}px`
                  }}
                >
                  {order.qrUrl.replace('https://', '').replace('http://', '')}
                </p>
              </div>

              {/* QR Code on Front (if single-sided or explicitly enabled) */}
              {(order.sideMode === 'single_sided' || cfg.showQrCode) && (
                <div 
                  className={`absolute z-10 ${getQrPositionClass(cfg.qrPosition)} bg-white p-1 rounded-xl shadow-md flex items-center justify-center`}
                  style={{
                    width: `${cfg.qrSize || 56}px`,
                    height: `${cfg.qrSize || 56}px`,
                    transform: `translate(${cfg.qrOffsetX || 0}px, ${cfg.qrOffsetY || 0}px)`,
                  }}
                >
                  {inspectingQrDataUrl ? (
                    <img src={inspectingQrDataUrl} alt="QR" className="h-full w-full object-contain" />
                  ) : (
                    <QrCode className="w-full h-full text-black" />
                  )}
                </div>
              )}
            </>
          ) : (
            /* BACK FACE ELEMENTS */
            <>
              {cfg.isPlain ? (
                /* Plain Surface Mode */
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full bg-black/25 backdrop-blur-xs border border-white/10 opacity-75">
                    Plain Anodized Finish (No Laser Markings)
                  </span>
                </div>
              ) : (
                /* Standard Dual-Sided Back Face */
                <div className="flex items-center justify-between h-full">
                  <div 
                    className="flex flex-col justify-between h-full min-w-0 pr-4"
                    style={{
                      transform: `translate(${cfg.nameOffsetX || 0}px, ${cfg.nameOffsetY || 0}px)`,
                    }}
                  >
                    <div>
                      <span 
                        className="font-bold uppercase tracking-wider block"
                        style={{ 
                          color: textColor,
                          fontSize: `${cfg.primaryTextSize || 13}px`
                        }}
                      >
                        {cfg.primaryText || 'TAP ANY PHONE TO CONNECT'}
                      </span>
                      <p 
                        className="mt-1.5 opacity-90 truncate font-mono"
                        style={{ 
                          color: textColor,
                          fontSize: `${cfg.secondaryTextSize || 11}px`
                        }}
                      >
                        {cfg.secondaryText || order.qrUrl}
                      </p>
                    </div>

                    <div 
                      className="font-mono opacity-70"
                      style={{ 
                        color: textColor,
                        fontSize: '9px' 
                      }}
                    >
                      {cfg.bottomLabel || `UID: ${order.orderNumber}-BLK`}
                      <br />
                      {cfg.customNote || 'Encrypted NTAG216 Chip • 888 Bytes'}
                    </div>
                  </div>

                  {/* Back Face QR Code */}
                  {cfg.showQrCode !== false && (
                    <div 
                      className="bg-white p-1 rounded-xl flex items-center justify-center shrink-0 shadow-md"
                      style={{
                        width: `${cfg.qrSize || 64}px`,
                        height: `${cfg.qrSize || 64}px`,
                        transform: `translate(${cfg.qrOffsetX || 0}px, ${cfg.qrOffsetY || 0}px)`,
                      }}
                    >
                      {inspectingQrDataUrl ? (
                        <img src={inspectingQrDataUrl} alt="QR" className="h-full w-full object-contain" />
                      ) : (
                        <QrCode className="w-full h-full text-black" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header Card */}
      <div className="p-6 rounded-4xl bg-white border border-black/10 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6F554] text-charcoal border border-black/10 text-[10px] font-black uppercase tracking-wider mb-2">
            <Package className="w-3.5 h-3.5" />
            <span>Fulfillment Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight">
            Laser-Engraved Metal NFC Card Orders
          </h2>
          <p className="text-xs text-charcoal/60 mt-1 font-medium">
            Manage production blueprints, laser etching queue, tracking IDs, and courier delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 bg-[#FAF7F2] rounded-2xl border border-black/5 text-right">
            <span className="text-[10px] font-bold text-charcoal/50 uppercase block">Active Queue</span>
            <span className="text-lg font-black text-charcoal">
              {orders.filter((o) => o.status !== 'delivered').length} Orders
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, recipient name, or engraved text..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-black/10 text-xs font-bold text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:ring-1 focus:ring-[#4F83FF] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white border border-black/10 shadow-2xs overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All Orders (${orders.length})` },
            { id: 'pending', label: 'Pending' },
            { id: 'in_production', label: 'In Production' },
            { id: 'shipped', label: 'Shipped' },
            { id: 'delivered', label: 'Delivered' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#141518] text-white shadow-2xs'
                  : 'text-charcoal/60 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-4xl border border-black/10 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-black/10 text-[10px] font-black uppercase tracking-wider text-charcoal/60">
              <tr>
                <th className="py-3.5 px-5">Order ID &bull; Date</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Card Hardware &bull; Custom Finish</th>
                <th className="py-3.5 px-4">Shipping Destination</th>
                <th className="py-3.5 px-4">Courier &bull; Tracking</th>
                <th className="py-3.5 px-4">Status &bull; Price</th>
                <th className="py-3.5 px-5 text-right">Blueprint &bull; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-charcoal/50 font-bold">
                    No hardware orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  const hasCustomArtwork = !!(order.frontSide?.artworkUrl || order.backSide?.artworkUrl);

                  return (
                    <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Order # and Date */}
                      <td className="py-3.5 px-5">
                        <span className="font-mono font-black text-charcoal block">{order.orderNumber}</span>
                        <span className="text-[10px] text-charcoal/50 font-mono">{dateStr}</span>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <p className="font-black text-charcoal">{order.userName}</p>
                        <p className="text-[10px] text-charcoal/50 font-mono truncate">{order.userEmail}</p>
                        <p className="text-[10px] text-charcoal/50">{order.userPhone}</p>
                      </td>

                      {/* Card Hardware & Engraving */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span 
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-white text-[10px] font-black"
                            style={{
                              backgroundColor: order.material === 'custom_color' ? (order.customColor || '#1A365D') : '#141518',
                              color: order.material === 'custom_color' && !isColorDark(order.customColor) ? '#141518' : '#FFFFFF',
                              border: '1px solid rgba(0,0,0,0.1)'
                            }}
                          >
                            {order.material === 'custom_color' && (
                              <span 
                                className="w-2 h-2 rounded-full border border-white/40" 
                                style={{ backgroundColor: order.customColor || '#1A365D' }}
                              />
                            )}
                            <span>{getMaterialName(order.material, order.customColor)}</span>
                          </span>

                          {hasCustomArtwork && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 text-[9px] font-bold">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Artwork Attached</span>
                            </span>
                          )}

                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-black/5 text-charcoal/70">
                            {order.sideMode === 'single_sided' ? 'Single Sided' : 'Dual Sided'}
                          </span>
                        </div>

                        <p className="text-xs font-black text-charcoal mt-1">
                          {order.engravedName}
                        </p>
                        <p className="text-[10px] text-charcoal/60 truncate font-mono">
                          {order.engravedTagline}
                        </p>
                      </td>

                      {/* Shipping Address */}
                      <td className="py-3.5 px-4 max-w-xs text-[11px] text-charcoal/70">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                          <span className="leading-tight">
                            {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}
                          </span>
                        </div>
                      </td>

                      {/* Tracking Number */}
                      <td className="py-3.5 px-4">
                        {order.trackingNumber ? (
                          <div>
                            <span className="font-mono font-bold text-charcoal text-[11px] block">
                              {order.trackingNumber}
                            </span>
                            <span className="text-[10px] text-charcoal/50">
                              {order.shippingCarrier || 'Delhivery Express'}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Awaiting Tracking
                          </span>
                        )}
                      </td>

                      {/* Status & Price */}
                      <td className="py-3.5 px-4">
                        <span className="font-black text-charcoal block">&#8377;{order.amount} ({order.paymentMethod || 'UPI'})</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order.id, e.target.value as any)}
                          className={`mt-1 text-[10px] font-black px-2 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                            order.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : order.status === 'shipped'
                              ? 'bg-[#EFF4FF] text-[#4F83FF] border-[#4F83FF]/30'
                              : 'bg-[#FDF166] text-charcoal border-black/10'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="in_production">In Production</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* THE REQUESTED EYE BUTTON: Inspect Design Blueprint */}
                          <button
                            type="button"
                            onClick={() => {
                              setInspectingOrder(order);
                              setActiveSide('front');
                            }}
                            className="p-2 rounded-xl bg-[#141518] hover:bg-black text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                            title="Inspect Exact Card Design Blueprint & Specs"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#B6F554]" />
                            <span className="hidden sm:inline">Inspect Design</span>
                          </button>

                          {/* DIRECT PRINT BUTTON */}
                          <button
                            type="button"
                            onClick={() => handleDirectPrintTicket(order)}
                            className="p-2 rounded-xl bg-white hover:bg-gray-100 text-charcoal border border-black/10 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                            title="Direct Print Laser Workshop Blueprint"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* EDIT TRACKING BUTTON */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOrderForTracking(order);
                              setTrackingInput(order.trackingNumber || '');
                              setCarrierInput(order.shippingCarrier || 'Delhivery Surface Pro');
                            }}
                            className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-gray-200 text-charcoal text-xs font-bold transition-colors cursor-pointer"
                            title="Assign Tracking ID"
                          >
                            <Truck className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================================================
          THE FULL LASER WORKSHOP PRODUCTION & CARD BLUEPRINT INSPECTION MODAL
          ========================================================================= */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-4xl w-full max-w-5xl border border-black/10 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 md:p-6 bg-[#FAF7F2] border-b border-black/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#141518] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#B6F554]" />
                    <span>Laser Workshop Production Blueprint</span>
                  </span>
                  <span className="text-xs font-mono font-black text-charcoal px-2.5 py-0.5 rounded-lg bg-white border border-black/10">
                    {inspectingOrder.orderNumber}
                  </span>
                  <span className="text-xs font-bold text-charcoal/70">
                    &bull; Recipient: <strong className="text-charcoal">{inspectingOrder.userName}</strong>
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-charcoal tracking-tight">
                  High-Precision CNC Laser Etching &amp; NFC Encoding Job
                </h3>
                <p className="text-xs text-charcoal/60 mt-0.5">
                  Verify laser beam parameters, custom artwork layer, exact fonts, element coordinates, and print ticket.
                </p>
              </div>

              {/* Header Right Actions */}
              <div className="flex items-center gap-2 self-end md:self-auto">
                <select
                  value={inspectingOrder.status}
                  onChange={(e) => handleUpdateStatus(inspectingOrder.id, e.target.value as any)}
                  className={`text-xs font-black px-3 py-2 rounded-xl border focus:outline-none cursor-pointer ${
                    inspectingOrder.status === 'delivered'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : inspectingOrder.status === 'shipped'
                      ? 'bg-[#EFF4FF] text-[#4F83FF] border-[#4F83FF]/30'
                      : 'bg-[#FDF166] text-charcoal border-black/10'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="in_production">In Production</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  title="Print A4 Workshop Job Ticket"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Ticket</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectingOrder(null)}
                  className="p-2 rounded-xl bg-white hover:bg-gray-100 border border-black/10 text-charcoal cursor-pointer"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: 2-Column Split */}
            <div className="p-5 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[75vh] overflow-y-auto">
              
              {/* LEFT COLUMN: Visual Hardware Proof & 3D Interactive Card (7 Columns) */}
              <div className="lg:col-span-7 flex flex-col items-center gap-4">
                
                {/* Side Toggle & Safe Zone Controls Bar */}
                <div className="w-full flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center p-1 rounded-2xl bg-[#FAF7F2] border border-black/10">
                    <button
                      type="button"
                      onClick={() => setActiveSide('front')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeSide === 'front' ? 'bg-[#141518] text-white shadow-2xs' : 'text-charcoal/70 hover:text-black'
                      }`}
                    >
                      Front Face (Identity)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSide('back')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeSide === 'back' ? 'bg-[#141518] text-white shadow-2xs' : 'text-charcoal/70 hover:text-black'
                      }`}
                    >
                      Reverse Face (QR)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSide('both')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeSide === 'both' ? 'bg-[#141518] text-white shadow-2xs' : 'text-charcoal/70 hover:text-black'
                      }`}
                    >
                      Dual Proof View
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSafeGuides(!showSafeGuides)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                      showSafeGuides ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-gray-50 text-charcoal/60 border-black/10'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>5mm Safe Zone: {showSafeGuides ? 'ON' : 'OFF'}</span>
                  </button>
                </div>

                {/* The Physical Metal Card Visual Proof Container */}
                <div className="w-full p-4 md:p-6 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col items-center justify-center min-h-[300px]">
                  {activeSide === 'both' ? (
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
                      <div className="flex flex-col items-center gap-1.5 w-full max-w-[320px]">
                        <span className="text-[10px] font-mono font-bold text-charcoal/60 uppercase">Front Face</span>
                        <div className="scale-90 origin-top">
                          {renderCardSurface(inspectingOrder, 'front')}
                        </div>
                      </div>
                      <div className="flex flex-col items-center gap-1.5 w-full max-w-[320px]">
                        <span className="text-[10px] font-mono font-bold text-charcoal/60 uppercase">Reverse Face</span>
                        <div className="scale-90 origin-top">
                          {renderCardSurface(inspectingOrder, 'back')}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-charcoal/60 uppercase">
                        {activeSide === 'front' ? 'FRONT FACE BLUEPRINT' : 'REVERSE FACE BLUEPRINT'}
                      </span>
                      {renderCardSurface(inspectingOrder, activeSide)}
                    </div>
                  )}
                </div>

                {/* Customer Uploaded Artwork Notice & Asset Downloader (if provided) */}
                {((activeSide === 'front' && inspectingOrder.frontSide?.artworkUrl) || 
                  (activeSide === 'back' && inspectingOrder.backSide?.artworkUrl) ||
                  (activeSide === 'both' && (inspectingOrder.frontSide?.artworkUrl || inspectingOrder.backSide?.artworkUrl))) && (
                  <div className="w-full p-3.5 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-black text-violet-950 truncate">Customer Uploaded Custom Artwork Attached</p>
                        <p className="text-[10px] text-violet-700">High-res artwork file integrated into card laser background</p>
                      </div>
                    </div>

                    <a
                      href={inspectingOrder.frontSide?.artworkUrl || inspectingOrder.backSide?.artworkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs shrink-0 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Artwork</span>
                    </a>
                  </div>
                )}

                {/* Workshop Export Buttons */}
                <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExportPngSide(inspectingOrder, 'front')}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-50 border border-black/10 text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#4F83FF]" />
                    <span>Front (PNG)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExportPngSide(inspectingOrder, 'back')}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-50 border border-black/10 text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#4F83FF]" />
                    <span>Back (PNG)</span>
                  </button>

                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={() => handleExportPdfSide(inspectingOrder, 'front')}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-50 border border-black/10 text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Laser PDF</span>
                  </button>

                  <a
                    href={inspectingQrDataUrl}
                    download={`${inspectingOrder.orderNumber}-Scannable-QR.png`}
                    className="py-2.5 px-3 rounded-xl bg-white hover:bg-gray-50 border border-black/10 text-charcoal text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <QrCode className="w-3.5 h-3.5 text-purple-600" />
                    <span>Get QR</span>
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: Full Laser Machine Parameters & Engineering Specs (5 Columns) */}
              <div className="lg:col-span-5 flex flex-col gap-4 text-xs">
                
                {/* 1. Hardware Base & Laser Specs */}
                <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-black/5">
                    <span className="font-black text-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-[#4F83FF]" />
                      <span>Hardware &amp; Surface Spec</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-charcoal/60">
                      CR-80 Format (85.6 × 53.98mm)
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Material Base:</span>
                      <span className="font-black text-charcoal flex items-center gap-1">
                        {inspectingOrder.material === 'custom_color' && (
                          <span 
                            className="w-3 h-3 rounded-full border border-black/20" 
                            style={{ backgroundColor: inspectingOrder.customColor || '#1A365D' }} 
                          />
                        )}
                        <span>{getMaterialName(inspectingOrder.material, inspectingOrder.customColor)}</span>
                      </span>
                    </div>

                    {inspectingOrder.material === 'custom_color' && (
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="text-charcoal/60">Custom Hex Code:</span>
                        <span className="font-bold text-charcoal px-2 py-0.5 rounded bg-white border border-black/10">
                          {inspectingOrder.customColor || '#1A365D'}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Side Mode:</span>
                      <span className="font-black text-charcoal">
                        {inspectingOrder.sideMode === 'single_sided' ? 'Single-Sided (Plain Back)' : 'Double-Sided Laser Etched'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Laser Beam Infill Color:</span>
                      <span className="font-mono font-black text-charcoal flex items-center gap-1.5">
                        <span 
                          className="w-3 h-3 rounded-full border border-black/20" 
                          style={{ backgroundColor: inspectingOrder.frontSide?.textColor || '#FFFFFF' }} 
                        />
                        <span>{inspectingOrder.frontSide?.textColor || '#FFFFFF'}</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">NFC Core Chip:</span>
                      <span className="font-mono font-bold text-charcoal">
                        NXP NTAG216 &bull; 13.56MHz (888 Bytes)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Recommended Machine:</span>
                      <span className="font-mono text-[10px] text-charcoal/80">
                        35W Fiber MOPA &bull; 800mm/s &bull; 30kHz
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Typography & Placement Geometry */}
                <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-black/5">
                    <span className="font-black text-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Typography &amp; Layout Offsets</span>
                    </span>
                    <span className="text-[10px] font-mono text-charcoal/60">Precision Grid</span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Typography Font:</span>
                      <span className="font-mono font-bold text-charcoal truncate max-w-[180px]">
                        {inspectingOrder.frontSide?.fontFamily?.replace(/'/g, '').split(',')[0] || 'Plus Jakarta Sans'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Primary Name Size:</span>
                      <span className="font-mono font-bold text-charcoal">
                        {inspectingOrder.frontSide?.primaryTextSize || 18} px (X: {inspectingOrder.frontSide?.nameOffsetX || 0}, Y: {inspectingOrder.frontSide?.nameOffsetY || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Tagline / Role Size:</span>
                      <span className="font-mono font-bold text-charcoal">
                        {inspectingOrder.frontSide?.secondaryTextSize || 9} px
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">Brand Logo Size:</span>
                      <span className="font-mono font-bold text-charcoal">
                        {inspectingOrder.frontSide?.brandSize || 13} px ({inspectingOrder.frontSide?.brandPosition || 'top-left'})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">QR Code Size &amp; Pos:</span>
                      <span className="font-mono font-bold text-charcoal">
                        {inspectingOrder.frontSide?.qrSize || 56} px ({inspectingOrder.frontSide?.qrPosition || 'bottom-right'})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-charcoal/60">QR Target URL:</span>
                      <a 
                        href={inspectingOrder.qrUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="font-mono text-[#4F83FF] hover:underline truncate max-w-[170px]"
                      >
                        {inspectingOrder.qrUrl}
                      </a>
                    </div>
                  </div>
                </div>

                {/* 3. Customer Notes & Engraving Instructions */}
                {inspectingOrder.notes && (
                  <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                      Customer Engraving Instructions
                    </span>
                    <p className="text-xs font-medium text-amber-950 italic">
                      &ldquo;{inspectingOrder.notes}&rdquo;
                    </p>
                  </div>
                )}

                {/* 4. Shipping Address & Contact Destination */}
                <div className="p-4 rounded-3xl bg-white border border-black/10 space-y-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-black/5">
                    <span className="font-black text-charcoal uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-rose-500" />
                      <span>Delivery &amp; Customer Contact</span>
                    </span>
                    <span className="text-[10px] font-bold text-charcoal px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                      &#8377;{inspectingOrder.amount} &bull; {inspectingOrder.paymentStatus.toUpperCase()}
                    </span>
                  </div>

                  <p className="font-black text-charcoal text-xs">
                    {inspectingOrder.shippingAddress?.name || inspectingOrder.userName}
                  </p>
                  <p className="text-charcoal/70 text-[11px] leading-relaxed">
                    {inspectingOrder.shippingAddress?.street}<br />
                    {inspectingOrder.shippingAddress?.city}, {inspectingOrder.shippingAddress?.state} &bull; {inspectingOrder.shippingAddress?.zip}<br />
                    {inspectingOrder.shippingAddress?.country}
                  </p>
                  <div className="pt-1.5 border-t border-black/5 flex items-center justify-between text-[11px] text-charcoal/60">
                    <span>Phone: <strong className="text-charcoal">{inspectingOrder.userPhone}</strong></span>
                    <span>Carrier: <strong className="text-charcoal">{inspectingOrder.shippingCarrier || 'Delhivery Express'}</strong></span>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 md:p-5 bg-[#FAF7F2] border-t border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-charcoal/60 font-medium text-center sm:text-left">
                Verify front and back side laser alignments before dispatching to CNC workshop queue.
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setInspectingOrder(null)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-100 border border-black/10 text-charcoal text-xs font-bold transition-colors cursor-pointer"
                >
                  Close Blueprint
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-2xl bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#B6F554]" />
                  <span>Print Laser Ticket</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          DEDICATED LASER HARDWARE WORKSHOP JOB TICKET FOR WINDOW.PRINT()
          ========================================================================= */}
      {inspectingOrder && (
        <div id="laser-workshop-ticket" className="print-only p-6 bg-white text-black text-left">
          {/* Header */}
          <div className="border-b-2 border-black pb-4 mb-4 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight uppercase">TAPPING CONTACTLESS HARDWARE</h1>
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-600">
                CNC FIBER LASER WORKSHOP &bull; HARDWARE PRODUCTION BLUEPRINT
              </p>
            </div>
            <div className="text-right font-mono">
              <span className="text-xl font-black block">{inspectingOrder.orderNumber}</span>
              <span className="text-xs text-neutral-600">
                DATE: {new Date(inspectingOrder.createdAt).toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          {/* Job Specifications Summary Table */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono mb-4 border border-black p-3">
            <div>
              <p className="font-bold uppercase text-neutral-500 text-[10px]">CUSTOMER &amp; SHIPPING DESTINATION</p>
              <p className="font-black text-sm">{inspectingOrder.shippingAddress?.name || inspectingOrder.userName}</p>
              <p>{inspectingOrder.userPhone} &bull; {inspectingOrder.userEmail}</p>
              <p className="mt-1">{inspectingOrder.shippingAddress?.street}, {inspectingOrder.shippingAddress?.city}, {inspectingOrder.shippingAddress?.state} {inspectingOrder.shippingAddress?.zip}</p>
              <p className="mt-1 font-bold">Courier: {inspectingOrder.shippingCarrier || 'Delhivery Express'} ({inspectingOrder.trackingNumber || 'Pending Tracking'})</p>
            </div>
            <div>
              <p className="font-bold uppercase text-neutral-500 text-[10px]">HARDWARE &amp; LASER MACHINE PARAMETERS</p>
              <p><strong>Substrate:</strong> {getMaterialName(inspectingOrder.material, inspectingOrder.customColor)}</p>
              {inspectingOrder.customColor && <p><strong>Custom Hex:</strong> {inspectingOrder.customColor}</p>}
              <p><strong>Side Mode:</strong> {inspectingOrder.sideMode === 'single_sided' ? 'Single Sided' : 'Double Sided'}</p>
              <p><strong>Laser Infill:</strong> {inspectingOrder.frontSide?.textColor || '#FFFFFF'}</p>
              <p><strong>Typography Font:</strong> {inspectingOrder.frontSide?.fontFamily?.replace(/'/g, '').split(',')[0] || 'Plus Jakarta Sans'}</p>
              <p><strong>NFC Chip:</strong> NXP NTAG216 High Frequency 13.56 MHz (888 Bytes)</p>
              <p><strong>Target URL:</strong> {inspectingOrder.qrUrl}</p>
            </div>
          </div>

          {/* Special Customer Notes */}
          {inspectingOrder.notes && (
            <div className="border border-black p-2.5 mb-4 text-xs bg-neutral-50">
              <span className="font-bold uppercase font-mono block text-[10px]">Customer Notes &amp; Special Etch Instructions:</span>
              <p className="font-serif italic mt-0.5">{inspectingOrder.notes}</p>
            </div>
          )}

          {/* Visual Blueprints Side-by-Side (Calibrated at 85.6mm x 53.98mm format) */}
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase font-mono tracking-wider border-b border-black pb-1 mb-3">
              1:1 SCALE LASER ETCHING WORKSHOP BLUEPRINT
            </h2>

            <div className="flex items-start justify-around gap-6">
              {/* Front Face Proof */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase">FRONT FACE (SIDE A)</span>
                <div className="border-2 border-black p-1 bg-white">
                  {renderCardSurface(inspectingOrder, 'front')}
                </div>
                <span className="text-[9px] font-mono text-neutral-600">Dimensions: 85.60 mm × 53.98 mm</span>
              </div>

              {/* Back Face Proof */}
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold uppercase">REVERSE FACE (SIDE B)</span>
                <div className="border-2 border-black p-1 bg-white">
                  {renderCardSurface(inspectingOrder, 'back')}
                </div>
                <span className="text-[9px] font-mono text-neutral-600">Dimensions: 85.60 mm × 53.98 mm</span>
              </div>
            </div>
          </div>

          {/* Quality Assurance & Operator Signoff Checklist */}
          <div className="border-t-2 border-black pt-4 grid grid-cols-4 gap-3 text-[10px] font-mono">
            <div className="border border-neutral-300 p-2">
              <span className="block font-bold">[ &nbsp; ] LASER ENGRAVING PASS</span>
              <span className="text-neutral-500">Fiber 1064nm, 2x pass</span>
            </div>
            <div className="border border-neutral-300 p-2">
              <span className="block font-bold">[ &nbsp; ] ULTRASONIC CLEAN</span>
              <span className="text-neutral-500">De-ionized residue wash</span>
            </div>
            <div className="border border-neutral-300 p-2">
              <span className="block font-bold">[ &nbsp; ] NFC CHIP 13.56MHz</span>
              <span className="text-neutral-500">Read/Write tested OK</span>
            </div>
            <div className="border border-neutral-300 p-2">
              <span className="block font-bold">OPERATOR SIGNATURE</span>
              <div className="h-6 border-b border-dashed border-neutral-400 mt-2" />
            </div>
          </div>
        </div>
      )}

      {/* EDIT TRACKING MODAL */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveTracking} className="bg-white rounded-4xl p-6 max-w-sm w-full border border-black/10 shadow-2xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <h3 className="font-black text-sm text-charcoal">
                Tracking for {selectedOrderForTracking.orderNumber}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedOrderForTracking(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-charcoal/60 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">
                  Courier Tracking ID (Delhivery, BlueDart, SpeedPost)
                </label>
                <input
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="e.g. DEL-992817401"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal font-mono focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-charcoal/60 block mb-1">
                  Shipping Courier
                </label>
                <select
                  value={carrierInput}
                  onChange={(e) => setCarrierInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:outline-none focus:ring-1 focus:ring-[#4F83FF]"
                >
                  <option value="Delhivery Surface Pro">Delhivery Surface Pro</option>
                  <option value="Delhivery Express Air">Delhivery Express Air</option>
                  <option value="BlueDart Air Apex">BlueDart Air Apex</option>
                  <option value="India Post SpeedPost">India Post SpeedPost</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-black/5 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrderForTracking(null)}
                className="flex-1 py-2.5 rounded-full bg-[#FAF7F2] text-xs font-bold text-charcoal border border-black/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black shadow-sm"
              >
                Save &amp; Mark Shipped
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}