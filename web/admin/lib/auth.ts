import { getAdminDb } from './firebaseAdmin';
import { cookies } from 'next/headers';
import * as admin from 'firebase-admin';

/**
 * Server-side helper to verify a Firebase ID token or session cookie.
 * In a real app, you'd check for a 'session' cookie set during login.
 */
export async function verifyAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    // If we haven't initialized firebase-admin yet, getAdminDb() will do it
    getAdminDb();
    
    // Verify the session cookie (requires 'firebase-admin')
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}

/**
 * API route guard helper
 */
export async function requireAuth() {
  const user = await verifyAuth();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
