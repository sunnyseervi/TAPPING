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
  resetAllToDefault,
  deleteCurrentCustomerAccount
} from '@/lib/storage';
import { 
  CreditCard, 
  Truck, 
  Check, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  LogOut, 
  Laptop, 
  Smartphone, 
  MapPin, 
  Calendar, 
  AlertCircle,
  ShoppingBag,
  Sparkles,
  ChevronRight,
  Package,
  Trash2,
  AlertTriangle,
  Lock,
  Phone,
  RefreshCw,
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import TappingLogo from '@/components/brand/TappingLogo';

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

  const handleLogout = () => {
    // Clear user session
    const p = getStoredProfile();
    p.username = 'creator';
    saveStoredProfile(p);
    showToast('Signed Out', 'You have been safely logged out of your session', 'info');
    router.push('/');
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

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="p-6 md:p-8 rounded-4xl bg-white border border-black/5 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl overflow-hidden border-2 border-black/10 shadow-sm shrink-0 bg-[#FAF7F2]">
            <img
              src={profile.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-charcoal">
                {profile.displayName}
              </h1>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FDF166] text-charcoal border border-black/10">
                PRO ACTIVE
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-charcoal/80 font-mono font-bold flex items-center gap-1 bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-black/5">
                <Lock className="w-3 h-3 text-charcoal/50" />
                @{profile.username}
                <span className="text-[9px] text-charcoal/40 font-sans font-semibold">(Permanent)</span>
              </span>
              <span className="text-xs text-charcoal/70 font-mono flex items-center gap-1 bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-black/5">
                <Phone className="w-3 h-3 text-emerald-600" />
                {profile.mobileNumber || '+91 98765 43210'}
                <span className="text-[9px] text-emerald-700 font-sans font-bold">Verified</span>
              </span>
            </div>
            <p className="text-[11px] text-charcoal/50 mt-1 font-medium">
              Member since January 2026 &bull; Verified Creator Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-xs font-bold border border-black/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Live Bio Profile</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#4F83FF]" />
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

      {/* Grid: Plan & Subscription + Active Hardware Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Active Plan & Expiry Card */}
        <div className="p-6 rounded-4xl bg-white border border-black/5 shadow-soft flex flex-col justify-between">
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
            <p className="text-xs text-charcoal/60 mt-1 font-medium">
              Full access to link in bio, slidable product showcase, dynamic QR, custom wallpaper uploads, and NFC contactless beaming.
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

        {/* Security & Active Sessions Card */}
        <div className="p-6 rounded-4xl bg-white border border-black/5 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-[#FAF7F2] text-charcoal border border-black/10">
                Security &amp; Device Access
              </span>
              <span className="text-[10px] font-bold text-charcoal/50">1 Active Session</span>
            </div>

            <h3 className="text-lg font-black text-charcoal mt-4">
              Authorized Device Sessions
            </h3>
            <p className="text-xs text-charcoal/60 mt-1 font-medium">
              Manage where your account is currently signed in.
            </p>

            <div className="mt-4 space-y-2.5">
              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-black/10 flex items-center justify-center text-charcoal">
                    <Laptop className="w-4 h-4 text-[#4F83FF]" />
                  </div>
                  <div>
                    <p className="font-black text-charcoal flex items-center gap-1.5">
                      <span>Windows 11 &bull; Chrome Desktop</span>
                      <span className="text-[8px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md">
                        CURRENT
                      </span>
                    </p>
                    <p className="text-[10px] text-charcoal/60 font-medium">
                      Bengaluru, Karnataka, India &bull; IP 49.37.112.98
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-charcoal/50">Active Now</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-black/5 flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal/60">Two-Factor Authentication</span>
            <span className="text-xs font-black text-emerald-600">Enabled (SMS &amp; Email)</span>
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
                          {order.material.replace('_', ' ').toUpperCase()}
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
                className="p-1.5 rounded-full hover:bg-black/5 text-charcoal/50 hover:text-charcoal"
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
                className="flex-1 py-3 px-4 rounded-2xl bg-[#FAF7F2] hover:bg-black/5 text-xs font-bold text-charcoal transition-colors"
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
