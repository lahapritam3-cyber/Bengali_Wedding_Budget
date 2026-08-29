import { useState, useRef } from 'react';
import type { FormData, WeddingStyle, LocationKey, Season, CeremonyKey, AppSettings } from '../types';
import { STYLE_CONFIGS, LOCATION_CONFIGS, SEASON_CONFIGS, CEREMONY_CONFIGS } from '../config/budgetConfig';
import { detectGeolocation, reverseGeocode } from '../utils/location';

interface InputScreenProps {
  initialData: FormData;
  settings: AppSettings;
  onCalculate: (data: FormData) => void;
  onBack: () => void;
}

type GeoStatus = 'idle' | 'detecting' | 'success' | 'error' | 'denied';

const LOCATIONS = Object.entries(LOCATION_CONFIGS) as [LocationKey, { label: string; multiplier: number }][];

export default function InputScreen({ initialData, settings, onCalculate, onBack }: InputScreenProps) {
  const [form, setForm] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [geoStatus, setGeoStatus] = useState<GeoStatus>('idle');
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const abortRef = useRef(false);

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.guests || form.guests < 1) newErrors.guests = 'Please enter at least 1 guest.';
    if (form.guests > 10000) newErrors.guests = 'Guest count seems too high. Please verify.';
    if (!form.days || form.days < 1) newErrors.days = 'Wedding must be at least 1 day.';
    if (form.days > 7) newErrors.days = 'Maximum 7 wedding days supported.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onCalculate(form);
  }

  function setGuests(val: number) {
    setForm((f) => ({ ...f, guests: Math.max(1, val) }));
    setErrors((e) => ({ ...e, guests: undefined }));
  }

  function setDays(val: number) {
    setForm((f) => ({ ...f, days: Math.min(7, Math.max(1, val)) }));
    setErrors((e) => ({ ...e, days: undefined }));
  }

  function toggleCeremony(key: CeremonyKey) {
    setForm((f) => ({
      ...f,
      ceremonies: f.ceremonies.includes(key)
        ? f.ceremonies.filter((c) => c !== key)
        : [...f.ceremonies, key],
    }));
  }

  async function handleDetectLocation() {
    abortRef.current = false;
    setGeoStatus('detecting');
    setDetectedCity(null);
    try {
      const { lat, lon } = await detectGeolocation();
      if (abortRef.current) return;
      const { city, locationKey } = await reverseGeocode(lat, lon);
      if (abortRef.current) return;
      setDetectedCity(city);
      setForm((f) => ({ ...f, location: locationKey }));
      setGeoStatus('success');
    } catch (err: unknown) {
      if (abortRef.current) return;
      const msg = err instanceof Error ? err.message : String(err);
      setGeoStatus(msg === 'DENIED' ? 'denied' : 'error');
    }
  }

  const primary = '#8B1A2B';

  return (
    <div className="min-h-full" style={{ background: '#FDF8F0' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-4 px-4 py-4 sm:px-6 border-b" style={{ background: '#FDF8F0', borderColor: '#E8D5B0' }}>
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full transition-colors" style={{ background: '#F0E8D8', color: primary }}>←</button>
        <div>
          <h2 className="font-display font-bold text-xl" style={{ color: primary }}>Plan Your Wedding</h2>
          <p className="text-xs" style={{ color: '#8B7355' }}>Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-8 pb-28">

        {/* ── Guest Count ── */}
        <section>
          <SectionLabel>Number of Guests <Required /></SectionLabel>
          <div className="flex items-center gap-4">
            <StepBtn onClick={() => setGuests(form.guests - (form.guests > 50 ? 50 : 10))} label="−" bg="#F0E8D8" color={primary} />
            <input
              type="number"
              value={form.guests || ''}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="flex-1 text-center text-2xl font-bold rounded-xl py-3 border-2"
              style={{ borderColor: errors.guests ? '#DC2626' : '#E8D5B0', background: '#FFFDF8', color: '#2C1810' }}
              min={1} max={10000}
            />
            <StepBtn onClick={() => setGuests(form.guests + (form.guests >= 50 ? 50 : 10))} label="+" bg={primary} color="#FFFDF8" />
          </div>
          {errors.guests && <p className="text-sm mt-2" style={{ color: '#DC2626' }}>{errors.guests}</p>}
          <QuickPills values={[50, 100, 150, 200, 300, 500]} current={form.guests} onSelect={setGuests} primary={primary} />
        </section>

        {/* ── Wedding Style ── */}
        <section>
          <SectionLabel>Wedding Style <Required /></SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.entries(STYLE_CONFIGS) as [WeddingStyle, typeof STYLE_CONFIGS[WeddingStyle]][]).map(([key, cfg]) => {
              const sel = form.style === key;
              return (
                <button key={key} type="button" onClick={() => setForm((f) => ({ ...f, style: key }))}
                  className="rounded-2xl p-4 text-left border-2 transition-all duration-200 card-hover"
                  style={{ borderColor: sel ? primary : '#E8D5B0', background: sel ? `linear-gradient(135deg, ${primary}, #B02238)` : '#FFFDF8' }}>
                  <div className="text-2xl mb-2">{cfg.emoji}</div>
                  <div className="font-semibold text-base mb-1" style={{ color: sel ? '#FFFDF8' : '#2C1810' }}>{cfg.label}</div>
                  <div className="text-xs leading-snug" style={{ color: sel ? 'rgba(255,253,248,0.8)' : '#8B7355' }}>{cfg.description}</div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Wedding Days ── */}
        <section>
          <SectionLabel>Number of Wedding Days <Required /></SectionLabel>
          <div className="flex items-center gap-4">
            <StepBtn onClick={() => setDays(form.days - 1)} label="−" bg="#F0E8D8" color={primary} />
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold font-display" style={{ color: primary }}>{form.days}</div>
              <div className="text-xs" style={{ color: '#8B7355' }}>day{form.days !== 1 ? 's' : ''}</div>
            </div>
            <StepBtn onClick={() => setDays(form.days + 1)} label="+" bg={primary} color="#FFFDF8" />
          </div>
          {errors.days && <p className="text-sm mt-2" style={{ color: '#DC2626' }}>{errors.days}</p>}
          <p className="text-xs mt-2" style={{ color: '#8B7355' }}>Typical: Gaye Holud (1) + Wedding (1) + Bou Bhaat (1) = 3 days</p>
        </section>

        {/* ── Season ── */}
        <section>
          <SectionLabel>Wedding Season</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.entries(SEASON_CONFIGS) as [Season, typeof SEASON_CONFIGS[Season]][]).map(([key, cfg]) => {
              const sel = form.season === key;
              return (
                <button key={key} type="button" onClick={() => setForm((f) => ({ ...f, season: key }))}
                  className="rounded-xl p-3 border text-center transition-all"
                  style={{ borderColor: sel ? '#C8920A' : '#E8D5B0', background: sel ? '#FFF8E7' : '#FFFDF8' }}>
                  <div className="text-xl mb-1">{cfg.emoji}</div>
                  <div className="text-sm font-semibold" style={{ color: sel ? primary : '#2C1810' }}>{cfg.label}</div>
                  <div className="text-xs mt-0.5" style={{ color: '#8B7355' }}>{cfg.description}</div>
                  <div className="text-xs font-bold mt-1" style={{ color: cfg.multiplier >= 1 ? '#DC2626' : '#059669' }}>
                    {cfg.multiplier >= 1 ? `+${Math.round((cfg.multiplier - 1) * 100)}%` : `−${Math.round((1 - cfg.multiplier) * 100)}%`}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Location with GPS ── */}
        <section>
          <SectionLabel>City / Location <span className="text-sm font-normal" style={{ color: '#8B7355' }}>(optional)</span></SectionLabel>

          {/* GPS detect button */}
          <div className="mb-3">
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={geoStatus === 'detecting'}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
              style={{
                borderColor: geoStatus === 'success' ? '#059669' : geoStatus === 'denied' || geoStatus === 'error' ? '#DC2626' : '#C8920A',
                color: geoStatus === 'success' ? '#059669' : geoStatus === 'denied' || geoStatus === 'error' ? '#DC2626' : '#C8920A',
                background: geoStatus === 'detecting' ? 'rgba(200,146,10,0.06)' : 'transparent',
                opacity: geoStatus === 'detecting' ? 0.8 : 1,
              }}
            >
              {geoStatus === 'detecting' ? (
                <><Spinner /> Detecting location…</>
              ) : geoStatus === 'success' ? (
                <><span>✓</span> Detected: {detectedCity}</>
              ) : geoStatus === 'denied' ? (
                <><span>🚫</span> Location permission denied</>
              ) : geoStatus === 'error' ? (
                <><span>⚠️</span> Could not detect location</>
              ) : (
                <><span>📍</span> Detect My Location (GPS)</>
              )}
            </button>
            {(geoStatus === 'denied' || geoStatus === 'error') && (
              <p className="text-xs mt-1.5" style={{ color: '#8B7355' }}>
                {geoStatus === 'denied'
                  ? 'Please allow location access in your browser settings, then try again.'
                  : 'Select your city manually below.'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {LOCATIONS.map(([key, cfg]) => {
              const sel = form.location === key;
              return (
                <button key={key} type="button" onClick={() => setForm((f) => ({ ...f, location: key }))}
                  className="py-2.5 px-3 rounded-xl border text-sm font-medium transition-colors text-center"
                  style={{ borderColor: sel ? '#C8920A' : '#E8D5B0', background: sel ? '#FFF8E7' : '#FFFDF8', color: sel ? primary : '#5C3A1E' }}>
                  {cfg.label}
                  {cfg.multiplier !== 1 && (
                    <span className="block text-xs" style={{ color: '#C8920A' }}>×{cfg.multiplier.toFixed(2)}</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Ceremonies ── */}
        <section>
          <SectionLabel>Special Ceremonies <span className="text-sm font-normal" style={{ color: '#8B7355' }}>(optional add-ons)</span></SectionLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.entries(CEREMONY_CONFIGS) as [CeremonyKey, typeof CEREMONY_CONFIGS[CeremonyKey]][]).map(([key, cfg]) => {
              const sel = form.ceremonies.includes(key);
              return (
                <button key={key} type="button" onClick={() => toggleCeremony(key)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all"
                  style={{ borderColor: sel ? '#9333EA' : '#E8D5B0', background: sel ? 'rgba(147,51,234,0.06)' : '#FFFDF8' }}>
                  <span className="text-2xl shrink-0">{cfg.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm" style={{ color: sel ? '#9333EA' : '#2C1810' }}>{cfg.label}</div>
                    <div className="text-xs" style={{ color: '#8B7355' }}>{cfg.description}</div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                    style={{ borderColor: sel ? '#9333EA' : '#E8D5B0', background: sel ? '#9333EA' : 'transparent' }}>
                    {sel && <span className="text-xs text-white font-bold">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Additional Requirements ── */}
        <section>
          <SectionLabel>Additional Requirements <span className="text-sm font-normal" style={{ color: '#8B7355' }}>(optional)</span></SectionLabel>
          <textarea
            value={form.additionalRequirements}
            onChange={(e) => setForm((f) => ({ ...f, additionalRequirements: e.target.value }))}
            rows={3}
            placeholder="e.g. Live band, drone photography, international guests, specific décor theme..."
            className="w-full rounded-xl px-4 py-3 border-2 text-sm resize-none"
            style={{ borderColor: '#E8D5B0', background: '#FFFDF8', color: '#2C1810' }}
          />
        </section>

        <button type="submit" className="w-full py-4 rounded-2xl text-lg font-semibold shadow-lg transition-all duration-200 active:scale-95"
          style={{ background: `linear-gradient(135deg, ${primary}, #B02238)`, color: '#FFFDF8' }}>
          Calculate Budget ✦
        </button>
      </form>
    </div>
  );
}

// ── Small reusable sub-components ──────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="block font-display text-lg font-semibold mb-3" style={{ color: '#2C1810' }}>{children}</label>;
}

function Required() {
  return <span style={{ color: '#8B1A2B' }}> *</span>;
}

function StepBtn({ onClick, label, bg, color }: { onClick: () => void; label: string; bg: string; color: string }) {
  return (
    <button type="button" onClick={onClick}
      className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold transition-colors shrink-0"
      style={{ background: bg, color }}>
      {label}
    </button>
  );
}

function QuickPills({ values, current, onSelect, primary }: { values: number[]; current: number; onSelect: (v: number) => void; primary: string }) {
  return (
    <div className="flex gap-2 mt-3 flex-wrap">
      {values.map((n) => (
        <button key={n} type="button" onClick={() => onSelect(n)}
          className="text-xs px-3 py-1.5 rounded-full border transition-colors"
          style={{
            borderColor: current === n ? primary : '#E8D5B0',
            color: current === n ? '#FFFDF8' : '#8B7355',
            background: current === n ? primary : 'transparent',
          }}>{n}</button>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width={14} height={14} viewBox="0 0 14 14" fill="none">
      <circle cx={7} cy={7} r={6} stroke="currentColor" strokeWidth={2} strokeOpacity={0.3} />
      <path d="M7 1a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
