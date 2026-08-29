import { useState } from 'react';
import type { User } from '../types';
import { getInitials } from '../utils/auth';

const PROVIDER_COLORS: Record<string, string> = {
  google:   '#EA4335',
  facebook: '#1877f2',
  github:   '#24292e',
  apple:    '#000000',
  email:    '#8B1A2B',
  guest:    '#8B7355',
};

interface UserAvatarProps {
  user: User;
  onSignOut: () => void;
}

export default function UserAvatar({ user, onSignOut }: UserAvatarProps) {
  const [open, setOpen] = useState(false);
  const initials = getInitials(user.name);
  const color = PROVIDER_COLORS[user.provider] ?? '#8B1A2B';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
        style={{ background: color, color: '#ffffff', borderColor: `${color}40` }}
        title={user.name}
      >
        {initials}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-60 rounded-2xl border shadow-xl overflow-hidden"
            style={{ background: '#FFFDF8', borderColor: '#E8D5B0' }}>
            {/* User info */}
            <div className="px-4 py-4 border-b" style={{ borderColor: '#E8D5B0', background: '#FDF8F0' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ background: color, color: '#ffffff' }}>
                  {initials}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: '#2C1810' }}>{user.name}</div>
                  <div className="text-xs truncate" style={{ color: '#8B7355' }}>{user.email}</div>
                  {user.isGuest && (
                    <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: '#F0E8D8', color: '#8B7355' }}>Guest</span>
                  )}
                </div>
              </div>
            </div>

            {/* Provider badge */}
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: '#E8D5B0' }}>
              <span className="text-xs" style={{ color: '#8B7355' }}>Signed in via</span>
              <span className="text-xs font-semibold capitalize" style={{ color }}>
                {user.provider === 'guest' ? 'Guest mode' : user.provider}
              </span>
            </div>

            {/* Sign out */}
            <div className="px-4 py-3">
              <button
                onClick={() => { setOpen(false); onSignOut(); }}
                className="w-full py-2 rounded-xl text-sm font-medium border transition-colors"
                style={{ borderColor: '#E8D5B0', color: '#DC2626', background: 'transparent' }}
              >
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
