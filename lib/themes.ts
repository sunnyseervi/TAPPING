import { ThemeType, FontFamilyType, BackgroundPatternType, LinkCardStyleType } from './types';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  category: 'Pop & Comic' | 'Retro & Arcade' | 'Modern & Bento' | 'Editorial & Minimal';
  description: string;
  canvasBg: string;
  containerBg: string;
  textHeading: string;
  textBody: string;
  accentBtn: string;
  accentBtnText: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  defaultFont: FontFamilyType;
  defaultPattern: BackgroundPatternType;
  defaultCardStyle: LinkCardStyleType;
  previewColors: string[];
  linkVariantClass: (variant: string, style?: LinkCardStyleType) => string;
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  'pastel-bento': {
    id: 'pastel-bento',
    name: 'Pastel Bento Canvas',
    category: 'Modern & Bento',
    description: 'Warm cream canvas with soft peach, butter yellow, spring lime and cobalt cards',
    canvasBg: 'bg-[#FAF7F2]',
    containerBg: 'bg-white',
    textHeading: 'text-[#141518]',
    textBody: 'text-[#4A4B50]',
    accentBtn: 'bg-[#141518] hover:bg-black',
    accentBtnText: 'text-white',
    badgeBg: 'bg-[#FDF166]',
    badgeBorder: 'border-black/10',
    badgeText: 'text-charcoal',
    defaultFont: 'sans',
    defaultPattern: 'none',
    defaultCardStyle: 'solid',
    previewColors: ['#FAF7F2', '#4F83FF', '#FDF166', '#B6F554', '#141518'],
    linkVariantClass: (variant: string, style?: LinkCardStyleType) => {
      if (style === 'comic-brutalist') {
        return 'bg-white hover:bg-yellow-50 border-2 border-black shadow-[3px_3px_0px_#000] text-charcoal';
      }
      switch (variant) {
        case 'peach':
          return 'bg-[#EFF4FF] hover:bg-[#E2ECFF] border border-[#4F83FF]/20 text-[#141518] shadow-2xs';
        case 'lavender':
        case 'yellow':
          return 'bg-[#FDF166] hover:bg-[#FBE849] border border-black/10 text-charcoal shadow-2xs';
        case 'mint':
          return 'bg-[#B6F554] hover:bg-[#A3ED33] border border-black/10 text-charcoal shadow-2xs';
        case 'sky':
          return 'bg-[#4F83FF] hover:bg-[#3B6DE6] border border-black/10 text-white shadow-2xs';
        default:
          return 'bg-white hover:bg-gray-50 border border-black/10 text-charcoal shadow-2xs';
      }
    },
  },

  'comic-pop': {
    id: 'comic-pop',
    name: 'Comic Pop Halftone',
    category: 'Pop & Comic',
    description: 'Explosive Marvel / Comic-Con pop art with bold halftone sunbursts and thick 2.5px borders',
    canvasBg: 'bg-[#FFFBEB]',
    containerBg: 'bg-white',
    textHeading: 'text-black font-black',
    textBody: 'text-zinc-800 font-bold',
    accentBtn: 'bg-[#EF4444] hover:bg-[#DC2626] border-2 border-black shadow-[3px_3px_0px_#000]',
    accentBtnText: 'text-white font-black',
    badgeBg: 'bg-[#FBBF24]',
    badgeBorder: 'border-2 border-black',
    badgeText: 'text-black font-black',
    defaultFont: 'comic',
    defaultPattern: 'comic-sunburst',
    defaultCardStyle: 'comic-brutalist',
    previewColors: ['#EF4444', '#FBBF24', '#38BDF8', '#000000', '#FFFFFF'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
        case 'yellow':
          return 'bg-[#FDE047] hover:bg-[#FACC15] border-2 border-black shadow-[4px_4px_0px_#000] text-black font-black';
        case 'lavender':
        case 'sky':
          return 'bg-[#38BDF8] hover:bg-[#0EA5E9] border-2 border-black shadow-[4px_4px_0px_#000] text-black font-black';
        case 'mint':
          return 'bg-[#4ADE80] hover:bg-[#22C55E] border-2 border-black shadow-[4px_4px_0px_#000] text-black font-black';
        default:
          return 'bg-white hover:bg-amber-50 border-2 border-black shadow-[4px_4px_0px_#000] text-black font-black';
      }
    },
  },

  'retro-arcade': {
    id: 'retro-arcade',
    name: 'Retro 8-Bit Arcade',
    category: 'Retro & Arcade',
    description: 'Classic arcade pixel vibe with synthwave grid lines, neon cyan, purple & 8-bit styling',
    canvasBg: 'bg-[#0B0F19]',
    containerBg: 'bg-[#111827]',
    textHeading: 'text-[#38BDF8]',
    textBody: 'text-slate-300',
    accentBtn: 'bg-[#8B5CF6] hover:bg-[#7C3AED] border-2 border-[#C084FC]',
    accentBtnText: 'text-white font-mono',
    badgeBg: 'bg-[#064E3B]',
    badgeBorder: 'border-[#10B981]',
    badgeText: 'text-[#34D399]',
    defaultFont: 'mono',
    defaultPattern: 'retro-grid',
    defaultCardStyle: 'retro-pixel',
    previewColors: ['#0B0F19', '#38BDF8', '#8B5CF6', '#10B981', '#F43F5E'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
        case 'yellow':
          return 'bg-[#1E1B4B] hover:bg-[#2E1065] border-2 border-[#818CF8] text-[#A5B4FC] shadow-[3px_3px_0px_#4F46E5] font-mono';
        case 'mint':
          return 'bg-[#064E3B] hover:bg-[#022C22] border-2 border-[#10B981] text-[#6EE7B7] shadow-[3px_3px_0px_#059669] font-mono';
        case 'sky':
          return 'bg-[#082F49] hover:bg-[#0C4A6E] border-2 border-[#38BDF8] text-[#7DD3FC] shadow-[3px_3px_0px_#0284C7] font-mono';
        default:
          return 'bg-[#182234] hover:bg-[#1E293B] border-2 border-slate-700 text-white font-mono shadow-[3px_3px_0px_#0F172A]';
      }
    },
  },

  'cartoon-doodle': {
    id: 'cartoon-doodle',
    name: 'Cartoon Doodle Burst',
    category: 'Pop & Comic',
    description: 'Playful anime street stickers, vibrant coral, candy pink and bubble typography',
    canvasBg: 'bg-[#FEFCE8]',
    containerBg: 'bg-white',
    textHeading: 'text-[#1E1B4B]',
    textBody: 'text-[#4338CA]',
    accentBtn: 'bg-[#F43F5E] hover:bg-[#E11D48] text-white rounded-3xl',
    accentBtnText: 'text-white font-bold',
    badgeBg: 'bg-[#FCE7F3]',
    badgeBorder: 'border-[#F472B6]',
    badgeText: 'text-[#DB2777]',
    defaultFont: 'cartoon',
    defaultPattern: 'cloud-burst',
    defaultCardStyle: 'comic-brutalist',
    previewColors: ['#FEFCE8', '#F43F5E', '#FBBF24', '#38BDF8', '#A855F7'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
          return 'bg-[#FFE4E6] hover:bg-[#FECDD3] border-2 border-[#F43F5E] text-[#9F1239] rounded-2xl shadow-xs';
        case 'lavender':
          return 'bg-[#F3E8FF] hover:bg-[#E9D5FF] border-2 border-[#A855F7] text-[#6B21A8] rounded-2xl shadow-xs';
        case 'yellow':
          return 'bg-[#FEF08A] hover:bg-[#FDE047] border-2 border-[#EAB308] text-[#854D0E] rounded-2xl shadow-xs';
        case 'mint':
          return 'bg-[#DCFCE7] hover:bg-[#BBF7D0] border-2 border-[#22C55E] text-[#166534] rounded-2xl shadow-xs';
        default:
          return 'bg-white hover:bg-amber-50 border-2 border-[#1E1B4B] text-[#1E1B4B] rounded-2xl shadow-xs';
      }
    },
  },

  'vaporwave-chill': {
    id: 'vaporwave-chill',
    name: 'Vaporwave & Statue Chill',
    category: 'Retro & Arcade',
    description: 'Aesthetic Greek sculpture statue, lo-fi purple haze, retro typography and sunset chill',
    canvasBg: 'bg-[#FAF5FF]',
    containerBg: 'bg-white',
    textHeading: 'text-[#3B0764]',
    textBody: 'text-[#581C87]',
    accentBtn: 'bg-[#7E22CE] hover:bg-[#6B21A8]',
    accentBtnText: 'text-white',
    badgeBg: 'bg-[#F3E8FF]',
    badgeBorder: 'border-[#D8B4FE]',
    badgeText: 'text-[#7E22CE]',
    defaultFont: 'serif',
    defaultPattern: 'doodle-waves',
    defaultCardStyle: 'glass-glow',
    previewColors: ['#FAF5FF', '#7E22CE', '#38BDF8', '#F43F5E', '#3B0764'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
          return 'bg-[#FDF2F8] hover:bg-[#FCE7F3] border border-[#F472B6] text-[#831843] shadow-xs';
        case 'lavender':
          return 'bg-[#F3E8FF] hover:bg-[#E9D5FF] border border-[#C084FC] text-[#581C87] shadow-xs';
        case 'sky':
          return 'bg-[#F0F9FF] hover:bg-[#E0F2FE] border border-[#38BDF8] text-[#075985] shadow-xs';
        default:
          return 'bg-white hover:bg-purple-50/50 border border-[#D8B4FE]/50 text-[#3B0764] shadow-xs';
      }
    },
  },

  'warm-editorial': {
    id: 'warm-editorial',
    name: 'Warm Editorial Paper',
    category: 'Editorial & Minimal',
    description: 'Terracotta accents with off-white warm paper styling and classic editorial serif',
    canvasBg: 'bg-[#F4EFEA]',
    containerBg: 'bg-[#FCFBF8]',
    textHeading: 'text-[#1C1A17]',
    textBody: 'text-[#48443F]',
    accentBtn: 'bg-[#C0512F] hover:bg-[#A84223]',
    accentBtnText: 'text-white',
    badgeBg: 'bg-[#F2D7CE]',
    badgeBorder: 'border-[#E5B5A5]',
    badgeText: 'text-[#873218]',
    defaultFont: 'serif',
    defaultPattern: 'none',
    defaultCardStyle: 'vintage-ticket',
    previewColors: ['#F4EFEA', '#C0512F', '#3D5A4C', '#E8DDD3', '#1C1A17'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
          return 'bg-[#F5DDD3] hover:bg-[#ECC5B7] border border-[#DEB0A0] text-[#1C1A17]';
        case 'lavender':
          return 'bg-[#EBE5DE] hover:bg-[#DED7CE] border border-[#CFC6B9] text-[#1C1A17]';
        case 'yellow':
          return 'bg-[#F5ECD5] hover:bg-[#EBDDB7] border border-[#DEC997] text-[#1C1A17]';
        case 'mint':
          return 'bg-[#DEE9E3] hover:bg-[#C9DDD2] border border-[#ADCAB9] text-[#1C1A17]';
        default:
          return 'bg-white hover:bg-gray-50 border border-[#CFC6B9] text-[#1C1A17]';
      }
    },
  },

  'minimal-mono': {
    id: 'minimal-mono',
    name: 'Minimal Monochrome',
    category: 'Editorial & Minimal',
    description: 'Crisp high-contrast Swiss typography with subtle borders and flat surfaces',
    canvasBg: 'bg-[#F8F9FA]',
    containerBg: 'bg-white',
    textHeading: 'text-[#111111]',
    textBody: 'text-[#555555]',
    accentBtn: 'bg-black hover:bg-zinc-800',
    accentBtnText: 'text-white',
    badgeBg: 'bg-[#E9ECEF]',
    badgeBorder: 'border-[#CED4DA]',
    badgeText: 'text-[#212529]',
    defaultFont: 'sans',
    defaultPattern: 'none',
    defaultCardStyle: 'minimal-outline',
    previewColors: ['#FFFFFF', '#F8F9FA', '#DEE2E6', '#495057', '#111111'],
    linkVariantClass: () => {
      return 'bg-white hover:bg-zinc-50 border border-black/15 text-[#111111] shadow-2xs';
    },
  },

  'sage-cream': {
    id: 'sage-cream',
    name: 'Sage and Botanical',
    category: 'Modern & Bento',
    description: 'Organic botanical greens with soft ivory and matcha pills',
    canvasBg: 'bg-[#F3F6F2]',
    containerBg: 'bg-[#FBFDFB]',
    textHeading: 'text-[#1E2B20]',
    textBody: 'text-[#3E4F41]',
    accentBtn: 'bg-[#2E4F36] hover:bg-[#223D29]',
    accentBtnText: 'text-white',
    badgeBg: 'bg-[#D8ECD7]',
    badgeBorder: 'border-[#B4DBB2]',
    badgeText: 'text-[#1E3B24]',
    defaultFont: 'sans',
    defaultPattern: 'none',
    defaultCardStyle: 'solid',
    previewColors: ['#F3F6F2', '#D8ECD7', '#A3CFAB', '#3B6846', '#1E2B20'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
          return 'bg-[#EAEFD5] hover:bg-[#DBE3BD] border border-[#C7D3A1] text-[#1E2B20]';
        case 'lavender':
          return 'bg-[#E3EAE6] hover:bg-[#D2DDD6] border border-[#BCD0C3] text-[#1E2B20]';
        case 'mint':
          return 'bg-[#D8ECD7] hover:bg-[#C2E4BF] border border-[#A8DBA6] text-[#1E2B20]';
        default:
          return 'bg-white hover:bg-gray-50 border border-black/10 text-[#1E2B20]';
      }
    },
  },

  'tokyo-night': {
    id: 'tokyo-night',
    name: 'Soft Rose and Mauve',
    category: 'Editorial & Minimal',
    description: 'Delicate dusty rose, blush canvas, and mauve accent highlights',
    canvasBg: 'bg-[#FDF6F7]',
    containerBg: 'bg-white',
    textHeading: 'text-[#281A1E]',
    textBody: 'text-[#574349]',
    accentBtn: 'bg-[#281A1E] hover:bg-black',
    accentBtnText: 'text-white',
    badgeBg: 'bg-[#FCE6E9]',
    badgeBorder: 'border-[#F4BFCA]',
    badgeText: 'text-[#6E2838]',
    defaultFont: 'sans',
    defaultPattern: 'none',
    defaultCardStyle: 'solid',
    previewColors: ['#FDF6F7', '#FCE6E9', '#F7CCD3', '#E8E2F7', '#281A1E'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
          return 'bg-[#FCE6E9] hover:bg-[#F9D0D6] border border-[#F4BFCA] text-[#281A1E]';
        case 'lavender':
          return 'bg-[#F1ECFB] hover:bg-[#E3DAF8] border border-[#D4C5F3] text-[#281A1E]';
        default:
          return 'bg-white hover:bg-gray-50 border border-black/10 text-[#281A1E]';
      }
    },
  },

  'cyberpunk-neon': {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Matrix Neon',
    category: 'Retro & Arcade',
    description: 'Electric hacker matrix with terminal green wireframes and cyber glow',
    canvasBg: 'bg-[#050B14]',
    containerBg: 'bg-[#0B1528]',
    textHeading: 'text-[#00FF66] font-mono',
    textBody: 'text-[#38BDF8]',
    accentBtn: 'bg-[#00FF66] hover:bg-[#00DD55] border-2 border-black text-black shadow-[3px_3px_0px_#00F0FF]',
    accentBtnText: 'text-black font-mono font-black',
    badgeBg: 'bg-[#022C22]',
    badgeBorder: 'border-[#00FF66]',
    badgeText: 'text-[#00FF66]',
    defaultFont: 'mono',
    defaultPattern: 'cyber-matrix',
    defaultCardStyle: 'cyber-terminal',
    previewColors: ['#050B14', '#00FF66', '#00F0FF', '#0B1528', '#FFFFFF'],
    linkVariantClass: (variant: string) => {
      return 'bg-[#081220] hover:bg-[#0C1B30] border-2 border-[#00FF66] text-[#00FF66] font-mono shadow-[0_0_12px_rgba(0,255,102,0.25)] rounded-lg';
    },
  },

  'japanese-ukiyo': {
    id: 'japanese-ukiyo',
    name: 'Japanese Ukiyo-e Wave',
    category: 'Editorial & Minimal',
    description: 'Deep indigo sea, Great Wave crests, and crimson scarlet accents',
    canvasBg: 'bg-[#0B132B]',
    containerBg: 'bg-[#1C2541]',
    textHeading: 'text-[#F1F5F9]',
    textBody: 'text-[#94A3B8]',
    accentBtn: 'bg-[#E63946] hover:bg-[#D62828] text-white',
    accentBtnText: 'text-white font-bold',
    badgeBg: 'bg-[#1D3557]',
    badgeBorder: 'border-[#457B9D]',
    badgeText: 'text-[#A8DADC]',
    defaultFont: 'serif',
    defaultPattern: 'doodle-waves',
    defaultCardStyle: 'japanese-wave',
    previewColors: ['#0B132B', '#E63946', '#457B9D', '#F1F5F9', '#1C2541'],
    linkVariantClass: (variant: string) => {
      return 'bg-[#1C2541] hover:bg-[#253256] border border-[#457B9D]/50 text-white shadow-xs rounded-2xl';
    },
  },

  'y2k-millennium': {
    id: 'y2k-millennium',
    name: 'Y2K Cyber Millennium',
    category: 'Pop & Comic',
    description: 'Liquid metallic silver sheen, millennium purple bubbles and futuristic chrome',
    canvasBg: 'bg-[#EEF2F6]',
    containerBg: 'bg-white',
    textHeading: 'text-[#1E1B4B] font-black',
    textBody: 'text-[#4F46E5]',
    accentBtn: 'bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-2 border-[#C084FC] shadow-sm',
    accentBtnText: 'text-white font-bold',
    badgeBg: 'bg-[#EDE9FE]',
    badgeBorder: 'border-[#C4B5FD]',
    badgeText: 'text-[#6D28D9]',
    defaultFont: 'sans',
    defaultPattern: 'y2k-grid',
    defaultCardStyle: 'y2k-metallic',
    previewColors: ['#EEF2F6', '#8B5CF6', '#EC4899', '#38BDF8', '#1E1B4B'],
    linkVariantClass: (variant: string) => {
      return 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 hover:from-white hover:to-slate-200 border-2 border-slate-400 text-slate-900 font-black shadow-xs rounded-3xl';
    },
  },

  'neobrutalism': {
    id: 'neobrutalism',
    name: 'Neo-Brutalist Block',
    category: 'Pop & Comic',
    description: 'Electric butter yellow, 3px solid black borders, and hard brutalist drop shadows',
    canvasBg: 'bg-[#FEF08A]',
    containerBg: 'bg-white',
    textHeading: 'text-black font-black',
    textBody: 'text-black font-bold',
    accentBtn: 'bg-[#FFE600] hover:bg-[#FFD600] border-3 border-black text-black shadow-[4px_4px_0px_#000]',
    accentBtnText: 'text-black font-black',
    badgeBg: 'bg-[#86EFAC]',
    badgeBorder: 'border-2 border-black',
    badgeText: 'text-black font-black',
    defaultFont: 'comic',
    defaultPattern: 'pop-halftone',
    defaultCardStyle: 'neobrutal-pastel',
    previewColors: ['#FEF08A', '#FFE600', '#86EFAC', '#000000', '#FFFFFF'],
    linkVariantClass: (variant: string) => {
      return 'bg-[#FEF08A] hover:bg-[#FDE047] border-3 border-black text-black font-black shadow-[5px_5px_0px_#000] rounded-xl active:translate-x-1 active:translate-y-1 active:shadow-none';
    },
  },
};

export function getFontFamilyClass(fontFamily?: FontFamilyType): string {
  switch (fontFamily) {
    case 'comic':
      return 'font-comic tracking-wide';
    case 'cartoon':
      return 'font-cartoon';
    case 'mono':
      return 'font-mono-code font-mono';
    case 'serif':
      return 'font-serif';
    default:
      return 'font-sans';
  }
}

export function getPatternClass(pattern?: BackgroundPatternType): string {
  switch (pattern) {
    case 'comic-sunburst':
      return 'pattern-comic-sunburst';
    case 'comic-sunburst-red':
      return 'pattern-comic-sunburst-red';
    case 'pop-halftone':
      return 'pattern-pop-halftone';
    case 'pop-halftone-cyan':
      return 'pattern-pop-halftone-cyan';
    case 'retro-grid':
      return 'pattern-retro-grid';
    case 'doodle-waves':
      return 'pattern-doodle-waves';
    case 'cloud-burst':
      return 'pattern-cloud-burst';
    case 'tribal-glyphs':
      return 'pattern-tribal-glyphs';
    case 'cyber-matrix':
      return 'pattern-cyber-matrix';
    case 'japanese-seigaiha':
      return 'pattern-japanese-seigaiha';
    case 'y2k-grid':
      return 'pattern-y2k-grid';
    default:
      return '';
  }
}

export function resolveLinkCardClasses(
  themeId: ThemeType = 'pastel-bento',
  variant: string = 'default',
  cardStyle?: LinkCardStyleType
): string {
  // 1. Comic Pop Brutalist (Hard offset drop shadows)
  if (cardStyle === 'comic-brutalist') {
    switch (variant) {
      case 'peach':
      case 'yellow':
        return 'bg-[#FEF08A] hover:bg-[#FDE047] border-2 border-black shadow-[4px_4px_0px_#000] text-black font-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] rounded-2xl';
      case 'mint':
        return 'bg-[#86EFAC] hover:bg-[#4ADE80] border-2 border-black shadow-[4px_4px_0px_#000] text-black font-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] rounded-2xl';
      case 'sky':
        return 'bg-[#7DD3FC] hover:bg-[#38BDF8] border-2 border-black shadow-[4px_4px_0px_#000] text-black font-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] rounded-2xl';
      case 'lavender':
        return 'bg-[#F472B6] hover:bg-[#EC4899] border-2 border-black shadow-[4px_4px_0px_#000] text-black font-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] rounded-2xl';
      default:
        return 'bg-white hover:bg-amber-50 border-2 border-black shadow-[4px_4px_0px_#000] text-black font-black active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] rounded-2xl';
    }
  }

  // 2. Comic Halftone Burst
  if (cardStyle === 'comic-halftone') {
    return 'bg-[#FFFBEB] hover:bg-[#FEF3C7] border-2 border-black shadow-[4px_4px_0px_#000] font-black text-black pattern-pop-halftone rounded-2xl';
  }

  // 3. Retro 8-Bit Pixel
  if (cardStyle === 'retro-pixel') {
    switch (variant) {
      case 'peach':
      case 'yellow':
        return 'bg-[#1E1B4B] hover:bg-[#2E1065] border-2 border-[#818CF8] text-[#A5B4FC] shadow-[3px_3px_0px_#4F46E5] font-mono rounded-none';
      case 'mint':
        return 'bg-[#064E3B] hover:bg-[#022C22] border-2 border-[#10B981] text-[#6EE7B7] shadow-[3px_3px_0px_#059669] font-mono rounded-none';
      case 'sky':
        return 'bg-[#082F49] hover:bg-[#0C4A6E] border-2 border-[#38BDF8] text-[#7DD3FC] shadow-[3px_3px_0px_#0284C7] font-mono rounded-none';
      default:
        return 'bg-[#111827] hover:bg-[#1F2937] border-2 border-slate-700 text-white shadow-[3px_3px_0px_#0F172A] font-mono rounded-none';
    }
  }

  // 4. Cyber Terminal HUD
  if (cardStyle === 'cyber-terminal') {
    return 'bg-[#050B14] hover:bg-[#0A1628] border-2 border-[#00FF66] text-[#00FF66] font-mono shadow-[0_0_12px_rgba(0,255,102,0.25)] rounded-lg';
  }

  // 5. Vaporwave Gradient Sunset
  if (cardStyle === 'vaporwave-gradient') {
    return 'bg-gradient-to-r from-[#7E22CE] to-[#EC4899] hover:from-[#6B21A8] hover:to-[#DB2777] text-white font-serif rounded-2xl shadow-sm border border-white/20';
  }

  // 6. Japanese Wave Ukiyo
  if (cardStyle === 'japanese-wave') {
    return 'bg-[#0B132B] hover:bg-[#1C2541] border border-[#38BDF8]/40 text-white shadow-xs rounded-2xl';
  }

  // 7. Neo-Brutalist Pastel Block
  if (cardStyle === 'neobrutal-pastel') {
    return 'bg-[#FEF08A] hover:bg-[#FDE047] border-3 border-black text-black font-black shadow-[5px_5px_0px_#000] rounded-xl active:translate-x-1 active:translate-y-1 active:shadow-none';
  }

  // 8. Frosted Glass Glow
  if (cardStyle === 'glass-glow') {
    return 'bg-white/80 hover:bg-white backdrop-blur-md border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.1)] text-charcoal rounded-2xl transition-all';
  }

  // 9. Vintage Ticket Perforated
  if (cardStyle === 'vintage-ticket') {
    return 'bg-[#FAF6F0] hover:bg-[#F3ECE1] border-2 border-dashed border-stone-400 text-[#292524] shadow-2xs font-serif rounded-xl transition-all';
  }

  // 10. Minimal Clean Outline
  if (cardStyle === 'minimal-outline') {
    return 'bg-transparent hover:bg-black/5 border border-black/20 text-[#111111] shadow-2xs rounded-2xl transition-all';
  }

  // 11. Y2K Metallic Chrome
  if (cardStyle === 'y2k-metallic') {
    return 'bg-gradient-to-b from-slate-100 via-slate-200 to-slate-300 hover:from-white hover:to-slate-200 border-2 border-slate-400 text-slate-900 font-black shadow-xs rounded-3xl';
  }

  // 12. Playful Sticker Doodle
  if (cardStyle === 'sticker-doodle') {
    return 'bg-white hover:bg-yellow-50 border-2 border-black text-black font-cartoon rounded-3xl shadow-[3px_3px_0px_#000] rotate-[-0.5deg] hover:rotate-0 transition-transform';
  }

  // Fallback to active theme's styling
  const theme = THEMES[themeId] || THEMES['pastel-bento'];
  return theme.linkVariantClass(variant, cardStyle);
}

