import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// @ts-ignore - databaseId is optional in the config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Validate connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_health_', 'connection'));
    console.log("Firebase connection successful.");
  } catch (error) {
    console.error("Firebase connection error:", error);
    if (error instanceof Error && error.message.includes('offline')) {
      console.error("Firebase is offline. This usually means the App ID or API Key in firebase-applet-config.json is incorrect for a Web application.");
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  testConnection();
}
