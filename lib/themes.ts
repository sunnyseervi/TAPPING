import { ThemeType } from './types';

export interface ThemeConfig {
  id: ThemeType;
  name: string;
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
  previewColors: string[];
  linkVariantClass: (variant: string) => string;
}

export const THEMES: Record<ThemeType, ThemeConfig> = {
  'pastel-bento': {
    id: 'pastel-bento',
    name: 'Pastel Bento Canvas',
    description: 'Warm cream canvas with soft peach, lavender, mint and butter cards',
    canvasBg: 'bg-[#FAF7F2]',
    containerBg: 'bg-white',
    textHeading: 'text-[#1F2024]',
    textBody: 'text-[#4A4B50]',
    accentBtn: 'bg-[#1F2024] hover:bg-black',
    accentBtnText: 'text-white',
    badgeBg: 'bg-[#D8ECD7]',
    badgeBorder: 'border-[#BDDFBC]',
    badgeText: 'text-[#204024]',
    previewColors: ['#FAF7F2', '#FED5C3', '#E4E0FA', '#D8ECD7', '#1F2024'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
          return 'bg-[#FED5C3] hover:bg-[#FDBFA7] border-[#F8BFA5] text-[#1F2024]';
        case 'lavender':
          return 'bg-[#E4E0FA] hover:bg-[#D5CEFA] border-[#D0C7F5] text-[#1F2024]';
        case 'yellow':
          return 'bg-[#FEF0B3] hover:bg-[#FDE25D] border-[#F4E187] text-[#1F2024]';
        case 'mint':
          return 'bg-[#D8ECD7] hover:bg-[#C2E4BF] border-[#BDDFBC] text-[#1F2024]';
        case 'sky':
          return 'bg-[#D6E6FE] hover:bg-[#C2DCFE] border-[#BED6FC] text-[#1F2024]';
        default:
          return 'bg-white hover:bg-gray-50 border-black/10 text-[#1F2024]';
      }
    },
  },

  'warm-editorial': {
    id: 'warm-editorial',
    name: 'Warm Editorial Paper',
    description: 'Terracotta accents with off-white warm paper styling and forest accents',
    canvasBg: 'bg-[#F4EFEA]',
    containerBg: 'bg-[#FCFBF8]',
    textHeading: 'text-[#1C1A17]',
    textBody: 'text-[#48443F]',
    accentBtn: 'bg-[#C0512F] hover:bg-[#A84223]',
    accentBtnText: 'text-white',
    badgeBg: 'bg-[#F2D7CE]',
    badgeBorder: 'border-[#E5B5A5]',
    badgeText: 'text-[#873218]',
    previewColors: ['#F4EFEA', '#C0512F', '#3D5A4C', '#E8DDD3', '#1C1A17'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
          return 'bg-[#F5DDD3] hover:bg-[#ECC5B7] border-[#DEB0A0] text-[#1C1A17]';
        case 'lavender':
          return 'bg-[#EBE5DE] hover:bg-[#DED7CE] border-[#CFC6B9] text-[#1C1A17]';
        case 'yellow':
          return 'bg-[#F5ECD5] hover:bg-[#EBDDB7] border-[#DEC997] text-[#1C1A17]';
        case 'mint':
          return 'bg-[#DEE9E3] hover:bg-[#C9DDD2] border-[#ADCAB9] text-[#1C1A17]';
        case 'sky':
          return 'bg-[#DCE6E8] hover:bg-[#CAD9DC] border-[#B2C6CA] text-[#1C1A17]';
        default:
          return 'bg-white hover:bg-gray-50 border-[#CFC6B9] text-[#1C1A17]';
      }
    },
  },

  'sage-cream': {
    id: 'sage-cream',
    name: 'Sage and Botanical',
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
    previewColors: ['#F3F6F2', '#D8ECD7', '#A3CFAB', '#3B6846', '#1E2B20'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
          return 'bg-[#EAEFD5] hover:bg-[#DBE3BD] border-[#C7D3A1] text-[#1E2B20]';
        case 'lavender':
          return 'bg-[#E3EAE6] hover:bg-[#D2DDD6] border-[#BCD0C3] text-[#1E2B20]';
        case 'yellow':
          return 'bg-[#F0F2D6] hover:bg-[#E1E5BC] border-[#CED4A1] text-[#1E2B20]';
        case 'mint':
          return 'bg-[#D8ECD7] hover:bg-[#C2E4BF] border-[#A8DBA6] text-[#1E2B20]';
        case 'sky':
          return 'bg-[#D4E8E4] hover:bg-[#C0DDD8] border-[#A2CDC5] text-[#1E2B20]';
        default:
          return 'bg-white hover:bg-gray-50 border-black/10 text-[#1E2B20]';
      }
    },
  },

  'minimal-mono': {
    id: 'minimal-mono',
    name: 'Minimal Monochrome',
    description: 'Crisp high-contrast monochrome with subtle borders and flat surfaces',
    canvasBg: 'bg-[#F8F9FA]',
    containerBg: 'bg-white',
    textHeading: 'text-[#111111]',
    textBody: 'text-[#555555]',
    accentBtn: 'bg-black hover:bg-zinc-800',
    accentBtnText: 'text-white',
    badgeBg: 'bg-[#E9ECEF]',
    badgeBorder: 'border-[#CED4DA]',
    badgeText: 'text-[#212529]',
    previewColors: ['#FFFFFF', '#F8F9FA', '#DEE2E6', '#495057', '#111111'],
    linkVariantClass: () => {
      return 'bg-white hover:bg-zinc-50 border-black/15 text-[#111111] shadow-2xs';
    },
  },

  'tokyo-night': {
    id: 'tokyo-night',
    name: 'Soft Rose and Mauve',
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
    previewColors: ['#FDF6F7', '#FCE6E9', '#F7CCD3', '#E8E2F7', '#281A1E'],
    linkVariantClass: (variant: string) => {
      switch (variant) {
        case 'peach':
          return 'bg-[#FCE6E9] hover:bg-[#F9D0D6] border-[#F4BFCA] text-[#281A1E]';
        case 'lavender':
          return 'bg-[#F1ECFB] hover:bg-[#E3DAF8] border-[#D4C5F3] text-[#281A1E]';
        case 'yellow':
          return 'bg-[#FEF5DF] hover:bg-[#FDEAC0] border-[#F6DC9B] text-[#281A1E]';
        case 'mint':
          return 'bg-[#EBF7F0] hover:bg-[#D5EFE0] border-[#B7E3C8] text-[#281A1E]';
        case 'sky':
          return 'bg-[#E8F1FC] hover:bg-[#D1E3F9] border-[#B5D3F6] text-[#281A1E]';
        default:
          return 'bg-white hover:bg-gray-50 border-black/10 text-[#281A1E]';
      }
    },
  },
};
