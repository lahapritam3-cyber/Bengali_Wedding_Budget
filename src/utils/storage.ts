import type { SavedEstimate, AppSettings, WeddingStyle } from '../types';

const ESTIMATES_KEY = 'bengali-wedding-estimates';
const SETTINGS_KEY  = 'bengali-wedding-settings';

export function getSavedEstimates(): SavedEstimate[] {
  try {
    const raw = localStorage.getItem(ESTIMATES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveEstimate(estimate: SavedEstimate): void {
  const existing = getSavedEstimates();
  const updated = [estimate, ...existing.filter((e) => e.id !== estimate.id)];
  localStorage.setItem(ESTIMATES_KEY, JSON.stringify(updated));
}

export function deleteEstimate(id: string): void {
  const existing = getSavedEstimates();
  localStorage.setItem(ESTIMATES_KEY, JSON.stringify(existing.filter((e) => e.id !== id)));
}

export function clearAllEstimates(): void {
  localStorage.removeItem(ESTIMATES_KEY);
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  colorTheme: 'crimson',
  defaultStyle: 'midrange',
  venueType: 'banquet',
  cateringStyle: 'traditional',
  guestAccommodation: 'none',
  floralTheme: 'traditional',
  defaultCeremonies: ['gaye_holud', 'bou_bhaat'],
  defaultSeason: 'winter',
};

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch { return DEFAULT_SETTINGS; }
}

export function saveSettings(settings: AppSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function generateId(): string {
  return `est-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
