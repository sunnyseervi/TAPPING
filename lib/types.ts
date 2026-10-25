export type ThemeType = 
  | 'pastel-bento' 
  | 'comic-pop' 
  | 'retro-arcade' 
  | 'cartoon-doodle' 
  | 'vaporwave-chill' 
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
  | 'tribal-glyphs';

export type LinkCardStyleType = 
  | 'solid' 
  | 'comic-brutalist' 
  | 'retro-pixel' 
  | 'glass-glow' 
  | 'vintage-ticket' 
  | 'minimal-outline';

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
}

export interface NFCCardDesign {
  id: string;
  material: CardMaterial;
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
