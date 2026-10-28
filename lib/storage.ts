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
import { initialProfile, initialVCard, initialLinks, initialNFCCard, initialAnalytics, initialSubscription, initialStore } from './mockData';

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

export function getStoredStore(): StoreConfig {
  if (typeof window === 'undefined') return initialStore;
  try {
    const data = localStorage.getItem(KEYS.STORE);
    if (!data) return initialStore;
    const parsed = JSON.parse(data);
    return { ...initialStore, ...parsed, products: Array.isArray(parsed.products) ? parsed.products : initialStore.products };
  } catch {
    return initialStore;
  }
}

export function saveStoredStore(store: StoreConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.STORE, JSON.stringify(store));
  } catch (e) {
    console.error('Error saving store', e);
  }
}

export function getStoredProfile(): Profile {
  if (typeof window === 'undefined') return initialProfile;
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    if (!data) return initialProfile;
    const parsed = JSON.parse(data);
    // Auto-clean any legacy demo data from existing localStorage
    if (parsed.displayName === 'Aarav Sharma') {
      parsed.displayName = (parsed.username && parsed.username !== 'aarav') ? parsed.username : 'Creator';
    }
    if (parsed.avatarUrl && (parsed.avatarUrl.includes('photo-1532375810709') || parsed.avatarUrl.includes('photo-1628157582853') || parsed.avatarUrl.includes('photo-1507003211169'))) {
      parsed.avatarUrl = '';
    }
    return { ...initialProfile, ...parsed };
  } catch {
    return initialProfile;
  }
}

export function saveStoredProfile(profile: Profile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('tapping-profile-updated', { detail: profile }));
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

export function getStoredVCard(): VCardProfile {
  if (typeof window === 'undefined') return initialVCard;
  try {
    const data = localStorage.getItem(KEYS.VCARD);
    return data ? JSON.parse(data) : initialVCard;
  } catch {
    return initialVCard;
  }
}

export function saveStoredVCard(vcard: VCardProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.VCARD, JSON.stringify(vcard));
  } catch (e) {
    console.error('Error saving vcard', e);
  }
}

export function getStoredLinks(): LinkBlock[] {
  if (typeof window === 'undefined') return initialLinks;
  try {
    const data = localStorage.getItem(KEYS.LINKS);
    if (!data) return initialLinks;
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) return initialLinks;
    // Auto-clean any legacy mock links (lnk_1, lnk_2, lnk_3 with fake clicks 1420, 890, 650)
    const cleaned = parsed.filter(l => !(l.id === 'lnk_1' && l.clickCount === 1420) && !(l.id === 'lnk_2' && l.clickCount === 890) && !(l.id === 'lnk_3' && l.clickCount === 650));
    return cleaned;
  } catch {
    return initialLinks;
  }
}

export function saveStoredLinks(links: LinkBlock[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.LINKS, JSON.stringify(links));
  } catch (e) {
    console.error('Error saving links', e);
  }
}

export function getStoredNFCCard(): NFCCardDesign {
  if (typeof window === 'undefined') return initialNFCCard;
  try {
    const data = localStorage.getItem(KEYS.NFC);
    if (!data) return initialNFCCard;
    const parsed = JSON.parse(data);
    return {
      ...initialNFCCard,
      ...parsed,
      frontSide: { ...initialNFCCard.frontSide, ...(parsed.frontSide || {}) },
      backSide: { ...initialNFCCard.backSide, ...(parsed.backSide || {}) },
    };
  } catch {
    return initialNFCCard;
  }
}

export function saveStoredNFCCard(nfc: NFCCardDesign): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.NFC, JSON.stringify(nfc));
  } catch (e) {
    console.error('Error saving NFC card', e);
  }
}

export function getStoredAnalytics(): AnalyticsSummary {
  if (typeof window === 'undefined') return initialAnalytics;
  try {
    const data = localStorage.getItem(KEYS.ANALYTICS);
    if (!data) return initialAnalytics;
    const parsed = JSON.parse(data);
    const links = getStoredLinks();
    const actualClicks = links.reduce((acc, l) => acc + (l.clickCount || 0), 0);
    const views = parsed.totalViews || 0;
    const calculatedCtr = views > 0 ? Number(((actualClicks / views) * 100).toFixed(1)) : 0;
    return {
      ...initialAnalytics,
      ...parsed,
      totalClicks: actualClicks,
      totalViews: views,
      ctr: calculatedCtr,
      nfcTaps: parsed.nfcTaps ?? initialAnalytics.nfcTaps,
      vcardSaves: parsed.vcardSaves ?? initialAnalytics.vcardSaves,
      qrScans: parsed.qrScans ?? initialAnalytics.qrScans,
    };
  } catch {
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
    analytics.ctr = Number(((analytics.totalClicks / (analytics.totalViews || 1)) * 100).toFixed(1));
    const title = links.find((l) => l.id === linkId)?.title;
    const target = analytics.topLinks.find((t) => t.title === title);
    if (target) {
      target.clicks += 1;
    } else if (title) {
      analytics.topLinks.push({ title, clicks: 1 });
    }
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
    analytics.ctr = Number(((analytics.totalClicks / (analytics.totalViews || 1)) * 100).toFixed(1));
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
    analytics.ctr = Number(((analytics.totalClicks / (analytics.totalViews || 1)) * 100).toFixed(1));
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
    analytics.ctr = Number(((analytics.totalClicks / (analytics.totalViews || 1)) * 100).toFixed(1));
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
    localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(analytics));
  } catch (e) {
    console.error('Error recording QR scan', e);
  }
}

export function getStoredSubscription(): Subscription {
  if (typeof window === 'undefined') return initialSubscription;
  try {
    const data = localStorage.getItem(KEYS.SUBSCRIPTION);
    return data ? JSON.parse(data) : initialSubscription;
  } catch {
    return initialSubscription;
  }
}

export function saveStoredSubscription(sub: Subscription): void {
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

  // 2. Update vCard with phone number and website
  const currentVCard = getStoredVCard();
  saveStoredVCard({
    ...currentVCard,
    firstName: params.fullName.split(' ')[0] || normalized,
    lastName: params.fullName.split(' ').slice(1).join(' ') || '',
    mobilePhone: params.mobileNumber,
    workPhone: params.mobileNumber,
    website: `https://tapping.bio/${normalized}`,
  });

  // 3. Create and record payment
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

  // 6. Set flags
  setOnboardingCompleted(true);
  setProfileActivated(true);

  return { user: userRecord, payment };
}

export function deleteCurrentCustomerAccount(): void {
  if (typeof window === 'undefined') return;
  const currentProfile = getStoredProfile();
  
  // Remove from users list
  const users = getStoredUsers();
  const filtered = users.filter(
    (u) => u.username.toLowerCase() !== currentProfile.username.toLowerCase() && u.id !== currentProfile.id
  );
  saveStoredUsers(filtered);

  // Reset local items
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
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(initialProfile));
  localStorage.setItem(KEYS.VCARD, JSON.stringify(initialVCard));
  localStorage.setItem(KEYS.LINKS, JSON.stringify(initialLinks));
  localStorage.setItem(KEYS.NFC, JSON.stringify(initialNFCCard));
  localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(initialAnalytics));
  localStorage.setItem(KEYS.SUBSCRIPTION, JSON.stringify(initialSubscription));
  localStorage.setItem(KEYS.STORE, JSON.stringify(initialStore));
}

// ==========================================
// SEED DATA FOR ADMIN PANEL & MULTI-USER HUB
// ==========================================

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'usr_001',
    username: 'aarav',
    email: 'aarav@tapping.bio',
    displayName: 'Aarav Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=600&auto=format&fit=crop&q=80',
    mobileNumber: '+91 98765 43210',
    isActivated: true,
    status: 'active',
    plan: 'pro_yearly',
    createdAt: '2026-01-15T10:30:00Z',
    planExpiresAt: '2027-01-15T10:30:00Z',
    profile: initialProfile,
    links: [
      {
        id: 'lnk_1',
        userId: 'usr_001',
        type: 'link',
        title: 'Design Portfolio & Works',
        url: 'https://github.com',
        icon: 'briefcase',
        styleVariant: 'sky',
        bgColor: '#3B82F6',
        textColor: '#FFFFFF',
        isActive: true,
        sortOrder: 0,
        clickCount: 1420,
      },
      {
        id: 'lnk_2',
        userId: 'usr_001',
        type: 'link',
        title: 'Book 1:1 Product Advisory',
        url: 'https://cal.com',
        icon: 'phone',
        styleVariant: 'yellow',
        bgColor: '#FDF166',
        textColor: '#141518',
        isActive: true,
        sortOrder: 1,
        clickCount: 890,
      },
      {
        id: 'lnk_3',
        userId: 'usr_001',
        type: 'link',
        title: 'Bengaluru Tech Keynote RSVP',
        url: 'https://tapping.bio/aarav',
        icon: 'calendar',
        styleVariant: 'peach',
        bgColor: '#EF4444',
        textColor: '#FFFFFF',
        isActive: true,
        sortOrder: 2,
        clickCount: 650,
      },
    ],
    products: [
      {
        id: 'prod_1',
        name: 'Matte Stealth Black NFC Card',
        description: 'Laser engraved aerospace grade stainless steel contactless NFC card.',
        price: 1499,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
        variants: ['Black'],
        isActive: true,
        sortOrder: 0,
        viewCount: 1240,
        cartAdds: 88,
      },
      {
        id: 'prod_2',
        name: 'Studio Notebook & Pen Set',
        description: 'Hardcover debossed notebook with 120gsm bamboo paper.',
        price: 499,
        imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600',
        variants: ['A5 Size'],
        isActive: true,
        sortOrder: 1,
        viewCount: 650,
        cartAdds: 42,
      },
    ],
    nfcCard: initialNFCCard,
    totalViews: 24912,
    totalClicks: 8430,
    lastActiveAt: '2026-10-25T23:45:00Z',
  },
  {
    id: 'usr_002',
    username: 'priya',
    email: 'priya.patel@designstudio.in',
    displayName: 'Priya Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    mobileNumber: '+91 98200 12345',
    isActivated: true,
    status: 'active',
    plan: 'pro_monthly',
    createdAt: '2026-02-10T14:20:00Z',
    planExpiresAt: '2026-11-10T14:20:00Z', // Expiring in 15 days
    profile: {
      ...initialProfile,
      id: 'usr_002',
      username: 'priya',
      displayName: 'Priya Patel',
      bio: 'Principal UX Director & Keynote Speaker. Designing ethical interfaces for millions.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      badgeTitle: 'UX Director',
    },
    links: [
      {
        id: 'lnk_p1',
        userId: 'usr_002',
        type: 'link',
        title: 'Keynote Talk: Generative Interfaces',
        url: 'https://youtube.com',
        icon: 'video',
        styleVariant: 'peach',
        isActive: true,
        sortOrder: 0,
        clickCount: 3120,
      },
    ],
    products: [],
    totalViews: 18340,
    totalClicks: 5210,
    lastActiveAt: '2026-10-25T22:15:00Z',
  },
  {
    id: 'usr_003',
    username: 'rohit',
    email: 'rohit.beats@indieaudio.co',
    displayName: 'Rohit Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    mobileNumber: '+91 99300 54321',
    isActivated: true,
    status: 'active',
    plan: 'pro_yearly',
    createdAt: '2026-03-01T09:10:00Z',
    planExpiresAt: '2027-03-01T09:10:00Z',
    profile: {
      ...initialProfile,
      id: 'usr_003',
      username: 'rohit',
      displayName: 'Rohit Verma',
      bio: 'Music Producer & Sound Designer. Listen to my latest ambient EP streaming now.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      badgeTitle: 'Indie Producer',
    },
    links: [
      {
        id: 'lnk_r1',
        userId: 'usr_003',
        type: 'link',
        title: 'Listen on Spotify: Monsoon Echoes',
        url: 'https://spotify.com',
        icon: 'music',
        styleVariant: 'mint',
        isActive: true,
        sortOrder: 0,
        clickCount: 4890,
      },
    ],
    products: [],
    totalViews: 12050,
    totalClicks: 4980,
    lastActiveAt: '2026-10-25T19:30:00Z',
  },
  {
    id: 'usr_004',
    username: 'aanya',
    email: 'aanya.pottery@studio.in',
    displayName: 'Aanya Sen',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    mobileNumber: '+91 97110 98765',
    isActivated: true,
    status: 'active',
    plan: 'pro_monthly',
    createdAt: '2026-04-18T16:40:00Z',
    planExpiresAt: '2026-10-31T16:40:00Z', // Expiring in 5 days!
    profile: {
      ...initialProfile,
      id: 'usr_004',
      username: 'aanya',
      displayName: 'Aanya Sen',
      bio: 'Maker, ceramic artist and studio owner. Crafting functional stoneware in Bengaluru.',
      avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      badgeTitle: 'Studio Ceramicist',
    },
    links: [],
    products: [
      {
        id: 'prod_a1',
        name: 'Sculpted Ceramic Mug No. 2',
        description: 'Hand-thrown stoneware mug with organic raw clay texture.',
        price: 1299,
        imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
        variants: ['Sand White', 'Speckled Charcoal'],
        isActive: true,
        sortOrder: 0,
        viewCount: 880,
        cartAdds: 35,
      },
    ],
    totalViews: 9840,
    totalClicks: 2190,
    lastActiveAt: '2026-10-25T18:10:00Z',
  },
  {
    id: 'usr_005',
    username: 'vikram',
    email: 'vikram@growthconsulting.in',
    displayName: 'Vikram Joshi',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    mobileNumber: '+91 98100 11223',
    isActivated: false,
    status: 'blocked',
    plan: 'free',
    createdAt: '2026-05-12T11:00:00Z',
    planExpiresAt: '2026-06-12T11:00:00Z',
    profile: {
      ...initialProfile,
      id: 'usr_005',
      username: 'vikram',
      displayName: 'Vikram Joshi',
      bio: 'Growth advisor & angel investor helping early stage founders scale.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      badgeTitle: 'Angel Advisor',
    },
    links: [],
    products: [],
    totalViews: 6210,
    totalClicks: 1410,
    lastActiveAt: '2026-10-20T12:00:00Z',
  },
];

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

const INITIAL_ORDERS: MetalCardOrder[] = [
  {
    id: 'ord_10893',
    orderNumber: 'TAP-10893',
    userId: 'usr_005',
    userName: 'Vikram Malhotra',
    userEmail: 'vikram@malhotradesign.in',
    userPhone: '+91 99887 76655',
    material: 'custom_color',
    customColor: '#1A365D',
    engravedName: 'VIKRAM MALHOTRA',
    engravedTagline: 'CHIEF DESIGN OFFICER',
    qrUrl: 'https://tapping.bio/vikram',
    status: 'in_production',
    trackingNumber: 'DEL-9918234',
    shippingCarrier: 'Delhivery Surface Pro',
    amount: 1499,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    createdAt: '2026-10-25T14:20:00Z',
    sideMode: 'double_sided',
    notes: 'Laser engrave with 24K gold foil infill on Prussian Blue custom color metal surface.',
    frontSide: {
      topLabel: 'MALHOTRA & CO.',
      bottomLabel: 'NFC 13.56MHz • TAP-IN-10893',
      primaryText: 'VIKRAM MALHOTRA',
      secondaryText: 'CHIEF DESIGN OFFICER',
      fontFamily: "'Cinzel', serif",
      brandPosition: 'top-left',
      namePosition: 'bottom-left',
      chipPosition: 'top-right',
      qrPosition: 'bottom-right',
      showChip: true,
      showQrCode: false,
      primaryTextSize: 19,
      secondaryTextSize: 9,
      brandSize: 14,
      qrSize: 56,
      textColor: '#FDF166',
      artworkUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      artworkOpacity: 35,
      artworkZoom: 115,
      artworkPosX: 0,
      artworkPosY: 0,
      nameOffsetX: 0,
      nameOffsetY: 0,
      brandOffsetX: 0,
      brandOffsetY: 0,
      qrOffsetX: 0,
      qrOffsetY: 0,
      isPlain: false,
      customNote: 'Custom Anodized Navy Alloy',
    },
    backSide: {
      topLabel: 'MALHOTRA & CO.',
      bottomLabel: 'UID: TAP-10893-NVY',
      primaryText: 'TAP PHONE OR SCAN TO CONNECT',
      secondaryText: 'tapping.bio/vikram',
      fontFamily: "'Cinzel', serif",
      brandPosition: 'top-left',
      namePosition: 'bottom-left',
      chipPosition: 'hidden',
      qrPosition: 'bottom-right',
      showChip: false,
      showQrCode: true,
      primaryTextSize: 13,
      secondaryTextSize: 11,
      brandSize: 13,
      qrSize: 64,
      textColor: '#FDF166',
      customNote: 'Encrypted NTAG216 Chip • 888 Bytes',
      isPlain: false,
      artworkUrl: '',
      artworkOpacity: 85,
      artworkZoom: 100,
      artworkPosX: 0,
      artworkPosY: 0,
    },
    shippingAddress: {
      name: 'Vikram Malhotra',
      street: 'Tower B, Suite 1104, One Horizon Center, Golf Course Road',
      city: 'Gurugram',
      state: 'Haryana',
      zip: '122002',
      country: 'India',
    },
  },
  {
    id: 'ord_10892',
    orderNumber: 'TAP-10892',
    userId: 'usr_001',
    userName: 'Aarav Sharma',
    userEmail: 'aarav@tapping.bio',
    userPhone: '+91 98765 43210',
    material: 'matte_black',
    engravedName: 'AARAV SHARMA',
    engravedTagline: 'FOUNDER & ARCHITECT',
    qrUrl: 'https://tapping.bio/aarav',
    status: 'in_production',
    trackingNumber: 'DEL-9482110',
    shippingCarrier: 'Delhivery Surface Pro',
    amount: 1499,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    createdAt: '2026-10-24T12:30:00Z',
    sideMode: 'double_sided',
    notes: 'High-contrast matte white laser etch on aerospace matte black steel.',
    frontSide: {
      topLabel: 'TAPPING',
      bottomLabel: 'NFC 13.56MHz • TAP-IN-9482',
      primaryText: 'AARAV SHARMA',
      secondaryText: 'FOUNDER & ARCHITECT',
      fontFamily: "'Space Mono', monospace",
      brandPosition: 'top-left',
      namePosition: 'bottom-left',
      chipPosition: 'top-right',
      qrPosition: 'bottom-right',
      showChip: true,
      showQrCode: false,
      primaryTextSize: 18,
      secondaryTextSize: 9,
      brandSize: 13,
      qrSize: 56,
      textColor: '#FFFFFF',
      artworkUrl: '',
      artworkOpacity: 90,
      artworkZoom: 100,
      artworkPosX: 0,
      artworkPosY: 0,
      nameOffsetX: 0,
      nameOffsetY: 0,
      brandOffsetX: 0,
      brandOffsetY: 0,
      qrOffsetX: 0,
      qrOffsetY: 0,
      isPlain: false,
      customNote: '',
    },
    backSide: {
      topLabel: 'TAPPING',
      bottomLabel: 'UID: TAP-9482-BLK',
      primaryText: 'TAP ANY PHONE TO CONNECT',
      secondaryText: 'tapping.bio/aarav',
      fontFamily: "'Space Mono', monospace",
      brandPosition: 'top-left',
      namePosition: 'bottom-left',
      chipPosition: 'hidden',
      qrPosition: 'bottom-right',
      showChip: false,
      showQrCode: true,
      primaryTextSize: 13,
      secondaryTextSize: 11,
      brandSize: 13,
      qrSize: 64,
      textColor: '#FFFFFF',
      customNote: 'ISO 14443A • NTAG216 Chip • Bengaluru Workshop',
      isPlain: false,
      artworkUrl: '',
      artworkOpacity: 85,
      artworkZoom: 100,
      artworkPosX: 0,
      artworkPosY: 0,
    },
    shippingAddress: {
      name: 'Aarav Sharma',
      street: 'Flat 402, Skyline Residency, 100ft Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      zip: '560038',
      country: 'India',
    },
  },
  {
    id: 'ord_10891',
    orderNumber: 'TAP-10891',
    userId: 'usr_002',
    userName: 'Priya Patel',
    userEmail: 'priya.patel@designstudio.in',
    userPhone: '+91 98234 56789',
    material: 'brushed_gold',
    engravedName: 'PRIYA PATEL',
    engravedTagline: 'PRINCIPAL UX DIRECTOR',
    qrUrl: 'https://tapping.bio/priya',
    status: 'shipped',
    trackingNumber: 'BLUEDART-882910',
    shippingCarrier: 'BlueDart Air Apex',
    amount: 1499,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    createdAt: '2026-10-22T09:15:00Z',
    sideMode: 'double_sided',
    notes: 'Deep obsidian laser mark on 24K brushed brass alloy.',
    frontSide: {
      topLabel: 'STUDIO PATEL',
      bottomLabel: 'NFC 13.56MHz • TAP-IN-10891',
      primaryText: 'PRIYA PATEL',
      secondaryText: 'PRINCIPAL UX DIRECTOR',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      brandPosition: 'top-left',
      namePosition: 'bottom-left',
      chipPosition: 'top-right',
      qrPosition: 'bottom-right',
      showChip: true,
      showQrCode: false,
      primaryTextSize: 18,
      secondaryTextSize: 9,
      brandSize: 13,
      qrSize: 56,
      textColor: '#1C1917',
      artworkUrl: '',
      artworkOpacity: 90,
      artworkZoom: 100,
      artworkPosX: 0,
      artworkPosY: 0,
      isPlain: false,
    },
    backSide: {
      topLabel: 'STUDIO PATEL',
      bottomLabel: 'UID: TAP-10891-GLD',
      primaryText: 'SCAN OR TAP TO CONNECT',
      secondaryText: 'tapping.bio/priya',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      brandPosition: 'top-left',
      namePosition: 'bottom-left',
      chipPosition: 'hidden',
      qrPosition: 'bottom-right',
      showChip: false,
      showQrCode: true,
      primaryTextSize: 13,
      secondaryTextSize: 11,
      brandSize: 13,
      qrSize: 64,
      textColor: '#1C1917',
      customNote: 'Bespoke Milled 24K Finish',
      isPlain: false,
    },
    shippingAddress: {
      name: 'Priya Patel',
      street: '12B, Palm Grove Avenue, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '400050',
      country: 'India',
    },
  },
  {
    id: 'ord_10890',
    orderNumber: 'TAP-10890',
    userId: 'usr_003',
    userName: 'Rohit Verma',
    userEmail: 'rohit.beats@indieaudio.co',
    userPhone: '+91 97112 34567',
    material: 'titanium_silver',
    engravedName: 'ROHIT VERMA',
    engravedTagline: 'AUDIO PRODUCER',
    qrUrl: 'https://tapping.bio/rohit',
    status: 'delivered',
    trackingNumber: 'DEL-8819201',
    shippingCarrier: 'Delhivery Express',
    amount: 1499,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'COD',
    createdAt: '2026-10-15T15:45:00Z',
    sideMode: 'single_sided',
    notes: 'Single-sided laser pass. Front side has QR code and logo; back side is plain brushed titanium.',
    frontSide: {
      topLabel: 'INDIE AUDIO',
      bottomLabel: 'NFC 13.56MHz • TAP-IN-10890',
      primaryText: 'ROHIT VERMA',
      secondaryText: 'AUDIO PRODUCER',
      fontFamily: "'Space Grotesk', sans-serif",
      brandPosition: 'top-left',
      namePosition: 'bottom-left',
      chipPosition: 'top-right',
      qrPosition: 'bottom-right',
      showChip: true,
      showQrCode: true,
      primaryTextSize: 18,
      secondaryTextSize: 9,
      brandSize: 13,
      qrSize: 56,
      textColor: '#0F172A',
      isPlain: false,
    },
    backSide: {
      topLabel: 'INDIE AUDIO',
      bottomLabel: '',
      primaryText: '',
      secondaryText: '',
      fontFamily: "'Space Grotesk', sans-serif",
      showChip: false,
      showQrCode: false,
      textColor: '#0F172A',
      customNote: '',
      isPlain: true,
    },
    shippingAddress: {
      name: 'Rohit Verma',
      street: 'Block C, Sector 15',
      city: 'Gurugram',
      state: 'Haryana',
      zip: '122001',
      country: 'India',
    },
  },
  {
    id: 'ord_10889',
    orderNumber: 'TAP-10889',
    userId: 'usr_004',
    userName: 'Aanya Sen',
    userEmail: 'aanya.pottery@studio.in',
    userPhone: '+91 96123 45678',
    material: 'rose_gold',
    engravedName: 'AANYA SEN',
    engravedTagline: 'STUDIO CERAMICIST',
    qrUrl: 'https://tapping.bio/aanya',
    status: 'delivered',
    trackingNumber: 'BLUEDART-772911',
    shippingCarrier: 'BlueDart Air Apex',
    amount: 1499,
    currency: 'INR',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    createdAt: '2026-10-10T11:20:00Z',
    sideMode: 'double_sided',
    notes: 'Delicate hairline laser etching on satin champagne rose gold.',
    frontSide: {
      topLabel: 'AANYA CERAMICS',
      bottomLabel: 'NFC 13.56MHz • TAP-IN-10889',
      primaryText: 'AANYA SEN',
      secondaryText: 'STUDIO CERAMICIST',
      fontFamily: "'Playfair Display', serif",
      brandPosition: 'top-left',
      namePosition: 'bottom-left',
      chipPosition: 'top-right',
      qrPosition: 'bottom-right',
      showChip: true,
      showQrCode: false,
      primaryTextSize: 18,
      secondaryTextSize: 9,
      brandSize: 13,
      qrSize: 56,
      textColor: '#1C1917',
      isPlain: false,
    },
    backSide: {
      topLabel: 'AANYA CERAMICS',
      bottomLabel: 'UID: TAP-10889-ROSE',
      primaryText: 'CONNECT TO VIEW GALLERY',
      secondaryText: 'tapping.bio/aanya',
      fontFamily: "'Playfair Display', serif",
      brandPosition: 'top-left',
      namePosition: 'bottom-left',
      chipPosition: 'hidden',
      qrPosition: 'bottom-right',
      showChip: false,
      showQrCode: true,
      primaryTextSize: 13,
      secondaryTextSize: 11,
      brandSize: 13,
      qrSize: 64,
      textColor: '#1C1917',
      customNote: 'Handmade Studio Objects',
      isPlain: false,
    },
    shippingAddress: {
      name: 'Aanya Sen',
      street: 'Plot 88, Whitefield Main Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zip: '560066',
      country: 'India',
    },
  },
];

const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay_001',
    userId: 'usr_001',
    userEmail: 'aarav@tapping.bio',
    amount: 2999,
    currency: 'INR',
    type: 'subscription_yearly',
    status: 'succeeded',
    method: 'UPI',
    transactionRef: 'upi_ref_99281749',
    createdAt: '2026-01-15T10:35:00Z',
    planName: 'Pro Annual Membership',
  },
  {
    id: 'pay_002',
    userId: 'usr_001',
    userEmail: 'aarav@tapping.bio',
    amount: 1499,
    currency: 'INR',
    type: 'metal_card',
    status: 'succeeded',
    method: 'UPI',
    transactionRef: 'upi_ref_99281982',
    createdAt: '2026-10-24T12:31:00Z',
    planName: 'Matte Stealth Black NFC Hardware',
  },
  {
    id: 'pay_003',
    userId: 'usr_002',
    userEmail: 'priya.patel@designstudio.in',
    amount: 299,
    currency: 'INR',
    type: 'subscription_monthly',
    status: 'succeeded',
    method: 'Card',
    transactionRef: 'card_ref_88291024',
    createdAt: '2026-10-10T14:21:00Z',
    planName: 'Pro Monthly Membership',
  },
  {
    id: 'pay_004',
    userId: 'usr_002',
    userEmail: 'priya.patel@designstudio.in',
    amount: 1499,
    currency: 'INR',
    type: 'metal_card',
    status: 'succeeded',
    method: 'NetBanking',
    transactionRef: 'nb_ref_77281093',
    createdAt: '2026-10-22T09:16:00Z',
    planName: '24K Brushed Gold NFC Hardware',
  },
  {
    id: 'pay_005',
    userId: 'usr_003',
    userEmail: 'rohit.beats@indieaudio.co',
    amount: 2999,
    currency: 'INR',
    type: 'subscription_yearly',
    status: 'succeeded',
    method: 'UPI',
    transactionRef: 'upi_ref_66192837',
    createdAt: '2026-03-01T09:12:00Z',
    planName: 'Pro Annual Membership',
  },
];

// ==========================================
// USER MANAGEMENT STORAGE METHODS
// ==========================================

export function getStoredUsers(): UserRecord[] {
  if (typeof window === 'undefined') return INITIAL_USERS;
  try {
    const data = localStorage.getItem(KEYS.USERS);
    if (!data) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function saveStoredUsers(users: UserRecord[]): void {
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
    avatarUrl: newUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
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

    // If updating the active user (aarav/profile), also sync to active profile
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
  const target = users.find((u) => u.id === userId);
  if (target) {
    target.status = target.status === 'active' ? 'blocked' : 'active';
    saveStoredUsers(users);
    return target.status === 'blocked';
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
  if (typeof window === 'undefined') return INITIAL_ORDERS;
  try {
    const data = localStorage.getItem(KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all loaded orders have full frontSide/backSide blueprint models
      return parsed.map((order: MetalCardOrder) => enrichOrderBlueprint(order));
    }
    return INITIAL_ORDERS;
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveStoredOrders(orders: MetalCardOrder[]): void {
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
  const seqNum = 10893 + orders.length;
  const orderNumber = `TAP-${seqNum}`;
  const isCod = orderData.paymentMethod === 'COD';

  const newOrder: MetalCardOrder = {
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
    amount: 1499,
    currency: 'INR',
    paymentStatus: isCod ? 'pending' : 'paid',
    paymentMethod: orderData.paymentMethod || 'UPI',
    createdAt: new Date().toISOString(),
    shippingAddress: orderData.shippingAddress || {
      name: orderData.userName || 'Creator',
      street: '100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zip: '560038',
      country: 'India',
    },
    ...orderData,
  };
  orders.unshift(newOrder);
  saveStoredOrders(orders);

  // Also record payment transaction
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
  if (typeof window === 'undefined') return INITIAL_PAYMENTS;
  try {
    const data = localStorage.getItem(KEYS.PAYMENTS);
    if (!data) {
      localStorage.setItem(KEYS.PAYMENTS, JSON.stringify(INITIAL_PAYMENTS));
      return INITIAL_PAYMENTS;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_PAYMENTS;
  } catch {
    return INITIAL_PAYMENTS;
  }
}

export function saveStoredPayments(payments: PaymentRecord[]): void {
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
// ADMIN AUTHENTICATION & SESSION
// ==========================================

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(KEYS.ADMIN_SESSION);
    if (!data) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveAdminSession(session: AdminSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify(session));
  } catch (e) {
    console.error('Error saving admin session', e);
  }
}

export function clearAdminSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.ADMIN_SESSION);
}

export function verifyAdminCredentials(email: string, pin: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPin = pin.trim();
  // Standard superuser or admin email with pin
  if ((cleanEmail === 'admin@tapping.bio' || cleanEmail.includes('admin')) && 
      (cleanPin === 'tapping2026' || cleanPin === 'admin123' || cleanPin === '0000')) {
    return true;
  }
  // Allow developer master override
  if (cleanPin === 'tapping2026') return true;
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
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem(KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSystemSettings(settings: SystemSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

