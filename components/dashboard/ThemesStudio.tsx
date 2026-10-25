'use client';

import React, { useState } from 'react';
import { 
  Profile, 
  ThemeType, 
  FontFamilyType, 
  FontSizeScale, 
  BackgroundPatternType, 
  LinkCardStyleType 
} from '@/lib/types';
import { 
  Palette, 
  Check, 
  Type, 
  Sparkles, 
  Sliders, 
  Image as ImageIcon, 
  Layers, 
  Sun,
  Zap,
  Flame,
  Upload,
  Trash2
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { THEMES } from '@/lib/themes';

interface ThemesStudioProps {
  profile: Profile;
  onUpdateProfile: (updated: Profile) => void;
}

export default function ThemesStudio({ profile, onUpdateProfile }: ThemesStudioProps) {
  const { showToast } = useToast();
  const [activeStudioTab, setActiveStudioTab] = useState<'themes' | 'typography' | 'cards' | 'background'>('themes');
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Invalid File', 'Please select a PNG, JPG, or SVG image file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const updated: Profile = {
        ...profile,
        customHeaderImage: dataUrl,
        showHeaderBackground: true,
      };
      onUpdateProfile(updated);
      showToast('Custom Header Banner Uploaded', 'Applied directly to your profile header', 'success');
    };
    reader.readAsDataURL(file);
  };

  const themeList = Object.values(THEMES);

  // Active theme helper
  const currentTheme = THEMES[profile.theme] || THEMES['pastel-bento'];

  const handleSelectTheme = (themeId: ThemeType) => {
    const selected = THEMES[themeId];
    const updated: Profile = {
      ...profile,
      theme: themeId,
      fontFamily: selected.defaultFont,
      headerBackground: selected.defaultPattern,
      showHeaderBackground: selected.defaultPattern !== 'none',
      linkCardStyle: selected.defaultCardStyle,
    };
    onUpdateProfile(updated);
    showToast('Theme Applied', `Switched to ${selected.name}`, 'success');
  };

  const handleUpdateFontFamily = (font: FontFamilyType) => {
    const updated: Profile = {
      ...profile,
      fontFamily: font,
    };
    onUpdateProfile(updated);
    showToast('Font Updated', `Applied ${font.toUpperCase()} typography`, 'info');
  };

  const handleUpdateFontSize = (size: FontSizeScale) => {
    const updated: Profile = {
      ...profile,
      fontSize: size,
    };
    onUpdateProfile(updated);
    showToast('Size Adjusted', `Font scale set to ${size.toUpperCase()}`, 'info');
  };

  const handleUpdateFontColor = (hex: string) => {
    const updated: Profile = {
      ...profile,
      fontColor: hex,
    };
    onUpdateProfile(updated);
    showToast('Color Updated', `Heading color set to ${hex}`, 'info');
  };

  const handleUpdateLinkCardStyle = (style: LinkCardStyleType) => {
    const updated: Profile = {
      ...profile,
      linkCardStyle: style,
    };
    onUpdateProfile(updated);
    showToast('Card Style Applied', `Links will render in ${style} aesthetic`, 'success');
  };

  const handleUpdateHeaderPattern = (pattern: BackgroundPatternType) => {
    const updated: Profile = {
      ...profile,
      headerBackground: pattern,
      showHeaderBackground: pattern !== 'none',
    };
    onUpdateProfile(updated);
    showToast('Background Pattern Set', `Header styled with ${pattern}`, 'success');
  };

  const handleToggleHeaderBackground = () => {
    const nextVal = !profile.showHeaderBackground;
    const updated: Profile = {
      ...profile,
      showHeaderBackground: nextVal,
      headerBackground: nextVal ? (profile.headerBackground || 'comic-sunburst') : 'none',
    };
    onUpdateProfile(updated);
    showToast(nextVal ? 'Header Banner Active' : 'Header Banner Hidden', '', 'info');
  };

  const fontOptions: { id: FontFamilyType; name: string; preview: string; class: string; desc: string }[] = [
    { id: 'sans', name: 'Modern Sans', preview: 'Clean & Crisp', class: 'font-sans font-bold', desc: 'Plus Jakarta Sans - Perfect for startups & designers' },
    { id: 'comic', name: 'Comic Pop', preview: 'BOOM! HERO', class: 'font-comic text-lg', desc: 'Bangers - Marvel & Comic-Con explosive bold letters' },
    { id: 'cartoon', name: 'Playful Cartoon', preview: 'Fun & Friendly', class: 'font-cartoon font-bold', desc: 'Fredoka - Rounded anime & doodle style' },
    { id: 'serif', name: 'Editorial Serif', preview: 'Timeless Classic', class: 'font-serif font-semibold italic', desc: 'Playfair Display - High-end fashion & culture' },
    { id: 'mono', name: 'Retro Arcade Mono', preview: '01: CODE & 8-BIT', class: 'font-mono-code font-bold text-xs', desc: 'Space Mono - Cyberpunk & arcade engineering' },
  ];

  const sizeOptions: { id: FontSizeScale; name: string; label: string }[] = [
    { id: 'sm', name: 'Compact', label: '13px Base' },
    { id: 'md', name: 'Standard', label: '15px Base' },
    { id: 'lg', name: 'Prominent', label: '17px Base' },
    { id: 'xl', name: 'Bold Display', label: '19px Base' },
  ];

  const fontColorPresets = [
    { name: 'Charcoal Black', hex: '#141518' },
    { name: 'Comic Red', hex: '#EF4444' },
    { name: 'Electric Cobalt', hex: '#4F83FF' },
    { name: 'Neon Lime', hex: '#16A34A' },
    { name: 'Terracotta', hex: '#C0512F' },
    { name: 'Vapor Purple', hex: '#7E22CE' },
    { name: 'Cyber Amber', hex: '#D97706' },
  ];

  const cardStyles: { id: LinkCardStyleType; name: string; desc: string; previewClass: string }[] = [
    { 
      id: 'solid', 
      name: 'Pastel Bento Solid', 
      desc: 'Clean restrained pastel pills with subtle borders', 
      previewClass: 'bg-[#EFF4FF] border border-[#4F83FF]/20 text-charcoal' 
    },
    { 
      id: 'comic-brutalist', 
      name: 'Comic Pop Brutalist', 
      desc: 'Bold 2.5px black border with retro offset hard drop shadow', 
      previewClass: 'bg-[#FEF08A] border-2 border-black shadow-[3px_3px_0px_#000] text-black font-black' 
    },
    { 
      id: 'retro-pixel', 
      name: 'Retro 8-Bit Pixel', 
      desc: 'Arcade borders with synthwave neon edge glow', 
      previewClass: 'bg-[#111827] border-2 border-[#38BDF8] text-[#38BDF8] shadow-[3px_3px_0px_#0284C7] font-mono' 
    },
    { 
      id: 'glass-glow', 
      name: 'Frosted Glass Glow', 
      desc: 'Translucent soft backdrop blur with subtle border sheen', 
      previewClass: 'bg-white/80 backdrop-blur-md border border-black/10 text-charcoal shadow-sm' 
    },
    { 
      id: 'vintage-ticket', 
      name: 'Vintage Ticket / Stamp', 
      desc: 'Editorial perforated ticket aesthetic on warm paper', 
      previewClass: 'bg-[#FCFBF8] border border-dashed border-[#CFC6B9] text-[#1C1A17] font-serif' 
    },
    { 
      id: 'minimal-outline', 
      name: 'Minimal Clean Outline', 
      desc: 'Zero background with razor-sharp 1px neutral border', 
      previewClass: 'bg-transparent border border-black/20 text-charcoal' 
    },
  ];

  const patternPresets: { id: BackgroundPatternType; name: string; desc: string; previewClass: string }[] = [
    { id: 'none', name: 'Clean Solid', desc: 'No background pattern', previewClass: 'bg-[#F7F5EE]' },
    { id: 'comic-sunburst', name: 'Comic Halftone Sunburst', desc: 'Explosive radial comic rays (from reference)', previewClass: 'pattern-comic-sunburst' },
    { id: 'pop-halftone', name: 'Retro Pop Halftone Dots', desc: 'Classic comic-book printing dot grid', previewClass: 'pattern-pop-halftone' },
    { id: 'retro-grid', name: '80s Synthwave Grid', desc: 'Arcade purple cyber perspective grid', previewClass: 'pattern-retro-grid' },
    { id: 'doodle-waves', name: 'Japanese Doodle Waves', desc: 'Ukiyo-e wave & geometric doodle curves', previewClass: 'pattern-doodle-waves' },
    { id: 'cloud-burst', name: 'Anime Cloud Burst', desc: 'Soft pastel comic cloud accents', previewClass: 'pattern-cloud-burst' },
    { id: 'tribal-glyphs', name: 'Tribal Glyph Doodle', desc: 'Geometric glyphs and doodle textures', previewClass: 'pattern-tribal-glyphs' },
  ];

  return (
    <div className="bg-white rounded-4xl p-6 md:p-8 border border-black/5 shadow-soft flex flex-col gap-6">
      
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-black/5 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal tracking-tight leading-none">
            Check Your
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-charcoal/35 tracking-tight leading-none mt-1">
            Design & Styles Studio
          </h2>
          <p className="text-xs text-charcoal/60 mt-2 font-medium">
            Customize complete theme systems, comic & retro card designs, custom typography fonts, and header backgrounds
          </p>
        </div>

        {/* Active Theme Chip */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span className="text-[11px] font-bold text-charcoal/60">Active Theme:</span>
          <span className="px-3.5 py-1.5 rounded-full bg-[#FDF166] text-charcoal text-xs font-black border border-black/10 shadow-xs">
            {currentTheme.name}
          </span>
        </div>
      </div>

      {/* STUDIO MODE SWITCHER TABS */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#FAF7F2] border border-black/5 self-start">
        <button
          onClick={() => setActiveStudioTab('themes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeStudioTab === 'themes' ? 'bg-[#141518] text-white shadow-xs' : 'text-charcoal/70 hover:text-black'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Themes (9 Presets)</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('typography')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeStudioTab === 'typography' ? 'bg-[#141518] text-white shadow-xs' : 'text-charcoal/70 hover:text-black'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Fonts & Size</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('cards')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeStudioTab === 'cards' ? 'bg-[#141518] text-white shadow-xs' : 'text-charcoal/70 hover:text-black'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Card & Link Styles</span>
        </button>

        <button
          onClick={() => setActiveStudioTab('background')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            activeStudioTab === 'background' ? 'bg-[#141518] text-white shadow-xs' : 'text-charcoal/70 hover:text-black'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Header & Background</span>
        </button>
      </div>

      {/* TAB 1: COMPLETE THEME PRESETS (Comic Pop, Retro 8-Bit, Cartoon Doodle, Vaporwave, Pastel Bento, etc.) */}
      {activeStudioTab === 'themes' && (
        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold text-charcoal/60">
            Select a design theme inspired by your reference library (Comic Pop Art, Retro Arcade, Playful Cartoons, Editorial Paper, etc.):
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themeList.map((t) => {
              const isSelected = profile.theme === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => handleSelectTheme(t.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between text-left relative ${
                    isSelected
                      ? 'border-charcoal bg-black/[0.04] ring-2 ring-charcoal shadow-card scale-[1.01]'
                      : 'border-black/10 bg-[#FAF7F2] hover:bg-white hover:border-black/20 hover:shadow-xs'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-[#141518] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1.5 pr-6">
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/5 text-charcoal/70">
                        {t.category}
                      </span>
                    </div>

                    <h3 className="font-black text-sm text-charcoal">{t.name}</h3>
                    <p className="text-xs text-charcoal/70 leading-relaxed font-medium mt-1">
                      {t.description}
                    </p>
                  </div>

                  {/* Color Palette Swatches */}
                  <div className="flex items-center gap-1.5 mt-5 pt-3 border-t border-black/5">
                    {t.previewColors.map((c, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: TYPOGRAPHY, FONT FAMILIES, COLOR & RESIZING */}
      {activeStudioTab === 'typography' && (
        <div className="flex flex-col gap-6">
          {/* Font Family Selection */}
          <div>
            <h3 className="text-sm font-black text-charcoal mb-1">Font Family Design</h3>
            <p className="text-xs text-charcoal/60 mb-3">Choose the typography personality for your entire profile:</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {fontOptions.map((f) => {
                const isSelected = (profile.fontFamily || 'sans') === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => handleUpdateFontFamily(f.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-charcoal bg-black/[0.03] ring-2 ring-charcoal shadow-xs'
                        : 'border-black/10 bg-[#FAF7F2] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-black text-charcoal">{f.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#4F83FF]" />}
                    </div>
                    <div className={`my-2 p-2 rounded-xl bg-white border border-black/5 text-charcoal ${f.class}`}>
                      {f.preview}
                    </div>
                    <p className="text-[10px] text-charcoal/60 font-medium">{f.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Font Size Scaling */}
          <div className="pt-4 border-t border-black/5">
            <h3 className="text-sm font-black text-charcoal mb-1">Font Size Scale</h3>
            <p className="text-xs text-charcoal/60 mb-3">Scale text sizes larger or more compact across mobile & desktop:</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
              {sizeOptions.map((s) => {
                const isSelected = (profile.fontSize || 'md') === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleUpdateFontSize(s.id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-charcoal bg-[#141518] text-white shadow-xs'
                        : 'border-black/10 bg-[#FAF7F2] hover:bg-white text-charcoal'
                    }`}
                  >
                    <span className="block text-xs font-black">{s.name}</span>
                    <span className="block text-[10px] opacity-70 mt-0.5">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Heading Font Color */}
          <div className="pt-4 border-t border-black/5">
            <h3 className="text-sm font-black text-charcoal mb-1">Heading Font Color</h3>
            <p className="text-xs text-charcoal/60 mb-3">Select primary text and heading accent color:</p>

            <div className="flex flex-wrap items-center gap-3">
              {fontColorPresets.map((c) => {
                const isSelected = (profile.fontColor || '#141518') === c.hex;
                return (
                  <button
                    key={c.hex}
                    onClick={() => handleUpdateFontColor(c.hex)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-charcoal bg-black/[0.04] ring-2 ring-charcoal'
                        : 'border-black/10 bg-[#FAF7F2] hover:bg-white'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-xs font-bold text-charcoal">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CARD & LINK BLOCK STYLES */}
      {activeStudioTab === 'cards' && (
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-sm font-black text-charcoal mb-1">Link Block Design System</h3>
            <p className="text-xs text-charcoal/60 mb-3">
              Choose how your content link cards are rendered (Comic Brutalist, 8-Bit Retro Pixel, Frosted Glass, Vintage Ticket, etc.):
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cardStyles.map((cs) => {
              const isSelected = (profile.linkCardStyle || 'solid') === cs.id;
              return (
                <div
                  key={cs.id}
                  onClick={() => handleUpdateLinkCardStyle(cs.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-charcoal bg-black/[0.03] ring-2 ring-charcoal shadow-xs'
                      : 'border-black/10 bg-[#FAF7F2] hover:bg-white hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-black text-charcoal">{cs.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#4F83FF]" />}
                  </div>

                  {/* Live Mini Preview of Link Card */}
                  <div className={`my-3 p-3.5 rounded-2xl flex items-center justify-between text-xs ${cs.previewClass}`}>
                    <div className="flex items-center gap-2 truncate">
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span className="truncate">Sample Link Block</span>
                    </div>
                    <span className="text-[10px] font-mono">↗</span>
                  </div>

                  <p className="text-xs text-charcoal/60 font-medium">{cs.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: HEADER BANNER & BACKGROUND PATTERNS */}
      {activeStudioTab === 'background' && (
        <div className="flex flex-col gap-6">
          {/* Header Banner Toggle */}
          <div className="flex items-center justify-between p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 max-w-xl">
            <div>
              <p className="text-xs font-black text-charcoal">Header Background Banner</p>
              <p className="text-[11px] text-charcoal/60 font-medium">
                Add an expressive comic sunburst, retro grid, doodle art or custom photo behind your avatar
              </p>
            </div>

            <button
              onClick={handleToggleHeaderBackground}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                profile.showHeaderBackground
                  ? 'bg-[#141518] text-white shadow-xs'
                  : 'bg-white border border-black/10 text-charcoal'
              }`}
            >
              {profile.showHeaderBackground ? 'Active / Shown' : 'Disabled / Hidden'}
            </button>
          </div>

          {/* Custom Uploaded Header Banner */}
          <div className="p-5 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-charcoal">Upload Custom Banner Image</p>
                <p className="text-[11px] text-charcoal/60 font-medium">
                  Upload your own photography, anime, branded banner, or illustration
                </p>
              </div>

              {profile.customHeaderImage && (
                <button
                  onClick={() => {
                    onUpdateProfile({ ...profile, customHeaderImage: undefined });
                    showToast('Custom Banner Removed', 'Switched back to preset pattern', 'info');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-200 cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove Custom</span>
                </button>
              )}
            </div>

            <input
              type="file"
              ref={bannerInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleBannerUpload}
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                className="py-2.5 px-4 rounded-2xl bg-white hover:bg-gray-50 border border-black/10 text-xs font-black text-charcoal flex items-center justify-center gap-2 shadow-2xs cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-[#4F83FF]" />
                <span>Upload Banner from Device (PNG/JPG)</span>
              </button>
            </div>

            {profile.customHeaderImage && (
              <div 
                className="w-full h-24 rounded-2xl border border-black/10 bg-cover bg-center shadow-xs"
                style={{ backgroundImage: `url(${profile.customHeaderImage})` }}
              />
            )}
          </div>

          {/* Pattern Library */}
          <div>
            <h3 className="text-sm font-black text-charcoal mb-1">Pattern & Texture Presets</h3>
            <p className="text-xs text-charcoal/60 mb-3">
              Curated from your 100+ pop-art, comic book, and retro design collages:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {patternPresets.map((p) => {
                const isSelected = (profile.headerBackground || 'none') === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleUpdateHeaderPattern(p.id)}
                    className={`rounded-3xl border overflow-hidden transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-charcoal ring-2 ring-charcoal shadow-card scale-[1.01]'
                        : 'border-black/10 bg-white hover:shadow-xs'
                    }`}
                  >
                    {/* Pattern Banner Preview */}
                    <div className={`h-24 w-full relative flex items-center justify-center ${p.previewClass}`}>
                      {isSelected && (
                        <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-md">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}
                    </div>

                    <div className="p-4 text-left">
                      <h4 className="text-xs font-black text-charcoal">{p.name}</h4>
                      <p className="text-[11px] text-charcoal/60 font-medium mt-0.5">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
