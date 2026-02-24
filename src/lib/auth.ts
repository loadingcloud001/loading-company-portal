import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'portal-auth-token';
const SALT_ROUNDS = 12;

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  contactName: string;
}

/**
 * Hash a password using bcrypt with 12 salt rounds.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Get the authenticated user from the auth cookie.
 * When called from an API route, pass the NextRequest to read the cookie from it.
 * When called from a server component (no request param), uses next/headers cookies().
 */
export async function getAuthUser(request?: NextRequest): Promise<AuthUser | null> {
  try {
    let cookieValue: string | undefined;

    if (request) {
      cookieValue = request.cookies.get(COOKIE_NAME)?.value;
    } else {
      const cookieStore = await cookies();
      cookieValue = cookieStore.get(COOKIE_NAME)?.value;
    }

    if (!cookieValue) {
      return null;
    }

    const user: AuthUser = JSON.parse(cookieValue);

    if (!user.id || !user.email || !user.role || !user.contactName) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

/**
 * Set the auth cookie on a NextResponse with user data.
 */
export function setAuthCookie(response: NextResponse, user: AuthUser): void {
  response.cookies.set(COOKIE_NAME, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear the auth cookie from a NextResponse.
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
