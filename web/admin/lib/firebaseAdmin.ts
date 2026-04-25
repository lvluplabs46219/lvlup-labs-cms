import * as admin from 'firebase-admin';

// We use lazy initialization to prevent the app from crashing on start 
// if environment variables are not immediately present.
let dbInstance: admin.firestore.Firestore | null = null;

export const getAdminDb = () => {
  if (dbInstance) return dbInstance;

  // Retrieve variables checking both the specific ADMIN variables and the fallbacks
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin credentials not fully configured. Database connection skipped.');
    return null;
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        // Replace escaped newlines if they get messed up in environment variables
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
  }

  dbInstance = admin.firestore();
  return dbInstance;
};
