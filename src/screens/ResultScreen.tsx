import { useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import type { CalculationResult, SavedEstimate } from '../types';
import { CATEGORY_LABELS, STYLE_CONFIGS, LOCATION_CONFIGS } from '../config/budgetConfig';
import { formatINR, formatINRCompact, formatDate, formatPercent } from '../utils/formatter';
import { generateId } from '../utils/storage';

interface ResultScreenProps {
  result: CalculationResult;
  onEdit: () => void;
  onRecalculate: () => void;
  onSave: (estimate: SavedEstimate) => void;
  isSaved: boolean;
}

const CHART_COLORS = Object.values(CATEGORY_LABELS).map((c) => c.color);

export default function ResultScreen({ result, onEdit, onRecalculate, onSave, isSaved }: ResultScreenProps) {
  const [saveName, setSaveName] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saved, setSaved] = useState(isSaved);

  const { total, breakdown, formData } = result;
  const styleConfig = STYLE_CONFIGS[formData.style];
  const locationConfig = LOCATION_CONFIGS[formData.location];
  const costPerGuest = Math.round(total / formData.guests);

  const pieData = Object.entries(breakdown).map(([key, value]) => ({
    name: CATEGORY_LABELS[key]?.label ?? key,
    value,
    color: CATEGORY_LABELS[key]?.color ?? '#999',
  }));

  const barData = Object.entries(breakdown)
    .sort(([, a], [, b]) => b - a)
    .map(([key, value]) => ({
      name: CATEGORY_LABELS[key]?.label?.split(' ')[0] ?? key,
      value,
      fill: CATEGORY_LABELS[key]?.color ?? '#999',
    }));

  function handleSave() {
    const name = saveName.trim() || `${styleConfig.label} Wedding – ${formData.guests} guests`;
    const estimate: SavedEstimate = { ...result, id: generateId(), name, calculatedAt: new Date().toISOString() };
    onSave(estimate);
    setSaved(true);
    setShowSaveModal(false);
  }

  function handleShare() {
    const text = `Bengali Wedding Budget Estimate\nStyle: ${styleConfig.label}\nGuests: ${formData.guests}\nTotal: ${formatINR(total)}\nCalculated on ${formatDate(result.calculatedAt)}`;
    if (navigator.share) {
      navigator.share({ title: 'Wedding Budget Estimate', text });
    } else {
      navigator.clipboard.writeText(text).then(() => alert('Estimate copied to clipboard!'));
    }
  }

  function handlePrint() {
    window.print();
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-xl px-3 py-2 shadow-lg text-sm" style={{ background: '#FFFDF8', border: '1px solid #E8D5B0', color: '#2C1810' }}>
        <div className="font-semibold">{payload[0].name}</div>
        <div style={{ color: '#8B1A2B' }}>{formatINR(payload[0].value)}</div>
        <div className="text-xs" style={{ color: '#8B7355' }}>{formatPercent(payload[0].value, total)}</div>
      </div>
    );
  };

  return (
    <div className="min-h-full" style={{ background: '#FDF8F0' }}>
      {/* Print-only header */}
      <div className="print-only p-6 border-b mb-4" style={{ borderColor: '#E8D5B0' }}>
        <h1 className="font-display text-2xl font-bold" style={{ color: '#8B1A2B' }}>Bengali Wedding Budget Estimator</h1>
        <p className="text-sm" style={{ color: '#8B7355' }}>Estimated on {formatDate(result.calculatedAt)}</p>
      </div>

      {/* Header */}
      <div className="no-print sticky top-0 z-20 flex items-center gap-4 px-4 py-4 sm:px-6 border-b" style={{ background: '#FDF8F0', borderColor: '#E8D5B0' }}>
        <button onClick={onEdit} className="w-9 h-9 flex items-center justify-center rounded-full transition-colors" style={{ background: '#F0E8D8', color: '#8B1A2B' }}>←</button>
        <div className="flex-1">
          <h2 className="font-display font-bold text-xl" style={{ color: '#8B1A2B' }}>Your Estimate</h2>
          <p className="text-xs" style={{ color: '#8B7355' }}>Calculated {formatDate(result.calculatedAt)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleShare} className="text-xs px-3 py-2 rounded-lg border font-medium" style={{ borderColor: '#E8D5B0', color: '#8B7355' }}>Share</button>
          <button onClick={handlePrint} className="text-xs px-3 py-2 rounded-lg border font-medium" style={{ borderColor: '#E8D5B0', color: '#8B7355' }}>Print</button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24">

        {/* Total budget hero */}
        <div className="rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #8B1A2B 0%, #B02238 60%, #C8920A 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, white 1px, transparent 0), radial-gradient(circle at 80% 80%, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          <p className="text-sm font-medium mb-1 opacity-80" style={{ color: '#F5E6C8' }}>Estimated Total Budget</p>
          <div className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{ color: '#FFFDF8' }}>
            {formatINR(total)}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Style', value: `${styleConfig.emoji} ${styleConfig.label}` },
              { label: 'Guests', value: formData.guests.toString() },
              { label: 'Days', value: formData.days.toString() },
              { label: 'City', value: locationConfig.label },
              { label: 'Per Guest', value: formatINRCompact(costPerGuest) },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl px-4 py-2 text-center" style={{ background: 'rgba(255,253,248,0.15)' }}>
                <div className="text-xs opacity-70" style={{ color: '#F5E6C8' }}>{label}</div>
                <div className="font-semibold text-sm" style={{ color: '#FFFDF8' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts — side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Donut chart */}
          <div className="rounded-2xl p-5 border" style={{ background: '#FFFDF8', borderColor: '#E8D5B0' }}>
            <h3 className="font-display font-semibold text-base mb-4" style={{ color: '#2C1810' }}>Expense Distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar chart */}
          <div className="rounded-2xl p-5 border" style={{ background: '#FFFDF8', borderColor: '#E8D5B0' }}>
            <h3 className="font-display font-semibold text-base mb-4" style={{ color: '#2C1810' }}>Category Comparison</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} layout="vertical" margin={{ left: 8, right: 24 }}>
                <XAxis type="number" tickFormatter={(v) => formatINRCompact(v)} tick={{ fontSize: 10, fill: '#8B7355' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#5C3A1E' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown table */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFDF8', borderColor: '#E8D5B0' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: '#E8D5B0' }}>
            <h3 className="font-display font-semibold text-base" style={{ color: '#2C1810' }}>Detailed Breakdown</h3>
          </div>
          <div className="divide-y" style={{ borderColor: '#E8D5B0' }}>
            {Object.entries(breakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([key, value]) => {
                const cat = CATEGORY_LABELS[key];
                const pct = Math.round((value / total) * 100);
                return (
                  <div key={key} className="flex items-center gap-3 px-5 py-3.5">
                    <span className="text-xl w-7 text-center">{cat?.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm" style={{ color: '#2C1810' }}>{cat?.label}</div>
                      <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F0E8D8' }}>
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cat?.color }} />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-semibold text-sm" style={{ color: '#8B1A2B' }}>{formatINR(value)}</div>
                      <div className="text-xs" style={{ color: '#8B7355' }}>{pct}%</div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="px-5 py-4 flex items-center justify-between border-t" style={{ borderColor: '#C8920A', background: 'rgba(200,146,10,0.06)' }}>
            <span className="font-display font-bold" style={{ color: '#2C1810' }}>Total Estimate</span>
            <span className="font-display font-bold text-xl" style={{ color: '#8B1A2B' }}>{formatINR(total)}</span>
          </div>
        </div>

        {/* Notes */}
        {formData.additionalRequirements && (
          <div className="rounded-2xl p-4 border" style={{ background: '#FFF8E7', borderColor: '#E8D5B0' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: '#C8920A' }}>ADDITIONAL REQUIREMENTS</p>
            <p className="text-sm" style={{ color: '#5C3A1E' }}>{formData.additionalRequirements}</p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rounded-2xl p-4 border" style={{ background: '#F0E8D8', borderColor: '#E8D5B0' }}>
          <p className="text-xs" style={{ color: '#8B7355' }}>
            <strong style={{ color: '#5C3A1E' }}>Disclaimer:</strong> This is an estimated budget. Actual wedding costs may vary depending on location, vendors, season, and specific requirements. Always get multiple quotes from vendors.
          </p>
        </div>

        {/* Action buttons */}
        <div className="no-print grid grid-cols-2 gap-3">
          <button
            onClick={onEdit}
            className="py-3.5 rounded-xl font-semibold border text-sm transition-colors"
            style={{ borderColor: '#8B1A2B', color: '#8B1A2B', background: 'transparent' }}
          >Edit Inputs</button>
          <button
            onClick={onRecalculate}
            className="py-3.5 rounded-xl font-semibold text-sm transition-colors"
            style={{ background: '#F0E8D8', color: '#8B1A2B' }}
          >Recalculate</button>
          <button
            onClick={() => !saved && setShowSaveModal(true)}
            className="py-3.5 rounded-xl font-semibold text-sm transition-colors col-span-2"
            style={{
              background: saved ? '#059669' : 'linear-gradient(135deg, #8B1A2B, #B02238)',
              color: '#FFFDF8',
            }}
          >{saved ? '✓ Estimate Saved' : 'Save Estimate'}</button>
        </div>
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-4" style={{ background: 'rgba(44,24,16,0.6)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 space-y-4 shadow-2xl" style={{ background: '#FFFDF8' }}>
            <h3 className="font-display font-bold text-lg" style={{ color: '#8B1A2B' }}>Name This Estimate</h3>
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder={`${styleConfig.label} Wedding – ${formData.guests} guests`}
              className="w-full rounded-xl px-4 py-3 border-2 text-sm"
              style={{ borderColor: '#E8D5B0', background: '#FFFDF8', color: '#2C1810' }}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowSaveModal(false)} className="flex-1 py-3 rounded-xl font-medium text-sm border" style={{ borderColor: '#E8D5B0', color: '#8B7355' }}>Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl font-semibold text-sm" style={{ background: '#8B1A2B', color: '#FFFDF8' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
