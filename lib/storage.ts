import { 
  Profile, 
  VCardProfile, 
  LinkBlock, 
  NFCCardDesign, 
  AnalyticsSummary, 
  Subscription, 
  StoreConfig,
  UserRecord,
  MetalCardOrder,
  CardSideConfig,
  PaymentRecord,
  AdminSession,
  SystemSettings
} from './types';
import { 
  initialProfile, 
  initialVCard, 
  initialLinks, 
  initialNFCCard, 
  initialAnalytics, 
  initialSubscription, 
  initialStore 
} from './mockData';

const KEYS = {
  PROFILE: 'tapping_profile_v3',
  VCARD: 'tapping_vcard_v3',
  LINKS: 'tapping_links_v4',
  NFC: 'tapping_nfc_v3',
  ANALYTICS: 'tapping_analytics_v4',
  SUBSCRIPTION: 'tapping_sub_v3',
  ONBOARDING_DONE: 'tapping_onboarding_completed_v3',
  ACTIVATED: 'tapping_profile_activated_v1',
  STORE: 'tapping_store_v1',
  USERS: 'tapping_admin_users_v1',
  ORDERS: 'tapping_metal_orders_v1',
  PAYMENTS: 'tapping_admin_payments_v1',
  ADMIN_SESSION: 'tapping_admin_session_v1',
  SETTINGS: 'tapping_admin_settings_v1',
};

// ==========================================
// HIGH-PERFORMANCE IN-MEMORY CACHE LAYER
// ==========================================
interface MemoryCache {
  profile?: Profile;
  vcard?: VCardProfile;
  links?: LinkBlock[];
  nfc?: NFCCardDesign;
  analytics?: AnalyticsSummary;
  subscription?: Subscription;
  store?: StoreConfig;
  users?: UserRecord[];
  orders?: MetalCardOrder[];
  payments?: PaymentRecord[];
  adminSession?: AdminSession | null;
  settings?: SystemSettings;
}

const memoryCache: MemoryCache = {};

export function invalidateStorageCache(): void {
  Object.keys(memoryCache).forEach((k) => {
    delete (memoryCache as any)[k];
  });
}

// ==========================================
// STORE STORAGE
// ==========================================
export function getStoredStore(): StoreConfig {
  if (memoryCache.store) return memoryCache.store;
  if (typeof window === 'undefined') return initialStore;
  try {
    const data = localStorage.getItem(KEYS.STORE);
    if (!data) {
      memoryCache.store = initialStore;
      return initialStore;
    }
    const parsed = JSON.parse(data);
    const result: StoreConfig = { 
      ...initialStore, 
      ...parsed, 
      products: Array.isArray(parsed.products) ? parsed.products : initialStore.products 
    };
    memoryCache.store = result;
    return result;
  } catch {
    memoryCache.store = initialStore;
    return initialStore;
  }
}

export function saveStoredStore(store: StoreConfig): void {
  memoryCache.store = store;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.STORE, JSON.stringify(store));
    window.dispatchEvent(new CustomEvent('tapping-store-updated', { detail: store }));
  } catch (e) {
    console.error('Error saving store', e);
  }
}

// ==========================================
// PROFILE STORAGE
// ==========================================
export function getStoredProfile(): Profile {
  if (memoryCache.profile) return memoryCache.profile;
  if (typeof window === 'undefined') return initialProfile;
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    if (!data) {
      memoryCache.profile = initialProfile;
      return initialProfile;
    }
    const parsed = JSON.parse(data);
    // Auto-clean any legacy demo data from existing localStorage
    if (parsed.displayName === 'Aarav Sharma') {
      parsed.displayName = (parsed.username && parsed.username !== 'aarav') ? parsed.username : 'Creator';
    }
    if (parsed.avatarUrl && (
      parsed.avatarUrl.includes('photo-1532375810709') || 
      parsed.avatarUrl.includes('photo-1628157582853') || 
      parsed.avatarUrl.includes('photo-1507003211169')
    )) {
      parsed.avatarUrl = '';
    }
    const result: Profile = { ...initialProfile, ...parsed };
    memoryCache.profile = result;
    return result;
  } catch {
    memoryCache.profile = initialProfile;
    return initialProfile;
  }
}

export function saveStoredProfile(profile: Profile): void {
  memoryCache.profile = profile;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('tapping-profile-updated', { detail: profile }));
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

// ==========================================
// VCARD STORAGE
// ==========================================
export function getStoredVCard(): VCardProfile {
  if (memoryCache.vcard) return memoryCache.vcard;
  if (typeof window === 'undefined') return initialVCard;
  try {
    const data = localStorage.getItem(KEYS.VCARD);
    const parsed = data ? JSON.parse(data) : initialVCard;
    memoryCache.vcard = parsed;
    return parsed;
  } catch {
    memoryCache.vcard = initialVCard;
    return initialVCard;
  }
}

export function saveStoredVCard(vcard: VCardProfile): void {
  memoryCache.vcard = vcard;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.VCARD, JSON.stringify(vcard));
  } catch (e) {
    console.error('Error saving vcard', e);
  }
}

// ==========================================
// LINKS STORAGE
// ==========================================
export function getStoredLinks(): LinkBlock[] {
  if (memoryCache.links) return memoryCache.links;
  if (typeof window === 'undefined') return initialLinks;
  try {
    const data = localStorage.getItem(KEYS.LINKS);
    if (!data) {
      memoryCache.links = initialLinks;
      return initialLinks;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      memoryCache.links = initialLinks;
      return initialLinks;
    }
    // Auto-clean any legacy mock links
    const cleaned = parsed.filter(l => 
      !(l.id === 'lnk_1' && l.clickCount === 1420) && 
      !(l.id === 'lnk_2' && l.clickCount === 890) && 
      !(l.id === 'lnk_3' && l.clickCount === 650)
    );
    memoryCache.links = cleaned;
    return cleaned;
  } catch {
    memoryCache.links = initialLinks;
    return initialLinks;
  }
}

export function saveStoredLinks(links: LinkBlock[]): void {
  memoryCache.links = links;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.LINKS, JSON.stringify(links));
    window.dispatchEvent(new CustomEvent('tapping-links-updated', { detail: links }));
  } catch (e) {
    console.error('Error saving links', e);
  }
}

// ==========================================
// NFC CARD DESIGN STORAGE
// ==========================================
export function getStoredNFCCard(): NFCCardDesign {
  if (memoryCache.nfc) return memoryCache.nfc;
  if (typeof window === 'undefined') return initialNFCCard;
  try {
    const data = localStorage.getItem(KEYS.NFC);
    if (!data) {
      memoryCache.nfc = initialNFCCard;
      return initialNFCCard;
    }
    const parsed = JSON.parse(data);
    const result: NFCCardDesign = {
      ...initialNFCCard,
      ...parsed,
      frontSide: { ...initialNFCCard.frontSide, ...(parsed.frontSide || {}) },
      backSide: { ...initialNFCCard.backSide, ...(parsed.backSide || {}) },
    };
    memoryCache.nfc = result;
    return result;
  } catch {
    memoryCache.nfc = initialNFCCard;
    return initialNFCCard;
  }
}

export function saveStoredNFCCard(nfc: NFCCardDesign): void {
  memoryCache.nfc = nfc;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.NFC, JSON.stringify(nfc));
  } catch (e) {
    console.error('Error saving NFC card', e);
  }
}

// ==========================================
// ANALYTICS & TELEMETRY
// ==========================================
export function getStoredAnalytics(): AnalyticsSummary {
  if (memoryCache.analytics) return memoryCache.analytics;
  if (typeof window === 'undefined') return initialAnalytics;
  try {
    const data = localStorage.getItem(KEYS.ANALYTICS);
    if (!data) {
      memoryCache.analytics = initialAnalytics;
      return initialAnalytics;
    }
    const parsed = JSON.parse(data);
    const links = getStoredLinks();
    const actualClicks = links.reduce((acc, l) => acc + (l.clickCount || 0), 0);
    const views = parsed.totalViews || 0;
    const calculatedCtr = views > 0 ? Number(((actualClicks / views) * 100).toFixed(1)) : 0;
    const result: AnalyticsSummary = {
      ...initialAnalytics,
      ...parsed,
      totalClicks: actualClicks,
      totalViews: views,
      ctr: calculatedCtr,
      nfcTaps: parsed.nfcTaps ?? initialAnalytics.nfcTaps,
      vcardSaves: parsed.vcardSaves ?? initialAnalytics.vcardSaves,
      qrScans: parsed.qrScans ?? initialAnalytics.qrScans,
    };
    memoryCache.analytics = result;
    return result;
  } catch {
    memoryCache.analytics = initialAnalytics;
    return initialAnalytics;
  }
}

export function incrementLinkClick(linkId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const links = getStoredLinks();
    const updated = links.map((l) => (l.id === linkId ? { ...l, clickCount: l.clickCount + 1 } : l));
    saveStoredLinks(updated);

    const analytics = getStoredAnalytics();
    analytics.totalClicks += 1;
    analytics.ctr = analytics.totalViews > 0 ? Number(((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1)) : 0;
    const title = links.find((l) => l.id === linkId)?.title;
    const target = analytics.topLinks.find((t) => t.title === title);
    if (target) {
      target.clicks += 1;
    } else if (title) {
      analytics.topLinks.push({ title, clicks: 1 });
    }
    memoryCache.analytics = analytics;
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(analytics));
  } catch (e) {
    console.error('Error incrementing click', e);
  }
}

export function recordPageView(): void {
  if (typeof window === 'undefined') return;
  try {
    const analytics = getStoredAnalytics();
    analytics.totalViews += 1;
    analytics.ctr = analytics.totalViews > 0 ? Number(((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1)) : 0;
    memoryCache.analytics = analytics;
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(analytics));
  } catch (e) {
    console.error('Error recording page view', e);
  }
}

export function recordNFCTap(): void {
  if (typeof window === 'undefined') return;
  try {
    const analytics = getStoredAnalytics();
    analytics.nfcTaps = (analytics.nfcTaps || 0) + 1;
    analytics.totalViews += 1;
    analytics.ctr = analytics.totalViews > 0 ? Number(((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1)) : 0;
    memoryCache.analytics = analytics;
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(analytics));
  } catch (e) {
    console.error('Error recording NFC tap', e);
  }
}

export function recordVCardDownload(): void {
  if (typeof window === 'undefined') return;
  try {
    const analytics = getStoredAnalytics();
    analytics.vcardSaves = (analytics.vcardSaves || 0) + 1;
    analytics.totalClicks += 1;
    analytics.ctr = analytics.totalViews > 0 ? Number(((analytics.totalClicks / analytics.totalViews) * 100).toFixed(1)) : 0;
    memoryCache.analytics = analytics;
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(analytics));
  } catch (e) {
    console.error('Error recording vCard save', e);
  }
}

export function recordQRScan(): void {
  if (typeof window === 'undefined') return;
  try {
    const analytics = getStoredAnalytics();
    analytics.qrScans = (analytics.qrScans || 0) + 1;
    analytics.totalViews += 1;
    memoryCache.analytics = analytics;
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(analytics));
  } catch (e) {
    console.error('Error recording QR scan', e);
  }
}

// ==========================================
// SUBSCRIPTION STORAGE
// ==========================================
export function getStoredSubscription(): Subscription {
  if (memoryCache.subscription) return memoryCache.subscription;
  if (typeof window === 'undefined') return initialSubscription;
  try {
    const data = localStorage.getItem(KEYS.SUBSCRIPTION);
    const parsed = data ? JSON.parse(data) : initialSubscription;
    memoryCache.subscription = parsed;
    return parsed;
  } catch {
    memoryCache.subscription = initialSubscription;
    return initialSubscription;
  }
}

export function saveStoredSubscription(sub: Subscription): void {
  memoryCache.subscription = sub;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.SUBSCRIPTION, JSON.stringify(sub));
    window.dispatchEvent(new CustomEvent('tapping-subscription-updated', { detail: sub }));
  } catch (e) {
    console.error('Error saving subscription', e);
  }
}

export function getOnboardingCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEYS.ONBOARDING_DONE) === 'true';
}

export function setOnboardingCompleted(completed: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.ONBOARDING_DONE, completed ? 'true' : 'false');
}

export function getProfileActivated(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(KEYS.ACTIVATED);
  if (val !== null) return val === 'true';
  const profile = getStoredProfile();
  return profile.isActivated !== false;
}

export function setProfileActivated(activated: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.ACTIVATED, activated ? 'true' : 'false');
  const profile = getStoredProfile();
  profile.isActivated = activated;
  saveStoredProfile(profile);
  window.dispatchEvent(new CustomEvent('tapping-profile-activated', { detail: activated }));
}

export function sanitizeUsername(input: string): string {
  if (!input) return '';
  return input
    .trim()
    .toLowerCase()
    .replace(/^@+/, '')
    .replace(/[\s,.]+/g, '-')
    .replace(/[^a-z0-9_-]/g, '');
}

export function checkUsernameAvailability(rawInput: string, currentUserId?: string): {
  available: boolean;
  normalized: string;
  reason?: string;
} {
  const normalized = sanitizeUsername(rawInput);
  if (!normalized || normalized.length < 3) {
    return {
      available: false,
      normalized,
      reason: 'Username must be at least 3 characters long',
    };
  }
  if (normalized.length > 30) {
    return {
      available: false,
      normalized,
      reason: 'Username cannot exceed 30 characters',
    };
  }
  const reserved = [
    'admin', 'dashboard', 'api', 'login', 'signup', 'settings', 
    'auth', 'tapping', 'system', 'root', 'help', 'terms', 'privacy',
    'explore', 'shop', 'billing', 'orders', 'nfc', 'store'
  ];
  if (reserved.includes(normalized)) {
    return {
      available: false,
      normalized,
      reason: `'${normalized}' is a reserved platform handle`,
    };
  }

  const users = getStoredUsers();
  const exists = users.some((u) => {
    if (currentUserId && u.id === currentUserId) return false;
    return u.username.toLowerCase() === normalized;
  });

  if (exists) {
    return {
      available: false,
      normalized,
      reason: `'@${normalized}' is already taken by another creator`,
    };
  }

  return {
    available: true,
    normalized,
  };
}

export function activateUserProfile(params: {
  username: string;
  mobileNumber: string;
  fullName: string;
  email?: string;
  plan: 'pro_monthly' | 'pro_yearly';
  paymentMethod: 'UPI' | 'Card' | 'NetBanking';
  amount?: number;
}): { user: UserRecord; payment: PaymentRecord } {
  const normalized = sanitizeUsername(params.username) || 'creator';
  const amount = params.amount || (params.plan === 'pro_yearly' ? 2999 : 299);
  const planDays = params.plan === 'pro_yearly' ? 365 : 30;
  const planExpiresAt = new Date(Date.now() + planDays * 24 * 60 * 60 * 1000).toISOString();
  const createdAt = new Date().toISOString();

  // 1. Get or create user profile
  const currentProfile = getStoredProfile();
  const updatedProfile: Profile = {
    ...currentProfile,
    username: normalized,
    displayName: params.fullName || normalized,
    mobileNumber: params.mobileNumber,
    isActivated: true,
    isVerified: true,
  };
  saveStoredProfile(updatedProfile);

  // 2. Update vCard
  const currentVCard = getStoredVCard();
  saveStoredVCard({
    ...currentVCard,
    firstName: params.fullName.split(' ')[0] || normalized,
    lastName: params.fullName.split(' ').slice(1).join(' ') || '',
    mobilePhone: params.mobileNumber,
    workPhone: params.mobileNumber,
    website: `https://tapping.bio/${normalized}`,
  });

  // 3. Create payment transaction
  const payment: PaymentRecord = {
    id: `pay_${Date.now()}`,
    userId: currentProfile.id || `usr_${Date.now()}`,
    userEmail: params.email || `${normalized}@tapping.bio`,
    amount,
    currency: 'INR',
    type: params.plan === 'pro_yearly' ? 'subscription_yearly' : 'subscription_monthly',
    status: 'succeeded',
    method: params.paymentMethod,
    transactionRef: `${params.paymentMethod.toLowerCase()}_tx_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    createdAt,
    planName: params.plan === 'pro_yearly' ? 'Creator Pro Annual Membership' : 'Creator Pro Monthly Membership',
  };
  recordPayment(payment);

  // 4. Update or add user to stored users registry
  const users = getStoredUsers();
  const existingIdx = users.findIndex((u) => u.username.toLowerCase() === normalized || u.id === currentProfile.id);

  let userRecord: UserRecord;
  if (existingIdx !== -1) {
    users[existingIdx] = {
      ...users[existingIdx],
      username: normalized,
      displayName: params.fullName || users[existingIdx].displayName,
      email: params.email || users[existingIdx].email,
      mobileNumber: params.mobileNumber,
      status: 'active',
      isActivated: true,
      plan: params.plan,
      planExpiresAt,
      profile: updatedProfile,
      lastActiveAt: createdAt,
    };
    userRecord = users[existingIdx];
  } else {
    userRecord = {
      id: `usr_${Date.now()}`,
      username: normalized,
      email: params.email || `${normalized}@tapping.bio`,
      displayName: params.fullName || normalized,
      mobileNumber: params.mobileNumber,
      status: 'active',
      isActivated: true,
      plan: params.plan,
      createdAt,
      planExpiresAt,
      profile: updatedProfile,
      links: getStoredLinks(),
      products: getStoredStore().products,
      totalViews: 1,
      totalClicks: 0,
      lastActiveAt: createdAt,
    };
    users.unshift(userRecord);
  }
  saveStoredUsers(users);

  // 5. Update subscription
  saveStoredSubscription({
    tier: 'pro',
    status: 'active',
    expiresAt: planExpiresAt,
  });

  setOnboardingCompleted(true);
  setProfileActivated(true);

  return { user: userRecord, payment };
}

export function deleteCurrentCustomerAccount(): void {
  if (typeof window === 'undefined') return;
  const currentProfile = getStoredProfile();
  
  const users = getStoredUsers();
  const filtered = users.filter(
    (u) => u.username.toLowerCase() !== currentProfile.username.toLowerCase() && u.id !== currentProfile.id
  );
  saveStoredUsers(filtered);

  invalidateStorageCache();
  localStorage.removeItem(KEYS.PROFILE);
  localStorage.removeItem(KEYS.VCARD);
  localStorage.removeItem(KEYS.LINKS);
  localStorage.removeItem(KEYS.NFC);
  localStorage.removeItem(KEYS.ANALYTICS);
  localStorage.removeItem(KEYS.STORE);
  localStorage.removeItem(KEYS.SUBSCRIPTION);
  localStorage.setItem(KEYS.ONBOARDING_DONE, 'false');
  localStorage.setItem(KEYS.ACTIVATED, 'false');

  window.dispatchEvent(new CustomEvent('tapping-account-deleted'));
}

export function resetAllToDefault(): void {
  if (typeof window === 'undefined') return;
  invalidateStorageCache();
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(initialProfile));
  localStorage.setItem(KEYS.VCARD, JSON.stringify(initialVCard));
  localStorage.setItem(KEYS.LINKS, JSON.stringify(initialLinks));
  localStorage.setItem(KEYS.NFC, JSON.stringify(initialNFCCard));
  localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(initialAnalytics));
  localStorage.setItem(KEYS.SUBSCRIPTION, JSON.stringify(initialSubscription));
  localStorage.setItem(KEYS.STORE, JSON.stringify(initialStore));
}

function isColorDark(hex?: string): boolean {
  if (!hex) return true;
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 160;
}

export function enrichOrderBlueprint(order: MetalCardOrder): MetalCardOrder {
  const isCustom = order.material === 'custom_color';
  const isDark = order.material === 'matte_black' || (isCustom && (!order.customColor || isColorDark(order.customColor)));
  const defaultTextColor = isDark ? '#FFFFFF' : '#141518';

  const frontSide: CardSideConfig = {
    topLabel: order.frontSide?.topLabel || 'TAPPING',
    bottomLabel: order.frontSide?.bottomLabel || `NFC 13.56MHz • ${order.orderNumber}`,
    primaryText: order.frontSide?.primaryText || order.engravedName || 'TAPPING CREATOR',
    secondaryText: order.frontSide?.secondaryText || order.engravedTagline || 'DIGITAL IDENTITY',
    fontFamily: order.frontSide?.fontFamily || "'Plus Jakarta Sans', sans-serif",
    brandPosition: order.frontSide?.brandPosition || 'top-left',
    namePosition: order.frontSide?.namePosition || 'bottom-left',
    chipPosition: order.frontSide?.chipPosition || 'top-right',
    qrPosition: order.frontSide?.qrPosition || 'bottom-right',
    showChip: order.frontSide?.showChip ?? true,
    showQrCode: order.frontSide?.showQrCode ?? (order.sideMode === 'single_sided'),
    primaryTextSize: order.frontSide?.primaryTextSize || 18,
    secondaryTextSize: order.frontSide?.secondaryTextSize || 9,
    brandSize: order.frontSide?.brandSize || 13,
    qrSize: order.frontSide?.qrSize || 56,
    textColor: order.frontSide?.textColor || defaultTextColor,
    artworkUrl: order.frontSide?.artworkUrl || '',
    artworkOpacity: order.frontSide?.artworkOpacity ?? 90,
    artworkZoom: order.frontSide?.artworkZoom ?? 100,
    artworkPosX: order.frontSide?.artworkPosX ?? 0,
    artworkPosY: order.frontSide?.artworkPosY ?? 0,
    nameOffsetX: order.frontSide?.nameOffsetX ?? 0,
    nameOffsetY: order.frontSide?.nameOffsetY ?? 0,
    brandOffsetX: order.frontSide?.brandOffsetX ?? 0,
    brandOffsetY: order.frontSide?.brandOffsetY ?? 0,
    qrOffsetX: order.frontSide?.qrOffsetX ?? 0,
    qrOffsetY: order.frontSide?.qrOffsetY ?? 0,
    secondaryOffsetX: order.frontSide?.secondaryOffsetX ?? 0,
    secondaryOffsetY: order.frontSide?.secondaryOffsetY ?? 0,
    isPlain: order.frontSide?.isPlain ?? false,
    customNote: order.frontSide?.customNote || '',
    ...order.frontSide,
  };

  const backSide: CardSideConfig = {
    topLabel: order.backSide?.topLabel || 'TAPPING',
    bottomLabel: order.backSide?.bottomLabel || `UID: ${order.orderNumber}-CORE`,
    primaryText: order.backSide?.primaryText || 'TAP ANY PHONE TO CONNECT',
    secondaryText: order.backSide?.secondaryText || order.qrUrl || 'https://tapping.bio',
    fontFamily: order.backSide?.fontFamily || "'Plus Jakarta Sans', sans-serif",
    brandPosition: order.backSide?.brandPosition || 'top-left',
    namePosition: order.backSide?.namePosition || 'bottom-left',
    chipPosition: order.backSide?.chipPosition || 'hidden',
    qrPosition: order.backSide?.qrPosition || 'bottom-right',
    showChip: order.backSide?.showChip ?? false,
    showQrCode: order.backSide?.showQrCode ?? true,
    primaryTextSize: order.backSide?.primaryTextSize || 13,
    secondaryTextSize: order.backSide?.secondaryTextSize || 11,
    brandSize: order.backSide?.brandSize || 13,
    qrSize: order.backSide?.qrSize || 64,
    textColor: order.backSide?.textColor || defaultTextColor,
    customNote: order.backSide?.customNote || 'ISO 14443A • NTAG216 Chip',
    isPlain: order.backSide?.isPlain ?? (order.sideMode === 'single_sided'),
    artworkUrl: order.backSide?.artworkUrl || '',
    artworkOpacity: order.backSide?.artworkOpacity ?? 85,
    artworkZoom: order.backSide?.artworkZoom ?? 100,
    artworkPosX: order.backSide?.artworkPosX ?? 0,
    artworkPosY: order.backSide?.artworkPosY ?? 0,
    nameOffsetX: order.backSide?.nameOffsetX ?? 0,
    nameOffsetY: order.backSide?.nameOffsetY ?? 0,
    brandOffsetX: order.backSide?.brandOffsetX ?? 0,
    brandOffsetY: order.backSide?.brandOffsetY ?? 0,
    qrOffsetX: order.backSide?.qrOffsetX ?? 0,
    qrOffsetY: order.backSide?.qrOffsetY ?? 0,
    secondaryOffsetX: order.backSide?.secondaryOffsetX ?? 0,
    secondaryOffsetY: order.backSide?.secondaryOffsetY ?? 0,
    ...order.backSide,
  };

  return {
    ...order,
    sideMode: order.sideMode || 'double_sided',
    frontSide,
    backSide,
  };
}

// ==========================================
// REAL DATA SANITIZERS (PURGE LEGACY MOCK DATA)
// ==========================================
function filterOutMockUsers(users: UserRecord[]): UserRecord[] {
  if (!Array.isArray(users)) return [];
  return users.filter((u) => {
    if (!u || !u.id) return false;
    if (['usr_001', 'usr_002', 'usr_003', 'usr_004', 'usr_005'].includes(u.id)) return false;
    if (u.displayName === 'Aarav Sharma' || u.email?.includes('aarav@tapping.bio')) return false;
    return true;
  });
}

function filterOutMockOrders(orders: MetalCardOrder[]): MetalCardOrder[] {
  if (!Array.isArray(orders)) return [];
  return orders.filter((o) => {
    if (!o || !o.id) return false;
    if (['ord_10891', 'ord_10892', 'ord_10893', 'ord_10894', 'ord_10895'].includes(o.id)) return false;
    if (o.userName === 'Aarav Sharma' || o.userEmail?.includes('aarav@tapping.bio')) return false;
    return true;
  });
}

function filterOutMockPayments(payments: PaymentRecord[]): PaymentRecord[] {
  if (!Array.isArray(payments)) return [];
  return payments.filter((p) => {
    if (!p || !p.id) return false;
    if (['pay_001', 'pay_002', 'pay_003', 'pay_004', 'pay_005'].includes(p.id)) return false;
    if (p.userEmail?.includes('aarav@tapping.bio')) return false;
    return true;
  });
}

// ==========================================
// USER MANAGEMENT STORAGE METHODS
// ==========================================
export function getStoredUsers(): UserRecord[] {
  if (memoryCache.users) return memoryCache.users;
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(KEYS.USERS);
    let users: UserRecord[] = [];
    if (data) {
      const parsed = JSON.parse(data);
      users = filterOutMockUsers(parsed);
    }

    // If users list is empty, automatically add the currently active creator if they've registered
    const activeProfile = getStoredProfile();
    if (activeProfile && activeProfile.username && activeProfile.username !== 'alex' && activeProfile.username !== 'aarav' && activeProfile.username !== 'creator') {
      const alreadyHas = users.some(u => u.username.toLowerCase() === activeProfile.username.toLowerCase());
      if (!alreadyHas) {
        const autoUser: UserRecord = {
          id: activeProfile.id || `usr_${Date.now()}`,
          username: activeProfile.username,
          email: activeProfile.mobileNumber ? `${activeProfile.username}@tapping.bio` : 'creator@tapping.bio',
          displayName: activeProfile.displayName || activeProfile.username,
          avatarUrl: activeProfile.avatarUrl,
          mobileNumber: activeProfile.mobileNumber || '',
          isActivated: activeProfile.isActivated !== false,
          status: 'active',
          plan: 'pro_monthly',
          createdAt: activeProfile.createdAt || new Date().toISOString(),
          planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          profile: activeProfile,
          links: getStoredLinks(),
          products: getStoredStore().products,
          totalViews: getStoredAnalytics().totalViews,
          totalClicks: getStoredAnalytics().totalClicks,
          lastActiveAt: new Date().toISOString(),
        };
        users.unshift(autoUser);
        localStorage.setItem(KEYS.USERS, JSON.stringify(users));
      }
    }

    memoryCache.users = users;
    return users;
  } catch {
    memoryCache.users = [];
    return [];
  }
}

export function saveStoredUsers(users: UserRecord[]): void {
  memoryCache.users = users;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    window.dispatchEvent(new CustomEvent('tapping-users-updated', { detail: users }));
  } catch (e) {
    console.error('Error saving users', e);
  }
}

export function getUserByUsername(username: string): UserRecord | undefined {
  const users = getStoredUsers();
  return users.find((u) => u.username.toLowerCase() === username.toLowerCase());
}

export function addStoredUser(newUser: Partial<UserRecord>): UserRecord {
  const users = getStoredUsers();
  const id = `usr_${Date.now()}`;
  const record: UserRecord = {
    id,
    username: newUser.username || `creator_${Date.now().toString().slice(-4)}`,
    email: newUser.email || 'user@example.com',
    displayName: newUser.displayName || 'New Creator',
    avatarUrl: newUser.avatarUrl || '',
    mobileNumber: newUser.mobileNumber || '+91 98000 00000',
    isActivated: newUser.isActivated !== false,
    status: newUser.status || 'active',
    plan: newUser.plan || 'pro_monthly',
    createdAt: new Date().toISOString(),
    planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    profile: {
      ...initialProfile,
      id,
      username: newUser.username || 'newuser',
      displayName: newUser.displayName || 'New Creator',
    },
    links: [],
    products: [],
    totalViews: 0,
    totalClicks: 0,
    lastActiveAt: new Date().toISOString(),
    ...newUser,
  };
  users.unshift(record);
  saveStoredUsers(users);
  return record;
}

export function updateStoredUser(userId: string, updates: Partial<UserRecord>): void {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    saveStoredUsers(users);

    const activeProfile = getStoredProfile();
    if (activeProfile.id === userId || users[idx].username === activeProfile.username) {
      if (updates.displayName) activeProfile.displayName = updates.displayName;
      if (updates.username) activeProfile.username = updates.username;
      if (updates.links) saveStoredLinks(updates.links);
      saveStoredProfile(activeProfile);
    }
  }
}

export function updateUserLink(userId: string, linkId: string, updates: Partial<LinkBlock>): void {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (user && user.links) {
    const linkIdx = user.links.findIndex((l) => l.id === linkId);
    if (linkIdx !== -1) {
      user.links[linkIdx] = { ...user.links[linkIdx], ...updates };
      saveStoredUsers(users);

      const activeProfile = getStoredProfile();
      if (activeProfile.id === userId || user.username === activeProfile.username) {
        saveStoredLinks(user.links);
      }
    }
  }
}

export function deleteUserLink(userId: string, linkId: string): void {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (user && user.links) {
    user.links = user.links.filter((l) => l.id !== linkId);
    saveStoredUsers(users);

    const activeProfile = getStoredProfile();
    if (activeProfile.id === userId || user.username === activeProfile.username) {
      saveStoredLinks(user.links);
    }
  }
}

export function addUserLink(userId: string, newLink: Partial<LinkBlock>): LinkBlock | null {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (user) {
    if (!user.links) user.links = [];
    const link: LinkBlock = {
      id: `lnk_${Date.now()}`,
      userId,
      type: 'link',
      title: newLink.title || 'New Link',
      url: newLink.url || 'https://tapping.bio',
      icon: newLink.icon || 'globe',
      styleVariant: newLink.styleVariant || 'peach',
      isActive: true,
      sortOrder: user.links.length,
      clickCount: 0,
      ...newLink,
    };
    user.links.push(link);
    saveStoredUsers(users);

    const activeProfile = getStoredProfile();
    if (activeProfile.id === userId || user.username === activeProfile.username) {
      saveStoredLinks(user.links);
    }
    return link;
  }
  return null;
}

export function toggleUserBlock(userId: string): boolean {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    const isNowBlocked = users[idx].status !== 'blocked';
    users[idx].status = isNowBlocked ? 'blocked' : 'active';
    saveStoredUsers(users);
    return isNowBlocked;
  }
  return false;
}

export function deleteStoredUser(userId: string): void {
  const users = getStoredUsers();
  const filtered = users.filter((u) => u.id !== userId);
  saveStoredUsers(filtered);
}

// ==========================================
// METAL CARD ORDERS STORAGE METHODS
// ==========================================
export function getStoredOrders(): MetalCardOrder[] {
  if (memoryCache.orders) return memoryCache.orders;
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(KEYS.ORDERS);
    if (!data) {
      memoryCache.orders = [];
      return [];
    }
    const parsed = JSON.parse(data);
    const cleaned = filterOutMockOrders(parsed);
    const result = cleaned.map((order: MetalCardOrder) => enrichOrderBlueprint(order));
    memoryCache.orders = result;
    return result;
  } catch {
    memoryCache.orders = [];
    return [];
  }
}

export function saveStoredOrders(orders: MetalCardOrder[]): void {
  memoryCache.orders = orders;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('tapping-orders-updated', { detail: orders }));
  } catch (e) {
    console.error('Error saving orders', e);
  }
}

export function createMetalCardOrder(orderData: Partial<MetalCardOrder>): MetalCardOrder {
  const orders = getStoredOrders();
  const seqNum = 10001 + orders.length;
  const orderNumber = `TAP-${seqNum}`;
  const isCod = orderData.paymentMethod === 'COD';

  const newOrder: MetalCardOrder = enrichOrderBlueprint({
    id: `ord_${Date.now()}`,
    orderNumber,
    userId: orderData.userId || 'usr_001',
    userName: orderData.userName || 'Creator',
    userEmail: orderData.userEmail || 'creator@tapping.bio',
    userPhone: orderData.userPhone || '+91 98765 43210',
    material: orderData.material || 'matte_black',
    customColor: orderData.customColor,
    engravedName: orderData.engravedName || 'TAPPING CREATOR',
    engravedTagline: orderData.engravedTagline || 'DIGITAL BUSINESS CARD',
    qrUrl: orderData.qrUrl || 'https://tapping.bio',
    status: 'in_production',
    trackingNumber: `DEL-${Math.floor(1000000 + Math.random() * 9000000)}`,
    shippingCarrier: 'Delhivery Surface Pro',
    amount: orderData.amount || 1499,
    currency: 'INR',
    paymentStatus: isCod ? 'pending' : 'paid',
    paymentMethod: orderData.paymentMethod || 'UPI',
    createdAt: new Date().toISOString(),
    sideMode: orderData.sideMode || 'double_sided',
    frontSide: orderData.frontSide,
    backSide: orderData.backSide,
    shippingAddress: orderData.shippingAddress || {
      name: orderData.userName || 'Creator',
      street: '100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zip: '560038',
      country: 'India',
    },
    ...orderData,
  });

  orders.unshift(newOrder);
  saveStoredOrders(orders);

  // Also record real payment transaction
  recordPayment({
    userId: newOrder.userId,
    userEmail: newOrder.userEmail,
    amount: newOrder.amount,
    currency: 'INR',
    type: 'metal_card',
    status: isCod ? 'pending' : 'succeeded',
    method: isCod ? 'COD' : 'UPI',
    planName: `Metal NFC Card (${newOrder.material === 'custom_color' ? `Custom Shade ${newOrder.customColor || ''}` : newOrder.material.replace('_', ' ').toUpperCase()})`,
  });

  return newOrder;
}

export function updateOrderStatus(
  orderId: string, 
  status: MetalCardOrder['status'], 
  trackingNumber?: string
): void {
  const orders = getStoredOrders();
  const target = orders.find((o) => o.id === orderId);
  if (target) {
    target.status = status;
    if (trackingNumber) target.trackingNumber = trackingNumber;
    saveStoredOrders(orders);
  }
}

// ==========================================
// PAYMENTS STORAGE METHODS
// ==========================================
export function getStoredPayments(): PaymentRecord[] {
  if (memoryCache.payments) return memoryCache.payments;
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(KEYS.PAYMENTS);
    if (!data) {
      memoryCache.payments = [];
      return [];
    }
    const parsed = JSON.parse(data);
    const cleaned = filterOutMockPayments(parsed);
    memoryCache.payments = cleaned;
    return cleaned;
  } catch {
    memoryCache.payments = [];
    return [];
  }
}

export function saveStoredPayments(payments: PaymentRecord[]): void {
  memoryCache.payments = payments;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(payments));
  } catch (e) {
    console.error('Error saving payments', e);
  }
}

export function recordPayment(payment: Partial<PaymentRecord>): PaymentRecord {
  const payments = getStoredPayments();
  const newPayment: PaymentRecord = {
    id: `pay_${Date.now()}`,
    userId: payment.userId || 'usr_001',
    userEmail: payment.userEmail || 'creator@tapping.bio',
    amount: payment.amount || 299,
    currency: 'INR',
    type: payment.type || 'subscription_monthly',
    status: 'succeeded',
    method: payment.method || 'UPI',
    transactionRef: `upi_${Date.now()}`,
    createdAt: new Date().toISOString(),
    planName: payment.planName || 'Pro Subscription',
    ...payment,
  };
  payments.unshift(newPayment);
  saveStoredPayments(payments);
  return newPayment;
}

// ==========================================
// ADMIN AUTHENTICATION & SUPERUSER GATE
// ONLY sunnyservi123@gmail.com IS AUTHORIZED
// ==========================================

export const AUTHORIZED_SUPERADMIN_EMAIL = 'sunnyservi123@gmail.com';

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === AUTHORIZED_SUPERADMIN_EMAIL.toLowerCase();
}

export function createAdminGoogleSession(googleUser: {
  email: string;
  name?: string;
  picture?: string;
}): { success: boolean; session?: AdminSession; error?: string } {
  const cleanEmail = googleUser.email.trim().toLowerCase();
  if (cleanEmail !== AUTHORIZED_SUPERADMIN_EMAIL.toLowerCase()) {
    return {
      success: false,
      error: `ACCESS DENIED: Account '${googleUser.email}' is not authorized. Only ${AUTHORIZED_SUPERADMIN_EMAIL} is granted administrator clearance.`,
    };
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const token = `adm_sec_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

  const session: AdminSession = {
    isAuthenticated: true,
    adminEmail: AUTHORIZED_SUPERADMIN_EMAIL,
    adminName: googleUser.name || 'Sunny',
    token,
    loginTime: now.toISOString(),
    expiresAt,
  };

  saveAdminSession(session);
  return { success: true, session };
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  if (memoryCache.adminSession !== undefined) return memoryCache.adminSession;
  try {
    const data = localStorage.getItem(KEYS.ADMIN_SESSION);
    if (!data) {
      memoryCache.adminSession = null;
      return null;
    }
    const session: AdminSession = JSON.parse(data);
    // Strict email check
    if (
      !session ||
      !session.isAuthenticated ||
      session.adminEmail.toLowerCase() !== AUTHORIZED_SUPERADMIN_EMAIL.toLowerCase()
    ) {
      clearAdminSession();
      return null;
    }
    // 24-hour expiration check
    const loginTime = new Date(session.loginTime).getTime();
    if (isNaN(loginTime) || Date.now() - loginTime > 24 * 60 * 60 * 1000) {
      clearAdminSession();
      return null;
    }
    memoryCache.adminSession = session;
    return session;
  } catch {
    memoryCache.adminSession = null;
    return null;
  }
}

export function isSuperAdminAuthorized(): boolean {
  const session = getAdminSession();
  return !!(
    session &&
    session.isAuthenticated &&
    session.adminEmail.toLowerCase() === AUTHORIZED_SUPERADMIN_EMAIL.toLowerCase()
  );
}

export function saveAdminSession(session: AdminSession): void {
  memoryCache.adminSession = session;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify(session));
    window.dispatchEvent(new CustomEvent('tapping-admin-session-updated', { detail: session }));
  } catch (e) {
    console.error('Error saving admin session', e);
  }
}

export function clearAdminSession(): void {
  memoryCache.adminSession = null;
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.ADMIN_SESSION);
  window.dispatchEvent(new CustomEvent('tapping-admin-session-updated', { detail: null }));
}

/**
 * @deprecated Password login has been removed. Only sunnyservi123@gmail.com Google Auth is accepted.
 */
export function verifyAdminCredentials(email: string, pin: string): boolean {
  return false;
}

// ==========================================
// SYSTEM SETTINGS STORAGE
// ==========================================
const DEFAULT_SETTINGS: SystemSettings = {
  maintenanceMode: false,
  globalAnnouncement: 'Welcome to TAPPING Pro & Metal NFC Platform. All systems operational.',
  allowSignups: true,
  supabaseConnected: false,
  supabaseUrl: 'https://xyzcompany.supabase.co',
};

export function getSystemSettings(): SystemSettings {
  if (memoryCache.settings) return memoryCache.settings;
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) {
      memoryCache.settings = DEFAULT_SETTINGS;
      return DEFAULT_SETTINGS;
    }
    const result: SystemSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    memoryCache.settings = result;
    return result;
  } catch {
    memoryCache.settings = DEFAULT_SETTINGS;
    return DEFAULT_SETTINGS;
  }
}

export function saveSystemSettings(settings: SystemSettings): void {
  memoryCache.settings = settings;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}
