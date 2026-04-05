// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// 🟢 1. Import initializeFirestore and cache managers (removed getFirestore)
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCdgmCt8jhJMy5rjWRbwDX8QNyZucxO3Eg",
  authDomain: "lexcasusv2.firebaseapp.com",
  projectId: "lexcasusv2",
  storageBucket: "lexcasusv2.firebasestorage.app",
  messagingSenderId: "304653456512",
  appId: "1:304653456512:web:e7def4c21fcfa0724f4265"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const storage = getStorage(app);

// 🟢 2. Initialize Firestore WITH persistent local cache enabled across multiple tabs
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

export default app;