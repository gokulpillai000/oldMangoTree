import { cookies } from 'next/headers';

export interface UserSession {
  email: string;
  name: string;
  role: 'publisher' | 'reader';
  authenticatedAt: string;
}

const COOKIE_NAME = 'omt_auth_session';

// Dynamic publisher account store
const REGISTERED_USERS: Record<string, { name: string; passwordHash: string; role: 'publisher' | 'reader' }> = {
  'editor@oldmangotree.media': {
    name: 'Kamalram Sajeev',
    passwordHash: 'editor123',
    role: 'publisher',
  },
  'manila@oldmangotree.media': {
    name: 'Manila C. Mohan',
    passwordHash: 'publisher123',
    role: 'publisher',
  },
};

export function registerUser(email: string, pass: string, name?: string): UserSession | { error: string } {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { error: 'Please enter a valid email address.' };
  }
  if (!pass || pass.length < 3) {
    return { error: 'Password must be at least 3 characters long.' };
  }

  const displayName = name && name.trim() ? name.trim() : cleanEmail.split('@')[0];
  const capitalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

  // Store in user database
  REGISTERED_USERS[cleanEmail] = {
    name: capitalizedName,
    passwordHash: pass,
    role: 'publisher',
  };

  return {
    email: cleanEmail,
    name: capitalizedName,
    role: 'publisher',
    authenticatedAt: new Date().toISOString(),
  };
}

export function authenticateUser(email: string, pass: string): UserSession | { error: string } {
  const cleanEmail = email.toLowerCase().trim();
  const account = REGISTERED_USERS[cleanEmail];

  if (!account) {
    // Auto-register new accounts seamlessly on sign in if valid
    return registerUser(cleanEmail, pass);
  }

  if (account.passwordHash !== pass) {
    return { error: 'Incorrect password for this account.' };
  }

  return {
    email: cleanEmail,
    name: account.name,
    role: account.role,
    authenticatedAt: new Date().toISOString(),
  };
}

export function getCurrentSession(): UserSession | null {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  if (!sessionCookie || !sessionCookie.value) return null;

  try {
    const sessionData = JSON.parse(sessionCookie.value) as UserSession;
    return sessionData;
  } catch (err) {
    return null;
  }
}

export function isPublisherAuthenticated(): boolean {
  const session = getCurrentSession();
  return session !== null && session.role === 'publisher';
}
