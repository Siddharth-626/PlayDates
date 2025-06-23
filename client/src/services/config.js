
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDewxvOei022tWTHQIEhmI7N8nf14xWGuM",
  authDomain: "playdates-577a0.firebaseapp.com",
  projectId: "playdates-577a0",
  storageBucket: "playdates-577a0.appspot.com", // ✅ fixed
  messagingSenderId: "20671397246",
  appId: "1:20671397246:web:c20476d3960860dbc9c72f",
  measurementId: "G-9WQ8TH0PQE",
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
