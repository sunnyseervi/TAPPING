import { Profile, VCardProfile, LinkBlock, NFCCardDesign, AnalyticsSummary, Subscription } from './types';
import { initialProfile, initialVCard, initialLinks, initialNFCCard, initialAnalytics, initialSubscription } from './mockData';

const KEYS = {
  PROFILE: 'tapping_profile_v3',
  VCARD: 'tapping_vcard_v3',
  LINKS: 'tapping_links_v3',
  NFC: 'tapping_nfc_v3',
  ANALYTICS: 'tapping_analytics_v3',
  SUBSCRIPTION: 'tapping_sub_v3',
  ONBOARDING_DONE: 'tapping_onboarding_completed_v3',
};

export function getStoredProfile(): Profile {
  if (typeof window === 'undefined') return initialProfile;
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : initialProfile;
  } catch {
    return initialProfile;
  }
}

export function saveStoredProfile(profile: Profile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
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
    return data ? JSON.parse(data) : initialNFCCard;
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
    const target = analytics.topLinks.find((t) => t.title === links.find((l) => l.id === linkId)?.title);
    if (target) {
      target.clicks += 1;
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

export function getOnboardingCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(KEYS.ONBOARDING_DONE) === 'true';
}

export function setOnboardingCompleted(completed: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.ONBOARDING_DONE, completed ? 'true' : 'false');
}

export function resetAllToDefault(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(initialProfile));
  localStorage.setItem(KEYS.VCARD, JSON.stringify(initialVCard));
  localStorage.setItem(KEYS.LINKS, JSON.stringify(initialLinks));
  localStorage.setItem(KEYS.NFC, JSON.stringify(initialNFCCard));
  localStorage.setItem(KEYS.ANALYTICS, JSON.stringify(initialAnalytics));
  localStorage.setItem(KEYS.SUBSCRIPTION, JSON.stringify(initialSubscription));
}
