import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB3_XngHXb5manfF4xt9-4nocsjGylrt1k",
  authDomain: "hemira-7716d.firebaseapp.com",
  projectId: "hemira-7716d",
  storageBucket: "hemira-7716d.firebasestorage.app",
  messagingSenderId: "728639845854",
  appId: "1:728639845854:web:331943950c03163dad594f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;
