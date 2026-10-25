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
    return data ? JSON.parse(data) : initialLinks;
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
    return {
      ...initialAnalytics,
      ...parsed,
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
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
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
        isActive: true,
        sortOrder: 1,
        clickCount: 890,
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

const INITIAL_ORDERS: MetalCardOrder[] = [
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
    createdAt: '2026-10-24T12:30:00Z',
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
    createdAt: '2026-10-22T09:15:00Z',
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
    engravedTagline: 'MUSIC PRODUCER',
    qrUrl: 'https://tapping.bio/rohit',
    status: 'delivered',
    trackingNumber: 'DEL-8819201',
    shippingCarrier: 'Delhivery Express',
    amount: 1499,
    currency: 'INR',
    paymentStatus: 'paid',
    createdAt: '2026-10-15T15:45:00Z',
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
    createdAt: '2026-10-10T11:20:00Z',
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
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ORDERS;
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
  const newOrder: MetalCardOrder = {
    id: `ord_${Date.now()}`,
    orderNumber,
    userId: orderData.userId || 'usr_001',
    userName: orderData.userName || 'Creator',
    userEmail: orderData.userEmail || 'creator@tapping.bio',
    userPhone: orderData.userPhone || '+91 98765 43210',
    material: orderData.material || 'matte_black',
    engravedName: orderData.engravedName || 'TAPPING CREATOR',
    engravedTagline: orderData.engravedTagline || 'DIGITAL BUSINESS CARD',
    qrUrl: orderData.qrUrl || 'https://tapping.bio',
    status: 'pending',
    trackingNumber: `DEL-${Math.floor(1000000 + Math.random() * 9000000)}`,
    shippingCarrier: 'Delhivery Surface Pro',
    amount: 1499,
    currency: 'INR',
    paymentStatus: 'paid',
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
    status: 'succeeded',
    method: 'UPI',
    planName: `Metal NFC Card (${newOrder.material.replace('_', ' ').toUpperCase()})`,
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

