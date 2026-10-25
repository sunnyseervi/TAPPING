'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getStoredNFCCard, getStoredProfile, getStoredVCard, recordNFCTap } from '@/lib/storage';
import { downloadVCardFile } from '@/lib/vcard';
import { CreditCard } from 'lucide-react';

export default function NFCTapPage() {
  const params = useParams();
  const cardId = params?.cardId as string;
  const router = useRouter();

  const [status, setStatus] = useState<string>('Reading NFC Hardware Chip');

  useEffect(() => {
    recordNFCTap();
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
    <div className="min-h-screen bg-[#F7F5EE] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="w-full max-w-sm bg-white rounded-[40px] p-8 border border-black/5 shadow-card flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-3xl bg-[#EFF4FF] flex items-center justify-center mb-5 shadow-xs">
          <CreditCard className="w-8 h-8 text-[#4F83FF] stroke-[2.2]" />
        </div>

        <span className="text-[10px] font-mono font-black tracking-widest px-3 py-1 rounded-full bg-[#FDF166] text-charcoal border border-black/10 uppercase mb-3">
          NFC Tap : {cardId || 'TAP-9482'}
        </span>

        <h1 className="text-3xl font-black text-charcoal tracking-tight leading-none">
          Check Your
        </h1>
        <h2 className="text-3xl font-black text-charcoal/35 tracking-tight leading-none mt-1">
          Smart Space
        </h2>

        <p className="text-xs text-charcoal/70 mt-3 font-semibold">{status}</p>

        <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden mt-6">
          <div className="h-full bg-[#4F83FF] rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </div>
  );
}
