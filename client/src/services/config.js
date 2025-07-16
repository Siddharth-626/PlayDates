
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD1cILa3XoxSKuuZEX8nubb5NADXC10tV4",
  authDomain: "playdates-dev.firebaseapp.com",
  projectId: "playdates-dev",
  storageBucket: "playdates-dev.firebasestorage.app",
  messagingSenderId: "783542384285",
  appId: "1:783542384285:web:58ad67de26a6a33d1ac674"
};



const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
