export type ThemeType = 
  | 'pastel-bento' 
  | 'comic-pop' 
  | 'retro-arcade' 
  | 'cartoon-doodle' 
  | 'vaporwave-chill' 
  | 'cyberpunk-neon'
  | 'japanese-ukiyo'
  | 'y2k-millennium'
  | 'neobrutalism'
  | 'warm-editorial' 
  | 'minimal-mono' 
  | 'sage-cream' 
  | 'tokyo-night';

export type FontFamilyType = 'sans' | 'serif' | 'mono' | 'comic' | 'cartoon';
export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl';
export type BackgroundPatternType = 
  | 'none' 
  | 'comic-sunburst' 
  | 'pop-halftone' 
  | 'retro-grid' 
  | 'doodle-waves' 
  | 'cloud-burst' 
  | 'tribal-glyphs'
  | 'cyber-matrix'
  | 'japanese-seigaiha'
  | 'y2k-grid';

export type LinkCardStyleType = 
  | 'solid' 
  | 'comic-brutalist' 
  | 'comic-halftone'
  | 'retro-pixel' 
  | 'cyber-terminal'
  | 'vaporwave-gradient'
  | 'japanese-wave'
  | 'neobrutal-pastel'
  | 'glass-glow' 
  | 'vintage-ticket' 
  | 'minimal-outline'
  | 'y2k-metallic'
  | 'sticker-doodle';

export type CardMaterial = 'matte_black' | 'brushed_gold' | 'rose_gold' | 'titanium_silver';

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  github?: string;
  youtube?: string;
  tiktok?: string;
  email?: string;
  phone?: string;
}

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  badgeTitle: string;
  theme: ThemeType;
  accentColor: string;
  isVerified: boolean;
  socialLinks: SocialLinks;
  createdAt: string;

  // Design, Typography & Background Customization
  fontFamily?: FontFamilyType;
  fontColor?: string;
  fontSize?: FontSizeScale;
  headerBackground?: BackgroundPatternType;
  showHeaderBackground?: boolean;
  customHeaderImage?: string;
  linkCardStyle?: LinkCardStyleType;
  customBgColor?: string;
}

export interface VCardProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  organization: string;
  jobTitle: string;
  workPhone: string;
  mobilePhone: string;
  workEmail: string;
  website: string;
  streetAddress: string;
  city: string;
  country: string;
  note: string;
}

export type BlockType = 'link' | 'header' | 'social' | 'vcard_cta' | 'media' | 'highlight';

export type StyleVariant = 'peach' | 'lavender' | 'yellow' | 'mint' | 'sky' | 'white' | 'dark';

export interface LinkBlock {
  id: string;
  userId: string;
  type: BlockType;
  title: string;
  subtitle?: string;
  url: string;
  icon: string;
  styleVariant: StyleVariant;
  isActive: boolean;
  sortOrder: number;
  clickCount: number;

  // Custom link background & design
  linkTheme?: LinkCardStyleType; // Custom link card style theme
  bgImage?: string; // Custom uploaded image (data URL or external URL)
  bgColor?: string; // Custom hex/rgb background color
  textColor?: string; // Custom text color for contrast
  bgPattern?: string; // Custom pattern preset class
}

export type CardSideMode = 'double_sided' | 'single_sided';

export interface CardSideConfig {
  artworkUrl?: string; // Custom uploaded image or preset
  artworkOpacity?: number; // 0 to 100
  primaryText?: string; // Main title / engraved name
  secondaryText?: string; // Tagline / role / company
  topLabel?: string; // Brand header (e.g. 'TAPPING' or custom brand)
  bottomLabel?: string; // Sub-label (e.g. 'NFC 13.56MHz' or custom UID)
  showQrCode?: boolean; // QR code on this side
  showChip?: boolean; // Contactless chip indicator
  textColor?: string; // Laser etch color
  textAlign?: 'left' | 'center' | 'right';
  customNote?: string; // Additional free-form custom etch
}

export interface NFCCardDesign {
  id: string;
  material: CardMaterial;
  sideMode?: CardSideMode; // 'double_sided' or 'single_sided'
  frontSide?: CardSideConfig;
  backSide?: CardSideConfig;
  engravedName: string;
  engravedTagline: string;
  qrCodeEnabled: boolean;
  redirectMode: 'profile' | 'direct_vcard' | 'custom_url';
  customRedirectUrl?: string;
  cardUid: string;
  orderStatus: 'draft' | 'ordered' | 'in_production' | 'shipped' | 'delivered';
  trackingNumber?: string;
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}

export interface AnalyticsSummary {
  totalViews: number; // Profile Visited
  totalClicks: number; // Content & Links Clicked
  nfcTaps: number; // Physical NFC Card Taps
  vcardSaves: number; // Contacts Saved to Phonebook
  qrScans: number; // Permanent Vector QR Scans
  ctr: number;
  topLinks: { title: string; clicks: number }[];
  audienceFlowDays: { day: string; count: number; active?: boolean }[];
  hourlyActivity: { hour: string; percentage: number }[];
  devices: { device: string; percentage: number }[];
  referrers: { source: string; percentage: number }[];
}

export interface Subscription {
  tier: 'free' | 'pro' | 'metal_bundle';
  status: 'active' | 'trialing' | 'canceled';
  expiresAt?: string;
}
