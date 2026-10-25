'use client';

import React from 'react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

interface BentoMenuGridProps {
  onSelectTab: (tab: string) => void;
  activeTab: string;
}

export default function BentoMenuGrid({ onSelectTab, activeTab }: BentoMenuGridProps) {
  const cards = [
    {
      id: 'links',
      title: 'Links and Blocks',
      subtitle: 'Organize cards, portfolios, and live social links',
      cta: 'Check',
      bgColor: 'bg-pastel-peach hover:bg-[#FDBFA7]',
      borderColor: 'border-pastel-peach-border',
      badge: '5 Active',
    },
    {
      id: 'vcard',
      title: 'Digital Business Card',
      subtitle: 'Export contact directly to smartphone phonebooks',
      cta: 'Check',
      bgColor: 'bg-pastel-lavender hover:bg-[#D5CEFA]',
      borderColor: 'border-pastel-lavender-border',
      badge: 'vCard 3.0',
    },
    {
      id: 'qr',
      title: 'Permanent QR Studio',
      subtitle: 'Dynamic vector QR code generator with live routing',
      cta: 'Check',
      bgColor: 'bg-pastel-mint hover:bg-[#C2E4BF]',
      borderColor: 'border-pastel-mint-border',
      badge: 'Vector',
    },
    {
      id: 'nfc',
      title: 'Metal NFC Hardware',
      subtitle: 'Custom laser engraved physical card with tap chip',
      cta: 'Check',
      bgColor: 'bg-pastel-rose hover:bg-[#F9BFCC]',
      borderColor: 'border-pastel-rose-border',
      badge: '4 Finishes',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card) => {
        const isActive = activeTab === card.id;
        return (
          <div
            key={card.id}
            onClick={() => onSelectTab(card.id)}
            className={`${card.bgColor} ${card.borderColor} rounded-3xl p-5 border shadow-soft transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-card hover:-translate-y-0.5 active:translate-y-0 relative overflow-hidden group ${
              isActive ? 'ring-2 ring-charcoal' : ''
            }`}
          >
            {/* Top row matching image: Title on left, White circular badge on right */}
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-base font-black text-charcoal leading-tight">
                  {card.title}
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/70 text-charcoal border border-white/80 inline-block mt-1">
                  {card.badge}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="w-4 h-4 text-charcoal stroke-[2.5]" />
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-charcoal/75 font-medium my-2 leading-relaxed line-clamp-2">
              {card.subtitle}
            </p>

            {/* Bottom row matching image: "Check ->" */}
            <div className="flex items-center justify-between pt-2 border-t border-black/[0.05]">
              <span className="text-xs font-black text-charcoal flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>{card.cta}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
