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

export type FontFamilyType = 'sans' | 'serif' | 'mono' | 'comic' | 'cartoon' | string;
export type FontSizeScale = 'sm' | 'md' | 'lg' | 'xl';
export type BackgroundPatternType = 
  | 'none' 
  | 'comic-sunburst' 
  | 'comic-sunburst-red'
  | 'pop-halftone' 
  | 'pop-halftone-cyan'
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
  | 'sticker-doodle'
  | 'bauhaus-colorblock'
  | 'swiss-minimal-mono'
  | 'editorial-magazine'
  | 'matte-carbon'
  | 'vintage-parchment'
  | 'tokyo-neon-noir'
  | 'retro-cassette'
  | 'prismatic-glass'
  | 'claymorphism-soft'
  | 'minimal-pill';

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
  fullPageBackground?: boolean;
  pageBgImage?: string;
  customHeaderImage?: string;
  linkCardStyle?: LinkCardStyleType;
  customBgColor?: string;

  // Avatar Frame & Cropping
  avatarFit?: 'cover' | 'contain';
  avatarZoom?: number; // 50 to 250 (%)
  avatarPosX?: number; // -100 to 100 (px)
  avatarPosY?: number; // -100 to 100 (px)
}

export type VisitingCardShape = 'rounded' | 'square';
export type VisitingCardTheme = 'executive_dark' | 'clean_white' | 'gold_luxury' | 'brushed_gold' | 'neo_brutalist' | 'cyber_neon' | 'pastel_bento';

export interface VisitingCardConfig {
  shape: VisitingCardShape;
  theme: VisitingCardTheme;
  customBg?: string;
  customBgFit?: 'cover' | 'contain';
  showBleedMargin?: boolean;
  showBrandMark?: boolean;
  qrSize?: number;
  qrPosX?: number;
  qrPosY?: number;
  qrColor?: string;
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
  visitingCard?: VisitingCardConfig;
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
  bgImageFit?: 'cover' | 'contain' | 'fill'; // Prevent awkward picture cropping
  bgImageZoom?: number; // Image scale percentage
  bgColor?: string; // Custom hex/rgb background color
  textColor?: string; // Custom text color for contrast
  bgPattern?: string; // Custom pattern preset class
}

export type CardSideMode = 'double_sided' | 'single_sided';

export interface CardSideConfig {
  artworkUrl?: string; // Custom uploaded image or preset
  artworkOpacity?: number; // 0 to 100
  artworkZoom?: number; // 50 to 300 (%)
  artworkPosX?: number; // -100 to 100 (%)
  artworkPosY?: number; // -100 to 100 (%)
  fontFamily?: string; // Card typography font

  // Draggable / selectable placement positions for card elements
  brandPosition?: 'top-left' | 'top-right' | 'top-center' | 'bottom-left' | 'bottom-right';
  namePosition?: 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center' | 'top-left';
  qrPosition?: 'bottom-right' | 'top-right' | 'bottom-left' | 'top-left' | 'center';
  chipPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'hidden';

  // Element Sizing & Precision Pixel Offsets
  primaryTextSize?: number; // 12 to 36 px (default: 18)
  secondaryTextSize?: number; // 8 to 22 px (default: 9)
  brandSize?: number; // 10 to 26 px (default: 14)
  qrSize?: number; // 36 to 90 px (default: 56)
  nameOffsetX?: number; // -100 to 100 px
  nameOffsetY?: number; // -100 to 100 px
  qrOffsetX?: number; // -100 to 100 px
  qrOffsetY?: number; // -100 to 100 px
  brandOffsetX?: number; // -100 to 100 px
  brandOffsetY?: number; // -100 to 100 px

  primaryText?: string; // Main title / engraved name
  secondaryText?: string; // Tagline / role / company
  topLabel?: string; // Brand header (e.g. 'TAPPING' or custom brand)
  bottomLabel?: string; // Sub-label (e.g. 'NFC 13.56MHz' or custom UID)
  showQrCode?: boolean; // QR code on this side
  showChip?: boolean; // Contactless chip indicator
  textColor?: string; // Laser etch color
  textAlign?: 'left' | 'center' | 'right';
  customNote?: string; // Additional free-form custom etch
  isPlain?: boolean; // When true, no text, brand, UID, or QR code will be rendered on this side; only the pure material finish or custom artwork
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

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  variants: string[];
  isActive: boolean;
  sortOrder: number;
  viewCount?: number;
  cartAdds?: number;
}

export interface StoreConfig {
  enabled: boolean;
  storeName: string;
  description: string;
  whatsappNumber: string;
  currency: 'INR';
  deliveryNote: string;
  requireAddress: boolean;
  products: StoreProduct[];
  storeVisits?: number;
  whatsappOrders?: number;
}
