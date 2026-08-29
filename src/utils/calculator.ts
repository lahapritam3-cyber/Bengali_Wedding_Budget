import {
  STYLE_CONFIGS, LOCATION_CONFIGS, SEASON_CONFIGS,
  VENUE_CONFIGS, CATERING_CONFIGS, ACCOMMODATION_CONFIGS,
  FLORAL_CONFIGS, CEREMONY_CONFIGS,
} from '../config/budgetConfig';
import type { FormData, CalculationResult, BudgetBreakdown, AppSettings } from '../types';

export function calculateBudget(formData: FormData, settings: Partial<AppSettings> = {}): CalculationResult {
  const { guests, style, location, days, season, ceremonies } = formData;
  const styleCfg = STYLE_CONFIGS[style];
  const locationMult = LOCATION_CONFIGS[location]?.multiplier ?? 1.0;
  const seasonMult = SEASON_CONFIGS[season]?.multiplier ?? 1.0;
  const extraDays = Math.max(0, days - 1);

  const venueCfg   = VENUE_CONFIGS[settings.venueType ?? 'banquet'];
  const cateringCfg = CATERING_CONFIGS[settings.cateringStyle ?? 'traditional'];
  const accomCfg   = ACCOMMODATION_CONFIGS[settings.guestAccommodation ?? 'none'];
  const floralCfg  = FLORAL_CONFIGS[settings.floralTheme ?? 'traditional'];

  // Per-guest variable costs
  const catering    = styleCfg.perGuestCosts.catering * cateringCfg.perGuestMultiplier * guests;
  const venue       = styleCfg.perGuestCosts.venue * venueCfg.venueMultiplier * guests;
  const invitations = styleCfg.perGuestCosts.invitations * Math.ceil(guests / 2);

  // Fixed + per-day costs with venue/floral multipliers
  const decorationBase = styleCfg.fixedCosts.decoration * venueCfg.decoMultiplier * floralCfg.decoMultiplier;
  const decoration   = decorationBase + styleCfg.perDayCosts.decoration * extraDays;
  const photography  = styleCfg.fixedCosts.photography + styleCfg.perDayCosts.photography * extraDays;
  const music        = styleCfg.fixedCosts.music + styleCfg.perDayCosts.music * extraDays;
  const rituals      = styleCfg.fixedCosts.rituals + styleCfg.perDayCosts.rituals * extraDays;

  const attire        = styleCfg.fixedCosts.attire;
  const makeup        = styleCfg.fixedCosts.makeup;
  const transportation = styleCfg.fixedCosts.transportation;

  // Special ceremonies
  const ceremoniesTotal = ceremonies.reduce(
    (sum, key) => sum + (CEREMONY_CONFIGS[key]?.baseCost[style] ?? 0), 0
  );

  // Guest accommodation (50% of guests assumed to need rooms)
  const accommodation = accomCfg.costPerGuest * Math.ceil(guests * 0.5);

  const subtotal =
    catering + venue + invitations + decoration + photography +
    attire + makeup + music + transportation + rituals +
    ceremoniesTotal + accommodation;

  const miscellaneous = subtotal * styleCfg.miscPercentage;
  const combined = (subtotal + miscellaneous) * locationMult * seasonMult;
  const total = Math.round(combined);

  const apply = (v: number) => Math.round(v * locationMult * seasonMult);

  const breakdown: BudgetBreakdown = {
    catering:       apply(catering),
    venue:          apply(venue),
    decoration:     apply(decoration),
    photography:    apply(photography),
    attire:         apply(attire),
    makeup:         apply(makeup),
    music:          apply(music),
    transportation: apply(transportation),
    invitations:    apply(invitations),
    rituals:        apply(rituals),
    ceremonies:     apply(ceremoniesTotal),
    accommodation:  apply(accommodation),
    miscellaneous:  apply(miscellaneous),
  };

  return { total, breakdown, formData, calculatedAt: new Date().toISOString() };
}
