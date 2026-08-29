import type { AuthProvider, User } from '../types';

const USER_KEY = 'bengali-wedding-user';

// Mock names used for demo/guest flows
const DEMO_NAMES: Record<AuthProvider, string> = {
  google:   'Google User',
  facebook: 'Facebook User',
  github:   'GitHub User',
  apple:    'Apple User',
  email:    'Email User',
  guest:    'Guest',
};

const DEMO_EMAILS: Record<AuthProvider, string> = {
  google:   'user@gmail.com',
  facebook: 'user@facebook.com',
  github:   'user@github.com',
  apple:    'user@icloud.com',
  email:    'user@example.com',
  guest:    'guest@local',
};

export function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function signInMock(provider: AuthProvider): User {
  const user: User = {
    id: `${provider}-${Date.now()}`,
    name: DEMO_NAMES[provider],
    email: DEMO_EMAILS[provider],
    provider,
    loginAt: new Date().toISOString(),
    isGuest: provider === 'guest',
  };
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function signOut(): void {
  localStorage.removeItem(USER_KEY);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
}
