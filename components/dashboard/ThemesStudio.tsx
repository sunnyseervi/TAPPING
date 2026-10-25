'use client';

import React from 'react';
import { Profile, ThemeType } from '@/lib/types';
import { Palette, Check } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface ThemesStudioProps {
  profile: Profile;
  onUpdateProfile: (updated: Profile) => void;
}

export default function ThemesStudio({ profile, onUpdateProfile }: ThemesStudioProps) {
  const { showToast } = useToast();

  const themes: {
    id: ThemeType;
    name: string;
    description: string;
    colors: string[];
    isDefault?: boolean;
  }[] = [
    {
      id: 'pastel-bento',
      name: 'Pastel Bento Canvas',
      description: 'Warm cream canvas with soft peach, lavender, mint and butter cards',
      colors: ['#FAF7F2', '#FED5C3', '#E4E0FA', '#D8ECD7', '#1F2024'],
      isDefault: true,
    },
    {
      id: 'warm-editorial',
      name: 'Warm Editorial Paper',
      description: 'Terracotta accents with off-white warm paper styling',
      colors: ['#FAF7F2', '#C0512F', '#2F5B4F', '#8A817A', '#1C1A17'],
    },
    {
      id: 'sage-cream',
      name: 'Sage and Botanical',
      description: 'Organic botanical greens with soft ivory and matcha pills',
      colors: ['#F6F8F5', '#D8ECD7', '#A3CFAB', '#3B6846', '#223326'],
    },
    {
      id: 'minimal-mono',
      name: 'Minimal Monochrome',
      description: 'Crisp high-contrast monochrome with subtle borders',
      colors: ['#FFFFFF', '#F4F4F5', '#71717A', '#18181B', '#09090B'],
    },
    {
      id: 'tokyo-night',
      name: 'Tokyo Neon Canvas',
      description: 'Dark indigo canvas with vibrant pastel highlights',
      colors: ['#1A1B26', '#7AA2F7', '#BB9AF7', '#7DCFFF', '#C0CAF5'],
    },
  ];

  const handleSelectTheme = (themeId: ThemeType) => {
    const updated: Profile = {
      ...profile,
      theme: themeId,
    };
    onUpdateProfile(updated);
    showToast('Theme Applied', `Switched theme`, 'success');
  };

  return (
    <div className="bg-white rounded-4xl p-5 md:p-6 border border-black/5 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-pastel-yellow flex items-center justify-center">
              <Palette className="w-4 h-4 text-charcoal" />
            </div>
            <h2 className="text-lg font-extrabold text-charcoal">Themes and Visual Design</h2>
          </div>
          <p className="text-xs text-charcoal-muted mt-0.5">
            Curated palettes engineered for mobile legibility, soft pastels, and restrained contrast
          </p>
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {themes.map((t) => {
          const isSelected = profile.theme === t.id;
          return (
            <div
              key={t.id}
              onClick={() => handleSelectTheme(t.id)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between text-left relative ${
                isSelected
                  ? 'border-charcoal bg-black/[0.02] ring-2 ring-charcoal shadow-md'
                  : 'border-black/10 bg-[#FAF7F2] hover:bg-white hover:border-black/20'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-charcoal text-white flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-extrabold text-sm text-charcoal">{t.name}</h3>
                  {t.isDefault && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-pastel-peach text-charcoal border border-pastel-peach-border">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal-muted leading-relaxed line-clamp-2">
                  {t.description}
                </p>
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-1.5 mt-4 pt-2 border-t border-black/5">
                {t.colors.map((c, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-black/10 shadow-xs"
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
