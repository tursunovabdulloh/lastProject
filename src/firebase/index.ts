// firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNMn0b0SHZi2fzf6E5-mzkB7PHebXbWtE",
  authDomain: "e-commerce-afe86.firebaseapp.com",
  projectId: "e-commerce-afe86",
  storageBucket: "e-commerce-afe86.appspot.com",
  messagingSenderId: "11409749467",
  appId: "1:11409749467:web:716f9eda5342d9aab923fe",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
