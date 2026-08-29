import type { SavedEstimate } from '../types';
import { STYLE_CONFIGS, LOCATION_CONFIGS } from '../config/budgetConfig';
import { formatINR, formatDate } from '../utils/formatter';

interface SavedEstimatesScreenProps {
  estimates: SavedEstimate[];
  onView: (estimate: SavedEstimate) => void;
  onDelete: (id: string) => void;
  onRecalculate: (estimate: SavedEstimate) => void;
  onBack: () => void;
}

export default function SavedEstimatesScreen({
  estimates,
  onView,
  onDelete,
  onRecalculate,
  onBack,
}: SavedEstimatesScreenProps) {
  return (
    <div className="min-h-full" style={{ background: '#FDF8F0' }}>
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-4 px-4 py-4 sm:px-6 border-b" style={{ background: '#FDF8F0', borderColor: '#E8D5B0' }}>
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: '#F0E8D8', color: '#8B1A2B' }}>←</button>
        <div>
          <h2 className="font-display font-bold text-xl" style={{ color: '#8B1A2B' }}>Saved Estimates</h2>
          <p className="text-xs" style={{ color: '#8B7355' }}>{estimates.length} estimate{estimates.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4 pb-24">
        {estimates.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="font-display text-xl font-semibold mb-2" style={{ color: '#2C1810' }}>No saved estimates yet</h3>
            <p className="text-sm" style={{ color: '#8B7355' }}>Calculate a budget and save it to see it here.</p>
            <button
              onClick={onBack}
              className="mt-6 px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ background: '#8B1A2B', color: '#FFFDF8' }}
            >Start Estimating</button>
          </div>
        ) : (
          estimates.map((estimate) => {
            const styleCfg = STYLE_CONFIGS[estimate.formData.style];
            const locationCfg = LOCATION_CONFIGS[estimate.formData.location];
            return (
              <div
                key={estimate.id}
                className="rounded-2xl border overflow-hidden card-hover"
                style={{ background: '#FFFDF8', borderColor: '#E8D5B0' }}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-semibold text-base leading-snug mb-1" style={{ color: '#2C1810' }}>
                        {estimate.name}
                      </div>
                      <div className="text-xs" style={{ color: '#8B7355' }}>{formatDate(estimate.calculatedAt)}</div>
                    </div>
                    <div className="font-display font-bold text-lg shrink-0" style={{ color: '#8B1A2B' }}>
                      {formatINR(estimate.total)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(139,26,43,0.08)', color: '#8B1A2B' }}>
                      {styleCfg.emoji} {styleCfg.label}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(200,146,10,0.08)', color: '#C8920A' }}>
                      👥 {estimate.formData.guests} guests
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#F0E8D8', color: '#5C3A1E' }}>
                      📅 {estimate.formData.days} day{estimate.formData.days !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: '#F0E8D8', color: '#5C3A1E' }}>
                      📍 {locationCfg.label}
                    </span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => onView(estimate)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      style={{ background: '#8B1A2B', color: '#FFFDF8' }}
                    >View</button>
                    <button
                      onClick={() => onRecalculate(estimate)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors"
                      style={{ borderColor: '#E8D5B0', color: '#5C3A1E', background: 'transparent' }}
                    >Edit & Recalculate</button>
                    <button
                      onClick={() => {
                        if (window.confirm('Delete this estimate?')) onDelete(estimate.id);
                      }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors"
                      style={{ borderColor: '#E8D5B0', color: '#DC2626', background: 'transparent' }}
                    >🗑</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
