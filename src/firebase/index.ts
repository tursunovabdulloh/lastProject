// firebase.ts
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  collection,
  getDocs,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNMn0b0SHZi2fzf6E5-mzkB7PHebXbWtE",
  authDomain: "e-commerce-afe86.firebaseapp.com",
  projectId: "e-commerce-afe86",
  storageBucket: "e-commerce-afe86.appspot.com",
  messagingSenderId: "11409749467",
  appId: "1:11409749467:web:716f9eda5342d9aab923fe",
};

// Initialize Firebase
export const app: FirebaseApp = initializeApp(firebaseConfig);
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
