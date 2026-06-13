import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getAuth } from "firebase/auth";
// @ts-ignore
import { getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBlbYAyEcKJfmHnSzXzAtDnJECS1IM9iuY",
  authDomain: "tactica-backend.firebaseapp.com",
  projectId: "tactica-backend",
  storageBucket: "tactica-backend.firebasestorage.app",
  messagingSenderId: "749983115247",
  appId: "1:749983115247:web:99314e2040bff8bd76781a"
};

// Initialize Firebase safely
let app;
let authInstance;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  authInstance = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
} else {
  app = getApp();
  try {
    authInstance = getAuth(app);
  } catch (error) {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
}

export const auth = authInstance;

export const db = getFirestore(app);