export type ThemeType = 'pastel-bento' | 'warm-editorial' | 'minimal-mono' | 'sage-cream' | 'tokyo-night';

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
  totalViews: number;
  totalClicks: number;
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
