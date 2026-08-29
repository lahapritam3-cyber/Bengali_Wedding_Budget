import type {
  AppSettings, WeddingStyle, Theme, VenueType,
  CateringStyle, AccommodationType, FloralTheme, ColorTheme, Season, CeremonyKey,
} from '../types';
import {
  STYLE_CONFIGS, VENUE_CONFIGS, CATERING_CONFIGS,
  ACCOMMODATION_CONFIGS, FLORAL_CONFIGS, SEASON_CONFIGS, CEREMONY_CONFIGS,
} from '../config/budgetConfig';
import { DEFAULT_SETTINGS } from '../utils/storage';

import type { User } from '../types';
import { getInitials } from '../utils/auth';

interface SettingsScreenProps {
  settings: AppSettings;
  user?: User | null;
  onUpdate: (settings: AppSettings) => void;
  onClearData: () => void;
  onSignOut?: () => void;
  onBack: () => void;
}

const THEMES: { value: Theme; label: string; icon: string }[] = [
  { value: 'light', label: 'Light', icon: '☀️' },
  { value: 'dark',  label: 'Dark',  icon: '🌙' },
  { value: 'system',label: 'System',icon: '💻' },
];

const COLOR_THEMES: { value: ColorTheme; label: string; primary: string; accent: string }[] = [
  { value: 'crimson', label: 'Crimson & Gold',   primary: '#8B1A2B', accent: '#C8920A' },
  { value: 'saffron', label: 'Saffron & Ivory',   primary: '#C2410C', accent: '#D4A017' },
  { value: 'emerald', label: 'Emerald & Gold',    primary: '#065F46', accent: '#D4A017' },
  { value: 'royal',   label: 'Royal Blue & Gold', primary: '#1E3A8A', accent: '#C8920A' },
];

export default function SettingsScreen({ settings, user, onUpdate, onClearData, onSignOut, onBack }: SettingsScreenProps) {
  function set<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    onUpdate({ ...settings, [key]: value });
  }

  function toggleDefaultCeremony(key: CeremonyKey) {
    const current = settings.defaultCeremonies;
    const next = current.includes(key) ? current.filter((c) => c !== key) : [...current, key];
    set('defaultCeremonies', next);
  }

  return (
    <div className="min-h-full" style={{ background: '#FDF8F0' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-4 px-4 py-4 sm:px-6 border-b" style={{ background: '#FDF8F0', borderColor: '#E8D5B0' }}>
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: '#F0E8D8', color: '#8B1A2B' }}>←</button>
        <h2 className="font-display font-bold text-xl" style={{ color: '#8B1A2B' }}>Settings</h2>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 space-y-5 pb-28">

        {/* ── Account ── */}
        {user && (
          <SettingsCard title="Account" icon="👤">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold shrink-0"
                style={{ background: '#8B1A2B', color: '#FFFDF8' }}>
                {getInitials(user.name)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold" style={{ color: '#2C1810' }}>{user.name}</div>
                <div className="text-xs" style={{ color: '#8B7355' }}>{user.email}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize font-medium"
                    style={{ background: user.isGuest ? '#F0E8D8' : 'rgba(139,26,43,0.08)', color: user.isGuest ? '#8B7355' : '#8B1A2B' }}>
                    {user.isGuest ? 'Guest' : `via ${user.provider}`}
                  </span>
                  {user.isGuest && (
                    <span className="text-xs" style={{ color: '#8B7355' }}>— sign in for cross-device sync</span>
                  )}
                </div>
              </div>
            </div>
            {onSignOut && (
              <button onClick={() => { if (window.confirm('Sign out?')) onSignOut(); }}
                className="w-full py-2.5 rounded-xl text-sm font-medium border transition-colors"
                style={{ borderColor: '#DC2626', color: '#DC2626', background: 'transparent' }}>
                Sign Out
              </button>
            )}
          </SettingsCard>
        )}

        {/* ── Appearance ── */}
        <SettingsCard title="Appearance" icon="🎨">
          <SettingsRow label="Theme">
            <div className="flex gap-2">
              {THEMES.map(({ value, label, icon }) => (
                <OptionPill key={value} label={label} icon={icon} selected={settings.theme === value}
                  onClick={() => set('theme', value)} />
              ))}
            </div>
          </SettingsRow>

          <SettingsRow label="Color Theme">
            <div className="grid grid-cols-2 gap-2">
              {COLOR_THEMES.map(({ value, label, primary, accent }) => (
                <button key={value} onClick={() => set('colorTheme', value)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-sm font-medium"
                  style={{
                    borderColor: settings.colorTheme === value ? primary : '#E8D5B0',
                    background: settings.colorTheme === value ? `rgba(${hexToRgb(primary)},0.06)` : '#FFFDF8',
                    color: settings.colorTheme === value ? primary : '#5C3A1E',
                  }}>
                  <div className="flex gap-1 shrink-0">
                    <div className="w-3 h-3 rounded-full" style={{ background: primary }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: accent }} />
                  </div>
                  {label}
                </button>
              ))}
            </div>
          </SettingsRow>
        </SettingsCard>

        {/* ── Estimation Defaults ── */}
        <SettingsCard title="Estimation Defaults" icon="💍">
          <SettingsRow label="Default Wedding Style">
            <div className="flex gap-2">
              {(Object.entries(STYLE_CONFIGS) as [WeddingStyle, typeof STYLE_CONFIGS[WeddingStyle]][]).map(([key, cfg]) => (
                <OptionPill key={key} label={cfg.label} icon={cfg.emoji}
                  selected={settings.defaultStyle === key} onClick={() => set('defaultStyle', key)} />
              ))}
            </div>
          </SettingsRow>

          <SettingsRow label="Default Season">
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(SEASON_CONFIGS) as [Season, typeof SEASON_CONFIGS[Season]][]).map(([key, cfg]) => (
                <button key={key} onClick={() => set('defaultSeason', key)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-all"
                  style={{
                    borderColor: settings.defaultSeason === key ? '#C8920A' : '#E8D5B0',
                    background: settings.defaultSeason === key ? '#FFF8E7' : '#FFFDF8',
                    color: settings.defaultSeason === key ? '#8B1A2B' : '#5C3A1E',
                  }}>
                  <span>{cfg.emoji}</span> {cfg.label}
                </button>
              ))}
            </div>
          </SettingsRow>
        </SettingsCard>

        {/* ── Wedding Theme (affects budget calculation) ── */}
        <SettingsCard title="Wedding Theme & Preferences" icon="🌸">
          <p className="text-xs mb-4 px-1" style={{ color: '#8B7355' }}>
            These preferences are applied to all new estimates as default values.
          </p>

          <SettingsRow label="Venue Type">
            <div className="grid grid-cols-1 gap-2">
              {(Object.entries(VENUE_CONFIGS) as [VenueType, typeof VENUE_CONFIGS[VenueType]][]).map(([key, cfg]) => {
                const sel = settings.venueType === key;
                return (
                  <button key={key} onClick={() => set('venueType', key)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-all text-left"
                    style={{ borderColor: sel ? '#8B1A2B' : '#E8D5B0', background: sel ? 'rgba(139,26,43,0.05)' : '#FFFDF8', color: sel ? '#8B1A2B' : '#5C3A1E' }}>
                    <span className="text-xl">{cfg.emoji}</span>
                    <div className="flex-1">
                      <span className="font-medium">{cfg.label}</span>
                      <span className="ml-2 text-xs" style={{ color: '#8B7355' }}>
                        Venue ×{cfg.venueMultiplier.toFixed(1)}, Décor ×{cfg.decoMultiplier.toFixed(1)}
                      </span>
                    </div>
                    {sel && <span style={{ color: '#8B1A2B' }}>✓</span>}
                  </button>
                );
              })}
            </div>
          </SettingsRow>

          <SettingsRow label="Catering Style">
            <div className="grid grid-cols-1 gap-2">
              {(Object.entries(CATERING_CONFIGS) as [CateringStyle, typeof CATERING_CONFIGS[CateringStyle]][]).map(([key, cfg]) => {
                const sel = settings.cateringStyle === key;
                return (
                  <button key={key} onClick={() => set('cateringStyle', key)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-all text-left"
                    style={{ borderColor: sel ? '#8B1A2B' : '#E8D5B0', background: sel ? 'rgba(139,26,43,0.05)' : '#FFFDF8', color: sel ? '#8B1A2B' : '#5C3A1E' }}>
                    <span className="text-xl">{cfg.emoji}</span>
                    <span className="flex-1 font-medium">{cfg.label}</span>
                    <span className="text-xs font-bold" style={{ color: cfg.perGuestMultiplier > 1 ? '#DC2626' : '#059669' }}>
                      ×{cfg.perGuestMultiplier.toFixed(2)} per guest
                    </span>
                  </button>
                );
              })}
            </div>
          </SettingsRow>

          <SettingsRow label="Guest Accommodation">
            <div className="grid grid-cols-1 gap-2">
              {(Object.entries(ACCOMMODATION_CONFIGS) as [AccommodationType, typeof ACCOMMODATION_CONFIGS[AccommodationType]][]).map(([key, cfg]) => {
                const sel = settings.guestAccommodation === key;
                return (
                  <button key={key} onClick={() => set('guestAccommodation', key)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-all text-left"
                    style={{ borderColor: sel ? '#0D9488' : '#E8D5B0', background: sel ? 'rgba(13,148,136,0.05)' : '#FFFDF8', color: sel ? '#0D9488' : '#5C3A1E' }}>
                    <span className="text-xl">{cfg.emoji}</span>
                    <span className="flex-1 font-medium">{cfg.label}</span>
                    {cfg.costPerGuest > 0 && (
                      <span className="text-xs" style={{ color: '#8B7355' }}>₹{cfg.costPerGuest.toLocaleString('en-IN')}/guest</span>
                    )}
                  </button>
                );
              })}
            </div>
          </SettingsRow>

          <SettingsRow label="Floral Theme">
            <div className="flex gap-2">
              {(Object.entries(FLORAL_CONFIGS) as [FloralTheme, typeof FLORAL_CONFIGS[FloralTheme]][]).map(([key, cfg]) => {
                const sel = settings.floralTheme === key;
                return (
                  <button key={key} onClick={() => set('floralTheme', key)}
                    className="flex-1 py-3 rounded-xl border text-center text-sm font-medium transition-all"
                    style={{ borderColor: sel ? '#E8841A' : '#E8D5B0', background: sel ? 'rgba(232,132,26,0.08)' : '#FFFDF8', color: sel ? '#E8841A' : '#5C3A1E' }}>
                    <div className="text-xl mb-1">{cfg.emoji}</div>
                    {cfg.label}
                    <div className="text-xs mt-0.5" style={{ color: '#8B7355' }}>×{cfg.decoMultiplier.toFixed(2)}</div>
                  </button>
                );
              })}
            </div>
          </SettingsRow>

          <SettingsRow label="Default Ceremonies">
            <div className="grid grid-cols-1 gap-2">
              {(Object.entries(CEREMONY_CONFIGS) as [CeremonyKey, typeof CEREMONY_CONFIGS[CeremonyKey]][]).map(([key, cfg]) => {
                const sel = settings.defaultCeremonies.includes(key);
                return (
                  <button key={key} onClick={() => toggleDefaultCeremony(key)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-all text-left"
                    style={{ borderColor: sel ? '#9333EA' : '#E8D5B0', background: sel ? 'rgba(147,51,234,0.06)' : '#FFFDF8' }}>
                    <span className="text-xl">{cfg.emoji}</span>
                    <div className="flex-1">
                      <div className="font-medium" style={{ color: sel ? '#9333EA' : '#2C1810' }}>{cfg.label}</div>
                      <div className="text-xs" style={{ color: '#8B7355' }}>{cfg.description}</div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: sel ? '#9333EA' : '#E8D5B0', background: sel ? '#9333EA' : 'transparent' }}>
                      {sel && <span className="text-white text-xs font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </SettingsRow>
        </SettingsCard>

        {/* ── Data ── */}
        <SettingsCard title="Data Management" icon="💾">
          <button
            onClick={() => { if (window.confirm('Delete all saved estimates? This cannot be undone.')) onClearData(); }}
            className="w-full py-3 rounded-xl text-sm font-medium border transition-colors"
            style={{ borderColor: '#DC2626', color: '#DC2626', background: 'transparent' }}>
            Clear All Saved Estimates
          </button>
          <button
            onClick={() => { if (window.confirm('Reset all settings to defaults?')) onUpdate(DEFAULT_SETTINGS); }}
            className="w-full py-3 rounded-xl text-sm font-medium border mt-2 transition-colors"
            style={{ borderColor: '#E8D5B0', color: '#8B7355', background: 'transparent' }}>
            Reset Settings to Defaults
          </button>
        </SettingsCard>

        {/* ── About ── */}
        <SettingsCard title="About" icon="ℹ️">
          {[
            ['App', 'Bengali Wedding Budget Estimator'],
            ['Version', '2.0.0'],
            ['Categories', '13 expense categories'],
            ['Cities', '8 city multipliers'],
            ['Ceremonies', '6 special ceremonies'],
            ['Pricing config', 'src/config/budgetConfig.ts'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm py-1">
              <span style={{ color: '#8B7355' }}>{label}</span>
              <span style={{ color: '#2C1810' }}>{value}</span>
            </div>
          ))}
          <p className="text-xs pt-3 border-t mt-2" style={{ color: '#8B7355', borderColor: '#E8D5B0' }}>
            All pricing rules are centralized in <code>budgetConfig.ts</code> — update once, reflects everywhere.
          </p>
        </SettingsCard>

      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function SettingsCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFDF8', borderColor: '#E8D5B0' }}>
      <div className="flex items-center gap-2 px-5 py-3.5 border-b" style={{ borderColor: '#E8D5B0', background: '#FDF8F0' }}>
        <span className="text-base">{icon}</span>
        <h3 className="font-display font-semibold text-sm" style={{ color: '#2C1810' }}>{title}</h3>
      </div>
      <div className="px-5 py-4 space-y-5">{children}</div>
    </div>
  );
}

function SettingsRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: '#8B7355' }}>{label}</p>
      {children}
    </div>
  );
}

function OptionPill({ label, icon, selected, onClick }: { label: string; icon: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors text-center"
      style={{
        borderColor: selected ? '#8B1A2B' : '#E8D5B0',
        background: selected ? 'rgba(139,26,43,0.06)' : 'transparent',
        color: selected ? '#8B1A2B' : '#5C3A1E',
      }}>
      <div className="text-base mb-0.5">{icon}</div>
      {label}
    </button>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
