import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // We will need this for your Create Account screen!

// Your specific Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlbYAyeCkJfmHnSzXzAtDnJECS1IM9iuY",
  authDomain: "tactica-backend.firebaseapp.com",
  projectId: "tactica-backend",
  storageBucket: "tactica-backend.firebasestorage.app",
  messagingSenderId: "749983115247",
  appId: "1:749983115247:web:99314e2040bff8bd76781a"
};

// Initialize the Firebase Engine
const app = initializeApp(firebaseConfig);

// Initialize Database & Authentication and export them
export const db = getFirestore(app);
export const auth = getAuth(app);