'use client';

import React, { useState, useEffect } from 'react';
import { Pipette, Check, RotateCcw, Sparkles } from 'lucide-react';
import { isColorDark } from '@/lib/themes';

export interface ColorChartPickerProps {
  label?: string;
  description?: string;
  value?: string;
  onChange: (hex: string) => void;
  onReset?: () => void;
  resetLabel?: string;
  allowAutoContrast?: boolean;
  onAutoContrast?: (suggestedTextHex: string) => void;
  className?: string;
  showTextAutoSuggestion?: boolean;
}

// 9 Rich Spectral Rows covering 70+ vibrant and modern curated shades
export const SPECTRUM_CHART = [
  // 1. Neutrals, Blacks & Pastels
  [
    { name: 'Pure White', hex: '#FFFFFF' },
    { name: 'Warm Cream', hex: '#FAF7F2' },
    { name: 'Soft Gray', hex: '#F3F4F6' },
    { name: 'Slate Light', hex: '#E2E8F0' },
    { name: 'Cool Slate', hex: '#94A3B8' },
    { name: 'Charcoal', hex: '#4B5563' },
    { name: 'Dark Slate', hex: '#1E293B' },
    { name: 'Deep Obsidian', hex: '#141518' },
    { name: 'Pitch Black', hex: '#000000' },
  ],
  // 2. Reds & Corals
  [
    { name: 'Rose Red', hex: '#F87171' },
    { name: 'Vibrant Red', hex: '#EF4444' },
    { name: 'Crimson', hex: '#DC2626' },
    { name: 'Deep Ruby', hex: '#B91C1C' },
    { name: 'Wine Maroon', hex: '#991B1B' },
    { name: 'Coral Pop', hex: '#FB7185' },
    { name: 'Cherry', hex: '#E11D48' },
    { name: 'Dark Berry', hex: '#BE123C' },
  ],
  // 3. Oranges & Terracottas
  [
    { name: 'Apricot', hex: '#FDBA74' },
    { name: 'Bright Orange', hex: '#FB923C' },
    { name: 'Tangerine', hex: '#F97316' },
    { name: 'Burnt Orange', hex: '#EA580C' },
    { name: 'Terracotta', hex: '#C2410C' },
    { name: 'Rust', hex: '#9A3412' },
    { name: 'Warm Amber', hex: '#F59E0B' },
    { name: 'Deep Amber', hex: '#D97706' },
  ],
  // 4. Yellows & Golds
  [
    { name: 'Butter Cream', hex: '#FEF08A' },
    { name: 'Tapping Butter', hex: '#FDF166' },
    { name: 'Sunny Yellow', hex: '#FDE047' },
    { name: 'Vibrant Gold', hex: '#FACC15' },
    { name: 'Deep Gold', hex: '#EAB308' },
    { name: 'Mustard', hex: '#CA8A04' },
    { name: 'Bronze Gold', hex: '#A16207' },
    { name: 'Dark Mustard', hex: '#854D0E' },
  ],
  // 5. Limes & Greens
  [
    { name: 'Neon Lime', hex: '#B6F554' },
    { name: 'Bright Lime', hex: '#A3E635' },
    { name: 'Lime Green', hex: '#84CC16' },
    { name: 'Olive Green', hex: '#65A30D' },
    { name: 'Mint Green', hex: '#34D399' },
    { name: 'Emerald', hex: '#10B981' },
    { name: 'Forest Green', hex: '#059669' },
    { name: 'Deep Pine', hex: '#047857' },
  ],
  // 6. Cyans & Teals
  [
    { name: 'Ice Cyan', hex: '#A5F3FC' },
    { name: 'Sky Cyan', hex: '#38BDF8' },
    { name: 'Aqua Teal', hex: '#22D3EE' },
    { name: 'Electric Cyan', hex: '#06B6D4' },
    { name: 'Deep Cyan', hex: '#0891B2' },
    { name: 'Sea Teal', hex: '#14B8A6' },
    { name: 'Dark Teal', hex: '#0D9488' },
    { name: 'Ocean Pine', hex: '#0F766E' },
  ],
  // 7. Blues & Cobalts
  [
    { name: 'Soft Blue', hex: '#EFF4FF' },
    { name: 'Sky Blue', hex: '#60A5FA' },
    { name: 'Electric Cobalt', hex: '#4F83FF' },
    { name: 'Vibrant Blue', hex: '#3B82F6' },
    { name: 'Royal Blue', hex: '#2563EB' },
    { name: 'Classic Navy', hex: '#1D4ED8' },
    { name: 'Midnight Blue', hex: '#1E40AF' },
    { name: 'Deep Abyss', hex: '#1E3A8A' },
  ],
  // 8. Purples & Violets
  [
    { name: 'Pastel Lilac', hex: '#F3E8FF' },
    { name: 'Lavender', hex: '#C084FC' },
    { name: 'Bright Violet', hex: '#A855F7' },
    { name: 'Electric Purple', hex: '#8B5CF6' },
    { name: 'Royal Violet', hex: '#7C3AED' },
    { name: 'Deep Purple', hex: '#6D28D9' },
    { name: 'Dark Violet', hex: '#581C87' },
    { name: 'Midnight Plum', hex: '#3B0764' },
  ],
  // 9. Pinks & Magentas
  [
    { name: 'Pastel Blush', hex: '#FCE7F3' },
    { name: 'Bubblegum Pink', hex: '#F472B6' },
    { name: 'Hot Pink', hex: '#EC4899' },
    { name: 'Magenta', hex: '#D946EF' },
    { name: 'Deep Magenta', hex: '#C026D3' },
    { name: 'Ruby Pink', hex: '#DB2777' },
    { name: 'Berry Maroon', hex: '#9D174D' },
    { name: 'Dark Rose', hex: '#831843' },
  ],
];

export default function ColorChartPicker({
  label = 'Color Theme Spectrum',
  description = 'Pick any color from the spectrum or use the color wheel',
  value = '#FFFFFF',
  onChange,
  onReset,
  resetLabel = 'Reset Default',
  allowAutoContrast = false,
  onAutoContrast,
  className = '',
  showTextAutoSuggestion = false,
}: ColorChartPickerProps) {
  const [internalHex, setInternalHex] = useState(value || '#FFFFFF');
  const [hexInputText, setHexInputText] = useState(value || '#FFFFFF');

  useEffect(() => {
    if (value) {
      setInternalHex(value);
      setHexInputText(value);
    }
  }, [value]);

  const handleSelectColor = (hex: string) => {
    setInternalHex(hex);
    setHexInputText(hex);
    onChange(hex);

    if (allowAutoContrast && onAutoContrast) {
      const isDark = isColorDark(hex);
      onAutoContrast(isDark ? '#FFFFFF' : '#141518');
    }
  };

  const handleManualHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInputText(val);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(val)) {
      setInternalHex(val);
      onChange(val);
      if (allowAutoContrast && onAutoContrast) {
        const isDark = isColorDark(val);
        onAutoContrast(isDark ? '#FFFFFF' : '#141518');
      }
    }
  };

  const isCurrentDark = isColorDark(internalHex);
  const suggestedTextColor = isCurrentDark ? '#FFFFFF' : '#141518';

  return (
    <div className={`p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3 ${className}`}>
      {/* Top Header & Selected Color Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="text-[11px] font-black text-charcoal uppercase tracking-wider block">
            {label}
          </label>
          {description && (
            <p className="text-[10px] text-charcoal/60 font-medium">
              {description}
            </p>
          )}
        </div>

        {/* Selected Color Badge & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-black/10 shadow-2xs">
            <span
              className="w-4 h-4 rounded-full border border-black/15 shadow-2xs shrink-0"
              style={{ backgroundColor: internalHex }}
            />
            <span className="font-mono font-bold text-[11px] text-charcoal">
              {internalHex.toUpperCase()}
            </span>
          </div>

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-gray-100 text-charcoal/70 hover:text-black border border-black/10 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
              title={resetLabel}
            >
              <RotateCcw className="w-3 h-3" />
              <span>{resetLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Spectrum Chart Grid */}
      <div className="flex flex-col gap-1.5 p-2 rounded-2xl bg-white border border-black/10 overflow-x-auto no-scrollbar shadow-inner">
        {SPECTRUM_CHART.map((row, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-1.5 min-w-max">
            {row.map((item) => {
              const isSelected = internalHex.toLowerCase() === item.hex.toLowerCase();
              const isDarkSwatch = isColorDark(item.hex);
              return (
                <button
                  key={item.hex}
                  type="button"
                  onClick={() => handleSelectColor(item.hex)}
                  title={`${item.name} (${item.hex})`}
                  className={`w-6 h-6 rounded-lg transition-transform flex items-center justify-center cursor-pointer border relative ${
                    isSelected
                      ? 'scale-110 shadow-md ring-2 ring-black z-10 border-transparent'
                      : 'hover:scale-105 border-black/15 shadow-2xs'
                  }`}
                  style={{ backgroundColor: item.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 stroke-[3] ${
                        isDarkSwatch ? 'text-white' : 'text-black'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Bottom Bar: Interactive Native Color Wheel Eyedropper + Direct Hex Input */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
        
        {/* Native HTML5 Color Picker Wheel */}
        <label className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white hover:bg-gray-50 border border-black/10 text-xs font-bold text-charcoal shadow-2xs cursor-pointer transition-colors shrink-0">
          <div className="w-5 h-5 rounded-full p-[1px] bg-conic from-rose-500 via-amber-400 via-emerald-400 via-cyan-400 via-blue-500 to-rose-500 shadow-2xs flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-white" style={{ backgroundColor: internalHex }} />
          </div>
          <Pipette className="w-3.5 h-3.5 text-[#4F83FF]" />
          <span>Full Color Wheel</span>
          <input
            type="color"
            value={internalHex.startsWith('#') && internalHex.length === 7 ? internalHex : '#4F83FF'}
            onChange={(e) => handleSelectColor(e.target.value)}
            className="sr-only"
          />
        </label>

        {/* Manual Hex Input with Prefix */}
        <div className="flex items-center gap-2">
          <div className="flex items-center px-3 py-1.5 rounded-2xl bg-white border border-black/10 shadow-2xs text-xs font-mono font-bold text-charcoal">
            <span className="text-charcoal/40 select-none mr-0.5">HEX:</span>
            <input
              type="text"
              value={hexInputText}
              onChange={handleManualHexChange}
              placeholder="#FFFFFF"
              maxLength={7}
              className="bg-transparent focus:outline-none w-20 text-xs font-mono font-bold text-charcoal uppercase"
            />
          </div>

          {/* Auto Contrast Button (if requested) */}
          {showTextAutoSuggestion && onAutoContrast && (
            <button
              type="button"
              onClick={() => onAutoContrast(suggestedTextColor)}
              className="px-3 py-1.5 rounded-2xl bg-white hover:bg-gray-50 border border-black/10 text-[10px] font-bold text-charcoal shadow-2xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              title={`Set text to ${isCurrentDark ? 'White' : 'Black'} for maximum contrast`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Auto Text Contrast ({isCurrentDark ? 'White' : 'Black'})</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
