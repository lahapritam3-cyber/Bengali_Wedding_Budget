import { LotusMotif, AlpanaCorner } from '../components/AlpanaDecoration';
import type { User } from '../types';

interface HomeScreenProps {
  onStart: () => void;
  onViewSaved: () => void;
  savedCount: number;
  user?: User | null;
}

export default function HomeScreen({ onStart, onViewSaved, savedCount, user }: HomeScreenProps) {
  return (
    <div className="relative min-h-full flex flex-col items-center justify-center overflow-hidden alpana-bg" style={{ background: 'linear-gradient(160deg, #FDF8F0 0%, #F5E6C8 50%, #FDF8F0 100%)' }}>
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 pointer-events-none">
        <AlpanaCorner size={160} color="#C8920A" opacity={0.25} />
      </div>
      <div className="absolute top-0 right-0 pointer-events-none">
        <AlpanaCorner size={160} color="#8B1A2B" opacity={0.18} flip />
      </div>
      <div className="absolute bottom-0 left-0 pointer-events-none" style={{ transform: 'rotate(90deg) scaleX(-1)' }}>
        <AlpanaCorner size={140} color="#C8920A" opacity={0.18} />
      </div>
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{ transform: 'rotate(180deg)' }}>
        <AlpanaCorner size={140} color="#8B1A2B" opacity={0.15} />
      </div>

      {/* Floating lotus motifs */}
      <div className="absolute top-20 right-12 pointer-events-none hidden sm:block">
        <LotusMotif size={90} color="#C8920A" opacity={0.35} />
      </div>
      <div className="absolute bottom-24 left-10 pointer-events-none hidden sm:block">
        <LotusMotif size={70} color="#8B1A2B" opacity={0.25} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-6 py-12 text-center max-w-xl w-full">
        {/* Lotus icon */}
        <div className="mb-6">
          <LotusMotif size={100} color="#C8920A" opacity={0.9} />
        </div>

        {/* Greeting */}
        {user && !user.isGuest && (
          <p className="text-sm font-medium mb-3 px-4 py-2 rounded-full" style={{ background: 'rgba(200,146,10,0.12)', color: '#8B1A2B' }}>
            Welcome back, {user.name.split(' ')[0]} 👋
          </p>
        )}

        {/* Title */}
        <h1
          className="font-display text-4xl sm:text-5xl font-bold mb-3 leading-tight"
          style={{ color: '#8B1A2B' }}
        >
          Bengali Wedding
          <br />
          <span style={{ color: '#C8920A' }}>Budget Estimator</span>
        </h1>

        {/* Tagline */}
        <p className="text-lg font-light mb-2" style={{ color: '#5C3A1E', fontFamily: 'Poppins, sans-serif' }}>
          Plan your wedding budget easily
        </p>
        <p className="text-sm mb-10" style={{ color: '#8B7355' }}>
          Estimate costs for every aspect of your dream Bengali wedding
        </p>

        {/* Horizontal ornament */}
        <div className="flex items-center gap-3 mb-10 w-full max-w-xs">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #C8920A)' }} />
          <span style={{ color: '#C8920A', fontSize: 18 }}>✦</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #C8920A)' }} />
        </div>

        {/* CTA button */}
        <button
          onClick={onStart}
          className="w-full max-w-xs py-4 rounded-2xl text-lg font-semibold shadow-lg mb-4 transition-all duration-200 active:scale-95 hover:shadow-xl"
          style={{
            background: 'linear-gradient(135deg, #8B1A2B, #B02238)',
            color: '#FFFDF8',
            letterSpacing: '0.02em',
          }}
        >
          Start Estimating ✦
        </button>

        {/* Secondary action */}
        {savedCount > 0 && (
          <button
            onClick={onViewSaved}
            className="text-sm font-medium py-2 px-6 rounded-xl border transition-colors duration-200"
            style={{ borderColor: '#C8920A', color: '#C8920A', background: 'transparent' }}
          >
            View {savedCount} Saved Estimate{savedCount !== 1 ? 's' : ''}
          </button>
        )}

        {/* Feature pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-10">
          {['11 Cost Categories', 'Multiple Styles', 'City Multipliers', 'Printable Report'].map((feat) => (
            <span
              key={feat}
              className="text-xs px-3 py-1.5 rounded-full font-medium"
              style={{ background: 'rgba(200,146,10,0.12)', color: '#8B1A2B', border: '1px solid rgba(200,146,10,0.25)' }}
            >
              {feat}
            </span>
          ))}
        </div>

        <p className="text-xs mt-8" style={{ color: '#8B7355' }}>
          All estimates are approximate. Actual costs vary by vendor, season & location.
        </p>
      </div>
    </div>
  );
}
