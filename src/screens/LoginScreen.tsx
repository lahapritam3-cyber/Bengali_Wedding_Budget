import { useState } from 'react';
import type { AuthProvider, User } from '../types';
import { signInMock } from '../utils/auth';
import { LotusMotif, AlpanaCorner } from '../components/AlpanaDecoration';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

interface ProviderConfig {
  id: AuthProvider;
  label: string;
  bg: string;
  color: string;
  border: string;
  icon: React.ReactNode;
}

const PROVIDERS: ProviderConfig[] = [
  {
    id: 'google',
    label: 'Continue with Google',
    bg: '#ffffff',
    color: '#3c4043',
    border: '#dadce0',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Continue with Facebook',
    bg: '#1877f2',
    color: '#ffffff',
    border: '#1877f2',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="#ffffff">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'Continue with GitHub',
    bg: '#24292e',
    color: '#ffffff',
    border: '#24292e',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="#ffffff">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    id: 'apple',
    label: 'Continue with Apple',
    bg: '#000000',
    color: '#ffffff',
    border: '#000000',
    icon: (
      <svg width={20} height={20} viewBox="0 0 24 24" fill="#ffffff">
        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
      </svg>
    ),
  },
];

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [loading, setLoading] = useState<AuthProvider | null>(null);
  const [showNote, setShowNote] = useState(false);

  async function handleProviderLogin(provider: AuthProvider) {
    setLoading(provider);
    setShowNote(true);
    // Simulate OAuth redirect delay
    await new Promise((r) => setTimeout(r, 1200));
    const user = signInMock(provider);
    onLogin(user);
    setLoading(null);
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #FDF8F0 0%, #F5E6C8 40%, #FDF8F0 100%)' }}>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 pointer-events-none"><AlpanaCorner size={140} color="#C8920A" opacity={0.22} /></div>
      <div className="absolute top-0 right-0 pointer-events-none"><AlpanaCorner size={140} color="#8B1A2B" opacity={0.16} flip /></div>
      <div className="absolute bottom-0 left-0 pointer-events-none" style={{ transform: 'rotate(90deg) scaleX(-1)' }}><AlpanaCorner size={120} color="#C8920A" opacity={0.14} /></div>
      <div className="absolute bottom-0 right-0 pointer-events-none" style={{ transform: 'rotate(180deg)' }}><AlpanaCorner size={120} color="#8B1A2B" opacity={0.12} /></div>

      <div className="relative z-10 w-full max-w-sm px-6 py-8 flex flex-col items-center">

        {/* Logo */}
        <div className="mb-4">
          <LotusMotif size={80} color="#C8920A" opacity={0.95} />
        </div>

        {/* Title */}
        <h1 className="font-display text-2xl font-bold text-center mb-1" style={{ color: '#8B1A2B' }}>
          Bengali Wedding
        </h1>
        <h2 className="font-display text-xl font-semibold text-center mb-2" style={{ color: '#C8920A' }}>
          Budget Estimator
        </h2>
        <p className="text-sm text-center mb-8" style={{ color: '#8B7355' }}>
          Sign in to save your estimates across devices
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full mb-6">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, #E8D5B0)' }} />
          <span className="text-xs font-medium" style={{ color: '#C8920A' }}>✦ Sign in ✦</span>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, #E8D5B0)' }} />
        </div>

        {/* Provider buttons */}
        <div className="w-full space-y-3">
          {PROVIDERS.map((p) => (
            <button
              key={p.id}
              onClick={() => handleProviderLogin(p.id)}
              disabled={loading !== null}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-70"
              style={{
                background: loading === p.id ? `${p.bg}dd` : p.bg,
                color: p.color,
                borderColor: p.border,
                boxShadow: '0 1px 3px rgba(44,24,16,0.08)',
              }}
            >
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                {loading === p.id ? <SmallSpinner color={p.color} /> : p.icon}
              </span>
              <span className="flex-1 text-center">
                {loading === p.id ? 'Signing in…' : p.label}
              </span>
            </button>
          ))}
        </div>

        {/* Demo note */}
        {showNote && (
          <div className="mt-4 p-3 rounded-xl text-xs text-center w-full" style={{ background: 'rgba(200,146,10,0.1)', border: '1px solid rgba(200,146,10,0.3)', color: '#8B7355' }}>
            <strong style={{ color: '#C8920A' }}>Demo mode:</strong> Connect Supabase for real Google/Facebook/Apple OAuth login with cross-device sync.
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3 w-full my-5">
          <div className="flex-1 h-px" style={{ background: '#E8D5B0' }} />
          <span className="text-xs" style={{ color: '#8B7355' }}>or</span>
          <div className="flex-1 h-px" style={{ background: '#E8D5B0' }} />
        </div>

        {/* Guest */}
        <button
          onClick={() => handleProviderLogin('guest')}
          disabled={loading !== null}
          className="w-full py-3 rounded-xl border text-sm font-medium transition-all duration-200 active:scale-95"
          style={{ borderColor: '#E8D5B0', color: '#8B7355', background: 'transparent' }}
        >
          {loading === 'guest' ? 'Loading…' : 'Continue as Guest  →'}
        </button>

        <p className="text-xs text-center mt-6 px-2" style={{ color: '#8B7355' }}>
          By continuing you agree that this app stores data locally on your device. No personal data is sent to any server.
        </p>
      </div>
    </div>
  );
}

function SmallSpinner({ color }: { color: string }) {
  return (
    <svg className="animate-spin" width={16} height={16} viewBox="0 0 16 16" fill="none">
      <circle cx={8} cy={8} r={7} stroke={color} strokeWidth={2} strokeOpacity={0.3} />
      <path d="M8 1a7 7 0 0 1 7 7" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}
