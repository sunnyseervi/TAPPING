'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStoredNFCCard, getStoredProfile, getStoredVCard } from '@/lib/storage';
import { downloadVCardFile } from '@/lib/vcard';
import { CreditCard } from 'lucide-react';

export default function NFCTapPage() {
  const params = useParams();
  const cardId = params?.cardId as string;
  const router = useRouter();

  const [status, setStatus] = useState<string>('Reading NFC Hardware Chip');

  useEffect(() => {
    const profile = getStoredProfile();
    const vcard = getStoredVCard();
    const nfc = getStoredNFCCard();

    const timer = setTimeout(() => {
      if (nfc.redirectMode === 'direct_vcard') {
        setStatus('Direct vCard Download Initialized');
        downloadVCardFile(vcard, `${profile.username}_contact.vcf`);
        setTimeout(() => {
          router.push(`/${profile.username}`);
        }, 1200);
      } else if (nfc.redirectMode === 'custom_url' && nfc.customRedirectUrl) {
        setStatus(`Routing to ${nfc.customRedirectUrl}`);
        window.location.href = nfc.customRedirectUrl;
      } else {
        setStatus(`Routing to ${profile.displayName}`);
        router.push(`/${profile.username}`);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [cardId, router]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-full max-w-sm bg-white rounded-4xl p-8 border border-black/5 shadow-card flex flex-col items-center">
        <div className="w-16 h-16 rounded-3xl bg-pastel-peach border border-pastel-peach-border flex items-center justify-center mb-4">
          <CreditCard className="w-8 h-8 text-charcoal" />
        </div>

        <span className="text-[10px] font-mono font-bold tracking-widest text-charcoal-muted uppercase">
          NFC Tap Detected : {cardId || 'TAP-9482'}
        </span>

        <h1 className="text-xl font-black text-charcoal mt-2">Connecting</h1>
        <p className="text-xs text-charcoal/70 mt-1 font-medium">{status}</p>

        <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-charcoal rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  );
}
