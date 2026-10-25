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
  Link2, 
  Sliders, 
  Image as ImageIcon, 
  Layers, 
  Sun,
  Zap,
  Flame,
  Upload,
  Trash2,
  Search,
  ZoomIn,
  ZoomOut,
  Move,
  Maximize2,
  Eye,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import confetti from 'canvas-confetti';
import { THEMES } from '@/lib/themes';
import { CARD_FONTS, CardFont, findCardFont } from '@/lib/cardFonts';

interface ThemesStudioProps {
  profile: Profile;
  onUpdateProfile: (updated: Profile) => void;
  onLivePreviewChange?: (updated: Profile) => void;
}

export default function ThemesStudio({ profile, onUpdateProfile, onLivePreviewChange }: ThemesStudioProps) {
  const { showToast } = useToast();
  const [draftProfile, setDraftProfile] = useState<Profile>(profile);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeStudioTab, setActiveStudioTab] = useState<'themes' | 'typography' | 'cards' | 'background'>('themes');
  const [fontCategory, setFontCategory] = useState<string>('All');
  const [fontSearch, setFontSearch] = useState<string>('');
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

  // Synchronize saved data without overwriting an active draft preview.
  React.useEffect(() => {
    if (!hasUnsavedChanges) setDraftProfile(profile);
  }, [profile, hasUnsavedChanges]);

  const updateDraft = (partial: Partial<Profile>) => {
    const updated: Profile = {
      ...draftProfile,
      ...partial,
    };
    setDraftProfile(updated);
    setHasUnsavedChanges(true);
    onLivePreviewChange?.(updated);
  };

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
        ...draftProfile,
        customHeaderImage: dataUrl,
        showHeaderBackground: true,
        cardBehindContent: draftProfile.cardBehindContent ?? true,
        cardContainerStyle: draftProfile.cardContainerStyle || 'glass',
        bgImageZoom: draftProfile.bgImageZoom ?? 100,
        bgImageFit: draftProfile.bgImageFit || 'cover',
        bgImageDim: draftProfile.bgImageDim ?? 35,
        bgImagePosX: draftProfile.bgImagePosX ?? 0,
        bgImagePosY: draftProfile.bgImagePosY ?? 0,
        bgImageBlur: draftProfile.bgImageBlur ?? 0,
      };
      setDraftProfile(updated);
      setHasUnsavedChanges(true);
      onLivePreviewChange?.(updated);
      showToast('Wallpaper Uploaded', 'Background image active. Configure zoom, fit & card backing below.', 'success');
    };
    reader.readAsDataURL(file);
  };

  const themeList = Object.values(THEMES);

  // Active theme helper from draft
  const currentTheme = THEMES[draftProfile.theme] || THEMES['pastel-bento'];

  // Select theme locally for live preview — ONLY saves when user clicks Save button!
  const handleSelectTheme = (themeId: ThemeType) => {
    const selected = THEMES[themeId];
    const updated: Profile = {
      ...draftProfile,
      theme: themeId,
      fontFamily: selected.defaultFont,
      headerBackground: selected.defaultPattern,
      showHeaderBackground: selected.defaultPattern !== 'none',
      linkCardStyle: selected.defaultCardStyle,
      fontColor: undefined,
    };
    setDraftProfile(updated);
    setHasUnsavedChanges(true);
    // Real-time phone preview update without saving or spamming toasts
    onLivePreviewChange?.(updated);
  };

  const handleUpdateFontFamily = (font: FontFamilyType) => {
    const updated: Profile = {
      ...draftProfile,
      fontFamily: font,
    };
    setDraftProfile(updated);
    setHasUnsavedChanges(true);
    onLivePreviewChange?.(updated);
  };

  const handleUpdateFontSize = (size: FontSizeScale) => {
    const updated: Profile = {
      ...draftProfile,
      fontSize: size,
    };
    setDraftProfile(updated);
    setHasUnsavedChanges(true);
    onLivePreviewChange?.(updated);
  };

  const handleUpdateFontColor = (hex: string) => {
    const updated: Profile = {
      ...draftProfile,
      fontColor: hex,
    };
    setDraftProfile(updated);
    setHasUnsavedChanges(true);
    onLivePreviewChange?.(updated);
  };

  const handleUpdateLinkCardStyle = (style: LinkCardStyleType) => {
    const updated: Profile = {
      ...draftProfile,
      linkCardStyle: style,
    };
    setDraftProfile(updated);
    setHasUnsavedChanges(true);
    onLivePreviewChange?.(updated);
  };

  const handleUpdateHeaderPattern = (pattern: BackgroundPatternType) => {
    let nextTheme = draftProfile.theme;
    if ((pattern === 'comic-sunburst' || pattern === 'comic-sunburst-red' || pattern === 'pop-halftone' || pattern === 'pop-halftone-cyan') && (draftProfile.theme === 'cyberpunk-neon')) {
      nextTheme = 'comic-pop';
    }
    const updated: Profile = {
      ...draftProfile,
      theme: nextTheme,
      headerBackground: pattern,
      showHeaderBackground: pattern !== 'none',
    };
    setDraftProfile(updated);
    setHasUnsavedChanges(true);
    onLivePreviewChange?.(updated);
  };

  const handleToggleHeaderBackground = () => {
    const nextVal = !draftProfile.showHeaderBackground;
    const updated: Profile = {
      ...draftProfile,
      showHeaderBackground: nextVal,
      headerBackground: nextVal ? (draftProfile.headerBackground || 'comic-sunburst') : 'none',
    };
    setDraftProfile(updated);
    setHasUnsavedChanges(true);
    onLivePreviewChange?.(updated);
  };

  // Explicit Save Handler — ONLY saves when user clicks Save button!
  const handleSaveThemeChanges = () => {
    onUpdateProfile(draftProfile);
    setHasUnsavedChanges(false);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    showToast('Theme Saved Successfully', `Your link-in-bio is published with ${THEMES[draftProfile.theme]?.name || 'new theme'}`, 'success');
  };

  const handleDiscardChanges = () => {
    setDraftProfile(profile);
    setHasUnsavedChanges(false);
    onLivePreviewChange?.(profile);
    showToast('Changes Discarded', 'Reverted back to saved theme', 'info');
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
      id: 'comic-halftone', 
      name: 'Comic Halftone Burst', 
      desc: 'Explosive comic-book halftone dot background with bold outlines', 
      previewClass: 'bg-[#FFFBEB] border-2 border-black shadow-[3px_3px_0px_#000] pattern-pop-halftone text-black font-black' 
    },
    { 
      id: 'retro-pixel', 
      name: 'Retro 8-Bit Pixel', 
      desc: 'Arcade borders with synthwave neon edge glow', 
      previewClass: 'bg-[#111827] border-2 border-[#38BDF8] text-[#38BDF8] shadow-[3px_3px_0px_#0284C7] font-mono' 
    },
    { 
      id: 'cyber-terminal', 
      name: 'Cyber Terminal HUD', 
      desc: 'Matrix green terminal with glowing wireframe border', 
      previewClass: 'bg-[#050B14] border-2 border-[#00FF66] text-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.3)] font-mono' 
    },
    { 
      id: 'vaporwave-gradient', 
      name: 'Vaporwave Sunset Gradient', 
      desc: 'Pastel violet to hot pink sunset chill with luminous aura', 
      previewClass: 'bg-gradient-to-r from-[#7E22CE] to-[#EC4899] text-white font-serif border border-white/20' 
    },
    { 
      id: 'japanese-wave', 
      name: 'Japanese Wave Ukiyo', 
      desc: 'Deep indigo sea with cyan line art and crest highlights', 
      previewClass: 'bg-[#0B132B] border border-[#38BDF8]/40 text-white shadow-xs' 
    },
    { 
      id: 'neobrutal-pastel', 
      name: 'Neo-Brutalist Block', 
      desc: 'Electric yellow with 3px solid black borders and brutalist offset', 
      previewClass: 'bg-[#FEF08A] border-3 border-black text-black font-black shadow-[4px_4px_0px_#000]' 
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
      id: 'y2k-metallic', 
      name: 'Y2K Millennium Chrome', 
      desc: 'Liquid silver chrome sheen with bold futuristic display', 
      previewClass: 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 border-2 border-slate-400 text-slate-900 font-black' 
    },
    { 
      id: 'sticker-doodle', 
      name: 'Playful Sticker Doodle', 
      desc: 'Anime sticker decal with subtle 1deg rotation angle', 
      previewClass: 'bg-white border-2 border-black text-black font-cartoon shadow-[3px_3px_0px_#000]' 
    },
    { 
      id: 'minimal-outline', 
      name: 'Minimal Clean Outline', 
      desc: 'Zero background with razor-sharp 1px neutral border', 
      previewClass: 'bg-transparent border border-black/20 text-charcoal' 
    },
    { 
      id: 'bauhaus-colorblock', 
      name: 'Bauhaus Geometric Colorblock', 
      desc: 'Primary red offset with crisp structural borders & bold grotesk', 
      previewClass: 'bg-[#FFF9F0] border-2 border-[#111111] text-[#111111] font-black shadow-[3px_3px_0px_#EF4444]' 
    },
    { 
      id: 'swiss-minimal-mono', 
      name: 'Swiss International Mono', 
      desc: 'Precision 1px hairline border, jet typography, zero clutter', 
      previewClass: 'bg-white border border-black text-black font-sans font-bold' 
    },
    { 
      id: 'editorial-magazine', 
      name: 'Haute Editorial Magazine', 
      desc: 'Warm ivory canvas with refined warm slate border & serif italic', 
      previewClass: 'bg-[#FAF7F2] border border-[#78716C]/30 text-[#1C1917] font-serif italic' 
    },
    { 
      id: 'matte-carbon', 
      name: 'Matte Technical Carbon', 
      desc: 'Stealth obsidian weave with cyber cyan border highlight', 
      previewClass: 'bg-[#13151A] border border-cyan-500/30 text-white font-mono shadow-xs' 
    },
    { 
      id: 'vintage-parchment', 
      name: 'Antique Parchment Paper', 
      desc: 'Warm sepia card with deckled aged border & classic serif', 
      previewClass: 'bg-[#FBF4DE] border-2 border-[#8C6D46] text-[#3E2723] font-serif' 
    },
    { 
      id: 'tokyo-neon-noir', 
      name: 'Tokyo Neon Noir', 
      desc: 'Pitch-black obsidian with electric violet neon aura glow', 
      previewClass: 'bg-[#0D0E15] border-2 border-[#A855F7] text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.35)]' 
    },
    { 
      id: 'retro-cassette', 
      name: 'Retro Cassette Tape', 
      desc: 'Vintage mixtape aesthetic with industrial orange offset stamp', 
      previewClass: 'bg-[#242426] border-2 border-[#F97316] text-[#F97316] font-mono shadow-[3px_3px_0px_#EA580C]' 
    },
    { 
      id: 'prismatic-glass', 
      name: 'Frosted Prismatic Glass', 
      desc: 'Frosted glass blur with soft iridescent specular highlight edge', 
      previewClass: 'bg-white/75 backdrop-blur-md border-2 border-indigo-200/80 text-charcoal shadow-xs' 
    },
    { 
      id: 'claymorphism-soft', 
      name: 'Soft Claymorphic 3D', 
      desc: 'Tactile pillowy 3D card with dual inner reflection and soft depth', 
      previewClass: 'bg-[#EEF2F6] border border-white/60 text-[#1E293B] font-bold shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_4px_12px_rgba(0,0,0,0.06)]' 
    },
    { 
      id: 'minimal-pill', 
      name: 'Floating Capsule Pill', 
      desc: 'Rounded-full modern capsule with subtle elevation and clean line', 
      previewClass: 'bg-white border border-black/15 text-charcoal font-semibold rounded-full shadow-2xs' 
    },
  ];

  const patternPresets: { id: BackgroundPatternType; name: string; desc: string; previewClass: string }[] = [
    { id: 'none', name: 'Clean Solid', desc: 'No background pattern', previewClass: 'bg-[#F7F5EE]' },
    { id: 'comic-sunburst', name: 'Comic Halftone Sunburst', desc: 'Explosive radial comic rays (from reference)', previewClass: 'pattern-comic-sunburst' },
    { id: 'pop-halftone', name: 'Retro Pop Halftone Dots', desc: 'Classic comic-book printing dot grid', previewClass: 'pattern-pop-halftone' },
    { id: 'retro-grid', name: '80s Synthwave Grid', desc: 'Arcade purple cyber perspective grid', previewClass: 'pattern-retro-grid' },
    { id: 'cyber-matrix', name: 'Cyber Matrix Grid', desc: 'Matrix green terminal digital points', previewClass: 'pattern-cyber-matrix' },
    { id: 'doodle-waves', name: 'Japanese Doodle Waves', desc: 'Ukiyo-e wave & geometric doodle curves', previewClass: 'pattern-doodle-waves' },
    { id: 'japanese-seigaiha', name: 'Seigaiha Wave Arches', desc: 'Traditional Japanese geometric arches', previewClass: 'pattern-japanese-seigaiha' },
    { id: 'y2k-grid', name: 'Y2K Chrome Grid', desc: 'Millennium minimal silver grid', previewClass: 'pattern-y2k-grid' },
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

        {/* Active Theme & Save Changes Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-black/10">
            <span className="text-[10px] font-bold text-charcoal/60">Selected Theme:</span>
            <span className="text-xs font-black text-charcoal">
              {currentTheme.name}
            </span>
          </div>

          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleSaveThemeChanges}
              className="px-4 py-1.5 rounded-full bg-[#4F83FF] hover:bg-[#3B6DE6] text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 cursor-pointer ring-2 ring-[#4F83FF]/30"
            >
              <Check className="w-3.5 h-3.5 text-[#FDF166]" />
              <span>Save Theme</span>
            </button>
          )}
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
          <span>Themes (13 Systems)</span>
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
          <span>Card & Link Styles (13 Designs)</span>
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
            Select a design theme to preview it on the phone in real-time. Click &ldquo;Save Theme&rdquo; when ready to publish:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {themeList.map((t) => {
              const isSelected = draftProfile.theme === t.id;
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
          {/* Font Family Selection with 100+ Fonts */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-black text-charcoal">Typography Personality ({CARD_FONTS.length} Google Styles)</h3>
                <p className="text-xs text-charcoal/60">Search and preview typography styles applied across your entire profile:</p>
              </div>

              {/* Current Active Font Chip */}
              {(() => {
                const currentFont = findCardFont(draftProfile.fontFamily) || CARD_FONTS[0];
                return (
                  <div className="self-start sm:self-auto px-3 py-1.5 rounded-2xl bg-white border border-black/10 shadow-2xs flex items-center gap-2">
                    <span className="text-[10px] font-bold text-charcoal/50 uppercase">Active:</span>
                    <span className="text-xs font-black text-[#4F83FF]" style={{ fontFamily: currentFont.family }}>
                      {currentFont.name}
                    </span>
                  </div>
                );
              })()}
            </div>

            {/* Category Filter Pills & Search */}
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={fontSearch}
                  onChange={(e) => setFontSearch(e.target.value)}
                  placeholder="Search fonts (e.g. Bangers, Playfair, Cinzel, Space Mono, Fredoka)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-[#FAF7F2] border border-black/10 text-xs font-bold text-charcoal focus:bg-white focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {[
                  'All',
                  'Modern Sans',
                  'Luxury Serif',
                  'Comic & Pop',
                  'Retro & 8-Bit',
                  'Cyber & Sci-Fi',
                  'Display & Heavy',
                  'Script & Signature',
                  'Brutalist & Urban'
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFontCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      fontCategory === cat
                        ? 'bg-[#141518] text-white shadow-xs'
                        : 'bg-[#FAF7F2] hover:bg-black/5 text-charcoal/70 border border-black/5'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Fonts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[460px] overflow-y-auto pr-1 no-scrollbar">
              {CARD_FONTS.filter((f) => {
                const matchesCat = fontCategory === 'All' || f.category === fontCategory;
                const matchesSearch = !fontSearch.trim() || 
                  f.name.toLowerCase().includes(fontSearch.toLowerCase()) || 
                  f.category.toLowerCase().includes(fontSearch.toLowerCase());
                return matchesCat && matchesSearch;
              }).map((f) => {
                const isSelected = draftProfile.fontFamily === f.id || 
                  (draftProfile.fontFamily === 'sans' && f.id === 'plus-jakarta') ||
                  (draftProfile.fontFamily === 'comic' && f.id === 'bangers') ||
                  (draftProfile.fontFamily === 'cartoon' && f.id === 'fredoka') ||
                  (draftProfile.fontFamily === 'serif' && f.id === 'playfair') ||
                  (draftProfile.fontFamily === 'mono' && (f.id === 'space-mono' || f.id === 'press-start-2p'));
                return (
                  <div
                    key={f.id}
                    onClick={() => handleUpdateFontFamily(f.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-black bg-black/[0.04] ring-2 ring-black shadow-xs'
                        : 'border-black/10 bg-[#FAF7F2] hover:bg-white hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-charcoal">{f.name}</span>
                      {isSelected ? (
                        <span className="w-4 h-4 rounded-full bg-[#141518] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-charcoal/40 uppercase">{f.category}</span>
                      )}
                    </div>

                    <div 
                      className="my-1.5 p-2.5 rounded-xl bg-white border border-black/5 text-charcoal text-sm leading-tight truncate"
                      style={{ fontFamily: f.family }}
                    >
                      Aa Bb 123 • @{draftProfile.username}
                    </div>

                    <span className="text-[10px] font-mono text-charcoal/50 truncate">
                      {f.family}
                    </span>
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
                const isSelected = (draftProfile.fontSize || 'md') === s.id;
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
                const isSelected = (draftProfile.fontColor || '#141518') === c.hex;
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
              const isSelected = (draftProfile.linkCardStyle || 'solid') === cs.id;
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
                      <Link2 className="w-4 h-4 shrink-0 text-current" />
                      <span className="truncate">Sample Link Block</span>
                    </div>
                    <span className="text-[10px] font-mono">↗</span>
                  </div>

                  <p className="text-xs text-charcoal/60 font-medium">{cs.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Profile Card Container Behind Content */}
          <div className="p-5 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-3.5 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-charcoal flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#4F83FF]" />
                  <span>Card Container Behind Profile Content & Data</span>
                </p>
                <p className="text-[11px] text-charcoal/60 mt-0.5">
                  Wraps your entire profile (avatar, name, bio, buttons, and links) in a stylish floating card
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateDraft({ cardBehindContent: !(draftProfile.cardBehindContent ?? true) })}
                className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  (draftProfile.cardBehindContent ?? true)
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs'
                    : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                }`}
              >
                {(draftProfile.cardBehindContent ?? true) ? 'Active' : 'Off'}
              </button>
            </div>

            {(draftProfile.cardBehindContent ?? true) && (
              <div className="pt-2 border-t border-black/5 flex flex-col gap-2">
                <span className="text-[10px] font-bold text-charcoal/70 uppercase tracking-wider">
                  Select Card Container Material:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'glass', name: 'Frosted Glass', preview: 'bg-white/80 backdrop-blur-md border border-white/40' },
                    { id: 'solid_white', name: 'Solid White', preview: 'bg-white text-black border border-black/10' },
                    { id: 'solid_dark', name: 'Stealth Black', preview: 'bg-[#141518] text-white border border-white/10' },
                    { id: 'translucent', name: 'Dark Tint', preview: 'bg-black/60 text-white backdrop-blur-md border border-white/20' },
                  ].map((style) => (
                    <button
                      key={style.id}
                      type="button"
                      onClick={() => updateDraft({ cardContainerStyle: style.id as any })}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        (draftProfile.cardContainerStyle || 'glass') === style.id
                          ? 'bg-[#141518] text-white border-black ring-2 ring-[#4F83FF] shadow-2xs'
                          : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-full h-7 rounded-lg ${style.preview} flex items-center justify-center text-[9px] font-bold shadow-2xs`}>
                        Card
                      </div>
                      <span className="text-[10px] font-bold truncate">{style.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                draftProfile.showHeaderBackground
                  ? 'bg-[#141518] text-white shadow-xs'
                  : 'bg-white border border-black/10 text-charcoal'
              }`}
            >
              {draftProfile.showHeaderBackground ? 'Active / Shown' : 'Disabled / Hidden'}
            </button>
          </div>

          {/* Custom Uploaded Background Image / Wallpaper */}
          <div className="p-5 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-charcoal">Custom Background Wallpaper Image</p>
                <p className="text-[11px] text-charcoal/60 font-medium">
                  Upload any photo, portrait, wallpaper, anime art, or brand background
                </p>
              </div>

              {draftProfile.customHeaderImage && (
                <button
                  onClick={() => {
                    updateDraft({ customHeaderImage: undefined });
                    showToast('Wallpaper Removed', 'Default theme background restored', 'info');
                  }}
                  className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-200 cursor-pointer flex items-center gap-1 hover:bg-rose-100"
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
                <span>{draftProfile.customHeaderImage ? 'Replace Wallpaper Image' : 'Upload Wallpaper Image from Device (PNG/JPG)'}</span>
              </button>
            </div>

            {/* When Background Image is Uploaded: Show Rich Zoom, Fit, Pan, Dim & Card Controls */}
            {draftProfile.customHeaderImage && (
              <div className="flex flex-col gap-4 pt-2 border-t border-black/10">
                {/* Live Preview Box */}
                <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-black/10 bg-black/5 shadow-xs">
                  <div
                    className="absolute inset-0 bg-no-repeat bg-center transition-all duration-75"
                    style={{
                      backgroundImage: `url(${draftProfile.customHeaderImage})`,
                      backgroundSize: draftProfile.bgImageFit === 'contain' ? 'contain' : draftProfile.bgImageFit === 'auto' ? 'auto' : 'cover',
                      transform: `scale(${(draftProfile.bgImageZoom ?? 100) / 100}) translate(${draftProfile.bgImagePosX ?? 0}px, ${draftProfile.bgImagePosY ?? 0}px)`,
                      transformOrigin: 'center center',
                      filter: (draftProfile.bgImageBlur ?? 0) > 0 ? `blur(${draftProfile.bgImageBlur}px)` : undefined,
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none transition-colors flex items-center justify-center"
                    style={{
                      backgroundColor: `rgba(0, 0, 0, ${(draftProfile.bgImageDim ?? 40) / 100})`,
                    }}
                  >
                    <span className="px-3 py-1 rounded-full bg-black/60 text-white text-[10px] font-mono font-bold backdrop-blur-xs">
                      Live Wallpaper Preview &bull; {draftProfile.bgImageZoom ?? 100}% Zoom
                    </span>
                  </div>
                </div>

                {/* Fit Mode Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-charcoal/70 uppercase tracking-wider">
                    Wallpaper Fit Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'cover', label: 'Cover (Full-Bleed)', desc: 'Fills entire viewport' },
                      { id: 'contain', label: 'Contain (Fit Image)', desc: 'Entire picture visible' },
                      { id: 'auto', label: 'Auto (Original)', desc: 'Natural dimensions' },
                    ].map((fit) => (
                      <button
                        key={fit.id}
                        type="button"
                        onClick={() => updateDraft({ bgImageFit: fit.id as any })}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          (draftProfile.bgImageFit || 'cover') === fit.id
                            ? 'bg-[#141518] text-white border-black shadow-2xs'
                            : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                        }`}
                      >
                        <p className="font-bold text-xs">{fit.label}</p>
                        <p className={`text-[9px] mt-0.5 ${
                          (draftProfile.bgImageFit || 'cover') === fit.id ? 'text-gray-300' : 'text-charcoal/50'
                        }`}>
                          {fit.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="p-3 bg-white rounded-2xl border border-black/5 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-charcoal flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-[#4F83FF]" />
                      <span>Image Zoom</span>
                    </span>
                    <span className="text-xs font-mono font-black text-[#4F83FF] bg-[#EFF4FF] px-2 py-0.5 rounded-md">
                      {draftProfile.bgImageZoom ?? 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="250"
                    value={draftProfile.bgImageZoom ?? 100}
                    onChange={(e) => updateDraft({ bgImageZoom: Number(e.target.value) })}
                    className="w-full accent-[#4F83FF] cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[75, 100, 125, 150, 200].map((z) => (
                      <button
                        key={z}
                        type="button"
                        onClick={() => updateDraft({ bgImageZoom: z })}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                          (draftProfile.bgImageZoom ?? 100) === z
                            ? 'bg-[#141518] text-white border-black'
                            : 'bg-[#FAF7F2] text-charcoal/70 border-black/10 hover:bg-gray-100'
                        }`}
                      >
                        {z}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pan Position Controls (X and Y) */}
                <div className="p-3 bg-white rounded-2xl border border-black/5 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-charcoal flex items-center gap-1.5">
                      <Move className="w-3.5 h-3.5 text-[#4F83FF]" />
                      <span>Pan & Positioning</span>
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateDraft({ bgImagePosX: 0, bgImagePosY: 0 })}
                        className="text-[10px] font-bold text-charcoal/60 hover:text-black underline cursor-pointer"
                      >
                        Reset Center
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-charcoal/60 mb-1">
                        <span>Pan Horizontal (X)</span>
                        <span className="font-mono">{draftProfile.bgImagePosX ?? 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={draftProfile.bgImagePosX ?? 0}
                        onChange={(e) => updateDraft({ bgImagePosX: Number(e.target.value) })}
                        className="w-full accent-black cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-bold text-charcoal/60 mb-1">
                        <span>Pan Vertical (Y)</span>
                        <span className="font-mono">{draftProfile.bgImagePosY ?? 0}px</span>
                      </div>
                      <input
                        type="range"
                        min="-100"
                        max="100"
                        value={draftProfile.bgImagePosY ?? 0}
                        onChange={(e) => updateDraft({ bgImagePosY: Number(e.target.value) })}
                        className="w-full accent-black cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Dim Tint & Bokeh Blur Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-2xl border border-black/5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-charcoal">Dark Tint Overlay</span>
                      <span className="text-xs font-mono font-bold text-charcoal/70">
                        {draftProfile.bgImageDim ?? 40}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="85"
                      value={draftProfile.bgImageDim ?? 40}
                      onChange={(e) => updateDraft({ bgImageDim: Number(e.target.value) })}
                      className="w-full accent-black cursor-pointer"
                    />
                    <span className="text-[9px] text-charcoal/50">Dims bright photos for readable contrast</span>
                  </div>

                  <div className="p-3 bg-white rounded-2xl border border-black/5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-charcoal">Bokeh Blur</span>
                      <span className="text-xs font-mono font-bold text-charcoal/70">
                        {draftProfile.bgImageBlur ?? 0}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="16"
                      value={draftProfile.bgImageBlur ?? 0}
                      onChange={(e) => updateDraft({ bgImageBlur: Number(e.target.value) })}
                      className="w-full accent-black cursor-pointer"
                    />
                    <span className="text-[9px] text-charcoal/50">Soft background defocus effect</span>
                  </div>
                </div>

                {/* CARD CONTAINER BEHIND CONTENT (FEATURE REQUEST #1) */}
                <div className="p-4 rounded-2xl bg-[#EFF4FF] border border-[#4F83FF]/30 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-charcoal flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#4F83FF]" />
                        <span>Place Card Behind Profile Content & Data</span>
                      </p>
                      <p className="text-[11px] text-charcoal/70 mt-0.5">
                        Encloses your name, avatar, bio, buttons, and links inside a floating card container so text never clashes with the background
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateDraft({ cardBehindContent: !(draftProfile.cardBehindContent ?? true) })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                        (draftProfile.cardBehindContent ?? true)
                          ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs'
                          : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                      }`}
                    >
                      {(draftProfile.cardBehindContent ?? true) ? 'Active' : 'Off'}
                    </button>
                  </div>

                  {/* Card Container Style Selector */}
                  {(draftProfile.cardBehindContent ?? true) && (
                    <div className="pt-2 border-t border-[#4F83FF]/20 flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-charcoal/70 uppercase tracking-wider">
                        Choose Card Container Style:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'glass', name: 'Frosted Glass', preview: 'bg-white/80 backdrop-blur-md border border-white/40' },
                          { id: 'solid_white', name: 'Solid White', preview: 'bg-white text-black border border-black/10' },
                          { id: 'solid_dark', name: 'Stealth Black', preview: 'bg-[#141518] text-white border border-white/10' },
                          { id: 'translucent', name: 'Dark Tint', preview: 'bg-black/60 text-white backdrop-blur-md border border-white/20' },
                        ].map((style) => (
                          <button
                            key={style.id}
                            type="button"
                            onClick={() => updateDraft({ cardContainerStyle: style.id as any })}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                              (draftProfile.cardContainerStyle || 'glass') === style.id
                                ? 'bg-[#141518] text-white border-black ring-2 ring-[#4F83FF] shadow-2xs'
                                : 'bg-white text-charcoal border-black/10 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-full h-7 rounded-lg ${style.preview} flex items-center justify-center text-[9px] font-bold shadow-2xs`}>
                              Card
                            </div>
                            <span className="text-[10px] font-bold truncate">{style.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                const isSelected = (draftProfile.headerBackground || 'none') === p.id;
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

      {/* SAVE THEME & STYLES ACTION BAR */}
      <div className="p-4 rounded-3xl bg-[#FAF7F2] border border-black/10 flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-black text-xs text-charcoal">
              {hasUnsavedChanges ? 'Unsaved Theme & Styling Changes' : 'Theme Blueprint Saved & Active'}
            </p>
            {hasUnsavedChanges ? (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                Draft Preview
              </span>
            ) : (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <Check className="w-2.5 h-2.5" />
                Published
              </span>
            )}
          </div>
          <p className="text-[11px] text-charcoal/60 mt-0.5">
            {hasUnsavedChanges 
              ? `Previewing "${THEMES[draftProfile.theme]?.name || 'Theme'}" on the live phone. Click Save to publish.` 
              : `Active on your live public link-in-bio: ${THEMES[profile.theme]?.name || 'Theme'}`}
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleDiscardChanges}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-white hover:bg-gray-100 border border-black/10 text-xs font-bold text-charcoal cursor-pointer"
            >
              Discard
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveThemeChanges}
            disabled={!hasUnsavedChanges}
            className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-xs font-black flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
              hasUnsavedChanges
                ? 'bg-[#4F83FF] hover:bg-[#3B6DE6] text-white shadow-sm ring-2 ring-[#4F83FF]/30'
                : 'bg-black/10 text-charcoal/40 cursor-not-allowed'
            }`}
          >
            <Check className="w-4 h-4 text-[#FDF166]" />
            <span>{hasUnsavedChanges ? 'Save Theme & Publish' : 'Saved'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
