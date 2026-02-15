
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZGhph9_0vmNb3Rbliinte2qbnZXzL7vA",
  authDomain: "citadel-cbt.firebaseapp.com",
  projectId: "citadel-cbt",
  storageBucket: "citadel-cbt.firebasestorage.app",
  messagingSenderId: "281326814188",
  appId: "1:281326814188:web:aa669b94489a53bee636c9",
  measurementId: "G-5LY87H2H5E"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
