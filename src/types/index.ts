export type WeddingStyle = 'simple' | 'midrange' | 'grand';
export type AuthProvider = 'google' | 'facebook' | 'github' | 'apple' | 'email' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: AuthProvider;
  loginAt: string;
  isGuest: boolean;
}
export type LocationKey = 'kolkata' | 'mumbai' | 'delhi' | 'bangalore' | 'chennai' | 'hyderabad' | 'pune' | 'other';
export type Theme = 'light' | 'dark' | 'system';
export type Screen = 'home' | 'input' | 'result' | 'saved' | 'settings';
export type Season = 'peak' | 'winter' | 'summer' | 'monsoon';
export type VenueType = 'banquet' | 'outdoor' | 'hotel' | 'destination' | 'home';
export type CateringStyle = 'traditional' | 'multicuisine' | 'international';
export type AccommodationType = 'none' | 'budget' | 'premium';
export type FloralTheme = 'simple' | 'traditional' | 'luxury';
export type ColorTheme = 'crimson' | 'saffron' | 'emerald' | 'royal';
export type CeremonyKey =
  | 'gaye_holud'
  | 'sangeet'
  | 'mehendi'
  | 'bou_bhaat'
  | 'ashirwad'
  | 'boat_wedding';

export interface FormData {
  guests: number;
  style: WeddingStyle;
  location: LocationKey;
  days: number;
  season: Season;
  ceremonies: CeremonyKey[];
  additionalRequirements: string;
}

export interface BudgetBreakdown {
  catering: number;
  venue: number;
  decoration: number;
  photography: number;
  attire: number;
  makeup: number;
  music: number;
  transportation: number;
  invitations: number;
  rituals: number;
  miscellaneous: number;
  ceremonies: number;
  accommodation: number;
}

export interface CalculationResult {
  total: number;
  breakdown: BudgetBreakdown;
  formData: FormData;
  calculatedAt: string;
}

export interface SavedEstimate extends CalculationResult {
  id: string;
  name: string;
}

export interface AppSettings {
  theme: Theme;
  colorTheme: ColorTheme;
  defaultStyle: WeddingStyle;
  venueType: VenueType;
  cateringStyle: CateringStyle;
  guestAccommodation: AccommodationType;
  floralTheme: FloralTheme;
  defaultCeremonies: CeremonyKey[];
  defaultSeason: Season;
}
