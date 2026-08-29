/**
 * BUDGET CONFIGURATION — all pricing rules live here.
 * Change values in this file to update estimates app-wide.
 * Costs are in Indian Rupees (₹).
 */

import type {
  WeddingStyle, LocationKey, Season, VenueType,
  CateringStyle, AccommodationType, FloralTheme, CeremonyKey,
} from '../types';

export interface StyleConfig {
  label: string;
  description: string;
  emoji: string;
  perGuestCosts: {
    catering: number;
    venue: number;
    invitations: number;
  };
  fixedCosts: {
    decoration: number;
    photography: number;
    attire: number;
    makeup: number;
    music: number;
    transportation: number;
    rituals: number;
  };
  perDayCosts: {
    decoration: number;
    photography: number;
    music: number;
    rituals: number;
  };
  miscPercentage: number;
}

export const STYLE_CONFIGS: Record<WeddingStyle, StyleConfig> = {
  simple: {
    label: 'Simple',
    description: 'Intimate & economical — focused on what matters most',
    emoji: '🌸',
    perGuestCosts: { catering: 650, venue: 180, invitations: 18 },
    fixedCosts: {
      decoration: 28000, photography: 35000, attire: 28000,
      makeup: 9000, music: 12000, transportation: 15000, rituals: 18000,
    },
    perDayCosts: { decoration: 6000, photography: 12000, music: 8000, rituals: 6000 },
    miscPercentage: 0.05,
  },
  midrange: {
    label: 'Mid-range',
    description: 'Balanced elegance — the complete Bengali wedding experience',
    emoji: '🌺',
    perGuestCosts: { catering: 1300, venue: 320, invitations: 28 },
    fixedCosts: {
      decoration: 85000, photography: 85000, attire: 85000,
      makeup: 28000, music: 40000, transportation: 45000, rituals: 35000,
    },
    perDayCosts: { decoration: 18000, photography: 28000, music: 22000, rituals: 12000 },
    miscPercentage: 0.07,
  },
  grand: {
    label: 'Grand',
    description: 'Premium celebration — an unforgettable royal affair',
    emoji: '👑',
    perGuestCosts: { catering: 2800, venue: 700, invitations: 60 },
    fixedCosts: {
      decoration: 220000, photography: 220000, attire: 220000,
      makeup: 85000, music: 120000, transportation: 110000, rituals: 85000,
    },
    perDayCosts: { decoration: 55000, photography: 80000, music: 55000, rituals: 28000 },
    miscPercentage: 0.10,
  },
};

export const LOCATION_CONFIGS: Record<LocationKey, { label: string; multiplier: number }> = {
  kolkata:   { label: 'Kolkata',   multiplier: 1.00 },
  other:     { label: 'Other',     multiplier: 1.00 },
  pune:      { label: 'Pune',      multiplier: 1.12 },
  chennai:   { label: 'Chennai',   multiplier: 1.15 },
  hyderabad: { label: 'Hyderabad', multiplier: 1.18 },
  bangalore: { label: 'Bengaluru', multiplier: 1.22 },
  delhi:     { label: 'Delhi NCR', multiplier: 1.28 },
  mumbai:    { label: 'Mumbai',    multiplier: 1.38 },
};

// Season affects demand-driven pricing (flowers, venues, photographers)
export const SEASON_CONFIGS: Record<Season, { label: string; emoji: string; description: string; multiplier: number }> = {
  peak:    { label: 'Peak Season',    emoji: '🎊', description: 'Nov–Jan · Highest demand', multiplier: 1.18 },
  winter:  { label: 'Winter',         emoji: '❄️',  description: 'Feb–Mar · Popular & pleasant', multiplier: 1.05 },
  summer:  { label: 'Summer',         emoji: '☀️',  description: 'Apr–Jun · Lower demand',  multiplier: 0.88 },
  monsoon: { label: 'Monsoon',        emoji: '🌧️', description: 'Jul–Sep · Best discounts',  multiplier: 0.80 },
};

// Venue type affects base venue cost multiplier and decoration
export const VENUE_CONFIGS: Record<VenueType, { label: string; emoji: string; venueMultiplier: number; decoMultiplier: number }> = {
  banquet:     { label: 'Banquet Hall',    emoji: '🏛️', venueMultiplier: 1.00, decoMultiplier: 1.00 },
  outdoor:     { label: 'Outdoor Garden',  emoji: '🌿', venueMultiplier: 0.90, decoMultiplier: 1.20 },
  hotel:       { label: 'Luxury Hotel',    emoji: '🏨', venueMultiplier: 1.60, decoMultiplier: 1.10 },
  destination: { label: 'Destination',     emoji: '✈️', venueMultiplier: 2.20, decoMultiplier: 1.30 },
  home:        { label: 'Home / Ancestral', emoji: '🏠', venueMultiplier: 0.30, decoMultiplier: 0.85 },
};

// Catering style affects per-guest food cost
export const CATERING_CONFIGS: Record<CateringStyle, { label: string; emoji: string; perGuestMultiplier: number }> = {
  traditional:  { label: 'Traditional Bengali', emoji: '🍚', perGuestMultiplier: 1.00 },
  multicuisine: { label: 'Multi-cuisine',        emoji: '🍽️', perGuestMultiplier: 1.25 },
  international:{ label: 'International Buffet', emoji: '🌍', perGuestMultiplier: 1.65 },
};

// Guest accommodation — flat add-on per guest (× 50% of guests assumed to need rooms)
export const ACCOMMODATION_CONFIGS: Record<AccommodationType, { label: string; emoji: string; costPerGuest: number }> = {
  none:    { label: 'No Accommodation', emoji: '🚶', costPerGuest: 0 },
  budget:  { label: 'Budget Hotels',   emoji: '🏩', costPerGuest: 1200 },
  premium: { label: 'Premium Hotels',  emoji: '🌟', costPerGuest: 3500 },
};

// Floral theme multiplier on decoration costs
export const FLORAL_CONFIGS: Record<FloralTheme, { label: string; emoji: string; decoMultiplier: number }> = {
  simple:     { label: 'Simple Marigold',   emoji: '🌼', decoMultiplier: 1.00 },
  traditional: { label: 'Traditional Florals', emoji: '🌸', decoMultiplier: 1.30 },
  luxury:     { label: 'Luxury Florals',    emoji: '🌹', decoMultiplier: 1.75 },
};

// Additional ceremonies — flat cost added to total (per event, not per guest)
export const CEREMONY_CONFIGS: Record<CeremonyKey, { label: string; emoji: string; description: string; baseCost: Record<WeddingStyle, number> }> = {
  gaye_holud:   {
    label: 'Gaye Holud', emoji: '💛', description: 'Turmeric ceremony — traditional & vibrant',
    baseCost: { simple: 25000, midrange: 65000, grand: 180000 },
  },
  sangeet:      {
    label: 'Sangeet Night', emoji: '🎶', description: 'Music & dance celebration',
    baseCost: { simple: 30000, midrange: 80000, grand: 220000 },
  },
  mehendi:      {
    label: 'Mehendi Ceremony', emoji: '🖐️', description: 'Henna ceremony for the bride',
    baseCost: { simple: 12000, midrange: 30000, grand: 75000 },
  },
  bou_bhaat:   {
    label: 'Bou Bhaat', emoji: '🍱', description: "Bride's first cooking ritual & feast",
    baseCost: { simple: 20000, midrange: 55000, grand: 140000 },
  },
  ashirwad:     {
    label: 'Ashirwad', emoji: '🙏', description: 'Blessing ceremony for newlyweds',
    baseCost: { simple: 15000, midrange: 35000, grand: 85000 },
  },
  boat_wedding: {
    label: 'Boat Wedding', emoji: '⛵', description: 'Scenic river venue (unique to Bengal)',
    baseCost: { simple: 45000, midrange: 120000, grand: 350000 },
  },
};

export const CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  catering:       { label: 'Catering & Food',      icon: '🍽️', color: '#E84057' },
  venue:          { label: 'Venue',                 icon: '🏛️', color: '#C8920A' },
  decoration:     { label: 'Decoration',            icon: '🌸', color: '#E8841A' },
  photography:    { label: 'Photography & Video',   icon: '📸', color: '#7C3AED' },
  attire:         { label: 'Wedding Attire',         icon: '👗', color: '#DB2777' },
  makeup:         { label: 'Makeup & Grooming',     icon: '💄', color: '#059669' },
  music:          { label: 'Music & DJ',             icon: '🎵', color: '#2563EB' },
  transportation: { label: 'Transportation',        icon: '🚗', color: '#D97706' },
  invitations:    { label: 'Invitations',           icon: '💌', color: '#0891B2' },
  rituals:        { label: 'Ritual & Puja',         icon: '🪔', color: '#DC2626' },
  ceremonies:     { label: 'Special Ceremonies',    icon: '🎊', color: '#9333EA' },
  accommodation:  { label: 'Guest Accommodation',   icon: '🏨', color: '#0D9488' },
  miscellaneous:  { label: 'Miscellaneous',         icon: '✨', color: '#6B7280' },
};
