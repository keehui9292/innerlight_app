import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration for web
const firebaseConfig = {
  apiKey: "AIzaSyDtzDlumtiP_BoobI4v7x6qpFF9tHdKZf4",
  authDomain: "innerlight-193e2.firebaseapp.com",
  projectId: "innerlight-193e2",
  storageBucket: "innerlight-193e2.firebasestorage.app",
  messagingSenderId: "621600392235",
  appId: "1:621600392235:web:4a5975277102fc49dd966e",
  measurementId: "G-KSDTSM69XV"
};

// Initialize Firebase
// Check if app is already initialized to avoid duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
