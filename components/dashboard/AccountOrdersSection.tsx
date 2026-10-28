'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Profile, 
  Subscription, 
  MetalCardOrder, 
  NFCCardDesign 
} from '@/lib/types';
import { 
  getStoredOrders, 
  getStoredProfile, 
  saveStoredProfile,
  deleteCurrentCustomerAccount
} from '@/lib/storage';
import { 
  CreditCard, 
  Truck, 
  Check, 
  Clock, 
  ExternalLink, 
  LogOut, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  Sparkles, 
  ChevronRight, 
  Package, 
  Trash2, 
  AlertTriangle, 
  Lock, 
  Phone, 
  RefreshCw, 
  X,
  Share2,
  Download,
  QrCode,
  Layers,
  RotateCcw
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import QRCodeGenerator from 'qrcode';
import { exportCardAsPng, exportCardAsPdf } from '@/lib/cardExporter';

interface AccountOrdersSectionProps {
  profile: Profile;
  subscription: Subscription;
  nfcCard: NFCCardDesign;
  onUpgradeClick?: () => void;
}

export default function AccountOrdersSection({
  profile,
  subscription,
  nfcCard,
  onUpgradeClick,
}: AccountOrdersSectionProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<MetalCardOrder[]>([]);
  const [displayHost, setDisplayHost] = useState('tapping.bio');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Live Card & QR State
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDisplayHost(window.location.host);
      setOrders(getStoredOrders());

      const handleOrdersUpdate = () => {
        setOrders(getStoredOrders());
      };
      window.addEventListener('tapping-orders-updated', handleOrdersUpdate);
      return () => window.removeEventListener('tapping-orders-updated', handleOrdersUpdate);
    }
  }, []);

  // Generate dynamic QR code for profile
  useEffect(() => {
    if (typeof window !== 'undefined' && profile.username) {
      const origin = window.location.origin;
      const targetUrl = `${origin}/${profile.username}`;
      QRCodeGenerator.toDataURL(targetUrl, { 
        width: 360, 
        margin: 1, 
        errorCorrectionLevel: 'M',
        color: {
          dark: '#141518',
          light: '#FFFFFF'
        }
      })
        .then(setQrCodeDataUrl)
        .catch(console.error);
    }
  }, [profile.username]);

  const handleLogout = () => {
    const p = getStoredProfile();
    p.username = 'creator';
    saveStoredProfile(p);
    showToast('Signed Out', 'You have been safely logged out of your session', 'info');
    router.push('/');
  };

  const handleShareProfile = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/${profile.username}` : `https://${displayHost}/${profile.username}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName} - Tapping Profile`,
          text: `Connect with ${profile.displayName} on Tapping`,
          url,
        });
        return;
      } catch {
        // Fall back to clipboard
      }
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      showToast('Profile Link Copied', `Copied ${url} to clipboard`, 'success');
    }
  };

  const handleDownloadQr = () => {
    if (!qrCodeDataUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeDataUrl;
    a.download = `tapping-qr-${profile.username}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast('QR Code Downloaded', 'Permanent vector QR saved to downloads', 'success');
  };

  const handleDownloadCardPng = async () => {
    setIsDownloading(true);
    try {
      await exportCardAsPng(
        nfcCard,
        nfcCard.material || 'matte_black',
        isCardFlipped ? 'back' : 'front',
        profile.username,
        displayHost
      );
      showToast('Card PNG Saved', 'Downloaded 300 DPI high-resolution card image', 'success');
    } catch {
      showToast('Export Error', 'Could not export card image', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadCardPdf = async () => {
    setIsDownloading(true);
    try {
      await exportCardAsPdf(
        nfcCard,
        nfcCard.material || 'matte_black',
        isCardFlipped ? 'back' : 'front',
        profile.username,
        displayHost
      );
      showToast('Card PDF Saved', 'Downloaded print-ready vector PDF', 'success');
    } catch {
      showToast('Export Error', 'Could not export card PDF', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteAccount = () => {
    const targetMatch = profile.username.toLowerCase();
    const inputMatch = deleteConfirmText.trim().toLowerCase();
    if (inputMatch !== targetMatch && deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      showToast('Confirmation Mismatch', `Please type "${profile.username}" or "DELETE" to confirm account deletion`, 'error');
      return;
    }
    setIsDeleting(true);
    setTimeout(() => {
      deleteCurrentCustomerAccount();
      showToast('Account Deleted', 'Your profile and public link have been completely removed. You can start fresh from zero anytime.', 'info');
      setShowDeleteModal(false);
      setIsDeleting(false);
      router.push('/dashboard');
      window.location.reload();
    }, 700);
  };

  // Expiry calculation
  const planExpiryDate = subscription.expiresAt 
    ? new Date(subscription.expiresAt)
    : new Date(Date.now() + 312 * 24 * 60 * 60 * 1000);
  
  const daysRemaining = Math.max(0, Math.ceil((planExpiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  // Material and styling resolution
  const isCustomMat = nfcCard.material === 'custom_color';
  const matClass = nfcCard.material === 'matte_black'
    ? 'metal-matte-black text-white'
    : nfcCard.material === 'brushed_gold'
    ? 'metal-brushed-gold text-slate-900'
    : nfcCard.material === 'rose_gold'
    ? 'metal-rose-gold text-slate-900'
    : nfcCard.material === 'titanium_silver'
    ? 'metal-titanium-silver text-slate-900'
    : 'bg-[#141518] text-white';

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="p-6 md:p-8 rounded-4xl bg-white border border-black/5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-black/10 shadow-sm shrink-0 bg-[#FAF7F2] relative">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&auto=format&fit=crop&q=80'}
              alt={profile.displayName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&auto=format&fit=crop&q=80';
              }}
              className={`w-full h-full ${profile.avatarFit === 'cover' ? 'object-cover' : 'object-contain'}`}
              style={{
                transform: `scale(${(profile.avatarZoom ?? 100) / 100}) translate(${profile.avatarPosX ?? 0}px, ${profile.avatarPosY ?? 0}px)`,
                transformOrigin: 'center center',
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-charcoal tracking-tight font-sans">
                {profile.displayName}
              </h1>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FDF166] text-charcoal border border-black/10">
                PRO ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-charcoal/70">
              <span className="font-semibold text-charcoal flex items-center gap-1 bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-black/5">
                <Lock className="w-3 h-3 text-charcoal/40" />
                <span>@{profile.username}</span>
                <span className="text-[10px] text-charcoal/40 font-normal">(Permanent Link)</span>
              </span>
              <span className="font-semibold text-charcoal flex items-center gap-1 bg-[#FAF7F2] px-2.5 py-1 rounded-xl border border-black/5">
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>{profile.mobileNumber || 'Contact Number Added'}</span>
                <span className="text-[10px] text-emerald-700 font-bold">Verified</span>
              </span>
            </div>
            <p className="text-[11px] text-charcoal/50 mt-1.5 font-medium">
              Verified Creator &bull; Active Plan &bull; Member since 2026
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleShareProfile}
            className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-xs font-black border border-black/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#4F83FF]" />
            <span>Share Profile</span>
          </button>

          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
          >
            <span>View Bio Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FDF166]" />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black border border-rose-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Grid: Plan & Subscription + Live Metal Card & Dynamic QR Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Active Plan & Expiry Card */}
        <div className="p-6 md:p-7 rounded-4xl bg-white border border-black/5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#EFF4FF] text-[#4F83FF] border border-[#4F83FF]/20">
                Current Subscription
              </span>
              <span className="flex items-center gap-1 text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Pass
              </span>
            </div>

            <h3 className="text-2xl font-black text-charcoal mt-4">
              Pro Annual Membership
            </h3>
            <p className="text-xs text-charcoal/60 mt-1 font-medium leading-relaxed">
              Full access to link-in-bio, slidable product showcase, permanent dynamic QR code, custom theme palettes, visiting card downloads, and contactless NFC beaming.
            </p>

            {/* Expiry Pill Countdown */}
            <div className="mt-5 p-4 rounded-3xl bg-[#FAF7F2] border border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white border border-black/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#4F83FF]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-charcoal/50 uppercase">Plan Expiration</p>
                  <p className="text-xs font-black text-charcoal">
                    {planExpiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-[#4F83FF]">
                  {daysRemaining} days left
                </span>
                <span className="block text-[9px] text-charcoal/50 font-medium">Auto-renew enabled</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-black/5 flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal/60">Billed &#8377;2,999 / year</span>
            <button
              type="button"
              onClick={onUpgradeClick}
              className="px-4 py-2 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <span>Manage Billing</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Customer Metal Card & Dynamic QR Showcase (Replaces 2FA & Authorized Devices) */}
        <div className="p-6 md:p-7 rounded-4xl bg-white border border-black/5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#B6F554] text-charcoal border border-black/10">
                Your Hardware &amp; QR
              </span>
              <button
                type="button"
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="flex items-center gap-1 text-[11px] font-black text-charcoal/70 hover:text-black bg-[#FAF7F2] hover:bg-black/5 px-2.5 py-1 rounded-full border border-black/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-[#4F83FF]" />
                <span>Flip Card ({isCardFlipped ? 'Back' : 'Front'})</span>
              </button>
            </div>

            <h3 className="text-lg font-black text-charcoal mt-3">
              Metal NFC Card &amp; Dynamic QR
            </h3>
            <p className="text-xs text-charcoal/60 mt-0.5 font-medium">
              Your real-time card and permanent vector QR code. Click to flip, share, or download.
            </p>

            {/* Interactive Card & QR Layout */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
              {/* Interactive 3D Card Preview */}
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="w-full sm:w-60 h-36 rounded-2xl cursor-pointer perspective-1000 select-none relative shrink-0 transition-transform hover:scale-[1.02]"
                title="Click to flip front/back"
              >
                <div className={`w-full h-full relative transition-transform duration-500 transform-style-3d ${isCardFlipped ? 'rotate-y-180' : ''}`}>
                  {/* FRONT SIDE */}
                  <div
                    className={`absolute inset-0 backface-hidden rounded-2xl p-4 flex flex-col justify-between overflow-hidden shadow-md border border-black/15 ${matClass}`}
                    style={isCustomMat ? { backgroundColor: nfcCard.customColor || '#141518', color: '#FFFFFF' } : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-widest uppercase">
                        {nfcCard.frontSide?.topLabel || 'TAPPING'}
                      </span>
                      {/* Chip icon */}
                      <div className="w-6 h-4 rounded-sm bg-amber-400 border border-amber-600/60 flex flex-col justify-around p-0.5 shadow-2xs">
                        <div className="w-full h-px bg-amber-700/60" />
                        <div className="w-full h-px bg-amber-700/60" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[12px] font-black uppercase tracking-wider leading-tight">
                        {nfcCard.frontSide?.primaryText || profile.displayName.toUpperCase()}
                      </p>
                      <p className="text-[8px] font-mono opacity-80 uppercase tracking-widest mt-0.5">
                        {nfcCard.frontSide?.secondaryText || 'VERIFIED CREATOR'}
                      </p>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div
                    className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl p-4 flex items-center justify-between overflow-hidden shadow-md border border-black/15 ${matClass}`}
                    style={isCustomMat ? { backgroundColor: nfcCard.customColor || '#141518', color: '#FFFFFF' } : undefined}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-wider block opacity-75">
                          TAP TO CONNECT
                        </span>
                        <p className="text-[9px] font-mono font-bold mt-0.5">
                          {displayHost}/{profile.username}
                        </p>
                      </div>
                      <p className="text-[7px] font-mono opacity-60">
                        NFC 13.56MHz Contactless
                      </p>
                    </div>
                    {qrCodeDataUrl ? (
                      <div className="w-14 h-14 rounded-lg bg-white p-1 shrink-0 flex items-center justify-center shadow-xs">
                        <img src={qrCodeDataUrl} alt="Dynamic QR" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-white/20 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic QR Display & Direct QR Action */}
              <div className="flex-1 w-full bg-[#FAF7F2] p-3 rounded-2xl border border-black/5 flex items-center gap-3">
                {qrCodeDataUrl ? (
                  <div className="w-14 h-14 rounded-xl bg-white p-1 border border-black/10 shrink-0 shadow-2xs">
                    <img src={qrCodeDataUrl} alt="Profile QR" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gray-200 animate-pulse shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black text-charcoal truncate">Dynamic Vector QR</p>
                  <p className="text-[9px] text-charcoal/60 truncate">Permanently points to @{profile.username}</p>
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    className="mt-1 text-[10px] font-black text-[#4F83FF] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-2.5 h-2.5" />
                    <span>Download QR Image</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row: Export PNG, PDF, Share */}
          <div className="pt-5 mt-5 border-t border-black/5 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-charcoal/60">Direct Exports:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                disabled={isDownloading}
                onClick={handleDownloadCardPng}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-[11px] font-black border border-black/10 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Download 300 DPI high-resolution PNG"
              >
                <Download className="w-3 h-3 text-[#4F83FF]" />
                <span>Card PNG</span>
              </button>
              <button
                type="button"
                disabled={isDownloading}
                onClick={handleDownloadCardPdf}
                className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-[11px] font-black border border-black/10 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                title="Download print-ready vector PDF"
              >
                <Download className="w-3 h-3 text-[#4F83FF]" />
                <span>Card PDF</span>
              </button>
              <button
                type="button"
                onClick={handleShareProfile}
                className="px-3 py-1.5 rounded-xl bg-[#141518] hover:bg-black text-white text-[11px] font-black flex items-center gap-1 transition-transform active:scale-95 cursor-pointer shadow-xs"
                title="Share profile link"
              >
                <Share2 className="w-3 h-3 text-[#B6F554]" />
                <span>Share Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metal NFC Hardware Orders Pipeline Section */}
      <div className="p-6 md:p-8 rounded-4xl bg-white border border-black/5 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-black/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B6F554] text-charcoal border border-black/10 text-[10px] font-black uppercase tracking-wider mb-2">
              <Package className="w-3.5 h-3.5 text-charcoal" />
              <span>Hardware Orders Pipeline</span>
            </div>
            <h3 className="text-xl font-black text-charcoal">
              Your Metal NFC Card Orders
            </h3>
            <p className="text-xs text-charcoal/60 font-medium">
              Track real-time laser engraving, encoding, and Pan-India courier delivery.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const studioBtn = document.querySelector('[title="Metal NFC Studio"]') as HTMLButtonElement;
              if (studioBtn) studioBtn.click();
            }}
            className="px-4 py-2.5 rounded-full bg-[#141518] hover:bg-black text-white text-xs font-black flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#B6F554]" />
            <span>Order Another Card (&#8377;1,499)</span>
          </button>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="py-12 text-center text-charcoal/60">
            <Package className="w-12 h-12 mx-auto text-charcoal/20 mb-3" />
            <p className="text-sm font-bold text-charcoal">No hardware orders yet</p>
            <p className="text-xs text-charcoal/60 mt-1 max-w-sm mx-auto">
              Customize your laser engraved stainless steel metal NFC business card in the Metal NFC Studio.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => {
              const isCompleted = order.status === 'delivered';
              const isShipped = order.status === 'shipped' || isCompleted;
              const isProduction = order.status === 'in_production' || isShipped;

              return (
                <div
                  key={order.id}
                  className="p-5 rounded-3xl bg-[#FAF7F2] border border-black/10 shadow-2xs text-left"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-charcoal">
                          {order.orderNumber}
                        </span>
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white text-charcoal border border-black/10">
                          {order.material === 'custom_color' ? `CUSTOM (${order.customColor || 'SHADE'})` : order.material.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'UPI Paid'}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal/70 mt-1 font-medium">
                        Laser Engraved: <strong className="text-charcoal font-black">{order.engravedName}</strong> &bull; {order.engravedTagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-black border ${
                        order.status === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : order.status === 'shipped'
                          ? 'bg-[#EFF4FF] text-[#4F83FF] border-[#4F83FF]/30'
                          : 'bg-[#FDF166] text-charcoal border-black/10'
                      }`}>
                        {order.status === 'in_production' ? 'Laser Engraving In Production' : order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* 4-Step Production Progress Bar */}
                  <div className="grid grid-cols-4 gap-2 pt-4 pb-2 text-center">
                    <div>
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xs font-black shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <p className="font-black text-[10px] text-charcoal mt-1.5">Blueprint Confirmed</p>
                    </div>

                    <div>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-black shadow-2xs ${
                        isProduction ? 'bg-charcoal text-white animate-pulse' : 'bg-black/10 text-charcoal/40'
                      }`}>
                        2
                      </div>
                      <p className="font-black text-[10px] text-charcoal mt-1.5">Laser Etching</p>
                    </div>

                    <div>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-black shadow-2xs ${
                        isShipped ? 'bg-charcoal text-white' : 'bg-black/10 text-charcoal/40'
                      }`}>
                        3
                      </div>
                      <p className="font-semibold text-[10px] text-charcoal mt-1.5">NTAG216 Encoding</p>
                    </div>

                    <div>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center mx-auto text-xs font-black shadow-2xs ${
                        isCompleted ? 'bg-emerald-600 text-white' : 'bg-black/10 text-charcoal/40'
                      }`}>
                        4
                      </div>
                      <p className="font-semibold text-[10px] text-charcoal mt-1.5">Express Delivered</p>
                    </div>
                  </div>

                  {/* Shipping Courier & Address Bar */}
                  <div className="mt-3 p-3 bg-white rounded-2xl border border-black/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px]">
                    <div>
                      <span className="text-charcoal/60 font-bold">Tracking ID: </span>
                      <span className="font-mono font-black text-charcoal">{order.trackingNumber || 'Pending Courier Dispatch'}</span>
                      <span className="text-charcoal/40 ml-2">({order.shippingCarrier || 'Delhivery Express'})</span>
                    </div>

                    <div className="text-charcoal/70 truncate max-w-sm">
                      <MapPin className="w-3 h-3 text-rose-500 inline mr-1" />
                      <span>{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Danger Zone: Permanent Customer Profile Deletion */}
      <div className="p-6 md:p-8 rounded-4xl bg-rose-50/60 border border-rose-200/80 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-base font-black text-rose-950">
                Danger Zone: Permanent Profile Deletion
              </h3>
              <p className="text-xs text-rose-800/80 mt-1 leading-relaxed max-w-xl font-medium">
                Completely erase your creator profile, links, showcase products, and permanent handle (<code>@{profile.username}</code>). Your public URL will be deactivated immediately. If you wish to use TAPPING again, you will start completely fresh from zero with a new phone verification, username, and plan activation.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDeleteConfirmText('');
              setShowDeleteModal(true);
            }}
            className="self-start sm:self-center px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Profile & Account</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Permanent Account Deletion */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-black/10 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-charcoal">Delete Account Permanently?</h3>
                  <p className="text-[11px] font-bold text-rose-600">This action cannot be undone</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="p-1.5 rounded-full hover:bg-black/5 text-charcoal/50 hover:text-charcoal cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-charcoal/70 leading-relaxed">
              <p>
                You are about to completely delete your profile for <strong className="text-charcoal font-black">@{profile.username}</strong> ({profile.displayName}).
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-charcoal/80">
                <li>Your public bio link (<code>{displayHost}/{profile.username}</code>) will immediately go offline.</li>
                <li>All link blocks, click analytics, and product showcases will be purged.</li>
                <li>Your laser-engraved NFC card redirect will become inactive.</li>
                <li>You can start fresh from zero with a new registration and plan renewal anytime.</li>
              </ul>
              <p className="font-bold text-charcoal pt-1">
                To confirm, type <span className="font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">{profile.username}</span> or <span className="font-mono text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">DELETE</span> below:
              </p>
            </div>

            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={`Type "${profile.username}" to confirm`}
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border border-black/15 text-xs font-mono font-bold text-charcoal focus:outline-none focus:ring-2 focus:ring-rose-500/30"
              autoFocus
            />

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-black/5 text-xs font-bold text-charcoal transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  isDeleting ||
                  (deleteConfirmText.trim().toLowerCase() !== profile.username.toLowerCase() &&
                   deleteConfirmText.trim().toUpperCase() !== 'DELETE')
                }
                onClick={handleDeleteAccount}
                className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
