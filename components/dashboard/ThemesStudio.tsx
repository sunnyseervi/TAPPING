'use client';

import React from 'react';
import { Profile, ThemeType } from '@/lib/types';
import { Palette, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { THEMES } from '@/lib/themes';

interface ThemesStudioProps {
  profile: Profile;
  onUpdateProfile: (updated: Profile) => void;
}

export default function ThemesStudio({ profile, onUpdateProfile }: ThemesStudioProps) {
  const { showToast } = useToast();

  const themeList = Object.values(THEMES);

  const handleSelectTheme = (themeId: ThemeType) => {
    const updated: Profile = {
      ...profile,
      theme: themeId,
    };
    onUpdateProfile(updated);
    showToast('Theme Applied', `Switched theme to ${THEMES[themeId].name}`, 'success');
  };

  return (
    <div className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-black/5 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-none">
            Check Your
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal/35 tracking-tight leading-none mt-1">
            Theme Space
          </h2>
          <p className="text-xs text-charcoal/60 mt-2 font-medium">
            Select a color system for your public profile, bento cards, and interactive identity
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-[11px] font-bold text-charcoal/60">Active:</span>
          <span className="px-3.5 py-1.5 rounded-full bg-[#FDF166] text-charcoal text-xs font-black border border-black/10 shadow-xs">
            {THEMES[profile.theme]?.name || 'Pastel Bento Canvas'}
          </span>
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {themeList.map((t) => {
          const isSelected = profile.theme === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleSelectTheme(t.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between text-left relative ${
                isSelected
                  ? 'border-charcoal bg-black/[0.03] ring-2 ring-charcoal shadow-card'
                  : 'border-black/10 bg-[#FAF7F2] hover:bg-white hover:border-black/20'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#4F83FF] text-white flex items-center justify-center shadow-xs">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2 pr-6">
                  <h3 className="font-black text-sm text-charcoal">{t.name}</h3>
                  {t.id === 'pastel-bento' && (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#FDF166] text-charcoal border border-black/10">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal/70 leading-relaxed font-medium">
                  {t.description}
                </p>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-2 mt-5 pt-3 border-t border-black/5">
                {t.previewColors.map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
