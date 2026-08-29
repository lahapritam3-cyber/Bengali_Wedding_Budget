import type { LocationKey } from '../types';

// Map common city name substrings to app location keys
const CITY_KEYWORD_MAP: [string[], LocationKey][] = [
  [['kolkata', 'calcutta', 'howrah', 'durgapur', 'asansol', 'siliguri', 'kharagpur'], 'kolkata'],
  [['mumbai', 'bombay', 'thane', 'navi mumbai', 'pune'], 'pune'],
  [['pune', 'pimpri', 'chinchwad'], 'pune'],
  [['delhi', 'new delhi', 'gurgaon', 'gurugram', 'noida', 'faridabad', 'ghaziabad'], 'delhi'],
  [['bangalore', 'bengaluru', 'mysore', 'mysuru', 'mangalore', 'hubli'], 'bangalore'],
  [['chennai', 'madras', 'coimbatore', 'tiruchirappalli', 'madurai'], 'chennai'],
  [['hyderabad', 'secunderabad', 'warangal', 'vijayawada', 'visakhapatnam'], 'hyderabad'],
  [['mumbai', 'bombay', 'thane', 'navi mumbai', 'kalyan'], 'mumbai'],
];

export interface GeolocationResult {
  status: 'idle' | 'detecting' | 'success' | 'error' | 'denied';
  city?: string;
  locationKey?: LocationKey;
  errorMessage?: string;
  lat?: number;
  lon?: number;
}

function matchCity(cityName: string): LocationKey {
  const lower = cityName.toLowerCase();
  for (const [keywords, key] of CITY_KEYWORD_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) return key;
  }
  return 'other';
}

export async function reverseGeocode(lat: number, lon: number): Promise<{ city: string; locationKey: LocationKey }> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'BengaliWeddingBudgetApp/1.0' },
  });
  if (!res.ok) throw new Error('Geocoding service unavailable');
  const data = await res.json();

  const addr = data.address ?? {};
  const city =
    addr.city || addr.town || addr.village || addr.county || addr.state_district || addr.state || 'Unknown';

  return { city, locationKey: matchCity(city) };
}

export function detectGeolocation(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          reject(new Error('DENIED'));
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          reject(new Error('Location unavailable. Try again.'));
        } else {
          reject(new Error('Location request timed out. Try again.'));
        }
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  });
}
