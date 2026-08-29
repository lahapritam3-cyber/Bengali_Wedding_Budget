import type { Screen, User } from '../types';
import UserAvatar from './UserAvatar';

interface NavigationProps {
  current: Screen;
  savedCount: number;
  user: User | null;
  onChange: (screen: Screen) => void;
  onSignOut: () => void;
}

const NAV_ITEMS: { screen: Screen; label: string; icon: string }[] = [
  { screen: 'home',     label: 'Home',     icon: '🏠' },
  { screen: 'input',   label: 'Estimate', icon: '✦'  },
  { screen: 'saved',   label: 'Saved',    icon: '💾' },
  { screen: 'settings',label: 'Settings', icon: '⚙️' },
];

export default function Navigation({ current, savedCount, user, onChange, onSignOut }: NavigationProps) {
  if (current === 'home') return null;

  return (
    <>
      {/* Desktop top nav */}
      <nav className="hidden sm:flex items-center gap-1 px-6 py-3 border-b shrink-0"
        style={{ background: '#FDF8F0', borderColor: '#E8D5B0' }}>
        <div className="font-display font-bold text-base mr-6" style={{ color: '#8B1A2B' }}>
          🪷 Bengali Wedding
        </div>
        <div className="flex-1 flex items-center gap-1">
          {NAV_ITEMS.map(({ screen, label, icon }) => (
            <button key={screen} onClick={() => onChange(screen)}
              className="relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: current === screen ? 'rgba(139,26,43,0.08)' : 'transparent',
                color: current === screen ? '#8B1A2B' : '#5C3A1E',
              }}>
              <span>{icon}</span> {label}
              {screen === 'saved' && savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: '#8B1A2B', color: '#FFFDF8', fontSize: 9 }}>{savedCount}</span>
              )}
            </button>
          ))}
        </div>
        {user && <UserAvatar user={user} onSignOut={onSignOut} />}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-30 border-t flex"
        style={{ background: '#FFFDF8', borderColor: '#E8D5B0' }}>
        {NAV_ITEMS.map(({ screen, label, icon }) => (
          <button key={screen} onClick={() => onChange(screen)}
            className="relative flex-1 flex flex-col items-center py-2.5 gap-0.5 text-xs font-medium transition-colors"
            style={{ color: current === screen ? '#8B1A2B' : '#8B7355' }}>
            <span className="text-lg leading-none">{screen === 'settings' && user ? '👤' : icon}</span>
            {screen === 'settings' && user ? 'Profile' : label}
            {screen === 'saved' && savedCount > 0 && (
              <span className="absolute top-1.5 right-4 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ background: '#8B1A2B', color: '#FFFDF8', fontSize: 9 }}>{savedCount}</span>
            )}
            {current === screen && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ background: '#8B1A2B' }} />
            )}
          </button>
        ))}
      </nav>
    </>
  );
}
