'use client';

import React, { useState } from 'react';
import { NFCCardDesign, CardMaterial } from '@/lib/types';
import { CreditCard, QrCode, RefreshCw, Check, Truck, ShieldCheck, ShoppingBag, X } from 'lucide-react';
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
  const [material, setMaterial] = useState<CardMaterial>(nfcCard.material);
  const [engravedName, setEngravedName] = useState(nfcCard.engravedName || username.toUpperCase());
  const [engravedTagline, setEngravedTagline] = useState(nfcCard.engravedTagline || 'DIGITAL CREATOR AND FOUNDER');
  const [redirectMode, setRedirectMode] = useState<'profile' | 'direct_vcard' | 'custom_url'>(nfcCard.redirectMode);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const materials: { id: CardMaterial; name: string; class: string; desc: string }[] = [
    {
      id: 'matte_black',
      name: 'Matte Stealth Black',
      class: 'metal-matte-black text-white',
      desc: 'Anodized aerospace matte black',
    },
    {
      id: 'brushed_gold',
      name: '24K Brushed Gold',
      class: 'metal-brushed-gold text-slate-900',
      desc: 'Brushed gold metallic finish',
    },
    {
      id: 'rose_gold',
      name: 'Rose Gold',
      class: 'metal-rose-gold text-slate-900',
      desc: 'Satin champagne rose alloy',
    },
    {
      id: 'titanium_silver',
      name: 'Titanium Silver',
      class: 'metal-titanium-silver text-slate-900',
      desc: 'Reflective silver brushed steel',
    },
  ];

  const handleSaveDesign = () => {
    const updated: NFCCardDesign = {
      ...nfcCard,
      material,
      engravedName,
      engravedTagline,
      redirectMode,
    };
    onUpdateCard(updated);
    showToast('Card Design Saved', 'Laser engraving blueprint updated', 'success');
  };

  const handlePlaceOrder = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    const updated: NFCCardDesign = {
      ...nfcCard,
      material,
      engravedName,
      engravedTagline,
      orderStatus: 'in_production',
      trackingNumber: `TAP-${Math.floor(100000 + Math.random() * 900000)}`,
    };
    onUpdateCard(updated);
    setOrderModalOpen(false);
    showToast('Order Placed Successfully', 'Your custom metal NFC card is queued for laser etching', 'success');
  };

  const currentMat = materials.find((m) => m.id === material) || materials[0];

  return (
    <div className="bg-white rounded-4xl p-5 md:p-6 border border-black/5 shadow-soft">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pastel-sky flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-charcoal" />
            </div>
            <h2 className="text-lg font-extrabold text-charcoal">Physical Metal NFC Card Studio</h2>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Heavyweight metal card with embedded NTAG216 microchip and permanent laser engraving
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFlipped(!flipped)}
            className="px-3.5 py-2 rounded-full bg-[#FAF7F2] hover:bg-gray-100 text-charcoal text-xs font-semibold flex items-center gap-1.5 border border-black/10 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Flip Card Preview</span>
          </button>
          <button
            onClick={() => setOrderModalOpen(true)}
            className="px-4 py-2 rounded-full bg-[#1F2024] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-pastel-yellow" />
            <span>Order Metal Card</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
        {/* 3D Realistic Interactive Card Preview */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div
            onClick={() => setFlipped(!flipped)}
            className="perspective-1000 w-full max-w-[380px] h-[230px] cursor-pointer relative select-none"
            title="Click to flip card"
          >
            <div
              className={`w-full h-full preserve-3d transition-transform duration-700 relative rounded-3xl ${
                flipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT */}
              <div
                className={`absolute inset-0 backface-hidden rounded-3xl p-6 flex flex-col justify-between ${currentMat.class}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm tracking-widest uppercase">
                      TAPPING
                    </span>
                    <span className="text-[9px] font-mono opacity-60">NFC 13.56MHz</span>
                  </div>
                  <div className="w-10 h-7 rounded-md bg-amber-400/80 border border-amber-600/40 flex flex-col justify-around p-1 opacity-90">
                    <div className="w-full h-0.5 bg-amber-700/40" />
                    <div className="w-full h-0.5 bg-amber-700/40" />
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] tracking-widest uppercase opacity-70">
                    {engravedTagline || 'DIGITAL CREATOR AND FOUNDER'}
                  </p>
                  <h3 className="font-mono font-bold text-lg md:text-xl tracking-widest mt-1 uppercase">
                    {engravedName || 'YOUR NAME'}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-mono tracking-wider opacity-80">
                      NFC SMART TAP HARDWARE
                    </span>
                  </div>
                </div>
              </div>

              {/* BACK */}
              <div
                className={`absolute inset-0 backface-hidden rotate-y-180 rounded-3xl p-6 flex items-center justify-between ${currentMat.class}`}
              >
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider">
                      TAP ANY PHONE TO CONNECT
                    </span>
                    <p className="font-mono text-xs mt-1.5 opacity-90">
                      tapping.bio/{username}
                    </p>
                  </div>
                  <div className="text-[10px] font-mono opacity-60">
                    UID: {nfcCard.cardUid}
                    <br />
                    Encrypted NTAG216 Chip
                  </div>
                </div>

                <div className="w-20 h-20 bg-white p-1.5 rounded-2xl flex items-center justify-center shadow-md">
                  <QrCode className="w-full h-full text-black" />
                </div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-charcoal-muted mt-3">
            Click card to flip front and back
          </p>

          <div className="w-full max-w-[380px] mt-4 p-3.5 rounded-2xl bg-[#FAF7F2] border border-black/5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-pastel-mint flex items-center justify-center">
                <Truck className="w-4 h-4 text-charcoal" />
              </div>
              <div>
                <p className="font-bold text-charcoal">Status: In Production</p>
                <p className="text-[10px] text-charcoal-muted font-mono">{nfcCard.trackingNumber}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-pastel-yellow text-charcoal border border-pastel-yellow-border">
              Etching Queue
            </span>
          </div>
        </div>

        {/* Customization Controls */}
        <div className="lg:col-span-6 flex flex-col gap-4 text-left text-xs">
          <div>
            <label className="font-bold text-charcoal uppercase tracking-wider block mb-2">
              Select Metal Finish
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {materials.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setMaterial(mat.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    material === mat.id
                      ? 'border-charcoal bg-black/5 ring-1 ring-charcoal'
                      : 'border-black/10 bg-white hover:bg-gray-50'
                  }`}
                >
                  <p className="font-bold text-charcoal">{mat.name}</p>
                  <p className="text-[10px] text-charcoal-muted mt-0.5">{mat.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-charcoal uppercase tracking-wider block mb-1">
              Laser Engraved Name
            </label>
            <input
              type="text"
              value={engravedName}
              onChange={(e) => setEngravedName(e.target.value.toUpperCase())}
              placeholder="ALEX MORGAN"
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-mono font-bold text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-charcoal uppercase tracking-wider block mb-1">
              Engraved Tagline or Title
            </label>
            <input
              type="text"
              value={engravedTagline}
              onChange={(e) => setEngravedTagline(e.target.value.toUpperCase())}
              placeholder="FOUNDER AND PRINCIPAL DESIGNER"
              className="w-full px-3.5 py-2.5 rounded-xl border border-black/10 focus:outline-none focus:border-black font-mono text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-charcoal uppercase tracking-wider block mb-1">
              When Someone Taps Your Card
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRedirectMode('profile')}
                className={`py-2 px-3 rounded-xl border text-left text-xs font-semibold ${
                  redirectMode === 'profile'
                    ? 'bg-[#1F2024] text-white border-black'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
              >
                Open Tapping Profile
              </button>
              <button
                type="button"
                onClick={() => setRedirectMode('direct_vcard')}
                className={`py-2 px-3 rounded-xl border text-left text-xs font-semibold ${
                  redirectMode === 'direct_vcard'
                    ? 'bg-[#1F2024] text-white border-black'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
              >
                Instant vCard Save
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveDesign}
            className="w-full py-2.5 px-4 rounded-full bg-pastel-sky hover:bg-pastel-sky-border text-charcoal font-semibold text-xs flex items-center justify-center gap-1.5 border border-pastel-sky-border transition-colors mt-2"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Card Blueprint</span>
          </button>
        </div>
      </div>

      {/* Checkout Modal */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-4xl p-6 max-w-md w-full border border-black/10 shadow-float text-left">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-charcoal" />
                <h3 className="font-bold text-sm text-charcoal">Checkout Custom Metal Card</h3>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="text-charcoal-muted hover:text-charcoal p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 bg-[#FAF7F2] rounded-2xl flex justify-between items-center">
                <div>
                  <p className="font-bold text-charcoal">{currentMat.name}</p>
                  <p className="text-[11px] text-charcoal-muted">Laser Engraved: {engravedName}</p>
                </div>
                <span className="font-black text-sm text-charcoal">$49.00</span>
              </div>

              <div className="space-y-1 text-charcoal/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$49.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Worldwide Tracked Shipping</span>
                  <span className="text-emerald-600 font-semibold">Included</span>
                </div>
                <div className="flex justify-between font-bold text-charcoal text-sm pt-2 border-t border-black/5">
                  <span>Total</span>
                  <span>$49.00</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-pastel-mint-light border border-pastel-mint-border flex items-center gap-2 text-[11px] text-charcoal">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected with Razorpay Secure Checkout and Lifetime NFC Warranty</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setOrderModalOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-black/5 text-xs font-semibold text-charcoal"
              >
                Cancel
              </button>
              <button
                onClick={handlePlaceOrder}
                className="flex-2 py-2.5 px-6 rounded-full bg-[#1F2024] hover:bg-black text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
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
